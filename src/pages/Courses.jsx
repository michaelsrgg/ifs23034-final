import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [mine, setMine] = useState(false); // filter: kursus saya saja

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const params = mine ? { is_me: 1 } : {};
      const res = await api.get("/courses", { params });

      const list = res?.data?.data?.courses ?? [];
      const normalized = Array.isArray(list) ? list : list?.items ?? [];
      setCourses(normalized);
    } catch (err) {
      console.error("Gagal mengambil data courses:", err);
      setError(err?.response?.data?.message ?? "Gagal memuat courses.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [mine]);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return courses;
    return courses.filter((c) => (c?.title ?? "").toLowerCase().includes(kw));
  }, [courses, search]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-7 w-56 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-10 w-64 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            <div className="h-10 w-28 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-4">
              <div className="h-24 rounded-lg bg-slate-200 dark:bg-slate-700 mb-3 animate-pulse" />
              <div className="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700 mb-2 animate-pulse" />
              <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-semibold text-gray-800 dark:text-gray-100">Daftar Courses</h1>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Cari course…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input w-72 p-4 rounded-full shadow-xl border focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button onClick={() => { setSearch(""); }} className="btn-ghost text-indigo-600 hover:text-indigo-800">
              Bersihkan
            </button>
          </div>

          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm muted select-none">
              <input
                type="checkbox"
                checked={mine}
                onChange={(e) => setMine(e.target.checked)}
                className="h-4 w-4"
              />
              Kursus saya
            </label>

            <button onClick={fetchCourses} className="btn-ghost p-3 rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all">
              Refresh
            </button>

            <Link to="/courses/new" className="btn rounded-xl text-white bg-green-600 hover:bg-green-700 p-3 transition-all">
              Buat Course
            </Link>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="card p-3 border-red-200/70 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={fetchCourses} className="btn-ghost">Coba lagi</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="muted mb-4 text-gray-600 dark:text-gray-400">
            {search
              ? "Tidak ada course yang cocok dengan pencarian."
              : mine
                ? "Kamu belum memiliki course."
                : "Tidak ada course ditemukan."}
          </p>
          <Link to="/courses/new" className="btn text-white bg-blue-600 hover:bg-blue-700 p-4 transition-all">
            Buat Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((course, idx) => (
            <motion.div
              key={course.id ?? course._id ?? course.slug ?? idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: Math.min(idx * 0.03, 0.3) }}
            >
              <CourseCard course={course} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
