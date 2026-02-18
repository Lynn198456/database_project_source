import { request } from "./client";

export async function createBooking(payload) {
  const data = await request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data.id;
}

export async function listBookings({ page = 1, limit = 100, userId } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit)
  });

  if (userId) {
    params.set("userId", String(userId));
  }

  const data = await request(`/api/bookings?${params.toString()}`);
  return data.bookings || [];
}

export async function getBooking(id) {
  const data = await request(`/api/bookings/${id}`);
  return {
    booking: data.booking,
    seats: data.seats || []
  };
}
