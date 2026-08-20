import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { enumerateNights, isoDate, rangesOverlap } from "@/lib/dates";

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

export async function computeQuote(checkIn: Date, checkOut: Date, guests: number) {
  const [settings, seasonalRates, guestRates, dateRates] = await Promise.all([
    getSettings(),
    prisma.seasonalRate.findMany(),
    prisma.guestRate.findMany(),
    prisma.dateRate.findMany(),
  ]);

  const rateByMonth = new Map(seasonalRates.map((r) => [r.month, r.pricePerNight]));
  const rateByDate = new Map(dateRates.map((r) => [isoDate(r.date), r.pricePerNight]));
  const minNightsByMonth = new Map(seasonalRates.map((r) => [r.month, r.minNights]));
  const minNightsByDate = new Map(dateRates.map((r) => [isoDate(r.date), r.minNights]));
  const nightDates = enumerateNights(checkIn, checkOut);
  const nights = nightDates.length;

  const baseLodging = nightDates.reduce((sum, iso) => {
    const month = Number(iso.slice(5, 7)); // "YYYY-MM-DD" -> MM
    const rate = rateByDate.get(iso) ?? rateByMonth.get(month) ?? settings.pricePerNight;
    return sum + rate;
  }, 0);

  const guestRate = guestRates.find((r) => r.guests === guests);
  const surchargePercent = guests > settings.baseGuests ? (guestRate?.percent ?? 0) : 0;
  const lodging = baseLodging * (1 + surchargePercent / 100);
  const total = lodging + settings.cleaningFee;

  // La estancia mínima depende del día de entrada, no de los días
  // intermedios: un hueco de una sola noche solo se puede vender si esa
  // fecha de entrada concreta (o su mes) tiene una estancia mínima menor.
  const checkInIso = isoDate(checkIn);
  const checkInMonth = Number(checkInIso.slice(5, 7));
  const minNights =
    minNightsByDate.get(checkInIso) ?? minNightsByMonth.get(checkInMonth) ?? settings.minNights;

  return {
    nights,
    averagePricePerNight: nights > 0 ? baseLodging / nights : settings.pricePerNight,
    lodging,
    surchargePercent,
    cleaningFee: settings.cleaningFee,
    currency: settings.currency,
    minNights,
    baseGuests: settings.baseGuests,
    maxGuests: settings.maxGuests,
    total,
  };
}

// Precio de referencia (temporada baja/base, sin recargo) para mostrar
// "desde X €/noche" antes de que el cliente elija fechas.
export async function getStartingPrice() {
  const [settings, seasonalRates, dateRates] = await Promise.all([
    getSettings(),
    prisma.seasonalRate.findMany(),
    prisma.dateRate.findMany(),
  ]);
  const rates = [
    settings.pricePerNight,
    ...seasonalRates.map((r) => r.pricePerNight),
    ...dateRates.map((r) => r.pricePerNight),
  ].filter((r): r is number => r !== null);
  return Math.min(...rates);
}
