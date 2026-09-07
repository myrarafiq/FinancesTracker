# Where Did My Money Go?! 💸

A playful personal finance analyzer. Paste a list of recent expenses, and the app categorizes them, visualizes spending, assigns a financial personality, and writes a short roast of your habits — all in the browser, with no backend or API.

**Paste receipts in. Get roasted out.**

**Live demo:** [https://finances-tracker-indol.vercel.app/](https://finances-tracker-indol.vercel.app/)

---

## What it does

- Parses messy expense lists like `$8 coffee` or `lunch $14`
- Categorizes each purchase with rule-based keyword matching (Food, Coffee, Shopping, Transportation, and more)
- Shows totals, averages, and the biggest expense
- Renders a donut chart and ranked bar chart by category
- Scores spending as Responsible / Treat Yourself / Financially Questionable (always adds up to 100%)
- Assigns a personality, such as *The Treat Yourself Specialist* or *The Financial Menace*
- Generates a personalized roast and 3–5 data-backed insights
- Includes a **What If You Cut Back?** calculator for hypothetical savings
- Gives a playful financial score out of 100

Everything runs locally in the browser. No accounts, no database, no external AI.

---

## Tech stack

| Layer | Tools |
| --- | --- |
| UI | React 19 |
| Bundler | Vite 6 |
| Charts | Custom SVG (donut + bars) |
| Analysis | Vanilla JavaScript in `src/analyze.js` |
| Styling | Custom CSS |

---

## Getting started

Try it without installing: [finances-tracker-indol.vercel.app](https://finances-tracker-indol.vercel.app/)

**Requirements to run locally:** Node.js 18+

```bash
git clone https://github.com/myrarafiq/FinancesTracker.git
cd FinancesTracker
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Sample expenses are already loaded — click **Analyze My Spending**.

```bash
npm run build    # production build
npm run preview  # preview the production build
```

---

## How the analysis works

The interesting part is not a finance API — it is client-side data processing.

1. **Parse** each line for an amount and a description (`$8 coffee`, `coffee $8`, and `14.50 lunch` all work).
2. **Classify** the description against keyword rules (for example, `uber` → Transportation, `netflix` → Entertainment, `groceries` → Food).
3. **Aggregate** totals, averages, category rankings, and impulse-purchase counts.
4. **Score** personality by weighting categories (rent leans Responsible; shopping leans Questionable), then normalize to 100%.
5. **Generate copy** from templates that plug in the user’s real numbers, so the roast and insights change with the data.

Try the built-in presets — **Sample week**, **Coffee-fueled**, **Adulting**, **Financial menace** — to see how the personality, charts, and roast shift.

---

## Project structure

```
src/
  App.jsx       UI: landing page, dashboard, charts, what-if controls
  App.css       Layout and visual design
  analyze.js    Parsing, categorization, personality, roast, insights, score
  main.jsx      React entry point
```

---

## License

Personal / academic project. Feel free to fork and remix.
