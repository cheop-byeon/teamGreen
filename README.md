# teamGreen

Explainable bake planning to help a small bakery reduce food waste. Runs entirely in the browser: no backend, no database, no API keys. All data is synthetic demo data.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Pages

- **Overview** (`/`) – plan status, shelf status and backtest headline
- **Tomorrow's plan** (`/plan`) – forecast per product (average of the last 4 same weekdays + 5% buffer), editable quantities, owner approval
- **Inventory** (`/inventory`) – batches with use-by times and suggested discounts based on remaining selling time
- **Giveaway bags** (`/bags`) – packs expiring items into mixed bags to sell on a surplus app or give away free
- **End of day** (`/end-of-day`) – leftovers with rule-based suggestions (discount, surplus app, donate, or compost if use-by passed)
- **Impact** (`/impact`) – 4-week backtest vs a naive baseline: waste, kg and CO₂e saved (estimates), stockouts
- **Limitations** (`/limitations`)

Logic lives in `lib/bakery.ts` (data, forecast, backtest) and `lib/inventory.ts` (expiry rules, discounts, bag packing).

AI suggests. You decide.
