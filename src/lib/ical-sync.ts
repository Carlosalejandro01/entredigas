import { prisma } from "@/lib/prisma";
import { parseIcs } from "@/lib/ical";

const SYNC_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
let syncing = false;

export async function syncOneCalendar(calendarId: string) {
  const calendar = await prisma.externalCalendar.findUnique({ where: { id: calendarId } });
  if (!calendar) return;

  try {
    const res = await fetch(calendar.icalUrl, {
      headers: { "User-Agent": "EntreVigas-CalendarSync/1.0" },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const text = await res.text();
    const events = parseIcs(text);

    await prisma.$transaction([
      prisma.blockedRange.deleteMany({ where: { source: `ical:${calendar.id}` } }),
      ...events
        .filter((e) => e.end > e.start)
        .map((e) =>
          prisma.blockedRange.create({
            data: {
              start: e.start,
              end: e.end,
              reason: `${calendar.name}: ${e.summary}`,
              source: `ical:${calendar.id}`,
            },
          })
        ),
      prisma.externalCalendar.update({
        where: { id: calendar.id },
        data: {
          lastSyncedAt: new Date(),
          lastSyncError: null,
          lastSyncCount: events.length,
        },
      }),
    ]);
  } catch (err) {
    await prisma.externalCalendar.update({
      where: { id: calendar.id },
      data: {
        lastSyncedAt: new Date(),
        lastSyncError: err instanceof Error ? err.message : "Error desconocido",
      },
    });
  }
}

export async function syncAllCalendars() {
  const calendars = await prisma.externalCalendar.findMany({ select: { id: true } });
  for (const c of calendars) {
    await syncOneCalendar(c.id);
  }
}

/**
 * Fire-and-forget refresh, throttled so public traffic never waits on an
 * external fetch. Safe to call on every availability check.
 */
export function syncAllCalendarsIfStale() {
  if (syncing) return;
  syncing = true;
  (async () => {
    try {
      const stale = await prisma.externalCalendar.findFirst({
        where: {
          OR: [
            { lastSyncedAt: null },
            { lastSyncedAt: { lt: new Date(Date.now() - SYNC_INTERVAL_MS) } },
          ],
        },
        select: { id: true },
      });
      if (stale) {
        await syncAllCalendars();
      }
    } catch {
      // best-effort background refresh; failures surface via lastSyncError
    } finally {
      syncing = false;
    }
  })();
}
