"use server"
import prisma from "@/app/lib/prisma"
import { hasRole, withRole } from "../helpers/auth.utils"
import { safe } from "@/common/lib"
import { TRequestQuery } from "@/common/types"
import { withPagination } from "../helpers/db.utils"
import { Course, Prisma } from "@prisma/client"
import { TQueryParam } from "@/app/lib/schema"
import { message } from "antd"

export const enrolledCourses = async () => {

  const { status, message, user } = await hasRole(['STUDENT'])

  if (!status) {
    return { message }
  }

  const { data, error } = await safe(prisma.enrollment.findMany({
    where: {
      studentId: user?.userId
    },
    include: {
      course: true
    },
    take: 4,
  }))

  const course = data?.map(d => d.course)

  return {
    message: "Data retrieve successfully",
    data: course || [],
    error
  }
}

export const paginatedErolledCoursesStudent = async (q: TRequestQuery) => {

  
  const { status, message, user } = await hasRole(['STUDENT'])
  console.log("paginated -================================================", user)
  
  if (!user) {
    return { message }
  }

  const paginate = withPagination({
    where: {
      studentId: user.userId
    },
    include: {
      course: true
    }
  })

  const { data, error } = await safe(prisma.enrollment.findMany(paginate))

  const course = data?.map(d => d.course)

  

  return {
    message: "Data retrieve successfully",
    data: course || [],
    error
  }
}

export const paginatedAssignedCourses = async (q: TQueryParam) => {

  const { status, message, user } = await hasRole(['LECTURER'])

  if (!status) {
    return { message }
  }

  const paginate = withPagination({
    where: {
      lecturerId: user?.userId
    },
    include: {
      course: true
    }
  })

  const { data, error } = await safe(prisma.courseLecturer.findMany(paginate))

  const course = data?.map(d => d.course)

  return {
    message: "Data retrieve successfully",
    data: course || [],
    error
  }
}

export const fetchEnrolledStudents = async (courseId: string) => {
  // only allow lecturer role
  const { status, message, user } = await hasRole(['LECTURER'])
  if (!status) return { data: null, error: message }

  // ensure this lecturer is assigned to the course
  const assigned = await prisma.courseLecturer.findFirst({ where: { courseId, lecturerId: user?.userId } })
  if (!assigned) return { data: null, error: 'You are not assigned to this course' }

  const { data, error } = await safe(prisma.enrollment.findMany({
    where: { courseId },
    include: { student: true }
  }))

  // map to student objects
  const students = data?.map(d => d.student) || []

  return { data: students, error }
}

export const enrollStudent = async (course: Course) => {
  
  const { message, user } = await hasRole(['STUDENT'])

  if(!user) return { message, error: true}

  const {data, error} = await safe(prisma.enrollment.findFirst({where: {
    AND: [{courseId: course.id }, {studentId: user.userId}]
  }}))

  if(error) return  {error: true, message: "Something went wrong, Please try again"}

  if(data) return {message: "You are subscribed", error: false}

  const {error: enrollmentError} = await safe(prisma.enrollment.create({data:{courseId: course.id, studentId: user.userId}}))

  if(enrollmentError) return {message: "Something went wrong, Please try again", error: true}
 return {message: `Successfully enrolled to ${course.code} `, error: false}
}


