import { IBookingService } from '../interfaces';
import { Booking } from '@/types';
import { StorageService } from '../storage.service';
import dayjs from 'dayjs';
import { hotelSettings } from '@/config/hotelSettings';

export class LocalStorageBookingService implements IBookingService {
  async createBooking(userId: string, roomId: string, checkInDate: string, checkOutDate: string, guests: number): Promise<Booking> {
    const rooms = StorageService.getRooms();
    const roomIndex = rooms.findIndex(r => r.id === roomId);

    if (roomIndex === -1) {
      throw new Error('الغرفة غير موجودة / Room not found');
    }

    const room = rooms[roomIndex];

    // Generate precise timestamps based on hotel settings
    const startAt = dayjs(`${checkInDate}T${hotelSettings.checkInTime}:00`).toISOString();
    const endAt = dayjs(`${checkOutDate}T${hotelSettings.checkOutTime}:00`).toISOString();

    if (dayjs(endAt).isBefore(dayjs(startAt)) || (!hotelSettings.allowSameDayBooking && checkInDate === checkOutDate)) {
      throw new Error('تواريخ غير صالحة / Invalid dates');
    }

    // Check interval conflicts with existing bookings night by night
    const bookings = StorageService.getBookings();
    const overlappingBookings = bookings.filter(b =>
      b.roomId === roomId &&
      b.status === 'confirmed' &&
      dayjs(startAt).isBefore(dayjs(b.endAt)) &&
      dayjs(endAt).isAfter(dayjs(b.startAt))
    );

    let currentDay = dayjs(checkInDate);
    const endDay = dayjs(checkOutDate);
    
    while (currentDay.isBefore(endDay)) {
      const count = overlappingBookings.filter(b => {
        const bIn = dayjs(b.checkInDate);
        const bOut = dayjs(b.checkOutDate);
        return (bIn.isBefore(currentDay, 'day') || bIn.isSame(currentDay, 'day')) && bOut.isAfter(currentDay, 'day');
      }).length;

      if (count >= (room.quantity || 1)) {
        throw new Error('الغرفة محجوزة بالفعل خلال هذه الفترة / Room is already reserved for the selected period');
      }
      currentDay = currentDay.add(1, 'day');
    }

    const start = dayjs(checkInDate);
    const end = dayjs(checkOutDate);
    let nights = end.diff(start, 'day');

    if (nights < hotelSettings.minimumStay) {
      nights = hotelSettings.minimumStay;
    }

    const totalPrice = room.pricePerNight * nights;

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      checkInTime: hotelSettings.checkInTime,
      checkOutTime: hotelSettings.checkOutTime,
      startAt,
      endAt,
      nights,
      guests,
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'unpaid',
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
