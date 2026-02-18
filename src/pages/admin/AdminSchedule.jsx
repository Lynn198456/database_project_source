import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { listMovies } from "../../api/movies";
import { listScreens } from "../../api/screens";
import { createShowtime, deleteShowtime, listShowtimes } from "../../api/showtimes";
import "../../styles/admin/adminSchedule.css";

function toISODate(d) {
  const pad = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toDateTimeLocalParts(isoTs) {
  const d = new Date(isoTs);
  const pad = (x) => String(x).padStart(2, "0");
  return {
    date: toISODate(d),
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`
  };
}

export default function AdminSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNewMode = id === "new";
  const routeMovieId = Number.parseInt(id || "", 10);

  const [movieIdInput, setMovieIdInput] = useState(isNewMode ? "" : String(routeMovieId));
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationMin, setDurationMin] = useState("120");
  const [screenId, setScreenId] = useState("");
  const [price, setPrice] = useState("200");
  const [language, setLanguage] = useState("English");
  const [format, setFormat] = useState("2D");
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [catalogError, setCatalogError] = useState("");

  const effectiveMovieId = isNewMode ? Number.parseInt(movieIdInput || "", 10) : routeMovieId;
  const canAdd = useMemo(
    () =>
      Number.isInteger(effectiveMovieId) &&
      effectiveMovieId > 0 &&
      date &&
      time &&
      Number.parseInt(screenId, 10) > 0 &&
      Number.parseFloat(price) >= 0 &&
      Number.parseInt(durationMin, 10) > 0,
    [date, durationMin, effectiveMovieId, price, screenId, time]
  );

  useEffect(() => {
    let mounted = true;

    async function loadCatalog() {
      try {
        setLoadingCatalog(true);
        setCatalogError("");
        const [movieRows, screenRows] = await Promise.all([
          listMovies({ limit: 200 }),
          listScreens({ limit: 200 })
        ]);
        if (!mounted) return;
        setMovies(movieRows);
        setScreens(screenRows);
        if (!isNewMode && Number.isInteger(routeMovieId) && routeMovieId > 0) {
          setMovieIdInput(String(routeMovieId));
        } else if (isNewMode && !movieIdInput && movieRows.length > 0) {
          setMovieIdInput(String(movieRows[0].id));
        }
      } catch (err) {
        if (mounted) {
          setCatalogError(err.message || "Failed to load movies/screens.");
        }
      } finally {
        if (mounted) {
          setLoadingCatalog(false);
        }
      }
    }

    loadCatalog();
    return () => {
      mounted = false;
    };
  }, [isNewMode, routeMovieId]);

  useEffect(() => {
    let mounted = true;

    async function loadShowtimes() {
      try {
        setLoading(true);
        setError("");
        const rows = await listShowtimes({
          limit: 200,
          movieId: Number.isInteger(routeMovieId) && routeMovieId > 0 ? routeMovieId : undefined
        });
        if (!mounted) return;
        setShowtimes(rows);
      } catch (err) {
        if (mounted) {
          setError(err.message || "Failed to load showtimes.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadShowtimes();
    return () => {
      mounted = false;
    };
  }, [routeMovieId]);

  async function addShowtime(e) {
    e.preventDefault();
    if (!canAdd) return;

    const start = new Date(`${date}T${time}:00`);
    const end = new Date(start.getTime() + Number.parseInt(durationMin, 10) * 60 * 1000);

    try {
      const payload = {
        movieId: effectiveMovieId,
        screenId: Number.parseInt(screenId, 10),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        price: Number.parseFloat(price),
        language,
        format
      };

      await createShowtime(payload);
      const rows = await listShowtimes({
        limit: 200,
        movieId: Number.isInteger(routeMovieId) && routeMovieId > 0 ? routeMovieId : undefined
      });
      setShowtimes(rows);
      setDate("");
      setTime("");
      setScreenId("");
    } catch (err) {
      window.alert(err.message || "Failed to add showtime.");
    }
  }

  async function removeShowtime(showId) {
    const ok = window.confirm("Remove this showtime?");
    if (!ok) return;

    try {
      await deleteShowtime(showId);
      setShowtimes((prev) => prev.filter((s) => s.id !== showId));
    } catch (err) {
      window.alert(err.message || "Failed to remove showtime.");
    }
  }

  const selectedMovie = useMemo(
    () => movies.find((m) => Number(m.id) === effectiveMovieId) || null,
    [effectiveMovieId, movies]
  );

  return (
    <div className="as-page">
      <AdminNavbar />

      <div className="as-container">
        <header className="as-header">
          <div>
            <h1>Schedule Showtimes</h1>
            <p>
              {isNewMode
                ? "New schedule from schedules_setup database tables"
                : selectedMovie
                ? `Movie: ${selectedMovie.title}`
                : `Movie ID: ${routeMovieId}`}
            </p>
          </div>
          <button className="as-secondary" onClick={() => navigate("/admin/showtimes")}>
            Back
          </button>
        </header>

        {catalogError ? <div className="as-empty">{catalogError}</div> : null}

        <form className="as-card" onSubmit={addShowtime}>
          <h2>Add Showtime</h2>
          <div className="as-grid">
            {isNewMode || !selectedMovie ? (
              <label>
                Movie
                <select
                  value={movieIdInput}
                  onChange={(e) => setMovieIdInput(e.target.value)}
                  disabled={loadingCatalog}
                >
                  {movies.length === 0 ? (
                    <option value="">No movies found</option>
                  ) : null}
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label>
                Movie
                <input value={selectedMovie.title} disabled />
              </label>
            )}

            <label>
              Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
              Time
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </label>
            <label>
              Duration (min)
              <input
                type="number"
                min="1"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
              />
            </label>
            <label>
              Screen
              <select
                value={screenId}
                onChange={(e) => setScreenId(e.target.value)}
                disabled={loadingCatalog}
              >
                <option value="">Select screen</option>
                {screens.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.theater_name} - {s.name} ({s.total_seats} seats)
                  </option>
                ))}
              </select>
            </label>
            <label>
              Price
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </label>
            <label>
              Language
              <input value={language} onChange={(e) => setLanguage(e.target.value)} />
            </label>
            <label>
              Format
              <input value={format} onChange={(e) => setFormat(e.target.value)} />
            </label>
          </div>
          <div className="as-actions">
            <button className="as-primary" type="submit" disabled={!canAdd || loadingCatalog}>
              Add Showtime
            </button>
          </div>
        </form>

        <section className="as-card">
          <h2>Scheduled Showtimes</h2>
          {error ? <div className="as-empty">{error}</div> : null}
          {loading ? (
            <div className="as-empty">Loading showtimes...</div>
          ) : showtimes.length === 0 ? (
            <div className="as-empty">No showtimes yet.</div>
          ) : (
            <div className="as-table">
              <div className="as-row as-rowHead">
                <div>Date</div>
                <div>Time</div>
                <div>Screen</div>
                <div>Action</div>
              </div>
              {showtimes.map((s) => {
                const parts = toDateTimeLocalParts(s.start_time);
                return (
                  <div key={s.id} className="as-row">
                    <div>{parts.date}</div>
                    <div>{parts.time}</div>
                    <div>{s.screen_name || s.screen_id}</div>
                    <div>
                      <button className="as-link" onClick={() => removeShowtime(s.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
