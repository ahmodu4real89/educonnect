import { BreadRepository } from "@/app/lib/helpers";
import prisma from "@/app/lib/prisma";
import {  Submission } from "@prisma/client";

class SubmissionRepository extends BreadRepository<Submission> {
  constructor() {
    super(prisma.submission);
  }


}

const submissionRepo = new SubmissionRepository()

export default submissionRepo