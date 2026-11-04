import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";
import type { Event } from "../types/Event";

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
                setError("Unabale to load events.");
            } finally {
                setLoading(false);
            }
        }
        loadEvents();
    }, []);
    return {events, loading, error}
}