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

    const data = await prisma.request.create({
      data: {
        message: reason,
        assignmentId: String(assignmentId),
        studentId: String(studentId),
        requestedDate: requestedDate ? new Date(requestedDate) : undefined,
      },
    })

    return NextResponse.json({ data }, { status: 201 })
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
        include: { student: true, assignment: true },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(requests)
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
      include: { student: true, assignment: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(requests)
  } catch (err) {
    console.error('extension GET error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
