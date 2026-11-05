import { Link } from "react-router-dom";
import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/EventCard";

export default function Events() {
  const { events, loading, error } = useEvents();

  if (loading) {
    return <p role="status">Loading events...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Campus Events</h1>

        <Link to="/events/new" className="btn btn-primary">
          Create event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="alert alert-info">
          No events are currently available.
        </div>
      ) : (
        <div className="row g-4">
          {events.map((event) => (
            <div className="col-md-6 col-lg-4" key={event.id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
