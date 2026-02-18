import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { listScreens } from "../../api/screens";
import {
  deleteTheater,
  listTheaters,
  updateTheater
} from "../../api/theaters";
import "../../styles/admin/adminTheaters.css";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80";

function mapTheaterRow(row, screens) {
  const theaterScreens = screens.filter((s) => Number(s.theater_id) === Number(row.id));
  const totalSeats = theaterScreens.reduce((sum, s) => sum + Number(s.total_seats || 0), 0);

  return {
    id: row.id,
    name: row.name,
    status: "Active",
    address: row.address ? `${row.address}${row.city ? `, ${row.city}` : ""}` : row.city || "-",
    phone: "-",
    distance: "-",
    hero: FALLBACK_HERO,
    stats: {
      screens: theaterScreens.length,
      seats: totalSeats,
      todaysShows: 0,
      occupancy: 0
    },
    facilities: [...new Set(theaterScreens.map((s) => s.name))].slice(0, 4),
    screens: theaterScreens.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.name,
      capacity: Number(s.total_seats || 0),
      status: "Active",
      currentMovie: "From schedule"
    })),
    db: row
  };
}

export default function AdminTheaters() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [theaters, setTheaters] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selected = useMemo(
    () => theaters.find((t) => Number(t.id) === Number(selectedId)) || null,
    [theaters, selectedId]
  );

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [theaterRows, screenRows] = await Promise.all([
        listTheaters({ limit: 200 }),
        listScreens({ limit: 500 })
      ]);
      setTheaters(theaterRows.map((t) => mapTheaterRow(t, screenRows)));
    } catch (err) {
      setError(err.message || "Failed to load theaters.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return theaters.filter((t) => {
      const matchesQ =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q) ||
        t.facilities.join(" ").toLowerCase().includes(q);
      const matchesS = status === "all" ? true : t.status.toLowerCase() === status;
      return matchesQ && matchesS;
    });
  }, [theaters, query, status]);

  const totals = useMemo(() => {
    const totalTheaters = theaters.length;
    const totalScreens = theaters.reduce((a, t) => a + (t.stats?.screens || 0), 0);
    const totalCapacity = theaters.reduce((a, t) => a + (t.stats?.seats || 0), 0);
    return { totalTheaters, totalScreens, totalCapacity, avgOcc: 0 };
  }, [theaters]);

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setSelectedId(null);
  }

  async function saveSelectedTheater() {
    if (!selected) return;
    try {
      await updateTheater(selected.id, {
        name: selected.db.name,
        location: selected.db.location || "",
        address: selected.db.address || "",
        city: selected.db.city || ""
      });
      await loadData();
      setSelectedId(null);
    } catch (err) {
      window.alert(err.message || "Failed to update theater.");
    }
  }

  async function removeSelectedTheater() {
    if (!selected) return;
    const ok = window.confirm(`Delete theater "${selected.name}"?`);
    if (!ok) return;
    try {
      await deleteTheater(selected.id);
      setSelectedId(null);
      await loadData();
    } catch (err) {
      window.alert(err.message || "Failed to delete theater.");
    }
  }

  function patchSelectedDb(field, value) {
    if (!selected) return;
    setTheaters((prev) =>
      prev.map((t) =>
        t.id === selected.id
          ? {
              ...t,
              db: { ...t.db, [field]: value },
              name: field === "name" ? value : t.name,
              address:
                field === "address" || field === "city"
                  ? `${field === "address" ? value : t.db.address || ""}${
                      field === "city" ? value : t.db.city ? `, ${t.db.city}` : ""
                    }`.replace(/^,\s*/, "")
                  : t.address
            }
          : t
      )
    );
  }

  return (
    <div className="theaters-page">
      <AdminNavbar />
      <div className="theaters-container">
        <div className="theaters-top">
          <div className="theaters-title">
            <div className="theaters-icon">📍</div>
            <div>
              <h1>Theaters Management</h1>
              <p>Connected to PostgreSQL theaters table</p>
            </div>
          </div>
          <button className="theaters-addBtn" onClick={() => navigate("/admin/theaters/new")}>
            <span className="plus">＋</span> Add New Theater
          </button>
        </div>

        <div className="theaters-filters">
          <div className="filterSearch">
            <span className="searchIcon">🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, address, facilities..."
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
          </select>
          <button className="clearAll" type="button" onClick={clearFilters}>
            Clear All
          </button>
        </div>

        {error ? <div className="emptyRow">{error}</div> : null}
        {loading ? <div className="emptyRow">Loading theaters...</div> : null}

        <div className="theaters-grid">
          {filtered.map((t) => (
            <div key={t.id} className="theater-card">
              <div className="theater-hero" style={{ backgroundImage: `url(${t.hero})` }}>
                <div className={`statusBadge ${t.status.toLowerCase()}`}>
                  <span className="dot" /> {t.status}
                </div>
              </div>
              <div className="theater-body">
                <h3 className="theater-name">{t.name}</h3>
                <div className="theater-row">
                  <span className="rowIcon">📍</span>
                  <span className="rowText">{t.address}</span>
                </div>
                <div className="theater-row">
                  <span className="rowIcon">📞</span>
                  <span className="rowText">{t.phone}</span>
                </div>
                <div className="statsGrid">
                  <div className="statBox blue">
                    <div className="statLabel">Screens</div>
                    <div className="statValue">{t.stats.screens}</div>
                  </div>
                  <div className="statBox purple">
                    <div className="statLabel">Seats</div>
                    <div className="statValue">{t.stats.seats}</div>
                  </div>
                </div>
                <div className="facilities">
                  <div className="facTitle">Facilities:</div>
                  <div className="chips">
                    {t.facilities.length ? t.facilities.map((f) => <span key={f} className="chip">{f}</span>) : <span className="chip">No screens</span>}
                  </div>
                </div>
                <div className="cardActions">
                  <button className="manageBtn" onClick={() => setSelectedId(t.id)}>
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="perfCard">
          <div className="perfHead">
            <div className="perfIcon">📈</div>
            <div>
              <h3>Performance Overview</h3>
              <p>Quick summary across all theaters</p>
            </div>
          </div>
          <div className="perfGrid">
            <div className="perfBox blue">
              <div className="perfLabel">Total Theaters</div>
              <div className="perfValue">{totals.totalTheaters}</div>
            </div>
            <div className="perfBox purple">
              <div className="perfLabel">Total Screens</div>
              <div className="perfValue">{totals.totalScreens}</div>
            </div>
            <div className="perfBox orange">
              <div className="perfLabel">Total Capacity</div>
              <div className="perfValue">{totals.totalCapacity.toLocaleString()}</div>
            </div>
            <div className="perfBox green">
              <div className="perfLabel">Avg Occupancy</div>
              <div className="perfValue">{totals.avgOcc}%</div>
            </div>
          </div>
        </div>
      </div>

      {selected ? (
        <div className="drawerOverlay" onClick={() => setSelectedId(null)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawerHead">
              <div className="drawerTitle">
                <div className="drawerIcon">🖥️</div>
                <div>
                  <h3>Manage Theater</h3>
                  <p>Edit theater details and view screens</p>
                </div>
              </div>
              <div className="drawerActions">
                <button className="drawerAdd" onClick={saveSelectedTheater}>
                  Save
                </button>
                <button className="drawerClose" onClick={() => setSelectedId(null)}>
                  ✕
                </button>
              </div>
            </div>

            <div className="drawerTableWrap" style={{ marginBottom: 14 }}>
              <div style={{ display: "grid", gap: 10 }}>
                <input className="cellInput" value={selected.db.name} onChange={(e) => patchSelectedDb("name", e.target.value)} />
                <input className="cellInput" value={selected.db.city || ""} onChange={(e) => patchSelectedDb("city", e.target.value)} placeholder="City" />
                <input className="cellInput" value={selected.db.location || ""} onChange={(e) => patchSelectedDb("location", e.target.value)} placeholder="Location" />
                <input className="cellInput" value={selected.db.address || ""} onChange={(e) => patchSelectedDb("address", e.target.value)} placeholder="Address" />
              </div>
            </div>

            <div className="drawerTableWrap">
              <table className="drawerTable">
                <thead>
                  <tr>
                    <th>Screen</th>
                    <th>Type</th>
                    <th>Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.screens.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="emptyRow">No screens found for this theater.</td>
                    </tr>
                  ) : (
                    selected.screens.map((s) => (
                      <tr key={s.id}>
                        <td className="cellStrong">{s.name}</td>
                        <td>{s.type}</td>
                        <td>{s.capacity}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="drawerSummary">
              <button className="rowIconBtn red" onClick={removeSelectedTheater}>
                Delete Theater
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
