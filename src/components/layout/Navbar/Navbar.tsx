import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { navLinks, type NavLink } from '../../../data/home'
import { useAuth } from '../../../context/AuthContext'
import { useCart } from '../../../context/CartContext'
import type { AppPage, NavigateFn } from '../../../types/navigation'
import { ABOUT_PATH, CART_PATH, CHECKOUT_PATH, CONTACT_PATH, HOME_PATH, ORDERS_PATH, STORE_PATH } from '../../../utils/routing'
import AuthModal from '../../modals/AuthModal/AuthModal'
import ProfileModal from '../../modals/ProfileModal/ProfileModal'
import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher'
import { CartIcon, CloseIcon, MenuIcon, UserIcon } from '../../common/icons/Icons'

interface NavbarProps {
  overlay?: boolean
  currentPage?: AppPage
  onNavigate?: NavigateFn
}

const SCROLL_THRESHOLD = 40

function isPageLink(
  link: NavLink,
): link is {
  key: 'about' | 'store' | 'contact' | 'orders'
  page: 'about' | 'store' | 'contact' | 'orders'
} {
  return 'page' in link
}

function getPageHref(page: AppPage) {
  if (page === 'about') return ABOUT_PATH
  if (page === 'store') return STORE_PATH
  if (page === 'cart') return CART_PATH
  if (page === 'contact') return CONTACT_PATH
  if (page === 'checkout') return CHECKOUT_PATH
  if (page === 'orders') return ORDERS_PATH
  return HOME_PATH
}

