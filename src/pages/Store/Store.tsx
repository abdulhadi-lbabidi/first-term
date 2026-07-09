import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddToCartModal from '../../components/AddToCartModal/AddToCartModal'
import Footer from '../../components/Footer/Footer'
import HeroBackground from '../../components/HeroBackground/HeroBackground'
import Navbar from '../../components/Navbar/Navbar'
import ProductShowcaseCard from '../../components/Product/ProductShowcaseCard'
import ProductFilters from '../../components/ProductFilters/ProductFilters'
import ErrorState from '../../components/UiStates/ErrorState'
import LoadingState from '../../components/UiStates/LoadingState'
import EmptyState from '../../components/UiStates/EmptyState'
import { PAGE_PADDING } from '../../constants/layout'
import { DEFAULT_STORE_FILTERS, type StoreFilters } from '../../data/filters'
import { heroSlides } from '../../data/home'
import { useHeroCarousel } from '../../hooks/useHeroCarousel'
import { getProducts } from '../../services/api'
import type { Product } from '../../types/product'
import type { PageProps } from '../../types/navigation'
import { filterProducts } from '../../utils/storeFilters'
import { getProductDisplay, mapProductToShowcase } from '../../utils/productDisplay'

export default function Store({ currentPage, onNavigate }: PageProps) {
  const { t, i18n } = useTranslation()
  const { activeSlide } = useHeroCarousel(heroSlides.length)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filters, setFilters] = useState<StoreFilters>(DEFAULT_STORE_FILTERS)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [cartModalProduct, setCartModalProduct] = useState<Product | null>(null)

  const priceLocale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const currency = t('store.currency')

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters],
  )

  const stats = useMemo(
    () => [
      t('store.stats.products'),
      t('store.stats.categories'),
      t('store.stats.experience'),
    ],
    [t],
  )

  const loadProducts = () => {
    setLoading(true)
    setError(false)
    getProducts()
      .then(setProducts)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleReset = () => {
    setFilters(DEFAULT_STORE_FILTERS)
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar currentPage={currentPage} onNavigate={onNavigate} />

      <section className="relative overflow-hidden py-10 pt-[calc(72px+28px)] text-white max-md:py-8 max-md:pt-[calc(72px+20px)]">
        <HeroBackground activeSlide={activeSlide} />

        <div className={`${PAGE_PADDING} relative z-[2]`}>
          <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
            <span className="mb-3 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold text-white backdrop-blur-xl">
              {t('store.badge')}
            </span>
            <h1 className="text-[clamp(28px,4.5vw,44px)] font-extrabold tracking-tight">
              {t('store.title')}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-[16px] leading-relaxed text-purple-100/90 max-md:text-sm">
              {t('store.subtitle')}
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-purple-100/75">
              {t('store.description')}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {stats.map((stat) => (
                <span
                  key={stat}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl"
                >
                  {stat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="relative flex-1 bg-gradient-to-b from-white via-[#faf7ff] to-[#f5f0ff] pb-20 pt-10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(124,58,237,0.06),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(217,70,239,0.05),transparent_50%)]"
          aria-hidden="true"
        />

        <div className={`${PAGE_PADDING} relative`}>
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <p className="text-sm font-semibold text-[#5b4d6d]">
              {t('store.productCount', { count: filteredProducts.length })}
            </p>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              className="rounded-full border border-purple-200 bg-white px-4 py-2 text-sm font-bold text-purple-700 shadow-sm transition-all duration-500 ease-out hover:border-purple-300 hover:bg-purple-50"
            >
              {mobileFiltersOpen ? t('store.hideFilters') : t('store.showFilters')}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(230px,250px)_1fr] lg:gap-6 xl:gap-8">
            <div className={`${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              <div
                className="overflow-visible rounded-[1.25rem] border border-purple-100 bg-white/80 p-4 shadow-[0_16px_48px_rgba(124,58,237,0.1)] backdrop-blur-xl lg:sticky lg:top-[96px]"
                data-aos="fade-left"
              >
                <ProductFilters
                  filters={filters}
                  onChange={setFilters}
                  onReset={handleReset}
                />
              </div>
            </div>

            <div className="min-w-0">
              {loading && <LoadingState message={t('store.loadingProducts')} />}
              {error && !loading && (
                <ErrorState message={t('store.loadError')} onRetry={loadProducts} />
              )}
              {!loading && !error && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:items-stretch">
                  {filteredProducts.map((product, index) => {
                    const display = getProductDisplay(product, t, priceLocale, currency)
                    return (
                      <ProductShowcaseCard
                        key={product.id}
                        product={mapProductToShowcase(product)}
                        index={index}
                        displayName={display.name}
                        displayPrice={display.price}
                        displayOldPrice={display.oldPrice}
                        onCardClick={() => onNavigate('product', { productId: product.id })}
                        onCartClick={() => setCartModalProduct(product)}
                      />
                    )
                  })}
                </div>
              )}
              {!loading && !error && filteredProducts.length === 0 && (
                <EmptyState
                  message={t('store.empty.title')}
                  description={t('store.empty.description')}
                  actionLabel={t('store.filters.reset')}
                  onAction={handleReset}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AddToCartModal
        product={cartModalProduct}
        isOpen={cartModalProduct !== null}
        onClose={() => setCartModalProduct(null)}
      />
    </div>
  )
}
