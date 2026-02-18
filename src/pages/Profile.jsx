// src/pages/Profile.jsx
import "../styles/customer.css";
import "../styles/profileModal.css";
import "../styles/profilePlus.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";
import { getCurrentUser, updateCurrentUser } from "../api/users";
import { getCustomerProfileMetrics } from "../api/customerMetrics";

/* ----------------------------- localStorage helpers ----------------------------- */
function getUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user) {
  localStorage.setItem("cinemaFlow_user", JSON.stringify(user));
}

/* ----------------------------- fallback demo user ----------------------------- */
const FALLBACK_USER = {
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, City, State 12345",
  memberSince: "November 2023",
  tier: "Gold Member",
  points: 750,
  spent: 420,
  bookings: 28,
  watched: 24,

  // preferences
  prefEmail: true,
  prefSMS: false,
  prefPromo: true,
};

function splitName(fullName) {
  const normalized = String(fullName || "").trim().replace(/\s+/g, " ");
  if (!normalized) return { firstName: "", lastName: "" };
  const [firstName, ...rest] = normalized.split(" ");
  return { firstName, lastName: rest.join(" ") || "User" };
}

function toProfileUser(source = {}) {
  const firstName = source.firstName || "";
  const lastName = source.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return {
    name: fullName || source.name || FALLBACK_USER.name,
    email: source.email || FALLBACK_USER.email,
    phone: source.phone || FALLBACK_USER.phone
  };
}

