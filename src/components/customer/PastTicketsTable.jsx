const PAST = [
  {
    id: "TKT-2024-003",
    movie: "Laugh Out Loud",
    theater: "CinemaFlow Downtown",
    datetime: "Nov 20, 2024 05:00 PM",
    seats: "B8, B9",
    price: 24.0,
    status: "Attended",
  },
  {
    id: "TKT-2024-004",
    movie: "Midnight Shadows",
    theater: "CinemaFlow Suburban",
    datetime: "Nov 15, 2024 09:00 PM",
    seats: "F12",
    price: 12.0,
    status: "Attended",
  },
  {
    id: "TKT-2024-005",
    movie: "The Last Adventure",
    theater: "CinemaFlow Downtown",
    datetime: "Nov 10, 2024 07:45 PM",
    seats: "C15, C16",
    price: 30.0,
    status: "Cancelled",
  },
];

function Status({ value }) {
  const cls =
    value === "Cancelled" ? "cf-pill--red" : value === "Attended" ? "cf-pill--green" : "cf-pill--gray";
  return <span className={`cf-pill ${cls}`}>{value}</span>;
}

export default function PastTicketsTable() {
  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-miniIcon cf-miniIcon--gray">✅</span>
          Past Tickets
        </div>
      </div>

      <div className="cf-tableWrap">
        <table className="cf-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Movie</th>
              <th>Theater</th>
              <th>Date &amp; Time</th>
              <th>Seats</th>
              <th>Price</th>
              <th>Status</th>
              <th className="cf-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {PAST.map((r) => (
              <tr key={r.id}>
                <td className="cf-linkish">{r.id}</td>
                <td className="cf-strong">{r.movie}</td>
                <td className="cf-muted">{r.theater}</td>
                <td className="cf-muted">{r.datetime}</td>
                <td className="cf-muted">{r.seats}</td>
                <td className="cf-strong">${r.price.toFixed(2)}</td>
                <td>
                  <Status value={r.status} />
                </td>
                <td className="cf-right">
                  <button className="cf-iconBtn" type="button" title="Download">
                    ⬇
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
