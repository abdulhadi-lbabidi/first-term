import { useTranslation } from 'react-i18next'
import { categories } from '../../../data/home'
import type { NavigateFn } from '../../../types/navigation'
import SectionHeader from '../../common/SectionHeader/SectionHeader'
import CategoryPanel from './CategoryPanel'

interface CategoriesProps {
  onNavigate: NavigateFn
}

export default function Categories({ onNavigate }: CategoriesProps) {
  const { t } = useTranslation()

  return (
    <section id="categories" className="relative scroll-mt-[72px] overflow-hidden bg-white py-20 max-md:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_20%,rgba(124,58,237,0.08),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(91,33,182,0.06),transparent_50%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -start-24 top-16 h-72 w-72 rounded-full bg-purple-400/12 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -end-24 bottom-12 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative">
        <SectionHeader
          title={t('categories.title')}
          subtitle={t('categories.subtitle')}
          aos="zoom-in"
        />

        <div className="group/panels grid grid-cols-1 gap-4 md:grid-cols-2 md:items-stretch md:gap-4 lg:flex lg:h-[520px] lg:items-stretch lg:flex-row lg:gap-3">
          {categories.map((category, index) => (
            <CategoryPanel
              key={category.id}
              category={category}
              index={index}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
