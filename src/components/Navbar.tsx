import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          CampusEvents
        </NavLink>

        <div className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
          >
            Events
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
