import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roomService, reviewService, bookingService, StorageService } from '../services';
import { Room, Branch, Review } from '../types';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart } from '../store/cartSlice';
import RoomCard from '../components/room/RoomCard';
import Dialog from '../components/ui/Dialog';
import dayjs from 'dayjs';
import {
  Star,
  Maximize2,
  Users,
  Check,
  Calendar,
  MessageSquare,
  Sparkles
} from 'lucide-react';

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

  // Form Booking State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [duration, setDuration] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Calendar Date Range Picker Popover states
  const [calendarMonth, setCalendarMonth] = useState(dayjs());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Review Form State
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

  // Close calendar popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDateBooked = (dateItem: dayjs.Dayjs) => {
    if (!room) return false;
    const bookingsList = StorageService.getBookings();
    const roomBookings = bookingsList.filter(b => b.roomId === room.id && b.status === 'confirmed');
    
    return roomBookings.some(b => {
      const start = dayjs(b.checkIn);
      const end = dayjs(b.checkOut);
      return (dateItem.isSame(start, 'day') || dateItem.isAfter(start, 'day')) && dateItem.isBefore(end, 'day');
    });
  };

  const hasBookedDateInRange = (startStr: string, endStr: string) => {
    let current = dayjs(startStr);
    const end = dayjs(endStr);
    while (current.isBefore(end, 'day')) {
      if (isDateBooked(current)) return true;
      current = current.add(1, 'day');
    }
    return false;
  };

  // Check date conflict with existing bookings
  useEffect(() => {
    if (!id || !checkIn || !checkOut) {
      setIsDateConflicting(false);
      return;
    }
    setIsDateConflicting(hasBookedDateInRange(checkIn, checkOut));
  }, [id, checkIn, checkOut]);

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

        // Reviews
        const fetchedReviews = await reviewService.getReviewsByRoomId(id);
        setReviews(fetchedReviews);

        // Recommendations (same branch, excluding current room)
        const allRooms = await roomService.getRooms();
        const branchRooms = allRooms.filter(r => r.branchId === fetchedRoom.branchId && r.id !== id);

        // Recommendation logic
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

  // Handle Dates recalculation
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = dayjs(checkIn);
      const end = dayjs(checkOut);
      const diff = end.diff(start, 'day');

      if (diff > 0 && room) {
        setDuration(diff);
        setTotalPrice(diff * room.pricePerNight);
      } else {
        setDuration(0);
        setTotalPrice(0);
      }
    } else {
      setDuration(0);
      setTotalPrice(0);
    }
  }, [checkIn, checkOut, room]);

  // Check review permission
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
    if (!room) return;
    if (duration <= 0) return;

    dispatch(
      addToCart({
        roomId: room.id,
        checkIn,
        checkOut,
        days: duration,
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

      // Reload room details to reflect average stars update
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
  const branchName = branch
    ? (currentLang === 'ar' ? branch.nameAr : branch.nameEn)
    : '';
  const description = currentLang === 'ar' ? room.descriptionAr : room.descriptionEn;

  // Generate calendar days
  const startDay = calendarMonth.startOf('month').startOf('week');
  const endDay = calendarMonth.endOf('month').endOf('week');
  const days: dayjs.Dayjs[] = [];
  let day = startDay;
  while (day.isBefore(endDay) || day.isSame(endDay, 'day')) {
    days.push(day);
    day = day.add(1, 'day');
  }

  // Calculate review score progress breakdown
  const starCounts = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    const starIdx = 5 - r.rating;
    if (starIdx >= 0 && starIdx < 5) {
      starCounts[starIdx]++;
    }
  });

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  return (
    <div className="max-w-7xl mx-auto px-6 font-interfaceEn py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to={`/${currentLang}/rooms`}
          className="text-[14px] font-semibold text-muted hover:text-primary transition-colors flex items-center space-x-2' rtl:space-x-reverse"
        >
          <span>&larr;</span>
          <span>{t('common.back')}</span>
        </Link>
      </div>

      {/* Main Grid: 2 Columns restructuring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-6 text-left rtl:text-right">
        
        {/* Column 1: Images | Amenities | Location Map */}
        <div className="space-y-10 lg:col-span-1">
          {/* Gallery Images Container */}
          <div className="space-y-4">
            <div className="aspect-[3/2] max-w-4xl mx-auto w-full rounded-2xl overflow-hidden shadow-md bg-canvas/30 relative">
              <img
                src={activeImage}
                alt={roomName}
                className="w-full h-full object-cover cursor-zoom-in hover:scale-[1.01] transition-transform duration-500"
                onClick={() => setIsImageDialogOpen(true)}
              />
            </div>
            {room.images.length > 1 && (
              <div className="flex space-x-3 rtl:space-x-reverse overflow-x-auto pb-2">
                {room.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-24 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Amenities Services list */}
          <div className="space-y-5 text-left rtl:text-right pt-6 border-t border-border/40 dark:border-border-strong/10">
            <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas">
              {t('rooms.amenities')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {room.services.map((srv) => (
                <div
                  key={srv}
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-[14px] font-medium text-ink/80 dark:text-canvas/80 font-interfaceEn">
                    {t(`common.services.${srv}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div className="space-y-5 text-left rtl:text-right pt-6 border-t border-border/40 dark:border-border-strong/10">
            <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas">
              {currentLang === 'ar' ? 'الموقع على الخريطة' : 'Location on Map'}
            </h3>
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border/40 dark:border-border-strong/15 shadow-sm">
              <iframe
                title="Branch Location Map"
                src={getBranchMapUrl(room.branchId)}
                className="w-full h-full border-0 animate-fade-in"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Column 2: Details Header | Description | Specs | Booking Table Form */}
        <div className="space-y-10 lg:col-span-1">
          {/* Header & Star ratings */}
          <div className="space-y-4">
            <div>
              <span className="text-[13px] font-semibold text-primary uppercase tracking-wider block mb-1">
                {branchName}
              </span>
              <h1 className="font-serif-display text-3xl lg:text-4xl font-semibold text-ink dark:text-canvas my-0">
                {roomName}
              </h1>
            </div>
            <div className="flex items-center space-x-1 rtl:space-x-reverse text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4.5 h-4.5 ${i < (room.stars || 5)
                    ? 'fill-primary'
                    : 'text-border dark:text-border-strong/20'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Specs Row */}
          <div className="flex items-center space-x-6 rtl:space-x-reverse text-[14px] text-body/80 dark:text-canvas/70 font-semibold py-4 border-y border-border/40 dark:border-border-strong/10">
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <Maximize2 className="w-4.5 h-4.5 text-primary" />
              <span>{t('common.roomSize', { size: room.size })}</span>
            </span>
            <span className="flex items-center space-x-2 rtl:space-x-reverse">
              <Users className="w-4.5 h-4.5 text-primary" />
              <span>{t('rooms.capacityLabel', { count: room.capacity })}</span>
            </span>
            <span>{currentLang === 'ar' ? `غرفة رقم ${room.roomNumber}` : `Room #${room.roomNumber}`}</span>
          </div>

          {/* Description Block */}
          <div className="space-y-4 text-left rtl:text-right">
            <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas my-0">
              {t('rooms.description')}
            </h3>
            <p className="text-[15px] text-body/90 dark:text-canvas/80 leading-relaxed font-light">
              {description}
            </p>
          </div>

          {/* Booking Widget (Booking Table) */}
          <div className="bg-white dark:bg-ink border border-border dark:border-border-strong/25 rounded-2xl p-6 shadow-md space-y-6">
            <div className="pb-4 border-b border-border/50 dark:border-border-strong/15 text-left rtl:text-right">
              <span className="text-[13px] text-muted font-medium">
                {t('common.priceLabel')}
              </span>
              <div className="flex items-baseline space-x-1 rtl:space-x-reverse mt-1">
                <span className="font-serif-display text-3xl font-bold text-ink dark:text-canvas">${room.pricePerNight}</span>
                <span className="text-[14px] text-muted">/ {currentLang === 'ar' ? 'الليلة' : 'night'}</span>
              </div>
            </div>

            <form onSubmit={handleBookNow} className="space-y-5 text-left rtl:text-right">
              {/* Check-In / Check-Out inside one single input picker */}
              <div className="space-y-2 relative" ref={calendarRef}>
                <label className="text-[13px] font-semibold text-ink/75 dark:text-canvas/75 uppercase tracking-wide flex items-center space-x-2 rtl:space-x-reverse select-none">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{currentLang === 'ar' ? 'تاريخ الحجز (الوصول والمغادرة)' : 'Booking Dates (Check-in / Check-out)'}</span>
                </label>
                <div
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  className="w-full h-12 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 hover:border-primary/50 focus-within:border-primary rounded-xl text-[14px] flex items-center justify-between cursor-pointer transition-all duration-300 font-medium select-none text-ink dark:text-canvas"
                >
                  <span>
                    {checkIn && checkOut 
                      ? `${dayjs(checkIn).format('DD MMM, YYYY')} - ${dayjs(checkOut).format('DD MMM, YYYY')}`
                      : checkIn 
                        ? `${dayjs(checkIn).format('DD MMM, YYYY')} - ...`
                        : (currentLang === 'ar' ? 'اختر التواريخ...' : 'Select dates...')}
                  </span>
                  <Calendar className="w-4.5 h-4.5 text-muted shrink-0" />
                </div>
                
                {isCalendarOpen && (
                  <div className="absolute z-30 w-72 mt-1 bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl shadow-xl overflow-hidden p-4 text-[13px] animate-fade-in select-none font-interfaceEn text-ink dark:text-canvas">
                    {/* Calendar Month Switch Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => setCalendarMonth(prev => prev.subtract(1, 'month'))}
                        className="p-1 hover:bg-canvas dark:hover:bg-body/20 rounded-full text-muted hover:text-ink dark:hover:text-canvas cursor-pointer font-bold select-none"
                      >
                        &larr;
                      </button>
                      <span className="font-bold">
                        {calendarMonth.format('MMMM YYYY')}
                      </span>
                      <button
                        type="button"
                        onClick={() => setCalendarMonth(prev => prev.add(1, 'month'))}
                        className="p-1 hover:bg-canvas dark:hover:bg-body/20 rounded-full text-muted hover:text-ink dark:hover:text-canvas cursor-pointer font-bold select-none"
                      >
                        &rarr;
                      </button>
                    </div>

                    {/* Week headers */}
                    <div className="grid grid-cols-7 text-center font-bold text-muted text-[10px] uppercase mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
                        <span key={w}>{w}</span>
                      ))}
                    </div>

                    {/* Grid of days */}
                    <div className="grid grid-cols-7 gap-1 text-center font-medium">
                      {days.map((dayItem, index) => {
                        const isSelectedStart = checkIn && dayItem.isSame(checkIn, 'day');
                        const isSelectedEnd = checkOut && dayItem.isSame(checkOut, 'day');
                        const isMiddleRange = checkIn && checkOut && dayItem.isAfter(checkIn) && dayItem.isBefore(checkOut);
                        const isPast = dayItem.isBefore(dayjs(), 'day');
                        const isBooked = isDateBooked(dayItem);
                        const isCurrentMonth = dayItem.isSame(calendarMonth, 'month');

                        let dayStyle = "w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all active:scale-95 mx-auto ";
                        if (isPast) {
                          dayStyle += "text-muted/30 cursor-not-allowed pointer-events-none";
                        } else if (isBooked) {
                          dayStyle += "text-rose-400/50 bg-rose-500/5 line-through cursor-not-allowed pointer-events-none";
                        } else if (!isCurrentMonth) {
                          dayStyle += "text-muted/35 hover:bg-canvas/50 dark:hover:bg-body/10";
                        } else if (isSelectedStart || isSelectedEnd) {
                          dayStyle += "bg-primary text-white font-bold shadow-sm";
                        } else if (isMiddleRange) {
                          dayStyle += "bg-primary/15 text-primary rounded-none";
                        } else {
                          dayStyle += "text-ink/80 dark:text-canvas/80 hover:bg-canvas dark:hover:bg-body/25";
                        }

                        return (
                          <div
                            key={index}
                            onClick={() => {
                              if (isPast || isBooked) return;
                              if (!checkIn || (checkIn && checkOut)) {
                                setCheckIn(dayItem.format('YYYY-MM-DD'));
                                setCheckOut('');
                              } else {
                                if (dayItem.isBefore(dayjs(checkIn))) {
                                  setCheckIn(dayItem.format('YYYY-MM-DD'));
                                } else {
                                  if (hasBookedDateInRange(checkIn, dayItem.format('YYYY-MM-DD'))) {
                                    setCheckIn(dayItem.format('YYYY-MM-DD'));
                                    setCheckOut('');
                                  } else {
                                    setCheckOut(dayItem.format('YYYY-MM-DD'));
                                    setIsCalendarOpen(false);
                                  }
                                }
                              }
                            }}
                            className={dayStyle}
                          >
                            {dayItem.date()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Date conflict Warning Alert */}
              {isDateConflicting && (
                <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl text-[13px] leading-relaxed">
                  <strong>{currentLang === 'ar' ? 'غير متاحة:' : 'Unavailable:'}</strong>{' '}
                  {currentLang === 'ar'
                    ? 'هذه الغرفة محجوزة حالياً في هذه الفترة. يمكنك التحقق من فروعنا الأخرى أو تصفية البحث للغرف المتاحة.'
                    : 'This room is currently reserved for the selected dates. Please try other dates or check our other branches.'}
                </div>
              )}

              {/* Price Breakdown */}
              {duration > 0 && !isDateConflicting && (
                <div className="p-4 bg-canvas/40 dark:bg-body/5 rounded-xl space-y-3 border border-border/40 text-[14px]">
                  <div className="flex items-center justify-between text-body dark:text-canvas/80">
                    <span>${room.pricePerNight} x {t('common.nights', { count: duration })}</span>
                    <span>${totalPrice}</span>
                  </div>
                  <hr className="border-border dark:border-border-strong/10" />
                  <div className="flex items-center justify-between font-bold text-ink dark:text-canvas">
                    <span>{t('bookings.totalPrice')}</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={duration <= 0 || isDateConflicting}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-border/60 text-white font-semibold h-12 rounded-full transition-all duration-300 shadow-md flex items-center justify-center space-x-2 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>{t('common.bookNow')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Full-width Reviews List Section */}
      <section className="mt-20 pt-12 border-t border-border/40 dark:border-border-strong/10">
        <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas flex items-center space-x-2 rtl:space-x-reverse text-left rtl:text-right">
          <MessageSquare className="w-6 h-6 text-primary" />
          <span>{t('rooms.reviews')}</span>
          <span className="text-sm font-medium text-muted bg-canvas dark:bg-body/20 px-2.5 py-0.5 rounded-full">
            {reviews.length}
          </span>
        </h3>

        {/* Rating Summary Widget */}
        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center bg-white dark:bg-ink border border-border/45 dark:border-border-strong/15 rounded-2xl p-6 mb-8 text-left rtl:text-right">
            {/* Score box */}
            <div className="text-center md:border-r rtl:md:border-r-0 rtl:md:border-l border-border/30 dark:border-border-strong/10 py-4">
              <span className="text-5xl font-serif-display font-bold text-primary font-interfaceEn">
                {averageRating}
              </span>
              <span className="text-[14px] text-muted block mt-2 font-medium">
                {t('rooms.averageScore')}
              </span>
              <div className="flex items-center justify-center space-x-0.5 rtl:space-x-reverse text-primary mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(Number(averageRating)) ? 'fill-primary' : 'text-border dark:text-border-strong/20'}`}
                  />
                ))}
              </div>
            </div>

            {/* Stars progress lines */}
            <div className="md:col-span-2 space-y-2 py-2">
              {starCounts.map((count, idx) => {
                const starVal = 5 - idx;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center gap-3.5 text-[13px] font-semibold text-muted font-interfaceEn">
                    <span className="w-3 shrink-0 text-right">{starVal}</span>
                    <Star className="w-3.5 h-3.5 fill-primary text-primary shrink-0" />
                    <div className="flex-grow h-2 bg-canvas dark:bg-body/25 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-left">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Reviews list (spanning 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((rev) => {
                  const initials = rev.userId.substring(0, 2).toUpperCase();
                  return (
                    <div
                      key={rev.id}
                      className="bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.01)] text-left rtl:text-right space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-[14px]">
                            {initials}
                          </div>
                          <div>
                            <span className="text-[14px] font-bold text-ink dark:text-canvas block">
                              {rev.userId}
                            </span>
                            <span className="text-[11px] text-muted block font-medium">
                              {dayjs(rev.createdAt).format('DD MMM, YYYY')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-0.5 rtl:space-x-reverse text-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < rev.rating ? 'fill-primary' : 'text-border dark:text-border-strong/20'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[14px] text-body dark:text-canvas/80 leading-relaxed font-light italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[14px] text-muted italic text-left rtl:text-right">{t('rooms.noReviews')}</p>
            )}
          </div>

          {/* Form container (1 column) */}
          <div className="lg:col-span-1">
            {isAuthenticated ? (
              canReview ? (
                <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-ink border border-primary/25 dark:border-border-strong/15 rounded-2xl p-6 shadow-sm space-y-4 text-left rtl:text-right">
                  <h4 className="font-serif-display text-lg font-semibold text-ink dark:text-canvas flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                    <span>{t('rooms.addReview')}</span>
                  </h4>

                  {/* Rating Select */}
                  <div className="space-y-2">
                    <span className="text-[13px] font-semibold text-ink/75 dark:text-canvas/75 uppercase tracking-wide block">
                      {t('rooms.rating')}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-primary hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                        >
                          <Star className={`w-7 h-7 ${star <= rating ? 'fill-primary' : 'text-border dark:text-border-strong/20'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Textarea */}
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder={t('rooms.reviewPlaceholder')}
                      className="w-full p-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl text-[14px] outline-none transition-all duration-300"
                    />
                  </div>

                  {reviewError && <p className="text-[13px] text-error font-medium">{reviewError}</p>}

                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold px-6 py-2.5 rounded-full transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    {t('rooms.submitReview')}
                  </button>
                </form>
              ) : (
                <div className="bg-canvas/50 dark:bg-body/10 border border-border/40 dark:border-border-strong/10 p-5 rounded-2xl text-center space-y-1.5">
                  <p className="font-semibold text-ink/80 dark:text-canvas/80 text-[14px] mb-0">
                    {reviewRestrictionReason === 'no_booking'
                      ? (currentLang === 'ar' ? 'يجب أن يكون لديك حجز مؤكد لهذه الغرفة لتتمكن من تقييمها.' : 'You must have a confirmed booking for this room to write a review.')
                      : (currentLang === 'ar' ? 'لقد قمت بتقييم هذه الغرفة بالفعل لجميع حجوزاتك.' : 'You have already reviewed this room for all your bookings.')
                    }
                  </p>
                  <p className="text-[13px] text-muted mb-0 font-light">
                    {reviewRestrictionReason === 'no_booking'
                      ? (currentLang === 'ar' ? 'الرجاء حجز الغرفة أولاً لإتمام إقامتك ثم مشاركة رأيك معنا.' : 'Please book this room first, complete your stay, and then share your experience.')
                      : (currentLang === 'ar' ? 'نشكرك على مشاركة آرائك معنا لدعم بقية الضيوف.' : 'Thank you for sharing your feedback with us to support other guests.')
                    }
                  </p>
                </div>
              )
            ) : (
              <div className="bg-canvas/40 dark:bg-body/5 p-6 rounded-2xl border border-dashed border-border/60 text-center">
                <p className="text-[14px] text-muted">
                  {currentLang === 'ar'
                    ? 'الرجاء تسجيل الدخول لتتمكن من كتابة تقييم لهذه الغرفة.'
                    : 'Please login to be able to submit a guest review.'}
                </p>
                <Link to={`/${currentLang}/login`} className="text-primary font-semibold hover:underline mt-2 inline-block">
                  {t('common.login')} &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

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
        isOpen={isImageDialogOpen}
        onClose={() => setIsImageDialogOpen(false)}
      >
        <div className="relative">
          <img
            src={activeImage}
            alt={roomName}
            className="w-full h-auto object-contain rounded-xl max-h-[80vh] mx-auto"
          />
        </div>
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
            const formEl = document.querySelector('form');
            if (formEl) {
              formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold px-6 py-2.5 rounded-full shadow-md cursor-pointer transition-all duration-300 active:scale-95"
        >
          {t('common.bookNow')}
        </button>
      </div>
    </div>
  );
}
