import { useTranslation } from 'react-i18next'
import type { HeroSlide } from '../../../types'

interface HeroCarouselDotsProps {
  slides: HeroSlide[]
  activeSlide: number
  onGoToSlide: (index: number) => void
}

export default function HeroCarouselDots({
  slides,
  activeSlide,
  onGoToSlide,
}: HeroCarouselDotsProps) {
  const { t } = useTranslation()

  return (
    <div
      className="absolute inset-x-0 bottom-9 z-[3] flex justify-center gap-2.5 max-sm:bottom-6"
      role="tablist"
      aria-label={t('hero.slidesLabel')}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeSlide
        return (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-label={t('hero.slideLabel', { number: index + 1 })}
            aria-selected={isActive}
            onClick={() => onGoToSlide(index)}
            className={`cursor-pointer rounded-full transition-all duration-400 ${
              isActive
                ? 'h-2.5 w-8 border-0 bg-gradient-to-r from-violet-600 to-purple-500 shadow-[0_0_16px_rgba(167,139,250,0.5)]'
                : 'h-2.5 w-2.5 border border-white/20 bg-white/30 hover:bg-white/55'
            }`}
          />
        )
      })}
    </div>
  )
}
