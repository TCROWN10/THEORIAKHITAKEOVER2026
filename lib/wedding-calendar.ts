/**
 * Wedding times in Nigeria (WAT, UTC+1). ICS uses UTC (Z).
 * Countdown targets the white wedding start — same instant as DTSTART of first block below.
 */

/** June 20, 2026, 10:00 WAT → 09:00 UTC */
export const WEDDING_COUNTDOWN_UTC = new Date(Date.UTC(2026, 5, 20, 9, 0, 0));

function formatIcsUtc(dt: Date): string {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  const h = String(dt.getUTCHours()).padStart(2, "0");
  const min = String(dt.getUTCMinutes()).padStart(2, "0");
  const s = String(dt.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${d}T${h}${min}${s}Z`;
}

/** Escape SUMMARY / DESCRIPTION / LOCATION per RFC 5545 TEXT */
function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Fold long lines to 75 octets (CRLF + space continuation). */
function foldIcsLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 75));
  rest = rest.slice(75);
  while (rest.length > 0) {
    parts.push(" " + rest.slice(0, 74));
    rest = rest.slice(74);
  }
  return parts.join("\r\n");
}

type CalendarEvent = {
  uid: string;
  dtStartUtc: string;
  dtEndUtc: string;
  summary: string;
  location: string;
  description: string;
};

const EVENTS: CalendarEvent[] = [
  {
    uid: "white-wedding-ibierebo-damilola-2026@idlovestory",
    dtStartUtc: "20260620T090000Z",
    dtEndUtc: "20260620T120000Z",
    summary: "White Wedding & Reception — Ibierebo & Damilola",
    location: "185 Ademola Adetokunbo Crescent, Wuse II, Abuja, Nigeria",
    description:
      "Holy matrimony followed by dinner and celebration. IDLoveStory — Ibierebo & Damilola.",
  },
  {
    uid: "traditional-wedding-ibierebo-damilola-2026@idlovestory",
    dtStartUtc: "20260620T120000Z",
    dtEndUtc: "20260620T160000Z",
    summary: "Traditional Wedding — Ibierebo & Damilola",
    location: "Merry Makers Event Center, Kashim Ibrahim Way, Wuse II, Abuja, Nigeria",
    description: "A celebration of our rich cultural heritage and traditions.",
  },
];

export function buildWeddingCalendarIcs(now: Date = new Date()): string {
  const dtstamp = formatIcsUtc(now);
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IDLoveStory//Ibierebo & Damilola//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const ev of EVENTS) {
    const block = [
      "BEGIN:VEVENT",
      `UID:${ev.uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${ev.dtStartUtc}`,
      `DTEND:${ev.dtEndUtc}`,
      `SUMMARY:${escapeIcsText(ev.summary)}`,
      `LOCATION:${escapeIcsText(ev.location)}`,
      `DESCRIPTION:${escapeIcsText(ev.description)}`,
      "END:VEVENT",
    ];
    for (const raw of block) {
      lines.push(foldIcsLine(raw));
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
