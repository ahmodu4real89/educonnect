
import { validateRequest, response, getCurrentUser } from "@/app/lib/helpers";
import { queryParamSchema, TQueryParam } from "@/app/lib/schema";
import { TRequestSection } from "@/app/types";
import { assignmentSchema } from "./assignment.schema";
import assignmentRepo from "../../../repository/assignment.repository";


export async function GET(req: Request) {

  const validation = await validateRequest({ schema: { query: queryParamSchema }, req })


  if (!validation.success) {
    return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
  }

  const { page, pageSize, search } = validation.data?.query as TQueryParam

  const currentUser = await getCurrentUser(req)



  if (currentUser.role != 'LECTURER') {
    response.unAuthorized()

  }
  const { error, data, meta } = await assignmentRepo.paginatedRecords({ page, pageSize, searchField: "name", searchQuery: search, where: { lecturerId: currentUser.id } })




  if (error) {
    response.serverError()
  }

  return response.ok({ message: "Success: List of assignments", data, meta })
}


export async function POST(req: Request) {
  const validation = await validateRequest({ schema: { body: assignmentSchema }, req });

  if (!validation.success) {
    return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
  }

  const currentUser = await getCurrentUser(req)

  let result = null
  let dataError = null



  if (currentUser.role !== 'LECTURER') {
    return response.unAuthorized()
  }

  if (currentUser.role == 'LECTURER') {
    const { error, data } = await assignmentRepo.create({ ...validation.data?.body, lecturerId: currentUser.id })
    dataError = error
    result = data
  }

  if (dataError) {
    return response.serverError()
  }

  return response.created(result)
}

