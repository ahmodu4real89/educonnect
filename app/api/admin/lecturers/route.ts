import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { hasRole } from '@/server/helpers/auth.utils'

export async function GET() {
  const { status, message } = await hasRole(['ADMIN'])
  if (!status) return NextResponse.json({ message }, { status: 401 })

  const lecturers = await prisma.user.findMany({ where: { role: 'LECTURER' } })
  return NextResponse.json({ data: lecturers })
}
