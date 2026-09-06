'use client';

import { useMemo } from 'react';

export function YachtListingHeader({
  activeCategory = 'ALL',
  activeBrand = 'ALL',
  onCategoryChange,
  onBrandChange,
  categories = [],
  brands = [],
}) {
  const selectedCategory = categories.find(
    (category) => String(category.id) === String(activeCategory),
  );

  // Filter brands based on selected category
  const filteredBrands = useMemo(() => {
    if (activeCategory === 'ALL') return brands;
    
    const categoryData = categories.find(
      (item) => String(item.id) === String(activeCategory),
    );
    
    // Use brand_ids array instead of brand_id
    const categoryBrandIds = categoryData?.brand_ids || [];
    return brands.filter(
      (item) => categoryBrandIds.includes(item.id),
    );
  }, [brands, categories, activeCategory]);

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-[#0E2D4A] dark:text-white">
          Yachts
        </span>

        <span className="text-black/30 dark:text-white/30">
          &gt;
        </span>

        <span className="text-black/40 dark:text-white/50">
          {selectedCategory?.name || 'ALL'}
        </span>
      </div>

      <div className="space-y-3">
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {[{ id: null, name: 'ALL', image: '/Group7.png' }, ...categories].map((category) => {
            const isActive = (category.id === null && activeCategory === 'ALL') || String(category.id) === String(activeCategory);

            return (
              <button key={category.id || category.name} type="button" onClick={() => onCategoryChange?.(category.id === null ? 'ALL' : category.id)} className={`group flex shrink-0 items-center gap-2 rounded-full border border-white/60 px-2 py-1 transition-all duration-300 ${isActive ? 'bg-[#C9A667]/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
                <div className={`relative h-7 w-7 shrink-0 overflow-hidden rounded-full border transition-all duration-300 ${isActive ? 'border-[#C9A667] p-0.5' : 'border-black/10 group-hover:border-[#C9A667]/50 dark:border-white/10'}`}>
                  <img src={category.image || '/Group7.png'} alt={category.name} className="h-full w-full rounded-full object-cover" />
                </div>
                <span className={`pr-2 text-xs font-semibold whitespace-nowrap transition-colors ${isActive ? 'text-[#C9A667]' : 'text-black/60 dark:text-white/60'}`}>
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Show brands only when a specific category is selected */}
        {activeCategory !== 'ALL' && filteredBrands.length > 0 && (
          <div className="scrollbar-none flex gap-5 overflow-x-auto pb-2 pl-5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {filteredBrands.map((brand, index) => {
              const isActive = String(brand.id) === String(activeBrand);

              return (
                <div key={brand.id || brand.name} className="flex shrink-0 items-center gap-5">
                  <button type="button" onClick={() => onBrandChange?.(brand.id)} className={`px-1 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${isActive ? 'text-[#C9A667]' : 'text-black/60 hover:text-[#C9A667] dark:text-white/60'}`}>
                    {brand.name}
                  </button>
                  {index < filteredBrands.length - 1 && <span className="text-black/30 dark:text-white/30">|</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}