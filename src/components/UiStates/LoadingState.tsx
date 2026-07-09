import { useTranslation } from 'react-i18next'

export default function LoadingState({ message }: { message?: string }) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-purple-200 border-t-purple-600" />
      <p className="text-sm font-semibold text-[#7c6b92]">
        {message ?? t('ui.loading')}
      </p>
    </div>
  )
}
