import { request } from "./client";

function buildIdentityParams(identity = {}) {
  const params = new URLSearchParams();
  if (identity.id) params.set("id", String(identity.id));
  if (identity.email) params.set("email", String(identity.email).trim().toLowerCase());
  return params;
}

export async function getCurrentUser(identity = {}) {
  const params = buildIdentityParams(identity);
  const data = await request(`/api/users/me?${params.toString()}`);
  return data.user;
}

export async function updateCurrentUser(identity = {}, payload = {}) {
  const params = buildIdentityParams(identity);
  const data = await request(`/api/users/me?${params.toString()}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  return data.user;
}
