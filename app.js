/* =============================================
   js/app.js  –  Tokyo Neon Empire
   Entry point · state · controls · data load
   ============================================= */

"use strict";

const App = (() => {
  /* ── App state ── */
  const state = {
    scene:  "pink",   // "pink" | "blue" | "dream"
    mode:   "night",  // "night" | "bright"
    loaded: false
  };

  /* ── Scene cycle ── */
  const SCENES = ["pink", "blue", "dream"];
  const SCENE_LABELS = {
    pink:  { power: "Live · Pink city mode", text: "Neon haze, drifting petals, and idol energy at the frame edges." },
    blue:  { power: "Live · Blue mode",       text: "Moonlight cycle active. Cool sparks and a softer cyber glow." },
    dream: { power: "Live · Dream mode",       text: "Violet space, shimmering stars, and a surreal opening-scene mood." }
  };

  /* ── Wire controls ── */
  function wireControls() {
    const moodBtn  = document.getElementById("moodBtn");
    const burstBtn = document.getElementById("burstBtn");
    const modeBtn  = document.getElementById("modeBtn");
    const glow     = document.getElementById("glow");

    if (moodBtn) moodBtn.addEventListener("click", shiftScene);
    if (burstBtn) burstBtn.addEventListener("click", () => doBurst());
    if (modeBtn)  modeBtn.addEventListener("click", toggleMode);

    document.addEventListener("mousemove", e => {
      if (glow) {
        glow.style.left = e.clientX + "px";
        glow.style.top  = e.clientY + "px";
      }
      Particles.onMove(e.clientX, e.clientY);
    });

    document.addEventListener("click", e => {
      Particles.onClick(e.clientX, e.clientY);
    });

    document.addEventListener("keydown", e => {
      if (e.code === "Space") {
        e.preventDefault();
        doBurst();
      }
      if (e.code === "KeyM") shiftScene();
    });
  }

  /* ── Scene shift ── */
  function shiftScene() {
    state.scene = SCENES[(SCENES.indexOf(state.scene) + 1) % SCENES.length];
    Particles.setScene(state.scene);
    Particles.burst();
    const info = SCENE_LABELS[state.scene];
    UI.setPower(88, info.power, info.text);

    // Tint cursor glow
    const glow = document.getElementById("glow");
    if (glow) {
      const tints = {
        pink:  "radial-gradient(circle, rgba(255,63,212,.18), rgba(153,102,255,.07) 30%, transparent 70%)",
        blue:  "radial-gradient(circle, rgba(94,232,255,.16), rgba(94,232,255,.05) 30%, transparent 70%)",
        dream: "radial-gradient(circle, rgba(153,102,255,.2), rgba(255,63,212,.06) 30%, transparent 70%)"
      };
      glow.style.background = tints[state.scene];
    }
  }

  /* ── Burst ── */
  function doBurst() {
    Particles.burst();
    UI.setPower(100, "BURST!", "The city detonates into neon energy — Tokyo on max power.");
    setTimeout(() => {
      const info = SCENE_LABELS[state.scene];
      UI.setPower(82, info.power, info.text);
    }, 700);
  }

  /* ── Mode toggle ── */
  function toggleMode() {
    state.mode = state.mode === "night" ? "bright" : "night";
    document.body.style.filter = state.mode === "bright"
      ? "saturate(1.25) brightness(1.1)"
      : "none";
    const btn = document.getElementById("modeBtn");
    if (btn) btn.textContent = state.mode === "night" ? "Pulse mode" : "Normal mode";
  }

  /* ── Load data ── */
  async function loadData() {
    UI.setStatus("Connecting…", "");

    try {
      const raw = await API.fetchAll();

      const popSeries  = raw.population   ?? JAPAN_DATA.population.fallbackSeries;
      const tourLatest = raw.tourism       ? API.latest(raw.tourism)?.value  : null;
      const airLatest  = raw.airPassengers ? API.latest(raw.airPassengers)?.value : null;

      const data = {
        population:    popSeries,
        tourismLatest: tourLatest,
        airLatest:     airLatest
      };

      const isLive = !!raw.population;
      UI.setStatus(
        isLive ? `Live · ${popSeries[0].year}` : "Fallback",
        isLive ? "live" : "fallback"
      );
      UI.setPower(
        isLive ? 84 : 52,
        isLive ? "Live" : "Fallback",
        isLive
          ? "World Bank · JNTO · e-Stat data active."
          : "Live fetch unavailable — running on curated data."
      );

      UI.init(data);
      state.loaded = true;

    } catch (err) {
      console.warn("[App] loadData error:", err);
      const fallback = {
        population:    JAPAN_DATA.population.fallbackSeries,
        tourismLatest: JAPAN_DATA.tourism.arrivals2024,
        airLatest:     JAPAN_DATA.hospitality.airPassengers2024
      };
      UI.setStatus("Fallback", "fallback");
      UI.setPower(52, "Fallback", "Running on curated statistics — live API unreachable.");
      UI.init(fallback);
      state.loaded = true;
    }
  }

  /* ── Bootstrap ── */
  function init() {
    Particles.init(document.getElementById("sky"));
    wireControls();
    loadData();
  }

  return { init };
})();

/* Start when DOM is ready */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", App.init);
} else {
  App.init();
}
