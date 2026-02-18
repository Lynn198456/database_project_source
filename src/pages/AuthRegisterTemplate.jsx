import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../api/auth";

const ROLE_META = {
  CUSTOMER: { label: "Customer" },
  STAFF: { label: "Staff" },
  ADMIN: { label: "Admin" }
};

export default function AuthRegisterTemplate({
  role,
  title,
  subtitle,
  loginPath,
  customerRegisterPath = "/register",
  staffRegisterPath = "/staff/register",
  adminRegisterPath = "/admin/register"
}) {
  const navigate = useNavigate();
  const rolePaths = useMemo(
    () => ({
      CUSTOMER: customerRegisterPath,
      STAFF: staffRegisterPath,
      ADMIN: adminRegisterPath
    }),
    [adminRegisterPath, customerRegisterPath, staffRegisterPath]
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await registerUser({
        firstName,
        lastName,
        email,
        phone,
        password,
        confirmPassword,
        role
      });
      setSuccess("Account created. You can now log in.");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const passwordStrength = getPasswordStrength(password);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.sidePanel}>
          <div style={styles.brandBlock}>
            <div style={styles.brandBadge}>CF</div>
            <div>
              <h2 style={styles.brandTitle}>{title}</h2>
              <p style={styles.brandText}>{subtitle}</p>
            </div>
          </div>

          <div style={styles.featureList}>
            <div style={styles.featureItem}>One-tap rebooking and quick pay</div>
            <div style={styles.featureItem}>Early access to premieres</div>
            <div style={styles.featureItem}>Seat history and favorites</div>
          </div>

          <p style={styles.switchTitle}>Account type:</p>
          <div style={styles.switchRow}>
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
        </div>

        <form onSubmit={handleRegister} style={styles.card}>
          <div style={styles.cardHeader}>
            <h1 style={styles.title}>Create account</h1>
            <p style={styles.subtitle2}>Creating a {ROLE_META[role].label.toLowerCase()} account.</p>
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && (
            <div style={styles.success}>
              {success}{" "}
              <button type="button" onClick={() => navigate(loginPath)} style={styles.linkButton}>
                Go to login
              </button>
            </div>
          )}

          <div style={styles.section}>
            <p style={styles.sectionTitle}>Your details</p>
            <div style={styles.row}>
              <div style={styles.col}>
                <label style={styles.label}>First Name *</label>
                <input style={styles.input} type="text" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div style={styles.col}>
                <label style={styles.label}>Last Name *</label>
                <input style={styles.input} type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>

            <label style={styles.label}>Email *</label>
            <input style={styles.input} type="email" placeholder="jane@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <p style={styles.helpText}>We will send tickets and confirmations to this email.</p>

            <label style={styles.label}>Phone (optional)</label>
            <input style={styles.input} type="tel" placeholder="(555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div style={styles.section}>
            <p style={styles.sectionTitle}>Set a password</p>

            <label style={styles.label}>Password *</label>
            <div style={styles.inputWrap}>
              <input
                style={styles.input}
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" style={styles.toggleButton} onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div style={styles.strengthRow}>
              <div style={styles.strengthTrack}>
                <div style={{ ...styles.strengthBar, width: `${passwordStrength.percent}%`, background: passwordStrength.color }} />
              </div>
              <span style={styles.strengthLabel}>{passwordStrength.label}</span>
            </div>

            <label style={styles.label}>Confirm Password *</label>
            <div style={styles.inputWrap}>
              <input
                style={styles.input}
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button type="button" style={styles.toggleButton} onClick={() => setShowConfirm((v) => !v)}>
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
            <p style={styles.helpText}>Use 8+ characters with a mix of letters and numbers.</p>
          </div>

          <button style={styles.button} type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Account"}
          </button>

          <div style={styles.footerRow}>
            <span style={styles.footerText}>Already have an account?</span>
            <button type="button" onClick={() => navigate(loginPath)} style={styles.linkButton}>
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getPasswordStrength(value) {
  if (!value) return { label: "", percent: 0, color: "transparent" };
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (score <= 1) return { label: "Weak", percent: 30, color: "#f97316" };
  if (score === 2) return { label: "Okay", percent: 55, color: "#facc15" };
  if (score === 3) return { label: "Good", percent: 75, color: "#34d399" };
  return { label: "Strong", percent: 100, color: "#22c55e" };
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top, #1f2937, #0b1220 55%, #060a12)",
    padding: 24,
  },
  container: {
    width: "100%",
    maxWidth: 980,
    display: "grid",
    gridTemplateColumns: "minmax(280px, 1fr) minmax(320px, 1.2fr)",
    gap: 24,
  },
  sidePanel: {
    background: "linear-gradient(160deg, rgba(37, 99, 235, 0.18), rgba(15, 23, 42, 0.9))",
    borderRadius: 18,
    padding: 24,
    border: "1px solid rgba(148, 163, 184, 0.2)",
    color: "#e2e8f0",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
  },
  brandBlock: { display: "flex", gap: 14, alignItems: "center" },
  brandBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "rgba(59, 130, 246, 0.2)",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    color: "#bfdbfe",
    border: "1px solid rgba(147, 197, 253, 0.4)",
  },
  brandTitle: { margin: 0, fontSize: 22 },
  brandText: { marginTop: 6, color: "rgba(226,232,240,0.8)" },
  featureList: { marginTop: 20, display: "grid", gap: 10 },
  featureItem: {
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(15, 23, 42, 0.6)",
    border: "1px solid rgba(148, 163, 184, 0.15)",
    fontSize: 14,
  },
  switchTitle: { marginTop: 18, marginBottom: 8, fontSize: 12, color: "rgba(255,255,255,0.65)" },
  switchRow: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 },
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
  card: {
    background: "#0b1220",
    color: "white",
    borderRadius: 18,
    padding: 24,
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
  },
  cardHeader: { marginBottom: 16 },
  title: { margin: 0, fontSize: 28 },
  subtitle2: { marginTop: 6, color: "rgba(255,255,255,0.7)" },
  section: { marginTop: 16 },
  sectionTitle: { margin: 0, fontSize: 14, color: "#93c5fd", textTransform: "uppercase", letterSpacing: 1 },
  row: { display: "flex", gap: 12 },
  col: { flex: 1 },
  label: { display: "block", marginTop: 12, marginBottom: 6, fontSize: 14, color: "rgba(255,255,255,0.85)" },
  inputWrap: { position: "relative" },
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
  toggleButton: {
    position: "absolute",
    right: 10,
    top: 8,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid rgba(148, 163, 184, 0.35)",
    background: "rgba(15, 23, 42, 0.7)",
    color: "#cbd5f5",
    cursor: "pointer",
    fontSize: 12,
  },
  helpText: { marginTop: 6, fontSize: 12, color: "rgba(255,255,255,0.55)" },
  strengthRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 8 },
  strengthTrack: {
    flex: 1,
    height: 8,
    background: "rgba(148, 163, 184, 0.2)",
    borderRadius: 999,
    overflow: "hidden",
  },
  strengthBar: { height: "100%", borderRadius: 999, transition: "width 200ms ease" },
  strengthLabel: { fontSize: 12, color: "rgba(255,255,255,0.7)" },
  button: {
    width: "100%",
    marginTop: 22,
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
  success: {
    background: "rgba(34, 197, 94, 0.15)",
    border: "1px solid rgba(34, 197, 94, 0.4)",
    padding: 10,
    borderRadius: 10,
    color: "#bbf7d0",
    marginBottom: 10,
    fontSize: 14,
  },
  footerRow: { display: "flex", justifyContent: "center", gap: 8, marginTop: 16 },
  footerText: { fontSize: 13, color: "rgba(255,255,255,0.65)" },
  linkButton: {
    border: "none",
    background: "transparent",
    color: "#93c5fd",
    cursor: "pointer",
    padding: 0,
    fontSize: "inherit",
  },
};
