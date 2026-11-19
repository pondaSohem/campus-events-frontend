import { useEffect, useState } from "react";
import { eventService } from "../services/eventService";
import type { Event } from "../types/Event";

export function useEvent(id: number) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    eventService
      .get(id)
      .then((data) => {
        if (active) setEvent(data);
      })
      .catch((err: unknown) => {
        if (active)
          setError(
            err instanceof Error ? err.message : "Unable to load this event.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return { event, loading, error };
}
