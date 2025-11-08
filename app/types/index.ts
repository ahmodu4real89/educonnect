import { ZodSchema } from "zod";

export type TParametricRequest = Request & { params?: Record<string, string | number> };
export type TRequestParam<T> = { params: T }

export interface PaginateOptions<TWhere, TOrder> {
  where?: TWhere;
  orderBy?: TOrder;
  searchField?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export interface ValidationSchemas {
  headers?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  body?: ZodSchema;
}

export interface ValidateRequestArgs {
  schema: ValidationSchemas;
  req: TParametricRequest
}

export type TRequestSection = 'headers' | 'body' | 'query' | 'params' | 'formData'