import { Wifi, Car, Utensils, Waves, Dumbbell } from 'lucide-react';

interface ServicesSectionProps {
  t: any;
  currentLang: string;
}

export default function ServicesSection({ t, currentLang }: ServicesSectionProps) {
  const hotelServices = [
    { icon: <Wifi className="w-8 h-8 text-primary" />, name: t('common.services.wifi') },
    { icon: <Car className="w-8 h-8 text-primary" />, name: t('common.services.parking') },
    { icon: <Utensils className="w-8 h-8 text-primary" />, name: t('common.services.food') },
    { icon: <Waves className="w-8 h-8 text-primary" />, name: t('common.services.pool') },
    { icon: <Dumbbell className="w-8 h-8 text-primary" />, name: t('common.services.gym') },
    { icon: <Car className="w-8 h-8 text-primary" />, name: t('common.services.transfer') },
  ];

  return (
    <section className="py-24 bg-ink text-canvas border-t border-border-strong/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[13px] font-semibold text-primary tracking-widest uppercase block mb-3">
            {currentLang === 'ar' ? 'مزايا استثنائية' : 'Curated Services'}
          </span>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-semibold text-white">
            {currentLang === 'ar' ? 'خدمات مجهزة لراحة تفوق توقعاتك' : 'Absolute Comfort & Exquisite Hospitality'}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {hotelServices.map((service, i) => (
            <div 
              key={i} 
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4 hover:border-primary/50 transition-colors duration-300"
            >
              <div className="inline-flex items-center justify-center p-3.5 bg-primary/10 rounded-full mb-2">
                {service.icon}
              </div>
              <h4 className="text-[14px] font-semibold text-white uppercase tracking-wider">
                {service.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
