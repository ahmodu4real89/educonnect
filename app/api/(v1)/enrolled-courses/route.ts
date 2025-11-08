import { validateRequest, response, isUserAuthenticated, getCurrentUser } from "@/app/lib/helpers";
import { queryParamSchema, TQueryParam } from "@/app/lib/schema";
import { TRequestSection } from "@/app/types";
import enrollmentRepo from "../../../repository/enrollment.repository";
import { Course, Enrollment } from "@prisma/client";

type TEnrolledCourse = Enrollment & { course: Course}[]
export async function GET(req: Request) {


  const validation = await validateRequest({ schema: { query: queryParamSchema }, req })


  if (!validation.success) {
    return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
  }

  const query = validation.data?.query as TQueryParam

  const currentUser = await getCurrentUser(req)


  const { data: courseEnrolled, error, meta } = await enrollmentRepo.paginatedRecords<TEnrolledCourse>({ ...query, where: { studentId: currentUser.id }, include: { course: true } })

  let courses: Course[] = []
  if (courseEnrolled) {
    courses = courseEnrolled.map(e => e.course)
  }


  if (error) {
    response.serverError()
  }

  return response.ok({message: "Your enrolled courses was fetched successfully", data: courses, meta })
}
