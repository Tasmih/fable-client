import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// normal server fetch
// use this for public api
export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);

  return handleStatusCode(res);
};

// protected server fetch
// jwt is not active now, so this works like normal fetch
// later we can add authorization header here
export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);

  return handleStatusCode(res);
};

// server mutation
// use this for post, put, patch, delete api
// jwt is not active now, so no token is sent
export const serverMutation = async (path, data, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleStatusCode(res);
};

// handle status code
// redirect user if unauthorized or forbidden
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