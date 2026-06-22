const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

export const getAdminOverview = async (adminEmail) => {
  const res = await fetch(
    `${API_URL}/api/admin/overview?email=${encodeURIComponent(adminEmail)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load admin overview");
};

export const getAdminUsers = async (adminEmail) => {
  const res = await fetch(
    `${API_URL}/api/admin/users?email=${encodeURIComponent(adminEmail)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load users");
};

export const updateAdminUserRole = async (userId, adminEmail, role) => {
  const res = await fetch(
    `${API_URL}/api/admin/users/${userId}/role?email=${encodeURIComponent(
      adminEmail
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    }
  );

  return readJson(res, "failed to update user role");
};

export const deleteAdminUser = async (userId, adminEmail) => {
  const res = await fetch(
    `${API_URL}/api/admin/users/${userId}?email=${encodeURIComponent(
      adminEmail
    )}`,
    {
      method: "DELETE",
    }
  );

  return readJson(res, "failed to delete user");
};

export const getAdminEbooks = async (adminEmail) => {
  const res = await fetch(
    `${API_URL}/api/admin/ebooks?email=${encodeURIComponent(adminEmail)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load ebooks");
};

export const updateAdminEbookStatus = async (ebookId, adminEmail, status) => {
  const res = await fetch(
    `${API_URL}/api/admin/ebooks/${ebookId}/status?email=${encodeURIComponent(
      adminEmail
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  return readJson(res, "failed to update ebook status");
};

export const deleteAdminEbook = async (ebookId, adminEmail) => {
  const res = await fetch(
    `${API_URL}/api/admin/ebooks/${ebookId}?email=${encodeURIComponent(
      adminEmail
    )}`,
    {
      method: "DELETE",
    }
  );

  return readJson(res, "failed to delete ebook");
};

export const getAdminTransactions = async (adminEmail) => {
  const res = await fetch(
    `${API_URL}/api/admin/transactions?email=${encodeURIComponent(adminEmail)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load transactions");
};

export const getAdminAnalytics = async (adminEmail) => {
  const res = await fetch(
    `${API_URL}/api/admin/analytics?email=${encodeURIComponent(adminEmail)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load analytics");
};