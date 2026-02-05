import "../styles/customer.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import Footer from "../components/customer/Footer";

const STORAGE_KEY = "cinemaFlow_watchlist";

// demo seed (like your screenshot)
const SEED_WATCHLIST = [
  {
    id: "W1",
    title: "Future World",
    date: "December 2024",
    img: "https://m.media-amazon.com/images/I/71TusjqyRZL.jpg",
    status: "Coming Soon",
  },
  {
    id: "W2",
    title: "Love in Paris",
    date: "December 2024",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop",
    status: "Coming Soon",
  },
  {
    id: "W3",
    title: "Mystery Island",
    date: "December 2024",
    img: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop",
    status: "Coming Soon",
  },
  {
    id: "W4",
    title: "Action Hero",
    date: "December 2024",
    img: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=1200&auto=format&fit=crop",
    status: "Coming Soon",
  },
];

function loadWatchlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveWatchlist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export default function Watchlist() {
  const navigate = useNavigate();

  const initial = useMemo(() => loadWatchlist() || SEED_WATCHLIST, []);
  const [items, setItems] = useState(initial);

  // Small success message banner (like your profile page)
  const [msg, setMsg] = useState("");

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  useEffect(() => {
    // keep localStorage in sync
    saveWatchlist(items);
  }, [items]);

  function openConfirm({ title, desc, action }) {
    setConfirmTitle(title);
    setConfirmDesc(desc);
    setOnConfirm(() => action);
    setConfirmOpen(true);
  }

  function closeConfirm() {
    setConfirmOpen(false);
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setMsg("Removed from watchlist ✅");
    setTimeout(() => setMsg(""), 1800);
  }

  function clearAll() {
    setItems([]);
    setMsg("Watchlist cleared ✅");
    setTimeout(() => setMsg(""), 1800);
  }

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide" style={{ paddingBottom: 30 }}>
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              margin: "18px 0 14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="cf-grayBtn"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  fontSize: 20,
                  padding: 0,
                }}
                aria-label="Go back"
              >
                ←
              </button>

              <div style={{ fontSize: 28, fontWeight: 900, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ opacity: 0.9 }}>📁</span> My Watchlist
              </div>
            </div>

            <button
              type="button"
              className="cf-blueBtn"
              disabled={items.length === 0}
              title={items.length === 0 ? "No items to clear" : "Clear all watchlist items"}
              onClick={() =>
                openConfirm({
                  title: "Clear all watchlist items?",
                  desc: "This will remove all movies from your watchlist.",
                  action: clearAll,
                })
              }
              style={{
                opacity: items.length === 0 ? 0.5 : 1,
                cursor: items.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              Clear All
            </button>
          </div>

          {/* message banner */}
          {msg && (
            <div
              style={{
                margin: "10px 0 16px",
                padding: 12,
                borderRadius: 12,
                background: "rgba(34,197,94,.15)",
                border: "1px solid rgba(34,197,94,.25)",
                color: "rgba(220,255,235,.95)",
                fontWeight: 800,
              }}
            >
              {msg}
            </div>
          )}

          {/* Content */}
          {items.length === 0 ? (
            <div
              style={{
                padding: 22,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,.08)",
                background: "rgba(255,255,255,.03)",
                color: "rgba(255,255,255,.7)",
              }}
            >
              Your watchlist is empty. Add movies from the Movies page ⭐
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              {items.map((m) => (
                <div
                  key={m.id}
                  style={{
                    borderRadius: 18,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,.08)",
                    background: "rgba(255,255,255,.03)",
                    boxShadow: "0 12px 40px rgba(0,0,0,.35)",
                  }}
                >
                  <div
                    style={{
                      height: 160,
                      backgroundImage: `url(${m.img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        padding: "6px 10px",
                        borderRadius: 999,
                        fontWeight: 800,
                        fontSize: 12,
                        background: "rgba(236,72,153,.25)",
                        border: "1px solid rgba(236,72,153,.35)",
                        color: "rgba(255,255,255,.95)",
                      }}
                    >
                      {m.status || "Coming Soon"}
                    </div>
                  </div>

                  <div style={{ padding: 14 }}>
                    <div style={{ fontWeight: 900, fontSize: 18 }}>{m.title}</div>
                    <div style={{ marginTop: 6, color: "rgba(255,255,255,.65)", fontWeight: 700 }}>
                      {m.date}
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                      <button
                        type="button"
                        className="cf-blueBtn"
                        style={{ flex: 1 }}
                        onClick={() => navigate("/customer/movies")}
                      >
                        View Movies
                      </button>

                      <button
                        type="button"
                        className="cf-grayBtn"
                        style={{
                          flex: 1,
                          background: "rgba(239,68,68,.14)",
                          borderColor: "rgba(239,68,68,.25)",
                          color: "rgba(255,220,220,.95)",
                        }}
                        onClick={() =>
                          openConfirm({
                            title: "Remove this movie?",
                            desc: `"${m.title}" will be removed from your watchlist.`,
                            action: () => removeItem(m.id),
                          })
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 14, color: "rgba(255,255,255,.55)", fontWeight: 700 }}>
            Tip: Your watchlist is saved automatically (localStorage).
          </div>
        </div>
      </main>

      <Footer />

      {/* ✅ Custom Confirm Modal (NO browser popup) */}
      {confirmOpen && (
        <div
          onMouseDown={closeConfirm}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 18,
            zIndex: 9999,
          }}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: "min(520px, 95vw)",
              borderRadius: 18,
              padding: 16,
              background: "rgba(18,25,40,.92)",
              border: "1px solid rgba(255,255,255,.10)",
              boxShadow: "0 20px 60px rgba(0,0,0,.55)",
              color: "rgba(255,255,255,.92)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 900 }}>{confirmTitle}</div>
            <div style={{ marginTop: 8, color: "rgba(255,255,255,.7)", fontWeight: 700 }}>
              {confirmDesc}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
              <button type="button" className="cf-grayBtn" onClick={closeConfirm}>
                Cancel
              </button>
              <button
                type="button"
                className="cf-blueBtn"
                onClick={() => {
                  onConfirm?.();
                  closeConfirm();
                }}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
