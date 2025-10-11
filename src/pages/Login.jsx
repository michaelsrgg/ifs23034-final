// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Login gagal. Cek kembali email dan password kamu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("/bg.png")', // Ganti dengan path gambar yang Anda inginkan
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white text-gray-800 p-10 rounded-xl shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <img src="/img.png" alt="logo" className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-semibold text-center mb-4">Login to Your Account</h1>
        <p className="text-center text-sm mb-6 text-gray-600">Please enter your credentials</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="your@email.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="********"
            />
          </div>

          {error && (
            <p className="text-red-600 text-center text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
