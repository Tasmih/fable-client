const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

// user action: get purchased ebooks
export const getPurchasedEbooks = async (email) => {
  const res = await fetch(
    `${API_URL}/api/users/purchased-ebooks?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load purchased ebooks");
};

// user action: get purchase history
export const getPurchaseHistory = async (email) => {
  const res = await fetch(
    `${API_URL}/api/users/purchase-history?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load purchase history");
};

// user action: get bookmarked ebooks
export const getBookmarks = async (email) => {
  const res = await fetch(
    `${API_URL}/api/users/bookmarks?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load bookmarks");
};

// user action: get user profile
export const getUserProfile = async (email) => {
  const res = await fetch(
    `${API_URL}/api/users/profile?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load user profile");
};

// user action: update user profile
export const updateUserProfile = async (email, profileData) => {
  const res = await fetch(
    `${API_URL}/api/users/profile?email=${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  return readJson(res, "failed to update profile");
};