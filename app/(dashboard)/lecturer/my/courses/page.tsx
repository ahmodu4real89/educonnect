import CourseGrid from "@/app/components/CourseGrid"
import { paginatedAssignedCourses } from "@/server/actions/enroll_assigned.action"

export default async function MyCourse() {
  const {data} = await paginatedAssignedCourses({page: 1, pageSize: 15})
  return (
    <div>
  <CourseGrid courses={data || []} linkPrefix="/lecturer/courses" />
    </div>
  )
}
