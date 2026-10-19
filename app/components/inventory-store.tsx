"use client";

// Shared in-memory inventory state (stock, demo clock, owner decisions).
// Nothing is persisted: a reload starts fresh.

import { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/bakery";
import {
  DEFAULT_CLOCK_HOUR,
  assess,
  clockAt,
  makeBatch,
  seedInventory,
  type Assessment,
  type Batch,
} from "@/lib/inventory";

export type BagMode = "sell" | "donate";

export interface AssessedBatch {
  batch: Batch;
  a: Assessment;
  inBags: boolean;
  discountApplied: boolean;
}

interface InventoryState {
  clockHour: number;
  setClockHour: (h: number) => void;
  now: Date;
  items: AssessedBatch[]; // sorted, most urgent first
  setQuantity: (id: string, quantity: number) => void;
  removeBatch: (id: string) => void;
  addBatch: (product: Product, quantity: number, bakedHour: number) => void;
  toggleDiscount: (id: string) => void;
  setInBags: (id: string, inBags: boolean) => void;
  bagTarget: number;
  setBagTarget: (v: number) => void;
  bagMode: BagMode;
  setBagMode: (m: BagMode) => void;
  bagsApprovedFor: string | null;
  approveBags: (signature: string) => void;
}

const InventoryContext = createContext<InventoryState | null>(null);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [clockHour, setClockHour] = useState(DEFAULT_CLOCK_HOUR);
  const [batches, setBatches] = useState<Batch[]>(seedInventory);
  const [nextId, setNextId] = useState(100);
  const [discounts, setDiscounts] = useState<Record<string, boolean>>({});
  const [bagOverrides, setBagOverrides] = useState<Record<string, boolean>>({});
  const [bagTarget, setBagTarget] = useState(150);
  const [bagMode, setBagMode] = useState<BagMode>("sell");
  const [bagsApprovedFor, setBagsApprovedFor] = useState<string | null>(null);

  const now = useMemo(() => clockAt(clockHour), [clockHour]);

  const items = useMemo(
    () =>
      batches
        .map((batch) => {
          const a = assess(batch, now);
          return {
            batch,
            a,
            inBags: a.bagEligible && (bagOverrides[batch.id] ?? a.bagByDefault),
            discountApplied: a.discountPct > 0 && !!discounts[batch.id],
          };
        })
        .sort((x, y) => x.a.hoursToUseBy - y.a.hoursToUseBy),
    [batches, now, bagOverrides, discounts],
  );

  const value: InventoryState = {
    clockHour,
    setClockHour,
    now,
    items,
    setQuantity: (id, quantity) =>
      setBatches((bs) => bs.map((b) => (b.id === id ? { ...b, quantity: Math.max(0, quantity) } : b))),
    removeBatch: (id) => setBatches((bs) => bs.filter((b) => b.id !== id)),
    addBatch: (product, quantity, bakedHour) => {
      setBatches((bs) => [...bs, makeBatch(`n${nextId}`, product, quantity, clockAt(bakedHour))]);
      setNextId((n) => n + 1);
    },
    toggleDiscount: (id) => setDiscounts((d) => ({ ...d, [id]: !d[id] })),
    setInBags: (id, inBags) => setBagOverrides((o) => ({ ...o, [id]: inBags })),
    bagTarget,
    setBagTarget,
    bagMode,
    setBagMode,
    bagsApprovedFor,
    approveBags: setBagsApprovedFor,
  };

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryState {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used inside InventoryProvider");
  return ctx;
}
