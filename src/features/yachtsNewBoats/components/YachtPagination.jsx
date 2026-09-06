'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * @param {Object} props
 * @param {number} props.page current page (1-based)
 * @param {number} props.totalPages
 * @param {(page: number) => void} props.onPageChange
 */
export function YachtPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex items-center justify-center gap-3 pt-4">
      {canGoPrev && (
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-2 rounded-full border border-black/20 px-5 py-2.5
                     text-sm text-black/70 transition-colors hover:border-[#C9A667] hover:text-[#C9A667]
                     dark:border-white/20 dark:text-white/70"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
      )}

      {canGoNext && (
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-2 rounded-full border border-black/20 px-5 py-2.5
                     text-sm text-black/70 transition-colors hover:border-[#C9A667] hover:text-[#C9A667]
                     dark:border-white/20 dark:text-white/70"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}