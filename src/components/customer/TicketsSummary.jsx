export default function TicketsSummary({ stats }) {
  const safe = stats || {
    totalBookings: 0,
    upcoming: 0,
    attended: 0,
    totalSpent: 0
  };

  return (
    <div className="cf-ticketStats">
      <div className="cf-statCard cf-blueBox">
        <div className="cf-statTitle">Total Bookings</div>
        <div className="cf-statValue">{safe.totalBookings}</div>
      </div>

      <div className="cf-statCard cf-purpleBox">
        <div className="cf-statTitle">Upcoming</div>
        <div className="cf-statValue">{safe.upcoming}</div>
      </div>

      <div className="cf-statCard cf-greenBox">
        <div className="cf-statTitle">Attended</div>
        <div className="cf-statValue">{safe.attended}</div>
      </div>

      <div className="cf-statCard cf-orangeBox2">
        <div className="cf-statTitle">Total Spent</div>
        <div className="cf-statMoney">฿{Number(safe.totalSpent || 0).toFixed(2)}</div>
      </div>
    </div>
  );
}
