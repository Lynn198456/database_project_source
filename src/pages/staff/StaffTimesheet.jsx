import { useMemo } from "react";
import "../../styles/staff/staffTimesheet.css";
import StaffNavbar from "../../components/staff/StaffNavbar";

export default function StaffTimesheet() {
  const data = useMemo(
    () => ({
      weekLabel: "This Week",
      range: "Nov 25 - Dec 1, 2025",
      days: [
        { day: "Mon", date: "25", hours: 8, status: "Completed", color: "green", in: "09:00", out: "17:00", breakMins: 30 },
        { day: "Tue", date: "26", hours: 7.5, status: "Completed", color: "green", in: "14:00", out: "22:00", breakMins: 30 },
        { day: "Wed", date: "27", hours: 8, status: "Current", color: "blue", in: "09:00", out: "17:00", breakMins: 30 },
        { day: "Thu", date: "28", hours: 0, status: "Scheduled", color: "orange", in: "14:00", out: "22:00", breakMins: 30 },
        { day: "Fri", date: "29", hours: 0, status: "Scheduled", color: "orange", in: "09:00", out: "17:00", breakMins: 30 },
        { day: "Sat", date: "30", hours: 0, status: "Off", color: "gray", in: "-", out: "-", breakMins: 0 },
        { day: "Sun", date: "31", hours: 0, status: "Off", color: "gray", in: "-", out: "-", breakMins: 0 },
      ],
    }),
    []
  );

  const totalHours = data.days.reduce((sum, d) => sum + (Number(d.hours) || 0), 0);
  const completedCount = data.days.filter((d) => d.status === "Completed").length;
  const pendingCount = data.days.filter((d) => d.status === "Scheduled").length;
  const overtime = Math.max(0, totalHours - 40);
  const exportToCSV = () => {
  const headers = [
    "Day",
    "Date",
    "Clock In",
    "Clock Out",
    "Break (mins)",
    "Total Hours",
    "Status",
  ];

  const rows = data.days.map((d) => [
    d.day,
    d.date,
    d.in,
    d.out,
    d.breakMins,
    d.hours,
    d.status,
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) => row.map((v) => `"${v}"`).join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `CinemaFlow_Timesheet_${data.range.replace(/ /g, "_")}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};

  return (
    <>
      <StaffNavbar />

      <div className="ts-page">
        <div className="ts-wrap">
          {/* Header */}
          <div className="ts-head">
            <div>
              <h2 className="ts-title">🧾 Timesheet</h2>
              <p className="ts-sub">Track your weekly hours, shifts, and timesheet status</p>
            </div>

            <div className="ts-weekBadge">
              <div className="ts-weekName">{data.weekLabel}</div>
              <div className="ts-weekRange">{data.range}</div>
            </div>
          </div>

          {/* Summary */}
          <div className="ts-summary">
            <div className="ts-card blue">
              <div className="ts-cardLabel">Total Hours</div>
              <div className="ts-cardValue">{totalHours.toFixed(1)}h</div>
              <div className="ts-cardNote">Week-to-date</div>
            </div>

            <div className="ts-card purple">
              <div className="ts-cardLabel">Completed Days</div>
              <div className="ts-cardValue">{completedCount}</div>
              <div className="ts-cardNote">Logged shifts</div>
            </div>

            <div className="ts-card orange">
              <div className="ts-cardLabel">Scheduled</div>
              <div className="ts-cardValue">{pendingCount}</div>
              <div className="ts-cardNote">Upcoming shifts</div>
            </div>

            <div className="ts-card green">
              <div className="ts-cardLabel">Overtime</div>
              <div className="ts-cardValue">{overtime.toFixed(1)}h</div>
              <div className="ts-cardNote">{overtime > 0 ? "Above 40h" : "No overtime"}</div>
            </div>
          </div>

          {/* Week cards */}
          <div className="ts-section">
            <div className="ts-sectionHead">
              <h3>📅 Daily Hours</h3>
              <div className="ts-miniMuted">Tap a day to review details (UI demo)</div>
            </div>

            <div className="ts-daysGrid">
              {data.days.map((d) => (
                <div key={d.day} className={`ts-dayCard ${d.color}`}>
                  <div className="ts-dayTop">
                    <div>
                      <div className="ts-dayName">{d.day}</div>
                      <div className="ts-dayDate">{d.date}</div>
                    </div>
                    <div className={`ts-pill ${d.color}`}>{d.status}</div>
                  </div>

                  <div className="ts-hours">{d.hours}h</div>
                  <div className="ts-dayMeta">
                    <span>In: {d.in}</span>
                    <span>Out: {d.out}</span>
                    <span>Break: {d.breakMins}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="ts-section">
            <div className="ts-sectionHead">
              <h3>📋 Timesheet Details</h3>
              <button className="ts-btn" onClick={exportToCSV}>
  ⬇ Export CSV
</button>

            </div>

            <div className="ts-tableWrap">
              <table className="ts-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Break</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.days.map((d) => (
                    <tr key={`${d.day}-row`}>
                      <td>
                        <div className="ts-tdDay">
                          <span className="ts-tdDayName">{d.day}</span>
                          <span className="ts-tdDayDate">{d.date}</span>
                        </div>
                      </td>
                      <td>{d.in}</td>
                      <td>{d.out}</td>
                      <td>{d.breakMins}m</td>
                      <td>{d.hours}h</td>
                      <td>
                        <span className={`ts-status ${d.color}`}>{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ts-footer">© 2025 CinemaFlow Staff Portal</div>
        </div>
      </div>
    </>
  );
}
