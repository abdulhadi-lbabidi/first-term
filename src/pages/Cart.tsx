import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../store';
import { removeFromCart } from '../store/cartSlice';
import { roomService } from '../services';
import { Room, Branch } from '../types';
import { Trash2, Calendar, DollarSign, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import dayjs from 'dayjs';

interface CartItemWithDetails {
  id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  days: number;
  totalPrice: number;
  room: Room;
  branch?: Branch;
}

export default function Cart() {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const [itemsWithDetails, setItemsWithDetails] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const branches = await roomService.getBranches();
        const details = await Promise.all(
          cartItems.map(async (item) => {
            const room = await roomService.getRoomById(item.roomId);
            if (!room) return null;
            const branch = branches.find((b) => b.id === room.branchId);
            return {
              ...item,
              room,
              branch,
            };
          })
        );
        setItemsWithDetails(details.filter((d) => d !== null) as CartItemWithDetails[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [cartItems]);

  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const grandTotal = itemsWithDetails.reduce((acc, curr) => acc + curr.totalPrice, 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        <p className="mt-4 text-muted">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 font-interfaceEn">
      {/* Header */}
      <h1 className="font-serif-display text-3xl lg:text-4xl font-semibold text-ink dark:text-canvas mb-8 text-left rtl:text-right mt-6">
        {t('bookings.cartTitle')}
      </h1>

      {itemsWithDetails.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List (70%) */}
          <div className="lg:col-span-8 space-y-6">
            {itemsWithDetails.map((item) => {
              const roomName = currentLang === 'ar' ? item.room.nameAr : item.room.nameEn;
              const branchName = item.branch 
                ? (currentLang === 'ar' ? item.branch.nameAr : item.branch.nameEn)
                : '';
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-center md:items-start text-left rtl:text-right relative"
                >
                  {/* Room Image */}
                  <div className="w-full md:w-32 aspect-[4/3] rounded-xl overflow-hidden bg-canvas/30 shrink-0">
                    <img 
                      src={item.room.images[0]} 
                      alt={roomName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* Room & Booking details */}
                  <div className="flex-grow space-y-2">
                    <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
                      {branchName}
                    </span>
                    <h3 className="font-serif-display text-lg font-semibold text-ink dark:text-canvas">
                      {roomName}
                    </h3>
                    
                    {/* Dates */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-muted font-medium pt-1">
                      <span className="flex items-center space-x-1.5 rtl:space-x-reverse">
                        <Calendar className="w-4 h-4 text-primary shrink-0" />
                        <span>{dayjs(item.checkIn).format('DD MMM YYYY')} &rarr; {dayjs(item.checkOut).format('DD MMM YYYY')}</span>
                      </span>
                      <span>({t('common.nights', { count: item.days })})</span>
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border/30 gap-4 self-stretch md:self-auto">
                    <div className="text-right rtl:text-left">
                      <span className="text-[12px] text-muted block">{t('bookings.totalPrice')}</span>
                      <span className="font-serif-display text-xl font-bold text-ink dark:text-canvas">${item.totalPrice}</span>
                    </div>
                    
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-muted hover:text-error dark:hover:text-error transition-colors rounded-full hover:bg-error/5"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Panel (30%) */}
          <div className="lg:col-span-4 bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-2xl p-6 shadow-md space-y-6">
            <h3 className="font-serif-display text-xl font-semibold text-ink dark:text-canvas pb-4 border-b border-border/50 dark:border-border-strong/15 text-left rtl:text-right">
              {t('bookings.duration')}
            </h3>

            <div className="space-y-4 text-[14px] text-left rtl:text-right">
              <div className="flex justify-between text-body dark:text-canvas/80 font-medium">
                <span>{currentLang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>${grandTotal}</span>
              </div>
              <hr className="border-border dark:border-border-strong/10" />
              <div className="flex justify-between font-bold text-ink dark:text-canvas text-lg">
                <span>{t('bookings.totalPrice')}</span>
                <span>${grandTotal}</span>
              </div>
            </div>

            <Link
              to={`/${currentLang}/checkout`}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold h-12 rounded-full transition-luxury shadow-md flex items-center justify-center space-x-2"
            >
              <span>{currentLang === 'ar' ? 'المتابعة للدفع الحجز' : 'Proceed to Checkout'}</span>
              {currentLang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </Link>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas mb-3">
            {currentLang === 'ar' ? 'السلة فارغة' : 'Your Selection is Empty'}
          </h3>
          <p className="text-[14px] text-muted mb-6 leading-relaxed">
            {t('bookings.cartEmpty')}
          </p>
          <Link 
            to={`/${currentLang}/rooms`}
            className="bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-luxury inline-block"
          >
            {t('common.rooms')}
          </Link>
        </div>
      )}
    </div>
  );
}
