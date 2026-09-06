'use client';

import Link from 'next/link';
import { formatCurrency, formatDate } from '../utils/yachtDashboardUtils';

const getImageUrl = (value) => {
  if (!value) return '';
  if (value.startsWith('http')) return value;
  const clean = value.replace(/^\/+/, '');
  const normalized = clean.startsWith('uploads/') ? clean : `uploads/${clean}`;
  return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/yachts'}/${normalized}`;
};

const getCoverImage = (yacht) => {
  // list endpoint (fetchYachts) بيرجع cover_image كـ URL جاهز
  if (yacht?.cover_image) return getImageUrl(yacht.cover_image);

  // detail endpoint (fetchYachtBySlug) بيرجع images array بدل كدة
  if (Array.isArray(yacht?.images) && yacht.images.length > 0) {
    const cover = yacht.images.find((img) => (img.image_type || 'gallery') === 'cover');
    const target = cover || yacht.images[0];
    return getImageUrl(target.image_path || target.src);
  }

  return null;
};
export function YachtTable({ yachts = [], selectedId, onSelect, onDelete, onStatusChange }) {
  if (yachts.length === 0) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-gray-500 dark:border-white/10 dark:bg-[#0E2D4A]">
        No yachts found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {yachts.map((yacht) => {
        const cover = getCoverImage(yacht);
        const isSelected = selectedId === yacht.id;

        return (
          <div
            key={yacht.id}
            onClick={() => onSelect?.(yacht)}
            className={`cursor-pointer overflow-hidden rounded-2xl border bg-white transition-colors dark:bg-[#0E2D4A] ${
              isSelected ? 'border-[#C9A868] ring-1 ring-[#C9A868]' : 'border-black/10 dark:border-white/10'
            }`}
          >
            <div className="relative h-40 w-full bg-gray-100 dark:bg-[#012241]">
              {cover ? (
                <img
                  src={cover}
                  alt={yacht.name || 'Yacht'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  No image
                </div>
              )}

              <span className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
                {yacht.status || 'draft'}
              </span>
            </div>

            <div className="p-4">
              <h3 className="truncate text-base font-semibold">{yacht.name || 'Untitled Yacht'}</h3>
              <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-300">
                {yacht.brand_name || yacht.submitted_brand_name || '-'}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#C9A868]">
                  {formatCurrency(yacht.price_sale)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-300">
                  {formatDate(yacht.created_at)}
                </span>
              </div>

              <div className="mt-3" onClick={(event) => event.stopPropagation()}>
                <select
                  value={yacht.status || 'draft'}
                  onChange={(event) => onStatusChange?.(yacht.id, event.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs dark:border-white/10 dark:bg-[#012241]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archive">Archive</option>
                </select>
              </div>

              <div className="mt-3 flex gap-2" onClick={(event) => event.stopPropagation()}>
                <Link
                  href={`/dashboard/edit-yacht/${yacht.id}`}
                  className="flex-1 rounded-lg border border-[#C9A868] px-3 py-1.5 text-center text-xs font-medium text-[#C9A868] hover:bg-[#C9A868]/10"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete?.(yacht.id)}
                  className="flex-1 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}