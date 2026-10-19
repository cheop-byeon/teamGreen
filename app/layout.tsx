import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { BakeryProvider } from "./components/store";
import { InventoryProvider } from "./components/inventory-store";
import { MainNav } from "./components/nav";
import { focusRing } from "./components/ui";
import { DEMO_TODAY, formatDate } from "@/lib/bakery";

export const metadata: Metadata = {
  title: { default: "teamgreen", template: "%s · teamgreen" },
  description: "Explainable bake planning to reduce food waste in a small bakery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <a
          href="#main"
          className={`sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-white focus:px-3 focus:py-2 ${focusRing}`}
        >
          Skip to content
        </a>
        <header className="bg-emerald-900 text-white">
          <div className="mx-auto max-w-5xl px-4 py-5">
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className={`rounded text-2xl font-bold tracking-tight ${focusRing}`}>
                teamgreen
              </Link>
              <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-amber-950">
                Synthetic demo data
              </span>
              <span className="text-sm text-emerald-50">Demo &quot;today&quot;: {formatDate(DEMO_TODAY)}</span>
            </div>
            <MainNav />
          </div>
        </header>

        <BakeryProvider>
          <InventoryProvider>
            <main id="main" className="mx-auto max-w-5xl px-4 py-8">
              {children}
            </main>
          </InventoryProvider>
        </BakeryProvider>

        <footer className="mx-auto max-w-5xl px-4 pb-10 text-sm text-stone-600">
          Runs entirely in your browser. No data leaves this page.{" "}
          <Link href="/limitations" className={`rounded underline ${focusRing}`}>
            Read the limitations
          </Link>
          .
        </footer>
      </body>
    </html>
  );
}
