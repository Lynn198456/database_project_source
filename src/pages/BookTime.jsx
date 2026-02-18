import "../styles/customer.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listShowtimes } from "../api/showtimes";

function loadDraft() {
  try {
    const raw = localStorage.getItem("cinemaFlow_booking");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveDraft(partial) {
  const prev = loadDraft();
  localStorage.setItem("cinemaFlow_booking", JSON.stringify({ ...prev, ...partial }));
}

function toDateLabel(isoTs) {
  const d = new Date(isoTs);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function toTimeLabel(isoTs) {
  const d = new Date(isoTs);
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function mapShowtime(s) {
  return {
    id: s.id,
    movieId: s.movie_id,
    movieTitle: s.movie_title,
    theater: s.theater_name || "-",
    screen: s.screen_name || "-",
    dateLabel: toDateLabel(s.start_time),
    timeLabel: toTimeLabel(s.start_time),
    startTime: s.start_time,
    seats: Number(s.screen_total_seats || 0),
    price: Number(s.price || 0),
    type: s.format || "2D"
  };
}

export default function BookTime() {
  const navigate = useNavigate();
  const draft = loadDraft();
  const [allShowtimes, setAllShowtimes] = useState([]);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTheater, setSelectedTheater] = useState("");
  const [selectedShowId, setSelectedShowId] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadShowtimeData() {
      try {
        setError("");
        const rows = await listShowtimes({ limit: 400, movieId: draft.movieId });
        if (!mounted) return;
        const mapped = rows.map(mapShowtime);
        setAllShowtimes(mapped);

        const firstDate = [...new Set(mapped.map((s) => s.dateLabel))][0] || "";
        setSelectedDate(firstDate);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load showtimes.");
        }
      }
    }

    if (!draft.movieId) {
      setError("Please select a movie first.");
      return;
    }

    loadShowtimeData();
    return () => {
      mounted = false;
    };
  }, [draft.movieId]);

  const dates = useMemo(() => [...new Set(allShowtimes.map((s) => s.dateLabel))], [allShowtimes]);

  const theaters = useMemo(() => {
    if (!selectedDate) return [];
    return [...new Set(allShowtimes.filter((s) => s.dateLabel === selectedDate).map((s) => s.theater))];
  }, [allShowtimes, selectedDate]);

  useEffect(() => {
    if (theaters.length === 0) {
      setSelectedTheater("");
      return;
    }
    if (!theaters.includes(selectedTheater)) {
      setSelectedTheater(theaters[0]);
    }
  }, [selectedTheater, theaters]);

  const showtimes = useMemo(() => {
    return allShowtimes.filter((s) => s.dateLabel === selectedDate && s.theater === selectedTheater);
  }, [allShowtimes, selectedDate, selectedTheater]);

  useEffect(() => {
    if (!showtimes.length) {
      setSelectedShowId(null);
      return;
    }
    if (!showtimes.some((s) => Number(s.id) === Number(selectedShowId))) {
      setSelectedShowId(showtimes[0].id);
    }
  }, [selectedShowId, showtimes]);

  const selectedShow = useMemo(
    () => showtimes.find((s) => Number(s.id) === Number(selectedShowId)) || null,
    [selectedShowId, showtimes]
  );

  function goNext() {
    if (!selectedShow) return;
    saveDraft({
      showtimeId: selectedShow.id,
      movieTitle: selectedShow.movieTitle || draft.movieTitle,
      date: selectedShow.dateLabel,
      time: selectedShow.timeLabel,
      theater: selectedShow.theater,
      screen: selectedShow.screen,
      type: selectedShow.type,
      pricePerTicket: selectedShow.price
    });
    navigate("/customer/book/seats");
  }

  return (
    <div className="cf-bookPage">
      <div className="cf-bookTopbar">
        <button className="cf-bookBack" type="button" onClick={() => navigate("/customer/book")}>
          ← Back
        </button>
        <div className="cf-bookTitle">
          <span className="cf-bookIcon">🎟️</span>
          <span>Book Tickets</span>
        </div>
        <div />
      </div>

      <div className="cf-stepper">
        <div className="cf-step done"><div className="cf-stepDot">✓</div><div className="cf-stepLabel">Select Movie</div></div>
        <div className="cf-stepLine done" />
        <div className="cf-step active"><div className="cf-stepDot">🕒</div><div className="cf-stepLabel">Choose Time</div></div>
        <div className="cf-stepLine" />
        <div className="cf-step"><div className="cf-stepDot">🎫</div><div className="cf-stepLabel">Select Seats</div></div>
        <div className="cf-stepLine" />
        <div className="cf-step"><div className="cf-stepDot">💳</div><div className="cf-stepLabel">Payment</div></div>
      </div>

      <div className="cf-bookGrid">
        <div className="cf-bookLeft">
          <div className="cf-bookCard">
            <div className="cf-bookCardTitle">Select Date</div>
            <div className="cf-dateRow">
              {dates.map((d) => (
                <button key={d} type="button" className={`cf-dateChip ${d === selectedDate ? "active" : ""}`} onClick={() => setSelectedDate(d)}>
                  <div className="cf-dateDay">{d.split(",")[0]}</div>
                  <div className="cf-dateNum">{d.split(",")[1]?.trim() || d}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="cf-bookCard">
            <div className="cf-bookCardTitle">Select Theater</div>
            <div className="cf-theaterList">
              {theaters.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`cf-theaterItem ${t === selectedTheater ? "active" : ""}`}
                  onClick={() => setSelectedTheater(t)}
                >
                  <div className="cf-theaterName">📍 {t}</div>
                  <div className="cf-theaterMeta">Live from theaters table</div>
                  <div className="cf-theaterTick">{t === selectedTheater ? "✓" : ""}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="cf-bookCard">
            <div className="cf-bookCardTitle">Select Showtime</div>
            <div className="cf-showGrid">
              {showtimes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`cf-showTile ${Number(s.id) === Number(selectedShowId) ? "active" : ""}`}
                  onClick={() => setSelectedShowId(s.id)}
                >
                  <div className="cf-showTime">{s.timeLabel}</div>
                  <div className="cf-showSub">{s.screen}</div>
                  <div className="cf-showMeta">{s.seats} seats • ฿{s.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
            {!showtimes.length ? <div className="cf-empty">No showtimes for selected date/theater.</div> : null}
            {error ? <div className="cf-empty">{error}</div> : null}
          </div>
        </div>

        <aside className="cf-bookRight">
          <div className="cf-bookSummary">
            <div className="cf-bookSummaryHead">
              <span className="cf-miniIcon cf-miniIcon--orange">🎟️</span>
              Booking Summary
            </div>
            <div className="cf-summaryTitle">{draft.movieTitle || "-"}</div>
            <div className="cf-summaryMuted">{draft.genre || "-"}</div>
            <div className="cf-summaryInfo">
              <div className="cf-summaryRow"><span className="cf-summaryKey">📅 Date</span><span className="cf-summaryVal">{selectedShow?.dateLabel || "-"}</span></div>
              <div className="cf-summaryRow"><span className="cf-summaryKey">🕒 Time</span><span className="cf-summaryVal">{selectedShow?.timeLabel || "-"}</span></div>
              <div className="cf-summaryRow"><span className="cf-summaryKey">📍 Theater</span><span className="cf-summaryVal">{selectedShow?.theater || "-"}</span></div>
              <div className="cf-summaryRow"><span className="cf-summaryKey">🎬 Screen</span><span className="cf-summaryVal">{selectedShow?.screen || "-"}</span></div>
            </div>
            <button className="cf-orangeBtn" type="button" onClick={goNext} disabled={!selectedShow}>
              Continue →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
