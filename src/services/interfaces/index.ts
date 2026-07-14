import { User, Branch, Room, Booking, Review, RoomFilterOptions } from '@/types';

export interface IAuthService {
  register(fullName: string, email: string, password: string, phone?: string): Promise<User>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): User | null;
  updateProfile(userId: string, fullName: string, phone?: string, email?: string, password?: string): Promise<User>;
}

export interface IRoomService {
  getBranches(): Promise<Branch[]>;
  getBranchById(id: string): Promise<Branch | null>;
  getRooms(filters?: RoomFilterOptions): Promise<Room[]>;
  getRoomById(id: string): Promise<Room | null>;
  getFeaturedRooms(limit?: number): Promise<Room[]>;
}

export interface IBookingService {
  createBooking(userId: string, roomId: string, checkIn: string, checkOut: string, guests: number): Promise<Booking>;
  getBookings(userId: string): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | null>;
  cancelBooking(bookingId: string): Promise<Booking>;
  payBooking(bookingId: string): Promise<Booking>;
}

export interface IReviewService {
  addReview(userId: string, roomId: string, rating: number, comment: string): Promise<Review>;
  updateReview(reviewId: string, userId: string, rating: number, comment: string): Promise<Review>;
  getReviewsByRoomId(roomId: string): Promise<Review[]>;
  getAverageRating(roomId: string): Promise<number>;
}
