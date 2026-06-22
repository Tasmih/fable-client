import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const authHeader = async () => {
  const token = await getUserToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });

  return handleStatusCode(res);
};

export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: await authHeader(),
  });

  return handleStatusCode(res);
};

export const serverMutation = async (path, data = null, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: data ? JSON.stringify(data) : null,
  });

  return handleStatusCode(res);
};

const handleStatusCode = async (res) => {
  if (res.status === 401) {
    redirect("/unauthorized");
  }

  if (res.status === 403) {
    redirect("/forbidden");
  }

  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("server returned an invalid response");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "something went wrong");
  }

  return data;
};