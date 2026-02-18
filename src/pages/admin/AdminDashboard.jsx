import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminNavbar from "../../components/admin/AdminNavbar";
import QuickBooking from "../../components/admin/QuickBooking";
import { listMovies } from "../../api/movies";
import { listShowtimes } from "../../api/showtimes";
import "../../styles/admin/adminDashboard.css";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=60";

function toDuration(minutes) {
  const value = Number(minutes || 0);
  if (!value || value < 1) return "-";
  const h = Math.floor(value / 60);
  const m = value % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function mapMovie(movie) {
  const releaseDate = movie.release_date
    ? new Date(movie.release_date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    : "TBA";

  return {
    id: movie.id,
    title: movie.title,
    genre: movie.description || "General",
    duration: toDuration(movie.duration_min),
    rating: movie.rating || "NR",
    badge: movie.rating || "PG",
    releaseDate,
    poster: movie.poster_url || FALLBACK_POSTER
  };
}

function statusFromOccupancy(booked, total) {
  if (total <= 0) return "available";
  if (booked >= total) return "soldout";
  const ratio = booked / total;
  if (ratio >= 0.75) return "filling";
  return "available";
}

function mapShowtime(s) {
  const start = new Date(s.start_time);
  const totalSeats = Number(s.screen_total_seats || 0);
  const bookedSeats = 0;
  return {
    id: s.id,
    movieId: s.movie_id,
    movie: s.movie_title || "-",
    screen: s.screen_name || "-",
    time: start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    seats: `${bookedSeats}/${totalSeats}`,
    status: statusFromOccupancy(bookedSeats, totalSeats)
  };
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [moviesError, setMoviesError] = useState("");
  const [showtimes, setShowtimes] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadDashboardMovies() {
      try {
        setLoadingMovies(true);
        setMoviesError("");

        const [nowShowing, comingSoon, dbShowtimes] = await Promise.all([
          listMovies({ status: "NOW_SHOWING", limit: 50 }),
          listMovies({ status: "COMING_SOON", limit: 50 }),
          listShowtimes({ limit: 200 })
        ]);

        if (!mounted) return;

        setNowShowingMovies(nowShowing.map(mapMovie));
        setComingSoonMovies(comingSoon.map(mapMovie));
        setShowtimes(dbShowtimes.slice(0, 8).map(mapShowtime));
      } catch (err) {
        if (mounted) {
          setMoviesError(err.message || "Failed to load movies from database.");
        }
      } finally {
        if (mounted) {
          setLoadingMovies(false);
        }
      }
    }

    loadDashboardMovies();

    return () => {
      mounted = false;
    };
  }, []);

  const kpis = useMemo(
    () => [
      { color: "blue", icon: "🎬", label: "Now Showing", value: String(nowShowingMovies.length), hint: "From PostgreSQL" },
      { color: "green", icon: "🗓️", label: "Coming Soon", value: String(comingSoonMovies.length), hint: "From PostgreSQL" },
      { color: "purple", icon: "🎟️", label: "Total Movies", value: String(nowShowingMovies.length + comingSoonMovies.length), hint: "NOW_SHOWING + COMING_SOON" },
      { color: "orange", icon: "💲", label: "Revenue", value: "-", hint: "Connect payments data" },
    ],
    [comingSoonMovies.length, nowShowingMovies.length]
  );

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [range, setRange] = useState("week");

  const filteredMovies = nowShowingMovies.filter((m) => {
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
              <div className="admin-muted">Now Showing / Coming Soon connected to PostgreSQL</div>
            </div>

            <div className="admin-actionsRight" />
          </div>

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

          <section className="admin-toolbar">
            <div className="admin-search">
              <span className="admin-searchIcon">🔎</span>
              <input
                className="admin-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search now showing movies..."
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

          {moviesError && <div className="admin-muted" style={{ marginBottom: 12 }}>{moviesError}</div>}

          <section className="admin-mainGrid">
            <div>
              <section className="admin-section">
                <div className="admin-sectionHead">
                  <h3>Now Showing</h3>
                  <div className="admin-muted">Live from PostgreSQL movies table</div>
                </div>

                {loadingMovies ? (
                  <div className="admin-muted">Loading now showing movies...</div>
                ) : (
                  <div className="movie-grid">
                    {filteredMovies.map((m) => (
                      <div key={m.id} className="movie-card">
                        <div className="movie-poster">
                          <img
                            className="movie-posterImg"
                            src={m.poster}
                            alt={m.title}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_POSTER;
                            }}
                          />
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
                )}
              </section>

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
                              onClick={() =>
                                navigate(
                                  s.movieId
                                    ? `/admin/showtimes/schedule/${s.movieId}`
                                    : "/admin/showtimes"
                                )
                              }
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                      {showtimes.length === 0 && (
                        <tr>
                          <td colSpan={6} className="admin-muted" style={{ padding: 16 }}>
                            No showtimes found in schedules database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="admin-section" style={{ marginTop: 22 }}>
                <div className="admin-sectionHead">
                  <h3>Coming Soon</h3>
                  <div className="admin-muted">Live from PostgreSQL movies table</div>
                </div>

                {loadingMovies ? (
                  <div className="admin-muted">Loading coming soon movies...</div>
                ) : (
                  <div className="coming-grid">
                    {comingSoonMovies.map((c) => (
                      <div key={c.id} className="coming-card">
                        <div className="coming-img">
                          <img
                            className="coming-posterImg"
                            src={c.poster}
                            alt={c.title}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_POSTER;
                            }}
                          />
                          <div className="coming-badge">Coming Soon</div>
                        </div>
                        <div className="coming-body">
                          <p className="coming-title">{c.title}</p>
                          <p className="coming-date">{c.releaseDate || "TBA"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <footer className="admin-footer">© 2025 Cinema Listic. All rights reserved.</footer>
            </div>

            <QuickBooking movies={[...nowShowingMovies, ...comingSoonMovies]} />
          </section>
        </main>
      </div>
    </div>
  );
}
