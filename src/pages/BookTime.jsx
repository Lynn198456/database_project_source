import "../styles/customer.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const MOVIE = {
  title: "The Last Adventure",
  genre: "Action, Sci-Fi",
  poster:
    "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1200&auto=format&fit=crop",
};

const DATES = [
  { day: "Mon", date: "25", full: "Nov 25, 2024" },
  { day: "Tue", date: "26", full: "Nov 26, 2024" },
  { day: "Wed", date: "27", full: "Nov 27, 2024" },
  { day: "Thu", date: "28", full: "Nov 28, 2024" },
  { day: "Fri", date: "29", full: "Nov 29, 2024" },
  { day: "Sat", date: "30", full: "Nov 30, 2024" },
  { day: "Sun", date: "1", full: "Dec 01, 2024" },
];

const THEATERS = [
  { name: "CinemaFlow Downtown", meta: "3.2 km away • 8 screens", screen: "Screen 1 - IMAX" },
  { name: "CinemaFlow Mall Location", meta: "3.2 km away • 8 screens", screen: "Screen 2 - Standard" },
  { name: "CinemaFlow Suburban", meta: "3.2 km away • 8 screens", screen: "Screen 3 - Premium" },
];

const SHOWTIMES = [
  { time: "10:00 AM", screen: "Screen 1 - IMAX", seats: 145, price: 15.0 },
  { time: "01:15 PM", screen: "Screen 2 - Standard", seats: 132, price: 12.0 },
  { time: "04:30 PM", screen: "Screen 1 - IMAX", seats: 98, price: 15.0 },
  { time: "07:45 PM", screen: "Screen 1 - IMAX", seats: 76, price: 15.0 },
  { time: "10:00 PM", screen: "Screen 3 - Premium", seats: 112, price: 18.0 },
];

function saveBooking(partial) {
  const raw = localStorage.getItem("cinemaFlow_booking");
  const prev = raw ? JSON.parse(raw) : {};
  localStorage.setItem("cinemaFlow_booking", JSON.stringify({ ...prev, ...partial }));
}

