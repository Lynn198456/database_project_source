import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/staffTasks.css";
import StaffNavbar from "../../components/staff/StaffNavbar";

export default function StaffTasks() {
  const navigate = useNavigate();

  const initial = useMemo(
    () => [
      { id: 1, title: "Clean Theater 3", priority: "high", due: "10:00 AM", completed: false },
      { id: 2, title: "Restock Concession Stand", priority: "medium", due: "11:30 AM", completed: false },
      { id: 3, title: "Prepare Evening Rush Setup", priority: "medium", due: "04:00 PM", completed: false },
      { id: 4, title: "Check Projection Equipment", priority: "high", due: "12:00 PM", completed: true },
    ],
    []
  );

  const [tasks, setTasks] = useState(initial);

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="staff-page">
      {/* ✅ NAVBAR */}
      <StaffNavbar />

      <main className="staff-container">
        {/* HEADER */}
        <div className="section-head">
          <h2>📋 My Tasks</h2>
          <p className="muted">Manage your daily tasks and assignments</p>
        </div>

        {/* PENDING TASKS */}
        <div className="staff-card">
          <div className="card-head">
            <h3 className="card-title">⚠️ Pending Tasks</h3>
            <button className="btn-ghost" type="button" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="empty-state">✅ No pending tasks right now</div>
          ) : (
            pendingTasks.map((task) => (
              <div key={task.id} className="task-item">
                <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />

                <div className="task-info">
                  <strong>{task.title}</strong>
                  <div className="task-meta">
                    <span className={`priority ${task.priority}`}>{task.priority}</span>
                    {task.due && <span>Due: {task.due}</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* COMPLETED TASKS */}
        <div className="staff-card">
          <h3 className="card-title">✅ Completed Tasks</h3>

          {completedTasks.length === 0 ? (
            <div className="empty-state">No completed tasks yet</div>
          ) : (
            completedTasks.map((task) => (
              <div key={task.id} className="task-item completed">
                <span className="check-icon">✔</span>

                <div className="task-info">
                  <strong>{task.title}</strong>
                  <div className="completed-text">Completed</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="staff-footer">© 2025 CinemaFlow Staff Portal</div>
      </main>
    </div>
  );
}
