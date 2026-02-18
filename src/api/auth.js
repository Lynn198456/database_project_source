import { request } from "./client";

export async function registerUser(payload) {
  const data = await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return data.user;
}

export async function loginUser(payload) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return data.user;
}
