import { useTranslation } from 'react-i18next'
import { aboutHighlights } from '../../../data/aboutStore'
import AboutStoreTimeline from './AboutStoreTimeline'

export default function AboutStore() {
  const { t } = useTranslation()

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gradient-to-b from-[#faf7ff] via-white to-[#f5f0ff] py-20 max-md:py-14"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(124,58,237,0.08),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(217,70,239,0.06),transparent_50%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -start-24 top-20 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-20 bottom-16 h-80 w-80 rounded-full bg-fuchsia-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        <h2
          className="mb-12 text-center text-[clamp(28px,4vw,40px)] font-extrabold tracking-tight text-[#1e1033] max-md:mb-8"
          data-aos="fade-up"
        >
          {t('aboutStore.sectionTitle')}
        </h2>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1" data-aos="fade-right">
            <span className="mb-4 inline-block rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-[11px] font-semibold text-purple-700">
              {t('aboutStore.badge')}
            </span>

            <h3 className="text-[clamp(26px,3.5vw,38px)] font-extrabold leading-snug text-[#1e1033]">
              {t('aboutStore.title')}
            </h3>

            <p className="mt-5 text-[17px] leading-relaxed text-[#5b4d6d]">
              {t('aboutStore.description')}
            </p>

            <ul className="mt-8 space-y-4">
              {aboutHighlights.map((highlightId) => (
                <li
                  key={highlightId}
                  className="flex items-start gap-3 rounded-2xl border border-purple-100/80 bg-white/70 px-4 py-3.5 shadow-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md hover:shadow-purple-500/10"
                >
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    aria-hidden="true"
                  />
                  <span className="text-[15px] font-semibold text-[#1e1033] max-md:text-sm">
                    {t(`aboutStore.highlights.${highlightId}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="order-1 lg:order-2" data-aos="fade-left">
            <div className="group/image relative mx-auto w-full max-w-[520px]">
              <div
                className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-purple-500/25 blur-3xl transition-all duration-500 ease-out group-hover/image:bg-fuchsia-500/30"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-[2rem] border border-purple-100/80 shadow-[0_24px_60px_rgba(124,58,237,0.18)]">
                <div className="aspect-[4/5] bg-gradient-to-br from-purple-800/40 to-fuchsia-700/30 sm:aspect-[5/6]">
                  <img
                    src="/images/about-trend.jpg"
                    alt={t('aboutStore.imageAlt')}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-105"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#16051f]/75 via-[#3b0764]/20 to-transparent" />

                <span className="absolute start-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-xl">
                  {t('aboutStore.imageBadge')}
                </span>

                <div className="absolute bottom-5 start-5 end-5 transition-transform duration-500 ease-out group-hover/image:-translate-y-1 sm:bottom-6 sm:start-6 sm:end-auto sm:max-w-[220px]">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
                    <p className="text-sm font-bold text-white">
                      {t('aboutStore.floatingCard.title')}
                    </p>
                    <p className="mt-1 text-xs text-purple-100/90">
                      {t('aboutStore.floatingCard.text')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AboutStoreTimeline />
      </div>
    </section>
  )
}
