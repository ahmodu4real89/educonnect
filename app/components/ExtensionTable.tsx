"use client";

import React, { useEffect, useState } from "react";
import { Extension } from "../lib/types";

const ExtensionTable = () => {
  const [extensions, setExtensions] = useState<Extension[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); 

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const res = await fetch(`/api/extension`, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Failed to fetch extensions: ${res.statusText}`);
        }

        const data = await res.json();
        // Unwrap { data: [...] } shaped responses or accept raw arrays
        const items = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
        setExtensions(items as any[]);
      } catch (err) {
        console.error("Error fetching extensions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExtensions();
  }, []);

  const handleAction = async (id: string | undefined, action: "APPROVED" | "REJECTED") => {
    setActionLoading(id);
    try {
      if (!id) {
        alert('Missing request id');
        return;
      }
      const res = await fetch(`/api/extension/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });

      const payloadRaw = await res.json().catch(() => null);
      // unwrap { data: updated } shapes
      const payload = payloadRaw?.data ?? payloadRaw;

      if (!res.ok) {
        console.error('Action failed response', payloadRaw);
        const message = payloadRaw?.error ?? payloadRaw?.message ?? `Failed to ${action.toLowerCase()} request`;
        alert(message);
        return;
      }

      // If API returned updated record, replace it in local state; otherwise update status locally
      if (payload && payload.id) {
        setExtensions((prev) => prev.map((item) => (item.id === id ? payload : item)));
      } else {
        setExtensions((prev) => prev.map((item) => (item.id === id ? { ...item, status: action } : item)));
      }

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

  const formatDate = (isoOrDate?: string) => {
    if (!isoOrDate) return '—';
    // If it's already YYYY-MM-DD, return as-is
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoOrDate)) return isoOrDate;
    try {
      const d = new Date(isoOrDate);
      if (Number.isNaN(d.getTime())) return '—';
      // Always present as YYYY-MM-DD so student and lecturer see the same calendar day
      return d.toISOString().slice(0, 10);
    } catch (e) {
      return '—';
    }
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
                  <td className="py-3 px-6">{(item.student as any)?.fullname ?? (item.student as any)?.name ?? '—'}</td>
                  <td className="py-3 px-6">{item.assignment?.title}</td>
                  <td className="py-3 px-6">
                    {(item.assignment as any)?.course?.code || (item.assignment as any)?.course?.courseCode}
                  </td>
                  <td className="py-3 px-6">
                    {formatDate((item as any).requestedDateStr ?? item.requestedDate ?? item.createdAt)}
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
