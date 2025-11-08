"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { Submission } from "../lib/types";


const SubmissionTable = () => {
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

  if (submissions.length === 0)
    return <p className="text-gray-500">No submissions found.</p>;

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Recent Submission
      </h2>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Assignment</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Submitted On</th>
              <th className="px-6 py-3">Grade</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">File</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {s.assignment.title}
                </td>
                <td className="px-6 py-4">
                  {s.assignment.course.courseName}
                </td>
                <td className="px-6 py-4">
                  {new Date(s.submissionDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{s.grade ?? "—"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      s.status === "SUBMITTED"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {s.filePath ? (
                    <a
                      href={s.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  ) : (
                    "No file"
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

export default SubmissionTable;
