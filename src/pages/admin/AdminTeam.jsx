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
    alert("Add Team Member (connect modal later)");
  }

  function onEdit(member) {
    alert(`Edit: ${member.name} (connect modal later)`);
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
