import type { Metadata } from "next";
import { PageHeader } from "../components/ui";
import { DemoClock } from "../components/demo-clock";
import { BagBuilder } from "./bag-builder";

export const metadata: Metadata = { title: "Giveaway bags" };

export default function BagsPage() {
  return (
    <>
      <PageHeader title="Giveaway bags">
        <p>
          Units selected in the inventory are packed into mixed bags. You can sell them cheaply on a surplus app (e.g.
          Too Good To Go) or give them away free to a food bank or community fridge. Expired items are never included.
        </p>
      </PageHeader>
      <DemoClock />
      <BagBuilder />
    </>
  );
}
