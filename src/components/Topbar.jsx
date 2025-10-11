import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Topbar({ onToggleSidebar }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center px-6">
      {/* Burger (mobile) */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 mr-4 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all"
        aria-label="Toggle Sidebar"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor">
          <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Welcome text, aligned to the center */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          Hello, {user?.name || "User"}
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {/* Logout button */}
        <button
          onClick={logout}
          className="text-gray-700 dark:text-white hover:underline transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
