import { z } from 'zod'

export const assignmentSchema = z.object({
    title: z.string(),
    description: z.string(),
    dueDate: z.coerce.date(),
    extensible: z.boolean(),
    courseId: z.string(),
})

export type TAssignmentUpdate = z.infer<typeof assignmentSchema>