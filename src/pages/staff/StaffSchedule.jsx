import { useMemo, useState, useEffect } from "react";
import "../../styles/staff/staffSchedule.css";
import StaffNavbar from "../../components/staff/StaffNavbar";

export default function StaffSchedule() {
  // ---- Fake schedule data (keep yours if you already have) ----
  const week = useMemo(
    () => ({
      label: "Week of Nov 25 - Dec 1, 2025",
      days: [
        { day: "Mon", date: 25, time: "09:00 - 17:00", role: "Box Office" },
        { day: "Tue", date: 26, time: "14:00 - 22:00", role: "Floor Staff" },
        { day: "Wed", date: 27, time: "09:00 - 17:00", role: "Box Office" },
        { day: "Thu", date: 28, time: "14:00 - 22:00", role: "Floor Staff" },
        { day: "Fri", date: 29, time: "09:00 - 17:00", role: "Box Office" },
        { day: "Sat", date: 30, off: true },
        { day: "Sun", date: 31, off: true },
      ],
    }),
    []
  );

  // ---- LocalStorage key ----
  const LS_KEY = "cinemaFlow_timeOffRequests";

  // ---- Modal state ----
  const [open, setOpen] = useState(false);

  // ---- Request form state ----
  const [form, setForm] = useState({
    type: "Vacation",
    startDate: "",
    endDate: "",
    reason: "",
    partialDay: false,
    startTime: "09:00",
    endTime: "17:00",
  });

  // ---- Requests list state ----
  const [requests, setRequests] = useState([]);

  // Load saved requests
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      setRequests(raw ? JSON.parse(raw) : []);
    } catch (err) {
      setRequests([]);
    }
  }, []);

  // Save requests to localStorage
  const saveRequests = (next) => {
    setRequests(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const resetForm = () => {
    setForm({
      type: "Vacation",
      startDate: "",
      endDate: "",
      reason: "",
      partialDay: false,
      startTime: "09:00",
      endTime: "17:00",
    });
  };

  const openModal = () => {
    resetForm();
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const submitRequest = (e) => {
    e.preventDefault();

    if (!form.startDate) return alert("Please select start date");
    if (!form.endDate) return alert("Please select end date");
    if (new Date(form.endDate) < new Date(form.startDate))
      return alert("End date cannot be before start date");
    if (!form.reason.trim()) return alert("Please enter a reason");

    const newReq = {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      partialDay: form.partialDay,
      startTime: form.partialDay ? form.startTime : null,
      endTime: form.partialDay ? form.endTime : null,
      reason: form.reason.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const next = [newReq, ...requests];
    saveRequests(next);
    setOpen(false);
  };

  const deleteRequest = (id) => {
    const next = requests.filter((r) => r.id !== id);
    saveRequests(next);
  };

  // Example stats
  const totalHours = 40;
  const shifts = 5;
  const daysOff = 2;

  return (
    <>
      {/* ✅ Staff Navbar */}
      <StaffNavbar />

      <div className="staff-page">
        <div className="staff-wrap">
          {/* Header */}
          <div className="section-head">
            <h2>📅 My Schedule</h2>
            <p className="muted">View your upcoming shifts and availability</p>
          </div>

          {/* Week row */}
          <div className="schedule-head">
            <div className="week-title">{week.label}</div>
            <button className="btn-blue" onClick={openModal}>
              Request Time Off
            </button>
          </div>

          {/* ✅ Week Grid */}
          <div className="card-surface">
            <div className="week-grid">
              {week.days.map((d) => (
                <div key={`${d.day}-${d.date}`} className={`day-card ${d.off ? "off" : ""}`}>
                  <div className="day-top">
                    <div className="day-name">{d.day}</div>
                    <div className="day-date">{d.date}</div>
                  </div>

                  {d.off ? (
                    <div className="day-off">OFF</div>
                  ) : (
                    <div className="shift-box">
                      {d.time}
                      <span>{d.role}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ✅ Stats */}
          <div className="stats-row">
            <div className="stat-card stat-blue">
              <div className="label">Total Hours This Week</div>
              <div className="value">{totalHours} hours</div>
            </div>

            <div className="stat-card stat-purple">
              <div className="label">Shifts This Week</div>
              <div className="value">{shifts} shifts</div>
            </div>

            <div className="stat-card stat-green">
              <div className="label">Days Off</div>
              <div className="value">{daysOff} days</div>
            </div>
          </div>

          {/* ✅ Requests list */}
          <div style={{ marginTop: 18 }} className="card-surface">
            <div className="schedule-head" style={{ margin: 0 }}>
              <div className="week-title">📝 Time Off Requests</div>
              <div className="muted">{requests.length} total</div>
            </div>

            <div style={{ marginTop: 12 }}>
              {requests.length === 0 ? (
                <div className="muted">No requests yet. Click “Request Time Off”.</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {requests.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: 12,
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.10)",
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <b>{r.type}</b>
                          <span
                            style={{
                              fontSize: 12,
                              padding: "4px 10px",
                              borderRadius: 999,
                              border: "1px solid rgba(255,255,255,0.14)",
                              background: "rgba(255,255,255,0.06)",
                            }}
                          >
                            {r.status}
                          </span>
                        </div>

                        <div className="muted" style={{ marginTop: 6 }}>
                          {r.startDate} → {r.endDate}
                          {r.partialDay ? (
                            <span> • Partial: {r.startTime}-{r.endTime}</span>
                          ) : null}
                        </div>

                        <div style={{ marginTop: 8 }}>{r.reason}</div>
                      </div>

                      <button
                        onClick={() => deleteRequest(r.id)}
                        title="Delete request"
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.06)",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 22, textAlign: "center" }} className="muted">
            © 2025 Cinema Listic Staff Portal
          </div>
        </div>

        {/* ✅ Modal (uses CSS modal classes) */}
        {open ? (
          <div className="modal-overlay" onMouseDown={closeModal}>
            <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
              <div className="modal-head">
                <h3>Request Time Off</h3>
                <button className="modal-close" onClick={closeModal}>
                  ✕
                </button>
              </div>

              <form onSubmit={submitRequest}>
                <div className="form-row">
                  <label className="form-label">
                    Type
                    <select
                      className="form-input"
                      value={form.type}
                      onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}
                    >
                      <option>Vacation</option>
                      <option>Sick Leave</option>
                      <option>Personal</option>
                      <option>Emergency</option>
                    </select>
                  </label>

                  <label className="form-label">
                    Start Date
                    <input
                      className="form-input"
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm((s) => ({ ...s, startDate: e.target.value }))}
                    />
                  </label>

                  <label className="form-label">
                    End Date
                    <input
                      className="form-input"
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm((s) => ({ ...s, endDate: e.target.value }))}
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label className="form-label" style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <input
                      type="checkbox"
                      checked={form.partialDay}
                      onChange={(e) => setForm((s) => ({ ...s, partialDay: e.target.checked }))}
                    />
                    Partial day
                  </label>

                  {form.partialDay ? (
                    <>
                      <label className="form-label">
                        From
                        <input
                          className="form-input"
                          type="time"
                          value={form.startTime}
                          onChange={(e) => setForm((s) => ({ ...s, startTime: e.target.value }))}
                        />
                      </label>
                      <label className="form-label">
                        To
                        <input
                          className="form-input"
                          type="time"
                          value={form.endTime}
                          onChange={(e) => setForm((s) => ({ ...s, endTime: e.target.value }))}
                        />
                      </label>
                    </>
                  ) : null}
                </div>

                <div className="form-row">
                  <label className="form-label" style={{ minWidth: "100%" }}>
                    Reason
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Explain your request…"
                      value={form.reason}
                      onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-ghost" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-purple">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
