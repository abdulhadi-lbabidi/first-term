import { useCallback, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { ShowcaseProduct } from '../../types'
import { aosDelay } from '../../utils/aos'
import { CartIcon, HeartIcon } from '../common/icons/Icons'
import ProductImageCarousel from './ProductImageCarousel/ProductImageCarousel'

interface ProductShowcaseCardProps {
  product: ShowcaseProduct
  index: number
  displayName?: string
  displayPrice?: string
  displayOldPrice?: string
  onCardClick?: () => void
  onCartClick?: (slideIndex: number) => void
}

function stopCardNavigation(event: MouseEvent) {
  event.stopPropagation()
}

export default function ProductShowcaseCard({
  product,
  index,
  displayName,
  displayPrice,
  displayOldPrice,
  onCardClick,
  onCartClick,
}: ProductShowcaseCardProps) {
  const { t } = useTranslation()
  const [wishlisted, setWishlisted] = useState(false)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)

  const name = displayName ?? t(`newArrivals.products.${product.id}.name`)
  const price = displayPrice ?? t(`newArrivals.products.${product.id}.price`)

  const activeColor =
    product.colors.length > 0
      ? product.colors[activeSlide % product.colors.length]
      : null
  const activeSize =
    product.sizes.length > 0
      ? product.sizes[activeSlide % product.sizes.length]
      : null

  const handleActiveIndexChange = useCallback((slideIndex: number) => {
    setActiveSlide(slideIndex)
  }, [])

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onCardClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onCardClick()
    }
  }

  return (
    <article
      className="group relative h-full"
      data-aos="fade-up"
      data-aos-delay={aosDelay(index)}
      onMouseEnter={() => setCarouselPaused(true)}
      onMouseLeave={() => setCarouselPaused(false)}
    >
      <div
        className="pointer-events-none absolute -inset-2 -z-10 rounded-[28px] bg-purple-500/0 blur-2xl transition-all duration-500 ease-out group-hover:bg-purple-500/20"
        aria-hidden="true"
      />

      <div
        role={onCardClick ? 'button' : undefined}
        tabIndex={onCardClick ? 0 : undefined}
        onClick={onCardClick}
        onKeyDown={handleCardKeyDown}
        className={`relative h-[300px] overflow-hidden rounded-3xl shadow-[0_14px_40px_rgba(30,16,51,0.18)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_28px_60px_rgba(124,58,237,0.28)] sm:h-[320px] lg:h-[340px] ${
          onCardClick ? 'cursor-pointer' : ''
        }`}
        style={{ background: product.fallback }}
      >
        <ProductImageCarousel
          images={product.images}
          alt={name}
          paused={carouselPaused}
          onActiveIndexChange={handleActiveIndexChange}
        />

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1e1033]/75 via-[#1e1033]/15 to-black/20"
          aria-hidden="true"
        />

        <div className="absolute start-3 top-3 z-20">
          <span className="rounded-xl border border-white/25 bg-black/25 px-2.5 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-md">
            {product.sku}
          </span>
        </div>

        <div className="absolute end-3 top-3 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              stopCardNavigation(event)
              setWishlisted((prev) => !prev)
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-300 [&_svg]:size-[17px] ${
              wishlisted
                ? 'border-fuchsia-300/50 bg-fuchsia-500/90 text-white'
                : 'border-white/30 bg-black/25 text-white hover:bg-white/20'
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
            onClick={(event) => {
              stopCardNavigation(event)
              onCartClick?.(activeSlide)
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-purple-700 text-white shadow-lg shadow-purple-500/35 transition-all duration-300 hover:scale-105 hover:bg-purple-600 [&_svg]:size-[17px]"
            aria-label={t('newArrivals.addToCart')}
          >
            <CartIcon />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold leading-snug text-white drop-shadow-sm sm:text-lg">
              {name}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-lg font-extrabold text-white sm:text-xl">{price}</p>
              {displayOldPrice && (
                <p className="text-sm text-white/60 line-through">{displayOldPrice}</p>
              )}
            </div>
          </div>

          {(activeColor || activeSize) && (
            <div className="flex shrink-0 items-center gap-2">
              {activeColor && (
                <span
                  className="h-5 w-5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                  style={{ backgroundColor: activeColor }}
                  title={activeColor}
                  aria-label={t('newArrivals.colors')}
                />
              )}
              {activeSize && (
                <span className="rounded-lg border border-white/35 bg-black/30 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
                  {activeSize}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
