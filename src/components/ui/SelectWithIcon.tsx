import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectWithIconProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  selectedValue: string | number;
  onChange: (value: string | number) => void;
  icon?: React.ReactNode;
  optionIcon?: React.ReactNode;
}

export default function SelectWithIcon({
  label,
  placeholder = 'Select...',
  options,
  selectedValue,
  onChange,
  icon,
  optionIcon,
}: SelectWithIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div ref={containerRef} className="space-y-1.5 w-full text-left rtl:text-right relative font-interfaceEn">
      {label && (
        <label className="text-[12px] font-bold tracking-wide text-ink/70 dark:text-canvas/70 uppercase block">
          {label}
        </label>
      )}

      {/* Select Box Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 hover:border-primary/50 rounded-xl text-[14px] flex items-center justify-between gap-2.5 cursor-pointer transition-all duration-300 select-none font-medium text-ink/80 dark:text-canvas/80"
      >
        <div className="flex items-center gap-2.5 truncate">
          {icon && <div className="text-muted shrink-0">{icon}</div>}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Options Dropdown list */}
      {isOpen && (
        <div className="absolute z-20 w-full mt-1.5 bg-white dark:bg-ink border border-border dark:border-border-strong/20 rounded-xl shadow-xl overflow-hidden animate-fade-in max-h-64 overflow-y-auto py-1">
          {options.map((opt) => {
            const isSelected = opt.value === selectedValue;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 hover:bg-canvas/50 dark:hover:bg-body/30 text-[13px] font-medium cursor-pointer transition-colors ${isSelected ? 'text-primary' : 'text-ink/80 dark:text-canvas/80'
                  }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {optionIcon && <div className="text-muted/65 shrink-0">{optionIcon}</div>}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
