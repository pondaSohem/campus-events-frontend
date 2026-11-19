import { useEffect, useState } from "react";
import { bookingService } from "../services/bookingService";
import type { Booking } from "../types/Booking";
export default function AdminBookings() {
  const [items, setItems] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  async function load() {
    try {
      setItems(await bookingService.all());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load bookings.");
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function status(id: number, value: string) {
    try {
      await bookingService.updateStatus(id, value);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update status.");
    }
  }
  return (
    <section>
      <h1>Booking administration</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Event</th>
              <th>User</th>
              <th>Tickets</th>
              <th>Total</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.eventTitle}</td>
                <td>{b.userId}</td>
                <td>{b.numberOfTickets}</td>
                <td>£{b.totalAmount.toFixed(2)}</td>
                <td>{b.status}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    defaultValue={b.status}
                    onChange={(e) => void status(b.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Cancelled</option>
                    <option>Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
