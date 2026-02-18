import { useEffect, useMemo, useState } from "react";
import { listShowtimes } from "../../api/showtimes";

function mapRow(s) {
  const start = new Date(s.start_time);
  return {
    id: s.id,
    movie: s.movie_title || "-",
    screen: s.screen_name || "-",
    theater: s.theater_name || "-",
    date: start.toLocaleDateString(),
    time: start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    seats: `0/${Number(s.screen_total_seats || 0)}`,
    price: Number(s.price || 0),
    status: "Available"
  };
}

export default function ShowtimesTable() {
  const [view, setView] = useState("table");
  const [q, setQ] = useState("");
  const [movie, setMovie] = useState("All");
  const [theater, setTheater] = useState("All");
  const [screenType, setScreenType] = useState("All");
  const [timeRange, setTimeRange] = useState("All");
  const [date, setDate] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setError("");
        const data = await listShowtimes({ limit: 200 });
        if (!mounted) return;
        setRows(data.map(mapRow));
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load showtimes.");
        }
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const movies = useMemo(() => ["All", ...new Set(rows.map((d) => d.movie))], [rows]);
  const theaters = useMemo(() => ["All", ...new Set(rows.map((d) => d.theater))], [rows]);
  const screens = useMemo(() => ["All", "IMAX", "Standard", "Premium", "Dolby"], []);

  const filtered = useMemo(() => {
    return rows.filter((d) => {
      const matchQ = (d.movie + d.screen + d.theater).toLowerCase().includes(q.toLowerCase());
      const matchMovie = movie === "All" || d.movie === movie;
      const matchTheater = theater === "All" || d.theater === theater;
      const matchScreen =
        screenType === "All" ? true : d.screen.toLowerCase().includes(screenType.toLowerCase());
      const matchTime =
        timeRange === "All"
          ? true
          : timeRange === "Morning"
          ? d.time.toLowerCase().includes("am")
          : timeRange === "Afternoon"
          ? d.time.toLowerCase().includes("pm")
          : true;
      const matchDate = date ? d.date.toLowerCase().includes(date.toLowerCase()) : true;
      return matchQ && matchMovie && matchTheater && matchScreen && matchTime && matchDate;
    });
  }, [date, movie, q, rows, screenType, theater, timeRange]);

  return (
    <div className="cf-st">
      {error ? <div className="cf-empty">{error}</div> : null}
      <div className="cf-stFilters">
        <div className="cf-stFilter">
          <span className="cf-stIcon">📅</span>
          <input
            className="cf-stInput"
            placeholder="Select Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="cf-stFilter">
          <span className="cf-stIcon">🔎</span>
          <input
            className="cf-stInput"
            placeholder="Search by title"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <select className="cf-stSelect" value={movie} onChange={(e) => setMovie(e.target.value)}>
          {movies.map((m) => (
            <option key={m} value={m}>
              {m === "All" ? "All Movies" : m}
            </option>
          ))}
        </select>

        <select className="cf-stSelect" value={theater} onChange={(e) => setTheater(e.target.value)}>
          {theaters.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "All Theaters" : t}
            </option>
          ))}
        </select>

        <select className="cf-stSelect" value={screenType} onChange={(e) => setScreenType(e.target.value)}>
          {screens.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Screen Type" : s}
            </option>
          ))}
        </select>

        <select className="cf-stSelect" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="All">All Time Range</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
        </select>
      </div>

      <div className="cf-stViews">
        <button className={`cf-stViewBtn ${view === "table" ? "is-active" : ""}`} onClick={() => setView("table")} type="button">
          Table View
        </button>
        <button className={`cf-stViewBtn ${view === "calendar" ? "is-active" : ""}`} onClick={() => setView("calendar")} type="button">
          Calendar View
        </button>
        <button className={`cf-stViewBtn ${view === "timeline" ? "is-active" : ""}`} onClick={() => setView("timeline")} type="button">
          Timeline View
        </button>
      </div>

      {view !== "table" ? (
        <div className="cf-stPlaceholder">
          <div className="cf-stPlaceholderTitle">
            {view === "calendar" ? "Calendar View" : "Timeline View"}
          </div>
          <div className="cf-stPlaceholderText">Use Table View for live showtimes.</div>
        </div>
      ) : (
        <div className="cf-stTableWrap">
          <table className="cf-stTable">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Screen</th>
                <th>Theater</th>
                <th>Date</th>
                <th>Time</th>
                <th>Seats</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td className="cf-stMovie">{d.movie}</td>
                  <td>{d.screen}</td>
                  <td>{d.theater}</td>
                  <td>{d.date}</td>
                  <td>{d.time}</td>
                  <td>{d.seats}</td>
                  <td>฿{d.price.toFixed(2)}</td>
                  <td>{d.status}</td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="cf-empty">
                    No showtimes found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
