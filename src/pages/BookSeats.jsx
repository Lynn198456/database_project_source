import "../styles/customer.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_BOOKING = {
  movieTitle: "The Last Adventure",
  genre: "Action, Sci-Fi",
  poster:
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=900&auto=format&fit=crop",
  date: "Nov 25, 2024",
  time: "07:45 PM",
  theater: "CinemaFlow Downtown",
  screen: "Screen 1 - IMAX",
  taxRate: 0.08,
};

function loadBooking() {
  try {
    const raw = localStorage.getItem("cinemaFlow_booking");
    return raw ? { ...DEFAULT_BOOKING, ...JSON.parse(raw) } : DEFAULT_BOOKING;
  } catch {
    return DEFAULT_BOOKING;
  }
}

function saveBooking(partial) {
  const current = loadBooking();
  localStorage.setItem("cinemaFlow_booking", JSON.stringify({ ...current, ...partial }));
}

const PRICES = { adult: 15, child: 10.5, senior: 12 };

export default function BookSeats() {
  const navigate = useNavigate();
  const booking = loadBooking();

  // Ticket types
  const [adult, setAdult] = useState(2);
  const [child, setChild] = useState(0);
  const [senior, setSenior] = useState(0);

  // Seats setup (A-J, 14 seats each)
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 14;

  // Some occupied seats (demo)
  const occupied = useMemo(() => {
    return new Set([
      "A3",
      "A4",
      "B7",
      "C10",
      "D2",
      "E12",
      "F6",
      "G8",
      "H1",
      "I14",
      "J9",
    ]);
  }, []);

  const [selectedSeats, setSelectedSeats] = useState(() => {
    try {
      const raw = localStorage.getItem("cinemaFlow_selectedSeats");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const ticketCount = adult + child + senior;

  const subtotal = useMemo(() => {
    return adult * PRICES.adult + child * PRICES.child + senior * PRICES.senior;
  }, [adult, child, senior]);

  const tax = useMemo(() => subtotal * booking.taxRate, [subtotal, booking.taxRate]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  function persistSeats(nextSet) {
    localStorage.setItem("cinemaFlow_selectedSeats", JSON.stringify([...nextSet]));
  }

  function toggleSeat(seatId) {
    if (occupied.has(seatId)) return;

    const next = new Set(selectedSeats);
    if (next.has(seatId)) next.delete(seatId);
    else next.add(seatId);

    setSelectedSeats(next);
    persistSeats(next);
  }

  function dec(setter, value) {
    setter(Math.max(0, value - 1));
  }
  function inc(setter, value) {
    setter(value + 1);
  }

  function goNext() {
    // Basic validation: seats must match ticket count
    if (ticketCount <= 0) {
      alert("Please select at least 1 ticket.");
      return;
    }
    if (selectedSeats.size !== ticketCount) {
      alert(`Please select exactly ${ticketCount} seat(s). You selected ${selectedSeats.size}.`);
      return;
    }

    saveBooking({
      tickets: { adult, child, senior },
      prices: PRICES,
      subtotal,
      tax,
      total,
      seats: [...selectedSeats],
    });

    // Next step (make this later)
    navigate("/customer/book/payment");
  }

  return (
    <div className="cf-page">
      {/* Top booking header */}
      <div className="cf-bookTop">
        <button className="cf-bookBack" onClick={() => navigate("/customer/book/time")}>
          ← Back
        </button>

        <div className="cf-bookTitle">
          <span className="cf-bookIcon">🎟️</span>
          <span>Book Tickets</span>
        </div>
      </div>

      {/* Steps (Select Seats active) */}
      <div className="cf-bookSteps">
        <div className="cf-step done">
          <div className="cf-stepDot">✓</div>
          <div>Select Movie</div>
        </div>
        <div className="cf-step done">
          <div className="cf-stepDot">✓</div>
          <div>Choose Time</div>
        </div>
        <div className="cf-step active">
          <div className="cf-stepDot">💺</div>
          <div>Select Seats</div>
        </div>
        <div className="cf-step">
          <div className="cf-stepDot">💳</div>
          <div>Payment</div>
        </div>
      </div>

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          <div className="cf-bookGrid">
            {/* LEFT */}
            <div className="cf-bookLeftStack">
              {/* Ticket Types */}
              <div className="cf-card cf-seatCard">
                <h3 className="cf-h3">Select Ticket Types</h3>

                <div className="cf-ticketRow">
                  <div>
                    <div className="cf-ticketName">Adult</div>
                    <div className="cf-muted">฿{PRICES.adult.toFixed(2)} per ticket</div>
                  </div>
                  <div className="cf-counter">
                    <button onClick={() => dec(setAdult, adult)} type="button">
                      −
                    </button>
                    <span>{adult}</span>
                    <button onClick={() => inc(setAdult, adult)} type="button">
                      +
                    </button>
                  </div>
                </div>

                <div className="cf-ticketRow">
                  <div>
                    <div className="cf-ticketName">Child (3–12 years)</div>
                    <div className="cf-muted">฿{PRICES.child.toFixed(2)} per ticket</div>
                  </div>
                  <div className="cf-counter">
                    <button onClick={() => dec(setChild, child)} type="button">
                      −
                    </button>
                    <span>{child}</span>
                    <button onClick={() => inc(setChild, child)} type="button">
                      +
                    </button>
                  </div>
                </div>

                <div className="cf-ticketRow">
                  <div>
                    <div className="cf-ticketName">Senior (60+)</div>
                    <div className="cf-muted">฿{PRICES.senior.toFixed(2)} per ticket</div>
                  </div>
                  <div className="cf-counter">
                    <button onClick={() => dec(setSenior, senior)} type="button">
                      −
                    </button>
                    <span>{senior}</span>
                    <button onClick={() => inc(setSenior, senior)} type="button">
                      +
                    </button>
                  </div>
                </div>

                <div className="cf-seatHint">
                  Seats selected: <b>{selectedSeats.size}</b> / Tickets: <b>{ticketCount}</b>
                </div>
              </div>

              {/* Seat Map */}
              <div className="cf-card cf-seatMapCard">
                <h3 className="cf-h3">Select Your Seats</h3>

                <div className="cf-screenWrap">
                  <div className="cf-screenBar" />
                  <div className="cf-screenText">SCREEN</div>
                </div>

                <div className="cf-seatGridWrap">
                  {rows.map((r) => (
                    <div key={r} className="cf-seatRow">
                      <div className="cf-seatRowLabel">{r}</div>

                      <div className="cf-seatRowSeats">
                        {Array.from({ length: seatsPerRow }).map((_, idx) => {
                          const seatId = `${r}${idx + 1}`;
                          const isOcc = occupied.has(seatId);
                          const isSel = selectedSeats.has(seatId);

                          const cls = [
                            "cf-seat",
                            isOcc ? "occ" : "",
                            isSel ? "sel" : "",
                          ]
                            .filter(Boolean)
                            .join(" ");

                          return (
                            <button
                              key={seatId}
                              type="button"
                              className={cls}
                              onClick={() => toggleSeat(seatId)}
                              title={seatId}
                              aria-label={`Seat ${seatId}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cf-seatLegend">
                  <div className="cf-legItem">
                    <span className="cf-legBox avail" /> Available
                  </div>
                  <div className="cf-legItem">
                    <span className="cf-legBox sel" /> Selected
                  </div>
                  <div className="cf-legItem">
                    <span className="cf-legBox occ" /> Occupied
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT (Summary) */}
            <div className="cf-card cf-bookRight">
              <h3 className="cf-h3">🎟️ Booking Summary</h3>

              <div
                className="cf-bookSummaryPoster"
                style={{ backgroundImage: `url(${booking.poster})` }}
              />

              <div className="cf-bookSummaryName">{booking.movieTitle}</div>
              <div className="cf-muted">{booking.genre}</div>

              <div className="cf-bookInfo">
                <div className="cf-bookInfoRow">
                  <span>📅 Date</span>
                  <span>{booking.date}</span>
                </div>
                <div className="cf-bookInfoRow">
                  <span>🕒 Time</span>
                  <span>{booking.time}</span>
                </div>
                <div className="cf-bookInfoRow">
                  <span>📍 Theater</span>
                  <span>
                    {booking.theater}
                    <div className="cf-muted" style={{ marginTop: 4 }}>
                      {booking.screen}
                    </div>
                  </span>
                </div>
                <div className="cf-bookInfoRow">
                  <span>💺 Seats</span>
                  <span>{[...selectedSeats].sort().join(", ") || "—"}</span>
                </div>
              </div>

              <div className="cf-bookBill">
                <div className="cf-bookBillRow">
                  <span>Adult × {adult}</span>
                  <span>฿{(adult * PRICES.adult).toFixed(2)}</span>
                </div>
                <div className="cf-bookBillRow">
                  <span>Child × {child}</span>
                  <span>฿{(child * PRICES.child).toFixed(2)}</span>
                </div>
                <div className="cf-bookBillRow">
                  <span>Senior × {senior}</span>
                  <span>฿{(senior * PRICES.senior).toFixed(2)}</span>
                </div>
                <div className="cf-bookBillRow">
                  <span>Tax (8%)</span>
                  <span>฿{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="cf-bookTotal">
                <span>Total</span>
                <span className="cf-price">฿{total.toFixed(2)}</span>
              </div>

              <button className="cf-orangeBtn" type="button" onClick={goNext}>
                Continue →
              </button>

              <button
                className="cf-grayBtn"
                type="button"
                style={{ marginTop: 12, width: "100%" }}
                onClick={() => navigate("/customer/book/time")}
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
