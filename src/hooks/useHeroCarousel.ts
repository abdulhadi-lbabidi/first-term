import { useCallback, useEffect, useState } from 'react'
import { SLIDE_INTERVAL } from '../data/home'

export function useHeroCarousel(slideCount: number) {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (slideCount <= 1) return

    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slideCount)
    }, SLIDE_INTERVAL)

    return () => window.clearInterval(interval)
  }, [slideCount])

  const goToSlide = useCallback((index: number) => {
    setActiveSlide(index)
  }, [])

  return { activeSlide, goToSlide }
}
