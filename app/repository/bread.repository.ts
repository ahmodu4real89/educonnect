import { PaginateOptions } from "../types";

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
            return { error: null, data: null }
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