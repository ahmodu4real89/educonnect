"use client";

import CourseFormModal from "@/app/components/CourseFormModal";
import CourseGrid from "@/app/components/CourseGrid";
import { useUser } from "@/app/context/UserContext";
import { CourseRes } from "@/app/lib/types";
import { useState } from "react";
import { toast } from "react-toastify";



export default function Course() {
  const { user } = useUser();
  const [editCourse, setEditCourse] = useState<CourseRes | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const handleEdit = (course: CourseRes) => {
    setEditCourse(course);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Course deleted successfully!")
        handleRefresh();
      } else {
  
        toast.error("Failed to delete course")
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="m-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>

        {user?.role === "LECTURER" && (
          <button
            onClick={() => {
              setEditCourse(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Create Course
          </button>
        )}
      </div>

      <CourseGrid
        apiEndpoint="/api/courses"
        linkPrefix="/lecturer/courses"
        key={refreshKey}
       onEdit={handleEdit}
       onDelete={handleDelete}
      />

      <CourseFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        //lecturerId={user?.id}
        initialData={editCourse || undefined}
        onSuccess={() => {
          handleRefresh();
          setShowModal(false);
          setEditCourse(null);
        }}
    /> 
    </div>
  );
}
