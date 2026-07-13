import { useTranslation } from 'react-i18next'
import type { OfferPosterData } from '../../../data/offers'
import type { NavigateFn } from '../../../types/navigation'
import { aosDelay } from '../../../utils/aos'

interface OfferPosterProps {
  poster: OfferPosterData
  index: number
  onNavigate: NavigateFn
}

const buttonClasses =
  'inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/40 transition-all duration-500 ease-out hover:scale-105 hover:shadow-xl hover:shadow-fuchsia-500/50 max-md:px-6 max-md:py-2.5 max-md:text-xs'

export default function OfferPoster({ poster, index, onNavigate }: OfferPosterProps) {
  const { t } = useTranslation()
  const posterKey = `offers.posters.${poster.id}`

  return (
    <div
      className={`relative w-full animate-offer-float ${poster.desktopOffset}`}
      data-aos="fade-up"
      data-aos-delay={aosDelay(index)}
      style={{
        animationDuration: poster.floatDuration,
        animationDelay: poster.floatDelay,
      }}
    >
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-purple-600/15 blur-3xl"
        aria-hidden="true"
      />

      <article
        className={`group relative h-[440px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-[0_20px_80px_rgba(168,85,247,0.25)] transition-all duration-700 ease-out hover:-translate-y-4 hover:rotate-0 hover:border-white/20 hover:shadow-[0_30px_100px_rgba(217,70,239,0.35)] max-md:h-[420px] ${poster.desktopHeight} ${poster.rotationClass}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#3b0764] to-[#581c87]">
          <img
            src={poster.image}
            alt={t(`${posterKey}.title`)}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[2] overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -inset-y-8 start-[-60%] w-[55%] rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:start-[120%] group-hover:opacity-100" />
        </div>

        <span className="absolute start-5 top-5 z-20 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-white backdrop-blur-xl">
          {t(`${posterKey}.badge`)}
        </span>

        <div className="absolute inset-x-0 bottom-0 z-10 max-h-[45%]">
          <div className="flex h-full flex-col justify-end bg-gradient-to-t from-black/55 via-[#2a1045]/40 to-transparent px-6 pb-6 pt-10 max-md:px-5 max-md:pb-5 max-md:pt-8">
            <h3 className="text-[clamp(22px,2.8vw,30px)] font-black leading-tight text-white">
              {t(`${posterKey}.title`)}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-purple-100/92 max-md:text-[13px]">
              {t(`${posterKey}.description`)}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-xl">
                {t('offers.codeLabel', { code: poster.code })}
              </span>

              <button
                type="button"
                onClick={() => onNavigate('store')}
                className={buttonClasses}
              >
                {t(`${posterKey}.buttonText`)}
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
