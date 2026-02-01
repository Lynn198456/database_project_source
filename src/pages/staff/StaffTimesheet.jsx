import { useMemo } from "react";
import StaffNavbar from "../../components/staff/StaffNavbar";
import "../../styles/staffTimesheet.css";

// ---- staff loader (same pattern everywhere) ----
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

export default function StaffTimesheet() {
  const staff = useMemo(() => getStaff() || FALLBACK_STAFF, []);

  const weekSummary = [
    { day: "Mon", hours: "8h", status: "Completed" },
    { day: "Tue", hours: "7.5h", status: "Completed" },
    { day: "Wed", hours: "8h", status: "Current" },
    { day: "Thu", hours: "0h", status: "Scheduled" },
    { day: "Fri", hours: "0h", status: "Scheduled" },
    { day: "Sat", hours: "0h", status: "Off" },
    { day: "Sun", hours: "0h", status: "Off" },
  ];

  const entries = [
    {
      date: "Nov 25",
      in: "09:00 AM",
      out: "05:00 PM",
      hours: "8.0",
      position: "Box Office",
      status: "Approved",
    },
    {
      date: "Nov 24",
      in: "02:00 PM",
      out: "09:30 PM",
      hours: "7.5",
      position: "Floor Staff",
      status: "Approved",
    },
    {
      date: "Nov 23",
      in: "09:00 AM",
      out: "05:00 PM",
      hours: "8.0",
      position: "Box Office",
      status: "Pending",
    },
  ];

  return (
    <div className="staff-page">
      {/* ✅ NAVBAR */}
      <StaffNavbar staff={staff} />

      {/* ✅ CONTENT */}
      <main className="staff-container">
        <div className="staff-wrap">
          {/* HEADER */}
          <div className="section-head">
            <h2>🕒 My Timesheet</h2>
            <p className="muted">Track your hours and earnings</p>
          </div>

          {/* WEEK OVERVIEW */}
          <div className="staff-card">
            <h3>📊 This Week</h3>

            <div className="week-summary">
              {weekSummary.map((d) => (
                <div key={d.day} className={`day-summary ${d.status.toLowerCase()}`}>
                  <strong>{d.day}</strong>
                  <span>{d.hours}</span>
                  <small>{d.status}</small>
                </div>
              ))}
            </div>
          </div>

          {/* TIME ENTRIES */}
          <div className="staff-card">
            <h3>📋 Time Entries</h3>

            <div className="table-wrap">
              <table className="timesheet-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Hours</th>
                    <th>Position</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={i}>
                      <td>{e.date}</td>
                      <td>{e.in}</td>
                      <td>{e.out}</td>
                      <td>{e.hours}</td>
                      <td>{e.position}</td>
                      <td>
                        <span className={`status ${e.status.toLowerCase()}`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="staff-footer">© 2025 CinemaFlow Staff Portal</div>
        </div>
      </main>
    </div>
  );
}
