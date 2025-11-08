import z from "zod";

export const notificationCreateSchema = z.object({
    message: z.string(),
    assignmentId: z.optional(z.string()),
    intendedUserId: z.string()
})
export type TNotificationCreate = z.infer<typeof notificationCreateSchema>

export const notificationUpdateSchema = z.object({
    id: z.string(),
    isRead: z.boolean()
})

export type TNotificationUpdate = z.infer<typeof notificationUpdateSchema>