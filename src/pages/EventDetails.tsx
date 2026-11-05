import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../services/api";
import { eventService } from "../services/eventService";
import { useEvent } from "../hooks/useEvent";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();

  const validId = Number.isInteger(eventId) && eventId > 0;
  const { event, loading, error } = useEvent(eventId);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    if (!event) return;

    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    setDeleting(true);
    setDeleteError(null);

    try {
      await eventService.remove(event.id);
      navigate("/events", { replace: true });
    } catch (error) {
      setDeleteError(
        error instanceof ApiError || error instanceof Error
          ? error.message
          : "Failed to delete event."
      );
    } finally {
      setDeleting(false);
    }
  }

  if (!validId) {
    return <div className="alert alert-danger">Invalid event ID.</div>;
  }

  if (loading) {
    return <p role="status">Loading event...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!event) {
    return <div className="alert alert-info">Event not found.</div>;
  }

  return (
    <article className="card shadow-sm">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          className="card-img-top"
          alt={event.title}
        />
      )}

      <div className="card-body">
        <p className="text-muted">{event.categoryName}</p>

        <h1>{event.title}</h1>

        <p>{event.description}</p>

        <p><strong>Location:</strong> {event.location}</p>

        <p>
          <strong>Starts:</strong>{" "}
          {new Date(event.startDate).toLocaleString()}
        </p>

        <p>
          <strong>Ends:</strong>{" "}
          {new Date(event.endDate).toLocaleString()}
        </p>

        <p>
          <strong>Price:</strong> £{event.price.toFixed(2)}
        </p>

        <p>
          <strong>Available tickets:</strong> {event.availableTickets}
        </p>

        <p><strong>Capacity:</strong> {event.capacity}</p>

        {deleteError && (
          <div className="alert alert-danger">{deleteError}</div>
        )}

        <div className="d-flex gap-2">
          <Link
            to={`/events/${event.id}/edit`}
            className="btn btn-primary"
          >
            Edit event
          </Link>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete event"}
          </button>

          <Link to="/events" className="btn btn-outline-secondary">
            Back to events
          </Link>
        </div>
      </div>
    </article>
  );
}
