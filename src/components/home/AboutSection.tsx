import { Link } from 'react-router-dom';

interface AboutSectionProps {
  currentLang: string;
  t: any;
}

export default function AboutSection({ currentLang, t }: AboutSectionProps) {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="space-y-6 text-left rtl:text-right">
        <span className="text-sm font-bold text-primary tracking-[0.2em] uppercase block mb-3">
          {t('common.hotelName')}
        </span>
        <h2 className="font-serif-display text-4xl lg:text-5xl font-bold text-ink dark:text-canvas leading-[1.15]">
          {currentLang === 'ar' 
            ? 'نهتم بأدق التفاصيل لنصنع لك ذكريات لا تُنسى' 
            : 'Where modern architectural beauty meets classic boutique service.'}
        </h2>
        <p className="text-base md:text-lg text-body/90 dark:text-canvas/80 leading-relaxed font-light mt-6">
          {currentLang === 'ar'
            ? 'بدأت سلسلة فنادق فيرسيل برؤية واضحة لتقديم مفهوم جديد للضيافة الفاخرة. غرفنا مجهزة بأفضل التقنيات وقطع الأثاث الفنية، مع إطلالات ساحرة على معالم المدن أو الشواطئ الرائعة لتوفير تجربة استثنائية لكل زائر.'
            : 'Every detail at Vercel Hotels is curated to represent luxury and peace. Spanning multiple branches across the world, our rooms integrate high-end comfort with premium local experiences, making your stay exceptionally tailored.'}
        </p>
        <div className="pt-2">
          <Link 
            to={`/${currentLang}/about`}
            className="text-[14px] font-semibold text-primary hover:text-primary-hover border-b border-primary/40 pb-1"
          >
            {t('common.viewDetails')}
          </Link>
        </div>
      </div>
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80" 
          alt="Vercel Hotel Room" 
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
