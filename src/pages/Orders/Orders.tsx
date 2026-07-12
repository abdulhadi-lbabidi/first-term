import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from '../../components/Footer/Footer'
import HeroBackground from '../../components/HeroBackground/HeroBackground'
import Navbar from '../../components/Navbar/Navbar'
import { ChevronDownIcon } from '../../components/icons/Icons'
import ErrorState from '../../components/UiStates/ErrorState'
import LoadingState from '../../components/UiStates/LoadingState'
import { PAGE_PADDING } from '../../constants/layout'
import { heroSlides } from '../../data/home'
import { useAuth } from '../../context/AuthContext'
import { useHeroCarousel } from '../../hooks/useHeroCarousel'
import { getOrdersByUserId } from '../../services/ordersApi'
import type { PageProps } from '../../types/navigation'
import type { Order, OrderStatus } from '../../types/order'
import { formatProductPrice } from '../../utils/productDisplay'

function getStatusBadgeClass(status: OrderStatus) {
  switch (status) {
    case 'قيد المراجعة':
      return 'border-purple-200 bg-purple-100 text-purple-700'
    case 'قيد التجهيز':
      return 'border-amber-200 bg-amber-100 text-amber-800'
    case 'تم الشحن':
      return 'border-blue-200 bg-blue-100 text-blue-700'
    case 'مكتمل':
      return 'border-emerald-200 bg-emerald-100 text-emerald-700'
    default:
      return 'border-purple-200 bg-purple-100 text-purple-700'
  }
}

function formatOrderDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatOrderId(id: number | string) {
  const raw = String(id)
  if (raw.length <= 6 && /^\d+$/.test(raw)) {
    return raw.padStart(4, '0')
  }
  return raw.slice(0, 8).toUpperCase()
}

