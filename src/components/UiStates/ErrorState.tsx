import { useTranslation } from 'react-i18next'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-[1.25rem] border border-red-100 bg-red-50/80 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-red-700">
        {message ?? t('ui.error')}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full border border-red-200 bg-white px-5 py-2 text-sm font-bold text-red-700 transition-all duration-300 hover:bg-red-50"
        >
          {t('ui.retry')}
        </button>
      )}
    </div>
  )
}
