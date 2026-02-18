import { request } from "./client";

export async function getStaffWorkSummary({ email, teamMemberId } = {}) {
  const params = new URLSearchParams();
  if (email) params.set("email", String(email).trim().toLowerCase());
  if (teamMemberId) params.set("teamMemberId", String(teamMemberId));

  const data = await request(`/api/staff/work-summary?${params.toString()}`);
  return {
    summary: data.summary || {
      totalHours: 0,
      shiftsCompleted: 0,
      tasksCompleted: 0,
      pendingTimeOffRequests: 0,
      upcomingShifts: 0,
      openTasks: 0
    },
    teamMemberId: data.teamMemberId || null
  };
}
