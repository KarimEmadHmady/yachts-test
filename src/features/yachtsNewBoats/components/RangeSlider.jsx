'use client';

/**
 * Dual-thumb range slider (two overlapping <input type="range"> elements).
 *
 * @param {Object} props
 * @param {number} props.min
 * @param {number} props.max
 * @param {number} props.step
 * @param {number} props.valueMin
 * @param {number} props.valueMax
 * @param {(next: { min: number, max: number }) => void} props.onChange
 * @param {(value: number) => string} [props.formatLabel]
 */
export function RangeSlider({
  min,
  max,
  step = 1,
  valueMin,
  valueMax,
  onChange,
  formatLabel = (v) => String(v),
}) {
  const clamp = (v) => Math.min(Math.max(v, min), max);

  const handleMinChange = (e) => {
    const next = clamp(Math.min(Number(e.target.value), valueMax));
    onChange({ min: next, max: valueMax });
  };

  const handleMaxChange = (e) => {
    const next = clamp(Math.max(Number(e.target.value), valueMin));
    onChange({ min: valueMin, max: next });
  };

  const minPercent = ((valueMin - min) / (max - min)) * 100;
  const maxPercent = ((valueMax - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="relative h-1.5 w-full">
        {/* base track */}
        <div className="absolute inset-0 rounded-full bg-black/10 dark:bg-white/15" />
        {/* active track */}
        <div
          className="absolute h-full rounded-full bg-[#C9A667]"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={handleMinChange}
          className="range-thumb pointer-events-none absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={handleMaxChange}
          className="range-thumb pointer-events-none absolute inset-0 h-1.5 w-full appearance-none bg-transparent"
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-black/50 dark:text-white/50">
        <span>{formatLabel(valueMin)}</span>
        <span>{formatLabel(valueMax)}</span>
      </div>

      <style jsx>{`
        .range-thumb::-webkit-slider-thumb {
          pointer-events: auto;
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
        .range-thumb::-moz-range-thumb {
          pointer-events: auto;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3px solid #c9a667;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
        }
        .range-thumb::-webkit-slider-runnable-track {
          background: transparent;
        }
        .range-thumb::-moz-range-track {
          background: transparent;
        }

        :global(.dark) .range-thumb::-webkit-slider-thumb {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }
        :global(.dark) .range-thumb::-moz-range-thumb {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
        }
      `}</style>
    </div>
  );
}