const { PrismaClient } = require('@prisma/client');
(async () => {
  const p = new PrismaClient();
  try {
    const subs = await p.submission.findMany({ orderBy: { submittedAt: 'asc' } });
    const groups = {};
    for (const s of subs) {
      const key = `${s.assignmentId}|${s.studentId}`;
      groups[key] = groups[key] || [];
      groups[key].push(s);
    }

    let removed = 0;
    for (const key of Object.keys(groups)) {
      const arr = groups[key];
      if (arr.length > 1) {
        const keep = arr[arr.length - 1];
        const toRemove = arr.slice(0, -1);
        for (const r of toRemove) {
          await p.submission.delete({ where: { id: r.id } });
          removed++;
          console.log('deleted duplicate submission', r.id);
        }
      }
    }

    console.log('dedupe complete, removed', removed);
  } catch (e) {
    console.error(e);
  } finally {
    await p.$disconnect();
  }
})();
