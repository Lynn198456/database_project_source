import { useMemo, useState } from "react";
import "../../styles/staffDashboard.css";
import StaffNavbar from "../../components/staff/StaffNavbar";

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
    location: staff.location || "Downtown",
    position: staff.role || "Box Office",
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
      {/* ✅ Use Navbar from one file */}
      <StaffNavbar />

      {/* MAIN */}
      <main className="staff-container">
        <div className="staff-wrap">
          {/* TIME CLOCK */}
          <div className="staff-card clock-card">
            <div>
              <h3>🕒 Time Clock</h3>
              <p className="muted">
                You are currently <strong>{clockedIn ? "clocked in ✅" : "clocked out"}</strong>.
              </p>
            </div>

            {clockedIn ? (
              <button className="btn-red" type="button" onClick={() => setClockedIn(false)}>
                ⏹ Clock Out
              </button>
            ) : (
              <button className="btn-green" type="button" onClick={() => setClockedIn(true)}>
                ▶ Clock In
              </button>
            )}
          </div>

          {/* OVERVIEW */}
          <h3 className="section-title">✨ Today’s Overview</h3>

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

          {/* GRID LAYOUT */}
          <div className="staff-grid">
            {/* TODAY SHIFT */}
            <div className="staff-card">
              <h3>🕘 Today’s Shift</h3>
              <div className="shift">
                <div>
                  <strong>{todayShift.time}</strong>
                  <div className="muted">Location: {todayShift.location}</div>
                  <div className="muted">Position: {todayShift.position}</div>
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
                    <strong className="dateBlue">{s.date}</strong>
                    <div className="muted">Location: {s.location}</div>
                    <div className="muted">Position: {s.position}</div>
                  </div>
                  <strong>{s.time}</strong>
                </div>
              ))}
            </div>

            {/* TASKS */}
            <div className="staff-card">
              <h3>✅ Today’s Tasks</h3>
              <div className="tasksWrap">
                {tasks.map((t) => (
                  <label key={t.id} className={`task ${t.priority} ${t.done ? "done" : ""}`}>
                    <div className="taskTop">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => toggleTask(t.id)}
                      />
                      <strong>{t.title}</strong>
                    </div>
                    <span className="taskMeta">
                      {t.priority.toUpperCase()} • Due: {t.due}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ANNOUNCEMENTS */}
            <div className="staff-card">
              <h3>📢 Announcements</h3>

              <div className="announce">
                <strong>Team Meeting Tomorrow</strong>
                <p className="muted">All staff meeting at 9 AM in break room</p>
              </div>

              <div className="announce">
                <strong>New Schedule Posted</strong>
                <p className="muted">December schedule is now available</p>
              </div>

              <div className="announce">
                <strong>Holiday Hours Update</strong>
                <p className="muted">Check updated hours for Thanksgiving week</p>
              </div>
            </div>
          </div>

          <div className="staff-footer">© 2025 Cinema Listic Staff Portal</div>
        </div>
      </main>
    </div>
  );
}
