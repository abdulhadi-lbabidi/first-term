import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ar, enUS } from 'date-fns/locale';
import { addDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/Button';

interface BookingCalendarProps {
  initialCheckIn?: Date;
  initialCheckOut?: Date;
  onConfirm: (start: Date, end: Date) => void;
  onCancel: () => void;
  isDateDisabled: (date: Date) => boolean;
  bookedDates?: { startAt: string; endAt: string }[];
  roomQuantity?: number;
}

export function BookingCalendar({
  initialCheckIn,
  initialCheckOut,
  onConfirm,
  onCancel,
  isDateDisabled,
  bookedDates,
  roomQuantity = 1,
}: BookingCalendarProps) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const locale = currentLang === 'ar' ? ar : enUS;

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: initialCheckIn,
    to: initialCheckOut,
  });

  // Calculate fully booked dates based on room quantity
  const fullyBookedDates: Date[] = [];
  const effectiveQuantity = roomQuantity > 0 ? roomQuantity : 1;
  if (bookedDates && effectiveQuantity > 0) {
    const dateCounts: Record<string, number> = {};
    bookedDates.forEach(b => {
      let current = startOfDay(new Date(b.startAt));
      const end = startOfDay(new Date(b.endAt));
      while (isBefore(current, end)) {
        const dateStr = current.toISOString().split('T')[0];
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        current = addDays(current, 1);
      }
    });

    Object.entries(dateCounts).forEach(([dateStr, count]) => {
      if (count >= effectiveQuantity) {
        fullyBookedDates.push(new Date(dateStr));
      }
    });
  }

  const handleSelect = (range: any, selectedDay: Date) => {
    // Check if the selected day is fully booked
    const isDayFullyBooked = fullyBookedDates.some(
      (d) => d.getTime() === startOfDay(selectedDay).getTime()
    );

    // If starting a new selection on a fully booked day, reject
    if (range?.from && !range?.to && isDayFullyBooked) {
      return;
    }

    if (range?.from && range?.to) {
      // If a range is selected, check if any fully booked date falls within the stay nights
      // Nights are from range.from to range.to - 1 day
      const overlaps = fullyBookedDates.some(fullyBookedDate => {
        return (
          (fullyBookedDate.getTime() >= startOfDay(range.from).getTime()) &&
          (fullyBookedDate.getTime() < startOfDay(range.to).getTime())
        );
      });

      if (overlaps) {
        setDateRange({ from: range.from, to: undefined });
        return;
      }
    }
    if (range) {
      setDateRange(range);
    } else {
      setDateRange({ from: undefined, to: undefined });
    }
  };

  const modifiers = {
    booked: fullyBookedDates,
  };

  const modifiersClassNames = {
    booked: "bg-error/10 text-error line-through rounded-none dark:bg-error/20",
    disabled: "text-muted/60 bg-border/20 dark:bg-border-strong/10 opacity-50 pointer-events-none",
  };

  const handleClear = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const handleConfirm = () => {
    if (dateRange?.from) {
      let end = dateRange.to || addDays(dateRange.from, 1);

      // Prevent same day check-in and check-out
      if (dateRange.to && dateRange.from.toDateString() === dateRange.to.toDateString()) {
        end = addDays(dateRange.from, 1);
      }

      onConfirm(dateRange.from, end);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-ink rounded-xl shadow-xl border border-border flex flex-col font-interfaceEn">
      <div className="overflow-x-auto overflow-y-hidden">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          locale={locale}
          numberOfMonths={window.innerWidth < 640 ? 1 : 2}
          disabled={isDateDisabled}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="w-full flex justify-center"
        />
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
        <Button variant="ghost" onClick={handleClear} className="text-muted hover:text-ink dark:hover:text-canvas">
          {currentLang === 'ar' ? 'مسح التواريخ' : 'Clear dates'}
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} className="hover:bg-canvas/50">
            {currentLang === 'ar' ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!dateRange?.from}
            className="bg-primary hover:bg-primary-hover text-white transition-colors"
          >
            {currentLang === 'ar' ? 'تأكيد' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
