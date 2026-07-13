import { heroSlides } from '../../../data/home'

const DEFAULT_OVERLAY =
  'bg-[linear-gradient(135deg,rgba(15,5,30,0.88)_0%,rgba(30,10,55,0.72)_45%,rgba(59,7,100,0.55)_100%),linear-gradient(to_top,rgba(0,0,0,0.65)_0%,transparent_50%)]'

interface HeroBackgroundProps {
  activeSlide: number
  overlayClassName?: string
}

export default function HeroBackground({
  activeSlide,
  overlayClassName = DEFAULT_OVERLAY,
}: HeroBackgroundProps) {
  return (
    <>
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
        className={`pointer-events-none absolute inset-0 z-[1] ${overlayClassName}`}
        aria-hidden="true"
      />
    </>
  )
}
