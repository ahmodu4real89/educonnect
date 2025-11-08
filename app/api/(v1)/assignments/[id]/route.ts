import { getCurrentUser, response, validateRequest } from "@/app/lib/helpers";
import { assignmentSchema, TAssignmentUpdate } from "../assignment.schema";
import assignmentRepo from "@/app/repository/assignment.repository";
import { TParametricRequest, TRequestParam, TRequestSection } from "@/app/types";
import { idPathParamSchema } from "@/app/lib/schema";

export async function PATCH(req: TParametricRequest, ctx: TRequestParam<{id: string}>) {

    req.params = await ctx.params
    const validation = await validateRequest({ schema: { body: assignmentSchema, params: idPathParamSchema }, req });

    if (!validation.success) {
        return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
    }

    const assignmentId = validation.data?.params.id
    const assignmentInput = validation.data?.body as TAssignmentUpdate
    const currentUser = await getCurrentUser(req)

    if (currentUser.role !== 'LECTURER') {
        return response.unAuthorized()
    }

    const {data:assignment, error:findAssignmentError} = await assignmentRepo.findById(assignmentId)

    if(!findAssignmentError && !assignment){
        return response.notFound()
    }

    if(findAssignmentError){
        return response.serverError()
    }

    let assingmetUpdateError = null
    let assignmentResponse = null
    if(assignment){
        const assignmentUpdated ={
            ...assignment,
            assignmentInput
        }
        const { error, data } = await assignmentRepo.update(assignmentId, assignmentUpdated)
        assingmetUpdateError = error
        assignmentResponse = data
    }

    if (assingmetUpdateError) {
        return response.serverError()
    }

    return response.created(assignmentResponse || {})
}





export async function GET(req: TParametricRequest, ctx: TRequestParam<{ id: string }>) {
  req.params = await ctx.params;

  const validation = await validateRequest({
    schema: { params: idPathParamSchema },
    req,
  });

  if (!validation.success) {
    return response.withValiationError(validation.errors, "params");
  }

  const assignmentId = validation.data?.params.id;
  const currentUser = await getCurrentUser(req);

  if (!currentUser) {
    return response.unAuthorized();
  }

  const { data: assignment, error } = await assignmentRepo.findById(assignmentId);

  if (error) {
    return response.serverError();
  }

  if (!assignment) {
    return response.notFound();
  }

  return response.ok({ data: assignment });

}




// export async function DELETE(req: TParametricRequest, ctx: TRequestParam<{ id: string }>) {
//   req.params = await ctx.params;

//   const validation = await validateRequest({
//     schema: { params: idPathParamSchema },
//     req,
//   });

//   if (!validation.success) {
//     return response.withValiationError(validation.errors, "params");
//   }

//   const assignmentId = validation.data?.params.id;
//   const currentUser = await getCurrentUser(req);

//   if (!currentUser || currentUser.role !== "LECTURER") {
//     return response.unAuthorized();
//   }

//   const { data: assignment, error: findError } = await assignmentRepo.findById(assignmentId);

//   if (findError) {
//     return response.serverError();
//   }

//   if (!assignment) {
//     return response.notFound();
//   }


//   const { error: deleteError } = await assignmentRepo.delete(assignmentId);

//   if (deleteError) {
//     return response.serverError();
//   }

//   return response.ok({ message: "Assignment deleted successfully" });
// }


export async function DELETE(req: TParametricRequest, ctx: TRequestParam<{ id: string }>) {
  req.params = await ctx.params;

  const validation = await validateRequest({
    schema: { params: idPathParamSchema },
    req,
  });

  if (!validation.success) {
    return response.withValiationError(validation.errors, "params");
  }

  const assignmentId = validation.data?.params.id;
  const currentUser = await getCurrentUser(req);

  if (!currentUser || currentUser.role !== "LECTURER") {
    return response.unAuthorized();
  }

  const { data: assignment, error: findError } = await assignmentRepo.findById(assignmentId);

  if (findError) return response.serverError();
  if (!assignment) return response.notFound();

  const { data: deletedAssignment, error: deleteError } = await assignmentRepo.delete(assignmentId);

  if (deleteError) return response.serverError();

  return response.ok({
    message: "Assignment deleted successfully",
    data: deletedAssignment,
  });
}
