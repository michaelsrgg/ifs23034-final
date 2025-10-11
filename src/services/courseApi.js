// src/services/courseApi.js
import api from "./api";

/** ===================== COURSES ===================== */

// POST /courses (multipart) — Add New Course
export const addCourse = async ({ coverFile, title, description }) => {
  const fd = new FormData();
  if (coverFile) fd.append("cover", coverFile);
  fd.append("title", title);
  fd.append("description", description);
  const res = await api.post("/courses", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // response: { success, message, data: { course_id } }
  return res.data;
};

// POST /courses/:id/cover (multipart) — Change Cover Course
export const changeCourseCover = async (id, coverFile) => {
  const fd = new FormData();
  fd.append("cover", coverFile);
  const res = await api.post(`/courses/${id}/cover`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // response: { success, message }
  return res.data;
};

// PUT /courses/:id (x-www-form-urlencoded) — Update Course
export const updateCourse = async (id, { title, description }) => {
  const body = new URLSearchParams({ title, description });
  const res = await api.put(`/courses/${id}`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  // response: { success, message }
  return res.data;
};

// GET /courses — Get All Courses (opsional ?is_me=1)
export const getCourses = async (params = {}) => {
  const res = await api.get("/courses", { params });
  // response: { success, message, data: { courses: [...] } }
  return res.data;
};

// GET /courses/:id — Detail Course
export const getCourse = async (id) => {
  const res = await api.get(`/courses/${id}`);
  // response: { success, message, data: { course: {...} } }
  return res.data;
};

// DELETE /courses/:id — Delete Course
export const deleteCourse = async (id) => {
  const res = await api.delete(`/courses/${id}`);
  // response: { success, message }
  return res.data;
};

/** ===================== STUDENTS & RATINGS ===================== */

// POST /courses/:id/students — Add Student (join)
export const joinCourse = async (id) => {
  const res = await api.post(
    `/courses/${id}/students`,
    new URLSearchParams(), // body kosong tapi x-www-form-urlencoded di docs sebagian endpoint
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  // response: { success, message }
  return res.data;
};

// DELETE /courses/:id/students — Delete Student (leave)
export const leaveCourse = async (id) => {
  const res = await api.delete(`/courses/${id}/students`);
  // response: { success, message }
  return res.data;
};

// PUT /courses/:id/students/ratings — Change Student Ratings
export const rateCourse = async (id, { ratings, comment }) => {
  const body = new URLSearchParams({
    ratings: String(ratings),  // Pastikan ratings berupa angka
    comment: comment ?? "",    // Jika tidak ada komentar, kirimkan string kosong
  });

  try {
    const res = await api.put(`/courses/${id}/students/ratings`, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Pastikan response mengembalikan rata-rata rating terbaru atau data lain yang relevan
    if (res?.data?.success) {
      return {
        message: res.data.message,
        averageRating: res.data.data?.averageRating,  // Pastikan server mengembalikan rata-rata rating
      };
    }

    throw new Error(res?.data?.message || "Unknown error occurred.");
  } catch (error) {
    console.error("Error giving rating:", error);
    throw error;
  }
};
/** ===================== CONTENTS ===================== */

// POST /courses/:courseId/contents — Add New Content
export const addContent = async (courseId, { title, youtube }) => {
  const body = new URLSearchParams({ title, youtube });
  const res = await api.post(`/courses/${courseId}/contents`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  // response: { success, message, data: { content_id } }
  return res.data;
};

// GET /courses/-/contents/:id — Detail Content
export const getContent = async (contentId) => {
  const res = await api.get(`/courses/-/contents/${contentId}`);
  // response: { success, message, data: { course_content: {...} } }
  return res.data;
};

// PUT /courses/-/contents/:id — Update Content
export const updateContent = async (contentId, { title, youtube }) => {
  const body = new URLSearchParams({ title, youtube });
  const res = await api.put(`/courses/-/contents/${contentId}`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  // response: { success, message }
  return res.data;
};

// DELETE /courses/-/contents/:id — Delete Content
export const deleteContent = async (contentId) => {
  const res = await api.delete(`/courses/-/contents/${contentId}`);
  // response: { success, message }
  return res.data;
};

// POST /courses/-/contents/:id/learns — Change Content Status
export const setContentStatus = async (contentId, status /* 1 | 0 */) => {
  const body = new URLSearchParams({ status: String(status) });
  const res = await api.post(`/courses/-/contents/${contentId}/learns`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  // response: { success, message }
  return res.data;
};
