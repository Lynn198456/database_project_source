import { useMemo, useState } from "react";

const SCREENS = ["Screen 1", "Screen 2", "Screen 3", "IMAX"];
const TIMES = ["10:00 AM", "12:30 PM", "03:15 PM", "05:00 PM", "07:30 PM"];

export default function QuickBooking({ movies = [] }) {
  const movieOptions = useMemo(() => {
    return movies.map((m, idx) => ({
      id: m.id ?? idx + 1,
      title: m.title ?? `Movie ${idx + 1}`,
    }));
  }, [movies]);

  const [movieId, setMovieId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [screen, setScreen] = useState("");
  const [seats, setSeats] = useState(0);

  const subtotal = useMemo(() => seats * 10, [seats]);
  const tax = useMemo(() => +(subtotal * 0.08).toFixed(2), [subtotal]);
  const total = useMemo(() => +(subtotal + tax).toFixed(2), [subtotal, tax]);

  const canConfirm = movieId && date && time && screen && seats > 0;

  function clearAll() {
    setMovieId("");
    setDate("");
    setTime("");
    setScreen("");
    setSeats(0);
  }

  function confirm() {
    if (!canConfirm) return;

    const selectedMovie = movieOptions.find(
      (m) => String(m.id) === String(movieId)
    );

    const booking = {
      movieId,
      movieTitle: selectedMovie?.title ?? "Unknown",
      date,
      time,
      screen,
      seats,
      subtotal,
      tax,
      total,
      createdAt: new Date().toISOString(),
    };

    const prev = JSON.parse(
      localStorage.getItem("cinemaFlow_admin_quickBookings") || "[]"
    );
    localStorage.setItem(
      "cinemaFlow_admin_quickBookings",
      JSON.stringify([booking, ...prev])
    );

    alert(`✅ Booking created: ${booking.movieTitle} (${booking.seats} seats)`);
    clearAll();
  }

  return (
    <aside className="qb-card">
      <div className="qb-head">
        <div>
          <h3 className="qb-title">Quick Booking</h3>
          <p className="qb-sub">Create a booking in seconds</p>
        </div>

        <button className="qb-mini" onClick={clearAll} type="button">
          Clear
        </button>
      </div>

      <div className="qb-body">
        <div className="qb-field">
          <label>Select Movie</label>
          <select value={movieId} onChange={(e) => setMovieId(e.target.value)}>
            <option value="">Choose a movie...</option>
            {movieOptions.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        <div className="qb-grid2">
          <div className="qb-field">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="qb-field">
            <label>Time</label>
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">Select time</option>
              {TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="qb-grid2">
          <div className="qb-field">
            <label>Screen</label>
            <select value={screen} onChange={(e) => setScreen(e.target.value)}>
              <option value="">Select screen</option>
              {SCREENS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="qb-field">
            <label>Seats</label>
            <input
              type="number"
              min="0"
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value || 0))}
            />
          </div>
        </div>

        <div className="qb-totalBox">
          <div className="qb-row">
            <span>Subtotal</span>
            <strong>${subtotal.toFixed(2)}</strong>
          </div>
          <div className="qb-row">
            <span>Tax (8%)</span>
            <strong>${tax.toFixed(2)}</strong>
          </div>
          <div className="qb-divider" />
          <div className="qb-row qb-total">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="qb-actions">
          <button
            className="qb-btnPrimary"
            disabled={!canConfirm}
            onClick={confirm}
            type="button"
          >
            Confirm Booking
          </button>

          <button className="qb-btnGhost" onClick={clearAll} type="button">
            Clear Selection
          </button>
        </div>

        <p className="qb-note">
          Demo: saves to <strong>cinemaFlow_admin_quickBookings</strong>
        </p>
      </div>
    </aside>
  );
}
