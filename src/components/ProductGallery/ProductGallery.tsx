import { useCallback, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons'

interface ProductGalleryProps {
  images: string[]
  alt: string
  fallback: string
}

export default function ProductGallery({ images, alt, fallback }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const slides = images.length > 0 ? images : ['']

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + slides.length) % slides.length)
    },
    [slides.length],
  )

  return (
    <div className="relative" data-aos="fade-left">
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2.25rem] bg-purple-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="relative overflow-hidden rounded-[2rem] border border-purple-100/80 shadow-[0_24px_80px_rgba(124,58,237,0.2)]"
        style={{ background: fallback }}
      >
        <div className="relative aspect-[4/5] sm:aspect-[5/6]">
          {slides.map((src, index) => {
            const isActive = index === activeIndex
            return (
              <img
                key={`${src}-${index}`}
                src={src}
                alt={isActive ? alt : ''}
                loading={index === 0 ? 'eager' : 'lazy'}
                aria-hidden={!isActive}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                  isActive ? 'scale-100 opacity-100' : 'pointer-events-none scale-[1.02] opacity-0'
                }`}
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            )
          })}

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                aria-label="الصورة السابقة"
                className="absolute start-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/85 text-purple-700 shadow-md backdrop-blur-sm transition-all duration-500 ease-out hover:bg-purple-600 hover:text-white [&_svg]:size-5 [&_svg]:rtl:rotate-180"
              >
                <ChevronLeftIcon />
              </button>
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                aria-label="الصورة التالية"
                className="absolute end-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/85 text-purple-700 shadow-md backdrop-blur-sm transition-all duration-500 ease-out hover:bg-purple-600 hover:text-white [&_svg]:size-5 [&_svg]:rtl:rotate-180"
              >
                <ChevronRightIcon />
              </button>
            </>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {slides.map((src, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={`${src}-thumb-${index}`}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`صورة ${index + 1}`}
                aria-current={isActive}
                className={`relative h-16 w-16 overflow-hidden rounded-2xl border-2 transition-all duration-500 ease-out sm:h-20 sm:w-20 ${
                  isActive
                    ? 'border-purple-500 shadow-[0_8px_24px_rgba(168,85,247,0.35)]'
                    : 'border-purple-100 opacity-75 hover:border-purple-300 hover:opacity-100'
                }`}
                style={{ background: fallback }}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
