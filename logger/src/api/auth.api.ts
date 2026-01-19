const BASE_URL = "http://192.168.0.117:5000/api/v1"; 
// change to localhost or IP if needed

export const loginApi = async (email: string, password: string) => {
  console.log({email, password});
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }
  return res.json();
};

export const registerApi = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  return res.json();
};
