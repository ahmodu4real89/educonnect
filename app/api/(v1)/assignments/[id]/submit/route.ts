import { validateRequest, response, getCurrentUser, fileSystem } from "@/app/lib/helpers";
import { idPathParamSchema} from "@/app/lib/schema";
import { TParametricRequest, TRequestParam, TRequestSection } from "@/app/types";
import assignmentRepo from "../../../../../repository/assignment.repository";
import submissionRepo from "@/app/repository/submission.repository";
import { submitAssignmentSchema } from "./submit.schema";


export async function POST(req: TParametricRequest, ctx: TRequestParam<{ id: string }>) {

    req.params = await ctx.params
    const validation = await validateRequest({ schema: { params: idPathParamSchema, body: submitAssignmentSchema }, req }, true)


    if (!validation.success) {
        return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
    }

    const assignmentId = validation.data?.params.id
    
    const currentUser = await getCurrentUser(req)

    if (currentUser.role != 'STUDENT') {
        return response.unAuthorized()
    }

    const { data, error } = await assignmentRepo.findById(assignmentId)


    if (!error && !data) {
        return response.notFound()
    }

    if (error) {
        return response.serverError()
    }

    
    const url = await fileSystem.put(validation.data?.body.file)
    const { data: submissionData, error: dbError } = await submissionRepo.create({
        studentId: currentUser.id,
        assignmentId,
        fileUrl: url,
        score:  null,
        submittedAt: new Date()
    })

    if (dbError) {
        return response.serverError()
    }


    return response.ok({
        message: "Submission success",
        data: "submissionData"
    })
}
