"use client";

// Shared in-memory state so the plan and leftovers survive moving between pages.
// Nothing is persisted: a reload starts fresh.

import { createContext, useContext, useMemo, useState } from "react";
import { PRODUCTS, generateSalesHistory, tomorrowForecast, type Forecast, type Product } from "@/lib/bakery";

export interface LeftoverRow {
  leftover: string;
  useBy: boolean;
}

interface BakeryState {
  forecasts: Forecast[];
  quantities: Record<string, string>;
  setQuantity: (product: Product, value: string) => void;
  resetQuantities: () => void;
  approved: boolean;
  approve: () => void;
  leftovers: Record<Product, LeftoverRow>;
  setLeftover: (product: Product, row: LeftoverRow) => void;
}

const BakeryContext = createContext<BakeryState | null>(null);

export function BakeryProvider({ children }: { children: React.ReactNode }) {
  const forecasts = useMemo(() => tomorrowForecast(generateSalesHistory()), []);
  const suggested = () => Object.fromEntries(forecasts.map((f) => [f.product, String(f.recommended)]));

  const [quantities, setQuantities] = useState<Record<string, string>>(suggested);
  const [approved, setApproved] = useState(false);
  const [leftovers, setLeftovers] = useState(
    () => Object.fromEntries(PRODUCTS.map((p) => [p, { leftover: "", useBy: false }])) as Record<Product, LeftoverRow>,
  );

  const value: BakeryState = {
    forecasts,
    quantities,
    setQuantity: (product, v) => {
      setQuantities((q) => ({ ...q, [product]: v }));
      setApproved(false);
    },
    resetQuantities: () => {
      setQuantities(suggested());
      setApproved(false);
    },
    approved,
    approve: () => setApproved(true),
    leftovers,
    setLeftover: (product, row) => setLeftovers((r) => ({ ...r, [product]: row })),
  };

  return <BakeryContext.Provider value={value}>{children}</BakeryContext.Provider>;
}

export function useBakery(): BakeryState {
  const ctx = useContext(BakeryContext);
  if (!ctx) throw new Error("useBakery must be used inside BakeryProvider");
  return ctx;
}

export function parseQuantity(raw: string) {
  const n = Number(raw);
  return { valid: raw !== "" && Number.isInteger(n) && n >= 0, n };
}
