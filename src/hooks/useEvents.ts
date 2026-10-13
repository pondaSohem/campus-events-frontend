import { useEffect, useState } from "react";
import { getEvents } from "../sevices/eventService";
import type { Event } from "../types/Events";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch {
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);
  return { events, loading, error };
}
