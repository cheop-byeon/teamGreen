import Link from "next/link";
import { backtest, formatDate, generateSalesHistory, tomorrowDate } from "@/lib/bakery";
import { focusRing, fmt, PageHeader } from "./components/ui";
import { PlanStatus } from "./components/plan-status";
import { InventoryStatus } from "./components/inventory-status";

const FEATURES = [
  {
    href: "/plan",
    title: "Tomorrow's plan",
    when: "Afternoon, before ordering and prep",
    body: "See how much of each product to bake, why, and approve the plan.",
  },
  {
    href: "/inventory",
    title: "Inventory & expiry",
    when: "Through the day",
    body: "Track batches and use-by times, with suggested discounts as items get close to expiry.",
  },
  {
    href: "/bags",
    title: "Giveaway bags",
    when: "Before closing",
    body: "Pack expiring items into mixed bags to sell on a surplus app or give away free.",
  },
  {
    href: "/end-of-day",
    title: "End of day",
    when: "At closing",
    body: "Enter leftovers and get safe, ordered suggestions: discount, surplus app, donate or compost.",
  },
  {
    href: "/impact",
    title: "Impact",
    when: "Weekly review",
    body: "Backtest of the last 4 weeks: waste, food and CO₂e saved, and stockouts.",
  },
  {
    href: "/limitations",
    title: "Limitations",
    when: "Before you rely on it",
    body: "What this tool does not know, and why the owner decides.",
  },
];

export default function OverviewPage() {
  const history = generateSalesHistory();
  const r = backtest(history, 4);

  return (
    <>
      <PageHeader title="Bake what you'll sell">
        <p>
          Simple, explainable bake planning to cut food waste.{" "}
          <strong className="text-emerald-800">AI suggests. You decide.</strong>
        </p>
      </PageHeader>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PlanStatus tomorrowLabel={formatDate(tomorrowDate(history))} />
        <InventoryStatus />
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 sm:p-6">
          <h2 className="text-sm font-medium text-stone-700">Last 4 weeks (backtest)</h2>
          <p className="mt-1 text-2xl font-bold text-stone-900">{fmt(r.wasteReductionPct)}% less waste</p>
          <p className="mt-1 text-sm text-stone-700">
            {fmt(r.aiWaste)} vs {fmt(r.baselineWaste)} units wasted, but {fmt(r.aiShort)} vs {fmt(r.baselineShort)}{" "}
            units short.
          </p>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold text-stone-900">Features</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <li key={f.href}>
            <Link
              href={f.href}
              className={`block h-full rounded-2xl border border-stone-200 bg-white p-5 shadow-sm hover:border-emerald-600 hover:shadow ${focusRing}`}
            >
              <span className="block text-lg font-semibold text-emerald-900">
                {f.title} <span aria-hidden="true">→</span>
              </span>
              <span className="mt-0.5 block text-xs font-semibold uppercase tracking-wide text-stone-600">
                {f.when}
              </span>
              <span className="mt-2 block text-stone-700">{f.body}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
