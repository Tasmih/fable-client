

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// create new ebook
// this function sends ebook data to backend
export const createEbook = async (ebookData) => {
  const res = await fetch(`${API_URL}/api/ebooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ebookData),
  });

  const contentType = res.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("server returned an invalid response");
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to create ebook");
  }

  return data;
};

// get all ebooks for browse page
// this function supports search, filter, sort and pagination
export const getEbooks = async (queryString = "") => {
  const res = await fetch(`${API_URL}/api/ebooks?${queryString}`);

  if (!res.ok) {
    throw new Error("failed to load ebooks");
  }

  return res.json();
};

// get single ebook details
export const getEbookById = async (id, email = "") => {
  const url = email
    ? `${API_URL}/api/ebooks/${id}?email=${encodeURIComponent(email)}`
    : `${API_URL}/api/ebooks/${id}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("failed to load ebook");
  }

  return res.json();
};

// get writer own ebooks
export const getMyEbooks = async (email) => {
  const res = await fetch(`${API_URL}/api/ebooks/my-ebooks?email=${email}`);

  if (!res.ok) {
    throw new Error("failed to load my ebooks");
  }

  return res.json();
};

// delete ebook
export const deleteEbook = async (id) => {
  const res = await fetch(`${API_URL}/api/ebooks/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("failed to delete ebook");
  }

  return res.json();
};

// publish or unpublish ebook
export const toggleEbookStatus = async (id) => {
  const res = await fetch(`${API_URL}/api/ebooks/${id}/toggle-status`, {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error("failed to update ebook status");
  }

  return res.json();
};


// create stripe checkout session
// this function sends ebook id and user email to backend
export const createCheckoutSession = async ({ ebookId, userEmail }) => {
  const res = await fetch(`${API_URL}/api/payment/create-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ebookId, userEmail }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to create checkout session");
  }

  return data;
};

// add ebook to bookmark
export const addBookmark = async (ebookId, email) => {
  const res = await fetch(
    `${API_URL}/api/users/bookmark/${ebookId}?email=${encodeURIComponent(email)}`,
    {
      method: "POST",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to bookmark ebook");
  }

  return data;
};

// remove ebook from bookmark
export const removeBookmark = async (ebookId, email) => {
  const res = await fetch(
    `${API_URL}/api/users/bookmark/${ebookId}?email=${encodeURIComponent(email)}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to remove bookmark");
  }

  return data;
};