import { getSessionToken } from "@/lib/session-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

// get auth header from better auth session token
const getAuthHeaders = async () => {
  const token = await getSessionToken();

  return {
    Authorization: `Bearer ${token}`,
  };
};

// get json header with auth token
const getJsonHeaders = async () => {
  const token = await getSessionToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// admin overview
export const getAdminOverview = async () => {
  const res = await fetch(`${API_URL}/api/admin/overview`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  return readJson(res, "failed to load admin overview");
};

// admin users
export const getAdminUsers = async () => {
  const res = await fetch(`${API_URL}/api/admin/users`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  return readJson(res, "failed to load users");
};

// admin update user role
export const updateAdminUserRole = async (
  userId,
  adminEmailOrRole,
  roleValue
) => {
  const role = roleValue || adminEmailOrRole;

  const res = await fetch(`${API_URL}/api/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: await getJsonHeaders(),
    body: JSON.stringify({ role }),
  });

  return readJson(res, "failed to update user role");
};

// admin delete user
export const deleteAdminUser = async (userId) => {
  const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  return readJson(res, "failed to delete user");
};

// admin ebooks
export const getAdminEbooks = async () => {
  const res = await fetch(`${API_URL}/api/admin/ebooks`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  return readJson(res, "failed to load ebooks");
};

// admin update ebook status
export const updateAdminEbookStatus = async (
  ebookId,
  adminEmailOrStatus,
  statusValue
) => {
  const status = statusValue || adminEmailOrStatus;

  const res = await fetch(`${API_URL}/api/admin/ebooks/${ebookId}/status`, {
    method: "PATCH",
    headers: await getJsonHeaders(),
    body: JSON.stringify({ status }),
  });

  return readJson(res, "failed to update ebook status");
};

// admin delete ebook
export const deleteAdminEbook = async (ebookId) => {
  const res = await fetch(`${API_URL}/api/admin/ebooks/${ebookId}`, {
    method: "DELETE",
    headers: await getAuthHeaders(),
  });

  return readJson(res, "failed to delete ebook");
};

// admin transactions
export const getAdminTransactions = async () => {
  const res = await fetch(`${API_URL}/api/admin/transactions`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  return readJson(res, "failed to load transactions");
};

// admin analytics
export const getAdminAnalytics = async () => {
  const res = await fetch(`${API_URL}/api/admin/analytics`, {
    cache: "no-store",
    headers: await getAuthHeaders(),
  });

  return readJson(res, "failed to load analytics");
};