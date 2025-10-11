import React from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const variants = {
  closed: { x: -300, transition: { type: "spring", stiffness: 200, damping: 30 } },
  open:   { x: 0,    transition: { type: "spring", stiffness: 200, damping: 30 } },
};

export default function Sidebar({ open, toggle }) {
  const location = useLocation();

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
      className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-transform duration-300 ease-in-out`}
      aria-hidden={!open}
    >
      <div className="h-16 flex items-center justify-center text-lg font-semibold border-b border-gray-300 dark:border-gray-700">
        Course
      </div>

      <nav className="p-4 space-y-2">
        {links.map((l) => {
          const active = location.pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`block px-4 py-2 rounded-lg text-base transition-colors 
                          ${active ? "bg-blue-600 text-white" : "hover:bg-gray-200 dark:hover:bg-gray-800"}`}
              onClick={() => {
                if (window.matchMedia("(max-width: 1024px)").matches) toggle();
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
