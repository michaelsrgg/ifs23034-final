// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "https://open-api.delcom.org/api/v1",
});

// Selalu ambil token terbaru & normalisasi "Bearer ..."
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("token");
  if (raw) {
    const header = raw.startsWith("Bearer ") ? raw : `Bearer ${raw}`;
    config.headers.Authorization = header;
  }
  return config;
});

// Opsional: kalau 401, hapus token (agar ProtectedRoute akan mengarahkan ke /login saat render berikutnya)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(err);
  }
);

export default api;
