import "../styles/customer.css";
import "../styles/changePassword.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";

function getUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const user = useMemo(() => getUser() || { email: "john.doe@email.com" }, []);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    if (!current.trim()) return setErr("Please enter your current password.");
    if (next.trim().length < 6) return setErr("New password must be at least 6 characters.");
    if (next !== confirm) return setErr("New password and confirm password do not match.");

    // Demo only (no real auth). You can connect API later.
    setCurrent("");
    setNext("");
    setConfirm("");
    setMsg("Password updated successfully ✅ (demo)");
  }

  return (
    <div className="cf-page">
      <Navbar />
      <main className="cf-mainFull">
        <div className="cf-containerWide">
          <div className="cp-top">
            <button className="cp-back" type="button" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="cp-title">🔒 Change Password</div>
          </div>

          <div className="cp-card">
            <div className="cp-sub">
              For account: <span className="cp-email">{user.email || "—"}</span>
            </div>

            {msg && <div className="cp-msg cp-msgSuccess">{msg}</div>}
            {err && <div className="cp-msg cp-msgError">{err}</div>}

            <form onSubmit={onSubmit} className="cp-form">
              <label className="cp-label">
                Current Password
                <input
                  className="cp-input"
                  type="password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  placeholder="Enter current password"
                />
              </label>

              <label className="cp-label">
                New Password
                <input
                  className="cp-input"
                  type="password"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  placeholder="Enter new password"
                />
              </label>

              <label className="cp-label">
                Confirm New Password
                <input
                  className="cp-input"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Confirm new password"
                />
              </label>

              <div className="cp-actions">
                <button className="cp-btnGhost" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button className="cp-btnPrimary" type="submit">
                  Save Password
                </button>
              </div>

              <div className="cp-tip">
                Tip: Use a long password you can remember. (This page is demo—connect backend later.)
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
