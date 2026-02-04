import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin/adminMovieEdit.css";

export default function AdminMovieEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const defaultMovie = useMemo(
    () => ({
      title: "",
      genre: "",
      duration: "",
      rating: "PG",
      status: "ACTIVE",
      releaseDate: "",
      posterUrl: ""
    }),
    []
  );

  const [form, setForm] = useState(defaultMovie);
  const [saving, setSaving] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      alert(`Saved movie ${id}`);
      navigate("/admin/movies");
    }, 400);
  }

  function handleClear() {
    setForm(defaultMovie);
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
            <h1>Edit Movie</h1>
            <p>Movie ID: {id}</p>
          </div>
          <button className="ame-secondary" onClick={() => navigate("/admin/movies")}>Back</button>
        </header>

        <form className="ame-card" onSubmit={handleSubmit}>
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
              Genre
              <input
                value={form.genre}
                onChange={(e) => updateField("genre", e.target.value)}
                placeholder="Action, Drama"
              />
            </label>

            <label>
              Duration
              <input
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                placeholder="2h 10m"
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
              Status
              <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                <option value="ACTIVE">Active</option>
                <option value="COMING_SOON">Coming Soon</option>
                <option value="INACTIVE">Inactive</option>
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
          </div>

          <div className="ame-actions">
            <button className="ame-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
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
        </form>
      </div>
    </div>
  );
}
