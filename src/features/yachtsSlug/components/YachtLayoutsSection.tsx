'use client';

import { getYachtImageUrl } from '../utils/yacht.utils';

interface YachtLayoutsSectionProps {
  images: string[];
}

export function YachtLayoutsSection({ images }: YachtLayoutsSectionProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="bg-[#f7f7f7] px-6 pb-8 text-black dark:bg-[#0E2D4A] dark:text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border border-black/10 bg-white/40 p-6 dark:border-white/10 dark:bg-white/[0.03] md:p-8">
          <h2 className="mb-6 text-lg font-bold uppercase tracking-wide text-[#C9A868]">
            Layouts &amp; Specs
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-white p-4"
              >
                <img
                  src={getYachtImageUrl(image)}
                  alt={`Layout ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}