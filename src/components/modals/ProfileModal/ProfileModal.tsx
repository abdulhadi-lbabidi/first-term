import { useEffect, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/CartContext'
import { getOrdersByUserId } from '../../../services/ordersApi'
import type { NavigateFn } from '../../../types/navigation'
import { CloseIcon, EditIcon, LogoutIcon } from '../../common/icons/Icons'

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
      className={`flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4 ${
        isLast ? '' : 'border-b border-purple-100/70'
      }`}
    >
      <span className="text-xs font-semibold text-[#8b7fa0]">{label}</span>
      <span className="break-words text-sm font-bold text-[#1e1033] sm:max-w-[65%] sm:text-end">
        {value}
      </span>
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
      className="flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/10 px-2 py-2.5 text-center text-[11px] font-semibold leading-tight text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 sm:text-xs lg:flex-row lg:justify-between lg:gap-2 lg:px-4 lg:py-3 lg:text-start lg:text-sm"
    >
      <span className="line-clamp-2 lg:line-clamp-none">{label}</span>
      <span className="hidden text-white/50 lg:inline">‹</span>
    </button>
  )
}

export default function ProfileModal({ isOpen, onClose, onNavigate }: ProfileModalProps) {
  const { t, i18n } = useTranslation()
  const { currentUser, logout, updateProfile, loading, error, clearError } = useAuth()
  const { cartCount, fetchCart } = useCart()

  const [entered, setEntered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [ordersCount, setOrdersCount] = useState(0)
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

    void fetchCart()

    let cancelled = false
    void getOrdersByUserId(currentUser.id)
      .then((orders) => {
        if (!cancelled) setOrdersCount(orders.length)
      })
      .catch(() => {
        if (!cancelled) setOrdersCount(0)
      })

    return () => {
      cancelled = true
    }
  }, [isOpen, currentUser, clearError, fetchCart])

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
      className="fixed inset-0 z-[200] flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-5 md:p-6"
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
        className={`relative my-0 flex max-h-[92dvh] w-full max-w-[920px] flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_24px_80px_rgba(124,58,237,0.18)] transition-all duration-500 ease-out sm:my-auto sm:rounded-[2rem] ${
          entered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="absolute end-3 top-3 z-30 flex items-center gap-2 sm:end-4 sm:top-4">
          <button
            type="button"
            onClick={handleLogout}
            aria-label={t('profile.logout')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/95 text-purple-700 shadow-sm transition-colors duration-300 hover:bg-purple-50 hover:text-purple-800 lg:hidden"
          >
            <LogoutIcon />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('profile.close')}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/95 text-[#1e1033] shadow-sm transition-colors duration-300 hover:bg-purple-50 hover:text-purple-700 lg:border-purple-100"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain lg:min-h-[520px] lg:flex-row lg:overflow-hidden lg:rtl:flex-row-reverse">
          {/* Sidebar / compact header */}
          <aside className="relative flex w-full shrink-0 flex-col overflow-hidden bg-gradient-to-br from-[#12001f] via-[#3b0a63] to-[#7e22ce] p-5 text-white sm:p-6 lg:w-[34%] lg:justify-between lg:rounded-s-[2rem] lg:rounded-e-none lg:p-7">
            <div
              className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full bg-fuchsia-500/15 blur-2xl"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div
                className={`flex items-center gap-4 transition-all duration-500 ease-out lg:mb-5 lg:block ${
                  entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                <div className="inline-flex shrink-0 rounded-full bg-gradient-to-r from-fuchsia-400 via-purple-300 to-fuchsia-500 p-[2px]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2a0a4a] text-lg font-bold sm:h-16 sm:w-16 sm:text-xl">
                    {initials}
                  </div>
                </div>

                <div className="min-w-0 flex-1 pe-20 lg:mt-5 lg:pe-0">
                  <h2 className="truncate text-base font-extrabold leading-tight sm:text-lg">
                    {currentUser.fullName}
                  </h2>
                  <p className="mt-0.5 truncate text-sm text-purple-100/80">{currentUser.email}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold">
                      {t('profile.memberStatus')}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold lg:hidden">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      {t('profile.statusActive')}
                    </span>
                  </div>
                </div>
              </div>

              <nav className="mt-5 grid grid-cols-3 gap-2 lg:mt-6 lg:grid-cols-1 lg:space-y-2 lg:gap-0">
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
              className="relative z-10 mt-8 hidden w-full rounded-full bg-white px-5 py-3 text-sm font-bold text-purple-800 transition-all duration-300 hover:scale-[1.02] hover:bg-purple-50 lg:block"
            >
              {t('profile.logout')}
            </button>
          </aside>

          {/* Details */}
          <div className="relative flex w-full flex-1 flex-col bg-white p-5 sm:p-6 lg:overflow-y-auto lg:p-10">
            <span className="absolute end-14 top-5 z-20 hidden items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 lg:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t('profile.statusActive')}
            </span>

            <div className="flex items-start justify-between gap-3 lg:pe-24">
              <div className="min-w-0 flex-1">
                <h3
                  id="profile-modal-title"
                  className="text-xl font-extrabold text-[#1e1033] sm:text-2xl"
                >
                  {t('profile.title')}
                </h3>
                <p className="mt-1.5 text-sm text-[#5b4d6d]">{t('profile.subtitle')}</p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={startEditing}
                  aria-label={t('profile.editInfo')}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-purple-700 transition-all duration-300 hover:bg-purple-100 md:hidden"
                >
                  <EditIcon />
                </button>
              )}
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
              className={`mt-5 overflow-hidden rounded-[1.5rem] border border-purple-100 bg-[#faf7ff] shadow-[0_20px_60px_rgba(168,85,247,0.12)] transition-all duration-500 ease-out sm:mt-6 ${
                entered ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
              }`}
              style={{ transitionDelay: '80ms' }}
            >
              <div className="relative min-h-[240px] p-4 sm:min-h-[280px] sm:p-6">
                <div
                  className={`transition-opacity duration-300 ${
                    isEditing ? 'pointer-events-none absolute inset-0 opacity-0' : 'opacity-100'
                  }`}
                >
                  <h4 className="mb-1 text-sm font-extrabold text-[#1e1033]">
                    {t('profile.accountInfo')}
                  </h4>

                  <div className="mt-2">
                    {/* Mobile: Full Name + Join Date side by side */}
                    <div className="grid grid-cols-2 gap-3 border-b border-purple-100/70 py-3.5 md:hidden">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#8b7fa0]">
                          {t('profile.fields.fullName')}
                        </p>
                        <p className="mt-1 break-words text-sm font-bold text-[#1e1033]">
                          {currentUser.fullName}
                        </p>
                      </div>
                      <div className="min-w-0 text-end">
                        <p className="text-xs font-semibold text-[#8b7fa0]">
                          {t('profile.fields.joinDate')}
                        </p>
                        <p className="mt-1 break-words text-sm font-bold text-[#1e1033]">
                          {joinDate}
                        </p>
                      </div>
                    </div>

                    <div className="md:hidden">
                      <InfoRow label={t('profile.fields.email')} value={currentUser.email} />
                      <InfoRow
                        label={t('profile.fields.phone')}
                        value={currentUser.phone}
                        isLast
                      />
                    </div>

                    {/* Desktop / tablet: stacked rows */}
                    <div className="hidden md:block">
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
                </div>

                <div
                  className={`transition-opacity duration-300 ${
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
                  className={`${primaryBtnFullClass} hidden md:block`}
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

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-purple-100/80 bg-purple-50/40 px-3 py-3 sm:mt-5 sm:gap-3 sm:px-4">
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#8b7fa0] sm:text-[11px]">
                  {t('profile.summary.orders')}
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#1e1033]">{ordersCount}</p>
              </div>
              <div className="border-x border-purple-100/70 text-center">
                <p className="text-[10px] font-semibold text-[#8b7fa0] sm:text-[11px]">
                  {t('profile.summary.cart')}
                </p>
                <p className="mt-0.5 text-sm font-bold text-[#1e1033]">{cartCount}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#8b7fa0] sm:text-[11px]">
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
