import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Room, Branch } from '../../types';
import { Star, Maximize2, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { StorageService } from '../../services/storage.service';
import dayjs from 'dayjs';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface RoomCardProps {
  room: Room;
  branch?: Branch;
}

export default function RoomCard({ room, branch }: RoomCardProps) {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const roomName = currentLang === 'ar' ? room.nameAr : room.nameEn;
  const branchName = branch
    ? (currentLang === 'ar' ? branch.nameAr : branch.nameEn)
    : '';

  // Check if room is booked today
  const todayStr = dayjs().format('YYYY-MM-DD');
  const bookings = StorageService.getBookings();
  const isBookedToday = bookings.some(b =>
    b.roomId === room.id &&
    b.status === 'confirmed' &&
    (dayjs(todayStr).isSame(b.checkIn) || dayjs(todayStr).isAfter(b.checkIn)) &&
    dayjs(todayStr).isBefore(b.checkOut)
  );
  const isAvailable = !isBookedToday;

  return (
    <Link
      to={`/${currentLang}/rooms/${room.id}`}
      className="group bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(183,154,90,0.08)] transition-all duration-500 flex flex-col h-full font-interfaceEn"
    >
      {/* Room Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-canvas/30">
        <img
          src={room.images[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'}
          alt={roomName}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Availability Badge */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
          <span className={`text-[12px] font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-sm ${isAvailable
            ? 'bg-success/10 text-success border border-success/20'
            : 'bg-error/10 text-error border border-error/20'
            }`}>
            {isAvailable ? t('rooms.available') : t('rooms.unavailable')}
          </span>
        </div>
      </div>

      {/* Room Content Card */}
      <div className="p-6 flex flex-col flex-grow text-left rtl:text-right space-y-4">
        {/* Branch & Stars */}
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            {branchName}
          </Badge>
          <div className="flex items-center space-x-0.5 rtl:space-x-reverse text-primary">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < (room.stars || 5)
                  ? 'fill-primary'
                  : 'text-border dark:text-border-strong/20'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif-display text-xl font-semibold text-ink dark:text-canvas line-clamp-1 group-hover:text-primary transition-colors">
          {roomName}
        </h3>

        {/* Specs Icons */}
        <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/40 dark:border-border-strong/10 text-[13px] text-body/80 dark:text-canvas/70 font-medium">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Maximize2 className="w-4 h-4 text-primary shrink-0" />
            <span>{t('common.roomSize', { size: room.size })}</span>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Users className="w-4 h-4 text-primary shrink-0" />
            <span>{t('common.guests', { count: room.capacity })}</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-left rtl:text-right">
            <span className="text-[11px] text-muted block uppercase tracking-wider font-semibold">
              {currentLang === 'ar' ? 'سعر الليلة' : 'Price / Night'}
            </span>
            <span className="text-[18px] font-bold text-primary font-interfaceEn block">
              ${room.pricePerNight}
            </span>
          </div>

          {isAvailable ? (
            <Button size="sm" variant="primary">
              {t('common.bookNow')}
            </Button>
          ) : (
            <Button size="sm" variant="secondary" disabled>
              {t('rooms.unavailable')}
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
