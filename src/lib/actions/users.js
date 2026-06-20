const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

// get logged in user purchased ebooks
export const getPurchasedEbooks = async (email) => {
  const res = await fetch(
    `${API_URL}/api/users/purchased-ebooks?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load purchased ebooks");
};

// get logged in user purchase history
export const getPurchaseHistory = async (email) => {
  const res = await fetch(
    `${API_URL}/api/users/purchase-history?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load purchase history");
};

// get logged in user bookmarked ebooks
export const getBookmarks = async (email) => {
  const res = await fetch(
    `${API_URL}/api/users/bookmarks?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load bookmarks");
};