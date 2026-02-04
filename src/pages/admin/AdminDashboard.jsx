import { useMemo, useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import QuickBooking from "../../components/admin/QuickBooking";
import "../../styles/admin/adminDashboard.css"; // ✅ ONLY THIS

export default function AdminDashboard() {
  const kpis = useMemo(
    () => [
      { color: "blue", icon: "🎬", label: "Active Movies", value: "12", hint: "+2 this week" },
      { color: "green", icon: "📅", label: "Today's Shows", value: "48", hint: "Across 3 locations" },
      { color: "purple", icon: "🎟️", label: "Total Bookings", value: "856", hint: "+124 today" },
      { color: "orange", icon: "💲", label: "Revenue", value: "$12,450", hint: "+15% vs yesterday" },
    ],
    []
  );

  const [movies] = useState([
    { id: 1, title: "The Last Adventure", genre: "Action, Sci-Fi", duration: "2h 15m", rating: 4.5, badge: "PG-13" },
    { id: 2, title: "Hearts Entwined", genre: "Drama, Romance", duration: "1h 58m", rating: 4.5, badge: "PG" },
    { id: 3, title: "Laugh Out Loud", genre: "Comedy", duration: "1h 42m", rating: 4.5, badge: "PG-13" },
    { id: 4, title: "Midnight Shadows", genre: "Horror, Thriller", duration: "2h 05m", rating: 4.5, badge: "R" },
  ]);

  const showtimes = useMemo(
    () => [
      { id: 1, movie: "Movie Title 1", screen: "1", time: "10:00 AM", seats: "45/120", status: "available" },
      { id: 2, movie: "Movie Title 2", screen: "2", time: "10:30 AM", seats: "89/150", status: "available" },
      { id: 3, movie: "Movie Title 1", screen: "1", time: "01:15 PM", seats: "102/120", status: "filling" },
      { id: 4, movie: "Movie Title 3", screen: "3", time: "02:00 PM", seats: "12/100", status: "available" },
      { id: 5, movie: "Movie Title 4", screen: "2", time: "03:30 PM", seats: "150/150", status: "soldout" },
      { id: 6, movie: "Movie Title 2", screen: "1", time: "05:00 PM", seats: "67/120", status: "available" },
    ],
    []
  );

  const comingSoon = useMemo(
    () => [
      { id: 1, title: "Future World", date: "December 2024" },
      { id: 2, title: "Epic Quest", date: "December 2024" },
      { id: 3, title: "Dark Mystery", date: "December 2024" },
      { id: 4, title: "Color Dreams", date: "December 2024" },
    ],
    []
  );

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [range, setRange] = useState("week");

  const filteredMovies = movies.filter((m) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || (m.title + " " + m.genre).toLowerCase().includes(q);
    const matchGenre = genre === "all" || m.genre.toLowerCase().includes(genre);
    return matchSearch && matchGenre;
  });

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <AdminNavbar />

        <main className="admin-container">
          <div className="admin-titleRow">
            <div>
              <div className="admin-title">Dashboard Overview</div>
              <div className="admin-muted">Monitor performance and manage cinema operations</div>
            </div>

            <div className="admin-actionsRight">
            </div>
          </div>

          {/* KPI */}
          <section className="admin-kpiGrid">
            {kpis.map((k) => (
              <div key={k.label} className={`kpi ${k.color}`}>
                <div className="kpiTop">
                  <div className="kpiIcon">{k.icon}</div>
                  <div className="kpiTrend">↗</div>
                </div>
                <div className="kpiLabel">{k.label}</div>
                <div className="kpiValue">{k.value}</div>
                <div className="kpiHint">{k.hint}</div>
              </div>
            ))}
          </section>

          {/* Toolbar */}
          <section className="admin-toolbar">
            <div className="admin-search">
              <span className="admin-searchIcon">🔎</span>
              <input
                className="admin-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search movies, showtimes..."
              />
            </div>

            <select className="admin-select" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="all">All Genres</option>
              <option value="action">Action</option>
              <option value="drama">Drama</option>
              <option value="comedy">Comedy</option>
              <option value="horror">Horror</option>
            </select>

            <select className="admin-select" value={range} onChange={(e) => setRange(e.target.value)}>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </section>

          {/* Main layout */}
          <section className="admin-mainGrid">
            {/* LEFT */}
            <div>
              {/* Now showing */}
              <section className="admin-section">
                <div className="admin-sectionHead">
                  <h3>Now Showing</h3>
                  <div className="admin-muted">Manage movies and schedules</div>
                </div>

                <div className="movie-grid">
                  {filteredMovies.map((m) => (
                    <div key={m.id} className="movie-card">
                      <div className="movie-poster">
                        <span className="movie-badge">{m.badge}</span>
                      </div>

                      <div className="movie-body">
                        <h4 className="movie-title">{m.title}</h4>
                        <div className="movie-chip">{m.genre}</div>

                        <div className="movie-metaRow">
                          <span>🕒 {m.duration}</span>
                          <span>⭐ {m.rating}</span>
                        </div>

                        <div className="movie-actions">
                          <button
                            className="btn-primary"
                            onClick={() => navigate(`/admin/movies/edit/${m.id}`)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn-ghost"
                            onClick={() => navigate(`/admin/showtimes/schedule/${m.id}`)}
                          >
                            📅 Schedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Showtimes */}
              <section className="admin-section" style={{ marginTop: 22 }}>
                <div className="admin-sectionHead">
                  <h3>Showtime Schedule</h3>
                  <div className="admin-muted">Monitor seat status</div>
                </div>

                <div className="table-card">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Movie</th>
                        <th>Screen</th>
                        <th>Time</th>
                        <th>Seats Booked</th>
                        <th>Status</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showtimes.map((s) => (
                        <tr key={s.id}>
                          <td>{s.movie}</td>
                          <td>{s.screen}</td>
                          <td>{s.time}</td>
                          <td>{s.seats}</td>
                          <td>
                            <span className={`pill ${s.status}`}>
                              {s.status === "soldout" ? "Sold Out" : s.status === "filling" ? "Filling Fast" : "Available"}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn-table"
                              onClick={() => navigate(`/admin/showtimes/schedule/${s.id}`)}
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Coming soon */}
              <section className="admin-section" style={{ marginTop: 22 }}>
                <div className="admin-sectionHead">
                  <h3>Coming Soon</h3>
                  <div className="admin-muted">Upcoming releases</div>
                </div>

                <div className="coming-grid">
                  {comingSoon.map((c) => (
                    <div key={c.id} className="coming-card">
                      <div className="coming-img">
                        <div className="coming-badge">Coming Soon</div>
                      </div>
                      <div className="coming-body">
                        <p className="coming-title">{c.title}</p>
                        <p className="coming-date">{c.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <footer className="admin-footer">© 2025 CinemaFlow. All rights reserved.</footer>
            </div>

            {/* RIGHT */}
            <QuickBooking movies={movies} />
          </section>
        </main>
      </div>
    </div>
  );
}
