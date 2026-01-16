// utils/auth.ts
export async function refreshAccessToken(): Promise<string> {
  const res = await fetch("http://localhost:5000/api/v1/auth/refresh", {
    method: "POST",
    credentials: "include", // 🔴 REQUIRED to send cookie
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok || !data?.accessToken) {
    throw new Error("Session expired");
  }

  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}
