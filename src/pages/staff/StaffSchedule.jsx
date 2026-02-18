import { useMemo, useState, useEffect } from "react";
import "../../styles/staff/staffSchedule.css";
import StaffNavbar from "../../components/staff/StaffNavbar";
import {
  createStaffTimeOffRequest,
  deleteStaffTimeOffRequest,
  listStaffSchedules,
  listStaffTimeOffRequests
} from "../../api/staffSchedule";

const REQUEST_TYPES = [
  { label: "Vacation", value: "VACATION" },
  { label: "Sick Leave", value: "SICK" },
  { label: "Personal", value: "PERSONAL" },
  { label: "Other", value: "OTHER" }
];

function getStoredUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function toWeekStart(input = new Date()) {
  const date = new Date(input);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + diff);
  return date;
}

function toDayLabel(date) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
}

function formatTime(timeValue) {
  if (!timeValue) return "";
  const time = String(timeValue).slice(0, 5);
  const [hRaw, mRaw] = time.split(":");
  const hour = Number.parseInt(hRaw, 10);
  const minute = Number.parseInt(mRaw, 10);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;

  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

function toStatusLabel(status) {
  const value = String(status || "").trim().toUpperCase();
  if (!value) return "Pending";
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function toHours(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  const [sH = 0, sM = 0] = String(startTime).split(":").map(Number);
  const [eH = 0, eM = 0] = String(endTime).split(":").map(Number);
  const minutes = eH * 60 + eM - (sH * 60 + sM);
  return minutes > 0 ? minutes / 60 : 0;
}

export default function StaffSchedule() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "VACATION",
    startDate: "",
    endDate: "",
    reason: "",
    partialDay: false,
    startTime: "09:00",
    endTime: "17:00"
  });
  const [schedules, setSchedules] = useState([]);
  const [requests, setRequests] = useState([]);
  const [teamMemberId, setTeamMemberId] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    setEmail(user?.email || "");
  }, []);

  async function refreshData(identityEmail = email, identityTeamMemberId = teamMemberId) {
    if (!identityEmail && !identityTeamMemberId) {
      setLoading(false);
      setError("Please log in as staff to view your schedule.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const [scheduleData, requestData] = await Promise.all([
        listStaffSchedules({ email: identityEmail, teamMemberId: identityTeamMemberId }),
        listStaffTimeOffRequests({ email: identityEmail, teamMemberId: identityTeamMemberId })
      ]);

      setSchedules(scheduleData.schedules || []);
      setRequests(requestData.requests || []);
      setTeamMemberId(scheduleData.teamMemberId || requestData.teamMemberId || null);
    } catch (err) {
      setError(err.message || "Failed to load staff schedule.");
      setSchedules([]);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!email) return;
    refreshData(email, null);
  }, [email]);

  const week = useMemo(() => {
    const weekStart = toWeekStart(new Date());
    const dayMap = new Map();

    for (const item of schedules) {
      const key = String(item.shiftDate || "").slice(0, 10);
      if (!key) continue;
      if (!dayMap.has(key)) dayMap.set(key, []);
      dayMap.get(key).push(item);
    }

    const days = Array.from({ length: 7 }, (_, idx) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + idx);
      const key = date.toISOString().slice(0, 10);
      const shifts = dayMap.get(key) || [];
      const primaryShift = shifts[0] || null;

      return {
        day: toDayLabel(date),
        date: date.getDate(),
        off: shifts.length === 0,
        time: primaryShift ? `${formatTime(primaryShift.startTime)} - ${formatTime(primaryShift.endTime)}` : "",
        role: primaryShift?.roleOnShift || "Shift",
        extraShifts: Math.max(shifts.length - 1, 0),
        totalHours: shifts.reduce((total, shift) => total + toHours(shift.startTime, shift.endTime), 0)
      };
    });

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const label = `Week of ${weekStart.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })} - ${weekEnd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

    return { label, days };
  }, [schedules]);

  const stats = useMemo(() => {
    const totalHours = week.days.reduce((sum, day) => sum + day.totalHours, 0);
    const shifts = schedules.length;
    const daysOff = week.days.filter((day) => day.off).length;

    return { totalHours, shifts, daysOff };
  }, [schedules, week.days]);

  const resetForm = () => {
    setForm({
      type: "VACATION",
      startDate: "",
      endDate: "",
      reason: "",
      partialDay: false,
      startTime: "09:00",
      endTime: "17:00"
    });
  };

  const openModal = () => {
    resetForm();
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  async function submitRequest(e) {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason.trim()) {
      setError("Start date, end date, and reason are required.");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      await createStaffTimeOffRequest({
        email,
        teamMemberId,
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        partialDay: form.partialDay,
        startTime: form.partialDay ? form.startTime : null,
        endTime: form.partialDay ? form.endTime : null,
        reason: form.reason.trim()
      });

      setOpen(false);
      await refreshData(email, teamMemberId);
    } catch (err) {
      setError(err.message || "Failed to submit request.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteRequest(id) {
    try {
      setError("");
      await deleteStaffTimeOffRequest(id, { email, teamMemberId });
      await refreshData(email, teamMemberId);
    } catch (err) {
      setError(err.message || "Failed to delete request.");
    }
  }

  return (
    <>
      <StaffNavbar />

      <div className="staff-page">
        <div className="staff-wrap">
          <div className="section-head">
            <h2>📅 My Schedule</h2>
            <p className="muted">View your upcoming shifts and availability</p>
          </div>

          <div className="schedule-head">
            <div className="week-title">{week.label}</div>
            <button className="btn-blue" onClick={openModal} disabled={!email}>
              Request Time Off
            </button>
          </div>

          {error ? (
            <div style={{ marginBottom: 12, color: "#fecaca", background: "rgba(153,27,27,0.35)", border: "1px solid rgba(248,113,113,0.4)", padding: 10, borderRadius: 10 }}>
              {error}
            </div>
          ) : null}

          <div className="card-surface">
            {loading ? (
              <div className="muted">Loading schedule...</div>
            ) : (
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
                        {d.extraShifts > 0 ? <span>+{d.extraShifts} more shift(s)</span> : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="stats-row">
            <div className="stat-card stat-blue">
              <div className="label">Total Hours This Week</div>
              <div className="value">{Math.round(stats.totalHours * 10) / 10} hours</div>
            </div>

            <div className="stat-card stat-purple">
              <div className="label">Shifts This Week</div>
              <div className="value">{stats.shifts} shifts</div>
            </div>

            <div className="stat-card stat-green">
              <div className="label">Days Off</div>
              <div className="value">{stats.daysOff} days</div>
            </div>
          </div>

          <div style={{ marginTop: 18 }} className="card-surface">
            <div className="schedule-head" style={{ margin: 0 }}>
              <div className="week-title">📝 Time Off Requests</div>
              <div className="muted">{requests.length} total</div>
            </div>

            <div style={{ marginTop: 12 }}>
              {loading ? (
                <div className="muted">Loading requests...</div>
              ) : requests.length === 0 ? (
                <div className="muted">No requests yet. Click "Request Time Off".</div>
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
                        background: "rgba(255,255,255,0.04)"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <b>{String(r.type).replace("_", " ")}</b>
                          <span
                            style={{
                              fontSize: 12,
                              padding: "4px 10px",
                              borderRadius: 999,
                              border: "1px solid rgba(255,255,255,0.14)",
                              background: "rgba(255,255,255,0.06)"
                            }}
                          >
                            {toStatusLabel(r.status)}
                          </span>
                        </div>

                        <div className="muted" style={{ marginTop: 6 }}>
                          {r.startDate} to {r.endDate}
                          {r.partialDay ? (
                            <span>
                              {" "}
                              • Partial: {formatTime(r.startTime)}-{formatTime(r.endTime)}
                            </span>
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
                          cursor: "pointer"
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
                      {REQUEST_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
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
                      placeholder="Explain your request..."
                      value={form.reason}
                      onChange={(e) => setForm((s) => ({ ...s, reason: e.target.value }))}
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-ghost" onClick={closeModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-purple" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Request"}
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
