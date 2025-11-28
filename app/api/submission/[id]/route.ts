import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { safe } from "@/common/lib";
import { hasRole } from "@/server/helpers/auth.utils";
import { fileSystem } from "@/app/lib/helpers";

export async function GET(_req: Request, context: any) {
  try {
    const { params } = context || {};
    // `params` may be a Promise in some Next runtimes - unwrap if necessary
    const paramsObj = params && typeof (params as any)?.then === 'function' ? await params : params;
    const userId = paramsObj?.id ?? params?.id;
    const { data, error } = await safe(
      prisma.submission.findMany({
        where: { studentId: userId },
        include: { assignment: true },
      })
    );

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: any) {
  const { params } = context || {};
  // `params` may be a Promise in some Next runtimes - unwrap if necessary
  const paramsObj = params && typeof (params as any)?.then === 'function' ? await params : params;
  const submissionId = paramsObj?.id ?? params?.id;
  // Ensure we have a submission id to use in Prisma unique where clauses
  if (!submissionId) {
    return NextResponse.json({ error: 'submission id is required in the route params' }, { status: 400 });
  }

  // Inspect Content-Type to decide how to parse the body. This avoids attempting
  // to read the body more than once (which causes "Body has already been read").
  const contentType = (req.headers.get('content-type') || '').toLowerCase();

  // If multipart/form-data -> student updating their submission file
  if (contentType.includes('multipart')) {
    try {
      const formData = await req.formData();

      if (!formData || !formData.get('file')) {
        return NextResponse.json({ error: 'No file provided in multipart request' }, { status: 400 });
      }

  const { status: studentStatus, user: studentUser, message: studentMsg } = await hasRole(['STUDENT']) as any;
  if (!studentStatus) return NextResponse.json({ error: studentMsg }, { status: 403 });

  // use the validated/unwrapped submissionId from above
  const existing = await prisma.submission.findUnique({ where: { id: submissionId } });
      if (!existing) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
      if (existing.studentId !== studentUser.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

      const file = formData.get('file') as any;
      const MAX_BYTES = 3 * 1024 * 1024;
      if (file && typeof file.size === 'number' && file.size > MAX_BYTES) {
        return NextResponse.json({ error: 'File too large. Maximum allowed size is 3MB.' }, { status: 413 });
      }

      let path = existing.content || '';
      if (file) {
        try {
          path = await fileSystem.put(file as File);
        } catch (err) {
          return NextResponse.json({ error: 'Failed to store uploaded file' }, { status: 500 });
        }
      }

      const { data, error } = await safe(
        prisma.submission.update({ where: { id: submissionId }, data: { content: path, submittedAt: new Date() } })
      );

      if (error) return NextResponse.json({ error }, { status: 500 });

      return NextResponse.json({ data, message: 'Submission updated' });
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
  }

  // Else: expect JSON grading request from a lecturer
  const { status, message, user } = await hasRole(["LECTURER"]) as any;
  if (!status) return NextResponse.json({ error: message }, { status: 403 });

  try {
    const payload = await req.json();
    const { grade, feedback } = payload;

    const { data, error } = await safe(
      prisma.submission.update({ where: { id: submissionId }, data: { grade, feedback, gradedAt: new Date(), graderId: user?.userId } })
    );

    if (error) return NextResponse.json({ error }, { status: 500 });

    // create an in-app notification for the student
    try {
      await prisma.notification.create({
        data: {
          message: `Your submission for "${data?.assignmentId}" has been graded. Grade: ${grade ?? "N/A"}`,
          intendedUserId: data!.studentId,
          assignmentId: data!.assignmentId,
          isRead: false,
        },
      });
    } catch (e) {
      console.warn('Failed to create notification', (e as Error).message);
    }

    return NextResponse.json({ data, message: "Grade updated" });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
