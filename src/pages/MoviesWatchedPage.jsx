import "../styles/customer.css";
import "../styles/moviesWatched.css";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";

const WATCH_HISTORY = [
  {
    id: "w1",
    title: "The Last Adventure",
    genre: "Action",
    date: "Jan 25, 2026",
    theater: "Cinema Listic Downtown",
    duration: "2h 15m",
    price: 15,
    rating: 5,
    poster:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "w2",
    title: "Hearts Entwined",
    genre: "Romance",
    date: "Jan 20, 2026",
    theater: "Cinema Listic Mall Location",
    duration: "1h 58m",
    price: 15,
    rating: 4,
    poster:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "w3",
    title: "Midnight Shadows",
    genre: "Thriller",
    date: "Jan 15, 2026",
    theater: "Cinema Listic Downtown",
    duration: "2h 05m",
    price: 18,
    rating: 5,
    poster:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop",
  },
];

function parseDurationToMinutes(d) {
  // "2h 15m"
  const h = parseInt(d.split("h")[0], 10) || 0;
  const m = parseInt(d.split("h")[1]?.replace("m", "").trim(), 10) || 0;
  return h * 60 + m;
}

function Stars({ value = 0 }) {
  const filled = Math.max(0, Math.min(5, value));
  return (
    <div className="mw-stars" aria-label={`Rating ${filled} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < filled ? "mw-star mw-starOn" : "mw-star"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function MoviesWatchedPage() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalMovies = WATCH_HISTORY.length;

    const totalSpent = WATCH_HISTORY.reduce((sum, x) => sum + (x.price || 0), 0);

    const totalMinutes = WATCH_HISTORY.reduce(
      (sum, x) => sum + parseDurationToMinutes(x.duration || "0h 0m"),
      0
    );
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // 1 decimal

    const avgRating =
      totalMovies === 0
        ? 0
        : Math.round(
            (WATCH_HISTORY.reduce((sum, x) => sum + (x.rating || 0), 0) / totalMovies) * 10
          ) / 10;

    // genre counts
    const counts = {};
    for (const w of WATCH_HISTORY) {
      const g = w.genre || "Other";
      counts[g] = (counts[g] || 0) + 1;
    }
    const genreRows = Object.entries(counts)
      .map(([genre, count]) => ({
        genre,
        count,
        pct: totalMovies ? Math.round((count / totalMovies) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { totalMovies, totalSpent, totalHours, avgRating, genreRows };
  }, []);

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide mw-wrap">
          {/* Top header row */}
          <div className="mw-top">
            <button className="mw-back" type="button" onClick={() => navigate("/customer/profile")}>
              ←
            </button>

            <div className="mw-titleBlock">
              <div className="mw-chip">
                <span className="mw-chipIcon">🎞️</span>
              </div>
              <div>
                <div className="mw-title">Movies Watched</div>
                <div className="mw-sub">Your viewing stats & watch history</div>
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mw-cards">
            <div className="mw-card mw-cardBlue">
              <div className="mw-cardLabel">Total Movies</div>
              <div className="mw-cardValue">{stats.totalMovies}</div>
            </div>

            <div className="mw-card mw-cardOrange">
              <div className="mw-cardLabel">Avg Rating</div>
              <div className="mw-cardValue">{stats.avgRating}</div>
            </div>

            <div className="mw-card mw-cardPurple">
              <div className="mw-cardLabel">Total Hours</div>
              <div className="mw-cardValue">{stats.totalHours}h</div>
            </div>

            <div className="mw-card mw-cardGreen">
              <div className="mw-cardLabel">Total Spent</div>
              <div className="mw-cardValue">฿{stats.totalSpent}</div>
            </div>
          </div>

          {/* Favorite genres */}
          <div className="mw-panel">
            <div className="mw-panelHead">
              <div className="mw-panelTitle">📈 Favorite Genres</div>
            </div>

            <div className="mw-genres">
              {stats.genreRows.map((g) => (
                <div key={g.genre} className="mw-genreRow">
                  <div className="mw-genreName">{g.genre}</div>

                  <div className="mw-barWrap">
                    <div className="mw-bar" style={{ width: `${g.pct}%` }} />
                  </div>

                  <div className="mw-genreRight">
                    {g.count} movies ({g.pct}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Watch history */}
          <div className="mw-panel">
            <div className="mw-panelHead">
              <div className="mw-panelTitle">🎬 Watch History</div>
            </div>

            <div className="mw-history">
              {WATCH_HISTORY.map((w) => (
                <div key={w.id} className="mw-row">
                  <div
                    className="mw-poster"
                    style={{ backgroundImage: `url(${w.poster})` }}
                  />

                  <div className="mw-info">
                    <div className="mw-rowTitle">{w.title}</div>
                    <div className="mw-tag">{w.genre}</div>

                    <div className="mw-meta">
                      <div className="mw-metaItem">📅 {w.date}</div>
                      <div className="mw-metaItem">📍 {w.theater}</div>
                      <div className="mw-metaItem">🕒 {w.duration}</div>
                    </div>

                    <div className="mw-price">฿{w.price}.00</div>
                  </div>

                  <div className="mw-right">
                    <Stars value={w.rating} />
                    <button
                      className="mw-watchBtn"
                      type="button"
                      onClick={() => navigate("/customer/movies")}
                    >
                      Watch Again
                    </button>
                  </div>
                </div>
              ))}

              {WATCH_HISTORY.length === 0 && (
                <div className="mw-empty">No watch history yet.</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
