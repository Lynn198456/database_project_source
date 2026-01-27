import "../styles/customer.css";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";
import TheatersGrid from "../components/customer/TheatersGrid";
import TheatersMapCard from "../components/customer/TheatersMapCard";

export default function TheatersPage() {
  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-container">
          <section className="cf-section">
            <div className="cf-section__head">
              <div className="cf-section__title">
                <span className="cf-miniIcon cf-miniIcon--orange">📍</span>
                Our Theaters
              </div>
              <div className="cf-section__subtitle">Find locations near you</div>
            </div>
          </section>

          <section className="cf-section">
            <div className="cf-section__head">
              <div className="cf-section__title">
                <span className="cf-miniIcon cf-miniIcon--purple">🎦</span>
                Theater Locations
              </div>
            </div>

            <TheatersGrid />
          </section>

          <TheatersMapCard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
