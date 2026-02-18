import { useEffect, useMemo, useState } from "react";
import "../../styles/staffDashboard.css";
import StaffNavbar from "../../components/staff/StaffNavbar";
import { listStaffTasks, updateStaffTask } from "../../api/staffTasks";

function getStaff() {
  try {
    const raw = localStorage.getItem("cinemaFlow_staff");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getAuthUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatDueTime(timeValue) {
  if (!timeValue) return "No time";
  const [hRaw, mRaw] = String(timeValue).split(":");
  const h = Number.parseInt(hRaw, 10);
  const m = Number.parseInt(mRaw, 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return timeValue;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

const FALLBACK_STAFF = {
  name: "Staff User",
  role: "Box Office",
  location: "Downtown",
  notifications: 3
};

export default function StaffDashboard() {
  const staff = useMemo(() => getStaff() || FALLBACK_STAFF, []);
  const authUser = useMemo(() => getAuthUser(), []);
  const [clockedIn, setClockedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState("");

  async function loadTasks() {
    if (!authUser?.email) {
      setTaskLoading(false);
      setTaskError("Please log in as staff to load tasks.");
      return;
    }

    try {
      setTaskLoading(true);
      setTaskError("");
      const data = await listStaffTasks({ email: authUser.email, limit: 200 });
      setTasks(data.tasks || []);
    } catch (err) {
      setTasks([]);
      setTaskError(err.message || "Failed to load tasks.");
    } finally {
      setTaskLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function toggleTask(task) {
    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    try {
      setTaskError("");
      await updateStaffTask(task.id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate || null,
        dueTime: task.dueTime || null,
        status: nextStatus
      });

      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t)));
    } catch (err) {
      setTaskError(err.message || "Failed to update task.");
    }
  }

  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;
  const pendingCount = tasks.filter((t) => t.status !== "COMPLETED").length;

  const overview = {
    shiftDuration: "8 hours",
    tasksCompleted: `${completedCount} / ${tasks.length || 0}`,
    hoursThisWeek: "23.5 hrs",
    pendingActions: pendingCount
  };

  const todayShift = {
    time: "09:00 - 17:00",
    location: staff.location || "Downtown",
    position: staff.role || "Box Office",
    status: "Current"
  };

  const upcomingShifts = [
    { date: "Nov 27", time: "14:00 - 22:00", location: "Downtown", position: "Box Office" },
    { date: "Nov 28", time: "09:00 - 17:00", location: "Mall Location", position: "Floor Staff" },
    { date: "Nov 29", time: "14:00 - 22:00", location: "Downtown", position: "Box Office" },
    { date: "Nov 30", time: "OFF", location: "-", position: "-" }
  ];

  const todayTasks = tasks
    .filter((t) => {
      if (!t.dueDate) return true;
      const today = new Date().toISOString().slice(0, 10);
      return t.dueDate === today;
    })
    .slice(0, 4);

  return (
    <div className="staff-page">
      <StaffNavbar />

      <main className="staff-container">
        <div className="staff-wrap">
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

          <h3 className="section-title">✨ Today’s Overview</h3>

          <div className="overview-grid">
            <div className="ov blue">
              <p>Shift Duration</p>
              <h2>{overview.shiftDuration}</h2>
            </div>
            <div className="ov green">
              <p>Tasks Completed</p>
              <h2>{taskLoading ? "..." : overview.tasksCompleted}</h2>
            </div>
            <div className="ov purple">
              <p>Hours This Week</p>
              <h2>{overview.hoursThisWeek}</h2>
            </div>
            <div className="ov orange">
              <p>Pending Actions</p>
              <h2>{taskLoading ? "..." : overview.pendingActions}</h2>
            </div>
          </div>

          <div className="staff-grid">
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

            <div className="staff-card">
              <h3>✅ Today’s Tasks</h3>

              {taskError ? <div className="muted">{taskError}</div> : null}

              <div className="tasksWrap">
                {taskLoading ? (
                  <div className="muted">Loading tasks...</div>
                ) : todayTasks.length === 0 ? (
                  <div className="muted">No tasks available.</div>
                ) : (
                  todayTasks.map((t) => (
                    <label key={t.id} className={`task ${t.priority} ${t.status === "COMPLETED" ? "done" : ""}`}>
                      <div className="taskTop">
                        <input type="checkbox" checked={t.status === "COMPLETED"} onChange={() => toggleTask(t)} />
                        <strong>{t.title}</strong>
                      </div>
                      <span className="taskMeta">
                        {String(t.priority || "medium").toUpperCase()} • Due: {formatDueTime(t.dueTime)}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

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
