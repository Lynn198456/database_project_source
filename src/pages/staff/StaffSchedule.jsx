import { useMemo } from "react";
import StaffNavbar from "../../components/staff/StaffNavbar";
import "../../styles/staffSchedule.css";

// ---- staff loader (same idea as dashboard) ----
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

export default function StaffSchedule() {
  const staff = useMemo(() => getStaff() || FALLBACK_STAFF, []);

  const week = {
    label: "Week of Nov 25 - Dec 1, 2025",
    days: [
      { day: "Mon", date: "25", time: "09:00 - 17:00", role: "Box Office" },
      { day: "Tue", date: "26", time: "14:00 - 22:00", role: "Floor Staff" },
      { day: "Wed", date: "27", time: "09:00 - 17:00", role: "Box Office" },
      { day: "Thu", date: "28", time: "14:00 - 22:00", role: "Floor Staff" },
      { day: "Fri", date: "29", time: "09:00 - 17:00", role: "Box Office" },
      { day: "Sat", date: "30", off: true },
      { day: "Sun", date: "31", off: true },
    ],
  };

  return (
    <div className="staff-page">
      {/* ✅ NAVBAR */}
      <StaffNavbar staff={staff} />

      {/* ✅ CONTENT */}
      <main className="staff-container">
        <div className="staff-wrap">
          {/* HEADER */}
          <div className="section-head">
            <h2>📅 My Schedule</h2>
            <p className="muted">View your upcoming shifts and availability</p>
          </div>

          {/* WEEK CARD */}
          <div className="staff-card">
            <div className="schedule-head">
              <h3>{week.label}</h3>
              <button
                className="btn-blue"
                onClick={() => alert("Request time off later")}
              >
                Request Time Off
              </button>
            </div>

            <div className="week-grid">
              {week.days.map((d) => (
                <div key={d.day} className={`day-card ${d.off ? "off" : ""}`}>
                  <div className="day-top">
                    <strong>{d.day}</strong>
                    <span>{d.date}</span>
                  </div>

                  {d.off ? (
                    <div className="day-off">OFF</div>
                  ) : (
                    <div className="shift-box">
                      <strong>{d.time}</strong>
                      <span>{d.role}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          <div className="overview-grid" style={{ marginTop: 24 }}>
            <div className="ov blue">
              <p>Total Hours This Week</p>
              <h2>40 hours</h2>
            </div>
            <div className="ov purple">
              <p>Shifts This Week</p>
              <h2>5 shifts</h2>
            </div>
            <div className="ov green">
              <p>Days Off</p>
              <h2>2 days</h2>
            </div>
          </div>

          <div className="staff-footer">© 2025 CinemaFlow Staff Portal</div>
        </div>
      </main>
    </div>
  );
}
