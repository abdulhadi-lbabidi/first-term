import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoomFilters } from '../../hooks/useRoomFilters';
import { Branch } from '../../types';
import { Input } from '../ui/Input';
import MultiSelect from '../ui/MultiSelect';
import DualRangeSlider from '../ui/DualRangeSlider';
import SelectWithIcon from '../ui/SelectWithIcon';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/Button';
import {
  Search,
  Star,
  Users,
  User,
  CalendarDays,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

interface FilterSidebarProps {
  branches: Branch[];
}

export default function FilterSidebar({ branches }: FilterSidebarProps) {
  const { t, i18n } = useTranslation();
  const { filters, updateFilters, clearFilters, activeFiltersCount } = useRoomFilters();
  const currentLang = i18n.language || 'en';
  const [calendarMode, setCalendarMode] = useState<'checkin' | 'checkout'>('checkin');

  const handleSearchChange = (val: string) => {
    updateFilters({ ...filters, q: val || undefined });
  };

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    updateFilters({
      ...filters,
      min_price: min !== undefined && min > 0 ? min : undefined,
      max_price: max !== undefined && max < 2000 ? max : undefined
    });
  };

  const handleStarsChange = (stars: number) => {
    const newStars = filters.stars === stars ? undefined : stars;
    updateFilters({ ...filters, stars: newStars });
  };

  const handleCapacityChange = (capacity: number) => {
    updateFilters({ ...filters, capacity: capacity || undefined });
  };

  const handleDateChange = (field: 'check_in' | 'check_out', val: string) => {
    updateFilters({ ...filters, [field]: val || undefined });
  };

  const handleAvailableToggle = (_checked: boolean) => {
    // no-op: availability is now date-driven
  };

  return (
    <div className="bg-white dark:bg-ink border border-border/50 dark:border-border-strong/20 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-7 font-interfaceEn sticky top-28 text-left rtl:text-right">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40 dark:border-border-strong/15">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4.5 h-4.5 text-primary" />
          <h3 className="font-serif-display text-base font-semibold text-ink dark:text-canvas mb-0">
            {t('rooms.filters')}
          </h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-[12px] font-medium text-muted hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('rooms.clearAll')}</span>
          </button>
        )}
      </div>

      {/* 1. Search Query */}
      <div className="space-y-2">
        <label className="text-[12px] font-bold tracking-wider text-ink/70 dark:text-canvas/70 uppercase block">
          {t('rooms.searchFilter')}
        </label>
        <Input
          type="text"
          value={filters.q || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t('common.search')}
          icon={<Search className="w-4.5 h-4.5 text-muted" />}
        />
      </div>

      {/* 2. Branches Multi-Select Buttons */}
      <div className="space-y-3">
        <label className="text-[12px] font-bold tracking-wider text-ink/70 dark:text-canvas/70 uppercase block">
          {t('rooms.branchFilter')}
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={!filters.branch ? "primary" : "outline"}
            size="sm"
            onClick={() => updateFilters({ ...filters, branch: undefined })}
            className={`rounded-full px-4 h-9 text-[13px] font-medium transition-all border-border/40 dark:border-border-strong/15 ${!filters.branch ? 'bg-primary text-white hover:bg-primary/90' : 'text-muted hover:text-ink dark:hover:text-canvas bg-transparent'}`}
          >
            {currentLang === 'ar' ? 'الكل' : 'All'}
          </Button>
          {branches.map(b => {
            const isSelected = filters.branch ? filters.branch.split(',').includes(b.id) : false;
            return (
              <Button
                key={b.id}
                type="button"
                variant={isSelected ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  let currentBranches = filters.branch ? filters.branch.split(',') : [];
                  if (isSelected) {
                    currentBranches = currentBranches.filter(id => id !== b.id);
                  } else {
                    currentBranches.push(b.id);
                  }
                  updateFilters({ ...filters, branch: currentBranches.length > 0 ? currentBranches.join(',') : undefined });
                }}
                className={`rounded-full px-4 h-9 text-[13px] font-medium transition-all border-border/40 dark:border-border-strong/15 ${isSelected ? 'bg-primary text-white hover:bg-primary/90' : 'text-muted hover:text-ink dark:hover:text-canvas bg-transparent'}`}
              >
                {currentLang === 'ar' ? b.nameAr : b.nameEn}
              </Button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Range Line Slider */}
      <div className="space-y-2">
        <label className="text-[12px] font-bold tracking-wider text-ink/70 dark:text-canvas/70 uppercase block font-interfaceEn">
          {t('rooms.priceFilter')} ({currentLang === 'ar' ? 'درهم' : 'USD'})
        </label>
        <DualRangeSlider
          min={0}
          max={2000}
          minVal={filters.min_price || 0}
          maxVal={filters.max_price || 2000}
          onChange={({ min, max }) => handlePriceChange(min, max)}
          currentLang={currentLang}
        />
      </div>

      {/* 4. Stars Rating Cumulative Color */}
      <div className="space-y-2">
        <label className="text-[12px] font-bold tracking-wider text-ink/70 dark:text-canvas/70 uppercase block">
          {t('rooms.starsFilter')}
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isColored = filters.stars !== undefined && star <= filters.stars;
            return (
              <button
                key={star}
                type="button"
                onClick={() => handleStarsChange(star)}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${isColored
                    ? 'bg-primary border-primary text-white shadow-sm'
                    : 'border-border dark:border-border-strong/20 text-muted hover:border-primary/50'
                  }`}
              >
                <Star className={`w-4.5 h-4.5 ${isColored ? 'fill-white' : ''}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Guests Capacity Filter */}
      <div className="space-y-3 pt-2 border-t border-border/30 dark:border-border-strong/10">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-[12px] font-bold tracking-wider text-ink/70 dark:text-canvas/70 uppercase">
            {t('rooms.capacityFilter')}
          </span>
        </div>
        <div className="flex items-center justify-between bg-canvas dark:bg-body/10 border border-border/60 dark:border-border-strong/20 rounded-md px-3 py-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-ink dark:text-canvas">
              {currentLang === 'ar' ? 'عدد النزلاء' : 'Guests'}
            </span>
            <span className="text-[11px] text-muted">
              {filters.capacity ? (currentLang === 'ar' ? `${filters.capacity} أفراد` : `${filters.capacity} Guests`) : (currentLang === 'ar' ? 'الكل' : 'All')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!filters.capacity || filters.capacity === 0}
              onClick={() => handleCapacityChange((filters.capacity || 1) <= 1 ? 0 : (filters.capacity || 1) - 1)}
              className="h-7 w-7 p-0 rounded-full disabled:opacity-50"
            >
              -
            </Button>
            <span className="font-bold text-[15px] min-w-[20px] text-center text-ink dark:text-canvas">
              {filters.capacity || 0}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={(filters.capacity || 0) >= 6}
              onClick={() => handleCapacityChange((filters.capacity || 0) >= 6 ? 6 : (filters.capacity || 0) + 1)}
              className="h-7 w-7 p-0 rounded-full disabled:opacity-50"
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* 6. Date Range — Check-in / Check-out */}
      <div className="space-y-3 pt-2 border-t border-border/30 dark:border-border-strong/10">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          <span className="text-[12px] font-bold tracking-wider text-ink/70 dark:text-canvas/70 uppercase">
            {currentLang === 'ar' ? 'تاريخ الإقامة' : 'Stay Dates'}
          </span>
        </div>
        <Popover onOpenChange={(open) => { if (!open) setCalendarMode('checkin'); }}>
          <PopoverTrigger render={
            <Button
              variant="outline"
              className="w-full justify-start text-left rtl:text-right font-normal text-[12px] h-10 px-3 bg-canvas dark:bg-body/10 border-border/60 dark:border-border-strong/20 text-ink dark:text-canvas"
            >
              <CalendarDays className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4 text-muted" />
              {filters.check_in ? (
                filters.check_out ? (
                  <>
                    {format(new Date(filters.check_in), "LLL dd, y")} -{" "}
                    {format(new Date(filters.check_out), "LLL dd, y")}
                  </>
                ) : (
                  format(new Date(filters.check_in), "LLL dd, y")
                )
              ) : (
                <span className="text-muted">{currentLang === 'ar' ? 'اختر التاريخ...' : 'Pick a date...'}</span>
              )}
            </Button>
          } />
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <div className="p-3 border-b text-center text-[12px] font-medium">
              {calendarMode === 'checkin' ? (currentLang === 'ar' ? 'تاريخ الوصول' : 'Check-in Date') : (currentLang === 'ar' ? 'تاريخ المغادرة' : 'Check-out Date')}
            </div>
            <Calendar
              mode="single"
              defaultMonth={filters.check_in ? new Date(filters.check_in) : new Date()}
              selected={calendarMode === 'checkin' ? (filters.check_in ? new Date(filters.check_in) : undefined) : (filters.check_out ? new Date(filters.check_out) : undefined)}
              onSelect={(date: Date | undefined) => {
                if (!date) return;

                if (calendarMode === 'checkin') {
                  updateFilters({ ...filters, check_in: format(date, 'yyyy-MM-dd'), check_out: undefined });
                  setCalendarMode('checkout'); // Automatically switch to checkout mode
                } else {
                  updateFilters({ ...filters, check_out: format(date, 'yyyy-MM-dd') });
                }
              }}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
        {(filters.check_in || filters.check_out) && (
          <p className="text-[11px] text-primary font-medium">
            {currentLang === 'ar' ? '✓ تصفية حسب التوفر في هذه الفترة' : '✓ Showing available rooms for this period'}
          </p>
        )}
      </div>
    </div>
  );
}
