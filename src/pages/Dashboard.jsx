import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import {
  Users as UsersIcon,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Plus,
  RefreshCw,
} from "lucide-react";

// StatCard yang lebih interaktif dengan desain modern
function StatCard({ label, value, icon: Icon, accent = "indigo", to }) {
  const ring = {
    indigo: "ring-indigo-400/50 dark:ring-indigo-900/50",
    emerald: "ring-emerald-400/50 dark:ring-emerald-900/50",
    amber: "ring-amber-400/50 dark:ring-amber-900/50",
  }[accent];

  const text = {
    indigo: "text-indigo-600 dark:text-indigo-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    amber: "text-amber-600 dark:text-amber-400",
  }[accent];

  const CardInner = (
    <div className={`card p-6 ring-1 ${ring} rounded-3xl shadow-xl hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center gap-5">
        <div
          className={`h-16 w-16 rounded-full grid place-items-center bg-gradient-to-br from-indigo-300 to-indigo-400 ${text}`}
        >
          <Icon size={36} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
          <div className={`text-4xl font-bold leading-tight ${text}`}>
            <motion.span
              key={value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {value}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      whileHover={{ y: -7 }}
      transition={{ type: "spring", stiffness: 250, damping: 25 }}
    >
      {to ? (
        <Link
          to={to}
          aria-label={`Lihat ${label}`}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl"
        >
          {CardInner}
        </Link>
      ) : (
        CardInner
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, courses: 0, students: 0 });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const studentsCountForCourse = (course) => {
    const byArray = Array.isArray(course?.students)
      ? course.students.length
      : 0;
    const byCounter =
      Number(course?.students_count ?? course?.enrollments_count ?? 0) || 0;
    return byArray || byCounter;
  };

  const fetchAll = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const [usersRes, coursesRes] = await Promise.all([api.get("/users"), api.get("/courses")]);

      const toArray = (val) => (Array.isArray(val) ? val : val?.items ?? []);
      const usersRaw = usersRes?.data?.data?.users ?? usersRes?.data?.data ?? [];
      const users = toArray(usersRaw);
      const coursesRaw = coursesRes?.data?.data?.courses ?? coursesRes?.data?.data ?? [];
      const coursesList = toArray(coursesRaw);

      const totalStudents = coursesList.reduce(
        (acc, c) => acc + studentsCountForCourse(c),
        0
      );

      setStats({
        users: users.length,
        courses: coursesList.length,
        students: totalStudents,
      });
      setCourses(coursesList);
    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setErrMsg("Gagal memuat data dashboard.");
      setStats({ users: 0, courses: 0, students: 0 });
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const recentCourses = useMemo(() => {
    const list = [...courses];
    list.sort((a, b) => {
      const da = new Date(a?.created_at ?? 0).getTime();
      const db = new Date(b?.created_at ?? 0).getTime();
      return db !== da ? db - da : (b?.id ?? 0) - (a?.id ?? 0);
    });
    return list.slice(0, 6);
  }, [courses]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5">
              <div className="h-5 w-24 rounded bg-slate-200 dark:bg-slate-700 mb-3 animate-pulse" />
              <div className="h-8 w-16 rounded bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="card p-5">
          <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-700 mb-4 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-200 p-8">
      <div className="flex flex-wrap lg:flex-nowrap gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 p-6 bg-white dark:bg-slate-800 shadow-xl rounded-3xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">Stats Overview</h2>
          <div className="space-y-6">
            <StatCard
              label="Total Users"
              value={stats.users}
              icon={UsersIcon}
              accent="indigo"
              to="/users"
            />
            <StatCard
              label="Total Courses"
              value={stats.courses}
              icon={BookOpen}
              accent="emerald"
              to="/courses"
            />
            <StatCard
              label="Total Students"
              value={stats.students}
              icon={GraduationCap}
              accent="amber"
              to="/courses?tab=students"
            />
          </div>
        </div>

        {/* Konten Utama */}
        <div className="w-full lg:w-3/4 p-6 bg-white dark:bg-slate-900 shadow-xl rounded-3xl">
          <div className="flex justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">Dashboard Overview</h1>
            <div className="flex gap-4">
              <button onClick={fetchAll} className="btn-ghost bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-3" title="Refresh">
                <RefreshCw size={16} className="mr-2" /> Refresh
              </button>
              <Link to="/courses/new" className="btn bg-indigo-600 text-white rounded-lg p-3" title="Buat Course">
                <Plus size={16} className="mr-2" /> Buat Course
              </Link>
            </div>
          </div>

          {/* Error banner */}
          {errMsg && (
            <div className="card p-4 border-red-200/70 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300">
              {errMsg}
            </div>
          )}

          {/* Recent courses */}
          <section className="card p-5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Courses</h2>
              <Link to="/courses" className="btn-ghost text-indigo-600 dark:text-indigo-400 font-medium">
                Lihat semua <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            {recentCourses.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">Belum ada course.</p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentCourses.map((c) => (
                  <li
                    key={c.id}
                    className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 hover:shadow-2xl transition-all duration-300 ease-in-out"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-slate-900 dark:text-slate-100 truncate">{c.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {c.category ?? "General"} • {studentsCountForCourse(c)} siswa
                        </div>
                      </div>
                      <Link
                        to={`/courses/${c.id}`}
                        className="shrink-0 inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium"
                        title="Detail"
                      >
                        Detail{" "}
                        <ArrowRight
                          size={16}
                          className="ml-1 transition group-hover:translate-x-0.5"
                        />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
