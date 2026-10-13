// 중학교 2학년 1학기 4단원 연립일차방정식 — 단원 틀·도구와 앞쪽 묶음(미지수가 2개인 일차방정식, 연립방정식과 그 해, 연립방정식의 풀이).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 70꼴, 기본꼴 2: 57꼴, 심화꼴 62꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/8-1-4/싣기_대조표.md 에 있다.
// (여러 가지 연립방정식·해의 조건과 수 구하기·활용은 8-1-4b.js 에, 실력 문항은 8-1-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-13(미지수가 2개인 연립일차방정식을 풀 수 있고, 이를 활용하여 문제를 해결할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식 목록·문장·표·풀이 과정), 묻는 것(해·수·개수·고르기·빈칸), 연립방정식의 구조가 다르면 따로 싣는다.
//    풀이 유형은 구조가 다를 때만 따로 싣고 facts.rule 에 이름을 단다: 한 식이 y = … 꼴 / 대입할 때 괄호가 생김 / 두 식 모두 x = … 꼴 / 덩어리째 대입 /
//    그대로 더하거나 뺌 / 한 식에만 수를 곱함 / 두 식에 수를 곱함 / 괄호 / 소수 / 분수 / 분자가 식인 분수 / 비례식 / A = B = C. 같은 구조에서 수만 바꾼 유형은 만들지 않았다.
//  - 답: 해는 「x = [±][ ], y = [±][ ]」 두 칸으로, 상수의 값도 「a = [±][ ]」 칸으로 받는다(부호 단추). 개수·사람 수·길이처럼 음수일 수 없는 답은 단추 없이 받는다.
//    원문의 해가 분수인 꼴은 수를 바꾸어 정수 해로 실었다. 식을 쓰는 답은 고르기로, 「모두 구하시오」는 「모두 구한 것」 고르기나 개수로 바꾸었다.
//  - 용어: 문제 글에는 교육과정의 용어 「연립방정식」만 쓴다. 「연립일차방정식·소거·가감법·대입법」은 수업에서만 쓸 수 있는 말이므로
//    「㉠을 ㉡에 대입하여」「두 식을 변끼리 더하거나 빼어」「x를 없애려고」처럼 풀어 썼다.
//  - 교육과정의 금: 「방정식, 부등식에 대한 지나치게 복잡한 활용 문제는 다루지 않는다.」 과제 글이 정한 대로 농도·합금·영양소·일의 양·물 채우기·미지수 셋은 싣지 않았다.
//  - 참·거짓은 손으로 적지 않고 코드로 가린다: 식을 정리한 계수, 순서쌍을 대입한 값, 자연수인 해를 모두 찾은 목록, 두 식을 더하고 뺐을 때 없어지는 미지수.
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈하고, 검사 근거(facts.calc)는 문제에 적힌 수로 해를 다시 셈한다(두 식의 계수로 바로 셈하는 식).
//
// 뺀 것과 까닭(8-1-4b.js, 8-1-4c.js 의 것까지 여기에 모아 적는다)
//  - 다음 단원(8-1-6, 그래프의 일치·평행과 함께): 해가 무수히 많거나 없는 연립방정식(①34·35·36·37 심34·35·36).
//  - 범위 밖: 분모·지수에 미지수가 있는 식과 절댓값(심37·38·39·40), 미지수 3개(심58).
//  - 지나치게 복잡한 활용(교육과정의 금, 과제 글의 금): 농도(①66 심60·61), 합금·영양소(①67 심46·62), 일의 양·물 채우기(①68 심56·57·59), 세 무리의 요금(심49).
//  - 꼬인 것(조건 풀이·요령): 자연수 해의 개수가 정해지게 하는 계수(심8), 문자끼리의 곱이 나오는 것(심15·29), 해를 문자의 식으로 구해 식의 값 구하기(심22),
//    연립방정식을 자연수 해 찾기로 바꿔 읽기(심27), 새로 약속한 기호(심41), 해가 m, n과 m + 1, n − 1로 이어진 두 연립방정식(②43).
//  - 중1(7-1-4)과 같은 문제: 합과 차를 아는 두 수(②45의 대표와 변형), 걷은 돈이 남고 모자라는 과부족(심44). 미지수 하나로도 풀리는 소금물(①66)은 이 단원 꼴이 아니다.
//  - 서술형 전용: 두 방법으로 풀어 견주기(①21), 연립방정식 없이 풀고 설명하기(②48의 변형).
//  - 같은 일이어서 한 번만 실은 것은 대조표에 「겹침」으로 적었다(답의 꼴만 다른 것 — 해의 순서쌍 고르기, a + b의 값, ab의 값 — 과 상황만 다른 활용,
//    식을 세우는 데까지만 묻는 것(①70 심4), 할인율이 다른 두 물건(심51 — 늘고 준 비율과 식의 구조가 같다)).
//  - 과제 글이 보기로 든 것 가운데 꼴 목록에 없어 싣지 않은 것: 마주 보고 가서 만나기, 뒤따라가 만나기, 트랙을 같은 방향으로 돌기, 풀이 과정에서 처음으로 틀린 줄 찾기.
//  - 중1(7-1-4)과 상황이 겹치는 활용은 두 값을 모두 답하게 하거나 꼴 목록의 다른 변형으로 실었다: 나이(word-age), 다리 수(word-count-total), 둘레(word-rect — 「몇 배보다 얼마」),
//    두 구간의 속력(word-speed-two), 긴 의자(hard-seats), 기차(hard-train — 기차의 길이를 주고 다리의 길이와 속력을 묻는다).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, table, N, M, C } = B.kit;
  const { MINUS, gcd, lcm, Q, plainQ, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, mag, tx, nb, tail, lastOf, js, V, sup, tag, tagged, nz, pm, ansV, asQ, poly, sys, emOf } = B.kit.mid;
  const STD = '9수02-13';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make }, more || {});
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];
  const NAME = ['㉠', '㉡'], GANA = ['㉮', '㉯', '㉰', '㉱', '㉲'];
  const X = V('x'), Y = V('y'), va = V('a'), vb = V('b'), vk = V('k');
  const iq = (n) => tx(Q(n));
  const only = (list) => [...new Set(list)];

  // ── 식의 겉모습 ──
  // 한 변은 항의 배열이다. 항의 종류:
  //  tm(c, vs)        단항식 c × (문자들). vs 는 문자를 이어 적은 글('' 상수항, 'x', 'y'). c 는 수나 유리수(dc 로 준 수는 소수로 적는다).
  //  tg(m, list)      묶음 m × (list). m 이 1이면 (…), −1이면 −(…)로 적는다.
  //  tf(list, den, s) 분수 ±(list)/den. 분자가 일차식인 분수. s 는 +1 | −1
  // 방정식은 [좌변, 우변]이다.
  const VH = (vs) => vs.split('').map((n) => V(n)).join('');
  const tm = (c, vs) => ({ k: 'm', c: asQ(c), vs: vs || '' });
  const tg = (m, list) => ({ k: 'g', m: asQ(m), list });
  const tf = (list, den, s) => ({ k: 'f', list, den, s: s || 1 });
  // 계수가 0인 항은 빼고 적은 변(모두 0이면 0)
  const ts = (...pairs) => { const out = pairs.filter(([c]) => asQ(c).p !== 0).map(([c, vs]) => tm(c, vs)); return out.length ? out : [tm(0, '')]; };
  const sgn = (t) => (t.k === 'm' ? (t.c.p < 0 ? -1 : 1) : t.k === 'g' ? (t.m.p < 0 ? -1 : 1) : t.s);
  const isOne = (q) => q.p === 1 && q.q === 1 && !q.d;
  // 항의 크기 부분(부호는 변을 적을 때 붙인다). 분수 계수는 x/3, (2/3)x 꼴로 적는다.
  function magT(t) {
    if (t.k === 'f') return frac(sideH(t.list), t.den);
    if (t.k === 'g') { const m = qabs(t.m); return (isOne(m) ? '' : mag(m)) + '(' + sideH(t.list) + ')'; }
    const c = qabs(t.c);
    if (!t.vs) return mag(c);
    if (c.d || c.q === 1) return (isOne(c) ? '' : mag(c)) + VH(t.vs);
    return c.p === 1 ? frac(VH(t.vs), c.q) : frac(c.p, c.q) + VH(t.vs);
  }
  const sideH = (list) => list.map((t, i) => (i === 0 ? (sgn(t) < 0 ? MINUS : '') : ' ' + (sgn(t) < 0 ? MINUS : '+') + ' ') + magT(t)).join('');
  const eqH = ([L, R]) => sideH(L) + ' = ' + sideH(R);
  // 글줄 안의 방정식(줄이 바뀌어도 갈라지지 않는다)
  const eqT = (eq) => nb(eqH(eq));
  // ax + by = c 꼴(정수 계수)의 방정식
  const I = (a, b, c) => [ts([a, 'x'], [b, 'y']), ts([c, ''])];
  // 식의 맨 끝(마지막 항)을 읽는 소리에 맞춘 토씨: 수로 끝나면 그 수에, 문자로 끝나면 받침 없는 쪽에 맞춘다.
  const endTail = (list, pair) => { const t = list[list.length - 1]; return t.k === 'm' && !t.vs ? tail(lastOf(t.c), pair) : pair.split('/')[1]; };
  // 해를 적은 글: x = 3, y = −2
  const solH = (x, y) => `${nb(`${X} = ${tx(asQ(x))}`)}, ${nb(`${Y} = ${tx(asQ(y))}`)}`;
  const pairH = (x, y) => nb(`(${tx(asQ(x))}, ${tx(asQ(y))})`);

  // 식의 너비 어림(em). 분수는 분자와 분모 가운데 긴 쪽만 세고, 문자(수식 글꼴은 숫자보다 넓다)마다 조금 더한다. 화면에 안 보이는 글은 세지 않는다.
  const FRAC = /<span class="mb-frac"><span>(.*?)<\/span><span class="mb-frac-bar">\/<\/span><span>(.*?)<\/span><\/span>/g;
  function emW(h) {
    let extra = 0;
    const seen = String(h).replace(/<span style="position:absolute[^>]*>[^<]*<\/span>/g, '').replace(FRAC, (m, n, den) => { extra += Math.max(emOf(n), emOf(den)) + 0.7; return ''; });
    return emOf(seen) + extra + 0.08 * (seen.match(/class="mb-var"/g) || []).length;
  }
  // 연립방정식. rows: 식 글의 배열, marks: 식 뒤에 붙이는 이름(㉠, ㉡). 휴대폰 문항 칸(18em)을 넘을 만큼 길면 글씨를 줄인다.
  const ROOM = 16.2;
  function sysOf(rows, marks) {
    const width = Math.max(...rows.map(emW)) + (marks ? 3.7 : 0) + 1, size = Math.min(1, ROOM / width);
    const html = sys(rows.map((h, i) => h + (marks ? `<span style="margin-left:0.7em">…… ${marks[i]}</span>` : '')));
    return size >= 1 ? html : `<span style="font-size:${Math.max(size, 0.72).toFixed(2)}em">${html}</span>`;
  }
  // 식이 길어 이름(㉠, ㉡)까지 붙이면 글씨를 많이 줄여야 할 때는 이름 없이 적고, 풀이에서 이름을 붙인다.
  const NAMING = '위의 식을 ㉠, 아래의 식을 ㉡이라 하자. ';
  const sysAuto = (rows) => (Math.max(...rows.map(emW)) + 4.7 <= ROOM * 1.1 ? { html: sysOf(rows, NAME), lead: '' } : { html: sysOf(rows), lead: NAMING });
  // 두 방정식을 ㉠, ㉡으로 이름 붙인 연립방정식 / 이름 없는 연립방정식
  const sysL = (e1, e2) => sysOf([eqH(e1), eqH(e2)], NAME);
  const sysP = (e1, e2) => sysOf([eqH(e1), eqH(e2)]);
  // 긴 식 하나(A = B = C 꼴)를 그림 자리에 적는다. 길면 글씨를 줄인다.
  const wide = (h) => { const size = Math.min(1.2, 17.4 / (emW(h) + 0.5)); return `<span style="font-size:${Math.max(size, 0.8).toFixed(2)}rem;white-space:nowrap">${h}</span>`; };
  // 풀이 과정을 한 줄씩 적은 그림
  const steps = (rows) => lines(rows);

  // ── 식의 값과 셈 ──
  // env: 문자마다의 값(유리수)
  const evT = (t, env) => (t.k === 'm' ? t.vs.split('').reduce((v, n) => qmul(v, env[n]), plainQ(t.c)) : t.k === 'g' ? qmul(plainQ(t.m), evS(t.list, env)) : qmul(Q(t.s, t.den), evS(t.list, env)));
  const evS = (list, env) => list.reduce((s, t) => qadd(s, evT(t, env)), Q(0));
  const at = (x, y) => ({ x: asQ(x), y: asQ(y) });
  // 순서쌍이 방정식의 해인가
  const holds = ([L, R], x, y) => qcmp(evS(L, at(x, y)), evS(R, at(x, y))) === 0;
  // 방정식을 정리한 ax + by = c 의 계수(유리수)
  const stdQ = ([L, R]) => { const f = (x, y) => qsub(evS(L, at(x, y)), evS(R, at(x, y))), o = f(0, 0); return { a: qsub(f(1, 0), o), b: qsub(f(0, 1), o), c: qneg(o) }; };
  // 양변에 곱해 분모와 소수를 없애는 수(적힌 분모들의 최소공배수)
  const denQ = (q) => (q.d ? 10 ** q.d : q.q);
  const denT = (t) => (t.k === 'f' ? lcm(t.den, denS(t.list)) : t.k === 'g' ? lcm(denQ(t.m), denS(t.list)) : denQ(t.c));
  const denS = (list) => list.reduce((m, t) => lcm(m, denT(t)), 1);
  const scaleOf = ([L, R]) => lcm(denS(L), denS(R));
  // 양변에 n 을 곱하여 정리한 ax + by = c (정수 계수). n 을 주지 않으면 적힌 분모들의 최소공배수를 곱한다.
  function stdI(eq, n) {
    const s = stdQ(eq), k = n || scaleOf(eq), v = (q) => { const w = qmul(q, Q(k)); if (w.q !== 1) throw new Error('정수 계수가 아니다'); return w.p; };
    return { a: v(s.a), b: v(s.b), c: v(s.c), n: k };
  }
  // 두 방정식의 해(유리수). 해가 하나로 정해지지 않으면 null
  function solve2(e1, e2) {
    const p = stdQ(e1), q = stdQ(e2), det = qsub(qmul(p.a, q.b), qmul(q.a, p.b));
    if (det.p === 0) return null;
    return { x: qdiv(qsub(qmul(p.c, q.b), qmul(q.c, p.b)), det), y: qdiv(qsub(qmul(p.a, q.c), qmul(q.a, p.c)), det) };
  }
  // 두 방정식이 같은 직선을 나타내는가(한 식을 옳게 고친 식인가)
  const sameLine = (e, f) => { const s = stdQ(e), t = stdQ(f), u = [s.a, s.b, s.c], w = [t.a, t.b, t.c]; return w.some((c) => c.p !== 0) && u.every((_, i) => u.every((__, j) => qcmp(qmul(u[i], w[j]), qmul(u[j], w[i])) === 0)); };
  // x, y가 자연수인 ax + by = c 의 해(a, b, c 는 자연수)
  const natSols = (a, b, c) => { const out = []; for (let x = 1; a * x < c; x += 1) if ((c - a * x) % b === 0) out.push([x, (c - a * x) / b]); return out; };

  // ── 검사가 다시 셈하는 식 ──
  // 검사는 여러 칸의 답을 식의 값과 꼭 같은지로 맞춰 본다. 소수·분수 계수를 그대로 셈하면 끝자리가 어긋나므로, 식마다 양변에 n 을 곱한 정수 계수로 셈하는 글을 적는다.
  // 계수 q 에 n 을 곱한 값을 셈하는 글. 분수는 n × 분자 ÷ 분모, 소수 한 자리는 (n ÷ 10) × (10 × 소수)로 적는다(10 × 0.3 은 꼭 3이 된다). used: 문제에 적히지 않은 수를 모은다.
  function scJ(q, n, used) {
    const a = Math.abs(q.p);
    let body;
    if (q.d) { const t = 10 ** q.d, rest = n / t; if (!Number.isInteger(rest)) throw new Error('소수에 곱하는 수가 맞지 않는다'); used.push(t, rest); body = (rest === 1 ? '' : rest + '*') + '(' + t + '*' + (a / q.q).toFixed(q.d) + ')'; }
    else if (q.q === 1) { used.push(n); body = n === 1 ? String(a) : n + '*' + a; }
    else { used.push(n); body = n + '*' + a + '/' + q.q; }
    return '(' + (q.p < 0 ? '-' : '') + body + ')';
  }
  // 한 변에서 문자 v('' 이면 상수항)의 계수에 n 을 곱한 값을 셈하는 글
  function sideJ(list, v, n, used) {
    const out = [];
    for (const t of list) {
      if (t.k === 'm') { if (t.vs === v) out.push(scJ(t.c, n, used)); continue; }
      let head;
      if (t.k === 'g') head = scJ(t.m, n, used); else { used.push(n / t.den); head = '(' + (t.s < 0 ? '-' : '') + n / t.den + ')'; }
      for (const u of t.list) {
        if (u.k !== 'm' || u.c.q !== 1 || u.c.d) throw new Error('묶음 안에는 정수 계수의 항만 적는다');
        if (u.vs === v) out.push(head + '*' + scJ(u.c, 1, used));
      }
    }
    return out.length ? out.join('+') : '0';
  }
  // 방정식을 정리한 ax + by = c 의 세 계수를 셈하는 글
  function stdJ(eq, used) {
    const n = scaleOf(eq), part = (v, flip) => `(${sideJ(eq[flip ? 1 : 0], v, n, used)}-(${sideJ(eq[flip ? 0 : 1], v, n, used)}))`;
    return { a: part('x'), b: part('y'), c: part('', true) };
  }
  // 두 식 ax + by = c 의 계수를 셈하는 글로 해 x, y 를 셈하는 글
  const cramerJ = (p, q) => { const det = `(${p.a}*${q.b}-${q.a}*${p.b})`; return [`(${p.c}*${q.b}-${q.c}*${p.b})/${det}`, `(${p.a}*${q.c}-${q.a}*${p.c})/${det}`]; };
  // 연립방정식의 해를 다시 셈하는 식과, 그 식에 든 수 가운데 문제에 적히지 않은 수
  function solJ(e1, e2) { const used = [0, 1], [x, y] = cramerJ(stdJ(e1, used), stdJ(e2, used)); return { x, y, unseen: only(used) }; }
  // 해 두 칸(x, y)의 검사 근거
  const solFacts = (e1, e2, rule) => { const j = solJ(e1, e2); return { calc: [[j.x, 0], [j.y, 1]], unseen: j.unseen, rule }; };

  // ── 풀이 글 ──
  const stdH = (s, vars) => { const [u, w] = vars || ['x', 'y']; return `${poly([[s.a, V(u)], [s.b, V(w)]])} = ${iq(s.c)}`; };
  // 식이 ax + by = c 꼴(정수 계수, x의 항·y의 항·상수항의 차례)로 적혀 있는가
  const isStd = ([L, R]) => R.length === 1 && R[0].k === 'm' && !R[0].vs && R[0].c.q === 1 && !R[0].c.d && L.length <= 2 && L.every((t) => t.k === 'm' && t.vs && t.c.q === 1 && !t.c.d) && (L.length < 2 || (L[0].vs === 'x' && L[1].vs === 'y'));
  // 한 미지수를 없애기가 번거로운 정도(작을수록 쉽다). u, w: 두 식에서 그 미지수의 계수.
  //  계수의 절댓값이 같으면 0, 한 식에만 5 이하의 수를 곱하면 되면 그다음, 아니면 곱하는 수가 작은 쪽이 쉽다.
  function elimCost(u, w) {
    const A = Math.abs; if (u === 0 || w === 0) return 1e9;
    const L = lcm(A(u), A(w)), most = Math.max(L / A(u), L / A(w)), least = Math.min(L / A(u), L / A(w));
    return most === 1 ? 0 : least === 1 && most <= 5 ? 1000 + L : 2000 + most * 100 + L;
  }
  // 두 방정식이 풀기에 번거롭지 않은가: 정수 계수로 고친 식의 계수와 상수항이 크지 않고, 한 미지수를 없애는 데 곱하는 수가 5 이하이다.
  function tame(e1, e2) {
    const s = stdI(e1), t = stdI(e2), A = Math.abs;
    return [s.a, s.b, t.a, t.b].every((v) => v !== 0 && A(v) <= 15) && A(s.c) <= 60 && A(t.c) <= 60 && Math.min(elimCost(s.a, t.a), elimCost(s.b, t.b)) < 2600;
  }
  // 두 식 ax + by = c (정수 계수)에서 한 미지수를 없애 푸는 과정. np, nq: 두 식의 이름, vars: 미지수의 이름
  function elimTold(P, Qe, np, nq, vars) {
    const [vx, vy] = vars || ['x', 'y'], A = Math.abs;
    // 한 식에 미지수가 하나뿐이면 그 식에서 값을 바로 구하여 다른 식에 대입한다.
    const lone = [[P, np, Qe, nq], [Qe, nq, P, np]].find(([E]) => E.a === 0 || E.b === 0);
    if (lone) {
      const [E, ne, F, nf] = lone, isY = E.a === 0, known = isY ? vy : vx, rest = isY ? vx : vy, v = Q(E.c, isY ? E.b : E.a), moved = qmul(Q(isY ? F.b : F.a), v), fr = isY ? F.a : F.b, g = qdiv(qsub(Q(F.c), moved), Q(fr));
      const found = nb(`${V(known)} = ${tx(v)}`), put = isY ? poly([[fr, V(rest)], [moved, '']]) : poly([[moved, ''], [fr, V(rest)]]);
      return { x: isY ? g : v, y: isY ? v : g, text: `${ne}에서 ${found}이다. ${found}${tail(lastOf(v), '을/를')} ${nf}에 대입하면 ${nb(`${put} = ${iq(F.c)}`)}이므로 ${nb(`${V(rest)} = ${tx(g)}`)}이다.` };
    }
    // 없애기 쉬운 미지수를 없앤다.
    const dropY = elimCost(P.b, Qe.b) <= elimCost(P.a, Qe.a), keep = dropY ? vx : vy, gone = dropY ? vy : vx;
    const u = dropY ? P.b : P.a, w = dropY ? Qe.b : Qe.a, po = dropY ? P.a : P.b, qo = dropY ? Qe.a : Qe.b;
    const L = lcm(A(u), A(w)), mp = L / A(u), mq = L / A(w), s = u * w > 0 ? -1 : 1, k = mp * po + s * mq * qo, r = mp * P.c + s * mq * Qe.c, v = Q(r, k);
    const found = nb(`${V(keep)} = ${tx(v)}`);
    const how = `${np}${mp > 1 ? ' × ' + mp : ''} ${s < 0 ? MINUS : '+'} ${nq}${mq > 1 ? ' × ' + mq + tail(mq, '을/를') : '을'} 하면 ` + (k === 1 ? `${found}이다.` : `${nb(`${poly([[k, V(keep)]])} = ${iq(r)}`)}이므로 ${found}이다.`);
    // 구한 값을 없앤 미지수의 계수가 간단한 식에 대입한다.
    const [Z, nz2] = A(u) <= A(w) ? [P, np] : [Qe, nq], zo = dropY ? Z.a : Z.b, zg = dropY ? Z.b : Z.a, moved = qmul(Q(zo), v), g = qdiv(qsub(Q(Z.c), moved), Q(zg));
    const put = dropY ? poly([[moved, ''], [zg, V(gone)]]) : poly([[zg, V(gone)], [moved, '']]);
    return { x: dropY ? v : g, y: dropY ? g : v, text: `${how} ${found}${tail(lastOf(v), '을/를')} ${nz2}에 대입하면 ${nb(`${put} = ${iq(Z.c)}`)}이므로 ${nb(`${V(gone)} = ${tx(g)}`)}이다.` };
  }
  // 연립방정식 ㉠, ㉡을 푸는 과정: 분모·소수·괄호가 있는 식은 먼저 ax + by = c 꼴로 고쳐 ㉢, ㉣이라 하고, 한 미지수를 없앤다.
  function told(e1, e2, names) {
    const given = names || NAME, fresh = ['㉢', '㉣'], say = [], use = []; let made = 0;
    const P = [e1, e2].map((eq, i) => {
      const s = stdI(eq);
      if (isStd(eq)) { use.push(given[i]); return s; }
      const nm = fresh[made]; made += 1; use.push(nm);
      const all = eq[0].concat(eq[1]), flat = all.every((t) => t.k === 'm'), paren = all.some((t) => t.k === 'g'), ready = flat && eq[1].every((t) => !t.vs) && eq[0].every((t) => t.vs);
      const how = s.n > 1 ? `${given[i]}의 양변에 ${s.n}${tail(s.n, '을/를')} ${ready ? '곱하면' : paren ? '곱하고 괄호를 풀어 정리하면' : '곱하여 정리하면'}` : paren ? `${given[i]}의 괄호를 풀어 정리하면` : `${given[i]}을 정리하면`;
      say.push(`${how} ${nb(stdH(s))} …… ${nm}`);
      return s;
    });
    const el = elimTold(P[0], P[1], use[0], use[1]);
    return { x: el.x, y: el.y, text: (say.length ? say.join(', ') + '이다. ' : '') + el.text };
  }
  // 한 식(문자 v 에 대하여 풀린 식, v = expr)을 다른 식에 대입한 꼴
  const subInto = (list, v, expr) => list.reduce((out, t) => out.concat(t.k === 'm' && t.vs === v ? (isOne(t.c) ? expr : [tg(t.c, expr)]) : [t]), []);
  // n1(v = expr)을 n2(other)에 대입하여 푸는 과정
  function subTold(v, expr, other, names) {
    const [n1, n2] = names || NAME, w = v === 'x' ? 'y' : 'x', put = [subInto(other[0], v, expr), subInto(other[1], v, expr)];
    const f = (t) => qsub(evS(put[0], { [w]: Q(t) }), evS(put[1], { [w]: Q(t) })), o = f(0), K = qsub(f(1), o), r = qneg(o), wv = qdiv(r, K), vv = evS(expr, { [w]: wv });
    const found = nb(`${V(w)} = ${tx(wv)}`);
    return { [v]: vv, [w]: wv, text: `${n1}을 ${n2}에 대입하면 ${eqT(put)}이다. ` + (isOne(K) ? `이 식을 정리하면 ${found}이다.` : `이 식을 정리하면 ${nb(`${poly([[K, V(w)]])} = ${tx(r)}`)}이므로 ${found}이다.`) + ` ${found}${tail(lastOf(wv), '을/를')} ${n1}에 대입하면 ${nb(`${V(v)} = ${tx(vv)}`)}이다.` };
  }

  // ── 문항 도구 ──
  // 해 x, y 를 답하는 문항
  const xyAns = (text, x, y, o) => M(text, [{ label: X + ' =', answer: x, signed: true }, { label: Y + ' =', answer: y, signed: true }], Object.assign({ shown: solH(x, y) }, o));
  // 문자 여럿의 값을 답하는 문항: 칸 앞에 「a =」를 적고, 틀리면 「a = 2, b = −1」로 보인다.
  const valsAns = (text, pairs, o) => M(text, pairs.map(([n, v]) => ({ label: V(n) + ' =', answer: v, signed: true })), Object.assign({ shown: pairs.map(([n, v]) => nb(`${V(n)} = ${iq(v)}`)).join(', ') }, o));
  // 옳은 것 하나와 나머지를 섞는다.
  const mix = (d, right, others) => { const rows = d.shuffle([right].concat(others)); return { rows, at: rows.indexOf(right) }; };
  // 0이 아닌 정수 해 한 쌍
  const pickSol = (d, lim) => [nz(d, -(lim || 6), lim || 6), nz(d, -(lim || 6), lim || 6)];
  // 연립방정식을 푸는 문항(㉠, ㉡으로 이름 붙인 두 식). 같은 꼴의 연립방정식이 여럿이므로 구조의 이름(rule)을 단다.
  const SOLVE = '을 푸시오.';
  function solveQ(e1, e2, rule, o) {
    const opt = o || {}, s = opt.told || told(e1, e2), shown = sysAuto(opt.rows || [eqH(e1), eqH(e2)]);
    if (s.x.q !== 1 || s.y.q !== 1) throw new Error('해가 정수가 아니다');
    return xyAns(`연립방정식 ${shown.html}${SOLVE}`, s.x.p, s.y.p, { explain: shown.lead + (opt.lead || '') + s.text, facts: solFacts(e1, e2, rule) });
  }

  B.addUnit({
    id: '8-1-4', grade: 8, semester: 1, no: 4, title: '연립일차방정식', version: 1,
    groups: [
      {
        id: 'eq2', title: '미지수가 2개인 일차방정식', standard: STD,
        types: [
          T('eq2-pick', '미지수가 2개인 일차방정식 가리기', '①1 ②1·2·3 심1', (d, n) => {
            // 첫째는 넷 가운데 하나를 고르고, 둘째는 다섯 가운데 몇 개인지 센다.
            const a = d.int(2, 6), b = d.until(() => d.int(2, 7), (v) => v !== a), c = d.int(1, 9), e = d.until(() => d.int(2, 9), (v) => v !== c), x2 = X + sup(2);
            // 식마다 (좌변 − 우변)을 정리한 x², xy, x, y 의 계수와 등호가 있는지를 적어 두고, 그것으로 가린다.
            const cand = (h, k, why) => ({ h, ok: k.eq !== false && !k.xx && !k.xy && Boolean(k.x) && Boolean(k.y), why });
            const yes = d.shuffle([
              cand(`${poly([[a, X], [-b, Y]])} = ${c}`, { x: a, y: -b }), cand(`${Y} = ${poly([[a, X], [c, '']])}`, { x: -a, y: 1 }),
              cand(`${frac(X, a)} ${MINUS} ${frac(Y, b)} = 1`, { x: 1 / a, y: -1 / b }), cand(`${poly([[a, X], [b, Y], [-c, '']])} = 0`, { x: a, y: b }),
              cand(`${poly([[b, X]])} = ${poly([[a, Y], [e, '']])}`, { x: b, y: -a })
            ]);
            const no = d.shuffle([
              cand(poly([[a, X], [-b, Y], [c, '']]), { x: a, y: -b, eq: false }, '등호가 없는 식'),
              cand(`${X}${Y} + ${poly([[a, X]])} = ${c}`, { xy: 1, x: a, y: 0 }, `${X}와 ${Y}를 곱한 항 ${X}${Y}가 있어 일차가 아닌 식`),
              cand(`${Y} = ${x2} + ${c}`, { xx: -1, x: 0, y: 1 }, `${x2}이 있어 일차가 아닌 식`),
              cand(`${poly([[a, X], [b, X]])} = ${c}`, { x: a + b, y: 0 }, `미지수가 ${X} 하나뿐인 식`),
              cand(`${poly([[a, Y], [-e, '']])} = ${c}`, { x: 0, y: a }, `미지수가 ${Y} 하나뿐인 식`)
            ]);
            const MEAN = '미지수가 2개이고 그 차수가 모두 1인 방정식을 미지수가 2개인 일차방정식이라 한다.';
            if (n === 0) {
              const { rows, at: right } = mix(d, yes[0], no.slice(0, 3));
              return C('다음 중 미지수가 2개인 일차방정식인 것은?', rows.map((r) => nb(r.h)), right, {
                explain: `${MEAN} ${nb(yes[0].h)}에서 미지수는 ${X}, ${Y}의 2개이고 그 차수는 모두 1이다. 나머지는 ${no.slice(0, 3).map((r) => r.why).join(', ')}이다.`,
                facts: { truth: rows.map((r) => r.ok), want: true, rule: 'eq2-pick' }
              });
            }
            const k = d.int(2, 3), rows = d.shuffle(yes.slice(0, k).concat(no.slice(0, 5 - k))), flags = rows.map((r) => r.ok);
            return N('다음 중 미지수가 2개인 일차방정식은 모두 몇 개인가?', k, {
              unit: '개', figure: tagged(rows.map((r) => nb(r.h)), HAN),
              explain: `${MEAN} ${rows.map((r, i) => (r.ok ? '' : `${HAN[i]}은 ${r.why}`)).filter(Boolean).join(', ')}이다. 미지수가 2개인 일차방정식은 ${HAN.filter((_, i) => flags[i]).join(', ')}의 ${k}개이다.`,
              facts: { count: flags, rule: 'eq2-count' }
            });
          }, { count: 2 }),
          T('eq2-tidy', '정리해야 가려지는 식 가운데 미지수가 2개인 일차방정식이 아닌 것', '①2 ②1·2 심1', (d) => {
            const a = d.int(2, 5), b = d.until(() => d.int(2, 6), (v) => v !== a), c = d.int(1, 9), e = d.int(1, 9), x2 = X + sup(2);
            // 겉으로는 모두 x, y 가 있다. 정리한 x, y 의 계수로 가린다.
            const cand = (h, k, tidy, why) => ({ h, ok: Boolean(k.x) && Boolean(k.y), tidy, why });
            const yes = d.shuffle([
              cand(`${x2} ${MINUS} ${poly([[a, X]])} = ${x2} ${MINUS} ${Y} + ${c}`, { x: -a, y: 1 }, `${poly([[-a, X], [1, Y]])} = ${c}`),
              cand(`${X}(${X} + ${a}) + ${Y} = ${x2} ${MINUS} ${poly([[b, X]])}`, { x: a + b, y: 1 }, `${poly([[a + b, X], [1, Y]])} = 0`),
              cand(`${poly([[a, X], [b, Y]])} = ${poly([[b, X], [a, Y], [c, '']])}`, { x: a - b, y: b - a }, `${poly([[a - b, X], [b - a, Y]])} = ${c}`),
              cand(`${a}(${X} + ${Y}) ${MINUS} ${poly([[b, Y]])} = ${c}`, { x: a, y: a - b }, `${poly([[a, X], [a - b, Y]])} = ${c}`),
              cand(`${a}(${x2} + ${Y}) ${MINUS} ${X}(${poly([[a, X], [b, '']])}) = 0`, { x: -b, y: a }, `${poly([[-b, X], [a, Y]])} = 0`)
            ]).slice(0, 3);
            const no = d.pick([
              cand(`${poly([[a, X], [b, Y]])} = ${poly([[a + c, X], [b, Y], [-e, '']])}`, { x: -c, y: 0 }, `${poly([[-c, X]])} = ${iq(-e)}`, `${Y}의 항이 없어져 미지수가 ${X} 하나뿐이다`),
              cand(`${poly([[a, X], [-b, Y]])} = ${poly([[a, X], [b, Y]])}`, { x: 0, y: -2 * b }, `${poly([[-2 * b, Y]])} = 0`, `${X}의 항이 없어져 미지수가 ${Y} 하나뿐이다`),
              cand(`${poly([[a, X], [-b, Y]])} = ${b}(${c} ${MINUS} ${Y})`, { x: a, y: 0 }, `${poly([[a, X]])} = ${b * c}`, `${Y}의 항이 없어져 미지수가 ${X} 하나뿐이다`),
              cand(`${X}(${a} + ${Y}) ${MINUS} ${X}${Y} ${MINUS} ${c} = 0`, { x: a, y: 0 }, `${poly([[a, X], [-c, '']])} = 0`, `${X}${Y}의 항이 없어져 미지수가 ${X} 하나뿐이다`)
            ]), { rows, at: right } = mix(d, no, yes);
            return C('다음 중 미지수가 2개인 일차방정식이 아닌 것은?', rows.map((r) => nb(r.h)), right, {
              explain: `식을 정리한 다음에 가린다. ${nb(no.h)}에서 괄호를 풀고 모든 항을 좌변으로 이항하여 정리하면 ${nb(no.tidy)} 꼴이 되어 ${no.why}. 나머지 식은 정리하면 차례로 ${yes.map((r) => nb(r.tidy)).join(', ')} 꼴이 되므로 모두 미지수가 2개인 일차방정식이다.`,
              facts: { truth: rows.map((r) => !r.ok), want: true }
            });
          }),
          T('eq2-sentence', '문장을 미지수가 2개인 일차방정식으로 나타내기', '①3 ②4', (d) => {
            // 상황마다 [문장, 두 계수, 풀이 글]. 틀린 식은 두 계수를 바꾼 것, 개수만 더한 것, 한 값만 곱한 것이다.
            const kind = d.int(0, 3), x0 = d.int(2, 7), y0 = d.int(2, 6);
            let p, q, said, why, unit;
            if (kind === 0) {
              p = 100 * d.int(3, 9); q = 100 * d.int(10, 15); unit = '원';
              said = `한 개에 ${p}원인 초콜릿 ${X}개와 한 개에 ${q}원인 과자 ${Y}개를 사고 ${p * x0 + q * y0}원을 내었다.`;
              why = `초콜릿 ${X}개의 값은 ${nb(poly([[p, X]]))}원, 과자 ${Y}개의 값은 ${nb(poly([[q, Y]]))}원이다.`;
            } else if (kind === 1) {
              p = 2; q = 3; unit = '점';
              said = `어느 농구 선수가 2점 슛 ${X}개와 3점 슛 ${Y}개를 넣어 ${p * x0 + q * y0}점을 얻었다.`;
              why = `2점 슛 ${X}개로 얻은 점수는 ${nb(poly([[2, X]]))}점, 3점 슛 ${Y}개로 얻은 점수는 ${nb(poly([[3, Y]]))}점이다.`;
            } else if (kind === 2) {
              p = 4; q = 2; unit = '개';
              said = `농장에 있는 토끼 ${X}마리와 오리 ${Y}마리의 다리는 모두 ${p * x0 + q * y0}개이다.`;
              why = `토끼 한 마리의 다리는 4개, 오리 한 마리의 다리는 2개이므로 다리는 모두 ${nb(`(${poly([[4, X], [2, Y]])})`)}개이다.`;
            } else {
              [p, q] = d.until(() => [d.int(2, 7), d.int(2, 7)], ([u, w]) => u !== w); unit = '';
              said = `${X}의 ${p}배와 ${Y}의 ${q}배의 합은 ${p * x0 + q * y0}이다.`;
              why = `${X}의 ${p}배는 ${nb(poly([[p, X]]))}, ${Y}의 ${q}배는 ${nb(poly([[q, Y]]))}이다.`;
            }
            const total = p * x0 + q * y0, right = { h: `${poly([[p, X], [q, Y]])} = ${total}`, k: [p, q, total] };
            const wrongs = [{ h: `${poly([[q, X], [p, Y]])} = ${total}`, k: [q, p, total] }, { h: `${X} + ${Y} = ${total}`, k: [1, 1, total] }, { h: `${p}(${X} + ${Y}) = ${total}`, k: [p, p, total] }];
            const same = (u, w) => u.every((_, i) => u.every((__, j) => u[i] * w[j] === u[j] * w[i]));
            const { rows, at: at0 } = mix(d, right, wrongs);
            return C(`「${said}」를 ${X}, ${Y}에 대한 일차방정식으로 나타낸 것은?`, rows.map((r) => nb(r.h)), at0, {
              explain: `${why} 따라서 ${nb(right.h)}이다.`,
              facts: { truth: rows.map((r) => same(r.k, right.k)), want: true }
            });
          }),
          T('eq2-sentence-not', '식으로 나타내면 미지수가 2개인 일차방정식이 아닌 문장', '심2', (d) => {
            const a = d.int(2, 5), b = d.until(() => d.int(2, 6), (v) => v !== a), c = d.int(1, 6), p = 100 * d.int(3, 8), q = 100 * d.int(5, 12), xu = (unit) => nb(`${X} ${unit}`), yu = (unit) => nb(`${Y} ${unit}`);
            // [문장, 식, x와 y를 곱한 항이 있는가]
            const linear = d.shuffle([
              [`${X}의 ${a}배는 ${Y}의 ${b}배보다 ${c}만큼 작다.`, `${poly([[a, X]])} = ${poly([[b, Y], [-c, '']])}`, false],
              [`올해 ${X}살인 형은 ${Y}살인 동생보다 ${c}살 많다.`, `${X} = ${poly([[1, Y], [c, '']])}`, false],
              [`2점 슛 ${X}개와 3점 슛 ${Y}개를 넣어 ${2 * d.int(3, 8) + 3 * d.int(2, 6)}점을 얻었다.`, null, false],
              [`한 자루에 ${p}원인 연필 ${X}자루와 한 권에 ${q}원인 공책 ${Y}권의 값은 ${p * d.int(2, 5) + q * d.int(2, 4)}원이다.`, null, false],
              [`가로의 길이가 ${xu('cm')}, 세로의 길이가 ${yu('cm')}인 직사각형의 둘레의 길이는 ${2 * d.int(8, 20)} cm이다.`, null, false]
            ]).slice(0, 3);
            const area = 2 * d.int(6, 24), odd = d.pick([
              [`가로의 길이가 ${xu('cm')}, 세로의 길이가 ${yu('cm')}인 직사각형의 넓이는 ${area} cm²이다.`, `${X}${Y} = ${area}`, true],
              [`시속 ${xu('km')}로 ${Y}시간 동안 달린 거리는 ${10 * d.int(3, 12)} km이다.`, null, true],
              [`한 개에 ${X}원인 지우개 ${Y}개의 값은 ${500 * d.int(3, 12)}원이다.`, null, true],
              [`밑변의 길이가 ${xu('cm')}, 높이가 ${yu('cm')}인 삼각형의 넓이는 ${area} cm²이다.`, `${frac(1, 2)}${X}${Y} = ${area}`, true]
            ]);
            const tail2 = (s) => Number(String(s).match(/(\d+)\D*$/)[1]);
            const made = odd[1] || `${X}${Y} = ${tail2(odd[0])}`, { rows, at: at0 } = mix(d, odd, linear);
            return C(`다음 문장을 ${X}, ${Y}에 대한 등식으로 나타낼 때, 미지수가 2개인 일차방정식이 아닌 것은?`, rows.map((r) => r[0]), at0, {
              explain: `「${odd[0]}」를 등식으로 나타내면 ${nb(made)}이다. ${X}${Y}는 ${X}와 ${Y}를 곱한 항이므로 차수가 1이 아니다. 나머지 문장은 ${X}의 항과 ${Y}의 항을 더하거나 뺀 식이 되므로 모두 미지수가 2개인 일차방정식이다.`,
              facts: { truth: rows.map((r) => r[2]), want: true }
            });
          }),
          T('eq2-table', '일차방정식의 해를 표로 나타내기', '①4 ②7', (d) => {
            // 주어진 값 1, 2, 3, 4를 대입하면 다른 미지수의 값이 양수에서 0이나 음수로 넘어간다.
            const byX = d.bool(), k = d.int(2, 4), c = d.int(2 * k, 3 * k + 2), given = byX ? X : Y, asked = byX ? Y : X, eq = byX ? I(k, 1, c) : I(1, k, c), vals = [1, 2, 3, 4].map((v) => c - k * v);
            const nat = [1, 2, 3, 4].filter((v) => c - k * v >= 1).map((v) => (byX ? pairH(v, c - k * v) : pairH(c - k * v, v)));
            return M(`일차방정식 ${eqT(eq)}에 대하여 다음 표를 완성하려고 한다. ㉮, ㉯, ㉰, ㉱에 알맞은 수는?`, vals.map((v, i) => ({ label: GANA[i], answer: v, signed: true })), {
              figure: table([given, 1, 2, 3, 4], [[asked].concat(GANA.slice(0, 4).map((g) => box(g)))]),
              explain: `${given}에 1, 2, 3, 4를 차례로 대입하여 ${asked}의 값을 구하면 ${vals.map(iq).join(', ')}이다. 이 가운데 ${X}, ${Y}의 값이 모두 자연수인 해는 ${nat.join(', ')}이다.`,
              facts: { calc: vals.map((v, i) => [`${c}-${k}*${i + 1}`, i]) }
            });
          }),
          T('eq2-natural-list', 'x, y가 자연수일 때 일차방정식의 해를 모두 구한 것 고르기', '①5 ②7 ①4', (d) => {
            // 한 미지수의 계수가 1인 식. 해가 아닌 쌍으로 0이 든 쌍을 섞는다(0은 자연수가 아니다).
            const byX = d.bool(), k = d.int(2, 4), cnt = d.int(3, 4), c = d.bool() ? k * (cnt + 1) : k * cnt + d.int(1, k - 1), eq = byX ? I(k, 1, c) : I(1, k, c);
            const pairs = (byX ? natSols(k, 1, c) : natSols(1, k, c)), zero = c % k === 0 ? (byX ? [c / k, 0] : [0, c / k]) : (byX ? [0, c] : [c, 0]);
            const withZero = zero[0] === 0 ? [zero].concat(pairs) : pairs.concat([zero]);
            const lists = [pairs, pairs.slice(0, -1), withZero, pairs.map(([x, y]) => [y, x])], key = (list) => list.map((p) => p.join()).sort().join('|');
            const { rows, at: at0 } = mix(d, lists[0], lists.slice(1));
            return C(`${X}, ${Y}가 자연수일 때, 일차방정식 ${eqT(eq)}의 해를 모두 구한 것은?`, rows.map((list) => list.map(([x, y]) => pairH(x, y)).join(', ')), at0, {
              explain: `${byX ? X : Y}에 1, 2, 3, …을 차례로 대입하여 ${byX ? Y : X}의 값도 자연수가 되는 것을 찾으면 ${pairs.map(([x, y]) => pairH(x, y)).join(', ')}이다. ${pairH(zero[0], zero[1])}${tail(zero[1], '은/는')} 등식을 참이 되게 하지만 0은 자연수가 아니므로 해가 아니다.`,
              facts: { truth: rows.map((list) => key(list) === key(byX ? natSols(k, 1, c) : natSols(1, k, c))), want: true }
            });
          }),
          T('eq2-natural-count', 'x, y가 자연수일 때 일차방정식의 해의 개수', '①6 ①5 심7', (d, n) => {
            if (n === 0) {
              // 두 계수가 모두 1이 아니고, 한쪽 값이 0이 되어 빠지는 경우가 있다.
              const m = d.until(() => { const a = d.int(2, 5), b = d.until(() => d.int(2, 5), (v) => gcd(v, a) === 1), c = d.int(12, 60); return { a, b, c, sols: natSols(a, b, c) }; }, (r) => r.sols.length >= 2 && r.sols.length <= 6 && (r.c % r.a === 0 || r.c % r.b === 0));
              const { a, b, c, sols } = m, flags = [];
              for (let y = 1; b * y <= c; y += 1) flags.push(c - b * y > 0 && (c - b * y) % a === 0);
              const zero = c % b === 0 ? pairH(0, c / b) : pairH(c / a, 0);
              return N(`${X}, ${Y}가 자연수일 때, 일차방정식 ${eqT(I(a, b, c))}의 해는 모두 몇 개인가?`, sols.length, {
                unit: '개',
                explain: `${Y}에 자연수를 차례로 대입하여 ${X}의 값도 자연수가 되는 것을 찾으면 ${sols.map(([x, y]) => pairH(x, y)).join(', ')}의 ${sols.length}개이다. ${zero}${tail(c % b === 0 ? c / b : 0, '은/는')} 0이 자연수가 아니므로 해가 아니다.`,
                facts: { count: flags, rule: 'natural-count-0' }
              });
            }
            // x, y의 범위가 정해진 뺄셈 꼴
            const m = d.until(() => { const a = d.int(2, 4), c = nz(d, -3, 6), lim = d.pick([8, 9, 10, 12]), sols = []; for (let x = 1; x < lim; x += 1) if (a * x - c >= 1 && a * x - c < lim) sols.push([x, a * x - c]); return { a, c, lim, sols }; }, (r) => r.sols.length >= 2 && r.sols.length <= 5);
            const { a, c, lim, sols } = m, flags = [], over = sols[sols.length - 1][0] + 1;
            for (let x = 1; x < lim; x += 1) flags.push(a * x - c >= 1 && a * x - c < lim);
            return N(`${X}, ${Y}가 ${lim}보다 작은 자연수일 때, 일차방정식 ${eqT(I(a, -1, c))}의 해는 모두 몇 개인가?`, sols.length, {
              unit: '개',
              explain: `${X}에 1, 2, 3, …을 차례로 대입하여 ${Y}의 값을 구한다. ${Y}의 값도 ${lim}보다 작은 자연수인 것은 ${sols.map(([x, y]) => pairH(x, y)).join(', ')}의 ${sols.length}개이다. ${nb(`${X} = ${over}`)}일 때는 ${nb(`${Y} = ${a * over - c}`)}${tail(a * over - c, '이/가')} 되어 ${lim}보다 작지 않다.`,
              facts: { count: flags, rule: 'natural-count-1' }
            });
          }, { count: 2 }),
          T('eq2-nonneg-count', 'x, y가 음이 아닌 정수일 때 일차방정식의 해의 개수', '②8', (d) => {
            const sols0 = (a, b, c) => { const out = []; for (let y = 0; b * y <= c; y += 1) if ((c - b * y) % a === 0) out.push([(c - b * y) / a, y]); return out; };
            const m = d.until(() => { const a = d.int(2, 5), b = d.until(() => d.int(2, 5), (v) => gcd(v, a) === 1), c = d.int(10, 48); return { a, b, c, sols: sols0(a, b, c) }; }, (r) => r.sols.length >= 3 && r.sols.length <= 7 && (r.c % r.a === 0 || r.c % r.b === 0));
            const { a, b, c, sols } = m, flags = [];
            for (let y = 0; b * y <= c; y += 1) flags.push((c - b * y) % a === 0);
            return N(`${X}, ${Y}가 음이 아닌 정수일 때, 일차방정식 ${eqT(I(a, b, c))}의 해는 모두 몇 개인가?`, sols.length, {
              unit: '개',
              explain: `음이 아닌 정수는 0과 자연수이다. ${Y}에 0, 1, 2, …를 차례로 대입하여 ${X}의 값도 음이 아닌 정수가 되는 것을 찾으면 ${sols.map(([x, y]) => pairH(x, y)).join(', ')}의 ${sols.length}개이다.`,
              facts: { count: flags }
            });
          }),
          T('eq2-sol-pick', '순서쌍 가운데 일차방정식의 해인 것·아닌 것', '①7 ②6 심5', (d, n) => {
            if (n === 0) {
              // 해 셋(음수가 든 쌍 포함)과 해가 아닌 쌍 하나
              const m = d.until(() => {
                const a = d.int(2, 5), b = d.pick([1, -1, 2, -2, 3]), x0 = d.int(-2, 3), y0 = d.int(-3, 4), ts2 = d.shuffle([-2, -1, 1, 2]).slice(0, 3);
                const good = [[x0, y0]].concat(ts2.slice(0, 2).map((t) => [x0 + b * t, y0 - a * t])), bad = [x0 + b * ts2[2], y0 - a * ts2[2] + pm(d)];
                return { a, b, c: a * x0 + b * y0, good, bad };
              }, (r) => r.c !== 0 && r.good.concat([r.bad]).every(([x, y]) => Math.abs(x) <= 9 && Math.abs(y) <= 15));
              const { a, b, c, good, bad } = m, { rows, at: at0 } = mix(d, bad, good);
              return C(`다음 순서쌍 가운데 일차방정식 ${eqT(I(a, b, c))}의 해가 아닌 것은?`, rows.map(([x, y]) => pairH(x, y)), at0, {
                explain: `순서쌍의 ${X}, ${Y}의 값을 대입하여 등식이 참이 되면 해이다. ${pairH(bad[0], bad[1])}${tail(Math.abs(bad[1]), '을/를')} 대입하면 좌변의 값이 ${iq(a * bad[0] + b * bad[1])}${tail(Math.abs(a * bad[0] + b * bad[1]), '이/가')} 되어 우변의 값 ${iq(c)}${tail(Math.abs(c), '과/와')} 다르다. 나머지는 모두 좌변의 값이 ${iq(c)}이다.`,
                facts: { claimed: rows.map(([x, y]) => [`(${a})*(${x})+(${b})*(${y})`, c]), claimedWant: false, rule: 'sol-pick-0' }
              });
            }
            // 분수가 든 순서쌍 가운데 해인 것 하나(분수의 쌍도 해가 된다)
            // 틀린 쌍: y의 부호를 반대로 한 것, 정수인 해에서 y가 1만큼 어긋난 것, x = 0일 때의 y의 부호를 반대로 한 것
            const m = d.until(() => {
              const a = d.pick([1, 3, 5]), b = d.pick([2, -2, 4]), c = nz(d, -9, 9), xt = nz(d, -3, 4), yt = Q(c - a * xt, b), x2 = d.int(-4, 5), y2 = Q(c - a * x2, b);
              return { a, b, c, good: [Q(xt), yt], near: y2, bads: [[Q(xt), qneg(yt)], [Q(x2), qadd(y2, Q(pm(d)))], [Q(0), qneg(Q(c, b))]] };
            }, (r) => r.good[1].q !== 1 && r.near.q === 1 && new Set(r.bads.concat([r.good]).map(([x, y]) => x.p + '/' + x.q + ',' + y.p + '/' + y.q)).size === 4 && r.bads.every(([x, y]) => !holds(I(r.a, r.b, r.c), x, y)));
            const { a, b, c, good, bads } = m, { rows, at: at0 } = mix(d, good, bads);
            return C(`다음 순서쌍 가운데 일차방정식 ${eqT(I(a, b, c))}의 해인 것은?`, rows.map(([x, y]) => pairH(x, y)), at0, {
              explain: `순서쌍의 ${X}, ${Y}의 값을 대입하여 등식이 참이 되면 해이다. ${pairH(good[0], good[1])}${tail(lastOf(good[1]), '을/를')} 대입하면 좌변의 값이 ${iq(c)}${tail(Math.abs(c), '이/가')} 되어 우변의 값과 같다. ${X}, ${Y}의 값이 분수이거나 음수이어도 등식을 참이 되게 하면 해이다.`,
              facts: { claimed: rows.map(([x, y]) => [`(${a})*${js(x)}+(${b})*${js(y)}`, c]), claimedWant: true, rule: 'sol-pick-1' }
            });
          }, { count: 2 }),
          T('eq2-which-eq', '주어진 x, y의 값을 해로 갖는 일차방정식 고르기', '①8 ②5', (d) => {
            const [p, q] = pickSol(d, 4), off = () => pm(d) * d.int(1, 3);
            // 모양이 서로 다른 식. ok 가 아니면 상수를 조금 어긋나게 한다.
            const makers = d.shuffle([
              (ok) => { const a = nz(d, -5, 5), b = nz(d, -5, 5); return [ts([a, 'x'], [b, 'y']), ts([a * p + b * q + (ok ? 0 : off()), ''])]; },
              (ok) => { const a = nz(d, -4, 4); return [ts([1, 'y']), ts([a, 'x'], [q - a * p + (ok ? 0 : off()), ''])]; },
              (ok) => { const a = d.int(2, 6), b = d.int(2, 5), e = nz(d, -9, 9); return [ts([a, 'x'], [e, '']), ts([b, 'y'], [a * p + e - b * q + (ok ? 0 : off()), ''])]; },
              (ok) => { const a = d.int(2, 5), b = nz(d, -4, 4); return [ts([a, 'x']), ts([b, 'y'], [a * p - b * q + (ok ? 0 : off()), ''])]; },
              (ok) => { const a = nz(d, -5, 5), b = nz(d, -5, 5); return [ts([a, 'x'], [b, 'y'], [-(a * p + b * q) + (ok ? 0 : off()), '']), ts([0, ''])]; }
            ]).slice(0, 4);
            const right = makers[0](true), { rows, at: at0 } = mix(d, right, makers.slice(1).map((make) => make(false))), lv = evS(right[0], at(p, q));
            return C(`다음 일차방정식 가운데 ${solH(p, q)}${tail(Math.abs(q), '을/를')} 해로 갖는 것은?`, rows.map(eqT), at0, {
              explain: `${solH(p, q)}${tail(Math.abs(q), '을/를')} 대입하여 등식이 참이 되는 것을 찾는다. ${eqT(right)}에서 좌변의 값은 ${tx(lv)}, 우변의 값도 ${tx(lv)}${tail(lastOf(lv), '으로/로')} 같다. 나머지 식은 좌변과 우변의 값이 다르다.`,
              facts: { truth: rows.map((eq) => holds(eq, p, q)), want: true }
            });
          }),
          T('eq2-coef', '일차방정식의 해가 주어질 때 수 구하기', '①9·10 ②9', (d, n) => {
            if (n === 0) {
              // 상수 a 의 자리가 다른 세 꼴: y의 계수, x의 계수(= 0 꼴), 우변의 상수항
              const kind = d.int(0, 2);
              let a = d.until(() => nz(d, -6, 6), (v) => Math.abs(v) > 1), p, q, h, value, why;
              if (kind === 0) {
                [p, q] = pickSol(d, 4);
                const A = pm(d) * d.int(2, 5), c = A * p + a * q;
                h = `${poly([[A, X], [1, va + Y]])} = ${iq(c)}`; value = `((${c})-(${A})*(${p}))/(${q})`;
                why = nb(`${poly([[A * p, ''], [q, va]])} = ${iq(c)}`);
              } else if (kind === 1) {
                [p, q] = pickSol(d, 4);
                const Bc = d.until(() => d.int(2, 5), (v) => v * q - a * p !== 0), c = Bc * q - a * p;
                h = `${poly([[1, va + X], [-Bc, Y], [c, '']])} = 0`; value = `((${Bc})*(${q})-(${c}))/(${p})`;
                why = nb(`${poly([[p, va], [-Bc * q + c, '']])} = 0`);
              } else {
                const m = d.int(2, 4), A = d.int(2, 5);
                [p, q] = d.until(() => pickSol(d, 5), ([u, w]) => (A * u - w) % m === 0 && Math.abs((A * u - w) / m) > 1); a = (A * p - q) / m;
                h =`${poly([[A, X], [-1, Y]])} = ${m}${va}`; value = `((${A})*(${p})-(${q}))/${m}`;
                why = nb(`${iq(A * p - q)} = ${m}${va}`);
              }
              return ansV(`일차방정식 ${nb(h)}의 한 해가 ${solH(p, q)}일 때, 상수 ${va}의 값은?`, Q(a), 'int', {
                explain: `해를 일차방정식에 대입하면 등식이 참이 된다. ${solH(p, q)}${tail(Math.abs(q), '을/를')} 대입하면 ${why}이므로 ${nb(`${va} = ${iq(a)}`)}이다.`,
                facts: { value, unseen: [1, 0], rule: 'coef-0' }
              });
            }
            // 해의 한쪽 값이 문자인 꼴: (p, k), 또는 x = mk, y = k
            const kv = nz(d, -6, 6);
            if (d.bool()) {
              const a = nz(d, -5, 5), b = d.until(() => nz(d, -5, 5), (v) => Math.abs(v) > 1), p = nz(d, -5, 5), c = a * p + b * kv;
              return ansV(`순서쌍 ${nb(`(${iq(p)}, ${vk})`)}가 일차방정식 ${eqT(I(a, b, c))}의 해일 때, ${vk}의 값은?`, Q(kv), 'int', {
                explain: `${nb(`${X} = ${iq(p)}`)}, ${nb(`${Y} = ${vk}`)}를 대입하면 ${nb(`${poly([[a * p, ''], [b, vk]])} = ${iq(c)}`)}이므로 ${nb(`${vk} = ${iq(kv)}`)}이다.`,
                facts: { value: `((${c})-(${a})*(${p}))/(${b})`, unseen: [1, 0], rule: 'coef-1' }
              });
            }
            const [a, b, m] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5), d.pick([2, 3, -1, -2])], ([u, w, t]) => Math.abs(u * t + w) > 1), c = (a * m + b) * kv;
            return ansV(`${nb(`${X} = ${poly([[m, vk]])}`)}, ${nb(`${Y} = ${vk}`)}가 일차방정식 ${eqT(I(a, b, c))}의 해일 때, ${vk}의 값은?`, Q(kv), 'int', {
              explain: `${nb(`${X} = ${poly([[m, vk]])}`)}, ${nb(`${Y} = ${vk}`)}를 대입하면 ${nb(`${poly([[a * m, vk], [b, vk]])} = ${iq(c)}`)}, ${nb(`${poly([[a * m + b, vk]])} = ${iq(c)}`)}이므로 ${nb(`${vk} = ${iq(kv)}`)}이다.`,
              facts: { value: `(${c})/((${a})*(${m})+(${b}))`, unseen: [1, 0], rule: 'coef-1' }
            });
          }, { count: 2 }),
          T('eq2-two-sols', '한 해로 계수를 구한 뒤 다른 해의 빈 값 구하기', '①11 ②10 심9', (d) => {
            // 첫째 쌍으로 a 를 구하고, 둘째 쌍의 빈 값(y 좌표나 x 좌표)을 구한다.
            const askY = d.bool();
            const m = d.until(() => {
              const a = d.until(() => nz(d, -7, 7), (v) => Math.abs(v) > 1), b = d.pick([1, -1, 2, -2, 3]), p1 = nz(d, -4, 4), q1 = nz(d, -6, 9), c = a * p1 + b * q1, other = d.until(() => nz(d, -6, 9), (v) => v !== (askY ? p1 : q1));
              return { a, b, p1, q1, c, other, k: askY ? Q(c - a * other, b) : Q(c - b * other, a) };
            }, (r) => r.k.q === 1 && r.k.p !== 0 && Math.abs(r.k.p) <= 20 && r.c !== 0);
            const { a, b, p1, q1, c, other } = m, k = m.k.p, second = askY ? `(${iq(other)}, ${vk})` : `(${vk}, ${iq(other)})`, aJ = `((${c})-(${b})*(${q1}))/(${p1})`;
            const eqh = `${poly([[1, va + X], [b, Y]])} = ${iq(c)}`;
            return valsAns(`두 순서쌍 ${pairH(p1, q1)}, ${nb(second)}${askY ? '가' : tail(Math.abs(other), '이/가')} 모두 일차방정식 ${nb(eqh)}의 해일 때, 상수 ${va}와 ${vk}의 값은?`, [['a', a], ['k', k]], {
              explain: `${pairH(p1, q1)}${tail(Math.abs(q1), '을/를')} 대입하면 ${nb(`${poly([[p1, va], [b * q1, '']])} = ${iq(c)}`)}이므로 ${nb(`${va} = ${iq(a)}`)}이다. 일차방정식 ${eqT(I(a, b, c))}에 ${nb(second)}${askY ? '를' : tail(Math.abs(other), '을/를')} 대입하면 ${askY ? nb(`${poly([[a * other, ''], [b, vk]])} = ${iq(c)}`) : nb(`${poly([[a, vk], [b * other, '']])} = ${iq(c)}`)}이므로 ${nb(`${vk} = ${iq(k)}`)}이다.`,
              facts: { calc: [[aJ, 0], [askY ? `((${c})-(${aJ})*(${other}))/(${b})` : `((${c})-(${b})*(${other}))/(${aJ})`, 1]], unseen: [1, 0] }
            });
          }),
          T('eq2-coef-natural', '한 해로 계수를 구한 뒤 자연수인 해의 개수 구하기', '①12', (d) => {
            const m = d.until(() => { const A = d.int(2, 5), a = d.until(() => d.int(2, 4), (v) => gcd(v, A) === 1), p = d.int(1, 5), q = d.int(1, 7), c = A * p + a * q; return { A, a, p, q, c, sols: natSols(A, a, c) }; }, (r) => r.sols.length >= 2 && r.sols.length <= 5);
            const { A, a, p, q, c, sols } = m, flags = [];
            for (let x = 1; A * x <= c; x += 1) flags.push(c - A * x > 0 && (c - A * x) % a === 0);
            return N(`${solH(p, q)}${tail(q, '이/가')} 일차방정식 ${nb(`${poly([[A, X], [1, va + Y]])} = ${c}`)}의 해일 때, ${X}, ${Y}가 자연수인 이 방정식의 해는 모두 몇 개인가? (단, ${va}는 상수이다.)`, sols.length, {
              unit: '개',
              explain: `${solH(p, q)}${tail(q, '을/를')} 대입하면 ${nb(`${poly([[A * p, ''], [q, va]])} = ${c}`)}이므로 ${nb(`${va} = ${a}`)}이다. 일차방정식 ${eqT(I(A, a, c))}에서 ${X}에 자연수를 차례로 대입하여 ${Y}의 값도 자연수가 되는 것을 찾으면 ${sols.map(([x, y]) => pairH(x, y)).join(', ')}의 ${sols.length}개이다.`,
              facts: { count: flags }
            });
          }),
          T('eq2-claims', '일차방정식 하나에 대한 설명의 참·거짓', '심6 심5', (d) => {
            const m = d.until(() => { const a = d.int(2, 5), b = d.until(() => d.int(2, 5), (v) => gcd(v, a) === 1), c = d.int(11, 40); return { a, b, c, nat: natSols(a, b, c) }; }, (r) => r.nat.length >= 1 && r.nat.length <= 3);
            const { a, b, c, nat } = m, eq = I(a, b, c), [x1, y1] = d.pick(nat), count = nat.length;
            // 음수가 든 해: x 가 음수인 쌍, y 가 음수인 쌍
            const kx = Math.floor(x1 / b) + 1, negX = [x1 - b * kx, y1 + a * kx], ky = Math.floor(y1 / a) + 1, negY = [x1 + b * ky, y1 - a * ky];
            const hasNegX = () => { for (let x = -1; x >= -40; x -= 1) if ((c - a * x) % b === 0) return true; return false; };
            // 문장마다 참·거짓을 셈하여 적는다.
            const S1 = { s: `${nb(`${X} = ${x1}`)}일 때 ${nb(`${Y} = ${y1}`)}이다.`, ok: holds(eq, x1, y1) };
            const S2 = { s: `${X}, ${Y}가 자연수일 때, 해는 ${count}개이다.`, ok: natSols(a, b, c).length === count };
            const S3 = { s: `순서쌍 ${pairH(negX[0], negX[1])}${tail(negX[1], '은/는')} 이 방정식의 해이다.`, ok: holds(eq, negX[0], negX[1]) };
            const S4 = { s: `순서쌍 ${pairH(negY[0], negY[1])}${tail(Math.abs(negY[1]), '은/는')} 이 방정식의 해이다.`, ok: holds(eq, negY[0], negY[1]) };
            const xf = d.until(() => d.int(1, 6), (v) => v !== x1), yf = Math.max(1, Math.round((c - a * xf) / b)) + ((c - a * xf) % b === 0 ? 1 : 0);
            const pick = d.int(0, 2), bad = [
              { s: `${X}, ${Y}가 자연수일 때, 해는 ${count + 1}개이다.`, ok: natSols(a, b, c).length === count + 1, fix: `${X}, ${Y}가 자연수인 해는 ${nat.map(([x, y]) => pairH(x, y)).join(', ')}의 ${count}개이다. 0은 자연수가 아니다.`, rest: [S1, S3, S4] },
              { s: `${nb(`${X} = ${xf}`)}일 때 ${nb(`${Y} = ${yf}`)}이다.`, ok: holds(eq, xf, yf), fix: `${nb(`${X} = ${xf}`)}${tail(xf, '을/를')} 대입하면 ${nb(`${a * xf} + ${poly([[b, Y]])} = ${c}`)}이므로 ${nb(`${Y} = ${tx(Q(c - a * xf, b))}`)}이다.`, rest: [S2, S3, S4] },
              { s: `${X}의 값이 음수인 해는 없다.`, ok: !hasNegX(), fix: `${pairH(negX[0], negX[1])}${tail(negX[1], '을/를')} 대입하면 등식이 참이 되므로 ${X}의 값이 음수인 해도 있다. ${X}, ${Y}가 자연수라는 조건이 없으면 음수도 해가 될 수 있다.`, rest: [S1, S2, S4] }
            ][pick], { rows, at: at0 } = mix(d, bad, bad.rest);
            return C(`일차방정식 ${eqT(eq)}에 대한 설명으로 옳지 않은 것은?`, rows.map((r) => r.s), at0, {
              explain: bad.fix,
              facts: { truth: rows.map((r) => r.ok), want: false }
            });
          })
        ]
      },
      {
        id: 'sys', title: '연립방정식과 그 해', standard: STD,
        types: [
          T('sys-sentence', '문장을 연립방정식으로 나타내기', '①13 ②11', (d) => {
            // 상황마다 [문장, 옳은 두 식, 틀린 연립방정식 셋, 풀이 글]. 식은 [좌변, 우변]이다.
            const kind = d.int(0, 2), x0 = d.int(3, 9), y0 = d.int(2, 8);
            let said, right, wrongs, why;
            if (kind === 0) {
              const n0 = x0 + y0, legs = 2 * x0 + 4 * y0;
              said = `병아리 ${X}마리와 강아지 ${Y}마리가 모두 ${n0}마리 있고, 다리는 모두 ${legs}개이다.`;
              right = [I(1, 1, n0), I(2, 4, legs)]; wrongs = [[I(1, 1, n0), I(4, 2, legs)], [I(1, 1, legs), I(2, 4, n0)], [I(1, -1, n0), I(2, 4, legs)]];
              why = `마리 수의 합이 ${n0}이고, 병아리의 다리는 2개, 강아지의 다리는 4개이므로 다리의 수의 합은 ${nb(poly([[2, X], [4, Y]]))}이다.`;
            } else if (kind === 1) {
              const p = 100 * d.int(3, 6), q = 100 * d.int(7, 9), n0 = x0 + y0, total = p * x0 + q * y0;
              said = `한 개에 ${p}원인 지우개 ${X}개와 한 개에 ${q}원인 자 ${Y}개를 합하여 ${n0}개 사고 ${total}원을 내었다.`;
              right = [I(1, 1, n0), I(p, q, total)]; wrongs = [[I(1, 1, n0), I(q, p, total)], [I(1, 1, total), I(p, q, n0)], [I(1, -1, n0), I(p, q, total)]];
              why = `개수의 합이 ${n0}이고, 값의 합은 ${nb(poly([[p, X], [q, Y]]))}원이다.`;
            } else {
              const big = x0 + y0 + 3, small = y0 + 1, sum = big + small, diff = big - small;
              said = `형의 나이 ${X}살과 동생의 나이 ${Y}살의 합은 ${sum}살이고, 형은 동생보다 ${diff}살 많다.`;
              right = [I(1, 1, sum), [ts([1, 'x']), ts([1, 'y'], [diff, ''])]]; wrongs = [[I(1, 1, sum), [ts([1, 'y']), ts([1, 'x'], [diff, ''])]], [I(1, 1, diff), I(1, -1, sum)], [I(1, 1, sum), [ts([1, 'x']), ts([diff, 'y'])]]];
              why = `두 사람의 나이의 합이 ${sum}살이고, 형의 나이는 동생의 나이에 ${diff}${tail(diff, '을/를')} 더한 것과 같다.`;
            }
            const same = (s) => sameLine(s[0], right[0]) && sameLine(s[1], right[1]), { rows, at: at0 } = mix(d, right, wrongs);
            return C(`「${said}」를 ${X}, ${Y}에 대한 연립방정식으로 나타낸 것은?`, rows.map((s) => sysP(s[0], s[1])), at0, {
              explain: `${why} 따라서 두 식은 ${eqT(right[0])}, ${eqT(right[1])}이다.`,
              facts: { truth: rows.map(same), want: true }
            });
          }),
          T('sys-which', '주어진 x, y의 값이 해인 연립방정식 고르기', '①14 ②12', (d) => {
            // 두 식을 모두 참이 되게 하는 것은 하나뿐이다. 나머지는 한 식만 참이 되거나 두 식 모두 거짓이 된다.
            const [p, q] = pickSol(d, 4), make = (ok) => d.until(() => { const a = nz(d, -4, 4), b = nz(d, -4, 4); return [a, b, a * p + b * q + (ok ? 0 : pm(d) * d.int(1, 3))]; }, (r) => r[2] !== 0), eqOf = (ok) => { const r = make(ok); return I(r[0], r[1], r[2]); };
            const pair = (ok1, ok2) => d.until(() => [eqOf(ok1), eqOf(ok2)], ([e, f]) => Boolean(solve2(e, f)));
            const right = pair(true, true), others = [pair(true, false), pair(false, true), d.bool() ? pair(true, false) : pair(false, false)], { rows, at: at0 } = mix(d, right, others);
            return C(`다음 연립방정식 가운데 해가 ${solH(p, q)}인 것은?`, rows.map((s) => sysP(s[0], s[1])), at0, {
              explain: `연립방정식의 해는 두 일차방정식을 모두 참이 되게 하는 ${X}, ${Y}의 값이다. ${solH(p, q)}${tail(Math.abs(q), '을/를')} 대입하면 두 식 ${eqT(right[0])}, ${eqT(right[1])}에서 모두 등식이 참이 된다. 나머지 연립방정식에는 참이 되지 않는 식이 있다.`,
              facts: { truth: rows.map((s) => holds(s[0], p, q) && holds(s[1], p, q)), want: true }
            });
          }),
          T('sys-pair-pick', '순서쌍 가운데 연립방정식의 해 고르기', '②13 심10', (d) => {
            // 해 하나, ㉠만 참이 되게 하는 쌍 둘, ㉡만 참이 되게 하는 쌍 하나
            const m = d.until(() => {
              const [a1, b1, a2, b2] = [d.int(1, 3), d.int(1, 3), d.int(1, 4), nz(d, -3, 3)], [p, q] = [d.int(-2, 5), d.int(-2, 5)], t = d.shuffle([-2, -1, 1, 2]);
              return { e1: I(a1, b1, a1 * p + b1 * q), e2: I(a2, b2, a2 * p + b2 * q), sol: [p, q], only1: [[p + b1 * t[0], q - a1 * t[0]], [p + b1 * t[1], q - a1 * t[1]]], only2: [p + b2 * t[2], q - a2 * t[2]] };
            }, (r) => Boolean(solve2(r.e1, r.e2)) && r.only1.concat([r.only2, r.sol]).every(([x, y]) => Math.abs(x) <= 9 && Math.abs(y) <= 9));
            const { e1, e2, sol, only1, only2 } = m, { rows, at: at0 } = mix(d, sol, only1.concat([only2]));
            return C(`다음 순서쌍 가운데 연립방정식 ${sysL(e1, e2)}의 해인 것은?`, rows.map(([x, y]) => pairH(x, y)), at0, {
              explain: `연립방정식의 해는 두 일차방정식을 모두 참이 되게 하는 ${X}, ${Y}의 값이다. ${pairH(sol[0], sol[1])}${tail(Math.abs(sol[1]), '은/는')} ㉠과 ㉡을 모두 참이 되게 한다. ${only1.map(([x, y]) => pairH(x, y)).join(', ')}${tail(Math.abs(only1[1][1]), '은/는')} ㉠만, ${pairH(only2[0], only2[1])}${tail(Math.abs(only2[1]), '은/는')} ㉡만 참이 되게 한다.`,
              facts: { truth: rows.map(([x, y]) => holds(e1, x, y) && holds(e2, x, y)), want: true }
            });
          }),
          T('sys-table', '두 일차방정식의 해를 표로 나타내어 연립방정식의 해 찾기', '①15 ②14', (d) => {
            // 두 식 모두 y의 계수가 1이다. x = 1, 2, 3, 4일 때 y의 값이 모두 자연수가 되게 한다.
            const m = d.until(() => { const a1 = d.int(1, 3), a2 = d.until(() => d.int(1, 3), (v) => v !== a1), p = d.int(1, 4), q = d.int(1, 6); return { a1, a2, p, q, c1: a1 * p + q, c2: a2 * p + q }; }, (r) => r.c1 - 4 * r.a1 >= 1 && r.c2 - 4 * r.a2 >= 1);
            const { a1, a2, p, q, c1, c2 } = m, e1 = I(a1, 1, c1), e2 = I(a2, 1, c2), blank = d.shuffle([1, 2, 3, 4]).slice(0, 2).sort((u, w) => u - w), j = solJ(e1, e2);
            const row = (a, c, hide) => [Y].concat([1, 2, 3, 4].map((x) => (hide && blank.includes(x) ? box(GANA[blank.indexOf(x)]) : String(c - a * x))));
            return M(`${X}, ${Y}가 자연수일 때, 연립방정식 ${sysL(e1, e2)}의 두 일차방정식의 해를 각각 표로 나타내었다. ㉮, ㉯에 알맞은 수와 이 연립방정식의 해를 구하시오.`,
              [{ label: GANA[0], answer: c2 - a2 * blank[0], signed: true }, { label: GANA[1], answer: c2 - a2 * blank[1], signed: true }, { label: X + ' =', answer: p, signed: true }, { label: Y + ' =', answer: q, signed: true }], {
                figure: lines([tag('㉠') + '의 해', table([X, 1, 2, 3, 4], [row(a1, c1, false)]), tag('㉡') + '의 해', table([X, 1, 2, 3, 4], [row(a2, c2, true)])]),
                shown: `${GANA[0]} ${c2 - a2 * blank[0]}, ${GANA[1]} ${c2 - a2 * blank[1]}, ${solH(p, q)}`,
                explain: `㉡에 ${nb(`${X} = ${blank[0]}`)}, ${nb(`${X} = ${blank[1]}`)}${tail(blank[1], '을/를')} 대입하면 ${Y}의 값은 차례로 ${c2 - a2 * blank[0]}, ${c2 - a2 * blank[1]}이다. 두 표에 공통으로 있는 것은 ${solH(p, q)}이고, 이것이 두 일차방정식을 모두 참이 되게 하는 연립방정식의 해이다.`,
                facts: { calc: [[`${c2}-${a2}*${blank[0]}`, 0], [`${c2}-${a2}*${blank[1]}`, 1], [j.x, 2], [j.y, 3]], unseen: j.unseen }
              });
          }),
          T('sys-natural', 'x, y가 자연수일 때 두 일차방정식의 해를 늘어놓아 연립방정식 풀기', '①16 ②15', (d) => {
            const m = d.until(() => { const a = d.int(2, 3), b = d.int(2, 3), p = d.int(1, 4), q = d.int(1, 4); return { a, b, p, q, c1: a * p + q, c2: p + b * q }; }, (r) => natSols(r.a, 1, r.c1).length <= 4 && natSols(1, r.b, r.c2).length <= 4 && natSols(r.a, 1, r.c1).length >= 2 && natSols(1, r.b, r.c2).length >= 2);
            const { a, b, p, q, c1, c2 } = m, e1 = I(a, 1, c1), e2 = I(1, b, c2), list = (s) => s.map(([x, y]) => pairH(x, y)).join(', ');
            return xyAns(`${X}, ${Y}가 자연수일 때, 연립방정식 ${sysL(e1, e2)}의 해를 구하시오.`, p, q, {
              explain: `${X}, ${Y}가 자연수일 때 ㉠의 해는 ${list(natSols(a, 1, c1))}이고, ㉡의 해는 ${list(natSols(1, b, c2))}이다. 두 일차방정식의 공통인 해는 ${pairH(p, q)}이므로 연립방정식의 해는 ${solH(p, q)}이다.`,
              facts: solFacts(e1, e2, 'natural')
            });
          })
        ]
      },
      {
        id: 'solve', title: '연립방정식의 풀이', standard: STD,
        types: [
          T('solve-sub-blank', '한 식을 다른 식에 대입하여 푸는 과정의 빈칸', '①17 ②16', (d) => {
            // ㉠: v = mw + n 을 ㉡: pv + qw = r 에 대입한다. p 가 음수이거나 1이 아니면 괄호를 풀 때 부호와 곱을 챙겨야 한다.
            const v = d.pick(['x', 'y']), w = v === 'x' ? 'y' : 'x';
            const m = d.until(() => { const mm = nz(d, -3, 3), n0 = nz(d, -6, 6), p = d.pick([-3, -2, -1, 2, 3, 4, 5]), q = nz(d, -5, 5), wv = nz(d, -5, 5); return { mm, n0, p, q, wv, vv: mm * wv + n0, K: p * mm + q }; }, (r) => Math.abs(r.K) >= 2 && r.vv !== 0 && Math.abs(r.vv) <= 12);
            const { mm, n0, p, q, wv, vv, K } = m, r = p * vv + q * wv, expr = ts([mm, w], [n0, '']), e1 = [ts([1, v]), expr], other = v === 'x' ? I(p, q, r) : I(q, p, r), put = [subInto(other[0], v, expr), other[1]];
            return M(`다음은 연립방정식 ${sysL(e1, other)}을 푸는 과정이다. ㉮, ㉯, ㉰, ㉱에 알맞은 수는?`, [K, r - p * n0, wv, vv].map((u, i) => ({ label: GANA[i], answer: u, signed: true })), {
              figure: steps([`㉠을 ㉡에 대입하면 ${eqT(put)}`, `이 식을 정리하면 ${nb(`${box(GANA[0])}${V(w)} = ${box(GANA[1])}`)}`, `따라서 ${nb(`${V(w)} = ${box(GANA[2])}`)}`, `이것을 ㉠에 대입하면 ${nb(`${V(v)} = ${box(GANA[3])}`)}`]),
              explain: `${eqT(put)}의 괄호를 풀면 ${nb(`${poly([[p * mm, V(w)], [p * n0, ''], [q, V(w)]])} = ${iq(r)}`)}이고, 정리하면 ${nb(`${poly([[K, V(w)]])} = ${iq(r - p * n0)}`)}이므로 ${nb(`${V(w)} = ${iq(wv)}`)}이다. 이것을 ㉠에 대입하면 ${nb(`${V(v)} = ${iq(vv)}`)}이다.`,
              facts: { calc: [[`(${p})*(${mm})+(${q})`, 0], [`(${r})-(${p})*(${n0})`, 1], [`((${r})-(${p})*(${n0}))/((${p})*(${mm})+(${q}))`, 2], [`(${mm})*(((${r})-(${p})*(${n0}))/((${p})*(${mm})+(${q})))+(${n0})`, 3]], unseen: [1, 0] }
            });
          }),
          T('solve-sub-coef', '한 식을 다른 식에 대입하여 생긴 식의 계수', '②17 심21', (d) => {
            // ㉠: y = mx + n 을 ㉡: px + qy = r 에 대입하면 (p + qm)x = r − qn. 물음의 우변은 그대로이거나 부호를 바꾼 수이다(양변의 부호를 함께 바꾸어야 한다).
            const m = d.until(() => { const mm = nz(d, -5, 5), n0 = nz(d, -7, 7), p = nz(d, -9, 9), q = d.pick([-3, -2, -1, 2, 3]), r = nz(d, -15, 15); return { mm, n0, p, q, r, K: p + q * mm, R: r - q * n0 }; }, (s) => Math.abs(s.K) >= 2 && s.R !== 0 && Math.abs(s.R) <= 30);
            const { mm, n0, p, q, r, K, R } = m, flip = d.bool(), a = flip ? -K : K, shown = flip ? -R : R, e1 = [ts([1, 'y']), ts([mm, 'x'], [n0, ''])], e2 = I(p, q, r), put = [subInto(e2[0], 'y', e1[1]), e2[1]];
            return ansV(`연립방정식 ${sysL(e1, e2)}에서 ㉠을 ㉡에 대입하여 ${Y}를 없앴더니 ${nb(`${va}${X} = ${iq(shown)}`)}${tail(Math.abs(shown), '이/가')} 되었다. 상수 ${va}의 값은?`, Q(a), 'int', {
              explain: `㉠을 ㉡에 대입하면 ${eqT(put)}이다. 괄호를 풀어 정리하면 ${nb(`${poly([[K, X]])} = ${iq(R)}`)}이다.${flip ? ` 양변의 부호를 바꾸면 ${nb(`${poly([[-K, X]])} = ${iq(-R)}`)}이다.` : ''} 따라서 ${nb(`${va} = ${iq(a)}`)}이다.`,
              facts: { value: `((${p})+(${q})*(${mm}))*(${shown})/((${r})-(${q})*(${n0}))`, unseen: [1, 0] }
            });
          }),
          T('solve-elim-blank', '두 식을 변끼리 더하거나 빼어 푸는 과정의 빈칸', '①18 ②20', (d, n) => {
            if (n === 0) {
              // y의 계수의 절댓값이 같다: 부호가 다르면 더하고, 같으면 뺀다.
              const m = d.until(() => { const a1 = nz(d, -5, 5), a2 = nz(d, -5, 5), b = d.int(1, 4), add = d.bool(), [x0, y0] = pickSol(d, 6); return { a1, a2, b, add, x0, y0, K: add ? a1 + a2 : a1 - a2 }; }, (r) => Math.abs(r.K) >= 2);
              const { a1, a2, b, add, x0, y0, K } = m, b2 = add ? -b : b, c1 = a1 * x0 + b * y0, c2 = a2 * x0 + b2 * y0, e1 = I(a1, b, c1), e2 = I(a2, b2, c2), R = add ? c1 + c2 : c1 - c2, op = add ? '+' : '-';
              return M(`다음은 연립방정식 ${sysL(e1, e2)}을 푸는 과정이다. ㉮, ㉯, ㉰, ㉱에 알맞은 수는?`, [K, R, x0, y0].map((u, i) => ({ label: GANA[i], answer: u, signed: true })), {
                figure: steps([`${add ? '㉠과 ㉡을 변끼리 더하면' : '㉠에서 ㉡을 변끼리 빼면'} ${nb(`${box(GANA[0])}${X} = ${box(GANA[1])}`)}`, `따라서 ${nb(`${X} = ${box(GANA[2])}`)}`, `이것을 ㉠에 대입하면 ${nb(`${Y} = ${box(GANA[3])}`)}`]),
                explain: `${Y}의 계수의 절댓값이 같고 부호가 ${add ? '다르므로 변끼리 더한다' : '같으므로 변끼리 뺀다'}. ${nb(`${poly([[K, X]])} = ${iq(R)}`)}이므로 ${nb(`${X} = ${iq(x0)}`)}이다. 이것을 ㉠에 대입하면 ${nb(`${poly([[a1 * x0, ''], [b, Y]])} = ${iq(c1)}`)}이므로 ${nb(`${Y} = ${iq(y0)}`)}이다.`,
                facts: { calc: [[`(${a1})${op}(${a2})`, 0], [`(${c1})${op}(${c2})`, 1], [`((${c1})${op}(${c2}))/((${a1})${op}(${a2}))`, 2], [`((${c1})-(${a1})*((${c1})${op}(${c2}))/((${a1})${op}(${a2})))/(${b})`, 3]], unseen: [1, 0], rule: 'elim-blank-0' }
              });
            }
            // ㉠에 수를 곱하여 x의 계수를 ㉡과 같게 만든 다음 뺀다.
            const m = d.until(() => { const a1 = d.int(1, 4), k = d.int(2, 4), b1 = nz(d, -5, 5), b2 = nz(d, -7, 7), [x0, y0] = pickSol(d, 6); return { a1, k, b1, b2, x0, y0 }; }, (r) => r.k * r.b1 - r.b2 !== 0 && Math.abs(r.k * r.b1) !== Math.abs(r.b2));
            const { a1, k, b1, b2, x0, y0 } = m, a2 = a1 * k, c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, e1 = I(a1, b1, c1), e2 = I(a2, b2, c2);
            return M(`다음은 연립방정식 ${sysL(e1, e2)}을 푸는 과정이다. ㉮, ㉯, ㉰, ㉱에 알맞은 수는?`, [k, k * b1, k * c1, y0].map((u, i) => ({ label: GANA[i], answer: u, signed: true })), {
              figure: steps([`${X}를 없애려고 ㉠의 양변에 ${box(GANA[0])}를 곱하면`, `${nb(`${a2}${X} + ${box(GANA[1])}${Y} = ${box(GANA[2])}`)} …… ㉢`, `㉢에서 ㉡을 변끼리 빼어 ${Y}의 값을 구하면 ${nb(`${Y} = ${box(GANA[3])}`)}`]),
              explain: `${X}의 계수를 ㉡과 같게 하려면 ㉠의 양변에 ${k}${tail(k, '을/를')} 곱한다. 이때 ${Y}의 항과 우변에도 ${k}${tail(k, '을/를')} 곱하므로 ${nb(`${poly([[a2, X], [k * b1, Y]])} = ${iq(k * c1)}`)} …… ㉢이다. ㉢ − ㉡을 하면 ${nb(`${poly([[k * b1 - b2, Y]])} = ${iq(k * c1 - c2)}`)}이므로 ${nb(`${Y} = ${iq(y0)}`)}이다.`,
              facts: { calc: [[`${a2}/${a1}`, 0], [`${a2}/${a1}*(${b1})`, 1], [`${a2}/${a1}*(${c1})`, 2], [`(${a2}/${a1}*(${c1})-(${c2}))/(${a2}/${a1}*(${b1})-(${b2}))`, 3]], unseen: [1, 0], rule: 'elim-blank-1' }
            });
          }, { count: 2 }),
          T('solve-elim-which', '한 미지수를 없애는 데 필요한 식 고르기', '①19 ②21 심20', (d, n) => {
            const PAIRS = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [2, 7], [3, 7]];
            // 식 「㉠ × m ± ㉡ × k」와, 그 식에서 x, y 의 계수
            const combo = (m, s, k) => ({ m, s, k, h: `㉠ × ${m} ${s < 0 ? MINUS : '+'} ㉡ × ${k}` });
            const left = (E1, E2, o) => ({ x: o.m * E1.a + o.s * o.k * E2.a, y: o.m * E1.b + o.s * o.k * E2.b });
            if (n === 0) {
              // 없앨 미지수가 정해져 있다. 계수의 절댓값을 같게 하는 수를 바꾸어 곱한 것, 더할지 뺄지를 반대로 한 것이 틀린 보기이다.
              const m = d.until(() => {
                const v = d.pick(['x', 'y']), [u0, w0] = d.shuffle(d.pick(PAIRS)), u = pm(d) * u0, w = pm(d) * w0, [o1, o2] = [nz(d, -7, 7), nz(d, -7, 7)], [x0, y0] = pickSol(d, 5);
                const E1 = v === 'x' ? { a: u, b: o1 } : { a: o1, b: u }, E2 = v === 'x' ? { a: w, b: o2 } : { a: o2, b: w }, s = u * w > 0 ? -1 : 1;
                return { v, E1, E2, x0, y0, opts: [combo(w0, s, u0), combo(w0, -s, u0), combo(u0, s, w0), combo(u0, -s, w0)] };
              }, (r) => r.E1.a * r.E2.b - r.E2.a * r.E1.b !== 0 && r.opts.filter((o) => { const c = left(r.E1, r.E2, o); return c.x === 0 || c.y === 0; }).length === 1);
              const { v, E1, E2, x0, y0, opts } = m, e1 = I(E1.a, E1.b, E1.a * x0 + E1.b * y0), e2 = I(E2.a, E2.b, E2.a * x0 + E2.b * y0), { rows, at: at0 } = mix(d, opts[0], opts.slice(1)), u = v === 'x' ? E1.a : E1.b, w = v === 'x' ? E2.a : E2.b;
              return C(`연립방정식 ${sysL(e1, e2)}에서 ${V(v)}를 없애려고 한다. 이때 필요한 식은?`, rows.map((o) => o.h), at0, {
                explain: `${V(v)}의 계수의 절댓값이 ${lcm(Math.abs(u), Math.abs(w))}${tail(lcm(Math.abs(u), Math.abs(w)), '으로/로')} 같아지도록 ㉠에 ${opts[0].m}${tail(opts[0].m, '을/를')}, ㉡에 ${opts[0].k}${tail(opts[0].k, '을/를')} 곱한다. 이때 ${V(v)}의 계수의 부호가 ${u * w > 0 ? '같으므로 변끼리 뺀다' : '다르므로 변끼리 더한다'}. 따라서 ${opts[0].h}${tail(opts[0].k, '을/를')} 하면 ${V(v)}가 없어진다.`,
                facts: { truth: rows.map((o) => left(E1, E2, o)[v] === 0), want: true, rule: 'elim-which-0' }
              });
            }
            // x 나 y 를 없앨 수 있는 식 하나: 한 미지수는 옳게 없애는 식을, 다른 미지수는 더할지 뺄지를 반대로 한 식과 곱하는 수를 바꾼 식을 섞는다.
            const m = d.until(() => {
              const [u0, w0] = d.shuffle(d.pick(PAIRS)), [p0, q0] = d.shuffle(d.pick(PAIRS)), E1 = { a: pm(d) * u0, b: pm(d) * p0 }, E2 = { a: pm(d) * w0, b: pm(d) * q0 }, [x0, y0] = pickSol(d, 5), goodX = d.bool();
              const sx = E1.a * E2.a > 0 ? -1 : 1, sy = E1.b * E2.b > 0 ? -1 : 1;
              const opts = goodX ? [combo(w0, sx, u0), combo(w0, -sx, u0), combo(q0, -sy, p0), combo(p0, sy, q0)] : [combo(q0, sy, p0), combo(q0, -sy, p0), combo(w0, -sx, u0), combo(u0, sx, w0)];
              return { E1, E2, x0, y0, goodX, opts };
            }, (r) => r.E1.a * r.E2.b - r.E2.a * r.E1.b !== 0 && new Set(r.opts.map((o) => o.h)).size === 4 && r.opts.filter((o) => { const c = left(r.E1, r.E2, o); return c.x === 0 || c.y === 0; }).length === 1);
            const { E1, E2, x0, y0, goodX, opts } = m, e1 = I(E1.a, E1.b, E1.a * x0 + E1.b * y0), e2 = I(E2.a, E2.b, E2.a * x0 + E2.b * y0), { rows, at: at0 } = mix(d, opts[0], opts.slice(1)), gone = goodX ? X : Y, u = goodX ? E1.a : E1.b, w = goodX ? E2.a : E2.b;
            return C(`연립방정식 ${sysL(e1, e2)}을 풀 때, 다음 중 ${X}나 ${Y}를 없앨 수 있는 식은?`, rows.map((o) => o.h), at0, {
              explain: `없애려는 미지수의 계수의 절댓값을 같게 만든 다음, 계수의 부호가 같으면 변끼리 빼고 다르면 변끼리 더한다. ㉠, ㉡에서 ${gone}의 계수는 ${iq(u)}, ${iq(w)}${tail(Math.abs(w), '으로/로')} 부호가 ${u * w > 0 ? '같다' : '다르다'}. 따라서 ${opts[0].h}${tail(opts[0].k, '을/를')} 하면 ${gone}의 계수가 0이 되어 ${gone}가 없어진다. 나머지 식에서는 ${X}의 계수도 ${Y}의 계수도 0이 되지 않는다.`,
              facts: { truth: rows.map((o) => { const c = left(E1, E2, o); return c.x === 0 || c.y === 0; }), want: true, rule: 'elim-which-1' }
            });
          }, { count: 2 }),
          T('solve-method-wrong', '연립방정식을 푸는 방법으로 옳지 않은 것 찾기', '①20 ②22', (d) => {
            // ㉠: x + by = c1, ㉡: ax − y = c2 (또는 ax + y = c2). 옳은 방법 셋과, 미지수가 없어지지 않는 식이나 잘못 고친 식 하나.
            const m = d.until(() => { const b = d.int(2, 5), a = d.int(2, 6), s = pm(d), [x0, y0] = pickSol(d, 5); return { b, a, s, x0, y0 }; }, (r) => r.a * r.b !== 1);
            const { b, a, s, x0, y0 } = m, c1 = x0 + b * y0, c2 = a * x0 + s * y0, e1 = I(1, b, c1), e2 = I(a, s, c2), E1 = { a: 1, b }, E2 = { a, b: s };
            // 식을 더하고 빼는 방법: 정말로 그 미지수가 없어지는가
            const combH = (m1, sg, m2) => `㉠${m1 > 1 ? ' × ' + m1 : ''} ${sg < 0 ? MINUS : '+'} ㉡${m2 > 1 ? ' × ' + m2 + tail(m2, '을/를') : '을'}`;
            const comb = (m1, sg, m2, v) => ({ h: `${combH(m1, sg, m2)} 하여 ${V(v)}를 없앤다.`, ok: (v === 'x' ? m1 * E1.a + sg * m2 * E2.a : m1 * E1.b + sg * m2 * E2.b) === 0 });
            // 한 식을 고쳐 대입하는 방법: 고친 식이 처음 식과 같은 식인가
            const sub = (from, to, eq, base) => ({ h: `${from}을 ${eqT(eq)}${endTail(eq[1], '으로/로')} 고쳐 ${to}에 대입한다.`, ok: sameLine(eq, base) });
            const xEq = (wrong) => [ts([1, 'x']), ts([c1, ''], [wrong ? b : -b, 'y'])];
            const yEq = (wrong) => [ts([1, 'y']), (s < 0) !== wrong ? ts([a, 'x'], [-c2, '']) : ts([-a, 'x'], [c2, ''])];
            const sy = s < 0 ? 1 : -1, good = [comb(a, -1, 1, 'x'), comb(1, sy, b, 'y'), sub('㉠', '㉡', xEq(false), e1), sub('㉡', '㉠', yEq(false), e2)];
            const badAt = d.pick([1, 2, 3]), bad = [null, comb(1, -sy, b, 'y'), sub('㉠', '㉡', xEq(true), e1), sub('㉡', '㉠', yEq(true), e2)][badAt];
            const fix = [null, `${combH(1, -sy, b)} 하면 ${Y}의 계수가 ${iq(b - sy * b * s)}${tail(Math.abs(b - sy * b * s), '이/가')} 되어 ${Y}가 없어지지 않는다. ㉠, ㉡에서 ${Y}의 계수의 부호가 ${s < 0 ? '다르므로 ' + combH(1, 1, b) : '같으므로 ' + combH(1, -1, b)} 해야 ${Y}가 없어진다.`,
              `㉠에서 ${nb(poly([[b, Y]]))}를 이항하면 ${eqT(xEq(false))}이다. ${eqT(xEq(true))}${endTail(xEq(true)[1], '은/는')} ㉠과 다른 식이다.`, `㉡에서 ${Y}를 ${X}의 식으로 나타내면 ${eqT(yEq(false))}이다. ${eqT(yEq(true))}${endTail(yEq(true)[1], '은/는')} ㉡과 다른 식이다.`][badAt];
            const rest = good.filter((_, i) => i !== badAt), { rows, at: at0 } = mix(d, bad, rest);
            return C(`연립방정식 ${sysL(e1, e2)}을 푸는 방법으로 옳지 않은 것은?`, rows.map((r) => r.h), at0, {
              explain: `${fix} 나머지는 모두 한 미지수를 없앨 수 있는 방법이다.`,
              facts: { truth: rows.map((r) => r.ok), want: false }
            });
          }),
          T('solve-sub', '한 식을 다른 식에 대입하여 풀기', '①22 ②18', (d, n) => {
            // 차례마다 구조가 다르다: 괄호 없이 대입 / 대입할 때 괄호가 생김 / 두 식 모두 x = … 꼴 / 덩어리째 대입
            if (n === 0) {
              const m = d.until(() => { const mm = nz(d, -4, 4), n0 = nz(d, -7, 7), p = nz(d, -6, 6), [x0] = pickSol(d, 6); return { mm, n0, p, x0, y0: mm * x0 + n0 }; }, (r) => r.y0 !== 0 && Math.abs(r.y0) <= 12 && r.p + r.mm !== 0);
              const { mm, n0, p, x0, y0 } = m, expr = ts([mm, 'x'], [n0, '']), e1 = [ts([1, 'y']), expr], e2 = I(p, 1, p * x0 + y0);
              return solveQ(e1, e2, 'sub-0', { told: subTold('y', expr, e2) });
            }
            if (n === 1) {
              const m = d.until(() => { const mm = nz(d, -4, 4), n0 = nz(d, -9, 9), p = d.pick([-4, -3, -2, 2, 3, 4, 5]), q = nz(d, -6, 6), [, y0] = pickSol(d, 6); return { mm, n0, p, q, y0, x0: mm * y0 + n0 }; }, (r) => r.x0 !== 0 && Math.abs(r.x0) <= 12 && r.p * r.mm + r.q !== 0);
              const { mm, n0, p, q, x0, y0 } = m, expr = ts([mm, 'y'], [n0, '']), e1 = I(p, q, p * x0 + q * y0), e2 = [ts([1, 'x']), expr], s = subTold('x', expr, e1, ['㉡', '㉠']);
              return solveQ(e1, e2, 'sub-1', { told: s });
            }
            if (n === 2) {
              const m = d.until(() => { const m1 = nz(d, -4, 4), m2 = nz(d, -4, 4), n1 = nz(d, -9, 9), [, y0] = pickSol(d, 5); return { m1, m2, n1, y0, x0: m1 * y0 + n1, n2: m1 * y0 + n1 - m2 * y0 }; }, (r) => r.m1 !== r.m2 && r.x0 !== 0 && r.n2 !== 0 && Math.abs(r.x0) <= 12 && Math.abs(r.n2) <= 15);
              const { m1, m2, n1, n2, x0, y0 } = m, ex1 = ts([m1, 'y'], [n1, '']), ex2 = ts([m2, 'y'], [n2, '']), e1 = [ts([1, 'x']), ex1], e2 = [ts([1, 'x']), ex2];
              return solveQ(e1, e2, 'sub-2', { told: { x: Q(x0), y: Q(y0), text: `㉠을 ㉡에 대입하면 ${eqT([ex1, ex2])}이다. ${Y}의 항을 좌변으로, 상수항을 우변으로 이항하여 정리하면 ${nb(`${poly([[m1 - m2, Y]])} = ${iq(n2 - n1)}`)}이므로 ${nb(`${Y} = ${iq(y0)}`)}이다. ${nb(`${Y} = ${iq(y0)}`)}${tail(Math.abs(y0), '을/를')} ㉠에 대입하면 ${nb(`${X} = ${iq(x0)}`)}이다.` } });
            }
            // ky 를 덩어리째 대입한다: ㉠ ax + ky = c, ㉡ ky = mx + n
            const m = d.until(() => { const k = d.int(2, 5), a = nz(d, -6, 6), mm = nz(d, -5, 5), [x0, y0] = pickSol(d, 5); return { k, a, mm, x0, y0, n0: k * y0 - mm * x0 }; }, (r) => r.n0 !== 0 && Math.abs(r.n0) <= 15 && r.a + r.mm !== 0);
            const { k, a, mm, n0, x0, y0 } = m, expr = ts([mm, 'x'], [n0, '']), c = a * x0 + k * y0, e1 = I(a, k, c), e2 = [ts([k, 'y']), expr];
            return solveQ(e1, e2, 'sub-3', { told: { x: Q(x0), y: Q(y0), text: `㉠의 ${nb(poly([[k, Y]]))} 자리에 ㉡의 ${nb(sideH(expr))}${tail(Math.abs(n0), '을/를')} 그대로 대입하면 ${eqT([[tm(a, 'x'), tg(1, expr)], ts([c, ''])])}이다. 이 식을 정리하면 ${nb(`${poly([[a + mm, X]])} = ${iq(c - n0)}`)}이므로 ${nb(`${X} = ${iq(x0)}`)}이다. ${nb(`${X} = ${iq(x0)}`)}${tail(Math.abs(x0), '을/를')} ㉡에 대입하면 ${nb(`${poly([[k, Y]])} = ${iq(k * y0)}`)}이므로 ${nb(`${Y} = ${iq(y0)}`)}이다.` } });
          }, { count: 4 }),
          T('solve-sub-rearr', '한 미지수를 다른 미지수의 식으로 나타낸 뒤 대입하여 풀기', '①23 ②19 ②16', (d) => {
            // ㉠의 y의 계수가 1이나 −1이다. ㉠을 y = □x + □ 꼴로 고쳐 ㉡에 대입한다.
            const m = d.until(() => { const a1 = nz(d, -5, 5), s = pm(d), a2 = nz(d, -6, 6), b2 = d.until(() => nz(d, -5, 5), (v) => Math.abs(v) > 1), [x0, y0] = pickSol(d, 6); return { a1, s, a2, b2, x0, y0 }; }, (r) => r.a2 + r.b2 * (-r.s * r.a1) !== 0 && r.a1 * r.x0 + r.s * r.y0 !== 0);
            const { a1, s, a2, b2, x0, y0 } = m, c1 = a1 * x0 + s * y0, c2 = a2 * x0 + b2 * y0, e1 = I(a1, s, c1), e2 = I(a2, b2, c2), mm = -s * a1, n0 = s * c1, j = solJ(e1, e2);
            return M(`다음은 연립방정식 ${sysL(e1, e2)}을 푸는 과정이다. ㉮, ㉯, ㉰, ㉱에 알맞은 수는?`, [mm, n0, x0, y0].map((u, i) => ({ label: GANA[i], answer: u, signed: true })), {
              figure: steps([`㉠에서 ${Y}를 ${X}의 식으로 나타내면`, `${nb(`${Y} = ${box(GANA[0])}${X} + ${box(GANA[1])}`)} …… ㉢`, `㉢을 ㉡에 대입하여 풀면`, `${nb(`${X} = ${box(GANA[2])}`)}, ${nb(`${Y} = ${box(GANA[3])}`)}`]),
              explain: `㉠에서 ${nb(poly([[a1, X]]))}를 이항${s < 0 ? '하고 양변의 부호를 바꾸면' : '하면'} ${eqT([ts([1, 'y']), ts([mm, 'x'], [n0, ''])])} …… ㉢이다. ${subTold('y', ts([mm, 'x'], [n0, '']), e2, ['㉢', '㉡']).text}`,
              facts: { calc: [[s > 0 ? `-(${a1})` : `(${a1})`, 0], [s > 0 ? `(${c1})` : `-(${c1})`, 1], [j.x, 2], [j.y, 3]], unseen: j.unseen }
            });
          }),
          T('solve-elim', '두 식을 변끼리 더하거나 빼어 풀기', '①24·25·26 ②23·24·25', (d, n) => {
            // 차례마다 구조가 다르다: 그대로 더하거나 빼면 한 미지수가 없어짐 / 한 식에만 수를 곱함 / 두 식에 모두 수를 곱함
            const A = Math.abs, rel = (u, w) => (A(u) === A(w) ? 0 : A(u) % A(w) === 0 || A(w) % A(u) === 0 ? 1 : 2), lim = n === 0 ? 5 : 7;
            const m = d.until(() => { const [a1, b1, a2, b2] = [nz(d, -lim, lim), nz(d, -lim, lim), nz(d, -lim, lim), nz(d, -lim, lim)], [x0, y0] = pickSol(d, 6); return { a1, b1, a2, b2, x0, y0, c1: a1 * x0 + b1 * y0, c2: a2 * x0 + b2 * y0 }; },
              (r) => { const cost = Math.min(elimCost(r.a1, r.a2), elimCost(r.b1, r.b2)); return r.a1 * r.b2 - r.a2 * r.b1 !== 0 && Math.min(rel(r.a1, r.a2), rel(r.b1, r.b2)) === n && A(r.c1) <= 45 && A(r.c2) <= 45 && (n === 0 ? cost === 0 : n === 1 ? cost >= 1000 && cost < 2000 : cost >= 2000 && cost < 2600); });
            return solveQ(I(m.a1, m.b1, m.c1), I(m.a2, m.b2, m.c2), 'elim-' + n);
          }, { count: 3 })
        ]
      },
      { id: 'forms', title: '여러 가지 연립방정식', standard: STD, types: [] },
      { id: 'param', title: '해의 조건과 수 구하기', standard: STD, types: [] },
      { id: 'word', title: '연립방정식의 활용', standard: STD, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(8-1-4b.js, 8-1-4c.js)이 함께 쓰는 도구
  B.kit.m814 = {
    STD, HAN, NAME, GANA, X, Y, va, vb, vk, iq, only, VH, tm, tg, tf, ts, sgn, isOne, magT, sideH, eqH, eqT, I, solH, pairH, emW, sysOf, sysAuto, sysL, sysP, wide, steps,
    evT, evS, at, holds, stdQ, denS, scaleOf, stdI, solve2, sameLine, natSols, scJ, sideJ, stdJ, cramerJ, solJ, solFacts, stdH, isStd, elimCost, tame, elimTold, told, subInto, subTold, endTail,
    xyAns, valsAns, mix, pickSol, SOLVE, solveQ
  };
})(typeof window !== 'undefined' ? window : globalThis);
