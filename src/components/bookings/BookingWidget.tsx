import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { ChevronDown, ChevronUp } from 'lucide-react';
import dayjs from 'dayjs';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/Button';
import { BookingCalendar } from './BookingCalendar';
import { Room } from '../../types';

interface BookingWidgetProps {
  room: Room;
  onBookNow: (checkIn: string, checkOut: string, guestsCount: number) => void;
  isDateDisabled: (date: Date) => boolean;
  bookedDates?: { startAt: string; endAt: string }[];
}

export function BookingWidget({ room, onBookNow, isDateDisabled, bookedDates }: BookingWidgetProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const locale = currentLang === 'ar' ? ar : enUS;

  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [guests, setGuests] = useState(1);
  const [isGuestSelectorOpen, setIsGuestSelectorOpen] = useState(false);

  const nights = checkIn && checkOut ? dayjs(checkOut).diff(dayjs(checkIn), 'day') : 0;
  const totalPrice = nights > 0 ? nights * room.pricePerNight : 0;

  const handleSelectDates = (start: Date, end: Date) => {
    setCheckIn(dayjs(start).format('YYYY-MM-DD'));
    setCheckOut(dayjs(end).format('YYYY-MM-DD'));
    setIsCalendarOpen(false);
  };

  const updateGuests = (increment: boolean) => {
    if (increment && guests < (room.capacity || 4)) setGuests(g => g + 1);
    if (!increment && guests > 1) setGuests(g => g - 1);
  };

  return (
    <div className="border border-border rounded-xl overflow-hidden sticky top-24 bg-white dark:bg-ink shadow-lg font-interfaceEn">
      <div className="p-6">
        <div className="flex items-baseline justify-between mb-6">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold font-serif-display">${room.pricePerNight}</span>
            <span className="text-muted mx-1 text-sm">/ {currentLang === 'ar' ? 'الليلة' : 'night'}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-primary">★</span>
            <span className="font-bold text-ink dark:text-canvas">{room.stars || 5.0}</span>
            <span className="text-muted mx-1">·</span>
            <span className="text-muted underline cursor-pointer">{t('rooms.reviews')}</span>
          </div>
        </div>

        <div className="border border-border rounded-xl overflow-hidden mb-6 bg-canvas/30">
          <div className="grid grid-cols-2 divide-x divide-border rtl:divide-x-reverse">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger>
                <Button
                  variant="ghost"
                  className="h-auto w-full py-3 px-4 justify-between rounded-none hover:bg-canvas/50 text-right rtl:text-right ltr:text-left h-full"
                >
                  <div className="flex flex-col w-full text-start">
                    <div className="text-[10px] font-bold mb-1 uppercase tracking-wider text-ink dark:text-canvas">{currentLang === 'ar' ? 'الوصول' : 'Check-in'}</div>
                    <div className={`text-[13px] ${!checkIn ? "text-muted" : "text-ink dark:text-canvas"}`}>
                      {checkIn ? format(new Date(checkIn), "yyyy/MM/dd", { locale }) : (currentLang === 'ar' ? 'إضافة تاريخ' : 'Add date')}
                    </div>
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-0" align="end" sideOffset={8}>
                <BookingCalendar
                  initialCheckIn={checkIn ? new Date(checkIn) : undefined}
                  initialCheckOut={checkOut ? new Date(checkOut) : undefined}
                  onConfirm={handleSelectDates}
                  onCancel={() => setIsCalendarOpen(false)}
                  isDateDisabled={isDateDisabled}
                  bookedDates={bookedDates}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              onClick={() => setIsCalendarOpen(true)}
              className="h-auto w-full py-3 px-4 justify-between rounded-none hover:bg-canvas/50 text-right rtl:text-right ltr:text-left h-full"
            >
              <div className="flex flex-col w-full text-start">
                <div className="text-[10px] font-bold mb-1 uppercase tracking-wider text-ink dark:text-canvas">{currentLang === 'ar' ? 'المغادرة' : 'Check-out'}</div>
                <div className={`text-[13px] ${!checkOut ? "text-muted" : "text-ink dark:text-canvas"}`}>
                  {checkOut ? format(new Date(checkOut), "yyyy/MM/dd", { locale }) : (currentLang === 'ar' ? 'إضافة تاريخ' : 'Add date')}
                </div>
              </div>
            </Button>
          </div>

          <Popover open={isGuestSelectorOpen} onOpenChange={setIsGuestSelectorOpen}>
            <PopoverTrigger className={"w-full"}>
              <Button
                variant="ghost"
                className="w-full flex flex-row h-auto py-3 px-4 justify-between items-center rounded-none hover:bg-canvas/50 border-t border-border"
              >
                <div className="flex flex-col w-full text-start">
                  <div className="text-[10px] font-bold mb-1 uppercase tracking-wider text-ink dark:text-canvas">{currentLang === 'ar' ? 'الضيوف' : 'Guests'}</div>
                  <div className="text-[13px] text-ink dark:text-canvas">
                    {guests} {currentLang === 'ar' ? 'ضيف' : 'Guest'}
                  </div>
                </div>
                {isGuestSelectorOpen ? <ChevronUp className="w-5 h-5 text-muted" /> : <ChevronDown className="w-5 h-5 text-muted" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-4 rounded-xl" align="center">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[15px]">{currentLang === 'ar' ? 'البالغين' : 'Adults'}</div>
                  <div className="text-[13px] text-muted">{currentLang === 'ar' ? 'العمر 13+' : 'Age 13+'}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="h-9 w-9 rounded-full p-0 flex items-center justify-center border-border" onClick={() => updateGuests(false)} disabled={guests <= 1}>-</Button>
                  <span className="w-4 text-center text-[15px] font-medium">{guests}</span>
                  <Button variant="outline" size="sm" className="h-9 w-9 rounded-full p-0 flex items-center justify-center border-border" onClick={() => updateGuests(true)} disabled={guests >= (room.capacity || 4)}>+</Button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border text-[12px] text-muted">
                {currentLang === 'ar' ? `الحد الأقصى المسموح به هو ${room.capacity || 4} ضيوف.` : `Maximum capacity is ${room.capacity || 4} guests.`}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button
          onClick={() => onBookNow(checkIn, checkOut, guests)}
          disabled={!checkIn || !checkOut}
          className="w-full py-6 text-[16px] bg-primary hover:bg-primary-hover text-white rounded-xl transition-all duration-300 font-bold"
        >
          {currentLang === 'ar' ? 'احجز' : 'Reserve'}
        </Button>

        {!checkIn || !checkOut ? (
          <div className="text-center text-sm text-muted mt-4">
            {currentLang === 'ar' ? 'لن يتم خصم أي مبلغ بعد' : "You won't be charged yet"}
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex justify-between mb-4 text-[15px] text-ink/90 dark:text-canvas/90">
              <span className="underline cursor-pointer decoration-muted underline-offset-4">${room.pricePerNight} × {nights} {currentLang === 'ar' ? 'ليالي' : 'nights'}</span>
              <span>${totalPrice}</span>
            </div>
            <div className="flex justify-between mt-6 pt-5 border-t border-border font-bold text-lg text-ink dark:text-canvas">
              <span>{currentLang === 'ar' ? 'المجموع الإجمالي' : 'Total'}</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
