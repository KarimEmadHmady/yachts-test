'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useYachts } from './hooks/useYachts';
import { YachtCard } from './components/YachtCard';
import { YachtFilters, DEFAULT_YACHT_FILTERS } from './components/YachtFilters';
import { YachtPagination } from './components/YachtPagination';
import { YachtListingHeader } from './components/YachtListingHeader';
import { SellYourBoatModal } from './components/SaleYourBoat';
import { buildYachtSubmissionFormData } from './utils/yacht.utils';
import { categoryService } from '@/services/categoryService';

const PAGE_SIZE = 9;

const toServiceFilters = (filters) => ({
  max_size: filters.maxSize < 30 ? filters.maxSize : undefined,
  min_year: filters.minYear || undefined,
  max_year: filters.maxYear || undefined,
  cabins: filters.cabins > 0 ? filters.cabins : undefined,
  type: filters.boatTypes.length === 1 ? filters.boatTypes[0] : undefined,
});

export default function YachtsPage() {
  const router = useRouter();
  const { yachts, isLoading, error, fetchYachts, submitYacht } = useYachts();
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_YACHT_FILTERS);
  const [category, setCategory] = useState('ALL');
  const [page, setPage] = useState(1);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSellSubmit = async (payload) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = buildYachtSubmissionFormData({
        submitted_by_first_name: payload.firstName,
        submitted_by_last_name: payload.lastName,
        submitted_by_phone: payload.phone,
        submitted_by_email: payload.email,
        submitted_brand_name: payload.brandName,
        price_sale: payload.price,
        size_meters: payload.size,
        cabins: payload.cabins,
        submitted_message: payload.message,
      }, payload.gallery);
      await submitYacht(formData);
      setSubmitSuccess(true);
    } catch (requestError) {
      setSubmitError(requestError.message || 'Failed to submit your boat.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    categoryService.list().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(DEFAULT_YACHT_FILTERS);
    const activeFilters = filtersChanged ? toServiceFilters(filters) : {};
    fetchYachts({
      condition: 'pre_owned',
      ...activeFilters,
      ...(category !== 'ALL' ? { category_id: category } : {}),
    });
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, category]);

  const filteredByCategory = useMemo(() => {
    return yachts;
  }, [yachts]);

  const totalPages = Math.max(1, Math.ceil(filteredByCategory.length / PAGE_SIZE));
  const paginatedYachts = filteredByCategory.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-black dark:bg-[#012241] dark:text-white px-6 py-10 md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
        <YachtFilters filters={filters} onChange={setFilters} />

        <div className="space-y-6">
          <YachtListingHeader
            activeCategory={category}
            categories={categories}
            onCategoryChange={(nextCategory) => { setCategory(nextCategory); setPage(1); }}
            onSellClick={() => {
              setSubmitError(null);
              setSubmitSuccess(false);
              setIsSellModalOpen(true);
            }}
          />

          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {!isLoading && !error && paginatedYachts.length === 0 && (
            <p className="rounded-xl border border-black/10 bg-black/[0.02] p-8 text-center text-sm text-black/50
                           dark:border-white/10 dark:bg-white/[0.03] dark:text-white/50">
              No yachts match your filters.
            </p>
          )}

          {!isLoading && !error && paginatedYachts.length > 0 && (
            <div data-reveal-stagger="90" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedYachts.map((yacht) => (
                <YachtCard
                  key={yacht.id}
                  yacht={yacht}
                  onClick={() => router.push(`/pre-owned/${encodeURIComponent(yacht.slug)}`)}
                />
              ))}
            </div>
          )}

          <YachtPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
      <SellYourBoatModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSubmit={handleSellSubmit}
        isSubmitting={isSubmitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
      />
    </div>
  );
}