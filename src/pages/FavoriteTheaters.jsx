import "../styles/customer.css";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";

function loadFavorites() {
  try {
    const raw = localStorage.getItem("cinemaFlow_favoriteTheaters");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Demo seed (matches your screenshot vibe)
const SEED_FAV = [
  {
    id: "TH-001",
    name: "Cinema Listic Downtown",
    address: "123 Main Street",
    visits: 8,
    img: "/assets/hearts-entwined.jpg",
  },
  {
    id: "TH-002",
    name: "Cinema Listic Mall Location",
    address: "456 Shopping Ave",
    visits: 5,
    img: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "TH-003",
    name: "Cinema Listic Suburban",
    address: "789 Suburban Blvd",
    visits: 2,
    img: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=1400&auto=format&fit=crop",
  },
];

export default function FavoriteTheaters() {
  const navigate = useNavigate();

  // load from localStorage, else seed
  const initial = useMemo(() => loadFavorites() || SEED_FAV, []);
  const [theaters] = useState(initial);

  const empty = theaters.length === 0;

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          {/* top row */}
          <div className="sp-top" style={{ marginBottom: 16 }}>
            <button className="sp-back" type="button" onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="sp-title">
              <span className="sp-ico">📍</span> Favorite Theaters
            </div>
          </div>

          {/* panel */}
          <div className="bh-panel" style={{ padding: 18 }}>
            <div className="bh-panelHead" style={{ marginBottom: 14 }}>
              <span className="bh-film">⭐</span> Your Favorites
            </div>

            {empty ? (
              <div
                style={{
                  padding: 24,
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,.10)",
                  background: "rgba(255,255,255,.04)",
                  color: "rgba(230,240,255,.9)",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                No favorite theaters yet.
              </div>
            ) : (
              <div className="pf-theaterGrid2">
                {theaters.map((t) => (
                  <div key={t.id} className="pf-theaterCard2">
                    <div
                      className="pf-theaterImg"
                      style={{
                        backgroundImage: `url(${t.img})`,
                      }}
                    />
                    <div className="pf-theaterBody">
                      <div className="pf-theaterName">{t.name}</div>
                      <div className="pf-theaterAddr">{t.address}</div>
                      <div className="pf-theaterVisits">⭐ {t.visits} visits</div>

                      {/* ✅ Buttons removed (Remove / Clear All removed as requested) */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
