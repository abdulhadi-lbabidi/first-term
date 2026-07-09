import { useTranslation } from 'react-i18next'
import CartItemCard from '../../components/CartItemCard/CartItemCard'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import OrderSummary from '../../components/OrderSummary/OrderSummary'
import { useToast } from '../../components/Toast/Toast'
import ErrorState from '../../components/UiStates/ErrorState'
import LoadingState from '../../components/UiStates/LoadingState'
import { PAGE_PADDING } from '../../constants/layout'
import { useCart } from '../../context/CartContext'
import type { PageProps } from '../../types/navigation'

function CartEmptyIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-16 w-16 text-purple-300"
      aria-hidden="true"
    >
      <path
        d="M18 22h28l-3 24H21L18 22Z"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M14 22h36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="26" cy="52" r="2.5" fill="currentColor" />
      <circle cx="40" cy="52" r="2.5" fill="currentColor" />
      <path
        d="M24 22l2-8h12l2 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Cart({ currentPage, onNavigate }: PageProps) {
  const { t, i18n } = useTranslation()
  const { showToast } = useToast()
  const {
    cartItems,
    cartCount,
    cartTotal,
    loading,
    error,
    fetchCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()

  const priceLocale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const currency = t('store.currency')

  const handleIncrease = async (itemId: number) => {
    try {
      await increaseQuantity(itemId)
      showToast(t('cart.quantityUpdated'))
    } catch {
      showToast(t('cart.error'))
    }
  }

  const handleDecrease = async (itemId: number) => {
    try {
      await decreaseQuantity(itemId)
      showToast(t('cart.quantityUpdated'))
    } catch {
      showToast(t('cart.error'))
    }
  }

  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId)
      showToast(t('cart.removedFromCart'))
    } catch {
      showToast(t('cart.error'))
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar currentPage={currentPage} onNavigate={onNavigate} />

      <main className="relative flex-1 bg-gradient-to-b from-[#faf7ff] via-white to-[#f5f0ff] pb-20 pt-[calc(72px+48px)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(124,58,237,0.08),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(217,70,239,0.06),transparent_50%)]"
          aria-hidden="true"
        />

        <section
          className={`${PAGE_PADDING} relative border-b border-purple-100/60 bg-gradient-to-br from-white via-[#faf7ff] to-[#f3e8ff] py-14`}
          data-aos="fade-up"
        >
          <div className="mx-auto max-w-6xl text-center">
            <span className="inline-flex rounded-full border border-purple-200 bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-purple-700 shadow-sm">
              {t('cart.badge')}
            </span>
            <h1 className="mt-5 text-[clamp(30px,4.5vw,46px)] font-extrabold text-[#1e1033]">
              {t('cart.title')}
            </h1>
            <p className="mt-3 text-base font-medium text-[#7c6b92]">{t('cart.subtitle')}</p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#8b7fa0]">
              {t('cart.heroText')}
            </p>
          </div>
        </section>

        <div className={`${PAGE_PADDING} relative mx-auto max-w-6xl py-10`}>
          {loading && (
            <div className="py-16">
              <LoadingState message={t('cart.loading')} />
            </div>
          )}

          {!loading && error && (
            <div className="max-w-lg mx-auto py-10">
              <ErrorState message={t('cart.error')} onRetry={() => void fetchCart()} />
            </div>
          )}

          {!loading && !error && cartItems.length === 0 && (
            <div
              className="mx-auto max-w-lg rounded-[2rem] border border-purple-100 bg-white/90 px-8 py-14 text-center shadow-[0_25px_80px_rgba(168,85,247,0.18)] backdrop-blur-xl"
              data-aos="zoom-in"
            >
              <CartEmptyIcon />
              <h2 className="mt-6 text-2xl font-extrabold text-[#1e1033]">{t('cart.emptyTitle')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#7c6b92]">{t('cart.emptyText')}</p>
              <button
                type="button"
                onClick={() => onNavigate('store')}
                className="mt-8 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_rgba(168,85,247,0.35)] transition-all duration-500 ease-out hover:scale-[1.02]"
              >
                {t('cart.backToStore')}
              </button>
            </div>
          )}

          {!loading && !error && cartItems.length > 0 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
              <div className="space-y-5">
                {cartItems.map((item, index) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    priceLocale={priceLocale}
                    currency={currency}
                    onIncrease={() => void handleIncrease(item.id)}
                    onDecrease={() => void handleDecrease(item.id)}
                    onRemove={() => void handleRemove(item.id)}
                  />
                ))}
              </div>

              <OrderSummary
                itemCount={cartCount}
                total={cartTotal}
                priceLocale={priceLocale}
                currency={currency}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
