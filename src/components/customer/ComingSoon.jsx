import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listMovies } from "../../api/movies";

function mapMovie(movie) {
  const release = movie.release_date ? new Date(movie.release_date) : null;
  const dateLabel = release
    ? release.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    : "TBA";

  return {
    id: movie.id,
    title: movie.title,
    date: dateLabel,
    img:
      movie.poster_url ||
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=60"
  };
}

export default function ComingSoon() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadComingSoon() {
      try {
        const data = await listMovies({ status: "COMING_SOON", limit: 12 });
        if (mounted) setMovies(data.map(mapMovie));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadComingSoon();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-section__icon cf-icon--pink">✨</span>
          Coming Soon
        </div>
        <Link className="cf-section__link" to="/customer/movies">
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="cf-comingDate">Loading coming soon movies...</div>
      ) : (
        <div className="cf-comingGrid">
          {movies.map((m) => (
            <div key={m.id} className="cf-comingCard">
              <img className="cf-comingPoster" src={m.img} alt={m.title} />
              <div className="cf-comingBody">
                <div className="cf-comingTitle">{m.title}</div>
                <div className="cf-comingDate">{m.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
