import { response, validateRequest } from "@/app/lib/helpers"
import notificationRepo from "@/app/repository/notification.repositiory"
import { notificationUpdateSchema, TNotificationUpdate } from "../notification.schema"

export async function PATCH(req: Request) {

    const validation = await validateRequest({ schema: { body: notificationUpdateSchema }, req })

    if (!validation.success) {
        return response.withValiationError(validation.errors, 'body')
    }

    const notificationIn = validation.data?.body as TNotificationUpdate

    const { data: notification, error: findNotificationError } = await notificationRepo.findById(notificationIn.id)
    
    if (!notification && !findNotificationError) {
        return response.notFound()
    }
    
    if (findNotificationError) {
        return response.serverError()
    }
    
    let notificationUpdateError = null
    if (notification) {
        const { data, error } = await notificationRepo.update(notification.id, { isRead: notificationIn.isRead })
        notificationUpdateError = error
    }
    

    if (notificationUpdateError) {
        return response.serverError()
    }

    return response.ok({ message: "Update a notification", data: {} })
}