import { request } from "./client";

export async function listScreens({ page = 1, limit = 200, theaterId } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  if (theaterId) {
    params.set("theaterId", String(theaterId));
  }

  const data = await request(`/api/screens?${params.toString()}`);
  return data.screens || [];
}

export async function createScreen(payload) {
  const data = await request("/api/screens", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return data.id;
}
