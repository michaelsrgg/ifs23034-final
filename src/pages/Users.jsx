import React, { useEffect, useState, useMemo } from "react";
import api from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Menyimpan urutan (ascending / descending)

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      const list = res?.data?.data?.users ?? [];
      setUsers(Array.isArray(list) ? list : list?.items ?? []);
    } catch (err) {
      console.error("Gagal memuat users:", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Urutkan berdasarkan nama pengguna sebelum menampilkan
  const sortedUsers = useMemo(() => {
    // Urutkan berdasarkan nama (ascending atau descending)
    return [...users].sort((a, b) => {
      const nameA = a?.name?.toLowerCase() || "";
      const nameB = b?.name?.toLowerCase() || "";

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB); // Ascending (A-Z)
      } else {
        return nameB.localeCompare(nameA); // Descending (Z-A)
      }
    });
  }, [users, sortOrder]);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    if (!kw) return sortedUsers;
    return sortedUsers.filter(
      (u) =>
        (u?.name ?? "").toLowerCase().includes(kw) ||
        (u?.email ?? "").toLowerCase().includes(kw)
    );
  }, [sortedUsers, search]);

  const initials = (name = "", email = "") => {
    const base = name || email || "?";
    return base
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("");
  };

  const prettyDate = (val) => {
    if (!val) return "-";
    const t = new Date(val);
    return isNaN(t.getTime()) ? "-" : t.toLocaleDateString();
  };

  return (
    <div className="min-h-screen">
      {/* Hero / Header glass */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-500 p-[1px]">
        <div className="relative rounded-2xl bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-50">
                Daftar Users
              </h1>
              <p className="text-sm text-slate-600/90 dark:text-slate-300 mt-1">
                Kelola & telusuri pengguna pada platform.
              </p>
            </div>

            {/* Search box */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {/* search icon */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M11 19a8 8 0 1 1 5.292-13.999A8 8 0 0 1 11 19Z" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari nama atau email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-72 md:w-80 pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-500 transition"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white"
                    aria-label="Bersihkan pencarian"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {/* Desktop: table; Mobile: card list */}
        <div className="hidden md:block rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-lg">
          <div className="max-h-[70vh] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-white/80 dark:bg-slate-900/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-slate-200/70 dark:border-slate-800">
                  <th className="px-5 py-3 text-left text-slate-600 dark:text-slate-300 font-semibold">
                    User
                  </th>
                  <th className="px-5 py-3 text-left text-slate-600 dark:text-slate-300 font-semibold">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-slate-600 dark:text-slate-300 font-semibold">
                    Dibuat
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-6 text-center text-slate-400">
                      Tidak ada user ditemukan.
                    </td>
                  </tr>
                ) : (
                  filtered.map((u, i) => (
                    <tr
                      key={u.id ?? i}
                      className="group transition-colors even:bg-slate-50/60 dark:even:bg-slate-800/30 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 h-9 w-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white grid place-items-center font-semibold shadow-sm">
                            {initials(u?.name, u?.email)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-medium text-slate-800 dark:text-slate-100">
                              {u?.name || "-"}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              ID: {u?.id ?? "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-300">
                        {u?.email || "-"}
                      </td>
                      <td className="px-5 py-3 text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80"></span>
                          {prettyDate(u?.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow">
              <p className="text-slate-600 dark:text-slate-300">
                Tidak ada user ditemukan.
              </p>
            </div>
          ) : (
            filtered.map((u, i) => (
              <div
                key={u.id ?? i}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white grid place-items-center font-semibold">
                    {initials(u?.name, u?.email)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800 dark:text-slate-100">
                      {u?.name || "-"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {u?.email || "-"}
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Dibuat: {prettyDate(u?.created_at)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
