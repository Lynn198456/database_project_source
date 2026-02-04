const UPCOMING = [
  {
    id: "TKT-2024-001",
    title: "The Last Adventure",
    poster:
      "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=1200&auto=format&fit=crop",
    status: "Confirmed",
    theater: "Cinema Listic Downtown - Screen 1 - IMAX",
    date: "Nov 25, 2024",
    time: "07:45 PM",
    seats: ["A12", "A13"],
    price: 30.0,
    bookedOn: "Nov 20, 2024",
  },
  {
    id: "TKT-2024-002",
    title: "Hearts Entwined",
    poster:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop",
    status: "Confirmed",
    theater: "Cinema Listic Mall Location - Screen 3 - Premium",
    date: "Nov 28, 2024",
    time: "02:00 PM",
    seats: ["B8", "B9"],
    price: 24.0,
    bookedOn: "Nov 18, 2024",
  },
];

function StatusPill({ text }) {
  return (
    <span className="cf-pill cf-pill--green">
      <span className="cf-pillDot" />
      {text}
    </span>
  );
}

export default function UpcomingTickets() {
  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-miniIcon cf-miniIcon--purple">📈</span>
          Upcoming Tickets
        </div>
      </div>

      <div className="cf-ticketList">
        {UPCOMING.map((t) => (
          <article key={t.id} className="cf-ticketCard">
            {/* LEFT poster */}
            <div className="cf-ticketPosterWrap">
              <img className="cf-ticketPoster" src={t.poster} alt={t.title} />
            </div>

            {/* CENTER info */}
            <div className="cf-ticketInfo">
              <div className="cf-ticketTitleRow">
                <div className="cf-ticketTitle">{t.title}</div>
                <StatusPill text={t.status} />
              </div>

              <div className="cf-ticketRows">
                <div className="cf-ticketRow">
                  <span className="cf-ticketIco">📍</span>
                  <span>{t.theater}</span>
                </div>

                <div className="cf-ticketRow">
                  <span className="cf-ticketIco">📅</span>
                  <span>{t.date}</span>
                </div>

                <div className="cf-ticketRow">
                  <span className="cf-ticketIco">🕒</span>
                  <span>{t.time}</span>
                </div>
              </div>

              <div className="cf-seatBox">
                <div className="cf-seatLabel">Seats</div>
                <div className="cf-seatChips">
                  {t.seats.map((s) => (
                    <span key={s} className="cf-seatChip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="cf-ticketMeta">
                <div>
                  Booking ID: <span className="cf-linkish">{t.id}</span>
                </div>
                <div>Booked: {t.bookedOn}</div>
              </div>
            </div>

            {/* RIGHT QR + actions */}
            <div className="cf-ticketQR">
              <div className="cf-qrBox">
                <div className="cf-qrFake" aria-hidden="true">
                  {/* fake QR look (no library needed) */}
                  <div className="cf-qrGrid">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <span key={i} className="cf-qrCell" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="cf-ticketPrice">฿{t.price.toFixed(2)}</div>

              <button className="cf-blueBtn" type="button">
                ⬇ Download
              </button>
              <button className="cf-grayBtn" type="button">
                ✉ Email
              </button>
              <button className="cf-redBtn" type="button">
                ✕ Cancel
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
