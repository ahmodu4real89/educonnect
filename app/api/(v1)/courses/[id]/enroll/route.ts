import { getCurrentUser, response, validateRequest } from "@/app/lib/helpers";
import { TParametricRequest, TRequestParam, TRequestSection } from "@/app/types";
import enrollmentRepo from "../../../../../repository/enrollment.repository";
import { idPathParamSchema } from "@/app/lib/schema";
import courseRepo from "../../../../../repository/course.repository";

export async function POST(req: TParametricRequest, ctx: TRequestParam<{ id: string }>) {
    req.params = await ctx.params

    const validation = await validateRequest({ schema: { params: idPathParamSchema }, req });

    if (!validation.success) {
        return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
    }

    const courseId = validation.data?.params.id
    const currentUser = await getCurrentUser(req)

    if (currentUser.role != 'STUDENT') {
        return response.unAuthorized()
    }

    const {data: course, error: courseError} = await courseRepo.findById(courseId)

    if(courseError){
        response.serverError()
    }

    if(course?.level && course.level > currentUser.level){
        response.badRequest({message: "Cannot enroll for course above your current level"})
    }


    const { error, data: enrollment } = await enrollmentRepo.create({ studentId: currentUser.id, courseId , status: 'ACTIVE', cancelledAt: null, completedAt: null, enrolledAt: new Date() })

    if (error) {
        return response.serverError()
    }

    return response.created(enrollment)
}
