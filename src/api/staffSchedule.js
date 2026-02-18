import { request } from "./client";

function addIdentity(params, { email, teamMemberId } = {}) {
  if (email) params.set("email", String(email).trim().toLowerCase());
  if (teamMemberId) params.set("teamMemberId", String(teamMemberId));
}

function normalizeSchedule(row) {
  return {
    id: row.id,
    teamMemberId: row.team_member_id ?? row.teamMemberId ?? null,
    shiftDate: row.shift_date ?? row.shiftDate ?? "",
    startTime: row.start_time ?? row.startTime ?? "",
    endTime: row.end_time ?? row.endTime ?? "",
    roleOnShift: row.role_on_shift ?? row.roleOnShift ?? "",
    notes: row.notes ?? "",
    status: row.status ?? "SCHEDULED"
  };
}

function normalizeTimeOffRequest(row) {
  return {
    id: row.id,
    teamMemberId: row.team_member_id ?? row.teamMemberId ?? null,
    type: row.request_type ?? row.requestType ?? "VACATION",
    startDate: row.start_date ?? row.startDate ?? "",
    endDate: row.end_date ?? row.endDate ?? "",
    partialDay: Boolean(row.partial_day ?? row.partialDay),
    startTime: row.partial_start_time ?? row.partialStartTime ?? null,
    endTime: row.partial_end_time ?? row.partialEndTime ?? null,
    reason: row.reason ?? "",
    status: row.status ?? "PENDING",
    createdAt: row.created_at ?? row.createdAt ?? null
  };
}

export async function listStaffSchedules(identity = {}) {
  const params = new URLSearchParams();
  addIdentity(params, identity);
  const data = await request(`/api/staff-schedules?${params.toString()}`);

  return {
    schedules: (data.schedules || []).map(normalizeSchedule),
    teamMemberId: data.teamMemberId ?? identity.teamMemberId ?? null
  };
}

export async function listStaffTimeOffRequests(identity = {}) {
  const params = new URLSearchParams();
  addIdentity(params, identity);
  const data = await request(`/api/staff-timeoff-requests?${params.toString()}`);

  return {
    requests: (data.requests || []).map(normalizeTimeOffRequest),
    teamMemberId: data.teamMemberId ?? identity.teamMemberId ?? null
  };
}

export async function createStaffTimeOffRequest(payload) {
  const data = await request("/api/staff-timeoff-requests", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return data.id;
}

export async function deleteStaffTimeOffRequest(id, identity = {}) {
  const params = new URLSearchParams();
  addIdentity(params, identity);

  const queryString = params.toString();
  const path = queryString ? `/api/staff-timeoff-requests/${id}?${queryString}` : `/api/staff-timeoff-requests/${id}`;

  const data = await request(path, {
    method: "DELETE"
  });

  return data.ok;
}
