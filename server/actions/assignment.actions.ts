// lecturer - create, update(extend), view, list, delete, create course, update a course, browse course, delete a course
// student - submit assignent, request extension, browse assignment, enroll course

import { safe } from "@/common/lib"
import { hasRole } from "../helpers/auth.utils"
import prisma from "@/app/lib/prisma"
import { withPagination } from "../helpers/db.utils"
import { Assignment, Prisma } from "@prisma/client"

export const fetchCourseAssignment = async (courseId: string) => {

  const { status, message } = await hasRole(['STUDENT', 'LECTURER'])

  if (!status) {
    return { message }
  }

  const paginate = withPagination<Prisma.AssignmentFindManyArgs>({
    where: {
      courseId: courseId
    }
  })

  const { data, error } = await safe(prisma.assignment.findMany(paginate))

  return {
    message: "Data retrieve successfully",
    data,
    error
  }


}

export const createAssignment = async (newAssignment: Assignment) => {
  const { status, user, message } = await hasRole(['LECTURER'])

  if (!status) {
    return { data: null, error: message }
  }

  // ensure lecturer is assigned to the course
  const assigned = await prisma.courseLecturer.findFirst({ where: { courseId: newAssignment.courseId, lecturerId: user?.userId } })
  if (!assigned) {
    return { data: null, error: 'You are not assigned to this course' }
  }

  const { data, error } = await safe(prisma.assignment.create({ data: newAssignment }))

  return {
    data,
    error
  }
}

export const updateAssignment = async (assignmentId: string, payload: Partial<Assignment>) => {
  const { status, user, message } = await hasRole(['LECTURER'])
  if (!status) return { data: null, error: message }

  try {
    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } })
    if (!assignment) return { data: null, error: 'Assignment not found' }

    const assigned = await prisma.courseLecturer.findFirst({ where: { courseId: assignment.courseId, lecturerId: user?.userId } })
    if (!assigned) return { data: null, error: 'You are not authorized to update this assignment' }

    const { data, error } = await safe(prisma.assignment.update({ where: { id: assignmentId }, data: payload }))
    return { data, error }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export const deleteAssignment = async (assignmentId: string) => {
  const { status, user, message } = await hasRole(['LECTURER'])
  if (!status) return { data: null, error: message }

  try {
    const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } })
    if (!assignment) return { data: null, error: 'Assignment not found' }

    const assigned = await prisma.courseLecturer.findFirst({ where: { courseId: assignment.courseId, lecturerId: user?.userId } })
    if (!assigned) return { data: null, error: 'You are not authorized to delete this assignment' }

    const { data, error } = await safe(prisma.assignment.delete({ where: { id: assignmentId } }))
    return { data, error }
  } catch (e) {
    return { data: null, error: (e as Error).message }
  }
}

export const fetchMyAssignmentStudent = async () => {
  const { user, message } = await hasRole(['STUDENT'])
  const {data, error} = await safe(prisma.assignment.findMany({
    where: { course: { 
      enrollments: { 
        some: { 
          studentId:  user?.userId 
        } 
      } 
    } 
  },
   include: {
    course: true,
    submissions: {
      where: { studentId: user?.userId },
      take: 1
    }
  }
  }))
  // const { data, error } = await safe(prisma.enrollment.findMany({
  //   where: {
  //     studentId: user?.userId
  //   },
  //   include: {
  //     course: {
  //       include: {
  //         assignments: {
  //           include: {
  //             submissions: {
  //               where: {
  //                 studentId: user?.userId,
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }))

  if (data) return { data, error, message: "success" }

  return { data: null, error: "Something went wrong", message }
}

export const fetchLecturerAssignments = async () => {
  const { status, user, message } = await hasRole(['LECTURER']) as any
  if (!status) return { data: null, error: message }

  const { data, error } = await safe(prisma.assignment.findMany({
    where: {
      course: {
        lecturers: {
          some: { lecturerId: user?.userId }
        }
      }
    },
    include: {
      course: true,
      submissions: {
        include: { student: true }
      }
    },
    orderBy: { dueDate: 'desc' }
  }))

  return { data, error, message: 'success' }
}




