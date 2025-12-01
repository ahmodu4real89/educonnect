import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { hasRole } from '@/server/helpers/auth.utils'

export async function PATCH(req: Request, ctx: any) {
  try {
    // Prefer id from route params, but fall back to body.id for robustness
    // In Next.js dynamic route handlers, `ctx.params` may be a Promise and must be awaited
    let routeId: string | undefined = undefined
    if (ctx?.params) {
      try {
        const params = await ctx.params
        routeId = params?.id
      } catch (e) {
        // ignore — we'll fall back to body
      }
    }
    const body = await req.json().catch(() => ({}))
    const requestId = routeId ?? body?.id ?? body?.requestId
    if (!requestId) return NextResponse.json({ error: 'Missing request id' }, { status: 400 })

    const roleCheck = await hasRole(['LECTURER', 'ADMIN']) as any
    if (!roleCheck.status) return NextResponse.json({ error: roleCheck.message }, { status: 401 })

    const { status } = body
    if (!status) return NextResponse.json({ error: 'Missing status' }, { status: 400 })

    // fetch request and related assignment to verify lecturer ownership (if lecturer)
    const existing = await prisma.request.findUnique({ where: { id: requestId }, include: { assignment: true } })
    if (!existing) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

    if (roleCheck.user.role === 'LECTURER') {
      // only allow lecturers assigned to the course to act
      const assigned = await prisma.courseLecturer.findFirst({ where: { courseId: existing.assignment.courseId, lecturerId: roleCheck.user.userId } })
      if (!assigned) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // update request status
    const updated = await prisma.request.update({
      where: { id: requestId },
      data: { status },
      include: { student: true, assignment: { include: { course: true } } },
    })

    // create a notification for the student
    try {
      const assignmentLabel = updated.assignment?.title ?? updated.assignmentId;
      await prisma.notification.create({
        data: {
          message: `Your extension request for "${assignmentLabel}" is ${status}`,
          intendedUserId: updated.studentId,
          assignmentId: updated.assignmentId,
        },
      })
    } catch (notifyErr) {
      console.error('failed to create extension notification', notifyErr)
    }

    // return consistent { data } shape so clients can unwrap reliably
    const resp = { ...updated, requestedDateStr: updated.requestedDate ? updated.requestedDate.toISOString().slice(0,10) : null }
    return NextResponse.json({ data: resp })
  } catch (err) {
    console.error('extension PATCH error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
