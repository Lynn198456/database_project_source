import "../styles/customer.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listMovies } from "../api/movies";

const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=60";

function toDuration(minutes) {
  const value = Number(minutes || 0);
  if (!value) return "-";
  const h = Math.floor(value / 60);
  const m = value % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function mapMovie(m) {
  return {
    id: m.id,
    title: m.title,
    genre: m.description || "General",
    rating: m.rating || "NR",
    duration: toDuration(m.duration_min),
    poster: m.poster_url || FALLBACK_POSTER
  };
}

export default function BookTicketsPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadMovies() {
      try {
        setError("");
        const rows = await listMovies({ status: "NOW_SHOWING", limit: 200 });
        if (!mounted) return;
        const mapped = rows.map(mapMovie);
        setMovies(mapped);
        if (mapped.length > 0) setSelectedMovieId(mapped[0].id);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load movies.");
        }
      }
    }

    loadMovies();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedMovie = useMemo(
    () => movies.find((m) => Number(m.id) === Number(selectedMovieId)) || movies[0],
    [movies, selectedMovieId]
  );

  function handleContinue() {
    if (!selectedMovie) return;
    localStorage.setItem(
      "cinemaFlow_booking",
      JSON.stringify({
        movieId: selectedMovie.id,
        movieTitle: selectedMovie.title,
        genre: selectedMovie.genre,
        rating: selectedMovie.rating,
        duration: selectedMovie.duration,
        poster: selectedMovie.poster
      })
    );
    navigate("/customer/book/time");
  }

  return (
    <div className="cf-page">
      <div className="cf-bookTop">
        <button className="cf-bookBack" type="button" onClick={() => navigate("/customer/movies")}>
          ← Back to Movies
        </button>

        <div className="cf-bookTitle">
          <span className="cf-bookIcon">🎟️</span>
          <span>Book Tickets</span>
        </div>
      </div>

      <div className="cf-bookSteps">
        <div className="cf-step active">
          <div className="cf-stepDot">🎬</div>
          <div>Select Movie</div>
        </div>
        <div className="cf-step">
          <div className="cf-stepDot">🕒</div>
          <div>Choose Time</div>
        </div>
        <div className="cf-step">
          <div className="cf-stepDot">💺</div>
          <div>Select Seats</div>
        </div>
        <div className="cf-step">
          <div className="cf-stepDot">💳</div>
          <div>Payment</div>
        </div>
      </div>

      <main className="cf-mainFull">
        <div className="cf-container cf-container--full">
          {error ? <div className="cf-empty">{error}</div> : null}
          <div className="cf-bookGrid">
            <div className="cf-card cf-bookLeft">
              <h3 className="cf-h3">Select a Movie</h3>

              <div className="cf-bookMovieGrid">
                {movies.map((m) => {
                  const isSelected = Number(m.id) === Number(selectedMovieId);
                  return (
                    <div
                      key={m.id}
                      className={`cf-bookMovieCard ${isSelected ? "selected" : ""}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedMovieId(m.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") setSelectedMovieId(m.id);
                      }}
                    >
                      <div
                        className="cf-bookPoster"
                        style={{
                          backgroundImage: `url(${m.poster || FALLBACK_POSTER})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center"
                        }}
                      />

                      <div className="cf-bookMovieMeta">
                        <div className="cf-bookMovieName">{m.title}</div>
                        <div className="cf-muted">{m.genre}</div>
                        <div className="cf-bookMovieRow">
                          <span>⭐ {m.rating}</span>
                          <span>{m.duration}</span>
                        </div>
                      </div>

                      {isSelected && <div className="cf-selectedTick">✓</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="cf-card cf-bookRight">
              <h3 className="cf-h3">🎟️ Booking Summary</h3>
              <div
                className="cf-bookSummaryPoster"
                style={{
                  backgroundImage: `url(${selectedMovie?.poster || FALLBACK_POSTER})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              />

              <div className="cf-bookSummaryName">{selectedMovie?.title || "-"}</div>
              <div className="cf-muted">{selectedMovie?.genre || "-"}</div>

              <div className="cf-bookInfo">
                <div className="cf-bookInfoRow">
                  <span>🕒 Duration</span>
                  <span>{selectedMovie?.duration || "-"}</span>
                </div>
                <div className="cf-bookInfoRow">
                  <span>⭐ Rating</span>
                  <span>{selectedMovie?.rating || "-"}</span>
                </div>
              </div>

              <button className="cf-orangeBtn" type="button" onClick={handleContinue} disabled={!selectedMovie}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
