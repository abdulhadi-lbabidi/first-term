import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roomService, reviewService, bookingService, StorageService } from '../services';
import { hotelSettings } from '../config/hotelSettings';
import { Room, Branch, Review } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart } from '../store/cartSlice';
import RoomCard from '../components/room/RoomCard';
import { Dialog, DialogContent } from '../components/ui/Dialog';
import dayjs from 'dayjs';
import {
  Star,
  Maximize2,
  Users,
  Check,
  Calendar as CalendarIcon,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';

export default function RoomDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const isRtl = currentLang === 'ar';
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [room, setRoom] = useState<Room | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendedRooms, setRecommendedRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  //  // Booking States
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);

  const [guests, setGuests] = useState<number>(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Calculate pricing
  const [totalPrice, setTotalPrice] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Active Image Gallery State
  const [activeImage, setActiveImage] = useState('');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  // Review Permission States
  const [canReview, setCanReview] = useState(false);
  const [reviewRestrictionReason, setReviewRestrictionReason] = useState<'no_booking' | 'already_reviewed' | null>(null);

  // Date Conflict Check State
  const [isDateConflicting, setIsDateConflicting] = useState(false);

  // Reviews View State
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isDateDisabledForCheckIn = (dateItem: dayjs.Dayjs) => {
    if (!room) return false;
    const bookingsList = StorageService.getBookings();
    const roomBookings = bookingsList.filter(b => b.roomId === room.id && b.status === 'confirmed');

    const startCandidate = dateItem.format('YYYY-MM-DD') + 'T' + hotelSettings.checkInTime + ':00';

    return roomBookings.some(b => {
      return dayjs(startCandidate).isBefore(dayjs(b.checkOutDate)) && !dayjs(startCandidate).isBefore(dayjs(b.checkInDate));
    });
  };

  const isDateDisabledForCheckOut = (dateItem: dayjs.Dayjs) => {
    if (!checkIn) return true;
    if (!room) return false;

    const checkInDay = dayjs(checkIn);
    if (dateItem.isBefore(checkInDay.add(1, 'day'), 'day')) return true;
    if (dateItem.diff(checkInDay, 'day') > hotelSettings.maximumStay) return true;

    const startCandidate = checkIn + 'T' + hotelSettings.checkInTime + ':00';
    const endCandidate = dateItem.format('YYYY-MM-DD') + 'T' + hotelSettings.checkOutTime + ':00';

    const bookingsList = StorageService.getBookings();
    const roomBookings = bookingsList.filter(b => b.roomId === room.id && b.status === 'confirmed');

    return roomBookings.some(b => {
      return dayjs(startCandidate).isBefore(dayjs(b.checkOutDate)) && dayjs(endCandidate).isAfter(dayjs(b.checkInDate));
    });
  };

  const isDateConflicted = (date: Date) => {
    return checkIn && !checkOut ? isDateDisabledForCheckOut(dayjs(date)) : isDateDisabledForCheckIn(dayjs(date));
  };

  const nights = checkIn && checkOut ? dayjs(checkOut).diff(dayjs(checkIn), 'day') : 0;

  useEffect(() => {
    if (nights > 0 && room) {
      setTotalPrice(nights * room.pricePerNight);
    } else {
      setTotalPrice(0);
    }
  }, [nights, room]);

  // Load Room Details
  useEffect(() => {
    const loadRoomDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const fetchedRoom = await roomService.getRoomById(id);
        if (!fetchedRoom) {
          navigate(`/${currentLang}/404`, { replace: true });
          return;
        }
        setRoom(fetchedRoom);
        setActiveImage(fetchedRoom.images[0]);
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

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!id || !isAuthenticated || !user) {
        setCanReview(false);
        setReviewRestrictionReason(null);
        return;
      }
      try {
        const userBookings = await bookingService.getBookings(user.id);
        const roomBookings = userBookings.filter(b => b.roomId === id && b.status === 'confirmed');
        const userRoomReviews = reviews.filter(r => r.userId === user.id);
        if (roomBookings.length === 0) {
          setCanReview(false);
          setReviewRestrictionReason('no_booking');
        } else if (userRoomReviews.length >= roomBookings.length) {
          setCanReview(false);
          setReviewRestrictionReason('already_reviewed');
        } else {
          setCanReview(true);
          setReviewRestrictionReason(null);
        }
      } catch (err) {
        console.error('Error checking review eligibility:', err);
      }
    };
    checkReviewEligibility();
  }, [id, reviews, isAuthenticated, user]);

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || nights < hotelSettings.minimumStay) return;
    dispatch(
      addToCart({
        roomId: room.id,
        checkIn,
        checkOut,
        days: nights,
        totalPrice,
      })
    );
    navigate(`/${currentLang}/cart`);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !room) return;
    if (!comment.trim()) {
      setReviewError('يرجى كتابة تعليق / Please write a comment');
      return;
    }
    try {
      const newReview = await reviewService.addReview(user.id, room.id, rating, comment);
      setReviews((prev) => [newReview, ...prev]);
      setComment('');
      setRating(5);
      setReviewError('');
      setShowReviewForm(false);
      const updatedRoom = await roomService.getRoomById(room.id);
      if (updatedRoom) setRoom(updatedRoom);
    } catch (err: any) {
      setReviewError(err.message || 'فشل إرسال التقييم / Failed to submit review');
    }
  };

  const getBranchMapUrl = (branchId: string) => {
    const maps = {
      'dubai-branch': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178598418933!2d55.2721877!3d25.197197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a6d4885%3A0x88981f9a1f9a1f9a!2sBurj%20Khalifa!5e0!3m2!1sen!2sae!4v1689000000000!5m2!1sen!2sae',
      'istanbul-branch': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.043694082329!2d28.9829916!3d41.0369989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab76506566caf%3A0x88981f9a1f9a1f9a!2sTaksim%20Square!5e0!3m2!1sen!2str!4v1689000000000!5m2!1sen!2str',
      'paris-branch': 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937616!2d2.2922926!3d48.8583701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sfr!4v1689000000000!5m2!1sen!2sfr'
    };
    return maps[branchId as keyof typeof maps] || maps['dubai-branch'];
  };

  if (loading || !room) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="mt-4 text-muted">{t('common.loading')}</p>
      </div>
    );
  }

  const roomName = currentLang === 'ar' ? room.nameAr : room.nameEn;
  const branchName = branch ? (currentLang === 'ar' ? branch.nameAr : branch.nameEn) : '';
  const description = currentLang === 'ar' ? room.descriptionAr : room.descriptionEn;

  const starCounts = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    const starIdx = 5 - r.rating;
    if (starIdx >= 0 && starIdx < 5) starCounts[starIdx]++;
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-6 font-interfaceEn py-8">
      <div className="mb-6">
        <Link to={`/${currentLang}/rooms`} className="text-[14px] font-semibold text-muted hover:text-primary transition-colors flex items-center space-x-2 rtl:space-x-reverse">
          <span>&larr;</span>
          <span>{t('common.back')}</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start mt-6 text-left rtl:text-right">
        <div className="space-y-10 lg:col-span-3">
          <div className="space-y-4">
            <div className="aspect-[3/2] max-w-4xl mx-auto w-full rounded-2xl overflow-hidden shadow-md bg-canvas/30 relative">
              <img src={activeImage} alt={roomName} className="w-full h-full object-cover cursor-zoom-in hover:scale-[1.01] transition-transform duration-500" onClick={() => setIsImageDialogOpen(true)} />
            </div>
            {room.images.length > 1 && (
              <div className="flex space-x-3 rtl:space-x-reverse overflow-x-auto pb-2">
                {room.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(img)} className={`relative w-24 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent opacity-75 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5 pt-6 border-t border-border/40 dark:border-border-strong/10">
            <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas">{t('rooms.amenities')}</h3>
            <div className="grid grid-cols-2 gap-4">
              {room.services.map((srv) => (
                <div key={srv} className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-[14px] font-medium text-ink/80 dark:text-canvas/80">{t(`common.services.${srv}`)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 pt-6 border-t border-border/40 dark:border-border-strong/10">
            <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas">{currentLang === 'ar' ? 'الموقع على الخريطة' : 'Location on Map'}</h3>
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border/40 dark:border-border-strong/15 shadow-sm">
              <iframe title="Branch Location Map" src={getBranchMapUrl(room.branchId)} className="w-full h-full border-0" allowFullScreen loading="lazy" />
            </div>
          </div>

          <section className="pt-8 border-t border-border/40 dark:border-border-strong/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas flex items-center space-x-2 rtl:space-x-reverse">
                <MessageSquare className="w-6 h-6 text-primary" />
                <span>{t('rooms.reviews')}</span>
                <span className="text-sm font-medium text-muted bg-canvas px-2.5 py-0.5 rounded-full">{reviews.length}</span>
              </h3>

              {/* Add Review Button (Shows if authenticated, can review, and form is not open) */}
              {isAuthenticated && canReview && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {t('rooms.addReview')}
                </button>
              )}
            </div>

            <div className="space-y-8">
              {/* Review Form - Top of the list */}
              {showReviewForm && (
                <div className="bg-white dark:bg-ink border border-primary/25 rounded-2xl p-6 relative shadow-sm">
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-muted hover:text-ink text-sm font-medium"
                  >
                    {currentLang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <h4 className="font-serif-display text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      {t('rooms.addReview')}
                    </h4>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button type="button" key={star} onClick={() => setRating(star)} className="cursor-pointer">
                          <Star className={`w-7 h-7 ${star <= rating ? 'fill-primary text-primary' : 'text-border'}`} />
                        </button>
                      ))}
                    </div>
                    <textarea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t('rooms.reviewPlaceholder')} className="w-full p-4 bg-canvas/30 border border-border rounded-xl outline-none" />
                    {reviewError && <p className="text-[13px] text-error">{reviewError}</p>}
                    <button type="submit" className="bg-primary hover:bg-primary-hover transition-colors text-white px-6 py-2.5 rounded-full w-full sm:w-auto min-w-[200px] font-medium shadow-md">
                      {t('rooms.submitReview')}
                    </button>
                  </form>
                </div>
              )}

              {/* Authentication/Permission Messages */}
              {!isAuthenticated && (
                <div className="bg-canvas/40 p-6 rounded-2xl text-center border border-dashed border-border mb-8">
                  <Link to={`/${currentLang}/login`} className="text-primary font-semibold hover:underline">{t('common.login')}</Link>
                </div>
              )}
              {isAuthenticated && !canReview && reviewRestrictionReason && (
                <div className="bg-canvas/50 p-5 rounded-2xl text-center mb-8">
                  <p className="text-[14px] font-semibold">{reviewRestrictionReason === 'no_booking' ? t('rooms.noBookingReview') : t('rooms.alreadyReviewed')}</p>
                </div>
              )}

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {(showAllReviews ? reviews : reviews.slice(0, 3)).map((rev) => (
                    <div key={rev.id} className="bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[14px] font-bold">{rev.userId}</span>
                        <div className="flex text-primary">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-primary' : 'text-border'}`} />)}
                        </div>
                      </div>
                      <p className="text-[14px] text-body dark:text-canvas/80 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                  {reviews.length > 3 && (
                    <div className="pt-4 text-center">
                      <button onClick={() => setShowAllReviews(!showAllReviews)} className="text-primary font-semibold hover:underline text-sm transition-colors">
                        {showAllReviews ? (currentLang === 'ar' ? 'عرض أقل' : 'Show Less') : (currentLang === 'ar' ? 'عرض المزيد' : 'Show All')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-canvas/30 rounded-2xl p-8 text-center border border-dashed border-border/50">
                  <p className="text-[14px] text-muted italic">{t('rooms.noReviews')}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-10 lg:col-span-2 lg:sticky lg:top-24">
          <div className="space-y-4">
            <span className="text-[13px] font-semibold text-primary uppercase">{branchName}</span>
            <h1 className="font-serif-display text-4xl font-semibold">{roomName}</h1>
            <div className="flex text-primary">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < (room.stars || 5) ? 'fill-primary' : 'text-border'}`} />)}
            </div>
          </div>

          <div className="flex items-center space-x-6 rtl:space-x-reverse py-4 border-y border-border/40 text-[14px] font-semibold">
            <span className="flex items-center space-x-2"><Maximize2 className="w-4 h-4 text-primary" /><span>{t('common.roomSize', { size: room.size })}</span></span>
            <span className="flex items-center space-x-2"><Users className="w-4 h-4 text-primary" /><span>{t('rooms.capacityLabel', { count: room.capacity })}</span></span>
          </div>

          <div className="bg-white dark:bg-ink border border-border rounded-2xl p-6 shadow-md space-y-6">
            <div className="pb-4 border-b border-border/50">
              <span className="text-[13px] text-muted">{t('common.priceLabel')}</span>
              <div className="text-3xl font-bold font-serif-display">${room.pricePerNight} <span className="text-[14px] text-muted">/ {t('common.night')}</span></div>
            </div>

            <div className="space-y-4">
              {checkIn && checkOut && (
                <div className="bg-canvas/50 dark:bg-canvas/5 p-3 rounded-xl border border-border/50 text-[13px] flex items-center justify-between">
                  <div>
                    <p className="text-muted mb-0.5">{currentLang === 'ar' ? 'الوصول' : 'Check-in'}</p>
                    <p className="font-semibold text-ink dark:text-canvas">{dayjs(checkIn).format('MMM DD')}</p>
                  </div>
                  <div className="text-center px-4 border-x border-border/50">
                    <p className="text-primary font-bold">{nights} {currentLang === 'ar' ? 'ليالي' : 'Nights'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted mb-0.5">{currentLang === 'ar' ? 'المغادرة' : 'Check-out'}</p>
                    <p className="font-semibold text-ink dark:text-canvas">{dayjs(checkOut).format('MMM DD')}</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setBookingStep(checkIn && checkOut ? 3 : 1);
                  setIsBookingDialogOpen(true);
                }}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold h-12 rounded-full transition-all duration-300 shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{checkIn && checkOut ? t('common.bookNow') : (currentLang === 'ar' ? 'اختيار التواريخ' : 'Select Dates')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Slider */}
      {recommendedRooms.length > 0 && (
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
      )}

      {/* Image Zoom Dialog Modal */}
      <Dialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
      >
        <DialogContent className="max-w-4xl bg-white dark:bg-ink p-6 rounded-2xl border border-border dark:border-border-strong/20">
          <div className="relative">
            <img
              src={activeImage}
              alt={roomName}
              className="w-full h-auto object-contain rounded-xl max-h-[80vh] mx-auto"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Multi-step Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-ink p-6 sm:p-8 rounded-3xl border border-border">
          {bookingStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas mb-1">
                  {currentLang === 'ar' ? 'اختر تاريخ الوصول' : 'Select Check-in Date'}
                </h3>
                <p className="text-sm text-muted">{currentLang === 'ar' ? 'الخطوة 1 من 3' : 'Step 1 of 3'}</p>
              </div>
              <div className="flex justify-center bg-canvas/30 rounded-2xl p-4 border border-border">
                <Calendar
                  mode="single"
                  selected={checkIn ? dayjs(checkIn).toDate() : undefined}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      setCheckIn(dayjs(date).format('YYYY-MM-DD'));
                      if (checkOut && dayjs(date).isAfter(dayjs(checkOut))) {
                         setCheckOut('');
                      }
                    }
                  }}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || isDateDisabledForCheckIn(dayjs(date))}
                  numberOfMonths={1}
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!checkIn}
                  onClick={() => setBookingStep(2)}
                  className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-8 py-2.5 rounded-full font-semibold shadow-md transition-colors cursor-pointer"
                >
                  {currentLang === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {bookingStep === 2 && (
            <div className="space-y-6">
              <div className="text-center relative">
                <button onClick={() => setBookingStep(1)} className="absolute left-0 top-1 text-muted hover:text-ink">
                  &larr; {currentLang === 'ar' ? 'رجوع' : 'Back'}
                </button>
                <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas mb-1">
                  {currentLang === 'ar' ? 'اختر تاريخ المغادرة' : 'Select Check-out Date'}
                </h3>
                <p className="text-sm text-muted">{currentLang === 'ar' ? 'الخطوة 2 من 3' : 'Step 2 of 3'}</p>
              </div>
              <div className="flex justify-center bg-canvas/30 rounded-2xl p-4 border border-border">
                <Calendar
                  mode="single"
                  selected={checkOut ? dayjs(checkOut).toDate() : undefined}
                  onSelect={(date: Date | undefined) => {
                    if (date) setCheckOut(dayjs(date).format('YYYY-MM-DD'));
                  }}
                  disabled={(date) => date <= dayjs(checkIn).toDate() || isDateDisabledForCheckOut(dayjs(date))}
                  numberOfMonths={1}
                />
              </div>
              {isDateConflicting && (
                <div className="p-3 bg-error/10 border border-error/20 text-error rounded-xl text-[12px] text-center">
                  {currentLang === 'ar' ? 'التواريخ المختارة غير متاحة.' : 'Selected dates are unavailable.'}
                </div>
              )}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={!checkOut || isDateConflicting}
                  onClick={() => setBookingStep(3)}
                  className="bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-8 py-2.5 rounded-full font-semibold shadow-md transition-colors cursor-pointer"
                >
                  {currentLang === 'ar' ? 'التالي' : 'Next'}
                </button>
              </div>
            </div>
          )}

          {bookingStep === 3 && (
            <div className="space-y-6">
              <div className="text-center relative">
                <button onClick={() => setBookingStep(2)} className="absolute left-0 top-1 text-muted hover:text-ink">
                  &larr; {currentLang === 'ar' ? 'رجوع' : 'Back'}
                </button>
                <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas mb-1">
                  {currentLang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
                </h3>
                <p className="text-sm text-muted">{currentLang === 'ar' ? 'الخطوة 3 من 3' : 'Step 3 of 3'}</p>
              </div>
              
              <div className="bg-canvas/50 dark:bg-canvas/5 p-4 rounded-2xl border border-border/50 text-[14px] flex items-center justify-between">
                <div>
                  <p className="text-muted mb-1">{currentLang === 'ar' ? 'الوصول' : 'Check-in'}</p>
                  <p className="font-semibold text-ink dark:text-canvas">{dayjs(checkIn).format('MMM DD, YYYY')}</p>
                </div>
                <div className="text-center px-4 border-x border-border/50">
                  <p className="text-primary font-bold">{nights} {currentLang === 'ar' ? 'ليالي' : 'Nights'}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted mb-1">{currentLang === 'ar' ? 'المغادرة' : 'Check-out'}</p>
                  <p className="font-semibold text-ink dark:text-canvas">{dayjs(checkOut).format('MMM DD, YYYY')}</p>
                </div>
              </div>

              <div className="bg-canvas/30 rounded-2xl p-5 space-y-4 border border-border">
                <div className="flex items-center justify-between text-body dark:text-canvas/80">
                  <span>${room.pricePerNight} x {t('common.nights', { count: nights })}</span>
                  <span>${totalPrice}</span>
                </div>
                <hr className="border-border dark:border-border-strong/10" />
                <div className="flex items-center justify-between font-bold text-ink dark:text-canvas text-xl">
                  <span>{t('bookings.totalPrice')}</span>
                  <span>${totalPrice}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  setIsBookingDialogOpen(false);
                  handleBookNow(e);
                }}
                disabled={nights <= 0 || isDateConflicting}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold h-14 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 cursor-pointer mt-4"
              >
                <span>{t('common.bookNow')}</span>
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Mobile Fixed Bottom Booking Bar (سعر الحجز دائما مثبت بالشاشة) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-ink/95 backdrop-blur-md border-t border-border/40 dark:border-border-strong/15 px-6 py-4 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div>
          <span className="text-[11px] text-muted block uppercase tracking-wider font-semibold">
            {t('common.priceLabel')}
          </span>
          <div className="flex items-baseline space-x-1 rtl:space-x-reverse">
            <span className="text-xl font-bold text-primary font-interfaceEn">${room.pricePerNight}</span>
            <span className="text-[12px] text-muted">/ {currentLang === 'ar' ? 'الليلة' : 'night'}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setBookingStep(checkIn && checkOut ? 3 : 1);
            setIsBookingDialogOpen(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold px-6 py-2.5 rounded-full shadow-md cursor-pointer transition-all duration-300 active:scale-95"
        >
          {checkIn && checkOut ? t('common.bookNow') : (currentLang === 'ar' ? 'اختيار التواريخ' : 'Select Dates')}
        </button>
      </div>
    </div>
  );
}
