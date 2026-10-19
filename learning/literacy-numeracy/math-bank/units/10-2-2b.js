// 고등학교 1학년 2학기 2단원 원의 방정식 — 뒤쪽 묶음(원과 직선의 위치 관계, 원의 접선의 방정식).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 10-2-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 위치 관계는 원의 중심과 직선 사이의 거리 d 와 반지름의 길이 r 을 견주어 판단한다(판별식으로 풀어도 같다 — 풀이에 둘 가운데 하나를 적는다).
// 접선의 방정식은 「기울기가 m 인 접선 y = mx ± r√(m² + 1)」「원 위의 점 (x₁, y₁)에서의 접선 x₁x + y₁y = r²」 두 공식과,
// 중심이 원점이 아닌 원은 「중심과 접선 사이의 거리 = 반지름의 길이」로 푼다.
// 답: 접선은 「y = [±][ ]x ± [ ]」·「y = [±][ ]x ± [ ]√[ ]」, 원 위의 점에서의 접선은 우변을 r² 으로 둔 「[±][ ]x [±][ ]y = r²」(계수가 1이어도 1을 적는다)로 받는다.
// 원 밖의 점에서 그은 두 접선은 「[±][ ]x [±][ ]y = r² 또는 [±][ ]x [±][ ]y = r²」(두 직선의 차례는 따지지 않는다)로 받는다 — 접점의 좌표가 곧 계수이다.
// 이 꼴의 원문은 접선이 모두 기울기를 가지는 것만 기본에 두었고, 한 접선이 좌표축에 평행한 꼴은 실력(10-2-2c.js)에 두었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, gcd, Q, qneg, mag, tx, nb, tail, js, V, sup, nz, pm, asQ, poly, pointAns, ineqAns, ansV, rt, grp, sqParts, radText, whereOnPlane, f1 } = B.kit.mid;
  const K = B.kit.m1022;
  const { S04, S05, T, X, Y, X2, Y2, VA, VB, VC, VK, VM, VN, VR, iq, jn, sgn, cx, pt, P2, sqT, stdL, stdE, genL, genE, toGen, lineY, lineG, endJ, ej, NOTE1, isSq, sqf, lattice, RICH, PYTH,
    circAns, circ0Ans, centerRadAns, valsQ, twoValsAns, lineAns, radNum, rootText, fig, figOk, AXIS } = K;
  const REL = ['서로 다른 두 점에서 만난다.', '한 점에서 만난다(접한다).', '만나지 않는다.'];
  const relWord = ['서로 다른 두 점에서 만난다', '한 점에서 만난다', '만나지 않는다'];
  // 수 v 의 절댓값을 셈하는 검사 식(v 를 셈하는 식 e 와 그 값의 부호)
  const absE = (e, v) => (v < 0 ? `(0-(${e}))` : `(${e})`);
  // x² + y² = R
  const circ0 = (R) => stdE(0, 0, R);
  // 거리의 제곱을 적는 글(분수 꼴)
  const dsq = (v, D) => iq(Q(v * v, D));
  // 직선 y = mx + k 의 글(k 는 문자)
  const lineYk = (m, name) => nb(`${Y} = ${poly([[m, X]])} + ${name}`);
  // 「y = [±][ ]x ± [ ]」·「y = [±][ ]x ± [ ]√[ ]」
  const pmLine = (text, m, k, q, o) => (q == null
    ? inline(text, `${Y} = {0}${X} ± {1}`, [{ answer: m, signed: true }, { answer: k }], Object.assign({}, o, { shown: nb(`${Y} = ${poly([[m, X]])} ± ${k}`) }))
    : inline(text, `${Y} = {0}${X} ± ` + grp('{1}' + rt('{2}')), [{ answer: m, signed: true }, { answer: k }, { answer: q }], Object.assign({}, o, { shown: nb(`${Y} = ${poly([[m, X]])} ± ${radText(k, q)}`) })));
  // 원 x² + y² = R 위의 점 (x₁, y₁)에서의 접선: 「[±][ ]x [±][ ]y = R」
  const polar = (x1, y1, R) => nb(`${poly([[x1, X], [y1, Y]])} = ${R}`);
  const tanAt = (text, x1, y1, R, o) => inline(text + NOTE1, `{0}${X} {1}${Y} = ${R}`, [{ answer: x1, signed: true }, { answer: y1, signed: true }], Object.assign({}, o, { shown: polar(x1, y1, R) }));
  // 직선의 법선 (a, b) 후보
  const NORMALS = [[1, 1], [1, -1], [1, 2], [2, 1], [1, -2], [2, -1], [1, 3], [3, 1], [1, -3], [3, -1], [2, 3], [3, -2]];
  const PNORM = [[3, 4], [4, 3], [3, -4], [4, -3], [5, 12], [12, 5], [5, -12], [12, -5]];
  // 거리 d = |v|/√D 와 반지름 √R 을 견준 관계(0 두 점, 1 접한다, 2 만나지 않는다)
  const relOf = (v, D, R) => (v * v < R * D ? 0 : v * v === R * D ? 1 : 2);
  const cmpWord = (rel) => ['&lt;', '=', '&gt;'][rel];
  // √(R(p² − R))/p 을 간단히 한 글(원 x² + y² = R 에 (p, 0)에서 그은 접선의 접점의 다른 좌표)
  // 원 x² + y² = R 에 (p, 0)에서 그은 접선이 y축과 만나는 점까지의 거리 R/√(R − R²/p²) = p√(R(p² − R))/(p² − R) 을 간단히 한 글
  const icpt = (R, p) => { const [k, s] = sqParts(R * (p * p - R)), g = gcd(p * k, p * p - R), top = s === 1 ? String(p * k / g) : radText(p * k / g, s); return (p * p - R) / g === 1 ? top : frac(top, (p * p - R) / g); };
  const otherT = (R, p) => { const [k, s] = sqParts(R * (p * p - R)), g = gcd(k, p), top = s === 1 ? String(k / g) : radText(k / g, s); return p / g === 1 ? top : frac(top, p / g); };


  // ── 원과 직선의 위치 관계 ──
  B.addGroup('10-2-2', {
    id: 'meet', title: '원과 직선의 위치 관계', standard: S05,
    types: [
      T('meet-judge', '원과 직선의 위치 관계 판단', '②33', (d, n) => {
        const want = d.int(0, 2);
        const [a, b] = n === 0 ? [nz(d, -3, 3), -1] : d.pick(NORMALS.concat(PNORM.slice(0, 4))), D = a * a + b * b;
        const p = n === 0 ? 0 : nz(d, -4, 4), q = n === 0 ? 0 : nz(d, -4, 4);
        let v, R;
        if (want === 1) {
          const step = isSq(D) ? Math.sqrt(D) : D, t = d.int(1, isSq(D) ? 3 : 2);
          v = pm(d) * step * t; R = v * v / D;
          if (!Number.isInteger(R)) return null;
        } else {
          v = nz(d, -12, 12); const edge = v * v / D;
          R = want === 0 ? d.int(Math.floor(edge) + 1, Math.floor(edge) + 6) : d.int(1, Math.ceil(edge) - 1);
          if (R < 1 || relOf(v, D, R) !== want) return null;
        }
        if (R > 60) return null;
        const c = v - a * p - b * q;
        if (n === 0 && c === 0) return null;
        const circle = n === 0 ? circ0(R) : genE(...toGen(p, q, R)), line = n === 0 ? lineY(a, c) : lineG(a, b, c);
        const center = n === 0 ? '원점' : `중심 ${pt(p, q)}`, lineAsG = a < 0 ? lineG(-a, -b, -c) : lineG(a, b, c);
        return C(`원 ${ej(circle, '과/와')} 직선 ${line}의 위치 관계는?`, REL, want, {
          explain: `${n === 0 ? '' : `원을 변형하면 ${stdE(p, q, R)}이다. `}${ej(center, '과/와')} 직선 ${lineAsG} 사이의 거리를 ${V('d')}라 하면 ${nb(`${V('d')}${sup(2)} = ${dsq(v, D)}`)}이고, 반지름의 길이의 제곱은 ${R}이다. ${nb(`${V('d')} ${cmpWord(want)} ${VR}`)}이므로 원과 직선은 ${relWord[want]}.`,
          facts: { truth: [0, 1, 2].map((i) => i === want), want: true, rule: 'judge-' + n }
        });
      }, { count: 2 }),
      T('meet-k-origin', '중심이 원점인 원과 기울기가 정해진 직선 — y절편의 값과 범위', '②34', (d, n) => {
        const m = d.pick([1, -1, 2, -2, 3, -3]), u = d.int(1, 2), R = (m * m + 1) * u * u, s = (m * m + 1) * u;
        if (R > 50) return null;
        const head = `원 ${ej(circ0(R), '과/와')} 직선 ${ej(lineYk(m, VK), '이/가')}`, sE = `(${R}*(${jn(m)}*${jn(m)}+1))**0.5`;
        const why = `원의 중심인 원점과 직선 ${lineYk(m, VK)} 사이의 거리는 ${nb(`|${VK}| ÷ ${rt(m * m + 1)}`)}이고 반지름의 길이는 ${rt(R)}이다.`;
        if (n === 0) {
          return inline(`${head} 서로 다른 두 점에서 만나도록 하는 실수 ${VK}의 값의 범위를 구하시오.`, `{0} &lt; ${VK} &lt; {1}`, [{ answer: -s, signed: true }, { answer: s, signed: true }], {
            shown: nb(`${iq(-s)} &lt; ${VK} &lt; ${s}`),
            explain: `${why} 거리가 반지름의 길이보다 작아야 하므로 ${nb(`|${VK}| &lt; ${rt(R)} × ${rt(m * m + 1)} = ${s}`)}, 곧 ${nb(`${iq(-s)} &lt; ${VK} &lt; ${s}`)}이다.`,
            facts: { calc: [[`0-${sE}`, 0], [sE, 1]], rule: 'ko-0' }
          });
        }
        if (n === 1) {
          return inline(`${head} 한 점에서 만나도록(접하도록) 하는 상수 ${VK}의 값을 구하시오.`, `${VK} = ±{0}`, [{ answer: s }], {
            shown: nb(`${VK} = ±${s}`),
            explain: `${why} 거리와 반지름의 길이가 같아야 하므로 ${nb(`|${VK}| = ${s}`)}, 곧 ${nb(`${VK} = ±${s}`)}이다.`,
            facts: { calc: [[sE, 0]], rule: 'ko-1' }
          });
        }
        if (n === 2) {
          return inline(`${head} 만나지 않도록 하는 실수 ${VK}의 값의 범위를 구하시오.`, `${VK} &lt; {0} 또는 ${VK} &gt; {1}`, [{ answer: -s, signed: true }, { answer: s, signed: true }], {
            shown: `${nb(`${VK} &lt; ${iq(-s)}`)} 또는 ${nb(`${VK} &gt; ${s}`)}`,
            explain: `${why} 거리가 반지름의 길이보다 커야 하므로 ${nb(`|${VK}| &gt; ${s}`)}, 곧 ${nb(`${VK} &lt; ${iq(-s)}`)} 또는 ${nb(`${VK} &gt; ${s}`)}이다.`,
            facts: { calc: [[`0-${sE}`, 0], [sE, 1]], rule: 'ko-2' }
          });
        }
        const most = d.bool();
        return N(`${head} 만나도록 하는 실수 ${VK}의 ${most ? '최댓값' : '최솟값'}은?`, most ? s : -s, { signed: true,
          explain: `${why} 만나려면 거리가 반지름의 길이보다 작거나 같아야 하므로 ${nb(`${iq(-s)} ≤ ${VK} ≤ ${s}`)}이다. 따라서 ${most ? '최댓값' : '최솟값'}은 ${iq(most ? s : -s)}이다.`,
          facts: { value: most ? sE : `0-${sE}`, rule: 'ko-3' }
        });
      }, { count: 4 }),
      T('meet-k-shift', '중심이 원점이 아닌 원과 직선 — 상수항의 범위', '②35', (d, n) => {
        const [a, b] = d.pick(NORMALS.concat(PNORM)), D = a * a + b * b, u = d.int(1, 2), R = isSq(D) ? u * u * d.int(1, 2) ** 2 : D * u * u, s = Math.sqrt(R * D);
        const p = nz(d, -4, 4), q = nz(d, -4, 4), v = a * p + b * q;
        if (!Number.isInteger(s) || R > 50 || v === 0) return null;
        const lo = -s - v, hi = s - v, line = nb(`${poly([[a, X], [b, Y]])} + ${VK} = 0`);
        if (lo === 0 || hi === 0) return null;
        const head = `원 ${ej(stdE(p, q, R), '과/와')} 직선 ${line}`, why = `원의 중심 ${ej(pt(p, q), '과/와')} 직선 사이의 거리는 ${nb(`|${iq(v)} + ${VK}| ÷ ${rt(D)}`)}이고 반지름의 길이는 ${rt(R)}이다.`;
        const vE = `(${jn(a)}*${jn(p)}+${jn(b)}*${jn(q)})`, sE = `(${R}*(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)}))**0.5`;
        if (n === 0) {
          return inline(`${ej(head, '이/가')} 서로 다른 두 점에서 만나도록 하는 실수 ${VK}의 값의 범위를 구하시오.`, `{0} &lt; ${VK} &lt; {1}`, [{ answer: lo, signed: true }, { answer: hi, signed: true }], {
            shown: nb(`${iq(lo)} &lt; ${VK} &lt; ${iq(hi)}`),
            explain: `${why} 거리가 반지름의 길이보다 작아야 하므로 ${nb(`|${VK} ${sgn(v)}| &lt; ${s}`)}, ${nb(`${iq(-s)} &lt; ${VK} ${sgn(v)} &lt; ${s}`)}에서 ${nb(`${iq(lo)} &lt; ${VK} &lt; ${iq(hi)}`)}이다.`,
            facts: { calc: [[`0-${sE}-${vE}`, 0], [`${sE}-${vE}`, 1]], rule: 'ks-0' }
          });
        }
        // 1이 바로 답이 되는 수(왼쪽 범위에 자연수가 있거나 오른쪽 끝이 1보다 작은 것)는 쓰지 않는다.
        if (lo >= 1 || hi < 1) return null;
        let k0 = 1; while (Math.abs(k0 + v) <= s) k0 += 1;
        if (k0 > 30 || k0 !== hi + 1) return null;
        return N(`${ej(head, '이/가')} 만나지 않도록 하는 자연수 ${VK}의 최솟값은?`, k0, {
          explain: `${why} 거리가 반지름의 길이보다 커야 하므로 ${nb(`|${VK} ${sgn(v)}| &gt; ${s}`)}, 곧 ${nb(`${VK} &lt; ${iq(lo)}`)} 또는 ${nb(`${VK} &gt; ${iq(hi)}`)}이다. 이를 만족시키는 가장 작은 자연수는 ${k0}이다.`,
          facts: { value: `${sE}-${vE}+1`, rule: 'ks-1' }
        });
      }, { count: 2 }),
      T('meet-slope-range', '정해진 점을 지나는 직선의 기울기의 범위', '②36', (d, n) => {
        const [R, n0] = d.pick(n === 0 ? [[1, 2], [1, 3], [4, 4], [4, 6], [9, 5], [16, 5], [9, 6], [25, 13], [2, 2], [5, 5], [3, 3]] : [[1, 2], [1, 3], [4, 4], [4, 6], [9, 6], [3, 3], [2, 4], [5, 5], [1, 4]]);
        const nn = pm(d) * n0, Tq = Q(n0 * n0 - R, R), num = Math.sqrt(Tq.p), den = Math.sqrt(Tq.q);
        const bT = Number.isInteger(num) && Number.isInteger(den) ? iq(Q(num, den)) : Tq.q === 1 ? rootText(Tq.p) : null;
        if (!bT) return null;
        const line = nb(`${Y} = ${VM}${X} ${sgn(nn)}`), head = `원 ${ej(circ0(R), '과/와')} 직선 ${line}`;
        const why = `원의 중심과 직선 ${nb(`${VM}${X} ${MINUS} ${Y} ${sgn(nn)} = 0`)} 사이의 거리는 ${nb(`${n0} ÷ ${rt(`${VM}${sup(2)} + 1`)}`)}이고 반지름의 길이는 ${rootText(R)}이다.`;
        if (n === 0) {
          const kind = d.int(0, 2), ask = ['서로 다른 두 점에서 만나도록', '만나도록', '만나지 않도록'][kind];
          const opts = [`${nb(`${VM} &lt; ${MINUS}${bT}`)} 또는 ${nb(`${VM} &gt; ${bT}`)}`, `${nb(`${VM} ≤ ${MINUS}${bT}`)} 또는 ${nb(`${VM} ≥ ${bT}`)}`, nb(`${MINUS}${bT} &lt; ${VM} &lt; ${bT}`), nb(`${MINUS}${bT} ≤ ${VM} ≤ ${bT}`)];
          const order = d.shuffle([0, 1, 2, 3]);
          return C(`${ej(head, '이/가')} ${ask} 하는 실수 ${VM}의 값의 범위는?`, order.map((i) => opts[i]), order.indexOf(kind), {
            explain: `${why} ${kind === 2 ? '거리가 반지름의 길이보다 커야' : kind === 1 ? '거리가 반지름의 길이보다 작거나 같아야' : '거리가 반지름의 길이보다 작아야'} 하므로 ${nb(`${VM}${sup(2)} ${kind === 2 ? '&lt;' : kind === 1 ? '≥' : '&gt;'} ${iq(Tq)}`)}이다. 기울기가 클수록 직선이 가팔라져 원을 지나므로, 만나는 쪽이 바깥 범위이다. 따라서 ${opts[kind]}이다.`,
            facts: { truth: order.map((i) => i === kind), want: true, rule: 'sr-0' }
          });
        }
        if (Number.isInteger(num) && Number.isInteger(den)) return null;
        let cnt = 0; for (let m = -20; m <= 20; m += 1) if (m * m * Tq.q < Tq.p) cnt += 1;
        return N(`${ej(head, '이/가')} 만나지 않도록 하는 정수 ${VM}의 개수는?`, cnt, {
          explain: `${why} 거리가 반지름의 길이보다 커야 하므로 ${nb(`${n0 * n0} &gt; ${R}(${VM}${sup(2)} + 1)`)}, 곧 ${nb(`${VM}${sup(2)} &lt; ${iq(Tq)}`)}이다. ${nb(`${MINUS}${bT} &lt; ${VM} &lt; ${bT}`)}인 정수는 ${cnt}개이다.`,
          facts: { value: `2*(((${n0}*${n0}-${R})/${R})**0.5-(((${n0}*${n0}-${R})/${R})**0.5)%1)+1`, rule: 'sr-1' }
        });
      }, { count: 2 }),
      T('meet-r-range', '원과 직선이 만나도록 하는 반지름의 길이', '②37', (d, n) => {
        const [a, b] = d.pick(PNORM), D = Math.sqrt(a * a + b * b), p = nz(d, -4, 4), q = nz(d, -4, 4);
        if (n === 0) {
          const t = d.int(1, 4), v = pm(d) * D * t, c = v - a * p - b * q;
          if (c === 0) return null;
          return ineqAns(`원 ${ej(nb(`${sqT(X, p)} + ${sqT(Y, q)} = ${VR}${sup(2)}`), '과/와')} 직선 ${ej(lineG(a, b, c), '이/가')} 서로 다른 두 점에서 만나도록 하는 ${VR}의 값의 범위를 구하시오. (단, ${nb(`${VR} &gt; 0`)})`, '>', t, VR, {
            explain: `원의 중심 ${ej(pt(p, q), '과/와')} 직선 사이의 거리는 ${nb(`|${iq(v)}| ÷ ${D} = ${t}`)}이다. 거리가 반지름의 길이보다 작아야 하므로 ${nb(`${VR} &gt; ${t}`)}이다.`,
            facts: { calc: [[absE(`${jn(a)}*${jn(p)}+${jn(b)}*${jn(q)}+${jn(c)}`, v) + `/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})**0.5`, 1]], rule: 'rr-0' }
          });
        }
        const v = nz(d, -40, 40), c = v - a * p - b * q;
        if (v % D === 0 || c === 0) return null;
        const dist = Math.abs(v) / D, ans = Math.floor(dist) + 1;
        if (dist < 1) return null;
        return N(`원 ${ej(nb(`${sqT(X, p)} + ${sqT(Y, q)} = ${VR}${sup(2)}`), '과/와')} 직선 ${ej(lineG(a, b, c), '이/가')} 서로 다른 두 점에서 만나도록 하는 자연수 ${VR}의 최솟값은?`, ans, {
          explain: `원의 중심 ${ej(pt(p, q), '과/와')} 직선 사이의 거리는 ${nb(`|${iq(v)}| ÷ ${D} = ${iq(Q(Math.abs(v), D))}`)}이다. ${nb(`${VR} &gt; ${iq(Q(Math.abs(v), D))}`)}이어야 하므로 자연수 ${VR}의 최솟값은 ${ans}이다.`,
          facts: { value: `${absE(`${jn(a)}*${jn(p)}+${jn(b)}*${jn(q)}+${jn(c)}`, v)}/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})**0.5-(${absE(`${jn(a)}*${jn(p)}+${jn(b)}*${jn(q)}+${jn(c)}`, v)}/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})**0.5)%1+1`, rule: 'rr-1' }
        });
      }, { count: 2 }),
      T('meet-tangent-circle', '중심과 접하는 직선이 주어진 원', '②38', (d, n) => {
        if (n === 0) {
          const [a, b] = d.pick(NORMALS.concat(PNORM)), D = a * a + b * b, t = d.int(1, 2), v = pm(d) * (isSq(D) ? Math.sqrt(D) : D) * t, R = v * v / D;
          const p = nz(d, -5, 5), q = nz(d, -5, 5), c = v - a * p - b * q;
          if (R > 80 || c === 0) return null;
          return circAns(`중심의 좌표가 ${pt(p, q)}이고 직선 ${ej(lineG(a, b, c), '에/에')} 접하는 원의 방정식을 구하시오.`, p, q, R, {
            explain: `반지름의 길이는 중심 ${ej(pt(p, q), '과/와')} 직선 사이의 거리이므로 그 제곱은 ${nb(`${iq(v * v)} ÷ ${D} = ${R}`)}이다. 따라서 ${stdE(p, q, R)}이다.`,
            facts: { calc: [[`0-${jn(p)}`, 0], [`0-${jn(q)}`, 1], [`(${jn(a)}*${jn(p)}+${jn(b)}*${jn(q)}+${jn(c)})*(${jn(a)}*${jn(p)}+${jn(b)}*${jn(q)}+${jn(c)})/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})`, 2]], rule: 'tc-0' }
          });
        }
        const [P, Qq, Hh] = d.pick([[4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13]]), sg = pm(d), t = d.int(1, 2), nn = pm(d) * Hh * t, r = Qq * t;
        const slope = Q(sg * P, Qq);
        return N(`직선 ${ej(lineY(slope, nn), '이/가')} 원 ${ej(nb(`${X2} + ${Y2} = ${VR}${sup(2)}`), '에/에')} 접할 때, 양수 ${VR}의 값은?`, r, {
          explain: `원의 중심인 원점과 직선 사이의 거리가 반지름의 길이와 같다. 직선을 ${ej(sg > 0 ? lineG(P, -Qq, nn * Qq) : lineG(P, Qq, -nn * Qq), '으로/로')} 고치면 거리는 ${nb(`|${nn * Qq}| ÷ ${rt(P * P + Qq * Qq)} = ${Math.abs(nn * Qq)} ÷ ${Hh} = ${r}`)}이다.`,
          facts: { value: `${Math.abs(nn)}/(1+${P}*${P}/(${Qq}*${Qq}))**0.5`, rule: 'tc-1' }
        });
      }, { count: 2 }),
      T('meet-tangent-coef', '원과 직선이 접하도록 하는 기울기', '②39', (d) => {
        const p = nz(d, -4, 4), q = d.int(-4, 4), R = d.pick([1, 2, 4, 5, 8, 9, 10]), c = d.int(-6, 6);
        const A = p * p - R, Bq = 2 * p * (c - q), Cq = (c - q) * (c - q) - R, disc = Bq * Bq - 4 * A * Cq;
        if (A === 0 || disc <= 0 || !isSq(disc)) return null;
        const k1 = (-Bq - Math.sqrt(disc)) / (2 * A), k2 = (-Bq + Math.sqrt(disc)) / (2 * A);
        if (!Number.isInteger(k1) || !Number.isInteger(k2) || k1 === 0 || k2 === 0 || k1 === -k2 || Math.abs(k1) > 9 || Math.abs(k2) > 9) return null;
        const [Ag, Bg, Cg] = toGen(p, q, R);
        const P = `(0-${jn(Ag)}/2)`, Qs = `(0-${jn(Bg)}/2)`, Rs = `(${P}*${P}+${Qs}*${Qs}-${jn(Cg)})`, cc = jn(c);
        const AE = `(${P}*${P}-${Rs})`, BE = `(2*${P}*(${cc}-${Qs}))`, CE = `((${cc}-${Qs})*(${cc}-${Qs})-${Rs})`, DE = `(${BE}*${BE}-4*${AE}*${CE})`;
        return twoValsAns(`원 ${ej(genE(Ag, Bg, Cg), '과/와')} 직선 ${ej(nb(`${Y} = ${VK}${X}${c ? ' ' + sgn(c) : ''}`), '이/가')} 접하도록 하는 상수 ${VK}의 값을 모두 구하시오.`, VK, k1, k2, {
          explain: `원을 변형하면 ${stdE(p, q, R)}이다. 중심 ${ej(pt(p, q), '과/와')} 직선 ${nb(`${VK}${X} ${MINUS} ${Y}${c ? ' ' + sgn(c) : ''} = 0`)} 사이의 거리가 ${rootText(R)}이어야 하므로 ${nb(`(${iq(p)}${VK} ${sgn(c - q)})${sup(2)} = ${R}(${VK}${sup(2)} + 1)`)}, 정리하면 ${nb(`${poly([[A, VK + sup(2)], [Bq, VK], [Cq, '']])} = 0`)}이다. 따라서 ${nb(`${VK} = ${iq(k1)}`)} 또는 ${nb(`${VK} = ${iq(k2)}`)}이다.`,
          facts: { calc: [[`(0-${BE}-${DE}**0.5)/(2*${AE})`, k1 < k2 === (A > 0) ? 0 : 1], [`(0-${BE}+${DE}**0.5)/(2*${AE})`, k1 < k2 === (A > 0) ? 1 : 0]] }
        });
      }),
      T('meet-chord', '원과 직선이 만나는 두 점 사이의 거리', '②40', (d) => {
        const [a, b] = d.pick(NORMALS.concat(PNORM)), D = a * a + b * b, p = nz(d, -4, 4), q = d.int(-4, 4), R = d.int(2, 30), v = d.int(-8, 8);
        const top = 4 * R * D - 4 * v * v;
        if (top <= 0 || top % D !== 0) return null;
        const Kc = top / D, [k, s] = sqParts(Kc), c = v - a * p - b * q;
        if (k < 2 || s < 2 || c === 0 || v === 0) return null;
        const [Ag, Bg, Cg] = toGen(p, q, R), h = Q(R * D - v * v, D);
        return radNum(`원 ${ej(genE(Ag, Bg, Cg), '과/와')} 직선 ${ej(lineG(a, b, c), '이/가')} 만나는 두 점 사이의 거리는?`, k, s, {
          explain: `원을 변형하면 ${stdE(p, q, R)}이다. 중심에서 직선까지의 거리를 ${V('d')}라 하면 ${nb(`${V('d')}${sup(2)} = ${dsq(v, D)}`)}이다. 두 점 사이의 거리의 절반을 ${V('l')}이라 하면 피타고라스 정리에 의하여 ${nb(`${V('l')}${sup(2)} = ${R} ${MINUS} ${dsq(v, D)} = ${iq(h)}`)}이므로, 구하는 거리는 ${nb(`2${V('l')} = ${rt(Kc)} = ${radText(k, s)}`)}이다.`,
          facts: { calc: [[`((4*(${jn(Ag)}*${jn(Ag)}/4+${jn(Bg)}*${jn(Bg)}/4-${jn(Cg)})-4*(${jn(a)}*(0-${jn(Ag)}/2)+${jn(b)}*(0-${jn(Bg)}/2)+${jn(c)})*(${jn(a)}*(0-${jn(Ag)}/2)+${jn(b)}*(0-${jn(Bg)}/2)+${jn(c)})/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)}))/${s})**0.5`, 0]], derived: [s], chord: [R, D, v] }
        });
      }),
      T('meet-chord-given', '두 점 사이의 거리가 주어질 때 미지수 구하기', '②41', (d, n) => {
        if (n === 0) {
          const [a, b] = d.pick([[1, -1], [1, 1], [1, 2], [2, 1], [1, -2]]), D = a * a + b * b, c = nz(d, -6, 6), R = d.pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17]);
          const L2 = Q(4 * R * D - 4 * c * c, D);
          if (L2.q !== 1 || L2.p <= 0) return null;
          return radNum(`직선 ${ej(lineG(a, b, c), '과/와')} 원 ${ej(nb(`${X2} + ${Y2} = ${VR}${sup(2)}`), '이/가')} 만나는 두 점 사이의 거리가 ${rootText(L2.p)}일 때, 양수 ${VR}의 값은?`, 1, R, {
            explain: `원의 중심인 원점과 직선 사이의 거리를 ${V('d')}라 하면 ${nb(`${V('d')}${sup(2)} = ${dsq(c, D)}`)}이다. 두 점 사이의 거리의 절반의 제곱은 ${iq(Q(L2.p, 4))}이므로 피타고라스 정리에 의하여 ${nb(`${VR}${sup(2)} = ${iq(Q(L2.p, 4))} + ${dsq(c, D)} = ${R}`)}, ${nb(`${VR} = ${radText(1, R)}`)}이다.`,
            facts: { calc: [[`${sqParts(L2.p)[0]}*${sqParts(L2.p)[0]}*${sqParts(L2.p)[1]}/4+${jn(c)}*${jn(c)}/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})`, 0]], rule: 'cg-0' }
          });
        }
        if (n === 1) {
          const [a, b] = d.pick([[1, -1], [1, 1], [1, 2], [1, -2]]), D = a * a + b * b, t = d.int(1, 2), half = d.int(1, 3), q = d.int(-3, 3), c0 = nz(d, -5, 5);
          const R = D * t * t + half * half, base = -b * q - c0, a1 = base - D * t, a2 = base + D * t;
          if (a1 === -a2 || a1 === 0 || a2 === 0 || R > 40) return null;
          return twoValsAns(`직선 ${ej(lineG(a, b, c0), '과/와')} 원 ${ej(nb(`(${X} ${MINUS} ${VA})${sup(2)} + ${sqT(Y, q)} = ${R}`), '이/가')} 만나는 두 점 사이의 거리가 ${2 * half}일 때, 상수 ${VA}의 값을 모두 구하시오.`, VA, a1, a2, {
            explain: `두 점 사이의 거리의 절반은 ${half}이므로 원의 중심 ${ej(pt(VA, q), '과/와')} 직선 사이의 거리를 ${V('d')}라 하면 ${nb(`${V('d')}${sup(2)} = ${R} ${MINUS} ${half * half} = ${R - half * half}`)}이다. ${nb(`|${VA} ${sgn(b * q + c0)}| ÷ ${rt(D)} = ${rt(R - half * half)}`)}에서 ${nb(`|${VA} ${sgn(b * q + c0)}| = ${D * t}`)}이므로 ${nb(`${VA} = ${iq(a1)}`)} 또는 ${nb(`${VA} = ${iq(a2)}`)}이다.`,
            facts: { calc: [[`0-${jn(b)}*${jn(q)}-${jn(c0)}-((${R}-${2 * half}*${2 * half}/4)*(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)}))**0.5`, 0], [`0-${jn(b)}*${jn(q)}-${jn(c0)}+((${R}-${2 * half}*${2 * half}/4)*(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)}))**0.5`, 1]], rule: 'cg-1' }
          });
        }
        const p = nz(d, -5, 5), q = nz(d, -4, 4), half = d.int(1, 4), c0 = d.int(-6, 6), k = p * p - c0 - half * half, R = q * q + half * half;
        if (k === 0) return null;
        const left = poly([[1, X2], [1, Y2], [-2 * p, X], [-2 * q, Y], [1, VK], [c0, '']]);
        return N(`원 ${ej(nb(`${left} = 0`), '이/가')} ${AXIS.x}과 만나는 두 점 사이의 거리가 ${2 * half}일 때, 상수 ${VK}의 값은?`, k, { signed: true,
          explain: `완전제곱식으로 고치면 ${nb(`${stdL(p, q)} = ${poly([[-1, VK], [p * p + q * q - c0, '']])}`)}이다. 중심 ${pt(p, q)}에서 ${AXIS.x}까지의 거리는 ${Math.abs(q)}, 두 점 사이의 거리의 절반은 ${half}이므로 반지름의 길이의 제곱은 ${nb(`${q * q} + ${half * half} = ${R}`)}이다. ${nb(`${p * p + q * q - c0} ${MINUS} ${VK} = ${R}`)}에서 ${nb(`${VK} = ${iq(k)}`)}이다.`,
          facts: { value: `${jn(-2 * p)}*${jn(-2 * p)}/4-${jn(c0)}-${2 * half}*${2 * half}/4`, rule: 'cg-2' }
        });
      }, { count: 3 }),
      T('meet-smallest-circle', '두 교점을 지나는 원 가운데 가장 작은 원', '②43', (d, n) => {
        const [a, b] = d.pick(NORMALS.concat(PNORM)), D = a * a + b * b, p = d.int(-4, 4), q = d.int(-4, 4), R = d.int(4, 40), v = d.int(-9, 9);
        const hq = Q(R * D - v * v, D);
        if (hq.q !== 1 || hq.p <= 0 || v === 0) return null;
        const h = hq.p, c = v - a * p - b * q;
        if (c === 0 || (n === 0 && !sqf(h))) return null;
        const circle = p === 0 && q === 0 ? circ0(R) : genE(...toGen(p, q, R)), why = `${p === 0 && q === 0 ? '' : `원을 변형하면 ${stdE(p, q, R)}이다. `}두 교점을 지나는 원 가운데 가장 작은 원은 두 교점을 이은 선분을 지름으로 하는 원이다. 중심에서 직선까지의 거리의 제곱은 ${dsq(v, D)}이므로 이 선분의 절반의 제곱은 ${nb(`${R} ${MINUS} ${dsq(v, D)} = ${h}`)}이다.`;
        const [Ag, Bg, Cg] = toGen(p, q, R), hE = `${jn(Ag)}*${jn(Ag)}/4+${jn(Bg)}*${jn(Bg)}/4-${jn(Cg)}-(${jn(a)}*(0-${jn(Ag)}/2)+${jn(b)}*(0-${jn(Bg)}/2)+${jn(c)})*(${jn(a)}*(0-${jn(Ag)}/2)+${jn(b)}*(0-${jn(Bg)}/2)+${jn(c)})/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})`;
        const hE0 = p === 0 && q === 0 ? `${R}-${jn(c)}*${jn(c)}/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})` : hE;
        const head = `원 ${ej(circle, '과/와')} 직선 ${ej(lineG(a, b, c), '이/가')} 만나는 두 점을 지나는 원 가운데`;
        if (n === 0) {
          return radNum(`${head} 둘레의 길이가 가장 짧은 원의 반지름의 길이는?`, 1, h, { explain: `${why} 따라서 반지름의 길이는 ${radText(1, h)}이다.`, facts: { calc: [[hE0, 0]], rule: 'sm-0' } });
        }
        return N(`${head} 가장 작은 원의 넓이는?`, h, { unit: 'π', explain: `${why} 따라서 넓이는 ${h}π이다.`, facts: { value: hE0, rule: 'sm-1' } });
      }, { count: 2 }),
      T('meet-slope-from-point', '정해진 점과 원 위의 점을 잇는 직선의 기울기', '②44', (d, n) => {
        const [aa, l1, l2] = d.pick([[5, 3, 4], [5, 4, 3], [13, 5, 12], [13, 12, 5], [10, 6, 8], [10, 8, 6], [17, 8, 15], [17, 15, 8]]), sx = pm(d), R = l1 * l1, g = gcd(l1, l2), bq = Q(l1, l2);
        const A0 = P2('A', sx * aa, 0), head = `점 ${ej(A0, '과/와')} 원 ${circ0(R)} 위의 점 P에 대하여 직선 AP의 기울기`;
        const why = `직선 AP의 기울기를 ${VM}이라 하면 직선 ${ej(nb(`${Y} = ${VM}(${X} ${sgn(-sx * aa)})`), '이/가')} 원과 만나야 하므로 원점과 직선 사이의 거리 ${ej(nb(`${aa}|${VM}| ÷ ${rt(`${VM}${sup(2)} + 1`)}`), '이/가')} ${l1}보다 작거나 같아야 한다. 정리하면 ${nb(`${VM}${sup(2)} ≤ ${iq(Q(R, aa * aa - R))}`)}, 곧 ${nb(`${MINUS}${iq(bq)} ≤ ${VM} ≤ ${iq(bq)}`)}이다(끝은 직선이 원에 접할 때이다).`;
        if (n === 0) {
          return F(`${head}의 최댓값은?`, l1 / g, l2 / g, { improper: l1 > l2, explain: `${why} 따라서 최댓값은 ${iq(bq)}이다.`, facts: { value: `(${R}/(${aa}*${aa}-${R}))**0.5`, rule: 'sp-0' } });
        }
        const bw = iq(Q(l2, l1)), bs = iq(bq);
        const opts = [nb(`${MINUS}${bs} ≤ ${VM} ≤ ${bs}`), nb(`${MINUS}${bs} &lt; ${VM} &lt; ${bs}`), `${nb(`${VM} ≤ ${MINUS}${bs}`)} 또는 ${nb(`${VM} ≥ ${bs}`)}`, nb(`${MINUS}${bw} ≤ ${VM} ≤ ${bw}`)];
        const order = d.shuffle([0, 1, 2, 3]);
        return C(`${ej(head, '을/를')} ${VM}이라 할 때, ${VM}의 값의 범위는?`, order.map((i) => opts[i]), order.indexOf(0), { explain: why, facts: { truth: order.map((i) => i === 0), want: true, rule: 'sp-1' } });
      }, { count: 2 }),
      T('meet-axes-line-tangent', '두 좌표축과 직선에 동시에 접하는 원', '②46', (d) => {
        const [P, Qq, Hh] = d.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13]]), big = P + Qq + Hh, small = P + Qq - Hh, base = Hh === 5 ? 12 : 60, t = Hh === 5 ? d.int(1, 2) : 1, c = base * t;
        const r1 = c / big, r2 = c / small;
        return M(`${AXIS.x}과 ${AXIS.y}에 동시에 접하고 중심이 제1사분면 위에 있는 원이 직선 ${ej(lineG(P, Qq, -c), '에/에')} 접할 때, 이 원의 반지름의 길이를 모두 구하시오.`, [{ answer: r1 }, { answer: r2 }], {
          unordered: true, shown: `${r1}, ${r2}`,
          explain: `반지름의 길이를 ${VR}라 하면 중심은 ${pt(VR, VR)}이다. 중심과 직선 사이의 거리가 ${VR}이므로 ${nb(`|${P + Qq}${VR} ${MINUS} ${c}| = ${Hh}${VR}`)}이다. ${nb(`${P + Qq}${VR} ${MINUS} ${c} = ${Hh}${VR}`)}에서 ${nb(`${VR} = ${r2}`)}, ${nb(`${P + Qq}${VR} ${MINUS} ${c} = ${MINUS}${Hh}${VR}`)}에서 ${nb(`${VR} = ${r1}`)}이다.`,
          facts: { calc: [[`${c}/(${P}+${Qq}+(${P}*${P}+${Qq}*${Qq})**0.5)`, 0], [`${c}/(${P}+${Qq}-(${P}*${P}+${Qq}*${Qq})**0.5)`, 1]] }
        });
      }),
      T('meet-axis-line-center', '직선과 x축에 동시에 접하고 반지름의 길이가 정해진 원의 중심', '②47', (d) => {
        const [A, Bc] = d.pick(PNORM), Hh = Math.sqrt(A * A + Bc * Bc), r = d.int(1, 4), Cc = nz(d, -15, 15), cands = [];
        for (const sg of [1, -1]) for (const tau of [1, -1]) { const num = tau * Hh * r - Bc * sg * r - Cc; if (num !== 0) cands.push([num / A, sg * r]); }
        const quad = ([x, y]) => (x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3)), byQ = {};
        for (const c of cands) (byQ[quad(c)] = byQ[quad(c)] || []).push(c);
        const lone = Object.keys(byQ).filter((k) => byQ[k].length === 1 && Number.isInteger(byQ[k][0][0]) && Math.abs(byQ[k][0][0]) <= 15);
        if (!lone.length) return null;
        const qn = Number(d.pick(lone)), [a0, b0] = byQ[qn][0], sg = b0 > 0 ? 1 : -1, tau = (A * a0 + Bc * b0 + Cc) > 0 ? 1 : -1;
        return pointAns(`직선 ${ej(lineG(A, Bc, Cc), '과/와')} ${AXIS.x}에 동시에 접하고 반지름의 길이가 ${r}인 원 가운데 중심이 제${qn}사분면 위에 있는 원의 중심의 좌표를 구하시오.`, a0, b0, {
          explain: `${AXIS.x}에 접하고 반지름의 길이가 ${r}이므로 중심의 ${Y}좌표는 ${iq(b0)}이다(중심이 제${qn}사분면 위에 있다). 중심을 ${pt(VA, b0)}라 하면 중심과 직선 사이의 거리가 ${r}이므로 ${nb(`|${iq(A)}${VA} ${sgn(Bc * b0 + Cc)}| = ${Hh * r}`)}이다. 두 값 가운데 제${qn}사분면에 맞는 것은 ${nb(`${VA} = ${iq(a0)}`)}이다.`,
          facts: { calc: [[`(${tau}*(${jn(A)}*${jn(A)}+${jn(Bc)}*${jn(Bc)})**0.5*${r}-${jn(Bc)}*${jn(b0)}-${jn(Cc)})/${jn(A)}`, 0], [jn(b0), 1]], derived: [Math.abs(tau)] }
        });
      }),
      T('meet-circle-line-min', '원 위의 점과 직선 위의 점 사이의 거리의 최솟값', '①25', (d) => {
        const [a, b] = d.pick(PNORM), Hh = Math.sqrt(a * a + b * b), p = nz(d, -4, 4), q = nz(d, -4, 4), r = d.int(1, 4), dd = r + d.int(1, 4), v = pm(d) * Hh * dd, c = v - a * p - b * q;
        if (c === 0) return null;
        const [Ag, Bg, Cg] = toGen(p, q, r * r);
        return N(`원 ${genE(Ag, Bg, Cg)} 위의 점 P와 직선 ${lineG(a, b, c)} 위의 점 Q에 대하여 선분 PQ의 길이의 최솟값은?`, dd - r, {
          explain: `원을 변형하면 ${stdE(p, q, r * r)}이다. 중심 ${ej(pt(p, q), '과/와')} 직선 사이의 거리는 ${ej(nb(`|${iq(v)}| ÷ ${Hh} = ${dd}`), '으로/로')} 반지름의 길이 ${r}보다 크다. 선분 PQ는 중심에서 직선에 내린 수선 위에 있을 때 가장 짧으므로 최솟값은 ${nb(`${dd} ${MINUS} ${r} = ${dd - r}`)}이다.`,
          facts: { value: `${absE(`${jn(a)}*(0-${jn(Ag)}/2)+${jn(b)}*(0-${jn(Bg)}/2)+${jn(c)}`, v)}/(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})**0.5-(${jn(Ag)}*${jn(Ag)}/4+${jn(Bg)}*${jn(Bg)}/4-${jn(Cg)})**0.5` }
        });
      }),
      T('meet-parallel-area', '평행한 두 직선에 동시에 접하는 원의 넓이', '①31', (d) => {
        const [a, b] = d.pick(NORMALS.concat(PNORM)), D = a * a + b * b, z = d.int(1, 2), diff = (isSq(D) ? 2 * Math.sqrt(D) : 2 * D) * z, area = isSq(D) ? z * z : D * z * z;
        const c1 = d.int(-8, 8), c2 = c1 + (d.bool() ? diff : -diff);
        if (c1 === 0 || c2 === 0 || Math.abs(c2) > 30) return null;
        return N(`평행한 두 직선 ${lineG(a, b, c1)}, ${ej(lineG(a, b, c2), '에/에')} 동시에 접하는 원의 넓이는?`, area, { unit: 'π',
          explain: `두 직선에 동시에 접하는 원의 지름의 길이는 두 직선 사이의 거리와 같다. 거리는 ${nb(`|${iq(c1)} ${MINUS} ${iq(c2).replace(MINUS, '(' + MINUS) + (c2 < 0 ? ')' : '')}| ÷ ${rt(D)}`)}이므로 반지름의 길이의 제곱은 ${nb(`${diff * diff} ÷ (4 × ${D}) = ${area}`)}이다. 따라서 넓이는 ${area}π이다.`,
          facts: { value: `(${jn(c1)}-${jn(c2)})*(${jn(c1)}-${jn(c2)})/(4*(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)}))` }
        });
      })
    ]
  });

  // ── 원의 접선의 방정식 ──
  B.addGroup('10-2-2', {
    id: 'tangent', title: '원의 접선의 방정식', standard: S05,
    types: [
      T('tan-slope', '기울기가 주어진 접선의 방정식', '②48', (d, n) => {
        const m = d.pick([2, -2, 3, -3]);
        if (n === 0) {
          const u = d.int(1, 2), R = (m * m + 1) * u * u, s = (m * m + 1) * u;
          return pmLine(`원 ${ej(circ0(R), '에/에')} 접하고 기울기가 ${iq(m)}인 직선의 방정식을 구하시오.`, m, s, null, {
            explain: `원 ${nb(`${X2} + ${Y2} = ${VR}${sup(2)}`)}에 접하고 기울기가 ${VM}인 직선은 ${nb(`${Y} = ${VM}${X} ± ${VR}${rt(`${VM}${sup(2)} + 1`)}`)}이다. ${nb(`${rt(R)} × ${rt(m * m + 1)} = ${s}`)}이므로 ${nb(`${Y} = ${poly([[m, X]])} ± ${s}`)}이다.`,
            facts: { calc: [[jn(m), 0], [`(${R}*(${jn(m)}*${jn(m)}+1))**0.5`, 1]], rule: 'ts-0' }
          });
        }
        const r = d.int(2, 4), R = r * r;
        return pmLine(`원 ${ej(circ0(R), '에/에')} 접하고 기울기가 ${iq(m)}인 직선의 방정식을 구하시오.`, m, r, m * m + 1, {
          explain: `원 ${nb(`${X2} + ${Y2} = ${VR}${sup(2)}`)}에 접하고 기울기가 ${VM}인 직선은 ${nb(`${Y} = ${VM}${X} ± ${VR}${rt(`${VM}${sup(2)} + 1`)}`)}이다. 반지름의 길이가 ${r}이므로 ${nb(`${Y} = ${poly([[m, X]])} ± ${radText(r, m * m + 1)}`)}이다.`,
          facts: { calc: [[jn(m), 0], [`${R}**0.5`, 1], [`${jn(m)}*${jn(m)}+1`, 2]], rule: 'ts-1' }
        });
      }, { count: 2 }),
      T('tan-parallel-perp', '평행·수직 조건이 붙은 접선의 방정식', '②49', (d, n) => {
        const m = d.pick([1, -1, 2, -2, 3, -3]), R = d.int(2, 30), [k, s] = sqParts(R * (m * m + 1)), c0 = nz(d, -6, 6);
        if (k < 2 || s < 2 || isSq(R)) return null;
        const given = n === 0 ? lineG(m, -1, c0) : lineG(1, m, c0), rel = n === 0 ? '평행한' : '수직인';
        const slopeWhy = n === 0 ? `직선 ${given}의 기울기는 ${iq(m)}이므로 접선의 기울기도 ${iq(m)}이다.` : `직선 ${given}의 기울기는 ${iq(Q(-1, m))}이므로 이에 수직인 접선의 기울기는 ${iq(m)}이다.`;
        const kE = `((${R}*(${jn(m)}*${jn(m)}+1))/${s})**0.5`;
        if (n < 2) {
          return pmLine(`원 ${ej(circ0(R), '에/에')} 접하고 직선 ${ej(given, '에/에')} ${rel} 직선의 방정식을 구하시오.`, m, k, s, {
            explain: `${slopeWhy} 공식에 넣으면 ${nb(`${Y} = ${poly([[m, X]])} ± ${rt(R)} × ${rt(m * m + 1)}`)}, 곧 ${nb(`${Y} = ${poly([[m, X]])} ± ${radText(k, s)}`)}이다.`,
            facts: { calc: [[jn(m), 0], [kE, 1], [String(s), 2]], derived: [s], rule: 'pp-' + n }
          });
        }
        // 접점이 놓인 사분면으로 하나를 고른다: 접점은 (−mn/(m² + 1), n/(m² + 1))
        const sg = pm(d), quad = sg > 0 ? (m > 0 ? 2 : 1) : (m > 0 ? 4 : 3);
        return inline(`원 ${ej(circ0(R), '에/에')} 접하고 직선 ${ej(given, '에/에')} 수직인 직선 가운데 원과 제${quad}사분면에서 접하는 직선의 방정식을 구하시오.`, `${Y} = {0}${X} ` + grp('{1}' + rt('{2}')), [{ answer: m, signed: true }, { answer: sg * k, signed: true }, { answer: s }], {
          shown: nb(`${Y} = ${poly([[m, X]])} ${sg > 0 ? '+' : MINUS} ${radText(k, s)}`),
          explain: `${slopeWhy} 접선은 ${nb(`${Y} = ${poly([[m, X]])} ± ${radText(k, s)}`)}이다. 기울기가 ${m > 0 ? '양수' : '음수'}인 접선이 제${quad}사분면에서 원에 접하려면 ${Y}절편이 ${sg > 0 ? '양수' : '음수'}여야 하므로 ${nb(`${Y} = ${poly([[m, X]])} ${sg > 0 ? '+' : MINUS} ${radText(k, s)}`)}이다.`,
          facts: { calc: [[jn(m), 0], [sg > 0 ? kE : `0-${kE}`, 1], [String(s), 2]], derived: [s], rule: 'pp-2' }
        });
      }, { count: 3 }),
      T('tan-formula-back', '접선의 방정식에서 기울기와 반지름의 길이 거꾸로 구하기', '②50', (d) => {
        const a = d.pick([2, -2, 3, -3]), R = d.pick([8, 12, 18, 20, 24, 27, 28, 32, 45, 50]), [rk, rs] = sqParts(R), [K2, S2] = sqParts(R * (a * a + 1)), c0 = nz(d, -6, 6);
        if (S2 < 2) return null;
        return inline(`원 ${ej(nb(`${X2} + ${Y2} = ${VR}${sup(2)}`), '에/에')} 접하고 직선 ${ej(lineG(1, a, c0), '에/에')} 수직인 접선의 방정식이 ${ej(nb(`${Y} = ${VA}${X} ± ${radText(K2, S2)}`), '일/일').slice(0, -1)}일 때, 상수 ${VA}, ${VR}의 값을 구하시오. (단, ${nb(`${VR} &gt; 0`)})`, grp(`${VA} = {0}`) + ', ' + grp(`${VR} = {1}` + rt('{2}')), [{ answer: a, signed: true }, { answer: rk }, { answer: rs }], {
          shown: `${nb(`${VA} = ${iq(a)}`)}, ${nb(`${VR} = ${radText(rk, rs)}`)}`,
          explain: `직선 ${lineG(1, a, c0)}의 기울기는 ${iq(Q(-1, a))}이므로 이에 수직인 접선의 기울기는 ${iq(a)}이고 ${nb(`${VA} = ${iq(a)}`)}이다. 접선은 ${nb(`${Y} = ${poly([[a, X]])} ± ${VR}${rt(a * a + 1)}`)}이므로 ${nb(`${VR}${rt(a * a + 1)} = ${radText(K2, S2)}`)}에서 ${nb(`${VR}${sup(2)} = ${R}`)}, ${nb(`${VR} = ${radText(rk, rs)}`)}이다.`,
          facts: { calc: [[jn(a), 0], [`((${K2}*${K2}*${S2}/(${jn(a)}*${jn(a)}+1))/${rs})**0.5`, 1], [String(rs), 2]], derived: [rs] }
        });
      }),
      T('tan-two-parallel', '기울기가 같은 두 접선 사이의 거리', '②51', (d, n) => {
        const m = d.pick([1, -1, 2, -2, 3, -3]);
        if (n === 0) {
          const R = d.int(2, 30), [k, s] = sqParts(R);
          if (s === 1) return null;
          return radNum(`원 ${ej(circ0(R), '에/에')} 접하고 기울기가 ${iq(m)}인 두 직선 사이의 거리는?`, 2 * k, s, {
            explain: `두 접선은 원의 중심에 대하여 대칭인 평행한 두 직선이므로 그 사이의 거리는 원의 지름의 길이와 같다. 반지름의 길이가 ${radText(k, s)}이므로 거리는 ${radText(2 * k, s)}이다.`,
            facts: { calc: [[`2*(${R}/${s})**0.5`, 0], [String(s), 1]], derived: [s], rule: 'tp-0' }
          });
        }
        const u = d.int(1, 2), R = (m * m + 1) * u * u, s = (m * m + 1) * u;
        if (R > 50) return null;
        return N(`원 ${ej(circ0(R), '에/에')} 접하고 기울기가 ${iq(m)}인 두 직선이 ${AXIS.y}과 만나는 점을 각각 P, Q라 할 때, 선분 PQ의 길이는?`, 2 * s, {
          explain: `두 접선은 ${nb(`${Y} = ${poly([[m, X]])} ± ${rt(R)}${rt(m * m + 1)}`)}, 곧 ${nb(`${Y} = ${poly([[m, X]])} ± ${s}`)}이다. ${AXIS.y}과 만나는 점은 ${pt(0, s)}, ${ej(pt(0, -s), '이므로/이므로').slice(0, -3)}이므로 ${nb(`PQ = ${2 * s}`)}이다.`,
          facts: { value: `2*(${R}*(${jn(m)}*${jn(m)}+1))**0.5`, rule: 'tp-1' }
        });
      }, { count: 2 }),
      T('tan-at-point', '원 위의 점에서의 접선의 방정식', '②52', (d, n) => {
        if (n === 0) {
          const R = d.pick([2, 5, 8, 10, 13, 17, 18, 20, 25, 26, 29, 34, 40, 41, 45, 50, 52]), [x1, y1] = d.pick(lattice(R).filter(([x, y]) => x !== 0 && y !== 0));
          return tanAt(`원 ${circ0(R)} 위의 점 ${pt(x1, y1)}에서의 접선의 방정식을 구하시오.`, x1, y1, R, {
            explain: `원 ${nb(`${X2} + ${Y2} = ${VR}${sup(2)}`)} 위의 점 ${pt(V('x') + '<sub>1</sub>', V('y') + '<sub>1</sub>')}에서의 접선의 방정식은 ${nb(`${X}<sub>1</sub>${X} + ${Y}<sub>1</sub>${Y} = ${VR}${sup(2)}`)}이다. 따라서 ${polar(x1, y1, R)}이다.`,
            facts: { calc: [[jn(x1), 0], [jn(y1), 1]], rule: 'ta-0' }
          });
        }
        const r = d.int(2, 7), R = r * r, which = d.int(0, 3), P0 = [[r, 0], [-r, 0], [0, r], [0, -r]][which];
        const opts = [nb(`${X} = ${r}`), nb(`${X} = ${MINUS}${r}`), nb(`${Y} = ${r}`), nb(`${Y} = ${MINUS}${r}`)];
        return C(`원 ${circ0(R)} 위의 점 ${pt(P0[0], P0[1])}에서의 접선의 방정식은?`, opts, which, {
          explain: `공식 ${nb(`${X}<sub>1</sub>${X} + ${Y}<sub>1</sub>${Y} = ${VR}${sup(2)}`)}에 넣으면 ${nb(`${iq(P0[0])}${X} + ${iq(P0[1])}${Y} = ${R}`)}, 곧 ${opts[which]}이다. 좌표축 위의 점에서의 접선은 반지름에 수직이라 좌표축에 평행하다.`,
          facts: { truth: [0, 1, 2, 3].map((i) => i === which), want: true, rule: 'ta-1' }
        });
      }, { count: 2 }),
      T('tan-at-point-use', '원 위의 점에서의 접선의 활용', '②53', (d, n) => {
        if (n === 0) {
          const R = d.pick([5, 10, 13, 17, 20, 25, 26, 29, 34, 40]), [x1, y1] = d.pick(lattice(R).filter(([x, y]) => x !== 0 && y !== 0)), t = d.int(-6, 6), top = R - y1 * t;
          if (t === y1 || top % x1 !== 0 || top / x1 === 0 || Math.abs(top / x1) > 30) return null;
          const k = top / x1;
          return N(`원 ${circ0(R)} 위의 점 ${pt(x1, y1)}에서의 접선이 점 ${ej(pt(VK, t), '을/를')} 지날 때, 상수 ${VK}의 값은?`, k, { signed: true,
            explain: `점 ${pt(x1, y1)}에서의 접선은 ${polar(x1, y1, R)}이다. 점 ${ej(pt(VK, t), '을/를')} 대입하면 ${nb(`${iq(x1)}${VK} ${sgn(y1 * t)} = ${R}`)}, ${nb(`${VK} = ${iq(k)}`)}이다.`,
            facts: { value: `(${R}-${jn(y1)}*${jn(t)})/${jn(x1)}`, rule: 'tu-0' }
          });
        }
        const R = d.pick([2, 5, 10, 13, 17, 26, 29]), [x1, y1] = d.pick(lattice(R).filter(([x, y]) => x !== 0 && y !== 0)), u = d.int(-5, 5), v = d.int(-5, 5), w = x1 * u + y1 * v - R;
        if (w === 0 || w % R !== 0 || Math.abs(w / R) < 2 || (u * u + v * v === R)) return null;
        const c = Math.abs(w / R);
        return radNum(`원 ${circ0(R)} 위의 점 ${pt(x1, y1)}에서의 접선을 ${V('l')}이라 할 때, 점 ${ej(pt(u, v), '과/와')} 직선 ${V('l')} 사이의 거리는?`, c, R, {
          explain: `직선 ${V('l')}은 ${polar(x1, y1, R)}이다. 점 ${ej(pt(u, v), '과/와')} 이 직선 사이의 거리는 ${nb(`|${iq(x1 * u)} ${sgn(y1 * v)} ${MINUS} ${R}| ÷ ${rt(R)} = ${Math.abs(w)} ÷ ${rt(R)} = ${radText(c, R)}`)}이다.`,
          facts: { calc: [[absE(`${jn(x1)}*${jn(u)}+${jn(y1)}*${jn(v)}-${R}`, w) + `/${R}`, 0], [String(R), 1]], rule: 'tu-1' }
        });
      }, { count: 2 }),
      T('tan-two-points-meet', '원 위의 두 점에서의 접선의 교점', '②54', (d) => {
        const R = d.pick([5, 10, 13, 20, 25, 26, 29, 50, 65]), L = lattice(R).filter(([x, y]) => x !== 0 || y !== 0), [[x1, y1], [x2, y2]] = d.shuffle(L).slice(0, 2), det = x1 * y2 - x2 * y1;
        if (det === 0 || (R * (y2 - y1)) % det !== 0 || (R * (x1 - x2)) % det !== 0) return null;
        const px = R * (y2 - y1) / det, py = R * (x1 - x2) / det;
        if (Math.abs(px) > 15 || Math.abs(py) > 15) return null;
        return pointAns(`원 ${circ0(R)} 위의 점 ${pt(x1, y1)}에서의 접선과 점 ${pt(x2, y2)}에서의 접선의 교점의 좌표를 구하시오.`, px, py, {
          explain: `두 접선은 ${polar(x1, y1, R)}, ${ej(polar(x2, y2, R), '이다/이다').slice(0, -2)}이다. 두 식을 연립하면 ${nb(`${X} = ${iq(px)}`)}, ${nb(`${Y} = ${iq(py)}`)}이므로 교점은 ${pt(px, py)}이다.`,
          facts: { calc: [[`${R}*(${jn(y2)}-${jn(y1)})/(${jn(x1)}*${jn(y2)}-${jn(x2)}*${jn(y1)})`, 0], [`${R}*(${jn(x1)}-${jn(x2)})/(${jn(x1)}*${jn(y2)}-${jn(x2)}*${jn(y1)})`, 1]] }
        });
      }),
      T('tan-perp-to-point-tangent', '원 위의 점에서의 접선에 수직인 접선', '②55', (d, n) => {
        const x1 = nz(d, -3, 3), t = d.pick([1, -1, 2, -2, 3, -3]), y1 = t * x1, R = x1 * x1 * (1 + t * t), s = Math.abs(x1) * (1 + t * t);
        if (R > 60) return null;
        const head = `원 ${circ0(R)} 위의 점 ${pt(x1, y1)}에서의 접선을 ${V('l')}이라 할 때, 이 원에 접하고 직선 ${ej(V('l'), '에/에')} 수직인 두 직선`;
        const why = `직선 ${V('l')}은 ${ej(polar(x1, y1, R), '이고/이고').slice(0, -2)}이고 기울기는 ${iq(Q(-x1, y1))}이므로, 이에 수직인 접선의 기울기는 ${iq(t)}이다. 기울기가 ${iq(t)}인 접선은 ${nb(`${Y} = ${poly([[t, X]])} ± ${rt(R)}${rt(1 + t * t)}`)}, 곧 ${nb(`${Y} = ${poly([[t, X]])} ± ${s}`)}이다.`;
        const sE = `(${R}*(1+${jn(y1)}*${jn(y1)}/(${jn(x1)}*${jn(x1)})))**0.5`;
        if (n === 0) {
          return pmLine(`${head}의 방정식을 구하시오.${Math.abs(t) === 1 ? NOTE1 : ''}`, t, s, null, { explain: why, facts: { calc: [[`${jn(y1)}/${jn(x1)}`, 0], [sE, 1]], rule: 'pt-0' } });
        }
        return N(`${head}이 ${AXIS.y}과 만나는 두 점 사이의 거리는?`, 2 * s, { explain: `${why} 두 직선이 ${AXIS.y}과 만나는 점은 ${pt(0, s)}, ${ej(pt(0, -s), '이므로/이므로').slice(0, -3)}이므로 거리는 ${2 * s}이다.`, facts: { value: `2*${sE}`, rule: 'pt-1' } });
      }, { count: 2 }),
      T('tan-slope-point-meet', '기울기가 주어진 접선과 원 위의 점에서의 접선의 교점', '②56', (d) => {
        const m = d.pick([1, -1, 2, -2, 3, -3]), u = d.int(1, 2), R = (m * m + 1) * u * u, s = (m * m + 1) * u;
        if (R > 50) return null;
        const [x1, y1] = d.pick(lattice(R).filter(([x, y]) => x !== 0 && y !== 0)), den = x1 + y1 * m, top = R - y1 * s;
        if (den === 0 || top % den !== 0) return null;
        const px = top / den, py = m * px + s;
        if (px === x1 && py === y1) return null;
        return pointAns(`원 ${ej(circ0(R), '에/에')} 접하고 기울기가 ${iq(m)}인 직선 가운데 ${Y}절편이 양수인 직선과, 원 위의 점 ${pt(x1, y1)}에서의 접선의 교점의 좌표를 구하시오.`, px, py, {
          explain: `기울기가 ${iq(m)}인 접선은 ${nb(`${Y} = ${poly([[m, X]])} ± ${s}`)}이고 ${Y}절편이 양수인 것은 ${ej(lineY(m, s), '이다/이다').slice(0, -2)}이다. 점 ${pt(x1, y1)}에서의 접선은 ${ej(polar(x1, y1, R), '이다/이다').slice(0, -2)}이다. 두 식을 연립하면 교점은 ${pt(px, py)}이다.`,
          facts: { calc: [[`(${R}-${jn(y1)}*(${R}*(${jn(m)}*${jn(m)}+1))**0.5)/(${jn(x1)}+${jn(y1)}*${jn(m)})`, 0], [`${jn(m)}*(${R}-${jn(y1)}*(${R}*(${jn(m)}*${jn(m)}+1))**0.5)/(${jn(x1)}+${jn(y1)}*${jn(m)})+(${R}*(${jn(m)}*${jn(m)}+1))**0.5`, 1]] }
        });
      }),
      T('tan-area-axes', '원 위의 점에서의 접선과 좌표축으로 둘러싸인 넓이', '②57', (d) => {
        const R = d.pick([5, 8, 10, 13, 17, 18, 20, 25, 26, 32, 40, 45, 50]), [x1, y1] = d.pick(lattice(R).filter(([x, y]) => x !== 0 && y !== 0));
        if ((R * R) % (2 * Math.abs(x1 * y1)) !== 0) return null;
        const area = R * R / (2 * Math.abs(x1 * y1));
        if (area > 400) return null;
        return N(`원 ${circ0(R)} 위의 점 ${pt(x1, y1)}에서의 접선과 ${AXIS.x}, ${AXIS.y}으로 둘러싸인 도형의 넓이는?`, area, {
          explain: `접선은 ${ej(polar(x1, y1, R), '이고/이고').slice(0, -2)}이고, ${X}절편은 ${iq(Q(R, x1))}, ${Y}절편은 ${iq(Q(R, y1))}이다. 따라서 넓이는 ${nb(`${iq(Q(R, Math.abs(x1)))} × ${iq(Q(R, Math.abs(y1)))} ÷ 2 = ${area}`)}이다.`,
          facts: { value: `${R}*${R}/(2*${Math.abs(x1)}*${Math.abs(y1)})` }
        });
      }),
      T('tan-from-outside', '원 밖의 한 점에서 그은 접선의 방정식', '②58', (d) => {
        const R = d.pick([5, 10, 13, 17, 20, 25, 26, 29, 34, 40, 50]), L = lattice(R).filter(([x, y]) => x !== 0 && y !== 0), [[x1, y1], [x2, y2]] = d.shuffle(L).slice(0, 2), det = x1 * y2 - x2 * y1;
        if (det === 0 || (R * (y2 - y1)) % det !== 0 || (R * (x1 - x2)) % det !== 0) return null;
        const px = R * (y2 - y1) / det, py = R * (x1 - x2) / det;
        if (Math.abs(px) > 12 || Math.abs(py) > 12) return null;
        // 검사 식: 접점 = (Rp ∓ q√(R(p² + q² − R)), Rq ± p√(R(p² + q² − R))) / (p² + q²)
        const S2 = `(${jn(px)}*${jn(px)}+${jn(py)}*${jn(py)})`, rootE = `(${R}*(${S2}-${R}))**0.5`;
        const plus = [`(${R}*${jn(px)}-${jn(py)}*${rootE})/${S2}`, `(${R}*${jn(py)}+${jn(px)}*${rootE})/${S2}`], minus = [`(${R}*${jn(px)}+${jn(py)}*${rootE})/${S2}`, `(${R}*${jn(py)}-${jn(px)}*${rootE})/${S2}`];
        const root = Math.sqrt(R * (px * px + py * py - R)), firstIsPlus = Math.abs((R * px - py * root) / (px * px + py * py) - x1) < 1e-9 && Math.abs((R * py + px * root) / (px * px + py * py) - y1) < 1e-9;
        const [e1, e2] = firstIsPlus ? [plus, minus] : [minus, plus];
        return inline(`점 ${ej(pt(px, py), '에서/에서').slice(0, -2)}에서 원 ${ej(circ0(R), '에/에')} 그은 두 접선의 방정식을 구하시오.${NOTE1}`, grp(`{0}${X} {1}${Y} = ${R}`) + ' 또는 ' + grp(`{2}${X} {3}${Y} = ${R}`), [{ answer: x1, signed: true }, { answer: y1, signed: true }, { answer: x2, signed: true }, { answer: y2, signed: true }], {
          blocks: [[0, 1], [2, 3]], shown: `${polar(x1, y1, R)} 또는 ${polar(x2, y2, R)}`,
          explain: `접점을 ${pt(V('a'), V('b'))}라 하면 접선은 ${nb(`${VA}${X} + ${VB}${Y} = ${R}`)}이고, 이 직선이 점 ${ej(pt(px, py), '을/를')} 지나므로 ${nb(`${poly([[px, VA], [py, VB]])} = ${R}`)}이다. 또 ${nb(`${VA}${sup(2)} + ${VB}${sup(2)} = ${R}`)}이므로 두 식을 연립하면 접점은 ${pt(x1, y1)}, ${ej(pt(x2, y2), '이다/이다').slice(0, -2)}이다. 따라서 접선은 ${polar(x1, y1, R)} 또는 ${polar(x2, y2, R)}이다.`,
          facts: { calc: [[e1[0], 0], [e1[1], 1], [e2[0], 2], [e2[1], 3]] }
        });
      }),
      T('tan-outside-intercept', '원 밖의 점에서 그은 접선의 절편', '②60', (d) => {
        const R = d.int(2, 60), t = pm(d) * d.int(2, 12), onY = d.bool();
        if (R % t !== 0 || t * t <= R) return null;
        const y1 = R / t, rest = R - y1 * y1;
        if (rest <= 0 || !isSq(rest)) return null;
        const x1 = Math.sqrt(rest), cut = Q(R, x1);
        if (cut.q === 1) return null;
        const P0 = onY ? pt(0, t) : pt(t, 0), want = onY ? `${X}절편` : `${Y}절편`;
        return F(`점 ${ej(P0, '에서/에서').slice(0, -2)}에서 원 ${ej(circ0(R), '에/에')} 그은 두 접선의 ${want} 가운데 양수인 것은?`, cut.p, cut.q, { improper: cut.p > cut.q,
          explain: `접점을 ${pt(VA, VB)}라 하면 접선은 ${nb(`${VA}${X} + ${VB}${Y} = ${R}`)}이고 점 ${ej(P0, '을/를')} 지나므로 ${onY ? nb(`${iq(t)}${VB} = ${R}`) : nb(`${iq(t)}${VA} = ${R}`)}이다. 접점이 원 위에 있으므로 다른 좌표는 ${nb(`±${x1}`)}이다. 접선 ${onY ? nb(`±${poly([[x1, X]])} ${sgn(y1)}${Y} = ${R}`.replace(/± 1<i/, '±<i').replace(/\+ 1<i/, '+ <i').replace(/− 1<i/, '− <i')) : nb(`${poly([[y1, X]])} ± ${poly([[x1, Y]])} = ${R}`)}의 ${want}은 ${nb(`±${iq(cut)}`)}이므로 양수인 것은 ${iq(cut)}이다.`,
          facts: { value: `${R}/(${R}-(${R}/${jn(t)})*(${R}/${jn(t)}))**0.5` }
        });
      }),
      T('tan-outside-area', '원 밖의 점에서 그은 두 접선과 좌표축으로 둘러싸인 넓이', '②61', (d) => {
        const p = d.int(2, 6), R = d.int(1, p * p - 1), onX = d.bool(), sg = pm(d), [k, s] = sqParts(R * (p * p - R)), g = gcd(p * p * k, p * p - R), A = p * p * k / g, Cd = (p * p - R) / g;
        if (s < 2 || Cd < 2 || A < 2 || A > 200) return null;
        const P0 = onX ? pt(sg * p, 0) : pt(0, sg * p), other = onX ? AXIS.y : AXIS.x;
        return inline(`점 ${ej(P0, '에서/에서').slice(0, -2)}에서 원 ${ej(circ0(R), '에/에')} 그은 두 접선과 ${ej(other, '으로/로')} 둘러싸인 삼각형의 넓이를 구하시오.`, frac('{0}' + rt('{1}'), '{2}'), [{ answer: A }, { answer: s }, { answer: Cd }], {
          shown: frac(radText(A, s), Cd),
          explain: `접점을 ${pt(VA, VB)}라 하면 접선 ${ej(nb(`${VA}${X} + ${VB}${Y} = ${R}`), '이/가')} 점 ${ej(P0, '을/를')} 지나므로 접점의 ${onX ? X : Y}좌표는 ${iq(Q(sg * R, p))}이고, 다른 좌표는 ${nb(`±${otherT(R, p)}`)}이다. 두 접선 ${ej(nb(`${poly([[Q(sg * R, p), onX ? X : Y]])} ± ${otherT(R, p)}${onX ? Y : X} = ${R}`), '이/가')} ${ej(other, '과/와')} 만나는 점은 원점에서 ${nb(icpt(R, p))}만큼 떨어진 두 점이므로, 넓이는 ${nb(`${icpt(R, p)} × 2 × ${p} ÷ 2 = ${frac(radText(A, s), Cd)}`)}이다.`,
          facts: { area: [p, R], rule: 'oa' }
        });
      }),
      T('tan-length', '원 밖의 점에서 그은 접선의 길이', '②62', (d) => {
        const p = nz(d, -5, 5), q = d.int(-5, 5), R = d.int(1, 16), x0 = d.int(-6, 6), y0 = d.int(-6, 6), h = (x0 - p) ** 2 + (y0 - q) ** 2 - R;
        if (!sqf(h) || h > 60) return null;
        const [Ag, Bg, Cg] = toGen(p, q, R);
        return radNum(`점 ${ej(P2('P', x0, y0), '에서/에서').slice(0, -2)}에서 원 ${ej(genE(Ag, Bg, Cg), '에/에')} 그은 접선의 접점을 T라 할 때, 선분 PT의 길이는?`, 1, h, {
          explain: `원을 변형하면 ${stdE(p, q, R)}이다. 중심을 C라 하면 ${nb(`CP${sup(2)} = ${(x0 - p) ** 2 + (y0 - q) ** 2}`)}이고, 반지름 CT와 접선은 수직이므로 피타고라스 정리에 의하여 ${nb(`PT${sup(2)} = ${(x0 - p) ** 2 + (y0 - q) ** 2} ${MINUS} ${R} = ${h}`)}이다. 따라서 ${nb(`PT = ${radText(1, h)}`)}이다.`,
          facts: { calc: [[`${jn(x0)}*${jn(x0)}+${jn(y0)}*${jn(y0)}+${jn(Ag)}*${jn(x0)}+${jn(Bg)}*${jn(y0)}+${jn(Cg)}`, 0]] }
        });
      }),
      T('tan-shifted', '중심이 원점이 아닌 원의 접선의 방정식', '②63', (d, n) => {
        const p = nz(d, -4, 4), q = nz(d, -4, 4);
        if (n === 0) {
          const m = d.pick([1, -1, 2, -2, 3, -3]), u = d.int(1, 2), R = (m * m + 1) * u * u, s = (m * m + 1) * u, base = q - m * p, n1 = base - s, n2 = base + s;
          if (R > 50 || base === 0 || n1 === -n2 || n1 === 0 || n2 === 0) return null;
          const perp = d.bool(), c0 = nz(d, -5, 5), cond = perp ? `직선 ${ej(lineG(1, m, c0), '에/에')} 수직인` : `기울기가 ${iq(m)}인`;
          return twoValsAns(`원 ${ej(stdE(p, q, R), '에/에')} 접하고 ${cond} 직선의 방정식을 ${nb(`${Y} = ${poly([[m, X]])} + ${VN}`)}이라 할 때, ${VN}의 값을 모두 구하시오.`, VN, n1, n2, {
            explain: `${perp ? `직선 ${lineG(1, m, c0)}의 기울기는 ${iq(Q(-1, m))}이므로 접선의 기울기는 ${iq(m)}이다. ` : ''}중심 ${ej(pt(p, q), '과/와')} 직선 ${nb(`${poly([[m, X], [-1, Y]])} + ${VN} = 0`)} 사이의 거리가 ${rootText(R)}이어야 하므로 ${nb(`|${VN} ${sgn(m * p - q)}| = ${rt(R)} × ${rt(m * m + 1)} = ${s}`)}이다. 따라서 ${nb(`${VN} = ${iq(n1)}`)} 또는 ${nb(`${VN} = ${iq(n2)}`)}이다.`,
            facts: { calc: [[`${jn(q)}-${jn(m)}*${jn(p)}-(${R}*(${jn(m)}*${jn(m)}+1))**0.5`, 0], [`${jn(q)}-${jn(m)}*${jn(p)}+(${R}*(${jn(m)}*${jn(m)}+1))**0.5`, 1]], rule: 'sh-0' }
          });
        }
        const dy = nz(d, -3, 3), mm = pm(d) * d.int(1, 3), dx = -mm * dy, R = dx * dx + dy * dy, s = p + dx, t = q + dy, nn = t - mm * s;
        if (R > 60 || nn === 0) return null;
        return lineAns(`원 ${stdE(p, q, R)} 위의 점 ${pt(s, t)}에서의 접선의 방정식을 구하시오.`, mm, nn, { note: true,
          explain: `원의 중심 ${ej(pt(p, q), '과/와')} 접점을 잇는 반지름의 기울기는 ${iq(Q(dy, dx))}이고 접선은 이 반지름에 수직이므로 접선의 기울기는 ${iq(mm)}이다. 점 ${ej(pt(s, t), '을/를')} 지나므로 ${lineY(mm, nn)}이다.`,
          facts: { calc: [[`0-(${jn(s)}-${jn(p)})/(${jn(t)}-${jn(q)})`, 0], [`${jn(t)}+(${jn(s)}-${jn(p)})/(${jn(t)}-${jn(q)})*${jn(s)}`, 1]], rule: 'sh-1' }
        });
      }, { count: 2 }),
      T('tan-slopes-vieta', '원 밖의 점에서 그은 두 접선의 기울기의 합과 곱', '②64', (d, n) => {
        const p = d.int(-4, 4), q = d.int(-4, 4), x0 = d.int(-4, 4), y0 = d.int(-4, 4), R = d.int(1, 12), u = p - x0, w = q - y0, A2 = u * u - R;
        if (A2 === 0 || u * u + w * w <= R || (p === 0 && q === 0)) return null;
        const sum = Q(2 * u * w, A2), prod = Q(w * w - R, A2);
        const P0 = x0 === 0 && y0 === 0 ? '원점' : `점 ${pt(x0, y0)}`, head = `${P0}에서 원 ${ej(stdE(p, q, R), '에/에')} 그은 두 접선의 기울기의`;
        const why = `접선의 기울기를 ${VM}이라 하면 접선은 ${nb(`${poly([[1, VM + X], [-1, Y], [-x0, VM], [y0, '']])} = 0`)}꼴이고, 중심 ${ej(pt(p, q), '과/와')} 이 직선 사이의 거리가 ${rootText(R)}이므로 ${nb(`(${poly([[u, VM], [-w, '']])})${sup(2)} = ${R}(${VM}${sup(2)} + 1)`)}이다. 정리하면 ${nb(`${poly([[A2, VM + sup(2)], [-2 * u * w, VM], [w * w - R, '']])} = 0`)}이고, 두 접선의 기울기는 이 이차방정식의 두 근이다.`;
        const uE = `(${jn(p)}-${jn(x0)})`, wE = `(${jn(q)}-${jn(y0)})`;
        if (n === 0) {
          if (sum.q !== 1 || sum.p === 0) return null;
          return N(`${head} 합은?`, sum.p, { signed: true, explain: `${why} 근과 계수의 관계에 의하여 두 근의 합은 ${iq(sum)}이다.`, facts: { value: `2*${uE}*${wE}/(${uE}*${uE}-${R})`, rule: 'sv-0' } });
        }
        if (prod.q === 1) return null;
        return ansV(`${head} 곱은?`, prod, 'frac', { explain: `${why} 근과 계수의 관계에 의하여 두 근의 곱은 ${iq(prod)}이다.`, facts: { value: `(${wE}*${wE}-${R})/(${uE}*${uE}-${R})`, rule: 'sv-1' } });
      }, { count: 2 }),
      T('tan-perp-radius', '두 접선이 서로 수직일 때 반지름의 길이', '②65', (d) => {
        const [dx, dy, r] = d.pick([[2, 2, 2], [3, 3, 3], [4, 4, 4], [1, 7, 5], [7, 1, 5], [5, 5, 5]]), a = nz(d, -4, 4), b = nz(d, -4, 4), px = a + pm(d) * dx, py = b + pm(d) * dy;
        return N(`점 ${ej(pt(px, py), '에서/에서').slice(0, -2)}에서 원 ${ej(nb(`${sqT(X, a)} + ${sqT(Y, b)} = ${VR}${sup(2)}`), '에/에')} 그은 두 접선이 서로 수직일 때, ${VR}의 값은? (단, ${nb(`${VR} &gt; 0`)})`, r, {
          explain: `두 접점을 A, B, 원의 중심을 C, 점 ${ej(pt(px, py), '을/를')} P라 하면 사각형 PACB는 네 각이 직각이고 ${nb('CA = CB')}이므로 정사각형이다. 대각선 CP의 길이는 ${nb(`${rt(dx * dx + dy * dy)} = ${radText(r, 2)}`)}이고 이는 ${ej(nb(`${rt(2)}${VR}`), '과/와')} 같으므로 ${nb(`${VR} = ${r}`)}이다.`,
          facts: { value: `((${jn(px)}-${jn(a)})*(${jn(px)}-${jn(a)})/2+(${jn(py)}-${jn(b)})*(${jn(py)}-${jn(b)})/2)**0.5` }
        });
      }),
      T('tan-bisector', '원 밖의 점에서 그은 두 접선이 이루는 각의 이등분선', '②66', (d) => {
        const p = d.int(-4, 4), q = d.int(-4, 4), x0 = d.int(-5, 5), y0 = d.int(-5, 5), R = d.int(1, 8);
        if (p === x0 || q === y0 || (x0 - p) ** 2 + (y0 - q) ** 2 <= R) return null;
        const s1 = Q(q - y0, p - x0), n1 = Q((y0 * (p - x0) - (q - y0) * x0), p - x0), n2 = Q(y0 * (q - y0) + x0 * (p - x0), q - y0);
        if (n1.q !== 1 || n2.q !== 1 || n1.p === n2.p || n1.p === -n2.p) return null;
        return M(`점 ${ej(P2('P', x0, y0), '에서/에서').slice(0, -2)}에서 원 ${ej(stdE(p, q, R), '에/에')} 그은 두 접선이 이루는 각을 이등분하는 두 직선의 ${Y}절편을 각각 구하시오.`, [{ answer: n1.p, signed: true }, { answer: n2.p, signed: true }], {
          unordered: true, shown: `${iq(n1)}, ${iq(n2)}`,
          explain: `두 접선은 점 P와 원의 중심 C를 지나는 직선에 대하여 대칭이므로, 한 이등분선은 직선 PC이고 다른 하나는 점 P를 지나고 직선 PC에 수직인 직선이다. 직선 PC의 기울기는 ${iq(s1)}이므로 ${lineY(s1, n1)}이고, 수직인 직선은 ${lineY(Q(-(p - x0), q - y0), n2)}이다. 따라서 ${Y}절편은 ${iq(n1)}, ${iq(n2)}이다.`,
          facts: { calc: [[`${jn(y0)}-(${jn(q)}-${jn(y0)})/(${jn(p)}-${jn(x0)})*${jn(x0)}`, 0], [`${jn(y0)}+(${jn(p)}-${jn(x0)})/(${jn(q)}-${jn(y0)})*${jn(x0)}`, 1]] }
        });
      }),
      T('tan-two-circles', '두 원에 모두 접하는 직선', '①30', (d) => {
        const Lc = d.int(2, 7), a = -d.int(1, Lc - 1), r1 = d.int(1, 3), r2 = r1 + d.int(1, 3), c = r1 * Lc, top = Lc * (r2 - r1);
        if (top % -a !== 0) return null;
        const dd = top / -a, [k, s] = sqParts(Lc * Lc - a * a);
        if (dd <= r1 + r2 || dd > 12 || k < 2 || s < 2) return null;
        return inline(`중심이 원점이고 반지름의 길이가 ${r1}인 원과 중심이 ${ej(pt(dd, 0), '이고/이고').slice(0, -2)}이고 반지름의 길이가 ${r2}인 원에 모두 접하는 직선의 방정식이 ${nb(`${VA}${X} + ${VB}${Y} = ${c}`)}일 때, 상수 ${VA}, ${VB}의 값을 구하시오. (단, ${nb(`${VA} &lt; 0`)}, ${nb(`${VB} &gt; 0`)})`, grp(`${VA} = {0}`) + ', ' + grp(`${VB} = {1}` + rt('{2}')), [{ answer: a, signed: true }, { answer: k }, { answer: s }], {
          shown: `${nb(`${VA} = ${iq(a)}`)}, ${nb(`${VB} = ${radText(k, s)}`)}`,
          explain: `원점과 직선 사이의 거리가 ${r1}이므로 ${nb(`${c} ÷ ${rt(`${VA}${sup(2)} + ${VB}${sup(2)}`)} = ${r1}`)}, ${nb(`${VA}${sup(2)} + ${VB}${sup(2)} = ${Lc * Lc}`)}이다. 점 ${ej(pt(dd, 0), '과/와')} 직선 사이의 거리가 ${r2}이므로 ${nb(`|${dd}${VA} ${MINUS} ${c}| = ${r2 * Lc}`)}이고, ${nb(`${VA} &lt; 0`)}이므로 ${nb(`${dd}${VA} ${MINUS} ${c} = ${MINUS}${r2 * Lc}`)}, ${nb(`${VA} = ${iq(a)}`)}이다. 따라서 ${nb(`${VB}${sup(2)} = ${Lc * Lc - a * a}`)}, ${nb(`${VB} = ${radText(k, s)}`)}이다.`,
          facts: { calc: [[`${c}*(${r1}-${r2})/(${r1}*${dd})`, 0], [`((${c}*${c}/(${r1}*${r1})-(${c}*(${r1}-${r2})/(${r1}*${dd}))*(${c}*(${r1}-${r2})/(${r1}*${dd})))/${s})**0.5`, 1], [String(s), 2]], derived: [s] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
