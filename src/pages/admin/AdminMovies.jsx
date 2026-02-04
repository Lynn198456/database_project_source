import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin/adminMovies.css";

export default function AdminMoviesPage() {
  const navigate = useNavigate();
  // Demo data (replace with API later)
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "The Last Adventure",
      genre: "Action, Sci-Fi",
      duration: "2h 15m",
      rating: "PG-13",
      shows: 8,
      status: "ACTIVE",
      releaseDate: "Nov 25, 2024",
      img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 2,
      title: "Hearts Entwined",
      genre: "Drama, Romance",
      duration: "1h 58m",
      rating: "PG",
      shows: 6,
      status: "ACTIVE",
      releaseDate: "Nov 28, 2024",
      img: "/assets/hearts-entwined.jpg",
    },
    {
      id: 3,
      title: "Midnight Shadows",
      genre: "Horror, Thriller",
      duration: "2h 05m",
      rating: "R",
      shows: 4,
      status: "ACTIVE",
      releaseDate: "Dec 10, 2024",
      img: "data:image/jpeg;base64,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",
    },
    {
      id: 4,
      title: "Future World",
      genre: "Sci-Fi, Adventure",
      duration: "2h 30m",
      rating: "PG-13",
      shows: 0,
      status: "COMING_SOON",
      releaseDate: "Dec 15, 2024",
      img: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=60",
    },
    {
      id: 5,
      title: "Love in Paris",
      genre: "Romance",
      duration: "1h 50m",
      rating: "PG",
      shows: 0,
      status: "COMING_SOON",
      releaseDate: "Dec 22, 2024",
      img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=60",
    },
  ]);

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [view, setView] = useState("GRID"); // GRID | LIST

  const genres = useMemo(() => {
    const set = new Set();
    movies.forEach((m) => {
      (m.genre || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((g) => set.add(g));
    });
    return ["ALL", ...Array.from(set)];
  }, [movies]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return movies.filter((m) => {
      const matchesSearch =
        !q ||
        m.title.toLowerCase().includes(q) ||
        (m.genre || "").toLowerCase().includes(q);

      const matchesGenre =
        genreFilter === "ALL" ||
        (m.genre || "")
          .split(",")
          .map((x) => x.trim())
          .includes(genreFilter);

      const matchesStatus = statusFilter === "ALL" || m.status === statusFilter;

      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [movies, search, genreFilter, statusFilter]);

  function onAddMovie() {
    navigate("/admin/movies/edit/new");
  }

  function onEdit(movie) {
    navigate(`/admin/movies/edit/${movie.id}`);
  }

  function onDelete(movie) {
    const ok = confirm(`Delete "${movie.title}"?`);
    if (!ok) return;
    setMovies((prev) => prev.filter((x) => x.id !== movie.id));
  }

  function statusBadgeText(s) {
    if (s === "COMING_SOON") return "Coming Soon";
    if (s === "INACTIVE") return "Inactive";
    return "Active";
  }

  return (
    <div className="am-page">
      <AdminNavbar />

      <div className="am-container">
        {/* Header */}
        <div className="am-header">
          <div className="am-titleWrap">
            <div className="am-icon">🎞️</div>
            <div>
              <h1 className="am-title">Movies Management</h1>
              <p className="am-sub">Browse our collection</p>
            </div>
          </div>

          <button className="am-addBtn" onClick={onAddMovie}>
            <span className="am-plus">＋</span> Add New Movie
          </button>
        </div>

        {/* Filters */}
        <div className="am-filters">
          <div className="am-search">
            <span className="am-searchIcon">🔎</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, genre, or actor..."
            />
          </div>

          <select
            className="am-select"
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {genres.map((g) => (
              <option key={g} value={g}>
                {g === "ALL" ? "All Genres" : g}
              </option>
            ))}
          </select>

          <select
            className="am-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMING_SOON">Coming Soon</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        {/* View toggle */}
        <div className="am-viewToggle">
          <button
            className={`am-toggleBtn ${view === "GRID" ? "active" : ""}`}
            onClick={() => setView("GRID")}
          >
            ⬛ Grid View
          </button>
          <button
            className={`am-toggleBtn ${view === "LIST" ? "active" : ""}`}
            onClick={() => setView("LIST")}
          >
            ☰ List View
          </button>

          <div className="am-count">
            Showing <strong>{filtered.length}</strong> movies
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 ? (
          <div className="am-empty">
            <div className="am-emptyTitle">No movies found</div>
            <div className="am-emptySub">Try a different search or filter.</div>
          </div>
        ) : view === "GRID" ? (
          <div className="am-grid">
            {filtered.map((m) => (
              <div key={m.id} className="am-card">
                <div className="am-img" style={{ backgroundImage: `url(${m.img})` }}>
                  <div className="am-topBadges">
                    <span className="am-pill am-pillRating">{m.rating}</span>
                    <span className={`am-pill am-pillStatus ${m.status}`}>
                      {statusBadgeText(m.status)}
                    </span>
                  </div>

                  {/* Optional hover CTA like your screenshot */}
                  <button
                    className="am-hoverCTA"
                    onClick={() => navigate(`/admin/movies/edit/${m.id}`)}
                  >
                    ▶ View Details
                  </button>
                </div>

                <div className="am-body">
                  <div className="am-name">{m.title}</div>
                  <div className="am-genre">{m.genre}</div>

                  <div className="am-meta">
                    <div>🕒 {m.duration}</div>
                    <div>🎬 Shows: {m.shows}</div>
                  </div>

                  <div className="am-meta2">
                    <div>📅 {m.releaseDate}</div>
                    <div className="am-score">⭐ 4.3/5</div>
                  </div>

                  <div className="am-actions">
                    <button className="am-editBtn" onClick={() => onEdit(m)}>
                      ✎ Edit
                    </button>
                    <button className="am-delBtn" onClick={() => onDelete(m)} title="Delete">
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
       ) : (
  <div className="am-list">
    {filtered.map((m) => (
      <div key={m.id} className="am-rowCard">
        {/* Left: Poster */}
        <div className="am-rowPoster" style={{ backgroundImage: `url(${m.img})` }}>
          <span className="am-rowRating">{m.rating}</span>
        </div>

        {/* Middle: Info */}
        <div className="am-rowInfo">
          <div className="am-rowTop">
            <div>
              <div className="am-rowTitleText">{m.title}</div>
              <div className="am-rowGenre">{m.genre}</div>
            </div>

            {/* Right: Score badge */}
            <div className="am-rowScore">
              ⭐ <span>{(m.score ?? "4.5")}/5</span>
            </div>
          </div>

          {/* Meta icons row */}
          <div className="am-rowMeta">
            <div className="am-metaItem">🕒 {m.duration}</div>
            <div className="am-metaItem">🎞 {m.screens ?? 2} Screens</div>
            <div className="am-metaItem">▶ {m.shows ?? 10} Shows</div>
          </div>

          {/* Buttons */}
          <div className="am-rowActions">
            <button className="am-editLong" onClick={() => onEdit(m)}>
              ✎ Edit Movie
            </button>

            <button className="am-delLong" onClick={() => onDelete(m)}>
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
)
}

        <footer className="am-footer">© 2025 Cinema Listic. All rights reserved.</footer>
      </div>
    </div>
  );
}
