// src/pages/CourseDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import {
  joinCourse,
  leaveCourse,
  rateCourse,
  deleteCourse,
  setContentStatus,
  deleteContent,
} from "../services/courseApi";

const BASE = "/dashboard";

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // rating
  const [ratings, setRatings] = useState(5);
  const [comment, setComment] = useState("");

  // status join yang kita “pegang” sendiri, supaya tidak turun lagi saat refetch
  const [joined, setJoined] = useState(false);

  // berbagai kemungkinan nama field dari API untuk status join
  const deriveJoined = (c) =>
    Boolean(
      c?.my_status_student ??
        c?.my_status_join ??
        c?.is_joined ??
        c?.joined ??
        c?.me_is_student ??
        c?.student_of
    );

  const fetchCourse = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await api.get(`/courses/${id}`);
      const c = res?.data?.data?.course ?? res?.data?.data ?? null;
      setCourse(c);
      // ❗ STICKY: jangan turunkan true → false hanya karena respons tidak menyertakan flag
      setJoined((prev) => {
        const dj = deriveJoined(c);
        return dj ? true : prev;
      });
    } catch (err) {
      if (err?.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
      setErrMsg("Gagal memuat data course.");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <p className="muted p-6">Memuat data course…</p>;
  if (errMsg) return <p className="p-6 text-red-600 dark:text-red-400">{errMsg}</p>;
  if (!course) return <p className="muted p-6">Course tidak ditemukan.</p>;

  // Gunakan gabungan: state lokal ATAU flag dari server
  const isJoined = joined || deriveJoined(course);

  // actions
  const doJoin = async () => {
    try {
      const out = await joinCourse(id);
      // Optimistic UI
      setJoined(true);
      setCourse((prev) => (prev ? { ...prev, my_status_student: true } : prev));
      alert(out?.message ?? "Berhasil bergabung.");
      // Sinkronkan data lain; joined tidak akan turun karena sticky logic
      await fetchCourse();
    } catch (e) {
      setJoined(false);
      alert(e?.response?.data?.message ?? "Gagal bergabung.");
    }
  };

  const doLeave = async () => {
    if (!confirm("Keluar dari kursus ini?")) return;
    try {
      const out = await leaveCourse(id);
      setJoined(false);
      setCourse((prev) => (prev ? { ...prev, my_status_student: false } : prev));
      alert(out?.message ?? "Berhasil keluar.");
      await fetchCourse();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal keluar.");
    }
  };

  const doRate = async (e) => {
    e.preventDefault();
    try {
      const out = await rateCourse(id, { ratings, comment });
      alert(out?.message ?? "Rating terkirim.");
      setComment("");
      await fetchCourse();
    } catch (e) {
      const msg =
        e?.response?.data?.message ??
        (e?.response?.status === 403
          ? "Tidak boleh memberi rating: pastikan kamu sudah bergabung di course ini."
          : "Gagal mengirim rating.");
      alert(msg);
    }
  };

  const doDeleteCourse = async () => {
    if (!confirm("Hapus course ini? Tindakan tidak dapat dibatalkan.")) return;
    try {
      const out = await deleteCourse(id);
      alert(out?.message ?? "Course dihapus.");
      navigate(`${BASE}/courses`, { replace: true });
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal menghapus course.");
    }
  };

  const toggleContentStatus = async (content) => {
    try {
      const next = content?.my_status_finished ? 0 : 1;
      const out = await setContentStatus(content.id, next);
      alert(out?.message ?? "Status diperbarui.");
      await fetchCourse();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal mengubah status.");
    }
  };

  const doDeleteContent = async (contentId) => {
    if (!confirm("Hapus konten ini?")) return;
    try {
      const out = await deleteContent(contentId);
      alert(out?.message ?? "Konten dihapus.");
      await fetchCourse();
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal menghapus konten.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="text-sm">
        <Link
          to={`${BASE}/courses`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Courses
        </Link>
        <span className="mx-1">/</span>
        <span className="text-slate-500 dark:text-slate-400">{course.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {course.title}
          </h1>
          <p className="muted">Author: {course?.author?.name ?? "-"}</p>

          {/* Progress & Rating Summary */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            {typeof course.my_percentage_finished === "number" ? (
              <div className="flex items-center gap-2">
                <span className="muted">Progress:</span>
                <div className="w-40 h-2 bg-slate-200 dark:bg-slate-700 rounded overflow-hidden">
                  <div
                    className="h-2 bg-blue-600 transition-[width] duration-300"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(100, course.my_percentage_finished)
                      )}%`,
                    }}
                    aria-label="progress"
                    role="progressbar"
                    aria-valuenow={Math.round(course.my_percentage_finished)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <span className="muted">
                  {Math.round(course.my_percentage_finished)}%
                </span>
              </div>
            ) : null}

            {typeof course.avg_ratings !== "undefined" ? (
              <div className="muted">
                Rata-rata rating: <b>{Number(course.avg_ratings).toFixed(1)}</b> / 5
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={`${BASE}/courses/${id}/edit`} className="btn-ghost">
            Edit
          </Link>
          <button type="button" onClick={doDeleteCourse} className="btn-ghost">
            Hapus
          </button>
          {isJoined ? (
            <button type="button" onClick={doLeave} className="btn">
              Keluar
            </button>
          ) : (
            <button type="button" onClick={doJoin} className="btn">
              Gabung
            </button>
          )}
        </div>
      </div>

      {/* Deskripsi */}
      <div className="card p-5">
        <p className="text-slate-800 dark:text-slate-200">
          {course.description || "Tidak ada deskripsi."}
        </p>
      </div>

      {/* Ulasan */}
      {Array.isArray(course?.ratings) && course.ratings.length > 0 ? (
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold">Ulasan Peserta</h2>
          <div className="muted text-sm">
            Rata-rata: <b>{Number(course?.avg_ratings ?? 0).toFixed(1)}</b> dari{" "}
            {course.ratings.length} ulasan
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {course.ratings.slice(0, 10).map((r, idx) => (
              <li key={idx} className="py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {r?.name ?? r?.user?.name ?? "Pengguna"}
                    </div>
                    {r?.comment ? (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {r.comment}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-sm font-semibold">
                    ⭐ {r?.ratings ?? r?.rating ?? "-"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Form beri rating */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold">Beri Rating</h2>
        {!isJoined ? (
          <div className="rounded-lg p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm">
            Kamu harus <b>bergabung</b> ke course ini sebelum bisa memberi rating.
            <button type="button" onClick={doJoin} className="btn-ghost ml-2">
              Gabung sekarang
            </button>
          </div>
        ) : (
          <form onSubmit={doRate} className="flex items-center gap-3">
            <label className="text-sm">Nilai (1–5)</label>
            <input
              type="number"
              min={1}
              max={5}
              value={ratings}
              onChange={(e) => setRatings(Number(e.target.value))}
              className="input w-24"
            />
            <input
              type="text"
              placeholder="Komentar (opsional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input flex-1"
            />
            <button className="btn" type="submit">
              Kirim
            </button>
          </form>
        )}
      </div>

      {/* Konten */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Daftar Konten</h2>
          <Link to={`${BASE}/courses/${id}/contents/new`} className="btn">
            Tambah Konten
          </Link>
        </div>

        {Array.isArray(course?.contents) && course.contents.length > 0 ? (
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {course.contents.map((ct) => (
              <li key={ct.id} className="py-3 flex items-start justify-between">
                <div>
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {ct.title}
                  </div>
                  {ct.youtube ? (
                    <div className="muted text-xs">{ct.youtube}</div>
                  ) : null}
                  <div className="mt-1 text-xs">
                    Status: <b>{ct.my_status_finished ? "Selesai" : "Belum"}</b>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleContentStatus(ct)}
                    className="btn-ghost"
                  >
                    {ct.my_status_finished ? "Tandai Belum" : "Tandai Selesai"}
                  </button>
                  <Link
                    to={`${BASE}/courses/${id}/contents/${ct.id}/edit`}
                    className="btn-ghost"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => doDeleteContent(ct.id)}
                    className="btn-ghost"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">Belum ada konten.</p>
        )}
      </div>
    </div>
  );
}

