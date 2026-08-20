import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { syncAllCalendars } from "@/lib/ical-sync";
import { prisma } from "@/lib/prisma";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  await syncAllCalendars();
  const calendars = await prisma.externalCalendar.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json({ calendars });
}
