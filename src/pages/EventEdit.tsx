import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EventForm from "../components/EventForm";
import { useEvent } from "../hooks/useEvent";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";

function toLocalDateTimeInput(isoDate: string): string {
  const date = new Date(isoDate);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EventEdit() {
  const { id } = useParams();
  const eventId = Number(id);
  const navigate = useNavigate();
  const { event, loading, error } = useEvent(eventId);

  const defaultValues = useMemo(
    () =>
      event
        ? {
            title: event.title,
            description: event.description,
            imageUrl: event.imageUrl ?? "",
            location: event.location,
            startDate: toLocalDateTimeInput(event.startDate),
            endDate: toLocalDateTimeInput(event.endDate),
            price: event.price,
            capacity: event.capacity,
            categoryId: event.categoryId,
          }
        : undefined,
    [event],
  );

  async function handleUpdate(dto: EventDto) {
    await eventService.update(eventId, dto);
    navigate(`/events/${eventId}`, { replace: true });
  }

  if (!Number.isInteger(eventId) || eventId < 1)
    return <div className="alert alert-warning">Invalid event ID.</div>;
  if (loading) return <p role="status">Loading event…</p>;
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  if (!event || !defaultValues)
    return <div className="alert alert-warning">Event not found.</div>;

  return (
    <section className="mx-auto" style={{ maxWidth: 900 }}>
      <Link to={`/events/${eventId}`} className="btn btn-link px-0">
        ← Back to event
      </Link>
      <h1 className="mb-3">Edit event</h1>
      <EventForm
        defaultValues={defaultValues}
        onSubmit={handleUpdate}
        submitLabel="Save changes"
      />
    </section>
  );
}
