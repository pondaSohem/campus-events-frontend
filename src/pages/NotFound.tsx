import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="text-center py-5">
      <h1>Page not found</h1>
      <p className="text-muted">
        The address does not match a page in this application.
      </p>
      <Link to="/" className="btn btn-primary">
        Return home
      </Link>
    </section>
  );
}
