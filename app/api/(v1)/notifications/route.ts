import { getCurrentUser, response, validateRequest } from "@/app/lib/helpers";
import { queryParamSchema, TQueryParam } from "@/app/lib/schema";
import notificationRepo from "@/app/repository/notification.repositiory";
import { Assignment, Notification } from "@prisma/client";
import { notificationCreateSchema, TNotificationCreate } from "./notification.schema";
import assignmentRepo from "@/app/repository/assignment.repository";

export async function GET(req: Request) {

    const validation = await validateRequest({ schema: { query: queryParamSchema }, req })

    if (!validation.success) {
        return response.withValiationError(validation.errors, 'query')
    }

    const currentUser = await getCurrentUser(req)

    const { page, pageSize, search } = validation.data?.query as TQueryParam

    const {data: notifications, meta, error: dbError} = await notificationRepo.paginatedRecords<Notification[]>({page, pageSize, searchField: "name", searchQuery: search, where:{intendedUserId: currentUser.id} })

    if (dbError) {
        return response.serverError()
    }

    return response.ok({ message: "Notifications", data: notifications, meta: meta })
}

export async function POST(req: Request) {

    const validation = await validateRequest({ schema: { body: notificationCreateSchema}, req })

    if (!validation.success) {
        return response.withValiationError(validation.errors, 'body')
    }

    const notification = validation.data?.body as TNotificationCreate

    let messageMeta = {
        user: "",
        entity: ""
    }
    if(notification.assignmentId){
        const {data} = await assignmentRepo.findById(notification.assignmentId)
       messageMeta.entity = JSON.stringify(data || '')
       messageMeta.user = notification.message
        
    }
    
    const {data, error: dbError} = await notificationRepo.create({message: JSON.stringify(messageMeta), intendedUserId: notification.intendedUserId, isRead: false, createdAt: new Date(), assignmentId: notification.assignmentId || ''})

    if (dbError) {
        return response.serverError()
    }

    return response.created({ message: "Create a notification", data: {}})
}