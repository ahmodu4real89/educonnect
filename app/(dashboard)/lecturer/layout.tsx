"use client"
import React, { useState } from "react";
import AdminSidebar from "@/app/components/widgets/AdminSidebar";
import LecturerSidebar from "@/app/components/widgets/LecturerSidebar";


export default function LecturerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <LecturerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 p-6 md:ml-64">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Lecturer Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden bg-blue-600 text-white px-4 py-2 rounded"
          >
            ☰
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
