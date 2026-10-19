// 10-2-3 도형의 이동 — 실력 문항. 틀과 이 단원의 도구는 10-2-3a.js(B.kit.m1023)에 있다.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 평행이동한 도형의 방정식에서 x 대신 x + a 를 넣는다(점은 더하고 도형의 식은 뺀다). f(x + 2, −y) = 0 을 「x축 방향으로 +2」로 읽는다(②34).
//  - 대칭이동을 거듭할 때 차례를 바꾸어도 같다고 여긴다. 원점 대칭 뒤 y축 대칭이 x축 대칭이라는 것을 못 본다(②8).
//  - 직선 y = x 에 대하여 대칭이면 그 직선과 나란한 직선(y = x + 3)도 그대로라고 여긴다. 그대로인 것은 기울기가 −1인 직선, 중심이 y = x 위에 있는 원이다(②13).
//  - 거리의 합의 최솟값에서 두 점이 직선의 같은 쪽에 있는지 보지 않고 바로 잇는다. 거울이 둘이면 두 점을 각각 다른 거울에 대칭이동해야 한다(②40, ②38).
//  - 삼각형의 둘레를 최소로 할 때 정해진 변의 길이를 더하지 않는다(②41). 근호 두 개의 합을 거리의 합으로 읽지 못한다(②42).
//  - 다리처럼 길이가 정해진 부분이 있는 길에서 그 길이만큼 먼저 옮겨 두는 것을 못 한다(①31).
// 실력에 둔 까닭: ①은 문제의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ②는 세 단계 넘게 이어 생각해야 풀리는 것이다. 유형마다 적었다.
// 보기를 쓸 때 틀린 보기마다 어떤 잘못에서 나오는지 주석으로 달았다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { lines, N, M, C } = B.kit;
  const { LAB, MINUS, gcd, Q, tx, nb, V, sup, poly, pointAns, plane, rt, sqParts, radText, radAns, ansV, SG, whereOnPlane } = B.kit.mid;
  const {
    UNIT, S06, S07, srcOf, retry, X, Y, XA, YA, X2, Y2, VA, VB, VC, VK, VM, VR, sn, par, J, pt, jw, minus, sq, circ, gcirc, gline, sline, mv,
    MNAME, MIRROR, MIRROR_E, nz, pm, lineAns, circAns, vals, rad, ptsFig
  } = B.kit.m1023;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});
  const KEYS = ['x', 'y', 'o', 'd'];
  const sub = (n) => `<sub>${n}</sub>`;
  const Pn = (n) => 'P' + sub(n);

  // ── f(x, y) = 0 의 그림(꺾인 선)과 보기 그림 ──
  // 꺾인 점 corner 에서 두 방향 dirs 로 뻗는 두 반직선. 모눈 한 칸은 1, 범위는 −4~4.
  const f1 = (v) => Number(v.toFixed(1));
  function bent(o) {
    const lo = -4, hi = 4, u = o.big ? 18 : 12.5, pad = 14, W = pad * 2 + (hi - lo) * u, Hh = W, fs = 12;
    const PX = (v) => f1(pad + (v - lo) * u), PY = (v) => f1(pad + (hi - v) * u);
    let out = '';
    for (let v = lo; v <= hi; v += 1) out += `<line class="mb-gridline" x1="${PX(v)}" y1="${PY(lo)}" x2="${PX(v)}" y2="${PY(hi)}"/><line class="mb-gridline" x1="${PX(lo)}" y1="${PY(v)}" x2="${PX(hi)}" y2="${PY(v)}"/>`;
    out += `<line class="mb-axis" x1="${PX(lo) - 4}" y1="${PY(0)}" x2="${PX(hi) + 5}" y2="${PY(0)}"/><path d="M${PX(hi) + 10} ${PY(0)}l-6 -3v6z" style="fill:#1f2933"/>`
      + `<line class="mb-axis" x1="${PX(0)}" y1="${PY(lo) + 4}" x2="${PX(0)}" y2="${PY(hi) - 5}"/><path d="M${PX(0)} ${PY(hi) - 10}l-3 6h6z" style="fill:#1f2933"/>`;
    const [cx, cy] = o.corner, rays = o.dirs.map(([dx, dy]) => { let t = 99; if (dx) t = Math.min(t, ((dx > 0 ? hi : lo) - cx) / dx); if (dy) t = Math.min(t, ((dy > 0 ? hi : lo) - cy) / dy); return [cx + dx * t, cy + dy * t]; });
    // 글을 피해 놓을 선(꺾인 선, 점선, 두 축)
    const segs = [[PX(rays[0][0]), PY(rays[0][1]), PX(cx), PY(cy)], [PX(cx), PY(cy), PX(rays[1][0]), PY(rays[1][1])]];
    if (cx !== 0) { out += `<line x1="${PX(cx)}" y1="${PY(cy)}" x2="${PX(cx)}" y2="${PY(0)}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/>`; segs.push([PX(cx), PY(cy), PX(cx), PY(0)]); }
    if (cy !== 0) { out += `<line x1="${PX(cx)}" y1="${PY(cy)}" x2="${PX(0)}" y2="${PY(cy)}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/>`; segs.push([PX(cx), PY(cy), PX(0), PY(cy)]); }
    segs.push([PX(lo), PY(0), PX(hi), PY(0)], [PX(0), PY(lo), PX(0), PY(hi)]);
    out += `<path d="M${PX(rays[0][0])} ${PY(rays[0][1])}L${PX(cx)} ${PY(cy)}L${PX(rays[1][0])} ${PY(rays[1][1])}" style="fill:none;stroke:#1d4ed8;stroke-width:2;stroke-linejoin:round"/>`;
    const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
    // 글 상자(가운데, 반 너비, 반 높이)와 선분 사이의 거리
    const toSeg = (x, y, [x1, y1, x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - x1 - t * dx, y - y1 - t * dy); };
    const boxes = [];
    const room = (bx, by, w, h) => { let m = 99; for (const sg of segs) for (const sx of [-1, 0, 1]) for (const sy of [-1, 0, 1]) m = Math.min(m, toSeg(bx + sx * w, by + sy * h, sg)); for (const [ox, oy, ow, oh] of boxes) m = Math.min(m, Math.max(Math.abs(ox - bx) - ow - w, Math.abs(oy - by) - oh - h)); return m; };
    // 후보 자리 [x, y(글자 밑선), anchor] 가운데 선·다른 글에서 가장 먼 곳(4px 넘으면 그 자리)
    function place(t, cands) {
      const w = String(t).length * fs * 0.3 + 1, h = fs * 0.4; let best = null;
      for (const [x, y, an] of cands) {
        const bx = an === 'middle' ? x : an === 'end' ? x - w : x + w, by = y - fs * 0.35, sc = room(bx, by, w, h);
        if (!best || sc > best.sc + 0.01) best = { sc, x, y, an, bx, by };
        if (sc >= 4) break;
      }
      boxes.push([best.bx, best.by, w, h]);
      out += `<text x="${f1(best.x)}" y="${f1(best.y)}" text-anchor="${best.an}" style="font-size:${fs}px;font-weight:600;fill:#1f2933;${HALO}">${t}</text>`;
    }
    const ox = PX(0), oy = PY(0);
    if (cx !== 0) place(sn(cx), [[PX(cx), oy + 13, 'middle'], [PX(cx), oy - 4, 'middle'], [PX(cx) + 4, oy + 13, 'start'], [PX(cx) - 4, oy + 13, 'end'], [PX(cx) + 4, oy - 4, 'start'], [PX(cx) - 4, oy - 4, 'end']]);
    if (cy !== 0) place(sn(cy), [[ox - 4, PY(cy) + 4, 'end'], [ox + 4, PY(cy) + 4, 'start'], [ox - 4, PY(cy) - 3, 'end'], [ox + 4, PY(cy) - 3, 'start'], [ox - 4, PY(cy) + 12, 'end'], [ox + 4, PY(cy) + 12, 'start']]);
    place('O', [[ox - 7, oy + 13, 'middle'], [ox + 7, oy + 13, 'middle'], [ox - 7, oy - 4, 'middle'], [ox + 7, oy - 4, 'middle']]);
    out += `<circle cx="${PX(cx)}" cy="${PY(cy)}" r="2.4" style="fill:#1d4ed8"/>`;
    const dirWord = ([dx, dy]) => (dy === 0 ? (dx > 0 ? '오른쪽' : '왼쪽') + '으로 x축과 나란하게' : dx === 0 ? (dy > 0 ? '위쪽' : '아래쪽') + '으로 y축과 나란하게' : (dx > 0 ? '오른쪽 ' : '왼쪽 ') + (dy > 0 ? '위' : '아래') + `로 기울기 ${sn(dy / dx)}인 방향으로`);
    const said = `그림 ${o.name}: 모눈 한 칸은 1이다. 꺾인 선이 ${whereOnPlane(cx, cy)}에서 꺾여, 한쪽은 ${dirWord(o.dirs[0])}, 다른 쪽은 ${dirWord(o.dirs[1])} 끝없이 뻗는다.`;
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W + 6)} ${f1(Hh)}" width="${Math.round(W + 6)}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 작은 그림 넷을 두 줄로 놓고 이름(㉠~㉣)을 단다.
  const picks = (figs) => '<div style="display:grid;grid-template-columns:repeat(2,max-content);gap:8px 14px">' + figs.map((h, i) => `<div style="display:grid;gap:1px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${LAB[i]}</div>${h}</div>`).join('') + '</div>';
  // 그림(꺾인 점과 두 방향)에 점의 옮김(선형 부분 L, 평행이동 s)을 한다.
  const applyBent = (g, L, s) => ({ corner: [L(g.corner)[0] + s[0], L(g.corner)[1] + s[1]], dirs: g.dirs.map((v) => L(v)) });
  const sameBent = (g, h) => g.corner.join() === h.corner.join() && g.dirs.map((v) => v.join()).sort().join('|') === h.dirs.map((v) => v.join()).sort().join('|');

  const hardTypes = [
    // ① 원점 대칭 뒤 y축 대칭은 x축 대칭이라 넷마다 처음으로 돌아온다(y = x 가 끼면 여덟마다). 몇 개를 직접 옮겨 보고 되풀이를 찾아야 한다.
    H('hard-cycle', '대칭이동을 번갈아 되풀이한 점', '②8', (d) => {
      const [k1, k2] = d.pick([['o', 'y'], ['o', 'x'], ['y', 'o'], ['x', 'o'], ['x', 'y'], ['x', 'd'], ['d', 'x'], ['d', 'y'], ['y', 'd'], ['d', 'o'], ['o', 'd']]), x = nz(d, -6, 6), y = nz(d, -6, 6);
      if (Math.abs(x) === Math.abs(y)) return null;
      const seq = [[x, y]], E = [[J(x), J(y)]];
      for (let i = 1; i < 9; i += 1) { const k = i % 2 === 1 ? k1 : k2; seq.push(MIRROR[k](seq[i - 1])); E.push(MIRROR_E[k](E[i - 1])); }
      let per = 1; while (per < 9 && seq[per].join() !== seq[0].join()) per += 1;
      if (per >= 9) return null;
      const Nn = d.int(30, 2050), r = (Nn - 1) % per, [u, v] = seq[r];
      return pointAns(`점 ${jw(nb(`${Pn(1)}(${sn(x)}, ${sn(y)})`), '을/를')} ${MNAME[k1]}에 대하여 대칭이동한 점을 ${Pn(2)}, 점 ${Pn(2)}를 ${MNAME[k2]}에 대하여 대칭이동한 점을 ${Pn(3)}이라 하자. 다시 점 ${Pn(3)}을 ${MNAME[k1]}에 대하여 대칭이동한 점을 ${Pn(4)}, 점 ${Pn(4)}를 ${MNAME[k2]}에 대하여 대칭이동한 점을 ${Pn(5)}라 하자. 이와 같이 두 대칭이동을 번갈아 하여 얻은 점을 차례로 ${Pn(6)}, ${Pn(7)}, …이라 할 때, 점 ${Pn(Nn)}의 좌표는?`, u, v, {
        explain: `${seq.slice(0, per + 1).map((p, i) => Pn(i + 1) + pt(p[0], p[1])).join(', ')}이므로 ${per}개마다 처음 점으로 돌아온다. ${nb(`${Nn} = ${per} × ${(Nn - 1 - r) / per} + ${r + 1}`)}이므로 ${jw(Pn(Nn), '은/는')} ${jw(Pn(r + 1), '과/와')} 같은 ${pt(u, v)}이다.`,
        facts: { calc: [[E[r][0], 0], [E[r][1], 1]] }
      });
    }),
    // ① 대칭이동해도 그대로인 도형을 고른다. 틀린 보기: 축(거울)과 나란한 직선, 거울 위에 있지 않은 중심, 기울기만 그럴듯한 직선.
    H('hard-self-sym', '대칭이동해도 바뀌지 않는 도형', '②13', (d) => {
      const k = d.pick(KEYS), c = nz(d, -4, 4), c2 = nz(d, -4, 4), r2 = d.int(2, 9), m = pm(d) * d.int(2, 3);
      if (Math.abs(c) === Math.abs(c2)) return null;
      const line = (mm, bb) => sline(mm, bb), vline = (cc) => nb(`${X} = ${sn(cc)}`), hline = (cc) => nb(`${Y} = ${sn(cc)}`);
      let yes, no, why;
      if (k === 'd') {
        yes = d.pick([`원 ${circ(c, c, r2)}`, `직선 ${line(-1, c)}`]);
        no = [`원 ${circ(c, -c, r2)}`, /* 중심이 y = −x 위 — 거울을 헷갈림 */ `직선 ${line(1, c)}`, /* 거울과 나란함 — 옮기면 y = x − c */ `직선 ${line(m, 0)}`, /* 원점을 지나지만 기울기가 역수로 바뀜 */ `원 ${circ(c, c2, r2)}`];
        why = `직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동하면 ${X}와 ${Y}가 맞바뀐다. 그대로인 것은 중심이 직선 ${nb(`${Y} = ${X}`)} 위에 있는 원과 기울기가 ${MINUS}1인 직선이다. ${nb(`${Y} = ${X} + ${VK}`)} 꼴의 직선은 ${nb(`${Y} = ${X} ${MINUS} ${VK}`)}로 바뀐다.`;
      } else if (k === 'x') {
        yes = d.pick([`원 ${circ(c, 0, r2)}`, `직선 ${vline(c)}`]);
        no = [`원 ${circ(c, c2, r2)}`, /* 중심이 x축 밖 */ `직선 ${hline(c)}`, /* 거울과 나란한 직선은 y = −c 로 */ `직선 ${line(m, 0)}`, /* 원점을 지나도 기울기의 부호가 바뀜 */ `원 ${circ(0, c, r2)}` /* 중심이 y축 위 — 거울을 헷갈림 */];
        why = `${XA}에 대하여 대칭이동하면 ${Y}의 부호만 바뀐다. 그대로인 것은 중심이 ${XA} 위에 있는 원과 ${XA}에 수직인 직선이다.`;
      } else if (k === 'y') {
        yes = d.pick([`원 ${circ(0, c, r2)}`, `직선 ${hline(c)}`]);
        no = [`원 ${circ(c, c2, r2)}`, `직선 ${vline(c)}`, /* 거울과 나란한 직선은 x = −c 로 */ `직선 ${line(m, c2)}`, /* 기울기의 부호가 바뀜 */ `원 ${circ(c, 0, r2)}` /* 중심이 x축 위 — 거울을 헷갈림 */];
        why = `${YA}에 대하여 대칭이동하면 ${X}의 부호만 바뀐다. 그대로인 것은 중심이 ${YA} 위에 있는 원과 ${YA}에 수직인 직선이다.`;
      } else {
        yes = d.pick([`원 ${nb(`${X2} + ${Y2} = ${r2}`)}`, `직선 ${line(m, 0)}`]);
        no = [`원 ${circ(c, 0, r2)}`, /* 중심이 원점이 아님 */ `직선 ${line(m, c2)}`, /* 원점을 지나지 않으면 y절편의 부호가 바뀜 */ `원 ${circ(0, c, r2)}`, `직선 ${vline(c)}` /* x = −c 로 */];
        why = `원점에 대하여 대칭이동하면 ${X}와 ${Y}의 부호가 모두 바뀐다. 그대로인 것은 중심이 원점인 원과 원점을 지나는 직선이다.`;
      }
      const opts = [yes].concat(d.shuffle(no).slice(0, 3)), order = d.shuffle([0, 1, 2, 3]);
      if (new Set(opts).size !== 4) return null;
      return C(`다음 중 ${MNAME[k]}에 대하여 대칭이동한 도형이 처음 도형과 같은 것은?`, order.map((i) => opts[i]), order.indexOf(0), {
        explain: `${why} 따라서 답은 ${yes}이다.`,
        facts: { truth: order.map((i) => i === 0), want: true }
      });
    }),
    // ① f(x + a, −y) = 0 은 x축 대칭 뒤 x축 방향으로 −a, f(y + b, x) = 0 은 y = x 대칭 뒤 y축 방향으로 −b. 부호와 차례를 정확히 대야 한다.
    H('hard-fxy', 'f(x, y) = 0의 그림에서 옮긴 도형 고르기', '②34', (d) => {
      const g = { corner: [d.int(-1, 1), d.pick([-2, -1, 1, 2])], dirs: [[-1, 0], [1, d.pick([1, -1])]] }, kind = d.int(0, 1), s = nz(d, -2, 2);
      // 맞는 옮김과 틀린 옮김(점 (u, v) 가 옮겨 가는 곳)
      const maps = kind === 0
        ? [[([u, v]) => [u, -v], [-s, 0]], /* 바름: f(x + s, −y) = 0 */ [([u, v]) => [u, -v], [s, 0]], /* 옮기는 쪽을 거꾸로 */ [([u, v]) => [u, v], [-s, 0]], /* x축 대칭을 빠뜨림 */ [([u, v]) => [-u, v], [-s, 0]] /* y축 대칭으로 착각 */]
        : [[([u, v]) => [v, u], [0, -s]], /* 바름: f(y + s, x) = 0 */ [([u, v]) => [v, u], [0, s]], /* 옮기는 쪽을 거꾸로 */ [([u, v]) => [v, u], [-s, 0]], /* x축 방향으로 옮김 */ [([u, v]) => [u, v], [0, -s]] /* 맞바꾸기를 빠뜨림 */];
      const outs = maps.map(([L, sh]) => applyBent(g, L, sh));
      if (outs.some((h) => Math.abs(h.corner[0]) > 3 || Math.abs(h.corner[1]) > 3)) return null;
      for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) if (sameBent(outs[i], outs[j])) return null;
      const order = d.shuffle([0, 1, 2, 3]), F = V('f');
      const eq = kind === 0 ? nb(`${F}(${X} ${s > 0 ? '+' : MINUS} ${Math.abs(s)}, ${MINUS}${Y}) = 0`) : nb(`${F}(${Y} ${s > 0 ? '+' : MINUS} ${Math.abs(s)}, ${X}) = 0`);
      return C(`방정식 ${nb(`${F}(${X}, ${Y}) = 0`)}이 나타내는 도형이 그림 ㈎와 같을 때, 방정식 ${jw(eq, '이/가')} 나타내는 도형은?`, LAB.slice(0, 4), order.indexOf(0), {
        figure: '<div style="display:grid;gap:6px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">㈎</div>' + bent(Object.assign({ name: '㈎', big: true }, g)) + '</div>' + picks(order.map((i, n) => bent(Object.assign({ name: LAB[n] }, outs[i])))),
        explain: kind === 0
          ? `${eq}은 ${nb(`${F}(${X}, ${Y}) = 0`)}에서 ${Y} 대신 ${MINUS}${Y}(${XA}에 대하여 대칭이동), ${X} 대신 ${nb(`${X} ${s > 0 ? '+' : MINUS} ${Math.abs(s)}`)}(${XA}의 방향으로 ${sn(-s)}만큼 평행이동)를 넣은 것이다. 꺾인 점 ${jw(pt(g.corner[0], g.corner[1]), '은/는')} ${jw(pt(outs[0].corner[0], outs[0].corner[1]), '으로/로')} 옮겨진다.`
          : `${eq}은 ${nb(`${F}(${X}, ${Y}) = 0`)}을 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 ${nb(`${F}(${Y}, ${X}) = 0`)}에서 ${Y} 대신 ${nb(`${Y} ${s > 0 ? '+' : MINUS} ${Math.abs(s)}`)}(${YA}의 방향으로 ${sn(-s)}만큼 평행이동)를 넣은 것이다. 꺾인 점 ${jw(pt(g.corner[0], g.corner[1]), '은/는')} ${jw(pt(outs[0].corner[0], outs[0].corner[1]), '으로/로')} 옮겨진다.`,
        facts: { truth: order.map((i) => i === 0), want: true }
      });
    }),
    // ① 거울이 둘(y축과 직선 y = x): A 는 y축에, B 는 y = x 에 대칭이동해야 한다. 한 가지 대칭만 쓰면 틀린다.
    H('hard-two-mirrors', 'y축과 직선 y = x를 거쳐 가는 꺾인 길', '②40', (d) => {
      const xa = d.int(1, 5), ya = xa + d.int(2, 6), xb = d.int(1, 7), yb = xb + d.int(1, 5), A2 = [-xa, ya], B2 = [yb, xb], D2 = (B2[0] - A2[0]) ** 2 + (B2[1] - A2[1]) ** 2, [cf, rd] = sqParts(D2);
      if (cf < 2 || rd < 2 || (xa === xb && ya === yb)) return null;
      // A′B′ 이 y축과 만나는 점 C(위쪽), 그다음 y = x 와 만나는 점 D(제1사분면)
      const tC = xa / (B2[0] - A2[0]), yC = A2[1] + tC * (B2[1] - A2[1]), den = (B2[0] - A2[0]) - (B2[1] - A2[1]), tD = (A2[1] - A2[0]) / den;
      if (!(yC > 0 && den !== 0 && tD > tC && tD < 1)) return null;
      return radAns(`두 점 A${pt(xa, ya)}, B${jw(pt(xb, yb), '과/와')} ${YA} 위의 점 C, 직선 ${nb(`${Y} = ${X}`)} 위의 점 D에 대하여 ${SG('AC')} + ${SG('CD')} + ${SG('DB')}의 최솟값은?`, cf, rd, {
        figure: ptsFig([['A', [xa, ya]], ['B', [xb, yb]]], { diag: true, square: true }),
        explain: `A를 ${YA}에 대하여 대칭이동한 점 A′${pt(-xa, ya)}, B를 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 점 B′${jw(pt(yb, xb), '을/를')} 잡으면 ${nb(`${SG('AC')} + ${SG('CD')} + ${SG('DB')} = ${SG('A′C')} + ${SG('CD')} + ${SG('DB′')} ≥ ${SG('A′B′')}`)}이다. ${nb(`${SG('A′B′')} = ${rt(`${B2[0] - A2[0]}${sup(2)} + ${Math.abs(B2[1] - A2[1])}${sup(2)}`)} = ${radText(cf, rd)}`)}이다.`,
        facts: { calc: [[`${cf}`, 0], [`${rd}`, 1]], derived: [cf, rd] }
      });
    }),
    // ① 둘레에는 정해진 변 AB 가 늘 들어 있다. 거리의 합 AP + BP 만 구하면 틀린다.
    H('hard-perimeter', '한 변이 정해진 삼각형의 둘레의 최솟값', '②41', (d) => {
      const k = d.pick(['d', 'x']), xa = d.int(-3, 6), xb = d.int(-3, 6);
      const ya = k === 'd' ? xa - d.int(1, 4) : d.int(1, 6), yb = k === 'd' ? xb - d.int(1, 4) : d.int(1, 6);
      const Bp = k === 'd' ? [yb, xb] : [xb, -yb], s1 = (xb - xa) ** 2 + (yb - ya) ** 2, s2 = (Bp[0] - xa) ** 2 + (Bp[1] - ya) ** 2;
      const [m1, p1] = sqParts(s1), [m2, p2] = sqParts(s2);
      if (s1 === 0 || p1 < 2 || p2 < 2 || p1 === p2) return null;
      if (m1 === 1 && m2 === 1 && d.int(0, 2) > 0) return null;   // 둘 다 1인 답이 너무 잦지 않게
      const mirror = k === 'd' ? `직선 ${nb(`${Y} = ${X}`)}` : XA;
      return vals(`두 점 A${pt(xa, ya)}, B${jw(pt(xb, yb), '과/와')} ${mirror} 위의 점 P에 대하여 삼각형 PAB의 둘레의 길이의 최솟값이 ${nb(`${VM}${rt(p1)} + ${V('n')}${rt(p2)}`)}일 때, 자연수 ${VM}, ${V('n')}의 값은?`, [[VM, m1, true], [V('n'), m2, true]], {
        figure: ptsFig([['A', [xa, ya]], ['B', [xb, yb]]], { diag: k === 'd', square: k === 'd' }),
        explain: `B를 ${mirror}에 대하여 대칭이동한 점을 B′${jw(pt(Bp[0], Bp[1]), '이라/라')} 하면 ${nb(`${SG('PB')} = ${SG('PB′')}`)}이다. 둘레는 ${nb(`${SG('AB')} + ${SG('PA')} + ${SG('PB′')} ≥ ${SG('AB')} + ${SG('AB′')}`)}이고 ${nb(`${SG('AB')} = ${radText(m1, p1)}`)}, ${nb(`${SG('AB′')} = ${radText(m2, p2)}`)}이므로 ${nb(`${VM} = ${m1}`)}, ${nb(`${V('n')} = ${m2}`)}이다. 정해진 변 AB를 빠뜨리지 않는다.`,
        facts: { calc: [[`${m1}`, 0], [`${m2}`, 1]], derived: [m1, m2] }
      });
    }),
    // ① 근호 두 개의 합을 두 점까지의 거리의 합으로 읽어야 대칭이동을 쓸 수 있다.
    H('hard-sqrt-sum', '근호 두 개의 합을 거리의 합으로 읽어 최솟값 구하기', '②42', (d) => {
      const [dx, dy] = d.pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [9, 12]]), a = d.int(-4, 4), b = d.int(1, dy - 1), e = dy - b, c = a + pm(d) * dx;
      if (b === e || Math.abs(c) > 12) return null;
      const D = Math.sqrt(dx * dx + dy * dy), term = (h, k) => rt(`${sq(X, h)} + ${k * k}`);
      return N(`실수 ${X}에 대하여 ${nb(`${term(a, b)} + ${term(c, e)}`)}의 최솟값은?`, D, {
        explain: `A${pt(a, b)}, B${pt(c, e)}, P${nb(`(${X}, 0)`)}이라 하면 주어진 식은 ${nb(`${SG('AP')} + ${SG('BP')}`)}이다. A를 ${XA}에 대하여 대칭이동한 점 A′${jw(pt(a, -b), '을/를')} 잡으면 ${nb(`${SG('AP')} + ${SG('BP')} = ${SG('A′P')} + ${SG('BP')} ≥ ${SG('A′B')} = ${rt(`${dx}${sup(2)} + ${dy}${sup(2)}`)} = ${D}`)}이다.`,
        facts: { calc: [[`${D}`, 0]], derived: [D] }
      });
    }),
    // ① 다리의 길이는 정해져 있으므로 그 길이만큼 A 를 먼저 옮겨 두고 잇는다. 그냥 A, B 를 이으면 다리가 수직이 아니다.
    H('hard-bridge', '강에 수직으로 놓는 다리 — 평행이동으로 구하는 가장 짧은 길', '①31', (d) => {
      const w = d.int(1, 2), xa = d.int(-4, 8), ya = w + d.int(2, 6), xb = d.int(-4, 8), yb = -d.int(1, 6), top = (xa - xb) * (-yb), bot = ya - w - yb;
      if (xa === xb || top % bot !== 0) return null;
      const xd = xb + top / bot;
      if (xd === 0 || xd === xa || xd === xb) return null;
      return N(`폭이 ${w} km인 강을 사이에 두고 두 마을 A, B가 있다. 한쪽 강변을 ${XA}, 다른 쪽 강변을 직선 ${jw(nb(`${Y} = ${w}`), '으로/로')} 잡은 좌표평면에서 A${pt(xa, ya)}, B${pt(xb, yb)}이다(좌표의 단위는 km). A에서 B까지 가는 길이 가장 짧도록 강에 수직인 다리 CD를 놓으려고 한다. 다리의 두 끝 가운데 ${XA} 위의 끝을 D라 할 때, 점 D의 ${X}좌표는? (단, 다리의 폭은 생각하지 않는다.)`, xd, {
        signed: true,
        figure: ptsFig([['A', [xa, ya]], ['B', [xb, yb]]], { hline: w }),
        explain: `다리의 길이는 늘 ${w} km이므로 ${nb(`${SG('AC')} + ${SG('DB')}`)}가 가장 짧으면 된다. A를 ${YA}의 방향으로 ${sn(-w)}만큼 평행이동한 점 A′${jw(pt(xa, ya - w), '을/를')} 잡으면 ${nb(`${SG('AC')} = ${SG('A′D')}`)}이므로 D가 직선 A′B 위에 있을 때 가장 짧다. 직선 A′B와 ${XA}의 교점의 ${X}좌표는 ${sn(xd)}이다.`,
        facts: { calc: [[`${J(xb)}+(${J(xa)}-${J(xb)})*(0-${J(yb)})/(${ya}-${w}-${J(yb)})`, 0]] }
      });
    }),
    // ② 네 단계: 두 꼭짓점 → 이동의 양 → 직선 옮기기 → 평행한 두 직선 사이의 거리
    H('hard-curve-dist', '곡선을 곡선으로 옮기는 평행이동으로 직선을 옮기고 두 직선 사이의 거리', '①20', (d) => {
      const [p, q] = d.pick([[2, -1], [2, 1], [1, 2], [1, -2], [3, 1], [3, -1], [1, 3], [1, -3]]), S = p * p + q * q;
      const h1 = d.int(-3, 3), k1 = d.int(-4, 4), a = nz(d, -5, 5), b = nz(d, -5, 5), h2 = h1 + a, k2 = k1 + b, r = d.pick([0, 0, nz(d, -6, 6)]);
      const shift = p * a + q * b, kk = Math.abs(shift) / S;
      if (!Number.isInteger(kk) || kk < 2) return null;
      const curve = (h, k) => nb(`${Y} = ${poly([[1, X2], [-2 * h, X], [h * h + k, '']])}`), r2 = r - p * a - q * b;
      return radAns(`좌표평면에서 곡선 ${jw(curve(h1, k1), '을/를')} 곡선 ${jw(curve(h2, k2), '으로/로')} 옮기는 평행이동에 의하여 직선 ${V('l')}: ${jw(gline([p, q, r]), '이/가')} 직선 ${V('l')}′로 옮겨질 때, 두 직선 ${V('l')}, ${V('l')}′ 사이의 거리는?`, kk, S, {
        explain: `두 곡선의 꼭짓점은 ${pt(h1, k1)}, ${pt(h2, k2)}이므로 ${mv(a, b)} 옮기는 평행이동이다. ${V('l')}′: ${gline([p, q, r2])}이고, 두 직선 사이의 거리는 ${V('l')} 위의 한 점과 ${V('l')}′ 사이의 거리이므로 ${nb(`${Math.abs(shift)} ÷ ${rt(S)} = ${radText(kk, S)}`)}이다.`,
        facts: { calc: [[`${kk}`, 0], [`${J(p)}*${J(p)}+${J(q)}*${J(q)}`, 1]], derived: [kk] }
      });
    }),
    // ② 네 단계: 옮긴 식 → 중심과 직선 사이의 거리 = 반지름 → 제곱하여 이차방정식 → 0이 아닌 근
    H('hard-tangent-slope', '평행이동한 직선이 원에 접할 때의 기울기', '①23', (d) => {
      const c0 = nz(d, -4, 4), a = nz(d, -4, 4), b = nz(d, -4, 4), r = d.int(1, 3), h = d.int(-4, 5), be = pm(d) * r, v = b + c0 - be, al = h - a;
      if (al * al === r * r || v === 0) return null;
      const kv = Q(-2 * al * be, al * al - r * r);
      if (kv.q === 1 || kv.q > 40 || Math.abs(kv.p) > 120) return null;
      return ansV(`직선 ${jw(nb(`${Y} = ${VK}${X} ${c0 < 0 ? MINUS : '+'} ${Math.abs(c0)}`), '을/를')} ${mv(a, b)} 평행이동한 직선이 원 ${circ(h, v, r * r)}에 접할 때, 0이 아닌 상수 ${VK}의 값은?`, kv, 'frac', {
        explain: `옮긴 직선은 ${nb(`${minus(Y, b)} = ${VK}(${minus(X, a)}) ${c0 < 0 ? MINUS : '+'} ${Math.abs(c0)}`)}, 곧 ${nb(poly([[1, VK + X], [-1, Y], [-a, VK], [b + c0, '']]) + ' = 0')}이다. 중심 ${jw(pt(h, v), '과/와')} 이 직선 사이의 거리가 ${r}이므로 ${nb(`(${poly([[al, VK], [be, '']])})${sup(2)} = ${r * r === 1 ? '' : r * r}${r * r === 1 ? '' : '('}${VK}${sup(2)} + 1${r * r === 1 ? '' : ')'}`)}이다. 정리하면 ${nb(`${VK} = 0`)} 또는 ${nb(`${VK} = ${tx(kv)}`)}이고, 0이 아닌 것은 ${tx(kv)}이다.`,
        facts: { value: `(0-2*(${J(h)}-${J(a)})*(${J(b)}+${J(c0)}-${J(v)}))/((${J(h)}-${J(a)})*(${J(h)}-${J(a)})-${r}*${r})`, derived: [2, r] }
      });
    }),
    // ② 네 단계: 옮긴 두 점 → 수직 조건(내적 또는 피타고라스 정리) → a, b 의 관계식 → y절편
    H('hard-right-locus', '평행이동한 두 점과 한 점이 직각삼각형을 이룰 때 (a, b)가 그리는 도형', '①29', (d) => {
      const x1 = d.int(-3, 3), y1 = d.int(-3, 3), x2 = x1 + nz(d, -3, 3), y2 = y1 + nz(d, -3, 3), cx = d.int(-4, 4), cy = d.int(-4, 4), dx = x2 - x1, dy = y2 - y1;
      const K = dx * (cx - x1) + dy * (cy - y1);
      if (K % dy !== 0 || K === 0) return null;
      const yi = K / dy;
      return N(`두 점 ${pt(x1, y1)}, ${jw(pt(x2, y2), '을/를')} ${XA}의 방향으로 ${VA}만큼, ${YA}의 방향으로 ${VB}만큼 평행이동한 점을 각각 A, B라 하자. 점 C${pt(cx, cy)}에 대하여 삼각형 ABC가 ∠A = 90°인 직각삼각형일 때, 점 ${nb(`(${VA}, ${VB})`)}가 나타내는 도형의 ${Y}절편은?`, yi, {
        signed: true,
        explain: `A${nb(`(${minus(VA, -x1)}, ${minus(VB, -y1)})`)}, B${nb(`(${minus(VA, -x2)}, ${minus(VB, -y2)})`)}이다. ∠A = 90°이므로 피타고라스 정리에 의하여 ${nb(`${SG('AB')}${sup(2)} + ${SG('AC')}${sup(2)} = ${SG('BC')}${sup(2)}`)}이고, ${nb(`${SG('AB')}${sup(2)} = ${dx * dx + dy * dy}`)}이다. 두 점 사이의 거리의 제곱을 ${VA}, ${VB}로 나타내어 정리하면 ${VA}${sup(2)}, ${VB}${sup(2)}이 지워지고 ${jw(nb(`${poly([[dx, VA], [dy, VB]])} = ${sn(K)}`), '이/가')} 남는다. 점 ${nb(`(${VA}, ${VB})`)}는 이 직선 위에 있고 그 ${Y}절편은 ${sn(yi)}이다.`,
        facts: { calc: [[`((${J(x2)}-${J(x1)})*(${J(cx)}-${J(x1)})+(${J(y2)}-${J(y1)})*(${J(cy)}-${J(y1)}))/(${J(y2)}-${J(y1)})`, 0]] }
      });
    }),
    // ② 네 단계: 옮긴 점 → 수직이등분선 → 중심을 한 문자로 → 반지름으로 두 중심을 구해 조건으로 가리기
    H('hard-circle-through', '한 점과 그 점을 평행이동한 점을 지나는 원', '①30', (d) => {
      const R2 = d.pick([5, 10, 13, 16, 17, 20, 25]), cx = nz(d, -4, 4), cy = nz(d, -4, 4), pts = [];
      for (let u = -5; u <= 5; u += 1) for (let v = -5; v <= 5; v += 1) if (u * u + v * v === R2) pts.push([cx + u, cy + v]);
      const [P, Qp] = d.shuffle(pts).slice(0, 2);
      if (!P || !Qp) return null;
      const a = Qp[0] - P[0], b = Qp[1] - P[1];
      if (a === 0 || b === 0 || (P[0] + Qp[0] === 2 * cx && P[1] + Qp[1] === 2 * cy)) return null;
      const C2 = [P[0] + Qp[0] - cx, P[1] + Qp[1] - cy], byX = d.bool(), mine = byX ? cx : cy, other = byX ? C2[0] : C2[1];
      if (Math.sign(mine) === Math.sign(other) || other === 0) return null;
      const cond = `원의 중심의 ${byX ? X : Y}좌표는 ${mine < 0 ? '음수' : '양수'}이다`, condPick = `중심의 ${byX ? X : Y}좌표가 ${mine < 0 ? '음수' : '양수'}인`;
      return circAns(`점 P${jw(pt(P[0], P[1]), '을/를')} ${mv(a, b)} 평행이동한 점을 Q라 하자. 두 점 P, Q를 지나고 반지름의 길이가 ${rad(R2)}인 원의 방정식을 구하시오. (단, ${cond}.)`, cx, cy, R2, {
        explain: `Q${pt(Qp[0], Qp[1])}이다. 원의 중심은 선분 PQ의 수직이등분선 위에 있고, 중심까지의 거리가 ${rad(R2)}인 점은 ${pt(cx, cy)}, ${pt(C2[0], C2[1])}이다. ${condPick} 것은 ${pt(cx, cy)}이므로 ${circ(cx, cy, R2)}이다.`,
        facts: { calc: [[J(-cx), 0], [J(-cy), 1], [`${R2}`, 2]], derived: [Math.abs(cx), Math.abs(cy), R2] }
      });
    }),
    // ② 네 단계: 대칭이동한 중심 → x축까지의 거리 → 반 현의 길이 → 피타고라스 정리
    H('hard-chord', '대칭이동한 원이 x축에서 자르는 현의 길이', '②19', (d) => {
      const k = d.pick(KEYS), ka = d.pick([-1, 1, -2, 2, 3]), a = d.int(1, 4), s = d.pick([2, 3, 5, 6, 7]);
      const [u, v] = MIRROR[k]([a, ka * a]), t = Math.abs(v), R2 = t * t + s;
      if (t === 0 || R2 > 120) return null;
      const yPart = ka === 1 ? `(${Y} ${MINUS} ${VA})` : ka === -1 ? `(${Y} + ${VA})` : `(${Y} ${ka > 0 ? MINUS : '+'} ${Math.abs(ka)}${VA})`;
      return N(`원 ${jw(nb(`(${X} ${MINUS} ${VA})${sup(2)} + ${yPart}${sup(2)} = ${R2}`), '을/를')} ${MNAME[k]}에 대하여 대칭이동한 원이 ${XA}과 서로 다른 두 점 A, B에서 만난다. 선분 AB의 길이가 ${nb('2' + rt(s))}일 때, 양수 ${VA}의 값은?`, a, {
        explain: `대칭이동한 원의 중심의 ${Y}좌표의 절댓값은 ${t === a ? VA : Math.abs(v / a) + VA}이고, 이것이 중심과 ${XA} 사이의 거리이다. 반지름의 길이가 ${rad(R2)}, 선분 AB의 절반이 ${rt(s)}이므로 ${nb(`${t === a ? VA + sup(2) : '(' + Math.abs(v / a) + VA + ')' + sup(2)} + ${s} = ${R2}`)}, 곧 ${nb(`${VA} = ${a}`)}이다.`,
        facts: { calc: [[`${a}`, 0]], derived: [a] }
      });
    }),
    // ② 네 단계: 표준형 → 원점(또는 다른) 대칭 → 평행이동 → 두 원이 대칭일 조건
    H('hard-mix-sym', '대칭이동한 원과 평행이동한 원이 또 다른 대칭일 때 이동의 양', '②30', (d) => {
      const [m1, m2] = d.shuffle(KEYS).slice(0, 2), h = nz(d, -5, 5), k0 = nz(d, -5, 5), R = d.int(1, 5), Cc = h * h + k0 * k0 - R * R, c1 = MIRROR[m1]([h, k0]), c2 = MIRROR[m2](c1), a = c2[0] - h, b = c2[1] - k0;
      if (Cc === 0 || a === 0 || b === 0) return null;
      const E = MIRROR_E[m2](MIRROR_E[m1]([`(${J(-2 * h)}/(0-2))`, `(${J(-2 * k0)}/(0-2))`]));
      return vals(`원 C${sub(0)}: ${jw(gcirc(-2 * h, -2 * k0, Cc), '을/를')} ${MNAME[m1]}에 대하여 대칭이동한 원을 C${sub(1)}, ${XA}의 방향으로 ${VA}만큼, ${YA}의 방향으로 ${VB}만큼 평행이동한 원을 C${sub(2)}라 하자. 두 원 C${sub(1)}, C${sub(2)}가 ${MNAME[m2]}에 대하여 서로 대칭일 때, 상수 ${VA}, ${VB}의 값은?`, [[VA, a], [VB, b]], {
        explain: `C${sub(0)}의 중심은 ${pt(h, k0)}이고 C${sub(1)}의 중심은 ${pt(c1[0], c1[1])}이다. C${sub(2)}의 중심 ${nb(`(${sn(h)} + ${VA}, ${sn(k0)} + ${VB})`)}는 C${sub(1)}의 중심을 ${MNAME[m2]}에 대하여 대칭이동한 ${jw(pt(c2[0], c2[1]), '과/와')} 같아야 하므로 ${nb(`${VA} = ${sn(a)}`)}, ${nb(`${VB} = ${sn(b)}`)}이다.`,
        facts: { calc: [[`${E[0]}-(${J(-2 * h)}/(0-2))`, 0], [`${E[1]}-(${J(-2 * k0)}/(0-2))`, 1]], derived: [2] }
      });
    }),
    // ② 네 단계: 지나는 점을 거꾸로 옮기기(나중 이동부터) → 처음 직선 위의 두 점 → 기울기 → 식
    H('hard-first-line', '평행이동하고 대칭이동한 직선이 점을 지날 때 처음 직선', '②33', (d) => {
      const k = d.pick(KEYS), a = d.pick([0, nz(d, -4, 4)]), b = nz(d, -4, 4), x0 = d.int(-4, 4), y0 = d.int(-4, 4), Qp = [nz(d, -6, 6), nz(d, -6, 6)];
      const back1 = MIRROR[k](Qp), Qs = [back1[0] - a, back1[1] - b];
      if (Qs[0] === x0) return null;
      const m = (Qs[1] - y0) / (Qs[0] - x0), n = y0 - m * x0;
      if (!Number.isInteger(m) || Math.abs(m) < 2 || n === 0 || Math.abs(n) > 30) return null;
      const E = MIRROR_E[k]([J(Qp[0]), J(Qp[1])]), ex = `(${E[0]}-${J(a)})`, ey = `(${E[1]}-${J(b)})`, mE = `(${ey}-${J(y0)})/(${ex}-${J(x0)})`;
      return lineAns(`점 ${jw(pt(x0, y0), '을/를')} 지나는 직선을 ${mv(a, b)} 평행이동한 다음 ${MNAME[k]}에 대하여 대칭이동하였더니 점 ${jw(pt(Qp[0], Qp[1]), '을/를')} 지났다. 처음 직선의 방정식을 구하시오.`, m, n, {
        explain: `나중 이동부터 거꾸로 한다. ${jw(pt(Qp[0], Qp[1]), '을/를')} ${MNAME[k]}에 대하여 대칭이동하면 ${pt(back1[0], back1[1])}이고, 이것을 거꾸로 ${mv(-a, -b)} 옮기면 ${pt(Qs[0], Qs[1])}이다. 처음 직선은 두 점 ${pt(x0, y0)}, ${jw(pt(Qs[0], Qs[1]), '을/를')} 지나므로 ${sline(m, n)}이다.`,
        facts: { calc: [[mE, 0], [`${J(y0)}-${mE}*${J(x0)}`, 1]] }
      });
    }),
    // ② 네 단계: 두 점을 각각 다른 축에 대칭이동 → 직선 → 두 축과 만나는 점 → 그 사이의 거리
    H('hard-bounce', '두 번 튕기는 공 — 꺾이는 두 점 사이의 거리', '②39', (d) => {
      const p = d.int(1, 4), q = d.int(2, 6), xa = d.int(1, 3), xd = q + d.int(1, 4), ya = Q(p * (q + xa), q), yd = Q(p * (xd - q), q), [cf, rd] = sqParts(p * p + q * q);
      if (cf < 2 || rd < 2 || ya.q > 2 || yd.q > 2) return null;
      const cw = (v) => tx(v), A = nb(`A(${xa}, ${cw(ya)})`), Dp = nb(`D(${xd}, ${cw(yd)})`);
      return radAns(`벽을 ${YA}, 바닥을 ${XA}으로 하는 좌표평면 위의 점 ${A}에서 공을 던져 벽과 바닥에 차례로 한 번씩 부딪힌 다음 점 ${Dp}에 있는 풍선을 맞혔다. 공이 벽과 부딪힌 점을 B, 바닥과 부딪힌 점을 C라 할 때, 선분 BC의 길이는? (단, 공과 풍선의 크기는 생각하지 않으며, 공이 부딪힐 때 들어오는 각과 나가는 각의 크기는 같다.)`, cf, rd, {
        explain: `A를 ${YA}에 대하여 대칭이동한 점 A′${nb(`(${MINUS}${xa}, ${cw(ya)})`)}, D를 ${XA}에 대하여 대칭이동한 점 D′${jw(nb(`(${xd}, ${MINUS}${cw(yd)})`), '을/를')} 잡으면 공의 길은 직선 A′D′ 위에 있다. 이 직선과 ${YA}의 교점이 B${pt(0, p)}, ${XA}의 교점이 C${pt(q, 0)}이므로 ${nb(`${SG('BC')} = ${rt(`${q}${sup(2)} + ${p}${sup(2)}`)} = ${radText(cf, rd)}`)}이다.`,
        facts: { calc: [[`${cf}`, 0], [`${rd}`, 1]], derived: [cf, rd] }
      });
    }),
    // ② 네 단계: 맞바꾼 두 점 → AP ∥ BQ 라 두 삼각형이 닮음 → 넓이의 비에서 닮음비 → 거리의 비로 k
    H('hard-ratio', 'y = x에 대하여 대칭인 점으로 만든 두 삼각형의 넓이의 비', '②43', (d) => {
      const m = d.int(2, 7), p = d.int(1, 6), q = p - d.int(1, 4), [s, t] = d.pick([[2, 3], [3, 2], [1, 2], [2, 1], [3, 4], [4, 3], [1, 3], [3, 1]]);
      // A, B 는 모두 직선 y = x 의 아래쪽(y < x): k = m − s(p − q)/t
      const kv = Q(m * t - s * (p - q), t);
      if (kv.q === 1 || (p === m)) return null;
      return ansV(`두 점 A${nb(`(${m}, ${VK})`)}, B${jw(pt(p, q), '을/를')} 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동한 점을 각각 P, Q라 하고, 두 선분 AQ, BP의 교점을 R라 하자. 두 삼각형 ARP, QRB의 넓이의 비가 ${s * s} : ${t * t}일 때, 상수 ${VK}의 값은? (단, ${nb(`${VK} &lt; ${m}`)})`, kv, 'frac', {
        explain: `P${nb(`(${VK}, ${m})`)}, Q${pt(q, p)}이다. 선분 AP와 BQ는 모두 직선 ${nb(`${Y} = ${X}`)}에 수직이므로 평행하고, 삼각형 ARP와 QRB는 닮음이다. 넓이의 비가 ${s * s} : ${t * t}이므로 닮음비는 ${s} : ${t}, 곧 ${nb(`${SG('AP')} : ${SG('QB')} = ${s} : ${t}`)}이다. ${nb(`${SG('AP')} = ${rt(2)}(${m} ${MINUS} ${VK})`)}, ${nb(`${SG('QB')} = ${radText(p - q, 2)}`)}이므로 ${nb(`${m} ${MINUS} ${VK} = ${tx(Q(s * (p - q), t))}`)}, 곧 ${nb(`${VK} = ${tx(kv)}`)}이다.`,
        facts: { value: `${m}-${s}*(${J(p)}-${J(q)})/${t}`, derived: [s, t] }
      });
    }),
    // ② 네 단계: A 를 x축에 대칭이동 → 원의 중심까지 잇기 → 거리 → 반지름 빼기
    H('hard-circle-path', 'x축 위의 점을 거쳐 원 위의 점까지 가는 거리의 최솟값', '심2', (d) => {
      const [dx0, dy0] = d.pick([[6, 8], [8, 6], [5, 12], [12, 5], [8, 15], [3, 4], [4, 3]]), r = d.int(1, 3), kc = r + d.int(1, 4), ya = dy0 - kc, xa = d.int(-3, 3), h = xa + pm(d) * dx0;
      if (ya < 1 || Math.abs(h) > 12) return null;
      const D = Math.sqrt(dx0 * dx0 + dy0 * dy0);
      return N(`원 ${circ(h, -kc, r * r)} 위의 점 P, ${XA} 위의 점 Q와 점 A${pt(xa, -ya)}에 대하여 ${nb(`${SG('AQ')} + ${SG('QP')}`)}의 최솟값은?`, D - r, {
        explain: `A를 ${XA}에 대하여 대칭이동한 점 A′${jw(pt(xa, ya), '을/를')} 잡으면 ${nb(`${SG('AQ')} = ${SG('A′Q')}`)}이다. 원의 중심을 C${jw(pt(h, -kc), '이라/라')} 하면 ${nb(`${SG('A′Q')} + ${SG('QP')} ≥ ${SG('A′P')} ≥ ${SG('A′C')} ${MINUS} ${r}`)}이고 ${nb(`${SG('A′C')} = ${rt(`${dx0}${sup(2)} + ${dy0}${sup(2)}`)} = ${D}`)}이므로 최솟값은 ${nb(`${D} ${MINUS} ${r} = ${D - r}`)}이다.`,
        facts: { calc: [[`${D}-${r}`, 0]], derived: [D, r] }
      });
    }),
    // ② 네 단계: 수직 조건으로 a → B → 맞바꾸어 C → 직선 AC 의 y절편
    H('hard-perp-sym', 'y = x에 대하여 대칭인 두 점과 수직 조건 — 직선의 y절편', '심3', (d) => {
      const xa = d.int(1, 4) * pm(d), ya = nz(d, -5, 5), yb = nz(d, -6, 6), num = -ya * yb;
      if (num % xa !== 0) return null;
      const a = num / xa, xc = yb, yc = a;
      if (a === 0 || xc === xa || Math.abs(a) > 30) return null;
      const iv = Q(ya * xc - xa * yc, xc - xa);
      if (iv.q === 1 || iv.q > 30 || Math.abs(iv.p) > 200) return null;
      const aE = `(0-${J(ya)}*${J(yb)})/${J(xa)}`;
      return ansV(`좌표평면에서 세 점 A${pt(xa, ya)}, B${nb(`(${VA}, ${sn(yb)})`)}, C${nb(`(${VB}, ${VC})`)}가 다음 조건을 만족시킬 때, 직선 AC의 ${Y}절편은? (단, O는 원점이다.)`, iv, 'frac', {
        figure: lines(['㈎ 두 직선 OA, OB는 서로 수직이다.', `㈏ 두 점 B, C는 직선 ${nb(`${Y} = ${X}`)}에 대하여 서로 대칭이다.`]),
        explain: `직선 OA의 기울기는 ${tx(Q(ya, xa))}, 직선 OB의 기울기는 ${nb(`${sn(yb)} ÷ ${VA}`)}이고 두 직선이 수직이므로 ${nb(`${VA} = ${sn(a)}`)}이다. B${jw(pt(a, yb), '을/를')} 직선 ${nb(`${Y} = ${X}`)}에 대하여 대칭이동하면 C${pt(xc, yc)}이다. 두 점 A, C를 지나는 직선의 ${Y}절편은 ${tx(iv)}이다.`,
        facts: { value: `(${J(ya)}*${J(yb)}-${J(xa)}*${aE})/(${J(yb)}-${J(xa)})` }
      });
    })
  ];

  B.addGroup(UNIT, { id: 'hard', title: '실력 문제', standard: S07, types: hardTypes.map((t) => (/^hard-(bridge|curve-dist|tangent-slope|right-locus|circle-through)$/.test(t.id) ? Object.assign(t, { standard: S06 }) : t)) });
})(typeof window !== 'undefined' ? window : globalThis);
