"use client";

import Link from "next/link";
import { packBags } from "@/lib/inventory";
import { useInventory, type BagMode } from "../components/inventory-store";
import { fmt, focusRing, Panel } from "../components/ui";

const TARGETS = [100, 150, 200];

export function BagBuilder() {
  const { items, bagTarget, setBagTarget, bagMode, setBagMode, bagsApprovedFor, approveBags } = useInventory();

  const selected = items.filter((i) => i.inBags && i.batch.quantity > 0);
  const plan = packBags(
    selected.map((i) => ({ product: i.batch.product, quantity: i.batch.quantity })),
    bagTarget,
  );
  const bagPrice = (value: number) => (bagMode === "sell" ? Math.round(value / 3) : 0);
  const signature = JSON.stringify([plan.bags, plan.remainder, bagMode]);
  const approved = bagsApprovedFor === signature;
  const totalValue = plan.bags.reduce((s, b) => s + b.value, 0);

  return (
    <div className="space-y-6">
      <Panel>
        <fieldset>
          <legend className="font-semibold text-stone-900">How will the bags go out?</legend>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-6">
            {(
              [
                ["sell", "Sell on surplus app (about ⅓ of value)"],
                ["donate", "Give away free (food bank / community fridge)"],
              ] as [BagMode, string][]
            ).map(([mode, label]) => (
              <label key={mode} className="flex items-center gap-2 text-sm font-medium text-stone-800">
                <input
                  type="radio"
                  name="bag-mode"
                  value={mode}
                  checked={bagMode === mode}
                  onChange={() => setBagMode(mode)}
                  className={`h-4 w-4 accent-emerald-800 ${focusRing}`}
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-4">
          <label htmlFor="bag-target" className="block text-sm font-medium text-stone-800">
            Target value per bag (full price)
          </label>
          <select
            id="bag-target"
            value={bagTarget}
            onChange={(e) => setBagTarget(Number(e.target.value))}
            className={`mt-1 rounded-md border border-stone-400 bg-white px-2 py-1.5 ${focusRing}`}
          >
            {TARGETS.map((t) => (
              <option key={t} value={t}>
                {t} kr
              </option>
            ))}
          </select>
        </div>
      </Panel>

      {plan.totalUnits === 0 ? (
        <Panel>
          <p className="text-stone-700">
            No units are selected for bags right now. Tick &quot;Include in giveaway bags&quot; on a batch in the{" "}
            <Link href="/inventory" className={`rounded font-medium text-emerald-800 underline ${focusRing}`}>
              inventory
            </Link>
            , or move the demo clock later in the day.
          </p>
        </Panel>
      ) : (
        <>
          <section aria-labelledby="bags-title">
            <h2 id="bags-title" className="mb-3 text-lg font-semibold text-stone-900">
              Suggested: {plan.bags.length} bag{plan.bags.length === 1 ? "" : "s"} from {plan.totalUnits} units
            </h2>
            {plan.bags.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {plan.bags.map((bag, i) => (
                  <li key={i} className="rounded-2xl border border-emerald-300 bg-white p-4 shadow-sm">
                    <h3 className="font-semibold text-stone-900">Bag {i + 1}</h3>
                    <ul className="mt-2 space-y-0.5 text-sm text-stone-800">
                      {bag.items.map((it) => (
                        <li key={it.product}>
                          {it.quantity} × {it.product}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-sm text-stone-700">
                      {bag.units} units · worth {fmt(bag.value)} kr
                    </p>
                    <p className="mt-1 text-lg font-bold text-emerald-900">
                      {bagMode === "sell" ? `List at ${bagPrice(bag.value)} kr` : "Free"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            {plan.remainder.length > 0 && (
              <p className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-3 text-sm text-stone-800">
                <strong>Not enough for another bag:</strong>{" "}
                {plan.remainder.map((r) => `${r.quantity} × ${r.product}`).join(", ")} (worth {fmt(plan.remainderValue)}{" "}
                kr). Suggestion: donate to a local food bank.
              </p>
            )}
          </section>

          <Panel>
            <p className="text-sm text-stone-700">
              {plan.bags.length} bag{plan.bags.length === 1 ? "" : "s"} worth {fmt(totalValue)} kr at full price
              {bagMode === "sell"
                ? `, about ${fmt(plan.bags.reduce((s, b) => s + bagPrice(b.value), 0))} kr recovered.`
                : ", given away free."}{" "}
              Saves about {fmt(plan.totalUnits * 0.1, 1)} kg of food from the bin (estimate).
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => approveBags(signature)}
                disabled={approved || plan.bags.length === 0}
                className={`rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-stone-400 ${focusRing}`}
              >
                Approve bags
              </button>
              <p role="status" aria-live="polite" className="text-sm">
                {approved ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-900">
                    <span aria-hidden="true">✓</span> Bags approved by owner
                  </span>
                ) : (
                  <span className="text-stone-700">Not approved yet. Changes to stock or settings clear approval.</span>
                )}
              </p>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
