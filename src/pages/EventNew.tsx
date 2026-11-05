import { useNavigate } from "react-router-dom";
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
    <section>
      <h1 className="mb-4">Create event</h1>

      <EventForm
        onSubmit={handleCreate}
        submitLabel="Create event"
      />
    </section>
  );
}
