import { useTranslation } from 'react-i18next'
import { whyTrendStats } from '../../../data/whyTrend'
import { useCountUp } from '../../../hooks/useCountUp'
import { useInView } from '../../../hooks/useInView'
import type { WhyTrendStat } from '../../../types'

function StatCounter({ stat }: { stat: WhyTrendStat }) {
  const { t } = useTranslation()
  const { ref, isInView } = useInView(0.4)
  const count = useCountUp(stat.target, isInView)

  const displayValue =
    stat.format === 'ratio' ? `${count}${stat.ratioSuffix ?? ''}` : `${count}${stat.suffix ?? ''}`

  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl font-extrabold tabular-nums text-white">{displayValue}</p>
      <p className="mt-1 text-sm text-purple-100/80">{t(`whyTrend.stats.${stat.id}.label`)}</p>
    </div>
  )
}

export default function WhyTrendStatsStrip() {
  return (
    <div
      data-aos="fade-up"
      data-aos-delay="240"
      className="mx-auto mt-6 flex max-w-3xl flex-col items-center justify-center gap-4 rounded-[2rem] border border-white/15 bg-white/10 px-6 py-4 backdrop-blur-xl sm:flex-row sm:gap-0 sm:px-10 sm:py-5"
    >
      {whyTrendStats.map((stat, index) => (
        <div key={stat.id} className="flex items-center gap-4 sm:flex-1 sm:justify-center">
          {index > 0 && (
            <span
              className="hidden h-10 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent sm:block"
              aria-hidden="true"
            />
          )}
          <StatCounter stat={stat} />
        </div>
      ))}
    </div>
  )
}
