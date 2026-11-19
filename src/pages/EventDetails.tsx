import { Link, useNavigate, useParams } from "react-router-dom";
import { useEvent } from "../hooks/useEvent";
import { eventService } from "../services/eventService";
import { ApiError } from "../services/api";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { bookingService } from "../services/bookingService";
import { reviewService } from "../services/reviewService";
import type { Review } from "../types/Review";

export default function EventDetails() {
  const { id } = useParams();
  const eventId = Number(id);
  const navigate = useNavigate();
  const { event, loading, error } = useEvent(eventId);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();
  const [tickets, setTickets] = useState(1);
  const [bookingMessage, setBookingMessage] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewDeleteMessage, setReviewDeleteMessage] = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  useEffect(() => {
    if (event)
      reviewService
        .forEvent(event.id)
        .then(setReviews)
        .catch(() => setReviews([]));
  }, [event]);
  async function book() {
    try {
      const result = await bookingService.create({
        eventId,
        numberOfTickets: tickets,
      });
      setBookingMessage(
        `Booking #${result.id} created. Status: ${result.status}`,
      );
    } catch (e) {
      setBookingMessage(e instanceof Error ? e.message : "Booking failed.");
    }
  }
  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    try {
      await reviewService.create({
        eventId,
        rating,
        comment: comment.trim() || null,
      });
      setReviewMessage("Review submitted.");
      setComment("");
      setReviews(await reviewService.forEvent(eventId));
    } catch (err) {
      setReviewMessage(err instanceof Error ? err.message : "Review failed.");
    }
  }
  async function deleteReview(reviewId: number) {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    setDeletingReviewId(reviewId);
    setReviewDeleteMessage("");
    try {
      await reviewService.remove(reviewId);
      setReviews((current) =>
        current.filter((review) => review.id !== reviewId),
      );
      setReviewDeleteMessage("Review deleted.");
    } catch (err) {
      setReviewDeleteMessage(
        err instanceof Error ? err.message : "Unable to delete this review.",
      );
    } finally {
      setDeletingReviewId(null);
    }
  }

  async function handleDelete() {
    if (!event) return;
    if (!window.confirm(`Delete “${event.title}”? This cannot be undone.`))
      return;
    setDeleting(true);
    setDeleteError("");
    try {
      await eventService.remove(event.id);
      navigate("/events", { replace: true });
    } catch (err) {
      setDeleteError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Unable to delete this event.",
      );
    } finally {
      setDeleting(false);
    }
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
  if (!event)
    return <div className="alert alert-warning">Event not found.</div>;

  return (
    <section>
      <Link to="/events" className="btn btn-link px-0">
        ← Back to events
      </Link>
      <article className="card shadow-sm overflow-hidden">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-100"
            style={{ maxHeight: 360, objectFit: "cover" }}
          />
        )}
        <div className="card-body p-4">
          <p className="text-muted mb-1">{event.categoryName}</p>
          <h1>{event.title}</h1>
          <p className="lead">{event.description}</p>
          <dl className="row mt-4">
            <dt className="col-sm-3">Location</dt>
            <dd className="col-sm-9">{event.location}</dd>
            <dt className="col-sm-3">Starts</dt>
            <dd className="col-sm-9">
              {new Date(event.startDate).toLocaleString()}
            </dd>
            <dt className="col-sm-3">Ends</dt>
            <dd className="col-sm-9">
              {new Date(event.endDate).toLocaleString()}
            </dd>
            <dt className="col-sm-3">Price</dt>
            <dd className="col-sm-9">£{event.price.toFixed(2)}</dd>
            <dt className="col-sm-3">Tickets available</dt>
            <dd className="col-sm-9">
              {event.availableTickets} of {event.capacity}
            </dd>
          </dl>
          {deleteError && (
            <div className="alert alert-danger" role="alert">
              {deleteError}
            </div>
          )}
          {isAdmin && (
            <div className="d-flex flex-wrap gap-2">
              <Link className="btn btn-primary" to={`/events/${event.id}/edit`}>
                Edit event
              </Link>
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete event"}
              </button>
            </div>
          )}
          {isAuthenticated && (
            <div className="border rounded p-3 mt-4">
              <h2 className="h5">Book tickets</h2>
              <div className="d-flex gap-2 align-items-center">
                <label htmlFor="ticketCount">Tickets</label>
                <input
                  id="ticketCount"
                  className="form-control"
                  style={{ maxWidth: 100 }}
                  type="number"
                  min="1"
                  max="20"
                  value={tickets}
                  onChange={(e) => setTickets(Number(e.target.value))}
                />
                <button
                  className="btn btn-success"
                  disabled={event.availableTickets < tickets || tickets < 1}
                  onClick={() => void book()}
                >
                  Book now
                </button>
              </div>
              {bookingMessage && (
                <p className="mt-2 mb-0" role="status">
                  {bookingMessage}
                </p>
              )}
            </div>
          )}
          {!isAuthenticated && (
            <p className="mt-3">
              <Link to="/login">Sign in</Link> to book tickets or leave a
              review.
            </p>
          )}
          <section className="mt-4">
            <h2 className="h4">Reviews</h2>
            {reviewDeleteMessage && (
              <div className="alert alert-info py-2" role="status">
                {reviewDeleteMessage}
              </div>
            )}
            {reviews.length === 0 ? (
              <p className="text-muted">No reviews yet.</p>
            ) : (
              reviews.map((r) => (
                <article className="border-bottom py-2" key={r.id}>
                  <strong>{r.userName}</strong> · {"★".repeat(r.rating)}
                  <p className="mb-1">{r.comment}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </small>
                    {isAdmin && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        disabled={deletingReviewId === r.id}
                        onClick={() => void deleteReview(r.id)}
                      >
                        {deletingReviewId === r.id
                          ? "Deleting…"
                          : "Delete review"}
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
            {isAuthenticated && (
              <form className="card card-body mt-3" onSubmit={submitReview}>
                <h3 className="h6">Write a review</h3>
                <label className="form-label" htmlFor="rating">
                  Rating
                </label>
                <select
                  id="rating"
                  className="form-select mb-2"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} / 5
                    </option>
                  ))}
                </select>
                <label className="form-label" htmlFor="comment">
                  Comment
                </label>
                <textarea
                  id="comment"
                  className="form-control mb-2"
                  maxLength={1000}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="btn btn-primary align-self-start">
                  Submit review
                </button>
                {reviewMessage && <p className="mt-2 mb-0">{reviewMessage}</p>}
              </form>
            )}
          </section>
        </div>
      </article>
    </section>
  );
}
