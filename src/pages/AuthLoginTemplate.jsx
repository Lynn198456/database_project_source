import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../api/auth";

const ROLE_META = {
  CUSTOMER: { label: "Customer" },
  STAFF: { label: "Staff" },
  ADMIN: { label: "Admin" }
};

function findSuggestedRoleFromError(message) {
  const match = /not a\s+(customer|staff|admin)\s+account/i.exec(message || "");
  return match ? match[1].toUpperCase() : null;
}

export default function AuthLoginTemplate({
  role,
  title,
  subtitle,
  registerPath,
  customerLoginPath = "/login",
  staffLoginPath = "/staff/login",
  adminLoginPath = "/admin/login"
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const rolePaths = useMemo(
    () => ({
      CUSTOMER: customerLoginPath,
      STAFF: staffLoginPath,
      ADMIN: adminLoginPath
    }),
    [adminLoginPath, customerLoginPath, staffLoginPath]
  );

  const suggestedRole = findSuggestedRoleFromError(error);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }

    try {
      setSubmitting(true);
      const user = await loginUser({ email, password, expectedRole: role });
      localStorage.setItem("cinemaFlow_user", JSON.stringify(user));

      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "STAFF") navigate("/staff");
      else navigate("/customer");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.card}>
        <div style={styles.roleTabs}>
          {Object.entries(rolePaths).map(([roleKey, path]) => (
            <button
              key={roleKey}
              type="button"
              onClick={() => navigate(path)}
              style={{
                ...styles.roleTab,
                ...(role === roleKey ? styles.roleTabActive : {})
              }}
            >
              {ROLE_META[roleKey].label}
            </button>
          ))}
        </div>

        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>

        {error && (
          <div style={styles.error}>
            <div>{error}</div>
            {suggestedRole && suggestedRole !== role && (
              <button
                type="button"
                style={styles.errorAction}
                onClick={() => navigate(rolePaths[suggestedRole])}
              >
                Continue as {ROLE_META[suggestedRole].label}
              </button>
            )}
          </div>
        )}

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={styles.label}>Password</label>
        <div style={styles.inputWrap}>
          <input
            style={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="button" style={styles.eyeButton} onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button style={styles.button} type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : `Sign in as ${ROLE_META[role].label}`}
        </button>

        <div style={styles.footerRow}>
          <span style={styles.footerText}>New here?</span>
          <button type="button" onClick={() => navigate(registerPath)} style={styles.linkButton}>
            Create an account
          </button>
        </div>
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
    background: "radial-gradient(circle at 10% 10%, #1f3a8a 0%, #0b1220 45%, #030711 100%)",
    padding: 18
  },
  card: {
    width: "100%",
    maxWidth: 460,
    background: "rgba(5, 16, 40, 0.94)",
    color: "white",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 24px 50px rgba(0,0,0,0.45)",
    border: "1px solid rgba(148, 163, 184, 0.22)"
  },
  roleTabs: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 8,
    marginBottom: 18
  },
  roleTab: {
    padding: "9px 10px",
    borderRadius: 10,
    border: "1px solid rgba(148, 163, 184, 0.3)",
    background: "rgba(15, 23, 42, 0.55)",
    color: "#cbd5e1",
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600
  },
  roleTabActive: {
    border: "1px solid rgba(96, 165, 250, 0.75)",
    background: "linear-gradient(180deg, rgba(37,99,235,0.6), rgba(30,64,175,0.7))",
    color: "#eff6ff"
  },
  title: { margin: 0, fontSize: 32, letterSpacing: 0.2 },
  subtitle: { marginTop: 6, marginBottom: 16, color: "rgba(226,232,240,0.85)" },
  label: { display: "block", marginTop: 12, marginBottom: 6, fontSize: 14, color: "rgba(226,232,240,0.9)" },
  inputWrap: { position: "relative" },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 11,
    border: "1px solid rgba(148, 163, 184, 0.3)",
    outline: "none",
    background: "rgba(30, 41, 59, 0.95)",
    color: "white",
    fontSize: 14
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 8,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid rgba(148, 163, 184, 0.35)",
    background: "rgba(15, 23, 42, 0.85)",
    color: "#cbd5f5",
    cursor: "pointer",
    fontSize: 12
  },
  button: {
    width: "100%",
    marginTop: 18,
    padding: 12,
    borderRadius: 11,
    border: "none",
    background: "linear-gradient(90deg, #2563eb, #3b82f6)",
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer"
  },
  error: {
    background: "rgba(239, 68, 68, 0.16)",
    border: "1px solid rgba(239, 68, 68, 0.45)",
    padding: 12,
    borderRadius: 11,
    color: "#fecaca",
    marginBottom: 10,
    fontSize: 14,
    display: "grid",
    gap: 10
  },
  errorAction: {
    justifySelf: "start",
    border: "1px solid rgba(252, 165, 165, 0.45)",
    background: "rgba(127, 29, 29, 0.45)",
    color: "#fee2e2",
    padding: "6px 10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600
  },
  footerRow: { display: "flex", justifyContent: "center", gap: 8, marginTop: 16 },
  footerText: { fontSize: 13, color: "rgba(226,232,240,0.75)" },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#93c5fd",
    cursor: "pointer",
    padding: 0,
    fontSize: "inherit",
    fontWeight: 600
  }
};
