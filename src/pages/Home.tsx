import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <section className="py-4 py-lg-5">
      <div className="p-4 p-lg-5 rounded-4 bg-white shadow-sm">
        <p className="text-primary fw-semibold mb-2">
          Discover · Connect · Participate
        </p>
        <h1 className="display-5 fw-bold">Find your next campus experience.</h1>
        <p className="lead text-muted" style={{ maxWidth: 680 }}>
          Explore university events, reserve your place and share your
          experience with the campus community.
        </p>
        <div className="d-flex flex-wrap gap-2 mt-4">
          <Link to="/events" className="btn btn-primary btn-lg">
            Explore events
          </Link>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-outline-primary btn-lg">
              Create account
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
