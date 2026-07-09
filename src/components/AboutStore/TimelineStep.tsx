import { useTranslation } from 'react-i18next'
import type { TimelineStepConfig } from '../../data/aboutStore'

interface TimelineStepProps {
  step: TimelineStepConfig
  isReached: boolean
  isCurrent: boolean
  layout: 'horizontal' | 'vertical'
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M3.5 8.5L6.5 11.5L12.5 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StepCard({
  stepKey,
  isReached,
  isCurrent,
  align,
  slideFrom,
}: {
  stepKey: string
  isReached: boolean
  isCurrent: boolean
  align: 'center' | 'start'
  slideFrom: 'above' | 'below' | 'side'
}) {
  const { t } = useTranslation()

  const hiddenTranslate =
    slideFrom === 'above'
      ? '-translate-y-6'
      : slideFrom === 'below'
        ? 'translate-y-6'
        : 'translate-y-4'

  return (
    <article
      className={[
        'group rounded-3xl border bg-white/90 backdrop-blur-md transition-all duration-700 ease-out',
        align === 'center'
          ? 'w-full max-w-[220px] px-4 py-4 text-center'
          : 'min-w-0 flex-1 px-5 py-4',
        isReached
          ? 'translate-y-0 opacity-100'
          : `${hiddenTranslate} opacity-0`,
        isReached
          ? 'border-purple-200/90 shadow-[0_14px_44px_rgba(124,58,237,0.14)]'
          : 'pointer-events-none border-purple-100/70 shadow-none',
        isCurrent
          ? 'border-purple-300/90 shadow-[0_20px_56px_rgba(168,85,247,0.22)]'
          : '',
        isReached
          ? 'hover:-translate-y-1 hover:border-purple-300 hover:shadow-[0_24px_60px_rgba(124,58,237,0.18)]'
          : '',
      ].join(' ')}
    >
      <h4 className="text-[15px] font-bold leading-snug text-[#1e1033] max-md:text-sm">
        {t(`${stepKey}.title`)}
      </h4>
      <p className="mt-1.5 text-xs leading-relaxed text-[#7c6b92]">
        {t(`${stepKey}.caption`)}
      </p>
    </article>
  )
}

function StepNode({
  step,
  isReached,
  isCurrent,
  size,
}: {
  step: TimelineStepConfig
  isReached: boolean
  isCurrent: boolean
  size: 'lg' | 'md'
}) {
  const nodeSize = size === 'lg' ? 'h-[3.75rem] w-[3.75rem] text-sm' : 'h-12 w-12 text-xs'
  const glowSize =
    size === 'lg' ? 'h-[4.25rem] w-[4.25rem]' : 'h-[3.25rem] w-[3.25rem]'

  return (
    <div className={`relative shrink-0 ${nodeSize}`}>
      {isCurrent && (
        <div
          className={`pointer-events-none absolute inset-0 m-auto rounded-full bg-gradient-to-br from-purple-500/50 to-fuchsia-500/45 blur-lg animate-timeline-node-breathe ${glowSize}`}
          aria-hidden="true"
        />
      )}

      {isReached && !isCurrent && (
        <div
          className={`pointer-events-none absolute inset-0 m-auto rounded-full bg-gradient-to-br from-purple-500/25 to-fuchsia-500/20 blur-md ${glowSize}`}
          aria-hidden="true"
        />
      )}

      <div
        className={[
          'relative z-10 flex h-full w-full items-center justify-center rounded-full border-2 font-bold transition-all duration-700 ease-out',
          isReached
            ? 'border-purple-400 bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-[0_0_0_3px_rgba(168,85,247,0.2),0_0_24px_rgba(217,70,239,0.45)]'
            : 'scale-95 border-purple-200/80 bg-white text-purple-400 shadow-sm',
          isCurrent ? 'scale-110' : isReached ? 'scale-100' : '',
        ].join(' ')}
      >
        {isReached ? <CheckIcon /> : step.number}
      </div>
    </div>
  )
}

export default function TimelineStep({
  step,
  isReached,
  isCurrent,
  layout,
}: TimelineStepProps) {
  const stepKey = `aboutStore.timeline.steps.${step.id}`

  if (layout === 'vertical') {
    return (
      <div className="relative flex items-start gap-5">
        <StepNode
          step={step}
          isReached={isReached}
          isCurrent={isCurrent}
          size="md"
        />
        <StepCard
          stepKey={stepKey}
          isReached={isReached}
          isCurrent={isCurrent}
          align="start"
          slideFrom="side"
        />
      </div>
    )
  }

  const cardAbove = step.cardPosition === 'above'

  return (
    <div className="grid h-[17.5rem] grid-rows-[1fr_auto_1fr] items-center">
      <div className="flex items-end justify-center pb-4">
        {cardAbove && (
          <StepCard
            stepKey={stepKey}
            isReached={isReached}
            isCurrent={isCurrent}
            align="center"
            slideFrom="above"
          />
        )}
      </div>

      <div className="flex items-center justify-center">
        <StepNode
          step={step}
          isReached={isReached}
          isCurrent={isCurrent}
          size="lg"
        />
      </div>

      <div className="flex items-start justify-center pt-4">
        {!cardAbove && (
          <StepCard
            stepKey={stepKey}
            isReached={isReached}
            isCurrent={isCurrent}
            align="center"
            slideFrom="below"
          />
        )}
      </div>
    </div>
  )
}
