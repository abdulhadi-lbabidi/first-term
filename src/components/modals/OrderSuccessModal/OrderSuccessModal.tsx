import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { usePriceFormat } from '../../../hooks/usePriceFormat'
import { formatProductPrice } from '../../../utils/productDisplay'

export interface OrderSuccessSummary {
  itemCount: number
  total: number
  city: string
}

interface OrderSuccessModalProps {
  isOpen: boolean
  summary: OrderSuccessSummary | null
  onViewOrders: () => void
  onContinueShopping: () => void
}

const confettiPieces = [
  { top: '12%', left: '18%', color: '#d946ef', delay: '0s', size: 8 },
  { top: '20%', left: '78%', color: '#a855f7', delay: '0.15s', size: 6 },
  { top: '68%', left: '14%', color: '#f0abfc', delay: '0.3s', size: 7 },
  { top: '74%', left: '82%', color: '#c084fc', delay: '0.45s', size: 5 },
  { top: '38%', left: '8%', color: '#e879f9', delay: '0.2s', size: 6 },
  { top: '42%', left: '90%', color: '#9333ea', delay: '0.35s', size: 8 },
  { top: '58%', left: '48%', color: '#f5d0fe', delay: '0.5s', size: 5 },
  { top: '16%', left: '52%', color: '#a78bfa', delay: '0.1s', size: 6 },
]

function SuccessCheckIcon() {
  return (
    <svg viewBox="0 0 52 52" className="h-12 w-12" aria-hidden="true">
      <circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-emerald-400/30"
      />
      <path
        d="M16 27l7 7 14-14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
        style={{
          strokeDasharray: 48,
          strokeDashoffset: 48,
          animation: 'success-check-draw 0.7s ease-out 0.35s forwards',
        }}
      />
    </svg>
  )
}

export default function OrderSuccessModal({
  isOpen,
  summary,
  onViewOrders,
  onContinueShopping,
}: OrderSuccessModalProps) {
  const { t } = useTranslation()
  const { priceLocale, currency } = usePriceFormat()
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setEntered(false)
      return
    }

    const timer = window.setTimeout(() => setEntered(true), 30)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  if (!isOpen || !summary) return null

  return createPortal(
    <>
      <style>{`
        @keyframes success-check-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes success-pop-in {
          0% { opacity: 0; transform: scale(0.82) translateY(24px); }
          70% { transform: scale(1.03) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes success-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(1.12); opacity: 0.9; }
        }
        @keyframes success-confetti-fall {
          0% { opacity: 0; transform: translateY(-12px) rotate(0deg) scale(0.6); }
          20% { opacity: 1; }
          100% { opacity: 0; transform: translateY(42px) rotate(220deg) scale(1); }
        }
        .animate-success-pop-in {
          animation: success-pop-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .animate-success-ring-pulse {
          animation: success-ring-pulse 2.2s ease-in-out infinite;
        }
        .animate-success-confetti {
          animation: success-confetti-fall 2.4s ease-out infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
        <div
          className={`absolute inset-0 bg-[#1e1033]/60 backdrop-blur-md transition-opacity duration-500 ${
            entered ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-success-title"
          className={`relative w-full max-w-md overflow-hidden rounded-[2rem] border border-purple-200/80 bg-gradient-to-br from-white via-[#fdfaff] to-[#f3e8ff] shadow-[0_35px_100px_rgba(124,58,237,0.38)] ${
            entered ? 'animate-success-pop-in' : 'opacity-0'
          }`}
        >
          <div
            className="pointer-events-none absolute -end-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-400/20 blur-3xl animate-glow-drift"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -start-12 bottom-0 h-36 w-36 rounded-full bg-purple-500/15 blur-3xl animate-glow-drift-reverse"
            aria-hidden="true"
          />

          {confettiPieces.map((piece, index) => (
            <span
              key={index}
              className="pointer-events-none absolute animate-success-confetti rounded-sm"
              style={{
                top: piece.top,
                left: piece.left,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                animationDelay: piece.delay,
              }}
              aria-hidden="true"
            />
          ))}

          <div className="relative px-6 py-8 text-center sm:px-8 sm:py-10">
            <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-300/30 to-purple-300/20 animate-success-ring-pulse"
                aria-hidden="true"
              />
              <span
                className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-50 to-purple-50 shadow-inner"
                aria-hidden="true"
              />
              <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_16px_40px_rgba(16,185,129,0.35)]">
                <SuccessCheckIcon />
              </div>
            </div>

            <span className="inline-flex rounded-full border border-purple-200 bg-white/80 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-purple-700 shadow-sm">
              Trend
            </span>

            <h2
              id="order-success-title"
              className="mt-4 text-[clamp(24px,5vw,30px)] font-extrabold leading-tight text-[#1e1033]"
            >
              {t('checkoutPage.successModal.title')}
            </h2>

            <p className="mt-3 text-sm font-medium leading-relaxed text-[#7c6b92]">
              {t('checkoutPage.successModal.subtitle')}
            </p>

            <div className="mt-6 rounded-[1.5rem] border border-purple-100 bg-white/80 p-4 text-start shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-purple-50 pb-3">
                <span className="text-sm text-[#7c6b92]">
                  {t('checkoutPage.successModal.items')}
                </span>
                <span className="text-sm font-bold text-[#1e1033]">
                  {t('checkoutPage.successModal.itemCount', { count: summary.itemCount })}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-purple-50 py-3">
                <span className="text-sm text-[#7c6b92]">
                  {t('checkoutPage.successModal.city')}
                </span>
                <span className="text-sm font-bold text-[#1e1033]">{summary.city}</span>
              </div>
              <div className="flex items-center justify-between gap-3 pt-3">
                <span className="text-sm font-semibold text-[#1e1033]">
                  {t('checkoutPage.successModal.total')}
                </span>
                <span className="text-lg font-extrabold text-purple-700">
                  {formatProductPrice(summary.total, priceLocale, currency)}
                </span>
              </div>
            </div>

            <p className="mt-5 text-xs font-medium text-purple-600/80">
              {t('checkoutPage.successModal.note')}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onContinueShopping}
                className="rounded-full border border-purple-200 bg-white px-5 py-3 text-sm font-bold text-purple-700 transition-all duration-300 hover:bg-purple-50"
              >
                {t('checkoutPage.successModal.continueShopping')}
              </button>
              <button
                type="button"
                onClick={onViewOrders}
                className="rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_36px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-[1.02]"
              >
                {t('checkoutPage.successModal.viewOrders')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
