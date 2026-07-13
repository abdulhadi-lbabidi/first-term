import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '../../../types/navigation'
import Button from '../../common/Button/Button'
import { SearchIcon } from '../../common/icons/Icons'
import { useTypingEffect } from '../../../hooks/useTypingEffect'
import { HERO_TYPING_STORE_CATEGORIES } from '../../../data/home'

interface HeroTypingBlockProps {
  words: string[]
  onNavigate: NavigateFn
}

function scrollToCategories() {
  document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function HeroTypingBlock({ words, onNavigate }: HeroTypingBlockProps) {
  const { t } = useTranslation()
  const { displayText, activeWordIndex } = useTypingEffect(words)
  const [searchQuery, setSearchQuery] = useState('')

  const handleCategoryClick = (index: number) => {
    const storeCategory = HERO_TYPING_STORE_CATEGORIES[index]
    if (storeCategory) {
      onNavigate('store', { storeCategory })
      return
    }
    onNavigate('store')
  }

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault()
    const query = searchQuery.trim()
    if (!query) {
      onNavigate('store')
      return
    }
    onNavigate('store', { storeSearch: query })
  }

  return (
    <>
      <aside
        className="hidden self-center lg:block"
        aria-label={t('hero.categoriesLabel')}
        data-aos="fade-up"
        data-aos-delay="0"
      >
        <ul className="flex flex-col gap-3.5">
          {words.map((word, index) => {
            const isActive = index === activeWordIndex
            return (
              <li key={`${word}-${index}`}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick(index)}
                  className={`flex w-full items-center gap-3 whitespace-nowrap text-start transition-all duration-500 hover:text-white ${
                    isActive
                      ? 'translate-x-1.5 text-[15px] font-bold text-white rtl:-translate-x-1.5'
                      : 'text-sm font-medium text-white/30 hover:translate-x-1 rtl:hover:-translate-x-1'
                  }`}
                >
                  <span
                    className={`w-0.5 shrink-0 rounded-full transition-all duration-400 ${
                      isActive
                        ? 'h-[22px] bg-gradient-to-b from-violet-600 to-purple-400 shadow-[0_0_12px_rgba(167,139,250,0.6)]'
                        : 'h-0 bg-purple-400 group-hover:h-3'
                    }`}
                  />
                  {word}
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      <div className="max-w-[680px] text-center lg:text-start">
        <div className="mb-6">
          <p
            className="mb-2 text-[clamp(16px,2.5vw,20px)] text-white/75"
            data-aos="fade-up"
            data-aos-delay="0"
          >
            {t('hero.typingPrefix')}
          </p>
          <p
            className="min-h-[1.3em] font-heading text-[clamp(32px,5vw,56px)] font-bold leading-tight text-purple-300"
            data-aos="fade-up"
            data-aos-delay="120"
          >
            {displayText}
            <span
              className="ms-1 inline-block h-[0.9em] w-0.5 animate-pulse align-middle bg-purple-400"
              aria-hidden="true"
            />
          </p>
        </div>

        <h1
          className="mb-7 text-[clamp(28px,4.5vw,52px)] font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
          data-aos="fade-up"
          data-aos-delay="240"
        >
          {t('hero.headline')}
        </h1>

        <form
          onSubmit={handleSearchSubmit}
          className="mb-7"
          data-aos="fade-up"
          data-aos-delay="300"
          role="search"
        >
          <label htmlFor="hero-product-search" className="sr-only">
            {t('hero.searchLabel')}
          </label>
          <div className="relative">
            <input
              id="hero-product-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t('hero.searchPlaceholder')}
              className="w-full rounded-xl border border-white/25 bg-white/12 py-2.5 pe-12 ps-4 text-sm text-white shadow-[0_10px_28px_rgba(0,0,0,0.22)] outline-none backdrop-blur-xl transition-all placeholder:text-white/50 focus:border-purple-300/60 focus:bg-white/18 focus:ring-2 focus:ring-purple-400/30 sm:py-2.5 sm:text-[15px]"
            />
            <button
              type="submit"
              aria-label={t('hero.searchButton')}
              className="absolute end-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-[0_6px_18px_rgba(124,58,237,0.4)] transition-transform hover:scale-105"
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        <div
          className="flex flex-wrap justify-center gap-3.5 lg:justify-start max-sm:flex-col max-sm:items-stretch"
          data-aos="fade-up"
          data-aos-delay="360"
        >
          <Button variant="primary" size="lg" onClick={() => onNavigate('store')}>
            {t('hero.primaryCta')}
          </Button>
          <Button
            variant="outline-light"
            size="lg"
            onClick={scrollToCategories}
            className="max-sm:w-full"
          >
            {t('hero.secondaryCta')}
          </Button>
        </div>
      </div>
    </>
  )
}
