"use client";

import { parseQuantity, useBakery } from "./store";
import { NextLink } from "./ui";

export function PlanStatus({ tomorrowLabel }: { tomorrowLabel: string }) {
  const { quantities, approved } = useBakery();
  const total = Object.values(quantities).reduce((s, raw) => {
    const { valid, n } = parseQuantity(raw);
    return s + (valid ? n : 0);
  }, 0);

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-sm font-medium text-stone-700">Plan for {tomorrowLabel}</h2>
      <p className="mt-1 text-2xl font-bold text-stone-900">{total} units</p>
      <p className="mt-1 text-sm" role="status">
        {approved ? (
          <span className="font-semibold text-emerald-800">✓ Plan approved by owner</span>
        ) : (
          <span className="text-amber-800">Waiting for owner approval</span>
        )}
      </p>
      <div className="mt-3">
        <NextLink href="/plan">{approved ? "View plan" : "Review plan"}</NextLink>
      </div>
    </div>
  );
}
