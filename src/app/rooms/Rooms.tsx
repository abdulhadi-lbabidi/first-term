import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { roomService } from '@/services';
import { Room, Branch } from '@/types';
import { useRoomFilters } from '@/hooks/useRoomFilters';
import FilterSidebar from '@/components/filters/FilterSidebar';
import RoomCard from '@/components/room/RoomCard';
import RoomCardSkeleton from '@/components/room/RoomCardSkeleton';
import { SlidersHorizontal, LayoutGrid, Grid, List as ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import SEO from '@/components/SEO';

export default function Rooms() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { filters, clearFilters, activeFiltersCount } = useRoomFilters();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cols, setCols] = useState<'grid-2' | 'grid-3' | 'list'>('grid-3');
  const [showFilters, setShowFilters] = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

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
      // Prevent layout jump when scrolling down by snapping to top of grid
      if (gridRef.current) {
        const top = gridRef.current.getBoundingClientRect().top + window.scrollY - 120;
        if (window.scrollY > top) {
          window.scrollTo({ top, behavior: 'auto' });
        }
      }

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setIsFiltering(true);
      }

      try {
        const fetchedRooms = await roomService.getRooms(filters);
        setRooms(fetchedRooms);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setIsFiltering(false);
        setIsInitialLoad(false);
      }
    };
    loadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-6 font-interfaceEn">
      <SEO title={t('common.rooms')} />
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 mt-6">
        <h1 className="font-serif-display text-4xl lg:text-5xl font-semibold text-ink dark:text-canvas mb-4">
          {t('rooms.title')}
        </h1>
        <p className="text-[16px] text-body/80 dark:text-canvas/70 leading-relaxed">
          {t('rooms.subtitle')}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-4 gap-8" ref={gridRef}>
        {/* Desktop Sidebar Filters */}
        {showFilters && (
          <div className="hidden lg:block lg:col-span-1 sticky top-[100px] self-start max-h-[calc(100vh-120px)] overflow-y-auto pr-2 pb-4">
            <FilterSidebar branches={branches} />
          </div>
        )}

        {/* Mobile Filter Toggle removed from here, moved to grid switcher area */}

        {/* Rooms Grid */}

        {/* Tasks: enable filter */}
        {/* Tasks: use taps */}
        <div className={`min-h-[calc(100vh-200px)] ${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {/* Grid Switcher + count */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              {/* PC Filter Button */}
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex items-center gap-2 rounded-full border-border/40 dark:border-border-strong/15 text-ink dark:text-canvas"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                {currentLang === 'ar' ? (showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر') : (showFilters ? 'Hide Filters' : 'Show Filters')}
                {activeFiltersCount > 0 && (
                  <Badge className="bg-primary text-white text-[11px] font-bold px-1.5 py-0 h-4 flex items-center justify-center min-w-4 rounded-full ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              {/* Spinner placed here as requested */}
              {isFiltering && (
                <div className="flex items-center gap-2 text-primary text-[13px] font-medium animate-fade-in mx-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  {/* <span className="hidden sm:inline-block">{currentLang === 'ar' ? 'جاري التحديث...' : 'Updating...'}</span> */}
                </div>
              )}
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger>
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden flex items-center gap-2 rounded-full border-border/40 dark:border-border-strong/15 text-ink dark:text-canvas"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {t('rooms.filters')}
                    {activeFiltersCount > 0 && (
                      <Badge className="bg-primary text-white text-[11px] font-bold px-1.5 py-0 h-4 flex items-center justify-center min-w-4 rounded-full ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl p-6">
                  <FilterSidebar branches={branches} />
                </SheetContent>
              </Sheet>

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-[13px] lg:hidden font-medium text-primary hover:text-primary hover:underline h-auto p-0 hover:bg-transparent"
                >
                  {t('rooms.clearAll')}
                </Button>
              )}
            </div>
            <div className="bg-canvas dark:bg-body/20 p-1 rounded-full border border-border/40 dark:border-border-strong/10 flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title={currentLang === 'ar' ? 'عرض عمودين' : '2 Columns'}
                onClick={() => setCols('grid-2')}
                className={`hidden md:inline-flex rounded-full transition-all duration-300 ${cols === 'grid-2'
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
                <RoomCardSkeleton key={i} layout={cols === 'list' ? 'list' : 'grid'} />
              ))}
            </div>

            /* Rooms Grid */
          ) : rooms.length > 0 ? (
            <div className="relative">
              <div className={`grid gap-6 min-h-[calc(80vh-200px)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isFiltering ? 'opacity-40 blur-[2px] scale-[0.98] pointer-events-none' : 'opacity-100 blur-0 scale-100'} ${cols === 'list' ? 'grid-cols-1' : cols === 'grid-3' ? (showFilters ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4') : (showFilters ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-2 lg:grid-cols-3')}`}>
                {rooms.map((room) => {
                  const branch = branches.find(b => b.id === room.branchId);
                  return (
                    <RoomCard key={room.id} room={room} branch={branch} layout={cols === "list" ? "list" : "grid"} />
                  );
                })}
              </div>
            </div>

            /* Empty state */
          ) : (
            <div className="relative">
              <div className={`text-center py-20 bg-white dark:bg-ink border border-border/40 dark:border-border-strong/15 rounded-2xl p-8 max-w-md mx-auto transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isFiltering ? 'opacity-40 blur-[2px] scale-[0.98] pointer-events-none' : 'opacity-100 blur-0 scale-100'}`}>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
