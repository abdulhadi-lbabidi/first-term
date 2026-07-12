import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Room, Branch } from '../../types';
import { Star } from 'lucide-react';
import { StorageService } from '../../services/storage.service';
import dayjs from 'dayjs';

interface RoomCardProps {
  room: Room;
  branch?: Branch;
}

export default function RoomCard({ room, branch }: RoomCardProps) {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const isRtl = currentLang === 'ar';

  const roomName = currentLang === 'ar' ? room.nameAr : room.nameEn;
  const branchName = branch 
    ? (currentLang === 'ar' ? branch.nameAr : branch.nameEn)
    : '';

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
      className="group relative aspect-[3/4] rounded-[28px] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-luxury flex flex-col justify-end text-left rtl:text-right h-full w-full border border-border/10"
    >
      {/* Background Room Image */}
      <img 
        src={room.images[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'} 
        alt={roomName}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        loading="lazy"
      />

      {/* Luxury Translucent Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-95" />

      {/* Availability Status Badge */}
      <div className="absolute top-5 left-5 rtl:left-auto rtl:right-5 z-20">
        <span className={`text-[11px] font-bold tracking-wide uppercase px-3 py-1 rounded-full backdrop-blur-md shadow-sm select-none ${
          isAvailable 
            ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/20' 
            : 'bg-rose-500/25 text-rose-300 border border-rose-500/20'
        }`}>
          {isAvailable ? t('rooms.available') : t('rooms.unavailable')}
        </span>
      </div>

      {/* Room Details Overlay Content */}
      <div className="relative z-20 p-6 flex flex-col space-y-3.5 w-full text-white">
        {/* Branch Name & Rating Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-bold text-primary tracking-wider uppercase">
            {branchName}
          </span>
          <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold select-none border border-white/10 text-white">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span className="font-interfaceEn">{room.stars || 5}.0</span>
          </div>
        </div>

        {/* Room Title */}
        <h3 className="font-serif-display text-xl lg:text-2xl font-bold tracking-wide text-white line-clamp-1 leading-tight my-0 group-hover:text-primary transition-colors duration-300">
          {roomName}
        </h3>

        {/* Room Short Description Excerpt */}
        <p className="text-[12px] text-white/70 line-clamp-2 leading-relaxed font-medium my-0">
          {currentLang === 'ar' ? room.descriptionAr : room.descriptionEn}
        </p>

        {/* Metadata Details Row (Capacity, Size, Pricing) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 select-none font-interfaceEn">
          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold border border-white/5 text-white/90">
            {room.capacity} {currentLang === 'ar' ? 'أفراد' : 'Guests'}
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold border border-white/5 text-white/90">
            {room.size} {currentLang === 'ar' ? 'م٢' : 'm²'}
          </div>
          <div className="bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold border border-primary/30 text-primary">
            {currentLang === 'ar' ? `${room.pricePerNight} درهم / ليلة` : `$${room.pricePerNight} / Night`}
          </div>
        </div>

        {/* Dynamic Action Trigger Button */}
        <div className="pt-2 select-none">
          {isAvailable ? (
            <div className="w-full bg-white text-ink text-center text-[13px] font-bold py-3 rounded-full shadow-lg group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:scale-[1.01] active:scale-95 cursor-pointer">
              {t('common.bookNow')}
            </div>
          ) : (
            <div className="w-full bg-white/10 backdrop-blur-sm text-white/40 text-center text-[13px] font-bold py-3 rounded-full border border-white/5 cursor-not-allowed">
              {t('rooms.unavailable')}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
