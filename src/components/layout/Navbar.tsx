import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleTheme, setLanguage, setMobileSidebar } from '@/store/uiSlice';
import { logoutSuccess } from '@/store/authSlice';
import { authService } from '@/services';
import {
  Sun,
  Menu,
  X,
  User,
  ShoppingBag,
  LogOut,
  Briefcase,
  ChevronDown,
  Crown
} from 'lucide-react';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();

  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [isScrolled, setIsScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Monitor scroll for glassmorphism styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync route lang with i18n
  const currentLang = lang || i18n.language || 'en';

  const handleLanguageChange = (newLang: 'ar' | 'en') => {
    dispatch(setLanguage(newLang));
    i18n.changeLanguage(newLang);

    // Replace URL lang parameter
    const segments = location.pathname.split('/');
    if (segments.length > 1 && (segments[1] === 'en' || segments[1] === 'ar')) {
      segments[1] = newLang;
      navigate(segments.join('/'));
    } else {
      navigate(`/${newLang}${location.pathname}`);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    dispatch(logoutSuccess());
    setUserDropdownOpen(false);
    navigate(`/${currentLang}/login`);
  };

  const navLinks = [
    { name: t('common.home'), path: `/${currentLang}` },
    { name: t('common.rooms'), path: `/${currentLang}/rooms` },
    { name: t('common.map'), path: `/${currentLang}/map` },
    { name: t('common.about'), path: `/${currentLang}/about` },
    { name: t('common.contact'), path: `/${currentLang}/contact` },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'bg-canvas/90 dark:bg-ink/90 backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-border/30 dark:border-border-strong/20'
        : 'bg-canvas/90 dark:bg-ink/90 backdrop-blur-md py-6 border-b border-border/30 dark:border-border-strong/20'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to={`/${currentLang}`}
          className="flex items-center gap-2.5 group select-none"
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 drop-shadow-sm">
            <img src="/logo-primary.webp" alt="Vercel Hotels Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-serif-display text-lg lg:text-xl font-bold tracking-wider text-ink dark:text-canvas uppercase group-hover:text-primary transition-colors">
            Vercel Hotels
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 font-interfaceEn">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[15px] justify-start text-start font-medium tracking-wide transition-colors duration-300 relative py-1 ${isActive
                  ? 'text-primary'
                  : 'text-ink/80 dark:text-canvas/80 hover:text-primary dark:hover:text-primary'
                  }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full animate-fade-in" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-5">
          {/* Language Switcher */}
          <button
            onClick={() => handleLanguageChange(currentLang === 'ar' ? 'en' : 'ar')}
            className="text-[14px] font-medium text-ink/80 dark:text-canvas/80 hover:text-primary dark:hover:text-primary transition-all duration-300 px-4 py-1.5 border border-border/50 dark:border-border-strong/40 rounded-full cursor-pointer"
          >
            {currentLang === 'ar' ? 'English' : 'العربية'}
          </button>

          {/* Shopping Cart Selection */}
          <Link
            to={`/${currentLang}/cart`}
            className="p-2 text-ink/80 dark:text-canvas/80 hover:text-primary dark:hover:text-primary transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 rtl:space-x-reverse text-ink dark:text-canvas hover:text-primary dark:hover:text-primary transition-colors py-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-semibold">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="text-[14px] font-medium max-w-[120px] truncate">{user.fullName}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-52 bg-white dark:bg-ink border border-border dark:border-border-strong/30 rounded-xl shadow-xl py-2 z-50 animate-fade-in font-interfaceEn">
                  <Link
                    to={`/${currentLang}/profile`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-[14px] text-body dark:text-canvas/80 hover:bg-canvas/50 dark:hover:bg-body/20 hover:text-primary transition-all"
                  >
                    <User className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t('common.profile')}
                  </Link>
                  <Link
                    to={`/${currentLang}/bookings`}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-[14px] text-body dark:text-canvas/80 hover:bg-canvas/50 dark:hover:bg-body/20 hover:text-primary transition-all"
                  >
                    <Briefcase className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t('common.myBookings')}
                  </Link>
                  <hr className="my-1 border-border dark:border-border-strong/20" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-[14px] text-error hover:bg-error/5 dark:hover:bg-error/10 transition-all text-left rtl:text-right"
                  >
                    <LogOut className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {t('common.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={`/${currentLang}/login`}
              className="bg-primary hover:bg-primary-hover text-white text-[14px] font-medium px-6 py-2.5 rounded-full transition-luxury shadow-[0_4px_14px_rgba(183,154,90,0.2)]"
            >
              {t('common.login')}
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse md:hidden">
          {/* Mobile Cart */}
          <Link
            to={`/${currentLang}/cart`}
            className="p-2 text-ink dark:text-canvas relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-ink dark:text-canvas"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-canvas dark:bg-ink border-t border-border/20 dark:border-border-strong/20 px-6 py-6 absolute top-full left-0 right-0 shadow-lg animate-slide-down">
          <div className="flex flex-col space-y-4 font-interfaceEn">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[16px] text-start  justify-start font-medium text-ink dark:text-canvas hover:text-primary py-1"
              >
                {link.name}
              </Link>
            ))}

            <hr className="border-border dark:border-border-strong/20" />

            <div className="flex items-center justify-between py-2">
              <button
                onClick={() => handleLanguageChange(currentLang === 'ar' ? 'en' : 'ar')}
                className="text-[14px] font-medium text-ink dark:text-canvas border border-border dark:border-border-strong/40 px-4 py-1.5 rounded-full"
              >
                {currentLang === 'ar' ? 'English' : 'العربية'}
              </button>
            </div>

            <hr className="border-border dark:border-border-strong/20" />

            {isAuthenticated && user ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 rtl:space-x-reverse text-ink dark:text-canvas">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[14px] font-medium">{user.fullName}</span>
                </div>
                <Link
                  to={`/${currentLang}/profile`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[15px] text-body dark:text-canvas/80 hover:text-primary"
                >
                  {t('common.profile')}
                </Link>
                <Link
                  to={`/${currentLang}/bookings`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[15px] text-body dark:text-canvas/80 hover:text-primary"
                >
                  {t('common.myBookings')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left rtl:text-right text-[15px] text-error font-medium pt-2"
                >
                  {t('common.logout')}
                </button>
              </div>
            ) : (
              <Link
                to={`/${currentLang}/login`}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-primary hover:bg-primary-hover text-white text-[15px] font-medium px-6 py-3 rounded-full text-center block shadow-md"
              >
                {t('common.login')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
