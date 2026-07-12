import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Branch } from '../../types';

interface BranchesSectionProps {
  branches: Branch[];
  currentLang: string;
  t: any;
}

export default function BranchesSection({ branches, currentLang, t }: BranchesSectionProps) {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[13px] font-semibold text-primary tracking-widest uppercase block mb-3">
          {t('common.branches')}
        </span>
        <h2 className="font-serif-display text-3xl lg:text-4xl font-semibold text-ink dark:text-canvas">
          {currentLang === 'ar' ? 'فروعنا الفاخرة حول العالم' : 'Discover Our Boutique Destinations'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {branches.map((branch) => {
          const name = currentLang === 'ar' ? branch.nameAr : branch.nameEn;
          const city = currentLang === 'ar' ? branch.cityAr : branch.cityEn;
          return (
            <Link 
              key={branch.id} 
              to={`/${currentLang}/rooms?branch=${branch.id}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md flex flex-col justify-end p-6 text-left rtl:text-right"
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
              <img 
                src={branch.image} 
                alt={name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Content */}
              <div className="relative z-20 space-y-2 text-white">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-primary">
                  <MapPin className="w-4.5 h-4.5" />
                  <span className="text-[13px] font-semibold tracking-wider uppercase">{city}</span>
                </div>
                <h3 className="font-serif-display text-2xl font-semibold text-white">
                  {name}
                </h3>
                <div className="flex items-center space-x-0.5 text-primary pt-1">
                  {Array.from({ length: branch.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-primary" />
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
