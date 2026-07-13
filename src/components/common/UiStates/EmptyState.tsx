interface EmptyStateProps {
  message: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({
  message,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-[1.25rem] border border-purple-100 bg-white/80 px-6 py-12 text-center shadow-[0_16px_48px_rgba(124,58,237,0.08)]">
      <p className="text-lg font-bold text-[#1e1033]">{message}</p>
      {description && <p className="mt-2 text-sm text-[#7c6b92]">{description}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-all duration-500 ease-out hover:scale-[1.02]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
