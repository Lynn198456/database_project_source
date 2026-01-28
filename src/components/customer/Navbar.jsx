import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("cinemaFlow_user");
    navigate("/login");
  }

  return (
    <header className="cf-nav">
      {/* LEFT */}
      <div className="cf-nav__left">
        <div className="cf-logo" onClick={() => navigate("/customer")}>
          🎞️ <b>CinemaFlow</b>
        </div>

        <div className="cf-search">
          🔎 <input placeholder="Search movies..." />
        </div>
      </div>

      {/* CENTER LINKS */}
      <nav className="cf-links">
        <NavLink to="/customer" end className="cf-link">Home</NavLink>
        <NavLink to="/customer/movies" className="cf-link">Movies</NavLink>
        <NavLink to="/customer/showtimes" className="cf-link">Showtimes</NavLink>
        <NavLink to="/customer/theaters" className="cf-link">Theaters</NavLink>
        
      </nav>

      {/* RIGHT */}
      <div style={{ display: "flex", gap: 10 }}>
        {/* ✅ FIXED */}
        <NavLink to="/customer/tickets" className="cf-btn cf-btn--outline">
          🎟️ My Tickets
        </NavLink>

        <NavLink to="/customer/profile" className="cf-btn cf-btn--outline">
          👤 Profile
        </NavLink>

        <button className="cf-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}
