import "../styles/customer.css";
import "../styles/bookingHistory.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";

function loadBookingHistory() {
  try {
    const raw = localStorage.getItem("cinemaFlow_bookingHistory");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Demo seed (if no localStorage yet)
const SEED = [
  {
    id: "BK-2601-001",
    title: "The Last Adventure",
    status: "COMPLETED", // COMPLETED | UPCOMING | CANCELLED
    dateText: "Jan 25, 2026 at 7:30 PM",
    theater: "CinemaFlow Downtown",
    screen: "Screen 3 - IMAX",
    seats: ["A12", "A13"],
    amount: 30.0,
  },
  {
    id: "BK-2601-002",
    title: "Hearts Entwined",
    status: "COMPLETED",
    dateText: "Jan 20, 2026 at 6:45 PM",
    theater: "CinemaFlow Downtown",
    screen: "Screen 2 - Standard",
    seats: ["C10", "C11"],
    amount: 15.0,
  },
  {
    id: "BK-2602-003",
    title: "Future World",
    status: "UPCOMING",
    dateText: "Feb 1, 2026 at 6:00 PM",
    theater: "CinemaFlow Downtown",
    screen: "Screen 1 - Dolby Atmos",
    seats: ["C8", "C9"],
    amount: 36.0,
  },
  {
    id: "BK-2601-004",
    title: "Midnight Shadows",
    status: "COMPLETED",
    dateText: "Jan 15, 2026 at 8:15 PM",
    theater: "CinemaFlow Downtown",
    screen: "Screen 3 - IMAX",
    seats: ["D10", "D11", "D12"],
    amount: 54.0,
  },
  {
    id: "BK-2601-005",
    title: "Laugh Out Loud",
    status: "COMPLETED",
    dateText: "Jan 10, 2026 at 4:45 PM",
    theater: "CinemaFlow Suburban",
    screen: "Screen 1",
    seats: ["E5"],
    amount: 12.0,
  },
  {
    id: "BK-2512-006",
    title: "Action Hero Returns",
    status: "CANCELLED",
    dateText: "Dec 30, 2025 at 10:00 PM",
    theater: "CinemaFlow Mall Location",
    screen: "Screen 4",
    seats: ["F8", "F9"],
    amount: 30.0,
  },
];

export default function BookingHistoryPage() {
  const navigate = useNavigate();

  const initial = useMemo(() => loadBookingHistory() || SEED, []);
  const [items, setItems] = useState(initial);

  // ✅ Cancel modal state
  const [cancelTarget, setCancelTarget] = useState(null);

  useEffect(() => {
    // ESC closes cancel modal
    function onKeyDown(e) {
      if (e.key === "Escape") setCancelTarget(null);
    }
    if (cancelTarget) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [cancelTarget]);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((b) => b.status === "COMPLETED").length;
    const upcoming = items.filter((b) => b.status === "UPCOMING").length;
    const totalSpent = items
      .filter((b) => b.status !== "CANCELLED")
      .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

    return { total, completed, upcoming, totalSpent };
  }, [items]);

  function persist(next) {
    setItems(next);
    localStorage.setItem("cinemaFlow_bookingHistory", JSON.stringify(next));
  }

  // ✅ open cancel modal
  function requestCancel(booking) {
    setCancelTarget(booking);
  }

  // ✅ confirm cancel
  function confirmCancel() {
    if (!cancelTarget) return;

    const next = items.map((b) =>
      b.id === cancelTarget.id ? { ...b, status: "CANCELLED" } : b
    );

    persist(next);
    setCancelTarget(null);
  }

  function viewTicket(booking) {
    localStorage.setItem("cinemaFlow_selectedTicket", JSON.stringify(booking));
    navigate("/customer/tickets");
  }

  function bookAgain(booking) {
    const draft = {
      movieTitle: booking.title,
      theater: booking.theater,
      screen: booking.screen,
    };
    localStorage.setItem("cinemaFlow_booking", JSON.stringify(draft));
    navigate("/customer/book");
  }

  return (
    <div className="cf-page">
      <Navbar />
      <main className="cf-mainFull">
        <div className="cf-containerWide">
          {/* header row */}
          <div className="bh-top">
            <button className="bh-back" type="button" onClick={() => navigate(-1)}>
              ←
            </button>

            <div className="bh-title">
              <span className="bh-icon">📅</span>
              Booking History
            </div>
          </div>

          {/* stats */}
          <div className="bh-stats">
            <div className="bh-stat bh-purple">
              <div className="bh-statLabel">Total Bookings</div>
              <div className="bh-statValue">{stats.total}</div>
            </div>

            <div className="bh-stat bh-green">
              <div className="bh-statLabel">Completed</div>
              <div className="bh-statValue">{stats.completed}</div>
            </div>

            <div className="bh-stat bh-blue">
              <div className="bh-statLabel">Upcoming</div>
              <div className="bh-statValue">{stats.upcoming}</div>
            </div>

            <div className="bh-stat bh-orange">
              <div className="bh-statLabel">Total Spent</div>
              <div className="bh-statValue">฿{Math.round(stats.totalSpent)}</div>
            </div>
          </div>

          {/* list */}
          <div className="bh-panel">
            <div className="bh-panelHead">
              <span className="bh-film">🎞️</span> All Bookings
            </div>

            <div className="bh-list">
              {items.map((b) => (
                <div
                  key={b.id}
                  className={`bh-card ${b.status === "COMPLETED" ? "bh-cardGold" : ""}`}
                >
                  <div className="bh-cardTop">
                    <div>
                      <div className="bh-movie">{b.title}</div>
                      <div className="bh-sub">Booking ID: {b.id}</div>
                    </div>

                    <div
                      className={`bh-badge ${
                        b.status === "COMPLETED"
                          ? "bh-badgeGreen"
                          : b.status === "UPCOMING"
                          ? "bh-badgeBlue"
                          : "bh-badgeRed"
                      }`}
                    >
                      {b.status === "COMPLETED"
                        ? "✓ Completed"
                        : b.status === "UPCOMING"
                        ? "Upcoming"
                        : "✕ Cancelled"}
                    </div>
                  </div>

                  <div className="bh-grid">
                    <div className="bh-box">
                      <div className="bh-boxLabel">📅 Date & Time</div>
                      <div className="bh-boxValue">{b.dateText}</div>
                    </div>

                    <div className="bh-box">
                      <div className="bh-boxLabel">📍 Theater</div>
                      <div className="bh-boxValue">{b.theater}</div>
                    </div>

                    <div className="bh-box">
                      <div className="bh-boxLabel">🎬 Screen</div>
                      <div className="bh-boxValue">{b.screen}</div>
                    </div>

                    <div className="bh-box">
                      <div className="bh-boxLabel">🪑 Seats</div>
                      <div className="bh-boxValue">{(b.seats || []).join(", ")}</div>
                    </div>

                    <div className="bh-box">
                      <div className="bh-boxLabel">💰 Amount</div>
                      <div className="bh-boxValue">${Number(b.amount).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* actions */}
                  {b.status === "UPCOMING" && (
                    <div className="bh-actions2">
                      <button
                        className="bh-btnBlue"
                        type="button"
                        onClick={() => viewTicket(b)}
                      >
                        View Ticket
                      </button>

                      {/* ✅ opens modal */}
                      <button
                        className="bh-btnRed"
                        type="button"
                        onClick={() => requestCancel(b)}
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}

                  {b.status === "COMPLETED" && (
                    <button className="bh-btnOrange" type="button" onClick={() => bookAgain(b)}>
                      Book Again
                    </button>
                  )}

                  {b.status === "CANCELLED" && (
                    <button className="bh-btnDisabled" type="button" disabled>
                      Booking Cancelled
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ✅ CANCEL CONFIRM MODAL */}
        {cancelTarget && (
          <div className="bh-overlay" onMouseDown={() => setCancelTarget(null)}>
            <div className="bh-modal" onMouseDown={(e) => e.stopPropagation()}>
              <h3>Cancel Booking</h3>
              <p>
                Are you sure you want to cancel <strong>{cancelTarget.title}</strong>?
              </p>

              <div className="bh-modalInfo">
                <div>📅 {cancelTarget.dateText}</div>
                <div>📍 {cancelTarget.theater}</div>
                <div>💺 Seats: {(cancelTarget.seats || []).join(", ")}</div>
              </div>

              <div className="bh-modalNote">
                💰 Refund will be processed within 3–5 business days.
              </div>

              <div className="bh-modalActions">
                <button
                  className="bh-btnGhost"
                  type="button"
                  onClick={() => setCancelTarget(null)}
                >
                  Keep Booking
                </button>

                <button className="bh-btnRed" type="button" onClick={confirmCancel}>
                  Confirm Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
