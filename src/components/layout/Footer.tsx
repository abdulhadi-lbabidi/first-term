import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Crown } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const socialLinks = [
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
      href: 'https://instagram.com'
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      href: 'https://facebook.com'
    },
    {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      ),
      href: 'https://twitter.com'
    },
  ];

  return (
    <>
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-6 border-b border-canvas/10 pb-16 text-center text-left rtl:text-right">
        <div className="relative overflow-hidden border border-canvas/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          {/* Background Pattern & Gradient */}
          <div className="absolute inset-0 z-0 bg-ink">
            <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/95 to-primary/20" />
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='34' height='34' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%23ffffff'/%3E%3C/svg%3E")` }} />
          </div>

          <div className="relative z-10 space-y-3 text-left rtl:text-right md:max-w-xl">
            <h3 className="font-serif-display text-2xl lg:text-3xl font-bold text-canvas">
              {currentLang === 'ar' ? 'اشترك في نشرتنا الإخبارية' : 'Subscribe to our Newsletter'}
            </h3>
            <p className="text-[14px] text-canvas/70 font-light">
              {currentLang === 'ar'
                ? 'احصل على آخر العروض الحصرية وأخبار الفندق المميزة مباشرة في بريدك الإلكتروني.'
                : 'Get the latest exclusive offers and premium updates delivered straight to your inbox.'}
            </p>
          </div>
          <div className="relative z-10 w-full md:w-auto flex-1 max-w-md flex items-center gap-2">
            <input
              type="email"
              placeholder={currentLang === 'ar' ? 'بريدك الإلكتروني' : 'Enter your email address'}
              className="w-full bg-canvas/10 border border-canvas/20 focus:border-primary text-canvas rounded-full px-6 py-3.5 text-[14px] outline-none transition-all placeholder:text-canvas/40"
            />
            <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-full font-semibold text-[14px] transition-all whitespace-nowrap">
              {currentLang === 'ar' ? 'اشتراك' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>

      <footer className="relative bg-ink text-canvas pt-20 pb-10 border-t border-border-strong/10 font-interfaceEn overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='34' height='34' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%23ffffff'/%3E%3C/svg%3E")` }} />

        <div className="max-w-7xl bg-ink mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 text-left rtl:text-right">
          {/* Brand & About Us Block (Spans 2 columns on desktop) */}
          <div className="space-y-6 lg:col-span-2">
            <Link
              to={`/${currentLang}`}
              className="flex items-center gap-2.5 group select-none hover:text-primary transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center drop-shadow-md transition-transform duration-300 group-hover:scale-105">
                <img src="/logo-white.webp" alt="Vercel Hotels Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif-display text-2xl font-bold tracking-wider text-canvas uppercase">
                Vercel Hotels
              </span>
            </Link>
            <div className="space-y-4">
              <p className="text-[14px] text-canvas/85 font-medium italic">
                {t('common.footerText')}
              </p>
              <p className="text-[14px] text-canvas/70 leading-relaxed max-w-xl font-light">
                {currentLang === 'ar'
                  ? 'نهدف إلى تقديم تجارب إقامة فندقية فاخرة تجمع بين الراحة والجمال العصري والخدمة الشخصية الراقية. بدأت سلسلة فنادق فيرسيل برؤية واضحة لتقديم مفهوم جديد للضيافة الفنّية والاستثنائية.'
                  : 'Our mission is to deliver premium, tailor-made lodging experiences combining architectural design with personal hospitality. Every detail at Vercel Hotels is curated to represent luxury, peace, and exceptional boutique service.'}
              </p>
            </div>
            <div className="flex items-center space-x-4 pt-2">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full border border-canvas/20 flex items-center justify-center text-canvas/70 hover:text-primary hover:border-primary transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links / Branches */}
          <div className="space-y-6">
            <h4 className="font-serif-display text-lg font-medium text-primary tracking-wide uppercase">
              {t('common.branches')}
            </h4>
            <ul className="space-y-3 text-[14px] text-canvas/70">
              <li>
                <Link to={`/${currentLang}/rooms?branch=dubai-branch`} className="hover:text-primary transition-colors">
                  {currentLang === 'ar' ? 'فرع دبي' : 'Vercel Dubai'}
                </Link>
              </li>
              <li>
                <Link to={`/${currentLang}/rooms?branch=istanbul-branch`} className="hover:text-primary transition-colors">
                  {currentLang === 'ar' ? 'فرع إسطنبول' : 'Vercel Istanbul'}
                </Link>
              </li>
              <li>
                <Link to={`/${currentLang}/rooms?branch=paris-branch`} className="hover:text-primary transition-colors">
                  {currentLang === 'ar' ? 'فرع باريس' : 'Vercel Paris'}
                </Link>
              </li>
              <li className="pt-2">
                <Link to={`/${currentLang}/map`} className="hover:text-primary transition-colors flex items-center gap-2 text-primary font-medium">
                  <MapPin className="w-4 h-4" />
                  {currentLang === 'ar' ? 'خريطة الفروع' : 'Branches Map'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 col-span-1">
            <h4 className="font-serif-display text-lg font-medium text-primary tracking-wide uppercase">
              {t('common.contact')}
            </h4>
            <ul className="space-y-4 text-[14px] text-canvas/70">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>
                  {currentLang === 'ar' ? 'شارع الشيخ زايد، دبي، دولة الإمارات العربية المتحدة' : 'Sheikh Zayed Road, Dubai, UAE'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span dir="ltr" className="inline-block text-left font-interfaceEn select-all">
                  +971 4 123 4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="select-all">concierge@vercelhotels.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-canvas/10 text-center text-[13px] text-canvas/40 flex flex-col md:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} {t('common.hotelName')}. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-serif-display italic tracking-wider">Designed for Qotayba </p>
        </div>
      </footer>
    </>

  );
}
