import "../styles/customer.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookTicketsPage() {
  const navigate = useNavigate();

  const movies = useMemo(
    () => [
      {
        id: "last-adventure",
        title: "The Last Adventure",
        genre: "Action, Sci-Fi",
        rating: 4.5,
        duration: "2h 15m",
        posterClass: "cf-bookPoster",
      },
      {
        id: "hearts-entwined",
        title: "Hearts Entwined",
        genre: "Drama, Romance",
        rating: 4.2,
        duration: "1h 58m",
        posterClass: "cf-bookPoster alt",
      },
    ],
    []
  );

  const [selectedMovieId, setSelectedMovieId] = useState(movies[0].id);

  const selectedMovie = useMemo(
    () => movies.find((m) => m.id === selectedMovieId) || movies[0],
    [movies, selectedMovieId]
  );

  function handleContinue() {
    // (optional) store selection so BookTime can read it
    localStorage.setItem(
      "cinemaFlow_booking",
      JSON.stringify({
        movie: selectedMovie,
      })
    );

    navigate("/customer/book/time");
  }

  return (
    <div className="cf-page">
      {/* Top booking header */}
      <div className="cf-bookTop">
        <button
          className="cf-bookBack"
          type="button"
          onClick={() => navigate("/customer/movies")}
        >
          ← Back to Movies
        </button>

        <div className="cf-bookTitle">
          <span className="cf-bookIcon">🎟️</span>
          <span>Book Tickets</span>
        </div>
      </div>

      {/* Steps */}
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

      {/* Main grid */}
      <main className="cf-mainFull">
        <div className="cf-container cf-container--full">
          <div className="cf-bookGrid">
            {/* Left: movies */}
            <div className="cf-card cf-bookLeft">
              <h3 className="cf-h3">Select a Movie</h3>

              <div className="cf-bookMovieGrid">
                {movies.map((m) => {
                  const isSelected = m.id === selectedMovieId;
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
                      <div className={m.posterClass} />

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

            {/* Right: summary */}
            <div className="cf-card cf-bookRight">
              <h3 className="cf-h3">🎟️ Booking Summary</h3>

              <div className="cf-bookSummaryPoster" />

              <div className="cf-bookSummaryName">{selectedMovie.title}</div>
              <div className="cf-muted">{selectedMovie.genre}</div>

              <div className="cf-bookInfo">
                <div className="cf-bookInfoRow">
                  <span>📅 Date</span>
                  <span>Nov 25, 2024</span>
                </div>
                <div className="cf-bookInfoRow">
                  <span>🕒 Time</span>
                  <span>07:45 PM</span>
                </div>
                <div className="cf-bookInfoRow">
                  <span>📍 Theater</span>
                  <span>CinemaFlow Downtown</span>
                </div>
              </div>

              <div className="cf-bookBill">
                <div className="cf-bookBillRow">
                  <span>Adult × 2</span>
                  <span>$30.00</span>
                </div>
                <div className="cf-bookBillRow">
                  <span>Subtotal</span>
                  <span>$30.00</span>
                </div>
                <div className="cf-bookBillRow">
                  <span>Tax (8%)</span>
                  <span>$2.40</span>
                </div>
              </div>

              <div className="cf-bookTotal">
                <span>Total</span>
                <span className="cf-price">$32.40</span>
              </div>

              <button
                className="cf-orangeBtn"
                type="button"
                onClick={handleContinue}
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
