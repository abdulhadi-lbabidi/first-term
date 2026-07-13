import { IReviewService } from '../interfaces';
import { Review } from '../../types';
import { StorageService } from '../storage.service';

export class LocalStorageReviewService implements IReviewService {
  async addReview(userId: string, roomId: string, rating: number, comment: string): Promise<Review> {
    // Validate bookings vs reviews constraint
    const bookings = StorageService.getBookings();
    const userBookings = bookings.filter(b => b.userId === userId && b.roomId === roomId && b.status === 'confirmed');

    const reviews = StorageService.getReviews();
    const userReviews = reviews.filter(r => r.userId === userId && r.roomId === roomId);

    if (userBookings.length === 0) {
      throw new Error('يجب أن يكون لديك حجز مؤكد لهذه الغرفة لتتمكن من تقييمها / You must have a confirmed booking for this room to submit a review');
    }

    if (userReviews.length >= userBookings.length) {
      throw new Error('لقد قمت بتقييم هذه الغرفة بالفعل لكل حجز قمت به / You have already reviewed this room for all your bookings');
    }

    const users = StorageService.getUsers();
    const user = users.find(u => u.id === userId);
    const userName = user ? user.fullName : 'ضيف / Guest';

    const newReview: Review = {
      id: crypto.randomUUID(),
      userId,
      roomId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      userName,
    };

    reviews.push(newReview);
    StorageService.setReviews(reviews);

    // Update the room's stars average
    const rooms = StorageService.getRooms();
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      const roomReviews = reviews.filter(r => r.roomId === roomId);
      const sum = roomReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const average = Math.round((sum / roomReviews.length) * 10) / 10;

      rooms[roomIndex].stars = Math.max(1, Math.min(5, Math.round(average)));
      StorageService.set('vh_v1_rooms', rooms);
    }

    return newReview;
  }

  async updateReview(reviewId: string, userId: string, rating: number, comment: string): Promise<Review> {
    const reviews = StorageService.getReviews();
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);

    if (reviewIndex === -1) {
      throw new Error('التقييم غير موجود / Review not found');
    }

    if (reviews[reviewIndex].userId !== userId) {
      throw new Error('غير مصرح لك بتعديل هذا التقييم / Unauthorized to edit this review');
    }

    reviews[reviewIndex].rating = rating;
    reviews[reviewIndex].comment = comment;

    StorageService.setReviews(reviews);

    // Update the room's stars average
    const roomId = reviews[reviewIndex].roomId;
    const rooms = StorageService.getRooms();
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    if (roomIndex !== -1) {
      const roomReviews = reviews.filter(r => r.roomId === roomId);
      const sum = roomReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const average = Math.round((sum / roomReviews.length) * 10) / 10;

      rooms[roomIndex].stars = Math.max(1, Math.min(5, Math.round(average)));
      StorageService.set('vh_v1_rooms', rooms);
    }

    return reviews[reviewIndex];
  }

  async getReviewsByRoomId(roomId: string): Promise<Review[]> {
    const reviews = StorageService.getReviews();
    const users = StorageService.getUsers();

    return reviews
      .filter(r => r.roomId === roomId)
      .map(r => {
        const user = users.find(u => u.id === r.userId);
        return {
          ...r,
          userName: user ? user.fullName : 'ضيف / Guest',
        };
      });
  }

  async getAverageRating(roomId: string): Promise<number> {
    const reviews = StorageService.getReviews();
    const roomReviews = reviews.filter(r => r.roomId === roomId);
    if (roomReviews.length === 0) return 5; // Default to 5 stars for seeded rooms

    const sum = roomReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / roomReviews.length;
  }
}
