import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { roomService } from '../services';
import { Room, Branch } from '../types';
import { useRoomFilters } from '../hooks/useRoomFilters';
import FilterSidebar from '../components/filters/FilterSidebar';
import RoomCard from '../components/room/RoomCard';
import { SlidersHorizontal, LayoutGrid, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '../components/ui/sheet';

export default function Rooms() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { filters, clearFilters, activeFiltersCount } = useRoomFilters();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [cols, setCols] = useState<'grid-2' | 'grid-3' | 'list'>('grid-3');
  const [showFilters, setShowFilters] = useState(true);

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
        // window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {showFilters && (
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar branches={branches} />
          </div>
        )}

        {/* Mobile Filter Toggle — Sheet */}
        <div className="lg:hidden flex items-center justify-between bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 p-4 rounded-2xl mb-6">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" className="flex items-center gap-2.5 text-[14px] font-semibold text-ink dark:text-canvas h-auto p-0 hover:bg-transparent" />
              }
            >
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <span>{t('rooms.filters')}</span>
              {activeFiltersCount > 0 && (
                <Badge className="bg-primary text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl p-0">
              <SheetHeader className="px-6 pt-6 pb-0">
                <SheetTitle className="font-serif-display text-lg">
                  {t('rooms.filters')}
                </SheetTitle>
              </SheetHeader>
              <div className="px-6 py-4">
                <FilterSidebar branches={branches} />
              </div>
              <SheetFooter className="px-6 pb-6">
                <SheetClose
                  render={
                    <Button
                      variant="primary"
                      fullWidth
                      className="h-12 rounded-full text-[14px] font-semibold"
                    />
                  }
                >
                  {t('common.confirm')}
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-[13px] font-medium text-primary hover:text-primary hover:underline h-auto p-0 hover:bg-transparent"
            >
              {t('rooms.clearAll')}
            </Button>
          )}
        </div>

        {/* Rooms Grid */}

        {/* Tasks: enable filter */}
        {/* Tasks: use taps */}
        <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {/* Grid Switcher + count */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex items-center gap-2 rounded-full border-border/40 dark:border-border-strong/15 text-ink dark:text-canvas"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {currentLang === 'ar' ? (showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر') : (showFilters ? 'Hide Filters' : 'Show Filters')}
              </Button>
              <span className="text-[13px] text-muted font-semibold uppercase tracking-wider">
                {t('rooms.title')}: {rooms.length} {currentLang === 'ar' ? 'غرف' : 'rooms'}
              </span>
            </div>
            <div className="bg-canvas dark:bg-body/20 p-1 rounded-full border border-border/40 dark:border-border-strong/10 flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={currentLang === 'ar' ? 'عرض عمودين' : '2 Columns'}
                onClick={() => setCols('grid-2')}
                className={`rounded-full transition-all duration-300 ${cols === 'grid-2'
                  ? 'bg-primary text-white shadow-sm hover:bg-primary hover:text-white'
                  : 'text-muted hover:text-ink dark:hover:text-canvas hover:bg-transparent'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={currentLang === 'ar' ? 'عرض 3 أعمدة' : '3 Columns'}
                onClick={() => setCols('grid-3')}
                className={`rounded-full transition-all duration-300 ${cols === 'grid-3'
                  ? 'bg-primary text-white shadow-sm hover:bg-primary hover:text-white'
                  : 'text-muted hover:text-ink dark:hover:text-canvas hover:bg-transparent'
                  }`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={currentLang === 'ar' ? 'عرض قائمة' : 'List View'}
                onClick={() => setCols('list')}
                className={`rounded-full transition-all duration-300 ${cols === 'list'
                  ? 'bg-primary text-white shadow-sm hover:bg-primary hover:text-white'
                  : 'text-muted hover:text-ink dark:hover:text-canvas hover:bg-transparent'
                  }`}
              >
                <ListIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading ? (
            <div className={`grid gap-6 ${cols === 'list' ? 'grid-cols-1' : cols === 'grid-3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 lg:grid-cols-2'}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-4 rounded-2xl overflow-hidden border border-border/20 bg-white dark:bg-ink p-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <Skeleton className="h-6 w-2/3 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <Skeleton className="h-10 w-full rounded-full" />
                </div>
              ))}
            </div>

            /* Rooms Grid */
          ) : rooms.length > 0 ? (
            <div className={`grid gap-6 ${cols === 'list' ? 'grid-cols-1' : cols === 'grid-3' ? (showFilters ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4') : (showFilters ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2 lg:grid-cols-3')}`}>
              {rooms.map((room) => {
                const branch = branches.find(b => b.id === room.branchId);
                return (
                  <RoomCard key={room.id} room={room} branch={branch} layout={cols === "list" ? "list" : "grid"} />
                );
              })}
            </div>

            /* Empty state */
          ) : (
            <div className="text-center py-20 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-8 max-w-md mx-auto">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="font-serif-display text-2xl font-semibold text-ink dark:text-canvas mb-3">
                {t('rooms.emptyStateTitle')}
              </h3>
              <p className="text-[14px] text-muted mb-6 leading-relaxed">
                {t('rooms.emptyStateDesc')}
              </p>
              <Button
                variant="primary"
                onClick={clearFilters}
                className="rounded-full px-6 h-10 text-[14px] font-semibold"
              >
                {t('rooms.clearAll')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
