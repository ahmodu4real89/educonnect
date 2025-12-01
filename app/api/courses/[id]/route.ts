import { NextResponse } from "next/server";
import { getACourse } from "@/server/actions/course.actions";

export async function GET(_req: Request, ctx: any) {
  try {
    // Next.js may provide `params` as a Promise in route handlers — unwrap it.
    const params = await ctx?.params;
    let courseId = params?.id;
    if (Array.isArray(courseId)) courseId = courseId[0];
    // debug log to diagnose missing id requests
    console.debug('[API] GET /api/courses/[id] - incoming courseId:', courseId);
    if (!courseId) {
      return NextResponse.json({ error: 'Missing course id' }, { status: 400 });
    }
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
