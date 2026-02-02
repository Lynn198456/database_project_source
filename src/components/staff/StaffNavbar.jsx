import { NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import "../../styles/staff/staffNavbar.css";

function getStaff() {
  try {
    const raw = localStorage.getItem("cinemaFlow_staff");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function StaffNavbar() {
  const navigate = useNavigate();

  const staff = useMemo(() => getStaff() || { name: "Staff Member", notifications: 0 }, []);
  const notif = Number(staff?.notifications || 0);

  function logout() {
    // ✅ clear whatever you use for auth/session
    localStorage.removeItem("cinemaFlow_staff");
    // if you have auth flags, clear them too:
    localStorage.removeItem("cinemaFlow_staff_loggedIn");

    navigate("/"); // change to "/login" if you have a login page
  }

  return (
    <header className="sn-wrap">
      <div className="sn-inner">
        {/* Left: Brand */}
        <div className="sn-left">
          <div className="sn-brand">
            <span className="sn-logo">🎬</span>
            <div className="sn-brandText">
              <div className="sn-title">CinemaFlow Staff Portal</div>
              <div className="sn-sub">Welcome, {staff?.name || "Staff Member"}</div>
            </div>
          </div>
        </div>

        {/* Center: Nav */}
        <nav className="sn-nav" aria-label="Staff navigation">
          <NavLink to="/staff" end className={({ isActive }) => `sn-link ${isActive ? "active" : ""}`}>
            Dashboard
          </NavLink>

          <NavLink to="/staff/schedule" className={({ isActive }) => `sn-link ${isActive ? "active" : ""}`}>
            My Schedule
          </NavLink>

          <NavLink to="/staff/timesheet" className={({ isActive }) => `sn-link ${isActive ? "active" : ""}`}>
            Timesheet
          </NavLink>

          <NavLink to="/staff/tasks" className={({ isActive }) => `sn-link ${isActive ? "active" : ""}`}>
            Tasks
          </NavLink>

          <NavLink to="/staff/profile" className={({ isActive }) => `sn-link ${isActive ? "active" : ""}`}>
            Profile
          </NavLink>
        </nav>

        {/* Right: Actions */}
        <div className="sn-actions">
          <button
            type="button"
            className="sn-bell"
            title="Notifications"
            onClick={() => navigate("/staff/profile")}
          >
            🔔
            {notif > 0 ? <span className="sn-badge">{notif > 99 ? "99+" : notif}</span> : null}
          </button>

          <button type="button" className="sn-logout" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
