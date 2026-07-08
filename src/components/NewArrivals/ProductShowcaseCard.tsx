import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Product } from '../../types'
import { CartIcon, HeartIcon } from '../icons/Icons'

interface ProductShowcaseCardProps {
  product: Product
  index: number
}

export default function ProductShowcaseCard({
  product,
  index,
}: ProductShowcaseCardProps) {
  const { t } = useTranslation()
  const [wishlisted, setWishlisted] = useState(false)
  const isReversed = index % 2 === 1

  const actionButtons = (
    <>
      <button
        type="button"
        onClick={() => setWishlisted((prev) => !prev)}
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-500 ease-out lg:h-10 lg:w-10 [&_svg]:size-[18px] lg:[&_svg]:size-[20px] ${
          wishlisted
            ? 'border-purple-300 bg-purple-50 text-purple-600'
            : 'border-purple-100 bg-white text-[#8b7fa0] hover:border-purple-200 hover:text-purple-600'
        }`}
        aria-label={
          wishlisted
            ? t('newArrivals.removeFromWishlist')
            : t('newArrivals.addToWishlist')
        }
      >
        <HeartIcon filled={wishlisted} />
      </button>

      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-700 text-white shadow-lg shadow-purple-500/30 transition-all duration-500 ease-out group-hover:scale-110 group-hover:rotate-6 hover:bg-purple-600 hover:shadow-purple-500/45 lg:h-11 lg:w-11 [&_svg]:size-[18px] lg:[&_svg]:size-[22px]"
        aria-label={t('newArrivals.addToCart')}
      >
        <CartIcon />
      </button>
    </>
  )

  return (
    <article className="group relative h-full">
      <div
        className="pointer-events-none absolute -inset-2 -z-10 rounded-[28px] bg-purple-500/0 blur-2xl transition-all duration-500 ease-out group-hover:bg-purple-500/20"
        aria-hidden="true"
      />

      <div
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl border border-purple-100/90 bg-white shadow-[0_10px_40px_rgba(30,16,51,0.07)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:border-purple-300/80 group-hover:shadow-[0_28px_60px_rgba(124,58,237,0.18)] lg:h-[300px] lg:flex-row ${
          isReversed
            ? 'lg:flex-row-reverse lg:rtl:flex-row'
            : 'lg:rtl:flex-row-reverse'
        }`}
      >
        <div
          className="relative h-[220px] w-full shrink-0 overflow-hidden sm:h-[240px] lg:h-full lg:w-[65%]"
          style={{ background: product.fallback }}
        >
          <img
            src={product.image}
            alt={t(`newArrivals.products.${product.id}.name`)}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1033]/45 via-[#3b0764]/10 to-transparent" />
          <div className="absolute inset-0 bg-purple-600/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <span className="absolute start-4 top-4 rounded-full border border-white/30 bg-white/92 px-3 py-1 text-[11px] font-bold tracking-wide text-purple-800 backdrop-blur-md">
            {product.sku}
          </span>

          {product.badge && (
            <span className="absolute end-4 top-4 rounded-full bg-purple-700 px-3 py-1 text-[11px] font-bold text-white shadow-lg shadow-purple-500/30">
              {t(`newArrivals.badges.${product.badge}`)}
            </span>
          )}
        </div>

        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col justify-between overflow-hidden p-5 transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:p-6">
          <div className="absolute end-4 top-4 z-10 flex items-center gap-2 max-lg:flex lg:hidden">
            {actionButtons}
          </div>

          <div className="max-lg:pe-24">
            <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#1e1033] transition-colors duration-300 group-hover:text-purple-800">
              {t(`newArrivals.products.${product.id}.name`)}
            </h3>
            <p className="mt-2 text-2xl font-extrabold text-purple-700">
              {t(`newArrivals.products.${product.id}.price`)}
            </p>

            <div className="mt-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b7fa0]">
                {t('newArrivals.colors')}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="h-4 w-4 rounded-full border-2 border-white shadow-sm ring-1 ring-purple-100 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#8b7fa0]">
                {t('newArrivals.sizes')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-md border border-purple-100 bg-purple-50/90 px-2.5 py-1 text-[11px] font-semibold text-purple-700 transition-colors duration-300 group-hover:border-purple-200 group-hover:bg-purple-100"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 hidden items-center justify-end gap-2.5 lg:flex">
            {actionButtons}
          </div>
        </div>
      </div>
    </article>
  )
}
