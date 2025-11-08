"use client";

import { useUser } from "@/app/context/UserContext";
import { Assignment } from "@/app/lib/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RequestExtensionForm = () => {
  const {user} = useUser();
  const router = useRouter()
  const [assignment, setAssignment] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [reason, setReason] = useState("");
  const [newDeadline, setNewDeadline] = useState("");  
    const [loading, setLoading] = useState(true);
      const [submitting, setSubmitting] = useState(false);
  
    useEffect(() => {
      async function fetchAssignments() {
        try {
          const res = await fetch("/api/assignment", { cache: "no-store" });
  
          if (!res.ok) {
            throw new Error(`Failed to fetch assignments: ${res.statusText}`);
          }
  
          const data = await res.json();
          setAssignment(data);
        } catch (err) {
          console.log("Error fetching assignments:", err);
        } finally {
          setLoading(false);
        }
      }
  
      fetchAssignments();
    }, []);
  
    if (loading) return <p className="text-gray-500">Loading assignments...</p>;
  
  

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
      if (!user?.id) {
      alert("You must be logged in to request an extension.");
      return;
    }
    try {
      setSubmitting(true)
      const payload = {
      studentId: user?.id,
      assignmentId: Number(selectedAssignment),
      reason,
      requestedDate: newDeadline,
  
      }

       console.log("Submitting payload:", payload);  
    const res = await fetch("/api/extension", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to submit request: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Success:", data);

      router.push("/student");
    } catch (err) {
      console.error("Error submitting extension request:", err);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Request Assignment Extension
        </h1>
        <p className="text-gray-600 mb-6">
          Fill out the form below to request an extension for your assignment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Assignment Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment
            </label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >

              <option value="">Select..</option>
              {assignment.map((item)=>(
              <option value={item.id} key={item.id}>{item.title}</option>

              ))}
            </select>
          </div>

          {/* Reason for Extension */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Extension
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a clear and concise reason for your request."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              required
            ></textarea>
          </div>

          {/* Suggested New Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Suggested New Deadline
            </label>
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestExtensionForm;
