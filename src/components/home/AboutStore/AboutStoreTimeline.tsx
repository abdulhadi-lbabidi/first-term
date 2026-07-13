import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  aboutTimelineStepConfig,
  TIMELINE_PROGRESS_MS,
  TIMELINE_STEP_DELAYS_MS,
} from '../../../data/aboutStore'
import TimelineStep from './TimelineStep'

export default function AboutStoreTimeline() {
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

    const stepTimers = TIMELINE_STEP_DELAYS_MS.map((delay, index) =>
      window.setTimeout(() => setActiveStep(index), delay),
    )

    return () => {
      cancelAnimationFrame(frame)
      stepTimers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [isVisible])

  return (
    <div ref={ref} className="relative mt-16 max-md:mt-12">
      <div className="mb-12 text-center max-md:mb-8">
        <h3 className="text-[clamp(28px,4vw,40px)] font-extrabold text-[#1e1033]">
          {t('aboutStore.timeline.title')}
        </h3>
        <p className="mx-auto mt-2 max-w-[560px] text-[15px] leading-relaxed text-[#7c6b92]">
          {t('aboutStore.timeline.subtitle')}
        </p>
      </div>

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
            style={{ transitionDuration: `${TIMELINE_PROGRESS_MS}ms` }}
          />
        </div>
        <div className="relative grid grid-cols-4 gap-4">
          {aboutTimelineStepConfig.map((step, index) => (
            <TimelineStep
              key={step.id}
              step={step}
              layout="horizontal"
              isReached={activeStep >= index}
              isCurrent={activeStep === index}
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
            style={{ transitionDuration: `${TIMELINE_PROGRESS_MS}ms` }}
          />
        </div>
        <div className="relative flex flex-col gap-8 ps-2">
          {aboutTimelineStepConfig.map((step, index) => (
            <TimelineStep
              key={step.id}
              step={step}
              layout="vertical"
              isReached={activeStep >= index}
              isCurrent={activeStep === index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
