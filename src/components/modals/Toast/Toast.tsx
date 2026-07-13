import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface ToastState {
  message: string
  visible: boolean
}

interface ToastContextValue {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ message: '', visible: false })

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true })
    window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }))
    }, 2800)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 end-6 z-[9999] max-w-sm transition-all duration-500 ease-out ${
          toast.visible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-purple-100 bg-white/95 shadow-[0_20px_60px_rgba(124,58,237,0.2)] backdrop-blur-xl">
          <div className="h-1 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-400" />
          <p className="px-5 py-4 text-sm font-semibold text-[#1e1033]">{toast.message}</p>
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}
