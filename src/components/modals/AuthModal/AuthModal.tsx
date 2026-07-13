import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../context/AuthContext'
import { CloseIcon } from '../../common/icons/Icons'

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: AuthMode
  warningMessage?: string
  onSuccess?: () => void
}

type AuthMode = 'register' | 'login'

interface LoginFormData {
  identifier: string
  password: string
  remember: boolean
}

interface RegisterFormData {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const inputClass =
  'w-full rounded-2xl border border-purple-100 bg-white/90 px-4 py-3 text-sm text-[#1e1033] shadow-sm outline-none transition-colors duration-300 placeholder:text-[#8b7fa0]/70 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/25'

const labelClass = 'mb-1.5 block text-sm font-semibold text-[#1e1033]'

const submitClass =
  'w-full rounded-2xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/25 transition-colors duration-300 ease-out hover:shadow-purple-300/40'

const switchLinkClass =
  'font-semibold text-purple-700 underline-offset-4 transition-colors duration-300 hover:text-purple-900 hover:underline'

const panelTransition = 'transition-[opacity,transform] duration-500 ease-out'

function getPanelClass(isActive: boolean, direction: 'register' | 'login') {
  const position = isActive
    ? 'relative sm:absolute sm:inset-0'
    : 'absolute inset-0'

  if (isActive) {
    return `${position} pointer-events-auto translate-x-0 translate-y-0 opacity-100`
  }

  if (direction === 'register') {
    return `${position} pointer-events-none -translate-x-4 -translate-y-1 opacity-0 rtl:translate-x-4`
  }

  return `${position} pointer-events-none translate-x-4 translate-y-2 opacity-0 rtl:-translate-x-4`
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'register',
  warningMessage,
  onSuccess,
}: AuthModalProps) {
  const { t } = useTranslation()
  const { register, login, loading, error, clearError } = useAuth()
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [successMessage, setSuccessMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [loginForm, setLoginForm] = useState<LoginFormData>({
    identifier: '',
    password: '',
    remember: false,
  })

  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (!isOpen) return

    setMode(initialMode)
    clearError()
    setSuccessMessage('')
    setErrors({})

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, clearError, initialMode])

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setSuccessMessage('')
    setErrors({})
    clearError()
  }

  const validateLogin = (): boolean => {
    const nextErrors: Record<string, string> = {}

    if (!loginForm.identifier.trim()) {
      nextErrors.identifier = t('auth.errors.required')
    }
    if (!loginForm.password) {
      nextErrors.password = t('auth.errors.required')
    } else if (loginForm.password.length < 6) {
      nextErrors.password = t('auth.errors.passwordMin')
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateRegister = (): boolean => {
    const nextErrors: Record<string, string> = {}

    if (!registerForm.fullName.trim()) nextErrors.fullName = t('auth.errors.required')
    if (!registerForm.email.trim()) nextErrors.email = t('auth.errors.required')
    if (!registerForm.phone.trim()) nextErrors.phone = t('auth.errors.required')
    if (!registerForm.password) {
      nextErrors.password = t('auth.errors.required')
    } else if (registerForm.password.length < 6) {
      nextErrors.password = t('auth.errors.passwordMin')
    }
    if (!registerForm.confirmPassword) {
      nextErrors.confirmPassword = t('auth.errors.required')
    } else if (registerForm.password !== registerForm.confirmPassword) {
      nextErrors.confirmPassword = t('auth.errors.passwordMatch')
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!validateLogin() || loading) return

    clearError()
    setSuccessMessage('')

    try {
      await login({
        identifier: loginForm.identifier.trim(),
        password: loginForm.password,
      })
      setSuccessMessage(t('auth.login.success'))
      window.setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1200)
    } catch {
      // error shown from auth context
    }
  }

  const handleRegisterSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!validateRegister() || loading) return

    clearError()
    setSuccessMessage('')

    try {
      await register({
        fullName: registerForm.fullName.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim(),
        password: registerForm.password,
      })
      setSuccessMessage(t('auth.register.success'))
      window.setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1200)
    } catch {
      // error shown from auth context
    }
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-1.5 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="absolute inset-0 bg-[#0f0a1a]/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute start-1/4 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-600/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute end-1/4 bottom-1/4 h-72 w-72 translate-x-1/2 rounded-full bg-fuchsia-500/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative my-auto w-full max-w-[960px] overflow-hidden rounded-[1.75rem] bg-white/90 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('auth.close')}
          className="absolute end-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-purple-100 bg-white/90 text-[#1e1033] shadow-sm transition-colors duration-300 hover:bg-purple-50 hover:text-purple-700"
        >
          <CloseIcon />
        </button>

        <div className="flex h-auto max-h-[92dvh] flex-col sm:h-[600px] sm:max-h-[92vh] lg:h-[580px] lg:max-h-[580px] lg:flex-row lg:rtl:flex-row-reverse">
          <aside className="relative hidden h-full w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#1e1033] via-[#4c1d95] to-[#7c3aed] p-6 text-white lg:flex lg:w-[42%] lg:flex-col lg:justify-between">
            <div
              className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-8 -start-8 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <h2
                id="auth-modal-title"
                className="text-2xl font-extrabold leading-tight drop-shadow-md"
              >
                {t('auth.visual.title')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-purple-100/90">
                {t('auth.visual.subtitle')}
              </p>
            </div>

            <div className="relative z-10 my-4 overflow-hidden rounded-2xl border border-white/20 shadow-xl">
              <div className="aspect-[4/5] bg-gradient-to-br from-purple-400/40 to-fuchsia-500/30">
                <img
                  src="/images/auth-fashion.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </div>
          </aside>

          <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto bg-white/95 p-5 backdrop-blur-xl sm:overflow-hidden sm:p-8">
            <div
              className="pointer-events-none absolute -end-6 top-10 h-36 w-36 rounded-full bg-purple-300/20 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -start-4 bottom-20 h-32 w-32 rounded-full bg-fuchsia-200/25 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute end-1/3 top-1/2 h-24 w-24 rounded-full bg-white/60 blur-2xl"
              aria-hidden="true"
            />

            {warningMessage && (
              <div className="relative z-10 mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-900">
                <p>{warningMessage}</p>
              </div>
            )}

            <div className="relative z-10 min-h-0 flex-1 sm:overflow-hidden">
              {successMessage && (
                <div className="absolute start-0 end-0 top-0 z-20 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                  {successMessage}
                </div>
              )}

              {error && (
                <div className="absolute start-0 end-0 top-12 z-20 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div
                className={`flex flex-col ${panelTransition} ${getPanelClass(mode === 'register', 'register')}`}
                aria-hidden={mode !== 'register'}
              >
                <div className="mb-4 shrink-0">
                  <h3 className="text-2xl font-extrabold text-[#1e1033]">
                    {t('auth.register.title')}
                  </h3>
                  <p className="mt-2 text-sm text-[#5b4d6d]">{t('auth.register.subtitle')}</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="flex min-h-0 flex-1 flex-col gap-3.5">
                  <div>
                    <label htmlFor="register-name" className={labelClass}>
                      {t('auth.register.fullNameLabel')}
                    </label>
                    <input
                      id="register-name"
                      type="text"
                      value={registerForm.fullName}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          fullName: event.target.value,
                        }))
                      }
                      placeholder={t('auth.register.fullNamePlaceholder')}
                      className={inputClass}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs font-medium text-red-500">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="register-email" className={labelClass}>
                        {t('auth.register.emailLabel')}
                      </label>
                      <input
                        id="register-email"
                        type="email"
                        value={registerForm.email}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }))
                        }
                        placeholder={t('auth.register.emailPlaceholder')}
                        className={inputClass}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="register-phone" className={labelClass}>
                        {t('auth.register.phoneLabel')}
                      </label>
                      <input
                        id="register-phone"
                        type="tel"
                        value={registerForm.phone}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            phone: event.target.value,
                          }))
                        }
                        placeholder={t('auth.register.phonePlaceholder')}
                        className={inputClass}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="register-password" className={labelClass}>
                        {t('auth.register.passwordLabel')}
                      </label>
                      <input
                        id="register-password"
                        type="password"
                        value={registerForm.password}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            password: event.target.value,
                          }))
                        }
                        placeholder={t('auth.register.passwordPlaceholder')}
                        className={inputClass}
                      />
                      {errors.password && (
                        <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="register-confirm" className={labelClass}>
                        {t('auth.register.confirmPasswordLabel')}
                      </label>
                      <input
                        id="register-confirm"
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(event) =>
                          setRegisterForm((prev) => ({
                            ...prev,
                            confirmPassword: event.target.value,
                          }))
                        }
                        placeholder={t('auth.register.confirmPasswordPlaceholder')}
                        className={inputClass}
                      />
                      {errors.confirmPassword && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className={`${submitClass} shrink-0 disabled:cursor-not-allowed disabled:opacity-70`}>
                    {loading && mode === 'register'
                      ? t('auth.register.loading')
                      : t('auth.register.submit')}
                  </button>

                  <p className="shrink-0 pb-1 text-center text-sm text-[#5b4d6d]">
                    {t('auth.register.switchPrompt')}{' '}
                    <button type="button" onClick={() => switchMode('login')} className={switchLinkClass}>
                      {t('auth.register.switchLink')}
                    </button>
                  </p>
                </form>
              </div>

              <div
                className={`flex flex-col ${panelTransition} ${getPanelClass(mode === 'login', 'login')}`}
                aria-hidden={mode !== 'login'}
              >
                <div className="mb-4 shrink-0">
                  <h3 className="text-2xl font-extrabold text-[#1e1033]">
                    {t('auth.login.title')}
                  </h3>
                  <p className="mt-2 text-sm text-[#5b4d6d]">{t('auth.login.subtitle')}</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
                  <div>
                    <label htmlFor="login-identifier" className={labelClass}>
                      {t('auth.login.identifierLabel')}
                    </label>
                    <input
                      id="login-identifier"
                      type="text"
                      value={loginForm.identifier}
                      onChange={(event) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          identifier: event.target.value,
                        }))
                      }
                      placeholder={t('auth.login.identifierPlaceholder')}
                      className={inputClass}
                    />
                    {errors.identifier && (
                      <p className="mt-1 text-xs font-medium text-red-500">{errors.identifier}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="login-password" className={labelClass}>
                      {t('auth.login.passwordLabel')}
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                      placeholder={t('auth.login.passwordPlaceholder')}
                      className={inputClass}
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-[#5b4d6d]">
                      <input
                        type="checkbox"
                        checked={loginForm.remember}
                        onChange={(event) =>
                          setLoginForm((prev) => ({
                            ...prev,
                            remember: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border-purple-200 text-purple-600 focus:ring-purple-500"
                      />
                      {t('auth.login.remember')}
                    </label>
                    <a href="#forgot-password" className={switchLinkClass}>
                      {t('auth.login.forgot')}
                    </a>
                  </div>

                  <button type="submit" disabled={loading} className={`${submitClass} mt-auto shrink-0 disabled:cursor-not-allowed disabled:opacity-70`}>
                    {loading && mode === 'login'
                      ? t('auth.login.loading')
                      : t('auth.login.submit')}
                  </button>

                  <p className="shrink-0 pb-1 text-center text-sm text-[#5b4d6d]">
                    {t('auth.login.switchPrompt')}{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className={switchLinkClass}
                    >
                      {t('auth.login.switchLink')}
                    </button>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
