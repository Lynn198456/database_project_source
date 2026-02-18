import { request } from "./client";

export async function listMovies({ page = 1, limit = 200, status } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  if (status) {
    params.set("status", status);
  }

  const data = await request(`/api/movies?${params.toString()}`);
  return data.movies || [];
}

export async function getMovie(id) {
  const data = await request(`/api/movies/${id}`);
  return data.movie;
}

export async function createMovie(payload) {
  const data = await request("/api/movies", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return data.id;
}

export async function updateMovie(id, payload) {
  const data = await request(`/api/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  return data.ok;
}

export async function deleteMovie(id) {
  const data = await request(`/api/movies/${id}`, {
    method: "DELETE"
  });

  return data.ok;
}
