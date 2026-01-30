import "../styles/customer.css";
import "../styles/profileModal.css";
import "../styles/profilePlus.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // preferences
  prefEmail: true,
  prefSMS: false,
  prefPromo: true,
};

export default function Profile() {
  const navigate = useNavigate();

  const initialUser = useMemo(() => getUser() || FALLBACK_USER, []);
  const [user, setUser] = useState(initialUser);

  // Handle profile photo change
  function handlePhotoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
      const updated = { ...user, photo: event.target.result };
      localStorage.setItem("cinemaFlow_user", JSON.stringify(updated));
      setUser(updated);
    };
    reader.readAsDataURL(file);
  }

  const [editOpen, setEditOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: initialUser.phone || "",
    address: initialUser.address || "",
  });

  // local preference state (so UI updates instantly)
  const [prefs, setPrefs] = useState({
    prefEmail: !!initialUser.prefEmail,
    prefSMS: !!initialUser.prefSMS,
    prefPromo: !!initialUser.prefPromo,
  });

  useEffect(() => {
    // ESC closes modal
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
    if (!form.name.trim()) return alert("Full Name is required.");
    if (!form.email.trim()) return alert("Email is required.");
    if (!form.address.trim()) return alert("Address is required.");

    const updated = {
      ...user,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),

      // keep preferences too
      prefEmail: prefs.prefEmail,
      prefSMS: prefs.prefSMS,
      prefPromo: prefs.prefPromo,
    };

    localStorage.setItem("cinemaFlow_user", JSON.stringify(updated));
    setUser(updated);
    setEditOpen(false);
    setMsg("Profile updated successfully ✅");
  }

  function updatePref(key, value) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);

    // save immediately to localStorage (nice UX)
    const updated = { ...user, ...next };
    localStorage.setItem("cinemaFlow_user", JSON.stringify(updated));
    setUser(updated);
  }
  const [cards, setCards] = useState(() => {
  try {
    const raw = localStorage.getItem("cinemaFlow_cards");
    return raw
      ? JSON.parse(raw)
      : [
          { id: 1, brand: "Visa", last4: "4242", exp: "12/2025", isDefault: true },
          { id: 2, brand: "Mastercard", last4: "8888", exp: "08/2026", isDefault: false },
        ];
  } catch {
    return [];
  }
});

  function saveCards(next) {
    setCards(next);
    localStorage.setItem("cinemaFlow_cards", JSON.stringify(next));
  }

  function setDefaultCard(id) {
    const next = cards.map((c) => ({
      ...c,
      isDefault: c.id === id,
    }));
    saveCards(next);
  }

  function removeCard(id) {
    if (cards.length === 1) {
      alert("You must have at least one payment method.");
      return;
    }

    const ok = window.confirm("Remove this payment method?");
    if (!ok) return;

    let next = cards.filter((c) => c.id !== id);

    // if default card was removed → set first as default
    if (!next.some((c) => c.isDefault)) {
      next[0].isDefault = true;
    }

    saveCards(next);
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
              <div className="cf-profileTop">
            <div className="cf-profileAvatarBlock">
              <div className="cf-avatarLarge">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Profile"
                    className="cf-avatarImg"
                  />
                ) : (
                  <span>👤</span>
                )}
              </div>

              <label className="cf-grayBtn">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoChange}
                />
              </label>
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
              <div
                className="cf-statCard blue"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/customer/movies-watched")}
                title="View Movies Watched"
              >
                🎬 Movies Watched
                <strong>{user.watched}</strong>
              </div>

              <div
                className="cf-statCard purple"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/customer/booking-history")}
                title="View Booking History"
              >
                📅 Total Bookings
                <strong>{user.bookings}</strong>
              </div>


              <div
                className="cf-statCard orange"
                role="button"
                tabIndex={0}
                onClick={() => navigate("/customer/loyalty")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer/loyalty")}
                style={{ cursor: "pointer" }}
                >
                ⭐ Loyalty Points
                <strong>{user.points}</strong>
              </div>


              <div
                className="cf-statCard green"
                role="button"
                tabIndex={0}
                title="View Spending History"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/customer/spending-history")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate("/customer/spending-history");
                  }
                }}
              >
                💰 Total Spent
              </div>
            </div>

            {/* PAYMENT + PREFERENCES */}
            <div className="pf-row2">
              {/* Payment Methods */}
