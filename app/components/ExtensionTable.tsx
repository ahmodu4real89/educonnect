"use client";

import React, { useEffect, useState } from "react";
import { Extension } from "../lib/types";

const ExtensionTable = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null); 

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const res = await fetch(`/api/extension`, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Failed to fetch extensions: ${res.statusText}`);
        }

        const data = await res.json();
        setExtensions(data);
      } catch (err) {
        console.error("Error fetching extensions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtensions();
  }, []);

  const handleAction = async (id: number, action: "APPROVED" | "REJECTED") => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/extension/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });

      if (!res.ok) {
        throw new Error(`Failed to ${action.toLowerCase()} request`);
      }


      setExtensions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: action } : item
        )
      );

      alert(`Request ${action.toLowerCase()} successfully`);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action.toLowerCase()} request`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading extension requests...</p>;
  }

  if (extensions.length === 0) {
    return <p className="text-gray-500">No extension requests found.</p>;
  }

  return (
    <div>
      {/* Pending Extension Requests */}
      <section>
        <h2 className="text-lg font-semibold mb-4">
          Pending Extension Requests
        </h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-6 text-left">Student</th>
                <th className="py-3 px-6 text-left">Assignment</th>
                <th className="py-3 px-6 text-left">Course</th>
                <th className="py-3 px-6 text-left">Requested Date</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {extensions.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="py-3 px-6">{item.student.name}</td>
                  <td className="py-3 px-6">{item.assignment?.title}</td>
                  <td className="py-3 px-6">
                    {item.assignment?.course?.courseCode}
                  </td>
                  <td className="py-3 px-6">
                    {new Date(item.requestedDate!).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 font-medium">
                    {item.status === "PENDING" && (
                      <span className="text-yellow-600">Pending</span>
                    )}
                    {item.status === "APPROVED" && (
                      <span className="text-green-600">Approved</span>
                    )}
                    {item.status === "REJECTED" && (
                      <span className="text-red-600">Rejected</span>
                    )}
                  </td>
                  <td className="py-3 px-6 space-x-2">
                    {item.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleAction(item.id, "APPROVED")}
                          disabled={actionLoading === item.id}
                          className={`${
                            actionLoading === item.id
                              ? "bg-green-300"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white px-3 py-1 rounded-md text-xs font-medium`}
                        >
                          {actionLoading === item.id ? "Processing..." : "Approve"}
                        </button>

                        <button
                          onClick={() => handleAction(item.id, "REJECTED")}
                          disabled={actionLoading === item.id}
                          className={`${
                            actionLoading === item.id
                              ? "bg-red-300"
                              : "bg-red-500 hover:bg-red-600"
                          } text-white px-3 py-1 rounded-md text-xs font-medium`}
                        >
                          {actionLoading === item.id ? "Processing..." : "Reject"}
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ExtensionTable;
