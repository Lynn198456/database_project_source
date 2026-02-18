import { request } from "./client";

export async function listTheaters({ page = 1, limit = 200 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  const data = await request(`/api/theaters?${params.toString()}`);
  return data.theaters || [];
}

export async function createTheater(payload) {
  const data = await request("/api/theaters", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.id;
}

export async function updateTheater(id, payload) {
  const data = await request(`/api/theaters/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return data.ok;
}

export async function deleteTheater(id) {
  const data = await request(`/api/theaters/${id}`, {
    method: "DELETE"
  });
  return data.ok;
}
