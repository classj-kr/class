// Calm moving backgrounds for boards (space, ocean, forest, snow, sunset, petals).
// One fixed canvas behind the posts, ~15fps; frozen when the viewer's OS asks for less motion.
(() => {
  'use strict';
  let canvas = null, ctx = null, theme = null, items = [], frame = 0, last = 0, w = 0, h = 0;
  const still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const rand = (a, b) => a + Math.random() * (b - a);

  const THEMES = {
    space: {
      count: (W, H) => Math.min(260, Math.round(W * H / 7000)),
      make: () => {
        const big = Math.random() < 0.08;
        return { x: rand(0, w), y: rand(0, h), r: big ? rand(1.4, 2.2) : rand(0.4, 1.3), base: rand(0.35, 0.9), phase: rand(0, 6.3),
          speed: (Math.PI * 2) / rand(3500, 8000), tint: Math.random() < 0.15 ? '255,236,190' : Math.random() < 0.2 ? '200,216,255' : '255,255,255', big };
      },
      draw(s, t) {
        const a = s.base * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(s.phase + t * s.speed)));
        ctx.fillStyle = `rgba(${s.tint},${a.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        if (s.big) {
          ctx.strokeStyle = `rgba(${s.tint},${(a * 0.35).toFixed(3)})`; ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(s.x - s.r * 3, s.y); ctx.lineTo(s.x + s.r * 3, s.y);
          ctx.moveTo(s.x, s.y - s.r * 3); ctx.lineTo(s.x, s.y + s.r * 3); ctx.stroke();
        }
      }
    },
    ocean: {
      count: (W, H) => Math.min(70, Math.round(W * H / 26000)),
      make: (fresh) => ({ x: rand(0, w), y: fresh ? h + rand(10, 200) : rand(0, h), r: rand(2, 9), vy: rand(6, 18), wob: rand(0, 6.3), amp: rand(4, 14) }),
      step(b, dt) { b.y -= b.vy * dt; if (b.y < -20) Object.assign(b, this.make(true)); },
      draw(b, t) {
        const x = b.x + Math.sin(t * 0.0008 + b.wob) * b.amp;
        ctx.strokeStyle = 'rgba(190,235,255,.45)'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.35)';
        ctx.beginPath(); ctx.arc(x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.25, 0, Math.PI * 2); ctx.fill();
      },
      before(t) {
        // Slow light shafts from the surface.
        for (let i = 0; i < 4; i++) {
          const x = w * (0.15 + i * 0.25) + Math.sin(t * 0.0002 + i) * 40;
          const g = ctx.createLinearGradient(0, 0, 0, h * 0.8);
          g.addColorStop(0, 'rgba(160,220,255,.10)'); g.addColorStop(1, 'rgba(160,220,255,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 30, 0); ctx.lineTo(x + 30, 0); ctx.lineTo(x + 140, h * 0.8); ctx.lineTo(x - 40, h * 0.8); ctx.fill();
        }
      }
    },
    forest: {
      count: (W, H) => Math.min(60, Math.round(W * H / 30000)),
      make: () => ({ x: rand(0, w), y: rand(h * 0.15, h), vx: rand(-8, 8), vy: rand(-6, 6), phase: rand(0, 6.3), speed: rand(0.0008, 0.0018), turn: rand(0, 6.3) }),
      step(f, dt, t) {
        f.vx += Math.sin(t * 0.0005 + f.turn) * 0.3; f.vy += Math.cos(t * 0.0004 + f.turn) * 0.3;
        f.vx = Math.max(-10, Math.min(10, f.vx)); f.vy = Math.max(-8, Math.min(8, f.vy));
        f.x = (f.x + f.vx * dt + w) % w; f.y = Math.max(h * 0.1, Math.min(h, f.y + f.vy * dt));
      },
      draw(f, t) {
        const a = Math.max(0, Math.sin(t * f.speed + f.phase));
        if (a < 0.05) return;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 14);
        g.addColorStop(0, `rgba(230,255,140,${(a * 0.9).toFixed(3)})`); g.addColorStop(1, 'rgba(230,255,140,0)');
        ctx.fillStyle = g; ctx.fillRect(f.x - 14, f.y - 14, 28, 28);
        ctx.fillStyle = `rgba(250,255,210,${a.toFixed(3)})`; ctx.beginPath(); ctx.arc(f.x, f.y, 1.6, 0, Math.PI * 2); ctx.fill();
      },
      after() {
        // Tree line silhouette along the bottom.
        ctx.fillStyle = 'rgba(4,20,14,.85)';
        const step = 46;
        ctx.beginPath(); ctx.moveTo(0, h);
        for (let x = -step; x <= w + step; x += step) {
          const top = h - 70 - ((x * 7919) % 90 + 90) % 90;
          ctx.lineTo(x, h - 40); ctx.lineTo(x + step / 2, top); ctx.lineTo(x + step, h - 40);
        }
        ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
      }
    },
    snow: {
      count: (W, H) => Math.min(160, Math.round(W * H / 9000)),
      make: (fresh) => ({ x: rand(0, w), y: fresh ? rand(-60, -5) : rand(0, h), r: rand(1, 3.4), vy: rand(10, 28), drift: rand(0, 6.3), amp: rand(8, 26) }),
      step(s, dt) { s.y += s.vy * dt * (0.6 + s.r / 5); if (s.y > h + 10) Object.assign(s, this.make(true)); },
      draw(s, t) {
        const x = s.x + Math.sin(t * 0.0006 + s.drift) * s.amp;
        ctx.fillStyle = `rgba(255,255,255,${(0.45 + s.r / 7).toFixed(3)})`;
        ctx.beginPath(); ctx.arc(x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
    },
    sunset: {
      count: (W) => Math.max(5, Math.min(9, Math.round(W / 220))),
      make: (fresh) => ({ x: fresh ? -rand(200, 400) : rand(-100, w), y: rand(h * 0.05, h * 0.6), s: rand(0.6, 1.5), vx: rand(3, 8), seed: rand(0, 10) }),
      step(c, dt) { c.x += c.vx * dt; if (c.x > w + 260) Object.assign(c, this.make(true)); },
      before() {
        const g = ctx.createRadialGradient(w * 0.75, h * 0.78, 0, w * 0.75, h * 0.78, Math.max(w, h) * 0.45);
        g.addColorStop(0, 'rgba(255,214,140,.55)'); g.addColorStop(0.3, 'rgba(255,150,100,.18)'); g.addColorStop(1, 'rgba(255,150,100,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      },
      draw(c) {
        ctx.fillStyle = 'rgba(255,205,190,.16)';
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.ellipse(c.x + i * 34 * c.s, c.y + Math.sin(c.seed + i) * 8 * c.s, (46 + (i % 2) * 20) * c.s, 16 * c.s, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    petals: {
      count: (W, H) => Math.min(50, Math.round(W * H / 24000)),
      make: (fresh) => ({ x: fresh ? rand(-80, w * 0.7) : rand(0, w), y: fresh ? rand(-60, -10) : rand(0, h), vx: rand(8, 22), vy: rand(12, 26), rot: rand(0, 6.3), spin: rand(-0.8, 0.8), size: rand(5, 9), hue: rand(330, 355) }),
      step(p, dt) { p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.spin * dt; if (p.y > h + 20 || p.x > w + 20) Object.assign(p, this.make(true)); },
      draw(p, t) {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(t * 0.0015 + p.rot)));
        ctx.fillStyle = `hsla(${p.hue},85%,82%,.85)`;
        ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
  };

  function seed() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const spec = THEMES[theme];
    items = Array.from({ length: spec.count(w, h) }, () => spec.make(false));
  }
  function draw(t, dt) {
    const spec = THEMES[theme];
    ctx.clearRect(0, 0, w, h);
    spec.before?.(t);
    for (const item of items) { if (dt && spec.step) spec.step.call(spec, item, dt, t); spec.draw(item, t); }
    spec.after?.(t);
  }
  function loop(t) {
    if (!theme) return;
    frame = requestAnimationFrame(loop);
    if (t - last < 66) return;
    const dt = last ? Math.min(0.2, (t - last) / 1000) : 0;
    last = t; draw(t, dt);
  }
  function onResize() { if (theme) { seed(); draw(performance.now(), 0); } }

  window.boardBackdrop = {
    themes: Object.keys(THEMES),
    set(next) {
      const wanted = THEMES[next] ? next : null;
      if (wanted === theme) return;
      cancelAnimationFrame(frame); last = 0;
      theme = wanted;
      if (!theme) { canvas?.remove(); window.removeEventListener('resize', onResize); return; }
      if (!canvas) { canvas = document.createElement('canvas'); canvas.className = 'starfield'; canvas.setAttribute('aria-hidden', 'true'); ctx = canvas.getContext('2d'); }
      if (!canvas.isConnected) document.body.prepend(canvas);
      window.addEventListener('resize', onResize);
      seed(); draw(performance.now(), 0);
      if (!still.matches) frame = requestAnimationFrame(loop);
    }
  };
})();
