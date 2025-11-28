
import GradingTable from "@/app/components/GradingTable";
import { Assignment } from "@/app/lib/types";
import prisma from '@/app/lib/prisma';


const AssignmentGradingPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id =  (await params).id

  // Query assignment and its submissions directly via Prisma to avoid server-side fetch
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: { submissions: { include: { student: true } } },
  }) as unknown as Assignment;
  if (!assignment) {
    throw new Error('Assignment not found');
  }

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

  <GradingTable submissions={(assignment as any).submissions || []} />
    </div>
  );
};

export default AssignmentGradingPage;
