import { Link } from "react-router-dom";
import type { Event } from "../types/Event";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="card h-100 shadow-sm">
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          className="card-img-top"
          alt={event.title}
        />
      )}

      <div className="card-body d-flex flex-column">
        <p className="text-muted mb-1">{event.categoryName}</p>

        <h2 className="h5 card-title">{event.title}</h2>

        <p className="card-text">{event.location}</p>

        <p>
          {new Date(event.startDate).toLocaleString()}
        </p>

        <p className="fw-bold">
          £{event.price.toFixed(2)}
        </p>

        <Link
          to={`/events/${event.id}`}
          className="btn btn-primary mt-auto"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
