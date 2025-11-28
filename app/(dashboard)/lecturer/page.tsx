import AssignmentTable from "@/app/components/AssignmentTable";
import CourseGrid from "@/app/components/CourseGrid";
import ExtensionTable from "@/app/components/ExtensionTable";
import { UserSection } from "@/app/components/UserSection";
import { deadline } from "@/app/lib/types";
import Link from "next/link";
import { paginatedAssignedCourses } from "@/server/actions/enroll_assigned.action";
import { fetchLecturerAssignments } from '@/server/actions/assignment.actions';
import { hasRole } from "@/server/helpers/auth.utils";


const LecturerDashboard = async () => {
  // get lecturer info from session (server-side)
  const { user } = await hasRole(["LECTURER"]) as any;

  // fetch assigned courses for this lecturer
  const { data: assigned = [] } = await paginatedAssignedCourses({} as any) as any;

  // fetch assignments (including submissions) for this lecturer
  const { data: assignments = [] } = await fetchLecturerAssignments() as any;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name || 'Lecturer'}</h1>
        <p className="text-sm text-gray-500 mb-6">You have {Array.isArray(assigned) ? assigned.length : 0} assigned course(s).</p>
        <UserSection />

        {/* My Courses */}
        <section className="mb-10">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold mb-4">My Courses</h2>
            <Link href={"/lecturer/courses"}>
              <span className="text-blue-500 hover:underline">See all courses</span>
            </Link>
          </div>

          <CourseGrid courses={assigned || []} linkPrefix="/lecturer/courses" />

        </section>

        {/* Quick assignments */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Assignments to Grade / Recent</h2>
          <AssignmentTable assignments={assignments || []} role="lecturer" />
        </section>

        {/* <ExtensionTable /> */}
      </main>
    </div>
  );
};
export default LecturerDashboard;
