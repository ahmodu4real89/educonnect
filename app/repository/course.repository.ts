import { BreadRepository } from "@/app/lib/helpers";
import prisma from "@/app/lib/prisma";
import { Course } from "@prisma/client";

class CourseRepository extends BreadRepository<Course> {
  constructor() {
    super(prisma.course);
  }


}

const courseRepo = new CourseRepository()

export default courseRepo