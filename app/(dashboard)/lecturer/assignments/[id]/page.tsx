
import GradingTable from "@/app/components/GradingTable";
import { Assignment } from "@/app/lib/types";


const AssignmentGradingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id =  (await params).id
  
 const baseUrl =process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}`: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/submission?assignmentId=${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch submissions (status ${res.status})`);
  }

  const assignment: Assignment = await res.json();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-4 text-3xl font-bold">
        Assignment: {assignment.title || "Untitled"}
      </h1>
      <h2 className="font-xl mb-2">{assignment.description}</h2>
      <p className="mb-8 text-gray-500">
        Due:{" "}
        {assignment.dueDate
          ? new Date(assignment.dueDate).toLocaleDateString()
          : "—"}
      </p>

      <GradingTable submissions={assignment.submissions} />
    </div>
  );
};

export default AssignmentGradingPage;
