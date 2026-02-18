import { request } from "./client";

export async function listShowtimes({ page = 1, limit = 200, movieId, screenId } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  if (movieId) params.set("movieId", String(movieId));
  if (screenId) params.set("screenId", String(screenId));

  const data = await request(`/api/showtimes?${params.toString()}`);
  return data.showtimes || [];
}

export async function getShowtime(id) {
  const data = await request(`/api/showtimes/${id}`);
  return data.showtime;
}

export async function createShowtime(payload) {
  const data = await request("/api/showtimes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.id;
}

export async function updateShowtime(id, payload) {
  const data = await request(`/api/showtimes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return data.ok;
}

export async function deleteShowtime(id) {
  const data = await request(`/api/showtimes/${id}`, {
    method: "DELETE"
  });
  return data.ok;
}
