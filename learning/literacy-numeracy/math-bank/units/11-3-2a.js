// 고2·3 확률과 통계 2단원 이항정리 — 단원 틀·단원 안의 도구와 앞쪽 묶음(이항정리와 전개식, 전개식의 항의 계수, 계수 조건으로 미지수 구하기).
// 수집해 둔 천재 T셀파 확률과 통계(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 41꼴, 심화꼴: 3꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-3-2/싣기_대조표.md 에 있다.
// (곱·합의 전개식, 이항계수의 성질, 큰 수의 나머지, 파스칼의 삼각형은 11-3-2b.js 에, 실력 문항은 11-3-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번. 성취기준은 12확통01-03(이항정리를 이해하고, 이를 활용하여 문제를 해결할 수 있다) 하나이다.
// 묶음 차례는 교과서의 차례(이항정리 → 이항계수의 성질과 활용 → 파스칼의 삼각형)를 따른다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·전개한 식·조건·그림), 묻는 것(계수·상수항·미지수·지수 n·전개식·일반항·고르기), 셈의 얼개(일반항 하나,
//    두 식의 곱의 짝 맞추기, 이항계수의 합, 이웃한 두 수의 합을 거듭 쓰기)가 다를 때만 따로 싣는다. 수만 다른 것은 한 번만 싣는다.
//  - 사용자가 정한 것: 내신 대비라 수학 실력에 필요해 보이는 꼴은 다 싣는다. 학년이 다른 단원(고1 공통수학)과 같은 일도 싣는다
//    ((1 + x²)³ 의 전개는 고1 곱셈 공식으로도 풀리고, 점근선으로 상수를 구하는 일은 고1 유리함수이지만 둔다). 같은 과목의 다른 단원과 같은 일만 한쪽에 둔다.
//  - 교육과정의 금: 「항이 세 개 이상인 다항정리에 관한 문제와 허수단위 i가 포함된 이항정리에 관한 문제는 다루지 않는다.」 수집본에도 없다.
//    (x² + x + 1) × (이항식)ⁿ 은 항이 셋인 식을 곱할 뿐 거듭제곱하지 않으므로 싣는다.
//  - 11-3-1(여러 가지 순열과 중복조합)에서 넘겨받은 것: (a + b)ⁿ 의 전개식의 항의 개수(n + 1개)는 이 단원에 둔다(expand-term-count).
//  - 답: 계수·상수항·미지수는 수 칸, 음수가 될 수 있는 값에는 모두 부호 단추를 단다(개수·자릿수·지수 n 은 뺀다). 분수는 분자·분모 칸(크기가 같은 분수도 맞게 친다).
//    전개식은 항마다 「[±][ ] 문자」 칸(계수가 1이어도 1을 적는다), 분수 꼴 항이 섞인 전개식은 항마다 이름을 단 칸, 일반항은 고르기로 받는다.
//    한 유형의 칸 모양은 씨앗이 바뀌어도 같다(분수 답의 유형은 늘 정수가 아닌 분수가 되게 수를 고른다). 답은 9999 이하가 되게 수를 고른다.
//  - 원문이 따로 구한 값을 묶어 물은 곳(20a, a⁶, a + b + c 따위)은 값을 바로 묻는다. 늘 같은 답이 나오던 꼴(a = 1, 교대합 0)은 수를 바꾸어 답이 달라지게 했다.
//  - ₙCᵣ + ₙCᵣ₊₁ = ₘCₖ 에서 n, r 을 구하는 꼴(①35)에는 조건 「r ≤ n − 2」를 붙였다. 없으면 r + 1 = n 쪽(ₙCₙ₋₁ + ₙCₙ = n + 1)에서 답이 하나 더 생긴다.
//  - 그림 새로 지음: ①34(파스칼의 삼각형의 빈칸 — 셋째 대각선 ₙC₂), ①39(칸마다 ₙCᵣ 를 적은 삼각형에 두 대각선을 칠함). 원문 평가지·학습지 그림이 없다.
//  - 답은 모두 코드가 셈한다. 검사 근거는 공식을 수로 적은 식(facts.calc·value), 미지수는 □에 수를 넣어 등식이 맞는 것이 하나뿐인지 보는 식(facts.digit),
//    고르기는 보기마다 코드로 가린 참·거짓(일반항은 r = 0 ~ n 까지 더해 원래 식과 맞춰 본다)이나 값(facts.pick)이다. 만들 때 seal 이 같은 검사를 먼저 돌린다.
//
// 뺀 것과 까닭(11-3-2b.js, 11-3-2c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목의 다른 단원에 둠: ①29(A ⊂ B 인 순서쌍의 개수 3ⁿ − 2ⁿ — 11-3-1 중복순열).
//  - 서술형 전용: ①30(이항계수의 합의 등식 증명 — 원문에 빈칸·고르기 꼴이 없다. 증명의 내용인 x = 1, x = −1 대입은 sum- 유형들이 묻는다).
//  - 활동: ①40(꽃잎 모양의 곱의 관계 — 규칙 탐구 활동).
//  - 겹침(같은 일을 하는 유형에 합침): 심1(→ coef-frac), 심2(→ sum-power), ①5의 변형 y²(→ coef-xy 둘째 차례), ①8의 a⁶·(x/a − 2)⁷(→ solve-const-poly),
//    ①22의 2⁷ − 1(→ sum-missing), ①24의 두 합의 곱(→ sum-back-n 둘째 차례), ①37의 하키 스틱 그림(→ pascal-hockey 셋째 차례).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, box, N, M, C } = B.kit;
  const { MINUS, Q, V, sup, nb, ex, tail, poly, grp } = B.kit.mid;
  const { ms, nC, nP, jh, qAns, pw } = B.kit.hs;
  const UNIT = '11-3-2', STD = '12확통01-03';

  // ── 셈 ──
  const range = (lo, hi) => Array.from({ length: Math.max(0, hi - lo + 1) }, (_, i) => lo + i);
  // 이항계수 ₙCᵣ(정수, n ≤ 60 이면 정확하다)
  const cr = (n, r) => { if (r < 0 || r > n) return 0; let v = 1; for (let i = 1; i <= Math.min(r, n - r); i += 1) v = v * (n - Math.min(r, n - r) + i) / i; return Math.round(v); };
  const pr = (n, r) => { let v = 1; for (let i = 0; i < r; i += 1) v *= n - i; return v; };
  // 검사 식 글: ₙCᵣ → "(7*6*5)/(3*2*1)", 음수는 괄호에 넣는다
  const prodS = (n, r) => (r <= 0 ? '1' : range(0, r - 1).map((i) => n - i).join('*'));
  const combS = (n, r) => { const k = Math.min(r, n - r); return k <= 0 ? '1' : `(${prodS(n, k)})/(${prodS(k, k)})`; };
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));
  const sg = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));

  // ── 식 글(ms 에 넘길 글) ──
  // 거듭제곱 조각: pv('x', 3) → 'x^{3}', pv('x', 1) → 'x', pv('x', 0) → ''
  const pv = (v, e) => (e === 0 ? '' : e === 1 ? v : `${v}^{${e}}`);
  // 항 하나(계수 c, 문자 글 v): 맨 앞이면 부호만, 뒤면 「 + 」「 − 」로 잇는다. 계수 1은 적지 않는다(상수항이면 적는다).
  const mon = (c, v, first) => { if (c === 0) return ''; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); return first ? (c < 0 ? '-' : '') + body : (c < 0 ? ' - ' : ' + ') + body; };
  const lin2 = (c1, v1, c2, v2) => mon(c1, v1, true) + mon(c2, v2, false);
  // x 의 거듭제곱(HTML): 양수는 xᵉ, 0은 1, 음수는 1/x^|e|
  const xp = (e, v) => { const x = v || 'x'; return e > 0 ? ms(pv(x, e)) : e === 0 ? '1' : frac('1', ms(pv(x, -e))); };
  // 계수의 이름: x³의 계수, 상수항, 1/x²의 계수
  const termName = (e) => (e === 0 ? '상수항' : xp(e) + '의 계수');
  // 전개식(항마다 [계수, x의 지수]): 1/x 거듭제곱 항은 분수로 적는다(−8/x²).
  function expandH(list, v) {
    const x = v || 'x';
    return nb(list.filter(([c]) => c !== 0).map(([c, e], i) => {
      const a = Math.abs(c), sign = i === 0 ? (c < 0 ? MINUS : '') : c < 0 ? ' ' + MINUS + ' ' : ' + ';
      const body = e === 0 ? String(a) : e > 0 ? (a === 1 ? '' : a) + ms(pv(x, e)) : frac(String(a), ms(pv(x, -e)));
      return sign + body;
    }).join(''));
  }
  // 분수 꼴 항이 든 식: ( c₁xᵃ ± c₂/xᵇ )ⁿ
  const fracBin = (c1, a, c2, b, n) => nb('(' + ms(mon(c1, pv('x', a), true)) + ' ' + (c2 < 0 ? MINUS : '+') + ' ' + frac(String(Math.abs(c2)), ms(pv('x', b))) + ')' + sup(n));
  // 차례 말: 1 → 첫, 5 → 다섯
  // 짧은 식은 줄이 갈리지 않게 한 덩이로: mn('(x + 2)^5')
  const mn = (s) => nb(ms(s));
  // 긴 합은 항마다 덩이로 묶고 「 + 」에서만 줄이 갈리게: sumN([항, …]) — 항은 HTML 글.
  const sumN = (terms) => terms.map(nb).join(' + ');
  // 답이 다항식인 문항: 항마다 「[±][ ] 문자」(칸과 문자를 한 덩이로 묶어 좁은 화면에서 떨어지지 않게). 계수는 0이 아닌 정수(1이어도 1을 적는다).
  function polyIn(text, terms, o) {
    if (!terms.length || terms.some(([k]) => !Number.isInteger(k) || k === 0)) throw new Error('다항식 답의 계수는 0이 아닌 정수여야 한다');
    return B.kit.inline(text, terms.map(([, name], i) => grp('{' + i + '}' + name)).join(' '), terms.map(([k]) => ({ answer: k, signed: true })), Object.assign({}, o, { shown: poly(terms) }));
  }
  const ORD = ['', '첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  // 풀이 글의 거듭제곱 조각: powH(−3, 2) → (−3)², powH(2, 1) → 2, 지수가 0이거나 밑이 1이면 빈 글. prodH: 빈 조각을 빼고 × 로 잇는다.
  const powH = (b, e) => (e === 0 || b === 1 ? '' : (b < 0 ? '(' + sg(b) + ')' : String(b)) + (e === 1 ? '' : sup(e)));
  const prodH = (parts) => parts.filter(Boolean).join(' × ');
  // 일반항의 거듭제곱 조각(ms 글): genS(2, 'x', '6-r') → (2x)^{6-r}, genS(1, 'x', 'r') → x^{r}
  const genS = (c, v, e) => (c === 1 && /^[a-z]$/.test(v) ? `${v}^{${e}}` : `(${mon(c, v, true)})^{${e}}`);

  // ── 검사 근거 마무리(seal) ──
  // 검사가 하는 것을 만들 때 먼저 해 본다: 식의 값과 답, □ 식의 해, 고르기의 근거. 식의 수 가운데 글·그림 설명·보기에 보이지 않는 수는 facts.unseen 에 밝힌다.
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function shownNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  const evalS = (s) => { if (!/^[\d+\-*\/%(). ]+$/.test(s)) throw new Error('검사 식이 아니다: ' + s); return Function('"use strict"; return (' + s + ');')(); };
  const near = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  function seal(item) {
    const f = item.facts || {}, ans = (i) => item.inputs[i].answer;
    if (!item.choice) for (const input of item.inputs) {
      if (!Number.isInteger(input.answer) || Math.abs(input.answer) > 9999) throw new Error('답이 9999 이하의 정수가 아니다: ' + input.answer);
      if (input.answer < 0 && !input.signed) throw new Error('부호 단추 없는 칸에 음수 답');
    }
    for (const [s, i] of f.calc || []) { const v = evalS(s); if (!near(v, ans(i))) throw new Error(`검사 식 ${s.slice(0, 90)} = ${v} 인데 답은 ${ans(i)}`); if (!(v > 0) && !item.inputs[i].signed) throw new Error('0 이하인 식의 칸에 부호 단추가 없다: ' + s); }
    for (const [s, i] of f.parts || []) if (!near(evalS(s), ans(i))) throw new Error('parts 근거가 답과 다르다: ' + s);
    if (f.value !== undefined) {
      const v = item.inputs.map((input) => input.answer), size = item.fraction ? (item.mixed ? v[0] : 0) + v[v.length - 2] / v[v.length - 1] : v[0];
      const got = item.negative ? -size : size;
      if (!near(got, evalS(f.value))) throw new Error(`value ${f.value} = ${evalS(f.value)} 인데 답은 ${got}`);
    }
    if (f.digit) {
      const { template, lo, hi, ask } = f.digit, ok = [];
      for (let x = lo; x <= hi; x += 1) {
        const parts = template.replace(/□/g, String(x)).split(/([<>])/); let good = true;
        for (let i = 1; i < parts.length; i += 2) { const l = evalS(parts[i - 1]), r = evalS(parts[i + 1]); if (!(parts[i] === '<' ? l < r : l > r)) good = false; }
        if (good) ok.push(x);
      }
      const want = ask === 'max' ? ok[ok.length - 1] : ok[0];
      if (!ok.length || ok.length > hi - lo || want !== ans(0) || (ask === 'only' && ok.length !== 1)) throw new Error('□ 식을 만족하는 수: ' + ok.join(',') + ' / 답 ' + ans(0));
      if (ask === 'only') f.digit.ask = 'min';
    }
    if (f.pick && (new Set(f.pick.options).size !== f.pick.options.length || !near(f.pick.options[item.choice.answer], evalS(f.pick.expr)) || f.pick.options.filter((o) => near(o, evalS(f.pick.expr))).length !== 1)) throw new Error('pick 근거가 답과 다르다');
    if (f.truth && (f.truth.filter((t) => t === f.want).length !== 1 || f.truth[item.choice.answer] !== f.want)) throw new Error('참·거짓 근거가 답과 다르다: ' + f.truth.join(','));
    if (item.choice && new Set(item.choice.options.map(stripH)).size !== item.choice.options.length) throw new Error('보기가 겹친다');
    const shown = shownNumbers(item), hidden = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([s]) => s).concat(f.value !== undefined ? [f.value] : [], f.pick ? [f.pick.expr] : [], f.choose ? f.choose.exprs : []);
    for (const s of exprs) for (const n of String(s).match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) hidden.add(Number(n));
    if (hidden.size) f.unseen = [...hidden]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 3000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => '수집본 ' + (/심/.test(ref) && !/①/.test(ref) ? '심화' : /심/.test(ref) ? '기본·심화' : '기본') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});
  // 고르기: 보기를 섞어 정답 자리를 찾는다. rows: [{ h 보기 글, ok 참·거짓 }]
  //  보기마다 값 v 가 있고 o.pickExpr(답의 값을 셈하는 식)를 주면 facts.pick 을 섞은 차례대로 단다.
  function choose(d, text, rows, o) {
    const list = d.shuffle(rows.slice()), at = list.findIndex((r) => r.ok), opt = Object.assign({}, o);
    const facts = Object.assign({ truth: list.map((r) => Boolean(r.ok)), want: true }, opt.facts || {});
    if (opt.pickExpr) facts.pick = { expr: opt.pickExpr, options: list.map((r) => r.v) };
    delete opt.pickExpr;
    return C(text, list.map((r) => r.h), at, Object.assign(opt, { facts }));
  }

  // ── 그림: 파스칼의 삼각형 ──
  // rows 줄(맨 위가 ₀C₀). cell(i, j) → { t 적을 수(글), blank 빈칸 이름(㉠), fill 칠한 색, lab [n, r] — ₙCᵣ 기호로 적기 }. said: 그림 설명.
  function pascalFig(rows, cell, said) {
    const dx = rows > 8 ? 30 : 34, dy = rows > 8 ? 25 : 27, W = Math.round(rows * dx + 14), H = Math.round(rows * dy + 6);
    let back = '', front = '';
    for (let i = 0; i < rows; i += 1) for (let j = 0; j <= i; j += 1) {
      const c = cell(i, j) || {}, x = (W / 2 + (j - i / 2) * dx).toFixed(1), y = 19 + i * dy;
      if (c.fill) back += `<rect x="${(x - dx / 2 + 2).toFixed(1)}" y="${y - 15}" width="${dx - 4}" height="21" rx="5" style="fill:${c.fill};stroke:#b45309;stroke-width:0.8"/>`;
      if (c.blank) front += `<rect x="${(x - 13).toFixed(1)}" y="${y - 15}" width="26" height="21" rx="3" style="fill:#fff;stroke:#1f2933;stroke-width:1.1"/><text x="${x}" y="${y}" text-anchor="middle" style="font-size:12.5px;fill:#1d4ed8;font-weight:700">${c.blank}</text>`;
      else if (c.lab) front += `<text x="${x}" y="${y}" text-anchor="middle" style="font-size:12.5px;fill:#1f2933;font-family:'MB Main','Times New Roman',serif"><tspan dy="3" style="font-size:9px">${c.lab[0]}</tspan><tspan dy="-3">C</tspan><tspan dy="3" style="font-size:9px">${c.lab[1]}</tspan></text>`;
      else front += `<text x="${x}" y="${y}" text-anchor="middle" style="font-size:13px;fill:#1f2933">${c.t}</text>`;
    }
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${said}">${back}${front}</svg>`;
  }

  B.kit.u1132 = { mn, sumN, polyIn, UNIT, STD, range, cr, pr, prodS, combS, jn, sg, pv, mon, lin2, xp, termName, expandH, fracBin, ORD, powH, prodH, genS, seal, retry, T, H, choose, pascalFig, evalS, stripH };

  const A_ = V('a'), B_ = V('b'), X_ = V('x');

  // ── 이항정리와 전개식 ──
  const expandTypes = [
    T('expand-boxes', '상자에서 공을 꺼내는 경우의 수와 전개식의 계수', '①1', (d) => {
      const n = d.int(5, 8), q = d.int(2, n - 2), p = n - q, v = cr(n, q);
      return N(`서로 다른 상자 ${n}개에 ${A_}가 적힌 공과 ${B_}가 적힌 공이 하나씩 들어 있다. 상자마다 공을 1개씩 꺼낼 때, ${A_}가 적힌 공 ${p}개와 ${B_}가 적힌 공 ${q}개를 꺼내는 경우의 수는?`, v, {
        explain: `${B_}가 적힌 공을 꺼낼 상자 ${q}개를 고르면 나머지 상자에서는 ${A_}가 적힌 공을 꺼내므로 ${nC(n, q)} = ${v}이다. 이 수는 다항식 ${mn(`(a + b)^${n}`)}의 전개식에서 ${ms(pv('a', p) + pv('b', q))}의 계수와 같다.`,
        facts: { calc: [[combS(n, q), 0]] }
      });
    }),
    T('expand-blank', '이항정리로 전개한 식의 빈칸 — 조합의 수와 항', '①1', (d) => {
      const n = d.int(4, 6), neg = d.bool(), i = d.int(2, n - 2), j = d.int(1, n - 1);
      if (j === i || 2 * j === n) return null;
      const bx = neg ? '(-b)' : 'b';
      const monoH = (ea, eb, minus) => ms(pv('a', ea) + (eb === 0 ? '' : minus ? (eb === 1 ? '(-b)' : `(-b)^{${eb}}`) : pv('b', eb)));
      const terms = range(0, n).map((k) => (k === i ? box('㉠') : nC(n, k)) + (k === j ? box('㉡') : monoH(n - k, k, neg)));
      const head = mn(`(a ${neg ? '-' : '+'} b)^${n}`), rows = [];
      for (let k = 0; k <= n; k += 3) rows.push((k === 0 ? head + ' = ' : '+ ') + terms.slice(k, k + 3).join(' + '));
      const right = cr(n, i), wrongC = [[n, i - 1], [n, i + 1], [n - 1, i], [n + 1, i]].filter(([a, b]) => b >= 0 && b <= a && cr(a, b) !== right);
      const [wc] = d.shuffle(wrongC);
      // 틀린 항: a와 b의 지수를 바꾼 것, 또는 (−b) 의 부호를 뺀 것(지수가 홀수일 때만 값이 다르다)
      const wrongM = [{ ea: j, eb: n - j, minus: neg }].concat(neg && j % 2 === 1 ? [{ ea: n - j, eb: j, minus: false }] : []);
      const wm = d.pick(wrongM), rightM = { ea: n - j, eb: j, minus: neg };
      const val = (m) => 2 ** m.ea * (m.minus ? -3 : 3) ** m.eb;
      const rowsC = [[nC(n, i), right, rightM], [nC(n, i), right, wm], [nC(wc[0], wc[1]), cr(wc[0], wc[1]), rightM], [nC(wc[0], wc[1]), cr(wc[0], wc[1]), wm]];
      const opts = rowsC.map(([ch, cv, m]) => ({ h: `㉠ ${ch}, ㉡ ${monoH(m.ea, m.eb, m.minus)}`, ok: cv === right && val(m) === val(rightM) }));
      return choose(d, `다음은 이항정리를 이용하여 다항식 ${jh(head, '을/를')} 전개한 식이다. ㉠, ㉡에 알맞은 것을 차례로 나열한 것은?`, opts, {
        figure: lines(rows.map((r) => ex(r))),
        explain: `${monoH(n - i, i, neg)}의 계수는 ${n}개의 인수 ${mn(`(a ${neg ? '-' : '+'} b)`)} 가운데 ${i}개에서 ${neg ? ms('-b') : B_}를 택하는 조합의 수 ${nC(n, i)}이다. ${nC(n, j)} 뒤에는 ${n - j}개에서 ${A_}, ${j}개에서 ${neg ? ms('-b') : B_}를 택한 ${monoH(n - j, j, neg)}이 온다.`
      });
    }),
    T('expand-binomial', '이항정리(파스칼의 삼각형)로 전개하기', '①2', (d, k) => {
      if (k === 0) {
        const n = d.int(4, 5), c = d.pick([-3, -2, -1, 1, 2, 3]);
        const terms = range(0, n).map((r) => [cr(n, r) * c ** r, ms(pv('x', n - r))]);
        const how = d.pick(['이항정리', '파스칼의 삼각형']), head = mn(`(${lin2(1, 'x', c, '')})^${n}`);
        return polyIn(`${josa(how, '을/를')} 이용하여 다항식 ${jh(head, '을/를')} 전개하시오. (단, 계수가 1이면 1을 적는다.)`, terms, {
          explain: `${head} = ${range(0, n).map((r) => nC(n, r) + ms(pv('x', n - r)) + (r ? (c < 0 ? '(' + sg(c) + ')' : c) + (r > 1 ? sup(r) : '') : '')).join(' + ')} = ${poly(terms)}이다.`,
          facts: { calc: range(0, n).map((r) => [`${combS(n, r)}*${jn(c)}**${r}`, r]), rule: 'one-var' }
        });
      }
      const n = d.int(4, 5), p = d.pick([1, 2, 3]), q = d.pick([-3, -2, -1, 1, 2, 3]);
      if (p === 1 && Math.abs(q) === 1) return null;
      const terms = range(0, n).map((r) => [cr(n, r) * p ** (n - r) * q ** r, ms(pv('a', n - r) + pv('b', r))]);
      if (terms.some(([c]) => Math.abs(c) > 9999)) return null;
      const how = d.pick(['이항정리', '파스칼의 삼각형']), head = mn(`(${lin2(p, 'a', q, 'b')})^${n}`);
      return polyIn(`${josa(how, '을/를')} 이용하여 다항식 ${jh(head, '을/를')} 전개하시오. (단, 계수가 1이면 1을 적는다.)`, terms, {
        explain: `일반항은 ${nC(n, 'r')}${ms(genS(p, 'a', `${n}-r`) + genS(q, 'b', 'r'))}이므로 ${head} = ${poly(terms)}이다.`,
        facts: { calc: range(0, n).map((r) => [`${combS(n, r)}*${p}**${n - r}*${jn(q)}**${r}`, r]), rule: 'two-var' }
      });
    }, { count: 2 }),
    T('expand-power-terms', '제곱 항·분수 꼴 항이 든 이항식의 전개', '①3', (d, k) => {
      if (k === 0) {
        const c = d.pick([1, 2, 3, -1, -2]), n = 3;
        const terms = range(0, n).map((r) => [cr(n, r) * c ** r, ms(pv('x', 2 * r))]);
        const head = mn(`(1${mon(c, 'x^2', false)})^${n}`);
        return polyIn(`다항식 ${jh(head, '을/를')} 전개하시오. (단, 계수가 1이면 1을 적는다.)`, terms, {
          explain: `${head} = ${range(0, n).map((r) => nC(n, r) + (r ? mn(`(${mon(c, 'x^2', true)})`) + (r > 1 ? sup(r) : '') : '')).join(' + ')} = ${poly(terms)}이다.`,
          facts: { calc: range(0, n).map((r) => [`${combS(n, r)}*${jn(c)}**${r}`, r]), rule: 'cube' }
        });
      }
      const a = d.pick([1, 2]), b = d.pick([1, 2]), c1 = a === 1 ? d.pick([2, 3]) : 1, c2 = d.pick([-2, -1, 1, 2]), n = 4;
      if (a === 2 && b === 2) return null;
      const list = range(0, n).map((r) => [cr(n, r) * c1 ** (n - r) * c2 ** r, a * (n - r) - b * r]);
      const expr = fracBin(c1, a, c2, b, n);
      return M(`식 ${jh(expr, '을/를')} 전개할 때, 다음 계수를 차례로 구하시오.`, list.map(([c, e]) => ({ answer: c, signed: true, label: termName(e) })), {
        shown: expandH(list),
        explain: `일반항 ${nC(n, 'r')}${mn(`(${mon(c1, pv('x', a), true)})^{${n}-r}`)}(${c2 < 0 ? MINUS : ''}${frac(String(Math.abs(c2)), ms(pv('x', b)))})${sup(V('r'))}에 ${V('r')} = 0, 1, 2, 3, 4를 넣으면 ${expandH(list)}이다.`,
        facts: { calc: range(0, n).map((r) => [`${combS(n, r)}*${c1}**${n - r}*${jn(c2)}**${r}`, r]), rule: 'frac' }
      });
    }, { count: 2 }),
    T('expand-general-term', '전개식의 일반항 고르기', '①4', (d) => {
      const form = d.pick(['xy', 'const', 'recip']), n = d.int(4, 7), p = d.pick([2, 3]);
      const q = form === 'recip' ? 1 : d.pick([-3, -2, -1, 1, 2, 3]);
      // 두 항: 보이는 글(지수 글을 받는다)과 값(X = 2, Y = 3 에서)
      const first = { h: (e) => mn(`(${p}x)^{${e}}`), bare: (e) => p + ms(`x^{${e}}`), v: (X) => p * X, bv: (X, e) => p * X ** e };
      const second = form === 'xy' ? { h: (e) => ms(q === 1 ? `y^{${e}}` : `(${mon(q, 'y', true)})^{${e}}`), abs: (e) => ms(q === -1 ? `y^{${e}}` : `(${mon(Math.abs(q), 'y', true)})^{${e}}`), v: (X, Y) => q * Y, av: (X, Y) => Math.abs(q) * Y }
        : form === 'const' ? { h: (e) => (q === 1 ? '' : ms(q < 0 ? `(${q})^{${e}}` : `${q}^{${e}}`)), abs: (e) => (q === -1 ? '' : ms(`${Math.abs(q)}^{${e}}`)), v: () => q, av: () => Math.abs(q) }
          : { h: (e) => '(' + frac('1', ms(`${p}x`)) + ')' + sup(ms(e)), v: (X) => 1 / (p * X) };
      const sum2 = (f) => range(0, n).reduce((s, r) => s + f(r, 2, 3), 0);
      const target = (first.v(2) + second.v(2, 3)) ** n;
      const R = ms('r'), nr = `${n}-r`;
      const cand = [
        { h: nC(n, 'r') + first.h(nr) + second.h('r'), f: (r, X, Y) => cr(n, r) * first.v(X) ** (n - r) * second.v(X, Y) ** r },
        { h: nP(n, 'r') + first.h(nr) + second.h('r'), f: (r, X, Y) => pr(n, r) * first.v(X) ** (n - r) * second.v(X, Y) ** r },
        { h: nC(n, 'r') + first.bare(nr) + second.h('r'), f: (r, X, Y) => cr(n, r) * first.bv(X, n - r) * second.v(X, Y) ** r },
        { h: nC(n, 'r') + first.h(String(n)) + second.h('r'), f: (r, X, Y) => cr(n, r) * first.v(X) ** n * second.v(X, Y) ** r },
        { h: nC(n, 'r') + first.h('r') + second.h('r'), f: (r, X, Y) => cr(n, r) * first.v(X) ** r * second.v(X, Y) ** r }
      ].concat(second.abs && q < 0 ? [{ h: nC(n, 'r') + first.h(nr) + second.abs('r'), f: (r, X, Y) => cr(n, r) * first.v(X) ** (n - r) * second.av(X, Y) ** r }] : []);
      const marked = cand.map((c) => ({ h: c.h, ok: near(sum2(c.f), target) }));
      if (!marked[0].ok || marked.slice(1).some((c) => c.ok)) return null;
      const rows = [marked[0]].concat(d.shuffle(marked.slice(1)).slice(0, 4));
      const head = form === 'recip' ? nb('(' + ms(`${p}x`) + ' + ' + frac('1', ms(`${p}x`)) + ')' + sup(n)) : mn(`(${form === 'xy' ? lin2(p, 'x', q, 'y') : lin2(p, 'x', q, '')})^${n}`);
      return choose(d, `${form === 'recip' ? '식' : '다항식'} ${head}의 전개식의 일반항으로 옳은 것은? (단, ${R} = 0, 1, 2, ⋯, ${n})`, rows, {
        explain: `${ms('(a + b)^n')}의 전개식의 일반항은 ${nC('n', 'r')}${ms('a^{n-r}b^r')}이다. 첫째 항 ${ms(`${p}x`)}를 통째로 ${ms(`${n}-r`)}제곱하고 둘째 항을 ${R}제곱하면 ${marked[0].h}이다.`
      });
    }),
    T('expand-term-count', '(a + b)ⁿ의 전개식의 항의 개수', '11-3-1 ②18(소2기3)', (d) => {
      const n = d.int(6, 15), p = d.pick([1, 2, 3]), q = d.pick([-3, -2, -1, 1, 2, 3]);
      const head = mn(`(${lin2(p, 'x', q, 'y')})^{${n}}`);
      return N(`다항식 ${jh(head, '을/를')} 전개할 때, 서로 다른 항의 개수는?`, n + 1, {
        explain: `일반항 ${nC(n, 'r')}${ms(genS(p, 'x', `${n}-r`) + genS(q, 'y', 'r'))}에서 ${ms('r')} = 0, 1, ⋯, ${n}이고 항마다 ${X_}, ${V('y')}의 차수가 다르므로 항은 ${n} + 1 = ${n + 1}(개)이다.`,
        facts: { calc: [[`${n}+1`, 0]] }
      });
    })
  ];

  // ── 전개식의 항의 계수 ──
  const coefTypes = [
    T('coef-xy', '(px + qy)ⁿ의 전개식에서 xᵃyᵇ의 계수', '①5', (d, k) => {
      const sq = k === 1, n = sq ? d.int(5, 10) : d.int(4, 7), p = d.pick([1, 2, 3]), q = d.pick([-4, -3, -2, -1, 1, 2, 3, 4]), r = d.int(1, n - 1);
      if (p === 1 && Math.abs(q) === 1) return null;
      const c = cr(n, r) * p ** (n - r) * q ** r;
      if (Math.abs(c) > 9999) return null;
      const yv = sq ? 'y^2' : 'y', head = mn(`(${lin2(p, 'x', q, yv)})^{${n}}`), want = ms(pv('x', n - r) + pv('y', sq ? 2 * r : r));
      return N(`다항식 ${head}의 전개식에서 ${want}의 계수는?`, c, {
        signed: true,
        explain: `일반항은 ${nC(n, 'r')}${ms(genS(p, 'x', `${n}-r`) + genS(q, yv, 'r'))}이고 ${want}의 항은 ${ms('r')} = ${r}일 때이다. 따라서 계수는 ${prodH([nC(n, r), p === 1 ? '' : powH(p, n - r), powH(q, r)])} = ${sg(c)}이다.`,
        facts: { calc: [[`${combS(n, r)}*${p}**${n - r}*${jn(q)}**${r}`, 0]], rule: sq ? 'square' : 'plain' }
      });
    }, { count: 2 }),
    T('coef-frac', '(xᵖ ± c/x^q)ⁿ의 전개식에서 xᵏ의 계수·상수항', '①6 심1', (d, k) => {
      const a = d.pick([1, 2, 3]), b = d.pick([1, 2]), c1 = d.pick([1, 1, 2, 3]), c2 = d.pick([-3, -2, -1, 1, 2, 3]), n = d.int(4, 9);
      const rs = range(1, n - 1).filter((r) => (k === 1 ? a * (n - r) - b * r === 0 : a * (n - r) - b * r > 0));
      if (!rs.length) return null;
      const r = d.pick(rs), e = a * (n - r) - b * r, c = cr(n, r) * c1 ** (n - r) * c2 ** r;
      if (Math.abs(c) > 9999 || (c1 === 1 && Math.abs(c2) === 1 && k === 0 && d.bool())) return null;
      const expr = fracBin(c1, a, c2, b, n);
      return N(`${expr}의 전개식에서 ${k === 1 ? '상수항은?' : xp(e) + '의 계수는?'}`, c, {
        signed: true,
        explain: `일반항 ${nC(n, 'r')}${ms(genS(c1, pv('x', a), `${n}-r`))}(${c2 < 0 ? MINUS : ''}${frac(String(Math.abs(c2)), ms(pv('x', b)))})${sup(V('r'))}의 ${X_}의 지수는 ${ms(`${a === 1 ? '' : a}(${n} - r) - ${b === 1 ? '' : b}r`)}이고, 이것이 ${jh(String(e), '이/가')} 되는 것은 ${ms('r')} = ${r}일 때이다. 따라서 ${prodH([nC(n, r), c1 === 1 ? '' : powH(c1, n - r), powH(c2, r)])} = ${sg(c)}이다.`,
        facts: { calc: [[`${combS(n, r)}*${c1}**${n - r}*${jn(c2)}**${r}`, 0]], rule: k === 1 ? 'const' : 'power' }
      });
    }, { count: 2 }),
    T('coef-asymptote', '점근선으로 구한 상수가 든 식의 계수', '①7', (d) => {
      const a = d.pick([1, 2, 3, -1, -2]), u = d.pick([2, 3]), s = d.pick(u === 2 ? [1, -1] : [1, 2, -1]), t = d.int(-6, 6), n = d.int(5, 7);
      if (t === -s * a || t === 0) return null;
      const rs = range(2, n - 1).filter((r) => 2 * n - 3 * r > 0);
      if (!rs.length) return null;
      const r = d.pick(rs), e = 2 * n - 3 * r, v = Q(cr(n, r) * a ** (n - r) * s ** r, u ** r);
      if (v.q === 1 || Math.abs(v.p) > 2000 || v.q > 2000) return null;
      const fx = ms('y = ') + frac(ms(lin2(s, 'x', t, '')), ms(lin2(u, 'x', -u * a, '')));
      const body = nb('(' + ms('ax^2') + ' + ' + frac(B_, X_) + ')' + sup(n));
      const bq = Q(s, u), bH = nb((bq.p < 0 ? MINUS : '') + frac(Math.abs(bq.p), bq.q));
      return qAns(`유리함수 ${fx}의 그래프의 점근선의 방정식이 ${ms('x = a')}, ${ms('y = b')}일 때, ${body}의 전개식에서 ${xp(e)}의 계수는?`, v, {
        signed: true,
        explain: `점근선은 분모가 0이 되는 ${ms('x = ')}${sg(a)}${tail(Math.abs(a), '과/와')} 분자·분모의 ${X_}의 계수의 비인 ${ms('y = ')}${bH}이므로 ${A_} = ${sg(a)}, ${B_} = ${bH}이다. 일반항 ${nC(n, 'r')}${mn(`(ax^2)^{${n}-r}`)}(${frac(B_, X_)})${sup(V('r'))}의 ${X_}의 지수 ${ms(`2(${n} - r) - r`)}이 ${e}이면 ${ms('r')} = ${r}이므로 계수는 ${prodH([nC(n, r), a === 1 ? '' : powH(a, n - r), '(' + bH + ')' + sup(r)])} = ${v.p < 0 ? MINUS : ''}${frac(Math.abs(v.p), v.q)}이다.`,
        facts: { value: `${combS(n, r)}*${jn(a)}**${n - r}*(${s}/${u})**${r}` }
      });
    })
  ];

  // ── 계수 조건으로 미지수 구하기 ──
  const solveTypes = [
    T('solve-const-poly', '한 항의 계수가 주어질 때 상수 a(다항식)', '①8', (d, k) => {
      if (k === 0) {
        // 지수가 홀수인 a: 실수 a 가 하나로 정해진다.
        const n = d.int(4, 7), r = d.pick(range(3, n - 1).filter((x) => x % 2 === 1)), a = d.pick([-3, -2, 2, 3]), swap = d.bool();
        const G = cr(n, r) * a ** r;
        if (Math.abs(G) > 9999) return null;
        const head = ms(swap ? `(ax + y)^${n}` : `(x + ay)^${n}`), want = ms(swap ? pv('x', r) + pv('y', n - r) : pv('x', n - r) + pv('y', r));
        return N(`다항식 ${head}의 전개식에서 ${want}의 계수가 ${sg(G)}일 때, 실수 ${A_}의 값은?`, a, {
          signed: true,
          explain: `${want}의 항은 ${nC(n, r)}${ms(swap ? `(ax)^{${r}}${pv('y', n - r)}` : `${pv('x', n - r)}(ay)^{${r}}`)}이므로 ${ms(`${cr(n, r)}a^{${r}} = `)}${sg(G)}, ${ms(`a^{${r}} = `)}${sg(a ** r)}이다. ${r}제곱해서 ${sg(a ** r)}${tail(Math.abs(a ** r), '이/가')} 되는 실수는 ${sg(a)}뿐이다.`,
          facts: { digit: { template: `${G - 1}<${cr(n, r)}*(□)**${r}<${G + 1}`, lo: -9, hi: 9, ask: 'only' } }
        });
      }
      // 지수가 짝수인 a: 부호 조건으로 하나를 고른다.
      const n = d.int(4, 7), r = d.pick(range(2, n - 1).filter((x) => x % 2 === 0)), c = d.pick([1, 2, 3]), t = d.pick([1, 2, 3]), neg = d.bool(), a = neg ? -t : t;
      const G = cr(n, r) * (c * a) ** r;
      if (G > 9999) return null;
      const head = mn(`(x^2 + ${c === 1 ? '' : c}a)^${n}`), e = 2 * (n - r);
      return N(`다항식 ${head}의 전개식에서 ${xp(e)}의 계수가 ${G}일 때, ${neg ? '음수' : '양수'} ${A_}의 값은?`, a, {
        signed: true,
        explain: `${xp(e)}의 항은 ${nC(n, r)}${mn(`(x^2)^{${n - r}}(${c === 1 ? '' : c}a)^{${r}}`)}이므로 ${ms(`${cr(n, r) * c ** r}a^{${r}}`)} = ${G}, ${ms(`a^{${r}}`)} = ${t ** r}이다. 실수 ${A_}는 ${t} 또는 ${MINUS}${t}이고 ${A_} ${neg ? '&lt;' : '&gt;'} 0이므로 ${sg(a)}이다.`,
        facts: { digit: { template: `${G - 1}<${cr(n, r)}*(${c}*□)**${r}<${G + 1}`, lo: neg ? -9 : 1, hi: neg ? -1 : 9, ask: 'only' } }
      });
    }, { count: 2 }),
    T('solve-const-frac', '분수 꼴 항이 든 식의 한 항의 계수가 주어질 때 상수 a', '①9', (d) => {
      const pp = d.pick([2, 3]), q = d.pick([1, 2]), c = d.pick([1, 1, 2, 3]), n = d.int(4, 6), a = d.pick([-3, -2, -1, 1, 2, 3]);
      const rs = range(3, n - 1).filter((r) => r % 2 === 1 && pp * (n - r) - q * r >= 0);
      if (!rs.length) return null;
      const r = d.pick(rs), e = pp * (n - r) - q * r, G = cr(n, r) * c ** (n - r) * (-a) ** r;
      if (Math.abs(G) > 9999) return null;
      const expr = nb('(' + ms(mon(c, pv('x', pp), true)) + ' ' + MINUS + ' ' + frac(A_, ms(pv('x', q))) + ')' + sup(n));
      return N(`${expr}의 전개식에서 ${e === 0 ? '상수항이' : xp(e) + '의 계수가'} ${sg(G)}일 때, 실수 ${A_}의 값은?`, a, {
        signed: true,
        explain: `일반항의 ${X_}의 지수 ${ms(`${pp}(${n} - r) - ${q === 1 ? '' : q}r`)}이 ${e}인 것은 ${ms('r')} = ${r}일 때이므로 ${prodH([nC(n, r), c === 1 ? '' : powH(c, n - r), ms('(-a)') + sup(r)])} = ${sg(G)}, ${ms(`a^{${r}}`)} = ${sg(a ** r)}이다. 따라서 ${A_} = ${sg(a)}이다.`,
        facts: { digit: { template: `${G - 1}<${cr(n, r)}*${c}**${n - r}*(-1*□)**${r}<${G + 1}`, lo: -9, hi: 9, ask: 'only' } }
      });
    }),
    T('solve-equal-coef', '두 항의 계수가 같을 때 상수 a', '①10', (d) => {
      const n = d.int(5, 10), p = d.int(1, n - 2), v = Q(n - p, p + 1);
      if (v.q === 1) return null;
      return qAns(`다항식 ${mn(`(x + a)^{${n}}`)}의 전개식에서 ${xp(p)}의 계수와 ${xp(p + 1)}의 계수가 서로 같을 때, 양수 ${A_}의 값은?`, v, {
        explain: `${xp(p)}의 계수는 ${nC(n, n - p)}${ms(pv('a', n - p))}, ${xp(p + 1)}의 계수는 ${nC(n, n - p - 1)}${ms(pv('a', n - p - 1))}이다. ${ms(`${cr(n, p)}${pv('a', n - p)} = ${cr(n, p + 1)}${pv('a', n - p - 1)}`)}에서 ${A_} ≠ 0이므로 ${A_} = ${frac(cr(n, p + 1), cr(n, p))} = ${frac(v.p, v.q)}이다.`,
        facts: { value: `(${combS(n, p + 1)})/(${combS(n, p)})` }
      });
    }),
    T('solve-sum-coef', 'xᵏ과 1/xᵏ의 계수의 합이 주어질 때 상수 a', '①11', (d) => {
      const n = d.pick([6, 8, 10]), k = n >= 8 ? d.pick([2, 4]) : 2, t = d.pick([1, 2, 3]), r = (n - k) / 2, Cn = cr(n, r), Mv = Cn * (1 + t ** k);
      if (Mv > 9999) return null;
      const body = nb('(' + X_ + ' + ' + frac(A_, X_) + ')' + sup(n));
      return N(`${body}의 전개식에서 ${xp(k)}의 계수와 ${xp(-k)}의 계수의 합이 ${Mv}${ms(pv('a', r))}일 때, 양수 ${A_}의 값은?`, t, {
        explain: `일반항 ${nC(n, 'r')}${ms(`x^{${n}-r}`)}(${frac(A_, X_)})${sup(V('r'))}에서 ${xp(k)}의 계수는 ${nC(n, r)}${ms(pv('a', r))}, ${xp(-k)}의 계수는 ${nC(n, r + k)}${ms(pv('a', r + k))}이다. ${ms(`${Cn}${pv('a', r)}(1 + a^{${k}}) = ${Mv}${pv('a', r)}`)}에서 ${ms(`a^{${k}}`)} = ${t ** k}이므로 ${A_} = ${t}이다.`,
        facts: { digit: { template: `${Mv - 1}<${Cn}*(1+□**${k})<${Mv + 1}`, lo: 1, hi: 9, ask: 'only' } }
      });
    }),
    T('solve-n', '계수 조건으로 지수 n 구하기', '①12', (d, k) => {
      if (k === 0) {
        const n = d.int(6, 12), m = d.pick(range(3, n - 1)), G = cr(n, 2) * (-1) ** n, cm = cr(n, m) * (-1) ** (n - m);
        return M(`다항식 ${ms('(x - 1)^n')}의 전개식에서 ${xp(2)}의 계수가 ${sg(G)}일 때, 자연수 ${V('n')}의 값과 ${xp(m)}의 계수를 차례로 구하시오.`, [{ label: V('n') + ' =', answer: n }, { label: xp(m) + '의 계수', answer: cm, signed: true }], {
          explain: `${xp(2)}의 계수는 ${nC('n', 'n-2')} × ${ms('(-1)^{n-2}')}이고 크기 ${frac(ms('n(n - 1)'), 2)} = ${Math.abs(G)}에서 ${V('n')} = ${n}이다(부호도 맞다). ${xp(m)}의 계수는 ${nC(n, n - m)} × (${MINUS}1)${sup(n - m)} = ${sg(cm)}이다.`,
          facts: { digit: { template: `${Math.abs(G) - 1}<□*(□-1)/2<${Math.abs(G) + 1}`, lo: 2, hi: 30, ask: 'only' }, calc: [[`${combS(n, m)}*(-1)**${n - m}`, 1]] }
        });
      }
      const p = d.pick([2, 3]), j = d.int(2, 6), n = d.int(j + 1, j + 5), G = cr(n, j) * p ** (n - j);
      if (G > 9999) return null;
      const cX = `(${range(0, j - 1).map((i) => (i ? `(□-${i})` : '□')).join('*')})/(${prodS(j, j)})`;
      return N(`다항식 ${mn(`(x + ${p})^n`)}의 전개식에서 ${xp(j)}의 계수가 ${G}일 때, 자연수 ${V('n')}의 값은? (단, ${mn(`n >= ${j}`)})`, n, {
        explain: `${xp(j)}의 항은 ${nC('n', 'n-' + j)}${ms(`x^{${j}}`)} × ${ms(`${p}^{n-${j}}`)}이므로 ${nC('n', j)} × ${ms(`${p}^{n-${j}}`)} = ${G}이다. ${V('n')} = ${j}, ${j + 1}, ⋯을 차례로 넣으면 ${V('n')} = ${n}일 때 ${nC(n, j)} × ${pw(p, n - j)} = ${G}이다.`,
        facts: { digit: { template: `${G - 1}<${cX}*${p}**(□-${j})<${G + 1}`, lo: j, hi: 30, ask: 'only' } }
      });
    }, { count: 2 })
  ];

  B.addUnit({ id: '11-3-2', grade: 11, semester: 3, no: 2, title: '이항정리', version: 1, groups: [
    { id: 'expand', title: '이항정리와 전개식', standard: STD, types: expandTypes },
    { id: 'coef', title: '전개식의 항의 계수', standard: STD, types: coefTypes },
    { id: 'solve', title: '계수 조건으로 미지수 구하기', standard: STD, types: solveTypes },
    { id: 'product', title: '곱·합의 전개식에서 계수', standard: STD, types: [] },
    { id: 'sums', title: '이항계수의 성질', standard: STD, types: [] },
    { id: 'remainder', title: '이항정리의 활용 — 큰 수의 나머지', standard: STD, types: [] },
    { id: 'pascal', title: '파스칼의 삼각형', standard: STD, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
