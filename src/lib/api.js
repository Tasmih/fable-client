const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// core fetch helpers

// public fetch
export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });

  return handleStatusCode(res);
};

// protected fetch
export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
  });

  return handleStatusCode(res);
};

// mutation
export const serverMutation = async (path, data = null, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null,
  });

  return handleStatusCode(res);
};

// status handler
const handleStatusCode = async (res) => {
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

// bookmark system

// add bookmark
export const addBookmark = async (ebookId, email) => {
  return serverMutation(
    `/api/users/bookmark/${ebookId}?email=${encodeURIComponent(email)}`,
    null,
    "POST"
  );
};

// remove bookmark
export const removeBookmark = async (ebookId, email) => {
  return serverMutation(
    `/api/users/bookmark/${ebookId}?email=${encodeURIComponent(email)}`,
    null,
    "DELETE"
  );
};

// toggle bookmark
export const toggleBookmark = async (ebookId, email, method) => {
  return serverMutation(
    `/api/users/bookmark/${ebookId}?email=${encodeURIComponent(email)}`,
    null,
    method
  );
};

// get bookmarks
export const getBookmarks = async (email) => {
  const res = await fetch(
    `${baseUrl}/api/users/bookmarks?email=${encodeURIComponent(email)}`,
    {
      cache: "no-store",
    }
  );

  return handleStatusCode(res);
};