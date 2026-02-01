import { NavLink, useNavigate } from "react-router-dom";
import "../../styles/staffDashboard.css";

function getStaff() {
  try {
    const raw = localStorage.getItem("cinemaFlow_staff");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const FALLBACK_STAFF = {
  name: "Staff Member",
  notifications: 0,
};

export default function StaffNavbar() {
  const navigate = useNavigate();
  const staff = getStaff() || FALLBACK_STAFF;

  function logout() {
    localStorage.removeItem("cinemaFlow_staff");
    navigate("/login");
  }

  return (
    <header className="staff-nav">
      <div className="staff-navInner">
        {/* BRAND */}
        <div className="staff-brand">
          <strong>🎞️ CinemaFlow Staff Portal</strong>
          <span className="welcome">Welcome, {staff.name}</span>
        </div>

        {/* MENU */}
        <nav className="staff-menu">
          <NavLink to="/staff" end>
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Dashboard</button>
            )}
          </NavLink>

          <NavLink to="/staff/schedule">
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>My Schedule</button>
            )}
          </NavLink>

          <NavLink to="/staff/timesheet">
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Timesheet</button>
            )}
          </NavLink>

          <NavLink to="/staff/tasks">
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Tasks</button>
            )}
          </NavLink>

          <NavLink to="/staff/profile">
            {({ isActive }) => (
              <button className={isActive ? "active" : ""}>Profile</button>
            )}
          </NavLink>


        </nav>

        {/* RIGHT ACTIONS */}
        <div className="staff-actions">
          <div className="staff-bell" title="Notifications">
            🔔
            {staff.notifications > 0 && (
              <span className="badge">{staff.notifications}</span>
            )}
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
