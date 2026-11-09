/* 이 실험 폴더 전용 그림. 공용 모형(required-experiments-more.js, supplement-core.js)의
   상태·문장·확인 문제는 그대로 두고, 두 칸의 그림만 실제 장치 모양으로 다시 그린다.
   1) 가열장치 없는 발열 용기: 단열 상자 단면, 위쪽 물 용기와 온도계, 아래 반응부의
      산화 칼슘 덩어리와 물. '변화 뒤'를 고르면 반응부에서 김이 오르고 열이 위로 옮겨 가며
      온도계 숫자가 시간에 따라 오른다.
   2) 산·염기 섞기: 두 눈금실린더의 용액을 단열 컵에 부어 섞고, 온도계가 오른 뒤
      그래프에 그 조건의 점 하나만 찍힌다(섞어 본 조건만 남는다). */
(() => {
 'use strict';
 const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const f = v => (+v).toFixed(1);
 const ease = u => u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
 const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

 /* ---------------------------------------------------------------- 1. heating device */
 const H = { frame: 0, last: null };
 function heatingSvg(s, k, phase) {
  // k: 0 = start, 1 = fully changed. Temperature follows the shared model.
  const calcium = s.reaction === 'calcium', ins = s.insulation === 'yes';
  const final = 20 + (calcium ? (ins ? 28 : 16) : 0), T = 20 + (final - 20) * k;
  let o = '';
  o += `<rect x="40" y="286" width="380" height="8" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
  // outer box, cut open: thick insulation or a thin plastic wall
  const wall = ins ? 16 : 5;
  o += `<rect x="90" y="70" width="230" height="214" rx="8" fill="${ins ? '#d9cfae' : '#e6edf0'}" stroke="#8b8a74" stroke-width="1.6"/>`;
  if (ins) for (let i = 0; i < 26; i += 1) { const y = 76 + i * 8; o += `<path d="M94 ${y} q4 3 8 0 q4 -3 8 0 M300 ${y} q4 3 8 0 q4 -3 8 0" fill="none" stroke="#b9a979" stroke-width="1"/>`; }
  o += `<rect x="${90 + wall}" y="${70 + wall}" width="${230 - 2 * wall}" height="${214 - 2 * wall}" rx="4" fill="#fbfcfd" stroke="#a7b4bb"/>`;
  // lower compartment: reaction part
  const lx0 = 90 + wall + 10, lx1 = 320 - wall - 10, ly = 196, lb = 284 - wall - 4;
  o += `<path d="M${lx0} ${ly - 10} V${lb} H${lx1} V${ly - 10}" fill="none" stroke="#7d97a4" stroke-width="2"/>`;
  o += `<rect x="${lx0 + 2}" y="${ly + 18}" width="${lx1 - lx0 - 4}" height="${lb - ly - 19}" fill="#cfe6f2"/>`;
  if (calcium) {
   const lumps = [[0.15, 0], [0.3, 4], [0.45, -2], [0.62, 3], [0.78, -1], [0.9, 2]];
   lumps.forEach(([u, dy], i) => { const x = lx0 + u * (lx1 - lx0), y = lb - 9 + dy * .5, w = 16 - (i % 3) * 3; o += `<path d="M${f(x - w / 2)} ${f(y + 6)} l3 -9 l${f(w * .45)} -3 l${f(w * .4)} 5 l1 7 Z" fill="#f1efe8" stroke="#9c978a" stroke-width="1"/>`; });
   // bubbles and steam while it reacts
   const live = k > 0 && k < 1.001 ? 1 : 0;
   if (live) for (let i = 0; i < 10; i += 1) {
    const r = (phase * .8 + i / 10) % 1, x = lx0 + 14 + (i * 41) % (lx1 - lx0 - 28), y = lb - 10 - r * (lb - ly - 30);
    o += `<circle cx="${f(x + Math.sin(r * 8 + i) * 2)}" cy="${f(y)}" r="${f(1.6 + r * 2)}" fill="#fff" fill-opacity=".75" stroke="#8fb7cb" stroke-width=".8"/>`;
   }
   if (k > 0) for (let i = 0; i < 4; i += 1) {
    const r = (phase * .5 + i / 4) % 1, x = lx0 + 30 + i * (lx1 - lx0 - 60) / 3;
    o += `<path d="M${f(x)} ${f(ly + 12 - r * 22)} q-5 -6 0 -12 q5 -6 0 -12" fill="none" stroke="#a9bcc6" stroke-width="2" stroke-linecap="round" opacity="${f((1 - r) * .8 * Math.min(1, k * 3))}"/>`;
   }
  }
  // tray between the parts
  o += `<rect x="${90 + wall}" y="${ly - 22}" width="${230 - 2 * wall}" height="7" fill="#7f8f99"/>`;
  for (let x = 90 + wall + 12; x < 320 - wall - 8; x += 14) o += `<circle cx="${x}" cy="${ly - 18.5}" r="1.6" fill="#d7dee2"/>`;
  // heat moving up through the tray
  if (calcium && k > 0) for (let i = 0; i < 3; i += 1) {
   const x = 150 + i * 55, off = (phase * 26) % 12;
   o += `<path d="M${x} ${ly - 4} V${ly - 40}" stroke="#d9772b" stroke-width="3" stroke-dasharray="6 6" stroke-dashoffset="${f(off)}" opacity="${f(Math.min(1, k * 2))}"/><path d="M${x - 5} ${ly - 34} L${x} ${ly - 42} L${x + 5} ${ly - 34}" fill="none" stroke="#d9772b" stroke-width="2.4" opacity="${f(Math.min(1, k * 2))}"/>`;
  }
  // upper vessel with water (in place of food)
  const ux0 = 128, ux1 = 282, uy0 = 98, uy1 = ly - 28;
  o += `<rect x="${ux0 + 2}" y="${uy0 + 22}" width="${ux1 - ux0 - 4}" height="${uy1 - uy0 - 23}" fill="${T > 30 ? '#f6dcc8' : '#d6ebf5'}" opacity=".95"/>`;
  o += `<path d="M${ux0} ${uy0} V${uy1} H${ux1} V${uy0}" fill="none" stroke="#7d97a4" stroke-width="2.2"/>`;
  // lid and thermometer through it
  o += `<rect x="${86 + wall}" y="${64}" width="${238 - 2 * wall + 8}" height="10" rx="3" fill="${ins ? '#c8bc96' : '#d3dde2'}" stroke="#8b8a74"/>`;
  const tx = 250, top = 36, bulb = uy1 - 14, colY = bulb - 6 - (T - 15) / 40 * (bulb - top - 16);
  o += `<rect x="${tx - 4}" y="${top}" width="8" height="${bulb - top}" rx="4" fill="#fff" stroke="#7d97a4" stroke-width="1.2"/><rect x="${tx - 1.6}" y="${f(colY)}" width="3.2" height="${f(bulb - colY)}" fill="#d43c3c"/><circle cx="${tx}" cy="${bulb}" r="5" fill="#d43c3c"/>`;
  o += `<rect x="${tx + 14}" y="${top - 4}" width="78" height="30" rx="5" fill="#fff" stroke="#b9cbd3"/><text x="${tx + 53}" y="${top + 16}" text-anchor="middle" class="nc-read">${T.toFixed(1)} °C</text><path d="M${tx + 14} ${top + 11} H${tx + 4}" stroke="#b9cbd3"/>`;
  // short labels with leader lines
  // 이름표는 그림 오른쪽 빈자리에 단다(왼쪽 끝에 맞추면 글자가 커지는 화면에서 그림 밖으로 나간다).
  const lab = (x, y, tx2, ty2, text) => `<path d="M${tx2} ${ty2} L${x - 4} ${y - 5}" stroke="#94a3b8"/><circle cx="${tx2}" cy="${ty2}" r="2" fill="#64748b"/><text x="${x}" y="${y}" text-anchor="start" class="nc-label">${text}</text>`;
  o += lab(340, 160, ux1 - 6, 160, '물 용기');
  // 아래 반응부 이름표는 칸 한가운데에(좁은 화면에서 글자가 커져도 양쪽 여유가 가장 크다).
  o += `<text x="${(lx0 + lx1) / 2}" y="${lb - 8}" text-anchor="middle" class="nc-label" stroke="#fff" stroke-width="4" paint-order="stroke" stroke-linejoin="round">${calcium ? '산화 칼슘 + 물' : '물만'}</text>`;
  o += lab(82, 100, ins ? 98 : 93, 112, ins ? '단열재' : '얇은 벽');
  return `<g data-local-art="heating">${o}</g>`;
 }
 function heatingRender() {
  const panel = document.getElementById('required-experiments'), svg = panel?.querySelector('svg.required-figure');
  const api = window.__requiredExperiments;
  if (!svg || !api || api.getId() !== 'heating-device' || svg.querySelector('[data-local-art]')) return;
  const s = api.getState(), key = s.reaction + '|' + s.insulation, on = String(s.step) === '1';
  cancelAnimationFrame(H.frame);
  const readDd = panel.querySelector('.required-readings dd');
  const paint = (k, ph) => { svg.setAttribute('viewBox', '0 0 460 310'); svg.innerHTML = heatingSvg(s, k, ph); };
  const animate = on && !reduce() && !(H.last && H.last.key === key && H.last.on);
  H.last = { key, on };
  if (!animate) { paint(on ? 1 : 0, 0); return; }
  const final = 20 + (s.reaction === 'calcium' ? (s.insulation === 'yes' ? 28 : 16) : 0), start = performance.now(), dur = 2600;
  const step = now => {
   if (!svg.isConnected) return;
   const t = Math.min(1, Math.max(0, (now - start) / dur)), k = ease(t);
   paint(k, now / 1000);
   if (readDd) readDd.textContent = (20 + (final - 20) * k).toFixed(1) + ' ℃';
   if (t < 1) H.frame = requestAnimationFrame(step);
   else { if (readDd) readDd.textContent = final.toFixed(1) + ' ℃'; paint(1, now / 1000); }
  };
  H.frame = requestAnimationFrame(step);
 }

 /* ---------------------------------------------------------------- 2. acid + base mixing */
 const M = { frame: 0, last: null, tested: new Set() };
 const tempOf = a => 20 + Math.min(a, 100 - a) * .01 * 13.7;
 function cylinder(mx, my, ang, vol, name, color, tt) {
  // drawn with its mouth at (0,0) and the body hanging down; tipping past level
  // lets the liquid run to the mouth end
  const h = 96, fill = vol / 100 * (h - 8), y0 = (h - fill) * (1 - tt);
  let s = `<g transform="translate(${f(mx)} ${f(my)}) rotate(${f(ang)})">`;
  if (fill > .3) s += `<rect x="-10" y="${f(y0)}" width="20" height="${f(fill)}" fill="${color}"/>`;
  s += `<path d="M-12 -2 H-10 V${h} H10 V-2 H12" fill="none" stroke="#7d97a4" stroke-width="2"/><rect x="-16" y="${h}" width="32" height="5" rx="2" fill="#a7b4bb"/>`;
  for (let i = 1; i <= 9; i += 1) { const y = h - i * (h - 8) / 10; s += `<path d="M-10 ${f(y)} h${i % 5 ? 4 : 8}" stroke="#7d97a4" stroke-width="1"/>`; }
  return s + '</g>';
 }
 function mixingSvg(st, k, phase, tested) {
  const acid = +st.acid, base = 100 - acid, after = st.stage === 'after', final = tempOf(acid);
  // k runs 0..1 through the pour: tilt, pour, return, warm up
  const tilt = clamp(k / .25, 0, 1) - clamp((k - .7) / .15, 0, 1), pour = clamp((k - .25) / .4, 0, 1), warm = clamp((k - .45) / .55, 0, 1);
  const T = after ? 20 + (final - 20) * ease(warm) : 20;
  let o = `<rect x="6" y="286" width="232" height="8" rx="2" fill="#cdbb9f" stroke="#a48f6e"/>`;
  // insulated cup (foam) on the bench
  const cx0 = 82, cx1 = 160, cy0 = 196, cy1 = 284, cupLevel = cy1 - 6 - (after ? pour : 0) * 62;
  o += `<path d="M${cx0} ${cy0} L${cx0 + 8} ${cy1} H${cx1 - 8} L${cx1} ${cy0} Z" fill="#fbfbf8" stroke="#a6a299" stroke-width="2"/>`;
  if (after && pour > 0) { const w = (cupLevel - cy0) / (cy1 - cy0) * 8; o += `<path d="M${f(cx0 + w + 2)} ${f(cupLevel)} L${cx0 + 9} ${cy1 - 2} H${cx1 - 9} L${f(cx1 - w - 2)} ${f(cupLevel)} Z" fill="#d7e8f1"/>`; }
  for (let i = 0; i < 3; i += 1) o += `<path d="M${cx0 + 3 + i * .5} ${cy0 + 20 + i * 22} H${cx1 - 3 - i * .5}" stroke="#e4e1d9" stroke-width="1"/>`;
  // two cylinders: they lift, tip into the cup, and come back
  const aRest = [36, 185], aPour = [100, 188], bRest = [206, 185], bPour = [142, 188];
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const tt = after ? ease(tilt) : 0, left = after ? 1 - pour : 1;
  const am = lerp(aRest, aPour, tt), bm = lerp(bRest, bPour, tt);
  o += cylinder(am[0], am[1], 104 * tt, acid * left, '염산', '#cfe3ee', tt);
  o += cylinder(bm[0], bm[1], -104 * tt, base * left, '수산화 나트륨', '#d6e4ee', tt);
  if (tt < .05) o += `<text x="36" y="160" text-anchor="middle" class="nc-label">염산</text><text x="36" y="176" text-anchor="middle" class="nc-tick">${acid} mL</text><text x="206" y="160" text-anchor="middle" class="nc-label">수산화 나트륨</text><text x="206" y="176" text-anchor="middle" class="nc-tick">${base} mL</text>`;
  if (after && pour > 0 && pour < 1 && tt > .9) {
   o += `<path d="M${f(am[0])} ${f(am[1])} Q${f(am[0] + 6)} ${f(am[1] + 10)} ${f(am[0] + 8)} ${f(cupLevel)}" fill="none" stroke="#b6d6e6" stroke-width="4" stroke-linecap="round"/>`;
   o += `<path d="M${f(bm[0])} ${f(bm[1])} Q${f(bm[0] - 6)} ${f(bm[1] + 10)} ${f(bm[0] - 8)} ${f(cupLevel)}" fill="none" stroke="#b6d6e6" stroke-width="4" stroke-linecap="round"/>`;
  }
  // thermometer in the cup and its reading right beside it
  const tx = 121, top = 70, bulb = 270, colY = bulb - 6 - (T - 15) / 20 * (bulb - top - 16);
  o += `<rect x="${tx - 4}" y="${top}" width="8" height="${bulb - top}" rx="4" fill="#fff" stroke="#7d97a4" stroke-width="1.2"/><rect x="${tx - 1.6}" y="${f(colY)}" width="3.2" height="${f(bulb - colY)}" fill="#d43c3c"/><circle cx="${tx}" cy="${bulb}" r="5" fill="#d43c3c"/>`;
  o += `<rect x="${tx - 39}" y="${top - 40}" width="78" height="30" rx="5" fill="#fff" stroke="#b9cbd3"/><text x="${tx}" y="${top - 20}" text-anchor="middle" class="nc-read">${T.toFixed(1)} °C</text><path d="M${tx} ${top - 10} V${top}" stroke="#b9cbd3"/>`;
  // graph: only the conditions already mixed
  const gx0 = 284, gx1 = 446, gy0 = 250, gy1 = 70, xOf = a => gx0 + (a - 10) / 80 * (gx1 - gx0), yOf = t => gy0 - (t - 20) / 8 * (gy0 - gy1);
  o += `<path d="M${gx0} ${gy1 - 6} V${gy0} H${gx1 + 6}" fill="none" stroke="#475569" stroke-width="1.6"/>`;
  [20, 24, 28].forEach(t => { o += `<path d="M${gx0 - 4} ${f(yOf(t))} H${gx1}" stroke="${t === 20 ? 'none' : '#e2e8f0'}"/><path d="M${gx0 - 4} ${f(yOf(t))} H${gx0}" stroke="#475569"/><text x="${gx0 - 7}" y="${f(yOf(t) + 4.5)}" text-anchor="end" class="nc-tick">${t}</text>`; });
  [20, 50, 80].forEach(a => { o += `<path d="M${f(xOf(a))} ${gy0} v4" stroke="#475569"/><text x="${f(xOf(a))}" y="${gy0 + 19}" text-anchor="middle" class="nc-tick">${a}</text>`; });
  o += `<text x="${gx0 - 4}" y="${gy1 - 14}" class="nc-axis" text-anchor="middle">온도 (°C)</text><text x="${gx1 + 6}" y="${gy0 + 40}" text-anchor="end" class="nc-axis">산의 부피 (mL)</text>`;
  const pts = [...tested].sort((p, q) => p - q);
  if (pts.length > 1) o += `<path d="M${pts.map(a => `${f(xOf(a))} ${f(yOf(tempOf(a)))}`).join(' L')}" fill="none" stroke="#9fb7c2" stroke-width="2" stroke-dasharray="4 4"/>`;
  pts.forEach(a => { const now = a === acid; o += `<circle cx="${f(xOf(a))}" cy="${f(yOf(tempOf(a)))}" r="${now ? 7 : 5}" fill="${now ? '#c2410c' : '#5394a2'}" stroke="#fff" stroke-width="2"/>`; });
  if (after && !tested.has(acid) && warm > 0) o += `<circle cx="${f(xOf(acid))}" cy="${f(yOf(T))}" r="6" fill="#c2410c" opacity=".6"/>`;
  return `<g data-local-art="mixing">${o}</g>`;
 }
 function mixingRender() {
  const sec = M.section, svg = sec?.querySelector('.supplement-visual svg');
  if (!svg || svg.querySelector('[data-local-art]')) return;
  const st = window.__scienceSupplement?.getState?.(); if (!st) return;
  cancelAnimationFrame(M.frame);
  // The shared text still describes a graph of all five results; here the graph
  // keeps only the conditions actually mixed.
  const obs = sec.querySelector('.supplement-observation');
  if (obs && obs.textContent.includes('다섯 조건')) obs.textContent = obs.textContent.replace(/오른쪽 그래프는[^.]*\./, '섞어 본 조건만 오른쪽 그래프에 점으로 남습니다.');
  const paint = (k, ph) => { svg.setAttribute('viewBox', '0 0 460 310'); svg.innerHTML = mixingSvg(st, k, ph, M.tested); };
  const animate = st.stage === 'after' && !reduce() && !(M.last && M.last.acid === st.acid && M.last.stage === 'after');
  M.last = { ...st };
  if (st.stage !== 'after') { paint(0, 0); return; }
  if (!animate) { M.tested.add(+st.acid); paint(1, 0); return; }
  const start = performance.now(), dur = 3200;
  const step = now => {
   if (!svg.isConnected) return;
   const t = Math.min(1, Math.max(0, (now - start) / dur));
   paint(t, now / 1000);
   if (t < 1) M.frame = requestAnimationFrame(step); else { M.tested.add(+st.acid); paint(1, now / 1000); }
  };
  M.frame = requestAnimationFrame(step);
 }

 /* ---------------------------------------------------------------- wiring */
 const css = document.createElement('style');
 css.textContent = '.nc-read{fill:#9e2a2a;font-size:16px;font-weight:800}.nc-label{fill:#334155;font-size:14px;font-weight:700}.nc-tick{fill:#334155;font-size:13.5px;font-weight:600}.nc-axis{fill:#1e293b;font-size:14px;font-weight:700}';
 document.head.append(css);
 function attachRequired(panel) {
  const svg = panel.querySelector('svg.required-figure');
  new MutationObserver(heatingRender).observe(svg, { childList: true });
  // switching experiments or resetting re-renders the same svg
  heatingRender();
 }
 function attachSupplement(sec) {
  M.section = sec;
  new MutationObserver(mixingRender).observe(sec.querySelector('.supplement-visual'), { childList: true, subtree: true });
  mixingRender();
 }
 let haveReq = false, haveSup = false;
 const look = () => {
  if (!haveReq) { const p = document.getElementById('required-experiments'); if (p && window.__requiredExperiments) { haveReq = true; attachRequired(p); } }
  if (!haveSup) { const s = document.querySelector('section.curriculum-supplement'); if (s && window.__scienceSupplement?.slug === 'neutralization-common') { haveSup = true; attachSupplement(s); } }
  return haveReq && haveSup;
 };
 if (!look()) { const w = new MutationObserver(() => { if (look()) w.disconnect(); }); w.observe(document.body, { childList: true, subtree: true }); }
})();
