import Image from "next/image";

import { getACourse } from "@/server/actions/course.actions";
import { Suspense } from "react";
import AssignmentActionDropdown from "@/app/components/widgets/AssignmentActionDropdown";
import AssignmentTable from "@/app/components/AssignmentTable";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const { courseId } = await params
  const { data: course, error } = await getACourse(courseId)

  return (
    <Suspense fallback={<h1>Loading</h1>}>
      <main className="bg-gray-50 flex">
        <div className="relative">
          <div className="sticky top-20">
            {/* Header */}
            <header>
              <h1 className="text-3xl font-bold text-gray-900">{course?.name}</h1>
              <p className="text-gray-500">Course ID: {course?.id}</p>
            </header>

            {/* Course Description */}
            <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{course?.description}</p>

              {/* Lecturer Section */}
              <div className="flex flex-col mt-5">
                {course?.lecturers.map(user =>
                  <section className="p-6 flex items-center space-x-4" key={user.lecturerId}>
                    <Image width={300} height={300} src="https://randomuser.me/api/portraits/men/45.jpg" alt="Lecturer" className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <h3 className="font-medium text-gray-900">{user.lecturer.fullname}</h3>
                      <p className="text-sm text-gray-500">{user.lecturer.email}</p>
                    </div>
                  </section>

                )}
              </div>
            </section>
          </div>
        </div>


        {/* Assignments */}
        <section className="flex-1 ms-4">
          <h2 className="text-lg font-semibold mb-4">Assignments</h2>
          {course?.assignments?.length === 0 ? (
            <p className="text-gray-500">No assignments available</p>
          ) : (
            <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
              <AssignmentTable assignments={course?.assignments || []} tableMode="simple" />
            </div>
          )}
        </section>
      </main>
    </Suspense>
  );
};
export default CoursePage;
