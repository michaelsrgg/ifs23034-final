// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError("Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url("/bg2.png")', // Ganti dengan gambar latar yang Anda inginkan
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white text-gray-800 p-10 rounded-xl shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <img src="/image.png" alt="logo" className="w-16 h-16" />
        </div>
        <h1 className="text-3xl font-semibold text-center mb-4">Create a New Account</h1>
        <p className="text-center text-sm mb-6 text-gray-600">Get started by creating an account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Your Full Name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="you@email.com"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="********"
            />
          </div>

          {error && <p className="text-red-600 text-center text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
