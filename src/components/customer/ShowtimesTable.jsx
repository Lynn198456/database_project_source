import { useMemo, useState } from "react";

const DATA = [
  {
    id: 1,
    movie: "The Last Adventure",
    screen: "Screen 1 - IMAX",
    theater: "Downtown",
    date: "Nov 23, 2024",
    time: "10:00 AM",
    seats: "45/120",
    price: 15.0,
    status: "Available",
  },
  {
    id: 2,
    movie: "The Last Adventure",
    screen: "Screen 2 - Standard",
    theater: "Downtown",
    date: "Nov 23, 2024",
    time: "01:15 PM",
    seats: "102/150",
    price: 12.0,
    status: "Filling Fast",
  },
  {
    id: 3,
    movie: "Hearts Entwined",
    screen: "Screen 3 - Premium",
    theater: "Downtown",
    date: "Nov 23, 2024",
    time: "02:00 PM",
    seats: "12/100",
    price: 18.0,
    status: "Available",
  },
  {
    id: 4,
    movie: "Laugh Out Loud",
    screen: "Screen 1 - IMAX",
    theater: "Mall Location",
    date: "Nov 23, 2024",
    time: "03:30 PM",
    seats: "67/120",
    price: 15.0,
    status: "Available",
  },
  {
    id: 5,
    movie: "Midnight Shadows",
    screen: "Screen 2 - Standard",
    theater: "Downtown",
    date: "Nov 23, 2024",
    time: "05:00 PM",
    seats: "150/150",
    price: 12.0,
    status: "Sold Out",
  },
  {
    id: 6,
    movie: "The Last Adventure",
    screen: "Screen 1 - IMAX",
    theater: "Downtown",
    date: "Nov 23, 2024",
    time: "07:45 PM",
    seats: "89/120",
    price: 15.0,
    status: "Available",
  },
];


function pillClass(status) {
  switch (status) {
    case "Available":
      return "cf-stPill--available";
    case "Filling Fast":
      return "cf-stPill--filling";
    case "Sold Out":
      return "cf-stPill--soldout";
    default:
      return "";
  }
}

export default function ShowtimesTable() {
  const [view, setView] = useState("table"); // table | calendar | timeline
  const [q, setQ] = useState("");
  const [movie, setMovie] = useState("All");
  const [theater, setTheater] = useState("All");
  const [screenType, setScreenType] = useState("All");
  const [timeRange, setTimeRange] = useState("All");
  const [date, setDate] = useState("");

  const movies = useMemo(() => ["All", ...new Set(DATA.map((d) => d.movie))], []);
  const theaters = useMemo(() => ["All", ...new Set(DATA.map((d) => d.theater))], []);
  const screens = useMemo(() => ["All", "IMAX", "Standard", "Premium"], []);

  const filtered = useMemo(() => {
    return DATA.filter((d) => {
      const matchQ =
        (d.movie + d.screen + d.theater).toLowerCase().includes(q.toLowerCase());

      const matchMovie = movie === "All" ? true : d.movie === movie;
      const matchTheater = theater === "All" ? true : d.theater === theater;

      const matchScreen =
        screenType === "All" ? true : d.screen.toLowerCase().includes(screenType.toLowerCase());

      const matchTime =
        timeRange === "All"
          ? true
          : timeRange === "Morning"
          ? d.time.includes("AM")
          : timeRange === "Afternoon"
          ? d.time.includes("PM") && !d.time.startsWith("07") && !d.time.startsWith("08")
          : timeRange === "Evening"
          ? d.time.includes("PM") && (d.time.startsWith("07") || d.time.startsWith("08"))
          : true;

      const matchDate = date ? d.date.toLowerCase().includes(date.toLowerCase()) : true;

      return matchQ && matchMovie && matchTheater && matchScreen && matchTime && matchDate;
    });
  }, [q, movie, theater, screenType, timeRange, date]);

  // Summary cards

  return (
    <div className="cf-st">
      {/* Filters */}
      <div className="cf-stFilters">
        <div className="cf-stFilter">
          <span className="cf-stIcon">📅</span>
          <input
            className="cf-stInput"
            placeholder="Select Date (e.g., Nov 23, 2024)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="cf-stFilter">
          <span className="cf-stIcon">🔎</span>
          <input
            className="cf-stInput"
            placeholder="Search by title, genre, or actor..."
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

        <select
          className="cf-stSelect"
          value={theater}
          onChange={(e) => setTheater(e.target.value)}
        >
          {theaters.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "All Theaters" : t}
            </option>
          ))}
        </select>

        <select
          className="cf-stSelect"
          value={screenType}
          onChange={(e) => setScreenType(e.target.value)}
        >
          {screens.map((s) => (
            <option key={s} value={s}>
              {s === "All" ? "All Screen Type" : s}
            </option>
          ))}
        </select>

        <select
          className="cf-stSelect"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="All">All Time Range</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </select>
      </div>

      {/* View buttons */}
      <div className="cf-stViews">
        <button
          className={`cf-stViewBtn ${view === "table" ? "is-active" : ""}`}
          onClick={() => setView("table")}
          type="button"
        >
          Table View
        </button>

        <button
          className={`cf-stViewBtn ${view === "calendar" ? "is-active" : ""}`}
          onClick={() => setView("calendar")}
          type="button"
        >
          Calendar View
        </button>

        <button
          className={`cf-stViewBtn ${view === "timeline" ? "is-active" : ""}`}
          onClick={() => setView("timeline")}
          type="button"
        >
          Timeline View
        </button>
      </div>

      {/* Table / Placeholder views */}
      {view !== "table" ? (
        <div className="cf-stPlaceholder">
          <div className="cf-stPlaceholderTitle">
            {view === "calendar" ? "Calendar View" : "Timeline View"}
          </div>
          <div className="cf-stPlaceholderText">
            We’ll build this next. For now, use Table View ✅
          </div>
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
                <th style={{ textAlign: "right" }}>Action</th>
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
                  <td>
                    <span className={`cf-stPill ${pillClass(d.status)}`}>{d.status}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {d.status === "Sold Out" ? (
                      <button className="cf-stActionBtn" disabled type="button">
                        Sold Out
                      </button>
                    ) : (
                      <button className="cf-stActionBtn" type="button">
                        Book
                      </button>
                    )}
                  </td>
                </tr>
                        ))}
                    </tbody>
                    </table>
                  </div>
                )}
            </div>
          );
        }
