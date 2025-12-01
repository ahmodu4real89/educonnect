import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { hasRole } from '@/server/helpers/auth.utils'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { studentId, assignmentId, reason, requestedDate } = body

    if (!studentId || !assignmentId || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // only students can create extension requests
    const { status, message } = await hasRole(['STUDENT'])
    if (!status) return NextResponse.json({ error: message }, { status: 401 })

    // Normalize date-only strings (YYYY-MM-DD) to avoid timezone shifts
    const parseRequestedDate = (d: any) => {
      if (!d) return undefined
      // If date is in YYYY-MM-DD form, set it to noon UTC so conversion to local
      // time does not move it to the previous/next day in some zones.
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        return new Date(`${d}T12:00:00.000Z`)
      }
      return new Date(d)
    }

    const data = await prisma.request.create({
      data: {
        message: reason,
        assignmentId: String(assignmentId),
        studentId: String(studentId),
        requestedDate: parseRequestedDate(requestedDate),
      },
    })

    const resp = {
      ...data,
      requestedDateStr: data.requestedDate ? data.requestedDate.toISOString().slice(0, 10) : null,
    }

    return NextResponse.json({ data: resp }, { status: 201 })
  } catch (err) {
    console.error('extension POST error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const roleCheck = await hasRole(['LECTURER', 'ADMIN'])
    if (!roleCheck.status) return NextResponse.json({ error: roleCheck.message }, { status: 401 })

    const user = roleCheck.user

    // If admin, return all requests
    if (user?.role === 'ADMIN') {
      const requests = await prisma.request.findMany({
        include: { student: true, assignment: { include: { course: true } } },
        orderBy: { createdAt: 'desc' },
      })
      const mapped = requests.map((r) => ({ ...r, requestedDateStr: r.requestedDate ? r.requestedDate.toISOString().slice(0, 10) : null }))
      return NextResponse.json(mapped)
    }

    // For lecturers, return requests for assignments in their courses
    const requests = await prisma.request.findMany({
      where: {
        assignment: {
          course: {
            lecturers: {
              some: { lecturerId: user?.userId },
            },
          },
        },
      },
      include: { student: true, assignment: { include: { course: true } } },
      orderBy: { createdAt: 'desc' },
    })
    const mapped = requests.map((r) => ({ ...r, requestedDateStr: r.requestedDate ? r.requestedDate.toISOString().slice(0, 10) : null }))
    return NextResponse.json(mapped)
  } catch (err) {
    console.error('extension GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
