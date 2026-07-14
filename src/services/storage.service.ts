import { Branch, Room, User, Booking, Review } from '../types';

const PREFIX = 'vh_v1_';

const KEYS = {
  BRANCHES: `${PREFIX}branches`,
  ROOMS: `${PREFIX}rooms`,
  USERS: `${PREFIX}users`,
  BOOKINGS: `${PREFIX}bookings`,
  REVIEWS: `${PREFIX}reviews`,
  CURRENT_USER: `${PREFIX}current_user`,
  THEME: `${PREFIX}theme`,
  LANGUAGE: `${PREFIX}lang`,
};

// Static Seed Data
const SEED_BRANCHES: Branch[] = [
  {
    id: 'dubai-branch',
    nameAr: 'فرع فيرسيل دبي',
    nameEn: 'Vercel Dubai',
    cityAr: 'دبي',
    cityEn: 'Dubai',
    addressAr: 'شارع الشيخ زايد، دبي، الإمارات العربية المتحدة',
    addressEn: 'Sheikh Zayed Road, Dubai, UAE',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    lat: 25.2048,
    lng: 55.2708,
  },
  {
    id: 'istanbul-branch',
    nameAr: 'فرع فيرسيل إسطنبول',
    nameEn: 'Vercel Istanbul',
    cityAr: 'إسطنبول',
    cityEn: 'Istanbul',
    addressAr: 'منطقة السلطان أحمد، إسطنبول، تركيا',
    addressEn: 'Sultanahmet District, Istanbul, Turkey',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
    lat: 41.0082,
    lng: 28.9784,
  },
  {
    id: 'paris-branch',
    nameAr: 'فرع فيرسيل باريس',
    nameEn: 'Vercel Paris',
    cityAr: 'باريس',
    cityEn: 'Paris',
    addressAr: 'شارع الشانزلزيه، باريس، فرنسا',
    addressEn: 'Champs-Élysées, Paris, France',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    lat: 48.8566,
    lng: 2.3522,
  },
];

const SEED_ROOMS: Room[] = [
  // Dubai Branch Rooms
  {
    id: 'room-dubai-royal',
    branchId: 'dubai-branch',
    roomNumber: '701',
    nameAr: 'الجناح الملكي الفاخر',
    nameEn: 'Royal Luxury Suite',
    pricePerNight: 650,
    size: 120,
    capacity: 3,
    quantity: 5,
    stars: 5,
    descriptionAr: 'جناح ملكي فاخر بإطلالة بانورامية كاملة على أفق دبي والخليج العربي. يحتوي على غرفتي نوم وصالة معيشة واسعة ومسبح خاص داخلي.',
    descriptionEn: 'Luxury Royal suite with full panoramic view over Dubai Skyline and Arabian Gulf. Features two bedrooms, a spacious living area and a private plunge pool.',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507038772120-7bef73638db4?auto=format&fit=crop&w=1200&q=80'
    ],
    services: ['wifi', 'parking', 'food', 'pool', 'gym', 'transfer'],
    isAvailable: true,
  },
  {
    id: 'room-dubai-deluxe',
    branchId: 'dubai-branch',
    roomNumber: '502',
    nameAr: 'غرفة ديلوكس مطلة على البحر',
    nameEn: 'Deluxe Ocean View Room',
    pricePerNight: 350,
    size: 55,
    capacity: 5,
    quantity: 5,
    stars: 5,
    descriptionAr: 'غرفة ديلوكس عصرية وأنيقة ومجهزة بالكامل مع شرفة واسعة تطل مباشرة على الشاطئ والخليج.',
    descriptionEn: 'Modern and elegant deluxe room fully equipped with a large balcony overlooking the beach and gulf directly.',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80'
    ],
    services: ['wifi', 'parking', 'food', 'pool', 'gym'],
    isAvailable: true,
  },
  {
    id: 'room-dubai-executive',
    branchId: 'dubai-branch',
    roomNumber: '603',
    nameAr: 'جناح تنفيذي لرجال الأعمال',
    nameEn: 'Executive Business Suite',
    pricePerNight: 450,
    size: 75,
    capacity: 2,
    quantity: 5,
    stars: 4,
    descriptionAr: 'جناح تنفيذي مجهز بمساحة عمل متكاملة واتصال إنترنت فائق السرعة، مثالي لرجال الأعمال والباحثين عن الراحة والعمل.',
    descriptionEn: 'Executive suite equipped with a full workspace and high-speed internet connection, ideal for business travelers seeking comfort and focus.',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80'
    ],
    services: ['wifi', 'parking', 'food', 'gym'],
    isAvailable: true,
  },

  // Istanbul Branch Rooms
  {
    id: 'room-istanbul-royal',
    branchId: 'istanbul-branch',
    roomNumber: '401',
    nameAr: 'جناح البوسفور الملكي',
    nameEn: 'Royal Bosphorus Suite',
    pricePerNight: 500,
    size: 95,
    capacity: 4,
    quantity: 5,
    stars: 5,
    descriptionAr: 'جناح فسيح وراقٍ بتصميم تركي تقليدي فاخر وإطلالة خلابة مباشرة على مضيق البوسفور وجسر البوسفور الشهير.',
    descriptionEn: 'Spacious and sophisticated suite with traditional luxury Turkish design and breathtaking direct views of the Bosphorus Strait and Bridge.',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    ],
    services: ['wifi', 'parking', 'food', 'pool', 'gym', 'transfer'],
    isAvailable: true,
  },
  {
    id: 'room-istanbul-comfort',
    branchId: 'istanbul-branch',
    roomNumber: '202',
    nameAr: 'غرفة عائلية مريحة',
    nameEn: 'Comfort Family Room',
    pricePerNight: 220,
    size: 45,
    capacity: 2,
    quantity: 5,
    stars: 4,
    descriptionAr: 'غرفة عائلية هادئة ومريحة تحتوي على سرير مزدوج وسرير مفرد مع إطلالة على حديقة الفندق الداخلية.',
    descriptionEn: 'Quiet and comfortable family room featuring a double bed and a single bed with a view of the hotel internal garden.',
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'
    ],
    services: ['wifi', 'parking', 'food'],
    isAvailable: true,
  },

  // Paris Branch Rooms
  {
    id: 'room-paris-royal',
    branchId: 'paris-branch',
    roomNumber: '501',
    nameAr: 'جناح إيفل الفاخر',
    nameEn: 'Eiffel Luxury Suite',
    pricePerNight: 580,
    size: 85,
    capacity: 7,
    quantity: 5,
    stars: 5,
    descriptionAr: 'عش الرومانسية الفرنسية في هذا الجناح الفاخر ذو الإطلالة المباشرة والكاملة على برج إيفل من صالتك وشرفتك الخاصة.',
    descriptionEn: 'Experience French romance in this luxury suite featuring direct and full views of the Eiffel Tower from your private lounge and balcony.',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
    ],
    services: ['wifi', 'parking', 'food', 'pool', 'gym', 'transfer'],
    isAvailable: true,
  },
  {
    id: 'room-paris-classic',
    branchId: 'paris-branch',
    roomNumber: '304',
    nameAr: 'غرفة كلاسيكية باريسية',
    nameEn: 'Classic Parisian Room',
    pricePerNight: 190,
    size: 35,
    capacity: 3,
    quantity: 5,
    stars: 4,
    descriptionAr: 'غرفة كلاسيكية دافئة بتفاصيل فنية ونوافذ فرنسية تقليدية تطل على شوارع باريس الجميلة.',
    descriptionEn: 'Cozy classic room with artistic details and traditional French windows overlooking the beautiful streets of Paris.',
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
    ],
    services: ['wifi', 'food'],
    isAvailable: true,
  },
];

