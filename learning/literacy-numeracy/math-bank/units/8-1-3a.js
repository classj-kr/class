// 중학교 2학년 1학기 3단원 일차부등식 — 단원 틀·도구와 앞쪽 묶음(부등식과 그 해, 부등식의 성질, 일차부등식과 그 풀이).
// 수집해 둔 교과서 3종(미래엔 황선욱, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1·2: 58·59꼴, 심화꼴 58꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/8-1-3/싣기_대조표.md 에 있다.
// (여러 가지 일차부등식·해의 조건과 수 구하기·활용은 8-1-3b.js 에, 실력 문항은 8-1-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-11(부등식과 그 해의 뜻을 알고, 부등식의 성질을 설명할 수 있다), 9수02-12(일차부등식을 풀 수 있고, 이를 활용하여 문제를 해결할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식 목록·문장·수직선·풀이 과정), 묻는 것(해·부등호·개수·고르기·빈칸), 부등식의 구조가 다르면 따로 싣는다.
//    풀이 유형은 구조가 다를 때만 따로 싣고 facts.rule 에 이름을 단다: 계수가 양수 / 음수 / 양변에 x / 괄호 / 괄호 앞이 음수 / 계수가 소수 / 소수에 괄호 /
//    계수가 분수 / 분자가 일차식인 분수 / 소수와 분수가 섞임. 같은 구조에서 수만 바꾼 유형은 만들지 않았다.
//  - 답: 해가 x > 3 꼴(경계가 정수)인 문항은 「x [부등호] [±][수]」 칸(ineqAns)으로 받는다. 경계가 분수이면 고르기로 낸다.
//    부등호만 답하는 꼴은 부등호 칸으로, 해를 수직선 위에 나타내는 꼴은 ㉠~㉣ 그림 넷에서 고르게 했다(보기 그림의 설명에는 꼴만 적는다 — 그림 설명이 답을 말하지 않게).
//    수를 적는 칸에는 부호 단추를 단다. 개수·최대 몇 개·몇 개월 후 같은 활용의 답은 음수일 수 없으므로 단추 없이 받는다.
//  - 교육과정의 금: 「방정식, 부등식에 대한 지나치게 복잡한 활용 문제는 다루지 않는다.」 기본 묶음의 활용은 한 상황에 부등식을 한 번 세우는 것만 싣는다.
//    여러 겹인 활용(농도, 정가와 이익, 일의 양, 도중에 바뀌는 속력, 단위를 고쳐야 하는 속력, 직사각형 속 삼각형의 넓이)은 2026-10-13 에 실력 묶음에 다시 실었다
//    (사용자: 수학 실력에 필요한 문제는 싣는다. 상황은 모두 중1 「일차방정식」의 활용에서 다룬 것이다).
//  - 범위: 연립부등식(A ≤ 식 < C 를 푸는 것, 두 부등식을 함께 만족시키는 범위), 절댓값이 든 부등식, 두 부등식을 변끼리 더하는 것, 0 × x > 1 꼴,
//    제곱끼리·역수끼리의 대소는 상위 학년의 내용이므로 싣지 않는다. x 의 범위를 주고 식의 값의 범위를 묻는 것은 부등식의 성질을 양 끝에 쓰는 일이므로 싣는다.
//  - 용어는 교육과정의 것(부등식, 일차부등식)과 부등호 <, >, ≤, ≥, 이상·이하·초과·미만, 좌변·우변·양변, 이항을 쓴다.
//  - 참·거짓과 해는 손으로 적지 않고 코드로 가린다: 수를 넣어 참인가(holds), 한 부등식에서 따라 나오는 부등식인가(relate), 해의 방향과 경계(solI).
//  - 꼴 목록에 적힌 원문 답지의 잘못(김동재 대단원 11·18, 형성 평가 55·57쪽, 미래엔 소단원 마무리 Ⅲ-3 02, T셀파 중단원 05 등)은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(8-1-3b.js, 8-1-3c.js 의 것까지 여기에 모아 적는다)
//  - 상위 학년·교육과정 밖: A ≤ 식 < C 꼴을 푸는 것(심50, ①40의 변형), 두 문자의 범위를 변끼리 더하는 것(심51·52·53), 절댓값이 든 부등식(심54·55), 두 부등식을 함께 만족시키는 수(②46),
//    0 × x > 1 꼴의 판단(심34), 제곱끼리·역수끼리의 대소(①12의 변형, ②21), 역수의 대소와 미지수가 셋인 식(심57).
//  - 이 단원의 일이 아닌 것: 큰 수·작은 수를 고르는 약속 연산(심56 — 부등식을 세우지도 풀지도 않는다. 대소 관계와 「작지 않다·크지 않다」는 중1의 내용이다).
//  - 같은 일이어서 한 번만 실은 것: 해 가운데 가장 큰 정수가 주어졌을 때 a 의 범위(①40 — 「자연수인 해가 n개」와 같이 경계가 놓일 칸을 정한다),
//    문자 계수의 부호를 해의 방향으로 정하는 다른 꼴(①39, 심27). 그 밖의 것은 대조표의 「겹침」에 꼴마다 적었다.
//  - 2026-10-13 다시 실은 것(처음에는 「꼬임」「지나치게 복잡한 활용」이라고 뺐다): 당선 확정(①47), 정수 넷의 사슬(심58), 방정식의 해의 조건(심13),
//    계수가 두 문자의 식(심33), 자연수인 해가 없을 조건(①41의 변형, ②45), 직사각형에서 세 삼각형을 뺀 넓이(①56 심36), 단위를 고치는 왕복(심45, ①53·②58·심44의 원래 꼴),
//    도중에 바뀌는 속력(심46), 농도(①57), 원가·정가·할인·이익(①58 ②59 심47·48), 일의 양(심49) — 8-1-3c.js 의 실력 묶음 끝.
//    문자를 곱하고 다른 문자의 제곱으로 나눈 식의 대소(심10)는 이 파일의 「부등식의 성질」 묶음 끝(prop-sign-twice).
//  - 뜻 없는 셈: 빈칸의 수로 새 부등식 만들기(②25), 두 해의 경계끼리 곱하기(②39 심21), 해를 넣은 다른 식의 값(①31의 변형), 해의 합·곱과 두 개수의 합(②8, ①32의 변형).
//    자연수 해의 합(①33 ②37)은 「모두 구하기」의 답 꼴만 다르므로 개수(sol-natural-count)로 한 번만 실었다.
//  - 놀이·활동·작도·서술: 저울 활동(②22), 해를 수직선 위에 나타내기(①21 ②31 — 그림 고르기로 실었다), 틀린 풀이 고쳐 쓰기(①30 — 틀린 줄 고르기로 실었다).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, inline } = B.kit;
  const STD1 = '9수02-11', STD2 = '9수02-12';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 유리수·수를 적는 글·문항 도구는 공용 파일(middle.js 의 B.kit.mid)에 있다.
  const { LAB, MINUS, GT, LT, GE, LE, gcd, lcm, Q, dc, plainQ, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, digits, mag, tx, nb, tail, lastOf, sj, js, V, sup, emOf, fit, tag, nline, nz, pm, asQ, ineqAns } = B.kit.mid;
  const x = V('x'), va = V('a'), vb = V('b'), vc = V('c');
  const iq = (n) => tx(Q(n));

  // ── 부등호 ──
  // 부등호는 '<' | '<=' | '>' | '>=' 로 다룬다. RH 화면 글, FLIP 방향을 바꾼 것, NOT 「성립하지 않는다」일 때의 것.
  const RELS = ['<', '<=', '>', '>='];
  const RH = { '<': LT, '<=': LE, '>': GT, '>=': GE };
  const FLIP = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };
  const NOT = { '<': '>=', '<=': '>', '>': '<=', '>=': '<' };
  const strict = (r) => r === '<' || r === '>';
  const up = (r) => r === '>' || r === '>=';
  const cmpOk = (c, r) => (r === '<' ? c < 0 : r === '<=' ? c <= 0 : r === '>' ? c > 0 : c >= 0);

  // ── 식의 겉모습 ──
  // 한 변은 항의 배열이다. 항의 종류:
  //  tm(c, vs)           단항식 c × (문자들). vs 는 문자를 이어 적은 글('' 상수항, 'x', 'a', 'ax', 'X' 는 x²). c 는 수나 유리수(dc 로 준 수는 소수로 적는다).
  //  tg(m, list, br, vs) 묶음 m × (문자들) × (list). m 이 1이면 (…), −1이면 −(…)로 적는다. br: '(' | '{'
  //  tf(list, den, s)    분수 ±(list)/den. 분자가 일차식인 분수. s 는 +1 | −1
  //  tb(label, s)        빈칸(그리기만 한다)
  const VH = (vs) => vs.split('').map((n) => (n === 'X' ? V('x') + sup(2) : V(n))).join('');
  const tm = (c, vs) => ({ k: 'm', c: asQ(c), vs: vs || '' });
  const tg = (m, list, br, vs) => ({ k: 'g', m: asQ(m), list, br: br || '(', vs: vs || '' });
  const tf = (list, den, s) => ({ k: 'f', list, den, s: s || 1 });
  const tb = (label, s) => ({ k: 'b', label, s: s || 1 });
  // 계수가 0인 항은 빼고 적은 변(모두 0이면 0)
  const ts = (...pairs) => { const out = pairs.filter(([c]) => asQ(c).p !== 0).map(([c, vs]) => tm(c, vs)); return out.length ? out : [tm(0, '')]; };
  const sgn = (t) => (t.k === 'm' ? (t.c.p < 0 ? -1 : 1) : t.k === 'g' ? (t.m.p < 0 ? -1 : 1) : t.s);
  const isOne = (q) => q.p === 1 && q.q === 1 && !q.d;
  const BRK = { '(': ['(', ')'], '{': ['{', '}'] };
  // 항의 크기 부분(부호는 변을 적을 때 붙인다). 분수 계수는 x/3, (2/3)x 꼴로 적는다.
  function magT(t, bare) {
    if (t.k === 'b') return box(t.label);
    if (t.k === 'f') return frac(sideH(t.list, true), t.den);
    if (t.k === 'g') { const m = qabs(t.m); return (isOne(m) ? '' : mag(m)) + VH(t.vs) + BRK[t.br][0] + sideH(t.list, bare) + BRK[t.br][1]; }
    const c = qabs(t.c);
    if (!t.vs) return mag(c);
    if (c.d || c.q === 1) return (isOne(c) ? '' : mag(c)) + VH(t.vs);
    return c.p === 1 ? frac(VH(t.vs), c.q) : frac(c.p, c.q) + VH(t.vs);
  }
  // 한 변을 적은 글. bare 이면 연산 기호를 글자 그대로(글줄·보기), 아니면 식 글꼴에 맞춘 <i> 로 감싼다(그림).
  function sideH(list, bare) {
    const op = (s) => (bare ? ' ' + (s < 0 ? MINUS : '+') + ' ' : ' <i>' + (s < 0 ? MINUS : '+') + '</i> ');
    return list.map((t, i) => (i === 0 ? (sgn(t) < 0 ? MINUS : '') : op(sgn(t))) + magT(t, bare)).join('');
  }
  const relH = (r, bare) => (bare ? ' ' + (RH[r] || r) + ' ' : ' <i>' + (RH[r] || r) + '</i> ');
  // 부등식(r 에 '=' 를 주면 등식)
  const ineqH = (L, r, R, bare) => sideH(L, bare) + relH(r, bare) + sideH(R, bare);
  // 식의 너비 어림(분자가 식인 분수는 분자와 분모 가운데 긴 쪽만 센다). 문자는 숫자보다 넓으므로 조금씩 더하고,
  // 실제 사이트의 읽기 글꼴(바탕체)에서도 문항 칸을 넘지 않게 7 % 넉넉히 잡는다(7-1-4 에서 잰 값).
  const FRAC = /<span class="mb-frac"><span>(.*?)<\/span><span class="mb-frac-bar">\/<\/span><span>(.*?)<\/span><\/span>/g;
  const emRaw = (h) => { let extra = 0; const rest = String(h).replace(FRAC, (m, n, den) => { extra += Math.max(emOf(n), emOf(den)) + 0.62; return ''; }); return emOf(rest) + extra; };
  const emQ = (h) => 1.07 * emRaw(h) + 0.1 * (String(h).match(/class="mb-var"/g) || []).length;
  // 그림 자리에 적는 식(휴대폰 너비에 맞게 글씨를 줄인다)
  const exq = (h, extra) => '<span class="mb-expr"' + fit(emQ(h) + (extra || 0)) + '>' + h + '</span>';
  // 글줄 안의 식: 짧으면 줄이 바뀌지 않게 통째로 묶고, 길면 연산 기호·부등호 앞에서만 줄이 바뀌게 조각마다 묶는다.
  const BREAK = /^ (?:[+−=≤≥≠]|&lt;|&gt;) /;
  function chunks(h) {
    const out = []; let depth = 0, span = 0, from = 0;
    for (let i = 0; i < h.length; i += 1) {
      if (h.startsWith('<span', i)) span += 1; else if (h.startsWith('</span>', i)) span -= 1;
      else if (h[i] === '(' || h[i] === '{') depth += 1; else if (h[i] === ')' || h[i] === '}') depth -= 1;
      else if (depth === 0 && span === 0 && h[i] === ' ' && BREAK.test(h.slice(i, i + 6))) { out.push(h.slice(from, i)); from = i + 1; }
    }
    return out.concat([h.slice(from)]).map(nb).join(' ');
  }
  const keep = (h) => (emQ(h) < 12.5 ? nb(h) : chunks(h));
  const xu = (unit) => nb(`${x} ${unit}`);
  const iqB = (L, r, R) => keep(ineqH(L, r, R, true));
  const iqF = (L, r, R) => exq(ineqH(L, r, R, false));
  const termH = (c, vs) => sideH([tm(c, vs)], true);
  // 해를 적은 글: x ≥ −3
  const solH = (name, r, v) => nb(`${V(name)} ${RH[r]} ${tx(asQ(v))}`);
  // 이름표를 붙인 식 여러 줄(글씨 크기는 가장 긴 줄에 맞춘다)
  const tagEq = (list, tags) => { const style = fit(Math.max(...list.map(emQ)) + 2.6); return lines(list.map((h, i) => tag((tags || LAB)[i]) + '<span class="mb-expr"' + style + '>' + h + '</span>')); };
  // 한 줄씩 적은 풀이 과정. 줄은 { h 식, mark 줄 끝의 이름표 }이거나 { note 화살표 옆에 적는 글 }이다.
  function procFig(rows) {
    const style = fit(Math.max(...rows.filter((r) => r.h).map((r) => emQ(r.h) + (r.mark ? 2.2 : 0)))) || ' style="font-size:1.2rem"';
    return lines(rows.map((r) => (r.note != null ? '<span style="font-size:0.95rem;color:#475569">↓ ' + r.note + '</span>'
      : '<span class="mb-expr"' + style + '>' + r.h + (r.mark ? '<span style="margin-left:0.6em;font-weight:700;color:#1d4ed8">' + r.mark + '</span>' : '') + '</span>')));
  }

  // ── 식의 값과 셈 ──
  // env: 문자마다의 값(유리수). x² 은 'X' 로 따로 준다.
  const evT = (t, env) => (t.k === 'm' ? t.vs.split('').reduce((v, n) => qmul(v, env[n]), plainQ(t.c))
    : t.k === 'g' ? t.vs.split('').reduce((v, n) => qmul(v, env[n]), qmul(plainQ(t.m), evS(t.list, env))) : qmul(Q(t.s, t.den), evS(t.list, env)));
  const evS = (list, env) => list.reduce((s, t) => qadd(s, evT(t, env)), Q(0));
  // 수를 넣었을 때 부등식이 참인가
  const holds = (L, r, R, env) => cmpOk(qcmp(evS(L, env), evS(R, env)), r);
  // 문자 u 에 대한 일차식 au + b 로 모은 계수
  const gather = (list, u, env) => { const at = (v) => evS(list, Object.assign({}, env, { [u]: Q(v) })); const b = at(0); return { a: qsub(at(1), b), b }; };
  const sideOf = (a, b, u) => ts([a, u], [b, '']);
  // 부등식의 해 { v 경계(유리수), rel 부등호 }. x 의 항이 사라지면 null
  function solI(L, r, R, u, env) {
    const l = gather(L, u || 'x', env), rr = gather(R, u || 'x', env), p = qsub(l.a, rr.a);
    return p.p === 0 ? null : { v: qdiv(qsub(rr.b, l.b), p), rel: p.p < 0 ? FLIP[r] : r };
  }
  // x² 까지 있는 식에서 정리한 (좌변 − 우변) = a x² + b x + c
  function quad(L, R) {
    const at = (v) => { const env = { x: Q(v), X: Q(v * v) }; return qsub(evS(L, env), evS(R, env)); }, c = at(0), p = at(1), m = at(-1);
    return { a: qsub(qmul(qadd(p, m), Q(1, 2)), c), b: qmul(qsub(p, m), Q(1, 2)), c };
  }
  // 괄호를 푼 꼴
  const xpT = (t) => (t.k === 'm' ? [[t.c, t.vs]] : xpS(t.list).map(([c, vs]) => [qmul(t.k === 'g' ? t.m : Q(t.s, t.den), c), vs]));
  const xpS = (list) => list.reduce((all, t) => all.concat(xpT(t)), []);
  const flatS = (list) => ts(...xpS(list));
  // 양변에 n 을 곱한 꼴(분모와 소수를 없앤다)
  function scT(t, n) {
    if (t.k === 'm') return [tm(qmul(t.c, Q(n)), t.vs)];
    if (t.k === 'g') { const m = qmul(t.m, Q(n)); return isOne(m) ? t.list : [tg(m, t.list, t.br)]; }
    const k = t.s * n / t.den;
    return k === 1 ? t.list : [tg(k, t.list)];
  }
  const scS = (list, n) => list.reduce((all, t) => all.concat(scT(t, n)), []);
  const denQ = (q) => (q.d ? 10 ** q.d : q.q);
  const denS = (list) => list.reduce((m, t) => lcm(m, t.k === 'f' ? t.den : denQ(t.k === 'g' ? t.m : t.c)), 1);
  // 소수를 분수로 고친 꼴
  const undec = (list) => list.map((t) => (t.k === 'm' ? tm(plainQ(t.c), t.vs) : t.k === 'g' ? tg(plainQ(t.m), t.list, t.br) : t));
  const hasDec = (list) => list.some((t) => (t.k === 'm' && t.c.d) || (t.k === 'g' && t.m.d));
  const hasFrac = (list) => list.some((t) => t.k === 'f' || (t.k === 'm' && !t.c.d && t.c.q > 1) || (t.k === 'g' && !t.m.d && t.m.q > 1));
  // 문자 n 에 수 q 를 넣은 꼴
  const subT = (t, n, q) => (t.k === 'm' ? tm(t.vs.split('').filter((c) => c === n).reduce((c) => qmul(c, q), t.c), t.vs.split('').filter((c) => c !== n).join('')) : t.k === 'g' ? tg(t.m, subS(t.list, n, q), t.br) : tf(subS(t.list, n, q), t.den, t.s));
  const subS = (list, n, q) => list.map((t) => subT(t, n, q));
  const hasG = (list) => list.some((t) => t.k !== 'm');
  const tidy = (list, u) => list.filter((t) => t.vs === u).length <= 1 && list.filter((t) => t.vs === '').length <= 1;

  // ── 검사가 다시 셈하는 식 ──
  // 소수와 분수가 든 식을 그대로 셈하면 값이 어긋나므로(0.14 × 100), 화면에 적힌 숫자로 정수끼리만 셈하는 식을 적는다.
  // 항마다 분모(소수는 10·100)를 없애는 수 S 를 곱한 정수 식으로 적는다. 화면에 없는 수(S ÷ 분모, 10, 100)는 extra 에 모아 facts.unseen 으로 밝힌다.
  const denC = (q) => (q.d ? 10 ** q.d : q.q);
  const denT = (t) => (t.k === 'm' ? denC(t.c) : t.k === 'g' ? denC(t.m) * denL(t.list) : t.den * denL(t.list));
  const denL = (list) => list.reduce((m, t) => lcm(m, denT(t)), 1);
  // 계수의 분자(소수는 소수점을 뗀 수)를 화면에 적힌 숫자로 적는다: 0.25 → 25, 1.5 → (1*10+5), 3/4 → 3
  function numJ(q, extra) {
    const c = qabs(q);
    if (!c.d) return String(c.p);
    const [ip, fp] = digits(c).split('.'), f = String(Number(fp));
    if (f !== fp) extra.add(Number(fp));
    if (Number(ip) === 0) return f;
    extra.add(10 ** c.d);
    return `(${ip}*${10 ** c.d}+${f})`;
  }
  function jsT(t, S, env, extra) {
    const times = (k) => { if (k === 1) return ''; extra.add(k); return '*' + k; };
    if (t.k === 'm') {
      const vars = t.vs.split('').map((n) => env[n]), c = qabs(t.c);
      return (isOne(c) && vars.length ? [] : [numJ(t.c, extra)]).concat(vars).join('*') + times(S / denC(t.c));
    }
    const n = denL(t.list), inner = '(' + jsS(t.list, n, env, extra) + ')';
    if (t.k === 'g') return (isOne(qabs(t.m)) ? [] : [numJ(t.m, extra)]).concat(t.vs.split('').map((v) => env[v]), [inner]).join('*') + times(S / (denC(t.m) * n));
    return inner + times(S / (t.den * n));
  }
  const jsS = (list, S, env, extra) => list.map((t, i) => (sgn(t) < 0 ? '-' : i ? '+' : '') + jsT(t, S, env, extra)).join('');
  // L = R 이 되는 문자 u 의 값(부등식의 해의 경계)을 다시 셈하는 식: u 에 0과 1을 넣은 (좌변 − 우변)의 값 f(0), f(1)로 −f(0) ÷ {f(1) − f(0)}을 셈한다.
  function solJ(L, R, u, env) {
    const S = lcm(denL(L), denL(R)), extra = new Set([0, 1]);
    const at = (v) => { const e = Object.assign({}, env, { [u || 'x']: v }); return `(${jsS(L, S, e, extra)})-(${jsS(R, S, e, extra)})`; };
    return { expr: `-(${at('0')})/((${at('1')})-(${at('0')}))`, unseen: [...extra] };
  }
  // 정수 x 를 차례로 넣어 보는 검사(facts.range)에 적는 부등식 글. 검사가 < 와 > 만 읽으므로 ≤ 는 「< 우변 + 1」로 적는다(양변이 정수가 되게 S 를 곱했다).
  function rangeJ(L, r, R) {
    const S = lcm(denL(L), denL(R)), extra = new Set(), e = { x: '(x)' }, l = jsS(L, S, e, extra), rr = jsS(R, S, e, extra);
    return r === '<' ? `${l}<${rr}` : r === '>' ? `${l}>${rr}` : r === '<=' ? `${l}<${rr}+1` : `${l}>${rr}-1`;
  }

  // ── 풀이 글 ──
  // 부등식 L r R(문자 u 에 대한 일차부등식)을 푸는 과정을 한 단계씩 적는다: 분모·소수 없애기 → 괄호 풀기 → 동류항 정리 → 이항 → 양변을 나누기(음수이면 방향이 바뀐다).
  function solve(L, r, R, u) {
    const name = u || 'x', say = [];
    let l = L, rr = R;
    if ((hasDec(l) || hasDec(rr)) && (hasFrac(l) || hasFrac(rr))) { l = undec(l); rr = undec(rr); say.push(`소수를 분수로 고치면 ${iqB(l, r, rr)}`); }
    const n = lcm(denS(l), denS(rr));
    if (n > 1) { l = scS(l, n); rr = scS(rr, n); say.push(`양변에 ${n}${tail(n, '을/를')} 곱하면 ${iqB(l, r, rr)}`); }
    if (hasG(l) || hasG(rr)) { l = flatS(l); rr = flatS(rr); say.push(`괄호를 풀면 ${iqB(l, r, rr)}`); }
    const gl = gather(l, name), gr = gather(rr, name);
    if (!tidy(l, name) || !tidy(rr, name)) { l = sideOf(gl.a, gl.b, name); rr = sideOf(gr.a, gr.b, name); say.push(`동류항끼리 정리하면 ${iqB(l, r, rr)}`); }
    const p = qsub(gl.a, gr.a), q = qsub(gr.b, gl.b);
    if (gl.b.p !== 0 || gr.a.p !== 0) {
      const left = (gl.a.p !== 0 ? [tm(gl.a, name)] : []).concat(gr.a.p !== 0 ? [tm(qneg(gr.a), name)] : []), right = (gr.b.p !== 0 ? [tm(gr.b, '')] : []).concat(gl.b.p !== 0 ? [tm(qneg(gl.b), '')] : []);
      const what = gl.b.p !== 0 && gr.a.p !== 0 ? `${V(name)}를 포함한 항은 좌변으로, 상수항은 우변으로 이항하면` : gl.b.p !== 0 ? `${sj(gl.b, '을/를')} 이항하면` : `우변의 ${termH(gr.a, name)}를 이항하면`;
      const moved = iqB(left, r, right.length ? right : [tm(0, '')]);
      say.push(left.length + right.length > 2 ? `${what} ${moved}, ${iqB([tm(p, name)], r, [tm(q, '')])}` : `${what} ${moved}`);
    }
    const v = qdiv(q, p), rel = p.p < 0 ? FLIP[r] : r, sol = solH(name, rel, v);
    if (!isOne(p)) say.push(p.p < 0 ? `양변을 음수 ${tx(p)}${tail(lastOf(p), '으로/로')} 나누면 부등호의 방향이 바뀌어 ${sol}` : `양변을 ${tx(p)}${tail(lastOf(p), '으로/로')} 나누면 ${sol}`);
    return { v, rel, p, q, sol, text: say.map((s) => s + '이다.').join(' ') };
  }

  // ── 부등식을 견주는 도구 ──
  // (좌변 − 우변)을 문자 names 의 일차식으로 본 [상수항, 문자마다의 계수]
  function diffOf(L, R, names) {
    const zero = {}; names.forEach((n) => { zero[n] = Q(0); });
    const at = (env) => qsub(evS(L, env), evS(R, env)), c = at(zero);
    return [c].concat(names.map((n) => qsub(at(Object.assign({}, zero, { [n]: Q(1) })), c)));
  }
  // 부등식 E 가 부등식 P 에서 부등식의 성질로 얻어지는가: (좌변 − 우변)이 양수 배이면 부등호가 같고, 음수 배이면 방향이 반대여야 한다.
  function relate(P, E, names) {
    const u = diffOf(P[0], P[2], names), v = diffOf(E[0], E[2], names), at = u.findIndex((c) => c.p !== 0);
    if (at < 0 || v[at].p === 0) return false;
    const k = qdiv(v[at], u[at]);
    if (!u.every((c, i) => qcmp(qmul(c, k), v[i]) === 0)) return false;
    return E[1] === (k.p > 0 ? P[1] : FLIP[P[1]]);
  }

  // ── 문항 도구 ──
  const SOLVE = '다음 일차부등식을 푸시오.';
  const anyRel = (d) => d.pick(RELS);
  // 옳은 것 하나와 나머지를 섞는다.
  const mix = (d, right, others) => { const rows = d.shuffle([right].concat(others)); return { rows, at: rows.indexOf(right) }; };
  // 해의 경계가 답의 꼴에 맞고 수가 크지 않은가
  const nice = (v, kind) => Boolean(v) && (kind === 'int' ? v.q === 1 && v.p !== 0 && Math.abs(v.p) <= 12 : v.q > 1 && v.q <= 12 && Math.abs(v.p) <= 30);
  // 조건에 맞는 부등식 [L, r, R]이 나올 때까지 다시 만든다(경계의 꼴과 크기, 정리한 px r q 의 크기).
  // 분자가 식인 분수가 더 줄여지지 않는가((2x − 6)/2 같은 것은 쓰지 않는다)
  const lean = (list) => list.every((t) => t.k !== 'f' || t.list.reduce((g, u) => gcd(g, Math.abs(u.c.p)), t.den) === 1);
  const pickIq = (d, make, kind, ok) => d.until(make, ([L, r, R]) => {
    const s = solI(L, r, R); if (!s || !nice(s.v, kind) || !lean(L) || !lean(R)) return false;
    const n = lcm(denS(undec(L)), denS(undec(R))), l = gather(L, 'x'), rr = gather(R, 'x'), p = qmul(qsub(l.a, rr.a), Q(n)), q = qmul(qsub(rr.b, l.b), Q(n));
    return Math.abs(p.p) <= 60 && Math.abs(q.p) <= 150 && (!ok || ok(L, r, R, s));
  });
  // 부등식 하나를 푸는 문항(해의 경계가 정수). 같은 꼴의 부등식이 여럿이므로 구조의 이름(rule)을 단다.
  function solveQ(L, r, R, rule, o) {
    const s = solve(L, r, R, 'x'), opt = o || {}, j = solJ(L, R, 'x', {});
    if (s.v.q !== 1) throw new Error('해의 경계가 정수가 아니다');
    return ineqAns(opt.text || SOLVE, s.rel, s.v.p, x, { figure: opt.figure || iqF(L, r, R), explain: opt.explain || (opt.lead || '') + s.text, facts: { calc: [[j.expr, 1]], unseen: j.unseen, rule } });
  }
  // 해의 경계가 분수인 부등식의 해 고르기. 틀린 보기: 방향을 바꾸지 않은(잘못 바꾼) 것, 부호가 반대인 것.
  function solveC(d, L, r, R, rule, o) {
    const s = solve(L, r, R, 'x'), opt = o || {}, cand = [[s.rel, s.v], [FLIP[s.rel], s.v], [s.rel, qneg(s.v)], [FLIP[s.rel], qneg(s.v)]], rows = d.shuffle(cand);
    return C(opt.text || '다음 일차부등식의 해는?', rows.map(([rel, v]) => solH('x', rel, v)), rows.indexOf(cand[0]), {
      figure: opt.figure || iqF(L, r, R), explain: (opt.lead || '') + s.text, facts: { truth: rows.map(([rel, v]) => rel === s.rel && qcmp(v, s.v) === 0), want: true, rule }
    });
  }
  // 해가 「x rel v」인 부등식을 짓는다. shape: 'ax'(ax r c) · 'one'(ax + b r c) · 'both'(ax + b r cx + e) · 'paren'(m(x + b) r cx + e) · 'div'(x/k r c)
  function craft(d, rel, v0, shape) {
    const v = asQ(v0), int = (q) => q.q === 1, u = () => nz(d, -9, 9);
    const make = {
      ax: () => { const a = pm(d) * d.int(2, 6) * v.q; return [ts([a, 'x']), ts([qmul(Q(a), v), ''])]; },
      one: () => { const a = pm(d) * d.int(2, 6) * v.q, b = u(); return [d.bool() ? ts([a, 'x'], [b, '']) : ts([b, ''], [a, 'x']), ts([qadd(qmul(Q(a), v), Q(b)), ''])]; },
      both: () => { const [a, c] = d.until(() => [nz(d, -7, 7), nz(d, -7, 7)], ([p, q]) => p !== q && (p - q) % v.q === 0), b = u(); return [ts([a, 'x'], [b, '']), ts([c, 'x'], [qadd(qmul(Q(a - c), v), Q(b)), ''])]; },
      paren: () => { const m = pm(d) * d.int(2, 4), b = nz(d, -5, 5), c = d.until(() => nz(d, -6, 6), (w) => w !== m && (m - w) % v.q === 0); return [[tg(m, ts([1, 'x'], [b, '']))], ts([c, 'x'], [qadd(qmul(Q(m - c), v), Q(m * b)), ''])]; },
      div: () => { const k = pm(d) * d.int(2, 4); return [ts([Q(1, k), 'x']), ts([qdiv(v, Q(k)), ''])]; }
    }[shape];
    const [L, R] = d.until(make, ([l, rr]) => int(evS(rr, { x: Q(0) })) && int(evS(l, { x: Q(0) })) && Math.abs(evS(rr, { x: Q(0) }).p) <= 40);
    const p = qsub(gather(L, 'x').a, gather(R, 'x').a);
    return [L, p.p < 0 ? FLIP[rel] : rel, R];
  }

  // ── 부등식의 성질: 식의 꼴 ──
  // 문자 v 에 대한 일차식 m v + c 를 한 가지 모양으로 적고(list), a ○ b 에서 그 식을 얻는 차례(steps)를 함께 둔다.
  // steps: ['add', c] 양변에 c 를 더한다(음수면 뺀다) / ['mul', k] 양변에 k 를 곱한다 / ['div', k] 양변을 k 로 나눈다.
  const FORM = {
    id: () => ({ m: Q(1), c: Q(0), steps: [], list: (v) => ts([1, v]) }),
    add: (k) => ({ m: Q(1), c: Q(k), steps: [['add', k]], list: (v) => ts([1, v], [k, '']) }),                               // a + 7, a − 8
    subneg: (k) => ({ m: Q(1), c: Q(k), steps: [['add', k]], h: (v) => `${V(v)} − (−${k})` }),                               // a − (−5)
    mul: (k) => ({ m: Q(k), c: Q(0), steps: [['mul', k]], list: (v) => ts([k, v]) }),                                        // 4a, −4a
    div: (k) => ({ m: Q(1, k), c: Q(0), steps: [['div', k]], list: (v) => ts([Q(1, k), v]) }),                               // a/2, −a/3
    lin: (k, c) => ({ m: Q(k), c: Q(c), steps: (k === 1 ? [] : [['mul', k]]).concat([['add', c]]), list: (v) => ts([k, v], [c, '']) }),                // 2a − 1, −a + 5
    rev: (k, c) => ({ m: Q(k), c: Q(c), steps: (k === 1 ? [] : [['mul', k]]).concat([['add', c]]), list: (v) => ts([c, ''], [k, v]) }),                // 4 − 3a
    linDiv: (k, c) => ({ m: Q(1, k), c: Q(c), steps: [['div', k], ['add', c]], list: (v) => ts([Q(1, k), v], [c, '']) }),    // a/4 − 5
    revDiv: (k, c) => ({ m: Q(1, k), c: Q(c), steps: [['div', k], ['add', c]], list: (v) => ts([c, ''], [Q(1, k), v]) }),    // 1 − a/4, −5 + a/4
    paren: (k, c) => ({ m: Q(k), c: Q(k * c), steps: [['add', c], ['mul', k]], list: (v) => [tg(k, ts([1, v], [c, '']))] }),  // 3(a + 1)
    linFrac: (p, q, c) => ({ m: Q(p, q), c: Q(c), steps: [['mul', p], ['div', q], ['add', c]], list: (v) => ts([Q(p, q), v], [c, '']) }),           // −(3/4)a + 2
    over: (c, k) => ({ m: Q(1, k), c: Q(c, k), steps: [['add', c], ['div', k]], list: (v) => [tf(ts([1, v], [c, '']), k, 1)] }) // (a + 1)/5
  };
  const formH = (f, v) => (f.h ? f.h(v) : sideH(f.list(v), true));
  // 식의 꼴을 수에 적용한 값
  const formAt = (f, k) => qadd(qmul(f.m, Q(k)), f.c);
  // 한 걸음을 말로: 양변에 한 일과 그 뒤의 부등호
  function stepSay([op, k], rel) {
    const n = Math.abs(k), flip = (op === 'mul' || op === 'div') && k < 0, next = flip ? FLIP[rel] : rel;
    const what = op === 'add' ? (k > 0 ? `양변에 ${n}${tail(n, '을/를')} 더하면` : `양변에서 ${n}${tail(n, '을/를')} 빼면`)
      : op === 'mul' ? `양변에 ${k < 0 ? '음수 ' : ''}${iq(k)}${tail(n, '을/를')} 곱하면${flip ? ' 부등호의 방향이 바뀌어' : ''}`
        : `양변을 ${k < 0 ? '음수 ' : ''}${iq(k)}${tail(n, '으로/로')} 나누면${flip ? ' 부등호의 방향이 바뀌어' : ''}`;
    return { what, next };
  }
  const applyStep = ([op, k], { m, c }) => (op === 'add' ? { m, c: qadd(c, Q(k)) } : op === 'mul' ? { m: qmul(m, Q(k)), c: qmul(c, Q(k)) } : { m: qdiv(m, Q(k)), c: qdiv(c, Q(k)) });
  const undoStep = ([op, k]) => (op === 'add' ? ['add', -k] : op === 'mul' ? ['div', k] : ['mul', k]);
  // 「A ○ B」에서 걸음을 차례로 밟아 간 글. side(m, c): 그때의 두 변을 적는 함수 [왼쪽, 오른쪽], last: 마지막 줄에 적을 글 [왼쪽, 오른쪽](주지 않으면 side 로 적는다)
  function walk(rel, from, steps, side, last) {
    let state = from, now = rel; const out = [];
    steps.forEach((step, i) => {
      const said = stepSay(step, now); state = applyStep(step, state); now = said.next;
      const [l, r] = i === steps.length - 1 && last ? last : side(state.m, state.c);
      out.push(`${said.what} ${nb(`${l} ${RH[now]} ${r}`)}`);
    });
    return { rel: now, text: out.join('이고, ') + (out.length ? '이다.' : '') };
  }
  const pairOf = (p, q) => (m, c) => [sideH(ts([m, p], [c, '']), true), sideH(ts([m, q], [c, '']), true)];
  // a ○ b 에서 식 f 의 부등식을 얻는 글과 그 부등호
  const formTold = (f, rel, p, q) => walk(rel, { m: Q(1), c: Q(0) }, f.steps, pairOf(p || 'a', q || 'b'), [formH(f, p || 'a'), formH(f, q || 'b')]);
  // 식 f 의 부등식에서 거꾸로 a ○ b 를 얻는 글과 그 부등호
  const formBack = (f, rel, p, q) => walk(rel, { m: f.m, c: f.c }, f.steps.slice().reverse().map(undoStep), pairOf(p || 'a', q || 'b'));
  const formRel = (f, rel) => (f.m.p > 0 ? rel : FLIP[rel]);
  const stmt = (f, rel, p, q) => nb(`${formH(f, p || 'a')} ${RH[rel]} ${formH(f, q || 'b')}`);

  // 해를 나타낸 수직선. 보기 그림은 그림 설명이 답(끝점의 ○·●와 방향)을 말하지 않게 꼴만 적는다.
  const rayLine = (lo, hi, at, dir, closed, label) => {
    const svg = nline(lo, hi, { rays: [{ at, dir, closed }] });
    return label ? svg.replace(/aria-label="[^"]*"/, `aria-label="${label}"`) : svg;
  };

  B.addUnit({
    id: '8-1-3', grade: 8, semester: 1, no: 3, title: '일차부등식', version: 2,
    groups: [
      {
        id: 'ineq', title: '부등식과 그 해', standard: STD1,
        types: [
          T('ineq-count', '식 목록에서 부등식의 개수 세기', '①1 ②1 심1', (d) => {
            const a = d.int(2, 5), b = d.int(2, 9), c = d.until(() => d.int(2, 9), (v) => v !== b), e = d.int(1, 9), op = (s) => ` <i>${s}</i> `;
            // 문자가 없어도 부등호가 있으면 부등식이다. 등호나 ≠ 를 쓴 식, 부등호가 없는 식은 부등식이 아니다.
            const yes = [{ h: `${b}${op('+')}${c}${op(GT)}${b}`, why: '문자는 없지만 부등호가 있는 부등식' }].concat(d.shuffle([
              { h: ineqH(ts([a, 'x'], [-b, '']), '>=', ts([c, ''])), why: '부등식' }, { h: ineqH(ts([1, 'x'], [-e, '']), '<', ts([1, 'x'], [b, ''])), why: '부등식' },
              { h: ineqH(ts([a + 1, 'a']), '<', ts([-a, 'a'], [e, ''])), why: '부등식' }, { h: ineqH([tg(a, ts([1, 'x'], [-1, '']))], '<=', ts([b, ''])), why: '부등식' }
            ]));
            const no = [{ h: sideH(ts([2, 'x'], [-(b + c), ''])) + op('≠') + x, why: '≠를 사용한 식' }].concat(d.shuffle([
              { h: sideH(ts([-a, 'x'], [e, ''])), why: '부등호가 없는 식' }, { h: ineqH(ts([a, 'x'], [-1, '']), '=', ts([c, ''])), why: '등식' },
              { h: `${V('y')}${op('=')}${sideH(ts([a, 'x'], [-b, '']))}`, why: '등식' }, { h: `${a}${op('×')}${b}${op('+')}${e}${op('=')}${a * b + e}`, why: '등식' }
            ]));
            const k = d.int(2, 3), rows = d.shuffle(yes.slice(0, k).concat(no.slice(0, 5 - k))), flags = rows.map((r) => yes.includes(r));
            return N('다음 중 부등식은 모두 몇 개인가?', k, {
              unit: '개', figure: tagEq(rows.map((r) => r.h)),
              explain: `부등식은 부등호 ${LT}, ${GT}, ${LE}, ${GE}를 사용하여 수 또는 식의 대소 관계를 나타낸 식이다. ${rows.map((r, i) => `${LAB[i]}은 ${r.why}`).join(', ')}이다. 부등식은 ${LAB.filter((_, i) => flags[i]).join(', ')}의 ${k}개이다.`,
              facts: { count: flags }
            });
          }),
          T('ineq-range-word', '수의 범위를 말한 문장을 부등호로 나타내기', '①2', (d) => {
            // 「크지 않다」와 「작지 않다」가 꼭 들어간다. 나머지 한 줄은 이상·이하·초과·미만 가운데 하나.
            const first = d.pick([['>=', '이상이다', '「이상」은 크거나 같다는 뜻이다'], ['<=', '이하이다', '「이하」는 작거나 같다는 뜻이다'], ['>', '초과이다', '「초과」는 그 수보다 크다는 뜻이다'], ['<', '미만이다', '「미만」은 그 수보다 작다는 뜻이다']]);
            const ks = d.shuffle([-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), names = ['a', 'x', 'y'];
            const rows = d.shuffle([
              { r: first[0], said: (v, k) => `${v}는 ${iq(k)} ${first[1]}.`, why: first[2] },
              { r: '<=', said: (v, k) => `${v}는 ${iq(k)}보다 크지 않다.`, why: '「크지 않다」는 「작거나 같다」와 같은 뜻이다' },
              { r: '>=', said: (v, k) => `${v}는 ${iq(k)}보다 작지 않다.`, why: '「작지 않다」는 「크거나 같다」와 같은 뜻이다' }
            ]).map((row, i) => Object.assign({ k: ks[i], v: names[i] }, row));
            const inputs = rows.reduce((all, row) => all.concat([{ rel: true, answer: row.r }, { answer: row.k, signed: true }]), []);
            return inline('다음을 부등식으로 나타내시오.', rows.map((row, i) => `${tag(LAB[i])}${V(row.v)} {${2 * i}} {${2 * i + 1}}`).join('<br>'), inputs, {
              figure: lines(rows.map((row, i) => tag(LAB[i]) + row.said(V(row.v), row.k))),
              shown: rows.map((row, i) => `${LAB[i]} ${solH(row.v, row.r, row.k)}`).join(', '),
              explain: rows.map((row, i) => `${LAB[i]} ${row.why}. 따라서 ${solH(row.v, row.r, row.k)}이다.`).join(' '),
              facts: { calc: rows.map((row, i) => [js(Q(row.k)), 2 * i + 1]) }
            });
          }),
          T('ineq-sentence', '문장을 부등식으로 나타내기', '①3 ①4 ②2 ②3', (d, n) => {
            // 첫째는 수에 대한 문장(크지 않다·작지 않다와 괄호), 둘째는 생활 속 상황(넘지 않는다·적다·이상)이다.
            const build = () => {
              if (n === 0) {
                const a = d.int(2, 5), b = d.int(1, 9), c = d.int(11, 30), kind = d.int(0, 2);
                if (kind === 0) return {
                  said: `어떤 수 ${x}의 ${a}배에서 ${b}${tail(b, '을/를')} 뺀 수는 ${c}보다 작지 않다.`, right: [ts([a, 'x'], [-b, '']), '>=', ts([c, ''])],
                  wrongs: [[ts([a, 'x'], [-b, '']), '>', ts([c, ''])], [ts([a, 'x'], [-b, '']), '<=', ts([c, ''])], [[tg(a, ts([1, 'x'], [-b, '']))], '>=', ts([c, ''])]],
                  why: `${x}의 ${a}배에서 ${b}${tail(b, '을/를')} 뺀 수는 ${nb(sideH(ts([a, 'x'], [-b, '']), true))}이고, 「작지 않다」는 「크거나 같다」와 같은 뜻이므로 ${GE}로 나타낸다.`
                };
                if (kind === 1) return {
                  said: `${x}에서 ${b}${tail(b, '을/를')} 뺀 수의 ${a}배는 ${c}보다 크지 않다.`, right: [[tg(a, ts([1, 'x'], [-b, '']))], '<=', ts([c, ''])],
                  wrongs: [[ts([a, 'x'], [-b, '']), '<=', ts([c, ''])], [[tg(a, ts([1, 'x'], [-b, '']))], '<', ts([c, ''])], [[tg(a, ts([1, 'x'], [-b, '']))], '>=', ts([c, ''])]],
                  why: `${x}에서 ${b}${tail(b, '을/를')} 뺀 수의 ${a}배는 ${nb(sideH([tg(a, ts([1, 'x'], [-b, '']))], true))}이고, 「크지 않다」는 「작거나 같다」와 같은 뜻이므로 ${LE}로 나타낸다.`
                };
                return {
                  said: `${x}의 ${a}배는 ${x}에 ${b}${tail(b, '을/를')} 더한 수보다 크지 않다.`, right: [ts([a, 'x']), '<=', ts([1, 'x'], [b, ''])],
                  wrongs: [[ts([a, 'x']), '<', ts([1, 'x'], [b, ''])], [ts([a, 'x']), '>=', ts([1, 'x'], [b, ''])], [[tg(a, ts([1, 'x'], [b, '']))], '<=', ts([1, 'x'])]],
                  why: `${x}에 ${b}${tail(b, '을/를')} 더한 수는 ${nb(sideH(ts([1, 'x'], [b, '']), true))}이고, 「크지 않다」는 「작거나 같다」와 같은 뜻이므로 ${LE}로 나타낸다.`
                };
              }
              const kind = d.int(0, 2);
              if (kind === 0) {
                const p = 100 * d.int(3, 9), q = 500 * d.int(3, 8), r = 1000 * d.int(8, 15);
                return {
                  said: `한 자루에 ${p}원인 볼펜 ${x}자루와 ${q}원짜리 필통 한 개의 값의 합은 ${r}원을 넘지 않는다.`, right: [ts([p, 'x'], [q, '']), '<=', ts([r, ''])],
                  wrongs: [[ts([p, 'x'], [q, '']), '<', ts([r, ''])], [ts([p, 'x'], [q, '']), '>=', ts([r, ''])], [ts([p + q, 'x']), '<=', ts([r, ''])]],
                  why: `볼펜 ${x}자루의 값은 ${nb(termH(p, 'x'))}원이고 여기에 필통의 값 ${q}원을 더한다. 「넘지 않는다」는 「작거나 같다」와 같은 뜻이므로 ${LE}로 나타낸다.`
                };
              }
              if (kind === 1) {
                const k = d.int(5, 12), t = 10 * d.int(18, 30), m = d.int(21, 49);
                return {
                  said: `전체가 ${t}쪽인 책을 하루에 ${x}쪽씩 ${k}일 동안 읽었더니 남은 쪽수가 ${m}쪽보다 적었다.`, right: [ts([t, ''], [-k, 'x']), '<', ts([m, ''])],
                  wrongs: [[ts([t, ''], [-k, 'x']), '<=', ts([m, ''])], [ts([k, 'x'], [-t, '']), '<', ts([m, ''])], [ts([t, ''], [-k, 'x']), '>', ts([m, ''])]],
                  why: `${k}일 동안 읽은 쪽수는 ${nb(termH(k, 'x'))}쪽이므로 남은 쪽수는 ${nb(`(${sideH(ts([t, ''], [-k, 'x']), true)})`)}쪽이다. 「적다」는 ${LT}로 나타낸다.`
                };
              }
              const v = 10 * d.int(3, 9), w = 100 * d.int(2, 6), t = 100 * d.int(12, 30);
              return {
                said: `한 개의 무게가 ${v} g인 구슬 ${x}개를 무게가 ${w} g인 상자에 담았더니 전체 무게가 ${t} g 이상이었다.`, right: [ts([v, 'x'], [w, '']), '>=', ts([t, ''])],
                wrongs: [[ts([v, 'x'], [w, '']), '>', ts([t, ''])], [ts([v, 'x'], [w, '']), '<=', ts([t, ''])], [ts([v + w, 'x']), '>=', ts([t, ''])]],
                why: `구슬 ${x}개의 무게는 ${nb(termH(v, 'x'))} g이고 여기에 상자의 무게 ${w} g을 더한다. 「이상」은 크거나 같다는 뜻이므로 ${GE}로 나타낸다.`
              };
            };
            const { said, right, wrongs, why } = d.until(build, (r) => r.wrongs.every((w) => !relate(r.right, w, ['x'])));
            const { rows, at } = mix(d, right, wrongs);
            return C(`「${said}」를 부등식으로 나타낸 것은?`, rows.map(([L, r, R]) => iqB(L, r, R)), at, {
              explain: `${why} 부등식으로 나타내면 ${iqB(right[0], right[1], right[2])}이다.`,
              facts: { truth: rows.map((r) => relate(right, r, ['x'])), want: true, rule: 'sentence-' + n }
            });
          }, { count: 2 }),
          T('ineq-sentence-wrong', '문장을 부등식으로 옮긴 것의 옳고 그름', '①5 ②4 심2', (d, n) => {
            const a = d.int(2, 5), b = d.int(1, 9), c = d.until(() => d.int(2, 7), (v) => v !== a), e = d.int(1, 9), k = d.int(11, 30);
            if (n === 0) {
              // 옳지 않은 것 하나: 식을 잘못 옮겼거나(괄호·속력), 부등호를 잘못 옮겼다. 줄마다 [문장, 바른 부등식, 틀리게 옮긴 부등식, 바로잡는 말]
              const p = 100 * d.int(8, 15), q = 100 * d.int(2, 6), r = 1000 * d.int(3, 6), w = 100 * d.int(2, 5), v = 10 * d.int(4, 9), g = 100 * d.int(15, 30), t = d.int(2, 5), s = 10 * d.int(2, 9);
              const makers = d.shuffle([
                [`${x}의 ${a}배는 ${k}보다 크지 않다.`, [ts([a, 'x']), '<=', ts([k, ''])], [ts([a, 'x']), '<', ts([k, ''])], `「크지 않다」는 「작거나 같다」와 같은 뜻이므로 ${LE}로 나타낸다.`],
                [`${x}에 ${b}${tail(b, '을/를')} 더한 수의 ${a}배는 ${k} 이상이다.`, [[tg(a, ts([1, 'x'], [b, '']))], '>=', ts([k, ''])], [ts([a, 'x'], [b, '']), '>=', ts([k, ''])], `${x}에 ${b}${tail(b, '을/를')} 더한 수의 ${a}배는 ${nb(sideH([tg(a, ts([1, 'x'], [b, '']))], true))}이다.`],
                [`${x}에서 ${b}${tail(b, '을/를')} 뺀 수는 ${e}보다 작지 않다.`, [ts([1, 'x'], [-b, '']), '>=', ts([e, ''])], [ts([1, 'x'], [-b, '']), '<=', ts([e, ''])], `「작지 않다」는 「크거나 같다」와 같은 뜻이므로 ${GE}로 나타낸다.`],
                [`${p}원짜리 공책 한 권과 ${q}원짜리 지우개 ${x}개의 값의 합은 ${r}원 이상이다.`, [ts([p, ''], [q, 'x']), '>=', ts([r, ''])], [ts([p, ''], [q, 'x']), '<=', ts([r, ''])], `「이상」은 크거나 같다는 뜻이므로 ${GE}로 나타낸다.`],
                [`무게가 ${w} g인 바구니에 한 개의 무게가 ${v} g인 귤 ${x}개를 담으면 전체 무게가 ${g} g을 넘는다.`, [ts([w, ''], [v, 'x']), '>', ts([g, ''])], [ts([w, ''], [v, 'x']), '>=', ts([g, ''])], `「넘는다」는 그 수보다 크다는 뜻이므로 등호가 없는 ${GT}로 나타낸다.`],
                [`시속 ${xu('km')}로 ${t}시간 동안 간 거리는 ${s} km 미만이다.`, [ts([t, 'x']), '<', ts([s, ''])], [ts([Q(1, t), 'x']), '<', ts([s, ''])], `(거리) = (속력) × (시간)이므로 간 거리는 ${nb(termH(t, 'x'))} km이다.`],
                [`${x}의 ${a}배에 ${b}${tail(b, '을/를')} 더한 수는 ${x}의 ${c}배에서 ${e}${tail(e, '을/를')} 뺀 수보다 크다.`, [ts([a, 'x'], [b, '']), '>', ts([c, 'x'], [-e, ''])], [ts([a, 'x'], [b, '']), '>', [tg(c, ts([1, 'x'], [-e, '']))]], `${x}의 ${c}배에서 ${e}${tail(e, '을/를')} 뺀 수는 ${nb(sideH(ts([c, 'x'], [-e, '']), true))}이다.`]
              ]).slice(0, 4), wrongAt = d.int(0, 3), shown = makers.map((m, i) => (i === wrongAt ? m[2] : m[1]));
              return C('다음 중 문장을 부등식으로 나타낸 것으로 옳지 않은 것은?', makers.map((m, i) => `${m[0]} ⇨ ${iqB(shown[i][0], shown[i][1], shown[i][2])}`), wrongAt, {
                explain: `${makers[wrongAt][3]} 바르게 나타내면 ${iqB(makers[wrongAt][1][0], makers[wrongAt][1][1], makers[wrongAt][1][2])}이다.`,
                facts: { truth: makers.map((m, i) => relate(m[1], shown[i], ['x'])), want: false, rule: 'sentence-wrong-0' }
              });
            }
            // 바르게 나타낸 것의 개수: 부등호를 가리키는 말(이상·이하·초과·미만·크지 않다·작지 않다·넘지 않는다)만 본다. 줄마다 [문장, 좌변, 우변, 바른 부등호, 흔히 틀리는 부등호, 말]
            const [k1, k2, k3, k4, k5] = d.shuffle([7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 25]);
            const pool = d.shuffle([
              [`${x}는 ${k1} 미만이다.`, ts([1, 'x']), ts([k1, '']), '<', '<=', '「미만」은 그 수보다 작다는 뜻이다'],
              [`${x}의 ${a}배는 ${k2}보다 크지 않다.`, ts([a, 'x']), ts([k2, '']), '<=', '<', '「크지 않다」는 「작거나 같다」와 같은 뜻이다'],
              [`${x}에 ${b}${tail(b, '을/를')} 더한 수는 ${k3}보다 작지 않다.`, ts([1, 'x'], [b, '']), ts([k3, '']), '>=', '>', '「작지 않다」는 「크거나 같다」와 같은 뜻이다'],
              [`${x}에서 ${e}${tail(e, '을/를')} 뺀 수는 ${k4}${tail(k4, '을/를')} 넘지 않는다.`, ts([1, 'x'], [-e, '']), ts([k4, '']), '<=', '<', '「넘지 않는다」는 「작거나 같다」와 같은 뜻이다'],
              [`${x}의 ${c}배에서 ${b}${tail(b, '을/를')} 뺀 수는 ${k5} 초과이다.`, ts([c, 'x'], [-b, '']), ts([k5, '']), '>', '>=', '「초과」는 그 수보다 크다는 뜻이다'],
              [`${x}를 ${a}${tail(a, '으로/로')} 나눈 수는 ${e} 이상이다.`, ts([Q(1, a), 'x']), ts([e, '']), '>=', '>', '「이상」은 크거나 같다는 뜻이다']
            ]).slice(0, 4), good = d.int(1, 3), right = d.shuffle([0, 1, 2, 3]).slice(0, good), flags = pool.map((_, i) => right.includes(i));
            return N('다음 중 문장을 부등식으로 바르게 나타낸 것은 모두 몇 개인가?', good, {
              unit: '개', figure: lines(pool.map((m, i) => `${tag(LAB[i])}${m[0]} ⇨ ${iqB(m[1], flags[i] ? m[3] : m[4], m[2])}`)),
              explain: `${pool.map((m, i) => (flags[i] ? '' : `${LAB[i]} ${m[5]}. 바르게 나타내면 ${iqB(m[1], m[3], m[2])}이다. `)).join('')}바르게 나타낸 것은 ${LAB.filter((_, i) => flags[i]).join(', ')}의 ${good}개이다.`,
              facts: { count: flags, rule: 'sentence-wrong-1' }
            });
          }, { count: 2 }),
          T('sol-which', '주어진 수가 해인 부등식 고르기', '①6 ②5 심3', (d) => {
            // 참인 것은 하나뿐이다. 양변의 값이 같아지는 부등식을 둘 넣는다: ≤·≥ 이면 참이고 <·> 이면 거짓이다.
            const k = nz(d, -4, 4), val = (list) => evS(list, { x: Q(k) }).p;
            // x = k 일 때 (좌변의 값) + by = (우변의 값)이 되는 두 변: 한쪽에만 x 가 있는 꼴과 양변에 x 가 있는 꼴
            const A = (by) => { const a = pm(d) * d.int(2, 5), b = nz(d, -9, 9); return [d.bool() ? ts([a, 'x'], [b, '']) : ts([b, ''], [a, 'x']), ts([a * k + b + by, ''])]; };
            const Bx = (by) => { const [a, c] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([p, q]) => p !== q), b = nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([c, 'x'], [(a - c) * k + b + by, ''])]; };
            const eqTrue = (([L, R]) => [L, d.pick(['<=', '>=']), R])(A(0)), eqFalse = (([L, R]) => [L, d.pick(['<', '>']), R])(Bx(0));
            // 거짓인 부등식: 우변이 더 큰데 > 이거나, 우변이 더 작은데 < 이다.
            const off = (make) => { const by = d.int(1, 4), r = anyRel(d), [L, R] = make(up(r) ? by : -by); return [L, r, R]; };
            const rows = d.until(() => d.shuffle([eqTrue, eqFalse, off(A), off(Bx)]), (list) => list.filter(([L, r, R]) => holds(L, r, R, { x: Q(k) })).length === 1 && new Set(list.map(([L, r, R]) => ineqH(L, r, R, true))).size === 4);
            const at = rows.indexOf(eqTrue), fa = rows.indexOf(eqFalse);
            return C(`다음 부등식 가운데 ${nb(`${x} = ${iq(k)}`)}일 때 참인 것은?`, rows.map(([L, r, R]) => iqB(L, r, R)), at, {
              explain: `${nb(`${x} = ${iq(k)}`)}${tail(Math.abs(k), '을/를')} 대입하여 좌변과 우변의 값의 대소 관계가 부등호와 맞는 것을 찾는다. ${iqB(eqTrue[0], eqTrue[1], eqTrue[2])}에서 좌변과 우변의 값이 모두 ${iq(val(eqTrue[0]))}${tail(Math.abs(val(eqTrue[0])), '으로/로')} 같으므로 ${RH[eqTrue[1]]}는 참이다. ${iqB(rows[fa][0], rows[fa][1], rows[fa][2])}도 좌변과 우변의 값이 ${iq(val(eqFalse[0]))}${tail(Math.abs(val(eqFalse[0])), '으로/로')} 같지만 등호가 없는 부등호이므로 거짓이다.`,
              facts: { truth: rows.map(([L, r, R]) => holds(L, r, R, { x: Q(k) })), want: true }
            });
          }),
          T('sol-bracket', '[ ] 안의 수가 부등식의 해인지 확인하기', '①6 ②6 심3', (d) => {
            // 해가 아닌 것 하나. 양변의 값이 같아지는 줄이 둘이다: ≤ 이면 해이고 < 이면 해가 아니다. 분수 계수가 든 줄도 하나 넣는다.
            const ks = d.shuffle([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6]).slice(0, 4);
            // x = k 일 때 (좌변의 값) + by = (우변의 값)이 되는 두 변
            const A = (k, by) => { const a = pm(d) * d.int(2, 5), b = nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([a * k + b + by, ''])]; };
            const Bx = (k, by) => { const [a, c] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([p, q]) => p !== q), b = nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([c, 'x'], [(a - c) * k + b + by, ''])]; };
            const eqTrue = (([L, R]) => ({ L, r: d.pick(['<=', '>=']), R, k: ks[0] }))(A(ks[0], 0)), eqFalse = (([L, R]) => ({ L, r: d.pick(['<', '>']), R, k: ks[1] }))(Bx(ks[1], 0));
            // 참인 줄 둘: 분수 계수 x/q + b r c 와 양변에 x 가 있는 꼴
            const fracRow = (() => { const q = d.pick([2, 3, 4]), k = q * d.pick([-2, -1, 1, 2]), b = nz(d, -5, 5), r = anyRel(d), c = k / q + b + (up(r) ? -d.int(1, 3) : d.int(1, 3)); return { L: ts([Q(1, q), 'x'], [b, '']), r, R: ts([c, '']), k }; })();
            const plain = (() => { const r = anyRel(d), [L, R] = Bx(ks[3], up(r) ? -d.int(1, 4) : d.int(1, 4)); return { L, r, R, k: ks[3] }; })();
            const rows = d.until(() => d.shuffle([eqTrue, eqFalse, fracRow, plain]), (list) => list.filter((row) => !holds(row.L, row.r, row.R, { x: Q(row.k) })).length === 1);
            const at = rows.indexOf(eqFalse), v = evS(eqFalse.L, { x: Q(eqFalse.k) }).p;
            return C('다음 중 [ ] 안의 수가 주어진 부등식의 해가 아닌 것은?', rows.map((row) => `${iqB(row.L, row.r, row.R)} &nbsp;[${iq(row.k)}]`), at, {
              explain: `[ ] 안의 수를 ${x}에 대입하여 부등식이 참이 되면 해이다. ${iqB(eqFalse.L, eqFalse.r, eqFalse.R)}에 ${nb(`${x} = ${iq(eqFalse.k)}`)}${tail(Math.abs(eqFalse.k), '을/를')} 대입하면 좌변과 우변의 값이 모두 ${iq(v)}${tail(Math.abs(v), '으로/로')} 같다. 등호가 없는 부등호이므로 거짓이고, ${iq(eqFalse.k)}${tail(Math.abs(eqFalse.k), '은/는')} 해가 아니다. ${iqB(eqTrue.L, eqTrue.r, eqTrue.R)}도 ${nb(`${x} = ${iq(eqTrue.k)}`)}일 때 양변의 값이 같지만 ${RH[eqTrue.r]}는 같을 때도 참이다.`,
              facts: { truth: rows.map((row) => holds(row.L, row.r, row.R, { x: Q(row.k) })), want: false }
            });
          }),
          T('sol-try', 'x의 값을 차례로 넣어 부등식의 해 찾기', '①7 ②7 ②8', (d, n) => {
            if (n === 0) {
              // 주어진 다섯 수 가운데 해를 모두 고른다. 양변의 값이 같아지는 수가 가운데에 있다(등호가 있으면 해, 없으면 해가 아니다).
              const start = d.int(-3, 0), vals = [0, 1, 2, 3, 4].map((i) => start + i), j = d.int(1, 3), a = pm(d) * d.int(2, 4), b = nz(d, -6, 6), r = anyRel(d), L = ts([a, 'x'], [b, '']), R = ts([a * vals[j] + b, '']);
              const sol = vals.filter((v) => holds(L, r, R, { x: Q(v) })), toggle = (set) => (set.includes(vals[j]) ? set.filter((v) => v !== vals[j]) : set.concat([vals[j]]).sort((p, q) => p - q)), rest = vals.filter((v) => !sol.includes(v));
              const { rows, at } = mix(d, sol, [toggle(sol), rest, toggle(rest)]);
              return C(`${x}의 값이 ${vals.map(iq).join(', ')}일 때, 다음 부등식의 해를 모두 고른 것은?`, rows.map((set) => set.map(iq).join(', ')), at, {
                figure: iqF(L, r, R),
                explain: `${x}에 수를 차례로 대입하면 좌변의 값은 ${vals.map((v) => iq(a * v + b)).join(', ')}이다. 이 가운데 ${iq(a * vals[j] + b)}${strict(r) ? `보다 ${up(r) ? '큰' : '작은'}` : `보다 ${up(r) ? '크거나' : '작거나'} 같은`} 것은 ${nb(`${x} = ${sol.map(iq).join(', ')}`)}일 때이다. ${nb(`${x} = ${iq(vals[j])}`)}일 때는 양변의 값이 같으므로 ${strict(r) ? '등호가 없는 부등식을 참이 되게 하지 않는다' : '등호가 있는 부등식을 참이 되게 한다'}.`,
                facts: { truth: rows.map((set) => set.join() === sol.join()), want: true, rule: 'try-0' }
              });
            }
            // 등호가 있고 없는 두 부등식의 해의 개수
            const start = d.int(-3, 0), vals = [0, 1, 2, 3, 4].map((i) => start + i), j = d.int(1, 3), b = nz(d, -6, 6), c = vals[j] + b, less = d.bool(), rs = less ? ['<', '<='] : ['>', '>='], L = ts([1, 'x'], [b, '']), R = ts([c, '']);
            const counts = rs.map((r) => vals.filter((v) => holds(L, r, R, { x: Q(v) })).length), jb = js(Q(b)), bound = `(${c}-${jb})`;
            return M(`${x}의 값이 ${vals.map(iq).join(', ')}일 때, 다음 두 부등식의 해의 개수를 각각 구하시오.`, counts.map((v, i) => ({ label: LAB[i], answer: v, unit: '개' })), {
              figure: tagEq(rs.map((r) => ineqH(L, r, R))),
              explain: `${x}에 수를 차례로 대입하면 좌변의 값은 ${vals.map((v) => iq(v + b)).join(', ')}이다. ㉠ ${iq(c)}보다 ${less ? '작은' : '큰'} 것은 ${counts[0]}개이다. ㉡ ${nb(`${x} = ${iq(vals[j])}`)}일 때 좌변의 값이 ${iq(c)}${tail(Math.abs(c), '과/와')} 같으므로 등호가 있는 부등식의 해는 하나 더 많은 ${counts[1]}개이다.`,
              facts: { calc: less ? [[`${bound}-${js(Q(start))}`, 0], [`${bound}-${js(Q(start))}+1`, 1]] : [[`${js(Q(start + 4))}-${bound}`, 0], [`${js(Q(start + 4))}-${bound}+1`, 1]], unseen: [1], rule: 'try-1' }
            });
          }, { count: 2 }),
          T('sol-cond-word', 'x의 조건이 말로 주어진 부등식의 해의 개수', '①7 ②9', (d) => {
            const cond = d.pick([{ word: '10 이하의 소수', vals: [2, 3, 5, 7] }, { word: '15 이하의 소수', vals: [2, 3, 5, 7, 11, 13] }, { word: '한 자리의 짝수', vals: [2, 4, 6, 8] }, { word: '한 자리의 홀수', vals: [1, 3, 5, 7, 9] }]);
            const [L, r, R] = d.until(() => [ts([d.int(2, 5), 'x'], [nz(d, -9, 9), '']), anyRel(d), ts([nz(d, -3, 3), 'x'], [d.int(3, 30), ''])], ([l, rel, rr]) => { const s = solI(l, rel, rr), hit = cond.vals.filter((v) => holds(l, rel, rr, { x: Q(v) })).length; return s && s.v.q !== 1 && hit >= 1 && hit < cond.vals.length; });
            const flags = cond.vals.map((v) => holds(L, r, R, { x: Q(v) })), hit = cond.vals.filter((_, i) => flags[i]);
            return N(`${x}가 ${cond.word}일 때, 다음 부등식의 해는 모두 몇 개인가?`, hit.length, {
              unit: '개', figure: iqF(L, r, R),
              explain: `${cond.word}는 ${cond.vals.join(', ')}이다. 이 수들을 ${x}에 차례로 대입하면 ${nb(`${x} = ${hit.join(', ')}`)}일 때 부등식이 참이 된다. 따라서 해는 ${hit.length}개이다.`,
              facts: { count: flags }
            });
          })
        ]
      },
      {
        id: 'prop', title: '부등식의 성질', standard: STD1,
        types: [
          T('prop-fill', '부등식의 성질을 이용하여 부등호 넣기', '①8 ②10 ②11', (d, n) => {
            // 첫째는 양변에 한 번(더하기·빼기·곱하기·나누기), 둘째는 두 번 셈한 식이다. 한 줄은 음수를 곱하거나 음수로 나누어 방향이 바뀐다.
            const cond = n === 0 ? d.pick(['<', '>']) : anyRel(d), k = d.int(2, 9), c = d.int(1, 9), q = d.int(2, 5);
            const keepForm = n === 0 ? d.pick([FORM.add(k), FORM.add(-k), FORM.subneg(k), FORM.mul(q), FORM.div(q)]) : d.pick([FORM.lin(q, -c), FORM.paren(q, c), FORM.linDiv(q, -c), FORM.revDiv(q, -c)]);
            const flipForm = n === 0 ? d.pick([FORM.mul(-q), FORM.div(-q)]) : d.pick([FORM.rev(-q, c), FORM.lin(-1, c), FORM.revDiv(-q, c)]);
            const forms = d.shuffle([keepForm, flipForm]), told = forms.map((f) => formTold(f, cond));
            return inline(`${nb(`${va} ${RH[cond]} ${vb}`)}일 때, □ 안에 알맞은 부등호를 고르시오.`, forms.map((f, i) => `${formH(f, 'a')} {${i}} ${formH(f, 'b')}`).join('<br>'), forms.map((f) => ({ rel: true, answer: formRel(f, cond) })), {
              shown: forms.map((f) => stmt(f, formRel(f, cond))).join(', '),
              explain: `부등식의 양변에 같은 수를 더하거나 양변에서 같은 수를 빼도, 양변에 같은 양수를 곱하거나 양변을 같은 양수로 나누어도 부등호의 방향은 바뀌지 않는다. 양변에 같은 음수를 곱하거나 양변을 같은 음수로 나누면 부등호의 방향이 바뀐다. ${told.map((t) => `${nb(`${va} ${RH[cond]} ${vb}`)}의 ${t.text}`).join(' ')}`,
              facts: { rule: 'fill-' + n }
            });
          }, { count: 2 }),
          T('prop-pick', '부등식의 성질로 옳지 않은 것·방향이 다른 것 찾기', '①9 ①10 ②12 ②13', (d, n) => {
            const cond = d.pick(['<', '>']), k = d.int(2, 9), c = d.int(1, 9), q = d.int(2, 5), q2 = d.until(() => d.int(2, 6), (v) => v !== q), given = nb(`${va} ${RH[cond]} ${vb}`);
            const pos = d.shuffle([FORM.add(k), FORM.add(-k), FORM.subneg(c), FORM.div(q), FORM.lin(q2, c), FORM.over(c, q), FORM.linDiv(q, -k)]), neg = d.shuffle([FORM.mul(-q), FORM.rev(-q2, c), FORM.div(-q), FORM.lin(-1, k), FORM.revDiv(-q, c)]);
            if (n === 0) {
              // 옳지 않은 것 하나: 음수를 곱했는데 방향을 그대로 두었거나, 양수로 나누었는데 방향을 바꾸었다. 옳은 보기에는 방향이 바뀐 것이 하나 들어 있다.
              const slip = d.bool() ? { f: neg[0], rel: cond } : { f: pos[0], rel: FLIP[cond] };
              const good = (slip.f === neg[0] ? [pos[0], pos[1], neg[1]] : [pos[1], pos[2], neg[0]]).map((f) => ({ f, rel: formRel(f, cond) })), { rows, at } = mix(d, slip, good);
              return C(`${given}일 때, 다음 중 옳지 않은 것은?`, rows.map((row) => stmt(row.f, row.rel)), at, {
                explain: `${given}의 ${formTold(slip.f, cond).text}`,
                facts: { truth: rows.map((row) => row.rel === formRel(row.f, cond)), want: false, rule: 'pick-0' }
              });
            }
            // □ 안의 부등호의 방향이 나머지 셋과 다른 하나
            const oddNeg = d.bool(), odd = oddNeg ? neg[0] : pos[0], others = oddNeg ? pos.slice(0, 3) : neg.slice(0, 3), { rows, at } = mix(d, odd, others);
            return C(`${given}일 때, 다음 중 □ 안에 알맞은 부등호의 방향이 나머지 셋과 다른 것은?`, rows.map((f) => nb(`${formH(f, 'a')} ${box()} ${formH(f, 'b')}`)), at, {
              explain: `양변에 같은 수를 더하거나 빼거나, 같은 양수를 곱하거나 같은 양수로 나누면 부등호의 방향이 그대로이고, 같은 음수를 곱하거나 같은 음수로 나누면 방향이 바뀐다. ${stmt(odd, formRel(odd, cond))}이고 나머지는 모두 ${RH[formRel(others[0], cond)]}이다.`,
              facts: { truth: rows.map((f) => f === odd), want: true, rule: 'pick-1' }
            });
          }, { count: 2 }),
          T('prop-back', '식의 부등식에서 두 수의 대소 관계 알아내기', '①10 ②14', (d) => {
            const cond = anyRel(d), k = d.int(2, 9), c = d.int(1, 12), q = d.int(2, 7);
            const f = d.pick([FORM.rev(-q, c), FORM.lin(-q, c), FORM.revDiv(-q, c), FORM.revDiv(-q, c), FORM.lin(q, -k)]), back = formBack(f, cond);
            return inline(`${stmt(f, cond)}일 때, □ 안에 알맞은 부등호를 고르시오.`, `${va} {0} ${vb}`, [{ rel: true, answer: back.rel }], {
              shown: nb(`${va} ${RH[back.rel]} ${vb}`), explain: `${stmt(f, cond)}의 ${back.text}`, facts: { rule: 'back' }
            });
          }),
          T('prop-chain', '식의 부등식에서 다른 식의 부등호 알아내기', '②15', (d) => {
            const cond = anyRel(d), k = d.int(2, 9), c = d.int(1, 9), q = d.int(2, 5), q2 = d.until(() => d.int(2, 7), (v) => v !== q);
            const f1 = d.pick([FORM.rev(-q, c), FORM.lin(-q, c), FORM.revDiv(-q, c)]), f2 = d.pick([FORM.lin(q2, -k), FORM.rev(-q2, k), FORM.lin(-q2, k), FORM.linDiv(q2, -k)]);
            const back = formBack(f1, cond), told = formTold(f2, back.rel);
            return inline(`${stmt(f1, cond)}일 때, □ 안에 알맞은 부등호를 고르시오.`, `${formH(f2, 'a')} {0} ${formH(f2, 'b')}`, [{ rel: true, answer: told.rel }], {
              shown: stmt(f2, told.rel), explain: `${stmt(f1, cond)}의 ${back.text} ${nb(`${va} ${RH[back.rel]} ${vb}`)}의 ${told.text}`, facts: { rule: 'chain' }
            });
          }),
          T('prop-ifthen', '「…이면 …이다」 꼴 문장의 참·거짓', '②16 ②17 심8', (d) => {
            // 옳지 않은 것 하나: 음수를 곱하거나 나누는 걸음이 홀수 번인데 방향을 그대로 둔 문장. 옳은 문장에는 방향이 바르게 바뀐 것이 들어 있다.
            const k = d.int(2, 9), c = d.int(1, 9), q = d.int(2, 7), q2 = d.until(() => d.int(2, 5), (v) => v !== q), r = () => anyRel(d);
            const S = (f1, r1, f2, r2) => ({ f1, r1, f2, r2: r2 || (f1.m.p * f2.m.p > 0 ? r1 : FLIP[r1]) });
            const ok = (s) => s.r2 === (s.f1.m.p * s.f2.m.p > 0 ? s.r1 : FLIP[s.r1]);
            const plain = d.shuffle([S(FORM.add(k), r(), FORM.id()), S(FORM.lin(q, -c), r(), FORM.id()), S(FORM.add(c), r(), FORM.mul(q2)), S(FORM.over(c, q), r(), FORM.id())]);
            const r1 = r(), r3 = r();
            const [bad, turned] = d.bool() ? [S(FORM.rev(-1, k), r1, FORM.id(), r1), S(FORM.rev(-q, c), r3, FORM.lin(q2, -1))] : [S(FORM.rev(-q, c), r3, FORM.lin(q2, -1), r3), S(FORM.rev(-1, k), r1, FORM.id())];
            const { rows, at } = mix(d, bad, [turned, plain[0], plain[1]]);
            const back = formBack(bad.f1, bad.r1), told = formTold(bad.f2, back.rel);
            return C('다음 중 옳지 않은 것은?', rows.map((s) => `${stmt(s.f1, s.r1)}이면 ${stmt(s.f2, s.r2)}이다.`), at, {
              explain: `${stmt(bad.f1, bad.r1)}의 ${back.text}${bad.f2.steps.length ? ` ${nb(`${va} ${RH[back.rel]} ${vb}`)}의 ${told.text}` : ''} 음수를 곱하거나 음수로 나눌 때마다 부등호의 방향이 바뀐다.`,
              facts: { truth: rows.map(ok), want: false }
            });
          }),
          T('prop-derive', '양변이 식인 부등식에서 얻을 수 있는 부등식 고르기', '①11', (d) => {
            const p = d.int(1, 6), q = d.int(1, 6), k = d.until(() => d.int(1, 5), (v) => v !== p), m = d.int(2, 4), r = d.pick(['<', '>', '<=', '>=']);
            const P = [ts([1, 'a'], [-p, '']), r, ts([-1, 'b'], [q, ''])];
            const T1 = [ts([1, 'a'], [k - p, '']), r, ts([-1, 'b'], [q + k, ''])], T2 = [ts([1, 'a'], [1, 'b']), r, ts([p + q, ''])], T3 = [ts([m, 'a'], [-m * p, '']), r, ts([-m, 'b'], [m * q, ''])];
            const T4 = [ts([-m, 'a'], [m * p, '']), FLIP[r], ts([m, 'b'], [-m * q, ''])], F1 = [T4[0], r, T4[2]], F2 = [T3[0], FLIP[r], T3[2]];
            const slipNeg = d.bool(), bad = slipNeg ? F1 : F2, { rows, at } = mix(d, bad, slipNeg ? [T1, T2, T3] : [T1, T2, T4]);
            return C(`${iqB(P[0], P[1], P[2])}일 때, 다음 중 옳지 않은 것은?`, rows.map(([L, rel, R]) => iqB(L, rel, R)), at, {
              explain: slipNeg ? `${iqB(P[0], P[1], P[2])}의 양변에 음수 ${iq(-m)}${tail(m, '을/를')} 곱하면 부등호의 방향이 바뀌어 ${iqB(T4[0], T4[1], T4[2])}이다.`
                : `${iqB(P[0], P[1], P[2])}의 양변에 양수 ${m}${tail(m, '을/를')} 곱하면 부등호의 방향은 바뀌지 않으므로 ${iqB(T3[0], T3[1], T3[2])}이다. 음수 ${iq(-m)}${tail(m, '을/를')} 곱할 때는 방향이 바뀌므로 ${iqB(T4[0], T4[1], T4[2])}이다.`,
              facts: { truth: rows.map((E) => relate(P, E, ['a', 'b'])), want: false }
            });
          }),
          T('prop-letter-sign', '부호가 주어진 문자를 곱하거나 나눈 식의 대소', '①12 ②20 심7', (d) => {
            // 세 수의 차례와 부호를 주고, 두 수에 나머지 한 수를 더하고 빼고 곱하고 나눈 식을 견준다. 곱하거나 나누는 수가 음수이면 방향이 바뀐다.
            const lay = d.pick([{ chain: `${va} ${LT} ${vb} ${LT} 0 ${LT} ${vc}`, sign: { a: -1, b: -1, c: 1 } }, { chain: `${va} ${LT} 0 ${LT} ${vb} ${LT} ${vc}`, sign: { a: -1, b: 1, c: 1 } }]);
            const trio = [['a', 'b', 'c'], ['a', 'c', 'b'], ['b', 'c', 'a']];   // [작은 수, 큰 수, 셈하는 수]
            const prod = (p, m) => [p, m].sort().map(V).join('');
            const S = (kind, [p, q, m], rel) => {
              const real = kind === 'add' || kind === 'sub' ? '<' : lay.sign[m] > 0 ? '<' : '>', shown = rel || real;
              const h = kind === 'add' ? [`${V(p)} + ${V(m)}`, `${V(q)} + ${V(m)}`] : kind === 'sub' ? [`${V(p)} − ${V(m)}`, `${V(q)} − ${V(m)}`] : kind === 'mul' ? [prod(p, m), prod(q, m)] : [frac(V(p), V(m)), frac(V(q), V(m))];
              const act = kind === 'add' ? `${V(m)}를 더하면` : kind === 'sub' ? `${V(m)}를 빼면` : kind === 'mul' ? `${V(m)}를 곱하면` : `${V(m)}로 나누면`;
              return { kind, m, text: nb(`${h[0]} ${RH[shown]} ${h[1]}`), ok: shown === real, fix: `${nb(`${V(m)} ${lay.sign[m] > 0 ? GT : LT} 0`)}이므로 ${nb(`${V(p)} ${LT} ${V(q)}`)}의 양변${kind === 'div' ? '을' : kind === 'sub' ? '에서' : '에'} ${act} ${lay.sign[m] > 0 || kind === 'add' || kind === 'sub' ? '부등호의 방향은 그대로이고' : '부등호의 방향이 바뀌어'} ${nb(`${h[0]} ${RH[real]} ${h[1]}`)}이다.` };
            };
            const negT = trio.filter((t) => lay.sign[t[2]] < 0), posT = trio.filter((t) => lay.sign[t[2]] > 0), md = () => d.pick(['mul', 'div']);
            const rows0 = d.until(() => {
              const slipNeg = d.bool(), tb0 = d.pick(negT), tp = d.pick(posT);
              const bad = slipNeg ? S(md(), tb0, '<') : S(md(), tp, '>');
              const good = [S(d.pick(['add', 'sub']), d.pick(trio)), slipNeg ? S(md(), tp) : S(md(), tb0), slipNeg ? S(md(), d.pick(negT.concat(posT))) : S(md(), d.pick(negT))];
              return { bad, good };
            }, (r) => new Set([r.bad].concat(r.good).map((s) => s.text.replace(/&lt;|&gt;/g, '?'))).size === 4);
            const { rows, at } = mix(d, rows0.bad, rows0.good);
            return C(`${nb(lay.chain)}일 때, 다음 중 옳지 않은 것은?`, rows.map((s) => s.text), at, {
              explain: `${rows0.bad.fix} 음수를 곱하거나 음수로 나눌 때만 부등호의 방향이 바뀐다.`,
              facts: { truth: rows.map((s) => s.ok), want: false }
            });
          }),
          T('prop-range-one', 'x의 범위가 주어질 때 일차식의 값의 범위', '①14 ②18 심9', (d) => {
            // 한 줄은 x 의 계수가 양수, 한 줄은 음수(정수이거나 분수)이다.
            const cond = anyRel(d), q = d.pick([2, 3, 4]), frac2 = d.bool(), k = frac2 ? q * nz(d, -3, 3) : nz(d, -6, 6), c1 = nz(d, -9, 9), c2 = d.int(1, 9), p = d.int(2, 5), m = d.int(2, 5), top = q === 2 ? 1 : q - 1;
            const f1 = FORM.lin(p, c1), f2 = !frac2 ? FORM.rev(-m, c2) : top === 1 ? FORM.linDiv(-q, c2) : FORM.linFrac(-top, q, c2);
            const forms = [f1, f2], side = (mm, cc) => [sideH(ts([mm, 'x'], [cc, '']), true), tx(qadd(qmul(mm, Q(k)), cc))];
            const told = forms.map((f) => walk(cond, { m: Q(1), c: Q(0) }, f.steps, side)), vals = forms.map((f) => formAt(f, k).p);
            const inputs = forms.reduce((all, f, i) => all.concat([{ rel: true, answer: told[i].rel }, { answer: vals[i], signed: true }]), []);
            const jk = js(Q(k)), calc = [[`${p}*${jk}+${js(Q(c1))}`, 1], [frac2 ? `-${top}*${jk}/${q}+${c2}` : `${c2}-${m}*${jk}`, 3]];
            return inline(`${solH('x', cond, k)}일 때, 두 식 ${nb(formH(f1, 'x'))}, ${nb(formH(f2, 'x'))}의 값의 범위를 각각 구하시오.`, forms.map((f, i) => `${formH(f, 'x')} {${2 * i}} {${2 * i + 1}}`).join('<br>'), inputs, {
              shown: forms.map((f, i) => nb(`${formH(f, 'x')} ${RH[told[i].rel]} ${iq(vals[i])}`)).join(', '),
              explain: told.map((t) => `${solH('x', cond, k)}의 ${t.text}`).join(' '),
              facts: { calc, unseen: [1] }
            });
          }),
          T('prop-range-count', '식의 값의 범위에 드는 자연수·정수', '①14 ②18 심11', (d, n) => {
            // 첫째는 식의 값이 될 수 있는 자연수의 개수(위로 막힌 범위), 둘째는 가장 작은 정수(아래로 막힌 범위). 끝 수가 드는지는 등호가 정한다.
            const name = V('A');
            if (n === 0) {
              const m = d.until(() => { const neg = d.bool(), cond = neg ? d.pick(['>', '>=']) : d.pick(['<', '<=']), coef = (neg ? -1 : 1) * d.int(1, 3), k = nz(d, -6, 6), c = nz(d, -9, 12); return { cond, coef, k, c, top: coef * k + c }; }, (r) => r.top >= 3 && r.top <= 9);
              const f = m.coef < 0 && d.bool() ? FORM.rev(m.coef, m.c) : FORM.lin(m.coef, m.c), side = (mm, cc) => [sideH(ts([mm, 'x'], [cc, '']), true), tx(qadd(qmul(mm, Q(m.k)), cc))];
              const told = walk(m.cond, { m: Q(1), c: Q(0) }, f.steps, side), open = strict(told.rel), count = open ? m.top - 1 : m.top, flags = Array.from({ length: m.top + 2 }, (_, i) => (open ? i + 1 < m.top : i + 1 <= m.top));
              return N(`${solH('x', m.cond, m.k)}일 때, ${nb(`${name} = ${formH(f, 'x')}`)}의 값이 될 수 있는 자연수는 모두 몇 개인가?`, count, {
                unit: '개', explain: `${solH('x', m.cond, m.k)}의 ${told.text} 곧 ${nb(`${name} ${RH[told.rel]} ${m.top}`)}이다. ${open ? `${m.top}${tail(m.top, '은/는')} 들지 않으므로` : `${m.top}도 들므로`} 자연수 ${name}는 1부터 ${count}까지의 ${count}개이다.`,
                facts: { count: flags, rule: 'range-count-0' }
              });
            }
            const m = d.until(() => { const neg = d.bool(), cond = neg ? d.pick(['<', '<=']) : d.pick(['>', '>=']), coef = (neg ? -1 : 1) * d.int(2, 4), k = nz(d, -6, 6), c = nz(d, -9, 12); return { cond, coef, k, c, low: coef * k + c }; }, (r) => Math.abs(r.low) <= 20);
            const f = d.bool() ? FORM.rev(m.coef, m.c) : FORM.lin(m.coef, m.c), side = (mm, cc) => [sideH(ts([mm, 'x'], [cc, '']), true), tx(qadd(qmul(mm, Q(m.k)), cc))];
            const told = walk(m.cond, { m: Q(1), c: Q(0) }, f.steps, side), open = strict(told.rel), ans = open ? m.low + 1 : m.low;
            return N(`${solH('x', m.cond, m.k)}일 때, ${nb(`${name} = ${formH(f, 'x')}`)}의 값이 될 수 있는 정수 가운데 가장 작은 수는?`, ans, {
              signed: true, explain: `${solH('x', m.cond, m.k)}의 ${told.text} 곧 ${nb(`${name} ${RH[told.rel]} ${iq(m.low)}`)}이다. ${open ? `${iq(m.low)}${tail(Math.abs(m.low), '은/는')} 들지 않으므로 가장 작은 정수는 ${iq(ans)}이다.` : `${iq(m.low)}도 들므로 가장 작은 정수는 ${iq(ans)}이다.`}`,
              facts: { calc: [[`${m.coef < 0 ? '-' : ''}${Math.abs(m.coef)}*${js(Q(m.k))}+${js(Q(m.c))}${open ? '+1' : ''}`, 0]], unseen: [1], rule: 'range-count-1' }
            });
          }, { count: 2 }),
          T('prop-range-both', 'x의 범위가 양쪽으로 주어질 때 일차식의 값의 범위', '①15 ②19', (d) => {
            // 음수를 곱하면 두 부등호의 방향이 모두 바뀌어 양 끝의 수와 등호의 자리가 서로 바뀐다.
            const [lo, hi] = d.until(() => { const v = d.int(-4, 2); return [v, v + d.int(2, 5)]; }, ([p, q]) => p + q !== 0), m = -d.int(1, 3), c = nz(d, -6, 9), [r1, r2] = d.pick([['<', '<='], ['<=', '<']]);
            const f = m === -1 ? d.pick([FORM.lin(-1, c), FORM.rev(-1, c)]) : FORM.rev(m, c), e = formH(f, 'x'), at = (v) => m * v + c, show = (a, s1, s2, b) => nb(`${iq(a)} ${RH[s1]} ${e} ${RH[s2]} ${iq(b)}`);
            const right = [at(hi), r2, r1, at(lo)], wrongs = [[at(hi), r1, r2, at(lo)], [-m * lo + c, r1, r2, -m * hi + c], [m * hi, r2, r1, m * lo]];
            const { rows, at: ans } = mix(d, right, wrongs);
            return C(`${nb(`${iq(lo)} ${RH[r1]} ${x} ${RH[r2]} ${iq(hi)}`)}일 때, ${nb(e)}의 값의 범위는?`, rows.map((row) => show(...row)), ans, {
              explain: `각 변에 음수 ${iq(m)}${tail(-m, '을/를')} 곱하면 부등호의 방향이 모두 바뀌어 ${nb(`${iq(m * lo)} ${RH[FLIP[r1]]} ${termH(m, 'x')} ${RH[FLIP[r2]]} ${iq(m * hi)}`)}, 곧 ${nb(`${iq(m * hi)} ${RH[r2]} ${termH(m, 'x')} ${RH[r1]} ${iq(m * lo)}`)}이다. ${c > 0 ? `각 변에 ${c}${tail(c, '을/를')} 더하면` : `각 변에서 ${-c}${tail(-c, '을/를')} 빼면`} ${show(...right)}이다. 양 끝의 수와 함께 등호의 자리도 바뀐다.`,
              facts: { truth: rows.map((row) => row.join() === right.join()), want: true }
            });
          }),
          // 2026-10-13 다시 실은 꼴: 처음에는 「제곱의 대소」와 한데 묶어 뺐으나, 제곱끼리 견주는 것이 아니라 0이 아닌 수의 제곱이 양수임(중1)만 쓴다.
          T('prop-sign-twice', '부호가 주어진 문자를 곱하고 다른 문자의 제곱으로 나눈 식의 대소', '심10', (d) => {
            // 방향을 정하는 것은 곱하거나 나누는 문자 d 의 부호뿐이다. c 가 음수이어도 c² 은 양수이므로 방향을 바꾸지 않는다.
            const cond = anyRel(d), [sc, sd] = d.pick([[-1, -1], [-1, 1], [1, -1]]), vd = V('d'), sq = vc + sup(2), mulFirst = cond === '>' && sc < 0 && sd < 0 ? false : d.bool(), sign = (s) => (s > 0 ? GT : LT), turned = sd < 0 ? FLIP[cond] : cond;
            // 첫째 꼴은 d 를 곱하고 c² 으로 나눈 것, 둘째 꼴은 c² 을 곱하고 d 로 나눈 것이다.
            const side = (v) => (mulFirst ? frac(v + vd, sq) : frac(v + sq, vd)), given = nb(`${va} ${RH[cond]} ${vb}`);
            const byD = `${nb(`${vd} ${sign(sd)} 0`)}이므로 양변${mulFirst ? `에 ${vd}를 곱하면` : `을 ${vd}로 나누면`} ${sd < 0 ? '부등호의 방향이 바뀌어' : '부등호의 방향은 그대로이고'}`, bySq = `${sc < 0 ? `${nb(`${vc} ${LT} 0`)}이어도 ` : ''}${nb(`${sq} ${GT} 0`)}이므로 양변${mulFirst ? `을 ${sq}으로 나누면` : `에 ${sq}을 곱하면`} 부등호의 방향은 그대로이고`;
            const mid = mulFirst ? nb(`${va}${vd} ${RH[turned]} ${vb}${vd}`) : nb(`${va}${sq} ${RH[cond]} ${vb}${sq}`), last = nb(`${side(va)} ${RH[turned]} ${side(vb)}`);
            return inline(`${given}, ${nb(`${vc} ${sign(sc)} 0`)}, ${nb(`${vd} ${sign(sd)} 0`)}일 때, □ 안에 알맞은 부등호를 고르시오.`, `${side(va)} {0} ${side(vb)}`, [{ rel: true, answer: turned }], {
              shown: last, explain: mulFirst ? `${given}에서 ${byD} ${mid}이다. ${bySq} ${last}이다.` : `${given}에서 ${bySq} ${mid}이다. ${byD} ${last}이다.`, facts: { rule: 'sign-twice' }
            });
          })
        ]
      },
      {
        id: 'solve', title: '일차부등식과 그 풀이', standard: STD2,
        types: [
          T('lin-pick', '일차부등식 가리기', '①16 ②23 심14', (d, n) => {
            const a = d.int(2, 6), b = d.int(1, 9), c = d.int(1, 9), e = d.int(2, 9), q = d.int(2, 5);
            const row = (L, r, R) => { const u = r === '=' ? null : quad(L, R); return { h: ineqH(L, r, R), bare: iqB(L, r, R), kind: r === '=' ? 'eq' : u.a.p !== 0 ? 'quad' : u.b.p !== 0 ? 'lin' : 'none', u, r }; };
            const done = (it) => nb(`${sideH(ts([it.u.a, 'X'], [it.u.b, 'x'], [it.u.c, '']), true)} ${RH[it.r]} 0`);
            const why = (it) => (it.kind === 'eq' ? '부등호가 없는 등식이다' : it.kind === 'lin' ? `정리하면 ${done(it)}이므로 일차부등식이다` : it.kind === 'quad' ? `정리하면 ${done(it)}이 되어 좌변이 일차식이 아니다` : `정리하면 ${done(it)}이 되어 ${x}의 항이 없다`);
            // 일차부등식: 그대로 일차인 것과, 정리하면 이차항이 사라지는 것
            const plain = d.shuffle([row(ts([a, 'x'], [-b, '']), '<', ts([c, ''], [-a, 'x'])), row(ts([Q(1, q), 'x'], [b, '']), '<=', ts([e, ''])), row(ts([a, 'x']), '>=', ts([b, ''], [-1, 'x']))]);
            const fading = d.shuffle([row([tg(1, ts([1, 'x'], [-b, '']), '(', 'x')], '<', ts([1, 'X'], [c, ''])), row(ts([2, 'X'], [a, 'x']), '>', ts([2, 'X'], [-1, 'x'], [e, ''])), row(ts([1, 'X'], [b, '']), '>=', [tg(1, ts([1, 'x'], [c, '']), '(', 'x')])]);
            // 일차부등식이 아닌 것: x 의 항이 사라지는 것, 이차항이 남는 것, 수만 있는 것·등식
            const gone = d.shuffle([row(ts([1, 'x'], [b, '']), '>', ts([1, 'x'], [-c, ''])), row([tg(a, ts([1, 'x'], [-1, '']))], '<', ts([a, 'x'])), row(ts([-a, 'x'], [b, '']), '>=', ts([-c, ''], [-a, 'x'])), row(ts([1, 'x'], [a, 'x']), '<=', ts([a + 1, 'x'], [b, '']))]);
            const square = d.shuffle([row(ts([1, 'X'], [-1, 'x'], [b, '']), '>', ts([1, 'x'], [c, ''])), row(ts([a, 'x']), '>=', ts([-b, ''], [-1, 'X'])), row([tg(1, ts([1, 'x'], [e, '']), '(', 'x')], '>=', ts([1, 'x']))]);
            const other = d.shuffle([row(ts([b, '']), '<', [tm(c, ''), tm(b + 1, '')]), row(ts([a, 'x'], [-b, '']), '=', ts([1, 'x'], [c, '']))]);
            if (n === 0) {
              const right = d.bool() ? fading[0] : plain[0], { rows, at } = mix(d, right, [gone[0], square[0], other[0]]);
              return C('다음 중 일차부등식인 것은?', rows.map((it) => it.bare), at, {
                explain: `부등식의 모든 항을 좌변으로 이항하여 정리하였을 때 좌변이 ${x}에 대한 일차식이 되는 부등식이 일차부등식이다. ${it2(rows)}`,
                facts: { truth: rows.map((it) => it.kind === 'lin'), want: true, rule: 'lin-0' }
              });
            }
            const k = d.int(2, 3), rows = d.shuffle([fading[0], plain[0]].concat(k === 3 ? [plain[1]] : [], [gone[0], square[0]], k === 3 ? [] : [other[0]])), flags = rows.map((it) => it.kind === 'lin');
            return N('다음 중 일차부등식은 모두 몇 개인가?', k, {
              unit: '개', figure: tagEq(rows.map((it) => it.h)),
              explain: `부등식의 모든 항을 좌변으로 이항하여 정리하였을 때 좌변이 ${x}에 대한 일차식이 되는 부등식이 일차부등식이다. ${rows.map((it, i) => `${LAB[i]}은 ${why(it)}`).join('. ')}. 일차부등식은 ${LAB.filter((_, i) => flags[i]).join(', ')}의 ${k}개이다.`,
              facts: { count: flags, rule: 'lin-1' }
            });
            function it2(list) { return list.map((it) => `${it.bare}의 경우 ${why(it)}`).join('. ') + '.'; }
          }, { count: 2 }),
          T('lin-sentence', '문장을 부등식으로 나타낼 때 일차부등식이 아닌 것', '①17', (d) => {
            const a = d.int(2, 5), b = d.int(2, 9), c = d.int(11, 30), p = 100 * d.int(3, 9), r = 1000 * d.int(3, 9), v = 10 * d.int(4, 8), t = d.int(2, 4), k = d.int(11, 16), s = d.int(25, 35), w = d.int(3, 9), per = 2 * d.int(15, 30), sq = d.pick([36, 49, 64, 81, 100]);
            const yes = d.shuffle([
              [`${x}의 ${a}배에서 ${b}${tail(b, '을/를')} 뺀 수는 ${c}보다 크다.`, iqB(ts([a, 'x'], [-b, '']), '>', ts([c, '']))],
              [`한 개에 ${p}원인 사탕 ${x}개의 값은 ${r}원 이하이다.`, iqB(ts([p, 'x']), '<=', ts([r, '']))],
              [`시속 ${v} km로 ${x}시간 동안 달린 거리는 ${v * t + 10} km 이하이다.`, iqB(ts([v, 'x']), '<=', ts([v * t + 10, '']))],
              [`${x}장씩 묶은 색종이 ${k}묶음과 낱장 ${w}장을 합하면 ${10 * s}장보다 많다.`, iqB(ts([k, 'x'], [w, '']), '>', ts([10 * s, '']))],
              [`가로의 길이가 ${xu('cm')}, 세로의 길이가 ${w} cm인 직사각형의 둘레의 길이는 ${per} cm 이상이다.`, iqB([tg(2, ts([1, 'x'], [w, '']))], '>=', ts([per, '']))]
            ]).slice(0, 3);
            const no = d.pick([
              [`한 변의 길이가 ${xu('cm')}인 정사각형의 넓이는 ${sq} cm² 이상이다.`, `${nb(`${x}${sup(2)} ${GE} ${sq}`)}이고 좌변이 일차식이 아니다`],
              [`${x}에 ${b}${tail(b, '을/를')} 더한 수는 ${x}보다 크다.`, `${iqB(ts([1, 'x'], [b, '']), '>', ts([1, 'x']))}이고, 정리하면 ${nb(`${b} ${GT} 0`)}이 되어 ${x}의 항이 없다`],
              [`밑변의 길이와 높이가 모두 ${xu('cm')}인 삼각형의 넓이는 ${2 * w} cm² 미만이다.`, `${nb(`${frac(1, 2)}${x}${sup(2)} ${LT} ${2 * w}`)}이고 좌변이 일차식이 아니다`]
            ]), { rows, at } = mix(d, no, yes);
            return C('다음 문장을 부등식으로 나타낼 때, 일차부등식이 아닌 것은?', rows.map((row) => row[0]), at, {
              explain: `「${no[0]}」를 부등식으로 나타내면 ${no[1]}. 나머지를 부등식으로 나타내면 차례로 ${rows.filter((row) => row !== no).map((row) => row[1]).join(', ')}이고 모두 일차부등식이다.`,
              facts: { truth: rows.map((row) => row !== no), want: false }
            });
          }),
          T('solve-used', '풀이의 단계마다 이용한 부등식의 성질', '②24 심5', (d) => {
            // 두 가지 차례: 상수항을 먼저 없애고 나누기(㉠ 다음 ㉡·㉢) / 괄호 앞의 수로 먼저 나누고 상수항 없애기(㉡·㉢ 다음 ㉠)
            const a = pm(d) * d.int(2, 6), v = nz(d, -6, 6), b = d.until(() => nz(d, -9, 9), (w) => w !== v), r = anyRel(d), divFirst = d.bool(), by = a > 0 ? 1 : 2;
            const rows = divFirst ? [ineqH([tg(a, ts([1, 'x'], [b, '']))], r, ts([a * (v + b), ''])), ineqH(ts([1, 'x'], [b, '']), a < 0 ? FLIP[r] : r, ts([v + b, ''])), ineqH(ts([1, 'x']), a < 0 ? FLIP[r] : r, ts([v, '']))]
              : [ineqH(ts([a, 'x'], [b, '']), r, ts([a * v + b, ''])), ineqH(ts([a, 'x']), r, ts([a * v, ''])), ineqH(ts([1, 'x']), a < 0 ? FLIP[r] : r, ts([v, '']))];
            const right = divFirst ? [by, 0] : [0, by], opts = [[0, 1], [0, 2], [1, 0], [2, 0]], at = opts.findIndex((o) => o.join() === right.join());
            const props = lines([`${nb(`${va} ${LT} ${vb}`)}일 때`, `${tag(LAB[0])}${nb(`${va} + ${vc} ${LT} ${vb} + ${vc}`)}, ${nb(`${va} − ${vc} ${LT} ${vb} − ${vc}`)}`,
              `${tag(LAB[1])}${nb(`${vc} ${GT} 0`)}이면 ${nb(`${va}${vc} ${LT} ${vb}${vc}`)}, ${nb(`${frac(va, vc)} ${LT} ${frac(vb, vc)}`)}`, `${tag(LAB[2])}${nb(`${vc} ${LT} 0`)}이면 ${nb(`${va}${vc} ${GT} ${vb}${vc}`)}, ${nb(`${frac(va, vc)} ${GT} ${frac(vb, vc)}`)}`]);
            return C('다음은 부등식의 성질을 이용하여 일차부등식을 푸는 과정이다. (가), (나)에서 이용한 부등식의 성질을 차례로 적은 것은?', opts.map((o) => o.map((i) => LAB[i]).join(', ')), at, {
              figure: props + procFig([{ h: rows[0] }, { note: '(가)' }, { h: rows[1] }, { note: '(나)' }, { h: rows[2] }]),
              explain: divFirst ? `(가)에서는 양변을 ${a < 0 ? '음수 ' : ''}${iq(a)}${tail(Math.abs(a), '으로/로')} 나누었다. ${a < 0 ? '음수로 나누어 부등호의 방향이 바뀌었으므로 ㉢' : '양수로 나누어 부등호의 방향이 그대로이므로 ㉡'}이다. (나)에서는 ${b > 0 ? `양변에서 ${b}${tail(b, '을/를')} 빼었으므로` : `양변에 ${-b}${tail(-b, '을/를')} 더하였으므로`} ㉠이다.`
                : `(가)에서는 ${b > 0 ? `양변에서 ${b}${tail(b, '을/를')} 빼었으므로` : `양변에 ${-b}${tail(-b, '을/를')} 더하였으므로`} ㉠이다. (나)에서는 양변을 ${a < 0 ? '음수 ' : ''}${iq(a)}${tail(Math.abs(a), '으로/로')} 나누었다. ${a < 0 ? '음수로 나누어 부등호의 방향이 바뀌었으므로 ㉢' : '양수로 나누어 부등호의 방향이 그대로이므로 ㉡'}이다.`,
              facts: { truth: opts.map((o) => o.join() === right.join()), want: true }
            });
          }),
          T('solve-blanks', '일차부등식을 푸는 과정의 빈칸', '①18 ②25', (d) => {
            // 이항하여 정리하면 x 의 계수가 음수가 되어, 나눌 때 부등호의 방향이 바뀐다.
            const m = d.until(() => { const a = nz(d, -6, 4), c = d.until(() => nz(d, -4, 7), (w) => w !== a), v = nz(d, -6, 6), b = nz(d, -9, 9); return { a, c, v, b, e: (a - c) * v + b }; }, (t) => t.a - t.c < -1 && t.e !== 0 && Math.abs(t.e) <= 20);
            const { a, c, v, b, e } = m, r = anyRel(d), p = a - c, q = e - b, ja = js(Q(a)), jc = js(Q(c)), jb = js(Q(b)), je = js(Q(e));
            return M('다음은 일차부등식을 푸는 과정이다. ㉠, ㉡, ㉣에 알맞은 수와 ㉢에 알맞은 부등호를 구하시오.', [{ label: LAB[0], answer: p, signed: true }, { label: LAB[1], answer: q, signed: true }, { label: LAB[2], rel: true, answer: FLIP[r] }, { label: LAB[3], answer: v, signed: true }], {
              figure: procFig([{ h: ineqH(ts([a, 'x'], [b, '']), r, ts([c, 'x'], [e, ''])) }, { note: `${x}를 포함한 항은 좌변으로, 상수항은 우변으로 이항하여 정리한다.` }, { h: `${box(LAB[0])}${x}${relH(r)}${box(LAB[1])}` },
                { note: '양변을 ㉠으로 나눈다.' }, { h: `${x} ${box(LAB[2])} ${box(LAB[3])}` }]),
              shown: `${LAB[0]} ${iq(p)}, ${LAB[1]} ${iq(q)}, ${LAB[2]} ${RH[FLIP[r]]}, ${LAB[3]} ${iq(v)}`,
              explain: `이항하면 ${iqB(ts([a, 'x'], [-c, 'x']), r, ts([e, ''], [-b, '']))}이고 정리하면 ${iqB(ts([p, 'x']), r, ts([q, '']))}이므로 ㉠은 ${iq(p)}, ㉡은 ${iq(q)}이다. 양변을 음수 ${iq(p)}${tail(-p, '으로/로')} 나누면 부등호의 방향이 바뀌므로 ㉢은 ${RH[FLIP[r]]}이고, ${nb(`${iq(q)} ÷ (${iq(p)}) = ${iq(v)}`)}이므로 ㉣은 ${iq(v)}이다.`,
              facts: { calc: [[`${ja}-${jc}`, 0], [`${je}-${jb}`, 1], [`(${je}-${jb})/(${ja}-${jc})`, 3]], unseen: [1] }
            });
          }),
          T('solve-basic', '일차부등식 풀기', '①19 ②26', (d, n) => {
            // 차례마다 구조가 다르다: x 의 계수가 양수, x 의 계수가 음수(방향이 바뀐다), 양변에 x.
            const make = [
              () => { const a = d.int(2, 7), b = nz(d, -12, 12), v = nz(d, -9, 9); return [d.bool() ? ts([a, 'x'], [b, '']) : ts([b, ''], [a, 'x']), anyRel(d), ts([a * v + b, ''])]; },
              () => { const a = -d.int(1, 7), b = nz(d, -12, 12), v = nz(d, -9, 9); return [d.bool() ? ts([a, 'x'], [b, '']) : ts([b, ''], [a, 'x']), anyRel(d), ts([a * v + b, ''])]; },
              () => [ts([nz(d, -9, 9), 'x'], [nz(d, -15, 15), '']), anyRel(d), ts([nz(d, -9, 9), 'x'], [nz(d, -15, 15), ''])]
            ][n], [L, r, R] = pickIq(d, make, 'int', (l, rel, rr) => evS(rr, { x: Q(0) }).p !== 0 || n === 2);
            return solveQ(L, r, R, 'basic-' + n);
          }, { count: 3 }),
          T('solve-frac-answer', '해의 경계가 분수인 일차부등식', '①19 ②26', (d) => {
            const [L, r, R] = pickIq(d, () => (d.bool() ? [ts([nz(d, -9, 9), ''], [pm(d) * d.int(2, 9), 'x']), anyRel(d), ts([nz(d, -9, 9), ''])] : [ts([nz(d, -9, 9), 'x'], [nz(d, -9, 9), '']), anyRel(d), ts([nz(d, -9, 9), 'x'], [nz(d, -9, 9), ''])]), 'frac');
            return solveC(d, L, r, R, 'frac-answer');
          }),
          T('solve-line-pick', '해를 수직선 위에 나타낸 것 고르기', '①21 ①22 ②31 ②32 심18', (d) => {
            // 보기 넷: 바른 것, 끝점의 ○·●만 다른 것, 방향만 다른 것, 경계의 부호가 다른 것
            const k = d.pick([-2, -1, 1, 2]), rel = anyRel(d), [L, r, R] = craft(d, rel, k, d.pick(['both', 'paren', 'both']));
            const cand = [[k, rel], [k, strict(rel) ? (up(rel) ? '>=' : '<=') : (up(rel) ? '>' : '<')], [k, FLIP[rel]], [-k, rel]], rows = d.shuffle(cand), at = rows.indexOf(cand[0]);
            const s = solve(L, r, R, 'x');
            return C(`일차부등식 ${iqB(L, r, R)}의 해를 수직선 위에 바르게 나타낸 것은?`, LAB.slice(0, 4), at, {
              figure: lines(rows.map(([v, rr], i) => tag(LAB[i]) + rayLine(-3, 3, v, up(rr) ? 1 : -1, !strict(rr), `수직선 위에 부등식의 해를 나타낸 그림 ${LAB[i]}`))),
              explain: `${s.text} ${iq(k)}${tail(Math.abs(k), '이/가')} 해에 ${strict(rel) ? '들지 않으므로 ○' : '들므로 ●'}로 나타내고, ${iq(k)}보다 ${up(rel) ? '큰 수가 해이므로 오른쪽' : '작은 수가 해이므로 왼쪽'}으로 선을 긋는다.`,
              facts: { truth: rows.map(([v, rr]) => v === s.v.p && rr === s.rel), want: true }
            });
          }),
          T('line-match', '수직선에 나타낸 해와 해가 같은 일차부등식 고르기', '①23 ②33 심17', (d) => {
            // 보기 넷: 해가 그림과 같은 것, 등호만 다른 것, 방향만 다른 것, 경계의 부호가 다른 것
            const k = d.pick([-2, -1, 1, 2]), rel = anyRel(d), other = strict(rel) ? (up(rel) ? '>=' : '<=') : (up(rel) ? '>' : '<'), shapes = d.shuffle(['one', 'both', 'both', 'paren']);
            const cand = [[rel, k], [other, k], [FLIP[rel], k], [rel, -k]].map(([rr, v], i) => craft(d, rr, v, shapes[i])), rows = d.shuffle(cand), at = rows.indexOf(cand[0]), sols = rows.map(([L, r, R]) => solI(L, r, R));
            return C('다음 일차부등식 가운데 해를 수직선 위에 나타내면 그림과 같은 것은?', rows.map(([L, r, R]) => iqB(L, r, R)), at, {
              figure: rayLine(-3, 3, k, up(rel) ? 1 : -1, !strict(rel)),
              explain: `그림은 ${iq(k)}에 ${strict(rel) ? '○' : '●'}가 있고 ${up(rel) ? '오른쪽' : '왼쪽'}으로 선이 뻗어 있으므로 ${solH('x', rel, k)}${tail(Math.abs(k), '을/를')} 나타낸다. 보기의 해는 차례로 ${sols.map((s) => solH('x', s.rel, s.v)).join(', ')}이다.`,
              facts: { truth: sols.map((s) => s.rel === rel && s.v.q === 1 && s.v.p === k), want: true }
            });
          }),
          T('solve-same', '해가 주어진 것과 같은 부등식·해가 다른 부등식', '①20 ②34', (d, n) => {
            const k = d.pick([-4, -3, -2, 2, 3, 4]), rel = anyRel(d);
            if (n === 0) {
              // 해가 주어진 것: 한 번에 풀리는 짧은 부등식 넷
              const shapes = d.shuffle(['ax', 'one', 'div', 'ax']), cand = [[rel, k], [FLIP[rel], k], [rel, -k], [FLIP[rel], -k]].map(([rr, v], i) => craft(d, rr, v, shapes[i]));
              const rows = d.shuffle(cand), at = rows.indexOf(cand[0]), sols = rows.map(([L, r, R]) => solI(L, r, R));
              return C(`다음 일차부등식 가운데 해가 ${solH('x', rel, k)}인 것은?`, rows.map(([L, r, R]) => iqB(L, r, R)), at, {
                explain: `보기의 해는 차례로 ${sols.map((s) => solH('x', s.rel, s.v)).join(', ')}이다. 음수로 나눌 때는 부등호의 방향이 바뀐다.`,
                facts: { truth: sols.map((s) => s.rel === rel && s.v.q === 1 && s.v.p === k), want: true, rule: 'same-0' }
              });
            }
            // 해가 나머지 셋과 다른 것: 경계는 같고 방향만 다르다.
            const shapes = d.shuffle(['one', 'both', 'paren', 'both']), oddAt = d.int(0, 3);
            const rows = d.until(() => shapes.map((shape, i) => craft(d, i === oddAt ? FLIP[rel] : rel, k, shape)), (list) => new Set(list.map(([L, r, R]) => ineqH(L, r, R, true))).size === 4), sols = rows.map(([L, r, R]) => solI(L, r, R));
            return C('다음 일차부등식 가운데 해가 나머지 셋과 다른 것은?', LAB.slice(0, 4), oddAt, {
              figure: tagEq(rows.map(([L, r, R]) => ineqH(L, r, R))),
              explain: `부등식의 해는 차례로 ${sols.map((s) => solH('x', s.rel, s.v)).join(', ')}이다. ${LAB[oddAt]}만 해가 ${solH('x', FLIP[rel], k)}이고 나머지는 ${solH('x', rel, k)}이다.`,
              facts: { truth: sols.map((s) => s.rel !== rel), want: true, rule: 'same-1' }
            });
          }, { count: 2 }),
          T('solve-member', '주어진 수 가운데 일차부등식의 해가 아닌 것', '②35', (d) => {
            // 해의 경계가 되는 수가 보기에 있다: 등호가 있으면 해이고, 없으면 해가 아니다.
            // (ax + b)/p r (cx + e)/q 의 해가 「x rel v」가 되게 e 를 정한다.
            const v = nz(d, -4, 4), rel = anyRel(d), m = d.until(() => { const p = d.pick([2, 3, 4]), q = d.until(() => d.pick([2, 3, 5]), (w) => w !== p), a = d.int(1, 4), c = d.int(1, 4), b = nz(d, -5, 5); return { p, q, a, c, b, e: ((q * a - p * c) * v + q * b) / p }; }, (t) => t.q * t.a !== t.p * t.c && Number.isInteger(t.e) && t.e !== 0 && Math.abs(t.e) <= 9 && gcd(gcd(t.a, Math.abs(t.b)), t.p) === 1 && gcd(gcd(t.c, Math.abs(t.e)), t.q) === 1);
            const L = [tf(ts([m.a, 'x'], [m.b, '']), m.p, 1)], R = [tf(ts([m.c, 'x'], [m.e, '']), m.q, 1)], r = m.q * m.a - m.p * m.c > 0 ? rel : FLIP[rel];
            const dir = up(rel) ? 1 : -1, nums = strict(rel) ? [v, v + dir, v + 2 * dir, v + 4 * dir] : [v - dir, v, v + dir, v + 3 * dir], rows = d.shuffle(nums), flags = rows.map((t) => holds(L, r, R, { x: Q(t) })), s = solve(L, r, R, 'x');
            return C('다음 중 일차부등식의 해가 아닌 것은?', rows.map(iq), flags.indexOf(false), {
              figure: iqF(L, r, R),
              explain: `${s.text} ${strict(rel) ? `${iq(v)}${tail(Math.abs(v), '은/는')} 해에 들지 않는다.` : `${iq(v)}${tail(Math.abs(v), '은/는')} 해에 들고, ${iq(v - dir)}${tail(Math.abs(v - dir), '은/는')} 해가 아니다.`}`,
              facts: { truth: flags, want: false }
            });
          })
        ]
      },
      { id: 'forms', title: '여러 가지 일차부등식', standard: STD2, types: [] },
      { id: 'param', title: '해의 조건과 수 구하기', standard: STD2, types: [] },
      { id: 'word', title: '일차부등식의 활용', standard: STD2, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(8-1-3b.js, 8-1-3c.js)이 함께 쓰는 도구
  B.kit.m813 = {
    STD1, STD2, T, x, va, vb, vc, iq, RELS, RH, FLIP, NOT, strict, up, cmpOk, VH, tm, tg, tf, tb, ts, sgn, sideH, relH, ineqH, emQ, exq, keep, xu, iqB, iqF, termH, solH, tagEq, procFig,
    evS, holds, gather, sideOf, solI, quad, flatS, scS, subS, undec, denS, solJ, rangeJ, jsS, denL, solve, diffOf, relate, SOLVE, anyRel, mix, nice, lean, pickIq, solveQ, solveC, craft,
    FORM, formH, formAt, stepSay, walk, pairOf, formTold, formBack, formRel, stmt, rayLine
  };
})(typeof window !== 'undefined' ? window : globalThis);
