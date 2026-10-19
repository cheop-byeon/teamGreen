// Inventory of baked batches, expiry rules, discount tiers and giveaway-bag packing.
// All times are handled in UTC so server and client render the same text.

import { DEMO_TODAY, PRODUCTS, type Product } from "./bakery";

export const OPEN_HOUR = 7;
export const CLOSE_HOUR = 18;
export const DEFAULT_CLOCK_HOUR = 14; // demo clock starts at 14:00 on DEMO_TODAY

const HOUR = 3_600_000;

export interface ProductInfo {
  price: number; // NOK, full price per unit
  shelfLifeHours: number; // from bake time to use-by
}

export const PRODUCT_INFO: Record<Product, ProductInfo> = {
  Skillingsbolle: { price: 45, shelfLifeHours: 24 },
  Grovbrød: { price: 69, shelfLifeHours: 72 },
  Croissant: { price: 39, shelfLifeHours: 12 },
  Kanelsnurr: { price: 42, shelfLifeHours: 24 },
  Rundstykke: { price: 18, shelfLifeHours: 12 },
};

export interface Batch {
  id: string;
  product: Product;
  quantity: number;
  bakedAt: Date;
  useBy: Date;
}

export function clockAt(hour: number): Date {
  return new Date(DEMO_TODAY.getTime() + hour * HOUR);
}

function at(dayOffset: number, hour: number): Date {
  return new Date(DEMO_TODAY.getTime() + (dayOffset * 24 + hour) * HOUR);
}

export function makeBatch(id: string, product: Product, quantity: number, bakedAt: Date): Batch {
  return {
    id,
    product,
    quantity,
    bakedAt,
    useBy: new Date(bakedAt.getTime() + PRODUCT_INFO[product].shelfLifeHours * HOUR),
  };
}

/** Synthetic stock on the demo day, a mix of fresh, expiring and expired batches. */
export function seedInventory(): Batch[] {
  return [
    makeBatch("b1", "Skillingsbolle", 9, at(-1, 15)), // use-by today 15:00
    makeBatch("b2", "Skillingsbolle", 20, at(0, 7)), // use-by tomorrow 07:00
    makeBatch("b3", "Croissant", 4, at(-1, 6)), // expired yesterday 18:00
    makeBatch("b4", "Croissant", 14, at(0, 6)), // use-by today 18:00
    makeBatch("b5", "Rundstykke", 22, at(0, 4)), // use-by today 16:00
    makeBatch("b6", "Kanelsnurr", 6, at(-1, 12)), // expired today 12:00
    makeBatch("b7", "Kanelsnurr", 15, at(0, 13)), // use-by tomorrow 13:00
    makeBatch("b8", "Grovbrød", 5, at(-2, 7)), // use-by tomorrow 07:00
    makeBatch("b9", "Grovbrød", 18, at(0, 6)), // use-by in 3 days
  ];
}

/**
 * The last moment a batch can be sold: its use-by time if the shop is open then,
 * otherwise the closing time before it.
 */
export function lastSaleTime(useBy: Date): Date {
  const h = useBy.getUTCHours() + useBy.getUTCMinutes() / 60;
  const day = new Date(Date.UTC(useBy.getUTCFullYear(), useBy.getUTCMonth(), useBy.getUTCDate()));
  if (h > CLOSE_HOUR) return new Date(day.getTime() + CLOSE_HOUR * HOUR);
  if (h <= OPEN_HOUR) return new Date(day.getTime() - (24 - CLOSE_HOUR) * HOUR);
  return useBy;
}

export type Tier = "expired" | "giveaway" | "last-hours" | "deep" | "light" | "fresh";

export interface Assessment {
  tier: Tier;
  hoursToUseBy: number;
  sellHoursLeft: number;
  lastSale: Date;
  discountPct: number;
  discountedPrice: number;
  status: string;
  action: string;
  why: string;
  bagEligible: boolean;
  bagByDefault: boolean;
}

export const TIER_STYLE: Record<Tier, { label: string; className: string }> = {
  expired: { label: "Expired", className: "bg-red-100 text-red-900 border-red-300" },
  giveaway: { label: "Give away now", className: "bg-orange-100 text-orange-950 border-orange-300" },
  "last-hours": { label: "Last hours", className: "bg-amber-100 text-amber-950 border-amber-300" },
  deep: { label: "Expiring today", className: "bg-yellow-100 text-yellow-950 border-yellow-300" },
  light: { label: "Within 24 h", className: "bg-sky-100 text-sky-950 border-sky-300" },
  fresh: { label: "Fresh", className: "bg-emerald-100 text-emerald-900 border-emerald-300" },
};

const roundHours = (h: number) => (h < 1 ? `${Math.max(0, Math.round(h * 60))} min` : `${fmtHours(h)} h`);
const fmtHours = (h: number) => (Number.isInteger(h) ? String(h) : h.toFixed(1));

