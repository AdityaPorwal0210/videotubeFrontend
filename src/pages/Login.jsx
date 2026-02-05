import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isEmail = identifier.includes("@");
      const payload = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await axiosClient.post("/users/login", payload);
      const data = res.data?.data;

      if (!data?.user || !data?.accessToken) {
        throw new Error("Invalid login response");
      }

      login(data.user, data.accessToken);
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed, please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-6 shadow-2xl ring-1 ring-slate-600">
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Sign in to continue watching, liking, and managing your videos.
        </p>

        {error && (
          <div className="mt-3 rounded-lg border border-red-500 bg-red-600/20 px-3 py-2 text-xs text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-100">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
              placeholder="golu or golu@gmail.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-100">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-1 ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-violet-500 py-2 text-sm font-semibold text-white shadow-md hover:bg-violet-400 hover:shadow-lg disabled:opacity-60 transition"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-300">
          Don’t have an account yet?{" "}
          <span className="cursor-pointer text-violet-300 hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
