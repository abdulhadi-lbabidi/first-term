import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import type { NavigateFn } from '../../types/navigation'
import { CloseIcon } from '../icons/Icons'

export interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigate?: NavigateFn
}

const inputClass =
  'w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm text-[#1e1033] outline-none transition-colors duration-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20'

const labelClass = 'mb-1.5 block text-xs font-semibold text-[#8b7fa0]'

const primaryBtnClass =
  'bg-gradient-to-r from-purple-700 via-fuchsia-600 to-purple-500 text-sm font-bold text-white shadow-md shadow-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/30 disabled:cursor-not-allowed disabled:opacity-70'

const primaryBtnFullClass = `${primaryBtnClass} w-full rounded-none py-3.5`

const secondaryBtnClass =
  'rounded-full border border-purple-200 bg-white px-6 py-2.5 text-sm font-bold text-purple-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-70'

function getUserInitials(fullName: string, email: string) {
  const trimmed = fullName.trim()
  if (trimmed) return trimmed.charAt(0).toUpperCase()
  const mail = email.trim()
  return mail ? mail.charAt(0).toUpperCase() : 'T'
}

function formatJoinDate(date?: string, locale = 'ar-SA') {
  if (!date) return '—'
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface InfoRowProps {
  label: string
  value: string
  isLast?: boolean
}

function InfoRow({ label, value, isLast }: InfoRowProps) {
  return (
    <div
      className={`flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 ${
        isLast ? '' : 'border-b border-purple-100/70'
      }`}
    >
      <span className="text-xs font-semibold text-[#8b7fa0]">{label}</span>
      <span className="text-sm font-bold text-[#1e1033] sm:text-end">{value}</span>
    </div>
  )
}

interface SidebarActionProps {
  label: string
  onClick: () => void
}

function SidebarAction({ label, onClick }: SidebarActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
    >
      <span>{label}</span>
      <span className="text-white/50 transition-transform duration-300 group-hover:translate-x-[-2px] rtl:group-hover:translate-x-0.5">
        ‹
      </span>
    </button>
  )
}

