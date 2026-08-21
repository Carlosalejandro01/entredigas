import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const faqItems = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json({ faqItems });
}

const createSchema = z.object({
  question: z.string().min(1).max(200),
  answer: z.string().min(1).max(1000),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }
  const maxOrder = await prisma.faqItem.aggregate({ _max: { order: true } });
  const faqItem = await prisma.faqItem.create({
    data: { ...parsed.data, order: (maxOrder._max.order ?? -1) + 1 },
  });
  return NextResponse.json({ faqItem }, { status: 201 });
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
  await prisma.faqItem.delete({ where: { id: parsed.data.id } }).catch(() => null);
  return NextResponse.json({ ok: true });
}

const patchSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1).max(200).optional(),
  answer: z.string().min(1).max(1000).optional(),
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
  const faqItem = await prisma.faqItem.update({ where: { id }, data });
  return NextResponse.json({ faqItem });
}
