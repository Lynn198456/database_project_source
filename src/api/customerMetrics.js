import { request } from "./client";

export async function getCustomerProfileMetrics({ id, email } = {}) {
  const params = new URLSearchParams();
  if (id) params.set("id", String(id));
  if (email) params.set("email", String(email).trim().toLowerCase());

  const data = await request(`/api/customer/profile-metrics?${params.toString()}`);

  return (
    data.metrics || {
      watchlistTotal: 0,
      bookingTotal: 0,
      totalSpent: 0
    }
  );
}
