import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="p-4 p-md-5 bg-light rounded-3">
      <h1>Welcome to CampusEvents</h1>

      <p className="lead">
        Discover events happening across campus.
      </p>

      <Link to="/events" className="btn btn-primary">
        Browse events
      </Link>
    </section>
  );
}
