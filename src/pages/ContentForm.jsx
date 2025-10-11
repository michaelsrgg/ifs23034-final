// src/pages/ContentForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { addContent, getContent, updateContent } from "../services/courseApi";

export default function ContentForm() {
  const { courseId, contentId } = useParams();
  const isEdit = Boolean(contentId);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [youtube, setYoutube] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!isEdit) return;
      try {
        const res = await getContent(contentId);
        const c = res?.data?.course_content ?? {};
        setTitle(c.title ?? "");
        setYoutube(c.youtube ?? "");
      } catch (e) {
        setErr("Gagal memuat konten.");
      }
    };
    init();
  }, [contentId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (!isEdit) {
        const out = await addContent(courseId, { title, youtube });
        alert(out?.message ?? "Berhasil menambahkan konten");
        navigate(`/courses/${courseId}`, { replace: true });
      } else {
        const out = await updateContent(contentId, { title, youtube });
        alert(out?.message ?? "Berhasil mengubah konten");
        navigate(-1);
      }
    } catch (e) {
      console.error(e);
      setErr("Gagal menyimpan konten. Pastikan URL YouTube valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{isEdit ? "Edit Konten" : "Tambah Konten"}</h1>

      {err && <div className="card p-3 text-red-600 dark:text-red-400">{err}</div>}

      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        <div>
          <label className="block text-sm mb-1">Judul Konten</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">URL YouTube</label>
          <input className="input" value={youtube} onChange={(e) => setYoutube(e.target.value)} required />
        </div>

        <div className="flex gap-2">
          <button className="btn" disabled={loading} type="submit">
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Batal</button>
        </div>
      </form>
    </div>
  );
}
