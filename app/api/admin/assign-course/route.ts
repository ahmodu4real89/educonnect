import { NextResponse } from 'next/server'
import { hasRole } from '@/server/helpers/auth.utils'
import prisma from '@/app/lib/prisma'

export async function POST(req: Request) {
  const { status, message } = await hasRole(['ADMIN'])
  if (!status) return NextResponse.json({ message }, { status: 401 })

  const body = await req.json()
  const { courseId, lecturerId } = body
  if (!courseId || !lecturerId) return NextResponse.json({ message: 'courseId and lecturerId are required' }, { status: 400 })

  try {
    const data = await prisma.courseLecturer.create({ data: { courseId, lecturerId } })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
