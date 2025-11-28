import CourseGrid from "@/app/components/CourseGrid"
import { paginatedErolledCoursesStudent } from "@/server/actions/enroll_assigned.action"

export default async function MyCourse() {
  const { data } = await paginatedErolledCoursesStudent({ page: 1, pageSize: 15 })
  return (
    <div>
      <CourseGrid courses={data || []
      } />
    </div>
  )
}
