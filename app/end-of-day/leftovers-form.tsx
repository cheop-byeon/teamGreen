"use client";

import { useId } from "react";
import { PRODUCTS, endOfDaySuggestions, type Product } from "@/lib/bakery";
import { useBakery, type LeftoverRow } from "../components/store";
import { focusRing } from "../components/ui";

export function LeftoversForm() {
  const { leftovers, setLeftover } = useBakery();

  const total = PRODUCTS.reduce((s, p) => {
    const n = Number(leftovers[p].leftover);
    return s + (Number.isInteger(n) && n > 0 ? n : 0);
  }, 0);

  return (
    <>
      <p className="mb-4 text-sm text-stone-700" aria-live="polite">
        Total leftovers today: <strong className="tabular-nums">{total}</strong> unit{total === 1 ? "" : "s"}
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {PRODUCTS.map((p) => (
          <LeftoverCard key={p} product={p} value={leftovers[p]} onChange={(v) => setLeftover(p, v)} />
        ))}
      </ul>
    </>
  );
}

function LeftoverCard({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: LeftoverRow;
  onChange: (v: LeftoverRow) => void;
}) {
  const id = useId();
  const n = Number(value.leftover);
  const valid = value.leftover === "" || (Number.isInteger(n) && n >= 0);
  const suggestions = valid ? endOfDaySuggestions(value.leftover === "" ? 0 : n, value.useBy) : [];

  return (
    <li className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-stone-900">{product}</h2>
      <div className="mt-3 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor={`${id}-left`} className="block text-sm font-medium text-stone-800">
            Leftover units
          </label>
          <input
            id={`${id}-left`}
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            placeholder="0"
            value={value.leftover}
            onChange={(e) => onChange({ ...value, leftover: e.target.value })}
            aria-invalid={!valid}
            aria-describedby={`${id}-out`}
            className={`mt-1 w-24 rounded-md border px-2 py-1.5 tabular-nums ${
              valid ? "border-stone-400" : "border-red-700"
            } ${focusRing}`}
          />
        </div>
        <div className="flex items-center gap-2 pb-2">
          <input
            id={`${id}-useby`}
            type="checkbox"
            checked={value.useBy}
            onChange={(e) => onChange({ ...value, useBy: e.target.checked })}
            aria-describedby={`${id}-out`}
            className={`h-5 w-5 accent-emerald-800 ${focusRing}`}
          />
          <label htmlFor={`${id}-useby`} className="text-sm font-medium text-stone-800">
            Use-by date passed
          </label>
        </div>
      </div>

      <div id={`${id}-out`} aria-live="polite" className="mt-3 text-sm">
        {!valid ? (
          <p className="font-medium text-red-700">Enter a whole number, 0 or more.</p>
        ) : suggestions.length === 0 ? (
          <p className="text-stone-600">No leftovers entered. Nothing to do.</p>
        ) : suggestions[0].tone === "danger" ? (
          <p className="rounded-md border border-red-300 bg-red-50 p-3 font-semibold text-red-900">
            <span aria-hidden="true">⚠ </span>
            {suggestions[0].label}
          </p>
        ) : (
          <>
            <p className="font-medium text-stone-800">
              Suggested order for {n} unit{n === 1 ? "" : "s"}:
            </p>
            <ol className="mt-2 space-y-2">
              {suggestions.map((s, i) => (
                <li key={s.label} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900"
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="font-medium text-stone-900">{s.label}</span>
                    <span className="block text-stone-600">{s.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </li>
  );
}
