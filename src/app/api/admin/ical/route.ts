import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/booking";
import { syncOneCalendar } from "@/lib/ical-sync";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const [calendars, settings] = await Promise.all([
    prisma.externalCalendar.findMany({ orderBy: { createdAt: "asc" } }),
    getSettings(),
  ]);
  const exportUrl = `${new URL(request.url).origin}/api/ical?token=${settings.icalExportToken}`;
  return NextResponse.json({ calendars, exportUrl });
}

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  icalUrl: z.string().trim().url(),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }
  const calendar = await prisma.externalCalendar.create({ data: parsed.data });
  await syncOneCalendar(calendar.id);
  const refreshed = await prisma.externalCalendar.findUnique({ where: { id: calendar.id } });
  return NextResponse.json({ calendar: refreshed }, { status: 201 });
}

const deleteSchema = z.object({ id: z.string().min(1) });

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = deleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }
  await prisma.$transaction([
    prisma.blockedRange.deleteMany({ where: { source: `ical:${parsed.data.id}` } }),
    prisma.externalCalendar.delete({ where: { id: parsed.data.id } }),
  ]);
  return NextResponse.json({ ok: true });
}
