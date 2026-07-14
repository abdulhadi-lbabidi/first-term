import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Room } from '@/types';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { BookingWidget } from '@/components/bookings/BookingWidget';

interface MobileBookingBarProps {
  room: Room;
  checkIn: string;
  checkOut: string;
  setBookingStep: (step: 1 | 2 | 3) => void;
  setIsBookingDialogOpen: (open: boolean) => void;
  isDateDisabled?: (date: Date) => boolean;
  bookedDates?: { startAt: string; endAt: string }[];
  onBookNow?: (checkIn: string, checkOut: string, guestsCount: number) => void;
}

export function MobileBookingBar({
  room,
  checkIn,
  checkOut,
  setBookingStep,
  setIsBookingDialogOpen,
  isDateDisabled,
  bookedDates,
  onBookNow,
}: MobileBookingBarProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [isWidgetSheetOpen, setIsWidgetSheetOpen] = useState(false);

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-ink/95 backdrop-blur-md border-t border-border/40 dark:border-border-strong/15 px-6 py-4 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div>
        <span className="text-[11px] text-muted block uppercase tracking-wider font-semibold">
          {t('common.priceLabel')}
        </span>
        <div className="flex items-baseline space-x-1 rtl:space-x-reverse">
          <span className="text-xl font-bold text-primary font-interfaceEn">${room.pricePerNight}</span>
          <span className="text-[12px] text-muted">/ {currentLang === 'ar' ? 'الليلة' : 'night'}</span>
        </div>
      </div>
      {checkIn && checkOut ? (
        <button
          type="button"
          onClick={() => {
            setBookingStep(3);
            setIsBookingDialogOpen(true);
          }}
          className="bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold px-6 py-2.5 rounded-full shadow-md cursor-pointer transition-all duration-300 active:scale-95"
        >
          {t('common.bookNow')}
        </button>
      ) : (
        <Sheet open={isWidgetSheetOpen} onOpenChange={setIsWidgetSheetOpen}>
          <SheetTrigger>
            <button
              type="button"
              className="bg-primary hover:bg-primary-hover text-white text-[13px] font-semibold px-6 py-2.5 rounded-full shadow-md cursor-pointer transition-all duration-300 active:scale-95"
            >
              {t('common.bookNow')}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-3xl p-0 bg-canvas dark:bg-ink">
            <SheetHeader className="px-6 pt-6 pb-2">
              <SheetTitle className="font-serif-display text-2xl text-left rtl:text-right">
                {currentLang === 'ar' ? 'تفاصيل الحجز' : 'Booking Details'}
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <BookingWidget
                room={room}
                onBookNow={(inDate, outDate, guests) => {
                  if (onBookNow) onBookNow(inDate, outDate, guests);
                  setIsWidgetSheetOpen(false);
                }}
                isDateDisabled={isDateDisabled || (() => false)}
                bookedDates={bookedDates}
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
