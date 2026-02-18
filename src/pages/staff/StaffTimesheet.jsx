import { useEffect, useMemo, useState } from "react";
import "../../styles/staff/staffTimesheet.css";
import StaffNavbar from "../../components/staff/StaffNavbar";
import { listStaffTimeRecords } from "../../api/staffTimeRecords";

function getAuthUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function getWeekRange(baseDate = new Date()) {
  const date = new Date(baseDate);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(date);
  start.setDate(start.getDate() + diffToMonday);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return { start, end };
}

function format12HourFromIso(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "-";

  const hour = date.getHours();
  const minute = date.getMinutes();
  const suffix = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${String(h12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function calcHours(clockInAt, clockOutAt, breakMinutes) {
  if (!clockInAt || !clockOutAt) return 0;
  const start = new Date(clockInAt).getTime();
  const end = new Date(clockOutAt).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;

  const totalMinutes = Math.max(0, Math.round((end - start) / 60000) - Math.max(0, breakMinutes || 0));
  return totalMinutes / 60;
}

function statusMeta(status, isFutureDay, hasRecord) {
  if (!hasRecord) {
    if (isFutureDay) return { status: "Scheduled", color: "orange" };
    return { status: "Off", color: "gray" };
  }

  if (status === "CLOCKED_IN") return { status: "Current", color: "blue" };
  if (status === "COMPLETED") return { status: "Completed", color: "green" };
  if (status === "MISSED") return { status: "Missed", color: "orange" };
  if (status === "ABSENT") return { status: "Absent", color: "gray" };
  return { status: "Completed", color: "green" };
}

export default function StaffTimesheet() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const authUser = useMemo(() => getAuthUser(), []);

  const weekInfo = useMemo(() => {
    const { start, end } = getWeekRange(new Date());
    return {
      start,
      end,
      weekLabel: "This Week",
      range: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}`
    };
  }, []);

  useEffect(() => {
    async function load() {
      if (!authUser?.email) {
        setLoading(false);
        setError("Please log in as staff to view timesheet.");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await listStaffTimeRecords({
          email: authUser.email,
          from: toDateKey(weekInfo.start),
          to: toDateKey(weekInfo.end),
          limit: 100
        });
        setRecords(data.records || []);
      } catch (err) {
        setRecords([]);
        setError(err.message || "Failed to load timesheet.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authUser?.email, weekInfo.start, weekInfo.end]);

  const data = useMemo(() => {
    const mapByDate = new Map();
    records.forEach((record) => {
      if (record.workDate) mapByDate.set(record.workDate, record);
    });

    const days = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(weekInfo.start);
      d.setDate(weekInfo.start.getDate() + i);

      const key = toDateKey(d);
      const record = mapByDate.get(key);
      const isFutureDay = d > new Date(new Date().setHours(23, 59, 59, 999));
      const meta = statusMeta(record?.status, isFutureDay, Boolean(record));
      const hours = calcHours(record?.clockInAt, record?.clockOutAt, record?.breakMinutes);

      days.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.toLocaleDateString("en-US", { day: "2-digit" }),
        hours,
        status: meta.status,
        color: meta.color,
        in: format12HourFromIso(record?.clockInAt),
        out: format12HourFromIso(record?.clockOutAt),
        breakMins: record?.breakMinutes || 0
      });
    }

    return {
      weekLabel: weekInfo.weekLabel,
      range: weekInfo.range,
      days
    };
  }, [records, weekInfo]);

  const totalHours = data.days.reduce((sum, d) => sum + (Number(d.hours) || 0), 0);
  const completedCount = data.days.filter((d) => d.status === "Completed").length;
  const pendingCount = data.days.filter((d) => d.status === "Scheduled" || d.status === "Current").length;
  const overtime = Math.max(0, totalHours - 40);

  const exportToCSV = () => {
    const headers = ["Day", "Date", "Clock In", "Clock Out", "Break (mins)", "Total Hours", "Status"];

    const rows = data.days.map((d) => [d.day, d.date, d.in, d.out, d.breakMins, d.hours.toFixed(2), d.status]);

    const csvContent = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Cinema_Listic_Timesheet_${data.range.replace(/\s/g, "_")}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <StaffNavbar />

      <div className="ts-page">
        <div className="ts-wrap">
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

          {error ? <div className="ts-miniMuted" style={{ marginBottom: 12, color: "#fecaca" }}>{error}</div> : null}

          <div className="ts-summary">
            <div className="ts-card blue">
              <div className="ts-cardLabel">Total Hours</div>
              <div className="ts-cardValue">{loading ? "..." : `${totalHours.toFixed(1)}h`}</div>
              <div className="ts-cardNote">Week-to-date</div>
            </div>

            <div className="ts-card purple">
              <div className="ts-cardLabel">Completed Days</div>
              <div className="ts-cardValue">{loading ? "..." : completedCount}</div>
              <div className="ts-cardNote">Logged shifts</div>
            </div>

            <div className="ts-card orange">
              <div className="ts-cardLabel">Scheduled</div>
              <div className="ts-cardValue">{loading ? "..." : pendingCount}</div>
              <div className="ts-cardNote">Upcoming or active</div>
            </div>

            <div className="ts-card green">
              <div className="ts-cardLabel">Overtime</div>
              <div className="ts-cardValue">{loading ? "..." : `${overtime.toFixed(1)}h`}</div>
              <div className="ts-cardNote">{overtime > 0 ? "Above 40h" : "No overtime"}</div>
            </div>
          </div>

          <div className="ts-section">
            <div className="ts-sectionHead">
              <h3>📅 Daily Hours</h3>
              <div className="ts-miniMuted">Data from recordtime_setup.sql</div>
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

                  <div className="ts-hours">{d.hours.toFixed(1)}h</div>
                  <div className="ts-dayMeta">
                    <span>In: {d.in}</span>
                    <span>Out: {d.out}</span>
                    <span>Break: {d.breakMins}m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ts-section">
            <div className="ts-sectionHead">
              <h3>📋 Timesheet Details</h3>
              <button className="ts-btn" onClick={exportToCSV}>⬇ Export CSV</button>
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
                      <td>{d.hours.toFixed(1)}h</td>
                      <td>
                        <span className={`ts-status ${d.color}`}>{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="ts-footer">© 2025 Cinema Listic Staff Portal</div>
        </div>
      </div>
    </>
  );
}
