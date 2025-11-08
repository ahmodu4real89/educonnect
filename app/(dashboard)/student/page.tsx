
import AssignmentTable from "@/app/components/AssignmentTable";
import CourseGrid from "@/app/components/CourseGrid";
import SubmissionTable from "@/app/components/SubmissionTable";
import { UserSection } from "@/app/components/UserSection";
import { authClient } from "@/app/lib/auth-client";



export default async function StudentDashboard()  {
  
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <UserSection />
        </header>

        {/* My Courses */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Level Courses</h2>
         <CourseGrid
          apiEndpoint="/api/courses"
             linkPrefix="/student/courses"
             enroll="/enroll"
          limit={4}  
        />

        
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Courses</h2>
         <CourseGrid
          apiEndpoint="/api/enrolled-courses"
             linkPrefix="/student/courses"
        
          limit={4}  
        />
        </section>

          

        {/* Upcoming Deadlines & Recent Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AssignmentTable/> 

          {/* Recent Submissions */}
          
             {/* <SubmissionTable /> */}
        </div>
      </div>
    </main>
  );

}
  