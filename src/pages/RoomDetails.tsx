import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roomService, reviewService, authService, bookingService, StorageService } from '../services';
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
  const { id, lang } = useParams<{ id: string, lang: string }>();
  const currentLang = lang || 'en';
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

  // Check date conflict with existing bookings
  useEffect(() => {
    const checkDateConflict = () => {
      if (!id || !checkIn || !checkOut) {
        setIsDateConflicting(false);
        return;
      }
      try {
        const bookingsList = StorageService.getBookings();
        const roomBookings = bookingsList.filter(b => b.roomId === id && b.status === 'confirmed');
        
        const hasOverlap = roomBookings.some(b => {
          const startSelected = dayjs(checkIn);
          const endSelected = dayjs(checkOut);
          const startBooked = dayjs(b.checkIn);
          const endBooked = dayjs(b.checkOut);
          
          return startSelected.isBefore(endBooked) && endSelected.isAfter(startBooked);
        });
        
        setIsDateConflicting(hasOverlap);
      } catch (err) {
        console.error('Error checking date conflicts:', err);
      }
    };
    
    checkDateConflict();
  }, [id, checkIn, checkOut]);

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

  const today = dayjs().format('YYYY-MM-DD');
  const minCheckOut = checkIn ? dayjs(checkIn).add(1, 'day').format('YYYY-MM-DD') : today;

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
          className="text-[14px] font-semibold text-muted hover:text-primary transition-colors flex items-center space-x-2 rtl:space-x-reverse"
        >
          <span>&larr;</span>
          <span>{t('common.back')}</span>
        </Link>
      </div>

      {/* 1. Header & Image Gallery (Full Width at Top) */}
      <div className="space-y-6 mb-12">
        {/* Title Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-left rtl:text-right">
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

        {/* Gallery Grid */}
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
                  className={`relative w-28 aspect-[4/3] rounded-xl overflow-hidden shrink-0 border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Content columns: Details vs Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left Side: Room details (8 columns) */}
        <div className="lg:col-span-8 space-y-10">

          {/* Specs row */}
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

          {/* Description */}
          <div className="space-y-4 text-left rtl:text-right">
            <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas">
              {t('rooms.description')}
            </h3>
            <p className="text-[15px] text-body/90 dark:text-canvas/80 leading-relaxed font-light">
              {description}
            </p>
          </div>

          {/* Amenities Services list */}
          <div className="space-y-5 text-left rtl:text-right">
            <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas">
              {t('rooms.amenities')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {room.services.map((srv) => (
                <div
                  key={srv}
                  className="flex items-center space-x-3 rtl:space-x-reverse p-4 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.01)]"
                >
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

          {/* Reviews Section */}
          <div className="space-y-8 text-left rtl:text-right pt-6 border-t border-border/40 dark:border-border-strong/10">
            <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas flex items-center space-x-2 rtl:space-x-reverse">
              <MessageSquare className="w-6 h-6 text-primary" />
              <span>{t('rooms.reviews')}</span>
              <span className="text-sm font-medium text-muted bg-canvas dark:bg-body/20 px-2.5 py-0.5 rounded-full">
                {reviews.length}
              </span>
            </h3>

            {/* Rating Summary Widget */}
            {reviews.length > 0 && (
              <div className="bg-canvas/40 dark:bg-body/5 border border-border/40 dark:border-border-strong/10 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Score */}
                <div className="md:col-span-4 text-center space-y-1">
                  <div className="text-5xl font-bold text-primary font-serif-display">{averageRating}</div>
                  <div className="flex items-center justify-center text-primary gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(averageRating)) ? 'fill-primary' : 'text-border dark:text-border-strong/20'}`} />
                    ))}
                  </div>
                  <div className="text-[12px] text-muted font-medium">
                    {t('rooms.reviews')}: {totalReviews}
                  </div>
                </div>

                {/* Bars */}
                <div className="md:col-span-8 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars, idx) => {
                    const count = starCounts[idx];
                    const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3 text-[13px] font-medium text-ink/80 dark:text-canvas/80">
                        <span className="w-12 text-right rtl:text-left shrink-0">{stars} {currentLang === 'ar' ? 'نجوم' : 'Stars'}</span>
                        <div className="flex-grow h-2 bg-canvas dark:bg-body/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-8 shrink-0 text-muted">({count})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* List Reviews */}
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((rev) => {
                  const initials = rev.userName
                    ? rev.userName.split(' ').map(n => n.charAt(0)).join('').slice(0, 2).toUpperCase()
                    : 'G';
                  return (
                    <div
                      key={rev.id}
                      className="bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex gap-4 text-left rtl:text-right"
                    >
                      <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary font-bold text-[14px] shrink-0">
                        {initials}
                      </div>

                      <div className="flex-grow space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="text-[14px] font-semibold text-ink dark:text-canvas mb-0">
                            {rev.userName || 'Guest'}
                          </h4>
                          <span className="text-[12px] text-muted">
                            {dayjs(rev.createdAt).format('DD MMM YYYY')}
                          </span>
                        </div>
                        <div className="flex items-center text-primary gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-primary' : 'text-border dark:text-border-strong/20'}`} />
                          ))}
                        </div>
                        <p className="text-[14px] text-body/90 dark:text-canvas/80 leading-relaxed font-light mt-1">
                          {rev.comment}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[14px] text-muted italic">{t('rooms.noReviews')}</p>
            )}

            {/* Write Review Form */}
            {isAuthenticated ? (
              canReview ? (
                <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-ink border border-primary/25 dark:border-border-strong/15 rounded-2xl p-6 shadow-sm space-y-4">
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

        {/* Right Side: Booking panel Sticky Widget (4 columns) */}
        <div className="lg:col-span-4 sticky top-28 bg-white dark:bg-ink border border-border dark:border-border-strong/25 rounded-2xl p-6 shadow-md space-y-6">
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
            {/* Check-In */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-ink/75 dark:text-canvas/75 uppercase tracking-wide flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{t('bookings.checkIn')}</span>
              </label>
              <input
                type="date"
                required
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full h-11 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-all duration-300"
              />
            </div>

            {/* Check-Out */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-ink/75 dark:text-canvas/75 uppercase tracking-wide flex items-center space-x-2 rtl:space-x-reverse">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{t('bookings.checkOut')}</span>
              </label>
              <input
                type="date"
                required
                disabled={!checkIn}
                min={minCheckOut}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full h-11 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-all duration-300 disabled:opacity-50"
              />
            </div>

            {/* Date conflict Warning Alert */}
            {isDateConflicting && (
              <div className="p-3.5 bg-error/5 border border-error/20 rounded-xl text-error text-[13px] font-medium leading-relaxed">
                <p className="font-semibold">{currentLang === 'ar' ? 'غير متاحة في هذه الفترة' : 'Unavailable on these dates'}</p>
                <p className="text-[12px] opacity-90 mt-0.5">
                  {currentLang === 'ar' 
                    ? 'هذه الغرفة محجوزة بالفعل خلال التواريخ المحددة. يرجى اختيار فترة أخرى.' 
                    : 'This room is already reserved for the selected period. Please choose other dates.'}
                </p>
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
