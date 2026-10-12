// 5학년 1학기 5단원 분수의 덧셈과 뺄셈 — 단원 틀과 기본 문항(진분수·대분수의 덧셈과 뺄셈: 그림으로 알아보기, 계산 과정, 계산).
// 수집해 둔 교과서 8종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 66·85·68꼴, 심화꼴 69꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/5-1-5/싣기_대조표.md 에 있다.
// (잘못된 계산, 계산 결과 비교, 조건에 맞는 수, □가 있는 식, 문장제, 실력 문항은 5-1-5b.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 영역은 수와 연산, 성취기준은 6수01-08(분모가 다른 분수의 덧셈과 뺄셈의 계산 원리를 탐구하고 그 계산을 할 수 있다) 하나이다.
//
// 싣는 기준
//  - 분모가 다른 분수를 통분하여 더하고 빼는 일만 싣는다. 하는 일이 다르면 다른 문제다: 주는 것(통분한 모양을 점선으로 나타낸 띠, ×표 한 띠, 수직선, 식, 문장),
//    묻는 것(과정의 빈칸, 값, 고르기), 계산 구조가 다르면 따로 싣고 계산 문항에는 facts.rule 에 그 이름을 단다(이름대로 되게 수를 뽑는다):
//    한쪽 분모가 다른 쪽의 배수인 쌍(7/10, 1/5) · 공약수가 1뿐인 쌍(2/3, 4/5) · 그 밖의 쌍(5/6, 7/8), 합이 1보다 작다·크다, 대분수의 받아올림·받아내림 유무,
//    자연수 부분이 같은 뺄셈, 차가 진분수가 되는 뺄셈, 대분수와 진분수, 세 분수.
//  - 교육과정: 「기약분수로 나타낼 것을 요구하지 않을 경우, 계산 결과를 기약분수가 아닌 분수로 나타내는 것도 허용한다.」 분수 하나를 답하는 문항은 크기가 같은 분수를
//    모두 맞게 친다(anyForm). 문제 글이 「기약분수로 나타내시오」라고 한 문항(padd-simplest, psub-simplest)만 기약분수를 요구한다. 적어 두는 답은 언제나 기약분수이다.
//  - 교육과정: 「공통분모로 최소공배수뿐만 아니라 분모의 곱과 같은 공배수도 이용하게 할 수 있다.」 계산 과정의 빈칸을 묻는 문항은 공통분모를 문제가 정해 준다
//    (「두 분모의 곱을 공통분모로」「두 분모의 최소공배수를 공통분모로」, 또는 틀에 공통분모를 적어 준다).
//  - 두 기약분수의 분모가 다르면 합이나 차가 자연수로 떨어지지 않는다. 세 분수의 계산은 자연수가 되는 수를 걸러 낸다.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(빈 곳에 두 수의 합·차 써넣기, 화살표 상자, 덧셈·뺄셈 표, 사다리는 계산 문항과 같은 문제).
//
// 뺀 것과 까닭
//  - 앞 단원·앞 학년: 분모를 정해 주고 크기가 같은 분수로 고치기(①2), 공통분모가 될 수 있는 수 고르기(①7 ②19) — 통분만 하는 5-1-4의 일이고 이미 실려 있다.
//    (자연수)−(분수)(①30), 분모가 같은 분수의 계산과 약분·통분 되짚기(②83 ③68 심51) — 4-2-1과 5-1-4.
//  - 뒤 단원·상위 학년: 변의 길이의 합·둘레(①65 ②76 ③58 심43·61 — 5-1-6), 똑같이 나누어 한 몫 구하기(①66 ③60 심58 — 분수의 나눗셈),
//    같은 길이를 세 장 넘게 겹쳐 잇기(③59의 변형 심57 — 같은 수를 거듭 더하는 곱셈과 간격 세기), 일의 양(심69)
//  - 영역이 다른 것: 분을 시간의 분수로, cm를 m의 분수로 고쳐야 하는 것(①60 ②77 ③54 심52·53·54 — 단위를 바꾸는 측정의 일이 먼저다), 음표의 박(②85)
//  - 색칠하기(작도: ③7, ①3·②1~5의 색칠하는 부분) — 색칠해 준 그림을 보고 답하는 꼴로 실었다. 과정·까닭·방법 쓰기(서술형: ①15·16·36 ②15~18·42~44 ③12~14 심5·6·8)는
//    과정의 빈칸, 방법 고르기, 처음 잘못된 곳 고르기, 까닭 고르기로 바꾸어 실었다. 문제 만들기(①64 ②82 ③65)와 답이 열려 있는 것(③47), 어림(①63)은 뺐다.
//  - 조건 풀이·경우 따지기·퍼즐이 어려움의 대부분인 것: □에 들어갈 단위분수의 수(①40), 가로와 세로의 합이 같은 칸(①43), 약속한 셈(①44 ②58 ③39 심29),
//    단위분수의 합으로 나타내기(①45 ②84 심66), 수 카드 여섯 장으로 두 대분수 만들기(①47 ③46 심37), 만들 수 있는 진분수를 모두 더하기(③44), 네 사람의 자리(①61),
//    옮겨 담아 같아지는 양(심64), 몫과 나머지로 감춘 합(심65), 최대공약수·최소공배수 조건(심67), 여러 분수를 묶어 더하기(심68), 분수 마방진(③67), 조건이 넷인 길(심49)
//  - 뜻 없는 셈: 두 식의 계산 결과끼리 다시 더하기(②33 심17), 빈칸에 들어갈 수끼리 더하기(①10의 변형), 차를 거듭 구하는 피라미드(③66)
//  - 같은 문제여서 한 번만 실은 것: 화살표 상자·표·사다리·두 수의 합과 차 써넣기(①18·26·28의 변형 ②29·31 ③23 심2 — 계산 문항과 같다),
//    이어서 두 번 계산하는 틀(①42 ②32 심27 — 세 분수의 계산과 같다), 같은 것 두 개의 무게를 빼기(②68 — 두 번 덜어 내기와 같다), 두 길의 거리 견주기(심48 — 두 합 견주기와 같다),
//    겹친 부분의 길이(심56 — 겹친 구간의 거리와 같다), 맞닿은 두 원의 한 구간(심60 — 길 위의 한 구간과 같다), 어떤 수에 더 가까운 계산 결과(심16 — 기준선에 가까운 쪽과 같다),
//    직사각형의 가로와 세로·두 색 테이프의 차(②74·75 — 두 양의 차와 같다)
//  - 그림이 필요해 미룬 것은 없다. 띠·수직선은 이 파일의 그림 함수로 그렸고, 길·색 테이프는 있는 도구(route, tapes)로 자리만 보이고 수는 글에 적었다.
// 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?", 시키는 말은 "~하시오."
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, mixed, lines, tagged, M, C, F } = B.kit;
  const STD = '6수01-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'];
  const labelled = (answers) => answers.map((answer, i) => ({ label: LAB[i], answer }));
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => x / gcd(x, y) * y;
  // 토씨: 분수와 대분수는 분자를 마지막에 읽는다(5분의 3, 2와 5분의 3).
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const SG = { '+': '+', '-': '−', '=': '=', '>': '&gt;', '<': '&lt;' };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  // 식 한 줄: 조각을 이어 적는다. '+', '-', '=' 은 기호로 바꾼다.
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const par = (...parts) => '(' + parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' ') + ')';

  // ── 수 하나 ──
  // 자연수 부분 w, 분수 부분 n/d. n = 0 이면 자연수, w = 0 이면 분수이다. 풀이에는 분수 부분이 가분수인 꼴(2 13/12)도 적는다.
  const V = (w, n, d) => ({ w, n, d });
  const W = (v, w) => V(w, v.n, v.d);
  const show = (v) => (v.n === 0 ? String(v.w) : v.w ? mixed(v.w, v.n, v.d) : frac(v.n, v.d));
  const vj = (v, pair) => show(v) + tail(v.n === 0 ? v.w : v.n, pair);
  const fj = (n, den, pair) => frac(n, den) + tail(n, pair);
  const top = (v) => v.w * v.d + v.n;
  // 값(기약분수 p/q)과 식의 값. 식은 수와 '+', '-' 를 번갈아 적은 배열이다.
  const R = (p, q) => { const g = gcd(Math.abs(p), q) || 1; return { p: p / g, q: q / g }; };
  const val = (v) => R(top(v), v.d);
  const calc = (parts) => { let r = R(0, 1), s = '+'; for (const p of parts) { if (typeof p === 'string') s = p; else { const v = val(p); r = R(r.p * v.q + (s === '+' ? 1 : -1) * v.p * r.q, r.q * v.q); } } return r; };
  const toV = (r) => V(Math.floor(r.p / r.q), r.p % r.q, r.q);
  const eqOf = (parts) => eq(...parts.map((p) => (typeof p === 'string' ? p : show(p))));
  // 검사가 다시 셈하는 식: 분모들의 곱을 공통분모로 한 분자(num)와 그 공통분모(den). 문제에 적힌 수로만 적는다(대분수 2 3/7 은 (2*7+3)).
  const imp = (v) => (v.n === 0 ? String(v.w) : v.w ? `(${v.w}*${v.d}+${v.n})` : String(v.n));
  function over(parts) {
    const dens = parts.filter((p) => typeof p !== 'string').map((v) => (v.n === 0 ? 0 : v.d));
    let num = '', s = '', k = 0;
    for (const p of parts) {
      if (typeof p === 'string') { s = p; continue; }
      num += s + [imp(p)].concat(dens.filter((x, j) => j !== k && x)).join('*'); k += 1;
    }
    return { num, den: dens.filter(Boolean).join('*'), D: dens.filter(Boolean).reduce((x, y) => x * y, 1) };
  }
  // 식의 값을 분수 칸(자연수·분자·분모)에 답할 때의 근거. 분자를 다시 셈한 다음 기약분수로 고친다(g 는 그때 나누는 수라 글에 없다).
  function proof(parts, more) {
    const { num, den, D } = over(parts), r = calc(parts), g = D / r.q, m = more || {};
    const list = r.p > r.q ? [[`((${num})-(${num})%(${den}))/(${den})`, 0], [`(${num})%(${den})/${g}`, 1], [`${den}/${g}`, 2]] : [[`(${num})/${g}`, 0], [`${den}/${g}`, 1]];
    return Object.assign({}, m, { calc: list, unseen: [g].concat(m.unseen || []) });
  }
  // 분수 하나를 답하는 문항. 기약분수로 나타내라고 한 문항(simplest)만 기약분수를 요구하고, 나머지는 크기가 같은 분수를 모두 받는다.
  function ans(text, parts, o) {
    const r = calc(parts);
    if (r.p <= 0 || r.q === 1) throw new Error('답이 자연수이거나 0보다 크지 않다');
    return F(text, r.p % r.q, r.q, { whole: r.p > r.q ? Math.floor(r.p / r.q) : undefined, anyForm: !o.simplest, unit: o.unit, figure: o.figure, explain: o.explain, facts: proof(parts, o.facts) });
  }

  // ── 풀이 글 ──
  // a op b 를 두 분모의 최소공배수로 통분하여 계산하는 차례(처음 식, 통분한 식, 받아올림·받아내림, 결과, 기약분수).
  function stages(a, op, b) {
    const L = lcm(a.d, b.d), x = a.n * (L / a.d), y = b.n * (L / b.d), out = [`${show(a)} ${SG[op]} ${show(b)}`, `${show(V(a.w, x, L))} ${SG[op]} ${show(V(b.w, y, L))}`];
    let w, n;
    if (op === '+') { w = a.w + b.w; n = x + y; if (n >= L) { out.push(show(V(w, n, L))); w += 1; n -= L; } }
    else if (x < y) { out.push(`${show(V(a.w - 1, x + L, L))} ${SG[op]} ${show(V(b.w, y, L))}`); w = a.w - 1 - b.w; n = x + L - y; }
    else { w = a.w - b.w; n = x - y; }
    out.push(show(V(w, n, L)));
    const g = gcd(n, L);
    if (g > 1) out.push(show(V(w, n / g, L / g)));
    return out.filter((s, i) => i === 0 || s !== out[i - 1]);
  }
  const told = (a, op, b) => stages(a, op, b).join(' = ');
  // 세 수의 계산: 앞에서부터 차례로
  const told3 = (parts) => { const [a, s1, b, s2, c] = parts, r1 = toV(calc([a, s1, b])); return `${told(a, s1, b)}, ${told(r1, s2, c)}`; };

  // ── 수 고르기 ──
  // 두 분모: 한쪽이 다른 쪽의 배수(MULTIPLE), 공약수가 1뿐(COPRIME), 그 밖(GENERAL). FIGS 는 그림에 쓰는 쌍(최소공배수가 12 이하).
  const MULTIPLE = [[2, 4], [2, 6], [3, 6], [2, 8], [4, 8], [3, 9], [5, 10], [3, 12], [4, 12], [6, 12], [7, 14], [3, 15], [5, 15], [4, 16], [8, 16], [6, 18], [9, 18], [4, 20], [5, 20], [10, 20], [7, 21], [6, 24], [8, 24], [12, 24]];
  const COPRIME = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [3, 8], [5, 8], [7, 8], [2, 9], [4, 9], [5, 9], [7, 9], [8, 9], [3, 10], [7, 10]];
  const GENERAL = [[4, 6], [6, 8], [6, 9], [4, 10], [6, 10], [8, 10], [8, 12], [9, 12], [10, 12], [6, 14], [6, 15], [9, 15], [10, 15], [12, 15], [12, 16], [12, 18], [8, 20], [15, 20], [14, 21], [10, 25]];
  const OTHER = COPRIME.concat(GENERAL).filter(([x, y]) => lcm(x, y) <= 60);
  const SMALL = MULTIPLE.concat(COPRIME, GENERAL).filter(([x, y]) => lcm(x, y) <= 30);
  const FIGS = [[2, 3], [2, 4], [3, 4], [2, 5], [2, 6], [3, 6], [4, 6], [2, 8], [4, 8], [3, 9], [2, 10], [5, 10], [3, 12], [4, 12], [6, 12]];
  const TRIPLES = [[4, 6, 8], [3, 4, 6], [2, 3, 8], [4, 8, 12], [5, 10, 20], [6, 9, 18], [3, 5, 15], [4, 5, 10], [6, 8, 12], [9, 12, 18], [5, 6, 15], [4, 9, 12], [2, 5, 10], [3, 6, 9], [4, 6, 12], [3, 8, 12]];
  const coTop = (d, den) => d.until(() => d.int(1, den - 1), (v) => gcd(v, den) === 1);
  // 기약 진분수 둘(분모는 list 에서 뽑아 차례를 섞는다). 분모가 다른 두 기약분수는 크기가 같지 않고, 합이 1이 되지도 않는다.
  const two = (d, list, ok) => d.until(() => { const [b, e] = d.shuffle(d.pick(list)); return [V(0, coTop(d, b), b), V(0, coTop(d, e), e)]; }, ([a, b]) => !ok || ok(a, b));
  const fsum = (a, b) => a.n * b.d + b.n * a.d - a.d * b.d;   // 분수 부분의 합이 1보다 크면 양수
  const fgap = (a, b) => a.n * b.d - b.n * a.d;               // 분수 부분이 a 쪽이 크면 양수
  const less1 = (a, b) => fsum(a, b) < 0, more1 = (a, b) => fsum(a, b) > 0, bigger = (a, b) => fgap(a, b) > 0, smaller = (a, b) => fgap(a, b) < 0;
  const numer = (v, L) => v.n * (L / v.d);
  const how = (a, b) => {
    const L = lcm(a.d, b.d);
    if (L === Math.max(a.d, b.d)) return `${josa(L, '은/는')} ${Math.min(a.d, b.d)}의 배수이므로 분모가 ${Math.min(a.d, b.d)}인 분수만 분모가 ${L}인 분수로 고친다. `;
    return L === a.d * b.d ? `두 분모의 공약수가 1뿐이므로 두 분모의 곱 ${josa(L, '을/를')} 공통분모로 하여 통분한다. ` : `두 분모의 최소공배수 ${josa(L, '을/를')} 공통분모로 하여 통분한다. `;
  };

  // ── 그림 ──
  // 띠 한 칸(왼쪽 위 x, y / 너비 width): 똑같이 parts 칸으로 나누어 앞의 on 칸을 색칠하고, fine 이 parts 보다 크면 점선으로 다시 똑같이 fine 칸으로 나눈다.
  // crossed 는 ×표 할 작은 칸(fine 칸으로 나눈 것 가운데 몇째인지)의 목록이다.
  function bandAt(x, y, width, parts, on, fine, crossed) {
    const h = 26, n = fine || parts, cw = width / n, pw = width / parts;
    let out = '';
    for (let i = 0; i < parts; i += 1) out += `<rect class="mb-piece${i < on ? ' is-on' : ''}" x="${(x + i * pw).toFixed(2)}" y="${y}" width="${pw.toFixed(2)}" height="${h}"/>`;
    for (let i = 1; i < n; i += 1) if ((i * parts) % n !== 0) out += `<line x1="${(x + i * cw).toFixed(2)}" y1="${y}" x2="${(x + i * cw).toFixed(2)}" y2="${y + h}" style="stroke:#1f2933;stroke-width:0.9;stroke-dasharray:3 2.4"/>`;
    for (const i of crossed || []) { const cx = x + (i + 0.5) * cw, r = Math.min(5, cw / 2 - 1.5); out += `<path class="mb-strike" style="stroke-width:1.8" d="M${(cx - r).toFixed(2)} ${y + h / 2 - r}L${(cx + r).toFixed(2)} ${y + h / 2 + r}M${(cx + r).toFixed(2)} ${y + h / 2 - r}L${(cx - r).toFixed(2)} ${y + h / 2 + r}"/>`; }
    return out;
  }
  // 띠 하나. cross: 색칠한 부분의 뒤쪽에서부터 ×표 한 작은 칸의 수(덜어 낸 만큼).
  function band(parts, on, fine, cross) {
    const width = 216, n = fine || parts, shaded = on * n / parts, crossed = Array.from({ length: cross || 0 }, (_, i) => shaded - 1 - i);
    const said = `띠를 똑같이 ${parts}칸으로 나누어 ${on}칸을 색칠` + (n !== parts ? `하고, 점선으로 다시 똑같이 ${n}칸으로 나눔` : '') + (cross ? `. 색칠한 부분 가운데 작은 칸 ${cross}칸에 ×표` : '');
    return `<svg class="mb-pieces" style="vertical-align:middle" viewBox="0 0 ${width + 4} 30" width="${width + 4}" role="img" aria-label="${said}">${bandAt(2, 2, width, parts, on, n, crossed)}</svg>`;
  }
  // 대분수 그림: 모두 색칠한 띠 v.w 개와 v.d 칸 중 v.n 칸을 색칠한 띠 하나(띠마다 점선으로 fine 칸). 한 줄에 perRow 개씩 놓는다(1이면 아래로 쌓는다).
  // cut 을 주면 그만큼(대분수 cut.w 와 fine 칸으로 나눈 작은 칸 cut.small 개)에 ×표 한다. 분수 부분의 작은 칸이 모자라면 바로 앞의 띠에서 마저 덜어 낸다.
  function bars(v, fine, cut, perRow) {
    const cols = perRow || 1, bw = cols === 1 ? 216 : 126, gap = 8, rowH = 34, k = fine / v.d, x = v.n * k, width = cols * bw + (cols - 1) * gap + 4, height = Math.ceil((v.w + 1) / cols) * rowH - 4;
    const crossed = Array.from({ length: v.w + 1 }, () => []);
    if (cut) {
      const fromLast = Math.min(x, cut.small), fromPrev = cut.small - fromLast;
      for (let i = 0; i < fromLast; i += 1) crossed[v.w].push(x - 1 - i);
      for (let i = 0; i < fromPrev; i += 1) crossed[v.w - 1].push(fine - 1 - i);
      for (let j = 0, at = v.w - 1 - (fromPrev ? 1 : 0); j < cut.w; j += 1, at -= 1) for (let i = 0; i < fine; i += 1) crossed[at].push(i);
    }
    let out = '';
    for (let j = 0; j <= v.w; j += 1) out += bandAt(2 + (j % cols) * (bw + gap), 2 + Math.floor(j / cols) * rowH, bw, v.d, j < v.w ? v.d : v.n, fine, crossed[j]);
    const said = `띠 ${v.w + 1}개를 각각 똑같이 ${v.d}칸으로 나누어 띠 ${v.w}개는 모두 색칠하고 나머지 띠는 ${v.n}칸을 색칠` + (fine !== v.d ? `, 점선으로 띠마다 다시 똑같이 ${fine}칸으로 나눔` : '') + (cut ? `. 색칠한 부분 가운데 띠 ${cut.w}개와 작은 칸 ${cut.small}칸에 ×표` : '');
    return `<svg class="mb-pieces" style="vertical-align:middle" viewBox="0 0 ${width} ${height}" width="${width}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 0부터 1까지의 수직선(똑같이 parts 칸). hops 의 칸 수만큼 0에서부터 차례로 뛴다(음수는 왼쪽으로 되돌아온다).
  function hopLine(parts, hops) {
    const u = Math.min(24, 264 / parts), x = (i) => 18 + i * u, y = 50, width = 36 + parts * u;
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(parts).toFixed(1)}" y2="${y}"/>`;
    for (let i = 0; i <= parts; i += 1) out += `<line class="mb-axis" x1="${x(i).toFixed(1)}" y1="${y - (i % parts === 0 ? 6 : 3.5)}" x2="${x(i).toFixed(1)}" y2="${y + (i % parts === 0 ? 6 : 3.5)}"/>`;
    out += `<text class="mb-km-label" x="${x(0)}" y="${y + 20}" text-anchor="middle">0</text><text class="mb-km-label" x="${x(parts).toFixed(1)}" y="${y + 20}" text-anchor="middle">1</text>`;
    let at = 0;
    hops.forEach((hop, k) => {
      const x1 = x(at), x2 = x(at + hop), base = y - 8, cx = (x1 + x2) / 2, cy = base - (hop < 0 ? 22 : 40), color = k === 0 ? '#1d4ed8' : '#c2410c';
      // 화살촉은 곡선이 끝점으로 들어오는 쪽을 향한다.
      const dx = x2 - cx, dy = base - cy, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, bx = x2 - ux * 6, by = base - uy * 6;
      out += `<path d="M${x1.toFixed(1)} ${base}Q${cx.toFixed(1)} ${cy} ${x2.toFixed(1)} ${base}" style="fill:none;stroke:${color};stroke-width:1.7"/>`
        + `<path d="M${x2.toFixed(1)} ${base}L${(bx - uy * 3).toFixed(1)} ${(by + ux * 3).toFixed(1)}L${(bx + uy * 3).toFixed(1)} ${(by - ux * 3).toFixed(1)}Z" style="fill:${color}"/>`;
      at += hop;
    });
    const said = hops.map((hop, k) => (k === 0 ? `0에서 오른쪽으로 ${hop}칸 간` : `${hop < 0 ? '왼쪽' : '오른쪽'}으로 ${Math.abs(hop)}칸 간`)).join(' 다음 ').replace(/간$/, '갔다');
    return `<svg class="mb-numberline" viewBox="0 0 ${width.toFixed(1)} 76" width="${Math.round(width)}" role="img" aria-label="수직선: 0부터 1까지를 똑같이 ${parts}칸으로 나누었다. ${said}">${out}</svg>`;
  }

  const CALC = '다음을 계산하시오.';
  B.addUnit({
    id: '5-1-5', grade: 5, semester: 1, no: 5, title: '분수의 덧셈과 뺄셈', version: 1,
    groups: [
      {
        id: 'padd', title: '진분수의 덧셈', standard: STD,
        types: [
          T('padd-fig-pick', '두 분수의 합을 바르게 나타낸 그림 고르기', '①1', (d) => {
            // 틀린 그림: 분모는 분모끼리, 분자는 분자끼리 더한 것 / 통분한 칸 수에 처음 분자를 그대로 더한 것
            const [a, b] = two(d, FIGS, (p, q) => less1(p, q) && p.d + q.d !== lcm(p.d, q.d)), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
            const rows = d.shuffle([[x + y, L], [a.n + b.n, a.d + b.d], [a.n + b.n, L]]), hit = rows.findIndex(([k, n]) => k === x + y && n === L);
            return C(`길이가 같은 두 띠에 각각 ${vj(a, '과/와')} ${show(b)}만큼 색칠하였다. 길이가 같은 띠에 ${show(a)} + ${show(b)}만큼 바르게 색칠한 것은?`, LAB.slice(0, 3), hit, {
              figure: lines([band(a.d, a.n), band(b.d, b.n)]) + tagged(rows.map(([k, n]) => band(n, k))),
              explain: `통분하여 더하면 ${show(a)} + ${show(b)} = ${frac(x, L)} + ${frac(y, L)} = ${frac(x + y, L)}이다. 띠를 똑같이 ${L}칸으로 나누어 ${x + y}칸을 색칠한 ${LAB[hit]}이 바르다.`,
              facts: { choose: { exprs: rows.map(([k, n]) => `${k}/${n}`), rule: 'equals', target: (x + y) / L } }
            });
          }),
          T('padd-fig', '그림을 보고 진분수의 덧셈하기', '①3 ②1 ③1 심3', (d) => {
            const [a, b] = two(d, FIGS, less1), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
            return M('길이가 같은 두 띠에 색칠한 부분의 합을 구하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([x, y, x + y]), {
              figure: lines([band(a.d, a.n, L), band(b.d, b.n, L)]) + eq(show(a), '+', show(b), '=', frac(box(LAB[0]), L), '+', frac(box(LAB[1]), L), '=', frac(box(LAB[2]), L)),
              explain: `작은 칸 하나는 띠 하나의 ${frac(1, L)}이다. 색칠한 작은 칸은 ${x}칸과 ${y}칸이므로 ${frac(x, L)} + ${frac(y, L)} = ${frac(x + y, L)}이다.`,
              facts: { calc: [[`${a.n}*${L}/${a.d}`, 0], [`${b.n}*${L}/${b.d}`, 1], [`${a.n}*${L}/${a.d}+${b.n}*${L}/${b.d}`, 2]] }
            });
          }),
          T('padd-fig-over', '그림을 보고 합이 1보다 큰 덧셈하기', '②2 ③2 ①3', (d) => {
            const [a, b] = two(d, FIGS, more1), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L), e = `${a.n}*${L}/${a.d}+${b.n}*${L}/${b.d}`;
            return M('길이가 같은 두 띠에 색칠한 부분의 합을 구하려고 한다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([x, y, x + y, x + y - L]), {
              figure: lines([band(a.d, a.n, L), band(b.d, b.n, L)]) + lines([eq(show(a), '+', show(b), '=', frac(box(LAB[0]), L), '+', frac(box(LAB[1]), L)), eq('=', frac(box(LAB[2]), L), '=', mixed(1, box(LAB[3]), L))]),
              explain: `작은 칸 하나는 띠 하나의 ${frac(1, L)}이다. ${frac(x, L)} + ${frac(y, L)} = ${frac(x + y, L)}이고, ${fj(x + y, L, '은/는')} ${fj(L, L, '과/와')} ${frac(x + y - L, L)}의 합이므로 ${mixed(1, x + y - L, L)}이다.`,
              facts: { calc: [[`${a.n}*${L}/${a.d}`, 0], [`${b.n}*${L}/${b.d}`, 1], [e, 2], [`${e}-${L}`, 3]] }
            });
          }),
          T('padd-steps-product', '두 분모의 곱으로 통분하여 더하는 과정', '①8 ②7 ③8', (d) => {
            const [a, b] = two(d, GENERAL.filter(([x, y]) => x * y <= 150), less1), P = a.d * b.d, s = a.n * b.d + b.n * a.d, g = gcd(s, P);
            return M('두 분모의 곱을 공통분모로 하여 통분한 다음 계산하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([b.d, a.d, s, s / g]), {
              figure: lines([eq(show(a), '+', show(b)), eq('=', frac(`${a.n} × ${box(LAB[0])}`, `${a.d} × ${b.d}`), '+', frac(`${b.n} × ${box(LAB[1])}`, `${b.d} × ${a.d}`)), eq('=', frac(box(LAB[2]), P), '=', frac(box(LAB[3]), P / g))]),
              explain: `분모에 곱한 수를 분자에도 곱한다. ${frac(a.n * b.d, P)} + ${frac(b.n * a.d, P)} = ${frac(s, P)}이고, 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac(s / g, P / g)}이다.`,
              facts: { calc: [[String(b.d), 0], [String(a.d), 1], [`${a.n}*${b.d}+${b.n}*${a.d}`, 2], [`(${a.n}*${b.d}+${b.n}*${a.d})*${P / g}/${P}`, 3]] }
            });
          }),
          T('padd-steps-lcm', '두 분모의 최소공배수로 통분하여 더하는 과정', '①9·14 ②7 ③8', (d) => {
            const [a, b] = two(d, GENERAL, less1), L = lcm(a.d, b.d), m1 = L / a.d, m2 = L / b.d, s = a.n * m1 + b.n * m2;
            return M('두 분모의 최소공배수를 공통분모로 하여 통분한 다음 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([m1, m2, s]), {
              figure: lines([eq(show(a), '+', show(b)), eq('=', frac(`${a.n} × ${box(LAB[0])}`, `${a.d} × ${box(LAB[0])}`), '+', frac(`${b.n} × ${box(LAB[1])}`, `${b.d} × ${box(LAB[1])}`)), eq('=', frac(box(LAB[2]), L))]),
              explain: `${josa(a.d, '과/와')} ${b.d}의 최소공배수는 ${L}이다. ${L} ÷ ${a.d} = ${m1}, ${L} ÷ ${b.d} = ${m2}이므로 ${frac(a.n * m1, L)} + ${frac(b.n * m2, L)} = ${frac(s, L)}이다.`,
              facts: { calc: [[`${L}/${a.d}`, 0], [`${L}/${b.d}`, 1], [`${a.n}*${L}/${a.d}+${b.n}*${L}/${b.d}`, 2]] }
            });
          }),
          T('padd-steps-over', '합이 1보다 큰 진분수의 덧셈 과정', '②8 ③9 ①8', (d) => {
            const [a, b] = two(d, OTHER, more1), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L), e = `${a.n}*${L}/${a.d}+${b.n}*${L}/${b.d}`;
            return M('분모가 다른 두 분수를 통분하여 더하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([x, y, x + y, x + y - L]), {
              figure: lines([eq(show(a), '+', show(b), '=', frac(box(LAB[0]), L), '+', frac(box(LAB[1]), L)), eq('=', frac(box(LAB[2]), L), '=', mixed(1, box(LAB[3]), L))]),
              explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분하면 ${frac(x, L)} + ${frac(y, L)} = ${frac(x + y, L)}이다. 가분수이므로 대분수로 나타내면 ${mixed(1, x + y - L, L)}이다.`,
              facts: { calc: [[`${a.n}*${L}/${a.d}`, 0], [`${b.n}*${L}/${b.d}`, 1], [e, 2], [`${e}-${L}`, 3]] }
            });
          }),
          T('padd-both-ways', '두 가지 공통분모로 계산하기', '①16 ②17 ③13 심6', (d) => {
            const [a, b] = two(d, GENERAL.filter(([x, y]) => x * y <= 150), less1), P = a.d * b.d, L = lcm(a.d, b.d), s1 = a.n * b.d + b.n * a.d, s2 = numer(a, L) + numer(b, L);
            return M(`${show(a)} + ${vj(b, '을/를')} 두 가지 방법으로 통분하여 계산하려고 한다. ㉠, ㉡에 알맞은 수는?`, labelled([s1, s2]), {
              figure: lines([`두 분모의 곱을 공통분모로 하면 ${ex(frac(box(LAB[0]), P))}`, `두 분모의 최소공배수를 공통분모로 하면 ${ex(frac(box(LAB[1]), L))}`]),
              explain: `두 분모의 곱 ${josa(P, '으로/로')} 통분하면 ${frac(a.n * b.d, P)} + ${frac(b.n * a.d, P)} = ${frac(s1, P)}이고, 최소공배수 ${josa(L, '으로/로')} 통분하면 ${frac(numer(a, L), L)} + ${frac(numer(b, L), L)} = ${frac(s2, L)}이다. 두 결과는 크기가 같은 분수이다.`,
              facts: { calc: [[`${a.n}*${b.d}+${b.n}*${a.d}`, 0], [`${a.n}*${L}/${a.d}+${b.n}*${L}/${b.d}`, 1]] }
            });
          }),
          T('padd-method', '공통분모로 한 수 알아보기', '①15·17 ②15 ③12 심5', (d) => {
            // 두 분모의 곱으로 통분한 계산과 최소공배수로 통분한 계산 가운데 하나를 보인다.
            const [a, b] = two(d, GENERAL.filter(([x, y]) => x * y <= 150), (p, q) => p.d + q.d !== lcm(p.d, q.d)), P = a.d * b.d, L = lcm(a.d, b.d), Dn = d.bool() ? P : L, x = a.n * Dn / a.d, y = b.n * Dn / b.d, s = x + y;
            const rest = [frac(s, Dn)].concat(s > Dn ? [mixed(1, s - Dn, Dn)] : []), g = gcd(s, Dn);
            if (g > 1) rest.push(show(toV(R(s, Dn))));
            const rows = d.shuffle([['두 분모의 곱', `${a.d}*${b.d}`], ['두 분모의 최소공배수', `${a.d}*${b.d}/${gcd(a.d, b.d)}`], ['두 분모의 최대공약수', String(gcd(a.d, b.d))], ['두 분모의 합', `${a.d}+${b.d}`]]);
            return C('다음은 분모가 다른 두 분수를 통분하여 더한 것이다. 공통분모로 한 수는?', rows.map((row) => row[0]), rows.findIndex((row) => row[0] === (Dn === P ? '두 분모의 곱' : '두 분모의 최소공배수')), {
              figure: lines([eq(show(a), '+', show(b), '=', frac(x, Dn), '+', frac(y, Dn)), eq(...rest.reduce((out, part) => out.concat(['=', part]), []))]),
              explain: `공통분모는 ${Dn}이다. ${a.d} × ${b.d} = ${P}이고, ${josa(a.d, '과/와')} ${b.d}의 최소공배수는 ${L}이므로 ${Dn === P ? '두 분모의 곱' : '두 분모의 최소공배수'}${Dn === P ? '을' : '를'} 공통분모로 한 것이다.`,
              facts: { claimed: rows.map((row) => [row[1], Dn]), claimedWant: true }
            });
          }),
          T('padd-calc', '(진분수)+(진분수): 합이 1보다 작다', '①18 ②21 ③15 심1', (d, n) => {
            // 문항마다 두 분모의 관계가 다르다: 한쪽이 다른 쪽의 배수, 공약수가 1뿐, 그 밖.
            const [a, b] = two(d, [MULTIPLE, COPRIME, GENERAL][n], less1);
            return ans(CALC, [a, '+', b], { figure: eq(show(a), '+', show(b)), explain: how(a, b) + told(a, '+', b), facts: { rule: ['addMultiple', 'addCoprime', 'addGeneral'][n] } });
          }, { count: 3 }),
          T('padd-over', '(진분수)+(진분수): 합이 1보다 크다', '①19 ②22 ③16 심1', (d, n) => {
            const [a, b] = two(d, [MULTIPLE, OTHER][n], more1);
            return ans(CALC, [a, '+', b], { figure: eq(show(a), '+', show(b)), explain: how(a, b) + told(a, '+', b), facts: { rule: ['overMultiple', 'overOther'][n] } });
          }, { count: 2 }),
          T('padd-simplest', '덧셈의 결과를 기약분수로 나타내기', '③22 ①19 심2', (d) => {
            // 최소공배수로 통분하여 더해도 약분이 남는 수
            const [a, b] = two(d, GENERAL.concat(MULTIPLE), (p, q) => { const L = lcm(p.d, q.d); return gcd(numer(p, L) + numer(q, L), L) > 1; });
            return ans('계산 결과를 기약분수로 나타내시오.', [a, '+', b], { simplest: true, figure: eq(show(a), '+', show(b)), explain: told(a, '+', b) + '이다. 기약분수로 나타내어야 하므로 분모와 분자를 공약수로 나눈다.' });
          })
        ]
      },
      {
        id: 'madd', title: '대분수의 덧셈', standard: STD,
        types: [
          T('madd-fig', '그림을 보고 대분수의 덧셈하기', '①5 ②3 ③3', (d, n) => {
            // 첫째 문항은 분수 부분의 합이 1보다 작고, 둘째 문항은 1보다 크다(받아올림).
            const [f1, f2] = two(d, FIGS, n === 0 ? less1 : more1), a = W(f1, 1), b = W(f2, 1), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L), w = a.w + b.w;
            const ex1 = `${a.n}*${L}/${a.d}`, ex2 = `${b.n}*${L}/${b.d}`, head = [eq(show(a), '+', show(b)), eq('=', mixed(a.w, box(LAB[0]), L), '+', mixed(b.w, box(LAB[1]), L))];
            return M('두 그림이 나타내는 수의 합을 구하려고 한다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled(n === 0 ? [x, y, w, x + y] : [x, y, x + y, x + y - L]), {
              figure: lines([bars(a, L, null, 2), bars(b, L, null, 2)]) + lines(head.concat([n === 0 ? eq('=', mixed(box(LAB[2]), box(LAB[3]), L)) : eq('=', mixed(w, box(LAB[2]), L), '=', mixed(w + 1, box(LAB[3]), L))])),
              explain: `작은 칸 하나는 띠 하나의 ${frac(1, L)}이다. ` + told(a, '+', b),
              facts: { calc: n === 0 ? [[ex1, 0], [ex2, 1], [`${a.w}+${b.w}`, 2], [`${ex1}+${ex2}`, 3]] : [[ex1, 0], [ex2, 1], [`${ex1}+${ex2}`, 2], [`${ex1}+${ex2}-${L}`, 3]], rule: ['figPlain', 'figCarry'][n] }
            });
          }, { count: 2 }),
          T('madd-steps-split', '자연수끼리, 분수끼리 더하는 과정', '①10 ②10 ③10', (d) => {
            const [f1, f2] = two(d, SMALL, less1), a = W(f1, d.int(1, 5)), b = W(f2, d.int(1, 5)), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
            return M('자연수는 자연수끼리, 분수는 분수끼리 더하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([x, y, a.w + b.w, x + y]), {
              figure: lines([eq(show(a), '+', show(b)), eq('=', mixed(a.w, box(LAB[0]), L), '+', mixed(b.w, box(LAB[1]), L)), eq('=', par(a.w, '+', b.w), '+', par(frac(box(LAB[0]), L), '+', frac(box(LAB[1]), L))), eq('=', mixed(box(LAB[2]), box(LAB[3]), L))]),
              explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분한 다음 자연수는 자연수끼리, 분수는 분수끼리 더한다. ${told(a, '+', b)}`,
              facts: { calc: [[`${a.n}*${L}/${a.d}`, 0], [`${b.n}*${L}/${b.d}`, 1], [`${a.w}+${b.w}`, 2], [`${a.n}*${L}/${a.d}+${b.n}*${L}/${b.d}`, 3]] }
            });
          }),
          T('madd-steps-carry', '분수 부분의 합이 가분수인 덧셈의 과정', '①10 ②10 ③10', (d) => {
            const [f1, f2] = two(d, SMALL, more1), a = W(f1, d.int(1, 5)), b = W(f2, d.int(1, 5)), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L), w = a.w + b.w;
            return M('자연수는 자연수끼리, 분수는 분수끼리 더하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([x + y, x + y - L, w + 1]), {
              figure: lines([eq(show(a), '+', show(b)), eq('=', mixed(a.w, x, L), '+', mixed(b.w, y, L)), eq('=', w, '+', frac(box(LAB[0]), L)), eq('=', w, '+', mixed(1, box(LAB[1]), L), '=', mixed(box(LAB[2]), box(LAB[1]), L))]),
              explain: `분수 부분의 합은 ${frac(x, L)} + ${frac(y, L)} = ${frac(x + y, L)} = ${mixed(1, x + y - L, L)}이다. 자연수 부분의 합 ${w}에 1을 더하므로 ${mixed(w + 1, x + y - L, L)}이다.`,
              facts: { calc: [[`${x}+${y}`, 0], [`${x}+${y}-${L}`, 1], [`${w}+1`, 2]] }
            });
          }),
          T('madd-steps-improper', '가분수로 나타내어 더하는 과정', '①13 ②11 ③11', (d) => {
            const [f1, f2] = two(d, SMALL), a = W(f1, d.int(1, 2)), b = W(f2, d.int(1, 2)), L = lcm(a.d, b.d), X = top(a) * L / a.d, Y = top(b) * L / b.d, S = X + Y;
            return M('대분수를 가분수로 나타내어 더하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([top(a), top(b), S, S % L]), {
              figure: lines([eq(show(a), '+', show(b)), eq('=', frac(box(LAB[0]), a.d), '+', frac(box(LAB[1]), b.d)), eq('=', frac(X, L), '+', frac(Y, L), '=', frac(box(LAB[2]), L)), eq('=', mixed(Math.floor(S / L), box(LAB[3]), L))]),
              explain: `${show(a)} = ${frac(top(a), a.d)}, ${show(b)} = ${frac(top(b), b.d)}이다. 통분하면 ${frac(X, L)} + ${frac(Y, L)} = ${frac(S, L)}이고, 대분수로 나타내면 ${mixed(Math.floor(S / L), S % L, L)}이다.`,
              facts: { calc: [[`${a.w}*${a.d}+${a.n}`, 0], [`${b.w}*${b.d}+${b.n}`, 1], [`${X}+${Y}`, 2], [`(${X}+${Y})%${L}`, 3]] }
            });
          }),
          T('madd-method', '대분수의 덧셈을 어떤 방법으로 계산했는지 알기', '①16·17 ②16·18 ③14 심6', (d) => {
            // 가분수로 나타내어 계산한 것과 자연수끼리·분수끼리 계산한 것 가운데 하나를 보인다. 공통분모는 두 분모의 곱이 아닌 최소공배수이다.
            const [f1, f2] = two(d, GENERAL.filter(([x, y]) => lcm(x, y) <= 30)), a = W(f1, d.int(1, 2)), b = W(f2, d.int(1, 2)), L = lcm(a.d, b.d), byTop = d.bool();
            const x = numer(a, L), y = numer(b, L), X = top(a) * L / a.d, Y = top(b) * L / b.d, S = X + Y, w = a.w + b.w, last = mixed(Math.floor(S / L), S % L, L);
            const shown = byTop
              ? [eq(show(a), '+', show(b), '=', frac(top(a), a.d), '+', frac(top(b), b.d)), eq('=', frac(X, L), '+', frac(Y, L), '=', frac(S, L)), eq('=', last)]
              : [eq(show(a), '+', show(b)), eq('=', mixed(a.w, x, L), '+', mixed(b.w, y, L)), eq(...['=', mixed(w, x + y, L)].concat(x + y > L ? ['=', last] : []))];
            const rows = d.shuffle([['대분수를 가분수로 나타내어 계산하였다.', byTop], ['자연수는 자연수끼리, 분수는 분수끼리 계산하였다.', !byTop], ['두 분모의 곱을 공통분모로 하여 통분하였다.', false], ['통분하지 않고 분모는 분모끼리, 분자는 분자끼리 더하였다.', false]]);
            return C('다음 계산에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: lines(shown),
              explain: (byTop ? `${show(a)}${tail(a.n, '을/를')} ${frac(top(a), a.d)}${tail(top(a), '으로/로')}, ${show(b)}${tail(b.n, '을/를')} ${frac(top(b), b.d)}${tail(top(b), '으로/로')} 고쳐 계산하였다.` : '자연수 부분과 분수 부분을 따로 더하였다.') + ` 공통분모 ${josa(L, '은/는')} 두 분모의 곱 ${a.d * b.d}${tail(a.d * b.d, '이/가')} 아니라 최소공배수이다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('madd-plain', '(대분수)+(대분수): 분수 부분의 합이 1보다 작다', '①24 ②23 ③17 심1', (d, n) => {
            const [f1, f2] = two(d, [MULTIPLE, OTHER][n], less1), a = W(f1, d.int(1, 6)), b = W(f2, d.int(1, 6));
            return ans(CALC, [a, '+', b], { figure: eq(show(a), '+', show(b)), explain: '자연수는 자연수끼리, 분수는 분수끼리 더한다. ' + told(a, '+', b), facts: { rule: ['mixedAddMultiple', 'mixedAddOther'][n] } });
          }, { count: 2 }),
          T('madd-carry', '(대분수)+(대분수): 분수 부분의 합이 1보다 크다', '①25 ②24 ③18 심1', (d, n) => {
            const [f1, f2] = two(d, [MULTIPLE, OTHER][n], more1), a = W(f1, d.int(1, 6)), b = W(f2, d.int(1, 6));
            return ans(CALC, [a, '+', b], { figure: eq(show(a), '+', show(b)), explain: '분수 부분의 합이 가분수이면 자연수 부분으로 1을 받아올림한다. ' + told(a, '+', b), facts: { rule: ['mixedCarryMultiple', 'mixedCarryOther'][n] } });
          }, { count: 2 }),
          T('madd-proper', '(대분수)+(진분수)', '②28 ③18', (d, n) => {
            // 첫째 문항은 분수 부분의 합이 1보다 작고(진분수가 앞에 놓인다), 둘째 문항은 1보다 크다.
            const [f1, f2] = two(d, OTHER.concat(MULTIPLE), n === 0 ? less1 : more1), a = W(f1, d.int(1, 6)), parts = n === 0 ? [f2, '+', a] : [a, '+', f2];
            return ans(CALC, parts, { figure: eqOf(parts), explain: (n === 0 ? '분수 부분끼리 더하고 자연수 부분은 그대로 둔다. ' : '분수 부분의 합이 가분수이면 자연수 부분으로 1을 받아올림한다. ') + told(parts[0], '+', parts[2]), facts: { rule: ['mixedProperAdd', 'mixedProperCarry'][n] } });
          }, { count: 2 }),
          T('madd-three', '세 분수의 덧셈', '③24 ②32', (d, n) => {
            // 첫째 문항은 진분수 셋, 둘째 문항은 대분수 셋.
            if (n === 1) {
              const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)); return [V(d.int(1, 3), coTop(d, x), x), '+', V(d.int(1, 3), coTop(d, y), y), '+', V(d.int(1, 3), coTop(d, z), z)]; }, (p) => calc(p).q !== 1 && calc([p[0], '+', p[2]]).q !== 1);
              return ans(CALC, parts, { figure: eqOf(parts), explain: '앞에서부터 차례로 계산한다. ' + told3(parts), facts: { rule: 'threeAddMixed' } });
            }
            const [a, b, c] = d.until(() => d.shuffle(d.pick(TRIPLES)).map((den) => V(0, coTop(d, den), den)), (list) => calc([list[0], '+', list[1], '+', list[2]]).q !== 1);
            const L = lcm(lcm(a.d, b.d), c.d), s = numer(a, L) + numer(b, L) + numer(c, L), r = calc([a, '+', b, '+', c]);
            return ans(CALC, [a, '+', b, '+', c], {
              figure: eq(show(a), '+', show(b), '+', show(c)),
              explain: `세 분모의 최소공배수 ${josa(L, '을/를')} 공통분모로 하여 통분한다. ${frac(numer(a, L), L)} + ${frac(numer(b, L), L)} + ${frac(numer(c, L), L)} = ${frac(s, L)}` + (show(toV(r)) !== frac(s, L) ? ` = ${show(toV(r))}` : ''),
              facts: { rule: 'threeAdd' }
            });
          }, { count: 2 })
        ]
      },
      {
        id: 'psub', title: '진분수의 뺄셈', standard: STD,
        types: [
          T('psub-fig', '×표 한 그림을 보고 진분수의 뺄셈하기', '①4 ②4 ③4', (d) => {
            const [a, b] = two(d, FIGS, bigger), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
            return M(`띠에 ${show(a)}만큼 색칠한 다음 ${show(b)}만큼 ×표 하여 덜어 내었다. ㉠, ㉡, ㉢에 알맞은 수는?`, labelled([x, y, x - y]), {
              figure: band(a.d, a.n, L, y) + eq(show(a), '-', show(b), '=', frac(box(LAB[0]), L), '-', frac(box(LAB[1]), L), '=', frac(box(LAB[2]), L)),
              explain: `작은 칸 하나는 띠의 ${frac(1, L)}이다. 색칠한 작은 칸 ${x}칸 가운데 ${y}칸을 덜어 내면 ${x - y}칸이 남으므로 ${frac(x, L)} − ${frac(y, L)} = ${frac(x - y, L)}이다.`,
              facts: { calc: [[`${a.n}*${L}/${a.d}`, 0], [`${b.n}*${L}/${b.d}`, 1], [`${a.n}*${L}/${a.d}-${b.n}*${L}/${b.d}`, 2]] }
            });
          }),
          T('psub-line', '수직선을 보고 진분수의 뺄셈하기', '③4', (d) => {
            const [a, b] = two(d, FIGS, (p, q) => bigger(p, q) && p.d !== lcm(p.d, q.d) && q.d !== lcm(p.d, q.d)), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
            return M('수직선을 보고 ㉠, ㉡, ㉢에 알맞은 수는?', labelled([x, y, x - y]), {
              figure: hopLine(L, [x, -y]) + eq(show(a), '-', show(b), '=', frac(box(LAB[0]), L), '-', frac(box(LAB[1]), L), '=', frac(box(LAB[2]), L)),
              explain: `작은 눈금 한 칸은 ${frac(1, L)}이다. 0에서 ${x}칸 간 다음 ${y}칸 되돌아왔으므로 ${frac(x, L)} − ${frac(y, L)} = ${frac(x - y, L)}이다.`,
              facts: { calc: [[`${a.n}*${L}/${a.d}`, 0], [`${b.n}*${L}/${b.d}`, 1], [`${a.n}*${L}/${a.d}-${b.n}*${L}/${b.d}`, 2]] }
            });
          }),
          T('psub-steps-lcm', '최소공배수로 통분하여 뺀 다음 약분하는 과정', '①9 ②9 ③9', (d) => {
            // 최소공배수로 통분하여 빼도 약분이 남는 수
            const [a, b] = two(d, GENERAL, (p, q) => { const L = lcm(p.d, q.d); return bigger(p, q) && gcd(numer(p, L) - numer(q, L), L) > 1; }), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L), g = gcd(x - y, L);
            return M('두 분모의 최소공배수를 공통분모로 하여 통분한 다음 계산하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([x, y, x - y, (x - y) / g]), {
              figure: lines([eq(show(a), '-', show(b), '=', frac(box(LAB[0]), L), '-', frac(box(LAB[1]), L)), eq('=', frac(box(LAB[2]), L), '=', frac(box(LAB[3]), L / g))]),
              explain: `${josa(a.d, '과/와')} ${b.d}의 최소공배수는 ${L}이다. ${frac(x, L)} − ${frac(y, L)} = ${frac(x - y, L)}이고, 분모와 분자를 각각 ${josa(g, '으로/로')} 나누면 ${frac((x - y) / g, L / g)}이다.`,
              facts: { calc: [[`${a.n}*${L}/${a.d}`, 0], [`${b.n}*${L}/${b.d}`, 1], [`${a.n}*${L}/${a.d}-${b.n}*${L}/${b.d}`, 2], [`(${a.n}*${L}/${a.d}-${b.n}*${L}/${b.d})*${L / g}/${L}`, 3]] }
            });
          }),
          T('psub-steps-side', '한쪽만 통분하여 빼는 과정', '①4·9 ③8', (d) => {
            const [a, b] = two(d, MULTIPLE, bigger), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L), first = a.d !== L;
            return M('한쪽 분모가 다른 쪽 분모의 배수인 뺄셈이다. ㉠, ㉡에 알맞은 수는?', labelled([first ? x : y, x - y]), {
              figure: eq(show(a), '-', show(b), '=', first ? frac(box(LAB[0]), L) : show(a), '-', first ? show(b) : frac(box(LAB[0]), L), '=', frac(box(LAB[1]), L)),
              explain: how(a, b) + `${first ? show(a) : show(b)} = ${first ? frac(x, L) : frac(y, L)}이므로 ${frac(x, L)} − ${frac(y, L)} = ${frac(x - y, L)}이다.`,
              facts: { calc: [[first ? `${a.n}*${L}/${a.d}` : `${b.n}*${L}/${b.d}`, 0], [`${a.n}*${L}/${a.d}-${b.n}*${L}/${b.d}`, 1]] }
            });
          }),
          T('psub-calc', '(진분수)−(진분수)', '①26 ②25 ③19 심1', (d, n) => {
            const [a, b] = two(d, [MULTIPLE, COPRIME, GENERAL][n], bigger);
            return ans(CALC, [a, '-', b], { figure: eq(show(a), '-', show(b)), explain: how(a, b) + told(a, '-', b), facts: { rule: ['subMultiple', 'subCoprime', 'subGeneral'][n] } });
          }, { count: 3 }),
          T('psub-simplest', '두 분수의 차를 기약분수로 나타내기', '①26 ③22 심2', (d) => {
            // 작은 수가 앞에 놓일 수도 있다. 최소공배수로 통분하여 빼도 약분이 남는 수.
            const [a, b] = two(d, MULTIPLE.concat(GENERAL), (p, q) => { const L = lcm(p.d, q.d); return bigger(p, q) && gcd(numer(p, L) - numer(q, L), L) > 1; });
            return ans('두 분수의 차를 기약분수로 나타내시오.', [a, '-', b], { simplest: true, figure: B.kit.numbers(d.shuffle([show(a), show(b)])), explain: `큰 수에서 작은 수를 뺀다. ${told(a, '-', b)}이다. 기약분수로 나타내어야 하므로 분모와 분자를 공약수로 나눈다.` });
          })
        ]
      },
      {
        id: 'msub', title: '대분수의 뺄셈', standard: STD,
        types: [
          T('msub-fig', '×표 한 그림을 보고 대분수의 뺄셈하기', '①6 ②5·6 ③5·6', (d, n) => {
            // 첫째 문항은 분수 부분끼리 뺄 수 있고, 둘째 문항은 뺄 수 없어 띠 하나를 작은 칸으로 바꾸어 덜어 낸다(받아내림).
            const [f1, f2] = two(d, FIGS, n === 0 ? bigger : smaller), a = W(f1, 2), b = W(f2, 1), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
            const ex1 = `${a.n}*${L}/${a.d}`, ex2 = `${b.n}*${L}/${b.d}`, head = [eq(show(a), '-', show(b)), eq('=', mixed(a.w, box(LAB[0]), L), '-', mixed(b.w, box(LAB[1]), L))];
            return M(`그림에 ${show(a)}만큼 색칠한 다음 ${show(b)}만큼 ×표 하여 덜어 내었다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?`, labelled(n === 0 ? [x, y, a.w - b.w, x - y] : [x, y, x + L, x + L - y]), {
              figure: bars(a, L, { w: b.w, small: y }) + lines(head.concat([n === 0 ? eq('=', mixed(box(LAB[2]), box(LAB[3]), L)) : eq('=', mixed(a.w - 1, box(LAB[2]), L), '-', mixed(b.w, box(LAB[1]), L), '=', frac(box(LAB[3]), L))])),
              explain: `작은 칸 하나는 띠 하나의 ${frac(1, L)}이다. ` + (n === 0 ? '' : `분수 부분의 작은 칸 ${x}칸에서 ${y}칸을 덜어 낼 수 없으므로 띠 하나를 작은 칸 ${L}칸으로 바꾼다. `) + told(a, '-', b),
              facts: { calc: n === 0 ? [[ex1, 0], [ex2, 1], [`${a.w}-${b.w}`, 2], [`${ex1}-${ex2}`, 3]] : [[ex1, 0], [ex2, 1], [`${ex1}+${L}`, 2], [`${ex1}+${L}-${ex2}`, 3]], rule: ['figPlainSub', 'figBorrow'][n] }
            });
          }, { count: 2 }),
          T('msub-steps-split', '자연수끼리, 분수끼리 빼는 과정', '①11 ②12 ③10', (d) => {
            const [f1, f2] = two(d, SMALL, bigger), w2 = d.int(1, 4), a = W(f1, w2 + d.int(1, 4)), b = W(f2, w2), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
            return M('자연수는 자연수끼리, 분수는 분수끼리 빼는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([x, y, a.w - b.w, x - y]), {
              figure: lines([eq(show(a), '-', show(b)), eq('=', mixed(a.w, box(LAB[0]), L), '-', mixed(b.w, box(LAB[1]), L)), eq('=', par(a.w, '-', b.w), '+', par(frac(box(LAB[0]), L), '-', frac(box(LAB[1]), L))), eq('=', mixed(box(LAB[2]), box(LAB[3]), L))]),
              explain: `분모가 ${L}${tail(L, '이/가')} 되도록 통분한 다음 자연수는 자연수끼리, 분수는 분수끼리 뺀다. ${told(a, '-', b)}`,
              facts: { calc: [[`${a.n}*${L}/${a.d}`, 0], [`${b.n}*${L}/${b.d}`, 1], [`${a.w}-${b.w}`, 2], [`${a.n}*${L}/${a.d}-${b.n}*${L}/${b.d}`, 3]] }
            });
          }),
          T('msub-steps-borrow', '자연수에서 1만큼을 받아내림하여 빼는 과정', '①12 ②13 ③10', (d) => {
            const [f1, f2] = two(d, SMALL, smaller), w2 = d.int(1, 4), a = W(f1, w2 + d.int(2, 4)), b = W(f2, w2), L = lcm(a.d, b.d), x = numer(a, L), y = numer(b, L);
            return M('분수 부분끼리 뺄 수 없어서 자연수에서 1만큼을 받아내림하여 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', labelled([x + L, a.w - 1 - b.w, x + L - y]), {
              figure: lines([eq(show(a), '-', show(b)), eq('=', mixed(a.w, x, L), '-', mixed(b.w, y, L)), eq('=', mixed(a.w - 1, box(LAB[0]), L), '-', mixed(b.w, y, L)), eq('=', mixed(box(LAB[1]), box(LAB[2]), L))]),
              explain: `${frac(x, L)}에서 ${fj(y, L, '을/를')} 뺄 수 없으므로 ${mixed(a.w, x, L)}의 자연수에서 1만큼을 ${frac(L, L)}${tail(L, '으로/로')} 바꾸어 ${mixed(a.w - 1, x + L, L)}${tail(x + L, '으로/로')} 고친다. ${mixed(a.w - 1, x + L, L)} − ${mixed(b.w, y, L)} = ${mixed(a.w - 1 - b.w, x + L - y, L)}`,
              facts: { calc: [[`${x}+${L}`, 0], [`${a.w - 1}-${b.w}`, 1], [`${x}+${L}-${y}`, 2]] }
            });
          }),
          T('msub-steps-improper', '가분수로 나타내어 빼는 과정', '①13 ②14 ③11', (d) => {
            const [f1, f2] = two(d, SMALL), b = W(f2, d.int(1, 2)), a = W(f1, b.w + d.int(2, 3)), L = lcm(a.d, b.d), X = top(a) * L / a.d, Y = top(b) * L / b.d, S = X - Y;
            return M('대분수를 가분수로 나타내어 빼는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', labelled([top(a), top(b), S, S % L]), {
              figure: lines([eq(show(a), '-', show(b)), eq('=', frac(box(LAB[0]), a.d), '-', frac(box(LAB[1]), b.d)), eq('=', frac(X, L), '-', frac(Y, L), '=', frac(box(LAB[2]), L)), eq('=', mixed(Math.floor(S / L), box(LAB[3]), L))]),
              explain: `${show(a)} = ${frac(top(a), a.d)}, ${show(b)} = ${frac(top(b), b.d)}이다. 통분하면 ${frac(X, L)} − ${frac(Y, L)} = ${frac(S, L)}이고, 대분수로 나타내면 ${mixed(Math.floor(S / L), S % L, L)}이다.`,
              facts: { calc: [[`${a.w}*${a.d}+${a.n}`, 0], [`${b.w}*${b.d}+${b.n}`, 1], [`${X}-${Y}`, 2], [`(${X}-${Y})%${L}`, 3]] }
            });
          }),
          T('msub-plain', '(대분수)−(대분수): 분수 부분끼리 뺄 수 있다', '①27 ②26 ③20 심1', (d, n) => {
            const [f1, f2] = two(d, [MULTIPLE, OTHER][n], bigger), w2 = d.int(1, 5), a = W(f1, w2 + d.int(1, 5)), b = W(f2, w2);
            return ans(CALC, [a, '-', b], { figure: eq(show(a), '-', show(b)), explain: '자연수는 자연수끼리, 분수는 분수끼리 뺀다. ' + told(a, '-', b), facts: { rule: ['mixedSubMultiple', 'mixedSubOther'][n] } });
          }, { count: 2 }),
          T('msub-same-whole', '자연수 부분이 같은 대분수의 뺄셈', '①27 ③20', (d) => {
            const [f1, f2] = two(d, OTHER.concat(MULTIPLE), bigger), w = d.int(1, 9), a = W(f1, w), b = W(f2, w);
            return ans(CALC, [a, '-', b], { figure: eq(show(a), '-', show(b)), explain: '자연수 부분이 같으므로 분수 부분의 차만 남는다. ' + told(f1, '-', f2), facts: { rule: 'mixedSameWhole' } });
          }),
          T('msub-borrow', '(대분수)−(대분수): 분수 부분끼리 뺄 수 없다', '①28 ②27 ③21 심1', (d, n) => {
            const [f1, f2] = two(d, [MULTIPLE, OTHER][n], smaller), w2 = d.int(1, 5), a = W(f1, w2 + d.int(2, 5)), b = W(f2, w2);
            return ans(CALC, [a, '-', b], { figure: eq(show(a), '-', show(b)), explain: '통분한 분수 부분끼리 뺄 수 없으므로 자연수에서 1만큼을 받아내림한다. ' + told(a, '-', b), facts: { rule: ['mixedBorrowMultiple', 'mixedBorrowOther'][n] } });
          }, { count: 2 }),
          T('msub-below-one', '받아내림하면 차가 진분수인 뺄셈', '①28 ②27 ③21 심1', (d) => {
            const [f1, f2] = two(d, OTHER.concat(MULTIPLE), smaller), w2 = d.int(1, 8), a = W(f1, w2 + 1), b = W(f2, w2);
            return ans(CALC, [a, '-', b], { figure: eq(show(a), '-', show(b)), explain: '자연수에서 1만큼을 받아내림하면 자연수 부분이 같아진다. ' + told(a, '-', b), facts: { rule: 'mixedBelowOne' } });
          }),
          T('msub-proper', '(대분수)−(진분수)', '①29 ②28 ③21', (d, n) => {
            // 첫째 문항은 분수 부분끼리 뺄 수 있고, 둘째 문항은 받아내림한다.
            const [f1, f2] = two(d, OTHER.concat(MULTIPLE), n === 0 ? bigger : smaller), a = W(f1, d.int(n === 0 ? 1 : 2, 6));
            return ans(CALC, [a, '-', f2], { figure: eq(show(a), '-', show(f2)), explain: (n === 0 ? '분수 부분끼리 뺀다. ' : '분수 부분끼리 뺄 수 없으므로 자연수에서 1만큼을 받아내림한다. ') + told(a, '-', f2), facts: { rule: ['mixedProperSub', 'mixedProperBorrow'][n] } });
          }, { count: 2 }),
          T('msub-three', '세 분수의 뺄셈', '③24 ②32', (d) => {
            const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)); return [V(d.int(4, 7), coTop(d, x), x), '-', V(0, coTop(d, y), y), '-', V(d.int(1, 2), coTop(d, z), z)]; }, (p) => calc(p).q !== 1 && calc([p[0], '-', p[2]]).q !== 1);
            return ans(CALC, parts, { figure: eqOf(parts), explain: '앞에서부터 차례로 계산한다. ' + told3(parts), facts: { rule: 'threeSub' } });
          }),
          T('msub-three-mixed', '덧셈과 뺄셈이 섞인 세 분수의 계산', '③24 ②32 ①42 심27', (d) => {
            const parts = d.until(() => { const [x, y, z] = d.shuffle(d.pick(TRIPLES)); return [V(d.int(2, 5), coTop(d, x), x), '+', V(d.int(1, 3), coTop(d, y), y), '-', V(d.int(1, 3), coTop(d, z), z)]; }, (p) => calc(p).p > 0 && calc(p).q !== 1 && calc([p[0], '+', p[2]]).q !== 1);
            return ans(CALC, parts, { figure: eqOf(parts), explain: '앞에서부터 차례로 계산한다. ' + told3(parts), facts: { rule: 'threeMixed' } });
          })
        ]
      },
      { id: 'check', title: '잘못된 계산 살펴보기', standard: STD, types: [] },
      { id: 'comp', title: '계산 결과 비교하기', standard: STD, types: [] },
      { id: 'pick', title: '조건에 맞는 수의 합과 차', standard: STD, types: [] },
      { id: 'box', title: '□가 있는 식과 어떤 수', standard: STD, types: [] },
      { id: 'word', title: '분수의 덧셈과 뺄셈의 활용', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
