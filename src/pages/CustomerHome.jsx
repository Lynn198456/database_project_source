import "../styles/customer.css";
import Navbar from "../components/customer/Navbar";
import Hero from "../components/customer/Hero";
import NowShowingGrid from "../components/customer/NowShowingGrid";
import TodaysShowtimes from "../components/customer/TodaysShowtimes";
import ComingSoon from "../components/customer/ComingSoon";
import PremiumExperience from "../components/customer/PremiumExperience";
import OurTheaters from "../components/customer/OurTheaters";
import Footer from "../components/customer/Footer";

export default function CustomerHome() {
  return (
    <div className="cf-page">
      <Navbar />
      <main className="cf-main">
        <Hero />
        <NowShowingGrid />
        <TodaysShowtimes />
        <ComingSoon />
        <PremiumExperience />
        <OurTheaters />
      </main>
      navigate("/customer/book");

      <Footer />
    </div>
  );
}
