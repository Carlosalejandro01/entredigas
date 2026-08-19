import { NextResponse } from "next/server";
import { getOccupiedRanges, getSettings } from "@/lib/booking";
import { isoDate } from "@/lib/dates";

export async function GET() {
  const [occupied, settings] = await Promise.all([getOccupiedRanges(), getSettings()]);

  return NextResponse.json({
    occupiedRanges: occupied.map((r) => ({
      start: isoDate(r.start),
      end: isoDate(r.end),
    })),
    pricePerNight: settings.pricePerNight,
    cleaningFee: settings.cleaningFee,
    minNights: settings.minNights,
    currency: settings.currency,
  });
}
