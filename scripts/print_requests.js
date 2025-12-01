const { PrismaClient } = require('@prisma/client');

(async function() {
  const prisma = new PrismaClient();
  try {
    const rows = await prisma.request.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { student: true, assignment: true },
    });

    console.log('Latest requests (showing requestedDate and createdAt):');
    for (const r of rows) {
      console.log(`- id=${r.id} student=${r.student?.fullname || r.studentId} assignment=${r.assignment?.title || r.assignmentId}`);
      console.log(`  requestedDate=${r.requestedDate?.toISOString() ?? 'null'}`);
      console.log(`  createdAt=${r.createdAt.toISOString()}`);
    }
  } catch (e) {
    console.error('Failed to read requests:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
