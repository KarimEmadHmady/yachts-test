'use client';

/**
 * @param {Object} props
 * @param {string} props.activeCategory
 * @param {(category: string) => void} props.onCategoryChange
 * @param {() => void} [props.onSellClick]
 */
export function YachtListingHeader({ activeCategory = 'ALL', onCategoryChange, onSellClick, categories = [] }) {
  return (
    <div data-reveal="up" data-reveal-delay="100" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div
        className="
    flex gap-2 overflow-x-scroll
    [scrollbar-width:none]
    [-ms-overflow-style:none]
    [&::-webkit-scrollbar]:hidden
    sm:flex-wrap sm:overflow-visible
  "
      >
        {[{ id: null, name: 'ALL' }, ...categories].map((category) => {
          const isActive = (category.id === null && activeCategory === 'ALL') || category.id === activeCategory;

          return (
            <button
              key={category.id || category.name}
              type="button"
              onClick={() => onCategoryChange?.(category.id === null ? 'ALL' : category.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-colors
                    sm:px-5
          ${isActive
                  ? 'border-[#C9A667] bg-[#C9A667] text-[#0E2D4A]'
                  : 'border-black/15 text-black/60 hover:border-black/30 hover:text-black dark:border-white/15 dark:text-white/60 dark:hover:border-white/30 dark:hover:text-white'
                }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onSellClick}
        className="w-full shrink-0 rounded-full border border-[#C9A667]/60 px-5 py-2.5 text-xs font-semibold
                   text-[#C9A667] transition-colors hover:bg-[#C9A667] hover:text-[#0E2D4A]
                   sm:w-auto"
      >
        Sale Your Boat
      </button>
    </div>
  );
}