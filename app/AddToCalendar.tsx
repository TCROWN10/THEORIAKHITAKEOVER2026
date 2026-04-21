"use client";

import { buildWeddingCalendarIcs } from "@/lib/wedding-calendar";

export default function AddToCalendar() {
  const handleClick = () => {
    const ics = buildWeddingCalendarIcs(new Date());
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ibierebo-damilola-wedding-2026.ics";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Download wedding calendar file (White wedding and Traditional wedding)"
      className="calendar-button-dance mt-8 inline-flex items-center justify-center rounded-full bg-pink text-white px-8 py-3 text-base font-bold tracking-wide shadow-sm hover:opacity-90 transition-opacity"
    >
      Add to Calendar
    </button>
  );
}
