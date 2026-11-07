// 고등학교 미적분Ⅱ Ⅲ-2 정적분의 활용 — 단원 틀·도구와 앞쪽 묶음(정적분과 급수의 합 사이의 관계, 곡선과 x축 사이의 넓이).
// 수집해 둔 천재 T셀파 미적분Ⅱ(홍진곤, 2022 개정) 한 종의 교과서·평가 자료에서 뽑은 꼴 목록(기본꼴_1: 29꼴, 기본꼴_2: 23꼴, 심화 없음)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-5-7/싣기_대조표.md 에 있다.
// (두 곡선 사이의 넓이·접선과 역함수가 낀 넓이·부피·움직인 거리·곡선의 길이는 11-5-7b.js 에, 실력 문항은 11-5-7c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준은 12미적Ⅱ-03-04(정적분과 급수의 합), 03-05(넓이), 03-06(부피), 03-07(속도와 거리 — 평면 위의 운동과 곡선의 길이).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(급수의 꼴·곡선의 식·단면·매개변수), 묻는 것(극한값·넓이·상수·부피·거리·길이), 셈의 얼개
//    (급수를 어떤 정적분으로 옮기는가, 적분할 때 치환·부분적분·부분분수가 드는가, 구간 안에서 부호가 바뀌는가, 속력의 근호가 어떻게 벗겨지는가)가
//    다르면 따로 싣는다. 적분 기법이 다른 꼴(①7~①12, ②4·②6)은 사용자가 정한 대로 따로 두었다. 수만 바꾼 유형은 만들지 않는다.
//  - 사용자가 정한 대로 「지나치게 복잡한 문제는 다루지 않는다」를 까닭으로 수집본의 꼴을 빼지 않고, 함정이 있거나 세 단계 넘게 잇는 꼴은 실력(11-5-7c.js)에 싣는다.
//    미적분Ⅰ(11-2-7)과 같은 일인 꼴(①18 다항함수의 넓이 따위)도 과목이 달라 싣는다(사용자 결정).
//  - 「구분구적법」이라는 말은 문항 글에 쓰지 않는다(교육과정: 교수·학습 상황에서만 쓴다).
//  - 답: e·ln·π·근호·세제곱근이 섞인 값은 고르기로 낸다(칸의 모양이 답의 꼴을 흘리지 않게 — new-unit-guide-h.md 8절). 고르기의 정답은 닫힌 꼴로 셈한 값이고,
//    참·거짓(facts.truth)은 손으로 적지 않고 보기마다 수로 셈한 값이 수치 적분(같은 식을 적응형 심프슨으로 적분한 값, facts.check)과 같은지로 가린다
//    — 닫힌 꼴과 수치 적분이 어긋나면 문항을 만들지 않고 멈춘다. 정수·분수인 답은 qAns(분수 칸)로 받고, 한 유형(같은 차례) 안에서는 칸의 모양이 같게 수를 골랐다.
//    넓이·부피·거리·길이는 부호 단추 없이, 음수가 될 수 있는 극한값·상수는 부호 단추를 달아 받는다.
//  - 원문이 따로 구한 값을 묶은 꼴(기말13의 p + q, 대11의 p + q, 기말15의 q − p, 대14의 k + p)은 값을 바로 묻거나 칸마다 따로 묻는다.
//  - 검사 근거: 수 칸은 문제의 수로 다시 셈하는 식(facts.value·calc)이고, 글에 없는 수는 seal 이 facts.unseen 에 밝힌다.
//    답은 문제 글·보기만 읽어 다시 푸는 풀이(제 작업 폴더의 solver.cjs — 급수는 n을 크게 잡은 합, 넓이·부피·길이는 수치 적분)로 다시 맞춰 보았다.
//
// 뺀 것과 까닭(11-5-7b.js, 11-5-7c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 공학 도구 활동: ①1의 변형(교 165쪽 — 알지오매스로 직사각형 넓이의 합이 ∫₁ᵉ ln x dx에 가까워지는 것을 보기). 직사각형 넓이의 합을 세우는 일은 riem-rect 가 한다.
//  - 읽을거리: ②9의 변형(교 172쪽 카발리에리의 원리 — 단면의 넓이가 같은 두 용기). 단면의 넓이로 부피가 같음을 쓰는 일은 vol-hemi 가 한다.
//  - 대입만 하는 것: ②16의 1(사이클로이드 위의 점의 t = 0, 2π에서의 위치 — 매개변수 식에 값을 넣는 11-5-4의 일).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, tx, nb, V, sup, rt, js, sqParts } = B.kit.mid;
  const { ms, fn, sub, lim, sum, intg, evl, pw, rtn, trig, jh, hx, qAns, plot, plainOf } = B.kit.hs;
  const S4 = '12미적Ⅱ-03-04', S5 = '12미적Ⅱ-03-05', S6 = '12미적Ⅱ-03-06', S7 = '12미적Ⅱ-03-07';

  // ── 검사 근거 마무리 ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수(지수·나누는 수 따위)를 facts.unseen 에 밝힌다.
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

  // ── 수치 도구(닫힌 꼴로 셈한 답을 맞춰 보는 데 쓴다) ──
  // 적응형 심프슨: 구간을 16조각으로 나눈 뒤 조각마다 오차가 작아질 때까지 반으로 나눈다(꺾인 곳·근호의 끝도 버틴다).
  // tol: 조각마다의 상대 오차(차분으로 잰 도함수가 든 식은 셈의 잡음이 있어 느슨하게 준다).
  function integ(f, a, b, tol) {
    if (a === b) return 0;
    const eps = tol || 1e-12;
    const rec = (x0, x1, f0, fm, f1v, whole, depth) => {
      const m = (x0 + x1) / 2, l = (x0 + m) / 2, r = (m + x1) / 2, fl0 = f(l), fr0 = f(r);
      const left = (m - x0) / 6 * (f0 + 4 * fl0 + fm), right = (x1 - m) / 6 * (fm + 4 * fr0 + f1v);
      if (depth > 30 || Math.abs(left + right - whole) <= eps * Math.max(1, Math.abs(whole))) return left + right + (left + right - whole) / 15;
      return rec(x0, m, f0, fl0, fm, left, depth + 1) + rec(m, x1, fm, fr0, f1v, right, depth + 1);
    };
    let s = 0;
    for (let i = 0; i < 16; i += 1) {
      const x0 = a + (b - a) * i / 16, x1 = a + (b - a) * (i + 1) / 16, f0 = f(x0), f1v = f(x1), fm = f((x0 + x1) / 2);
      s += rec(x0, x1, f0, fm, f1v, (x1 - x0) / 6 * (f0 + 4 * fm + f1v), 0);
    }
    return s;
  }
  const close = (p, q) => Math.abs(p - q) <= 1e-7 * Math.max(1, Math.abs(q));
  // 곡선의 길이·움직인 거리의 수치 셈: 도함수는 가운데 차분
  const dnum = (f, x) => (f(x + 1e-6) - f(x - 1e-6)) / 2e-6;

  // ── 값(e·ln·π·근호가 섞인 수) ──
  // 값은 항의 배열 { t: [{ c: 유리수, f: [인수 …] }] }. 인수: ['e', 지수(유리수)], ['ln', 진수(유리수)], ['pi', 지수(정수)], ['rt', 자연수], ['cr', 유리수(세제곱근)].
  // 같은 인수의 항은 모으고, e·π 의 지수는 더하고, 근호는 제곱인수를 밖으로 꺼낸다. 화면 글(lH)과 수(lnum)를 준다.
  const qq = (x) => (typeof x === 'number' ? Q(x) : x);
  const ORD = { rt: 0, cr: 0, pi: 1, e: 2, ln: 3 };
  const fKey = (f) => f[0] + ':' + (f[0] === 'pi' || f[0] === 'rt' ? f[1] : qq(f[1]).p + '/' + qq(f[1]).q);
  const fVal = (f) => (f[0] === 'e' ? Math.exp(fl(qq(f[1]))) : f[0] === 'ln' ? Math.log(fl(qq(f[1]))) : f[0] === 'pi' ? Math.PI ** f[1] : f[0] === 'rt' ? Math.sqrt(f[1]) : Math.cbrt(fl(qq(f[1]))));
  function mergeF(fs) {
    let e = Q(0), pi = 0, r = 1; const rest = [];
    for (const f of fs) { if (f[0] === 'e') e = qadd(e, qq(f[1])); else if (f[0] === 'pi') pi += f[1]; else if (f[0] === 'rt') r *= f[1]; else rest.push(f); }
    const out = []; let k = Q(1);
    if (r > 1) { const [u, w] = sqParts(r); k = Q(u); if (w > 1) out.push(['rt', w]); }
    if (pi) out.push(['pi', pi]);
    if (e.p) out.push(['e', e]);
    return { k, f: out.concat(rest) };
  }
  function put(terms, c, fs) {
    if (fs.some((f) => f[0] === 'ln' && qcmp(qq(f[1]), Q(1)) === 0)) return;          // ln 1 = 0
    const m = mergeF(fs), cc = qmul(qq(c), m.k);
    if (cc.p === 0) return;
    const key = m.f.map(fKey).sort().join('|'), old = terms.find((t) => t.key === key);
    if (old) { old.c = qadd(old.c, cc); if (old.c.p === 0) terms.splice(terms.indexOf(old), 1); } else terms.push({ c: cc, f: m.f, key });
  }
  const L = (...items) => { const t = []; for (const [c, ...f] of items) put(t, c, f); return { t }; };
  const ladd = (...xs) => { const t = []; for (const x of xs) for (const s of x.t) put(t, s.c, s.f); return { t }; };
  const lsc = (x, k) => { const t = []; for (const s of x.t) put(t, qmul(s.c, qq(k)), s.f); return { t }; };
  const lmul = (x, y) => { const t = []; for (const s of x.t) for (const u of y.t) put(t, qmul(s.c, u.c), s.f.concat(u.f)); return { t }; };
  const lneg = (x) => lsc(x, -1);
  const lsub = (x, y) => ladd(x, lneg(y));
  const lq = (q) => L([qq(q)]);
  const lnum = (x) => x.t.reduce((s, u) => s + fl(u.c) * u.f.reduce((p, f) => p * fVal(f), 1), 0) * (x.m ? fVal(x.m) : 1);
  // 공통인수를 밖에 적는다: lm(값, ['pi', 1]) → π(…), lm(값, ['rt', 2], true) → (…)√2 처럼 뒤에
  const lm = (x, f, after) => ({ t: x.t, m: f, after: Boolean(after) });
  const eH = (q) => (q.q === 1 ? V('e') + (q.p === 1 ? '' : sup(q.p)) : pw('e', [q.p, q.q]));
  const num = (x) => tx(qq(x));
  const lnH = (a) => nb(fn('ln') + ' ' + num(a));
  const fH = (f) => (f[0] === 'e' ? eH(qq(f[1])) : f[0] === 'pi' ? 'π' + (f[1] === 1 ? '' : sup(f[1])) : f[0] === 'rt' ? rt(f[1]) : f[0] === 'cr' ? rtn(3, num(f[1])) : lnH(f[1]));
  function termH(s) {
    const c = qabs(s.c), up = [], dn = [];
    for (const f of s.f.slice().sort((x, y) => ORD[x[0]] - ORD[y[0]])) {
      if (f[0] === 'e' && qq(f[1]).p < 0) dn.push(['e', qneg(qq(f[1]))]); else if (f[0] === 'pi' && f[1] < 0) dn.push(['pi', -f[1]]); else up.push(f);
    }
    const lead = up.filter((f) => ORD[f[0]] <= 2), tail = up.filter((f) => ORD[f[0]] > 2), tailH = tail.map(fH).join(' ');
    const glue = (a, b) => (a && b ? a + ' ' + b : a || b);
    if (!dn.length && c.q === 1) return glue((c.p === 1 && up.length ? '' : String(c.p)) + lead.map(fH).join(''), tailH);
    if (!dn.length) {
      if (lead.some((f) => f[0] === 'rt' || f[0] === 'cr')) return glue(frac((c.p === 1 ? '' : String(c.p)) + lead.map(fH).join(''), c.q), tailH);
      return glue(frac(c.p, c.q) + lead.map(fH).join(''), tailH);
    }
    return glue(frac((c.p === 1 && lead.length ? '' : String(c.p)) + lead.map(fH).join(''), (c.q === 1 ? '' : String(c.q)) + dn.map(fH).join('')), tailH);
  }
  function lH(x) {
    if (!x.t.length) return '0';
    if (x.m && x.t.length === 1) return lH(lmul({ t: x.t }, L([1, x.m])));
    let s = '';
    x.t.forEach((u, i) => { const neg = u.c.p < 0, b = nb(termH(u)); s += i === 0 ? (neg ? MINUS : '') + b : (neg ? ' ' + MINUS + ' ' : ' + ') + b; });
    if (x.m) return x.after ? '(' + s + ')' + fH(x.m) : fH(x.m) + '(' + s + ')';
    return s;
  }

  // 고르기: right 는 정답 값, cands 는 틀린 값 후보(차례대로 쓰되 값·글이 겹치는 것은 버린다). o.chk 는 수치로 셈한 답.
  // 정답의 수가 수치 적분과 다르면 멈춘다(닫힌 꼴을 잘못 셈한 것). 참·거짓은 보기의 수를 o.chk 와 견주어 정한다.
  function pickC(d, text, right, cands, o) {
    const rv = lnum(right);
    if (!close(rv, o.chk)) throw new Error('닫힌 꼴과 수치 적분이 다르다: ' + plainOf(lH(right)) + ' = ' + rv + ' / ' + o.chk);
    const seen = [plainOf(lH(right))], vals = [rv], wrongs = [];
    // 후보가 모자라면 정답을 조금 바꾼 값(1을 더하고 빼기, 두 배·반, 부호)으로 채운다.
    for (const w of cands.concat([ladd(right, lq(-1)), ladd(right, lq(1)), lsc(right, 2), lsc(right, Q(1, 2)), lneg(right)])) {
      if (!w || !w.t.length) continue;
      const v = lnum(w), h = plainOf(lH(w));
      if (!Number.isFinite(v) || seen.includes(h) || vals.some((u) => Math.abs(u - v) <= 1e-4 * Math.max(1, Math.abs(u)))) continue;
      seen.push(h); vals.push(v); wrongs.push(w);
      if (wrongs.length === 4) break;
    }
    if (wrongs.length < 3) throw new Error('보기를 다 만들지 못했다: ' + plainOf(lH(right)));
    const list = d.shuffle([right].concat(wrongs)), at = list.indexOf(right), truth = list.map((x) => close(lnum(x), o.chk));
    if (truth.filter(Boolean).length !== 1 || !truth[at]) throw new Error('보기 가운데 답이 하나가 아니다');
    return C(text, list.map(lH), at, { figure: o.figure, explain: o.explain, facts: Object.assign({ truth, want: true, check: [o.chk] }, o.rule ? { rule: o.rule } : {}) });
  }

  // ── 글 ──
  const X = V('x'), YY = V('y'), TT = V('t'), KK = V('k'), NN = V('n');
  const yEq = (h) => nb(`${YY} = ${h}`);
  const xEq = (h) => nb(`${X} = ${typeof h === 'number' ? num(h) : h}`);
  // π 의 유리수배: piH(Q(2, 3)) → 2π/3
  const piH = (q0) => { const q = qq(q0); if (q.p === 0) return '0'; const a = Math.abs(q.p), top = (a === 1 ? '' : a) + 'π'; return (q.p < 0 ? MINUS : '') + (q.q === 1 ? top : frac(top, q.q)); };
  const piJ = (q0) => { const q = qq(q0); return `(${q.p}*3.141592653589793/${q.q})`; };
  // 정확한 삼각함수 값(π/6·π/4 의 배수): sinL(Q(1, 3)) → √3/2
  const SIN0 = { 0: L(), 30: L([Q(1, 2)]), 45: L([Q(1, 2), ['rt', 2]]), 60: L([Q(1, 2), ['rt', 3]]), 90: L([1]) };
  function sinL(q0) {
    const q = qq(q0), d0 = (180 * q.p) / q.q, d = ((d0 % 360) + 360) % 360;
    if (!Number.isInteger(d) || (d % 30 !== 0 && d % 45 !== 0)) throw new Error('표에 없는 각: ' + d0);
    if (d <= 90) return SIN0[d];
    if (d <= 180) return SIN0[180 - d];
    if (d <= 270) return lneg(SIN0[d - 180]);
    return lneg(SIN0[360 - d]);
  }
  const cosL = (q) => sinL(qadd(qq(q), Q(1, 2)));
  // 그림 속 수식 이름에 쓰는 수(분수는 a/b)
  // 구간과 그 뒤 토씨: iv(0, 3) → [0, 3]을 (끝의 수로 토씨를 고른다)
  const iv = (a, b, pair) => { const t = '[' + a + ', ' + b + ']'; return pair && !pair.includes('/') ? t + pair : jh(t, pair || '을/를'); };
  const sq = (q0) => { const q = qq(q0); return (q.p < 0 ? '-' : '') + Math.abs(q.p) + (q.q === 1 ? '' : '/' + q.q); };

  B.kit.u57x = {
    S4, S5, S6, S7, T, H, seal, retry, integ, close, dnum, qq, L, ladd, lsc, lmul, lneg, lsub, lq, lnum, lm, eH, num, lnH, lH, pickC,
    X, YY, TT, KK, NN, yEq, xEq, piH, piJ, sinL, cosL, sq, iv
  };

  // ═══ 가. 정적분과 급수의 합 사이의 관계 ═══
  // lim 기호에 몸을 붙이면 한 덩어리가 되어 줄이 갈리지 않는다 — 몸은 기호 뒤에 따로 두어 좁은 화면에서 항 사이로 줄이 갈리게 한다.
  const limN = (body) => hx(lim('n→∞') + body);
  const sumK = (body) => sum('k=1', 'n', body);
  const kn = (c) => frac((c === 1 ? '' : c) + KK, NN);                                       // ck/n
  const askLim = '다음 극한값은?';
  // 펼친 합: 항마다 한 덩어리(좁은 화면에서 항 가운데서 줄이 갈리지 않게)
  const tj = (list) => list.map((h) => (h === '⋯' ? h : nb(h))).join(' + ');
  const riem = [
    T('riem-rect', '곡선 아래 직사각형 넓이의 합으로 넓이 구하기(빈칸)', '①1', (d) => {
      const b = d.pick([2, 3, 4, 5, 6]), c = d.pick([1, 2, 3]);
      if ((c * b ** 3) % 3 !== 0 || c * b ** 3 > 9999) return null;
      const cur = c === 1 ? X + sup(2) : c + X + sup(2), n0 = 6, w = b / n0;
      const segs = [];
      for (let i = 1; i <= n0; i += 1) { const x0 = w * (i - 1), x1 = w * i, h = c * x1 * x1; segs.push({ p: [x0, 0], q: [x0, h] }, { p: [x0, h], q: [x1, h] }, { p: [x1, h], q: [x1, 0] }); }
      const top = c * b * b, ux = Math.min(44, 210 / (b + 0.8)), ys = Math.min(1, 170 / ((top * 1.15 + 0.5) * ux));
      const figure = plot({ x: [-0.3, b + 0.6], y: [-top * 0.08, top * 1.15], u: ux, ys, xt: [b], curves: [{ f: (x) => c * x * x, from: 0, to: b * 1.08, name: 'y=' + (c === 1 ? '' : c) + 'x^2' }],
        fill: [{ f: (x) => c * (Math.ceil(x / w - 1e-9) * w) ** 2, from: 0, to: b }], segs, say: `닫힌구간 ${iv(`0`, `${b}`)} 여섯 등분하여 소구간마다 오른쪽 끝 점의 함숫값을 높이로 하는 직사각형을 그렸다(n = 6일 때의 모습).` });
      const text = `곡선 ${jh(yEq(cur), '과/와')} ${X}축 및 직선 ${jh(xEq(b), '으로/로')} 둘러싸인 도형의 넓이 ${V('S')}를 구하려고 한다. 닫힌구간 ${iv(`0`, `${b}`)} ${NN}등분하고 각 소구간의 오른쪽 끝 점의 함숫값을 높이로 하는 직사각형을 만들면, 직사각형 하나의 가로의 길이는 ${frac('(가)', NN)}이고 직사각형의 넓이의 합은 ${nb(V('S') + sub(NN) + ' = ' + frac('(나)', NN + sup(3)) + '(' + ms('1^2 + 2^2 + 3^2 + ⋯ + n^2') + ')')}이다. ${nb(V('S') + ' = ' + lim('n→∞', V('S') + sub(NN)) + ' = (다)')}일 때, (가), (나), (다)에 알맞은 수는?`;
      return M(text, [{ label: '(가)', answer: b }, { label: '(나)', answer: c * b ** 3 }, { label: '(다)', answer: c * b ** 3 / 3 }], {
        figure,
        explain: `${KK}번째 직사각형의 가로는 ${frac(b, NN)}, 세로는 ${nb((c === 1 ? '' : c) + '(' + frac(b + KK, NN) + ')' + sup(2))}이므로 ${nb(V('S') + sub(NN) + ' = ' + frac(c * b ** 3, NN + sup(3)) + '(' + ms('1^2 + ⋯ + n^2') + ')')} = ${nb(frac(c * b ** 3, NN + sup(3)) + ' × ' + frac(ms('n(n + 1)(2n + 1)'), 6))}이다. ${NN} → ∞일 때 ${nb(V('S') + ' = ' + frac(c * b ** 3, 3) + ' = ' + c * b ** 3 / 3)}이다.`,
        facts: { calc: [[`${b}`, 0], [`${c}*${b}**3`, 1], [`${c}*${b}**3/3`, 2]] } });
    }),
    T('riem-pow', '거듭제곱의 합의 극한 — 정적분으로', '①2', (d, n) => {
      if (n === 0) {
        const p = d.int(2, 6), terms = tj([ms(`1^${p}`), ms(`2^${p}`), ms(`3^${p}`), '⋯', ms(`n^${p}`)]);
        return qAns(askLim, Q(1, p + 1), {
          figure: limN(frac(1, NN + sup(p + 1)) + '(' + terms + ')'),
          explain: `${nb(frac(1, NN + sup(p + 1)) + '(' + terms + ')')} = ${sumK('(' + kn(1) + ')' + sup(p) + frac(1, NN))}이므로 ${nb(V('f') + '(' + X + ') = ' + X + sup(p))}, [0, 1]로 놓으면 극한값은 ${intg(0, 1, X + sup(p), 'x')} = ${evl(frac(X + sup(p + 1), p + 1), 0, 1)} = ${frac(1, p + 1)}이다.`,
          facts: { value: `1/(${p}+1)`, rule: 'pow0' } });
      }
      const [p, c] = d.pick([[3, 2], [3, 4], [3, 6], [2, 3], [2, 6]]), terms = tj([`${c}${sup(p)}`, `${2 * c}${sup(p)}`, `${3 * c}${sup(p)}`, '⋯', `(${c}${NN})${sup(p)}`]);
      return qAns(askLim, c ** p / (p + 1), {
        figure: limN(frac(1, NN + sup(p + 1)) + '{' + terms + '}'),
        explain: `주어진 식은 ${sumK('(' + kn(c) + ')' + sup(p) + frac(1, NN))}의 극한이다. ${nb(V('x') + sub(KK) + ' = ' + kn(c))}로 보면 닫힌구간 ${iv(`0`, `${c}`)} ${NN}등분한 것이고 ${nb('Δ' + X + ' = ' + frac(c, NN))}이므로 극한값은 ${frac(1, c)}${intg(0, c, X + sup(p), 'x')} = ${frac(1, c)} × ${frac(c ** (p + 1), p + 1)} = ${c ** p / (p + 1)}이다.`,
        facts: { value: `${c}**${p}/(${p}+1)`, rule: 'powc' } });
    }, { count: 2 }),
    T('riem-shift', '(n + k)가 든 합의 극한 — 아래끝이 0이 아닌 정적분', '①3', (d, n) => {
      if (n === 0) {
        const p = d.int(1, 5), val = Q(2 ** (p + 1) - 1, p + 1), alt = d.bool();
        const pp = (h) => (p === 1 ? h : '(' + h + ')' + sup(p));
        const body = alt ? sumK(frac(pp(ms('n + k')), NN + sup(p + 1))) : frac(1, NN) + sumK(pp('1 + ' + kn(1)));
        return qAns(askLim, val, {
          figure: limN(body),
          explain: `${alt ? `${nb(frac(pp(ms('n + k')), NN + sup(p + 1)) + ' = ' + pp('1 + ' + kn(1)) + frac(1, NN))}이므로 ` : ''}${nb(V('x') + sub(KK) + ' = 1 + ' + kn(1))}로 보면 닫힌구간 ${iv(`1`, `2`)} ${NN}등분한 것이다. 극한값은 ${intg(1, 2, p === 1 ? X : X + sup(p), 'x')} = ${evl(frac(X + sup(p + 1), p + 1), 1, 2)} = ${num(val)}이다.`,
          facts: { value: `(2**(${p}+1)-1)/(${p}+1)`, rule: alt ? 'shiftA' : 'shiftB' } });
      }
      if (n === 1) {
        const c = d.pick([2, 4, 5]), val = Q((1 + c) ** 3 - 1, 3 * c), terms = tj([`(${ms('n + ' + c)})${sup(2)}`, `(${ms('n + ' + 2 * c)})${sup(2)}`, '⋯', `(${ms('n + ' + c + 'n')})${sup(2)}`]);
        return qAns(askLim, val, {
          figure: limN(frac(1, NN + sup(3)) + '{' + terms + '}'),
          explain: `주어진 식은 ${sumK('(1 + ' + kn(c) + ')' + sup(2) + frac(1, NN))}의 극한이다. 닫힌구간 ${iv(`1`, `${1 + c}`)} ${NN}등분한 것이고 ${nb('Δ' + X + ' = ' + frac(c, NN))}이므로 극한값은 ${frac(1, c)}${intg(1, 1 + c, X + sup(2), 'x')} = ${frac(1, c)} × ${frac((1 + c) ** 3 - 1, 3)} = ${num(val)}이다.`,
          facts: { value: `((1+${c})**3-1)/(3*${c})`, rule: 'shiftC' } });
      }
      const p = d.int(2, 5), val = Q(p % 2 ? -1 : 1, p + 1), terms = tj([`(${MINUS}1 + ${frac(1, NN)})${sup(p)}`, `(${MINUS}1 + ${frac(2, NN)})${sup(p)}`, '⋯', `(${MINUS}1 + ${frac(NN, NN)})${sup(p)}`]);
      return qAns(askLim, val, {
        signed: true,
        figure: limN(frac(1, NN) + '{' + terms + '}'),
        explain: `${nb(V('x') + sub(KK) + ' = ' + MINUS + '1 + ' + kn(1))}로 보면 닫힌구간 ${iv(`${MINUS}1`, `0`)} ${NN}등분한 것이므로 극한값은 ${intg(-1, 0, X + sup(p), 'x')} = ${evl(frac(X + sup(p + 1), p + 1), -1, 0)} = ${num(val)}이다.`,
        facts: { value: `${p % 2 ? '-' : ''}1/(${p}+1)`, rule: 'shiftNeg' } });
    }, { count: 3 }),
    T('riem-trig', '삼각함수가 든 합의 극한', '①4', (d, n) => {
      if (n === 0) {
        const f = d.pick(['sin', 'cos']), m = d.pick([1, 2, 3, 4, 6]);
        if (f === 'cos' && m === 1) return null;
        const end = Q(1, m), ints = f === 'sin' ? lsub(lq(1), cosL(end)) : sinL(end);   // ∫₀^(π/m)
        const right = lmul(ints, L([m, ['pi', -1]]));
        const arg = frac((m === 1 ? '' : '') + KK + 'π', (m === 1 ? '' : m) + NN);
        const g = f === 'sin' ? Math.sin : Math.cos, chk = (m / Math.PI) * integ(g, 0, Math.PI / m);
        return pickC(d, askLim, right, [ints, lmul(ints, L([Q(1, m), ['pi', 1]])), lneg(right), lmul(f === 'sin' ? sinL(end) : lsub(lq(1), cosL(end)), L([m, ['pi', -1]])), lsc(right, 2), lmul(ints, L([1, ['pi', -1]]))], {
          chk, figure: limN(sumK(frac(1, NN) + trig(f, arg))),
          explain: `${nb(V('x') + sub(KK) + ' = ' + frac(KK + 'π', (m === 1 ? '' : m) + NN))}로 보면 닫힌구간 ${iv(`0`, `${piH(end)}`)} ${NN}등분한 것이고 ${nb('Δ' + X + ' = ' + frac('π', (m === 1 ? '' : m) + NN))}이므로 ${nb(frac(1, NN) + ' = ' + frac(m === 1 ? 1 : m, 'π') + ' × Δ' + X)}이다. 극한값은 ${frac(m === 1 ? 1 : m, 'π')}${intg(0, piH(end), trig(f, 'x'), 'x')} = ${lH(right)}이다.`,
          rule: 'trig0' });
      }
      if (n === 1) {
        const f = d.pick(['sin', 'cos']), a = d.pick([Q(1, 6), Q(1, 4), Q(1, 3)]);
        const right = f === 'sin' ? lsc(cosL(a), 2) : lsc(sinL(a), -2);          // ∫ₐ^(a+π)
        const g = f === 'sin' ? Math.sin : Math.cos, chk = integ(g, fl(a) * Math.PI, (fl(a) + 1) * Math.PI);
        const other = f === 'sin' ? lsc(sinL(a), 2) : lsc(cosL(a), -2);
        return pickC(d, askLim, right, [lneg(right), lsc(right, Q(1, 2)), other, lneg(other), lmul(right, L([1, ['pi', -1]])), lmul(right, L([1, ['pi', 1]]))], {
          chk, figure: limN(frac('π', NN) + sumK(trig(f, '(' + piH(a) + ' + ' + frac(KK + 'π', NN) + ')'))),
          explain: `${nb(V('x') + sub(KK) + ' = ' + piH(a) + ' + ' + frac(KK + 'π', NN))}로 보면 닫힌구간 ${iv(`${piH(a)}`, `${piH(qadd(a, Q(1)))}`)} ${NN}등분한 것이고 ${nb('Δ' + X + ' = ' + frac('π', NN))}이다. 극한값은 ${intg(piH(a), piH(qadd(a, Q(1))), trig(f, 'x'), 'x')} = ${lH(right)}이다.`,
          rule: 'trig1' });
      }
      // 함수를 이름으로 준다: f(x) = sin(πx/2) 또는 cos(πx/2), Σ f(a + ck/n)·1/n
      const f = d.pick(['sin', 'cos']), a = d.pick([0, 1]), c = d.pick([1, 2]);
      const F = (x) => (f === 'sin' ? lneg(cosL(Q(x, 2))) : sinL(Q(x, 2)));          // 2/π 를 뺀 부정적분의 값
      const raw = lsub(F(a + c), F(a));
      if (!raw.t.length) return null;
      const right = lmul(raw, L([Q(2, c), ['pi', -1]]));
      const g = (x) => (f === 'sin' ? Math.sin(Math.PI * x / 2) : Math.cos(Math.PI * x / 2)), chk = integ(g, a, a + c) / c;
      const fx = nb(V('f') + '(' + X + ') = ' + trig(f, frac('π', 2) + X));
      return pickC(d, `함수 ${fx}에 대하여 다음 극한값은?`, right, [lsc(right, c), lneg(right), lmul(raw, L([Q(1, c), ['pi', -1]])), lmul(raw, L([Q(4, c), ['pi', -1]])), lmul(raw, L([Q(1, c), ['pi', 1]]))], {
        chk, figure: limN(sumK(V('f') + '(' + (a ? '1 + ' : '') + kn(c) + ')' + frac(1, NN))),
        explain: `${nb(V('x') + sub(KK) + ' = ' + (a ? '1 + ' : '') + kn(c))}로 보면 닫힌구간 ${iv(`${a}`, `${a + c}`)} ${NN}등분한 것이고 ${nb('Δ' + X + ' = ' + frac(c, NN))}이다. 극한값은 ${c === 1 ? '' : frac(1, c)}${intg(a, a + c, trig(f, frac('π', 2) + X), 'x')} = ${lH(right)}이다.`,
        rule: 'trig2' });
    }, { count: 3 }),
    T('riem-abs', '절댓값이 든 합의 극한', '①5', (d) => {
      const f = d.pick(['sin', 'cos']), Lq = f === 'sin' ? d.pick([Q(4, 3), Q(3, 2), Q(5, 4), Q(7, 6)]) : d.pick([Q(2, 3), Q(3, 4), Q(5, 6), Q(4, 3)]);
      const ints = f === 'sin' ? ladd(lq(3), cosL(Lq)) : lsub(lq(2), sinL(Lq));                // ∫₀ᴸ|f|
      const right = lmul(ints, L([Q(Lq.q, Lq.p), ['pi', -1]]));
      const signedI = f === 'sin' ? lsub(lq(1), cosL(Lq)) : sinL(Lq);
      const g = f === 'sin' ? (x) => Math.abs(Math.sin(x)) : (x) => Math.abs(Math.cos(x)), chk = integ(g, 0, fl(Lq) * Math.PI) / (fl(Lq) * Math.PI);
      const arg = frac((Lq.p === 1 ? '' : Lq.p) + KK + 'π', Lq.q + NN);
      return pickC(d, askLim, right, [lmul(signedI, L([Q(Lq.q, Lq.p), ['pi', -1]])), L([2, ['pi', -1]]), ints, lmul(ints, L([1, ['pi', -1]])), lneg(lmul(signedI, L([Q(Lq.q, Lq.p), ['pi', -1]])))], {
        chk, figure: limN(sumK('|' + frac(1, NN) + trig(f, arg) + '|')),
        explain: `닫힌구간 ${iv(`0`, `${piH(Lq)}`)} ${NN}등분한 것이므로 극한값은 ${frac(Lq.q, (Lq.p === 1 ? '' : Lq.p) + 'π')}${intg(0, piH(Lq), '|' + trig(f, 'x') + '|', 'x')}이다. ${f === 'sin' ? `${X} = π` : `${X} = ${piH(Q(1, 2))}`}에서 부호가 바뀌므로 구간을 나누어 적분하면 ${intg(0, piH(Lq), '|' + trig(f, 'x') + '|', 'x')} = ${lH(ints)}이고, 극한값은 ${lH(right)}이다.`,
        rule: 'abs' });
    }),
    T('riem-log', '분모를 n으로 묶어 로그함수의 정적분으로', '①6', (d, n) => {
      if (n === 0) {
        const [a, c] = d.pick([[1, 1], [1, 2], [1, 3], [2, 1], [2, 3]]);
        const right = L([Q(1, c), ['ln', Q(a + c, a)]]), chk = integ((x) => 1 / (a + x), 0, c) / c;
        const den = (a === 1 ? NN : a + NN) + ' + ' + (c === 1 ? KK : c + KK);
        return pickC(d, askLim, right, [L([1, ['ln', Q(a + c, a)]]), L([c, ['ln', Q(a + c, a)]]), L([Q(1, c), ['ln', a + c]]), L([Q(1, c), ['ln', Q(c, a)]]), L([Q(1, a), ['ln', Q(a + c, a)]]), L([Q(1, c + 1), ['ln', Q(a + c + 1, a)]]), L([Q(1, c), ['ln', Q(a + 2 * c, a)]]), lq(Q(1, a + c))], {
          chk, figure: limN(sumK(frac(1, den))),
          explain: `${nb(frac(1, den) + ' = ' + frac(1, NN) + ' × ' + frac(1, a + ' + ' + kn(c)))}이므로 닫힌구간 ${iv(`0`, `${c}`)} ${NN}등분한 것으로 보면 극한값은 ${c === 1 ? '' : frac(1, c)}${intg(0, c, frac(1, a + ' + ' + X), 'x')} = ${lH(right)}이다.`,
          rule: 'log0' });
      }
      const a = d.pick([1, 2, 3, 4]), right = L([Q(1, 2), ['ln', Q(a + 1, a)]]), chk = integ((x) => x / (a + x * x), 0, 1);
      const den = (a === 1 ? '' : a) + NN + sup(2) + ' + ' + KK + sup(2);
      return pickC(d, askLim, right, [L([1, ['ln', Q(a + 1, a)]]), L([Q(1, 2), ['ln', a + 1]]), L([2, ['ln', Q(a + 1, a)]]), L([Q(1, 2), ['ln', Q(a, a + 1)]]), L([Q(1, 2 * a), ['ln', Q(a + 1, a)]])], {
        chk, figure: limN(sumK(frac(KK, den))),
        explain: `${nb(frac(KK, den) + ' = ' + frac(1, NN) + ' × ' + frac(kn(1), a + ' + (' + kn(1) + ')' + sup(2)))}이므로 극한값은 ${intg(0, 1, frac(X, a + ' + ' + X + sup(2)), 'x')} = ${evl(frac(1, 2) + fn('ln') + '(' + a + ' + ' + X + sup(2) + ')', 0, 1)} = ${lH(right)}이다.`,
        rule: 'log1' });
    }, { count: 2 }),
    T('riem-ln', '로그함수가 든 합의 극한', '①7', (d) => {
      const a = d.pick([1, 2]), c = d.pick([1, 2]);
      const right = ladd(L([Q(a + c, c), ['ln', a + c]], [Q(-a, c), ['ln', a]], [-1])), chk = integ(Math.log, a, a + c) / c;
      const noMinus = ladd(L([Q(a + c, c), ['ln', a + c]], [Q(-a, c), ['ln', a]]));
      return pickC(d, askLim, right, [noMinus, lsc(right, c), L([Q(1, c), ['ln', Q(a + c, a)]]), ladd(noMinus, lq(-c)), ladd(lsc(noMinus, c), lq(-c))], {
        chk, figure: limN(frac(1, NN) + sumK(nb(fn('ln') + '(' + (a === 1 ? '1' : a) + ' + ' + kn(c) + ')'))),
        explain: `닫힌구간 ${iv(`${a}`, `${a + c}`)} ${NN}등분한 것이므로 극한값은 ${c === 1 ? '' : frac(1, c)}${intg(a, a + c, ms('ln x'), 'x')}이다. ${nb(intg(null, null, ms('ln x'), 'x') + ' = ' + ms('x ln x - x + C', 'C'))}이므로 극한값은 ${lH(right)}이다.`,
        rule: 'ln' });
    }),
    T('riem-root', '근호가 든 합의 극한', '①8', (d, n) => {
      if (n === 0) {
        const m = d.int(0, 2), val = Q(2, 2 * m + 3);
        const body = m === 0 && d.bool() ? rt(frac(KK, NN + sup(3))) : frac((m === 0 ? '' : m === 1 ? KK : KK + sup(m)) + rt(KK), (m === 0 ? NN : NN + sup(m + 1)) + rt(NN));
        return qAns(askLim, val, {
          figure: limN(sumK(body)),
          explain: `${nb(body + ' = ' + frac(1, NN) + (m === 0 ? '' : '(' + kn(1) + ')' + (m === 1 ? '' : sup(m))) + rt(kn(1)))}이므로 극한값은 ${intg(0, 1, (m === 0 ? '' : m === 1 ? X : X + sup(m)) + rt(X), 'x')} = ${evl(frac(2, 2 * m + 3) + X + sup(m + 1) + rt(X), 0, 1)} = ${num(val)}이다.`,
          facts: { value: `2/(2*${m}+3)`, rule: 'root0' } });
      }
      const [a, c] = d.pick([[1, 1], [1, 3], [1, 8], [2, 2], [3, 1]]);
      const p32 = (s) => L([s, ['rt', s]]);                                                    // s^(3/2)
      const right = lsc(lsub(p32(a + c), p32(a)), Q(2, 3 * c)), chk = integ(Math.sqrt, a, a + c) / c;
      return pickC(d, askLim, right, [lsc(lsub(p32(a + c), p32(a)), Q(2, 3)), lsc(lsub(p32(a + c), p32(a)), Q(3, 2 * c)), lsc(lsub(L([1, ['rt', a + c]]), L([1, ['rt', a]])), Q(2, c)), lsc(p32(a + c), Q(2, 3 * c)), lsc(lsub(p32(a + c), p32(a)), Q(1, 3 * c))], {
        chk, figure: limN(frac(1, NN) + sumK(rt(a + ' + ' + kn(c)))),
        explain: `닫힌구간 ${iv(`${a}`, `${a + c}`)} ${NN}등분한 것이므로 극한값은 ${c === 1 ? '' : frac(1, c)}${intg(a, a + c, rt(X), 'x')} = ${c === 1 ? '' : frac(1, c)}${evl(frac(2, 3) + X + rt(X), a, a + c)} = ${lH(right)}이다.`,
        rule: 'root1' });
    }, { count: 2 }),
    T('riem-subst', 'x√(1 ± x²) 꼴의 합의 극한 — 치환적분', '①9', (d, n) => {
      const p32 = (s) => L([s, ['rt', s]]);
      if (n === 0) {
        const [s, a] = d.pick([[1, 1], [1, 3], [1, 8], [-1, 1]]), u = 1 + s * a;
        const right = lsc(ladd(p32(u), lq(-1)), Q(1, 3 * s * a)), chk = integ((x) => x * Math.sqrt(1 + s * a * x * x), 0, 1);
        const inner = NN + sup(2) + (s > 0 ? ' + ' : ' ' + MINUS + ' ') + (a === 1 ? '' : a) + KK + sup(2);
        return pickC(d, askLim, right, [lsc(ladd(p32(u), lq(-1)), Q(2, 3 * s * a)), lsc(ladd(p32(u), lq(-1)), Q(1, 3)), lsc(p32(u), Q(1, 3 * s * a)), lsc(ladd(p32(u), lq(-1)), Q(1, 2 * s * a)), lsc(ladd(L([1, ['rt', u]]), lq(-1)), Q(1, 3 * s * a))], {
          chk, figure: limN(frac(1, NN + sup(3)) + sumK(KK + rt(inner))),
          explain: `${nb(frac(KK + rt(inner), NN + sup(3)))} = ${nb(frac(1, NN) + ' × ' + kn(1) + rt('1 ' + (s > 0 ? '+' : MINUS) + ' ' + (a === 1 ? '' : a) + '(' + kn(1) + ')' + sup(2)))}이므로 극한값은 ${intg(0, 1, X + rt('1 ' + (s > 0 ? '+' : MINUS) + ' ' + (a === 1 ? '' : a) + X + sup(2)), 'x')}이다. ${nb('1 ' + (s > 0 ? '+' : MINUS) + ' ' + (a === 1 ? '' : a) + X + sup(2) + ' = ' + TT)}로 치환하면 ${lH(right)}이다.`,
          rule: 'subst0' });
      }
      const m = d.pick([2, 3]), c = d.pick([3 * m * m, m === 2 ? 6 : 9]), u = m * m + 1;
      const right = lsc(ladd(p32(u), lq(-1)), Q(c, 3 * m * m)), chk = (c / (m * m)) * integ((x) => x * Math.sqrt(x * x + 1), 0, m);
      return pickC(d, askLim, right, [lsc(ladd(p32(u), lq(-1)), Q(c, 3 * m)), lsc(ladd(p32(u), lq(-1)), Q(c, 3)), lsc(p32(u), Q(c, 3 * m * m)), lsc(ladd(p32(u), lq(-1)), Q(c, 6 * m * m)), lsc(ladd(p32(m * m), lq(-1)), Q(c, 3 * m * m))], {
        chk, figure: limN(sumK(frac(c + KK + rt(m * m + KK + sup(2) + ' + ' + NN + sup(2)), NN + sup(3)))),
        explain: `${nb(V('x') + sub(KK) + ' = ' + kn(m))}로 놓으면 닫힌구간 ${iv(`0`, `${m}`)} ${NN}등분한 것이고 ${nb(frac(c + KK + rt(m * m + KK + sup(2) + ' + ' + NN + sup(2)), NN + sup(3)))} = ${nb(frac(c, m * m) + V('x') + sub(KK) + rt(V('x') + sub(KK) + sup(2) + ' + 1') + 'Δ' + X)}이다. 극한값은 ${frac(c, m * m)}${intg(0, m, X + rt(X + sup(2) + ' + 1'), 'x')} = ${lH(right)}이다.`,
        rule: 'subst1' });
    }, { count: 2 }),
    T('riem-fgiven', '함수를 준 합 Σ 1/(n + k)·f(1 + k/n)의 극한', '①13', (d, n) => {
      const body = sumK(frac(1, ms('n + k')) + V('f') + '(1 + ' + kn(1) + ')');
      if (n === 0) {
        const a = d.pick([1, 2, 3, 4]), right = L([Q(1, a), ['ln', Q(2 * (1 + a), 2 + a)]]), chk = integ((x) => 1 / (x * (x + a)), 1, 2);
        const fx = nb(V('f') + '(' + X + ') = ' + frac(1, ms('x + ' + a)));
        return pickC(d, `함수 ${fx}에 대하여 다음 극한값은?`, right, [L([1, ['ln', Q(2 * (1 + a), 2 + a)]]), L([1, ['ln', Q(2 + a, 1 + a)]]), L([Q(1, a), ['ln', Q(2 + a, 1 + a)]]), L([Q(1, a), ['ln', 2]]), L([Q(1, a), ['ln', Q(2 + a, 2 * (1 + a))]])], {
          chk, figure: limN(body),
          explain: `${nb(frac(1, ms('n + k')) + ' = ' + frac(1, NN) + ' × ' + frac(1, '1 + ' + kn(1)))}이므로 극한값은 ${intg(1, 2, frac(V('f') + '(' + X + ')', X), 'x')} = ${intg(1, 2, frac(1, X + '(' + ms('x + ' + a) + ')'), 'x')} = ${frac(1, a)}${intg(1, 2, '(' + frac(1, X) + ' ' + MINUS + ' ' + frac(1, ms('x + ' + a)) + ')', 'x')} = ${lH(right)}이다.`,
          rule: 'fgiven0' });
      }
      const m = d.pick([1, 2, 3]);
      const right = m === 1 ? L([1, ['e', 2]], [-1, ['e', 1]]) : m === 2 ? L([1, ['e', 2]]) : L([2, ['e', 2]], [-1, ['e', 1]]);
      const chk = integ((x) => x ** (m - 1) * Math.exp(x), 1, 2);
      const fx = nb(V('f') + '(' + X + ') = ' + X + (m === 1 ? '' : sup(m)) + V('e') + sup(X));
      const wrong = [L([1, ['e', 2]]), L([2, ['e', 2]], [-1, ['e', 1]]), L([1, ['e', 2]], [-1, ['e', 1]]), L([1, ['e', 2]], [1, ['e', 1]]), L([2, ['e', 2]]), L([3, ['e', 2]], [-1, ['e', 1]]), L([1, ['e', 1]])];
      return pickC(d, `함수 ${fx}에 대하여 다음 극한값은?`, right, wrong, {
        chk, figure: limN(body),
        explain: `${nb(frac(1, ms('n + k')) + ' = ' + frac(1, NN) + ' × ' + frac(1, '1 + ' + kn(1)))}이므로 극한값은 ${intg(1, 2, frac(V('f') + '(' + X + ')', X), 'x')} = ${intg(1, 2, (m === 1 ? '' : m === 2 ? X : X + sup(2)) + V('e') + sup(X), 'x')} = ${lH(right)}이다.${m === 1 ? '' : ' (부분적분)'}`,
        rule: 'fgiven1' });
    }, { count: 2 }),
    T('riem-forms', '같은 극한을 나타내는 정적분 — 옳은 것 모두', '①14', (d) => {
      const kind = d.pick(['sin3', 'cos2', 'ln']), a = d.pick([1, 2]), c = d.pick([2, 3]);
      const g = kind === 'sin3' ? (x) => Math.sin(x) ** 3 : kind === 'cos2' ? (x) => Math.cos(x) ** 2 : Math.log;
      const gh = (arg) => (kind === 'sin3' ? trig('sin', arg, 3) : kind === 'cos2' ? trig('cos', arg, 2) : nb(fn('ln') + (arg[0] === '(' ? '' : ' ') + arg));
      const target = integ((x) => g(a + c * x), 0, 1);
      // coef: 1(그대로), 'mul'(앞에 c 를 곱함), 'inv'(앞에 1/c 을 곱함) — 글과 값을 함께 짓는다.
      const I0 = (lo, hi, body, coef) => (coef === 'mul' ? String(c) : coef === 'inv' ? frac(1, c) : '') + intg(lo, hi, body, 'x');
      const A = [{ h: I0(0, 1, gh(`(${a} + ${c}` + X + ')'), 1), v: target }, { h: I0(0, 1, gh(`(${a} + ${c}` + X + ')'), 'mul'), v: c * target }];
      const Bv = [{ h: I0(0, c, gh('(' + a + ' + ' + X + ')'), 'inv'), v: integ((x) => g(a + x), 0, c) / c }, { h: I0(0, 1, gh('(' + a + ' + ' + X + ')'), 'inv'), v: integ((x) => g(a + x), 0, 1) / c }, { h: I0(0, c, gh('(' + a + ' + ' + X + ')'), 1), v: integ((x) => g(a + x), 0, c) }];
      const Cv = [{ h: I0(a, a + c, gh(X), 'inv'), v: integ(g, a, a + c) / c }, { h: I0(a, a + c, gh(X), 1), v: integ(g, a, a + c) }, { h: I0(a, c, gh(X), 'inv'), v: integ(g, a, c) / c }];
      const pick = (list) => (d.bool() ? list[0] : d.pick(list.slice(1)));
      const stmts = d.shuffle([pick(A), pick(Bv), pick(Cv)]);
      const ok = stmts.map((s) => close(s.v, target)), GA = ['ㄱ', 'ㄴ', 'ㄷ'];
      if (!ok.some(Boolean)) return null;
      const subsets = [[0], [1], [2], [0, 1], [0, 2], [1, 2], [0, 1, 2]], key = (s) => s.join(','), rightKey = key(ok.map((t, i) => (t ? i : -1)).filter((i) => i >= 0));
      const right = subsets.find((s) => key(s) === rightKey), others = d.shuffle(subsets.filter((s) => s !== right)).slice(0, 4), list = d.shuffle([right].concat(others));
      const truth = list.map((s) => key(s) === rightKey);
      const text = `다음 극한값을 정적분으로 나타낸 것으로 옳은 것만을 &lt;보기&gt;에서 있는 대로 고른 것은?`;
      const figure = limN(frac(1, NN) + sumK(gh('(' + a + ' + ' + kn(c) + ')'))) + '<div class="mb-lines">' + stmts.map((s, i) => `<div><b>${GA[i]}.</b> ${s.h}</div>`).join('') + '</div>';
      return C(text, list.map((s) => s.map((i) => GA[i]).join(', ')), list.indexOf(right), {
        figure,
        explain: `${nb(V('x') + sub(KK) + ' = ' + kn(1))}로 보면 ${intg(0, 1, gh('(' + a + ' + ' + c + X + ')'), 'x')}, ${nb(V('x') + sub(KK) + ' = ' + kn(c))}로 보면 ${nb(frac(1, c) + intg(0, c, gh('(' + a + ' + ' + X + ')'), 'x'))}, ${nb(V('x') + sub(KK) + ' = ' + a + ' + ' + kn(c))}로 보면 ${nb(frac(1, c) + intg(a, a + c, gh(X), 'x'))}이다. Δ${X}가 ${frac(c, NN)}이면 앞에 ${frac(1, c)}을 곱해야 한다. 옳은 것은 ${right.map((i) => GA[i]).join(', ')}이다.`,
        facts: { truth, want: true, check: stmts.map((s) => s.v).concat([target]) } });
    }),
    T('riem-ineq', '직사각형 넓이의 합과 정적분으로 부등식 보이기(빈칸)', '①15', (d) => {
      const left = d.bool(), n0 = 7;
      const H1 = ms('1 + ') + frac(1, 2) + ' + ' + frac(1, 3) + ' + ⋯ + ' + frac(1, NN), H2 = frac(1, 2) + ' + ' + frac(1, 3) + ' + ⋯ + ' + frac(1, ms('n + 1'));
      const vH1 = Array.from({ length: n0 }, (_, i) => 1 / (i + 1)).reduce((s, x) => s + x, 0), vH2 = vH1 - 1 + 1 / (n0 + 1);
      const rectSum = Array.from({ length: n0 }, (_, i) => 1 / (left ? i + 1 : i + 2)).reduce((s, x) => s + x, 0), area = integ((x) => 1 / x, 1, n0 + 1);
      // 보기가 길어지지 않게 후보 식을 ㉠~㉣로 그림 칸에 적고 보기에는 기호만 쓴다.
      const ga = [{ h: '㉠', v: vH1 }, { h: '㉡', v: vH2 }], na = [{ h: '㉢', v: Math.log(n0 + 1) }, { h: '㉣', v: Math.log(n0) }], da = [{ h: '크다', bigger: true }, { h: '작다', bigger: false }];
      const all = []; for (const p of ga) for (const q of na) for (const r of da) all.push({ p, q, r, ok: close(p.v, rectSum) && close(q.v, area) && (rectSum > area) === r.bigger });
      if (all.filter((o) => o.ok).length !== 1) return null;
      const right = all.find((o) => o.ok), list = d.shuffle([right].concat(d.shuffle(all.filter((o) => !o.ok)).slice(0, 4)));
      const ineq = left ? nb(fn('ln') + '(' + ms('n + 1') + ') &lt; ' + H1) : nb(H2 + ' &lt; ' + fn('ln') + '(' + ms('n + 1') + ')');
      const text = `다음은 자연수 ${NN}에 대하여 부등식 ${ineq}이 성립함을 보이는 과정이다. (가), (나), (다)에 알맞은 것은?`;
      const figure = `<div class="mb-lines"><div>곡선 ${yEq(frac(1, X))} 아래에서 닫힌구간 ${iv(`1`, `${ms('n + 1')}`)} ${NN}등분하고, 각 소구간의 ${left ? '왼쪽' : '오른쪽'} 끝 점의 함숫값을 높이로 하는 직사각형을 만들면 직사각형의 넓이의 합은 (가)이다.</div><div>곡선 ${jh(yEq(frac(1, X)), '과/와')} ${X}축 및 두 직선 ${xEq(1)}, ${jh(xEq(ms('n + 1')), '으로/로')} 둘러싸인 도형의 넓이는 (나)이다.</div><div>함수 ${jh(yEq(frac(1, X)), '은/는')} 감소하므로 직사각형의 넓이의 합은 이 도형의 넓이보다 (다).</div><div>㉠ ${H1}　㉡ ${H2}</div><div>㉢ ${nb(fn('ln') + '(' + ms('n + 1') + ')')}　㉣ ${nb(fn('ln') + ' ' + NN)}</div></div>`;
      return C(text.replace('알맞은 것은?', '알맞은 것을 차례로 나열한 것은?'), list.map((o) => `${o.p.h}, ${o.q.h}, ${o.r.h}`), list.indexOf(right), {
        figure,
        explain: `${left ? '왼쪽' : '오른쪽'} 끝 점의 높이는 ${left ? `1, ${frac(1, 2)}, …, ${frac(1, NN)}` : `${frac(1, 2)}, ${frac(1, 3)}, …, ${frac(1, ms('n + 1'))}`}이고 가로는 모두 1이므로 넓이의 합은 ${right.p.h === '㉠' ? H1 : H2}(${right.p.h})이다. 도형의 넓이는 ${intg(1, ms('n + 1'), frac(1, X), 'x')} = ${nb(fn('ln') + '(' + ms('n + 1') + ')')}(㉢)이다. 감소함수이므로 ${left ? '왼쪽 끝 점의 직사각형은 곡선 위로 솟아 넓이의 합이 더 크다' : '오른쪽 끝 점의 직사각형은 곡선 아래에 들어가 넓이의 합이 더 작다'}.`,
        facts: { truth: list.map((o) => o.ok), want: true, check: [rectSum, area] } });
    })
  ];

  // ═══ 나. 곡선과 x축 사이의 넓이 ═══
  const askArea = (cur, tail) => `곡선 ${jh(yEq(cur), '과/와')} ${tail} 둘러싸인 도형의 넓이는?`;
  const lines2 = (a, b) => `${X}축 및 두 직선 ${xEq(a)}, ${jh(xEq(b), '으로/로')}`;
  const xarea = [
    T('xarea-one', '곡선과 x축 및 직선으로 둘러싸인 넓이 — 한 조각', '①16', (d, n) => {
      if (n === 0) {
        const a = d.pick([1, 2]), m = d.pick([2, 4, 5]), c = d.pick([0, 0, 1, 2, 3]), Xe = c + m * m, val = Q(2 * a * m ** 3, 3);
        const cur = (a === 1 ? '' : a) + rt(c === 0 ? X : ms('x - ' + c));
        return qAns(askArea(cur, `${X}축 및 직선 ${jh(xEq(Xe), '으로/로')}`), val, {
          explain: `곡선은 ${xEq(c)}에서 ${X}축과 만나고 그 오른쪽에서 ${X}축 위에 있으므로 넓이는 ${intg(c, Xe, cur, 'x')} = ${evl(frac(2 * a, 3) + pw(c === 0 ? X : '(' + ms('x - ' + c) + ')', [3, 2]), c, Xe)} = ${num(val)}이다.`,
          facts: { value: `2*${a}*(${Xe}-${c})**(3/2)/3`, rule: 'one0' } });
      }
      if (n === 1) {
        const b = d.pick([2, 3, 5, 'e']), c = d.pick([2, 3]);
        if (b === 'e') {
          const right = L([1, ['e', c]], [-1]), chk = integ(Math.exp, 0, c);
          return pickC(d, askArea(V('e') + sup(X), `${X}축, ${YY}축 및 직선 ${jh(xEq(c), '으로/로')}`), right, [L([1, ['e', c]]), L([1, ['e', c]], [1]), L([1, ['e', c + 1]], [-1]), L([Q(1, c + 1), ['e', c + 1]], [-1]), L([c, ['e', c]], [-1])], {
            chk, explain: `넓이는 ${intg(0, c, V('e') + sup(X), 'x')} = ${evl(V('e') + sup(X), 0, c)} = ${lH(right)}이다.`, rule: 'one1' });
        }
        // (bᶜ − 1)/ln b 는 ln b 를 분모에 두어 적는다 — 값 체계에는 1/ln b 인수가 없어 보기를 따로 짓는다.
        const v = b ** c - 1, chk = integ((x) => b ** x, 0, c), pw1 = Q(b ** (c + 1) - b * (c + 1), c + 1);
        const list = [{ h: frac(v, lnH(b)), v: v / Math.log(b) }, { h: frac(b ** c, lnH(b)), v: b ** c / Math.log(b) }, { h: nb(v + ' ' + lnH(b)), v: v * Math.log(b) }, { h: String(v), v }, { h: num(pw1), v: fl(pw1) }];
        if (!close(list[0].v, chk)) throw new Error('닫힌 꼴과 수치 적분이 다르다');
        const order = d.shuffle(list), truth = order.map((o) => close(o.v, chk));
        if (truth.filter(Boolean).length !== 1) return null;
        return C(askArea(b + sup(X), `${X}축, ${YY}축 및 직선 ${jh(xEq(c), '으로/로')}`), order.map((o) => o.h), order.indexOf(list[0]), {
          explain: `${nb(intg(null, null, b + sup(X), 'x') + ' = ' + frac(b + sup(X), lnH(b)) + ' + ' + V('C'))}이므로 넓이는 ${intg(0, c, b + sup(X), 'x')} = ${evl(frac(b + sup(X), lnH(b)), 0, c)} = ${list[0].h}이다.`,
          facts: { truth, want: true, check: [chk], rule: 'one1' } });
      }
      if (n === 2) {
        const kind = d.pick(['sin', 'cos', 'inv']), k = d.pick([1, 2, 3, 4]);
        if (kind === 'inv') {
          const M0 = d.pick([2, 3, 5]), right = L([k, ['ln', M0]]), chk = integ((x) => k / x, 1, M0);
          return pickC(d, askArea(frac(k, X), lines2(1, M0)), right, [L([k, ['ln', M0 - 1]]), L([1, ['ln', M0]]), lq(Q(k * (M0 * M0 - 1), 2 * M0 * M0)), L([k, ['ln', M0]], [-k]), L([Q(k, 2), ['ln', M0]])], {
            chk, explain: `닫힌구간 [1, ${M0}]에서 ${nb(frac(k, X) + ' &gt; 0')}이므로 넓이는 ${intg(1, M0, frac(k, X), 'x')} = ${evl(k + fn('ln') + ' ' + X, 1, M0)} = ${lH(right)}이다.`, rule: 'one2' });
        }
        const m = d.pick([3, 4, 6]), end = Q(1, m);
        const right = kind === 'sin' ? lsc(lsub(lq(1), cosL(end)), k) : lsc(sinL(end), k), other = kind === 'sin' ? lsc(sinL(end), k) : lsc(lsub(lq(1), cosL(end)), k);
        const chk = integ(kind === 'sin' ? (x) => k * Math.sin(x) : (x) => k * Math.cos(x), 0, Math.PI / m);
        const cur = (k === 1 ? '' : k) + trig(kind, X);
        return pickC(d, `닫힌구간 [0, ${piH(end)}]에서 ${askArea(cur, `${X}축 및 직선 ${jh(xEq(piH(end)), '으로/로')}`)}`.replace('에서 곡선', '에서 곡선'), right, [other, lneg(right), lsc(right, 2), lsc(other, 2), lq(k)], {
          chk, explain: `닫힌구간 [0, ${piH(end)}]에서 ${nb(cur + ' ≥ 0')}이므로 넓이는 ${intg(0, piH(end), cur, 'x')} = ${lH(right)}이다.`, rule: 'one2' });
      }
      // 구간에서 곡선이 x축 아래에 있다: y = a/x − 1 과 x축, x = a·eᵐ (x축과 만나는 x = a 가 왼쪽 끝)
      const a = d.pick([1, 2, 3]), m = d.pick([2, 3, 4, 6]);
      const right = L([a, ['e', m]], [-a * (1 + m)]), chk = integ((x) => Math.abs(a / x - 1), a, a * Math.exp(m));
      const cur = frac(a, X) + ' ' + MINUS + ' 1', Xe = (a === 1 ? '' : a) + eH(Q(m));
      return pickC(d, askArea(cur, `${X}축 및 직선 ${jh(xEq(Xe), '으로/로')}`), right, [L([-a, ['e', m]], [a * (1 + m)]), L([a, ['e', m]], [-a * (m - 1)]), L([a, ['e', m]], [-a]), L([a, ['e', m]], [-a * m]), L([1, ['e', m]], [-(1 + m)])], {
        chk, explain: `곡선은 ${xEq(a)}에서 ${X}축과 만나고 ${nb(X + ' ≥ ' + a)}에서 ${nb(YY + ' ≤ 0')}이므로 넓이는 ${MINUS}${intg(a, Xe, '(' + cur + ')', 'x')} = ${MINUS}${evl((a === 1 ? '' : a) + fn('ln') + ' ' + X + ' ' + MINUS + ' ' + X, a, Xe)} = ${lH(right)}이다.`, rule: 'one3' });
    }, { count: 4 }),
    T('xarea-sign', '곡선과 x축 및 두 직선으로 둘러싸인 넓이 — 구간 안에서 부호가 바뀜', '①17', (d, n) => {
      if (n === 0) {
        const p = d.pick([1, 2]), q = d.pick([1, 2, 3]);
        const right = L([1, ['e', q]], [1, ['e', -p]], [p - q - 2]), chk = integ((x) => Math.abs(Math.exp(x) - 1), -p, q);
        const cur = V('e') + sup(X) + ' ' + MINUS + ' 1';
        return pickC(d, askArea(cur, lines2(-p, q)), right, [L([1, ['e', q]], [-1, ['e', -p]], [-p - q]), L([1, ['e', q]], [1, ['e', -p]], [-2]), L([1, ['e', q]], [-1, ['e', -p]], [p - q]), L([1, ['e', q]], [1, ['e', -p]], [p + q - 2]), L([1, ['e', q]], [1, ['e', -p]], [-p - q])], {
          chk, explain: `닫힌구간 [${num(-p)}, 0]에서 ${nb(cur + ' ≤ 0')}, [0, ${q}]에서 ${nb(cur + ' ≥ 0')}이므로 넓이는 ${MINUS}${intg(-p, 0, '(' + cur + ')', 'x')} + ${intg(0, q, '(' + cur + ')', 'x')} = ${lH(right)}이다.`, rule: 'sign0' });
      }
      if (n === 1) {
        const p = d.pick([1, 2]), q = d.pick([1, 2]);
        const right = L([q - 1, ['e', q]], [2], [-(p + 1), ['e', -p]]), chk = integ((x) => Math.abs(Math.log(x)), Math.exp(-p), Math.exp(q));
        const signed = L([q - 1, ['e', q]], [p + 1, ['e', -p]]);
        return pickC(d, askArea(ms('ln x'), lines2(frac(1, eH(Q(p))), eH(Q(q)))), right, [signed, L([q - 1, ['e', q]], [-(p + 1), ['e', -p]]), L([q, ['e', q]], [2], [-p, ['e', -p]]), L([q - 1, ['e', q]], [1], [-(p + 1), ['e', -p]]), L([q + 1, ['e', q]], [2], [-(p - 1), ['e', -p]])], {
          chk, explain: `닫힌구간 [${frac(1, eH(Q(p)))}, 1]에서 ${nb(ms('ln x') + ' ≤ 0')}, [1, ${eH(Q(q))}]에서 ${nb(ms('ln x') + ' ≥ 0')}이고 ${nb(intg(null, null, ms('ln x'), 'x') + ' = ' + ms('x ln x - x + C', 'C'))}이므로 넓이는 ${MINUS}${intg(frac(1, eH(Q(p))), 1, ms('ln x'), 'x')} + ${intg(1, eH(Q(q)), ms('ln x'), 'x')} = ${lH(right)}이다.`, rule: 'sign1' });
      }
      if (n === 2) {
        const kind = d.pick(['cos', 'sin', 'tan']);
        if (kind === 'tan') {
          const [al, be] = d.pick([[Q(1, 4), Q(1, 4)], [Q(1, 3), Q(1, 4)], [Q(1, 4), Q(1, 3)], [Q(1, 3), Q(1, 3)]]);
          const lnOf = (q) => (q.q === 4 ? Q(1, 2) : Q(1));                                   // −ln cos θ = (1/2)ln 2 (θ = π/4), ln 2 (θ = π/3)
          const right = L([qadd(lnOf(al), lnOf(be)), ['ln', 2]]), chk = integ((x) => Math.abs(Math.tan(x)), -fl(al) * Math.PI, fl(be) * Math.PI);
          const signedV = L([qsub(lnOf(be), lnOf(al)), ['ln', 2]]);
          return pickC(d, askArea(trig('tan', X), lines2(piH(qneg(al)), piH(be))), right, [signedV.t.length ? signedV : L([Q(1, 4), ['ln', 2]]), lsc(right, 2), lsc(right, Q(1, 2)), lq(qadd(lnOf(al), lnOf(be))), L([qadd(lnOf(al), lnOf(be)), ['ln', 3]])], {
            chk, explain: `${trig('tan', X)}는 ${X} = 0에서 부호가 바뀌고 ${nb(intg(null, null, trig('tan', X), 'x') + ' = ' + MINUS + fn('ln') + '|' + trig('cos', X) + '| + ' + V('C'))}이다. 넓이는 ${MINUS}${intg(piH(qneg(al)), 0, trig('tan', X), 'x')} + ${intg(0, piH(be), trig('tan', X), 'x')} = ${lH(right)}이다.`, rule: 'sign2' });
        }
        const k = d.pick([1, 2, 3]);
        let al, be, right, signedV;
        if (kind === 'cos') { al = d.pick([Q(0), Q(1, 6), Q(1, 3)]); be = d.pick([Q(2, 3), Q(3, 4), Q(5, 6), Q(1)]); right = lsc(lsub(lsub(lq(2), sinL(al)), sinL(be)), k); signedV = lsc(lsub(sinL(be), sinL(al)), k); }
        else { al = d.pick([Q(1, 3), Q(1, 2), Q(2, 3)]); be = d.pick([Q(4, 3), Q(5, 4), Q(3, 2)]); right = lsc(ladd(lq(2), cosL(al), cosL(be)), k); signedV = lsc(lsub(cosL(al), cosL(be)), k); }
        const g = kind === 'cos' ? Math.cos : Math.sin, chk = integ((x) => Math.abs(k * g(x)), fl(al) * Math.PI, fl(be) * Math.PI), zero = kind === 'cos' ? Q(1, 2) : Q(1);
        const cur = (k === 1 ? '' : k) + trig(kind, X);
        return pickC(d, askArea(cur, lines2(piH(al), piH(be))), right, [signedV, lneg(signedV), lsc(right, 2), lsc(right, Q(1, 2)), ladd(right, lq(k))], {
          chk, explain: `곡선은 ${xEq(piH(zero))}에서 ${X}축과 만나 부호가 바뀌므로 넓이는 ${kind === 'cos' ? '' : ''}${intg(piH(al), piH(zero), cur, 'x')} ${MINUS} ${intg(piH(zero), piH(be), cur, 'x')} = ${lH(right)}이다.`, rule: 'sign2' });
      }
      // y = A sin x + B cos x = 2 sin(x + φ): x축과의 교점을 tan 으로 구한다.
      const [Ah, Bh, phi] = d.pick([[ms('sin x') + ' + ' + rt(3) + ms(' cos x'), null, Q(1, 3)], [rt(3) + ms(' sin x') + ' + ' + ms('cos x'), null, Q(1, 6)], [ms('sin x') + ' ' + MINUS + ' ' + rt(3) + ms(' cos x'), null, Q(-1, 3)], [rt(3) + ms(' sin x') + ' ' + MINUS + ' ' + ms('cos x'), null, Q(-1, 6)]]);
      void Bh;
      const x0 = qsub(Q(1), phi);                                                               // x + φ = π
      const al = qsub(x0, d.pick([Q(1, 3), Q(1, 2), Q(2, 3)])), be = qadd(x0, d.pick([Q(1, 3), Q(1, 2), Q(2, 3)]));
      if (fl(al) < 0) return null;
      const F = (q) => lsc(cosL(qadd(q, phi)), -2);                                             // ∫ 2 sin(x + φ) dx = −2cos(x + φ)
      const p1 = lsub(F(x0), F(al)), p2 = lsub(F(be), F(x0)), right = lsub(p1, p2), signedV = ladd(p1, p2);
      const chk = integ((x) => Math.abs(2 * Math.sin(x + fl(phi) * Math.PI)), fl(al) * Math.PI, fl(be) * Math.PI);
      return pickC(d, askArea(Ah, lines2(piH(al), piH(be))), right, [signedV, lneg(signedV), lsc(right, Q(1, 2)), lsc(right, 2), p1, lneg(p2)], {
        chk, explain: `${nb(Ah + ' = 0')}에서 ${nb(trig('tan', X) + ' = ' + (phi.q === 3 ? (phi.p > 0 ? MINUS : '') + rt(3) : (phi.p > 0 ? MINUS : '') + frac(rt(3), 3)))}이므로 구간 안의 교점은 ${xEq(piH(x0))}이고, 이 점의 왼쪽에서 곡선은 ${X}축 위, 오른쪽에서 아래에 있다. 넓이는 ${intg(piH(al), piH(x0), '(' + Ah + ')', 'x')} ${MINUS} ${intg(piH(x0), piH(be), '(' + Ah + ')', 'x')} = ${lH(right)}이다.`, rule: 'sign3' });
    }, { count: 4 }),
    T('xarea-poly', '다항함수와 x축 및 두 직선으로 둘러싸인 넓이(부호가 바뀜)', '①18', (d) => {
      const k = d.pick([1, 2, 4]), a = d.pick([Q(1, 2), Q(1), Q(2)]), b = d.pick([1, 2, 3]);
      const val = qmul(Q(k, 4), qadd(qmul(qmul(a, a), qmul(a, a)), Q(b ** 4)));
      if (isInt(val)) return null;
      const cur = (k === 1 ? '' : k) + X + sup(3);
      return qAns(askArea(cur, lines2(num(qneg(a)), b)), val, {
        explain: `닫힌구간 [${num(qneg(a))}, 0]에서 ${nb(cur + ' ≤ 0')}, [0, ${b}]에서 ${nb(cur + ' ≥ 0')}이므로 넓이는 ${MINUS}${intg(num(qneg(a)), 0, cur, 'x')} + ${intg(0, b, cur, 'x')} = ${num(qmul(Q(k, 4), qmul(qmul(a, a), qmul(a, a))))} + ${num(Q(k * b ** 4, 4))} = ${num(val)}이다.`,
        facts: { value: `${k}*(${js(a)}**4+${b}**4)/4` } });
    }),
    T('xarea-subst', '치환적분이 필요한 곡선과 x축의 넓이', '①19', (d, n) => {
      if (n === 0) {
        const a = d.pick([1, 2, 3]), b = d.pick([1, 2, 3]), val = Q(14 * a + 9 * b, 6);
        if (isInt(val)) return null;
        const cur = '(' + (a === 1 ? '' : a) + trig('sec', X, 3) + ' + ' + (b === 1 ? '' : b) + trig('sec', X, 2) + ') ' + trig('tan', X);
        return qAns(askArea(cur, lines2(0, piH(Q(1, 3)))), val, {
          explain: `닫힌구간 [0, ${piH(Q(1, 3))}]에서 곡선은 ${X}축 위에 있다. ${nb(trig('sec', X) + ' = ' + TT)}로 놓으면 ${nb(trig('sec', X) + ' ' + trig('tan', X) + ' ' + V('d') + X + ' = ' + V('d') + TT)}, ${X}가 0에서 ${piH(Q(1, 3))}까지 변할 때 ${TT}는 1에서 2까지 변하므로 넓이는 ${intg(1, 2, '(' + (a === 1 ? '' : a) + TT + sup(2) + ' + ' + (b === 1 ? '' : b) + TT + ')', 't')} = ${num(val)}이다.`,
          facts: { value: `${a}*(2**3-1)/3+${b}*(2**2-1)/2`, rule: 'subst0' } });
      }
      const kind = d.pick(['sin', 'cos']), c = d.pick([1, 2, 3]), end = kind === 'sin' ? d.pick([Q(1, 6), Q(1, 2)]) : d.pick([Q(1, 3), Q(1, 2)]);
      const s2 = kind === 'sin' ? (end.q === 6 ? Q(1, 4) : Q(1)) : (end.q === 3 ? Q(1, 4) : Q(0));     // 끝에서 sin²x 또는 cos²x
      const val = kind === 'sin' ? qdiv(qadd(s2, Q(c)), Q(c)) : qdiv(Q(1 + c), qadd(s2, Q(c)));
      const cur = frac('2' + trig('sin', X) + ' ' + trig('cos', X), trig(kind, X, 2) + ' + ' + c);
      return qAns(`닫힌구간 [0, ${piH(end)}]에서 곡선 ${jh(yEq(cur), '과/와')} ${X}축 및 직선 ${jh(xEq(piH(end)), '으로/로')} 둘러싸인 도형의 넓이를 ${V('S')}라 할 때, ${V('e')}${sup(V('S'))}의 값은?`, val, {
        explain: `구간에서 곡선은 ${X}축 위에 있다. ${nb(trig(kind, X, 2) + ' + ' + c + ' = ' + V('u'))}로 놓으면 ${nb(V('d') + V('u') + ' = ' + (kind === 'sin' ? '' : MINUS) + '2' + trig('sin', X) + ' ' + trig('cos', X) + ' ' + V('d') + X)}이므로 ${nb(V('S') + ' = ')}${evl((kind === 'sin' ? '' : MINUS) + fn('ln') + '(' + trig(kind, X, 2) + ' + ' + c + ')', 0, piH(end))} = ${lnH(val)}이다. 따라서 ${nb(V('e') + sup(V('S')) + ' = ' + num(val))}이다.`,
        facts: { value: kind === 'sin' ? `(${js(s2)}+${c})/${c}` : `(1+${c})/(${js(s2)}+${c})`, rule: 'subst1' } });
    }, { count: 2 })
  ];

  B.addUnit({ id: '11-5-7', grade: 11, semester: 5, no: 7, title: '정적분의 활용', version: 1, groups: [
    { id: 'riem', title: '정적분과 급수의 합 사이의 관계', standard: S4, types: riem },
    { id: 'xarea', title: '곡선과 x축 사이의 넓이', standard: S5, types: xarea },
    { id: 'between', title: '두 곡선 사이의 넓이', standard: S5, types: [] },
    { id: 'special', title: '접선·역함수가 낀 넓이와 넓이로 상수 구하기', standard: S5, types: [] },
    { id: 'vol', title: '단면의 넓이로 부피 구하기', standard: S6, types: [] },
    { id: 'vbase', title: '곡선 아래 도형을 밑면으로 하는 입체의 부피', standard: S6, types: [] },
    { id: 'dist', title: '좌표평면 위에서 점이 움직인 거리', standard: S7, types: [] },
    { id: 'arc', title: '곡선의 길이', standard: S7, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
