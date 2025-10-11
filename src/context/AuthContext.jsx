// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext, useMemo } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // hydrate status

  // Hydrate saat awal load
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await api.get("/users/me");
        const u = me?.data?.data?.user ?? me?.data?.data ?? me?.data?.user;
        if (u) {
          setUser(u);
          localStorage.setItem("user", JSON.stringify(u));
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const saveToken = (t) => {
    const normalized = t?.startsWith("Bearer ") ? t : `Bearer ${t}`;
    localStorage.setItem("token", normalized);
  };

  // Login: kembalikan true bila sukses; biar komponen yang memutuskan mau navigate kmn
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const data = res?.data?.data ?? res?.data;
    const token =
      data?.token ??
      data?.access_token ??
      data?.tokenValue ??
      data?.token_raw;

    if (!token) throw new Error("Token tidak ditemukan pada response login.");

    saveToken(token);

    const u = data?.user ?? null;
    if (u) {
      setUser(u);
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      try {
        const me = await api.get("/users/me");
        const mu = me?.data?.data?.user ?? me?.data?.data ?? me?.data?.user;
        if (mu) {
          setUser(mu);
          localStorage.setItem("user", JSON.stringify(mu));
        }
      } catch {}
    }
    return true;
  };

  const register = async (form) => {
    await api.post("/auth/register", {
      name: form.name,
      email: form.email,
      password: form.password,
    });
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, setUser }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      <div className="auth-container">
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
