"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CourseRes } from "@/app/lib/types";

const CoursePage = () => {
  const params = useParams();
  const id = params.id;
  const [course, setCourse] = useState<CourseRes>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        console.log(data, "dats");
        setCourse(data);
      } catch (error) {
        console.error("Error fetching course:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchCourse();
  }, [id]);

  if (loading) return <p>Loading course details...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
          <p className="text-gray-500">Course ID: {course.id}</p>
        </header>

        {/* Course Description */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
        </section>

        {/* Lecturer Section */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex items-center space-x-4">
          <Image width={300} height={300} src="https://randomuser.me/api/portraits/men/45.jpg" alt="Lecturer" className="w-14 h-14 rounded-full object-cover" />
          <div>
            <h3 className="font-medium text-gray-900">{course.lecturer?.name}</h3>
            <p className="text-sm text-gray-500">{course.lecturer?.email}</p>
          </div>
        </section>

        {/* Assignments */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Assignments</h2>
          {course.assignments?.length === 0 ? (
            <p className="text-gray-500">No assignments available</p>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left font-medium text-gray-700 px-6 py-3">Title</th>
                    <th className="text-left font-medium text-gray-700 px-6 py-3">Description</th>
                    <th className="text-left font-medium text-gray-700 px-6 py-3">Due Date</th>
                    <th className="text-left font-medium text-gray-700 px-6 py-3">Status</th>
                    <th className="text-left font-medium text-gray-700 px-6 py-3">view</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {course.assignments?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 text-gray-600">{item.description}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(item.dueDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === "SUBMITTED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    PENDING
                  </span>
                </td>
                      <td className=" text-blue-600 text-center">
                        <Link href={`/student/assignment/${item.id}`}>View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
export default CoursePage;
