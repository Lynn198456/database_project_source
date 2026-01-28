import "../styles/customer.css";
import "../styles/theaters.css";
import { useMemo, useState } from "react";
import Navbar from "../components/customer/Navbar";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Leaflet marker fix (Vite)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const THEATERS = [
  {
    id: "t1",
    name: "CinemaFlow Downtown",
    address: "Sukhumvit Rd, Bangkok",
    phone: "+66 2 123 4567",
    screens: 6,
    lat: 13.736717,
    lng: 100.523186,
  },
  {
    id: "t2",
    name: "CinemaFlow Mall",
    address: "Central Mall, Bangkok",
    phone: "+66 2 987 6543",
    screens: 8,
    lat: 13.746,
    lng: 100.534,
  },
];

export default function TheatersPage() {
  const navigate = useNavigate();

  const [view, setView] = useState("LIST"); // LIST | MAP
  const [selectedId, setSelectedId] = useState(THEATERS[0]?.id || "");

  const selected = useMemo(
    () => THEATERS.find((t) => t.id === selectedId) || THEATERS[0],
    [selectedId]
  );

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
              <div className="th-sub">Switch between List View and Map View</div>
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

          {/* Content */}
          {view === "LIST" ? (
            // ✅ LIST VIEW
            <div className="th-listView">
              <div className="th-listGrid">
                {THEATERS.map((t) => (
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

              {/* Selected theater detail */}
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
            </div>
          ) : (
            // ✅ MAP VIEW
            <div className="th-mapWrap">
              <div className="th-mapTop">
                <div className="th-mapTopLeft">
                  <div className="th-mapTitle">{selected?.name || "Theater Map"}</div>
                  <div className="th-mapSub">{selected?.address}</div>
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

                {THEATERS.map((t) => (
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
        </div>
      </main>
    </div>
  );
}
