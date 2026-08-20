import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { nightsBetween, rangesOverlap } from "@/lib/dates";

export async function getSettings() {
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  if (!settings.icalExportToken) {
    return prisma.settings.update({
      where: { id: 1 },
      data: { icalExportToken: crypto.randomBytes(16).toString("hex") },
    });
  }
  return settings;
}

export async function getOccupiedRanges() {
  const [bookings, blocked] = await Promise.all([
    prisma.booking.findMany({
      where: { status: { in: ["pending", "confirmed"] } },
      select: { checkIn: true, checkOut: true },
    }),
    prisma.blockedRange.findMany({ select: { start: true, end: true } }),
  ]);

  return [
    ...bookings.map((b) => ({ start: b.checkIn, end: b.checkOut })),
    ...blocked.map((b) => ({ start: b.start, end: b.end })),
  ];
}

export async function isRangeAvailable(checkIn: Date, checkOut: Date) {
  const occupied = await getOccupiedRanges();
  return !occupied.some((r) => rangesOverlap(checkIn, checkOut, r.start, r.end));
}

export async function computeQuote(checkIn: Date, checkOut: Date) {
  const settings = await getSettings();
  const nights = nightsBetween(checkIn, checkOut);
  const lodging = nights * settings.pricePerNight;
  const total = lodging + settings.cleaningFee;
  return {
    nights,
    pricePerNight: settings.pricePerNight,
    cleaningFee: settings.cleaningFee,
    currency: settings.currency,
    minNights: settings.minNights,
    total,
  };
}
