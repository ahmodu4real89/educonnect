import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import React from "react";

const navItems = [
  { name: "Dashboard", key: "/lecturer" },
  { name: "Assignments", key: "/lecturer/assignments" },
  { name: "Students", key: "/lecturer/students" },
  { name: "Courses", key: "/lecturer/courses" },
];

export default function LecturerSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {logout}= useUser()
  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen bg-blue-700 text-white transform ${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 transition-transform`}
    >
      <div className="flex justify-between items-center px-4 py-4 border-b border-blue-500">
        <h2 className="text-xl font-bold">Lecturer</h2>
        <button className="md:hidden" onClick={onClose}>
          ✕
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.key as any}
            className="block w-full text-left px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {item.name}
          </Link>
        ))}
      <button onClick={() =>logout()}>Logout</button>
      </nav>
    </aside>
  );
}
