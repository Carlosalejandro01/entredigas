import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/booking";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

const schema = z.object({
  pricePerNight: z.coerce.number().min(0),
  cleaningFee: z.coerce.number().min(0),
  minNights: z.coerce.number().int().min(1),
  currency: z.string().min(1).max(6),
  contactEmail: z.string().email().or(z.literal("")),
  contactPhone: z.string().max(30),
});

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos no válidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  await getSettings();
  const settings = await prisma.settings.update({
    where: { id: 1 },
    data: parsed.data,
  });
  return NextResponse.json({ settings });
}
