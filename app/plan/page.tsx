import type { Metadata } from "next";
import { AI_BUFFER, formatDate, generateSalesHistory, tomorrowDate } from "@/lib/bakery";
import { PageHeader } from "../components/ui";
import { PlanTable } from "./plan-table";

export const metadata: Metadata = { title: "Tomorrow's plan" };

export default function PlanPage() {
  const tomorrow = tomorrowDate(generateSalesHistory());
  return (
    <>
      <PageHeader title="Tomorrow's plan">
        <p>
          For <strong>{formatDate(tomorrow)}</strong>. <strong className="text-emerald-800">AI suggests. You decide.</strong>
        </p>
        <p className="mt-1 text-sm">
          Forecast = average of the last 4 same weekdays. Range = lowest–highest of those days. Recommended = rounded
          average + {Math.round(AI_BUFFER * 100)}% buffer.
        </p>
      </PageHeader>
      <PlanTable />
    </>
  );
}
