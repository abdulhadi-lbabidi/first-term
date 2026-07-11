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
  checkIn: string; // ISO string
  checkOut: string; // ISO string
  days: number;
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
  q?: string; // Search query
  branch?: string; // Branch ID or slug
  min_price?: number;
  max_price?: number;
  stars?: number;
  capacity?: number;
  available?: boolean;
}
