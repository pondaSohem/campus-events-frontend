import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const tasks = [
  {
    title: "Manage events",
    description:
      "Create new events, edit event details and remove events when permitted.",
    to: "/events",
    action: "Open events",
    icon: "📅",
  },
  {
    title: "Manage bookings",
    description: "Review all bookings and update their status.",
    to: "/admin/bookings",
    action: "Manage bookings",
    icon: "🎟️",
  },
  {
    title: "Manage categories",
    description: "Create, edit and delete event categories.",
    to: "/admin/categories",
    action: "Manage categories",
    icon: "🏷️",
  },
  {
    title: "Manage roles",
    description:
      "Create application roles and assign or remove roles for users.",
    to: "/admin/roles",
    action: "Manage roles",
    icon: "🔐",
  },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <section>
      <div className="mb-4">
        <p className="text-uppercase text-primary fw-semibold small mb-1">
          Administration
        </p>
        <h1 className="mb-1">Admin dashboard</h1>
        <p className="text-muted mb-0">
          Welcome, {user?.firstName || "Administrator"}. Choose an area to
          manage CampusEvents.
        </p>
      </div>
      <div className="row g-3">
        {tasks.map((task) => (
          <div className="col-md-6" key={task.to}>
            <article className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="fs-2 mb-2" aria-hidden="true">
                  {task.icon}
                </div>
                <h2 className="h5">{task.title}</h2>
                <p className="text-muted flex-grow-1">{task.description}</p>
                <Link
                  className="btn btn-outline-primary align-self-start"
                  to={task.to}
                >
                  {task.action}
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
      <div className="alert alert-info mt-4 mb-0">
        <strong>Review moderation:</strong> Open{" "}
        <Link to="/events">Events</Link>, select an event, then use the review
        controls on its details page to remove inappropriate reviews. Remember,
        this is not complete and has errors that you try to fix in the remaining
        time today.
      </div>
    </section>
  );
}
