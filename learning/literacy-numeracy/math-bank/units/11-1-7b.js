// 고등학교 대수 Ⅲ-3 「수학적 귀납법」 — 뒤쪽 묶음(되풀이되는 수열과 조건에 따라 바뀌는 관계식, 상황을 귀납적으로 나타내기, 수학적 귀납법).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 11-1-7a.js 에 있다. ref: ①n = 기본꼴_1의 n번.
// 그림: 쪼개 나가는 정삼각형, 막대로 이어 붙인 모양, 계단 모양, 겹겹이 둘러싼 직사각형, 정오각형 모양의 점, 세 직선, 하노이 탑은 이 파일 안의 작은 함수로 그린다.
//  계단 모양(①26 차시별 학습지)과 겹겹이 둘러싼 직사각형(①26 중단원 평가)은 원문 그림이 없어 문제 글과 풀이에 남은 수(4, 10, 18 / 6, 20, 42)에 맞추어 새로 지었다.
//  그림 속 막대·점·삼각형의 개수는 그림을 그린 같은 함수로 세어 관계식과 맞는지 확인한다(맞지 않으면 오류를 낸다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, D } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, tx, tj, nb, V, sup, poly, sys } = B.kit.mid;
  const { ms, sum, pw, lg, jh, hx } = B.kit.hs;
  const K = B.kit.u1117;
  const { UNIT, num, par, jn, jq, plusC, A, Nv, Kv, Mv, SEQ, NN, ALL, defFig, listA, uptoJ, big, stripH, T, numQ, ratQ, slots, relQ, oneQ, proofBox, BX, sameK } = K;

  // ── 그림 도구 ──
  const f1 = (v) => Math.round(v * 10) / 10;
  const INK = '#1f2933', STICK = '#b45309';
  const svgOf = (w, h, body, label) => `<svg class="mb-geo" viewBox="0 0 ${f1(w)} ${f1(h)}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  const label = (x, y, t) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="middle" style="font-size:12.5px;fill:${INK}">${t}</text>`;
  // 단계 그림을 왼쪽부터 늘어놓는다: panels 는 { w, h, draw(ox, oy) } (ox, oy 는 그 칸의 왼쪽 위). 아래를 맞추고 칸 밑에 [n단계]를 적는다.
  function stages(panels, said, o) {
    const gap = (o && o.gap) || 18, top = 6, maxH = Math.max(...panels.map((p) => p.h));
    let x = 8, body = '';
    // 칸이 [n단계] 글보다 좁으면 글 너비만큼 칸을 넓히고 그림을 가운데에 둔다.
    panels.forEach((p, i) => { const w = Math.max(p.w, 46); body += p.draw(x + (w - p.w) / 2, top + maxH - p.h) + label(x + w / 2, top + maxH + 18, `[${i + 1}단계]`); x += w + gap; });
    return svgOf(x - gap + 8, top + maxH + 26, body, said);
  }
  // 막대: 두 끝을 조금씩 줄여 막대 하나하나가 떨어져 보이게 긋는다.
  const stick = (x1, y1, x2, y2) => { const L = Math.hypot(x2 - x1, y2 - y1), g = Math.min(2.4, L * 0.14), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    return `<line x1="${f1(x1 + ux * g)}" y1="${f1(y1 + uy * g)}" x2="${f1(x2 - ux * g)}" y2="${f1(y2 - uy * g)}" style="stroke:${STICK};stroke-width:3;stroke-linecap:round"/>`; };
  // 겹치는 선분을 하나로(끝점을 반올림해 견준다)
  const uniqSegs = (segs) => { const seen = new Set(), out = []; for (const s of segs) { const a = s[0].toFixed(3) + ',' + s[1].toFixed(3), b = s[2].toFixed(3) + ',' + s[3].toFixed(3), key = a < b ? a + '|' + b : b + '|' + a; if (!seen.has(key)) { seen.add(key); out.push(s); } } return out; };
  const unitSide = (x1, y1, x2, y2) => { const n = Math.round(Math.hypot(x2 - x1, y2 - y1)), out = []; for (let i = 0; i < n; i += 1) out.push([x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n, x1 + (x2 - x1) * (i + 1) / n, y1 + (y2 - y1) * (i + 1) / n]); return out; };
  const H3 = Math.sqrt(3) / 2;
  // 모양마다 n단계의 막대(한 칸의 길이 1인 좌표, y는 아래쪽)
  const SHAPES = {
    square: { name: '정사각형', segs: (n) => uniqSegs(Array.from({ length: n }, (_, i) => [[i, 0, i + 1, 0], [i, 1, i + 1, 1], [i, 0, i, 1], [i + 1, 0, i + 1, 1]]).flat()), first: 4, add: 3 },
    house: { name: '집', segs: (n) => uniqSegs(Array.from({ length: n }, (_, i) => [[i, H3, i + 1, H3], [i, H3 + 1, i + 1, H3 + 1], [i, H3, i, H3 + 1], [i + 1, H3, i + 1, H3 + 1], [i, H3, i + 0.5, 0], [i + 0.5, 0, i + 1, H3]]).flat()), first: 6, add: 5 },
    tri: { name: '정삼각형', segs: (n) => uniqSegs(Array.from({ length: n }, (_, t) => { const j = Math.floor(t / 2); return t % 2 === 0 ? [[j, H3, j + 1, H3], [j, H3, j + 0.5, 0], [j + 1, H3, j + 0.5, 0]] : [[j + 0.5, 0, j + 1.5, 0], [j + 0.5, 0, j + 1, H3], [j + 1.5, 0, j + 1, H3]]; }).flat()), first: 3, add: 2 },
    hex: { name: '정육각형', segs: (n) => uniqSegs(Array.from({ length: n }, (_, i) => { const cx = i * 2 * H3 + H3, cy = 1, p = [90, 150, 210, 270, 330, 30].map((g) => [cx + Math.cos(g * Math.PI / 180), cy - Math.sin(g * Math.PI / 180)]); return p.map((a, k) => [a[0], a[1], p[(k + 1) % 6][0], p[(k + 1) % 6][1]]); }).flat()), first: 6, add: 5 }
  };
  const stairSegs = (n) => uniqSegs(Array.from({ length: n }, (_, r) => Array.from({ length: n - r }, (_, c) => { const y = n - r - 1; return [[c, y, c + 1, y], [c, y + 1, c + 1, y + 1], [c, y, c, y + 1], [c + 1, y, c + 1, y + 1]]; }).flat()).flat());
  const nestSegs = (n) => uniqSegs(Array.from({ length: n }, (_, t) => { const j = t + 1, x0 = n - j, x1 = n + j, y0 = n - j, y1 = n + j - 1; return [].concat(unitSide(x0, y0, x1, y0), unitSide(x0, y1, x1, y1), unitSide(x0, y0, x0, y1), unitSide(x1, y0, x1, y1)); }).flat());
  const bbox = (segs) => { const xs = segs.flatMap((s) => [s[0], s[2]]), ys = segs.flatMap((s) => [s[1], s[3]]); return { x0: Math.min(...xs), y0: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };
  // 막대 그림 세 단계: 가로 너비가 maxW 에 들도록 한 칸의 길이를 정한다.
  function stickStages(segsOf, said, maxW, uMax) {
    const sets = [1, 2, 3].map(segsOf), boxes = sets.map(bbox), u = Math.min(uMax || 40, (maxW - 16 - 36) / boxes.reduce((s, b) => s + b.w, 0));
    return stages(sets.map((segs, i) => ({ w: boxes[i].w * u, h: boxes[i].h * u, draw: (ox, oy) => segs.map((s) => stick(ox + (s[0] - boxes[i].x0) * u, oy + (s[1] - boxes[i].y0) * u, ox + (s[2] - boxes[i].x0) * u, oy + (s[3] - boxes[i].y0) * u)).join('') })), said);
  }
  // 쪼개 나가는 정삼각형: n단계까지 각 변의 중점을 이어 한가운데를 오려 낸 정삼각형(남은 것은 칠한다)
  function sierpinski() {
    const S = 78, h = S * H3;
    const tris = (x, y, s, depth) => (depth === 0 ? [[x, y, s]] : [].concat(tris(x, y + s * H3 / 2, s / 2, depth - 1), tris(x + s / 2, y + s * H3 / 2, s / 2, depth - 1), tris(x + s / 4, y, s / 2, depth - 1)));
    const tri = (x, y, s, fill) => `<path d="M${f1(x)} ${f1(y + s * H3)}L${f1(x + s)} ${f1(y + s * H3)}L${f1(x + s / 2)} ${f1(y)}Z" style="fill:${fill};stroke:#1e3a8a;stroke-width:0.9;stroke-linejoin:round"/>`;
    const panels = [1, 2, 3].map((k) => ({ w: S, h, draw: (ox, oy) => tri(ox, oy, S, '#fff') + tris(ox, oy, S, k).map(([x, y, s]) => tri(x, y, s, '#93c5fd')).join('') }));
    const counts = [1, 2, 3].map((k) => tris(0, 0, S, k).length);
    return { svg: stages(panels, `정삼각형 모양의 종이를 오려 나간 그림. 1단계: 각 변의 중점을 이어 만든 정삼각형 4개 가운데 한가운데 것을 오려 내어 정삼각형 ${counts[0]}개가 남았다. 2단계: 남은 정삼각형마다 같은 방법으로 오려 내어 ${counts[1]}개가 남았다. 3단계: 같은 방법으로 ${counts[2]}개가 남았다.`, { gap: 14 }), counts };
  }
  // 정오각형 모양의 점: n단계는 한 꼭짓점을 함께 쓰는 한 변의 길이 1, 2, …, n − 1인 정오각형의 변 위에 1 간격으로 찍은 점(1단계는 점 하나)
  function pentaDots(n) {
    const pts = new Map(), outlines = [];
    const z = (t) => (Math.abs(t) < 1e-6 ? 0 : t).toFixed(3), add = (x, y) => pts.set(z(x) + ',' + z(y), [x, y]);
    add(0, 0);
    for (let j = 1; j < n; j += 1) {
      let x = 0, y = 0;
      const corners = [[0, 0]];
      for (let s = 0; s < 5; s += 1) {
        const g = s * 72 * Math.PI / 180;
        for (let t = 1; t <= j; t += 1) add(x + Math.cos(g) * t, y + Math.sin(g) * t);
        x += Math.cos(g) * j; y += Math.sin(g) * j; corners.push([x, y]);
      }
      outlines.push(corners);
    }
    return { pts: [...pts.values()], outlines };
  }
  function pentaStages() {
    const u = 14, sets = [1, 2, 3, 4].map(pentaDots), all = sets.map((s) => s.pts.concat(s.outlines.flat()));
    const boxes = all.map((p) => { const xs = p.map((q) => q[0]), ys = p.map((q) => -q[1]); return { x0: Math.min(...xs), y0: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; });
    const pad = 4;
    const panels = sets.map((s, i) => ({ w: boxes[i].w * u + pad * 2, h: boxes[i].h * u + pad * 2, draw: (ox, oy) => {
      const X = (x) => ox + pad + (x - boxes[i].x0) * u, Y = (y) => oy + pad + (-y - boxes[i].y0) * u;
      return s.outlines.map((c) => `<path d="${c.map((q, k) => (k ? 'L' : 'M') + f1(X(q[0])) + ' ' + f1(Y(q[1]))).join('')}Z" style="fill:none;stroke:#9aa5b1;stroke-width:0.9"/>`).join('')
        + s.pts.map((q) => `<circle cx="${f1(X(q[0]))}" cy="${f1(Y(q[1]))}" r="2.7" style="fill:${INK}"/>`).join('');
    } }));
    return { svg: stages(panels, '정오각형 모양으로 점을 배열한 그림. 1단계는 점 1개이다. 다음 단계마다 한 꼭짓점을 함께 쓰고 한 변에 놓인 점이 하나씩 더 많은 정오각형을 바깥에 덧붙여 그 변 위에 점을 찍는다. 그림은 1단계부터 4단계까지 그렸다.', { gap: 16 }), counts: sets.map((s) => s.pts.length) };
  }
  // 세 직선으로 나뉜 평면
  function threeLines() {
    const W = 230, Hh = 140, ln = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:#1d4ed8;stroke-width:1.8"/>`;
    const body = `<rect x="1" y="1" width="${W - 2}" height="${Hh - 2}" style="fill:#f8fafc;stroke:#cbd5e1;stroke-width:1"/>` + ln(1, 104, W - 1, 92) + ln(20, Hh - 1, 160, 1) + ln(60, 1, 200, Hh - 1);
    return svgOf(W, Hh, body, '평면 위에 그은 직선 3개. 어느 두 직선도 평행하지 않고, 어느 세 직선도 한 점에서 만나지 않는다. 세 직선이 세 점에서 만나 가운데에 삼각형이 생기고, 평면은 7개의 영역으로 나누어진다.');
  }
  // 하노이 탑: 기둥 셋, 왼쪽 기둥에 원판 셋
  function hanoi() {
    const W = 250, Hh = 92, base = 80, pegs = [45, 125, 205];
    let body = `<rect x="6" y="${base}" width="${W - 12}" height="8" rx="2" style="fill:#d6b98c;stroke:#8a6a3b;stroke-width:1"/>`;
    body += pegs.map((x) => `<rect x="${x - 3}" y="14" width="6" height="${base - 14}" rx="2" style="fill:#c9a36a;stroke:#8a6a3b;stroke-width:1"/>`).join('');
    body += [[64, '#ef4444'], [48, '#22c55e'], [32, '#3b82f6']].map(([w, c], i) => `<rect x="${pegs[0] - w / 2}" y="${base - 14 * (i + 1)}" width="${w}" height="13" rx="4" style="fill:${c};stroke:${INK};stroke-width:1"/>`).join('');
    return svgOf(W, Hh, body, '하노이 탑: 기둥 3개가 있고 왼쪽 기둥에 크기가 서로 다른 원판 3개가 큰 것부터 아래에 쌓여 있다.');
  }

  // ════════════════════════════════════════════════════════════════
  // ── 되풀이되는 수열과 조건에 따라 바뀌는 관계식 ──
  // 값이 되풀이되는 마디를 찾는다: [마디 앞의 항들, 마디]
  function cycleOf(first, next, maxLen) {
    const seen = new Map(), list = [];
    let v = first;
    for (let i = 0; i < (maxLen || 200); i += 1) {
      const key = typeof v === 'object' ? v.p + '/' + v.q : String(v);
      if (seen.has(key)) { const at = seen.get(key); return { pre: list.slice(0, at), cyc: list.slice(at) }; }
      seen.set(key, i); list.push(v); v = next(v, i + 1);
    }
    return null;
  }
  const sumFirst = (pre, cyc, N0) => { const out = []; for (let i = 0; i < N0; i += 1) out.push(i < pre.length ? pre[i] : cyc[(i - pre.length) % cyc.length]); return out; };
  const qsum = (list) => list.reduce((s, v) => qadd(s, typeof v === 'object' ? v : Q(v)), Q(0));
  // 되풀이로 합을 구하는 풀이 글
  function cycleTold(pre, cyc, N0, show) {
    const sp = (v) => (/^−/.test(stripH(show(v))) ? '(' + show(v) + ')' : show(v));
    const rest = N0 - pre.length, q = Math.floor(rest / cyc.length), r = rest % cyc.length, total = qsum(sumFirst(pre, cyc, N0));
    const head = pre.length ? `${pre.map(show).join(', ')} 다음 ` : '';
    return `${head}${pre.length ? A(pre.length + 1) + '부터 ' : ''}${cyc.slice(0, -1).map((v) => show(v) + ', ').join('')}${jh(show(cyc[cyc.length - 1]), '이/가')} 이 차례로 되풀이된다. 첫째항부터 제${N0}항까지는 ${pre.length ? `마디 앞의 ${pre.length}개 항, ` : ''}마디 ${q}번${r ? `, 마디의 앞 ${r}개 항` : ''}으로 이루어지므로 합은 ${pre.length ? '(' + pre.map(sp).join(' + ') + ') + ' : ''}(${cyc.map(sp).join(' + ')}) × ${q}${r ? ' + (' + cyc.slice(0, r).map(sp).join(' + ') + ')' : ''} = ${tx(total)}이다.`;
  }
  const showV = (v) => (typeof v === 'object' ? tx(v) : num(v));
  const jsV = (v) => (typeof v === 'object' ? jq(v) : jn(v));
  const cycleExpr = (pre, cyc, N0) => { const rest = N0 - pre.length, q = Math.floor(rest / cyc.length), r = rest % cyc.length; return [pre.map(jsV).join('+'), '(' + cyc.map(jsV).join('+') + ')*' + q, cyc.slice(0, r).map(jsV).join('+')].filter(Boolean).join('+'); };
  const cycleNums = (pre, cyc, N0) => pre.concat(cyc).flatMap((v) => (typeof v === 'object' ? [Math.abs(v.p), v.q] : [Math.abs(v)])).concat([Math.floor((N0 - pre.length) / cyc.length)]);

  B.addTypes(UNIT, 'cycle', [
    T('cycle-cond', '조건에 따라 식이 바뀌는 관계식으로 항 구하기', '①20', (d) => {
      const b = d.pick([2, 3, 5]), a1 = d.pick([b, 1, 0, -1]), want = d.pick(['neg', 'pos']);
      // 값: { r: 유리수 } 또는 { e: 유리수 }(b 의 e제곱, e 가 정수가 아닐 때)
      // |x| ≤ 1 이면 b^x(x 가 정수면 유리수, 아니면 { e: x }), |x| > 1 이면 log_(1/b) x = −log_b x(x 가 b 의 거듭제곱일 때만 정한다).
      const step = (v) => {
        if (v.e) return v.e.p > 0 ? { r: Q(-v.e.p, v.e.q) } : null;                // b^e > 1 이면 로그, b^e < 1 이면 무리수가 되어 멈춘다
        const x = v.r;
        if (Math.abs(x.p) <= x.q) return x.q !== 1 ? { e: x } : { r: x.p >= 0 ? Q(b ** x.p) : Q(1, b ** -x.p) };
        if (x.p < 0 || x.q !== 1) return null;
        let t = 0, y = x.p; while (y % b === 0) { y /= b; t += 1; }
        return y === 1 ? { r: Q(-t) } : null;
      };
      const vals = [{ r: Q(a1) }];
      while (vals.length < 10) { const nx = step(vals[vals.length - 1]); if (!nx) break; vals.push(nx); }
      const target = want === 'neg' ? Q(-1, b) : Q(1, b), at = vals.findIndex((v) => v.r && v.r.p === target.p && v.r.q === target.q);
      if (at < 2) return null;
      const k = at + 1, showE = (v) => (v.r ? tx(v.r) : pw(b, [v.e.p, v.e.q]));
      const expOf = (v) => (v.r.q === 1 ? pw(b, v.r.p) : pw(b, [v.r.p, v.r.q]));
      const why = vals.slice(1, k).map((v, i) => { const prev = vals[i], small = prev.r ? Math.abs(prev.r.p) <= prev.r.q : prev.e.p < 0; return nb(v.e ? `${A(i + 2)} = ${expOf(prev)}` : `${A(i + 2)} = ${small ? expOf(prev) : lg(frac(1, b), showE(prev))} = ${showE(v)}`); }).join(', ');
      return ratQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${num(a1)}이고 ${ALL} 다음을 만족시킬 때, ${A(k)}의 값은?`, target, {
        figure: hx(`${A('n+1')} = ` + sys([`${pw(b, A('n'))} (|${A('n')}| ≤ 1)`, `${lg(frac(1, b), A('n'))} (|${A('n')}| &gt; 1)`])),
        explain: `항마다 |${A('n')}|과 1을 비교하여 식을 고른다. ${why}이다.${vals.slice(0, k).some((v) => v.e) ? ` (${pw(b, [1, b])} &gt; 1이므로 그다음 항은 로그로 구한다.)` : ''}`,
        value: want === 'neg' ? `0-1/${b}` : `1/${b}`
      });
    }),

    T('cycle-sum', '조건에 따라 바뀌는 관계식에서 되풀이를 찾아 합 구하기', '①21', (d, n) => {
      if (n === 0) {
        const c = d.pick([1, 3, 5]), a1 = 2 * d.int(5, 30), N0 = d.int(20, 40);
        const cy = cycleOf(a1, (v) => (v % 2 === 0 ? v / 2 : v + c));
        if (!cy || cy.pre.length + cy.cyc.length > 12 || cy.cyc.length < 2 || cy.pre.length < 2) return null;
        const total = qsum(sumFirst(cy.pre, cy.cyc, N0)).p;
        if (big(total)) return null;
        return numQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${a1}이고 ${ALL} 다음을 만족시킬 때, 수열 ${SEQ}의 첫째항부터 제${N0}항까지의 합은?`, total, {
          figure: hx(`${A('n+1')} = ` + sys([`${frac(1, 2)}${A('n')} (${jh(A('n'), '이/가')} 짝수)`, `${A('n')} + ${c} (${jh(A('n'), '이/가')} 홀수)`])),
          explain: cycleTold(cy.pre, cy.cyc, N0, showV),
          value: cycleExpr(cy.pre, cy.cyc, N0), derived: cycleNums(cy.pre, cy.cyc, N0)
        });
      }
      const p = d.int(1, 5), q = d.int(1, 5), a1 = d.int(-2, 2), N0 = d.int(10, 30);
      if (p === q) return null;
      const cy = cycleOf(a1, (v) => (v > 0 ? v - p : v + q));
      if (!cy || cy.cyc.length < 3 || cy.pre.length + cy.cyc.length > 10) return null;
      const total = qsum(sumFirst(cy.pre, cy.cyc, N0)).p;
      if (total === 0) return null;
      return numQ(`수열 ${jh(SEQ, '이/가')} 다음 조건을 모두 만족시킬 때, ${sum('k=1', N0, 'a_k')}의 값은?`, total, {
        figure: lines([`(가) ${A(1)} = ${num(a1)}`, `(나) ${ALL} ${hx(`${A('n+1')} = ` + sys([`${A('n')} ${MINUS} ${p} (${A('n')} &gt; 0)`, `${A('n')} + ${q} (${A('n')} ≤ 0)`]))}`]),
        explain: cycleTold(cy.pre, cy.cyc, N0, showV),
        value: cycleExpr(cy.pre, cy.cyc, N0), derived: cycleNums(cy.pre, cy.cyc, N0)
      });
    }, { count: 2 }),

    T('cycle-mod', '나머지로 정한 수열에서 먼 항 구하기', '①22', (d) => {
      const m = d.pick([7, 9, 11, 13]), k = d.int(2, m - 2), a1 = d.int(1, m - 1);
      const g = (x, y) => (y ? g(y, x % y) : x);
      if (g(k, m) !== 1 || g(a1, m) !== 1) return null;
      let L = 1, x = k % m; while (x !== 1) { x = (x * k) % m; L += 1; }
      if (L < 3 || L > 6) return null;
      const N0 = d.int(100, 400), at = (t) => (a1 * k ** ((t - 1) % L)) % m, ans = [N0, N0 + 1, N0 + 2].map(at);
      const first = Array.from({ length: L + 1 }, (_, i) => at(i + 1));
      return slots(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${a1}이고 ${ALL} ${nb(A('n+1') + ' = (' + k + jh(A('n'), '을/를') + ' ' + josa(m, '으로/로') + ' 나눈 나머지)')}를 만족시킬 때, ${A(N0)}, ${A(N0 + 1)}, ${A(N0 + 2)}의 값은?`,
        [N0, N0 + 1, N0 + 2].map((t, i) => [A(t), ans[i], `(${a1}*${k}**((${t}-1)%${L}))%${m}`, false]), {
          explain: `${listA(first, 1)}이므로 ${first.slice(0, L - 1).map((v) => v + ', ').join('')}${josa(first[L - 1], '이/가')} 이 차례로 되풀이된다(마디의 길이 ${L}). ${N0}, ${N0 + 1}, ${tj(Q(N0 + 2), '을/를')} ${josa(L, '으로/로')} 나눈 나머지가 각각 ${N0 % L}, ${(N0 + 1) % L}, ${(N0 + 2) % L}이므로 ${A(N0)} = ${ans[0]}, ${A(N0 + 1)} = ${ans[1]}, ${A(N0 + 2)} = ${ans[2]}이다.`,
          derived: [L]
        });
    }),

    T('cycle-frac', '분수식·부호가 바뀌는 관계식에서 되풀이를 찾아 합 구하기', '①23', (d, n) => {
      const N0 = d.int(20, 40);
      if (n === 0) {
        const s = d.pick([1, 2]), b1 = d.pick([Q(2), Q(-1), Q(1, 2), Q(3), Q(-1, 2), Q(2, 3), Q(3, 2), Q(-2), Q(1, 3), Q(4), Q(-1, 3), Q(3, 4)]);
        const bs = [b1, qdiv(Q(1), qsub(Q(1), b1))]; bs.push(qdiv(Q(1), qsub(Q(1), bs[1])));
        const as = bs.map((x) => qdiv(x, Q(s))), total = qsum(sumFirst([], as, N0));
        if (total.q !== 1 || total.p === 0 || big(total.p)) return null;
        const rel = s === 1 ? `${A('n+1')} = ${frac(1, '1 ' + MINUS + ' ' + A('n'))}` : `2${A('n+1')} = ${frac(1, '1 ' + MINUS + ' 2' + A('n'))}`;
        return numQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${tx(as[0])}이고 ${ALL} 다음을 만족시킬 때, ${sum('k=1', N0, 'a_k')}의 값은?`, total.p, {
          figure: hx(rel),
          explain: `${listA(as.concat([as[0]]), 1)}이므로 ` + cycleTold([], as, N0, showV),
          value: cycleExpr([], as, N0), derived: cycleNums([], as, N0)
        });
      }
      const a1 = d.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), c = d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), N1 = d.int(13, 30);
      const cyc = [a1, a1 + c, -a1, -a1 + c];
      if (new Set(cyc).size < 4) return null;
      const total = qsum(sumFirst([], cyc, N1)).p;
      if (total === 0) return null;
      return numQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${num(a1)}이고 ${ALL} ${jh(nb(A('n+1') + ' = (' + MINUS + '1)' + sup(ms('n+1')) + A('n') + plusC(c)), '을/를')} 만족시킬 때, ${sum('k=1', N1, 'a_k')}의 값은?`, total, {
        explain: `${listA(cyc.concat([a1]), 1)}이므로 ` + cycleTold([], cyc, N1, showV),
        value: cycleExpr([], cyc, N1), derived: cycleNums([], cyc, N1)
      });
    }, { count: 2 })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 상황을 귀납적으로 나타내기 ──
  const relAsk = `${jh(A('n'), '과/와')} ${A('n+1')} 사이의 관계식을 다음 꼴로 나타내시오.`;
  const relCalc = (pqr) => pqr.map((v, i) => [jn(v), i]);
  B.addTypes(UNIT, 'model', [
    T('model-cut', '같은 방법으로 쪼개 나가는 도형', '①24', (d, n) => {
      const { svg, counts } = sierpinski();
      if (counts[1] !== 3 * counts[0] || counts[2] !== 3 * counts[1]) throw new Error('그림의 삼각형 수가 관계식과 맞지 않다');
      const lead = `정삼각형 모양의 종이가 있다. 그림과 같이 각 변의 중점을 이어 만든 정삼각형 가운데 한가운데 정삼각형을 오려 내고, 남아 있는 정삼각형마다 같은 방법으로 한가운데 정삼각형을 오려 내는 일을 되풀이한다. [${Nv}단계]에서 남아 있는 정삼각형의 개수를 ${jh(A('n'), '이/가')}라 하자.`;
      if (n === 0) return relQ(`${lead} ${relAsk}`, [3, 0, 0], {
        figure: svg, calc: relCalc([3, 0, 0]), derived: [3],
        explain: `남아 있는 정삼각형 하나에서 한가운데를 오려 내면 정삼각형 3개가 남으므로 [(${Nv} + 1)단계]의 개수는 [${Nv}단계]의 개수의 3배이다. 따라서 ${nb(A('n+1') + ' = 3' + A('n'))}이다.`
      });
      const k = d.int(4, 7), v = 3 ** k;
      return numQ(`${lead} ${A(k)}의 값은?`, v, {
        signed: false, figure: svg,
        explain: `${nb(A('n+1') + ' = 3' + A('n'))}이고 ${A(1)} = 3이므로 ${listA(Array.from({ length: k - 1 }, (_, i) => 3 ** (i + 2)), 2)}이다.`,
        value: `3**${k}`
      });
    }, { count: 2 }),

    T('model-sticks', '막대로 같은 모양을 이어 붙이기', '①25', (d, n) => {
      const key = d.pick(Object.keys(SHAPES)), sh = SHAPES[key];
      const cnt = [1, 2, 3].map((s) => sh.segs(s).length);
      if (cnt[0] !== sh.first || cnt[1] - cnt[0] !== sh.add || cnt[2] - cnt[1] !== sh.add) throw new Error('막대 수가 관계식과 맞지 않다: ' + key);
      const fig = stickStages(sh.segs, `길이가 같은 막대로 만든 모양. 1단계는 ${sh.name} 모양 1개, 2단계는 ${sh.name} 모양 2개, 3단계는 ${sh.name} 모양 3개를 옆으로 이어 붙인 모양이다. 이어 붙인 곳의 막대는 함께 쓴다.`, 270, key === 'tri' ? 44 : 38);
      const lead = `길이가 같은 막대를 이용하여 그림과 같이 ${sh.name} 모양을 이어 붙여 나갈 때, [${Nv}단계]에 있는 막대의 개수를 ${jh(A('n'), '이/가')}라 하자.`;
      if (n === 0) return relQ(`${lead} ${relAsk}`, [1, 0, sh.add], {
        figure: fig, calc: relCalc([1, 0, sh.add]), derived: [sh.add],
        explain: `${sh.name} 모양을 하나 더 붙일 때마다 함께 쓰는 막대 1개를 빼고 막대 ${sh.add}개가 늘어난다(${A(1)} = ${sh.first}, ${A(2)} = ${cnt[1]}, ${A(3)} = ${cnt[2]}). 따라서 ${nb(A('n+1') + ' = ' + A('n') + ' + ' + sh.add)}이다.`
      });
      const k = d.int(6, 12), v = sh.first + (k - 1) * sh.add;
      return numQ(`${lead} ${A(k)}의 값은?`, v, {
        signed: false, figure: fig,
        explain: `${A(1)} = ${sh.first}이고 모양을 하나 붙일 때마다 막대가 ${sh.add}개씩 늘어나므로 ${nb(A('n+1') + ' = ' + A('n') + ' + ' + sh.add)}이다. 따라서 ${A(k)} = ${sh.first} + ${k - 1} × ${sh.add} = ${v}이다.`,
        value: `${sh.first}+(${k}-1)*${sh.add}`, derived: [sh.first, sh.add]
      });
    }, { count: 2 }),

    T('model-grow', '막대·점 배열에서 늘어나는 수가 n에 따라 달라지는 관계식', '①26', (d, n) => {
      if (n === 0) {
        const cnt = [1, 2, 3, 4].map((s) => stairSegs(s).length);
        if (cnt.some((c, i) => c !== (i + 1) * (i + 4))) throw new Error('계단 그림의 막대 수');
        const fig = stickStages(stairSegs, '길이가 같은 막대로 만든 계단 모양. 1단계는 정사각형 1개, 2단계는 아래 줄에 정사각형 2개와 그 왼쪽 위에 1개, 3단계는 아래 줄부터 정사각형 3개, 2개, 1개를 왼쪽에 맞추어 쌓은 모양이다. 맞닿은 변의 막대는 함께 쓴다.', 270, 30);
        return relQ(`길이가 같은 막대를 이용하여 그림과 같이 계단 모양을 만들어 나갈 때, [${Nv}단계]에 있는 막대의 개수를 ${jh(A('n'), '이/가')}라 하자. ${relAsk}`, [1, 2, 4], {
          figure: fig, calc: relCalc([1, 2, 4]), derived: [2, 4],
          explain: `${A(1)} = ${cnt[0]}, ${A(2)} = ${cnt[1]}, ${A(3)} = ${cnt[2]}이다. [(${Nv} + 1)단계]는 [${Nv}단계]의 모양 아래에 정사각형 (${Nv} + 1)개를 한 줄로 붙인 것이므로 가로 막대 ${nb('(' + Nv + ' + 1) + 1')}개와 세로 막대 ${nb('(' + Nv + ' + 2)')}개, 모두 ${nb('2' + Nv + ' + 4')}개가 늘어난다. 따라서 ${nb(A('n+1') + ' = ' + A('n') + ' + 2' + Nv + ' + 4')}이다.`
        });
      }
      if (n === 1) {
        const cnt = [1, 2, 3].map((s) => nestSegs(s).length);
        if (cnt.join() !== '6,20,42') throw new Error('겹 직사각형 그림의 막대 수');
        const fig = stickStages(nestSegs, '길이가 같은 성냥개비로 만든 직사각형 모양. 1단계는 가로 성냥개비 2개, 세로 1개인 직사각형이다. 다음 단계마다 바깥에 가로·세로가 성냥개비 2개씩 더 긴 직사각형을 한 칸 띄워 둘러싼다. 3단계는 가로 2, 4, 6개, 세로 1, 3, 5개인 직사각형 세 겹이다.', 270, 16);
        return relQ(`길이가 같은 성냥개비를 그림과 같이 직사각형 모양으로 배열해 나갈 때, [${Nv}단계]에 배열된 성냥개비의 개수를 ${jh(A('n'), '이/가')}라 하자. 예를 들어, ${A(1)} = 6, ${A(2)} = 20, ${A(3)} = 42이다. ${relAsk}`, [1, 8, 6], {
          figure: fig, calc: relCalc([1, 8, 6]), derived: [8],
          explain: `[(${Nv} + 1)단계]는 [${Nv}단계]의 바깥에 가로 성냥개비 ${nb('2' + Nv + ' + 2')}개, 세로 ${nb('2' + Nv + ' + 1')}개인 직사각형을 둘러싼 것이므로 성냥개비가 ${nb('2{(2' + Nv + ' + 2) + (2' + Nv + ' + 1)} = 8' + Nv + ' + 6')}개 늘어난다. 따라서 ${nb(A('n+1') + ' = ' + A('n') + ' + 8' + Nv + ' + 6')}이다.`
        });
      }
      const { svg, counts } = pentaStages();
      if (counts.join() !== '1,5,12,22') throw new Error('오각형 점 그림의 점 수: ' + counts.join());
      const k = d.int(5, 8), vals = [1];
      for (let i = 1; i < k; i += 1) vals.push(vals[i - 1] + 3 * i + 1);
      return numQ(`그림과 같이 정오각형 모양으로 점을 배열해 나갈 때, [${Nv}단계]에 배열된 점의 개수를 ${jh(A('n'), '이/가')}라 하자. ${A(k)}의 값은?`, vals[k - 1], {
        signed: false, figure: svg,
        explain: `${A(1)} = 1, ${A(2)} = 5, ${A(3)} = 12, ${A(4)} = 22이고, [(${Nv} + 1)단계]에서는 정오각형의 세 변 위에 점이 ${nb('3' + Nv + ' + 1')}개 늘어나므로 ${nb(A('n+1') + ' = ' + A('n') + ' + 3' + Nv + ' + 1')}이다. 따라서 ${listA(vals.slice(4), 5)}이다.`,
        value: `${k}*(3*${k}-1)/2`, derived: [2, 3]
      });
    }, { count: 3 }),

    T('model-lines', '직선으로 나뉜 평면의 영역 수', '①27', (d) => {
      const k = d.int(4, 9);
      return slots(`평면 위에 어느 두 직선도 평행하지 않고, 어느 세 직선도 한 점에서 만나지 않도록 ${Nv}개의 직선을 그을 때, 이 ${Nv}개의 직선으로 나누어지는 영역의 개수를 ${jh(A('n'), '이/가')}라 하자. 예를 들어, 그림에서 ${A(3)} = 7이다. ${A(1)} = ${V('p')}, ${nb(A(k + 1) + ' = ' + A(k) + ' + ' + V('q'))}일 때, ${V('p')}, ${V('q')}의 값은?`,
        [[V('p'), 2, '2', false], [V('q'), k + 1, `${k}+1`]], {
          figure: threeLines(),
          derived: [2],
          explain: `직선 1개는 평면을 2개의 영역으로 나누므로 ${V('p')} = 2이다. ${Nv}개의 직선에 직선 1개를 더 그으면 새 직선은 이미 있는 ${Nv}개의 직선과 한 번씩 만나 ${nb(Nv + ' + 1')}개의 조각으로 나뉘고, 조각마다 영역 하나가 둘로 나뉜다. 따라서 ${nb(A('n+1') + ' = ' + A('n') + ' + ' + Nv + ' + 1')}이므로 ${V('q')} = ${k} + 1 = ${k + 1}이다.`
        });
    }),

    T('model-tank', '덜어 내고 채우는 과정을 관계식으로', '①28', (d, n) => {
      if (n < 2) {
        const v = d.pick([3, 4, 5]), u = d.pick([1, 2, 3, 4].filter((t) => t < v && (t === 1 || v % t !== 0))), scoop = d.bool(), V0 = v * d.int(4, 30), w = d.int(2, 40);
        const keep = Q(v - u, v), out = scoop ? Q(u, v) : Q(u, v);
        const verb = scoop ? `${jh(frac(out.p, out.q), '을/를')} 퍼낸 다음` : `${jh(frac(out.p, out.q), '을/를')} 사용한 다음`;
        const lead = `어느 수조에 물 ${V0} L가 들어 있다. 이 수조에 있는 물의 ${verb} ${w} L의 물을 더 넣는 과정을 ${Nv}번 되풀이하였을 때, 수조에 남아 있는 물의 양을 ${A('n')} L라 하자.`;
        if (n === 0) {
          const a1 = (V0 * (v - u)) / v + w;
          return numQ(`${lead} ${A(1)}의 값은?`, a1, {
            signed: false,
            explain: `물의 ${jh(frac(u, v), '을/를')} 덜어 내면 ${jh(frac(v - u, v), '이/가')} 남는다. 따라서 ${A(1)} = ${V0} × ${frac(v - u, v)} + ${w} = ${a1}이다.`,
            value: `${V0}*(${v}-${u})/${v}+${w}`
          });
        }
        const sim = (x) => qadd(qmul(Q(x), keep), Q(w));
        const opts = [
          { h: nb(`${A('n+1')} = ${tx(keep)}${A('n')} + ${w}`), f: (x) => qadd(qmul(Q(x), keep), Q(w)) },
          { h: nb(`${A('n+1')} = ${tx(out)}${A('n')} + ${w}`), f: (x) => qadd(qmul(Q(x), out), Q(w)) },
          { h: nb(`${A('n+1')} = ${tx(keep)}(${A('n')} + ${w})`), f: (x) => qmul(qadd(Q(x), Q(w)), keep) },
          { h: nb(`${A('n+1')} = ${tx(keep)}${A('n')} ${MINUS} ${w}`), f: (x) => qsub(qmul(Q(x), keep), Q(w)) },
          { h: nb(`${A('n+1')} = ${A('n')} ${MINUS} ${tx(out)} + ${w}`), f: (x) => qadd(qsub(Q(x), out), Q(w)) }
        ].map((o) => ({ h: o.h, ok: [V0, 2 * V0, 7].every((x) => { const a = o.f(x), b = sim(x); return a.p === b.p && a.q === b.q; }) }));
        const pick = [opts[0]].concat(d.shuffle(opts.slice(1)).slice(0, 3));
        return oneQ(d, `${lead} ${jh(A('n'), '과/와')} ${A('n+1')} 사이의 관계식으로 옳은 것은?`, pick, true, {
          explain: `물 ${A('n')} L에서 ${jh(frac(u, v), '을/를')} 덜어 내면 ${frac(v - u, v)}${A('n')} L가 남고, 여기에 ${w} L를 넣는다. 따라서 ${nb(A('n+1') + ' = ' + tx(keep) + A('n') + ' + ' + w)}이다.`
        });
      }
      const T0 = d.pick([200, 400, 500, 800, 1000]), part = d.pick([[1, 4], [1, 5], [1, 8], [1, 10], [3, 10], [2, 5], [3, 4]]), x = (T0 * part[0]) / part[1], c = d.pick([4, 5, 6, 8, 10, 12, 15]);
      const a1 = (c * (T0 - x)) / T0;
      if (!Number.isInteger(x) || Number.isInteger(a1) || Math.abs(a1 * 10 - Math.round(a1 * 10)) > 1e-9) return null;
      return D(`농도가 ${c} %인 소금물 ${T0} g이 들어 있는 비커가 있다. 이 비커에서 소금물 ${x} g을 덜어 낸 다음 물 ${x} g을 넣는 과정을 ${Nv}번 되풀이한 뒤의 소금물의 농도를 ${A('n')} %라 하자. ${A(1)}의 값은?`, a1, {
        unit: '%',
        explain: `소금물 ${x} g을 덜어 내면 남은 ${T0 - x} g에 소금이 ${T0 - x} × ${frac(c, 100)} = ${f1((T0 - x) * c / 100)}(g) 들어 있고, 물을 넣어도 소금의 양은 그대로이다. 따라서 ${A(1)} = ${frac(f1((T0 - x) * c / 100), T0)} × 100 = ${a1}이다.`,
        facts: { value: `(${c}*(${T0}-${x})/${T0})+0` }
      });
    }, { count: 3 }),

    T('model-hanoi', '하노이 탑의 최소 이동 횟수', '①29', (d, n) => {
      const lead = `하노이 탑 문제는 세 기둥 가운데 한 기둥에 크기 순으로 쌓여 있는 원판을 다음 규칙에 따라 다른 한 기둥으로 모두 옮길 때의 최소 이동 횟수를 구하는 것이다. 한 번에 한 개의 원판만 옮길 수 있고, 작은 원판 위에 큰 원판을 놓을 수 없다. 원판 ${Nv}개를 옮기는 최소 이동 횟수를 ${jh(A('n'), '이/가')}라 하자.`;
      if (n === 0) return relQ(`${lead} ${relAsk}`, [2, 0, 1], {
        figure: hanoi(), calc: relCalc([2, 0, 1]), derived: [2],
        explain: `원판 (${Nv} + 1)개를 옮기려면 위의 ${Nv}개를 다른 기둥으로 옮기고(${A('n')}번), 맨 아래 원판을 남은 기둥으로 옮긴 다음(1번), ${Nv}개를 다시 그 위로 옮긴다(${A('n')}번). 따라서 ${nb(A('n+1') + ' = 2' + A('n') + ' + 1')}이다.`
      });
      const k = d.int(5, 12), v = 2 ** k - 1;
      return numQ(`${lead} ${A(k)}의 값은?`, v, {
        signed: false, figure: hanoi(),
        explain: `${A(1)} = 1이고 ${nb(A('n+1') + ' = 2' + A('n') + ' + 1')}이므로 ${listA(Array.from({ length: k - 1 }, (_, i) => 2 ** (i + 2) - 1), 2)}이다.`,
        value: `2**${k}-1`, derived: [2]
      });
    }, { count: 2 })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 수학적 귀납법 ──
  const kV = Kv, lin = (a, b, v) => poly([[a, v || kV], [b, '']]);
  const pf = (a, b, v) => (b === 0 && a === 1 ? (v || kV) : a === 0 ? String(b) : '(' + lin(a, b, v) + ')');   // 곱으로 이을 때의 일차식
  const eqRow = (h) => '<div class="mb-lines"><div>' + h + ' ······①</div></div>';   // 긴 등식은 줄이 갈릴 수 있게 글줄로 적는다
  // 합의 공식: t(x) 일반항의 글, lhs(x) 좌변 글, R(x, v) 우변 글(x = v + j 의 j), val 값 함수, js 검사 식
  const SUMS = [
    { t: (j, v) => lin(1, j, v), first: ['1', '2', '3'], parenIfShift: true, R: (j, v) => frac(pf(1, j, v) + pf(1, j + 1, v), 2), val: (x) => Q(x * (x + 1), 2), term: (i) => Q(i), js: (x) => `${x}*(${x}+1)/2` },
    { t: (j, v) => lin(2, 2 * j - 1, v), first: ['1', '3', '5'], paren: true, R: (j, v) => pf(1, j, v) + sup(2), val: (x) => Q(x * x), term: (i) => Q(2 * i - 1), js: (x) => `(${x})**2` },
    { t: (j, v) => pf(1, j, v) + sup(2), first: ['1' + sup(2), '2' + sup(2), '3' + sup(2)], R: (j, v) => frac(pf(1, j, v) + pf(1, j + 1, v) + pf(2, 2 * j + 1, v), 6), val: (x) => Q(x * (x + 1) * (2 * x + 1), 6), term: (i) => Q(i * i), js: (x) => `${x}*(${x}+1)*(2*${x}+1)/6` },
    { t: (j, v) => pf(1, j, v) + pf(1, j + 1, v), first: ['1 × 2', '2 × 3', '3 × 4'], R: (j, v) => frac(pf(1, j, v) + pf(1, j + 1, v) + pf(1, j + 2, v), 3), val: (x) => Q(x * (x + 1) * (x + 2), 3), term: (i) => Q(i * (i + 1)), js: (x) => `${x}*(${x}+1)*(${x}+2)/3` },
    { t: (j, v) => lin(3, 3 * j - 2, v), first: ['1', '4', '7'], paren: true, R: (j, v) => frac(pf(1, j, v) + pf(3, 3 * j - 1, v), 2), val: (x) => Q(x * (3 * x - 1), 2), term: (i) => Q(3 * i - 2), js: (x) => `${x}*(3*${x}-1)/2` },
    { t: (j, v) => pw(3, lin(1, j, v)), first: ['3', '3' + sup(2), '3' + sup(3)], R: (j, v) => frac(1, 2) + '(' + pw(3, lin(1, j + 1, v)) + ' ' + MINUS + ' 3)', val: (x) => Q(3 ** (x + 1) - 3, 2), term: (i) => Q(3 ** i), js: (x) => `(3**(${x}+1)-3)/2` },
    { t: (j, v) => frac(1, pf(2, 2 * j - 1, v) + pf(2, 2 * j + 1, v)), first: [frac(1, '1 × 3'), frac(1, '3 × 5'), frac(1, '5 × 7')], R: (j, v) => frac(lin(1, j, v), lin(2, 2 * j + 1, v)), val: (x) => Q(x, 2 * x + 1), term: (i) => Q(1, (2 * i - 1) * (2 * i + 1)), js: (x) => `${x}/(2*${x}+1)` },
    { t: (j, v) => frac(1, pf(1, j, v) + pf(1, j + 1, v)), first: [frac(1, '1 × 2'), frac(1, '2 × 3'), frac(1, '3 × 4')], R: (j, v) => frac(lin(1, j, v), lin(1, j + 1, v)), val: (x) => Q(x, x + 1), term: (i) => Q(1, i * (i + 1)), js: (x) => `${x}/(${x}+1)` },
    { t: (j, v) => frac(lin(1, j, v), pw(2, lin(1, j, v))), first: [frac(1, 2), frac(2, 4), frac(3, 8)], R: (j, v) => '2 ' + MINUS + ' ' + frac(lin(1, j + 2, v), pw(2, lin(1, j, v))), val: (x) => qsub(Q(2), Q(x + 2, 2 ** x)), term: (i) => Q(i, 2 ** i), js: (x) => `2-(${x}+2)/2**${x}` }
  ];
  const tShow = (F, j, v) => (F.paren || (F.parenIfShift && j !== 0) ? '(' + F.t(j, v) + ')' : F.t(j, v));   // 더하는 항이 일차식이면 괄호로 묶는다
  const lhsOf = (F, v) => F.first.join(' + ') + ' + ⋯ + ' + tShow(F, 0, v);
  // 합의 공식을 수학적 귀납법으로 증명한 글. 빈칸 ㈎는 가정한 식의 우변, ㈏는 n = k + 1일 때의 우변이다.
  const sumProof = (F) => [
    eqRow(`${lhsOf(F, Nv)} = ${F.R(0, Nv)}`),
    proofBox([
      `(i) ${Nv} = 1일 때 (좌변) = ${tx(F.term(1))}, (우변) = ${tx(F.val(1))}이므로 ①이 성립한다.`,
      `(ii) ${Nv} = ${kV}일 때 ①이 성립한다고 가정하면 ${lhsOf(F, kV)} = ${BX('㈎')}이므로`,
      `${lhsOf(F, kV)} + ${tShow(F, 1, kV)}`,
      `= ${BX('㈎')} + ${tShow(F, 1, kV)} = ${BX('㈏')}`,
      `따라서 ${nb(Nv + ' = ' + kV + ' + 1')}일 때도 ①이 성립한다.`,
      `(i), (ii)에 의하여 ${ALL} ①이 성립한다.`
    ])
  ].join('');
  const sumTo = (F, x) => qsum(Array.from({ length: x }, (_, i) => F.term(i + 1)));

  B.addTypes(UNIT, 'induct', [
    T('ind-start', '시작하는 수가 2 이상인 수학적 귀납법의 두 단계', '①33', (d) => {
      const m = d.int(2, 6), pn = nb(V('p') + '(' + Nv + ')');
      const cands = [[String(m), 'k+1'], ['1', 'k+1'], [String(m), 'k'], [String(m + 1), 'k+1'], [String(m), String(m + 1)], ['1', 'k']];
      const rows = cands.map(([a, b]) => ({ h: `㈎ ${a}, ㈏ ${ms(b.replace('+', ' + '))}`, ok: Number(a) === m && b === 'k+1' }));
      return oneQ(d, `자연수 ${Nv}에 대한 명제 ${jh(pn, '이/가')} ${m} 이상의 모든 자연수 ${Nv}에 대하여 성립함을 수학적 귀납법으로 증명하려면 다음 두 가지를 보이면 된다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, [rows[0]].concat(d.shuffle(rows.slice(1)).slice(0, 3)), true, {
        figure: proofBox([`(i) ${Nv} = ${BX('㈎')}일 때 명제 ${jh(pn, '이/가')} 성립한다.`, `(ii) ${nb(Nv + ' = ' + kV + ' (' + kV + ' ≥ ' + m + ')')}일 때 명제 ${jh(pn, '이/가')} 성립한다고 가정하면 ${Nv} = ${BX('㈏')}일 때도 명제 ${jh(pn, '이/가')} 성립한다.`]),
        explain: `${m} 이상의 모든 자연수에서 성립함을 보이려면 시작하는 수 ${Nv} = ${m}일 때 성립하고, ${Nv} = ${kV}(${kV} ≥ ${m})일 때 성립하면 ${Nv} = ${kV} + 1일 때도 성립함을 보이면 된다. 따라서 ㈎ ${m}, ㈏ ${ms('k + 1')}이다.`
      });
    }),

    T('ind-sumfill', '합의 공식을 증명한 글의 빈칸', '①34', (d) => {
      const F = d.pick(SUMS);
      const opts = [[0, 1, kV], [1, 0, kV], [-1, 0, kV], [0, 2, kV], [0, 1, Nv]].map(([j0, j1, v]) => ({
        h: `㈎ ${F.R(j0, v)}, ㈏ ${F.R(j1, v)}`,
        ok: v === kV && sameK((k) => F.val(k + j0), (k) => sumTo(F, k)) && sameK((k) => F.val(k + j1), (k) => sumTo(F, k + 1))
      }));
      return oneQ(d, `다음은 ${ALL} 등식 ①이 성립함을 수학적 귀납법으로 증명한 것이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, [opts[0]].concat(d.shuffle(opts.slice(1)).slice(0, 3)), true, {
        figure: sumProof(F),
        explain: `㈎는 ${Nv} = ${kV}일 때의 ①의 우변이므로 ${F.R(0, kV)}이다. ㈏는 ${Nv} = ${kV} + 1일 때의 ①의 우변이므로 ${F.R(1, kV)}이다.`
      });
    }),

    T('ind-fval', '증명의 빈칸에 들어갈 식으로 값 구하기', '①35', (d) => {
      const F = d.pick(SUMS), m = d.int(2, 6), r = qdiv(F.val(m), F.val(m + 1));
      if (r.q === 1 || r.p > 9999 || r.q > 9999) return null;
      return ratQ(`다음은 ${ALL} 등식 ①이 성립함을 수학적 귀납법으로 증명한 것이다. ㈎, ㈏에 알맞은 식을 각각 ${V('f')}(${kV}), ${V('g')}(${kV})라 할 때, ${frac(V('f') + '(' + m + ')', V('g') + '(' + m + ')')}의 값은?`, r, {
        figure: sumProof(F),
        explain: `㈎는 ${Nv} = ${kV}일 때의 우변이므로 ${V('f')}(${kV}) = ${F.R(0, kV)}, ㈏는 ${Nv} = ${kV} + 1일 때의 우변이므로 ${V('g')}(${kV}) = ${F.R(1, kV)}이다. ${V('f')}(${m}) = ${tx(F.val(m))}, ${V('g')}(${m}) = ${tx(F.val(m + 1))}이므로 구하는 값은 ${tx(r)}이다.`,
        value: `(${F.js(m)})/(${F.js(`(${m}+1)`)})`
      });
    }),

    T('ind-prodfill', '곱·계승 꼴 등식을 증명한 글의 빈칸', '①36', (d) => {
      const m1 = d.int(2, 3), m2 = d.int(2, 9), fact = (x) => (x <= 1 ? 1 : x * fact(x - 1));
      const eq = `2 × 6 × 10 × ⋯ × ${nb('(4' + Nv + ' ' + MINUS + ' 2)')} = ${frac(ms('(2n)!'), ms('n!'))}`;
      const figure = eqRow(eq) + proofBox([
        `(i) ${Nv} = 1일 때 (좌변) = ${BX('㈎')}, (우변) = ${BX('㈎')}이므로 ①이 성립한다.`,
        `(ii) ${Nv} = ${kV}일 때 ①이 성립한다고 가정하면 2 × 6 × 10 × ⋯ × ${nb('(4' + kV + ' ' + MINUS + ' 2)')} = ${frac(ms('(2k)!'), ms('k!'))}이므로`,
        `2 × 6 × 10 × ⋯ × ${nb('(4' + kV + ' ' + MINUS + ' 2)')} × ${nb('(4' + kV + ' + 2)')}`,
        `= ${frac(BX('㈏'), ms('k!'))} × ${nb('(4' + kV + ' + 2)')} = ${frac(ms('(2k + 1)!'), ms('(k + 1)!'))} × ${BX('㈐')} = ${frac(ms('(2k + 2)!'), ms('(k + 1)!'))}`,
        `따라서 ${nb(Nv + ' = ' + kV + ' + 1')}일 때도 ①이 성립한다.`,
        `(i), (ii)에 의하여 ${ALL} ①이 성립한다.`
      ]);
      const fs = Array.from({ length: 2 * m1 }, (_, t) => `(2*${m1}-${t})`).join('*');
      return slots(`다음은 ${ALL} 등식 ①이 성립함을 수학적 귀납법으로 증명한 것이다. ㈎에 알맞은 수를 ${V('p')}, ㈏, ㈐에 알맞은 식을 각각 ${V('f')}(${kV}), ${V('g')}(${kV})라 할 때, ${V('p')}, ${V('f')}(${m1}), ${V('g')}(${m2})의 값은?`,
        [[V('p'), 2, '2'], [`${V('f')}(${m1})`, fact(2 * m1), fs], [`${V('g')}(${m2})`, 2 * (m2 + 1), `2*(${m2}+1)`]], {
          figure,
          explain: `${Nv} = 1일 때 좌변은 2, 우변은 ${frac('2!', '1!')} = 2이므로 ${V('p')} = 2이다. 가정한 식에서 ㈏는 ${ms('(2k)!')}이고, ${nb('(4' + kV + ' + 2) = 2(2' + kV + ' + 1)')}이므로 ${nb(frac(ms('(2k)!'), ms('k!')) + ' × (4' + kV + ' + 2) = ' + frac(ms('(2k + 1)!'), ms('k!')) + ' × 2')} = ${frac(ms('(2k + 1)!'), ms('(k + 1)!'))} × 2(${kV} + 1)에서 ㈐는 ${nb('2(' + kV + ' + 1)')}이다. 따라서 ${V('f')}(${m1}) = ${2 * m1}! = ${fact(2 * m1)}, ${V('g')}(${m2}) = 2 × ${m2 + 1} = ${2 * (m2 + 1)}이다.`,
          derived: Array.from({ length: 2 * m1 }, (_, t) => t)
        });
    }),

    T('ind-mult', '배수 명제를 증명한 글의 빈칸', '①37', (d, n) => {
      if (n === 0) {
        // b^(cn) − 1 은 b^c − 1 의 배수
        const [b, c] = d.pick([[4, 1], [5, 1], [6, 1], [7, 1], [3, 2], [2, 3], [4, 2]]), Bv = b ** c, Mm = Bv - 1;
        const X = (e) => (e === 1 ? b : pw(b, e)) + ' ' + MINUS + ' 1';
        const ce = (v) => (c === 1 ? v : c + v), ce1 = c === 1 ? '(' + kV + ' + 1)' : c + '(' + kV + ' + 1)';
        return numQ(`다음은 ${ALL} ${jh(nb(X(ce(Nv))), '이/가')} ${Mm}의 배수임을 수학적 귀납법으로 증명한 것이다. ㈎에 알맞은 수를 ${V('p')}, ㈏에 알맞은 식을 ${V('f')}(${Mv})이라 할 때, ${V('f')}(${V('p')})의 값은?`, Bv * Bv + 1, {
          figure: proofBox([
            `(i) ${Nv} = 1일 때 ${nb(X(c) + ' = ' + josa(Mm, '은/는'))} ${Mm}의 배수이다.`,
            `(ii) ${Nv} = ${kV}일 때 ${jh(nb(X(ce(kV))), '이/가')} ${Mm}의 배수라고 가정하면 ${nb(X(ce(kV)) + ' = ' + Mm + Mv)}(${Mv}은 자연수)로 나타낼 수 있다. 이때`,
            `${nb(X(ce1) + ' = ' + BX('㈎') + ' × ' + pw(b, ce(kV)) + ' ' + MINUS + ' 1')}`,
            `= ${nb(BX('㈎') + '(' + Mm + Mv + ' + 1) ' + MINUS + ' 1 = ' + Mm + '(' + BX('㈏') + ')')}`,
            `이므로 ${nb(X(ce1))}도 ${Mm}의 배수이다. 따라서 ${Nv} = ${kV} + 1일 때도 성립한다.`,
            `(i), (ii)에 의하여 ${ALL} ${jh(nb(X(ce(Nv))), '은/는')} ${Mm}의 배수이다.`
          ]),
          explain: `${nb(pw(b, ce1) + ' = ' + pw(b, c) + ' × ' + pw(b, ce(kV)))}이므로 ㈎는 ${Bv}이고, ${nb(Bv + '(' + Mm + Mv + ' + 1) ' + MINUS + ' 1 = ' + Bv * Mm + Mv + ' + ' + Mm + ' = ' + Mm + '(' + Bv + Mv + ' + 1)')}이므로 ${nb(V('f') + '(' + Mv + ') = ' + Bv + Mv + ' + 1')}이다. 따라서 ${V('f')}(${Bv}) = ${Bv} × ${Bv} + 1 = ${Bv * Bv + 1}이다.`,
          value: `${Bv}*${Bv}+1`, derived: [Bv]
        });
      }
      if (n === 1) {
        // A·α^(n−1) + βⁿ 은 A + β 의 배수(α − β = A + β): 2^(3n−2) + 3ⁿ 꼴
        const fam = d.pick([
          { base: 2, a: 3, b: 2, beta: 3, alpha: 8, M: 5 }, { base: 2, a: 4, b: 3, beta: 7, alpha: 16, M: 9 }, { base: 3, a: 2, b: 1, beta: 3, alpha: 9, M: 6 },
          { base: 2, a: 4, b: 2, beta: 6, alpha: 16, M: 10 }, { base: 5, a: 2, b: 1, beta: 10, alpha: 25, M: 15 }
        ]);
        const { base, a, b, beta, alpha, M: Mm } = fam, ex = (v) => a + v + ' ' + MINUS + ' ' + b, P1 = (v) => pw(base, ex(v));
        const arg = d.pick([2, 3]), fv = base ** (a * arg - b);
        if (fv > 9999) return null;
        const Xn = (v) => nb(P1(v) + ' + ' + pw(beta, v));
        return slots(`다음은 ${ALL} ${jh(Xn(Nv), '이/가')} ${Mm}의 배수임을 수학적 귀납법으로 증명한 것이다. ㈎에 알맞은 수를 ${V('p')}, ㈏에 알맞은 식을 ${V('f')}(${kV})라 할 때, ${V('p')}, ${V('f')}(${arg})의 값은?`,
          [[V('p'), Mm, `${base}**(${a}-${b})+${beta}`], [`${V('f')}(${arg})`, fv, `${base}**(${a}*${arg}-${b})`]], {
            figure: proofBox([
              `(i) ${Nv} = 1일 때 ${nb(pw(base, a + ' ' + MINUS + ' ' + b) + ' + ' + pw(beta, 1) + ' = ' + BX('㈎'))}은/는 ${Mm}의 배수이다.`,
              `(ii) ${Nv} = ${kV}일 때 ${jh(Xn(kV), '이/가')} ${Mm}의 배수라고 가정하면 ${nb(Xn(kV) + ' = ' + Mm + Mv)}(${Mv}은 자연수)로 나타낼 수 있다. 이때`,
              `${nb(pw(base, a + '(' + kV + ' + 1) ' + MINUS + ' ' + b) + ' + ' + pw(beta, kV + ' + 1'))}`,
              `= ${nb(alpha + ' × ' + BX('㈏') + ' + ' + pw(beta, kV + ' + 1'))} = ${nb(Mm + '(' + beta + Mv + ' + ' + BX('㈏') + ')')}`,
              `이므로 ${nb(Nv + ' = ' + kV + ' + 1')}일 때도 ${Mm}의 배수이다.`,
              `(i), (ii)에 의하여 ${ALL} ${jh(Xn(Nv), '은/는')} ${Mm}의 배수이다.`
            ]),
            explain: `${Nv} = 1일 때 ${pw(base, a - b)} + ${beta} = ${Mm}이므로 ㈎는 ${Mm}이다. ${nb(pw(base, a + '(' + kV + ' + 1) ' + MINUS + ' ' + b) + ' = ' + alpha + ' × ' + P1(kV))}이므로 ㈏는 ${P1(kV)}이다(${alpha} × ${P1(kV)} + ${beta} × ${pw(beta, kV)} = ${beta}(${Xn(kV)}) + ${Mm} × ${P1(kV)} = ${Mm}(${beta}${Mv} + ${P1(kV)})). 따라서 ${V('f')}(${arg}) = ${pw(base, a * arg - b)} = ${fv}이다.`
          });
      }
      // aⁿ − (a − 1)n 을 (a − 1)² 으로 나눈 나머지는 1
      const a = d.pick([3, 4, 5, 6, 7]), Mm = (a - 1) ** 2, X = (v) => nb(pw(a, v) + ' ' + MINUS + ' ' + (a - 1) + v);
      const cands = [
        { s: '1', h2: [a, 1, 0], h3: 'k+1' }, { s: '1', h2: [a, 0, 1], h3: 'k+1' }, { s: '1', h2: [a - 1, 1, 0], h3: 'k+1' }, { s: '0', h2: [a, 1, 0], h3: 'k+1' },
        { s: '1', h2: [a, 1, 0], h3: 'k' }, { s: '1', h2: [a, 1, 1], h3: 'k+1' }
      ];
      // ㈏의 식 c₀m + c₁k + c₂ 가 맞는가: a × aᵏ − (a − 1)(k + 1) = M(㈏) + 1 (aᵏ = Mm + (a − 1)k + 1)
      const okH2 = ([c0, c1, c2]) => [[0, 1], [2, 3], [5, 1], [1, 4], [3, 7]].every(([mm, kk]) => a * (Mm * mm + (a - 1) * kk + 1) - (a - 1) * (kk + 1) === Mm * (c0 * mm + c1 * kk + c2) + 1);
      const h2text = ([c0, c1, c2]) => poly([[c0, Mv], [c1, kV], [c2, '']]);
      const rows = cands.map((c) => ({ h: `㈎ ${c.s}, ㈏ ${h2text(c.h2)}, ㈐ ${ms(c.h3.replace('+', ' + '))}`, ok: c.s === '1' && okH2(c.h2) && c.h3 === 'k+1' }));
      return oneQ(d, `다음은 ${ALL} ${jh(X(Nv), '을/를')} ${josa(Mm, '으로/로')} 나눈 나머지는 1임을 수학적 귀납법으로 증명한 것이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`, [rows[0]].concat(d.shuffle(rows.slice(1)).slice(0, 4)), true, {
        figure: proofBox([
          `(i) ${Nv} = ${BX('㈎')}일 때 ${nb(pw(a, 1) + ' ' + MINUS + ' ' + (a - 1) + ' × 1 = 1')}을 ${josa(Mm, '으로/로')} 나눈 나머지는 1이다.`,
          `(ii) ${Nv} = ${kV}일 때 ${jh(X(kV), '을/를')} ${josa(Mm, '으로/로')} 나눈 나머지가 1이라고 가정하면 ${nb(X(kV) + ' = ' + Mm + Mv + ' + 1')}(${Mv}은 음이 아닌 정수)이므로 ${nb(pw(a, kV) + ' = ' + Mm + Mv + ' + ' + (a - 1) + kV + ' + 1')}이다. 이때`,
          `${nb(pw(a, kV + ' + 1') + ' ' + MINUS + ' ' + (a - 1) + '(' + kV + ' + 1)')} = ${nb(a + ' × ' + pw(a, kV) + ' ' + MINUS + ' ' + (a - 1) + '(' + kV + ' + 1)')}`,
          `= ${nb(Mm + '(' + BX('㈏') + ') + 1')}`,
          `이므로 나머지도 1이다. 따라서 ${Nv} = ${BX('㈐')}일 때도 성립한다.`,
          `(i), (ii)에 의하여 ${ALL} ${jh(X(Nv), '을/를')} ${josa(Mm, '으로/로')} 나눈 나머지는 1이다.`
        ]),
        explain: `시작하는 수는 ${Nv} = 1이므로 ㈎는 1이다. ${nb(a + '(' + Mm + Mv + ' + ' + (a - 1) + kV + ' + 1) ' + MINUS + ' ' + (a - 1) + '(' + kV + ' + 1)')} = ${nb(a * Mm + Mv + ' + ' + Mm + kV + ' + 1 = ' + Mm + '(' + a + Mv + ' + ' + kV + ') + 1')}이므로 ㈏는 ${nb(a + Mv + ' + ' + kV)}, ㈐는 ${ms('k + 1')}이다.`
      });
    }, { count: 3 }),

    T('ind-ineq', '부등식을 증명한 글의 빈칸', '①38', (d) => {
      const kind = d.int(0, 2);
      let eq, start, rows, A1, A2, B1s, Bfun, why;
      if (kind === 0) {
        start = 2; eq = `1 + ${frac(1, 2)} + ${frac(1, 3)} + ⋯ + ${frac(1, Nv)} &gt; ${frac('2' + Nv, ms('n + 1'))}`;
        A1 = [frac(4, 3), '1', frac(3, 2)]; A2 = [Q(4, 3), Q(1), Q(3, 2)];
        Bfun = (k) => qsub(Q(2 * k + 1, k + 1), Q(2 * (k + 1), k + 2));
        B1s = [[frac(kV, ms('(k + 1)(k + 2)')), (k) => Q(k, (k + 1) * (k + 2))], [MINUS + frac(kV, ms('(k + 1)(k + 2)')), (k) => Q(-k, (k + 1) * (k + 2))], [frac(1, ms('(k + 1)(k + 2)')), (k) => Q(1, (k + 1) * (k + 2))], [frac(kV, ms('(k + 1)^2')), (k) => Q(k, (k + 1) ** 2)]];
        rows = [
          `(i) ${Nv} = 2일 때 (좌변) = ${frac(3, 2)}, (우변) = ${BX('㈎')}이므로 ①이 성립한다.`,
          `(ii) ${nb(Nv + ' = ' + kV + ' (' + kV + ' ≥ 2)')}일 때 ①이 성립한다고 가정하면 ${nb('1 + ' + frac(1, 2) + ' + ⋯ + ' + frac(1, kV) + ' &gt; ' + frac('2' + kV, ms('k + 1')))}이므로 양변에 ${jh(frac(1, ms('k + 1')), '을/를')} 더하면`,
          `${nb('1 + ' + frac(1, 2) + ' + ⋯ + ' + frac(1, kV) + ' + ' + frac(1, ms('k + 1')) + ' &gt; ' + frac(ms('2k + 1'), ms('k + 1')))} ······②`,
          `이때 ${nb(frac(ms('2k + 1'), ms('k + 1')) + ' ' + MINUS + ' ' + frac(ms('2(k + 1)'), ms('k + 2')) + ' = ' + BX('㈏') + ' &gt; 0')} ······③`,
          `②, ③에 의하여 ${nb('1 + ' + frac(1, 2) + ' + ⋯ + ' + frac(1, ms('k + 1')) + ' &gt; ' + frac(ms('2(k + 1)'), ms('k + 2')))}이므로 ${nb(Nv + ' = ' + kV + ' + 1')}일 때도 ①이 성립한다.`
        ];
        why = `${Nv} = 2일 때 우변은 ${frac('2 × 2', '2 + 1')} = ${frac(4, 3)}이다. ${frac(ms('2k + 1'), ms('k + 1'))} ${MINUS} ${frac(ms('2(k + 1)'), ms('k + 2'))} = ${frac(ms('(2k + 1)(k + 2) - 2(k + 1)^2'), ms('(k + 1)(k + 2)'))} = ${frac(kV, ms('(k + 1)(k + 2)'))}이다.`;
      } else if (kind === 1) {
        start = 2; eq = `1 + ${frac(1, pw(2, 2))} + ${frac(1, pw(3, 2))} + ⋯ + ${frac(1, Nv + sup(2))} &lt; 2 ${MINUS} ${frac(1, Nv)}`;
        A1 = [frac(3, 2), '1', frac(5, 4)]; A2 = [Q(3, 2), Q(1), Q(5, 4)];
        Bfun = (k) => qsub(qsub(Q(2), Q(1, k + 1)), qadd(qsub(Q(2), Q(1, k)), Q(1, (k + 1) ** 2)));
        B1s = [[frac(1, ms('k(k + 1)^2')), (k) => Q(1, k * (k + 1) ** 2)], [frac(1, ms('k(k + 1)')), (k) => Q(1, k * (k + 1))], [MINUS + frac(1, ms('k(k + 1)^2')), (k) => Q(-1, k * (k + 1) ** 2)], [frac(1, ms('(k + 1)^2')), (k) => Q(1, (k + 1) ** 2)]];
        rows = [
          `(i) ${Nv} = 2일 때 (좌변) = ${frac(5, 4)}, (우변) = ${BX('㈎')}이므로 ①이 성립한다.`,
          `(ii) ${nb(Nv + ' = ' + kV + ' (' + kV + ' ≥ 2)')}일 때 ①이 성립한다고 가정하면 ${nb('1 + ' + frac(1, pw(2, 2)) + ' + ⋯ + ' + frac(1, kV + sup(2)) + ' &lt; 2 ' + MINUS + ' ' + frac(1, kV))}이므로 양변에 ${jh(frac(1, ms('(k + 1)^2')), '을/를')} 더하면`,
          `${nb('1 + ' + frac(1, pw(2, 2)) + ' + ⋯ + ' + frac(1, ms('(k + 1)^2')) + ' &lt; 2 ' + MINUS + ' ' + frac(1, kV) + ' + ' + frac(1, ms('(k + 1)^2')))} ······②`,
          `이때 ${nb('(2 ' + MINUS + ' ' + frac(1, ms('k + 1')) + ') ' + MINUS + ' (2 ' + MINUS + ' ' + frac(1, kV) + ' + ' + frac(1, ms('(k + 1)^2')) + ') = ' + BX('㈏') + ' &gt; 0')} ······③`,
          `②, ③에 의하여 ${nb('1 + ' + frac(1, pw(2, 2)) + ' + ⋯ + ' + frac(1, ms('(k + 1)^2')) + ' &lt; 2 ' + MINUS + ' ' + frac(1, ms('k + 1')))}이므로 ${nb(Nv + ' = ' + kV + ' + 1')}일 때도 ①이 성립한다.`
        ];
        why = `${Nv} = 2일 때 우변은 2 ${MINUS} ${frac(1, 2)} = ${frac(3, 2)}이다. ${frac(1, kV)} ${MINUS} ${frac(1, ms('k + 1'))} ${MINUS} ${frac(1, ms('(k + 1)^2'))} = ${frac(ms('(k + 1)^2 - k(k + 1) - k'), ms('k(k + 1)^2'))} = ${frac(1, ms('k(k + 1)^2'))}이다.`;
      } else {
        start = 5; eq = `${pw(2, Nv)} &gt; ${Nv}${sup(2)}`;
        A1 = ['25', '32', '10']; A2 = [Q(25), Q(32), Q(10)];
        Bfun = (k) => Q(2 * k * k - (k + 1) ** 2);
        B1s = [[ms('k^2 - 2k - 1'), (k) => Q(k * k - 2 * k - 1)], [ms('k^2 - 2k + 1'), (k) => Q(k * k - 2 * k + 1)], [ms('k^2 + 2k + 1'), (k) => Q(k * k + 2 * k + 1)], [ms('k^2 - 1'), (k) => Q(k * k - 1)]];
        rows = [
          `(i) ${Nv} = 5일 때 (좌변) = ${pw(2, 5)} = 32, (우변) = ${BX('㈎')}이므로 ①이 성립한다.`,
          `(ii) ${nb(Nv + ' = ' + kV + ' (' + kV + ' ≥ 5)')}일 때 ①이 성립한다고 가정하면 ${nb(pw(2, kV) + ' &gt; ' + kV + sup(2))}이므로`,
          `${nb(pw(2, ms('k + 1')) + ' = 2 × ' + pw(2, kV) + ' &gt; 2' + kV + sup(2))} ······②`,
          `이때 ${nb(kV + ' ≥ 5')}이므로 ${nb('2' + kV + sup(2) + ' ' + MINUS + ' (' + kV + ' + 1)' + sup(2) + ' = ' + BX('㈏') + ' &gt; 0')} ······③`,
          `②, ③에 의하여 ${nb(pw(2, ms('k + 1')) + ' &gt; (' + kV + ' + 1)' + sup(2))}이므로 ${nb(Nv + ' = ' + kV + ' + 1')}일 때도 ①이 성립한다.`
        ];
        why = `${Nv} = 5일 때 우변은 ${pw(5, 2)} = 25이다. ${nb('2' + kV + sup(2) + ' ' + MINUS + ' (' + kV + ' + 1)' + sup(2) + ' = ' + ms('k^2 - 2k - 1'))}이다.`;
      }
      const ks = Array.from({ length: 6 }, (_, i) => start + i);
      const startVal = kind === 0 ? Q(4, 3) : kind === 1 ? Q(3, 2) : Q(25);
      const combos = [[0, 0], [0, 1], [1, 0], [2, 2], [0, 3], [2, 0]];
      const list = combos.map(([i, j]) => ({ h: `㈎ ${A1[i]}, ㈏ ${B1s[j][0]}`, ok: A2[i].p === startVal.p && A2[i].q === startVal.q && sameK(B1s[j][1], Bfun, ks) }));
      return oneQ(d, `다음은 ${nb(Nv + ' ≥ ' + start)}인 모든 자연수 ${Nv}에 대하여 부등식 ①이 성립함을 수학적 귀납법으로 증명한 것이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, [list[0]].concat(d.shuffle(list.slice(1)).slice(0, 3)), true, {
        figure: eqRow(eq) + proofBox(rows.concat([`(i), (ii)에 의하여 ${nb(Nv + ' ≥ ' + start)}인 모든 자연수 ${Nv}에 대하여 ①이 성립한다.`])),
        explain: why
      });
    }),

    T('ind-seq', '관계식으로 정한 수열의 일반항을 확인하는 증명의 빈칸', '①39', (d) => {
      const b = d.pick([2, 3, 4]), m = d.int(1, 3);
      const f = (k) => Q((b - 1) * k + b, k * (k + 1)), g = (k) => qadd(Q(b ** (k + 1)), Q(1, k + 1)), r = qdiv(g(m), f(m));
      if (r.q === 1 || r.p > 9999 || r.q > 9999) return null;
      const cst = frac(poly([[b - 1, Nv], [b, '']]), ms('n + 1')), cstK = frac(poly([[b - 1, kV], [b, '']]), ms('k + 1'));
      const rel = `${Nv}${A('n+1')} ${MINUS} ${b}${Nv}${A('n')} + ${cst} = 0`;
      return ratQ(`수열 ${jh(SEQ, '이/가')} ${A(1)} = ${b + 1}이고 ${ALL} 등식 ${nb(rel)}을 만족시킨다. 다음은 ${ALL} ①이 성립함을 수학적 귀납법으로 증명한 것이다. ㈎, ㈏에 알맞은 식을 각각 ${V('f')}(${kV}), ${V('g')}(${kV})라 할 때, ${frac(V('g') + '(' + m + ')', V('f') + '(' + m + ')')}의 값은?`, r, {
        figure: eqRow(A('n') + ' = ' + pw(b, Nv) + ' + ' + frac(1, Nv)) + proofBox([
          `(i) ${Nv} = 1일 때 (좌변) = ${A(1)} = ${b + 1}, (우변) = ${pw(b, 1)} + ${frac(1, 1)} = ${b + 1}이므로 ①이 성립한다.`,
          `(ii) ${Nv} = ${kV}일 때 ①이 성립한다고 가정하면 ${nb(A(kV) + ' = ' + pw(b, kV) + ' + ' + frac(1, kV))}이다. 이때 ${nb(kV + A('k+1') + ' ' + MINUS + ' ' + b + kV + A(kV) + ' + ' + cstK + ' = 0')}에서`,
          `${nb(A('k+1') + ' = ' + b + A(kV) + ' ' + MINUS + ' ' + BX('㈎'))} = ${nb(b + '(' + pw(b, kV) + ' + ' + frac(1, kV) + ') ' + MINUS + ' ' + BX('㈎') + ' = ' + BX('㈏'))}`,
          `따라서 ${nb(Nv + ' = ' + kV + ' + 1')}일 때도 ①이 성립한다.`,
          `(i), (ii)에 의하여 ${ALL} ①이 성립한다.`
        ]),
        explain: `양변을 ${jh(kV, '으로/로')} 나누면 ${nb(A('k+1') + ' = ' + b + A(kV) + ' ' + MINUS + ' ' + frac(poly([[b - 1, kV], [b, '']]), ms('k(k + 1)')))}이므로 ${nb(V('f') + '(' + kV + ') = ' + frac(poly([[b - 1, kV], [b, '']]), ms('k(k + 1)')))}이다. ${nb(b + '(' + pw(b, kV) + ' + ' + frac(1, kV) + ') ' + MINUS + ' ' + V('f') + '(' + kV + ')')} = ${nb(pw(b, ms('k + 1')) + ' + ' + frac(1, ms('k + 1')))}이므로 ${nb(V('g') + '(' + kV + ') = ' + pw(b, ms('k + 1')) + ' + ' + frac(1, ms('k + 1')))}이다. ${V('f')}(${m}) = ${tx(f(m))}, ${V('g')}(${m}) = ${tx(g(m))}이므로 구하는 값은 ${tx(r)}이다.`,
        value: `(${b}**(${m}+1)+1/(${m}+1))/(((${b}-1)*${m}+${b})/(${m}*(${m}+1)))`
      });
    }),

    T('ind-split', '항을 쪼개 앞의 식으로 고치는 증명의 빈칸', '①41', (d) => {
      const S = (k) => (k * (k + 1)) / 2, LHS = (n) => Array.from({ length: n }, (_, i) => (i + 1) * (n - i)).reduce((s, v) => s + v, 0);
      const need = (k) => LHS(k + 1) - LHS(k) - (k + 1);   // ㈎가 나타내는 값
      const As = [['1 + 2 + 3 + ⋯ + ' + kV, (k) => S(k)], ['1 + 2 + 3 + ⋯ + (' + ms('k + 1') + ')', (k) => S(k + 1)], ['1 + 2 + 3 + ⋯ + (' + ms('k - 1') + ')', (k) => S(k - 1)], ['1 + 3 + 5 + ⋯ + (' + ms('2k - 1') + ')', (k) => k * k]];
      const Bs = [[frac(ms('(k + 1)(k + 2)'), 2), (k) => ((k + 1) * (k + 2)) / 2], [frac(ms('k(k + 1)'), 2), (k) => S(k)], [ms('(k + 1)^2'), (k) => (k + 1) ** 2], [frac(ms('(k + 1)(k + 2)'), 6), (k) => ((k + 1) * (k + 2)) / 6]];
      const combos = [[0, 0], [1, 0], [0, 1], [2, 1], [3, 2], [0, 3]];
      const list = combos.map(([i, j]) => ({ h: `㈎ ${As[i][0]}, ㈏ ${Bs[j][0]}`, ok: sameK(As[i][1], need) && sameK(Bs[j][1], (k) => As[i][1](k) + k + 1) && sameK((k) => (k * (k + 1) * (k + 2)) / 6 + Bs[j][1](k), (k) => ((k + 1) * (k + 2) * (k + 3)) / 6) }));
      const L = (h) => nb(h);
      return oneQ(d, `다음은 ${ALL} 등식 ①이 성립함을 수학적 귀납법으로 증명한 것이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, [list[0]].concat(d.shuffle(list.slice(1)).slice(0, 3)), true, {
        figure: eqRow(`${L('1 × ' + Nv)} + ${L('2 × (' + ms('n - 1') + ')')} + ⋯ + ${L('(' + ms('n - 1') + ') × 2')} + ${L(Nv + ' × 1')} = ${frac(ms('n(n + 1)(n + 2)'), 6)}`) + proofBox([
          `(i) ${Nv} = 1일 때 (좌변) = 1 × 1 = 1, (우변) = ${frac('1 × 2 × 3', 6)} = 1이므로 ①이 성립한다.`,
          `(ii) ${Nv} = ${kV}일 때 ①이 성립한다고 가정하면 ${L('1 × ' + kV)} + ${L('2 × (' + ms('k - 1') + ')')} + ⋯ + ${L(kV + ' × 1')} = ${frac(ms('k(k + 1)(k + 2)'), 6)}이므로`,
          `${L('1 × (' + ms('k + 1') + ')')} + ${L('2 × ' + kV)} + ⋯ + ${L(kV + ' × 2')} + ${L('(' + ms('k + 1') + ') × 1')}`,
          `= {${L('1 × ' + kV)} + ${L('2 × (' + ms('k - 1') + ')')} + ⋯ + ${L(kV + ' × 1')}} + (${BX('㈎')}) + (${ms('k + 1')})`,
          `= ${frac(ms('k(k + 1)(k + 2)'), 6)} + ${BX('㈏')} = ${frac(ms('(k + 1)(k + 2)(k + 3)'), 6)}`,
          `따라서 ${nb(Nv + ' = ' + kV + ' + 1')}일 때도 ①이 성립한다.`,
          `(i), (ii)에 의하여 ${ALL} ①이 성립한다.`
        ]),
        explain: `${Nv} = ${kV} + 1일 때 좌변의 각 항 ${nb('1 × (' + ms('k + 1') + ')')}, ${nb('2 × ' + kV)}, …, ${nb(kV + ' × 2')}에서 앞의 수만큼씩 떼어 내면 ${nb('{1 × ' + kV + ' + 2 × (' + ms('k - 1') + ') + ⋯ + ' + kV + ' × 1}')}과 ${nb('1 + 2 + ⋯ + ' + kV)}가 남고, 마지막 항 ${nb('(' + ms('k + 1') + ') × 1')}이 더 있다. 따라서 ㈎는 ${nb('1 + 2 + 3 + ⋯ + ' + kV)}이고, ㈏는 ${nb(frac(ms('k(k + 1)'), 2) + ' + (' + ms('k + 1') + ') = ' + frac(ms('(k + 1)(k + 2)'), 2))}이다.`
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
