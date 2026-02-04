import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/admin/adminNavbar.css";

export default function AdminNavbar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("cinemaFlow_user");
    navigate("/login");
  }
  return (
    <header className="admin-nav">
      <div className="admin-nav-inner">

        {/* Brand */}
        <div className="admin-brand">
          <div className="brand-icon">🎬</div>
          <div>
            <strong>Cinema Listic Management</strong>
            <span>Administrator Dashboard</span>
          </div>
        </div>

        {/* Menu */}
        <nav className="admin-menu">
          <NavLink to="/admin" end>
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Dashboard</button>
            )}
          </NavLink>

          <NavLink to="/admin/movies">
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Movies</button>
            )}
          </NavLink>

          <NavLink to="/admin/showtimes">
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Showtimes</button>
            )}
          </NavLink>

          <NavLink to="/admin/theaters">
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Theaters</button>
            )}
          </NavLink>

          <NavLink to="/admin/team">
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Team</button>
            )}
          </NavLink>

          <NavLink to="/admin/profile">
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Profile</button>
            )}
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="admin-actions">
          <span className="bell">🔔</span>
          <button className="logout" onClick={logout}>
            Logout
          </button>
        </div>

      </div>
    </header>
  );
}
