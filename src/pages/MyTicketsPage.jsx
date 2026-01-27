import "../styles/customer.css";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";
import TicketsSummary from "../components/customer/TicketsSummary";
import UpcomingTickets from "../components/customer/UpcomingTickets";
import PastTicketsTable from "../components/customer/PastTicketsTable";

export default function MyTicketsPage() {
  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-container">
          <section className="cf-section">
            <div className="cf-ticketTop">
              <div>
                <div className="cf-section__head">
                  <div className="cf-section__title">
                    <span className="cf-miniIcon cf-miniIcon--purple">🎟️</span>
                    My Tickets
                  </div>
                  <div className="cf-section__subtitle">Manage your bookings</div>
                </div>
              </div>

              <button className="cf-orangeBtn" type="button">
                Book New Tickets
              </button>
            </div>

            <TicketsSummary />
          </section>

          <UpcomingTickets />
          <PastTicketsTable />
        </div>
      </main>

      <Footer />
    </div>
  );
}
