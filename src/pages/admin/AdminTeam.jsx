import { useMemo, useState } from "react";
import "../../styles/admin.css";
import AdminNavbar from "../../components/admin/AdminNavbar";
import "../../styles/admin/adminTeam.css";

const ROLE_OPTIONS = ["All Roles", "Administrator", "Manager", "Staff"];
const STATUS_OPTIONS = ["All Status", "Active", "On Leave", "Inactive"];

export default function AdminTeam() {
  // Demo data (replace with API later)
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Administrator",
      department: "Management",
      status: "Active",
      email: "sarah.johnson@cinemaflow.com",
      phone: "+1 (555) 987-6543",
      lastActive: "2 hours ago",
      assignedTheaters: ["Downtown", "Mall Location", "Suburban"],
      permissions: ["Full Access", "User Management", "Financial Reports"],
      avatarColor: "purple",
      since: "Jan 2023",
    },
    {
      id: 2,
      name: "Emily Rodriguez",
      role: "Manager",
      department: "Operations",
      status: "Active",
      email: "emily.rodriguez@cinemaflow.com",
      phone: "+1 (555) 345-6789",
      lastActive: "1 hour ago",
      assignedTheaters: ["Mall Location"],
      permissions: ["Scheduling", "Customer Support"],
      avatarColor: "green",
      since: "Feb 2023",
    },
    {
      id: 3,
      name: "David Kim",
      role: "Staff",
      department: "IT",
      status: "Active",
      email: "david.kim@cinemaflow.com",
      phone: "+1 (555) 456-7890",
      lastActive: "30 minutes ago",
      assignedTheaters: ["All Locations"],
      permissions: ["System Settings", "Technical Support"],
      avatarColor: "orange",
      since: "Apr 2023",
    },
    {
      id: 4,
      name: "Jessica Taylor",
      role: "Staff",
      department: "Marketing",
      status: "Active",
      email: "jessica.taylor@cinemaflow.com",
      phone: "+1 (555) 567-8901",
      lastActive: "3 hours ago",
      assignedTheaters: ["Downtown"],
      permissions: ["Campaign Access"],
      avatarColor: "pink",
      since: "May 2023",
    },
    {
      id: 5,
      name: "James Wilson",
      role: "Staff",
      department: "Facilities",
      status: "On Leave",
      email: "james.wilson@cinemaflow.com",
      phone: "+1 (555) 890-1234",
      lastActive: "2 days ago",
      assignedTheaters: ["All Locations"],
      permissions: ["Facility Management"],
      avatarColor: "blue",
      since: "Aug 2023",
    },
    {
      id: 6,
      name: "Olivia Chen",
      role: "Manager",
      department: "Operations",
      status: "Active",
      email: "olivia.chen@cinemaflow.com",
      phone: "+1 (555) 222-3344",
      lastActive: "10 minutes ago",
      assignedTheaters: ["Downtown", "Mall Location"],
      permissions: ["Scheduling"],
      avatarColor: "purple",
      since: "Sep 2023",
    },
    {
      id: 7,
      name: "Michael Brown",
      role: "Staff",
      department: "Management",
      status: "Active",
      email: "michael.brown@cinemaflow.com",
      phone: "+1 (555) 444-1212",
      lastActive: "5 hours ago",
      assignedTheaters: ["Suburban"],
      permissions: ["Customer Support"],
      avatarColor: "green",
      since: "Nov 2023",
    },
    {
      id: 8,
      name: "Nina Patel",
      role: "Staff",
      department: "Operations",
      status: "Inactive",
      email: "nina.patel@cinemaflow.com",
      phone: "+1 (555) 111-9090",
      lastActive: "3 weeks ago",
      assignedTheaters: ["Mall Location"],
      permissions: [],
      avatarColor: "orange",
      since: "Dec 2023",
    },
  ]);

  const [q, setQ] = useState("");
  const [role, setRole] = useState("All Roles");
  const [status, setStatus] = useState("All Status");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add | edit
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    role: "Staff",
    department: "",
    status: "Active",
    email: "",
    phone: "",
    assignedTheaters: "",
    permissions: "",
  });

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "Active").length;
    const admins = members.filter((m) => m.role === "Administrator").length;
    const managers = members.filter((m) => m.role === "Manager").length;
    const staff = members.filter((m) => m.role === "Staff").length;
    return { total, active, admins, managers, staff };
  }, [members]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return members.filter((m) => {
      const matchQ =
        !query ||
        m.name.toLowerCase().includes(query) ||
        m.email.toLowerCase().includes(query) ||
        m.role.toLowerCase().includes(query) ||
        m.department.toLowerCase().includes(query);

      const matchRole = role === "All Roles" || m.role === role;
      const matchStatus = status === "All Status" || m.status === status;
      return matchQ && matchRole && matchStatus;
    });
  }, [members, q, role, status]);

  const deptCounts = useMemo(() => {
    const map = new Map();
    members.forEach((m) => {
      map.set(m.department, (map.get(m.department) || 0) + 1);
    });
    // Sort by count desc
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [members]);

  function onAddMember() {
    setModalMode("add");
    setActiveMemberId(null);
    setForm({
      name: "",
      role: "Staff",
      department: "",
      status: "Active",
      email: "",
      phone: "",
      assignedTheaters: "",
      permissions: "",
    });
    setModalOpen(true);
  }

  function onEdit(member) {
    setModalMode("edit");
    setActiveMemberId(member.id);
    setForm({
      name: member.name,
      role: member.role,
      department: member.department,
      status: member.status,
      email: member.email,
      phone: member.phone,
      assignedTheaters: member.assignedTheaters.join(", "),
      permissions: member.permissions.join(", "),
    });
    setModalOpen(true);
  }

  function onDelete(memberId) {
    if (!confirm("Delete this team member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  function clearAllFilters() {
    setQ("");
    setRole("All Roles");
    setStatus("All Status");
  }

  function closeModal() {
    setModalOpen(false);
  }

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave(e) {
    e.preventDefault();
    const assignedTheaters = form.assignedTheaters
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
    const permissions = form.permissions
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (modalMode === "add") {
      const nextId = Math.max(0, ...members.map((m) => m.id)) + 1;
      const newMember = {
        id: nextId,
        name: form.name.trim(),
        role: form.role,
        department: form.department.trim() || "General",
        status: form.status,
        email: form.email.trim(),
        phone: form.phone.trim(),
        lastActive: "Just now",
        assignedTheaters,
        permissions,
        avatarColor: "blue",
        since: "Feb 2026",
      };
      setMembers((prev) => [newMember, ...prev]);
    } else {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === activeMemberId
            ? {
                ...m,
                name: form.name.trim(),
                role: form.role,
                department: form.department.trim() || "General",
                status: form.status,
                email: form.email.trim(),
                phone: form.phone.trim(),
                assignedTheaters,
                permissions,
              }
            : m
        )
      );
    }

    closeModal();
  }

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <AdminNavbar />

        <main className="admin-container">
          {/* Header */}
          <div className="team-head">
            <div className="team-titleWrap">
              <div className="team-icon">👥</div>
              <div>
                <h1 className="team-title">Team Members</h1>
                <p className="team-sub">
                  {stats.total} total members • {stats.active} active
                </p>
              </div>
            </div>

            <button className="team-addBtn" onClick={onAddMember}>
              ＋ Add Team Member
            </button>
          </div>

          {/* KPI Cards */}
          <section className="team-kpis">
            <KpiCard color="blue" label="Total Members" value={stats.total} icon="👤" />
            <KpiCard color="green" label="Active" value={stats.active} icon="✅" />
            <KpiCard color="purple" label="Administrators" value={stats.admins} icon="🛡️" />
            <KpiCard color="orange" label="Managers" value={stats.managers} icon="🧑‍💼" />
            <KpiCard color="teal" label="Staff" value={stats.staff} icon="🧑‍🔧" />
          </section>

          {/* Toolbar */}
          <section className="team-toolbar">
            <div className="team-search">
              <span className="team-searchIcon">🔎</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, email, role..."
              />
            </div>

            <select className="team-select" value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              className="team-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
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

          {/* Members list */}
          <section className="team-list">
            {filtered.map((m) => (
              <article key={m.id} className="member-card">
                <div className={`member-avatar ${m.avatarColor}`}>
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
                      <span className={`member-pill status ${pillStatus(m.status)}`}>
                        {m.status}
                      </span>
                      <span className={`member-pill role ${pillRole(m.role)}`}>{m.role}</span>
                    </div>

                    <div className="member-actions">
                      <button className="member-btn edit" onClick={() => onEdit(m)}>
                        ✏️ Edit
                      </button>
                      <button className="member-btn del" onClick={() => onDelete(m.id)}>
                        🗑️
                      </button>
                      <button className="member-btn more" onClick={() => alert("More actions")}>
                        ⋯
                      </button>
                    </div>
                  </div>

                  <div className="member-meta">
                    <div className="member-roleLine">
                      {m.role} • {m.department}
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
                      <div className="infoValue">{m.phone}</div>
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
                        {m.assignedTheaters.map((t) => (
                          <span key={t} className="tag blue">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="tagGroup">
                      <div className="tagTitle">🛡️ Permissions:</div>
                      <div className="tagWrap">
                        {m.permissions.length ? (
                          m.permissions.map((p) => (
                            <span key={p} className="tag purple">
                              {p}
                            </span>
                          ))
                        ) : (
                          <span className="tag muted">No permissions</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {!filtered.length && (
              <div className="team-empty">
                <div className="team-emptyTitle">No team members found</div>
                <div className="team-emptySub">Try changing your search or filters.</div>
              </div>
            )}
          </section>

          {/* Department distribution */}
          <section className="team-dist">
            <div className="team-distHead">
              <h3>Team Distribution by Department</h3>
            </div>

            <div className="team-distGrid">
              {deptCounts.slice(0, 4).map(([deptName, count], idx) => (
                <div
                  key={deptName}
                  className={`team-distCard ${["blue", "purple", "green", "orange"][idx % 4]}`}
                >
                  <div className="team-distValue">{count}</div>
                  <div className="team-distLabel">{deptName}</div>
                </div>
              ))}
            </div>
          </section>

          <footer className="admin-footer">© 2025 CinemaFlow. All rights reserved.</footer>
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
                Name
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </label>

              <label>
                Role
                <select
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                >
                  <option>Administrator</option>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
              </label>

              <label>
                Department
                <input
                  value={form.department}
                  onChange={(e) => updateField("department", e.target.value)}
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </label>

              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </label>

              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </label>

              <label className="team-modalSpan">
                Assigned Theaters (comma separated)
                <input
                  value={form.assignedTheaters}
                  onChange={(e) => updateField("assignedTheaters", e.target.value)}
                />
              </label>

              <label className="team-modalSpan">
                Permissions (comma separated)
                <input
                  value={form.permissions}
                  onChange={(e) => updateField("permissions", e.target.value)}
                />
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
