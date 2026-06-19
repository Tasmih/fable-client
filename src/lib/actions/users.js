const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// get logged in user purchased ebooks
export const getPurchasedEbooks = async (email) => {
  const res = await fetch(
    `${API_URL}/api/users/purchased-ebooks?email=${encodeURIComponent(email)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to load purchased ebooks");
  }

  return data;
};

// get logged in user purchase history
export const getPurchaseHistory = async (email) => {
  const res = await fetch(
    `${API_URL}/api/users/purchase-history?email=${encodeURIComponent(email)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to load purchase history");
  }

  return data;
};