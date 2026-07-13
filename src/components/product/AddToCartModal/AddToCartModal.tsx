import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAddProductToCart } from '../../../hooks/useAddProductToCart'
import type { Product, ProductColor } from '../../../types/product'
import { DEFAULT_PRODUCT_FALLBACK, getProductDisplay } from '../../../utils/productDisplay'
import { usePriceFormat } from '../../../hooks/usePriceFormat'
import ProductColorSizePicker from '../ProductColorSizePicker'
import { CloseIcon } from '../../common/icons/Icons'

interface AddToCartModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

interface AddToCartModalContentProps {
  product: Product
  onClose: () => void
}

function AddToCartModalContent({ product, onClose }: AddToCartModalContentProps) {
  const { t } = useTranslation()
  const { priceLocale, currency } = usePriceFormat()
  const { adding, submitAddToCart } = useAddProductToCart()
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    () => product.colors[0] ?? null,
  )
  const [selectedSize, setSelectedSize] = useState(() => product.sizes[0] ?? '')

  const display = getProductDisplay(product, t, priceLocale, currency)

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) return
    const success = await submitAddToCart(product, selectedColor, selectedSize)
    if (success) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-to-cart-title"
    >
      <div
        className="absolute inset-0 bg-[#0f0a1a]/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-purple-100 bg-white/95 shadow-[0_30px_90px_rgba(124,58,237,0.28)] backdrop-blur-xl">
        <div className="h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400" />

        <button
          type="button"
          onClick={onClose}
          aria-label={t('nav.closeMenu')}
          className="absolute end-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-purple-100 bg-white text-purple-700 transition-colors duration-300 hover:bg-purple-50"
        >
          <CloseIcon />
        </button>

        <div className="p-6 sm:p-7">
          <span className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-purple-700">
            Trend
          </span>

          <div className="mt-4 flex gap-4">
            <div
              className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28"
              style={{
                background: product.images[0] ? undefined : DEFAULT_PRODUCT_FALLBACK,
              }}
            >
              {product.images[0] && (
                <img
                  src={product.images[0]}
                  alt={display.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <h2
                id="add-to-cart-title"
                className="truncate pe-8 text-xl font-extrabold text-[#1e1033]"
              >
                {display.name}
              </h2>
              <p className="mt-1 text-xs font-semibold text-[#7c6b92]">{product.code}</p>
              <p className="mt-2 text-lg font-extrabold text-purple-700">{display.price}</p>
            </div>
          </div>

          <div className="mt-6">
            <ProductColorSizePicker
              colors={product.colors}
              sizes={product.sizes}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              onColorChange={setSelectedColor}
              onSizeChange={setSelectedSize}
            />
          </div>

          <button
            type="button"
            onClick={() => void handleAddToCart()}
            disabled={adding || !selectedColor || !selectedSize}
            className="mt-7 w-full cursor-pointer rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_rgba(168,85,247,0.35)] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(217,70,239,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {adding ? t('store.productDetails.addingToCart') : t('store.productDetails.addToCart')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AddToCartModal({ product, isOpen, onClose }: AddToCartModalProps) {
  if (!isOpen || !product) return null

  return createPortal(
    <AddToCartModalContent key={product.id} product={product} onClose={onClose} />,
    document.body,
  )
}
