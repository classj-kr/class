// 고등학교 미적분Ⅰ Ⅲ-2 정적분의 활용 — 실력 문항. 단원 틀·싣는 기준·뺀 것과 까닭은 11-2-7a.js 머리에 적었다. 도구는 B.kit.u27x(11-2-7a.js).
// ref: ①n = 이 단원 기본꼴_1의 n번, 「11-2-6 ①n」 = 11-2-6 기본꼴_1의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 「넓이 = 정적분」으로 외워, 구간 안에서 위아래가 바뀌는데도 한 번에 적분해 넓이를 줄여 버린다(위아래 넓이가 같으면 정적분은 0이다).
//  - 중근인 교점에서도 위아래가 바뀐다고 여겨 구간을 쓸데없이 나누거나, 접점을 두 교점처럼 다룬다.
//  - 역함수 g의 정적분을 g의 식으로만 구하려 한다 — 그래프가 y = x 에 대칭이라 넓이가 같은 부분을 찾으면 f의 정적분과 직사각형의 넓이로 바뀐다.
//  - 위치의 변화량 ∫v dt 와 움직인 거리 ∫|v| dt 를 섞는다. 두 점 사이의 거리는 위치의 차의 절댓값이라 음수 쪽 극값이 가장 멀 수 있다.
//
// 실력에 둔 까닭(①은 뜻을 정확히 대야 풀리는 함정, ②는 세 단계 넘게 잇는 문제)
//  ① hard-equal-x(위아래 넓이가 같으면 정적분이 0), hard-common-tan(공통접선의 두 경우 가운데 정수 조건), hard-abs-line(꺾어 올린 부분을 빼거나 근호가 남는 경계),
//    hard-inv-cubic·hard-sqrt-line·hard-inv-integral(y = x 대칭으로 다항함수의 넓이로 바꾸기), hard-maxgap(거리는 |위치의 차|)
//  ② hard-cubic-min(넓이 → 상수 → 미분 → 극값), hard-bisect-x·hard-bisect-line·hard-equal-s(넓이 식 → 고차방정식), hard-tan-min(넓이를 접점의 식으로 → 최솟값),
//    hard-switch(거리가 정해진 값이 되는 시각을 삼차방정식으로 → 그 뒤 등속)
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, tx, nb, V, sup, poly, js, nz, rt, gcd } = B.kit.mid;
  const { ms, intg, evl, jh, qAns, sub } = B.kit.hs;
  const K = B.kit.u27x;
  const { S5, S6, H, qq, P, Z, padd, pneg, psub, pmul, pscale, fromRoots, pval, pint, dint, pdiff, deg, small, pieces, absArea, X, TT, YY, ptx, yEq, num, xEq, tEq, vEq, jsq, facText, I, intJs, absJs, kind, ansQ } = K;
  const tv = (v) => ptx(v, TT);
  const Av = V('a'), Kv = V('k');

  const hard = [
    H('hard-cubic-min', '삼차함수와 x축의 넓이로 상수를 구해 극값 구하기', '①4', (d) => {
      const p = d.pick([3, -3, 6, -6]), a = Math.abs(p) === 3 ? d.pick([4, 8, 12]) : d.pick([1, 2]);
      const f = fromRoots(a, [0, 0, p]), A = qabs(dint(f, Math.min(0, p), Math.max(0, p))), xe = Q(2 * p, 3), ext = pval(f, xe), isMin = p > 0;
      const shown = nb(`${V('f')}(${X}) = ${Av}${X}${sup(2)}(${poly([[1, X], [-p, '']])})`);
      return ansQ(`함수 ${shown}에 대하여 곡선 ${nb(`${YY} = ${V('f')}(${X})`)}와 ${X}축으로 둘러싸인 도형의 넓이가 ${num(A)}일 때, 함수 ${V('f')}(${X})의 ${isMin ? '극솟값' : '극댓값'}은? ${nb(`(단, ${Av} &gt; 0)`)}`, ext, {
        signed: true,
        explain: `${nb(`${V('f')}(${X}) = 0`)}에서 ${xEq(0)}(중근) 또는 ${xEq(p)}이고, 두 근 사이에서 ${V('f')}(${X}) ${p > 0 ? '≤' : '≥'} 0이다. 넓이는 ${nb(`${p > 0 ? MINUS : ''}${Av}`)}${intg(Math.min(0, p), Math.max(0, p), `(x^3 ${p > 0 ? '- ' + p : '+ ' + (-p)}x^2)`, 'x')} = ${nb(`${num(Q(p ** 4, 12))}${Av}`)}이므로 ${nb(`${Av} = ${a}`)}이다. ${nb(`${V('f')}′(${X}) = ${ptx(pdiff(f))} = ${facText(3 * a, [0, xe])}`)}이므로 ${xEq(xe)}에서 ${isMin ? '극소' : '극대'}이고, ${isMin ? '극솟값' : '극댓값'}은 ${nb(`${V('f')}(${num(xe)}) = ${num(ext)}`)}이다.`,
        facts: { value: `-4*(12*${A.p}/${p < 0 ? '(-' + (-p) + ')' : p}**4)*${p < 0 ? '(-' + (-p) + ')' : p}**3/27` } });
    }),
    H('hard-equal-x', '곡선과 x축으로 둘러싸인 두 부분의 넓이가 같을 조건', '11-2-6 ①37', (d) => {
      const c = d.int(-2, 1), k = d.int(2, 4), a = c + k;
      if (a <= 0) return null;
      const first = c === 0 ? X : `(${poly([[1, X], [-c, '']])})`, shown = nb(`${YY} = ${first}(${X} ${MINUS} ${Av})(${X} ${MINUS} ${Av} ${MINUS} ${k})`);
      return N(`곡선 ${jh(shown, '과/와')} ${X}축으로 둘러싸인 두 부분의 넓이가 서로 같을 때, 상수 ${Av}의 값은? ${nb(`(단, ${Av} &gt; ${num(c)})`)}`, a, {
        explain: `곡선은 ${X} = ${num(c)}, ${Av}, ${nb(`${Av} + ${k}`)}에서 ${X}축과 만나고, 두 부분 가운데 하나는 ${X}축 위, 다른 하나는 아래에 있다. 넓이가 같으면 두 정적분이 서로 지워져 ${intg(c, ms('a + ' + k), 'f(x)', 'x')} = 0이다. 세 근이 ${V('p')} &lt; ${V('q')} &lt; ${V('r')}인 ${nb(`(${X} ${MINUS} ${V('p')})(${X} ${MINUS} ${V('q')})(${X} ${MINUS} ${V('r')})`)}의 ${V('p')}부터 ${V('r')}까지의 정적분은 ${nb(`${frac(1, 12)}(${V('r')} ${MINUS} ${V('p')})${sup(3)}(2${V('q')} ${MINUS} ${V('p')} ${MINUS} ${V('r')})`)}이므로 ${nb(`2${Av} ${MINUS} (${num(c)}) ${MINUS} (${Av} + ${k}) = 0`)}, ${nb(`${Av} = ${a}`)}이다(가운데 근이 양 끝 근의 한가운데).`,
        facts: { value: `${c < 0 ? '(-' + (-c) + ')' : c}+${k}` } });
    }),
    H('hard-common-tan', '공통인 접선을 갖는 두 곡선으로 둘러싸인 넓이', '①13', (d) => {
      const k = d.pick([1, 5, 8]), info = { 1: { p: 1, p2: Q(-1, 3), r: -1 }, 5: { p: -1, p2: Q(5, 3), r: 3 }, 8: { p: 2, p2: Q(-4, 3), r: -3 } }[k];
      const f = P(0, -k, 0, 1), aOf = (p) => qsub(qmul(qq(p), qq(p)), pval(f, p)), a = aOf(info.p), a2 = aOf(info.p2), g = P(qneg(a), 0, 1), h = psub(f, g);
      const lo = Math.min(info.p, info.r), hi = Math.max(info.p, info.r), S = qabs(dint(h, lo, hi)), top = dint(h, lo, hi).p > 0 ? h : pneg(h);
      const gT = nb(`${YY} = ${X}${sup(2)} ${MINUS} ${Av}`);
      return ansQ(`두 곡선 ${yEq(f)}, ${jh(gT, '이/가')} 한 점 P를 지나고, 점 P에서 공통인 접선을 갖는다. 이 두 곡선으로 둘러싸인 도형의 넓이는? ${nb(`(단, ${Av}는 정수)`)}`, S, {
        explain: `점 P의 ${X}좌표를 ${V('p')}라 하면 기울기가 같아 ${nb(`${ptx(pdiff(f), V('p'))} = 2${V('p')}`)}에서 ${nb(`${V('p')} = ${num(info.p)}`)} 또는 ${nb(`${V('p')} = ${num(info.p2)}`)}이고, 함숫값이 같아 ${Av}의 값은 각각 ${num(a)}, ${num(a2)}이다. ${Av}는 정수이므로 ${nb(`${Av} = ${num(a)}`)}이다. ${nb(`${ptx(f)} = ${ptx(g)}`)}에서 ${nb(`${facText(1, [info.p, info.p, info.r])} = 0`)}이므로 넓이는 ${I(lo, hi, top)} = ${num(S)}이다.`,
        facts: { value: intJs(top, lo, hi) } });
    }),
    H('hard-abs-line', '절댓값 기호가 있는 곡선과 직선으로 둘러싸인 넓이', '①14', (d, n) => {
      if (n === 0) {
        const p = d.int(-3, 0), q = p + d.int(2, 4), s1 = p - d.int(1, 2), s2 = q + d.int(1, 3);
        const par = fromRoots(1, [p, q]), line = psub(par, fromRoots(1, [s1, s2]));
        // 직선이 꺾어 올린 부분보다 위에 있어야 넓이가 (바깥 넓이) − 2 × (꺾인 부분) 이 된다.
        for (let i = 0; i <= 40; i += 1) { const x = p + (q - p) * i / 40; if (fl(pval(line, x)) + fl(pval(par, x)) <= 0.05) return null; }
        if (!small(line, 12) || deg(line) < 1) return null;
        const outer = Q((s2 - s1) ** 3, 6), hump = Q((q - p) ** 3, 6), S = qsub(outer, qmul(Q(2), hump));
        if (!kind(S, 'int')) return null;
        const cur = nb(`${YY} = |${facText(1, [p, q])}|`);
        return ansQ(`곡선 ${jh(cur, '과/와')} 직선 ${jh(yEq(line), '으로/로')} 둘러싸인 도형의 넓이는?`, S, {
          explain: `${nb(`${YY} = |${ptx(par)}|`)}의 그래프는 ${xEq(p)}, ${xEq(q)} 사이에서 ${X}축 아래 부분을 위로 꺾어 올린 모양이다. 직선과의 교점은 ${nb(`${ptx(par)} = ${ptx(line)}`)}에서 ${xEq(s1)}, ${xEq(s2)}이고 직선은 꺾어 올린 부분보다 위에 있다. 넓이는 ${I(s1, s2, psub(line, par))} ${MINUS} 2${I(p, q, pneg(par))} = ${num(outer)} ${MINUS} ${num(qmul(Q(2), hump))} = ${num(S)}이다.`,
          facts: { value: `${intJs(psub(line, par), s1, s2)}-2*${intJs(pneg(par), p, q)}`, rule: 'line' } });
      }
      const m = d.int(1, 3), m2 = m * m, m3 = m ** 3;
      const opt = (A, Bc) => { const g = gcd(gcd(A * m3, Bc * m3 || 3), 3), top = Bc ? `${A * m3 / g}${rt(2)} ${MINUS} ${Bc * m3 / g}` : `${A * m3 / g}${rt(2)}`; return { h: g === 3 ? top : frac(top, 3 / g), v: (A * Math.SQRT2 - Bc) * m3 / 3 }; };
      const list = [opt(8, 8), opt(4, 3), opt(8, 10), opt(8, 0), opt(16, 16)], right = list[0];
      const order = d.shuffle(list);
      return C(`곡선 ${jh(nb(`${YY} = |${X}${sup(2)} ${MINUS} ${m2}|`), '과/와')} 직선 ${jh(nb(`${YY} = ${m2}`), '으로/로')} 둘러싸인 도형의 넓이는?`, order.map((o) => o.h), order.indexOf(right), {
        explain: `교점은 ${nb(`|${X}${sup(2)} ${MINUS} ${m2}| = ${m2}`)}에서 ${xEq(0)}, ${nb(`${X} = ±${m === 1 ? '' : m}${rt(2)}`)}이다. ${nb(`|${X}| ≤ ${m}`)}에서는 ${nb(`${m2} ${MINUS} (${m2} ${MINUS} ${X}${sup(2)}) = ${X}${sup(2)}`)}, ${nb(`${m} ≤ |${X}| ≤ ${m === 1 ? '' : m}${rt(2)}`)}에서는 ${jh(nb(`${m2} ${MINUS} (${X}${sup(2)} ${MINUS} ${m2}) = ${2 * m2} ${MINUS} ${X}${sup(2)}`), '을/를')} 적분한다. 넓이는 ${nb(`${frac(2 * m3, 3)} + 2(${frac(4 * m3, 3)}${rt(2)} ${MINUS} ${frac(5 * m3, 3)})`)} = ${right.h}이다.`,
        facts: { truth: order.map((o) => o === right), want: true, check: list.map((o) => o.v) } });
    }, { count: 2 }),
    H('hard-inv-cubic', '함수와 그 역함수의 그래프로 둘러싸인 넓이', '①16', (d) => {
      const m = d.int(1, 3), f = P(0, 0, 0, Q(1, m * m)), S = m * m;
      return N(`함수 ${nb(`${V('f')}(${X}) = ${ptx(f)}`)}의 그래프와 그 역함수 ${nb(`${YY} = ${V('g')}(${X})`)}의 그래프로 둘러싸인 도형의 넓이는?`, S, {
        explain: `두 그래프는 직선 ${nb(`${YY} = ${X}`)}에 대하여 대칭이고, ${nb(`${ptx(f)} = ${X}`)}에서 ${X} = ${num(-m)}, 0, ${m}이므로 두 그래프는 이 세 점에서 만난다. 넓이는 곡선 ${jh(nb(`${YY} = ${ptx(f)}`), '과/와')} 직선 ${nb(`${YY} = ${X}`)} 사이 넓이의 2배이고, 그 넓이는 대칭인 두 조각이 ${I(0, m, psub(P(0, 1), f))} = ${num(Q(m * m, 4))}씩이므로 ${nb(`2 × 2 × ${num(Q(m * m, 4))}`)} = ${S}이다.`,
        facts: { value: `4*(${m}**2/2-${m}**4/(4*${m}**2))` } });
    }),
    H('hard-sqrt-line', '무리함수의 그래프와 직선으로 둘러싸인 넓이', '①17', (d) => {
      const s = d.int(2, 4), c = s * s - s, S = qsub(Q(s ** 4, 2), Q(s ** 3, 3)), s2 = s * s;
      return ansQ(`곡선 ${nb(`${YY} = ${rt(X)}`)}와 두 직선 ${nb(`${YY} = ${X} ${MINUS} ${c}`)}, ${jh(xEq(0), '으로/로')} 둘러싸인 도형의 넓이는?`, S, {
        explain: `직선 ${nb(`${YY} = ${X}`)}에 대하여 대칭이동하면 ${nb(`${YY} = ${rt(X)}`)}는 ${nb(`${YY} = ${X}${sup(2)} (${X} ≥ 0)`)}, ${jh(nb(`${YY} = ${X} ${MINUS} ${c}`), '은/는')} ${nb(`${YY} = ${X} + ${c}`)}, 직선 ${xEq(0)}은 ${X}축이 되고 넓이는 그대로이다. ${nb(`${X}${sup(2)} = ${X} + ${c}`)}의 양수인 근은 ${s}이므로, 넓이는 꼭짓점이 (${num(-c)}, 0), (${s}, ${s2}), (${s}, 0)인 삼각형의 넓이 ${num(Q((s + c) * s2, 2))}에서 ${I(0, s, P(0, 0, 1))} = ${jh(num(Q(s ** 3, 3)), '을/를')} 뺀 ${num(S)}이다.`,
        facts: { value: `(${s}+${c})*${s2}/2-${s}**3/3` } });
    }),
    H('hard-inv-integral', '역함수의 정적분을 그래프의 대칭과 넓이로 구하기', '①18 · 11-2-6 ①51', (d, n) => {
      if (n === 0) {
        const c = d.int(1, 5), m = d.int(2, 4), hiX = c + m * m, S = m * hiX;
        return N(`함수 ${nb(`${V('f')}(${X}) = ${rt(poly([[1, X], [-c, '']]))}`)}의 역함수를 ${V('g')}(${X})라 할 때, ${nb(`${intg(c, hiX, 'f(x)', 'x')} + ${intg(0, m, 'g(x)', 'x')}`)}의 값은?`, S, {
          explain: `${nb(`${V('f')}(${c}) = 0`)}, ${nb(`${V('f')}(${hiX}) = ${m}`)}이고 ${V('g')}의 그래프는 ${V('f')}의 그래프를 직선 ${nb(`${YY} = ${X}`)}에 대하여 대칭이동한 것이다. ${intg(0, m, 'g(x)', 'x')}는 ${V('f')}의 그래프와 ${YY}축, 두 직선 ${nb(`${YY} = 0`)}, ${nb(`${YY} = ${m}`)} 사이에서 ${X} ≤ ${c}인 부분을 뺀 넓이와 같으므로 두 정적분의 합은 가로 ${hiX}, 세로 ${m}인 직사각형의 넓이 ${S}이다.`,
          facts: { value: `${m}*(${c}+${m}**2)`, rule: 'root' } });
      }
      const form = d.int(0, 2);
      let f, lo0, dom;
      if (form === 0) { const c = d.int(0, 4); f = P(c, 0, 1); lo0 = 0; dom = `${X} ≥ 0`; } else if (form === 1) { const k = d.int(1, 2); f = P(0, -2 * k, 1); lo0 = k; dom = `${X} ≥ ${k}`; } else { const c = d.int(-1, 2); f = P(c, 0, 0, 1); lo0 = null; dom = null; }
      const p = form === 2 ? d.int(0, 1) : lo0 + d.int(0, 1), q = p + d.int(1, form === 2 ? 1 : 2), fp = pval(f, p), fq = pval(f, q);
      const S = qsub(qsub(qmul(Q(q), fq), qmul(Q(p), fp)), dint(f, p, q));
      if (!kind(S, 'frac') || fl(fq) > 30) return null;
      const fT = nb(`${V('f')}(${X}) = ${ptx(f)}${dom ? ` (${dom})` : ''}`);
      return ansQ(`함수 ${fT}의 역함수를 ${V('g')}(${X})라 할 때, ${intg(num(fp), num(fq), 'g(x)', 'x')}의 값은?`, S, {
        explain: `${nb(`${V('f')}(${p}) = ${num(fp)}`)}, ${nb(`${V('f')}(${q}) = ${num(fq)}`)}이므로 ${V('g')}(${num(fp)}) = ${p}, ${V('g')}(${num(fq)}) = ${q}이다. 두 그래프가 직선 ${nb(`${YY} = ${X}`)}에 대하여 대칭이므로 ${intg(num(fp), num(fq), 'g(x)', 'x')}는 ${V('f')}의 그래프와 ${YY}축 사이의 넓이와 같고, ${nb(`${q} × ${fq.p < 0 ? '(' + num(fq) + ')' : num(fq)} ${MINUS} ${p} × ${fp.p < 0 ? '(' + num(fp) + ')' : num(fp)}`)}에서 ${I(p, q, f)} = ${jh(num(dint(f, p, q)), '을/를')} 뺀 ${num(S)}이다.`,
        facts: { value: `${q}*${jsq(fq)}-${p}*${jsq(fp)}-${intJs(f, p, q)}`, rule: 'poly' } });
    }, { count: 2 }),
    H('hard-bisect-x', '두 곡선으로 둘러싸인 넓이를 이등분하는 직선 x = k', '①21', (d) => {
      const r1 = d.int(-4, 1), dd = d.pick([2, 4, 6]), r2 = r1 + dd, cur = P(d.int(-4, 4), d.int(-4, 4), 1), h = fromRoots(1, [r1, r2]), line = psub(cur, h), k = r1 + dd / 2;
      if (!small(line, 15) || deg(line) < 1) return null;
      const half = Q(dd ** 3, 12), u = V('u');
      return ansQ(`곡선 ${jh(yEq(cur), '과/와')} 직선 ${jh(yEq(line), '으로/로')} 둘러싸인 도형의 넓이를 직선 ${nb(`${X} = ${Kv}`)}가 이등분할 때, 상수 ${Kv}의 값은?`, Q(k), {
        signed: true,
        explain: `교점은 ${xEq(r1)}, ${xEq(r2)}이고 넓이는 ${I(r1, r2, pneg(h))} = ${num(Q(dd ** 3, 6))}이다. ${jh(nb(`${u} = ${poly([[1, Kv], [-r1, '']])}`), '이라/라')} 하면 ${intg(r1, 'k', '(' + ptx(pneg(h)) + ')', 'x')} = ${nb(`${MINUS}${frac(ms('u^3'), 3)} + ${num(Q(dd, 2))}${ms('u^2')}`)} = ${num(half)}에서 ${nb(`(2${u} ${MINUS} ${dd})(2${ms('u^2')} ${MINUS} ${2 * dd}${u} ${MINUS} ${dd * dd}) = 0`)}이다. 0 &lt; ${u} &lt; ${dd}인 근은 ${nb(`${u} = ${dd / 2}`)}뿐이므로 ${nb(`${Kv} = ${num(k)}`)}이다(포물선의 축 위의 직선이 이등분한다).`,
        facts: { value: `(${r1 < 0 ? '(-' + (-r1) + ')' : r1}+${r2 < 0 ? '(-' + (-r2) + ')' : r2})/2` } });
    }),
    H('hard-bisect-line', '포물선과 x축의 넓이를 이등분하는 직선 y = ax', '①22', (d) => {
      const b = d.pick([4, 6, 8, 10]), val = b ** 3 / 2;
      const ask = poly([[1, Av + sup(3)], [-3 * b, Av + sup(2)], [3 * b * b, Av]]);
      return N(`곡선 ${jh(nb(`${YY} = ${MINUS}${X}${sup(2)} + ${b}${X}`), '과/와')} ${X}축으로 둘러싸인 도형의 넓이를 직선 ${nb(`${YY} = ${Av}${X}`)}가 이등분할 때, ${ask}의 값은? ${nb(`(단, ${Av}는 상수)`)}`, val, {
        explain: `곡선과 ${X}축으로 둘러싸인 넓이는 ${I(0, b, P(0, b, -1))} = ${num(Q(b ** 3, 6))}이다. 직선과 곡선의 교점은 ${xEq(0)}, ${nb(`${X} = ${b} ${MINUS} ${Av}`)}이고 그 사이 넓이는 ${nb(`${frac(1, 6)}(${b} ${MINUS} ${Av})${sup(3)}`)}이므로 ${nb(`${frac(1, 6)}(${b} ${MINUS} ${Av})${sup(3)} = ${num(Q(b ** 3, 12))}`)}, ${nb(`(${b} ${MINUS} ${Av})${sup(3)} = ${val}`)}이다. 펼치면 ${nb(`${b ** 3} ${MINUS} ${3 * b * b}${Av} + ${3 * b}${Av}${sup(2)} ${MINUS} ${Av}${sup(3)} = ${val}`)}이므로 ${ask} = ${val}이다.`,
        facts: { value: `${b}**3-${b}**3/2` } });
    }),
    H('hard-equal-s', '두 부분의 넓이가 같을 때 직선 x = a 의 자리', '①23', (d) => {
      const r1 = d.int(-3, 1), dd = d.pick([2, 4]), r2 = r1 + dd, mm = d.int(-2, 2), line = P(d.int(-3, 3), mm), cur = padd(line, fromRoots(1, [r1, r2])), a = r1 + 3 * dd / 2;
      if (!small(cur, 15) || deg(line) < 1) return null;
      const S1 = Q(dd ** 3, 6), u = V('u');
      return ansQ(`곡선 ${jh(yEq(cur), '과/와')} 직선 ${jh(yEq(line), '으로/로')} 둘러싸인 도형의 넓이를 ${V('S')}${sub(1)}, 곡선 ${jh(yEq(cur), '과/와')} 두 직선 ${yEq(line)}, ${jh(nb(`${X} = ${Av}`), '으로/로')} 둘러싸인 도형의 넓이를 ${V('S')}${sub(2)}라 하자. ${nb(`${V('S')}${sub(1)} = ${V('S')}${sub(2)}`)}일 때, 상수 ${Av}의 값은? ${nb(`(단, ${Av} &gt; ${r2})`)}`, Q(a), {
        signed: true,
        explain: `곡선과 직선의 교점은 ${xEq(r1)}, ${xEq(r2)}이다. ${nb(`${V('S')}${sub(1)} = ${I(r1, r2, fromRoots(-1, [r1, r2]))}`)}, ${nb(`${V('S')}${sub(2)} = ${intg(r2, 'a', '(' + ptx(fromRoots(1, [r1, r2])) + ')', 'x')}`)}이므로 ${nb(`${V('S')}${sub(1)} = ${V('S')}${sub(2)}`)}이면 ${intg(r1, 'a', '(' + ptx(fromRoots(1, [r1, r2])) + ')', 'x')} = 0이다. ${jh(nb(`${u} = ${poly([[1, Av], [-r1, '']])}`), '이라/라')} 하면 ${nb(`${frac(ms('u^3'), 3)} ${MINUS} ${num(Q(dd, 2))}${ms('u^2')} = 0`)}, ${nb(`${u} = ${num(Q(3 * dd, 2))}`)}이므로 ${nb(`${Av} = ${num(a)}`)}이다.`,
        facts: { value: `${r1 < 0 ? '(-' + (-r1) + ')' : r1}+3*${dd}/2`, check: [fl(S1)] } });
    }),
    H('hard-tan-min', '움직이는 접선과 곡선·두 직선으로 둘러싸인 넓이의 최솟값', '①25', (d) => {
      const m = d.int(-4, 1), w = d.int(2, 5), n = m + w, cur = P(d.int(-3, 4), d.int(-4, 4), 1), best = Q(w ** 3, 12);
      const mid = Q(2 * m + w, 2), pt = nb(`(${Av}, ${ptx(cur, Av)})`);
      return ansQ(`${nb(`${num(m)} ≤ ${Av} ≤ ${num(n)}`)}일 때, 곡선 ${yEq(cur)} 위의 점 ${pt}에서의 접선을 ${V('l')}이라 하자. 곡선 ${yEq(cur)}과 접선 ${V('l')} 및 두 직선 ${xEq(m)}, ${jh(xEq(n), '으로/로')} 둘러싸인 도형의 넓이의 최솟값은?`.replace(`${yEq(cur)}과 접선`, `${jh(yEq(cur), '과/와')} 접선`), best, {
        explain: `접선은 ${nb(`${YY} = (${ptx(pdiff(cur), Av)})(${X} ${MINUS} ${Av}) + ${ptx(cur, Av)}`)}이고 (곡선) − (접선) = ${nb(`(${X} ${MINUS} ${Av})${sup(2)} ≥ 0`)}이다. 넓이는 ${intg(m, n, '(x - a)^2', 'x')} = ${nb(`${w}(${Av} ${MINUS} ${num(mid)})${sup(2)} + ${num(best)}`)}이므로 ${nb(`${Av} = ${num(mid)}`)}일 때 최솟값 ${jh(num(best), '을/를')} 갖는다.`.replace(`${nb(`${w}(${Av} ${MINUS} ${num(mid)})`)}`, `${nb(`${w}(${Av} ${MINUS} ${num(mid)})`)}`),
        facts: { value: `(${n}-(${m < 0 ? '(-' + (-m) + ')' : m}))**3/12` } });
    }),
    H('hard-switch', '움직인 거리가 정해진 값이 된 뒤 속도가 일정한 운동', '①39', (d) => {
      const p = d.pick([Q(3, 2), Q(3), Q(3, 4)]), q = d.int(1, 3), t0 = d.int(1, 3), Tt = t0 + d.int(2, 4), v = P(0, q, p);
      const D = dint(v, 0, t0), vt = pval(v, t0);
      if (!isInt(D) || !isInt(vt) || D.p > 60) return null;
      const L = D.p + vt.p * (Tt - t0);
      return N(`직선 트랙을 움직이는 모형 자동차가 출발한 후 움직인 거리가 ${D.p} m가 될 때까지는 ${TT}초 후의 속도 ${V('v')}(${TT})가 ${nb(`${V('v')}(${TT}) = ${tv(v)}`)} ${nb('(m/s)')}이고, 그 이후의 속도는 일정하다. 출발 후 ${Tt}초 동안 이 모형 자동차가 움직인 거리는 몇 m인가?`, L, {
        unit: 'm',
        explain: `${nb(`${TT} ≥ 0`)}에서 ${V('v')}(${TT}) ≥ 0이므로 움직인 거리는 ${intg(0, 's', '(' + tv(v) + ')', 't')} = ${ptx(pint(v), V('s'))}이고, 이 값이 ${jh(String(D.p), '이/가')} 되는 ${V('s')}는 ${t0}뿐이다(${V('s')}가 커지면 값도 커진다). ${t0}초 후의 속도 ${jh(nb(`${V('v')}(${t0}) = ${vt.p}`), '으로/로')} ${Tt - t0}초 동안 더 가므로 움직인 거리는 ${nb(`${D.p} + ${vt.p} × ${Tt - t0}`)} = ${L} (m)이다.`,
        facts: { value: `${D.p}+${vt.p}*(${Tt}-${t0})` } });
    }, { standard: S6 }),
    H('hard-maxgap', '두 점 사이의 거리의 최댓값', '①50', (d) => {
      const [c, e] = d.pick([[3, 1], [4, 2], [2, 2], [1, 1], [2, 0], [3, 3]]), h0 = d.int(1, 4), Tt = c + d.int(1, 2);
      const h = P(h0, -3 * c * e, 3 * (e - c) / 2, 1), vals = [0, c, Tt].map((t) => pval(h, t)), mags = vals.map((x) => Math.abs(fl(x))), best = Math.max(...mags);
      if (!(vals[1].p < 0 && mags[1] === best && mags.filter((x) => x === best).length === 1) || !Number.isInteger(3 * (e - c) / 2)) return null;
      const al = d.int(1, 2), be = d.int(0, 3), ga = d.int(1, 6), xA = P(0, ga, be, al), xB = padd(xA, h), vA = pdiff(xA), vB = pdiff(xB);
      if (!small(vB, 40)) return null;
      return N(`두 점 A, B가 동시에 출발하여 수직선 위를 움직인다. 점 A는 원점에서 출발하여 ${TT}초 후의 속도가 ${tv(vA)}이고, 점 B는 좌표가 ${h0}인 점에서 출발하여 ${TT}초 후의 속도가 ${tv(vB)}이다. ${nb(`0 ≤ ${TT} ≤ ${Tt}`)}에서 두 점 A, B가 가장 멀리 떨어져 있을 때의 거리는?`, best, {
        explain: `${TT}초 후의 위치는 A가 ${ptx(xA, TT)}, B가 ${ptx(xB, TT)}이므로 두 점 사이의 거리는 ${nb(`|${V('h')}(${TT})|`)}, ${nb(`${V('h')}(${TT}) = ${ptx(h, TT)}`)}이다. ${nb(`${V('h')}′(${TT}) = ${facText(3, e === 0 ? [0, c] : [c, -e], TT)}`)}이므로 ${tEq(c)}에서 극소이고, ${V('h')}(0) = ${num(vals[0])}, ${V('h')}(${c}) = ${num(vals[1])}, ${V('h')}(${Tt}) = ${num(vals[2])}이다. 따라서 ${nb(`|${V('h')}(${TT})|`)}의 최댓값은 ${best}이다(음수 쪽 극솟값이 가장 멀다).`,
        facts: { value: `-(${intJs(pdiff(h), 0, c)}+${h0})` } });
    }, { standard: S6 })
  ];

  B.addGroup('11-2-7', { id: 'hard', title: '실력 문제', standard: S5, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
