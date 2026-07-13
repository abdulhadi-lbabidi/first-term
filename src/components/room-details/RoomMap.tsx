import { useTranslation } from 'react-i18next';

interface RoomMapProps {
  branchId: string;
}

export function RoomMap({ branchId }: RoomMapProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const getBranchMapUrl = (id: string) => {
    const maps = {
      'dubai-branch': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178598418933!2d55.2721877!3d25.197197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a6d4885%3A0x88981f9a1f9a1f9a!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1689000000000!5m2!1sen!2sae',
      'istanbul-branch': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.043694082329!2d28.9829916!3d41.0369989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab76506566caf%3A0x88981f9a1f9a1f9a!2sTaksim%20Square!5e0!3m2!1sen!2str!4v1689000000000!5m2!1sen!2str',
      'paris-branch': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937616!2d2.2922926!3d48.8583701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1689000000000!5m2!1sen!2sfr'
    };
    return maps[id as keyof typeof maps] || maps['dubai-branch'];
  };

  return (
    <div className="space-y-5 pt-6 border-t border-border/40 dark:border-border-strong/10">
      <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas">
        {currentLang === 'ar' ? 'الموقع على الخريطة' : 'Location on Map'}
      </h3>
      <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border/40 dark:border-border-strong/15 shadow-sm">
        <iframe 
          title="Branch Location Map" 
          src={getBranchMapUrl(branchId)} 
          className="w-full h-full border-0" 
          allowFullScreen 
          loading="lazy" 
        />
      </div>
    </div>
  );
}
