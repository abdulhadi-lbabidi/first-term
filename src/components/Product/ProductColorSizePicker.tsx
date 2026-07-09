import { useTranslation } from 'react-i18next'
import type { ProductColor } from '../../types/product'
import { getColorLabel } from '../../utils/productDisplay'

interface ProductColorSizePickerProps {
  colors: ProductColor[]
  sizes: string[]
  selectedColor: ProductColor | null
  selectedSize: string
  onColorChange: (color: ProductColor) => void
  onSizeChange: (size: string) => void
}

export default function ProductColorSizePicker({
  colors,
  sizes,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: ProductColorSizePickerProps) {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <p className="mb-3 text-sm font-bold text-[#1e1033]">{t('store.card.colors')}</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => {
            const isActive = selectedColor?.key === color.key
            return (
              <button
                key={color.key}
                type="button"
                onClick={() => onColorChange(color)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'border-purple-400 bg-purple-50 text-purple-800 shadow-sm'
                    : 'border-purple-100 bg-white text-[#5b4d6d] hover:border-purple-200'
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full border-2 border-white ring-1 ring-purple-100"
                  style={{ backgroundColor: color.value }}
                />
                {getColorLabel(t, color.key)}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-sm font-bold text-[#1e1033]">{t('store.card.sizes')}</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const isActive = selectedSize === size
            return (
              <button
                key={size}
                type="button"
                onClick={() => onSizeChange(size)}
                className={`cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'border-purple-400 bg-purple-600 text-white shadow-md shadow-purple-500/25'
                    : 'border-purple-100 bg-purple-50/90 text-purple-700 hover:border-purple-200 hover:bg-purple-100'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
