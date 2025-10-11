// src/components/Layout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={open} toggle={() => setOpen(!open)} />
      <main className={`flex-1 transition-all duration-300 ${open ? "ml-64" : "ml-0"} bg-gray-100 dark:bg-gray-800`}>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
