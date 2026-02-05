import React, { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin/adminTheaters.css";

const STORAGE_KEY = "cinemaFlow_admin_theaters_v1";


const demoTheaters = [
  {
    id: 1,
    name: "Cinema Listic Downtown",
    status: "Active",
    address: "123 Main Street, City, State 12345",
    phone: "(555) 123-4567",
    distance: "2.3 miles",
    hero:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1400&q=80",
    stats: {
      screens: 8,
      seats: 1200,
      todaysShows: 32,
      occupancy: 68,
    },
    facilities: ["IMAX", "Dolby Atmos", "Premium Seating", "Cafe"],
    location: { lat: 40.758, lng: -73.9855 },
    screens: [
      {
        id: 1,
        name: "Screen 1",
        type: "IMAX",
        capacity: 250,
        status: "Active",
        currentMovie: "The Last Adventure",
      },
      {
        id: 2,
        name: "Screen 2",
        type: "Premium",
        capacity: 180,
        status: "Active",
        currentMovie: "Hearts Entwined",
      },
      {
        id: 3,
        name: "Screen 3",
        type: "Standard",
        capacity: 150,
        status: "Active",
        currentMovie: "Laugh Out Loud",
      },
      {
        id: 4,
        name: "Screen 4",
        type: "Standard",
        capacity: 150,
        status: "Active",
        currentMovie: "Midnight Shadows",
      },
      {
        id: 5,
        name: "Screen 5",
        type: "Premium",
        capacity: 180,
        status: "Maintenance",
        currentMovie: "N/A",
      },
      {
        id: 6,
        name: "Screen 6",
        type: "Standard",
        capacity: 120,
        status: "Active",
        currentMovie: "The Last Adventure",
      },
      {
        id: 7,
        name: "Screen 7",
        type: "Standard",
        capacity: 120,
        status: "Active",
        currentMovie: "Hearts Entwined",
      },
      {
        id: 8,
        name: "Screen 8",
        type: "IMAX",
        capacity: 250,
        status: "Active",
        currentMovie: "The Last Adventure",
      },
    ],
  },
  {
    id: 2,
    name: "Cinema Listic Mall Location",
    status: "Active",
    address: "456 Shopping Ave, City, State 12345",
    phone: "(555) 234-5678",
    distance: "4.7 miles",
    hero:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80",
    stats: {
      screens: 6,
      seats: 900,
      todaysShows: 24,
      occupancy: 72,
    },
    facilities: ["4K Projection", "Dolby Atmos", "Food Court"],
    location: { lat: 40.7306, lng: -73.9975 },
    screens: [
      {
        id: 1,
        name: "Screen 1",
        type: "Standard",
        capacity: 150,
        status: "Active",
        currentMovie: "Hearts Entwined",
      },
      {
        id: 2,
        name: "Screen 2",
        type: "Standard",
        capacity: 150,
        status: "Active",
        currentMovie: "Laugh Out Loud",
      },
      {
        id: 3,
        name: "Screen 3",
        type: "Premium",
        capacity: 180,
        status: "Active",
        currentMovie: "The Last Adventure",
      },
      {
        id: 4,
        name: "Screen 4",
        type: "Standard",
        capacity: 120,
        status: "Active",
        currentMovie: "Midnight Shadows",
      },
      {
        id: 5,
        name: "Screen 5",
        type: "Standard",
        capacity: 150,
        status: "Active",
        currentMovie: "Love in Paris",
      },
      {
        id: 6,
        name: "Screen 6",
        type: "Premium",
        capacity: 150,
        status: "Active",
        currentMovie: "Future World",
      },
    ],
  },
  {
    id: 3,
    name: "Cinema Listic Suburban",
    status: "Active",
    address: "88 Green Road, City, State 12345",
    phone: "(555) 345-6789",
    distance: "7.1 miles",
    hero:
      "https://images.unsplash.com/photo-1527295110-5145f6b148d8?auto=format&fit=crop&w=1400&q=80",
    stats: {
      screens: 5,
      seats: 750,
      todaysShows: 18,
      occupancy: 61,
    },
    facilities: ["Kids Zone", "Snack Bar", "3D"],
    location: { lat: 40.7128, lng: -74.006 },
    screens: [
      {
        id: 1,
        name: "Screen 1",
        type: "Standard",
        capacity: 150,
        status: "Active",
        currentMovie: "Laugh Out Loud",
      },
      {
        id: 2,
        name: "Screen 2",
        type: "Standard",
        capacity: 150,
        status: "Active",
        currentMovie: "Love in Paris",
      },
      {
        id: 3,
        name: "Screen 3",
        type: "Premium",
        capacity: 180,
        status: "Active",
        currentMovie: "The Last Adventure",
      },
      {
        id: 4,
        name: "Screen 4",
        type: "Standard",
        capacity: 120,
        status: "Active",
        currentMovie: "Future World",
      },
      {
        id: 5,
        name: "Screen 5",
        type: "Standard",
        capacity: 150,
        status: "Maintenance",
        currentMovie: "N/A",
      },
    ],
  },
];

function safeLoad() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeSave(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore write errors (e.g., private mode)
  }
}

