// 중학교 1학년 1학기 3단원 문자의 사용과 식 — 실력 문항.
// 단원 틀과 도구(식 글), 싣는 기준, 뺀 것과 까닭은 7-1-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 곱셈과 나눗셈이 섞이면 뒤의 곱셈을 먼저 계산한다(a ÷ b × c를 a/(bc)로). 괄호 안의 나눗셈을 뒤집지 못한다(a ÷ (b ÷ c)를 a/(bc)로).
//    분수로 나눌 때 역수를 곱하지 않는다(a ÷ (1/b)를 a/b로). 기호를 생략한 곱 (2/3)b가 한 덩어리라는 것을 놓친다.
//  - 자리의 숫자를 나란히 적으면 그 수가 된다고 여긴다(십의 자리의 숫자가 3, 일의 자리의 숫자가 x인 수를 3x로). 3x는 3 × x이다.
//  - 퍼센트를 그대로 더하고 뺀다(a % 할인한 값을 8000 − a로). 단위가 다른 양을 그대로 더한다(시간에 15분을 +15로, km에 m를 그대로).
//    시간 = 거리 ÷ 속력을 뒤집는다. 전체에서 뺀 나머지의 몇 %를 구하며 %를 한쪽에만 곱한다.
//  - 평균끼리 더해 2로 나눈다(사람 수·시간이 다른 두 무리의 평균, 평균 속력).
//  - 분모에 분수를 넣고도 나눗셈으로 고치지 않는다(1/x에 x = −1/3을 넣어 −1/3으로). 1/x = −4를 x = −4로 읽는다. 음수의 제곱과 세제곱의 부호를 헷갈린다.
//    절댓값 기호를 항마다 나누어 푼다(|2a + 1|을 2|a| + 1로).
//  - 분수 꼴 식 (3x − 5)/4의 x의 계수를 3이라 한다. 분수 앞의 −가 분자 전체에 걸린다는 것을 놓친다(−(x − 7)/3의 상수항을 −7/3로).
//  - 문자가 보이면 일차식이라 여긴다(0 × x + 1, 1/x, xy + 1). 분수 꼴 x/4, (2 − x)/5는 일차식이 아니라고 여긴다. 정리하면 차수가 낮아지는 식을 놓친다(x² + 3x − x²).
//  - 수를 괄호 안의 첫 항에만 곱한다. 괄호 앞의 −를 첫 항에만 쓴다. 통분할 때 분자에 수를 곱하지 않는다. 동류항을 모으며 x끼리 더한 것을 x²으로 쓴다.
//  - 잘못 계산한 식을 바로잡을 때 「어떤 식」을 구한 데서 멈춘다. 식을 대입할 때 괄호를 쓰지 않아 부호를 틀린다.
//  - 겹쳐 이어 붙이면 겹친 곳이 장수만큼 있다고 여긴다(장수보다 하나 적다). 둘러 놓은 바둑돌에서 꼭짓점의 돌을 두 번 센다. 이어 붙인 도형에서 함께 쓰는 변을 두 번 센다.
//    정해진 양을 넘은 만큼에만 곱해야 하는 것을 전체에 곱한다(기본요금 + 추가 요금). 「나머지」의 개수를 식으로 두지 않는다.
//
// 실력에는 ① 문제의 식·상황·그림에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(잘못 계산한 식 바로잡기, 조건 둘로 두 식 구하기,
// 문자식을 정리한 뒤 대입하기, 합이 같은 표, 거꾸로 채우는 칸, 겹친 곳·함께 쓰는 변을 빼는 규칙, 나머지를 식으로 두는 문장제)만 실었다.
// 기본에서 하는 일을 고르기로 바꾼 것, 수만 키운 계산은 싣지 않았다. 수집본 기본 문서에 나오고 기본에서 하는 일을 다시 묻는 꼴
// (동류항 가리기, 음수를 대입한 값이 다른 하나, 계산 결과가 같은 식, 여러 겹 괄호, 분수 꼴 일차식의 덧셈·뺄셈)은 기본 묶음에 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, numbers, tagged, N, M, C } = B.kit;
  const { LAB, MINUS, gcd, lcm, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, px, nb, tail, lastOf, tj, js, V, sup, ex, tag, proc, nz, pm, co, distinct, ansV } = B.kit.mid;
  const K = B.kit.m713;
  const { STD1, STD2, X, htmlX, sameX, xh, xe, xex, xv, xjs, xsame, xsub, chips, withUnit, vj, pn, ln, nl, kp, linOf, lj, pickX, linQ, given, worked, INK, EDGE, TINT, ITALIC, svgX, plainX, said, label, svg, shape, sn, qs, signedJs, coef, lnQ, pyrFig, listed, CALC } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const OMIT = '다음 식을 곱셈 기호 ×와 나눗셈 기호 ÷를 생략하여 나타낸 것은?';

  // ── 그림 ──
  // 가로·세로·대각선의 합이 같은 3×3 표. 칸에는 식 글·이름표(㉠)·빈칸('')을 적는다.
  function gridFig(cells) {
    const W = 92, Hh = 34, isTag = (s) => /^[㉠-㉯]$/.test(s), told = (s) => (s === '' ? '빈칸' : isTag(s) ? s : plainX(X(s)));
    let out = '';
    cells.forEach((row, r) => row.forEach((s, c) => {
      out += `<rect x="${3 + c * W}" y="${3 + r * Hh}" width="${W}" height="${Hh}" style="fill:${isTag(s) ? 'rgba(37,99,235,0.1)' : '#fff'};stroke:${INK};stroke-width:1.2"/>`;
      if (s !== '') out += `<text x="${3 + c * W + W / 2}" y="${3 + r * Hh + 22}" text-anchor="middle" style="font-size:13.5px;font-weight:600;fill:${isTag(s) ? EDGE : INK}">${isTag(s) ? s : svgX(X(s))}</text>`;
    }));
    return svg(3 * W + 6, 3 * Hh + 6, `가로 3칸, 세로 3칸인 표: ${cells.map((row, r) => `${['첫째', '둘째', '셋째'][r]} 줄은 왼쪽부터 ${row.map(told).join(', ')}`).join(' / ')}`, out);
  }
  // 같은 크기의 종이를 일정한 길이만큼 겹치게 이어 붙인 띠(석 장을 그리고 뒤는 줄였다). piece·overlap: 길이 이름표 [식 글, 단위]
  function tapeFig(piece, overlap) {
    const w = 86, step = 62, y = 38, tint = ['rgba(37,99,235,0.16)', 'rgba(234,88,12,0.16)'];
    let out = '';
    for (let i = 0; i < 3; i += 1) out += `<rect x="${12 + i * step}" y="${y + (i % 2) * 6}" width="${w}" height="30" rx="2" style="fill:${tint[i % 2]};stroke:${INK};stroke-width:1.2"/>`;
    out += `<text x="${12 + 2 * step + w + 16}" y="${y + 24}" text-anchor="middle" style="font-size:18px;font-weight:700;fill:${INK}">…</text>`
      + `<path d="M12 ${y - 6}v-6h${w}v6" style="fill:none;stroke:${INK};stroke-width:1"/>` + label(12 + w / 2, y - 17, piece[0], piece[1])
      + `<path d="M${12 + step} ${y + 42}v6h${w - step}v-6" style="fill:none;stroke:${INK};stroke-width:1"/>` + label(12 + step + (w - step) / 2, y + 63, overlap[0], overlap[1]);
    return svg(262, 110, `같은 크기의 종이를 일정한 길이만큼 겹치게 한 줄로 이어 붙인 띠: 종이 한 장의 가로의 길이는 ${said(piece[0], piece[1])}, 이웃한 두 종이가 겹친 부분의 가로의 길이는 ${said(overlap[0], overlap[1])}`, out);
  }
  // 바둑돌을 한 변에 k개씩 놓아 만든 속이 빈 정사각형·정삼각형 모양
  function ringFig(sides, k) {
    const gap = 20, r = 6.5, pts = [], side = (k - 1) * gap;
    const corners = sides === 4 ? [[0, 0], [side, 0], [side, side], [0, side]] : [[side / 2, 0], [side, side * 0.866], [0, side * 0.866]];
    corners.forEach((p, i) => { const q = corners[(i + 1) % sides]; for (let j = 0; j < k - 1; j += 1) pts.push([p[0] + (q[0] - p[0]) * j / (k - 1), p[1] + (q[1] - p[1]) * j / (k - 1)]); });
    const h = sides === 4 ? side : side * 0.866;
    return svg(side + 30, Math.round(h) + 30, `바둑돌을 한 변에 ${k}개씩 놓아 만든 속이 빈 ${sides === 4 ? '정사각형' : '정삼각형'} 모양: 꼭짓점에 놓인 바둑돌은 두 변에 함께 놓여 있고, 바둑돌은 모두 ${pts.length}개이다`,
      pts.map((p) => `<circle cx="${(15 + p[0]).toFixed(1)}" cy="${(15 + p[1]).toFixed(1)}" r="${r}" style="fill:#374151;stroke:#111827;stroke-width:1"/>`).join(''));
  }
  // 단계마다 바둑돌이 일정하게 늘어나는 그림: 왼쪽 줄의 f개는 그대로이고 오른쪽에 t개씩 놓인 줄이 한 줄씩 늘어난다(1~3단계).
  function stageFig(t, f) {
    const gap = 14, r = 5.2, top = 8, base = top + (t - 1) * gap;
    let out = '', x = 14;
    for (let k = 1; k <= 3; k += 1) {
      for (let j = 0; j < f; j += 1) out += `<circle cx="${x}" cy="${base - j * gap}" r="${r}" style="fill:#374151;stroke:#111827;stroke-width:1"/>`;
      for (let c = 1; c <= k; c += 1) for (let j = 0; j < t; j += 1) out += `<circle cx="${x + c * gap}" cy="${base - j * gap}" r="${r}" style="fill:#fff;stroke:#111827;stroke-width:1.3"/>`;
      out += `<text x="${x + k * gap / 2}" y="${base + 24}" text-anchor="middle" style="font-size:12.5px;font-weight:600;fill:${INK}">${k}단계</text>`;
      x += (k + 1) * gap + 26;
    }
    return svg(x - 12, base + 32, `단계마다 바둑돌을 놓은 그림: 1단계는 ${f + t}개, 2단계는 ${f + 2 * t}개, 3단계는 ${f + 3 * t}개이다. 단계마다 왼쪽 줄의 검은 돌 ${f}개는 그대로이고, 그 오른쪽에 흰 돌이 ${t}개씩 놓인 줄이 한 줄씩 늘어난다`, out);
  }
  // 성냥개비로 정삼각형·정사각형 세 개를 이어 붙인 모양
  function matchFig(sides) {
    const s = 56, x0 = 14, y0 = 12, h = sides === 3 ? s * 0.866 : s, P = [];
    if (sides === 3) { const v = [[0, h], [s / 2, 0], [s, h], [1.5 * s, 0], [2 * s, h]]; [[0, 1], [1, 2], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4]].forEach(([a, b]) => P.push([v[a], v[b]])); }
    else for (let i = 0; i <= 3; i += 1) { P.push([[i * s, 0], [i * s, s]]); if (i < 3) { P.push([[i * s, 0], [(i + 1) * s, 0]]); P.push([[i * s, s], [(i + 1) * s, s]]); } }
    const stick = ([a, b]) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, p = [x0 + a[0] + ux * 5, y0 + a[1] + uy * 5], q = [x0 + b[0] - ux * 5, y0 + b[1] - uy * 5]; return `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" style="stroke:#b45309;stroke-width:3.2;stroke-linecap:round"/><circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="3.4" style="fill:#b91c1c"/>`; };
    const name = sides === 3 ? '정삼각형' : '정사각형', width = (sides === 3 ? 2 : 3) * s + 2 * x0;
    return svg(width, Math.round(h) + 2 * y0, `성냥개비로 ${name} 3개를 한 줄로 이어 붙여 만든 모양: 이웃한 두 ${name}은 성냥개비 한 개를 함께 쓰고, 성냥개비는 모두 ${P.length}개이다`, P.map(stick).join(''));
  }
  // 직사각형 모양의 종이의 네 모퉁이에서 정사각형을 잘라 내는 그림. 가로 wl, 세로 hl, 잘라 내는 정사각형의 한 변 c
  function netFig(wl, hl, c, unit) {
    const x0 = 34, y0 = 26, w = 176, h = 112, s = 28, cut = (x, y) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" style="fill:#e5e7eb;stroke:${INK};stroke-width:1;stroke-dasharray:4 3"/>`;
    return svg(292, 166, `직사각형 모양의 종이의 네 모퉁이에서 크기가 같은 정사각형을 하나씩 잘라 내는 그림: 종이의 가로는 ${said(wl, unit)}, 세로는 ${said(hl, unit)}이고, 잘라 내는 정사각형의 한 변은 ${said(c, unit)}`,
      shape(`M${x0} ${y0}h${w}v${h}h${-w}z`, TINT) + cut(x0, y0) + cut(x0 + w - s, y0) + cut(x0, y0 + h - s) + cut(x0 + w - s, y0 + h - s)
      + `<path d="M${x0 + s} ${y0 + s}h${w - 2 * s}v${h - 2 * s}h${-(w - 2 * s)}z" style="fill:none;stroke:${INK};stroke-width:1;stroke-dasharray:2 3"/>`
      + label(x0 + w / 2, y0 + h + 19, wl, unit) + label(x0 + w + 7, y0 + h / 2 + 5, hl, unit, 'start') + label(x0 + s / 2, y0 - 8, c, unit) + label(x0 - 5, y0 + s / 2 + 5, c, '', 'end'));
  }
  // 직사각형의 윗변을 줄이고 아랫변을 늘여 만든 사다리꼴(처음 직사각형은 점선으로 남긴다)
  function stretchFig(W, Hh, less, more, unit) {
    const x0 = 44, y0 = 38, w = 124, h = 78, dx1 = 34, dx2 = 56;
    return svg(296, 158, `직사각형의 윗변을 오른쪽 끝에서 ${said(less, unit)} 줄이고 아랫변을 오른쪽으로 ${said(more, unit)} 늘여 만든 사다리꼴: 처음 직사각형은 가로 ${said(W, unit)}, 세로 ${said(Hh, unit)}이다. 사다리꼴의 높이는 직사각형의 세로와 같다`,
      shape(`M${x0} ${y0}h${w - dx1}l${dx1 + dx2} ${h}h${-(w + dx2)}z`, TINT) + `<path d="M${x0 + w - dx1} ${y0}h${dx1}v${h}" style="fill:none;stroke:${INK};stroke-width:1;stroke-dasharray:4 3"/>`
      + `<path d="M${x0 + w - dx1} ${y0 - 5}v-5h${dx1}v5" style="fill:none;stroke:${INK};stroke-width:1"/>` + label(x0 + w - dx1 / 2, y0 - 15, less, unit)
      + `<path d="M${x0 + w} ${y0 + h + 5}v5h${dx2}v-5" style="fill:none;stroke:${INK};stroke-width:1"/>` + label(x0 + w + dx2 / 2, y0 + h + 26, more, unit)
      + `<path d="M${x0} ${y0 + h + 5}v5h${w}v-5" style="fill:none;stroke:${INK};stroke-width:1"/>` + label(x0 + w / 2, y0 + h + 26, W, unit) + label(x0 - 6, y0 + h / 2 + 5, Hh, unit, 'end'));
  }

  // 일차식 [a, b] 를 「b + ax」 꼴(상수항을 앞에)로 적은 식 글
  const nlQ = (pair, v) => nl(pair[1], pair[0], v);

  B.addGroup('7-1-3', {
    id: 'hard', title: '실력 문제', standard: STD2,
    types: [
      // ── ① 문제의 식·상황·그림에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-order-odd', '곱셈과 나눗셈의 차례·괄호에 따라 달라지는 식 가리기', '심3 / 기본 ①26', (d) => {
        // 함정: a ÷ c × b에서 뒤의 곱셈을 먼저 하는 아이는 이것을 a/(bc)로 보아 다른 식이라고 고른다. 괄호 안의 나눗셈 a ÷ (c ÷ b)를 뒤집지 못하는 아이도 틀린다.
        const SAME = [['a*b:c', '[ab|c]'], ['a:c*b', '[ab|c]'], ['a*(b:c)', '[ab|c]'], ['a:(c:b)', '[ab|c]']], ODD = [['a:(c*b)', '[a|bc]'], ['a:c:b', '[a|bc]'], ['a:(b:c)', '[ac|b]']];
        const rows = d.shuffle(d.shuffle(SAME).slice(0, 3).concat([d.pick(ODD)])), truth = rows.map((r) => xsame(r[0], '[ab|c]'));
        return C('다음 식을 곱셈 기호와 나눗셈 기호를 생략하여 나타낼 때, 나머지 셋과 다른 것은?', rows.map((r) => xh(r[0])), truth.indexOf(false), {
          explain: `곱셈과 나눗셈은 앞에서부터 차례로 계산하고, 괄호가 있으면 괄호 안을 먼저 계산한다. ${rows.map((r) => `${xh(r[0])} = ${xh(r[1])}`).join(', ')}이다.`,
          facts: { truth, want: false }
        });
      }, { standard: STD1 }),
      H('hard-div-frac', '분수로 나누는 식에서 기호 생략하기', '심2 / 기본 ①22', (d, n) => {
        if (n === 0) {
          // 함정: ÷ (1/b)를 ÷ b로 계산하는 아이(a/(bc)), 나눗셈을 모두 곱셈으로 바꾸는 아이(abc)
          const [src, right, wrongs, why] = d.pick([
            ['a:[1|b]:c', '[ab|c]', ['[a|bc]', '[ac|b]', 'abc'], `${xh('a:[1|b]')} = ${xh('a*b')} = ${xh('ab')}이고, 이것을 ${V('c')}로 나누면`],
            ['a*[1|b]:c', '[a|bc]', ['[ac|b]', '[ab|c]', 'abc'], `${xh('a*[1|b]')} = ${xh('[a|b]')}이고, 이것을 ${V('c')}로 나누면`],
            ['a:b:[1|c]', '[ac|b]', ['[a|bc]', '[ab|c]', 'abc'], `${xh('a:b')} = ${xh('[a|b]')}이고, 이것을 ${xh('[1|c]')}로 나누는 것은 ${V('c')}를 곱하는 것과 같으므로`]
          ]);
          return pickX(d, OMIT, right, wrongs, { target: src, figure: xex(src), rule: 'hard-div-frac-unit', explain: `분수로 나누는 것은 그 역수를 곱하는 것과 같다. ${why} ${xh(right)}이다.` });
        }
        // 함정: (m/q)b가 한 덩어리(곱)라는 것을 놓치고 a ÷ (m/q) × b로 계산하는 아이, 역수를 취하지 않는 아이
        const q = d.pick([3, 4, 5]), m = co(d, q, 2, q - 1), v = d.pick(['b', 'x']), src = `a:[${m}|${q}]${v}`, right = `[${q}a|${m}${v}]`, av = ['a', v].sort().join('');
        return pickX(d, OMIT, right, [`[${q}${av}|${m}]`, `[${m}${av}|${q}]`, `[${m}a|${q}${v}]`], {
          target: src, figure: xex(src), rule: 'hard-div-frac-term',
          explain: `${xh(`[${m}|${q}]${v}`)}는 ${xh(`[${m}|${q}]*${v}`)}를 나타내는 한 덩어리이므로 ${xh(`[${m}${v}|${q}]`)} 전체로 나눈다. 분수로 나누는 것은 그 역수를 곱하는 것과 같으므로 ${xh(src)} = ${xh(`a*[${q}|${m}${v}]`)} = ${xh(right)}이다.`
        });
      }, { count: 2, standard: STD1 }),
      H('hard-omit-long', '괄호와 뺄셈이 있는 긴 식에서 기호 생략하기', '심1', (d) => {
        // 함정: ÷ (k × b)의 괄호를 무시하는 아이(a²b/k), ÷ a ÷ m에서 뒤의 수를 분자로 올리는 아이, (b − c)의 괄호를 무시하는 아이
        const k = d.int(2, 5), m = d.until(() => d.int(2, 5), (x) => x !== k), c = d.int(1, 6), src = `a*a:(${k}*b)-(b-${c}):a:${m}`, right = `[a^2|${k}b]-[b-${c}|${m}a]`;
        return pickX(d, OMIT, right, [`[a^2b|${k}]-[b-${c}|${m}a]`, `[a^2|${k}b]-[${m}(b-${c})|a]`, `[a^2|${k}b]-b+[${c}|${m}a]`], {
          target: src, figure: xex(src),
          explain: `${xh(`a*a:(${k}*b)`)}에서는 ${xh(`${k}*b`)} 전체로 나누므로 ${xh(`[a^2|${k}b]`)}이다. ${xh(`(b-${c}):a:${m}`)}에서는 ${xh(`b-${c}`)} 전체를 ${V('a')}와 ${m}${tail(m, '으로/로')} 차례로 나누므로 ${xh(`[b-${c}|${m}a]`)}이다. 따라서 ${xh(right)}이다.`
        });
      }, { standard: STD1 }),
      H('hard-digit-swap', '자리의 숫자를 바꾼 수와 처음 수의 합·차', '심5 / 기본 ①4', (d) => {
        // 함정: 십의 자리의 숫자가 k, 일의 자리의 숫자가 x인 수를 kx(k × x)로 적는 아이. 십의 자리의 숫자는 10배를 해야 한다.
        const k = d.int(2, 8), add = d.bool(), src = add ? `(${10 * k}+x)+(10x+${k})` : `(10x+${k})-(${10 * k}+x)`;
        return linQ(`십의 자리의 숫자가 ${k}, 일의 자리의 숫자가 ${V('x')}인 두 자리 자연수가 있다. 이 수의 십의 자리의 숫자와 일의 자리의 숫자를 서로 바꾼 수${add ? '와 처음 수의 합을' : '에서 처음 수를 뺀 식을'} ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
          explain: `처음 수는 ${xh(`${10 * k}+x`)}이고, 숫자를 바꾼 수는 십의 자리의 숫자가 ${V('x')}, 일의 자리의 숫자가 ${k}이므로 ${xh(`10x+${k}`)}이다. ${xh(src)} = ${xh(ln(add ? 11 : 9, add ? 11 * k : -9 * k))}이다.`,
          facts: { calc: [[add ? '10+1' : '10-1', 0], [add ? `10*${k}+${k}` : `${k}-10*${k}`, 1]], unseen: [1, 10] }
        });
      }, { standard: STD1 }),
      H('hard-percent-sale', '할인율이 문자인 판매 가격을 간단한 식으로 나타내기', '심6 / 기본 ①6·7', (d) => {
        // 함정: a %를 a원으로 여겨 (정가) − a로 적는 아이. a %는 a/100이고, 할인되는 금액은 정가에 a/100을 곱한 것이다.
        const P = 1000 * d.int(2, 9), src = `${P}-${P}*[a|100]`;
        return linQ(`정가가 ${P}원인 옷을 ${V('a')} % 할인하여 판다. 판매 가격을 ${V('a')}를 사용한 식으로 간단히 나타내시오.`, src, 'a', {
          unit: '원', explain: `${V('a')} %는 ${frac(V('a'), 100)}이므로 할인되는 금액은 ${xh(`${P}*[a|100]`)} = ${withUnit(`${P / 100}a`, '원')}이다. 판매 가격은 ${withUnit(nl(P, -P / 100, 'a'), '원')}, 곧 ${withUnit(ln(-P / 100, P, 'a'), '원')}이다.`,
          facts: { calc: [[`-${P}/100`, 0], [String(P), 1]], unseen: [100] }
        });
      }, { standard: STD1 }),
      H('hard-time-units', '분을 시간으로 고쳐 걸린 시간을 식으로 나타내기', '심10', (d) => {
        // 함정: 15분을 그대로 +15로 더하는 아이(단위가 다르다), 시간 = 거리 ÷ 속력을 뒤집거나 곱하는 아이
        const v = d.int(3, 6), m = d.pick([10, 15, 20, 30, 40, 45]), f = Q(m, 60), right = `[x|${v}]+[${f.p}|${f.q}]`;
        return pickX(d, `집에서 ${V('x')} km 떨어진 도서관까지 시속 ${v} km로 걸어가다가 중간에 ${m}분 동안 쉬었다. 집에서 도서관까지 가는 데 걸린 시간을 ${V('x')}를 사용한 식으로 나타낸 것은?`, right, [`[x|${v}]+${m}`, `[${v}|x]+[${f.p}|${f.q}]`, `${v}x+[${f.p}|${f.q}]`, `[x+${m}|${v}]`], {
          unit: '시간', explain: `걸어간 시간은 (거리) ÷ (속력)이므로 ${withUnit(`[x|${v}]`, '시간')}이다. 쉰 시간 ${m}분은 ${frac(m, 60)} = ${frac(f.p, f.q)}(시간)이다. 단위를 시간으로 맞추어 더하면 ${withUnit(right, '시간')}이다.`
        });
      }, { standard: STD1 }),
      H('hard-salt-mix', '두 소금물에 들어 있는 소금의 양을 식으로 나타내기', '심12 / 기본 ①8', (d) => {
        // 함정: 농도(%)를 그대로 곱하는 아이(5x + 300y), 한쪽만 100으로 나누는 아이, 소금물의 양을 곱하지 않는 아이
        const p = d.pick([4, 5, 8, 10, 20]), W = 100 * d.int(2, 5), a = Q(p, 100), right = pn([[a, 'x'], [W / 100, 'y']]);
        return pickX(d, `농도가 ${p} %인 소금물 ${V('x')} g과 농도가 ${V('y')} %인 소금물 ${W} g을 섞었다. 섞은 소금물에 들어 있는 소금의 양을 ${V('x')}, ${V('y')}를 사용한 식으로 나타낸 것은?`, right, [`${p}x+${W}y`, pn([[a, 'x'], [W, 'y']]), pn([[a, 'x'], [Q(1, 100), 'y']]), pn([[p, 'x'], [W / 100, 'y']])], {
          unit: 'g', explain: `(소금의 양) = ${frac('(농도)', 100)} × (소금물의 양)이다. 첫째 소금물의 소금은 ${xh(`[${p}|100]*x`)} = ${withUnit(pn([[a, 'x']]), 'g')}, 둘째 소금물의 소금은 ${xh(`[y|100]*${W}`)} = ${withUnit(`${W / 100}y`, 'g')}이므로 모두 ${withUnit(right, 'g')}이다.`
        });
      }, { standard: STD1 }),
      H('hard-decrease', '전체에서 뺀 나머지가 몇 % 줄어든 수', '심8', (d) => {
        // 함정: r %를 r명으로 빼는 아이, 줄어든 수만 구하는 아이, (전체 − x)에서 전체에만 비율을 곱하는 아이
        const T = 100 * d.pick([4, 5, 6, 8]), r = d.pick([5, 10, 20, 25]), keep = Q(100 - r, 100), right = [qneg(keep), qmul(keep, Q(T))];
        return pickX(d, `작년에 어느 학교의 전체 학생은 ${T}명이고 그 가운데 남학생은 ${V('x')}명이었다. 올해 여학생 수가 작년보다 ${r} % 줄었을 때, 올해 여학생 수를 ${V('x')}를 사용한 식으로 나타낸 것은?`, nlQ(right), [nlQ([Q(-1), Q(T - r)]), nlQ([Q(-r, 100), Q(T * r, 100)]), nlQ([Q(-1), right[1]]), nlQ([qneg(keep), Q(T)])], {
          unit: '명', explain: `작년 여학생 수는 ${withUnit(`${T}-x`, '명')}이다. ${r} % 줄면 작년의 ${frac(100 - r, 100)} = ${tj(keep, '이/가')} 되므로 올해 여학생 수는 ${xh(kp(keep, `${T}-x`))} = ${withUnit(nlQ(right), '명')}이다. 괄호 안의 두 항에 모두 곱한다.`
        });
      }, { standard: STD1 }),
      H('hard-mean-two-groups', '크기가 다른 두 무리의 평균으로 전체 평균을 식으로 나타내기', '심11·16 / 기본 ①13', (d, n) => {
        // 함정: 두 평균을 더해 2로 나누는 아이((a + b)/2). 사람 수(시간)가 다르면 전체의 합을 전체의 수로 나누어야 한다.
        const [m, f] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y), M2 = n === 0 ? 10 + m : m, F2 = n === 0 ? 10 + f : f, right = `[${M2}a+${F2}b|${M2 + F2}]`, wrongs = ['[a+b|2]', `[${M2}a+${F2}b|2]`, `[a+b|${M2 + F2}]`, `${M2}a+${F2}b`];
        if (n === 0) {
          return pickX(d, `어느 반에서 남학생 ${M2}명의 수학 점수의 평균은 ${V('a')}점이고 여학생 ${F2}명의 수학 점수의 평균은 ${V('b')}점이다. 이 반 전체 학생의 수학 점수의 평균을 ${V('a')}, ${V('b')}를 사용한 식으로 나타낸 것은?`, right, wrongs, {
            unit: '점', rule: 'mean-score', explain: `남학생의 점수의 합은 ${withUnit(`${M2}a`, '점')}, 여학생의 점수의 합은 ${withUnit(`${F2}b`, '점')}이다. 전체 평균은 점수의 합 ${xh(`${M2}a+${F2}b`)}를 전체 학생 수 ${M2 + F2}${tail(M2 + F2, '으로/로')} 나눈 ${withUnit(right, '점')}이다. 두 평균을 더해 2로 나눈 것과 다르다.`
          });
        }
        return pickX(d, `자동차가 시속 ${V('a')} km로 ${M2}시간 동안 달린 다음, 이어서 시속 ${V('b')} km로 ${F2}시간 동안 달렸다. 달린 거리 전체를 달린 시간 전체로 나눈 평균 속력을 ${V('a')}, ${V('b')}를 사용한 식으로 나타낸 것은?`, right, wrongs, {
          unit: 'km', lead: '시속 ', rule: 'mean-speed', explain: `달린 거리는 ${withUnit(`${M2}a`, 'km')}와 ${withUnit(`${F2}b`, 'km')}를 더한 ${withUnit(`${M2}a+${F2}b`, 'km')}이고, 달린 시간은 ${M2 + F2}시간이다. 평균 속력은 ${withUnit(right, 'km', '시속 ')}이다. 두 속력을 더해 2로 나눈 것과 다르다.`
        });
      }, { count: 2, standard: STD1 }),
      H('hard-frac-neg-rank', '음의 분수를 대입한 식의 값의 크기 비교', '심20', (d) => {
        // 함정: 1/x에 −1/3을 넣고 −1/3으로 두는 아이(나눗셈으로 고쳐야 −3), x²을 음수로, x³을 양수로 두는 아이
        const q = d.int(2, 4), env = { x: Q(-1, q) }, big = d.bool();
        const rows = d.until(() => d.shuffle(['-x', '[1|x]', '-[1|x]', 'x^2', '-x^2', 'x^3', '[1|x^2]']).slice(0, 4), (list) => list.some((r) => r.includes('|')) && list.some((r) => r.includes('^')));
        const values = rows.map((r) => fl(xv(r, env))), at = values.indexOf(big ? Math.max(...values) : Math.min(...values));
        return C(`${given(env)}일 때, 다음 중 식의 값이 가장 ${big ? '큰' : '작은'} 것은?`, rows.map(xh), at, {
          explain: `분모에 분수를 대입할 때는 나눗셈으로 고쳐 역수를 곱한다. 음수는 짝수 번 곱하면 양수, 홀수 번 곱하면 음수가 된다. ${rows.map((r) => `${xh(r)} = ${worked(r, env)}`).join(', ')}이다.`,
          facts: { rank: { values, nth: big ? 1 : 4 } }
        });
      }, { standard: STD1 }),
      H('hard-recip-given', '역수의 값으로 주어진 문자의 식의 값', '심26', (d) => {
        // 함정: 1/x = −4를 x = −4로 읽어 그대로 넣는 아이. x는 −4의 역수 −1/4이다.
        const [a, b, p] = d.until(() => [d.int(2, 5), d.int(2, 5), d.int(1, 3)], ([x, y]) => x !== y), env = { x: Q(-1, a), y: Q(1, b) }, src = `${p * a}x-xy`, v = xv(src, env);
        return ansV(`${nb(`${frac(1, V('x'))} = ${tx(Q(-a))}`)}, ${nb(`${frac(1, V('y'))} = ${b}`)}일 때, ${xh(src)}의 값은?`, v, 'frac', {
          explain: `${frac(1, V('x'))} = ${tx(Q(-a))}이면 ${V('x')}는 ${tx(Q(-a))}의 역수이므로 ${nb(`${V('x')} = ${tx(env.x)}`)}이고, 같은 방법으로 ${nb(`${V('y')} = ${tx(env.y)}`)}이다. 대입하면 ${worked(src, env)}이다.`,
          facts: { value: `${p * a}*(1/(-${a}))-(1/(-${a}))*(1/${b})` }
        });
      }, { standard: STD1 }),
      H('hard-fracform-coef', '분수 꼴로 적힌 일차식의 계수와 상수항', '심45·47 / 기본 ①45', (d, n) => {
        const q = d.int(2, 7), c = co(d, q, 1, 9), p = d.until(() => co(d, q, 1, 5), (x) => x !== c);
        if (n === 0) {
          // 함정: 분자의 계수만 보고 p라고 답하는 아이. (px − c)/q = (p/q)x − c/q이므로 x의 계수는 p/q이다.
          const minus = d.bool(), src = `[${ln(p, minus ? -c : c)}|${q}]`, v = Q(p, q);
          return ansV(`다항식 ${xh(src)}에서 ${V('x')}의 계수는?`, v, 'frac', {
            explain: `분자의 각 항을 분모로 나누면 ${xh(src)} = ${xh(ln(v, Q(minus ? -c : c, q)))}이므로 ${V('x')}의 계수는 ${tx(v)}이다.`,
            facts: { value: `${p}/${q}`, unseen: [1], rule: 'fracform-coef' }
          });
        }
        // 함정: 분수 앞의 −를 첫 항에만 붙이는 아이(상수항을 −c/q로). −는 분자 전체에 걸리므로 상수항은 +c/q이다.
        const src = `-[${ln(p, -c)}|${q}]`, v = Q(c, q);
        return ansV(`다항식 ${xh(src)}의 상수항은?`, v, 'frac', {
          explain: `분수 앞의 −는 분자 전체에 걸린다. ${xh(src)} = ${xh(`[${ln(-p, c)}|${q}]`)} = ${xh(ln(Q(-p, q), v))}이므로 상수항은 ${tx(v)}이다.`,
          facts: { value: `-(-${c})/${q}`, rule: 'fracform-const' }
        });
      }, { count: 2 }),
      H('hard-linear-count', '함정이 섞인 식에서 일차식의 개수 세기', '심35 / 기본 ①52', (d) => {
        // 함정: 문자가 보이면 일차식이라 여기는 아이(0 × x + 1, 1/x, xy + 1), 분수 꼴은 일차식이 아니라고 여기는 아이(x/4, (2 − x)/5),
        //  정리하면 이차항이 없어지는 식(x² + 3x − x²)을 이차식으로 세는 아이
        const k = d.int(2, 9), p = d.int(2, 5), q = d.int(3, 7);
        const YES = [[`[x|${q}]-${k}`, `${xh(`[x|${q}]`)} = ${xh(`[1|${q}]x`)}이므로 일차식이다`], [`[${k}-x|${q}]`, `분자의 각 항을 ${q}${tail(q, '으로/로')} 나누면 일차항 ${xh(`-[1|${q}]x`)}가 있는 일차식이다`], [`x^2+${p}x-x^2`, `정리하면 ${xh(`${p}x`)}이므로 일차식이다`], [`0.${p}x`, ''], [`-[1|2]x+[${co(d, 3, 1, 8)}|3]`, ''], [`0*x^2-${p}x+${k}`, `${xh('0*x^2')} = 0이므로 ${xh(ln(-p, k))}인 일차식이다`]];
        const NO = [[`0*x+${k}`, `${xh('0*x')} = 0이므로 상수항 ${k}뿐이다`], [`[${k}|x]-1`, '분모에 문자가 있으므로 다항식이 아니다'], [`[1|x]`, '분모에 문자가 있으므로 다항식이 아니다'], [`xy+${k}`, `${xh('xy')}의 차수가 2이다`], [`x^2-${p}x`, '차수가 2이다'], [String(k + 1), '상수항뿐이다']];
        const many = d.int(2, 4), picked = d.until(() => d.shuffle(d.shuffle(YES).slice(0, many).concat(d.shuffle(NO).slice(0, 6 - many))), (list) => list.filter((r) => r[1]).length >= 3), flags = picked.map((r) => YES.includes(r));
        return N('다음 중 일차식은 모두 몇 개인가?', many, {
          unit: '개', figure: chips(picked.map((r) => r[0])),
          explain: `일차식은 차수가 1인 다항식이다. ${picked.filter((r) => r[1]).map((r) => `${xh(r[0])}: ${r[1]}.`).join(' ')} 일차식은 ${listed(picked.filter((r, i) => flags[i]).map((r) => r[0]))}의 ${many}개이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-first-wrong', '계산 과정에서 처음으로 틀린 곳 찾기', '기본 ①81·84·89', (d, n) => {
        // 틀린 풀이를 한 줄씩 따져야 한다. 틀린 곳 뒤의 줄은 그 잘못을 그대로 이어받아 바르게 계산한 것이다(처음 틀린 곳은 하나뿐이다).
        const v = 'x', at = d.int(0, 3);
        if (n === 0) {
          // k1(ax + b) − k2(cx + e): ㉠ 첫 괄호에 한 항만 곱함 ㉡ 괄호 앞의 −를 첫 항에만 ㉢ 자리를 바꾸며 부호를 놓침 ㉣ x끼리 계산하고 x²으로 씀
          const [k1, a, b, k2, c, e] = d.until(() => [d.int(2, 5), d.int(1, 4), coef(d, -6, 6), d.int(2, 5), d.int(1, 4), coef(d, -6, 6)], (t) => {
            const A = [t[0] * t[1] - t[3] * t[4], t[0] * t[1] + t[3] * t[4]], Bs = [t[0] * t[2] - t[3] * t[5], t[2] - t[3] * t[5], t[0] * t[2] + t[3] * t[5]];
            return A.every((x) => x !== 0) && Bs.every((x) => x !== 0) && t[0] !== t[3] && Math.abs(t[2]) !== Math.abs(t[5]) && t[1] !== t[4];
          });
          const src = `${kp(k1, ln(a, b, v))}-${kp(k2, ln(c, e, v))}`;
          const t1 = [[k1 * a, v], [(at === 0 ? 1 : k1) * b, '']], t2 = t1.concat([[-k2 * c, v], [(at === 1 ? 1 : -1) * k2 * e, '']]), t3 = [t2[0], [(at === 2 ? -1 : 1) * t2[2][0], v], t2[1], t2[3]];
          const A = t3[0][0] + t3[1][0], Bc = t3[2][0] + t3[3][0], steps = [`${pn(t1)}-${kp(k2, ln(c, e, v))}`, pn(t2), pn(t3), at === 3 ? pn([[A, 'x^2'], [Bc, '']]) : ln(A, Bc, v)];
          const first = steps.findIndex((s) => !xsame(s, src));
          if (first !== at) throw new Error('처음 틀린 곳이 정한 곳과 다르다');
          const why = [`수 ${k1}${tail(k1, '을/를')} 괄호 안의 모든 항에 곱해야 한다. ${xh(kp(k1, ln(a, b, v)))} = ${xh(ln(k1 * a, k1 * b, v))}이다.`, `괄호 앞의 ${tx(Q(-k2))}${tail(k2, '을/를')} 괄호 안의 모든 항에 곱해야 한다. ${xh(`-${kp(k2, ln(c, e, v))}`)} = ${xh(ln(-k2 * c, -k2 * e, v))}이다.`, `항의 자리를 바꿀 때는 항 앞의 부호도 함께 옮긴다. ${xh(pn([[-k2 * c, v]]))}의 부호가 바뀌었다.`, `동류항끼리 계산할 때는 계수끼리 계산하고 문자는 그대로 둔다. ${xh(pn([[k1 * a, v], [-k2 * c, v]]))} = ${xh(pn([[k1 * a - k2 * c, v]]))}이다.`][at];
          return C('다음 계산 과정에서 처음으로 틀린 곳은?', LAB.slice(0, 4), at, {
            figure: proc([{ h: xe(src) }].concat(steps.map((s, i) => ({ h: xe(s), mark: LAB[i] })))),
            explain: `${why} 바르게 계산하면 ${xh(src)} = ${xh(ln(k1 * a - k2 * c, k1 * b - k2 * e, v))}이다.`,
            facts: { truth: steps.map((s, i) => i === first), want: true, rule: 'first-wrong-paren' }
          });
        }
        // (ax + b)/q1 − (cx + e)/q2: ㉠ 통분하며 분자에 수를 곱하지 않음 ㉡ 분수 앞의 −를 첫 항에만 ㉢ x의 계수를 더함 ㉣ 분모로 한 항만 나눔
        const [q1, a, b, q2, c, e] = d.until(() => [d.pick([2, 3, 4]), d.int(1, 5), coef(d, -5, 5), d.pick([2, 3, 6]), d.int(1, 5), coef(d, -5, 5)], (t) => {
          if (t[0] === t[3] || lcm(t[0], t[3]) > 12) return false;
          const L0 = lcm(t[0], t[3]), m1 = L0 / t[0], m2 = L0 / t[3];
          const As = [m1 * t[1] - m2 * t[4], t[1] - t[4], m1 * t[1] + m2 * t[4]], Bs = [m1 * t[2] - m2 * t[5], t[2] - t[5], m1 * t[2] + m2 * t[5]];
          return As.every((x) => x !== 0) && Bs.every((x) => x !== 0) && m1 !== 1 && Math.abs(Bs[0]) % L0 !== 0;
        });
        const L = lcm(q1, q2), m1 = at === 0 ? 1 : L / q1, m2 = at === 0 ? 1 : L / q2, src = `[${ln(a, b, v)}|${q1}]-[${ln(c, e, v)}|${q2}]`;
        const u = [[m1 * a, v], [m1 * b, ''], [-m2 * c, v], [(at === 1 ? 1 : -1) * m2 * e, '']], A = u[0][0] + (at === 2 ? -1 : 1) * u[2][0], Bc = u[1][0] + u[3][0];
        const steps = [`[${kp(m1, ln(a, b, v))}-${kp(m2, ln(c, e, v))}|${L}]`, `[${pn(u)}|${L}]`, `[${ln(A, Bc, v)}|${L}]`, at === 3 ? ln(Q(A, L), Bc, v) : ln(Q(A, L), Q(Bc, L), v)];
        const first = steps.findIndex((s) => !xsame(s, src)), R = L / q1, S = L / q2;
        if (first !== at) throw new Error('처음 틀린 곳이 정한 곳과 다르다');
        const why = [`분모를 ${L}${tail(L, '으로/로')} 통분할 때 분자에도 같은 수를 곱해야 한다. 분자는 ${xh(`${kp(R, ln(a, b, v))}-${kp(S, ln(c, e, v))}`)}이다.`, `분수 앞의 −는 분자 전체에 걸린다. ${xh(`-${kp(S, ln(c, e, v))}`)} = ${xh(ln(-S * c, -S * e, v))}이다.`, `${xh(pn([[R * a, v], [-S * c, v]]))} = ${xh(pn([[R * a - S * c, v]]))}이다. 뒤의 항은 빼야 한다.`, `분자의 모든 항을 분모 ${L}${tail(L, '으로/로')} 나누어야 한다.`][at];
        const right = [Q(R * a - S * c, L), Q(R * b - S * e, L)];
        return C('다음 계산 과정에서 처음으로 틀린 곳은?', LAB.slice(0, 4), at, {
          figure: proc([{ h: xe(src) }].concat(steps.map((s, i) => ({ h: xe(s), mark: LAB[i] })))),
          explain: `${why} 바르게 계산하면 ${xh(src)} = ${xh(`[${ln(R * a - S * c, R * b - S * e, v)}|${L}]`)} = ${xh(lnQ(right, v))}이다.`,
          facts: { truth: steps.map((s, i) => i === first), want: true, rule: 'first-wrong-frac' }
        });
      }, { count: 2 }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-wrong-add', '더할 것을 빼거나 뺄 것을 더한 계산 바로잡기', '심50 / 기본 ①92·93', (d, n) => {
        // 단계: 잘못 계산한 결과에서 거꾸로 셈해 어떤 식을 구한다 → 바르게 계산한다. 어떤 식을 구한 데서 멈추면 틀린다.
        const v = 'x', [p, q, r, s] = d.until(() => [coef(d, -6, 6), coef(d, -9, 9), coef(d, -6, 6), coef(d, -9, 9)], (t) => [t[2] - 2 * t[0], t[2] + 2 * t[0], 2 * t[0] - t[2], t[2] - t[0], t[2] + t[0], t[0] - t[2]].every((x) => x !== 0) && [t[3] - 2 * t[1], t[3] + 2 * t[1], 2 * t[1] - t[3], t[3] - t[1], t[3] + t[1], t[1] - t[3]].every((x) => x !== 0));
        if (n === 0) {
          const added = d.bool(), some = added ? [r - p, s - q] : [r + p, s + q], src = added ? `(${ln(r, s, v)})-(${ln(p, q, v)})-(${ln(p, q, v)})` : `(${ln(r, s, v)})+(${ln(p, q, v)})+(${ln(p, q, v)})`;
          return linQ(`어떤 식${added ? `에서 ${lj(p, q, v, '을/를')} 빼야 할 것을 잘못하여 더했더니` : `에 ${lj(p, q, v, '을/를')} 더해야 할 것을 잘못하여 뺐더니`} ${lj(r, s, v, '이/가')} 되었다. 바르게 계산한 식을 구하시오.`, src, v, {
            explain: `어떤 식${added ? '에' : '에서'} ${lj(p, q, v, '을/를')} ${added ? '더하여' : '빼어'} ${lj(r, s, v, '이/가')} 되었으므로 어떤 식은 ${xh(`(${ln(r, s, v)})${added ? '-' : '+'}(${ln(p, q, v)})`)} = ${xh(ln(some[0], some[1], v))}이다. 바르게 계산하면 ${xh(`(${ln(some[0], some[1], v)})${added ? '-' : '+'}(${ln(p, q, v)})`)} = ${xh(ln(added ? r - 2 * p : r + 2 * p, added ? s - 2 * q : s + 2 * q, v))}이다.`,
            facts: { calc: [[`${signedJs(r)}${added ? '-' : '+'}${signedJs(p)}${added ? '-' : '+'}${signedJs(p)}`, 0], [`${signedJs(s)}${added ? '-' : '+'}${signedJs(q)}${added ? '-' : '+'}${signedJs(q)}`, 1]], unseen: [1], rule: 'wrong-add-known' }
          });
        }
        // 모르는 쪽이 더하는 식: P에 어떤 식을 더해야 할 것을 뺐더니 R → 어떤 식 = P − R, 바른 식 = P + (P − R)
        const src = `(${ln(p, q, v)})+{(${ln(p, q, v)})-(${ln(r, s, v)})}`;
        return linQ(`${xh(ln(p, q, v))}에 어떤 식을 더해야 할 것을 잘못하여 뺐더니 ${lj(r, s, v, '이/가')} 되었다. 바르게 계산한 식을 구하시오.`, src, v, {
          explain: `${xh(ln(p, q, v))}에서 어떤 식을 빼어 ${lj(r, s, v, '이/가')} 되었으므로 어떤 식은 ${xh(`(${ln(p, q, v)})-(${ln(r, s, v)})`)} = ${xh(ln(p - r, q - s, v))}이다. 바르게 계산하면 ${xh(`(${ln(p, q, v)})+(${ln(p - r, q - s, v)})`)} = ${xh(ln(2 * p - r, 2 * q - s, v))}이다.`,
          facts: { calc: [[`${signedJs(p)}+${signedJs(p)}-${signedJs(r)}`, 0], [`${signedJs(q)}+${signedJs(q)}-${signedJs(s)}`, 1]], unseen: [1], rule: 'wrong-add-unknown' }
        });
      }, { count: 2 }),
      H('hard-wrong-mul', '나눌 것을 곱하거나 곱할 것을 나눈 계산 바로잡기', '기본 ①95 / 심39', (d) => {
        // 단계: 잘못 계산한 결과에서 거꾸로 셈해 어떤 식을 구한다 → 바르게 계산한다.
        const v = 'x', [r, s] = d.until(() => [coef(d, -4, 4), coef(d, -5, 5)], ([x, y]) => Math.abs(x) !== Math.abs(y)), byFrac = d.bool(), k = d.int(2, 3), sg = pm(d), f = byFrac ? Q(sg, k) : Q(sg * k);
        // 분수로 나눌 것을 곱함: 어떤 식 = R ÷ f, 바른 식 = R ÷ f ÷ f / 정수를 곱할 것을 나눔: 어떤 식 = R × f, 바른 식 = R × f × f
        const src = byFrac ? `(${ln(r, s, v)}):${sn(f)}:${sn(f)}` : `(${ln(r, s, v)})*${sn(f)}*${sn(f)}`, some = byFrac ? [r * sg * k, s * sg * k] : [r * sg * k, s * sg * k];
        return linQ(`어떤 식${byFrac ? `을 ${tj(f, '으로/로')} 나누어야 할 것을 잘못하여 곱했더니` : `에 ${tj(f, '을/를')} 곱해야 할 것을 잘못하여 ${tj(f, '으로/로')} 나누었더니`} ${lj(r, s, v, '이/가')} 되었다. 바르게 계산한 식을 구하시오.`, src, v, {
          explain: `어떤 식${byFrac ? `에 ${tj(f, '을/를')} 곱하여` : `을 ${tj(f, '으로/로')} 나누어`} ${lj(r, s, v, '이/가')} 되었으므로 어떤 식은 ${xh(byFrac ? `(${ln(r, s, v)}):${sn(f)}` : `(${ln(r, s, v)})*${sn(f)}`)} = ${xh(ln(some[0], some[1], v))}이다. 바르게 계산하면 ${xh(byFrac ? `(${ln(some[0], some[1], v)}):${sn(f)}` : `(${ln(some[0], some[1], v)})*${sn(f)}`)} = ${xh(ln(r * k * k, s * k * k, v))}이다.`,
          facts: { calc: [[`${signedJs(r)}*${k}*${k}`, 0], [`${signedJs(s)}*${k}*${k}`, 1]], unseen: [1] }
        });
      }),
      H('hard-two-conds', '조건 둘로 두 식을 구해 더하거나 빼기', '심51 / 기본 ①96', (d) => {
        // 단계: 조건마다 거꾸로 셈해 A, B를 구한다 → 두 식을 더하거나 뺀다(뺄 때는 괄호).
        const v = 'x', A = V('A'), Bv = V('B'), minus = d.bool();
        const [p, q, r, s, p2, q2, r2, s2] = d.until(() => Array.from({ length: 8 }, (_, i) => coef(d, i % 2 ? -8 : -5, i % 2 ? 8 : 5)), (t) => { const a = [t[2] - t[0], t[3] - t[1]], b = [t[6] + t[4], t[7] + t[5]]; return a.every((x) => x !== 0) && b.every((x) => x !== 0) && (minus ? a[0] - b[0] !== 0 && a[1] - b[1] !== 0 : a[0] + b[0] !== 0 && a[1] + b[1] !== 0) && a[0] !== b[0]; });
        const a = [r - p, s - q], b = [r2 + p2, s2 + q2], src = `(${ln(a[0], a[1], v)})${minus ? '-' : '+'}(${ln(b[0], b[1], v)})`;
        return linQ(`두 식 ${A}, ${Bv}가 다음 조건을 만족시킬 때, ${nb(`${A} ${minus ? MINUS : '+'} ${Bv}`)}를 계산하시오.`, src, v, {
          figure: tagged([`${A}에 ${lj(p, q, v, '을/를')} 더하면 ${lj(r, s, v, '이/가')} 된다.`, `${Bv}에서 ${lj(p2, q2, v, '을/를')} 빼면 ${lj(r2, s2, v, '이/가')} 된다.`], ['(가)', '(나)']),
          explain: `(가)에서 ${A} = ${xh(`(${ln(r, s, v)})-(${ln(p, q, v)})`)} = ${xh(ln(a[0], a[1], v))}, (나)에서 ${Bv} = ${xh(`(${ln(r2, s2, v)})+(${ln(p2, q2, v)})`)} = ${xh(ln(b[0], b[1], v))}이다. ${nb(`${A} ${minus ? MINUS : '+'} ${Bv}`)} = ${xh(src)} = ${xh(ln(minus ? a[0] - b[0] : a[0] + b[0], minus ? a[1] - b[1] : a[1] + b[1], v))}이다.`,
          facts: { calc: [[`${signedJs(r)}-${signedJs(p)}${minus ? '-' : '+'}(${signedJs(r2)}+${signedJs(p2)})`, 0], [`${signedJs(s)}-${signedJs(q)}${minus ? '-' : '+'}(${signedJs(s2)}+${signedJs(q2)})`, 1]], unseen: [1] }
        });
      }),
      H('hard-subst-simplify', '문자로 된 식을 먼저 정리한 다음 일차식 대입하기', '심43 / 기본 ①97', (d) => {
        // 단계: A, B에 대한 식을 먼저 간단히 한다(분배법칙, 동류항) → 일차식을 대입한다 → 정리한다.
        const v = 'x', A = V('A'), Bv = V('B'), [a, b, c, e, k, m] = d.until(() => [coef(d, -4, 4), coef(d, -6, 6), coef(d, -4, 4), coef(d, -6, 6), d.int(2, 4), d.int(2, 4)], (t) => t[4] !== t[5] && t[5] !== 1 && (t[5] - 1) * t[0] + (t[4] - t[5]) * t[2] !== 0 && (t[5] - 1) * t[1] + (t[4] - t[5]) * t[3] !== 0 && t[0] !== t[2]);
        const src = `-(${ln(a, b, v)})+${kp(k, ln(c, e, v))}+${m}{(${ln(a, b, v)})-(${ln(c, e, v)})}`, kA = m - 1, kB = k - m, tidy = `${kA === 1 ? '' : kA}${A} ${kB < 0 ? MINUS : '+'} ${Math.abs(kB) === 1 ? '' : Math.abs(kB)}${Bv}`;
        const asked = nb(`${MINUS}${A} + ${k}${Bv} + ${m}(${A} ${MINUS} ${Bv})`);
        return linQ(`${nb(`${A} = ${htmlX(X(ln(a, b, v)))}`)}, ${nb(`${Bv} = ${htmlX(X(ln(c, e, v)))}`)}일 때, ${asked}를 계산하시오.`, src, v, {
          explain: `먼저 식을 간단히 하면 ${asked} = ${nb(`${MINUS}${A} + ${k}${Bv} + ${m}${A} ${MINUS} ${m}${Bv}`)} = ${nb(tidy)}이다. 여기에 식을 대입하면 ${xh(`${kp(kA, ln(a, b, v))}${kB < 0 ? '-' : '+'}${kp(Math.abs(kB), ln(c, e, v))}`)} = ${xh(ln(kA * a + kB * c, kA * b + kB * e, v))}이다.`,
          facts: { calc: [[`(${m}-1)*${signedJs(a)}+(${k}-${m})*${signedJs(c)}`, 0], [`(${m}-1)*${signedJs(b)}+(${k}-${m})*${signedJs(e)}`, 1]], unseen: [1] }
        });
      }),
      H('hard-magic', '가로·세로·대각선의 합이 같은 표에서 빈칸의 식', '심53 / 기본 ①98', (d) => {
        // 단계: 세 칸이 모두 채워진 대각선으로 합을 구한다 → 아랫줄의 빈칸을 구한다 → 다른 대각선으로 ㉠을 구한다.
        // 표는 가운데 칸 m 과 두 식 p, q 로 짓는다: [m − p, m + p + q, m − q] / [m + p − q, m, m − p + q] / [m + q, m − p − q, m + p]
        const v = 'x', add = (x, y) => [x[0] + y[0], x[1] + y[1]], sub = (x, y) => [x[0] - y[0], x[1] - y[1]];
        const [m, p, q] = d.until(() => [[d.int(1, 3), nz(d, -4, 4)], [nz(d, -2, 2), nz(d, -3, 3)], [nz(d, -2, 2), nz(d, -3, 3)]], ([m0, p0, q0]) => {
          const cells = [sub(m0, p0), sub(m0, q0), m0, add(m0, q0), sub(sub(m0, p0), q0), add(m0, p0)];
          return cells.every((c0) => c0[0] !== 0 && c0[1] !== 0) && (p0[0] !== q0[0] || p0[1] !== q0[1]) && (p0[0] !== -q0[0] || p0[1] !== -q0[1]);
        });
        const TL = sub(m, p), TR = sub(m, q), BL = add(m, q), BM = sub(sub(m, p), q), BR = add(m, p), S = [3 * m[0], 3 * m[1]], f = (c0) => ln(c0[0], c0[1], v);
        const src = `(${f(BL)})+(${f(BM)})-(${f(m)})`;
        return linQ('다음 표에서 가로, 세로, 대각선에 있는 세 식의 합이 모두 같을 때, ㉠에 알맞은 식을 구하시오.', src, v, {
          figure: gridFig([[LAB[0], '', f(TR)], ['', f(m), ''], [f(BL), f(BM), '']]),
          explain: `세 칸이 모두 채워진 대각선에서 세 식의 합은 ${xh(`(${f(TR)})+(${f(m)})+(${f(BL)})`)} = ${xh(f(S))}이다. 셋째 줄의 오른쪽 칸은 ${xh(`(${f(S)})-(${f(BL)})-(${f(BM)})`)} = ${xh(f(BR))}이다. ㉠이 있는 대각선에서 ㉠ = ${xh(`(${f(S)})-(${f(m)})-(${f(BR)})`)} = ${xh(f(TL))}이다.`,
          facts: { calc: [[`${signedJs(BL[0])}+${signedJs(BM[0])}-${signedJs(m[0])}`, 0], [`${signedJs(BL[1])}+${signedJs(BM[1])}-${signedJs(m[1])}`, 1]], unseen: [1] }
        });
      }),
      H('hard-pyramid-back', '위 칸이 아래 두 칸의 합인 그림을 거꾸로 채워 맨 위 칸의 식 구하기', '심54 / 기본 ①99', (d) => {
        // 단계: 가운데 층의 식에서 아래 칸의 식을 빼어 빈칸을 구한다 → 가운데 층의 다른 칸을 구한다 → 맨 위 칸을 구한다.
        const v = 'x', [b1, b2, b3] = d.until(() => [[coef(d, -4, 4), coef(d, -5, 5)], [coef(d, -4, 4), coef(d, -5, 5)], [coef(d, -4, 4), coef(d, -5, 5)]], (t) => [0, 1].every((i) => t[0][i] + t[1][i] !== 0 && t[1][i] + t[2][i] !== 0 && t[0][i] + 2 * t[1][i] + t[2][i] !== 0) && t[0][0] !== t[2][0]);
        const m1 = [b1[0] + b2[0], b1[1] + b2[1]], m2 = [b2[0] + b3[0], b2[1] + b3[1]], top = [m1[0] + m2[0], m1[1] + m2[1]], f = (c0) => ln(c0[0], c0[1], v), src = `(${f(m1)})+(${f(m1)})-(${f(b1)})+(${f(b3)})`;
        return linQ('위 칸의 식은 바로 아래 두 칸에 적힌 식의 합이다. 빈칸을 차례로 채워 맨 위 칸 ㉠에 알맞은 식을 구하시오.', src, v, {
          figure: pyrFig([f(b1), '', f(b3)], [f(m1), ''], LAB[0]),
          explain: `맨 아래 층의 가운데 칸은 ${xh(`(${f(m1)})-(${f(b1)})`)} = ${xh(f(b2))}이다. 가운데 층의 오른쪽 칸은 ${xh(`(${f(b2)})+(${f(b3)})`)} = ${xh(f(m2))}이다. ㉠ = ${xh(`(${f(m1)})+(${f(m2)})`)} = ${xh(f(top))}이다.`,
          facts: { calc: [[`${signedJs(m1[0])}+${signedJs(m1[0])}-${signedJs(b1[0])}+${signedJs(b3[0])}`, 0], [`${signedJs(m1[1])}+${signedJs(m1[1])}-${signedJs(b1[1])}+${signedJs(b3[1])}`, 1]], unseen: [1] }
        });
      }),
      H('hard-parity', '−1의 거듭제곱이 곱해진 두 일차식의 계산', '심55', (d) => {
        // 단계: n과 n + 1의 홀짝이 엇갈린다는 것으로 두 거듭제곱의 값을 정한다 → 부호를 곱해 괄호를 푼다 → 동류항끼리 모은다.
        const v = 'x', nn = V('n'), odd = d.bool(), [a, b, c, e] = d.until(() => [d.int(2, 6), coef(d, -6, 6), coef(d, -5, 5), coef(d, -7, 7)], (t) => t[0] + t[2] !== 0 && t[1] + t[3] !== 0 && Math.abs(t[0]) !== Math.abs(t[2]));
        const s1 = odd ? -1 : 1, s2 = -s1, A = s1 * a - s2 * c, Bc = s1 * b - s2 * e, src = `${sn(s1)}*(${ln(a, b, v)})-${sn(s2)}*(${ln(c, e, v)})`;
        return linQ(`${nn}이 ${odd ? '홀수' : '짝수'}일 때, 다음 식을 계산하시오.`, src, v, {
          // 한 줄에 다 적으면 휴대폰 너비를 넘으므로 뺄셈 기호 앞에서 줄을 바꾸어 두 줄로 적는다.
          figure: `<span class="mb-expr" style="font-size:1.2rem;line-height:1.9">(${MINUS}1)${sup(nn)} <i>×</i> (${xe(ln(a, b, v))})<br><i>${MINUS}</i> (${MINUS}1)${sup(nn + ' + 1')} <i>×</i> (${xe(ln(c, e, v))})</span>`,
          explain: `${nn}이 ${odd ? '홀수' : '짝수'}이면 ${nn} + 1은 ${odd ? '짝수' : '홀수'}이므로 (−1)${sup(nn)} = ${tx(Q(s1))}, (−1)${sup(nn + ' + 1')} = ${tx(Q(s2))}이다. 주어진 식은 ${xh(src)} = ${xh(pn([[s1 * a, v], [s1 * b, ''], [-s2 * c, v], [-s2 * e, '']]))} = ${xh(ln(A, Bc, v))}이다.`,
          facts: { calc: [[`${signedJs(s1)}*${a}-${signedJs(s2)}*${signedJs(c)}`, 0], [`${signedJs(s1)}*${signedJs(b)}-${signedJs(s2)}*${signedJs(e)}`, 1]] }
        });
      }),
      H('hard-stretch-area', '변을 늘이고 줄여 만든 사다리꼴의 넓이', '심56', (d) => {
        // 단계: 윗변과 아랫변의 길이를 식으로 나타낸다 → 사다리꼴의 넓이 공식에 넣는다 → 괄호를 풀어 간단히 한다.
        const W = d.int(5, 9), Hh = 2 * d.int(2, 4), k = d.pick([2, 3]), src = `[1|2]{(${W}-x)+(${W}+${k}x)}*${Hh}`;
        return linQ(`그림과 같이 가로의 길이가 ${W} cm, 세로의 길이가 ${Hh} cm인 직사각형에서 윗변의 길이를 ${V('x')} cm 줄이고 아랫변의 길이를 ${nb(`${k}${V('x')}`)} cm 늘여 사다리꼴을 만들었다. 이 사다리꼴의 넓이를 ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
          unit: `cm${sup(2)}`, figure: stretchFig(String(W), String(Hh), 'x', `${k}x`, 'cm'),
          explain: `사다리꼴의 윗변의 길이는 ${withUnit(`${W}-x`, 'cm')}, 아랫변의 길이는 ${withUnit(`${W}+${k}x`, 'cm')}, 높이는 ${Hh} cm이다. 넓이는 ${xh(src)} = ${xh(kp(Hh / 2, ln(k - 1, 2 * W)))} = ${xh(ln(Hh / 2 * (k - 1), W * Hh))}이다.`,
          facts: { calc: [[`${Hh}*(${k}-1)/2`, 0], [`${W}*${Hh}`, 1]], unseen: [1, 2] }
        });
      }),
      H('hard-shrink-perimeter', '두 변을 줄여 만든 직사각형의 둘레의 길이', '심57', (d) => {
        // 함정·단계: 줄인 길이가 식 (px − c)이면 괄호째 빼야 한다. S − (px − c)를 S − px − c로 적는 아이는 상수항이 틀린다.
        const S = d.int(10, 20), p = d.int(2, 3), c = d.int(1, 5), src = `2{(${S}-x)+(${S}-(${p}x-${c}))}`;
        return linQ(`한 변의 길이가 ${S} cm인 정사각형의 가로의 길이를 ${V('x')} cm, 세로의 길이를 ${withUnit(`${p}x-${c}`, 'cm')} 줄여 직사각형을 만들었다. 이 직사각형의 둘레의 길이를 ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
          unit: 'cm', explain: `직사각형의 가로의 길이는 ${withUnit(`${S}-x`, 'cm')}이고, 세로의 길이는 ${xh(`${S}-(${p}x-${c})`)} = ${withUnit(nl(S + c, -p), 'cm')}이다. 둘레의 길이는 ${xh(`2{(${S}-x)+(${nl(S + c, -p)})}`)} = ${xh(kp(2, nl(2 * S + c, -(p + 1))))} = ${xh(ln(-2 * (p + 1), 2 * (2 * S + c)))}이다.`,
          facts: { calc: [[`-2*(1+${p})`, 0], [`2*(${S}+${S}+${c})`, 1]], unseen: [1, 2] }
        });
      }),
      H('hard-overlap', '겹치게 이어 붙인 띠의 길이', '심60·61', (d, n) => {
        // 함정·단계: 겹친 곳은 종이의 수보다 하나 적다. 종이 길이의 합에서 겹친 길이를 겹친 곳의 수만큼 뺀다.
        if (n === 0) {
          const a = d.int(8, 15), k = d.until(() => d.int(6, 12), (x) => x !== a), src = `${a}*${k}-(${k}-1)*x`;
          return linQ(`그림과 같이 가로의 길이가 ${a} cm인 종이 ${k}장을 ${V('x')} cm씩 겹치게 한 줄로 이어 붙여 띠를 만들었다. 띠 전체의 가로의 길이를 ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
            unit: 'cm', figure: tapeFig([String(a), 'cm'], ['x', 'cm']),
            explain: `종이 ${k}장의 가로의 길이의 합은 ${a} × ${k} = ${a * k} (cm)이다. 겹친 곳은 ${k} − 1 = ${k - 1}(곳)이므로 겹친 길이의 합은 ${withUnit(`${k - 1}x`, 'cm')}이다. 띠 전체의 가로의 길이는 ${withUnit(nl(a * k, -(k - 1)), 'cm')}, 곧 ${withUnit(ln(-(k - 1), a * k), 'cm')}이다.`,
            facts: { calc: [[`-(${k}-1)`, 0], [`${a}*${k}`, 1]], unseen: [1], rule: 'overlap-fixed-count' }
          });
        }
        const a = d.int(8, 15), c = d.int(2, 4), src = `${a}x-${c}(x-1)`;
        return linQ(`그림과 같이 가로의 길이가 ${a} cm인 종이 ${V('x')}장을 ${c} cm씩 겹치게 한 줄로 이어 붙여 띠를 만들었다. 띠 전체의 가로의 길이를 ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
          unit: 'cm', figure: tapeFig([String(a), 'cm'], [String(c), 'cm']),
          explain: `종이 ${V('x')}장의 가로의 길이의 합은 ${withUnit(`${a}x`, 'cm')}이다. 겹친 곳은 ${xh('x-1')}(곳)이므로 겹친 길이의 합은 ${withUnit(`${c}(x-1)`, 'cm')}이다. 띠 전체의 가로의 길이는 ${xh(src)} = ${xh(pn([[a, 'x'], [-c, 'x'], [c, '']]))} = ${xh(ln(a - c, c))}이다.`,
          facts: { calc: [[`${a}-${c}`, 0], [String(c), 1]], rule: 'overlap-letter-count' }
        });
      }, { count: 2 }),
      H('hard-stones', '바둑돌을 놓는 규칙을 식으로 나타내기', '심62·65', (d, n) => {
        const nn = 'n';
        if (n === 0) {
          // 함정·단계: 꼭짓점에 놓인 바둑돌은 두 변에 함께 놓이므로 (변의 수) × n에서 꼭짓점의 수만큼 뺀다.
          const sides = d.pick([3, 4]), name = sides === 4 ? '정사각형' : '정삼각형', src = `${sides}n-${sides}`;
          return linQ(`그림은 바둑돌을 한 변에 5개씩 놓아 속이 빈 ${name} 모양을 만든 것이다. 같은 방법으로 한 변에 ${V(nn)}개씩 놓아 속이 빈 ${name} 모양을 만들 때, 필요한 바둑돌의 개수를 ${vj(nn, '을/를')} 사용한 식으로 나타내시오.`, src, nn, {
            unit: '개', figure: ringFig(sides, 5),
            explain: `한 변에 ${V(nn)}개씩 ${sides}개의 변에 놓으면 ${xh(`${sides}n`)}개이다. 꼭짓점에 놓인 바둑돌 ${sides}개는 두 변에 함께 놓여 두 번씩 세었으므로 ${sides}개를 빼면 ${withUnit(src, '개')}이다. 한 변에 5개씩 놓으면 ${sides} × 5 − ${sides} = ${sides * 5 - sides}(개)이다.`,
            facts: { calc: [[String(sides), 0], [`-${sides}`, 1]], unseen: [3, 4], rule: 'stones-ring' }
          });
        }
        // 단계: 단계가 하나 올라갈 때마다 늘어나는 수와 그대로인 수를 찾는다 → n단계의 식으로 나타낸다.
        const t = d.pick([2, 3]), f = d.int(1, t), src = `${t}n+${f}`;
        return linQ(`그림과 같이 단계마다 바둑돌을 일정한 규칙으로 놓을 때, ${V(nn)}단계에 놓인 바둑돌의 개수를 ${vj(nn, '을/를')} 사용한 식으로 나타내시오.`, src, nn, {
          unit: '개', figure: stageFig(t, f),
          explain: `왼쪽 줄의 검은 돌 ${f}개는 단계가 바뀌어도 그대로이고, 흰 돌은 한 단계 올라갈 때마다 ${t}개씩 늘어난다. ${V(nn)}단계의 흰 돌은 ${xh(`${t}n`)}개이므로 바둑돌은 모두 ${withUnit(src, '개')}이다.`,
          facts: { calc: [[String(t), 0], [String(f), 1]], rule: 'stones-stage' }
        });
      }, { count: 2, standard: STD1 }),
      H('hard-matches', '성냥개비로 이어 붙인 도형의 규칙', '심63·64', (d, n) => {
        // 함정·단계: 이웃한 두 도형은 성냥개비 한 개를 함께 쓴다. 첫 도형의 개수에 (도형의 수 − 1)번 늘어나는 수를 더한다.
        const sides = d.pick([3, 4]), name = sides === 3 ? '정삼각형' : '정사각형', nn = 'n', src = `${sides}+${sides - 1}(n-1)`;
        if (n === 0) {
          return linQ(`그림과 같이 성냥개비로 ${name}을 한 줄로 이어 붙여 만든다. ${name} ${V(nn)}개를 만드는 데 필요한 성냥개비의 개수를 ${vj(nn, '을/를')} 사용한 식으로 간단히 나타내시오.`, src, nn, {
            unit: '개', figure: matchFig(sides),
            explain: `첫 ${name}에는 성냥개비 ${sides}개가 필요하고, ${name}이 하나 늘어날 때마다 ${sides - 1}개씩 더 필요하다. ${name} ${V(nn)}개에는 ${xh(src)} = ${xh(pn([[sides, ''], [sides - 1, 'n'], [-(sides - 1), '']]))} = ${withUnit(ln(sides - 1, 1, 'n'), '개')}가 필요하다.`,
            facts: { calc: [[`${sides}-1`, 0], [`${sides}-(${sides}-1)`, 1]], unseen: [1, 3, 4], rule: 'matches-expr' }
          });
        }
        const k = d.int(12, 30), v = sides + (sides - 1) * (k - 1);
        return N(`그림과 같이 성냥개비로 ${name}을 한 줄로 이어 붙여 만든다. ${name} ${k}개를 만드는 데 필요한 성냥개비는 모두 몇 개인가?`, v, {
          unit: '개', figure: matchFig(sides),
          explain: `${name} ${V(nn)}개를 만드는 데 필요한 성냥개비는 ${xh(src)} = ${withUnit(ln(sides - 1, 1, 'n'), '개')}이다. ${nb(`${V(nn)} = ${k}`)}${tail(k, '을/를')} 대입하면 ${sides - 1} × ${k} + 1 = ${v}(개)이다.`,
          facts: { value: `${sides}+(${sides}-1)*(${k}-1)`, unseen: [1, 3, 4], rule: 'matches-value' }
        });
      }, { count: 2, standard: STD1 }),
      H('hard-coins', '나머지의 개수를 식으로 두고 전체 금액 나타내기', '심13', (d) => {
        // 함정·단계: 100원짜리 동전의 개수는 (전체 − x)개이다. 이것을 식으로 두고 금액을 더한 다음 괄호를 풀어 정리한다.
        const [big, small] = d.pick([[500, 100], [500, 50], [100, 50], [100, 10]]), total = d.int(12, 40), src = `${big}x+${small}(${total}-x)`;
        return linQ(`${big}원짜리 동전과 ${small}원짜리 동전이 모두 ${total}개 있다. ${big}원짜리 동전이 ${V('x')}개일 때, 동전 전체의 금액을 ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
          unit: '원', explain: `${small}원짜리 동전은 ${withUnit(`${total}-x`, '개')}이다. 전체 금액은 ${xh(src)} = ${xh(pn([[big, 'x'], [small * total, ''], [-small, 'x']]))} = ${xh(ln(big - small, small * total))}이다.`,
          facts: { calc: [[`${big}-${small}`, 0], [`${small}*${total}`, 1]] }
        });
      }),
      H('hard-fee', '정해진 시간을 넘은 만큼만 더 내는 요금', '심14', (d) => {
        // 함정·단계: 추가 요금은 넘은 시간 (x − 30)분에만 붙는다. 전체 시간 x분에 곱하면 틀린다.
        const [t0, F, r] = d.until(() => [d.pick([20, 30, 40]), 100 * d.int(8, 30), 10 * d.int(3, 9)], ([a, b, c]) => b - c * a !== 0), src = `${F}+${r}(x-${t0})`;
        return linQ(`어느 주차장의 주차 요금은 처음 ${t0}분까지 ${F}원이고, ${t0}분을 넘으면 1분마다 ${r}원씩 더 낸다. 이 주차장에 ${V('x')}분 동안 주차했을 때의 주차 요금을 ${V('x')}를 사용한 식으로 간단히 나타내시오. (단, ${V('x')}는 ${t0}보다 크다.)`, src, 'x', {
          unit: '원', explain: `${t0}분을 넘은 시간은 ${withUnit(`x-${t0}`, '분')}이므로 더 내는 요금은 ${withUnit(`${r}(x-${t0})`, '원')}이다. 주차 요금은 ${xh(src)} = ${xh(pn([[F, ''], [r, 'x'], [-r * t0, '']]))} = ${xh(ln(r, F - r * t0))}이다.`,
          facts: { calc: [[String(r), 0], [`${F}-${r}*${t0}`, 1]] }
        });
      }, { standard: STD1 }),
      H('hard-altitude', '단위를 맞추어 식을 세운 다음 식의 값 구하기', '심18', (d) => {
        // 함정·단계: 높이의 단위 m를 km로 고쳐야 한다(3500 m = 3.5 km). 그대로 곱하면 틀린다. 식 (지면의 기온) − 6 × (높이 km)를 세워 대입한다.
        const r = 6, T0 = d.int(8, 26), h = 500 * d.int(3, 13), v = T0 - r * h / 1000;
        return N(`지면에서 높이가 1 km 높아질 때마다 기온이 ${r} °C씩 낮아진다고 한다. 지면의 기온이 ${T0} °C일 때, 지면에서 높이가 ${h} m인 곳의 기온은 몇 °C인가?`, v, {
          unit: '°C', signed: true,
          explain: `높이가 ${V('x')} km인 곳의 기온은 ${withUnit(`${T0}-${r}x`, '°C')}이다. ${h} m = ${h / 1000} km이므로 ${nb(`${V('x')} = ${h / 1000}`)}${tail(Number(String(h / 1000).slice(-1)), '을/를')} 대입하면 ${T0} − ${r} × ${h / 1000} = ${tx(Q(v))}이다.`,
          facts: { value: `${T0}-${r}*${h}/1000`, unseen: [1000] }
        });
      }, { standard: STD1 }),
      H('hard-box-volume', '네 모퉁이를 잘라 만든 상자의 부피', '기본 ①105', (d) => {
        // 함정·단계: 가로와 세로는 양쪽에서 잘리므로 2c씩 줄어든다 → 밑면의 가로·세로와 높이를 식으로 나타낸다 → 부피를 간단히 한다.
        const c = d.int(2, 4), W = 2 * c + d.int(3, 7), src = `(x-${2 * c})*${W - 2 * c}*${c}`, k = c * (W - 2 * c);
        return linQ(`그림과 같이 가로의 길이가 ${V('x')} cm, 세로의 길이가 ${W} cm인 직사각형 모양의 종이의 네 모퉁이에서 한 변의 길이가 ${c} cm인 정사각형을 잘라 내고, 남은 종이를 접어 뚜껑이 없는 직육면체 모양의 상자를 만들었다. 이 상자의 부피를 ${V('x')}를 사용한 식으로 간단히 나타내시오.`, src, 'x', {
          unit: `cm${sup(3)}`, figure: netFig('x', String(W), String(c), 'cm'),
          explain: `상자의 밑면은 가로가 ${withUnit(`x-${2 * c}`, 'cm')}, 세로가 ${W} − ${2 * c} = ${W - 2 * c} (cm)이고, 높이는 ${c} cm이다. 부피는 ${xh(src)} = ${xh(kp(k, `x-${2 * c}`))} = ${xh(ln(k, -2 * c * k))}이다.`,
          facts: { calc: [[`${c}*(${W}-2*${c})`, 0], [`-2*${c}*${c}*(${W}-2*${c})`, 1]], unseen: [2] }
        });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('7-1-3', 'value', [
    TB('value-abs-subst', '절댓값 기호 안의 식에 음수 대입하기', '심27', (d) => {
      // 함정: |pa + c|를 p|a| + c로 나누어 계산하는 아이. 절댓값 기호 안의 식의 값을 먼저 구한 다음 절댓값을 구한다.
      const [k, p, c] = d.until(() => [d.int(2, 5), d.int(2, 4), d.int(1, 9)], ([x, y, z]) => y * x > z && y * x - z !== y * x + z), inner = -p * k + c, v = -inner - k;
      return ansV(`${nb(`${V('a')} = ${tx(Q(-k))}`)}일 때, ${nb(`|${p}${V('a')} + ${c}| − |${V('a')}|`)}의 값은?`, Q(v), 'int', {
        explain: `절댓값 기호 안의 식의 값을 먼저 구한다. ${p} × (−${k}) + ${c} = ${tx(Q(inner))}이므로 |${tx(Q(inner))}| − |−${k}| = ${-inner} − ${k} = ${tx(Q(v))}이다.`,
        facts: { value: `(0-(${p}*(-${k})+${c}))-${k}`, unseen: [0] }
      });
    }, { standard: STD1 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
