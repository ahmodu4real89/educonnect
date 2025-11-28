import CourseGrid from "@/app/components/CourseGrid"
import { paginatedErolledCoursesStudent } from "@/server/actions/enroll_assigned.action"

const Course = async () => {
  // show only courses the student is enrolled in
  const { data } = await paginatedErolledCoursesStudent({ page: 1, pageSize: 12 })
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">My Courses</h2>
      <CourseGrid courses={data || []} />
    </section>
  )
}

export default Course



