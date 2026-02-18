import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/AdminNavbar";
import { createScreen } from "../../api/screens";
import { createTheater } from "../../api/theaters";
import "../../styles/admin/adminNewTheater.css";

function makeScreenRow(index) {
  return {
    id: Date.now() + index,
    name: `Screen ${index + 1}`,
    totalSeats: "120"
  };
}

export default function AdminNewTheater() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [screens, setScreens] = useState([makeScreenRow(0)]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const canSave = useMemo(() => {
    if (!name.trim() || !city.trim()) return false;
    const validScreens = screens.filter((s) => s.name.trim() && Number.parseInt(s.totalSeats, 10) > 0);
    return validScreens.length > 0;
  }, [city, name, screens]);

  function addScreenRow() {
    setScreens((prev) => [...prev, makeScreenRow(prev.length)]);
  }

  function removeScreenRow(id) {
    setScreens((prev) => prev.filter((s) => s.id !== id));
  }

  function patchScreen(id, field, value) {
    setScreens((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!canSave || saving) return;

    const validScreens = screens
      .map((s) => ({ name: s.name.trim(), totalSeats: Number.parseInt(s.totalSeats, 10) }))
      .filter((s) => s.name && s.totalSeats > 0);

    try {
      setSaving(true);
      setError("");

      const theaterId = await createTheater({
        name: name.trim(),
        city: city.trim(),
        location: location.trim(),
        address: address.trim()
      });

      await Promise.all(
        validScreens.map((s) =>
          createScreen({
            theaterId,
            name: s.name,
            totalSeats: s.totalSeats
          })
        )
      );

      navigate("/admin/theaters");
    } catch (err) {
      setError(err.message || "Failed to create theater.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ant-page">
      <AdminNavbar />
      <main className="ant-container">
        <header className="ant-header">
          <div>
            <h1>Create New Theater</h1>
            <p>Add theater details and screens in one step</p>
          </div>
          <button className="ant-back" type="button" onClick={() => navigate("/admin/theaters")}>
            Back
          </button>
        </header>

        <form className="ant-card" onSubmit={onSubmit}>
          <h2>Theater Info</h2>
          <div className="ant-grid">
            <label>
              Theater Name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cinema Listic Central" />
            </label>
            <label>
              City
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bangkok" />
            </label>
            <label>
              Location
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Downtown" />
            </label>
            <label>
              Address
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" />
            </label>
          </div>

          <div className="ant-screenHead">
            <h2>Screens</h2>
            <button className="ant-addScreen" type="button" onClick={addScreenRow}>
              + Add Screen
            </button>
          </div>

          <div className="ant-screenList">
            {screens.map((s, idx) => (
              <div key={s.id} className="ant-screenRow">
                <input
                  value={s.name}
                  onChange={(e) => patchScreen(s.id, "name", e.target.value)}
                  placeholder={`Screen ${idx + 1}`}
                />
                <input
                  type="number"
                  min="1"
                  value={s.totalSeats}
                  onChange={(e) => patchScreen(s.id, "totalSeats", e.target.value)}
                  placeholder="Seats"
                />
                <button
                  type="button"
                  className="ant-remove"
                  onClick={() => removeScreenRow(s.id)}
                  disabled={screens.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {error ? <div className="ant-error">{error}</div> : null}

          <div className="ant-actions">
            <button className="ant-save" type="submit" disabled={!canSave || saving}>
              {saving ? "Saving..." : "Create Theater"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
