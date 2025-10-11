import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { joinCourse, leaveCourse, rateCourse, deleteCourse } from "../services/courseApi";

// Fungsi untuk menampilkan bintang berdasarkan rating
const renderStarRating = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className={`w-5 h-5 ${i <= rating ? "text-yellow-500" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 15l-5.17 2.73 1.32-6.18L0 6.24l6.26-.54L10 0l3.74 5.7L20 6.24l-5.15 5.31 1.32 6.18z"
        />
      </svg>
    );
  }
  return stars;
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // rating
  const [ratings, setRatings] = useState(5);
  const [comment, setComment] = useState("");

  // joined status (dikontrol sendiri + disinkronkan saat refetch)
  const [joined, setJoined] = useState(false);

  const fetchCourse = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await api.get(`/courses/${id}`);
      const c = res?.data?.data?.course ?? res?.data?.data ?? null;
      setCourse(c);
      setJoined(c?.my_status_student || false);  // Mengatur status bergabung
    } catch (err) {
      setErrMsg("Gagal memuat data course.");
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (loading) return <p className="muted p-6">Memuat data course…</p>;
  if (errMsg) return <p className="p-6 text-red-600 dark:text-red-400">{errMsg}</p>;
  if (!course) return <p className="muted p-6">Course tidak ditemukan.</p>;

  const doJoin = async () => {
    try {
      // Memanggil API untuk bergabung
      const out = await joinCourse(id);
      if (out?.success) {
        setJoined(true);  // Update status bergabung
        setCourse((prev) => ({ ...prev, my_status_student: true }));
        alert(out?.message ?? "Berhasil bergabung.");
        await fetchCourse();  // Refresh data kursus
      }
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal bergabung.");
    }
  };

  const doLeave = async () => {
    if (!confirm("Keluar dari kursus ini?")) return;
    try {
      const out = await leaveCourse(id);  // Keluar dari kursus
      if (out?.success) {
        setJoined(false);  // Update status keluar
        setCourse((prev) => ({ ...prev, my_status_student: false }));
        alert(out?.message ?? "Berhasil keluar.");
        await fetchCourse();  // Refresh data kursus
      }
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal keluar.");
    }
  };

  const doRate = async (e) => {
    e.preventDefault();
    if (!joined) {
      alert("Anda harus bergabung dengan kursus ini terlebih dahulu.");
      return;
    }
    try {
      const out = await rateCourse(id, { ratings, comment });
      alert(out?.message ?? "Rating terkirim.");
      setCourse((prev) => ({ ...prev, avg_rating: out?.averageRating }));
      setRatings(out?.averageRating); // Set rating setelah dikirim
      setComment(""); // reset comment
    } catch (e) {
      alert(e?.response?.data?.message ?? "Gagal mengirim rating.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {course.title}
          </h1>
          <p className="muted">Author: {course?.author?.name ?? "-"}</p>
        </div>

        <div className="flex gap-2">
          <Link to={`/courses/${id}/edit`} className="btn-ghost">
            Edit
          </Link>
          <button onClick={() => deleteCourse(id)} className="btn-ghost">
            Hapus
          </button>
          {joined ? (
            <button onClick={doLeave} className="btn">
              Keluar
            </button>
          ) : (
            <button onClick={doJoin} className="btn">
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

      {/* Rating */}
      <div className="card p-5 space-y-3">
        <h2 className="font-semibold">Rating</h2>
        <div className="flex items-center gap-2">
          {renderStarRating(course.avg_rating || 0)}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {course.avg_rating || 0} / 5
          </span>
        </div>
        {!joined ? (
          <div className="rounded-lg p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm">
            Kamu harus <b>bergabung</b> ke course ini sebelum bisa memberi rating.
            <button onClick={doJoin} className="btn-ghost ml-2">
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
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Contents</h2>
          <Link to={`/courses/${id}/contents/new`} className="btn">
            Tambah Konten
          </Link>
        </div>

        {Array.isArray(course.contents) && course.contents.length > 0 ? (
          <ul className="space-y-2">
            {course.contents.map((ct) => (
              <li
                key={ct.id}
                className="flex items-center justify-between gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60"
              >
                <div>
                  <div className="font-medium">{ct.title}</div>
                  <div className="muted text-xs">{ct.youtube}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleContentStatus(ct)}
                    className="btn-ghost"
                  >
                    {ct.my_status_finished ? "Tandai Belum" : "Tandai Selesai"}
                  </button>
                  <Link
                    to={`/courses/${id}/contents/${ct.id}/edit`}
                    className="btn-ghost"
                  >
                    Edit
                  </Link>
                  <button
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
