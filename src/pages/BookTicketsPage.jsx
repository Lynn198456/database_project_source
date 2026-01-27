import "../styles/customer.css";
import { useNavigate } from "react-router-dom";

export default function BookTicketsPage() {
  const navigate = useNavigate();

  return (
    <div className="cf-page">
      {/* Top booking header */}
      <div className="cf-bookTop">
        <button className="cf-bookBack" onClick={() => navigate("/customer/movies")}>
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
                <div className="cf-bookMovieCard selected">
                  <div className="cf-bookPoster" />
                  <div className="cf-bookMovieMeta">
                    <div className="cf-bookMovieName">The Last Adventure</div>
                    <div className="cf-muted">Action, Sci-Fi</div>
                    <div className="cf-bookMovieRow">
                      <span>⭐ 4.5</span>
                      <span>2h 15m</span>
                    </div>
                  </div>
                  <div className="cf-selectedTick">✓</div>
                </div>

                <div className="cf-bookMovieCard">
                  <div className="cf-bookPoster alt" />
                  <div className="cf-bookMovieMeta">
                    <div className="cf-bookMovieName">Hearts Entwined</div>
                    <div className="cf-muted">Drama, Romance</div>
                    <div className="cf-bookMovieRow">
                      <span>⭐ 4.2</span>
                      <span>1h 58m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: summary */}
            <div className="cf-card cf-bookRight">
              <h3 className="cf-h3">🎟️ Booking Summary</h3>

              <div className="cf-bookSummaryPoster" />

              <div className="cf-bookSummaryName">The Last Adventure</div>
              <div className="cf-muted">Action, Sci-Fi</div>

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

              <button className="cf-orangeBtn" type="button">
                Continue →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
