import { Input as InputPrimitive } from '@base-ui/react/input';
import { MapPin, Users, ChevronDown, User, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Branch } from '@/types';
import { TextLang } from '@/components/ui/TextLang';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
  const tl = (ar: string, en: string) => currentLang === 'ar' ? ar : en;

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden -mt-24">
      {/* Background Gradient Overlay — dark and luxurious for maximum text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#110e09]/90 via-[#110e09]/70 to-[#110e09]/95 z-10" />
      <img
        src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1920&q=80"
        alt="Luxury Resort"
        className="absolute inset-0 w-full h-full object-cover animate-slow-zoom brightness-75"
        loading="lazy"
      />

      {/* Hero Content */}
      <div className="max-w-5xl mt-16 px-6 relative space-y-8 text-center text-white w-full z-20">
        <div className="space-y-4">
          <span className="font-serif-display text-base lg:text-lg font-medium tracking-[0.18em] text-primary uppercase block">
            {t('common.slogan')}
          </span>
          <TextLang
            as="h1"
            ar="اكتشف رقي الضيافة الفندقية"
            en="Experience Timeless Luxury"
            lang={currentLang}
            className="font-serif-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight text-white my-0"
          />
          <TextLang
            as="p"
            ar="مجموعة من الغرف والأجنحة الفاخرة المصممة بعناية فائقة لتمنحك ملاذاً فريداً للراحة والاسترخاء."
            en="Premium rooms and suites designed around ultimate comfort, architectural beauty, and exceptional boutique hospitality."
            lang={currentLang}
            className="text-[14px] sm:text-[16px] lg:text-[18px] text-canvas/90 max-w-2xl mx-auto leading-relaxed font-light"
          />
        </div>

        {/* Floating Search Bar */}
        <form
          onSubmit={handleHeroSearch}
          className="w-full max-w-5xl mx-auto bg-black/35 backdrop-blur-md border border-white/20 dark:border-border-strong/10 p-4 lg:p-2.5 rounded-2xl lg:rounded-full shadow-2xl flex flex-col lg:flex-row items-center gap-4 lg:gap-2.5 text-left rtl:text-right"
        >
          {/* Branch Selection — Popover */}
          <Popover>
            <div className="flex items-center gap-2.5 px-4 w-full lg:w-1/3 border-b lg:border-b-0 lg:border-e border-white/15 dark:border-border-strong/10 pb-3 lg:pb-0">
              <PopoverTrigger
                render={
                  <div className="bg-transparent gap-4 flex flex-row text-white text-[14px] w-full outline-none border-none font-medium cursor-pointer flex items-center justify-between gap-1 select-none" />
                }
              >
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider mb-0.5">
                    {t('rooms.branchFilter')}
                  </span>
                  <span>
                    {selectedBranch
                      ? (branches.find(b => b.id === selectedBranch)?.[tl('nameAr', 'nameEn') as keyof typeof branches[0]] || '')
                      : <TextLang ar="جميع الفروع" en="All Branches" lang={currentLang} />}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/60 transition-transform duration-300 [[data-popup-open]_&]:rotate-180" />
              </PopoverTrigger>
            </div>
            <PopoverContent
              align="start"
              sideOffset={12}
              className="w-60 bg-black/85 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-1 text-[13px]"
            >
              {/* "All Branches" option */}
              <Button
                variant="ghost"
                onClick={() => setSelectedBranch('')}
                className={`w-full justify-start rounded-lg px-4 py-2.5 h-auto font-normal text-white/90 hover:bg-white/10 hover:text-white ${!selectedBranch ? 'text-primary font-bold' : ''}`}
              >
                <TextLang ar="جميع الفروع" en="All Branches" lang={currentLang} />
              </Button>
              {branches.map(b => (
                <Button
                  key={b.id}
                  variant="ghost"
                  onClick={() => setSelectedBranch(b.id)}
                  className={`w-full justify-start rounded-lg px-4 py-2.5 h-auto font-normal text-white/90 hover:bg-white/10 hover:text-white ${selectedBranch === b.id ? 'text-primary font-bold' : ''}`}
                >
                  <TextLang ar={b.nameAr} en={b.nameEn} lang={currentLang} />
                </Button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Guests Capacity — Popover */}
          <Popover>
            <div className="flex items-center gap-2.5 px-4 w-full lg:w-1/4 border-b lg:border-b-0 lg:border-e border-white/15 dark:border-border-strong/10 pb-3 lg:pb-0">
              <PopoverTrigger
                render={
                  <div className="bg-transparent gap-4 text-white text-[14px] w-full outline-none border-none font-medium cursor-pointer flex items-center justify-between gap-1 select-none" />
                }
              >
                <Users className="w-5 h-5 text-primary shrink-0" />
                <div className="w-full">
                  <span className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider mb-0.5">
                    {t('rooms.capacityFilter')}
                  </span>
                  <span>
                    {selectedCapacity
                      ? <TextLang ar={`${selectedCapacity} أفراد`} en={`${selectedCapacity} Guests`} lang={currentLang} />
                      : <TextLang ar="الكل" en="All" lang={currentLang} />}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-white/60 transition-transform duration-300 [[data-popup-open]_&]:rotate-180" />
              </PopoverTrigger>
            </div>
            <PopoverContent
              align="start"
              sideOffset={12}
              className="w-64 bg-black/85 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-4 text-[13px] text-white"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex flex-col text-start">
                    <TextLang ar="عدد النزلاء" en="Guests" lang={currentLang} className="font-bold text-[13px]" />
                    <TextLang ar="عدد الأفراد" en="Number of guests" lang={currentLang} className="text-[10px] text-white/50" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Decrement */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={!selectedCapacity || selectedCapacity === 0}
                    onClick={() => setSelectedCapacity(prev => {
                      const val = Number(prev) || 1;
                      return val <= 1 ? '' : val - 1;
                    })}
                    className="rounded-full border border-white/25 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    -
                  </Button>
                  <span className="font-bold text-[15px] min-w-[20px] text-center font-interfaceEn">
                    {selectedCapacity || 0}
                  </span>
                  {/* Increment */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={Number(selectedCapacity) >= 6}
                    onClick={() => setSelectedCapacity(prev => {
                      const val = Number(prev) || 0;
                      return val >= 6 ? 6 : val + 1;
                    })}
                    className="rounded-full border border-white/25 text-white hover:bg-white/10 hover:text-white disabled:opacity-30"
                  >
                    +
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Search query input */}
          <div className="flex items-center gap-4 px-4 w-full lg:w-2/5 pb-2 lg:pb-0">
            <Search className="w-5 h-5 text-primary shrink-0" />
            <div className="w-full">
              <TextLang
                as="span"
                ar="ابحث"
                en="Search"
                lang={currentLang}
                className="text-[10px] text-white/50 block font-semibold uppercase tracking-wider mb-0.5"
              />
              <InputPrimitive
                type="text"
                placeholder={tl('اسم الجناح أو الخدمة...', 'Suite name, amenity...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white text-[14px] w-full outline-none border-none placeholder:text-white/45 font-medium text-start"
              />
            </div>
          </div>

          {/* Search Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full lg:w-auto shrink-0 rounded-full px-6 gap-2 group"
          >
            <TextLang ar="استكشف الغرف" en="Explore Rooms" lang={currentLang} className="hidden sm:inline" />
            <ArrowRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 ${currentLang === 'ar' ? 'rotate-180' : ''}`} />
          </Button>
        </form>
      </div>
    </section>
  );
}
