import { redirect } from "next/navigation";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";



// CORE FETCH HELPERS


// public fetch
export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);
  return handleStatusCode(res);
};

// protected fetch (future JWT use)
export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`);
  return handleStatusCode(res);
};

// mutation (POST, PUT, PATCH, DELETE)
export const serverMutation = async (
  path,
  data = null,
  method = "POST"
) => {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null,
  });

  return handleStatusCode(res);
};



// STATUS HANDLER


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


// BOOKMARK SYSTEM (FIXED)


// ADD BOOKMARK
export const addBookmark = async (ebookId, email) => {
  return serverMutation(
    `/api/ebooks/${ebookId}/bookmark`,
    { email },
    "POST"
  );
};

// REMOVE BOOKMARK
export const removeBookmark = async (ebookId, email) => {
  return serverMutation(
    `/api/ebooks/${ebookId}/bookmark`,
    { email },
    "DELETE"
  );
};

// TOGGLE BOOKMARK (RECOMMENDED)
export const toggleBookmark = async (
  ebookId,
  email,
  method
) => {
  return serverMutation(
    `/api/ebooks/${ebookId}/bookmark`,
    { email },
    method
  );
};

// GET BOOKMARKS 
export const getBookmarks = async (email) => {
  const res = await fetch(
    `${baseUrl}/api/users/bookmarks?email=${email}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to load bookmarks");
  }

  return data;
};