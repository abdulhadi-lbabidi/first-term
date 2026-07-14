import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Sparkles, Compass, Heart, Building2, Star, Lock, Globe } from 'lucide-react';
import SEO from '@/components/SEO';

export default function About() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const features = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'حجز ذكي وواثق' : 'Smart Booking',
      desc: currentLang === 'ar' ? 'احجز بثقة من خلال نظام حجز ذكي يعرض التوفر الفعلي والأسعار المحدثة لحظياً، مع تأكيد فوري يضمن لك تجربة خالية من التعقيد منذ أول خطوة.' : 'Book with confidence through a smart reservation system that displays real-time availability and live rates, ensuring a seamless experience from the very first step.'
    },
    {
      icon: <Compass className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'بحث مخصص لك' : 'Personalized Search',
      desc: currentLang === 'ar' ? 'استكشف عشرات الخيارات بسهولة عبر محرك بحث متقدم يتيح تصفية النتائج حسب الوجهة، نوع الغرفة، الميزانية، المرافق، والخدمات لتصل إلى الإقامة المثالية خلال ثوانٍ.' : 'Effortlessly explore dozens of choices with an advanced search engine, filtering by destination, room type, budget, and amenities to find your perfect stay in seconds.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'تجارب موثقة' : 'Authentic Reviews',
      desc: currentLang === 'ar' ? 'اطلع على تقييمات موثقة من نزلاء سابقين، واستعرض الصور الحقيقية وموقع الفندق على الخريطة، لتتخذ قرارك بناءً على معلومات واضحة وتجارب موثوقة.' : 'Read verified reviews from past guests, browse real photos, and view the precise map location to make your decision based on transparent and trusted experiences.'
    },
    {
      icon: <Heart className="w-6 h-6 text-primary" />,
      title: currentLang === 'ar' ? 'إدارة سلسة لرحلتك' : 'Seamless Dashboard',
      desc: currentLang === 'ar' ? 'إدارة رحلتك أصبحت أسهل من أي وقت مضى. تابع حجوزاتك، قم بتعديلها، واحتفظ بجميع تفاصيل إقامتك في مكان واحد.' : 'Managing your journey has never been easier. Track your reservations, make adjustments, and keep all your stay details beautifully organized in one place.'
    },
  ];

  const promises = [
    {
      icon: <Building2 className="w-8 h-8 text-primary mx-auto" />,
      title: currentLang === 'ar' ? 'وجهات استثنائية' : 'Exceptional Destinations',
      desc: currentLang === 'ar' ? 'كل وجهة من وجهاتنا هي تحفة معمارية مصممة لتتناغم مع محيطها، لتقدم لك ملاذاً لا مثيل له من الفخامة والهدوء.' : 'Every Vercel property is an architectural masterpiece, designed to harmonize with its surroundings and offer an unparalleled sanctuary of luxury.'
    },
    {
      icon: <Star className="w-8 h-8 text-primary mx-auto" />,
      title: currentLang === 'ar' ? 'إرث من التميز' : 'Legacy of Excellence',
      desc: currentLang === 'ar' ? 'ينعكس التزامنا بالكمال في الذكريات والقصص الاستثنائية التي يشاركها ضيوفنا المميزون من جميع أنحاء العالم.' : 'Our commitment to perfection is reflected in the unforgettable memories and stories shared by our distinguished guests worldwide.'
    },
    {
      icon: <Lock className="w-8 h-8 text-primary mx-auto" />,
      title: currentLang === 'ar' ? 'خصوصية مطلقة' : 'Absolute Privacy',
      desc: currentLang === 'ar' ? 'من جناحك الخاص وحتى تجربة الحجز الرقمية، نضمن لك أعلى مستويات الخصوصية والأمان لراحتك التامة.' : 'From your personal suite to your digital booking, we ensure the highest levels of discretion and security for your peace of mind.'
    },
    {
      icon: <Globe className="w-8 h-8 text-primary mx-auto" />,
      title: currentLang === 'ar' ? 'ضيافة بلا حدود' : 'Boundless Hospitality',
      desc: currentLang === 'ar' ? 'خدماتنا المصممة خصيصاً لك ولفريق الكونسيرج المكرس لراحتك، تتجاوز كل الحدود لتلبي تطلعاتك قبل أن تطلبها.' : 'Our dedicated concierges and tailored services are designed to anticipate your every need, transcending borders to deliver a flawless stay.'
    }
  ];

  return (
    <div className={`max-w-7xl mx-auto px-6 space-y-24 py-8 ${currentLang === 'ar' ? 'font-interfaceAr' : 'font-interfaceEn'}`}>
      <SEO title={t('common.about')} />
      {/* 1. Header Hero section */}
      <section className="text-center max-w-3xl mx-auto space-y-4 mt-6">
        <span className="text-[13px] font-semibold text-primary uppercase tracking-widest block">
          {t('common.about')}
        </span>
        <h1 className="font-serif-display text-3xl lg:text-5xl font-bold text-ink dark:text-canvas my-0 leading-tight">
          {currentLang === 'ar' ? 'رحلتك تبدأ من هنا' : 'Your Journey Begins Here'}
        </h1>
        <p className="text-[15px] text-body/80 dark:text-canvas/70 leading-relaxed font-light mt-4">
          {currentLang === 'ar'
            ? 'نؤمن أن كل رحلة تبدأ قبل الوصول إلى الفندق. لذلك صممنا منصة تجمع بين التكنولوجيا الراقية وفن الضيافة لنمنحك تجربة حجز سلسة، واستكشافاً غنياً للفنادق، وخدمة ترافقك منذ اللحظة الأولى وحتى نهاية إقامتك. سواء كنت تبحث عن إقامة فاخرة، عطلة عائلية، رحلة عمل، أو وجهة للاسترخاء، نوفر لك كل ما تحتاجه لاتخاذ قرارك بثقة والاستمتاع بتجربة استثنائية.'
            : 'We believe every journey begins long before you arrive at the hotel. That is why we created a platform where refined technology meets exceptional hospitality, giving you a seamless booking experience, immersive hotel discovery, and personalized service from your first search to the end of your stay. Whether you are planning a luxury escape, a family vacation, a business trip, or a relaxing retreat, everything you need is thoughtfully brought together in one destination.'}
        </p>
      </section>

      {/* 2. Platform Features Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-serif-display text-2xl font-bold text-ink dark:text-canvas mb-3">
            {currentLang === 'ar' ? 'فلسفة الضيافة لدينا' : 'Our Philosophy of Hospitality'}
          </h2>
          <p className="text-[14px] text-muted">
            {currentLang === 'ar' ? 'تقنيات راقية مصممة لخدمة راحتك ورفاهيتك.' : 'Refined technology designed entirely around your comfort and well-being.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] text-left rtl:text-right space-y-4 transition-transform hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-serif-display text-[16px] font-bold text-ink dark:text-canvas">
                {f.title}
              </h3>
              <p className="text-[13.5px] text-body/80 dark:text-canvas/70 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Brand Story Segment */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left rtl:text-right">
          <h2 className="font-serif-display text-3xl font-bold text-ink dark:text-canvas leading-tight">
            {currentLang === 'ar' ? 'قصة علامتنا التجارية' : 'Our Brand Story'}
          </h2>
          <p className="text-[14.5px] text-body/80 dark:text-canvas/70 leading-relaxed font-light">
            {currentLang === 'ar'
              ? 'في Vercel Hotels نرى أن الإقامة المميزة تبدأ من أول نقرة. لذلك صممنا منصتنا لتكون أكثر من مجرد وسيلة للحجز؛ إنها مساحة تساعدك على استكشاف الفنادق، مقارنة الخيارات، التعرف على تفاصيل الغرف والمرافق، وقراءة تجارب الضيوف قبل اتخاذ قرارك. يعتمد النظام على أحدث تقنيات الويب لضمان سرعة الاستجابة، وأعلى مستويات الأمان، وتجربة استخدام متناسقة على جميع الأجهزة. سواء كنت تخطط لإجازة قصيرة، رحلة عمل، أو إقامة طويلة، ستجد كل ما تحتاجه في منصة واحدة تجمع بين البساطة، الثقة، والرفاهية.'
              : 'At Vercel Hotels, we believe exceptional stays begin with exceptional planning. Our platform is designed to be far more than a booking website—it is a complete hospitality experience where travelers can explore destinations, compare accommodations, discover room details, browse amenities, and read authentic guest reviews before making a decision. Powered by modern web technologies, the platform delivers outstanding performance, enterprise-grade security, and a seamless experience across every device. Whether you are planning a weekend getaway, a business journey, or an extended stay, everything is thoughtfully designed to help you travel with confidence and comfort.'}
          </p>
        </div>
        <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-border/20">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80"
            alt="Luxury Hotel Interior"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 4. Our Promise / Why Choose Us */}
      <section className="pt-12 border-t border-border/40 dark:border-border-strong/10">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-serif-display text-2xl font-bold text-ink dark:text-canvas mb-3">
            {currentLang === 'ar' ? 'لماذا تختارنا؟' : 'Our Promise to You'}
          </h2>
          <p className="text-[14px] text-muted">
            {currentLang === 'ar' ? 'نلتزم بتقديم أرقى مستويات الخدمة والشفافية التامة.' : 'Committed to delivering the highest levels of service and absolute transparency.'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promises.map((p, i) => (
            <div key={i} className="bg-canvas/50 dark:bg-body/30 p-6 rounded-2xl border border-border/30 dark:border-border-strong/10 text-center space-y-3 transition-colors hover:border-primary/20">
              <div className="mb-4 flex justify-center">{p.icon}</div>
              <h3 className="font-serif-display text-[15px] font-bold text-ink dark:text-canvas">{p.title}</h3>
              <p className="text-[13px] text-body/80 dark:text-canvas/70 leading-relaxed font-light">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
