function Status({ value }) {
  const cls =
    value === "Cancelled" ? "cf-pill--red" : value === "Attended" ? "cf-pill--green" : "cf-pill--gray";
  return <span className={`cf-pill ${cls}`}>{value}</span>;
}

export default function PastTicketsTable({ rows = [] }) {
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
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="cf-linkish">TKT-{r.id}</td>
                <td className="cf-strong">{r.movie}</td>
                <td className="cf-muted">{r.theater}</td>
                <td className="cf-muted">{r.datetime}</td>
                <td className="cf-muted">{r.seats}</td>
                <td className="cf-strong">฿{r.price.toFixed(2)}</td>
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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="cf-empty">
                  No past tickets.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
