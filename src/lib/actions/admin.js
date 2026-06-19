// lib/action/admin.js
// note: all comments are kept in small letters as requested

// action: fetch summary analytics cards data
export const loadAnalyticsAction = async () => {
  try {
    const res = await fetch("NEXT_PUBLIC_API_URL/api/admin/analytics-overview");
    if (!res.ok) throw new Error("failed to fetch analytics");
    return await res.json();
  } catch (error) {
    console.error("action error:", error);
    return null;
  }
};

// action: fetch all users for management
export const loadUsersAction = async () => {
  try {
    const res = await fetch("NEXT_PUBLIC_API_URL/api/users");
    if (!res.ok) throw new Error("failed to fetch users");
    return await res.json();
  } catch (error) {
    console.error("action error:", error);
    return [];
  }
};

// action: fetch all ebooks safely matching backend response format
export const loadEbooksAction = async () => {
  try {
    const res = await fetch("NEXT_PUBLIC_API_URL/api/ebooks");
    if (!res.ok) throw new Error("failed to fetch ebooks");
    const data = await res.json();
    
    // handle backend object wrapping { total, ebooks } safely
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

// action: change user role in database
export const changeUserRoleAction = async (userId, newRole) => {
  const res = await fetch(`NEXT_PUBLIC_API_URL/api/admin/users/role/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole })
  });
  return res.ok;
};

// action: toggle ebook availability status
export const toggleEbookStatusAction = async (ebookId, currentStatus) => {
  const nextStatus = currentStatus === "Available" ? "Unpublished" : "Available";
  const res = await fetch(`NEXT_PUBLIC_API_URL/api/ebooks/status/${ebookId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: nextStatus })
  });
  return { ok: res.ok, nextStatus };
};

// action: delete ebook from cluster directory
export const deleteEbookAction = async (ebookId) => {
  const res = await fetch(`NEXT_PUBLIC_API_URL/api/ebooks/${ebookId}`, {
    method: "DELETE"
  });
  return res.ok;
};