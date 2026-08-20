import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { computeQuote, getOccupiedRanges } from "@/lib/booking";
import { nightsBetween, rangesOverlap, toDateOnly } from "@/lib/dates";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";

const bookingSchema = z
  .object({
    guestName: z.string().trim().min(2).max(120),
    email: z.string().trim().email(),
    phone: z.string().trim().min(6).max(30),
    guests: z.coerce.number().int().min(1).max(20),
    checkIn: z.string(),
    checkOut: z.string(),
    message: z.string().trim().max(1000).optional(),
    // Campo trampa: invisible para personas, pero los formularios rellenados
    // automáticamente por bots suelen completarlo. Si llega con contenido,
    // se descarta la petición silenciosamente.
    website: z.string().max(200).optional(),
  })
  .strict();

export async function POST(request: Request) {
  const allowed = await checkRateLimit(`booking:${clientIp(request)}`, 8, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Se han enviado demasiadas solicitudes desde aquí. Prueba de nuevo más tarde." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos de reserva no válidos.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.website) {
    // Petición de un bot: respondemos como si todo fuese bien para no darle
    // pistas, pero no creamos ninguna reserva.
    return NextResponse.json(
      { id: "ok", checkIn: parsed.data.checkIn, checkOut: parsed.data.checkOut, nights: 0, totalPrice: 0, currency: "EUR", status: "pending" },
      { status: 201 }
    );
  }

  const { guestName, email, phone, guests, message } = parsed.data;
  const checkIn = toDateOnly(parsed.data.checkIn);
  const checkOut = toDateOnly(parsed.data.checkOut);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return NextResponse.json({ error: "Fechas no válidas." }, { status: 400 });
  }

  const today = toDateOnly(new Date());
  if (checkIn < today) {
    return NextResponse.json(
      { error: "La fecha de entrada no puede ser anterior a hoy." },
      { status: 400 }
    );
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    return NextResponse.json(
      { error: "La fecha de salida debe ser posterior a la de entrada." },
      { status: 400 }
    );
  }

  const quote = await computeQuote(checkIn, checkOut, guests);
  if (nights < quote.minNights) {
    return NextResponse.json(
      { error: `La estancia mínima es de ${quote.minNights} noches.` },
      { status: 400 }
    );
  }
  if (guests > quote.maxGuests) {
    return NextResponse.json(
      { error: `El apartamento admite un máximo de ${quote.maxGuests} huéspedes.` },
      { status: 400 }
    );
  }

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const occupied = await getOccupiedRanges();
      const overlap = occupied.some((r) =>
        rangesOverlap(checkIn, checkOut, r.start, r.end)
      );
      if (overlap) {
        throw new Error("DATES_TAKEN");
      }

      return tx.booking.create({
        data: {
          guestName,
          email,
          phone,
          guests,
          checkIn,
          checkOut,
          nights,
          totalPrice: quote.total,
          message: message || null,
          status: "pending",
        },
      });
    });

    return NextResponse.json(
      {
        id: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: booking.nights,
        totalPrice: booking.totalPrice,
        currency: quote.currency,
        status: booking.status,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Error && err.message === "DATES_TAKEN") {
      return NextResponse.json(
        { error: "Esas fechas ya no están disponibles. Elige otras fechas." },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "No se ha podido completar la reserva. Inténtalo de nuevo." },
      { status: 500 }
    );
  }
}
