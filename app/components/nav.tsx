"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "./ui";

export const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/plan", label: "Tomorrow's plan" },
  { href: "/inventory", label: "Inventory" },
  { href: "/bags", label: "Giveaway bags" },
  { href: "/end-of-day", label: "End of day" },
  { href: "/impact", label: "Impact" },
  { href: "/limitations", label: "Limitations" },
] as const;

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="mt-4">
      <ul className="flex flex-wrap gap-2 text-sm">
        {NAV_ITEMS.map(({ href, label }) => {
          const current = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={`inline-block rounded-full px-3 py-1.5 font-medium ${
                  current ? "bg-white text-emerald-900" : "bg-white/10 text-white hover:bg-white/20"
                } ${focusRing} focus-visible:ring-white focus-visible:ring-offset-emerald-900`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
