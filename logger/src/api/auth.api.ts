
export const loginApi = async ({
  email,
  password,
  baseUrl,
}: {
  email: string;
  password: string;
  baseUrl: string;
}) => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Invalid credentials');
  }

  return data; // { accessToken }
};

export const registerApi = async ({
  userName,
  email,
  password,
  baseUrl,
}: {
  userName: string,
  email: string;
  password: string;
  baseUrl: string;
}) => {
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Registration failed');
  }

  return data;
};

