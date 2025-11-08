import { response, validateRequest } from "@/app/lib/helpers";
import { idPathParamSchema, TIdPathParam } from "@/app/lib/schema";
import { TParametricRequest, TRequestParam, TRequestSection } from "@/app/types";
import courseRepo from "../../../../repository/course.repository";

export async function GET(req: TParametricRequest, ctx: TRequestParam<{ id: number }>) {
    req.params = await ctx.params

    const validation = await validateRequest({ schema: { params: idPathParamSchema }, req });

    if (!validation.success) {
        return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
    }

    const { id } = validation.data?.params as TIdPathParam

    const { error, data } = await courseRepo.findById(id)

    if (error) {
        return response.serverError()
    }

    return response.ok({data})
}


export async function PATCH(req: TParametricRequest, ctx: TRequestParam<{ id: number }>) {
  
  req.params = await ctx.params;

  const validation = await validateRequest({
    schema: { params: idPathParamSchema },
    req,
  });

  if (!validation.success) {
    return response.withValiationError(
      validation.errors,
      validation.errorType as TRequestSection
    );
  }
  
  const { id } = validation.data?.params as TIdPathParam;
  
  const { error: findError, data: existing } = await courseRepo.findById(id);

  if (findError) {
    return response.serverError();
  }

  if (!existing) {
    return response.notFound();
  }
  
  const body = await req.json();

  const { error: updateError, data: updated } = await courseRepo.update(id, body);

  if (updateError) {
    console.error(updateError);
    return response.serverError();
  }

  
  return response.ok({
    message: "Course updated successfully",
    data: updated,
  });
}




export async function DELETE(req: TParametricRequest, ctx: TRequestParam<{ id: string }>) {
    req.params = await ctx.params

    const validation = await validateRequest({ schema: { params: idPathParamSchema }, req });

    if (!validation.success) {
        return response.withValiationError(validation.errors, validation.errorType as TRequestSection)
    }

    const { id  } = validation.data?.params as TIdPathParam

    const { error, data } = await courseRepo.findById(id)

    if(!error && !data){
        return response.notFound()
    }

    if (error) {
        return response.serverError()
        
    }

    const { error: deleteError } = await courseRepo.delete(id);
    if(deleteError){
        return response.serverError()
    }
    return response.ok({
    message: "Assignment deleted successfully.",
    
  });
}

