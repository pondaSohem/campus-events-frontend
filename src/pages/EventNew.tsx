import { Link, useNavigate } from "react-router-dom";
import EventForm from "../components/EventForm";
import { eventService } from "../services/eventService";
import type { EventDto } from "../types/EventDto";

export default function EventNew() {
  const navigate = useNavigate();

  async function handleCreate(dto: EventDto) {
    const created = await eventService.create(dto);
    navigate(`/events/${created.id}`, { replace: true });
  }

  return (
    <section className="mx-auto" style={{ maxWidth: 900 }}>
      <Link to="/events" className="btn btn-link px-0">
        ← Back to events
      </Link>
      <h1 className="mb-3">Create an event</h1>
      <p className="text-muted">
        The API checks permissions and validates the submitted event.
      </p>
      <EventForm onSubmit={handleCreate} submitLabel="Create event" />
    </section>
  );
}
