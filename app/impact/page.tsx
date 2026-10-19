import type { Metadata } from "next";
import {
  BASELINE_BUFFER,
  CO2E_PER_KG,
  KG_PER_UNIT,
  PRODUCTS,
  backtest,
  generateSalesHistory,
} from "@/lib/bakery";
import { Card, fmt, PageHeader } from "../components/ui";

export const metadata: Metadata = { title: "Impact" };

export default function ImpactPage() {
  const r = backtest(generateSalesHistory(), 4);
  const moreShort = r.aiShort > r.baselineShort;

  return (
    <>
      <PageHeader title="Impact (backtest)">
        <p className="text-sm">
          Replay of the last 4 weeks ({r.days} days × {PRODUCTS.length} products) on synthetic data. Baseline = same
          day last week + {Math.round(BASELINE_BUFFER * 100)}%. AI = the recommended bake. Sales are treated as true
          demand.
        </p>
      </PageHeader>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          label="Units wasted"
          value={
            <>
              {fmt(r.aiWaste)} <span className="text-base font-normal text-stone-600">AI</span>
            </>
          }
          note={`vs ${fmt(r.baselineWaste)} with baseline`}
        />
        <Card
          label="Waste reduction"
          value={`${fmt(r.wasteReductionPct)}%`}
          note={`${fmt(r.unitsSaved)} fewer units thrown away`}
          highlight
        />
        <Card label="Food saved" value={`${fmt(r.kgSaved, 1)} kg`} note={`At ${KG_PER_UNIT} kg per unit`} estimate />
        <Card
          label="CO₂e saved"
          value={`${fmt(r.co2eSaved, 1)} kg CO₂e`}
          note={`Placeholder factor ${CO2E_PER_KG} kg CO₂e per kg food`}
          estimate
        />
        <Card
          label="Units short (stockouts)"
          value={
            <>
              {fmt(r.aiShort)} <span className="text-base font-normal text-stone-600">AI</span>
            </>
          }
          note={`vs ${fmt(r.baselineShort)} with baseline. ${
            moreShort
              ? "Trade-off: a smaller buffer means selling out more often."
              : "No extra stockouts versus baseline."
          }`}
          warn={moreShort}
        />
        <Card
          label="Units baked"
          value={
            <>
              {fmt(r.aiBaked)} <span className="text-base font-normal text-stone-600">AI</span>
            </>
          }
          note={`vs ${fmt(r.baselineBaked)} baseline · demand ${fmt(r.demand)}`}
        />
      </dl>
    </>
  );
}
