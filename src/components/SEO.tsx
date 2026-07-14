import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function SEO({ title, description, image }: SEOProps) {
  const { i18n } = useTranslation();
  const location = useLocation();
  const isArabic = i18n.language.startsWith('ar');

  const siteTitle = 'Vercel Hotels | Luxury Stays';
  const defaultTitle = isArabic ? 'فنادق فيرسيل | إقامات فاخرة' : siteTitle;
  const currentTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  const defaultDescription = isArabic
    ? 'فنادق فيرسيل - استمتع بأقصى درجات الفخامة والراحة المطلقة في وجهاتنا الحصرية حول العالم. احجز إقامتك الرائعة اليوم.'
    : 'Vercel Hotels - Experience ultimate luxury and absolute comfort at our exclusive destinations worldwide. Book your exquisite stay today.';
  
  const currentDescription = description || defaultDescription;
  const currentImage = image || '/logo-primary.webp';
  const currentUrl = `https://vercel-hotels.vercel.app${location.pathname}`;

  // Helper to remove language prefix from current path
  const basePath = location.pathname.replace(/^\/(en|ar)/, '');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{currentTitle}</title>
      <meta name="title" content={currentTitle} />
      <meta name="description" content={currentDescription} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={currentDescription} />
      <meta property="og:image" content={currentImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={currentTitle} />
      <meta property="twitter:description" content={currentDescription} />
      <meta property="twitter:image" content={currentImage} />

      {/* hreflang tags for i18n SEO */}
      <link rel="alternate" hrefLang="en" href={`https://vercel-hotels.vercel.app/en${basePath}`} />
      <link rel="alternate" hrefLang="ar" href={`https://vercel-hotels.vercel.app/ar${basePath}`} />
      <link rel="alternate" hrefLang="x-default" href={`https://vercel-hotels.vercel.app/en${basePath}`} />
    </Helmet>
  );
}
