# 🌸 Tokyo Neon Empire

A **live Japan statistics dashboard** wrapped in a 1990s anime aesthetic.
Pink glows, floating idol characters, particle effects, and real data from World Bank, JNTO, and e-Stat.

---

## 📁 File structure

```
tokyo-neon-empire/
├── index.html              ← Main entry point
├── css/
│   ├── base.css            ← Variables, reset, topbar, footer, idols
│   ├── dashboard.css       ← Grid, hero, metrics, charts, panel
│   └── animations.css      ← All @keyframes + transition helpers
├── data/
│   └── japan-stats.js      ← All curated Japan statistics (fallback + enrichment)
└── js/
    ├── api.js              ← World Bank API fetch module
    ├── particles.js        ← Canvas sky + particle system
    ├── ui.js               ← All DOM rendering (metrics, charts, feed, timeline)
    └── app.js              ← Entry point, state, controls, data orchestration
```

---

## 🚀 Running locally

Just open `index.html` in any browser — no build step required.

```bash
# Optional: serve with a local server (avoids CORS on some browsers)
npx serve .
# or
python3 -m http.server 8080
```

---

## 🌐 Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set source to `main` branch, `/ (root)` folder.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`

---

## 📊 Data sources

| Stat | Source |
|------|--------|
| Population | World Bank `SP.POP.TOTL` (live API) |
| Tourist arrivals | World Bank `ST.INT.ARVL` (live API) + JNTO 2024 |
| Air passengers | World Bank `IS.AIR.PSGR` (live API) |
| Retail sales | e-Stat dashboard Apr 2026 |
| USD/JPY, TOPIX | e-Stat / Bank of Japan Apr 2026 |
| GDP, unemployment, inflation | IMF 2024 |
| Anime market | Association of Japanese Animations 2024 |
| Demographics | Statistics Bureau of Japan 2024 |
| Infrastructure | MLIT Japan 2024 |
| Tech/internet | MIC Japan / IDC 2024 |
| Energy | Agency for Natural Resources and Energy JP 2024 |

---

## 🎮 Controls

| Action | Effect |
|--------|--------|
| Click anywhere | Particle burst at cursor |
| `Space` | Big energy burst (center) |
| `M` | Cycle scene: Pink → Blue → Dream |
| **Shift mood** button | Same as `M` |
| **Energy burst** button | Same as `Space` |
| **Pulse mode** button | Toggle bright / night filter |

---

## ✨ Features

- **Live API data** — 3 World Bank indicators fetched on load
- **12 metric tiles** — economy, tourism, retail, finance
- **Population sparkline** — 10-year trend chart (canvas)
- **Tourism bar chart** — top 6 visitor countries 2024
- **Live feed** — simulated real-time event stream
- **Demographics panel** — age, birth rate, life expectancy
- **Economy deep-dive** — GDP growth, inflation, unemployment bars
- **JSON payload viewer** — full raw data visible
- **3 colour scenes** — pink / blue / dream, animated transitions
- **Particle system** — 180+ ambient particles, click-to-burst
- **Sakura petals** — CSS-animated, auto-generated
- **Floating idol characters** — pure CSS portraits
- **Scanlines + noise + vignette** — retro TV overlay
- **Fully responsive** — adapts to all screen sizes
- **No build tools** — plain HTML/CSS/JS, open in browser
