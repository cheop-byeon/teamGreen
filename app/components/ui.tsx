import Link from "next/link";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-700";

export const fmt = (n: number, digits = 0) =>
  n.toLocaleString("en-GB", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{title}</h1>
      {children && <div className="mt-2 max-w-3xl text-stone-700">{children}</div>}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6 ${className}`}>{children}</div>
  );
}

export function Card({
  label,
  value,
  note,
  highlight,
  estimate,
  warn,
}: {
  label: string;
  value: React.ReactNode;
  note: string;
  highlight?: boolean;
  estimate?: boolean;
  warn?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-emerald-300 bg-emerald-50"
          : warn
            ? "border-amber-300 bg-amber-50"
            : "border-stone-200 bg-white"
      }`}
    >
      <dt className="flex items-center gap-2 text-sm font-medium text-stone-700">
        {label}
        {estimate && (
          <span className="rounded bg-stone-200 px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-stone-800">
            estimate
          </span>
        )}
      </dt>
      <dd className="mt-1">
        <span className="block text-2xl font-bold tabular-nums text-stone-900">{value}</span>
        <span className="mt-1 block text-sm text-stone-700">{note}</span>
      </dd>
    </div>
  );
}

export function NextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-1 rounded-lg bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-900 ${focusRing}`}
    >
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}
