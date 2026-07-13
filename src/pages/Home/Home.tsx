import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import HeroTypingBlock from '../../components/layout/HeroTypingBlock/HeroTypingBlock'
import AboutStore from '../../components/home/AboutStore/AboutStore'
import Categories from '../../components/home/Categories/Categories'
import Navbar from '../../components/layout/Navbar/Navbar'
import NewArrivals from '../../components/home/NewArrivals/NewArrivals'
import Offers from '../../components/home/Offers/Offers'
import Footer from '../../components/layout/Footer/Footer'
import WhyTrend from '../../components/home/WhyTrend/WhyTrend'
import HeroBackground from '../../components/layout/HeroBackground/HeroBackground'
import { heroSlides } from '../../data/home'
import { useHeroCarousel } from '../../hooks/useHeroCarousel'
import HeroCarouselDots from '../../components/layout/HeroCarouselDots/HeroCarouselDots'
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
          <HeroTypingBlock key={i18n.language} words={typingWords} onNavigate={onNavigate} />
        </div>

        <HeroCarouselDots
          slides={heroSlides}
          activeSlide={activeSlide}
          onGoToSlide={goToSlide}
        />
      </section>

      <main className="flex-1">
        <NewArrivals onNavigate={onNavigate} />
        <Categories onNavigate={onNavigate} />
        <Offers onNavigate={onNavigate} />
        <AboutStore />
        <div id="orders" data-aos="fade-up" />
        <WhyTrend />
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
