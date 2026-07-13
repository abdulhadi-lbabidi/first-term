import React from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Room } from '../../types';
import { Dialog, DialogContent } from '../../components/ui/Dialog';

interface RoomBookingDialogProps {
  room: Room;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  isBookingDialogOpen: boolean;
  setIsBookingDialogOpen: (open: boolean) => void;
  bookingStep: number;
  setBookingStep: (step: 1 | 2 | 3) => void;
  handleBookNow: (e: React.FormEvent) => void;
  isDateConflicting: boolean;
}

export function RoomBookingDialog({
  room,
  checkIn,
  checkOut,
  nights,
  totalPrice,
  isBookingDialogOpen,
  setIsBookingDialogOpen,
  bookingStep,
  setBookingStep,
  handleBookNow,
  isDateConflicting,
}: RoomBookingDialogProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
      <DialogContent className="max-w-md bg-white dark:bg-ink p-6 sm:p-8 rounded-3xl border border-border">
        {bookingStep === 3 && (
          <div className="space-y-6">
            <div className="text-center relative">
              <button onClick={() => setBookingStep(1)} className="absolute left-0 top-1 text-muted hover:text-ink">
                &larr; {currentLang === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas mb-1">
                {currentLang === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
              </h3>
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
  );
}
