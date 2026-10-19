# Pitch deck: Why stores choose us

An 11-slide deck answering the three questions stores ask:

1. **Why pay for it?** The app saves more money than it costs (slides 2–4).
2. **Why keep paying?** Long-term value after the routine is learned (slides 5–7).
3. **Can we trust it?** Data security and guardrails (slides 8–10).

**Present it here:** <https://claude.ai/artifact/ShtHoaz3D7UkU1jU8GkwQW>.
The link is private until its owner shares it from the page's **Share** menu.
From that page the deck can be downloaded as PowerPoint or PDF.

## Files

| File | What it is |
|---|---|
| `teamGreen-Bake-What-Youll-Sell.pdf` | Main hackathon pitch (8 pages): problem, prototype, impact, responsible AI, next steps |
| `teamGreen-Why-Stores-Choose-Us.pdf` | The whole deck as a PDF (11 pages, 16:9), no speaker notes |
| `speaker-notes.md` | Slide titles and what to say, easiest to read on GitHub |
| `deck.json` | Slide order, sections and fonts |
| `slides/<id>.html` | One slide each (1920×1080, inline styles, speaker notes in `<aside>`) |

The slide files are the source of the deck page above. They use a slide format
with a few custom elements (`<x-icon>`, `<x-shape>`), so they don't render
correctly when opened directly in a browser.

## Before presenting

- **Placeholders:** the app price `[990]` (slides 3 and 11) and the share of
  savings `[20%]` (slide 7) still need to be decided.
- **Numbers on slides 2–3** come from the Impact page of the weather-aware
  version of the app (out-of-sample backtest, 22 Sep–19 Oct 2026, synthetic
  bakery data, compared with last week + 20%). Update them if the app changes.
- **Slides 8–10** (data, guardrails, known gaps) were checked against the code
  in commit `5313165`. Re-check them once the weather-aware version is pushed.
