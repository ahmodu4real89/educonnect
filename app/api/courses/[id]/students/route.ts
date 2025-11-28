import { NextResponse } from "next/server";
import { fetchEnrolledStudents } from "@/server/actions/enroll_assigned.action";

export async function GET(_req: Request, ctx: any) {
  try {
    const courseId = ctx?.params?.id;
    const result = await fetchEnrolledStudents(courseId) as any;

    if (result?.data) {
      return NextResponse.json(result.data);
    }

    const message = result?.error || result?.message || "Not found";
    return NextResponse.json({ error: message }, { status: 403 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
