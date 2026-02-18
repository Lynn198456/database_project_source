import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { createMovie, getMovie, updateMovie } from "../../api/movies";
import "../../styles/admin/adminMovieEdit.css";

const STATUS_OPTIONS = [
  { label: "Now Showing", value: "NOW_SHOWING" },
  { label: "Coming Soon", value: "COMING_SOON" },
  { label: "Archived", value: "ARCHIVED" }
];

export default function AdminMovieEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === "new";

  const defaultMovie = useMemo(
    () => ({
      title: "",
      description: "",
      durationMin: "",
      rating: "PG",
      status: "COMING_SOON",
      releaseDate: "",
      posterUrl: ""
    }),
    []
  );

  const [form, setForm] = useState(defaultMovie);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadMovie() {
      if (isNew) return;

      try {
        setLoading(true);
        setError("");
        const movie = await getMovie(id);

        if (!mounted) return;

        setForm({
          title: movie.title || "",
          description: movie.description || "",
          durationMin: movie.duration_min ? String(movie.duration_min) : "",
          rating: movie.rating || "PG",
          status: movie.status || "COMING_SOON",
          releaseDate: movie.release_date ? String(movie.release_date).slice(0, 10) : "",
          posterUrl: movie.poster_url || ""
        });
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load movie.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadMovie();

    return () => {
      mounted = false;
    };
  }, [id, isNew]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const durationMin = Number.parseInt(form.durationMin, 10);
    if (Number.isNaN(durationMin) || durationMin <= 0) {
      setError("Duration must be greater than 0 minutes.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title,
        description: form.description,
        durationMin,
        rating: form.rating,
        status: form.status,
        releaseDate: form.releaseDate || null,
        posterUrl: form.posterUrl
      };

      if (isNew) {
        await createMovie(payload);
      } else {
        await updateMovie(id, payload);
      }

      navigate("/admin/movies");
    } catch (err) {
      setError(err.message || "Failed to save movie.");
    } finally {
      setSaving(false);
    }
  }

  function handleClear() {
    setForm(defaultMovie);
    setError("");
  }

  function handleManage() {
    navigate("/admin/movies");
  }

  return (
    <div className="ame-page">
      <AdminNavbar />

      <div className="ame-container">
        <header className="ame-header">
          <div>
            <h1>{isNew ? "Add Movie" : "Edit Movie"}</h1>
            <p>{isNew ? "Create a movie in PostgreSQL (movies table)." : `Movie ID: ${id}`}</p>
          </div>
          <button className="ame-secondary" onClick={() => navigate("/admin/movies")}>Back</button>
        </header>

        <form className="ame-card" onSubmit={handleSubmit}>
          {loading ? (
            <div className="ame-note">Loading movie...</div>
          ) : (
            <>
              {error && <div className="ame-error">{error}</div>}

              <div className="ame-grid">
                <label>
                  Title
                  <input
                    value={form.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    placeholder="Movie title"
                    required
                  />
                </label>

                <label>
                  Rating
                  <select value={form.rating} onChange={(e) => updateField("rating", e.target.value)}>
                    <option value="G">G</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13</option>
                    <option value="R">R</option>
                  </select>
                </label>

                <label>
                  Duration (minutes)
                  <input
                    type="number"
                    min="1"
                    value={form.durationMin}
                    onChange={(e) => updateField("durationMin", e.target.value)}
                    placeholder="120"
                    required
                  />
                </label>

                <label>
                  Status
                  <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Release Date
                  <input
                    type="date"
                    value={form.releaseDate}
                    onChange={(e) => updateField("releaseDate", e.target.value)}
                  />
                </label>

                <label className="ame-span">
                  Poster URL
                  <input
                    value={form.posterUrl}
                    onChange={(e) => updateField("posterUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </label>

                <label className="ame-span">
                  Description
                  <input
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Short movie description"
                  />
                </label>
              </div>

              <div className="ame-actions">
                <button className="ame-primary" type="submit" disabled={saving}>
                  {saving ? "Saving..." : isNew ? "Add Movie" : "Save Changes"}
                </button>
                <button className="ame-secondary" type="button" onClick={handleClear}>
                  Clear
                </button>
                <button className="ame-secondary" type="button" onClick={handleManage}>
                  Manage
                </button>
                <button className="ame-secondary" type="button" onClick={() => navigate("/admin/movies")}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
