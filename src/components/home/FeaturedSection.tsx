import { Link } from 'react-router-dom';
import RoomCard from '@/components/room/RoomCard';
import { Room, Branch } from '@/types';

interface FeaturedSectionProps {
  featuredRooms: Room[];
  branches: Branch[];
  loading: boolean;
  currentLang: string;
  t: any;
}

export default function FeaturedSection({
  featuredRooms,
  branches,
  loading,
  currentLang,
  t
}: FeaturedSectionProps) {
  return (
    <section className="relative py-16 md:py-20 bg-surface-soft/40 dark:bg-body/5 border-y border-border/20 dark:border-border-strong/10 overflow-hidden">
      {/* Decorative Light Mode Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23000000'/%3E%3C/svg%3E")` }} />
      {/* Decorative Dark Mode Pattern */}
      <div className="absolute inset-0 opacity-0 dark:opacity-[0.06] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%23ffffff'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div className="space-y-3 text-left rtl:text-right">

            <h2 className="font-serif-display text-3xl lg:text-4xl font-semibold text-ink dark:text-canvas">
              {currentLang === 'ar' ? 'غرف وأجنحة مميزة' : 'Featured Suites & Rooms'}
            </h2>
          </div>
          <Link
            to={`/${currentLang}/rooms`}
            className="mt-4 md:mt-0 bg-primary hover:bg-primary-hover text-white text-[14px] font-semibold px-6 py-2.5 rounded-full transition-luxury shadow-sm"
          >
            {currentLang === 'ar' ? 'عرض كافة الغرف' : 'View All Rooms'}
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-ink rounded-2xl p-4 aspect-[4/5] space-y-4" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRooms.map((room) => {
              const branch = branches.find(b => b.id === room.branchId);
              return (
                <RoomCard key={room.id} room={room} branch={branch} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
