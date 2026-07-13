import { IRoomService } from '../interfaces';
import { Branch, Room, RoomFilterOptions } from '../../types';
import { StorageService } from '../storage.service';
import { hotelSettings } from '../../config/hotelSettings';

export class LocalStorageRoomService implements IRoomService {
  async getBranches(): Promise<Branch[]> {
    return StorageService.getBranches();
  }

  async getBranchById(id: string): Promise<Branch | null> {
    const branches = StorageService.getBranches();
    return branches.find(b => b.id === id) || null;
  }

  async getRooms(filters?: RoomFilterOptions): Promise<Room[]> {
    let rooms = StorageService.getRooms();

    if (!filters) {
      return rooms;
    }

    // Filter by branch (supports comma-separated list of branch IDs)
    if (filters.branch) {
      const branchIds = filters.branch.split(',');
      rooms = rooms.filter(r => branchIds.includes(r.branchId));
    }

    // Filter by search query (case-insensitive)
    if (filters.q) {
      const q = filters.q.toLowerCase().trim();
      rooms = rooms.filter(
        r =>
          r.nameAr.toLowerCase().includes(q) ||
          r.nameEn.toLowerCase().includes(q) ||
          r.descriptionAr.toLowerCase().includes(q) ||
          r.descriptionEn.toLowerCase().includes(q) ||
          r.roomNumber.includes(q)
      );
    }

    // Filter by price
    if (filters.min_price !== undefined) {
      rooms = rooms.filter(r => r.pricePerNight >= filters.min_price!);
    }
    if (filters.max_price !== undefined) {
      rooms = rooms.filter(r => r.pricePerNight <= filters.max_price!);
    }

    // Filter by stars
    if (filters.stars !== undefined && filters.stars > 0) {
      rooms = rooms.filter(r => r.stars === filters.stars);
    }

    // Filter by capacity (can accommodate at least the requested capacity)
    if (filters.capacity !== undefined && filters.capacity > 0) {
      rooms = rooms.filter(r => r.capacity >= filters.capacity!);
    }

    // Filter by date availability
    if (filters.check_in) {
      const checkInDate = filters.check_in;
      const checkOutDate = filters.check_out || (() => {
        const d = new Date(filters.check_in);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
      })();

      const startAt = `${checkInDate}T${hotelSettings.checkInTime}:00`;
      const endAt = `${checkOutDate}T${hotelSettings.checkOutTime}:00`;

      const bookings = StorageService.getBookings();
      rooms = rooms.filter(r => {
        const hasConflict = bookings.some(b => {
          if (b.roomId !== r.id || b.status !== 'confirmed') return false;
          
          const bStart = new Date(b.startAt).getTime();
          const bEnd = new Date(b.endAt).getTime();
          const filterStart = new Date(startAt).getTime();
          const filterEnd = new Date(endAt).getTime();
          
          return filterStart < bEnd && filterEnd > bStart;
        });
        return !hasConflict;
      });
    }

    return rooms;
  }

  async getRoomById(id: string): Promise<Room | null> {
    const rooms = StorageService.getRooms();
    return rooms.find(r => r.id === id) || null;
  }

  async getFeaturedRooms(limit: number = 3): Promise<Room[]> {
    const rooms = StorageService.getRooms();
    // Prioritize available, 5-star rooms, then sort by price descending or just slice
    return rooms
      .filter(r => r.isAvailable)
      .sort((a, b) => (b.stars || 0) - (a.stars || 0))
      .slice(0, limit);
  }
}
