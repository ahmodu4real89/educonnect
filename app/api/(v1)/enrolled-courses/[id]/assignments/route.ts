import { validateRequest, response, isUserAuthenticated, getCurrentUser } from "@/app/lib/helpers";
import { queryParamSchema, TQueryParam } from "@/app/lib/schema";
import { TParametricRequest, TRequestParam, TRequestSection } from "@/app/types";

export async function GET(req: TParametricRequest, ctx: TRequestParam<{ id: string }>) {

    req.params = await ctx.params
    const validation = await validateRequest({ schema: { query: queryParamSchema }, req })


    if (!validation.success) {
        return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
    }
    

    return response.ok()
}


// export async function POST(req: Request) {
//   const validation = await validateRequest({ schema: {body:courseSchema}, req });

//   if (!validation.success) {
//     return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
//   }

//   const {error, data: course} = courseRepo.create(validation.data?.body)

//   if(error){
//     return response.serverError()
//   }

//   return response.created(course)
// }

