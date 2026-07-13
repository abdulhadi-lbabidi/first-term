import { useTranslation } from 'react-i18next'
import type { Category } from '../../../types'
import type { NavigateFn } from '../../../types/navigation'
import { aosDelay } from '../../../utils/aos'
import { ChevronLeftIcon } from '../../common/icons/Icons'

interface CategoryPanelProps {
  category: Category
  index: number
  onNavigate: NavigateFn
}

export default function CategoryPanel({ category, index, onNavigate }: CategoryPanelProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      onClick={() => onNavigate('store', { storeCategory: category.id })}
      data-aos="fade-up"
      data-aos-delay={aosDelay(index)}
      className="group/panel relative flex h-[280px] min-w-0 flex-1 overflow-hidden rounded-3xl border border-purple-200/40 text-start shadow-[0_12px_40px_rgba(30,16,51,0.1)] transition-all duration-500 ease-out lg:h-[520px] lg:group-hover/panels:opacity-55 lg:group-hover/panels:brightness-75 lg:hover:flex-[2.4] lg:hover:opacity-100 lg:hover:brightness-100 lg:hover:shadow-[0_0_48px_rgba(124,58,237,0.35)]"
      style={{ background: category.fallback }}
    >
      <img
        src={category.image}
        alt={t(`categories.items.${category.id}.title`)}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover/panel:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1033]/95 via-[#3b0764]/60 to-[#581c87]/25 transition-all duration-500 ease-out group-hover/panel:from-[#1e1033]/80 group-hover/panel:via-[#3b0764]/40 group-hover/panel:to-[#581c87]/15" />

      <span className="absolute start-4 top-4 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md max-lg:start-auto max-lg:end-4">
        {t('categories.productCount', { count: category.itemCount })}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-5 sm:p-6">
        <div className="mb-3 space-y-3 max-lg:block lg:hidden lg:group-hover/panel:block">
          <p className="max-w-sm text-sm leading-relaxed text-purple-100/90">
            {t(`categories.items.${category.id}.description`)}
          </p>

          <span
            aria-label={t('categories.browseNow')}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-sm transition-all duration-500 ease-out lg:group-hover/panel:border-purple-300 lg:group-hover/panel:bg-purple-600 lg:group-hover/panel:shadow-lg lg:group-hover/panel:shadow-purple-500/30"
          >
            <ChevronLeftIcon />
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-white drop-shadow-md sm:text-2xl lg:text-[26px]">
          {t(`categories.items.${category.id}.title`)}
        </h3>
      </div>
    </button>
  )
}
