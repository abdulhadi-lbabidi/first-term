import { useTranslation } from 'react-i18next'
import Button from '../Button/Button'
import { useTypingEffect } from '../../hooks/useTypingEffect'

interface HeroTypingBlockProps {
  words: string[]
}

export default function HeroTypingBlock({ words }: HeroTypingBlockProps) {
  const { t } = useTranslation()
  const { displayText, activeWordIndex } = useTypingEffect(words)

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
              <li
                key={`${word}-${index}`}
                className={`flex items-center gap-3 whitespace-nowrap transition-all duration-500 ${
                  isActive
                    ? 'translate-x-1.5 text-[15px] font-bold text-white rtl:-translate-x-1.5'
                    : 'text-sm font-medium text-white/30'
                }`}
              >
                <span
                  className={`w-0.5 rounded-full transition-all duration-400 ${
                    isActive
                      ? 'h-[22px] bg-gradient-to-b from-violet-600 to-purple-400 shadow-[0_0_12px_rgba(167,139,250,0.6)]'
                      : 'h-0 bg-purple-400'
                  }`}
                />
                {word}
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
            className="min-h-[1.3em] text-[clamp(32px,5vw,56px)] font-bold leading-tight text-purple-300"
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
          className="mb-9 text-[clamp(28px,4.5vw,52px)] font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
          data-aos="fade-up"
          data-aos-delay="240"
        >
          {t('hero.headline')}
        </h1>

        <div
          className="flex flex-wrap justify-center gap-3.5 lg:justify-start max-sm:flex-col max-sm:items-stretch"
          data-aos="fade-up"
          data-aos-delay="360"
        >
          <Button variant="primary" size="lg" href="#store">
            {t('hero.primaryCta')}
          </Button>
          <Button
            variant="outline-light"
            size="lg"
            href="#store"
            className="max-sm:w-full"
          >
            {t('hero.secondaryCta')}
          </Button>
        </div>
      </div>
    </>
  )
}
