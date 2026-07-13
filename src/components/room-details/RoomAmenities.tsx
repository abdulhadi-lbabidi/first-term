import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface RoomAmenitiesProps {
  services: string[];
}

export function RoomAmenities({ services }: RoomAmenitiesProps) {
  const { t } = useTranslation();

  if (!services || services.length === 0) return null;

  return (
    <div className="space-y-5 pt-6 border-t border-border/40 dark:border-border-strong/10">
      <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas">
        {t('rooms.amenities')}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {services.map((srv) => (
          <div key={srv} className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-[14px] font-medium text-ink/80 dark:text-canvas/80">
              {t(`common.services.${srv}`)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
