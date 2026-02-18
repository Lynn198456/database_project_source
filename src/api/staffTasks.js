import { request } from "./client";

function normalizeTask(row) {
  const dueDateRaw = row.due_date ?? row.dueDate ?? null;
  const dueTimeRaw = row.due_time ?? row.dueTime ?? null;

  return {
    id: row.id,
    teamMemberId: row.team_member_id ?? row.teamMemberId ?? null,
    title: row.title ?? "",
    description: row.description ?? "",
    priority: String(row.priority || "MEDIUM").toLowerCase(),
    status: String(row.status || "PENDING").toUpperCase(),
    dueDate: dueDateRaw ? String(dueDateRaw).slice(0, 10) : "",
    dueTime: dueTimeRaw ? String(dueTimeRaw).slice(0, 5) : "",
    completedAt: row.completed_at ?? row.completedAt ?? null
  };
}

function withIdentity(params, identity = {}) {
  if (identity.email) params.set("email", String(identity.email).trim().toLowerCase());
  if (identity.teamMemberId) params.set("teamMemberId", String(identity.teamMemberId));
}

export async function listStaffTasks({ page = 1, limit = 200, status, email, teamMemberId } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  withIdentity(params, { email, teamMemberId });
  if (status) params.set("status", String(status).trim().toUpperCase());

  const data = await request(`/api/staff-tasks?${params.toString()}`);
  return {
    tasks: (data.tasks || []).map(normalizeTask),
    total: data.total || 0
  };
}

export async function getStaffTask(id) {
  const data = await request(`/api/staff-tasks/${id}`);
  return normalizeTask(data.task);
}

export async function updateStaffTask(id, payload) {
  const body = {
    title: payload.title,
    description: payload.description || "",
    priority: String(payload.priority || "MEDIUM").toUpperCase(),
    dueDate: payload.dueDate || null,
    dueTime: payload.dueTime || null,
    status: String(payload.status || "PENDING").toUpperCase()
  };

  const data = await request(`/api/staff-tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(body)
  });

  return data.ok;
}

export async function createStaffTask(payload) {
  const data = await request("/api/staff-tasks", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.id;
}
