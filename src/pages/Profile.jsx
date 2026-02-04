// src/pages/Profile.jsx
import "../styles/customer.css";
import "../styles/profileModal.css";
import "../styles/profilePlus.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";

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

function loadCards() {
  try {
    const raw = localStorage.getItem("cinemaFlow_cards");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCards(cards) {
  localStorage.setItem("cinemaFlow_cards", JSON.stringify(cards));
}

function loadProfilePhoto() {
  try {
    return localStorage.getItem("cinemaFlow_profilePhoto") || "";
  } catch {
    return "";
  }
}

function saveProfilePhoto(dataUrl) {
  localStorage.setItem("cinemaFlow_profilePhoto", dataUrl || "");
}

function maskLast4(last4) {
  return `•••• ${last4}`;
}

function onlyDigits(val) {
  return (val || "").replace(/\D/g, "");
}

function isValidCardNumber(num) {
  const digits = onlyDigits(num);
  return /^\d{12,19}$/.test(digits);
}

function isValidExp(exp) {
  const v = (exp || "").trim();
  if (!/^\d{2}\/\d{2}$/.test(v)) return false;
  const [mm, yy] = v.split("/").map(Number);
  return mm >= 1 && mm <= 12 && yy >= 0;
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

export default function Profile() {
  const navigate = useNavigate();

  /* ----------------------------- user state ----------------------------- */
  const initialUser = useMemo(() => getUser() || FALLBACK_USER, []);
  const [user, setUser] = useState(initialUser);

  // profile photo (stored as dataURL in localStorage)
  const [photo, setPhoto] = useState(() => loadProfilePhoto());

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

  /* ----------------------------- payment cards state ----------------------------- */
  const initialCards = useMemo(() => {
    const stored = loadCards();
    if (stored && Array.isArray(stored) && stored.length > 0) return stored;

    // seed (demo)
    return [
      { id: 1, brand: "Visa", last4: "4242", exp: "12/25", isDefault: true },
      { id: 2, brand: "Mastercard", last4: "8888", exp: "08/26", isDefault: false },
    ];
  }, []);

  const [cards, setCards] = useState(initialCards);

  // Add Card modal
  const [addOpen, setAddOpen] = useState(false);
  const [cardForm, setCardForm] = useState({
    brand: "Visa",
    cardNumber: "",
    exp: "",
  });

  // Save seeded cards once (so refresh keeps them)
  useEffect(() => {
    const existing = loadCards();
    if (!existing || !Array.isArray(existing) || existing.length === 0) {
      saveCards(initialCards);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ----------------------------- ESC closes modals ----------------------------- */
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") {
        setEditOpen(false);
        setAddOpen(false);
      }
    }
    if (editOpen || addOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editOpen, addOpen]);

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

      // keep preferences
      prefEmail: prefs.prefEmail,
      prefSMS: prefs.prefSMS,
      prefPromo: prefs.prefPromo,
    };

    saveUser(updated);
    setUser(updated);
    setEditOpen(false);
    setMsg("Profile updated successfully ✅");
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
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setPhoto(dataUrl);
      saveProfilePhoto(dataUrl);
      setMsg("Profile photo updated ✅");
    };
    reader.readAsDataURL(file);

    // allow re-select same file later
    e.target.value = "";
  }

  function removePhoto() {
    const ok = window.confirm("Remove your profile photo?");
    if (!ok) return;
    setPhoto("");
    saveProfilePhoto("");
    setMsg("Profile photo removed ✅");
  }

  /* ----------------------------- payment methods handlers ----------------------------- */
  function persistCards(next) {
    setCards(next);
    saveCards(next);
  }

  function openAddCard() {
    setCardForm({ brand: "Visa", cardNumber: "", exp: "" });
    setAddOpen(true);
  }

  function closeAddCard() {
    setAddOpen(false);
  }

  function onCardChange(e) {
    const { name, value } = e.target;
    setCardForm((p) => ({ ...p, [name]: value }));
  }

  function setDefaultCard(id) {
    const next = cards.map((c) => ({ ...c, isDefault: c.id === id }));
    persistCards(next);
    setMsg("Default card updated ✅");
  }

  function removeCard(id) {
    const ok = window.confirm("Remove this card?");
    if (!ok) return;

    let next = cards.filter((c) => c.id !== id);

    // If default removed, set first as default
    if (next.length > 0 && !next.some((c) => c.isDefault)) {
      next = next.map((c, i) => ({ ...c, isDefault: i === 0 }));
    }

    persistCards(next);
    setMsg("Card removed ✅");
  }

  function addCard() {
    const digits = onlyDigits(cardForm.cardNumber);
    const exp = (cardForm.exp || "").trim();

    if (!isValidCardNumber(digits)) {
      return alert("Enter a valid card number (12–19 digits).");
    }
    if (!isValidExp(exp)) {
      return alert("Expiry must be MM/YY (example 08/26).");
    }

    const newCard = {
      id: Date.now(),
      brand: cardForm.brand,
      last4: digits.slice(-4),
      exp,
      isDefault: cards.length === 0,
    };

    const next = [...cards, newCard];
    persistCards(next);
    setAddOpen(false);
    setMsg("Card added ✅");
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
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/customer/movies-watched")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer/movies-watched")}
                title="View Movies Watched"
              >
                🎬 Movies Watched
                <strong>{user.watched}</strong>
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
                <strong>{user.bookings}</strong>
              </div>

              <div
                className="cf-statCard orange"
                role="button"
                tabIndex={0}
                onClick={() => navigate("/customer/loyalty")}
                onKeyDown={(e) => e.key === "Enter" && navigate("/customer/loyalty")}
                style={{ cursor: "pointer" }}
                title="View Loyalty Points"
              >
                ⭐ Loyalty Points
                <strong>{user.points}</strong>
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
                <strong>฿{user.spent}.00</strong>
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

                  {/* ✅ real add card feature (no alert) */}
                  <button className="pf-btnBlue" type="button" onClick={openAddCard}>
                    Add New
                  </button>
                </div>

                {cards.length === 0 ? (
                  <div className="pf-payCard" style={{ opacity: 0.85 }}>
                    <div className="pf-payName">No cards yet</div>
                    <div className="pf-paySub">Click “Add New” to add a card.</div>
                  </div>
                ) : (
                  cards.map((c) => (
                    <div
                      key={c.id}
                      className={`pf-payCard ${c.isDefault ? "pf-payCard--active" : ""}`}
                    >
                      <div className="pf-payTop">
                        <div className="pf-payName">
                          {c.brand} {maskLast4(c.last4)}
                        </div>
                        {c.isDefault && <span className="pf-pillGreen">Default</span>}
                      </div>

                      <div className="pf-paySub">Expires {c.exp}</div>

                      <div className="pf-payActions">
                        {!c.isDefault ? (
                          <button
                            className="pf-payBtn"
                            type="button"
                            onClick={() => setDefaultCard(c.id)}
                          >
                            Set Default
                          </button>
                        ) : (
                          <button
                            className="pf-payBtn"
                            type="button"
                            disabled
                            style={{ opacity: 0.6 }}
                          >
                            Default
                          </button>
                        )}

                        <button
                          className="pf-payBtn pf-payBtnDanger"
                          type="button"
                          onClick={() => removeCard(c.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
  onClick={() => navigate("/customer/favorite-theaters")}
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
                    <div className="pf-theaterName">Cinema Listic Downtown</div>
                    <div className="pf-theaterAddr">123 Main Street</div>
                    <div className="pf-theaterVisits">⭐ 8 visits</div>
                  </div>
                </div>

                <div className="pf-theaterCard2 pf-theaterCard2--active">
                  <div
                    className="pf-theaterImg"
                    style={{
                      backgroundImage:
                        "url(/assets/hearts-entwined.jpg)",
                    }}
                  />
                  <div className="pf-theaterBody">
                    <div className="pf-theaterName">Cinema Listic Mall Location</div>
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
                    <div className="pf-theaterName">Cinema Listic Suburban</div>
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
<div
  className="pf-link"
  role="button"
  tabIndex={0}
  onClick={() => navigate("/customer/watchlist")}
  onKeyDown={(e) => e.key === "Enter" && navigate("/customer/watchlist")}
>
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
                    <div className="pf-watchImg" style={{ backgroundImage: `url(${m.img})` }}>
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

        {/* ✅ ADD CARD MODAL */}
        {addOpen && (
          <div className="ep-overlay" onMouseDown={closeAddCard}>
            <div className="ep-card" onMouseDown={(e) => e.stopPropagation()}>
              <div className="ep-head">
                <div className="ep-title">
                  <span className="ep-icon">💳</span>
                  Add Payment Method
                </div>
                <button className="ep-x" onClick={closeAddCard} type="button" aria-label="Close">
                  ✕
                </button>
              </div>

              <div className="ep-form">
                <div className="ep-field">
                  <div className="ep-label">Card Brand</div>
                  <select
                    className="ep-input"
                    name="brand"
                    value={cardForm.brand}
                    onChange={onCardChange}
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="AMEX">AMEX</option>
                  </select>
                </div>

                <div className="ep-field">
                  <div className="ep-label">Card Number</div>
                  <input
                    className="ep-input"
                    name="cardNumber"
                    value={cardForm.cardNumber}
                    onChange={onCardChange}
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="ep-field">
                  <div className="ep-label">Expiry (MM/YY)</div>
                  <input
                    className="ep-input"
                    name="exp"
                    value={cardForm.exp}
                    onChange={onCardChange}
                    placeholder="08/26"
                  />
                </div>
              </div>

              <div className="ep-actions">
                <button className="ep-btn ep-btnGhost" onClick={closeAddCard} type="button">
                  Cancel
                </button>
                <button className="ep-btn ep-btnPrimary" onClick={addCard} type="button">
                  ✅ Add Card
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
