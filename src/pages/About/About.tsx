import { useEffect, useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'
import { useTranslation } from 'react-i18next'
import Footer from '../../components/layout/Footer/Footer'
import HeroBackground from '../../components/layout/HeroBackground/HeroBackground'
import Navbar from '../../components/layout/Navbar/Navbar'
import {
  aboutDifferenceFeatures,
  aboutDifferenceImage,
  aboutHeroBadges,
  aboutStats,
  aboutStoryHighlights,
  aboutStoryImage,
  aboutTimelineStepConfig,
  aboutValues,
  visionMissionCards,
  valuesOrbitLines,
  ABOUT_TIMELINE_PROGRESS_MS,
  ABOUT_TIMELINE_STEP_DELAYS_MS,
} from '../../data/aboutPage'
import { heroSlides } from '../../data/home'
import { useCountUp } from '../../hooks/useCountUp'
import HeroCarouselDots from '../../components/layout/HeroCarouselDots/HeroCarouselDots'
import { useHeroCarousel } from '../../hooks/useHeroCarousel'
import { useInView } from '../../hooks/useInView'
import type { AppPage, NavigateFn, PageProps } from '../../types/navigation'
import { aosDelay } from '../../utils/aos'

function hideBrokenImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = 'none'
}

function AboutHero({
  onNavigate,
  currentPage,
}: {
  onNavigate: NavigateFn
  currentPage: AppPage
}) {
  const { t } = useTranslation()
  const { activeSlide, goToSlide } = useHeroCarousel(heroSlides.length)

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden text-white">
      <HeroBackground activeSlide={activeSlide} />

      <Navbar overlay currentPage={currentPage} onNavigate={onNavigate} />

      <div className="container relative z-[2] flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-[calc(72px+64px)] text-center max-md:pb-24 max-md:pt-[calc(72px+48px)]">
        <h1
          className="max-w-4xl text-[clamp(32px,5vw,56px)] font-extrabold leading-tight tracking-tight"
          data-aos="fade-up"
          data-aos-delay="0"
        >
          {t('aboutPage.hero.title')}
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-purple-100/90 max-md:text-base"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          {t('aboutPage.hero.subtitle')}
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          data-aos="fade-up"
          data-aos-delay="240"
        >
          <button
            type="button"
            onClick={() => onNavigate('store')}
            className="rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_40px_rgba(168,85,247,0.4)] transition-all duration-500 ease-out hover:scale-[1.03] hover:shadow-[0_16px_48px_rgba(217,70,239,0.5)]"
          >
            {t('aboutPage.hero.shopNow')}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('store')}
            className="rounded-full border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition-all duration-500 ease-out hover:bg-white/20"
          >
            {t('aboutPage.hero.browseCategories')}
          </button>
        </div>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-3 max-md:px-2"
          data-aos="fade-up"
          data-aos-delay="360"
        >
          {aboutHeroBadges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-xl"
            >
              {t(`aboutPage.hero.badges.${badge}`)}
            </span>
          ))}
        </div>
      </div>

      <HeroCarouselDots
        slides={heroSlides}
        activeSlide={activeSlide}
        onGoToSlide={goToSlide}
      />
    </section>
  )
}

function BrandStory() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7ff] via-white to-[#f5f0ff] py-20 max-md:py-14">
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

      <div className="container relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div data-aos="fade-right">
          <span className="mb-4 inline-block rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-[11px] font-semibold text-purple-700">
            {t('aboutPage.story.badge')}
          </span>
          <h2 className="text-[clamp(26px,3.5vw,38px)] font-extrabold leading-snug text-[#1e1033]">
            {t('aboutPage.story.title')}
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#5b4d6d] max-md:text-base">
            {t('aboutPage.story.description')}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {aboutStoryHighlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-semibold text-purple-800 shadow-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md hover:shadow-purple-500/10"
              >
                {t(`aboutPage.story.highlights.${highlight}`)}
              </span>
            ))}
          </div>
        </div>

        <div className="group/image relative mx-auto w-full max-w-[520px]" data-aos="fade-left">
          <div
            className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-purple-500/25 blur-3xl transition-all duration-500 ease-out group-hover/image:bg-fuchsia-500/30"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-purple-100/80 shadow-[0_24px_60px_rgba(124,58,237,0.18)]">
            <div className="aspect-[4/5] bg-gradient-to-br from-purple-800/40 to-fuchsia-700/30">
              <img
                src={aboutStoryImage}
                alt={t('aboutPage.story.imageAlt')}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-105"
                onError={hideBrokenImage}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#16051f]/75 via-[#3b0764]/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}

