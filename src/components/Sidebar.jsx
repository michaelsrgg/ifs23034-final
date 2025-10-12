// src/components/Sidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const variants = {
  closed: { x: -260, transition: { type: "spring", stiffness: 260, damping: 30 } },
  open:   { x: 0,    transition: { type: "spring", stiffness: 260, damping: 30 } },
};

export default function Sidebar({ open, toggle }) {
  const location = useLocation();
  const { dark, setDark } = useTheme();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/courses",   label: "Courses" },
    { to: "/users",     label: "Users" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={open ? "open" : "closed"}
      variants={variants}
      className={`fixed top-0 left-0 z-50 h-screen w-64 border-r
                  bg-white text-slate-800 border-slate-200
                  dark:bg-slate-900 dark:text-slate-50 dark:border-slate-800
                  lg:translate-x-0`}
      aria-hidden={!open}
    >
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
        <span className="font-semibold tracking-tight">DelCourse</span>
      </div>

      <nav className="p-3 space-y-2">
        {links.map((l) => {
          const active = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`block px-3 py-2 rounded-lg text-sm font-medium transition
                          focus:outline-none focus:ring-2 focus:ring-blue-500
                          ${active ? "bg-blue-600 text-white shadow"
                                   : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              onClick={() => {
                if (window.matchMedia("(max-width: 1023px)").matches) toggle();
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setDark((d) => !d)}
          aria-pressed={dark}
          className="w-full rounded-lg px-3 py-2 text-sm font-medium transition
                     bg-slate-100 hover:bg-slate-200
                     dark:bg-slate-800 dark:hover:bg-slate-700
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle theme"
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </motion.aside>
  );
}
