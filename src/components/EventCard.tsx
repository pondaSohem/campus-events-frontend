import { Link } from "react-router-dom";
import type { Event } from "../types/Event";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="card shadow-sm event-card">
      {event.imageUrl ? (
        <img
          className="event-image card-img-top"
          src={
            event.imageUrl?.startsWith("/") ? event.imageUrl : event.imageUrl
          }
          alt={event.title}
        />
      ) : (
        <div className="event-image d-flex align-items-center justify-content-center text-secondary">
          No image
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <p className="text-muted small mb-1">{event.categoryName}</p>
        <h2 className="h5 card-title">{event.title}</h2>
        <p className="mb-1">{event.location}</p>
        <p className="mb-3">{new Date(event.startDate).toLocaleString()}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <strong>£{event.price.toFixed(2)}</strong>
          <Link
            className="btn btn-outline-primary btn-sm"
            to={`/events/${event.id}`}
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
