"use client";
import { useUser } from "@/app/context/UserContext";

export function UserSection() {
  const { user } = useUser();
  return <p className="text-gray-600 mb-8">Welcome back, {user?.name || "Student"}</p>;
}
