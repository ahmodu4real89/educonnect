import { z } from 'zod'

export const submitAssignmentSchema = z.object({
    file: z.file(),
    score:z.int(),
})