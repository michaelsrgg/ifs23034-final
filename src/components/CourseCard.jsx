import React from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";
import { resolveCourseCover } from "../utils/media";

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

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const handleDetail = () => navigate(`/courses/${course.id}`);

  const cover = resolveCourseCover(course);

  return (
    <div className="rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105">
      {/* Cover */}
      <div className="relative group">
        <img
          src={cover || "/default-course.jpg"}
          alt={course.title}
          className="w-full h-60 object-cover rounded-t-lg"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.dataset.fallback !== "1") {
              img.dataset.fallback = "1";
              img.src = "/default-course.jpg";
            }
          }}
        />
        <div className="absolute top-4 left-4 bg-blue-700 text-white text-xs px-3 py-1 rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">
          {course.category || "General"}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white p-5 rounded-b-lg">
        <h3 className="font-bold text-xl text-gray-900 truncate">{course.title}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
          {course.description || "No description available."}
        </p>

        {/* Rating Display */}
        <div className="flex items-center mt-2">
          {renderStarRating(course.avg_rating || 0)}
          <span className="ml-2 text-sm text-gray-500">
            {course.avg_rating || 0} / 5
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Users size={18} />
            <span>
              {Array.isArray(course?.students) ? course.students.length : (course?.students_count ?? 0)} students
            </span>
          </div>
          <button onClick={handleDetail} className="text-blue-600 font-medium hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
