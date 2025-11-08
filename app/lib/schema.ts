import z from "zod";

export const queryParamSchema = z.object({
  search: z.optional(z.string()),
  page: z.optional(z.coerce.number()),
  pageSize: z.optional(z.coerce.number()),
})

export type TQueryParam = z.infer<typeof queryParamSchema>

export const idPathParamSchema = z.object({
  id: z.coerce.string(),
})

export type TIdPathParam =  z.infer<typeof idPathParamSchema>
