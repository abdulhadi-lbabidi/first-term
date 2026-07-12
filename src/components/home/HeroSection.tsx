import { useState, useEffect, useRef } from 'react';
import { MapPin, Users, ChevronDown, User, Search } from 'lucide-react';
import Button from '../ui/Button';
import { Branch } from '../../types';

interface HeroSectionProps {
  branches: Branch[];
  currentLang: string;
  selectedBranch: string;
  setSelectedBranch: (val: string) => void;
  selectedCapacity: number | "";
  setSelectedCapacity: React.Dispatch<React.SetStateAction<number | "">>;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  handleHeroSearch: (e: React.FormEvent) => void;
  t: any;
}

export default function HeroSection({
  branches,
  currentLang,
  selectedBranch,
  setSelectedBranch,
  selectedCapacity,
  setSelectedCapacity,
  searchQuery,
  setSearchQuery,
  handleHeroSearch,
  t
}: HeroSectionProps) {
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isCapacityDropdownOpen, setIsCapacityDropdownOpen] = useState(false);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const capacityDropdownRef = useRef<HTMLDivElement>(null);

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

  return (
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
                <div className="absolute left-0 mt-2.5 w-64 bg-black/85 backdrop-blur-md border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 p-4 text-[13px] text-white select-none animate-fade-in text-left rtl:text-right">
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
                className="bg-transparent text-white text-[14px] w-full outline-none border-none placeholder-white/45 font-medium text-left rtl:text-right"
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
  );
}
