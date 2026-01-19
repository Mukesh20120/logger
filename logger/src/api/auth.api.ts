
export const loginApi = async (email: string, password: string, BASE_URL: string | undefined) => {
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

export const registerApi = async (email: string, password: string, BASE_URL: string | undefined) => {
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