export default function AdminTheaters() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [theaters, setTheaters] = useState(() => safeLoad() || demoTheaters);

  const [selectedId, setSelectedId] = useState(null); // for Manage drawer
  const selected = useMemo(
    () => theaters.find((t) => t.id === selectedId) || null,
    [theaters, selectedId]
  );

  useEffect(() => {
    safeSave(theaters);
  }, [theaters]);


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
    const avgOcc =
      theaters.length === 0
        ? 0
        : Math.round(
            theaters.reduce((a, t) => a + (t.stats?.occupancy || 0), 0) / theaters.length
          );
    return { totalTheaters, totalScreens, totalCapacity, avgOcc };
  }, [theaters]);

  function clearFilters() {
    setQuery("");
    setStatus("all");
    setSelectedId(null);
  }

  function openManage(tid) {
    setSelectedId(tid);
  }

  function closeManage() {
    setSelectedId(null);
  }

  function addNewTheater() {
    const nextId = Math.max(...theaters.map((t) => t.id)) + 1;
    const newTheater = {
      id: nextId,
      name: `New Theater ${nextId}`,
      status: "Active",
      address: "New Address",
      phone: "(000) 000-0000",
      distance: "--",
      hero:
        "data:image/jpeg;base64,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",
      stats: { screens: 4, seats: 600, todaysShows: 0, occupancy: 0 },
      facilities: ["Standard"],
      location: { lat: 40.741, lng: -73.99 },
      screens: [],
    };
    setTheaters((prev) => [newTheater, ...prev]);
  }

  function addScreenToSelected() {
    if (!selected) return;
    const nextId = (selected.screens?.length || 0) + 1;

    const newScreen = {
      id: nextId,
      name: `Screen ${nextId}`,
      type: "Standard",
      capacity: 120,
      status: "Active",
      currentMovie: "N/A",
    };

    setTheaters((prev) =>
      prev.map((t) => {
        if (t.id !== selected.id) return t;
        const nextScreens = [newScreen, ...(t.screens || [])];
        const nextScreensCount = nextScreens.length;

        return {
          ...t,
          screens: nextScreens,
          stats: { ...(t.stats || {}), screens: nextScreensCount },
        };
      })
    );
  }

  function editScreenField(screenId, field, value) {
    if (!selected) return;
    setTheaters((prev) =>
      prev.map((t) => {
        if (t.id !== selected.id) return t;
        const nextScreens = (t.screens || []).map((s) =>
          s.id === screenId ? { ...s, [field]: value } : s
        );
        return { ...t, screens: nextScreens };
      })
    );
  }

  function deleteScreen(screenId) {
    if (!selected) return;
    setTheaters((prev) =>
      prev.map((t) => {
        if (t.id !== selected.id) return t;
        const nextScreens = (t.screens || []).filter((s) => s.id !== screenId);
        return {
          ...t,
          screens: nextScreens,
          stats: { ...(t.stats || {}), screens: nextScreens.length },
        };
      })
    );
  }

  return (
    <div className="theaters-page">
      <AdminNavbar />

      <div className="theaters-container">
        {/* Top header */}
        <div className="theaters-top">
          <div className="theaters-title">
            <div className="theaters-icon">📍</div>
            <div>
              <h1>Theaters Management</h1>
              <p>Find locations and manage screens & capacity</p>
            </div>
          </div>

          <button className="theaters-addBtn" onClick={addNewTheater}>
            <span className="plus">＋</span> Add New Theater
          </button>
        </div>

        {/* Sub header row */}
        <div className="theaters-subhead">
          <div className="theaters-subLeft">
            <div className="theaters-subIcon">🎞️</div>
            <h2>Theater Locations</h2>
          </div>

          <div className="theaters-toggle">
            <button className="toggleBtn active">☰ List View</button>
          </div>
        </div>

        {/* Filters */}
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
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="clearAll" type="button" onClick={clearFilters}>
            Clear All
          </button>
        </div>

        {/* MAIN VIEW */}
        <>
          <div className="theaters-grid">
            {filtered.map((t) => (
              <div key={t.id} className="theater-card">
                  <div
                    className="theater-hero"
                    style={{ backgroundImage: `url(${t.hero})` }}
                  >
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
                      <div className="statBox orange">
                        <div className="statLabel">Today’s Shows</div>
                        <div className="statValue">{t.stats.todaysShows}</div>
                      </div>
                      <div className="statBox green">
                        <div className="statLabel">Occupancy</div>
                        <div className="statValue">{t.stats.occupancy}%</div>
                      </div>
                    </div>

                    <div className="facilities">
                      <div className="facTitle">Facilities:</div>
                      <div className="chips">
                        {t.facilities.map((f) => (
                          <span key={f} className="chip">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="cardActions">
                      <button className="manageBtn" onClick={() => openManage(t.id)}>
                        Manage
                      </button>
                      <button className="settingsBtn" onClick={() => openManage(t.id)}>
                        ⚙️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Performance Overview */}
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
                <div className="perfValue">
                  {totals.totalCapacity.toLocaleString()}
                </div>
              </div>
              <div className="perfBox green">
                <div className="perfLabel">Avg Occupancy</div>
                <div className="perfValue">{totals.avgOcc}%</div>
              </div>
            </div>
          </div>
        </>

        <div className="theaters-footer">
          © 2025 Cinema Listic. All rights reserved.
        </div>
      </div>

      {/* Manage Drawer / Modal */}
      {selected && (
        <div className="drawerOverlay" onClick={closeManage}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawerHead">
              <div className="drawerTitle">
                <div className="drawerIcon">🖥️</div>
                <div>
                  <h3>Screens - {selected.name.replace("Cinema Listic ", "")}</h3>
                  <p>Manage screens, capacity, and status</p>
                </div>
              </div>

              <div className="drawerActions">
                <button className="drawerAdd" onClick={addScreenToSelected}>
                  ＋ Add Screen
                </button>
                <button className="drawerClose" onClick={closeManage}>
                  ✕
                </button>
              </div>
            </div>

            <div className="drawerTableWrap">
              <table className="drawerTable">
                <thead>
                  <tr>
                    <th>Screen</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Current Movie</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.screens || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="emptyRow">
                        No screens yet. Click “Add Screen”.
                      </td>
                    </tr>
                  ) : (
                    selected.screens.map((s) => (
                      <tr key={s.id}>
                        <td className="cellStrong">{s.name}</td>

                        <td>
                          <select
                            className="cellSelect"
                            value={s.type}
                            onChange={(e) =>
                              editScreenField(s.id, "type", e.target.value)
                            }
                          >
                            <option>IMAX</option>
                            <option>Premium</option>
                            <option>Standard</option>
                            <option>Dolby Atmos</option>
                          </select>
                        </td>

                        <td>
                          <input
                            className="cellInput"
                            type="number"
                            min="0"
                            value={s.capacity}
                            onChange={(e) =>
                              editScreenField(s.id, "capacity", Number(e.target.value || 0))
                            }
                          />
                          <span className="seatSuffix"> seats</span>
                        </td>

                        <td>
                          <span className={`pill ${String(s.status).toLowerCase()}`}>
                            {s.status}
                          </span>
                          <select
                            className="cellSelect small"
                            value={s.status}
                            onChange={(e) =>
                              editScreenField(s.id, "status", e.target.value)
                            }
                          >
                            <option>Active</option>
                            <option>Maintenance</option>
                            <option>Inactive</option>
                          </select>
                        </td>

                        <td>
                          <input
                            className="cellInput"
                            value={s.currentMovie}
                            onChange={(e) =>
                              editScreenField(s.id, "currentMovie", e.target.value)
                            }
                          />
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <button
                            className="rowIconBtn blue"
                            title="Edit"
                            onClick={() => {}}
                          >
                            ✎
                          </button>
                          <button
                            className="rowIconBtn red"
                            title="Delete"
                            onClick={() => deleteScreen(s.id)}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* small summary */}
            <div className="drawerSummary">
              <div className="sumBox blue">
                <div className="sumLabel">Total Screens</div>
                <div className="sumValue">{selected.stats.screens}</div>
              </div>
              <div className="sumBox purple">
                <div className="sumLabel">Total Seats</div>
                <div className="sumValue">{selected.stats.seats}</div>
              </div>
              <div className="sumBox orange">
                <div className="sumLabel">Today’s Shows</div>
                <div className="sumValue">{selected.stats.todaysShows}</div>
              </div>
              <div className="sumBox green">
                <div className="sumLabel">Occupancy</div>
                <div className="sumValue">{selected.stats.occupancy}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
