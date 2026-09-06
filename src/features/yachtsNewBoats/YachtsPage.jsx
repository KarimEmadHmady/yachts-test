'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useYachts } from './hooks/useYachts';
import { YachtCard } from './components/YachtCard';
import { YachtPagination } from './components/YachtPagination';
import { YachtListingHeader } from './components/YachtListingHeader';
import { brandService } from '@/services/brandService';
import { categoryService } from '@/services/categoryService';

const PAGE_SIZE = 9;

export default function YachtsPage() {
  const router = useRouter();
  const { yachts, isLoading, error, fetchYachts } = useYachts();

  const [category, setCategory] = useState('ALL');
  const [brand, setBrand] = useState('ALL');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([categoryService.list(), brandService.list()])
      .then(([categoryResult, brandResult]) => {
        setCategories(categoryResult);
        setBrands(brandResult);
      })
      .catch(() => {
        setCategories([]);
        setBrands([]);
      });
  }, []);

  useEffect(() => {
    fetchYachts({
      condition: 'new',
      ...(brand !== 'ALL'
        ? { brand_id: brand }
        : category !== 'ALL'
          ? { category_id: category }
          : {}),
    });
    setPage(1);
  }, [brand, category, fetchYachts]);

  const brandsForCategory = useMemo(() => {
    if (category === 'ALL') return brands;

    const selectedCategory = categories.find(
      (item) => String(item.id) === String(category),
    );
    const categoryBrandIds = selectedCategory?.brand_ids || [];
    return brands.filter(
      (item) => categoryBrandIds.includes(item.id),
    );
  }, [brands, categories, category]);

const filteredByCategory = useMemo(() => {
  return yachts;
}, [yachts]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredByCategory.length / PAGE_SIZE)
  );

  const paginatedYachts = filteredByCategory.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7] px-6 py-10 text-black dark:bg-[#012241] dark:text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-6">

          <YachtListingHeader
            activeCategory={category}
            activeBrand={brand}
            categories={categories}
            brands={brandsForCategory}
            onCategoryChange={(newCategory) => {
              setCategory(newCategory);
              setBrand('ALL');
              setPage(1);
            }}
            onBrandChange={(newBrand) => {
              setBrand(newBrand);
              setPage(1);
            }}
          />

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] animate-pulse rounded-2xl bg-black/5 dark:bg-white/5"
                />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {!isLoading && !error && paginatedYachts.length === 0 && (
            <p
              className="
                rounded-xl
                border border-black/10
                bg-black/[0.02]
                p-8
                text-center
                text-sm
                text-black/50
                dark:border-white/10
                dark:bg-white/[0.03]
                dark:text-white/50
              "
            >
              No yachts match your category.
            </p>
          )}

          {!isLoading && !error && paginatedYachts.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {paginatedYachts.map((yacht) => (
                <YachtCard
                  key={yacht.id}
                  yacht={yacht}
                  onClick={() => router.push(`/new-boats/${encodeURIComponent(yacht.slug)}`)}
                />
              ))}
            </div>
          )}

          <YachtPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

        </div>
      </div>
    </div>
  );
}