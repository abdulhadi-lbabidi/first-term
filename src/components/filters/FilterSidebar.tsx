import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoomFilters } from '@/hooks/useRoomFilters';
import { Branch } from '@/types';
import { Input } from '@/components/ui/Input';
import MultiSelect from '@/components/ui/MultiSelect';
import DualRangeSlider from '@/components/ui/DualRangeSlider';
import SelectWithIcon from '@/components/ui/SelectWithIcon';
import { format, isValid, startOfDay } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/Button';
import { BookingCalendar } from '@/components/bookings/BookingCalendar';
import {
  Search,
  Star,
  Users,
  User,
  CalendarDays,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  MapPin
} from 'lucide-react';

interface FilterSidebarProps {
  branches: Branch[];
}

export default function FilterSidebar({ branches }: FilterSidebarProps) {
  const { t, i18n } = useTranslation();
  const { filters, updateFilters, clearFilters, activeFiltersCount } = useRoomFilters();
  const currentLang = i18n.language || 'en';
  const locale = currentLang === 'ar' ? ar : enUS;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string>('search');
  const [localSearch, setLocalSearch] = useState(filters.q || '');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: filters.check_in ? new Date(filters.check_in) : undefined,
    to: filters.check_out ? new Date(filters.check_out) : undefined,
  });

  useEffect(() => {
    setDateRange({
      from: filters.check_in ? new Date(filters.check_in) : undefined,
      to: filters.check_out ? new Date(filters.check_out) : undefined,
    });
  }, [filters.check_in, filters.check_out]);

  const handleRangeSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    updateFilters({
      ...filters,
      check_in: range?.from && isValid(range.from) ? format(range.from, 'yyyy-MM-dd') : undefined,
      check_out: range?.to && isValid(range.to) ? format(range.to, 'yyyy-MM-dd') : undefined,
    });
  };
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      updateFilters({ q: val || undefined });
      searchTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    if (!searchTimeoutRef.current) setLocalSearch(filters.q || '');
  }, [filters.q]);

  const [localMinPrice, setLocalMinPrice] = useState(filters.min_price || 0);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.max_price || 2000);
  const priceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    if (min !== undefined) setLocalMinPrice(min);
    if (max !== undefined) setLocalMaxPrice(max);

    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    priceTimeoutRef.current = setTimeout(() => {
      updateFilters({
        min_price: min !== undefined && min > 0 ? min : undefined,
        max_price: max !== undefined && max < 2000 ? max : undefined
      });
      priceTimeoutRef.current = null;
    }, 1000);
  };

  useEffect(() => {
    if (!priceTimeoutRef.current) {
      setLocalMinPrice(filters.min_price || 0);
      setLocalMaxPrice(filters.max_price || 2000);
    }
  }, [filters.min_price, filters.max_price]);

  const handleStarsChange = (stars: number) => {
    const newStars = filters.stars === stars ? undefined : stars;
    updateFilters({ ...filters, stars: newStars });
  };

  const handleCapacityChange = (capacity: number) => {
    updateFilters({ ...filters, capacity: capacity || undefined });
  };



  const handleAvailableToggle = (_checked: boolean) => {
    // no-op: availability is now date-driven
  };


  return (
    <div className="bg-white dark:bg-ink border border-border/50 dark:border-border-strong/20 rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-4 font-interfaceEn sticky top-28 text-left rtl:text-right">
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

      <div className="space-y-3">
        {/* 1. Search Query */}
        <FilterSection
          id="search"
          title={t('rooms.searchFilter')}
          icon={<Search className="w-4 h-4 text-primary" />}
          isActive={!!filters.q}
          openSection={openSection}
          setOpenSection={setOpenSection}
        >
          <Input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t('common.search')}
            icon={<Search className="w-4.5 h-4.5 text-muted" />}
          />
        </FilterSection>

        {/* 2. Branches Multi-Select Buttons */}
        <FilterSection
          id="branches"
          title={t('rooms.branchFilter')}
          icon={<MapPin className="w-4 h-4 text-primary" />}
          isActive={!!filters.branch}
          openSection={openSection}
          setOpenSection={setOpenSection}
        >
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
        </FilterSection>

        {/* 3. Price Range Line Slider */}
        <FilterSection
          id="price"
          title={`${t('rooms.priceFilter')} (USD)`}
          isActive={filters.min_price !== undefined || filters.max_price !== undefined}
          openSection={openSection}
          setOpenSection={setOpenSection}
        >
          <DualRangeSlider
            min={0}
            max={2000}
            minVal={localMinPrice}
            maxVal={localMaxPrice}
            onChange={({ min, max }) => handlePriceChange(min, max)}
            currentLang={currentLang}
          />
        </FilterSection>

        {/* 4. Stars Rating */}
        <FilterSection
          id="stars"
          title={t('rooms.starsFilter')}
          icon={<Star className="w-4 h-4 text-primary" />}
          isActive={filters.stars !== undefined}
          openSection={openSection}
          setOpenSection={setOpenSection}
        >
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
        </FilterSection>

        {/* 5. Guests Capacity Filter */}
        <FilterSection
          id="capacity"
          title={t('rooms.capacityFilter')}
          icon={<Users className="w-4 h-4 text-primary" />}
          isActive={!!filters.capacity && filters.capacity > 0}
          openSection={openSection}
          setOpenSection={setOpenSection}
        >
          <div className="flex items-center justify-between bg-canvas dark:bg-body/10 border border-border/60 dark:border-border-strong/20 rounded-md px-3 py-2 mt-1">
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
        </FilterSection>

        {/* 6. Date Range — Check-in / Check-out */}
        <FilterSection
          id="dates"
          title={currentLang === 'ar' ? 'تاريخ الإقامة' : 'Stay Dates'}
          icon={<CalendarDays className="w-4 h-4 text-primary" />}
          isActive={!!filters.check_in || !!filters.check_out}
          openSection={openSection}
          setOpenSection={setOpenSection}
        >
          <div className="overflow-x-auto flex justify-center mt-2 -mx-2">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleRangeSelect}
              locale={locale}
              numberOfMonths={1}
              disabled={(date) => date < startOfDay(new Date())}
            />
          </div>
          {(filters.check_in || filters.check_out) && (
            <p className="text-[11px] text-primary font-medium mt-2">
              {currentLang === 'ar' ? '✓ تصفية حسب التوفر في هذه الفترة' : '✓ Showing available rooms for this period'}
            </p>
          )}
        </FilterSection>
      </div>
    </div>
  );
}

const FilterSection = ({
  id,
  title,
  icon,
  isActive,
  children,
  openSection,
  setOpenSection
}: {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  children: React.ReactNode;
  openSection: string;
  setOpenSection: (id: string) => void;
}) => {
  const isOpen = openSection === id;
  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setOpenSection(isOpen ? '' : id)}
        className="w-full flex items-center justify-between p-4 transition-colors"
      >
        <div className="flex items-center gap-2 relative">
          {icon}
          <span className="text-[12px] font-bold tracking-wider text-ink/80 dark:text-canvas/80 uppercase">
            {title}
          </span>
          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
        </div>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-4 pt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
