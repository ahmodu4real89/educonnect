import CourseGrid from "@/app/components/CourseGrid";

const Course = () => {
  return (
      <section className="mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">All Courses</h2>
       <CourseGrid  apiEndpoint="/api/enrolled-courses" linkPrefix="/student/courses"/>
    </section>
  )
}

export default Course



