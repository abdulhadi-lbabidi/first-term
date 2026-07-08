import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { navLinks } from '../../data/home'
import AuthModal from '../AuthModal/AuthModal'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import { CartIcon, CloseIcon, MenuIcon, UserIcon } from '../icons/Icons'

interface NavbarProps {
  overlay?: boolean
}

const SCROLL_THRESHOLD = 40

export default function Navbar({ overlay = false }: NavbarProps) {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authKey, setAuthKey] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  const isTransparent = overlay && !isScrolled
  const closeMenu = () => setMenuOpen(false)
  const openAuth = () => {
    closeMenu()
    setAuthKey((key) => key + 1)
    setAuthOpen(true)
  }
  const closeAuth = useCallback(() => setAuthOpen(false), [])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const linkClass = isTransparent
    ? 'text-white hover:bg-white/10 hover:text-white'
    : 'text-zinc-700 hover:bg-purple-50 hover:text-purple-700'

  const actionBtnClass = isTransparent
    ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
    : 'border-purple-200/80 bg-white/60 text-zinc-800 hover:bg-purple-50 backdrop-blur-sm'

  const actionBtnSizeClass =
    'h-8 w-8 [&_svg]:size-[17px] md:h-10 md:w-10 md:[&_svg]:size-[22px]'

  const actionButtons = (
    <>
      <button
        type="button"
        onClick={openAuth}
        aria-label={t('nav.login')}
        className={`flex items-center justify-center rounded-full border transition-all duration-500 ${actionBtnSizeClass} ${actionBtnClass}`}
      >
        <UserIcon />
      </button>
      <a
        href="#cart"
        onClick={closeMenu}
        aria-label={t('nav.cart')}
        className={`relative flex items-center justify-center rounded-full border transition-all duration-500 ${actionBtnSizeClass} ${actionBtnClass}`}
      >
        <CartIcon />
        <span
          className={`absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-0.5 text-[9px] font-bold text-white transition-colors duration-500 md:-end-1 md:-top-1 md:h-5 md:min-w-5 md:px-1 md:text-[10px] ${
            isTransparent ? 'bg-purple-400' : 'bg-gradient-to-r from-violet-600 to-purple-500'
          }`}
        >
          0
        </span>
      </a>
    </>
  )

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
          href="#home"
          onClick={closeMenu}
          className={`flex shrink-0 items-center gap-2.5 text-[22px] font-extrabold transition-colors duration-500 ${
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className={`block rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors duration-500 max-md:px-4 max-md:py-3 max-md:text-center max-md:text-base md:px-2 md:py-1.5 md:text-[13px] lg:px-3.5 lg:py-2 lg:text-[15px] ${linkClass}`}
                >
                  {t(`nav.${link.key}`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
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
    </header>
  )
}
