import "../styles/customer.css";
import { useNavigate } from "react-router-dom";

export default function BookingConfirmed() {
  const navigate = useNavigate();

  // (Optional) If you saved booking data in localStorage, read it here
  // const booking = JSON.parse(localStorage.getItem("cf_booking")) || {};

  return (
    <div className="cf-page cf-confirmPage">
      {/* Top green banner */}
      <div className="cf-confirmTop">
        <div className="cf-confirmCheck">✓</div>
        <h1 className="cf-confirmTitle">Booking Confirmed!</h1>
        <p className="cf-confirmSub">Your tickets have been successfully booked</p>
      </div>

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          {/* Action buttons */}
          <div className="cf-confirmActionsRow">
            <button className="cf-blueBtn cf-confirmBtn" type="button">
              ⬇ Download Tickets
            </button>
            <button className="cf-purpleBtn cf-confirmBtn" type="button">
              ✉ Email Tickets
            </button>
            <button className="cf-grayBtn cf-confirmBtn" type="button">
              🖨 Print
            </button>
            <button className="cf-grayBtn cf-confirmBtn" type="button">
              🔗 Share
            </button>
          </div>

          {/* Ticket card */}
          <div className="cf-card cf-confirmTicket">
            <div className="cf-confirmTicketTopBar">
              <div className="cf-confirmBrand">
                <div className="cf-confirmBrandIcon">🎟️</div>
                <div>
                  <div className="cf-confirmBrandName">CinemaFlow</div>
                  <div className="cf-muted">E-Ticket</div>
                </div>
              </div>

              <div className="cf-confirmBookingId">
                <div className="cf-muted">Booking ID</div>
                <div className="cf-confirmBookingIdValue">TKT-2024-013036</div>
              </div>
            </div>

            <div className="cf-confirmTicketBody">
              {/* Left info */}
              <div className="cf-confirmLeft">
                <div className="cf-confirmMovieRow">
                  <div className="cf-confirmThumb" />
                  <div>
                    <div className="cf-confirmMovieTitle">The Last Adventure</div>
                    <div className="cf-muted">Action, Sci-Fi</div>
                    <div className="cf-confirmMetaRow">
                      <span>⭐ 4.5/5</span>
                      <span>🕒 2h 15m</span>
                      <span className="cf-pill">PG-13</span>
                    </div>
                  </div>
                </div>

                <div className="cf-confirmInfoGrid">
                  <div className="cf-confirmInfoItem">
                    <div className="cf-confirmInfoIcon blue">📅</div>
                    <div>
                      <div className="cf-muted">Date</div>
                      <div>Nov 25, 2024</div>
                    </div>
                  </div>

                  <div className="cf-confirmInfoItem">
                    <div className="cf-confirmInfoIcon purple">🕒</div>
                    <div>
                      <div className="cf-muted">Time</div>
                      <div>07:45 PM</div>
                    </div>
                  </div>

                  <div className="cf-confirmInfoItem">
                    <div className="cf-confirmInfoIcon orange">📍</div>
                    <div>
                      <div className="cf-muted">Theater</div>
                      <div>CinemaFlow Downtown</div>
                      <div className="cf-muted">Screen 1 - IMAX</div>
                    </div>
                  </div>

                  <div className="cf-confirmInfoItem">
                    <div className="cf-confirmInfoIcon green">👥</div>
                    <div>
                      <div className="cf-muted">Seats</div>
                      <div>E12</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right QR */}
              <div className="cf-confirmQR">
                <div className="cf-confirmQRTitle">Scan at Entry</div>
                <div className="cf-confirmQRBox">
                  {/* simple fake QR look */}
                  <div className="cf-fakeQR" />
                </div>
                <div className="cf-muted">TKT-2024-013036</div>
              </div>
            </div>

            {/* Details + Payment summary */}
            <div className="cf-confirmBottomGrid">
              <div className="cf-card cf-confirmMini">
                <div className="cf-h3">Ticket Details</div>
                <div className="cf-confirmLine">
                  <span>Adult × 2</span>
                  <span>E12</span>
                </div>
                <div className="cf-confirmLine">
                  <span>Child × 2</span>
                  <span>-</span>
                </div>
              </div>

              <div className="cf-card cf-confirmMini">
                <div className="cf-h3">Payment Summary</div>
                <div className="cf-confirmLine">
                  <span>Subtotal</span>
                  <span>$51.00</span>
                </div>
                <div className="cf-confirmLine">
                  <span>Tax (8%)</span>
                  <span>$4.08</span>
                </div>
                <div className="cf-confirmLine cf-confirmTotalLine">
                  <span>Total Paid</span>
                  <span className="cf-confirmPaid">$55.08</span>
                </div>
                <div className="cf-muted" style={{ marginTop: 10 }}>
                  Payment Method
                </div>
                <div>QR Code Payment</div>
              </div>
            </div>

            {/* Important info */}
            <div className="cf-card cf-confirmInfoBox">
              <div className="cf-h3">📌 Important Information</div>

              <div className="cf-confirmInfoCards">
                <div className="cf-confirmInfoCard">
                  <div className="cf-confirmInfoHead">✓ Entry Requirements</div>
                  <div className="cf-muted">
                    Please arrive 15 minutes before showtime. Present this QR code at the entrance.
                  </div>
                </div>

                <div className="cf-confirmInfoCard">
                  <div className="cf-confirmInfoHead">✓ Cancellation Policy</div>
                  <div className="cf-muted">
                    Free cancellation up to 2 hours before showtime. Contact support for refunds.
                  </div>
                </div>

                <div className="cf-confirmInfoCard">
                  <div className="cf-confirmInfoHead">✓ Food & Beverages</div>
                  <div className="cf-muted">
                    Pre-order snacks and drinks at the concession counter or through our mobile app.
                  </div>
                </div>

                <div className="cf-confirmInfoCard">
                  <div className="cf-confirmInfoHead">✓ Theater Amenities</div>
                  <div className="cf-muted">
                    Enjoy premium seating, 4K projection, and Dolby Atmos sound system.
                  </div>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="cf-card cf-confirmHelp">
              <div className="cf-confirmHelpTitle">Need help with your booking?</div>
              <div className="cf-confirmHelpRow">
                <div className="cf-helpChip">✉ support@cinemaflow.com</div>
                <div className="cf-helpChip">📞 +1 (555) 123-4567</div>
              </div>
            </div>

            {/* Bottom nav buttons */}
            <div className="cf-confirmBottomBtns">
              <button
                className="cf-orangeBtn"
                type="button"
                onClick={() => navigate("/customer")}
              >
                🏠 Back to Home
              </button>

              <button
                className="cf-blueBtn"
                type="button"
          onClick={() => navigate("/customer/tickets")}
              >
                🎟️ View My Tickets
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
