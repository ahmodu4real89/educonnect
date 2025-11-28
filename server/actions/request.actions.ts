"use server"
import prisma from "@/app/lib/prisma"
import { safe } from "@/common/lib"
import { hasRole } from "@/server/helpers/auth.utils"

export const createRequest = async(request: {message: string, assignmentId: string, requestedDate?: string} ) => {
  const { status, message, user } = await hasRole(['STUDENT'])
  if (!status) return { error: message, data: null }

  const payload: any = {
    message: request.message,
    assignmentId: String(request.assignmentId),
    studentId: user?.userId,
  }

  if (request.requestedDate) payload.requestedDate = new Date(request.requestedDate)

  const {data, error} = await safe(prisma.request.create({data: payload}))
  if(error) return {error: "something went wrong", data: null}

  return {error: null, message: "request submitted", data}
}