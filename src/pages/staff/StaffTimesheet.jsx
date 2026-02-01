import "../../styles/staffTimesheet.css";

export default function StaffTimesheet() {
  const weekSummary = [
    { day: "Mon", hours: "8h", status: "completed" },
    { day: "Tue", hours: "7.5h", status: "completed" },
    { day: "Wed", hours: "8h", status: "current" },
    { day: "Thu", hours: "0h", status: "scheduled" },
    { day: "Fri", hours: "0h", status: "scheduled" },
    { day: "Sat", hours: "0h", status: "off" },
    { day: "Sun", hours: "0h", status: "off" },
  ];

  const entries = [
    {
      date: "Nov 25",
      in: "09:00 AM",
      out: "05:00 PM",
      hours: "8.0",
      position: "Box Office",
      status: "approved",
    },
    {
      date: "Nov 24",
      in: "02:00 PM",
      out: "09:30 PM",
      hours: "7.5",
      position: "Floor Staff",
      status: "approved",
    },
    {
      date: "Nov 23",
      in: "09:00 AM",
      out: "05:00 PM",
      hours: "8.0",
      position: "Box Office",
      status: "pending",
    },
  ];

  return (
    <div className="staff-page">
      <main className="staff-container">
        {/* HEADER */}
        <div className="section-head">
          <h2>🕒 My Timesheet</h2>
          <p className="muted">Track your hours and earnings</p>
        </div>

        {/* WEEK OVERVIEW */}
        <div className="staff-card">
          <h3 className="card-title">📈 This Week</h3>

          <div className="week-hours">
            {weekSummary.map((d) => (
              <div key={d.day} className="week-hour-card">
                <strong>{d.day}</strong>
                <div className="week-hours-value">{d.hours}</div>
                <span className={`pill ${d.status}`}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* TIME ENTRIES */}
        <div className="staff-card">
          <h3 className="card-title">📋 Time Entries</h3>

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
                    <span className={`pill ${e.status}`}>{e.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="staff-footer">
          © 2025 CinemaFlow Staff Portal
        </div>
      </main>
    </div>
  );
}
