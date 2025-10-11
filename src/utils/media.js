// src/utils/media.js
// Ambil origin dari base API, lalu pakai untuk membentuk URL absolut
const apiBase = import.meta.env.VITE_API_BASE || "https://open-api.delcom.org/api/v1";
const ORIGIN = (() => {
  try { return new URL(apiBase).origin; } catch { return "https://open-api.delcom.org"; }
})();

/**
 * Terima berbagai kemungkinan field dari API (cover_url, cover, image_url, thumbnail, dll)
 * Kembalikan URL absolut agar <img> bisa memuat dengan benar.
 */
export function resolveCourseCover(course) {
  const val =
    course?.cover_url ??
    course?.coverUrl ??
    course?.cover ??
    course?.image_url ??
    course?.thumbnail ??
    course?.image ??
    null;

  if (!val || typeof val !== "string") return null;

  // Sudah absolut?
  if (/^https?:\/\//i.test(val)) return val;

  // Relatif: normalisasi agar tidak double slash
  const path = val.replace(/^\/+/, "");
  return `${ORIGIN}/${path}`;
}
