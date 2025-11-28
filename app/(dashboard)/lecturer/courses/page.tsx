import CourseGrid from "@/app/components/CourseGrid";
import { paginatedAssignedCourses } from "@/server/actions/enroll_assigned.action";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
const a = [
        <SettingOutlined key="setting" />,
        <EditOutlined key="edit" />,
        <EllipsisOutlined key="ellipsis" />,
      ]
export default async function Course() {

  const {data} = await paginatedAssignedCourses({})

  return (
    <div className="m-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
      </div>
  <CourseGrid courses={data || []} linkPrefix="/lecturer/courses" />
      
    </div>
  );
}
