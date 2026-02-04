import "../styles/customer.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookPaymentPage() {
  const navigate = useNavigate();

  // Load booking info from localStorage (set this from BookTickets/BookTime/Seats pages later)
  const booking = useMemo(() => {
    try {
      const raw = localStorage.getItem("cinemaFlow_booking");
      return raw
        ? JSON.parse(raw)
        : {
            movieTitle: "The Last Adventure",
            genre: "Action, Sci-Fi",
            date: "Nov 25, 2024",
            time: "07:45 PM",
            theater: "Cinema Listic Downtown",
            screen: "Screen 1 - IMAX",
            seats: ["F11", "H11"],
            qty: 2,
            price: 30.0,
            tax: 2.4,
            total: 32.4,
            poster:
              "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1400&auto=format&fit=crop",
          };
    } catch {
      return null;
    }
  }, []);

  const [method, setMethod] = useState("qr"); // "qr" | "bank"
  const [email, setEmail] = useState(booking?.email || "john.doe@email.com");
  const [phone, setPhone] = useState(booking?.phone || "+1 (555) 123-4567");

  const refCode = "REF-95673988888";
  const paymentId = "PMT-67398888";

  function completeBooking() {
    if (!booking) return;

    const newTicket = {
      id: `TKT-${Date.now()}`,
      movieTitle: booking.movieTitle,
      genre: booking.genre,
      date: booking.date,
      time: booking.time,
      theater: booking.theater,
      screen: booking.screen,
      seats: booking.seats || [],
      qty: booking.qty,
      subtotal: booking.price,
      tax: booking.tax,
      total: booking.total,
      poster: booking.poster,
      email,
      phone,
      method, // qr or bank
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };

    // ✅ Save into tickets list used by MyTicketsPage
    const raw = localStorage.getItem("cinemaFlow_tickets");
    const tickets = raw ? JSON.parse(raw) : [];
    tickets.unshift(newTicket);
    localStorage.setItem("cinemaFlow_tickets", JSON.stringify(tickets));

    // ✅ Save the last confirmed ticket (so confirmed page can show it)
    localStorage.setItem("cinemaFlow_lastTicket", JSON.stringify(newTicket));

    // (optional) clear draft booking
    // localStorage.removeItem("cinemaFlow_booking");

    // ✅ go to confirmed page
    navigate("/customer/book/confirmed");
  }

  return (
    <div className="cf-page">
      {/* Top header */}
      <div className="cf-bookTop">
        <button
          className="cf-bookBack"
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
        <div className="cf-step done">
          <div className="cf-stepDot">✓</div>
          <div>Select Movie</div>
        </div>
        <div className="cf-step done">
          <div className="cf-stepDot">✓</div>
          <div>Choose Time</div>
        </div>
        <div className="cf-step done">
          <div className="cf-stepDot">✓</div>
          <div>Select Seats</div>
        </div>
        <div className="cf-step active">
          <div className="cf-stepDot">💳</div>
          <div>Payment</div>
        </div>
      </div>

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          <div className="cf-bookGrid">
            {/* LEFT */}
            <div className="cf-card cf-payLeft">
              <h3 className="cf-h3">Select Payment Method</h3>

              {/* QR Payment */}
              <button
                type="button"
                className={`cf-payMethod ${method === "qr" ? "active" : ""}`}
                onClick={() => setMethod("qr")}
              >
                <div className="cf-payMethodTop">
                  <div className="cf-payIcon">⌁</div>
                  <div>
                    <div className="cf-payTitle">QR Code Payment</div>
                    <div className="cf-muted">
                      Scan to pay via mobile banking app
                    </div>
                  </div>
                </div>

                {method === "qr" && (
                  <div className="cf-payBody">
                    <div className="cf-qrBox">
                      <div className="cf-qrFake">
                        <div className="cf-qrGrid">
                          {Array.from({ length: 81 }).map((_, i) => (
                            <span
                              key={i}
                              className={i % 3 === 0 ? "on" : ""}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="cf-qrText">
                        <div className="cf-qrMain">
                          Scan with your banking app
                        </div>
                        <div className="cf-muted">Payment ID: {paymentId}</div>
                      </div>
                    </div>

                    <div className="cf-payNote">
                      ⚡ Instant confirmation after payment
                    </div>
                  </div>
                )}
              </button>

              {/* Bank Transfer */}
              <button
                type="button"
                className={`cf-payMethod ${method === "bank" ? "active" : ""}`}
                onClick={() => setMethod("bank")}
              >
                <div className="cf-payMethodTop">
                  <div className="cf-payIcon blue">🏦</div>
                  <div>
                    <div className="cf-payTitle">Bank Transfer</div>
                    <div className="cf-muted">Transfer to our bank account</div>
                  </div>
                </div>

                {method === "bank" && (
                  <div className="cf-payBody">
                    <div className="cf-payCard">
                      <div className="cf-payField">
                        <div className="cf-muted">Bank Name</div>
                        <div className="cf-payValue">Cinema Listic Bank</div>
                      </div>
                      <div className="cf-payField">
                        <div className="cf-muted">Account Number</div>
                        <div className="cf-payValue">1234-5678-9012-3456</div>
                      </div>
                      <div className="cf-payField">
                        <div className="cf-muted">Account Name</div>
                        <div className="cf-payValue">
                          Cinema Listic Entertainment Ltd.
                        </div>
                      </div>
                      <div className="cf-payField">
                        <div className="cf-muted">Reference Number</div>
                        <div className="cf-payValue ref">{refCode}</div>
                      </div>
                    </div>

                    <div className="cf-payHint">
                      ℹ️ Please include the reference number in your transfer
                    </div>
                  </div>
                )}
              </button>

              {/* Contact form */}
              <div className="cf-payForm">
                <label className="cf-label">
                  Email Address <span className="cf-required">*</span>
                </label>
                <input
                  className="cf-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@email.com"
                />
                <div className="cf-muted cf-help">
                  We'll send your tickets to this email
                </div>

                <label className="cf-label">
                  Phone Number <span className="cf-required">*</span>
                </label>
                <input
                  className="cf-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
                <div className="cf-muted cf-help">
                  For booking confirmation and updates
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="cf-card cf-bookRight">
              <h3 className="cf-h3">🎟️ Booking Summary</h3>

              <div
                className="cf-bookSummaryPoster"
                style={{
                  backgroundImage: `url(${booking?.poster})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />

              <div className="cf-bookSummaryName">{booking?.movieTitle}</div>
              <div className="cf-muted">{booking?.genre}</div>

              <div className="cf-bookInfo">
                <div className="cf-bookInfoRow">
                  <span>📅 Date</span>
                  <span>{booking?.date}</span>
                </div>
                <div className="cf-bookInfoRow">
                  <span>🕒 Time</span>
                  <span>{booking?.time}</span>
                </div>
                <div className="cf-bookInfoRow">
                  <span>📍 Theater</span>
                  <span>
                    {booking?.theater}
                    <div className="cf-muted" style={{ marginTop: 4 }}>
                      {booking?.screen}
                    </div>
                  </span>
                </div>
                <div className="cf-bookInfoRow">
                  <span>👥 Seats</span>
                  <span>{(booking?.seats || []).join(", ")}</span>
                </div>
              </div>

              <div className="cf-bookBill">
                <div className="cf-bookBillRow">
                  <span>Adult × {booking?.qty}</span>
                  <span>฿{booking?.price?.toFixed(2)}</span>
                </div>
                <div className="cf-bookBillRow">
                  <span>Subtotal</span>
                  <span>฿{booking?.price?.toFixed(2)}</span>
                </div>
                <div className="cf-bookBillRow">
                  <span>Tax (8%)</span>
                  <span>฿{booking?.tax?.toFixed(2)}</span>
                </div>
              </div>

              <div className="cf-bookTotal">
                <span>Total</span>
                <span className="cf-price">฿{booking?.total?.toFixed(2)}</span>
              </div>

              {/* ✅ FIXED: call completeBooking() */}
              <button className="cf-greenBtn" type="button" onClick={completeBooking}>
                ✓ Complete Booking
              </button>

              <button
                className="cf-grayBtn"
                type="button"
                onClick={() => navigate("/customer/book/seats")}
                style={{ marginTop: 12 }}
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
