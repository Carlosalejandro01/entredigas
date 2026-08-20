import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateIcs } from "@/lib/ical";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  if (!settings.icalExportToken || token !== settings.icalExportToken) {
    return NextResponse.json({ error: "Token no válido." }, { status: 403 });
  }

  const bookings = await prisma.booking.findMany({
    where: { status: { in: ["pending", "confirmed"] } },
    select: { id: true, checkIn: true, checkOut: true, guestName: true },
  });

  const ics = generateIcs(
    bookings.map((b) => ({
      start: b.checkIn,
      end: b.checkOut,
      summary: "Reservado - Entre Vigas",
      uid: `entrevigas-${b.id}@entrevigas`,
    })),
    "Entre Vigas"
  );

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="entre-vigas.ics"',
      "Cache-Control": "public, max-age=900",
    },
  });
}
