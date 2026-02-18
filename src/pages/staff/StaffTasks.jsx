import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/staffTasks.css";
import StaffNavbar from "../../components/staff/StaffNavbar";
import { listStaffTasks, updateStaffTask } from "../../api/staffTasks";

function getAuthUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function formatDueLabel(task) {
  if (!task.dueDate && !task.dueTime) return "No due time";
  if (!task.dueDate) return task.dueTime;

  const date = new Date(`${task.dueDate}T00:00:00`);
  const dateText = Number.isNaN(date.getTime())
    ? task.dueDate
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (!task.dueTime) return dateText;

  const [hRaw, mRaw] = String(task.dueTime).split(":");
  const h = Number.parseInt(hRaw, 10);
  const m = Number.parseInt(mRaw, 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return `${dateText} ${task.dueTime}`;

  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${dateText} ${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export default function StaffTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [error, setError] = useState("");

  const authUser = useMemo(() => getAuthUser(), []);

  async function loadTasks() {
    if (!authUser?.email) {
      setLoading(false);
      setError("Please log in as staff to view tasks.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await listStaffTasks({ email: authUser.email, limit: 200 });
      setTasks(data.tasks || []);
    } catch (err) {
      setTasks([]);
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function toggleTask(task) {
    const nextStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    try {
      setUpdatingTaskId(task.id);
      setError("");
      await updateStaffTask(task.id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate || null,
        dueTime: task.dueTime || null,
        status: nextStatus
      });

      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: nextStatus } : t))
      );
    } catch (err) {
      setError(err.message || "Failed to update task.");
    } finally {
      setUpdatingTaskId(null);
    }
  }

  const pendingTasks = tasks.filter((t) => t.status !== "COMPLETED");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  return (
    <div className="staff-page">
      <StaffNavbar />

      <main className="staff-container">
        <div className="section-head">
          <h2>📋 My Tasks</h2>
          <p className="muted">Manage your daily tasks and assignments</p>
        </div>

        {error ? (
          <div className="empty-state" style={{ marginBottom: 12, color: "#fecaca" }}>
            {error}
          </div>
        ) : null}

        <div className="staff-card">
          <div className="card-head">
            <h3 className="card-title">⚠️ Pending Tasks</h3>
            <button className="btn-ghost" type="button" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>

          {loading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : pendingTasks.length === 0 ? (
            <div className="empty-state">✅ No pending tasks right now</div>
          ) : (
            pendingTasks.map((task) => (
              <div key={task.id} className="task-item">
                <input
                  type="checkbox"
                  checked={task.status === "COMPLETED"}
                  disabled={updatingTaskId === task.id}
                  onChange={() => toggleTask(task)}
                />

                <div className="task-info">
                  <strong>{task.title}</strong>
                  <div className="task-meta">
                    <span className={`priority ${task.priority}`}>{task.priority}</span>
                    <span>Due: {formatDueLabel(task)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="staff-card">
          <h3 className="card-title">✅ Completed Tasks</h3>

          {loading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : completedTasks.length === 0 ? (
            <div className="empty-state">No completed tasks yet</div>
          ) : (
            completedTasks.map((task) => (
              <div key={task.id} className="task-item completed">
                <input
                  type="checkbox"
                  checked
                  disabled={updatingTaskId === task.id}
                  onChange={() => toggleTask(task)}
                />

                <div className="task-info">
                  <strong>{task.title}</strong>
                  <div className="completed-text">Completed</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="staff-footer">© 2025 Cinema Listic Staff Portal</div>
      </main>
    </div>
  );
}
