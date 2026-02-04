import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin/adminShowtimes.css";

function formatPrettyDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function toISODate(d) {
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function AdminShowtimes() {
  const navigate = useNavigate();
  // Selected date (default today)
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));
  const prettySelected = useMemo(() => formatPrettyDate(selectedDate), [selectedDate]);

  // Tabs: table | calendar | timeline
  const [view, setView] = useState("table");

  // Filters
  const [movieFilter, setMovieFilter] = useState("all");
  const [theaterFilter, setTheaterFilter] = useState("all");
  const [screenTypeFilter, setScreenTypeFilter] = useState("all");
  const [timeRangeFilter, setTimeRangeFilter] = useState("all");

  function clearAllFilters() {
    setMovieFilter("all");
    setTheaterFilter("all");
    setScreenTypeFilter("all");
    setTimeRangeFilter("all");
  }

  // Demo data (replace with your real DB later)
  const movies = useMemo(
    () => ["The Last Adventure", "Hearts Entwined", "Laugh Out Loud", "Midnight Shadows"],
    []
  );

  const theaters = useMemo(
    () => ["Cinema Listic Downtown", "Cinema Listic Mall", "Cinema Listic Riverside"],
    []
  );

  const showtimes = useMemo(
    () => [
      {
        id: 1,
        date: selectedDate,
        movie: "The Last Adventure",
        screen: "Screen 1 - IMAX",
        screenType: "imax",
        theater: "Cinema Listic Downtown",
        time: "10:00 AM",
        seats: { booked: 45, total: 120 },
      },
      {
        id: 2,
        date: selectedDate,
        movie: "The Last Adventure",
        screen: "Screen 2 - Standard",
        screenType: "standard",
        theater: "Cinema Listic Downtown",
        time: "01:15 PM",
        seats: { booked: 102, total: 150 },
      },
      {
        id: 3,
        date: selectedDate,
        movie: "Hearts Entwined",
        screen: "Screen 3 - Premium",
        screenType: "premium",
        theater: "Cinema Listic Downtown",
        time: "02:00 PM",
        seats: { booked: 12, total: 100 },
      },
      {
        id: 4,
        date: selectedDate,
        movie: "Laugh Out Loud",
        screen: "Screen 1 - IMAX",
        screenType: "imax",
        theater: "Cinema Listic Mall",
        time: "03:30 PM",
        seats: { booked: 67, total: 120 },
      },
      {
        id: 5,
        date: selectedDate,
        movie: "Midnight Shadows",
        screen: "Screen 4 - Dolby Atmos",
        screenType: "dolby",
        theater: "Cinema Listic Downtown",
        time: "05:00 PM",
        seats: { booked: 150, total: 150 },
      },
      {
        id: 6,
        date: selectedDate,
        movie: "The Last Adventure",
        screen: "Screen 1 - IMAX",
        screenType: "imax",
        theater: "Cinema Listic Downtown",
        time: "07:45 PM",
        seats: { booked: 89, total: 120 },
      },
      {
        id: 7,
        date: selectedDate,
        movie: "Hearts Entwined",
        screen: "Screen 2 - Standard",
        screenType: "standard",
        theater: "Cinema Listic Mall",
        time: "08:00 PM",
        seats: { booked: 67, total: 150 },
      },
      {
        id: 8,
        date: selectedDate,
        movie: "Laugh Out Loud",
        screen: "Screen 3 - Premium",
        screenType: "premium",
        theater: "Cinema Listic Mall",
        time: "09:15 PM",
        seats: { booked: 43, total: 100 },
      },
    ],
    [selectedDate]
  );

  // Status helpers
  function statusFromSeats(booked, total) {
    if (booked >= total) return "soldout";
    const ratio = total === 0 ? 0 : booked / total;
    if (ratio >= 0.75) return "filling";
    return "available";
  }

  function timeRangeOf(timeStr) {
    // quick demo categorization
    // "10:00 AM" => morning, etc.
    const t = timeStr.toLowerCase();
    if (t.includes("am")) return "morning";
    // pm
    const hour = parseInt(timeStr.split(":")[0], 10);
    if (hour >= 12 && hour <= 4) return "afternoon";
    if (hour >= 5 && hour <= 8) return "evening";
    return "night";
  }

  const filtered = useMemo(() => {
    return showtimes.filter((s) => {
      const okMovie = movieFilter === "all" || s.movie === movieFilter;
      const okTheater = theaterFilter === "all" || s.theater === theaterFilter;

      const okScreen =
        screenTypeFilter === "all" || s.screenType === screenTypeFilter;

      const okTime =
        timeRangeFilter === "all" || timeRangeOf(s.time) === timeRangeFilter;

      return okMovie && okTheater && okScreen && okTime;
    });
  }, [showtimes, movieFilter, theaterFilter, screenTypeFilter, timeRangeFilter]);

  // Stats
  const stats = useMemo(() => {
    const totalShows = filtered.length;
    const totalSeats = filtered.reduce((sum, s) => sum + s.seats.total, 0);
    const bookedSeats = filtered.reduce((sum, s) => sum + s.seats.booked, 0);
    const occupancy = totalSeats === 0 ? 0 : (bookedSeats / totalSeats) * 100;
    return { totalShows, totalSeats, bookedSeats, occupancy };
  }, [filtered]);

  // Date strip (7 days)
  const dateStrip = useMemo(() => {
    const base = new Date(selectedDate + "T00:00:00");
    // show the week centered-ish: today + next 6
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(base, i);
      const iso = toISODate(d);
      const weekday = d.toLocaleDateString(undefined, { weekday: "short" });
      const day = d.getDate();
      const month = d.toLocaleDateString(undefined, { month: "short" });
      return { iso, weekday, day, month };
    });
  }, [selectedDate]);

  function onScheduleNew() {
    navigate("/admin/showtimes/schedule/new");
  }

  function onEditRow(id) {
    alert(`Edit showtime #${id} (connect later)`);
  }

  function onDeleteRow(id) {
    alert(`Delete showtime #${id} (connect later)`);
  }

  return (
    <div className="as-page">
      <AdminNavbar />

      <main className="as-container">
        {/* Header */}
        <div className="as-topbar">
          <div className="as-titleBox">
            <div className="as-icon">🕒</div>
            <div>
              <h1 className="as-title">Showtimes Management</h1>
              <p className="as-sub">Browse and manage showtimes</p>
            </div>
          </div>

          <button className="as-primaryBtn" onClick={onScheduleNew}>
            <span className="as-plus">＋</span>
            Schedule New Showtime
          </button>
        </div>

        {/* Date strip card */}
        <section className="as-card">
          <div className="as-cardHead">
            <div className="as-cardHeadLeft">
              <span className="as-cardHeadIcon">📅</span>
              <h2 className="as-cardHeadTitle">Select Date</h2>
            </div>

            {/* Optional real date input */}
            <input
              className="as-dateInput"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              aria-label="Select date"
            />
          </div>

          <div className="as-dateStrip">
            {dateStrip.map((d) => {
              const active = d.iso === selectedDate;
              return (
                <button
                  key={d.iso}
                  className={`as-datePill ${active ? "active" : ""}`}
                  onClick={() => setSelectedDate(d.iso)}
                >
                  <div className="as-dateWeek">{d.weekday}</div>
                  <div className="as-dateNum">{d.day}</div>
                  <div className="as-dateMonth">{d.month}</div>
                  {active && <div className="as-todayTag">Today</div>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Filters card */}
        <section className="as-card">
          <div className="as-cardHead as-cardHeadRow">
            <div className="as-cardHeadLeft">
              <span className="as-cardHeadIcon">🔽</span>
              <h2 className="as-cardHeadTitle">Filters</h2>
            </div>

            <button className="as-linkBtn" onClick={clearAllFilters}>
              Clear All
            </button>
          </div>

          <div className="as-filters">
            <div className="as-field">
              <label>Movie</label>
              <select value={movieFilter} onChange={(e) => setMovieFilter(e.target.value)}>
                <option value="all">All Movies</option>
                {movies.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="as-field">
              <label>Theater</label>
              <select
                value={theaterFilter}
                onChange={(e) => setTheaterFilter(e.target.value)}
              >
                <option value="all">All Theaters</option>
                {theaters.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="as-field">
              <label>Screen Type</label>
              <select
                value={screenTypeFilter}
                onChange={(e) => setScreenTypeFilter(e.target.value)}
              >
                <option value="all">All Screen Types</option>
                <option value="imax">IMAX</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
                <option value="dolby">Dolby Atmos</option>
              </select>
            </div>

            <div className="as-field">
              <label>Time Range</label>
              <select
                value={timeRangeFilter}
                onChange={(e) => setTimeRangeFilter(e.target.value)}
              >
                <option value="all">All Times</option>
                <option value="morning">Morning (AM)</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
                <option value="night">Night</option>
              </select>
            </div>
          </div>
        </section>

        {/* View controls */}
        <section className="as-viewRow">
          <div className="as-viewLeft">
            <span className="as-muted">
              Showing <b>{filtered.length}</b> showtimes for{" "}
              <b className="as-accent">{prettySelected}</b>
            </span>
          </div>

          <div className="as-tabs">
            <button
              className={`as-tab ${view === "table" ? "active" : ""}`}
              onClick={() => setView("table")}
            >
              ▦ Table
            </button>
            <button
              className={`as-tab ${view === "calendar" ? "active" : ""}`}
              onClick={() => setView("calendar")}
            >
              ☐ Calendar
            </button>
            <button
              className={`as-tab ${view === "timeline" ? "active" : ""}`}
              onClick={() => setView("timeline")}
            >
              ≡ Timeline
            </button>
          </div>
        </section>

        {/* Content by view */}
        {view === "table" && (
          <section className="as-tableCard">
            <table className="as-table">
              <thead>
                <tr>
                  <th>Movie</th>
                  <th>Screen</th>
                  <th>Theater</th>
                  <th>Time</th>
                  <th>Seats</th>
                  <th>Status</th>
                  <th className="as-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const status = statusFromSeats(s.seats.booked, s.seats.total);
                  const seatsText = `${s.seats.booked}/${s.seats.total}`;
                  return (
                    <tr key={s.id}>
                      <td className="as-strong">{s.movie}</td>
                      <td className="as-dim">{s.screen}</td>
                      <td className="as-dim">{s.theater}</td>
                      <td className="as-strong">{s.time}</td>
                      <td className="as-dim">{seatsText}</td>
                      <td>
                        <span className={`as-pill ${status}`}>
                          {status === "soldout"
                            ? "Sold Out"
                            : status === "filling"
                            ? "Filling Fast"
                            : "Available"}
                        </span>
                      </td>
                      <td className="as-right">
                        <div className="as-actions">
                          <button className="as-iconBtn edit" onClick={() => onEditRow(s.id)}>
                            ✎
                          </button>
                          <button
                            className="as-iconBtn del"
                            onClick={() => onDeleteRow(s.id)}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="as-empty">
                      No showtimes match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

{view === "calendar" && (
  <section className="as-calGrid">
    {(() => {
      // group showtimes by movie
      const groups = filtered.reduce((acc, s) => {
        acc[s.movie] = acc[s.movie] || [];
        acc[s.movie].push(s);
        return acc;
      }, {});

      const movieOrder = Object.keys(groups);

      function typeLabel(t) {
        if (t === "imax") return "IMAX";
        if (t === "premium") return "Premium";
        if (t === "dolby") return "Dolby Atmos";
        return "Standard";
      }

      function typeClass(t) {
        if (t === "imax") return "imax";
        if (t === "premium") return "premium";
        if (t === "dolby") return "dolby";
        return "standard";
      }

      return movieOrder.map((movieName) => {
        const items = groups[movieName].slice().sort((a, b) => a.time.localeCompare(b.time));

        // demo duration mapping (optional)
        const durationMap = {
          "The Last Adventure": "2h 15m",
          "Hearts Entwined": "1h 58m",
          "Laugh Out Loud": "1h 42m",
          "Midnight Shadows": "2h 05m",
        };
        const duration = durationMap[movieName] || "—";

        return (
          <div key={movieName} className="as-calMovie">
            {/* Movie header */}
            <div className="as-calMovieHead">
              <div className="as-calMovieIcon">🎞️</div>
              <div className="as-calMovieMeta">
                <div className="as-calMovieTitle">{movieName}</div>
                <div className="as-calMovieSub">
                  <span className="as-calSmallIcon">🕒</span> {duration}
                </div>
              </div>
            </div>

            {/* Showtime cards */}
            <div className="as-calShowList">
              {items.map((s) => {
                const status = statusFromSeats(s.seats.booked, s.seats.total);
                const seatsLeft = Math.max(0, s.seats.total - s.seats.booked);

                return (
                  <div key={s.id} className="as-calShowCard">
                    <div className="as-calShowTop">
                      <div className="as-calTime">{s.time}</div>

                      <div className="as-calTopRight">
                        <span className={`as-calTag ${typeClass(s.screenType)}`}>
                          {typeLabel(s.screenType)}
                        </span>

                        <span className={`as-pill ${status}`}>
                          {status === "soldout"
                            ? "Sold Out"
                            : status === "filling"
                            ? "Filling Fast"
                            : "Available"}
                        </span>
                      </div>
                    </div>

                    <div className="as-calLine">
                      <span className="as-calLineIcon">📍</span>
                      <span className="as-calLineText">{s.theater}</span>
                    </div>

                    <div className="as-calLine">
                      <span className="as-calLineIcon">🎬</span>
                      <span className="as-calLineText">{s.screen}</span>
                    </div>

                    <div className="as-calLine as-calSeats">
                      <span className="as-calLineIcon">💺</span>
                      <span className="as-calLineText">
                        {seatsLeft} of {s.seats.total} seats available
                      </span>
                    </div>

                    <div className="as-calActions">
                      <button className="as-calBtn edit" onClick={() => onEditRow(s.id)}>
                        Edit
                      </button>
                      <button className="as-calBtn del" onClick={() => onDeleteRow(s.id)}>
                        🗑
                      </button>
                    </div>
                  </div>
                );
              })}

              {items.length === 0 && (
                <div className="as-calEmpty">No showtimes for this movie.</div>
              )}
            </div>
          </div>
        );
      });
    })()}
  </section>
)}


{view === "timeline" && (
  <section className="as-timeline">
    {(() => {
      // group by movie
      const groups = filtered.reduce((acc, s) => {
        acc[s.movie] = acc[s.movie] || [];
        acc[s.movie].push(s);
        return acc;
      }, {});

      const movieOrder = Object.keys(groups);

      function typeLabel(t) {
        if (t === "imax") return "IMAX";
        if (t === "premium") return "Premium";
        if (t === "dolby") return "Dolby Atmos";
        return "Standard";
      }

      function typeClass(t) {
        if (t === "imax") return "imax";
        if (t === "premium") return "premium";
        if (t === "dolby") return "dolby";
        return "standard";
      }

      return movieOrder.map((movieName) => {
        const items = groups[movieName]
          .slice()
          .sort((a, b) => a.time.localeCompare(b.time));

        // optional demo duration mapping
        const durationMap = {
          "The Last Adventure": "2h 15m",
          "Hearts Entwined": "1h 58m",
          "Laugh Out Loud": "1h 42m",
          "Midnight Shadows": "2h 05m",
        };
        const duration = durationMap[movieName] || "—";

        return (
          <div key={movieName} className="as-timeRow">
            {/* LEFT PANEL */}
            <div className="as-timeLeft">
              <div className="as-timeLeftIcon">🎞️</div>

              <div className="as-timeLeftMeta">
                <div className="as-timeTitle">{movieName}</div>

                <div className="as-timeSub">
                  <span className="as-timeSubIcon">🕒</span>
                  {duration}
                </div>

                <div className="as-timeCount">
                  <span className="as-timeCountNum">{items.length}</span>{" "}
                  showtimes available
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="as-timeRight">
              <div className="as-timeRightHead">
                <div className="as-timeRightTitle">
                  <span className="as-timeRightIcon">🟣</span> Available Showtimes
                </div>
              </div>

              <div className="as-timeCards">
                {items.map((s) => {
                  const status = statusFromSeats(s.seats.booked, s.seats.total);
                  const seatsLeft = Math.max(0, s.seats.total - s.seats.booked);

                  return (
                    <div
                      key={s.id}
                      className={`as-timeCard ${
                        status === "filling" ? "glow" : ""
                      }`}
                    >
                      <div className="as-timeCardTop">
                        <div className="as-timeCardTime">{s.time}</div>

                        <span className={`as-timeTag ${typeClass(s.screenType)}`}>
                          {typeLabel(s.screenType)}
                        </span>
                      </div>

                      <div className="as-timeInfo">
                        <div className="as-timeLine">
                          <span className="as-timeLineIcon">📍</span>
                          <span>{s.theater}</span>
                        </div>
                        <div className="as-timeLine">
                          <span className="as-timeLineIcon">🎬</span>
                          <span>{s.screen}</span>
                        </div>
                        <div className="as-timeLine as-timeSeats">
                          <span className="as-timeLineIcon">💺</span>
                          <span>{seatsLeft} seats left</span>
                        </div>
                      </div>

                      <div className="as-timeBtns">
                        <button className="as-timeEdit" onClick={() => onEditRow(s.id)}>
                          Edit
                        </button>
                        <button className="as-timeDel" onClick={() => onDeleteRow(s.id)}>
                          🗑
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      });
    })()}
  </section>
)}


        {/* Statistics */}
        <section className="as-statsCard">
          <h3 className="as-statsTitle">Showtime Statistics</h3>

          <div className="as-statsGrid">
            <div className="as-stat blue">
              <div className="as-statLabel">Total Shows</div>
              <div className="as-statValue">{stats.totalShows}</div>
            </div>

            <div className="as-stat green">
              <div className="as-statLabel">Total Seats</div>
              <div className="as-statValue">{stats.totalSeats.toLocaleString()}</div>
            </div>

            <div className="as-stat purple">
              <div className="as-statLabel">Booked Seats</div>
              <div className="as-statValue">{stats.bookedSeats.toLocaleString()}</div>
            </div>

            <div className="as-stat orange">
              <div className="as-statLabel">Occupancy Rate</div>
              <div className="as-statValue">{stats.occupancy.toFixed(1)}%</div>
            </div>
          </div>
        </section>

        {/* Footer (optional) */}
        <footer className="as-footer">© 2025 Cinema Listic. All rights reserved.</footer>
      </main>
    </div>
  );
}
