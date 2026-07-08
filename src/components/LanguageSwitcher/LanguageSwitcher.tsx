import { useTranslation } from 'react-i18next'
import {
  LANGUAGE_LABELS,
  LANGUAGE_SHORT_LABELS,
  SUPPORTED_LANGUAGES,
  type Language,
} from '../../i18n'

interface LanguageSwitcherProps {
  overlay?: boolean
}

function getCurrentLanguage(language: string): Language {
  return language.startsWith('ar') ? 'ar' : 'en'
}

export default function LanguageSwitcher({ overlay = false }: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()
  const current = getCurrentLanguage(i18n.language)
  const next = SUPPORTED_LANGUAGES.find((lang) => lang !== current)!

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(next)}
      aria-label={t('language.switchTo', { language: LANGUAGE_LABELS[next] })}
      className={`rounded-full border px-2 py-1 text-xs font-semibold transition-all hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 lg:px-3 lg:py-1.5 lg:text-sm lg:font-medium ${
        overlay
          ? 'border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
          : 'border-purple-200 bg-purple-50 text-zinc-800 hover:border-purple-300'
      }`}
    >
      {LANGUAGE_SHORT_LABELS[next]}
    </button>
  )
}
