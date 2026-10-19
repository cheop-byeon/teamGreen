"use client";

import { CLOSE_HOUR, OPEN_HOUR, formatClock, formatDateTime } from "@/lib/inventory";
import { useInventory } from "./inventory-store";
import { focusRing } from "./ui";

export function DemoClock() {
  const { clockHour, setClockHour, now } = useInventory();
  const open = clockHour >= OPEN_HOUR && clockHour < CLOSE_HOUR;

  return (
    <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor="demo-clock" className="font-semibold text-stone-900">
          Demo clock
        </label>
        <p className="text-sm text-stone-700" aria-live="polite">
          <strong className="tabular-nums">{formatDateTime(now)}</strong> ·{" "}
          {open ? (
            <span className="text-emerald-800">Shop open</span>
          ) : (
            <span className="text-amber-800">Shop closed</span>
          )}{" "}
          (hours {formatClock(OPEN_HOUR)}–{formatClock(CLOSE_HOUR)})
        </p>
      </div>
      <input
        id="demo-clock"
        type="range"
        min={6}
        max={22}
        step={1}
        value={clockHour}
        onChange={(e) => setClockHour(Number(e.target.value))}
        aria-valuetext={formatClock(clockHour)}
        className={`mt-3 w-full accent-emerald-800 ${focusRing}`}
      />
      <div className="mt-1 flex justify-between text-xs text-stone-600" aria-hidden="true">
        <span>06:00</span>
        <span>14:00</span>
        <span>22:00</span>
      </div>
      <p className="mt-2 text-xs text-stone-600">Move the clock to see how suggestions change through the day.</p>
    </div>
  );
}
