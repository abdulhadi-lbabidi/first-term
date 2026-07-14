export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string; // Hashed password
  phone?: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  addressAr: string;
  addressEn: string;
  stars: number; // 1-5
  image: string;
  lat?: number;
  lng?: number;
}

export interface Room {
  id: string;
  branchId: string;
  roomNumber: string;
  nameAr: string;
  nameEn: string;
  pricePerNight: number;
  size: number; // in square meters
  capacity: number; // number of guests
  quantity: number; // number of available rooms of this type

  stars?: number; // 1-5
  descriptionAr: string;
  descriptionEn: string;
  images: string[];
  services: string[]; // array of service names/slugs like wifi, parking, food, pool, gym
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  checkInTime: string; // e.g., "14:00"
  checkOutTime: string; // e.g., "12:00"
  guests: number;
  startAt: string; // ISO 8601 Timestamp
  endAt: string; // ISO 8601 Timestamp
  nights: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  roomId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  userName?: string; // transient field
}

export interface RoomFilterOptions {
  q?: string;          // Search query
  branch?: string;     // Branch ID (comma-separated)
  min_price?: number;
  max_price?: number;
  stars?: number;
  capacity?: number;
  check_in?: string;   // YYYY-MM-DD — filter availability start
  check_out?: string;  // YYYY-MM-DD — filter availability end
}
