
import { courseSchema } from './course.schema';
import { validateRequest, response, isUserAuthenticated, getCurrentUser } from "@/app/lib/helpers";
import courseRepo from "../../../repository/course.repository";
import { queryParamSchema, TQueryParam } from "@/app/lib/schema";
import { TRequestSection } from "@/app/types";


export async function GET(req: Request) {
 
  const validation = await validateRequest({schema: {query: queryParamSchema}, req})


  if(!validation.success){
    return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
  }

  const {page, pageSize, search} = validation.data?.query as TQueryParam

  const currentUser = await getCurrentUser(req)

  let records = null
  let dataError = null
  let pageMeta = null
  if(currentUser.role == 'STUDENT'){
    const {error, data} = await courseRepo.paginatedRecords({page, pageSize, searchField: "name", searchQuery: search, where:{level: currentUser.level}})
    records = data
    dataError = error
  }else if(currentUser.role == 'LECTURER'){
    const {error, data, meta} = await courseRepo.paginatedRecords({page, pageSize, searchField: "name", searchQuery: search, where:{lecturerId: currentUser.id} })
    records = data
    dataError = error
    pageMeta = meta
  }


  if(dataError) {
    response.serverError()
  }

  return response.ok({data: records, meta: pageMeta})
}


export async function POST(req: Request) {
  const validation = await validateRequest({ schema: {body:courseSchema}, req });

  if (!validation.success) {
    return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
  } 

  const currentUser = await getCurrentUser(req)

  if(currentUser.role != 'LECTURER'){
    return response.unAuthorized()
  }


  const {error, data: course} = await courseRepo.create(validation.data?.body)

  if(error){
    return response.serverError()
  }

  return response.created(course)
}

