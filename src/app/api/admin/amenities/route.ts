import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const amenities = await prisma.amenity.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ amenities });
}

const createSchema = z.object({ label: z.string().min(1).max(120) });

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }
  const maxOrder = await prisma.amenity.aggregate({ _max: { order: true } });
  const amenity = await prisma.amenity.create({
    data: { label: parsed.data.label, order: (maxOrder._max.order ?? -1) + 1 },
  });
  return NextResponse.json({ amenity }, { status: 201 });
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
  await prisma.amenity.delete({ where: { id: parsed.data.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

const patchSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(120).optional(),
  order: z.number().int().optional(),
});

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = patchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }
  const { id, ...data } = parsed.data;
  const amenity = await prisma.amenity.update({ where: { id }, data });
  return NextResponse.json({ amenity });
}
