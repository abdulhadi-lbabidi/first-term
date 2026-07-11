import { IBookingService } from '../interfaces';
import { Booking } from '../../types';
import { StorageService } from '../storage.service';
import dayjs from 'dayjs';

export class LocalStorageBookingService implements IBookingService {
  async createBooking(userId: string, roomId: string, checkIn: string, checkOut: string): Promise<Booking> {
    const rooms = StorageService.getRooms();
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    
    if (roomIndex === -1) {
      throw new Error('الغرفة غير موجودة / Room not found');
    }

    const room = rooms[roomIndex];
    
    // Check date conflict with existing bookings
    const bookings = StorageService.getBookings();
    const hasConflict = bookings.some(b => 
      b.roomId === roomId && 
      b.status === 'confirmed' && 
      dayjs(checkIn).isBefore(dayjs(b.checkOut)) && 
      dayjs(checkOut).isAfter(dayjs(b.checkIn))
    );
    
    if (hasConflict) {
      throw new Error('الغرفة محجوزة بالفعل خلال هذه الفترة / Room is already reserved for the selected period');
    }

    // Calculate dates
    const start = dayjs(checkIn);
    const end = dayjs(checkOut);
    let days = end.diff(start, 'day');
    
    if (days <= 0) {
      days = 1; // Minimum 1 day booking
    }

    const totalPrice = room.pricePerNight * days;

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      userId,
      roomId,
      checkIn,
      checkOut,
      days,
      totalPrice,
      status: 'confirmed', // Confirmed directly for demo
      paymentStatus: 'unpaid', // Will be paid at checkout
      createdAt: new Date().toISOString(),
    };

    // Save booking
    bookings.push(newBooking);
    StorageService.setBookings(bookings);

    return newBooking;
  }

  async getBookings(userId: string): Promise<Booking[]> {
    const bookings = StorageService.getBookings();
    return bookings.filter(b => b.userId === userId);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const bookings = StorageService.getBookings();
    return bookings.find(b => b.id === id) || null;
  }

  async cancelBooking(bookingId: string): Promise<Booking> {
    const bookings = StorageService.getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      throw new Error('الحجز غير موجود / Booking not found');
    }

    const booking = bookings[bookingIndex];
    booking.status = 'cancelled';
    bookings[bookingIndex] = booking;
    StorageService.setBookings(bookings);

    // Make room available again
    const rooms = StorageService.getRooms();
    const roomIndex = rooms.findIndex(r => r.id === booking.roomId);
    if (roomIndex !== -1) {
      rooms[roomIndex].isAvailable = true;
      StorageService.set('vh_v1_rooms', rooms);
    }

    return booking;
  }

  async payBooking(bookingId: string): Promise<Booking> {
    const bookings = StorageService.getBookings();
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex === -1) {
      throw new Error('الحجز غير موجود / Booking not found');
    }

    const booking = bookings[bookingIndex];
    booking.paymentStatus = 'paid';
    bookings[bookingIndex] = booking;
    StorageService.setBookings(bookings);

    return booking;
  }
}
