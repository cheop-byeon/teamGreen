import type { Metadata } from "next";
import { PageHeader } from "../components/ui";
import { DemoClock } from "../components/demo-clock";
import { InventoryList } from "./inventory-list";

export const metadata: Metadata = { title: "Inventory" };

export default function InventoryPage() {
  return (
    <>
      <PageHeader title="Inventory & expiry">
        <p>
          Every batch on the shelf, most urgent first, with a suggested discount based on how much selling time is
          left before its use-by. <strong className="text-emerald-800">AI suggests. You decide.</strong>
        </p>
      </PageHeader>
      <DemoClock />
      <InventoryList />
    </>
  );
}
