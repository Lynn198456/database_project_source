import { useMemo, useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin/adminLoginHistory.css";

export default function AdminLoginHistory() {
  const [items] = useState(() => [
    {
      id: 1,
      device: "MacBook Pro • Chrome",
      location: "Bangkok, TH",
      ip: "203.0.113.10",
      time: "2 hours ago",
      status: "Success"
    },
    {
      id: 2,
      device: "iPhone 14 • Safari",
      location: "Bangkok, TH",
      ip: "203.0.113.10",
      time: "Yesterday",
      status: "Success"
    },
    {
      id: 3,
      device: "Unknown • Firefox",
      location: "Chiang Mai, TH",
      ip: "198.51.100.44",
      time: "3 days ago",
      status: "Failed"
    }
  ]);

  const total = useMemo(() => items.length, [items]);

  return (
    <div className="alh-page">
      <AdminNavbar />

      <div className="alh-container">
        <header className="alh-header">
          <div>
            <h1>Login History</h1>
            <p>Review recent admin sign-ins and activity.</p>
          </div>
          <div className="alh-count">Total: {total}</div>
        </header>

        <div className="alh-card">
          <div className="alh-table">
            <div className="alh-row alh-head">
              <div>Device</div>
              <div>Location</div>
              <div>IP</div>
              <div>Time</div>
              <div>Status</div>
            </div>
            {items.map((item) => (
              <div key={item.id} className="alh-row">
                <div className="alh-strong">{item.device}</div>
                <div>{item.location}</div>
                <div className="alh-mono">{item.ip}</div>
                <div>{item.time}</div>
                <div>
                  <span className={`alh-pill ${item.status === "Success" ? "ok" : "fail"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
