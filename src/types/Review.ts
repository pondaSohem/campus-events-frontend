export interface Review {
  id: number;
  eventId: number;
  eventTitle: string;
  userName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}
export interface CreateReviewDto {
  eventId: number;
  rating: number;
  comment: string | null;
}
