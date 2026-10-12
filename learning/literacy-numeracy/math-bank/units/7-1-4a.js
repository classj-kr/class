// 중학교 1학년 1학기 4단원 일차방정식 — 단원 틀·도구와 앞쪽 묶음(등식·방정식·항등식, 방정식의 해, 등식의 성질, 이항과 일차방정식의 뜻).
// 수집해 둔 교과서 3종(미래엔 황선욱, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 82꼴, 심화꼴 58꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-1-4/싣기_대조표.md 에 있다.
// (일차방정식의 풀이·해와 상수·활용은 7-1-4b.js 에, 실력 문항은 7-1-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-03(방정식과 그 해의 뜻을 알고, 등식의 성질을 설명할 수 있다), 9수02-04(일차방정식을 풀 수 있고, 이를 활용하여 문제를 해결할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식 목록·문장·풀이 과정), 묻는 것(값·개수·고르기·빈칸), 방정식의 구조가 다르면 따로 싣는다.
//    풀이 유형은 방정식의 구조가 다를 때만 따로 싣고 facts.rule 에 이름을 단다: ax = b / 한쪽에만 미지수 / 양변에 미지수 / 괄호 / 중괄호 / 계수가 소수 /
//    계수가 분수 / 분자가 일차식인 분수 / 분수와 소수가 섞임 / 비례식 꼴. 같은 구조에서 수만 바꾼 유형은 만들지 않았다. 해가 분수인 방정식은 수집본만큼 섞었다.
//  - 답: 해와 상수의 값은 부호 단추가 붙은 칸으로 받는다(「x =」는 물음에 적고 수만 받는다). 한 유형(차례)의 답은 늘 같은 꼴(정수 / 분수)이다.
//    분수 답은 원문대로 기약분수·가분수로 적어 두고 크기가 같은 분수를 모두 받는다. 활용의 답(사람 수·개수·거리·금액)은 음수일 수 없으므로 부호 단추 없이 받는다.
//    등식·방정식을 쓰는 답(문장을 등식으로, 이항한 식)은 고르기로, 답이 일차식인 꼴은 계수와 상수항 두 칸(linAns)으로 받는다.
//  - 교육과정의 금: 「방정식, 부등식, 함수에 대한 지나치게 복잡한 활용 문제는 다루지 않는다.」 활용은 한 상황에 식을 한 번 세우는 것만 기본에 싣고,
//    식으로 옮길 때 뜻을 한 번 더 대야 하는 것(마지막 자리가 덜 차는 과부족, 도중에 바뀌는 속력, 뒤따라가 만나기, 기차와 다리, 물을 더 넣는 소금물,
//    정가와 할인, 두 사람의 일의 양)은 실력에 실었다. 여러 겹인 것(두 소금물 섞기, 할인율 둘, 시계 바늘, 비 셋, 증감 둘, 세 사람의 일, 물통)은 싣지 않았다.
//  - 용어는 교육과정의 것(등식, 방정식, 미지수, 해, 근, 항등식, 이항, 일차방정식)과 좌변·우변·양변을 쓴다. 앞 단원에서 배운 것(곱셈 기호의 생략, 동류항, 분배법칙)은 그대로 쓴다.
//  - 참·거짓은 손으로 적지 않고 코드로 가린다: 두 등식이 서로 따라 나오는가(계수의 비), 이항이 옳은가(좌변 − 우변이 그대로인가), 항등식인가(정리한 두 변이 같은가).
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-1-4b.js, 7-1-4c.js 의 것까지 여기에 모아 적는다)
//  - 범위 밖: 해가 없거나 모든 수가 해인 조건(심27), 미지수가 둘인 식·연립 꼴(심28·56), 문자가 분모에 있고 정수 조건으로 푸는 것(심57), 배수 판정(심58).
//  - 꼬인 것(조건 풀이·요령): 해가 같은 세 방정식의 상수 둘(①49), 두 해의 비(①51 심23), 해의 절댓값이 같음(①52), 해가 자연수·정수가 되게 하는 상수 모두 찾기(①54 심24·25·26),
//    새로 약속한 기호(심29·30), 규칙·카드·몫 나누기(심54·55).
//  - 지나치게 복잡한 활용(교육과정의 금): 두 소금물 섞기·증발시킨 뒤 소금 넣기(①76 심48), 할인율이 다른 두 물건(①79), 할인율과 이익률이 겹친 정가(심52), 시계 바늘(심47),
//    비 셋(심43), 백분율 증감 둘(심42), 세 사람·세 구간의 일(심51), 호스 둘로 물통 채우기(심50의 변형), 남은 양의 분수를 거듭 주기(심53).
//  - 뜻 없는 셈·놀이: 두 해의 합과 해를 넣은 식의 값(①42), 세 근을 늘어놓아 만든 전화번호(①44), 짝 활동(①45).
//  - 그림을 알 수 없는 것: 수 삼각형·블록 모형·무슨 그림인지 모르는 것(①80·81·82), 바둑돌이 놓인 모양(심39 — 규칙을 식으로 쓰는 일은 앞 단원이기도 하다).
//  - 같은 일이어서 한 번만 실은 것: 등식의 성질로 풀기(①21 — 답만 받으므로 ①29·30·35와 같다), 이항한 식의 부호 넣기(①24 — ①23과 같다),
//    성질이 쓰인 자리 고르기(심9 — ①18·20과 같다), 다른 방정식의 해까지 함께 묻기(①46의 변형), 상황은 같고 수의 꼴만 다른 활용의 변형(①60의 분수 계수, ①61의 책값, ①70의 분수 답).
//  - 서술형은 고르기·빈칸으로 바꾸어 실었다(①22·40·67·73·74·77).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C } = B.kit;
  const STD3 = '9수02-03', STD4 = '9수02-04';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 유리수·수를 적는 글·문항 도구는 공용 파일(middle.js 의 B.kit.mid)에 있다.
  const { LAB, MINUS, GT, LT, GE, LE, gcd, lcm, Q, dc, plainQ, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, mag, tx, sx, nb, tail, lastOf, tj, sj, js, V, sup, emOf, fit, tag, nz, pm, ansV, asQ, linAns } = B.kit.mid;
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];
  const x = V('x'), va = V('a'), vb = V('b'), vc = V('c');
  const iq = (n) => tx(Q(n));

  // ── 식의 겉모습 ──
  // 한 변은 항의 배열이다. 항의 종류:
  //  tm(c, vs)       단항식 c × (문자들). vs 는 문자를 이어 적은 글('' 상수항, 'x', 'a', 'ax', 'X' 는 x²). c 는 수나 유리수(dc 로 준 수는 소수로 적는다).
  //  tg(m, list, br) 묶음 m × (list). m 이 1이면 (…), −1이면 −(…)로 적는다. br: '(' | '{'
  //  tf(list, den, s) 분수 ±(list)/den. 분자가 일차식인 분수. s 는 +1 | −1
  //  tb(label, s)    빈칸(그리기만 한다)
  const VH = (vs) => vs.split('').map((n) => (n === 'X' ? V('x') + sup(2) : V(n))).join('');
  const tm = (c, vs) => ({ k: 'm', c: asQ(c), vs: vs || '' });
  const tg = (m, list, br) => ({ k: 'g', m: asQ(m), list, br: br || '(' });
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
    if (t.k === 'g') { const m = qabs(t.m); return (isOne(m) ? '' : mag(m)) + BRK[t.br][0] + sideH(t.list, bare) + BRK[t.br][1]; }
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
  const eqH = (L, R, bare) => sideH(L, bare) + (bare ? ' = ' : ' <i>=</i> ') + sideH(R, bare);
  // 식의 너비 어림(분자가 식인 분수는 분자와 분모 가운데 긴 쪽만 센다).
  // 공용 어림(emOf)은 수로 된 식에 맞춘 것이라 문자가 많은 식에서는 모자란다. 문자(수식 글꼴은 숫자보다 넓다)마다 조금씩 더하고,
  // 실제 사이트의 읽기 글꼴(바탕체)에서도 문항 칸을 넘지 않게 7 % 넉넉히 잡는다(잰 값: 바탕체에서 어림의 1.09배까지).
  const FRAC = /<span class="mb-frac"><span>(.*?)<\/span><span class="mb-frac-bar">\/<\/span><span>(.*?)<\/span><\/span>/g;
  const emRaw = (h) => { let extra = 0; const rest = String(h).replace(FRAC, (m, n, den) => { extra += Math.max(emOf(n), emOf(den)) + 0.62; return ''; }); return emOf(rest) + extra; };
  const emQ = (h) => 1.07 * emRaw(h) + 0.1 * (String(h).match(/class="mb-var"/g) || []).length;
  // 그림 자리에 적는 식(휴대폰 너비에 맞게 글씨를 줄인다)
  const exq = (h, extra) => '<span class="mb-expr"' + fit(emQ(h) + (extra || 0)) + '>' + h + '</span>';
  // 글줄 안의 식: 짧으면 줄이 바뀌지 않게 통째로 묶고, 길면 연산 기호 앞에서만 줄이 바뀌게 항마다 묶는다.
  function chunks(h) {
    const out = []; let depth = 0, span = 0, from = 0;
    for (let i = 0; i < h.length; i += 1) {
      if (h.startsWith('<span', i)) span += 1; else if (h.startsWith('</span>', i)) span -= 1;
      else if (h[i] === '(' || h[i] === '{') depth += 1; else if (h[i] === ')' || h[i] === '}') depth -= 1;
      else if (depth === 0 && span === 0 && /^ [+−=] /.test(h.slice(i, i + 3))) { out.push(h.slice(from, i)); from = i + 1; }
    }
    return out.concat([h.slice(from)]).map(nb).join(' ');
  }
  const keep = (h) => (emQ(h) < 12.5 ? nb(h) : chunks(h));
  // 문자와 단위 기호는 줄이 바뀌어도 떨어지지 않게 묶는다(x cm).
  const xu = (unit) => nb(`${x} ${unit}`);
  const eqB = (L, R) => keep(eqH(L, R, true));
  const eqF = (L, R) => exq(eqH(L, R, false));
  const termH = (c, vs) => sideH([tm(c, vs)], true);
  // 이름표를 붙인 식 여러 줄(글씨 크기는 가장 긴 줄에 맞춘다)
  const tagEq = (list, tags) => { const style = fit(Math.max(...list.map(emQ)) + 2.6); return lines(list.map((h, i) => tag((tags || LAB)[i]) + '<span class="mb-expr"' + style + '>' + h + '</span>')); };
  // 한 줄씩 적은 풀이 과정. 줄은 { h 식, mark 줄 끝의 이름표 }이거나 { note 화살표 옆에 적는 글 }이다.
  function eqProc(rows) {
    const style = fit(Math.max(...rows.filter((r) => r.h).map((r) => emQ(r.h) + (r.mark ? 2.2 : 0)))) || ' style="font-size:1.2rem"';
    return lines(rows.map((r) => (r.note != null ? '<span style="font-size:0.95rem;color:#475569">↓ ' + r.note + '</span>'
      : '<span class="mb-expr"' + style + '>' + r.h + (r.mark ? '<span style="margin-left:0.6em;font-weight:700;color:#1d4ed8">' + r.mark + '</span>' : '') + '</span>')));
  }

  // ── 식의 값과 셈 ──
  // env: 문자마다의 값(유리수). x² 은 'X' 로 따로 준다.
  const evT = (t, env) => (t.k === 'm' ? t.vs.split('').reduce((v, n) => qmul(v, env[n]), plainQ(t.c)) : t.k === 'g' ? qmul(t.m, evS(t.list, env)) : qmul(Q(t.s, t.den), evS(t.list, env)));
  const evS = (list, env) => list.reduce((s, t) => qadd(s, evT(t, env)), Q(0));
  // 검사가 다시 셈하는 식 글. env: 문자마다 넣을 글('0', '1', '(-2)' …)
  function jsT(t, env) {
    if (t.k === 'f') return '(' + jsS(t.list, env) + ')/' + t.den;
    if (t.k === 'g') { const m = qabs(t.m); return (isOne(m) ? '' : js(m) + '*') + '(' + jsS(t.list, env) + ')'; }
    const c = qabs(t.c), vars = t.vs.split('').map((n) => env[n]);
    return (isOne(c) && vars.length ? [] : [js(c)]).concat(vars).join('*');
  }
  const jsS = (list, env) => list.map((t, i) => (sgn(t) < 0 ? '-' : i ? '+' : '') + jsT(t, env)).join('');
  const diffJ = (L, R, env) => '(' + jsS(L, env) + ')-(' + jsS(R, env) + ')';
  // 방정식 L = R 을 문자 u 에 대하여 푼 값을 다시 셈하는 식: u 에 0과 1을 넣은 (좌변 − 우변)의 값 f(0), f(1)로 −f(0) ÷ {f(1) − f(0)}을 셈한다.
  // (식에 든 수는 문제에 적힌 수뿐이고, 0과 1만 facts.unseen 에 밝힌다.)
  const solJ = (L, R, u, env) => { const at = (v) => diffJ(L, R, Object.assign({}, env, { [u]: v })); return `-(${at('0')})/((${at('1')})-(${at('0')}))`; };
  // 문자 u 에 대한 일차식 au + b 로 모은 계수
  const gather = (list, u, env) => { const at = (v) => evS(list, Object.assign({}, env, { [u]: Q(v) })); const b = at(0); return { a: qsub(at(1), b), b }; };
  const sideOf = (a, b, u) => ts([a, u], [b, '']);
  // 방정식의 해(유리수). 일차방정식이 아니면 null
  const solQ = (L, R, u, env) => { const l = gather(L, u || 'x', env), r = gather(R, u || 'x', env), p = qsub(l.a, r.a); return p.p === 0 ? null : qdiv(qsub(r.b, l.b), p); };
  // 괄호를 푼 꼴
  const xpT = (t) => (t.k === 'm' ? [[t.c, t.vs]] : xpS(t.list).map(([c, vs]) => [qmul(t.k === 'g' ? t.m : Q(t.s, t.den), c), vs]));
  const xpS = (list) => list.reduce((all, t) => all.concat(xpT(t)), []);
  const flatS = (list) => ts(...xpS(list));
  // 양변에 n 을 곱한 꼴(분모와 소수를 없앤다)
  function scT(t, n) {
    if (t.k === 'm') return [tm(qmul(t.c, Q(n)), t.vs)];
    if (t.k === 'g') return [tg(qmul(t.m, Q(n)), t.list, t.br)];
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

  // 방정식 L = R(문자 u 에 대한 일차방정식)을 푸는 과정을 한 단계씩 적는다: 분모·소수 없애기 → 괄호 풀기 → 동류항 정리 → 이항 → 양변을 나누기.
  function solve(L, R, u) {
    const name = u || 'x', say = [];
    let l = L, r = R;
    if ((hasDec(l) || hasDec(r)) && (hasFrac(l) || hasFrac(r))) { l = undec(l); r = undec(r); say.push(`소수를 분수로 고치면 ${eqB(l, r)}`); }
    const n = lcm(denS(l), denS(r));
    if (n > 1) { l = scS(l, n); r = scS(r, n); say.push(`양변에 ${n}${tail(n, '을/를')} 곱하면 ${eqB(l, r)}`); }
    if (hasG(l) || hasG(r)) { l = flatS(l); r = flatS(r); say.push(`괄호를 풀면 ${eqB(l, r)}`); }
    let gl = gather(l, name), gr = gather(r, name);
    if (!tidy(l, name) || !tidy(r, name)) { l = sideOf(gl.a, gl.b, name); r = sideOf(gr.a, gr.b, name); say.push(`동류항끼리 정리하면 ${eqB(l, r)}`); }
    if (gl.a.p === 0) { [l, r] = [r, l]; [gl, gr] = [gr, gl]; say.push(`좌변과 우변을 서로 바꾸면 ${eqB(l, r)}`); }
    const p = qsub(gl.a, gr.a), q = qsub(gr.b, gl.b);
    if (gl.b.p !== 0 || gr.a.p !== 0) {
      const left = [tm(gl.a, name)].concat(gr.a.p !== 0 ? [tm(qneg(gr.a), name)] : []), right = (gr.b.p !== 0 ? [tm(gr.b, '')] : []).concat(gl.b.p !== 0 ? [tm(qneg(gl.b), '')] : []);
      const what = gl.b.p !== 0 && gr.a.p !== 0 ? `${V(name)}를 포함한 항은 좌변으로, 상수항은 우변으로 이항하면` : gl.b.p !== 0 ? `${sj(gl.b, '을/를')} 이항하면` : `우변의 ${termH(gr.a, name)}를 이항하면`;
      const moved = eqB(left, right.length ? right : [tm(0, '')]);
      say.push(left.length + right.length > 2 ? `${what} ${moved}, ${eqB([tm(p, name)], [tm(q, '')])}` : `${what} ${moved}`);
    }
    const v = qdiv(q, p);
    if (!isOne(p)) say.push(`양변을 ${tx(p)}${tail(lastOf(p), '으로/로')} 나누면 ${nb(`${V(name)} = ${tx(v)}`)}`);
    return { v, text: say.map((s) => s + '이다.').join(' ') };
  }

  // ── 등식을 견주는 도구 ──
  // 등식 [L, R]을 문자 names 에 대한 식으로 볼 때 (좌변 − 우변)의 [상수항, 문자마다의 계수]
  function diffOf([L, R], names) {
    const zero = {}; names.forEach((n) => { zero[n] = Q(0); });
    const at = (env) => qsub(evS(L, env), evS(R, env)), c = at(zero);
    return [c].concat(names.map((n) => qsub(at(Object.assign({}, zero, { [n]: Q(1) })), c)));
  }
  // 항을 옮기기만 한 같은 등식인가(좌변 − 우변이 그대로다) — 이항이 옳은지 가린다.
  const sameEq = (E1, E2, names) => { const u = diffOf(E1, names), v = diffOf(E2, names); return u.every((c, i) => qcmp(c, v[i]) === 0); };
  // 뒤 등식이 앞 등식에서 항상 따라 나오는가(계수가 비례한다) — 등식의 성질로 고친 식이 옳은지 가린다.
  const follows = (P, E, names) => { const u = diffOf(P, names), v = diffOf(E, names); return v.some((c) => c.p !== 0) && u.every((_, i) => u.every((__, j) => qcmp(qmul(u[i], v[j]), qmul(u[j], v[i])) === 0)); };
  // x² 까지 있는 등식을 정리한 (좌변 − 우변) = a x² + b x + c
  function quad([L, R]) {
    const at = (v) => { const env = { x: Q(v), X: Q(v * v) }; return qsub(evS(L, env), evS(R, env)); }, c = at(0), p = at(1), m = at(-1);
    return { a: qsub(qmul(qadd(p, m), Q(1, 2)), c), b: qmul(qsub(p, m), Q(1, 2)), c };
  }

  // ── 문항 도구 ──
  const SOLVE = `다음 일차방정식을 풀어 ${x}의 값을 구하시오.`;
  // 문자 여럿의 값을 답하는 문항: 칸 앞에 「a =」를 적고, 틀리면 「a = 2, b = −1」로 보인다.
  const valsQ = (text, pairs, o) => M(text, pairs.map(([n, v]) => ({ answer: v, signed: true, lead: V(n) + ' =' })), Object.assign({}, o, { shown: pairs.map(([n, v]) => nb(`${V(n)} = ${iq(v)}`)).join(', ') }));
  // 옳은 것 하나와 나머지를 섞는다.
  const mix = (d, right, others) => { const rows = d.shuffle([right].concat(others)); return { rows, at: rows.indexOf(right) }; };
  // 해가 답의 꼴에 맞고 수가 크지 않은가
  const nice = (v, kind) => Boolean(v) && (kind === 'int' ? v.q === 1 && v.p !== 0 && Math.abs(v.p) <= 15 : v.q > 1 && v.q <= 15 && Math.abs(v.p) <= 40);
  // 방정식 하나를 푸는 문항. 같은 꼴의 방정식이 여럿이므로 구조의 이름(rule)을 단다.
  function solveQ(L, R, kind, rule, o) {
    const s = solve(L, R, 'x'), opt = o || {};
    return ansV(opt.text || SOLVE, s.v, kind, { figure: opt.figure || eqF(L, R), explain: opt.explain || (opt.lead || '') + s.text, facts: { value: solJ(L, R, 'x', {}), unseen: [0, 1], rule } });
  }
  // 조건에 맞는 방정식이 나올 때까지 다시 만든다(해의 꼴과 크기, 정리한 ax = b 의 크기).
  const pickEq = (d, make, kind, ok) => d.until(make, ([L, R]) => {
    const v = solQ(L, R); if (!nice(v, kind)) return false;
    const n = lcm(denS(undec(L)), denS(undec(R))), l = gather(L, 'x'), r = gather(R, 'x'), p = qmul(qsub(l.a, r.a), Q(n)), q = qmul(qsub(r.b, l.b), Q(n));
    return Math.abs(p.p) <= 60 && Math.abs(q.p) <= 150 && (!ok || ok(L, R, v));
  });

  B.addUnit({
    id: '7-1-4', grade: 7, semester: 1, no: 4, title: '일차방정식', version: 1,
    groups: [
      {
        id: 'eq', title: '등식, 방정식, 항등식', standard: STD3,
        types: [
          T('eq-count', '식 목록에서 등식의 개수 세기', '①1', (d) => {
            const a = d.int(2, 5), b = d.int(2, 9), c = d.int(2, 9), e = d.int(2, 9), op = (s) => ` <i>${s}</i> `;
            const yes = d.shuffle([
              eqH([tm(a + 1, 'x'), tm(-a, 'x')], [tm(b, '')]), eqH([tm(1, 'x'), tm(-1, 'y')], [tm(c, '')]), `${b}${op('+')}${c}${op('=')}${b + c}`,
              eqH([tm(a, 'x')], [tm(a + 1, 'x'), tm(-1, 'x')]), eqH([tm(Q(1, a), 'x')], [tm(e, '')]), eqH([tm(a, 'x'), tm(-b, '')], [tm(0, '')])
            ]);
            const no = d.shuffle([
              `${b}${op(LT)}${b + c}`, sideH([tm(a, 'x'), tm(e, '')]), `${b + c}${op(GE)}${c}`, sideH([tm(a, 'x'), tm(-1, '')]) + op(GT) + e,
              sideH([tm(1, 'x'), tm(b, '')]) + op(LE) + sideH([tm(a, 'x')]), sideH([tm(e, ''), tm(-a, 'x')])
            ]);
            const k = d.int(2, 3), rows = d.shuffle(yes.slice(0, k).map((h) => [h, true]).concat(no.slice(0, 5 - k).map((h) => [h, false]))), flags = rows.map((r) => r[1]);
            return N('다음 중 등식은 모두 몇 개인가?', k, {
              unit: '개', figure: tagEq(rows.map((r) => r[0])),
              explain: `등식은 등호 =를 사용하여 두 수나 두 식이 같음을 나타낸 식이다. 부등호를 사용한 식과 등호가 없는 식은 등식이 아니다. 등식은 ${LAB.filter((_, i) => flags[i]).join(', ')}의 ${k}개이다.`,
              facts: { count: flags }
            });
          }),
          T('eq-sentence', '등식으로 나타낼 수 있는 문장 고르기', '①2', (d) => {
            const a = d.int(2, 5), b = d.until(() => d.int(2, 9), (v) => v !== a), c = d.until(() => d.int(3, 9), (v) => v !== a && v !== b), e = d.int(11, 30);
            const right = d.pick([
              [`어떤 수 ${x}의 ${a}배는 ${x}보다 ${b}만큼 크다.`, eqB([tm(a, 'x')], [tm(1, 'x'), tm(b, '')])],
              [`${x}에서 ${b}${tail(b, '을/를')} 뺀 수는 ${x}의 ${a}배와 같다.`, eqB([tm(1, 'x'), tm(-b, '')], [tm(a, 'x')])],
              [`한 변의 길이가 ${xu('cm')}인 정사각형의 둘레의 길이는 ${4 * c} cm이다.`, eqB([tm(4, 'x')], [tm(4 * c, '')])],
              [`한 개에 ${x}원인 지우개 ${a}개의 값은 ${a * c * 100}원이다.`, eqB([tm(a, 'x')], [tm(a * c * 100, '')])]
            ]);
            const wrong = d.shuffle([
              `${x}의 ${a}배와 ${b}의 합`, `${x}에 ${b}${tail(b, '을/를')} 더한 수는 ${e}보다 작다.`, `한 권에 ${x}원인 공책 ${c}권의 값`,
              `${x}를 ${a}${tail(a, '으로/로')} 나눈 수는 ${b}보다 크다.`, `${x}보다 ${b}만큼 작은 수의 ${a}배`
            ]).slice(0, 3), { rows, at } = mix(d, right[0], wrong);
            return C('다음 중 등식으로 나타낼 수 있는 것은?', rows, at, {
              explain: `두 양이 서로 같다고 말하는 문장만 등식으로 나타낼 수 있다. 「${right[0]}」를 등식으로 나타내면 ${right[1]}이다. 같다는 말이 없이 식만 있는 것과 크고 작음을 말하는 것은 등식으로 나타낼 수 없다.`,
              facts: { truth: rows.map((r) => r === right[0]), want: true }
            });
          }),
          T('eq-to-equation', '문장을 등식으로 나타내기', '①3', (d, n) => {
            // 첫째는 수에 대한 문장(배·합·차와 괄호), 둘째는 상황(물건값, 남은 길이, 둘레, 거리)이다.
            const build = () => {
            let said, right, wrongs, why;
            if (n === 0) {
              const [a, k] = d.until(() => [d.int(2, 5), d.int(2, 4)], ([p, q]) => p !== q), b = d.int(1, 9), c = d.int(1, 9);
              said = `어떤 수 ${x}의 ${a}배에서 ${b}${tail(b, '을/를')} 뺀 수는 ${x}에 ${c}${tail(c, '을/를')} 더한 수의 ${k}배와 같다.`;
              right = [ts([a, 'x'], [-b, '']), [tg(k, ts([1, 'x'], [c, '']))]];
              wrongs = [[ts([a, 'x'], [-b, '']), ts([k, 'x'], [c, ''])], [[tg(a, ts([1, 'x'], [-b, '']))], [tg(k, ts([1, 'x'], [c, '']))]], [ts([b, ''], [-a, 'x']), [tg(k, ts([1, 'x'], [c, '']))]]];
              why = `${x}의 ${a}배에서 ${b}${tail(b, '을/를')} 뺀 수는 ${nb(sideH(right[0], true))}, ${x}에 ${c}${tail(c, '을/를')} 더한 수의 ${k}배는 ${nb(sideH(right[1], true))}이다.`;
            } else {
              const kind = d.int(0, 3);
              if (kind === 0) {
                const p = 100 * d.int(3, 9), q = d.until(() => 100 * d.int(2, 9), (w) => w !== p), r = p * d.int(3, 6) + q;
                said = `한 개에 ${p}원인 초콜릿 ${x}개를 ${q}원짜리 상자에 담아 샀더니 모두 ${r}원이었다.`;
                right = [ts([p, 'x'], [q, '']), ts([r, ''])]; wrongs = [[ts([q, 'x'], [p, '']), ts([r, ''])], [ts([p, 'x'], [-q, '']), ts([r, ''])], [ts([p + q, 'x']), ts([r, ''])]];
                why = `초콜릿 ${x}개의 값은 ${nb(termH(p, 'x'))}원이고 여기에 상자의 값 ${q}원을 더한다.`;
              } else if (kind === 1) {
                const k = d.int(3, 8), r = d.int(1, 5), len = k * d.int(4, 9) + r;
                said = `길이가 ${len} m인 끈에서 길이가 ${xu('m')}인 끈 ${k}개를 잘라 내었더니 ${r} m가 남았다.`;
                right = [ts([len, ''], [-k, 'x']), ts([r, ''])]; wrongs = [[ts([k, 'x'], [-len, '']), ts([r, ''])], [ts([len, ''], [k, 'x']), ts([r, ''])], [[tg(k, ts([len, ''], [-1, 'x']))], ts([r, ''])]];
                why = `잘라 낸 끈의 길이는 ${nb(termH(k, 'x'))} m이고, 처음 길이에서 이것을 뺀 길이가 남은 길이이다.`;
              } else if (kind === 2) {
                const a = d.int(3, 9), p = 2 * (a + d.int(4, 12));
                said = `가로의 길이가 ${xu('cm')}, 세로의 길이가 ${a} cm인 직사각형의 둘레의 길이는 ${p} cm이다.`;
                right = [[tg(2, ts([1, 'x'], [a, '']))], ts([p, ''])]; wrongs = [[ts([1, 'x'], [a, '']), ts([p, ''])], [ts([2, 'x'], [a, '']), ts([p, ''])], [ts([a, 'x']), ts([p, ''])]];
                why = '직사각형의 둘레의 길이는 가로의 길이와 세로의 길이의 합의 2배이다.';
              } else {
                const t = d.int(2, 5), dist = t * d.int(12, 30);
                said = `시속 ${xu('km')}로 ${t}시간 동안 달린 거리는 ${dist} km이다.`;
                right = [ts([t, 'x']), ts([dist, ''])]; wrongs = [[ts([Q(1, t), 'x']), ts([dist, ''])], [ts([1, 'x'], [t, '']), ts([dist, ''])], [ts([dist, 'x']), ts([t, ''])]];
                why = '(거리) = (속력) × (시간)이다.';
              }
            }
            return { said, right, wrongs, why };
            };
            const { said, right, wrongs, why } = d.until(build, (r) => r.wrongs.every((w) => !follows(r.right, w, ['x'])));
            const { rows, at } = mix(d, right, wrongs);
            return C(`「${said}」를 등식으로 나타낸 것은?`, rows.map(([L, R]) => eqB(L, R)), at, {
              explain: `${why} 등식으로 나타내면 ${eqB(right[0], right[1])}이다.`,
              facts: { truth: rows.map((r) => follows(right, r, ['x'])), want: true, rule: 'eq-to-equation-' + n }
            });
          }, { count: 2 }),
          T('eq-equation-wrong', '문장을 등식으로 옮긴 것이 옳지 않은 것 찾기', '①4 심1', (d) => {
            // 줄마다 [문장, 바른 등식, 흔히 틀리게 옮긴 등식, 바로잡는 말]
            const a = d.int(2, 5), b = d.int(1, 9), e = d.int(1, 9), c = d.until(() => d.int(2, 7), (v) => v !== a);
            const p = 100 * d.int(5, 9), pay = 1000 * d.int(5, 9), left = pay - p * d.int(2, 5), k = d.int(2, 5), rest = d.int(1, k - 1), candies = k * d.int(4, 9) + rest;
            const side = d.int(3, 9), per = 2 * (side + d.int(4, 12)), t = d.int(2, 5), dist = t * d.int(12, 30), off = d.pick([10, 20, 30]), sale = 100 * d.int(12, 60);
            const makers = d.shuffle([
              [`한 자루에 ${p}원인 볼펜 ${x}자루를 사고 ${pay}원을 내었더니 거스름돈이 ${left}원이었다.`, [ts([pay, ''], [-p, 'x']), ts([left, ''])], [ts([p, 'x'], [-pay, '']), ts([left, ''])], '거스름돈은 낸 돈에서 물건의 값을 뺀 것이다.'],
              [`사탕 ${candies}개를 ${x}명에게 ${k}개씩 나누어 주었더니 ${rest}개가 남았다.`, [ts([candies, ''], [-k, 'x']), ts([rest, ''])], [ts([k, 'x'], [-rest, '']), ts([candies, ''])], '남은 사탕은 처음 사탕에서 나누어 준 사탕을 뺀 것이다.'],
              [`가로의 길이가 ${xu('cm')}, 세로의 길이가 ${side} cm인 직사각형의 둘레의 길이는 ${per} cm이다.`, [[tg(2, ts([1, 'x'], [side, '']))], ts([per, ''])], [ts([2, 'x'], [side, '']), ts([per, ''])], '직사각형의 둘레의 길이는 가로의 길이와 세로의 길이의 합의 2배이다.'],
              [`${x}의 ${a}배에 ${b}${tail(b, '을/를')} 더한 수는 ${x}의 ${c}배보다 ${e}만큼 작다.`, [ts([a, 'x'], [b, '']), ts([c, 'x'], [-e, ''])], [ts([a, 'x'], [b, '']), ts([c, 'x'], [e, ''])], `${x}의 ${c}배보다 ${e}만큼 작은 수는 ${nb(sideH(ts([c, 'x'], [-e, '']), true))}이다.`],
              [`시속 ${xu('km')}로 ${t}시간 동안 간 거리는 ${dist} km이다.`, [ts([t, 'x']), ts([dist, ''])], [ts([Q(1, t), 'x']), ts([dist, ''])], '(거리) = (속력) × (시간)이다.'],
              [`정가가 ${x}원인 물건을 ${off} % 할인한 값은 ${sale}원이다.`, [ts([dc(10 - off / 10), 'x']), ts([sale, ''])], [ts([dc(off / 10), 'x']), ts([sale, ''])], `${off} % 할인한 값은 정가의 ${100 - off} %이다.`]
            ]).slice(0, 4), wrongAt = d.int(0, 3), shown = makers.map((m, i) => (i === wrongAt ? m[2] : m[1]));
            return C('다음 중 문장을 등식으로 나타낸 것으로 옳지 않은 것은?', makers.map((m, i) => `${m[0]} ⇨ ${eqB(shown[i][0], shown[i][1])}`), wrongAt, {
              explain: `${makers[wrongAt][3]} 바르게 나타내면 ${eqB(makers[wrongAt][1][0], makers[wrongAt][1][1])}이다.`,
              facts: { truth: makers.map((m, i) => follows(m[1], shown[i], ['x'])), want: false }
            });
          }),
          T('eq-identity-pick', '항등식 가리기', '①6', (d) => {
            const m = d.int(2, 5), a = d.int(2, 4), b = d.int(1, 5), p = d.int(1, 9), k = d.int(2, 4), q = d.until(() => d.int(1, 9), (v) => v !== p);
            const ident = d.pick([
              d.bool() ? [ts([m * a, 'x'], [-m * b, '']), [tg(m, ts([a, 'x'], [-b, '']))]] : [[tg(m, ts([a, 'x'], [-b, '']))], ts([m * a, 'x'], [-m * b, ''])],
              [ts([1, 'x'], [p, '']), ts([k, 'x'], [p, ''], [-(k - 1), 'x'])],
              [ts([k + 1, 'x'], [-k, 'x']), ts([1, 'x'])]
            ]);
            const others = d.shuffle([
              [ts([m, 'x'], [-(m * b + 1), '']), [tg(m, ts([1, 'x'], [-b, '']))]], [ts([1, 'x'], [p, '']), ts([q, ''])], [ts([-1, 'x'], [p, '']), ts([1, 'x'], [q, ''])],
              [[tg(m, ts([1, 'x'], [b, '']))], ts([m, 'x'], [b, ''])], [ts([a, 'x']), ts([a, ''])]
            ]).slice(0, 3), { rows, at } = mix(d, ident, others);
            const same = ([L, R]) => { const l = gather(L, 'x'), r = gather(R, 'x'); return qcmp(l.a, r.a) === 0 && qcmp(l.b, r.b) === 0; };
            const tidied = (list) => { const g = gather(list, 'x'); return nb(sideH(sideOf(g.a, g.b, 'x'), true)); };
            return C(d.pick([`다음 중 ${x}에 대한 항등식은?`, `다음 중 ${x}의 값에 관계없이 항상 참인 등식은?`, `다음 중 모든 ${x}의 값에 대하여 항상 성립하는 등식은?`]), rows.map(([L, R]) => eqB(L, R)), at, {
              explain: `항등식은 ${x}에 어떤 수를 대입하여도 항상 참인 등식이다. 좌변과 우변을 정리하였을 때 두 변이 같은 식이면 항등식이다. 등식 ${eqB(ident[0], ident[1])}에서 좌변과 우변을 정리하면 모두 ${tidied(ident[0])}이므로 이 등식은 항등식이다.`,
              facts: { truth: rows.map(same), want: true }
            });
          }),
          T('eq-identity-const', '항등식이 되게 하는 상수 하나', '①7', (d) => {
            // 괄호를 풀어 상수항을 맞추거나(상수가 우변에), 괄호 안의 상수를 구한다.
            if (d.bool()) {
              const m = d.int(2, 5), p = d.int(1, 6), q = nz(d, -4, 4), r = d.until(() => nz(d, -9, 9), (v) => m * p + v !== 0), L = [tg(m, ts([p, ''], [q, 'x'])), tm(r, '')], R = ts([m * q, 'x'], [1, 'a']), v = m * p + r;
              return ansV(`다음 등식이 ${x}에 대한 항등식일 때, 상수 ${va}의 값은?`, Q(v), 'int', {
                figure: eqF(L, R),
                explain: `좌변의 괄호를 풀어 정리하면 ${nb(sideH(ts([m * q, 'x'], [v, '']), true))}이다. ${x}에 대한 항등식은 좌변과 우변의 ${x}의 계수가 서로 같고 상수항도 서로 같으므로 ${nb(`${va} = ${iq(v)}`)}이다.`,
                facts: { value: jsS(L, { x: '0' }), unseen: [0], rule: 'identity-const-right' }
              });
            }
            const k = d.int(2, 5), v = nz(d, -5, 5), c = d.until(() => nz(d, -9, 9), (w) => k * v + w !== 0), e = k * v + c, L = [tg(k, ts([1, 'x'], [1, 'a'])), tm(c, ''), tm(-(k - 1), 'x')], R = ts([e, ''], [1, 'x']);
            return ansV(`다음 등식이 ${x}에 대한 항등식일 때, 상수 ${va}의 값은?`, Q(v), 'int', {
              figure: eqF(L, R),
              explain: `좌변의 괄호를 풀어 정리하면 ${nb(`${x} + ${k}${va} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)}이다. ${x}에 대한 항등식은 좌변과 우변의 상수항이 서로 같으므로 ${nb(`${k}${va} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} = ${iq(e)}`)}, ${nb(`${va} = ${iq(v)}`)}이다.`,
              facts: { value: `((${e})-(${c}))/${k}`, rule: 'identity-const-inside' }
            });
          }),
          T('eq-identity-two', '항등식이 되게 하는 상수 둘', '①8 심4', (d, n) => {
            const text = `다음 등식이 ${x}에 대한 항등식일 때, 상수 ${va}, ${vb}의 값은?`;
            if (n === 0) {
              // (a + p)x − q = rx + b: x의 계수끼리, 상수항끼리 견준다.
              const p = nz(d, -6, 6), r = d.until(() => nz(d, -9, 9), (v) => v !== p && Math.abs(v) > 1), q = nz(d, -9, 9), a = r - p;
              return valsQ(text, [['a', a], ['b', q]], {
                figure: exq(`(${va} <i>${p < 0 ? MINUS : '+'}</i> ${Math.abs(p)})${x} <i>${q < 0 ? MINUS : '+'}</i> ${Math.abs(q)} <i>=</i> ${termH(r, 'x')} <i>+</i> ${vb}`),
                explain: `${x}에 대한 항등식은 좌변과 우변의 ${x}의 계수가 서로 같고 상수항도 서로 같다. ${x}의 계수에서 ${nb(`${va} ${p < 0 ? MINUS : '+'} ${Math.abs(p)} = ${iq(r)}`)}이므로 ${nb(`${va} = ${iq(a)}`)}이고, 상수항에서 ${nb(`${vb} = ${iq(q)}`)}이다.`,
                facts: { calc: [[`(${r})-(${p})`, 0], [`(${q})`, 1]], rule: 'identity-two-0' }
              });
            }
            // ax + c = m(x + sb): 괄호를 풀어 견준다.
            const m = d.until(() => nz(d, -5, 5), (v) => Math.abs(v) > 1), s = pm(d), b = nz(d, -6, 6), c = m * s * b, L = ts([1, 'ax'], [c, '']), R = [tg(m, ts([1, 'x'], [s, 'b']))];
            return valsQ(text, [['a', m], ['b', b]], {
              figure: eqF(L, R),
              explain: `우변의 괄호를 풀면 ${nb(sideH(ts([m, 'x'], [m * s, 'b']), true))}이다. ${x}의 계수에서 ${nb(`${va} = ${iq(m)}`)}이고, 상수항에서 ${nb(`${termH(m * s, 'b')} = ${iq(c)}`)}이므로 ${nb(`${vb} = ${iq(b)}`)}이다.`,
              facts: { calc: [[`(${m})`, 0], [`(${c})/(${m * s})`, 1]], rule: 'identity-two-1' }
            });
          }, { count: 2 }),
          T('eq-identity-expr', '항등식이 되게 하는 □ 안의 식', '①9', (d) => {
            const m = d.until(() => nz(d, -5, 5), (v) => Math.abs(v) > 1), q = nz(d, -6, 6), p = d.until(() => nz(d, -9, 9), (v) => Math.abs(m - v) > 1 && Math.abs(v) > 1), R = [tg(m, ts([1, 'x'], [q, '']))], a = m - p, b = m * q;
            return linAns(`다음 등식이 ${x}에 대한 항등식일 때, □ 안에 알맞은 식은?`, a, b, x, {
              figure: exq(`${termH(p, 'x')} <i>+</i> ${box()} <i>=</i> ${sideH(R)}`),
              explain: `우변의 괄호를 풀면 ${nb(sideH(ts([m, 'x'], [b, '']), true))}이다. 좌변과 우변이 같은 식이어야 하므로 □ 안의 식은 우변에서 ${termH(p, 'x')}를 뺀 ${nb(`${sideH(ts([m, 'x'], [b, '']), true)} ${p < 0 ? '+' : MINUS} ${termH(Math.abs(p), 'x')} = ${sideH(ts([a, 'x'], [b, '']), true)}`)}이다.`,
              facts: { calc: [[`(${m})-(${p})`, 0], [`(${m})*(${q})`, 1]] }
            });
          })
        ]
      },
      {
        id: 'sol', title: '방정식의 해', standard: STD3,
        types: [
          T('sol-try', 'x의 값을 차례로 넣어 해 찾기', '①10', (d) => {
            const start = d.int(-2, 1), vals = [0, 1, 2, 3].map((i) => start + i), v = d.pick(vals);
            const [a, c] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([p, q]) => p !== q), b = nz(d, -9, 9), e = (a - c) * v + b, L = ts([a, 'x'], [b, '']), R = ts([c, 'x'], [e, '']);
            return C(`${x}의 값이 ${vals.map(iq).join(', ')}일 때, 다음 방정식의 해는?`, vals.map((k) => nb(`${x} = ${iq(k)}`)), vals.indexOf(v), {
              figure: eqF(L, R),
              explain: `${x}에 수를 차례로 대입하여 좌변과 우변의 값이 같아지는 것을 찾는다. ${nb(`${x} = ${iq(v)}`)}일 때 좌변의 값은 ${iq(a * v + b)}, 우변의 값도 ${iq(c * v + e)}${tail(Math.abs(c * v + e), '으로/로')} 같으므로 해는 ${nb(`${x} = ${iq(v)}`)}이다.`,
              facts: { claimed: vals.map((k) => [diffJ(L, R, { x: js(Q(k)) }), 0]), claimedWant: true }
            });
          }),
          T('sol-which', '주어진 수를 해로 갖는 방정식 고르기', '①11', (d) => {
            const v = nz(d, -4, 4);
            // t 를 해로 갖는 방정식(모양이 서로 다르다)
            const makers = d.shuffle([
              (t) => { const a = pm(d) * d.int(2, 5), b = nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([a * t + b, ''])]; },
              (t) => { const b = nz(d, -9, 9); return [ts([1, 'x'], [b, '']), ts([t + b, ''])]; },
              (t) => { const [a, c] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([p, q]) => p !== q), b = nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([c, 'x'], [(a - c) * t + b, ''])]; },
              (t) => { const m = d.int(2, 4), b = nz(d, -5, 5); return [[tg(m, ts([1, 'x'], [b, '']))], ts([1, 'x'], [m * (t + b) - t, ''])]; },
              (t) => { const k = nz(d, -3, 3), c = d.int(4, 6); return [ts([c + k, 'x'], [-k * t, '']), ts([c, 'x'])]; }
            ]).slice(0, 4);
            const others = d.shuffle([-v, v + 1, v - 1, v + 2, v - 2].filter((t) => t !== v)).slice(0, 3), right = makers[0](v), { rows, at } = mix(d, right, others.map((t, i) => makers[i + 1](t)));
            const lv = evS(right[0], { x: Q(v) });
            return C(`다음 방정식 가운데 해가 ${nb(`${x} = ${iq(v)}`)}인 것은?`, rows.map(([L, R]) => eqB(L, R)), at, {
              explain: `${nb(`${x} = ${iq(v)}`)}${tail(Math.abs(v), '을/를')} 대입하였을 때 좌변과 우변의 값이 같은 방정식을 찾는다. ${eqB(right[0], right[1])}에서 좌변의 값은 ${tx(lv)}, 우변의 값도 ${tx(lv)}${tail(lastOf(lv), '으로/로')} 같다. 나머지 방정식은 좌변과 우변의 값이 다르다.`,
              facts: { claimed: rows.map(([L, R]) => [diffJ(L, R, { x: js(Q(v)) }), 0]), claimedWant: true }
            });
          }),
          T('sol-bracket', '[ ] 안의 수가 방정식의 해인지 확인하기', '①12 심2', (d, n) => {
            // 첫째는 정수를 넣어 해인 것 하나를, 둘째는 분수까지 넣어 해가 아닌 것 하나를 찾는다.
            const fits = (t) => d.pick([
              () => { const a = pm(d) * d.int(2, 5), b = nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([a * t + b, ''])]; },
              () => { const [a, c] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([p, q]) => p !== q), b = nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([c, 'x'], [(a - c) * t + b, ''])]; },
              () => { const m = pm(d) * d.int(2, 4), b = nz(d, -5, 5), c = d.until(() => d.int(2, 5), (w) => w !== m); return [[tg(m, ts([1, 'x'], [b, '']))], ts([c, 'x'], [m * (t + b) - c * t, ''])]; }
            ])();
            // 분수 t(분모 2나 4)를 해로 갖는 방정식
            const fracFit = () => { const q = d.pick([2, 4]), t = Q(pm(d) * d.pick([1, 3, 5]), q), c = d.int(1, 4), a = c + q * d.int(1, 2), b = nz(d, -6, 6), e = qadd(qmul(Q(a - c), t), Q(b)); return { eq: [ts([a, 'x'], [b, '']), ts([c, 'x'], [e, ''])], k: t }; };
            const wantTrue = n === 0, sols = d.shuffle([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6]).slice(0, 4), oddAt = d.int(0, 3);
            const rows = sols.map((t, i) => {
              if (!wantTrue && i === (oddAt + 1) % 4) return fracFit();
              const isOdd = i === oddAt, k = wantTrue === isOdd ? t : d.pick([-t, t + 1, t - 1].filter((w) => w !== t && w !== 0));
              return { eq: fits(t), k: Q(k) };
            });
            const holds = rows.map((r) => evS(r.eq[0], { x: r.k }).p * evS(r.eq[1], { x: r.k }).q === evS(r.eq[1], { x: r.k }).p * evS(r.eq[0], { x: r.k }).q), at = holds.indexOf(wantTrue), odd = rows[at];
            const lv = evS(odd.eq[0], { x: odd.k }), rv = evS(odd.eq[1], { x: odd.k });
            return C(`다음 중 [ ] 안의 수가 주어진 방정식의 ${wantTrue ? '해인' : '해가 아닌'} 것은?`, rows.map((r) => `${eqB(r.eq[0], r.eq[1])} &nbsp;[${tx(r.k)}]`), at, {
              explain: `[ ] 안의 수를 ${x}에 대입하여 좌변과 우변의 값이 같으면 해이다. ${eqB(odd.eq[0], odd.eq[1])}에 ${nb(`${x} = ${tx(odd.k)}`)}${tail(lastOf(odd.k), '을/를')} 대입하면 좌변의 값은 ${tx(lv)}, 우변의 값은 ${tx(rv)}${tail(lastOf(rv), '으로/로')} ${wantTrue ? '같다' : '다르다'}.`,
              facts: { claimed: rows.map((r) => [diffJ(r.eq[0], r.eq[1], { x: js(r.k) }), 0]), claimedWant: wantTrue, rule: 'bracket-' + n }
            });
          }, { count: 2 })
        ]
      },
      {
        id: 'prop', title: '등식의 성질', standard: STD3,
        types: [
          T('prop-same', 'a = b일 때 옳지 않은 등식 찾기', '①13', (d) => {
            const [p, q] = d.pick([['a', 'b'], ['x', 'y']]), k = d.int(2, 9), m = d.until(() => d.int(2, 9), (v) => v !== k), base = [ts([1, p]), ts([1, q])];
            const yes = d.shuffle([
              [ts([1, p], [k, '']), ts([1, q], [k, ''])], [ts([1, p], [-k, '']), ts([1, q], [-k, ''])], [ts([-k, p]), ts([-k, q])],
              [ts([Q(1, k), p]), ts([Q(1, k), q])], [ts([k, ''], [-1, p]), ts([k, ''], [-1, q])], [ts([k, p], [m, '']), ts([k, q], [m, ''])]
            ]).slice(0, 3);
            const no = d.pick([
              [[ts([1, p], [-k, '']), ts([k, ''], [-1, q])], `양변에서 같은 수 ${k}${tail(k, '을/를')} 빼면 ${eqB(ts([1, p], [-k, '']), ts([1, q], [-k, '']))}이다.`],
              [[ts([Q(1, k), p]), ts([Q(1, m), q])], `양변을 같은 수 ${k}${tail(k, '으로/로')} 나누면 ${eqB(ts([Q(1, k), p]), ts([Q(1, k), q]))}이다. 양변을 서로 다른 수로 나누면 등식이 성립하지 않는다.`],
              [[ts([1, p], [k, '']), ts([1, q], [-k, ''])], `양변에 같은 수 ${k}${tail(k, '을/를')} 더하면 ${eqB(ts([1, p], [k, '']), ts([1, q], [k, '']))}이다.`],
              [[ts([k, p]), ts([m, q])], `양변에 같은 수 ${k}${tail(k, '을/를')} 곱하면 ${eqB(ts([k, p]), ts([k, q]))}이다. 양변에 서로 다른 수를 곱하면 등식이 성립하지 않는다.`]
            ]), { rows, at } = mix(d, no[0], yes);
            return C(`${nb(`${V(p)} = ${V(q)}`)}일 때, 다음 중 옳지 않은 것은?`, rows.map(([L, R]) => eqB(L, R)), at, {
              explain: `등식의 양변에 같은 수를 더하거나, 양변에서 같은 수를 빼거나, 양변에 같은 수를 곱하거나, 양변을 0이 아닌 같은 수로 나누어도 등식은 성립한다. ${no[1]}`,
              facts: { truth: rows.map((r) => follows(base, r, [p, q])), want: false }
            });
          }),
          T('prop-ifthen', '「…이면 …이다」 꼴 문장의 참·거짓', '①14 심7', (d) => {
            const g = d.int(2, 3), m = d.int(2, 5), n2 = d.until(() => d.int(2, 7), (v) => v !== m && gcd(v, m) === 1), k = d.int(2, 5), c = d.int(1, 9), ab = ['a', 'b'], xy = ['x', 'y'];
            // key 가 같은 문장은 한 문항에 함께 싣지 않는다(같은 앞 등식에서 맞서는 두 결론이 나오면 답이 드러난다).
            const yes = [
              { key: 'div', P: [ts([g * m, 'a']), ts([g * n2, 'b'])], E: [ts([m, 'a']), ts([n2, 'b'])], n: ab },
              { key: 'cross', P: [ts([Q(1, m), 'a']), ts([Q(1, n2), 'b'])], E: [ts([n2, 'a']), ts([m, 'b'])], n: ab },
              { key: 'cut', P: [ts([k, 'a'], [-c, '']), ts([k, 'b'], [-c, ''])], E: [ts([1, 'a']), ts([1, 'b'])], n: ab },
              { key: 'add', P: [ts([1, 'a']), ts([k, 'b'])], E: [ts([1, 'a'], [c, '']), ts([k, 'b'], [c, ''])], n: ab },
              { key: 'neg', P: [ts([Q(-1, k * g), 'a']), ts([Q(1, k), 'b'])], E: [ts([1, 'a']), ts([-g, 'b'])], n: ab },
              { key: 'share', P: [ts([1, 'x']), ts([k, 'y'])], E: [ts([Q(1, k), 'x'], [c, '']), ts([1, 'y'], [c, ''])], n: xy }
            ];
            const no = d.pick([
              { key: 'cross', P: [ts([Q(1, m), 'a']), ts([Q(1, n2), 'b'])], E: [ts([m, 'a']), ts([n2, 'b'])], n: ab, fix: `양변에 ${m * n2}${tail(m * n2, '을/를')} 곱하면 ${eqB(ts([n2, 'a']), ts([m, 'b']))}이다.` },
              { key: 'add', P: [ts([1, 'a']), ts([k, 'b'])], E: [ts([1, 'a'], [c, '']), [tg(k, ts([1, 'b'], [c, '']))]], n: ab, fix: `양변에 ${c}${tail(c, '을/를')} 더하면 ${eqB(ts([1, 'a'], [c, '']), ts([k, 'b'], [c, '']))}이다.` },
              { key: 'cut', P: [ts([k, 'x'], [c, '']), ts([1, 'y'], [c, ''])], E: [ts([1, 'x']), ts([1, 'y'])], n: xy, fix: `양변에서 ${c}${tail(c, '을/를')} 빼면 ${eqB(ts([k, 'x']), ts([1, 'y']))}이다.` },
              { key: 'add', P: [ts([1, 'a']), ts([k, 'b'])], E: [ts([2, 'a'], [c, '']), ts([2 * k, 'b'], [-c, ''])], n: ab, fix: `양변에 2를 곱하고 ${c}${tail(c, '을/를')} 더하면 ${eqB(ts([2, 'a'], [c, '']), ts([2 * k, 'b'], [c, '']))}이다.` },
              { key: 'neg', P: [ts([1, 'a']), ts([-1, 'b'])], E: [ts([1, 'a'], [-c, '']), [tg(-1, ts([1, 'b'], [-c, '']))]], n: ab, fix: `양변에서 ${c}${tail(c, '을/를')} 빼면 ${eqB(ts([1, 'a'], [-c, '']), ts([-1, 'b'], [-c, '']))}, 곧 ${eqB(ts([1, 'a'], [-c, '']), [tg(-1, ts([1, 'b'], [c, '']))])}이다.` }
            ]);
            const { rows, at } = mix(d, no, d.shuffle(yes.filter((s) => s.key !== no.key)).slice(0, 3));
            return C('다음 중 옳지 않은 것은?', rows.map((s) => `${eqB(s.P[0], s.P[1])}이면 ${eqB(s.E[0], s.E[1])}이다.`), at, {
              explain: `등식의 양변에 같은 수를 더하거나 빼거나 곱하거나, 양변을 0이 아닌 같은 수로 나누어 얻은 등식만 옳다. ${eqB(no.P[0], no.P[1])}의 ${no.fix}`,
              facts: { truth: rows.map((s) => follows(s.P, s.E, s.n)), want: false }
            });
          }),
          T('prop-derive', '한 등식에서 얻을 수 있는 등식 고르기', '①15 심5', (d, n) => {
            if (n === 0) {
              // a = kb 에서 얻은 등식 가운데 옳은 것 하나
              const k = pm(d) * d.int(2, 3), c = d.int(1, 9), m = d.int(3, 5), P = [ts([1, 'a']), ts([k, 'b'])];
              const yes = d.pick([[ts([2, 'a']), ts([2 * k, 'b'])], [ts([-1, 'a'], [c, '']), ts([-k, 'b'], [c, ''])], [ts([1, 'a'], [1, 'b']), ts([k + 1, 'b'])], [ts([Q(1, Math.abs(k)), 'a'], [c, '']), ts([k < 0 ? -1 : 1, 'b'], [c, ''])]]);
              const no = d.shuffle([[ts([Q(1, m), 'a']), ts([Q(k < 0 ? -1 : 1, m), 'b'])], [ts([2, 'a'], [-c, '']), ts([2 * k, 'b'], [c, ''])], [ts([-m, 'a'], [-c, '']), ts([k < 0 ? m : -m, 'b'], [-c, ''])], [ts([1, 'a'], [c, '']), [tg(k, ts([1, 'b'], [c, '']))]]]).slice(0, 3);
              const { rows, at } = mix(d, yes, no);
              return C(`${eqB(P[0], P[1])}일 때, 다음 중 옳은 것은?`, rows.map(([L, R]) => eqB(L, R)), at, {
                explain: `등식의 양변에 같은 수를 더하거나 빼거나 곱하거나, 양변을 0이 아닌 같은 수로 나눈 것만 옳다. 옳은 것은 ${eqB(yes[0], yes[1])}이다. 이것은 ${eqB(P[0], P[1])}의 양변에 같은 계산을 하여 얻은 등식이다. 나머지는 양변에 서로 다른 계산을 하였다.`,
                facts: { truth: rows.map((r) => follows(P, r, ['a', 'b'])), want: true, rule: 'derive-0' }
              });
            }
            // px − q = ry + s 에서 얻은 등식 가운데 옳지 않은 것 하나
            const [p, r] = d.pick([[2, 3], [3, 2], [2, 5], [4, 3], [3, 4]]), j = d.int(1, 2), total = p * r * j, t = d.until(() => d.int(1, 5), (v) => total - p * v > 0 && total - p * v !== r), q = p * t, s = total - q;
            const P = [ts([p, 'x'], [-q, '']), ts([r, 'y'], [s, ''])];
            const yes = d.shuffle([[ts([p, 'x']), ts([r, 'y'], [total, ''])], [ts([p, 'x'], [-r, 'y']), ts([total, ''])], [ts([Q(1, r), 'x'], [Q(-1, p), 'y']), ts([j, ''])], [[tg(p, ts([1, 'x'], [-t, '']))], ts([r, 'y'], [s, ''])]]).slice(0, 3);
            const no = d.pick([
              [[[tg(p, ts([1, 'x'], [-t, '']))], [tg(r, ts([1, 'y'], [1, '']))]], `좌변 ${nb(sideH(P[0], true))}${tail(q, '은/는')} ${nb(sideH([tg(p, ts([1, 'x'], [-t, '']))], true))}${tail(t, '과/와')} 같지만, 우변 ${nb(sideH(P[1], true))}${tail(s, '은/는')} ${nb(sideH([tg(r, ts([1, 'y'], [1, '']))], true))}과 같지 않다.`],
              [[ts([p, 'x']), ts([r, 'y'], [s - q, ''])], `양변에 ${q}${tail(q, '을/를')} 더하면 ${eqB(ts([p, 'x']), ts([r, 'y'], [total, '']))}이다.`],
              [[ts([Q(1, r), 'x'], [Q(-1, p), 'y']), ts([total, ''])], `${eqB(ts([p, 'x'], [-r, 'y']), ts([total, '']))}의 양변을 ${p * r}${tail(p * r, '으로/로')} 나누면 우변은 ${j}이다.`]
            ]), { rows, at } = mix(d, no[0], yes);
            return C(`${eqB(P[0], P[1])}일 때, 다음 중 옳지 않은 것은?`, rows.map(([L, R]) => eqB(L, R)), at, {
              explain: `등식의 양변에 같은 수를 더하거나 빼거나 곱하거나, 양변을 0이 아닌 같은 수로 나눈 것만 옳다. ${no[1]}`,
              facts: { truth: rows.map((row) => follows(P, row, ['x', 'y'])), want: false, rule: 'derive-1' }
            });
          }, { count: 2 }),
          T('prop-box', '등식을 변형하여 □ 안의 수 구하기', '①16', (d) => {
            const k = d.int(2, 6), q = d.int(1, 5), [p, r] = d.until(() => [d.int(1, 9), nz(d, -9, 9)], ([u, w]) => (u + w) % k === 0), s = d.until(() => d.int(1, 6), (v) => v - q + (r + p) / k !== 0), v = s - q + (r + p) / k;
            const L = ts([k, 'a'], [-p, '']), R = [tg(k, ts([1, 'b'], [-q, ''])), tm(r, '')], mid = (r + p) / k - q;
            return ansV(`${eqB(L, R)}일 때, ${nb(`${va} + ${s} = ${vb} + □`)}이다. □ 안에 알맞은 수는?`, Q(v), 'int', {
              explain: `우변의 괄호를 풀어 정리하면 ${eqB(L, ts([k, 'b'], [r - k * q, '']))}이다. 양변에 ${p}${tail(p, '을/를')} 더하면 ${eqB(ts([k, 'a']), ts([k, 'b'], [r - k * q + p, '']))}, 양변을 ${k}${tail(k, '으로/로')} 나누면 ${eqB(ts([1, 'a']), ts([1, 'b'], [mid, '']))}이다. 양변에 ${s}${tail(s, '을/를')} 더하면 ${eqB(ts([1, 'a'], [s, '']), ts([1, 'b'], [v, '']))}이다.`,
              facts: { value: `${s}-${q}+((${r})+${p})/${k}` }
            });
          }),
          T('prop-fill', '등식의 성질을 이용할 때 양변에 더하거나 나눈 수', '①17·19', (d, n) => {
            const a = d.int(2, 9), v = nz(d, -9, 9), plus = d.bool(), b = d.int(1, 9), c = a * v + (plus ? b : -b), L = ts([a, 'x'], [plus ? b : -b, '']), R = ts([c, '']);
            if (n === 0) {
              // 한 번 고친 식에서 더한(뺀) 수와 그 결과
              return M(`방정식 ${eqB(L, R)}의 ${plus ? '양변에서 ㉠을 빼면' : '양변에 ㉠을 더하면'} ${nb(`${termH(a, 'x')} = ㉡`)}이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LAB[0], answer: b, signed: true }, { label: LAB[1], answer: a * v, signed: true }], {
                explain: `좌변에 ${termH(a, 'x')}만 남기려면 ${plus ? `양변에서 ${b}${tail(b, '을/를')} 뺀다` : `양변에 ${b}${tail(b, '을/를')} 더한다`}. ${nb(`${iq(c)} ${plus ? MINUS : '+'} ${b} = ${iq(a * v)}`)}이므로 ${eqB(ts([a, 'x']), ts([a * v, '']))}이다.`,
                facts: { calc: [[String(b), 0], [`(${c})${plus ? '-' : '+'}${b}`, 1]], rule: 'fill-0' }
              });
            }
            // 두 번 고쳐 푼 과정에서 성질의 m, n
            const vm = V('m'), vn = V('n'), first = `${va} = ${vb}이면 ${nb(plus ? `${va} − ${vm} = ${vb} − ${vm}` : `${va} + ${vm} = ${vb} + ${vm}`)}`, second = `${va} = ${vb}이면 ${nb(`${frac(va, vn)} = ${frac(vb, vn)}`)}`;
            return valsQ(`다음은 등식의 성질 ㈎, ㈏를 차례로 이용하여 방정식 ${eqB(L, R)}${tail(Math.abs(c), '을/를')} 푸는 과정이다. ${vm}, ${vn}의 값은? (단, ${vm}, ${vn}은 자연수이다.)`, [['m', b], ['n', a]], {
              figure: eqProc([{ h: eqH(L, R) }, { note: '㈎ ' + first }, { h: eqH(ts([a, 'x']), ts([a * v, ''])) }, { note: '㈏ ' + second }, { h: `${x} <i>=</i> ${iq(v)}` }]),
              explain: `㈎에서는 ${plus ? `양변에서 ${b}${tail(b, '을/를')} 빼었으므로` : `양변에 ${b}${tail(b, '을/를')} 더하였으므로`} ${nb(`${vm} = ${b}`)}이고, ㈏에서는 양변을 ${a}${tail(a, '으로/로')} 나누었으므로 ${nb(`${vn} = ${a}`)}이다.`,
              facts: { calc: [[String(b), 0], [String(a), 1]], rule: 'fill-1' }
            });
          }, { count: 2 }),
          T('prop-steps', '등식의 성질로 방정식을 푸는 과정의 빈칸', '심10 ①39', (d) => {
            // (px + q)/n = r → px + q = nr → px = nr − q → x
            const [n, p, v, q] = d.until(() => [d.int(2, 5), pm(d) * d.int(2, 5), nz(d, -8, 8), nz(d, -9, 9)], ([k, a, w, b]) => (a * w + b) % k === 0 && a * w + b !== 0 && Math.abs(b) !== k);
            const fitR = (p * v + q) / n, L = [tf(ts([p, 'x'], [q, '']), n, 1)], R = ts([fitR, '']), add = q < 0;
            return M('다음은 등식의 성질을 이용하여 방정식을 푸는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', [n, Math.abs(q), p, v].map((w, i) => ({ label: LAB[i], answer: w, signed: true })), {
              figure: eqProc([{ h: eqH(L, R) }, { note: '양변에 ㉠을 곱한다.' }, { h: eqH(ts([p, 'x'], [q, '']), ts([n * fitR, ''])) }, { note: add ? '양변에 ㉡을 더한다.' : '양변에서 ㉡을 뺀다.' }, { h: eqH(ts([p, 'x']), ts([p * v, ''])) }, { note: '양변을 ㉢으로 나눈다.' }, { h: `${x} <i>=</i> ${box(LAB[3])}` }]),
              explain: `분모 ${n}${tail(n, '을/를')} 없애려고 양변에 ${n}${tail(n, '을/를')} 곱하고, 상수항 ${iq(q)}${tail(Math.abs(q), '을/를')} 없애려고 ${add ? `양변에 ${-q}${tail(-q, '을/를')} 더한다` : `양변에서 ${q}${tail(q, '을/를')} 뺀다`}. ${eqB(ts([p, 'x']), ts([p * v, '']))}의 양변을 ${x}의 계수 ${iq(p)}${tail(Math.abs(p), '으로/로')} 나누면 ${nb(`${x} = ${iq(v)}`)}이다.`,
              facts: { calc: [[String(n), 0], [String(Math.abs(q)), 1], [`(${p})`, 2], [`(${n}*(${fitR})-(${q}))/(${p})`, 3]] }
            });
          }),
          T('prop-used', '풀이의 단계마다 이용한 등식의 성질', '①18 심9', (d) => {
            // ㈎는 더하기(ㄱ)나 빼기(ㄴ), ㈏는 곱하기(ㄷ)나 나누기(ㄹ)
            const plus = d.bool(), byDiv = d.bool(), a = d.int(2, 6), b = d.int(1, 9), v = byDiv ? nz(d, -9, 9) : a * nz(d, -4, 4), coef = byDiv ? Q(a) : Q(1, a), mid = byDiv ? a * v : v / a;
            const L = [tm(coef, 'x'), tm(plus ? b : -b, '')], R = ts([mid + (plus ? b : -b), '']), right = `㈎ ${plus ? 'ㄴ' : 'ㄱ'}, ㈏ ${byDiv ? 'ㄹ' : 'ㄷ'}`;
            const options = ['㈎ ㄱ, ㈏ ㄷ', '㈎ ㄱ, ㈏ ㄹ', '㈎ ㄴ, ㈏ ㄷ', '㈎ ㄴ, ㈏ ㄹ'];
            const props = tagEq([`${va} <i>+</i> ${vc} <i>=</i> ${vb} <i>+</i> ${vc}`, `${va} <i>${MINUS}</i> ${vc} <i>=</i> ${vb} <i>${MINUS}</i> ${vc}`, `${va}${vc} <i>=</i> ${vb}${vc}`, `${frac(va, vc)} <i>=</i> ${frac(vb, vc)}`], HAN);
            return C(`다음은 등식의 성질을 이용하여 방정식을 푸는 과정이다. ㈎, ㈏에서 이용한 등식의 성질을 ㄱ~ㄹ에서 골라 차례로 쓴 것은? (단, ${nb(`${va} = ${vb}`)}이고 ${vc}는 자연수이다.)`, options, options.indexOf(right), {
              figure: eqProc([{ h: eqH(L, R) }, { note: '㈎' }, { h: eqH([tm(coef, 'x')], ts([mid, ''])) }, { note: '㈏' }, { h: `${x} <i>=</i> ${iq(v)}` }]) + `<div style="border:1px solid #c5ced8;border-radius:8px;padding:8px 14px">${props}</div>`,
              explain: `㈎에서는 ${plus ? `양변에서 ${b}${tail(b, '을/를')} 빼었으므로 ㄴ` : `양변에 ${b}${tail(b, '을/를')} 더하였으므로 ㄱ`}, ㈏에서는 ${byDiv ? `양변을 ${a}${tail(a, '으로/로')} 나누었으므로 ㄹ` : `양변에 ${a}${tail(a, '을/를')} 곱하였으므로 ㄷ`}을 이용하였다.`,
              facts: { truth: options.map((o) => o === right), want: true }
            });
          }),
          T('prop-not-used', '어떤 성질을 이용하지 않고 푼 방정식 고르기', '①20', (d) => {
            // 양변을 같은 수로 나누는 성질 없이 풀리는 것은 x의 계수가 1인 방정식 하나뿐이다.
            const sols = d.shuffle([-5, -4, -3, -2, 2, 3, 4, 5, 6]).slice(0, 4), b0 = nz(d, -9, 9), plain = [ts([1, 'x'], [b0, '']), ts([sols[0] + b0, ''])];
            const withDiv = sols.slice(1).map((v, i) => { const a = d.int(2, 6), b = i === 0 ? 0 : nz(d, -9, 9); return [ts([a, 'x'], [b, '']), ts([a * v + b, ''])]; });
            const { rows, at } = mix(d, plain, withDiv), solved = (eq) => solQ(eq[0], eq[1]);
            return C(`다음은 방정식을 풀어 해를 구한 것이다. 등식의 성질 「${nb(`${va} = ${vb}`)}이면 ${nb(`${frac(va, vc)} = ${frac(vb, vc)}`)}이다(단, ${nb(`${vc} ≠ 0`)}).」를 이용하지 않고 푼 것은?`, rows.map((eq) => `${eqB(eq[0], eq[1])} ⇨ ${nb(`${x} = ${tx(solved(eq))}`)}`), at, {
              explain: `${eqB(plain[0], plain[1])}은 ${b0 > 0 ? `양변에서 ${b0}${tail(b0, '을/를')} 빼면` : `양변에 ${-b0}${tail(-b0, '을/를')} 더하면`} 바로 풀린다. 나머지 방정식은 ${x}의 계수가 1이 아니므로 마지막에 양변을 ${x}의 계수로 나누어야 한다.`,
              facts: { truth: rows.map((eq) => gather(eq[0], 'x').a.p === 1), want: true }
            });
          }),
          T('prop-odd', '등식의 성질로 구한 □ 안의 수가 나머지와 다른 것', '심8', (d) => {
            // 셋은 □가 t 이고, 하나는 부호를 놓치면 t 로 보이는 −t 이다.
            const t = d.pick([6, 8, 10, 12]), k = d.int(1, t - 1), m = d.pick([2, 3, 4, 5, 6].filter((w) => t % w === 0)), q = d.pick([2, 3]), p = d.pick([5, 7]), k2 = d.int(1, 5);
            const makers = d.shuffle([
              { P: `${termH(2, 'a')} = ${t - k}`, E: `${termH(2, 'a')} + ${k} = □`, j: `${t - k}+${k}`, why: `양변에 ${k}${tail(k, '을/를')} 더하면 □는 ${t}` },
              { P: `${termH(Q(1, m), 'a')} = ${t / m}`, E: `${va} = □`, j: `${t / m}*${m}`, why: `양변에 ${m}${tail(m, '을/를')} 곱하면 □는 ${t}` },
              { P: `${termH(p, 'a')} = ${t * p / q}`, E: `${termH(q, 'a')} = □`, j: `${t * p / q}/${p}*${q}`, why: `양변을 ${p}${tail(p, '으로/로')} 나누고 ${q}${tail(q, '을/를')} 곱하면 □는 ${t}`, ok: (t * p) % q === 0 },
              { P: `${termH(-3, 'a')} = ${t + k2}`, E: `${termH(-3, 'a')} − ${k2} = □`, j: `${t + k2}-${k2}`, why: `양변에서 ${k2}${tail(k2, '을/를')} 빼면 □는 ${t}` }
            ].filter((s) => s.ok !== false)).slice(0, 3);
            const m2 = d.pick([2, 3, 4, 5, 6].filter((w) => t % w === 0)), odd = { P: `${termH(Q(-1, m2), 'a')} = ${t / m2}`, E: `${va} = □`, j: `${t / m2}*(-${m2})`, why: `양변에 ${iq(-m2)}${tail(m2, '을/를')} 곱하면 □는 ${iq(-t)}` };
            const { rows, at } = mix(d, odd, makers);
            return C('등식의 성질을 이용하여 □ 안에 알맞은 수를 구할 때, 그 수가 나머지 셋과 다른 것은?', rows.map((s) => `${nb(s.P)}이면 ${nb(s.E)}이다.`), at, {
              explain: `□ 안의 수는 보기의 차례대로 ${rows.map((s) => iq(s === odd ? -t : t)).join(', ')}이다. ${nb(odd.P)}에서는 ${va}의 계수가 음수이므로 양변에 ${iq(-m2)}${tail(m2, '을/를')} 곱해야 하고, □ 안의 수는 ${iq(-t)}이다.`,
              facts: { claimed: rows.map((s) => [s.j, t]), claimedWant: false }
            });
          })
        ]
      },
      {
        id: 'move', title: '이항과 일차방정식의 뜻', standard: STD4,
        types: [
          T('move-term', '주어진 항을 이항한 식 고르기', '①23·24', (d) => {
            const [a, c] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([p, q]) => p !== q && p !== -q), [b, e] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([p, q]) => p !== q && p !== -q);
            const E = [ts([a, 'x'], [b, '']), ts([c, 'x'], [e, ''])], right = [ts([a, 'x'], [-c, 'x']), ts([e, ''], [-b, ''])];
            const wrongs = [[ts([a, 'x'], [c, 'x']), ts([e, ''], [-b, ''])], [ts([a, 'x'], [-c, 'x']), ts([e, ''], [b, ''])], [ts([a, 'x'], [c, 'x']), ts([e, ''], [b, ''])]], { rows, at } = mix(d, right, wrongs);
            return C(`방정식 ${eqB(E[0], E[1])}에서 좌변의 ${tj(Q(b), '과/와')} 우변의 ${termH(c, 'x')}를 각각 이항한 것은?`, rows.map(([L, R]) => eqB(L, R)), at, {
              explain: `이항은 등식의 한 변에 있는 항을 부호를 바꾸어 다른 변으로 옮기는 것이다. 좌변의 ${iq(b)}${tail(Math.abs(b), '은/는')} 우변에서 ${iq(-b)}${tail(Math.abs(b), '이/가')} 되고, 우변의 ${termH(c, 'x')}는 좌변에서 ${termH(-c, 'x')}가 되므로 ${eqB(right[0], right[1])}이다.`,
              facts: { truth: rows.map((r) => sameEq(E, r, ['x'])), want: true }
            });
          }),
          T('move-wrong', '이항이 옳지 않은 것 찾기', '심11', (d) => {
            const u = () => d.int(2, 9), a = u(), b = u(), c = d.until(u, (v) => v !== a), e = d.until(u, (v) => v !== b);
            // [처음 등식, 바르게 이항한 식, 부호를 바꾸지 않고 옮긴 식]
            const makers = d.shuffle([
              [[ts([a, 'x'], [-b, '']), ts([c, ''])], [ts([a, 'x']), ts([c, ''], [b, ''])], [ts([a, 'x']), ts([c, ''], [-b, ''])]],
              [[ts([b, ''], [-a, 'x']), ts([-c, ''])], [ts([-a, 'x']), ts([-c, ''], [-b, ''])], [ts([-a, 'x']), ts([-c, ''], [b, ''])]],
              [[ts([a, 'x'], [-b, '']), ts([c, 'x'])], [ts([a, 'x'], [-c, 'x']), ts([b, ''])], [ts([a, 'x'], [c, 'x']), ts([b, ''])]],
              [[ts([-a, 'x'], [-b, '']), ts([c, 'x'], [-e, ''])], [ts([-a, 'x'], [-c, 'x']), ts([-e, ''], [b, ''])], [ts([-a, 'x'], [-c, 'x']), ts([-e, ''], [-b, ''])]],
              [[ts([-a, 'x'], [b, '']), ts([-c, 'x'], [-e, ''])], [ts([-a, 'x'], [c, 'x']), ts([-e, ''], [-b, ''])], [ts([-a, 'x'], [-c, 'x']), ts([-e, ''], [-b, ''])]]
            ]).slice(0, 4), wrongAt = d.int(0, 3), shown = makers.map((m, i) => (i === wrongAt ? m[2] : m[1]));
            return C('다음 중 이항을 바르게 하지 않은 것은?', makers.map((m, i) => `${eqB(m[0][0], m[0][1])} ⇨ ${eqB(shown[i][0], shown[i][1])}`), wrongAt, {
              explain: `이항하는 항은 부호가 바뀐다. ${eqB(makers[wrongAt][0][0], makers[wrongAt][0][1])}에서 바르게 이항하면 ${eqB(makers[wrongAt][1][0], makers[wrongAt][1][1])}이다.`,
              facts: { truth: makers.map((m, i) => sameEq(m[0], shown[i], ['x'])), want: false }
            });
          }),
          T('move-axb', '이항만 이용하여 ax = b 꼴로 나타내기', '①25 심12', (d) => {
            // x의 계수가 양수가 되도록 옮긴다. 양변을 나누지 않는다.
            const [a, c] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([p, q]) => Math.abs(p - q) > 1), [b, e] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([p, q]) => p !== q && (q - p) % (a - c) !== 0);
            const L = ts([a, 'x'], [b, '']), R = ts([c, 'x'], [e, '']), pos = a - c > 0, ca = pos ? a - c : c - a, cb = pos ? e - b : b - e;
            return valsQ(`방정식 ${eqB(L, R)}${tail(Math.abs(e), '을/를')} 이항만 이용하여 ${nb(`${va}${x} = ${vb}`)} (${nb(`${va} ${GT} 0`)}) 꼴로 나타낼 때, 상수 ${va}, ${vb}의 값은?`, [['a', ca], ['b', cb]], {
              explain: pos ? `${x}를 포함한 항은 좌변으로, 상수항은 우변으로 이항하면 ${eqB(ts([a, 'x'], [-c, 'x']), ts([e, ''], [-b, '']))}, 곧 ${eqB(ts([ca, 'x']), ts([cb, '']))}이다. 이항만 이용하므로 양변을 나누지 않는다.`
                : `${x}를 포함한 항을 좌변으로 이항하면 ${x}의 계수가 음수가 된다. ${x}를 포함한 항은 우변으로, 상수항은 좌변으로 이항하면 ${eqB(ts([b, ''], [-e, '']), ts([c, 'x'], [-a, 'x']))}, 곧 ${eqB(ts([cb, '']), ts([ca, 'x']))}이므로 ${eqB(ts([ca, 'x']), ts([cb, '']))}이다. 이항만 이용하므로 양변을 나누지 않는다.`,
              facts: { calc: pos ? [[`(${a})-(${c})`, 0], [`(${e})-(${b})`, 1]] : [[`(${c})-(${a})`, 0], [`(${b})-(${e})`, 1]], unseen: [1] }
            });
          }),
          T('move-linear-pick', '일차방정식 가리기', '①26 심13', (d, n) => {
            const a = d.int(2, 6), b = d.until(() => d.int(2, 9), (v) => v !== a), c = d.int(1, 9), op = (s, bare) => (bare ? ` ${s} ` : ` <i>${s}</i> `);
            const E = (L, R, why) => ({ eq: [L, R], h: (bare) => eqH(L, R, bare), why });
            // 일차방정식인 것(정리하면 x²의 항이 사라지는 것도 있다)
            const yes = d.shuffle([
              E(ts([a, 'x'], [-b, 'x'], [c, '']), ts([0, ''])), E(ts([1, 'X'], [a, 'x']), ts([c, ''], [-1, 'x'], [1, 'X'])), E(ts([a + 1, 'x'], [-b, '']), ts([1, 'x'], [c, ''])),
              E([tg(2, ts([1, 'x'], [-c, '']))], ts([1, 'x'])), E(ts([Q(1, a), 'x']), ts([c, '']))
            ]);
            // 일차방정식이 아닌 것
            const no = d.shuffle([
              E(ts([a, 'x'], [-b, '']), ts([-b, ''], [a, 'x']), '정리하면 0 = 0이 되는 항등식'), E(ts([-b, ''], [a, 'X']), ts([c, ''], [a + 1, 'X']), `정리하여도 ${x}${sup(2)}의 항이 남는 식`),
              E(ts([1, 'X'], [2, 'x'], [1, '']), ts([0, '']), `${x}${sup(2)}의 항이 있는 식`), { eq: null, h: (bare) => sideH(ts([a, 'x'], [c, '']), bare), why: '등호가 없어 등식이 아닌 식' },
              E(ts([a, 'x'], [1, '']), ts([a, 'x'], [-b, '']), `정리하면 ${x}의 항이 사라지는 식`), { eq: null, h: (bare) => sideH(ts([2, 'x'], [-1, '']), bare) + op(GT, bare) + b, why: '부등호를 사용한 식' },
              E([tg(a, ts([1, 'x'], [-1, '']))], ts([a, 'x'], [-a, '']), '정리하면 0 = 0이 되는 항등식')
            ]);
            const linear = (row) => { if (!row.eq) return false; const g = quad(row.eq); return g.a.p === 0 && g.b.p !== 0; };
            const tidied = (row) => { const g = quad(row.eq); return nb(sideH(ts([g.a, 'X'], [g.b, 'x'], [g.c, '']), true) + ' = 0'); };
            const HOW = '우변의 모든 항을 좌변으로 이항하여 정리하였을 때 (일차식) = 0 꼴이 되는 방정식이 일차방정식이다.';
            if (n === 0) {
              const { rows, at } = mix(d, yes[0], no.slice(0, 3));
              return C(`다음 중 ${x}에 대한 일차방정식인 것은?`, rows.map((r) => keep(r.h(true))), at, {
                explain: `${HOW} 일차방정식인 것은 ${keep(yes[0].h(true))}이다. 이 식을 정리하면 ${tidied(yes[0])}이다. 나머지는 ${no.slice(0, 3).map((r) => r.why).join(', ')}이다.`,
                facts: { truth: rows.map(linear), want: true, rule: 'linear-pick' }
              });
            }
            const k = d.int(2, 3), rows = d.shuffle(yes.slice(0, k).concat(no.slice(0, 5 - k))), flags = rows.map(linear);
            return N(`다음 중 ${x}에 대한 일차방정식은 모두 몇 개인가?`, k, {
              unit: '개', figure: tagEq(rows.map((r) => r.h(false))),
              explain: `${HOW} ${rows.map((r, i) => (flags[i] ? `${LAB[i]}은 정리하면 ${tidied(r)}이므로 일차방정식이다` : `${LAB[i]}은 ${r.why}이다`)).join('. ')}. 일차방정식은 ${k}개이다.`,
              facts: { count: flags, rule: 'linear-count' }
            });
          }, { count: 2 }),
          T('move-zero-form', '모든 항을 좌변으로 이항하여 (일차식) = 0 꼴로 나타내기', '①27 ①25', (d) => {
            const [a, c] = d.until(() => [nz(d, -9, 9), nz(d, -9, 9)], ([p, q]) => Math.abs(p - q) > 1), [b, e] = d.until(() => [nz(d, -12, 12), nz(d, -12, 12)], ([p, q]) => p !== q);
            const L = ts([a, 'x'], [b, '']), R = ts([c, 'x'], [e, '']);
            return linAns(`방정식 ${eqB(L, R)}의 우변에 있는 항을 모두 좌변으로 이항하여 정리하면 (${x}에 대한 일차식) = 0 꼴이 된다. 이 일차식은?`, a - c, b - e, x, {
              explain: `우변의 ${termH(c, 'x')}와 ${iq(e)}${tail(Math.abs(e), '을/를')} 좌변으로 이항하면 ${nb(sideH(ts([a, 'x'], [b, ''], [-c, 'x'], [-e, '']), true) + ' = 0')}이고, 동류항끼리 정리하면 ${nb(sideH(ts([a - c, 'x'], [b - e, '']), true) + ' = 0')}이다. 좌변이 ${x}에 대한 일차식이므로 이 방정식은 일차방정식이다.`,
              facts: { calc: [[`(${a})-(${c})`, 0], [`(${b})-(${e})`, 1]], unseen: [1] }
            });
          })
        ]
      },
      { id: 'solve', title: '일차방정식의 풀이', standard: STD4, types: [] },
      { id: 'param', title: '해와 상수', standard: STD4, types: [] },
      { id: 'word', title: '활용(수, 나이, 금액, 과부족, 도형)', standard: STD4, types: [] },
      { id: 'speed', title: '활용(거리, 속력, 시간)', standard: STD4, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(7-1-4b.js, 7-1-4c.js)이 함께 쓰는 도구
  B.kit.m714 = {
    STD3, STD4, HAN, x, va, vb, vc, iq, xu, VH, tm, tg, tf, tb, ts, sgn, isOne, magT, sideH, eqH, emQ, exq, keep, eqB, eqF, termH, tagEq, eqProc,
    evT, evS, jsT, jsS, diffJ, solJ, gather, sideOf, solQ, xpS, flatS, scS, denS, undec, subS, hasG, tidy, solve, diffOf, sameEq, follows, quad,
    SOLVE, valsQ, mix, nice, solveQ, pickEq
  };
})(typeof window !== 'undefined' ? window : globalThis);
