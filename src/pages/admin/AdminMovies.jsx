import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { deleteMovie, listMovies } from "../../api/movies";
import "../../styles/admin/adminMovies.css";

function mapMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    genre: movie.description || "N/A",
    duration: `${movie.duration_min || 0}m`,
    rating: movie.rating || "PG",
    shows: 0,
    status: movie.status,
    releaseDate: movie.release_date ? String(movie.release_date).slice(0, 10) : "-",
    img:
      movie.poster_url ||
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=60"
  };
}

export default function AdminMoviesPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [view, setView] = useState("GRID");

  useEffect(() => {
    let mounted = true;

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");
        const data = await listMovies({ limit: 500 });
        if (!mounted) return;
        setMovies(data.map(mapMovie));
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load movies.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMovies();

    return () => {
      mounted = false;
    };
  }, []);

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

  async function onDelete(movie) {
    const ok = confirm(`Delete "${movie.title}"?`);
    if (!ok) return;

    try {
      await deleteMovie(movie.id);
      setMovies((prev) => prev.filter((x) => x.id !== movie.id));
    } catch (err) {
      alert(err.message || "Failed to delete movie.");
    }
  }

  function statusBadgeText(s) {
    if (s === "COMING_SOON") return "Coming Soon";
    if (s === "ARCHIVED") return "Archived";
    return "Now Showing";
  }

  return (
    <div className="am-page">
      <AdminNavbar />

      <div className="am-container">
        <div className="am-header">
          <div className="am-titleWrap">
            <div className="am-icon">🎞️</div>
            <div>
              <h1 className="am-title">Movies Management</h1>
              <p className="am-sub">Data source: PostgreSQL movies table</p>
            </div>
          </div>

          <button className="am-addBtn" onClick={onAddMovie}>
            <span className="am-plus">＋</span> Add New Movie
          </button>
        </div>

        {error && <div className="am-empty" style={{ marginBottom: 12 }}>{error}</div>}

        <div className="am-filters">
          <div className="am-search">
            <span className="am-searchIcon">🔎</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description..."
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
            <option value="NOW_SHOWING">Now Showing</option>
            <option value="COMING_SOON">Coming Soon</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

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
            {loading ? "Loading..." : <>Showing <strong>{filtered.length}</strong> movies</>}
          </div>
        </div>

        {loading ? (
          <div className="am-empty">
            <div className="am-emptyTitle">Loading movies...</div>
            <div className="am-emptySub">Fetching from PostgreSQL.</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="am-empty">
            <div className="am-emptyTitle">No movies found</div>
            <div className="am-emptySub">Try a different search/filter or add a new movie.</div>
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
                <div className="am-rowPoster" style={{ backgroundImage: `url(${m.img})` }}>
                  <span className="am-rowRating">{m.rating}</span>
                </div>

                <div className="am-rowInfo">
                  <div className="am-rowTop">
                    <div>
                      <div className="am-rowTitleText">{m.title}</div>
                      <div className="am-rowGenre">{m.genre}</div>
                    </div>

                    <div className="am-rowScore">
                      ⭐ <span>{(m.score ?? "4.5")}/5</span>
                    </div>
                  </div>

                  <div className="am-rowMeta">
                    <div className="am-metaItem">🕒 {m.duration}</div>
                    <div className="am-metaItem">🎞 {m.screens ?? 2} Screens</div>
                    <div className="am-metaItem">▶ {m.shows ?? 0} Shows</div>
                  </div>

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
        )}

        <footer className="am-footer">© 2025 Cinema Listic. All rights reserved.</footer>
      </div>
    </div>
  );
}
