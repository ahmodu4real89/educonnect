 "use client"

import { Assignment } from "@/app/lib/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const  StudentAssignmentPage=()=> {
     const params = useParams()
      const id = Number(params.id); 
      const [assignment, setAssignment] = useState<Assignment>();
      const [loading, setLoading] = useState(true);

    
      useEffect(() => {
        async function fetchAssignment() {
          try {
        
            const res = await fetch(`/api/assignments/${id}`);
            if (!res.ok) throw new Error("Failed to fetch assignment");
            const data: Assignment = await res.json();
            console.log(data, 'dats')
            setAssignment(data);
          } catch (error) {
            console.error("Error fetching assignment:", error);
          } finally {
            setLoading(false);
          }
        }
    
        if (id) fetchAssignment();
      },  [id]);
    
      if (loading) return <p>Loading assignment details...</p>;
      if (!assignment) return <p>Assignment not found</p>;


  return (
    <div>
      <main className="flex grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 ">
            <h2 className="text-3xl font-bold tracking-tight">Submit Assignment</h2>
            <p className="text-muted-light dark:text-muted-dark mt-1">
              Course: {assignment.title}
            </p>
          </div>

          <div className="space-y-8">
          
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold border-b border-gray-300 pb-3 mb-4">
                Assignment Details
              </h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-semibold">Title:</span> {assignment.title}
                </p>
                <p>
                  <span className="font-semibold">Due Date:</span> {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
                <div>
                  <p className="font-semibold mb-1">Instructions:</p>
                  <p className="text-muted-light dark:text-muted-dark">
                   {assignment.description}
                  </p>
                </div>
              </div>
            </div>

          
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold border-b border-gray-300  pb-3 mb-4">
                Your Submission
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 " htmlFor="description">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Add a description for your submission..."
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 bg-gray-200  transition p-2"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upload Files</label>
                  <div className="flex justify-center items-center w-full bg-gray-100">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col justify-center items-center w-full h-64  rounded-lg border-2 border-gray-300 cursor-pointer transition"
                    >
                      <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        <svg
                          className="w-10 h-10 mb-3 text-muted-light dark:text-muted-dark"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h2l2-2h4l2 2h2a4 4 0 014 4v5a4 4 0 01-4 4H7z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-muted-light dark:text-muted-dark">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-light dark:text-muted-dark">
                          ZIP, PDF, or TXT (MAX. 10MB)
                        </p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="bg-primary text-white bg-blue-700 font-bold py-2 px-6 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light dark:focus:ring-offset-background-dark focus:ring-primary transition-all"
            >
              Submit Assignment
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
export default StudentAssignmentPage