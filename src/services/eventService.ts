import request from "./api";
import type { Event } from "../types/Event";
import type { EventDto } from "../types/EventDto";

export const eventService = {
  list: () => request<Event[]>("/events"),

  get: (id: number) =>
    request<Event>(`/events/${id}`),

  create: (dto: EventDto) =>
    request<Event>("/events", {
      method: "POST",
      body: dto,
      requiresAdmin: true,
    }),

  update: (id: number, dto: EventDto) =>
    request<void>(`/events/${id}`, {
      method: "PUT",
      body: dto,
      requiresAdmin: true,
    }),

  remove: (id: number) =>
    request<void>(`/events/${id}`, {
      method: "DELETE",
      requiresAdmin: true,
    }),
};
