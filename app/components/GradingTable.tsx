"use client";

import { useState } from "react";
import { Submission } from "../lib/types";
import { toast } from "react-toastify";

export default function GradingTable({ submissions }: { submissions: Submission[] }) {
  const [gradingData, setGradingData] = useState<Record<number, { grade: number | null; feedback: string }>>(
    () =>
      submissions.reduce(
        (acc, s) => ({
          ...acc,
          [s.id]: { grade: s.grade ?? null, feedback: s.feedback ?? "" },
        }),
        {}
      )
  );

  const handleGradeChange = (id: number, value: string) => {
    const grade = value ? parseInt(value, 10) : null;
    setGradingData((prev) => ({
      ...prev,
      [id]: { ...prev[id], grade },
    }));
  };

  const handleFeedbackChange = (id: number, value: string) => {
    setGradingData((prev) => ({
      ...prev,
      [id]: { ...prev[id], feedback: value },
    }));
  };

  const handleSave = async (submissionId: number) => {
    const { grade, feedback } = gradingData[submissionId];
    if (grade === null || isNaN(grade)) {
      toast.warning("Please enter a valid numeric grade.")
      return;
    }

    try {
      const res = await fetch(`/api/submission/${submissionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, feedback }),
      });

      if (!res.ok) throw new Error("Failed to save grade");
      toast.success("Grade saved successfully!")
    } catch (err) {
      console.error("Error saving grade:", err);
      toast.error("An error occurred while saving the grade.")
    }
  };

  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">File</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Grade</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Feedback</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {submissions.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">{item.student?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{item.student?.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    item.status === "SUBMITTED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.filePath ? (
                  <a
                    href={item.filePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Download
                  </a>
                ) : (
                  <span className="text-gray-400">No file</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  value={gradingData[item.id]?.grade ?? ""}
                  onChange={(e) => handleGradeChange(item.id, e.target.value)}
                  className="w-20 border border-gray-300 rounded-md p-1 text-sm"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={gradingData[item.id]?.feedback ?? ""}
                  onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
                  placeholder="Enter feedback"
                  className="w-64 border border-gray-300 rounded-md p-1 text-sm"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleSave(item.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
