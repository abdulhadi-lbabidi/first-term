import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Compass } from 'lucide-react';

export default function NotFound() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  return (
    <div className="max-w-md mx-auto px-6 font-interfaceEn py-20 text-center space-y-6">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto animate-spin-slow">
        <Compass className="w-12 h-12" />
      </div>
      
      <h1 className="font-serif-display text-4xl lg:text-5xl font-semibold text-ink dark:text-canvas my-0">
        404
      </h1>
      
      <h2 className="font-serif-display text-2xl text-ink dark:text-canvas">
        {currentLang === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
      </h2>
      
      <p className="text-[14px] text-muted max-w-xs mx-auto leading-relaxed">
        {currentLang === 'ar' 
          ? 'المعذرة، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.' 
          : 'The luxury page you are trying to access is unavailable or has been relocated.'}
      </p>

      <div className="pt-2">
        <Link 
          to={`/${currentLang}`}
          className="bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold px-8 py-3 rounded-full transition-luxury inline-block shadow-md"
        >
          {currentLang === 'ar' ? 'العودة للرئيسية' : 'Return Home'}
        </Link>
      </div>
    </div>
  );
}
