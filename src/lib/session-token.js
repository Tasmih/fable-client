export const getSessionToken = async () => {
  const res = await fetch("/api/session-token", {
    method: "GET",
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);
   console.log("session token response:", {
    hasToken: Boolean(data?.token),
    tokenLength: data?.token?.length,
    user: data?.user,
    status: res.status,
  });
  

  if (!res.ok) {
    throw new Error(data?.message || "failed to get session token");
  }

  return data.token;
};