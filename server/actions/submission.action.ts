"use server"

import { fileSystem } from "@/app/lib/helpers"
import prisma from "@/app/lib/prisma"
import { safe } from "@/common/lib"
import { hasRole } from "../helpers/auth.utils"

type TSubmission = { content: FormData, assignmentId: string }

export const submitAssignment = async (sub: TSubmission) => {
  const { user, error: authError } = await hasRole(["STUDENT"]);

  if (authError) return { data: null, error: authError, message: null };
  const { content } = sub;
  const file = content.get("file") as File | null;
  let path = "";

  try {
    if (file) {
      path = await fileSystem.put(file);
    }
  } catch (e) {
    return { data: null, error: "Failed to store uploaded file", message: null };
  }

  const studentId = user?.userId || "";

  try {
    // Check if a submission already exists for this student and assignment
    const existing = await prisma.submission.findFirst({ where: { assignmentId: sub.assignmentId, studentId } });

    if (existing) {
      // update existing submission (student is allowed to update their own submission)
      const { data, error } = await safe(
        prisma.submission.update({ where: { id: existing.id }, data: { content: path || existing.content, submittedAt: new Date() } })
      );

      if (error) return { data: null, error: "Something went wrong while updating submission", message: null };
      return { data, error: null, message: "Submission updated" };
    }

    // create new submission
    const submission = { studentId, content: path, assignmentId: sub.assignmentId };
    const { data, error } = await safe(prisma.submission.create({ data: submission }));
    if (error) return { data: null, error: "Something went wrong while saving submission", message: null };

    return { data, error: null, message: "Submission successful" };
  } catch (e) {
    return { data: null, error: (e as Error).message, message: null };
  }
};