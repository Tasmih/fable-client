const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getTopWriters = async (limit = 3) => {
  const res = await fetch(`${API_URL}/api/top-writers?limit=${limit}`, {
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load top writers");
  }

  return data || [];
};