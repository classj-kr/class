// 고등학교 1학년 1학기 6단원 여러 가지 부등식(공통수학1, 2022 개정) — 단원 틀·도구와 앞쪽 묶음
// (연립일차부등식, 연립일차부등식의 상수와 활용, 절댓값을 포함한 일차부등식).
// 수집해 둔 천재 T셀파 공통수학1 두 종(홍진곤, 전인태)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 56꼴, 심화꼴: 4꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/10-1-6/싣기_대조표.md 에 있다.
// (이차부등식과 이차함수, 이차부등식의 해와 계수, 연립이차부등식, 이차부등식의 활용은 10-1-6b.js 에, 실력 문항은 10-1-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 방정식과 부등식. 성취기준은 10공수1-02-09(미지수가 1개인 연립일차부등식), 10공수1-02-10(절댓값을 포함한 일차부등식),
// 10공수1-02-11(이차부등식과 이차함수, 이차부등식과 연립이차부등식)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·그래프·문장), 묻는 것(해·정수인 해의 개수와 합·상수의 값과 범위·고르기), 부등식의 구조(두 해의 방향이
//    같은가 다른가, 공통부분이 없거나 한 점인가, A < B < C, 괄호·분수 계수, 절댓값의 개수와 자리, 이차항의 계수의 부호, 판별식의 부호)가 다르면 따로 싣는다.
//    같은 구조에서 수만 바꾼 유형은 만들지 않았다. 풀이 유형은 facts.rule 에 구조의 이름을 단다.
//  - 답: 해가 두 수 사이이고 경계가 정수이면 「[±][ ] [부등호] x [부등호] [±][ ]」, 한쪽 범위이면 「x [부등호] [±][ ]」(ineqAns), 두 쪽이면
//    「x [부등호] [±][ ] 또는 x [부등호] [±][ ]」로 받는다. 한 유형 안에서는 칸의 모양이 같다. 해의 모양(사이·두 쪽·해 없음·한 점·모든 실수)을 가리는 것이
//    배울 거리인 꼴(|ax + b| > c, 이차항의 계수가 음수, 판별식이 0·음수, 공통부분이 없거나 한 점)과 경계가 분수인 꼴은 해의 집합 고르기로 낸다.
//    틀린 보기는 아이들이 실제로 하는 잘못으로 만든 집합이다(사이와 두 쪽을 바꿈, 등호를 바꿈, 부등호의 방향을 바꾸지 않음, 범위를 맞춰 보지 않음, 한쪽 해만 씀).
//    수를 적는 칸에는 부호 단추를 단다. 개수·사람 수·길이처럼 음수일 수 없는 답만 단추 없이 받는다.
//  - 해는 모두 코드가 셈한다: 부등식을 항의 배열로 적고(글과 값이 한 곳에서 나온다), 절댓값은 안의 식이 0이 되는 수로 범위를 나누어,
//    이차부등식은 판별식과 두 근으로 해의 집합을 구한다. 구한 집합은 경계와 그 둘레, 정수와 반정수에서 부등식에 직접 넣어 맞춰 본다(verify).
//    원문 답지의 잘못(꼴 목록 머리에 적은 다섯 곳)은 따르지 않는다.
//  - 검사 근거: 경계를 다시 셈하는 식(facts.calc). 식의 수는 글에 적힌 계수이고, 이항·전개로 모은 계수처럼 글에 그대로 보이지 않는 수는 facts.unseen 에 밝힌다.
//    고르기는 집합을 견준 참·거짓(facts.truth), 정수인 해의 개수는 정수마다 부등식에 넣어 본 참·거짓(facts.count)이다.
//
// 뺀 것과 까닭(10-1-6b.js, 10-1-6c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 다른 단원 몫: 삼차방정식의 근이 모두 실수일 조건, 이차방정식의 판별식(정수 k 의 개수), 이차함수의 그래프와 직선(x축)의 위치 관계, 제한된 범위의 최대·최소
//    — 꼴 목록을 만들 때 세지 않았다.
//  - 겹침(같은 일): 두 부등식을 모두 만족하는 정수의 개수(①44 의 전소4 B3 — 전중평 06 과 같은 문제), 정수 a 의 합으로 물은 해 없음(①37 의 변형 — ①37),
//    a > 0 과 D < 0 을 함께 쓰는 정수 a 의 개수(①38 의 전대평 17 — 계수가 늘 양수라 ①36 과 같은 일), 세 변 x, x + 2, x + 4 인 둔각삼각형의 자연수 x 의 개수(①54 —
//    범위를 구하는 것과 같은 일). 정수인 해의 합(심1)은 ①9 와 한 유형(hard-int-sys1)의 둘째 차례로 실었다.
//  - 뜻 없는 셈은 값을 따로 받도록 바꾸었다: αβ(①18·①49), p + q(①17), a + b(①21·심3), ab(①32·①33), p + q + r(①47).
//  - 「모두 구하시오」(가능한 의자 수, 머그잔 수)는 가장 큰(작은) 수나 두 끝을 묻도록 바꾸었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, GT, LT, GE, LE, gcd, Q, plainQ, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, js, V, sup, emOf, fit, nz, pm, asQ, sys, ineqAns, ansV } = B.kit.mid;
  const UNIT = '10-1-6', STD9 = '10공수1-02-09', STD10 = '10공수1-02-10', STD11 = '10공수1-02-11';
  const X = V('x'), X2 = V('x') + sup(2), VA = V('a'), VB = V('b'), VK = V('k');
  const iq = (n) => tx(asQ(n));
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(o.derived — 이항·전개로 모은 계수 따위)가 아닌 수가 나오면 오류를 낸다.
  function seal(item) {
    const f = item.facts || {}, derived = new Set((f.derived || []).map((v) => Math.abs(Number(v))).concat([0, 1, 2])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!derived.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 셈이 어긋나면(verify) 오류가 그대로 올라간다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: retry(make) }, more || {});
  // 유리수들의 분자·분모(검사 식에 쓴 수를 밝힐 때)
  const numsOf = (list) => [].concat(...list.map((v) => { const q = asQ(v); return [Math.abs(q.p), q.q]; }));

  // ── 부등호 ──
  // 부등호는 '<' | '<=' | '>' | '>=' 로 다룬다. RH 화면 글, FLIP 방향을 바꾼 것.
  const RH = { '<': LT, '<=': LE, '>': GT, '>=': GE };
  const FLIP = { '<': '>', '<=': '>=', '>': '<', '>=': '<=' };
  const cmpOk = (c, r) => (r === '<' ? c < 0 : r === '<=' ? c <= 0 : r === '>' ? c > 0 : c >= 0);
  const closedR = (r) => r === '<=' || r === '>=';
  const upR = (r) => r === '>' || r === '>=';
  const relOf = (up, closed) => (up ? (closed ? '>=' : '>') : (closed ? '<=' : '<'));

  // ── 식(항의 배열) ──
  // 한 변은 항의 배열이다. 항의 종류:
  //  tm(c, vs)       단항식 c × (문자들). vs 는 문자를 이어 적은 글('' 상수항, 'x', 'X' 는 x², 'a', 'ax', 'k' …). c 는 수나 유리수(분수 계수는 x/3, (2/3)x 꼴로 적는다).
  //  tg(m, list, vs, after) 묶음 m × (문자들) × (list). m 이 1이면 (…), −1이면 −(…)로 적는다. after 이면 문자를 묶음 뒤에 적는다((k + 1)x²).
  //  tq(m, list)     제곱한 묶음 m(…)²
  //  tf(list, den, s) 분수 ±(list)/den(분자가 일차식인 분수)
  //  ta(m, list)     절댓값 m|list|
  const VH = (vs) => vs.split('').map((n) => (n === 'X' ? V('x') + sup(2) : n === 'A' ? V('a') + sup(2) : V(n))).join('');
  const tm = (c, vs) => ({ k: 'm', c: asQ(c), vs: vs || '' });
  // 괄호 안이 한 항이면 괄호를 풀어 한 항으로 적는다(「(a)x」가 아니라 「ax」).
  const tg = (m, list, vs, after) => (list.length === 1 && list[0].k === 'm' ? tm(qmul(asQ(m), list[0].c), list[0].vs + (vs || '')) : { k: 'g', m: asQ(m), list, vs: vs || '', after: Boolean(after) });
  const tq = (m, list) => ({ k: 'q', m: asQ(m), list });
  const tf = (list, den, s) => ({ k: 'f', list, den, s: s || 1 });
  let absSeq = 0;
  const ta = (m, list) => ({ k: 'a', m: asQ(m), list, id: 'a' + (absSeq += 1) });
  // 계수가 0인 항은 빼고 적은 변(모두 0이면 0)
  const ts = (...pairs) => { const out = pairs.filter(([c]) => asQ(c).p !== 0).map(([c, vs]) => tm(c, vs)); return out.length ? out : [tm(0, '')]; };
  const lx = (a, b) => ts([a, 'x'], [b, '']);                     // ax + b
  const qx = (a, b, c) => ts([a, 'X'], [b, 'x'], [c, '']);         // ax² + bx + c
  const sgn = (t) => (t.k === 'm' ? (t.c.p < 0 ? -1 : 1) : t.k === 'f' ? t.s : (t.m.p < 0 ? -1 : 1));
  const isOne = (q) => q.p === 1 && q.q === 1;
  function magT(t) {
    if (t.k === 'f') return frac(sideH(t.list), t.den);
    if (t.k === 'g' || t.k === 'q' || t.k === 'a') {
      const m = qabs(t.m), head = (isOne(m) ? '' : mag(m)) + (t.after ? '' : VH(t.vs || ''));
      return head + (t.k === 'a' ? '|' + sideH(t.list) + '|' : '(' + sideH(t.list) + ')' + (t.k === 'q' ? sup(2) : '')) + (t.after ? VH(t.vs || '') : '');
    }
    const c = qabs(t.c);
    if (!t.vs) return mag(c);
    if (c.q === 1) return (isOne(c) ? '' : mag(c)) + VH(t.vs);
    return c.p === 1 ? frac(VH(t.vs), c.q) : frac(c.p, c.q) + VH(t.vs);
  }
  // 계수가 0인 항은 적지 않는다(모두 0이면 0).
  function sideH(all) { const kept = all.filter((t) => !(t.k === 'm' && t.c.p === 0)), list = kept.length ? kept : [tm(0, '')]; return list.map((t, i) => (i === 0 ? (sgn(t) < 0 ? MINUS : '') : ' ' + (sgn(t) < 0 ? MINUS : '+') + ' ') + magT(t)).join(''); }
  const ineqH = (L, r, R) => sideH(L) + ' ' + RH[r] + ' ' + sideH(R);
  // A r1 B r2 C
  const chainH = (A, r1, Bm, r2, Cm) => sideH(A) + ' ' + RH[r1] + ' ' + sideH(Bm) + ' ' + RH[r2] + ' ' + sideH(Cm);

  // ── 값 ──
  // env: { x, X(= x²), 다른 문자, signs(절댓값 항의 부호를 정해 둘 때) }
  function evT(t, env) {
    if (t.k === 'm') return t.vs.split('').reduce((v, n) => qmul(v, env[n]), plainQ(t.c));
    if (t.k === 'g') return (t.vs || '').split('').filter(Boolean).reduce((v, n) => qmul(v, env[n]), qmul(t.m, evS(t.list, env)));
    if (t.k === 'q') { const v = evS(t.list, env); return qmul(t.m, qmul(v, v)); }
    if (t.k === 'f') return qmul(Q(t.s, t.den), evS(t.list, env));
    const v = evS(t.list, env), s = env.signs && env.signs[t.id];
    return qmul(t.m, s ? (s > 0 ? v : qneg(v)) : qabs(v));
  }
  function evS(list, env) { return list.reduce((s, t) => qadd(s, evT(t, env)), Q(0)); }
  const envAt = (x, more) => { const q = asQ(x), out = Object.assign({ x: q, X: qmul(q, q) }, more || {}); if (out.a && !out.A) out.A = qmul(out.a, out.a); return out; };
  // 수를 넣었을 때 부등식이 참인가
  const holds = (L, r, R, x, more) => cmpOk(qcmp(evS(L, envAt(x, more)), evS(R, envAt(x, more))), r);
  // 일차식으로 모은 계수 { a, b }(ax + b)
  const gl = (list, more) => { const b = evS(list, envAt(0, more)); return { a: qsub(evS(list, envAt(1, more)), b), b }; };
  // 이차식으로 모은 계수 { a, b, c }
  const gq = (list, more) => { const c = evS(list, envAt(0, more)), p = evS(list, envAt(1, more)), m = evS(list, envAt(-1, more)); return { a: qsub(qmul(qadd(p, m), Q(1, 2)), c), b: qmul(qsub(p, m), Q(1, 2)), c }; };

  // ── 해의 집합 ──
  // 조각 { lo, lc, hi, hc, le, he }: lo·hi 는 유리수(null 이면 끝이 없다), lc·hc 는 끝을 포함하는가, le·he 는 그 끝을 다시 셈하는 검사 식(글).
  const pc = (lo, lc, hi, hc, le, he) => ({ lo: lo == null ? null : asQ(lo), lc: lo != null && Boolean(lc), hi: hi == null ? null : asQ(hi), hc: hi != null && Boolean(hc), le: le || null, he: he || null });
  const ALL = () => [pc(null, false, null, false)];
  const okP = (p) => p.lo === null || p.hi === null || qcmp(p.lo, p.hi) < 0 || (qcmp(p.lo, p.hi) === 0 && p.lc && p.hc);
  const loCmp = (a, b) => (a.lo === null ? (b.lo === null ? 0 : -1) : b.lo === null ? 1 : qcmp(a.lo, b.lo) || (a.lc === b.lc ? 0 : a.lc ? -1 : 1));
  // 겹치거나 잇닿은 조각을 합친다.
  function norm(list) {
    const s = list.filter(okP).map((p) => Object.assign({}, p)).sort(loCmp), out = [];
    for (const p of s) {
      const last = out[out.length - 1];
      const touch = last && (last.hi === null || p.lo === null || qcmp(p.lo, last.hi) < 0 || (qcmp(p.lo, last.hi) === 0 && (last.hc || p.lc)));
      if (!touch) { out.push(p); continue; }
      if (last.hi === null) continue;
      if (p.hi === null) { last.hi = null; last.hc = false; last.he = null; continue; }
      const c = qcmp(p.hi, last.hi);
      if (c > 0) { last.hi = p.hi; last.hc = p.hc; last.he = p.he; } else if (c === 0 && p.hc && !last.hc) { last.hc = true; last.he = p.he || last.he; }
    }
    return out;
  }
  function meetP(a, b) {
    let lo = a.lo, lc = a.lc, le = a.le, hi = a.hi, hc = a.hc, he = a.he;
    if (b.lo !== null && (lo === null || qcmp(b.lo, lo) > 0 || (qcmp(b.lo, lo) === 0 && !b.lc))) { lo = b.lo; lc = b.lc; le = b.le || le; }
    if (b.hi !== null && (hi === null || qcmp(b.hi, hi) < 0 || (qcmp(b.hi, hi) === 0 && !b.hc))) { hi = b.hi; hc = b.hc; he = b.he || he; }
    return { lo, lc, hi, hc, le, he };
  }
  const inter = (A, Bs) => norm([].concat(...A.map((a) => Bs.map((b) => meetP(a, b)))));
  const uni = (...sets) => norm([].concat(...sets));
  const has = (S, x) => S.some((p) => (p.lo === null || qcmp(x, p.lo) > 0 || (qcmp(x, p.lo) === 0 && p.lc)) && (p.hi === null || qcmp(x, p.hi) < 0 || (qcmp(x, p.hi) === 0 && p.hc)));
  const sameQ = (u, w) => (u === null ? w === null : w !== null && qcmp(u, w) === 0);
  const eqSet = (A, Bs) => A.length === Bs.length && A.every((p, i) => sameQ(p.lo, Bs[i].lo) && sameQ(p.hi, Bs[i].hi) && p.lc === Bs[i].lc && p.hc === Bs[i].hc);
  // 끝의 포함을 모두 바꾼 집합(등호를 잘못 붙인 해)
  const flipC = (S) => norm(S.map((p) => Object.assign({}, p, { lc: p.lo !== null && !p.lc, hc: p.hi !== null && !p.hc })));
  // 여집합
  function comp(S) {
    const out = []; let lo = null, lc = false, open = true;
    for (const p of S) {
      if (p.lo !== null) out.push(pc(lo, lc, p.lo, !p.lc));
      if (p.hi === null) { open = false; break; }
      lo = p.hi; lc = !p.hc;
    }
    if (open) out.push(pc(lo, lc, null, false));
    return norm(out);
  }
  // 첫 조각의 아래 끝부터 끝 조각의 위 끝까지(두 쪽을 하나로 이은 잘못)
  const hull = (S) => (S.length ? norm([Object.assign({}, S[0], { hi: S[S.length - 1].hi, hc: S[S.length - 1].hc, he: S[S.length - 1].he })]) : []);
  const isAll = (S) => S.length === 1 && S[0].lo === null && S[0].hi === null;

  // 해를 적은 글: −4 < x ≤ 0 또는 1 ≤ x < 3, x ≠ 2인 모든 실수, 모든 실수, 해는 없다
  function pieceH(p, v) {
    if (p.lo === null && p.hi === null) return '모든 실수';
    if (p.lo !== null && p.hi !== null && qcmp(p.lo, p.hi) === 0) return nb(`${v} = ${tx(p.lo)}`);
    if (p.lo === null) return nb(`${v} ${p.hc ? LE : LT} ${tx(p.hi)}`);
    if (p.hi === null) return nb(`${v} ${p.lc ? GE : GT} ${tx(p.lo)}`);
    return nb(`${tx(p.lo)} ${p.lc ? LE : LT} ${v} ${p.hc ? LE : LT} ${tx(p.hi)}`);
  }
  function setH(S, name) {
    const v = name || X;
    if (!S.length) return '해는 없다';
    if (S.length === 2 && S[0].lo === null && S[1].hi === null && sameQ(S[0].hi, S[1].lo) && !S[0].hc && !S[1].lc) return nb(`${v} ≠ ${tx(S[0].hi)}`) + '인 모든 실수';
    return S.map((p) => pieceH(p, v)).join(' 또는 ');
  }

  // ── 부등식 풀기 ──
  // 경계를 셈하는 검사 식: 분수를 분자·분모의 정수 곱으로만 묶고 나눗셈은 마지막에 한 번 한다(소수 셈의 오차가 끼지 않게).
  const RQ = (q) => ({ n: `(${q.p})`, d: `${q.q}` });
  const rsub = (x, y) => ({ n: `(${x.n}*${y.d}-${y.n}*${x.d})`, d: `(${x.d}*${y.d})` });
  const radd = (x, y) => ({ n: `(${x.n}*${y.d}+${y.n}*${x.d})`, d: `(${x.d}*${y.d})` });
  const rneg = (x) => ({ n: `(0-${x.n})`, d: x.d });
  const rdiv = (x, y) => ({ n: `(${x.n}*${y.d})`, d: `(${x.d}*${y.n})` });
  const rE = (x) => `${x.n}/${x.d}`;
  // F(x) = A x + Bc 에 대하여 F rel 0 의 해. e: 경계를 셈하는 검사 식(주지 않으면 A, Bc 로 적는다)
  function linSet(A, Bc, rel, e) {
    if (A.p === 0) return cmpOk(Bc.p, rel) ? ALL() : [];
    const t = qdiv(qneg(Bc), A), r = A.p < 0 ? FLIP[rel] : rel, ee = e || rE(rdiv(rneg(RQ(Bc)), RQ(A)));
    if (!upR(r)) return [pc(null, false, t, r === '<=', null, ee)];
    return [pc(t, r === '>=', null, false, ee, null)];
  }
  // 일차부등식 L rel R 의 해 { S, nums }(nums: 검사 식에 쓴 수 — 글에 보이지 않을 수 있다)
  function solveLin(L, rel, R, more) {
    const l = gl(L, more), r = gl(R, more), A = qsub(l.a, r.a), Bc = qsub(l.b, r.b);
    const e = rE(rdiv(rsub(RQ(r.b), RQ(l.b)), rsub(RQ(l.a), RQ(r.a))));
    return { S: linSet(A, Bc, rel, A.p === 0 ? null : e), nums: numsOf([l.a, l.b, r.a, r.b]) };
  }
  // 절댓값 기호 안이 일차식인 부등식 L rel R(x² 의 항은 없다). 안의 식이 0이 되는 수로 범위를 나누어 푼다.
  // 돌려주는 것: { S 해, raw 범위를 맞춰 보지 않고 경우마다 푼 해를 합친 것(틀린 보기), cuts 나눈 수, nums }
  function absTermsOf(list) { const out = []; for (const t of list) { if (t.k === 'a') out.push(t); if (t.list) out.push(...absTermsOf(t.list)); } return out; }
  function solvePL(L, rel, R) {
    const abs = absTermsOf(L).concat(absTermsOf(R)), cuts = [], nums = [];
    for (const t of abs) {
      const g = gl(t.list);
      if (g.a.p === 0) continue;
      const c = qdiv(qneg(g.b), g.a);
      nums.push(...numsOf([g.a, g.b]));
      if (!cuts.some((u) => qcmp(u.c, c) === 0)) cuts.push({ c, e: rE(rdiv(rneg(RQ(g.b)), RQ(g.a))) });
    }
    cuts.sort((u, w) => qcmp(u.c, w.c));
    const parts = [], raw = [];
    for (let i = 0; i <= cuts.length; i += 1) {
      const lo = i === 0 ? null : cuts[i - 1], hi = i === cuts.length ? null : cuts[i];
      const s = lo === null ? (hi === null ? Q(0) : qsub(hi.c, Q(1))) : hi === null ? qadd(lo.c, Q(1)) : qdiv(qadd(lo.c, hi.c), Q(2));
      const signs = {};
      for (const t of abs) signs[t.id] = evS(t.list, envAt(s)).p >= 0 ? 1 : -1;
      const F = (x) => qsub(evS(L, envAt(x, { signs })), evS(R, envAt(x, { signs })));
      const Bc = F(0), A = qsub(F(1), Bc), own = linSet(A, Bc, rel);
      nums.push(...numsOf([A, Bc]));
      raw.push(...own);
      parts.push(...inter(own, [pc(lo && lo.c, false, hi && hi.c, false, lo && lo.e, hi && hi.e)]));
    }
    for (const c of cuts) if (holds(L, rel, R, c.c)) parts.push(pc(c.c, true, c.c, true, c.e, c.e));
    return { S: norm(parts), raw: norm(raw), cuts: cuts.map((u) => u.c), nums };
  }
  const isqrt = (n) => { if (n < 0) return null; const r = Math.round(Math.sqrt(n)); return r * r === n ? r : null; };
  const sqrtQ = (D) => { const r = isqrt(D.p * D.q); return r === null ? null : Q(r, D.q); };
  // 이차부등식 a x² + b x + c rel 0 (a ≠ 0, 유리수). 근이 무리수이면 null. 근을 셈하는 검사 식은 모은 계수 a, b 와 판별식의 제곱근으로 적는다.
  function quadSet(a0, b0, c0, rel) {
    let a = a0, b = b0, c = c0, r = rel;
    if (a.p < 0) { a = qneg(a); b = qneg(b); c = qneg(c); r = FLIP[r]; }
    const D = qsub(qmul(b, b), qmul(Q(4), qmul(a, c)));
    if (D.p < 0) return { S: upR(r) ? ALL() : [], D, nums: [] };
    const s = sqrtQ(D);
    if (s === null) return null;
    const den = qmul(Q(2), a0), x1 = qdiv(qsub(qneg(b0), s), den), x2 = qdiv(qadd(qneg(b0), s), den);
    const den2 = { n: `(2*${RQ(a0).n})`, d: RQ(a0).d }, e1 = rE(rdiv(rsub(rneg(RQ(b0)), RQ(s)), den2)), e2 = rE(rdiv(radd(rneg(RQ(b0)), RQ(s)), den2));
    const [r1, r2, f1, f2] = qcmp(x1, x2) <= 0 ? [x1, x2, e1, e2] : [x2, x1, e2, e1];
    const nums = numsOf([a0, b0, s]);
    if (D.p === 0) {
      const S = r === '>' ? [pc(null, false, r1, false, null, f1), pc(r1, false, null, false, f1, null)] : r === '>=' ? ALL() : r === '<' ? [] : [pc(r1, true, r1, true, f1, f1)];
      return { S: norm(S), D, r1, r2, nums };
    }
    const S = upR(r) ? [pc(null, false, r1, r === '>=', null, f1), pc(r2, r === '>=', null, false, f2, null)] : [pc(r1, r === '<=', r2, r === '<=', f1, f2)];
    return { S: norm(S), D, r1, r2, nums };
  }
  // 이차 이하의 부등식 L rel R(절댓값 없음): 모은 계수로 푼다.
  function solveQ(L, rel, R, more) {
    const l = gq(L, more), r = gq(R, more), a = qsub(l.a, r.a), b = qsub(l.b, r.b), c = qsub(l.c, r.c);
    if (a.p === 0) { const s = solveLin(L, rel, R, more); return { S: s.S, nums: s.nums, a, b, c }; }
    const out = quadSet(a, b, c, rel);
    return out && Object.assign(out, { a, b, c });
  }
  // 해의 집합이 부등식과 맞는가: 경계와 그 둘레, 정수·반정수·삼분의 몇에서 직접 넣어 본다. 맞지 않으면 셈의 잘못이므로 멈춘다.
  function verify(S, pred, extra) {
    const pts = (extra || []).map(asQ);
    for (const p of S) for (const v of [p.lo, p.hi]) if (v) pts.push(v, qadd(v, Q(1, 97)), qsub(v, Q(1, 97)));
    for (let i = -40; i <= 40; i += 1) pts.push(Q(i), Q(2 * i + 1, 2), Q(3 * i + 1, 3), Q(5 * i + 2, 5));
    for (const x of pts) if (has(S, x) !== Boolean(pred(x))) throw new Error('해의 집합이 부등식과 맞지 않는다: x = ' + fl(x) + ' / ' + stripH(setH(S)));
    return S;
  }
  // 범위 [lo, hi] 의 정수마다 조건이 참인가(facts.count)
  const flagsIn = (lo, hi, pred) => { const out = []; for (let i = lo; i <= hi; i += 1) out.push(Boolean(pred(Q(i)))); return out; };
  const intsOf = (lo, hi, pred) => { const out = []; for (let i = lo; i <= hi; i += 1) if (pred(Q(i))) out.push(i); return out; };
  // 집합 S 를 덮는 정수 창(위아래로 넉넉히)
  function windowOf(S, pad) {
    const ends = []; for (const p of S) for (const v of [p.lo, p.hi]) if (v) ends.push(fl(v));
    const k = pad == null ? 3 : pad;
    return [Math.floor(Math.min(...ends)) - k, Math.ceil(Math.max(...ends)) + k];
  }

  // ── 글 ──
  // 식의 너비 어림(분수는 분자와 분모 가운데 긴 쪽). 실제 사이트의 읽기 글꼴에서도 넘치지 않게 7 % 넉넉히 잡는다.
  const FRAC = /<span class="mb-frac"><span>(.*?)<\/span><span class="mb-frac-bar">\/<\/span><span>(.*?)<\/span><\/span>/g;
  const emRaw = (h) => { let extra = 0; const rest = String(h).replace(FRAC, (m, n, den) => { extra += Math.max(emOf(n), emOf(den)) + 0.62; return ''; }); return emOf(rest) + extra; };
  const emQ = (h) => 1.07 * emRaw(h) + 0.1 * (String(h).match(/class="mb-var"/g) || []).length;
  // 그림 자리에 적는 식, 연립부등식(가장 긴 줄에 맞춘다)
  const exq = (h, extra) => '<span class="mb-expr"' + fit(emQ(h) + (extra || 0)) + '>' + h + '</span>';
  const sysF = (rows) => '<span class="mb-expr"' + fit(Math.max(...rows.map(emQ)) + 0.9) + '>' + sys(rows) + '</span>';
  // 글줄 안의 식: 짧으면 통째로 묶고, 길면 연산 기호·부등호 앞에서만 줄이 바뀌게 조각마다 묶는다.
  const BREAK = /^ (?:[+−=≤≥≠]|&lt;|&gt;) /;
  function chunks(h) {
    const out = []; let depth = 0, span = 0, from = 0;
    for (let i = 0; i < h.length; i += 1) {
      if (h.startsWith('<span', i)) span += 1; else if (h.startsWith('</span>', i)) span -= 1;
      else if (h[i] === '(' || h[i] === '|') depth += h[i] === '|' ? (depth % 2 ? -1 : 1) : 1; else if (h[i] === ')') depth -= 1;
      else if (depth === 0 && span === 0 && h[i] === ' ' && BREAK.test(h.slice(i, i + 6))) { out.push(h.slice(from, i)); from = i + 1; }
    }
    return out.concat([h.slice(from)]).map(nb).join(' ');
  }
  const keep = (h) => (emQ(h) < 12.5 ? nb(h) : chunks(h));
  // 식 뒤의 토씨: 읽을 때 끝나는 소리에 맞춘다(제곱으로 끝나면 받침, 분수는 분자, 수는 그 수, 절댓값은 「값」, x 는 받침 없음).
  function endJ(h, pair) {
    const [withB, without] = pair.split('/'), s = String(h).replace(/(<\/span>|<\/i>|\s|&nbsp;)+$/g, '');
    if (/<\/sup>$/.test(s)) return pair === '으로/로' ? '으로' : withB;
    const fr = String(h).match(/<span class="mb-frac"><span>([^<]*?)<\/span><span class="mb-frac-bar">\/<\/span><span>[^<]*?<\/span><\/span>(?:<\/span>|\s)*$/);
    const t = fr ? fr[1] : stripH(h).replace(/[\s)\]]+$/g, ''), ch = t[t.length - 1];
    if (/\d/.test(ch)) return tail(Number(ch), pair);
    if (ch === '|') return pair === '으로/로' ? '으로' : withB;
    if (/[mnl]/.test(ch)) return pair === '으로/로' ? (ch === 'l' ? '로' : '으로') : withB;
    return pair === '으로/로' ? '로' : without;
  }
  const ej = (h, pair) => h + endJ(h, pair);
  const lastJ = (n, pair) => tail(lastOf(asQ(n)), pair);   // 수 뒤 토씨만
  const nj = (n, pair) => iq(n) + lastJ(n, pair);
  const SOLVE = '다음 부등식을 푸시오.', SOLVE2 = '다음 연립부등식을 푸시오.';

  // ── 답 ──
  const solE = (e) => `(${e})+0`;
  // 해가 두 수 사이(경계는 정수): 「[±][ ] [부등호] x [부등호] [±][ ]」. o.signed: false 이면 부호 단추를 달지 않는다(길이처럼 음수일 수 없는 경계).
  function betweenAns(text, S, o) {
    const p = S[0], name = o.name || X;
    if (S.length !== 1 || p.lo === null || p.hi === null || !isInt(p.lo) || !isInt(p.hi) || qcmp(p.lo, p.hi) >= 0 || !p.le || !p.he) throw new Error('사이 꼴의 해가 아니다: ' + stripH(setH(S)));
    const sg = o.signed !== false;
    return inline(text, `{0} {1} ${name} {2} {3}`, [{ answer: p.lo.p, signed: sg }, { rel: true, answer: p.lc ? '<=' : '<' }, { rel: true, answer: p.hc ? '<=' : '<' }, { answer: p.hi.p, signed: sg }], {
      figure: o.figure, explain: o.explain, shown: setH(S, name),
      // 부호 칸이 없는 0(길이의 아래 끝 0 따위)은 다시 셈하지 않는다(단원 검사는 부호 칸 없는 셈 값이 양수이기를 바란다).
      facts: Object.assign({ calc: [[solE(p.le), 0], [solE(p.he), 3]].filter(([, i]) => sg || (i === 0 ? p.lo : p.hi).p !== 0) }, o.facts || {})
    });
  }
  // 해가 한쪽(경계는 정수): 「x [부등호] [±][ ]」
  function rayAns(text, S, o) {
    const p = S[0], name = o.name || X;
    if (S.length !== 1 || (p.lo === null) === (p.hi === null)) throw new Error('한쪽 꼴의 해가 아니다: ' + stripH(setH(S)));
    const lower = p.hi === null, v = lower ? p.lo : p.hi, rel = lower ? (p.lc ? '>=' : '>') : (p.hc ? '<=' : '<'), e = lower ? p.le : p.he;
    if (!isInt(v) || !e) throw new Error('경계가 정수가 아니다');
    return ineqAns(text, rel, v.p, name, { figure: o.figure, explain: o.explain, facts: Object.assign({ calc: [[solE(e), 1]] }, o.facts || {}) });
  }
  // 해가 두 쪽(경계는 정수): 「x [부등호] [±][ ] 또는 x [부등호] [±][ ]」
  function orAns(text, S, o) {
    const name = o.name || X;
    if (S.length !== 2 || S[0].lo !== null || S[1].hi !== null || !isInt(S[0].hi) || !isInt(S[1].lo) || !S[0].he || !S[1].le) throw new Error('두 쪽 꼴의 해가 아니다: ' + stripH(setH(S)));
    const [L0, R0] = S, sg = o.signed !== false;
    return inline(text, `${name} {0} {1} 또는 ${name} {2} {3}`, [{ rel: true, answer: L0.hc ? '<=' : '<' }, { answer: L0.hi.p, signed: sg }, { rel: true, answer: R0.lc ? '>=' : '>' }, { answer: R0.lo.p, signed: sg }], {
      figure: o.figure, explain: o.explain, shown: setH(S, name),
      facts: Object.assign({ calc: [[solE(L0.he), 1], [solE(R0.le), 3]] }, o.facts || {})
    });
  }
  // 해의 집합 고르기: 옳은 집합 S 와 틀린 집합들 가운데 서로 다른 것을 골라 다섯(모자라면 넷) 보기를 만든다. 참·거짓은 집합을 견주어 정한다.
  function setPick(d, text, S, wrongs, o) {
    const name = (o && o.name) || X, seen = [S], opts = [[setH(S, name), true]];
    for (const W of d.shuffle(wrongs.filter(Boolean))) {
      if (opts.length >= 5) break;
      if (seen.some((U) => eqSet(U, W))) continue;
      seen.push(W); opts.push([setH(W, name), false]);
    }
    if (opts.length < 4 || new Set(opts.map((r) => stripH(r[0]))).size !== opts.length) return null;
    const rows = d.shuffle(opts);
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: rows.map((r) => r[1]), want: true }, o.facts || {}) });
  }
  // 문자의 값 여럿: 「a = [±][ ], b = [±][ ]」
  const valsQ = (text, pairs, o) => M(text, pairs.map(([n, v, sign]) => ({ answer: v, signed: sign !== false, lead: (n.startsWith('<') ? n : V(n)) + ' =' })), Object.assign({}, o, { shown: pairs.map(([n, v]) => nb(`${n.startsWith('<') ? n : V(n)} = ${iq(v)}`)).join(', ') }));
  // 한쪽 해의 글(x > 2)
  const rayH = (rel, t, name) => nb(`${name || X} ${RH[rel]} ${iq(t)}`);

  // ── 해가 정해진 일차부등식 짓기 ──
  // 해가 「x rel t」인 일차부등식 L shown R 을 만든다. form: 'c' 우변이 수 / 'b' 양변에 x 의 항 / 'p' 괄호 / 'f' 분자가 일차식인 분수
  // 돌려주는 것: { L, R, rel(적은 부등호), h(글), S(해), nums }
  function linFor(d, rel, t0, form) {
    const t = asQ(t0);
    for (let tries = 0; tries < 600; tries += 1) {
      let L, R, k;
      if (form === 'c') {
        k = pm(d) * t.q * d.int(1, t.q > 1 ? 2 : 5);
        const b = d.int(-9, 9), c = qadd(Q(b), qmul(Q(k), t));
        if (!isInt(c) || Math.abs(c.p) > 40) continue;
        L = lx(k, b); R = ts([c, '']);
      } else if (form === 'b') {
        k = pm(d) * t.q * d.int(1, t.q > 1 ? 2 : 4);
        const c = nz(d, -5, 5), a = c + k, b = d.int(-9, 9), e = qadd(Q(b), qmul(Q(k), t));
        if (a === 0 || !isInt(e) || Math.abs(e.p) > 40) continue;
        L = lx(a, b); R = lx(c, e);
      } else if (form === 'p') {
        const m = nz(d, -4, 4), s = d.int(-3, 3), q = nz(d, -5, 5), r = d.bool() ? 0 : nz(d, -9, 9);
        k = m - s;
        if (k === 0 || Math.abs(m) === 1 && r === 0) continue;
        const e = qadd(Q(m * q + r), qmul(Q(k), t));
        if (!isInt(e) || Math.abs(e.p) > 40) continue;
        const grp = tg(m, lx(1, q));
        L = r === 0 ? [grp] : d.bool() ? [tm(r, ''), grp] : [grp, tm(r, '')];
        R = d.bool() || s === 0 ? lx(s, e) : [tg(s, lx(1, qdiv(e, Q(s))))];
        if (R.length === 1 && R[0].k === 'g' && !isInt(qdiv(e, Q(s)))) continue;
      } else {
        // (αx + β)/m 와 (γx + δ)/n 또는 γx + δ
        const m = d.pick([2, 3, 4, 5, 6]), n = d.pick([1, 2, 3, 4, 5, 6].filter((v) => v !== m)), al = nz(d, -4, 4), ga = d.int(-3, 3), be = d.int(-6, 6);
        const K = qsub(Q(al, m), Q(ga, n));
        if (K.p === 0 || gcd(Math.abs(al), m) !== 1 && be === 0) continue;
        const de = qmul(Q(n), qadd(Q(be, m), qmul(K, t)));
        if (!isInt(de) || Math.abs(de.p) > 30) continue;
        k = K.p;
        L = [tf(lx(al, be), m)];
        R = n === 1 ? lx(ga, de) : [tf(lx(ga, de), n)];
        if (lx(al, be).length === 1 && Math.abs(al) === 1 && gcd(1, m) === 1 && be === 0) L = ts([Q(al, m), 'x']);
      }
      const shown = k > 0 ? rel : FLIP[rel], sol = solveLin(L, shown, R), want = upR(rel) ? [pc(t, closedR(rel), null)] : [pc(null, false, t, closedR(rel))];
      if (!eqSet(sol.S, want)) throw new Error('일차부등식 짓기가 어긋났다');
      return { L, R, rel: shown, h: ineqH(L, shown, R), S: sol.S, nums: sol.nums };
    }
    throw new Error('일차부등식을 짓지 못했다');
  }
  // 연립부등식(줄마다 { L, rel, R })이 참인가
  const allHold = (rows, x, more) => rows.every((r) => holds(r.L, r.rel, r.R, x, more));
  const solveSys = (rows) => { let S = ALL(); const nums = []; for (const r of rows) { S = inter(S, r.S); nums.push(...r.nums); } return { S: verify(S, (x) => allHold(rows, x)), nums }; };
  // 두 줄의 해를 적은 풀이 글
  const told = (rows, lead) => (lead ? lead + ' ' : '') + rows.map((r, i) => `${['첫째', '둘째', '셋째'][i]} 부등식${lead ? '의 해는' : '을 풀면'} ${setH(r.S)}`).join(', ');
  // 일차부등식을 푸는 데 양변을 음수로 나누는가
  const negDiv = (r) => { const l = gl(r.L), rr = gl(r.R); return qsub(l.a, rr.a).p < 0; };
  const negNote = (rows) => (rows.some(negDiv) ? ` ${X}의 계수가 음수인 부등식은 양변을 음수로 나누므로 부등호의 방향이 바뀐다.` : '');

  B.addUnit({
    id: '10-1-6', grade: 10, semester: 1, no: 6, title: '여러 가지 부등식', version: 1,
    groups: [
      { id: 'sys1', title: '연립일차부등식', standard: STD9, types: [] },
      { id: 'sys1k', title: '연립일차부등식의 상수와 활용', standard: STD9, types: [] },
      { id: 'abs', title: '절댓값을 포함한 일차부등식', standard: STD10, types: [] },
      { id: 'quad', title: '이차부등식과 이차함수', standard: STD11, types: [] },
      { id: 'quadk', title: '이차부등식의 해와 계수', standard: STD11, types: [] },
      { id: 'sys2', title: '연립이차부등식', standard: STD11, types: [] },
      { id: 'use2', title: '이차부등식의 활용', standard: STD11, types: [] }
    ]
  });

  B.kit.m1016 = {
    UNIT, STD9, STD10, STD11, X, X2, VA, VB, VK, iq, HAN, stripH, seal, retry, sourceOf, T, numsOf, RH, FLIP, cmpOk, closedR, upR, relOf,
    VH, tm, tg, tq, tf, ta, ts, lx, qx, sideH, ineqH, chainH, evS, envAt, holds, gl, gq, pc, ALL, norm, inter, uni, has, eqSet, flipC, comp, hull, isAll,
    pieceH, setH, linSet, solveLin, solvePL, sqrtQ, isqrt, quadSet, solveQ, verify, flagsIn, intsOf, windowOf, emQ, exq, sysF, keep, endJ, ej, lastJ, nj,
    SOLVE, SOLVE2, solE, betweenAns, rayAns, orAns, setPick, valsQ, rayH, linFor, allHold, solveSys, told, negNote
  };

  // ════════════════ 연립일차부등식 ════════════════
  // 연립부등식의 줄: 줄 차례를 섞는다.
  const twoRows = (d, a, b) => (d.bool() ? [a, b] : [b, a]);
  B.addTypes(UNIT, 'sys1', [
    T('sys1-between', '연립일차부등식 풀기 — 해가 두 수 사이', '①1', (d) => {
      const lo = d.int(-6, 4), hi = d.int(lo + 2, Math.min(lo + 7, 9)), lc = d.bool(), hc = d.bool();
      const rows = twoRows(d, linFor(d, relOf(true, lc), lo, d.pick(['c', 'b'])), linFor(d, relOf(false, hc), hi, d.pick(['c', 'b'])));
      const { S, nums } = solveSys(rows);
      return betweenAns(SOLVE2, S, {
        figure: sysF(rows.map((r) => r.h)),
        explain: `${told(rows)}이다.${negNote(rows)} 두 해의 공통부분을 구하면 ${setH(S)}이다.`,
        facts: { rule: 'sys1-between', derived: nums }
      });
    }),
    T('sys1-same', '연립일차부등식 풀기 — 두 해가 같은 쪽', '①2', (d) => {
      const up = d.bool(), same = d.int(0, 3) === 0, t1 = d.int(-6, 6), t2 = same ? t1 : d.until(() => d.int(-6, 6), (v) => v !== t1);
      const c1 = d.bool(), c2 = same ? !c1 : d.bool();
      const rows = twoRows(d, linFor(d, relOf(up, c1), t1, d.pick(['c', 'b'])), linFor(d, relOf(up, c2), t2, d.pick(['c', 'b'])));
      const { S, nums } = solveSys(rows);
      return rayAns(SOLVE2, S, {
        figure: sysF(rows.map((r) => r.h)),
        explain: `${told(rows)}이다.${negNote(rows)} 두 해가 모두 ${up ? '어떤 수보다 큰' : '어떤 수보다 작은'} 쪽이므로 공통부분은 더 좁은 쪽인 ${setH(S)}이다.${same ? ' 경계의 수가 같을 때는 등호가 없는 쪽을 따른다.' : ''}`,
        facts: { rule: 'sys1-same', derived: nums }
      });
    }),
    T('sys1-empty', '공통부분이 없거나 한 점인 연립일차부등식', '①3', (d, n) => {
      // n = 0: 해가 없다(떨어져 있거나, 경계가 같은데 등호가 없는 쪽이 있다) / n = 1: 해가 한 점(경계가 같고 둘 다 등호가 있다)
      const t = d.int(-6, 6), apart = n === 0 && d.bool(), lowT = apart ? t + d.int(1, 4) : t;
      const lc = n === 1 ? true : apart ? d.bool() : d.bool(), hc = n === 1 ? true : apart ? d.bool() : !lc;
      const low = linFor(d, relOf(true, lc), lowT, d.pick(['c', 'b'])), high = linFor(d, relOf(false, hc), t, d.pick(['c', 'b']));
      const rows = twoRows(d, low, high), { S } = solveSys(rows);
      const wrongs = [low.S, high.S, uni(low.S, high.S), [pc(t, true, t, true)], [], norm([pc(t, true, lowT, true)]), ALL(), flipC(low.S), flipC(high.S)];
      return setPick(d, '다음 연립부등식의 해는?', S, wrongs, {
        figure: sysF(rows.map((r) => r.h)),
        explain: `${told(rows)}이다.${negNote(rows)} ${n === 1 ? `두 해가 ${iq(t)}에서만 겹치고 둘 다 ${iq(t)}${lastJ(t, '을/를')} 포함하므로 해는 ${setH(S)}이다. 공통인 해가 하나이면 등호를 써서 나타낸다.`
          : apart ? '두 해를 수직선 위에 나타내면 겹치는 부분이 없으므로 해는 없다.' : `두 해의 경계가 ${nj(t, '으로/로')} 같지만 한쪽은 ${iq(t)}${lastJ(t, '을/를')} 포함하지 않으므로 공통인 해가 없다.`}`,
        facts: { rule: 'sys1-empty' }
      });
    }, { count: 2 }),
    T('sys1-chain', 'A < B < C 꼴의 부등식 풀기', '①4', (d) => {
      const lo = d.int(-6, 4), hi = d.int(lo + 1, Math.min(lo + 7, 9)), r1 = d.pick(['<', '<=']), r2 = d.pick(['<', '<=']);
      const b = nz(d, -4, 4), e = d.int(-8, 8), k1 = pm(d) * d.int(1, 4), k2 = -Math.sign(k1) * d.int(1, 4);
      // A r1 B ⟺ k1 x + (f − e) r1 0, B r2 C ⟺ k2 x + (e − g) r2 0
      const tA = k1 > 0 ? hi : lo, tC = k2 > 0 ? hi : lo, f = e - k1 * tA, g = e + k2 * tC, a = b + k1, c = b - k2;
      if (Math.abs(f) > 30 || Math.abs(g) > 30 || (a === 0 && c === 0)) return null;
      const A = lx(a, f), Bm = lx(b, e), Cm = lx(c, g);
      const p1 = solveLin(A, r1, Bm), p2 = solveLin(Bm, r2, Cm), S = verify(inter(p1.S, p2.S), (x) => holds(A, r1, Bm, x) && holds(Bm, r2, Cm, x));
      if (S.length !== 1 || S[0].lo === null || S[0].hi === null) return null;
      const h = chainH(A, r1, Bm, r2, Cm);
      return betweenAns(SOLVE, S, {
        figure: exq(h),
        explain: `주어진 부등식은 연립부등식 ${sys([ineqH(A, r1, Bm), ineqH(Bm, r2, Cm)])}과 같다(가운데 식을 양쪽과 하나씩 견준다). 각각 풀면 ${setH(p1.S)}, ${setH(p2.S)}이므로 해는 ${setH(S)}이다.`,
        facts: { rule: 'sys1-chain', derived: p1.nums.concat(p2.nums) }
      });
    }),
    T('sys1-chain-ray', 'A < B < C 꼴 — 두 해가 같은 쪽', '①4', (d) => {
      const up = d.bool(), t1 = d.int(-6, 6), t2 = d.until(() => d.int(-6, 6), (v) => v !== t1), r1 = d.pick(['<', '<=']), r2 = d.pick(['<', '<=']);
      const b = nz(d, -4, 4), e = d.int(-8, 8), s = up ? -1 : 1, k1 = s * d.int(1, 4), k2 = s * d.int(1, 4);
      const f = e - k1 * t1, g = e + k2 * t2, a = b + k1, c = b - k2;
      if (Math.abs(f) > 30 || Math.abs(g) > 30) return null;
      const A = lx(a, f), Bm = lx(b, e), Cm = lx(c, g);
      const p1 = solveLin(A, r1, Bm), p2 = solveLin(Bm, r2, Cm), S = verify(inter(p1.S, p2.S), (x) => holds(A, r1, Bm, x) && holds(Bm, r2, Cm, x));
      return rayAns(SOLVE, S, {
        figure: exq(chainH(A, r1, Bm, r2, Cm)),
        explain: `주어진 부등식은 연립부등식 ${sys([ineqH(A, r1, Bm), ineqH(Bm, r2, Cm)])}과 같다. 각각 풀면 ${setH(p1.S)}, ${setH(p2.S)}이고, 두 해가 같은 쪽이므로 공통부분은 ${setH(S)}이다.`,
        facts: { rule: 'sys1-chain-ray', derived: p1.nums.concat(p2.nums) }
      });
    }),
    T('sys1-int-count', '연립일차부등식의 정수인 해의 개수', '①5', (d) => {
      const den = d.pick([1, 2, 3]), lo = Q(d.int(-12, 6), den), hi = qadd(lo, Q(d.int(2 * den, 7 * den), den)), lc = d.bool(), hc = d.bool();
      if (!isInt(lo) && lc && d.bool()) return null;
      const rows = twoRows(d, linFor(d, relOf(true, lc), lo, d.pick(['c', 'b'])), linFor(d, relOf(false, hc), hi, d.pick(['c', 'b'])));
      const { S } = solveSys(rows), [w0, w1] = windowOf(S), flags = flagsIn(w0, w1, (x) => allHold(rows, x)), list = intsOf(w0, w1, (x) => allHold(rows, x));
      if (list.length < 2 || list.length > 9) return null;
      return N(`다음 연립부등식을 만족시키는 정수 ${X}의 개수는?`, list.length, {
        unit: '개', figure: sysF(rows.map((r) => r.h)),
        explain: `${told(rows)}이므로 연립부등식의 해는 ${setH(S)}이다. 이를 만족시키는 정수는 ${list.map(iq).join(', ')}의 ${list.length}개이다.`,
        facts: { count: flags, rule: 'sys1-int-count' }
      });
    }),
    T('sys1-mix', '괄호·분수 계수가 있는 연립일차부등식', '①6', (d, n) => {
      // n = 0: 괄호가 있는 부등식 / n = 1: 분자가 일차식인 분수가 있는 부등식
      const lo = d.int(-6, 4), hi = d.int(lo + 1, Math.min(lo + 7, 9)), lc = d.bool(), hc = d.bool();
      const forms = n === 0 ? ['p', d.pick(['p', 'b'])] : ['f', d.pick(['f', 'b', 'c'])];
      const f2 = d.shuffle(forms), rows = [linFor(d, relOf(true, lc), lo, f2[0]), linFor(d, relOf(false, hc), hi, f2[1])], { S, nums } = solveSys(rows);
      return betweenAns(SOLVE2, S, {
        figure: sysF(rows.map((r) => r.h)),
        explain: `${told(rows, n === 0 ? '괄호를 풀어 정리하여 풀면' : '양변에 분모의 최소공배수를 곱하여 정리하여 풀면')}이다.${negNote(rows)} 공통부분은 ${setH(S)}이다.`,
        facts: { rule: 'sys1-mix-' + n, derived: nums }
      });
    }, { count: 2 })
  ]);

  // ════════════════ 연립일차부등식의 상수와 활용 ════════════════
  // 수의 몫과 나머지를 쓰는 검사 식: ⌊N/D⌋, ⌈N/D⌉(N ≥ 0, D > 0)
  const floorE = (Ne, De) => `((${Ne})-((${Ne})%(${De})))/(${De})`;
  const ceilE = (Ne, De) => floorE(`(${Ne})+(${De})-1`, De);
  B.addTypes(UNIT, 'sys1k', [
    T('sys1k-coef', '해가 주어진 연립일차부등식의 계수', '①7', (d) => {
      const b = d.int(-6, 4), c = d.until(() => d.int(b + 1, 9), (v) => v !== 0), a = d.int(2, 6), r = d.int(-9, 9), s = r + a * c, lc = d.bool(), hc = d.bool();
      if (Math.abs(s) > 40) return null;
      const first = linFor(d, relOf(true, lc), b, d.pick(['c', 'b']));
      const L2 = [tm(1, 'ax')].concat(r ? [tm(r, '')] : []), R2 = ts([s, '']), rel2 = relOf(false, hc), h2 = ineqH(L2, rel2, R2);
      const sol = nb(`${VB} ${lc ? LE : LT} ${X} ${hc ? LE : LT} ${iq(c)}`), rows = d.bool() ? [first.h, h2] : [h2, first.h];
      return valsQ(`연립부등식 ${sys(rows)}의 해가 ${sol}일 때, 상수 ${VA}, ${VB}의 값은? (단, ${nb(`${VA} &gt; 0`)})`, [['a', a], ['b', b]], {
        explain: `${ej(first.h, '을/를')} 풀면 ${setH(first.S)}이므로 ${nb(VB + ' = ' + iq(b))}이다. ${VA} &gt; 0이므로 ${ej(h2, '을/를')} 풀면 ${nb(`${X} ${hc ? LE : LT} ${frac(iq(s - r), VA)}`)}이고, 이것이 ${nb(`${X} ${hc ? LE : LT} ${iq(c)}`)}${lastJ(c, '과/와')} 같으므로 ${nb(VA + ' = ' + a)}이다.`,
        facts: { calc: [[`((${js(Q(s))})-(${js(Q(r))}))/(${js(Q(c))})`, 0], [solE(first.S[0].le), 1]], derived: first.nums }
      });
    }),
    T('sys1k-none', 'A < B < C 꼴의 해가 없을 조건', '①8', (d) => {
      // A r1 B 에서 x < t(위 끝), B r2 C 에서 x > (e + a)/(c − b)(아래 끝, a 는 문자)
      const t = d.int(-5, 6), b = d.int(-3, 4), k1 = d.int(1, 4), kk = d.int(1, 4), e = d.int(-8, 8), r1 = d.pick(['<', '<=']), r2 = d.pick(['<', '<=']);
      const a1 = b + k1, f = e - k1 * t, c = b + kk;
      if (Math.abs(f) > 30) return null;
      const A = lx(a1, f), Bm = lx(b, e), Cm = ts([c, 'x']).concat([tm(-1, 'a')]);
      // 아래 끝 (e + a)/kk 가 t 이상(둘 다 등호이면 t 초과)이면 해가 없다.
      const both = r1 === '<=' && r2 === '<=', m = t * kk - e, rel = both ? '>' : '>=';
      // 몇 개의 a 로 직접 확인한다.
      for (const av of [m - 1, m, m + 1]) {
        const env = { a: Q(av) }, p1 = solveLin(A, r1, Bm, env), p2 = solveLin(Bm, r2, Cm, env), S = inter(p1.S, p2.S);
        if ((S.length === 0) !== cmpOk(av - m, rel)) throw new Error('해가 없을 조건이 어긋났다');
      }
      const p1 = solveLin(A, r1, Bm), top = e === 0 ? VA : `${VA} ${e < 0 ? MINUS : '+'} ${Math.abs(e)}`, low = kk === 1 ? top : frac(top, kk);
      return rayAns(`부등식 ${keep(chainH(A, r1, Bm, r2, Cm))}의 해가 없을 때, 실수 ${VA}의 값의 범위를 구하시오.`, [pc(m, rel === '>=', null, false, `(${p1.S[0].he})*((${js(Q(c))})-(${js(Q(b))}))-(${js(Q(e))})`)], {
        name: VA,
        explain: `${ej(ineqH(A, r1, Bm), '을/를')} 풀면 ${setH(p1.S)}이고, ${ej(ineqH(Bm, r2, Cm), '을/를')} 풀면 ${nb(`${X} ${r2 === '<=' ? GE : GT} ${low}`)}이다. 해가 없으려면 ${nb(`${low} ${both ? GT : GE} ${iq(t)}`)}이어야 한다(${both ? `두 끝이 같으면 ${nj(t, '이/가')} 해가 된다` : '두 끝이 같아도 공통인 해가 없다'}). 따라서 ${rayH(rel, m, VA)}이다.`,
        facts: { rule: 'sys1k-none', derived: p1.nums }
      });
    }),
    T('sys1k-none-int', '정수인 해가 없을 조건의 최솟값', '①8', (d) => {
      const p = d.int(-6, 5), firstClosed = d.bool(), k = d.pick([2, 3, 4]), m = d.int(-8, 6), P = firstClosed ? p : p - 1;
      if ((P - m) % k === 0) return null;
      const first = linFor(d, relOf(false, firstClosed), p, d.pick(['c', 'b']));
      const L2 = [tm(1, 'x'), tm(-k, 'a')], R2 = ts([m, '']);
      const ans = Q(P - m, k), hE = first.S[0].he;
      return ansV(`두 부등식 ${keep(first.h)}, ${keep(ej(ineqH(L2, '>', R2), '을/를'))} 동시에 만족시키는 정수 ${X}가 존재하지 않을 때, 실수 ${VA}의 최솟값은?`, ans, 'frac', {
        explain: `첫째 부등식을 풀면 ${setH(first.S)}이므로 ${X}가 될 수 있는 가장 큰 정수는 ${iq(P)}이다. 둘째 부등식에서 ${nb(`${X} ${GT} ${k}${VA} ${m < 0 ? MINUS : '+'} ${Math.abs(m)}`)}이다. 공통인 정수 ${X}가 없으려면 ${nb(`${k}${VA} ${m < 0 ? MINUS : '+'} ${Math.abs(m)} ≥ ${iq(P)}`)}, 곧 ${nb(`${VA} ≥ `)}${tx(ans)}이므로 최솟값은 ${tx(ans)}이다.`,
        facts: { value: firstClosed ? `((${hE})-(${m}))/(${k})` : `((${hE})-1-(${m}))/(${k})`, derived: first.nums }
      });
    }),
    T('sys1k-seats', '과부족 문제 — 마지막 자리의 사람 수', '①10', (d, n) => {
      if (n === 0) {
        // 방에 a명씩 배정하면 b명이 남고, c명씩 배정하면 방이 g개 남는다. 사람이 든 마지막 방에는 1명 이상 c명 이하.
        const a = d.int(3, 6), c = d.int(a + 1, a + 3), b = d.int(2, 12), g = d.int(1, 4), want = d.pick(['max', 'min']);
        const ok = (x) => x >= g + 1 && c * (x - g - 1) + 1 <= a * x + b && a * x + b <= c * (x - g);
        const list = intsOf(1, 200, (x) => ok(x.p));
        if (list.length < 2 || list.length > 8) return null;
        const D = c - a, upN = `(${b}+${c}*(${g}+1)-1)`, loN = `(${b}+${c}*${g})`;
        const ans = want === 'max' ? list[list.length - 1] : list[0];
        if (ans !== (want === 'max' ? Math.floor((b + c * (g + 1) - 1) / D) : Math.ceil((b + c * g) / D))) return null;
        return N(`어느 수련원에서 학생들에게 방을 배정하려고 한다. 한 방에 ${a}명씩 배정하면 ${b}명이 방을 배정받지 못하고, ${c}명씩 배정하면 방이 ${g}개 남는다. 방의 개수가 될 수 있는 수 가운데 가장 ${want === 'max' ? '큰' : '작은'} 수는? (단, 학생이 든 방에는 1명 이상이 있다.)`, ans, {
          unit: '개',
          explain: `방의 개수를 ${X}라 하면 학생 수는 ${nb(`${a}${X} + ${b}`)}이다. ${c}명씩 배정하면 학생이 든 방은 ${nb(`(${X} ${MINUS} ${g})`)}개이고 마지막 방에는 1명 이상 ${c}명 이하가 있으므로 ${nb(`${c}(${X} ${MINUS} ${g + 1}) + 1 ≤ ${a}${X} + ${b} ≤ ${c}(${X} ${MINUS} ${g})`)}이다. 이를 풀면 ${list[0]} ≤ ${X} ≤ ${list[list.length - 1]}이고 ${want === 'max' ? '가장 큰' : '가장 작은'} 수는 ${ans}이다.`,
          facts: { calc: [[want === 'max' ? floorE(upN, `(${c}-${a})`) : ceilE(loN, `(${c}-${a})`), 0]], derived: [D], rule: 'seats-room' }
        });
      }
      // 공책을 a권씩 나누어 주면 b권이 남고, c권씩 나누어 주면 마지막 한 명은 1권 이상 e권 미만을 받는다.
      const a = d.int(3, 6), c = d.int(a + 1, a + 4), b = d.int(5, 20), e = d.int(2, c);
      const ok = (x) => x >= 2 && c * (x - 1) + 1 <= a * x + b && a * x + b < c * (x - 1) + e;
      const list = intsOf(1, 200, (x) => ok(x.p));
      if (list.length < 1 || list.length > 6) return null;
      const ans = list[list.length - 1], upN = `(${b}+${c}-1)`;
      if (ans !== Math.floor((b + c - 1) / (c - a))) return null;
      return N(`학생들에게 공책을 나누어 주려고 한다. 한 명에게 ${a}권씩 주면 ${b}권이 남고, ${c}권씩 주면 마지막 한 명은 1권 이상 ${e}권 미만을 받는다. 학생 수의 최댓값은?`, ans, {
        unit: '명',
        explain: `학생 수를 ${X}라 하면 공책은 ${nb(`${a}${X} + ${b}`)}권이다. ${c}권씩 줄 때 앞의 ${nb(`(${X} ${MINUS} 1)`)}명이 ${c}권씩 받으므로 ${nb(`${c}(${X} ${MINUS} 1) + 1 ≤ ${a}${X} + ${b} &lt; ${c}(${X} ${MINUS} 1) + ${e}`)}이다. 이를 만족시키는 자연수 ${X}는 ${list.map(iq).join(', ')}이므로 최댓값은 ${ans}이다.`,
        facts: { calc: [[floorE(upN, `(${c}-${a})`), 0]], rule: 'seats-share' }
      });
    }, { count: 2 }),
    T('sys1k-word', '조건을 연립일차부등식으로 나타내어 풀기', '①11', (d, n) => {
      if (n === 0) {
        // 값이 다른 두 물건을 합하여 T개, 앞의 것을 뒤의 것보다 k개 이상 많이, 배송비 S원을 더한 금액이 M원 이하
        const P1 = 100 * d.int(6, 12), P2 = 100 * d.int(2, P1 / 100 - 2), T0 = d.int(14, 24), k = d.int(2, 6), S = 100 * d.int(20, 40);
        const yMax = Math.floor((T0 - k) / 2), yMin = d.int(2, yMax - 2), M0 = P1 * T0 + S - (P1 - P2) * yMin + 100 * d.int(0, (P1 - P2) / 100 - 1);
        const list = intsOf(0, T0, (y) => T0 - y.p >= y.p + k && P1 * (T0 - y.p) + P2 * y.p + S <= M0);
        if (list.length < 2 || list[0] !== yMin || list[list.length - 1] !== yMax) return null;
        return M(`한 개에 ${P1}원인 공책과 ${P2}원인 연필을 합하여 ${T0}개를 사려고 한다. 공책을 연필보다 ${k}개 이상 많이 사고, 배송비 ${S}원을 더한 전체 금액이 ${M0}원 이하가 되게 할 때, 살 수 있는 연필의 개수의 최솟값과 최댓값을 차례로 구하시오.`, [{ answer: yMin, lead: '최솟값', unit: '개' }, { answer: yMax, lead: '최댓값', unit: '개' }], {
          shown: `최솟값 ${yMin}개, 최댓값 ${yMax}개`,
          explain: `연필을 ${X}개 사면 공책은 ${nb(`(${T0} ${MINUS} ${X})`)}개이다. ${nb(`${T0} ${MINUS} ${X} ≥ ${X} + ${k}`)}에서 ${nb(`${X} ≤ ${tx(Q(T0 - k, 2))}`)}, ${nb(`${P1}(${T0} ${MINUS} ${X}) + ${P2}${X} + ${S} ≤ ${M0}`)}에서 ${nb(`${X} ≥ ${tx(Q(P1 * T0 + S - M0, P1 - P2))}`)}이다. 이를 만족시키는 자연수는 ${list.map(iq).join(', ')}이다.`,
          facts: { calc: [[ceilE(`(${P1}*${T0}+${S}-${M0})`, `(${P1}-${P2})`), 0], [floorE(`(${T0}-${k})`, '2'), 1]], rule: 'word-buy' }
        });
      }
      if (n === 1) {
        // 나이: 지금 나이의 a배는 b년 후의 나이보다 많고, c년 전 나이의 e배는 g년 후의 나이보다 적다.
        const a = d.int(2, 4), e = d.int(2, 4), age = d.int(10, 40), b = (a - 1) * age - d.int(1, a - 1), c = d.int(1, 6);
        if (b <= 0) return null;
        const g = e * (age - c) - age + d.int(1, e - 1);
        if (g <= 0) return null;
        const list = intsOf(1, 120, (x) => a * x.p > x.p + b && e * (x.p - c) < x.p + g);
        if (list.length !== 1) return null;
        return N(`민재의 지금 나이는 다음 두 조건을 모두 만족시킨다. 민재의 지금 나이는 몇 살인가?<br>㈎ 지금 나이의 ${a}배는 ${b}년 후의 나이보다 많다.<br>㈏ ${c}년 전 나이의 ${e}배는 ${g}년 후의 나이보다 적다.`, list[0], {
          unit: '살',
          explain: `지금 나이를 ${X}살이라 하면 조건은 ${sys([`${a}${X} &gt; ${X} + ${b}`, `${e}(${X} ${MINUS} ${c}) &lt; ${X} + ${g}`])}이다. 이를 풀면 ${nb(`${tx(Q(b, a - 1))} &lt; ${X} &lt; ${tx(Q(g + e * c, e - 1))}`)}이고, 이를 만족시키는 자연수는 ${list[0]}뿐이다.`,
          facts: { calc: [[`${floorE(String(b), `(${a}-1)`)}+1`, 0]], rule: 'word-age' }
        });
      }
      // 무게와 금액: 한 개에 w1 g·p1원인 것과 w2 g·p2원인 것을 합하여 T개, 전체 무게 W g 이하, 금액 Mo원 이하
      const w1 = 10 * d.int(20, 40), w2 = 10 * d.int(5, w1 / 10 - 5), p1 = 100 * d.int(10, 25), p2 = 100 * d.int(4, p1 / 100 - 4), T0 = d.int(6, 12);
      const xw = d.int(1, T0 - 1), xm = d.int(1, T0 - 1);
      const W = w2 * T0 + (w1 - w2) * xw + 10 * d.int(0, (w1 - w2) / 10 - 1), Mo = p2 * T0 + (p1 - p2) * xm + 100 * d.int(0, (p1 - p2) / 100 - 1);
      if (xw === xm) return null;
      const ans = Math.min(xw, xm), byW = xw < xm;
      const list = intsOf(0, T0, (x) => w1 * x.p + w2 * (T0 - x.p) <= W && p1 * x.p + p2 * (T0 - x.p) <= Mo);
      if (list[list.length - 1] !== ans) return null;
      return N(`한 개에 무게가 ${w1} g, 값이 ${p1}원인 멜론과 무게가 ${w2} g, 값이 ${p2}원인 사과를 합하여 ${T0}개 사려고 한다. 전체 무게는 ${W} g 이하, 전체 금액은 ${Mo}원 이하가 되게 할 때, 멜론은 최대 몇 개까지 살 수 있는가?`, ans, {
        unit: '개',
        explain: `멜론을 ${X}개 사면 사과는 ${nb(`(${T0} ${MINUS} ${X})`)}개이다. 무게에서 ${nb(`${w1}${X} + ${w2}(${T0} ${MINUS} ${X}) ≤ ${W}`)}, 곧 ${nb(`${X} ≤ ${tx(Q(W - w2 * T0, w1 - w2))}`)}이고, 금액에서 ${nb(`${p1}${X} + ${p2}(${T0} ${MINUS} ${X}) ≤ ${Mo}`)}, 곧 ${nb(`${X} ≤ ${tx(Q(Mo - p2 * T0, p1 - p2))}`)}이다. 두 조건을 모두 만족시키는 가장 큰 자연수는 ${ans}이다.`,
        facts: { calc: [[byW ? floorE(`(${W}-${w2}*${T0})`, `(${w1}-${w2})`) : floorE(`(${Mo}-${p2}*${T0})`, `(${p1}-${p2})`), 0]], rule: 'word-mix' }
      });
    }, { count: 3 })
  ]);

  // ════════════════ 절댓값을 포함한 일차부등식 ════════════════
  // 절댓값 안의 일차식 ax + b. a 가 음수이면 b 가 양수일 때 b − |a|x 꼴로, 아니면 부호를 모두 바꾸어 |a|x − b 꼴로 적는다(절댓값은 같다).
  const inner = (d, a, b) => (a > 0 ? lx(a, b) : b > 0 && d.bool() ? ts([b, ''], [a, 'x']) : lx(-a, -b));
  // 절댓값 부등식을 풀고 맞춰 본다.
  function plSolve(L, rel, R) { const out = solvePL(L, rel, R); verify(out.S, (x) => holds(L, rel, R, x), out.cuts); return out; }
  // 경우를 나눈 풀이 글: 나눈 수
  const cutsH = (cuts) => cuts.map((c) => iq(c)).join(', ');
  B.addTypes(UNIT, 'abs', [
    T('abs-lt', '|ax + b| < c 꼴의 부등식', '①14', (d) => {
      const a = pm(d) * d.int(1, 3), lo = d.int(-8, 6), hi = d.int(lo + 1, Math.min(lo + 10, 12)), r = d.pick(['<', '<=']);
      if ((Math.abs(a) * (hi - lo)) % 2) return null;
      const c = Math.abs(a) * (hi - lo) / 2, b = -a * (hi + lo) / 2;
      if (b === 0 && Math.abs(a) === 1 && d.bool()) return null;
      const inn = inner(d, a, b), g = gl(inn), A1 = g.a.p, B1 = g.b.p, L = [ta(1, inn)], R = ts([c, '']), { S, nums } = plSolve(L, r, R);
      return betweenAns(SOLVE, S, {
        figure: exq(ineqH(L, r, R)),
        explain: `${c} &gt; 0이므로 ${nb(`${MINUS}${c} ${RH[r]} ${sideH(inn)} ${RH[r]} ${c}`)}이다. 각 변에서 ${B1 === 0 ? '' : `${iq(B1)}${lastJ(B1, '을/를')} 빼고 `}${iq(A1)}${lastJ(A1, '으로/로')} 나누면${A1 < 0 ? '(음수로 나누므로 부등호의 방향이 바뀐다)' : ''} ${setH(S)}이다.`,
        facts: { rule: 'abs-lt', derived: nums }
      });
    }),
    T('abs-gt', '|ax + b| > c 꼴의 부등식', '①15', (d) => {
      const a = pm(d) * d.int(1, 4), b = nz(d, -9, 9), c = d.int(1, 9), r = d.pick(['>', '>=']);
      const inn = inner(d, a, b), L = [ta(1, inn)], R = ts([c, '']), { S } = plSolve(L, r, R), lt = plSolve(L, FLIP[r], R).S;
      const swap = solvePL([ta(1, lx(a, -b))], r, R).S;
      return setPick(d, '다음 부등식의 해는?', S, [lt, flipC(S), flipC(lt), swap, [S[1]], [S[0]]], {
        figure: exq(ineqH(L, r, R)),
        explain: `${c} &gt; 0이므로 ${nb(`${sideH(inn)} ${RH[FLIP[r]]} ${MINUS}${c}`)} 또는 ${nb(`${sideH(inn)} ${RH[r]} ${c}`)}이다. 각각 풀면 ${setH(S)}이다. 절댓값이 ${c}보다 큰 쪽은 두 범위로 나뉜다.`,
        facts: { rule: 'abs-gt' }
      });
    }),
    T('abs-band', 'a < |px + q| < b 꼴의 부등식', '①16', (d) => {
      const p = d.int(2, 4), q = nz(d, -9, 9), lo = d.int(1, 5), hi = d.int(lo + 2, lo + 6), r1 = d.pick(['<', '<=']), r2 = d.pick(['<', '<=']);
      const A = [ta(1, lx(p, q))], first = plSolve(ts([lo, '']), r1, A), second = plSolve(A, r2, ts([hi, ''])), S = verify(inter(first.S, second.S), (x) => holds(ts([lo, '']), r1, A, x) && holds(A, r2, ts([hi, '']), x));
      return setPick(d, '다음 부등식의 해는?', S, [second.S, first.S, hull(S), flipC(S), [S[0]], [S[1]], comp(S)], {
        figure: exq(`${lo} ${RH[r1]} ${sideH(A)} ${RH[r2]} ${hi}`),
        explain: `주어진 부등식은 ${sys([ineqH(ts([lo, '']), r1, A), ineqH(A, r2, ts([hi, '']))])}과 같다. ${ej(ineqH(ts([lo, '']), r1, A), '을/를')} 풀면 ${setH(first.S)}, ${ej(ineqH(A, r2, ts([hi, ''])), '을/를')} 풀면 ${setH(second.S)}이므로 공통부분은 ${setH(S)}이다.`,
        facts: { rule: 'abs-band' }
      });
    }),
    T('abs-lin-ray', '절댓값 밖에도 x가 있는 부등식 — 해가 한쪽', '①17', (d) => {
      const a = pm(d) * d.int(1, 3), b = nz(d, -8, 8), c = nz(d, -5, 5), e = d.int(-12, 15), r = d.pick(['<', '<=', '>', '>=']);
      if (Math.abs(c) === Math.abs(a)) return null;
      const L = [ta(1, inner(d, a, b))], R = d.bool() ? ts([c, 'x'], [e, '']) : ts([e, ''], [c, 'x']), out = plSolve(L, r, R), S = out.S;
      if (S.length !== 1 || (S[0].lo === null) === (S[0].hi === null) || !isInt(S[0].lo || S[0].hi) || eqSet(S, out.raw)) return null;
      const v = S[0].lo || S[0].hi;
      if (Math.abs(fl(v)) > 12 || out.cuts.some((t) => qcmp(t, v) === 0)) return null;
      return rayAns(SOLVE, S, {
        figure: exq(ineqH(L, r, R)),
        explain: `절댓값 기호 안의 식의 값이 0이 되는 ${nb(`${X} = ${cutsH(out.cuts)}`)}${endJ(iq(out.cuts[0]), '을/를')} 경계로 두 경우로 나누어 푼다. 각 경우에 구한 해를 그 경우의 범위와 맞춰 보고 합하면 ${setH(S)}이다.`,
        facts: { rule: 'abs-lin-ray', derived: out.nums }
      });
    }),
    T('abs-lin-in', '절댓값 밖에도 x가 있는 부등식 — 해가 두 수 사이', '①17', (d) => {
      const a = pm(d) * d.int(1, 3), b = nz(d, -8, 8), c = d.pick([Q(1, 2), Q(1, 3), Q(2, 3), Q(1), Q(1, 2)]), e = d.int(-4, 10), r = d.pick(['<', '<=']);
      if (qcmp(c, Q(Math.abs(a))) >= 0) return null;
      const inn = inner(d, a, b), L = [ta(1, inn)], R = ts([c, 'x'], [e, '']), out = plSolve(L, r, R), S = out.S;
      if (S.length !== 1 || S[0].lo === null || S[0].hi === null || !isInt(S[0].lo) || !isInt(S[0].hi) || qcmp(S[0].lo, S[0].hi) >= 0 || fl(S[0].hi) - fl(S[0].lo) > 16) return null;
      return betweenAns(SOLVE, S, {
        figure: exq(ineqH(L, r, R)),
        explain: `${nb(`${X} = ${cutsH(out.cuts)}`)}${endJ(iq(out.cuts[0]), '을/를')} 경계로 두 경우로 나누어 푼다. ${nb(`${sideH(inn)} ≥ 0`)}일 때와 ${nb(`${sideH(inn)} &lt; 0`)}일 때 구한 해를 각각 그 범위와 맞춰 보고 합하면 ${setH(S)}이다.`,
        facts: { rule: 'abs-lin-in', derived: out.nums }
      });
    }),
    T('abs-lin-or', '절댓값 밖에도 x가 있는 부등식 — 해가 두 쪽', '①17', (d) => {
      const a = pm(d) * d.int(2, 3), b = nz(d, -6, 6), p = nz(d, -2, 2), c = d.int(-4, 8), r = d.pick(['>', '>=']);
      if (Math.abs(p) >= Math.abs(a)) return null;
      const L = d.bool() ? [tm(p, 'x'), ta(1, inner(d, a, b))] : [ta(1, inner(d, a, b)), tm(p, 'x')], R = ts([c, '']), out = plSolve(L, r, R), S = out.S;
      if (S.length !== 2 || S[0].lo !== null || S[1].hi !== null || (isInt(S[0].hi) && isInt(S[1].lo))) return null;
      return setPick(d, '다음 부등식의 해는?', S, [out.raw, flipC(S), hull(S), [S[0]], [S[1]], comp(S)], {
        figure: exq(ineqH(L, r, R)),
        explain: `${nb(`${X} = ${cutsH(out.cuts)}`)}${endJ(iq(out.cuts[0]), '을/를')} 경계로 두 경우로 나누어 푼다. 각 경우의 해를 그 경우의 범위와 맞춰 보고 합하면 ${setH(S)}이다.`,
        facts: { rule: 'abs-lin-or' }
      });
    }),
    T('abs-lin-count', '절댓값이 든 부등식의 정수인 해의 개수', '①17', (d, n) => {
      if (n === 0) {
        const a = pm(d) * d.int(1, 3), b = nz(d, -8, 8), c = nz(d, -3, 3), e = d.int(-6, 10), r = d.pick(['<', '<=']);
        if (Math.abs(c) >= Math.abs(a)) return null;
        const L = [ta(1, inner(d, a, b))], R = ts([e, ''], [c, 'x']), out = plSolve(L, r, R), S = out.S;
        if (S.length !== 1 || S[0].lo === null || S[0].hi === null) return null;
        const [w0, w1] = windowOf(S), list = intsOf(w0, w1, (x) => holds(L, r, R, x));
        if (list.length < 2 || list.length > 10) return null;
        return N(`다음 부등식을 만족시키는 정수 ${X}의 개수는?`, list.length, {
          unit: '개', figure: exq(ineqH(L, r, R)),
          explain: `${nb(`${X} = ${cutsH(out.cuts)}`)}${endJ(iq(out.cuts[0]), '을/를')} 경계로 나누어 풀면 해는 ${setH(S)}이다. 이를 만족시키는 정수는 ${list.map(iq).join(', ')}의 ${list.length}개이다.`,
          facts: { count: flagsIn(w0, w1, (x) => holds(L, r, R, x)), rule: 'abs-count-1' }
        });
      }
      // {p − |x| < x − q, |x| ≤ m}
      const p = d.int(1, 6), q = d.int(1, 6), m = d.int(4, 9);
      const L1 = [tm(p, ''), ta(-1, lx(1, 0))], R1 = lx(1, -q), L2 = [ta(1, lx(1, 0))], R2 = ts([m, '']);
      const o1 = plSolve(L1, '<', R1), o2 = plSolve(L2, '<=', R2), S = verify(inter(o1.S, o2.S), (x) => holds(L1, '<', R1, x) && holds(L2, '<=', R2, x));
      const [w0, w1] = windowOf(S), list = intsOf(w0, w1, (x) => holds(L1, '<', R1, x) && holds(L2, '<=', R2, x));
      if (list.length < 2) return null;
      return N(`연립부등식 ${sys([ineqH(L1, '<', R1), ineqH(L2, '<=', R2)])}을 만족시키는 정수 ${X}의 개수는?`, list.length, {
        unit: '개',
        explain: `첫째 부등식은 ${nb(`${X} ≥ 0`)}일 때와 ${nb(`${X} &lt; 0`)}일 때로 나누어 풀면 ${setH(o1.S)}이고, 둘째 부등식의 해는 ${setH(o2.S)}이다. 공통부분 ${setH(S)}에 드는 정수는 ${list.map(iq).join(', ')}의 ${list.length}개이다.`,
        facts: { count: flagsIn(w0, w1, (x) => holds(L1, '<', R1, x) && holds(L2, '<=', R2, x)), rule: 'abs-count-2' }
      });
    }, { count: 2 }),
    T('abs-sum-in', '절댓값 둘의 합 — 해가 두 수 사이', '①18', (d, n) => {
      const p = d.int(-6, 4), q = d.int(p + 1, p + 7), k = n === 0 ? 1 : d.int(2, 3), r = d.pick(['<', '<=']);
      const c = d.int(Math.max(q - p, k * (q - p)) + 1, Math.max(q - p, k * (q - p)) + 9);
      const kp = d.bool() ? [k, 1] : [1, k];
      const L = [ta(kp[0], lx(1, -p)), ta(kp[1], lx(1, -q))], R = ts([c, '']), out = plSolve(L, r, R), S = out.S;
      if (S.length !== 1 || S[0].lo === null || S[0].hi === null || !isInt(S[0].lo) || !isInt(S[0].hi)) return null;
      return betweenAns(SOLVE, S, {
        figure: exq(ineqH(L, r, R)),
        explain: `절댓값 기호 안의 식의 값이 0이 되는 ${nb(`${X} = ${iq(p)}`)}, ${nb(`${X} = ${iq(q)}`)}${lastJ(q, '을/를')} 경계로 ${nb(`${X} &lt; ${iq(p)}`)}, ${nb(`${iq(p)} ≤ ${X} &lt; ${iq(q)}`)}, ${nb(`${X} ≥ ${iq(q)}`)}의 세 경우로 나누어 푼다. 각 경우의 해를 합하면 ${setH(S)}이다.`,
        facts: { rule: 'abs-sum-in-' + n, derived: out.nums }
      });
    }, { count: 2 }),
    T('abs-sum-out', '절댓값 둘의 합 — 해가 두 쪽', '①18', (d) => {
      const p = d.int(-6, 4), q = d.int(p + 1, p + 7), r = d.pick(['>', '>=']), c = d.int(q - p + 1, q - p + 9);
      if ((c + p + q) % 2) return null;
      const L = [ta(1, lx(1, -p)), ta(1, lx(1, -q))], R = ts([c, '']), out = plSolve(L, r, R), S = out.S;
      return orAns(SOLVE, S, {
        figure: exq(ineqH(L, r, R)),
        explain: `${nb(`${X} &lt; ${iq(p)}`)}일 때 ${nb(`${sideH(lx(-2, p + q))} ${RH[r]} ${c}`)}, ${nb(`${iq(p)} ≤ ${X} &lt; ${iq(q)}`)}일 때 ${nb(`${q - p} ${RH[r]} ${c}`)}(성립하지 않는다), ${nb(`${X} ≥ ${iq(q)}`)}일 때 ${nb(`${sideH(lx(2, -(p + q)))} ${RH[r]} ${c}`)}이다. 각 경우의 해를 합하면 ${setH(S)}이다.`,
        facts: { rule: 'abs-sum-out', derived: out.nums }
      });
    }),
    T('abs-sum-count', '절댓값 둘의 합 — 정수인 해의 개수', '①18', (d) => {
      const p = d.int(-5, 3), q = d.int(p + 1, p + 5), k = d.int(2, 3), r = d.pick(['<', '<=']), c = d.int(q - p + 1, k * (q - p) + 8);
      const L = d.bool() ? [ta(1, lx(1, -p)), ta(k, lx(1, -q))] : [ta(k, lx(1, -p)), ta(1, lx(1, -q))], R = ts([c, '']), out = plSolve(L, r, R), S = out.S;
      if (S.length !== 1 || S[0].lo === null || (isInt(S[0].lo) && isInt(S[0].hi))) return null;
      const [w0, w1] = windowOf(S), list = intsOf(w0, w1, (x) => holds(L, r, R, x));
      if (list.length < 2) return null;
      return N(`다음 부등식을 만족시키는 정수 ${X}의 개수는?`, list.length, {
        unit: '개', figure: exq(ineqH(L, r, R)),
        explain: `${nb(`${X} = ${iq(p)}`)}, ${nb(`${X} = ${iq(q)}`)}${lastJ(q, '을/를')} 경계로 세 경우로 나누어 풀면 해는 ${setH(S)}이다. 이를 만족시키는 정수는 ${list.map(iq).join(', ')}의 ${list.length}개이다.`,
        facts: { count: flagsIn(w0, w1, (x) => holds(L, r, R, x)), rule: 'abs-sum-count' }
      });
    }),
    T('abs-diff-ray', '절댓값 둘의 차 — 해가 한쪽', '①19', (d) => {
      const p = d.int(-6, 4), q = d.int(p + 2, p + 8), r = d.pick(['>', '>=']), c = d.int(1 - (q - p), q - p - 1);
      if ((p + q + c) % 2 !== 0 && (p + q - c) % 2 !== 0) return null;
      const pq = d.bool(), L = pq ? [ta(1, lx(1, -p)), ta(-1, lx(1, -q))] : [ta(1, lx(1, -q)), ta(-1, lx(1, -p))], R = ts([c, '']), out = plSolve(L, r, R), S = out.S;
      if (S.length !== 1 || (S[0].lo === null) === (S[0].hi === null) || !isInt(S[0].lo || S[0].hi)) return null;
      return rayAns(SOLVE, S, {
        figure: exq(ineqH(L, r, R)),
        explain: `${nb(`${X} = ${iq(p)}`)}, ${nb(`${X} = ${iq(q)}`)}${lastJ(q, '을/를')} 경계로 세 경우로 나누어 푼다. 빼는 절댓값은 안의 식이 음수인 범위에서 ${nb(`${MINUS}|${V('A')}| = ${V('A')}`)}가 된다. 가장 왼쪽(오른쪽) 범위에서는 ${X}가 없어져 늘 성립하거나 성립하지 않는다. 각 경우의 해를 합하면 ${setH(S)}이다.`,
        facts: { rule: 'abs-diff-ray', derived: out.nums }
      });
    }),
    T('abs-diff-or', '절댓값 둘의 차 — 계수가 다른 두 절댓값', '①19', (d) => {
      const a = d.int(2, 3), b = nz(d, -6, 6), c = nz(d, -6, 6), e = d.int(1, 6), r = d.pick(['>', '>=', '<', '<=']);
      const first = d.bool(), L = first ? [ta(1, lx(a, b)), ta(-1, lx(1, c))] : [ta(1, lx(1, c)), ta(-1, lx(a, b))], R = ts([e, '']), out = plSolve(L, r, R), S = out.S;
      if (!S.length || isAll(S) || S.length > 2 || S.some((p) => p.lo !== null && p.hi !== null && qcmp(p.lo, p.hi) === 0)) return null;
      return setPick(d, '다음 부등식의 해는?', S, [out.raw, flipC(S), comp(S), hull(S), [S[0]], S.length > 1 ? [S[1]] : null], {
        figure: exq(ineqH(L, r, R)),
        explain: `${nb(`${X} = ${cutsH(out.cuts)}`)}${endJ(iq(out.cuts[out.cuts.length - 1]), '을/를')} 경계로 범위를 나누어 푼다. 각 경우에 구한 해를 그 경우의 범위와 맞춰 보고 합하면 ${setH(S)}이다.`,
        facts: { rule: 'abs-diff-or' }
      });
    }),
    T('abs-both', '양쪽에 절댓값이 있는 부등식', '①20', (d, n) => {
      if (n === 0) {
        // |ax + b| ≤ |cx + e|
        const a = d.int(2, 4), b = nz(d, -6, 6), c = d.int(1, a - 1), e = nz(d, -6, 6), r = d.pick(['<', '<=']);
        const L = [ta(1, lx(a, b))], R = [ta(1, lx(c, e))], out = plSolve(L, r, R), S = out.S;
        if (S.length !== 1 || S[0].lo === null || S[0].hi === null || qcmp(S[0].lo, S[0].hi) === 0) return null;
        return setPick(d, '다음 부등식의 해는?', S, [out.raw, flipC(S), comp(S), [pc(S[0].lo, S[0].lc, null)], [pc(null, false, S[0].hi, S[0].hc)], []], {
          figure: exq(ineqH(L, r, R)),
          explain: `${nb(`${X} = ${cutsH(out.cuts)}`)}${endJ(iq(out.cuts[1]), '을/를')} 경계로 세 경우로 나누어 푼다. 각 경우의 해를 그 범위와 맞춰 보고 합하면 ${setH(S)}이다.`,
          facts: { rule: 'abs-both-0' }
        });
      }
      // |x − p| ≤ q − k|x| 의 해가 한 점
      const p = d.int(1, 6) * pm(d), k = d.int(2, 3), q = Math.abs(p);
      const L = [ta(1, lx(1, -p))], R = [tm(q, ''), ta(-k, lx(1, 0))], out = plSolve(L, '<=', R), S = out.S;
      if (S.length !== 1 || !S[0].lo || !S[0].hi || qcmp(S[0].lo, S[0].hi) !== 0) return null;
      return setPick(d, '다음 부등식의 해는?', S, [[], ALL(), [pc(0, true, Math.abs(p), true)], [pc(Math.min(0, p), true, Math.max(0, p), true)], [pc(p, true, p, true)], flipC(S).length ? flipC(S) : null, [pc(-q, true, q, true)]], {
        figure: exq(ineqH(L, '<=', R)),
        explain: `${nb(`${X} = 0`)}, ${nb(`${X} = ${iq(p)}`)}${lastJ(p, '을/를')} 경계로 세 경우로 나누어 푼다. 각 경우를 풀면 해가 범위 밖이거나 경계의 한 점만 남는다. 따라서 해는 ${setH(S)}이다.`,
        facts: { rule: 'abs-both-1' }
      });
    }, { count: 2 }),
    T('abs-coef', '절댓값 부등식의 해가 주어질 때 상수', '①21', (d, n) => {
      if (n === 0) {
        // |x + a| ≤ k 의 해가 m ≤ x ≤ b  →  a, b
        const a = nz(d, -6, 6), k = d.int(2, 8), m = -k - a, b = k - a, r = d.pick(['<', '<=']);
        const shown = nb(`${iq(m)} ${RH[r]} ${X} ${RH[r]} ${VB}`);
        return valsQ(`부등식 ${nb(`|${X} + ${VA}| ${RH[r]} ${k}`)}의 해가 ${shown}일 때, 상수 ${VA}, ${VB}의 값은?`, [['a', a], ['b', b]], {
          explain: `${nb(`${MINUS}${k} ${RH[r]} ${X} + ${VA} ${RH[r]} ${k}`)}에서 ${nb(`${MINUS}${k} ${MINUS} ${VA} ${RH[r]} ${X} ${RH[r]} ${k} ${MINUS} ${VA}`)}이다. ${nb(`${MINUS}${k} ${MINUS} ${VA} = ${iq(m)}`)}에서 ${nb(`${VA} = ${iq(a)}`)}이고 ${nb(`${VB} = ${k} ${MINUS} ${VA} = ${iq(b)}`)}이다.`,
          facts: { calc: [[`(0-(${k})-(${js(Q(m))}))+0`, 0], [`(${k})+(${k})+(${js(Q(m))})+0`, 1]] }
        });
      }
      // |cx − a| > k 의 해가 x < t 또는 x > b  →  a, b
      const c = d.int(2, 4), t = d.int(-6, 4), k = d.int(2, 9), a = c * t + k, b = (a + k) / c, r = d.pick(['>', '>=']);
      if (!Number.isInteger(b) || a === 0) return null;
      const shown = nb(`${X} ${RH[FLIP[r]]} ${iq(t)}`) + ' 또는 ' + nb(`${X} ${RH[r]} ${VB}`);
      return valsQ(`부등식 ${nb(`|${c}${X} ${MINUS} ${VA}| ${RH[r]} ${k}`)}의 해가 ${shown}일 때, 상수 ${VA}, ${VB}의 값은?`, [['a', a], ['b', b]], {
        explain: `${nb(`${c}${X} ${MINUS} ${VA} ${RH[FLIP[r]]} ${MINUS}${k}`)} 또는 ${nb(`${c}${X} ${MINUS} ${VA} ${RH[r]} ${k}`)}에서 ${nb(`${X} ${RH[FLIP[r]]} ${frac(`${VA} ${MINUS} ${k}`, c)}`)} 또는 ${nb(`${X} ${RH[r]} ${frac(`${VA} + ${k}`, c)}`)}이다. ${nb(`${frac(`${VA} ${MINUS} ${k}`, c)} = ${iq(t)}`)}에서 ${nb(`${VA} = ${iq(a)}`)}이고, ${nb(`${VB} = ${frac(`${VA} + ${k}`, c)} = ${iq(b)}`)}이다.`,
        facts: { calc: [[`(${c})*(${js(Q(t))})+(${k})+0`, 0], [`((${c})*(${js(Q(t))})+(${k})+(${k}))/(${c})+0`, 1]] }
      });
    }, { count: 2 }),
    T('abs-int-n', '정수인 해의 개수로 자연수 정하기', '①22', (d, n) => {
      const c = nz(d, -9, 9), m = d.int(2, 6), strict = n === 0, cnt = strict ? 2 * m - 1 : 2 * m + 1;
      const L = [ta(1, lx(1, -c))], rel = strict ? '<' : '<=';
      const list = intsOf(c - m - 2, c + m + 2, (x) => holds(L, rel, ts([m, '']), x));
      if (list.length !== cnt) throw new Error('정수 개수 셈이 어긋났다');
      return N(`부등식 ${nb(`${sideH(L)} ${RH[rel]} ${V('n')}`)}을 만족시키는 정수 ${X}의 개수가 ${cnt}일 때, 자연수 ${V('n')}의 값은?`, m, {
        explain: `${nb(`${MINUS}${V('n')} ${RH[rel]} ${sideH(lx(1, -c))} ${RH[rel]} ${V('n')}`)}에서 ${nb(`${iq(c)} ${MINUS} ${V('n')} ${RH[rel]} ${X} ${RH[rel]} ${iq(c)} + ${V('n')}`)}이다. 이 범위의 정수는 ${strict ? `${nb(`2${V('n')} ${MINUS} 1`)}개(양 끝은 들지 않는다)` : `${nb(`2${V('n')} + 1`)}개(양 끝도 든다)`}이므로 ${nb(`${strict ? `2${V('n')} ${MINUS} 1` : `2${V('n')} + 1`} = ${cnt}`)}, ${nb(`${V('n')} = ${m}`)}이다.`,
        facts: { calc: [[strict ? `(${cnt}+1)/2` : `(${cnt}-1)/2`, 0]], rule: 'abs-int-n-' + n }
      });
    }, { count: 2 }),
    T('abs-write', '범위를 |x − a| ≤ b 꼴로 나타내기', '①23', (d) => {
      const kind = d.int(0, 2), lo = [d.int(30, 90) * 10, d.int(140, 170), d.int(-12, 4)][kind], w = [d.int(2, 9) * 10, d.int(2, 9) * 2, d.int(3, 10) * 2][kind], hi = lo + w;
      const unit = ['g', 'cm', '°C'][kind], what = ['과일 한 상자의 무게', '반 학생의 키', '어느 날의 기온'][kind], jo = ['를', '를', '을'][kind];
      const a = (lo + hi) / 2, b = w / 2;
      return valsQ(`${what}${jo} ${X}(${unit})라 하자. ${X}의 값이 ${iq(lo)} ${unit} 이상 ${iq(hi)} ${unit} 이하인 범위를 부등식 ${nb(`|${X} ${MINUS} ${VA}| ≤ ${VB}`)}로 나타낼 때, 상수 ${VA}, ${VB}의 값은?`, [['a', a], ['b', b, false]], {
        explain: `${nb(`|${X} ${MINUS} ${VA}| ≤ ${VB}`)}는 ${nb(`${VA} ${MINUS} ${VB} ≤ ${X} ≤ ${VA} + ${VB}`)}와 같다. ${VA}는 두 끝의 가운데 값 ${nb(`(${iq(lo)} + ${iq(hi)}) ÷ 2 = ${iq(a)}`)}, ${VB}는 가운데에서 끝까지의 거리 ${nb(`${iq(hi)} ${MINUS} ${iq(a)} = ${b}`)}이다.`,
        facts: { calc: [[`((${js(Q(lo))})+(${js(Q(hi))}))/2+0`, 0], [`((${js(Q(hi))})-(${js(Q(lo))}))/2`, 1]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
