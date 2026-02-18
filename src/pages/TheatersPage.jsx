import "../styles/customer.css";
import "../styles/theaters.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import { listScreens } from "../api/screens";
import { listTheaters } from "../api/theaters";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Leaflet marker fix for Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BASE_LAT = 13.736717;
const BASE_LNG = 100.523186;

function mapTheaters(theaterRows, screenRows) {
  return theaterRows.map((t, idx) => {
    const screens = screenRows.filter((s) => Number(s.theater_id) === Number(t.id));
    return {
      id: String(t.id),
      name: t.name,
      address: [t.address, t.city].filter(Boolean).join(", ") || t.location || "-",
      phone: "-",
      screens: screens.length,
      lat: BASE_LAT + idx * 0.01,
      lng: BASE_LNG + idx * 0.01
    };
  });
}

export default function TheatersPage() {
  const navigate = useNavigate();

  const [view, setView] = useState("LIST"); // LIST | MAP
  const [theaters, setTheaters] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setError("");
        const [theaterRows, screenRows] = await Promise.all([
          listTheaters({ limit: 200 }),
          listScreens({ limit: 500 })
        ]);
        if (!mounted) return;
        const mapped = mapTheaters(theaterRows, screenRows);
        setTheaters(mapped);
        if (mapped.length > 0) {
          setSelectedId(mapped[0].id);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load theaters.");
        }
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const selected = useMemo(() => {
    return theaters.find((t) => t.id === selectedId) || theaters[0];
  }, [selectedId, theaters]);

  const mapCenter = useMemo(() => {
    if (!selected) return [13.736717, 100.523186];
    return [selected.lat, selected.lng];
  }, [selected]);

  function openInGoogleMaps(t) {
    const url = `https://www.google.com/maps?q=${t.lat},${t.lng}`;
    window.open(url, "_blank");
  }

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          {/* Header */}
          <div className="th-head">
            <div>
              <div className="th-title">📍 Theaters</div>
              <div className="th-sub">Live from PostgreSQL theaters table</div>
            </div>

            <div className="th-toggle">
              <button
                className={`th-pill ${view === "LIST" ? "th-pill--active" : ""}`}
                onClick={() => setView("LIST")}
                type="button"
              >
                List View
              </button>
              <button
                className={`th-pill ${view === "MAP" ? "th-pill--active" : ""}`}
                onClick={() => setView("MAP")}
                type="button"
              >
                Map View
              </button>
            </div>
          </div>

          {error ? <div className="th-sub" style={{ marginBottom: 12 }}>{error}</div> : null}

          {/* LIST VIEW */}
          {view === "LIST" ? (
            <div className="th-listView">
              <div className="th-listGrid">
                {theaters.map((t) => (
                  <button
                    key={t.id}
                    className={`th-card ${t.id === selectedId ? "th-card--active" : ""}`}
                    onClick={() => setSelectedId(t.id)}
                    type="button"
                  >
                    <div className="th-cardTitle">{t.name}</div>
                    <div className="th-cardRow">📍 {t.address}</div>
                    <div className="th-cardRow">📞 {t.phone}</div>
                    <div className="th-cardRow">🎬 {t.screens} screens</div>

                    <div className="th-cardActions">
                      <button
                        className="th-smallBtn"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(t.id);
                          setView("MAP");
                        }}
                      >
                        View on Map
                      </button>

                      <button
                        className="th-smallBtn th-smallBtn--ghost"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openInGoogleMaps(t);
                        }}
                      >
                        Google Maps
                      </button>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected detail */}
              {selected && (
                <div className="th-detail">
                  <div className="th-detailTitle">Selected Theater</div>
                  <div className="th-detailName">{selected.name}</div>
                  <div className="th-detailRow">📍 {selected.address}</div>
                  <div className="th-detailRow">📞 {selected.phone}</div>
                  <div className="th-detailRow">🎬 Screens: {selected.screens}</div>

                  <div className="th-detailButtons">
                    <button className="th-action" onClick={() => setView("MAP")} type="button">
                      Open Map View
                    </button>
                    <button
                      className="th-action th-action--secondary"
                      onClick={() => openInGoogleMaps(selected)}
                      type="button"
                    >
                      Open Google Maps
                    </button>
                  </div>
                </div>
              )}
              {!selected && !error ? (
                <div className="th-detail">
                  <div className="th-detailTitle">No theaters found</div>
                </div>
              ) : null}
            </div>
          ) : (
            /* MAP VIEW */
            <div className="th-mapWrap">
              <div className="th-mapTop">
                <div>
                  <div className="th-mapTitle">{selected?.name || "Theater Map"}</div>
                  <div className="th-mapSub">{selected?.address || ""}</div>
                </div>

                <div className="th-mapTopRight">
                  {selected && (
                    <button
                      className="th-smallBtn th-smallBtn--ghost"
                      onClick={() => openInGoogleMaps(selected)}
                      type="button"
                    >
                      Google Maps
                    </button>
                  )}
                  <button className="th-smallBtn" onClick={() => setView("LIST")} type="button">
                    Back to List
                  </button>
                </div>
              </div>

              <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className="th-map">
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {theaters.map((t) => (
                  <Marker
                    key={t.id}
                    position={[t.lat, t.lng]}
                    eventHandlers={{
                      click: () => setSelectedId(t.id),
                    }}
                  >
                    <Popup>
                      <b>{t.name}</b>
                      <br />
                      {t.address}
                      <br />
                      🎬 {t.screens} screens
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}

          {/* Optional back button */}
          <div style={{ marginTop: 16 }}>
            <button className="th-smallBtn th-smallBtn--ghost" onClick={() => navigate(-1)} type="button">
              ← Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
