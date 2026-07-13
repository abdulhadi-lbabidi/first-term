import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StorageService, roomService } from '../services';
import { Branch, Room } from '../types';
import LiveMap from '../components/map/LiveMap';
import FilterSidebar from '../components/filters/FilterSidebar';
import { useRoomFilters } from '../hooks/useRoomFilters';
import { MapPin, Navigation, Calendar } from 'lucide-react';

export default function LocationsMap() {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const { t } = useTranslation();
  const { filters, activeFiltersCount } = useRoomFilters();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStaticData = async () => {
      try {
        setBranches(StorageService.getBranches());
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
        // Add 200ms delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 200));
        setFilteredRooms(fetchedRooms);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [filters]);

  const branchAvailability = useMemo(() => {
    // If no filters are applied, don't show availability numbers on map
    if (activeFiltersCount === 0) return null;

    const counts: Record<string, number> = {};
    branches.forEach(b => {
      // Since roomService.getRooms(filters) already handles price, stars, capacity, dates
      counts[b.id] = filteredRooms.filter(r => r.branchId === b.id).length;
    });
    return counts;
  }, [activeFiltersCount, branches, filteredRooms]);

  return (
    <div className="relative min-h-screen py-12 lg:py-20 bg-surface-soft/20 dark:bg-body/5 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23000000'/%3E%3C/svg%3E")` }} />
      <div className="absolute inset-0 opacity-0 dark:opacity-[0.06] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23ffffff'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 font-interfaceEn h-full flex flex-col">
        <div className="text-center mb-10 space-y-4">
          <span className="inline-flex items-center gap-2 text-[12px] font-bold text-primary tracking-widest uppercase bg-primary/10 px-4 py-1.5 rounded-full">
            <Navigation className="w-3.5 h-3.5" />
            {currentLang === 'ar' ? 'اكتشف مواقعنا' : 'Discover Our Locations'}
          </span>
          <h1 className="font-serif-display text-4xl lg:text-5xl font-bold text-ink dark:text-canvas">
            {currentLang === 'ar' ? 'فروعنا حول العالم' : 'Hotels Map'}
          </h1>
          <p className="text-body dark:text-canvas/70 max-w-2xl mx-auto text-[15px] leading-relaxed">
            {currentLang === 'ar'
              ? 'تصفح خريطة فروعنا التفاعلية واكتشف مواقع فنادقنا الاستثنائية حول العالم، واستمتع بتجربة حجز فريدة وسهلة.'
              : 'Browse our interactive map to discover our exceptional hotel locations around the world and enjoy a seamless booking experience.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-[650px]">

          {/* Sidebar - Branches List */}
          <div className="lg:w-[350px] shrink-0 space-y-4 flex flex-col">

            {/* Filter Sidebar */}
            <div className="shrink-0 sticky top-[100px] self-start max-h-[calc(100vh-120px)] overflow-y-auto pr-2 pb-4 w-full">
              <FilterSidebar branches={branches} />
            </div>
          </div>

          {/* Map Area */}
          <div className="flex-1 min-h-[300px] max-h-[500px] relative">
            <LiveMap
              branches={branches}
              currentLang={currentLang}
              selectedBranchId={selectedBranchId}
              branchAvailability={branchAvailability}
              checkIn={filters.check_in}
              checkOut={filters.check_out}
            />
            {loading && (
              <div className="absolute top-0 left-0 right-0 z-[1000] h-1.5 bg-primary/20 rounded-t-[2rem] overflow-hidden pointer-events-none">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: '30%',
                    animation: 'loading-line 1s infinite linear',
                  }}
                />
                <style>{`
                  @keyframes loading-line {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(350%); }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