function VisionMission() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7ff] via-white to-[#f3ebff] py-24 max-md:py-16">
      <div
        className="pointer-events-none absolute -start-32 top-16 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-24 bottom-10 h-80 w-80 rounded-full bg-fuchsia-400/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute start-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-300/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          {visionMissionCards.map((card) => (
              <article
                key={card.id}
                data-aos={card.id === 'vision' ? 'fade-right' : 'fade-left'}
                className={`group relative overflow-hidden rounded-[2rem] border border-purple-100 bg-white/80 p-8 shadow-[0_25px_80px_rgba(168,85,247,0.18)] backdrop-blur-xl transition-all duration-700 ease-out hover:-translate-y-3 hover:rotate-0 hover:shadow-[0_35px_100px_rgba(168,85,247,0.28)] max-md:p-6 ${card.rotation}`}
              >
                <span
                  className="pointer-events-none absolute -bottom-4 start-4 select-none text-[clamp(64px,10vw,120px)] font-black uppercase leading-none tracking-wider text-purple-500/[0.04]"
                  aria-hidden="true"
                >
                  {card.ghost}
                </span>

                <div
                  className="absolute inset-x-0 top-0 h-0.5 overflow-hidden rounded-t-[2rem] bg-purple-100"
                  aria-hidden="true"
                >
                  <div className="h-full w-full animate-timeline-flow bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 rtl:bg-gradient-to-l" />
                </div>

                <div
                  className="pointer-events-none absolute -inset-4 rounded-[2.25rem] bg-gradient-to-br from-purple-400/10 to-fuchsia-400/10 opacity-0 blur-2xl transition-opacity duration-500 ease-out group-hover:opacity-100"
                  aria-hidden="true"
                />

                <div className="relative pt-2">
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-700 via-fuchsia-600 to-purple-500 text-sm font-black text-white shadow-[0_8px_28px_rgba(168,85,247,0.4)]">
                    {card.number}
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#1e1033]">
                    {t(`aboutPage.visionMission.${card.id}.title`)}
                  </h3>
                  <p className="mt-4 text-[16px] leading-relaxed text-[#5b4d6d]">
                    {t(`aboutPage.visionMission.${card.id}.text`)}
                  </p>
                </div>
              </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ValueOrbitCard({
  value,
  index,
  layout,
}: {
  value: (typeof aboutValues)[number]
  index: number
  layout: 'orbit' | 'stack'
}) {
  const { t } = useTranslation()

  const positionClass = layout === 'orbit' ? `absolute w-[min(100%,220px)] ${value.position}` : ''

  return (
    <article
      data-aos="fade-up"
      data-aos-delay={aosDelay(index)}
      className={`group rounded-[2rem] border border-purple-100 bg-white/85 p-5 shadow-[0_16px_50px_rgba(124,58,237,0.12)] backdrop-blur-xl transition-all duration-700 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:border-purple-200 hover:shadow-[0_24px_60px_rgba(168,85,247,0.22)] max-md:p-5 ${positionClass} ${value.floatClass}`}
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-fuchsia-50 text-xs font-black text-purple-700 transition-all duration-500 ease-out group-hover:from-purple-600 group-hover:to-fuchsia-500 group-hover:text-white group-hover:shadow-[0_8px_24px_rgba(168,85,247,0.35)]">
        {value.number}
      </span>
      <h3 className="mt-3 text-base font-bold text-[#1e1033]">
        {t(`aboutPage.values.items.${value.id}.title`)}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[#7c6b92]">
        {t(`aboutPage.values.items.${value.id}.description`)}
      </p>
    </article>
  )
}

function ValuesSection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#faf7ff] to-[#f5f0ff] py-24 max-md:py-16">
      <div
        className="pointer-events-none absolute -start-20 top-24 h-72 w-72 rounded-full bg-purple-400/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-16 bottom-20 h-80 w-80 rounded-full bg-fuchsia-400/12 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="mb-14 text-center max-md:mb-10" data-aos="fade-up">
          <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold text-[#1e1033]">
            {t('aboutPage.values.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[16px] leading-relaxed text-[#7c6b92]">
            {t('aboutPage.values.subtitle')}
          </p>
        </div>

        <div className="relative mx-auto hidden max-w-4xl lg:block">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="orbit-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="rgb(217, 70, 239)" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            {valuesOrbitLines.map((line, index) => (
              <line
                key={index}
                x1="50"
                y1="50"
                x2={line.x2}
                y2={line.y2}
                stroke="url(#orbit-line)"
                strokeWidth="0.35"
                className="opacity-100"
              />
            ))}
          </svg>

          <div
            className="relative mx-auto flex h-[520px] items-center justify-center"
            data-aos="zoom-in"
            data-aos-delay="120"
          >
            <div
              className="pointer-events-none absolute h-44 w-44 rounded-full bg-gradient-to-br from-purple-500/30 to-fuchsia-500/25 blur-2xl"
              aria-hidden="true"
            />
            <div className="relative z-10 flex h-36 w-36 flex-col items-center justify-center rounded-full border border-purple-200/80 bg-white/90 text-center shadow-[0_20px_60px_rgba(124,58,237,0.2)] backdrop-blur-xl">
              <span className="text-lg font-extrabold text-[#1e1033]">
                {t('aboutPage.values.hubTitle')}
              </span>
              <span className="mt-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-purple-600">
                {t('aboutPage.values.hubSubtitle')}
              </span>
            </div>

            {aboutValues.map((value, index) => (
              <ValueOrbitCard
                key={value.id}
                value={value}
                index={index}
                layout="orbit"
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-5 lg:hidden">
          {aboutValues.map((value, index) => (
            <ValueOrbitCard
              key={value.id}
              value={value}
              index={index}
              layout="stack"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCapsule({
  stat,
  index,
  isInView,
}: {
  stat: (typeof aboutStats)[number]
  index: number
  isInView: boolean
}) {
  const { t } = useTranslation()
  const count = useCountUp(
    stat.type === 'count' ? stat.target : 0,
    isInView && stat.type === 'count',
    1600,
  )

  const displayValue =
    stat.type === 'static' ? stat.display : `${count}${stat.suffix}`

  return (
    <article
      data-aos="zoom-in"
      data-aos-delay={aosDelay(index)}
      className={`group relative w-full rounded-[1.75rem] border border-white/10 bg-white/10 px-6 py-8 text-center backdrop-blur-xl transition-all duration-500 ease-out hover:-translate-y-2 hover:border-fuchsia-400/25 hover:bg-white/15 hover:shadow-[0_20px_50px_rgba(168,85,247,0.25)] max-md:px-4 max-md:py-6 ${
        isInView ? 'animate-stat-pop' : ''
      }`}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div
        className="mx-auto mb-4 h-1 w-10 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-400 opacity-60 transition-all duration-500 ease-out group-hover:w-14 group-hover:opacity-100 group-hover:shadow-[0_0_16px_rgba(217,70,239,0.5)]"
        aria-hidden="true"
      />
      <p className="text-[clamp(28px,4vw,44px)] font-extrabold tabular-nums text-white transition-all duration-500 ease-out group-hover:text-fuchsia-200 group-hover:drop-shadow-[0_0_20px_rgba(217,70,239,0.45)]">
        {displayValue}
      </p>
      <p className="mt-2 text-sm text-purple-100/80">{t(`aboutPage.stats.${stat.id}.label`)}</p>
      <span
        className="absolute end-5 top-5 h-2 w-2 rounded-full bg-fuchsia-400/70 shadow-[0_0_10px_rgba(217,70,239,0.6)] transition-all duration-500 ease-out group-hover:scale-125 group-hover:bg-fuchsia-300"
        aria-hidden="true"
      />
    </article>
  )
}

function StatsSection() {
  const { ref, isInView } = useInView(0.25)

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#12001f] via-[#2b0646] to-[#07000d] py-20 text-white max-md:py-14">
      <div
        className="pointer-events-none absolute -start-32 top-10 h-96 w-96 animate-glow-drift rounded-full bg-purple-600/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-24 bottom-0 h-80 w-80 animate-glow-drift-reverse rounded-full bg-fuchsia-500/18 blur-3xl [animation-delay:2s]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_35%,rgba(255,255,255,0.03)_50%,transparent_65%)]"
        aria-hidden="true"
      />

      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none text-[clamp(80px,18vw,220px)] font-black uppercase tracking-[0.25em] text-white/[0.03]"
        aria-hidden="true"
      >
        TRUST
      </span>

      <div ref={ref} className="container relative">
        <div className="grid grid-cols-2 gap-4 lg:flex lg:items-center lg:gap-0">
          {aboutStats.map((stat, index) => (
            <div key={stat.id} className="flex min-w-0 flex-1 items-center">
              {index > 0 && (
                <div
                  className="mx-4 hidden h-16 w-px shrink-0 bg-gradient-to-b from-transparent via-fuchsia-400/40 to-transparent lg:block"
                  aria-hidden="true"
                />
              )}
              <StatCapsule stat={stat} index={index} isInView={isInView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA({ onNavigate }: { onNavigate: NavigateFn }) {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#12001f] via-[#2b0646] to-[#07000d] py-24 text-white max-md:py-16">
      <div
        className="pointer-events-none absolute -start-32 top-16 h-96 w-96 animate-glow-drift rounded-full bg-purple-600/22 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-24 bottom-10 h-80 w-80 animate-glow-drift-reverse rounded-full bg-fuchsia-500/16 blur-3xl [animation-delay:2s]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,transparent_30%,rgba(192,132,252,0.06)_50%,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(215deg,transparent_40%,rgba(255,255,255,0.04)_52%,transparent_64%)]"
        aria-hidden="true"
      />

      <div className="container relative">
        <article
          data-aos="fade-up"
          className="group relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 px-8 py-14 text-center shadow-[0_30px_90px_rgba(124,58,237,0.35)] backdrop-blur-xl transition-all duration-700 ease-out max-md:px-6 max-md:py-10"
        >
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none text-[clamp(48px,12vw,120px)] font-black uppercase tracking-[0.15em] text-white/[0.04]"
            aria-hidden="true"
          >
            SHOP NOW
          </span>

          <div
            className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-12deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            aria-hidden="true"
          />

          <div className="relative">
            <h2 className="text-[clamp(26px,4vw,42px)] font-extrabold tracking-tight">
              {t('aboutPage.cta.title')}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-purple-100/85 max-md:text-base">
              {t('aboutPage.cta.description')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('store')}
            className="relative mt-10 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-10 py-4 text-sm font-bold text-white shadow-[0_12px_40px_rgba(168,85,247,0.4)] transition-all duration-700 ease-out hover:scale-105 hover:shadow-[0_20px_60px_rgba(217,70,239,0.45)] max-md:mt-8"
          >
            {t('aboutPage.cta.button')}
          </button>
        </article>
      </div>
    </section>
  )
}

function AboutTimelineStep({
  stepId,
  number,
  cardPosition,
  isReached,
  isCurrent,
  layout,
}: {
  stepId: string
  number: string
  cardPosition: 'above' | 'below'
  isReached: boolean
  isCurrent: boolean
  layout: 'horizontal' | 'vertical'
}) {
  const { t } = useTranslation()
  const title = t(`aboutPage.timeline.steps.${stepId}.title`)

  const card = (
    <article
      className={[
        'rounded-2xl border bg-white/95 px-5 py-4 backdrop-blur-md transition-all duration-700 ease-out',
        layout === 'horizontal' ? 'w-full max-w-[220px] text-center' : 'min-w-0 flex-1',
        isReached ? 'translate-y-0 opacity-100' : layout === 'horizontal' ? '-translate-y-6 opacity-0' : 'translate-y-4 opacity-0',
        isReached
          ? 'border-purple-200/90 shadow-[0_14px_44px_rgba(124,58,237,0.14)]'
          : 'pointer-events-none border-purple-100/70',
        isCurrent ? 'border-purple-300/90 shadow-[0_20px_56px_rgba(168,85,247,0.22)]' : '',
        isReached ? 'hover:-translate-y-1 hover:border-purple-300' : '',
      ].join(' ')}
    >
      <h4 className="text-[15px] font-bold text-[#1e1033]">{title}</h4>
    </article>
  )

  const node = (
    <div className={`relative shrink-0 ${layout === 'horizontal' ? 'h-[3.75rem] w-[3.75rem]' : 'h-12 w-12'}`}>
      {isCurrent && (
        <div
          className="pointer-events-none absolute inset-0 m-auto h-full w-full animate-timeline-node-breathe rounded-full bg-gradient-to-br from-purple-500/50 to-fuchsia-500/45 blur-lg"
          aria-hidden="true"
        />
      )}
      <div
        className={[
          'relative z-10 flex h-full w-full items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-700 ease-out',
          isReached
            ? 'border-purple-400 bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-[0_0_24px_rgba(217,70,239,0.45)]'
            : 'scale-95 border-purple-200/80 bg-white text-purple-400',
          isCurrent ? 'scale-110' : '',
        ].join(' ')}
      >
        {number}
      </div>
    </div>
  )

  if (layout === 'vertical') {
    return (
      <div className="relative flex items-start gap-5">
        {node}
        {card}
      </div>
    )
  }

  return (
    <div className="grid h-[14rem] grid-rows-[1fr_auto_1fr] items-center">
      <div className="flex items-end justify-center pb-4">
        {cardPosition === 'above' && card}
      </div>
      <div className="flex items-center justify-center">{node}</div>
      <div className="flex items-start justify-center pt-4">
        {cardPosition === 'below' && card}
      </div>
    </div>
  )
}

function ShoppingTimeline() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [lineProgress, setLineProgress] = useState(false)
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setLineProgress(true))
    })

    const stepTimers = ABOUT_TIMELINE_STEP_DELAYS_MS.map((delay, index) =>
      window.setTimeout(() => setActiveStep(index), delay),
    )

    return () => {
      cancelAnimationFrame(frame)
      stepTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [isVisible])

  return (
    <section className="relative overflow-hidden bg-white py-20 max-md:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(124,58,237,0.09),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(91,33,182,0.07),transparent_50%)]"
        aria-hidden="true"
      />
      <div ref={ref} className="container relative">
        <h2
          className="mb-12 text-center text-[clamp(28px,4vw,40px)] font-extrabold text-[#1e1033] max-md:mb-8"
          data-aos="fade-up"
        >
          {t('aboutPage.timeline.title')}
        </h2>

        <div
          className="relative hidden min-h-[14rem] overflow-hidden rounded-[2rem] border border-purple-100/60 bg-gradient-to-b from-[#faf7ff]/90 via-white/80 to-[#f8f4ff]/90 px-8 py-10 lg:block"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <div className="absolute inset-x-[10%] top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-purple-200/20" />
          <div className="absolute inset-x-[10%] top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full">
            <div
              className={`h-full w-full origin-start scale-x-0 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-600 transition-transform ease-out rtl:bg-gradient-to-l ${
                lineProgress ? 'scale-x-100 shadow-[0_0_16px_rgba(217,70,239,0.4)]' : ''
              }`}
              style={{ transitionDuration: `${ABOUT_TIMELINE_PROGRESS_MS}ms` }}
            />
          </div>
          <div className="relative grid grid-cols-4 gap-4">
            {aboutTimelineStepConfig.map((step, index) => (
              <AboutTimelineStep
                key={step.id}
                stepId={step.id}
                number={step.number}
                cardPosition={step.cardPosition}
                isReached={activeStep >= index}
                isCurrent={activeStep === index}
                layout="horizontal"
              />
            ))}
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[2rem] border border-purple-100/60 bg-gradient-to-b from-[#faf7ff]/90 via-white/80 to-[#f8f4ff]/90 px-4 py-8 lg:hidden"
          data-aos="fade-up"
          data-aos-delay="120"
        >
          <div className="absolute bottom-4 start-[1.47rem] top-4 w-0.5 rounded-full bg-purple-200/20" />
          <div className="absolute bottom-4 start-[1.47rem] top-4 w-0.5 overflow-hidden rounded-full">
            <div
              className={`h-full w-full origin-top scale-y-0 rounded-full bg-gradient-to-b from-purple-600 via-fuchsia-500 to-purple-600 transition-transform ease-out ${
                lineProgress ? 'scale-y-100' : ''
              }`}
              style={{ transitionDuration: `${ABOUT_TIMELINE_PROGRESS_MS}ms` }}
            />
          </div>
          <div className="relative flex flex-col gap-8 ps-2">
            {aboutTimelineStepConfig.map((step, index) => (
              <AboutTimelineStep
                key={step.id}
                stepId={step.id}
                number={step.number}
                cardPosition={step.cardPosition}
                isReached={activeStep >= index}
                isCurrent={activeStep === index}
                layout="vertical"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DifferenceSection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#faf7ff] via-white to-[#f5f0ff] py-20 max-md:py-14">
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
      <div className="container relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="group/image relative mx-auto w-full max-w-[520px] lg:order-2" data-aos="fade-left">
          <div
            className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-fuchsia-500/20 blur-3xl transition-all duration-500 ease-out group-hover/image:bg-purple-500/25"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden rounded-[2rem] border border-purple-100/80 shadow-[0_24px_60px_rgba(124,58,237,0.18)]">
            <div className="aspect-[4/5] bg-gradient-to-br from-purple-800/40 to-fuchsia-700/30 lg:aspect-[5/6]">
              <img
                src={aboutDifferenceImage}
                alt={t('aboutPage.difference.imageAlt')}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/image:scale-105"
                onError={hideBrokenImage}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#16051f]/75 via-[#3b0764]/20 to-transparent" />
          </div>
        </div>

        <div className="lg:order-1" data-aos="fade-right">
          <h2 className="text-[clamp(26px,3.5vw,38px)] font-extrabold leading-snug text-[#1e1033]">
            {t('aboutPage.difference.title')}
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-[#5b4d6d] max-md:text-base">
            {t('aboutPage.difference.description')}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {aboutDifferenceFeatures.map((feature, index) => (
              <article
                key={feature}
                className="rounded-2xl border border-purple-100 bg-white px-5 py-4 shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-purple-200 hover:shadow-md hover:shadow-purple-500/10"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <span className="text-lg font-black text-purple-600">0{index + 1}</span>
                <h3 className="mt-1 text-sm font-bold text-[#1e1033]">
                  {t(`aboutPage.difference.features.${feature}.title`)}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default function About({ currentPage, onNavigate }: PageProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <AboutHero onNavigate={onNavigate} currentPage={currentPage} />
      <main className="flex-1">
        <BrandStory />
        <VisionMission />
        <ValuesSection />
        <ShoppingTimeline />
        <StatsSection />
        <DifferenceSection />
        <FinalCTA onNavigate={onNavigate} />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
