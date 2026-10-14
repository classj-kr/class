// 5학년 2학기 4단원 소수의 곱셈 — 단원 틀과 기본 문항((소수)×(자연수), (자연수)×(소수), (소수)×(소수), 곱의 소수점 위치).
// 수집해 둔 교과서 8종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 72·83·79꼴, 심화꼴 69꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/5-2-4/싣기_대조표.md 에 있다.
// (어림, 잘못된 계산, 곱의 크기 비교와 조건에 맞는 수, 문장제, 도형, 실력 문항은 5-2-4b.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 영역은 수와 연산, 성취기준은 6수01-13(소수의 곱셈의 계산 원리를 탐구하고 그 계산을 할 수 있다) 하나이다.
//
// 싣는 기준
//  - 소수의 곱셈만 싣는다: (소수)×(자연수), (자연수)×(소수), (소수)×(소수), 곱의 소수점 위치(10·100·1000과 0.1·0.01·0.001을 곱할 때, 자연수의 곱으로 소수의 곱 알기).
//    하는 일이 다르면 다른 문제다: 주는 것(띠·수직선·모눈·넓이 그림, 식, 세로셈, 문장), 묻는 것(과정의 빈칸, 값, 고르기, 차례), 계산 구조가 다르면 따로 싣고
//    계산 문항에는 facts.rule 에 그 이름을 단다(이름대로 되게 수를 뽑는다): 1보다 작은 소수·큰 소수, 소수 한 자리·두 자리, 자연수가 앞·뒤, 두 자리 자연수,
//    곱 앞에 0을 채우는 것, 곱의 끝자리가 0이 되어 자리 수가 줄어드는 것, 곱이 자연수인 것.
//  - 교육과정: 「소수의 곱셈은 계산 원리를 탐구하여 이해하는 수준에서 다룬다.」 「복잡한 계산은 계산기를 사용하게 할 수 있다.」
//    곱이 소수 셋째 자리를 넘는 계산(0.72 × 0.16)과 소수점을 뗀 자연수의 곱이 다섯 자리를 넘는 계산은 싣지 않는다. 소수 답은 소수 셋째 자리까지, 1000 미만이다.
//  - 수는 모두 정수(소수점을 뗀 수와 소수점 아래 자리 수)로 뽑아 셈하고 글에 적을 때만 소수로 적는다(자바스크립트에서 0.1 × 3 은 0.3 이 아니다).
//    답이 소수이면 소수 칸, 자연수로 떨어지면 수 하나로 답한다. 유형마다 답의 꼴은 정해져 있다. 끝자리가 0인 소수(2.50)는 적지 않는다.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(빈 곳에 두 수의 곱 써넣기, 화살표 상자, 곱셈표, 사다리 타기, 잇기는 계산 문항과 같은 문제).
//
// 뺀 것과 까닭(5-2-4b.js 의 것까지 여기에 모아 적는다)
//  - 6학년 소수의 나눗셈이 있어야 풀리는 것: 잘못 「나눈」 어떤 수(②73 심40), 삼각형·사다리꼴의 넓이(①72 심69 — ÷2가 소수에 걸린다), 넓이가 같은 두 도형을 붙인 직사각형의 반(심68),
//    24분·12분·15분·45초처럼 60으로 나누거나 분모를 고쳐야 소수 시간이 되는 것(①60 ③66 심56, ②66·67과 심57의 변형 — 30분·30초를 0.5로 고치는 것만 실었다),
//    0.25 m의 무게로 1 m의 무게 찾기(심58), 소수끼리 「몇 배」인지 나누어 구하기(①28의 첫째, ③45 심20의 몇 배), 다리·터널을 지나는 기차(②74)
//  - 4-2-3(소수의 덧셈과 뺄셈)의 일: 단위를 맞추어 길이 견주기(①33 ②33 심29 — 곱셈은 ×100 한 번이고 단위 고치기와 크기 비교가 일의 전부),
//    「~보다 ~만큼 큰 수」끼리의 곱(②53의 대표 — 덧셈이 먼저이다. 개수로 나타낸 수의 곱만 실었다)
//  - 계산기에 맡기는 금을 넘는 것: 곱이 소수 넷째 자리 넘게 가는 계산(②18 ③36, ①16·24·27과 ②16·58·72와 심41의 변형), 자릿수가 아주 많은 곱(①30 심26),
//    세 자리 수끼리의 곱이 되는 것(①48 ③29 심41의 변형), 소수 답이 1000을 넘는 것(①52와 심44의 변형)
//  - 조건 풀이·경우 따지기·세기가 어려움의 대부분인 것: 수 카드 넉 장을 놓는 자리 견주기(①49 ②59 심42·43 — 석 장으로 두 경우만 견주는 것은 실력에 실었다),
//    간격 세기(①61 ②75 심59), 겹쳐 이어 붙인 띠의 겹친 곳 세기(①62 ②76 ③12 심60), 이어 붙인 도형과 색칠한 도형의 둘레에 놓인 변 세기(①69 ②83 심63의 변형 — 그림도 알 수 없다),
//    새로 약속한 셈(②77), 규칙을 찾아 빈 곳 채우기(③77), 세로셈의 가려진 숫자(②46), 답이 여럿인 계산기 문제(①31 ②31 ③46 — 잘못 누른 수 하나를 정해 준 꼴만 실력에 실었다),
//    □가 곱해지는 수 자리에 있는 부등식(①48의 변형 — 거꾸로 풀면 소수의 나눗셈)
//  - 뜻 없는 셈: 두 곱의 합·차(①46 심11), 두 □를 구해 더하기(③40 심20의 합), 두 둘레의 차(심62의 변형), 두 넓이의 합(①70 심64의 변형), 두 번째로 큰 수와의 곱(심9의 변형)
//  - 작도·서술형·열린 답: 색칠하기(①5·14 ②2 ③13의 그리는 부분 — 바르게 색칠한 그림 고르기로 바꿈), 과정·까닭·방법 쓰기(①3·7·29 ②43·56·57 ③4·15·22·79 심6·35 —
//    과정의 빈칸, 방법 고르기, 처음 잘못된 곳 고르기, 바른 값 구하기, 틀린 사람 고르기로 바꿈), 문제 만들기(①64 ③78 심61), 수를 골라 식 만들기(③76)
//  - 같은 문제여서 한 번만 실은 것: 빈 곳에 두 수의 곱 써넣기·화살표 빈칸·곱셈표·사다리(①8 ②44·45 ③6·17 심4의 변형 — 계산 문항과 같다),
//    0.1 × 72 × 5 꼴로 쓴 0.1의 개수(①2 ②3의 변형 — 0.1의 개수와 같다), 세로셈 한 쌍으로 준 자연수의 곱(①4 ②5의 변형 — 자연수의 곱셈 이용과 같다),
//    상황이 붙은 계산 원리(②5·10의 변형 — 문장제와 같다), 보기에서 곱 고르기(①24의 변형 — 자연수의 곱으로 소수의 곱 알기와 같다),
//    어림으로 두 양 가운데 많은 쪽 찾기(②41의 대표 — 어림으로 두 넓이 견주기와 얼개가 같다), 곱하는 수를 10배로 잘못 곱한 값은 몇 배(①28의 둘째 — 곱해지는 수가 몇 분의 일이 될 때 곱의 변화와 같다),
//    몇 배인 구간을 구해 전체 거리 구하기(③10 심49의 합 — 「몇 배만큼 더」와 셈이 같다), 전체에서 한 번의 양 × 횟수를 덜어 내기(심50의 대표 — 양초의 남은 길이와 얼개가 같다)
//  - 그림이 필요해 미룬 것은 없다. 띠·수직선·모눈·넓이 그림, 세로셈, 귀퉁이를 잘라 낸 도형은 단원 파일의 그림 함수로 그렸고, 변의 길이가 적힌 도형은 수를 글에 적어 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, chain, N, M, C, D } = B.kit;
  const STD = '6수01-13';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SG = { '+': '+', '-': '−', '*': '×', '=': '=', '>': '&gt;', '<': '&lt;' };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  // 식 한 줄: 조각을 이어 적는다. '+', '-', '*', '=' 은 기호로 바꾼다.
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const par = (...parts) => '(' + parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' ') + ')';
  const tagged = (list, tags) => lines(list.map((html, i) => '<span class="mb-tag mb-tag-short">' + (tags || LAB)[i] + '</span>' + html));
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;

  // ── 수 하나 ──
  // 수는 { n: 소수점을 뗀 자연수, k: 소수점 아래 자리 수 }로 다룬다(끝자리 0은 떼어 둔다). 2.35 = { n: 235, k: 2 }.
  const P10 = [1, 10, 100, 1000, 10000, 100000, 1000000];
  const dec = (n, k) => { while (k > 0 && n % 10 === 0) { n /= 10; k -= 1; } return { n, k }; };
  const nat = (n) => ({ n, k: 0 });
  const fx = (n, k) => { const t = String(n).padStart(k + 1, '0'); return k ? t.slice(0, -k) + '.' + t.slice(-k) : t; };
  const S = (x) => fx(x.n, x.k);                 // 글에 적는 꼴
  const V = (x) => x.n / P10[x.k];               // 답 칸에 넣는 값
  const mul = (...xs) => xs.slice(1).reduce((r, x) => dec(r.n * x.n, r.k + x.k), xs[0]);
  const places = (xs) => xs.reduce((s, x) => s + x.k, 0);
  // 토씨: 소수는 끝자리 숫자를 마지막에 읽는다(0.3은, 0.25는). 자연수를 적은 글에도 쓴다.
  const BATCHIM = [true, true, false, true, false, false, true, true, true, false], RIEUL = [false, true, false, false, false, false, false, true, true, false];
  const dj = (text, pair) => { const [yes, no] = pair.split('/'), k = Number(String(text).slice(-1)); return text + (yes === '으로' ? (BATCHIM[k] && !RIEUL[k] ? '으로' : '로') : BATCHIM[k] ? yes : no); };
  const J = (x, pair) => dj(S(x), pair);
  const part = (k) => frac(1, P10[k]);
  const NTH = ['', '한', '두', '세'];
  // 수 고르기: 끝자리가 0이 아닌 수(소수점을 뗀 수)
  const nz = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  const one = (d, lo, hi) => ({ n: nz(d, lo, hi), k: 1 }), two = (d, lo, hi) => ({ n: nz(d, lo, hi), k: 2 }), three = (d, lo, hi) => ({ n: nz(d, lo, hi), k: 3 });
  const pair = (d, make, ok) => d.until(make, ([x, y]) => x.n * y.n < 100000 && x.k + y.k <= 3 && ok(x.n * y.n, x, y));
  const clean = (p) => p % 10 !== 0;

  // ── 검사가 다시 셈하는 식 ──
  // 소수 답은 글에 적힌 소수 그대로 곱한 식으로(검사가 소수 셋째 자리까지 맞춰 본다), 자연수 답과 견주기는 정수 식으로 적는다.
  // 수 하나를 소수점을 뗀 자연수로 적은 식: 2.35 → (2*100+35). 글에 없는 수(100, 소수 부분이 0으로 시작하는 05의 5)는 un 에 모은다.
  const ix = (x) => { if (!x.k) return { s: String(x.n), un: [] }; const w = Math.floor(x.n / P10[x.k]), f = x.n % P10[x.k]; return { s: `(${w}*${P10[x.k]}+${f})`, un: [P10[x.k]].concat(f < P10[x.k - 1] ? [f] : []) }; };
  const px = (xs) => { const list = xs.map(ix); return { s: list.map((p) => p.s).join('*'), k: places(xs), un: list.reduce((all, p) => all.concat(p.un), []) }; };
  // 여러 곱을 견줄 때의 정수 식: 소수점 아래 자리 수가 가장 많은 쪽에 맞춘다.
  const scaled = (rows) => { const ps = rows.map(px), K = Math.max(...ps.map((p) => p.k)); return { K, exprs: ps.map((p) => (K > p.k ? `${p.s}*${P10[K - p.k]}` : p.s)), values: rows.map((row, i) => row.reduce((m, x) => m * x.n, 1) * P10[K - ps[i].k]), un: ps.reduce((all, p) => all.concat(p.un, [P10[K - p.k]]), []) }; };
  const inp = (label, x, unit) => Object.assign({ label, answer: V(x) }, x.k ? { decimal: true } : {}, unit ? { unit } : {});
  // 곱을 답하는 문항. 곱이 자연수이면 수 하나(o.kind: 'nat'), 아니면 소수 칸에 답한다.
  function ans(text, xs, o) {
    const r = mul(...xs), more = o.facts || {};
    if ((r.k === 0) !== (o.kind === 'nat')) throw new Error('답의 꼴이 유형과 다르다');
    if (r.k) return D(text, V(r), { unit: o.unit, figure: o.figure, explain: o.explain, facts: Object.assign({}, more, { calc: [[xs.map(S).join('*'), 0]] }) });
    const p = px(xs);
    return N(text, r.n, { unit: o.unit, figure: o.figure, explain: o.explain, facts: Object.assign({}, more, { calc: [[p.k ? `${p.s}/${P10[p.k]}` : p.s, 0]], unseen: p.un.concat([P10[p.k]], more.unseen || []) }) });
  }
  // 풀이 글: 자연수의 곱에서 소수점을 옮긴다.
  function how(x, y) {
    const p = x.n * y.n, K = x.k + y.k, full = fx(p, K), r = S(mul(x, y)), end = full !== r ? `${full} = ${r}` : full;
    if (x.k && y.k) return `${x.n} × ${y.n} = ${p}이다. ${J(x, '은/는')} ${x.n}의 ${part(x.k)}배, ${J(y, '은/는')} ${y.n}의 ${part(y.k)}배이므로 곱은 ${p}의 ${part(K)}배인 ${end}이다.`;
    const z = x.k ? x : y;
    return `${x.n} × ${y.n} = ${p}이다. ${J(z, '은/는')} ${z.n}의 ${part(z.k)}배이므로 곱은 ${p}의 ${part(z.k)}배인 ${end}이다.`;
  }

  // ── 그림 ──
  const svg = (cls, w, h, label, body) => `<svg class="${cls}" style="vertical-align:middle" viewBox="0 0 ${w} ${h}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  // 0부터 spans 까지의 수직선(1을 똑같이 10칸). 0에서부터 작은 눈금 step 칸씩 count 번 뛴다.
  function hopLine(spans, step, count) {
    const total = spans * 10, u = Math.min(22, 256 / total), x = (i) => 18 + i * u, y = 46, width = 36 + total * u;
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(total).toFixed(1)}" y2="${y}"/>`;
    for (let i = 0; i <= total; i += 1) { const len = i % 10 === 0 ? 6 : i % 5 === 0 ? 4.5 : 3; out += `<line class="mb-axis" x1="${x(i).toFixed(1)}" y1="${y - len}" x2="${x(i).toFixed(1)}" y2="${y + len}"/>`; }
    for (let i = 0; i <= spans; i += 1) out += `<text class="mb-km-label" x="${x(i * 10).toFixed(1)}" y="${y + 20}" text-anchor="middle">${i}</text>`;
    for (let k = 0; k < count; k += 1) {
      const x1 = x(k * step), x2 = x((k + 1) * step), base = y - 8, cx = (x1 + x2) / 2, cy = base - 30;
      // 화살촉은 곡선이 끝점으로 들어오는 쪽을 향한다.
      const dx = x2 - cx, dy = base - cy, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, bx = x2 - ux * 6, by = base - uy * 6;
      out += `<path d="M${x1.toFixed(1)} ${base}Q${cx.toFixed(1)} ${cy} ${x2.toFixed(1)} ${base}" style="fill:none;stroke:#1d4ed8;stroke-width:1.6"/>`
        + `<path d="M${x2.toFixed(1)} ${base}L${(bx - uy * 3).toFixed(1)} ${(by + ux * 3).toFixed(1)}L${(bx + uy * 3).toFixed(1)} ${(by - ux * 3).toFixed(1)}Z" style="fill:#1d4ed8"/>`;
    }
    return svg('mb-numberline', Number(width.toFixed(1)), 72, `수직선: 0부터 ${spans}까지, 1을 똑같이 10칸으로 나누었다. 0에서 오른쪽으로 작은 눈금 ${step}칸씩 ${count}번 뛰었다`, out);
  }
  // 크기가 1인 띠 count 개를 아래로 쌓는다. 띠마다 똑같이 10칸으로 나누어 앞의 on 칸을 색칠한다.
  function bands(on, count) {
    let out = '';
    for (let k = 0; k < count; k += 1) for (let i = 0; i < 10; i += 1) out += `<rect class="mb-piece${i < on ? ' is-on' : ''}" x="${2 + i * 21}" y="${2 + k * 30}" width="21" height="24"/>`;
    return svg('mb-pieces', 214, count * 30 - 2, `띠 ${count}개를 각각 똑같이 10칸으로 나누어 띠마다 ${on}칸씩 색칠`, out);
  }
  // 길이가 total 인 띠 하나: 똑같이 10칸으로 나누어 앞의 on 칸을 색칠하고 두 끝에 0과 total 을 적는다.
  function natBand(total, on) {
    let out = '';
    for (let i = 0; i < 10; i += 1) out += `<rect class="mb-piece${i < on ? ' is-on' : ''}" x="${12 + i * 22}" y="2" width="22" height="24"/>`;
    out += `<text class="mb-km-label" x="12" y="43" text-anchor="middle">0</text><text class="mb-km-label" x="232" y="43" text-anchor="middle">${total}</text>`;
    return svg('mb-pieces', 244, 48, `길이가 ${total}인 띠를 똑같이 10칸으로 나누어 ${on}칸을 색칠`, out);
  }
  // 한 변이 1인 정사각형을 가로 10칸, 세로 10칸으로 나눈 모눈. shade(가로 자리, 세로 자리)가 참인 칸을 색칠한다.
  function grid(shade, label, size) {
    const u = size || 11; let out = '';
    for (let r = 0; r < 10; r += 1) for (let c = 0; c < 10; c += 1) out += `<rect class="mb-piece${shade(c, r) ? ' is-on' : ''}" x="${2 + c * u}" y="${2 + r * u}" width="${u}" height="${u}"/>`;
    return svg('mb-pieces', u * 10 + 4, u * 10 + 4, `모눈: 정사각형을 가로 10칸, 세로 10칸으로 똑같이 나누었다. ${label}`, out);
  }
  // 네 부분으로 나눈 직사각형(넓이 그림). 가로를 a 와 0.b, 세로를 c 와 0.d 로 나눈다.
  function splitRect(a, b, c, e) {
    const u = 58, left = 34, top = 20, w1 = a * u, w2 = b * u / 10, h1 = c * u, h2 = e * u / 10, word = 'style="font-size:13px;font-weight:600;fill:#1f2933"';
    const cell = (x, y, w, h, fill) => `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" style="fill:${fill};stroke:#1f2933;stroke-width:1"/>`;
    const out = cell(left, top, w1, h1, '#dbeafe') + cell(left + w1, top, w2, h1, '#fef3c7') + cell(left, top + h1, w1, h2, '#fef3c7') + cell(left + w1, top + h1, w2, h2, '#fde68a')
      + `<text ${word} x="${(left + w1 / 2).toFixed(1)}" y="${top - 6}" text-anchor="middle">${a}</text><text ${word} x="${(left + w1 + w2 / 2).toFixed(1)}" y="${top - 6}" text-anchor="middle">0.${b}</text>`
      + `<text ${word} x="${left - 6}" y="${(top + h1 / 2 + 4).toFixed(1)}" text-anchor="end">${c}</text><text ${word} x="${left - 6}" y="${(top + h1 + h2 / 2 + 4).toFixed(1)}" text-anchor="end">0.${e}</text>`;
    return svg('mb-pieces', Math.ceil(left + w1 + w2 + 6), Math.ceil(top + h1 + h2 + 6), `직사각형을 네 부분으로 나누었다. 가로를 ${a}, 0.${b}의 두 부분으로, 세로를 ${c}, 0.${e}의 두 부분으로 나누었다`, out);
  }
  // 곱셈의 세로셈(표). 수는 끝자리를 맞추어 적고 소수점은 앞 숫자와 한 칸에 적는다. 그림 설명에 식을 적는다(검사가 이 글에서 수를 읽는다).
  const DOT = '<span style="display:inline-block;width:0">.</span>';
  const cellsOf = (text) => String(text).match(/\d\.?/g);
  function mcol(a, b, result) {
    const rows = [cellsOf(a), cellsOf(b)].concat(result ? [cellsOf(result)] : []), width = Math.max(...rows.map((r) => r.length)), rule = 'border-bottom:2px solid #1f2933;';
    const tds = (list, style) => Array.from({ length: width - list.length }, () => '').concat(list).map((ch) => `<td${style ? ` style="${style}"` : ''}>${String(ch).endsWith('.') ? String(ch).slice(0, -1) + DOT : ch}</td>`).join('');
    return `<table class="mb-longdiv" role="img" aria-label="세로셈: ${a} × ${b}${result ? ` = ${result}` : ''}">`
      + `<tr><td style="min-width:1.3em"></td>${tds(rows[0])}</tr>`
      + `<tr><td style="min-width:1.3em;text-align:center;${rule}">×</td>${tds(rows[1], rule)}</tr>`
      + `<tr><td></td>${result ? tds(rows[2]) : `<td colspan="${width}" style="padding-top:5px"><span class="mb-box" style="min-width:${Math.max(2.6, width * 0.9)}em"></span></td>`}</tr></table>`;
  }
  // 숫자 사이에 소수점을 찍을 자리(㉠㉡㉢)를 적은 수
  const spots = (text) => ex(String(text).split('').map((ch, i) => (i ? `<span style="font-size:0.7em;color:#1d4ed8;margin:0 2px;vertical-align:-0.4em">${LAB[i - 1]}</span>` : '') + ch).join(''));
  // 차례 고르기 보기: 값의 차례를 바르게 적은 것 하나와 틀린 것 셋
  const orderChoice = (d, values, labels, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };

  const CALC = '다음을 계산하시오.';
  // 계산 문항. pick(d) 는 [곱해지는 수, 곱하는 수]를 돌려준다. layout: 'col'(세로셈) | 'row'(가로식). kind: 'nat' 이면 곱이 자연수.
  // 같은 꼴의 식이 계산 구조만 달리하여 여러 번 실리므로 facts.rule 에 구조의 이름(유형 이름)을 단다. 구조의 조건은 pick 이 지킨다.
  const calcType = (id, title, ref, layout, pick, kind) => T(id, title, ref, (d) => {
    const [x, y] = pick(d);
    return ans(CALC, [x, y], { kind, figure: layout === 'col' ? mcol(S(x), S(y)) : eq(S(x), '*', S(y), '=', box()), explain: how(x, y), facts: { rule: id } });
  });
  const sumOf = (text, c) => Array.from({ length: c }, () => text).reduce((out, t, i) => out.concat(i ? ['+', t] : [t]), []);

  B.addUnit({
    id: '5-2-4', grade: 5, semester: 2, no: 4, title: '소수의 곱셈', version: 1,
    groups: [
      {
        id: 'dn', title: '(소수)×(자연수)', standard: STD,
        types: [
          T('dn-add', '덧셈식으로 (소수)×(자연수) 알아보기', '①1 ②2 ③1 심6', (d) => {
            const [x, c] = d.until(() => [one(d, 2, 19), d.int(3, 5)], ([v, k]) => clean(v.n * k)), r = mul(x, nat(c));
            return M('같은 수를 여러 번 더한 식을 곱셈식으로 나타내었다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], nat(c)), inp(LAB[1], r)], {
              figure: lines([eq(...sumOf(S(x), c)), eq('=', S(x), '*', box(LAB[0]), '=', box(LAB[1]))]),
              explain: `${J(x, '을/를')} ${c}번 더했으므로 ${S(x)} × ${c}이다. 0.1이 ${x.n} × ${c} = ${x.n * c}(개)이므로 ${S(r)}이다.`,
              facts: { calc: [[`${S(x)}*${c}`, 1]], unseen: [c] }
            });
          }),
          T('dn-line', '수직선을 보고 (소수)×(자연수) 알아보기', '②2 ③2 ①5', (d, n) => {
            // 첫째 문항은 1보다 작은 소수, 둘째 문항은 1보다 큰 소수. 곱하는 수(뛴 횟수)는 그림에서 읽는다.
            const [x, c] = d.until(() => [n === 0 ? one(d, 3, 9) : one(d, 11, 16), d.int(2, n === 0 ? 4 : 3)], ([v, k]) => clean(v.n * k)), r = mul(x, nat(c));
            return M(`수직선에서 0부터 ${S(x)}씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(c)), inp(LAB[1], r)], {
              figure: hopLine(Math.ceil(x.n * c / 10), x.n, c) + eq(S(x), '*', box(LAB[0]), '=', box(LAB[1])),
              explain: `${S(x)}씩 ${c}번 뛰었으므로 ${S(x)} × ${c}이다. 작은 눈금 한 칸은 0.1이고 모두 ${x.n} × ${c} = ${x.n * c}(칸) 갔으므로 ${S(r)}이다.`,
              facts: { calc: [[String(c), 0], [`${S(x)}*${c}`, 1]], rule: ['lineSmall', 'lineBig'][n] }
            });
          }, { count: 2 }),
          T('dn-bars', '띠 그림을 보고 (소수)×(자연수) 알아보기', '②1 ①5', (d) => {
            const [a, c] = d.until(() => [d.int(3, 9), d.int(2, 4)], ([v, k]) => clean(v * k)), x = dec(a, 1), r = mul(x, nat(c));
            return M(`크기가 1인 띠 ${c}개를 각각 똑같이 10칸으로 나누어 그림과 같이 색칠하였다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], x), inp(LAB[1], r)], {
              figure: bands(a, c) + lines([`띠 하나에 색칠한 부분의 크기: ${box(LAB[0])}`, eq(box(LAB[0]), '*', c, '=', box(LAB[1]))]),
              explain: `한 칸의 크기는 0.1이므로 띠 하나에 색칠한 부분은 ${S(x)}이다. 색칠한 칸은 모두 ${a} × ${c} = ${a * c}(칸)이므로 ${S(x)} × ${c} = ${S(r)}이다.`,
              facts: { calc: [[`${a}/10`, 0], [`${a}*${c}/10`, 1]] }
            });
          }),
          T('dn-count', '0.1(0.01)의 개수로 (소수)×(자연수) 계산하기', '①2 ②3 ③3', (d, n) => {
            // 첫째 문항은 0.1의 개수(소수 한 자리 수), 둘째 문항은 0.01의 개수(소수 두 자리 수).
            const [x, c] = d.until(() => [n === 0 ? one(d, 2, 29) : two(d, 12, 99), d.int(2, 9)], ([v, k]) => clean(v.n * k) && v.n !== k), r = mul(x, nat(c)), unit = S(dec(1, x.k));
            return M(`${J(x, '은/는')} ${unit}이 ${x.n}개인 수이다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(x.n * c)), inp(LAB[1], r)], {
              figure: lines([`${S(x)} × ${josa(c, '은/는')} ${unit}이 ${x.n} × ${c} = ${box(LAB[0])}(개)인 수이다.`, eq(S(x), '*', c, '=', box(LAB[1]))]),
              explain: `${unit}이 ${x.n}개씩 ${c}번 있으므로 ${x.n} × ${c} = ${x.n * c}(개)이다. ${unit}이 ${x.n * c}개인 수는 ${S(r)}이다.`,
              facts: { calc: [[`${x.n}*${c}`, 0], [`${S(x)}*${c}`, 1]], rule: ['countTenth', 'countHundredth'][n] }
            });
          }, { count: 2 }),
          T('dn-split', '자연수 부분과 소수 부분으로 나누어 (소수)×(자연수) 계산하기', '③3', (d) => {
            const [w, f, c] = d.until(() => [d.int(1, 4), d.int(2, 9), d.int(2, 9)], ([, y, z]) => clean(y * z)), x = dec(w * 10 + f, 1), low = dec(f, 1);
            return M(`${J(x, '을/를')} ${josa(w, '과/와')} ${J(low, '으로/로')} 나누어 곱하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], nat(w * c)), inp(LAB[1], mul(low, nat(c))), inp(LAB[2], mul(x, nat(c)))], {
              figure: lines([eq(S(x), '*', c), eq('=', par(w, '*', c), '+', par(S(low), '*', c)), eq('=', box(LAB[0]), '+', box(LAB[1]), '=', box(LAB[2]))]),
              explain: `${w} × ${c} = ${w * c}이고 ${S(low)} × ${c} = ${S(mul(low, nat(c)))}이다. 두 곱을 더하면 ${w * c} + ${S(mul(low, nat(c)))} = ${S(mul(x, nat(c)))}이다.`,
              facts: { calc: [[`${w}*${c}`, 0], [`${S(low)}*${c}`, 1], [`${S(x)}*${c}`, 2]] }
            });
          }),
          T('dn-frac', '분수의 곱셈으로 고쳐 (소수)×(자연수) 계산하기', '①3 ②4 ③4 심5', (d, n) => {
            // 첫째 문항은 분모가 10(소수 한 자리 수), 둘째 문항은 분모가 100(소수 두 자리 수).
            const [x, c] = d.until(() => [n === 0 ? one(d, 2, 69) : two(d, 12, 399), d.int(2, 9)], ([v, k]) => clean(v.n * k)), den = P10[x.k], r = mul(x, nat(c)), i = ix(x);
            return M('소수를 분수로 고쳐 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [inp(LAB[0], nat(x.n)), inp(LAB[1], nat(x.n * c)), inp(LAB[2], r)], {
              figure: lines([eq(S(x), '*', c, '=', frac(box(LAB[0]), den), '*', c), eq('=', frac(`${box(LAB[0])} × ${c}`, den), '=', frac(box(LAB[1]), den), '=', box(LAB[2]))]),
              explain: `${S(x)} = ${frac(x.n, den)}이다. ${frac(x.n, den)} × ${c} = ${frac(`${x.n} × ${c}`, den)} = ${frac(x.n * c, den)}이고, 소수로 나타내면 ${S(r)}이다.`,
              facts: { calc: [[i.s, 0], [`${i.s}*${c}`, 1], [`${S(x)}*${c}`, 2]], unseen: i.un, rule: ['fracTen', 'fracHundred'][n] }
            });
          }, { count: 2 }),
          T('dn-natural', '자연수의 곱셈을 이용하여 (소수)×(자연수) 계산하기', '①4 ②5 ③5 심8', (d, n) => {
            // 첫째 문항은 곱해지는 수가 1/10배, 둘째 문항은 1/100배.
            const [x, c] = d.until(() => [n === 0 ? one(d, 12, 98) : two(d, 112, 698), d.int(3, 9)], ([v, k]) => clean(v.n * k)), r = mul(x, nat(c));
            return M(`${J(x, '은/는')} ${x.n}의 ${part(x.k)}배이다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(x.n * c)), inp(LAB[1], r)], {
              figure: lines([eq(x.n, '*', c, '=', box(LAB[0])), eq(S(x), '*', c, '=', box(LAB[1]))]),
              explain: `곱해지는 수가 ${part(x.k)}배가 되면 계산 결과도 ${part(x.k)}배가 된다. ${x.n} × ${c} = ${x.n * c}이므로 ${S(x)} × ${c} = ${S(r)}이다.`,
              facts: { calc: [[`${x.n}*${c}`, 0], [`${S(x)}*${c}`, 1]], rule: ['natTenth', 'natHundredth'][n] }
            });
          }, { count: 2 }),
          T('dn-natural-ratio', '곱해지는 수가 몇 분의 일이 될 때 곱의 변화', '③5 ①4', (d) => {
            const [x, c] = d.until(() => [d.bool() ? one(d, 12, 98) : two(d, 112, 698), d.int(3, 9)], ([v, k]) => clean(v.n * k)), p = x.n * c;
            const rows = d.shuffle([[`${part(1)}배`, x.k === 1], [`${part(2)}배`, x.k === 2], ['10배', false], ['100배', false]]);
            return C(`${x.n} × ${c} = ${p}이다. ${S(x)} × ${c}의 계산 결과는 ${p}의 몇 배인가?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: `${J(x, '은/는')} ${x.n}의 ${part(x.k)}배이다. 곱해지는 수가 ${part(x.k)}배가 되면 계산 결과도 ${part(x.k)}배가 되므로 ${S(x)} × ${c} = ${S(mul(x, nat(c)))}이다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('dn-method', '(소수)×(자연수)를 어떤 방법으로 계산했는지 알기', '②43 ③79 ①3', (d) => {
            // 덧셈식, 분수의 곱셈, 0.1의 개수, 자연수의 곱셈 가운데 하나로 계산한 것을 보인다.
            const [a, c] = d.until(() => [d.int(2, 9), d.int(2, 4)], ([v, k]) => clean(v * k) && v !== k), x = dec(a, 1), r = S(mul(x, nat(c))), kind = d.int(0, 3);
            const shown = [
              [eq(S(x), '*', c, '=', ...sumOf(S(x), c)), eq('=', r)],
              [eq(S(x), '*', c, '=', frac(a, 10), '*', c), eq('=', frac(a * c, 10), '=', r)],
              [`${S(x)} × ${josa(c, '은/는')} 0.1이 ${a} × ${c} = ${a * c}(개)인 수이다.`, eq(S(x), '*', c, '=', r)],
              [eq(a, '*', c, '=', a * c), `${a * c}의 ${part(1)}배 → ${eq(S(x), '*', c, '=', r)}`]
            ][kind];
            const rows = d.shuffle([['같은 수를 여러 번 더하는 덧셈식으로 고쳐 계산하였다.', 0], ['소수를 분수로 고쳐 분수의 곱셈으로 계산하였다.', 1], ['0.1이 모두 몇 개인지 세어 계산하였다.', 2], [`자연수의 곱셈을 한 다음 계산 결과를 ${part(1)}배 하였다.`, 3]]);
            return C('다음 계산에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === kind), {
              figure: lines(shown),
              explain: ['곱셈을 같은 수의 덧셈으로 고쳤다.', `${J(x, '을/를')} 분모가 10인 분수로 고쳐 분모는 그대로 두고 분자와 자연수를 곱하였다.`, `0.1이 ${a}개씩 ${c}번이므로 ${a * c}개라고 세었다.`, `${a} × ${josa(c, '을/를')} 먼저 계산하고, ${J(x, '이/가')} ${a}의 ${part(1)}배이므로 곱도 ${part(1)}배 하였다.`][kind] + ` 어느 방법으로 계산해도 ${S(x)} × ${c} = ${r}이다.`,
              facts: { truth: rows.map((row) => row[1] === kind), want: true }
            });
          }),
          calcType('dn-small', '(1보다 작은 소수 한 자리 수)×(자연수)', '①8 ②6 ③6', 'row', (d) => pair(d, () => [one(d, 2, 9), nat(d.int(2, 9))], clean)),
          calcType('dn-big', '(1보다 큰 소수 한 자리 수)×(자연수)', '①8 ②6 ③6 심1', 'col', (d) => pair(d, () => [one(d, 11, 99), nat(d.int(2, 9))], clean)),
          calcType('dn-two-small', '(1보다 작은 소수 두 자리 수)×(자연수)', '①9 ②7 ③7', 'row', (d) => pair(d, () => [two(d, 12, 99), nat(d.int(2, 9))], clean)),
          calcType('dn-two-big', '(1보다 큰 소수 두 자리 수)×(자연수)', '①9 ②7 ③7 심1', 'col', (d) => pair(d, () => [two(d, 112, 989), nat(d.int(2, 9))], (p, x) => clean(p) && Math.floor(x.n / 10) % 10 !== 0)),
          calcType('dn-zero-mid', '소수 첫째 자리가 0인 수와 자연수의 곱', '①9 ②7 심1', 'col', (d) => pair(d, () => [dec(d.int(1, 9) * 100 + d.int(2, 9), 2), nat(d.int(2, 9))], clean)),
          calcType('dn-hundredth', '(0.0□)×(자연수)', '②7', 'row', (d) => pair(d, () => [dec(d.int(2, 9), 2), nat(d.int(2, 9))], clean)),
          calcType('dn-two-digit', '(소수 한 자리 수)×(두 자리 자연수)', '①12 ②6 ③6', 'col', (d) => pair(d, () => [one(d, 2, 89), nat(nz(d, 11, 39))], clean)),
          calcType('dn-two-two', '(소수 두 자리 수)×(두 자리 자연수)', '①12 ②7 ③7', 'col', (d) => pair(d, () => [two(d, 5, 199), nat(nz(d, 11, 69))], clean)),
          calcType('dn-drop', '곱의 끝자리가 0이 되는 (소수 두 자리 수)×(자연수)', '②7 ③28 심1', 'row', (d) => pair(d, () => [two(d, 105, 895), nat(d.int(2, 8))], (p) => p % 10 === 0 && p % 100 !== 0)),
          calcType('dn-whole', '곱이 자연수인 (소수)×(자연수)', '①8 ③28 심16', 'row', (d) => pair(d, () => [d.bool() ? one(d, 5, 95) : two(d, 25, 475), nat(d.int(2, 8))], (p, x) => p % P10[x.k] === 0), 'nat')
        ]
      },
      {
        id: 'nd', title: '(자연수)×(소수)', standard: STD,
        types: [
          T('nd-band', '띠 그림을 보고 (자연수)×(소수) 알아보기', '②8 ③13 ①5', (d) => {
            const [t, a] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([v, k]) => clean(v * k) && v !== k), y = dec(a, 1), r = mul(nat(t), y), cell = dec(t, 1);
            return M(`길이가 ${t}인 띠를 똑같이 10칸으로 나누어 ${a}칸을 색칠하였다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], cell), inp(LAB[1], r)], {
              figure: natBand(t, a) + lines([`한 칸의 길이: ${box(LAB[0])}`, eq(t, '*', S(y), '=', box(LAB[1]))]),
              explain: `한 칸의 길이는 ${t}의 ${part(1)}인 ${S(cell)}이다. 색칠한 부분은 ${a}칸이므로 ${S(cell)} × ${a} = ${S(r)}이다. 이것은 ${t}의 ${S(y)}배이다.`,
              facts: { calc: [[`${t}/10`, 0], [`${t}*${S(y)}`, 1]] }
            });
          }),
          T('nd-split', '1배와 0.□배로 나누어 (자연수)×(소수) 계산하기', '③14', (d) => {
            const [t, w, f] = d.until(() => [d.int(2, 9), d.int(1, 3), d.int(2, 9)], ([v, , z]) => clean(v * z)), y = dec(w * 10 + f, 1), low = dec(f, 1);
            return M(`${t} × ${J(y, '을/를')} ${t}의 ${w}배와 ${t}의 ${S(low)}배로 나누어 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], nat(t * w)), inp(LAB[1], mul(nat(t), low)), inp(LAB[2], mul(nat(t), y))], {
              figure: lines([`${t}의 ${w}배: ${box(LAB[0])}`, `${t}의 ${S(low)}배: ${box(LAB[1])}`, eq(t, '*', S(y), '=', box(LAB[0]), '+', box(LAB[1]), '=', box(LAB[2]))]),
              explain: `${t}의 ${w}배는 ${t * w}, ${t}의 ${S(low)}배는 ${S(mul(nat(t), low))}이다. 두 수를 더하면 ${t * w} + ${S(mul(nat(t), low))} = ${S(mul(nat(t), y))}이다.`,
              facts: { calc: [[`${t}*${w}`, 0], [`${t}*${S(low)}`, 1], [`${t}*${S(y)}`, 2]] }
            });
          }),
          T('nd-frac', '분수의 곱셈으로 고쳐 (자연수)×(소수) 계산하기', '②9 ③15 심5', (d, n) => {
            // 첫째 문항은 분모가 10, 둘째 문항은 분모가 100(0.06처럼 분자가 한 자리 수인 것도 있다).
            const [t, y] = d.until(() => [d.int(2, 9), n === 0 ? one(d, 2, 49) : d.int(0, 2) === 0 ? dec(d.int(2, 9), 2) : two(d, 12, 399)], ([v, z]) => clean(v * z.n)), den = P10[y.k], r = mul(nat(t), y), i = ix(y);
            return M('소수를 분수로 고쳐 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [inp(LAB[0], nat(y.n)), inp(LAB[1], nat(t * y.n)), inp(LAB[2], r)], {
              figure: lines([eq(t, '*', S(y), '=', t, '*', frac(box(LAB[0]), den)), eq('=', frac(`${t} × ${box(LAB[0])}`, den), '=', frac(box(LAB[1]), den), '=', box(LAB[2]))]),
              explain: `${S(y)} = ${frac(y.n, den)}이다. ${t} × ${frac(y.n, den)} = ${frac(`${t} × ${y.n}`, den)} = ${frac(t * y.n, den)}이고, 소수로 나타내면 ${S(r)}이다.`,
              facts: { calc: [[i.s, 0], [`${t}*${i.s}`, 1], [`${t}*${S(y)}`, 2]], unseen: i.un, rule: ['fracTen', 'fracHundred'][n] }
            });
          }, { count: 2 }),
          T('nd-natural', '자연수의 곱셈을 이용하여 (자연수)×(소수) 계산하기', '②10 ③16 심8', (d, n) => {
            // 첫째 문항은 곱하는 수가 1/10배, 둘째 문항은 1/100배.
            const [t, y] = d.until(() => [d.int(3, 9), n === 0 ? one(d, 12, 98) : two(d, 12, 398)], ([v, z]) => clean(v * z.n)), r = mul(nat(t), y);
            return M(`${J(y, '은/는')} ${y.n}의 ${part(y.k)}배이다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(t * y.n)), inp(LAB[1], r)], {
              figure: lines([eq(t, '*', y.n, '=', box(LAB[0])), eq(t, '*', S(y), '=', box(LAB[1]))]),
              explain: `곱하는 수가 ${part(y.k)}배가 되면 계산 결과도 ${part(y.k)}배가 된다. ${t} × ${y.n} = ${t * y.n}이므로 ${t} × ${S(y)} = ${S(r)}이다.`,
              facts: { calc: [[`${t}*${y.n}`, 0], [`${t}*${S(y)}`, 1]], rule: ['natTenth', 'natHundredth'][n] }
            });
          }, { count: 2 }),
          T('nd-say', '자연수의 소수 배인 수', '①10 심1', (d) => {
            const [t, y] = pair(d, () => [nat(d.int(3, 9)), one(d, 12, 298)], clean);
            return ans(`${t.n}의 ${S(y)}배인 수는?`, [t, y], { explain: `${t.n}의 ${S(y)}배는 ${t.n} × ${S(y)}이다. ${how(t, y)}` });
          }),
          calcType('nd-small', '(자연수)×(1보다 작은 소수 한 자리 수)', '①10 ②11 ③17', 'row', (d) => pair(d, () => [nat(d.int(2, 9)), one(d, 2, 9)], clean)),
          calcType('nd-hundredth', '(자연수)×(0.0□)', '①11 ②11 ③18', 'row', (d) => pair(d, () => [nat(d.int(2, 9)), dec(d.int(2, 9), 2)], clean)),
          calcType('nd-two-small', '(자연수)×(1보다 작은 소수 두 자리 수)', '①11 ②11 ③18', 'row', (d) => pair(d, () => [nat(d.int(2, 9)), two(d, 12, 99)], clean)),
          calcType('nd-big', '(자연수)×(1보다 큰 소수 한 자리 수)', '①10 ②12 ③17 심1', 'col', (d) => pair(d, () => [nat(d.int(2, 9)), one(d, 11, 99)], clean)),
          calcType('nd-two-big', '(자연수)×(1보다 큰 소수 두 자리 수)', '①11 ②12 ③18 심1', 'col', (d) => pair(d, () => [nat(d.int(2, 9)), two(d, 102, 989)], clean)),
          calcType('nd-two-digit', '(두 자리 자연수)×(소수 한 자리 수)', '①12 ②11·12 ③17', 'col', (d) => pair(d, () => [nat(nz(d, 11, 49)), one(d, 2, 69)], clean)),
          calcType('nd-two-two', '(두 자리 자연수)×(소수 두 자리 수)', '①12 ②11·12 ③18 심1', 'col', (d) => pair(d, () => [nat(nz(d, 11, 69)), two(d, 12, 399)], clean)),
          calcType('nd-three', '(세 자리 자연수)×(소수 한 자리 수)', '②62 ①64 심45', 'col', (d) => pair(d, () => [nat(nz(d, 105, 495)), one(d, 2, 19)], (p) => clean(p) && p < 10000)),
          calcType('nd-drop', '곱의 끝자리가 0이 되는 (자연수)×(소수 두 자리 수)', '②11 ③28', 'row', (d) => pair(d, () => [nat(d.pick([5, 15, 20, 25, 4, 6, 8])), two(d, 12, 695)], (p) => p % 10 === 0 && p % 100 !== 0)),
          calcType('nd-whole', '곱이 자연수인 (자연수)×(소수)', '①10·12 ③28 심16', 'row', (d) => pair(d, () => [nat(d.pick([2, 4, 5, 6, 8, 12, 15, 20])), d.bool() ? one(d, 5, 95) : two(d, 25, 475)], (p, x, y) => p % P10[y.k] === 0), 'nat')
        ]
      },
      {
        id: 'dd', title: '(소수)×(소수)', standard: STD,
        types: [
          T('dd-grid', '모눈 그림을 보고 (소수)×(소수) 알아보기', '①14 ②13 ③20', (d) => {
            const [a, b] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([v, k]) => v !== k && clean(v * k)), x = dec(a, 1), y = dec(b, 1), r = mul(x, y);
            return M(`한 변의 길이가 1인 정사각형을 똑같이 100칸으로 나누고, 가로 ${S(x)}, 세로 ${S(y)}인 직사각형을 색칠하였다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], dec(1, 2)), inp(LAB[1], nat(a * b)), inp(LAB[2], r)], {
              figure: grid((c, e) => c < a && e < b, `왼쪽 세로줄 ${a}칸과 위쪽 가로줄 ${b}칸이 겹치는 칸을 색칠`) + lines([`한 칸의 넓이: ${box(LAB[0])}`, `색칠한 칸의 수: ${box(LAB[1])}칸`, eq(S(x), '*', S(y), '=', box(LAB[2]))]),
              explain: `전체 1을 똑같이 100칸으로 나누었으므로 한 칸의 넓이는 0.01이다. 색칠한 칸은 ${a} × ${b} = ${a * b}(칸)이므로 ${S(x)} × ${S(y)} = ${S(r)}이다.`,
              facts: { calc: [['1/100', 0], [`${a}*${b}`, 1], [`${S(x)}*${S(y)}`, 2]] }
            });
          }),
          T('dd-grid-pick', '(소수)×(소수)만큼 바르게 색칠한 그림 고르기', '①14 ②13', (d) => {
            // 틀린 그림: 앞의 수만큼만 색칠한 것(0.8), 두 수만큼을 모두 색칠한 것(겹치지 않는 칸까지)
            const [a, b] = d.until(() => [d.int(3, 8), d.int(3, 8)], ([v, k]) => v !== k), x = dec(a, 1), y = dec(b, 1);
            const rows = d.shuffle([
              [grid((c, e) => c < a && e < b, `왼쪽 세로줄 ${a}칸과 위쪽 가로줄 ${b}칸이 겹치는 칸만 색칠`, 9), `${a}*${b}`, true],
              [grid((c) => c < a, `왼쪽 세로줄 ${a}칸을 모두 색칠`, 9), `${a}*10`],
              [grid((c, e) => c < a || e < b, `왼쪽 세로줄 ${a}칸과 위쪽 가로줄 ${b}칸을 모두 색칠`, 9), `${a}*10+${b}*10-${a}*${b}`]
            ]), hit = rows.findIndex((row) => row[2]);
            return C(`한 변의 길이가 1인 정사각형을 똑같이 100칸으로 나누어 ${S(x)} × ${S(y)}만큼 색칠하려고 한다. 바르게 색칠한 것은?`, THREE, hit, {
              figure: tagged(rows.map((row) => row[0])),
              explain: `${S(x)} × ${J(y, '은/는')} ${S(x)}의 ${S(y)}배이다. 가로 ${S(x)} 가운데 세로 ${S(y)}만큼인 ${a} × ${b} = ${a * b}(칸)을 색칠한 ${LAB[hit]}이 바르다. 색칠한 부분은 ${S(mul(x, y))}이다.`,
              facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'equals', target: a * b } }
            });
          }),
          T('dd-area-split', '넓이 그림으로 나누어 (소수)×(소수) 계산하기', '①15 ③21', (d) => {
            const [a, b, c, e] = d.until(() => [d.int(1, 2), d.int(3, 9), d.int(1, 2), d.int(3, 9)], ([p, q, r, s]) => clean(q * s) && clean(p * s) && clean(q * r) && !(p === r && q === s)), x = dec(a * 10 + b, 1), y = dec(c * 10 + e, 1), fb = dec(b, 1), fe = dec(e, 1), r = mul(x, y);
            return M(`가로가 ${S(x)}, 세로가 ${S(y)}인 직사각형을 그림과 같이 네 부분으로 나누어 ${S(x)} × ${J(y, '을/를')} 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], mul(nat(a), fe)), inp(LAB[1], mul(fb, fe)), inp(LAB[2], r)], {
              figure: splitRect(a, b, c, e) + lines([eq(S(x), '*', S(y)), eq('=', par(a, '*', c), '+', par(S(fb), '*', c)), eq('+', par(a, '*', S(fe)), '+', par(S(fb), '*', S(fe))), eq('=', a * c, '+', S(mul(fb, nat(c))), '+', box(LAB[0]), '+', box(LAB[1])), eq('=', box(LAB[2]))]),
              explain: `${a} × ${S(fe)} = ${S(mul(nat(a), fe))}, ${S(fb)} × ${S(fe)} = ${S(mul(fb, fe))}이다. 네 부분의 넓이를 모두 더하면 ${a * c} + ${S(mul(fb, nat(c)))} + ${S(mul(nat(a), fe))} + ${S(mul(fb, fe))} = ${S(r)}이다.`,
              facts: { calc: [[`${a}*${S(fe)}`, 0], [`${S(fb)}*${S(fe)}`, 1], [`${S(x)}*${S(y)}`, 2]] }
            });
          }),
          T('dd-frac', '분수의 곱셈으로 고쳐 (소수)×(소수) 계산하기', '①16 ②14 ③22 심5', (d, n) => {
            if (n === 0) {
              // 분모가 10인 분수끼리: 분모의 곱은 100
              const [x, y] = pair(d, () => [one(d, 2, 49), one(d, 2, 49)], (p, v, w) => clean(p) && v.n !== w.n), r = mul(x, y);
              return M('소수를 분수로 고쳐 계산하는 과정이다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', [inp(LAB[0], nat(x.n)), inp(LAB[1], nat(y.n)), inp(LAB[2], nat(x.n * y.n)), inp(LAB[3], r)], {
                figure: lines([eq(S(x), '*', S(y), '=', frac(box(LAB[0]), 10), '*', frac(box(LAB[1]), 10)), eq('=', frac(box(LAB[2]), 100), '=', box(LAB[3]))]),
                explain: `${S(x)} = ${frac(x.n, 10)}, ${S(y)} = ${frac(y.n, 10)}이다. 분자는 분자끼리, 분모는 분모끼리 곱하면 ${frac(`${x.n} × ${y.n}`, '10 × 10')} = ${frac(x.n * y.n, 100)}이고, 소수로 나타내면 ${S(r)}이다.`,
                facts: { calc: [[ix(x).s, 0], [ix(y).s, 1], [`${ix(x).s}*${ix(y).s}`, 2], [`${S(x)}*${S(y)}`, 3]], unseen: ix(x).un.concat(ix(y).un), rule: 'fracTenTen' }
              });
            }
            // 분모가 10인 분수와 100인 분수: 분모의 곱은 1000
            const [x, y] = pair(d, () => [one(d, 2, 29), two(d, 12, 399)], (p) => clean(p) && p < 10000), r = mul(x, y);
            return M('소수를 분수로 고쳐 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [inp(LAB[0], nat(x.n * y.n)), inp(LAB[1], nat(1000)), inp(LAB[2], r)], {
              figure: lines([eq(S(x), '*', S(y), '=', frac(x.n, 10), '*', frac(y.n, 100)), eq('=', frac(`${x.n} × ${y.n}`, '10 × 100'), '=', frac(box(LAB[0]), box(LAB[1])), '=', box(LAB[2]))]),
              explain: `분자는 분자끼리, 분모는 분모끼리 곱한다. ${x.n} × ${y.n} = ${x.n * y.n}, 10 × 100 = 1000이므로 ${frac(x.n * y.n, 1000)}이고, 소수로 나타내면 ${S(r)}이다.`,
              facts: { calc: [[`${x.n}*${y.n}`, 0], ['10*100', 1], [`${S(x)}*${S(y)}`, 2]], rule: 'fracTenHundred' }
            });
          }, { count: 2 }),
          T('dd-natural', '자연수의 곱셈을 이용하여 (소수)×(소수) 계산하기', '①17 ②15 ③23 심8', (d, n) => {
            // 첫째 문항은 두 수가 각각 1/10배(곱은 1/100배), 둘째 문항은 1/100배와 1/10배(곱은 1/1000배).
            const [x, y] = pair(d, () => [n === 0 ? one(d, 2, 98) : two(d, 12, 98), one(d, 2, n === 0 ? 98 : 9)], (p, v, w) => clean(p) && v.n !== w.n), r = mul(x, y);
            return M(`${J(x, '은/는')} ${x.n}의 ${part(x.k)}배, ${J(y, '은/는')} ${y.n}의 ${part(y.k)}배이다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(x.n * y.n)), inp(LAB[1], r)], {
              figure: lines([eq(x.n, '*', y.n, '=', box(LAB[0])), eq(S(x), '*', S(y), '=', box(LAB[1]))]),
              explain: `곱해지는 수가 ${part(x.k)}배, 곱하는 수가 ${part(y.k)}배가 되면 계산 결과는 ${part(x.k + y.k)}배가 된다. ${x.n} × ${y.n} = ${x.n * y.n}이므로 ${S(x)} × ${S(y)} = ${S(r)}이다.`,
              facts: { calc: [[`${x.n}*${y.n}`, 0], [`${S(x)}*${S(y)}`, 1]], rule: ['natHundredth', 'natThousandth'][n] }
            });
          }, { count: 2 }),
          T('dd-natural-ratio', '두 수가 각각 몇 분의 일이 될 때 곱의 변화', '①17 ③23', (d) => {
            // 틀린 보기: 한 수만 본 것(1/10배, 1/100배), 두 분모를 더한 것(1/20배, 1/110배)
            const [x, y] = pair(d, () => [d.bool() ? one(d, 2, 9) : two(d, 12, 98), one(d, 2, 9)], (p, v, w) => clean(p) && v.n !== w.n), p = x.n * y.n, K = x.k + y.k;
            const rows = d.shuffle([[1, 10], [1, P10[x.k] + P10[y.k]], [1, 100], [1, 1000]]);
            return C(`${x.n} × ${y.n} = ${p}이다. ${J(x, '은/는')} ${x.n}의 ${part(x.k)}배, ${J(y, '은/는')} ${y.n}의 ${part(y.k)}배일 때, ${S(x)} × ${S(y)}의 계산 결과는 ${p}의 몇 배인가?`, rows.map(([t, b]) => `${frac(t, b)}배`), rows.findIndex((row) => row[1] === P10[K]), {
              explain: `${part(x.k)}배의 ${part(y.k)}배는 ${part(K)}배이다. ${S(x)} × ${S(y)} = ${S(mul(x, y))}${dj(S(mul(x, y)), '은/는').slice(S(mul(x, y)).length)} ${p}의 ${part(K)}배이다.`,
              facts: { truth: rows.map((row) => row[1] === P10[K]), want: true }
            });
          }),
          calcType('dd-small', '(1보다 작은 소수 한 자리 수)끼리의 곱', '①18 ②16 ③24', 'row', (d) => pair(d, () => [one(d, 2, 9), one(d, 2, 9)], (p) => clean(p) && p >= 12)),
          calcType('dd-small-zero', '곱이 0.0□인 (소수 한 자리 수)끼리의 곱', '①18 ③24', 'row', (d) => pair(d, () => [one(d, 2, 4), one(d, 2, 4)], (p) => p < 10)),
          calcType('dd-big', '(1보다 큰 소수 한 자리 수)끼리의 곱', '①19 ②17 ③26 심2', 'col', (d) => pair(d, () => [one(d, 11, 98), one(d, 11, 98)], clean)),
          calcType('dd-mixed', '(1보다 큰 소수 한 자리 수)×(1보다 작은 소수 한 자리 수)', '①19 ②17 ③26 심2', 'row', (d) => pair(d, () => [one(d, 11, 98), one(d, 2, 9)], clean)),
          calcType('dd-two-small', '1보다 작고 자리 수가 다른 소수끼리의 곱', '①20 ②16 ③25 심2', 'row', (d) => pair(d, () => (d.bool() ? [two(d, 12, 98), one(d, 2, 9)] : [one(d, 2, 9), two(d, 12, 98)]), (p) => clean(p) && p >= 100)),
          calcType('dd-two-zero', '곱의 소수 첫째 자리가 0인 소수끼리의 곱', '①20 ③25 심2', 'row', (d) => pair(d, () => (d.bool() ? [two(d, 11, 29), one(d, 2, 4)] : [one(d, 2, 9), dec(d.int(2, 9), 2)]), (p) => clean(p) && p < 100)),
          calcType('dd-two-big', '(1보다 큰 소수 두 자리 수)×(1보다 큰 소수 한 자리 수)', '①20 ②17 ③27 심2', 'col', (d) => pair(d, () => (d.bool() ? [two(d, 112, 989), one(d, 11, 98)] : [one(d, 11, 98), two(d, 112, 989)]), clean)),
          calcType('dd-two-mixed', '1보다 큰 소수와 1보다 작은 소수의 곱(자리 수가 다름)', '①20 ②17 ③27 심2', 'col', (d) => pair(d, () => (d.bool() ? [two(d, 112, 989), one(d, 2, 9)] : [two(d, 12, 98), one(d, 11, 98)]), clean)),
          calcType('dd-drop', '곱의 끝자리가 0이 되는 (소수 한 자리 수)끼리의 곱', '①19 ②16·17 ③28', 'row', (d) => pair(d, () => [one(d, 2, 98), one(d, 2, 98)], (p) => p % 10 === 0 && p % 100 !== 0)),
          calcType('dd-drop-two', '곱의 끝자리가 0이 되는 소수 두 자리 수와 소수 한 자리 수의 곱', '①20 ③28', 'col', (d) => pair(d, () => [two(d, 5, 895), one(d, 2, 48)], (p) => p % 10 === 0 && p % 1000 !== 0)),
          calcType('dd-whole', '곱이 자연수인 (소수)×(소수)', '②17 ③28 ①45', 'row', (d) => pair(d, () => [d.bool() ? one(d, 5, 95) : two(d, 25, 475), one(d, 2, 98)], (p, x, y) => p % P10[x.k + y.k] === 0), 'nat'),
          T('dd-chain', '이어서 두 번 곱하기', '③29 심3 ②45', (d) => {
            const [x, y, z] = d.until(() => [d.bool() ? nat(d.int(3, 9)) : one(d, 11, 49), one(d, 2, 9), one(d, 11, 49)], ([p, q, s]) => clean(p.n * q.n) && clean(p.n * q.n * s.n) && p.n * q.n * s.n < 100000), m = mul(x, y), r = mul(m, z);
            return M('㉠, ㉡에 알맞은 수는?', [inp(LAB[0], m), inp(LAB[1], r)], {
              figure: chain([S(x), `× ${S(y)}`, box(LAB[0]), `× ${S(z)}`, box(LAB[1])]),
              explain: `${S(x)} × ${S(y)} = ${S(m)}이고, 이 수에 ${J(z, '을/를')} 곱하면 ${S(m)} × ${S(z)} = ${S(r)}이다.`,
              facts: { calc: [[`${S(x)}*${S(y)}`, 0], [`${S(x)}*${S(y)}*${S(z)}`, 1]] }
            });
          })
        ]
      },
      {
        id: 'point', title: '곱의 소수점 위치', standard: STD,
        types: [
          T('pt-ten', '소수에 10, 100, 1000 곱하기', '①22 ②19 ③30 심18', (d, n) => {
            // 첫째 문항은 소수 두 자리 수, 둘째 문항은 소수 세 자리 수.
            const x = n === 0 ? two(d, 12, 989) : three(d, 1001, 9899), i = ix(x), rs = [10, 100, 1000].map((m) => mul(x, nat(m)));
            return M('㉠, ㉡, ㉢에 알맞은 수는?', rs.map((r, j) => inp(LAB[j], r)), {
              figure: lines([10, 100, 1000].map((m, j) => eq(S(x), '*', m, '=', box(LAB[j])))),
              explain: `곱하는 수의 0이 하나씩 늘어날 때마다 곱의 소수점이 오른쪽으로 한 자리씩 옮겨진다. ${S(x)}에 10, 100, 1000을 곱하면 차례로 ${rs.map(S).join(', ')}이다.`,
              facts: { calc: rs.map((r, j) => [r.k ? `${S(x)}*${P10[j + 1]}` : `${i.s}*${P10[j + 1]}/${P10[x.k]}`, j]), unseen: i.un, rule: ['tenTwo', 'tenThree'][n] }
            });
          }, { count: 2 }),
          T('pt-ten-fill', '0을 채워야 하는 10, 100, 1000 곱하기', '①22 ②19 심18', (d) => {
            const [x, m] = d.pick([() => [one(d, 2, 9), d.pick([100, 1000])], () => [dec(d.int(2, 9), 2), 1000], () => [two(d, 12, 98), 1000], () => [one(d, 11, 98), d.pick([100, 1000])]])(), r = mul(x, nat(m)), i = ix(x);
            return N(CALC, r.n, {
              figure: eq(S(x), '*', m, '=', box()),
              explain: `${m}을 곱하면 소수점이 오른쪽으로 ${NTH[String(m).length - 1]} 자리 옮겨진다. 옮길 자리가 모자라면 오른쪽에 0을 채운다. ${S(x)} × ${m} = ${S(r)}이다.`,
              facts: { calc: [[`${i.s}*${m}/${P10[x.k]}`, 0]], unseen: i.un, rule: 'tenFill' }
            });
          }),
          T('pt-rule', '소수점이 옮겨지는 규칙', '①22·23 ②19·20 ③33', (d, n) => {
            const WAYS = [['오른쪽으로 한 자리씩 옮겨진다.', 'R'], ['왼쪽으로 한 자리씩 옮겨진다.', 'L'], ['오른쪽으로 두 자리씩 옮겨진다.', 'R2'], ['옮겨지지 않는다.', 'S']], rows = d.shuffle(WAYS);
            if (n === 0) {
              // 곱하는 수가 10배씩 되는 식 세 줄
              const [a, b] = d.until(() => [d.int(12, 48), d.int(12, 48)], ([x, y]) => clean(x * y) && x !== y), p = a * b;
              return C('곱하는 수가 10배씩 될 때마다 곱의 소수점은 어떻게 옮겨지는가?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === 'R'), {
                figure: lines([2, 1, 0].map((k) => eq(a, '*', fx(b, k), '=', fx(p, k)))),
                explain: `곱은 차례로 ${[2, 1, 0].map((k) => fx(p, k)).join(', ')}이다. 곱하는 수가 10배가 되면 곱도 10배가 되므로 곱의 소수점이 오른쪽으로 한 자리씩 옮겨진다.`,
                facts: { truth: rows.map((row) => row[1] === 'R'), want: true }
              });
            }
            // 0.1, 0.01, 0.001을 곱하는 식 세 줄
            const a = nz(d, 112, 989);
            return C('곱하는 소수의 소수점 아래 자리 수가 하나씩 늘어날 때마다 곱의 소수점은 어떻게 옮겨지는가?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === 'L'), {
              figure: lines([1, 2, 3].map((k) => eq(a, '*', fx(1, k), '=', fx(a, k)))),
              explain: `곱은 차례로 ${[1, 2, 3].map((k) => fx(a, k)).join(', ')}이다. 0.1, 0.01, 0.001을 곱하면 곱의 소수점이 왼쪽으로 한 자리, 두 자리, 세 자리 옮겨진다.`,
              facts: { truth: rows.map((row) => row[1] === 'L'), want: true }
            });
          }, { count: 2 }),
          T('pt-tenth', '자연수에 0.1, 0.01, 0.001 곱하기', '①23 ②20 ③31 심18', (d, n) => {
            // 첫째 문항은 끝자리가 0이 아닌 세 자리 수, 둘째 문항은 끝자리가 0인 수(첫 곱이 자연수이다).
            const a = n === 0 ? nz(d, 112, 989) : nz(d, 12, 98) * 10, rs = [1, 2, 3].map((k) => dec(a, k));
            return M('㉠, ㉡, ㉢에 알맞은 수는?', rs.map((r, j) => inp(LAB[j], r)), {
              figure: lines([1, 2, 3].map((k, j) => eq(a, '*', fx(1, k), '=', box(LAB[j])))),
              explain: `곱하는 소수의 소수점 아래 자리 수만큼 곱의 소수점이 왼쪽으로 옮겨진다. ${a}에 0.1, 0.01, 0.001을 곱하면 차례로 ${rs.map(S).join(', ')}이다.`,
              facts: { calc: rs.map((r, j) => [r.k ? `${a}*${fx(1, j + 1)}` : `${a}/${P10[j + 1]}`, j]), unseen: [10], rule: ['tenthPlain', 'tenthZero'][n] }
            });
          }, { count: 2 }),
          T('pt-tenth-fill', '0을 채워야 하는 0.01, 0.001 곱하기', '①23 ②20 ③31', (d) => {
            const [a, k] = d.pick([() => [nz(d, 12, 98), 3], () => [d.int(2, 9), 2], () => [d.int(2, 9), 3], () => [nz(d, 12, 98), 2]])(), r = dec(a, k);
            return D(CALC, V(r), {
              figure: eq(a, '*', fx(1, k), '=', box()),
              explain: `${fx(1, k)}을 곱하면 소수점이 왼쪽으로 ${NTH[k]} 자리 옮겨진다. 옮길 자리가 모자라면 왼쪽에 0을 채운다. ${a} × ${fx(1, k)} = ${S(r)}이다.`,
              facts: { calc: [[`${a}*${fx(1, k)}`, 0]], rule: 'tenthFill' }
            });
          }),
          T('pt-spot', '곱에 소수점을 찍을 자리 고르기', '①38 ②21 ③32 심18', (d, n) => {
            if (n === 0) {
              // 소수 세 자리 수에 10 또는 100을 곱한다.
              const x = three(d, 1012, 9898), j = d.int(1, 2), m = P10[j], i = ix(x), r = mul(x, nat(m));
              return C('계산 결과에 소수점을 찍으려고 한다. 소수점을 찍어야 할 곳은?', THREE, j, {
                figure: eq(S(x), '*', m, '=') + spots(x.n),
                explain: `${m}을 곱하면 소수점이 오른쪽으로 ${NTH[j]} 자리 옮겨지므로 ${S(x)} × ${m} = ${S(r)}이다.`,
                facts: { pick: { expr: `${i.s}*${m}`, options: [0, 1, 2].map((g) => x.n * P10[g]) }, unseen: i.un, rule: 'spotTen' }
              });
            }
            // 네 자리 자연수에 0.1, 0.01, 0.001을 곱한다.
            const a = nz(d, 1012, 9898), k = d.int(1, 3), r = dec(a, k);
            return C('계산 결과에 소수점을 찍으려고 한다. 소수점을 찍어야 할 곳은?', THREE, 3 - k, {
              figure: eq(a, '*', fx(1, k), '=') + spots(a),
              explain: `${fx(1, k)}을 곱하면 소수점이 왼쪽으로 ${NTH[k]} 자리 옮겨지므로 ${a} × ${fx(1, k)} = ${S(r)}이다.`,
              facts: { pick: { expr: `${a}*1000/${P10[k]}`, options: [0, 1, 2].map((g) => a * P10[g]) }, unseen: [1000, P10[k]], rule: 'spotTenth' }
            });
          }, { count: 2 }),
          T('pt-natural-one', '자연수의 곱을 보고 한 수만 소수인 곱 구하기', '③34 ①24 심22', (d) => {
            const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([x, y]) => clean(x * y) && x !== y), p = a * b, rs = [1, 2, 3].map((k) => dec(p, k));
            return M(`${a} × ${b} = ${p}이다. ㉠, ㉡, ㉢에 알맞은 수는?`, rs.map((r, j) => inp(LAB[j], r)), {
              figure: lines([1, 2, 3].map((k, j) => eq(fx(a, k), '*', b, '=', box(LAB[j])))),
              explain: `곱해지는 수의 소수점 아래 자리 수만큼 ${p}에서 소수점을 왼쪽으로 옮긴다. 차례로 ${rs.map(S).join(', ')}이다.`,
              facts: { calc: rs.map((r, j) => [`${fx(a, j + 1)}*${b}`, j]) }
            });
          }),
          T('pt-natural-both', '자연수의 곱을 보고 두 수가 모두 소수인 곱 구하기', '①24 ②22 ③35 심22', (d) => {
            const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([x, y]) => clean(x * y) && x !== y), p = a * b, flip = d.bool();
            const rows = [[dec(a, 1), dec(b, 1)], flip ? [dec(a, 2), dec(b, 1)] : [dec(a, 1), dec(b, 2)]];
            return M(`${a} × ${b} = ${p}이다. ㉠, ㉡에 알맞은 수는?`, rows.map((row, j) => inp(LAB[j], mul(...row))), {
              figure: lines(rows.map((row, j) => eq(S(row[0]), '*', S(row[1]), '=', box(LAB[j])))),
              explain: `곱의 소수점 아래 자리 수는 곱하는 두 수의 소수점 아래 자리 수를 더한 것과 같다. ${p}에서 소수점을 왼쪽으로 두 자리, 세 자리 옮기면 ${rows.map((row) => S(mul(...row))).join(', ')}이다.`,
              facts: { calc: rows.map((row, j) => [`${S(row[0])}*${S(row[1])}`, j]), rule: 'naturalBoth' }
            });
          }),
          T('pt-natural-ten', '한 수는 몇 분의 일, 다른 수는 10배·100배가 된 곱', '②22 심23', (d) => {
            const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 48)], ([x, y]) => clean(x * y) && x !== y), p = a * b, [k, m] = d.pick([[2, 10], [3, 10], [3, 100]]), x = dec(a, k), y = nat(b * m), r = mul(x, y);
            return D(`${a} × ${b} = ${p}이다. 이를 이용하여 다음을 계산하시오.`, V(r), {
              figure: eq(S(x), '*', S(y), '=', box()),
              explain: `${J(x, '은/는')} ${a}의 ${part(k)}배이고 ${J(y, '은/는')} ${b}의 ${m}배이다. ${part(k)}배의 ${m}배는 ${part(k - String(m).length + 1)}배이므로 곱은 ${p}의 ${part(k - String(m).length + 1)}배인 ${S(r)}이다.`,
              facts: { calc: [[`${S(x)}*${S(y)}`, 0]] }
            });
          }),
          T('pt-from-decimal', '소수가 있는 곱셈식을 보고 소수점이 더 옮겨진 곱 구하기', '③37 ②22', (d) => {
            const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([x, y]) => clean(x * y) && x !== y), p = a * b, front = d.bool();
            const given = front ? [dec(a, 1), nat(b)] : [nat(a), dec(b, 1)], asked = [dec(a, 2), dec(b, 1)], r = mul(...asked);
            return D(`${S(given[0])} × ${S(given[1])} = ${fx(p, 1)}이다. 이를 이용하여 다음을 계산하시오.`, V(r), {
              figure: eq(S(asked[0]), '*', S(asked[1]), '=', box()),
              explain: front ? `${J(asked[0], '은/는')} ${S(given[0])}의 ${part(1)}배, ${J(asked[1], '은/는')} ${b}의 ${part(1)}배이므로 곱은 ${fx(p, 1)}의 ${part(2)}배인 ${S(r)}이다.` : `${J(asked[0], '은/는')} ${a}의 ${part(2)}배이고 ${J(asked[1], '은/는')} 그대로이므로 곱은 ${fx(p, 1)}의 ${part(2)}배인 ${S(r)}이다.`,
              facts: { calc: [[`${S(asked[0])}*${S(asked[1])}`, 0]] }
            });
          }),
          T('pt-ladder', '곱셈구구로 소수점 아래 자리 수가 늘어나는 곱 구하기', '②24 ①24 ③34', (d) => {
            const [a, b] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => clean(x * y) && x !== y), p = a * b, rows = [[dec(a, 1), nat(b)], [dec(a, 1), dec(b, 1)], [dec(a, 1), dec(b, 2)]];
            return M(`${a} × ${b} = ${p}이다. ㉠, ㉡, ㉢에 알맞은 수는?`, rows.map((row, j) => inp(LAB[j], mul(...row))), {
              figure: lines(rows.map((row, j) => eq(S(row[0]), '*', S(row[1]), '=', box(LAB[j])))),
              explain: `곱의 소수점 아래 자리 수는 곱하는 두 수의 소수점 아래 자리 수를 더한 것과 같다. 소수 한 자리, 두 자리, 세 자리 수가 되도록 ${p} 앞에 0을 채우면 ${rows.map((row) => S(mul(...row))).join(', ')}이다.`,
              facts: { calc: rows.map((row, j) => [`${S(row[0])}*${S(row[1])}`, j]) }
            });
          }),
          T('pt-match', '자연수의 곱을 보고 식과 계산 결과 짝 짓기', '②23 ①13 심21', (d) => {
            const [a, b] = d.until(() => [nz(d, 12, 98), d.int(3, 9)], ([x, y]) => clean(x * y)), p = a * b;
            const forms = [d.pick([[dec(a, 0), dec(b, 1)], [dec(a, 1), nat(b)]]), d.pick([[dec(a, 2), nat(b)], [dec(a, 1), dec(b, 1)], [nat(a), dec(b, 2)]]), d.pick([[dec(a, 1), dec(b, 2)], [dec(a, 2), dec(b, 1)]])];
            const rows = d.shuffle(forms), sc = scaled(rows), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
            return C(`${a} × ${b} = ${p}이다. 식과 계산 결과를 알맞게 짝 지은 것은?`, list.map((o) => o.map((j, i) => `${LAB[i]} ${S(mul(...rows[j]))}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
              figure: tagged(rows.map((row) => eq(S(row[0]), '*', S(row[1])))),
              explain: `곱하는 두 수의 소수점 아래 자리 수를 더한 만큼 ${p}에서 소수점을 왼쪽으로 옮긴다. ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다.`,
              facts: { match: { exprs: sc.exprs, options: list.map((o) => o.map((j) => sc.values[j])) } }
            });
          }),
          T('pt-places-odd', '곱의 소수점 아래 자리 수가 다른 식 찾기', '②24', (d) => {
            // 곱의 끝자리가 0이 되지 않는 식만 쓴다(자리 수의 합이 그대로 곱의 자리 수이다).
            const mk = (K) => pair(d, () => (K === 3 ? d.pick([() => [two(d, 3, 98), one(d, 2, 98)], () => [one(d, 2, 98), two(d, 3, 498)]])() : d.pick([() => [one(d, 2, 98), one(d, 2, 98)], () => [two(d, 105, 6498), nat(d.int(2, 9))]])()), clean);
            const oddK = d.pick([2, 3]), rows = d.shuffle([mk(oddK), mk(5 - oddK), mk(5 - oddK), mk(5 - oddK)]), ks = rows.map((row) => row[0].k + row[1].k), hit = ks.indexOf(oddK);
            return C('곱의 소수점 아래 자리 수가 나머지와 다른 하나는?', rows.map((row) => eq(S(row[0]), '*', S(row[1]))), hit, {
              explain: `곱의 소수점 아래 자리 수는 곱하는 두 수의 소수점 아래 자리 수를 더한 것과 같다. 차례로 ${ks.join(', ')}자리이므로 ${S(rows[hit][0])} × ${S(rows[hit][1])}만 소수 ${oddK === 2 ? '두' : '세'} 자리 수이다.`,
              facts: { only: { values: ks, test: oddK === 2 ? 'atMost' : 'atLeast', target: oddK } }
            });
          }),
          T('pt-wrong', '소수점의 위치가 잘못된 식 찾기', '②25 심25 ①39', (d, n) => {
            let rows, lead = '';
            if (n === 0) {
              // 10·100·1000, 0.1·0.01·0.001을 곱한 식 넷 가운데 하나만 소수점을 한 자리 잘못 옮겼다.
              const a = nz(d, 12, 98), bad = d.int(0, 3);
              rows = d.shuffle([[dec(a, 2), nat(10)], [nat(a), dec(1, 1)], [dec(a, 2), nat(100)], [nat(a), dec(1, d.pick([2, 3]))]]).map((row, i) => { const r = mul(...row); return { row, r, shown: i === bad ? (r.k <= 2 && d.bool() ? dec(r.n, r.k + 1) : dec(r.n * 10, r.k)) : r }; });
            } else {
              // 숫자 배열이 같은 곱 넷 가운데 하나만 소수점을 한 자리 잘못 찍었다.
              const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([x, y]) => clean(x * y) && x !== y), bad = d.int(0, 3);
              lead = `${a} × ${b} = ${a * b}이다. `;
              rows = d.shuffle([[dec(a, 1), dec(b, 1)], [nat(a), dec(b, 1)], [dec(a, 1), dec(b, 2)], [dec(a, 2), nat(b)]]).map((row, i) => { const r = mul(...row); return { row, r, shown: i === bad ? dec(r.n, r.k + (r.k === 3 ? -1 : 1)) : r }; });
            }
            const hit = rows.findIndex((v) => S(v.shown) !== S(v.r)), sc = scaled(rows.map((v) => v.row)), top = Math.max(sc.K, ...rows.map((v) => v.shown.k));
            return C(`${lead}계산이 잘못된 것은?`, rows.map((v) => eq(S(v.row[0]), '*', S(v.row[1]), '=', S(v.shown))), hit, {
              explain: `${S(rows[hit].row[0])} × ${S(rows[hit].row[1])} = ${S(rows[hit].r)}이다. 곱하는 두 수의 소수점 아래 자리 수와 0의 수를 보고 소수점을 옮긴다.`,
              facts: { claimed: rows.map((v, i) => [`${sc.exprs[i]}*${P10[top - sc.K]}`, v.shown.n * P10[top - v.shown.k]]), claimedWant: false, rule: ['wrongTens', 'wrongDigits'][n] }
            });
          }, { count: 2 }),
          T('pt-box-up', '곱한 수 찾기: 10, 100, 1000', '①26 ②26 ③38 심19', (d) => {
            const x = d.pick([() => two(d, 12, 989), () => three(d, 12, 989), () => one(d, 12, 989)])(), m = d.pick([10, 100, 1000].filter((v) => v >= P10[x.k] / 10)), r = mul(x, nat(m)), i = ix(x), ir = ix(r), front = d.bool();
            return N('□ 안에 알맞은 수는?', m, {
              figure: front ? eq(box(), '*', S(x), '=', S(r)) : eq(S(x), '*', box(), '=', S(r)),
              explain: `${S(x)}에서 ${S(r)}${dj(S(r), '이/가').slice(S(r).length)} 되려면 소수점이 오른쪽으로 ${NTH[String(m).length - 1]} 자리 옮겨져야 하므로 곱한 수는 ${m}이다.`,
              facts: { calc: [[`${ir.s}*${P10[x.k - r.k]}/${i.s}`, 0]], unseen: i.un.concat(ir.un, [P10[x.k - r.k]]), rule: 'boxUp' }
            });
          }),
          T('pt-box-down', '곱한 수 찾기: 0.1, 0.01, 0.001', '①26 ②26 ③38 심19', (d) => {
            const [x, k] = d.pick([() => [nat(nz(d, 112, 989)), d.int(1, 3)], () => [one(d, 112, 989), d.int(1, 2)], () => [nat(nz(d, 12, 98)), d.int(1, 3)]])(), m = dec(1, k), r = mul(x, m), front = d.bool();
            return D('□ 안에 알맞은 수는?', V(m), {
              figure: front ? eq(box(), '*', S(x), '=', S(r)) : eq(S(x), '*', box(), '=', S(r)),
              explain: `${S(x)}에서 ${S(r)}${dj(S(r), '이/가').slice(S(r).length)} 되려면 소수점이 왼쪽으로 ${NTH[k]} 자리 옮겨져야 하므로 곱한 수는 ${S(m)}이다.`,
              facts: { calc: [[`${S(r)}/${S(x)}`, 0]], rule: 'boxDown' }
            });
          }),
          T('pt-box-number', '10, 100, 1000을 곱하기 전의 수', '②26 심19', (d) => {
            const x = d.bool() ? three(d, 12, 989) : two(d, 3, 98), m = d.pick([10, 100, 1000].filter((v) => v < P10[x.k])), r = mul(x, nat(m));
            return D(`어떤 수에 ${dj(String(m), '을/를')} 곱하였더니 ${S(r)}${dj(S(r), '이/가').slice(S(r).length)} 되었다. 어떤 수는?`, V(x), {
              explain: `${m}을 곱하면 소수점이 오른쪽으로 ${NTH[String(m).length - 1]} 자리 옮겨진다. 어떤 수는 ${S(r)}에서 소수점을 왼쪽으로 ${NTH[String(m).length - 1]} 자리 옮긴 ${S(x)}이다.`,
              facts: { calc: [[`${S(r)}/${m}`, 0]] }
            });
          }),
          T('pt-box-odd', '□에 알맞은 수가 다른 식 찾기', '②27 ①26 심19', (d) => {
            // 세 식의 □는 같고 한 식만 다르다. 줄: [앞의 수(소수점을 뗀 수, 자리 수), □]
            const [same, other] = d.pick([[nat(10), dec(1, 1)], [dec(1, 1), nat(10)], [nat(100), nat(10)], [dec(1, 2), dec(1, 1)], [nat(10), nat(100)]]);
            const base = (m) => (m.k ? d.pick([() => nat(nz(d, 12, 989)), () => one(d, 12, 989)])() : d.pick([() => one(d, 12, 989), () => two(d, 3, 98), () => three(d, 3, 98)])());
            const rows = d.until(() => d.shuffle([other, same, same, same].map((m, i) => ({ m, odd: i === 0 }))).map((v) => { const x = d.until(() => base(v.m), (z) => z.k + v.m.k <= 3 && mul(z, v.m).k <= 3); return Object.assign(v, { x, r: mul(x, v.m), front: d.bool() }); }), (list) => new Set(list.map((v) => v.x.n)).size === 4);
            const hit = rows.findIndex((v) => v.odd);
            return C('□ 안에 알맞은 수가 나머지와 다른 하나는?', rows.map((v) => (v.front ? eq(box(), '*', S(v.x), '=', S(v.r)) : eq(S(v.x), '*', box(), '=', S(v.r)))), hit, {
              explain: `□ 안에 알맞은 수는 차례로 ${rows.map((v) => S(v.m)).join(', ')}이다. 소수점이 어느 쪽으로 몇 자리 옮겨졌는지 본다.`,
              facts: { choose: { exprs: rows.map((v) => `${S(v.r)}/${S(v.x)}`), rule: 'odd' } }
            });
          }),
          T('pt-box-max', '□에 알맞은 수가 가장 큰 식 찾기', '①26 ②27 심19', (d) => {
            // □는 0.01, 0.1, 10, 100 가운데 서로 다른 셋이다. 수가 큰 식의 □가 큰 것은 아니다.
            const ms = d.shuffle([dec(1, 2), dec(1, 1), nat(10), nat(100)]).slice(0, 3), big = d.bool();
            const rows = d.until(() => ms.map((m) => { const x = d.until(() => (m.k ? d.pick([() => nat(nz(d, 12, 989)), () => one(d, 12, 989)])() : d.pick([() => one(d, 12, 989), () => two(d, 3, 98), () => three(d, 3, 98)])()), (z) => mul(z, m).k <= 3); return { m, x, r: mul(x, m), front: d.bool() }; }), (list) => new Set(list.map((v) => v.x.n)).size === 3);
            const vals = rows.map((v) => V(v.m)), hit = vals.indexOf(big ? Math.max(...vals) : Math.min(...vals));
            return C(`□ 안에 알맞은 수가 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
              figure: tagged(rows.map((v) => (v.front ? eq(box(), '*', S(v.x), '=', S(v.r)) : eq(S(v.x), '*', box(), '=', S(v.r))))),
              explain: `□ 안에 알맞은 수는 ${rows.map((v, i) => `${LAB[i]} ${S(v.m)}`).join(', ')}이다. 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
              facts: { choose: { exprs: rows.map((v) => `${S(v.r)}/${S(v.x)}`), rule: big ? 'max' : 'min' } }
            });
          }),
          T('pt-missing', '자연수의 곱을 보고 빠진 소수 구하기', '①25 ②28 ③39 심24', (d) => {
            const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([x, y]) => clean(x * y) && x !== y), p = a * b, [i, j] = d.pick([[1, 1], [2, 1], [1, 2], [0, 1], [0, 2]]), x = dec(a, i), y = dec(b, j), r = dec(p, i + j), front = d.bool();
            return D(`${a} × ${b} = ${p}이다. □ 안에 알맞은 수는?`, V(y), {
              figure: front ? eq(box(), '*', S(x), '=', S(r)) : eq(S(x), '*', box(), '=', S(r)),
              explain: `${J(r, '은/는')} ${p}의 ${part(i + j)}배이다. ${i ? `${J(x, '은/는')} ${a}의 ${part(i)}배이므로` : `${josa(a, '은/는')} 그대로이므로`} □는 ${b}의 ${part(j)}배인 ${S(y)}이다.`,
              facts: { calc: [[`${S(r)}/${S(x)}`, 0]], rule: 'missing' }
            });
          }),
          T('pt-missing-max', '자연수의 곱을 보고 □가 가장 큰 식 찾기', '③41 ②28', (d) => {
            const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([x, y]) => clean(x * y) && Math.abs(x - y) >= 3), p = a * b;
            // 줄: [아는 수, □, 곱, □가 앞인가]
            const rows = d.shuffle([[nat(b), dec(a, 1), dec(p, 1), true], [nat(a), dec(b, 1), dec(p, 1), false], [dec(b, 1), dec(a, 2), dec(p, 3), true]]), vals = rows.map((row) => V(row[1])), hit = vals.indexOf(Math.max(...vals));
            return C(`${a} × ${b} = ${p}이다. □ 안에 알맞은 수가 가장 큰 것은?`, THREE, hit, {
              figure: tagged(rows.map((row) => (row[3] ? eq(box(), '*', S(row[0]), '=', S(row[2])) : eq(S(row[0]), '*', box(), '=', S(row[2]))))),
              explain: `□ 안에 알맞은 수는 ${rows.map((row, i) => `${LAB[i]} ${S(row[1])}`).join(', ')}이다. 가장 큰 것은 ${LAB[hit]}이다.`,
              facts: { choose: { exprs: rows.map((row) => `${S(row[2])}/${S(row[0])}`), rule: 'max' } }
            });
          }),
          T('pt-tens-odd', '10·0.1 꼴을 곱한 결과가 다른 하나 찾기', '②29 ③43 ①27 심21', (d, n) => {
            // 값이 같은 식: (a × 10^s) × (10^-s). 줄: [곱해지는 수, 곱하는 수]
            const a = nz(d, 12, 98), k0 = d.int(0, 1), target = dec(a, k0 + 1);
            // 곱하는 수 10^j(j: -3~3)마다 곱해지는 수는 target ÷ 10^j 이다. 소수 셋째 자리를 넘지 않는 것만 쓴다.
            const num = (e) => (e >= 0 ? nat(a * P10[e]) : dec(a, -e)), ten = (j) => (j > 0 ? nat(P10[j]) : dec(1, -j));
            const js = d.shuffle([-3, -2, -1, 1, 2].filter((j) => -(k0 + 1) - j >= -3 && -(k0 + 1) - j <= 2)), same = js.slice(0, n === 0 ? 3 : 2).map((j) => [num(-(k0 + 1) - j), ten(j)]);
            // 다른 하나: 곱하는 수만 10배 또는 1/10배로 바꾼 것
            const jo = js[js.length - 1], shift = d.until(() => jo + d.pick([-1, 1]), (v) => v !== 0 && v >= -3 && v <= 3), odd = [num(-(k0 + 1) - jo), ten(shift)];
            const rows = d.shuffle(same.concat([odd])), hit = rows.indexOf(odd);
            // 둘째 문항은 「~의 0.1배」처럼 말로 적은 것을 섞는다.
            const show = (row, i) => (n === 1 && (row[1].k > 0 || i === 0) ? `${S(row[0])}의 ${S(row[1])}배` : eq(S(row[0]), '*', S(row[1])));
            return C('계산 결과가 나머지와 다른 하나는?', n === 0 ? LAB : THREE, hit, {
              figure: tagged(rows.map(show)),
              explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. ${LAB[hit]}만 ${S(target)}${dj(S(target), '이/가').slice(S(target).length)} 아니다.`,
              facts: { choose: { exprs: rows.map((row) => `${S(row[0])}*${S(row[1])}`), rule: 'odd' }, rule: ['tensOdd', 'tensOddWords'][n] }
            });
          }, { count: 2 }),
          T('pt-tens-max', '숫자가 같은 수에 10·100·1000을 곱한 결과가 가장 큰(작은) 것', '③44 ①27', (d) => {
            // 값은 a/10, a, a, 10a: 가장 큰 것과 가장 작은 것이 하나씩이다. 곱하는 수가 가장 큰 식이 답은 아니다.
            const a = nz(d, 112, 989), big = d.bool();
            const rows = d.shuffle([[dec(a, 2), nat(10)], [dec(a, 3), nat(1000)], [dec(a, 1), nat(10)], [dec(a, 1), nat(100)]]), vals = rows.map((row) => mul(...row)), nums = vals.map((v) => v.n * P10[1 - v.k]);
            const hit = nums.indexOf(big ? Math.max(...nums) : Math.min(...nums));
            return C(`계산 결과가 가장 ${big ? '큰' : '작은'} 것은?`, rows.map((row) => eq(S(row[0]), '*', S(row[1]))), hit, {
              explain: `계산 결과는 차례로 ${vals.map(S).join(', ')}이다. 곱하는 수가 아니라 계산 결과를 비교한다.`,
              facts: { choose: { exprs: rows.map((row) => `${S(row[0])}*${S(row[1])}`), rule: big ? 'max' : 'min' } }
            });
          }),
          T('pt-tens-natural', '10·0.1 꼴을 곱한 결과가 자연수인 것 세기', '②29', (d) => {
            const mk = () => d.pick([() => [one(d, 12, 989), nat(d.pick([10, 100]))], () => [two(d, 12, 989), nat(d.pick([10, 100, 1000]))], () => [nat(d.int(2, 98) * 10), dec(1, d.int(1, 2))], () => [nat(nz(d, 112, 989)), dec(1, 1)], () => [nat(d.int(2, 9) * 100), dec(1, d.int(1, 3))]])();
            const rows = d.until(() => [mk(), mk(), mk(), mk()], (list) => { const k = list.filter((row) => mul(...row).k === 0).length; return k >= 1 && k <= 3 && new Set(list.map((row) => S(row[0]) + S(row[1]))).size === 4 && list.some((row) => row[1].k > 0) && list.some((row) => row[1].k === 0); });
            const flags = rows.map((row) => mul(...row).k === 0);
            return N('계산 결과가 자연수인 것은 모두 몇 개인가?', flags.filter(Boolean).length, {
              unit: '개', figure: tagged(rows.map((row) => eq(S(row[0]), '*', S(row[1])))),
              explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. 자연수인 것은 ${rows.map((row, i) => (flags[i] ? LAB[i] : '')).filter(Boolean).join(', ')}이다.`,
              facts: { count: flags }
            });
          }),
          T('pt-same-odd', '숫자 배열이 같은 곱 가운데 계산 결과가 다른 하나', '①27 ②30 심23', (d) => {
            const [a, b] = d.until(() => [nz(d, 112, 989), nz(d, 12, 98)], ([x, y]) => clean(x * y) && x * y < 100000), p = a * b;
            const K3 = [[dec(a, 2), dec(b, 1)], [dec(a, 1), dec(b, 2)]], K2 = [[dec(a, 1), dec(b, 1)], [dec(a, 2), nat(b)], [nat(a), dec(b, 2)]];
            const [same, other] = d.bool() ? [d.shuffle(K3), d.pick(K2)] : [d.shuffle(K2).slice(0, 2), d.pick(K3)], rows = d.shuffle(same.concat([other])), hit = rows.indexOf(other);
            return C(`${a} × ${b} = ${p}이다. 계산 결과가 나머지와 다른 하나는?`, THREE, hit, {
              figure: tagged(rows.map((row) => eq(S(row[0]), '*', S(row[1])))),
              explain: `곱하는 두 수의 소수점 아래 자리 수를 더하면 차례로 ${rows.map((row) => row[0].k + row[1].k).join(', ')}이다. 계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이므로 ${LAB[hit]}만 다르다.`,
              facts: { choose: { exprs: rows.map((row) => `${S(row[0])}*${S(row[1])}`), rule: 'odd' } }
            });
          }),
          T('pt-same-pick', '주어진 곱과 계산 결과가 같은 식 찾기', '①27·29 ②30 심23', (d) => {
            // 한 수가 10배가 되면 다른 수가 1/10배가 되어야 곱이 같다.
            const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([x, y]) => clean(x * y) && x !== y), [i, j] = d.pick([[2, 1], [1, 2]]), x = dec(a, i), y = dec(b, j);
            const right = i === 2 ? [dec(a, 1), dec(b, 2)] : [dec(a, 2), dec(b, 1)];
            const rows = d.shuffle([right, [dec(a, 1), dec(b, 1)], [dec(a, 2), nat(b)], [nat(a), dec(b, 2)]]), sc = scaled(rows.concat([[x, y]]));
            return C(`${S(x)} × ${J(y, '과/와')} 계산 결과가 같은 것은?`, rows.map((row) => eq(S(row[0]), '*', S(row[1]))), rows.indexOf(right), {
              explain: `${S(x)} × ${J(y, '은/는')} 두 수의 소수점 아래 자리 수의 합이 3이다. 보기 가운데 자리 수의 합이 3인 것은 ${S(right[0])} × ${S(right[1])}뿐이다. 한 수가 10배가 되고 다른 수가 ${part(1)}배가 되면 곱은 같다. 두 식의 계산 결과는 모두 ${S(mul(x, y))}이다.`,
              facts: { choose: { exprs: sc.exprs.slice(0, 4), rule: 'equals', target: sc.values[4] }, unseen: sc.un, rule: 'samePick' }
            });
          }),
          T('pt-same-order', '숫자 배열이 같은 곱을 크기 차례로 늘어놓기', '②30 심23', (d) => {
            const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([x, y]) => clean(x * y) && x !== y), p = a * b, desc = d.bool();
            // 곱이 p 의 10배, 1/10배, 1/100배, 1/1000배인 식에서 셋을 고른다.
            const pool = d.shuffle([d.pick([[nat(a * 10), nat(b)], [nat(a), nat(b * 10)]]), d.pick([[nat(a), dec(b, 1)], [dec(a, 1), nat(b)]]), d.pick([[dec(a, 1), dec(b, 1)], [nat(a), dec(b, 2)]]), d.pick([[dec(a, 1), dec(b, 2)], [nat(a), dec(b, 3)]])]).slice(0, 3);
            const rows = d.shuffle(pool), sc = scaled(rows), pick = orderChoice(d, sc.values, THREE, desc);
            return C(`${a} × ${b} = ${p}이다. 계산 결과가 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, pick.options, pick.answer, {
              figure: tagged(rows.map((row) => eq(S(row[0]), '*', S(row[1])))),
              explain: `계산 결과는 ${rows.map((row, i) => `${LAB[i]} ${S(mul(...row))}`).join(', ')}이다. 숫자 배열이 같으므로 소수점의 위치만 비교한다.`,
              facts: { choose: { exprs: rows.map((row) => `${S(row[0])}*${S(row[1])}`), rule: desc ? 'descending' : 'ascending', orders: pick.list } }
            });
          }),
          T('pt-same-sign', '숫자 배열이 같은 두 곱의 크기 비교', '②29·30 심23', (d) => {
            // 세 번에 한 번은 계산 결과가 같다(한 수는 10배, 다른 수는 1/10배).
            const [a, b] = d.until(() => [nz(d, 12, 98), nz(d, 12, 98)], ([x, y]) => clean(x * y) && x !== y), left = [dec(a, 1), dec(b, 1)];
            const right = d.pick([[dec(a, 2), nat(b)], [nat(a), dec(b, 2)], [nat(a), dec(b, 3)], [dec(a, 2), dec(b, 1)], [nat(a), dec(b, 1)], [dec(a, 2), nat(b)]]), rows = d.bool() ? [left, right] : [right, left], sc = scaled(rows);
            return C('계산하지 않고 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sc.values[0] > sc.values[1] ? 0 : sc.values[0] === sc.values[1] ? 1 : 2, {
              figure: versus(eq(S(rows[0][0]), '*', S(rows[0][1])), eq(S(rows[1][0]), '*', S(rows[1][1]))),
              explain: `두 식은 숫자 배열이 같다. 곱하는 두 수의 소수점 아래 자리 수를 더하면 왼쪽은 ${rows[0][0].k + rows[0][1].k}, 오른쪽은 ${rows[1][0].k + rows[1][1].k}이다. ${sc.values[0] === sc.values[1] ? '자리 수의 합이 같으므로 계산 결과도 같다.' : '자리 수의 합이 작은 쪽의 계산 결과가 더 크다.'} 계산 결과는 ${S(mul(...rows[0]))}, ${S(mul(...rows[1]))}이다.`,
              facts: { choose: { exprs: sc.exprs, rule: 'compare' }, unseen: sc.un }
            });
          })
        ]
      },
      { id: 'est', title: '어림하기', standard: STD, types: [] },
      { id: 'check', title: '잘못된 계산 살펴보기', standard: STD, types: [] },
      { id: 'comp', title: '곱의 크기 비교와 조건에 맞는 수', standard: STD, types: [] },
      { id: 'word', title: '소수의 곱셈의 활용', standard: STD, types: [] },
      { id: 'shape', title: '도형에서 소수의 곱셈', standard: STD, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
