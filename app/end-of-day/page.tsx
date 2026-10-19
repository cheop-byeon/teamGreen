import type { Metadata } from "next";
import { PageHeader } from "../components/ui";
import { LeftoversForm } from "./leftovers-form";

export const metadata: Metadata = { title: "End of day" };

export default function EndOfDayPage() {
  return (
    <>
      <PageHeader title="End of day">
        <p>
          Enter what&apos;s left over. Suggestions follow simple food-safety rules and are listed in order of
          preference.
        </p>
      </PageHeader>
      <LeftoversForm />
    </>
  );
}
