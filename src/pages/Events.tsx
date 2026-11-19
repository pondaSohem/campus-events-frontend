import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import { useEvents } from "../hooks/useEvents";
import { useAuth } from "../context/AuthContext";

export default function Events() {
  const { events, loading, error } = useEvents();
  const { isAdmin } = useAuth();

  if (loading) return <p role="status">Loading events…</p>;
  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );

  return (
    <section>
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-4">
        <div>
          <h1 className="mb-1">Campus events</h1>
          <p className="text-muted mb-0">Select an event to see the details.</p>
        </div>
        {isAdmin && (
          <Link to="/events/new" className="btn btn-success">
            + Create event
          </Link>
        )}
      </div>
      {events.length === 0 ? (
        <div className="alert alert-info">No events were found.</div>
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
