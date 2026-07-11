import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  currentLang?: string;
}

export default function MultiSelect({
  label,
  placeholder = 'Select...',
  options,
  selectedValues,
  onChange,
  currentLang = 'en',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (value: string) => {
    const isSelected = selectedValues.includes(value);
    let newValues: string[];
    if (isSelected) {
      newValues = selectedValues.filter((v) => v !== value);
    } else {
      newValues = [...selectedValues, value];
    }
    onChange(newValues);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} className="space-y-1.5 w-full text-left rtl:text-right relative font-interfaceEn">
      {label && (
        <label className="text-[12px] font-bold tracking-wide text-ink/70 dark:text-canvas/70 uppercase block">
          {label}
        </label>
      )}
      
      {/* Selector Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[48px] px-4 py-2 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 hover:border-primary/50 rounded-xl text-[14px] flex items-center justify-between gap-2 cursor-pointer transition-all duration-300"
      >
        <div className="flex flex-wrap gap-1.5 flex-grow">
          {selectedValues.length > 0 ? (
            selectedValues.map((val) => {
              const opt = options.find((o) => o.id === val);
              if (!opt) return null;
              return (
                <span
                  key={val}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleOption(val);
                  }}
                  className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 text-[12px] font-semibold px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors"
                >
                  <span>{opt.name}</span>
                  <X className="w-3 h-3 cursor-pointer shrink-0" />
                </span>
              );
            })
          ) : (
            <span className="text-muted/65 font-medium">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 text-muted">
          {selectedValues.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:text-primary transition-colors focus:outline-none cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-1.5 bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-xl shadow-xl overflow-hidden animate-fade-in max-h-64 flex flex-col">
          {/* Search Input */}
          <div className="p-2 border-b border-border/40 dark:border-border-strong/10 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={currentLang === 'ar' ? 'ابحث هنا...' : 'Search...'}
              className="w-full h-9 pl-8 pr-3 rtl:pl-3 rtl:pr-8 bg-canvas/40 dark:bg-body/20 border border-border dark:border-border-strong/10 rounded-lg text-[13px] outline-none focus:border-primary/60"
            />
            <Search className="w-3.5 h-3.5 text-muted absolute left-4.5 rtl:right-4.5 rtl:left-auto top-1/2 -translate-y-1/2" />
          </div>

          {/* Options List */}
          <div className="overflow-y-auto flex-grow py-1 max-h-48 select-none">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleToggleOption(opt.id)}
                    className="flex items-center justify-between px-4 py-2 hover:bg-canvas/50 dark:hover:bg-body/30 text-[13px] font-medium text-ink/80 dark:text-canvas/80 cursor-pointer transition-colors"
                  >
                    <span>{opt.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                );
              })
            ) : (
              <div className="px-4 py-3 text-[13px] text-muted text-center italic">
                {currentLang === 'ar' ? 'لا توجد نتائج' : 'No options found'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
