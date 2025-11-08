import { z } from 'zod';

export const courseSchema = z.object({
  code: z.string(),
  description: z.string(),
  name: z.string(),
  level: z.string(),
  lecturerId: z.string(),
});

