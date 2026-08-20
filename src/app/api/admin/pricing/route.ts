import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/admin-guard";
import { prisma } from "@/lib/prisma";
import { enumerateNights } from "@/lib/dates";

function serializeDateRate(r: { date: Date; pricePerNight: number | null; minNights: number | null }) {
  return {
    date: r.date.toISOString().slice(0, 10),
    pricePerNight: r.pricePerNight,
    minNights: r.minNights,
  };
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
      minNights: z.number().int().min(1).nullable().optional(),
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
        .filter((r) => r.pricePerNight !== null || r.minNights)
        .map((r) => ({
          month: r.month,
          pricePerNight: r.pricePerNight,
          minNights: r.minNights ?? null,
        })),
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

const dateRateSchema = z
  .object({
    date: dateSchema.optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    pricePerNight: z.coerce.number().min(0).nullable().optional(),
    minNights: z.coerce.number().int().min(1).nullable().optional(),
  })
  .refine((d) => Boolean(d.date) !== Boolean(d.startDate && d.endDate), {
    message: "Especifica 'date', o 'startDate' y 'endDate'.",
  });

async function upsertDateRate(
  dateStr: string,
  price: number | null | undefined,
  minNights: number | null | undefined
) {
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  const updateData: { pricePerNight?: number | null; minNights?: number | null } = {};
  if (price !== undefined) updateData.pricePerNight = price;
  if (minNights !== undefined) updateData.minNights = minNights;

  const result = await prisma.dateRate.upsert({
    where: { date },
    update: updateData,
    create: { date, pricePerNight: price ?? null, minNights: minNights ?? null },
  });

  if (result.pricePerNight === null && result.minNights === null) {
    await prisma.dateRate.delete({ where: { date } });
    return null;
  }
  return result;
}

// Añade o actualiza el precio y/o la estancia mínima de una fecha concreta,
// o de un rango de fechas (para aplicar la misma regla a una semana entera).
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
  const { date, startDate, endDate, pricePerNight, minNights } = parsed.data;

  if (date) {
    const dateRate = await upsertDateRate(date, pricePerNight, minNights);
    return NextResponse.json({ dateRate: dateRate ? serializeDateRate(dateRate) : null }, { status: 201 });
  }

  // startDate/endDate: rango inclusivo.
  const start = new Date(`${startDate}T00:00:00.000Z`);
  const endExclusive = new Date(`${endDate}T00:00:00.000Z`);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  const days = enumerateNights(start, endExclusive);
  if (days.length === 0 || days.length > 62) {
    return NextResponse.json(
      { error: "El rango de fechas no es válido (máximo 62 días)." },
      { status: 400 }
    );
  }
  for (const day of days) {
    await upsertDateRate(day, pricePerNight, minNights);
  }
  const dateRates = await prisma.dateRate.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ dateRates: dateRates.map(serializeDateRate) }, { status: 201 });
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
