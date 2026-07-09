import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { ResetIcon } from '../icons/Icons'
import { getColorLabel } from '../../utils/productDisplay'
import type { StoreFilters } from '../../data/filters'
import {
  FILTER_CATEGORY_IDS,
  STORE_FILTER_SWATCHES,
  STORE_PRICE_MAX,
  STORE_PRICE_MIN,
  STORE_PRICE_STEP,
  STORE_SIZES,
} from '../../data/filters'

interface ProductFiltersProps {
  filters: StoreFilters
  onChange: (filters: StoreFilters) => void
  onReset: () => void
}

const fieldClass =
  'w-full rounded-xl border border-purple-100 bg-white/90 px-3 py-2 text-xs text-[#1e1033] outline-none transition-all duration-500 ease-out focus:border-purple-300 focus:ring-2 focus:ring-purple-500/20'

const labelClass = 'mb-1.5 block text-xs font-semibold text-[#1e1033]'

const toggleButtonClass = (isActive: boolean) =>
  `rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all duration-500 ease-out ${
    isActive
      ? 'border-purple-400 bg-purple-600 text-white shadow-md shadow-purple-500/25'
      : 'border-purple-100 bg-white text-purple-700 hover:border-purple-200 hover:bg-purple-50'
  }`

const categoryButtonClass = (isActive: boolean) =>
  `w-full rounded-lg border px-1.5 py-1.5 text-center text-[10px] font-semibold leading-tight transition-all duration-500 ease-out ${
    isActive
      ? 'border-purple-400 bg-purple-600 text-white shadow-md shadow-purple-500/25'
      : 'border-purple-100 bg-white text-purple-700 hover:border-purple-200 hover:bg-purple-50'
  }`

interface ColorPickerSwatchProps {
  isActive: boolean
  selectedColor: string | null
  onConfirm: (color: string) => void
  openLabel: string
  confirmLabel: string
}

