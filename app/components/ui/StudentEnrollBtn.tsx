"use client"
import { enrollStudent } from '@/server/actions/enroll_assigned.action'
import { Course } from '@prisma/client'
import React from 'react'
import { toast } from 'react-toastify'

export default function StudentEnrollBtn({course}: {course:Course}) {
  const enrollCourse = async (course: Course) => {
    const { error, message } = await enrollStudent(course)
    if (error) {
      toast.error(message)
    } else {
      toast.success(message)
    }
      toast.success("message" )

  }
  return (
    <>
      <button onClick={() => enrollCourse(course)}
        className="block text-center mt-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition w-full"
      >
        Enrol Course
      </button>
    </>
  )
}
