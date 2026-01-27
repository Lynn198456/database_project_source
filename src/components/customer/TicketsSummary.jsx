export default function TicketsSummary() {
  return (
    <div className="cf-ticketStats">
      <div className="cf-statCard cf-blueBox">
        <div className="cf-statTitle">Total Bookings</div>
        <div className="cf-statValue">5</div>
      </div>

      <div className="cf-statCard cf-purpleBox">
        <div className="cf-statTitle">Upcoming</div>
        <div className="cf-statValue">2</div>
      </div>

      <div className="cf-statCard cf-greenBox">
        <div className="cf-statTitle">Attended</div>
        <div className="cf-statValue">2</div>
      </div>

      <div className="cf-statCard cf-orangeBox2">
        <div className="cf-statTitle">Total Spent</div>
        <div className="cf-statMoney">$150.00</div>
      </div>
    </div>
  );
}
