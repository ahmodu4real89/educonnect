"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
  lecturerId: string;
  extensible: boolean;
}

interface AssignmentTableProps {
  
  courseId?: string;
  showGradeLink?: boolean;

  gradeLinkPrefix?: string;
  showActions?: boolean;

  headerContent?: React.ReactNode;
  onEdit?: (assignment: Assignment) => void;
  onDelete?: (assignmentId: string) => void;
}

const AssignmentTable: React.FC<AssignmentTableProps> = ({
  courseId,
  showGradeLink = false,
  gradeLinkPrefix = "",
  showActions = false,
  headerContent,
  onEdit,
  onDelete,
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        setLoading(true);
        const url = courseId
          ? `/api/assignments?courseId=${courseId}`
          : `/api/assignments`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch assignments`);

        const result = await res.json();

        if (Array.isArray(result.data)) {
          setAssignments(result.data);
        } else {
          console.error("Unexpected response:", result);
          setAssignments([]);
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignments();
  }, [courseId]);

  if (loading) return <p className="text-gray-500">Loading assignments...</p>;

  if (assignments.length === 0)
    return <p className="text-gray-500">No assignments found.</p>;

  return (
    <section className="w-full">
      <div className="flex justify-between items-center mb-4">
    
        {headerContent && <div>{headerContent}</div>}
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Due Date</th>
              {showGradeLink && <th className="px-6 py-3 text-center">Grade</th>}
              {showActions && <th className="px-6 py-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {assignments.map((item) => (
              <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.title}
                </td>
                <td className="px-6 py-4">{item.description}</td>
                <td className="px-6 py-4">
                  {new Date(item.dueDate).toLocaleDateString()}
                </td>

                {showGradeLink && (
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`${gradeLinkPrefix}/${item.id}/grade`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Grade
                    </Link>
                  </td>
                )}

                {showActions && (
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => onEdit?.(item)}
                      className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(item.id)}
                      className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AssignmentTable;
