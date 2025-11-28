import z from "zod";

export const createCourseDto = z.object({
  name: z.string().min(5, "Course title is required"),
  image: z.optional(z.string()),
  code: z.string().nonempty({ message: "Course Code is required" }),
  level: z.enum(['100', '200', '300', '400', '500', '600'], "Select a level"),
  description: z.optional(z.string())
})

export type TCreateCourse = z.infer<typeof createCourseDto>