const FALLBACK_POSTER =
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=60";

function StatusPill({ text }) {
  return (
    <span className="cf-pill cf-pill--green">
      <span className="cf-pillDot" />
      {text}
    </span>
  );
}

export default function UpcomingTickets({ items = [] }) {
  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-miniIcon cf-miniIcon--purple">📈</span>
          Upcoming Tickets
        </div>
      </div>

      <div className="cf-ticketList">
        {items.map((t) => (
          <article key={t.id} className="cf-ticketCard">
            {/* LEFT poster */}
            <div className="cf-ticketPosterWrap">
              <img className="cf-ticketPoster" src={t.poster || FALLBACK_POSTER} alt={t.title} />
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
                  Booking ID: <span className="cf-linkish">TKT-{t.id}</span>
                  </div>
                  <div>Booked: {t.bookedOn}</div>
                </div>
            </div>

            {/* RIGHT QR + actions */}
            <div className="cf-ticketQR">
              <div className="cf-ticketQrBox">
                <div className="cf-ticketQrFake" aria-hidden="true">
                  {/* fake QR look (no library needed) */}
                  <div className="cf-ticketQrGrid">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <span key={i} className="cf-ticketQrCell" />
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
        {items.length === 0 ? <div className="cf-empty">No upcoming tickets.</div> : null}
      </div>
    </section>
  );
}
