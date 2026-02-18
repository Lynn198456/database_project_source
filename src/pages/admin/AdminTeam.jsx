import { useEffect, useMemo, useState } from "react";
import "../../styles/admin.css";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin/adminTeam.css";
import { listTheaters } from "../../api/theaters";
import {
  createTeamMember,
  deleteTeamMember,
  listTeamMembers,
  updateTeamMember
} from "../../api/teamMembers";

const ROLE_OPTIONS = ["ALL", "ADMIN", "MANAGER", "STAFF"];
const STATUS_OPTIONS = ["ALL", "ACTIVE", "ON_LEAVE", "INACTIVE"];

function uiRole(role) {
  if (role === "ADMIN") return "Administrator";
  if (role === "MANAGER") return "Manager";
  return "Staff";
}

function uiStatus(status) {
  if (status === "ACTIVE") return "Active";
  if (status === "ON_LEAVE") return "On Leave";
  return "Inactive";
}

function pillStatus(status) {
  if (status === "Active") return "active";
  if (status === "On Leave") return "leave";
  return "inactive";
}

function pillRole(role) {
  if (role === "Administrator") return "admin";
  if (role === "Manager") return "manager";
  return "staff";
}

export default function AdminTeam() {
  const [rows, setRows] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    role: "STAFF",
    department: "",
    status: "ACTIVE",
    email: "",
    phone: "",
    theaterId: "",
    hiredAt: ""
  });

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [members, theaterRows] = await Promise.all([
        listTeamMembers({ limit: 400, role, status, q }),
        listTheaters({ limit: 200 })
      ]);
      setRows(members);
      setTheaters(theaterRows);
    } catch (err) {
      setError(err.message || "Failed to load team members.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [q, role, status]);

  const members = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        name: `${r.first_name} ${r.last_name}`.trim(),
        roleLabel: uiRole(r.role),
        statusLabel: uiStatus(r.status),
        since: r.hired_at
          ? new Date(r.hired_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })
          : "-",
        lastActive: "-",
        assignedTheaters: r.theater_name ? [r.theater_name] : [],
        permissions: []
      })),
    [rows]
  );

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "ACTIVE").length;
    const admins = members.filter((m) => m.role === "ADMIN").length;
    const managers = members.filter((m) => m.role === "MANAGER").length;
    const staff = members.filter((m) => m.role === "STAFF").length;
    return { total, active, admins, managers, staff };
  }, [members]);

  const deptCounts = useMemo(() => {
    const map = new Map();
    members.forEach((m) => {
      const key = m.department || "General";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [members]);

  function clearAllFilters() {
    setQ("");
    setRole("ALL");
    setStatus("ALL");
  }

  function closeModal() {
    setModalOpen(false);
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onAddMember() {
    setModalMode("add");
    setActiveMemberId(null);
    setForm({
      firstName: "",
      lastName: "",
      role: "STAFF",
      department: "",
      status: "ACTIVE",
      email: "",
      phone: "",
      theaterId: "",
      hiredAt: ""
    });
    setModalOpen(true);
  }

  function onEdit(member) {
    setModalMode("edit");
    setActiveMemberId(member.id);
    setForm({
      firstName: member.first_name || "",
      lastName: member.last_name || "",
      role: member.role || "STAFF",
      department: member.department || "",
      status: member.status || "ACTIVE",
      email: member.email || "",
      phone: member.phone || "",
      theaterId: member.theater_id ? String(member.theater_id) : "",
      hiredAt: member.hired_at ? String(member.hired_at).slice(0, 10) : ""
    });
    setModalOpen(true);
  }

  async function onDelete(memberId) {
    if (!window.confirm("Delete this team member?")) return;
    try {
      await deleteTeamMember(memberId);
      await loadData();
    } catch (err) {
      window.alert(err.message || "Failed to delete member.");
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      role: form.role,
      department: form.department,
      status: form.status,
      email: form.email,
      phone: form.phone,
      theaterId: form.theaterId ? Number(form.theaterId) : null,
      hiredAt: form.hiredAt || null
    };

    try {
      if (modalMode === "add") {
        await createTeamMember(payload);
      } else {
        await updateTeamMember(activeMemberId, payload);
      }
      closeModal();
      await loadData();
    } catch (err) {
      window.alert(err.message || "Failed to save member.");
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <AdminNavbar />
        <main className="admin-container">
          <div className="team-head">
            <div className="team-titleWrap">
              <div className="team-icon">👥</div>
              <div>
                <h1 className="team-title">Team Members</h1>
                <p className="team-sub">{stats.total} total members • {stats.active} active</p>
              </div>
            </div>
            <button className="team-addBtn" onClick={onAddMember}>
              ＋ Add Team Member
            </button>
          </div>

          <section className="team-kpis">
            <KpiCard color="blue" label="Total Members" value={stats.total} icon="👤" />
            <KpiCard color="green" label="Active" value={stats.active} icon="✅" />
            <KpiCard color="purple" label="Administrators" value={stats.admins} icon="🛡️" />
            <KpiCard color="orange" label="Managers" value={stats.managers} icon="🧑‍💼" />
            <KpiCard color="teal" label="Staff" value={stats.staff} icon="🧑‍🔧" />
          </section>

          <section className="team-toolbar">
            <div className="team-search">
              <span className="team-searchIcon">🔎</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, role..." />
            </div>

            <select className="team-select" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r === "ALL" ? "All Roles" : uiRole(r)}
                </option>
              ))}
            </select>

            <select className="team-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL" ? "All Status" : uiStatus(s)}
                </option>
              ))}
            </select>

            <button className="team-clearBtn" onClick={clearAllFilters}>
              Clear
            </button>

            <button className="team-addInline" onClick={onAddMember}>
              ＋ Add Member
            </button>
          </section>

          {error ? <div className="team-emptySub">{error}</div> : null}
          {loading ? <div className="team-emptySub">Loading team members...</div> : null}

          <section className="team-list">
            {members.map((m) => (
              <article key={m.id} className="member-card">
                <div className="member-avatar blue">
                  {m.name
                    .split(" ")
                    .slice(0, 2)
                    .map((x) => x[0])
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="member-main">
                  <div className="member-topRow">
                    <div className="member-nameWrap">
                      <h3 className="member-name">{m.name}</h3>
                      <span className={`member-pill status ${pillStatus(m.statusLabel)}`}>{m.statusLabel}</span>
                      <span className={`member-pill role ${pillRole(m.roleLabel)}`}>{m.roleLabel}</span>
                    </div>

                    <div className="member-actions">
                      <button className="member-btn edit" onClick={() => onEdit(m)}>
                        ✏️ Edit
                      </button>
                      <button className="member-btn del" onClick={() => onDelete(m.id)}>
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="member-meta">
                    <div className="member-roleLine">
                      {m.roleLabel} • {m.department || "General"}
                    </div>
                    <div className="member-since">Member since {m.since}</div>
                  </div>

                  <div className="member-infoGrid">
                    <div className="infoBox">
                      <div className="infoLabel">✉️ Email</div>
                      <div className="infoValue">{m.email}</div>
                    </div>
                    <div className="infoBox">
                      <div className="infoLabel">📞 Phone</div>
                      <div className="infoValue">{m.phone || "-"}</div>
                    </div>
                    <div className="infoBox">
                      <div className="infoLabel">🕒 Last Active</div>
                      <div className="infoValue">{m.lastActive}</div>
                    </div>
                  </div>

                  <div className="member-tagsRow">
                    <div className="tagGroup">
                      <div className="tagTitle">🏢 Assigned Theaters:</div>
                      <div className="tagWrap">
                        {m.assignedTheaters.length ? (
                          m.assignedTheaters.map((t) => (
                            <span key={t} className="tag blue">
                              {t}
                            </span>
                          ))
                        ) : (
                          <span className="tag muted">Unassigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {!members.length && !loading && (
              <div className="team-empty">
                <div className="team-emptyTitle">No team members found</div>
                <div className="team-emptySub">Try changing your search or filters.</div>
              </div>
            )}
          </section>

          <section className="team-dist">
            <div className="team-distHead">
              <h3>Team Distribution by Department</h3>
            </div>

            <div className="team-distGrid">
              {deptCounts.slice(0, 4).map(([deptName, count], idx) => (
                <div key={deptName} className={`team-distCard ${["blue", "purple", "green", "orange"][idx % 4]}`}>
                  <div className="team-distValue">{count}</div>
                  <div className="team-distLabel">{deptName}</div>
                </div>
              ))}
            </div>
          </section>

          <footer className="admin-footer">© 2025 Cinema Listic. All rights reserved.</footer>
        </main>
      </div>

      {modalOpen ? (
        <div className="team-modalOverlay" onClick={closeModal}>
          <div className="team-modal" onClick={(e) => e.stopPropagation()}>
            <div className="team-modalHead">
              <h3>{modalMode === "add" ? "Add Team Member" : "Edit Team Member"}</h3>
              <button className="team-modalClose" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form className="team-modalBody" onSubmit={handleSave}>
              <label>
                First Name
                <input value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} required />
              </label>

              <label>
                Last Name
                <input value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} required />
              </label>

              <label>
                Role
                <select value={form.role} onChange={(e) => updateField("role", e.target.value)}>
                  <option value="ADMIN">Administrator</option>
                  <option value="MANAGER">Manager</option>
                  <option value="STAFF">Staff</option>
                </select>
              </label>

              <label>
                Department
                <input value={form.department} onChange={(e) => updateField("department", e.target.value)} />
              </label>

              <label>
                Status
                <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                  <option value="ACTIVE">Active</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </label>

              <label>
                Email
                <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
              </label>

              <label>
                Phone
                <input value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
              </label>

              <label>
                Assigned Theater
                <select value={form.theaterId} onChange={(e) => updateField("theaterId", e.target.value)}>
                  <option value="">Unassigned</option>
                  {theaters.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Hired Date
                <input type="date" value={form.hiredAt} onChange={(e) => updateField("hiredAt", e.target.value)} />
              </label>

              <div className="team-modalActions">
                <button className="team-modalPrimary" type="submit">
                  {modalMode === "add" ? "Add Member" : "Save Changes"}
                </button>
                <button className="team-modalSecondary" type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function KpiCard({ color, icon, label, value }) {
  return (
    <div className={`team-kpi ${color}`}>
      <div className="team-kpiIcon">{icon}</div>
      <div className="team-kpiLabel">{label}</div>
      <div className="team-kpiValue">{value}</div>
    </div>
  );
}
