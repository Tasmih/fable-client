const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const readJson = async (res, fallbackMessage) => {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || fallbackMessage);
  }

  return data;
};

// writer action: get overview
export const getWriterOverview = async (email) => {
  const res = await fetch(
    `${API_URL}/api/writer/overview?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load writer overview");
};

// writer action: get own ebooks
export const getWriterEbooks = async (email) => {
  const res = await fetch(
    `${API_URL}/api/writer/ebooks?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load writer ebooks");
};

// writer action: get single ebook
export const getWriterEbookById = async (id, email) => {
  const res = await fetch(
    `${API_URL}/api/writer/ebooks/${id}?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load ebook");
};

// writer action: add ebook
export const createWriterEbook = async (ebookData) => {
  const res = await fetch(`${API_URL}/api/writer/ebooks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ebookData),
  });

  return readJson(res, "failed to add ebook");
};

// writer action: update ebook
export const updateWriterEbook = async (id, email, ebookData) => {
  const res = await fetch(
    `${API_URL}/api/writer/ebooks/${id}?email=${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ebookData),
    }
  );

  return readJson(res, "failed to update ebook");
};

// writer action: update ebook status
export const updateWriterEbookStatus = async (id, email, status) => {
  const res = await fetch(
    `${API_URL}/api/writer/ebooks/${id}/status?email=${encodeURIComponent(
      email
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

// writer action: delete ebook
export const deleteWriterEbook = async (id, email) => {
  const res = await fetch(
    `${API_URL}/api/writer/ebooks/${id}?email=${encodeURIComponent(email)}`,
    {
      method: "DELETE",
    }
  );

  return readJson(res, "failed to delete ebook");
};

// writer action: get sales history
export const getWriterSalesHistory = async (email) => {
  const res = await fetch(
    `${API_URL}/api/writer/sales-history?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to load sales history");
};

// writer action: create verification checkout
export const createWriterVerificationCheckout = async (email) => {
  const res = await fetch(`${API_URL}/api/writer/verification/create-checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return readJson(res, "failed to create writer verification payment");
};

// writer action: verify writer payment
export const verifyWriterPayment = async (sessionId) => {
  const res = await fetch(
    `${API_URL}/api/writer/verification/success?session_id=${encodeURIComponent(
      sessionId
    )}`,
    { cache: "no-store" }
  );

  return readJson(res, "failed to verify writer payment");
};