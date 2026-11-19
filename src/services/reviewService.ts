import request from "./api";
import type { Review, CreateReviewDto } from "../types/Review";
export const reviewService = {
  forEvent: (eventId: number) => request<Review[]>(`/reviews/event/${eventId}`),
  create: (dto: CreateReviewDto) =>
    request<Review>("/reviews", { method: "POST", body: dto }),
  remove: (id: number) => request<void>(`/reviews/${id}`, { method: "DELETE" }),
};
