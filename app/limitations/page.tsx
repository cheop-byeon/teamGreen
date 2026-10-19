import type { Metadata } from "next";
import { PageHeader } from "../components/ui";

export const metadata: Metadata = { title: "Limitations" };

const ITEMS: [string, string][] = [
  ["Synthetic data.", "All sales are generated in code for demonstration; results will differ with real data."],
  ["No events or weather.", "Holidays, local events, weather and promotions are not taken into account."],
  [
    "Simple expiry rules.",
    "Shelf lives, discount tiers and bag sizes are illustrative defaults. Check your own food-safety rules and labels.",
  ],
  ["Estimates only.", "Weight per unit and the CO₂e factor are placeholders, not measured values."],
  [
    "The owner approves all decisions.",
    "The tool only suggests; nothing is baked, discounted or donated automatically.",
  ],
  ["No personal data.", "Nothing is collected or stored, and everything runs in your browser."],
];

export default function LimitationsPage() {
  return (
    <>
      <PageHeader title="Limitations">
        <p>Read this before relying on the numbers.</p>
      </PageHeader>
      <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 sm:p-6">
        <ul className="list-disc space-y-2 pl-5 text-amber-950">
          {ITEMS.map(([title, body]) => (
            <li key={title}>
              <strong>{title}</strong> {body}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
