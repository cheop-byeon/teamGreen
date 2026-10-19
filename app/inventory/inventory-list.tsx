"use client";

import { useId, useState } from "react";
import { PRODUCTS, type Product } from "@/lib/bakery";
import { PRODUCT_INFO, TIER_STYLE, formatClock, formatDateTime } from "@/lib/inventory";
import { useInventory, type AssessedBatch } from "../components/inventory-store";
import { Card, fmt, focusRing, NextLink } from "../components/ui";

export function InventoryList() {
  const { items } = useInventory();

  const sum = (filter: (i: AssessedBatch) => boolean) =>
    items.filter(filter).reduce((s, i) => s + i.batch.quantity, 0);
  const expired = sum((i) => i.a.tier === "expired");
  const urgent = sum((i) => ["giveaway", "last-hours", "deep"].includes(i.a.tier));
  const atRisk = items
    .filter((i) => ["giveaway", "last-hours", "deep"].includes(i.a.tier))
    .reduce((s, i) => s + i.batch.quantity * PRODUCT_INFO[i.batch.product].price, 0);
  const bagUnits = sum((i) => i.inBags);

  return (
    <>
      <dl className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Expired" value={`${expired} units`} note="Compost only" warn={expired > 0} />
        <Card label="Expiring today" value={`${urgent} units`} note="8 h or less of selling time" />
        <Card label="Value at risk" value={`${fmt(atRisk)} kr`} note="Full price of expiring-today units" />
        <Card label="For giveaway bags" value={`${bagUnits} units`} note="Selected below" highlight={bagUnits > 0} />
      </dl>

      <h2 className="mb-3 text-lg font-semibold text-stone-900">Batches ({items.length})</h2>
      {items.length === 0 ? (
        <p className="rounded-xl border border-stone-200 bg-white p-4 text-stone-700">No stock on the shelf.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <BatchRow key={item.batch.id} item={item} />
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <NextLink href="/bags">Build giveaway bags</NextLink>
        <span className="text-sm text-stone-700">
          {bagUnits} unit{bagUnits === 1 ? "" : "s"} selected
        </span>
      </div>

      <AddBatchForm />
    </>
  );
}

function BatchRow({ item }: { item: AssessedBatch }) {
  const { setQuantity, removeBatch, toggleDiscount, setInBags } = useInventory();
  const { batch, a, inBags, discountApplied } = item;
  const id = useId();
  const tier = TIER_STYLE[a.tier];
  const price = PRODUCT_INFO[batch.product].price;
  const expired = a.tier === "expired";

  return (
    <li
      className={`rounded-2xl border bg-white p-4 shadow-sm ${expired ? "border-red-300" : "border-stone-200"}`}
      aria-labelledby={`${id}-name`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 id={`${id}-name`} className="font-semibold text-stone-900">
            {batch.product}{" "}
            <span className="font-normal text-stone-600">· baked {formatDateTime(batch.bakedAt)}</span>
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${tier.className}`}>
              {tier.label}
            </span>
            <span className="text-stone-700">{a.status}</span>
          </p>
        </div>
        <div>
          <label htmlFor={`${id}-qty`} className="block text-xs font-medium text-stone-700">
            Units on shelf
          </label>
          <input
            id={`${id}-qty`}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            value={batch.quantity}
            onChange={(e) => {
              const n = Math.floor(Number(e.target.value));
              if (Number.isFinite(n)) setQuantity(batch.id, n);
            }}
            className={`mt-1 w-20 rounded-md border border-stone-400 px-2 py-1 tabular-nums ${focusRing}`}
          />
        </div>
      </div>

      <div
        className={`mt-3 rounded-lg p-3 text-sm ${expired ? "bg-red-50 text-red-900" : "bg-stone-50 text-stone-800"}`}
      >
        <p className="font-semibold">
          {expired && <span aria-hidden="true">⚠ </span>}Suggestion: {a.action}
        </p>
        <p className="mt-0.5 text-stone-700">Why: {a.why}</p>
        {a.discountPct > 0 && (
          <p className="mt-1">
            <span className="text-stone-600 line-through">{price} kr</span>{" "}
            <strong className="text-stone-900">{a.discountedPrice} kr</strong>{" "}
            <span className="text-stone-700">({a.discountPct}% off)</span>
          </p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {a.discountPct > 0 && (
          <button
            type="button"
            onClick={() => toggleDiscount(batch.id)}
            aria-pressed={discountApplied}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              discountApplied
                ? "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                : "bg-emerald-800 text-white hover:bg-emerald-900"
            } ${focusRing}`}
          >
            {discountApplied ? `✓ ${a.discountPct}% off applied` : `Apply ${a.discountPct}% off`}
          </button>
        )}
        {a.bagEligible && (
          <div className="flex items-center gap-2">
            <input
              id={`${id}-bag`}
              type="checkbox"
              checked={inBags}
              onChange={(e) => setInBags(batch.id, e.target.checked)}
              className={`h-5 w-5 accent-emerald-800 ${focusRing}`}
            />
            <label htmlFor={`${id}-bag`} className="text-sm font-medium text-stone-800">
              Include in giveaway bags
            </label>
          </div>
        )}
        <button
          type="button"
          onClick={() => removeBatch(batch.id)}
          className={`rounded-lg border border-stone-400 px-3 py-1.5 text-sm font-medium text-stone-800 hover:bg-stone-100 ${focusRing}`}
        >
          {expired ? "Mark composted" : "Remove batch"}
          <span className="sr-only"> ({batch.product}, baked {formatDateTime(batch.bakedAt)})</span>
        </button>
      </div>
    </li>
  );
}

