"use client";
import { Assignment } from "@/app/lib/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const StudentAssignmentPage = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const res = await fetch("/api/assignment", { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Failed to fetch assignments: ${res.statusText}`);
        }

        const data = await res.json();
        setAssignments(data);
      } catch (err) {
        console.log("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, []);

  if (loading) return <p className="text-gray-500">Loading assignments...</p>;

  return (
   <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Assignments</h2>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Assignment</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">View</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.title}</td>
                <td className="px-6 py-4">{item.course.courseName}</td>
                <td className="px-6 py-4">{new Date(item.dueDate).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === "SUBMITTED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-blue-600">
                  {item.status === "SUBMITTED" ? (
                    <Link href="/student/grades" className="hover:underline">
                      View
                    </Link>
                  ) : (
                    <Link href={`/student/assignment/${item.id}`} className="hover:underline">
                      View
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
export default StudentAssignmentPage;
