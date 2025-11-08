import AssignmentTable from "@/app/components/AssignmentTable";
import CourseGrid from "@/app/components/CourseGrid";
import ExtensionTable from "@/app/components/ExtensionTable";
import { UserSection } from "@/app/components/UserSection";
import { deadline } from "@/app/lib/types";
import Link from "next/link";



const LecturerDashboard = async () => {
 const baseUrl = process.env.VERCEL_URL? `https://${process.env.VERCEL_URL}`: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/assignment`, { cache: "no-store" })
    const deadlines:deadline[] = await response.json()
  
      if ( !deadlines) {
        throw new Error(
          `Failed to fetch:  students (${deadlines})`
        );
      }
  


  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <UserSection />

        {/* My Courses */}
        <section className="mb-10">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold mb-4">My Courses</h2>
            <Link href={"/lecturer/courses"}>
              <span className="text-blue-300">Sell all courses</span>
            </Link>
          </div>

          <CourseGrid apiEndpoint="/api/courses" limit={4}    linkPrefix="/lecturer/courses"/>

        </section>

        {/* Assignments to Grade */}
        {/* <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Assignments to Grade</h2>
          <div className="bg-white rounded-sm shadow overflow-hidden">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="py-3 px-6 text-left">Assignment</th>
                  <th className="py-3 px-6 text-left">Course</th>
                  <th className="py-3 px-6 text-left">Due Date</th>
                  <th className="py-3 px-6 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {deadlines.map((item:deadline) => (
                  <tr key={item.id} className="border-t">
                    <td className="py-3 px-6">{item.title}</td>
                    <td className="py-3 px-6">{item.description}</td>
                    <td className="py-3 px-6">
                          {new Date(item.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-blue-600 font-medium hover:underline cursor-pointer">
                      <Link href={`/lecturer/assignments/${item.id}`}>Grade</Link>
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section> */}

          <AssignmentTable
  showGradeLink
  gradeLinkPrefix="/lecturer/assignments"
/>

        
        {/* <ExtensionTable /> */}
      </main>
    </div>
  );
};
export default LecturerDashboard;
