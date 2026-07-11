import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { roomService } from '../services';
import { Room, Branch } from '../types';
import { useRoomFilters } from '../hooks/useRoomFilters';
import FilterSidebar from '../components/filters/FilterSidebar';
import RoomCard from '../components/room/RoomCard';
import { SlidersHorizontal, X, LayoutGrid, Grid } from 'lucide-react';

export default function Rooms() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { filters, clearFilters, activeFiltersCount } = useRoomFilters();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [cols, setCols] = useState<'grid-2' | 'grid-3'>('grid-3');

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        const fetchedBranches = await roomService.getBranches();
        setBranches(fetchedBranches);
      } catch (err) {
        console.error(err);
      }
    };
    loadStaticData();
  }, []);

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      try {
        const fetchedRooms = await roomService.getRooms(filters);
        setRooms(fetchedRooms);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-6 font-interfaceEn">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 mt-6">
        <h1 className="font-serif-display text-4xl lg:text-5xl font-semibold text-ink dark:text-canvas mb-4">
          {t('rooms.title')}
        </h1>
        <p className="text-[16px] text-body/80 dark:text-canvas/70 leading-relaxed">
          {t('rooms.subtitle')}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar branches={branches} />
        </div>

        {/* Mobile Filter Toggle & Summary */}
        <div className="lg:hidden flex items-center justify-between bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 p-4 rounded-2xl mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center space-x-2.5 rtl:space-x-reverse text-[14px] font-semibold text-ink dark:text-canvas"
          >
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            <span>{t('rooms.filters')}</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
          
          {activeFiltersCount > 0 && (
            <button 
              onClick={clearFilters}
              className="text-[13px] font-medium text-primary hover:underline"
            >
              {t('rooms.clearAll')}
            </button>
          )}
        </div>

        {/* Rooms Grid */}
        <div className="lg:col-span-3">
          {/* Tabs Grid Switcher */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[13px] text-muted font-semibold uppercase tracking-wider">
              {t('rooms.title')}: {rooms.length} {currentLang === 'ar' ? 'غرف' : 'rooms'}
            </span>
            <div className="bg-canvas dark:bg-body/20 p-1 rounded-full border border-border/40 dark:border-border-strong/10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCols('grid-2')}
                title={currentLang === 'ar' ? 'عرض عمودين' : '2 Columns'}
                className={`p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
                  cols === 'grid-2'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-ink dark:hover:text-canvas'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setCols('grid-3')}
                title={currentLang === 'ar' ? 'عرض 3 أعمدة' : '3 Columns'}
                className={`p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
                  cols === 'grid-3'
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted hover:text-ink dark:hover:text-canvas'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white dark:bg-ink border border-border/20 rounded-2xl aspect-[4/5] p-6 space-y-4">
                  <div className="bg-canvas/50 dark:bg-body/10 rounded-xl aspect-[4/3] w-full" />
                  <div className="h-6 bg-canvas/50 dark:bg-body/10 rounded w-2/3" />
                  <div className="h-4 bg-canvas/50 dark:bg-body/10 rounded w-1/2" />
                  <div className="h-10 bg-canvas/50 dark:bg-body/10 rounded-full w-full" />
                </div>
              ))}
            </div>
          ) : rooms.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${cols === 'grid-3' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
              {rooms.map((room) => {
                const branch = branches.find(b => b.id === room.branchId);
                return (
                  <RoomCard key={room.id} room={room} branch={branch} />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-8 max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas mb-3">
                {t('rooms.emptyStateTitle')}
              </h3>
              <p className="text-[14px] text-muted mb-6 leading-relaxed">
                {t('rooms.emptyStateDesc')}
              </p>
              <button 
                onClick={clearFilters}
                className="bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-luxury"
              >
                {t('rooms.clearAll')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer (Bottom Sheet) */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-canvas dark:bg-ink rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative animate-slide-up">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute top-4 right-4 rtl:left-4 rtl:right-auto p-2 bg-white dark:bg-body/10 border border-border/50 dark:border-border-strong/20 rounded-full text-ink dark:text-canvas"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="pt-4">
              <FilterSidebar branches={branches} />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-primary hover:bg-primary-hover text-white font-semibold h-12 rounded-full shadow-md"
            >
              {t('common.confirm')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
