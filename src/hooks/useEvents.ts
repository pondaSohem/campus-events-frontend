import { useEffect, useState } from "react";
import { eventService } from "../services/eventService";
import type { Event } from "../types/Event";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    eventService
      .list()
      .then((data) => {
        if (active) setEvents(data);
      })
      .catch((err: unknown) => {
        if (active)
          setError(
            err instanceof Error ? err.message : "Unable to load events.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { events, loading, error };
}
