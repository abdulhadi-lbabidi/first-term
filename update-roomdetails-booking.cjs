const fs = require('fs');
const file = 'd:/projects/vercel-hotels/src/pages/RoomDetails.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update imports
if (!content.includes('hotelSettings')) {
  content = content.replace("import { StorageService } from '../services/storage.service';", "import { StorageService } from '../services/storage.service';\nimport { hotelSettings } from '../config/hotelSettings';");
}

// 2. State & Conflict Logic
const logicOld = `  // Booking States
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Review Permission States
  const [canReview, setCanReview] = useState(false);
  const [reviewRestrictionReason, setReviewRestrictionReason] = useState<'no_booking' | 'already_reviewed' | null>(null);

  // Date Conflict Check State
  const [isDateConflicting, setIsDateConflicting] = useState(false);

  // Reviews View State
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Close calendar popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDateBooked = (dateItem: dayjs.Dayjs) => {
    if (!room) return false;
    const bookingsList = StorageService.getBookings();
    const roomBookings = bookingsList.filter(b => b.roomId === room.id && b.status === 'confirmed');

    return roomBookings.some(b => {
      const start = dayjs(b.checkIn);
      const end = dayjs(b.checkOut);
      return (dateItem.isSame(start, 'day') || dateItem.isAfter(start, 'day')) && dateItem.isBefore(end, 'day');
    });
  };

  const hasBookedDateInRange = (startStr: string, endStr: string) => {
    let current = dayjs(startStr);
    const end = dayjs(endStr);
    while (current.isBefore(end, 'day')) {
      if (isDateBooked(current)) return true;
      current = current.add(1, 'day');
    }
    return false;
  };

  useEffect(() => {
    if (checkIn && checkOut) {
      if (hasBookedDateInRange(checkIn, checkOut)) {
        setIsDateConflicting(true);
      } else {
        setIsDateConflicting(false);
      }
    } else {
      setIsDateConflicting(false);
    }
  }, [checkIn, checkOut]);

  // Calculate pricing
  const nights = checkIn && checkOut ? dayjs(checkOut).diff(dayjs(checkIn), 'day') : 0;`;

const logicNew = `  // Booking States
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  
  // UX State Machine for Calendar
  const [calendarMode, setCalendarMode] = useState<'checkin' | 'checkout'>('checkin');
  
  const [guests, setGuests] = useState<number>(1);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Review Permission States
  const [canReview, setCanReview] = useState(false);
  const [reviewRestrictionReason, setReviewRestrictionReason] = useState<'no_booking' | 'already_reviewed' | null>(null);

  // Date Conflict Check State
  const [isDateConflicting, setIsDateConflicting] = useState(false);

  // Reviews View State
  const [showAllReviews, setShowAllReviews] = useState(false);

  const isDateDisabledForCheckIn = (dateItem: dayjs.Dayjs) => {
    if (!room) return false;
    const bookingsList = StorageService.getBookings();
    const roomBookings = bookingsList.filter(b => b.roomId === room.id && b.status === 'confirmed');

    // For checkin, it's invalid if there is an existing booking covering this day's 14:00
    // Check-out days (12:00) of previous bookings DO NOT block check-in.
    const startCandidate = dateItem.format('YYYY-MM-DD') + 'T' + hotelSettings.checkInTime + ':00';
    
    return roomBookings.some(b => {
      // Conflict: candidate starts before booking ends AND candidate starts after or on booking start? 
      // Actually simply: candidateStart >= b.startAt && candidateStart < b.endAt
      return dayjs(startCandidate).isBefore(dayjs(b.endAt)) && !dayjs(startCandidate).isBefore(dayjs(b.startAt));
    });
  };

  const isDateDisabledForCheckOut = (dateItem: dayjs.Dayjs) => {
    if (!checkIn) return true; // Cannot select checkout without checkin
    if (!room) return false;
    
    const checkInDay = dayjs(checkIn);
    
    // Cannot be before checkIn
    if (dateItem.isBefore(checkInDay, 'day')) return true;
    
    // Cannot be same day unless allowed
    if (!hotelSettings.allowSameDayBooking && dateItem.isSame(checkInDay, 'day')) return true;
    
    // Validate maximum stay
    if (dateItem.diff(checkInDay, 'day') > hotelSettings.maximumStay) return true;

    // Check if there is any conflicting booking in between checkIn and candidate checkOut
    const startCandidate = checkIn + 'T' + hotelSettings.checkInTime + ':00';
    const endCandidate = dateItem.format('YYYY-MM-DD') + 'T' + hotelSettings.checkOutTime + ':00';
    
    const bookingsList = StorageService.getBookings();
    const roomBookings = bookingsList.filter(b => b.roomId === room.id && b.status === 'confirmed');
    
    return roomBookings.some(b => {
      return dayjs(startCandidate).isBefore(dayjs(b.endAt)) && dayjs(endCandidate).isAfter(dayjs(b.startAt));
    });
  };

  const isDateConflicted = (date: Date) => {
    return calendarMode === 'checkin' ? isDateDisabledForCheckIn(dayjs(date)) : isDateDisabledForCheckOut(dayjs(date));
  };

  useEffect(() => {
    setIsDateConflicting(false);
  }, [checkIn, checkOut]);

  // Calculate pricing
  const nights = checkIn && checkOut ? dayjs(checkOut).diff(dayjs(checkIn), 'day') : 0;`;

content = content.replace(logicOld, logicNew);

