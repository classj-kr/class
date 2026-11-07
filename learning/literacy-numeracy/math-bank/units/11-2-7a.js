// 고등학교 미적분Ⅰ Ⅲ-2 정적분의 활용 — 단원 틀·도구와 앞쪽 묶음(곡선과 x축 사이의 넓이, 두 곡선 사이의 넓이, 접선·절댓값·이동이 낀 넓이).
// 수집해 둔 천재 T셀파 미적분Ⅰ(홍진곤, 2022 개정) 한 종의 교과서·평가 자료에서 뽑은 꼴 목록(기본꼴_1: 51꼴, 심화 없음)과
// 11-2-6 「부정적분과 정적분」 꼴 목록에서 넘겨받은 꼴(곡선과 x축 사이의 넓이 ①34~①37, ①44의 넓이 변형, 역함수의 정적분 ①51)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-2-7/싣기_대조표.md 에 있다.
// (넓이에서 상수 구하기·넓이의 관계와 속도와 거리의 묶음은 11-2-7b.js 에, 실력 문항은 11-2-7c.js 에 있다.)
// ref: ①n = 이 단원 기본꼴_1의 n번, 「11-2-6 ①n」 = 11-2-6 기본꼴_1의 n번.
// 성취기준은 12미적Ⅰ-03-05(곡선으로 둘러싸인 도형의 넓이)와 12미적Ⅰ-03-06(속도와 거리 — 직선 운동에 한한다).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(곡선의 식·구간·접선·절댓값·그래프), 묻는 것(넓이·상수·비·위치·움직인 거리), 넓이의 얼개
//    (교점이 양 끝인가, 구간 안에서 위아래가 바뀌는가, 조각이 몇인가, 접하는 점이 있는가)가 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다.
//  - 사용자가 정한 대로 「지나치게 복잡한 문제는 다루지 않는다」를 까닭으로 수집본의 꼴을 빼지 않고, 단계가 많거나 함정이 있는 꼴은 실력(11-2-7c.js)에 싣는다.
//    역함수·무리함수가 낀 넓이(①16·①17·①18, 11-2-6 ①51)는 y = x 에 대한 대칭으로 다항함수의 정적분만 셈하면 풀리는 학기 시험 꼴이라 실력에 실었다.
//  - 답: 넓이·움직인 거리·높이처럼 음수일 수 없는 값은 부호 단추 없이, 위치·위치의 변화량·상수처럼 음수가 될 수 있는 값은 부호 단추를 달아 받는다.
//    분수 답은 분자·분모 칸(qAns). 한 유형(같은 차례) 안에서는 씨앗이 바뀌어도 칸의 모양(정수 칸인가 분수 칸인가)이 같도록 수를 골랐다.
//    원문이 따로 구한 값을 묶은 꼴(소1-1의 pq, 대10의 (√2 + 1)S)은 넓이를 바로 묻고, 근호가 남는 넓이(대10)는 고르기로 낸다.
//    ①22(넓이를 이등분하는 직선 y = ax)만 a가 세제곱근이라 원문처럼 a³ − 18a² + 108a 꼴의 값을 묻는다.
//  - 그림: 고2 공용 plot 으로 그린다. 속도 그래프는 가로축 이름만 t 로 바꾸고(tAxis — plot 은 축 이름을 x, y 로 적는다), 그림 설명에 꺾은선의 꼭짓점을 차례로 적는다(vGraph).
//    답이 되는 점의 자리(①9 소3-5의 점 P)는 그림에서 재어 읽을 수 없게 크기를 맞추지 않고 그린다.
//  - 검사 근거: 수 칸은 문제의 수로 다시 셈하는 식(facts.value·calc — 정적분은 [F(x)]ₐᵇ 를 펼친 식)이고, 글에 없는 수(교점·지수·나누는 수)는 seal 이
//    facts.unseen 에 밝힌다. 고르기의 참·거짓은 손으로 적지 않고 코드로 셈해 가린다. 답은 따로 지은 풀이(제 작업 폴더)로 다시 맞춰 보았다.
//
// 뺀 것과 까닭(11-2-7b.js, 11-2-7c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 놀이·활동(사용자 결정): ①26(포물선과 직선 사이 넓이 공식 |a|(β − α)³/6 의 유도 빈칸), ①27(아르키메데스의 방법 — 삼각형의 4/3배).
//    공식을 써서 넓이를 구하는 일은 ①6 의 유형(btw-quad)이 한다.
//  - 겹침(같은 일): ①6 최2(교점을 문제에서 준 두 포물선 — 교점을 구하는 한 걸음만 빠진 btw-quad), ①9 최1(「∫₁³(x + 1)dx = 6을 이용하여」 —
//    두 곡선의 차가 같은 넓이 btw-nocross·btw-strip 과 같은 일), ①35 기2-1⑶(부호가 바뀌지 않는 움직인 거리 — dist-abs 의 한 걸음).
//  - 도입·읽을거리는 꼴로 세지 않았다(생각 열기, 지니계수, 정지 거리, 사막 개미).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, NAMES } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, tx, nb, V, sup, poly, js, nz } = B.kit.mid;
  const { ms, intg, evl, jh, qAns, plot, plainOf } = B.kit.hs;
  const S5 = '12미적Ⅰ-03-05', S6 = '12미적Ⅰ-03-06';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수(교점·지수·나누는 수)를 facts.unseen 에 밝힌다.
  function seal(item) {
    const f = item.facts || {}, shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) out.add(Number(n));
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const sourceOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 다항식(계수는 유리수 Q, 낮은 차수부터) ──
  const qq = (x) => (typeof x === 'number' ? Q(x) : x);
  const trim = (p) => { const o = p.slice(); while (o.length > 1 && o[o.length - 1].p === 0) o.pop(); return o; };
  const P = (...cs) => trim(cs.map(qq));
  const Z = Q(0);
  const padd = (a, b) => trim(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => qadd(a[i] || Z, b[i] || Z)));
  const pneg = (a) => a.map(qneg);
  const psub = (a, b) => padd(a, pneg(b));
  const pmul = (a, b) => { const o = Array.from({ length: a.length + b.length - 1 }, () => Z); a.forEach((x, i) => b.forEach((y, j) => { o[i + j] = qadd(o[i + j], qmul(x, y)); })); return trim(o); };
  const pscale = (a, k) => trim(a.map((x) => qmul(x, qq(k))));
  const fromRoots = (k, rs) => rs.reduce((p, r) => pmul(p, P(qneg(qq(r)), 1)), P(k));     // k(x − r₁)(x − r₂)…
  const pval = (a, x) => a.reduceRight((s, c) => qadd(qmul(s, qq(x)), c), Z);
  const pint = (a) => [Z].concat(a.map((c, i) => qdiv(c, Q(i + 1))));                       // 부정적분(상수항 0)
  const dint = (a, lo, hi) => { const A = pint(a); return qsub(pval(A, hi), pval(A, lo)); };
  const pdiff = (a) => (a.length < 2 ? P(0) : trim(a.slice(1).map((c, i) => qmul(c, Q(i + 1)))));
  const deg = (a) => a.length - 1;
  const small = (a, lim) => a.every((c) => Math.abs(fl(c)) <= (lim || 20) && (c.q === 1 || c.q <= 4));
  // 구간 [lo, hi]를 cuts(구간 안의 근)에서 나눈 조각들의 |정적분|의 합
  const pieces = (lo, hi, cuts) => { const pts = [qq(lo)].concat((cuts || []).map(qq).filter((c) => qcmp(c, qq(lo)) > 0 && qcmp(c, qq(hi)) < 0).sort(qcmp), [qq(hi)]); return pts.slice(1).map((b, i) => [pts[i], b]); };
  const absArea = (h, lo, hi, cuts) => pieces(lo, hi, cuts).reduce((s, [a, b]) => qadd(s, qabs(dint(h, a, b))), Z);

  // ── 글 ──
  const X = V('x'), TT = V('t'), YY = V('y');
  const pwv = (v, n) => (n === 0 ? '' : n === 1 ? v : v + sup(n));
  const ptx = (a, v) => poly(a.map((c, i) => [c, pwv(v || X, i)]).reverse());            // 다항식의 글(높은 차수부터)
  const yEq = (f) => nb(`${YY} = ${ptx(f)}`);
  const num = (x) => tx(qq(x));                                                             // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const xEq = (x) => nb(`${X} = ${num(x)}`), tEq = (t) => nb(`${TT} = ${num(t)}`);
  const vEq = (v) => nb(`${V('v')}(${TT}) = ${ptx(v, TT)}`);
  const jsq = (x) => js(qq(x));                                                             // 검사 식에 적는 수((-3), (3/4))
  // 인수분해한 글: k(x − r₁)(x − r₂)… (근 0 은 x, 같은 근은 제곱)
  const lin1 = (r, v) => (qq(r).p === 0 ? (v || X) : `(${poly([[1, v || X], [qneg(qq(r)), '']])})`);
  function facText(k, rs, v) {
    const seen = [];
    for (const r of rs) { const s = seen.find((u) => qcmp(qq(u.r), qq(r)) === 0); if (s) s.n += 1; else seen.push({ r, n: 1 }); }
    seen.sort((s, t) => (qq(s.r).p === 0 ? -1 : qq(t.r).p === 0 ? 1 : 0));
    const body = seen.map(({ r, n }) => lin1(r, v) + (n > 1 ? sup(n) : '')).join('');
    const kq = qq(k), lead = kq.p === kq.q ? '' : kq.p === -kq.q ? MINUS : tx(kq);
    return nb(lead + body);
  }
  // 정적분의 글: ∫ₐᵇ(…)dx
  const I = (lo, hi, h, v) => intg(typeof lo === 'number' ? lo : num(lo), typeof hi === 'number' ? hi : num(hi), '(' + ptx(h, v) + ')', v === TT ? 't' : 'x');
  // 검사 식: ∫ₐᵇ h 를 [F]ₐᵇ 로 펼친 식(항마다 c·(bⁿ⁺¹ − aⁿ⁺¹)/(n + 1))
  const intJs = (h, lo, hi) => '(' + (h.map((c, i) => (c.p === 0 ? null : `${jsq(c)}*(${jsq(hi)}**${i + 1}-${jsq(lo)}**${i + 1})/${i + 1}`)).filter(Boolean).join('+') || '0') + ')';
  // |∫| 조각의 합을 검사 식으로: 부호가 음인 조각은 앞에 −
  const absJs = (h, lo, hi, cuts) => pieces(lo, hi, cuts).map(([a, b]) => (dint(h, a, b).p < 0 ? '-' : '+') + intJs(h, a, b)).join('').replace(/^\+/, '');
  // 정수 근을 찾는다(문항은 근을 먼저 정하고 식을 만드니, 여기서는 풀이 글에 적을 근을 다시 찾는 데만 쓴다)
  const intRoots = (a, lo, hi) => { const out = []; for (let x = lo; x <= hi; x += 1) if (pval(a, x).p === 0) out.push(x); return out; };
  const kind = (q, want) => (want === 'int' ? isInt(q) : !isInt(q));                     // 칸의 모양(정수·분수)을 한 유형 안에서 맞춘다
  const ansQ = (text, q, o) => qAns(text, q, o);
  const pick2 = (d, list) => { const s = d.shuffle(list); return [s[0], s[1]]; };
  const inRange = (r, a, b) => qcmp(qq(r), qq(a)) > 0 && qcmp(qq(r), qq(b)) < 0;
  const sgnWord = (q) => (q.p >= 0 ? '≥' : '≤');

  // ── 그림 ──
  // plot 의 가로축 이름 x 를 t 로 바꾼다(속도 그래프). 그림 설명의 축 이름도 고친다.
  const tAxis = (svg) => svg.replace(/(font-size:13\.5px[^>]*>)(<tspan[^>]*>)x(<\/tspan>)/, '$1$2t$3')
    .replace('좌표평면(x축, y축, 원점 O)', '좌표평면(가로축 t, 세로축 y, 원점 O)').replace('. x축 눈금:', '. t축 눈금:');
  // 꺾은선으로 이은 함수(점 [t, v] 의 배열)
  const polyline = (pts) => (t) => { for (let i = 1; i < pts.length; i += 1) { const [t0, v0] = pts[i - 1], [t1, v1] = pts[i]; if (t <= t1 + 1e-12) return v0 + (v1 - v0) * (t - t0) / (t1 - t0); } return pts[pts.length - 1][1]; };
  // 꺾은선 속도 그래프: pts 꼭짓점, tt·vt 눈금(수나 { v, t }), 꼭짓점에서 두 축으로 점선, name 곡선 이름.
  function vGraph(pts, o) {
    const opt = o || {}, ts = pts.map((p) => p[0]), vs = pts.map((p) => (typeof p[1] === 'number' ? p[1] : 0));
    const tmax = Math.max(...ts), vmax = Math.max(0, ...vs), vmin = Math.min(0, ...vs), span = vmax - vmin || 1;
    const xr = [0, tmax + tmax * 0.12], yr = [vmin - span * 0.14, vmax + span * 0.16];
    const ux = Math.min(44, 224 / (xr[1] - xr[0])), ys = Math.min(1.6, Math.max(0.05, (opt.h || 150) / ((yr[1] - yr[0]) * ux)));
    const f = polyline(pts), segs = [];
    for (const [t, v] of pts) {
      if (opt.guides === false || Math.abs(v) < 1e-12) continue;
      if (t > 1e-12) segs.push({ p: [t, 0], q: [t, v], dash: true });
      if (opt.vguide !== false) segs.push({ p: [0, v], q: [t, v], dash: true });
    }
    // 그림 설명에 꺾은선의 꼭짓점을 차례로 적는다(값을 문자로 적을 꼭짓점은 pts 의 셋째 칸에 글을 준다).
    const said = '꼭짓점 (t, v(t))를 차례로 이은 꺾은선: ' + pts.map((p) => `(${p[0]}, ${p[2] != null ? p[2] : (p[1] < 0 ? '−' + -p[1] : p[1])})`).join(', ') + '.' + (opt.say ? ' ' + opt.say : '');
    const svg = plot({ x: xr, y: yr, u: ux, ys, xt: opt.tt || [], yt: opt.vt || [], curves: [{ f, from: 0, to: tmax, name: opt.name || 'y=v(t)', side: opt.side }], segs: segs.concat(opt.segs || []), fill: opt.fill, texts: opt.texts, say: said });
    return tAxis(svg);
  }

  // 그림 속 이름(svgm 글): svgEq(P(0, -2, 1)) → 'y=x^2-2x'
  function svgEq(f, lhs, v) {
    const name = v || 'x', out = [];
    for (let i = f.length - 1; i >= 0; i -= 1) {
      const c = f[i]; if (c.p === 0) continue;
      const m = Math.abs(c.p) + (c.q === 1 ? '' : '/' + c.q), coef = i > 0 && m === '1' ? '' : m;
      out.push((c.p < 0 ? '-' : out.length ? '+' : '') + coef + (i === 0 ? '' : i === 1 ? name : name + '^' + i));
    }
    return (lhs || 'y') + '=' + (out.join('') || '0');
  }

  B.kit.u27x = {
    S5, S6, T, H, seal, retry, stripH, qq, P, Z, trim, padd, pneg, psub, pmul, pscale, fromRoots, pval, pint, dint, pdiff, deg, small, pieces, absArea,
    X, TT, YY, pwv, ptx, yEq, num, xEq, tEq, vEq, jsq, lin1, facText, I, intJs, absJs, intRoots, kind, ansQ, pick2, inRange, sgnWord, tAxis, polyline, vGraph, svgEq
  };

  // 곡선 위아래를 말하는 글: 구간 [a, b]에서 f ≥ g
  const geText = (lo, hi, top, bot) => `닫힌구간 [${num(lo)}, ${num(hi)}]에서 ${nb(top + ' ≥ ' + bot)}`;
  // 넓이의 풀이: 조각마다 ∫(위 − 아래)를 적고 값을 더한다.
  function areaSteps(h, lo, hi, cuts, v) {
    const ps = pieces(lo, hi, cuts);
    const parts = ps.map(([a, b]) => { const s = dint(h, a, b); return s.p < 0 ? I(a, b, pneg(h), v) : I(a, b, h, v); });
    const vals = ps.map(([a, b]) => qabs(dint(h, a, b)));
    return { line: parts.join(' + '), vals, total: vals.reduce(qadd, Z) };
  }
  const sumText = (vals) => (vals.length > 1 ? vals.map((q) => num(q)).join(' + ') + ' = ' : '') + num(vals.reduce(qadd, Z));

  // ═══ 가. 곡선과 x축 사이의 넓이 ═══
  const xarea = [
    T('xarea-para', '포물선과 x축으로 둘러싸인 넓이', '①1 · 11-2-6 ①35', (d) => {
      const a = d.pick([1, -1, 1, -1, 2, -2, 3, -3]), r1 = d.int(-4, 3), r2 = r1 + d.int(1, 5), f = fromRoots(a, [r1, r2]);
      if (!small(f, 24)) return null;
      const s = dint(f, r1, r2), S = qabs(s);
      if (!kind(S, 'frac')) return null;
      return ansQ(`곡선 ${jh(yEq(f), '과/와')} ${X}축으로 둘러싸인 도형의 넓이는?`, S, {
        explain: `${nb(ptx(f) + ' = ' + facText(a, [r1, r2]))} = 0에서 ${xEq(r1)} 또는 ${xEq(r2)}이다. 이 구간에서 곡선이 ${X}축의 ${a > 0 ? '아래' : '위'}쪽에 있으므로 넓이는 ${a > 0 ? MINUS : ''}${I(r1, r2, f)} = ${num(S)}이다.`,
        facts: { value: (a > 0 ? '-' : '') + intJs(f, r1, r2) } });
    }),
    T('xarea-cubic', '삼차함수의 그래프와 x축으로 둘러싸인 넓이', '11-2-6 ①35', (d) => {
      const a = d.pick([1, -1]), r1 = d.int(-4, 0), r2 = r1 + d.int(1, 4), r3 = r2 + d.int(1, 4), f = fromRoots(a, [r1, r2, r3]);
      if (!small(f, 30) || (r1 !== 0 && r2 !== 0 && r3 !== 0 && d.bool())) return null;
      const { line, vals, total } = areaSteps(f, r1, r3, [r2]);
      if (!kind(total, 'frac')) return null;
      return ansQ(`곡선 ${jh(yEq(f), '과/와')} ${X}축으로 둘러싸인 도형의 넓이는?`, total, {
        explain: `${nb(ptx(f) + ' = ' + facText(a, [r1, r2, r3]))} = 0에서 ${X} = ${num(r1)}, ${num(r2)}, ${num(r3)}이다. 곡선은 [${num(r1)}, ${num(r2)}]에서 ${X}축의 ${a > 0 ? '위' : '아래'}쪽, [${num(r2)}, ${num(r3)}]에서 ${a > 0 ? '아래' : '위'}쪽에 있으므로 넓이는 ${line} = ${sumText(vals)}이다.`,
        facts: { value: absJs(f, r1, r3, [r2]) } });
    }),
    T('xarea-deriv', '도함수와 함숫값으로 함수를 구해 x축과의 넓이 구하기', '11-2-6 ①35 변형', (d) => {
      const a = d.pick([Q(1, 3), Q(1)]), m = d.int(1, 3), f = pscale(fromRoots(1, [-m, 0, m]), a), df = pdiff(f), S = absArea(f, -m, m, [0]);
      if (!kind(S, 'frac')) return null;
      return ansQ(`함수 ${V('f')}(${X})가 ${nb(`${V('f')}′(${X}) = ${ptx(df)}`)}, ${nb(`${V('f')}(0) = 0`)}을 만족시킬 때, 곡선 ${nb(`${YY} = ${V('f')}(${X})`)}와 ${X}축으로 둘러싸인 도형의 넓이는?`, S, {
        explain: `${nb(`${V('f')}(${X}) = `)}${intg(null, null, '(' + ptx(df) + ')', 'x')} = ${nb(`${ptx(f)} + ${V('C')}`)}이고 ${nb(`${V('f')}(0) = 0`)}에서 ${nb(`${V('C')} = 0`)}이다. ${nb(`${V('f')}(${X}) = ${facText(a, [-m, 0, m])}`)}이므로 곡선은 ${X} = ${num(-m)}, 0, ${m}에서 ${X}축과 만나고, 두 부분의 넓이는 같아 ${nb(`2 × `)}${I(0, m, pneg(f))} = ${num(S)}이다.`,
        facts: { value: absJs(f, -m, m, [0]) } });
    }),
    T('xarea-lines', '곡선과 x축 및 두 직선으로 둘러싸인 넓이', '①2 · 11-2-6 ①34', (d, n) => {
      let f, lo, hi, cuts;
      if (n === 0) {
        // 구간 안에서 곡선이 x축을 지나지 않는다.
        const a = d.pick([1, -1, 2, -2]), b = d.int(-4, 4), c = d.int(-6, 6);
        f = P(c, b, a); lo = d.int(-3, 2); hi = lo + d.int(1, 3);
        const rs = intRoots(f, -12, 12), disc = b * b - 4 * a * c;
        if (disc >= 0 && rs.length < (disc === 0 ? 1 : 2)) return null;             // 근이 정수가 아니면 버린다(구간과의 관계를 풀이에 적기 어렵다)
        if (rs.some((r) => r >= lo && r <= hi)) return null;
        cuts = [];
      } else {
        // 구간 안에서 곡선이 x축을 지난다(근 하나가 구간 안).
        const a = d.pick([1, -1, 1, -1, 2, -2]), r1 = d.int(-4, 2), r2 = r1 + d.int(2, 5);
        f = fromRoots(a, [r1, r2]);
        if (d.bool()) { lo = d.int(r1 - 3, r1 - 1); hi = d.int(r1 + 1, r2 - 1); cuts = [r1]; } else { lo = d.int(r1 + 1, r2 - 1); hi = d.int(r2 + 1, r2 + 3); cuts = [r2]; }
        if (lo >= hi) return null;
      }
      if (!small(f, 20)) return null;
      const { line, vals, total } = areaSteps(f, lo, hi, cuts);
      if (!kind(total, n === 0 ? 'frac' : 'int')) return null;
      const where = cuts.length ? `${xEq(cuts[0])}에서 곡선이 ${X}축과 만나므로 구간을 나누어` : `닫힌구간 [${num(lo)}, ${num(hi)}]에서 ${nb(ptx(f) + ' ' + sgnWord(dint(f, lo, hi)) + ' 0')}이므로`;
      return ansQ(`곡선 ${jh(yEq(f), '과/와')} ${X}축 및 두 직선 ${xEq(lo)}, ${jh(xEq(hi), '으로/로')} 둘러싸인 도형의 넓이는?`, total, {
        explain: `${where} 넓이는 ${line} = ${sumText(vals)}이다.`,
        facts: { value: absJs(f, lo, hi, cuts), rule: n === 0 ? 'oneSign' : 'signChange' } });
    }, { count: 2 }),
    T('xarea-abs', '절댓값 기호가 있는 곡선과 x축 및 두 직선으로 둘러싸인 넓이', '11-2-6 ①44 변형', (d) => {
      const p = d.pick([-2, -1, 1, 2]), lo = p > 0 ? -d.int(1, 2) : p - d.int(1, 2), hi = p > 0 ? p + d.int(1, 2) : d.int(1, 2);
      const f = fromRoots(1, [0, 0, p]);
      const cuts = [p], { vals, total } = areaSteps(f, lo, hi, cuts);
      if (!kind(total, 'frac')) return null;
      const fx = `|${ptx(f)}|`;
      return ansQ(`곡선 ${jh(nb(`${YY} = ${fx}`), '과/와')} ${X}축 및 두 직선 ${xEq(lo)}, ${jh(xEq(hi), '으로/로')} 둘러싸인 도형의 넓이는?`, total, {
        explain: `${nb(ptx(f) + ' = ' + facText(1, [0, 0, p]))}이고 ${nb(X + sup(2) + ' ≥ 0')}이므로 ${nb(ptx(P(-p, 1)))}의 부호만 보면 된다. ${X} ≤ ${num(p)}에서 ${nb(`${fx} = ${ptx(pneg(f))}`)}, ${X} ≥ ${num(p)}에서 ${nb(`${fx} = ${ptx(f)}`)}이므로 넓이는 ${I(lo, p, pneg(f))} + ${I(p, hi, f)} = ${sumText(vals)}이다.`,
        facts: { value: absJs(f, lo, hi, cuts) } });
    }),
    T('xarea-coef', '넓이가 주어진 포물선과 x축 — 상수 구하기', '①3 · 11-2-6 ①36', (d) => {
      const a = d.pick([2, 3, 4, 5]), up = d.bool(), S = Q(a * a * a, 6);
      const cur = up ? ms('y = ax - x^2') : ms('y = x^2 - ax');
      return N(`곡선 ${jh(cur, '과/와')} ${X}축으로 둘러싸인 도형의 넓이가 ${num(S)}일 때, 양수 ${V('a')}의 값은?`, a, {
        explain: `${up ? ms('ax - x^2 = x(a - x)') : ms('x^2 - ax = x(x - a)')} = 0에서 ${xEq(0)} 또는 ${nb(X + ' = ' + V('a'))}이고, 닫힌구간 [0, ${V('a')}]에서 곡선이 ${X}축의 ${up ? '위' : '아래'}쪽에 있다. 넓이는 ${intg(0, 'a', '(ax - x^2)', 'x')} = ${evl(ms('a') + frac(ms('x^2'), 2) + ' ' + MINUS + ' ' + frac(ms('x^3'), 3), 0, 'a')} = ${frac(ms('a^3'), 6)}이므로 ${nb(frac(ms('a^3'), 6) + ' = ' + num(S))}, ${nb(ms('a^3') + ' = ' + a ** 3)}에서 ${nb(V('a') + ' = ' + a)}이다.`,
        facts: { value: `(6*${S.p}/${S.q})**(1/3)`, rule: up ? 'up' : 'down' } });
    }),
    T('xarea-abs-piece', '곡선 y = x|x| + c와 x축 및 두 직선 — 넓이로 끝 구하기', '①5 · 11-2-6 ①36', (d) => {
      const c = d.pick([4, 9]), m = d.pick(c === 4 ? [1] : [1, 2]), a = d.int(1, 3);
      const left = Q(3 * c * m - m ** 3, 3), right = Q(a ** 3 + 3 * c * a, 3), S = qadd(left, right);
      const cur = ms(`y = x|x| + ${c}`);
      return N(`곡선 ${jh(cur, '과/와')} ${X}축 및 두 직선 ${xEq(-m)}, ${jh(nb(X + ' = ' + V('a')), '으로/로')} 둘러싸인 도형의 넓이가 ${num(S)}일 때, 양수 ${V('a')}의 값은?`, a, {
        explain: `${X} &lt; 0에서 ${nb(ms(`y = -x^2 + ${c}`))}, ${X} ≥ 0에서 ${nb(ms(`y = x^2 + ${c}`))}이고 닫힌구간 [${num(-m)}, ${V('a')}]에서 ${YY} &gt; 0이다. 넓이는 ${I(-m, 0, P(c, 0, -1))} + ${intg(0, 'a', `(x^2 + ${c})`, 'x')} = ${num(left)} + ${frac(ms('a^3'), 3)} + ${c}${V('a')}이므로 ${nb(`${frac(ms('a^3'), 3)} + ${c}${V('a')} = ${num(right)}`)}, 곧 ${nb(V('a') + ' = ' + a)}이다.`,
        facts: { value: String(a), check: [c, m, a] } });
    }),
    T('xarea-two-parts', '곡선 위의 점에서 내린 수선과 곡선이 만드는 두 부분의 넓이 — 점의 자리 구하기', '11-2-6 ①36 소3-5', (d) => {
      const k = d.pick([Q(1, 2), Q(1), Q(1, 3)]), q = d.pick([3, 4, 5]), a = d.int(1, q - 1);
      const kn = fl(k), qy = qmul(k, Q(q * q)), S = qmul(k, Q(q ** 3 + a ** 3, 3));
      const cf = (c) => (c.p === c.q ? '' : num(c)), curT = `${cf(k)}${X}${sup(2)}`;
      const Pt = nb(`P(${V('a')}, ${k.p === k.q ? '' : frac(1, k.q)}${V('a')}${sup(2)})`), Qt = nb(`Q(${q}, ${num(qy)})`);
      const ad = q * 0.55;                                              // 점 P는 크기를 맞추지 않고 그린다(그림에서 a를 재어 읽지 않게)
      const ytop = fl(qy) + 1.2, ux = Math.min(44, 224 / (q + 1.6)), ys = Math.min(1, 190 / ((ytop + 1) * ux));
      const figure = plot({ x: [-0.6, q + 1], y: [-0.9, ytop], u: ux, ys,
        curves: [{ f: (x) => kn * x * x, from: 0, to: q + 0.45 }],
        fill: [{ f: () => kn * ad * ad, g: (x) => kn * x * x, from: 0, to: ad }, { f: (x) => kn * x * x, from: ad, to: q, color: 'rgba(37,99,235,0.2)' }],
        segs: [{ p: [ad, 0], q: [ad, kn * ad * ad] }, { p: [q, 0], q: [q, kn * q * q] }, { p: [0, kn * ad * ad], q: [ad, kn * ad * ad] }],
        dots: [{ x: ad, y: kn * ad * ad, name: 'P', side: 'ul', said: 'P(a, ' + (k.p === k.q ? '' : '1/' + k.q + ' ') + 'a^2)' }, { x: q, y: kn * q * q, name: 'Q', side: 'l', said: `Q(${q}, ${plainOf(num(qy))})` },
          { x: ad, y: 0, name: 'A', side: 'd', said: 'A(a, 0)' }, { x: q, y: 0, name: 'B', side: 'd', said: `B(${q}, 0)` }, { x: 0, y: kn * ad * ad, name: 'C', side: 'l', said: 'C(0, ' + (k.p === k.q ? '' : '1/' + k.q + ' ') + 'a^2)' }],
        say: '색칠한 두 부분: 곡선과 선분 PC 및 y축으로 둘러싸인 부분, 곡선과 선분 PA, AB, BQ로 둘러싸인 부분.' });
      return N(`그림과 같이 곡선 ${nb(`${YY} = ${curT}`)} ${nb(`(${X} ≥ 0)`)} 위의 두 점 ${Pt}, ${Qt}에서 ${X}축에 내린 수선의 발을 각각 A, B라 하고, 점 P에서 ${YY}축에 내린 수선의 발을 C라 하자. 곡선과 선분 PC 및 ${YY}축으로 둘러싸인 부분과 곡선과 세 선분 PA, AB, BQ로 둘러싸인 부분의 넓이의 합이 ${num(S)}일 때, 상수 ${V('a')}의 값은? ${nb(`(단, 0 &lt; ${V('a')} &lt; ${q})`)}`, a, {
        figure,
        explain: `첫째 부분은 직사각형 OAPC에서 곡선 아래 부분을 뺀 것이므로 ${nb(`${cf(k)}${V('a')}${sup(3)} ${MINUS} ${cf(qdiv(k, Q(3)))}${V('a')}${sup(3)} = ${cf(qmul(k, Q(2, 3)))}${V('a')}${sup(3)}`)}, 둘째 부분은 ${intg('a', q, '(' + curT + ')', 'x')} = ${nb(`${num(qmul(k, Q(q ** 3, 3)))} ${MINUS} ${cf(qdiv(k, Q(3)))}${V('a')}${sup(3)}`)}이다. 합은 ${nb(`${cf(qdiv(k, Q(3)))}${V('a')}${sup(3)} + ${num(qmul(k, Q(q ** 3, 3)))}`)}이므로 ${nb(`${V('a')}${sup(3)} = ${a ** 3}`)}, ${nb(V('a') + ' = ' + a)}이다.`,
        facts: { value: String(a), check: [fl(k), q, fl(S)] } });
    })
  ];

  // ═══ 나. 두 곡선 사이의 넓이 ═══
  // 아래 곡선 g(직선이나 포물선)를 고르고 위아래의 차 h 를 더해 다른 곡선 f = g + h 를 만든다.
  const lowCurve = (d, line) => (line ? P(d.int(-5, 5), nz(d, -4, 4)) : P(d.int(-6, 6), d.int(-4, 4), nz(d, -2, 2)));
  const curveWord = (f) => (deg(f) <= 1 ? '직선' : '곡선');
  // 「곡선 y = f와 직선 y = g로」 / 「두 곡선 y = f, y = g로」
  function pairText(f, g, tail) {
    const end = (h) => (tail ? jh(h, tail) : h);
    if (deg(f) >= 2 && deg(g) >= 2) return `두 곡선 ${yEq(f)}, ${end(yEq(g))}`;
    const [c1, c2] = deg(f) >= deg(g) ? [f, g] : [g, f];
    return `${curveWord(c1)} ${jh(yEq(c1), '과/와')} ${curveWord(c2)} ${end(yEq(c2))}`;
  }
  const between = [
    T('btw-quad', '포물선과 직선, 두 포물선으로 둘러싸인 넓이', '①6', (d) => {
      const k = d.pick([1, -1, 1, -1, 2, -2, 3]), r1 = d.int(-4, 2), r2 = r1 + d.int(1, 5), h = fromRoots(k, [r1, r2]);
      const g = lowCurve(d, d.bool()), f = padd(g, h);
      if (!small(f, 15) || !small(g, 15) || deg(f) < 1 || deg(f) === deg(g) && deg(f) < 2 || (deg(f) <= 1 && deg(g) <= 1)) return null;
      const S = qabs(dint(h, r1, r2));
      if (!kind(S, 'frac')) return null;
      const top = k < 0 ? f : g, bot = k < 0 ? g : f, diff = psub(top, bot);
      return ansQ(`${pairText(f, g, '으로/로')} 둘러싸인 도형의 넓이는?`, S, {
        explain: `${nb(`${ptx(f)} = ${ptx(g)}`)}에서 ${nb(ptx(h) + ' = 0')}, ${xEq(r1)} 또는 ${xEq(r2)}이다. ${geText(r1, r2, ptx(top), ptx(bot))}이므로 넓이는 ${I(r1, r2, diff)} = ${num(S)}이다.`,
        facts: { value: intJs(diff, r1, r2) } });
    }),
    T('btw-cubic3', '삼차함수의 그래프와 직선·포물선 — 교점 셋, 두 조각의 넓이', '①7', (d) => {
      const k = d.pick([1, -1]), r1 = d.int(-3, 0), r2 = r1 + d.int(1, 3), r3 = r2 + d.int(1, 3), h = fromRoots(k, [r1, r2, r3]);
      const g = lowCurve(d, d.bool()), f = padd(g, h);
      if (!small(f, 15) || !small(g, 12)) return null;
      const { line, vals, total } = areaSteps(h, r1, r3, [r2]);
      if (!kind(total, 'frac')) return null;
      return ansQ(`${pairText(f, g, '으로/로')} 둘러싸인 도형의 넓이는?`, total, {
        explain: `${nb(`${ptx(f)} = ${ptx(g)}`)}에서 ${nb(`${ptx(h)} = ${facText(k, [r1, r2, r3])} = 0`)}, ${X} = ${num(r1)}, ${num(r2)}, ${num(r3)}이다. 두 곡선의 위아래가 ${xEq(r2)}에서 바뀌므로 넓이는 ${line} = ${sumText(vals)}이다.`,
        facts: { value: absJs(h, r1, r3, [r2]) } });
    }),
    T('btw-touch', '한 점에서 접하는 삼차함수의 그래프와 포물선·직선의 넓이', '①8', (d) => {
      const k = d.pick([1, -1]), r = d.int(-3, 3), s = r + d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), h = fromRoots(k, [r, r, s]);
      const g = lowCurve(d, d.bool()), f = padd(g, h);
      if (!small(f, 15) || !small(g, 12)) return null;
      const lo = Math.min(r, s), hi = Math.max(r, s), S = qabs(dint(h, lo, hi));
      if (!kind(S, 'frac')) return null;
      const top = dint(h, lo, hi).p > 0 ? f : g, bot = top === f ? g : f, diff = psub(top, bot);
      return ansQ(`${pairText(f, g, '으로/로')} 둘러싸인 도형의 넓이는?`, S, {
        explain: `${nb(`${ptx(f)} = ${ptx(g)}`)}에서 ${nb(`${ptx(h)} = ${facText(k, [r, r, s])} = 0`)}, ${xEq(r)}(중근) 또는 ${xEq(s)}이다. 중근인 ${xEq(r)}에서는 두 그래프가 접할 뿐 위아래가 바뀌지 않으므로 둘러싸인 도형은 하나이고, ${geText(lo, hi, ptx(top), ptx(bot))}이므로 넓이는 ${I(lo, hi, diff)} = ${num(S)}이다.`,
        facts: { value: intJs(diff, lo, hi) } });
    }),
    T('btw-nocross', '두 곡선과 두 직선으로 둘러싸인 넓이 — 위아래가 바뀌지 않는 구간', '①9', (d) => {
      const k = d.pick([1, -1, 2, -2]), r1 = d.int(-5, 0), r2 = r1 + d.int(4, 8), h = fromRoots(k, [r1, r2]);
      const lo = d.int(r1, r2 - 2), hi = d.int(lo + 1, r2);
      if (lo === r1 && hi === r2) return null;
      const g = lowCurve(d, d.bool()), f = padd(g, h);
      if (!small(f, 15) || !small(g, 12) || (deg(f) <= 1 && deg(g) <= 1)) return null;
      const s = dint(h, lo, hi), S = qabs(s);
      if (!kind(S, 'int')) return null;
      const top = k < 0 ? f : g, bot = k < 0 ? g : f, diff = psub(top, bot);
      return ansQ(`${pairText(f, g, null)} 및 두 직선 ${xEq(lo)}, ${jh(xEq(hi), '으로/로')} 둘러싸인 도형의 넓이는?`, S, {
        explain: `두 곡선의 교점의 ${X}좌표는 ${num(r1)}, ${num(r2)}이므로 ${geText(lo, hi, ptx(top), ptx(bot))}이다. 넓이는 ${I(lo, hi, diff)} = ${num(S)}이다.`,
        facts: { value: intJs(diff, lo, hi) } });
    }),
    T('btw-strip', '세로로 잘린 길이가 늘 같은 무늬의 넓이', '①9 변형(교창 167쪽)', (d) => {
      const W = d.pick([40, 50, 60]), Hh = d.pick([30, 40]), k = d.pick([6, 8, 10, 12]), shape = d.pick(['물결 모양', '평행사변형 모양']);
      return N(`가로의 길이가 ${W} cm, 세로의 길이가 ${Hh} cm인 직사각형 모양의 포장지에 ${shape}의 은박 무늬가 있다. 포장지의 어느 곳에서 세로로 직선을 그어도 이 직선이 은박 무늬에 잘리는 부분의 길이는 늘 ${k} cm이다. 은박 무늬의 넓이는 몇 cm²인가?`, k * W, {
        unit: 'cm²',
        explain: `포장지의 왼쪽 아래 꼭짓점을 원점으로 놓고 무늬의 아래 경계를 ${nb(YY + ' = ' + V('f') + '(' + X + ')')}라 하면 위 경계는 ${nb(YY + ' = ' + V('f') + '(' + X + ') + ' + k)}이다. 넓이는 ${intg(0, W, `{(f(x) + ${k}) - f(x)}`, 'x')} = ${intg(0, W, k, 'x')} = ${k * W} (cm²)이다.`,
        facts: { value: `${k}*${W}` } });
    }),
    T('btw-cross2', '두 곡선과 두 직선으로 둘러싸인 넓이 — 구간 안에서 위아래가 바뀜', '①10', (d) => {
      const k = d.pick([1, -1, 1, -1, 2, -2]), r1 = d.int(-4, 1), r2 = r1 + d.int(2, 5), h = fromRoots(k, [r1, r2]);
      let lo, hi, cut;
      if (d.bool()) { lo = d.int(r1 - 2, r1 - 1); hi = d.int(r1 + 1, r2 - 1); cut = r1; } else { lo = d.int(r1 + 1, r2 - 1); hi = d.int(r2 + 1, r2 + 2); cut = r2; }
      if (lo >= hi) return null;
      const g = lowCurve(d, d.bool()), f = padd(g, h);
      if (!small(f, 15) || !small(g, 12) || (deg(f) <= 1 && deg(g) <= 1)) return null;
      const { vals, total } = areaSteps(h, lo, hi, [cut]);
      if (!kind(total, 'frac')) return null;
      const ps = pieces(lo, hi, [cut]);
      const parts = ps.map(([a, b]) => { const pos = dint(h, a, b).p > 0; return I(a, b, pos ? psub(f, g) : psub(g, f)); }).join(' + ');
      return ansQ(`${pairText(f, g, null)} 및 두 직선 ${xEq(lo)}, ${jh(xEq(hi), '으로/로')} 둘러싸인 도형의 넓이는?`, total, {
        explain: `${nb(`${ptx(f)} = ${ptx(g)}`)}에서 ${X} = ${num(r1)}, ${num(r2)}이고, 구간 안의 ${xEq(cut)}에서 두 곡선의 위아래가 바뀐다. 넓이는 ${parts} = ${sumText(vals)}이다.`,
        facts: { value: absJs(h, lo, hi, [cut]) } });
    })
  ];

  // ═══ 다. 접선·절댓값·이동이 낀 넓이 ═══
  const special = [
    T('sp-tan-on', '곡선 위의 점에서 그은 접선과 곡선으로 둘러싸인 넓이', '①11', (d) => {
      const b = d.int(-3, 3), c = d.int(-4, 4), e = d.int(-4, 4), p = d.int(-2, 2), f = P(e, c, b, 1);
      const s = -b - 2 * p;
      if (![2, 3, 4].includes(Math.abs(s - p))) return null;
      const fp = pval(f, p), m = pval(pdiff(f), p), tan = P(qsub(fp, qmul(m, Q(p))), m), h = psub(f, tan);
      if (!small(tan, 20)) return null;
      const lo = Math.min(p, s), hi = Math.max(p, s), S = qabs(dint(h, lo, hi));
      const top = dint(h, lo, hi).p > 0, diff = top ? h : pneg(h);
      return ansQ(`곡선 ${yEq(f)} 위의 점 ${nb(`(${num(p)}, ${num(fp)})`)}에서의 접선과 이 곡선으로 둘러싸인 도형의 넓이는?`, S, {
        explain: `${nb(`${YY}′ = ${ptx(pdiff(f))}`)}이므로 접선의 기울기는 ${num(m)}이고 접선은 ${yEq(tan)}이다. ${nb(`${ptx(f)} = ${ptx(tan)}`)}에서 ${nb(`${facText(1, [p, p, s])} = 0`)}이므로 ${xEq(p)}(접점) 또는 ${xEq(s)}이다. 넓이는 ${I(lo, hi, top ? psub(f, tan) : psub(tan, f))} = ${num(S)}이다.`,
        facts: { value: intJs(diff, lo, hi) } });
    }),
    T('sp-tan-from', '곡선 밖의 점에서 그은 접선과 곡선으로 둘러싸인 넓이', '①12', (d) => {
      const m = d.pick([1, 2, 3]), a = d.pick([1, -1]), p = d.int(-3, 3), c = d.int(-4, 6), f = P(c, p, 0, m), k = c - 2 * m * a ** 3;
      if (k === c) return null;
      const slope = 3 * m * a * a + p, tan = P(k, slope), h = psub(f, tan);
      const lo = Math.min(a, -2 * a), hi = Math.max(a, -2 * a), S = qabs(dint(h, lo, hi)), top = dint(h, lo, hi).p > 0;
      return ansQ(`점 ${nb(`(0, ${num(k)})`)}에서 곡선 ${yEq(f)}에 그은 접선과 이 곡선으로 둘러싸인 도형의 넓이는?`, S, {
        explain: `접점을 ${jh(nb(`(${V('t')}, ${ptx(f, V('t'))})`), '이라/라')} 하면 접선은 ${nb(`${YY} = (${ptx(pdiff(f), V('t'))})(${X} ${MINUS} ${V('t')}) + ${ptx(f, V('t'))}`)}이고, 점 ${nb(`(0, ${num(k)})`)}을 지나므로 ${nb(`${num(k)} = ${ptx(P(c, 0, 0, -2 * m), V('t'))}`)}, ${nb(V('t') + ' = ' + num(a))}이다. 접선 ${jh(yEq(tan), '과/와')} 곡선의 교점은 ${nb(`${ptx(h)} = ${facText(m, [a, a, -2 * a])} = 0`)}에서 ${xEq(a)}, ${xEq(-2 * a)}이므로 넓이는 ${I(lo, hi, top ? h : pneg(h))} = ${num(S)}이다.`,
        facts: { value: intJs(top ? h : pneg(h), lo, hi) } });
    }),
    T('sp-shift', '평행이동·대칭이동한 포물선과 원래 포물선으로 둘러싸인 넓이', '①15', (d) => {
      const a = d.pick([1, -1, 2, -2]), r1 = d.int(-4, 1), w = d.pick([2, 4, 5]), r2 = r1 + w, p = -(r1 + r2);
      if (p === 0) return null;
      const q = a * p * p - 2 * a * r1 * r2, f = P(0, 0, a);
      const g = padd(pscale(pmul(P(p, 1), P(p, 1)), -a), P(q)), h = psub(f, g), S = qabs(dint(h, r1, r2));
      if (!kind(S, 'frac') || !small(g, 25)) return null;
      const fx = ptx(f), sh = `${V('f')}(${poly([[1, X], [p, '']])})`, gT = q === 0 ? `${MINUS}${sh}` : `${MINUS}${sh} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}`;
      const top = dint(h, r1, r2).p > 0 ? h : pneg(h);
      return ansQ(`함수 ${nb(`${V('f')}(${X}) = ${fx}`)}에 대하여 두 곡선 ${nb(`${YY} = ${V('f')}(${X})`)}, ${jh(nb(`${YY} = ${gT}`), '으로/로')} 둘러싸인 도형의 넓이는?`, S, {
        explain: `${jh(nb(`${YY} = ${gT}`), '을/를')} 펼치면 ${yEq(g)}이다. ${nb(`${fx} = ${ptx(g)}`)}에서 ${nb(`${ptx(h)} = 0`)}, ${xEq(r1)} 또는 ${xEq(r2)}이므로 넓이는 ${I(r1, r2, top)} = ${num(S)}이다.`,
        facts: { value: intJs(top, r1, r2) } });
    })
  ];

  B.addUnit({ id: '11-2-7', grade: 11, semester: 2, no: 7, title: '정적분의 활용', version: 1, groups: [
    { id: 'xarea', title: '곡선과 x축 사이의 넓이', standard: S5, types: xarea },
    { id: 'between', title: '두 곡선 사이의 넓이', standard: S5, types: between },
    { id: 'special', title: '접선·절댓값·이동이 낀 넓이', standard: S5, types: special },
    { id: 'rel', title: '넓이로 상수 구하기와 넓이의 관계', standard: S5, types: [] },
    { id: 'pos', title: '위치와 위치의 변화량', standard: S6, types: [] },
    { id: 'dist', title: '움직인 거리', standard: S6, types: [] },
    { id: 'vgraph', title: '속도 그래프 읽기', standard: S6, types: [] },
    { id: 'vert', title: '쏘아 올린 물체와 멈추는 운동', standard: S6, types: [] },
    { id: 'two', title: '두 점의 운동과 실생활', standard: S6, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