export default function ProfileModal({ isOpen, onClose, onNavigate }: ProfileModalProps) {
  const { t, i18n } = useTranslation()
  const { currentUser, logout, updateProfile, loading, error, clearError } = useAuth()
  const { cartCount } = useCart()

  const [entered, setEntered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (!isOpen || !currentUser) return

    setIsEditing(false)
    setSuccessMessage('')
    clearError()
    setEditForm({
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
    })
  }, [isOpen, currentUser, clearError])

  useEffect(() => {
    if (!isOpen) {
      setEntered(false)
      return
    }

    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleLogout = () => {
    logout()
    onClose()
  }

  const handleNavigate = (page: 'store' | 'cart') => {
    onClose()
    onNavigate?.(page)
  }

  const handleOrdersClick = () => {
    onClose()
    onNavigate?.('orders')
  }

  const startEditing = () => {
    if (!currentUser) return
    setSuccessMessage('')
    clearError()
    setEditForm({
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
    })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    if (!currentUser) return
    setIsEditing(false)
    clearError()
    setEditForm({
      fullName: currentUser.fullName,
      email: currentUser.email,
      phone: currentUser.phone,
    })
  }

  const handleSaveProfile = async (event: FormEvent) => {
    event.preventDefault()
    if (!currentUser) return

    setSuccessMessage('')
    clearError()

    try {
      await updateProfile({
        fullName: editForm.fullName.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
      })
      setIsEditing(false)
      setSuccessMessage(t('profile.updateSuccess'))
    } catch {
      // error handled in context
    }
  }

  if (!isOpen || !currentUser) return null

  const locale = i18n.language === 'ar' ? 'ar-SA' : 'en-US'
  const joinDate = formatJoinDate(currentUser.createdAt, locale)
  const initials = getUserInitials(currentUser.fullName, currentUser.email)

  const infoRows = [
    { label: t('profile.fields.fullName'), value: currentUser.fullName },
    { label: t('profile.fields.email'), value: currentUser.email },
    { label: t('profile.fields.phone'), value: currentUser.phone },
    { label: t('profile.fields.joinDate'), value: joinDate },
  ]

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div
        className="absolute inset-0 bg-[#0f0a1a]/50 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`relative my-auto w-full max-w-[920px] overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(124,58,237,0.18)] transition-all duration-500 ease-out ${
          entered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('profile.close')}
          className="absolute end-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-purple-100 bg-white text-[#1e1033] transition-colors duration-300 hover:bg-purple-50 hover:text-purple-700"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col lg:min-h-[520px] lg:flex-row lg:rtl:flex-row-reverse">
          {/* Left Sidebar */}
          <aside className="relative flex w-full shrink-0 flex-col justify-between overflow-hidden rounded-t-[2rem] bg-gradient-to-br from-[#12001f] via-[#3b0a63] to-[#7e22ce] p-6 text-white lg:w-[34%] lg:rounded-s-[2rem] lg:rounded-e-none lg:p-7">
            <div
              className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-500/15 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div
                className={`mb-5 transition-all duration-500 ease-out ${
                  entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                <div className="inline-flex rounded-full bg-gradient-to-r from-fuchsia-400 via-purple-300 to-fuchsia-500 p-[2px]">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2a0a4a] text-xl font-bold">
                    {initials}
                  </div>
                </div>
              </div>

              <h2 className="text-lg font-extrabold leading-tight">{currentUser.fullName}</h2>
              <p className="mt-1 text-sm text-purple-100/80">{currentUser.email}</p>
              <span className="mt-3 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                {t('profile.memberStatus')}
              </span>

              <nav className="mt-6 space-y-2">
                <SidebarAction label={t('profile.actions.orders')} onClick={handleOrdersClick} />
                <SidebarAction
                  label={t('profile.actions.cart')}
                  onClick={() => handleNavigate('cart')}
                />
                <SidebarAction
                  label={t('profile.actions.store')}
                  onClick={() => handleNavigate('store')}
                />
              </nav>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="relative z-10 mt-8 w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-purple-800 transition-all duration-300 hover:scale-[1.02] hover:bg-purple-50"
            >
              {t('profile.logout')}
            </button>
          </aside>

          {/* Right Details */}
          <div className="relative flex w-full flex-1 flex-col bg-white p-6 sm:p-8 lg:p-10">
            <span className="absolute end-14 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t('profile.statusActive')}
            </span>

            <div className="pe-24">
              <h3 id="profile-modal-title" className="text-2xl font-extrabold text-[#1e1033]">
                {t('profile.title')}
              </h3>
              <p className="mt-1.5 text-sm text-[#5b4d6d]">{t('profile.subtitle')}</p>
            </div>

            {successMessage && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <div
              className={`mt-6 overflow-hidden rounded-[1.5rem] border border-purple-100 bg-[#faf7ff] shadow-[0_20px_60px_rgba(168,85,247,0.12)] transition-all duration-500 ease-out ${
                entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
              style={{ transitionDelay: '80ms' }}
            >
              <div className="relative min-h-[280px] p-5 sm:p-6">
                <div
                  className={`transition-opacity duration-300 ${
                    isEditing ? 'pointer-events-none absolute inset-0 opacity-0' : 'opacity-100'
                  }`}
                >
                  <h4 className="mb-1 text-sm font-extrabold text-[#1e1033]">
                    {t('profile.accountInfo')}
                  </h4>

                  <div className="mt-2">
                    {infoRows.map((row, index) => (
                      <InfoRow
                        key={row.label}
                        label={row.label}
                        value={row.value}
                        isLast={index === infoRows.length - 1}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className={`p-5 transition-opacity duration-300 sm:p-6 ${
                    isEditing ? 'opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'
                  }`}
                >
                  <h4 className="mb-4 text-sm font-extrabold text-[#1e1033]">
                    {t('profile.editInfo')}
                  </h4>

                  <form id="profile-edit-form" onSubmit={handleSaveProfile} className="space-y-4">
                    <div>
                      <label htmlFor="profile-fullName" className={labelClass}>
                        {t('profile.fields.fullName')}
                      </label>
                      <input
                        id="profile-fullName"
                        type="text"
                        value={editForm.fullName}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, fullName: event.target.value }))
                        }
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-email" className={labelClass}>
                        {t('profile.fields.email')}
                      </label>
                      <input
                        id="profile-email"
                        type="email"
                        value={editForm.email}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, email: event.target.value }))
                        }
                        className={inputClass}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="profile-phone" className={labelClass}>
                        {t('profile.fields.phone')}
                      </label>
                      <input
                        id="profile-phone"
                        type="tel"
                        value={editForm.phone}
                        onChange={(event) =>
                          setEditForm((prev) => ({ ...prev, phone: event.target.value }))
                        }
                        className={inputClass}
                        required
                      />
                    </div>
                  </form>
                </div>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={startEditing}
                  className={primaryBtnFullClass}
                >
                  {t('profile.editInfo')}
                </button>
              ) : (
                <div className="flex flex-col gap-2 border-t border-purple-100/70 p-3 sm:flex-row">
                  <button
                    type="submit"
                    form="profile-edit-form"
                    disabled={loading}
                    className={`${primaryBtnClass} flex-1 rounded-full py-3`}
                  >
                    {loading ? t('profile.saving') : t('profile.saveChanges')}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={loading}
                    className={`${secondaryBtnClass} flex-1 py-3`}
                  >
                    {t('profile.cancel')}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 rounded-2xl border border-purple-100/80 bg-purple-50/40 px-4 py-3">
              <div className="text-center">
                <p className="text-[11px] font-semibold text-[#8b7fa0]">
                  {t('profile.summary.orders')}
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#1e1033]">
                  {t('profile.summary.soon')}
                </p>
              </div>
              <div className="border-x border-purple-100/70 text-center">
                <p className="text-[11px] font-semibold text-[#8b7fa0]">
                  {t('profile.summary.cart')}
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#1e1033]">{cartCount}</p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-semibold text-[#8b7fa0]">
                  {t('profile.summary.status')}
                </p>
                <p className="mt-0.5 text-sm font-bold text-emerald-700">
                  {t('profile.summary.active')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
