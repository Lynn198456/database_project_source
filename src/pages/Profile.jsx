import "../styles/customer.css";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";

export default function Profile() {
  const user =
    JSON.parse(localStorage.getItem("cinemaFlow_user")) || {
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

  return (
    <div className="cf-containerWide">
      <div className="cf-page">
        {/* ✅ Navbar ONLY on Profile page */}
        <Navbar />

        <main className="cf-mainFull">
        <div className="cf-container">
          {/* HEADER */}
          <div className="cf-profileHeader">
            <div className="cf-profileTitle">
              <span className="cf-iconOrange">👤</span>
              My Profile
            </div>
            <button className="cf-blueBtn" type="button">
              ✏️ Edit Profile
            </button>
          </div>

          {/* PROFILE CARD */}
          <div className="cf-profileMain">
            <div className="cf-profileAvatarBlock">
              <div className="cf-avatarLarge">👤</div>
              <button className="cf-grayBtn" type="button">
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

              {/* MEMBERSHIP */}
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

          {/* PAYMENT + PREFERENCES */}
          <div className="cf-twoCol">
            <div className="cf-card">
              <div className="cf-cardHead">
                💳 Payment Methods
                <button className="cf-blueBtn small" type="button">
                  Add New
                </button>
              </div>

              <div className="cf-payment active">
                <div>
                  Visa •••• 4242 <span className="cf-badgeGreen">Default</span>
                </div>
                <small>Expires 12/2025</small>
              </div>

              <div className="cf-payment">
                <div>Mastercard •••• 8888</div>
                <small>Expires 08/2026</small>
              </div>
            </div>

            <div className="cf-card">
              <div className="cf-cardHead">⚙️ Preferences</div>

              <label className="cf-toggleRow">
                <span>Email Notifications</span>
                <input type="checkbox" defaultChecked />
              </label>

              <label className="cf-toggleRow">
                <span>SMS Notifications</span>
                <input type="checkbox" />
              </label>

              <label className="cf-toggleRow">
                <span>Promotional Emails</span>
                <input type="checkbox" defaultChecked />
              </label>
            </div>
          </div>

          {/* FAVORITE THEATERS */}
          <div className="cf-card">
            <div className="cf-cardHead">
              📍 Favorite Theaters
              <button className="cf-grayBtn small" type="button">
                Manage
              </button>
            </div>

            <div className="cf-theaterGrid">
              <div className="cf-theaterCard">CinemaFlow Downtown ⭐ 8 visits</div>
              <div className="cf-theaterCard">CinemaFlow Mall ⭐ 5 visits</div>
              <div className="cf-theaterCard">CinemaFlow Suburban ⭐ 2 visits</div>
            </div>
          </div>

          {/* WATCHLIST */}
          <div className="cf-card">
            <div className="cf-cardHead">
              🎞️ My Watchlist
              <span className="cf-linkText">View All →</span>
            </div>

            <div className="cf-watchGrid">
              <div className="cf-watchItem">Future World</div>
              <div className="cf-watchItem">Love in Paris</div>
              <div className="cf-watchItem">Mystery Island</div>
              <div className="cf-watchItem">Action Hero</div>
            </div>
          </div>

          {/* SECURITY */}
          <div className="cf-card">
            <div className="cf-cardHead">🔐 Security Settings</div>

            <div className="cf-securityRow">Change Password ✏️</div>

            <div className="cf-securityRow">
              Two-Factor Authentication
              <span className="cf-badgeGreen">Enabled</span>
            </div>

            <div className="cf-securityRow">Login History ✏️</div>
          </div>

          {/* ACTIONS */}
          <div className="cf-actions">
            <button className="cf-blueBtn" type="button">
              💾 Save Changes
            </button>
            <button className="cf-redBtn" type="button">
              🗑 Delete Account
            </button>
          </div>
        </div>
      </main>

        <Footer />
      </div>
    </div>
  );
}
