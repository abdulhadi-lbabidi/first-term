import { useTranslation } from 'react-i18next'
import { newArrivals } from '../../data/products'
import ProductShowcaseCard from './ProductShowcaseCard'

export default function NewArrivals() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-white py-20 max-md:py-14">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgba(124,58,237,0.09),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgba(91,33,182,0.07),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="container relative">
        <div className="mb-12 flex flex-col items-start justify-between gap-5 max-md:mb-8 md:flex-row md:items-end">
          <div className="text-start">
            <h2 className="mb-3 text-[clamp(28px,4vw,40px)] font-bold tracking-tight text-[#1e1033]">
              {t('newArrivals.title')}
            </h2>
            <p className="max-w-[560px] text-[17px] text-[#5b4d6d]">
              {t('newArrivals.subtitle')}
            </p>
          </div>

          <a
            href="#store"
            className="shrink-0 rounded-full border border-purple-200 bg-white px-6 py-2.5 text-sm font-semibold text-purple-700 shadow-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-purple-300 hover:bg-purple-50 hover:shadow-md hover:shadow-purple-500/15"
          >
            {t('newArrivals.viewAll')}
          </a>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 md:items-stretch md:gap-6 lg:gap-8">
          {newArrivals.map((product, index) => (
            <ProductShowcaseCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