export default function Navbar({
  overlay = false,
  currentPage = 'home',
  onNavigate,
}: NavbarProps) {
  const { t } = useTranslation()
  const { currentUser } = useAuth()
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [authKey, setAuthKey] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [badgePulse, setBadgePulse] = useState(false)
  const prevCartCount = useRef(cartCount)

  useEffect(() => {
    if (prevCartCount.current !== cartCount) {
      setBadgePulse(true)
      const timer = window.setTimeout(() => setBadgePulse(false), 450)
      prevCartCount.current = cartCount
      return () => window.clearTimeout(timer)
    }
  }, [cartCount])

  const isTransparent = overlay && !isScrolled
  const closeMenu = () => setMenuOpen(false)
  const openAuth = () => {
    closeMenu()
    setAuthKey((key) => key + 1)
    setAuthOpen(true)
  }
  const closeAuth = useCallback(() => setAuthOpen(false), [])
  const openProfile = () => {
    closeMenu()
    setProfileOpen(true)
  }
  const closeProfile = useCallback(() => setProfileOpen(false), [])

  const handleUserClick = () => {
    if (currentUser) {
      openProfile()
      return
    }
    openAuth()
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = isTransparent
    ? 'text-white hover:bg-white/10 hover:text-white'
    : 'text-zinc-700 hover:bg-purple-50 hover:text-purple-700'

  const activeLinkClass = isTransparent
    ? 'bg-white/15 text-white'
    : 'bg-purple-100 text-purple-800'

  const storeLinkClass = isTransparent
    ? 'bg-transparent text-[#e9d5ff] font-bold hover:bg-transparent hover:text-white'
    : 'bg-transparent text-[#7c3aed] font-bold hover:bg-transparent hover:text-[#6d28d9]'

  const actionBtnClass = isTransparent
    ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
    : 'border-purple-200/80 bg-white/60 text-zinc-800 hover:bg-purple-50 backdrop-blur-sm'

  const actionBtnSizeClass =
    'h-8 w-8 [&_svg]:size-[17px] md:h-10 md:w-10 md:[&_svg]:size-[22px]'

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    closeMenu()
    onNavigate?.('home', '#home')
  }

  const handleNavClick = (link: NavLink, event: MouseEvent<HTMLAnchorElement>) => {
    if (isPageLink(link)) {
      event.preventDefault()
      closeMenu()
      onNavigate?.(link.page)
      return
    }

    if (link.href.startsWith('#')) {
      event.preventDefault()
      closeMenu()
      onNavigate?.('home', link.href)
      return
    }

    closeMenu()
  }

  const isLinkActive = (link: NavLink) => {
    if (isPageLink(link)) {
      if (link.page === 'about') return currentPage === 'about'
      if (link.page === 'contact') return currentPage === 'contact'
      if (link.page === 'orders') return currentPage === 'orders'
      return currentPage === 'store' || currentPage === 'product'
    }
    if (link.key === 'home') return currentPage === 'home'
    return false
  }

  const goToCart = () => {
    closeMenu()
    onNavigate?.('cart')
  }

  const cartBadgeClass = badgePulse ? 'scale-125' : 'scale-100'
  const userFirstName = currentUser?.fullName.trim().split(/\s+/)[0] ?? ''

  const actionButtons = (
    <>
      {currentUser ? (
        <button
          type="button"
          onClick={handleUserClick}
          aria-label={currentUser.fullName}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all duration-500 [&_svg]:size-[18px] ${actionBtnClass}`}
        >
          <span className="max-w-[100px] truncate sm:max-w-[140px] md:max-w-[180px]">
            <span className="md:hidden">{userFirstName}</span>
            <span className="hidden md:inline">{currentUser.fullName}</span>
          </span>
          <UserIcon />
        </button>
      ) : (
        <button
          type="button"
          onClick={handleUserClick}
          aria-label={t('nav.login')}
          className={`flex items-center justify-center rounded-xl border transition-all duration-500 ${actionBtnSizeClass} ${actionBtnClass}`}
        >
          <UserIcon />
        </button>
      )}
    </>
  )

  const cartButtonClass =
    'relative border border-purple-300/25 bg-gradient-to-r from-[#5b21b6] via-[#7c3aed] to-[#9333ea] text-white shadow-[0_6px_16px_rgba(124,58,237,0.28)] animate-nav-accent-glow hover:brightness-105 hover:scale-[1.03]'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] h-[72px] transition-all duration-500 ${
        isTransparent
          ? 'border-b border-white/10 bg-transparent'
          : overlay
            ? 'border-b border-zinc-200/40 bg-zinc-100/55 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-2xl'
            : 'border-b border-purple-200/20 bg-white/85 backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between gap-6 px-6">
        <a
          href={HOME_PATH}
          onClick={handleLogoClick}
          className={`flex shrink-0 items-center gap-2.5 font-heading text-[22px] font-extrabold transition-colors duration-500 ${
            isTransparent ? 'text-white' : 'text-purple-800'
          }`}
        >
          <span
            className={`flex h-[38px] w-[38px] items-center justify-center rounded-xl text-lg font-black transition-all duration-500 ${
              isTransparent
                ? 'border border-white/15 bg-white/10 text-white backdrop-blur-sm'
                : 'bg-gradient-to-br from-violet-600 via-purple-600 to-purple-500 text-white shadow-sm'
            }`}
          >
            T
          </span>
          <span className="hidden lg:inline">Trend</span>
        </a>

        <nav
          className={`items-center gap-1 max-md:fixed max-md:inset-x-0 max-md:top-[72px] max-md:flex-col max-md:items-center max-md:gap-6 max-md:p-6 max-md:transition-all max-md:duration-300 md:flex md:flex-1 md:justify-center ${
            menuOpen ? 'max-md:flex' : 'max-md:hidden'
          } ${
            isTransparent
              ? 'max-md:border-b max-md:border-white/10 max-md:bg-[#140528]/96'
              : 'max-md:border-b max-md:border-zinc-200/40 max-md:bg-zinc-100/90 max-md:shadow-xl max-md:backdrop-blur-2xl'
          }`}
        >
          <ul className="flex items-center gap-0.5 max-md:w-full max-md:flex-col max-md:items-center max-md:gap-1 md:gap-1">
            {navLinks.map((link) => {
              const href = isPageLink(link) ? getPageHref(link.page) : link.href
              const isStoreLink = link.key === 'store'
              return (
                <li key={link.key}>
                  <a
                    href={href}
                    onClick={(event) => handleNavClick(link, event)}
                    className={`block rounded-xl px-3.5 py-2 text-[15px] font-medium transition-all duration-500 max-md:px-4 max-md:py-3 max-md:text-center max-md:text-base md:px-2 md:py-1.5 md:text-[13px] lg:px-3.5 lg:py-2 lg:text-[15px] ${
                      isStoreLink
                        ? storeLinkClass
                        : isLinkActive(link)
                          ? activeLinkClass
                          : linkClass
                    }`}
                  >
                    {t(`nav.${link.key}`)}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            onClick={goToCart}
            aria-label={t('nav.cart')}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-sm font-semibold transition-all duration-500 md:px-3.5 [&_svg]:size-[18px] ${cartButtonClass}`}
          >
            <span className="relative">
              <CartIcon />
              {cartCount > 0 && (
                <span
                  className={`absolute -end-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-purple-700 transition-transform duration-300 ${cartBadgeClass}`}
                >
                  {cartCount}
                </span>
              )}
            </span>
            <span className="hidden md:inline">{t('nav.cart')}</span>
          </button>
          <div className="flex items-center gap-1.5 max-md:flex md:hidden">
            {actionButtons}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            {actionButtons}
          </div>
          <LanguageSwitcher overlay={isTransparent} />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-500 md:hidden [&_svg]:size-5 ${
              isTransparent ? 'text-white hover:bg-white/10' : 'text-purple-800 hover:bg-purple-50'
            }`}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AuthModal key={authKey} isOpen={authOpen} onClose={closeAuth} />
      <ProfileModal isOpen={profileOpen} onClose={closeProfile} onNavigate={onNavigate} />
    </header>
  )
}
