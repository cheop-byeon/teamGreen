"use client";

import { formatDateTime } from "@/lib/inventory";
import { useInventory } from "./inventory-store";
import { NextLink } from "./ui";

export function InventoryStatus() {
  const { items, now } = useInventory();
  const count = (tiers: string[]) =>
    items.filter((i) => tiers.includes(i.a.tier)).reduce((s, i) => s + i.batch.quantity, 0);
  const urgent = count(["giveaway", "last-hours", "deep"]);
  const expired = count(["expired"]);

  return (
    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 sm:p-6">
      <h2 className="text-sm font-medium text-stone-700">Shelf at {formatDateTime(now)}</h2>
      <p className="mt-1 text-2xl font-bold text-stone-900">{urgent} units expiring today</p>
      <p className="mt-1 text-sm text-stone-700">
        {expired > 0 ? `${expired} expired units to compost.` : "Nothing expired."}
      </p>
      <div className="mt-3">
        <NextLink href="/inventory">Check inventory</NextLink>
      </div>
    </div>
  );
}
