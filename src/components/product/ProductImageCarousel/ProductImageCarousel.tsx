import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '../../common/icons/Icons'

const AUTO_SLIDE_MS = 3000

interface ProductImageCarouselProps {
  images: string[]
  alt: string
  className?: string
  paused?: boolean
  maxSlides?: number
  onActiveIndexChange?: (index: number) => void
}

function stopCarouselEvent(event: MouseEvent) {
  event.stopPropagation()
}

export default function ProductImageCarousel({
  images,
  alt,
  className = '',
  paused = false,
  maxSlides = 2,
  onActiveIndexChange,
}: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const slides = useMemo(
    () => (maxSlides > 0 ? images.slice(0, maxSlides) : images),
    [images, maxSlides],
  )
  const isPaused = paused || isHovered
  const hasMultiple = slides.length > 1

  const goTo = useCallback(
    (index: number) => {
      if (slides.length === 0) return
      setActiveIndex((index + slides.length) % slides.length)
    },
    [slides.length],
  )

  const goNext = useCallback(() => {
    goTo(activeIndex + 1)
  }, [activeIndex, goTo])

  const goPrev = useCallback(() => {
    goTo(activeIndex - 1)
  }, [activeIndex, goTo])

  useEffect(() => {
    setActiveIndex(0)
  }, [slides.length])

  useEffect(() => {
    onActiveIndexChange?.(activeIndex)
  }, [activeIndex, onActiveIndexChange])

  useEffect(() => {
    if (!hasMultiple || isPaused) return

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, AUTO_SLIDE_MS)

    return () => window.clearInterval(interval)
  }, [hasMultiple, isPaused, slides.length])

  if (slides.length === 0) return null

  return (
    <div
      className={`relative h-full w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {slides.map((src, index) => {
        const isActive = index === activeIndex
        return (
          <img
            key={`${src}-${index}`}
            src={src}
            alt={isActive ? alt : ''}
            loading="lazy"
            aria-hidden={!isActive}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 ${
              isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        )
      })}

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(event) => {
              stopCarouselEvent(event)
              goPrev()
            }}
            aria-label="Previous image"
            className="absolute start-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white shadow-md backdrop-blur-sm transition-all duration-500 ease-out hover:bg-purple-600 max-sm:h-7 max-sm:w-7 [&_svg]:size-4 [&_svg]:rtl:rotate-180"
          >
            <ChevronLeftIcon />
          </button>

          <button
            type="button"
            onClick={(event) => {
              stopCarouselEvent(event)
              goNext()
            }}
            aria-label="Next image"
            className="absolute end-3 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white shadow-md backdrop-blur-sm transition-all duration-500 ease-out hover:bg-purple-600 max-sm:h-7 max-sm:w-7 [&_svg]:size-4 [&_svg]:rtl:rotate-180"
          >
            <ChevronRightIcon />
          </button>

          <div className="absolute inset-x-0 bottom-[4.75rem] z-20 flex justify-center gap-1.5 sm:bottom-20">
            {slides.map((_, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => {
                    stopCarouselEvent(event)
                    goTo(index)
                  }}
                  aria-label={`Image ${index + 1}`}
                  aria-current={isActive}
                  className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                    isActive
                      ? 'w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.45)]'
                      : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
