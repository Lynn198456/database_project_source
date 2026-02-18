import { request } from "./client";

function normalizeRecord(row) {
  return {
    id: row.id,
    teamMemberId: row.team_member_id ?? row.teamMemberId ?? null,
    workDate: row.work_date ? String(row.work_date).slice(0, 10) : "",
    clockInAt: row.clock_in_at ?? row.clockInAt ?? null,
    clockOutAt: row.clock_out_at ?? row.clockOutAt ?? null,
    breakMinutes: Number.parseInt(row.break_minutes ?? row.breakMinutes ?? 0, 10) || 0,
    notes: row.notes ?? "",
    status: String(row.status || "CLOCKED_IN").toUpperCase()
  };
}

export async function listStaffTimeRecords({ page = 1, limit = 200, email, teamMemberId, from, to, status } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });

  if (email) params.set("email", String(email).trim().toLowerCase());
  if (teamMemberId) params.set("teamMemberId", String(teamMemberId));
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (status) params.set("status", String(status).trim().toUpperCase());

  const data = await request(`/api/staff-time-records?${params.toString()}`);
  return {
    records: (data.records || []).map(normalizeRecord),
    total: data.total || 0
  };
}
