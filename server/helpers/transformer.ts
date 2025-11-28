export function extractAssignmentsWithCourseInfoGeneric<T extends {
  course: {
    id: string;
    name: string;
    code: string;
    assignments: any[];
  };
}>(enrollments: T[]) {
  return enrollments.flatMap((enrollment) => {
    const { course } = enrollment;
    const assignments = course.assignments;

    if (!Array.isArray(assignments)) return [];

    return assignments.map((a) => ({
      ...a,
      courseId: course.id,
      courseName: course.name,
      courseCode: course.code,
    }));
  });
}
