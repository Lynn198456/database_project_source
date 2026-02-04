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
      img: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=60",
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
      img: "https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0d?auto=format&fit=crop&w=1200&q=60",
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
