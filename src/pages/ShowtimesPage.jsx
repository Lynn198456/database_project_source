import "../styles/customer.css";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";
import ShowtimesTable from "../components/customer/ShowtimesTable";

export default function ShowtimesPage() {
  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-container">
          <section className="cf-section">
            <div className="cf-section__head">
              <div className="cf-section__title">
                <span className="cf-miniIcon cf-miniIcon--orange">🕒</span>
                Showtimes Schedule
              </div>
            </div>

            <ShowtimesTable />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
