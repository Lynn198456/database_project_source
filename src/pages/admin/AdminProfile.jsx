import { useMemo, useState } from "react";
import "../../styles/admin/adminProfile.css";
import AdminNavbar from "../../components/admin/AdminNavbar";

export default function AdminProfile() {
  const initialProfile = useMemo(
    () => ({
      name: "Sarah Johnson",
      title: "Cinema Manager",
      since: "Administrator since January 2023",
      email: "sarah.johnson@cinemaflow.com",
      phone: "+1 (555) 987-6543",
      org: "CinemaFlow Networks",
      location: "Downtown Branch",
      role: "Administrator",
      permissions: ["Full Access", "User Management", "Content Editor", "Financial Reports"],
      stats: [
        { label: "Movies Managed", value: "42", note: "Active", color: "blue", icon: "🎬" },
        { label: "Showtimes Scheduled", value: "856", note: "Shows", color: "purple", icon: "🗓️" },
        { label: "Total Customers", value: "12,458", note: "+12% from last month", color: "green", icon: "👥" },
        { label: "Revenue Generated", value: "฿284,500", note: "+8% from last month", color: "orange", icon: "฿" },
      ],
      activity: [
        { text: 'Added new movie "The Last Journey" to catalog', time: "2 hours ago" },
        { text: "Updated showtime schedule for Theater 3", time: "5 hours ago" },
        { text: "Approved 45 booking refund requests", time: "Yesterday" },
        { text: "Generated monthly financial report", time: "2 days ago" },
      ],
      managedTheaters: [
        { name: "Downtown Branch", address: "123 Main Street", theaters: 8, seats: 1200, tag: "Primary" },
        { name: "Mall Location", address: "456 Shopping Ave", theaters: 6, seats: 850 },
        { name: "Suburban Complex", address: "789 Suburban Blvd", theaters: 10, seats: 1500 },
      ],
      team: [
        { name: "Michael Chen", role: "Assistant Manager", status: "Active", color: "blue" },
        { name: "Emily Rodriguez", role: "Operations Lead", status: "Active", color: "purple" },
        { name: "David Kim", role: "Technical Support", status: "Active", color: "green" },
        { name: "Jessica Taylor", role: "Marketing Coordinator", status: "Active", color: "orange" },
      ],
    }),
    []
  );

  const [profile, setProfile] = useState(initialProfile);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: initialProfile.name,
    title: initialProfile.title,
    email: initialProfile.email,
    phone: initialProfile.phone,
    org: initialProfile.org,
    location: initialProfile.location,
  });

  const [notif, setNotif] = useState({
    bookings: true,
    alerts: true,
    reports: true,
    staff: false,
    maintenance: true,
  });

  const toggle = (key) => setNotif((s) => ({ ...s, [key]: !s[key] }));

  function openEdit() {
    setForm({
      name: profile.name,
      title: profile.title,
      email: profile.email,
      phone: profile.phone,
      org: profile.org,
      location: profile.location,
    });
    setEditOpen(true);
  }

  function closeEdit() {
    setEditOpen(false);
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function saveProfile(e) {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name: form.name.trim(),
      title: form.title.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      org: form.org.trim(),
      location: form.location.trim(),
    }));
    setEditOpen(false);
  }

  return (
    
    <div className="admin-page">
      <AdminNavbar />
      <div className="admin-container">
        {/* Header */}
        <div className="ap-headRow">
          <div className="ap-headLeft">
            <div className="ap-headIcon">🛡️</div>
            <div>
              <h2 className="ap-title">Management Profile</h2>
              <p className="muted">View and manage account details</p>
            </div>
          </div>

          <button className="ap-editBtn" onClick={openEdit}>
            <span className="ap-pen">✎</span> Edit Profile
          </button>
        </div>

        {/* Main Profile Card */}
        <div className="ap-profileCard">
          <div className="ap-profileGrid">
            {/* Left avatar */}
            <div className="ap-avatarCol">
              <div className="ap-avatarCircle">
                <span className="ap-avatarIcon">👤</span>
              </div>
              <button className="ap-softBtn">Change Photo</button>
              <div className="ap-rolePill">
                <span className="ap-roleDot" />
                {profile.role}
              </div>
            </div>

            {/* Right info */}
            <div className="ap-infoCol">
              <div className="ap-nameBlock">
                <h3 className="ap-name">{profile.name}</h3>
                <div className="ap-subLine">
                  {profile.title} • <span className="muted">{profile.since}</span>
                </div>
              </div>

              <div className="ap-infoGrid">
                <InfoBox label="Email" value={profile.email} icon="✉️" />
                <InfoBox label="Phone" value={profile.phone} icon="📞" />
                <InfoBox label="Organization" value={profile.org} icon="🏢" />
                <InfoBox label="Location" value={profile.location} icon="📍" />
              </div>

              <div className="ap-permStrip">
                <div className="ap-permHead">
                  <div className="ap-permTitle">
                    <span className="ap-miniIcon">👤</span> Role &amp; Permissions
                  </div>
                  <button className="ap-linkBtn">View Details</button>
                </div>

                <div className="ap-permPills">
                  {profile.permissions.map((p) => (
                    <span key={p} className={`ap-pill ap-pill-${pillColor(p)}`}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="ap-blockHead">
          <h3>📈 Performance Overview</h3>
        </div>
        <div className="ap-statRow">
          {profile.stats.map((s) => (
            <div key={s.label} className={`ap-statCard ${s.color}`}>
              <div className="ap-statTop">
                <div className="ap-statIcon">{s.icon}</div>
                <div className="ap-statTag">This Month</div>
              </div>
              <div className="ap-statLabel">{s.label}</div>
              <div className="ap-statValue">{s.value}</div>
              <div className="ap-statNote">{s.note}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="ap-card">
          <div className="ap-cardHead">
            <div className="ap-cardTitle">
              <span className="ap-miniIcon purple">⏱</span> Recent Activity
            </div>
            <button className="ap-linkBtn">View All</button>
          </div>

          <div className="ap-activityList">
            {profile.activity.map((a, idx) => (
              <div key={idx} className="ap-activityItem">
                <div className="ap-check">✓</div>
                <div>
                  <div className="ap-activityText">{a.text}</div>
                  <div className="ap-activityTime">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two column: Access + Notifications */}
        <div className="ap-grid2">
          <div className="ap-card">
            <div className="ap-cardHead">
              <div className="ap-cardTitle">
                <span className="ap-miniIcon">🔒</span> Access &amp; Security
              </div>
            </div>

            <div className="ap-settingList">
              <SettingRow label="Change Password" right={<SmallIconBtn />} />
              <SettingRow label="Two-Factor Authentication" right={<span className="ap-enabled">Enabled</span>} />
              <SettingRow label="API Access Keys" right={<SmallIconBtn />} />
              <SettingRow label="Login History" right={<SmallIconBtn />} />
            </div>
          </div>

          <div className="ap-card">
            <div className="ap-cardHead">
              <div className="ap-cardTitle">
                <span className="ap-miniIcon purple">🔔</span> Notification Preferences
              </div>
            </div>

            <div className="ap-toggleList">
              <ToggleRow label="New Bookings" on={notif.bookings} onToggle={() => toggle("bookings")} />
              <ToggleRow label="System Alerts" on={notif.alerts} onToggle={() => toggle("alerts")} />
              <ToggleRow label="Financial Reports" on={notif.reports} onToggle={() => toggle("reports")} />
              <ToggleRow label="Staff Updates" on={notif.staff} onToggle={() => toggle("staff")} />
              <ToggleRow label="Maintenance Reminders" on={notif.maintenance} onToggle={() => toggle("maintenance")} />
            </div>
          </div>
        </div>

        {/* Managed Theaters */}
        <div className="ap-card">
          <div className="ap-cardHead">
            <div className="ap-cardTitle">
              <span className="ap-miniIcon">🏢</span> Managed Theaters
            </div>
            <button className="ap-purpleBtn">Add Theater</button>
          </div>

          <div className="ap-theaterRow">
            {profile.managedTheaters.map((t) => (
              <div key={t.name} className={`ap-theaterCard ${t.tag ? "primary" : ""}`}>
                <div className="ap-theaterTop">
                  <div className="ap-theaterName">{t.name}</div>
                  {t.tag ? <span className="ap-greenTag">{t.tag}</span> : null}
                </div>
                <div className="ap-theaterMeta muted">{t.address}</div>
                <div className="ap-theaterMeta muted">{t.theaters} Theaters</div>
                <div className="ap-theaterBottom">
                  <span className="muted">{t.seats.toLocaleString()} Seats</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members preview */}
        <div className="ap-card">
          <div className="ap-cardHead">
            <div className="ap-cardTitle">
              <span className="ap-miniIcon purple">👥</span> Team Members
            </div>
            <button className="ap-purpleBtn">Manage Team</button>
          </div>

          <div className="ap-teamGrid">
            {profile.team.map((m) => (
              <div key={m.name} className="ap-teamMini">
                <div className={`ap-miniAvatar ${m.color}`}>{m.name.charAt(0)}</div>
                <div>
                  <div className="ap-teamName">{m.name}</div>
                  <div className="ap-teamRole muted">{m.role}</div>
                </div>
                <span className="ap-activePill">Active</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Settings */}
        <div className="ap-card">
          <div className="ap-cardHead">
            <div className="ap-cardTitle">
              <span className="ap-miniIcon purple">⚙️</span> System Settings
            </div>
          </div>

          <div className="ap-settingsGrid">
            <SettingRowWide label="Pricing Rules" />
            <SettingRowWide label="Booking Settings" />
            <SettingRowWide label="Payment Gateway" />
            <SettingRowWide label="Email Templates" />
            <SettingRowWide label="Integration Settings" />
            <SettingRowWide label="Backup & Recovery" />
          </div>

          <div className="ap-actionsRow">
            <button className="ap-saveBtn">💾 Save Changes</button>
            <button className="ap-cancelBtn">Cancel</button>

            <div className="ap-spacer" />
            <button className="ap-dangerBtn">Deactivate Account</button>
          </div>
        </div>

        <div className="admin-footer">© 2025 CinemaFlow. All rights reserved.</div>
      </div>

      {editOpen ? (
        <div className="ap-modalOverlay" onClick={closeEdit}>
          <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ap-modalHead">
              <h3>Edit Profile</h3>
              <button className="ap-modalClose" onClick={closeEdit}>
                ✕
              </button>
            </div>

            <form className="ap-modalBody" onSubmit={saveProfile}>
              <label>
                Name
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </label>
              <label>
                Title
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </label>
              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </label>
              <label>
                Organization
                <input
                  value={form.org}
                  onChange={(e) => updateField("org", e.target.value)}
                />
              </label>
              <label>
                Location
                <input
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                />
              </label>

              <div className="ap-modalActions">
                <button className="ap-modalPrimary" type="submit">
                  Save Changes
                </button>
                <button className="ap-modalSecondary" type="button" onClick={closeEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- Small Components ---------- */

function InfoBox({ label, value, icon }) {
  return (
    <div className="ap-infoBox">
      <div className="ap-infoLabel">
        <span className="ap-infoIcon">{icon}</span> {label}
      </div>
      <div className="ap-infoValue">{value}</div>
    </div>
  );
}

function SettingRow({ label, right }) {
  return (
    <div className="ap-settingRow">
      <div className="ap-settingLabel">{label}</div>
      <div>{right}</div>
    </div>
  );
}

function SettingRowWide({ label }) {
  return (
    <div className="ap-settingRow wide">
      <div className="ap-settingLabel">{label}</div>
      <SmallIconBtn />
    </div>
  );
}

function SmallIconBtn() {
  return <button className="ap-miniBtn">✎</button>;
}

function ToggleRow({ label, on, onToggle }) {
  return (
    <div className="ap-toggleRow">
      <div className="ap-toggleLabel">{label}</div>
      <button className={`ap-switch ${on ? "on" : ""}`} onClick={onToggle} aria-label={label}>
        <span className="ap-knob" />
      </button>
    </div>
  );
}

function pillColor(text) {
  if (text.toLowerCase().includes("full")) return "purple";
  if (text.toLowerCase().includes("user")) return "blue";
  if (text.toLowerCase().includes("content")) return "green";
  return "orange";
}
