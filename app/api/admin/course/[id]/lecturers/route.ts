import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { hasRole } from '@/server/helpers/auth.utils'

export async function GET(req: Request, context: any) {
  const { status, message } = await hasRole(['ADMIN'])
  if (!status) return NextResponse.json({ message }, { status: 401 })

  const courseId = context?.params?.id
  const course = await prisma.course.findUnique({ where: { id: courseId }, include: { lecturers: { include: { lecturer: true } } } })
  return NextResponse.json({ data: course?.lecturers || [] })
}
