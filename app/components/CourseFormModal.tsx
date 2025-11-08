"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "../lib/auth-client";

const levelsMap = {
  LEVEL: ["100", "200", "300", "400", "500", "600"],
};

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecturerId?: number;
  onSuccess?: () => void;
  initialData?: {
    id?: string;
    name: string;
    code: string;
    description: string;
    level: string;
  };
}

export default function CourseFormModal({ isOpen, onClose,  onSuccess, initialData }: CourseFormModalProps) {
const [lecturerId, setLecturerId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    level: "",
  });

  const [loading, setLoading] = useState(false);
  const isEditMode = !!initialData?.id;

  useEffect(() => {
        const fetchSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (data?.user?.id) {
          setLecturerId(data.user.id);
        } else {
          toast.error("Could not retrieve lecturer session");
        }
      } catch (error) {
        console.error("Error getting session:", error);
        toast.error("Failed to get session");
      }
    };

    fetchSession();
    if (initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code || "",
        description: initialData.description,
        level: initialData.level,
      });
    } else {
      setFormData({ name: "", code: "", description: "", level: "" });
    }
  }, [initialData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = isEditMode ? "PATCH" : "POST";
    const url = isEditMode ? `/api/courses/${initialData?.id}` : `/api/courses`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, lecturerId }),
      });

      if (res.ok) {
        toast.success(isEditMode ? "✅ Course updated successfully!" : "✅ Course created successfully!");
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative animate-fadeIn" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} disabled={loading} className="absolute top-3 right-3 text-gray-600 hover:text-gray-700">
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">{isEditMode ? "Edit Course" : "Create New Course"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Course Code</label>
            <input type="text" name="code" value={formData.code} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div className="w-full">
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none "
            >
              <option value="">Select Level</option>
              {levelsMap.LEVEL.map((level) => (
                <option value={level} key={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 border rounded hover:bg-gray-100">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update" : "Create"}
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