export default function BookTime() {
  const navigate = useNavigate();

  const [dateIdx, setDateIdx] = useState(0);
  const [theaterIdx, setTheaterIdx] = useState(0);
  const [showIdx, setShowIdx] = useState(3); // default to 07:45 PM like screenshot

  const selectedDate = DATES[dateIdx];
  const selectedTheater = THEATERS[theaterIdx];
  const selectedShow = SHOWTIMES[showIdx];

  const pricing = useMemo(() => {
    const qty = 2; // Adult x2 (demo)
    const subtotal = qty * selectedShow.price;
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);
    return { qty, subtotal, tax, total };
  }, [selectedShow.price]);

  function goNext() {
    saveBooking({
      movie: MOVIE,
      date: selectedDate.full,
      time: selectedShow.time,
      theater: selectedTheater.name,
      screen: selectedShow.screen,
      pricePerTicket: selectedShow.price,
      qty: pricing.qty,
      total: pricing.total,
    });
    navigate("/customer/book/seats");
  }

  return (
    <div className="cf-bookPage">
      {/* Top Bar */}
      <div className="cf-bookTopbar">
        <button className="cf-bookBack" type="button" onClick={() => navigate("/customer/movies")}>
          ← Back to Movies
        </button>

        <div className="cf-bookTitle">
          <span className="cf-bookIcon">🎟️</span>
          <span>Book Tickets</span>
        </div>

        <div />
      </div>

      {/* Stepper */}
      <div className="cf-stepper">
        <div className="cf-step done">
          <div className="cf-stepDot">✓</div>
          <div className="cf-stepLabel">Select Movie</div>
        </div>
        <div className="cf-stepLine done" />

        <div className="cf-step active">
          <div className="cf-stepDot">🕒</div>
          <div className="cf-stepLabel">Choose Time</div>
        </div>
        <div className="cf-stepLine" />

        <div className="cf-step">
          <div className="cf-stepDot">🎫</div>
          <div className="cf-stepLabel">Select Seats</div>
        </div>
        <div className="cf-stepLine" />

        <div className="cf-step">
          <div className="cf-stepDot">💳</div>
          <div className="cf-stepLabel">Payment</div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="cf-bookGrid">
        {/* Left */}
        <div className="cf-bookLeft">
          {/* Date */}
          <div className="cf-bookCard">
            <div className="cf-bookCardHead">
              <div className="cf-bookCardTitle">Select Date</div>
              <div className="cf-bookNavBtns">
                <button className="cf-iconBtn" type="button" aria-label="Prev week">
                  ‹
                </button>
                <button className="cf-iconBtn" type="button" aria-label="Next week">
                  ›
                </button>
              </div>
            </div>

            <div className="cf-dateRow">
              {DATES.map((d, i) => (
                <button
                  key={d.full}
                  type="button"
                  className={`cf-dateChip ${i === dateIdx ? "active" : ""}`}
                  onClick={() => setDateIdx(i)}
                >
                  <div className="cf-dateDay">{d.day}</div>
                  <div className="cf-dateNum">{d.date}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theater */}
          <div className="cf-bookCard">
            <div className="cf-bookCardHead">
              <div className="cf-bookCardTitle">Select Theater</div>
            </div>

            <div className="cf-theaterList">
              {THEATERS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  className={`cf-theaterItem ${i === theaterIdx ? "active" : ""}`}
                  onClick={() => setTheaterIdx(i)}
                >
                  <div className="cf-theaterName">📍 {t.name}</div>
                  <div className="cf-theaterMeta">{t.meta}</div>
                  <div className="cf-theaterTick">{i === theaterIdx ? "✓" : ""}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Showtime */}
          <div className="cf-bookCard">
            <div className="cf-bookCardHead">
              <div className="cf-bookCardTitle">Select Showtime</div>
            </div>

            <div className="cf-showGrid">
              {SHOWTIMES.map((s, i) => (
                <button
                  key={s.time}
                  type="button"
                  className={`cf-showTile ${i === showIdx ? "active" : ""}`}
                  onClick={() => setShowIdx(i)}
                >
                  <div className="cf-showTime">{s.time}</div>
                  <div className="cf-showSub">{s.screen}</div>
                  <div className="cf-showMeta">
                    {s.seats} seats • ${s.price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Summary */}
        <aside className="cf-bookRight">
          <div className="cf-bookSummary">
            <div className="cf-bookSummaryHead">
              <span className="cf-miniIcon cf-miniIcon--orange">🎟️</span>
              Booking Summary
            </div>

            <div className="cf-summaryPosterWrap">
              <img className="cf-summaryPoster" src={MOVIE.poster} alt={MOVIE.title} />
            </div>

            <div className="cf-summaryTitle">{MOVIE.title}</div>
            <div className="cf-summaryMuted">{MOVIE.genre}</div>

            <div className="cf-summaryInfo">
              <div className="cf-summaryRow">
                <span className="cf-summaryKey">📅 Date</span>
                <span className="cf-summaryVal">{selectedDate.full}</span>
              </div>
              <div className="cf-summaryRow">
                <span className="cf-summaryKey">🕒 Time</span>
                <span className="cf-summaryVal">{selectedShow.time}</span>
              </div>
              <div className="cf-summaryRow">
                <span className="cf-summaryKey">📍 Theater</span>
                <span className="cf-summaryVal">
                  {selectedTheater.name}
                  <div className="cf-summaryMutedSmall">{selectedShow.screen}</div>
                </span>
              </div>
            </div>

            <div className="cf-summaryDivider" />

            <div className="cf-summaryCost">
              <div className="cf-summaryRow">
                <span>Adult × {pricing.qty}</span>
                <span>${pricing.subtotal.toFixed(2)}</span>
              </div>
              <div className="cf-summaryRow">
                <span>Tax (8%)</span>
                <span>${pricing.tax.toFixed(2)}</span>
              </div>
              <div className="cf-summaryDivider" />
              <div className="cf-summaryTotal">
                <span>Total</span>
                <span>${pricing.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="cf-orangeBtn"
              type="button"
              onClick={goNext}
            >
              Continue →
            </button>
            <button className="cf-backBtn" type="button" onClick={() => navigate("/customer/book")}>
              ← Back
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
