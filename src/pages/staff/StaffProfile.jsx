import { useMemo, useState } from "react";
import "../../styles/staffDashboard.css";
import "../../styles/staffProfile.css";
import StaffNavbar from "../../components/staff/StaffNavbar";

const FALLBACK_STAFF = {
  name: "Michael Chen",
  role: "Box Office Lead",
  employeeId: "EMP-2024-0042",
  department: "Operations",
  location: "Downtown Branch",
  joinDate: "Mar 15, 2023",
  email: "michael.chen@cinemaflow.com",
  phone: "+1 (555) 234-5678",
  emergencyName: "Sarah Chen",
  emergencyPhone: "+1 (555) 987-6543",
  notifications: 3,
};

function readStaff() {
  try {
    const raw = localStorage.getItem("cinemaFlow_staff");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStaff(staff) {
  localStorage.setItem("cinemaFlow_staff", JSON.stringify(staff));
}

export default function StaffProfile() {
  const initialStaff = useMemo(() => readStaff() || FALLBACK_STAFF, []);
  const [staff, setStaff] = useState(initialStaff);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(staff);

  function startEdit() {
    setDraft(staff);
    setIsEditing(true);
  }

  function cancelEdit() {
    setDraft(staff);
    setIsEditing(false);
  }

  function onChange(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function onSave() {
    const cleaned = {
      ...staff,
      ...draft,
      name: (draft.name || "").trim() || staff.name,
      email: (draft.email || "").trim() || staff.email,
      phone: (draft.phone || "").trim() || staff.phone,
      emergencyName: (draft.emergencyName || "").trim() || staff.emergencyName,
      emergencyPhone: (draft.emergencyPhone || "").trim() || staff.emergencyPhone,
    };

    setStaff(cleaned);
    saveStaff(cleaned);
    setIsEditing(false);
  }

  return (
    <div className="staff-page">
      <StaffNavbar />

      <main className="staff-container">
        {/* HEADER */}
        <div className="section-head profile-head">
          <div>
            <h2>👤 My Profile</h2>
            <p className="muted">View and update your information</p>
          </div>

          {!isEditing ? (
            <button className="btn-outline" onClick={startEdit}>
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="profile-actions">
              <button className="btn-soft" onClick={cancelEdit}>
                Cancel
              </button>
              <button className="btn-blue" onClick={onSave}>
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="profile-grid">
          {/* LEFT CARD */}
          <div className="staff-card profile-card">
            <div className="profile-top">
              <div className="avatar-circle">👤</div>

              <div className="profile-title">
                {!isEditing ? (
                  <>
                    <h3 className="profile-name">{staff.name}</h3>
                    <p className="profile-role">{staff.role}</p>
                  </>
                ) : (
                  <>
                    <input
                      className="inline-input"
                      value={draft.name}
                      onChange={(e) => onChange("name", e.target.value)}
                      placeholder="Full name"
                    />
                    <input
                      className="inline-input small"
                      value={draft.role}
                      onChange={(e) => onChange("role", e.target.value)}
                      placeholder="Role"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="profile-kv">
              <div className="kv-row">
                <span className="kv-label">Employee ID</span>
                <span className="kv-value">{staff.employeeId}</span>
              </div>

              <div className="kv-row">
                <span className="kv-label">Department</span>
                {!isEditing ? (
                  <span className="kv-value">{staff.department}</span>
                ) : (
                  <input
                    className="kv-input"
                    value={draft.department}
                    onChange={(e) => onChange("department", e.target.value)}
                  />
                )}
              </div>

              <div className="kv-row">
                <span className="kv-label">Location</span>
                {!isEditing ? (
                  <span className="kv-value">{staff.location}</span>
                ) : (
                  <input
                    className="kv-input"
                    value={draft.location}
                    onChange={(e) => onChange("location", e.target.value)}
                  />
                )}
              </div>

              <div className="kv-row">
                <span className="kv-label">Join Date</span>
                <span className="kv-value">{staff.joinDate}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="profile-right">
            {/* CONTACT INFO */}
            <div className="staff-card">
              <h3 className="card-title">📇 Contact Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value={isEditing ? draft.email : staff.email}
                    readOnly={!isEditing}
                    onChange={(e) => onChange("email", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    value={isEditing ? draft.phone : staff.phone}
                    readOnly={!isEditing}
                    onChange={(e) => onChange("phone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* WORK SUMMARY */}
            <div className="staff-card">
              <h3 className="card-title">📊 Work Summary</h3>

              <div className="stat-grid">
                <div className="stat-card blue">
                  <span>Total Hours</span>
                  <strong>856 hrs</strong>
                </div>
                <div className="stat-card purple">
                  <span>Shifts Completed</span>
                  <strong>142</strong>
                </div>
                <div className="stat-card green">
                  <span>Tasks Completed</span>
                  <strong>387</strong>
                </div>
              </div>
            </div>

            {/* EMERGENCY CONTACT */}
            <div className="staff-card">
              <h3 className="card-title">🚨 Emergency Contact</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact Name</label>
                  <input
                    value={isEditing ? draft.emergencyName : staff.emergencyName}
                    readOnly={!isEditing}
                    onChange={(e) => onChange("emergencyName", e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    value={
                      isEditing ? draft.emergencyPhone : staff.emergencyPhone
                    }
                    readOnly={!isEditing}
                    onChange={(e) => onChange("emergencyPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="staff-footer">© 2025 CinemaFlow Staff Portal</div>
      </main>
    </div>
  );
}
