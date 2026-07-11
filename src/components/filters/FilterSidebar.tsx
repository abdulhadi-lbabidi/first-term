import { useTranslation } from 'react-i18next';
import { useRoomFilters } from '../../hooks/useRoomFilters';
import { Branch } from '../../types';
import Input from '../ui/Input';
import MultiSelect from '../ui/MultiSelect';
import DualRangeSlider from '../ui/DualRangeSlider';
import SelectWithIcon from '../ui/SelectWithIcon';
import { 
  Search, 
  Star, 
  Users, 
  User,
  Calendar, 
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

  const handleAvailableToggle = (checked: boolean) => {
    updateFilters({ ...filters, available: checked ? true : undefined });
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

      {/* 2. Branches Multi-Select Dropdown with Search */}
      <div className="space-y-2">
        <MultiSelect
          label={t('rooms.branchFilter')}
          placeholder={currentLang === 'ar' ? 'اختر الفروع...' : 'Select branches...'}
          options={branches.map(b => ({ id: b.id, name: currentLang === 'ar' ? b.nameAr : b.nameEn }))}
          selectedValues={filters.branch ? filters.branch.split(',') : []}
          onChange={(newValues) => {
            updateFilters({ ...filters, branch: newValues.length > 0 ? newValues.join(',') : undefined });
          }}
          currentLang={currentLang}
        />
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
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isColored 
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

      {/* 5. Guests Capacity Select with Icons */}
      <div className="space-y-2">
        <SelectWithIcon
          label={t('rooms.capacityFilter')}
          placeholder={t('common.all')}
          selectedValue={filters.capacity || ''}
          onChange={(val) => handleCapacityChange(Number(val) || 0)}
          icon={<Users className="w-4.5 h-4.5" />}
          optionIcon={<User className="w-4 h-4 text-primary" />}
          options={[
            { value: '', label: t('common.all') },
            ...[1, 2, 3, 4, 5, 6].map((num) => ({
              value: num,
              label: currentLang === 'ar' ? `${num} أفراد` : `${num} Guests`
            }))
          ]}
        />
      </div>

      {/* 6. Availability Toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-border/30 dark:border-border-strong/10">
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-primary" />
          <span className="text-[14px] font-medium text-ink/80 dark:text-canvas/80">
            {t('rooms.availabilityFilter')}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={!!filters.available}
            onChange={(e) => handleAvailableToggle(e.target.checked)}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-border dark:bg-border-strong/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
        </label>
      </div>
    </div>
  );
}
