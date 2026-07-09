import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getNewArrivals } from '../../services/api'
import type { Product } from '../../types/product'
import type { NavigateFn } from '../../types/navigation'
import {
  getProductDisplay,
  mapProductToShowcase,
} from '../../utils/productDisplay'
import AddToCartModal from '../AddToCartModal/AddToCartModal'
import LoadingState from '../UiStates/LoadingState'
import ErrorState from '../UiStates/ErrorState'
import ProductShowcaseCard from '../Product/ProductShowcaseCard'

interface NewArrivalsProps {
  onNavigate?: NavigateFn
}

export default function NewArrivals({ onNavigate }: NewArrivalsProps) {
  const { t, i18n } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [cartModalProduct, setCartModalProduct] = useState<Product | null>(null)

  const priceLocale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const currency = t('store.currency')

  const loadProducts = () => {
    setLoading(true)
    setError(false)
    getNewArrivals()
      .then((data) => setProducts(data.slice(0, 4)))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <section className="relative overflow-hidden bg-white py-20 max-md:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(124,58,237,0.09),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(91,33,182,0.07),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="mb-12 flex flex-col items-start justify-between gap-5 max-md:mb-8 md:flex-row md:items-end">
          <div className="text-start" data-aos="fade-up">
            <h2 className="mb-3 text-[clamp(28px,4vw,40px)] font-bold tracking-tight text-[#1e1033]">
              {t('newArrivals.title')}
            </h2>
            <p className="max-w-[560px] text-[17px] text-[#5b4d6d]">
              {t('newArrivals.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate?.('store')}
            className="shrink-0 rounded-full border border-purple-200 bg-white px-6 py-2.5 text-sm font-semibold text-purple-700 shadow-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md hover:shadow-purple-500/15"
          >
            {t('newArrivals.viewAll')}
          </button>
        </div>

        {loading && <LoadingState message={t('store.loadingProducts')} />}
        {error && !loading && (
          <ErrorState message={t('store.loadError')} onRetry={loadProducts} />
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:items-stretch md:gap-6 lg:gap-8">
            {products.map((product, index) => {
              const display = getProductDisplay(product, t, priceLocale, currency)
              return (
                <ProductShowcaseCard
                  key={product.id}
                  product={mapProductToShowcase(product)}
                  index={index}
                  displayName={display.name}
                  displayPrice={display.price}
                  displayOldPrice={display.oldPrice}
                  onCardClick={() =>
                    onNavigate?.('product', { productId: product.id })
                  }
                  onCartClick={() => setCartModalProduct(product)}
                />
              )
            })}
          </div>
        )}
      </div>

      <AddToCartModal
        product={cartModalProduct}
        isOpen={cartModalProduct !== null}
        onClose={() => setCartModalProduct(null)}
      />
    </section>
  )
}