export function assess(batch: Batch, now: Date): Assessment {
  const price = PRODUCT_INFO[batch.product].price;
  const hoursToUseBy = (batch.useBy.getTime() - now.getTime()) / HOUR;
  const lastSale = lastSaleTime(batch.useBy);
  const sellHoursLeft = (lastSale.getTime() - now.getTime()) / HOUR;
  const base = { hoursToUseBy, sellHoursLeft, lastSale };
  const useByText = `Use-by ${formatDateTime(batch.useBy)}`;
  const lastSaleNote =
    lastSale.getTime() !== batch.useBy.getTime() ? ` Shop closes before then, so last sale is ${formatDateTime(lastSale)}.` : "";

  const priced = (pct: number) => ({ discountPct: pct, discountedPrice: Math.round(price * (1 - pct / 100)) });

  if (hoursToUseBy <= 0) {
    return {
      ...base,
      ...priced(0),
      tier: "expired",
      status: "Use-by date passed",
      action: "Compost only, not safe to sell or donate",
      why: `${useByText} has passed.`,
      bagEligible: false,
      bagByDefault: false,
    };
  }
  if (sellHoursLeft <= 0) {
    return {
      ...base,
      ...priced(0),
      tier: "giveaway",
      status: `Can't be sold before use-by (${roundHours(hoursToUseBy)} left)`,
      action: "Put in a giveaway bag or donate tonight",
      why: `${useByText}. The shop is closed until after use-by, so it can't be sold.`,
      bagEligible: true,
      bagByDefault: true,
    };
  }
  if (sellHoursLeft <= 3) {
    return {
      ...base,
      ...priced(50),
      tier: "last-hours",
      status: `${roundHours(sellHoursLeft)} of selling time left`,
      action: "50% off now; unsold units go in a giveaway bag",
      why: `${useByText}.${lastSaleNote}`,
      bagEligible: true,
      bagByDefault: true,
    };
  }
  if (sellHoursLeft <= 8) {
    return {
      ...base,
      ...priced(30),
      tier: "deep",
      status: `${roundHours(sellHoursLeft)} of selling time left`,
      action: "30% off and move to the front of the display",
      why: `${useByText}.${lastSaleNote}`,
      bagEligible: true,
      bagByDefault: false,
    };
  }
  if (sellHoursLeft <= 24) {
    return {
      ...base,
      ...priced(15),
      tier: "light",
      status: `${roundHours(sellHoursLeft)} of selling time left`,
      action: "15% off, or sell these first before fresh stock",
      why: `${useByText}.${lastSaleNote}`,
      bagEligible: true,
      bagByDefault: false,
    };
  }
  return {
    ...base,
    ...priced(0),
    tier: "fresh",
    status: `${roundHours(sellHoursLeft)} of selling time left`,
    action: "Full price, no action needed",
    why: `${useByText}.`,
    bagEligible: true,
    bagByDefault: false,
  };
}

// ---------- Giveaway bags ----------

export interface BagItem {
  product: Product;
  quantity: number;
}

export interface Bag {
  items: BagItem[];
  units: number;
  value: number; // full retail value, NOK
}

export interface BagPlan {
  bags: Bag[];
  remainder: BagItem[]; // too little for a full bag
  remainderValue: number;
  totalUnits: number;
}

/**
 * Packs units into bags of roughly `targetValue` NOK retail value.
 * Units are dealt round-robin across products so each bag gets a mix.
 * A last partial bag is kept if it reaches 60% of the target; otherwise it's the remainder.
 */
export function packBags(units: BagItem[], targetValue: number): BagPlan {
  const queues = PRODUCTS.map((p) => ({
    product: p,
    left: units.filter((u) => u.product === p).reduce((s, u) => s + u.quantity, 0),
  })).filter((q) => q.left > 0);

  const totalUnits = queues.reduce((s, q) => s + q.left, 0);
  const bags: Map<Product, number>[] = [];
  let current = new Map<Product, number>();
  let currentValue = 0;

  while (queues.some((q) => q.left > 0)) {
    for (const q of queues) {
      if (q.left === 0) continue;
      q.left--;
      current.set(q.product, (current.get(q.product) ?? 0) + 1);
      currentValue += PRODUCT_INFO[q.product].price;
      if (currentValue >= targetValue) {
        bags.push(current);
        current = new Map();
        currentValue = 0;
      }
    }
  }

  const toItems = (m: Map<Product, number>): BagItem[] =>
    [...m.entries()].map(([product, quantity]) => ({ product, quantity }));
  const valueOf = (items: BagItem[]) => items.reduce((s, i) => s + i.quantity * PRODUCT_INFO[i.product].price, 0);

  let remainder: BagItem[] = [];
  if (current.size > 0) {
    if (currentValue >= targetValue * 0.6) bags.push(current);
    else remainder = toItems(current);
  }

  return {
    bags: bags.map((m) => {
      const items = toItems(m);
      return { items, units: items.reduce((s, i) => s + i.quantity, 0), value: valueOf(items) };
    }),
    remainder,
    remainderValue: valueOf(remainder),
    totalUnits,
  };
}

export function formatDateTime(d: Date): string {
  return d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

export function formatClock(hour: number): string {
  return `${String(Math.floor(hour)).padStart(2, "0")}:00`;
}
