/* =============================================
   js/ui.js  –  Tokyo Neon Empire
   All DOM construction + dynamic UI updates
   ============================================= */

"use strict";

const UI = (() => {

  /* ── Helpers ── */
  const $ = id => document.getElementById(id);
  const fmtN = n => n?.toLocaleString() ?? "—";

  /* ── Build ticker ── */
  function buildTicker() {
    const track = $("tickerTrack");
    if (!track) return;
    // Duplicate facts for seamless loop
    const doubled = [...TICKER_FACTS, ...TICKER_FACTS];
    track.innerHTML = doubled.map(f =>
      `<span><span class="badge">${f.badge}</span> ${f.text}</span>`
    ).join("");
  }

  /* ── Build stats bar (top 4 numbers) ── */
  function updateStatsBar(data) {
    const popSeries  = data.population ?? JAPAN_DATA.population.fallbackSeries;
    const latest     = popSeries[0];
    const prev       = popSeries[1] ?? latest;
    const popDiff    = latest.value - prev.value;
    const up         = popDiff >= 0;

    const tourVal    = data.tourismLatest ?? JAPAN_DATA.tourism.arrivals2024;
    const airVal     = data.airLatest     ?? JAPAN_DATA.hospitality.airPassengers2024;

    setStatCard("statPop",    fmtN(latest.value),  "Japan population",     `${up ? "▲" : "▼"} ${Math.abs(popDiff).toLocaleString()} vs prior year`, up ? "up" : "down");
    setStatCard("statTour",   fmtN(tourVal),        "Tourism arrivals",     "▲ record high 2024", "up");
    setStatCard("statAir",    fmtN(Math.round(airVal)), "Air passengers",   "World Bank latest", "up");
    setStatCard("statRetail", fmtN(JAPAN_DATA.retail.salesValueBillionYen) + "B¥", "Retail sales", `▲ ${JAPAN_DATA.retail.yoyChange}% YoY`, "up");
  }

  function setStatCard(id, value, label, delta, dir) {
    const card = $(id);
    if (!card) return;
    card.querySelector(".stat-value").textContent = value;
    card.querySelector(".stat-label").textContent = label;
    const d = card.querySelector(".stat-delta");
    if (d) { d.textContent = delta; d.className = `stat-delta ${dir}`; }
  }

  /* ── Build metric grid ── */
  function buildMetricGrid(data) {
    const grid = $("metricGrid");
    if (!grid) return;

    const popSeries = data.population ?? JAPAN_DATA.population.fallbackSeries;
    const tourVal   = data.tourismLatest ?? JAPAN_DATA.tourism.arrivals2024;

    const metrics = [
      {
        key: "Population",
        val: fmtN(popSeries[0].value),
        desc: `World Bank ${popSeries[0].year} · -500k/yr trend`
      },
      {
        key: "Tourism 2024",
        val: fmtN(tourVal),
        desc: "JNTO — record arrivals, +47% vs 2023"
      },
      {
        key: "Air passengers",
        val: fmtN(Math.round(data.airLatest ?? JAPAN_DATA.hospitality.airPassengers2024)),
        desc: "World Bank IS.AIR.PSGR"
      },
      {
        key: "Visitor spend",
        val: "¥" + (JAPAN_DATA.tourism.visitorSpend2024 / 1e12).toFixed(1) + "T",
        desc: "JNTO 2024 · inbound spend record"
      },
      {
        key: "GDP (USD)",
        val: "$" + (JAPAN_DATA.economy.gdpUSD / 1e12).toFixed(2) + "T",
        desc: "IMF estimate 2024"
      },
      {
        key: "USD / JPY",
        val: "¥" + JAPAN_DATA.economy.usdJpy.toFixed(2),
        desc: "Bank of Japan rate · e-Stat Apr 2026"
      },
      {
        key: "TOPIX",
        val: JAPAN_DATA.economy.topix.toFixed(2),
        desc: "Tokyo Price Index · e-Stat Apr 2026"
      },
      {
        key: "Nikkei 225",
        val: fmtN(JAPAN_DATA.economy.nikkei),
        desc: "TSE · Apr 2026 close"
      },
      {
        key: "Retail sales",
        val: "¥" + fmtN(JAPAN_DATA.retail.salesValueBillionYen) + "B",
        desc: "e-Stat Apr 2026 · +1.3% YoY"
      },
      {
        key: "Guest nights",
        val: fmtN(JAPAN_DATA.hospitality.guestNights),
        desc: "e-Stat Mar 2026"
      },
      {
        key: "Unemployment",
        val: JAPAN_DATA.economy.unemploymentRate + "%",
        desc: "Near-record low 2024"
      },
      {
        key: "Inflation CPI",
        val: JAPAN_DATA.economy.inflation + "%",
        desc: "Japan CPI 2024 annual avg"
      }
    ];

    grid.innerHTML = metrics.map((m, i) =>
      `<div class="metric fade-in">
        <div class="metric-key">${m.key}</div>
        <div class="metric-val">${m.val}</div>
        <div class="metric-desc">${m.desc}</div>
      </div>`
    ).join("");
  }

  /* ── Build bar chart: tourism by country ── */
  function buildTourismChart() {
    const wrap = $("tourismChart");
    if (!wrap) return;
    const countries = JAPAN_DATA.tourism.topSourceCountries;
    const max = countries[0].arrivals;
    wrap.innerHTML = countries.map(c => {
      const pct = (c.arrivals / max * 100).toFixed(1);
      const colour = c.pct > 15
        ? "linear-gradient(90deg,var(--pink),var(--violet))"
        : c.pct > 8
          ? "linear-gradient(90deg,var(--violet),var(--blue))"
          : "linear-gradient(90deg,var(--blue),var(--green))";
      return `<div class="bar-row">
        <div class="bar-label">${c.country}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%;background:${colour}"></div>
        </div>
        <div class="bar-val">${(c.arrivals / 1e6).toFixed(1)}M</div>
      </div>`;
    }).join("");
  }

  /* ── Build population sparkline ── */
  function buildSparkline(series) {
    const canvasEl = $("popSparkline");
    if (!canvasEl) return;
    const s = (series ?? JAPAN_DATA.population.fallbackSeries).slice(0, 10).reverse();
    const vals = s.map(r => r.value);
    const min  = Math.min(...vals);
    const max  = Math.max(...vals);
    const W = canvasEl.offsetWidth  || 240;
    const H = canvasEl.offsetHeight || 80;
    canvasEl.width  = W;
    canvasEl.height = H;
    const c = canvasEl.getContext("2d");

    const toY = v => H - 10 - ((v - min) / (max - min || 1)) * (H - 20);
    const toX = (i) => 10 + (i / (vals.length - 1)) * (W - 20);

    // Gradient fill
    const grad = c.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(255,63,212,0.3)");
    grad.addColorStop(1, "rgba(255,63,212,0)");

    c.beginPath();
    c.moveTo(toX(0), toY(vals[0]));
    vals.forEach((v, i) => {
      if (i === 0) return;
      const cx1 = (toX(i - 1) + toX(i)) / 2;
      c.bezierCurveTo(cx1, toY(vals[i - 1]), cx1, toY(v), toX(i), toY(v));
    });
    c.lineTo(toX(vals.length - 1), H);
    c.lineTo(toX(0), H);
    c.closePath();
    c.fillStyle = grad;
    c.fill();

    // Line
    c.beginPath();
    c.moveTo(toX(0), toY(vals[0]));
    vals.forEach((v, i) => {
      if (i === 0) return;
      const cx1 = (toX(i - 1) + toX(i)) / 2;
      c.bezierCurveTo(cx1, toY(vals[i - 1]), cx1, toY(v), toX(i), toY(v));
    });
    c.strokeStyle = "rgba(255,63,212,0.9)";
    c.lineWidth = 2;
    c.shadowColor = "rgba(255,63,212,0.6)";
    c.shadowBlur = 6;
    c.stroke();

    // Dots
    vals.forEach((v, i) => {
      c.beginPath();
      c.arc(toX(i), toY(v), 3, 0, Math.PI * 2);
      c.fillStyle = "#ff3fd4";
      c.shadowColor = "#ff3fd4";
      c.shadowBlur = 8;
      c.fill();
    });
  }

  /* ── Build gallery cards ── */
  function buildGallery() {
    const el = $("gallery");
    if (!el) return;
    const cards = [
      {
        title: "Pink Skyline",
        text: "Retail sales, consumer spending, and the electric glow of Tokyo's shopping districts.",
        tags: ["Retail ¥" + JAPAN_DATA.retail.salesValueBillionYen + "B", "Tokyo", "e-Stat"],
        offset: 0
      },
      {
        title: "Moon Highway",
        text: "Air routes, inbound flights, and the 121M passengers moving through Japan's skies each year.",
        tags: ["Air", "Tourism", "JNTO"],
        offset: 8
      },
      {
        title: "Dream Station",
        text: "Population trends, demographics, and 30 years of Japan's incredible cultural output.",
        tags: ["Population", "Anime", "1990s vibes"],
        offset: 0
      }
    ];
    el.innerHTML = cards.map(c =>
      `<article class="project fade-in" style="transform:translateY(${c.offset}px)">
        <div>
          <h4>${c.title}</h4>
          <p>${c.text}</p>
        </div>
        <div class="pill-row">
          ${c.tags.map(t => `<span class="pill">${t}</span>`).join("")}
        </div>
      </article>`
    ).join("");
  }

  /* ── Build timeline ── */
  function buildTimeline(data) {
    const el = $("timeline");
    if (!el) return;
    const popSeries = data.population ?? JAPAN_DATA.population.fallbackSeries;
    const latest    = popSeries[0];
    const prev      = popSeries[1] ?? latest;
    const diff      = latest.value - prev.value;

    const items = [
      {
        year: "2019",
        title: "Pre-COVID peak",
        text: `Japan welcomed ${JAPAN_DATA.tourism.arrivals2019.toLocaleString()} visitors — the highest at that time, boosted by Rugby World Cup.`
      },
      {
        year: "2022",
        title: "Borders reopen",
        text: `After pandemic closure, Japan reopened borders in Oct 2022. Arrivals: ${JAPAN_DATA.tourism.arrivals2022.toLocaleString()} for the year.`
      },
      {
        year: "2024",
        title: "Record tourism",
        text: `${JAPAN_DATA.tourism.arrivals2024.toLocaleString()} arrivals — all-time record. Visitor spending: ¥${(JAPAN_DATA.tourism.visitorSpend2024/1e12).toFixed(1)} trillion.`
      },
      {
        year: latest.year,
        title: "Population now",
        text: `Japan population: ${fmtN(latest.value)}. Year-on-year: ${diff > 0 ? "+" : ""}${fmtN(diff)} (${diff > 0 ? "▲" : "▼"} trend).`
      },
      {
        year: "2026",
        title: "Live dashboard",
        text: `Retail: ¥${JAPAN_DATA.retail.salesValueBillionYen}B. Guest nights: ${fmtN(JAPAN_DATA.hospitality.guestNights)}. USD/JPY: ¥${JAPAN_DATA.economy.usdJpy}.`
      }
    ];

    el.innerHTML = items.map(item =>
      `<div class="timeline-item fade-in">
        <div class="t-year">${item.year}</div>
        <div>
          <div class="t-title">${item.title}</div>
          <div class="t-text">${item.text}</div>
        </div>
      </div>`
    ).join("");
  }

  /* ── Build JSON view ── */
  function buildJSON(data) {
    const el = $("jsonView");
    if (!el) return;
    const popSeries = data.population ?? JAPAN_DATA.population.fallbackSeries;
    const payload = {
      source: "Tokyo Neon Empire dashboard",
      retrieved: new Date().toISOString(),
      live: {
        populationYear: popSeries[0].year,
        population: popSeries[0].value,
        populationChange: popSeries[0].value - (popSeries[1]?.value ?? popSeries[0].value),
        tourismArrivals: data.tourismLatest ?? JAPAN_DATA.tourism.arrivals2024,
        airPassengers: data.airLatest       ?? JAPAN_DATA.hospitality.airPassengers2024
      },
      economy: JAPAN_DATA.economy,
      retail:  JAPAN_DATA.retail,
      tourism: { ...JAPAN_DATA.tourism, topSourceCountries: undefined }
    };
    el.textContent = JSON.stringify(payload, null, 2);
  }

  /* ── Live feed ── */
  let feedInterval = null;
  function startFeed() {
    const container = $("liveFeed");
    if (!container) return;
    let i = 0;
    const push = () => {
      const evt  = FEED_EVENTS[i % FEED_EVENTS.length];
      const now  = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const item = document.createElement("div");
      item.className = "feed-item";
      item.innerHTML = `
        <div class="feed-dot ${evt.color}"></div>
        <div class="feed-text">${evt.text}</div>
        <div class="feed-time">${now}</div>`;
      container.prepend(item);
      // Cap at 6 items
      while (container.children.length > 6) container.lastChild.remove();
      i++;
    };
    push();
    feedInterval = setInterval(push, 2800);
  }

  /* ── Power bar animation ── */
  function startPowerBar() {
    const bar   = $("powerBar");
    const label = $("powerState");
    const text  = $("powerText");
    if (!bar) return;
    setInterval(() => {
      const pct = 30 + Math.round((Math.sin(Date.now() / 700) + 1) * 34);
      bar.style.width = pct + "%";
    }, 500);
  }

  function setPower(pct, label, body) {
    const bar   = $("powerBar");
    const label_ = $("powerState");
    const text  = $("powerText");
    if (bar)    bar.style.width = pct + "%";
    if (label_) label_.textContent = label;
    if (text)   text.textContent  = body;
  }

  /* ── Status chip ── */
  function setStatus(text, type) {
    const chip = $("statusChip");
    if (!chip) return;
    chip.textContent = text;
    chip.className = "chip " + (type || "");
  }

  /* ── Clock ── */
  function startClock() {
    const el = $("clock");
    if (!el) return;
    const tick = () => el.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    tick();
    setInterval(tick, 1000);
  }

  /* ── Sakura ── */
  function createSakura() {
    const p = document.createElement("div");
    p.className = "sakura";
    p.textContent = Math.random() > 0.5 ? "✿" : "❀";
    p.style.left = Math.random() * 100 + "vw";
    p.style.fontSize = (12 + Math.random() * 16) + "px";
    p.style.animationDuration = (6 + Math.random() * 8) + "s";
    p.style.opacity = 0.3 + Math.random() * 0.7;
    document.body.appendChild(p);
    p.addEventListener("animationend", () => p.remove());
  }

  /* ── Full init call ── */
  function init(data) {
    buildTicker();
    updateStatsBar(data);
    buildMetricGrid(data);
    buildTourismChart();
    buildSparkline(data.population);
    buildGallery();
    buildTimeline(data);
    buildJSON(data);
    startFeed();
    startPowerBar();
    startClock();
    setInterval(createSakura, 700);
  }

  return { init, updateStatsBar, buildMetricGrid, buildTimeline, buildJSON, buildSparkline, setPower, setStatus };
})();
