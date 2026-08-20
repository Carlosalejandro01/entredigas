import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const [seasonalRates, guestRates] = await Promise.all([
    prisma.seasonalRate.findMany({ orderBy: { month: "asc" } }),
    prisma.guestRate.findMany({ orderBy: { guests: "asc" } }),
  ]);
  return NextResponse.json({ seasonalRates, guestRates });
}

const schema = z.object({
  seasonalRates: z.array(
    z.object({
      month: z.number().int().min(1).max(12),
      pricePerNight: z.number().min(0).nullable(),
    })
  ),
  guestRates: z.array(
    z.object({
      guests: z.number().int().min(1).max(20),
      percent: z.number(),
    })
  ),
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

  await prisma.$transaction([
    prisma.seasonalRate.deleteMany({}),
    prisma.seasonalRate.createMany({
      data: parsed.data.seasonalRates
        .filter((r) => r.pricePerNight !== null)
        .map((r) => ({ month: r.month, pricePerNight: r.pricePerNight as number })),
    }),
    prisma.guestRate.deleteMany({}),
    prisma.guestRate.createMany({ data: parsed.data.guestRates }),
  ]);

  const [seasonalRates, guestRates] = await Promise.all([
    prisma.seasonalRate.findMany({ orderBy: { month: "asc" } }),
    prisma.guestRate.findMany({ orderBy: { guests: "asc" } }),
  ]);
  return NextResponse.json({ seasonalRates, guestRates });
}
