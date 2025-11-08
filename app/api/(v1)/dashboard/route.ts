import { response, validateRequest } from "@/app/lib/helpers"
import { queryParamSchema, TQueryParam } from "@/app/lib/schema"
import { TRequestSection } from "@/app/types"
import courseRepo from "../../../repository/course.repository"

export async function GET(req: Request) {
 
 
  const validation = await validateRequest({schema: {query: queryParamSchema}, req})


  if(!validation.success){
    return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
  }

  const {page, pageSize, search} = validation.data?.query as TQueryParam

  const {error, data} =  await courseRepo.paginatedRecords({page, pageSize, searchField: "name", searchQuery: search})

  if(error) {
    response.serverError()
  }

  return response.ok(data)
}