export default function Profile() {
  const navigate = useNavigate();

  /* ----------------------------- user state ----------------------------- */
  const initialUser = useMemo(() => getUser() || FALLBACK_USER, []);
  const [user, setUser] = useState(initialUser);

  // profile photo from database
  const [photo, setPhoto] = useState("");

  // edit profile modal
  const [editOpen, setEditOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: initialUser.phone || "",
    address: initialUser.address || "",
  });

  // preferences state
  const [prefs, setPrefs] = useState({
    prefEmail: !!initialUser.prefEmail,
    prefSMS: !!initialUser.prefSMS,
    prefPromo: !!initialUser.prefPromo,
  });
  const [metrics, setMetrics] = useState({
    watchlistTotal: 0,
    bookingTotal: 0,
    totalSpent: 0
  });
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    const stored = getUser();
    if (!stored?.id && !stored?.email) return;

    async function loadDbUser() {
      try {
        const dbUser = await getCurrentUser({ id: stored?.id, email: stored?.email });
        const fromDb = toProfileUser(dbUser);

        setUser((prev) => ({ ...prev, ...fromDb }));
        setPhoto(dbUser.profilePhoto || "");
        setForm((prev) => ({
          ...prev,
          name: fromDb.name,
          email: fromDb.email,
          phone: fromDb.phone
        }));

        saveUser({
          ...(stored || {}),
          id: dbUser.id,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          email: dbUser.email,
          phone: dbUser.phone || "",
          role: dbUser.role,
          name: fromDb.name,
          profilePhoto: dbUser.profilePhoto || ""
        });
      } catch (_error) {
      }
    }

    loadDbUser();
  }, []);

  useEffect(() => {
    const stored = getUser();
    if (!stored?.id && !stored?.email) {
      setMetricsLoading(false);
      return;
    }

    async function loadMetrics() {
      try {
        setMetricsLoading(true);
        const data = await getCustomerProfileMetrics({ id: stored?.id, email: stored?.email });
        setMetrics({
          watchlistTotal: Number(data.watchlistTotal || 0),
          bookingTotal: Number(data.bookingTotal || 0),
          totalSpent: Number(data.totalSpent || 0)
        });
      } catch (_error) {
        setMetrics({
          watchlistTotal: 0,
          bookingTotal: 0,
          totalSpent: 0
        });
      } finally {
        setMetricsLoading(false);
      }
    }

    loadMetrics();
  }, []);

  /* ----------------------------- ESC closes modals ----------------------------- */
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setEditOpen(false);
      }
    }
    if (editOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editOpen]);

  /* ----------------------------- profile edit handlers ----------------------------- */
  function openEdit() {
    setMsg("");
    const u = getUser() || user || FALLBACK_USER;
    setForm({
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      address: u.address || "",
    });
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function saveChanges() {
    if (!form.name.trim()) return alert("Full Name is required.");
    if (!form.email.trim()) return alert("Email is required.");
    if (!form.address.trim()) return alert("Address is required.");

    const localUpdated = {
      ...user,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),

      // keep preferences
      prefEmail: prefs.prefEmail,
      prefSMS: prefs.prefSMS,
      prefPromo: prefs.prefPromo,
    };

    const stored = getUser();
    const identity = { id: stored?.id, email: stored?.email || form.email.trim() };
    const { firstName, lastName } = splitName(form.name);

    try {
      const dbUser = await updateCurrentUser(identity, {
        firstName,
        lastName,
        phone: form.phone.trim()
      });

      saveUser({
        ...(stored || {}),
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        phone: dbUser.phone || "",
        role: dbUser.role,
        name: `${dbUser.firstName} ${dbUser.lastName}`.trim()
      });
      setUser(localUpdated);
      setEditOpen(false);
      setMsg("Profile updated successfully ✅");
    } catch (error) {
      alert(error.message || "Failed to update profile.");
    }
  }

  function updatePref(key, value) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);

    const updated = { ...user, ...next };
    saveUser(updated);
    setUser(updated);
  }

  /* ----------------------------- photo upload (future-ready) ----------------------------- */
  function onPickPhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic file type guard
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || "");

      try {
        const stored = getUser();
        const dbUser = await updateCurrentUser(
          { id: stored?.id, email: stored?.email || user.email },
          { profilePhoto: dataUrl }
        );

        setPhoto(dbUser.profilePhoto || dataUrl);
        saveUser({
          ...(stored || {}),
          id: dbUser.id,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          email: dbUser.email,
          phone: dbUser.phone || "",
          role: dbUser.role,
          profilePhoto: dbUser.profilePhoto || dataUrl
        });
        setMsg("Profile photo updated ✅");
      } catch (error) {
        alert(error.message || "Failed to save profile photo.");
      }
    };
    reader.readAsDataURL(file);

    // allow re-select same file later
    e.target.value = "";
  }

  async function removePhoto() {
    const ok = window.confirm("Remove your profile photo?");
    if (!ok) return;

    try {
      const stored = getUser();
      const dbUser = await updateCurrentUser(
        { id: stored?.id, email: stored?.email || user.email },
        { profilePhoto: "" }
      );

      setPhoto("");
      saveUser({
        ...(stored || {}),
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        phone: dbUser.phone || "",
        role: dbUser.role,
        profilePhoto: ""
      });
      setMsg("Profile photo removed ✅");
    } catch (error) {
      alert(error.message || "Failed to remove profile photo.");
    }
  }

  /* ----------------------------- UI ----------------------------- */
  return (
    <div className="cf-containerWide">
      <div className="cf-page">
        <Navbar />

        <main className="cf-mainFull">
          <div className="cf-container">
            {/* HEADER */}
            <div className="cf-profileHeader">
              <div className="cf-profileTitle">
                <span className="cf-iconOrange">👤</span>
                My Profile
              </div>
              <button className="cf-blueBtn" type="button" onClick={openEdit}>
                ✏️ Edit Profile
              </button>
            </div>

            {msg && (
              <div
                style={{
                  margin: "10px 0",
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(34,197,94,.15)",
                  border: "1px solid rgba(34,197,94,.25)",
                  color: "rgba(220,255,235,.95)",
                  fontWeight: 800,
                }}
              >
                {msg}
              </div>
            )}

            {/* PROFILE CARD */}
            <div className="cf-profileMain">
              <div className="cf-profileAvatarBlock">
                <div className="cf-avatarLarge" style={{ overflow: "hidden" }}>
                  {photo ? (
                    <img
                      src={photo}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    "👤"
                  )}
                </div>

                {/* spacing: give button margin-top */}
                <div style={{ marginTop: 14, width: "100%" }}>
                  <label className="cf-grayBtn" style={{ display: "block", textAlign: "center", cursor: "pointer" }}>
                    Change Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onPickPhoto}
                      style={{ display: "none" }}
                    />
                  </label>

                  {photo && (
                    <button
                      className="cf-grayBtn"
                      type="button"
                      onClick={removePhoto}
                      style={{ marginTop: 10 }}
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              <div className="cf-profileInfo">
                <h2>{user.name}</h2>
                <p className="cf-muted">Member since {user.memberSince}</p>

                <div className="cf-infoGrid">
                  <div className="cf-infoBox">
                    📧 <span>{user.email}</span>
                  </div>
                  <div className="cf-infoBox">
                    📞 <span>{user.phone}</span>
                  </div>
                  <div className="cf-infoBox wide">
                    📍 <span>{user.address}</span>
                  </div>
                </div>

              </div>
            </div>

            {/* STATS */}
            <div className="cf-statGrid">
              <div
                className="cf-statCard blue"
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/customer/watchlist")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer/watchlist")}
                title="View My Watchlist"
              >
                ⭐ My Watchlist
                <strong>{metricsLoading ? "..." : metrics.watchlistTotal}</strong>
              </div>

              <div
                className="cf-statCard purple"
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/customer/booking-history")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer/booking-history")}
                title="View Booking History"
              >
                📅 Total Bookings
                <strong>{metricsLoading ? "..." : metrics.bookingTotal}</strong>
              </div>

              <div
                className="cf-statCard green"
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/customer/spending-history")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer/spending-history")}
                title="View Spending History"
              >
                💰 Total Spent
                <strong>{metricsLoading ? "..." : `฿${metrics.totalSpent.toFixed(2)}`}</strong>
              </div>
            </div>

            {/* PREFERENCES */}
            <div className="pf-row2">
              <div className="pf-panel">
                <div className="pf-panelHead">
                  <div className="pf-panelTitle">
                    <span className="pf-ico">⚙️</span> Preferences
                  </div>
                </div>

                <div className="pf-toggleCard">
                  <div className="pf-toggleLeft">
                    <span className="pf-icoSmall">🔔</span>
                    <div className="pf-toggleText">Email Notifications</div>
                  </div>
                  <label className="pf-switch">
                    <input
                      type="checkbox"
                      checked={prefs.prefEmail}
                      onChange={(e) => updatePref("prefEmail", e.target.checked)}
                    />
                    <span className="pf-slider" />
                  </label>
                </div>

                <div className="pf-toggleCard">
                  <div className="pf-toggleLeft">
                    <span className="pf-icoSmall">📳</span>
                    <div className="pf-toggleText">SMS Notifications</div>
                  </div>
                  <label className="pf-switch">
                    <input
                      type="checkbox"
                      checked={prefs.prefSMS}
                      onChange={(e) => updatePref("prefSMS", e.target.checked)}
                    />
                    <span className="pf-slider" />
                  </label>
                </div>

                <div className="pf-toggleCard">
                  <div className="pf-toggleLeft">
                    <span className="pf-icoSmall">✉️</span>
                    <div className="pf-toggleText">Promotional Emails</div>
                  </div>
                  <label className="pf-switch">
                    <input
                      type="checkbox"
                      checked={prefs.prefPromo}
                      onChange={(e) => updatePref("prefPromo", e.target.checked)}
                    />
                    <span className="pf-slider" />
                  </label>
                </div>
              </div>
            </div>

            {/* SECURITY SETTINGS */}
            <div className="pf-secList">
              <div
                className="pf-secRow"
                role="button"
                tabIndex={0}
                onClick={() => navigate("/customer/change-password")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer/change-password")}
              >
                <div>Change Password</div>
                <div className="pf-secIcon">✏️</div>
              </div>

              <div className="pf-secRow">
                <div>Two-Factor Authentication</div>
                <div className="pf-pillGreen">Enabled</div>
              </div>

              <div
                className="pf-secRow"
                role="button"
                tabIndex={0}
                onClick={() => navigate("/customer/login-history")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer/login-history")}
              >
                <div>Login History</div>
                <div className="pf-secIcon">📜</div>
              </div>
            </div>

            {/* ACTION BUTTONS */}

          </div>
        </main>

        <Footer />

        {/* ✅ EDIT PROFILE MODAL */}
        {editOpen && (
          <div className="ep-overlay" onMouseDown={closeEdit}>
            <div className="ep-card" onMouseDown={(e) => e.stopPropagation()}>
              <div className="ep-head">
                <div className="ep-title">
                  <span className="ep-icon">✏️</span>
                  Edit Profile
                </div>
                <button className="ep-x" onClick={closeEdit} type="button" aria-label="Close">
                  ✕
                </button>
              </div>

              <div className="ep-form">
                <div className="ep-field">
                  <div className="ep-label">Full Name</div>
                  <input
                    className="ep-input"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="John Doe"
                  />
                </div>

                <div className="ep-field">
                  <div className="ep-label">Email Address</div>
                  <input
                    className="ep-input"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="john.doe@email.com"
                  />
                </div>

                <div className="ep-field">
                  <div className="ep-label">Phone Number</div>
                  <input
                    className="ep-input"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="ep-field">
                  <div className="ep-label">Address</div>
                  <textarea
                    className="ep-textarea"
                    name="address"
                    value={form.address}
                    onChange={onChange}
                    placeholder="123 Main Street, City, State 12345"
                    rows={3}
                  />
                </div>
              </div>

              <div className="ep-actions">
                <button className="ep-btn ep-btnGhost" onClick={closeEdit} type="button">
                  Cancel
                </button>
                <button className="ep-btn ep-btnPrimary" onClick={saveChanges} type="button">
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
