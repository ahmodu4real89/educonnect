import { BreadRepository } from "@/app/lib/helpers";
import prisma from "@/app/lib/prisma";
import { Enrollment } from "@prisma/client";

class EnrollmentRepository extends BreadRepository<Enrollment> {
  constructor() {
    super(prisma.enrollment);
  }
}


const enrollmentRepo = new EnrollmentRepository()

export default enrollmentRepo