import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import HeroTypingBlock from '../../components/HeroTypingBlock/HeroTypingBlock'
import Categories from '../../components/Categories/Categories'
import Navbar from '../../components/Navbar/Navbar'
import NewArrivals from '../../components/NewArrivals/NewArrivals'
import WhyTrend from '../../components/WhyTrend/WhyTrend'
import { heroSlides, SLIDE_INTERVAL } from '../../data/home'

export default function Home() {
  const { t, i18n } = useTranslation()
  const [activeSlide, setActiveSlide] = useState(0)

  const typingWords = useMemo(
    () => t('hero.typingWords', { returnObjects: true }) as string[],
    [t],
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, SLIDE_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => setActiveSlide(index)

  return (
    <div className="flex min-h-svh flex-col">
      <section
        id="home"
        className="relative flex min-h-svh flex-col overflow-hidden text-white"
      >
        <div className="absolute inset-0 z-0" aria-hidden="true">
          {heroSlides.map((slide, index) => {
            const isActive = index === activeSlide
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 overflow-hidden transition-opacity duration-1400ms ease-in-out ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ background: slide.fallback }}
              >
                <img
                  src={slide.image}
                  alt=""
                  draggable={false}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className={`h-full w-full object-cover object-center ${
                    isActive
                      ? 'scale-110 transition-transform duration-5000 ease-out'
                      : 'scale-100'
                  }`}
                />
              </div>
            )
          })}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(135deg,rgba(15,5,30,0.88)_0%,rgba(30,10,55,0.72)_45%,rgba(59,7,100,0.55)_100%),linear-gradient(to_top,rgba(0,0,0,0.65)_0%,transparent_50%)]"
          aria-hidden="true"
        />

        <Navbar overlay />

        <div className="relative z-[2] mx-auto grid w-full max-w-[1200px] flex-1 grid-cols-1 items-center gap-12 px-6 pb-[100px] pt-[calc(72px+48px)] lg:grid-cols-[200px_1fr] lg:gap-12">
          <HeroTypingBlock key={i18n.language} words={typingWords} />
        </div>

        <div
          className="absolute inset-x-0 bottom-9 z-[3] flex justify-center gap-2.5 max-sm:bottom-6"
          role="tablist"
          aria-label={t('hero.slidesLabel')}
        >
          {heroSlides.map((slide, index) => {
            const isActive = index === activeSlide
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-label={t('hero.slideLabel', { number: index + 1 })}
                aria-selected={isActive}
                onClick={() => goToSlide(index)}
                className={`cursor-pointer rounded-full transition-all duration-400 ${
                  isActive
                    ? 'h-2.5 w-8 border-0 bg-gradient-to-r from-violet-600 to-purple-500 shadow-[0_0_16px_rgba(167,139,250,0.5)]'
                    : 'h-2.5 w-2.5 border border-white/20 bg-white/30 hover:bg-white/55'
                }`}
              />
            )
          })}
        </div>
      </section>

      <main className="flex-1">
        <NewArrivals />
        <Categories />
        <div id="orders" />
        <WhyTrend />
      </main>
    </div>
  )
}