function AddBatchForm() {
  const { addBatch, clockHour } = useInventory();
  const [product, setProduct] = useState<Product>(PRODUCTS[0]);
  const [quantity, setQuantityValue] = useState("10");
  const [hour, setHour] = useState(String(Math.min(clockHour, 22)));
  const n = Number(quantity);
  const valid = Number.isInteger(n) && n > 0;

  return (
    <form
      className="mt-8 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) addBatch(product, n, Number(hour));
      }}
    >
      <h2 className="text-lg font-semibold text-stone-900">Add a batch</h2>
      <p className="mt-1 text-sm text-stone-700">Use-by is set from the product&apos;s shelf life.</p>
      <div className="mt-3 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="add-product" className="block text-sm font-medium text-stone-800">
            Product
          </label>
          <select
            id="add-product"
            value={product}
            onChange={(e) => setProduct(e.target.value as Product)}
            className={`mt-1 rounded-md border border-stone-400 bg-white px-2 py-1.5 ${focusRing}`}
          >
            {PRODUCTS.map((p) => (
              <option key={p} value={p}>
                {p} ({PRODUCT_INFO[p].shelfLifeHours} h shelf life)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="add-qty" className="block text-sm font-medium text-stone-800">
            Units
          </label>
          <input
            id="add-qty"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            value={quantity}
            onChange={(e) => setQuantityValue(e.target.value)}
            aria-invalid={!valid}
            className={`mt-1 w-20 rounded-md border px-2 py-1.5 tabular-nums ${
              valid ? "border-stone-400" : "border-red-700"
            } ${focusRing}`}
          />
        </div>
        <div>
          <label htmlFor="add-hour" className="block text-sm font-medium text-stone-800">
            Baked today at
          </label>
          <select
            id="add-hour"
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className={`mt-1 rounded-md border border-stone-400 bg-white px-2 py-1.5 tabular-nums ${focusRing}`}
          >
            {Array.from({ length: 19 }, (_, i) => i + 4).map((h) => (
              <option key={h} value={h}>
                {formatClock(h)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!valid}
          className={`rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-stone-400 ${focusRing}`}
        >
          Add batch
        </button>
      </div>
      {!valid && <p className="mt-2 text-sm font-medium text-red-700">Enter a whole number of units, 1 or more.</p>}
    </form>
  );
}
