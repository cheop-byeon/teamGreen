# Speaker notes

Generated from the slide files in `slides/`.

## 1. Bake what you’ll sell

We built an app that helps a small bakery bake what it will actually sell, then sell or give away what is left before it becomes waste. When we talk to stores they ask three things: why should I pay for this, why would I keep paying once I have learned the routine, and can I trust it with my data and my food-safety responsibility? This deck answers those three questions using numbers from our own app.

## 2. 78% less food in the bin

These figures come from the Impact page of our app. It is an out-of-sample test: the model was trained only on sales before 22 September 2026, then we replayed every day from 22 September to 19 October, 28 days and five products, with the bake each method would have chosen. Recorded sales are treated as demand. A bakery that bakes last week's sales plus 20 percent throws away 1,764 items, costing 21,601 kroner to produce. With our weather-aware model on the Balanced goal, it throws away 387 items, costing 4,748 kroner. That is 1,377 fewer items, a 78 percent cut, or about 234 kilos of food and 586 kilos of CO2-equivalent. The food weights are per product; the CO2 factor of 2.5 kilos per kilo of food is a placeholder. The bakery data is synthetic but realistic, so say so if asked.

## 3. +12,201 kr profit in 4 weeks

The app now shows the money directly. Over the same 28 days, baking less saves 16,853 kroner in production cost for leftovers. Because we bake closer to demand, the bakery sells out more often, 790 units short instead of 561, and that loses 4,652 kroner more in margin. Net, profit, meaning revenue minus production cost, goes from 125,281 to 137,482 kroner: plus 12,201 kroner in four weeks. At a placeholder price of [990] kroner a month, that is roughly a 12 times return; it pays for itself in the first few days. If the team picks a different price, update the multiple. All kroner figures are estimates from synthetic data.

## 4. Bake less, without the risk

Be honest about where the money comes from. A large part of the saving is that owners stop baking 20 percent extra "just in case", and they only dare to do that because the app covers the risk at every step. First, the plan uses a weather-aware forecast and lets the owner pick a goal, balancing money and waste, so they trust a smaller extra. Second, if they still bake too much, the Inventory page suggests discounts as use-by approaches. Third, whatever is left goes into giveaway bags or to a food bank instead of the bin. So the message is: cut your safety buffer without the risk.

## 5. Month one cuts your waste by three quarters. After that, we stop it creeping back.

The fair objection: after a few months the owner has learned the routine, so why keep paying? Our answer is that what they learned in month one stops being right. Seasons, holidays, weather, a new café nearby, a price increase or a new product all change demand, while the owner's habits stay the same. Without feedback, people slide back to baking extra "just in case". The app keeps re-learning from new sales and keeps the waste from creeping back.

## 6. Six reasons stores stay

Three reasons work in the app today. First, the daily work: checking every batch's use-by time, picking the right discount at the right hour and packing bags takes seconds instead of a manual round. Second, the know-how: in most bakeries, how much to bake lives in one person's head; when that person is sick, on holiday or leaves, waste jumps. Third, the Impact page shows waste and savings, which keeps habits honest; today it is a 4-week replay, and a live monthly scorecard is the next step. The forecast model already takes weather into account, but holidays and new products are roadmap. Reporting and cross-store benchmarks are roadmap too. Retailers face growing pressure to measure food waste, for example the EU's 2030 reduction targets and Norway's industry agreement on food waste; check the current rules before quoting them.

## 7. Pricing that grows with the value

Pricing itself can answer the "why keep paying" objection. Option one: charge a share of measured savings, for example 20 percent. If the store stops saving, it stops paying, so there is no risk for them. Option two: two tiers, a full price during the first months while waste is being cut, then a cheaper tier for the daily routine and reporting. Either way, the price follows the value. These are options for the team to decide; the 20 percent is a placeholder.

## 8. Your data stays yours

The current demo is strong on privacy because it collects almost nothing. We checked the code: there are no network calls, no backend, no database, no API keys and no external AI service; the forecast is a transparent formula running in the browser. It handles product sales counts, not customers. For a real product, we would store sales data only and never customer or card details from the till; encrypt it, host it in the EU or EEA and keep each store separate; let a store export or delete its data; and only share data across stores in anonymised form, with consent. Say "planned" for the right-hand column, not "done".

## 9. AI suggests. The owner decides.

These guardrails are in the code today. The owner approves the bake plan and the giveaway bags; nothing happens automatically. If anyone edits a quantity or the stock changes, approval is cleared, so an old approval can't slip through. Food-safety rules are fixed rules, not AI guesses: expired items are always compost only and are never put in bags. Every forecast explains itself with the actual numbers it used, and the expected range. And the app is honest about its downsides: the Impact page shows that sell-outs go up, and there is a Limitations page about synthetic data and estimates.

## 10. Known gaps, and how we close them

We would rather name our gaps than have a judge find them. One: at 14:00 the app can put items with a 15:00 or 16:00 use-by into a giveaway bag, while surplus-app bags are usually picked up near closing; the fix is to only bag items still within use-by at pickup. Two: the "selling time left" countdown counts hours when the shop is closed, so some discounts are smaller than they should be; the fix is to count opening hours only. Three: the end-of-day page relies on staff ticking a "use-by passed" box; it should come from the inventory data instead. For a real product we would also cap how far a suggestion can move from last week unless the owner confirms, flag low-confidence days such as holidays or new products, and keep an audit log of what was suggested and what the owner decided. Because a human decides and there is no personal data, the app is likely low risk under the EU AI Act, but confirm that before claiming it.

## 11. Try it on your own numbers

To sum up: in our test it added about 12,000 kroner of profit in four weeks for one small bakery, roughly 12 times a [990] kroner monthly price, it keeps waste from creeping back as demand and staff change, and the owner stays in control while their data stays theirs. Our ask: let us run a 4-week pilot with your real sales data, and we will show you your own kroner-saved number instead of our demo figures.
