export function toDateOnly(value: string | Date): Date {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  const ms = toDateOnly(checkOut).getTime() - toDateOnly(checkIn).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// Half-open interval overlap: stays occupy [checkIn, checkOut), so a checkout
// day is free again for a new check-in the same day.
export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): boolean {
  return toDateOnly(aStart) < toDateOnly(bEnd) && toDateOnly(bStart) < toDateOnly(aEnd);
}

export function isoDate(d: Date): string {
  return toDateOnly(d).toISOString().slice(0, 10);
}

export function enumerateNights(checkIn: Date, checkOut: Date): string[] {
  const start = toDateOnly(checkIn);
  const end = toDateOnly(checkOut);
  const days: string[] = [];
  for (let d = new Date(start); d < end; d.setUTCDate(d.getUTCDate() + 1)) {
    days.push(isoDate(d));
  }
  return days;
}
