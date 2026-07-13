import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Star, Maximize2, Users, ChevronRightIcon } from 'lucide-react';
import { roomService, reviewService, StorageService } from '../services';
import { hotelSettings } from '../config/hotelSettings';
import { Room, Branch, Review } from '../types';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';
import { BookingWidget } from '../components/bookings/BookingWidget';
import { Skeleton } from '../components/ui/skeleton';

import { RoomGallery } from '../components/room-details/RoomGallery';
import { RoomAmenities } from '../components/room-details/RoomAmenities';
import { RoomMap } from '../components/room-details/RoomMap';
import { RoomReviews } from '../components/room-details/RoomReviews';
import { RoomRecommendations } from '../components/room-details/RoomRecommendations';
import { RoomBookingDialog } from '../components/room-details/RoomBookingDialog';
import { MobileBookingBar } from '../components/room-details/MobileBookingBar';

export default function RoomDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [room, setRoom] = useState<Room | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendedRooms, setRecommendedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Booking States
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const nights = checkIn && checkOut ? dayjs(checkOut).diff(dayjs(checkIn), 'day') : 0;

  useEffect(() => {
    if (nights > 0 && room) {
      setTotalPrice(nights * room.pricePerNight);
    } else {
      setTotalPrice(0);
    }
  }, [nights, room]);

  useEffect(() => {
    const loadRoomDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        // Artificial delay to show skeleton UI
        await new Promise(resolve => setTimeout(resolve, 250));

        const fetchedRoom = await roomService.getRoomById(id);
        if (!fetchedRoom) {
          navigate(`/${currentLang}/404`, { replace: true });
          return;
        }
        setRoom(fetchedRoom);
        const fetchedBranch = await roomService.getBranchById(fetchedRoom.branchId);
        setBranch(fetchedBranch);
        const fetchedReviews = await reviewService.getReviewsByRoomId(id);
        setReviews(fetchedReviews);

        const allRooms = await roomService.getRooms();
        const branchRooms = allRooms.filter(r => r.branchId === fetchedRoom.branchId && r.id !== id);
        const recommendations = branchRooms
          .sort((a, b) => {
            const diffA = Math.abs(a.pricePerNight - fetchedRoom.pricePerNight);
            const diffB = Math.abs(b.pricePerNight - fetchedRoom.pricePerNight);
            if (diffA !== diffB) return diffA - diffB;
            return (b.stars || 5) - (a.stars || 5);
          })
          .slice(0, 3);
        setRecommendedRooms(recommendations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRoomDetails();
  }, [id, currentLang, navigate]);

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || nights < hotelSettings.minimumStay) return;
    dispatch(
      addToCart({
        roomId: room.id,
        checkIn,
        checkOut,
        guests,
        days: nights,
        totalPrice,
      })
    );
    navigate(`/${currentLang}/cart`);
  };

  const isDateDisabled = (dateItem: dayjs.Dayjs | Date) => {
    if (!room) return false;
    const date = dayjs(dateItem);

    if (date.isBefore(dayjs(), 'day')) return true;

    const bookingsList = StorageService.getBookings();
    const roomBookings = bookingsList.filter(b => b.roomId === room.id && b.status === 'confirmed');

    // A date is fully disabled if it falls strictly between check-in and check-out of any booking
    return roomBookings.some(b => {
      const bStart = dayjs(b.startAt).startOf('day');
      const bEnd = dayjs(b.endAt).startOf('day');
      return date.isAfter(bStart, 'day') && date.isBefore(bEnd, 'day');
    });
  };

  if (loading || !room) {
    return (
      <div className={`max-w-7xl mx-auto px-6 py-8 ${currentLang === 'ar' ? 'font-interfaceAr' : 'font-interfaceEn'}`}>
        <div className="mb-6 flex items-center space-x-2 rtl:space-x-reverse">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-6 text-left rtl:text-right">
          <div className="space-y-10 lg:col-span-3">
            <div className="space-y-4">
              <Skeleton className="h-[300px] sm:h-[400px] w-full rounded-3xl" />
              <div className="grid grid-cols-4 gap-3">
                <Skeleton className="h-20 sm:h-24 rounded-2xl" />
                <Skeleton className="h-20 sm:h-24 rounded-2xl" />
                <Skeleton className="h-20 sm:h-24 rounded-2xl" />
                <Skeleton className="h-20 sm:h-24 rounded-2xl" />
              </div>
            </div>
            <div className="space-y-6 pt-6 border-t border-border/40 dark:border-border-strong/10">
              <Skeleton className="h-8 w-1/3 rounded-lg" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 lg:sticky lg:top-28">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const roomName = currentLang === 'ar' ? room.nameAr : room.nameEn;
  const branchName = branch ? (currentLang === 'ar' ? branch.nameAr : branch.nameEn) : '';

  return (
    <div className={`max-w-7xl mx-auto px-6 py-8 ${currentLang === 'ar' ? 'font-interfaceAr' : 'font-interfaceEn'}`}>
      <div className="mb-6">
        <Link to={`/${currentLang}/rooms`} className="gap-2 text-[14px] font-semibold text-muted hover:text-primary transition-colors flex items-center space-x-2 rtl:space-x-reverse">
          <ChevronRightIcon className='ltr:rotate-180' />
          <span>{t('common.back')}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-6 text-left rtl:text-right">
        <div className="space-y-10 lg:col-span-3">
          <RoomGallery images={room.images} roomName={roomName} />

          <RoomAmenities services={room.services} />

          <RoomMap branchId={room.branchId} />

          <RoomReviews
            room={room}
            reviews={reviews}
            setReviews={setReviews}
            setRoom={setRoom}
          />
        </div>

        <div className="space-y-10 lg:col-span-2 lg:sticky lg:top-24">
          <div className="space-y-4">
            <span className="text-[13px] font-semibold text-primary uppercase">{branchName}</span>
            <h1 className="font-serif-display text-4xl font-semibold">{roomName}</h1>
            <div className="flex text-primary">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < (room.stars || 5) ? 'fill-primary' : 'text-border'}`} />)}
            </div>
          </div>

          <div className="flex items-center space-x-6 gap-2 rtl:space-x-reverse py-4 border-y border-border/40 text-[14px] font-semibold">
            <span className="flex items-center gap-1 space-x-2"><Maximize2 className="w-4 h-4 text-primary" /><span>{t('common.roomSize', { size: room.size })}</span></span>
            <span className="flex items-center gap-1 space-x-2"><Users className="w-4 h-4 text-primary" /><span>{t('rooms.capacityLabel', { count: room.capacity })}</span></span>
          </div>

          <BookingWidget
            room={room}
            isDateDisabled={isDateDisabled}
            bookedDates={StorageService.getBookings().filter(b => b.roomId === room?.id && b.status === 'confirmed')}
            onBookNow={(start, end, guestsCount) => {
              setCheckIn(start);
              setCheckOut(end);
              setGuests(guestsCount);
              setBookingStep(3);
              setIsBookingDialogOpen(true);
            }}
          />
        </div>
      </div>

      <RoomRecommendations recommendedRooms={recommendedRooms} branch={branch} />

      <RoomBookingDialog
        room={room}
        checkIn={checkIn}
        checkOut={checkOut}
        nights={nights}
        totalPrice={totalPrice}
        isBookingDialogOpen={isBookingDialogOpen}
        setIsBookingDialogOpen={setIsBookingDialogOpen}
        bookingStep={bookingStep}
        setBookingStep={setBookingStep}
        handleBookNow={handleBookNow}
        isDateConflicting={false}
      />

      <MobileBookingBar
        room={room}
        checkIn={checkIn}
        checkOut={checkOut}
        setBookingStep={setBookingStep}
        setIsBookingDialogOpen={setIsBookingDialogOpen}
      />
    </div>
  );
}
