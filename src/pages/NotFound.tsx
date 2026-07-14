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
        {currentLang === 'ar' ? 'الصفحة غير متاحة' : 'This Page Has Moved'}
      </h2>
      
      <p className="text-[14px] text-muted max-w-xs mx-auto leading-relaxed">
        {currentLang === 'ar' 
          ? 'لم نتمكن من إيجاد ما تبحث عنه. يمكنك استكشاف غرفنا أو التواصل مع فريق الكونسيرج.' 
          : "We couldn't locate what you're looking for. Explore our suites or reach out to our concierge team."}
      </p>

      <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
        <Link 
          to={`/${currentLang}/rooms`}
          className="bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold px-8 py-3 rounded-full transition-luxury inline-block shadow-md"
        >
          {currentLang === 'ar' ? 'استكشف الغرف' : 'Explore Rooms'}
        </Link>
        <Link 
          to={`/${currentLang}/contact`}
          className="border border-border dark:border-border-strong/30 hover:border-primary text-ink dark:text-canvas text-[14px] font-semibold px-8 py-3 rounded-full transition-luxury inline-block"
        >
          {currentLang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
        </Link>
      </div>
    </div>
  );
}
