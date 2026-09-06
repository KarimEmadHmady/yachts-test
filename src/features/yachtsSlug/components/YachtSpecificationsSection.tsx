'use client';

import { ArrowUpRight } from 'lucide-react';
import type { Yacht } from '../types/Yacht.types';
import { getYachtImageUrl, groupSpecifications } from '../utils/yacht.utils';

interface YachtSpecificationsSectionProps {
  yacht: Yacht;
  interiorImages?: string[];
  onEnquire?: () => void;
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 py-3 text-sm dark:border-white/10">
      <span className="uppercase tracking-wide text-black/60 dark:text-white/60">
        {label}
      </span>
      <span className="font-semibold text-black dark:text-white">{value}</span>
    </div>
  );
}

// Groups images into rows of 2, alternating which side is the "wide" one
function InteriorPhotosGrid({ images }: { images: string[] }) {
  const rows: string[][] = [];
  for (let i = 0; i < images.length; i += 2) {
    rows.push(images.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, rowIndex) => {
        // alternate which item is wide, like the reference layout
        const wideFirst = rowIndex % 2 === 0;

        return (
          <div key={rowIndex} className="flex gap-3">
            {row.map((image, colIndex) => {
              const isWide =
                row.length === 1 ||
                (colIndex === 0 ? wideFirst : !wideFirst);

              return (
                <div
                  key={`${image}-${colIndex}`}
                  className={`overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 aspect-[4/3] ${
                    isWide ? 'flex-[1.6]' : 'flex-[1]'
                  }`}
                >
                  <img
                    src={getYachtImageUrl(image)}
                    alt={`Interior ${rowIndex * 2 + colIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function YachtSpecificationsSection({
  yacht,
  interiorImages = [],
  onEnquire,
}: YachtSpecificationsSectionProps) {
  const { specification, characteristic } = groupSpecifications(yacht.specifications);

  if (specification.length === 0 && characteristic.length === 0 && interiorImages.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f7f7] px-6 py-8 text-black dark:bg-[#0E2D4A] dark:text-white md:px-12 md:py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1.7fr_1fr]">
        {/* Specs & Characteristics */}
        <div className="space-y-10">
          {specification.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-bold uppercase tracking-wide text-[#C9A868]">
                Specifications
              </h2>
              <div>
                {specification.map((spec) => (
                  <SpecRow key={spec.id} label={spec.label} value={spec.value} />
                ))}
              </div>
            </div>
          )}

          {characteristic.length > 0 && (
            <div>
              <h2 className="mb-2 text-lg font-bold uppercase tracking-wide text-[#C9A868]">
                Characteristics
              </h2>
              <div>
                {characteristic.map((spec) => (
                  <SpecRow key={spec.id} label={spec.label} value={spec.value} />
                ))}
              </div>
            </div>
          )}

          {onEnquire && (
            <button
              type="button"
              onClick={onEnquire}
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A868]
                         px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#C9A868]
                         transition-colors hover:bg-[#C9A868] hover:text-[#0E2D4A]"
            >
              Enquire
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Interior photos */}
        {interiorImages.length > 0 && (
          <div className="rounded-2xl border border-black/10 bg-white/40 p-5 dark:border-white/10 dark:bg-white/[0.03] h-fit">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wide text-[#C9A868]">
              Interior Photos
            </h3>
            <InteriorPhotosGrid images={interiorImages} />
          </div>
        )}
      </div>
    </section>
  );
}