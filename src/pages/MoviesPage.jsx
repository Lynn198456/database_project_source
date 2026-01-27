import "../styles/customer.css";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";
import MoviesGrid from "../components/customer/MoviesGrid";

export default function MoviesPage() {
  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-container">
          <section className="cf-section">
            <div className="cf-section__head">
              <div className="cf-section__title">
                <span className="cf-miniIcon cf-miniIcon--orange">🎬</span>
                All Movies
              </div>
              <div className="cf-section__subtitle">
                Browse our collection
              </div>
            </div>
          </section>

          {/* Movies cards */}
          <MoviesGrid />
        </div>
      </main>

      <Footer />
    </div>
  );
}
