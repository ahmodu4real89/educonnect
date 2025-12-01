const { PrismaClient } = require('@prisma/client');

/**
 * Migration/cleanup script:
 * - Finds notifications that reference an assignment via `assignmentId`.
 * - For each notification, fetch the assignment title and update the
 *   notification message to include the assignment title if it doesn't already.
 *
 * This script is non-destructive: it logs proposed changes and only updates
 * records if the new message differs from the existing one.
 *
 * Usage:
 *   node scripts/migrate_notifications_add_titles.js
 */

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('Scanning notifications for assignment titles...');
    const notifications = await prisma.notification.findMany({ where: { NOT: { assignmentId: null } } });
    console.log(`Found ${notifications.length} notifications with assignmentId set.`);

    let updated = 0;

    for (const n of notifications) {
      try {
        const assignment = await prisma.assignment.findUnique({ where: { id: n.assignmentId } });
        if (!assignment) {
          console.log(`- Assignment not found for notification ${n.id} (assignmentId=${n.assignmentId})`);
          continue;
        }

        const title = assignment.title;
        // If message already contains the title, skip
        if (n.message && n.message.includes(title)) {
          // already contains title
          continue;
        }

        // Compose a new message preserving some original info when possible
        let newMsg = '';
        // If original message included the word 'submission' or 'graded', keep that flavor
        if (/graded/i.test(n.message)) {
          // try to keep grade info if present
          const gradeMatch = n.message.match(/Grade:\s*([0-9.]+)/i);
          if (gradeMatch) {
            newMsg = `Your submission for "${title}" has been graded. Grade: ${gradeMatch[1]}`;
          } else {
            newMsg = `Your submission for "${title}" has been graded.`;
          }
        } else if (/extension/i.test(n.message)) {
          newMsg = n.message.replace(n.assignmentId, title);
          if (!newMsg.includes(title)) newMsg = `Your extension request for "${title}" is ${/approved|rejected|pending/i.exec(n.message)?.[0] ?? ''}`.trim();
        } else {
          // generic fallback: prefix assignment title
          newMsg = `${n.message} (Assignment: ${title})`;
        }

        // Only update when different
        if (newMsg && newMsg !== n.message) {
          await prisma.notification.update({ where: { id: n.id }, data: { message: newMsg } });
          console.log(`- Updated notification ${n.id}: ${newMsg}`);
          updated++;
        }
      } catch (e) {
        console.error(`Failed to process notification ${n.id}:`, e.message || e);
      }
    }

    console.log(`Done. Updated ${updated} notifications.`);
  } catch (e) {
    console.error('Migration failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
