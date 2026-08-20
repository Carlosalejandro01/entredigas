import { isoDate, toDateOnly } from "@/lib/dates";

type IcsEvent = { start: Date; end: Date; summary: string; uid: string };

function unfoldLines(text: string): string[] {
  const rawLines = text.split(/\r\n|\n|\r/);
  const lines: string[] = [];
  for (const line of rawLines) {
    if ((line.startsWith(" ") || line.startsWith("\t")) && lines.length > 0) {
      lines[lines.length - 1] += line.slice(1);
    } else {
      lines.push(line);
    }
  }
  return lines;
}

function parseIcsDate(value: string): Date | null {
  // All-day: YYYYMMDD. Date-time: YYYYMMDDTHHMMSS(Z)
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})Z?)?$/.exec(value.trim());
  if (!m) return null;
  const [, y, mo, d] = m;
  return new Date(Date.UTC(Number(y), Number(mo) - 1, Number(d)));
}

/**
 * Parses VEVENTs out of an .ics feed. Only reads DTSTART/DTEND/SUMMARY/UID —
 * booking-channel feeds (Booking.com, Airbnb) don't use recurrence rules for
 * reservation blocks, so RRULE is intentionally not handled.
 */
export function parseIcs(text: string): IcsEvent[] {
  const lines = unfoldLines(text);
  const events: IcsEvent[] = [];
  let current: Partial<IcsEvent> | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current?.start && current.end) {
        events.push({
          start: current.start,
          end: current.end,
          summary: current.summary || "Reservado",
          uid: current.uid || `${current.start.toISOString()}-${current.end.toISOString()}`,
        });
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).split(";")[0];
    const value = line.slice(colonIndex + 1);

    if (key === "DTSTART") {
      const d = parseIcsDate(value);
      if (d) current.start = d;
    } else if (key === "DTEND") {
      const d = parseIcsDate(value);
      if (d) current.end = d;
    } else if (key === "SUMMARY") {
      current.summary = value;
    } else if (key === "UID") {
      current.uid = value;
    }
  }

  return events;
}

function foldLine(line: string): string {
  if (line.length <= 73) return line;
  let result = "";
  let rest = line;
  while (rest.length > 73) {
    result += rest.slice(0, 73) + "\r\n ";
    rest = rest.slice(73);
  }
  return result + rest;
}

function toIcsDate(d: Date): string {
  return isoDate(d).replace(/-/g, "");
}

export function generateIcs(
  ranges: { start: Date; end: Date; summary: string; uid: string }[],
  calendarName: string
): string {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Entre Vigas//Booking Calendar//ES",
    "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${calendarName}`,
  ];

  for (const r of ranges) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${r.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${toIcsDate(toDateOnly(r.start))}`,
      `DTEND;VALUE=DATE:${toIcsDate(toDateOnly(r.end))}`,
      foldLine(`SUMMARY:${r.summary}`),
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
