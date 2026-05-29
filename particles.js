/* =============================================
   js/particles.js  –  Tokyo Neon Empire
   Canvas sky · Particle system · Cursor glow
   ============================================= */

"use strict";

const Particles = (() => {
  let canvas, ctx, w, h, dpr;
  let scene = "pink";   // "pink" | "blue" | "dream"
  const pool = [];

  /* ── Particle class ── */
  class Particle {
    constructor(x, y, vx, vy, radius, hue, life, glowSize = 14) {
      this.x = x; this.y = y;
      this.vx = vx; this.vy = vy;
      this.radius = radius;
      this.hue = hue;
      this.life = life;
      this.maxLife = life;
      this.glowSize = glowSize;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.008;            // gentle gravity
      this.vx *= 0.998;
      this.life -= 1;
      this.radius *= 0.995;
    }

    draw() {
      const a = Math.max(0, this.life / this.maxLife);
      ctx.beginPath();
      ctx.fillStyle = `hsla(${this.hue},100%,72%,${a})`;
      ctx.shadowColor = `hsla(${this.hue},100%,72%,${a * 0.7})`;
      ctx.shadowBlur = this.glowSize;
      ctx.arc(this.x, this.y, Math.max(0.3, this.radius), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── Resize ── */
  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    w = canvas.width  = Math.floor(window.innerWidth  * dpr);
    h = canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width  = window.innerWidth  + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /* ── Base hue per scene ── */
  function sceneHue() {
    if (scene === "blue")  return 195;
    if (scene === "dream") return 280;
    return 315;  // pink
  }

  /* ── Spawn particles ── */
  function spawn(x, y, count = 1, burst = false) {
    const base = sceneHue();
    for (let i = 0; i < count; i++) {
      const ang  = Math.random() * Math.PI * 2;
      const spd  = burst
        ? Math.random() * 7 + 2.5
        : Math.random() * 0.5 + 0.06;
      pool.push(new Particle(
        x, y,
        Math.cos(ang) * spd,
        Math.sin(ang) * spd,
        Math.random() * (burst ? 4 : 1.6) + 0.4,
        base + Math.random() * 70 - 35,
        burst ? 80 + Math.random() * 60 : 200 + Math.random() * 130,
        burst ? 24 : 13
      ));
    }
  }

  /* ── Radial backdrop per scene ── */
  function drawBackdrop() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const cx = window.innerWidth  * 0.5;
    const cy = window.innerHeight * 0.32;
    const r  = Math.max(window.innerWidth, window.innerHeight) * 0.86;
    const grad = ctx.createRadialGradient(cx, cy, 20, cx, cy, r);

    if (scene === "blue") {
      grad.addColorStop(0, "rgba(94,232,255,.13)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
    } else if (scene === "dream") {
      grad.addColorStop(0, "rgba(153,102,255,.13)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
    } else {
      grad.addColorStop(0, "rgba(255,63,212,.12)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }

  /* ── Main animation loop ── */
  function animate() {
    drawBackdrop();

    /* Remove dead particles */
    for (let i = pool.length - 1; i >= 0; i--) {
      const p = pool[i];
      p.update();
      p.draw();
      if (p.life <= 0 || p.radius < 0.15) pool.splice(i, 1);
    }

    /* Keep a base ambient field */
    const MIN_AMBIENT = 160;
    while (pool.length < MIN_AMBIENT) {
      spawn(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        1, false
      );
    }

    requestAnimationFrame(animate);
  }

  /* ── Public API ── */
  function init(canvasEl) {
    canvas = canvasEl;
    ctx    = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);

    // Seed ambient pool
    for (let i = 0; i < 180; i++) {
      spawn(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }
    animate();
  }

  function burst(x, y, count = 150) {
    x = x ?? window.innerWidth  / 2;
    y = y ?? window.innerHeight / 2;
    spawn(x, y, count, true);
  }

  function setScene(s) {
    scene = s;
  }

  function onMove(x, y) {
    if (Math.random() < 0.4) spawn(x, y, 1, false);
  }

  function onClick(x, y) {
    spawn(x, y, 22, true);
  }

  return { init, burst, setScene, onMove, onClick };
})();
