// 혼자 연습의 채점 장면. 「확인」을 누르면 쓴 글씨에 쓴 순서대로 색이 흘러 결과를 알려 주고,
// 다듬을 글자는 돋보기 안에서 어긋난 획이 제자리로 옮겨 가는 모습을 보여 준다. 순위전에서는 쓰지 않는다.
(function () {
  'use strict';
  const FIX = '#c9822b', // 다듬을 글자: 따뜻한 황토색
    INK = '#233c34',
    GOOD = '#23897b', // 잘 쓴 글자: 차분한 청록색
    SCORE = '#1f6f66',
    PARTY = ['#7fc8b8', '#a8d8ea', '#f2d48f', '#f3b8a6', '#b9dcae'],
    FAINT = '#d6dcd2',
    SAMPLES = 40;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
    ease = (t) => t * t * (3 - 2 * t),
    mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  // 손으로 쓴 숫자의 뼈대(가로 0~1, 세로 0~1).
  const DIGITS = {
    0: [[0.55, 0.02], [0.2, 0.15], [0.08, 0.5], [0.2, 0.86], [0.5, 1], [0.8, 0.85], [0.92, 0.48], [0.8, 0.13], [0.5, 0], [0.4, 0.04]],
    1: [[0.22, 0.22], [0.52, 0], [0.5, 0.5], [0.5, 1]],
    2: [[0.1, 0.26], [0.26, 0.05], [0.56, 0], [0.84, 0.15], [0.82, 0.4], [0.52, 0.68], [0.1, 0.99], [0.5, 0.96], [0.95, 0.97]],
    3: [[0.12, 0.12], [0.5, 0], [0.84, 0.12], [0.78, 0.34], [0.44, 0.47], [0.82, 0.58], [0.9, 0.8], [0.6, 0.98], [0.26, 0.98], [0.08, 0.85]],
    4: [[0.68, 1], [0.68, 0.5], [0.68, 0], [0.36, 0.36], [0.08, 0.68], [0.5, 0.68], [0.98, 0.67]],
    5: [[0.84, 0.03], [0.5, 0.03], [0.22, 0.04], [0.16, 0.44], [0.5, 0.37], [0.84, 0.5], [0.9, 0.75], [0.65, 0.97], [0.3, 0.98], [0.08, 0.85]],
    6: [[0.75, 0.03], [0.36, 0.25], [0.12, 0.6], [0.2, 0.9], [0.5, 1], [0.82, 0.86], [0.82, 0.6], [0.5, 0.47], [0.18, 0.62]],
    7: [[0.08, 0.05], [0.5, 0.04], [0.92, 0.03], [0.66, 0.5], [0.4, 1]],
    8: [[0.82, 0.2], [0.5, 0], [0.2, 0.18], [0.3, 0.38], [0.72, 0.58], [0.85, 0.8], [0.5, 1], [0.15, 0.8], [0.28, 0.58], [0.7, 0.38], [0.82, 0.2]],
    9: [[0.85, 0.3], [0.55, 0.48], [0.2, 0.35], [0.2, 0.12], [0.5, 0], [0.82, 0.12], [0.85, 0.35], [0.72, 0.75], [0.4, 1]],
  };
  function random(n) {
    let s = ((n + 1) * 9301 + 49297) % 233280;
    return () => (s = (s * 9301 + 49297) % 233280) / 233280;
  }
  // 점 사이를 부드럽게 잇는다.
  function smooth(points, steps = 6) {
    if (points.length < 3) return points;
    const out = [];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i - 1] || points[i],
        b = points[i],
        c = points[i + 1],
        d = points[i + 2] || c;
      for (let k = 0; k < steps; k++) {
        const t = k / steps,
          u = t * t,
          v = u * t;
        out.push([0, 1].map((n) => 0.5 * (2 * b[n] + (c[n] - a[n]) * t + (2 * a[n] - 5 * b[n] + 4 * c[n] - d[n]) * u + (3 * b[n] - a[n] - 3 * c[n] + d[n]) * v)));
      }
    }
    out.push(points[points.length - 1]);
    return out;
  }
  // 차례로 이어지는 장면을 돌린다. stop(true)면 남은 장면을 소리 없이 끝 상태로 맞춘다.
  function player(steps, frame, done) {
    let k = 0,
      from = null,
      raf = 0,
      over = false;
    const enter = (s, quiet) => {
      if (!s.entered) {
        s.entered = true;
        s.start?.(quiet);
      }
    };
    function tick(now) {
      if (over) return;
      if (from === null) from = now;
      while (k < steps.length) {
        const s = steps[k];
        enter(s, false);
        const p = s.dur ? clamp((now - from) / s.dur, 0, 1) : 1;
        s.run?.(p);
        if (p < 1) break;
        s.end?.(false);
        from += s.dur || 0;
        k++;
      }
      frame();
      if (k < steps.length) raf = requestAnimationFrame(tick);
      else {
        over = true;
        done?.(true);
      }
    }
    raf = requestAnimationFrame(tick);
    return {
      stop(complete) {
        if (over) return;
        over = true;
        cancelAnimationFrame(raf);
        if (!complete) return;
        for (; k < steps.length; k++) {
          enter(steps[k], true);
          steps[k].run?.(1);
          steps[k].end?.(true);
        }
        frame();
        done?.(false);
      },
    };
  }
  // 사이트 효과음의 크기·끄기를 그대로 따른다.
  function createSound() {
    const bus = () => window.ClassGameSfx?.getAudioBus?.() || null;
    let buffer = null,
      pen = null,
      penStop = 0;
    function noiseBuffer(a) {
      if (!buffer || buffer.sampleRate !== a.sampleRate) {
        buffer = a.createBuffer(1, a.sampleRate * 1.5, a.sampleRate);
        const d = buffer.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      return buffer;
    }
    function tone(freq, length, type = 'sine', volume = 0.06, delay = 0, slideTo = 0) {
      const b = bus();
      if (!b) return;
      const a = b.context,
        t = a.currentTime + delay,
        o = a.createOscillator(),
        v = a.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + length);
      v.gain.setValueAtTime(0.0001, t);
      v.gain.exponentialRampToValueAtTime(volume, t + 0.008);
      v.gain.exponentialRampToValueAtTime(0.0001, t + length);
      o.connect(v).connect(b.output);
      o.start(t);
      o.stop(t + length + 0.05);
    }
    // 종이를 긁는 소리. 사각사각 끊어지도록 크기를 몇 번 흔든다.
    function scratch(length, volume = 0.055, freq = 3400) {
      const b = bus();
      if (!b) return;
      const a = b.context,
        t = a.currentTime,
        src = a.createBufferSource(),
        band = a.createBiquadFilter(),
        v = a.createGain(),
        beats = Math.max(2, Math.round(length / 0.06));
      src.buffer = noiseBuffer(a);
      src.loop = true;
      band.type = 'bandpass';
      band.frequency.value = freq;
      band.Q.value = 0.7;
      v.gain.setValueAtTime(0.0001, t);
      for (let i = 0; i < beats; i++) {
        const at = t + (length * i) / beats;
        v.gain.linearRampToValueAtTime(volume * (0.65 + Math.random() * 0.35), at + 0.012);
        v.gain.linearRampToValueAtTime(volume * 0.22, at + (length / beats) * 0.9);
      }
      v.gain.linearRampToValueAtTime(0.0001, t + length + 0.02);
      src.connect(band).connect(v).connect(b.output);
      src.start(t, Math.random());
      src.stop(t + length + 0.05);
    }
    function penStopNow() {
      clearTimeout(penStop);
      if (!pen) return;
      try {
        pen.src.stop();
      } catch {}
      pen = null;
    }
    return {
      tone,
      scratch,
      penMove(speed) {
        const b = bus();
        if (!b) return penStopNow();
        const a = b.context;
        if (!pen) {
          const src = a.createBufferSource(),
            band = a.createBiquadFilter(),
            v = a.createGain();
          src.buffer = noiseBuffer(a);
          src.loop = true;
          band.type = 'bandpass';
          band.Q.value = 0.8;
          band.frequency.value = 3600;
          v.gain.value = 0;
          src.connect(band).connect(v).connect(b.output);
          src.start();
          pen = { src, band, v };
        }
        clearTimeout(penStop);
        pen.band.frequency.setTargetAtTime(3000 + Math.random() * 1500, a.currentTime, 0.02);
        pen.v.gain.setTargetAtTime(clamp(speed / 0.28, 0, 1) * 0.05, a.currentTime, 0.025);
      },
      penUp() {
        if (!pen) return;
        const a = pen.src.context;
        pen.v.gain.setTargetAtTime(0, a.currentTime, 0.03);
        clearTimeout(penStop);
        penStop = setTimeout(penStopNow, 500);
      },
      letter(i) {
        tone([523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760][i % 10], 0.13, 'triangle', 0.055);
      },
      miss: () => tone(196, 0.1, 'sine', 0.05),
      // 글자에 색이 번질 때: 잘 쓴 글자는 차례로 올라가는 음, 다듬을 글자는 낮고 부드러운 음.
      flow(n, kind) {
        if (kind === 'fix') tone(262, 0.16, 'sine', 0.04);
        else {
          tone([523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760][n % 10], 0.2, 'sine', 0.05);
          if (kind === 'great') tone(2093, 0.14, 'sine', 0.018, 0.04);
        }
      },
      total(score) {
        const notes = score >= 60 ? [659, 988] : [523];
        notes.forEach((n, i) => tone(n, 0.24, 'sine', 0.05, i * 0.09));
      },
      cheer() {
        [784, 988, 1175, 1568].forEach((n, i) => tone(n, 0.42, 'sine', 0.05, i * 0.07));
      },
      fix: () => scratch(0.5, 0.04, 2600),
      good: () => tone(1175, 0.08, 'triangle', 0.035),
    };
  }

  function create(app) {
    const { C, Reference } = app,
      panel = document.querySelector('.practice-panel'),
      slip = document.getElementById('feedback'),
      sound = createSound();
    const el = (tag, name) => {
      const n = document.createElement(tag);
      n.className = name;
      return n;
    };
    const layer = el('canvas', 'review-layer'),
      g = layer.getContext('2d');
    layer.setAttribute('aria-hidden', 'true');
    panel.append(layer);
    let items = new Map(),
      score = null, // { value, paths, h }
      run = null,
      rushing = false, // 건너뛸 때는 소리·움직임 없이 끝 상태로 간다
      autoLens = 0,
      painted = false,
      bits = [],
      counts = { good: 0, fix: 0 };
    const motionOff = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const tallyOf = (kind) => (kind === 'fix' ? 'fix' : 'good');
    const part = (points, p) => {
      if (p >= 1) return points;
      const at = p * (points.length - 1),
        n = Math.floor(at);
      return [...points.slice(0, n + 1), mix(points[n], points[n + 1] || points[n], at - n)];
    };

    // ── 글씨에 색이 흐른다: 쓴 획 차례대로 물든다 ──
    function tint(i, context, strokes) {
      const it = items.get(i);
      if (!it?.p || !strokes.length) return;
      const color = it.kind === 'fix' ? FIX : GOOD;
      strokes.forEach((s, k) => {
        const local = clamp(it.p * strokes.length - k, 0, 1);
        if (local > 0) app.path(context, part(s.points, local), color, (s.width || 2.5) + 0.12);
      });
    }
    function letterBox(i, base) {
      const cell = app.cell(i);
      if (!cell) return null;
      const r = cell.write.getBoundingClientRect(),
        u = r.height / 100;
      return { x: r.left - base.left + r.width / 2, y: r.top - base.top + 50 * u, u };
    }
    function inkLine(points, width, color) {
      if (points.length < 2) return;
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.strokeStyle = color;
      g.lineWidth = width;
      g.beginPath();
      points.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
      g.stroke();
    }
    function drawBit(b, now) {
      const age = now - b.born,
        t = age / b.life;
      if (t < 0 || t >= 1) return;
      g.save();
      g.fillStyle = b.color;
      if (b.spark) {
        const s = b.size * Math.sin(t * Math.PI);
        g.translate(b.x, b.y);
        g.rotate(t * 1.1);
        g.beginPath();
        for (let k = 0; k < 8; k++) {
          const r = k % 2 ? s * 0.28 : s,
            a = (k / 8) * Math.PI * 2;
          g[k ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r);
        }
        g.closePath();
        g.fill();
      } else {
        const sec = age / 1000;
        g.globalAlpha = 1 - t * t;
        g.translate(b.x + b.vx * sec, b.y + b.vy * sec + 300 * sec * sec);
        g.rotate(b.spin * sec);
        g.fillRect(-b.size / 2, -b.size / 3, b.size, (b.size * 2) / 3);
      }
      g.restore();
    }
    const scoreBox = (base) => {
      const r = slip.querySelector('.review-score')?.getBoundingClientRect();
      return r && { x: r.left - base.left + 2, y: r.top - base.top + 6 };
    };
    const scorePoints = (path, box) => path.points.map(([x, y]) => [box.x + x * score.h, box.y + y * score.h]);
    function paint() {
      const now = performance.now();
      bits = bits.filter((b) => now - b.born < b.life);
      const empty = !score && !bits.length;
      if (empty && !painted) return;
      const base = panel.getBoundingClientRect(),
        ratio = Math.min(2, window.devicePixelRatio || 1),
        w = Math.ceil(base.width * ratio),
        h = Math.ceil(base.height * ratio);
      if (layer.width !== w || layer.height !== h) {
        layer.width = w;
        layer.height = h;
      }
      g.setTransform(ratio, 0, 0, ratio, 0, 0);
      g.clearRect(0, 0, base.width, base.height);
      painted = !empty;
      const box = score && scoreBox(base);
      if (box) score.paths.forEach((path) => path.p && inkLine(part(scorePoints(path, box), path.p), 3, SCORE));
      bits.forEach((b) => drawBit(b, now));
    }
    new ResizeObserver(() => paint()).observe(panel);

    // ── 점수 줄 ──
    function buildScore(value) {
      const paths = [];
      let x = 0;
      const r = random(value);
      for (const ch of String(value)) {
        const dx = x;
        paths.push({ p: 0, points: smooth(DIGITS[ch].map(([a, b]) => [dx + (a + (1 - b) * 0.09) * 0.62, b + (r() - 0.5) * 0.02])) });
        x += ch === '1' ? 0.46 : 0.68;
      }
      const model = C.model('점');
      if (model) {
        const all = model.flat(),
          left = Math.min(...all.map((p) => p[0])),
          top = Math.min(...all.map((p) => p[1])),
          size = Math.max(...all.map((p) => p[1])) - top,
          k = 0.6 / size,
          dx = x + 0.04;
        model.forEach((s) => paths.push({ p: 0, points: s.map((p) => [dx + (p[0] - left) * k, 0.4 + (p[1] - top) * k]) }));
        x = dx + (Math.max(...all.map((p) => p[0])) - left) * k;
      }
      return { value, paths, width: x + 0.14 };
    }
    function showSlip() {
      const tally = (kind, name) => `<span class="tally-${kind}"><i></i>${name} <b data-count="${kind}">${counts[kind]}</b></span>`;
      slip.className = 'feedback review-slip';
      slip.innerHTML =
        '<span class="review-score"><span class="sr-only" data-result></span></span>' +
        `<span class="review-tally" aria-hidden="true">${tally('good', '잘 쓴 글자')}${tally('fix', '다듬을 글자')}</span>`;
      slip.hidden = false;
      const h = 44,
        spot = slip.querySelector('.review-score');
      score.h = h;
      spot.style.width = Math.ceil(score.width * h) + 'px';
    }
    function hideSlip() {
      slip.className = 'feedback';
      slip.replaceChildren();
      slip.hidden = true;
    }
    const setCount = (kind) => {
      const n = slip.querySelector(`[data-count="${kind}"]`);
      if (n) n.textContent = counts[kind];
    };
    function resultText() {
      const missing = app.letters().length - items.size;
      return `${score.value}점. 잘 쓴 글자 ${counts.good}개, 다듬을 글자 ${counts.fix}개${missing ? `, 안 쓴 글자 ${missing}개` : ''}.`;
    }

    // ── 채점 ──
    const gradeOf = (r) => (!r.order || r.score < 60 ? 'fix' : r.score >= 90 ? 'great' : 'good');
    function hop(i, delay = 0) {
      app.cell(i)?.write.animate([{ transform: 'translateY(0) scale(1)' }, { transform: 'translateY(-7%) scale(1.14)', offset: 0.4 }, { transform: 'translateY(0) scale(1)' }], { duration: 300, delay, easing: 'ease-out' });
    }
    function land(i, it) {
      if (it.kind === 'fix') {
        app.cell(i)?.write.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-2.5%)' }, { transform: 'translateX(2%)' }, { transform: 'translateX(0)' }], { duration: 260 });
        return;
      }
      hop(i);
      if (it.kind !== 'great') return;
      const box = letterBox(i, panel.getBoundingClientRect()),
        now = performance.now();
      if (box)
        [[17, -19, 7], [-20, -9, 5], [21, 12, 4]].forEach(([x, y, size], k) =>
          bits.push({ spark: true, x: box.x + x * box.u, y: box.y + y * box.u, size: size * clamp(box.u, 0.8, 1.3), color: '#e7b94f', born: now + k * 70, life: 520 }),
        );
    }
    function confetti() {
      const base = panel.getBoundingClientRect(),
        sheet = app.cell(0)?.pair.closest('.sheet')?.getBoundingClientRect(),
        now = performance.now();
      if (!sheet) return;
      for (let k = 0; k < 54; k++)
        bits.push({
          x: sheet.left - base.left + Math.random() * sheet.width,
          y: sheet.bottom - base.top - Math.random() * 30,
          vx: (Math.random() - 0.5) * 170,
          vy: -130 - Math.random() * 230,
          spin: (Math.random() - 0.5) * 12,
          size: 6 + Math.random() * 5,
          color: PARTY[k % PARTY.length],
          born: now + Math.random() * 180,
          life: 1050 + Math.random() * 300,
        });
    }
    function start({ results, score: value, fresh }) {
      finish();
      closeLens();
      clearTimeout(autoLens);
      counts = { good: 0, fix: 0 };
      const next = new Map(),
        queue = [];
      results.forEach((r, i) => {
        if (!r) return;
        const kind = gradeOf(r);
        next.set(i, { kind, p: fresh[i] ? 0 : 1 });
        if (fresh[i]) queue.push(i);
        else counts[tallyOf(kind)]++;
      });
      const same = !queue.length && score?.value === value;
      items = next;
      results.forEach((_, i) => app.redraw(i));
      if (same) return;
      const all = [...next.values()],
        cheer = all.length === results.length && value >= 85 && !all.some((it) => it.kind === 'fix');
      score = { ...buildScore(value), h: 44 };
      showSlip();
      const FLOW = 430,
        gap = clamp(2200 / Math.max(1, queue.length), 35, 130),
        total = queue.length ? gap * (queue.length - 1) + FLOW : 0,
        begun = new Set(),
        ended = new Set(),
        steps = [];
      // 왼쪽 글자부터 물결처럼 겹쳐 가며 물든다.
      const flowTo = (time) =>
        queue.forEach((i, n) => {
          const it = next.get(i),
            local = clamp((time - n * gap) / FLOW, 0, 1);
          if (local > 0 && !begun.has(i)) {
            begun.add(i);
            if (!rushing) {
              sound.flow(n, it.kind);
              const r = app.cell(i)?.pair.getBoundingClientRect();
              if (r && (r.top < 0 || r.bottom > innerHeight)) app.cell(i).pair.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
          }
          if (local !== it.p) {
            it.p = local;
            app.redraw(i);
          }
          if (local >= 1 && !ended.has(i)) {
            ended.add(i);
            counts[tallyOf(it.kind)]++;
            setCount(tallyOf(it.kind));
            if (!rushing) land(i, it);
          }
        });
      if (total) steps.push({ dur: total, run: (p) => flowTo(p * total) });
      steps.push({ dur: 120, start: () => rushing || slip.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) });
      score.paths.forEach((path) => {
        const dur = path.points.length > 8 ? 170 : 90;
        steps.push({
          dur,
          start: () => rushing || sound.scratch(dur / 1000, 0.03),
          run(p) {
            path.p = p;
          },
        });
      });
      steps.push({ dur: 0, end: () => rushing || sound.total(value) });
      steps.push(
        cheer
          ? {
              dur: 1250,
              start() {
                if (rushing) return;
                sound.cheer();
                confetti();
                [...next.keys()].forEach((i, n) => hop(i, n * 28));
              },
            }
          : { dur: 520 },
      );
      const done = (natural) => {
        run = null;
        bits = [];
        paint();
        const result = slip.querySelector('[data-result]');
        if (result) result.textContent = resultText();
        if (!natural) return;
        const first = [...items].find(([, it]) => it.kind === 'fix');
        if (first) autoLens = setTimeout(() => openLens(first[0]), 300);
      };
      run = player(steps, paint, done);
      if (motionOff() || document.hidden) finish();
    }
    function finish() {
      rushing = true;
      run?.stop(true);
      rushing = false;
      run = null;
    }
    // 고친 글자가 생기면 그 글자의 색과 점수를 내린다(점수가 지금 글씨와 달라지므로).
    function sync() {
      const marks = app.marks();
      let dropped = false;
      items.forEach((_, i) => {
        if (!marks[i]) {
          items.delete(i);
          dropped = true;
        }
      });
      if (dropped) {
        run?.stop(false);
        run = null;
        clearTimeout(autoLens);
        closeLens();
        score = null;
        bits = [];
        hideSlip();
      }
      paint();
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) finish();
    });

    // ── 돋보기: 어긋난 획이 제자리로 간다 ──
    const lens = el('div', 'review-lens'),
      glass = el('div', 'lens-glass'),
      lensCanvas = document.createElement('canvas'),
      note = el('p', 'lens-note'),
      redo = el('button', 'lens-redo');
    const c = lensCanvas.getContext('2d');
    let lensRun = null,
      lensIndex = -1;
    lens.hidden = true;
    lens.dataset.sfxFeedback = 'none';
    note.setAttribute('role', 'status');
    redo.type = 'button';
    redo.textContent = '다시 쓰기';
    glass.append(lensCanvas);
    lens.append(glass, note, redo);
    document.body.append(lens);
    redo.onclick = () => {
      const i = lensIndex;
      closeLens();
      app.rewrite(i);
    };
    glass.addEventListener('click', () => lensRun?.stop(true));
    function closeLens() {
      lensRun?.stop(false);
      lensRun = null;
      lensIndex = -1;
      lens.hidden = true;
    }
    document.addEventListener('pointerdown', (e) => {
      if (!lens.hidden && !lens.contains(e.target)) closeLens();
    }, true);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLens();
    });
    window.addEventListener('resize', closeLens);

    function placeLens(i, size) {
      const r = app.cell(i).write.getBoundingClientRect(),
        x = r.left + r.width / 2,
        y = r.top + r.height / 2,
        gap = r.height * 0.42 + 10,
        height = size + 104,
        below = y + gap + height <= innerHeight - 8,
        top = below ? y + gap : Math.max(8, y - gap - height);
      let left = clamp(x - size / 2, 8, Math.max(8, innerWidth - size - 8));
      // 방금 쓴 점수와 표시 수를 가리지 않게 옆으로 비킨다(자리가 있을 때).
      const tally = slip.querySelector('.review-tally')?.getBoundingClientRect();
      if (tally && top < tally.bottom && top + size > tally.top && left < tally.right + 12 && tally.right + 12 + size <= innerWidth - 8) left = tally.right + 12;
      lens.style.left = left + 'px';
      lens.style.top = top + 'px';
      lens.style.width = size + 'px';
      lens.style.transformOrigin = `${x - left}px ${below ? 0 : height}px`;
    }
    function stepWord(k, s, d) {
      const n = `${k + 1}번째 획`;
      if (s.fix === 'missing') return `${n}이 빠졌어요`;
      if (s.fix === 'reversed') return `${n}은 반대쪽에서 시작해요`;
      if (s.fix === 'order') return `${k + 1}번째로 쓴 획은 ${s.belongs + 1}번째에 써요`;
      if (s.fix === 'short') return `${n}을 더 길게 그어요`;
      if (s.fix === 'long') return `${n}을 더 짧게 그어요`;
      const [x, y] = s.move,
        small = Math.hypot(x, y) < d.glyph * 0.05;
      if (small) return `${n}을 본보기에 맞춰요`;
      return `${n}을 조금 ${Math.abs(x) > Math.abs(y) ? (x > 0 ? '오른쪽으로' : '왼쪽으로') : y > 0 ? '아래로' : '위로'} 옮겨요`;
    }
    function wholeWord(d) {
      if (d.size === 'small') return '글자를 조금 더 크게 써요';
      if (d.size === 'big') return '글자를 조금 더 작게 써요';
      if (!d.moved) return '';
      const [x, y] = d.shift;
      return `글자를 조금 더 ${Math.abs(x) > Math.abs(y) ? (x > 0 ? '오른쪽' : '왼쪽') : y > 0 ? '아래' : '위'}에 써요`;
    }
    function openLens(i) {
      closeLens();
      const char = app.letters()[i],
        written = app.strokesAt(i);
      if (!written.length || !app.cell(i)) return;
      const d = C.review(char, app.modelStrokes(written));
      if (!d) return;
      const size = Math.round(clamp(Math.min(innerWidth * 0.62, innerHeight * 0.44), 190, 320)),
        ratio = Math.min(2, window.devicePixelRatio || 1),
        zoom = (size * 0.6) / app.glyphHeight();
      lensIndex = i;
      lensCanvas.width = lensCanvas.height = size * ratio;
      placeLens(i, size);
      note.textContent = '';
      redo.hidden = true;
      lens.hidden = false;
      const shown = (p) => C.sample(p, SAMPLES).map((q) => app.toShown(q)),
        target = d.expected.map(shown),
        aligned = d.aligned.map(shown),
        lines = written.map((s) => ({ points: C.sample(s.points, SAMPLES), color: INK, alpha: 1, width: s.width || 2.5 }));
      target.slice(lines.length).forEach(() => lines.push({ points: [], color: FIX, alpha: 1, width: written[0].width || 2.5 }));
      let badge = null,
        dot = null;
      const say = [];
      // 어긋난 곳이 하나도 안 잡히면 가장 멀어진 획을 짚어 준다.
      const whole = wholeWord(d),
        strokes = d.strokes.map((s) => ({ ...s, fix: s.status === 'ok' ? null : s.status }));
      if (!whole && !d.extra && !strokes.some((s) => s.fix)) {
        const s = strokes[d.weakest];
        s.fix = s.ratio < 0.8 ? 'short' : s.ratio > 1.25 ? 'long' : 'off';
      }
      function frame() {
        c.setTransform(ratio, 0, 0, ratio, 0, 0);
        c.clearRect(0, 0, size, size);
        c.setTransform(ratio * zoom, 0, 0, ratio * zoom, ratio * (size / 2 - 50 * zoom), ratio * (size / 2 - 50 * zoom));
        app.reference(c, char, FAINT);
        lines.forEach((l) => {
          c.globalAlpha = l.alpha;
          app.path(c, l.points, l.color, l.width);
          c.globalAlpha = 1;
        });
        if (dot) {
          c.fillStyle = FIX;
          c.beginPath();
          c.arc(dot[0], dot[1], 6 / zoom, 0, Math.PI * 2);
          c.fill();
        }
        if (badge) {
          const r = 11 / zoom;
          c.fillStyle = badge.color;
          c.beginPath();
          c.arc(badge.at[0], badge.at[1], r, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = '#fff';
          c.font = `700 ${14 / zoom}px 'Malgun Gothic', sans-serif`;
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText(String(badge.n), badge.at[0], badge.at[1] + 0.5 / zoom);
        }
      }
      const badgeAt = (k) => {
        const s = target[k],
          a = s[0],
          b = s[Math.min(6, s.length - 1)],
          len = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1,
          far = 17 / zoom;
        return [a[0] + ((a[0] - b[0]) / len) * far, a[1] + ((a[1] - b[1]) / len) * far];
      };
      const speak = (text) => {
        note.textContent = text;
        if (text && !say.includes(text)) say.push(text);
      };
      const morph = (k, from, to, dur) => ({
        dur,
        run: (p) => {
          const t = ease(p);
          lines[k].points = to.map((q, n) => mix(from[n], q, t));
        },
      });
      const steps = [{ dur: 300 }];
      const froms = lines.map((l) => l.points);
      const parallel = (dur, quiet) => ({
        dur,
        start: (silent) => {
          if (!quiet && !silent) {
            speak(whole);
            sound.fix();
          }
        },
        run: (p) => {
          const t = ease(p);
          aligned.forEach((to, k) => (lines[k].points = to.map((q, n) => mix(froms[k][n], q, t))));
        },
      });
      steps.push(parallel(whole ? 680 : 200, !whole));
      if (whole) {
        steps[steps.length - 1].end = () => say.includes(whole) || say.push(whole);
        steps.push({ dur: 260 });
      }
      strokes.forEach((s, k) => {
        const line = lines[k],
          to = target[k];
        if (!s.fix) {
          steps.push({
            dur: 130,
            start(quiet) {
              line.color = GOOD;
              badge = { at: badgeAt(k), n: k + 1, color: GOOD };
              if (!quiet) sound.good();
            },
          });
          return;
        }
        const words = stepWord(k, s, d);
        steps.push({
          dur: s.fix === 'missing' ? 500 : 640,
          start() {
            speak(words);
            badge = { at: badgeAt(k), n: k + 1, color: FIX };
            line.color = FIX;
          },
        });
        if (s.fix === 'missing') {
          steps.push({
            dur: 560,
            start: (quiet) => quiet || sound.fix(),
            run(p) {
              line.points = part(to, p);
              dot = line.points[line.points.length - 1];
            },
          });
        } else {
          const from = aligned[k];
          steps.push({ ...morph(k, from, to, 640), start: (quiet) => quiet || sound.fix() });
          steps.push({
            dur: 380,
            run(p) {
              dot = part(to, p).at(-1);
            },
          });
        }
        steps.push({
          dur: 120,
          start() {
            dot = null;
            line.points = to;
            line.color = GOOD;
            badge = { at: badgeAt(k), n: k + 1, color: GOOD };
          },
        });
      });
      if (d.extra) {
        const words = `획을 ${d.extra}개 더 그었어요`;
        steps.push({
          dur: 620,
          start() {
            speak(words);
            badge = null;
            lines.slice(target.length).forEach((l) => (l.color = FIX));
          },
          run(p) {
            lines.slice(target.length).forEach((l) => (l.alpha = p < 0.5 ? 1 : 2 - p * 2));
          },
        });
      }
      const done = () => {
        lensRun = null;
        badge = dot = null;
        frame();
        note.textContent = say.slice(0, 2).join(' · ');
        redo.hidden = false;
      };
      if (motionOff()) {
        lensRun = player(steps, frame, done);
        lensRun.stop(true);
        return;
      }
      lens.animate(
        [
          { transform: 'scale(0.2)', opacity: 0 },
          { transform: 'scale(1.04)', opacity: 1, offset: 0.7 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: 240, easing: 'ease-out' },
      );
      frame();
      lensRun = player(steps, frame, done);
    }

    return {
      start,
      sync,
      tint,
      running: () => Boolean(run),
      showing: () => !slip.hidden && slip.classList.contains('review-slip'),
      finish,
      // 다시 쓰기 시작하면 연출을 끝 상태로 건너뛴다.
      interrupt() {
        clearTimeout(autoLens);
        finish();
      },
      tapped(i) {
        if (!run && items.get(i)?.kind === 'fix') openLens(i);
      },
      letterDone(i, right) {
        const cell = app.cell(i);
        if (!cell) return;
        if (right) sound.letter(i);
        else sound.miss();
        if (!right || motionOff()) return;
        cell.write.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.16)', offset: 0.35 }, { transform: 'scale(1)' }], { duration: 240, easing: 'ease-out' });
        cell.pair.classList.add('inked-ring');
        setTimeout(() => cell.pair.classList.remove('inked-ring'), 620);
      },
      penMove: sound.penMove,
      penUp: sound.penUp,
    };
  }
  window.HandwritingReview = { create };
})();
