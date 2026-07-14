import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hotelSettings } from '@/config/hotelSettings';
import { Room, Branch } from '@/types';
import { Star, Users, Maximize2, DollarSign } from 'lucide-react';
import { StorageService } from '@/services/storage.service';

interface RoomCardProps {
  room: Room;
  branch?: Branch;
  layout?: "grid" | "list";
}

export default function RoomCard({ room, branch, layout = "grid" }: RoomCardProps) {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const isRtl = currentLang === 'ar';

  const roomName = currentLang === 'ar' ? room.nameAr : room.nameEn;
  const branchName = branch
    ? (currentLang === 'ar' ? branch.nameAr : branch.nameEn)
    : '';

  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get('check_in');
  const checkOut = searchParams.get('check_out');

  // If date range is selected, check against that range.
  // Without dates, every room is considered available.
  let isAvailable = true;
  if (checkIn && checkOut) {
    const startAt = `${checkIn}T${hotelSettings.checkInTime}:00`;
    const endAt = `${checkOut}T${hotelSettings.checkOutTime}:00`;
    const bookings = StorageService.getBookings();
    const hasConflict = bookings.some(b =>
      b.roomId === room.id &&
      b.status === 'confirmed' &&
      startAt < b.endAt &&
      endAt > b.startAt
    );
    isAvailable = !hasConflict;
  }

  if (layout === 'list') {
    return (
      <Link
        to={`/${currentLang}/rooms/${room.id}`}
        className="group relative flex flex-col md:flex-row bg-white dark:bg-ink rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none dark:hover:shadow-none dark:border-border-strong/20 transition-all duration-500 text-left rtl:text-right border border-border/40"
      >
        <div className="md:w-2/5 relative aspect-video md:aspect-auto overflow-hidden bg-canvas">
          <img
            src={room.images[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80'}
            alt={roomName}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
        </div>

        <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-bold text-primary tracking-wider uppercase">
              {branchName}
            </span>
            <div className="flex items-center gap-1 bg-primary/10 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-primary select-none">
              <Star className="w-3 h-3 fill-primary" />
              <span className="font-interfaceEn">{room.stars || 5}.0</span>
            </div>
          </div>

          <h3 className="font-serif-display text-2xl lg:text-3xl font-bold tracking-wide text-ink dark:text-canvas line-clamp-1 leading-tight my-0 group-hover:text-primary transition-colors duration-300">
            {roomName}
          </h3>

          <p className="text-[14px] text-body dark:text-canvas/70 line-clamp-2 leading-relaxed font-light my-0">
            {currentLang === 'ar' ? room.descriptionAr : room.descriptionEn}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 select-none font-interfaceEn">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
              <Users className="w-4 h-4 shrink-0 text-primary" />
              <span>{room.capacity}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
              <Maximize2 className="w-4 h-4 shrink-0 text-primary" />
              <span>{room.size} m²</span>
            </div>
          </div>

          <div className="pt-4 mt-auto flex items-center justify-between border-t border-border/40 dark:border-border-strong/10">
            <div className="flex items-baseline space-x-1 rtl:space-x-reverse font-interfaceEn">
              <span className="text-2xl font-bold text-ink dark:text-canvas">${room.pricePerNight}</span>
              <span className="text-xs text-muted">/ {currentLang === 'ar' ? 'الليلة' : 'night'}</span>
            </div>
            {/* {isAvailable ? ( */}
            <span className="text-[13px] font-bold text-primary group-hover:underline">
              {t('common.bookNow')} &rarr;
            </span>
            {/* ) : ( */}
            {/* <span className="text-[13px] font-bold text-error">
              {t('rooms.unavailable')}
            </span> */}
            {/* )} */}
          </div>
        </div>
      </Link>
    );
  }


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
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent z-10 transition-opacity duration-300 group-hover:opacity-90" />

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

        {/* Room Title - Ensure image hover dims/focuses text */}

        <h3 className="font-serif-display text-xl lg:text-2xl font-bold tracking-wide text-white line-clamp-1 leading-tight my-0 group-hover:text-primary transition-colors duration-300">
          {roomName}
        </h3>

        {/* Room Short Description Excerpt */}
        <p className="text-[12px] text-white/70 line-clamp-2 leading-relaxed font-medium my-0">
          {currentLang === 'ar' ? room.descriptionAr : room.descriptionEn}
        </p>

        {/* Metadata Details Row (Capacity, Size, Pricing) */}
        <div className="flex flex-wrap items-center gap-2 pt-1 select-none font-interfaceEn">
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold border border-white/5 text-white/90">
            <Users className="w-3 h-3 shrink-0 opacity-70" />
            <span>{room.capacity}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold border border-white/5 text-white/90">
            <Maximize2 className="w-3 h-3 shrink-0 opacity-70" />
            <span>{room.size} m²</span>
          </div>
          <div className="flex items-center gap-1 bg-primary/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold border border-primary/30 text-primary">
            <DollarSign className="w-3 h-3 shrink-0" />
            <span>{room.pricePerNight}</span>
          </div>
        </div>

        {/* Dynamic Action Trigger Button */}
        <div className="pt-2 select-none">
          {/* {isAvailable ? ( */}
          <div className="w-full bg-white text-ink text-center text-[13px] font-bold py-3 rounded-full shadow-lg group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:scale-[1.01] active:scale-95 cursor-pointer">
            {t('common.bookNow')}
          </div>
          {/* ) : ( */}
          {/* <div className="w-full bg-white/10 backdrop-blur-sm text-white/40 text-center text-[13px] font-bold py-3 rounded-full border border-white/5 cursor-not-allowed">
              {t('rooms.unavailable')}
            </div> */}
          {/* )} */}
        </div>
      </div>
    </Link>
  );
}
