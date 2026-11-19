// 혼자 연습의 채점 장면. 「확인」을 누르면 빨간 색연필이 글자마다 동그라미를 치고 점수를 쓰고,
// 세모 글자는 돋보기 안에서 어긋난 획이 제자리로 옮겨 가는 모습을 보여 준다. 순위전에서는 쓰지 않는다.
(function () {
  'use strict';
  const RED = '#d2302a',
    INK = '#233c34',
    GOOD = '#2b8a55',
    FAINT = '#d6dcd2',
    SAMPLES = 40;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
    ease = (t) => t * t * (3 - 2 * t),
    mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const PENCIL =
    '<svg viewBox="0 0 120 22" width="120" height="22" aria-hidden="true">' +
    '<path d="M0 11 20 3v16z" fill="#ecca9d"/><path d="M0 11 8 8v6z" fill="#d2302a"/>' +
    '<path d="M20 3h94v16H20z" fill="#d2302a"/><path d="M20 3h94v5H20z" fill="#e4574f"/><path d="M20 14h94v5H20z" fill="#ad231e"/>' +
    '<path d="M114 3h6v16h-6z" fill="#f4efe4"/></svg>';
  const STAMP =
    '<svg viewBox="0 0 100 100" aria-hidden="true"><defs><filter id="reviewInk" x="0" y="0" width="100%" height="100%">' +
    '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4"/>' +
    '<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.25"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>' +
    '<g filter="url(#reviewInk)" fill="none" stroke="#c9281f"><circle cx="50" cy="50" r="45" stroke-width="4.5"/><circle cx="50" cy="50" r="38.5" stroke-width="1.5"/>' +
    '<g fill="#c9281f" stroke="none" text-anchor="middle" font-family="Malgun Gothic, Apple SD Gothic Neo, sans-serif" font-weight="800">' +
    '<text x="50" y="39" font-size="19">참</text><text x="50" y="64" font-size="19.5">잘했어요</text></g></g></svg>';
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
  // 반지름 1로 그린 표시. 선생님 손처럼 조금씩 삐뚤고, 글자마다 모양이 다르다.
  function markPath(kind, seed) {
    const r = random(seed),
      phase = r() * 6,
      wobble = 0.035 + r() * 0.03,
      out = [];
    if (kind === 'tri') {
      const corners = [[0.02, -1.04], [-0.94, 0.74], [0.96, 0.7], [0.08, -1.12]].map(([x, y]) => [x + (r() - 0.5) * 0.08, y + (r() - 0.5) * 0.08]);
      for (let c = 0; c < 3; c++) {
        const lean = (r() - 0.5) * 0.1; // 변마다 한쪽으로만 살짝 휜다
        for (let k = 0; k < 11; k++) {
          const t = k / 11,
            bow = Math.sin(t * Math.PI) * lean,
            p = mix(corners[c], corners[c + 1], t);
          out.push([p[0] + bow, p[1] - bow]);
        }
      }
      out.push(corners[3]);
      return out;
    }
    const turns = kind === 'double' ? 2.08 : 1.1,
      n = Math.round(turns * 34);
    for (let k = 0; k <= n; k++) {
      const t = (k / n) * turns,
        angle = -1.9 - t * Math.PI * 2,
        inner = kind === 'double' ? 0.15 * ease(clamp(t - 0.9, 0, 1)) : 0,
        radius = 1 + wobble * Math.sin(angle * 2 + phase) + 0.04 * (t / turns - 0.5) - inner;
      out.push([Math.cos(angle) * radius, Math.sin(angle) * radius * 0.97]);
    }
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
      mark(kind) {
        if (kind === 'double') {
          tone(1568, 0.14, 'triangle', 0.05);
          tone(2093, 0.16, 'triangle', 0.04, 0.05);
        } else if (kind === 'circle') tone(1319, 0.1, 'triangle', 0.04);
        else tone(294, 0.09, 'triangle', 0.04);
      },
      total(score) {
        const notes = score >= 85 ? [784, 988, 1175, 1568] : score >= 60 ? [784, 988] : [523];
        notes.forEach((n, i) => tone(n, 0.2, 'triangle', 0.06, i * 0.09));
      },
      stamp() {
        tone(150, 0.2, 'sine', 0.3, 0, 60);
        scratch(0.05, 0.12, 900);
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
      pencil = el('div', 'review-pencil'),
      g = layer.getContext('2d');
    layer.setAttribute('aria-hidden', 'true');
    pencil.innerHTML = PENCIL;
    pencil.hidden = true;
    panel.append(layer, pencil);
    let items = new Map(),
      score = null, // { value, paths, h }
      run = null,
      autoLens = 0,
      painted = false,
      tip = [0, 0],
      counts = { double: 0, circle: 0, tri: 0 };
    const motionOff = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    // ── 연습장 위에 그리기 ──
    function letterBox(i, base) {
      const cell = app.cell(i);
      if (!cell) return null;
      const r = cell.write.getBoundingClientRect(),
        u = r.height / 100,
        char = app.letters()[i];
      let cx = 50,
        cy = 50,
        radius = app.glyphHeight() * 0.54;
      if (Reference.mark(char)) {
        // 문장 부호는 글자 가운데가 아니라 찍는 자리에 작게 표시한다.
        const all = app.shownModel(char).flat();
        cx = all.reduce((n, p) => n + p[0], 0) / all.length;
        cy = all.reduce((n, p) => n + p[1], 0) / all.length;
        radius = 9;
      }
      return { x: r.left - base.left + r.width / 2 + (cx - 50) * u, y: r.top - base.top + cy * u, radius: radius * u, u };
    }
    const part = (points, p) => {
      if (p >= 1) return points;
      const at = p * (points.length - 1),
        n = Math.floor(at);
      return [...points.slice(0, n + 1), mix(points[n], points[n + 1] || points[n], at - n)];
    };
    function crayon(points, width) {
      if (points.length < 2) return;
      const trace = (shift) => {
        g.beginPath();
        points.forEach((p, i) => (i ? g.lineTo(p[0] + shift, p[1] - shift) : g.moveTo(p[0] + shift, p[1] - shift)));
        g.stroke();
      };
      g.lineCap = 'round';
      g.lineJoin = 'round';
      g.strokeStyle = RED;
      g.globalAlpha = 0.2;
      g.lineWidth = width * 1.7;
      trace(0.3);
      g.globalAlpha = 0.82;
      g.lineWidth = width;
      trace(0);
      g.globalAlpha = 1;
    }
    const markPoints = (it, box) => it.path.map(([x, y]) => [box.x + x * box.radius, box.y + y * box.radius]);
    const scoreBox = (base) => {
      const r = slip.querySelector('.review-score')?.getBoundingClientRect();
      return r && { x: r.left - base.left + 2, y: r.top - base.top + 2 };
    };
    const scorePoints = (path, box) => path.points.map(([x, y]) => [box.x + x * score.h, box.y + y * score.h]);
    function paint() {
      const empty = !items.size && !score;
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
      items.forEach((it, i) => {
        if (!it.p) return;
        const box = letterBox(i, base);
        if (box) crayon(part(markPoints(it, box), it.p), clamp(box.u * 1.7, 1.3, 2.3));
      });
      const box = score && scoreBox(base);
      if (box) score.paths.forEach((path) => path.p && crayon(part(scorePoints(path, box), path.p), 2.6));
    }
    new ResizeObserver(() => paint()).observe(panel);
    function movePencil(p) {
      tip = p;
      pencil.style.transform = `translate(${p[0]}px, ${p[1]}px) rotate(-52deg)`;
    }

    // ── 점수 쪽지 ──
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
      paths.push({ p: 0, points: smooth([[-0.04, 1.2], [x * 0.5, 1.15], [x + 0.06, 1.12]]) });
      if (value >= 85) paths.push({ p: 0, points: smooth([[x * 0.08, 1.33], [x * 0.5, 1.29], [x * 0.96, 1.26]]) });
      return { value, paths, width: x + 0.14 };
    }
    function showSlip() {
      const tally = (kind, sign, name) =>
        `<span class="tally-${kind}" title="${name}"><b>${sign}</b><i data-count="${kind}">${counts[kind]}</i></span>`;
      slip.className = 'feedback review-slip';
      slip.innerHTML =
        '<span class="review-score"><span class="sr-only" data-result></span></span>' +
        `<span class="review-tally" aria-hidden="true">${tally('double', '◎', '겹동그라미')}${tally('circle', '○', '동그라미')}${tally('tri', '△', '세모')}</span>` +
        `<span class="review-stamp" hidden>${STAMP}</span>`;
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
      return `${score.value}점. 겹동그라미 ${counts.double}개, 동그라미 ${counts.circle}개, 세모 ${counts.tri}개${missing ? `, 안 쓴 글자 ${missing}개` : ''}.`;
    }

    // ── 채점 ──
    const gradeOf = (r) => (!r.order || r.score < 60 ? 'tri' : r.score >= 90 ? 'double' : 'circle');
    function start({ results, score: value, fresh }) {
      finish();
      closeLens();
      clearTimeout(autoLens);
      counts = { double: 0, circle: 0, tri: 0 };
      const next = new Map(),
        queue = [];
      results.forEach((r, i) => {
        if (!r) return;
        const kind = gradeOf(r),
          it = { kind, path: markPath(kind, i * 7 + app.letters()[i].charCodeAt(0)), p: fresh[i] ? 0 : 1 };
        next.set(i, it);
        if (fresh[i]) queue.push(i);
        else counts[kind]++;
      });
      const same = !queue.length && score?.value === value;
      items = next;
      if (same) return paint();
      const all = [...next.values()],
        stampIt = all.length === results.length && value >= 85 && !all.some((it) => it.kind === 'tri');
      score = { ...buildScore(value), h: 44 };
      showSlip();
      const stamp = slip.querySelector('.review-stamp'),
        drawTime = clamp(3600 / Math.max(1, queue.length) - 50, 90, 320),
        steps = [];
      const base = () => panel.getBoundingClientRect();
      const go = (to, dur, before) => {
        let from;
        steps.push({
          dur,
          start(quiet) {
            from = tip;
            if (!quiet) before?.();
          },
          run: (p) => {
            const target = to();
            if (target) movePencil(mix(from, target, ease(p)));
          },
        });
      };
      queue.forEach((i) => {
        const it = next.get(i),
          dur = drawTime * (it.kind === 'double' ? 1.4 : 1);
        go(
          () => {
            const box = letterBox(i, base());
            return box && markPoints(it, box)[0];
          },
          55,
          () => {
            const r = app.cell(i)?.pair.getBoundingClientRect();
            if (r && (r.top < 0 || r.bottom > innerHeight)) app.cell(i).pair.scrollIntoView({ block: 'center', behavior: 'smooth' });
          },
        );
        steps.push({
          dur,
          start: (quiet) => quiet || sound.scratch(dur / 1000),
          run(p) {
            it.p = p;
            const box = letterBox(i, base());
            if (box) {
              const line = part(markPoints(it, box), p);
              movePencil(line[line.length - 1]);
            }
          },
          end(quiet) {
            counts[it.kind]++;
            setCount(it.kind);
            if (!quiet) sound.mark(it.kind);
          },
        });
      });
      score.paths.forEach((path, n) => {
        const b = () => scoreBox(base());
        go(
          () => {
            const box = b();
            return box && scorePoints(path, box)[0];
          },
          n ? 45 : 130,
          n ? null : () => slip.scrollIntoView({ block: 'nearest', behavior: 'smooth' }),
        );
        const dur = path.points.length > 8 ? 170 : 90;
        steps.push({
          dur,
          start: (quiet) => quiet || sound.scratch(dur / 1000, 0.05),
          run(p) {
            path.p = p;
            const box = b();
            if (box) {
              const line = part(scorePoints(path, box), p);
              movePencil(line[line.length - 1]);
            }
          },
        });
      });
      steps.push({
        dur: 0,
        end(quiet) {
          pencil.hidden = true;
          if (!quiet) sound.total(value);
        },
      });
      if (stampIt) {
        steps.push({ dur: 260 });
        steps.push({
          dur: 170,
          start(quiet) {
            stamp.hidden = false;
            if (quiet) return;
            stamp.animate(
              [
                { transform: 'rotate(-12deg) scale(3)', opacity: 0 },
                { transform: 'rotate(-12deg) scale(0.92)', opacity: 1, offset: 0.85 },
                { transform: 'rotate(-12deg) scale(1)', opacity: 1 },
              ],
              { duration: 170, easing: 'ease-in' },
            );
          },
          end(quiet) {
            if (quiet) return;
            sound.stamp();
            slip.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(4px)' }, { transform: 'translateY(-1px)' }, { transform: 'translateY(0)' }], { duration: 180 });
          },
        });
      }
      const done = (natural) => {
        run = null;
        pencil.hidden = true;
        const result = slip.querySelector('[data-result]');
        if (result) result.textContent = resultText();
        if (!natural) return;
        const first = [...items].find(([, it]) => it.kind === 'tri');
        if (first) autoLens = setTimeout(() => openLens(first[0]), 480);
      };
      const first = queue.length ? letterBox(queue[0], base()) : scoreBox(base());
      if (first) movePencil([(first.x || 0) + 40, (first.y || 0) - 30]);
      if (motionOff() || document.hidden) {
        run = player(steps, paint, done);
        run.stop(true);
        return;
      }
      pencil.hidden = false;
      run = player(steps, paint, done);
    }
    function finish() {
      run?.stop(true);
      run = null;
    }
    // 고친 글자가 생기면 그 표시와 점수를 내린다(점수가 지금 글씨와 달라지므로).
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
        const rest = items;
        run?.stop(false);
        run = null;
        clearTimeout(autoLens);
        closeLens();
        score = null;
        pencil.hidden = true;
        hideSlip();
        items = rest;
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
      target.slice(lines.length).forEach(() => lines.push({ points: [], color: RED, alpha: 1, width: written[0].width || 2.5 }));
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
          c.fillStyle = RED;
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
            badge = { at: badgeAt(k), n: k + 1, color: RED };
            line.color = RED;
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
            lines.slice(target.length).forEach((l) => (l.color = RED));
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
      running: () => Boolean(run),
      showing: () => !slip.hidden && slip.classList.contains('review-slip'),
      finish,
      // 다시 쓰기 시작하면 연출을 끝 상태로 건너뛴다.
      interrupt() {
        clearTimeout(autoLens);
        finish();
      },
      tapped(i) {
        if (!run && items.get(i)?.kind === 'tri') openLens(i);
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
