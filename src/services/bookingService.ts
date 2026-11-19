import request from "./api";
import type { Booking, CreateBookingDto } from "../types/Booking";
export const bookingService = {
  mine: () => request<Booking[]>("/bookings/my-bookings"),
  all: () => request<Booking[]>("/bookings"),
  get: (id: number) => request<Booking>(`/bookings/${id}`),
  create: (dto: CreateBookingDto) =>
    request<Booking>("/bookings", { method: "POST", body: dto }),
  cancel: (id: number) =>
    request<void>(`/bookings/${id}/cancel`, { method: "PUT" }),
  updateStatus: (id: number, status: string) =>
    request<void>(`/bookings/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),
};
