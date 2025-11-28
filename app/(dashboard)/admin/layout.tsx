"use client"
import React, { useState } from "react";
import AdminSidebar from "@/app/components/widgets/AdminSidebar";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 p-6 md:ml-64">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
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
