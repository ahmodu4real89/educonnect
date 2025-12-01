import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { getCurrentUserFromToken } from "@/server/helpers/auth.utils";
import { safe } from "@/common/lib";

export async function GET(_req: Request) {
  const user = await getCurrentUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await safe(
    prisma.notification.findMany({ where: { intendedUserId: user.userId }, include: { assignment: true }, orderBy: { createdAt: "desc" } })
  );

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json(data);
}
