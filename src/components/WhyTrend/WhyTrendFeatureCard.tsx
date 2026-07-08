import { useTranslation } from 'react-i18next'
import type { WhyTrendItem } from '../../types'

interface WhyTrendFeatureCardProps {
  item: WhyTrendItem
  className?: string
  floatClass?: string
}

export default function WhyTrendFeatureCard({
  item,
  className = '',
  floatClass = 'animate-float',
}: WhyTrendFeatureCardProps) {
  const { t } = useTranslation()

  return (
    <div className={`${floatClass} ${className} max-md:pb-4`}>
      <article
        className={`group rounded-3xl border border-white/15 bg-white/10 p-4 text-white backdrop-blur-xl transition-all duration-500 ease-out hover:scale-[1.02] hover:bg-white/15 hover:shadow-[0_20px_60px_rgba(168,85,247,0.35)] md:p-4 lg:p-5 xl:p-6 ${item.rotation}`}
      >
        <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-500 text-xs font-extrabold shadow-lg shadow-purple-500/30 md:mb-3 lg:mb-4 lg:h-10 lg:w-10">
          {item.number}
        </span>
        <h3 className="mb-1.5 text-base font-bold md:text-[15px] lg:mb-2 lg:text-lg">{t(`whyTrend.items.${item.id}.title`)}</h3>
        <p className="text-xs leading-relaxed text-purple-100/85 md:text-[11px] lg:text-sm">
          {t(`whyTrend.items.${item.id}.description`)}
        </p>
      </article>
    </div>
  )
}
