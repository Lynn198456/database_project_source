import "../styles/customer.css";
import "../styles/showtimes.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import { listShowtimes } from "../api/showtimes";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatDateLabel(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatTimeLabel(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function getMonthGrid(year, monthIndex0) {
  const first = new Date(year, monthIndex0, 1);
  const last = new Date(year, monthIndex0 + 1, 0);
  const startDay = first.getDay();
  const daysInMonth = last.getDate();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(new Date(year, monthIndex0, day));
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function mapShowtime(s) {
  const start = new Date(s.start_time);
  return {
    id: s.id,
    movieTitle: s.movie_title || "-",
    date: toISODate(start),
    time: `${pad2(start.getHours())}:${pad2(start.getMinutes())}`,
    type: s.format || "2D",
    price: Number(s.price || 0),
    theater: s.theater_name || "-",
    screen: s.screen_name || "-",
    seats: Number(s.screen_total_seats || 0)
  };
}

export default function ShowtimesPage() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState("CALENDAR");
  const [monthCursor, setMonthCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toISODate(today));
  const [showtimes, setShowtimes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadShowtimes() {
      try {
        setError("");
        const rows = await listShowtimes({ limit: 200 });
        if (!mounted) return;
        setShowtimes(rows.map(mapShowtime));
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load showtimes.");
        }
      }
    }

    loadShowtimes();
    return () => {
      mounted = false;
    };
  }, []);

  const monthLabel = useMemo(
    () => monthCursor.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    [monthCursor]
  );

  const showtimesByDate = useMemo(() => {
    const map = {};
    for (const s of showtimes) {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    }
    Object.keys(map).forEach((k) => map[k].sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [showtimes]);

  const calendarWeeks = useMemo(
    () => getMonthGrid(monthCursor.getFullYear(), monthCursor.getMonth()),
    [monthCursor]
  );

  const filteredDayShows = useMemo(
    () => showtimesByDate[selectedDate] || [],
    [showtimesByDate, selectedDate]
  );

  const timelineDates = useMemo(
    () => Object.keys(showtimesByDate).sort((a, b) => a.localeCompare(b)),
    [showtimesByDate]
  );

  useEffect(() => {
    if (showtimes.length === 0) return;
    if (showtimesByDate[selectedDate]?.length) return;
    const firstDate = timelineDates[0];
    if (firstDate) {
      setSelectedDate(firstDate);
      const firstDay = new Date(firstDate + "T00:00:00");
      setMonthCursor(new Date(firstDay.getFullYear(), firstDay.getMonth(), 1));
    }
  }, [selectedDate, showtimes.length, showtimesByDate, timelineDates]);

  const dayHasShows = (iso) => (showtimesByDate[iso]?.length || 0) > 0;

  function prevMonth() {
    setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setMonthCursor((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function onBookShowtime(s) {
    const draft = {
      movieTitle: s.movieTitle,
      dateLabel: formatDateLabel(s.date),
      date: s.date,
      time: formatTimeLabel(s.time),
      rawTime: s.time,
      type: s.type,
      price: s.price,
      location: s.theater,
      screen: s.screen,
      seatsAvailable: s.seats
    };
    localStorage.setItem("cinemaFlow_booking", JSON.stringify(draft));
    navigate("/customer/book");
  }

  return (
    <div className="cf-page">
      <Navbar />

      <main className="cf-mainFull">
        <div className="cf-containerWide">
          <div className="st-head">
            <div>
              <div className="st-title">
                <span className="st-titleIcon">🗓️</span> Showtimes
              </div>
              <div className="st-subtitle">Live from PostgreSQL schedules database</div>
            </div>

            <div className="st-toggle">
              <button
                className={`st-pillBtn ${view === "CALENDAR" ? "st-pillBtn--active" : ""}`}
                onClick={() => setView("CALENDAR")}
                type="button"
              >
                Calendar View
              </button>
              <button
                className={`st-pillBtn ${view === "TIMELINE" ? "st-pillBtn--active" : ""}`}
                onClick={() => setView("TIMELINE")}
                type="button"
              >
                Timeline View
              </button>
            </div>
          </div>

          {error ? <div className="cf-empty">{error}</div> : null}

          <div className="st-layout">
            <div className="st-panel">
              {view === "CALENDAR" ? (
                <>
                  <div className="st-calHead">
                    <button className="st-iconBtn" onClick={prevMonth} type="button" aria-label="Previous month">
                      ‹
                    </button>
                    <div className="st-calTitle">{monthLabel}</div>
                    <button className="st-iconBtn" onClick={nextMonth} type="button" aria-label="Next month">
                      ›
                    </button>
                  </div>

                  <div className="st-weekdays">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                      <div key={d} className="st-weekday">
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="st-calGrid">
                    {calendarWeeks.map((week, wi) => (
                      <div key={wi} className="st-weekRow">
                        {week.map((cell, ci) => {
                          if (!cell) return <div key={ci} className="st-day st-day--blank" />;

                          const iso = toISODate(cell);
                          const isSelected = iso === selectedDate;
                          const has = dayHasShows(iso);

                          return (
                            <button
                              key={ci}
                              className={`st-day ${isSelected ? "st-day--selected" : ""} ${has ? "st-day--has" : ""}`}
                              onClick={() => setSelectedDate(iso)}
                              type="button"
                            >
                              <div className="st-dayNum">{cell.getDate()}</div>
                              {has && <div className="st-dot" />}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  <div className="st-hint">
                    <span className="st-dotLegend" /> Days with showtimes
                  </div>
                </>
              ) : (
                <div className="st-timelineHint">
                  <div className="st-panelTitle">Upcoming Dates</div>
                  <div className="st-miniList">
                    {timelineDates.map((d) => (
                      <button
                        key={d}
                        className={`st-miniDate ${d === selectedDate ? "st-miniDate--active" : ""}`}
                        onClick={() => setSelectedDate(d)}
                        type="button"
                      >
                        {formatDateLabel(d)}
                        <span className="st-miniCount">{showtimesByDate[d].length}</span>
                      </button>
                    ))}
                    {timelineDates.length === 0 && <div className="cf-empty">No showtimes.</div>}
                  </div>
                </div>
              )}
            </div>

            <div className="st-results">
              {view === "CALENDAR" ? (
                <>
                  <div className="st-resultsHead">
                    <div className="st-resultsTitle">
                      Showtimes for <span className="st-accent">{formatDateLabel(selectedDate)}</span>
                    </div>
                  </div>

                  {filteredDayShows.length === 0 ? (
                    <div className="st-emptyCard">No showtimes for this day. Try another date.</div>
                  ) : (
                    <div className="st-cards">
                      {filteredDayShows.map((s) => (
                        <ShowCard key={s.id} s={s} onBook={() => onBookShowtime(s)} />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="st-timeline">
                  {timelineDates.map((date) => (
                    <div key={date} className="st-group">
                      <div className="st-groupTitle">{formatDateLabel(date)}</div>
                      <div className="st-cards">
                        {showtimesByDate[date].map((s) => (
                          <ShowCard key={s.id} s={s} onBook={() => onBookShowtime(s)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ShowCard({ s, onBook }) {
  return (
    <div className="st-card">
      <div className="st-left">
        <div className="st-time">{formatTimeLabel(s.time)}</div>
        <div className="st-badges">
          <span className="st-badge st-badge--purple">{s.type}</span>
          <span className="st-badge st-badge--gold">฿{s.price.toFixed(2)}</span>
        </div>
      </div>

      <div className="st-mid">
        <div className="st-movie">{s.movieTitle}</div>
        <div className="st-meta">📍 {s.theater} • 🎟 {s.screen}</div>
        <div className="st-meta">
          <span className="st-seats">{s.seats} seats available</span>
        </div>
      </div>

      <div className="st-right">
        <button className="st-book" onClick={onBook} type="button">
          Book
        </button>
      </div>
    </div>
  );
}
