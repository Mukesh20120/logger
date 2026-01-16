// utils/fetchWithAuth.ts
import { refreshAccessToken } from "./auth";

interface FetchWithAuthOptions extends RequestInit {
  retry?: boolean;
}

export async function fetchWithAuth(
  url: string,
  options: FetchWithAuthOptions = {}
): Promise<Response> {
  const accessToken = localStorage.getItem("accessToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
      "Content-Type": "application/json",
    },
    credentials: "include", // 🔴 needed for refresh cookie
  });

  // ✅ If token expired, try refresh ONCE
  if (res.status === 401 && options.retry !== false) {
    try {
      const newToken = await refreshAccessToken();

      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch {
      // 🔒 Refresh failed → logout
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
      throw new Error("Session expired");
    }
  }

  return res;
}
