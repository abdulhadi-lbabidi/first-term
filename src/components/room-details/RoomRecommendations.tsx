import { useTranslation } from 'react-i18next';
import RoomCard from '../room/RoomCard';
import { Room, Branch } from '../../types';

interface RoomRecommendationsProps {
  recommendedRooms: Room[];
  branch: Branch | null;
}

export function RoomRecommendations({ recommendedRooms, branch }: RoomRecommendationsProps) {
  const { t, i18n } = useTranslation();

  if (!recommendedRooms || recommendedRooms.length === 0) return null;

  return (
    <section className="mt-24 pt-12 border-t border-border/40 dark:border-border-strong/10">
      <h2 className="font-serif-display text-3xl font-semibold text-ink dark:text-canvas mb-8 text-left rtl:text-right">
        {t('rooms.recommendations')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedRooms.map((recRoom) => (
          <RoomCard key={recRoom.id} room={recRoom} branch={branch || undefined} />
        ))}
      </div>
    </section>
  );
}
