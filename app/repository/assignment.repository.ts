import { BreadRepository } from "@/app/lib/helpers";
import prisma from "@/app/lib/prisma";
import { Assignment} from "@prisma/client";

class assignmentRepository extends BreadRepository<Assignment> {
  constructor() {
    super(prisma.assignment);
  }
}

const assignmentRepo = new assignmentRepository()

export default assignmentRepo