function ColorPickerSwatch({
  isActive,
  selectedColor,
  onConfirm,
  openLabel,
  confirmLabel,
}: ColorPickerSwatchProps) {
  const [open, setOpen] = useState(false)
  const [draftColor, setDraftColor] = useState(selectedColor ?? '#7c3aed')
  const [popoverStyle, setPopoverStyle] = useState({ top: 0, left: 0 })
  const anchorRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)

  const updatePopoverPosition = () => {
    if (!anchorRef.current) return
    const rect = anchorRef.current.getBoundingClientRect()
    setPopoverStyle({
      top: rect.top - 10,
      left: rect.left + rect.width / 2,
    })
  }

  useEffect(() => {
    if (!open) return

    updatePopoverPosition()

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        !anchorRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        setOpen(false)
      }
    }

    const handleReposition = () => updatePopoverPosition()

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [open])

  const handleOpenPicker = () => {
    setDraftColor(selectedColor ?? '#7c3aed')
    colorInputRef.current?.click()
  }

  const handleColorInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraftColor(event.target.value)
    setOpen(true)
  }

  const handleConfirm = () => {
    onConfirm(draftColor)
    setOpen(false)
  }

  const popover =
    open &&
    createPortal(
      <div
        ref={popoverRef}
        className="fixed z-[9999] w-[min(220px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-full rounded-2xl border border-purple-100 bg-white p-4 shadow-[0_20px_50px_rgba(124,58,237,0.22)]"
        style={{ top: popoverStyle.top, left: popoverStyle.left }}
      >
        <div className="flex items-center gap-3">
          <span
            className="block h-10 w-10 shrink-0 rounded-full border-2 border-purple-200 shadow-sm"
            style={{ backgroundColor: draftColor }}
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold uppercase tracking-wide text-[#8b7fa0]">
              {openLabel}
            </p>
            <p className="mt-0.5 truncate text-sm font-bold text-[#1e1033]">
              {draftColor.toUpperCase()}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="mt-4 w-full rounded-full bg-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-500/25 transition-all duration-300 ease-out hover:bg-purple-500"
        >
          {confirmLabel}
        </button>
      </div>,
      document.body,
    )

  return (
    <div className="relative flex justify-center">
      <input
        ref={colorInputRef}
        type="color"
        value={draftColor}
        onChange={handleColorInputChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      <button
        ref={anchorRef}
        type="button"
        onClick={handleOpenPicker}
        title={openLabel}
        aria-label={openLabel}
        aria-pressed={isActive}
        aria-expanded={open}
        className={`relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ease-out ${
          isActive
            ? 'ring-2 ring-purple-500 ring-offset-1 scale-110'
            : 'hover:scale-105'
        }`}
        style={{
          background:
            'conic-gradient(from 180deg, #7c3aed, #d946ef, #db2777, #f0abfc, #ffffff, #18181b, #7c3aed)',
        }}
      >
        <span className="flex h-3 w-3 items-center justify-center rounded-full bg-white/90 text-[9px] font-bold text-purple-700">
          +
        </span>
      </button>

      {popover}
    </div>
  )
}

const rangeInputClass =
  'store-price-range pointer-events-none absolute inset-x-0 top-1/2 z-20 h-0 w-full -translate-y-1/2 appearance-none bg-transparent'

interface PriceRangeFilterProps {
  min: number
  max: number
  valueMin: number
  valueMax: number
  onChange: (priceMin: number, priceMax: number) => void
  formatPrice: (value: number) => string
}

function PriceRangeFilter({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  formatPrice,
}: PriceRangeFilterProps) {
  const minPercent = ((valueMin - min) / (max - min)) * 100
  const maxPercent = ((valueMax - min) / (max - min)) * 100

  const handleMinChange = (nextMin: number) => {
    onChange(Math.min(nextMin, valueMax - STORE_PRICE_STEP), valueMax)
  }

  const handleMaxChange = (nextMax: number) => {
    onChange(valueMin, Math.max(nextMax, valueMin + STORE_PRICE_STEP))
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-purple-700">
        <span>{formatPrice(valueMin)}</span>
        <span>{formatPrice(valueMax)}</span>
      </div>

      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-purple-100" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500"
          style={{
            insetInlineStart: `${minPercent}%`,
            insetInlineEnd: `${100 - maxPercent}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={STORE_PRICE_STEP}
          value={valueMin}
          onChange={(event) => handleMinChange(Number(event.target.value))}
          className={`${rangeInputClass} z-30`}
          aria-label="Minimum price"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={STORE_PRICE_STEP}
          value={valueMax}
          onChange={(event) => handleMaxChange(Number(event.target.value))}
          className={`${rangeInputClass} z-40`}
          aria-label="Maximum price"
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[10px] font-medium text-[#8b7fa0]">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  )
}

export default function ProductFilters({ filters, onChange, onReset }: ProductFiltersProps) {
  const { t, i18n } = useTranslation()
  const priceLocale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const currency = t('store.currency')

  const update = (partial: Partial<StoreFilters>) => {
    onChange({ ...filters, ...partial })
  }

  const formatPrice = (value: number) =>
    `${value.toLocaleString(priceLocale)} ${currency}`

  const handleColorSelect = (colorKey: string) => {
    const isSamePreset = filters.color === colorKey && filters.color !== 'custom'
    update({
      color: isSamePreset ? 'all' : colorKey,
      customColor: null,
    })
  }

  const handleCustomColorConfirm = (color: string) => {
    update({ color: 'custom', customColor: color })
  }

  return (
    <aside className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-extrabold text-[#1e1033]">{t('store.filters.title')}</h2>
          <p className="mt-0.5 text-[11px] leading-snug text-[#7c6b92]">{t('store.filters.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          aria-label={t('store.filters.reset')}
          title={t('store.filters.reset')}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-purple-100 bg-white text-purple-600 transition-all duration-300 ease-out hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 [&_svg]:size-[18px]"
        >
          <ResetIcon />
        </button>
      </div>

      <div>
        <label htmlFor="code-search" className={labelClass}>
          {t('store.filters.codeSearch')}
        </label>
        <input
          id="code-search"
          type="search"
          value={filters.codeSearch}
          onChange={(event) => update({ codeSearch: event.target.value })}
          placeholder={t('store.filters.codePlaceholder')}
          className={fieldClass}
        />
      </div>

      <div>
        <span className={labelClass}>{t('store.filters.size')}</span>
        <div className="flex flex-wrap gap-1.5">
          {STORE_SIZES.map((size) => {
            const isActive = filters.size === size
            return (
              <button
                key={size}
                type="button"
                onClick={() => update({ size: isActive ? '' : size })}
                className={toggleButtonClass(isActive)}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <span className={labelClass}>{t('store.filters.color')}</span>
        <div className="grid grid-cols-7 justify-items-center gap-1.5">
          {STORE_FILTER_SWATCHES.map((swatch) => {
            const isActive =
              filters.color !== 'custom' && filters.color === swatch.key
            const colorLabel = getColorLabel(t, swatch.key)

            return (
              <button
                key={swatch.id}
                type="button"
                onClick={() => handleColorSelect(swatch.key)}
                title={colorLabel}
                aria-label={colorLabel}
                aria-pressed={isActive}
                className={`h-5 w-5 rounded-full transition-all duration-300 ease-out ${
                  swatch.key === 'white'
                    ? 'border-2 border-purple-300 bg-white'
                    : ''
                } ${
                  isActive
                    ? 'ring-2 ring-purple-500 ring-offset-1 scale-110'
                    : 'hover:scale-105'
                }`}
                style={
                  swatch.key === 'white' ? undefined : { backgroundColor: swatch.value }
                }
              />
            )
          })}
          <ColorPickerSwatch
            isActive={filters.color === 'custom'}
            selectedColor={filters.color === 'custom' ? filters.customColor : null}
            onConfirm={handleCustomColorConfirm}
            openLabel={t('store.filters.colorPickerOpen')}
            confirmLabel={t('store.filters.colorPickerConfirm')}
          />
        </div>
      </div>

      <div>
        <span className={labelClass}>{t('store.filters.price')}</span>
        <PriceRangeFilter
          min={STORE_PRICE_MIN}
          max={STORE_PRICE_MAX}
          valueMin={filters.priceMin}
          valueMax={filters.priceMax}
          onChange={(priceMin, priceMax) => update({ priceMin, priceMax })}
          formatPrice={formatPrice}
        />
      </div>

      <div>
        <span className={labelClass}>{t('store.filters.category')}</span>
        <div className="grid grid-cols-3 gap-1.5">
          {FILTER_CATEGORY_IDS.map((categoryId) => {
            const isActive = filters.category === categoryId
            return (
              <button
                key={categoryId}
                type="button"
                onClick={() =>
                  update({
                    category:
                      isActive && categoryId !== 'all' ? 'all' : categoryId,
                  })
                }
                className={categoryButtonClass(isActive)}
              >
                {t(`store.categories.${categoryId}`)}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
