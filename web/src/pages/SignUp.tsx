import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";

interface SignupForm {
  userName: string;
  email: string;
  password: string;
}

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupForm>({
    userName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: { message?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-gray-900 text-amber-50 p-6 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create Account
        </h1>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        <label className="block mb-3">
          <span className="text-sm text-gray-400">Username</span>
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
            required
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-gray-400">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-gray-400">Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-500"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition py-2 rounded font-medium disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-gray-400 text-sm mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
