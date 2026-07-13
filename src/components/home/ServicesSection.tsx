import { Wifi, Car, Utensils, Waves, Dumbbell } from 'lucide-react';

interface ServicesSectionProps {
  t: any;
  currentLang: string;
}

export default function ServicesSection({ t, currentLang }: ServicesSectionProps) {
  const hotelServices = [
    { icon: <Wifi className="w-6 h-6 shrink-0" />, name: t('common.services.wifi'), desc: currentLang === 'ar' ? 'إنترنت عالي السرعة في جميع المرافق' : 'High-speed internet in all areas' },
    { icon: <Car className="w-6 h-6 shrink-0" />, name: t('common.services.parking'), desc: currentLang === 'ar' ? 'مواقف سيارات آمنة ومراقبة' : 'Secure and monitored parking' },
    { icon: <Utensils className="w-6 h-6 shrink-0" />, name: t('common.services.food'), desc: currentLang === 'ar' ? 'أشهى المأكولات والمشروبات' : 'Finest dining and beverages' },
    { icon: <Waves className="w-6 h-6 shrink-0" />, name: t('common.services.pool'), desc: currentLang === 'ar' ? 'مسبح خارجي وداخلي منعش' : 'Refreshing indoor & outdoor pools' },
    { icon: <Dumbbell className="w-6 h-6 shrink-0" />, name: t('common.services.gym'), desc: currentLang === 'ar' ? 'نادي رياضي بأحدث الأجهزة' : 'Gym with latest equipment' },
    { icon: <Car className="w-6 h-6 shrink-0" />, name: t('common.services.transfer'), desc: currentLang === 'ar' ? 'خدمة النقل من وإلى المطار' : 'Airport transfer service' },
  ];

  return (
    <section className="relative py-32 bg-ink text-canvas border-y border-border-strong/10 overflow-hidden">
      {/* Background Decor Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">

          {/* Text & Image Side */}
          <div className="lg:col-span-5 space-y-10 text-left rtl:text-right">
            <div>
              <h2 className="font-serif-display text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                {currentLang === 'ar' ? 'خدمات مجهزة لراحة تفوق توقعاتك' : 'Absolute Comfort & Exquisite Hospitality'}
              </h2>
              <p className="text-[15px] leading-relaxed text-white/60 font-light max-w-md">
                {currentLang === 'ar'
                  ? 'صُممت مرافقنا وخدماتنا بعناية فائقة لتلبي كافة احتياجاتك وتمنحك تجربة إقامة متكاملة تجمع بين الرفاهية والراحة المطلقة.'
                  : 'Our facilities and services are meticulously designed to meet all your needs and provide a complete stay experience combining luxury and absolute comfort.'}
              </p>
            </div>

            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/3] w-full max-w-md border border-white/10 group shadow-2xl">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
                alt="Hotel Services"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Services Grid Side */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {hotelServices.map((service, i) => (
              <div
                key={i}
                className="group relative flex flex-col justify-center p-6 lg:p-8 bg-white/[0.02] hover:bg-primary/5 border border-white/[0.05] hover:border-primary/40 rounded-[2rem] transition-all duration-500 overflow-hidden transform hover:-translate-y-1"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex items-start gap-4 lg:gap-5">
                  <div className="flex items-center justify-center p-3.5 lg:p-4 bg-white/[0.04] group-hover:bg-primary text-primary group-hover:text-white rounded-2xl transition-all duration-500 shadow-sm border border-white/5 group-hover:border-transparent">
                    {service.icon}
                  </div>
                  <div className="flex-1 mt-1">
                    <h4 className="text-[16px] font-bold text-white tracking-wide mb-1.5 group-hover:text-primary transition-colors duration-300">
                      {service.name}
                    </h4>
                    <p className="text-[13px] text-white/50 font-light leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
