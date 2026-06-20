// lib/action/admin.js

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const loadAnalyticsAction = async () => {
  try {
    const res = await fetch(`${API_URL}/api/admin/analytics-overview`);
    if (!res.ok) throw new Error("failed to fetch analytics");
    return await res.json();
  } catch (error) {
    console.error("action error:", error);
    return null;
  }
};

export const loadUsersAction = async () => {
  try {
    const res = await fetch(`${API_URL}/api/users`);
    if (!res.ok) throw new Error("failed to fetch users");
    return await res.json();
  } catch (error) {
    console.error("action error:", error);
    return [];
  }
};

export const loadEbooksAction = async () => {
  try {
    const res = await fetch(`${API_URL}/api/ebooks`);
    if (!res.ok) throw new Error("failed to fetch ebooks");
    const data = await res.json();
    if (data && Array.isArray(data.ebooks)) {
      return data.ebooks;
    } else if (Array.isArray(data)) {
      return data;
    }
    return [];
  } catch (error) {
    console.error("action error:", error);
    return [];
  }
};

export const changeUserRoleAction = async (userId, newRole) => {
  const res = await fetch(`${API_URL}/api/admin/users/role/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole })
  });
  return res.ok;
};

export const toggleEbookStatusAction = async (ebookId, currentStatus) => {
  const nextStatus = currentStatus === "Available" ? "Unpublished" : "Available";
  const res = await fetch(`${API_URL}/api/ebooks/status/${ebookId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: nextStatus })
  });
  return { ok: res.ok, nextStatus };
};

export const deleteEbookAction = async (ebookId) => {
  const res = await fetch(`${API_URL}/api/ebooks/${ebookId}`, {
    method: "DELETE"
  });
  return res.ok;
};