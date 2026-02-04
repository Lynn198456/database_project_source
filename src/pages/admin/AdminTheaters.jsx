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
        "/assets/hearts-entwined.jpg",
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
