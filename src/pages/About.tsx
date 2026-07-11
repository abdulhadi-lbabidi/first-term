import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Sparkles, Compass, Heart } from 'lucide-react';

export default function About() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const values = [
    { 
      icon: <Shield className="w-6 h-6 text-primary" />, 
      title: currentLang === 'ar' ? 'الجودة المطلقة' : 'Absolute Quality', 
      desc: currentLang === 'ar' ? 'نلتزم بتقديم أعلى معايير الجودة الفندقية في كافة غرفنا وخدماتنا.' : 'We are committed to delivering the highest hotel standards across all rooms and amenities.' 
    },
    { 
      icon: <Compass className="w-6 h-6 text-primary" />, 
      title: currentLang === 'ar' ? 'الراحة والهدوء' : 'Comfort & Serenity', 
      desc: currentLang === 'ar' ? 'أجنحة مصممة بعناية فائقة لعزل الضوضاء وتوفير ملاذ مريح لاسترخاء الجسد والعقل.' : 'Suites meticulously designed to block noise and provide a peaceful sanctuary for body and mind.' 
    },
    { 
      icon: <Sparkles className="w-6 h-6 text-primary" />, 
      title: currentLang === 'ar' ? 'الابتكار الرقمي' : 'Digital Innovation', 
      desc: currentLang === 'ar' ? 'نوفر تجربة رقمية ذكية وسلسة تبدأ من استكشاف الفندق وحتى تسجيل المغادرة الفعلي.' : 'We provide a seamless and smart digital journey from hotel discovery to checkout.' 
    },
    { 
      icon: <Heart className="w-6 h-6 text-primary" />, 
      title: currentLang === 'ar' ? 'ضيافة راقية شخصية' : 'Boutique Hospitality', 
      desc: currentLang === 'ar' ? 'فريق كونسيرج مخصص يحرص على تلبية تطلعاتك الشخصية لتقديم إقامة تفوق توقعاتك.' : 'A dedicated concierge team strives to meet your personal preferences for an unforgettable stay.' 
    },
  ];

  return (
    <div className="font-interfaceEn max-w-7xl mx-auto px-6 space-y-24">
      {/* 1. Header Hero section */}
      <section className="text-center max-w-2xl mx-auto space-y-4 mt-6">
        <span className="text-[13px] font-semibold text-primary uppercase tracking-widest block">
          {t('common.about')}
        </span>
        <h1 className="font-serif-display text-4xl lg:text-5xl font-semibold text-ink dark:text-canvas my-0">
          {currentLang === 'ar' ? 'قصتنا ورؤيتنا الفاخرة' : 'Our Story & Brand Vision'}
        </h1>
        <p className="text-[15px] text-body/80 dark:text-canvas/70 leading-relaxed font-light">
          {currentLang === 'ar'
            ? 'بدأت فنادق فيرسيل بهدف تقديم مفهوم جديد للإقامة الراقية تجمع بين جمال التصميم المعماري والتكنولوجيا الحديثة.'
            : 'Vercel Hotels was established with a singular vision: to redefine contemporary luxury lodging by combining architectural aesthetics with high-speed digital simplicity.'}
        </p>
      </section>

      {/* 2. Brand Values Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif-display text-3xl font-semibold text-ink dark:text-canvas mb-3">
            {currentLang === 'ar' ? 'القيم التي نؤمن بها' : 'Our Core Values'}
          </h2>
          <p className="text-[14px] text-muted">
            {currentLang === 'ar' ? 'الأسس والمبادئ التي تضمن لضيوفنا إقامة تتجاوز تطلعاتهم.' : 'The principles that guide our boutique hospitality and service everyday.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.01)] text-left rtl:text-right space-y-4"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                {v.icon}
              </div>
              <h3 className="font-serif-display text-lg font-semibold text-ink dark:text-canvas">
                {v.title}
              </h3>
              <p className="text-[13.5px] text-body/90 dark:text-canvas/80 leading-relaxed font-light">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Luxury visual gallery segment */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left rtl:text-right">
          <h2 className="font-serif-display text-3xl font-semibold text-ink dark:text-canvas leading-tight">
            {currentLang === 'ar' ? 'تصميم مستوحى من الحداثة المعمارية' : 'Architectural Harmony'}
          </h2>
          <p className="text-[14.5px] text-body/90 dark:text-canvas/80 leading-relaxed font-light">
            {currentLang === 'ar'
              ? 'نهتم بتناغم التصميم مع طبيعة المدن التي نعمل بها. فروعنا في دبي وإسطنبول وباريس تعبر عن اندماج فريد بين الحداثة الرقمية والتراث المحلي لتعطيك إحساساً دائماً بالألفة والجمال.'
              : 'Our design philosophy is anchored in structural serenity. Each branch—be it Dubai, Istanbul, or Paris—reflects an alignment between regional character and contemporary luxury, promising our guests a sense of deep comfort.'}
          </p>
        </div>
        <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80" 
            alt="Hotel Lobby Design" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
}
