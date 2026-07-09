import { useTranslation } from 'react-i18next'
import type { CartItem } from '../../types/cart'
import { formatProductPrice } from '../../utils/productDisplay'

interface CartItemCardProps {
  item: CartItem
  index: number
  priceLocale: string
  currency: string
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export default function CartItemCard({
  item,
  index,
  priceLocale,
  currency,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) {
  const { t } = useTranslation()
  const subtotal = item.price * item.quantity

  return (
    <article
      className="group flex flex-col gap-5 overflow-hidden rounded-[2rem] border border-purple-100 bg-white/90 p-5 shadow-[0_20px_70px_rgba(168,85,247,0.16)] backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(168,85,247,0.25)] lg:flex-row lg:items-center lg:gap-6 lg:p-6"
      data-aos="fade-up"
      data-aos-delay={index * 80}
    >
      <div className="relative mx-auto w-full shrink-0 overflow-hidden rounded-2xl lg:mx-0 lg:h-36 lg:w-40">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #c084fc 100%)',
          }}
        />
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="relative h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 lg:h-36"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-xl font-bold text-[#1e1033]">{item.name}</h2>
        <p className="mt-1 text-xs font-semibold tracking-wide text-[#7c6b92]">{item.code}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-[#5b4d6d]">
            <span
              className="h-4 w-4 rounded-full border-2 border-white ring-1 ring-purple-100"
              style={{ backgroundColor: item.selectedColor.value }}
            />
            {item.selectedColor.name}
          </span>
          <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
            {item.selectedSize}
          </span>
        </div>

        <p className="mt-4 text-sm font-semibold text-[#7c6b92]">
          {formatProductPrice(item.price, priceLocale, currency)}
        </p>
      </div>

      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onDecrease}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-200 bg-white text-lg font-bold text-purple-700 transition-all duration-300 hover:border-purple-600 hover:bg-purple-600 hover:text-white"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-8 text-center text-lg font-extrabold text-[#1e1033]">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-purple-200 bg-white text-lg font-bold text-purple-700 transition-all duration-300 hover:border-purple-600 hover:bg-purple-600 hover:text-white"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className="text-center lg:text-end">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8b7fa0]">
            {t('cart.subtotal')}
          </p>
          <p className="text-2xl font-extrabold text-purple-700">
            {formatProductPrice(subtotal, priceLocale, currency)}
          </p>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="rounded-full border border-red-100 bg-red-50 px-5 py-2 text-sm font-bold text-red-600 transition-all duration-300 hover:bg-red-100"
        >
          {t('cart.remove')}
        </button>
      </div>
    </article>
  )
}
