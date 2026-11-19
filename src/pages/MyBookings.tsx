import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { bookingService } from "../services/bookingService";
import type { Booking } from "../types/Booking";
export default function MyBookings() {
  const [items, setItems] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  async function load() {
    try {
      setItems(await bookingService.mine());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load bookings.");
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function cancel(id: number) {
    if (!confirm("Cancel this booking?")) return;
    setBusy(id);
    try {
      await bookingService.cancel(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancellation failed.");
    } finally {
      setBusy(null);
    }
  }
  return (
    <section>
      <h1>My bookings</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {items.length === 0 ? (
        <p className="text-muted">No bookings found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Event</th>
                <th>Booked</th>
                <th>Tickets</th>
                <th>Total</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link to={`/events/${b.eventId}`}>{b.eventTitle}</Link>
                  </td>
                  <td>{new Date(b.bookingDate).toLocaleString()}</td>
                  <td>{b.numberOfTickets}</td>
                  <td>£{b.totalAmount.toFixed(2)}</td>
                  <td>{b.status}</td>
                  <td>
                    {!b.status.toLowerCase().includes("cancel") && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={busy === b.id}
                        onClick={() => void cancel(b.id)}
                      >
                        {busy === b.id ? "Cancelling…" : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
