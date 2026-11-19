import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? " active fw-bold" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand fw-bold" to="/">
          CampusEvents
        </Link>

        {/* Mobile menu button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#campusNavbar"
          aria-controls="campusNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="campusNavbar">
          {/* Main navigation */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/events" className={navLinkClass}>
                Events
              </NavLink>
            </li>

            {/* Authenticated user links */}
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <NavLink to="/my-bookings" className={navLinkClass}>
                    My Bookings
                  </NavLink>
                </li>
              </>
            )}

            {/* Administrator links */}
            {isAuthenticated && isAdmin && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#admin-menu"
                  id="adminDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin
                </a>

                <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                  <li>
                    <NavLink to="/admin" end className="dropdown-item">
                      Dashboard
                    </NavLink>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <NavLink to="/admin/events" className="dropdown-item">
                      Manage Events
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/admin/bookings" className="dropdown-item">
                      Manage Bookings
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/admin/categories" className="dropdown-item">
                      Manage Categories
                    </NavLink>
                  </li>

                  <li>
                    <NavLink to="/admin/roles" className="dropdown-item">
                      Manage Roles
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* Account section */}
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {isAuthenticated && user ? (
              <>
                <li className="nav-item">
                  <span className="navbar-text me-lg-3">
                    Welcome, {user.firstName || user.email}
                  </span>
                </li>

                {isAdmin && (
                  <li className="nav-item">
                    <span className="badge bg-warning text-dark me-lg-3">
                      ADMIN
                    </span>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className={navLinkClass}>
                    Login
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className="btn btn-primary btn-sm ms-lg-2 mt-2 mt-lg-0"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
