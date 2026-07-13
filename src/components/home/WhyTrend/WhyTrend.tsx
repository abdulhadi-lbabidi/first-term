import { useTranslation } from 'react-i18next'
import {
  whyTrendFeatureFloat,
  whyTrendFeaturePositions,
  whyTrendImageBadges,
  whyTrendItems,
} from '../../../data/whyTrend'
import WhyTrendFeatureCard from './WhyTrendFeatureCard'
import WhyTrendStatsStrip from './WhyTrendStatsStrip'

export default function WhyTrend() {
  const { t } = useTranslation()

  return (
    <section
      id="why-trend"
      className="relative overflow-hidden bg-gradient-to-br from-[#1a0830] via-[#3b1560] to-[#140624] py-20 text-white max-md:py-14"
    >
      <div
        className="pointer-events-none absolute -start-24 top-16 h-80 w-80 animate-glow-drift rounded-full bg-purple-600/16 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-20 bottom-10 h-96 w-96 animate-glow-drift-reverse rounded-full bg-fuchsia-500/10 blur-3xl [animation-delay:2s]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute start-1/2 top-1/3 h-64 w-64 animate-glow-pulse rounded-full bg-white/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_35%,rgba(255,255,255,0.04)_50%,transparent_65%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(215deg,transparent_40%,rgba(192,132,252,0.06)_52%,transparent_64%)]"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="mb-6 text-center max-md:mb-5" data-aos="fade-up">
          <h2 className="text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight">
            {t('whyTrend.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-[680px] text-[17px] leading-relaxed text-purple-100/85">
            {t('whyTrend.subtitle')}
          </p>
        </div>

        <div className="relative mx-auto max-w-[1100px] md:min-h-[500px] lg:min-h-[580px]">
          <div
            className="group/image relative z-10 mx-auto w-full max-w-[300px] rotate-[-2deg] transition-transform duration-500 ease-out hover:rotate-[-1deg] md:absolute md:left-1/2 md:top-1/2 md:max-w-[220px] md:-translate-x-1/2 md:-translate-y-1/2 lg:max-w-[320px]"
            data-aos="zoom-in"
            data-aos-delay="120"
          >
            <div
              className="pointer-events-none absolute -inset-5 rounded-[2.5rem] bg-purple-500/22 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 shadow-[0_24px_80px_rgba(124,58,237,0.45)]">
              <div className="aspect-[4/5] bg-gradient-to-br from-purple-800/60 to-fuchsia-700/40">
                <img
                  src="/images/why-trend.jpg"
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-105"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0830]/45 via-transparent to-transparent" />

              

              <div className="absolute bottom-4 start-4 end-4 flex flex-wrap gap-2">
                {whyTrendImageBadges.map((key) => (
                  <span
                    key={key}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold backdrop-blur-md"
                  >
                    {t(`whyTrend.image.badges.${key}`)}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex flex-col gap-5 max-md:gap-12 md:absolute md:inset-0 md:mt-0">
            {whyTrendItems.map((item, index) => (
              <WhyTrendFeatureCard
                key={item.id}
                item={item}
                index={index}
                className={whyTrendFeaturePositions[item.id]}
                floatClass={whyTrendFeatureFloat[item.id]}
              />
            ))}
          </div>
        </div>

        <WhyTrendStatsStrip />
      </div>
    </section>
  )
}
