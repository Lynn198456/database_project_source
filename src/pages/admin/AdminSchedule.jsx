import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin/adminSchedule.css";

export default function AdminSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [screen, setScreen] = useState("");

  const [showtimes, setShowtimes] = useState(() => [
    { id: 1, date: "2026-02-04", time: "10:00", screen: "1" },
    { id: 2, date: "2026-02-04", time: "14:30", screen: "2" }
  ]);

  const canAdd = useMemo(() => date && time && screen, [date, time, screen]);

  function addShowtime(e) {
    e.preventDefault();
    if (!canAdd) return;

    const next = {
      id: Date.now(),
      date,
      time,
      screen
    };
    setShowtimes((prev) => [next, ...prev]);
    setDate("");
    setTime("");
    setScreen("");
  }

  function removeShowtime(showId) {
    setShowtimes((prev) => prev.filter((s) => s.id !== showId));
  }

  return (
    <div className="as-page">
      <AdminNavbar />

      <div className="as-container">
        <header className="as-header">
          <div>
            <h1>Schedule Showtimes</h1>
            <p>Movie ID: {id}</p>
          </div>
          <button className="as-secondary" onClick={() => navigate("/admin")}>Back</button>
        </header>

        <form className="as-card" onSubmit={addShowtime}>
          <h2>Add Showtime</h2>
          <div className="as-grid">
            <label>
              Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              Time
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
            <label>
              Screen
              <input value={screen} onChange={(e) => setScreen(e.target.value)} placeholder="1" />
            </label>
          </div>
          <div className="as-actions">
            <button className="as-primary" type="submit" disabled={!canAdd}>
              Add Showtime
            </button>
          </div>
        </form>

        <section className="as-card">
          <h2>Scheduled Showtimes</h2>
          {showtimes.length === 0 ? (
            <div className="as-empty">No showtimes yet.</div>
          ) : (
            <div className="as-table">
              <div className="as-row as-rowHead">
                <div>Date</div>
                <div>Time</div>
                <div>Screen</div>
                <div>Action</div>
              </div>
              {showtimes.map((s) => (
                <div key={s.id} className="as-row">
                  <div>{s.date}</div>
                  <div>{s.time}</div>
                  <div>{s.screen}</div>
                  <div>
                    <button className="as-link" onClick={() => removeShowtime(s.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
