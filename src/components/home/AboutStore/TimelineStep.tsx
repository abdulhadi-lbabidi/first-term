import { useTranslation } from 'react-i18next'
import type { TimelineStepConfig } from '../../../data/aboutStore'

interface TimelineStepProps {
  step: TimelineStepConfig
  isReached: boolean
  isCurrent: boolean
  layout: 'horizontal' | 'vertical'
}

export default function TimelineStep({
  step,
  isReached,
  isCurrent,
  layout,
}: TimelineStepProps) {
  const { t } = useTranslation()
  const stepKey = `aboutStore.timeline.steps.${step.id}`
  const title = t(`${stepKey}.title`)
  const caption = t(`${stepKey}.caption`)

  const card = (
    <article
      className={[
        'rounded-2xl border bg-white/95 px-5 py-4 backdrop-blur-md transition-all duration-700 ease-out',
        layout === 'horizontal' ? 'w-full max-w-[220px] text-center' : 'min-w-0 flex-1',
        isReached
          ? 'translate-y-0 opacity-100'
          : layout === 'horizontal'
            ? '-translate-y-6 opacity-0'
            : 'translate-y-4 opacity-0',
        isReached
          ? 'border-purple-200/90 shadow-[0_14px_44px_rgba(124,58,237,0.14)]'
          : 'pointer-events-none border-purple-100/70',
        isCurrent ? 'border-purple-300/90 shadow-[0_20px_56px_rgba(168,85,247,0.22)]' : '',
        isReached ? 'hover:-translate-y-1 hover:border-purple-300' : '',
      ].join(' ')}
    >
      <h4 className="text-[15px] font-bold text-[#1e1033]">{title}</h4>
      <p className="mt-1.5 text-xs leading-relaxed text-[#7c6b92]">{caption}</p>
    </article>
  )

  const node = (
    <div
      className={`relative shrink-0 ${layout === 'horizontal' ? 'h-[3.75rem] w-[3.75rem]' : 'h-12 w-12'}`}
    >
      {isCurrent && (
        <div
          className="pointer-events-none absolute inset-0 m-auto h-full w-full animate-timeline-node-breathe rounded-full bg-gradient-to-br from-purple-500/50 to-fuchsia-500/45 blur-lg"
          aria-hidden="true"
        />
      )}
      <div
        className={[
          'relative z-10 flex h-full w-full items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-700 ease-out',
          isReached
            ? 'border-purple-400 bg-gradient-to-br from-purple-600 via-purple-500 to-fuchsia-500 text-white shadow-[0_0_24px_rgba(217,70,239,0.45)]'
            : 'scale-95 border-purple-200/80 bg-white text-purple-400',
          isCurrent ? 'scale-110' : '',
        ].join(' ')}
      >
        {step.number}
      </div>
    </div>
  )

  if (layout === 'vertical') {
    return (
      <div className="relative flex items-start gap-5">
        {node}
        {card}
      </div>
    )
  }

  return (
    <div className="grid h-[14rem] grid-rows-[1fr_auto_1fr] items-center">
      <div className="flex items-end justify-center pb-4">
        {step.cardPosition === 'above' && card}
      </div>
      <div className="flex items-center justify-center">{node}</div>
      <div className="flex items-start justify-center pt-4">
        {step.cardPosition === 'below' && card}
      </div>
    </div>
  )
}
