// 고등학교 기하 Ⅱ-2 공간좌표 — 단원 틀·도구와 앞쪽 묶음(점의 좌표, 두 점 사이의 거리, 선분의 내분).
// 수집해 둔 천재 T셀파 기하(전인태, 2022 개정) 한 종의 교과서·평가 자료에서 뽑은 꼴 목록(기본꼴_1: 39꼴, 기본꼴_2: 25꼴, 심화 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-4-5/싣기_대조표.md 에 있다.
// (구의 방정식과 좌표평면·좌표축과 구, 구와 거리의 묶음은 11-4-5b.js 에, 실력 문항은 11-4-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준: 12기하02-04(좌표공간에서 두 점 사이의 거리와 선분의 내분점의 좌표), 12기하02-05(구를 방정식으로 표현).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(좌표·그림·조건·식), 묻는 것(좌표·길이·넓이·미지수·비·고르기), 이어 하는 일(수선의 발 → 거리,
//    내분점 → 중점, 무게중심 → 내분점, 대칭 → 최솟값)이 다르면 따로 싣는다. 수만 바꾼 유형은 만들지 않는다. 교과서 소단원 차례(두 점 사이의 거리 →
//    선분의 내분 → 구의 방정식)대로 묶음을 나누고, 앞 묶음은 점의 좌표(수선의 발·대칭이동)로 시작한다.
//  - 고1 「도형의 방정식」(10-2-1~3)과 같은 일을 공간에서 하는 꼴은 학년이 달라 그대로 싣는다(①16·①18·①24·①34, ②17 — 조정자 결정).
//    11-4-4 「공간도형」이 넘긴 좌표 판(직선과 좌표평면이 이루는 각 ①20)과 11-4-8 이 넘긴 점과 좌표평면 사이의 거리도 여기 싣는다.
//  - 사용자가 정한 대로 「간단히 다룬다」를 까닭으로 수집본의 꼴을 빼지 않고, 단계가 많거나 함정이 있는 꼴은 실력(11-4-5c.js)에 싣는다.
//  - 답: 좌표는 coordAns 「( [±][ ], [±][ ], [±][ ] )」(정수 — 답이 정수가 되게 수를 골랐다), 길이가 a√b 이면 「[ ]√[ ]」(a ≥ 2) 또는 「√[ ]」(a = 1 —
//    한 유형 안에서는 늘 같은 모양), 문자의 값 여럿은 「a = [±][ ], b = [±][ ], …」, 값 둘은 「a = [±][ ] 또는 a = [±][ ]」. 좌표·미지수처럼 음수일 수 있는
//    칸에는 부호 단추를 달고, 길이·넓이·비에는 달지 않는다. 원문이 따로 구한 값을 더해 묻는 꼴(a + b + c, m + n)은 값을 하나하나 답하게 바꾸었다.
//  - 원문 답이 틀린 곳은 따르지 않고 코드로 셈한다(소1-7: 두 점이 xy평면의 서로 반대쪽이면 최솟값은 AB — dist-reflect 의 둘째 차례).
//  - 참·거짓과 보기는 손으로 적지 않고 코드로 가린다. 답은 모두 코드가 셈하고, 따로 지은 풀이(제 작업 폴더)로 다시 맞춰 보았다.
//  - 검사 근거: 수 칸은 문제에 적힌 좌표로 다시 셈하는 식(facts.calc·value)이다. 근호 밖으로 꺼낸 수처럼 글에 없는 수는 seal 이 facts.unseen 에 밝히고,
//    밝히기로 한 수(derived) 밖의 수가 나오면 오류를 낸다.
//  - 그림: 고2 공용 space(공간 그림)로 그린다. 좌표를 읽는 그림은 축 위의 눈금 수만 적고, 그림 설명에는 꼭짓점의 자리를 말로 적는다(답 좌표를 적지 않는다).
//    두 원기둥을 쌓은 입체(①17)는 평면도·정면도를 공용 Board 로 그린다(dist-real 의 둘째 차례).
//
// 뺀 것과 까닭(11-4-5b.js, 11-4-5c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - ①15(세 점이 이루는 각의 코사인) — 11-4-7 「벡터의 성분과 내적」의 두 벡터가 이루는 각과 같은 일이라 그쪽에 둔다(조정자 결정).
//  - ①35(각의 이등분선이 대변과 만나는 점) — 내각의 이등분선 성질은 2022 중학교 성취기준에 없고, 공간에서는 「두 직선까지 거리가 같다」로 돌려 풀 수도 없다(조정자 결정).
//  - 겹침(같은 일): ①12 대04(한 점의 좌표에 미지수가 있는 AC = BC — 축 위의 점 dist-axis-eq 와 같은 일), ②12 생각 틔우기(원점이 중심인 구와 x축의 교점 —
//    touch-axis-chord 의 앞 단계), ②14 중16 ㄱ(구와 xy평면의 단면 — touch-section 과 hard-plane-claims 의 ㄱ).
//  - 활동에서 온 꼴은 답으로 채점되게 바꾸었다: ①2(좌표공간에 점 찍기 → 꼭짓점 고르기), ①17(109쪽 겨냥도 → 평면도·정면도로 준 입체), ①22(정사영의 비), ②11(105쪽 공학 도구 → 축에 접하는 구의 반지름).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」 문자는 맨 「수 a」로 부르지 않는다: 값을 물으면 「상수 a」, 범위·최댓값·최솟값을 물으면 「실수 a」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, asQ, fl, tx, nb, tail, js, V, sup, nz, pm, poly, rt, grp, sqParts, radText, radAns, SG } = B.kit.mid;
  const { jh, qAns, coordAns, space, trig } = B.kit.hs;
  const { Board, at } = B.kit.mgeo;
  const S4 = '12기하02-04', S5 = '12기하02-05';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(derived)가 아닌 수가 나오면 오류를 낸다(식을 잘못 적은 것).
  function seal(item) {
    const f = item.facts || {}, derived = new Set((f.derived || []).map((v) => Math.abs(Number(v))).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    // 0이 답인 칸의 식이 −0이 되면 검사가 0과 다르게 본다: 끝에 + 0을 붙인다.
    if (f.calc) f.calc = f.calc.map(([t, i]) => [`(${t})+0`, i]);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!derived.has(Number(n)) && !out.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 8000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const sourceOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), Z = V('z'), VA = V('a'), VB = V('b'), VC = V('c'), VK = V('k'), VM = V('m'), VN = V('n'), VR = V('r'), VT = V('t');
  const AX = [X, Y, Z], AXS = ['x', 'y', 'z'];
  const iq = (n) => tx(asQ(n));                                              // 화면에 적는 수(음수는 −)
  const jn = (n) => js(asQ(n));                                              // 검사 식에 적는 수((-3))
  const par = (n) => (fl(asQ(n)) < 0 ? '(' + iq(n) + ')' : iq(n));          // 식 속의 수(음수는 괄호)
  const nj = (n, pair) => iq(n) + tail(Math.abs(n), pair);                  // 수 뒤에 토씨
  const cx = (v) => (typeof v === 'string' ? v : iq(v));
  const raw3 = (p) => `(${cx(p[0])}, ${cx(p[1])}, ${cx(p[2])})`;
  const pt3 = (p) => nb(raw3(p));
  const pt3j = (p, pair) => nb(jh(raw3(p), pair));
  const P3 = (name, p) => nb(name + raw3(p));
  const P3j = (name, p, pair) => nb(jh(name + raw3(p), pair));
  const axisH = (i) => AX[i] + '축';
  // 좌표축 i 에 수직인 좌표평면: 0 → yz평면, 1 → zx평면, 2 → xy평면
  const PL = [[1, 2], [2, 0], [0, 1]];
  const planeH = (i) => AX[PL[i][0]] + AX[PL[i][1]] + '평면';
  const ratio = (m, n) => nb(`${m} : ${n}`);
  const ratioj = (m, n, pair) => nb(`${m} : ${n}${tail(n, pair)}`);
  const sq2 = (v) => `${par(v)}${sup(2)}`;                                   // (−3)² 꼴
  const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
  const lenH = (n2) => { if (isSq(n2)) return String(Math.sqrt(n2)); const [a, b] = sqParts(n2); return radText(a, b); };
  // 길이의 제곱 n2 를 글에 보이는 수로 적은 검사 식(정수면 그 수의 제곱, a√b 면 a·a·b)
  const lenE = (n2) => { if (isSq(n2)) return `${Math.sqrt(n2)}*${Math.sqrt(n2)}`; const [a, b] = sqParts(n2); return `${a}*${a}*${b}`; };

  // ── 점의 셈 ──
  const add3 = (p, q) => p.map((v, i) => v + q[i]), sub3 = (p, q) => p.map((v, i) => v - q[i]), mul3 = (p, k) => p.map((v) => v * k);
  const d2 = (p, q) => p.reduce((s, v, i) => s + (v - q[i]) ** 2, 0);
  const n2of = (p) => p.reduce((s, v) => s + v * v, 0);
  const same3 = (p, q) => p.every((v, i) => v === q[i]);
  const inBox = (pts, k) => pts.every((p) => p.every((v) => Math.abs(v) <= (k || 9)));
  const isInt3 = (p) => p.every((v) => Math.abs(v - Math.round(v)) < 1e-9);
  const round3 = (p) => p.map((v) => Math.round(v));
  // 검사 식: 두 점 사이의 거리의 제곱
  const d2e = (p, q) => p.map((v, i) => `(${jn(q[i])}-${jn(v)})*(${jn(q[i])}-${jn(v)})`).join('+');
  // 풀이 글: √((x₂ − x₁)² + …)
  const d2h = (p, q) => rt(p.map((v, i) => `(${iq(q[i])} ${MINUS} ${par(v)})${sup(2)}`).join(' + '));
  // 대칭이동·수선의 발: { kind: 'axis' | 'plane' | 'origin', i }
  const symOf = (p, t) => p.map((v, k) => (t.kind === 'origin' ? -v : t.kind === 'axis' ? (k === t.i ? v : -v) : (k === t.i ? -v : v)));
  const footOf = (p, t) => p.map((v, k) => (t.kind === 'axis' ? (k === t.i ? v : 0) : (k === t.i ? 0 : v)));
  const tName = (t) => (t.kind === 'origin' ? '원점' : t.kind === 'axis' ? axisH(t.i) : planeH(t.i));
  const ALLT = [0, 1, 2].map((i) => ({ kind: 'axis', i })).concat([0, 1, 2].map((i) => ({ kind: 'plane', i })), [{ kind: 'origin' }]);
  // 대칭이동·수선의 발의 규칙(문장으로 끝낼 때와 「~므로」로 이을 때)
  const symRule = (t) => (t.kind === 'origin' ? '세 좌표의 부호가 모두 바뀐다' : t.kind === 'axis' ? `${AX[t.i]}좌표는 그대로이고 나머지 두 좌표의 부호가 바뀐다` : `${AX[t.i]}좌표의 부호만 바뀐다`);
  const symRuleC = (t) => symRule(t).replace(/바뀐다$/, '바뀌므로');
  const footRule = (t) => (t.kind === 'axis' ? `${AX[t.i]}좌표만 남고 나머지 두 좌표는 0이다` : `${AX[t.i]}좌표만 0이 된다`);
  const footRuleC = (t) => (t.kind === 'axis' ? `${AX[t.i]}좌표만 남고 나머지 두 좌표는 0이므로` : `${AX[t.i]}좌표만 0이 되므로`);
  // 검사 식: 점 p 를 옮긴 점의 k 번째 좌표(부호가 바뀌면 0 − 처음 좌표)
  const signE = (p, q, k) => (q[k] === 0 ? '0' : q[k] === p[k] ? jn(p[k]) : `0-${jn(p[k])}`);

  // ── 답 ──
  // 길이 a√b: 「[ ]√[ ]」(a ≥ 2, b 는 제곱인 수를 인수로 갖지 않는 2 이상의 자연수). 길이라 부호 단추가 없다.
  function radLen(text, a, b, o) {
    if (!(Number.isInteger(a) && a >= 2 && Number.isInteger(b) && b >= 2 && sqParts(b)[0] === 1)) throw new Error('a√b 답: a ≥ 2, b 는 제곱인 수를 인수로 갖지 않는 2 이상의 자연수');
    return inline(text, grp('{0}' + rt('{1}')), [{ answer: a }, { answer: b }], Object.assign({}, o, { shown: radText(a, b) }));
  }
  // 길이의 제곱이 n2 인 길이를 a√b(a ≥ 2) 칸으로 받는다. 검사 식 e 는 n2 를 셈하는 식.
  const lenAns = (text, n2, e, o) => {
    const [a, b] = sqParts(n2), f = (o && o.facts) || {};
    return radLen(text, a, b, Object.assign({}, o, { facts: Object.assign({}, f, { calc: [[`((${e})/${b})**0.5`, 0], [`(${e})/(${a}*${a})`, 1]], derived: [a, b, 0.5].concat(f.derived || []) }) }));
  };
  // 길이의 제곱이 n2(제곱인 수를 인수로 갖지 않는 2 이상의 자연수)인 길이를 「√[ ]」 칸으로 받는다.
  const rootAns = (text, n2, e, o) => radAns(text, 1, n2, Object.assign({}, o, { facts: Object.assign({}, (o && o.facts) || {}, { calc: [[`${e}`, 0]] }) }));
  // 문자의 값 여럿: 「a = [±][ ], b = [±][ ], …」. pairs: [[문자 글, 답, 부호 단추를 다는가(기본 단다)], …]
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer, signed]) => Object.assign({ lead: lead + ' =', answer }, signed === false ? {} : { signed: true })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => nb(`${lead} = ${iq(answer)}`)).join(', ') }));
  // 값 둘: 「a = [±][ ] 또는 a = [±][ ]」(차례는 따지지 않는다). 두 값은 서로 다르고 부호만 다른 짝이 아니다.
  function twoVals(text, nameH, v1, v2, o) {
    if (!Number.isInteger(v1) || !Number.isInteger(v2) || v1 === v2 || v1 === -v2) throw new Error('값 둘 칸: 서로 다르고 부호만 다르지 않은 정수');
    return inline(text, grp(`${nameH} = {0}`) + ' ' + grp('또는') + ' ' + grp(`${nameH} = {1}`), [{ answer: v1, signed: true }, { answer: v2, signed: true }],
      Object.assign({}, o, { unordered: true, shown: `${nb(nameH + ' = ' + iq(v1))} 또는 ${nb(nameH + ' = ' + iq(v2))}` }));
  }
  // 옳은 것 하나와 나머지를 섞는다. 보기는 [글, 옳은가]. 보기가 겹치거나 옳은 보기가 하나가 아니면 null(만들기를 다시 한다).
  function pick(d, text, rows, o) {
    const list = d.shuffle(rows), opt = o || {};
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1]).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: true }, opt.facts || {}) }));
  }
  // 좌표 답(칸 셋)과 그 검사 식
  const coordOf = (text, p, es, o) => coordAns(text, p, Object.assign({}, o, { facts: Object.assign({}, (o && o.facts) || {}, { calc: es.map((e, i) => [e, i]) }) }));

  // ── 수 고르기 ──
  const RATIOS = [[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [4, 1], [3, 4], [4, 3], [2, 5], [5, 2]];
  const rnd3 = (d, lo, hi) => [d.int(lo, hi), d.int(lo, hi), d.int(lo, hi)];
  const nz3 = (d, lo, hi) => [nz(d, lo, hi), nz(d, lo, hi), nz(d, lo, hi)];
  // 길이의 제곱이 n2 인 정수 벡터(성분 −r~r)
  const VCACHE = {};
  const vecs = (n2, r) => { const key = n2 + ':' + (r || 4); if (VCACHE[key]) return VCACHE[key]; const R = r || 4, out = []; for (let x = -R; x <= R; x += 1) for (let y = -R; y <= R; y += 1) for (let z = -R; z <= R; z += 1) if (x * x + y * y + z * z === n2) out.push([x, y, z]); VCACHE[key] = out; return out; };
  const NORMS = [9, 11, 12, 14, 17, 18, 19, 21, 22, 24, 26, 27];
  // 길이가 같은 서로 다른 벡터 k 개
  function sameLen(d, k) { const list = vecs(d.pick(NORMS)); if (list.length < k) return null; return d.shuffle(list).slice(0, k); }
  // 네 수 [a, b, c, d](a² + b² + c² = d²)
  const QUAD = [[1, 2, 2, 3], [2, 1, 2, 3], [2, 2, 1, 3], [2, 3, 6, 7], [3, 6, 2, 7], [6, 2, 3, 7], [1, 4, 8, 9], [4, 4, 7, 9], [4, 8, 1, 9], [7, 4, 4, 9], [2, 6, 9, 11], [6, 6, 7, 11], [9, 2, 6, 11], [3, 4, 12, 13], [4, 12, 3, 13], [2, 10, 11, 15], [5, 10, 10, 15], [10, 2, 11, 15]];
  const PYTH = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [9, 12, 15], [12, 9, 15]];

  // ── 그림 ──
  // 좌표축 위에 세 모서리를 놓은 직육면체(neg 이면 y축의 음의 쪽에 놓는다). names 는 box 의 이름 차례(아래 넷 → 위 넷). 축 위에 눈금 수를 적는다.
  //  꼭짓점 v[i]: 양의 쪽 [0,0,0] [a,0,0] [a,b,0] [0,b,0] [0,0,c] [a,0,c] [a,b,c] [0,b,c] / 음의 쪽 [0,−b,0] [a,−b,0] [a,0,0] [0,0,0] [0,−b,c] [a,−b,c] [a,0,c] [0,0,c]
  const boxVerts = (a, b, c, neg) => (neg ? [[0, -b, 0], [a, -b, 0], [a, 0, 0], [0, 0, 0], [0, -b, c], [a, -b, c], [a, 0, c], [0, 0, c]] : [[0, 0, 0], [a, 0, 0], [a, b, 0], [0, b, 0], [0, 0, c], [a, 0, c], [a, b, c], [0, b, c]]);
  // ang: 축 위 눈금 수를 적을 쪽(도). marks: 이름을 손으로 놓을 꼭짓점 [[꼭짓점 차례, 이름, 각], …](box 의 자동 이름 대신)
  function axisBox(a, b, c, neg, names, say, ang, marks) {
    const S = space({ u: 24 }), A0 = Object.assign(neg ? { x: 315, y: 285, z: 20 } : { x: 170, y: 300, z: 150 }, ang || {});
    if (neg) {
      // y축의 음의 쪽: 직육면체 앞면 뒤에 숨는 부분(화면에서 앞면 안쪽)은 점선, 그 밖은 실선
      const hid = -b - 0.39 * a - 0.05;
      S.axes({ x: a + 1.7, y: 1.9, z: c + 1.4 }, { y: 0.001 }); S.seg([0, -b, 0], [0, hid, 0], 'dash'); S.seg([0, hid, 0], [0, hid - 1.1, 0], 'thin');
    } else S.axes({ x: a + 1.7, y: b + 1.5, z: c + 1.4 }, null, { x: a, y: b, z: c });
    const vs = boxVerts(a, b, c, neg);
    S.box(neg ? [0, -b, 0] : [0, 0, 0], neg ? [a, 0, c] : [a, b, c], marks ? null : names);
    if (marks) for (const [i, nm, an, gap] of marks) S.name(vs[i], nm, an, gap);
    S.name([a, 0, 0], String(a), A0.x);
    S.name([0, neg ? -b : b, 0], neg ? MINUS + b : String(b), A0.y);
    S.name([0, 0, c], String(c), A0.z);
    return S.svg(say);
  }
  // 직육면체 ABCD-EFGH(윗면 ABCD, A 아래 E …)의 꼭짓점 이름을 모서리를 피해 놓는다. 화면 방향: 뒤(−x) 45°, 앞 225°, 오른쪽 0°, 위 90°.
  const CUBE_ANG = { H: 135, E: 225, F: 300, G: 320, D: 120, A: 135, B: 340, C: 45 };
  const cubeNames = (S, V, ang) => { for (const [nm, p] of Object.entries(V)) S.name(p, nm, Object.assign({}, CUBE_ANG, ang || {})[nm]); return S; };
  // 그림 설명에 적는 꼭짓점의 자리(답 좌표를 적지 않고 말로)
  const SPOT = ['원점', 'x축 위의 꼭짓점', '아랫면에서 원점과 마주 보는 꼭짓점', 'y축 위의 꼭짓점', 'z축 위의 꼭짓점', 'x축 위의 꼭짓점 바로 위의 꼭짓점', '원점과 대각선으로 마주 보는 꼭짓점', 'y축 위의 꼭짓점 바로 위의 꼭짓점'];
  const SPOTN = ['y축의 음의 쪽 끝 꼭짓점', '아랫면에서 원점과 마주 보는 꼭짓점', 'x축 위의 꼭짓점', '원점', 'y축의 음의 쪽 끝 꼭짓점 바로 위의 꼭짓점', '원점과 대각선으로 마주 보는 꼭짓점', 'x축 위의 꼭짓점 바로 위의 꼭짓점', 'z축 위의 꼭짓점'];

  B.kit.u45x = {
    S4, S5, T, H, seal, retry, stripH, X, Y, Z, VA, VB, VC, VK, VM, VN, VR, VT, AX, AXS, iq, jn, par, nj, cx, raw3, pt3, pt3j, P3, P3j, axisH, PL, planeH, ratio, ratioj, sq2, isSq, lenH, lenE,
    add3, sub3, mul3, d2, n2of, same3, inBox, isInt3, round3, d2e, d2h, symOf, footOf, tName, ALLT, symRule, symRuleC, footRule, footRuleC, signE,
    radLen, lenAns, rootAns, vals, twoVals, pick, coordOf, RATIOS, rnd3, nz3, vecs, NORMS, sameLen, QUAD, PYTH
  };

  // ═══ 가. 점의 좌표 — 수선의 발과 대칭이동 ═══
  const point = [
    T('pt-read', '그림에서 직육면체의 꼭짓점의 좌표 읽기', '①1', (d, n) => {
      const neg = n === 1, a = d.int(2, 5), b = d.int(neg ? 2 : 1, 4), c = d.int(1, 4);
      const at1 = neg ? d.pick([1, 4, 5, 6]) : d.pick([2, 5, 6, 7]), v = boxVerts(a, b, c, neg)[at1];
      const names = ['', '', '', '', '', '', '', '']; names[at1] = 'P';
      const say = `공간 그림: 세 모서리가 좌표축 위에 놓인 직육면체. ${neg ? '직육면체는 y축의 음의 쪽에 놓였다. ' : ''}축 위의 눈금은 x축 ${a}, y축 ${neg ? '−' + b : b}, z축 ${c}이다. 꼭짓점 P는 ${(neg ? SPOTN : SPOT)[at1]}이다.`;
      return coordOf(`그림과 같이 세 모서리가 좌표축 위에 놓인 직육면체가 ${neg ? `${Y}축의 음의 쪽에 ` : ''}있다. 꼭짓점 P의 좌표는?`, v, v.map((x) => (x < 0 ? `0-${-x}` : String(x))), {
        figure: axisBox(a, b, c, neg, names, say, null, [[at1, 'P', (neg ? { 1: 225, 4: 120, 5: 135, 6: 340 } : { 2: 300, 5: 135, 6: 340, 7: 45 })[at1]]]),
        explain: `점 P에서 ${X}축, ${Y}축, ${Z}축에 내린 수선의 발의 좌표를 차례로 읽으면 ${v.map(iq).join(', ')}이므로 P${pt3(v)}이다.`
      });
    }, { count: 2 }),
    T('pt-vertex', '좌표가 주어진 점을 나타내는 꼭짓점 고르기', '①2', (d) => {
      const a = d.int(2, 5), b = d.int(2, 4), c = d.int(1, 4), vs = boxVerts(a, b, c, false), names = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G'];
      if (a === b || b === c || a === c) return null;
      const want = d.int(1, 7), others = d.shuffle([1, 2, 3, 4, 5, 6, 7].filter((i) => i !== want)).slice(0, 4);
      const say = `공간 그림: 원점 O에 한 꼭짓점이 있고 세 모서리가 좌표축 위에 놓인 직육면체 OABC-DEFG. 아랫면 OABC는 xy평면 위에 있고 A는 x축 위, C는 y축 위, D는 z축 위에 있다. 축 위의 눈금은 x축 ${a}, y축 ${b}, z축 ${c}이다.`;
      const w = vs[want];
      return pick(d, `그림과 같이 원점 O에 한 꼭짓점이 있는 직육면체 OABC−DEFG가 있다. 점 ${pt3j(w, '을/를')} 나타내는 꼭짓점은?`, [want].concat(others).map((i) => [names[i], i === want]), {
        figure: axisBox(a, b, c, false, null, say, { x: 150, y: 45, z: 190 }, [[1, 'A', 270], [2, 'B', 300], [3, 'C', 315], [4, 'D', 45, 13], [5, 'E', 135], [6, 'F', 340], [7, 'G', 45]]),
        explain: `${X}좌표가 ${w[0]}, ${Y}좌표가 ${w[1]}, ${Z}좌표가 ${w[2]}인 꼭짓점을 찾으면 ${names[want]}이다. (좌표가 0이면 그 축 쪽으로는 움직이지 않은 점이다.)`
      });
    }),
    T('pt-foot', '좌표축·좌표평면에 내린 수선의 발', '①3', (d, n) => {
      const p = nz3(d, -6, 6), t = { kind: n === 0 ? 'axis' : 'plane', i: d.int(0, 2) }, f = footOf(p, t);
      return coordOf(`점 ${P3('P', p)}에서 ${tName(t)}에 내린 수선의 발의 좌표는?`, f, [0, 1, 2].map((k) => signE(p, f, k)), {
        explain: `${tName(t)}에 내린 수선의 발은 ${footRule(t)}. 따라서 수선의 발의 좌표는 ${pt3(f)}이다.`
      });
    }, { count: 2 }),
    T('pt-plane-dist', '점과 좌표평면 사이의 거리', '①3 · 11-4-8 넘김', (d) => {
      const p = nz3(d, -7, 7), i = d.int(0, 2), v = Math.abs(p[i]);
      return N(`점 ${P3j('P', p, '과/와')} ${planeH(i)} 사이의 거리는?`, v, {
        explain: `점 P에서 ${planeH(i)}에 내린 수선의 발은 ${pt3(footOf(p, { kind: 'plane', i }))}이므로, 거리는 점 P의 ${AX[i]}좌표의 절댓값인 ${v}이다.`,
        facts: { calc: [[p[i] < 0 ? `0-${jn(p[i])}` : jn(p[i]), 0]] }
      });
    }),
    T('pt-sym', '좌표축·좌표평면·원점에 대한 대칭이동', '①4', (d, n) => {
      const p = nz3(d, -6, 6);
      if (n === 0) {
        const t = d.pick(ALLT), q = symOf(p, t);
        return coordOf(`점 ${P3j('P', p, '을/를')} ${tName(t)}에 대하여 대칭이동한 점의 좌표는?`, q, [0, 1, 2].map((k) => signE(p, q, k)), {
          explain: `${tName(t)}에 대하여 대칭이동하면 ${symRule(t)}. 따라서 ${pt3(q)}이다.`
        });
      }
      const [t1, t2] = d.shuffle(ALLT).slice(0, 2), q1 = symOf(p, t1), q2 = symOf(q1, t2);
      return coordOf(`점 ${P3j('P', p, '을/를')} ${tName(t1)}에 대하여 대칭이동한 점을 Q, 점 Q를 ${tName(t2)}에 대하여 대칭이동한 점을 R라 할 때, 점 R의 좌표는?`, q2, [0, 1, 2].map((k) => signE(p, q2, k)), {
        explain: `${tName(t1)}에 대하여 대칭이동하면 ${symRuleC(t1)} Q${pt3(q1)}이다. 다시 ${tName(t2)}에 대하여 대칭이동하면 ${symRuleC(t2)} R${pt3(q2)}이다.`
      });
    }, { count: 2 }),
    T('pt-back', '수선의 발·대칭이동한 점에서 처음 점의 좌표', '①5', (d, n) => {
      const p = nz3(d, -6, 6);
      if (n === 0) {
        const i = d.int(0, 2), fa = footOf(p, { kind: 'axis', i }), fp = footOf(p, { kind: 'plane', i });
        return coordOf(`점 P에서 ${axisH(i)}에 내린 수선의 발의 좌표가 ${pt3(fa)}이고, ${planeH(i)}에 내린 수선의 발의 좌표가 ${pt3(fp)}일 때, 점 P의 좌표는?`, p, [0, 1, 2].map((k) => jn(p[k])), {
          explain: `${axisH(i)}에 내린 수선의 발에서 점 P의 ${AX[i]}좌표는 ${iq(p[i])}이고, ${planeH(i)}에 내린 수선의 발에서 나머지 두 좌표를 읽으면 P${pt3(p)}이다.`
        });
      }
      const t = d.pick(ALLT), q = symOf(p, t);
      return coordOf(`점 P를 ${tName(t)}에 대하여 대칭이동한 점의 좌표가 ${pt3(q)}일 때, 점 P의 좌표는?`, p, [0, 1, 2].map((k) => signE(q, p, k)), {
        explain: `${tName(t)}에 대하여 대칭이동하면 ${symRule(t)}. 거꾸로 옮기면 P${pt3(p)}이다.`
      });
    }, { count: 2 }),
    T('pt-sym-match', '대칭이동한 두 점이 일치할 때 미지수', '①6', (d) => {
      const [t1, t2] = d.shuffle(ALLT).slice(0, 2), s1 = symOf([1, 1, 1], t1), s2 = symOf([1, 1, 1], t2), tau = s1.map((v, k) => v * s2[k]);
      const negs = [0, 1, 2].filter((k) => tau[k] === -1);
      if (negs.length < 2) return null;
      const v = nz3(d, -4, 4), names = [VA, VB, VC], i0 = negs.length === 2 ? [0, 1, 2].find((k) => tau[k] === 1) : d.int(0, 2), [j, k2] = [0, 1, 2].filter((k) => k !== i0);
      // 좌표 j, k2: (문자) + 상수 — 대칭점의 같은 좌표끼리 놓은 식에서 그 문자만 남는다. 좌표 i0: 다른 두 문자의 차 + 상수
      const kj = -2 * v[j], kk = -2 * v[k2], k0 = tau[i0] * v[i0] - (v[j] - v[k2]);
      const q = [];
      q[j] = poly([[1, names[j]], [kj, '']]); q[k2] = poly([[1, names[k2]], [kk, '']]); q[i0] = poly([[1, names[j]], [-1, names[k2]], [k0, '']]);
      const neg = (h) => MINUS + (/[+−]/.test(stripH(h)) ? '(' + h + ')' : h);
      const showSym = (vec, s) => pt3(vec.map((h, k) => (s[k] === 1 ? h : neg(h))));
      return vals(`점 ${P3j('P', names, '을/를')} ${tName(t1)}에 대하여 대칭이동한 점과 점 ${P3j('Q', q, '을/를')} ${tName(t2)}에 대하여 대칭이동한 점이 일치할 때, 상수 ${VA}, ${VB}, ${VC}의 값은?`,
        [[VA, v[0]], [VB, v[1]], [VC, v[2]]], {
          explain: `점 P를 ${tName(t1)}에 대하여 대칭이동한 점은 ${showSym(names, s1)}, 점 Q를 ${tName(t2)}에 대하여 대칭이동한 점은 ${showSym(q, s2)}이다. 좌표끼리 같다고 놓으면 ${names[j]} = ${iq(v[j])}, ${names[k2]} = ${iq(v[k2])}이고, 이를 대입하면 ${names[i0]} = ${iq(v[i0])}이다.`,
          facts: { calc: [[`(0-${jn(kj)})/2`, j], [`(0-${jn(kk)})/2`, k2], [`((0-${jn(kj)})/2-(0-${jn(kk)})/2+${jn(k0)})*${tau[i0] === 1 ? '1' : '(0-1)'}`, i0]], derived: [2] }
        });
    }),
    T('pt-cube', '원점에 대칭인 두 꼭짓점이 있는 정육면체의 꼭짓점', '①7', (d) => {
      const s = d.int(1, 5);
      const V8 = { H: [-s, -s, -s], E: [s, -s, -s], F: [s, s, -s], G: [-s, s, -s], D: [-s, -s, s], A: [s, -s, s], B: [s, s, s], C: [-s, s, s] };
      const given = d.pick(['B', 'C', 'D', 'E', 'F', 'H']), target = d.pick(['B', 'C', 'D', 'E', 'F', 'H'].filter((k) => k !== given));
      const t = { kind: d.pick(['axis', 'plane']), i: d.int(0, 2) }, ans = footOf(V8[target], t);
      // x축이 앞면의 대각선(꼭짓점 E 쪽)과 겹치지 않게 x축을 가파르게(240°) 그려 앞면의 아래 변 가운데쯤으로 빠지게 한다.
      const k = 1.5, S = space({ u: 26, ang: 240 });
      S.axes({ x: k + 4.4, y: k + 2.3, z: k + 1.9 }, null, { x: k, y: k, z: k });
      S.box([-k, -k, -k], [k, k, k], null);
      cubeNames(S, { H: [-k, -k, -k], E: [k, -k, -k], F: [k, k, -k], G: [-k, k, -k], D: [-k, -k, k], A: [k, -k, k], B: [k, k, k], C: [-k, k, k] });
      const figure = S.svg('공간 그림: 정육면체 ABCD-EFGH. 윗면이 ABCD, 아랫면이 EFGH이고 A 아래에 E, B 아래에 F, C 아래에 G, D 아래에 H가 있다. 꼭짓점 A에서 D로 가는 쪽은 x축의 음의 방향, B로 가는 쪽은 y축의 양의 방향, E로 가는 쪽은 z축의 음의 방향이다. 세 좌표축은 정육면체의 가운데에서 만난다.');
      const g = V8[given];
      return coordOf(`그림과 같이 좌표공간에 세 모서리 AD, AB, AE가 각각 ${X}축, ${Y}축, ${Z}축에 평행한 정육면체 ABCD−EFGH가 있다. 두 꼭짓점 A와 G가 원점에 대하여 대칭이고 꼭짓점 ${given}의 좌표가 ${pt3(g)}일 때, 꼭짓점 ${target}에서 ${tName(t)}에 내린 수선의 발의 좌표는?`,
        ans, ans.map((v) => (v === 0 ? '0' : v > 0 ? String(s) : `0-${s}`)), {
          figure,
          explain: `두 꼭짓점 A, G가 원점에 대하여 대칭이므로 정육면체의 가운데가 원점이다. 꼭짓점 ${given}${pt3(g)}에서 한 모서리의 길이는 ${2 * s}이고, 그림의 방향을 따라 꼭짓점 ${target}의 좌표는 ${pt3(V8[target])}이다. ${tName(t)}에 내린 수선의 발은 ${footRuleC(t)} ${pt3(ans)}이다.`
        });
    })
  ];

  // ═══ 나. 두 점 사이의 거리 ═══
  // 두 건물 그림: 건물 1(가로 w1, 높이 h1, 세로 d1), 길 폭 g, 건물 2(가로 w2, 높이 h2, 세로 d2). 앞면이 한 평면 위에 있다.
  function buildings(w1, d1, h1, g, w2, d2_, h2) {
    const u = Math.min(6.4, 236 / (w1 + g + w2 + Math.max(d1, d2_) * 0.4 + 6)), S = space({ u });
    S.box([-d1, 0, 0], [0, w1, h1], null);
    S.box([-d2_, w1 + g, 0], [0, w1 + g + w2, h2], null);
    S.dot([0, 0, h1], 'P', 150).dot([-d2_, w1 + g + w2, h2], 'Q', 40);
    S.text([0.5, w1 / 2, -1.9], `${w1} m`).text([0.5, w1 + g / 2, -1.9], `${g} m`).text([0.5, w1 + g + w2 / 2, -1.9], `${w2} m`);
    S.text([-d2_ / 2, w1 + g + w2 + 1.6, -0.9], `${d2_} m`);
    S.text([0.2, -2.8, h1 / 2], `${h1} m`).text([-d2_, w1 + g + w2 + 3.0, h2 / 2], `${h2} m`);
    return S.svg(`공간 그림: 길을 사이에 두고 앞면이 한 평면 위에 나란히 선 직육면체 모양의 두 건물. 왼쪽 건물은 가로 ${w1} m, 높이 ${h1} m, 오른쪽 건물은 가로 ${w2} m, 세로 ${d2_} m, 높이 ${h2} m이고 길의 폭은 ${g} m이다. 점 P는 왼쪽 건물 앞면의 왼쪽 위 꼭짓점, 점 Q는 오른쪽 건물 뒷면의 오른쪽 위 꼭짓점이다.`);
  }
  // 두 원기둥을 쌓은 입체의 평면도와 정면도
  function stacked(R1, H1, R2, H2) {
    const b = Board(), k = Math.min(6, 100 / (2 * R1), 110 / (H1 + H2)), kp = Math.min(8, 58 / R1), c0 = [R1 * kp, -(H1 + H2) * k / 2];
    b.disk(c0, R1 * kp).disk(c0, R2 * kp).seg([c0[0] - R1 * kp - 6, c0[1]], [c0[0] + R1 * kp + 6, c0[1]], 'cut');
    const pP = [c0[0] - R2 * kp, c0[1]], pQ = [c0[0] + R1 * kp, c0[1]];
    b.dot(pP).dot(pQ).text(at(pP, 12, 135), 'P').text(at(pQ, 10, 45), 'Q').text([c0[0], Math.max(c0[1] + R1 * kp + 16, 46)], '평면도', { plain: true });
    const x0 = 2 * R1 * kp + 36, base = 0, L = [x0, base], Rr = [x0 + 2 * R1 * k, base];
    const t0 = [x0 + (R1 - R2) * k, base - H1 * k], t1 = [x0 + (R1 + R2) * k, base - H1 * k];
    b.poly([L, Rr, [Rr[0], base - H1 * k], [L[0], base - H1 * k]]).poly([t0, t1, [t1[0], t1[1] - H2 * k], [t0[0], t0[1] - H2 * k]]);
    const fP = [t0[0], t0[1] - H2 * k], fQ = Rr;
    b.dot(fP).dot(fQ).text(at(fP, 10, 180), 'P').text(at(fQ, 10, 0), 'Q');
    b.dim(L, Rr, String(2 * R1), [x0 + R1 * k, base - 20], 10);
    b.dim([t0[0], t0[1] - H2 * k], [t1[0], t1[1] - H2 * k], String(2 * R2), [x0 + R1 * k, base], 9);
    b.dim([L[0], base], [L[0], base - H1 * k], String(H1), [x0 + 2 * R1 * k, base], 9);
    b.dim([t1[0], t1[1]], [t1[0], t1[1] - H2 * k], String(H2), [x0, base], 9);
    b.text([x0 + R1 * k, Math.max(c0[1] + R1 * kp + 16, 46)], '정면도', { plain: true });
    return b.svg(`평면도와 정면도: 평면도는 중심이 같은 두 원(지름 ${2 * R1}, ${2 * R2})이고 점 P는 작은 원, 점 Q는 큰 원 위에서 중심을 지나는 한 직선 위의 서로 반대쪽에 있다. 정면도는 가로 ${2 * R1}, 높이 ${H1}인 직사각형 위에 가로 ${2 * R2}, 높이 ${H2}인 직사각형이 가운데를 맞추어 놓인 모양이고, 점 P는 위 직사각형의 왼쪽 위 꼭짓점, 점 Q는 아래 직사각형의 오른쪽 아래 꼭짓점이다.`);
  }

  const dist = [
    T('dist-two', '좌표공간의 두 점 사이의 거리', '①8', (d) => {
      const p = rnd3(d, -5, 5), w = rnd3(d, -6, 6), q = add3(p, w), n2 = n2of(w), [a, b] = sqParts(n2);
      if (a < 2 || b < 2 || !inBox([q]) || w.filter((v) => v === 0).length > 1) return null;
      return lenAns(`두 점 ${P3('A', p)}, ${P3('B', q)} 사이의 거리는?`, n2, d2e(p, q), {
        explain: `${SG('AB')} = ${d2h(p, q)} = ${rt(n2)} = ${radText(a, b)}이다.`
      });
    }),
    T('dist-foot-sym', '수선의 발·대칭이동한 점 사이의 거리', '①9', (d) => {
      const p = nz3(d, -5, 5), list = ALLT.map((t) => ({ t, f: 'sym' })).concat(ALLT.filter((t) => t.kind !== 'origin').map((t) => ({ t, f: 'foot' })));
      const [u, w] = d.shuffle(list).slice(0, 2), mv = (o) => (o.f === 'sym' ? symOf(p, o.t) : footOf(p, o.t));
      const q = mv(u), r = mv(w), n2 = d2(q, r), [a, b] = sqParts(n2);
      if (a < 2 || b < 2) return null;
      const say = (o, nm) => (o.f === 'sym' ? `점 P를 ${tName(o.t)}에 대하여 대칭이동한 점을 ${nm}` : `점 P에서 ${tName(o.t)}에 내린 수선의 발을 ${nm}`);
      const e = [0, 1, 2].map((k) => `(${signE(p, r, k)}-(${signE(p, q, k)}))*(${signE(p, r, k)}-(${signE(p, q, k)}))`).join('+');
      return lenAns(`점 ${P3('P', p)}에 대하여 ${say(u, 'Q')}, ${say(w, 'R')}라 할 때, 선분 QR의 길이는?`, n2, e, {
        explain: `Q${pt3(q)}, R${pt3(r)}이므로 ${SG('QR')} = ${d2h(q, r)} = ${rt(n2)} = ${radText(a, b)}이다.`
      });
    }),
    T('dist-feet-tri', '세 좌표평면에 내린 수선의 발이 이루는 삼각형의 넓이', '①10', (d) => {
      const p = nz3(d, -6, 6), [i, j] = d.shuffle([0, 1, 2]).slice(0, 2);
      p[j] = p[i] * pm(d);
      const A = footOf(p, { kind: 'plane', i: 2 }), Bp = footOf(p, { kind: 'plane', i: 0 }), Cp = footOf(p, { kind: 'plane', i: 1 });
      const sides = [[SG('AB'), d2(A, Bp)], [SG('BC'), d2(Bp, Cp)], [SG('CA'), d2(Cp, A)]];
      const nArea = p[0] * p[0] * p[1] * p[1] + p[1] * p[1] * p[2] * p[2] + p[2] * p[2] * p[0] * p[0];       // (넓이)² × 4
      if (nArea % 4 !== 0) return null;
      const n2 = nArea / 4, [a, b] = sqParts(n2);
      if (a < 2 || b < 2) return null;
      const eq = sides.filter((s, k) => sides.some((t, l) => l !== k && t[1] === s[1])), base = sides.find((s) => !eq.includes(s));
      if (eq.length !== 2 || !base) return null;
      const h2 = Q(4 * eq[0][1] - base[1], 4);                                    // 높이의 제곱
      const e = `(${jn(p[0])}*${jn(p[0])}*${jn(p[1])}*${jn(p[1])}+${jn(p[1])}*${jn(p[1])}*${jn(p[2])}*${jn(p[2])}+${jn(p[2])}*${jn(p[2])}*${jn(p[0])}*${jn(p[0])})/4`;
      return lenAns(`점 ${P3('P', p)}에서 ${planeH(2)}, ${planeH(0)}, ${planeH(1)}에 내린 수선의 발을 각각 A, B, C라 할 때, 삼각형 ABC의 넓이는?`, n2, e, {
        explain: `A${pt3(A)}, B${pt3(Bp)}, C${pt3(Cp)}이므로 ${sides.map(([nm, v]) => `${nm} = ${lenH(v)}`).join(', ')}이다. 삼각형 ABC는 ${eq[0][0]} = ${eq[1][0]}인 이등변삼각형이고, 밑변 ${base[0]}에 대한 높이는 ${rt(tx(h2))}이다. 넓이는 ${frac(1, 2)} × ${lenH(base[1])} × ${rt(tx(h2))} = ${radText(a, b)}이다.`,
        facts: { derived: [4] }
      });
    }),
    T('dist-unknown', '두 점 사이의 거리가 주어질 때 미지수', '①11', (d, n) => {
      if (n === 0) {
        const p = rnd3(d, -5, 5), k = d.int(0, 2), others = [0, 1, 2].filter((x) => x !== k), w = [0, 0, 0];
        for (const o of others) w[o] = d.int(-4, 4);
        const s = d.int(1, 5), base = p[k], n2 = s * s + w[others[0]] ** 2 + w[others[1]] ** 2, q = add3(p, w), qh = q.map((v, x) => (x === k ? VA : v));
        if (base - s === -(base + s) || n2 === s * s) return null;
        const known = [0, 1, 2].filter((x) => x === k || w[x] !== 0).map((x) => (x === k ? `(${VA} ${MINUS} ${par(base)})${sup(2)}` : sq2(w[x]))).join(' + ');
        const rest = others.map((o) => `(${jn(q[o])}-${jn(p[o])})*(${jn(q[o])}-${jn(p[o])})`).join('+');
        return twoVals(`두 점 ${P3('A', p)}, ${P3('B', qh)} 사이의 거리가 ${lenH(n2)}일 때, 상수 ${VA}의 값은?`, VA, base - s, base + s, {
          explain: `${nb(`${known} = ${n2}`)}에서 ${nb(`(${VA} ${MINUS} ${par(base)})${sup(2)} = ${s * s}`)}이므로 ${VA} = ${iq(base - s)} 또는 ${VA} = ${iq(base + s)}이다.`,
          facts: { calc: [[`${jn(base)}-(${lenE(n2)}-(${rest}))**0.5`, 0], [`${jn(base)}+(${lenE(n2)}-(${rest}))**0.5`, 1]], derived: [0.5] }
        });
      }
      // A(x₁, a, z₁), B(x₂, y₂, a + k): 거리의 제곱이 a 에 대한 이차식 → 두 근
      const x1 = d.int(-4, 4), dx = nz(d, -4, 4), y2 = d.int(-4, 4), z1 = d.int(-4, 4), kk = nz(d, -5, 5), r1 = d.int(-4, 4), r2 = y2 + z1 - kk - r1;
      if (r1 >= r2 || r1 === -r2 || Math.abs(r2) > 6) return null;
      const n2 = dx * dx + (y2 - r1) ** 2 + (r1 + kk - z1) ** 2;
      const A = [x1, VA, z1], Bq = [x1 + dx, y2, poly([[1, VA], [kk, '']])];
      const c1 = 2 * (kk - z1 - y2), c0 = dx * dx + y2 * y2 + (kk - z1) ** 2 - n2;
      if (c0 % 2 !== 0) return null;
      const Se = `(${jn(y2)}+${jn(z1)}-${jn(kk)})`, Pe = `((${jn(x1 + dx)}-${jn(x1)})*(${jn(x1 + dx)}-${jn(x1)})+${jn(y2)}*${jn(y2)}+(${jn(kk)}-${jn(z1)})*(${jn(kk)}-${jn(z1)})-${lenE(n2)})/2`;
      return twoVals(`두 점 ${P3('A', A)}, ${P3('B', Bq)} 사이의 거리가 ${lenH(n2)}일 때, 상수 ${VA}의 값은?`, VA, r1, r2, {
        explain: `${nb(`${sq2(dx)} + (${iq(y2)} ${MINUS} ${VA})${sup(2)} + (${poly([[1, VA], [kk - z1, '']])})${sup(2)} = ${n2}`)}${tail(n2, '을/를')} 정리하면 ${nb(`${poly([[2, VA + sup(2)], [c1, VA], [c0, '']])} = 0`)}, 곧 ${nb(`${poly([[1, VA + sup(2)], [c1 / 2, VA], [c0 / 2, '']])} = 0`)}이므로 ${VA} = ${iq(r1)} 또는 ${VA} = ${iq(r2)}이다.`,
        facts: { calc: [[`(${Se}-(${Se}*${Se}-4*${Pe})**0.5)/2`, 0], [`(${Se}+(${Se}*${Se}-4*${Pe})**0.5)/2`, 1]], derived: [2, 4, 0.5] }
      });
    }, { count: 2 }),
    T('dist-axis-eq', '두 점에서 같은 거리에 있는 좌표축 위의 점', '①12', (d, n) => {
      const i = n, pr = sameLen(d, 2);
      if (!pr) return null;
      const [u, w] = pr, t = nz(d, -5, 5), P0 = [0, 0, 0]; P0[i] = t;
      const A = add3(P0, u), Bq = add3(P0, w);
      if (!inBox([A, Bq], 8) || u[i] === w[i]) return null;
      const sqs = (p) => p.map((v) => `${jn(v)}*${jn(v)}`).join('+');
      const e = `(${sqs(Bq)}-(${sqs(A)}))/(2*(${jn(Bq[i])}-${jn(A[i])}))`;
      const Pv = [0, 0, 0].map((_, k) => (k === i ? VA : 0));
      return coordOf(`두 점 ${P3('A', A)}, ${P3('B', Bq)}에서 같은 거리에 있는 ${axisH(i)} 위의 점 P의 좌표는?`, P0, [0, 1, 2].map((k) => (k === i ? e : '0')), {
        explain: `점 P의 좌표를 ${pt3j(Pv, '이라/라')} 하면 ${nb(`${SG('AP')}${sup(2)} = ${SG('BP')}${sup(2)}`)}에서 ${VA}${sup(2)}이 지워져 ${VA}에 대한 일차방정식이 되고, 풀면 ${VA} = ${iq(t)}이다. 따라서 P${pt3(P0)}이다.`,
        facts: { derived: [2] }
      });
    }, { count: 3 }),
    T('dist-plane-eq', '세 점에서 같은 거리에 있는 좌표평면 위의 점', '①13', (d) => {
      const i = d.int(0, 2), tri = sameLen(d, 3);
      if (!tri) return null;
      const P0 = rnd3(d, -4, 4); P0[i] = 0;
      const [A, Bq, Cq] = tri.map((u) => add3(P0, u)), [j, k] = PL[i];
      const a1 = Bq[j] - A[j], b1 = Bq[k] - A[k], a2 = Cq[j] - A[j], b2 = Cq[k] - A[k];
      if (a1 * b2 - a2 * b1 === 0 || !inBox([A, Bq, Cq], 8)) return null;
      // 2(B − A)·P = |B|² − |A|² (평면 위에서 P 의 i 좌표는 0)
      const sqs = (p) => p.map((v) => `${jn(v)}*${jn(v)}`).join('+');
      const c1 = `(${sqs(Bq)}-(${sqs(A)}))`, c2 = `(${sqs(Cq)}-(${sqs(A)}))`;
      const ja1 = `(${jn(Bq[j])}-${jn(A[j])})`, jb1 = `(${jn(Bq[k])}-${jn(A[k])})`, ja2 = `(${jn(Cq[j])}-${jn(A[j])})`, jb2 = `(${jn(Cq[k])}-${jn(A[k])})`;
      const den = `(2*(${ja1}*${jb2}-${ja2}*${jb1}))`;
      const es = ['0', '0', '0'];
      es[j] = `(${c1}*${jb2}-${c2}*${jb1})/${den}`; es[k] = `(${ja1}*${c2}-${ja2}*${c1})/${den}`;
      const Pv = [0, 0, 0]; Pv[j] = VA; Pv[k] = VB;
      return coordOf(`세 점 ${P3('A', A)}, ${P3('B', Bq)}, ${P3('C', Cq)}에서 같은 거리에 있는 ${planeH(i)} 위의 점 P의 좌표는?`, P0, es, {
        explain: `점 P의 좌표를 ${pt3j(Pv, '이라/라')} 하면 ${nb(`${SG('AP')}${sup(2)} = ${SG('BP')}${sup(2)}`)}, ${nb(`${SG('AP')}${sup(2)} = ${SG('CP')}${sup(2)}`)}에서 ${VA}, ${VB}에 대한 일차방정식 두 개가 나온다. 연립하여 풀면 ${VA} = ${iq(P0[j])}, ${VB} = ${iq(P0[k])}이므로 P${pt3(P0)}이다.`,
        facts: { derived: [2] }
      });
    }),
    T('dist-rays', '좌표평면 위의 두 반직선 위의 점 사이의 거리', '①14', (d) => {
      const [th, ph] = d.pick([[60, 30], [30, 60], [45, 45]]), p = d.pick([2, 4, 6, 8]), q = d.pick([2, 4, 6, 8]);
      const sp = th === 60 ? 3 : th === 30 ? 1 : 2;                               // sin θ × cos φ = sp/4
      if ((2 * p * q * sp) % 4 !== 0) return null;
      const n2 = p * p + q * q - 2 * p * q * sp / 4, [a, b] = sqParts(n2);
      if (a < 2 || b < 2) return null;
      const L = 3.2, S = space({ u: 26 }), R = Math.PI / 180;
      const Pv = [L * Math.cos(th * R), L * Math.sin(th * R), 0], Qv = [0, L * Math.cos(ph * R), L * Math.sin(ph * R)];
      S.axes({ x: 4.2, y: 4.2, z: 3.6 }).seg([0, 0, 0], Pv).seg([0, 0, 0], Qv).dot(Pv, 'P', 300).dot(Qv, 'Q', 30);
      S.text([1.7 * Math.cos(th * R / 2), 1.7 * Math.sin(th * R / 2), 0], `${th}°`).text([0, 2.4 * Math.cos(ph * R / 2), 2.4 * Math.sin(ph * R / 2)], `${ph}°`);
      const figure = S.svg(`공간 그림: 점 P는 xy평면 위, 점 Q는 yz평면 위에 있다. 반직선 OP와 x축의 양의 방향이 이루는 각은 ${th}°, 반직선 OQ와 y축의 양의 방향이 이루는 각은 ${ph}°이다.`);
      // 길이 L 에 삼각비(1/2, √3/2, √2/2)를 곱한 좌표의 글: L 은 짝수라 L/2 가 자연수
      const rad = (deg, f) => ((f === 'cos' ? deg === 60 : deg === 30) ? 1 : deg === 45 ? 2 : 3);
      const cth = (Ln, deg, f) => { const c = Ln / 2, r0 = rad(deg, f); return r0 === 1 ? c : (c === 1 ? '' : c) + rt(r0); };
      const Ph = [cth(p, th, 'cos'), cth(p, th, 'sin'), 0], Qh = [0, cth(q, ph, 'cos'), cth(q, ph, 'sin')];
      return lenAns(`그림과 같이 두 점 P, Q가 각각 ${planeH(2)}과 ${planeH(0)} 위에 있다. ${nb(`${SG('OP')} = ${p}`)}, ${nb(`${SG('OQ')} = ${q}`)}이고, 반직선 OP가 ${X}축의 양의 방향과 이루는 각의 크기가 ${th}°, 반직선 OQ가 ${Y}축의 양의 방향과 이루는 각의 크기가 ${ph}°일 때, 두 점 P, Q 사이의 거리는? (단, O는 원점이다.)`, n2,
        `${p}*${p}+${q}*${q}-2*${p}*${q}*${sp}/4`, {
          figure,
          explain: `${nb(`P(${p} cos ${th}°, ${p} sin ${th}°, 0)`)}, ${nb(`Q(0, ${q} cos ${ph}°, ${q} sin ${ph}°)`)}이므로 P${pt3(Ph)}, Q${pt3(Qh)}이다. 따라서 ${nb(`${SG('PQ')}${sup(2)} = ${n2}`)}이고 ${SG('PQ')} = ${radText(a, b)}이다.`,
          facts: { derived: [2, 4, sp] }
        });
    }),
    T('dist-min-param', '문자가 든 두 점 사이의 거리의 최솟값', '①16', (d) => {
      const [i, j, k] = d.shuffle([0, 1, 2]), x1 = d.int(-5, 5), dx = nz(d, -6, 6), kk = d.int(-4, 4), z2 = d.int(-4, 4);
      if ((z2 - kk) % 2 !== 0) return null;
      const A = [], Bq = [];
      A[i] = x1; Bq[i] = x1 + dx; A[j] = VA; Bq[j] = VB; A[k] = poly([[1, VA], [1, VB], [kk, '']]); Bq[k] = z2;
      const m = (z2 - kk) / 2, v = Math.abs(dx);
      return N(`두 점 ${P3('A', A)}, ${P3('B', Bq)}에 대하여 선분 AB의 길이의 최솟값은? (단, ${VA}, ${VB}는 실수이다.)`, v, {
        explain: `${nb(`${SG('AB')}${sup(2)} = ${sq2(dx)} + (${VB} ${MINUS} ${VA})${sup(2)} + (${poly([[1, VA], [1, VB], [kk - z2, '']])})${sup(2)}`)}이고, 뒤의 두 제곱은 ${nb(`${VA} = ${VB} = ${iq(m)}`)}일 때 모두 0이 된다. 따라서 ${SG('AB')}의 최솟값은 ${v}이다.`,
        facts: { calc: [[dx < 0 ? `${jn(x1)}-(${jn(x1 + dx)})` : `${jn(x1 + dx)}-(${jn(x1)})`, 0]] }
      });
    }),
    T('dist-real', '입체에 좌표를 잡아 두 점 사이의 거리', '①17', (d, n) => {
      if (n === 0) {
        const w1 = d.int(8, 12), d1 = d.int(6, 9), h1 = d.int(9, 14), g = d.pick([6, 8, 10]), w2 = d.int(9, 14), d2_ = d.int(6, 10), h2 = d.int(18, 28);
        const dy = w1 + g + w2, dz = h2 - h1, n2 = d2_ * d2_ + dy * dy + dz * dz, [a, b] = sqParts(n2);
        if (a < 2 || b < 2) return null;
        return lenAns('그림과 같이 길을 사이에 두고 직육면체 모양의 두 건물이 앞면을 한 평면 위에 맞추어 서 있다. 두 점 P, Q 사이의 거리는 몇 m인가?', n2, `${d2_}*${d2_}+(${w1}+${g}+${w2})*(${w1}+${g}+${w2})+(${h2}-${h1})*(${h2}-${h1})`, {
          figure: buildings(w1, d1, h1, g, w2, d2_, h2), unit: 'm',
          explain: `점 P를 원점으로, 길을 따라가는 쪽을 ${Y}축, 높이를 ${Z}축으로 잡으면 두 점의 좌표의 차는 길을 따라 ${w1} + ${g} + ${w2} = ${dy}, 앞뒤로 ${d2_}, 높이로 ${h2} ${MINUS} ${h1} = ${dz}이다. 따라서 ${SG('PQ')} = ${rt(`${dy}${sup(2)} + ${d2_}${sup(2)} + ${dz}${sup(2)}`)} = ${radText(a, b)} (m)이다.`
        });
      }
      const [pr, qr, hyp] = d.pick([[9, 12, 15], [6, 8, 10], [12, 16, 20], [5, 12, 13], [8, 15, 17], [12, 9, 15]]);
      const R2 = d.int(2, Math.max(2, Math.floor(pr / 3))), R1 = pr - R2, H1 = d.int(Math.max(2, qr - 10), Math.min(10, qr - 2)), H2 = qr - H1;
      if (R1 < 2 * R2 || H2 < 2 || H1 < 2) return null;
      return N(`그림은 밑면의 반지름의 길이가 ${R1}, 높이가 ${H1}인 원기둥 위에 밑면의 반지름의 길이가 ${R2}, 높이가 ${H2}인 원기둥을 두 밑면의 중심이 한 직선 위에 오도록 쌓은 입체의 평면도와 정면도이다. 점 P는 위 원기둥의 윗면의 둘레 위에, 점 Q는 아래 원기둥의 밑면의 둘레 위에 있을 때, 두 점 P, Q 사이의 거리는?`, hyp, {
        figure: stacked(R1, H1, R2, H2),
        explain: `평면도에서 두 점 P, Q는 두 원의 중심을 지나는 한 직선 위에서 중심의 서로 반대쪽에 있으므로, 두 점은 원기둥의 중심축을 품은 한 평면 위에 있다. 그 평면에서 가로의 차는 ${R2} + ${R1} = ${pr}, 높이의 차는 ${H1} + ${H2} = ${qr}이므로 ${SG('PQ')} = ${rt(`${pr}${sup(2)} + ${qr}${sup(2)}`)} = ${hyp}이다.`,
        facts: { value: `((${R2}+${R1})*(${R2}+${R1})+(${H1}+${H2})*(${H1}+${H2}))**0.5`, derived: [0.5] }
      });
    }, { count: 2 }),
    T('dist-reflect', '좌표평면 위의 점을 거치는 거리의 합의 최솟값', '①18', (d, n) => {
      const i = d.int(0, 2), A = nz3(d, -5, 5), Bq = nz3(d, -5, 5);
      if (n === 0 ? A[i] * Bq[i] < 0 : A[i] * Bq[i] > 0) return null;
      const Ap = symOf(A, { kind: 'plane', i }), n2 = n === 0 ? d2(Ap, Bq) : d2(A, Bq), [a, b] = sqParts(n2);
      if (a < 2 || b < 2) return null;
      const text = `두 점 ${P3('A', A)}, ${P3j('B', Bq, '과/와')} ${planeH(i)} 위의 점 P에 대하여 ${nb(`${SG('AP')} + ${SG('PB')}`)}의 최솟값은?`;
      if (n === 0) {
        const e = [0, 1, 2].map((k) => `(${jn(Bq[k])}-(${signE(A, Ap, k)}))*(${jn(Bq[k])}-(${signE(A, Ap, k)}))`).join('+');
        return lenAns(text, n2, e, {
          explain: `두 점 A, B의 ${AX[i]}좌표의 부호가 같으므로 두 점은 ${planeH(i)}의 같은 쪽에 있다. 점 A를 ${planeH(i)}에 대하여 대칭이동한 점 A′${pt3(Ap)}에 대하여 ${nb(`${SG('AP')} = ${SG("A′P")}`)}이므로 ${nb(`${SG('AP')} + ${SG('PB')} ≥ ${SG("A′B")}`)}이다. 최솟값은 ${SG("A′B")} = ${d2h(Ap, Bq)} = ${radText(a, b)}이다.`,
          facts: { rule: 'reflect' }
        });
      }
      return lenAns(text, n2, d2e(A, Bq), {
        explain: `두 점 A, B의 ${AX[i]}좌표의 부호가 다르므로 두 점은 ${planeH(i)}의 서로 반대쪽에 있다. 선분 AB가 ${planeH(i)}과 만나는 점을 P로 잡을 때 가장 짧고, 최솟값은 ${SG('AB')} = ${d2h(A, Bq)} = ${radText(a, b)}이다.`,
        facts: { rule: 'across' }
      });
    }, { count: 2 }),
    T('dist-line-angle', '두 점을 지나는 직선과 좌표평면이 이루는 각', '①20 · 11-4-4 넘김', (d) => {
      const i = d.int(0, 2), A = rnd3(d, -4, 5), w = nz3(d, -4, 4), Bq = add3(A, w);
      const full = n2of(w), flat = full - w[i] * w[i], q = Q(flat, full);
      if (q.q === 1 || !inBox([Bq])) return null;
      const Ap = footOf(A, { kind: 'plane', i }), Bp = footOf(Bq, { kind: 'plane', i });
      const c2 = trig('cos', 'θ', 2);
      return qAns(`두 점 ${P3('A', A)}, ${P3j('B', Bq, '을/를')} 지나는 직선과 ${planeH(i)}이 이루는 각의 크기를 θ라 할 때, ${c2}의 값은?`, q, {
        explain: `두 점 A, B의 ${planeH(i)} 위로의 정사영을 각각 A′${pt3(Ap)}, B′${pt3(Bp)}이라 하면 ${nb(`${SG("A′B′")} = ${SG('AB')} cos θ`)}이다. ${nb(`${SG('AB')}${sup(2)} = ${full}`)}, ${nb(`${SG("A′B′")}${sup(2)} = ${flat}`)}이므로 ${c2} = ${frac(flat, full)}${q.q !== full ? ' = ' + tx(q) : ''}이다.`,
        facts: { value: `(${d2e(Ap, Bp)})/(${d2e(A, Bq)})` }
      });
    })
  ];

  // ═══ 다. 선분의 내분 ═══
  // 내분점 (m × 끝 + n × 시작) ÷ (m + n)의 풀이 글과 검사 식
  const divH = (p, q, m, n) => nb('(' + [0, 1, 2].map((k) => frac(`${m} × ${par(q[k])} + ${n} × ${par(p[k])}`, `${m} + ${n}`)).join(', ') + ')');
  const divE = (p, q, m, n, k) => `(${m}*${jn(q[k])}+${n}*${jn(p[k])})/(${m}+${n})`;
  const gE = (a, b, c, k) => `(${jn(a[k])}+${jn(b[k])}+${jn(c[k])})/3`;
  const gH = (a, b, c) => nb('(' + [0, 1, 2].map((k) => frac(`${iq(a[k])} + ${par(b[k])} + ${par(c[k])}`, 3)).join(', ') + ')');
  const ok3 = (...ps) => ps.every((p, i) => ps.every((q, j) => j <= i || !same3(p, q)));

  const div = [
    T('div-point', '선분의 내분점과 중점의 좌표', '①21', (d, n) => {
      if (n === 0) {
        const [m, k] = d.pick(RATIOS), A = rnd3(d, -6, 6), w = rnd3(d, -2, 2), Bq = add3(A, mul3(w, m + k)), p = add3(A, mul3(w, m));
        if (!inBox([Bq], 10) || w.filter((v) => v === 0).length > 1) return null;
        return coordOf(`두 점 ${P3('A', A)}, ${P3('B', Bq)}에 대하여 선분 AB를 ${ratioj(m, k, '으로/로')} 내분하는 점의 좌표는?`, p, [0, 1, 2].map((x) => divE(A, Bq, m, k, x)), {
          explain: `선분 AB를 ${ratioj(m, k, '으로/로')} 내분하는 점의 좌표는 ${divH(A, Bq, m, k)} = ${pt3(p)}이다.`
        });
      }
      const A = rnd3(d, -7, 7), w = rnd3(d, -4, 4).map((v) => 2 * v), Bq = add3(A, w), p = add3(A, mul3(w, 0.5));
      if (!inBox([Bq], 10) || w.filter((v) => v === 0).length > 1) return null;
      return coordOf(`두 점 ${P3('A', A)}, ${P3('B', Bq)}에 대하여 선분 AB의 중점의 좌표는?`, p, [0, 1, 2].map((x) => `(${jn(A[x])}+${jn(Bq[x])})/2`), {
        explain: `중점의 좌표는 ${nb('(' + [0, 1, 2].map((k) => frac(`${iq(A[k])} + ${par(Bq[k])}`, 2)).join(', ') + ')')} = ${pt3(p)}이다.`,
        facts: { derived: [2] }
      });
    }, { count: 2 }),
    T('div-proj-ratio', '내분점의 정사영이 나누는 비', '①22', (d) => {
      const [m, k] = d.pick(RATIOS), A = nz3(d, -3, 3).map((v) => v * (m + k)), i = d.int(0, 2);
      if (!inBox([A], 21)) return null;
      const Pp = mul3(A, m / (m + k)), Ap = footOf(A, { kind: 'plane', i }), Pq = footOf(Pp, { kind: 'plane', i });
      return vals(`원점 O와 점 ${P3('A', A)}에 대하여 선분 OA를 ${ratioj(m, k, '으로/로')} 내분하는 점을 P라 하고, 두 점 A, P의 ${planeH(i)} 위로의 정사영을 각각 A′, P′이라 하자. ${nb(`${SG("OP′")} : ${SG("P′A′")} = ${VM} : ${VN}`)}일 때, 서로소인 두 자연수 ${VM}, ${VN}의 값은?`, [[VM, m, false], [VN, k, false]], {
        explain: `P${pt3(Pp)}, A′${pt3(Ap)}, P′${pt3(Pq)}이다. 점 P′의 좌표는 점 A′의 좌표의 ${frac(m, m + k)}배이므로 점 P′은 선분 OA′을 ${ratioj(m, k, '으로/로')} 내분한다(평행한 두 수선이 자른 선분의 비는 그대로이다). 따라서 ${nb(`${VM} = ${m}`)}, ${nb(`${VN} = ${k}`)}이다.`,
        facts: { calc: [[`${m}`, 0], [`${k}`, 1]] }
      });
    }),
    T('div-find-end', '내분점의 좌표로 끝점·미지수 구하기', '①23', (d, n) => {
      const [m, k] = d.pick(RATIOS), s = m + k;
      if (n === 0) {
        const A = rnd3(d, -6, 6), w = rnd3(d, -2, 2), Bq = add3(A, mul3(w, s)), p = add3(A, mul3(w, m));
        if (!inBox([Bq], 12) || w.filter((v) => v === 0).length > 1) return null;
        return coordOf(`두 점 A, B에 대하여 ${P3('A', A)}이고 선분 AB를 ${ratioj(m, k, '으로/로')} 내분하는 점이 ${P3('P', p)}일 때, 점 B의 좌표는?`, Bq, [0, 1, 2].map((x) => `((${m}+${k})*${jn(p[x])}-${k}*${jn(A[x])})/${m}`), {
          explain: `점 B의 좌표를 ${pt3j([VA, VB, VC], '이라/라')} 하면 ${nb(`${frac(`${m}${VA} + ${k} × ${par(A[0])}`, s)} = ${iq(p[0])}`)}처럼 좌표마다 식을 세워 ${VA} = ${iq(Bq[0])}, ${VB} = ${iq(Bq[1])}, ${VC} = ${nj(Bq[2], '을/를')} 얻는다. 따라서 B${pt3(Bq)}이다.`
        });
      }
      // A(a, …), B(…, c), 내분점(…, b, …): 좌표마다 미지수가 하나
      const [ia, ib, ic] = d.shuffle([0, 1, 2]), A = rnd3(d, -6, 6), Bq = rnd3(d, -6, 6), p = [0, 1, 2].map((x) => (m * Bq[x] + k * A[x]) / s);
      if (!p.every(Number.isInteger) || same3(A, Bq)) return null;
      const Ah = A.map((v, x) => (x === ia ? VA : v)), Bh = Bq.map((v, x) => (x === ic ? VC : v)), ph = p.map((v, x) => (x === ib ? VB : v));
      return vals(`두 점 ${P3('A', Ah)}, ${P3('B', Bh)}에 대하여 선분 AB를 ${ratioj(m, k, '으로/로')} 내분하는 점의 좌표가 ${pt3(ph)}일 때, 상수 ${VA}, ${VB}, ${VC}의 값은?`, [[VA, A[ia]], [VB, p[ib]], [VC, Bq[ic]]], {
        explain: `내분하는 점의 ${AX[ia]}좌표는 ${frac(`${m} × ${par(Bq[ia])} + ${k}${VA}`, s)} = ${iq(p[ia])}에서 ${VA} = ${iq(A[ia])}, ${AX[ib]}좌표는 ${frac(`${m} × ${par(Bq[ib])} + ${k} × ${par(A[ib])}`, s)} = ${iq(p[ib])}이므로 ${VB} = ${iq(p[ib])}, ${AX[ic]}좌표는 ${frac(`${m}${VC} + ${k} × ${par(A[ic])}`, s)} = ${iq(p[ic])}에서 ${VC} = ${iq(Bq[ic])}이다.`,
        facts: { calc: [[`((${m}+${k})*${jn(p[ia])}-${m}*${jn(Bq[ia])})/${k}`, 0], [divE(A, Bq, m, k, ib), 1], [`((${m}+${k})*${jn(p[ic])}-${k}*${jn(A[ic])})/${m}`, 2]] }
      });
    }, { count: 2 }),
    T('div-mid-plane', '좌표평면 위의 점과 중점 — 끝점까지의 거리', '①23 변형', (d) => {
      const i = d.int(0, 2), A = rnd3(d, -6, 6), P0 = rnd3(d, -5, 5);
      P0[i] = 0;
      if (A[i] % 2 !== 0 || A[i] === 0) return null;
      const M0 = mul3(add3(A, P0), 0.5);
      if (!isInt3(M0)) return null;
      const n2 = d2(M0, P0);
      if (n2 < 2 || isSq(n2) || sqParts(n2)[0] !== 1) return null;
      const Mh = M0.map((v, k) => (k === i ? VA : v));
      // BP = AB(B 는 AP 의 중점). B 의 i 좌표는 A 의 i 좌표의 절반이다.
      const e = [0, 1, 2].map((k) => { const t = k === i ? `(${jn(A[i])}-${jn(A[i])}/2)` : `(${jn(A[k])}-${jn(M0[k])})`; return `${t}*${t}`; }).join('+');
      return rootAns(`${planeH(i)} 위의 점 P와 점 ${P3('A', A)}에 대하여 선분 AP의 중점이 ${P3('B', Mh)}일 때, 선분 BP의 길이는?`, n2, e, {
        explain: `점 P는 ${planeH(i)} 위에 있으므로 ${AX[i]}좌표가 0이다. 중점 B의 ${AX[i]}좌표는 ${frac(`${iq(A[i])} + 0`, 2)} = ${iq(M0[i])}이므로 ${VA} = ${iq(M0[i])}이고, 나머지 좌표에서 P${pt3(P0)}이다. ${SG('BP')} = ${SG('AB')}이므로 ${SG('BP')} = ${d2h(M0, P0)} = ${rt(n2)}이다.`,
        facts: { derived: [2] }
      });
    }),
    T('div-point-sym', '점에 대한 대칭이동', '①24', (d) => {
      const A = rnd3(d, -6, 6), Bq = rnd3(d, -4, 4), Cq = sub3(mul3(Bq, 2), A);
      if (same3(A, Bq) || !inBox([Cq], 12)) return null;
      return coordOf(`점 ${P3j('A', A, '을/를')} 점 ${P3('B', Bq)}에 대하여 대칭이동한 점의 좌표는?`, Cq, [0, 1, 2].map((k) => `2*${jn(Bq[k])}-${jn(A[k])}`), {
        explain: `대칭이동한 점을 C라 하면 점 B는 선분 AC의 중점이다. 좌표마다 ${nb('(A의 좌표 + C의 좌표) ÷ 2 = (B의 좌표)')}에서 C${pt3(Cq)}이다.`,
        facts: { derived: [2] }
      });
    }),
    T('div-on-plane', '내분점이 좌표평면 위에 있을 때 미지수', '①25', (d) => {
      const [m, k] = d.pick(RATIOS), i = d.int(0, 2), other = nz(d, -5, 5) * k, a = -m * other / k, A = rnd3(d, -6, 6), Bq = rnd3(d, -6, 6);
      if (Math.abs(a) > 15 || a === 0) return null;
      A[i] = a; Bq[i] = other;
      const Ah = A.map((v, x) => (x === i ? VA : v));
      return N(`두 점 ${P3('A', Ah)}, ${P3('B', Bq)}에 대하여 선분 AB를 ${ratioj(m, k, '으로/로')} 내분하는 점이 ${planeH(i)} 위에 있을 때, 상수 ${VA}의 값은?`, a, {
        signed: true,
        explain: `내분하는 점의 ${AX[i]}좌표는 ${frac(`${m} × ${par(other)} + ${k}${VA}`, `${m} + ${k}`)}이고, ${planeH(i)} 위의 점은 ${AX[i]}좌표가 0이므로 ${nb(`${m} × ${par(other)} + ${k}${VA} = 0`)}, ${VA} = ${iq(a)}이다.`,
        facts: { calc: [[`(0-${m}*${jn(other)})/${k}`, 0]] }
      });
    }),
    T('div-on-two', '두 내분점이 좌표축·좌표평면 위에 있을 때 미지수', '①25', (d) => {
      const i = d.int(0, 2), [j, k] = [0, 1, 2].filter((x) => x !== i), [m1, n1] = d.pick(RATIOS), [m2, n2] = d.pick(RATIOS);
      if (m1 * n2 === m2 * n1) return null;
      const Bi = nz(d, -5, 5), Bj = nz(d, -5, 5), Ak = nz(d, -5, 5);
      const a = -m2 * Bi / n2, b = -m1 * Bj / n1, c = -n1 * Ak / m1;
      if (![a, b, c].every(Number.isInteger) || [a, b, c].some((v) => Math.abs(v) > 12)) return null;
      const Ah = [], Bh = [];
      Ah[i] = VA; Ah[j] = VB; Ah[k] = Ak; Bh[i] = Bi; Bh[j] = Bj; Bh[k] = VC;
      return vals(`두 점 ${P3('A', Ah)}, ${P3('B', Bh)}에 대하여 선분 AB를 ${ratioj(m1, n1, '으로/로')} 내분하는 점 P가 ${axisH(i)} 위에 있고, 선분 AB를 ${ratioj(m2, n2, '으로/로')} 내분하는 점 Q가 ${planeH(i)} 위에 있을 때, 상수 ${VA}, ${VB}, ${VC}의 값은?`, [[VA, a], [VB, b], [VC, c]], {
        explain: `점 P는 ${axisH(i)} 위에 있으므로 ${AX[j]}좌표와 ${AX[k]}좌표가 0이다. ${nb(`${m1} × ${par(Bj)} + ${n1}${VB} = 0`)}, ${nb(`${m1}${VC} + ${n1} × ${par(Ak)} = 0`)}에서 ${VB} = ${iq(b)}, ${VC} = ${iq(c)}이다. 점 Q는 ${planeH(i)} 위에 있으므로 ${AX[i]}좌표가 0이다. ${nb(`${m2} × ${par(Bi)} + ${n2}${VA} = 0`)}에서 ${VA} = ${iq(a)}이다.`,
        facts: { calc: [[`(0-${m2}*${jn(Bi)})/${n2}`, 0], [`(0-${m1}*${jn(Bj)})/${n1}`, 1], [`(0-${n1}*${jn(Ak)})/${m1}`, 2]] }
      });
    }),
    T('div-two-mid', '두 내분점을 이은 선분의 중점', '①26', (d) => {
      const s = d.pick([3, 4, 5]), m1 = d.int(1, s - 1), m2 = d.int(1, s - 1);
      if (m1 === m2) return null;
      const A = rnd3(d, -5, 5), w = rnd3(d, -1, 1).map((v) => v * 2 * s), Bq = add3(A, w);
      if (!inBox([Bq], 16) || w.filter((v) => v === 0).length > 1) return null;
      const P = add3(A, mul3(w, m1 / s)), Qq = add3(A, mul3(w, m2 / s)), Mm = mul3(add3(P, Qq), 0.5);
      if (![P, Qq, Mm].every(isInt3)) return null;
      const n1 = s - m1, n2 = s - m2;
      return coordOf(`두 점 ${P3('A', A)}, ${P3('B', Bq)}에 대하여 선분 AB를 ${ratioj(m1, n1, '으로/로')} 내분하는 점을 P, ${ratioj(m2, n2, '으로/로')} 내분하는 점을 Q라 할 때, 선분 PQ의 중점의 좌표는?`, round3(Mm), [0, 1, 2].map((k) => `(${divE(A, Bq, m1, n1, k)}+${divE(A, Bq, m2, n2, k)})/2`), {
        explain: `P${pt3(round3(P))}, Q${pt3(round3(Qq))}이므로 선분 PQ의 중점의 좌표는 ${pt3(round3(Mm))}이다.${m1 === n2 ? ' (두 비가 서로 뒤바뀐 꼴이라 이 점은 선분 AB의 중점과 같다.)' : ''}`,
        facts: { derived: [2] }
      });
    }),
    T('div-two-mid-back', '두 내분점의 중점에서 끝점 구하기', '①27', (d) => {
      const [m, k] = d.pick(RATIOS.filter(([x, y]) => x < y)), Bq = rnd3(d, -6, 6), Mm = rnd3(d, -5, 5), A = sub3(mul3(Mm, 2), Bq);
      if (same3(A, Bq) || !inBox([A], 14)) return null;
      return coordOf(`두 점 A, ${P3('B', Bq)}에 대하여 선분 AB를 ${ratioj(m, k, '으로/로')} 내분하는 점을 P, ${ratioj(k, m, '으로/로')} 내분하는 점을 Q라 하자. 선분 PQ의 중점의 좌표가 ${pt3(Mm)}일 때, 점 A의 좌표는?`, A, [0, 1, 2].map((x) => `2*${jn(Mm[x])}-${jn(Bq[x])}`), {
        explain: `두 점 P, Q는 선분 AB의 중점에서 같은 거리만큼 양쪽에 있으므로 선분 PQ의 중점은 선분 AB의 중점이다. 따라서 좌표마다 ${nb('(A의 좌표 + B의 좌표) ÷ 2 = (PQ의 중점의 좌표)')}에서 A${pt3(A)}이다.`,
        facts: { derived: [2] }
      });
    }),
    T('div-centroid', '삼각형의 무게중심의 좌표', '①28', (d) => {
      const A = rnd3(d, -6, 6), Bq = rnd3(d, -6, 6), Cq = rnd3(d, -6, 6), sum = add3(add3(A, Bq), Cq);
      if (!sum.every((v) => v % 3 === 0) || !ok3(A, Bq, Cq)) return null;
      const g = round3(mul3(sum, 1 / 3));
      return coordOf(`세 점 ${P3('A', A)}, ${P3('B', Bq)}, ${P3j('C', Cq, '을/를')} 꼭짓점으로 하는 삼각형 ABC의 무게중심의 좌표는?`, g, [0, 1, 2].map((k) => gE(A, Bq, Cq, k)), {
        explain: `무게중심의 좌표는 ${gH(A, Bq, Cq)} = ${pt3(g)}이다.`,
        facts: { derived: [3] }
      });
    }),
    T('div-centroid-back', '무게중심의 좌표로 꼭짓점·미지수 구하기', '①29', (d, n) => {
      const A = rnd3(d, -6, 6), Bq = rnd3(d, -6, 6), g = rnd3(d, -4, 4), Cq = sub3(sub3(mul3(g, 3), A), Bq);
      if (!inBox([Cq], 12) || !ok3(A, Bq, Cq)) return null;
      if (n === 0) return coordOf(`삼각형 ABC의 두 꼭짓점이 ${P3('A', A)}, ${P3('B', Bq)}이고 무게중심의 좌표가 ${pt3(g)}일 때, 꼭짓점 C의 좌표는?`, Cq, [0, 1, 2].map((k) => `3*${jn(g[k])}-${jn(A[k])}-${jn(Bq[k])}`), {
        explain: `C${pt3([VA, VB, VC])}라 하면 좌표마다 ${nb('(세 꼭짓점의 좌표의 합) ÷ 3 = (무게중심의 좌표)')}이므로 ${VA} = 3 × ${par(g[0])} ${MINUS} ${par(A[0])} ${MINUS} ${par(Bq[0])} = ${iq(Cq[0])}처럼 셈하여 C${pt3(Cq)}이다.`,
        facts: { derived: [3] }
      });
      const [ia, ic, ig] = d.shuffle([0, 1, 2]), Ah = A.map((v, k) => (k === ia ? VA : v)), Ch = Cq.map((v, k) => (k === ic ? VB : v)), gh = g.map((v, k) => (k === ig ? VC : v));
      return vals(`세 점 ${P3('A', Ah)}, ${P3('B', Bq)}, ${P3j('C', Ch, '을/를')} 꼭짓점으로 하는 삼각형 ABC의 무게중심의 좌표가 ${pt3(gh)}일 때, 상수 ${VA}, ${VB}, ${VC}의 값은?`, [[VA, A[ia]], [VB, Cq[ic]], [VC, g[ig]]], {
        explain: `${AX[ia]}좌표에서 ${nb(frac(`${VA} + ${par(Bq[ia])} + ${par(Cq[ia])}`, 3) + ' = ' + iq(g[ia]))}이므로 ${VA} = ${iq(A[ia])}, ${AX[ic]}좌표에서 ${nb(frac(`${iq(A[ic])} + ${par(Bq[ic])} + ${VB}`, 3) + ' = ' + iq(g[ic]))}이므로 ${VB} = ${iq(Cq[ic])}, ${AX[ig]}좌표에서 ${VC} = ${frac(`${iq(A[ig])} + ${par(Bq[ig])} + ${par(Cq[ig])}`, 3)} = ${iq(g[ig])}이다.`,
        facts: { calc: [[`3*${jn(g[ia])}-${jn(Bq[ia])}-${jn(Cq[ia])}`, 0], [`3*${jn(g[ic])}-${jn(A[ic])}-${jn(Bq[ic])}`, 1], [gE(A, Bq, Cq, ig), 2]], derived: [3] }
      });
    }, { count: 2 }),
    T('div-centroid-plane', '무게중심이 좌표평면 위에 있을 때 — 꼭짓점과의 거리', '①29 변형', (d) => {
      const i = d.int(0, 2), j = d.pick([0, 1, 2].filter((k) => k !== i)), al = d.int(-5, 5), be = d.int(-4, 4), ga = d.int(-4, 4);
      if ((al + be + ga) % 2 !== 0) return null;
      const a = (al + be + ga) / 2;
      if (a === 0) return null;
      const A = rnd3(d, -5, 5), Bq = rnd3(d, -5, 5), Cq = rnd3(d, -5, 5);
      A[i] = al; A[j] = a; Bq[i] = be - a; Cq[i] = ga - a;
      const g = mul3(add3(add3(A, Bq), Cq), 1 / 3);
      if (!isInt3(g) || !ok3(A, Bq, Cq)) return null;
      const gi = round3(g), n2 = d2(A, gi);
      if (n2 < 2 || isSq(n2) || sqParts(n2)[0] !== 1) return null;
      const Ah = A.map((v, k) => (k === j ? VA : v)), Bh = Bq.map((v, k) => (k === i ? poly([[-1, VA], [be, '']]) : v)), Ch = Cq.map((v, k) => (k === i ? poly([[-1, VA], [ga, '']]) : v));
      // a = (α + β + γ)/2 를 글의 수로: A 의 i 좌표 α, B·C 의 i 좌표의 상수 β, γ
      const ae = `(${jn(al)}+${jn(be)}+${jn(ga)})/2`;
      const coord = (P, k, isA) => (k === j && isA ? ae : k === i && !isA ? `(${jn(P === Bq ? be : ga)}-${ae})` : jn(P[k]));
      const e = [0, 1, 2].map((k) => { const gk = `(${coord(A, k, true)}+${coord(Bq, k, false)}+${coord(Cq, k, false)})/3`; return `(${coord(A, k, true)}-${gk})*(${coord(A, k, true)}-${gk})`; }).join('+');
      return rootAns(`세 점 ${P3('A', Ah)}, ${P3('B', Bh)}, ${P3j('C', Ch, '을/를')} 꼭짓점으로 하는 삼각형 ABC의 무게중심 G가 ${planeH(i)} 위에 있을 때, 선분 AG의 길이는?`, n2, e, {
        explain: `무게중심의 ${AX[i]}좌표는 ${frac(`${iq(al)} + (${poly([[-1, VA], [be, '']])}) + (${poly([[-1, VA], [ga, '']])})`, 3)}이고 이것이 0이므로 ${VA} = ${iq(a)}이다. 그러면 A${pt3(A)}, G${pt3(gi)}이므로 ${SG('AG')} = ${d2h(A, gi)} = ${rt(n2)}이다.`,
        facts: { derived: [2, 3] }
      });
    }),
    T('div-centroid-mid', '변의 중점과 무게중심으로 꼭짓점 구하기', '①30', (d) => {
      const Mm = rnd3(d, -5, 5), g = rnd3(d, -5, 5), Cq = sub3(mul3(g, 3), mul3(Mm, 2));
      if (same3(Mm, g) || !inBox([Cq], 15)) return null;
      return coordOf(`삼각형 ABC에서 변 AB의 중점의 좌표가 ${pt3(Mm)}이고 무게중심의 좌표가 ${pt3(g)}일 때, 꼭짓점 C의 좌표는?`, Cq, [0, 1, 2].map((k) => `3*${jn(g[k])}-2*${jn(Mm[k])}`), {
        explain: `변 AB의 중점을 M이라 하면 무게중심 G는 선분 CM을 ${ratioj(2, 1, '으로/로')} 내분한다. 좌표마다 ${nb(frac('2 × (M의 좌표) + (C의 좌표)', 3) + ' = (G의 좌표)')}이므로 C${pt3(Cq)}이다.`,
        facts: { derived: [2, 3] }
      });
    }),
    T('div-sym-centroid', '대칭이동한 점들로 만든 삼각형의 무게중심', '①31', (d) => {
      const [t1, t2] = d.shuffle(ALLT).slice(0, 2), s1 = symOf([1, 1, 1], t1), s2 = symOf([1, 1, 1], t2), kf = [0, 1, 2].map((k) => 1 + s1[k] + s2[k]);
      const v = [0, 1, 2].map((k) => nz(d, -4, 4) * (kf[k] === 3 ? 1 : 3)), g = v.map((x, k) => x * kf[k] / 3);
      if (v.some((x) => Math.abs(x) > 12)) return null;
      const names = [VA, VB, VC];
      return vals(`점 ${P3j('A', names, '을/를')} ${tName(t1)}에 대하여 대칭이동한 점을 B, ${tName(t2)}에 대하여 대칭이동한 점을 C라 하자. 삼각형 ABC의 무게중심의 좌표가 ${pt3(g)}일 때, 상수 ${VA}, ${VB}, ${VC}의 값은?`,
        [[VA, v[0]], [VB, v[1]], [VC, v[2]]], {
          explain: `${tName(t1)}에 대하여 대칭이동하면 ${symRuleC(t1)} B${pt3(names.map((h, k) => (s1[k] === 1 ? h : MINUS + h)))}, ${tName(t2)}에 대하여 대칭이동하면 ${symRuleC(t2)} C${pt3(names.map((h, k) => (s2[k] === 1 ? h : MINUS + h)))}이다. 무게중심의 좌표는 ${pt3(names.map((h, k) => (kf[k] === 3 ? h : kf[k] === 1 ? frac(h, 3) : MINUS + frac(h, 3))))}이므로 ${VA} = ${iq(v[0])}, ${VB} = ${iq(v[1])}, ${VC} = ${iq(v[2])}이다.`,
          facts: { calc: [0, 1, 2].map((k) => [`${jn(g[k])}*3/${kf[k] === -1 ? '(0-1)' : kf[k]}`, k]), derived: [3] }
        });
    }),
    T('div-proj-centroids', '축과 평면 위로의 정사영으로 만든 두 삼각형의 무게중심 사이의 거리', '①32', (d) => {
      const u = [d.int(1, 4), d.int(1, 4), d.int(1, 4)].map((v) => v * pm(d)), A = mul3(u, 3), n2 = n2of(u);
      if (isSq(n2) || sqParts(n2)[0] !== 1) return null;
      const axp = [0, 1, 2].map((k) => footOf(A, { kind: 'axis', i: k })), plp = [0, 1, 2].map((k) => footOf(A, { kind: 'plane', i: k })), g1 = mul3(A, 1 / 3), g2 = mul3(A, 2 / 3);
      return rootAns(`점 ${P3('A', A)}의 ${X}축, ${Y}축, ${Z}축 위로의 정사영을 각각 P, Q, R라 하고, ${planeH(0)}, ${planeH(1)}, ${planeH(2)} 위로의 정사영을 각각 P′, Q′, R′이라 하자. 두 삼각형 PQR, P′Q′R′의 무게중심 사이의 거리는?`, n2, `${A.map((v) => `(${jn(v)}/3)*(${jn(v)}/3)`).join('+')}`, {
        explain: `P${pt3(axp[0])}, Q${pt3(axp[1])}, R${pt3(axp[2])}의 무게중심은 ${pt3(g1)}, P′${pt3(plp[0])}, Q′${pt3(plp[1])}, R′${pt3(plp[2])}의 무게중심은 ${pt3(g2)}이다. 두 점 사이의 거리는 ${d2h(g1, g2)} = ${rt(n2)}이다.`,
        facts: { derived: [3] }
      });
    }),
    T('div-centroid-div', '무게중심과 꼭짓점을 잇는 선분의 내분점', '①33', (d) => {
      const [m, k] = d.pick([[2, 1], [1, 2], [1, 3], [3, 1], [1, 1]]), A = rnd3(d, -6, 6), Bq = rnd3(d, -6, 6), Cq = rnd3(d, -6, 6), sum = add3(add3(A, Bq), Cq);
      if (!sum.every((v) => v % 3 === 0) || !ok3(A, Bq, Cq)) return null;
      const g = round3(mul3(sum, 1 / 3)), p = [0, 1, 2].map((x) => (m * g[x] + k * A[x]) / (m + k));
      if (!p.every(Number.isInteger) || same3(g, A)) return null;
      const what = m === k ? '선분 AG의 중점' : `선분 AG를 ${ratioj(m, k, '으로/로')} 내분하는 점`;
      return coordOf(`세 점 ${P3('A', A)}, ${P3('B', Bq)}, ${P3j('C', Cq, '을/를')} 꼭짓점으로 하는 삼각형 ABC의 무게중심을 G라 할 때, ${what}의 좌표는?`, p, [0, 1, 2].map((x) => `(${m}*${gE(A, Bq, Cq, x)}+${k}*${jn(A[x])})/(${m}+${k})`), {
        explain: `G${pt3(g)}이므로 ${what}의 좌표는 ${divH(A, g, m, k)} = ${pt3(p)}이다.`,
        facts: { derived: [3, 2] }
      });
    }),
    T('div-parallelogram', '평행사변형의 넷째 꼭짓점', '①34', (d, n) => {
      if (n === 0) {
        const A = rnd3(d, -6, 6), Cq = rnd3(d, -6, 6), Bq = add3(A, Cq);
        if (same3(A, Cq) || A.every((v, k) => v === -Cq[k]) || !inBox([Bq], 12) || A.every((v) => v === 0) || Cq.every((v) => v === 0)) return null;
        return coordOf(`평행사변형 OABC의 세 꼭짓점이 O(0, 0, 0), ${P3('A', A)}, ${P3('C', Cq)}일 때, 꼭짓점 B의 좌표는?`, Bq, [0, 1, 2].map((k) => `${jn(A[k])}+${jn(Cq[k])}`), {
          explain: `평행사변형의 두 대각선 OB와 AC는 서로를 이등분하므로 선분 OB의 중점과 선분 AC의 중점이 같다. 따라서 ${nb('(B의 좌표) = (A의 좌표) + (C의 좌표)')}이고 B${pt3(Bq)}이다.`
        });
      }
      const A = rnd3(d, -6, 6), Bq = rnd3(d, -6, 6), Cq = rnd3(d, -6, 6), D = sub3(add3(A, Cq), Bq), sum = add3(add3(Bq, Cq), D);
      if (!sum.every((v) => v % 3 === 0) || !ok3(A, Bq, Cq) || !inBox([D], 12)) return null;
      const g = round3(mul3(sum, 1 / 3));
      return coordOf(`평행사변형 ABCD의 세 꼭짓점이 ${P3('A', A)}, ${P3('B', Bq)}, ${P3('C', Cq)}일 때, 삼각형 BCD의 무게중심의 좌표는?`, g, [0, 1, 2].map((k) => `(${jn(Bq[k])}+${jn(Cq[k])}+${jn(A[k])}+${jn(Cq[k])}-${jn(Bq[k])})/3`), {
        explain: `두 대각선 AC, BD의 중점이 같으므로 ${nb('(D의 좌표) = (A의 좌표) + (C의 좌표) − (B의 좌표)')}, 곧 D${pt3(D)}이다. 삼각형 BCD의 무게중심의 좌표는 ${gH(Bq, Cq, D)} = ${pt3(g)}이다.`,
        facts: { derived: [3] }
      });
    }, { count: 2 }),
    T('div-plane-ratio', '직선과 좌표평면의 교점이 선분을 나누는 비', '①36', (d) => {
      const [m, k] = d.pick(RATIOS), i = d.int(0, 2), t = nz(d, -3, 3), w = rnd3(d, -2, 2);
      w[i] = t;
      const Bq = rnd3(d, -5, 5);
      Bq[i] = k * t;
      const A = add3(Bq, mul3(w, m)), Cq = sub3(Bq, mul3(w, k));
      if (!inBox([A, Cq], 12) || w.filter((v) => v === 0).length > 1) return null;
      return vals(`두 점 ${P3('A', A)}, ${P3('B', Bq)}에 대하여 선분 AB의 연장선이 ${planeH(i)}과 만나는 점을 C라 하자. 점 B가 선분 AC를 ${ratio(VM, VN)}으로 내분할 때, 서로소인 두 자연수 ${VM}, ${VN}의 값은?`, [[VM, m, false], [VN, k, false]], {
        explain: `점 C의 ${AX[i]}좌표는 0이다. 점 B가 선분 AC를 ${ratio(VM, VN)}으로 내분하므로 ${AX[i]}좌표에서 ${nb(`${frac(`${VM} × 0 + ${VN} × ${par(A[i])}`, `${VM} + ${VN}`)} = ${iq(Bq[i])}`)}, 곧 ${nb(`${frac(VM, VN)} = ${frac(`${iq(A[i])} ${MINUS} ${par(Bq[i])}`, iq(Bq[i]))} = ${frac(m, k)}`)}이다. 따라서 ${nb(`${VM} = ${m}`)}, ${nb(`${VN} = ${k}`)}이다.`,
        facts: { calc: [[`(${jn(A[i])}-${jn(Bq[i])})/(${jn(t)})`, 0], [`${jn(Bq[i])}/(${jn(t)})`, 1]], derived: [Math.abs(t)] }
      });
    }),
    T('div-cube', '정육면체에 좌표를 잡아 내분점과 중점 사이의 거리', '①39', (d) => {
      const [p, q] = d.pick([[1, 3], [3, 1], [1, 2], [2, 1]]), t = Q(p, p + q), base = { '1/4': 8, '3/4': 8, '1/3': 4, '2/3': 12 }[t.p + '/' + t.q], s = base * d.int(1, 2);
      // H 를 원점으로: A(s, 0, s), G(0, s, 0), C(0, s, s), F(s, s, 0)
      const A = [s, 0, s], G = [0, s, 0], Cc = [0, s, s], F = [s, s, 0], I = [0, 1, 2].map((k) => (q * A[k] + p * G[k]) / (p + q)), J = mul3(add3(Cc, F), 0.5), n2 = d2(I, J);
      if (!Number.isInteger(n2)) return null;
      const [a, b] = sqParts(n2);
      if (a < 2 || b < 2) return null;
      const S = space({ u: 30 }), k = 2.4;
      S.box([0, 0, 0], [k, k, k], null);
      cubeNames(S, { H: [0, 0, 0], E: [k, 0, 0], F: [k, k, 0], G: [0, k, 0], D: [0, 0, k], A: [k, 0, k], B: [k, k, k], C: [0, k, k] }, { B: 115, G: 0 });
      const Iv = [0, 1, 2].map((x) => (q * [k, 0, k][x] + p * [0, k, 0][x]) / (p + q)), Jv = [k / 2, k, k / 2];
      S.seg([k, 0, k], [0, k, 0], 'dash').seg([0, k, k], [k, k, 0], 'thin').dot(Iv, 'I', 200).dot(Jv, 'J', 0);
      const figure = S.svg('공간 그림: 정육면체 ABCD-EFGH. 윗면이 ABCD, 아랫면이 EFGH이고 A 아래에 E, B 아래에 F, C 아래에 G, D 아래에 H가 있다. 대각선 AG 위에 점 I, 면 BFGC의 대각선 CF의 가운데에 점 J가 있다.');
      const Ih = I.map((v) => (Number.isInteger(v) ? v : tx(Q(Math.round(v * (p + q)), p + q))));
      return lenAns(`그림과 같이 한 모서리의 길이가 ${s}인 정육면체 ABCD−EFGH에서 선분 AG를 ${ratioj(p, q, '으로/로')} 내분하는 점을 I, 선분 CF의 중점을 J라 할 때, 선분 IJ의 길이는?`, n2,
        `${[0, 1, 2].map((x) => { const e = `((${q}*${A[x]}+${p}*${G[x]})/(${p}+${q})-(${Cc[x]}+${F[x]})/2)`; return `${e}*${e}`; }).join('+')}`, {
          figure,
          explain: `점 H를 원점으로, 반직선 HE, HG, HD를 각각 ${X}축, ${Y}축, ${Z}축의 양의 방향으로 잡으면 A${pt3(A)}, G${pt3(G)}, C${pt3(Cc)}, F${pt3(F)}이다. I${pt3(Ih)}, J${pt3(J)}이므로 ${SG('IJ')} = ${rt(n2)} = ${radText(a, b)}이다.`,
          facts: { derived: [2] }
        });
    })
  ];

  B.addUnit({ id: '11-4-5', grade: 11, semester: 4, no: 5, title: '공간좌표', version: 1, groups: [
    { id: 'point', title: '점의 좌표 — 수선의 발과 대칭이동', standard: S4, types: point },
    { id: 'dist', title: '두 점 사이의 거리', standard: S4, types: dist },
    { id: 'div', title: '선분의 내분', standard: S4, types: div },
    { id: 'sphere', title: '구의 방정식', standard: S5, types: [] },
    { id: 'touch', title: '좌표평면·좌표축과 구', standard: S5, types: [] },
    { id: 'far', title: '구와 거리 — 접선·최대·최소', standard: S5, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
