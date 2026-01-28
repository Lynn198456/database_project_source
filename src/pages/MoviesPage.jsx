import "../styles/customer.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";

const MOVIES = [
  {
    id: "m1",
    title: "The Last Adventure",
    genre: "Action, Sci-Fi",
    rating: 4.5,
    duration: "2h 15m",
    age: "PG-13",
    poster:
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "m2",
    title: "Hearts Entwined",
    genre: "Drama, Romance",
    rating: 4.2,
    duration: "1h 58m",
    age: "PG",
    poster:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "m3",
    title: "Midnight Shadows",
    genre: "Horror, Thriller",
    rating: 4.3,
    duration: "2h 05m",
    age: "R",
    poster:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "m4",
    title: "Laugh Out Loud",
    genre: "Comedy",
    rating: 4.0,
    duration: "1h 42m",
    age: "PG-13",
    poster:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function MoviesPage() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState("Popular"); // Popular | Rating | Duration

  const genres = useMemo(() => {
    const all = new Set(["All"]);
    MOVIES.forEach((m) => {
      m.genre.split(",").forEach((g) => all.add(g.trim()));
    });
    return Array.from(all);
  }, []);

  const filtered = useMemo(() => {
    let list = [...MOVIES];

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
      const toMin = (d) => {
        const h = parseInt(d.split("h")[0], 10) || 0;
        const m =
          parseInt(d.split("h")[1]?.replace("m", "").trim(), 10) || 0;
        return h * 60 + m;
      };
      list.sort((a, b) => toMin(b.duration) - toMin(a.duration));
    }

    return list;
  }, [q, genre, sort]);

  function onBook(movie) {
    // Save selected movie to booking draft (your existing flow)
    const draft = {
      movieId: movie.id,
      movieTitle: movie.title,
      genre: movie.genre,
      poster: movie.poster,
      rating: movie.rating,
      duration: movie.duration,
      age: movie.age,
    };
    localStorage.setItem("cinemaFlow_booking", JSON.stringify(draft));
    navigate("/customer/book");
  }

  function onDetails(movie) {
    // Save selected movie for detail page to read
    localStorage.setItem("cinemaFlow_selectedMovie", JSON.stringify(movie));

    // Go to detail route you added in App.jsx
    navigate(`/customer/movies/${movie.id}`);
  }

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          {/* Header */}
          <div className="cf-moviesHead">
            <div>
              <div className="cf-moviesTitle">
                <span className="cf-miniIcon cf-miniIcon--gold">🎬</span>
                All Movies
              </div>
              <div className="cf-moviesSub">
                Browse our collection and book instantly
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

          {/* Grid */}
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
                    <span>⭐ {m.rating}</span>
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

          {filtered.length === 0 && (
            <div className="cf-empty">
              No movies found. Try another keyword or genre.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
