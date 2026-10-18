// 중학교 3학년 2학기 3단원 원과 직선 — 단원 틀·그림 도구와 앞쪽 묶음(원의 중심과 현의 수직이등분선, 중심으로부터 같은 거리에 있는 두 현).
// 수집해 둔 미래엔 2015(황선욱) 한 종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 74꼴, 심화꼴 21꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/9-2-3/싣기_대조표.md 에 있다.
// (원의 접선과 접선의 길이, 삼각형의 내접원, 원에 외접하는 사각형, 지름의 양 끝 접선·직사각형 안의 원은 9-2-3b.js 에, 실력 문항은 9-2-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-18(원의 현에 관한 성질과 접선에 관한 성질을 이해하고 정당화할 수 있다) 하나이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(반지름·현·거리·각·넓이), 묻는 것(길이·각·넓이·근거 고르기), 푸는 길(바로 / 피타고라스 정리 한 번 / 방정식 / 거꾸로)이 다르면 따로 싣는다.
//    수만 다른 것은 한 번만 싣는다.
//  - 교육과정(2022)의 금: 「원과 비례에 관한 성질은 다루지 않는다」 — 할선·현·접선의 길이의 곱으로 푸는 문항은 싣지 않는다. 길이는 모두 피타고라스 정리와
//    이 단원의 두 성질(중심에서 현에 내린 수선은 현을 이등분한다, 원 밖의 한 점에서 그은 두 접선의 길이는 같다)로 푼다.
//    「증명을 할 때, ‘가정’, ‘결론’ 용어는 다루지 않는다」「지나치게 엄밀한 형식 논리 규칙의 이용을 요구하는 문제는 다루지 않는다」 — 설명 쓰기는 싣지 않고,
//    설명하는 과정의 빈칸(근거 고르기)만 싣는다. 「‘접선의 길이’ 용어는 교수·학습 상황에서 사용할 수 있다」 — 문제 글에는 「접선의 길이」를 쓰지 않고 선분의 이름으로 묻는다.
//  - 앞 학년에서 쓰는 것: 피타고라스 정리, 30°·60°·90° 직각삼각형의 변의 비, 직각삼각형의 합동 조건(RHS), 삼각형의 내심(세 변까지의 거리가 같다), 삼각형의 중점연결정리,
//    이차방정식(9-1-4). 중2 8-2-1 에 이미 있는 일(세 변으로 내접원의 접점까지의 길이, 넓이와 반지름으로 둘레)은 다시 싣지 않는다.
//  - 그림은 수치대로 그린다(코드가 길이에서 좌표를 셈해 그린다). 그림 설명(aria-label)에는 그림에 적힌 것을 모두 말로 적는다. 그림 속 글에는 근호를 쓰지 않는다.
//  - 답의 꼴: 길이·각·넓이는 수 칸(단위를 칸 뒤에), 분수인 길이는 분수 칸(크기가 같은 분수도 받는다), 근호가 든 길이는 「[ ]√[ ] cm」(근호 앞의 수가 1인 유형은 「√[ ] cm」),
//    a ± b√c 꼴은 칸 셋, π가 든 넓이는 π의 계수를 받는다. 길이·각·넓이는 음수가 될 수 없으므로 부호 단추를 달지 않는다. 한 유형의 답은 늘 같은 꼴이다(수를 고를 때 막는다).
//  - 원문 답지의 잘못(기본꼴 머리의 「원문이 어긋난 곳」)은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(9-2-3b.js, 9-2-3c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 증명 전체를 쓰게 하는 것: 교과서 현문2, 현문4(설명하시오). 함께하기 1·3 은 설명하는 과정의 빈칸으로 바꾸어 실었다(equal-proof). 지현01 은 perp-proof.
//  - 작도: 깨진 접시의 중심을 그려 찾기(①15의 기현08) — 찾는 방법 고르기로 실었다(perp-plate).
//  - 그림을 알 수 없는 것: ①1의 기현10 의 y(풀이에 「y = 3」만 있다).
//  - 바꾸어 실은 것: ①5·①69(고르기 → 근호 칸), ①28의 중18(답이 늘 60°라 ∠LON 을 바꾸어 냄), ①58(y − x → x, y), ①63(늘 90°인 ∠COD → ∠ACO 로 ∠ODB), 심7(ST + UV → UV).
//  - 맞닿은 두 원(①73·74 심18·19·20·21): 교육과정에 「두 원의 위치 관계」는 없지만 고등학교 내용이 아니고 접선 ⊥ 반지름·피타고라스 정리·닮음으로 풀리므로 실었다.
//    「맞닿은 두 원의 중심 사이의 거리는 두 반지름의 길이의 합」을 문제 글(실력)이나 풀이(상자 채우기)에 밝힌다.
//  - 앞 학년에 있는 일: ①46(세 변 → 꼭짓점에서 접점까지 — 8-2-1 「in-tangent」), 심13(넓이와 반지름으로 둘레 — 8-2-1 「in-radius」),
//    심1(지름과 현의 연장선으로 호의 길이의 비 — 중1 7-2-3 「hard-secant-arc」, 이 단원 성질을 쓰지 않는다).
//  - 같은 일(겹침): ①24(①22의 앞 단계), ①35의 거꾸로(∠AOB → ∠APB, 같은 셈), ①40의 중09(∠P로 준 같은 직각삼각형), ①9의 표03·지대01(같은 현을 말로 바꾼 것),
//    ①50(①48과 같은 일 — 묻는 것이 둘레일 뿐), 심9(①70), 심12(①47), 심19(①73). 꼴 안의 변형 몇은 대조표의 메모에 적었다.
//  - 뜻 없는 셈: ①58의 y − x(두 값을 따로 받는다), 심7의 ST + UV(한 현을 묻는다).
//  - 실력: 심화꼴 가운데 뜻을 정확히 대야 풀리는 것과 세 단계 넘게 잇는 것, 기본꼴 가운데 ①28의 지중15·①51·①53·①73을 9-2-3c.js 에 실었다.
//    심4(중심에서 세 변까지 거리가 같은 삼각형)·심7(내심이 중심인 원)은 두 단계로 끝나 기본(equal-three, equal-incenter)에 두었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 각도는 수에 붙여 적고(56°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, josa, N, M, C, F, inline } = B.kit;
  const { V, nb, SG, rt, grp, sqParts, radText } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, TINT, WHITE, CLEAR, Board, textW } = B.kit.mgeo;
  const UNIT = '9-2-3', STD = '9수03-18';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const X = V('x'), R_ = V('r'), TAGS = ['㈎', '㈏', '㈐', '㈑'];
  const sg = SG, cm = (v) => v + ' cm', deg = (v) => v + '°';
  const eq = (p, q) => nb(`${sg(p)} = ${sg(q)}`);
  // 「AB = 8 cm」 한 덩이
  const is = (p, v, unit) => nb(`${sg(p)} = ${v}${unit == null ? ' cm' : unit}`);
  const perp = (p, q) => nb(`${sg(p)} ⊥ ${sg(q)}`);
  const sq = (v) => v + '<sup>2</sup>', sup2 = '<sup>2</sup>';
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // 알파벳으로 끝나는 말 뒤의 토씨. L·M·N·R 는 받침이 있다(엘·엠·엔·알).
  function jo(word, pair) {
    const last = String(word).replace(/<[^>]+>/g, '').slice(-1), [a, b] = pair.split('/'), bat = /[LMNRlmn㉠-㉭]/.test(last);
    if (a === '으로') return word + (bat && !/[LlR]/.test(last) ? '으로' : '로');
    return word + (bat ? a : b);
  }
  // 근호가 든 수의 글(그림 밖): s√m, m 이 1이면 s
  const rad = (s, m) => (m === 1 ? String(s) : radText(s, m));
  // √(식) — 풀이 글에 적는 근호
  const rootOf = (inner) => rt(inner);

  // ── 답 ──
  // 검사 식에 제곱근((…)**0.5 — 늘 제곱수의 제곱근이라 셈이 정확하다)을 썼으면 0.5 를 facts.unseen 에 밝힌다.
  function fin(item) {
    const f = item.facts || (item.facts = {}), exprs = (f.calc || []).map((c) => c[0]).concat(f.value !== undefined ? [f.value] : []);
    if (exprs.some((e) => /\*\*0\.5/.test(e))) f.unseen = [...new Set((f.unseen || []).concat([0.5]))];
    return item;
  }
  const cmQ = (text, v, o) => fin(N(text, v, Object.assign({ unit: 'cm' }, o)));
  const degQ = (text, v, o) => fin(N(text, v, Object.assign({ unit: '°' }, o)));
  const cm2Q = (text, v, o) => fin(N(text, v, Object.assign({ unit: 'cm²' }, o)));
  const xQ = (text, v, o) => fin(N(text, v, o));
  // 분수인 길이·넓이(크기가 같은 분수도 받는다). 정수가 되면 쓰지 않는다(수를 고를 때 막는다).
  const fracQ = (text, p, q, unit, o) => { const g = gcd(p, q); if (q / g === 1) throw new Error('분수 답이 정수다'); return fin(F(text, p / g, q / g, Object.assign({ improper: p / g > q / g, anyForm: true, unit }, o))); };
  // π가 드는 넓이·둘레: 칸 뒤에 π와 단위를 붙여 계수만 받는다.
  const piQ = (text, k, unit, o) => fin(Object.assign(N(text, k, Object.assign({}, o, { unit: 'π ' + unit })), { shown: `${k}π ${unit}` }));
  const piF = (text, p, q, unit, o) => { const g = gcd(p, q); if (q / g === 1) throw new Error('분수 답이 정수다'); return fin(Object.assign(F(text, p / g, q / g, Object.assign({ improper: p / g > q / g, anyForm: true, unit: 'π ' + unit }, o)), { shown: `${frac(p / g, q / g)}π ${unit}` })); };
  // 근호가 든 길이 a√m: 「[ ]√[ ] cm」, a 가 1이면 「√[ ] cm」. 한 유형 안에서 a 가 1인 답과 아닌 답을 섞지 않는다.
  function radQ(text, a, m, unit, o) {
    if (!Number.isInteger(a) || a < 1 || !Number.isInteger(m) || m < 2 || sqParts(m)[0] !== 1) throw new Error('근호 답: ' + a + '√' + m);
    const tail = unit ? ' ' + unit : '';
    if (a === 1) return fin(inline(text, grp(rt('{0}') + tail), [{ answer: m }], Object.assign({}, o, { shown: rt(m) + tail })));
    return fin(inline(text, grp('{0}' + rt('{1}') + tail), [{ answer: a }, { answer: m }], Object.assign({}, o, { shown: a + rt(m) + tail })));
  }
  // a + b√m(sign 1) 또는 b√m − a(sign −1): 칸 셋. b 는 2 이상(근호 앞의 수가 1인 답은 이 유형에 쓰지 않는다).
  function sumRad(text, a, b, m, sign, unit, o) {
    if (![a, b, m].every(Number.isInteger) || a < 1 || b < 2 || m < 2 || sqParts(m)[0] !== 1) throw new Error('a ± b√m 답: ' + [a, b, m]);
    const tail = unit ? ' ' + unit : '';
    return fin(sign > 0
      ? inline(text, grp('({0} + {1}' + rt('{2}') + ')' + tail), [{ answer: a }, { answer: b }, { answer: m }], Object.assign({}, o, { shown: `(${a} + ${b}${rt(m)})${tail}` }))
      : inline(text, grp('({0}' + rt('{1}') + ' − {2})' + tail), [{ answer: b }, { answer: m }, { answer: a }], Object.assign({}, o, { shown: `(${b}${rt(m)} − ${a})${tail}` })));
  }
  // 고르기: 맞는 보기 하나와 틀린 보기들을 섞는다.
  function pickOne(d, text, right, wrongs, o) {
    const opt = o || {}, rows = d.shuffle([[right, true]].concat(wrongs.map((w) => [w, false]))), hit = rows.findIndex((r) => r[1]);
    return C(text, rows.map((r) => r[0]), hit, { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => r[1]), want: true }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 문장 가리기. yes: 옳은 것들, no: [틀린 것, 바로잡은 말, 함께 싣지 않을 옳은 것(들)]. wantTrue: 옳은 것을 고르는가.
  function sayQ(d, text, yes, no, wantTrue, figure) {
    const bad = d.shuffle(no).slice(0, wantTrue ? 3 : 1), clash = bad.reduce((all, s) => all.concat(s[2] || []), []);
    const good = d.shuffle(yes.filter((s) => !clash.includes(s))).slice(0, wantTrue ? 1 : 3);
    const rows = d.shuffle(good.map((s) => [s, true, '']).concat(bad.map((s) => [s[0], false, s[1]]))), hit = rows.findIndex((r) => r[1] === wantTrue);
    return C(text, rows.map((r) => r[0]), hit, { figure, explain: wantTrue ? rows.filter((r) => !r[1]).map((r) => r[2]).filter((s, i, all) => all.indexOf(s) === i).join(' ') : rows[hit][2], facts: { truth: rows.map((r) => r[1]), want: wantTrue } });
  }
  const tagged = (rows) => lines(rows.map((h) => h));

  // ── 수 고르기 ──
  // 피타고라스 수 [a, b, c](a² + b² = c², c ≤ 41). 두 차례를 모두 넣는다.
  const PRIM = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [12, 35, 37], [9, 40, 41]];
  const TRIPLES = [];
  for (const [a, b, c] of PRIM) for (let k = 1; k * c <= 41; k += 1) TRIPLES.push([k * a, k * b, k * c], [k * b, k * a, k * c]);
  const triple = (d, ok) => d.pick(TRIPLES.filter(ok));
  const isSq = (n) => Number.isInteger(Math.sqrt(n));
  // n 을 s√m(m 은 제곱인 수를 인수로 갖지 않는다)으로: [s, m]
  const split = (n) => sqParts(n);

  // ── 셈(화면 좌표: y 는 아래로 커진다. 각은 오른쪽이 0°이고 시계 반대쪽으로 커진다) ──
  const foot = (p, a, b) => { const ux = b[0] - a[0], uy = b[1] - a[1], t = ((p[0] - a[0]) * ux + (p[1] - a[1]) * uy) / (ux * ux + uy * uy); return [a[0] + ux * t, a[1] + uy * t]; };
  const along = (p, q, len) => { const L = dist(p, q); return [p[0] + (q[0] - p[0]) * len / L, p[1] + (q[1] - p[1]) * len / L]; };
  const turn = (a, b) => ((b - a + 540) % 360) - 180;
  const midDir = (v, p, q) => { const a = dirOf(v, p); return a + turn(a, dirOf(v, q)) / 2; };
  const angleAt = (v, p, q) => Math.abs(turn(dirOf(v, p), dirOf(v, q)));
  const inOf = (a, b, c) => { const la = dist(b, c), lb = dist(c, a), lc = dist(a, b), s = la + lb + lc; return [(la * a[0] + lb * b[0] + lc * c[0]) / s, (la * a[1] + lb * b[1] + lc * c[1]) / s]; };
  // 세 변의 길이로(a = BC, b = CA, c = AB) — B 왼쪽 아래, C 오른쪽 아래, A 위
  const sssTri = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a), y = Math.sqrt(Math.max(c * c - x * x, 0)); return { A: [x, -y], B: [0, 0], C: [a, 0] }; };
  // 점들(과 원)을 [가로, 세로] 안에 꼭 맞게 키운다. circles: [[중심 점, 반지름]] — 원 전체가 들도록 잰다. 돌려주는 것에 배율 k 가 붙는다.
  function fitPts(P, size, circles) {
    const all = Object.values(P).concat(...(circles || []).map(([c, r]) => [[c[0] - r, c[1] - r], [c[0] + r, c[1] + r]]));
    const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
    const k = Math.min(size[0] / (Math.max(...xs) - x0 || 1), size[1] / (Math.max(...ys) - y0 || 1)), out = {};
    for (const key of Object.keys(P)) out[key] = [(P[key][0] - x0) * k, (P[key][1] - y0) * k];
    Object.defineProperty(out, 'k', { value: k, enumerable: false });
    return out;
  }
  // 점들을 c 를 중심으로 a° 만큼 돌린다(시계 반대쪽).
  const spin = (P, a, c) => { const o = c || [0, 0], out = {}; for (const key of Object.keys(P)) { const r = dist(o, P[key]); out[key] = r < 1e-9 ? o.slice() : at(o, r, dirOf(o, P[key]) + a); } return out; };

  // ── 그림 ──
  // 이름 붙은 점들 P({ A: [x, y], … }, fitPts 로 키운 것)로 그림을 짓는다. 선분·각은 점 이름으로 적는다: seg('AB CD'), ang('ABC', 글)은 꼭짓점 B 의 각.
  // ring('O', 반지름) 원을 그린다(반지름은 키우기 전의 길이). 원 위의 점은 이름을 원 바깥쪽에 적는다.
  // names() 가 점마다 선이 가장 성긴 쪽에 이름을 적는다(이름이 한 글자 대문자인 점만). over: { D: 270 } 방향, { D: null } 적지 않음, { D: [방향, 거리] }.
  function scene(P, board) {
    const b = board || Board(), segs = [], rings = [], S = { b, P };
    const pt = (n) => (typeof n === 'string' ? P[n] : n);
    // 점 이름이 두 글자 넘는 것(Op 따위)은 「Op-N」처럼 - 로 잇는다.
    const tok = (t) => (t.includes('-') ? t.split('-') : t.split(''));
    const each = (names, f) => { for (const pair of names.split(' ')) { const [p, q] = tok(pair); f(P[p], P[q]); } return S; };
    S.poly = (names, css) => { const list = names.split('').map((n) => P[n]); b.poly(list, css); list.forEach((p, i) => segs.push([p, list[(i + 1) % list.length]])); return S; };
    S.seg = (names, kind) => each(names, (p, q) => { b.seg(p, q, kind); segs.push([p, q]); });
    // 선분 p–q 를 두 끝 밖으로 늘인 선(직선·반직선을 나타낼 때)
    S.line = (names, before, after, kind) => each(names, (p, q) => { const a = along(p, q, -(before || 0)), z = along(q, p, -(after || 0)); b.seg(a, z, kind); segs.push([a, z]); });
    S.tick = (names, n, t) => each(names, (p, q) => b.tick(p, t == null ? q : mid(p, q, 2 * t), n));
    S.ang = (name, label, o) => { const [p, v, q] = tok(name); b.corner(P[v], P[p], P[q], label, o); return S; };
    S.right = (names) => { for (const n of names.split(' ')) { const [p, v, q] = tok(n); b.corner(P[v], P[p], P[q]); } return S; };
    S.len = (pair, label, inside, o) => { const [p, q] = tok(pair); b.beside(P[p], P[q], label, pt(inside), o); return S; };
    S.dim = (pair, label, inside, off) => { const [p, q] = tok(pair); b.dim(P[p], P[q], label, pt(inside), off); return S; };
    S.dot = (names) => { for (const n of names) b.dot(P[n]); return S; };
    S.ring = (key, r, css) => { const c = P[key], R = r * P.k; b.disk(c, R, css); rings.push([c, R]); return S; };
    // 호(중심 key, 반지름 r, a0° → a1° 시계 반대쪽). kind: 'thin' | 'cut'(점선)
    S.arc = (key, r, a0, a1, kind) => {
      const c = P[key], R = r * P.k;
      if (kind === 'cut') { const pts = []; for (let a = Math.min(a0, a1); a <= Math.max(a0, a1); a += 10) pts.push(at(c, R, a)); pts.push(at(c, R, a1)); b.shape(`M${r1(at(c, R, a0))}${arcPath(c, R, a0, a1)}`, pts, 'fill:none;stroke:#5b6770;stroke-width:1.2;stroke-dasharray:4 3'); }
      else b.arc(c, R, a0, a1, kind);
      rings.push([c, R]); return S;
    };
    S.text = (p, label, o) => { b.text(pt(p), label, o); return S; };
    S.names = (over) => {
      const set = over || {};
      for (const n of Object.keys(P)) {
        if (!/^[A-Z]$/.test(n) || set[n] === null) continue;
        const p = P[n];
        if (typeof set[n] === 'number') { b.name(p, n, set[n]); continue; }
        if (Array.isArray(set[n])) { b.name(p, n, set[n][0], set[n][1]); continue; }
        const dirs = [];
        for (const [u, w] of segs) {
          if (dist(p, u) < 0.6) dirs.push(dirOf(p, w));
          else if (dist(p, w) < 0.6) dirs.push(dirOf(p, u));
          else if (dist(p, foot(p, u, w)) < 0.6 && dist(p, u) + dist(p, w) < dist(u, w) + 0.6) dirs.push(dirOf(p, u), dirOf(p, w));
        }
        for (const [c, R] of rings) if (Math.abs(dist(p, c) - R) < 0.8 && R > 1) { const a = dirOf(p, c); dirs.push(a, a + 90, a - 90); }
        if (dirs.length) b.nameFree(p, n, dirs); else b.name(p, n, 90);
      }
      return S;
    };
    S.clash = () => b.clash();
    S.svg = (label) => b.svg(label);
    return S;
  }
  const r1 = (p) => Math.round(p[0] * 10) / 10 + ' ' + Math.round(p[1] * 10) / 10;
  // 점 p 를 직선 ab 에 대하여 접은 자리(글을 그 점 쪽에 적을 때 beside 에 「두지 않을 쪽」으로 넘긴다)
  const mirror = (p, a, b) => { const f = foot(p, a, b); return [2 * f[0] - p[0], 2 * f[1] - p[1]]; };
  const arcPath = (c, R, a0, a1) => { const e = at(c, R, a1); return `A${Math.round(R * 10) / 10} ${Math.round(R * 10) / 10} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${r1(e)}`; };

  // 원 O 와 중심에서 현 AB 에 내린 수선 OM(현은 가로, 중심 아래). o.c 이면 C(반지름 OM 을 늘여 원과 만나는 점)도 넣는다.
  // R 반지름, h 중심에서 현까지의 거리(모두 cm). tilt: 그림을 돌리는 각.
  function chordPts(R, h, o) {
    const opt = o || {}, w = Math.sqrt(R * R - h * h), P0 = Object.assign({ O: [0, 0], A: [-w, h], B: [w, h], M: [0, h] }, opt.c ? { C: [0, R] } : {}, opt.more ? opt.more(R, h, w) : {});
    const P1 = opt.tilt ? spin(P0, opt.tilt) : P0;
    return fitPts(P1, opt.size || [170, 170], [[[0, 0], R]]);
  }
  // 원 O 의 두 현 AB, CD 와 중심에서 내린 수선 OM, ON. aM, aN: 중심에서 수선의 발 쪽 방향(도), h1·h2: 중심에서 두 현까지의 거리
  function twoChordPts(R, h1, h2, aM, aN, o) {
    const opt = o || {}, w1 = Math.sqrt(R * R - h1 * h1), w2 = Math.sqrt(R * R - h2 * h2), O = [0, 0];
    const M0 = at(O, h1, aM), N0 = at(O, h2, aN);
    const P0 = { O, M: M0, A: at(M0, w1, aM + 90), B: at(M0, w1, aM - 90), N: N0, C: at(N0, w2, aN - 90), D: at(N0, w2, aN + 90) };
    if (opt.more) Object.assign(P0, opt.more(P0));
    return fitPts(P0, opt.size || [175, 175], [[O, R]]);
  }
  // 원 O 에 내접하는 삼각형 ABC(세 내각의 크기 al = ∠A, be = ∠B). A 가 위에 오고 BC 는 가로. 반지름 R(cm)
  function inscribed(al, be, R, o) {
    const opt = o || {}, O = [0, 0], P0 = { O, B: at(O, R, 270 - al), C: at(O, R, 270 + al), A: at(O, R, 270 + al + 2 * be) };
    if (opt.feet) Object.assign(P0, { M: foot(O, P0.A, P0.B), N: foot(O, P0.A, P0.C) }, opt.feet === 'L' ? { L: foot(O, P0.B, P0.C) } : {});
    if (opt.more) Object.assign(P0, opt.more(P0));
    return fitPts(opt.tilt ? spin(P0, opt.tilt) : P0, opt.size || [180, 180], [[O, R]]);
  }

  // ── 문장 ──
  const CHORD_TRUE = [
    '원의 중심에서 현에 내린 수선은 그 현을 이등분한다.', '원에서 현의 수직이등분선은 그 원의 중심을 지난다.',
    '한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같다.', '한 원에서 길이가 같은 두 현은 원의 중심으로부터 같은 거리에 있다.'
  ];

  B.addUnit({
    id: '9-2-3', grade: 9, semester: 2, no: 3, title: '원과 직선', version: 1,
    groups: [
      {
        id: 'perp', title: '원의 중심과 현의 수직이등분선', standard: STD,
        types: [
          T('perp-half', '원의 중심에서 현에 내린 수선으로 나뉜 현의 반', '①1', (d) => {
            const half = d.int(3, 15), ratio = d.pick([0.45, 0.5, 0.58]), R = half / Math.sqrt(1 - ratio * ratio), P = chordPts(R, R * ratio);
            const S = scene(P).ring('O', R).seg('AB OM').right('OMB').dot('O').len('AB', cm(2 * half), 'O').names({ M: 135 });
            return cmQ(`다음 그림과 같이 원 O의 중심에서 현 AB에 내린 수선의 발을 M이라 하자. ${is('AB', 2 * half)}일 때, ${jo(sg('AM'), '의/의')} 길이는?`, half, {
              figure: S.svg(`원 O와 현 AB. 원의 중심 O에서 현 AB에 내린 수선의 발이 M이고 M에 직각 표시가 있다. 현 AB의 길이는 ${2 * half} cm`),
              explain: `원의 중심에서 현에 내린 수선은 그 현을 이등분하므로 ${sg('AM')} = ${frac(1, 2)} × ${sg('AB')} = ${frac(1, 2)} × ${2 * half} = ${half}(cm)이다.`,
              facts: { calc: [[`${2 * half}/2`, 0]], unseen: [2] }
            });
          }),
          T('perp-chord', '반지름과 중심에서 현까지의 거리로 현의 길이 구하기', '①2', (d) => {
            const [R, h] = d.until(() => [d.int(4, 12), d.int(2, 9)], ([r, k]) => k <= 0.62 * r && k >= 0.4 * r && !isSq(r * r - k * k)), v = R * R - h * h, [s, m] = split(v);
            const P = chordPts(R, h), S = scene(P).ring('O', R).seg('AB OM OA').right('OMB').dot('O').len('OA', cm(R), 'M').len('OM', cm(h), 'A').names();
            return radQ(`다음 그림과 같이 반지름의 길이가 ${R} cm인 원 O의 중심에서 현 AB에 내린 수선의 발을 M이라 하자. ${is('OM', h)}일 때, 현 AB의 길이는?`, 2 * s, m, 'cm', {
              figure: S.svg(`원 O와 현 AB. 원의 중심 O에서 현 AB에 내린 수선의 발이 M이고 M에 직각 표시가 있다. 반지름 OA의 길이는 ${R} cm, 선분 OM의 길이는 ${h} cm`),
              explain: `△OAM은 ∠OMA = 90°인 직각삼각형이므로 ${sg('AM')} = ${rootOf(`${sq(R)} − ${sq(h)}`)} = ${rt(v)} = ${rad(s, m)}(cm)이다. 원의 중심에서 현에 내린 수선은 그 현을 이등분하므로 ${sg('AB')} = 2${sg('AM')} = ${radText(2 * s, m)}(cm)이다.`,
              facts: { calc: [[`2*((${R}*${R}-${h}*${h})/${m})**0.5`, 0], [`${m}`, 1]], unseen: [2, m] }
            });
          }),
          T('perp-radius', '현의 길이와 중심에서 현까지의 거리로 반지름 구하기', '①3', (d) => {
            const [h, w, R] = triple(d, ([a, b]) => a < b && a >= 0.38 * b && b <= 20), P = chordPts(R, h);
            const S = scene(P).ring('O', R).seg('AB OM OA').right('OMB').dot('O').len('OA', `${sv('x')} cm`, 'M').len('OM', cm(h), 'A').len('AB', cm(2 * w), 'O').names({ M: 135 });
            return xQ(`다음 그림과 같이 원 O의 중심에서 길이가 ${2 * w} cm인 현 AB에 내린 수선의 발을 M이라 하자. ${is('OM', h)}, ${nb(`${sg('OA')} = ${X} cm`)}일 때, ${X}의 값은?`, R, {
              figure: S.svg(`원 O와 현 AB. 원의 중심 O에서 현 AB에 내린 수선의 발이 M이고 M에 직각 표시가 있다. 현 AB의 길이는 ${2 * w} cm, 선분 OM의 길이는 ${h} cm, 반지름 OA의 길이는 x cm`),
              explain: `원의 중심에서 현에 내린 수선은 그 현을 이등분하므로 ${sg('AM')} = ${2 * w} ÷ 2 = ${w}(cm)이다. 직각삼각형 OAM에서 ${X} = ${rootOf(`${sq(w)} + ${sq(h)}`)} = ${rt(w * w + h * h)} = ${R}이다.`,
              facts: { calc: [[`((${2 * w}/2)*(${2 * w}/2)+${h}*${h})**0.5`, 0]], unseen: [2] }
            });
          }),
          T('perp-dist', '반지름과 현의 길이로 중심에서 현까지의 거리 구하기', '①4', (d) => {
            const [h, w, R] = triple(d, ([a, b]) => a < b && a >= 0.38 * b && b <= 20), P = chordPts(R, h);
            const S = scene(P).ring('O', R).seg('AB OM OA').right('OMB').dot('O').len('OA', cm(R), 'M').len('AB', cm(2 * w), 'O').names({ M: 135 });
            return cmQ(`다음 그림과 같이 반지름의 길이가 ${R} cm인 원 O에서 ${is('AB', 2 * w)}이다. 원의 중심 O에서 현 AB에 내린 수선의 발을 M이라 할 때, ${jo(sg('OM'), '의/의')} 길이는?`, h, {
              figure: S.svg(`원 O와 현 AB. 원의 중심 O에서 현 AB에 내린 수선의 발이 M이고 M에 직각 표시가 있다. 반지름 OA의 길이는 ${R} cm, 현 AB의 길이는 ${2 * w} cm`),
              explain: `원의 중심에서 현에 내린 수선은 그 현을 이등분하므로 ${sg('AM')} = ${2 * w} ÷ 2 = ${w}(cm)이다. 직각삼각형 OAM에서 ${sg('OM')} = ${rootOf(`${sq(R)} − ${sq(w)}`)} = ${rt(R * R - w * w)} = ${h}(cm)이다.`,
              facts: { calc: [[`(${R}*${R}-(${2 * w}/2)*(${2 * w}/2))**0.5`, 0]], unseen: [2] }
            });
          }),
          T('perp-60', '중심각이 60°인 현까지의 거리', '①5', (d) => {
            const k = d.int(2, 9), R = 2 * k, O = [0, 0], P = fitPts({ O, A: at(O, R, 240), B: at(O, R, 300) }, [165, 165], [[O, R]]);
            const S = scene(P).ring('O', R).seg('OA OB AB').ang('AOB', '60°').dot('O').len('OA', cm(R), 'B').names({ O: 90 });
            return radQ(`다음 그림의 원 O에서 ∠AOB = 60°이고 ${is('OA', R)}일 때, 원의 중심 O에서 현 AB까지의 거리는?`, k, 3, 'cm', {
              figure: S.svg(`원 O 위의 두 점 A, B와 반지름 OA, OB, 현 AB. ∠AOB의 크기는 60°이다. 반지름 OA의 길이는 ${R} cm`),
              explain: `${eq('OA', 'OB')}이고 ∠AOB = 60°이므로 △OAB는 정삼각형이고 ${sg('AB')} = ${R} cm이다. 점 O에서 현 AB에 내린 수선의 발을 M이라 하면 수선은 현을 이등분하므로 ${sg('AM')} = ${k} cm이고, ${sg('OM')} = ${rootOf(`${sq(R)} − ${sq(k)}`)} = ${rt(3 * k * k)} = ${radText(k, 3)}(cm)이다.`,
              facts: { calc: [[`${R}/2`, 0], ['3', 1]], unseen: [2, 3] }
            });
          }),
          T('perp-diam', '지름과 수직인 현의 길이', '①6', (d) => {
            const [R, t] = d.until(() => [d.int(3, 12), d.int(1, 11)], ([r, k]) => k <= 0.7 * r && k >= 0.25 * r && !isSq(k * (2 * r - k))), v = t * (2 * R - t), [s, m] = split(v), c = Math.sqrt(v);
            const O = [0, 0], P = fitPts({ O, A: [-R, 0], B: [R, 0], M: [R - t, 0], C: [R - t, -c], D: [R - t, c] }, [170, 170], [[O, R]]);
            const am = 2 * R - t, S = scene(P).ring('O', R).seg('AB CD').right('BMC').dot('O').len('AM', cm(am), 'D', { gap: 4 }).names({ O: 270, M: [315, 12] });
            return radQ(`다음 그림과 같이 원 O의 지름 AB와 현 CD가 점 M에서 수직으로 만난다. ${is('AB', 2 * R)}, ${is('AM', am)}일 때, ${jo(sg('CD'), '의/의')} 길이는?`, 2 * s, m, 'cm', {
              figure: S.svg(`원 O의 지름 AB와 현 CD가 점 M에서 수직으로 만난다. 점 M은 중심 O와 점 B 사이에 있다. 선분 AM의 길이는 ${am} cm`),
              explain: `원 O의 반지름의 길이는 ${2 * R} ÷ 2 = ${R}(cm)이므로 ${sg('OM')} = ${am} − ${R} = ${R - t}(cm)이다. 반지름 OC를 그으면 직각삼각형 OCM에서 ${sg('CM')} = ${rootOf(`${sq(R)} − ${sq(R - t)}`)} = ${rt(v)} = ${rad(split(v)[0], m)}(cm)이다. 원의 중심을 지나는 지름이 현 CD에 수직이므로 현을 이등분하고 ${sg('CD')} = 2${sg('CM')} = ${radText(2 * s, m)}(cm)이다.`,
              facts: { calc: [[`2*(((${2 * R}/2)*(${2 * R}/2)-(${am}-${2 * R}/2)*(${am}-${2 * R}/2))/${m})**0.5`, 0], [`${m}`, 1]], unseen: [2, m] }
            });
          }),
          T('perp-sagitta', '현의 수직이등분선이 원과 만나는 점까지의 길이로 반지름 구하기', '①7', (d, n) => {
            // n = 0: 반지름(분수), n = 1: 원의 넓이(반지름이 자연수)
            const [a, h] = d.until(() => [d.int(3, 12), d.int(1, 8)], ([p, q]) => { const r = (p * p + q * q) / (2 * q); return q < p && q >= 0.3 * r && q <= 0.6 * r && (n === 0 ? !Number.isInteger(r) : Number.isInteger(r)) && r <= 20; });
            const R = (a * a + h * h) / (2 * h), P = chordPts(R, R - h, { c: true });
            const S = scene(P).ring('O', R).seg('AB OC OA').right('OMB').dot('O');
            if (n === 0) {
              S.len('AM', cm(a), 'O', { t: 0.6 }).len('MC', cm(h), 'A', { gap: 4 }).names({ M: 135 });
              return fracQ(`다음 그림의 원 O에서 ${perp('AB', 'OC')}이고 ${is('AM', a)}, ${is('CM', h)}일 때, 원 O의 반지름의 길이는?`, a * a + h * h, 2 * h, 'cm', {
                figure: S.svg(`원 O와 현 AB. 반지름 OC가 현 AB와 점 M에서 수직으로 만난다. 반지름 OA가 그어져 있다. 선분 AM의 길이는 ${a} cm, 선분 CM의 길이는 ${h} cm`),
                explain: `원 O의 반지름의 길이를 ${R_} cm라 하면 ${sg('OM')} = (${R_} − ${h}) cm이다. 직각삼각형 OAM에서 ${R_}${sup2} = ${sq(a)} + (${R_} − ${h})${sup2}, ${2 * h}${R_} = ${a * a + h * h}이므로 ${R_} = ${frac((a * a + h * h) / gcd(a * a + h * h, 2 * h), 2 * h / gcd(a * a + h * h, 2 * h))}이다.`,
                facts: { value: `(${a}*${a}+${h}*${h})/(2*${h})`, unseen: [2] }
              });
            }
            S.len('AB', cm(2 * a), 'O', { t: 0.3 }).len('MC', cm(h), 'A', { gap: 4 }).names({ M: 135 });
            return piQ(`다음 그림의 원 O에서 ${perp('AB', 'OC')}이고 ${is('AB', 2 * a)}, ${is('MC', h)}일 때, 원 O의 넓이는?`, R * R, 'cm²', {
              figure: S.svg(`원 O와 현 AB. 반지름 OC가 현 AB와 점 M에서 수직으로 만난다. 반지름 OA가 그어져 있다. 현 AB의 길이는 ${2 * a} cm, 선분 MC의 길이는 ${h} cm`),
              explain: `원의 중심에서 현에 내린 수선은 그 현을 이등분하므로 ${sg('AM')} = ${2 * a} ÷ 2 = ${a}(cm)이다. 반지름의 길이를 ${R_} cm라 하면 ${sg('OM')} = (${R_} − ${h}) cm이고, 직각삼각형 OAM에서 ${R_}${sup2} = ${sq(a)} + (${R_} − ${h})${sup2}, ${2 * h}${R_} = ${a * a + h * h}이므로 ${R_} = ${R}이다. 원 O의 넓이는 π × ${sq(R)} = ${R * R}π(cm²)이다.`,
              facts: { calc: [[`((${2 * a}/2)*(${2 * a}/2)+${h}*${h})/(2*${h})*((${2 * a}/2)*(${2 * a}/2)+${h}*${h})/(2*${h})`, 0]], unseen: [2] }
            });
          }, { count: 2 }),
          T('perp-arc', '원의 일부분인 호만 있을 때 원의 반지름 구하기', '①8', (d) => {
            const [a, h] = d.until(() => [d.int(3, 12), d.int(1, 8)], ([p, q]) => { const r = (p * p + q * q) / (2 * q); return q < p && q >= 0.22 * r && Number.isInteger(r) && r <= 30; });
            const R = (a * a + h * h) / (2 * h), Oc = [0, R - h], P = fitPts({ A: [-a, 0], B: [a, 0], D: [0, 0], C: [0, -h] }, [200, 110]);
            const k = P.k, c = [P.D[0], P.D[1] + (R - h) * k], S = scene(P), aB = dirOf(c, P.B), aA = dirOf(c, P.A);
            S.b.arc(c, R * k, aB, aA);
            S.seg('AB CD').right('BDC').len('AD', cm(a), 'C', { gap: 4 }).len('DB', cm(a), 'C', { gap: 4 }).len('CD', cm(h), 'B', { gap: 3 }).names({ A: 200, B: 340, C: 90, D: 270 });
            return cmQ(`다음 그림에서 호 AB는 원의 일부분이다. ${perp('AB', 'CD')}이고 ${nb(`${sg('AD')} = ${sg('BD')} = ${a} cm`)}, ${is('CD', h)}일 때, 이 원의 반지름의 길이는?`, R, {
              figure: S.svg(`원의 일부분인 호 AB와 현 AB. 호 위의 점 C에서 현 AB에 내린 수선의 발이 D이고 D에 직각 표시가 있다. 선분 AD와 선분 DB의 길이는 각각 ${a} cm, 선분 CD의 길이는 ${h} cm`),
              explain: `${sg('CD')}는 현 AB의 수직이등분선이므로 그 연장선은 원의 중심을 지난다. 원의 중심을 O, 반지름의 길이를 ${R_} cm라 하면 ${sg('OD')} = (${R_} − ${h}) cm이고, 직각삼각형 AOD에서 ${R_}${sup2} = ${sq(a)} + (${R_} − ${h})${sup2}, ${2 * h}${R_} = ${a * a + h * h}이므로 ${R_} = ${R}이다.`,
              facts: { calc: [[`(${a}*${a}+${h}*${h})/(2*${h})`, 0]], unseen: [2] }
            });
          }),
          T('perp-fold', '원 위의 한 점이 중심에 오도록 접은 현의 길이', '①9', (d) => {
            const R = d.int(4, 16), O = [0, 0], w = R * Math.sqrt(3) / 2, P = fitPts({ O, A: [-w, -R / 2], B: [w, -R / 2] }, [165, 165], [[O, R]]);
            const k = P.k, c = P.O, c2 = [c[0], c[1] - R * k], aB = dirOf(c2, P.B), aA = dirOf(c2, P.A), S = scene(P);
            // 접혀 넘어온 부분(색칠): 현 AB 와, 중심 O 를 지나는 호(원 O 를 AB 에 대하여 접은 원의 일부)
            S.b.shape(`M${r1(P.A)}${arcPath(c2, R * k, aA, aB)}Z`, [P.A, P.B, c], TINT);
            S.ring('O', R).seg('AB').dot('O').text([c[0], c[1] + 13], 'O').names({ O: null, A: 160, B: 20 });
            return radQ(`반지름의 길이가 ${R} cm인 원 O 모양의 종이를 다음 그림과 같이 원 위의 한 점이 원의 중심 O에 겹쳐지도록 접었다. 접힌 선이 원과 만나는 두 점을 A, B라 할 때, ${jo(sg('AB'), '의/의')} 길이는?`, R, 3, 'cm', {
              figure: S.svg(`원 O를 현 AB를 접는 선으로 하여 접었다. 접혀 넘어온 부분이 색칠되어 있고, 그 호가 원의 중심 O를 지난다`),
              explain: `원의 중심 O에서 현 AB에 내린 수선의 발을 M이라 하면, 접어서 원 위의 점이 O에 왔으므로 ${sg('OM')}은 반지름의 반인 ${frac(R, 2)} cm이다. 직각삼각형 OAM에서 ${sg('AM')} = ${rootOf(`${sq(R)} − (${frac(R, 2)})${sup2}`)} = ${frac(radText(R, 3), 2)}(cm)이고, 수선은 현을 이등분하므로 ${sg('AB')} = 2${sg('AM')} = ${radText(R, 3)}(cm)이다.`,
              facts: { calc: [[`${R}`, 0], ['3', 1]], unseen: [3] }
            });
          }),
          T('perp-fold-back', '접은 현의 길이로 원의 반지름 구하기', '①10', (d) => {
            const R = d.int(4, 16), O = [0, 0], w = R * Math.sqrt(3) / 2, P = fitPts({ O, A: [-w, -R / 2], B: [w, -R / 2] }, [165, 165], [[O, R]]);
            const k = P.k, c = P.O, c2 = [c[0], c[1] - R * k], aB = dirOf(c2, P.B), aA = dirOf(c2, P.A), S = scene(P);
            S.b.shape(`M${r1(P.A)}${arcPath(c2, R * k, aA, aB)}Z`, [P.A, P.B, c], TINT);
            S.ring('O', R).seg('AB').dot('O').text([c[0], c[1] + 13], 'O').names({ O: null, A: 160, B: 20 });
            return cmQ(`원 O 모양의 종이를 다음 그림과 같이 원 위의 한 점이 원의 중심 O에 겹쳐지도록 접었더니 접힌 선 AB의 길이가 ${nb(`${radText(R, 3)} cm`)}였다. 원 O의 반지름의 길이는?`, R, {
              figure: S.svg(`원 O를 현 AB를 접는 선으로 하여 접었다. 접혀 넘어온 부분이 색칠되어 있고, 그 호가 원의 중심 O를 지난다`),
              explain: `반지름의 길이를 ${R_} cm라 하자. 중심 O에서 현 AB에 내린 수선의 발을 M이라 하면 ${sg('OM')} = ${frac(R_, 2)} cm이고 ${sg('AM')} = ${frac(radText(R, 3), 2)} cm이다. 직각삼각형 OAM에서 ${R_}${sup2} = (${frac(radText(R, 3), 2)})${sup2} + (${frac(R_, 2)})${sup2}, ${frac(3, 4)}${R_}${sup2} = ${frac(3 * R * R, 4)}이므로 ${R_} = ${R}이다.`,
              facts: { calc: [[`${R}`, 0]] }
            });
          }),
          T('perp-ring-chords', '중심이 같은 두 원을 지나는 직선이 만드는 두 현', '①11', (d) => {
            const [p, q] = d.until(() => [d.int(4, 12), d.int(2, 9)], ([x, y]) => y < x && x - y >= 2 && y >= 0.35 * x), h = p * d.pick([0.55, 0.65, 0.75]);
            const R = Math.hypot(p, h), r = Math.hypot(q, h), O = [0, 0], P = fitPts({ O, A: [-p, h], C: [-q, h], D: [q, h], B: [p, h] }, [175, 175], [[O, R]]);
            const S = scene(P).ring('O', R).ring('O', r).seg('AB').dot('O').names({ O: 90, A: 200, B: 340, C: 90, D: 90 });
            return cmQ(`다음 그림과 같이 중심이 O로 같은 두 원이 있다. 큰 원의 현 AB가 작은 원과 두 점 C, D에서 만나고 ${is('AB', 2 * p)}, ${is('CD', 2 * q)}일 때, ${jo(sg('AC'), '의/의')} 길이는?`, p - q, {
              figure: S.svg(`중심이 O로 같은 큰 원과 작은 원. 큰 원의 현 AB가 작은 원과 두 점 C, D에서 만나고, 네 점은 A, C, D, B의 차례로 놓여 있다`),
              explain: `점 O에서 현 AB에 내린 수선의 발을 M이라 하면 이 수선은 큰 원의 현 AB와 작은 원의 현 CD를 함께 이등분한다. ${sg('AM')} = ${p} cm, ${sg('CM')} = ${q} cm이므로 ${sg('AC')} = ${p} − ${q} = ${p - q}(cm)이다.`,
              facts: { calc: [[`${2 * p}/2-${2 * q}/2`, 0]], unseen: [2] }
            });
          }),
          T('perp-ring-tangent', '작은 원에 접하는 큰 원의 현의 길이', '①12', (d) => {
            const [r, R] = d.until(() => [d.int(2, 9), d.int(3, 12)], ([a, b]) => a < b && a >= 0.45 * b && a <= 0.8 * b && !isSq(b * b - a * a)), v = R * R - r * r, [s, m] = split(v), w = Math.sqrt(v);
            const O = [0, 0], P = fitPts({ O, A: [-w, r], B: [w, r], T: [0, r] }, [170, 170], [[O, R]]);
            const S = scene(P).ring('O', R).ring('O', r).seg('AB OT OA').right('OTB').dot('O').names({ O: 90, T: 270 });
            return radQ(`다음 그림과 같이 중심이 O로 같은 두 원의 반지름의 길이가 각각 ${r} cm, ${R} cm이다. 큰 원의 현 AB가 작은 원에 점 T에서 접할 때, ${jo(sg('AB'), '의/의')} 길이는?`, 2 * s, m, 'cm', {
              figure: S.svg(`중심이 O로 같은 큰 원과 작은 원. 큰 원의 현 AB가 작은 원에 점 T에서 접하고, 선분 OT와 반지름 OA가 그어져 있다. T에 직각 표시가 있다`),
              explain: `원의 접선은 그 접점을 지나는 반지름과 수직이므로 ${perp('OT', 'AB')}이고, 큰 원의 중심 O에서 현 AB에 내린 수선은 ${sg('OT')}이다. 직각삼각형 OAT에서 ${sg('AT')} = ${rootOf(`${sq(R)} − ${sq(r)}`)} = ${rad(s, m)}(cm)이고, 수선은 현을 이등분하므로 ${sg('AB')} = 2${sg('AT')} = ${radText(2 * s, m)}(cm)이다.`,
              facts: { calc: [[`2*((${R}*${R}-${r}*${r})/${m})**0.5`, 0], [`${m}`, 1]], unseen: [2, m] }
            });
          }),
          T('perp-ring-area', '두 동심원 사이의 넓이로 작은 원에 접하는 현의 길이 구하기', '①13', (d) => {
            const [r, w, R] = triple(d, ([a, b, c]) => a >= 0.55 * b && a <= 0.65 * c && b <= 15), O = [0, 0], P = fitPts({ O, A: [-w, r], B: [w, r], T: [0, r] }, [170, 170], [[O, R]]);
            const S = scene(P), k = P.k;
            S.b.disk(P.O, R * k, TINT).disk(P.O, r * k, WHITE);
            S.ring('O', R).ring('O', r).seg('AB').dot('O').names({ O: 90, T: 270 });
            return cmQ(`다음 그림과 같이 중심이 O로 같은 두 원에서 큰 원의 현 AB가 작은 원에 점 T에서 접한다. 두 원 사이의 색칠한 부분의 넓이가 ${w * w}π cm²일 때, ${jo(sg('AB'), '의/의')} 길이는?`, 2 * w, {
              figure: S.svg(`중심이 O로 같은 큰 원과 작은 원. 두 원 사이가 색칠되어 있다. 큰 원의 현 AB가 작은 원에 점 T에서 접한다`),
              explain: `큰 원과 작은 원의 반지름의 길이를 각각 R, r라 하면 색칠한 부분의 넓이는 π × R${sup2} − π × r${sup2} = ${w * w}π이므로 R${sup2} − r${sup2} = ${w * w}이다. ${perp('OT', 'AB')}이므로 직각삼각형 OAT에서 ${sg('AT')}${sup2} = R${sup2} − r${sup2} = ${w * w}, ${sg('AT')} = ${w} cm이다. 수선은 현을 이등분하므로 ${sg('AB')} = 2 × ${w} = ${2 * w}(cm)이다.`,
              facts: { calc: [[`2*(${w * w})**0.5`, 0]], unseen: [2] }
            });
          }),
          T('perp-proof', '원의 중심에서 현에 내린 수선이 현을 이등분함을 설명하는 과정의 빈칸', '①14', (d) => {
            const R = 10, h = 5.5, P = chordPts(R, h, { size: [150, 150] });
            const S = scene(P).ring('O', R).seg('AB OM OA OB').right('OMB').dot('O').names();
            const right = '90°, OB, RHS', wrongs = ['90°, AB, RHS', '90°, OB, SAS', '180°, OB, RHS', '90°, OM, RHA'];
            return pickOne(d, '다음은 원의 중심에서 현에 내린 수선이 그 현을 이등분함을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?', right, wrongs, {
              figure: S.svg('원 O와 현 AB. 원의 중심 O에서 현 AB에 내린 수선의 발이 M이고 M에 직각 표시가 있다. 반지름 OA, OB가 그어져 있다') + lines([
                '원 O의 중심에서 현 AB에 내린 수선의 발을 M이라 하면 △OAM과 △OBM에서',
                `∠OMA = ∠OMB = ㈎, ${sg('OA')} = ㈏ (반지름), ${jo(sg('OM'), '은/는')} 공통`,
                `이므로 △OAM ≡ △OBM (㈐ 합동)이다. 따라서 ${eq('AM', 'BM')}이다.`]),
              explain: `수선의 발이므로 ∠OMA = ∠OMB = 90°이고, ${jo(sg('OA'), '과/와')} ${jo(sg('OB'), '은/는')} 원 O의 반지름이다. 빗변의 길이와 다른 한 변의 길이가 각각 같으므로 RHS 합동이다.`
            });
          }),
          T('perp-plate', '깨진 원 모양 접시의 중심을 찾는 방법', '①15', (d) => {
            const b = Board(); b.arc([0, 0], 80, d.int(195, 215), d.int(300, 325));
            const right = '조각의 호 위에 현 두 개를 긋고, 두 현의 수직이등분선이 만나는 점을 찾는다.';
            const wrongs = ['조각의 호 위에 현 두 개를 긋고, 두 현이 만나는 점을 찾는다.', '조각의 호 위에 현 하나를 긋고, 그 현의 중점을 찾는다.', '조각의 호의 양 끝 점을 이은 현의 수직이등분선 위에서 아무 점이나 잡는다.'];
            return pickOne(d, '다음 그림은 원 모양의 접시가 깨진 조각의 호이다. 이 조각으로 깨지기 전 접시의 중심을 찾는 방법으로 옳은 것은?', right, wrongs, {
              figure: b.svg('원 모양의 접시가 깨진 조각의 호'),
              explain: '원에서 현의 수직이등분선은 그 원의 중심을 지난다. 따라서 조각의 호 위에 현 두 개를 그으면 두 현의 수직이등분선이 모두 중심을 지나므로, 두 수직이등분선이 만나는 점이 접시의 중심이다. 현 하나의 수직이등분선 위의 점이 모두 중심인 것은 아니다.'
            });
          })
        ]
      },
      {
        id: 'equal', title: '중심으로부터 같은 거리에 있는 두 현', standard: STD,
        types: [
          T('equal-len', '중심에서 같은 거리에 있는 두 현의 길이', '①16', (d) => {
            const [h, w, R] = triple(d, ([a, b]) => a < b && a >= 0.4 * b && b <= 16), aM = d.pick([160, 170, 180]), aN = d.pick([0, 10, 20]);
            const P = twoChordPts(R, h, h, aM, aN), S = scene(P).ring('O', R).seg('AB CD OM ON').right('OMB ONC').tick('OM ON', 2).dot('O').len('CN', cm(w), mirror(P.O, P.C, P.N), { gap: 4 }).names();
            return cmQ(`다음 그림의 원 O에서 ${perp('OM', 'AB')}, ${perp('ON', 'CD')}이고 ${eq('OM', 'ON')}이다. ${is('CN', w)}일 때, ${jo(sg('AB'), '의/의')} 길이는?`, 2 * w, {
              figure: S.svg(`원 O의 두 현 AB, CD. 원의 중심 O에서 두 현에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. 선분 CN의 길이는 ${w} cm`),
              explain: `원의 중심에서 현에 내린 수선은 현을 이등분하므로 ${sg('CD')} = 2${sg('CN')} = ${2 * w}(cm)이다. 한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 ${sg('AB')} = ${sg('CD')} = ${2 * w} cm이다.`,
              facts: { calc: [[`2*${w}`, 0]], unseen: [2] }
            });
          }),
          T('equal-dist', '길이가 같은 두 현까지의 거리', '①17', (d) => {
            const [h, w, R] = triple(d, ([a, b]) => a < b && a >= 0.4 * b && b <= 16), aM = d.pick([160, 170, 180]), aN = d.pick([0, 10, 20]);
            const P = twoChordPts(R, h, h, aM, aN), S = scene(P).ring('O', R).seg('AB CD OM ON').right('OMA ONC').tick('AB CD', 1).dot('O').len('OM', cm(h), 'A', { gap: 3 }).names({ O: 270 });
            return cmQ(`다음 그림의 원 O에서 ${perp('OM', 'AB')}, ${perp('ON', 'CD')}이고 ${eq('AB', 'CD')}이다. ${is('OM', h)}일 때, ${jo(sg('ON'), '의/의')} 길이는?`, h, {
              figure: S.svg(`원 O의 두 현 AB, CD에 길이가 같다는 표시가 있다. 원의 중심 O에서 두 현에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM의 길이는 ${h} cm`),
              explain: `한 원에서 길이가 같은 두 현은 원의 중심으로부터 같은 거리에 있으므로 ${sg('ON')} = ${sg('OM')} = ${h} cm이다.`,
              facts: { calc: [[`${h}`, 0]] }
            });
          }),
          T('equal-dist-r', '길이가 같은 두 현과 반지름으로 다른 현까지의 거리 구하기', '①18', (d) => {
            const [h, w, R] = triple(d, ([a, b]) => a < b && a >= 0.4 * b && b <= 16), aM = d.pick([160, 170, 180]), aN = d.pick([0, 10, 20]);
            const P = twoChordPts(R, h, h, aM, aN), S = scene(P).ring('O', R).seg('AB CD OM ON OA').right('OMB ONC').dot('O').len('OA', cm(R), 'M', { gap: 3 }).names();
            return cmQ(`다음 그림의 원 O에서 ${perp('OM', 'AB')}, ${perp('ON', 'CD')}이고 ${nb(`${sg('AB')} = ${sg('CD')} = ${2 * w} cm`)}이다. ${is('OA', R)}일 때, ${jo(sg('ON'), '의/의')} 길이는?`, h, {
              figure: S.svg(`원 O의 두 현 AB, CD. 원의 중심 O에서 두 현에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 반지름 OA가 그어져 있고 그 길이는 ${R} cm`),
              explain: `수선은 현을 이등분하므로 ${sg('AM')} = ${2 * w} ÷ 2 = ${w}(cm)이고, 직각삼각형 OAM에서 ${sg('OM')} = ${rootOf(`${sq(R)} − ${sq(w)}`)} = ${h}(cm)이다. 길이가 같은 두 현은 원의 중심으로부터 같은 거리에 있으므로 ${sg('ON')} = ${sg('OM')} = ${h} cm이다.`,
              facts: { calc: [[`(${R}*${R}-(${2 * w}/2)*(${2 * w}/2))**0.5`, 0]], unseen: [2] }
            });
          }),
          T('equal-words', '중심에서 같은 거리에 있는 두 현의 성질을 적은 식의 빈칸', '①19', (d) => {
            const P = twoChordPts(10, 6, 6, 170, 10, { size: [150, 150] }), S = scene(P).ring('O', 10).seg('AB CD OM ON').right('OMB ONC').tick('OM ON', 2).dot('O').names();
            return pickOne(d, `다음 그림의 원 O에서 ${perp('OM', 'AB')}, ${perp('ON', 'CD')}이다. ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, `${sg('CD')}, 2`, [`${sg('CD')}, 3`, `${sg('ON')}, 2`, `${sg('OC')}, 2`, `${sg('CN')}, 3`], {
              figure: S.svg('원 O의 두 현 AB, CD. 원의 중심 O에서 두 현에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다') + lines([
                `${eq('OM', 'ON')}이면 ${jo(sg('AB'), '은/는')} ㈎와 길이가 같다.`, `${sg('AB')} = ㈏ × ${sg('AM')}`]),
              explain: `한 원에서 중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 ${eq('AB', 'CD')}이다. 원의 중심에서 현에 내린 수선은 현을 이등분하므로 ${sg('AB')} = 2${sg('AM')}이다.`
            });
          }),
          T('equal-proof', '중심에서 같은 거리에 있는 두 현의 길이가 같음을 설명하는 과정의 빈칸', '①14', (d) => {
            const P = twoChordPts(10, 6, 6, 170, 10, { size: [150, 150] }), S = scene(P).ring('O', 10).seg('AB CD OM ON OA OC').right('OMB ONC').tick('OM ON', 2).dot('O').names();
            const right = `RHS, ${sg('CN')}, ${sg('CD')}`, wrongs = [`RHA, ${sg('CN')}, ${sg('CD')}`, `SAS, ${sg('CN')}, ${sg('CD')}`, `RHS, ${sg('ON')}, ${sg('CD')}`, `RHS, ${sg('CN')}, ${sg('OC')}`];
            return pickOne(d, `다음은 원 O에서 ${eq('OM', 'ON')}이면 ${eq('AB', 'CD')}임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`, right, wrongs, {
              figure: S.svg('원 O의 두 현 AB, CD. 원의 중심 O에서 두 현에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. 반지름 OA, OC가 그어져 있다') + lines([
                `△OAM과 △OCN에서 ∠OMA = ∠ONC = 90°, ${eq('OA', 'OC')}, ${eq('OM', 'ON')}이므로 △OAM ≡ △OCN (㈎ 합동)이다.`,
                `따라서 ${sg('AM')} = ㈏이고, 수선은 현을 이등분하므로 ${sg('AB')} = 2${sg('AM')} = 2㈏ = ㈐이다.`]),
              explain: `빗변(반지름)과 다른 한 변(${sg('OM')}, ${sg('ON')})의 길이가 각각 같은 두 직각삼각형이므로 RHS 합동이다. 대응하는 변 ${jo(sg('AM'), '과/와')} ${jo(sg('CN'), '의/의')} 길이가 같고, ${sg('AB')} = 2${sg('AM')} = 2${sg('CN')} = ${sg('CD')}이다.`
            });
          }),
          T('equal-radius', '같은 거리에 있는 두 현에서 다른 현의 끝과 중심 사이의 거리', '①20', (d) => {
            const [w, h] = d.until(() => [d.int(3, 12), d.int(3, 12)], ([a, b]) => { const v = a * a + b * b; return b <= 0.85 * a + 2 && b >= 0.45 * a && !isSq(v) && split(v)[0] >= 2; }), v = w * w + h * h, [s, m] = split(v), R = Math.sqrt(v);
            const P = twoChordPts(R, h, h, 170, 10), S = scene(P).ring('O', R).seg('AB CD OM ON OC').right('OMA ONC').tick('OM ON', 2).dot('O').len('OM', cm(h), 'A', { gap: 3 }).names({ O: 270 });
            return radQ(`다음 그림의 원 O에서 ${perp('OM', 'AB')}, ${perp('ON', 'CD')}이고 ${is('AB', 2 * w)}, ${nb(`${sg('OM')} = ${sg('ON')} = ${h} cm`)}일 때, ${jo(sg('OC'), '의/의')} 길이는?`, s, m, 'cm', {
              figure: S.svg(`원 O의 두 현 AB, CD. 원의 중심 O에서 두 현에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. 반지름 OC가 그어져 있다. 선분 OM의 길이는 ${h} cm`),
              explain: `${eq('OM', 'ON')}이므로 ${sg('CD')} = ${sg('AB')} = ${2 * w} cm이고, 수선은 현을 이등분하므로 ${sg('CN')} = ${w} cm이다. 직각삼각형 OCN에서 ${sg('OC')} = ${rootOf(`${sq(w)} + ${sq(h)}`)} = ${rt(v)} = ${radText(s, m)}(cm)이다.`,
              facts: { calc: [[`(((${2 * w}/2)*(${2 * w}/2)+${h}*${h})/${m})**0.5`, 0], [`${m}`, 1]], unseen: [2, m] }
            });
          }),
          T('equal-chord-r', '같은 거리에 있는 두 현에서 반지름으로 다른 현의 길이 구하기', '①21', (d) => {
            const [h, w, R] = triple(d, ([a, b]) => a < b && a >= 0.4 * b && b <= 16), P = twoChordPts(R, h, h, 170, 10);
            const S = scene(P).ring('O', R).seg('AB CD OM ON OA').right('OMB OND').dot('O').len('OA', cm(R), 'M', { gap: 3 }).len('ON', cm(h), 'D', { gap: 3 }).names();
            return cmQ(`다음 그림의 원 O에서 ${perp('OM', 'AB')}, ${perp('ON', 'CD')}이고 ${nb(`${sg('OM')} = ${sg('ON')} = ${h} cm`)}, ${is('OA', R)}일 때, ${jo(sg('CD'), '의/의')} 길이는?`, 2 * w, {
              figure: S.svg(`원 O의 두 현 AB, CD. 원의 중심 O에서 두 현에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 반지름 OA가 그어져 있고 그 길이는 ${R} cm, 선분 ON의 길이는 ${h} cm`),
              explain: `직각삼각형 OAM에서 ${sg('AM')} = ${rootOf(`${sq(R)} − ${sq(h)}`)} = ${w}(cm)이고, 수선은 현을 이등분하므로 ${sg('AB')} = ${2 * w} cm이다. 중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 ${sg('CD')} = ${sg('AB')} = ${2 * w} cm이다.`,
              facts: { calc: [[`2*(${R}*${R}-${h}*${h})**0.5`, 0]], unseen: [2] }
            });
          }),
          T('equal-area', '길이가 같은 두 현에서 다른 현과 중심이 이루는 삼각형의 넓이', '①22', (d) => {
            const [w, h, R] = triple(d, ([a, b]) => b < a && b >= 0.4 * a && a <= 16), P = twoChordPts(R, h, h, 170, 10);
            const S = scene(P); S.b.poly([P.O, P.C, P.D], TINT);
            S.ring('O', R).seg('AB CD OM OC OD').right('OMA').tick('AB CD', 1).dot('O').len('OM', cm(h), 'A', { gap: 3 }).len('OD', cm(R), 'C', { gap: 3 }).names({ O: 270 });
            return cm2Q(`다음 그림의 원 O에서 ${perp('AB', 'OM')}이고 ${eq('AB', 'CD')}이다. ${is('OD', R)}, ${is('OM', h)}일 때, △OCD의 넓이는?`, w * h, {
              figure: S.svg(`원 O의 두 현 AB, CD에 길이가 같다는 표시가 있다. 원의 중심 O에서 현 AB에 내린 수선의 발이 M이고 M에 직각 표시가 있다. 삼각형 OCD가 색칠되어 있다. 반지름 OD의 길이는 ${R} cm, 선분 OM의 길이는 ${h} cm`),
              explain: `점 O에서 현 CD에 내린 수선의 발을 N이라 하면, 길이가 같은 두 현은 중심으로부터 같은 거리에 있으므로 ${sg('ON')} = ${sg('OM')} = ${h} cm이다. 직각삼각형 ODN에서 ${sg('DN')} = ${rootOf(`${sq(R)} − ${sq(h)}`)} = ${w}(cm)이고 ${sg('CD')} = 2${sg('DN')} = ${2 * w}(cm)이다. △OCD의 넓이는 ${frac(1, 2)} × ${2 * w} × ${h} = ${w * h}(cm²)이다.`,
              facts: { calc: [[`(${R}*${R}-${h}*${h})**0.5*${h}`, 0]] }
            });
          }),
          T('equal-half-area', '같은 거리에 있는 두 현에서 반현과 거리가 이루는 직각삼각형의 넓이', '①23', (d) => {
            const [h, w] = d.until(() => [d.int(4, 12), d.int(3, 12)], ([a, b]) => (a * b) % 2 === 0 && a <= 1.3 * b && a >= 0.4 * b), R = Math.hypot(h, w), P = twoChordPts(R, h, h, 170, 10);
            const S = scene(P); S.b.poly([P.O, P.M, P.B], TINT);
            S.ring('O', R).seg('AB CD OM ON OB').right('OMB ONC').tick('OM ON', 2).dot('O').len('OM', cm(h), 'B', { gap: 3 }).len('CD', cm(2 * w), mirror(P.O, P.C, P.D), { t: 0.3 }).names({ O: 300 });
            return cm2Q(`다음 그림의 원 O에서 ${perp('OM', 'AB')}, ${perp('ON', 'CD')}이고 ${nb(`${sg('OM')} = ${sg('ON')} = ${h} cm`)}, ${is('CD', 2 * w)}일 때, △OMB의 넓이는?`, h * w / 2, {
              figure: S.svg(`원 O의 두 현 AB, CD. 원의 중심 O에서 두 현에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. 삼각형 OMB가 색칠되어 있다. 선분 OM의 길이는 ${h} cm, 현 CD의 길이는 ${2 * w} cm`),
              explain: `중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 ${sg('AB')} = ${sg('CD')} = ${2 * w} cm이고, 수선은 현을 이등분하므로 ${sg('MB')} = ${w} cm이다. △OMB의 넓이는 ${frac(1, 2)} × ${h} × ${w} = ${h * w / 2}(cm²)이다.`,
              facts: { calc: [[`${h}*${2 * w}/2/2`, 0]], unseen: [2] }
            });
          }),
          T('equal-iso', '두 현까지의 거리가 같은 삼각형의 각', '①25·26', (d, n) => {
            // n = 0: 밑각으로 꼭지각, n = 1: 꼭지각으로 밑각
            const al = n === 0 ? 180 - 2 * d.int(55, 80) : 2 * d.int(15, 35), be = (180 - al) / 2, P = inscribed(al, be, 10, { feet: true });
            const S = scene(P).ring('O', 10).poly('ABC').seg('OM ON').right('OMA ONA').tick('OM ON', 2).dot('O');
            if (n === 0) {
              S.ang('ABC', deg(be)).names();
              return degQ(`다음 그림과 같이 원 O에 내접하는 △ABC에서 원의 중심 O에서 두 현 AB, AC에 내린 수선의 발을 각각 M, N이라 하자. ${eq('OM', 'ON')}이고 ∠B = ${be}°일 때, ∠A의 크기는?`, al, {
                figure: S.svg(`원 O에 내접하는 삼각형 ABC. 원의 중심 O에서 변 AB, AC에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. ∠B의 크기는 ${be}°`),
                explain: `중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 ${eq('AB', 'AC')}이고 △ABC는 이등변삼각형이다. ∠C = ∠B = ${be}°이므로 ∠A = 180° − 2 × ${be}° = ${al}°이다.`,
                facts: { calc: [[`180-2*${be}`, 0]], unseen: [180, 2] }
              });
            }
            S.ang('CAB', deg(al)).names();
            return degQ(`다음 그림과 같이 원 O의 중심에서 두 현 AB, AC에 내린 수선의 발을 각각 M, N이라 하자. ${eq('OM', 'ON')}이고 ∠BAC = ${al}°일 때, ∠ABC의 크기는?`, be, {
              figure: S.svg(`원 O에 내접하는 삼각형 ABC. 원의 중심 O에서 변 AB, AC에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. ∠A의 크기는 ${al}°`),
              explain: `중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 ${eq('AB', 'AC')}이고 △ABC는 이등변삼각형이다. ∠ABC = (180° − ${al}°) ÷ 2 = ${be}°이다.`,
              facts: { calc: [[`(180-${al})/2`, 0]], unseen: [180, 2] }
            });
          }, { count: 2 }),
          T('equal-mon', '사각형의 한 각으로 이등변삼각형의 밑각 구하기', '①27', (d) => {
            const th = 2 * d.int(55, 70), bt = 180 - th, al = th / 2, P = inscribed(bt, al, 10, { more: (Q) => ({ M: foot(Q.O, Q.A, Q.B), N: foot(Q.O, Q.A, Q.C) }), tilt: 0 });
            // 꼭지각이 있는 꼭짓점을 위에 둔다: 이름을 바꾸어 B 가 위, A·C 가 아래에 오게 한다.
            const Q = { O: P.O, B: P.A, A: P.B, C: P.C, M: P.M, N: P.N };
            Object.defineProperty(Q, 'k', { value: P.k });
            const S = scene(Q).ring('O', 10).poly('ABC').seg('OM ON').right('OMB ONB').tick('OM ON', 2).dot('O').ang('MON', deg(th), { r: 12 }).names();
            return degQ(`다음 그림과 같이 원 O에 내접하는 △ABC에서 ${perp('OM', 'AB')}, ${perp('ON', 'BC')}이고 ${eq('OM', 'ON')}이다. ∠MON = ${th}°일 때, ∠ACB의 크기는?`, al, {
              figure: S.svg(`원 O에 내접하는 삼각형 ABC. 원의 중심 O에서 변 AB, BC에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. ∠MON의 크기는 ${th}°`),
              explain: `사각형 MBNO에서 ∠B = 360° − (90° + ${th}° + 90°) = ${bt}°이다. 중심으로부터 같은 거리에 있는 두 현의 길이는 같으므로 ${eq('AB', 'BC')}이고, ∠ACB = (180° − ${bt}°) ÷ 2 = ${al}°이다.`,
              facts: { calc: [[`(180-(360-90-${th}-90))/2`, 0]], unseen: [180, 360, 90, 2] }
            });
          }),
          T('equal-mon-side', '세 변에 내린 수선 가운데 두 수선이 이루는 각으로 꼭지각 구하기', '①28', (d) => {
            const th = d.pick([110, 112, 114, 116, 118, 120, 122, 124, 126, 128]), c = 180 - th, al = 180 - 2 * c, P = inscribed(al, c, 10, { feet: 'L' });
            const S = scene(P).ring('O', 10).poly('ABC').seg('OM ON OL').right('OMA ONC OLC').tick('OM ON', 2).dot('O').ang('LON', deg(th), { r: 12 }).names();
            return degQ(`다음 그림과 같이 원 O에 내접하는 △ABC에서 ${perp('OM', 'AB')}, ${perp('ON', 'AC')}, ${perp('OL', 'BC')}이고 ${eq('OM', 'ON')}이다. ∠LON = ${th}°일 때, ∠A의 크기는?`, al, {
              figure: S.svg(`원 O에 내접하는 삼각형 ABC. 원의 중심 O에서 세 변 AB, AC, BC에 내린 수선의 발이 각각 M, N, L이고 세 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. ∠LON의 크기는 ${th}°`),
              explain: `사각형 OLCN에서 ∠C = 360° − (90° + ${th}° + 90°) = ${c}°이다. ${eq('OM', 'ON')}이므로 ${eq('AB', 'AC')}이고 ∠B = ∠C = ${c}°이다. 따라서 ∠A = 180° − 2 × ${c}° = ${al}°이다.`,
              facts: { calc: [[`180-2*(360-90-${th}-90)`, 0]], unseen: [180, 360, 90, 2] }
            });
          }),
          T('equal-equi', '꼭지각이 60°가 되는 그림에서 삼각형의 둘레', '①28', (d) => {
            const a = d.int(3, 12), P = inscribed(60, 60, 10, { feet: true }), S = scene(P).ring('O', 10).poly('ABC').seg('OM ON').right('OMA ONA').tick('OM ON', 2).dot('O').ang('MON', '120°', { r: 11 }).len('AM', cm(a), mirror(P.O, P.A, P.M), { gap: 4 }).names();
            return cmQ(`다음 그림과 같이 원 O에 내접하는 △ABC에서 원의 중심 O에서 두 현 AB, AC에 내린 수선의 발을 각각 M, N이라 하자. ${eq('OM', 'ON')}, ∠MON = 120°이고 ${is('AM', a)}일 때, △ABC의 둘레의 길이는?`, 6 * a, {
              figure: S.svg(`원 O에 내접하는 삼각형 ABC. 원의 중심 O에서 변 AB, AC에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 OM과 선분 ON에 길이가 같다는 표시가 있다. ∠MON의 크기는 120°, 선분 AM의 길이는 ${a} cm`),
              explain: `사각형 AMON에서 ∠A = 360° − (90° + 120° + 90°) = 60°이다. ${eq('OM', 'ON')}이므로 ${eq('AB', 'AC')}이고, 꼭지각이 60°인 이등변삼각형은 정삼각형이다. ${sg('AB')} = 2${sg('AM')} = ${2 * a}(cm)이므로 둘레의 길이는 3 × ${2 * a} = ${6 * a}(cm)이다.`,
              facts: { calc: [[`3*2*${a}`, 0]], unseen: [3, 2] }
            });
          }),
          T('equal-claims', '중심에서 두 현에 내린 수선에 대한 설명 가운데 옳지 않은 것', '①29', (d) => {
            const [al, be] = d.pick([[50, 76], [56, 72], [48, 70], [62, 46], [58, 78]]), P = inscribed(al, be, 10, { feet: true });
            const S = scene(P).ring('O', 10).poly('ABC').seg('OM ON MN', 'thin').right('OMA ONA').dot('O').names();
            const yes = [eq('AM', 'BM'), eq('AN', 'CN'), nb(`${sg('MN')} ∥ ${sg('BC')}`), nb(`${sg('BC')} = 2${sg('MN')}`)], no = eq('AB', 'AC');
            const opts = d.shuffle(yes.concat([no]));
            return C(`다음 그림과 같이 원 O에 내접하는 △ABC에서 ${perp('OM', 'AB')}, ${perp('ON', 'AC')}일 때, 다음 중 옳지 않은 것은?`, opts, opts.indexOf(no), {
              figure: S.svg('원 O에 내접하는 삼각형 ABC. 원의 중심 O에서 변 AB, AC에 내린 수선의 발이 각각 M, N이고 두 곳에 직각 표시가 있다. 선분 MN이 그어져 있다'),
              explain: `원의 중심에서 현에 내린 수선은 현을 이등분하므로 점 M, N은 각각 ${sg('AB')}, ${sg('AC')}의 중점이다. 삼각형의 두 변의 중점을 이은 선분은 나머지 변에 평행하고 그 길이는 나머지 변의 길이의 반이다. ${jo(sg('OM'), '과/와')} ${jo(sg('ON'), '이/가')} 같다는 조건이 없으므로 ${eq('AB', 'AC')}라고 할 수 없다.`,
              facts: { truth: opts.map((o) => o !== no), want: false }
            });
          }),
          T('equal-three', '중심에서 세 변까지의 거리가 같은 삼각형의 넓이', '심4', (d) => {
            const m = d.int(2, 7), P = inscribed(60, 60, 10, { more: (Q) => ({ D: foot(Q.O, Q.A, Q.B), E: foot(Q.O, Q.B, Q.C), F: foot(Q.O, Q.C, Q.A) }) });
            const S = scene(P).ring('O', 10).poly('ABC').seg('OD OE OF').right('ODA OEB OFC').tick('OD OE OF', 2).dot('O').len('AB', cm(2 * m), mirror(P.C, P.A, P.B), { t: 0.3 }).names();
            return radQ(`다음 그림과 같이 원 O에 내접하는 △ABC에서 원의 중심 O에서 세 변 AB, BC, CA에 내린 수선의 발을 각각 D, E, F라 하자. ${nb(`${sg('OD')} = ${sg('OE')} = ${sg('OF')}`)}이고 ${is('AB', 2 * m)}일 때, △ABC의 넓이는?`, m * m, 3, 'cm²', {
              figure: S.svg(`원 O에 내접하는 삼각형 ABC. 원의 중심 O에서 세 변 AB, BC, CA에 내린 수선의 발이 각각 D, E, F이고 세 곳에 직각 표시가 있다. 선분 OD, OE, OF에 길이가 같다는 표시가 있다. 변 AB의 길이는 ${2 * m} cm`),
              explain: `중심으로부터 같은 거리에 있는 현의 길이는 같으므로 ${nb(`${sg('AB')} = ${sg('BC')} = ${sg('CA')}`)}이고 △ABC는 한 변의 길이가 ${2 * m} cm인 정삼각형이다. 높이는 ${rootOf(`${sq(2 * m)} − ${sq(m)}`)} = ${radText(m, 3)}(cm)이므로 넓이는 ${frac(1, 2)} × ${2 * m} × ${radText(m, 3)} = ${radText(m * m, 3)}(cm²)이다.`,
              facts: { calc: [[`${2 * m}*${2 * m}/4`, 0], ['3', 1]], unseen: [4, 3] }
            });
          }),
          T('equal-incenter', '내심을 중심으로 하는 원이 세 변에서 자르는 현', '심7', (d) => {
            const k = d.int(5, 14), [be, ga] = d.pick([[64, 52], [70, 50], [58, 66], [76, 48]]), T0 = sssTri(...[Math.sin((180 - be - ga) * RAD), Math.sin(be * RAD), Math.sin(ga * RAD)].map((x) => x * 10));
            const I = inOf(T0.A, T0.B, T0.C), ri = dist(I, foot(I, T0.B, T0.C)), rc = ri * 1.32, h = Math.sqrt(rc * rc - ri * ri);
            const cut = (p, q) => { const f = foot(I, p, q); return [along(f, p, h), along(f, q, h)]; };
            const [Pp, Qq] = cut(T0.A, T0.B), [Ss, Tt] = cut(T0.B, T0.C), [Uu, Vv] = cut(T0.C, T0.A);
            const P = fitPts({ A: T0.A, B: T0.B, C: T0.C, I, P: Pp, Q: Qq, S: Ss, T: Tt, U: Uu, V: Vv }, [210, 165], [[I, rc]]);
            const S = scene(P).ring('I', rc).poly('ABC').dot('I').dot('PQSTUV').names({ I: 20 });   // I 를 점 바로 위에 두면 「!」처럼 보여 오른쪽 위로 비킨다
            return cmQ(`다음 그림에서 점 I는 △ABC의 내심이며 원의 중심이다. 이 원이 세 변 AB, BC, CA와 각각 두 점 P와 Q, S와 T, U와 V에서 만나고 ${is('PQ', k)}일 때, ${jo(sg('UV'), '의/의')} 길이는?`, k, {
              figure: S.svg(`삼각형 ABC와 그 내심 I를 중심으로 하는 원. 원이 변 AB와 두 점 P, Q에서, 변 BC와 두 점 S, T에서, 변 CA와 두 점 U, V에서 만난다`),
              explain: `내심 I에서 세 변까지의 거리는 같다. 세 변 위의 선분 PQ, ST, UV는 원 I의 현이므로, 중심으로부터 같은 거리에 있는 세 현의 길이는 같다. 따라서 ${sg('UV')} = ${sg('PQ')} = ${k} cm이다.`,
              facts: { calc: [[`${k}`, 0]] }
            });
          })
        ]
      }
    ]
  });

  B.kit.m923 = {
    UNIT, STD, T, X, R_, TAGS, sg, cm, deg, eq, is, perp, sq, sup2, gcd, jo, rad, rootOf, cmQ, degQ, cm2Q, xQ, fracQ, piQ, piF, radQ, sumRad, pickOne, sayQ, tagged, fin,
    TRIPLES, triple, isSq, split, foot, mirror, along, turn, midDir, angleAt, inOf, sssTri, fitPts, spin, scene, r1, arcPath, chordPts, twoChordPts, inscribed, CHORD_TRUE
  };
})(typeof window !== 'undefined' ? window : globalThis);
