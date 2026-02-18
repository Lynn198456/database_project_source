import { useEffect, useMemo, useState } from "react";
import { listShowtimes } from "../../api/showtimes";

function toISODate(d) {
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function mapShowtimeRow(s) {
  const start = new Date(s.start_time);
  return {
    id: s.id,
    date: toISODate(start),
    movie: s.movie_title || "-",
    screen: s.screen_name || "-",
    theater: s.theater_name || "-",
    time: start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
    seats: Number(s.screen_total_seats || 0)
  };
}

export default function TodaysShowtimes() {
  const [rows, setRows] = useState([]);
  const [title, setTitle] = useState("Today's Showtimes");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadShowtimes() {
      try {
        setError("");
        const all = await listShowtimes({ limit: 200 });
        if (!mounted) return;

        const today = toISODate(new Date());
        const mapped = all.map(mapShowtimeRow);
        const todaysRows = mapped.filter((s) => s.date === today);

        if (todaysRows.length > 0) {
          setTitle("Today's Showtimes");
          setRows(todaysRows);
          return;
        }

        const nextDate = [...new Set(mapped.map((s) => s.date))].sort((a, b) => a.localeCompare(b))[0];
        const upcomingRows = nextDate ? mapped.filter((s) => s.date === nextDate) : [];
        setTitle(nextDate ? `Next Showtimes (${nextDate})` : "Today's Showtimes");
        setRows(upcomingRows);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load today's showtimes.");
        }
      }
    }

    loadShowtimes();
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const item of rows) {
      const key = `${item.movie}-${item.screen}-${item.theater}`;
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          movie: item.movie,
          screen: `${item.screen} • ${item.theater}`,
          times: []
        });
      }
      map.get(key).times.push({ time: item.time, seats: item.seats });
    }

    return Array.from(map.values()).map((g) => ({
      ...g,
      times: g.times.sort((a, b) => a.time.localeCompare(b.time))
    }));
  }, [rows]);

  return (
    <section className="cf-section">
      <div className="cf-section__head">
        <div className="cf-section__title">
          <span className="cf-section__icon cf-icon--purple">📈</span>
          {title}
        </div>
      </div>

      {error ? <div className="cf-empty">{error}</div> : null}

      <div className="cf-showtimeList">
        {grouped.map((s) => (
          <div key={s.id} className="cf-showtimeRow">
            <div className="cf-showtimeRow__left">
              <div className="cf-miniIcon cf-miniIcon--purple">🎬</div>
              <div>
                <div className="cf-showtimeRow__movie">{s.movie}</div>
                <div className="cf-showtimeRow__screen">📍 {s.screen}</div>
              </div>
            </div>

            <div className="cf-showtimeRow__times">
              {s.times.map((t, idx) => (
                <button key={`${s.id}-${idx}`} className="cf-timeChip" type="button">
                  <div className="cf-timeChip__time">{t.time}</div>
                  <div className="cf-timeChip__seats">{t.seats} seats</div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && !error ? <div className="cf-empty">No showtimes for today.</div> : null}
      </div>
    </section>
  );
}
