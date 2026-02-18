import "../styles/customer.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/customer/Navbar";
import { listMovies } from "../api/movies";

function toDuration(minutes) {
  const value = Number(minutes || 0);
  if (!value || value < 1) return "-";
  const h = Math.floor(value / 60);
  const m = value % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function mapMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    genre: movie.description || "General",
    rating: Number.parseFloat(movie.rating) || 0,
    ratingLabel: movie.rating || "NR",
    durationMin: Number(movie.duration_min || 0),
    duration: toDuration(movie.duration_min),
    age: movie.rating || "PG",
    poster:
      movie.poster_url ||
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=60",
    status: movie.status || "COMING_SOON",
    releaseDate: movie.release_date ? new Date(movie.release_date).toISOString() : null
  };
}

export default function MoviesPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("Popular");

  useEffect(() => {
    let mounted = true;

    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const [nowShowing, comingSoon] = await Promise.all([
          listMovies({ status: "NOW_SHOWING", limit: 300 }),
          listMovies({ status: "COMING_SOON", limit: 300 })
        ]);

        if (!mounted) return;

        const merged = [...nowShowing, ...comingSoon].map(mapMovie);
        setMovies(merged);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load movies.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      mounted = false;
    };
  }, []);

  const genres = useMemo(() => {
    const all = new Set(["All"]);
    movies.forEach((m) => {
      m.genre.split(",").forEach((g) => all.add(g.trim()));
    });
    return Array.from(all);
  }, [movies]);

  const filtered = useMemo(() => {
    let list = [...movies];

    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(s) ||
          m.genre.toLowerCase().includes(s)
      );
    }

    if (genre !== "All") {
      list = list.filter((m) =>
        m.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    if (sort === "Rating") {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === "Duration") {
      list.sort((a, b) => b.durationMin - a.durationMin);
    } else if (sort === "Popular") {
      list.sort((a, b) => {
        if (a.status === b.status) return b.rating - a.rating;
        return a.status === "NOW_SHOWING" ? -1 : 1;
      });
    }

    return list;
  }, [movies, q, genre, sort]);

  function onBook(movie) {
    const draft = {
      movieId: movie.id,
      movieTitle: movie.title,
      genre: movie.genre,
      poster: movie.poster,
      rating: movie.ratingLabel,
      duration: movie.duration,
      age: movie.age,
    };
    localStorage.setItem("cinemaFlow_booking", JSON.stringify(draft));
    navigate("/customer/book");
  }

  function onDetails(movie) {
    localStorage.setItem("cinemaFlow_selectedMovie", JSON.stringify(movie));
    navigate(`/customer/movies/${movie.id}`);
  }

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          <div className="cf-moviesHead">
            <div>
              <div className="cf-moviesTitle">
                <span className="cf-miniIcon cf-miniIcon--gold">🎬</span>
                All Movies
              </div>
              <div className="cf-moviesSub">
                Connected to PostgreSQL movie database
              </div>
            </div>

            <div className="cf-moviesControls">
              <div className="cf-searchWrap">
                <span className="cf-searchIcon">🔎</span>
                <input
                  className="cf-searchInput"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search movies..."
                />
              </div>

              <select
                className="cf-select"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <select
                className="cf-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="Popular">Popular</option>
                <option value="Rating">Top Rating</option>
                <option value="Duration">Longest</option>
              </select>
            </div>
          </div>

          {error && <div className="cf-empty">{error}</div>}

          {loading ? (
            <div className="cf-empty">Loading movies from database...</div>
          ) : (
            <div className="cf-movieGrid">
              {filtered.map((m) => (
                <div key={m.id} className="cf-movieCard">
                  <div
                    className="cf-moviePoster"
                    style={{ backgroundImage: `url(${m.poster})` }}
                  >
                    <div className="cf-movieBadge">{m.age}</div>
                  </div>

                  <div className="cf-movieBody">
                    <div className="cf-movieName">{m.title}</div>
                    <div className="cf-muted">{m.genre}</div>

                    <div className="cf-movieMetaRow">
                      <span>⭐ {m.ratingLabel}</span>
                      <span>🕒 {m.duration}</span>
                    </div>

                    <div className="cf-movieActions">
                      <button
                        className="cf-orangeBtn"
                        type="button"
                        onClick={() => onBook(m)}
                      >
                        Book Tickets
                      </button>

                      <button
                        className="cf-grayBtn"
                        type="button"
                        onClick={() => onDetails(m)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="cf-empty">
              No movies found. Try another keyword or genre.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
