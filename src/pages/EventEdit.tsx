import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EventForm from "../components/EventForm";
import { useEvent } from "../hooks/useEvent";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";

function toLocalDateTimeInput(value: string): string {
  const date = new Date(value);

  const pad = (number: number) =>
    String(number).padStart(2, "0");

  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    "T",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
  ].join("");
}

export default function EventEdit() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();

  const validId = Number.isInteger(eventId) && eventId > 0;
  const { event, loading, error } = useEvent(eventId);

  const defaultValues = useMemo(() => {
    if (!event) return undefined;

    return {
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl ?? "",
      location: event.location,
      startDate: toLocalDateTimeInput(event.startDate),
      endDate: toLocalDateTimeInput(event.endDate),
      price: event.price,
      capacity: event.capacity,
      categoryId: event.categoryId,
    };
  }, [event]);

  if (!validId) {
    return <div className="alert alert-danger">Invalid event ID.</div>;
  }

  if (loading) {
    return <p role="status">Loading event...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!event || !defaultValues) {
    return (
      <div className="alert alert-info">
        Event not found.
      </div>
    );
  }

  async function handleUpdate(dto: EventDto) {
    await eventService.update(eventId, dto);
    navigate(`/events/${eventId}`);
  }

  return (
    <section>
      <h1 className="mb-4">Edit event</h1>

      <EventForm
        defaultValues={defaultValues}
        onSubmit={handleUpdate}
        submitLabel="Save changes"
      />

      <Link to={`/events/${eventId}`} className="btn btn-link mt-3">
        Cancel
      </Link>
    </section>
  );
}