export class StorageService {
  static init(): void {
    const existingBranches = localStorage.getItem(KEYS.BRANCHES);
    if (!existingBranches) {
      localStorage.setItem(KEYS.BRANCHES, JSON.stringify(SEED_BRANCHES));
    } else {
      try {
        const parsed = JSON.parse(existingBranches) as Branch[];
        if (parsed.length > 0 && parsed[0].lat === undefined) {
          localStorage.setItem(KEYS.BRANCHES, JSON.stringify(SEED_BRANCHES));
        }
      } catch (e) {
        localStorage.setItem(KEYS.BRANCHES, JSON.stringify(SEED_BRANCHES));
      }
    }
    if (!localStorage.getItem(KEYS.ROOMS)) {
      localStorage.setItem(KEYS.ROOMS, JSON.stringify(SEED_ROOMS));
    }
    if (!localStorage.getItem(KEYS.USERS)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.BOOKINGS)) {
      localStorage.setItem(KEYS.BOOKINGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.REVIEWS)) {
      localStorage.setItem(KEYS.REVIEWS, JSON.stringify([]));
    }

    // Migrate old data to include quantity
    const rooms = this.getRooms();
    let modified = false;
    const migratedRooms = rooms.map(r => {
      if (!r.quantity) {
        modified = true;
        return { ...r, quantity: 5 };
      }
      return r;
    });
    if (modified) {
      this.set(KEYS.ROOMS, migratedRooms);
    }
  }

  static get<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Generic methods
  static getBranches(): Branch[] {
    return this.get<Branch[]>(KEYS.BRANCHES) || [];
  }

  static getRooms(): Room[] {
    return this.get<Room[]>(KEYS.ROOMS) || [];
  }

  static getUsers(): User[] {
    return this.get<User[]>(KEYS.USERS) || [];
  }

  static getBookings(): Booking[] {
    return this.get<Booking[]>(KEYS.BOOKINGS) || [];
  }

  static getReviews(): Review[] {
    return this.get<Review[]>(KEYS.REVIEWS) || [];
  }

  static setUsers(users: User[]): void {
    this.set(KEYS.USERS, users);
  }

  static setBookings(bookings: Booking[]): void {
    this.set(KEYS.BOOKINGS, bookings);
  }

  static setReviews(reviews: Review[]): void {
    this.set(KEYS.REVIEWS, reviews);
  }

  static getCurrentUser(): User | null {
    return this.get<User>(KEYS.CURRENT_USER);
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      this.set(KEYS.CURRENT_USER, user);
    } else {
      this.remove(KEYS.CURRENT_USER);
    }
  }

  static getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(KEYS.THEME) as 'light' | 'dark') || 'light';
  }

  static setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(KEYS.THEME, theme);
  }

  static getLanguage(): 'ar' | 'en' {
    const lang = localStorage.getItem(KEYS.LANGUAGE);
    if (lang && (lang === 'ar' || lang.startsWith('ar'))) {
      return 'ar';
    }
    return 'en';
  }

  static setLanguage(lang: 'ar' | 'en'): void {
    localStorage.setItem(KEYS.LANGUAGE, lang);
  }
}
