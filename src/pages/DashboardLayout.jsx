import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(true);

  // Desktop default terbuka, mobile tertutup
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const setByScreen = () => setOpen(mql.matches);
    setByScreen();
    mql.addEventListener("change", setByScreen);
    return () => mql.removeEventListener("change", setByScreen);
  }, []);

  const toggle = () => setOpen(o => !o);

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar open={open} toggle={toggle} />

      {/* Overlay (mobile) */}
      {open && (
        <button
          className="fixed inset-0 z-40 bg-black/30 lg:hidden transition-opacity"
          onClick={toggle}
          aria-label="Close sidebar overlay"
        />
      )}

      {/* Konten: saat sidebar open di desktop → margin-left 16rem */}
      <div
        className={`relative transition-all duration-300 ease-in-out ${open ? "lg:ml-64" : "ml-0"}`}
      >
        <Topbar onToggleSidebar={toggle} />
        <main className="p-6 lg:p-8 bg-white shadow-md rounded-lg mx-4 lg:mx-8 my-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
