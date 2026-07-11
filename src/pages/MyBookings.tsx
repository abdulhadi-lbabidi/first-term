import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store';
import { bookingService, roomService } from '../services';
import { Booking, Room, Branch } from '../types';
import Button from '../components/ui/Button';
import { Calendar, CreditCard, XCircle, Briefcase } from 'lucide-react';
import dayjs from 'dayjs';

interface BookingWithDetails extends Booking {
  room: Room;
  branch?: Branch;
}

export default function MyBookings() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Route protection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate(`/${currentLang}/login?redirect=bookings`);
    }
  }, [isAuthenticated, navigate, currentLang, user]);

  const loadBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const fetchedBookings = await bookingService.getBookings(user.id);
      const branches = await roomService.getBranches();
      
      const detailedBookings = await Promise.all(
        fetchedBookings.map(async (b) => {
          const room = await roomService.getRoomById(b.roomId);
          if (!room) return null;
          const branch = branches.find((br) => br.id === room.branchId);
          return {
            ...b,
            room,
            branch,
          };
        })
      );

      const sorted = (detailedBookings.filter((db) => db !== null) as BookingWithDetails[])
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setBookings(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm(t('bookings.cancelConfirm'))) return;
    try {
      await bookingService.cancelBooking(bookingId);
      await loadBookings();
    } catch (err) {
      console.error(err);
      alert('فشل إلغاء الحجز / Error cancelling reservation');
    }
  };

  const handlePayBooking = async (bookingId: string) => {
    try {
      await bookingService.payBooking(bookingId);
      await loadBookings();
    } catch (err) {
      console.error(err);
      alert('فشل دفع الحجز / Error paying reservation');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="mt-4 text-muted">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 font-interfaceEn py-8">
      {/* Header */}
      <h1 className="font-serif-display text-3xl font-semibold text-ink dark:text-canvas mb-8 text-left rtl:text-right">
        {t('bookings.myBookingsTitle')}
      </h1>

      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const roomName = currentLang === 'ar' ? booking.room.nameAr : booking.room.nameEn;
            const branchName = booking.branch 
              ? (currentLang === 'ar' ? booking.branch.nameAr : booking.branch.nameEn)
              : '';
            
            const isConfirmed = booking.status === 'confirmed';
            const isCancelled = booking.status === 'cancelled';
            const isPaid = booking.paymentStatus === 'paid';

            return (
              <div 
                key={booking.id} 
                className="bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-center md:items-start text-left rtl:text-right"
              >
                {/* Compact Room Image */}
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-canvas/30 shrink-0">
                  <img 
                    src={booking.room.images[0]} 
                    alt={roomName} 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* Details Column */}
                <div className="flex-grow space-y-2 w-full">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
                        {branchName}
                      </span>
                      <h3 className="font-serif-display text-base font-semibold text-ink dark:text-canvas my-0.5">
                        {roomName}
                      </h3>
                      {/* Compact dates info */}
                      <span className="text-[13px] text-muted font-medium flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{dayjs(booking.checkIn).format('DD MMM YYYY')} &rarr; {dayjs(booking.checkOut).format('DD MMM YYYY')}</span>
                        <span className="opacity-60">({t('common.nights', { count: booking.days })})</span>
                      </span>
                    </div>

                    {/* Stats & Badges */}
                    <div className="flex flex-col items-end gap-1.5 text-right rtl:text-left">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          isConfirmed 
                            ? 'bg-success/5 text-success border-success/10' 
                            : isCancelled 
                              ? 'bg-error/5 text-error border-error/10'
                              : 'bg-primary/5 text-primary border-primary/10'
                        }`}>
                          {t(`bookings.${booking.status}`)}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          isPaid 
                            ? 'bg-success/5 text-success border-success/10' 
                            : 'bg-primary-soft text-primary border-primary/10'
                        }`}>
                          {t(`bookings.${booking.paymentStatus}`)}
                        </span>
                      </div>
                      <div className="text-[14px] font-bold text-ink dark:text-canvas font-interfaceEn">
                        ${booking.totalPrice}
                      </div>
                    </div>
                  </div>

                  {/* Clean Action Row */}
                  {!isCancelled && !isPaid && (
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/30 dark:border-border-strong/10 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-error border-error/20 hover:bg-error/5"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
                        <span>{t('bookings.cancelBtn')}</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handlePayBooking(booking.id)}
                      >
                        <CreditCard className="w-3.5 h-3.5 mr-1 rtl:ml-1 rtl:mr-0" />
                        <span>{t('bookings.payBtn')}</span>
                      </Button>
                    </div>
                  )}

                  {!isCancelled && isPaid && (
                    <div className="flex justify-end pt-2 border-t border-border/30 dark:border-border-strong/10 mt-2">
                      <span className="text-[12px] text-success font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                        <span>{currentLang === 'ar' ? 'تم الدفع والـتأكيد' : 'Paid & Confirmed'}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-6 max-w-sm mx-auto shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="font-serif-display text-xl font-semibold text-ink dark:text-canvas mb-2">
            {currentLang === 'ar' ? 'لا توجد حجوزات' : 'No Reservations Found'}
          </h3>
          <p className="text-[13px] text-muted mb-5 leading-relaxed">
            {t('bookings.noBookings')}
          </p>
          <Link to={`/${currentLang}/rooms`}>
            <Button size="sm" variant="primary">
              {t('common.rooms')}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
