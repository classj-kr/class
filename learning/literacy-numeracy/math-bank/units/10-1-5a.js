// 고등학교 1학년(공통수학1) 1학기 5단원 여러 가지 방정식 — 단원 틀·도구와 앞쪽 묶음(삼차방정식과 사차방정식).
// 수집해 둔 교과서 2종(천재 T셀파 전인태·홍진곤, 2022 개정)의 평가 자료에서 뽑은 꼴 목록(기본꼴_1 38꼴, 기본꼴_2 24꼴, 심화꼴 4꼴)을 꼴마다 따져 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/10-1-5/싣기_대조표.md 에 있다.
// (연립이차방정식은 10-1-5b.js, 실력 문항은 10-1-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계(방정식과 부등식). 성취기준은 10공수1-02-07(간단한 삼차방정식과 사차방정식을 풀 수 있다),
// 10공수1-02-08(미지수가 2개인 연립이차방정식을 풀 수 있다)이다.
//
// 싣는 기준
//  - 교육과정 원문: 삼차·사차방정식은 계수가 실수이고 인수분해 공식·인수정리·조립제법으로 풀리는 것만, 연립이차방정식은 (일차, 이차)와
//    (이차, 이차) 가운데 한 이차식이 인수분해되는 것만 다룬다. 이 파일의 방정식은 모두 인수분해 공식·인수정리(조립제법)·치환으로 풀리게 수를 고른다.
//  - 하는 일이 다르면 다른 문제다: 푸는 길(인수분해 공식, 조립제법, 치환, A² − B²), 묻는 것(근 모두, 실근의 합·곱, 허근으로 만든 식, 계수, 범위, 개수)이
//    다르면 따로 싣는다. 같은 꼴에서 수만 바꾼 유형은 만들지 않았다.
//  - 답: 근은 끼워 넣는 칸으로 받는다 — 정수 근은 「x = [±][ ]」, 허근·무리근의 짝은 「x = [±][ ] ± √[ ] i」처럼 꼴마다 칸을 정한다.
//    한 유형의 칸 모양은 씨앗이 바뀌어도 같다(칸 모양이 답을 흘리지 않게 근의 꼴이 같은 수만 고른다). 정수 근 여럿은 차례를 따지지 않는다.
//    근의 집합이 부호를 바꾸어도 같아지는 방정식(±2, ±3 따위)은 고르지 않는다 — 부호를 뒤집은 답이 맞게 되지 않게.
//  - ②12·②15(두 식이 모두 인수분해되지 않는 이차식)는 변끼리 더하고 빼면 x + y(일차식)와 xy 가 나와 「일차식과 이차식」의 연립이 된다.
//    2022 교과서(전인태) 대단원 평가에 실린 꼴이라 실었다(꼴 목록의 [범위 밖 의심] — 판단이 갈리는 곳). 상수항을 없애 인수분해하는 풀이는 쓰지 않는다.
//  - 삼차방정식의 근과 계수의 관계(α + β + γ = −b/a)는 2022 교육과정에 없으므로 풀이에 쓰지 않는다. 근을 직접 구하거나 인수정리로 푼다.
//  - 참·거짓과 보기의 옳고 그름은 손으로 적지 않고 코드로 가린다(복소수 값을 셈하거나 근의 집합을 견준다).
//  - 원문 답이 틀린 곳(전교 대단원 06의 HWP 식 −2x — 쪽 그림대로 +2x)은 따르지 않는다. 답은 모두 코드가 셈한다.
//  - 검사 근거: 근의 칸은 나머지 이차식의 계수 a, b, c 로 근의 공식을 다시 셈한 식(facts.calc)이고, 글에 보이지 않는 수(인수정리로 찾은 근,
//    나머지 이차식의 계수, 판별식의 제곱근)는 facts.unseen 에 밝힌다(seal 이 밝히기로 한 수 밖의 수가 나오면 오류를 낸다).
//
// 뺀 것과 까닭(10-1-5b.js, 10-1-5c.js 의 것까지 여기에 모아 적는다)
//  - 앞 학년 기댐이 범위 밖으로 의심되는 것: ②24 각의 이등분선이 대변을 나누는 비(AB : BC = AD : DC)는 2022 중학교 원문의 용어·성취기준에 없다.
//  - 뜻 없는 셈: ①10의 변형 |α| + |β| + |γ|, 가장 큰 근 + 가장 작은 근(근을 구해 더하기만 한다 — 근을 칸마다 묻는 ①6과 같은 일),
//    ①16의 변형 α² + β² + γ² + δ²(두 이차식에서 따로 구한 값을 더하기만 한다), ①33의 변형 f(1) + … + f(5)(αⁿ + βⁿ 을 다섯 번 셈해 더하기만 한다 — αⁿ + βⁿ 하나를 묻는 유형으로 실음), ②22의 x² + y²(부러진 높이를 묻도록 바꿈),
//    심4의 15(a − b)(a, b 를 칸마다 묻도록 바꿈).
//  - 같은 일이어서 한 번만 실은 것(대조표의 「겹침」): 근의 꼴만 다른 같은 풀이(①1의 분수 꼴 근, ①6·①8의 중근이 낀 사차방정식, ①14의 X 가 중근인 것,
//    ①35의 무리수 길이), ①23의 변형 「한 근으로 a 를 구한 뒤 나머지 두 근의 α² + β²」(①23과 ①11을 이은 것), ①30의 1/(1 + ω) + 1/(1 + ω²).
//  - 서술형 전용: ①12의 「두 방법 비교」, ①28의 「ω² = ω̄ 설명」은 값·짝짓기를 묻는 꼴로 바꾸었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, table, N, M, C, F, inline } = B.kit;
  const { MINUS, gcd, Q, tx, nb, tail, V, sup, fit, rt, grp, sqParts, radAns, ineqAns, sys } = B.kit.mid;
  const STD3 = '10공수1-02-07', STD2 = '10공수1-02-08';
  const X = V('x'), Y = V('y'), I = V('i'), W_ = V('ω');
  const va = V('a'), vb = V('b'), vk = V('k'), vm = V('m'), vp = V('p'), vq = V('q');
  const iq = (n) => tx(Q(n));
  const sT = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const isSq = (n) => n >= 0 && Number.isInteger(Math.sqrt(n));
  const sqfree = (n) => n >= 2 && sqParts(n)[0] === 1;
  const gcd3 = (a, b, c) => gcd(gcd(Math.abs(a), Math.abs(b)), Math.abs(c));

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(facts.derived)가 아닌 수가 나오면 오류를 낸다.
  function seal(item) {
    const f = item.facts || {}, derived = new Set((f.derived || []).map((n) => Math.abs(Number(n))).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
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
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 6000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: (/심/.test(ref) ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')', make: retry(make) }, more || {});

  // ── 다항식(정수 계수, 낮은 차수부터) ──
  const pTrim = (p) => { const o = p.slice(); while (o.length > 1 && o[o.length - 1] === 0) o.pop(); return o; };
  const pAdd = (p, q) => pTrim(Array.from({ length: Math.max(p.length, q.length) }, (_, i) => (p[i] || 0) + (q[i] || 0)));
  const pSc = (p, k) => pTrim(p.map((c) => c * k));
  const pSub = (p, q) => pAdd(p, pSc(q, -1));
  const pMul = (p, q) => { const o = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => { o[i + j] += a * b; })); return pTrim(o); };
  const pEval = (p, x) => p.reduce((s, c, i) => s + c * x ** i, 0);
  const fromRoots = (roots) => roots.reduce((acc, r) => pMul(acc, [-r, 1]), [1]);
  const maxCoef = (p) => Math.max(...p.map(Math.abs));
  // 조립제법: p 를 x − r 로 나눈 몫과 나머지
  function synth(p, r) {
    const hi = p.slice().reverse(), out = [hi[0]];
    for (let i = 1; i < hi.length; i += 1) out.push(hi[i] + r * out[i - 1]);
    const rem = out.pop();
    return { q: out.reverse(), rem };
  }
  // 정수 근(가장 작은 절댓값부터 찾는다 — 풀이에 처음 대는 근)
  const intRootsOf = (p) => { const c0 = Math.abs(p.find((c) => c !== 0)) || 1, out = []; for (let k = 1; k <= c0 * Math.abs(p[p.length - 1]); k += 1) for (const r of [k, -k]) if (pEval(p, r) === 0 && !out.includes(r)) out.push(r); if (p[0] === 0) out.unshift(0); return out; };
  // 다항식의 글(내림차순). v: 문자 이름
  const VX = (v, k) => (k === 0 ? '' : k === 1 ? V(v) : V(v) + sup(k));
  const termsOf = (p, v) => p.map((c, i) => [c, VX(v || 'x', i)]).reverse();
  function polyH(p, v) {
    const live = termsOf(p, v).filter(([c]) => c !== 0);
    if (!live.length) return '0';
    return live.map(([c, h], i) => (i === 0 ? (c < 0 ? MINUS : '') : c < 0 ? ' ' + MINUS + ' ' : ' + ') + (h && Math.abs(c) === 1 ? '' : Math.abs(c)) + h).join('');
  }
  const eqH = (L, R) => L + ' = ' + R;
  // x − r 의 글(r = 0 이면 x)
  const linH = (r, v) => (r === 0 ? V(v || 'x') : V(v || 'x') + (r > 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(r));
  // 근 0 이 주는 인수 x 는 앞에 쓴다(x(x − 3)).
  const facH = (roots, v) => roots.filter((r) => r === 0).concat(roots.filter((r) => r !== 0)).map((r) => (r === 0 ? V(v || 'x') : '(' + linH(r, v) + ')')).join('');
  const parH = (h) => '(' + h + ')';
  // 항 하나: 계수 c 와 글 h(계수 1 생략). first 이면 + 를 적지 않는다.
  const termH = (c, h, first) => (c === 0 ? '' : (first ? (c < 0 ? MINUS : '') : c < 0 ? ' ' + MINUS + ' ' : ' + ') + (h && Math.abs(c) === 1 ? '' : Math.abs(c)) + h);
  const sumH = (pairs) => { const live = pairs.filter(([c]) => c !== 0); return live.length ? live.map(([c, h], i) => termH(c, h, i === 0)).join('') : '0'; };

  // ── 식의 너비 어림과 그리기 ──
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
          w += inner; continue;
        }
        const next = s.indexOf('<', pos), chunk = s.slice(pos, next < 0 ? s.length : next); pos = next < 0 ? s.length : next; w += textW(chunk);
      }
      return w;
    }
    return inside();
  }
  // 그림 자리에 적는 식(휴대폰 너비에 맞게 글씨를 줄인다). 실제 사이트의 읽기 글꼴에서도 넘치지 않게 넉넉히 잡는다.
  const exq = (h) => '<span class="mb-expr"' + fit(1.08 * emW(h) + 0.4) + '>' + h + '</span>';
  // 여러 줄 식(글씨 크기는 가장 긴 줄에 맞춘다)
  const exLines = (list) => { const style = fit(1.08 * Math.max(...list.map(emW)) + 0.4); return lines(list.map((h) => '<span class="mb-expr"' + style + '>' + h + '</span>')); };
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
  const keep = (h) => (emW(h) < 11 ? nb(h) : chunks(h));
  // 식 뒤의 토씨: 읽을 때 끝나는 소리에 맞춘다(제곱으로 끝나면 받침, 분수는 분자, 수는 그 수, i·x 는 받침 없음, m·n·k 는 받침 없음(엠·엔은 받침)).
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

  // ── 이차방정식의 근 ──
  // ax² + bx + c = 0(a > 0)의 근. D 가 제곱수가 아니면 sol = { p, k, t, r, im }: (p ± k√t ⋅ (i))/r(더 줄일 수 없게, t = 1 이면 근호 없이 k).
  function quad(a, b, c) {
    const D = b * b - 4 * a * c;
    if (D === 0) return { a, b, c, D, kind: 'double', root: Q(-b, 2 * a) };
    if (D > 0 && isSq(D)) { const s = Math.sqrt(D); return { a, b, c, D, s, kind: 'rational', roots: [Q(-b - s, 2 * a), Q(-b + s, 2 * a)] }; }
    const [s, t] = sqParts(Math.abs(D)), g = gcd3(b, s, 2 * a);
    return { a, b, c, D, s, g, kind: D < 0 ? 'complex' : 'irr', sol: { p: -b / g, k: s / g, t, r: 2 * a / g, im: D < 0 } };
  }
  // 근호·허수단위가 든 짝 근의 글: 1 ± √3i, −2 ± 2√3i, ±√2i, 3 ± √5
  function pmH(s) {
    const body = s.t === 1 ? (s.k === 1 && s.im ? '' : String(s.k)) : (s.k === 1 ? '' : s.k) + rt(s.t);
    const rad = body + (s.im ? I : ''), top = s.p === 0 ? '±' + rad : iq(s.p) + ' ± ' + rad;
    return s.r === 1 ? top : s.p === 0 ? '±' + frac(rad, s.r) : frac(top, s.r);
  }
  // 짝 근의 칸 모양: 꼴의 이름 → 칸의 차례와 틀. (r = 1 인 꼴만)
  //  C1 p ± √t i / CK p ± k√t i / CI p ± ki / ZR ±√t i(허근) / ZI ±ki / R1 p ± √t / RK p ± k√t / ZS ±√t / ZN ±k
  const SHAPE = {
    C1: ['p', 't'], CK: ['p', 'k', 't'], CI: ['p', 'k'], ZR: ['t'], ZI: ['k'], R1: ['p', 't'], RK: ['p', 'k', 't'], ZS: ['t'], ZN: ['k']
  };
  const shapeOf = (s) => {
    if (s.r !== 1) return null;
    const z = s.p === 0, one = s.k === 1, plain = s.t === 1;
    if (s.im) return plain ? (z ? 'ZI' : one ? null : 'CI') : z ? (one ? 'ZR' : null) : one ? 'C1' : 'CK';
    return plain ? (z ? 'ZN' : null) : z ? (one ? 'ZS' : null) : one ? 'R1' : 'RK';
  };
  // 칸 번호 at 부터 짝 근의 틀을 짓는다.
  function pmTpl(shape, at) {
    const n = (i) => '{' + (at + i) + '}', im = shape[0] === 'C' || shape === 'ZR' || shape === 'ZI' ? I : '';
    if (shape === 'C1' || shape === 'R1') return grp(`${X} = ${n(0)} ±`) + ' ' + grp(rt(n(1)) + im);
    if (shape === 'CK' || shape === 'RK') return grp(`${X} = ${n(0)} ±`) + ' ' + grp(n(1) + rt(n(2)) + im);
    if (shape === 'CI') return grp(`${X} = ${n(0)} ± ${n(1)}${I}`);
    if (shape === 'ZR' || shape === 'ZS') return grp(`${X} = ±${rt(n(0))}${im}`);
    return grp(`${X} = ±${n(0)}${im}`);
  }
  // 짝 근을 근의 공식으로 다시 셈하는 식(a, b, c 는 나머지 이차식의 계수)
  function pmCalc(S) {
    const { a, b, c, s, g } = S, neg = S.D < 0;
    return { p: `(0-(${b}))/${g}`, k: `${s}/${g}`, t: neg ? `(4*${a}*(${c})-(${b})*(${b}))/(${s}*${s})` : `((${b})*(${b})-4*${a}*(${c}))/(${s}*${s})`, derived: [a, b, c, s, g, 2, 4] };
  }
  // 근을 답하는 문항. parts: { int: r } 정수 근 / { frac: [분자, 분모] } 분수 근 / { pm: quad(…) 의 결과, shape } 짝 근.
  // 정수 근이 둘 이상이면 차례를 따지지 않는다(정수 근뿐이면 unordered, 다른 칸이 있으면 정수 근마다 한 칸짜리 묶음).
  function rootsAns(text, parts, o) {
    const opt = o || {}, tpl = [], inputs = [], calc = [], shown = [], ints = [], derived = [];
    for (const part of parts) {
      const at = inputs.length;
      if (part.int !== undefined) {
        ints.push(at); tpl.push(grp(`${X} = {${at}}`)); inputs.push({ answer: part.int, signed: true }); shown.push(nb(X + ' = ' + iq(part.int)));
        calc.push([part.int < 0 ? `0-${-part.int}` : String(part.int), at]); derived.push(part.int);
      } else if (part.frac) {
        const [n, dd] = part.frac;
        tpl.push(grp(`${X} = ` + frac(`{${at}}`, `{${at + 1}}`))); inputs.push({ answer: n, signed: true }, { answer: dd });
        shown.push(nb(X + ' = ' + tx(Q(n, dd)))); calc.push([n < 0 ? `0-${-n}` : String(n), at], [String(dd), at + 1]); derived.push(n, dd);
      } else {
        const S = part.pm, shape = shapeOf(S.sol);
        if (shape !== part.shape) throw new Error('짝 근의 꼴이 ' + shape + ' 이다(유형은 ' + part.shape + ')');
        const cal = pmCalc(S);
        tpl.push(pmTpl(shape, at));
        SHAPE[shape].forEach((name, i) => { inputs.push(name === 'p' ? { answer: S.sol.p, signed: true } : { answer: S.sol[name] }); calc.push([cal[name], at + i]); });
        derived.push(...cal.derived); shown.push(nb(X + ' = ' + pmH(S.sol)));
      }
    }
    const allInt = ints.length === inputs.length;
    const more = { shown: shown.join(' 또는 '), facts: Object.assign({ calc, derived: derived.concat(opt.derived || []) }, opt.facts || {}), figure: opt.figure, explain: opt.explain };
    if (allInt && ints.length > 1) more.unordered = true; else if (ints.length > 1) more.blocks = ints.map((i) => [i]);
    return inline(text + (parts.some((p) => p.frac) ? ' <span style="white-space:nowrap">(단, 분수는 기약분수로 나타낸다.)</span>' : ''), tpl.join(' 또는 '), inputs, more);
  }
  // 근의 집합의 글(보기·풀이에 쓴다): [정수, …, { pm }]
  const setH = (roots) => roots.map((r) => (typeof r === 'number' ? nb(X + ' = ' + iq(r)) : r.frac ? nb(X + ' = ' + tx(Q(r.frac[0], r.frac[1]))) : nb(X + ' = ' + pmH(r.pm.sol || r.pm)))).join(' 또는 ');
  // 근의 집합의 열쇠(견주기): 정수와 짝 근을 글자로 바꾸어 늘어놓는다.
  const keyOf = (roots) => roots.map((r) => (typeof r === 'number' ? 'n' + r : r.frac ? 'f' + Q(r.frac[0], r.frac[1]).p + '/' + Q(r.frac[0], r.frac[1]).q : 'pm' + JSON.stringify(r.pm.sol || r.pm))).sort().join('|');
  // 보기 하나가 옳은 고르기. rows: [글, 옳은가]
  function choose(d, text, rows, o) {
    const list = d.shuffle(rows), opt = o || {};
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1]).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: true }, opt.facts || {}) }));
  }
  // 수 여럿(칸 앞에 「a =」)
  const valsQ = (text, pairs, o) => M(text, pairs.map(([n, v, sign]) => ({ answer: v, signed: sign !== false, lead: n + ' =' })), Object.assign({}, o, { shown: pairs.map(([n, v]) => nb(`${n} = ${iq(v)}`)).join(', ') }));
  // 서로 다른 0이 아닌 정수 여럿(부호를 바꾼 집합과 같지 않다)
  const asym = (list) => !list.every((r) => list.includes(-r));
  const distinctInts = (d, n, lo, hi, ok) => d.until(() => Array.from({ length: n }, () => d.int(lo, hi)), (list) => new Set(list).size === n && !list.includes(0) && asym(list) && (!ok || ok(list)));

  // ── 복소수(소수 셈 — 보기의 참·거짓을 가릴 때) ──
  const cx = (re, im) => ({ re, im: im || 0 });
  const cadd = (u, w) => cx(u.re + w.re, u.im + w.im), csub = (u, w) => cx(u.re - w.re, u.im - w.im);
  const cmul = (u, w) => cx(u.re * w.re - u.im * w.im, u.re * w.im + u.im * w.re);
  const cdiv = (u, w) => { const n = w.re * w.re + w.im * w.im; return cx((u.re * w.re + u.im * w.im) / n, (u.im * w.re - u.re * w.im) / n); };
  const cpow = (u, n) => { let out = cx(1); for (let i = 0; i < Math.abs(n); i += 1) out = cmul(out, u); return n < 0 ? cdiv(cx(1), out) : out; };
  const cnear = (u, w) => Math.abs(u.re - w.re) < 1e-7 && Math.abs(u.im - w.im) < 1e-7;
  const OMEGA = cx(-0.5, Math.sqrt(3) / 2), OMEGA_BAR = cx(-0.5, -Math.sqrt(3) / 2);
  // ω 의 거듭제곱 글
  const wp = (n) => (n === 1 ? W_ : W_ + sup(n));
  // 켤레복소수 ω̄ : 글자 위에 짧은 줄(글로 옮기면 「ω의 켤레」)
  const BAR = (name) => '<span style="position:relative;display:inline-block;padding-top:0.3em;line-height:1.12;white-space:nowrap"><span class="mb-sr">켤레 </span>' + name
    + '<svg class="mb-inline" aria-hidden="true" viewBox="0 0 10 4" preserveAspectRatio="none" style="position:absolute;left:12%;top:0.12em;width:80%;height:0.3em;overflow:visible"><path d="M0 2H10" style="fill:none;stroke:currentColor;stroke-width:0.9;vector-effect:non-scaling-stroke"/></svg></span>';
  const WB = BAR(W_);

  B.kit.m1015 = {
    STD3, STD2, X, Y, I, W_, WB, va, vb, vk, vm, vp, vq, iq, sT, range, isSq, sqfree, gcd3, stripH, seal, retry, T, H, pTrim, pAdd, pSc, pSub, pMul, pEval, fromRoots, maxCoef, synth,
    intRootsOf, polyH, eqH, linH, facH, parH, termH, sumH, emW, exq, exLines, chunks, keep, endJ, ej, quad, pmH, SHAPE, shapeOf, pmTpl, pmCalc, rootsAns, setH, keyOf, choose, valsQ,
    asym, distinctInts, cx, cadd, csub, cmul, cdiv, cpow, cnear, OMEGA, OMEGA_BAR, wp, BAR
  };

  // ── 문항 ──
  const SOLVE = '다음 방정식을 푸시오.';
  // 정수 근을 가진 다항식의 풀이 글: 「P(r) = 0이므로 … 조립제법으로 인수분해하면 …」
  const pName = V('P') + '(' + X + ')';
  const pAt = (r) => V('P') + '(' + iq(r) + ')';
  // 다항식 글의 x 에 수 v 를 넣은 글: 음수는 괄호로 감싸고, 양수는 계수(숫자) 뒤에 × 를 둔다(5³ − 4 × 5² + 5 + 6).
  const subH = (h, v) => { const parts = h.split(X); return parts.reduce((acc, part, i) => (i === 0 ? part : acc + (v < 0 ? '(' + iq(v) + ')' : (/\d$/.test(acc) ? ' × ' : '') + v) + part), ''); };
  // 몫을 이차식까지 줄여 가는 풀이: firsts 는 인수정리로 찾는 근들
  function synthTold(p, firsts) {
    let rest = p;
    for (const r of firsts) rest = synth(rest, r).q;
    return { rest, said: `${firsts.map(pAt).join(', ')} = 0이므로 ${firsts.map((r) => linH(r)).join(', ')}${endJ(linH(firsts[firsts.length - 1]), '은/는')} ${pName}의 인수이다. 조립제법으로 인수분해하면 ${nb(pName + ' = ' + facH(firsts) + parH(polyH(rest)))}이다.` };
  }
  // 근의 공식 한 줄
  const quadTold = (S) => (S.kind === 'rational' ? '' : `이차방정식 ${nb(polyH([S.c, S.b, S.a]) + ' = 0')}의 근은 근의 공식으로 ${nb(X + ' = ' + pmH(S.sol))}이다.`);

  B.addUnit({
    id: '10-1-5', grade: 10, semester: 1, no: 5, title: '여러 가지 방정식', version: 1,
    groups: [
      { id: 'fac', title: '인수분해 공식을 이용한 풀이', standard: STD3, types: [] },
      { id: 'syn', title: '인수정리와 조립제법을 이용한 풀이', standard: STD3, types: [] },
      { id: 'sub', title: '치환을 이용한 풀이', standard: STD3, types: [] },
      { id: 'cond', title: '근의 조건과 계수', standard: STD3, types: [] },
      { id: 'omega', title: '방정식 x³ = 1의 허근 ω', standard: STD3, types: [] },
      { id: 'use3', title: '삼차방정식과 사차방정식의 활용', standard: STD3, types: [] },
      { id: 'lin', title: '일차방정식과 이차방정식으로 이루어진 연립이차방정식', standard: STD2, types: [] },
      { id: 'quad', title: '두 이차방정식으로 이루어진 연립이차방정식', standard: STD2, types: [] },
      { id: 'scond', title: '연립이차방정식의 해의 조건', standard: STD2, types: [] },
      { id: 'use2', title: '연립이차방정식의 활용', standard: STD2, types: [] }
    ]
  });

  // ── 인수분해 공식을 이용한 풀이 ──
  B.addTypes('10-1-5', 'fac', [
    T('fac-cube', '세제곱의 합·차로 인수분해하여 풀기', '①1', (d) => {
      // x³ + a³ = 0(sg = 1) 또는 x³ − a³ = 0: 실근 r = −sg·a, 나머지는 x² + rx + r² = 0의 허근
      const a = d.pick([4, 6, 8, 10]), sg = d.pick([1, -1]), r = -sg * a, S = quad(1, r, r * r), cube = a ** 3;
      const eq = eqH(X + sup(3) + (sg > 0 ? ' + ' : ' ' + MINUS + ' ') + cube, '0');
      return rootsAns(SOLVE, [{ int: r }, { pm: S, shape: 'CK' }], {
        figure: exq(eq),
        explain: `${X + sup(3)} ${sg > 0 ? '+' : MINUS} ${cube} = ${X + sup(3)} ${sg > 0 ? '+' : MINUS} ${a}${sup(3)}이므로 좌변을 인수분해하면 ${nb('(' + linH(r) + ')(' + polyH([r * r, r, 1]) + ') = 0')}이다. ${nb(linH(r) + ' = 0')}에서 ${nb(X + ' = ' + iq(r))}, ${quadTold(S)}`,
        derived: [a]
      });
    }),
    T('fac-full', '완전세제곱식으로 인수분해하여 풀기', '①2', (d) => {
      // (px + q)³ = 0 의 근은 −q/p 하나(세 근이 같다)
      const p = d.pick([2, 3]), q = d.until(() => d.int(-5, 5), (v) => v !== 0 && gcd(p, Math.abs(v)) === 1), poly3 = [q ** 3, 3 * p * q * q, 3 * p * p * q, p ** 3];
      const v = Q(-q, p);
      return F(`방정식 ${keep(eqH(polyH(poly3), '0'))}의 근은?`, Math.abs(v.p), v.q, {
        signed: true, negative: v.p < 0, improper: Math.abs(v.p) > v.q, anyForm: true,
        explain: `${ej(polyH(poly3), '은/는')} ${nb('(' + polyH([q, p]) + ')' + sup(3))}과 같다(완전세제곱식). ${nb('(' + polyH([q, p]) + ')' + sup(3) + ' = 0')}에서 ${nb(polyH([q, p]) + ' = 0')}이므로 근은 ${nb(X + ' = ' + tx(v))} 하나이다(세 근이 모두 같다).`,
        facts: { value: `(0-(${q}))/${p}`, unseen: [p, Math.abs(q)] }
      });
    }),
    T('fac-quart', '제곱의 차를 두 번 써서 사차방정식 풀기', '①3', (d) => {
      const a = d.int(2, 5), a4 = a ** 4;
      return inline(SOLVE, grp(`${X} = ±{0}`) + ' 또는 ' + grp(`${X} = ±{1}${I}`), [{ answer: a }, { answer: a }], {
        figure: exq(eqH(X + sup(4) + ' ' + MINUS + ' ' + a4, '0')), shown: nb(`${X} = ±${a}`) + ' 또는 ' + nb(`${X} = ±${a}${I}`),
        explain: `좌변을 인수분해하면 ${nb(`(${X}${sup(2)} ${MINUS} ${a * a})(${X}${sup(2)} + ${a * a}) = 0`)}이다. ${nb(X + sup(2) + ' = ' + a * a)}에서 ${nb(X + ' = ±' + a)}, ${nb(X + sup(2) + ' = ' + MINUS + a * a)}에서 ${nb(X + ' = ±' + a + I)}이다.`,
        facts: { calc: [[`${a * a}/${a}`, 0], [`${a * a}/${a}`, 1]], unseen: [a * a, a] }
      });
    }),
    T('fac-zero', '공통인수로 묶고 세제곱의 차로 풀기 — 근을 모두 고르기', '①4', (d) => {
      // x⁴ + sg·a³x = 0 → x = 0, r = −sg·a, 허근 x² + rx + r² = 0
      const a = d.pick([2, 4, 6]), sg = d.pick([1, -1]), r = -sg * a, cube = a ** 3;
      const pmOf = (p, k) => ({ pm: { p, k, t: 3, r: 1, im: true } });
      const right = [0, r, pmOf(-r / 2, a / 2)];
      const rows = [right, [r, pmOf(-r / 2, a / 2)], [0, -r, pmOf(r / 2, a / 2)], [0, r, pmOf(r / 2, a / 2)], [0, r, pmOf(-r, a)]];
      const key = keyOf(right);
      return choose(d, `방정식 ${nb(eqH(X + sup(4) + (sg > 0 ? ' + ' : ' ' + MINUS + ' ') + cube + X, '0'))}의 근을 모두 바르게 구한 것은?`, rows.map((roots) => [setH(roots), keyOf(roots) === key]), {
        explain: `좌변을 ${X}로 묶으면 ${nb(X + '(' + X + sup(3) + (sg > 0 ? ' + ' : ' ' + MINUS + ' ') + cube + ') = 0')}, 다시 인수분해하면 ${nb(X + '(' + linH(r) + ')(' + polyH([r * r, r, 1]) + ') = 0')}이다. 따라서 ${setH(right)}이다. ${X}로 나누어 버리면 근 0을 잃는다.`
      });
    }),
    T('fac-check', '주어진 수가 삼차방정식의 해인지 가리기', '①5', (d) => {
      const roots = distinctInts(d, 3, -5, 5), p = fromRoots(roots);
      if (maxCoef(p) > 60) return null;
      const right = d.pick(roots), pool = d.shuffle(range(-6, 6).filter((v) => !roots.includes(v))).slice(0, 4);
      if (!pool.includes(-right) && !roots.includes(-right)) pool[0] = -right;
      const values = [right].concat(pool);
      return choose(d, `다음 중 삼차방정식 ${nb(eqH(polyH(p), '0'))}의 해인 것은?`, values.map((v) => [iq(v), pEval(p, v) === 0]), {
        explain: `각 수를 ${X}에 대입하여 좌변이 0이 되는지 본다. ${nb(X + ' = ' + iq(right))}${tail(Math.abs(right), '을/를')} 대입하면 좌변이 0이 된다. 나머지를 대입하면 좌변이 0이 되지 않는다(${pool.map((v) => nb(X + ' = ' + iq(v) + '일 때 ' + iq(pEval(p, v)))).join(', ')}).`
      });
    })
  ]);

  // ── 인수정리와 조립제법을 이용한 풀이 ──
  B.addTypes('10-1-5', 'syn', [
    T('syn-cubic', '인수정리와 조립제법으로 삼차방정식 풀기', '①6', (d, n) => {
      if (n === 0) {
        const roots = distinctInts(d, 3, -6, 6), p = fromRoots(roots);
        if (maxCoef(p) > 90) return null;
        const first = intRootsOf(p)[0], t = synthTold(p, [first]), others = roots.filter((r) => r !== first);
        return rootsAns(SOLVE, roots.map((r) => ({ int: r })), {
          figure: exq(eqH(polyH(p), '0')),
          explain: `${pName} = ${polyH(p)}${endJ(polyH(p), '으로/로')} 놓으면 ${t.said} 이차식을 인수분해하면 ${nb(facH(roots.slice().sort((x, y) => x - y)) + ' = 0')}이므로 ${setH(roots.slice().sort((x, y) => x - y))}이다.`,
          facts: { rule: 'cubic-ints' }, derived: others
        });
      }
      if (n === 1) {
        // 정수 근 하나 + 허근 p ± √t i (나머지 이차식 x² − 2px + p² + t)
        const r = d.until(() => d.int(-4, 4), (v) => v !== 0), pp = d.until(() => d.int(-3, 3), (v) => v !== 0), tt = d.pick([2, 3, 5, 6, 7]);
        const qd = [pp * pp + tt, -2 * pp, 1], p = pMul([-r, 1], qd), S = quad(1, -2 * pp, pp * pp + tt);
        if (maxCoef(p) > 90 || intRootsOf(p).length !== 1) return null;
        const t = synthTold(p, [r]);
        return rootsAns(SOLVE, [{ int: r }, { pm: S, shape: 'C1' }], {
          figure: exq(eqH(polyH(p), '0')),
          explain: `${pName} = ${polyH(p)}${endJ(polyH(p), '으로/로')} 놓으면 ${t.said} 따라서 ${nb(X + ' = ' + iq(r))} 또는 ${nb(polyH(qd) + ' = 0')}이고, ${quadTold(S)}`,
          facts: { rule: 'cubic-complex' }
        });
      }
      // 중근이 있는 삼차방정식: (x − r)²(x − s)
      const [r, s] = distinctInts(d, 2, -5, 5), p = fromRoots([r, r, s]);
      if (maxCoef(p) > 90) return null;
      const first = intRootsOf(p)[0], t = synthTold(p, [first]);
      return M(`삼차방정식 ${nb(eqH(polyH(p), '0'))}의 근 가운데 중근과 다른 한 근을 구하시오.`, [{ answer: r, signed: true, lead: '중근: ' + X + ' =' }, { answer: s, signed: true, lead: '다른 한 근: ' + X + ' =' }], {
        shown: `중근 ${nb(X + ' = ' + iq(r))}, 다른 한 근 ${nb(X + ' = ' + iq(s))}`,
        explain: `${pName} = ${polyH(p)}${endJ(polyH(p), '으로/로')} 놓으면 ${t.said} 이차식을 인수분해하면 ${nb('(' + linH(r) + ')' + sup(2) + '(' + linH(s) + ') = 0')}이므로 ${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '은/는')} 중근이고 다른 한 근은 ${nb(X + ' = ' + iq(s))}이다.`,
        facts: { calc: [[r < 0 ? `0-${-r}` : String(r), 0], [s < 0 ? `0-${-s}` : String(s), 1]], unseen: [Math.abs(r), Math.abs(s)].filter((v) => v > 1) }
      });
    }, { count: 3 }),
    T('syn-lead', '최고차항의 계수가 1이 아닌 삼차방정식 풀기', '①7', (d) => {
      const pp = d.pick([2, 3]), qq = d.until(() => d.int(-5, 5), (v) => v !== 0 && gcd(pp, Math.abs(v)) === 1), [r, s] = distinctInts(d, 2, -4, 4);
      const p = pMul([-qq, pp], fromRoots([r, s]));
      if (maxCoef(p) > 90) return null;
      const first = intRootsOf(p)[0], t = synthTold(p, [first]), rest = t.rest, other = first === r ? s : r;
      return rootsAns(SOLVE, [{ int: r }, { int: s }, { frac: [qq, pp] }], {
        figure: exq(eqH(polyH(p), '0')),
        explain: `${pName} = ${polyH(p)}${endJ(polyH(p), '으로/로')} 놓으면 ${t.said} ${ej(polyH(rest), '을/를')} 인수분해하면 ${nb('(' + linH(other) + ')(' + polyH([-qq, pp]) + ')')}이므로 ${setH([r, s, { frac: [qq, pp] }])}이다.`
      });
    }),
    T('syn-quartic', '조립제법을 두 번 써서 사차방정식 풀기', '①8', (d, n) => {
      const [r1, r2] = distinctInts(d, 2, -4, 4), pp = d.until(() => d.int(-3, 3), (v) => v !== 0), tt = d.pick([2, 3, 5, 6, 7]);
      const qd = n === 0 ? [pp * pp + tt, -2 * pp, 1] : [pp * pp - tt, -2 * pp, 1], p = pMul(fromRoots([r1, r2]), qd), S = quad(1, -2 * pp, qd[0]);
      if (maxCoef(p) > 99 || intRootsOf(p).length !== 2 || qd[0] === 0) return null;
      const firsts = intRootsOf(p).slice(0, 2), t = synthTold(p, firsts);
      return rootsAns(SOLVE, [{ int: r1 }, { int: r2 }, { pm: S, shape: n === 0 ? 'C1' : 'R1' }], {
        figure: exq(eqH(polyH(p), '0')),
        explain: `${pName} = ${polyH(p)}${endJ(polyH(p), '으로/로')} 놓으면 ${t.said} 따라서 ${nb(X + ' = ' + iq(r1))} 또는 ${nb(X + ' = ' + iq(r2))} 또는 ${nb(polyH(qd) + ' = 0')}이고, ${quadTold(S)}`,
        facts: { rule: n === 0 ? 'quartic-complex' : 'quartic-irr' }
      });
    }, { count: 2 }),
    T('syn-blank', '조립제법 풀이 과정의 빈칸', '①9', (d) => {
      // (x − a)(x − b)(x² + k²) — 조립제법 두 번의 표에서 빈칸을 묻는다.
      const [a, b] = d.until(() => [d.int(1, 3), d.int(-3, 3)], ([u, w]) => u !== w && w !== 0 && u !== -w), k = d.int(2, 3), p = pMul(fromRoots([a, b]), [k * k, 0, 1]);
      // 첫째 나눗셈(x − a): 계수 줄 c, 곱한 줄 m1, 몫 줄 q1 / 둘째 나눗셈(x − b): 곱한 줄 m2, 몫 줄 q2(칸 1~5)
      const c = p.slice().reverse(), q1 = synth(p, a).q.slice().reverse(), q2 = synth(synth(p, a).q, b).q.slice().reverse();
      const m1 = q1.map((v) => a * v), m2 = q2.map((v) => b * v);
      const A1 = q1[3], A2 = q2[2];
      if (A1 === A2) return null;
      const rows = [
        [iq(a)].concat(c.map(iq)),
        ['', ''].concat(m1.map(iq)),
        [''].concat(q1.map(iq), ['0']),
        [iq(b), ''].concat(m2.map(iq), ['']),
        [''].concat(q2.map(iq), ['0', ''])
      ];
      rows[2][4] = '㉠'; rows[4][3] = '㉡';
      if (rows.some((rw) => rw.length !== 6)) return null;
      const tbl = '<div class="mb-table-wrap"><table class="mb-table" aria-label="조립제법 표"><tbody>' + rows.map((rw, i) => '<tr>' + rw.map((cell, j) => `<td style="background:#fff;font-weight:400;${j === 0 ? 'border-right:2px solid #1f2933;' : ''}${i === 1 || i === 3 ? 'border-bottom:2px solid #1f2933;' : ''}padding:4px 9px">${cell}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>';
      const kI = (k === 1 ? '' : k) + I;
      return M(`다음은 사차방정식 ${nb(eqH(polyH(p), '0'))}${tail(0, '을/를')} 풀려고 ${nb(linH(a))}, ${nb(linH(b))}${endJ(linH(b), '으로/로')} 차례로 조립제법을 한 것이다. ㉠, ㉡에 알맞은 수와 이 방정식의 허근을 구하시오.`,
        [{ answer: A1, signed: true, lead: '㉠ =' }, { answer: A2, signed: true, lead: '㉡ =' }, { answer: k, lead: '허근: ' + X + ' = ±', unit: I }], {
          figure: tbl, shown: `㉠ = ${iq(A1)}, ㉡ = ${iq(A2)}, 허근 ${nb(X + ' = ±' + kI)}`,
          explain: `조립제법은 맨 앞의 수를 내려 쓰고, 나누는 수를 곱해 다음 칸에 더해 간다. ㉠은 ${iq(c[3])} + ${iq(m1[2])} = ${iq(A1)}, ㉡은 ${iq(q1[2])} + ${iq(m2[1])} = ${iq(A2)}이다. 따라서 ${nb(eqH(facH([a, b]) + '(' + X + sup(2) + ' + ' + k * k + ')', '0'))}이고, ${nb(X + sup(2) + ' = ' + MINUS + k * k)}에서 허근은 ${nb(X + ' = ±' + kI)}이다.`,
          facts: { calc: [[`(${c[3]})+(${m1[2]})`, 0], [`(${q1[2]})+(${m2[1]})`, 1], [`${k * k}/${k}`, 2]], derived: [k * k, k, q1[2]] }
        });
    }),
    T('syn-sum', '사차방정식의 실근의 합·허근의 합', '①10', (d, n) => {
      const [r1, r2] = distinctInts(d, 2, -4, 4), Bc = d.until(() => d.int(-4, 4), (v) => v !== 0), Cc = d.int(Math.floor(Bc * Bc / 4) + 1, Math.floor(Bc * Bc / 4) + 5);
      const qd = [Cc, Bc, 1], p = pMul(fromRoots([r1, r2]), qd);
      if (maxCoef(p) > 99 || r1 + r2 === 0 || r1 + r2 === -Bc || intRootsOf(p).length !== 2) return null;
      const firsts = intRootsOf(p), t = synthTold(p, firsts), S = quad(1, Bc, Cc);
      const ask = n === 0 ? '모든 실근의 합' : '모든 허근의 합', v = n === 0 ? r1 + r2 : -Bc;
      return N(`사차방정식 ${nb(eqH(polyH(p), '0'))}의 ${ask}은?`, v, {
        signed: true,
        explain: `${pName} = ${polyH(p)}${endJ(polyH(p), '으로/로')} 놓으면 ${t.said} ${nb(polyH(qd) + ' = 0')}의 판별식이 ${iq(Bc * Bc - 4 * Cc)} &lt; 0이므로 이 이차식이 주는 두 근은 허근이고, 실근은 ${iq(r1)}, ${iq(r2)}이다. ${n === 0 ? `따라서 모든 실근의 합은 ${iq(r1)} + ${r2 < 0 ? '(' + iq(r2) + ')' : iq(r2)} = ${iq(v)}이다.` : `두 허근 ${pmH(S.sol)}의 합은 ${iq(v)}이다.`}`,
        facts: { calc: [[n === 0 ? `(${r1})+(${r2})` : `0-(${Bc})`, 0]], unseen: [Math.abs(r1), Math.abs(r2), Math.abs(Bc)].filter((x) => x > 1) }
      });
    }, { count: 2 }),
    T('syn-imag', '두 허근으로 만든 식의 값', '①11', (d, n) => {
      const Bc = d.until(() => d.int(-4, 4), (v) => v !== 0), Cc = d.int(Math.floor(Bc * Bc / 4) + 1, Math.floor(Bc * Bc / 4) + 5);
      const reals = n === 0 ? distinctInts(d, 2, -3, 3) : [d.until(() => d.int(-4, 4), (v) => v !== 0)];
      const qd = [Cc, Bc, 1], p = pMul(fromRoots(reals), qd);
      if (maxCoef(p) > 99 || intRootsOf(p).length !== reals.length) return null;
      if (n === 1 && Bc % Cc === 0) return null;
      const firsts = intRootsOf(p), t = synthTold(p, firsts), deg = p.length - 1, word = deg === 3 ? '삼차방정식' : '사차방정식';
      const A = V('α'), Bt = V('β');
      const base = `${t.said} 두 허근 ${A}, ${Bt}는 이차방정식 ${nb(polyH(qd) + ' = 0')}의 근이므로 근과 계수의 관계에서 ${nb(A + ' + ' + Bt + ' = ' + iq(-Bc))}, ${nb(A + Bt + ' = ' + Cc)}이다.`;
      if (n === 0) {
        const v = Bc * Bc - 2 * Cc;
        return N(`${word} ${nb(eqH(polyH(p), '0'))}의 두 허근을 ${A}, ${Bt}라 할 때, ${nb(A + sup(2) + ' + ' + Bt + sup(2))}의 값은?`, v, {
          signed: true, explain: `${pName} = ${polyH(p)}${endJ(polyH(p), '으로/로')} 놓으면 ${base} 따라서 ${nb(A + sup(2) + ' + ' + Bt + sup(2) + ' = (' + A + ' + ' + Bt + ')' + sup(2) + ' ' + MINUS + ' 2' + A + Bt + ' = ' + iq(v))}이다.`,
          facts: { calc: [[`(${Bc})*(${Bc})-2*${Cc}`, 0]], unseen: [2, Math.abs(Bc), Cc] }
        });
      }
      const v = Q(-Bc, Cc);
      return F(`${word} ${nb(eqH(polyH(p), '0'))}의 두 허근을 ${A}, ${Bt}라 할 때, ${nb(frac(1, A) + ' + ' + frac(1, Bt))}의 값은?`, Math.abs(v.p), v.q, {
        signed: true, negative: v.p < 0, improper: Math.abs(v.p) > v.q, anyForm: true,
        explain: `${pName} = ${polyH(p)}${endJ(polyH(p), '으로/로')} 놓으면 ${base} 따라서 ${nb(frac(1, A) + ' + ' + frac(1, Bt) + ' = ' + frac(A + ' + ' + Bt, A + Bt) + ' = ' + tx(v))}이다.`,
        facts: { value: `(0-(${Bc}))/${Cc}`, unseen: [Math.abs(Bc), Cc] }
      });
    }, { count: 2 }),
    T('syn-kval', '세 근 α, β, γ로 만든 (k − α)(k − β)(k − γ)의 값', '①12', (d) => {
      const roots = distinctInts(d, 3, -4, 5), p = fromRoots(roots), k = d.until(() => d.int(-4, 6), (v) => !roots.includes(v) && v !== 0), v = pEval(p, k);
      if (maxCoef(p) > 60 || Math.abs(v) > 400) return null;
      const A = V('α'), Bt = V('β'), G = V('γ'), kk = (h) => '(' + iq(k) + ' ' + MINUS + ' ' + h + ')';
      return N(`삼차방정식 ${nb(eqH(polyH(p), '0'))}의 세 근을 ${A}, ${Bt}, ${V('γ')}라 할 때, ${nb(kk(A) + kk(Bt) + kk(G))}의 값은?`, v, {
        signed: true,
        explain: `세 근이 ${A}, ${Bt}, ${G}이므로 ${nb(polyH(p) + ' = (' + X + ' ' + MINUS + ' ' + A + ')(' + X + ' ' + MINUS + ' ' + Bt + ')(' + X + ' ' + MINUS + ' ' + G + ')')}이다. 양변에 ${nb(X + ' = ' + iq(k))}${tail(Math.abs(k), '을/를')} 대입하면 구하는 값은 ${nb(subH(polyH(p), k) + ' = ' + iq(v))}이다. (세 근 ${roots.map(iq).join(', ')}${tail(Math.abs(roots[2]), '을/를')} 구해 대입해도 된다.)`,
        facts: { calc: [[p.map((c, i) => (i === 0 ? `(${c})` : `(${c})*(${k})**${i}`)).join('+'), 0]], derived: [2, 3] }
      });
    })
  ]);

  // ── 치환을 이용한 풀이 ──
  const XX = (h) => '(' + h + ')';
  B.addTypes('10-1-5', 'sub', [
    T('sub-bi', 'x² = X로 놓고 사차방정식 풀기', '①13', (d, n) => {
      if (n === 0) {
        // (X − m)(X + w) → ±√m, ±√w i
        const [m, w] = d.until(() => [d.pick([2, 3, 5, 6, 7]), d.pick([2, 3, 5, 6, 7])], ([u, v]) => u !== v);
        const p = [-m * w, 0, w - m, 0, 1];
        if (w - m === 0) return null;
        return inline(SOLVE, grp(`${X} = ±${rt('{0}')}`) + ' 또는 ' + grp(`${X} = ±${rt('{1}')}${I}`), [{ answer: m }, { answer: w }], {
          figure: exq(eqH(polyH(p), '0')), shown: nb(`${X} = ±${rt(m)}`) + ' 또는 ' + nb(`${X} = ±${rt(w)}${I}`),
          explain: `${nb(X + sup(2) + ' = ' + V('X'))}로 놓으면 ${nb(polyH([-m * w, w - m, 1], 'X') + ' = 0')}, ${nb('(' + V('X') + ' ' + MINUS + ' ' + m + ')(' + V('X') + ' + ' + w + ') = 0')}이다. ${nb(X + sup(2) + ' = ' + m)}에서 ${nb(X + ' = ±' + rt(m))}, ${nb(X + sup(2) + ' = ' + MINUS + w)}에서 ${nb(X + ' = ±' + rt(w) + I)}이다.`,
          facts: { calc: [[String(m), 0], [String(w), 1]], unseen: [m, w] }
        });
      }
      // (X − s²)(X − m) → ±s, ±√m
      const s = d.int(1, 3), m = d.until(() => d.pick([2, 3, 5, 6, 7, 10]), (v) => v !== s * s), p = [s * s * m, 0, -(s * s + m), 0, 1];
      return inline(SOLVE, grp(`${X} = ±{0}`) + ' 또는 ' + grp(`${X} = ±${rt('{1}')}`), [{ answer: s }, { answer: m }], {
        figure: exq(eqH(polyH(p), '0')), shown: nb(`${X} = ±${s}`) + ' 또는 ' + nb(`${X} = ±${rt(m)}`),
        explain: `${nb(X + sup(2) + ' = ' + V('X'))}로 놓으면 ${nb(polyH([s * s * m, -(s * s + m), 1], 'X') + ' = 0')}, ${nb('(' + V('X') + ' ' + MINUS + ' ' + s * s + ')(' + V('X') + ' ' + MINUS + ' ' + m + ') = 0')}이다. ${nb(X + sup(2) + ' = ' + s * s)}에서 ${nb(X + ' = ±' + s)}, ${nb(X + sup(2) + ' = ' + m)}에서 ${nb(X + ' = ±' + rt(m))}이다.`,
        facts: { calc: [[`${s * s}/${s}`, 0], [`${s * s + m}-${s * s}`, 1]], unseen: [s * s, s] }
      });
    }, { count: 2 }),
    T('sub-common', '공통부분을 X로 놓고 사차방정식 풀기', '①14', (d) => {
      // 같은 합 σ 를 가진 두 쌍(u1, v1), (u2, v2): x² − σx = −uv
      const sig = d.until(() => d.int(-4, 4), (v) => v !== 0);
      const pairs = d.until(() => [d.int(-5, 6), d.int(-5, 6)], ([u1, u2]) => {
        const all = [u1, sig - u1, u2, sig - u2];
        return new Set(all).size === 4 && asym(all) && u1 < sig - u1 && u2 < sig - u2;
      });
      const [u1, u2] = pairs, v1 = sig - u1, v2 = sig - u2, Y1 = -u1 * v1, Y2 = -u2 * v2, A = -(Y1 + Y2), Bc = Y1 * Y2;
      if (A === 0 || Bc === 0 || Math.abs(Bc) > 200) return null;
      const inner = polyH([0, -sig, 1]), eq = eqH(XX(inner) + sup(2) + termH(A, XX(inner)) + termH(Bc, ''), '0');
      const roots = [u1, v1, u2, v2];
      return rootsAns(SOLVE, roots.map((r) => ({ int: r })), {
        figure: exq(eq),
        explain: `${nb(inner + ' = ' + V('X'))}로 놓으면 ${nb(polyH([Bc, A, 1], 'X') + ' = 0')}, ${nb(facH([Y1, Y2], 'X') + ' = 0')}이다. ${nb(inner + ' = ' + iq(Y1))}에서 ${nb(facH([u1, v1]) + ' = 0')}, ${nb(inner + ' = ' + iq(Y2))}에서 ${nb(facH([u2, v2]) + ' = 0')}이므로 ${setH(roots.slice().sort((a, b) => a - b))}이다.`,
        facts: { rule: 'sub-common' }
      });
    }),
    T('sub-prod', '곱 꼴 속의 공통부분을 X로 놓고 풀기', '①15', (d) => {
      const pp = d.pick([-4, -2, 2, 4]), u = d.int(-5, 5), v = -pp - u, Y1 = -u * v, tt = d.pick([2, 3, 5, 6, 7]), Y2 = tt - pp * pp / 4;
      if (u === v || Y1 === Y2) return null;
      const a = d.until(() => d.int(-6, 6), (w) => w !== 0), b = -(Y1 + Y2) - a, c = Y1 * Y2 - a * b;
      if (b === 0 || a === b || c === 0 || Math.abs(c) > 99) return null;
      const inner = polyH([0, pp, 1]), q1 = polyH([a, pp, 1]), q2 = polyH([b, pp, 1]);
      const eq = eqH(XX(q1) + XX(q2) + termH(c, ''), '0'), S = quad(1, pp, -Y2);
      return rootsAns(SOLVE, [{ int: Math.min(u, v) }, { int: Math.max(u, v) }, { pm: S, shape: 'R1' }], {
        figure: exq(eq),
        explain: `${nb(inner + ' = ' + V('X'))}로 놓으면 ${nb('(' + polyH([a, 1], 'X') + ')(' + polyH([b, 1], 'X') + ')' + termH(c, '') + ' = 0')}, 곧 ${nb(polyH([a * b + c, a + b, 1], 'X') + ' = 0')}이므로 ${nb(facH([Y1, Y2], 'X') + ' = 0')}이다. ${nb(inner + ' = ' + iq(Y1))}에서 ${nb(facH([Math.min(u, v), Math.max(u, v)]) + ' = 0')}, ${nb(inner + ' = ' + iq(Y2))}에서 ${nb(X + ' = ' + pmH(S.sol))}이다.`,
        derived: [u, v]
      });
    }),
    T('sub-four', '네 일차식의 곱 — 두 개씩 짝지어 공통부분 만들기', '①16', (d) => {
      // (x + a)(x + b)(x + c)(x + d) = K, a + d = b + c = σ
      const sig = d.until(() => d.int(-3, 5), (v) => v !== 0);
      const [a, b] = d.until(() => [d.int(-3, 4), d.int(-3, 4)], ([x1, x2]) => new Set([x1, x2, sig - x1, sig - x2]).size === 4 && x1 < x2 && x2 < sig - x2 && sig - x2 < sig - x1);
      const c = sig - b, dd = sig - a, u = d.int(-6, 6), v = -sig - u, Y1 = -u * v, K = (Y1 + a * dd) * (Y1 + b * c), Y2 = -(a * dd + b * c) - Y1;
      if (u === v || u === -v || K === 0 || Math.abs(K) > 400 || sig * sig + 4 * Y2 >= 0) return null;
      const f = (k) => (k === 0 ? X : '(' + polyH([k, 1]) + ')'), xf = (k) => (k === 0 ? V('X') : '(' + polyH([k, 1], 'X') + ')'), lhs = [a, b, c, dd].map(f).join('');
      const inner = polyH([0, sig, 1]), form = d.bool();
      const eq = form ? eqH(lhs, iq(K)) : eqH(lhs + termH(-K, ''), '0');
      return inline(`방정식 ${keep(eq)}의 실근을 모두 구하시오.`, grp(`${X} = {0}`) + ' 또는 ' + grp(`${X} = {1}`), [{ answer: Math.min(u, v), signed: true }, { answer: Math.max(u, v), signed: true }], {
        unordered: true, shown: setH([Math.min(u, v), Math.max(u, v)]),
        explain: `더하는 수의 합이 같은 것끼리 짝지으면 ${nb(f(a) + f(dd) + ' = ' + polyH([a * dd, sig, 1]))}, ${nb(f(b) + f(c) + ' = ' + polyH([b * c, sig, 1]))}이다. ${nb(inner + ' = ' + V('X'))}로 놓으면 ${nb(xf(a * dd) + xf(b * c) + ' = ' + iq(K))}, ${nb(facH([Y1, Y2], 'X') + ' = 0')}이다. ${nb(inner + ' = ' + iq(Y1))}에서 ${nb(facH([Math.min(u, v), Math.max(u, v)]) + ' = 0')}, ${nb(inner + ' = ' + iq(Y2))}${endJ(iq(Y2), '은/는')} 판별식이 ${iq(sig * sig + 4 * Y2)} &lt; 0이라 허근을 준다. 따라서 실근은 ${setH([Math.min(u, v), Math.max(u, v)])}이다.`,
        facts: { calc: [[`${Math.min(u, v)}`.replace(/^-/, '0-'), 0], [`${Math.max(u, v)}`.replace(/^-/, '0-'), 1]], derived: [u, v], rule: 'sub-four' }
      });
    }),
    T('sub-ab', 'A² − B² 꼴로 고쳐 인수분해하기', '①17', (d) => {
      // x⁴ − (k² + 2m)x² + m² = (x² − m)² − (kx)², 양수인 근의 합 = √(k² + 4m)
      const [k, m] = d.pick([[1, 1], [1, 3], [1, 4], [1, 5], [3, 1], [3, 2], [3, 3], [3, 5], [3, 6], [1, 7], [3, 7]]), nn = k * k + 4 * m;
      if (!sqfree(nn)) return null;
      const p = [m * m, 0, -(k * k + 2 * m), 0, 1], kx2 = k === 1 ? X + sup(2) : '(' + k + X + ')' + sup(2);
      return radAns(`사차방정식 ${nb(eqH(polyH(p), '0'))}의 모든 양수인 근의 합은?`, 1, nn, {
        explain: `${nb(X + sup(2) + ' = ' + V('X'))}로 놓은 ${polyH([m * m, -(k * k + 2 * m), 1], 'X')}${endJ(polyH([m * m, -(k * k + 2 * m), 1], 'X'), '은/는')} 정수 계수로 인수분해되지 않는다. ${nb(polyH(p) + ' = (' + X + sup(2) + ' ' + MINUS + ' ' + m + ')' + sup(2) + ' ' + MINUS + ' ' + kx2)} ${nb('= (' + polyH([-m, -k, 1]) + ')(' + polyH([-m, k, 1]) + ')')}이므로 ${nb(polyH([-m, -k, 1]) + ' = 0')}의 양수인 근은 ${frac(k + ' + ' + rt(nn), 2)}, ${nb(polyH([-m, k, 1]) + ' = 0')}의 양수인 근은 ${frac(MINUS + k + ' + ' + rt(nn), 2)}이다. 그 합은 ${rt(nn)}이다.`,
        facts: { calc: [[`${k}*${k}+4*${m}`, 0]], unseen: [k, m, 4] }
      });
    }),
    T('sub-shift', '일차식을 X로 놓고 삼차방정식 풀기', '①18', (d) => {
      const h = d.until(() => d.int(-3, 3), (v) => v !== 0), Xr = distinctInts(d, 3, -3, 4), xr = Xr.map((r) => r - h);
      if (new Set(xr).size !== 3 || xr.includes(0) || !asym(xr)) return null;
      const cp = fromRoots(Xr), base = '(' + polyH([h, 1]) + ')';
      const eq = eqH(sumH([[cp[3], base + sup(3)], [cp[2], base + sup(2)], [cp[1], base], [cp[0], '']]), '0');
      if (cp[2] === 0 || cp[0] === 0) return null;
      return rootsAns(SOLVE, xr.map((r) => ({ int: r })), {
        figure: exq(eq),
        explain: `${nb(polyH([h, 1]) + ' = ' + V('X'))}로 놓으면 ${nb(polyH(cp, 'X') + ' = 0')}이고, 인수정리와 조립제법으로 인수분해하면 ${nb(facH(Xr, 'X') + ' = 0')}이므로 ${V('X')} = ${Xr.map(iq).join(', ')}이다. ${nb(X + ' = ' + V('X') + (h > 0 ? ' ' + MINUS + ' ' + h : ' + ' + -h))}이므로 ${setH(xr.slice().sort((a, b) => a - b))}이다.`,
        facts: { rule: 'sub-shift' }
      });
    }),
    T('sub-realsum', '치환한 사차방정식의 실근·허근의 곱', '①20', (d, n) => {
      const pp = d.until(() => d.int(-4, 4), (v) => v !== 0), Y1 = d.int(Math.ceil(-pp * pp / 4) + 1, 6), Y2 = d.int(-9, Math.floor(-pp * pp / 4) - 1);
      if (Y1 === 0 || Y1 === Y2) return null;
      const inner = polyH([0, pp, 1]);
      if (n === 0) {
        const A = -(Y1 + Y2), Bc = Y1 * Y2;
        if (A === 0 || Bc === 0) return null;
        const eq = eqH(XX(inner) + sup(2) + termH(A, XX(inner)) + termH(Bc, ''), '0');
        return N(`사차방정식 ${keep(eq)}의 모든 실근의 곱은?`, -Y1, {
          signed: true,
          explain: `${nb(inner + ' = ' + V('X'))}로 놓으면 ${nb(facH([Y1, Y2], 'X') + ' = 0')}이다. ${nb(polyH([-Y1, pp, 1]) + ' = 0')}의 판별식은 ${iq(pp * pp + 4 * Y1)} &gt; 0이라 실근 둘을 주고, ${nb(polyH([-Y2, pp, 1]) + ' = 0')}의 판별식은 ${iq(pp * pp + 4 * Y2)} &lt; 0이라 허근을 준다. 따라서 모든 실근의 곱은 ${nb(polyH([-Y1, pp, 1]) + ' = 0')}의 두 근의 곱 ${iq(-Y1)}이다.`,
          facts: { calc: [[`0-(${Y1})`, 0]], unseen: [Math.abs(Y1), Math.abs(Y2)] }
        });
      }
      // (x² + px + q)² = x² + px + r: X = x² + px 의 두 값 Y1, Y2 의 합은 1 − 2q, 곱은 q² − r
      if ((1 - Y1 - Y2) % 2 !== 0) return null;
      const q = (1 - Y1 - Y2) / 2, rr = q * q - Y1 * Y2;
      if (q === 0 || rr === 0) return null;
      const L = XX(polyH([q, pp, 1])) + sup(2), R = polyH([rr, pp, 1]);
      return valsQ(`사차방정식 ${keep(eqH(L, R))}의 두 실근의 곱을 ${va}, 두 허근의 곱을 ${vb}라 할 때, ${va}, ${vb}의 값을 구하시오.`, [[va, -Y1], [vb, -Y2]], {
        explain: `${nb(inner + ' = ' + V('X'))}로 놓으면 ${nb('(' + polyH([q, 1], 'X') + ')' + sup(2) + ' = ' + polyH([rr, 1], 'X'))}, 곧 ${nb(polyH([q * q - rr, 2 * q - 1, 1], 'X') + ' = 0')}이므로 ${nb(facH([Y1, Y2], 'X') + ' = 0')}이다. ${nb(polyH([-Y1, pp, 1]) + ' = 0')}${endJ('0', '은/는')} 판별식이 양수라 두 실근을, ${nb(polyH([-Y2, pp, 1]) + ' = 0')}${endJ('0', '은/는')} 판별식이 음수라 두 허근을 준다. 따라서 ${nb(va + ' = ' + iq(-Y1))}, ${nb(vb + ' = ' + iq(-Y2))}이다.`,
        facts: { calc: [[`0-(${Y1})`, 0], [`0-(${Y2})`, 1]], unseen: [Math.abs(Y1), Math.abs(Y2)] }
      });
    }, { count: 2 }),
    T('sub-count', '치환한 사차방정식의 서로 다른 실근의 개수', '①21', (d) => {
      // X = x² + px 의 한 값은 중근(p² + 4Y1 = 0), 다른 값은 실근 둘이나 허근 둘
      const pp = d.pick([-4, -2, 2, 4]), Y1 = -pp * pp / 4, real = d.bool();
      const Y2 = real ? d.int(Y1 + 1, Y1 + 8) : d.int(Y1 - 8, Y1 - 1);
      const a = d.until(() => d.int(-6, 6), (w) => w !== 0), b = -(Y1 + Y2) - a, c = Y1 * Y2 - a * b;
      if (b === 0 || a === b || c === 0 || Math.abs(c) > 99) return null;
      const count = 1 + (real ? 2 : 0), q1 = polyH([a, pp, 1]), q2 = polyH([b, pp, 1]), inner = polyH([0, pp, 1]);
      const opts = [0, 1, 2, 3, 4];
      return C(`사차방정식 ${keep(eqH(XX(q1) + XX(q2) + termH(c, ''), '0'))}의 서로 다른 실근의 개수는?`, opts.map(String), count, {
        explain: `${nb(inner + ' = ' + V('X'))}로 놓으면 ${nb(polyH([a * b + c, a + b, 1], 'X') + ' = 0')}, ${nb(facH([Y1, Y2], 'X') + ' = 0')}이다. ${nb(polyH([-Y1, pp, 1]) + ' = 0')}${endJ('0', '은/는')} ${nb('(' + polyH([pp / 2, 1]) + ')' + sup(2) + ' = 0')}이라 중근 ${iq(-pp / 2)} 하나를 준다. ${nb(polyH([-Y2, pp, 1]) + ' = 0')}의 판별식은 ${iq(pp * pp + 4 * Y2)}이므로 ${real ? '서로 다른 두 실근을 준다' : '허근을 준다'}. 따라서 서로 다른 실근은 ${count}개이다.`,
        facts: { pick: { expr: real ? '1+2' : '1+0', options: opts } }
      });
    })
  ]);

  // ── 근의 조건과 계수 ──
  B.addTypes('10-1-5', 'cond', [
    T('cond-root', '한 근이 주어질 때 계수와 나머지 근 구하기', '①23', (d, n) => {
      if (n === 0) {
        // (x − r)(x² − 2px + p² − t), x 의 계수를 a 로 숨긴다.
        const r = d.until(() => d.int(-3, 3), (v) => v !== 0), pp = d.until(() => d.int(-3, 3), (v) => v !== 0), tt = d.pick([2, 3, 5, 6, 7]);
        const qd = [pp * pp - tt, -2 * pp, 1], p = pMul([-r, 1], qd), S = quad(1, -2 * pp, qd[0]);
        if (qd[0] === 0 || p[0] === 0 || p[1] === 0 || maxCoef(p) > 60) return null;
        const a = p[1], shown = sumH([[1, X + sup(3)], [p[2], X + sup(2)]]) + ' + ' + va + X + termH(p[0], '');
        return inline(`삼차방정식 ${nb(eqH(shown, '0'))}의 한 근이 ${iq(r)}일 때, 상수 ${va}의 값과 나머지 두 근을 구하시오.`, grp(`${va} = {0}`) + ', ' + pmTpl('R1', 1), [{ answer: a, signed: true }, { answer: S.sol.p, signed: true }, { answer: S.sol.t }], {
          shown: `${nb(va + ' = ' + iq(a))}, ${nb(X + ' = ' + pmH(S.sol))}`,
          explain: `${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 대입하면 ${nb(subH(sumH([[1, X + sup(3)], [p[2], X + sup(2)]]), r) + ' ' + (r < 0 ? MINUS + ' ' : '+ ') + (Math.abs(r) === 1 ? '' : Math.abs(r)) + va + termH(p[0], '') + ' = 0')}에서 ${r === 1 ? '' : nb((r === -1 ? MINUS : iq(r)) + va + ' = ' + iq(r * a)) + ', '}${nb(va + ' = ' + iq(a))}이다. 조립제법으로 나누면 ${nb('(' + linH(r) + ')(' + polyH(qd) + ') = 0')}이고, ${quadTold(S)}`,
          facts: { calc: [[`(0-(${r ** 3})-(${p[2] * r * r})-(${p[0]}))/(${r})`, 0], [pmCalc(S).p, 1], [pmCalc(S).t, 2]], derived: pmCalc(S).derived.concat([r ** 3, p[2] * r * r]) }
        });
      }
      // 사차: x⁴ + ax³ + c2x² + c1x + b = 0 의 두 근이 r1, r2
      const roots = distinctInts(d, 4, -4, 4), p = fromRoots(roots), [r1, r2, r3, r4] = roots;
      if (maxCoef(p) > 90 || p[3] === 0 || p[0] === 0 || p[2] === 0 || p[1] === 0) return null;
      const a = p[3], b = p[0], shown = X + sup(4) + ' + ' + va + X + sup(3) + termH(p[2], X + sup(2)) + termH(p[1], X) + ' + ' + vb;
      return inline(`사차방정식 ${nb(eqH(shown, '0'))}의 두 근이 ${iq(r1)}, ${iq(r2)}일 때, 상수 ${va}, ${vb}의 값과 나머지 두 근을 구하시오.`,
        grp(`${va} = {0}`) + ', ' + grp(`${vb} = {1}`) + ', ' + grp(`${X} = {2}`) + ' 또는 ' + grp(`${X} = {3}`), [{ answer: a, signed: true }, { answer: b, signed: true }, { answer: r3, signed: true }, { answer: r4, signed: true }], {
          blocks: [[2], [3]], shown: `${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}, ${setH([r3, r4])}`,
          explain: `두 근을 대입하면 ${va}, ${vb}에 대한 일차방정식 두 개를 얻고, 이를 풀면 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다. 조립제법으로 ${linH(r1)}, ${linH(r2)}${endJ(linH(r2), '으로/로')} 차례로 나누면 ${nb(facH([r1, r2]) + '(' + polyH(fromRoots([r3, r4])) + ') = 0')}이므로 나머지 두 근은 ${setH([r3, r4])}이다.`,
          facts: { calc: [[`0-(${r1})-(${r2})-(${r3})-(${r4})`, 0], [`(${r1})*(${r2})*(${r3})*(${r4})`, 1], [String(r3).replace(/^-/, '0-'), 2], [String(r4).replace(/^-/, '0-'), 3]], unseen: [r3, r4].map(Math.abs).filter((v) => v > 1) }
        });
    }, { count: 2 }),
    T('cond-imag', '한 허근이 주어질 때 실수 계수 구하기', '①24', (d) => {
      const pp = d.until(() => d.int(-3, 3), (v) => v !== 0), qq = d.int(1, 3), r = d.until(() => d.int(-4, 4), (v) => v !== 0);
      const qd = [pp * pp + qq * qq, -2 * pp, 1], p = pMul([-r, 1], qd), c = p[0];
      if (p[2] === 0 || p[1] === 0) return null;
      const root = iq(pp) + (qq === 1 ? ' + ' + I : ' + ' + qq + I);
      return valsQ(`계수가 실수인 삼차방정식 ${nb(eqH(X + sup(3) + ' + ' + va + X + sup(2) + ' + ' + vb + X + termH(c, ''), '0'))}의 한 근이 ${nb(root)}일 때, 실수 ${va}, ${vb}의 값을 구하시오.`, [[va, p[2]], [vb, p[1]]], {
        explain: `계수가 실수이므로 켤레복소수 ${nb(iq(pp) + ' ' + MINUS + ' ' + (qq === 1 ? '' : qq) + I)}도 근이다. 두 허근의 합은 ${iq(2 * pp)}, 곱은 ${pp * pp + qq * qq}이므로 좌변은 ${nb(polyH(qd))}${endJ(polyH(qd), '으로/로')} 나누어떨어진다. 나머지 근을 ${vk}라 하면 ${nb('(' + X + ' ' + MINUS + ' ' + vk + ')(' + polyH(qd) + ')')}의 상수항 ${nb(MINUS + (pp * pp + qq * qq) + vk)}${endJ('k', '이/가')} ${iq(c)}이므로 ${nb(vk + ' = ' + iq(r))}이다. 전개하면 ${nb(polyH(p))}이므로 ${nb(va + ' = ' + iq(p[2]))}, ${nb(vb + ' = ' + iq(p[1]))}이다.`,
        facts: { calc: [[`0-(${r})-2*(${pp})`, 0], [`(${pp * pp + qq * qq})+2*(${pp})*(${r})`, 1]], unseen: [Math.abs(r), 2, Math.abs(pp), pp * pp + qq * qq] }
      });
    }),
    T('cond-real', '삼차방정식의 근이 모두 실수가 되는(허근을 갖는) 조건', '①25', (d, n) => {
      // (x − r)(x² + 2bx + k)
      const r = d.until(() => d.int(-3, 3), (v) => v !== 0), b = d.until(() => d.int(-3, 3), (v) => v !== 0), c2 = 2 * b - r, m = -2 * b * r;
      const kx = (m === 0 ? vk : '(' + vk + termH(m, '') + ')') + X, kc = (-r === 1 ? ' + ' + vk : -r === -1 ? ' ' + MINUS + ' ' + vk : (-r > 0 ? ' + ' : ' ' + MINUS + ' ') + Math.abs(r) + vk);
      const eq = eqH(X + sup(3) + termH(c2, X + sup(2)) + ' + ' + kx + kc, '0');
      const ask = n === 0 ? '의 근이 모두 실수가 되도록' : '이 허근을 갖도록';
      return ineqAns(`삼차방정식 ${keep(eq)}${ask} 하는 실수 ${vk}의 값의 범위를 구하시오.`, n === 0 ? '<=' : '>', b * b, vk, {
        explain: `${nb(X + ' = ' + iq(r))}${tail(Math.abs(r), '을/를')} 대입하면 ${vk}의 값에 관계없이 좌변이 0이므로 ${linH(r)}${endJ(linH(r), '은/는')} 좌변의 인수이다. 조립제법으로 나누면 ${nb('(' + linH(r) + ')(' + X + sup(2) + termH(2 * b, X) + ' + ' + vk + ') = 0')}이다. ${n === 0 ? '근이 모두 실수이려면' : '허근을 가지려면'} ${nb(X + sup(2) + termH(2 * b, X) + ' + ' + vk + ' = 0')}의 판별식이 ${nb(frac(V('D'), 4) + ' = ' + b * b + ' ' + MINUS + ' ' + vk + (n === 0 ? ' ≥ 0' : ' &lt; 0'))}이어야 하므로 ${nb(vk + (n === 0 ? ' ≤ ' : ' &gt; ') + b * b)}이다.`,
        facts: { calc: [[`(${2 * b})*(${2 * b})/4`, 1]], unseen: [4, 2 * Math.abs(b)].filter((v) => v > 1), rule: 'cond-real-' + n }
      });
    }, { count: 2 })
  ]);

  // ── 방정식 x³ = 1의 허근 ω ──
  const wq = '방정식 ' + nb(X + sup(3) + ' = 1') + '의 한 허근을 ' + W_ + '라 할 때, ';
  B.addTypes('10-1-5', 'omega', [
    T('omega-fact', 'ω의 성질 가운데 옳지 않은 것', '①28', (d) => {
      const w = OMEGA, b = OMEGA_BAR, one = cx(1);
      // [글, 좌변 − 우변(복소수)] — 0이면 옳은 식
      // [글, 좌변 − 우변, 같은 것을 말하는 무리(옳은 식과 틀린 식이 한 문항에 함께 나오지 않게)]
      const rows = [
        [`${wp(3)} = 1`, csub(cpow(w, 3), one), 'cube'], [`${wp(2)} + ${W_} + 1 = 0`, cadd(cadd(cpow(w, 2), w), one), 'poly'], [`${WB} = ${wp(2)}`, csub(b, cpow(w, 2)), 'sq'],
        [`${W_}${WB} = 1`, csub(cmul(w, b), one), 'prod'], [`${W_} + ${WB} = ${MINUS}1`, cadd(cadd(w, b), one), 'sum'], [`${frac(1, W_)} = ${WB}`, csub(cdiv(one, w), b), 'recip'],
        [`${wp(3)} = ${MINUS}1`, cadd(cpow(w, 3), one), 'cube'], [`${W_} + ${WB} = 1`, csub(cadd(w, b), one), 'sum'], [`${W_}${WB} = ${MINUS}1`, cadd(cmul(w, b), one), 'prod'],
        [`${wp(2)} = ${MINUS}${WB}`, cadd(cpow(w, 2), b), 'sq'], [`${wp(2)} + ${W_} = 1`, csub(cadd(cpow(w, 2), w), one), 'poly'], [`${frac(1, W_)} = ${MINUS}${wp(2)}`, cadd(cdiv(one, w), cpow(w, 2)), 'recip']
      ].map(([h, v, topic]) => [nb(h), cnear(v, cx(0)), topic]);
      const bad = d.pick(rows.filter((r) => !r[1])), good = d.shuffle(rows.filter((r) => r[1] && r[2] !== bad[2] && !(bad[2] === 'recip' && r[2] === 'sq'))).slice(0, 4);
      return choose(d, wq + '다음 중 옳지 않은 것은? (단, ' + WB + '는 ' + W_ + '의 켤레복소수이다.)', good.map((r) => [r[0], false]).concat([[bad[0], true]]), {
        explain: `${nb(X + sup(3) + ' ' + MINUS + ' 1 = (' + X + ' ' + MINUS + ' 1)(' + X + sup(2) + ' + ' + X + ' + 1)')}이므로 ${W_}${endJ(W_, '과/와')} ${WB}는 ${nb(X + sup(2) + ' + ' + X + ' + 1 = 0')}의 두 근이다. 따라서 ${nb(wp(3) + ' = 1')}, ${nb(wp(2) + ' + ' + W_ + ' + 1 = 0')}, ${nb(W_ + ' + ' + WB + ' = ' + MINUS + '1')}, ${nb(W_ + WB + ' = 1')}, ${nb(WB + ' = ' + frac(1, W_) + ' = ' + wp(2))}이다. ${bad[0]}${endJ(bad[0], '은/는')} 옳지 않다.`
      });
    }),
    T('omega-pow', 'ω의 거듭제곱이 든 식의 값', '①29', (d, n) => {
      if (n === 0) {
        // c3·ω^(3k) + c·ω^(e2) + c·ω^(e1) + c0 (e2 ≡ 2, e1 ≡ 1)
        const k = d.int(1, 4), e2 = 3 * d.int(0, 3) + 2, e1 = 3 * d.int(0, 3) + 1, c3 = d.int(1, 5), c = d.int(2, 6), c0 = d.int(1, 9);
        if (e1 === e2 || 3 * k === e2 || 3 * k === e1) return null;
        const v = c3 + c0 - c, exps = d.shuffle([[c3, 3 * k], [c, e2], [c, e1]]);
        const h = exps.map(([cc, e], i) => (i ? ' + ' : '') + (cc === 1 ? '' : cc) + wp(e)).join('') + ' + ' + c0;
        return N(wq + `${nb(h)}의 값은?`, v, {
          signed: true,
          explain: `${W_}${endJ(W_, '은/는')} ${nb(X + sup(2) + ' + ' + X + ' + 1 = 0')}의 근이므로 ${nb(wp(3) + ' = 1')}, ${nb(wp(2) + ' + ' + W_ + ' = ' + MINUS + '1')}이다. ${[nb(wp(3 * k) + ' = 1')].concat(e2 > 2 ? [nb(wp(e2) + ' = ' + wp(2))] : [], e1 > 1 ? [nb(wp(e1) + ' = ' + W_)] : []).join(', ')}이므로 주어진 식은 ${nb(c3 + ' + ' + c + '(' + wp(2) + ' + ' + W_ + ') + ' + c0 + ' = ' + iq(v))}이다.`,
          facts: { calc: [[`${c3}+${c0}-${c}`, 0]] }
        });
      }
      if (n === 2) {
        // 1 + ω + ω² + ⋯ + ωᵐ 또는 ω + ω² + ⋯ + ωᵐ — 앞에서부터 세 항씩 묶으면 0, 남는 항으로 값이 정해진다(값이 수로 나오는 m 만)
        const st = d.pick([0, 1]), m = d.until(() => d.int(10, 40), (x) => (st === 0 ? x % 3 !== 1 : x % 3 !== 1)), cnt = m - st + 1, left = cnt % 3;
        const v = left === 0 ? 0 : st === 0 ? 1 : -1;
        const first = st === 0 ? ['1', W_, wp(2)] : [W_, wp(2), wp(3)];
        const h = first.concat(['⋯', wp(m)]).join(' + ');
        const restH = left === 0 ? '' : left === 1 ? wp(m) : wp(m - 1) + ' + ' + wp(m);
        return N(wq + `${nb(h)}의 값은?`, v, {
          signed: true,
          explain: `${nb(wp(2) + ' + ' + W_ + ' + 1 = 0')}이므로 연이은 세 항의 합은 늘 ${nb(W_ + sup(V('k')) + '(1 + ' + W_ + ' + ' + wp(2) + ') = 0')}이다. 항이 ${cnt}개이므로 앞에서부터 세 항씩 묶으면 ` + (left === 0 ? '남는 항이 없어 값은 0이다.' : `${nb(restH)}이 남는다. ${nb(wp(3) + ' = 1')}이므로 값은 ${nb(left === 1 ? wp(m) + ' = 1' : restH + ' = ' + W_ + ' + ' + wp(2) + ' = ' + MINUS + '1')}이다.`),
          facts: { calc: [[v === 0 ? '0' : v === 1 ? '1' : '0-1', 0]], rule: 'omega-sum' }
        });
      }
      const m = d.int(7, 40), v = m % 3 === 0 ? 2 : -1;
      return N(wq + `${nb(wp(m) + ' + ' + frac(1, wp(m)))}의 값은?`, v, {
        signed: true,
        explain: `${nb(wp(3) + ' = 1')}이므로 ${nb(wp(m) + ' = ' + (m % 3 === 0 ? '1' : wp(m % 3 === 1 ? 1 : 2)))}이다. ${m % 3 === 0 ? `따라서 주어진 식은 ${nb('1 + 1 = 2')}이다.` : `${nb(frac(1, W_) + ' = ' + wp(2))}, ${nb(frac(1, wp(2)) + ' = ' + W_)}이므로 주어진 식은 ${nb(W_ + ' + ' + wp(2) + ' = ' + MINUS + '1')}이다.`}`,
        facts: { calc: [[m % 3 === 0 ? '1+1' : '0-1', 0]], rule: 'omega-recip' }
      });
    }, { count: 3 }),
    T('omega-frac', 'ω가 든 분수식의 값', '①30', (d) => {
      const a = 3 * d.int(1, 5) + 2, b = 3 * d.int(1, 5) + 1, p = d.int(1, 5), q = d.int(1, 5);
      const v = -(p + q), h = frac((p === 1 ? '' : p) + wp(a), '1 + ' + wp(b)) + ' + ' + frac((q === 1 ? '' : q) + wp(b), '1 + ' + wp(a));
      // 소수 셈으로 다시 맞춰 본다
      const val = cadd(cmul(cx(p), cdiv(cpow(OMEGA, a), cadd(cx(1), cpow(OMEGA, b)))), cmul(cx(q), cdiv(cpow(OMEGA, b), cadd(cx(1), cpow(OMEGA, a)))));
      if (!cnear(val, cx(v))) return null;
      return N(wq + `${nb(h)}의 값은?`, v, {
        signed: true,
        explain: `${nb(wp(3) + ' = 1')}이므로 ${nb(wp(a) + ' = ' + wp(2))}, ${nb(wp(b) + ' = ' + W_)}이다. ${nb(wp(2) + ' + ' + W_ + ' + 1 = 0')}에서 ${nb('1 + ' + W_ + ' = ' + MINUS + wp(2))}, ${nb('1 + ' + wp(2) + ' = ' + MINUS + W_)}이므로 주어진 식은 ${nb(frac((p === 1 ? '' : p) + wp(2), MINUS + wp(2)) + ' + ' + frac((q === 1 ? '' : q) + W_, MINUS + W_) + ' = ' + iq(v))}이다.`,
        facts: { calc: [[`0-${p}-${q}`, 0]] }
      });
    }),
    T('omega-ab', 'ω의 다항식을 a + bω 꼴로 나타내기', '①31', (d) => {
      const c = Array.from({ length: 6 }, () => d.int(1, 9)), a = c[0] + c[3] - c[2] - c[5], b = c[1] + c[4] - c[2] - c[5];
      if (a === 0 || b === 0) return null;
      const h = c.map((cc, i) => (i ? ' + ' : '') + (i === 0 ? cc : (cc === 1 ? '' : cc) + wp(i))).join('');
      return valsQ(wq + `${keep(h + ' = ' + va + ' + ' + vb + W_)}${endJ(W_, '을/를')} 만족시키는 실수 ${va}, ${vb}의 값을 구하시오.`, [[va, a], [vb, b]], {
        explain: `${nb(wp(3) + ' = 1')}이므로 ${nb(wp(4) + ' = ' + W_)}, ${nb(wp(5) + ' = ' + wp(2))}이고 좌변은 ${nb((c[0] + c[3]) + ' + ' + (c[1] + c[4]) + W_ + ' + ' + (c[2] + c[5]) + wp(2))}이다. ${nb(wp(2) + ' = ' + MINUS + W_ + ' ' + MINUS + ' 1')}을 넣으면 ${nb(iq(a) + (b < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(b) === 1 ? '' : Math.abs(b)) + W_)}이므로 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다.`,
        facts: { calc: [[`${c[0]}+${c[3]}-${c[2]}-${c[5]}`, 0], [`${c[1]}+${c[4]}-${c[2]}-${c[5]}`, 1]] }
      });
    }),
    T('omega-neg', 'x³ = −1의 허근 ω로 만든 식의 값', '①33', (d, n) => {
      // ω, ω̄ 는 x² − x + 1 = 0 의 두 근: ω³ = −1, ω + ω̄ = 1, ωω̄ = 1, ω − 1 = ω²
      const table6 = [2, 1, -1, -2, -1, 1];
      const said = (low) => [`1 + 1 = 2`, `${W_} + ${WB} = 1`, `${wp(2)} + ${WB}${sup(2)} = (${W_} + ${WB})${sup(2)} ${MINUS} 2${W_}${WB} = ${MINUS}1`, `${MINUS}1 + (${MINUS}1) = ${MINUS}2`, `${MINUS}(${W_} + ${WB}) = ${MINUS}1`, `${MINUS}(${wp(2)} + ${WB}${sup(2)}) = 1`][low];
      const calcOf = (low) => [`1+1`, '1', '0-1', '0-2', '0-1', '1'][low];
      const wb = cx(0.5, -Math.sqrt(3) / 2), w = cx(0.5, Math.sqrt(3) / 2), roots = `${nb(X + sup(3) + ' + 1 = (' + X + ' + 1)(' + X + sup(2) + ' ' + MINUS + ' ' + X + ' + 1)')}이므로 ${W_}, ${WB}는 ${nb(X + sup(2) + ' ' + MINUS + ' ' + X + ' + 1 = 0')}의 두 근이고 ${nb(W_ + ' + ' + WB + ' = 1')}, ${nb(W_ + WB + ' = 1')}이다.`;
      const head = `방정식 ${nb(X + sup(3) + ' + 1 = 0')}의 한 허근을 ${W_}라 할 때, `, tailQ = `의 값은? (단, ${WB}는 ${W_}의 켤레복소수이다.)`;
      if (n === 0) {
        const m = d.int(4, 30), v = table6[m % 6], low = m % 6;
        if (!cnear(cadd(cpow(w, m), cpow(wb, m)), cx(v))) return null;
        return N(head + nb(wp(m) + ' + ' + WB + sup(m)) + tailQ, v, {
          signed: true,
          explain: `${roots} 또 ${nb(wp(3) + ' = ' + WB + sup(3) + ' = ' + MINUS + '1')}, ${nb(wp(6) + ' = 1')}이므로 ${low === 0 ? `지수 ${m}${tail(m, '이/가')} 6의 배수이므로` : `지수 ${m}${tail(m, '을/를')} 6으로 나눈 나머지가 ${low}이므로`} ${nb(wp(m) + ' + ' + WB + sup(m) + ' = ' + said(low))}이다.`,
          facts: { calc: [[calcOf(low), 0]], rule: 'omega-neg', derived: [2] }
        });
      }
      // ω − 1 = ω² 를 쓰는 분수식: ωᵃ/(ω − 1) + ω̄ᵃ/(ω̄ − 1) (분모가 1 − ω 이면 부호가 바뀐다)
      const a = d.int(2, 14), flip = d.bool(), low = (a - 2) % 6, v = (flip ? -1 : 1) * table6[low];
      const den = (z) => (flip ? '1 ' + MINUS + ' ' + z : z + ' ' + MINUS + ' 1'), num = (z, isBar) => (a === 1 ? z : isBar ? z + sup(a) : wp(a));
      const h = frac(num(W_, false), den(W_)) + ' + ' + frac(num(WB, true), den(WB));
      const val = cadd(cdiv(cpow(w, a), flip ? csub(cx(1), w) : csub(w, cx(1))), cdiv(cpow(wb, a), flip ? csub(cx(1), wb) : csub(wb, cx(1))));
      if (!cnear(val, cx(v))) return null;
      const e = a - 2, pw = (z, isBar) => (e === 0 ? '1' : e === 1 ? z : isBar ? z + sup(e) : wp(e));
      return N(head + nb(h) + tailQ, v, {
        signed: true,
        explain: `${roots} ${nb(wp(2) + ' ' + MINUS + ' ' + W_ + ' + 1 = 0')}에서 ${nb(W_ + ' ' + MINUS + ' 1 = ' + wp(2))}, 같은 까닭으로 ${nb(WB + ' ' + MINUS + ' 1 = ' + WB + sup(2))}이므로 ${flip ? `${nb('1 ' + MINUS + ' ' + W_ + ' = ' + MINUS + wp(2))}, ${nb('1 ' + MINUS + ' ' + WB + ' = ' + MINUS + WB + sup(2))}이고 ` : ''}` + (e === 0
          ? `주어진 식은 ${nb((flip ? MINUS + '(1 + 1)' : '1 + 1') + ' = ' + iq(v))}이다.`
          : `주어진 식은 ${nb((flip ? MINUS + '(' : '') + pw(W_, false) + ' + ' + pw(WB, true) + (flip ? ')' : ''))}이다. ` + (e >= 3
            ? `${nb(wp(3) + ' = ' + WB + sup(3) + ' = ' + MINUS + '1')}, ${nb(wp(6) + ' = 1')}이므로 ${nb(pw(W_, false) + ' + ' + pw(WB, true) + ' = ' + said(low))}이다.`
            : `${nb(said(e))}이다.`) + (flip ? ` 따라서 주어진 식의 값은 ${iq(v)}이다.` : '')),
        facts: { calc: [[flip ? `0-(${calcOf(low)})` : calcOf(low), 0]], rule: 'omega-neg-frac', derived: [2] }
      });
    }, { count: 2 })
  ]);

  // ── 삼차방정식과 사차방정식의 활용 ──
  // 실수 근(소수): 계수 p 의 다항식의 실근을 모두 찾는다(구간을 잘게 나누어 부호가 바뀌는 곳을 좁힌다).
  function realRoots(p, lo, hi) {
    const out = [], f = (x) => pEval(p, x), step = (hi - lo) / 4000;
    let x0 = lo, f0 = f(x0);
    for (let i = 1; i <= 4000; i += 1) {
      const x1 = lo + i * step, f1 = f(x1);
      if (f0 === 0) out.push(x0);
      else if (f0 * f1 < 0) { let a = x0, b = x1; for (let k = 0; k < 60; k += 1) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m; } out.push((a + b) / 2); }
      x0 = x1; f0 = f1;
    }
    return out;
  }
  B.kit.m1015.realRoots = realRoots;
  // 펼친 종이 그림: 가로 W, 세로 Hh, 네 귀퉁이의 정사각형(점선)
  function paperFig(Wd, Hd) {
    const s = Math.min(208 / Wd, 140 / Hd), w = Wd * s, h = Hd * s, c = Math.min(w, h) * 0.2, x0 = 26, y0 = 28;
    const r1 = (v) => Math.round(v * 10) / 10;
    let out = `<path d="M${r1(x0 + c)} ${y0}H${r1(x0 + w - c)}V${r1(y0 + c)}H${r1(x0 + w)}V${r1(y0 + h - c)}H${r1(x0 + w - c)}V${r1(y0 + h)}H${r1(x0 + c)}V${r1(y0 + h - c)}H${x0}V${r1(y0 + c)}H${r1(x0 + c)}Z" style="fill:rgba(37,99,235,0.12);stroke:#1d4ed8;stroke-width:1.6"/>`;
    for (const [x, y] of [[x0, y0], [x0 + w - c, y0], [x0, y0 + h - c], [x0 + w - c, y0 + h - c]]) out += `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(c)}" height="${r1(c)}" style="fill:none;stroke:#8a96a3;stroke-width:1;stroke-dasharray:3 2"/>`;
    out += `<path d="M${r1(x0 + c)} ${r1(y0 + c)}H${r1(x0 + w - c)}V${r1(y0 + h - c)}H${r1(x0 + c)}Z" style="fill:none;stroke:#5b6770;stroke-width:0.9;stroke-dasharray:4 3"/>`;
    out += `<text x="${r1(x0 + w / 2)}" y="${y0 - 6}" text-anchor="middle" style="font-size:13px">${Wd} cm</text><text x="${r1(x0 + w + 6)}" y="${r1(y0 + h / 2 + 4)}" style="font-size:13px">${Hd} cm</text>`;
    // x: 잘라 낸 왼쪽 위 정사각형의 왼쪽 변 옆
    out += `<text x="${r1(x0 - 6)}" y="${r1(y0 + c / 2 + 4.5)}" text-anchor="end" style="font-size:13px;font-style:italic;font-family:'MB Math','Times New Roman',serif">x</text>`;
    const W2 = r1(x0 + w + 54), H2 = r1(y0 + h + 12);
    return `<svg class="mb-geo" viewBox="0 0 ${W2} ${H2}" width="${Math.round(W2)}" role="img" aria-label="가로 ${Wd} cm, 세로 ${Hd} cm인 직사각형 종이의 네 귀퉁이에서 한 변의 길이가 x cm인 정사각형을 잘라 낸 그림. 점선을 따라 접어 뚜껑이 없는 상자를 만든다.">${out}</svg>`;
  }
  // 상자 문제에 쓸 수: 두 정수 근이 (0, Hd/2) 안에 있고 셋째 근은 밖
  const BOXES = [];
  for (let Wd = 10; Wd <= 30; Wd += 1) for (let Hd = 6; Hd < Wd; Hd += 1) for (let x1 = 1; x1 < Hd / 2; x1 += 1) for (let x2 = x1 + 1; x2 < Hd / 2; x2 += 1) {
    const v1 = x1 * (Wd - 2 * x1) * (Hd - 2 * x1), v2 = x2 * (Wd - 2 * x2) * (Hd - 2 * x2), x3 = (Wd + Hd) / 2 - x1 - x2;
    if (v1 === v2 && (Wd + Hd) % 2 === 0 && x3 >= Hd / 2 && v1 <= 999) BOXES.push([Wd, Hd, x1, x2, v1]);
  }
  // 원뿔 문제에 쓸 수: (r − x)²(h − x)·k = r²h, 0 < x < min(r, h) 에서 근이 하나
  const CONES = [];
  for (let r = 3; r <= 9; r += 1) for (let h = 4; h <= 12; h += 1) for (let x = 1; x < Math.min(r, h); x += 1) for (const k of [2, 3, 4]) {
    if ((r - x) ** 2 * (h - x) * k !== r * r * h) continue;
    const p = pSub(pMul(pMul([r, -1], [r, -1]), [h, -1]), [r * r * h / k]), ok = realRoots(p, 0.0001, Math.min(r, h) - 0.0001);
    if (ok.length === 1) CONES.push([r, h, x, k]);
  }
  B.addTypes('10-1-5', 'use3', [
    T('use3-cube', '정육면체의 모서리를 늘리고 줄인 직육면체의 부피', '①34', (d) => {
      const x = d.int(2, 7), adds = Array.from({ length: 3 }, () => d.until(() => d.int(-3, 5), (v) => v !== 0 && x + v > 0)), V3 = adds.reduce((s, a) => s * (x + a), 1);
      if (adds.every((a) => a > 0) === false && adds.every((a) => a < 0)) return null;
      const p = pSub(fromRoots(adds.map((a) => -a)), [V3]), lo = Math.max(0, ...adds.map((a) => -a)), ok = realRoots(p, lo + 1e-6, 40).filter((v) => v > lo);
      if (ok.length !== 1 || Math.abs(ok[0] - x) > 1e-6 || V3 > 999) return null;
      const say = (a, w, last) => `${w}${w === '높이' ? '를' : '의 길이를'} ${Math.abs(a)} cm ${a > 0 ? (last ? '늘렸더니' : '늘리고') : (last ? '줄였더니' : '줄이고')}`;
      const box3 = adds.map((a) => '(' + polyH([a, 1]) + ')').join('');
      return N(`한 모서리의 길이가 ${X} cm인 정육면체에서 ${say(adds[0], '가로')}, ${say(adds[1], '세로')}, ${say(adds[2], '높이', true)} 부피가 ${V3} cm³인 직육면체가 되었다. ${X}의 값은?`, x, {
        explain: `직육면체의 부피는 ${nb(box3)}이므로 ${nb(box3 + ' = ' + V3)}, 곧 ${nb(polyH(p) + ' = 0')}이다. 인수정리와 조립제법으로 풀면 실근 가운데 모든 모서리의 길이가 양수가 되는 것은 ${nb(X + ' = ' + x)}뿐이다.`,
        facts: { calc: [[String(x), 0]], unseen: [x].filter((v) => v > 1) }
      });
    }),
    T('use3-box', '종이의 네 귀퉁이를 잘라 만든 상자의 부피', '①35', (d) => {
      const [Wd, Hd, x1, x2, V3] = d.pick(BOXES);
      const p = [-V3, Wd * Hd, -2 * (Wd + Hd), 4];
      return inline(`가로, 세로의 길이가 각각 ${Wd} cm, ${Hd} cm인 직사각형 모양의 종이가 있다. 그림과 같이 네 귀퉁이에서 한 변의 길이가 ${X} cm인 정사각형을 잘라 내고 접어서 부피가 ${V3} cm³인 뚜껑이 없는 상자를 만들려고 한다. ${X}의 값이 될 수 있는 것을 모두 구하시오.`,
        grp(`${X} = {0}`) + ' 또는 ' + grp(`${X} = {1}`), [{ answer: x1 }, { answer: x2 }], {
          unordered: true, shown: setH([x1, x2]), figure: paperFig(Wd, Hd),
          explain: `상자의 밑면은 가로 ${nb('(' + Wd + ' ' + MINUS + ' 2' + X + ') cm')}, 세로 ${nb('(' + Hd + ' ' + MINUS + ' 2' + X + ') cm')}, 높이는 ${X} cm이므로 ${nb('0 &lt; ' + X + ' &lt; ' + Hd / 2)}이고 ${nb(X + '(' + Wd + ' ' + MINUS + ' 2' + X + ')(' + Hd + ' ' + MINUS + ' 2' + X + ') = ' + V3)}, 곧 ${nb(polyH(p) + ' = 0')}이다. 조립제법으로 인수분해하면 ${nb('4(' + linH(x1) + ')(' + linH(x2) + ')(' + linH((Wd + Hd) / 2 - x1 - x2) + ') = 0')}이고 세 번째 근 ${(Wd + Hd) / 2 - x1 - x2}${tail((Wd + Hd) / 2 - x1 - x2, '은/는')} ${nb('0 &lt; ' + X + ' &lt; ' + Hd / 2)}에 들지 않는다. 따라서 ${setH([x1, x2])}이다.`,
          facts: { calc: [[String(x1), 0], [String(x2), 1]], unseen: [x1, x2].filter((v) => v > 1), rule: 'use3-box' }
        });
    }),
    T('use3-cyl', '원기둥 그릇에 담은 물의 부피', '①36', (d) => {
      const diam = d.bool(), r = d.int(4, 9), h = d.int(2, Math.min(r - 1, 5)), water = (diam ? 2 * r : r) - h, V3 = r * r * water;
      if (V3 > 999) return null;
      const said = diam ? '밑면의 지름의 길이와 높이가 같은' : '밑면의 반지름의 길이와 높이가 같은';
      const p = diam ? [-V3, 0, -h, 2] : [-V3, 0, -h, 1], rr = V('r');
      return N(`${said} 원기둥 모양의 그릇에 ${V3}π cm³의 물을 부었더니 그릇의 위에서부터 ${h} cm를 남기고 물이 채워졌다. 이 그릇의 밑면의 반지름의 길이는 몇 cm인가? (단, 그릇의 두께는 생각하지 않는다.)`, r, {
        unit: 'cm',
        explain: `밑면의 반지름의 길이를 ${rr} cm라 하면 그릇의 높이는 ${diam ? '2' + rr : rr} cm이고 물의 높이는 ${nb('(' + (diam ? '2' + rr : rr) + ' ' + MINUS + ' ' + h + ') cm')}이다. ${nb('π' + rr + sup(2) + '(' + (diam ? '2' + rr : rr) + ' ' + MINUS + ' ' + h + ') = ' + V3 + 'π')}에서 ${nb(polyH(p, 'r') + ' = 0')}이다. 인수정리와 조립제법으로 풀면 실근은 ${nb(rr + ' = ' + r)}뿐이다(나머지 이차식은 허근을 준다).`,
        facts: { calc: [[String(r), 0]], unseen: [r] }
      });
    }),
    T('use3-cone', '원뿔의 반지름과 높이를 줄여 부피를 바꾸기', '①37', (d) => {
      const [r, h, x, k] = d.pick(CONES), word = { 2: '2분의 1', 3: '3분의 1', 4: '4분의 1' }[k];
      const p = pSub(pMul(pMul([r, -1], [r, -1]), [h, -1]), [r * r * h / k]);
      return N(`밑면의 반지름의 길이가 ${r} cm, 높이가 ${h} cm인 원뿔이 있다. 이 원뿔의 밑면의 반지름의 길이와 높이를 각각 같은 길이만큼 줄였더니 부피가 처음 부피의 ${frac(1, k)}인 원뿔이 되었다. 새 원뿔의 밑면의 반지름의 길이는 몇 cm인가?`, r - x, {
        unit: 'cm',
        explain: `줄인 길이를 ${X} cm라 하면 ${nb(frac(1, 3) + 'π(' + r + ' ' + MINUS + ' ' + X + ')' + sup(2) + '(' + h + ' ' + MINUS + ' ' + X + ') = ' + frac(1, k) + ' × ' + frac(1, 3) + 'π × ' + r + sup(2) + ' × ' + h)}, 곧 ${nb('(' + r + ' ' + MINUS + ' ' + X + ')' + sup(2) + '(' + h + ' ' + MINUS + ' ' + X + ') = ' + r * r * h / k)}이다. 전개하면 ${nb(polyH(pSc(p, -1)) + ' = 0')}이고, ${nb('0 &lt; ' + X + ' &lt; ' + Math.min(r, h))}에서 근은 ${nb(X + ' = ' + x)}뿐이다. 따라서 새 원뿔의 밑면의 반지름의 길이는 ${nb(r + ' ' + MINUS + ' ' + x + ' = ' + (r - x))} cm이다.`,
        facts: { calc: [[`${r}-${x}`, 0]], unseen: [x].filter((v) => v > 1) }
      });
    }),
    T('use3-tofu', '직육면체에서 직육면체를 파낸 부피', '①38', (d) => {
      const a = d.int(1, 3), b = d.int(1, 4), c = d.int(1, 3), x = d.int(2, 6), V3 = (x + a) ** 2 * (x + b) - c * x * x;
      if (c >= x + b || a === b || V3 > 999) return null;
      const p = pSub(pSub(pMul(pMul([a, 1], [a, 1]), [b, 1]), [0, 0, c]), [V3]), ok = realRoots(p, 1e-6, 40);
      if (ok.length !== 1 || Math.abs(ok[0] - x) > 1e-6) return null;
      return N(`밑면의 가로, 세로의 길이가 모두 ${nb('(' + X + ' + ' + a + ') cm')}이고 높이가 ${nb('(' + X + ' + ' + b + ') cm')}인 직육면체 모양의 두부가 있다. 이 두부의 윗면 가운데에서 밑면의 가로, 세로의 길이가 모두 ${X} cm이고 깊이가 ${c} cm인 직육면체 모양을 파냈더니 남은 부분의 부피가 ${V3} cm³가 되었다. ${X}의 값은?`, x, {
        explain: `남은 부분의 부피는 ${nb('(' + X + ' + ' + a + ')' + sup(2) + '(' + X + ' + ' + b + ') ' + MINUS + ' ' + (c === 1 ? '' : c) + X + sup(2))}이므로 ${nb(polyH(pAdd(p, [V3])) + ' = ' + V3)}, 곧 ${nb(polyH(p) + ' = 0')}이다. 인수정리와 조립제법으로 풀면 양수인 근은 ${nb(X + ' = ' + x)}뿐이다.`,
        facts: { calc: [[String(x), 0]], unseen: [x].filter((v) => v > 1) }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
