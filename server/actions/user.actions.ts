"use server"

import prisma from "@/app/lib/prisma"
import {  TRequestQuery, TRole } from "@/common/types"
import { Prisma, User } from "@prisma/client"
import { withPagination } from "../helpers/db.utils"
import { withRole } from "../helpers/auth.utils"

export const fetchUsers = async (userType: TRole, q: TRequestQuery) => {

  const paginate = withPagination<Prisma.UserFindManyArgs>({ where: {role: userType} })

  const { data, error, message, meta } = await withRole<User[]>(['ADMIN'], {
    action: () => prisma.user.findMany(paginate),
    meta: q,
    successMessage: "Lecturers fetched successfully"
  })

  return { data, error, message, meta }
}



