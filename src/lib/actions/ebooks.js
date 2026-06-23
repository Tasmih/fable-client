const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


//CREATE EBOOK

export const createEbook = async (ebookData) => {
  const res = await fetch(`${API_URL}/api/ebooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ebookData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to create ebook");
  }

  return data;
};
// GET ALL EBOOKS

export const getEbooks = async (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all"
    ) {
      params.append(key, value);
    }
  });

  const query = params.toString() ? `?${params.toString()}` : "";

  const res = await fetch(`${API_URL}/api/ebooks${query}`, {
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load ebooks");
  }

  return data;
};

// GET SINGLE EBOOK

export const getEbookById = async (id, email = "") => {
  const query = email ? `?email=${encodeURIComponent(email)}` : "";

  const res = await fetch(`${API_URL}/api/ebooks/${id}${query}`, {
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Failed to load ebook details");
  }

  return data;
};

 // GET WRITER EBOOKS

export const getMyEbooks = async (email) => {
  const res = await fetch(
    `${API_URL}/api/ebooks/my-ebooks?email=${encodeURIComponent(email)}`
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to load my ebooks");
  }

  return data;
};

 //🗑 DELETE EBOOK

export const deleteEbook = async (id) => {
  const res = await fetch(`${API_URL}/api/ebooks/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to delete ebook");
  }

  return data;
};


// 🔄 TOGGLE STATUS

export const toggleEbookStatus = async (id) => {
  const res = await fetch(`${API_URL}/api/ebooks/${id}/toggle-status`, {
    method: "PATCH",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "failed to update ebook status");
  }

  return data;
};


// 💳 STRIPE CHECKOUT

export const createCheckoutSession = async ({
  ebookId,
  userEmail,
}) => {
  const res = await fetch(
    `${API_URL}/api/payment/create-checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ebookId, userEmail }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || "failed to create checkout session"
    );
  }

  return data;
};



// add ebook to bookmark
export const addBookmark = async (ebookId, email) => {
  const res = await fetch(
    `${API_URL}/api/users/bookmark/${ebookId}?email=${encodeURIComponent(email)}`,
    {
      method: "POST",
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "failed to bookmark ebook");
  }

  return data;
};

// remove ebook from bookmark
export const removeBookmark = async (ebookId, email) => {
  const res = await fetch(
    `${API_URL}/api/users/bookmark/${ebookId}?email=${encodeURIComponent(email)}`,
    {
      method: "DELETE",
      cache: "no-store",
    }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "failed to remove bookmark");
  }

  return data;
};