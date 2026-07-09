import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import HeroTypingBlock from '../../components/HeroTypingBlock/HeroTypingBlock'
import AboutStore from '../../components/AboutStore/AboutStore'
import Categories from '../../components/Categories/Categories'
import Navbar from '../../components/Navbar/Navbar'
import NewArrivals from '../../components/NewArrivals/NewArrivals'
import Offers from '../../components/Offers/Offers'
import Footer from '../../components/Footer/Footer'
import WhyTrend from '../../components/WhyTrend/WhyTrend'
import HeroBackground from '../../components/HeroBackground/HeroBackground'
import { heroSlides } from '../../data/home'
import { useHeroCarousel } from '../../hooks/useHeroCarousel'
import type { PageProps } from '../../types/navigation'

export default function Home({ currentPage, onNavigate }: PageProps) {
  const { t, i18n } = useTranslation()
  const { activeSlide, goToSlide } = useHeroCarousel(heroSlides.length)

  const typingWords = useMemo(
    () => t('hero.typingWords', { returnObjects: true }) as string[],
    [t],
  )

  return (
    <div className="flex min-h-svh flex-col">
      <section
        id="home"
        className="relative flex min-h-svh flex-col overflow-hidden text-white"
      >
        <HeroBackground activeSlide={activeSlide} />

        <Navbar overlay currentPage={currentPage} onNavigate={onNavigate} />

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
        <NewArrivals onNavigate={onNavigate} />
        <Categories />
        <Offers />
        <AboutStore />
        <div id="orders" data-aos="fade-up" />
        <WhyTrend />
      </main>

      <Footer />
    </div>
  )
}
