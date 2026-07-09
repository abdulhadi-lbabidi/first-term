import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import ProductColorSizePicker from '../../components/Product/ProductColorSizePicker'
import ProductShowcaseCard from '../../components/Product/ProductShowcaseCard'
import ProductGallery from '../../components/ProductGallery/ProductGallery'
import ErrorState from '../../components/UiStates/ErrorState'
import LoadingState from '../../components/UiStates/LoadingState'
import { PAGE_PADDING } from '../../constants/layout'
import { useAddProductToCart } from '../../hooks/useAddProductToCart'
import { getProductById, getProducts } from '../../services/api'
import type { Product, ProductColor } from '../../types/product'
import type { ProductPageProps } from '../../types/navigation'
import {
  DEFAULT_PRODUCT_FALLBACK,
  getProductDisplay,
  mapProductToShowcase,
} from '../../utils/productDisplay'
import { getRelatedProducts } from '../../utils/storeFilters'

export default function ProductDetails({
  currentPage,
  onNavigate,
  productId,
}: ProductPageProps) {
  const { t, i18n } = useTranslation()
  const { adding, submitAddToCart } = useAddProductToCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null)
  const [selectedSize, setSelectedSize] = useState('')

  const priceLocale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const currency = t('store.currency')

  const loadProduct = useCallback(() => {
    if (productId === undefined) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(false)

    Promise.all([getProductById(productId), getProducts()])
      .then(([productData, productsData]) => {
        setProduct(productData)
        setAllProducts(productsData)
        setSelectedColor(productData.colors[0] ?? null)
        setSelectedSize(productData.sizes[0] ?? '')
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [productId])

  useEffect(() => {
    loadProduct()
  }, [loadProduct])

  const relatedProducts = useMemo(
    () => (product ? getRelatedProducts(allProducts, product) : []),
    [allProducts, product],
  )

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col">
        <Navbar currentPage={currentPage} onNavigate={onNavigate} />
        <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-[#faf7ff] via-white to-[#f5f0ff] pt-[calc(72px+48px)]">
          <LoadingState />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-svh flex-col">
        <Navbar currentPage={currentPage} onNavigate={onNavigate} />
        <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-[#faf7ff] via-white to-[#f5f0ff] px-6 pt-[calc(72px+48px)]">
          <div className="w-full max-w-md">
            {!product && !error ? (
              <div
                className="rounded-[2rem] border border-purple-100 bg-white/90 px-8 py-14 text-center shadow-[0_25px_80px_rgba(168,85,247,0.18)] backdrop-blur-xl"
                data-aos="fade-up"
              >
                <h1 className="text-2xl font-extrabold text-[#1e1033]">
                  {t('store.productDetails.notFound')}
                </h1>
                <p className="mt-3 text-sm text-[#7c6b92]">
                  {t('store.productDetails.notFoundDescription')}
                </p>
                <button
                  type="button"
                  onClick={() => onNavigate('store')}
                  className="mt-8 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-500 ease-out hover:scale-[1.02]"
                >
                  {t('store.productDetails.backToStore')}
                </button>
              </div>
            ) : (
              <ErrorState onRetry={loadProduct} />
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const display = getProductDisplay(product, t, priceLocale, currency)

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return
    void submitAddToCart(product, selectedColor, selectedSize)
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar currentPage={currentPage} onNavigate={onNavigate} />

      <main className="relative flex-1 bg-gradient-to-b from-[#faf7ff] via-white to-[#f5f0ff] pb-20 pt-[calc(72px+48px)] max-md:pt-[calc(72px+32px)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(124,58,237,0.08),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(217,70,239,0.06),transparent_50%)]"
          aria-hidden="true"
        />

        <div className={`${PAGE_PADDING} relative`}>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div data-aos="fade-right">
              <article className="rounded-[2rem] border border-purple-100 bg-white/90 p-6 shadow-[0_25px_80px_rgba(168,85,247,0.15)] backdrop-blur-xl sm:p-8">
                <span className="inline-block rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-[11px] font-semibold text-purple-700">
                  {t('store.productDetails.featured')}
                </span>

                <h1 className="mt-4 text-[clamp(28px,4vw,40px)] font-extrabold leading-snug text-[#1e1033]">
                  {display.name}
                </h1>

                <p className="mt-2 text-sm font-semibold text-[#7c6b92]">
                  {t('store.productDetails.codeLabel', { code: product.code })}
                </p>

                <div className="mt-4 flex items-center gap-3">
                  <p className="text-3xl font-extrabold text-purple-700">{display.price}</p>
                  {display.oldPrice && (
                    <p className="text-base text-[#8b7fa0] line-through">{display.oldPrice}</p>
                  )}
                </div>

                <p className="mt-6 text-[16px] leading-relaxed text-[#5b4d6d]">
                  {display.description}
                </p>

                <div className="mt-8">
                  <ProductColorSizePicker
                    colors={product.colors}
                    sizes={product.sizes}
                    selectedColor={selectedColor}
                    selectedSize={selectedSize}
                    onColorChange={setSelectedColor}
                    onSizeChange={setSelectedSize}
                  />
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={adding || !selectedColor || !selectedSize}
                    className="flex-1 cursor-pointer rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_rgba(168,85,247,0.35)] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(217,70,239,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {adding
                      ? t('store.productDetails.addingToCart')
                      : t('store.productDetails.addToCart')}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('store')}
                    className="rounded-full border border-purple-200 bg-white px-8 py-3.5 text-sm font-bold text-purple-700 transition-all duration-500 ease-out hover:border-purple-300 hover:bg-purple-50"
                  >
                    {t('store.productDetails.backToStore')}
                  </button>
                </div>
              </article>
            </div>

            <div>
              <ProductGallery
                images={product.images}
                alt={display.name}
                fallback={DEFAULT_PRODUCT_FALLBACK}
              />
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2
                className="mb-8 text-center text-[clamp(24px,3.5vw,34px)] font-extrabold text-[#1e1033]"
                data-aos="fade-up"
              >
                {t('store.productDetails.related')}
              </h2>
              <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:items-stretch">
                {relatedProducts.map((item, index) => {
                  const itemDisplay = getProductDisplay(item, t, priceLocale, currency)
                  return (
                    <ProductShowcaseCard
                      key={item.id}
                      product={mapProductToShowcase(item)}
                      index={index}
                      displayName={itemDisplay.name}
                      displayPrice={itemDisplay.price}
                      displayOldPrice={itemDisplay.oldPrice}
                      onCardClick={() => onNavigate('product', { productId: item.id })}
                    />
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
