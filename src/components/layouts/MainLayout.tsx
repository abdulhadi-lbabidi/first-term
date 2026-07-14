import { useEffect } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../store';
import { setLanguage } from '../../store/uiSlice';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../SEO';

export default function MainLayout() {
  const { lang } = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { i18n } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Language detection and routing fallback
    if (!lang || (lang !== 'ar' && lang !== 'en')) {
      const detectedLang = i18n.language === 'ar' || i18n.language?.startsWith('ar') ? 'ar' : 'en';
      // Redirect to route with detected language prefix
      navigate(`/${detectedLang}${location.pathname !== '/' ? location.pathname : ''}`, { replace: true });
    } else {
      // Sync lang with i18n & redux state
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
      dispatch(setLanguage(lang));
    }
  }, [lang, i18n, dispatch, navigate, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-canvas dark:bg-ink transition-colors duration-300">
      <SEO />
      {/* Top Fixed Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-16">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
