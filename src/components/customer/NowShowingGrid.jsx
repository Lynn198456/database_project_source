import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listMovies } from "../../api/movies";

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
    genres: movie.description || "No description",
    rating: movie.rating || "NR",
    duration: toDuration(movie.duration_min),
    age: movie.rating || "PG",
    img:
      movie.poster_url ||
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=60"
  };
}

export default function NowShowingGrid() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadNowShowing() {
      try {
        const data = await listMovies({ status: "NOW_SHOWING", limit: 12 });
        if (mounted) setMovies(data.map(mapMovie));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadNowShowing();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-section__icon cf-icon--orange">🎞️</span>
          Now Showing
        </div>
        <Link className="cf-section__link" to="/customer/movies">
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="cf-comingDate">Loading now showing movies...</div>
      ) : (
        <div className="cf-movieGrid">
          {movies.map((m) => (
            <article key={m.id} className="cf-movieCard">
              <div className="cf-movieCard__imgWrap">
                <img className="cf-movieCard__img" src={m.img} alt={m.title} />
                <span className="cf-badge">{m.age}</span>
              </div>

              <div className="cf-movieCard__body">
                <div className="cf-movieCard__title">{m.title}</div>
                <div className="cf-movieCard__genres">{m.genres}</div>

                <div className="cf-movieCard__meta">
                  <span>⭐ {m.rating}</span>
                  <span>🕒 {m.duration}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
