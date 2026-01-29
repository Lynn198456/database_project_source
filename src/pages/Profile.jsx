import "../styles/customer.css";
import "../styles/profileModal.css";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";

function getUser() {
  try {
    const raw = localStorage.getItem("cinemaFlow_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

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
};

export default function Profile() {
  const initialUser = useMemo(() => getUser() || FALLBACK_USER, []);
  const [user, setUser] = useState(initialUser);

  const [editOpen, setEditOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: initialUser.phone || "",
    address: initialUser.address || "",
  });

  useEffect(() => {
    // ESC to close modal
    function onKeyDown(e) {
      if (e.key === "Escape") setEditOpen(false);
    }
    if (editOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editOpen]);

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

  function saveChanges() {
    // simple validation
    if (!form.name.trim()) return alert("Full Name is required.");
    if (!form.email.trim()) return alert("Email is required.");
    if (!form.address.trim()) return alert("Address is required.");

    const updated = {
      ...user,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    localStorage.setItem("cinemaFlow_user", JSON.stringify(updated));
    setUser(updated);
    setEditOpen(false);
    setMsg("Profile updated successfully ✅");
  }

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
                <div className="cf-avatarLarge">👤</div>
                <button className="cf-grayBtn" type="button" onClick={() => alert("Change photo later")}>
                  Change Photo
                </button>
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

                <div className="cf-membership">
                  <div className="cf-membershipHead">
                    🏅 Membership Tier
                    <span className="cf-badgeGold">{user.tier}</span>
                  </div>
                  <div className="cf-progressBar">
                    <div style={{ width: "75%" }} />
                  </div>
                  <p className="cf-muted">{user.points} / 1000 points to Platinum</p>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="cf-statGrid">
              <div className="cf-statCard blue">
                🎬 Movies Watched
                <strong>{user.watched}</strong>
              </div>
              <div className="cf-statCard purple">
                📅 Total Bookings
                <strong>{user.bookings}</strong>
              </div>
              <div className="cf-statCard orange">
                ⭐ Loyalty Points
                <strong>{user.points}</strong>
              </div>
              <div className="cf-statCard green">
                💰 Total Spent
                <strong>${user.spent}.00</strong>
              </div>
            </div>

            {/* ... keep the rest of your page as-is (payment, preferences, etc.) ... */}
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
