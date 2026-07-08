import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import ar from './locales/ar.json'
import en from './locales/en.json'

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  ar: 'العربية',
}

export const LANGUAGE_SHORT_LABELS: Record<Language, string> = {
  en: 'En',
  ar: 'Ar',
}

function applyDocumentLanguage(language: string) {
  const lang = language.startsWith('ar') ? 'ar' : 'en'
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: [...SUPPORTED_LANGUAGES],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
  })

i18n.on('languageChanged', applyDocumentLanguage)
applyDocumentLanguage(i18n.language)

export default i18n
