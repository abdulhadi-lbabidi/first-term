import { LocalStorageAuthService } from './impl/LocalStorageAuthService';
import { LocalStorageRoomService } from './impl/LocalStorageRoomService';
import { LocalStorageBookingService } from './impl/LocalStorageBookingService';
import { LocalStorageReviewService } from './impl/LocalStorageReviewService';
import { StorageService } from './storage.service';

// Initialize pre-seeded data in LocalStorage on application start
StorageService.init();

export const authService = new LocalStorageAuthService();
export const roomService = new LocalStorageRoomService();
export const bookingService = new LocalStorageBookingService();
export const reviewService = new LocalStorageReviewService();

export { StorageService };
