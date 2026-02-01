import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
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
  name: "Michael Chen",
  role: "Box Office",
  location: "Downtown",
  notifications: 3,
};

export default function StaffDashboard() {
  const staff = useMemo(() => getStaff() || FALLBACK_STAFF, []);
  const [clockedIn, setClockedIn] = useState(false);

  // demo data
  const overview = {
    shiftDuration: "8 hours",
    tasksCompleted: "1 / 4",
    hoursThisWeek: "23.5 hrs",
    pendingActions: 3,
  };

  const todayShift = {
    time: "09:00 - 17:00",
    location: "Downtown",
    position: "Box Office",
    status: "Current",
  };

  const upcomingShifts = [
    { date: "Nov 27", time: "14:00 - 22:00", location: "Downtown", position: "Box Office" },
    { date: "Nov 28", time: "09:00 - 17:00", location: "Mall Location", position: "Floor Staff" },
    { date: "Nov 29", time: "14:00 - 22:00", location: "Downtown", position: "Box Office" },
    { date: "Nov 30", time: "OFF", location: "-", position: "-" },
  ];

  const [tasks, setTasks] = useState([
    { id: 1, title: "Clean Theater 3", priority: "high", due: "10:00 AM", done: false },
    { id: 2, title: "Restock Concession Stand", priority: "medium", due: "11:30 AM", done: false },
    { id: 3, title: "Check Projection Equipment", priority: "high", due: "12:00 PM", done: true },
    { id: 4, title: "Prepare Evening Rush Setup", priority: "medium", due: "04:00 PM", done: false },
  ]);

  function toggleTask(id) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  return (
    <div className="staff-page">
      {/* TOP NAV */}
      <header className="staff-nav">
        <div className="staff-brand">
          <strong>🎞️ CinemaFlow Staff Portal</strong>
          <span className="welcome">Welcome, {staff.name}</span>
        </div>

        <div className="staff-menu">
          <NavLink to="/staff" end>
            {({ isActive }) => <button className={isActive ? "active" : ""}>Dashboard</button>}
          </NavLink>

          <NavLink to="/staff/schedule">
            {({ isActive }) => <button className={isActive ? "active" : ""}>My Schedule</button>}
          </NavLink>

          <NavLink to="/staff/timesheet">
            {({ isActive }) => <button className={isActive ? "active" : ""}>Timesheet</button>}
          </NavLink>

          <NavLink to="/staff/tasks">
            {({ isActive }) => <button className={isActive ? "active" : ""}>Tasks</button>}
          </NavLink>

          <NavLink to="/staff/profile">
            {({ isActive }) => <button className={isActive ? "active" : ""}>Profile</button>}
          </NavLink>
        </div>

        <div className="staff-bell" title="Notifications">
          🔔
          <span className="badge">{staff.notifications}</span>
        </div>
      </header>

      {/* MAIN */}
      <main className="staff-container">
        {/* TIME CLOCK */}
        <div className="staff-card clock-card">
          <div>
            <h3>🕒 Time Clock</h3>
            <p>You are currently {clockedIn ? "clocked in ✅" : "clocked out"}.</p>
          </div>

          {clockedIn ? (
            <button className="btn-red" onClick={() => setClockedIn(false)}>
              ⏹ Clock Out
            </button>
          ) : (
            <button className="btn-green" onClick={() => setClockedIn(true)}>
              ▶ Clock In
            </button>
          )}
        </div>

        {/* OVERVIEW */}
        <h3 style={{ marginBottom: 12 }}>✨ Today’s Overview</h3>
        <div className="overview-grid">
          <div className="ov blue">
            <p>Shift Duration</p>
            <h2>{overview.shiftDuration}</h2>
          </div>
          <div className="ov green">
            <p>Tasks Completed</p>
            <h2>{overview.tasksCompleted}</h2>
          </div>
          <div className="ov purple">
            <p>Hours This Week</p>
            <h2>{overview.hoursThisWeek}</h2>
          </div>
          <div className="ov orange">
            <p>Pending Actions</p>
            <h2>{overview.pendingActions}</h2>
          </div>
        </div>

        {/* TWO COLUMN ROW */}
        <div className="two-col">
          {/* TODAY SHIFT */}
          <div className="staff-card">
            <h3>🕘 Today’s Shift</h3>
            <div className="shift">
              <div>
                <strong>{todayShift.time}</strong>
                <div>Location: {todayShift.location}</div>
                <div>Position: {todayShift.position}</div>
              </div>
              <span className="tag current">{todayShift.status}</span>
            </div>
          </div>

          {/* UPCOMING SHIFTS */}
          <div className="staff-card">
            <h3>📅 Upcoming Shifts</h3>
            {upcomingShifts.map((s) => (
              <div key={s.date} className={`shift ${s.time === "OFF" ? "off" : ""}`}>
                <div>
                  <strong style={{ color: "#38bdf8" }}>{s.date}</strong>
                  <div>Location: {s.location}</div>
                  <div>Position: {s.position}</div>
                </div>
                <strong>{s.time}</strong>
              </div>
            ))}
          </div>

          {/* TASKS */}
          <div className="staff-card">
            <h3>✅ Today’s Tasks</h3>
            {tasks.map((t) => (
              <label
                key={t.id}
                className={`task ${t.priority} ${t.done ? "done" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(t.id)}
                  />
                  <strong>{t.title}</strong>
                </div>
                <span>
                  {t.priority.toUpperCase()} • Due: {t.due}
                </span>
              </label>
            ))}
          </div>

          {/* ANNOUNCEMENTS */}
          <div className="staff-card">
            <h3>📢 Announcements</h3>
            <div className="staff-card" style={{ marginBottom: 12 }}>
              <strong>Team Meeting Tomorrow</strong>
              <p style={{ opacity: 0.8 }}>All staff meeting at 9 AM in break room</p>
            </div>

            <div className="staff-card" style={{ marginBottom: 12 }}>
              <strong>New Schedule Posted</strong>
              <p style={{ opacity: 0.8 }}>December schedule is now available</p>
            </div>

            <div className="staff-card">
              <strong>Holiday Hours Update</strong>
              <p style={{ opacity: 0.8 }}>Check updated hours for Thanksgiving week</p>
            </div>
          </div>
        </div>

        <div className="staff-footer">© 2025 CinemaFlow Staff Portal</div>
      </main>
    </div>
  );
}