<div className="pf-panel">
  <div className="pf-panelHead">
    <div className="pf-panelTitle">
      <span className="pf-ico">💳</span> Payment Methods
    </div>
    <button
      className="pf-btnBlue"
      type="button"
      onClick={() => alert("Add card later")}
    >
      Add New
    </button>
  </div>

  {cards.map((card) => (
    <div
      key={card.id}
      className={`pf-payCard ${card.isDefault ? "pf-payCard--active" : ""}`}
    >
      <div className="pf-payTop">
        <div className="pf-payName">
          {card.brand} •••• {card.last4}
        </div>
        {card.isDefault && <span className="pf-pillGreen">Default</span>}
      </div>

      <div className="pf-paySub">Expires {card.exp}</div>

      <div className="pf-payActions">
        {!card.isDefault && (
          <button
            className="pf-payBtn"
            type="button"
            onClick={() => setDefaultCard(card.id)}
          >
            ⭐ Set Default
          </button>
        )}

        <button
          className="pf-payBtn pf-payBtnDanger"
          type="button"
          onClick={() => removeCard(card.id)}
        >
          🗑 Remove
        </button>
      </div>
    </div>
  ))}
</div>

              {/* Preferences */}
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

            {/* FAVORITE THEATERS */}
            <div className="pf-panel pf-panelFull">
              <div className="pf-panelHead">
                <div className="pf-panelTitle">
                  <span className="pf-ico">📍</span> Favorite Theaters
                </div>
                <button
                  className="pf-btnGhost"
                  type="button"
                  onClick={() => alert("Manage later")}
                >
                  Manage
                </button>
              </div>

              <div className="pf-theaterGrid2">
                <div className="pf-theaterCard2">
                  <div
                    className="pf-theaterImg"
                    style={{
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop)",
                    }}
                  />
                  <div className="pf-theaterBody">
                    <div className="pf-theaterName">CinemaFlow Downtown</div>
                    <div className="pf-theaterAddr">123 Main Street</div>
                    <div className="pf-theaterVisits">⭐ 8 visits</div>
                  </div>
                </div>

                <div className="pf-theaterCard2 pf-theaterCard2--active">
                  <div
                    className="pf-theaterImg"
                    style={{
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop)",
                    }}
                  />
                  <div className="pf-theaterBody">
                    <div className="pf-theaterName">CinemaFlow Mall Location</div>
                    <div className="pf-theaterAddr">456 Shopping Ave</div>
                    <div className="pf-theaterVisits">⭐ 5 visits</div>
                  </div>
                </div>

                <div className="pf-theaterCard2">
                  <div
                    className="pf-theaterImg"
                    style={{
                      backgroundImage:
                        "url(https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop)",
                    }}
                  />
                  <div className="pf-theaterBody">
                    <div className="pf-theaterName">CinemaFlow Suburban</div>
                    <div className="pf-theaterAddr">789 Suburban Blvd</div>
                    <div className="pf-theaterVisits">⭐ 2 visits</div>
                  </div>
                </div>
              </div>
            </div>

            {/* WATCHLIST */}
            <div className="pf-panel pf-panelFull">
              <div className="pf-panelHead">
                <div className="pf-panelTitle">
                  <span className="pf-ico">🎞️</span> My Watchlist
                </div>
                <div className="pf-link" onClick={() => alert("View all later")}>
                  View All →
                </div>
              </div>

              <div className="pf-watchRow">
                {[
                  {
                    title: "Future World",
                    date: "December 2024",
                    img: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1200&auto=format&fit=crop",
                  },
                  {
                    title: "Love in Paris",
                    date: "December 2024",
                    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
                  },
                  {
                    title: "Mystery Island",
                    date: "December 2024",
                    img: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop",
                  },
                  {
                    title: "Action Hero",
                    date: "December 2024",
                    img: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop",
                  },
                ].map((m) => (
                  <div key={m.title} className="pf-watchCard">
                    <div
                      className="pf-watchImg"
                      style={{ backgroundImage: `url(${m.img})` }}
                    >
                      <div className="pf-coming">Coming Soon</div>
                    </div>
                    <div className="pf-watchBody">
                      <div className="pf-watchTitle">{m.title}</div>
                      <div className="pf-watchDate">{m.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECURITY SETTINGS */}
            <div className="pf-panel pf-panelFull">
              <div className="pf-panelHead">
                <div className="pf-panelTitle">
                  <span className="pf-ico">🔒</span> Security Settings
                </div>
              </div>

              <div className="pf-secList">
                <div className="pf-secRow" onClick={() => alert("Change password later")}>
                  <div>Change Password</div>
                  <div className="pf-secIcon">✏️</div>
                </div>

                <div className="pf-secRow">
                  <div>Two-Factor Authentication</div>
                  <div className="pf-pillGreen">Enabled</div>
                </div>

                <div className="pf-secRow" onClick={() => alert("Login history later")}>
                  <div>Login History</div>
                  <div className="pf-secIcon">✏️</div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pf-actionsBottom">
              <button
                className="pf-btnSave"
                type="button"
                onClick={() => setMsg("Changes saved ✅")}
              >
                💾 Save Changes
              </button>
              <button
                className="pf-btnDelete"
                type="button"
                onClick={() => alert("Delete account later")}
              >
                Delete Account
              </button>
            </div>
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
                <button
                  className="ep-x"
                  onClick={closeEdit}
                  type="button"
                  aria-label="Close"
                >
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