// 3. Calendar UI updates
const uiOld = `                <Popover>
                  <PopoverTrigger render={<div className="w-full h-12 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 hover:border-primary/50 focus-within:border-primary rounded-xl text-[14px] flex items-center justify-between cursor-pointer transition-all duration-300 font-medium select-none text-ink dark:text-canvas" />}>
                      <span>
                        {checkIn && checkOut
                          ? \`\${dayjs(checkIn).format('DD MMM, YYYY')} - \${dayjs(checkOut).format('DD MMM, YYYY')}\`
                          : checkIn
                            ? \`\${dayjs(checkIn).format('DD MMM, YYYY')} - ...\`
                            : (currentLang === 'ar' ? 'اختر التواريخ...' : 'Select dates...')}
                      </span>
                      <CalendarIcon className="w-4.5 h-4.5 text-muted shrink-0" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{
                        from: checkIn ? dayjs(checkIn).toDate() : undefined,
                        to: checkOut ? dayjs(checkOut).toDate() : undefined
                      }}
                      onSelect={(range: any) => {
                        if (range?.from) setCheckIn(dayjs(range.from).format('YYYY-MM-DD'));
                        else setCheckIn('');
                        
                        if (range?.to) setCheckOut(dayjs(range.to).format('YYYY-MM-DD'));
                        else setCheckOut('');
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || isDateBooked(dayjs(date))}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {isDateConflicting && (
                  <p className="text-[12px] text-error font-medium flex items-center gap-1.5 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{currentLang === 'ar' ? 'التواريخ المحددة تتعارض مع حجوزات سابقة' : 'Selected dates conflict with existing reservations'}</span>
                  </p>
                )}`;

const uiNew = `                <Popover>
                  <PopoverTrigger render={<div className="w-full h-12 px-4 bg-canvas/30 dark:bg-body/10 border border-border dark:border-border-strong/20 hover:border-primary/50 focus-within:border-primary rounded-xl text-[14px] flex items-center justify-between cursor-pointer transition-all duration-300 font-medium select-none text-ink dark:text-canvas" />}>
                      <span>
                        {checkIn && checkOut
                          ? \`\${dayjs(checkIn).format('DD MMM, YYYY')} - \${dayjs(checkOut).format('DD MMM, YYYY')}\`
                          : checkIn
                            ? \`\${dayjs(checkIn).format('DD MMM, YYYY')} - ...\`
                            : (currentLang === 'ar' ? 'اختر التواريخ...' : 'Select dates...')}
                      </span>
                      <CalendarIcon className="w-4.5 h-4.5 text-muted shrink-0" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" onInteractOutside={() => { setCalendarMode('checkin'); }}>
                    <div className="p-3 border-b border-border/40 text-center font-medium text-[14px]">
                      {calendarMode === 'checkin' 
                        ? (currentLang === 'ar' ? 'اختر تاريخ الوصول' : 'Select Check-in Date')
                        : (currentLang === 'ar' ? 'اختر تاريخ المغادرة' : 'Select Check-out Date')}
                    </div>
                    <Calendar
                      mode="single"
                      selected={calendarMode === 'checkin' ? (checkIn ? dayjs(checkIn).toDate() : undefined) : (checkOut ? dayjs(checkOut).toDate() : undefined)}
                      onSelect={(date: Date | undefined) => {
                        if (!date) return;
                        
                        if (calendarMode === 'checkin') {
                          const dateStr = dayjs(date).format('YYYY-MM-DD');
                          setCheckIn(dateStr);
                          setCheckOut(''); // Reset checkout when checkin changes
                          setCalendarMode('checkout'); // Automatically switch to checkout mode
                        } else {
                          setCheckOut(dayjs(date).format('YYYY-MM-DD'));
                        }
                      }}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || isDateConflicted(date)}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                {/* Display Interval Summary */}
                {checkIn && checkOut && nights >= hotelSettings.minimumStay && (
                  <div className="bg-canvas/50 dark:bg-canvas/5 p-3 rounded-xl border border-border/50 text-[13px] flex items-center justify-between">
                    <div>
                      <p className="text-muted mb-0.5">{currentLang === 'ar' ? 'الوصول' : 'Check-in'}</p>
                      <p className="font-semibold text-ink dark:text-canvas">{dayjs(checkIn).format('MMM DD')} <span className="font-mono text-muted mx-1">•</span> {hotelSettings.checkInTime}</p>
                    </div>
                    <div className="text-center px-4 border-x border-border/50">
                      <p className="text-primary font-bold">{nights} {currentLang === 'ar' ? 'ليالي' : 'Nights'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted mb-0.5">{currentLang === 'ar' ? 'المغادرة' : 'Check-out'}</p>
                      <p className="font-semibold text-ink dark:text-canvas">{dayjs(checkOut).format('MMM DD')} <span className="font-mono text-muted mx-1">•</span> {hotelSettings.checkOutTime}</p>
                    </div>
                  </div>
                )}
                
                {isDateConflicting && (
                  <p className="text-[12px] text-error font-medium flex items-center gap-1.5 mt-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{currentLang === 'ar' ? 'التواريخ المحددة تتعارض مع حجوزات سابقة' : 'Selected dates conflict with existing reservations'}</span>
                  </p>
                )}`;

content = content.replace(uiOld, uiNew);
fs.writeFileSync(file, content, 'utf8');
console.log('updated RoomDetails');
EOF
