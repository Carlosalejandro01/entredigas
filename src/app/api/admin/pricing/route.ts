import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";

function serializeDateRate(r: { date: Date; pricePerNight: number }) {
  return { date: r.date.toISOString().slice(0, 10), pricePerNight: r.pricePerNight };
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const [seasonalRates, guestRates, dateRates] = await Promise.all([
    prisma.seasonalRate.findMany({ orderBy: { month: "asc" } }),
    prisma.guestRate.findMany({ orderBy: { guests: "asc" } }),
    prisma.dateRate.findMany({ orderBy: { date: "asc" } }),
  ]);
  return NextResponse.json({
    seasonalRates,
    guestRates,
    dateRates: dateRates.map(serializeDateRate),
  });
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

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha no válida.");

const dateRateSchema = z.object({
  date: dateSchema,
  pricePerNight: z.coerce.number().min(0),
});

// Añade o actualiza el precio de una fecha concreta (anula el precio de
// temporada y el base solo para esa noche).
export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = dateRateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos no válidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const date = new Date(`${parsed.data.date}T00:00:00.000Z`);
  const dateRate = await prisma.dateRate.upsert({
    where: { date },
    update: { pricePerNight: parsed.data.pricePerNight },
    create: { date, pricePerNight: parsed.data.pricePerNight },
  });
  return NextResponse.json({ dateRate: serializeDateRate(dateRate) }, { status: 201 });
}

const deleteDateRateSchema = z.object({ date: dateSchema });

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const parsed = deleteDateRateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }
  const date = new Date(`${parsed.data.date}T00:00:00.000Z`);
  await prisma.dateRate.delete({ where: { date } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
