import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/prisma";
import { safe } from "@/common/lib";
import { submitAssignment } from '@/server/actions/submission.action';

export async function GET(req: NextRequest) {
  try {
    // Use NextRequest.nextUrl which is safe in Next runtimes and exposes searchParams
    const assignmentId = req.nextUrl.searchParams.get("assignmentId");

    if (!assignmentId) {
      return NextResponse.json({ error: "assignmentId required" }, { status: 400 });
    }

    const { data, error } = await safe(
      prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
          submissions: {
            include: { student: true },
          },
        },
      })
    );

    if (error) return NextResponse.json({ error }, { status: 500 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const assignmentId = req.nextUrl.searchParams.get('assignmentId');

    if (!assignmentId) {
      return NextResponse.json({ error: 'assignmentId required' }, { status: 400 });
    }

    const formData = await req.formData();

    const file = formData.get('file') as any;
    const MAX_BYTES = 3 * 1024 * 1024; // 3MB
    if (file && typeof file.size === 'number' && file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large. Maximum allowed size is 3MB.' }, { status: 413 });
    }

    const result = await submitAssignment({ content: formData, assignmentId } as any);

    if (result?.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data, message: result.message || 'Submission successful' });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
