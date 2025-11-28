"use client";

import { useState } from "react";
import { Submission } from "../lib/types";
import { toast } from "react-toastify";

export default function GradingTable({ submissions }: { submissions: Submission[] }) {
  const [gradingData, setGradingData] = useState<Record<string, { grade: number | null; feedback: string }>>(
    () =>
      submissions.reduce(
        (acc, s) => ({
          ...acc,
          [s.id]: { grade: (s as any).grade ?? null, feedback: (s as any).feedback ?? "" },
        }),
        {} as Record<string, { grade: number | null; feedback: string }>
      )
  );
  const [editing, setEditing] = useState<Record<string, boolean>>(
    () =>
      submissions.reduce((acc, s) => ({ ...acc, [s.id]: (s as any).grade == null }), {} as Record<string, boolean>)
  );

  const handleGradeChange = (id: string, value: string) => {
    const grade = value ? parseInt(value, 10) : null;
    setGradingData((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { grade: null, feedback: '' }), grade },
    }));
  };

  const handleFeedbackChange = (id: string, value: string) => {
    setGradingData((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { grade: null, feedback: '' }), feedback: value },
    }));
  };

  const handleSave = async (submissionId: string) => {
    const { grade, feedback } = gradingData[submissionId] ?? { grade: null, feedback: '' };
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

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (body && (body.error || body.message)) || `Failed to save grade (status ${res.status})`;
        throw new Error(msg as string);
      }

      // update local state to reflect saved grade
      setGradingData((prev) => ({ ...(prev ?? {}), [submissionId]: { grade, feedback } }));
      // stop editing for this row so inputs are hidden and static values are shown
      setEditing((prev) => ({ ...(prev ?? {}), [submissionId]: false }));
      toast.success(body?.message || "Grade saved successfully!")
    } catch (err) {
      console.error("Error saving grade:", err);
      toast.error((err as Error).message || "An error occurred while saving the grade.")
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
              <td className="px-6 py-4 whitespace-nowrap">{(item.student as any)?.name || (item.student as any)?.fullname}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-600">{(item.student as any)?.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
                  {((item as any).grade != null && (item as any).grade !== undefined) ? 'GRADED' : 'SUBMITTED'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {((item as any).content || (item as any).filePath) ? (
                  <a
                    href={(item as any).content || (item as any).filePath}
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
                {editing[item.id] ? (
                  <input
                    type="number"
                    value={gradingData[item.id]?.grade ?? ""}
                    onChange={(e) => handleGradeChange(item.id, e.target.value)}
                    className="w-20 border border-gray-300 rounded-md p-1 text-sm"
                  />
                ) : (
                  <span className="font-semibold">{gradingData[item.id]?.grade ?? '—'}</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editing[item.id] ? (
                  <input
                    type="text"
                    value={gradingData[item.id]?.feedback ?? ""}
                    onChange={(e) => handleFeedbackChange(item.id, e.target.value)}
                    placeholder="Enter feedback"
                    className="w-64 border border-gray-300 rounded-md p-1 text-sm"
                  />
                ) : (
                  <div>
                    <div>{gradingData[item.id]?.feedback ?? '—'}</div>
                    {((item as any).gradedAt) && (
                      <div className="text-xs text-gray-500 mt-1">Graded: {new Date((item as any).gradedAt).toLocaleString()}</div>
                    )}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editing[item.id] ? (
                  <button
                    onClick={() => handleSave(item.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setEditing((prev) => ({ ...(prev ?? {}), [item.id]: true }))}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
