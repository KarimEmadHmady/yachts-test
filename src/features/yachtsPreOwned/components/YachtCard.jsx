'use client';

import { Maximize2, BedDouble, CalendarDays, Sparkles } from 'lucide-react';
import { getYachtImageUrl } from '../utils/yacht.utils';
import { YachtStatusBadge } from './YachtStatusBadge';
import { ScrollAnimate } from '@/components/common/ScrollAnimate';

export function YachtCard({ yacht, onClick, index = 0 }) {
  if (yacht.status !== 'published' || yacht.submission_status !== 'approved') {
    return null;
  }

  const image = yacht.cover_image || yacht.images?.[0]?.image_path;
  const amenities = (yacht.amenities || []).slice(0, 2);

  return (
    <ScrollAnimate
      as="article"
      direction="up"
      delay={(index % 4) * 90}
      distance={30}
      duration={800}
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-[#C9A868]/70 bg-[#f7f7f7]
                 transition-colors duration-200 hover:border-[#C9A868]
                 dark:bg-[#0E2D4A]"
    >
      {/* الصورة */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#012241]">
        {image ? (
          <img
            src={getYachtImageUrl(image)}
            alt={yacht.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-white/30">
            No image
          </div>
        )}

        {/* {yacht.status && (
          <div className="absolute left-3 top-3">
            <YachtStatusBadge status={yacht.status} />
          </div>
        )} */}
      </div>

      {/* التفاصيل */}
      <div className="space-y-3 p-4">
        <h3 className="truncate text-[15px] font-semibold uppercase tracking-wide text-black dark:text-white">
          {yacht.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-black/50 dark:text-white/60">
          {yacht.size_meters != null && (
            <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-white/70">
              <Maximize2 className="h-3.5 w-3.5 text-[#C9A868]" strokeWidth={1.75} />
              Size:{yacht.size_meters}m
            </span>
          )}
          {yacht.cabins != null && (
            <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-white/70">
              <BedDouble className="h-3.5 w-3.5 text-[#C9A868]" strokeWidth={1.75} />
              Cabin:{yacht.cabins}
            </span>
          )}
          {yacht.year_built != null && (
            <span className="inline-flex items-center gap-1.5 text-gray-600 dark:text-white/70">
              <CalendarDays className="h-3.5 w-3.5 text-[#C9A868]" strokeWidth={1.75} />
              Years:{yacht.year_built}
            </span>
          )}
        </div>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {amenities.map((amenity) => (
              <span
                key={amenity.id || amenity.name}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5
                           px-2.5 py-1 text-[11px] text-black/60
                           dark:border-white/10 dark:bg-white/5 dark:text-white/70"
              >
                <Sparkles className="h-3 w-3 text-[#C9A868]" strokeWidth={1.75} />
                {amenity.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </ScrollAnimate>
  );
}