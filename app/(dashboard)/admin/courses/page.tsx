import AddCourseButton from "@/app/components/widgets/AddCourseButton";
import EditCourseButton from "@/app/components/widgets/EditCourseButton";
import { fetchPaginatedCourses } from "@/server/actions/course.actions";

export default async function CourseList() {
  
  const {data: courses} = await fetchPaginatedCourses({})

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>
        <AddCourseButton />
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses?.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.code}</td>
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2 text-gray-600">{c.description}</td>
                <td className="px-4 py-2 text-gray-600">
                  <EditCourseButton course={c} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}
