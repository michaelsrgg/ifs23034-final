// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Users from "./pages/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/DashboardLayout";

// Tambahan
import CourseForm from "./pages/CourseForm";
import ContentForm from "./pages/ContentForm";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Courses */}
          <Route path="courses" element={<Courses />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="courses/:id/edit" element={<CourseForm />} />

          {/* Contents */}
          <Route path="courses/:courseId/contents/new" element={<ContentForm />} />
          <Route path="courses/:courseId/contents/:contentId/edit" element={<ContentForm />} />

          {/* Users */}
          <Route path="users" element={<Users />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
