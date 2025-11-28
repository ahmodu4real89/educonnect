import { NextResponse } from "next/server";
import { getACourse } from "@/server/actions/course.actions";

export async function GET(_req: Request, ctx: any) {
  try {
    const courseId = ctx?.params?.id;
    const result = await getACourse(courseId) as any;

    if (result?.data) {
      return NextResponse.json(result.data);
    }

    // If no data, return a 404 with message
    const message = result?.message || result?.error || "Course not found";
    return NextResponse.json({ error: message }, { status: 404 });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
