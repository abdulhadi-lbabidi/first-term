const fs = require('fs');
const file = 'd:/projects/vercel-hotels/src/pages/RoomDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace imports
content = content.replace(
  "import {\n  Star,\n  Maximize2,\n  Users,\n  Check,\n  Calendar,\n  MessageSquare,\n  Sparkles\n} from 'lucide-react';",
  "import {\n  Star,\n  Maximize2,\n  Users,\n  Check,\n  Calendar as CalendarIcon,\n  MessageSquare,\n  Sparkles\n} from 'lucide-react';\nimport { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';\nimport { Calendar } from '../components/ui/calendar';"
);

// We need to change the usages of Calendar icon to CalendarIcon
content = content.replace(/<Calendar className=/g, '<CalendarIcon className=');

// Replace the calendar form HTML with Shadcn popover
const oldCalendarStart = '{/* Check-In / Check-Out inside one single input picker */}';
const oldCalendarEnd = '{/* Date conflict Warning Alert */}';
const oldCalendarStartIndex = content.indexOf(oldCalendarStart);
const oldCalendarEndIndex = content.indexOf(oldCalendarEnd);

if (oldCalendarStartIndex > -1 && oldCalendarEndIndex > -1) {
  const newCalendarHtml = `
              {/* Check-In / Check-Out using Shadcn */}
              <div className="space-y-2 relative">
                <label className="text-[13px] font-semibold text-ink/75 dark:text-canvas/75 uppercase tracking-wide flex items-center space-x-2 rtl:space-x-reverse select-none">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>{currentLang === 'ar' ? 'تاريخ الحجز (الوصول والمغادرة)' : 'Booking Dates (Check-in / Check-out)'}</span>
                </label>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="w-full h-12 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 hover:border-primary/50 focus-within:border-primary rounded-xl text-[14px] flex items-center justify-between cursor-pointer transition-all duration-300 font-medium select-none text-ink dark:text-canvas">
                      <span>
                        {checkIn && checkOut
                          ? \`\${dayjs(checkIn).format('DD MMM, YYYY')} - \${dayjs(checkOut).format('DD MMM, YYYY')}\`
                          : checkIn
                            ? \`\${dayjs(checkIn).format('DD MMM, YYYY')} - ...\`
                            : (currentLang === 'ar' ? 'اختر التواريخ...' : 'Select dates...')}
                      </span>
                      <CalendarIcon className="w-4.5 h-4.5 text-muted shrink-0" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: checkIn ? dayjs(checkIn).toDate() : undefined,
                        to: checkOut ? dayjs(checkOut).toDate() : undefined
                      }}
                      onSelect={(range) => {
                        if (range?.from) setCheckIn(dayjs(range.from).format('YYYY-MM-DD'));
                        else setCheckIn('');
                        
                        if (range?.to) setCheckOut(dayjs(range.to).format('YYYY-MM-DD'));
                        else setCheckOut('');
                      }}
                      disabled={(date) => {
                         if (dayjs(date).isBefore(dayjs(), 'day')) return true;
                         return isDateBooked(dayjs(date));
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              `;
  content = content.substring(0, oldCalendarStartIndex) + newCalendarHtml + content.substring(oldCalendarEndIndex);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Booking widget updated');
