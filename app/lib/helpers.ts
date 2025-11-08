import { NextResponse } from "next/server";
import { record, ZodError } from "zod";
import { PaginateOptions, TRequestSection, ValidateRequestArgs } from "../types";
import { auth } from "./auth";
import { Prisma, User } from "@prisma/client";
import { join } from "path";
import { mkdir, writeFile } from "fs/promises";

export async function validateRequest({ schema, req }: ValidateRequestArgs, isFormData: boolean = false) {
    const result: Partial<{ query: any, headers: any, body: any, params: any }> = {};
    let errorType: TRequestSection = 'query'

    try {
        // ✅ Headers
        if (schema.headers) {
            errorType = 'headers'
            const headersObj = Object.fromEntries(req.headers.entries());
            result.headers = schema.headers.parse(headersObj);
        }

        // ✅ Query (from URL)
        if (schema.query) {
            errorType = 'query'
            const url = new URL(req.url);
            const queryObj = Object.fromEntries(url.searchParams.entries());
            result.query = schema.query.parse(queryObj);
        }

        // ✅ Params (if passed in manually, e.g., from Next.js route params)
        if (schema.params && req.params) {
            errorType = 'params'
            result.params = schema.params.parse(req.params);
        }

        // ✅ Body (if POST/PUT)
        if (schema.body) {
            errorType = 'body'
            let body = null
            if (!isFormData) {
                body = await req.json().catch(() => ({}));
            } else {
                const formData = await req.formData();
                body = Object.fromEntries(formData.entries());
            }

            result.body = schema.body.parse(body);
        }

        return { success: true, data: result };
    } catch (err) {
        if (err instanceof ZodError) {
            const errObj: Record<string, any> = {}
            err.issues.forEach(e => {
                const key: string = e.path[0] as string
                errObj[key] = e.message
            })
            return {
                success: false,
                errors: errObj,
                errorType
            };
        }

        return { success: false, errors: [{ message: "Invalid request" }] };
    }
}

export class BreadRepository<T extends { id: string | number }> {
    constructor(protected readonly model: any) { }

    async paginatedRecords<TResult, TWhere = any, TOrder = any>({
        where,
        orderBy,
        searchField,
        searchQuery,
        page = 1,
        pageSize = 10,
        include, // Added include parameter
    }: PaginateOptions<TWhere, TOrder> & { include?: any }) { // Extended type to include include

        try {
            const skip = (page - 1) * pageSize;

            const searchFilter =
                searchField && searchQuery
                    ? {
                        [searchField]: {
                            contains: searchQuery,
                            mode: "insensitive" as const,
                        },
                    }
                    : {};

            const combinedWhere = where
                ? { AND: [where, searchFilter] }
                : searchFilter;

            const [data, total] = await Promise.all([
                this.model.findMany({
                    where: combinedWhere,
                    orderBy,
                    skip,
                    take: pageSize,
                    include, // Added include to findMany
                }),
                this.model.count({ where: combinedWhere }),
            ]);

            const meta = {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            };

            const result = data as TResult

            return { error: null, data: result, meta }

        } catch (error) {
            return { error, data: null }
        }
    }

    async findById(id: string, include?: any) { // Added optional include parameter
        try {
            const data: T = await this.model.findUnique({
                where: { id },
                include // Added include to findUnique
            })
            return { error: null, data };
        } catch (error) {
            return { error, data: null }
        }
    }

    async findByIdWithInclude(id: number, include: any) { // Alternative method for explicit include
        try {
            const data = await this.model.findUnique({
                where: { id },
                include
            })
            return { error: null, data };
        } catch (error) {
            return { error, data: null }
        }
    }

    async create(data: Omit<T, "id">, include?: any) { // Added optional include for create
        try {
            const result = await this.model.create({
                data,
                include // Added include to create (returns created record with relations)
            })
            return { error: null, data: result }
        } catch (error) {
            return { error, data: null }
        }
    }

    async update(id: string | number, data: Partial<T>, include?: any) { // Added optional include parameter
        try {
            const result = await this.model.update({
                where: { id },
                data,
                include // Added include to update (returns updated record with relations)
            });
            return { error: null, data: result }
        } catch (error) {
            return { error, data: null }
        }
    }

    async delete(id: string | number) {
        try {
            await this.model.delete({ where: { id } });
            return { error: null, data: null}
        } catch (error) {
            console.error(error)
            return { error, data: null }
        }
    }


    // Additional method for finding records with include
    async findManyWithInclude(where?: any, include?: any, orderBy?: any) {
        try {
            const data = await this.model.findMany({
                where,
                include,
                orderBy
            });
            return { error: null, data };
        } catch (error) {
            return { error, data: null }
        }
    }
}




export const response = {
    ok(payload?: { message?: string, data?: any, meta?: any }) {
        return NextResponse.json({
            success: true,
            ...payload
        }, { status: 200 })
    },
    withValiationError(errors: any, errorType: TRequestSection) {
        return NextResponse.json({
            success: false,
            errorType,
            errors
        }, { status: 400 })
    },
    created(payload?: Record<string, any>) {
        return NextResponse.json({
            success: true,
            data: payload
        }, { status: 201 })
    },
    serverError(payload?: Record<string, any>) {
        return NextResponse.json({
            success: false,
            ...payload
        }, { status: 500 })
    },
    notFound(payload?: Record<string, any>) {
        return NextResponse.json({
            success: false,
            ...payload
        }, { status: 404 })
    },
    unAuthenticated(payload?: Record<string, any>) {
        return NextResponse.json({
            success: false,
            message: "Unauthorised. User is not authenticated",
            ...payload
        }, { status: 401 })
    },
    unAuthorized(payload?: Record<string, any>) {
        return NextResponse.json({
            success: false,
            message: "Forbidden. Not authorised",
            ...payload
        }, { status: 403 })
    },
    badRequest(payload?: Record<string, any>) {
        return NextResponse.json({
            success: false,
            message: "Bad request",
            ...payload
        }, { status: 403 })
    }
}

export const isUserAuthenticated = async (request: Request) => {

    const userSession = await auth.api.getSession(request);

    return userSession

}

export const getCurrentUser = async (req: Request) => {
    const userSession = await auth.api.getSession(req)
    const user: User = userSession?.user as User

    return user
}


export const fileSystem = {
    async put(
        file: File,
        options: {
            directory?: string;
            filename?: string;
        } = {}
    ): Promise<string> {
        const { directory = 'uploads', filename = `${Date.now()}-${file.name}` } = options;

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create full path
        const fullPath = join(process.cwd(), 'public', directory, filename);

        // Ensure directory exists
        await mkdir(join(process.cwd(), 'public', directory), { recursive: true });

        // Write file
        await writeFile(fullPath, buffer);

        // Return accessible URL
        return `/${directory}/${filename}`;
    },
    async read() {

    }
}