import { hasRole } from "../helpers/auth.utils"
import prisma from "@/app/lib/prisma"
import { safe } from "@/common/lib"

export const studentDashboard = async () => {

  const {status, message, user} = await hasRole(['STUDENT'])

  if(!status){
    return {message}
  }

  const {data, error} = await safe(prisma.course.findMany({
    where: {
      level: user?.level,
    },
    take: 5,
    include: {
      assignments: {
        where: {
          dueDate: {
            gt: new Date()
          }
        },
        take: 10
      }
    }
  }))

  return {
    message: "Data retrieve successfully",
    data,
    error
  }

 
}

