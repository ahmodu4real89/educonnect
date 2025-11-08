"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";


interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId?: string;
  onSuccess?: () => void;
  
  initialData?: {
    id?: string;
    title: string;
    description: string;
    dueDate?: string;
    extensible: boolean;
  };
}

export default function AssignmentFormModal({
  isOpen,
  onClose,
  courseId,
  onSuccess,
  initialData,
}: AssignmentModalProps) {
  const [lecturerId, setLecturerId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    dueDate: "",
    description: "",
    extensible: false,
  });

  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData?.id;

  useEffect(() => {
    // const fetchSession = async () => {
    //   try {
    //     const { data } = await authClient.getSession();
    //     if (data?.user?.id) {
    //       setLecturerId(data.user.id);
    //     } else {
    //       toast.error("Could not retrieve lecturer session");
    //     }
    //   } catch (error) {
    //     console.error("Error getting session:", error);
    //     toast.error("Failed to get session");
    //   }
    // };

    // fetchSession();

    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        dueDate: initialData.dueDate ? initialData.dueDate.split("T")[0] : "",
        extensible: initialData.extensible,
      });
    } else {
      setFormData({  title: "", dueDate: "", description: "", extensible: false });
    }
  }, [initialData]);

  // ✅ Generic input change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Toggle extensible button
  const toggleExtensible = () => {
    setFormData((prev) => ({ ...prev, extensible: !prev.extensible }));
  };

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    
    // const payload = {
    //   ...formData,
    //   courseId, 
    // };


    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode
      ? `/api/assignments/${initialData?.id}`
      : `/api/assignments`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
         ...formData,
         courseId
        }),
      });

      if (!courseId) {
  toast.error("Missing course ID");
  return;
}

      if (res.ok) {
        toast.success(
          isEditMode
            ? "✅ Assignment updated successfully!"
            : "✅ Assignment created successfully!"
        );
        onClose();
        onSuccess?.();
      } else {
        toast.error("❌ Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">
          {isEditMode ? "Edit Assignment" : "Create New Assignment"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* ✅ Toggle extensible button */}
          <div className="flex items-center justify-between border rounded-lg px-3 py-2">
            <span className="text-gray-700 font-medium">Extensible</span>
            <button
              type="button"
              onClick={toggleExtensible}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                formData.extensible
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
            >
              {formData.extensible ? "TRUE" : "FALSE"}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
