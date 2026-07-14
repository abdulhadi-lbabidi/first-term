import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { reviewService, bookingService } from '@/services';
import { Review, Room } from '@/types';
import { useAppSelector } from '@/store';
import { Star, MessageSquare, Sparkles } from 'lucide-react';

interface RoomReviewsProps {
  room: Room;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>;
}

export function RoomReviews({ room, reviews, setReviews, setRoom }: RoomReviewsProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Analytics Calculations
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  const ratingCounts = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: totalReviews > 0 ? (reviews.filter(r => r.rating === stars).length / totalReviews) * 100 : 0
  }));

  const [canReview, setCanReview] = useState(false);
  const [reviewRestrictionReason, setReviewRestrictionReason] = useState<'no_booking' | 'already_reviewed' | null>(null);

  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!room.id || !isAuthenticated || !user) {
        setCanReview(false);
        setReviewRestrictionReason(null);
        return;
      }
      try {
        const userBookings = await bookingService.getBookings(user.id);
        const roomBookings = userBookings.filter(b => b.roomId === room.id && b.status === 'confirmed');
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
  }, [room.id, reviews, isAuthenticated, user]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || !room) return;
    if (!comment.trim()) {
      setReviewError(currentLang === 'ar' ? 'يرجى كتابة تعليق قبل الإرسال.' : 'Please write a comment before submitting.');
      return;
    }
    try {
      if (editingReviewId) {
        const updatedReview = await reviewService.updateReview(editingReviewId, user.id, rating, comment);
        setReviews(prev => prev.map(r => r.id === editingReviewId ? updatedReview : r));
        setEditingReviewId(null);
      } else {
        const newReview = await reviewService.addReview(user.id, room.id, rating, comment);
        setReviews((prev) => [newReview, ...prev]);
      }
      setComment('');
      setRating(5);
      setReviewError('');
      setShowReviewForm(false);
      // Optional: If you have a room service method to refresh stars
      // const updatedRoom = await roomService.getRoomById(room.id);
      // if (updatedRoom) setRoom(updatedRoom);
    } catch (err: any) {
      setReviewError(err.message || 'فشل إرسال التقييم / Failed to submit review');
    }
  };

  return (
    <section className="pt-8 border-t border-border/40 dark:border-border-strong/10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas flex items-center space-x-2 rtl:space-x-reverse">
          <MessageSquare className="w-6 h-6 text-primary" />
          <span>{t('rooms.reviews')}</span>
          <span className="text-sm font-medium text-muted bg-canvas px-2.5 py-0.5 rounded-full">{reviews.length}</span>
        </h3>

        {isAuthenticated && canReview && !showReviewForm && !editingReviewId && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {t('rooms.addReview')}
          </button>
        )}
      </div>

      {/* Analytics Section */}
      {totalReviews > 0 && (
        <div className="bg-canvas/40 dark:bg-ink/50 border border-border/40 dark:border-border-strong/15 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center justify-center space-y-2 border-b md:border-b-0 md:border-e border-border/40 pb-6 md:pb-0 rtl:border-s rtl:border-e-0">
            <span className="font-serif-display text-5xl font-bold text-ink dark:text-canvas">{averageRating}</span>
            <div className="flex text-primary">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? 'fill-primary' : 'text-border/40'}`} />
              ))}
            </div>
            <span className="text-sm text-muted mt-1">
              {currentLang === 'ar' ? `بناءً على ${totalReviews} تقييم` : `Based on ${totalReviews} reviews`}
            </span>
          </div>

          <div className="md:col-span-2 space-y-3 flex flex-col justify-center">
            {ratingCounts.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 w-8 shrink-0 text-muted justify-end rtl:justify-start">
                  <span className="font-semibold text-ink dark:text-canvas">{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="flex-1 h-2.5 bg-border/40 dark:bg-border-strong/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-muted w-8 shrink-0 text-right rtl:text-left text-[13px]">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {showReviewForm && (
          <div className="bg-white dark:bg-ink border border-primary/25 rounded-2xl p-6 relative shadow-sm">
            <button
              onClick={() => {
                setShowReviewForm(false);
                setEditingReviewId(null);
                setComment('');
                setRating(5);
              }}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto text-muted hover:text-ink text-sm font-medium"
            >
              {currentLang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <h4 className="font-serif-display text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {editingReviewId ? (currentLang === 'ar' ? 'تعديل التقييم' : 'Edit Review') : t('rooms.addReview')}
              </h4>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button type="button" key={star} onClick={() => setRating(star)} className="cursor-pointer">
                    <Star className={`w-7 h-7 ${star <= rating ? 'fill-primary text-primary' : 'text-border'}`} />
                  </button>
                ))}
              </div>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('rooms.reviewPlaceholder')}
                className="w-full p-4 bg-canvas/30 border border-border rounded-xl outline-none"
              />
              {reviewError && <p className="text-[13px] text-error">{reviewError}</p>}
              <button type="submit" className="bg-primary hover:bg-primary-hover transition-colors text-white px-6 py-2.5 rounded-full w-full sm:w-auto min-w-[200px] font-medium shadow-md">
                {editingReviewId ? (currentLang === 'ar' ? 'تحديث' : 'Update') : t('rooms.submitReview')}
              </button>
            </form>
          </div>
        )}

        {!isAuthenticated && (
          <div className="bg-canvas/40 p-6 rounded-2xl text-center border border-dashed border-border mb-8 space-y-3">
            <p className="text-[14px] text-muted leading-relaxed">
              {t('rooms.loginToReview')}
            </p>
            <Link to={`/${currentLang}/login`} className="text-primary font-semibold hover:underline text-[14px]">{t('common.login')}</Link>
          </div>
        )}


        {reviews.length > 0 ? (
          <div className="space-y-4">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((rev) => (
              <div key={rev.id} className="bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[14px] font-bold">{rev.userName}</span>
                    {isAuthenticated && user?.id === rev.userId && (
                      <button
                        onClick={() => {
                          setEditingReviewId(rev.id);
                          setRating(rev.rating);
                          setComment(rev.comment);
                          setShowReviewForm(true);
                        }}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        {currentLang === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                    )}
                  </div>
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
  );
}
