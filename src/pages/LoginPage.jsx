import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER"); // default role
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setError("");

    // ✅ For now: simple demo validation
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    // ✅ Save login info (localStorage)
    const user = { email, role };
    localStorage.setItem("cinemaFlow_user", JSON.stringify(user));

    // ✅ Redirect by role
    if (role === "ADMIN") navigate("/admin");
    else if (role === "STAFF") navigate("/staff");
    else navigate("/customer");
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <h1 style={styles.title}>Cinema Listic</h1>
        <p style={styles.subtitle}>Login to continue</p>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
          <option value="CUSTOMER">Customer</option>
          <option value="STAFF">Staff</option>
          <option value="ADMIN">Admin</option>
        </select>

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} type="submit">
          Login
        </button>

        <p style={styles.hint}>
          (Demo) Choose a role → it will redirect to the correct page.
        </p>

        <p style={styles.hint}>
          New here?{" "}
          <button type="button" onClick={() => navigate("/register")} style={styles.linkButton}>
            Create an account
          </button>
        </p>
      </form>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#0b1220",
    color: "white",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  title: { margin: 0, fontSize: 32, letterSpacing: 0.5 },
  subtitle: { marginTop: 6, marginBottom: 18, color: "rgba(255,255,255,0.75)" },
  label: { display: "block", marginTop: 12, marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.8)" },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    background: "#0f172a",
    color: "white",
    fontSize: 14,
  },
  button: {
    width: "100%",
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "#2563eb",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    background: "rgba(239, 68, 68, 0.15)",
    border: "1px solid rgba(239, 68, 68, 0.4)",
    padding: 10,
    borderRadius: 10,
    color: "#fecaca",
    marginBottom: 10,
    fontSize: 14,
  },
  hint: { marginTop: 14, fontSize: 12, color: "rgba(255,255,255,0.6)" },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#93c5fd",
    cursor: "pointer",
    padding: 0,
    fontSize: "inherit",
  },
};
