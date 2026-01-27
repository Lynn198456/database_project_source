import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("cinemaFlow_user");
    navigate("/login");
  }

  return (
    <header className="cf-nav">
      <div className="cf-nav__left">
        {/* Logo */}
        <div className="cf-logo" onClick={() => navigate("/customer")} style={{ cursor: "pointer" }}>
          <div className="cf-logo__icon">🎞️</div>
          <div>
            <div className="cf-logo__title">CinemaFlow</div>
            <div className="cf-logo__sub">Premium Cinema Experience</div>
          </div>
        </div>

        {/* Search */}
        <div className="cf-search">
          <span style={{ opacity: 0.7 }}>🔎</span>
          <input placeholder="Search movies..." />
        </div>
      </div>

      {/* Links */}
      <nav className="cf-links">
        <NavLink
          to="/customer"
          end
          className={({ isActive }) =>
            `cf-link ${isActive ? "cf-link--active" : ""}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/customer/movies"
          className={({ isActive }) =>
            `cf-link ${isActive ? "cf-link--active" : ""}`
          }
        >
          Movies
        </NavLink>

        <NavLink
          to="/customer/showtimes"
          className={({ isActive }) =>
            `cf-link ${isActive ? "cf-link--active" : ""}`
          }
        >
          Showtimes
        </NavLink>

        <NavLink
          to="/customer/theaters"
          className={({ isActive }) =>
            `cf-link ${isActive ? "cf-link--active" : ""}`
          }
        >
          Theaters
        </NavLink>
      </nav>

      {/* Right buttons */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button className="cf-btn cf-btn--outline" type="button">
          🎟️ My Tickets
        </button>
        <button
          className="cf-btn cf-btn--outline"
          type="button"
          onClick={() => navigate("/customer/profile")}
        >
          👤 Profile
        </button>

        <button className="cf-btn" type="button" onClick={logout}>
           Logout
        </button>
      </div>
    </header>
  );
}