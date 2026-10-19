"use client";

import { parseQuantity, useBakery } from "../components/store";
import { focusRing, NextLink, Panel } from "../components/ui";

export function PlanTable() {
  const { forecasts, quantities, setQuantity, resetQuantities, approved, approve } = useBakery();

  const rows = forecasts.map((f) => ({ f, raw: quantities[f.product], ...parseQuantity(quantities[f.product]) }));
  const allValid = rows.every((r) => r.valid);
  const total = rows.reduce((s, r) => s + (r.valid ? r.n : 0), 0);

  return (
    <Panel>
      <div className="overflow-x-auto rounded-lg border border-stone-200">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">
            Recommended bake quantities per product for tomorrow, with forecast range and explanation
          </caption>
          <thead className="bg-stone-100 text-stone-800">
            <tr>
              <th scope="col" className="px-3 py-2 font-semibold">Product</th>
              <th scope="col" className="px-3 py-2 font-semibold">Expected range</th>
              <th scope="col" className="px-3 py-2 font-semibold">Bake quantity</th>
              <th scope="col" className="px-3 py-2 font-semibold">Why</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ f, raw, valid, n }) => {
              const inputId = `qty-${f.product}`;
              const errId = `${inputId}-err`;
              return (
                <tr key={f.product} className="border-t border-stone-200 align-top">
                  <th scope="row" className="px-3 py-3 font-medium text-stone-900">
                    {f.product}
                  </th>
                  <td className="px-3 py-3 tabular-nums text-stone-800">
                    {f.min}–{f.max}
                  </td>
                  <td className="px-3 py-3">
                    <label htmlFor={inputId} className="sr-only">
                      Bake quantity for {f.product}
                    </label>
                    <input
                      id={inputId}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      value={raw}
                      onChange={(e) => setQuantity(f.product, e.target.value)}
                      aria-invalid={!valid}
                      aria-describedby={valid ? undefined : errId}
                      className={`w-24 rounded-md border px-2 py-1.5 tabular-nums ${
                        valid ? "border-stone-400" : "border-red-700"
                      } ${focusRing}`}
                    />
                    <div className="mt-1 text-xs text-stone-600">
                      Suggested: {f.recommended}
                      {valid && n !== f.recommended && (
                        <span className="ml-1 font-medium text-amber-800">(edited)</span>
                      )}
                    </div>
                    {!valid && (
                      <p id={errId} className="mt-1 text-xs font-medium text-red-700">
                        Enter a whole number, 0 or more.
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3 text-stone-700">{f.why}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-stone-300 bg-stone-50">
              <th scope="row" className="px-3 py-2 font-semibold">Total</th>
              <td />
              <td className="px-3 py-2 font-semibold tabular-nums">{total}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={approve}
          disabled={!allValid || approved}
          className={`rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:bg-stone-400 ${focusRing}`}
        >
          Approve plan
        </button>
        <button
          type="button"
          onClick={resetQuantities}
          className={`rounded-lg border border-stone-400 px-4 py-2 font-medium text-stone-800 hover:bg-stone-100 ${focusRing}`}
        >
          Reset to suggestions
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {approved ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-900">
              <span aria-hidden="true">✓</span> Plan approved by owner
            </span>
          ) : !allValid ? (
            <span className="text-red-700">Fix the highlighted quantities before approving.</span>
          ) : (
            <span className="text-stone-700">Not approved yet. Editing a quantity clears approval.</span>
          )}
        </p>
      </div>

      {approved && (
        <div className="mt-6 border-t border-stone-200 pt-4">
          <p className="mb-3 text-sm text-stone-700">At closing time, log what&apos;s left over.</p>
          <NextLink href="/end-of-day">Go to end of day</NextLink>
        </div>
      )}
    </Panel>
  );
}
