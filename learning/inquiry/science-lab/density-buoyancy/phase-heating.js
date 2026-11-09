/* 「순수한 물질의 녹는점·끓는점 비교」 칸의 그림을 이 실험 폴더에서 다시 그린다.
   공용 모형(supplement-core.js)의 상태·문장·확인 문제는 그대로 두고, 그림만 바꾼다:
   왼쪽은 알코올램프로 데우는 실제 장치(삼발이·쇠그물·비커·시험관·온도계),
   오른쪽은 눈금이 있는 가열 곡선. 관찰 구간을 바꾸면 온도계 눈금과 곡선 위의 점이
   시간에 따라 움직여 새 구간에 닿는다. */
(() => {
 'use strict';
 const NS = 'http://www.w3.org/2000/svg';
 const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const f = v => (+v).toFixed(1);
 let section = null, frame = 0, shown = null; // shown = {key, pos}
 const TH = { x: 100, top: 26, bulb: 178 };  // thermometer

 function model(s) {
  const melt = s.kind === 'melt', point = melt ? (s.sample === 'A' ? 20 : 40) : (s.sample === 'A' ? 80 : 100);
  const plateau = s.amount === 'two' ? 100 : 50;
  return { melt, point, plateau, stage: { before: 0, during: 1, after: 2 }[s.step] ?? 0 };
 }
 // Curve parameter p (0..3): 0→1 rising, 1→2 plateau, 2→3 rising again.
 const STAGE_POS = [0.5, 1.5, 2.5];
 function tempAt(m, p) { return p <= 1 ? m.point - 40 + 40 * p : p <= 2 ? m.point : m.point + 40 * (p - 2); }
 function graphXY(m, p) {
  const total = 60 + m.plateau + 60, scale = 186 / 220;
  const t = p <= 1 ? 60 * p : p <= 2 ? 60 + m.plateau * (p - 1) : 60 + m.plateau + 60 * (p - 2);
  return [252 + t * scale, 252 - (tempAt(m, p) - (m.point - 40)) * (190 / 80)];
 }

 function apparatus(m, p, phase) {
  const T = tempAt(m, p), lo = -20, hi = 140;
  const colY = TH.bulb - 8 - (T - lo) / (hi - lo) * (TH.bulb - 8 - TH.top - 10);
  const flick = Math.sin(phase * 17) * 1.6 + Math.sin(phase * 29) * 1;
  const melted = p <= 1 ? 0 : p >= 2 ? 1 : p - 1;
  let s = '';
  // 받침대와 막대, 집게
  s += `<rect x="8" y="290" width="200" height="9" rx="2" fill="#9aa8b1" stroke="#6f7f89"/><rect x="22" y="40" width="6" height="252" fill="#9aa8b1" stroke="#6f7f89"/>`;
  s += `<rect x="24" y="66" width="${TH.x - 26}" height="6" rx="2" fill="#7e8d97"/><rect x="${TH.x - 8}" y="61" width="16" height="16" rx="3" fill="#5f6f79"/>`;
  // 알코올램프와 불꽃
  s += `<path d="M78 290 L82 262 Q100 252 118 262 L122 290 Z" fill="#dfeaf0" stroke="#7d97a4" stroke-width="1.4"/><path d="M84 286 L86 270 Q100 264 114 270 L116 286 Z" fill="#e6c27a" opacity=".55"/><rect x="95" y="248" width="10" height="9" rx="2" fill="#8a7a5c"/>`;
  s += `<path d="M100 ${f(214 + flick)} C109 228 108 244 100 248 C92 244 91 228 100 ${f(214 + flick)} Z" fill="#f6b13c" stroke="#e07b1a" stroke-width="1"/><path d="M100 ${f(228 + flick * .6)} C104 236 104 244 100 246 C96 244 96 236 100 ${f(228 + flick * .6)} Z" fill="#fde7a2"/>`;
  // 삼발이와 쇠그물
  s += `<path d="M58 290 L66 206 M142 290 L134 206" stroke="#56636b" stroke-width="3" stroke-linecap="round"/><rect x="54" y="200" width="92" height="6" rx="1" fill="#6b7780"/><path d="M58 203 H142" stroke="#c9d1d6" stroke-width="1" stroke-dasharray="2 2"/>`;
  // 비커 (녹는점: 물중탕, 끓는점: 물질을 직접)
  const bx0 = 62, bx1 = 138, btop = 120, bbot = 199;
  if (m.melt) {
   s += `<rect x="${bx0 + 2}" y="140" width="${bx1 - bx0 - 4}" height="${bbot - 141}" fill="#cfe9f5"/>`;
   // 시험관 속 물질
   const tx = TH.x - 11, ttop = 70, tbot = 190;
   s += `<path d="M${tx} ${ttop} V${tbot - 9} Q${tx} ${tbot} ${tx + 10} ${tbot} Q${tx + 20} ${tbot} ${tx + 20} ${tbot - 9} V${ttop}" fill="#f8fbfc" stroke="#7d97a4" stroke-width="1.4"/>`;
   const liquidTop = 150 + (1 - melted) * 22;
   if (melted > 0) s += `<path d="M${tx + 1.5} ${f(liquidTop)} V${tbot - 9} Q${tx + 1.5} ${tbot - 1.5} ${tx + 10} ${tbot - 1.5} Q${tx + 18.5} ${tbot - 1.5} ${tx + 18.5} ${tbot - 9} V${f(liquidTop)} Z" fill="#f2d48a" opacity=".9"/>`;
   const chunks = [[3, 176], [13, 177], [4, 166], [14, 165], [3, 156], [13, 155]];
   chunks.forEach(([dx, y], i) => {
    const keep = 1 - melted * 1.15 + i * .04; if (keep <= 0) return;
    const w = 6 * Math.min(1, keep);
    s += `<rect x="${f(tx + dx)}" y="${f(y - w / 2 + 4)}" width="${f(w)}" height="${f(w)}" rx="1" fill="#f7efd9" stroke="#b49a5e" stroke-width=".9" transform="rotate(${i * 23} ${f(tx + dx + w / 2)} ${f(y + 4)})"/>`;
   });
  } else {
   const boiled = melted, level = 150 + boiled * 46;
   if (boiled < 1) s += `<rect x="${bx0 + 2}" y="${f(level)}" width="${bx1 - bx0 - 4}" height="${f(bbot - 1 - level)}" fill="#f2d48a" opacity=".85"/>`;
   if (p > 1 && p < 2.05) for (let i = 0; i < 9; i++) {
    const rise = (phase * 0.9 + i / 9) % 1, bx = bx0 + 10 + (i * 37) % (bx1 - bx0 - 20);
    const by = bbot - 6 - rise * (bbot - 6 - level);
    if (by > level + 2) s += `<circle cx="${f(bx + Math.sin(rise * 9 + i) * 2)}" cy="${f(by)}" r="${f(2 + rise * 2.5)}" fill="#fff" fill-opacity=".7" stroke="#c49a3a" stroke-width=".8"/>`;
   }
   if (p > 1) for (let i = 0; i < 3; i++) {
    const w = (phase * 0.5 + i / 3) % 1, x = 82 + i * 18, o = (Math.min(1, (p - 1) * 2) * (1 - w) * .7).toFixed(2);
    s += `<path d="M${x} ${f(116 - w * 40)} q-6 -8 0 -16 q6 -8 0 -16" fill="none" stroke="#9fb3bd" stroke-width="2" stroke-linecap="round" opacity="${o}"/>`;
   }
  }
  s += `<path d="M${bx0} ${btop} V${bbot} H${bx1} V${btop}" fill="none" stroke="#7d97a4" stroke-width="2.2"/><path d="M${bx0 - 3} ${btop} H${bx0 + 4} M${bx1 - 4} ${btop} H${bx1 + 3}" stroke="#7d97a4" stroke-width="2.2"/>`;
  // 온도계
  s += `<rect x="${TH.x - 4}" y="${TH.top}" width="8" height="${TH.bulb - TH.top}" rx="4" fill="#fbfdfe" stroke="#7d97a4" stroke-width="1.2"/>`;
  s += `<rect x="${TH.x - 1.6}" y="${f(colY)}" width="3.2" height="${f(TH.bulb - colY)}" fill="#d43c3c"/><circle cx="${TH.x}" cy="${TH.bulb}" r="5.5" fill="#d43c3c" stroke="#9e2a2a" stroke-width="1"/>`;
  for (let v = 0; v <= 140; v += 20) { const y = TH.bulb - 8 - (v - lo) / (hi - lo) * (TH.bulb - 8 - TH.top - 10); s += `<path d="M${TH.x + 4} ${f(y)} h4" stroke="#7d97a4" stroke-width="1"/>`; }
  // 읽은 값
  s += `<rect x="140" y="28" width="66" height="28" rx="5" fill="#fff" stroke="#b9cbd3"/><text x="173" y="47" text-anchor="middle" class="ph-read">${Math.round(T)} °C</text><path d="M140 42 L${TH.x + 6} ${f(Math.max(colY, 40))}" stroke="#b9cbd3" stroke-width="1"/>`;
  return s;
 }

 function graph(m, p, sweep) {
  let s = '';
  const [x0, y0] = [244, 258];
  s += `<path d="M${x0} 50 V${y0} H446" fill="none" stroke="#475569" stroke-width="1.6"/><path d="M${x0 - 4} 56 L${x0} 48 L${x0 + 4} 56 M440 ${y0 - 4} L448 ${y0} L440 ${y0 + 4}" fill="none" stroke="#475569" stroke-width="1.6"/>`;
  for (let k = 0; k <= 4; k++) {
   const v = m.point - 40 + 20 * k, y = 252 - 20 * k * (190 / 80);
   s += `<path d="M${x0 - 4} ${f(y)} H${x0}" stroke="#475569" stroke-width="1.2"/>`;
   if (k) s += `<path d="M${x0} ${f(y)} H440" stroke="#e2e8f0" stroke-width="1"/>`;
   s += `<text x="${x0 - 7}" y="${f(y + 4.5)}" text-anchor="end" class="ph-tick">${v}</text>`;
  }
  s += `<text x="${x0 + 6}" y="44" class="ph-axis">온도 (°C)</text><text x="446" y="${y0 + 20}" text-anchor="end" class="ph-axis">가열 시간 →</text>`;
  // whole curve faint, the part already heated in colour
  const pts = n => { const a = []; for (let i = 0; i <= n; i++) a.push(graphXY(m, 3 * i / n)); return a; };
  const all = pts(60).map(([x, y]) => `${f(x)} ${f(y)}`).join(' L');
  s += `<path d="M${all}" fill="none" stroke="#cbd5e1" stroke-width="3" stroke-linejoin="round" stroke-dasharray="5 5"/>`;
  const upto = Math.min(p, sweep), done = [];
  for (let i = 0; i <= 90; i++) { const q = upto * i / 90; done.push(graphXY(m, q)); }
  s += `<path d="M${done.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')}" fill="none" stroke="#c2410c" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"/>`;
  const [px, py] = graphXY(m, upto);
  s += `<circle cx="${f(px)}" cy="${f(py)}" r="6" fill="#c2410c" stroke="#fff" stroke-width="2"/>`;
  // state names under each part of the curve
  const names = m.melt ? ['고체', '고체+액체', '액체'] : ['액체', '액체+기체', '기체'];
  [0.5, 1.5, 2.5].forEach((q, i) => { const [x, y] = graphXY(m, q); s += `<text x="${f(x)}" y="${f(Math.min(y0 - 8, y + (i === 1 ? -12 : 22)))}" text-anchor="middle" class="ph-state">${names[i]}</text>`; });
  return s;
 }

 function draw(svg, m, p, phase, sweep) {
  svg.setAttribute('viewBox', '0 0 460 310');
  svg.innerHTML = `<g data-local-art="phase">${apparatus(m, p, phase)}${graph(m, p, sweep)}</g>`;
 }

 function onRender() {
  const svg = section?.querySelector('.supplement-visual svg');
  if (!svg || svg.querySelector('[data-local-art]')) return;
  const st = window.__scienceSupplement?.getState?.(); if (!st) return;
  const m = model(st), key = [st.kind, st.sample, st.amount].join('|'), target = STAGE_POS[m.stage];
  cancelAnimationFrame(frame);
  const from = shown && shown.key === key ? shown.pos : null;
  shown = { key, pos: target };
  if (reduce()) { draw(svg, m, target, 0, 3); return; }
  // New substance or amount: draw the curve as heating goes from the start.
  const start = performance.now(), p0 = from === null ? 0 : from, dur = 400 + 900 * Math.abs(target - p0);
  const step = now => {
   if (!svg.isConnected) return;
   const k = Math.min(1, Math.max(0, (now - start) / dur)), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
   const p = p0 + (target - p0) * e;
   draw(svg, m, p, now / 1000, Math.max(p, from === null ? p : 3));
   if (k < 1) frame = requestAnimationFrame(step);
   else if (!m.melt && m.stage === 1) frame = requestAnimationFrame(boil);
  };
  // While boiling, bubbles keep rising for a few seconds, then the picture rests.
  const boilStart = start + dur;
  const boil = now => { if (!svg.isConnected) return; draw(svg, m, target, now / 1000, 3); if (now - boilStart < 4000) frame = requestAnimationFrame(boil); };
  frame = requestAnimationFrame(step);
 }

 function attach(sec) {
  section = sec;
  const visual = sec.querySelector('.supplement-visual');
  new MutationObserver(onRender).observe(visual, { childList: true, subtree: true });
  onRender();
 }
 const find = () => { const s = document.querySelector('section.curriculum-supplement'); if (s && window.__scienceSupplement?.slug === 'density-buoyancy') { attach(s); return true; } return false; };
 if (!find()) {
  const watch = new MutationObserver(() => { if (find()) watch.disconnect(); });
  watch.observe(document.body, { childList: true, subtree: true });
 }
})();
