import "../../styles/staffDashboard.css";

export default function StaffProfile() {
  return (
    <div className="staff-page">
      <main className="staff-container">

        {/* HEADER */}
        <div className="section-head">
          <h2>👤 My Profile</h2>
          <p className="muted">View and update your information</p>
        </div>

        <div className="profile-grid">

          {/* LEFT PROFILE CARD */}
          <div className="staff-card profile-card">
            <div className="avatar-circle">
              <span>👤</span>
            </div>

            <h3>Michael Chen</h3>
            <p className="role">Box Office Lead</p>

            <div className="info-box">
              <label>Employee ID</label>
              <span>EMP-2024-0042</span>
            </div>

            <div className="info-box">
              <label>Department</label>
              <span>Operations</span>
            </div>

            <div className="info-box">
              <label>Location</label>
              <span>Downtown Branch</span>
            </div>

            <div className="info-box">
              <label>Join Date</label>
              <span>Mar 15, 2023</span>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="profile-right">

            {/* CONTACT INFO */}
            <div className="staff-card">
              <h3 className="card-title">👥 Contact Information</h3>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value="michael.chen@cinemaflow.com"
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    value="+1 (555) 234-5678"
                    readOnly
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
                  <input value="Sarah Chen" readOnly />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input value="+1 (555) 987-6543" readOnly />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="staff-footer">
          © 2025 CinemaFlow Staff Portal
        </div>

      </main>
    </div>
  );
}
