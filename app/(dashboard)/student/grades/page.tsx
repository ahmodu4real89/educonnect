"use client";
import { useUser } from "@/app/context/UserContext";
import { Submission } from "@/app/lib/types";
import React, { useEffect, useState } from "react";

const GradesPage = () => {
  const { user } = useUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchSubmissions = async () => {
      try {
        const res = await fetch(`/api/submission/${user.id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch submissions: ${res.statusText}`);
        }

        const data = await res.json();
        setSubmissions(data);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user?.id]);

  if (loading) return <p className="text-gray-500">Loading submissions...</p>;

  if (submissions.length === 0) return <p className="text-gray-500">No submissions found.</p>;

  

  return (
    <div className="flex flex-col min-h-screen bg-gray-50  text-slate-800 ">
      {/* Main */}
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Grades</h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">View your grades for all courses and assignments.</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
              <thead className="text-xs uppercase bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Assignment
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium hidden sm:table-cell">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium text-center">
                    Grade
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium hidden md:table-cell">
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{s.assignment.title}</td>
                    <td className="px-6 py-4">{s.assignment.course.courseName}</td>

                    <td className="px-6 py-4 text-center font-bold">{s.grade ?? "—"}</td>
                    <td className="px-6 py-4">{s.feedback}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
export default GradesPage;
