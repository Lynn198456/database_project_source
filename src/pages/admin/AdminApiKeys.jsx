import { useMemo, useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin/adminApiKeys.css";

export default function AdminApiKeys() {
  const [keys, setKeys] = useState(() => [
    {
      id: "key_1",
      label: "Production",
      masked: "ck_live_••••_A3F9",
      created: "Jan 12, 2025",
      lastUsed: "2 hours ago",
      status: "Active"
    },
    {
      id: "key_2",
      label: "Staging",
      masked: "ck_test_••••_9B12",
      created: "Nov 02, 2024",
      lastUsed: "3 days ago",
      status: "Active"
    }
  ]);

  const total = useMemo(() => keys.length, [keys]);

  function createKey() {
    const nextId = `key_${Date.now()}`;
    const newKey = {
      id: nextId,
      label: `New Key ${total + 1}`,
      masked: "ck_live_••••_NEW",
      created: "Feb 04, 2026",
      lastUsed: "Never",
      status: "Active"
    };
    setKeys((prev) => [newKey, ...prev]);
  }

  function revokeKey(id) {
    if (!confirm("Revoke this API key?")) return;
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  return (
    <div className="ak-page">
      <AdminNavbar />

      <div className="ak-container">
        <header className="ak-header">
          <div>
            <h1>API Access Keys</h1>
            <p>Manage and rotate access keys for integrations.</p>
          </div>
          <button className="ak-primary" onClick={createKey}>
            + Generate New Key
          </button>
        </header>

        <div className="ak-card">
          <div className="ak-summary">Total keys: {total}</div>
          <div className="ak-table">
            <div className="ak-row ak-head">
              <div>Label</div>
              <div>Key</div>
              <div>Created</div>
              <div>Last Used</div>
              <div>Status</div>
              <div>Action</div>
            </div>
            {keys.map((k) => (
              <div key={k.id} className="ak-row">
                <div className="ak-strong">{k.label}</div>
                <div className="ak-mono">{k.masked}</div>
                <div>{k.created}</div>
                <div>{k.lastUsed}</div>
                <div>
                  <span className={`ak-pill ${k.status === "Active" ? "active" : "inactive"}`}>
                    {k.status}
                  </span>
                </div>
                <div>
                  <button className="ak-link" onClick={() => revokeKey(k.id)}>
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
