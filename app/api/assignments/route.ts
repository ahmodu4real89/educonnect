import { NextResponse } from "next/server";
import { createAssignment } from "@/server/actions/assignment.actions";
import { hasRole } from "@/server/helpers/auth.utils";

export async function POST(req: Request) {
  const { status, message } = await hasRole(["LECTURER"]);
  if (!status) {
    return NextResponse.json({ error: message }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { data, error } = await createAssignment(body);
    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json({ data, message: "Assignment created" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
