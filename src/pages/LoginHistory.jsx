import "../styles/customer.css";
import "../styles/loginHistory.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";

const LS_KEY = "cinemaFlow_loginHistory";

function getUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadLoginHistory() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

function saveLoginHistory(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

// Demo seed (matches your screenshot style)
const SEED_LOGINS = [
  {
    id: "L1",
    device: "Chrome on macOS",
    location: "Bangkok, TH",
    time: "Jan 30, 2026 • 7:45 PM",
    status: "Success",
  },
  {
    id: "L2",
    device: "iPhone Safari",
    location: "Bangkok, TH",
    time: "Jan 28, 2026 • 9:12 AM",
    status: "Success",
  },
  {
    id: "L3",
    device: "Unknown Device",
    location: "Unknown",
    time: "Jan 20, 2026 • 1:02 AM",
    status: "Failed",
  },
];

export default function LoginHistory() {
  const navigate = useNavigate();

  const user = useMemo(() => getUser() || { email: "your@email.com" }, []);
  const [logins, setLogins] = useState(() => loadLoginHistory() || SEED_LOGINS);

  // inline confirm states
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  // persist whenever it changes
  useEffect(() => {
    saveLoginHistory(logins);
  }, [logins]);

  // ESC closes confirmations
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setConfirmClear(false);
        setConfirmRemoveId(null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function clearAll() {
    setLogins([]);
    setConfirmClear(false);
  }

  function removeOne(id) {
    setLogins((prev) => prev.filter((x) => x.id !== id));
    setConfirmRemoveId(null);
  }

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          {/* top header row */}
          <div className="lh-top">
            <button className="lh-back" type="button" onClick={() => navigate(-1)}>
              ←
            </button>

            <div className="lh-title">
              <span className="lh-ico">🕒</span> Login History
            </div>

            <button
              className="lh-clearBtn"
              type="button"
              onClick={() => setConfirmClear(true)}
              disabled={logins.length === 0}
              title={logins.length === 0 ? "Nothing to clear" : "Clear all logins"}
            >
              Clear All
            </button>
          </div>

          {/* account card */}
          <div className="lh-panel">
            <div className="lh-panelHead">Account</div>
            <div className="lh-account">
              <div className="lh-email">{user.email || "—"}</div>
              <div className="lh-muted">
                This list helps you track recent sign-ins to your account.
              </div>
            </div>
          </div>

          {/* inline confirm: clear all */}
          {confirmClear && (
            <div className="lh-confirm">
              <div className="lh-confirmText">Clear all login history?</div>
              <div className="lh-confirmActions">
                <button
                  className="lh-btnCancel"
                  type="button"
                  onClick={() => setConfirmClear(false)}
                >
                  Cancel
                </button>
                <button className="lh-btnDanger" type="button" onClick={clearAll}>
                  Yes, Clear
                </button>
              </div>
            </div>
          )}

          {/* list */}
          <div className="lh-panel">
            <div className="lh-panelHead">Recent Logins</div>

            {logins.length === 0 ? (
              <div className="lh-empty">
                No login history yet.
                <div className="lh-muted" style={{ marginTop: 6 }}>
                  New logins will appear here automatically.
                </div>
              </div>
            ) : (
              <div className="lh-list">
                {logins.map((x) => {
                  const isFailed = String(x.status).toLowerCase() === "failed";
                  return (
                    <div key={x.id} className="lh-row">
                      <div className="lh-left">
                        <div className="lh-device">{x.device}</div>
                        <div className="lh-sub">
                          {x.location} • {x.time}
                        </div>
                      </div>

                      <div className="lh-right">
                        <span className={`lh-pill ${isFailed ? "fail" : "ok"}`}>
                          {x.status}
                        </span>

                        <button
                          className="lh-remove"
                          type="button"
                          onClick={() => setConfirmRemoveId(x.id)}
                          title="Remove this record"
                        >
                          Remove
                        </button>
                      </div>

                      {/* inline confirm: remove one */}
                      {confirmRemoveId === x.id && (
                        <div className="lh-confirmMini">
                          <div className="lh-confirmTextMini">
                            Remove this login record?
                          </div>
                          <div className="lh-confirmActionsMini">
                            <button
                              className="lh-btnCancelMini"
                              type="button"
                              onClick={() => setConfirmRemoveId(null)}
                            >
                              Cancel
                            </button>
                            <button
                              className="lh-btnDangerMini"
                              type="button"
                              onClick={() => removeOne(x.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* safety tip */}
          <div className="lh-panel">
            <div className="lh-panelHead">🔐 Safety Tip</div>
            <div className="lh-muted">
              If you see a login you don’t recognize, change your password immediately.
            </div>

            <button
              className="lh-goBtn"
              type="button"
              onClick={() => navigate("/customer/change-password")}
            >
              Go to Change Password →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
