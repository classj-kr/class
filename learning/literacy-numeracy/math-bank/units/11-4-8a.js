// 고등학교 기하 3단원 「도형의 방정식」(11-4-8) — 단원 틀·단원 안의 도구와 앞쪽 묶음(직선의 방정식, 두 직선이 이루는 각과 위치 관계, 직선 위의 점 — 교점과 수선의 발).
// 수집해 둔 천재 T셀파 기하(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 31꼴, 기본꼴 2: 30꼴, 심화 문서 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-4-8/싣기_대조표.md 에 있다.
// (평면의 방정식, 두 평면·직선과 평면이 이루는 각, 점과 평면 사이의 거리, 구의 방정식, 구와 직선·평면의 묶음은 11-4-8b.js 에, 실력 문항은 11-4-8c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준: 12기하03-04(벡터를 이용한 직선의 방정식), 12기하03-05(평면의 방정식과 구의 방정식). 묶음 차례는 교과서의 소단원 차례(직선 → 평면 → 구)를 따른다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(점과 방향벡터·두 점·다른 직선·좌표평면의 직선·법선벡터·벡터 조건), 묻는 것(식·좌표·각·cos·미지수·거리·넓이),
//    이어 하는 일(교점 → 평면, 수선의 발 → 거리, 구 → 교선의 원)이 다를 때만 따로 싣는다. 수만 다른 것은 한 번만 싣는다.
//  - 사용자가 정한 것: 수학 실력에 필요해 보이는 꼴은 다 싣는다. 교육과정의 「지나치게 복잡한 공간지각력을 요구하는 문제는 다루지 않는다」는 정도를 말하는 줄이라 꼴을 빼는 까닭으로 쓰지 않았다.
//    고1 「도형의 방정식」(10-2-1~2)과 하는 일이 같은 꼴(좌표평면의 직선 — 한 점과 방향벡터, 두 점, 평행·수직 조건, 법선벡터로 직선)도 학년이 달라 싣는다(코디네이터 결정).
//    같은 과목의 다른 단원과 같은 일만 그쪽에 둔다: ①7(직선 위의 점의 위치벡터 — 11-4-7), ②10(점과 좌표평면 사이의 거리 — 11-4-5).
//  - 답: 직선의 방정식은 지나는 점(분자)을 문제가 정하고 방향벡터의 성분(분모)을 칸으로 받는다. 방향벡터는 실수배를 해도 되므로 x의 분모를 틀에 적어 두어 답을 하나로 정한다
//    (한 점과 방향벡터를 주는 꼴은 분모가 주어진 벡터 그대로라 분자의 수를 칸으로 받는다). 평면의 방정식은 「ax + [±][ ]y + [±][ ]z + [±][ ] = 0」(x의 계수 a 는 틀에 적는다),
//    구의 방정식은 「(x [±][ ])² + (y [±][ ])² + (z [±][ ])² = [ ]」, 좌표는 「( [±][ ], [±][ ], [±][ ] )」, 각의 크기는 수 칸(°), cos 의 값·거리는 유형마다 한 꼴로 정한
//    분수 칸·근호 칸이다. 한 유형 안에서는 차례·씨앗이 바뀌어도 칸의 모양이 같다. 미지수·좌표·계수처럼 음수일 수 있는 칸에는 모두 부호 단추를 단다.
//    원문의 「a + b의 값」「ab의 값」「Mm의 값」처럼 따로 구한 수를 더하거나 곱해 묻는 꼴은 수를 하나하나 답하게 바꾸었다.
//  - 답은 모두 코드가 셈한다(원문 답을 따르지 않는다). 검사 근거: 수 칸은 문제에 적힌 좌표·성분으로 다시 셈하는 식(facts.calc), 각은 cos² 의 네 배(0·1·2·3)를 90°·60°·45°·30°로
//    옮기는 식, 미지수를 방정식으로 구하는 꼴은 □ 에 수를 넣어 등식이 맞는 수를 찾는 식(facts.digit), 고르기는 코드가 가린 참·거짓(facts.truth)이다.
//    근호 밖으로 꺼낸 수·분모를 유리화한 수처럼 글에 없는 수는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(11-4-8b.js, 11-4-8c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목 다른 단원: ①7(11-4-7 위치벡터), ②10(11-4-5 공간좌표).
//  - 서술형: ①6·①25·②20의 「설명해 보자」는 위치 관계 고르기·평면식·구의 방정식으로 바꾸어 실었다(뺀 것 없음).
//  - 그림을 알 수 없음: 없다. ②13(정육면체)은 쪽 그림으로 꼭짓점 이름을 확인하고 직육면체로 수를 바꾸어 새로 그렸다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」 문자는 맨 「수 a」로 부르지 않는다: 값을 물으면 「상수 a」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, inline } = B.kit;
  const { MINUS, V, sup, nb, poly, rt, grp, sqParts, radText, radAns } = B.kit.mid;
  const { vec, jh, coordAns, qAns, ms, trig } = B.kit.hs;
  const UNIT = '11-4-8', S4 = '12기하03-04', S5 = '12기하03-05';

  // ── 수와 벡터 ──
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const z0 = (v) => v + 0;                                                     // −0 을 0 으로
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const add = (a, b) => a.map((v, i) => z0(v + b[i]));
  const sub = (a, b) => a.map((v, i) => z0(v - b[i]));
  const mul = (k, a) => a.map((v) => z0(k * v));
  const n2 = (a) => dot(a, a);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]].map(z0);
  const gall = (a) => a.reduce((g, v) => gcd(g, v), 0);
  const prim = (a) => { const g = gall(a) || 1; return a.map((v) => z0(v / g)); };
  const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
  const sqf = (n) => n >= 2 && sqParts(n)[0] === 1;
  const allNZ = (a) => a.every((v) => v !== 0);
  const nz2 = (a) => a.filter((v) => v !== 0).length >= 2;                    // 0인 성분이 많아야 하나
  const parallel = (a, b) => (a.length === 2 ? a[0] * b[1] - a[1] * b[0] === 0 : cross(a, b).every((v) => v === 0));
  const nz = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v !== 0);
  const sgn = (d) => (d.bool() ? 1 : -1);
  const distinct = (list) => new Set(list.map(String)).size === list.length;
  // 이차(또는 일차)방정식 Ax² + Bx + C = 0 의 실근(중근은 하나로)
  function realRoots(a, b, c) {
    if (a === 0) return b === 0 ? [] : [-c / b];
    const D = b * b - 4 * a * c;
    if (D < 0) return [];
    if (D === 0) return [-b / (2 * a)];
    const s = Math.sqrt(D); return [(-b - s) / (2 * a), (-b + s) / (2 * a)];
  }
  // 양수인 근이 꼭 하나이고 그것이 정수인가: 그 정수(아니면 null)
  // 이차식의 계수를 맨 앞 계수가 양수가 되게(풀이 글)
  const qsign = (cs) => { const f = cs.find((v) => v !== 0); return f < 0 ? cs.map((v) => z0(-v)) : cs; };
  const onePos = (roots) => { const pos = roots.filter((x) => x > 1e-9); return pos.length === 1 && Math.abs(pos[0] - Math.round(pos[0])) < 1e-9 ? Math.round(pos[0]) : null; };

  // 성분이 작은 정수인 방향벡터들(성분의 최대공약수 1)
  const VEC3 = [], VEC2 = [];
  for (const x of range(-3, 3)) for (const y of range(-3, 3)) for (const z of range(-3, 3)) if (gall([x, y, z]) === 1) VEC3.push([x, y, z]);
  for (const x of range(-6, 6)) for (const y of range(-6, 6)) if (gall([x, y]) === 1) VEC2.push([x, y]);
  // 두 벡터가 이루는 각(예각 쪽): 4(u·v)²/(|u|²|v|²) 이 0·1·2·3 이면 90°·60°·45°·30°
  const DEG = { 0: 90, 1: 60, 2: 45, 3: 30 };
  const angKey = (u, v) => { const D = dot(u, v), q = 4 * D * D, A = n2(u) * n2(v); return q % A === 0 && q / A <= 3 ? q / A : -1; };
  const ANG3 = { 0: [], 1: [], 2: [], 3: [] }, ANG2 = { 0: [], 1: [], 2: [], 3: [] };
  for (const u of VEC3) for (const v of VEC3) { const k = angKey(u, v); if (k >= 0) ANG3[k].push([u, v]); }
  for (const u of VEC2) for (const v of VEC2) { const k = angKey(u, v); if (k >= 0) ANG2[k].push([u, v]); }
  // 크기가 정수인 벡터들(성분 −9~9, 최대공약수 1, 크기 3 이상): [벡터, 크기]
  const INT3 = [];
  for (const x of range(-9, 9)) for (const y of range(-9, 9)) for (const z of range(-9, 9)) { const s = x * x + y * y + z * z; if (s >= 9 && isSq(s) && gall([x, y, z]) === 1) INT3.push([[x, y, z], Math.sqrt(s)]); }
  const pickAng = (d, table, keys, ok) => d.until(() => d.pick(table[d.pick(keys)]), ok);

  // ── 글 ──
  const X = V('x'), Y = V('y'), Z = V('z'), AX = [X, Y, Z];
  const iq = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));
  const js = (n) => (n < 0 ? `(${n})` : String(n));                         // 검사 식에 적는 수
  const tup = (p) => nb('(' + p.map(iq).join(', ') + ')');
  const ptN = (nm, p) => nb(nm + '(' + p.map(iq).join(', ') + ')');
  const vecIs = (nm, u) => nb(vec(nm) + ' = ' + tup(u));
  const numer = (v, c) => (c === 0 ? v : `${v} ${c > 0 ? MINUS : '+'} ${Math.abs(c)}`);
  const rootTx = (n) => { const [k, q] = sqParts(n); return q === 1 ? String(k) : radText(k, q); };
  const lj = (h, pair) => jh(h, pair);
  const L = (s) => ms(s);                                                    // 직선 이름 l, m, l₁
  // 직선의 대칭꼴 한 칸: 분모 u 가 1이면 분수로 쓰지 않고, −1이면 「2 − x」, flip 이면 음의 분모를 「(2 − y)/4」로 적는다.
  function termTx(v, c, u, flip) {
    if (u === 1) return numer(v, c);
    if (u === -1) return c > 0 ? `${c} ${MINUS} ${v}` : c === 0 ? MINUS + v : `${MINUS}${v} ${MINUS} ${-c}`;
    if (u < 0 && flip && c > 0) return frac(`${c} ${MINUS} ${v}`, String(-u));
    return frac(numer(v, c), iq(u));
  }
  // 점 p 를 지나고 방향벡터가 u 인 직선의 방정식(대칭꼴). 0인 성분의 좌표는 「x = 2」로 따로 적는다(한 칸만 남으면 그 칸은 적지 않는다).
  function lineTx(p, u, flip) {
    const parts = [], fixed = [];
    p.forEach((c, i) => { if (u[i] === 0) fixed.push(nb(`${AX[i]} = ${iq(c)}`)); else parts.push(nb(termTx(AX[i], c, u[i], flip && flip[i]))); });
    const body = parts.length >= 2 ? parts.join(' = ') : '';
    return body + (fixed.length ? (body ? ', ' : '') + fixed.join(', ') : '');
  }
  const flips = (d, n) => range(1, n).map(() => d.int(0, 2) === 0);
  // 분모에 미지수가 든 칸: den 은 그린 글(V('k'), 「a − 2」)
  const termH = (v, c, denH) => frac(numer(v, c), denH);
  const varPlus = (nm, c) => (c === 0 ? V(nm) : `${V(nm)} ${c > 0 ? '+' : MINUS} ${Math.abs(c)}`);
  const planeTx = (n, dd) => poly([[n[0], X], [n[1], Y], [n[2], Z], [dd, '']]) + ' = 0';
  const planeR = (n, k) => poly([[n[0], X], [n[1], Y], [n[2], Z]]) + ' = ' + iq(k);
  const sq = (v, c) => (c === 0 ? v + sup(2) : `(${numer(v, c)})${sup(2)}`);
  const sphereTx = (c, r2) => nb(sq(X, c[0])) + ' + ' + nb(sq(Y, c[1])) + ' + ' + nb(sq(Z, c[2]) + ' = ' + r2);
  // 이어 붙이는 항: [[계수, 문자 글]] → 「 − 2x + 6y − 4z + 13」
  const tailTx = (terms) => terms.filter(([k]) => k !== 0).map(([k, v]) => ` ${k < 0 ? MINUS : '+'} ${Math.abs(k) === 1 && v ? '' : Math.abs(k)}${v}`).join('');
  const sphereGen = (c, r2) => nb(`${X}${sup(2)} + ${Y}${sup(2)} + ${Z}${sup(2)}`) + tailTx([[-2 * c[0], X], [-2 * c[1], Y], [-2 * c[2], Z], [n2(c) - r2, '']]) + ' = 0';
  const COS = { 90: '0', 60: frac('1', '2'), 45: frac(rt(2), '2'), 30: frac(rt(3), '2') };
  const pq = (n) => (n < 0 ? '(' + iq(n) + ')' : String(n));             // 풀이 글의 곱셈에 적는 수
  const coefTx = (k) => (k === 1 ? '' : k === -1 ? MINUS : iq(k));
  const absS = (s, v) => (v < 0 ? `0-(${s})` : `(${s})`);                    // 값이 v 인 식 s 의 절댓값 식

  // ── 검사 식 ──
  const dotS = (a, b) => a.map((v, i) => `${js(v)}*${js(b[i])}`).join('+');
  const n2S = (a) => dotS(a, a);
  // 두 벡터가 이루는 각(예각 쪽, 30°·45°·60°·90°)을 셈하는 식: c = 4(u·v)²/(|u|²|v|²) 를 넣으면 90 − 30c + 15c(c − 1)/2 − 5c(c − 1)(c − 2)/2
  const angS = (u, v) => { const c = `(4*(${dotS(u, v)})*(${dotS(u, v)})/((${n2S(u)})*(${n2S(v)})))`; return `90-30*${c}+15*${c}*(${c}-1)/2-5*${c}*(${c}-1)*(${c}-2)/2`; };

  // ── 답 ──
  // 덧붙임 말은 두 덩이로 묶는다(통째로 묶으면 바탕체를 받기 전의 글꼴에서 휴대폰 칸보다 넓어 화면이 넘친다).
  const NOTE = ' <span style="white-space:nowrap">(단, 계수가 1이나 0이어도</span> <span style="white-space:nowrap">그 수를 적는다.)</span>';
  // 한 점과 방향벡터로 정한 직선: 분모(방향벡터)를 틀에 적고 분자의 수를 칸으로 받는다.
  function lineNumAns(text, p, u, o) {
    const tpl = p.map((c, i) => grp(u[i] === 1 ? `${AX[i]} {${i}}` : frac(`${AX[i]} {${i}}`, iq(u[i])))).join(' = ');
    return inline(text, tpl, p.map((c) => ({ answer: z0(-c), signed: true })), Object.assign({}, o, { shown: lineTx(p, u) }));
  }
  // 지나는 점(분자)과 x의 분모 s 를 틀에 적고 나머지 분모를 칸으로 받는다: 방향벡터를 (s, …)로 잡은 답.
  function lineDenAns(text, p, w, o) {
    const tpl = grp(frac(numer(X, p[0]), iq(w[0]))) + p.slice(1).map((c, i) => ' = ' + grp(frac(numer(AX[i + 1], c), `{${i}}`))).join('');
    return inline(text, tpl, w.slice(1).map((v) => ({ answer: v, signed: true })), Object.assign({}, o, { shown: lineTx(p, w) }));
  }
  // 좌표평면의 직선 ax + by + c = 0: a(> 0)는 틀에 적고 b, c 를 칸으로
  function line2Ans(text, a, b, c, o) {
    if (a <= 0) throw new Error('line2Ans: x의 계수는 양수');
    return inline(text + NOTE, `${a === 1 ? '' : a}${X} {0}${Y} {1} = 0`, [{ answer: b, signed: true }, { answer: c, signed: true }], Object.assign({}, o, { shown: poly([[a, X], [b, Y], [c, '']]) + ' = 0' }));
  }
  // 평면 ax + by + cz + d = 0: a(> 0)는 틀에 적고 b, c, d 를 칸으로
  function planeAns(text, n, dd, o) {
    if (n[0] <= 0) throw new Error('planeAns: x의 계수는 양수');
    return inline(text + NOTE, `${n[0] === 1 ? '' : n[0]}${X} {0}${Y} {1}${Z} {2} = 0`, [{ answer: n[1], signed: true }, { answer: n[2], signed: true }, { answer: dd, signed: true }], Object.assign({}, o, { shown: planeTx(n, dd) }));
  }
  // 구 (x − a)² + (y − b)² + (z − c)² = r²
  function sphereAns(text, c, r2, o) {
    const g = (v, k) => grp(`(${v} {${k}})${sup(2)}`);
    return inline(text, g(X, 0) + ' + ' + g(Y, 1) + ' + ' + grp(`(${Z} {2})${sup(2)} = {3}`), [{ answer: z0(-c[0]), signed: true }, { answer: z0(-c[1]), signed: true }, { answer: z0(-c[2]), signed: true }, { answer: r2 }], Object.assign({}, o, { shown: sphereTx(c, r2) }));
  }
  // 각의 크기(°)
  const angAns = (text, deg, expr, o) => N(text, deg, Object.assign({}, o, { unit: '°', facts: Object.assign({ calc: [[expr, 0]] }, (o && o.facts) || {}) }));
  // 문자의 값 여럿: [[문자, 값]]
  const valsAns = (text, pairs, o) => M(text, pairs.map(([nm, v]) => ({ answer: v, signed: true, lead: V(nm) + ' =' })), Object.assign({}, o, { shown: pairs.map(([nm, v]) => nb(`${V(nm)} = ${iq(v)}`)).join(', ') }));
  // 값 두 개(차례는 따지지 않는다): 「k = [±][ ] 또는 k = [±][ ]」
  function twoVals(text, nm, v1, v2, o) {
    if (v1 === v2 || v1 === -v2) throw new Error('두 값 칸: 서로 다르고 부호만 다르지 않아야 한다');
    return inline(text, grp(`${V(nm)} = {0}`) + ' 또는 ' + grp(`${V(nm)} = {1}`), [{ answer: v1, signed: true }, { answer: v2, signed: true }], Object.assign({}, o, { unordered: true, shown: `${nb(V(nm) + ' = ' + iq(v1))} 또는 ${nb(V(nm) + ' = ' + iq(v2))}` }));
  }
  // 고르기: 정답을 맨 앞에 둔 보기 목록을 섞고, 코드가 가린 참·거짓을 근거로 단다.
  function pickC(d, text, right, wrongs, o) {
    const opts = [right].concat(wrongs), order = d.shuffle(range(0, opts.length - 1));
    const options = order.map((i) => opts[i]), truth = order.map((i) => i === 0);
    return C(text, options, truth.indexOf(true), Object.assign({}, o, { facts: Object.assign({ truth, want: true }, (o && o.facts) || {}) }));
  }

  // ── 검사 근거 마무리(seal) ──
  // 검사가 하는 것을 만들 때 먼저 해 본다: 식의 값과 답, □ 식의 해, 참·거짓, 보기가 겹치지 않는가. 식의 수 가운데 글·그림 설명·보기에 보이지 않는 수는 facts.unseen 에 밝힌다.
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function shownNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  const evalS = (s) => { if (!/^[\d+\-*\/%(). ]+$/.test(s)) throw new Error('검사 식이 아니다: ' + s); return Function('"use strict"; return (' + s + ');')(); };
  function seal(item) {
    const f = item.facts || {};
    if (f.calc) f.calc = f.calc.map(([t, i]) => [`(${t})+0`, i]);
    for (const [s, i] of f.calc || []) {
      const v = evalS(s), input = item.inputs[i];
      if (v !== input.answer || !(v > 0 || input.signed)) throw new Error(`검사 식 ${s.slice(0, 90)} = ${v} 인데 답은 ${input.answer}`);
    }
    if (f.value !== undefined) {
      const v = item.inputs.map((x) => x.answer), size = item.fraction ? v[v.length - 2] / v[v.length - 1] : v[0], got = item.negative ? -size : size;
      if (Math.abs(got - evalS(f.value)) > 1e-9) throw new Error(`value ${f.value} = ${evalS(f.value)} 인데 답은 ${got}`);
    }
    if (f.digit) {
      const { template, lo, hi, ask } = f.digit, ok = [];
      for (let x = lo; x <= hi; x += 1) {
        const parts = template.replace(/□/g, String(x)).split(/([<>])/); let good = true;
        for (let i = 1; i < parts.length; i += 2) { const l = evalS(parts[i - 1]), r = evalS(parts[i + 1]); if (!(parts[i] === '<' ? l < r : l > r)) good = false; }
        if (good) ok.push(x);
      }
      const want = ask === 'count' ? ok.length : ask === 'max' ? ok[ok.length - 1] : ok[0];
      if (!ok.length || ok.length > hi - lo || want !== item.inputs[0].answer) throw new Error('□ 식을 만족하는 수: ' + ok.join(',') + ' / 답 ' + item.inputs[0].answer);
    }
    if (f.truth && (f.truth.filter((t) => t === f.want).length !== 1 || f.truth[item.choice.answer] !== f.want)) throw new Error('참·거짓 근거가 답과 다르다');
    if (item.choice && new Set(item.choice.options.map(stripH)).size !== item.choice.options.length) throw new Error('보기가 겹친다: ' + item.choice.options.map(stripH).join(' | '));
    if (!item.choice) for (const input of item.inputs) if (!Number.isInteger(input.answer) || Math.abs(input.answer) > 9999) throw new Error('답이 9999 이하의 정수가 아니다: ' + input.answer);
    const shown = shownNumbers(item), hidden = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([s]) => s).concat(f.value !== undefined ? [f.value] : []);
    for (const s of exprs) for (const n of s.match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) hidden.add(Number(n));
    if (hidden.size) f.unseen = [...hidden]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: (d, n) => seal(make(d, n)) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 기본 자료(' + ref + ')', make: (d, n) => seal(make(d, n)) }, more || {});

  // 풀이에 쓰는 글
  const FORM2 = `${frac(ms('x - x_1'), ms('u_1'))} = ${frac(ms('y - y_1'), ms('u_2'))}`;
  const FORM3 = `${FORM2} = ${frac(ms('z - z_1'), ms('u_3'))}`;
  const cosLine = (u, v) => `${trig('cos', 'θ')} = ${frac('|' + vec('u') + ' · ' + vec('v') + '|', '|' + vec('u') + '||' + vec('v') + '|')} = ${frac(String(Math.abs(dot(u, v))), rootTx(n2(u) * n2(v)))}`;
  const dirOf = (nm, p, u, f) => `직선 ${L(nm)}의 방향벡터는 ${vecIs(nm === 'm' ? 'v' : 'u', u)}`;

  // ── 가. 직선의 방정식 ──
  const lineTypes = [
    T('line-pd2', '좌표평면 — 한 점과 방향벡터로 직선의 방정식', '①1', (d) => {
      const p = [nz(d, -6, 6), nz(d, -6, 6)];
      const u = d.until(() => [d.pick([-5, -4, -3, -2, 2, 3, 4, 5]), d.pick([-5, -4, -3, -2, 1, 2, 3, 4, 5])], (w) => gcd(w[0], w[1]) === 1);
      return lineNumAns(`좌표평면에서 점 ${lj(tup(p), '을/를')} 지나고 방향벡터가 ${vecIs('u', u)}인 직선의 방정식을 구하시오.`, p, u, {
        explain: `점 ${lj(ms('(x_1, y_1)'), '을/를')} 지나고 방향벡터가 ${ms('(u_1, u_2)')}인 직선의 방정식은 ${FORM2}이다. 따라서 ${lineTx(p, u)}이다.`,
        facts: { calc: p.map((c, i) => [`0-${js(c)}`, i]) }
      });
    }),
    T('line-pd3', '좌표공간 — 한 점과 방향벡터로 직선의 방정식', '①1', (d) => {
      const p = [nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6)];
      const u = d.until(() => [d.pick([-4, -3, -2, 2, 3, 4]), d.pick([-4, -3, -2, 1, 2, 3, 4]), d.pick([-4, -3, -2, 1, 2, 3, 4])], (w) => gall(w) === 1);
      return lineNumAns(`좌표공간에서 점 ${lj(tup(p), '을/를')} 지나고 방향벡터가 ${vecIs('u', u)}인 직선의 방정식을 구하시오.`, p, u, {
        explain: `점 ${lj(ms('(x_1, y_1, z_1)'), '을/를')} 지나고 방향벡터가 ${ms('(u_1, u_2, u_3)')}인 직선의 방정식은 ${FORM3}이다. 따라서 ${lineTx(p, u)}이다.`,
        facts: { calc: p.map((c, i) => [`0-${js(c)}`, i]) }
      });
    }),
    T('line-zero', '방향벡터에 0인 성분이 있는 직선의 방정식 고르기', '①2', (d, n) => {
      if (n === 0) {
        const p = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], (q) => q[0] !== q[1]), k = d.pick([-4, -3, -2, 2, 3, 4]), zi = d.int(0, 1), u = zi === 1 ? [k, 0] : [0, k];
        const right = nb(`${AX[zi]} = ${iq(p[zi])}`), other = nb(`${AX[1 - zi]} = ${iq(p[1 - zi])}`);
        const zeroDen = (zi === 1 ? nb(frac(numer(X, p[0]), iq(k))) + ' = ' + nb(frac(numer(Y, p[1]), '0')) : nb(frac(numer(X, p[0]), '0')) + ' = ' + nb(frac(numer(Y, p[1]), iq(k))));
        const wrongK = k === p[zi] ? nb(`${AX[zi]} = 0`) : nb(`${AX[zi]} = ${iq(k)}`);
        return pickC(d, `좌표평면에서 점 ${lj(tup(p), '을/를')} 지나고 방향벡터가 ${vecIs('u', u)}인 직선의 방정식으로 옳은 것은?`, right, [other, zeroDen, wrongK], {
          explain: `방향벡터의 ${zi === 1 ? 'y' : 'x'}성분이 0이므로 직선 위의 모든 점의 ${zi === 1 ? 'y' : 'x'}좌표가 ${lj(iq(p[zi]), '으로/로')} 같다(분모에 0을 쓸 수 없다). 따라서 ${right}이다.`,
          facts: { rule: 'zero2' }
        });
      }
      const p = d.until(() => [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)], distinct);
      if (n === 1) {
        const zi = d.int(0, 2), u = range(0, 2).map((i) => (i === zi ? 0 : d.pick([-4, -3, -2, 2, 3, 4])));
        const others = [0, 1, 2].filter((i) => i !== zi), two = others.map((i) => nb(termTx(AX[i], p[i], u[i]))).join(' = ');
        const right = lineTx(p, u), zeroFix = `${two}, ${nb(`${AX[zi]} = 0`)}`, noFix = two;
        const zeroDen = range(0, 2).map((i) => nb(i === zi ? frac(numer(AX[i], p[i]), '0') : termTx(AX[i], p[i], u[i]))).join(' = ');
        return pickC(d, `좌표공간에서 점 ${lj(tup(p), '을/를')} 지나고 방향벡터가 ${vecIs('u', u)}인 직선의 방정식으로 옳은 것은?`, right, [zeroFix, noFix, zeroDen], {
          explain: `방향벡터의 ${'xyz'[zi]}성분이 0이므로 직선 위의 점의 ${'xyz'[zi]}좌표는 늘 ${iq(p[zi])}이다. 나머지 두 성분으로 대칭꼴을 쓰고 ${lj(nb(`${AX[zi]} = ${iq(p[zi])}`), '을/를')} 함께 적는다. 따라서 ${right}이다.`,
          facts: { rule: 'zero3a' }
        });
      }
      const wi = d.int(0, 2), u = range(0, 2).map((i) => (i === wi ? d.pick([-4, -3, -2, 2, 3, 4]) : 0)), others = [0, 1, 2].filter((i) => i !== wi);
      const right = lineTx(p, u), justW = nb(`${AX[wi]} = ${iq(p[wi])}`), pointOnly = range(0, 2).map((i) => nb(`${AX[i]} = ${iq(p[i])}`)).join(', '), zeros = others.map((i) => nb(`${AX[i]} = 0`)).join(', ');
      return pickC(d, `좌표공간에서 점 ${lj(tup(p), '을/를')} 지나고 방향벡터가 ${vecIs('u', u)}인 직선의 방정식으로 옳은 것은?`, right, [justW, pointOnly, zeros], {
        explain: `방향벡터의 ${others.map((i) => 'xyz'[i]).join(', ')}성분이 0이므로 직선 위의 점은 ${lj(others.map((i) => 'xyz'[i] + '좌표가 ' + iq(p[i])).join(', '), '으로/로')} 일정하고 ${'xyz'[wi]}좌표만 바뀐다(${'xyz'[wi]}축에 평행한 직선). 따라서 ${right}이다.`,
        facts: { rule: 'zero3b' }
      });
    }, { count: 3 }),
    T('line-2p2', '좌표평면 — 두 점을 지나는 직선의 방정식', '①3', (d) => {
      const A = [nz(d, -6, 6), nz(d, -6, 6)], w = [d.pick([-5, -4, -3, -2, 2, 3, 4, 5]), nz(d, -8, 8)], Bp = add(A, w), lam = sgn(d), sw = mul(lam, w);
      return lineDenAns(`좌표평면에서 두 점 ${ptN('A', A)}, ${lj(ptN('B', Bp), '을/를')} 지나는 직선의 방정식을 구하시오.`, A, sw, {
        explain: `${vec('AB')} = ${lj(tup(w), '이/가')} 방향벡터이다. x의 분모를 ${lj(iq(sw[0]), '으로/로')} 맞추면 ${tup(sw)}도 방향벡터이므로 구하는 직선은 ${lineTx(A, sw)}이다.`,
        facts: { calc: [[`(${js(Bp[1])}-${js(A[1])})*${js(sw[0])}/(${js(Bp[0])}-${js(A[0])})`, 0]] }
      });
    }),
    T('line-2p3', '좌표공간 — 두 점을 지나는 직선의 방정식', '①3', (d) => {
      const A = [nz(d, -5, 5), nz(d, -5, 5), d.int(-5, 5)], w = [d.pick([-4, -3, -2, 2, 3, 4]), nz(d, -6, 6), nz(d, -6, 6)], Bp = add(A, w), lam = sgn(d), sw = mul(lam, w);
      return lineDenAns(`두 점 ${ptN('A', A)}, ${lj(ptN('B', Bp), '을/를')} 지나는 직선의 방정식을 구하시오.`, A, sw, {
        explain: `${vec('AB')} = ${lj(tup(w), '이/가')} 방향벡터이다. x의 분모를 ${lj(iq(sw[0]), '으로/로')} 맞추면 ${tup(sw)}도 방향벡터이므로 구하는 직선은 ${lineTx(A, sw)}이다.`,
        facts: { calc: [1, 2].map((i) => [`(${js(Bp[i])}-${js(A[i])})*${js(sw[0])}/(${js(Bp[0])}-${js(A[0])})`, i - 1]) }
      });
    }),
    T('line-2p-axis', '두 점을 지나는 직선 — 좌표축에 평행한 경우 고르기', '①3', (d, n) => {
      if (n === 0) {
        const a = nz(d, -6, 6), [b1, b2] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([s, t]) => s !== t && s !== a && t !== a && s !== -a && t !== -a);
        const right = nb(`${X} = ${iq(a)}`), wrongs = [nb(`${Y} = ${iq(b1)}`), nb(`${Y} = ${iq(a)}`), nb(`${X} = ${iq(b2)}`)];
        return pickC(d, `좌표평면에서 두 점 ${ptN('A', [a, b1])}, ${lj(ptN('B', [a, b2]), '을/를')} 지나는 직선의 방정식으로 옳은 것은?`, right, wrongs, {
          explain: `${vec('AB')} = ${tup([0, b2 - b1])}에서 x성분이 0이므로 직선 위의 점의 x좌표는 늘 ${iq(a)}이다. 따라서 ${right}이다.`,
          facts: { rule: 'axis2' }
        });
      }
      const [a, b] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([s, t]) => s !== t), [c1, c2] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([s, t]) => s !== t && s !== a && s !== b);
      const right = `${nb(`${X} = ${iq(a)}`)}, ${nb(`${Y} = ${iq(b)}`)}`;
      const wrongs = [nb(`${Z} = ${iq(c1)}`), `${nb(`${X} = ${iq(a)}`)}, ${nb(`${Y} = ${iq(b)}`)}, ${nb(`${Z} = ${iq(c1)}`)}`, `${nb(frac(numer(X, a), '0'))} = ${nb(frac(numer(Y, b), '0'))} = ${nb(termTx(Z, c1, c2 - c1))}`];
      return pickC(d, `두 점 ${ptN('A', [a, b, c1])}, ${lj(ptN('B', [a, b, c2]), '을/를')} 지나는 직선의 방정식으로 옳은 것은?`, right, wrongs, {
        explain: `${vec('AB')} = ${tup([0, 0, c2 - c1])}에서 x성분과 y성분이 0이므로 직선 위의 점은 x좌표가 ${iq(a)}, y좌표가 ${lj(iq(b), '으로/로')} 일정하다(z축에 평행한 직선). 따라서 ${right}이다.`,
        facts: { rule: 'axis3' }
      });
    }, { count: 2 }),
    T('line-on2', '좌표평면 — 직선이 지나는 점의 미지수', '①4', (d) => {
      const p = [nz(d, -5, 5), nz(d, -5, 5)], u = d.until(() => [d.pick([-4, -3, -2, 2, 3, 4]), nz(d, -5, 5)], (w) => gcd(w[0], w[1]) === 1), t = nz(d, -3, 3), q = add(p, mul(t, u));
      return N(`좌표평면에서 점 ${lj(tup(p), '을/를')} 지나고 방향벡터가 ${vecIs('u', u)}인 직선이 점 ${lj(nb(`(${iq(q[0])}, ${V('a')})`), '을/를')} 지날 때, 상수 ${V('a')}의 값은?`, q[1], {
        signed: true,
        explain: `직선 ${lineTx(p, u)}에 ${lj(nb(`${X} = ${iq(q[0])}`), '을/를')} 넣으면 ${frac(`${iq(q[0])} ${p[0] > 0 ? MINUS : '+'} ${Math.abs(p[0])}`, iq(u[0]))} = ${iq(t)}이므로 ${nb(`${V('a')} = ${iq(p[1])} + ${pq(u[1])} × ${pq(t)} = ${iq(q[1])}`)}이다.`,
        facts: { calc: [[`${js(p[1])}+${js(u[1])}*(${js(q[0])}-${js(p[0])})/${js(u[0])}`, 0]] }
      });
    }),
    T('line-on3', '좌표공간 — 직선이 지나는 점의 미지수', '①4', (d) => {
      const p = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)], u = d.until(() => [d.pick([-4, -3, -2, 2, 3, 4]), nz(d, -4, 4), nz(d, -4, 4)], (w) => gall(w) === 1), t = nz(d, -3, 3), q = add(p, mul(t, u));
      return valsAns(`점 ${lj(tup(p), '을/를')} 지나고 방향벡터가 ${vecIs('u', u)}인 직선이 점 ${lj(nb(`(${iq(q[0])}, ${V('a')}, ${V('b')})`), '을/를')} 지날 때, 상수 ${V('a')}, ${V('b')}의 값은?`, [['a', q[1]], ['b', q[2]]], {
        explain: `직선 ${lineTx(p, u)}에 ${lj(nb(`${X} = ${iq(q[0])}`), '을/를')} 넣은 값은 ${iq(t)}이다. 그러므로 ${nb(`${V('a')} = ${iq(p[1])} + ${pq(u[1])} × ${pq(t)} = ${iq(q[1])}`)}, ${nb(`${V('b')} = ${iq(p[2])} + ${pq(u[2])} × ${pq(t)} = ${iq(q[2])}`)}이다.`,
        facts: { calc: [1, 2].map((i) => [`${js(p[i])}+${js(u[i])}*(${js(q[0])}-${js(p[0])})/${js(u[0])}`, i - 1]) }
      });
    }),
    T('line-par2', '좌표평면 — 다른 직선에 평행한 직선이 지나는 점', '①5', (d) => {
      const p = [nz(d, -5, 5), nz(d, -5, 5)], w = d.until(() => [d.pick([1, 2, 3, -2, -3]), d.pick([-5, -4, -3, -2, 2, 3, 4, 5])], (v) => gcd(v[0], v[1]) === 1), g = [nz(d, -5, 5), nz(d, -5, 5)];
      const t = nz(d, -3, 3), q = add(p, mul(t, w)), fl = [false, true];
      return N(`좌표평면에서 점 ${lj(tup(p), '을/를')} 지나고 직선 ${lineTx(g, w, fl)}에 평행한 직선이 점 ${lj(nb(`(${V('k')}, ${iq(q[1])})`), '을/를')} 지날 때, 상수 ${V('k')}의 값은?`, q[0], {
        signed: true,
        explain: `주어진 직선의 방향벡터는 ${tup(w)}이므로 구하는 직선은 ${lineTx(p, w)}이다. ${lj(nb(`${Y} = ${iq(q[1])}`), '을/를')} 넣은 값이 ${iq(t)}이므로 ${nb(`${V('k')} = ${iq(p[0])} + ${pq(w[0])} × ${pq(t)} = ${iq(q[0])}`)}이다.`,
        facts: { calc: [[`${js(p[0])}+${js(w[0])}*(${js(q[1])}-${js(p[1])})/${js(w[1])}`, 0]] }
      });
    }),
    T('line-par3', '좌표공간 — 다른 직선에 평행한 직선이 지나는 점', '①5', (d) => {
      const p = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)], w = d.until(() => [d.pick([-3, -2, 2, 3, 4]), nz(d, -4, 4), nz(d, -4, 4)], (v) => gall(v) === 1), g = [nz(d, -5, 5), nz(d, -5, 5), nz(d, -5, 5)];
      const t = nz(d, -3, 3), q = add(p, mul(t, w));
      return valsAns(`점 ${lj(tup(p), '을/를')} 지나고 직선 ${lineTx(g, w, flips(d, 3))}에 평행한 직선이 점 ${lj(nb(`(${iq(q[0])}, ${V('a')}, ${V('b')})`), '을/를')} 지날 때, 상수 ${V('a')}, ${V('b')}의 값은?`, [['a', q[1]], ['b', q[2]]], {
        explain: `주어진 직선의 방향벡터 ${lj(tup(w), '을/를')} 그대로 쓰면 구하는 직선은 ${lineTx(p, w)}이다. ${lj(nb(`${X} = ${iq(q[0])}`), '을/를')} 넣은 값이 ${iq(t)}이므로 ${nb(`${V('a')} = ${iq(q[1])}`)}, ${nb(`${V('b')} = ${iq(q[2])}`)}이다.`,
        facts: { calc: [1, 2].map((i) => [`${js(p[i])}+${js(w[i])}*(${js(q[0])}-${js(p[0])})/${js(w[0])}`, i - 1]) }
      });
    }),
    T('line-rel', '두 직선이 일치하는가 — 한 점과 방향벡터로 위치 관계 고르기', '①6 ①13', (d, n) => {
      const u = d.until(() => [d.pick([-3, -2, 1, 2, 3]), d.pick([-3, -2, 1, 2, 3]), d.pick([-3, -2, 2, 3])], (w) => gall(w) === 1);
      const p = [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], k = d.pick([-2, -1, 2]), s = nz(d, -2, 2);
      let q = add(p, mul(s, u));
      if (n === 1) q = d.until(() => add(q, [d.int(-2, 2), d.int(-2, 2), d.int(-2, 2)]), (r) => !parallel(sub(r, p), u) && allNZ(r));
      const v = mul(k, u), same = parallel(sub(q, p), u);
      const opts = ['일치한다.', '서로 평행하다(일치하지 않는다).', '수직으로 만난다.', '꼬인 위치에 있다.'];
      const right = same ? opts[0] : opts[1], wrongs = opts.filter((o) => o !== right);
      return pickC(d, `좌표공간에서 두 직선 ${L('l')}: ${lineTx(p, u, flips(d, 3))}, ${L('m')}: ${lineTx(q, v, flips(d, 3))}의 위치 관계로 옳은 것은?`, right, wrongs, {
        explain: `두 방향벡터 ${tup(u)}, ${lj(tup(v), '은/는')} ${vec('v')} = ${coefTx(k)}${lj(vec('u'), '으로/로')} 서로 평행하다. 직선 ${L('m')} 위의 점 ${lj(tup(q), '이/가')} 직선 ${L('l')}의 식을 ${same ? '만족시키므로 두 직선은 일치한다' : '만족시키지 않으므로 두 직선은 일치하지 않고 평행하다'}.`,
        facts: { rule: same ? 'same' : 'par' }
      });
    }, { count: 2 }),
    T('line-normal2', '좌표평면 — 한 점과 법선벡터로 직선의 방정식', '①8', (d, n) => {
      const A = [nz(d, -5, 5), nz(d, -5, 5)], nv = d.until(() => [d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), d.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5])], (w) => gcd(w[0], w[1]) === 1);
      const sg = nv[0] < 0 ? -1 : 1, a = sg * nv[0], b = sg * nv[1], c = z0(-sg * dot(nv, A));
      const cS = `0-(${dotS(nv, A)})*${sg}`;
      if (n === 0) {
        return line2Ans(`좌표평면에서 점 ${lj(tup(A), '을/를')} 지나고 벡터 ${vecIs('n', nv)}에 수직인 직선의 방정식을 구하시오.`, a, b, c, {
          explain: `직선 위의 점 ${ms('P(x, y)')}에 대하여 ${vec('AP')} · ${vec('n')} = 0이므로 ${nb(`${iq(nv[0])}(${numer(X, A[0])})`)} ${nv[1] < 0 ? MINUS : '+'} ${nb(`${Math.abs(nv[1])}(${numer(Y, A[1])}) = 0`)}, 곧 ${poly([[a, X], [b, Y], [c, '']])} = 0이다.`,
          facts: { calc: [[`${js(nv[1])}*${sg}`, 0], [cS, 1]] }
        });
      }
      const g = [nz(d, -4, 4), nz(d, -4, 4)];
      return line2Ans(`좌표평면에서 점 ${lj(tup(A), '을/를')} 지나고 직선 ${lineTx(g, nv, [false, true])}에 수직인 직선의 방정식을 구하시오.`, a, b, c, {
        explain: `주어진 직선의 방향벡터 ${lj(tup(nv), '이/가')} 구하는 직선에 수직이므로 ${lj(tup(nv), '을/를')} 법선으로 쓴다. ${nb(`${iq(nv[0])}(${numer(X, A[0])})`)} ${nv[1] < 0 ? MINUS : '+'} ${nb(`${Math.abs(nv[1])}(${numer(Y, A[1])}) = 0`)}, 곧 ${poly([[a, X], [b, Y], [c, '']])} = 0이다.`,
        facts: { calc: [[`${js(nv[1])}*${sg}`, 0], [cS, 1]] }
      });
    }, { count: 2 })
  ];

  // ── 나. 두 직선이 이루는 각과 위치 관계 ──
  const angleTypes = [
    T('ang2', '좌표평면 — 두 직선이 이루는 각의 크기', '①9', (d) => {
      const [u, v] = pickAng(d, ANG2, [0, 2, 2], ([a, b]) => allNZ(a) && allNZ(b) && Math.max(...a.map(Math.abs), ...b.map(Math.abs)) <= 5), deg = DEG[angKey(u, v)];
      const p = [nz(d, -4, 4), nz(d, -4, 4)], q = [nz(d, -4, 4), nz(d, -4, 4)];
      return angAns(`좌표평면에서 두 직선 ${L('l')}: ${lineTx(p, u, flips(d, 2))}, ${L('m')}: ${lj(lineTx(q, v, flips(d, 2)), '이/가')} 이루는 각의 크기는?`, deg, angS(u, v), {
        explain: `방향벡터 ${vecIs('u', u)}, ${vecIs('v', v)}에서 ${cosLine(u, v)} = ${COS[deg]}이므로 두 직선이 이루는 각의 크기는 ${deg}°이다.`
      });
    }),
    T('ang2-cos', '좌표평면 — 두 직선이 이루는 각의 cos 값', '①9', (d) => {
      const cand = d.until(() => [d.pick(VEC2), d.pick(VEC2)], ([u, v]) => allNZ(u) && allNZ(v) && Math.max(...u.map(Math.abs), ...v.map(Math.abs)) <= 5 && (() => {
        const D = Math.abs(dot(u, v)); if (!D) return false; const [s, t] = sqParts(n2(u) * n2(v)); if (t === 1) return false; const h = gcd(D, s * t); return D / h === 1 && s * t / h >= 2;
      })());
      const [u, v] = cand, D = Math.abs(dot(u, v)), [s, t] = sqParts(n2(u) * n2(v)), c = s * t / gcd(D, s * t);
      const p = [nz(d, -4, 4), nz(d, -4, 4)], q = [nz(d, -4, 4), nz(d, -4, 4)];
      return inline(`좌표평면에서 두 직선 ${L('l')}: ${lineTx(p, u, flips(d, 2))}, ${L('m')}: ${lj(lineTx(q, v, flips(d, 2)), '이/가')} 이루는 각의 크기를 ${V('θ')}라고 할 때, ${trig('cos', 'θ')}의 값은?`, frac(rt('{0}'), '{1}'), [{ answer: t }, { answer: c }], {
        shown: frac(rt(t), String(c)),
        explain: `방향벡터 ${vecIs('u', u)}, ${vecIs('v', v)}에서 ${cosLine(u, v)} = ${frac(rt(t), String(c))}이다.`,
        facts: { calc: [[`(${dotS(u, v)})*(${dotS(u, v)})*${c}*${c}/((${n2S(u)})*(${n2S(v)}))`, 0], [String(c), 1]] }
      });
    }),
    T('ang-slope', '기울기 꼴로 준 두 직선이 이루는 각의 cos 값(방향벡터로)', '①10', (d) => {
      const [m1, m2] = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], ([a, b]) => {
        const D = Math.abs(1 + a * b); if (a === b || !D) return false; const [s, t] = sqParts((1 + a * a) * (1 + b * b)); if (t === 1) return false; const h = gcd(D, s * t); return D / h >= 2 && s * t / h >= 2;
      });
      const D = Math.abs(1 + m1 * m2), [s, t] = sqParts((1 + m1 * m1) * (1 + m2 * m2)), h = gcd(D, s * t), a = D / h, c = s * t / h, n1 = nz(d, -5, 5), n2v = nz(d, -5, 5);
      const yl = (m, k) => nb(`${Y} = ${poly([[m, X], [k, '']])}`);
      return inline(`좌표평면에서 두 직선 ${L('l')}: ${yl(m1, n1)}, ${L('m')}: ${lj(yl(m2, n2v), '이/가')} 이루는 각의 크기를 ${V('θ')}라고 할 때, 두 직선의 방향벡터를 이용하여 구한 ${trig('cos', 'θ')}의 값은?`, frac(`{0}${rt('{1}')}`, '{2}'), [{ answer: a }, { answer: t }, { answer: c }], {
        shown: frac(`${a}${rt(t)}`, String(c)),
        explain: `기울기가 ${ms('m')}인 직선의 방향벡터는 ${ms('(1, m)')}이다. ${vecIs('u', [1, m1])}, ${vecIs('v', [1, m2])}에서 ${cosLine([1, m1], [1, m2])} = ${frac(`${a}${rt(t)}`, String(c))}이다.`,
        facts: { calc: [[String(a), 0], [`(1+${js(m1)}*${js(m2)})*(1+${js(m1)}*${js(m2)})*${c}*${c}/((1+${js(m1)}*${js(m1)})*(1+${js(m2)}*${js(m2)})*${a}*${a})`, 1], [String(c), 2]] }
      });
    }),
    T('ang3', '좌표공간 — 두 직선이 이루는 각의 크기', '①11', (d) => {
      const [u, v] = pickAng(d, ANG3, [1, 1, 2, 3], ([a, b]) => nz2(a) && nz2(b) && (allNZ(a) || allNZ(b))), deg = DEG[angKey(u, v)];
      const p = [d.int(-4, 4), d.int(-4, 4), d.int(-4, 4)], q = [d.int(-4, 4), d.int(-4, 4), d.int(-4, 4)];
      return angAns(`좌표공간에서 두 직선 ${L('l')}: ${lineTx(p, u, flips(d, 3))}, ${L('m')}: ${lj(lineTx(q, v, flips(d, 3)), '이/가')} 이루는 각의 크기는?`, deg, angS(u, v), {
        explain: `방향벡터 ${vecIs('u', u)}, ${vecIs('v', v)}에서 ${cosLine(u, v)} = ${COS[deg]}이므로 두 직선이 이루는 각의 크기는 ${deg}°이다.`
      });
    }),
    T('ang3-2p', '두 점을 지나는 직선과 다른 직선이 이루는 각의 크기', '①11', (d) => {
      const [u, v] = pickAng(d, ANG3, [1, 1, 2, 3], ([a, b]) => nz2(a) && nz2(b)), deg = DEG[angKey(u, v)];
      const A = [d.int(-4, 4), d.int(-4, 4), d.int(-4, 4)], k = d.pick([1, 2, -1]), Bp = add(A, mul(k, u)), q = [d.int(-4, 4), d.int(-4, 4), d.int(-4, 4)], w = sub(Bp, A);
      return angAns(`두 점 ${ptN('A', A)}, ${lj(ptN('B', Bp), '을/를')} 지나는 직선과 직선 ${lj(lineTx(q, v, flips(d, 3)), '이/가')} 이루는 각의 크기는?`, deg, angS(w, v), {
        explain: `직선 AB의 방향벡터는 ${vec('AB')} = ${tup(w)}, 다른 직선의 방향벡터는 ${tup(v)}이다. ${trig('cos', 'θ')} = ${frac(String(Math.abs(dot(w, v))), rootTx(n2(w) * n2(v)))} = ${COS[deg]}이므로 ${deg}°이다.`
      });
    }),
    T('ang-find3', '두 직선이 이루는 각이 60°일 때 미지수(좌표공간)', '①12', (d) => {
      const PAIRS = [[1, 1], [1, -1], [-1, 1], [-1, -1], [1, 2], [2, 1], [-1, 2], [2, -1], [1, -2], [-2, 1], [-1, -2], [-2, -1]];
      const pk = d.until(() => {
        const [a1, b1] = d.pick(PAIRS), mates = PAIRS.filter(([x, y]) => x * x + y * y === a1 * a1 + b1 * b1), [a2, b2] = d.pick(mates), s = a1 * a1 + b1 * b1, m = a1 + a2, c = b1 * b2;
        const roots = [1, -1].flatMap((sg) => realRoots(1, -2 * sg * m, s - 2 * sg * c).filter((k) => Math.abs(k) > 1e-9 && sg * (m * k + c) > 1e-9));
        return { a1, b1, a2, b2, s, m, c, roots };
      }, (o) => onePos(o.roots) !== null && o.roots.length >= 2);
      const k = onePos(pk.roots), p = [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], q = [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], vk = V('k');
      const lt = [nb(termTx(X, p[0], pk.a1)), nb(termH(Y, p[1], vk)), nb(termTx(Z, p[2], pk.b1))].join(' = '), mt = [nb(termH(X, q[0], vk)), nb(termTx(Y, q[1], pk.a2)), nb(termTx(Z, q[2], pk.b2))].join(' = ');
      return N(`두 직선 ${L('l')}: ${lt}, ${L('m')}: ${lj(mt, '이/가')} 이루는 각의 크기가 60°일 때, 상수 ${vk}의 값은? (단, ${nb(`${vk} &gt; 0`)})`, k, {
        signed: true,
        explain: `방향벡터 ${nb(`(${iq(pk.a1)}, ${vk}, ${iq(pk.b1)})`)}, ${nb(`(${vk}, ${iq(pk.a2)}, ${iq(pk.b2)})`)}에서 ${trig('cos', '60°')} = ${frac(`|${poly([[pk.m, vk], [pk.c, '']])}|`, `${vk}${sup(2)} + ${iq(pk.s)}`)} = ${frac('1', '2')}이다. ${lj(nb(`${vk}${sup(2)} + ${iq(pk.s)} = 2|${poly([[pk.m, vk], [pk.c, '']])}|`), '을/를')} ${nb(poly([[pk.m, V('k')], [pk.c, '']]))}의 부호에 따라 나누어 풀면 양수인 해는 ${nb(`${vk} = ${k}`)}뿐이다.`,
        facts: { digit: { template: `-1<(□*□+${pk.s})*(□*□+${pk.s})-4*(${js(pk.m)}*□+${js(pk.c)})*(${js(pk.m)}*□+${js(pk.c)})<1`, lo: 1, hi: 30, ask: 'min' } }
      });
    }),
    T('ang-find2', '두 직선이 이루는 각이 45°일 때 미지수(좌표평면)', '①12', (d) => {
      const pk = d.until(() => {
        const a = d.pick([-3, -2, -1, 1, 2, 3]), b = nz(d, -4, 4), c = nz(d, -4, 4), S = b * b + c * c;
        const roots = realRoots(2 * b * b - S, 4 * a * b * c, 2 * a * a * c * c - S * a * a).filter((k) => Math.abs(k) > 1e-9);
        return { a, b, c, S, roots };
      }, (o) => onePos(o.roots) !== null && gcd(o.b, o.c) === 1);
      const k = onePos(pk.roots), p = [nz(d, -4, 4), nz(d, -4, 4)], q = [nz(d, -4, 4), nz(d, -4, 4)], vk = V('k');
      const lt = [nb(termH(X, p[0], vk)), nb(termTx(Y, p[1], pk.a))].join(' = ');
      return N(`좌표평면에서 두 직선 ${L('l')}: ${lt}, ${L('m')}: ${lj(lineTx(q, [pk.b, pk.c], flips(d, 2)), '이/가')} 이루는 각의 크기가 45°일 때, 상수 ${vk}의 값은? (단, ${nb(`${vk} &gt; 0`)})`, k, {
        signed: true,
        explain: `방향벡터 ${nb(`(${vk}, ${iq(pk.a)})`)}, ${tup([pk.b, pk.c])}에서 ${frac(`|${poly([[pk.b, vk], [pk.a * pk.c, '']])}|`, rt(`${vk}${sup(2)} + ${pk.a * pk.a}`) + rt(pk.S))} = ${COS[45]}이다. 양변을 제곱하여 정리하면 ${nb(`${poly(qsign([2 * pk.b * pk.b - pk.S, 4 * pk.a * pk.b * pk.c, 2 * pk.a * pk.a * pk.c * pk.c - pk.S * pk.a * pk.a]).map((v, i) => [v, [vk + sup(2), vk, ''][i]]))} = 0`)}이고, 이 방정식의 양수인 해는 ${nb(`${vk} = ${k}`)}이다.`,
        facts: { digit: { template: `-1<2*(${js(pk.b)}*□+${js(pk.a * pk.c)})*(${js(pk.b)}*□+${js(pk.a * pk.c)})-(□*□+${pk.a * pk.a})*(${pk.S})<1`, lo: 1, hi: 30, ask: 'min' } }
      });
    }),
    T('par2', '좌표평면 — 두 직선이 평행할 때 미지수', '①13', (d) => {
      const va = V('a'), p = [nz(d, -4, 4), nz(d, -4, 4)];
      let q;
      if (d.bool()) {
        const pk = d.until(() => { const u = [nz(d, -6, 6), nz(d, -6, 6)], c = nz(d, -8, 8); return { u, c }; }, ({ u, c }) => gcd(u[0], u[1]) === 1 && u[1] !== u[0] && (c * u[0]) % (u[1] - u[0]) === 0 && (c * u[0]) / (u[1] - u[0]) !== 0 && (c * u[0]) / (u[1] - u[0]) + c !== 0);
        const a = (pk.c * pk.u[0]) / (pk.u[1] - pk.u[0]), den2 = varPlus('a', pk.c);
        q = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], (r) => !parallel(sub(r, p), pk.u));
        return N(`좌표평면에서 두 직선 ${lineTx(p, pk.u)}, ${nb(termH(X, q[0], va))} = ${lj(nb(termH(Y, q[1], den2)), '이/가')} 서로 평행할 때, 상수 ${va}의 값은? (단, ${nb(`${va}(${den2}) ≠ 0`)})`, a, {
          signed: true,
          explain: `방향벡터 ${tup(pk.u)}, ${lj(nb(`(${va}, ${den2})`), '이/가')} 평행하므로 ${nb(`${frac(va, iq(pk.u[0]))} = ${frac(den2, iq(pk.u[1]))}`)}, 곧 ${nb(`${coefTx(pk.u[1])}${va} = ${coefTx(pk.u[0])}(${den2})`)}에서 ${nb(`${va} = ${iq(a)}`)}이다.`,
          facts: { calc: [[`${js(pk.c)}*${js(pk.u[0])}/(${js(pk.u[1])}-${js(pk.u[0])})`, 0]], rule: 'parA' }
        });
      }
      const pk = d.until(() => ({ u: [nz(d, -6, 6), nz(d, -6, 6)], be: d.pick([-3, -2, 1, 2, 3]) }), ({ u, be }) => gcd(u[0], u[1]) === 1 && (be * u[0]) % u[1] === 0 && Math.abs(u[1]) >= 2);
      const a = (pk.be * pk.u[0]) / pk.u[1];
      q = d.until(() => [nz(d, -4, 4), nz(d, -4, 4)], (r) => !parallel(sub(r, p), pk.u));
      return N(`좌표평면에서 두 직선 ${lineTx(p, pk.u)}, ${nb(termH(X, q[0], va))} = ${lj(nb(termTx(Y, q[1], pk.be)), '이/가')} 서로 평행할 때, 상수 ${va}의 값은? (단, ${nb(`${va} ≠ 0`)})`, a, {
        signed: true,
        explain: `방향벡터 ${tup(pk.u)}, ${lj(nb(`(${va}, ${iq(pk.be)})`), '이/가')} 평행하므로 ${nb(`${frac(va, iq(pk.u[0]))} = ${frac(iq(pk.be), iq(pk.u[1]))}`)}에서 ${nb(`${va} = ${iq(a)}`)}이다.`,
        facts: { calc: [[`${js(pk.be)}*${js(pk.u[0])}/${js(pk.u[1])}`, 0]], rule: 'parB' }
      });
    }),
    T('par3', '좌표공간 — 두 직선이 평행할 때 미지수', '①13', (d) => {
      const va = V('a');
      const pk = d.until(() => ({ k: d.pick([-3, -2, 2, 3]), v1: d.pick([-2, -1, 1, 2]), v2: d.pick([-3, -2, -1, 1, 2, 3]) }), ({ k, v1 }) => Math.abs(k * k * v1) <= 18);
      const a = pk.k * pk.v1, u0 = -pk.k * pk.k * pk.v1, u2 = pk.k * pk.v2, p = [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], q = d.until(() => [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], (r) => !parallel(sub(r, p), [u0, a, u2]));
      const lt = [nb(termTx(X, p[0], u0)), nb(termH(Y, p[1], va)), nb(termTx(Z, p[2], u2, d.bool()))].join(' = ');
      const mt = [nb(termH(X, q[0], MINUS + va)), nb(termTx(Y, q[1], pk.v1, true)), nb(termTx(Z, q[2], pk.v2, d.bool()))].join(' = ');
      return N(`좌표공간에서 두 직선 ${L('l')}: ${lt}, ${L('m')}: ${lj(mt, '이/가')} 서로 평행할 때, 상수 ${va}의 값은? (단, ${nb(`${va} ≠ 0`)})`, a, {
        signed: true,
        explain: `방향벡터 ${nb(`(${iq(u0)}, ${va}, ${iq(u2)})`)}, ${lj(nb(`(${MINUS}${va}, ${iq(pk.v1)}, ${iq(pk.v2)})`), '이/가')} 평행하므로 z성분에서 ${nb(`${frac(iq(u2), iq(pk.v2))} = ${iq(pk.k)}`)}배이다. 그러므로 ${nb(`${va} = ${iq(pk.k)} × ${pq(pk.v1)} = ${iq(a)}`)}이고, x성분 ${nb(`${iq(u0)} = ${iq(pk.k)} × (${MINUS}${va})`)}도 맞는다.`,
        facts: { calc: [[`${js(u2)}*${js(pk.v1)}/${js(pk.v2)}`, 0]] }
      });
    }),
    T('perp2', '좌표평면 — 두 직선이 수직일 때 미지수', '①14', (d) => {
      const vk = V('k');
      const pk = d.until(() => ({ c1: nz(d, -5, 5), e1: d.pick([-3, -2, -1, 1, 2, 3]), f: nz(d, -4, 4) }), ({ c1, e1, f }) => f + e1 !== 0 && (f * c1) % (f + e1) === 0 && -(f * c1) / (f + e1) !== 0 && -(f * c1) / (f + e1) + c1 !== 0 && Math.abs((f * c1) / (f + e1)) <= 9);
      const k = z0(-(pk.f * pk.c1) / (pk.f + pk.e1)), p = [nz(d, -4, 4), nz(d, -4, 4)], q = [nz(d, -4, 4), nz(d, -4, 4)], den1 = varPlus('k', pk.c1);
      const lt = [nb(termH(X, p[0], den1)), nb(termTx(Y, p[1], pk.e1, true))].join(' = '), mt = [nb(termTx(X, q[0], pk.f)), nb(termH(Y, q[1], vk))].join(' = ');
      return N(`좌표평면에서 두 직선 ${lt}, ${lj(mt, '이/가')} 서로 수직일 때, 상수 ${vk}의 값은?`, k, {
        signed: true,
        explain: `방향벡터 ${nb(`(${den1}, ${iq(pk.e1)})`)}, ${nb(`(${iq(pk.f)}, ${vk})`)}의 내적이 0이므로 ${nb(`${pq(pk.f)}(${den1}) ${pk.e1 < 0 ? MINUS : '+'} ${Math.abs(pk.e1) === 1 ? '' : Math.abs(pk.e1)}${vk} = 0`)}에서 ${nb(`${vk} = ${iq(k)}`)}이다.`,
        facts: { calc: [[`0-${js(pk.f)}*${js(pk.c1)}/(${js(pk.f)}+${js(pk.e1)})`, 0]] }
      });
    }),
    T('perp3', '좌표공간 — 두 직선이 수직일 때 미지수', '①14', (d) => {
      const vk = V('k');
      const pk = d.until(() => ({ u: [d.pick([-3, -2, -1, 1, 2, 3]), 0, d.pick([-3, -2, -1, 1, 2, 3])], v: [nz(d, -5, 5), nz(d, -4, 4), nz(d, -5, 5)] }), ({ u, v }) => { const s = u[0] * v[0] + u[2] * v[2]; return s !== 0 && s % v[1] === 0 && Math.abs(s / v[1]) <= 9 && gall(v) === 1; });
      const k = z0(-(pk.u[0] * pk.v[0] + pk.u[2] * pk.v[2]) / pk.v[1]), p = [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], q = [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)];
      const lt = [nb(termTx(X, p[0], pk.u[0], true)), nb(termH(Y, p[1], vk)), nb(termTx(Z, p[2], pk.u[2], true))].join(' = ');
      return N(`좌표공간에서 두 직선 ${L('l')}: ${lt}, ${L('m')}: ${lj(lineTx(q, pk.v, flips(d, 3)), '이/가')} 서로 수직일 때, 상수 ${vk}의 값은?`, k, {
        signed: true,
        explain: `방향벡터 ${nb(`(${iq(pk.u[0])}, ${vk}, ${iq(pk.u[2])})`)}, ${tup(pk.v)}의 내적이 0이므로 ${nb(`${pq(pk.u[0])} × ${pq(pk.v[0])}`)} + ${nb(`${pq(pk.v[1])} × ${vk}`)} + ${nb(`${pq(pk.u[2])} × ${pq(pk.v[2])} = 0`)}에서 ${nb(`${vk} = ${iq(k)}`)}이다.`,
        facts: { calc: [[`0-(${js(pk.u[0])}*${js(pk.v[0])}+${js(pk.u[2])}*${js(pk.v[2])})/${js(pk.v[1])}`, 0]] }
      });
    }),
    T('perp-quad', '두 직선이 수직일 때 미지수 — 이차방정식이 되는 경우', '①14', (d) => {
      const va = V('a');
      const pk = d.until(() => {
        const r1 = d.int(1, 4), r2 = d.int(-4, -1), qz = d.pick([-3, -2, -1, 1, 2, 3]), s = -(r1 + r2) - qz, t = nz(d, -4, 4), PR = r1 * r2 - qz * t;
        const P = d.pick([-3, -2, -1, 1, 2, 3]); return { r1, r2, qz, s, t, PR, P, R: PR / P };
      }, (o) => Number.isInteger(o.R) && o.R !== 0 && Math.abs(o.R) <= 6 && o.s !== 0 && o.r1 + o.s !== 0 && o.r1 + o.t !== 0 && o.r1 !== -o.r2);
      const p = [nz(d, -4, 4), nz(d, -4, 4), d.int(-4, 4)], q = [nz(d, -4, 4), d.int(-4, 4), nz(d, -4, 4)], ds = varPlus('a', pk.s), dt = varPlus('a', pk.t);
      const lt = [nb(termTx(X, p[0], pk.P)), nb(termH(Y, p[1], ds)), nb(termTx(Z, p[2], pk.qz))].join(' = '), mt = [nb(termTx(X, q[0], pk.R)), nb(termH(Y, q[1], va)), nb(termH(Z, q[2], dt))].join(' = ');
      return N(`두 직선 ${L('l')}: ${lt}, ${L('m')}: ${lj(mt, '이/가')} 서로 수직일 때, 양수 ${va}의 값은?`, pk.r1, {
        signed: true,
        explain: `방향벡터 ${nb(`(${iq(pk.P)}, ${ds}, ${iq(pk.qz)})`)}, ${nb(`(${iq(pk.R)}, ${va}, ${dt})`)}의 내적이 0이므로 ${nb(`${iq(pk.PR)} + ${va}(${ds}) ${pk.qz < 0 ? MINUS : '+'} ${Math.abs(pk.qz)}(${dt}) = 0`)}, 곧 ${nb(`${poly([[1, va + sup(2)], [pk.s + pk.qz, va], [pk.PR + pk.qz * pk.t, '']])} = 0`)}이다. ${nb(`${va} = ${pk.r1}`)} 또는 ${nb(`${va} = ${iq(pk.r2)}`)}이고, 양수는 ${pk.r1}이다.`,
        facts: { digit: { template: `-1<${js(pk.P)}*${js(pk.R)}+(□+${js(pk.s)})*□+${js(pk.qz)}*(□+${js(pk.t)})<1`, lo: 1, hi: 20, ask: 'min' } }
      });
    }),
    T('perp-both', '두 직선에 모두 수직인 직선이 지나는 점', '①15', (d) => {
      const pk = d.until(() => { const w1 = d.pick(VEC3), w2 = d.pick(VEC3); return { w1, w2, w: prim(cross(w1, w2)) }; }, ({ w1, w2, w }) => allNZ(w1) && allNZ(w2) && !parallel(w1, w2) && allNZ(w) && Math.max(...w.map(Math.abs)) <= 6);
      const A = [nz(d, -4, 4), nz(d, -4, 4), nz(d, -4, 4)], t = nz(d, -2, 2), Bp = add(A, mul(t, pk.w)), g1 = [d.int(-4, 4), d.int(-4, 4), d.int(-4, 4)], g2 = [d.int(-4, 4), d.int(-4, 4), d.int(-4, 4)];
      const l1 = ms('l_1'), l2 = ms('l_2'), w = sub(Bp, A);
      // 답을 다시 셈하는 식: AB 가 두 방향벡터에 수직 → (a − A0, b − A1, c − A2) 의 연립방정식을 크라메르 공식으로
      const cz = `(${js(Bp[2])}-${js(A[2])})`;
      const [p1, q1, r1] = pk.w1, [p2, q2, r2] = pk.w2, det = `(${js(p1)}*${js(q2)}-${js(q1)}*${js(p2)})`;
      const aS = `${js(A[0])}+((0-${js(r1)})*${cz}*${js(q2)}-(0-${js(r2)})*${cz}*${js(q1)})/${det}`, bS = `${js(A[1])}+(${js(p1)}*(0-${js(r2)})*${cz}-${js(p2)}*(0-${js(r1)})*${cz})/${det}`;
      return valsAns(`두 직선 ${l1}: ${lineTx(g1, pk.w1, flips(d, 3))}, ${l2}: ${lineTx(g2, pk.w2, flips(d, 3))}에 모두 수직인 직선 ${lj(L('m'), '이/가')} 두 점 ${ptN('A', A)}, ${lj(nb(`B(${V('a')}, ${V('b')}, ${iq(Bp[2])})`), '을/를')} 지날 때, 상수 ${V('a')}, ${V('b')}의 값은?`, [['a', Bp[0]], ['b', Bp[1]]], {
        explain: `${vec('AB')} = ${lj(nb(`(${V('a')} ${A[0] > 0 ? MINUS : '+'} ${Math.abs(A[0])}, ${V('b')} ${A[1] > 0 ? MINUS : '+'} ${Math.abs(A[1])}, ${iq(w[2])})`), '이/가')} 두 방향벡터 ${tup(pk.w1)}, ${lj(tup(pk.w2), '과/와')} 각각 수직이므로 내적이 0인 두 식을 연립하면 ${nb(`${V('a')} = ${iq(Bp[0])}`)}, ${nb(`${V('b')} = ${iq(Bp[1])}`)}이다.`,
        facts: { calc: [[aS, 0], [bS, 1]] }
      });
    }),
    T('meet2', '두 직선의 교점', '①16', (d) => {
      const pk = d.until(() => [d.pick(VEC3), d.pick(VEC3)], ([u, v]) => allNZ(u) && allNZ(v) && !parallel(u, v) && u[0] * v[1] - u[1] * v[0] !== 0);
      const [u, v] = pk, P = [d.int(-4, 4), d.int(-4, 4), d.int(-4, 4)], p = add(P, mul(nz(d, -2, 2), u)), q = add(P, mul(nz(d, -2, 2), v));
      const det = `(${js(u[0])}*${js(v[1])}-${js(u[1])}*${js(v[0])})`, tS = `((${js(q[0])}-${js(p[0])})*${js(v[1])}-(${js(q[1])}-${js(p[1])})*${js(v[0])})/${det}`;
      return coordAns(`두 직선 ${lineTx(p, u, flips(d, 3))}, ${lineTx(q, v, flips(d, 3))}의 교점의 좌표를 구하시오.`, P, {
        explain: `${lineTx(p, u)} = ${V('t')}, ${lineTx(q, v)} = ${lj(V('s'), '으로/로')} 놓고 x, y, z를 같게 놓아 연립하면 교점은 ${tup(P)}이다(남은 한 식에도 맞는다).`,
        facts: { calc: [0, 1, 2].map((i) => [`${js(p[i])}+${js(u[i])}*${tS}`, i]) }
      });
    })
  ];

  // ── 다. 직선 위의 점 — 교점과 수선의 발 ──
  const PLANES = [{ nm: 'xy평면', k: 2 }, { nm: 'yz평면', k: 0 }, { nm: 'zx평면', k: 1 }];
  const footTypes = [
    T('foot-axis', '두 점을 지나는 직선과 좌표평면의 교점', '①18', (d) => {
      const pl = d.pick(PLANES), w = d.until(() => d.pick(VEC3), (v) => allNZ(v));
      const P = range(0, 2).map((i) => (i === pl.k ? 0 : d.int(-5, 5))), [s, r] = d.until(() => [nz(d, -3, 3), nz(d, -3, 3)], ([a, b]) => a !== b), A = add(P, mul(s, w)), Bp = add(P, mul(r, w));
      const tS = `(0-${js(A[pl.k])})/(${js(Bp[pl.k])}-${js(A[pl.k])})`;
      return coordAns(`두 점 ${ptN('A', A)}, ${lj(ptN('B', Bp), '을/를')} 지나는 직선이 ${lj(pl.nm, '과/와')} 만나는 점의 좌표를 구하시오.`, P, {
        explain: `직선 AB의 방향벡터 ${vec('AB')} = ${lj(tup(sub(Bp, A)), '으로/로')} 직선을 ${lineTx(A, sub(Bp, A))} = ${lj(V('t'), '으로/로')} 놓는다. ${pl.nm} 위의 점은 ${'xyz'[pl.k]}좌표가 0이므로 그때의 ${lj(V('t'), '을/를')} 넣으면 ${tup(P)}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [`${js(A[i])}+(${js(Bp[i])}-${js(A[i])})*${tS}`, i]) }
      });
    }),
    T('foot-axis-len', '직선과 좌표평면의 교점과 원점 사이의 거리', '①18', (d) => {
      const pl = d.pick(PLANES), w = d.until(() => d.pick(VEC3), (v) => allNZ(v));
      const P = d.until(() => range(0, 2).map((i) => (i === pl.k ? 0 : nz(d, -6, 6))), (q) => sqf(n2(q)));
      const [s, r] = d.until(() => [nz(d, -3, 3), nz(d, -3, 3)], ([a, b]) => a !== b), A = add(P, mul(s, w)), Bp = add(P, mul(r, w));
      const tS = `(0-${js(A[pl.k])})/(${js(Bp[pl.k])}-${js(A[pl.k])})`, cS = (i) => `(${js(A[i])}+(${js(Bp[i])}-${js(A[i])})*${tS})`;
      return radAns(`두 점 ${ptN('A', A)}, ${lj(ptN('B', Bp), '을/를')} 지나는 직선이 ${lj(pl.nm, '과/와')} 만나는 점을 P라고 할 때, 원점 O에 대하여 선분 OP의 길이는?`, 1, n2(P), {
        explain: `직선 AB를 ${lineTx(A, sub(Bp, A))} = ${lj(V('t'), '으로/로')} 놓고 ${'xyz'[pl.k]}좌표가 0인 ${lj(V('t'), '을/를')} 넣으면 ${nb('P' + tup(P))}이다. 따라서 ${nb(`OP = ${rt(n2(P))}`)}이다.`,
        facts: { calc: [[[0, 1, 2].map((i) => `${cS(i)}*${cS(i)}`).join('+'), 0]] }
      });
    }),
    T('foot-line-pt', '점에서 직선에 내린 수선의 발의 좌표', '①19', (d) => {
      const pk = d.until(() => [d.pick(VEC3), d.pick(VEC3)], ([u, w]) => allNZ(u) && dot(u, w) === 0 && w.some((x) => x !== 0));
      const [u, w] = pk, Hh = [d.int(-4, 4), d.int(-4, 4), d.int(-4, 4)], A = add(Hh, mul(d.pick([1, 2, -1]), w)), P = add(Hh, mul(nz(d, -2, 2), u));
      const tS = `((${[0, 1, 2].map((i) => `(${js(A[i])}-${js(P[i])})*${js(u[i])}`).join('+')})/(${n2S(u)}))`;
      return coordAns(`점 ${ptN('A', A)}에서 직선 ${lineTx(P, u, flips(d, 3))}에 내린 수선의 발의 좌표를 구하시오.`, Hh, {
        explain: `수선의 발을 ${lj(nb('H' + `(${[0, 1, 2].map((i) => poly([[u[i], V('t')], [P[i], '']])).join(', ')})`), '으로/로')} 놓으면 ${vec('AH')} · ${vec('u')} = 0이다(${vecIs('u', u)}). 이를 풀어 나온 ${lj(V('t'), '을/를')} 넣으면 ${nb('H' + tup(Hh))}이다.`,
        facts: { calc: [0, 1, 2].map((i) => [`${js(P[i])}+${js(u[i])}*${tS}`, i]) }
      });
    }),
    T('foot-line-dist', '점과 직선 사이의 거리(수선의 발을 거쳐)', '①19', (d) => {
      const pk = d.until(() => [d.pick(VEC3), d.pick(VEC3)], ([u, w]) => allNZ(u) && dot(u, w) === 0 && sqf(n2(w)));
      const [u, w] = pk, Hh = [d.int(-4, 4), d.int(-4, 4), d.int(-4, 4)], A = add(Hh, w), P = add(Hh, mul(nz(d, -2, 2), u));
      const tS = `((${[0, 1, 2].map((i) => `(${js(A[i])}-${js(P[i])})*${js(u[i])}`).join('+')})/(${n2S(u)}))`, cS = (i) => `(${js(A[i])}-${js(P[i])}-${js(u[i])}*${tS})`;
      return radAns(`점 ${lj(ptN('A', A), '과/와')} 직선 ${lineTx(P, u, flips(d, 3))} 사이의 거리는?`, 1, n2(w), {
        explain: `수선의 발을 H라 하고 ${vec('AH')} · ${vec('u')} = 0(${vecIs('u', u)})을 풀면 ${nb('H' + tup(Hh))}이다. ${vec('AH')} = ${tup(sub(Hh, A))}이므로 거리는 ${rt(n2(w))}이다.`,
        facts: { calc: [[[0, 1, 2].map((i) => `${cS(i)}*${cS(i)}`).join('+'), 0]] }
      });
    })
  ];

  B.addUnit({
    id: '11-4-8', grade: 11, semester: 4, no: 8, title: '도형의 방정식', version: 1,
    groups: [
      { id: 'line', title: '직선의 방정식', standard: S4, types: lineTypes },
      { id: 'angle', title: '두 직선이 이루는 각과 위치 관계', standard: S4, types: angleTypes },
      { id: 'foot', title: '직선 위의 점 — 교점과 수선의 발', standard: S4, types: footTypes }
    ]
  });

  B.kit.u48x = {
    UNIT, S4, S5, gcd, range, z0, realRoots, onePos, dot, add, sub, mul, n2, cross, gall, prim, isSq, sqf, allNZ, nz2, pq, coefTx, parallel, nz, sgn, distinct,
    VEC3, VEC2, DEG, angKey, ANG3, ANG2, INT3, pickAng,
    X, Y, Z, AX, iq, js, tup, ptN, vecIs, numer, rootTx, lj, L, termTx, lineTx, flips, termH, varPlus, planeTx, planeR, sq, sphereTx, tailTx, sphereGen, COS, absS,
    dotS, n2S, angS, NOTE, lineNumAns, lineDenAns, line2Ans, planeAns, sphereAns, angAns, valsAns, twoVals, pickC, seal, T, H, cosLine, PLANES
  };
})(typeof window !== 'undefined' ? window : globalThis);
