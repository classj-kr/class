/* 「세포분열과 염색체 관찰」 칸의 그림을 이 실험 폴더에서 다시 그린다.
   공용 모형(supplement-core.js)의 상태·문장·확인 문제는 그대로 두고 그림만 바꾼다.
   염색체 4개(긴 것 한 쌍, 짧은 것 한 쌍; 빨강은 한 부모, 파랑은 다른 부모)를 염색 분체
   8가닥으로 그리고, 관찰 순서를 바꾸면 염색체가 가운데로 모였다가 방추사에 끌려
   양쪽으로 갈라지며 세포가 둘(또는 넷)로 나뉘는 과정을 움직여 보여 준다. */
(() => {
 'use strict';
 const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 const f = v => (+v).toFixed(1);
 const COL = ['#c0504d', '#3f73b8', '#c0504d', '#3f73b8'], LEN = [54, 54, 34, 34];
 let section = null, frame = 0, shown = null;

 // A layout: 4 cells {x,y,rx,ry}, 8 chromatids {x,y,a(deg)}, plus flags.
 const X = (x, y) => [{ x: x - 2.5, y, a: -15 }, { x: x + 2.5, y, a: 15 }];       // replicated chromosome
 function layout(kind, step) {
  const mei = kind === 'meiosis';
  if (step === 'start') {
   const c = { x: 230, y: 152, rx: 160, ry: 112 }, pos = [[172, 130], [290, 176], [262, 118], [190, 186]];
   return { cells: [c, c, c, c], ch: pos.flatMap(([x, y]) => X(x, y)), nucleus: true, spindle: 0 };
  }
  if (step === 'meta') {
   const c = { x: 230, y: 152, rx: 168, ry: 106 };
   const pos = mei ? [[219, 118], [241, 118], [219, 188], [241, 188]] : [[230, 92], [230, 132], [230, 172], [230, 212]];
   return { cells: [c, c, c, c], ch: pos.flatMap(([x, y]) => X(x, y)), nucleus: false, spindle: 1, axis: 'h' };
  }
  if (step === 'middle') {
   const L = { x: 122, y: 152, rx: 104, ry: 96 }, R = { x: 338, y: 152, rx: 104, ry: 96 };
   if (mei) {
    // homologous chromosomes went apart: still two strands each
    const ch = [...X(100, 152), ...X(316, 152), ...X(148, 152), ...X(362, 152)];
    return { cells: [L, R, L, R], ch, nucleus: false, spindle: 0.4, axis: 'h' };
   }
   const ch = []; for (let k = 0; k < 4; k += 1) { const dx = (k - 1.5) * 26; ch.push({ x: 122 + dx, y: 152, a: 0 }, { x: 338 + dx, y: 152, a: 0 }); }
   return { cells: [L, R, L, R], ch, nucleus: false, spindle: 0.4, axis: 'h' };
  }
  // end
  if (mei) {
   const cs = [{ x: 122, y: 82, rx: 92, ry: 64 }, { x: 338, y: 82, rx: 92, ry: 64 }, { x: 122, y: 224, rx: 92, ry: 64 }, { x: 338, y: 224, rx: 92, ry: 64 }];
   const ch = [
    { x: 106, y: 82, a: 0 }, { x: 106, y: 224, a: 0 },  // long red: strand a top-left, b bottom-left
    { x: 322, y: 82, a: 0 }, { x: 322, y: 224, a: 0 },  // long blue
    { x: 140, y: 82, a: 0 }, { x: 140, y: 224, a: 0 },  // short red
    { x: 356, y: 82, a: 0 }, { x: 356, y: 224, a: 0 }]; // short blue
   return { cells: [cs[0], cs[1], cs[2], cs[3]], ch, nucleus: true, spindle: 0, cellOrder: [0, 1, 2, 3] };
  }
  const L = { x: 112, y: 152, rx: 100, ry: 92 }, R = { x: 348, y: 152, rx: 100, ry: 92 };
  const ch = []; for (let k = 0; k < 4; k += 1) { const dx = (k - 1.5) * 24; ch.push({ x: 112 + dx, y: 152, a: 0 }, { x: 348 + dx, y: 152, a: 0 }); }
  return { cells: [L, R, L, R], ch, nucleus: true, spindle: 0 };
 }
 const lerp = (a, b, t) => a + (b - a) * t;
 function mix(A, B, t) {
  return {
   cells: A.cells.map((c, i) => ({ x: lerp(c.x, B.cells[i].x, t), y: lerp(c.y, B.cells[i].y, t), rx: lerp(c.rx, B.cells[i].rx, t), ry: lerp(c.ry, B.cells[i].ry, t) })),
   ch: A.ch.map((q, i) => ({ x: lerp(q.x, B.ch[i].x, t), y: lerp(q.y, B.ch[i].y, t), a: lerp(q.a, B.ch[i].a, t) })),
   nucleus: t < .5 ? A.nucleus : B.nucleus, nucleusFade: A.nucleus === B.nucleus ? 1 : Math.abs(1 - 2 * t),
   spindle: lerp(A.spindle, B.spindle, t), axis: B.axis || A.axis
  };
 }

 function paint(svg, L) {
  let s = '';
  // cells: fills first, then outlines, so a dividing cell shows its furrow
  const uniq = []; L.cells.forEach(c => { if (!uniq.some(u => Math.abs(u.x - c.x) < .5 && Math.abs(u.y - c.y) < .5 && Math.abs(u.rx - c.rx) < .5)) uniq.push(c); });
  uniq.forEach(c => { s += `<ellipse cx="${f(c.x)}" cy="${f(c.y)}" rx="${f(c.rx)}" ry="${f(c.ry)}" fill="#fbeee6"/>`; });
  uniq.forEach(c => { s += `<ellipse cx="${f(c.x)}" cy="${f(c.y)}" rx="${f(c.rx)}" ry="${f(c.ry)}" fill="none" stroke="#c98f7a" stroke-width="2.4"/>`; });
  uniq.forEach(c => { s += `<ellipse cx="${f(c.x)}" cy="${f(c.y)}" rx="${f(c.rx - 7)}" ry="${f(c.ry - 7)}" fill="none" stroke="#efd5c8" stroke-width="5"/>`; });
  if (L.nucleus) uniq.forEach(c => { s += `<ellipse cx="${f(c.x)}" cy="${f(c.y)}" rx="${f(c.rx * .62)}" ry="${f(c.ry * .62)}" fill="#f4e2f0" fill-opacity="${f((L.nucleusFade ?? 1) * .8)}" stroke="#b58db0" stroke-opacity="${f(L.nucleusFade ?? 1)}" stroke-width="1.4" stroke-dasharray="5 3"/>`; });
  // spindle fibres from the two poles of each dividing cell
  if (L.spindle > 0.02) uniq.forEach(c => {
   const o = Math.min(1, L.spindle).toFixed(2), px = c.rx * .92;
   for (const side of [-1, 1]) {
    const pole = [c.x + side * px, c.y];
    s += `<circle cx="${f(pole[0])}" cy="${f(pole[1])}" r="3.2" fill="#8a7a6a" opacity="${o}"/>`;
    for (let i = -3; i <= 3; i += 1) s += `<path d="M${f(pole[0])} ${f(pole[1])} Q${f(c.x + side * px * .35)} ${f(c.y + i * c.ry * .2)} ${f(c.x)} ${f(c.y + i * c.ry * .17)}" fill="none" stroke="#b8a998" stroke-width=".9" opacity="${o}"/>`;
   }
  });
  // chromatids: rounded rods with a pinch at the centromere
  L.ch.forEach((q, i) => {
   const k = i >> 1, len = LEN[k], col = COL[k], r = q.a * Math.PI / 180, dx = Math.sin(r) * len / 2, dy = -Math.cos(r) * len / 2;
   s += `<path d="M${f(q.x - dx)} ${f(q.y - dy)} L${f(q.x + dx)} ${f(q.y + dy)}" stroke="${col}" stroke-width="9" stroke-linecap="round"/>`;
   s += `<path d="M${f(q.x - dx * .8)} ${f(q.y - dy * .8)} L${f(q.x + dx * .8)} ${f(q.y + dy * .8)}" stroke="#fff" stroke-opacity=".28" stroke-width="2" stroke-linecap="round"/>`;
   s += `<circle cx="${f(q.x)}" cy="${f(q.y)}" r="2.6" fill="#5b3a3a"/>`;
  });
  svg.setAttribute('viewBox', '0 0 460 310');
  svg.innerHTML = `<g data-local-art="chromosome">${s}</g>`;
 }

 function onRender() {
  const svg = section?.querySelector('.supplement-visual svg');
  if (!svg || svg.querySelector('[data-local-art]')) return;
  const st = window.__scienceSupplement?.getState?.(); if (!st) return;
  cancelAnimationFrame(frame);
  const target = layout(st.kind, st.step), prev = shown;
  shown = { kind: st.kind, step: st.step };
  if (reduce() || !prev || prev.kind !== st.kind || prev.step === st.step) { paint(svg, target); return; }
  // From the first picture to the second, go through the line-up in the middle.
  const path = prev.step === 'start' && st.step !== 'start' ? [layout(st.kind, 'start'), layout(st.kind, 'meta'), layout(st.kind, 'middle')].concat(st.step === 'end' ? [target] : [])
   : [layout(prev.kind, prev.step), target];
  const legs = path.length - 1, dur = 900 * legs, start = performance.now();
  const step = now => {
   if (!svg.isConnected) return;
   const t = Math.min(1, Math.max(0, (now - start) / dur)), pos = t * legs, i = Math.min(legs - 1, Math.floor(pos)), u = pos - i;
   const e = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
   paint(svg, mix(path[i], path[i + 1], e));
   if (t < 1) frame = requestAnimationFrame(step); else paint(svg, target);
  };
  frame = requestAnimationFrame(step);
 }
 function attach(sec) {
  section = sec;
  new MutationObserver(onRender).observe(sec.querySelector('.supplement-visual'), { childList: true, subtree: true });
  onRender();
 }
 const find = () => { const s = document.querySelector('section.curriculum-supplement'); if (s && window.__scienceSupplement?.slug === 'pea-genetics') { attach(s); return true; } return false; };
 if (!find()) { const w = new MutationObserver(() => { if (find()) w.disconnect(); }); w.observe(document.body, { childList: true, subtree: true }); }
})();
