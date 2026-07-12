import { useTranslation } from 'react-i18next'
import { formatProductPrice } from '../../utils/productDisplay'

interface OrderSummaryProps {
  itemCount: number
  total: number
  priceLocale: string
  currency: string
  onCheckout?: () => void
}

export default function OrderSummary({
  itemCount,
  total,
  priceLocale,
  currency,
  onCheckout,
}: OrderSummaryProps) {
  const { t } = useTranslation()

  return (
    <aside
      className="sticky top-28 overflow-hidden rounded-[2rem] border border-purple-400/20 bg-gradient-to-br from-[#1e1033] via-[#3b0764] to-[#581c87] p-6 text-white shadow-[0_30px_90px_rgba(124,58,237,0.35)] backdrop-blur-xl lg:p-7"
      data-aos="fade-left"
    >
      <div
        className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-500/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-8 -start-8 h-28 w-28 rounded-full bg-purple-400/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative">
        <h2 className="text-xl font-extrabold">{t('cart.summaryTitle')}</h2>

        <div className="mt-6 space-y-4 border-b border-white/10 pb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-100/90">{t('cart.itemsCount')}</span>
            <span className="font-bold">{itemCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-100/90">{t('cart.subtotalLabel')}</span>
            <span className="font-bold">
              {formatProductPrice(total, priceLocale, currency)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-100/90">{t('cart.delivery')}</span>
            <span className="font-semibold text-purple-100/75">{t('cart.deliveryLater')}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-base font-semibold text-purple-100">{t('cart.total')}</span>
          <span className="text-3xl font-extrabold text-white">
            {formatProductPrice(total, priceLocale, currency)}
          </span>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          className="mt-7 w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(217,70,239,0.35)] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(217,70,239,0.45)]"
        >
          {t('cart.checkout')}
        </button>
      </div>
    </aside>
  )
}