export default function Orders({ currentPage, onNavigate }: PageProps) {
  const { t, i18n } = useTranslation()
  const { currentUser } = useAuth()
  const { activeSlide } = useHeroCarousel(heroSlides.length)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openOrderId, setOpenOrderId] = useState<number | string | null>(null)

  const priceLocale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const currency = t('store.currency')

  const stats = useMemo(
    () => [
      t('ordersPage.stats.orders'),
      t('ordersPage.stats.tracking'),
      t('ordersPage.stats.experience'),
    ],
    [t],
  )

  const fetchOrders = useCallback(async () => {
    if (!currentUser) {
      setOrders([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const data = await getOrdersByUserId(currentUser.id)
      const sorted = [...data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      setOrders(sorted)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ordersPage.error'))
    } finally {
      setLoading(false)
    }
  }, [currentUser, t])

  useEffect(() => {
    void fetchOrders()
  }, [fetchOrders])

  const getPaymentLabel = (method: Order['paymentMethod']) =>
    method === 'cash' ? t('ordersPage.paymentCash') : t('ordersPage.paymentCard')

  const toggleOrder = (orderId: number | string) => {
    setOpenOrderId((current) => (current === orderId ? null : orderId))
  }

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar currentPage={currentPage} onNavigate={onNavigate} />

      <section className="relative overflow-hidden py-10 pt-[calc(72px+28px)] text-white max-md:py-8 max-md:pt-[calc(72px+20px)]">
        <HeroBackground activeSlide={activeSlide} />

        <div className={`${PAGE_PADDING} relative z-[2]`}>
          <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
            <span className="mb-3 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-semibold text-white backdrop-blur-xl">
              {t('ordersPage.badge')}
            </span>
            <h1 className="text-[clamp(28px,4.5vw,44px)] font-extrabold tracking-tight">
              {t('ordersPage.title')}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-[16px] leading-relaxed text-purple-100/90 max-md:text-sm">
              {t('ordersPage.heroSubtitle')}
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-purple-100/75">
              {t('ordersPage.description')}
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
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(124,58,237,0.08),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(217,70,239,0.06),transparent_50%)]"
          aria-hidden="true"
        />

        <div className={`${PAGE_PADDING} relative w-full py-10`}>
          {!currentUser && (
            <div
              className="mx-auto max-w-lg rounded-[2rem] border border-purple-100 bg-white/90 px-8 py-12 text-center shadow-[0_25px_80px_rgba(168,85,247,0.16)] backdrop-blur-xl"
              data-aos="zoom-in"
            >
              <h2 className="text-2xl font-extrabold text-[#1e1033]">
                {t('ordersPage.loginRequiredTitle')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#7c6b92]">
                {t('ordersPage.loginRequiredText')}
              </p>
              <p className="mt-6 text-sm font-semibold text-purple-700">
                {t('ordersPage.loginHint')}
              </p>
            </div>
          )}

          {currentUser && loading && (
            <div className="py-16">
              <LoadingState message={t('ordersPage.loading')} />
            </div>
          )}

          {currentUser && !loading && error && (
            <div className="mx-auto max-w-lg py-10">
              <ErrorState message={t('ordersPage.error')} onRetry={() => void fetchOrders()} />
            </div>
          )}

          {currentUser && !loading && !error && orders.length === 0 && (
            <div
              className="mx-auto max-w-lg rounded-[2rem] border border-purple-100 bg-white/90 px-8 py-14 text-center shadow-[0_25px_80px_rgba(168,85,247,0.16)] backdrop-blur-xl"
              data-aos="zoom-in"
            >
              <h2 className="text-2xl font-extrabold text-[#1e1033]">{t('ordersPage.emptyTitle')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#7c6b92]">{t('ordersPage.emptyText')}</p>
              <button
                type="button"
                onClick={() => onNavigate('store')}
                className="mt-8 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-[1.02]"
              >
                {t('ordersPage.backToStore')}
              </button>
            </div>
          )}

          {currentUser && !loading && !error && orders.length > 0 && (
            <div
              className="w-full overflow-hidden rounded-[2rem] border border-purple-100 bg-white/90 shadow-[0_25px_80px_rgba(168,85,247,0.14)] backdrop-blur-xl"
              data-aos="fade-up"
            >
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-full table-fixed border-collapse text-start">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#1e1033] via-[#4c1d95] to-[#7c3aed] text-white">
                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold tracking-wide lg:px-5">
                        {t('ordersPage.table.order')}
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold tracking-wide lg:px-5">
                        {t('ordersPage.table.date')}
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold tracking-wide lg:px-5">
                        {t('ordersPage.table.customer')}
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold tracking-wide lg:px-5">
                        {t('ordersPage.table.address')}
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-center text-xs font-bold tracking-wide lg:px-5">
                        {t('ordersPage.table.items')}
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold tracking-wide lg:px-5">
                        {t('ordersPage.table.total')}
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold tracking-wide lg:px-5">
                        {t('ordersPage.table.payment')}
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-xs font-bold tracking-wide lg:px-5">
                        {t('ordersPage.table.status')}
                      </th>
                      <th className="whitespace-nowrap px-4 py-4 text-center text-xs font-bold tracking-wide lg:px-5">
                        {t('ordersPage.table.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => {
                      const isOpen = openOrderId === order.id
                      const itemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0)

                      return (
                        <Fragment key={order.id}>
                          <tr
                            className={`border-b border-purple-100/70 transition-colors duration-300 hover:bg-purple-50/50 ${
                              index % 2 === 1 ? 'bg-[#faf7ff]/60' : 'bg-white'
                            } ${isOpen ? 'bg-purple-50/70' : ''}`}
                          >
                            <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                              <p className="text-sm font-extrabold text-[#1e1033]">
                                #{formatOrderId(order.id)}
                              </p>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-[#5b4d6d] lg:px-5">
                              {formatOrderDate(order.createdAt, priceLocale)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                              <p className="text-sm font-bold text-[#1e1033]">{order.customerName}</p>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                              <p className="text-sm text-[#7c6b92]">
                                {order.city} · {order.address}
                              </p>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                              <div className="flex items-center justify-center gap-2">
                                <div className="flex -space-x-2 rtl:space-x-reverse">
                                  {order.items.slice(0, 3).map((item, itemIndex) => (
                                    <div
                                      key={`${order.id}-thumb-${itemIndex}`}
                                      className="h-8 w-8 overflow-hidden rounded-lg border-2 border-white shadow-sm"
                                    >
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                                <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700">
                                  {itemsCount}
                                </span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-extrabold text-purple-700 lg:px-5">
                              {formatProductPrice(order.total, priceLocale, currency)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-[#5b4d6d] lg:px-5">
                              {getPaymentLabel(order.paymentMethod)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 lg:px-5">
                              <span
                                className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadgeClass(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-center lg:px-5">
                              <button
                                type="button"
                                onClick={() => toggleOrder(order.id)}
                                aria-expanded={isOpen}
                                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-700 transition-all duration-300 hover:bg-purple-100 ${
                                  isOpen ? 'rotate-180 bg-gradient-to-br from-purple-700 to-fuchsia-500 text-white' : ''
                                }`}
                              >
                                <ChevronDownIcon />
                              </button>
                            </td>
                          </tr>

                          {isOpen && (
                            <tr className="border-b border-purple-100/70 bg-[#faf7ff]/80">
                              <td colSpan={9} className="px-5 py-5">
                                <p className="mb-3 text-sm font-extrabold text-[#1e1033]">
                                  {t('ordersPage.table.productsTitle')}
                                </p>
                                <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white">
                                  <table className="w-full border-collapse text-start">
                                    <thead>
                                      <tr className="border-b border-purple-100 bg-purple-50/80">
                                        <th className="px-4 py-3 text-xs font-bold text-[#8b7fa0]">
                                          {t('ordersPage.table.product')}
                                        </th>
                                        <th className="px-4 py-3 text-xs font-bold text-[#8b7fa0]">
                                          {t('ordersPage.table.code')}
                                        </th>
                                        <th className="px-4 py-3 text-xs font-bold text-[#8b7fa0]">
                                          {t('ordersPage.table.specs')}
                                        </th>
                                        <th className="px-4 py-3 text-end text-xs font-bold text-[#8b7fa0]">
                                          {t('ordersPage.table.price')}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.items.map((item, itemIndex) => (
                                        <tr
                                          key={`${order.id}-item-${itemIndex}`}
                                          className="border-b border-purple-50 last:border-0 transition-colors hover:bg-purple-50/40"
                                        >
                                          <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-purple-100">
                                                <img
                                                  src={item.image}
                                                  alt={item.name}
                                                  className="h-full w-full object-cover"
                                                />
                                              </div>
                                              <span className="text-sm font-bold text-[#1e1033]">
                                                {item.name}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3 text-sm font-medium text-[#7c6b92]">
                                            {item.code}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-[#7c6b92]">
                                            {item.selectedColor.name} · {item.selectedSize} ·{' '}
                                            {t('ordersPage.quantity', { count: item.quantity })}
                                          </td>
                                          <td className="px-4 py-3 text-end text-sm font-bold text-purple-700">
                                            {formatProductPrice(
                                              item.price * item.quantity,
                                              priceLocale,
                                              currency,
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
