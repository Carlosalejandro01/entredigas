import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { rangesOverlap, toDateOnly } from "@/lib/dates";
import { getOccupiedRanges } from "@/lib/booking";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const blocked = await prisma.blockedRange.findMany({ orderBy: { start: "asc" } });
  return NextResponse.json({ blocked });
}

const schema = z.object({
  start: z.string(),
  end: z.string(),
  reason: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }
  const start = toDateOnly(parsed.data.start);
  const end = toDateOnly(parsed.data.end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return NextResponse.json({ error: "Rango de fechas no válido." }, { status: 400 });
  }

  const occupied = await getOccupiedRanges();
  if (occupied.some((r) => rangesOverlap(start, end, r.start, r.end))) {
    return NextResponse.json(
      { error: "Ese rango se solapa con una reserva o bloqueo existente." },
      { status: 409 }
    );
  }

  const blocked = await prisma.blockedRange.create({
    data: { start, end, reason: parsed.data.reason || null },
  });
  return NextResponse.json({ blocked }, { status: 201 });
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
  await prisma.blockedRange.delete({ where: { id: parsed.data.id } });
  return NextResponse.json({ ok: true });
}
