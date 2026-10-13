import type { Event } from "../types/Events";

const API_URL = "http://localhost:5229/api/events";

export async function getEvents(): Promise<Event[]> {
  const respone = await fetch(API_URL);
  if (!respone.ok) {
    throw new Error(`Failed to fetch events: ${respone.status}`);
  }
  return await respone.json();
}
