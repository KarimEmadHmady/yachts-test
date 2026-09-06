'use client';

import { useMemo } from 'react';
import { ChevronLeft, Maximize2, BedDouble, CalendarDays, PlayCircle } from 'lucide-react';
import type { Yacht } from '../types/Yacht.types';
import { getImagesByType, getYachtCoverImage, getYachtImageUrl } from '../utils/yacht.utils';

interface YachtGallerySectionProps {
  yacht: Yacht;
  onBack?: () => void;
}

const MAX_GALLERY_IMAGES = 5;

const formatType = (type: string) =>
  type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function YachtGallerySection({ yacht, onBack }: YachtGallerySectionProps) {
  const coverImage = getYachtCoverImage(yacht);
  const galleryImages = useMemo(
    () => getImagesByType(yacht, 'gallery').slice(0, MAX_GALLERY_IMAGES),
    [yacht],
  );

  const mainImage = coverImage;
  const hasVideo = Boolean(yacht.video_url);
  const firstChunk = galleryImages;

  return (
    <section className="bg-[#f7f7f7] px-6 py-8 text-black dark:bg-[#0E2D4A] dark:text-white md:px-12 md:py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10
                         text-black/70 transition-colors hover:border-[#C9A868] hover:text-[#C9A868]
                         dark:border-white/10 dark:text-white/70"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h1 className="text-lg font-bold uppercase tracking-wide md:text-2xl">
              {yacht.name}
            </h1>
          </div>

          {yacht.type && (
            <span className="text-sm font-semibold uppercase tracking-wide text-[#C9A868]">
              {formatType(yacht.type)}
            </span>
          )}
        </div>

        {/* Meta info */}
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-black/60 dark:text-white/70">
          {yacht.size_meters && (
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="h-4 w-4 text-[#C9A868]" strokeWidth={1.75} />
              Size:{yacht.size_meters}m
            </span>
          )}
          {yacht.cabins != null && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-[#C9A868]" strokeWidth={1.75} />
              Cabin:{yacht.cabins}
            </span>
          )}
          {yacht.year_built && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[#C9A868]" strokeWidth={1.75} />
              Years:{yacht.year_built}
            </span>
          )}
        </div>

        {/* Hero + first gallery bento (نفس تقسيمة الصورة) */}
        {mainImage && (
          <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1.5fr_1.7fr]">
            {/* Main image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 lg:aspect-auto lg:h-[370px]">
              <img
                src={getYachtImageUrl(mainImage)}
                alt={yacht.name}
                className="h-full w-full object-cover"
              />
              {hasVideo && (
                <a
                  href={yacht.video_url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Play video"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-transform hover:scale-105">
                    <PlayCircle className="h-8 w-8 text-[#0E2D4A]" strokeWidth={1.5} />
                  </span>
                </a>
              )}
            </div>

            {/* Bento grid: col1 (2 stacked) | col2 (1 tall, spans both rows) | col3 (2 stacked) */}
            {firstChunk && firstChunk.length > 0 && (
              <div className="grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4 lg:h-[370px]">
                {firstChunk[0] && (
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 lg:aspect-auto">
                    <img
                      src={getYachtImageUrl(firstChunk[0])}
                      alt={`${yacht.name} 1`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {firstChunk[1] && (
                  <div className="relative row-span-2 overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5">
                    <img
                      src={getYachtImageUrl(firstChunk[1])}
                      alt={`${yacht.name} 2`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {firstChunk[2] && (
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 lg:aspect-auto">
                    <img
                      src={getYachtImageUrl(firstChunk[2])}
                      alt={`${yacht.name} 3`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {firstChunk[3] && (
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 lg:aspect-auto">
                    <img
                      src={getYachtImageUrl(firstChunk[3])}
                      alt={`${yacht.name} 4`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {firstChunk[4] && (
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 lg:aspect-auto">
                    <img
                      src={getYachtImageUrl(firstChunk[4])}
                      alt={`${yacht.name} 5`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {yacht.description && (
          <div className="mt-8 max-w-4xl space-y-4 text-sm leading-relaxed text-black/70 dark:text-white/70">
            {yacht.description
              .split('\n')
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}