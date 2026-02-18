import { request } from "./client";

export async function listTeamMembers({ page = 1, limit = 200, role, status, q } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  if (role && role !== "ALL") params.set("role", role);
  if (status && status !== "ALL") params.set("status", status);
  if (q) params.set("q", q);

  const data = await request(`/api/team-members?${params.toString()}`);
  return data.teamMembers || [];
}

export async function createTeamMember(payload) {
  const data = await request("/api/team-members", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.id;
}

export async function updateTeamMember(id, payload) {
  const data = await request(`/api/team-members/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return data.ok;
}

export async function deleteTeamMember(id) {
  const data = await request(`/api/team-members/${id}`, {
    method: "DELETE"
  });
  return data.ok;
}
