import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store';
import { clearCart } from '../store/cartSlice';
import { bookingService, roomService } from '../services';
import { AlertTriangle, CreditCard, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function Checkout() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastBookingId, setLastBookingId] = useState('');

  // Payment Form State
  const [cardHolder, setCardHolder] = useState(user?.fullName || '');
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  // Route protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/${currentLang}/login?redirect=checkout`);
    }
  }, [isAuthenticated, navigate, currentLang]);

  const totalAmount = cartItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || cartItems.length === 0) return;

    setLoading(true);
    try {
      let latestBookingId = '';

      // Complete booking for each cart selection
      for (const item of cartItems) {
        const booking = await bookingService.createBooking(
          user.id,
          item.roomId,
          item.checkIn,
          item.checkOut,
          item.guests
        );
        latestBookingId = booking.id;

        // Simulate immediate payment since user clicked complete payment checkout!
        await bookingService.payBooking(booking.id);
      }

      setLastBookingId(latestBookingId);
      setSuccess(true);
      dispatch(clearCart());
    } catch (err) {
      console.error(err);
      alert('خطأ في حجز الغرفة / Error completing reservation');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 font-interfaceEn my-12 text-center">
        <div className="bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl p-8 shadow-md space-y-6">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="font-serif-display text-3xl font-semibold text-ink dark:text-canvas my-0">
            {t('bookings.successTitle')}
          </h1>
          <p className="text-[14px] text-muted leading-relaxed">
            {t('bookings.successDesc')}
          </p>
          <div className="bg-canvas/50 dark:bg-body/10 p-4 rounded-xl text-left rtl:text-right space-y-2 text-[14px]">
            <p className="text-muted">
              {t('bookings.bookingNumber')}:{' '}
              <span className="font-mono font-semibold text-ink dark:text-canvas">{lastBookingId.slice(0, 8).toUpperCase()}</span>
            </p>
            <p className="text-muted">
              {t('bookings.paymentStatus')}:{' '}
              <span className="font-semibold text-success">{t('bookings.paid')}</span>
            </p>
          </div>
          <div className="pt-2 grid grid-cols-2 gap-4">
            <Link
              to={`/${currentLang}/bookings`}
              className="bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold h-11 rounded-full flex items-center justify-center shadow-sm"
            >
              {t('common.myBookings')}
            </Link>
            <Link
              to={`/${currentLang}/rooms`}
              className="border border-border dark:border-border-strong/30 hover:border-primary text-ink dark:text-canvas text-[14px] font-semibold h-11 rounded-full flex items-center justify-center"
            >
              {t('common.rooms')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 font-interfaceEn">
      <h1 className="font-serif-display text-3xl lg:text-4xl font-semibold text-ink dark:text-canvas mb-8 text-left rtl:text-right mt-6">
        {t('bookings.checkoutTitle')}
      </h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Checkout inputs (70%) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Warning Box */}
            <div className="p-4 bg-error/5 border border-error/20 rounded-2xl flex items-start space-x-3.5 rtl:space-x-reverse text-left rtl:text-right">
              <AlertTriangle className="w-6 h-6 mx-2 text-error shrink-0 mt-0.5" />
              <p className="text-[13px] text-error font-medium leading-relaxed">
                {t('bookings.simulatedWarning')}
              </p>
            </div>

            {/* Payment Details Form */}
            <form onSubmit={handleCheckoutSubmit} className="bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl p-6 shadow-sm text-left rtl:text-right space-y-5">
              <h3 className="font-serif-display text-xl font-semibold text-ink dark:text-canvas flex items-center space-x-2.5 rtl:space-x-reverse pb-3 border-b border-border/40 dark:border-border-strong/10">
                <CreditCard className="w-5 h-5 mx-2 text-primary" />
                <span>{t('bookings.paymentDetails')}</span>
              </h3>

              {/* Card Holder */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-ink/80 dark:text-canvas/80 uppercase block">
                  {t('bookings.cardHolder')}
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full h-11 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-luxury"
                />
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-ink/80 dark:text-canvas/80 uppercase block">
                  {t('bookings.cardNumber')}
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full h-11 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-luxury"
                />
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-ink/80 dark:text-canvas/80 uppercase block">
                    {currentLang === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full h-11 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-luxury"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-semibold text-ink/80 dark:text-canvas/80 uppercase block">
                    {currentLang === 'ar' ? 'رمز التحقق (CVV)' : 'CVV'}
                  </label>
                  <input
                    type="password"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full h-11 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 focus:border-primary rounded-xl text-[14px] outline-none transition-luxury"
                  />
                </div>
              </div>

              {/* Secure disclaimer */}
              <div className="pt-2 flex items-center space-x-2 rtl:space-x-reverse text-muted text-[13px] font-medium">
                <ShieldCheck className="w-4.5 h-4.5 mx-2 text-success" />
                <span>{currentLang === 'ar' ? 'دفع آمن تجريبي - محمي بتقنية SSL' : 'Simulated Secure Payment - SSL Encrypted'}</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold h-12 rounded-full transition-luxury shadow-md flex items-center justify-center space-x-2"
              >
                <span>{loading ? t('common.submitting') : t('bookings.completeCheckout')}</span>
              </button>
            </form>
          </div>

          {/* Checkout Summary panel (30%) */}
          <div className="lg:col-span-4 bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl p-6 shadow-md space-y-6">
            <h3 className="font-serif-display text-xl font-semibold text-ink dark:text-canvas pb-4 border-b border-border/50 dark:border-border-strong/15 text-left rtl:text-right">
              {t('bookings.cartTitle')}
            </h3>

            <div className="space-y-4 text-[14px] text-left rtl:text-right">
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-muted text-xs overflow-hidden">
                    <span>{t('common.nights', { count: item.days })}</span>
                    <span>${item.totalPrice}</span>
                  </div>
                ))}
              </div>
              <hr className="border-border dark:border-border-strong/10" />
              <div className="flex justify-between font-bold text-ink dark:text-canvas text-lg">
                <span>{t('bookings.totalPrice')}</span>
                <span>${totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-8 max-w-md mx-auto animate-fade-in">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 mx-2" />
          </div>
          <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas mb-3">
            {currentLang === 'ar' ? 'سلة الحجز فارغة' : 'No reservations in checkout'}
          </h3>
          <p className="text-[14px] text-muted mb-6">
            {t('bookings.cartEmpty')}
          </p>
          <Link
            to={`/${currentLang}/rooms`}
            className="bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-luxury inline-block animate-pulse"
          >
            {t('common.rooms')}
          </Link>
        </div>
      )}
    </div>
  );
}
