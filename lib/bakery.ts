// All logic for teamgreen: synthetic demo data, forecast, end-of-day rules and backtest.
// Everything is deterministic (seeded) so server and client render identical numbers.

export const PRODUCTS = [
  "Skillingsbolle",
  "Grovbrød",
  "Croissant",
  "Kanelsnurr",
  "Rundstykke",
] as const;

export type Product = (typeof PRODUCTS)[number];

export const WEEKS_OF_HISTORY = 12;
export const DAYS_OF_HISTORY = WEEKS_OF_HISTORY * 7;
export const SAME_WEEKDAYS_USED = 4;
export const AI_BUFFER = 0.05;
export const BASELINE_BUFFER = 0.2;
export const KG_PER_UNIT = 0.1;
export const CO2E_PER_KG = 2.5; // placeholder factor – estimate only

// Fixed "today" for the demo so results are reproducible. It is a Thursday,
// so "tomorrow" is a Friday (one of the busy days).
export const DEMO_TODAY = new Date(Date.UTC(2026, 9, 15)); // Thu 15 Oct 2026

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Average daily units on a "normal" day.
const BASE_DEMAND: Record<Product, number> = {
  Skillingsbolle: 28,
  Grovbrød: 22,
  Croissant: 32,
  Kanelsnurr: 18,
  Rundstykke: 45,
};

// Weekday multipliers, indexed by getUTCDay() (0 = Sunday). Busier Fri/Sat.
const WEEKDAY_FACTOR = [0.7, 0.85, 0.8, 0.9, 1.0, 1.3, 1.45];

export interface DaySales {
  date: Date;
  weekday: number;
  sales: Record<Product, number>;
}

/** Small seeded PRNG (mulberry32). */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86_400_000);
}

/** 12 weeks of synthetic daily sales ending on DEMO_TODAY (inclusive). */
export function generateSalesHistory(seed = 42): DaySales[] {
  const rand = mulberry32(seed);
  // Approximate normal noise: sum of uniforms, mean 0, sd ~1.
  const noise = () => (rand() + rand() + rand() + rand() - 2) * 1.73;

  const start = addDays(DEMO_TODAY, -(DAYS_OF_HISTORY - 1));
  const days: DaySales[] = [];
  for (let i = 0; i < DAYS_OF_HISTORY; i++) {
    const date = addDays(start, i);
    const weekday = date.getUTCDay();
    const sales = {} as Record<Product, number>;
    for (const p of PRODUCTS) {
      const expected = BASE_DEMAND[p] * WEEKDAY_FACTOR[weekday];
      const value = expected * (1 + 0.12 * noise());
      sales[p] = Math.max(0, Math.round(value));
    }
    days.push({ date, weekday, sales });
  }
  return days;
}

export interface Forecast {
  product: Product;
  weekdayName: string;
  pastValues: number[]; // most recent first
  average: number;
  min: number;
  max: number;
  recommended: number;
  why: string;
}

/**
 * Forecast demand for the day at `targetIndex` (may be one past the end of history)
 * using the average of the previous 4 same weekdays, plus a 5% buffer.
 */
export function forecastFor(history: DaySales[], targetIndex: number, product: Product): Forecast {
  const pastValues: number[] = [];
  for (let k = 1; k <= SAME_WEEKDAYS_USED; k++) {
    const idx = targetIndex - 7 * k;
    if (idx >= 0 && idx < history.length) pastValues.push(history[idx].sales[product]);
  }
  const average = pastValues.reduce((s, v) => s + v, 0) / Math.max(1, pastValues.length);
  const weekday =
    targetIndex < history.length
      ? history[targetIndex].weekday
      : addDays(history[history.length - 1].date, targetIndex - history.length + 1).getUTCDay();
  const weekdayName = WEEKDAY_NAMES[weekday];
  const recommended = Math.round(Math.round(average) * (1 + AI_BUFFER));
  return {
    product,
    weekdayName,
    pastValues,
    average,
    min: Math.min(...pastValues),
    max: Math.max(...pastValues),
    recommended,
    why: `Based on the last ${pastValues.length} ${weekdayName}s (${pastValues.join(", ")}): average ${Math.round(
      average,
    )} + ${Math.round(AI_BUFFER * 100)}% buffer.`,
  };
}

export function tomorrowForecast(history: DaySales[]): Forecast[] {
  return PRODUCTS.map((p) => forecastFor(history, history.length, p));
}

export function tomorrowDate(history: DaySales[]): Date {
  return addDays(history[history.length - 1].date, 1);
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ---------- End of day rules ----------

export interface Suggestion {
  label: string;
  detail: string;
  tone: "danger" | "action";
}

export function endOfDaySuggestions(leftover: number, useByPassed: boolean): Suggestion[] {
  if (leftover <= 0) return [];
  if (useByPassed) {
    return [
      {
        label: "Compost only, not safe to sell or donate",
        detail: "Use-by date has passed. Do not sell, discount or donate.",
        tone: "danger",
      },
    ];
  }
  return [
    { label: "Discount last hour", detail: "Mark down remaining units before closing.", tone: "action" },
    {
      label: "List on surplus app (e.g. Too Good To Go)",
      detail: "Offer what is still left as a surprise bag.",
      tone: "action",
    },
    { label: "Donate to local food bank", detail: "Anything unsold after that can be donated.", tone: "action" },
  ];
}

// ---------- Backtest ----------

export interface BacktestTotals {
  days: number;
  baselineWaste: number;
  aiWaste: number;
  baselineShort: number;
  aiShort: number;
  baselineBaked: number;
  aiBaked: number;
  demand: number;
  wasteReductionPct: number;
  unitsSaved: number;
  kgSaved: number;
  co2eSaved: number;
}

/**
 * Replay the last `weeks` weeks. Sales are treated as true demand.
 * Baseline: same day last week + 20%. AI: the forecast above.
 */
export function backtest(history: DaySales[], weeks = 4): BacktestTotals {
  const days = weeks * 7;
  const t = {
    baselineWaste: 0,
    aiWaste: 0,
    baselineShort: 0,
    aiShort: 0,
    baselineBaked: 0,
    aiBaked: 0,
    demand: 0,
  };
  for (let i = history.length - days; i < history.length; i++) {
    for (const p of PRODUCTS) {
      const demand = history[i].sales[p];
      const baseline = Math.round(history[i - 7].sales[p] * (1 + BASELINE_BUFFER));
      const ai = forecastFor(history, i, p).recommended;
      t.demand += demand;
      t.baselineBaked += baseline;
      t.aiBaked += ai;
      t.baselineWaste += Math.max(0, baseline - demand);
      t.aiWaste += Math.max(0, ai - demand);
      t.baselineShort += Math.max(0, demand - baseline);
      t.aiShort += Math.max(0, demand - ai);
    }
  }
  const unitsSaved = t.baselineWaste - t.aiWaste;
  const kgSaved = unitsSaved * KG_PER_UNIT;
  return {
    days,
    ...t,
    wasteReductionPct: t.baselineWaste > 0 ? (unitsSaved / t.baselineWaste) * 100 : 0,
    unitsSaved,
    kgSaved,
    co2eSaved: kgSaved * CO2E_PER_KG,
  };
}
