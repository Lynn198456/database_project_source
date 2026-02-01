import "../../styles/staffDashboard.css";
import "../../styles/staffProfile.css";
import StaffNavbar from "../../components/staff/StaffNavbar";

export default function StaffProfile() {
  const staff = {
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
  };

  return (
    <div className="staff-page">
      <StaffNavbar />

      <main className="staff-container">
        {/* HEADER */}
        <div className="section-head">
          <h2>👤 My Profile</h2>
          <p className="muted">View and update your information</p>
        </div>

        <div className="profile-grid">
          {/* LEFT CARD */}
          <div className="staff-card profile-card">
            <div className="profile-top">
              <div className="avatar-circle">👤</div>

              <div className="profile-title">
                <h3 className="profile-name">{staff.name}</h3>
                <p className="profile-role">{staff.role}</p>
              </div>
            </div>

            <div className="profile-kv">
              <div className="kv-row">
                <span className="kv-label">Employee ID</span>
                <span className="kv-value">{staff.employeeId}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Department</span>
                <span className="kv-value">{staff.department}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Location</span>
                <span className="kv-value">{staff.location}</span>
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
                  <input value={staff.email} readOnly />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input value={staff.phone} readOnly />
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
                  <input value={staff.emergencyName} readOnly />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input value={staff.emergencyPhone} readOnly />
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
