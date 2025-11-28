
import AssignmentTable from "@/app/components/AssignmentTable";
import CourseGrid from "@/app/components/CourseGrid";
import { UserSection } from "@/app/components/UserSection";
import { sampleAvailableCourses } from "@/server/actions/course.actions";
import { enrolledCourses } from "@/server/actions/enroll_assigned.action";
import { course } from "@/server/db/seeders/course.seeder";
import Link from "next/link";



export default async function StudentDashboard() {

  const {data, error} = await sampleAvailableCourses()
  const {data:enrolledCourseList, error:enrolledError} = await enrolledCourses()
  console.log(enrolledCourseList, error, enrolledError)

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div>
        {/* Header */}
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <UserSection />
        </header>

        {/* My Courses */}
        <section className="mb-10">
          <div className="text-2xl font-bold text-gray-900 mb-4 flex justify-between"><h2>Available Courses</h2> <Link href="/student/courses" className="text-sm text-blue-500">View All</Link></div>
          <CourseGrid courses={data || []} enroll={true}/>


          <div className="text-2xl font-bold text-gray-900 mb-4 flex justify-between"><h2>My Courses</h2> <Link href="/student/my/courses" className="text-sm text-blue-500">View All</Link></div>
          <CourseGrid courses={enrolledCourseList || []}/>
        </section>



        {/* Upcoming Deadlines & Recent Submissions */}
        <div>
          {/* <AssignmentTable  /> */}

          {/* Recent Submissions */}

          {/* <SubmissionTable /> */}
        </div>
      </div>
    </main>
  );

}
