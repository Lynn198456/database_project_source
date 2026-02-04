import { request } from "./client";

export async function listItems({ page = 1, limit = 100 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });
  const data = await request(`/api/items?${params.toString()}`);
  return data;
}

export async function getItem(id) {
  const data = await request(`/api/items/${id}`);
  return data.item;
}

export async function createItem(payload) {
  const data = await request("/api/items", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.id;
}

export async function updateItem(id, payload) {
  const data = await request(`/api/items/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload)
    }
  );
  return data.ok;
}

export async function deleteItem(id) {
  const data = await request(`/api/items/${id}`, {
    method: "DELETE"
  });
  return data.ok;
}
