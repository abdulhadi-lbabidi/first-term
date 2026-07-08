import { useTranslation } from 'react-i18next'
import type { Category } from '../../types'

interface CategoryPanelProps {
  category: Category
}

export default function CategoryPanel({ category }: CategoryPanelProps) {
  const { t } = useTranslation()

  return (
    <a
      href="#store"
      className="group/panel relative flex h-[280px] min-w-0 flex-1 overflow-hidden rounded-3xl border border-purple-200/40 shadow-[0_12px_40px_rgba(30,16,51,0.1)] transition-all duration-500 ease-out lg:h-[520px] lg:group-hover/panels:opacity-55 lg:group-hover/panels:brightness-75 lg:hover:flex-[2.4] lg:hover:opacity-100 lg:hover:brightness-100 lg:hover:shadow-[0_0_48px_rgba(124,58,237,0.35)]"
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

      <div className="relative mt-auto flex w-full flex-col gap-3 p-5 transition-transform duration-500 ease-out group-hover/panel:-translate-y-2 sm:p-6">
        <div>
          <h3 className="text-xl font-extrabold text-white drop-shadow-md sm:text-2xl lg:text-[26px]">
            {t(`categories.items.${category.id}.title`)}
          </h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-purple-100/90 transition-all duration-500 ease-out max-lg:opacity-100 lg:translate-y-3 lg:opacity-0 lg:group-hover/panel:translate-y-0 lg:group-hover/panel:opacity-100">
            {t(`categories.items.${category.id}.description`)}
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-500 ease-out max-lg:opacity-100 lg:translate-y-4 lg:opacity-0 lg:group-hover/panel:translate-y-0 lg:group-hover/panel:opacity-100 lg:group-hover/panel:border-purple-300 lg:group-hover/panel:bg-purple-600 lg:group-hover/panel:shadow-lg lg:group-hover/panel:shadow-purple-500/30">
          {t('categories.browseNow')}
          <span aria-hidden="true" className="text-base leading-none">
            ←
          </span>
        </span>
      </div>
    </a>
  )
}
