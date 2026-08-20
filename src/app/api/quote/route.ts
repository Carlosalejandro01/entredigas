import { NextResponse } from "next/server";
import { z } from "zod";
import { computeQuote } from "@/lib/booking";
import { nightsBetween, toDateOnly } from "@/lib/dates";

const schema = z.object({
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.coerce.number().int().min(1).max(20),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  }

  const checkIn = toDateOnly(parsed.data.checkIn);
  const checkOut = toDateOnly(parsed.data.checkOut);
  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return NextResponse.json({ error: "Fechas no válidas." }, { status: 400 });
  }
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    return NextResponse.json({ error: "Rango de fechas no válido." }, { status: 400 });
  }

  const quote = await computeQuote(checkIn, checkOut, parsed.data.guests);
  return NextResponse.json(quote);
}
