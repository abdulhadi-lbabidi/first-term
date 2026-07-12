import { useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import { useToast } from '../../components/Toast/Toast'
import { PAGE_PADDING } from '../../constants/layout'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { createOrder } from '../../services/ordersApi'
import type { PageProps } from '../../types/navigation'
import { formatProductPrice } from '../../utils/productDisplay'

interface CheckoutFormState {
  customerName: string
  email: string
  phone: string
  city: string
  address: string
  paymentMethod: 'cash' | 'card'
  cardNumber: string
  cardExpiry: string
  cardCvv: string
}

type CheckoutFieldKey = 'customerName' | 'email' | 'phone' | 'city' | 'address'

const fieldErrorKeys: Record<CheckoutFieldKey, string> = {
  customerName: 'fullName',
  email: 'email',
  phone: 'phone',
  city: 'city',
  address: 'address',
}

const inputClass =
  'w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm text-[#1e1033] outline-none transition-colors duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20'

const inputErrorClass =
  'w-full rounded-2xl border border-red-400 bg-red-50/40 px-4 py-3 text-sm text-[#1e1033] outline-none transition-colors duration-300 focus:border-red-500 focus:ring-2 focus:ring-red-400/25'

const labelClass = 'mb-1.5 block text-sm font-semibold text-[#1e1033]'

function getInputClass(hasError: boolean) {
  return hasError ? inputErrorClass : inputClass
}

export default function Checkout({ currentPage, onNavigate }: PageProps) {
  const { t, i18n } = useTranslation()
  const { currentUser } = useAuth()
  const { cartItems, cartTotal, clearCart } = useCart()
  const { showToast } = useToast()

  const [submitting, setSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CheckoutFieldKey, string>>>({})
  const [form, setForm] = useState<CheckoutFormState>({
    customerName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    paymentMethod: 'cash',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  })

  useEffect(() => {
    if (!currentUser) return
    setForm((prev) => ({
      ...prev,
      customerName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
    }))
  }, [currentUser])

  useEffect(() => {
    if (cartItems.length === 0 && !submitting) {
      onNavigate('cart')
    }
  }, [cartItems.length, onNavigate, submitting])

  const priceLocale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const currency = t('store.currency')

  const clearFieldError = (field: CheckoutFieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validateForm = () => {
    const errors: Partial<Record<CheckoutFieldKey, string>> = {}

    if (!form.customerName.trim()) {
      errors.customerName = t(`checkoutPage.errors.${fieldErrorKeys.customerName}`)
    }
    if (!form.email.trim()) {
      errors.email = t(`checkoutPage.errors.${fieldErrorKeys.email}`)
    }
    if (!form.phone.trim()) {
      errors.phone = t(`checkoutPage.errors.${fieldErrorKeys.phone}`)
    }
    if (!form.city.trim()) {
      errors.city = t(`checkoutPage.errors.${fieldErrorKeys.city}`)
    }
    if (!form.address.trim()) {
      errors.address = t(`checkoutPage.errors.${fieldErrorKeys.address}`)
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!validateForm()) return

    if (cartItems.length === 0) {
      showToast(t('checkoutPage.emptyCart'))
      return
    }

    setSubmitting(true)

    try {
      await createOrder({
        userId: currentUser?.id ?? null,
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        paymentMethod: form.paymentMethod,
        items: cartItems,
        subtotal: cartTotal,
        delivery: 0,
        total: cartTotal,
        status: 'قيد المراجعة',
        createdAt: new Date().toISOString(),
      })

      await clearCart()
      showToast(t('checkoutPage.successToast'))
      window.setTimeout(() => onNavigate('orders'), 700)
    } catch (err) {
      const message = err instanceof Error ? err.message : t('checkoutPage.error')
      showToast(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (cartItems.length === 0) return null

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar currentPage={currentPage} onNavigate={onNavigate} />

      <main className="relative flex-1 bg-gradient-to-b from-[#faf7ff] via-white to-[#f5f0ff] pb-20 pt-[calc(72px+48px)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_15%,rgba(124,58,237,0.08),transparent_55%),radial-gradient(ellipse_at_80%_85%,rgba(217,70,239,0.06),transparent_50%)]"
          aria-hidden="true"
        />

        <section
          className={`${PAGE_PADDING} relative border-b border-purple-100/60 bg-gradient-to-br from-white via-[#faf7ff] to-[#f3e8ff] py-14`}
          data-aos="fade-up"
        >
          <div className="mx-auto max-w-6xl text-center">
            <span className="inline-flex rounded-full border border-purple-200 bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-purple-700 shadow-sm">
              Trend Checkout
            </span>
            <h1 className="mt-5 text-[clamp(30px,4.5vw,46px)] font-extrabold text-[#1e1033]">
              {t('checkoutPage.title')}
            </h1>
            <p className="mt-3 text-base font-medium text-[#7c6b92]">
              {t('checkoutPage.subtitle')}
            </p>
          </div>
        </section>

        <div className={`${PAGE_PADDING} relative mx-auto max-w-6xl py-10`}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <form
              id="checkout-form"
              onSubmit={(event) => void handleSubmit(event)}
              className="rounded-[2rem] border border-purple-100 bg-white/90 p-6 shadow-[0_25px_80px_rgba(168,85,247,0.16)] backdrop-blur-xl sm:p-8"
              data-aos="fade-right"
            >
              <h2 className="text-xl font-extrabold text-[#1e1033]">
                {t('checkoutPage.formTitle')}
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-name" className={labelClass}>
                    {t('checkoutPage.fields.fullName')}
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={form.customerName}
                    onChange={(event) => {
                      clearFieldError('customerName')
                      setForm((prev) => ({ ...prev, customerName: event.target.value }))
                    }}
                    className={getInputClass(Boolean(fieldErrors.customerName))}
                  />
                  {fieldErrors.customerName && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600">
                      {fieldErrors.customerName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="checkout-email" className={labelClass}>
                    {t('checkoutPage.fields.email')}
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={form.email}
                    onChange={(event) => {
                      clearFieldError('email')
                      setForm((prev) => ({ ...prev, email: event.target.value }))
                    }}
                    className={getInputClass(Boolean(fieldErrors.email))}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="checkout-phone" className={labelClass}>
                    {t('checkoutPage.fields.phone')}
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(event) => {
                      clearFieldError('phone')
                      setForm((prev) => ({ ...prev, phone: event.target.value }))
                    }}
                    className={getInputClass(Boolean(fieldErrors.phone))}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.phone}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="checkout-city" className={labelClass}>
                    {t('checkoutPage.fields.city')}
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    value={form.city}
                    onChange={(event) => {
                      clearFieldError('city')
                      setForm((prev) => ({ ...prev, city: event.target.value }))
                    }}
                    className={getInputClass(Boolean(fieldErrors.city))}
                  />
                  {fieldErrors.city && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600">{fieldErrors.city}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="checkout-address" className={labelClass}>
                    {t('checkoutPage.fields.address')}
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={form.address}
                    onChange={(event) => {
                      clearFieldError('address')
                      setForm((prev) => ({ ...prev, address: event.target.value }))
                    }}
                    className={getInputClass(Boolean(fieldErrors.address))}
                  />
                  {fieldErrors.address && (
                    <p className="mt-1.5 text-xs font-semibold text-red-600">
                      {fieldErrors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <p className={labelClass}>{t('checkoutPage.fields.paymentMethod')}</p>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 transition-colors hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={form.paymentMethod === 'cash'}
                      onChange={() => setForm((prev) => ({ ...prev, paymentMethod: 'cash' }))}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-semibold text-[#1e1033]">
                      {t('checkoutPage.payment.cash')}
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-purple-100 bg-white px-4 py-3 transition-colors hover:bg-purple-50/50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={form.paymentMethod === 'card'}
                      onChange={() => setForm((prev) => ({ ...prev, paymentMethod: 'card' }))}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-semibold text-[#1e1033]">
                      {t('checkoutPage.payment.card')}
                    </span>
                  </label>
                </div>
              </div>

              {form.paymentMethod === 'card' && (
                <div className="mt-4 rounded-2xl border border-purple-100 bg-purple-50/40 p-4">
                  <p className="mb-3 text-xs font-semibold text-purple-700">
                    {t('checkoutPage.payment.demoNote')}
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label htmlFor="checkout-card" className={labelClass}>
                        {t('checkoutPage.payment.cardNumber')}
                      </label>
                      <input
                        id="checkout-card"
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={form.cardNumber}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, cardNumber: event.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-expiry" className={labelClass}>
                        {t('checkoutPage.payment.expiry')}
                      </label>
                      <input
                        id="checkout-expiry"
                        type="text"
                        placeholder="MM/YY"
                        value={form.cardExpiry}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, cardExpiry: event.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-cvv" className={labelClass}>
                        {t('checkoutPage.payment.cvv')}
                      </label>
                      <input
                        id="checkout-cvv"
                        type="text"
                        placeholder="123"
                        value={form.cardCvv}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, cardCvv: event.target.value }))
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 w-full rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(217,70,239,0.45)] disabled:cursor-not-allowed disabled:opacity-70 lg:hidden"
              >
                {submitting ? t('checkoutPage.submitting') : t('checkoutPage.confirm')}
              </button>
            </form>

            <aside
              className="sticky top-28 overflow-hidden rounded-[2rem] border border-purple-400/20 bg-gradient-to-br from-[#1e1033] via-[#3b0764] to-[#581c87] p-6 text-white shadow-[0_30px_90px_rgba(124,58,237,0.35)] backdrop-blur-xl lg:p-7"
              data-aos="fade-left"
            >
              <div
                className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl"
                aria-hidden="true"
              />

              <h2 className="text-xl font-extrabold">{t('checkoutPage.summaryTitle')}</h2>

              <div className="mt-5 max-h-72 space-y-3 overflow-y-auto pe-1">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">{item.name}</p>
                      <p className="mt-0.5 text-xs text-purple-100/80">
                        {item.selectedColor.name} · {item.selectedSize} · {item.quantity}x
                      </p>
                      <p className="mt-1 text-xs font-semibold text-fuchsia-200">
                        {formatProductPrice(item.price * item.quantity, priceLocale, currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-purple-100/90">{t('checkoutPage.subtotal')}</span>
                  <span className="font-bold">
                    {formatProductPrice(cartTotal, priceLocale, currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-100/90">{t('checkoutPage.delivery')}</span>
                  <span className="font-semibold text-purple-100/75">
                    {t('checkoutPage.deliveryLater')}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-base font-semibold">{t('checkoutPage.total')}</span>
                  <span className="text-2xl font-extrabold">
                    {formatProductPrice(cartTotal, priceLocale, currency)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={submitting}
                className="mt-7 hidden w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(217,70,239,0.35)] transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 lg:block"
              >
                {submitting ? t('checkoutPage.submitting') : t('checkoutPage.confirm')}
              </button>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
