import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { roomService } from '../services';
import { Room, Branch } from '../types';
import RoomCard from '../components/room/RoomCard';
import Button from '../components/ui/Button';
import { 
  Wifi, 
  MapPin, 
  Star, 
  Car, 
  Utensils, 
  Waves, 
  Dumbbell, 
  Clock,
  Search,
  Users,
  ChevronDown,
  User
} from 'lucide-react';

export default function Home() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const navigate = useNavigate();

  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero Search States
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState<number | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Hero Search Dropdown States
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isCapacityDropdownOpen, setIsCapacityDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const capacityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (capacityDropdownRef.current && !capacityDropdownRef.current.contains(event.target as Node)) {
        setIsCapacityDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedBranch) params.set('branch', selectedBranch);
    if (selectedCapacity) params.set('capacity', String(selectedCapacity));
    if (searchQuery) params.set('q', searchQuery);
    
    navigate(`/${currentLang}/rooms?${params.toString()}`);
  };

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const fetchedBranches = await roomService.getBranches();
        setBranches(fetchedBranches);

        const featured = await roomService.getFeaturedRooms(3);
        setFeaturedRooms(featured);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const hotelServices = [
    { icon: <Wifi className="w-8 h-8 text-primary" />, name: t('common.services.wifi') },
    { icon: <Car className="w-8 h-8 text-primary" />, name: t('common.services.parking') },
    { icon: <Utensils className="w-8 h-8 text-primary" />, name: t('common.services.food') },
    { icon: <Waves className="w-8 h-8 text-primary" />, name: t('common.services.pool') },
    { icon: <Dumbbell className="w-8 h-8 text-primary" />, name: t('common.services.gym') },
    { icon: <Car className="w-8 h-8 text-primary" />, name: t('common.services.transfer') },
  ];

  return (
    <div className="font-interfaceEn">
      {/* 1. Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden -mt-24">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-black/45 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1920&q=90" 
          alt="Luxury Resort" 
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
          loading="lazy"
        />

        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-5xl px-6 space-y-8 text-white mt-16">
          <div className="space-y-4">
            <span className="font-serif-display text-base lg:text-lg font-medium tracking-[0.18em] text-primary uppercase block">
              {t('common.slogan')}
            </span>
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-white my-0">
              {currentLang === 'ar' ? 'اكتشف رقي الضيافة الفندقية' : 'Experience Timeless Luxury'}
            </h1>
            <p className="text-[14px] sm:text-[16px] lg:text-[18px] text-canvas/90 max-w-2xl mx-auto leading-relaxed font-light">
              {currentLang === 'ar' 
                ? 'مجموعة من الغرف والأجنحة الفاخرة المصممة بعناية فائقة لتمنحك ملاذاً فريداً للراحة والاسترخاء.'
                : 'Premium rooms and suites designed around ultimate comfort, architectural beauty, and exceptional boutique hospitality.'}
            </p>
          </div>

          {/* Floating Search Bar */}
          <form 
            onSubmit={handleHeroSearch}
            className="w-full max-w-4xl mx-auto bg-black/35 backdrop-blur-md border border-white/20 dark:border-border-strong/10 p-4 lg:p-2.5 rounded-2xl lg:rounded-full shadow-2xl flex flex-col lg:flex-row items-center gap-4 lg:gap-2.5 text-left rtl:text-right"
          >
            {/* Branch Selection */}
            <div className="flex items-center gap-2.5 px-4 w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-white/15 dark:border-border-strong/10 pb-3 lg:pb-0" ref={branchDropdownRef}>
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div className="w-full relative">
                <span className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider mb-0.5">
                  {t('rooms.branchFilter')}
                </span>
                <div 
                  onClick={() => {
                    setIsBranchDropdownOpen(!isBranchDropdownOpen);
                    setIsCapacityDropdownOpen(false);
                  }}
                  className="bg-transparent text-white text-[14px] w-full outline-none border-none font-medium cursor-pointer flex items-center justify-between gap-1 select-none"
                >
                  <span>
                    {selectedBranch 
                      ? (branches.find(b => b.id === selectedBranch)?.[currentLang === 'ar' ? 'nameAr' : 'nameEn'] || '')
                      : (currentLang === 'ar' ? 'جميع الفروع' : 'All Branches')}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-300 ${isBranchDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {isBranchDropdownOpen && (
                  <div className="absolute left-0 mt-2.5 w-60 bg-black/85 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 py-1 text-[13px] animate-fade-in select-none">
                    <div 
                      onClick={() => {
                        setSelectedBranch('');
                        setIsBranchDropdownOpen(false);
                      }}
                      className={`px-4 py-2.5 hover:bg-white/10 text-white/90 cursor-pointer transition-colors ${!selectedBranch ? 'text-primary font-bold' : ''}`}
                    >
                      {currentLang === 'ar' ? 'جميع الفروع' : 'All Branches'}
                    </div>
                    {branches.map(b => (
                      <div 
                        key={b.id} 
                        onClick={() => {
                          setSelectedBranch(b.id);
                          setIsBranchDropdownOpen(false);
                        }}
                        className={`px-4 py-2.5 hover:bg-white/10 text-white/90 cursor-pointer transition-colors ${selectedBranch === b.id ? 'text-primary font-bold' : ''}`}
                      >
                        {currentLang === 'ar' ? b.nameAr : b.nameEn}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Guests Capacity */}
            <div className="flex items-center gap-2.5 px-4 w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-white/15 dark:border-border-strong/10 pb-3 lg:pb-0" ref={capacityDropdownRef}>
              <Users className="w-5 h-5 text-primary shrink-0" />
              <div className="w-full relative">
                <span className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider mb-0.5">
                  {t('rooms.capacityFilter')}
                </span>
                <div 
                  onClick={() => {
                    setIsCapacityDropdownOpen(!isCapacityDropdownOpen);
                    setIsBranchDropdownOpen(false);
                  }}
                  className="bg-transparent text-white text-[14px] w-full outline-none border-none font-medium cursor-pointer flex items-center justify-between gap-1 select-none"
                >
                  <span>
                    {selectedCapacity 
                      ? (currentLang === 'ar' ? `${selectedCapacity} أفراد` : `${selectedCapacity} Guests`)
                      : (currentLang === 'ar' ? 'الكل' : 'All')}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-300 ${isCapacityDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
                {isCapacityDropdownOpen && (
                  <div className="absolute left-0 mt-2.5 w-64 bg-black/85 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 p-4 text-[13px] text-white select-none animate-fade-in">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <User className="w-4.5 h-4.5 text-primary shrink-0" />
                        <div className="flex flex-col text-left rtl:text-right">
                          <span className="font-bold text-[13px]">{currentLang === 'ar' ? 'عدد النزلاء' : 'Guests'}</span>
                          <span className="text-[10px] text-white/50">{currentLang === 'ar' ? 'عدد الأفراد' : 'Number of guests'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          disabled={!selectedCapacity || selectedCapacity === 0}
                          onClick={() => setSelectedCapacity(prev => {
                            const val = Number(prev) || 0;
                            return val <= 1 ? '' : val - 1;
                          })}
                          className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold text-base select-none"
                        >
                          -
                        </button>
                        <span className="font-bold text-[15px] min-w-[20px] text-center font-interfaceEn">
                          {selectedCapacity || 0}
                        </span>
                        <button
                          type="button"
                          disabled={Number(selectedCapacity) >= 6}
                          onClick={() => setSelectedCapacity(prev => {
                            const val = Number(prev) || 0;
                            return val >= 6 ? 6 : val + 1;
                          })}
                          className="w-8 h-8 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold text-base select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Search query input */}
            <div className="flex items-center gap-2.5 px-4 w-full lg:w-2/5 pb-2 lg:pb-0">
              <Search className="w-5 h-5 text-primary shrink-0" />
              <div className="w-full">
                <span className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider mb-0.5">
                  {currentLang === 'ar' ? 'البحث السريع' : 'Keyword'}
                </span>
                <input
                  type="text"
                  placeholder={currentLang === 'ar' ? 'ابحث باسم الغرفة...' : 'Search by room...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-[14px] w-full outline-none border-none placeholder-white/45 font-medium"
                />
              </div>
            </div>

            {/* Search Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="px-8 py-3.5 w-full lg:w-auto shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{currentLang === 'ar' ? 'ابحث الآن' : 'Search'}</span>
            </Button>
          </form>
        </div>
      </section>

      {/* 2. Editorial Statement / About Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6 text-left rtl:text-right">
          <span className="text-[13px] font-semibold text-primary tracking-widest uppercase block">
            {t('common.hotelName')}
          </span>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-semibold text-ink dark:text-canvas leading-tight">
            {currentLang === 'ar' 
              ? 'نهتم بأدق التفاصيل لنصنع لك ذكريات لا تُنسى' 
              : 'Where modern architectural beauty meets classic boutique service.'}
          </h2>
          <p className="text-[15px] text-body/90 dark:text-canvas/80 leading-relaxed font-light">
            {currentLang === 'ar'
              ? 'بدأت سلسلة فنادق فيرسيل برؤية واضحة لتقديم مفهوم جديد للضيافة الفاخرة. غرفنا مجهزة بأفضل التقنيات وقطع الأثاث الفنية، مع إطلالات ساحرة على معالم المدن أو الشواطئ الرائعة لتوفير تجربة استثنائية لكل زائر.'
              : 'Every detail at Vercel Hotels is curated to represent luxury and peace. Spanning multiple branches across the world, our rooms integrate high-end comfort with premium local experiences, making your stay exceptionally tailored.'}
          </p>
          <div className="pt-2">
            <Link 
              to={`/${currentLang}/about`}
              className="text-[14px] font-semibold text-primary hover:text-primary-hover border-b border-primary/40 pb-1"
            >
              {t('common.viewDetails')}
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
          <img 
            src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80" 
            alt="Vercel Hotel Room" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 3. Featured Rooms */}
      <section className="py-24 bg-surface-soft/40 dark:bg-body/5 border-y border-border/20 dark:border-border-strong/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div className="space-y-3 text-left rtl:text-right">
              <span className="text-[13px] font-semibold text-primary tracking-widest uppercase block">
                {t('rooms.recommendations')}
              </span>
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

      {/* 4. Hotel Branches */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[13px] font-semibold text-primary tracking-widest uppercase block mb-3">
            {t('common.branches')}
          </span>
          <h2 className="font-serif-display text-3xl lg:text-4xl font-semibold text-ink dark:text-canvas">
            {currentLang === 'ar' ? 'فروعنا الفاخرة حول العالم' : 'Discover Our Boutique Destinations'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {branches.map((branch) => {
            const name = currentLang === 'ar' ? branch.nameAr : branch.nameEn;
            const city = currentLang === 'ar' ? branch.cityAr : branch.cityEn;
            return (
              <Link 
                key={branch.id} 
                to={`/${currentLang}/rooms?branch=${branch.id}`}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md flex flex-col justify-end p-6 text-left rtl:text-right"
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
                <img 
                  src={branch.image} 
                  alt={name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Content */}
                <div className="relative z-20 space-y-2 text-white">
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-primary">
                    <MapPin className="w-4.5 h-4.5" />
                    <span className="text-[13px] font-semibold tracking-wider uppercase">{city}</span>
                  </div>
                  <h3 className="font-serif-display text-2xl font-semibold text-white">
                    {name}
                  </h3>
                  <div className="flex items-center space-x-0.5 text-primary pt-1">
                    {Array.from({ length: branch.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-primary" />
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Services Grid */}
      <section className="py-24 bg-ink text-canvas border-t border-border-strong/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[13px] font-semibold text-primary tracking-widest uppercase block mb-3">
              {currentLang === 'ar' ? 'مزايا استثنائية' : 'Curated Services'}
            </span>
            <h2 className="font-serif-display text-3xl lg:text-4xl font-semibold text-white">
              {currentLang === 'ar' ? 'خدمات مجهزة لراحة تفوق توقعاتك' : 'Absolute Comfort & Exquisite Hospitality'}
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {hotelServices.map((service, i) => (
              <div 
                key={i} 
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-4 hover:border-primary/50 transition-colors duration-300"
              >
                <div className="inline-flex items-center justify-center p-3.5 bg-primary/10 rounded-full mb-2">
                  {service.icon}
                </div>
                <h4 className="text-[14px] font-semibold text-white uppercase tracking-wider">
                  {service.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
