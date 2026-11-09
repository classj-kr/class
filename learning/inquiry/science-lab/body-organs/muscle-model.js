/* 팔 옆모습: 위팔뼈 하나, 아래팔뼈 둘, 앞쪽의 굽히는 근육(이두근)과 뒤쪽의 펴는 근육(삼두근).
   단추를 누르면 팔꿈치 관절을 중심으로 아래팔이 천천히 돌아가고, 두 근육의 굵기와 길이가
   그에 맞춰 바뀐다. 얼굴은 왼쪽을 보고 있어 팔의 앞쪽이 그림 왼쪽이다. */
(() => {
 const drawing = document.getElementById('muscleDrawing'), bend = document.getElementById('bendArm'), straight = document.getElementById('straightArm');
 if (!drawing) return;
 const MAX = 135, SH = [230, 34], E = [230, 172], UPPER = 138, FORE = 118;
 const facts = { shape: document.getElementById('armShape'), flex: document.getElementById('armFlexor'), ext: document.getElementById('armExtensor') };
 let angle = 0, target = 0, anim = 0;
 const f = v => v.toFixed(1);
 const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k];
 // A muscle belly: thin tendons at both ends, a swelling in the middle.
 function belly(a, b, width, side, fill, stroke) {
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), u = [dx / len, dy / len], n = [-u[1] * side, u[0] * side];
  const a2 = add(a, u, len * .16), b2 = add(b, u, -len * .16);
  const m = add(add(a, u, len / 2), n, width * .55), m2 = add(add(a, u, len / 2), n, -width * .45);
  const c1 = add(m, n, width * .9), c2 = add(m2, n, -width * .2);
  return `<path d="M${f(a[0])} ${f(a[1])} L${f(a2[0])} ${f(a2[1])}" stroke="#e8dcc4" stroke-width="4" stroke-linecap="round"/>` +
   `<path d="M${f(b[0])} ${f(b[1])} L${f(b2[0])} ${f(b2[1])}" stroke="#e8dcc4" stroke-width="4" stroke-linecap="round"/>` +
   `<path d="M${f(a2[0])} ${f(a2[1])} Q${f(c1[0])} ${f(c1[1])} ${f(b2[0])} ${f(b2[1])} Q${f(c2[0])} ${f(c2[1])} ${f(a2[0])} ${f(a2[1])} Z" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>` +
   `<path d="M${f(add(a2, n, 2)[0])} ${f(add(a2, n, 2)[1])} Q${f(add(c1, n, -width * .5)[0])} ${f(add(c1, n, -width * .5)[1])} ${f(add(b2, n, 2)[0])} ${f(add(b2, n, 2)[1])}" fill="none" stroke="${stroke}" stroke-width=".8" opacity=".5"/>`;
 }
 function bone(a, b, w) {
  return `<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="#a89f86" stroke-width="${w + 3}" stroke-linecap="round"/><path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="#f6f2e4" stroke-width="${w}" stroke-linecap="round"/>`;
 }
 function paint() {
  const k = angle / MAX, t = angle * Math.PI / 180, dir = [-Math.sin(t), Math.cos(t)], back = [Math.cos(t), Math.sin(t)];
  const W = add(E, dir, FORE), H = add(W, dir, 22), handRot = 90 + angle * -1;
  const limb = (a, b, w) => `<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="#c9a68b" stroke-width="${w + 3}" stroke-linecap="round"/><path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="#f6e3d3" stroke-width="${w}" stroke-linecap="round"/>`;
  let s = '';
  // 몸통 가장자리와 어깨
  s += `<path d="M262 6 C252 30 250 70 254 120" fill="none" stroke="#c9a68b" stroke-width="2"/>`;
  s += limb([230, 20], E, 58) + limb(E, W, 44);
  s += `<g transform="translate(${f(H[0])} ${f(H[1])}) rotate(${f(-angle)})"><path d="M-14 -16 C-18 -2 -16 14 -6 22 C2 26 12 22 14 12 C16 0 14 -12 10 -18 Z" fill="#f6e3d3" stroke="#c9a68b" stroke-width="1.6"/><path d="M-12 8 C-20 12 -22 2 -16 -4" fill="#f6e3d3" stroke="#c9a68b" stroke-width="1.4"/></g>`;
  // 뼈: 위팔뼈, 아래팔뼈 두 개(안쪽 하나는 팔꿈치 뒤로 튀어나온 끝이 있다)
  const humTop = [230, 42], humEnd = [230, 164];
  const rA = add(add(E, dir, 8), back, -5), rB = add(add(W, dir, -4), back, -5);
  const uA = add(add(E, dir, -6), back, 9), uB = add(add(W, dir, -4), back, 5);
  s += bone(rA, rB, 7) + bone(uA, uB, 7) + bone(humTop, humEnd, 12);
  s += `<circle cx="230" cy="42" r="12" fill="#f6f2e4" stroke="#a89f86" stroke-width="1.5"/><ellipse cx="230" cy="166" rx="12" ry="9" fill="#f6f2e4" stroke="#a89f86" stroke-width="1.5"/>`;
  // 근육: 굽히는 근육은 앞(왼쪽), 펴는 근육은 뒤(오른쪽)
  const bicepsIn = add(add(E, dir, 26), back, -9), tricepsIn = add(add(E, dir, -10), back, 13);
  s += belly([219, 50], bicepsIn, 14 + 14 * k, 1, k > .5 ? '#c2453a' : '#d9786c', '#8f2a22');
  s += belly([242, 54], tricepsIn, 14 + 14 * (1 - k), -1, k < .5 ? '#c2453a' : '#d9786c', '#8f2a22');
  s += `<circle cx="${f(E[0])}" cy="${f(E[1])}" r="4" fill="#5b6b75"/>`;
  // 이름표(짧은 낱말만)
  const fore = add(add(E, dir, FORE * .55), back, 0);
  const lab = (x, y, tx, ty, text, anchor) => `<path d="M${f(tx)} ${f(ty)} L${x + (anchor === 'end' ? 6 : -6)} ${y - 5}" stroke="#64748b" stroke-width="1" fill="none"/><circle cx="${f(tx)}" cy="${f(ty)}" r="2.2" fill="#475569"/><text class="arm-label" x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`;
  const bMid = add([219, 50], [bicepsIn[0] - 219, bicepsIn[1] - 50], .5), tMid = add([242, 54], [tricepsIn[0] - 242, tricepsIn[1] - 54], .5);
  s += lab(110, 96, bMid[0] - 10 - 8 * k, bMid[1], '굽히는 근육', 'end');
  s += lab(350, 92, tMid[0] + 12, tMid[1], '펴는 근육', 'start');
  s += lab(350, 140, 232, 120, '위팔뼈', 'start');
  s += lab(350, 186, 236, 174, '관절', 'start');
  s += lab(angle > 60 ? 110 : 350, angle > 60 ? 214 : 262, fore[0], fore[1], '아래팔뼈', angle > 60 ? 'end' : 'start');
  window.scienceScene.render(drawing, s);
 }
 function report(flexed) {
  bend.setAttribute('aria-pressed', String(flexed)); straight.setAttribute('aria-pressed', String(!flexed));
  if (facts.shape) facts.shape.textContent = flexed ? '굽힘' : '폄';
  if (facts.flex) facts.flex.textContent = flexed ? '짧고 굵어짐 (수축)' : '길고 가늘어짐 (이완)';
  if (facts.ext) facts.ext.textContent = flexed ? '길고 가늘어짐 (이완)' : '짧고 굵어짐 (수축)';
  document.getElementById('muscleObservation').textContent = flexed ? '굽히는 근육이 수축하여 아래팔뼈를 당기면 팔이 관절을 중심으로 굽혀집니다.' : '펴는 근육이 수축하여 아래팔뼈를 당기면 굽혔던 팔이 펴집니다.';
 }
 function go(flexed) {
  target = flexed ? MAX : 0;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { angle = target; paint(); report(flexed); return; }
  cancelAnimationFrame(anim);
  const from = angle, start = performance.now(), dur = 300 + 700 * Math.abs(target - from) / MAX;
  const step = now => {
   const p = Math.min(1, Math.max(0, (now - start) / dur)), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
   angle = from + (target - from) * e; paint();
   if (p < 1) anim = requestAnimationFrame(step); else report(flexed);
  };
  anim = requestAnimationFrame(step);
 }
 bend.addEventListener('click', () => go(true)); straight.addEventListener('click', () => go(false));
 paint(); report(false);
})();
