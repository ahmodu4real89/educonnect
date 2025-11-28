import { PAGINATION } from "@/common/constants";
import { TRequestQuery } from "@/common/types";

// export const withParams = async <T extends Record<string, unknown>>(callback: (args: T) => unknown, params: T, extras: TRequestQuery = PAGINATION) => {

//     const { page, pageSize, search } = extras
//     const skip = ((page || 1) - 1) * (pageSize || 15)

//     const paginate = {
//         take: pageSize || 15,
//         skip
//     }
//     const searchFilter = search?.field && search.value ? {
//         [search.field]: {
//             contains: search.value,
//             mode: "insensitive" as const,
//         },
//     } : {};

//     const combinedWhere = params.where ? { AND: [params.where, searchFilter] } : searchFilter;

//     const query = {
//         ...params,
//         where: combinedWhere,
//         ...paginate
//     }

//     return {
//         data: await callback(query) as T,
//         meta: {
//             page,
//             pageSize
//         }
//     }
// }
export const withPagination = <T extends Record<string, unknown>>( params: T, extras: TRequestQuery = PAGINATION) => {

    const { page, pageSize, field, value } = extras
    const skip = ((page || 1) - 1) * (pageSize || 15)

    const paginate = {
        take: pageSize || 15,
        skip
    }
    const searchFilter = field && value ? {
        [field]: {
            contains: value,
            mode: "insensitive" as const,
        },
    } : {};

    const combinedWhere = params.where ? { AND: [params.where, searchFilter] } : searchFilter;

    return {
        ...params,
        where: combinedWhere,
        ...paginate
    } as T


}

export const handleDBError = (e: unknown) => {
    return "Something went wrong"
}

