# teamGreen 🌱

**Explainable bake planning to help a small bakery reduce food waste.**

Team Green's entry for the **AI for Reducing Food Waste** challenge at the
[AI for Good Hackathon Norway 2026](https://luma.com/y9yfwgun)
(19 October 2026, BI Norwegian Business School, Oslo).

> AI suggests. You decide.

---

## The challenge

The hackathon asks for AI that **prevents** food waste instead of only
measuring it, through demand prediction, spotting at-risk inventory,
recommending purchasing decisions and suggesting redistribution.

## Our solution

A small bakery bakes every morning without knowing exactly how much will sell,
so unsold bread and pastries are thrown out at closing time. teamGreen helps the
owner at each point in the day:

| Challenge lever | How teamGreen handles it | Page |
|---|---|---|
| **Demand prediction** | Forecasts tomorrow's sales per product and explains how | Tomorrow's plan |
| **Purchasing / production** | Recommends bake quantities; the owner edits and approves them | Tomorrow's plan |
| **At-risk inventory** | Tracks use-by times and suggests discounts based on selling time left | Inventory |
| **Redistribution** | Packs expiring items into giveaway bags; end-of-day rules decide whether leftovers are discounted, listed on a surplus app, donated or composted | Giveaway bags, End of day |

The app runs **entirely in the browser**: no backend, no database, no API keys
and no personal data. All data is synthetic demo data.

### Pages

- **Overview** (`/`): plan status, shelf status and the backtest headline
- **Tomorrow's plan** (`/plan`): forecast per product (average of the last 4 same weekdays + 5% buffer), editable quantities, owner approval
- **Inventory** (`/inventory`): batches with use-by times and suggested discounts based on remaining selling time
- **Giveaway bags** (`/bags`): packs expiring items into mixed bags to sell on a surplus app or give away for free
- **End of day** (`/end-of-day`): leftovers with rule-based suggestions (discount, surplus app, donate, or compost if the use-by time has passed)
- **Impact** (`/impact`): 4-week backtest against a naive baseline (same day last week + buffer), showing waste, kg and CO₂e saved (estimates) and stockouts
- **Limitations** (`/limitations`): what to keep in mind before trusting the numbers

## Getting started

Requires [Node.js](https://nodejs.org/) 18.18 or later.

```bash
git clone https://github.com/cheop-byeon/teamGreen.git
cd teamGreen
npm install
npm run dev
```

Then open http://localhost:3000.

## Tech stack

[Next.js](https://nextjs.org/) 15 (App Router), React 19, TypeScript and
Tailwind CSS 4.

## Repository layout

```
teamGreen/
├── app/                 ← Next.js pages, one folder per page
│   ├── components/      ← shared UI, state stores, navigation, demo clock
│   ├── plan/            ← Tomorrow's plan
│   ├── inventory/       ← Inventory and discounts
│   ├── bags/            ← Giveaway bags
│   ├── end-of-day/      ← Leftover handling
│   ├── impact/          ← Backtest results
│   └── limitations/     ← Limitations
├── docs/
│   └── pitch/           ← pitch deck sources and speaker notes
└── lib/
    ├── bakery.ts        ← products, synthetic sales data, forecast, backtest
    └── inventory.ts     ← expiry rules, discounts, bag packing
```

## Limitations

- **Synthetic data:** sales are generated in code, so real-world results will differ.
- **No events or weather:** holidays, local events, weather and promotions aren't taken into account.
- **Illustrative rules:** shelf lives, discount tiers and bag sizes are defaults. Check your own food-safety rules.
- **Estimates only:** weight per unit and the CO₂e factor are placeholders, not measured values.
- **Human in the loop:** nothing is baked, discounted or donated automatically; the owner approves every decision.

## Working together

The hackathon runs only four hours (13:00–17:00), so keep it simple:

1. **Pull before you start:** `git pull --rebase origin main`
2. **Work on a branch** for anything bigger than a small fix:
   `git checkout -b <your-name>/<feature>`
3. **Commit small and often** with clear messages.
4. **Push** with `git push -u origin <branch>` and open a Pull Request, or push
   straight to `main` for small, safe changes.
5. **Tell the team before editing shared files** (e.g. `lib/`, this README) to
   avoid merge conflicts.
6. **Code freeze ~16:15** so there's time to rehearse the pitch.

## Pitch checklist

- [ ] Problem: why small bakeries waste food at closing time
- [ ] Solution: forecast → approved bake plan → discounts → giveaway bags → end-of-day rules
- [ ] Live demo of the main flow
- [ ] Impact: backtest waste reduction, kg and CO₂e saved
- [ ] Honesty: limitations, and the owner stays in control
- [ ] Next steps: real sales data, weather/events, pilot with a bakery

## Team

| Name | GitHub | Role |
|---|---|---|
| Ruhit Rafian Prinon | [@ruhitrafian66](https://github.com/ruhitrafian66) | Builder |
| Rizve Hasan | [@RizveOve](https://github.com/RizveOve) | Builder |
| Jie Bian | [@cheop-byeon](https://github.com/cheop-byeon) | Builder |
| Anne-Kristine | — | Collaborator |

## Acknowledgements

Organised by AI Mission Hub and BI Startup Village, in partnership with World
Climate School.
