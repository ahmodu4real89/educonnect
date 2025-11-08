// 



"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

const randomImages = [
  "https://picsum.photos/300/200?random=1",
  "https://picsum.photos/300/200?random=2",
  "https://picsum.photos/300/200?random=3",
  "https://picsum.photos/300/200?random=4",
];

function getRandomImage(): string {
  return randomImages[Math.floor(Math.random() * randomImages.length)];
}

interface Course {
  id: string;
  name: string;
  code: string;
  level: string;
  description: string;
  lecturerId: string;
  image?: string;
}

interface Meta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface CourseGridProps {
  apiEndpoint: string;
  limit?: number;
  linkPrefix?: string;
  enroll?:string
  onEdit?: (course: Course) => void;
  onDelete?: (id: string) => void;
}

export default function CourseGrid({
  apiEndpoint,
  limit,
  linkPrefix,
  enroll,
  onEdit,
  onDelete,
}: CourseGridProps) {
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!apiEndpoint) return;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const query = limit ? `?page=${page}&pageSize=${limit}` : "";
        const res = await fetch(`${apiEndpoint}${query}`);
        if (!res.ok) throw new Error("Failed to fetch courses");

        const result = await res.json();
        const data = result?.data || [];

        const withImages = data.map((c: Course) => ({
          ...c,
          image: c.image || getRandomImage(),
        }));

        setCourses(withImages);
        setMeta(result.meta || null);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [apiEndpoint, limit, page]);

    const handleEnroll = async (courseId: string) => {
    if (!enroll) return; 

    try {
      const res = await fetch(`/api/courses/${courseId}${enroll}`, {
        method: "POST",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Enrollment failed");
      }

      toast.success("Successfully enrolled in course!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to enroll");
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <section className="p-4">
      {courses.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <>
          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <Image
                  width={300}
                  height={200}
                  src={course.image!}
                  alt={course.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{course.name}</h3>
                  <p className="text-gray-500 text-sm">{course.code}</p>
                  <p className="text-gray-500 text-sm">Level: {course.level}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    {course.description}
                  </p>

                  {linkPrefix && (
                    <Link
                      href={`${linkPrefix}/${course.id}`}
                      className="block text-center mt-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                    >
                      View Course
                    </Link>
                  )}

                  {enroll && (
                    <button
                      
                        onClick={() => handleEnroll(course.id)}
                      className="block text-center mt-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                    >
                      Enrol Course
                    </button>
                  )}



                  {(onEdit || onDelete) && (
                    <div className="flex justify-between mt-3">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(course)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(course.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Optional Pagination Controls */}
          {limit && meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(meta.totalPages, p + 1))
                }
                disabled={page === meta.totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
