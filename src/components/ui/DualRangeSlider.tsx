import { useCallback, useEffect, useRef } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  onChange: (values: { min: number; max: number }) => void;
  currentLang?: string;
}

export default function DualRangeSlider({
  min,
  max,
  minVal,
  maxVal,
  onChange,
  currentLang = 'en',
}: DualRangeSliderProps) {
  const minValRef = useRef(minVal);
  const maxValRef = useRef(maxVal);
  const range = useRef<HTMLDivElement>(null);

  const isRtl = currentLang === 'ar';

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width and left/right offsets of the range bar dynamically based on layout direction
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      if (isRtl) {
        range.current.style.right = `${minPercent}%`;
        range.current.style.left = 'auto';
      } else {
        range.current.style.left = `${minPercent}%`;
        range.current.style.right = 'auto';
      }
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent, isRtl]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      if (isRtl) {
        range.current.style.right = `${minPercent}%`;
        range.current.style.left = 'auto';
      } else {
        range.current.style.left = `${minPercent}%`;
        range.current.style.right = 'auto';
      }
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent, isRtl]);

  return (
    <div className="relative w-full pt-4 pb-2" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Overlapping Range Inputs */}
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        dir={isRtl ? 'rtl' : 'ltr'}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal - 1);
          onChange({ min: value, max: maxVal });
          minValRef.current = value;
        }}
        className="thumb thumb--left mt-1.5"
        style={{ zIndex: minVal > max - 100 ? 5 : undefined }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        dir={isRtl ? 'rtl' : 'ltr'}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal + 1);
          onChange({ min: minVal, max: value });
          maxValRef.current = value;
        }}
        className="thumb thumb--right mt-1.5"
      />

      {/* Custom Slider Track */}
      <div className="slider">
        <div className="slider__track bg-canvas dark:bg-body/25" />
        <div ref={range} className="slider__range bg-primary" />
      </div>

      {/* Min/Max indicators */}
      <div className="flex justify-between items-center text-[13px] font-semibold text-ink/80 dark:text-canvas/80 mt-6 select-none font-interfaceEn">
        <span>{`$${minVal}`}</span>
        <span>{`$${maxVal}`}</span>
      </div>
    </div>
  );
}
