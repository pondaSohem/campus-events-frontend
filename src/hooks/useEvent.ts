import { useEffect, useState } from "react";
import { eventService } from "../services/eventService";
import type { Event } from "../types/Event";

export function useEvent(id: number) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);
    setEvent(null);

    async function loadEvent() {
      try {
        const data = await eventService.get(id);

        if (active) {
          setEvent(data);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load event."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadEvent();

    return () => {
      active = false;
    };
  }, [id]);

  return { event, loading, error };
}
