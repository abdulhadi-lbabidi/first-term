import { useTranslation } from 'react-i18next'
import { offerPosters } from '../../../data/offers'
import type { NavigateFn } from '../../../types/navigation'
import OfferPoster from './OfferPoster'

interface OffersProps {
  onNavigate: NavigateFn
}

export default function Offers({ onNavigate }: OffersProps) {
  const { t } = useTranslation()

  return (
    <section
      id="offers"
      className="relative overflow-hidden bg-gradient-to-br from-[#1a0830] via-[#3b1560] to-[#140624] py-20 text-white max-md:py-14"
    >
      <div
        className="pointer-events-none absolute -start-32 top-16 h-96 w-96 animate-glow-drift rounded-full bg-purple-600/22 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-28 bottom-12 h-80 w-80 animate-glow-drift-reverse rounded-full bg-fuchsia-500/18 blur-3xl [animation-delay:2s]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute start-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute end-1/4 top-1/3 h-72 w-72 rounded-full bg-purple-500/12 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_32%,rgba(255,255,255,0.03)_50%,transparent_68%)]"
        aria-hidden="true"
      />

      <span
        className="pointer-events-none absolute start-1/2 top-[55%] z-0 -translate-x-1/2 -translate-y-1/2 select-none font-black uppercase tracking-[0.15em] text-white/[0.035] max-md:text-[clamp(120px,34vw,200px)] lg:text-[clamp(180px,24vw,320px)]"
        aria-hidden="true"
      >
        {t('offers.ghostSale')}
      </span>

      <div className="container relative">
        <div className="mb-10 text-center max-md:mb-8" data-aos="fade-up">
          <h2 className="text-[clamp(30px,4.5vw,46px)] font-extrabold tracking-tight">
            {t('offers.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-[600px] text-[17px] leading-relaxed text-purple-100/85">
            {t('offers.subtitle')}
          </p>
        </div>

        <div
          className="mx-auto mb-10 flex justify-center max-md:mb-8"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          <span className="rounded-full border border-white/15 bg-white/10 px-5 py-2 text-[11px] font-semibold tracking-wide text-purple-100/90 backdrop-blur-xl max-md:px-4 max-md:text-[10px]">
            {t('offers.ribbon')}
          </span>
        </div>

        <div className="relative mx-auto max-w-[1140px]">
          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-3 lg:items-end lg:gap-7">
            {offerPosters.map((poster, index) => (
              <OfferPoster key={poster.id} poster={poster} index={index} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
