import prisma from "@/app/lib/prisma"


const students = await prisma.user.findMany({
  where: {
    AND: [{ role: "STUDENT" }, { level: "100" }]
  },
  take: 10
})

students.forEach(async (s) => {
  await prisma.enrollment.create({ data: { courseId: "cmhy26a3x0009nvhsqa5uchla", studentId: s.id } })
});