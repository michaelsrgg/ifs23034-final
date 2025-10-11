// src/pages/CourseForm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCourse, updateCourse, changeCourseCover, getCourse,
} from "../services/courseApi";

export default function CourseForm() {
  const { id } = useParams();           // ada id → edit mode
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);         // file baru (create/edit)
  const [currentCover, setCurrentCover] = useState(""); // preview untuk edit
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const init = async () => {
      if (!isEdit) return;
      try {
        const res = await getCourse(id);
        const c = res?.data?.course ?? {};
        setTitle(c.title ?? "");
        setDescription(c.description ?? "");
        setCurrentCover(c.cover ?? "");
      } catch (e) {
        setErr("Gagal memuat data course.");
      }
    };
    init();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (!isEdit) {
        // CREATE: cover + title + description (multipart)
        const out = await addCourse({ coverFile: cover, title, description });
        alert(out?.message ?? "Berhasil menambahkan data");
        navigate(`/courses/${out?.data?.course_id ?? ""}`, { replace: true });
      } else {
        // UPDATE text dulu
        const r1 = await updateCourse(id, { title, description });
        // lalu, jika user pilih file, ganti cover
        if (cover) {
          const r2 = await changeCourseCover(id, cover);
          console.log(r2?.message);
        }
        alert(r1?.message ?? "Berhasil mengubah data");
        navigate(`/courses/${id}`, { replace: true });
      }
    } catch (e) {
      console.error(e);
      setErr("Gagal menyimpan course. Pastikan semua field valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        {isEdit ? "Edit Course" : "Buat Course"}
      </h1>

      {err && <div className="card p-3 text-red-600 dark:text-red-400">{err}</div>}

      <form onSubmit={handleSubmit} className="card p-5 space-y-4">
        {isEdit && currentCover && (
          <img src={currentCover} alt="cover" className="h-40 w-full object-cover rounded-lg" />
        )}
        <div>
          <label className="block text-sm mb-1">Cover {isEdit ? "(opsional)" : "(wajib)"}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files?.[0] ?? null)}
            className="block"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea className="input" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <button className="btn" disabled={loading} type="submit">
            {loading ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Course"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Batal</button>
        </div>
      </form>
    </div>
  );
}
