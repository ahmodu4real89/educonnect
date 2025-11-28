"use server"
import { Course, Prisma } from "@prisma/client"
import { withPagination } from "../helpers/db.utils"
import prisma from "@/app/lib/prisma"
import { TActionResponse, TRequestQuery, TRole } from "@/common/types"
import { TCreateCourse } from "@/common/course.dto"
import { safe } from "@/common/lib"
import { cookies } from "next/headers"
import { hasRole, withRole } from "../helpers/auth.utils"
import { use } from "react"


export const fetchLecturerCourses = async (params: Prisma.CourseLecturerFindManyArgs) => {
  return safe(prisma.courseLecturer.findMany(params))
}

export const enrollmentQuery = async (params: Prisma.EnrollmentFindManyArgs) => {
  return safe(prisma.enrollment.findMany(params))
}

export const createCourse = async (course: TCreateCourse) => {
  const { status, message, user } = await hasRole(['ADMIN'])
  if (!status) return { data: null, error: message }
  const data = { ...course, createdBy: user?.userId }
  return safe(prisma.course.create({ data }))
}

export const assignCourse = async (params: { courseId: string, lecturerId: string }) => {
  const { courseId, lecturerId } = params
  return safe(prisma.courseLecturer.create({ data: { courseId, lecturerId } }))
}

export const deassignCourse = async (params: { courseId: string, lecturerId: string }) => {
  const { courseId, lecturerId } = params
  // deleteMany is used to avoid any composite key shape typing issues
  return safe(prisma.courseLecturer.deleteMany({ where: { courseId, lecturerId } }))
}
export const updateCourse = async (course: TCreateCourse) => {
  // Expecting course to contain id for updates in future; for now fallback to create
  return safe(prisma.course.create({ data: course }))
}
export const getACourse = async (courseId: string) => {
  return await safe(prisma.course.findFirst({
    where: {
      id: courseId
    },
    include: {
      lecturers: { 
        include: { 
          lecturer: true 
        } 
      },
      assignments: true
    }
  }))
}

export const fetchPaginatedCourses = async (q: TRequestQuery) => {

  const paginate = withPagination({},)

  const { data, error, message, meta, success } = await withRole(['ADMIN'], {
    action: () => prisma.course.findMany(paginate),
    meta: q,
    successMessage: "Courses fetched successfully"
  })

  return { data, error, message, meta, success }
}

export const paginatedAvailableCoursesStudent = async (q: TRequestQuery) => {
  const { user, message, status } = await hasRole(['STUDENT'])

  if (!status) {
    return { message }
  }

  const paginate = withPagination<Prisma.CourseFindManyArgs>({ where: { level: user?.level } },)

  const { data, error, meta } = await safe(prisma.course.findMany(paginate))
  if (error) {
    return { error }
  }

  return { data, error, message, meta }
}

export const fetchCoursesCreatedByAdmin = async (q: TRequestQuery = {}) => {
  const { status, message, user } = await hasRole(['ADMIN'])
  if (!status) return { data: null, error: message }
  // Query courses created by the current admin using Prisma (typed query).
  const paginate = withPagination({ where: { createdBy: user?.userId } } as any)
  const { data, error, meta } = await safe(prisma.course.findMany(paginate))
  return { data, error, meta }
}



export const sampleAvailableCourses = async () => {

  const { status, message, user } = await hasRole(['STUDENT'])

  console.log("iiiiiiiuuu", user)
  if (!status) {
    return { message }
  }



  const { data, error } = await safe(prisma.course.findMany({
    where: {
      level: user?.level,
    },
    take: 4,
  }))

  return {
    message: "Data retrieve successfully",
    data,
    error
  }


}










// export const fetchPaginatedLecturerCourses = async (lecturerId: string, q: TRequestQuery) => withParams<Prisma.CourseLecturerFindManyArgs>(fetchLecturerCourses, {
//   where: {
//     lecturerId
//   },
//   include: {
//     course: true
//   }
// }, q)

// export const fetchStudentCourses = async (studentId: string, q: TRequestQuery) => withParams<Prisma.EnrollmentFindManyArgs>(enrollmentQuery, {
//   where: {
//     studentId
//   },
//   include: {
//     course: true
//   }
// }, q)