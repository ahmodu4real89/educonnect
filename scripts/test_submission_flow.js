const { PrismaClient } = require('@prisma/client');

(async () => {
  const prisma = new PrismaClient();
  try {
    console.log('Starting submission flow test...');

    // find or create a test student
    let student = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    if (!student) {
      student = await prisma.user.create({ data: { fullname: 'Test Student', email: `test-student+${Date.now()}@example.com`, password: 'x', level: '100', gender: 'MALE', role: 'STUDENT' } });
      console.log('Created test student', student.id);
    } else {
      console.log('Using existing student', student.id);
    }

    // find or create a test course
    let course = await prisma.course.findFirst();
    if (!course) {
      course = await prisma.course.create({ data: { name: 'Test Course', code: `TST${Date.now()}`, level: '100', description: 'Test course' } });
      console.log('Created test course', course.id);
    }

    // find or create a test assignment
    let assignment = await prisma.assignment.findFirst({ where: { courseId: course.id } });
    if (!assignment) {
      assignment = await prisma.assignment.create({ data: { title: 'Test Assignment', description: 'For testing', dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24), courseId: course.id } });
      console.log('Created test assignment', assignment.id);
    } else {
      console.log('Using existing assignment', assignment.id);
    }

    // Clean previous submissions for safety
    await prisma.submission.deleteMany({ where: { assignmentId: assignment.id, studentId: student.id } });

    // Create a submission
    const s1 = await prisma.submission.create({ data: { studentId: student.id, assignmentId: assignment.id, content: '/uploads/test1.pdf' } });
    console.log('Created submission', s1.id);

    // Try to create a duplicate submission (should fail once DB unique constraint is applied)
    try {
      const s2 = await prisma.submission.create({ data: { studentId: student.id, assignmentId: assignment.id, content: '/uploads/test2.pdf' } });
      console.log('Duplicate submission was created (DB unique constraint not applied). Created id:', s2.id);
      console.log('You should apply the Prisma migration to enforce uniqueness at DB level.');
      // cleanup the second one to restore single-submission invariant in DB
      await prisma.submission.delete({ where: { id: s2.id } });
    } catch (dupErr) {
      console.log('Duplicate submission failed as expected (unique constraint in place):', dupErr.message || dupErr);
    }

    // Update existing submission (simulate student update)
    const updated = await prisma.submission.update({ where: { id: s1.id }, data: { content: '/uploads/test1-updated.pdf', submittedAt: new Date() } });
    console.log('Updated submission content ->', updated.content);

    // Lecturer grades the submission (simulate)
    const graded = await prisma.submission.update({ where: { id: s1.id }, data: { grade: 85, feedback: 'Good work', gradedAt: new Date() } });
    console.log('Graded submission:', graded.id, 'grade:', graded.grade);

    // Create notification to student (simulate server behavior)
    const notif = await prisma.notification.create({ data: { message: `Your submission for assignment ${assignment.id} has been graded. Grade: ${graded.grade}`, intendedUserId: student.id, assignmentId: assignment.id } });
    console.log('Created notification:', notif.id);

    console.log('Submission flow test complete.');
  } catch (e) {
    console.error('Test failed:', e);
  } finally {
    await prisma.$disconnect();
  }
})();
