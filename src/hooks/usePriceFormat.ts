import { useTranslation } from 'react-i18next'

export function usePriceFormat() {
  const { t, i18n } = useTranslation()
  const priceLocale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const currency = t('store.currency')

  return { priceLocale, currency }
}
