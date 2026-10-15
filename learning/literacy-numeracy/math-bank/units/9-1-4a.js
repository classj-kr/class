// 중학교 3학년 1학기 4단원 이차방정식 — 단원 틀·도구와 앞쪽 묶음(이차방정식과 그 해, 인수분해를 이용한 풀이, 중근, 제곱근을 이용한 풀이).
// 수집해 둔 교과서 1종(미래엔 황선욱 2015)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 83꼴, 심화꼴 29꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/9-1-4/싣기_대조표.md 에 있다.
// (완전제곱식·근의 공식·여러 가지 이차방정식·두 근과 이차방정식·활용은 9-1-4b.js 에, 실력 문항은 9-1-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-20(이차방정식을 풀 수 있고, 이를 활용하여 문제를 해결할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·보기·풀이 과정·그림), 묻는 것(해·상수·개수·고르기·빈칸), 방정식의 꼴(인수분해 꼴, 정리가 필요한 꼴, 완전제곱식,
//    (x + p)² = q, 계수가 분수·소수, 괄호, 공통부분)이 다르면 따로 싣는다. 같은 꼴에서 수만 바꾼 유형은 만들지 않았다.
//  - 답: 해가 정수 둘이면 「x = [±][ ] 또는 x = [±][ ]」 두 칸(차례는 따지지 않는다), 근 하나(중근)는 「x = [±][ ]」 한 칸, 해가 ±k 꼴이면 「x = ±[ ]」.
//    근호가 든 해는 끼워 넣는 칸으로 받는다: p ± √q, p ± k√q, (p ± √q)/r, ±√q, ±k√q, ±k√q/r. 한 유형의 칸 모양은 씨앗·차례가 바뀌어도 같다
//    (칸 모양이 답을 흘리지 않게, 근호 앞의 수가 1인 꼴과 아닌 꼴, 분모가 있는 꼴과 없는 꼴은 서로 다른 유형으로 나누었다).
//    분수가 낀 두 해는 고르기로 낸다(과제 글). 상수의 값은 부호 단추가 붙은 칸으로 받는다. 개수·사람 수·길이·시간처럼 음수일 수 없는 답만 단추 없이 받는다.
//  - 용어: 교육과정의 용어(이차방정식, 근, 해, 중근, 근의 공식, 완전제곱식, 인수분해)를 쓴다. 「판별식」「실근」은 쓰지 않는다 — 근의 개수는 근의 공식의
//    근호 안의 수(b² − 4ac)가 양수·0·음수인지로 말한다(과제 글: 근의 개수는 자료에 있으면 싣는다).
//  - 근과 계수의 관계는 쓰지 않는다. 두 근의 합·곱·차는 해를 구해 셈한다. 두 근으로 이차방정식을 만들 때는 (x − α)(x − β)를 전개한다.
//  - 참·거짓은 손으로 적지 않고 코드로 가린다: 정리한 식의 차수, 대입한 값, 근호 안의 수의 부호, 고른 해의 집합.
//  - 꼴 목록에 적힌 원문 답지의 잘못(표43 상자 문제)은 따르지 않는다. 답은 모두 코드가 셈한다.
//  - 검사 근거: 해의 칸은 이차방정식을 정리한 계수 a, b, c 로 근의 공식을 다시 셈한 식(facts.calc)이고, 근호 밖으로 꺼낸 수·약분한 수처럼
//    글에 없는 수는 facts.unseen 에 밝힌다(seal 이 글에 보이지 않는 수를 찾아 밝히고, 밝히기로 한 수 밖의 수가 나오면 오류를 낸다).
//
// 뺀 것과 까닭(9-1-4b.js, 9-1-4c.js 의 것까지 여기에 모아 적는다)
//  - 상위 학년(고등학교) 내용: 절댓값이 든 이차방정식(심14), 미지수가 분모에 있는 방정식(심26 — 두 관으로 수조 채우기).
//  - 뜻 없는 셈: 두 방정식에 따로 대입해 구한 a + b(①8의 변형 기1-12·중04·표33 — ①8 한 방정식 꼴로 실음), 두 해의 곱 ab(①15의 변형 지대14),
//    두 근 A > B 의 3A + B(①19의 변형 기2-08 — 양수인 근 고르기와 같은 일), a + b·a − b 처럼 따로 구한 값을 더하기만 하는 물음은 값을 따로 묻도록 바꾸었다.
//  - 같은 일이어서 한 번만 실은 것(대조표의 「겹침」): 근의 공식으로 푸는 유리수 해(①39 — 답만 받으므로 인수분해 풀이 ①14와 같다),
//    두 근으로 만든 이차방정식 고르기(①56의 표10), 두 근의 곱이 다른 방정식의 근(①60의 지중17 — 두 근의 합 꼴과 같다), 리그전 경기 수(①70의 변형 — 대각선의 개수와 같은 식),
//    부등식 범위 안의 해(심5 — ①7과 같다), 중근 조건이 문자의 이차방정식(심15 — ①26과 같다), 세 방법으로 풀기(①14의 교 문5⑴).
//  - 서술형 전용: 편리한 풀이 방법 말하기(교 문5⑵), 유리수 해의 조건 말하기(교확12⑴), 황금비가 나타나는 곳 말하기(①83의 ⑶).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, gcd, lcm, Q, dc, qadd, qsub, qmul, qdiv, qneg, qabs, qpow, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, tag, fit, nz, pm, ansV, asQ, mono, poly, rt, grp, sqParts, claimQ } = B.kit.mid;
  const STD = '9수02-20';
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make: retry(make) }, more || {});
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];
  const GANA = ['㈎', '㈏', '㈐', '㈑'];
  const X = V('x'), X2 = V('x') + sup(2), X3 = V('x') + sup(3);
  const va = V('a'), vb = V('b'), vc = V('c'), vk = V('k'), vm = V('m'), vp = V('p'), vq = V('q');
  const iq = (n) => tx(Q(n));
  const sT = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));
  const gcd3 = (a, b, c) => gcd(gcd(Math.abs(a), Math.abs(b)), Math.abs(c));
  const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
  const squarefree = (n) => n >= 2 && sqParts(n)[0] === 1;

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(o.derived)가 아닌 수가 나오면 오류를 낸다(식을 잘못 적은 것).
  function seal(item) {
    // 0과 1은 식에 적지 않는 수(계수 1, 우변 0)라 늘 밝힐 수 있다.
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
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

  // ── 다항식(계수의 배열, 차수 차례) ──
  const trim = (p) => { const out = p.map(asQ); while (out.length > 1 && out[out.length - 1].p === 0) out.pop(); return out; };
  const P = (...cs) => trim(cs);
  const padd = (p, q) => trim(Array.from({ length: Math.max(p.length, q.length) }, (_, i) => qadd(asQ(p[i] || 0), asQ(q[i] || 0))));
  const pneg = (p) => p.map((c) => qneg(asQ(c)));
  const psub = (p, q) => padd(p, pneg(q));
  const pmul = (p, q) => { const out = Array.from({ length: p.length + q.length - 1 }, () => Q(0)); p.forEach((a, i) => q.forEach((b, j) => { out[i + j] = qadd(out[i + j], qmul(asQ(a), asQ(b))); })); return trim(out); };
  const pk = (p, k) => trim(p.map((c) => qmul(asQ(c), asQ(k))));
  const deg = (p) => { const t = trim(p); return t.length === 1 && t[0].p === 0 ? -1 : t.length - 1; };
  const pval = (p, x) => p.reduce((s, c, i) => qadd(s, qmul(asQ(c), qpow(asQ(x), i))), Q(0));
  const L1 = (a, b) => P(b, a);              // ax + b
  const VX = ['', X, X2, X3];
  // 다항식의 글(내림차순, 0인 항은 적지 않는다)
  const polyH = (p) => poly(trim(p).map((c, i) => [c, VX[i]]).reverse());
  const linH = (a, b) => poly([[a, X], [b, '']]);
  // 곱의 인수 하나: x 는 그대로, 나머지는 괄호에 넣는다.
  const fH = (a, b) => (a === 1 && b === 0 ? X : '(' + linH(a, b) + ')');
  const kH = (k) => (k === 1 ? '' : k === -1 ? MINUS : sT(k));
  // k × 인수들 (인수는 [a, b] = ax + b)
  const prodH = (k, list) => nb(kH(k) + list.map(([a, b]) => fH(a, b)).join(''));
  const prodP = (k, list) => list.reduce((acc, [a, b]) => pmul(acc, L1(a, b)), P(k));
  // k(ax + b)²
  const sqH = (k, a, b) => nb(kH(k) + '(' + linH(a, b) + ')' + sup(2));
  const sqP = (k, a, b) => pk(pmul(L1(a, b), L1(a, b)), k);
  const eqH = (L, R) => L + ' = ' + R;
  // 앞 항 뒤에 이어 적는 항들: 「 + 3x − 5」
  const moreH = (terms) => terms.map(([c, v]) => [asQ(c), v]).filter(([c]) => c.p !== 0).map(([c, v]) => (c.p < 0 ? ' ' + MINUS + ' ' : ' + ') + mono(qabs(c), v)).join('');
  // 식 뒤의 토씨: 식을 읽을 때 끝나는 소리에 맞춘다(제곱으로 끝나면 받침, 분수는 분자, 수는 그 수, x 는 받침 없음, m·n 은 받침).
  function endJ(h, pair) {
    const [withB, without] = pair.split('/'), s = String(h).replace(/(<\/span>|<\/i>|\s|&nbsp;)+$/g, '');
    if (/<\/sup>$/.test(s)) return pair === '으로/로' ? '으로' : withB;
    const fr = String(h).match(/<span class="mb-frac"><span>([^<]*?)<\/span><span class="mb-frac-bar">\/<\/span><span>[^<]*?<\/span><\/span>(?:<\/span>|\s)*$/);
    const t = fr ? fr[1] : stripH(h).replace(/[\s)\]]+$/g, ''), ch = t[t.length - 1];
    if (/\d/.test(ch)) return tail(Number(ch), pair);
    if (/[mnlr]/.test(ch)) return pair === '으로/로' ? (ch === 'l' ? '로' : '으로') : withB;
    return pair === '으로/로' ? '로' : without;
  }
  const ej = (h, pair) => h + endJ(h, pair);

  // ── 식의 너비 어림과 그리기 ──
  // 글자 너비(em)를 태그를 따라가며 어림한다: 분수는 분자와 분모 가운데 긴 쪽, 위첨자는 작게, 근호 기호는 0.6em.
  function emW(h) {
    const s = String(h); let pos = 0;
    const textW = (t) => { let w = 0; for (const ch of t.replace(/&[a-z]+;/g, 'o')) w += ch === ' ' ? 0.28 : /[가-힣㉠-㉯㈎-㈑]/.test(ch) ? 1.02 : /[(){}[\]|]/.test(ch) ? 0.38 : /[−+=±×÷<>≤≥]/.test(ch) ? 0.8 : 0.6; return w; };
    function inside() {
      let w = 0;
      while (pos < s.length) {
        if (s.startsWith('</', pos)) { pos = s.indexOf('>', pos) + 1; return w; }
        if (s[pos] === '<') {
          const end = s.indexOf('>', pos), tagText = s.slice(pos, end + 1); pos = end + 1;
          if (/\/>$/.test(tagText) || /^<br/i.test(tagText)) continue;
          const name = (tagText.match(/^<([a-z0-9]+)/i) || [, ''])[1].toLowerCase();
          if (name === 'svg') { pos = s.indexOf('</svg>', pos) + 6; w += 0.62; continue; }
          if (/class="mb-frac"/.test(tagText)) {
            const parts = [];
            while (pos < s.length && !s.startsWith('</', pos)) { if (s[pos] === '<') { pos = s.indexOf('>', pos) + 1; parts.push(inside()); } else pos += 1; }
            pos = s.indexOf('>', pos) + 1;
            w += Math.max(parts[0] || 0, parts[2] || 0) + 0.3; continue;
          }
          const inner = inside();
          if (/mb-sr|mb-frac-bar|position:absolute/.test(tagText)) continue;
          if (name === 'sup' || name === 'sub') { w += inner * 0.65; continue; }
          if (name === 'i' && !/mb-var/.test(tagText)) { w += inner + 0.24; continue; }
          w += inner; continue;
        }
        const next = s.indexOf('<', pos), chunk = s.slice(pos, next < 0 ? s.length : next); pos = next < 0 ? s.length : next; w += textW(chunk);
      }
      return w;
    }
    return inside();
  }
  // 그림 자리에 적는 식(휴대폰 너비에 맞게 글씨를 줄인다). 실제 사이트의 읽기 글꼴에서도 넘치지 않게 7 % 넉넉히 잡는다.
  const exq = (h) => '<span class="mb-expr"' + fit(1.07 * emW(h) + 0.3) + '>' + h + '</span>';
  // 여러 줄 식(이름표가 붙는다). 글씨 크기는 가장 긴 줄에 맞춘다.
  const tagEq = (list, tags) => { const style = fit(1.07 * Math.max(...list.map(emW)) + 2.9); return lines(list.map((h, i) => tag((tags || LAB)[i]) + '<span class="mb-expr"' + style + '>' + h + '</span>')); };
  // 한 줄씩 적은 풀이 과정. 줄은 식이거나 { note } 이다.
  function procQ(rows) {
    const style = fit(1.07 * Math.max(...rows.filter((r) => typeof r === 'string').map(emW)) + 0.3) || ' style="font-size:1.2rem"';
    return lines(rows.map((r) => (typeof r === 'string' ? '<span class="mb-expr"' + style + '>' + r + '</span>' : '<span style="font-size:0.95rem;color:#475569">' + r.note + '</span>')));
  }
  // 글줄 안의 식: 짧으면 통째로 묶고, 길면 연산 기호 앞에서만 줄이 바뀌게 항마다 묶는다.
  function chunks(h) {
    const out = []; let depth = 0, span = 0, from = 0;
    for (let i = 0; i < h.length; i += 1) {
      if (h.startsWith('<span', i)) span += 1; else if (h.startsWith('</span>', i)) span -= 1;
      else if (h[i] === '(') depth += 1; else if (h[i] === ')') depth -= 1;
      else if (depth === 0 && span === 0 && /^ [+−=] /.test(h.slice(i, i + 3))) { out.push(h.slice(from, i)); from = i + 1; }
    }
    return out.concat([h.slice(from)]).map(nb).join(' ');
  }
  const keep = (h) => (emW(h) < 12 ? nb(h) : chunks(h));

  // ── 이차방정식 풀기 ──
  // f(정리한 좌변 − 우변)를 정수 계수 a, b, c(a > 0, 서로소)로 맞춘다.
  function abc(f) {
    const t = trim(f), L = t.reduce((m, c) => lcm(m, c.q), 1), ints = t.map((c) => c.p * L / c.q), g = ints.reduce((m, v) => gcd(m, Math.abs(v)), 0) || 1, s = ints[ints.length - 1] < 0 ? -1 : 1;
    const out = ints.map((v) => s * v / g);
    return { a: out[2] || 0, b: out[1] || 0, c: out[0] || 0 };
  }
  // 근호 안의 수 n = s² × t
  // 해: kind 'none' | 'double' | 'rational' | 'irr'. irr 이면 sol = { p, k, q, r }: (p ± k√q)/r(더 줄일 수 없게).
  function solve2(f) {
    const { a, b, c } = abc(f), D = b * b - 4 * a * c;
    if (a === 0) return { a, b, c, D, kind: 'linear' };
    if (D < 0) return { a, b, c, D, kind: 'none' };
    if (D === 0) return { a, b, c, D, kind: 'double', root: Q(-b, 2 * a) };
    if (isSq(D)) { const s = Math.sqrt(D), r1 = Q(-b - s, 2 * a), r2 = Q(-b + s, 2 * a); return { a, b, c, D, kind: 'rational', roots: [r1, r2] }; }
    const [s, t] = sqParts(D), g = gcd3(b, s, 2 * a);
    return { a, b, c, D, s, t, g, kind: 'irr', sol: { p: -b / g, k: s / g, q: t, r: 2 * a / g } };
  }
  // 해의 꼴: Z(p = 0) / P, 1(근호 앞의 수가 1) / K, R(분모가 있다)
  const formOf = (sol) => (sol.p === 0 ? 'Z' : 'P') + (sol.k === 1 ? '1' : 'K') + (sol.r === 1 ? '' : 'R');
  // 해를 적은 글: x = (−2 ± √7)/3
  function radH(sol) {
    const { p, k, q, r } = sol, rad = (k === 1 ? '' : k) + rt(q), top = p === 0 ? '±' + rad : sT(p) + ' ± ' + rad;
    return r === 1 ? top : p === 0 ? '±' + frac(rad, r) : frac(top, r);
  }
  const solH = (sol) => nb(X + ' = ' + radH(sol));
  // 근호가 든 해를 받는 끼워 넣는 칸. 칸의 차례: p, k, q, r 가운데 꼴에 있는 것.
  const TPL = {
    // 좁은 화면에서는 「±」 뒤에서만 줄이 갈린다(칸과 √ 가 떨어지지 않게 묶는다)
    P1: () => grp(`${X} = {0} ±`) + ' ' + rt('{1}'), PK: () => grp(`${X} = {0} ±`) + ' ' + grp('{1}' + rt('{2}')),
    P1R: () => `${X} = ` + frac('{0} ± ' + rt('{1}'), '{2}'), PKR: () => `${X} = ` + frac('{0} ± {1}' + rt('{2}'), '{3}'),
    Z1: () => grp(`${X} = ±${rt('{0}')}`), ZK: () => grp(`${X} = ±{0}${rt('{1}')}`), Z1R: () => `${X} = ±` + frac(rt('{0}'), '{1}'), ZKR: () => `${X} = ±` + frac('{0}' + rt('{1}'), '{2}')
  };
  const SLOTS = { P1: ['p', 'q'], PK: ['p', 'k', 'q'], P1R: ['p', 'q', 'r'], PKR: ['p', 'k', 'q', 'r'], Z1: ['q'], ZK: ['k', 'q'], Z1R: ['q', 'r'], ZKR: ['k', 'q', 'r'] };
  // 해를 근의 공식으로 다시 셈하는 식(a, b, c 는 정리한 계수)
  function solCalc(S) {
    const { a, b, c, s, g } = S;
    return { p: `(-(${b}))/${g}`, k: `${s}/${g}`, q: `((${b})*(${b})-4*${a}*(${c}))/(${s}*${s})`, r: `2*${a}/${g}` };
  }
  // 근호가 든 해를 답하는 문항. want: 이 유형의 칸 모양(꼴이 다르면 오류를 낸다 — 만들 때 d.until 로 거른다).
  function radRootAns(text, S, want, o) {
    const form = formOf(S.sol);
    if (form !== want) throw new Error('해의 꼴이 ' + form + ' 이다(유형은 ' + want + ')');
    const slots = SLOTS[form], cal = solCalc(S), opt = o || {};
    return inline(text, TPL[form](), slots.map((name) => (name === 'p' ? { answer: S.sol.p, signed: true } : { answer: S.sol[name] })), Object.assign({}, opt, {
      shown: solH(S.sol),
      facts: Object.assign({ calc: slots.map((name, i) => [cal[name], i]), derived: [S.s, S.g, 2, 4, 1, 0, S.a, Math.abs(S.b), Math.abs(S.c)] }, opt.facts || {})
    }));
  }
  // 정수 두 근을 답하는 문항: 「x = [±][ ] 또는 x = [±][ ]」(차례는 따지지 않는다). 두 근은 서로 다르고 부호만 다른 짝이 아니다(부호를 뒤집은 답이 맞게 되지 않게).
  function rootsAns(text, r1, r2, o) {
    if (!Number.isInteger(r1) || !Number.isInteger(r2) || r1 === r2 || r1 === -r2) throw new Error('두 근 칸: 서로 다르고 부호만 다르지 않은 정수여야 한다');
    const opt = o || {};
    return inline(text, grp(`${X} = {0}`) + ' 또는 ' + grp(`${X} = {1}`), [{ answer: r1, signed: true }, { answer: r2, signed: true }], Object.assign({}, opt, { unordered: true, shown: `${nb(X + ' = ' + iq(r1))} 또는 ${nb(X + ' = ' + iq(r2))}` }));
  }
  // 두 정수 근을 근의 공식으로 다시 셈하는 식(정리한 계수 a, b, c)
  function rootCalc(S) {
    const s = Math.sqrt(S.D);
    return [[`(-(${S.b})-${s})/(2*${S.a})`, 0], [`(-(${S.b})+${s})/(2*${S.a})`, 1]];
  }
  // 정수 두 근 문항: 정리한 계수로 근거를 단다(작은 근이 첫 칸).
  function intRootsQ(text, f, o) {
    const S = solve2(f);
    if (S.kind !== 'rational' || !S.roots.every(isInt)) throw new Error('정수 두 근이 아니다');
    const opt = o || {}, [r1, r2] = S.roots.map((v) => v.p);
    return rootsAns(text, r1, r2, Object.assign({}, opt, { facts: Object.assign({ calc: rootCalc(S), derived: [Math.sqrt(S.D), 2, 1, 0, S.a, Math.abs(S.b), Math.abs(S.c)] }, opt.facts || {}) }));
  }
  // 근 하나(중근)를 정수로 답하는 문항
  function oneRootQ(text, v, o) {
    const opt = o || {};
    return N(text, v, Object.assign({}, opt, { signed: true, lead: X + ' =' }));
  }
  // x = ±k 꼴의 답
  function pmIntAns(text, k, o) {
    return inline(text, grp(`${X} = ±{0}`), [{ answer: k }], Object.assign({}, o, { shown: nb(`${X} = ±${k}`) }));
  }
  // 문자의 값 두 개를 답하는 문항: 「m = [±][ ] 또는 m = [±][ ]」(차례는 따지지 않는다)
  function twoValsAns(text, name, v1, v2, o) {
    if (v1 === v2 || v1 === -v2) throw new Error('두 값 칸: 서로 다르고 부호만 다르지 않아야 한다');
    return inline(text, grp(`${name} = {0}`) + ' 또는 ' + grp(`${name} = {1}`), [{ answer: v1, signed: true }, { answer: v2, signed: true }], Object.assign({}, o, { unordered: true, shown: `${nb(name + ' = ' + iq(v1))} 또는 ${nb(name + ' = ' + iq(v2))}` }));
  }
  // 수 여럿을 답하는 문항: 칸 앞에 「a =」를 적는다.
  const valsQ = (text, pairs, o) => M(text, pairs.map(([n, v, sign]) => ({ answer: v, signed: sign !== false, lead: (n.startsWith('<') ? n : V(n)) + ' =' })), Object.assign({}, o, { shown: pairs.map(([n, v]) => nb(`${n.startsWith('<') ? n : V(n)} = ${iq(v)}`)).join(', ') }));
  // 옳은 것 하나와 나머지를 섞는다. 보기는 [글, 옳은가]이다.
  function choose(d, text, rows, o) {
    const list = d.shuffle(rows), opt = o || {};
    // 보기가 겹치거나 옳은 보기가 하나가 아니면 null(만들기를 다시 한다)
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1]).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: true }, opt.facts || {}) }));
  }
  // 해의 집합을 적은 글(보기): x = −2 또는 x = 3
  const setH = (vals) => (vals.length === 0 ? '해가 없다' : vals.map((v) => nb(X + ' = ' + tx(asQ(v)))).join(' 또는 '));
  const sameSet = (u, w) => u.length === w.length && u.every((x) => w.some((y) => qcmp(asQ(x), asQ(y)) === 0));
  // 다항식 f 의 해(유리수 근만) — 보기를 가릴 때 쓴다
  const ratRoots = (f) => { const S = solve2(f); return S.kind === 'rational' ? S.roots : S.kind === 'double' ? [S.root] : []; };
  // 서로 다른 0이 아닌 정수 두 개(부호만 다른 짝이 아니다)
  const twoInts = (d, lo, hi, ok) => d.until(() => [nz(d, lo, hi), nz(d, lo, hi)], ([u, w]) => u !== w && u !== -w && (!ok || ok(u, w)));
  // 근 r1, r2 를 갖는 x² + Bx + C
  const monic = (r1, r2) => P(r1 * r2, -(r1 + r2), 1);
  // 받아 적은 식의 끝 소리에 맞춘 토씨(= 0 으로 끝나면 0의 소리)
  const zj = (pair) => tail(0, pair);

  // ── 정리하면 x² + Bx + C 가 되는 여러 꼴(좌변 = 우변) ──
  // 돌려주는 것: { L, R, f(좌변 − 우변) }
  function dress(d, B2, C0, kinds) {
    const make = () => {
      const kind = d.pick(kinds || ['pq', 'xp', 'move', 'pm']);
      if (kind === 'pq') {
        const p = nz(d, -6, 6), q = B2 - p, c = p * q - C0;
        if (q === 0 || c === 0 || p === q) return null;
        return { L: prodH(1, [[1, p], [1, q]]), R: iq(c), f: psub(prodP(1, [[1, p], [1, q]]), P(c)) };
      }
      if (kind === 'xp') {
        if (B2 === 0 || C0 === 0) return null;
        return { L: prodH(1, [[1, 0], [1, B2]]), R: iq(-C0), f: psub(prodP(1, [[1, 0], [1, B2]]), P(-C0)) };
      }
      if (kind === 'move') {
        if (B2 === 0 || C0 === 0) return null;
        return { L: polyH(P(C0, 0, 1)), R: polyH(P(0, -B2)), f: psub(P(C0, 0, 1), P(0, -B2)) };
      }
      const p = d.int(1, 5), b = -B2, c = -p * p - C0;
      if (b === 0 || c === 0) return null;
      return { L: prodH(1, [[1, p], [1, -p]]), R: linH(b, c), f: psub(prodP(1, [[1, p], [1, -p]]), L1(b, c)) };
    };
    return d.until(make, (e) => e !== null);
  }

  B.kit.m914 = {
    STD, HAN, GANA, X, X2, X3, va, vb, vc, vk, vm, vp, vq, iq, sT, gcd3, isSq, squarefree, stripH, seal, retry, trim, P, padd, pneg, psub, pmul, pk, deg, pval, L1, polyH, linH, fH, kH, moreH, endJ, ej, twoValsAns,
    prodH, prodP, sqH, sqP, eqH, emW, exq, tagEq, procQ, keep, abc, solve2, formOf, radH, solH, TPL, SLOTS, solCalc, radRootAns, rootsAns, rootCalc, intRootsQ, oneRootQ,
    pmIntAns, valsQ, choose, setH, sameSet, ratRoots, twoInts, monic, zj, dress
  };


  // ── 문항 ──
  const SOLVE = '다음 이차방정식을 푸시오.';
  // 이차방정식 가리기에 쓰는 식들: [글, 정리한 좌변 − 우변(등식이 아니면 null)]
  function candidates(d) {
    const a = nz(d, -5, 5), b = nz(d, -6, 6), c = nz(d, -9, 9), k = d.int(2, 4), e = d.int(2, 9), p = d.int(1, 5);
    const yes = [
      () => { const [u, w] = twoInts(d, -5, 5); return [eqH(prodH(1, [[1, u], [1, w]]), iq(c)), psub(prodP(1, [[1, u], [1, w]]), P(c))]; },
      () => [eqH(nb('(' + polyH(P(Q(-1, k), 1)) + ')' + sup(2)), '0'), pmul(P(Q(-1, k), 1), P(Q(-1, k), 1))],
      () => [eqH(nb('(' + p + ' + ' + X + ')(' + p + ' ' + MINUS + ' ' + X + ')'), X2), P(p * p, 0, -2)],
      () => [eqH(polyH(P(0, a, 0, 1)), polyH(P(e, 0, b, 1))), psub(P(0, a, 0, 1), P(e, 0, b, 1))],
      () => [eqH(X2, '0'), P(0, 0, 1)],
      () => [eqH(polyH(P(0, b, k)), '0'), P(0, b, k)],
      () => [eqH(prodH(1, [[1, 0], [1, b]]), polyH(P(e, 1, 2))), psub(prodP(1, [[1, 0], [1, b]]), P(e, 1, 2))]
    ];
    const no = [
      () => [eqH(prodH(1, [[1, 0], [1, a]]), polyH(P(e, 0, 1))), psub(prodP(1, [[1, 0], [1, a]]), P(e, 0, 1))],
      () => [polyH(P(c, b, 1)), null],
      () => [eqH(prodH(1, [[1, 0], [1, -1], [1, -1]]), polyH(P(1, 1, 1))), psub(prodP(1, [[1, 0], [1, -1], [1, -1]]), P(1, 1, 1))],
      () => [eqH(polyH(P(0, 1, k)), polyH(P(0, 0, 0, k))), psub(P(0, 1, k), P(0, 0, 0, k))],
      () => [eqH(sqH(1, 1, p), polyH(P(e, 0, 1))), psub(sqP(1, 1, p), P(e, 0, 1))],
      () => [eqH(prodH(1, [[2, 1], [1, -3]]), polyH(P(e, 0, 2))), psub(prodP(1, [[2, 1], [1, -3]]), P(e, 0, 2))],
      () => [eqH(polyH(P(0, a, 2)), '2(' + polyH(P(e, 0, 1)) + ')'), psub(P(0, a, 2), P(2 * e, 0, 2))]
    ];
    return { yes: d.shuffle(yes).map((g) => g()), no: d.shuffle(no).map((g) => g()) };
  }
  const isQuad = (f) => f !== null && deg(f) === 2;
  const said = (f) => (f === null ? '등호가 없어 방정식이 아니다' : deg(f) === 2 ? '이차방정식이다' : deg(f) === 3 ? '삼차식이 남는다' : '이차항이 없어진다');

  B.addUnit({
    id: '9-1-4', grade: 9, semester: 1, no: 4, title: '이차방정식', version: 1,
    groups: [
      { id: 'eq', title: '이차방정식과 그 해', standard: STD, types: [] },
      { id: 'fac', title: '인수분해를 이용한 풀이', standard: STD, types: [] },
      { id: 'dbl', title: '중근', standard: STD, types: [] },
      { id: 'sqrt', title: '제곱근을 이용한 풀이', standard: STD, types: [] },
      { id: 'square', title: '완전제곱식을 이용한 풀이', standard: STD, types: [] },
      { id: 'formula', title: '근의 공식', standard: STD, types: [] },
      { id: 'various', title: '여러 가지 이차방정식', standard: STD, types: [] },
      { id: 'roots', title: '두 근과 이차방정식', standard: STD, types: [] },
      { id: 'use', title: '이차방정식의 활용', standard: STD, types: [] }
    ]
  });

  // ── 이차방정식과 그 해 ──
  B.addTypes('9-1-4', 'eq', [
    T('eq-pick', '이차방정식 가리기', '①1', (d, n) => {
      const pool = candidates(d);
      if (n === 0) {
        // 보기 다섯 가운데 이차방정식을 모두 고른 것
        const k = d.int(2, 3), rows = d.shuffle(pool.yes.slice(0, k).concat(pool.no.slice(0, 5 - k))), flags = rows.map((r) => isQuad(r[1]));
        const all = HAN.slice(0, 5), right = all.filter((_, i) => flags[i]);
        const near = [];
        for (let i = 0; i < 5; i += 1) { const s = all.filter((_, j) => (j === i ? !flags[j] : flags[j])); if (s.length) near.push(s); }
        const opts = d.shuffle(near).slice(0, 4).map((s) => [s.join(', '), false]).concat([[right.join(', '), true]]);
        return choose(d, `다음 보기 가운데 ${X}에 대한 이차방정식을 모두 고른 것은?`, opts, {
          figure: tagEq(rows.map((r) => r[0]), HAN.map((h) => h + '.')),
          explain: `우변의 모든 항을 좌변으로 이항하여 정리하였을 때 (${X}에 대한 이차식) = 0의 꼴이 되는 방정식이 이차방정식이다. ${rows.map((r, i) => all[i] + '은 ' + said(r[1])).join(', ')}. 따라서 이차방정식은 ${right.join(', ')}이다.`,
          facts: { rule: 'pick-all' }
        });
      }
      const wrong = pool.no[0];
      const rows = pool.yes.slice(0, 4).map((r) => [nb(r[0]), false]).concat([[nb(wrong[0]), true]]);
      return choose(d, `다음 중 ${X}에 대한 이차방정식이 아닌 것은?`, rows, {
        explain: wrong[1] === null ? `${ej(wrong[0], '은/는')} 등호가 없는 식이므로 방정식이 아니다. 나머지는 모든 항을 좌변으로 이항하여 정리하면 (${X}에 대한 이차식) = 0의 꼴이 된다.`
          : `모든 항을 좌변으로 이항하여 정리한다. ${ej(wrong[0], '을/를')} 정리하면 ${nb(polyH(wrong[1]) + ' = 0')}이므로 ${deg(wrong[1]) === 3 ? '삼차방정식이다' : '이차방정식이 아니다'}. 나머지는 정리하면 ${X2}의 계수가 0이 아니고 차수가 2이다.`,
        facts: { rule: 'pick-not' }
      });
    }, { count: 2 }),
    T('eq-coef', '정리하여 ax² + bx + c = 0 꼴의 계수 구하기', '①2', (d, n) => {
      if (n === 0) {
        // m(x + p)² + (qx + r) = s 를 mx² + ax + b = 0 꼴로
        const m = d.int(2, 4), p = nz(d, -4, 4), q = nz(d, -6, 6), r = nz(d, -9, 9), s = nz(d, -9, 9);
        const f = psub(padd(sqP(m, 1, p), L1(q, r)), P(s)), a = f[1].p, b = f[0].p;
        if (a === 0 || b === 0) return null;
        const eq = eqH(sqH(m, 1, p) + ' + (' + linH(q, r) + ')', iq(s));
        return valsQ(`이차방정식 ${keep(ej(eq, '을/를'))} ${nb(m + X2 + ' + ' + va + X + ' + ' + vb + ' = 0')}의 꼴로 나타낼 때, 수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
          explain: `괄호를 풀면 ${keep(polyH(sqP(m, 1, p)) + moreH([[q, X], [r, '']]) + ' = ' + iq(s))}이고, 우변을 이항하여 정리하면 ${nb(polyH(f) + ' = 0')}이다. 따라서 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다.`,
          facts: { calc: [[`2*${m}*(${p})+(${q})`, 0], [`${m}*(${p})*(${p})+(${r})-(${s})`, 1]], derived: [2] }
        });
      }
      if (n === 1) {
        // (1/k)x(m − x) = e 를 x² + bx + c = 0 꼴로: 양변에 −k 를 곱한다.
        const k = d.int(2, 5), m = d.int(2, 9), e = d.int(1, 6), b = -m, c = k * e;
        const L = nb(frac(1, k) + X + '(' + m + ' ' + MINUS + ' ' + X + ')');
        return valsQ(`이차방정식 ${nb(ej(eqH(L, String(e)), '을/를'))} ${nb(X2 + ' + ' + vb + X + ' + ' + vc + ' = 0')}의 꼴로 나타낼 때, 수 ${vb}, ${vc}의 값은?`, [['b', b], ['c', c]], {
          explain: `좌변을 전개하면 ${nb(polyH(P(0, Q(m, k), Q(-1, k))) + ' = ' + e)}이다. ${X2}의 계수를 1로 만들려고 양변에 ${MINUS}${k}${tail(k, '을/를')} 곱하면 ${nb(polyH(P(0, -m, 1)) + ' = ' + iq(-k * e))}, 이항하면 ${nb(polyH(P(c, b, 1)) + ' = 0')}이다.`,
          facts: { calc: [[`0-${m}`, 0], [`${k}*${e}`, 1]] }
        });
      }
      // 같은 방정식을 ax² + bx + c = 0 꼴로 나타낸 것: 양변에 0이 아닌 같은 수를 곱한 것은 모두 옳다.
      const [u, w] = twoInts(d, -5, 5), p = d.int(1, 3), f = padd(prodP(1, [[1, u], [1, w]]), P(0, 0, p)), A = abc(f);
      if (A.b === 0 || A.c === 0) return null;
      const eq = eqH(prodH(1, [[1, u], [1, w]]), polyH(P(0, 0, -p)));
      const fine = d.shuffle([1, -1, 2, -2, 3]).slice(0, 4).map((m) => [m * A.a, m * A.b, m * A.c]);
      const bad = d.pick([[A.a, -A.b, A.c], [A.a, A.b, -A.c], [-A.a, A.b, -A.c]]);
      const row = ([x, y, z]) => nb(`${va} = ${iq(x)}, ${vb} = ${iq(y)}, ${vc} = ${iq(z)}`);
      const ok = (t) => t[0] * A.b === t[1] * A.a && t[0] * A.c === t[2] * A.a;
      return choose(d, `방정식 ${keep(ej(eq, '을/를'))} ${nb(va + X2 + ' + ' + vb + X + ' + ' + vc + ' = 0')}의 꼴로 나타낼 때, ${va}, ${vb}, ${vc}의 값으로 옳지 않은 것은?`,
        fine.map((t) => [row(t), !ok(t)]).concat([[row(bad), !ok(bad)]]), {
          explain: `이항하여 정리하면 ${nb(polyH(P(A.c, A.b, A.a)) + ' = 0')}이다. 양변에 0이 아닌 같은 수를 곱하여도 같은 방정식이므로 ${va} : ${vb} : ${vc}가 ${A.a} : ${iq(A.b)} : ${iq(A.c)}인 것은 모두 옳다. ${row(bad)}${endJ(row(bad), '은/는')} 그렇지 않다.`,
          facts: { rule: 'coef-wrong' }
        });
    }, { count: 3 }),
    T('eq-a0', 'a, b, c의 값 가운데 이차방정식이 될 수 없는 것', '①3', (d) => {
      const rows = [[0, d.int(1, 5), d.int(0, 5)], [d.int(1, 4), 0, d.int(1, 6)], [d.int(1, 4), d.int(1, 5), 0], [d.int(1, 3), 0, 0], [d.int(2, 5), d.int(1, 5), d.int(1, 5)]];
      const opts = rows.map(([a, b, c]) => [nb(`${va} = ${a}, ${vb} = ${b}, ${vc} = ${c}`), a === 0]);
      return choose(d, `${nb(va + X2 + ' + ' + vb + X + ' + ' + vc + ' = 0')}에서 ${va}, ${vb}, ${vc}의 값을 다음과 같이 정할 때, ${X}에 대한 이차방정식이 될 수 없는 것은?`, opts, {
        explain: `${X2}의 계수 ${va}가 0이 아니면 ${vb}나 ${vc}가 0이어도 이차방정식이다(${nb(X2 + ' = 0')}, ${nb(X2 + ' + 4 = 0')}도 이차방정식이다). ${nb(va + ' = 0')}이면 ${X2}의 항이 없어지므로 이차방정식이 아니다.`
      });
    }),
    T('eq-cond', '이차방정식이 되기 위한 문자 계수의 조건', '①4', (d) => {
      const kind = d.int(0, 2), q = nz(d, -6, 6), r = nz(d, -6, 6), s = d.int(1, 3), t = nz(d, -4, 4);
      let L, R, v, why, calc;
      if (kind === 0) {
        // (a − p)x² + qx + r = (sx + t)(ux + w)
        const p = d.int(1, 4), u = d.int(1, 3), w = nz(d, -4, 4);
        L = nb(`(${va} ${MINUS} ${p})${X2}` + moreH([[q, X], [r, '']])); R = prodH(1, [[s, t], [u, w]]); v = p + s * u;
        why = `우변을 전개하여 이항하면 ${X2}의 계수는 ${nb(`${va} ${MINUS} ${p} ${MINUS} ${s * u}`)}이다`; calc = `${p}+${s}*${u}`;
      } else if (kind === 1) {
        L = nb(va + X2 + moreH([[q, X], [r, '']])); R = sqH(1, s, t); v = s * s;
        why = `우변을 전개하여 이항하면 ${X2}의 계수는 ${nb(`${va} ${MINUS} ${s * s}`)}이다`; calc = `${s}*${s}`;
      } else {
        L = sqH(1, s, t); R = nb(va + X2 + moreH([[q, X], [r, '']])); v = s * s;
        why = `좌변을 전개하여 우변의 항을 이항하면 ${X2}의 계수는 ${nb(`${s * s} ${MINUS} ${va}`)}이다`; calc = `${s}*${s}`;
      }
      return inline(`등식 ${keep(ej(eqH(L, R), '이/가'))} ${X}에 대한 이차방정식이 되도록 하는 수 ${va}의 조건은?`, `${va} ≠ {0}`, [{ answer: v, signed: true }], {
        shown: nb(`${va} ≠ ${iq(v)}`),
        explain: `${why}. 이차방정식이 되려면 이 계수가 0이 아니어야 하므로 ${nb(va + ' ≠ ' + iq(v))}이다.`,
        facts: { calc: [[calc, 0]] }
      });
    }),
    T('eq-check', '주어진 수가 이차방정식의 해인지 가리기', '①5', (d, n) => {
      // 해를 아는 이차방정식 하나를 여러 꼴로 적는다.
      const shape = (r1, r2) => {
        const kind = d.int(0, 3);
        if (kind === 0) return { h: eqH(polyH(monic(r1, r2)), '0'), f: monic(r1, r2) };
        if (kind === 1) { const c = nz(d, -6, 6); return { h: eqH(polyH(padd(monic(r1, r2), P(c))), iq(c)), f: monic(r1, r2) }; }
        if (kind === 2) { const e = dress(d, -(r1 + r2), r1 * r2, ['pq', 'xp']); return { h: eqH(e.L, e.R), f: e.f }; }
        return { h: eqH(prodH(1, [[1, -r1], [1, -r2]]), '0'), f: monic(r1, r2) };
      };
      if (n === 0) {
        const rows = Array.from({ length: 5 }, (_, i) => {
          const [r1, r2] = twoInts(d, -6, 6), e = shape(r1, r2);
          const k = i === 0 ? d.pick([r1, r2]) : d.until(() => d.pick([-r1, -r2, r1 + 1, r2 - 1, r1 - 1]), (t) => t !== r1 && t !== r2);
          return { e, k };
        });
        const good = rows[0];
        return choose(d, '다음 중 [ ] 안의 수가 주어진 이차방정식의 해인 것은?', rows.map((r) => [`${nb(r.e.h)} &nbsp;[${iq(r.k)}]`, pval(r.e.f, r.k).p === 0]), {
          explain: `[ ] 안의 수를 ${X}에 대입하여 좌변과 우변의 값이 같으면 해이다. ${nb(good.e.h)}에 ${nb(X + ' = ' + iq(good.k))}${tail(Math.abs(good.k), '을/를')} 대입하면 등식이 성립한다. 나머지는 대입하면 좌변과 우변의 값이 다르다.`,
          facts: { rule: 'check-one' }
        });
      }
      const k = nz(d, -4, 4), cnt = d.int(2, 4);
      const rows = Array.from({ length: 6 }, (_, i) => {
        const other = d.until(() => nz(d, -6, 6), (t) => t !== k && t !== -k);
        const pair = i < cnt ? [k, other] : d.until(() => twoInts(d, -6, 6), ([u, w]) => u !== k && w !== k);
        return shape(pair[0], pair[1]);
      });
      const order = d.shuffle(rows), flags = order.map((e) => pval(e.f, k).p === 0);
      return N(`다음 보기의 이차방정식 가운데 ${nb(X + ' = ' + iq(k))}${tail(Math.abs(k), '을/를')} 해로 갖는 것은 모두 몇 개인가?`, flags.filter(Boolean).length, {
        unit: '개', figure: tagEq(order.map((e) => e.h), HAN.map((h) => h + '.')),
        explain: `각 방정식에 ${nb(X + ' = ' + iq(k))}${tail(Math.abs(k), '을/를')} 대입하여 등식이 성립하는 것을 센다. ${HAN.filter((_, i) => flags[i]).join(', ')}의 ${flags.filter(Boolean).length}개이다.`,
        facts: { count: flags }
      });
    }, { count: 2 }),
    T('eq-range', 'x의 값이 정해진 범위에서 대입하여 풀기', '①6', (d) => {
      const kind = d.int(0, 2);
      let dom, cond;
      if (kind === 0) { const lo = d.int(-3, -1), len = d.int(4, 5); dom = Array.from({ length: len }, (_, i) => lo + i); cond = `${X}의 값이 ${dom.map(iq).join(', ')}일 때`; }
      else if (kind === 1) { const m = d.int(3, 4); dom = Array.from({ length: 2 * m - 1 }, (_, i) => i - m + 1); cond = `|${X}| &lt; ${m}인 정수 ${X}에 대하여`; }
      else { const hi = d.int(4, 6); dom = Array.from({ length: hi }, (_, i) => i + 1); cond = `${X}가 ${hi} 이하의 자연수일 때`; }
      const inside = d.pick(dom.filter((v) => v !== 0)), outsideOnly = d.bool();
      const r2 = d.until(() => nz(d, -8, 8), (t) => t !== inside && t !== -inside && (outsideOnly ? !dom.includes(t) : dom.includes(t)));
      const e = dress(d, -(inside + r2), inside * r2, ['pq', 'xp', 'move']), right = dom.filter((v) => pval(e.f, v).p === 0);
      const opts = [[setH(right), true, right]];
      for (const s of d.shuffle([[inside, r2], [inside], [r2], [-inside], [-inside, -r2], [inside, -r2]])) if (opts.length < 5 && !sameSet(s, right) && !opts.some((o) => sameSet(o[2], s))) opts.push([setH(s), false, s]);
      return choose(d, `${cond}, 이차방정식 ${keep(eqH(e.L, e.R))}의 해는?`, opts, {
        explain: `${X}에 주어진 값을 차례로 대입하여 좌변과 우변의 값이 같아지는 것을 찾는다. ${right.length === 1 ? `방정식을 정리하여 풀면 ${nb(X + ' = ' + iq(inside))} 또는 ${nb(X + ' = ' + iq(r2))}이지만 ${iq(r2)}${tail(Math.abs(r2), '은/는')} 주어진 ${X}의 값이 아니므로 해는 ${setH(right)}뿐이다.` : `해는 ${setH(right)}이다.`}`
      });
    }),
    T('eq-ineq', '부등식을 만족시키는 자연수 x에 대하여 풀기', '①7 심5', (d) => {
      const K = d.int(3, 5), p = d.int(1, 3), r = d.int(1, 3), s = d.int(1, 3), q = K * (p + r) - r * s;
      if (q <= 0) return null;
      const r1 = d.int(1, K), r2 = d.until(() => d.int(K + 1, 9), (t) => t !== r1);
      const e = dress(d, -(r1 + r2), r1 * r2, [d.pick(['pq', 'move', 'xp'])]);
      const ineq = nb(polyH(P(-q, p)) + ' ≤ ' + kH(-r) + '(' + linH(1, -s) + ')');
      const opts = [[setH([r1]), true, [r1]]];
      for (const s2 of d.shuffle([[r1, r2], [r2], [-r1], [r1, -r2], [-r1, -r2], [r1 + 1]])) if (opts.length < 5 && !sameSet(s2, [r1]) && !opts.some((o) => sameSet(o[2], s2))) opts.push([setH(s2), false, s2]);
      return choose(d, `부등식 ${ineq}을 만족시키는 자연수 ${X}에 대하여 이차방정식 ${keep(eqH(e.L, e.R))}의 해는?`, opts, {
        explain: `부등식을 풀면 ${nb(polyH(P(-q, p)) + ' ≤ ' + polyH(P(r * s, -r)))}, ${nb((p + r) + X + ' ≤ ' + (q + r * s))}, ${nb(X + ' ≤ ' + K)}이므로 ${X}는 1부터 ${K}까지의 자연수이다. 이차방정식을 정리하여 풀면 ${nb(X + ' = ' + r1)} 또는 ${nb(X + ' = ' + r2)}이고, 이 가운데 ${K} 이하의 자연수는 ${r1}뿐이다.`
      });
    }),
    T('eq-const', '한 근이 주어질 때 계수의 미지수 구하기', '①8', (d, n) => {
      const [r, o] = twoInts(d, -6, 6);
      if (n === 0) {
        const A = d.int(1, 3), B2 = -A * (r + o), C0 = A * r * o;
        if (d.bool()) {
          // 상수항이 미지수: Ax² + B2x + c = 0
          if (B2 === 0) return null;
          return N(`이차방정식 ${nb(polyH(P(0, B2, A)) + ' + ' + vc + ' = 0')}의 한 근이 ${iq(r)}일 때, 수 ${vc}의 값은?`, C0, {
            signed: true,
            explain: `${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 대입하면 ${nb(`${A * r * r} ${B2 * r < 0 ? MINUS : '+'} ${Math.abs(B2 * r)} + ${vc} = 0`)}이므로 ${nb(vc + ' = ' + iq(C0))}이다.`,
            facts: { value: `-(${A}*(${r})*(${r})+(${B2})*(${r}))` }
          });
        }
        // x의 계수가 미지수: Ax² + ax + C0 = 0
        return N(`이차방정식 ${nb(polyH(P(0, 0, A)) + ' + ' + va + X + moreH([[C0, '']]) + ' = 0')}의 한 근이 ${iq(r)}일 때, 수 ${va}의 값은?`, B2, {
          signed: true,
          explain: `${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 대입하면 ${nb(`${A * r * r} ${r < 0 ? MINUS : '+'} ${Math.abs(r) === 1 ? '' : Math.abs(r)}${va}${moreH([[C0, '']])} = 0`)}이므로 ${nb(va + ' = ' + iq(B2))}이다.`,
          facts: { value: `-(${A}*(${r})*(${r})+(${C0}))/(${r})` }
        });
      }
      // 미지수가 두 자리에: x² + (uk + v)x + wk + z = 0 → k = −(r² + vr + z)/(ur + w)
      const u = d.int(1, 3), v = nz(d, -4, 4), w = d.int(1, 4), z = nz(d, -6, 6), den = u * r + w, num = -(r * r + v * r + z);
      if (den === 0 || num % den !== 0 || num / den === 0) return null;
      const k = num / den, bTxt = nb(`(${u === 1 ? '' : u}${vk}${moreH([[v, '']])})`), cTxt = nb(`${w === 1 ? '' : w}${vk}${moreH([[z, '']])}`);
      return N(`이차방정식 ${nb(X2 + ' + ' + bTxt + X + ' + ' + cTxt + ' = 0')}의 한 근이 ${iq(r)}일 때, 수 ${vk}의 값은?`, k, {
        signed: true,
        explain: `${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 대입하면 ${nb(`${r * r} + ${bTxt} × (${iq(r)}) + ${cTxt} = 0`)}, 정리하면 ${nb(`${kH(den)}${vk}${moreH([[-num, '']])} = 0`)}이므로 ${nb(vk + ' = ' + iq(k))}이다.`,
        facts: { value: `-((${r})*(${r})+(${v})*(${r})+(${z}))/((${u})*(${r})+(${w}))` }
      });
    }, { count: 2 }),
    T('eq-other', '한 근으로 계수와 다른 한 근 구하기', '①9', (d, n) => {
      if (n === 0) {
        const [r, o] = twoInts(d, -7, 7), a = -(r + o), c = r * o;
        if (a === 0) return null;
        return valsQ(`이차방정식 ${nb(X2 + ' + ' + va + X + moreH([[c, '']]) + ' = 0')}의 한 근이 ${iq(r)}일 때, 수 ${va}의 값과 다른 한 근을 구하시오.`, [['a', a], ['<span>다른 한 근 ' + X + '</span>', o]], {
          explain: `${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 대입하면 ${nb(`${r * r} ${r < 0 ? MINUS : '+'} ${Math.abs(r) === 1 ? '' : Math.abs(r)}${va}${moreH([[c, '']])} = 0`)}이므로 ${nb(va + ' = ' + iq(a))}이다. ${nb(polyH(monic(r, o)) + ' = 0')}을 인수분해하면 ${nb(prodH(1, [[1, -r], [1, -o]]) + ' = 0')}이므로 다른 한 근은 ${nb(X + ' = ' + iq(o))}이다.`,
          facts: { calc: [[`-((${r})*(${r})+(${c}))/(${r})`, 0], [`(${c})/(${r})`, 1]] }
        });
      }
      // ax² + bx + c = 0(a = 2, 3)의 한 근이 정수 r, 다른 근은 분수
      const A = d.int(2, 3), r = nz(d, -4, 4), op = nz(d, -9, 9), o = Q(op, A);
      if (o.q !== A) return null;
      const f = pmul(P(-r, 1), P(-op, A)), Bc = f[1].p, Cc = f[0].p;
      if (Bc === 0) return null;
      const unknownC = d.bool();
      const shownEq = unknownC ? nb(polyH(P(0, Bc, A)) + ' + ' + va + ' = 0') : nb(polyH(P(0, 0, A)) + ' + ' + va + X + moreH([[Cc, '']]) + ' = 0');
      return ansV(`이차방정식 ${shownEq}의 한 근이 ${iq(r)}일 때, 다른 한 근은? (단, ${va}는 수이다.)`, o, 'frac', {
        explain: `${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 대입하면 ${nb(va + ' = ' + iq(unknownC ? Cc : Bc))}이다. 이차방정식 ${nb(polyH(f) + ' = 0')}을 인수분해하면 ${nb(prodH(1, [[1, -r], [A, -op]]) + ' = 0')}이므로 다른 한 근은 ${nb(X + ' = ' + tx(o))}이다.`,
        facts: unknownC ? { value: `-(${Bc})/${A}-(${r})` } : { value: `(${Cc})/(${A}*(${r}))` }
      });
    }, { count: 2 })
  ]);

  // ── 인수분해를 이용한 풀이 ──
  // 해의 집합을 정수 범위에서 찾아본 결과(말로 적힌 조건이 맞는지 가린다)
  const setOf = (test) => { const out = []; for (let x = -30; x <= 30; x += 1) if (test(x)) out.push(x); return out; };
  B.addTypes('9-1-4', 'fac', [
    T('fac-ab', 'AB = 0의 뜻', '①10', (d, n) => {
      const vA = V('A'), vB = V('B');
      if (n === 0) {
        const items = [
          [`${vA} = 0이고 ${vB} = 0`, (a, b) => a === 0 && b === 0], [`${vA} = 0이고 ${vB} ≠ 0`, (a, b) => a === 0 && b !== 0], [`${vA} ≠ 0이고 ${vB} = 0`, (a, b) => a !== 0 && b === 0],
          [`${vA} ≠ 0이고 ${vB} ≠ 0`, (a, b) => a !== 0 && b !== 0], [`${vA} = 0 또는 ${vB} = 0`, (a, b) => a === 0 || b === 0]
        ];
        // 그 조건을 만족시키는 모든 (A, B)에서 AB = 0인가
        const holds = (cond) => { for (let a = -2; a <= 2; a += 1) for (let b = -2; b <= 2; b += 1) if (cond(a, b) && a * b !== 0) return false; return true; };
        return choose(d, `두 수 ${vA}, ${vB}에 대하여 다음 중 ${nb(vA + vB + ' = 0')}을 만족시키지 않는 것은?`, items.map(([h, cond]) => [nb(h), !holds(cond)]), {
          explain: `${nb(vA + vB + ' = 0')}이면 ${vA} = 0, ${vB} = 0 가운데 적어도 하나가 성립한다(「${vA} = 0 또는 ${vB} = 0」). ${vA} ≠ 0이고 ${vB} ≠ 0이면 ${vA}${vB} ≠ 0이다.`,
          facts: { rule: 'ab-not' }
        });
      }
      const [u, w] = twoInts(d, -6, 6), L1h = linH(1, -u), L2h = linH(1, -w), roots = [u, w];
      const items = [
        [`${L1h} = 0 또는 ${L2h} = 0`, (x) => x - u === 0 || x - w === 0], [`${L1h} = 0이고 ${L2h} = 0`, (x) => x - u === 0 && x - w === 0],
        [`${X} = ${iq(-u)} 또는 ${X} = ${iq(-w)}`, (x) => x === -u || x === -w], [`${L1h} ≠ 0 또는 ${L2h} ≠ 0`, (x) => x - u !== 0 || x - w !== 0],
        [`${X} = ${iq(u)}이고 ${X} = ${iq(w)}`, (x) => x === u && x === w]
      ];
      return choose(d, `다음 중 ${nb(prodH(1, [[1, -u], [1, -w]]) + ' = 0')}과 같은 것은?`, items.map(([h, test]) => [h, sameSet(setOf(test), roots)]), {
        explain: `${nb(vA + vB + ' = 0')}이면 ${vA} = 0 또는 ${vB} = 0이므로 ${nb(L1h + ' = 0')} 또는 ${nb(L2h + ' = 0')}이다. 곧 ${nb(X + ' = ' + iq(u))} 또는 ${nb(X + ' = ' + iq(w))}이다. 「이고」는 두 식이 함께 성립한다는 뜻이라 맞지 않다.`,
        facts: { rule: 'ab-same' }
      });
    }, { count: 2 }),
    T('fac-prod', '(일차식)(일차식) = 0 꼴 풀기', '①11', (d, n) => {
      if (n === 0) {
        const [u, w] = twoInts(d, -9, 9), list = d.bool() ? [[1, -u], [1, -w]] : [[1, 0], [1, -w]], f = prodP(1, list);
        if (list[0][1] === 0 && w === 0) return null;
        const S = solve2(f);
        return intRootsQ(SOLVE, f, {
          figure: exq(eqH(prodH(1, list), '0')),
          explain: `${nb(prodH(1, list) + ' = 0')}에서 ${list.map(([a, b]) => nb(linH(a, b) + ' = 0')).join(' 또는 ')}이므로 ${setH(S.roots)}이다.`,
          facts: { rule: 'prod-int' }
        });
      }
      const [a, c] = [d.int(2, 6), d.int(1, 6)], b = d.until(() => nz(d, -7, 7), (t) => gcd(Math.abs(t), a) === 1), e = d.until(() => nz(d, -7, 7), (t) => gcd(Math.abs(t), c) === 1);
      const r1 = Q(-b, a), r2 = Q(-e, c);
      if (qcmp(r1, r2) === 0 || qcmp(r1, qneg(r2)) === 0) return null;
      const f = prodP(1, [[a, b], [c, e]]), right = [r1, r2];
      const cands = [[qneg(r1), qneg(r2)], [Q(-a, b), Q(-c, e)], [r1, qneg(r2)], [qneg(r1), r2], [Q(a, b), Q(c, e)]];
      const sets = [right];
      for (const s of d.shuffle(cands)) if (sets.length < 5 && !sets.some((o) => sameSet(o, s))) sets.push(s);
      if (sets.length < 5) return null;
      return choose(d, '다음 이차방정식의 해는?', sets.map((s) => [setH(s), sameSet(s, ratRoots(f))]), {
        figure: exq(eqH(prodH(1, [[a, b], [c, e]]), '0')),
        explain: `${nb(linH(a, b) + ' = 0')} 또는 ${nb(linH(c, e) + ' = 0')}이므로 ${setH(right)}이다.`,
        facts: { rule: 'prod-frac' }
      });
    }, { count: 2 }),
    T('fac-pick', '두 근에 맞는 (일차식)(일차식) = 0 고르기', '①12', (d) => {
      const a = d.int(2, 5), b = d.until(() => nz(d, -6, 6), (t) => gcd(Math.abs(t), a) === 1 && Math.abs(t) !== 1), w = d.until(() => nz(d, -6, 6), (t) => t !== Math.trunc(-b / a));
      const r1 = Q(-b, a), roots = [r1, Q(w)];
      const forms = [[[a, b], [1, -w]], [[a, -b], [1, -w]], [[a, b], [1, w]], [[b, a], [1, -w]], [[1, Q(b, a)], [1, w]]];
      const show = (list) => nb(list.map(([p, q]) => '(' + linH(p, q) + ')').join('') + ' = 0');
      const rows = forms.map((list) => [show(list), sameSet(ratRoots(list.reduce((acc, [p, q]) => pmul(acc, P(q, p)), P(1))), roots)]);
      return choose(d, `다음 이차방정식 가운데 두 근이 ${nb(X + ' = ' + tx(r1))} 또는 ${nb(X + ' = ' + iq(w))}인 것은?`, rows, {
        explain: `${nb(linH(a, b) + ' = 0')}이면 ${nb(X + ' = ' + tx(r1))}, ${nb(linH(1, -w) + ' = 0')}이면 ${nb(X + ' = ' + iq(w))}이므로 ${show(forms[0])}이다.`
      });
    }),
    T('fac-solve1', 'x²의 계수가 1인 이차방정식을 인수분해로 풀기', '①13', (d, n) => {
      if (n === 0) {
        const [u, w] = twoInts(d, -9, 9), f = monic(u, w);
        if (f[1].p === 0) return null;
        return intRootsQ(SOLVE, f, {
          figure: exq(eqH(polyH(f), '0')),
          explain: `좌변을 인수분해하면 ${nb(prodH(1, [[1, -u], [1, -w]]) + ' = 0')}이므로 ${setH([u, w])}이다.`,
          facts: { rule: 'solve-monic' }
        });
      }
      if (n === 1) {
        // 상수항이 0: ax² + bx = 0 (b 는 a 의 배수)
        const a = d.int(1, 4), u = nz(d, -9, 9), f = P(0, -a * u, a);
        return intRootsQ(SOLVE, f, {
          figure: exq(eqH(polyH(f), '0')),
          explain: `좌변을 공통인수 ${kH(a) + X}로 묶어 인수분해하면 ${nb(kH(a) + X + '(' + linH(1, -u) + ') = 0')}이므로 ${setH([0, u])}이다.`,
          facts: { rule: 'solve-zero' }
        });
      }
      const a = d.int(1, 3), k = d.int(2, 12), f = P(-a * k * k, 0, a);
      return pmIntAns(SOLVE, k, {
        figure: exq(eqH(polyH(f), '0')),
        explain: `${a === 1 ? '' : '양변을 ' + a + tail(a, '으로/로') + ' 나누고 '}좌변을 인수분해하면 ${nb(prodH(1, [[1, k], [1, -k]]) + ' = 0')}이므로 ${nb(X + ' = ' + iq(-k))} 또는 ${nb(X + ' = ' + k)}, 곧 ${nb(X + ' = ±' + k)}이다.`,
        facts: { calc: [[`${a * k * k}/(${a}*${k})`, 0]], derived: [k, a], rule: 'solve-square' }
      });
    }, { count: 3 }),
    T('fac-solve2', 'x²의 계수가 1이 아닌 이차방정식을 인수분해로 풀기', '①14 ①39', (d, n) => {
      if (n === 0) {
        const a = d.int(2, 6), c = d.int(1, 3), b = nz(d, -7, 7), e = nz(d, -7, 7), f = prodP(1, [[a, b], [c, e]]), right = ratRoots(f);
        if (right.length !== 2 || right.every(isInt) || gcd(Math.abs(b), a) !== 1 || gcd(Math.abs(e), c) !== 1 || f[1].p === 0) return null;
        const cands = [right.map(qneg), right.map((v) => (v.p === 0 ? v : qdiv(Q(1), v))), [right[0], qneg(right[1])], [qneg(right[0]), right[1]], right.map((v) => qmul(v, Q(2)))];
        const sets = [right];
        for (const s of d.shuffle(cands)) if (sets.length < 5 && !sets.some((o) => sameSet(o, s))) sets.push(s);
        if (sets.length < 5) return null;
        return choose(d, '다음 이차방정식의 해는?', sets.map((s) => [setH(s), sameSet(s, ratRoots(f))]), {
          figure: exq(eqH(polyH(f), '0')),
          explain: `좌변을 인수분해하면 ${nb(prodH(1, [[a, b], [c, e]]) + ' = 0')}이므로 ${setH(right)}이다.`,
          facts: { rule: 'solve-frac' }
        });
      }
      const m = d.int(2, 7), k = d.until(() => d.int(2, 9), (t) => gcd(t, m) === 1), f = P(-k * k, 0, m * m);
      const pmH = (v) => nb(X + ' = ±' + tx(v)), right = Q(k, m);
      const rows = [[pmH(right), true], [pmH(Q(m, k)), false], [nb(X + ' = ' + tx(right)), false], [pmH(Q(k * k, m * m)), false], [pmH(Q(k, m * m)), false]];
      return choose(d, '다음 이차방정식의 해는?', rows, {
        figure: exq(eqH(polyH(f), '0')),
        explain: `좌변을 인수분해하면 ${nb(prodH(1, [[m, k], [m, -k]]) + ' = 0')}이므로 ${nb(X + ' = ' + tx(qneg(right)))} 또는 ${nb(X + ' = ' + tx(right))}, 곧 ${pmH(right)}이다.`,
        facts: { rule: 'solve-frac-square' }
      });
    }, { count: 2 }),
    T('fac-arrange', '괄호를 풀고 정리한 뒤 인수분해하여 풀기', '①15', (d) => {
      const [u, w] = twoInts(d, -8, 8), e = dress(d, -(u + w), u * w);
      return intRootsQ(SOLVE, e.f, {
        figure: exq(eqH(e.L, e.R)),
        explain: `괄호를 풀고 우변의 항을 이항하여 정리하면 ${nb(polyH(monic(u, w)) + ' = 0')}, 좌변을 인수분해하면 ${nb(prodH(1, [[1, -u], [1, -w]]) + ' = 0')}이므로 ${setH([u, w])}이다.`,
        facts: { rule: 'arrange' }
      });
    }),
    T('fac-common', '양변에 같은 일차식이 있는 방정식', '①16', (d, n) => {
      if (n === 0) {
        // (x + a)(x + b) = k(x + a): 양변을 x + a 로 나누면 근 x = −a 를 잃는다.
        const a = nz(d, -6, 6), b = nz(d, -6, 6), k = d.until(() => nz(d, -5, 5), (t) => Math.abs(t) > 1), r2 = k - b;
        if (r2 === -a || r2 === a || a === b) return null;
        const L = prodH(1, [[1, a], [1, b]]), R = nb(kH(k) + '(' + linH(1, a) + ')'), f = psub(prodP(1, [[1, a], [1, b]]), pk(L1(1, a), k));
        return intRootsQ(SOLVE, f, {
          figure: exq(eqH(L, R)),
          explain: `우변을 좌변으로 이항하여 ${ej(nb(linH(1, a)), '으로/로')} 묶으면 ${nb('(' + linH(1, a) + ')(' + linH(1, b - k) + ') = 0')}이므로 ${setH([-a, r2])}이다. 양변을 ${ej(nb(linH(1, a)), '으로/로')} 나누면 ${ej(nb(X + ' = ' + iq(-a)), '을/를')} 잃는다.`,
          facts: { rule: 'common-int' }
        });
      }
      // (x + a)/p = (x + a)(x + b)/q: 근은 −a 와 q/p − b
      const a = nz(d, -6, 6), b = nz(d, -5, 5), p = d.int(2, 6), q = d.until(() => d.int(2, 9), (t) => t % p !== 0 && gcd(t, p) === 1);
      const r1 = Q(-a), r2 = qsub(Q(q, p), Q(b)), right = [r1, r2];
      if (qcmp(r1, r2) === 0) return null;
      const L = frac(linH(1, a), p), R = frac(prodH(1, [[1, a], [1, b]]), q);
      const cands = [[r2], [qneg(r1), r2], [r1, qneg(r2)], [r1, qsub(Q(p, q), Q(b))], [qneg(r1), qneg(r2)]];
      const sets = [right];
      for (const s of cands) if (sets.length < 5 && !sets.some((o) => sameSet(o, s))) sets.push(s);
      if (sets.length < 5) return null;
      const f = psub(pk(L1(1, a), q), pk(prodP(1, [[1, a], [1, b]]), p));
      return choose(d, '다음 이차방정식의 해는?', sets.map((s) => [setH(s), sameSet(s, ratRoots(f))]), {
        figure: exq(eqH(L, R)),
        explain: `양변에 ${p * q}${tail(p * q, '을/를')} 곱하면 ${nb(kH(q) + '(' + linH(1, a) + ') = ' + kH(p) + prodH(1, [[1, a], [1, b]]))}이다. 이항하여 ${ej(nb(linH(1, a)), '으로/로')} 묶으면 ${nb('(' + linH(1, a) + ')(' + linH(p, p * b - q) + ') = 0')}이므로 ${setH(right)}이다. 양변을 ${ej(nb(linH(1, a)), '으로/로')} 나누면 ${ej(nb(X + ' = ' + iq(-a)), '을/를')} 잃는다.`,
        facts: { rule: 'common-frac' }
      });
    }, { count: 2 }),
    T('fac-steps', '인수분해 풀이 과정의 빈칸', '①17', (d) => {
      const m = d.int(2, 4), r1 = d.int(1, 7), r2 = -d.until(() => d.int(1, 7), (t) => t !== r1), B2 = -(r1 + r2), C0 = r1 * r2, f = pk(monic(r1, r2), m);
      if (B2 === 0) return null;
      const rows = [eqH(polyH(f), '0'), eqH(nb(X2 + moreH([[B2, X]]) + ' ' + MINUS + ' ' + box(GANA[0])), '0'), eqH(nb('(' + linH(1, -r1) + ')(' + X + ' + ' + box(GANA[1]) + ')'), '0'), nb('∴ ' + X + ' = ' + r1 + ' 또는 ' + X + ' = ' + box(GANA[2]))];
      return M(`다음은 이차방정식 ${nb(ej(polyH(f) + ' = 0', '을/를'))} 인수분해를 이용하여 푸는 과정이다. ㈎, ㈏, ㈐에 알맞은 수를 차례로 구하시오.`, [
        { answer: -C0, signed: true, label: '㈎' }, { answer: -r2, signed: true, label: '㈏' }, { answer: r2, signed: true, label: '㈐' }
      ], {
        figure: procQ(rows),
        explain: `양변을 ${m}${tail(m, '으로/로')} 나누면 ${nb(polyH(monic(r1, r2)) + ' = 0')}이므로 ㈎는 ${-C0}이다. 인수분해하면 ${nb(prodH(1, [[1, -r1], [1, -r2]]) + ' = 0')}이므로 ㈏는 ${-r2}, ㈐는 ${iq(r2)}이다.`,
        facts: { calc: [[`-(${m * C0})/${m}`, 0], [`-(${m * C0})/(${m}*${r1})`, 1], [`(${m * C0})/(${m}*${r1})`, 2]] }
      });
    }),
    T('fac-common-root', '두 이차방정식의 공통인 근', '①18', (d) => {
      const c = nz(d, -6, 6), u = d.until(() => nz(d, -7, 7), (t) => t !== c && t !== -c), A = d.int(1, 3), wq = d.until(() => Q(nz(d, -9, 9), A), (t) => qcmp(t, Q(c)) !== 0 && qcmp(t, Q(u)) !== 0);
      const f = monic(c, u), g = pmul(P(-c, 1), P(-wq.p, wq.q)), e = dress(d, f[1].p, f[0].p, ['pq', 'xp', 'move']);
      if (f[1].p === 0) return null;
      const [B1, C1] = [f[1].p, f[0].p], [B2, C2] = [g[1].p, g[0].p], a2 = g[2].p;
      if (a2 * B1 - B2 === 0) return null;
      return oneRootQ(`다음 두 이차방정식의 공통인 근은?`, c, {
        figure: tagEq([eqH(e.L, e.R), eqH(polyH(g), '0')]),
        explain: `㉠을 정리하면 ${nb(polyH(f) + ' = 0')}, ${nb(prodH(1, [[1, -c], [1, -u]]) + ' = 0')}이므로 ${setH([c, u])}이다. ㉡을 인수분해하면 ${nb(prodH(1, [[1, -c], [wq.q, -wq.p]]) + ' = 0')}이므로 ${setH([Q(c), wq])}이다. 공통인 근은 ${nb(X + ' = ' + iq(c))}이다.`,
        facts: { value: `-((${a2})*(${C1})-(${C2}))/((${a2})*(${B1})-(${B2}))`, derived: [Math.abs(B1), Math.abs(C1)] }
      });
    }),
    T('fac-cond', '조건에 맞는 근 고르기', '①19', (d, n) => {
      if (n === 0) {
        // ax² = Bx + C 의 양수인 해(다른 근은 음수)
        const a = d.int(1, 3), p = d.int(1, 9), v = d.int(1, 9), f = pmul(P(-p, 1), P(v, a)), S = solve2(f);
        if (a * p - v === 0 || S.kind !== 'rational' || gcd(v, a) !== 1) return null;
        const R = linH(a * p - v, p * v), s = a * p + v;
        return oneRootQ(`이차방정식 ${nb(ej(eqH(polyH(P(0, 0, a)), R), '을/를'))} 만족시키는 양수 ${X}의 값은?`, p, {
          explain: `우변의 항을 이항하면 ${nb(polyH(f) + ' = 0')}, 인수분해하면 ${nb(prodH(1, [[1, -p], [a, v]]) + ' = 0')}이므로 ${setH(ratRoots(f))}이다. 이 가운데 양수는 ${p}이다.`,
          facts: { value: `((${a * p - v})+${s})/(2*${a})`, derived: [s, 2] }
        });
      }
      const kinds = d.shuffle(['negneg', 'pospos', 'mixed', 'mixed2', 'double']);
      const make = (kind) => {
        if (kind === 'negneg') { const [u, w] = twoInts(d, -9, -1); return [u, w]; }
        if (kind === 'pospos') { const [u, w] = twoInts(d, 1, 9); return [u, w]; }
        if (kind === 'mixed' || kind === 'mixed2') { const u = d.int(1, 9), w = -d.until(() => d.int(1, 9), (t) => t !== u); return [u, w]; }
        const t = d.int(1, 6); return [t, t];
      };
      const rows = kinds.map((kind) => { const [u, w] = make(kind), f = monic(u, w); return [nb(polyH(f) + ' = 0'), ratRoots(f).every((r) => r.p < 0)]; });
      const good = rows.find((r) => r[1]);
      return choose(d, '다음 이차방정식 가운데 해가 모두 음수인 것은?', rows, {
        explain: `각 이차방정식의 좌변을 인수분해하여 해를 구한다. ${good[0]}의 해는 모두 음수이고, 나머지는 양수인 해가 있다.`,
        facts: { rule: 'neg-roots' }
      });
    }, { count: 2 })
  ]);

  // ── 중근 ──
  B.addTypes('9-1-4', 'dbl', [
    T('dbl-solve', '완전제곱식으로 인수분해하여 중근 구하기', '①20', (d, n) => {
      if (n === 0) {
        const t = nz(d, -9, 9), f = P(t * t, -2 * t, 1);
        return oneRootQ(SOLVE, t, {
          figure: exq(eqH(polyH(f), '0')),
          explain: `좌변을 인수분해하면 ${nb(sqH(1, 1, -t) + ' = 0')}이므로 ${nb(X + ' = ' + iq(t))}(중근)이다.`,
          facts: { value: `-(${-2 * t})/2`, derived: [2], rule: 'double-int' }
        });
      }
      if (n === 1) {
        const m = d.int(2, 6), v = d.until(() => nz(d, -7, 7), (t) => gcd(Math.abs(t), m) === 1), f = sqP(1, m, v), root = Q(-v, m);
        return ansV('다음 이차방정식의 해를 구하시오.', root, 'frac', {
          figure: exq(eqH(polyH(f), '0')),
          explain: `좌변을 인수분해하면 ${nb(sqH(1, m, v) + ' = 0')}이므로 ${nb(linH(m, v) + ' = 0')}, ${nb(X + ' = ' + tx(root))}(중근)이다.`,
          facts: { value: `-(${2 * m * v})/(2*${m * m})`, derived: [2], rule: 'double-frac' }
        });
      }
      // 정리하면 완전제곱식이 되는 꼴
      const t = nz(d, -8, 8);
      let L, R;
      if (d.bool()) {
        const p = nz(d, -6, 6), q = -2 * t - p, c = t * t - p * q;
        if (q === 0 || p === q || c === 0) return null;
        L = nb(prodH(1, [[1, p], [1, q]]) + moreH([[c, '']])); R = '0';
      } else {
        const k = d.pick([1, 2, 3, 4, 6, 8, 9, 12, 16].filter((v) => (t * t) % v === 0).concat([-1])), e = -t * t / k, Bc = k - 2 * t;
        if (Bc === 0 || e === 0) return null;
        L = polyH(P(0, Bc, 1)); R = nb(kH(k) + '(' + linH(1, e) + ')');
      }
      return oneRootQ(SOLVE, t, {
        figure: exq(eqH(L, R)),
        explain: `괄호를 풀고 이항하여 정리하면 ${nb(polyH(P(t * t, -2 * t, 1)) + ' = 0')}, 좌변을 인수분해하면 ${nb(sqH(1, 1, -t) + ' = 0')}이므로 ${nb(X + ' = ' + iq(t))}(중근)이다.`,
        facts: { value: `-(${-2 * t})/2`, derived: [2 * Math.abs(t), 2], rule: 'double-arrange' }
      });
    }, { count: 3 }),
    T('dbl-pick', '중근을 갖는 이차방정식 가리기', '①21', (d) => {
      const t = nz(d, -6, 6), p = nz(d, -5, 5), k = d.int(2, 9), s = d.int(2, 7);
      const good = d.pick([[eqH(polyH(P(0, -2 * t, 1)), iq(-t * t)), P(t * t, -2 * t, 1)], [eqH(sqH(1, 1, -t), '0'), sqP(1, 1, -t)], [eqH(polyH(P(t * t, 0, 1)), polyH(P(0, 2 * t))), P(t * t, -2 * t, 1)]]);
      const bad = d.shuffle([
        [eqH(sqH(1, 1, p), String(k)), psub(sqP(1, 1, p), P(k))], [eqH(X2, String(s * s)), P(-s * s, 0, 1)], [eqH(polyH(P(0, 2 * s, 1)), String(s * s)), P(-s * s, 2 * s, 1)],
        [eqH(prodH(1, [[1, s], [1, -s]]), '0'), P(-s * s, 0, 1)], [eqH(polyH(P(s, 0, 1)), polyH(P(0, s + 1))), P(s, -(s + 1), 1)], [eqH(sqH(2, 1, -p), '8'), psub(sqP(2, 1, -p), P(8))]
      ]).slice(0, 4);
      const rows = [good].concat(bad).map(([h, f]) => [nb(h), solve2(f).kind === 'double']);
      return choose(d, '다음 이차방정식 가운데 중근을 갖는 것은?', rows, {
        explain: `모든 항을 좌변으로 이항하여 정리하였을 때 좌변이 완전제곱식이면 중근을 갖는다. ${ej(nb(good[0]), '은/는')} 정리하면 ${nb(sqH(1, 1, -t) + ' = 0')}이므로 중근 ${nb(X + ' = ' + iq(t))}${endJ(iq(t), '을/를')} 갖는다. ${nb('(' + linH(1, p) + ')' + sup(2) + ' = ' + k)}처럼 우변이 0이 아닌 양수이면 근이 두 개이다.`
      });
    }),
    T('dbl-const', '중근을 가질 조건으로 상수항의 미지수 구하기', '①22 ①48', (d, n) => {
      if (n === 0) {
        // x² + Bx + uk + v = w
        const h = nz(d, -6, 6), B2 = 2 * h, u = d.int(1, 5), v = nz(d, -9, 9), w = nz(d, -9, 9), num = h * h - v + w;
        if (num % u !== 0 || num === 0) return null;
        const k = num / u;
        return N(`이차방정식 ${ej(nb(polyH(P(0, B2, 1)) + ' + ' + (u === 1 ? '' : u) + vk + moreH([[v, '']]) + ' = ' + iq(w)), '이/가')} 중근을 가질 때, 수 ${vk}의 값은?`, k, {
          signed: true,
          explain: `우변을 이항하면 ${nb(polyH(P(0, B2, 1)) + ' + ' + (u === 1 ? '' : u) + vk + moreH([[v - w, '']]) + ' = 0')}이다. 중근을 가지려면 좌변이 완전제곱식이어야 하므로 (${X}의 계수의 ${frac(1, 2)})² = (상수항), 곧 ${nb(`${h < 0 ? '(' + iq(h) + ')' : h}² = ${u === 1 ? '' : u}${vk}${moreH([[v - w, '']])}`)}이고 ${nb(vk + ' = ' + iq(k))}이다.`,
          facts: { value: `((${B2})*(${B2})/4-(${v})+(${w}))/${u}`, derived: [4] }
        });
      }
      if (n === 1) {
        // Ax² + ABx + Ac0 + k = 0: 양변을 A 로 나누어 본다.
        const A = d.int(2, 5), h = nz(d, -5, 5), B2 = 2 * h, c0 = nz(d, -9, 9), k = A * (h * h - c0);
        if (k === 0) return null;
        return N(`이차방정식 ${nb(polyH(P(A * c0, A * B2, A)) + ' + ' + vk + ' = 0')}이 중근을 가질 때, 수 ${vk}의 값은?`, k, {
          signed: true,
          explain: `양변을 ${A}${tail(A, '으로/로')} 나누면 ${nb(polyH(P(c0, B2, 1)) + ' + ' + frac(vk, A) + ' = 0')}이다. 중근을 가지려면 ${nb(`${h < 0 ? '(' + iq(h) + ')' : h}² = ${iq(c0)} + `) + frac(vk, A)}이므로 ${nb(vk + ' = ' + iq(k))}이다.`,
          facts: { value: `${A}*((${A * B2})*(${A * B2})/(4*${A}*${A})-(${A * c0})/${A})`, derived: [4] }
        });
      }
      // x² + Bx + c − a = 0 이 x = m 을 중근으로
      const m = nz(d, -7, 7), B2 = -2 * m, c = nz(d, -9, 20), a = c - m * m;
      if (a === 0) return null;
      return valsQ(`이차방정식 ${nb(polyH(P(c, B2, 1)) + ' ' + MINUS + ' ' + va + ' = 0')}이 ${nb(ej(X + ' = ' + vm, '을/를'))} 중근으로 가질 때, 수 ${va}, ${vm}의 값은?`, [['a', a], ['m', m]], {
        explain: `중근을 가지려면 (${X}의 계수의 ${frac(1, 2)})² = (상수항)이므로 ${nb(`${-m < 0 ? '(' + iq(-m) + ')' : -m}² = ${iq(c)} ${MINUS} ${va}`)}, ${nb(va + ' = ' + iq(a))}이다. 이때 방정식은 ${nb(sqH(1, 1, -m) + ' = 0')}이므로 중근은 ${nb(X + ' = ' + iq(m))}, ${nb(vm + ' = ' + iq(m))}이다.`,
        facts: { calc: [[`${c}-(${B2})*(${B2})/4`, 0], [`-(${B2})/2`, 1]], derived: [4, 2] }
      });
    }, { count: 3 }),
    T('dbl-sq', '(x + p)² = k 꼴이 중근을 가질 조건', '①23', (d) => {
      const m = d.int(1, 4), p = nz(d, -6, 6), v = nz(d, -9, 9);
      return valsQ(`이차방정식 ${nb(sqH(m, 1, p) + ' + ' + vk + moreH([[v, '']]) + ' = 0')}이 중근을 가질 때, 수 ${vk}의 값과 중근을 구하시오.`, [['k', -v], ['<span>중근 ' + X + '</span>', -p]], {
        explain: `${nb(sqH(m, 1, p) + ' = ' + iq(-v) + ' ' + MINUS + ' ' + vk)}에서 중근을 가지려면 우변이 0이어야 하므로 ${nb(vk + ' = ' + iq(-v))}이다. 이때 ${nb(sqH(m, 1, p) + ' = 0')}이므로 중근은 ${nb(X + ' = ' + iq(-p))}이다.`,
        facts: { calc: [[`-(${v})`, 0], [`-(${p})`, 1]] }
      });
    }),
    T('dbl-b', '중근을 가질 조건으로 x의 계수 구하기', '①24', (d, n) => {
      if (n === 0) {
        const m = d.int(1, 3), c = d.until(() => d.int(1, 6), (t) => gcd(t, m) === 1 || m === 1), A = 2 * m * c, f0 = [m * m, c * c];
        const sets = [[-A, A], [A], [-A], [-m * c, m * c], [-A * 2, A * 2], [-(m * m + c * c), m * m + c * c]];
        const ok = (vals) => sameSet(vals, [-A, A]);
        const valsH = (vals) => vals.map((v) => nb(va + ' = ' + iq(v))).join(' 또는 ');
        const rows = [];
        for (const s of sets) if (rows.length < 5 && !rows.some((r) => r[0] === valsH(s))) rows.push([valsH(s), ok(s)]);
        return choose(d, `이차방정식 ${nb(polyH(P(0, 0, f0[0])) + ' + ' + va + X + ' + ' + f0[1] + ' = 0')}이 중근을 갖도록 하는 수 ${va}의 값을 모두 구한 것은?`, rows, {
          explain: `중근을 가지려면 좌변이 완전제곱식이어야 한다. ${nb(sqH(1, m, c) + ' = ' + polyH(P(c * c, A, m * m)))}, ${nb(sqH(1, m, -c) + ' = ' + polyH(P(c * c, -A, m * m)))}이므로 ${valsH([-A, A])}이다.`,
          facts: { rule: 'dbl-b-pick' }
        });
      }
      const m = d.int(2, 4), t = d.int(1, 6), p = 2 * m * m * t;
      return valsQ(`이차방정식 ${nb(polyH(P(0, 0, m * m)) + ' + ' + vp + X + ' + ' + (m * m * t * t) + ' = 0')}이 중근을 가질 때, 양수 ${vp}의 값과 중근을 구하시오.`, [['p', p], ['<span>중근 ' + X + '</span>', -t]], {
        explain: `중근을 가지려면 좌변이 완전제곱식이어야 하므로 ${nb(polyH(P(m * m * t * t, 0, m * m)) + ' + ' + vp + X + ' = ' + sqH(1, m, m * t))} 또는 ${nb(sqH(1, m, -m * t))}이다. ${vp}는 양수이므로 ${nb(vp + ' = ' + p)}이고, 이때 ${nb(sqH(1, m, m * t) + ' = 0')}에서 중근은 ${nb(X + ' = ' + iq(-t))}이다.`,
        facts: { calc: [[`2*${m * m}*${t}`, 0], [`-${m * m * t * t}/(${m * m}*${t})`, 1]], derived: [2, t] }
      });
    }, { count: 2 }),
    T('dbl-given', '중근이 주어질 때 계수 구하기', '①25', (d) => {
      const A = d.int(1, 5), t = nz(d, -5, 5), a = -2 * A * t, b = A * t * t;
      return valsQ(`이차방정식 ${nb(polyH(P(0, 0, A)) + ' + ' + va + X + ' + ' + vb + ' = 0')}이 ${nb(ej(X + ' = ' + iq(t), '을/를'))} 중근으로 가질 때, 수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
        explain: `${nb(X + ' = ' + iq(t))}${tail(Math.abs(t), '을/를')} 중근으로 갖고 ${X2}의 계수가 ${A}이므로 ${nb(sqH(A, 1, -t) + ' = 0')}이다. 전개하면 ${nb(polyH(P(b, a, A)) + ' = 0')}이므로 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다.`,
        facts: { calc: [[`-2*${A}*(${t})`, 0], [`${A}*(${t})*(${t})`, 1]], derived: [2] }
      });
    }),
    T('dbl-quad', '중근 조건이 문자의 이차방정식이 되는 것', '①26 심15', (d) => {
      // x² − (m + s)x + tm + u = 0 이 중근을 가질 조건: (m + s)² = 4(tm + u)
      const [m1, m2] = twoInts(d, -8, 9, (p, q) => (p + q) % 2 === 0), t = d.int(1, 4), s = 2 * t - (m1 + m2) / 2, num = s * s - m1 * m2;
      if (s === 0 || num % 4 !== 0) return null;
      const u = num / 4, R = Math.abs(m1 - m2), lo = Math.min(m1, m2), hi = Math.max(m1, m2);
      return twoValsAns(`이차방정식 ${nb(X2 + ' ' + MINUS + ' (' + vm + moreH([[s, '']]) + ')' + X + ' + ' + (t === 1 ? '' : t) + vm + moreH([[u, '']]) + ' = 0')}이 중근을 갖도록 하는 수 ${vm}의 값을 모두 구하시오.`, vm, lo, hi, {
        explain: `중근을 가지려면 (${X}의 계수의 ${frac(1, 2)})² = (상수항)이므로 ${nb('(' + vm + moreH([[s, '']]) + ')' + sup(2) + ' = 4(' + (t === 1 ? '' : t) + vm + moreH([[u, '']]) + ')')}이다. 정리하면 ${nb(poly([[1, vm + sup(2)], [-(m1 + m2), vm], [m1 * m2, '']]) + ' = 0')}이므로 ${nb(vm + ' = ' + iq(lo))} 또는 ${nb(vm + ' = ' + iq(hi))}이다.`,
        facts: { calc: [[`(-(2*(${s})-4*${t})-${R})/2`, 0], [`(-(2*(${s})-4*${t})+${R})/2`, 1]], derived: [R, 2, 4] }
      });
    })
  ]);

  // ── 제곱근을 이용한 풀이 ──
  B.addTypes('9-1-4', 'sqrt', [
    T('sq-basic', 'x² = k 꼴을 제곱근을 이용하여 풀기', '①28', (d, n) => {
      let a, rhs, want;
      if (n === 0) { a = d.int(1, 6); rhs = a * d.until(() => d.int(2, 30), squarefree); want = 'Z1'; }
      else if (n === 1) { a = d.int(1, 4); const s = d.int(2, 6), t = d.until(() => d.int(2, 11), squarefree); rhs = a * s * s * t; want = 'ZK'; }
      else { a = d.pick([2, 3, 5, 6, 7]); const m = d.until(() => d.int(2, 9), (v) => gcd(v, a) === 1); rhs = m * m; want = 'ZKR'; }
      const f = P(-rhs, 0, a), S = solve2(f);
      if (formOf(S.sol) !== want) return null;
      const e = d.int(0, 9), shown = d.bool() ? eqH(polyH(P(-rhs, 0, a)), '0') : eqH(polyH(P(-e, 0, a)), String(rhs - e));
      if (rhs - e <= 0) return null;
      return radRootAns(SOLVE, S, want, {
        figure: exq(shown),
        explain: `상수항을 이항하고 양변을 ${X2}의 계수로 나누면 ${nb(X2 + ' = ' + tx(Q(rhs, a)))}이다. ${X}는 ${tx(Q(rhs, a))}의 제곱근이므로 ${solH(S.sol)}이다.`,
        facts: { rule: 'basic-' + want }
      });
    }, { count: 3 }),
    T('sq-shift', '(x + p)² = q 꼴을 제곱근을 이용하여 풀기', '①29', (d, n) => {
      const p = nz(d, -6, 6);
      if (n === 3) {
        const m = d.int(1, 4), s = d.int(1, 9), f = psub(sqP(m, 1, p), P(m * s * s));
        if (Math.abs(p) === s) return null;
        const shown = d.bool() ? eqH(sqH(m, 1, p), String(m * s * s)) : eqH(sqH(m, 1, p) + ' ' + MINUS + ' ' + (m * s * s), '0');
        return intRootsQ(SOLVE, f, {
          figure: exq(shown),
          explain: `${nb(sqH(1, 1, p) + ' = ' + s * s)}이므로 ${nb(linH(1, p) + ' = ±' + s)}이다. 따라서 ${setH([-p - s, -p + s])}이다.`,
          facts: { rule: 'shift-int' }
        });
      }
      let m = 1, a = 1, q, want;
      if (n === 0) { q = d.until(() => d.int(2, 30), squarefree); want = 'P1'; }
      else if (n === 1) { m = d.int(1, 4); const s = d.int(2, 5), t = d.until(() => d.int(2, 10), squarefree); q = s * s * t; want = 'PK'; }
      else { a = d.int(2, 5); q = d.until(() => d.int(2, 30), squarefree); want = 'P1R'; if (gcd(Math.abs(p), a) !== 1) return null; }
      const f = psub(sqP(m, a, p), P(m * q)), S = solve2(f);
      if (formOf(S.sol) !== want) return null;
      const shown = d.bool() ? eqH(sqH(m, a, p), String(m * q)) : eqH(sqH(m, a, p) + ' ' + MINUS + ' ' + (m * q), '0');
      return radRootAns(SOLVE, S, want, {
        figure: exq(shown),
        explain: `${nb(sqH(1, a, p) + ' = ' + q)}이므로 ${nb(linH(a, p) + ' = ±' + (a === 1 ? (S.sol.k === 1 ? '' : S.sol.k) + rt(S.sol.q) : rt(q)))}이다. ${a === 1 ? '좌변의 상수항을 이항하면' : `상수항을 이항하고 양변을 ${a}${tail(a, '으로/로')} 나누면`} ${solH(S.sol)}이다.`,
        facts: { rule: 'shift-' + want }
      });
    }, { count: 4 }),
    T('sq-claim', 'ax² = b의 해에 대한 설명', '①30', (d) => {
      const ba = rt(frac(vb, va)), yes = [`${va} = 1이면 해는 ${nb(X + ' = ±' + rt(vb))}이다.`, `${va} = ${vb}이면 해는 ${nb(X + ' = ±1')}이다.`, `${va} &gt; 0이면 해는 ${nb(X + ' = ±' + ba)}이다.`, `${va} = 0이면 해가 없다.`, `${va} &lt; 0이면 해가 없다.`];
      const no = [
        [`${va} &lt; 0이면 해는 ${nb(X + ' = ±' + ba)}이다.`, `${va} &lt; 0이면 ${frac(vb, va)} &lt; 0이고 제곱하여 음수가 되는 수는 없으므로 해가 없다.`, yes[4]],
        [`${va} = ${vb}이면 해는 ${nb(X + ' = 1')}뿐이다.`, `${va} = ${vb}이면 ${nb(X2 + ' = 1')}이므로 해는 ${nb(X + ' = ±1')}이다.`, yes[1]],
        [`${va} = 0이면 해는 ${nb(X + ' = 0')}이다.`, `${va} = 0이면 ${nb('0 = ' + vb)}가 되어 성립하지 않으므로 해가 없다.`, yes[3]],
        [`${va} &gt; 0이면 해는 ${nb(X + ' = ±' + rt(frac(va, vb)))}이다.`, `${va} &gt; 0이면 ${nb(X2 + ' = ' + frac(vb, va))}이므로 해는 ${nb(X + ' = ±' + ba)}이다.`, yes[2]]
      ];
      return claimQ(d, `방정식 ${nb(va + X2 + ' = ' + vb)}에 대한 설명으로 옳지 않은 것은? (단, ${va}, ${vb}는 수이고 ${nb(vb + ' &gt; 0')}이다.)`, yes, no, false);
    }),
    T('sq-given', '(x + p)² = q 꼴의 해가 주어질 때 상수 구하기', '①31', (d, n) => {
      const p = nz(d, -6, 6), k = d.int(1, 3), q = d.until(() => d.int(2, 13), squarefree), sol = { p, k, q, r: 1 };
      if (n === 0) {
        return valsQ(`이차방정식 ${nb(eqH('(' + X + ' + ' + va + ')' + sup(2), vb))}의 해가 ${solH(sol)}일 때, 수 ${va}, ${vb}의 값은?`, [['a', -p], ['b', k * k * q]], {
          explain: `${nb('(' + X + ' + ' + va + ')' + sup(2) + ' = ' + vb)}에서 ${nb(X + ' + ' + va + ' = ±' + rt(vb))}, ${nb(X + ' = ' + MINUS + va + ' ± ' + rt(vb))}이다. ${ej(solH(sol), '과/와')} 견주면 ${nb(va + ' = ' + iq(-p))}이고 ${nb(rt(vb) + ' = ' + (k === 1 ? '' : k) + rt(q))}이므로 ${nb(vb + ' = ' + k * k * q)}이다.`,
          facts: { calc: [[`-(${p})`, 0], [`${k}*${k}*${q}`, 1]] }
        });
      }
      const m = d.int(2, 6);
      return valsQ(`이차방정식 ${nb(eqH(m + '(' + X + ' + ' + va + ')' + sup(2) + ' ' + MINUS + ' ' + vb, '0'))}의 해가 ${solH(sol)}일 때, 수 ${va}, ${vb}의 값은?`, [['a', -p], ['b', m * k * k * q]], {
        explain: `${nb('(' + X + ' + ' + va + ')' + sup(2) + ' = ' + frac(vb, m))}에서 ${nb(X + ' = ' + MINUS + va + ' ± ')}${rt(frac(vb, m))}이다. ${ej(solH(sol), '과/와')} 견주면 ${nb(va + ' = ' + iq(-p))}이고 ${nb(frac(vb, m) + ' = ' + k * k * q)}이므로 ${nb(vb + ' = ' + m * k * k * q)}이다.`,
        facts: { calc: [[`-(${p})`, 0], [`${m}*${k}*${k}*${q}`, 1]] }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
