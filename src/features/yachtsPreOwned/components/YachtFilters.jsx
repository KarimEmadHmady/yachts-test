'use client';

import { useState } from 'react';
import { Minus, Plus, SlidersHorizontal, X } from 'lucide-react';
import { RangeSlider } from './RangeSlider';

const BOAT_TYPES = [
  { value: 'motor_catamaran', label: 'Motor Catamaran' },
  { value: 'sailing_catamaran', label: 'Sailing Catamaran' },
];

export const DEFAULT_YACHT_FILTERS = {
  maxSize: 10,
  minYear: 2000,
  maxYear: 2026,
  cabins: 0,
  boatTypes: [],
};

/**
 * Filters sidebar for the yachts listing page.
 *
 * @param {Object} props
 * @param {typeof DEFAULT_YACHT_FILTERS} props.filters
 * @param {(next: typeof DEFAULT_YACHT_FILTERS) => void} props.onChange
 * @param {() => void} [props.onReset]
 */
export function YachtFilters({ filters, onChange, onReset }) {
  const [isOpen, setIsOpen] = useState(false);

  const update = (patch) => onChange({ ...filters, ...patch });

  const handleReset = () => {
    onChange(DEFAULT_YACHT_FILTERS);
    onReset?.();
  };

  const toggleBoatType = (value) => {
    const isActive = filters.boatTypes.includes(value);
    const next = isActive
      ? filters.boatTypes.filter((v) => v !== value)
      : [...filters.boatTypes, value];
    update({ boatTypes: next });
  };

  return (
    <div className="w-full">
      {/* زرار الفلتر - يظهر بس في الشاشات الصغيرة */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="mb-3 flex w-full items-center justify-between rounded-2xl border border-black/10 bg-[#f7f7f7]
                   px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-black
                   transition-colors hover:border-[#C9A667]
                   dark:border-white/5 dark:bg-[#0E2D4A] dark:text-white
                   md:hidden"
      >
        <span className="flex items-center gap-1">
          <SlidersHorizontal className="h-4 w-4 text-[#C9A667]" strokeWidth={2} />
          Filters
        </span>
        {isOpen ? (
          <X className="h-4 w-4 text-black/50 dark:text-white/50" />
        ) : (
          <span className="text-xs font-medium normal-case text-black/40 dark:text-white/40">
            Show
          </span>
        )}
      </button>

      {/* لوحة الفلاتر - مخفية في الموبايل لحد ما تدوس على الزرار، وظاهرة دايمًا من md فأعلى */}
      <aside
        className={`w-full rounded-2xl border border-black/10 bg-[#f7f7f7] dark:bg-[#0E2D4A] p-6
                     dark:border-white/5 dark:bg-white/[0.03]
                     ${isOpen ? 'block' : 'hidden'} md:block`}
      >
        <div className="mb-7 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-black dark:text-white">Filters</h2>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-medium text-black/50 underline decoration-black/25 underline-offset-4
                       transition-colors hover:text-[#C9A667] hover:decoration-[#C9A667]
                       dark:text-white/50 dark:decoration-white/25"
          >
            Reset Filters
          </button>
        </div>

        {/* Yacht size */}
        <div className="mb-7">
          <p className="mb-4 text-sm text-black/70 dark:text-white/70">Yacht Size</p>
          <SingleSlider
            min={0}
            max={30}
            value={filters.maxSize}
            onChange={(maxSize) => update({ maxSize })}
            formatLabel={(v) => `${v}m`}
          />
        </div>

        {/* Years of manufacture */}
        <div className="mb-7">
          <p className="mb-4 text-sm text-black/70 dark:text-white/70">Years Of Manufacture</p>
          <RangeSlider
            min={2000}
            max={2026}
            valueMin={filters.minYear}
            valueMax={filters.maxYear}
            onChange={({ min, max }) => update({ minYear: min, maxYear: max })}
          />
        </div>

        {/* Number of cabins */}
        <div className="mb-7">
          <p className="mb-4 text-sm text-black/70 dark:text-white/70">Number Of Cabins</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Decrease cabins"
              onClick={() => update({ cabins: Math.max(0, filters.cabins - 1) })}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20 text-black/70
                         transition-colors hover:border-[#C9A667] hover:text-[#C9A667]
                         dark:border-white/20 dark:text-white/70"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-4 text-center text-sm text-black dark:text-white">{filters.cabins}</span>
            <button
              type="button"
              aria-label="Increase cabins"
              onClick={() => update({ cabins: filters.cabins + 1 })}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20 text-black/70
                         transition-colors hover:border-[#C9A667] hover:text-[#C9A667]
                         dark:border-white/20 dark:text-white/70"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Boat type */}
        <div className="space-y-3">
          {BOAT_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex cursor-pointer items-center gap-3 text-sm text-black/70 hover:text-black
                         dark:text-white/70 dark:hover:text-white"
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors
                  ${filters.boatTypes.includes(type.value)
                    ? 'border-[#C9A667] bg-[#C9A667]'
                    : 'border-black/25 bg-transparent dark:border-white/25'}`}
              >
                {filters.boatTypes.includes(type.value) && (
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 fill-none stroke-[#0E2D4A] stroke-[2.5]">
                    <path d="M2 6l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={filters.boatTypes.includes(type.value)}
                onChange={() => toggleBoatType(type.value)}
              />
              {type.label}
            </label>
          ))}
        </div>
      </aside>
    </div>
  );
}

function SingleSlider({ min, max, value, onChange, formatLabel = (v) => String(v) }) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="relative h-1.5 w-full">
        <div className="absolute inset-0 rounded-full bg-black/10 dark:bg-white/15" />
        <div className="absolute h-full rounded-full bg-[#C9A667]" style={{ width: `${percent}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="single-range-thumb absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
        />
      </div>
      <div className="mt-2 text-right text-xs text-black/50 dark:text-white/50">{formatLabel(value)}</div>

      <style jsx>{`
        .single-range-thumb::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid #c9a667;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
        }
        .single-range-thumb::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid #c9a667;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
        }
        .single-range-thumb::-webkit-slider-runnable-track {
          background: transparent;
        }
        .single-range-thumb::-moz-range-track {
          background: transparent;
        }

        :global(.dark) .single-range-thumb::-webkit-slider-thumb {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }
        :global(.dark) .single-range-thumb::-moz-range-thumb {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </div>
  );
}