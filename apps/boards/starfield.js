// Calm twinkling stars behind the 우주 board theme: stars never move, they only
// brighten and dim slowly. Static when the viewer prefers reduced motion.
(() => {
  'use strict';
  let canvas = null, ctx = null, stars = [], frame = 0, last = 0, running = false;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');

  function seed() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = window.innerWidth, h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(260, Math.round(w * h / 7000));
    stars = Array.from({ length: count }, () => {
      const big = Math.random() < 0.08;
      return { x: Math.random() * w, y: Math.random() * h, r: big ? 1.4 + Math.random() * 0.8 : 0.4 + Math.random() * 0.9,
        base: 0.35 + Math.random() * 0.55, phase: Math.random() * Math.PI * 2, speed: (Math.PI * 2) / (3500 + Math.random() * 4500),
        tint: Math.random() < 0.15 ? '255,236,190' : Math.random() < 0.2 ? '200,216,255' : '255,255,255', big };
    });
  }

  function draw(t) {
    const w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const a = still.matches ? s.base : s.base * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed)));
      ctx.fillStyle = `rgba(${s.tint},${a.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      if (s.big) {
        // A soft cross glint on the few larger stars.
        ctx.strokeStyle = `rgba(${s.tint},${(a * 0.35).toFixed(3)})`; ctx.lineWidth = 0.6;
        ctx.beginPath(); ctx.moveTo(s.x - s.r * 3, s.y); ctx.lineTo(s.x + s.r * 3, s.y);
        ctx.moveTo(s.x, s.y - s.r * 3); ctx.lineTo(s.x, s.y + s.r * 3); ctx.stroke();
      }
    }
  }

  function loop(t) {
    if (!running) return;
    frame = requestAnimationFrame(loop);
    if (t - last < 66) return; // ~15fps is plenty for a slow twinkle
    last = t; draw(t);
  }

  function onResize() { if (running) { seed(); draw(performance.now()); } }

  window.boardStarfield = {
    start() {
      if (running) return;
      if (!canvas) {
        canvas = document.createElement('canvas'); canvas.className = 'starfield'; canvas.setAttribute('aria-hidden', 'true');
        ctx = canvas.getContext('2d');
      }
      document.body.prepend(canvas);
      running = true; seed(); draw(performance.now());
      window.addEventListener('resize', onResize);
      if (!still.matches) frame = requestAnimationFrame(loop);
    },
    stop() {
      if (!running) return;
      running = false; cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      canvas.remove();
    }
  };
})();
