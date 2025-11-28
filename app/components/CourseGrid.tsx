"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
// import { usePathname } from "next/navigation";
import { enrollStudent } from "@/server/actions/enroll_assigned.action";
import { useTransition, useEffect, useState } from "react";

type Course = {
    name: string;
    id: string;
    code: string;
    level: string;
    description: string | null;
    image: string;
  createdBy: string | null;
}

export default function CourseGrid({ courses = [], enroll = false, linkPrefix = '/student/courses' }: { courses?: Course[], enroll?: boolean, linkPrefix?: string } ) {
  // local state to allow optimistic updates
  const [items, setItems] = useState<Course[]>(courses || [])
  const [isPending, startTransition] = useTransition()

  // keep items in sync if prop changes (e.g., navigation/server render)
  // Only update local state when the incoming courses array actually differs
  useEffect(() => {
    const incoming = courses || []
    const currentIds = items.map((c) => c.id)
    const incomingIds = incoming.map((c) => c.id)

    const same = currentIds.length === incomingIds.length && incomingIds.every((id, i) => id === currentIds[i])
    if (!same) setItems(incoming)
  }, [courses, items])

  // If this grid represents enrolled courses (enroll === false), listen for enroll events
  useEffect(() => {
    if (!enroll) {
      const handler = (e: Event) => {
        try {
          const c = (e as CustomEvent).detail as Course
          // avoid duplicates
          setItems((prev) => (prev.some((p) => p.id === c.id) ? prev : [c, ...prev]))
        } catch (err) {
          // ignore malformed events
        }
      }
      window.addEventListener('course-enrolled', handler as EventListener)
      return () => window.removeEventListener('course-enrolled', handler as EventListener)
    }
  }, [enroll])

  const enrollCourse =  (course: Course) => {
    // optimistic update: remove course from available list immediately
    setItems((prev) => prev.filter((c) => c.id !== course.id))

    startTransition(async () => {
      const {error, message} = await enrollStudent(course)
      if(error){
        // revert optimistic removal
        setItems((prev) => (prev.some((p) => p.id === course.id) ? prev : [course, ...prev]))
        toast.error(message)
      }else{
        toast.success(message)
        // inform any enrolled-course grids to add this course immediately
        try {
          window.dispatchEvent(new CustomEvent('course-enrolled', { detail: course }))
        } catch (e) {
          // older browsers may not support CustomEvent constructor
          const ev = document.createEvent('CustomEvent')
          ;(ev as any).initCustomEvent('course-enrolled', true, true, course)
          window.dispatchEvent(ev)
        }
      }
    })
  }

  return (
    <section className="p-4">
      {items.length === 0 ? (
        <p>No courses available</p>
      ) : (
        <>
          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow rounded-xl overflow-hidden hover:shadow-md transition"
              >
                <Image
                  width={300}
                  height={200}
                  src={course.image}
                  alt={course.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800">{course.name}</h3>
                  <p className="text-gray-500 text-sm">{course.code}</p>
                  <p className="text-gray-500 text-sm">Level: {course.level}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    {course.description}
                  </p>
                  <Link href={(linkPrefix + '/' + course.id) as any}
                    className="block text-center mt-4 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
                  >
                    View Course
                  </Link>
                  {enroll && <button onClick={() => enrollCourse(course)}
                    className="block text-center mt-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition w-full"
                  >
                    Enroll Course
                  </button>}

                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
