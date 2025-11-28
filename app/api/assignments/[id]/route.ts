import { NextResponse } from "next/server";
import { updateAssignment, deleteAssignment } from "@/server/actions/assignment.actions";
import { hasRole } from "@/server/helpers/auth.utils";

export async function PUT(req: Request, context: any) {
  const { params } = context || {};
  const { status, message } = await hasRole(["LECTURER"]);
  if (!status) return NextResponse.json({ error: message }, { status: 403 });

  try {
    const body = await req.json();
    const { data, error } = await updateAssignment(params.id, body);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ data, message: "Assignment updated" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: any) {
  const { params } = context || {};
  const { status, message } = await hasRole(["LECTURER"]);
  if (!status) return NextResponse.json({ error: message }, { status: 403 });

  try {
  const { data, error } = await deleteAssignment(params?.id);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ data, message: "Assignment deleted" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
