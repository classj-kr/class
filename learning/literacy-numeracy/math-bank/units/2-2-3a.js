// 2학년 2학기 3단원 길이 재기 — 단원 틀, 그림 도구, 기본 문항(1 m와 단위 바꾸기, 줄자로 길이 재기, 길이의 합).
// 영역: 도형과 측정 가운데 측정. 성취기준 [2수03-10] 길이 단위 1 cm와 1 m를 알고 길이를 측정한다, [2수03-11] 1 m와 1 cm의 관계를 이해하고
// 길이를 「몇 m 몇 cm」와 「몇 cm」로 표현한다, [2수03-12] 길이를 어림하고 양감을 기른다, [2수03-13] 길이의 덧셈과 뺄셈을 한다.
// 수집해 둔 교과서 평가 자료의 꼴 목록(기본꼴_1 64꼴 = ①n, 심화꼴 49꼴 = 심n)을 하나씩 따져 옮긴 것이다. 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다.
//
// 싣는 기준
//  - 단위는 m와 cm만 쓴다. 길이의 합은 cm끼리의 합이 100을 넘지 않는 것만, 차는 cm끼리 뺄 수 있는 것만 싣는다(m는 m끼리, cm는 cm끼리).
//    cm 두 자리 수끼리의 일의 자리 받아올림·받아내림(54 + 18, 50 − 25)과 m끼리의 받아올림·받아내림(65 + 27, 21 − 15)은 2학년 1학기 것이라 싣는다.
//    단위가 섞인 셈(153 cm + 2 m 32 cm)은 「몇 m 몇 cm」로 고쳐 셈하면 풀리게 수를 고른다(세 자리 수끼리의 받아올림이 생기지 않는다).
//  - 식만 주는 계산은 셈의 구조(몇십끼리, 일의 자리 받아올림·받아내림, cm가 한 자리, m가 두 자리)와 꼴(가로·세로)이 다를 때만 다른 문항이다.
//    구조는 facts.rule 에 이름으로 적어 검사가 가르게 한다.
//  - 교육과정: 「양을 비교할 때 '짧다' 등과 같이 한글로 쓰게 하는 것은 지양한다」 → 「미터」「센티미터」는 바르게 읽은 것 고르기로만 묻는다. 답 칸에는 숫자만 받는다.
//  - 답이 여럿인 꼴(「모두 고르시오」)은 「모두 고른 것」 하나를 고르게 바꾸었다. 선 잇기는 「길이가 같은 것」 고르기로 바꾸었다.
//  - 줄자 그림은 100 cm 언저리의 눈금이 읽히게 30 cm쯤을 잘라 그리고, 물건의 한끝이 놓인 눈금 0 쪽을 따로 조금 보인다.
//
// 뺀 것과 까닭(꼴 번호)
//  - 5학년 「둘레」의 얼개(세 변의 합에서 한 변, 연못의 둘레): ①47, 심30의 변형
//  - 같은 길이를 네 번 넘게 더하거나 곱셈구구 밖의 곱이 되는 것(3학년 곱셈): ①54(15 cm씩 7뼘), 심38(70 cm씩 4걸음·50 cm씩 6걸음), 심39(23 cm씩 4번)
//  - 큰 걸음 수를 둘씩 묶는 것(3학년 나눗셈): ①52의 변형(22걸음), 심36·심37(50걸음) — 심37은 10걸음 안쪽으로 줄여 실었다(body-half)
//  - 겹친 구간·겹치게 이어 붙인 길이(조건 풀이가 어려움의 대부분): 심27, 심28
//  - 「더 짧다」 조건 둘을 이어 셋째 길이 찾기: 심26 — 조건 하나짜리로 줄여 실력에 실었다(h-shorter)
//  - 세로식의 가려진 수 여럿: ①34, 심13, 심18 — 가려진 수 하나짜리로 실었다(sum-mask, diff-mask)
//  - 수 카드로 길이 만들기(자릿값 문제이고 답지도 어긋나 있다): ①31, ①48
//  - 글로 쓰는 답·열린 답·활동: ①2(읽어 쓰기 — 고르기 ①3으로 실음), ①12의 고쳐 쓰기(잘못 말한 것 고르기로 실음), ①20(잘못 잰 까닭 — 실제 길이를 묻는 실력 h-zero로 실음),
//    ①57, 심47(1 m 만들기 — 수 답 meter-make로 실음), 심48, 심49, ①15의 「교실에서 재어 적기」
//  - 이미 실은 문항과 하는 일이 같은 것(수·상황·보기 꼴만 다름): ①6의 짝 오지선다, ①14의 「몇 cm」만 묻기와 오지선다, ①26의 상황만 바꾼 변형, ①37의 「셋 중 가장 짧은 것」「길이와 식」,
//    ①38의 「차보다 짧은 것」, ①39의 넷 가운데, ①49의 「기준 길이에 가장 가까운 끈」(h-closer와 같음), ①50의 긴 쪽·짧은 쪽 둘 묻기와 오지선다, ①51의 그림(실력 h-height가 같은 그림으로 묻는다),
//    ①52의 「7뼘이 약 1 m」, ①53의 미차6-01(물음이 애매함), ①55의 가장 많은(적은) 것 하나 고르기와 「길수록 횟수가 적다」 고르기, ①60의 「1 m보다 짧으면 cm 단위」,
//    ①61의 「m가 알맞은 것 모두」(①64와 같음), ①64의 「3 m에 가장 가까운 것」(①63과 같음), 심16의 단위가 같은 셋,
//    ①41 「어디가 얼마나 더 먼가」(방향만 뒤집은 심24를 실력에 실었다), 심8(두 키 견주기 — 실력 h-units)
// 묻는 말: 값을 물을 때는 「~은?/~는?」, 양을 물을 때는 「몇 ~인가?」, 시키는 말은 「~하시오.」. 문장은 짧게, 한 문장에 한 가지만 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, lines, tagged, numbers, chain, table, timeColumn, N, M, C } = B.kit;
  const KNOW = '2수03-10', CONV = '2수03-11', GUESS = '2수03-12', CALC = '2수03-13';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;

  // ── 길이(모두 cm로 셈한다) ───────────────────────────────────
  const mOf = (v) => Math.floor(v / 100), cOf = (v) => v % 100;
  // 길이 글: 340 → '3 m 40 cm', 300 → '3 m', 40 → '40 cm'. 「몇 cm」로만 적을 때는 LC.
  const L = (v) => [mOf(v) ? mOf(v) + ' m' : '', cOf(v) || !mOf(v) ? cOf(v) + ' cm' : ''].filter(Boolean).join(' ');
  const LC = (v) => v + ' cm';
  // 검사가 다시 셈하는 식. 문제에 「3 m 40 cm」로 적힌 길이는 (3*100+40), 「340 cm」로 적힌 길이는 340.
  const X = (v) => (mOf(v) && cOf(v) ? `(${mOf(v)}*100+${cOf(v)})` : mOf(v) ? `${mOf(v)}*100` : String(v));
  // 「몇 m 몇 cm」 답 칸과 그 근거(값을 100으로 나눈 몫과 나머지)
  const ask = (v, lead) => [{ answer: mOf(v), unit: 'm', lead }, { answer: cOf(v), unit: 'cm' }];
  const mc = (text, at) => ({ unit: [{ expr: text, base: 100, at: at || [0, 1] }], unseen: [100] });

  // ── 수 고르기 ────────────────────────────────────────────────
  const onesCarry = (x, y) => (x % 10) + (y % 10) >= 10, onesBorrow = (x, y) => x % 10 < y % 10;
  // cm끼리 더할 두 수(합은 99 이하): tens 몇십끼리, plain 받아올림 없음, carry 일의 자리에서 받아올림, one 더하는 쪽이 한 자리
  const CM_SUM = {
    tens: (d) => { const x = d.int(1, 8); return [x * 10, d.int(1, 9 - x) * 10]; },
    plain: (d) => d.until(() => [d.int(11, 78), d.int(11, 78)], ([x, y]) => x + y <= 99 && !onesCarry(x, y) && x % 10 !== 0 && y % 10 !== 0 && x !== y),
    carry: (d) => d.until(() => [d.int(13, 69), d.int(13, 69)], ([x, y]) => x + y <= 96 && onesCarry(x, y) && x !== y),
    one: (d) => d.until(() => [d.int(11, 89), d.int(2, 9)], ([x, y]) => !onesCarry(x, y))
  };
  // cm끼리 뺄 두 수(앞의 수가 더 크다): tens 몇십끼리, plain 받아내림 없음, borrow 일의 자리에서 받아내림, one 빼는 쪽이 한 자리
  const CM_DIFF = {
    tens: (d) => { const x = d.int(3, 9); return [x * 10, d.int(1, x - 1) * 10]; },
    plain: (d) => d.until(() => [d.int(34, 99), d.int(11, 78)], ([x, y]) => x - y >= 11 && !onesBorrow(x, y) && y % 10 !== 0 && x % 10 !== y % 10),
    borrow: (d) => d.until(() => [d.int(30, 96), d.int(12, 79)], ([x, y]) => x - y >= 5 && onesBorrow(x, y)),
    one: (d) => d.until(() => [d.int(15, 98), d.int(2, 9)], ([x, y]) => x % 10 !== y)
  };
  // 두 길이. mA·mB 는 m의 범위. 차는 mR(차의 m)과 mB(빼는 길이의 m)로 정한다.
  const pairSum = (d, kind, mA, mB, ok) => d.until(() => { const [x, y] = CM_SUM[kind](d); return [d.int(mA[0], mA[1]) * 100 + x, d.int(mB[0], mB[1]) * 100 + y]; }, ([a, b]) => a !== b && (!ok || ok(a, b)));
  const pairDiff = (d, kind, mR, mB, ok) => d.until(() => { const [x, y] = CM_DIFF[kind](d), mb = d.int(mB[0], mB[1]); return [(mb + d.int(mR[0], mR[1])) * 100 + x, mb * 100 + y]; }, ([a, b]) => !ok || ok(a, b));
  // 두 번 이어 계산하는 길이 셋. ops: 두 연산('+', '-'). 어느 단계에서도 cm끼리의 합이 100을 넘거나 cm끼리 뺄 수 없는 일이 없다.
  const threeLengths = (d, ops) => d.until(() => {
    const v = [d.int(ops[0] === '-' ? 6 : 1, ops[0] === '-' ? 9 : 5) * 100 + d.int(11, 88), d.int(1, 3) * 100 + d.int(11, 60), d.int(1, 3) * 100 + d.int(11, 60)];
    const r1 = ops[0] === '+' ? v[0] + v[1] : v[0] - v[1], c1 = ops[0] === '+' ? cOf(v[0]) + cOf(v[1]) : cOf(v[0]) - cOf(v[1]);
    const r2 = ops[1] === '+' ? r1 + v[2] : r1 - v[2], c2 = ops[1] === '+' ? c1 + cOf(v[2]) : c1 - cOf(v[2]);
    return { v, r1, r2, c1, c2 };
  }, (t) => t.c1 >= 1 && t.c1 <= 99 && t.c2 >= 1 && t.c2 <= 99 && t.r1 > 100 && t.r2 > 100 && new Set(t.v.map(cOf)).size === 3 && new Set(t.v).size === 3);
  // 「모두 고른 것」의 보기: 넷 가운데 둘씩 묶은 것 넷(맞는 묶음은 하나). flags 는 참이 꼭 둘이다.
  function pairOptions(d, flags) {
    const all = []; for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) all.push([i, j]);
    const right = [0, 1, 2, 3].filter((i) => flags[i]);
    const sets = d.shuffle(d.shuffle(all.filter((p) => p.join() !== right.join())).slice(0, 3).concat([right])).map((p) => p.map((i) => LABELS[i]));
    return { sets, options: sets.map((s) => s.join(', ')), answer: sets.findIndex((s) => s.join() === right.map((i) => LABELS[i]).join()) };
  }
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

  // ── 풀이 글 ──────────────────────────────────────────────────
  const whySum = (a, b) => `m는 m끼리, cm는 cm끼리 더한다. ${mOf(a)} m + ${mOf(b)} m = ${mOf(a) + mOf(b)} m, ${cOf(a)} cm + ${cOf(b)} cm = ${cOf(a) + cOf(b)} cm이므로 ${L(a + b)}이다.`;
  const whyDiff = (a, b) => `m는 m끼리, cm는 cm끼리 뺀다. ${mOf(a)} m − ${mOf(b)} m = ${mOf(a) - mOf(b)} m, ${cOf(a)} cm − ${cOf(b)} cm = ${cOf(a) - cOf(b)} cm이므로 ${L(a - b)}이다.`;

  // ── 그림 ────────────────────────────────────────────────────
  const INK = '#1f2933';
  const fx = (n) => Math.round(n * 100) / 100;
  const svg = (w, h, label, body) => `<svg class="mb-geo" viewBox="0 0 ${fx(w)} ${fx(h)}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  const word = (x, y, text, o) => `<text class="mb-label${o && o.cls ? ' ' + o.cls : ''}" x="${fx(x)}" y="${fx(y)}" text-anchor="${(o && o.anchor) || 'middle'}" dominant-baseline="central">${text}</text>`;
  const slab = (x, y, w, h, fill, line) => `<rect x="${fx(x)}" y="${fx(y)}" width="${fx(w)}" height="${fx(h)}" rx="2" style="fill:${fill};stroke:${line || INK};stroke-width:1.1"/>`;
  const stroke = (x1, y1, x2, y2, style) => `<line x1="${fx(x1)}" y1="${fx(y1)}" x2="${fx(x2)}" y2="${fx(y2)}" style="${style || 'stroke:' + INK + ';stroke-width:1.2'}"/>`;
  const YELLOW = ['#ffd98a', '#a86a00'], BLUE = ['#a9d4ff', '#1d4ed8'];

  // 줄자의 눈금을 말로: 142 → '눈금 140에서 작은 눈금 2칸 더 간 곳'. 검사가 다시 셈하는 식은 (140+2).
  const place = (cm) => (cm % 10 ? `눈금 ${cm - (cm % 10)}에서 작은 눈금 ${cm % 10}칸 더 간 곳` : `눈금 ${cm}`);
  const tick = (cm) => (cm % 10 ? `(${cm - (cm % 10)}+${cm % 10})` : String(cm));
  // 줄자. 작은 눈금 한 칸은 1 cm이고 10 cm마다 수를 적는다. 긴 줄자에서 lo~hi 만 잘라 보인다(끝은 찢은 금).
  // o.stub: 왼쪽에 눈금 0부터 따로 보이는 길이(cm), o.things: 줄자 위에 올린 물건 [{ from, to, fill }], o.at: 화살표가 가리키는 눈금
  function tape(o) {
    const u = o.u || 7, gap = 20, stub = o.stub || 0, x0 = 16, top = 30, bottom = 62, things = o.things || [];
    const x = (cm) => (stub && cm <= stub ? x0 + cm * u : x0 + (stub ? stub * u + gap : 0) + (cm - o.lo) * u), width = x(o.hi) + 16;
    const zig = (px, ya, yb) => { let out = ''; for (let i = 0; i <= 6; i += 1) out += `L${fx(px + (i === 0 || i === 6 ? 0 : i % 2 ? 2.5 : -2.5))} ${fx(ya + ((yb - ya) * i) / 6)}`; return out; };
    const body = (xl, xr, tornLeft) => `<path class="mb-ruler-body" d="M${fx(xl)} ${top}${zig(xr, top, bottom)}L${fx(xl)} ${bottom}${tornLeft ? zig(xl, bottom, top) : ''}Z"/>`;
    let out = (stub ? body(x(0) - 9, x(stub) + 5, false) : '') + body(x(o.lo) - 5, x(o.hi) + 9, true);
    for (const [a, b] of stub ? [[0, stub], [o.lo, o.hi]] : [[o.lo, o.hi]]) for (let cm = a; cm <= b; cm += 1) {
      out += `<line class="mb-ruler-tick" x1="${fx(x(cm))}" y1="${top}" x2="${fx(x(cm))}" y2="${top + (cm % 10 === 0 ? 13 : cm % 5 === 0 ? 9.5 : 6)}"/>`;
      if (cm % 10 === 0) out += `<text class="mb-ruler-number" x="${fx(x(cm))}" y="${top + 25}" text-anchor="middle">${cm}</text>`;
    }
    for (const end of new Set(things.reduce((all, t) => all.concat([t.from, t.to]), []))) out += `<line class="mb-ruler-guide" x1="${fx(x(end))}" y1="5" x2="${fx(x(end))}" y2="${top}"/>`;
    for (const t of things) out += slab(x(t.from), 11, x(t.to) - x(t.from), 12, t.fill || '#93c5fd', '#1e3a8a');
    // 물건이 잘린 곳을 지나가면 그 사이를 비워 둔다.
    if (stub && things.some((t) => t.from <= stub && t.to >= o.lo)) { const xa = x(stub) + 5, xb = x(o.lo) - 5; out += `<path d="M${fx(xa)} 7${zig(xa, 7, 27)}L${fx(xb)} 27${zig(xb, 27, 7)}Z" style="fill:var(--paper, #fff)"/>`; }
    if (o.at != null) out += `<path class="mb-pointer" d="M${fx(x(o.at))} ${top - 2}l-5 -11h10z"/>`;
    const first = Math.min.apply(null, things.map((t) => t.from)), last = Math.max.apply(null, things.map((t) => t.to));
    const said = '줄자: 작은 눈금 한 칸은 1 cm.' + (o.at != null ? ` 화살표는 ${place(o.at)}.` : '')
      + (things.length ? ` ${things.length > 1 ? '겹치지 않게 이어 놓은 물건 ' + things.length + '개' : '물건'}의 왼쪽 끝은 ${place(first)}, 오른쪽 끝은 ${place(last)}.` : '');
    return svg(width, 66, said, out);
  }
  // 물건의 끝 눈금 to 가 보이게 줄자를 30 cm 잘라 보이는 구간(양 끝은 5로 끝나는 눈금이라 수가 찢은 금에 걸리지 않는다)
  const around = (to) => { const lo = to - (to % 10) - 15; return { lo, hi: lo + 30 }; };

  // 길이를 적은 띠 두 장(왼쪽 끝을 맞춘다). rows: [[이름, 길이(cm)], …], what: 그림 설명에 적는 물건 이름
  function twoBars(rows, what) {
    const max = Math.max.apply(null, rows.map((r) => r[1])), x0 = 30;
    let out = '';
    rows.forEach(([tag, v], i) => {
      const w = Math.max(64, (150 * v) / max), y = 8 + i * 30, c = i ? BLUE : YELLOW;
      out += slab(x0, y, w, 16, c[0], c[1]) + word(14, y + 8, tag) + word(x0 + w + 7, y + 8, L(v), { anchor: 'start', cls: 'is-length' });
    });
    return svg(270, 8 + rows.length * 30, `${what} 두 개: ${rows.map(([tag, v]) => tag + ' ' + L(v)).join(', ')}`, out);
  }
  // 1 m 토막과 나머지 토막으로 나누어 보인 막대 둘. rest: 나머지 토막의 길이 [위, 아래](cm)
  function splitBars(rest) {
    const U = 1.25, x0 = 10;
    let out = '';
    rest.forEach((c, i) => {
      const y = 6 + i * 44;
      out += slab(x0, y, 100 * U, 16, YELLOW[0], YELLOW[1]) + slab(x0 + 100 * U, y, c * U, 16, BLUE[0], BLUE[1])
        + word(x0 + 50 * U, y + 27, '1 m', { cls: 'is-length' }) + word(x0 + 100 * U + Math.max(c * U / 2, 19), y + 27, c + ' cm', { cls: 'is-length' });
    });
    return svg(x0 + 100 * U + 45 * U + 24, 90, `막대 그림: 위 막대는 1 m와 ${rest[0]} cm, 아래 막대는 1 m와 ${rest[1]} cm를 이은 길이`, out);
  }
  // 한 줄로 놓인 세 곳. names: 세 곳의 이름, dists: [앞 구간, 뒤 구간]의 글, total: 처음부터 끝까지의 거리 글(없으면 그리지 않는다), share: 앞 구간이 차지하는 몫
  function road(names, dists, total, share, label) {
    const xs = [22, 22 + 244 * Math.min(0.62, Math.max(0.38, share)), 266], y = total ? 46 : 24;
    let out = stroke(xs[0], y, xs[2], y, 'stroke:#5b6770;stroke-width:2');
    xs.forEach((px, i) => { out += `<circle cx="${fx(px)}" cy="${y}" r="3.6" style="fill:${INK}"/>` + word(px, y + 16, names[i]); });
    dists.forEach((text, i) => { out += word((xs[i] + xs[i + 1]) / 2, y - 12, text, { cls: 'is-length' }); });
    if (total) out += `<path d="M${xs[0]} ${y - 24}v-6H${xs[2]}v6" style="fill:none;stroke:${INK};stroke-width:1"/>` + word((xs[0] + xs[2]) / 2, y - 39, total, { cls: 'is-length' });
    return svg(288, y + 28, label, out);
  }
  // 기준 길이와 그것으로 n번인 긴 물건. 긴 물건 아래에 기준 길이만큼씩 눈금을 찍는다. caps: [기준에 적는 글, 긴 물건 이름]
  function unitRow(n, caps, label) {
    const u = Math.min(56, Math.floor(250 / n)), x0 = 12;
    let out = slab(x0, 6, u, 13, YELLOW[0], YELLOW[1]) + word(x0 + u + 7, 12.5, caps[0], { anchor: 'start', cls: 'is-length' }) + slab(x0, 34, n * u, 13, BLUE[0], BLUE[1]);
    for (let i = 0; i <= n; i += 1) out += stroke(x0 + i * u, 49, x0 + i * u, 56);
    return svg(Math.max(x0 + n * u + 14, x0 + u + 110), 76, label, out + word(x0 + (n * u) / 2, 66, caps[1]));
  }
  // 두 깃발 사이에 찍힌 발자국 n개(한 걸음에 하나씩, 마지막 발자국이 둘째 깃발 앞이다).
  function prints(n) {
    const xa = 22, xb = 268, step = (xb - xa - 10) / n, flag = (px, tint) => stroke(px, 6, px, 50, 'stroke:' + INK + ';stroke-width:2') + `<path d="M${px} 7l17 6l-17 6z" style="fill:${tint};stroke:${INK};stroke-width:1"/>`;
    let out = stroke(8, 50, 282, 50, 'stroke:#94a3b8;stroke-width:1.2') + flag(xa, '#f87171') + flag(xb, '#60a5fa');
    for (let i = 1; i <= n; i += 1) out += `<ellipse cx="${fx(xa + step * i - step * 0.35)}" cy="${i % 2 ? 34 : 43}" rx="${fx(Math.min(8, step * 0.32))}" ry="3.6" style="fill:#64748b"/>`;
    return svg(290, 58, `두 깃발 사이에 찍힌 발자국 ${n}개`, out);
  }
  // 사람과 그 키로 k번인 높은 것(나무). 사람의 키마다 가로 점선을 긋는다. hText: 사람 아래에 적는 키
  function heights(hText, k, thing) {
    const u = k === 2 ? 50 : 38, top = 10, ground = top + k * u, px = 78, tx = 196;
    let out = '';
    for (let i = 0; i <= k; i += 1) out += stroke(24, ground - i * u, 258, ground - i * u, i ? 'stroke:#94a3b8;stroke-width:1;stroke-dasharray:4 3' : 'stroke:' + INK + ';stroke-width:1.8');
    const head = u * 0.17;
    out += slab(px - 9, ground - u + head * 2, 18, u - head * 2, '#fdba74') + `<circle cx="${px}" cy="${fx(ground - u + head)}" r="${fx(head)}" style="fill:#fdba74;stroke:${INK};stroke-width:1.1"/>`;
    out += slab(tx - 5, ground - k * u * 0.4, 10, k * u * 0.4, '#b08968') + `<path d="M${tx} ${top}L${tx + 30} ${fx(ground - k * u * 0.32)}H${tx - 30}Z" style="fill:#86efac;stroke:${INK};stroke-width:1.1;stroke-linejoin:round"/>`;
    out += word(px, ground + 13, hText, { cls: 'is-length' }) + word(tx, ground + 13, thing);
    return svg(282, ground + 26, `키가 ${hText}인 사람과 ${thing}: ${thing}의 높이는 사람의 키로 ${k}번`, out);
  }

  B.kit.g223 = { KNOW, CONV, GUESS, CALC, SIGNS, versus, mOf, cOf, L, LC, X, ask, mc, CM_SUM, CM_DIFF, pairSum, pairDiff, threeLengths, pairOptions, ORDERS, whySum, whyDiff, tape, around, tick, place, twoBars, road, unitRow, prints, heights };

  // 높이가 1 m를 조금 넘는 물건(표와 문장에 쓴다)
  const TALL = ['냉장고', '옷장', '책장', '신발장', '사물함'];

  B.addUnit({
    id: '2-2-3', grade: 2, semester: 2, no: 3, title: '길이 재기', version: 1,
    groups: [
      {
        id: 'meter', title: '1 m와 단위 바꾸기', standard: CONV,
        types: [
          T('meter-one', '1 m와 1 cm', '①1', () => N('1 m는 1 cm를 몇 번 이은 길이와 같은가?', 100, {
            unit: '번', explain: '1 cm를 100번 이으면 100 cm이다. 100 cm는 1 m와 같다.', facts: { calc: [['100', 0]], unseen: [100] }
          }), { standard: KNOW }),
          T('meter-read', '길이를 바르게 읽은 것 고르기', '①2·3 심2', (d) => {
            const m = d.int(2, 9), c = d.until(() => d.pick([d.int(2, 9), d.int(12, 98)]), (v) => v !== m);
            const rows = d.shuffle([[`${m} 미터 ${c} 센티미터`, true], [`${m} 센티미터 ${c} 미터`, false], [`${c} 미터 ${m} 센티미터`, false], [`${m} 센티미터 ${c} 센티미터`, false]]);
            return C(`${m} m ${c} cm를 바르게 읽은 것은?`, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
              explain: `m는 미터, cm는 센티미터라고 읽는다. ${m} m ${c} cm는 ${m} 미터 ${c} 센티미터이다.`, facts: { truth: rows.map((r) => r[1]), want: true }
            });
          }, { standard: KNOW }),
          T('meter-hundreds', '몇백 cm와 몇 m', '①4 심1', (d) => {
            const [a, b] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b * 100 }], {
              figure: lines([`${a * 100} cm = ${box(LABELS[0])} m`, `${b} m = ${box(LABELS[1])} cm`]),
              explain: `100 cm는 1 m이다. ${a * 100} cm는 ${a} m이고, ${b} m는 ${b * 100} cm이다.`, facts: { calc: [[`${a * 100}/100`, 0], [`${b}*100`, 1]], unseen: [100] }
            });
          }),
          T('meter-split', '「몇 cm」를 「몇 m 몇 cm」로 나타내기', '①5 심3', (d, n) => {
            // 530 cm = 5 m 30 cm / 508 cm = 5 m 8 cm(십의 자리가 0)
            const m = d.int(2, 9), c = n === 0 ? d.int(11, 98) : d.int(2, 9), v = m * 100 + c;
            return M(`${v} cm는 몇 m 몇 cm인가?`, ask(v), {
              explain: `${v} cm는 ${m * 100} cm보다 ${c} cm 더 긴 길이이다. ${m * 100} cm는 ${m} m이므로 ${v} cm는 ${L(v)}이다.`, facts: Object.assign(mc(String(v)), { rule: n === 0 ? 'split-two' : 'split-one' })
            });
          }, { count: 2 }),
          T('meter-join', '「몇 m 몇 cm」를 「몇 cm」로 나타내기', '①6 심3', (d, n) => {
            // 2 m 57 cm = 257 cm / 2 m 7 cm = 207 cm(0을 끼운다) / 12 m 8 cm = 1208 cm(m가 두 자리)
            const m = n === 2 ? d.int(11, 25) : d.int(2, 9), c = n === 0 ? d.int(11, 98) : d.int(2, 9), v = m * 100 + c;
            return N(`${L(v)}는 몇 cm인가?`, v, {
              unit: 'cm', explain: `1 m는 100 cm이므로 ${m} m는 ${m * 100} cm이다. ${m * 100} cm보다 ${c} cm 더 긴 길이는 ${v} cm이다.`,
              facts: { calc: [[`${m}*100+${c}`, 0]], unseen: [100], rule: ['join-two', 'join-one', 'join-long'][n] }
            });
          }, { count: 3 }),
          T('meter-table', '표의 길이를 두 가지로 나타내기', '①15 심3', (d) => {
            const [p, q] = d.shuffle(TALL), a = 100 + d.int(12, 95), cb = d.until(() => d.pick([d.int(3, 9), d.int(12, 95)]), (v) => v !== cOf(a)), b = 100 + cb;
            return M('물건의 높이를 두 가지 방법으로 나타낸 표이다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: 1 }, { label: LABELS[1], answer: cOf(a) }, { label: LABELS[2], answer: b }], {
              figure: table(['물건', '몇 cm', '몇 m 몇 cm'], [[p, LC(a), `${box(LABELS[0])} m ${box(LABELS[1])} cm`], [q, `${box(LABELS[2])} cm`, L(b)]]),
              explain: `${a} cm는 100 cm보다 ${cOf(a)} cm 더 긴 길이이므로 ${L(a)}이다. ${L(b)}는 100 cm보다 ${cb} cm 더 긴 길이이므로 ${b} cm이다.`,
              facts: Object.assign(mc(String(a)), { calc: [[`1*100+${cb}`, 2]] })
            });
          }),
          T('meter-over', '1 m보다 몇 cm 더 긴 길이인지 알기', '①7', (d) => {
            const c = d.pick([d.int(3, 9), d.int(12, 95)]), v = 100 + c;
            return N(`${v} cm는 1 m보다 몇 cm 더 긴가?`, c, { unit: 'cm', explain: `1 m는 100 cm이다. ${v} cm는 100 cm보다 ${c} cm 더 길다.`, facts: { calc: [[`${v}-100`, 0]], unseen: [100] } });
          }),
          T('meter-over-cm', '「1 m보다 몇 cm 더」를 「몇 cm」로 나타내기', '심6', (d) => {
            const thing = d.pick(TALL), c = d.pick([d.int(3, 9), d.int(12, 95)]);
            return N(`${thing}의 높이는 1 m보다 ${c} cm 더 높다. ${thing}의 높이는 몇 cm인가?`, 100 + c, {
              unit: 'cm', explain: `1 m는 100 cm이다. 100 cm보다 ${c} cm 더 높으면 ${100 + c} cm이다.`, facts: { calc: [[`100+${c}`, 0]], unseen: [100] }
            });
          }),
          T('meter-make', '이어서 1 m 만들기', '심47', (d) => {
            const a = d.pick([20, 30, 40, 60, 70, 80]);
            return N(`길이가 ${a} cm인 끈에 다른 끈을 겹치지 않게 이어 붙여 1 m를 만들려고 한다. 이어 붙일 끈의 길이는 몇 cm인가?`, 100 - a, {
              unit: 'cm', explain: `1 m는 100 cm이다. ${a} cm에 ${100 - a} cm를 이으면 100 cm가 된다.`, facts: { calc: [[`100-${a}`, 0]], unseen: [100] }
            });
          }),
          T('meter-match', '길이가 같은 것 찾기', '①8 심4', (d) => {
            // 7 m 8 cm ↔ 708 cm · 780 cm · 788 cm · 78 cm
            const m = d.int(2, 9), s = d.until(() => d.int(2, 9), (v) => v !== m), v = m * 100 + s, list = d.shuffle([v, m * 100 + s * 10, m * 100 + s * 11, m * 10 + s]);
            return C(`${L(v)}와 길이가 같은 것은?`, list.map(LC), list.indexOf(v), {
              explain: `${m} m는 ${m * 100} cm이다. ${L(v)}는 ${m * 100} cm보다 ${s} cm 더 긴 ${v} cm이다.`, facts: { choose: { exprs: list.map(String), rule: 'equals', target: v } }
            });
          }),
          T('meter-odd', '나타내는 길이가 다른 하나 찾기', '①9', (d) => {
            // 304 cm, 3 m 4 cm, 3 m보다 4 cm 더 긴 길이 / 30 m 4 cm 또는 3 m 40 cm
            const m = d.int(2, 8), s = d.until(() => d.int(2, 9), (v) => v !== m), v = m * 100 + s;
            const odd = d.bool() ? [`${m * 10} m ${s} cm`, `${m * 10}*100+${s}`, (m * 10) * 100 + s] : [`${m} m ${s * 10} cm`, `${m}*100+${s * 10}`, m * 100 + s * 10];
            const rows = d.shuffle([[LC(v), String(v), v], [L(v), `${m}*100+${s}`, v], [`${m} m보다 ${s} cm 더 긴 길이`, `${m}*100+${s}`, v], odd]);
            return C('나타내는 길이가 나머지와 다른 것은?', rows.map((r) => r[0]), rows.indexOf(odd), {
              explain: `${L(v)}는 ${m * 100} cm보다 ${s} cm 더 긴 ${v} cm이다. ${odd[0]}는 ${odd[2]} cm이다.`, facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'odd' }, unseen: [100] }
            });
          }),
          T('meter-talk', '한 길이를 여러 가지로 나타낸 말 가리기', '①12', (d) => {
            const c = d.until(() => d.int(12, 98), (v) => v % 10 !== 0 && v % 11 !== 0), v = 100 + c, t = Math.floor(c / 10), o = c % 10;
            // 틀린 말: m와 cm를 헷갈린 것(135 m), 자리를 바꾼 것(1 m 53 cm), 끊는 자리를 잘못 잡은 것(13 m 5 cm)
            const wrong = d.pick([[`${v} m와 같다.`, `${v}*100`], [`1 m ${o * 10 + t} cm와 같다.`, `1*100+${o * 10 + t}`], [`${10 + t} m ${o} cm와 같다.`, `${10 + t}*100+${o}`]]);
            const rows = d.shuffle([[`1 m ${c} cm와 같다.`, `1*100+${c}`], [`1 m보다 ${c} cm 더 길다.`, `1*100+${c}`], [`1 cm를 ${v}번 이은 길이와 같다.`, `1*${v}`], wrong]);
            return C(`${v} cm에 대한 설명으로 옳지 않은 것은?`, rows.map((r) => r[0]), rows.indexOf(wrong), {
              explain: `${v} cm는 100 cm보다 ${c} cm 더 긴 길이이다. 100 cm는 1 m이므로 ${v} cm는 1 m ${c} cm이다.`, facts: { claimed: rows.map((r) => [r[1], v]), claimedWant: false }
            });
          }),
          T('meter-compare', '단위가 다른 두 길이의 비교', '①10', (d) => {
            // 320 cm ○ 3 m 12 cm
            const m = d.int(2, 9), c = d.pick([d.int(3, 9), d.int(12, 95)]), a = m * 100 + c;
            const b = d.until(() => d.pick([a + d.int(-30, 30), a + d.int(-30, 30), c < 10 ? m * 100 + c * 10 : a + d.int(-9, 9)]), (v) => v > 100);
            const flip = d.bool(), x = flip ? a : b, y = flip ? b : a;
            return C('두 길이를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, x > y ? 0 : x === y ? 1 : 2, {
              figure: versus(flip ? L(a) : LC(b), flip ? LC(b) : L(a)), explain: `${L(a)}는 ${a} cm이다. ` + (x > y ? `${x} cm가 ${y} cm보다 길다.` : x === y ? '두 길이는 같다.' : `${y} cm가 ${x} cm보다 길다.`),
              facts: { choose: { exprs: flip ? [X(a), String(b)] : [String(b), X(a)], rule: 'compare' }, unseen: [100] }
            });
          }),
          T('meter-longest', '단위가 다른 네 길이 가운데 가장 긴 것', '①10', (d) => {
            // 834 cm, 8 m 30 cm, 903 cm, 90 m 3 cm — m가 두 자리인 길이가 섞여 있다.
            const m = d.int(2, 8), s = d.int(2, 9), [c1, c2] = d.until(() => [d.int(12, 98), d.int(12, 98)], ([p, q]) => p !== q);
            const rows = d.shuffle([[LC(m * 100 + c1), String(m * 100 + c1), m * 100 + c1], [L(m * 100 + c2), X(m * 100 + c2), m * 100 + c2], [LC((m + 1) * 100 + s), String((m + 1) * 100 + s), (m + 1) * 100 + s],
              [`${(m + 1) * 10} m ${s} cm`, `(${(m + 1) * 10}*100+${s})`, (m + 1) * 1000 + s]]);
            const values = rows.map((r) => r[2]);
            return C('가장 긴 길이는?', rows.map((r) => r[0]), values.indexOf(Math.max.apply(null, values)), {
              explain: `모두 cm로 나타내면 ${values.map(LC).join(', ')}이다.`, facts: { choose: { exprs: rows.map((r) => r[1]), rule: 'max' }, unseen: [100] }
            });
          }),
          T('meter-ride', '기준 키와 비교하기', '①11', (d) => {
            // 120 cm보다 커야 타는 놀이 기구: 1 m 21 cm, 130 cm, 1 m 19 cm
            const base = d.pick([110, 120, 130]), who = d.shuffle(NAMES).slice(0, 3), hs = d.shuffle([base + d.int(1, 9), base + d.int(10, 18), base - d.int(1, 9)]), cmAt = d.int(0, 2);
            const said = hs.map((h, i) => (i === cmAt ? LC(h) : L(h)));
            return C(`키가 ${base} cm보다 커야 탈 수 있는 놀이 기구가 있다. ${nick(who[0])}의 키는 ${said[0]}, ${nick(who[1])}의 키는 ${said[1]}, ${nick(who[2])}의 키는 ${said[2]}이다. 이 놀이 기구를 탈 수 없는 사람은?`, who, hs.findIndex((h) => h < base), {
              explain: `키를 cm로 나타내면 ${hs.map((h, i) => who[i] + ' ' + LC(h)).join(', ')}이다. ${base} cm보다 작은 사람은 탈 수 없다.`,
              facts: { choose: { exprs: hs.map((h, i) => (i === cmAt ? String(h) : X(h))), rule: 'onlyBelow', target: base }, unseen: [100] }
            });
          })
        ]
      },
      {
        id: 'tape', title: '줄자로 길이 재기', standard: KNOW,
        types: [
          T('tape-point', '줄자의 눈금 읽기', '①13', (d) => {
            const base = d.pick([100, 200]), at = d.until(() => base + d.int(2, 22), (v) => v % 5 !== 0);
            return M('줄자에서 화살표가 가리키는 눈금은 몇 m 몇 cm인가?', ask(at), {
              figure: tape({ lo: base - 5, hi: base + 25, at }), explain: `화살표가 가리키는 눈금은 ${at}이다. ${at} cm는 ${L(at)}이다.`, facts: mc(tick(at))
            });
          }),
          T('tape-both', '줄자로 잰 길이를 두 가지로 나타내기', '①14·15 심9', (d) => {
            const to = d.until(() => 100 + d.int(12, 88), (v) => v % 5 !== 0);
            return M('줄자로 나무 막대의 길이를 재었다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: to }, { label: LABELS[1], answer: mOf(to) }, { label: LABELS[2], answer: cOf(to) }], {
              figure: tape(Object.assign({ stub: 4, things: [{ from: 0, to }] }, around(to))) + lines([`${box(LABELS[0])} cm = ${box(LABELS[1])} m ${box(LABELS[2])} cm`]),
              explain: `나무 막대의 한끝이 눈금 0에 있고 다른 쪽 끝이 눈금 ${to}에 있으므로 길이는 ${to} cm이다. ${to} cm는 ${L(to)}이다.`,
              facts: Object.assign(mc(tick(to), [1, 2]), { calc: [[tick(to), 0]] })
            });
          }),
          T('tape-zero', '줄자로 잰 길이(cm가 한 자리)', '①14', (d) => {
            const to = d.pick([100, 200]) + d.until(() => d.int(2, 9), (v) => v !== 5);
            return M('줄자로 책상의 긴 쪽의 길이를 재었다. 책상의 긴 쪽의 길이는 몇 m 몇 cm인가?', ask(to), {
              figure: tape(Object.assign({ stub: 4, things: [{ from: 0, to }] }, around(to))), explain: `책상의 한끝이 눈금 0에 있고 다른 쪽 끝이 눈금 ${to}에 있다. ${to} cm는 ${L(to)}이다.`, facts: mc(tick(to))
            });
          }),
          T('tape-whole', '줄자로 잰 길이(몇 m)', '심9', (d) => {
            const to = d.pick([200, 300]);
            return N('줄자로 잰 끈의 길이는 몇 m인가?', to / 100, {
              unit: 'm', figure: tape({ stub: 4, lo: to - 25, hi: to + 5, things: [{ from: 0, to }] }), explain: `끈의 한끝이 눈금 0에 있고 다른 쪽 끝이 눈금 ${to}에 있다. ${to} cm는 ${to / 100} m이다.`,
              facts: { calc: [[`${to}/100`, 0]], unseen: [100] }
            });
          }),
          T('tape-over', '줄자에서 1 m보다 몇 cm 더 긴지 읽기', '①7 심6', (d) => {
            const to = d.until(() => 100 + d.int(11, 23), (v) => v % 5 !== 0);
            return N('줄자로 밧줄의 길이를 재었다. 밧줄의 길이는 1 m보다 몇 cm 더 긴가?', to - 100, {
              unit: 'cm', figure: tape({ stub: 4, lo: 95, hi: 125, things: [{ from: 0, to }] }), explain: `밧줄의 길이는 ${to} cm이다. 1 m는 100 cm이므로 1 m보다 ${to - 100} cm 더 길다.`,
              facts: { calc: [[`${tick(to)}-100`, 0]], unseen: [100] }
            });
          }),
          T('tape-all', '잰 길이를 바르게 나타낸 것 모두 고르기', '①16 심10', (d) => {
            // 끝 눈금 315 → 3 m 15 cm, 315 cm (틀린 것: 31 m 5 cm, 351 cm)
            const to = d.until(() => d.int(1, 3) * 100 + d.int(12, 88), (v) => v % 5 !== 0 && cOf(v) % 11 !== 0), m = mOf(to), c = cOf(to), turned = (c % 10) * 10 + Math.floor(c / 10);
            const wrong = d.shuffle([`${Math.floor(to / 10)} m ${to % 10} cm`, LC(m * 100 + turned), `${m} m ${turned} cm`]).slice(0, 2);
            const rows = d.shuffle([[L(to), true], [LC(to), true], [wrong[0], false], [wrong[1], false]]), made = pairOptions(d, rows.map((r) => r[1]));
            return C('줄자로 긴 막대의 길이를 재었다. 긴 막대의 길이를 바르게 나타낸 것을 모두 고른 것은?', made.options, made.answer, {
              figure: tape(Object.assign({ stub: 4, things: [{ from: 0, to }] }, around(to))) + tagged(rows.map((r) => r[0])),
              explain: `긴 막대의 한끝이 눈금 0에 있고 다른 쪽 끝이 눈금 ${to}에 있으므로 길이는 ${to} cm이다. ${to} cm는 ${L(to)}이다.`,
              facts: { sets: { labels: LABELS, flags: rows.map((r) => r[1]), options: made.sets } }
            });
          }),
          T('tape-row', '한 줄로 이어 놓은 물건의 전체 길이', '①17', (d) => {
            const [p1, p2, to] = d.until(() => { const x = 100 + d.int(2, 6), y = x + d.int(6, 9); return [x, y, y + d.int(5, 8)]; }, (v) => v[2] % 5 !== 0);
            return M('색 막대 3개를 겹치지 않게 한 줄로 이어 놓고 줄자로 재었다. 색 막대 3개의 전체 길이는 몇 m 몇 cm인가?', ask(to), {
              figure: tape({ stub: 4, lo: 95, hi: 125, things: [{ from: 0, to: p1, fill: '#fca5a5' }, { from: p1, to: p2, fill: '#93c5fd' }, { from: p2, to, fill: '#86efac' }] }),
              explain: `첫째 막대의 한끝이 눈금 0에 있고 셋째 막대의 끝이 눈금 ${to}에 있다. 전체 길이는 ${to} cm이고, ${to} cm는 ${L(to)}이다.`, facts: mc(tick(to))
            });
          }),
          T('tape-order', '줄자로 길이를 재는 차례', '①18', (d) => {
            const first = '물건의 한끝을 줄자의 눈금 0에 맞춘다.', second = '물건의 다른 쪽 끝에 있는 줄자의 눈금을 읽는다.', flip = d.bool(), list = d.shuffle(['㉠, ㉡', '㉡, ㉠']);
            return C('줄자로 물건의 길이를 재려고 한다. 먼저 할 일부터 차례로 쓴 것은?', list, list.indexOf(flip ? '㉡, ㉠' : '㉠, ㉡'), {
              figure: tagged(flip ? [second, first] : [first, second]), explain: '물건의 한끝을 줄자의 눈금 0에 맞춘 다음, 다른 쪽 끝에 있는 눈금을 읽는다.',
              facts: { truth: list.map((o) => o === (flip ? '㉡, ㉠' : '㉠, ㉡')), want: true }
            });
          }),
          T('tape-pick', '줄자로 재기에 알맞은 것 고르기', '①19', (d) => {
            const long = d.pick(['교실 칠판의 긴 쪽의 길이', '교실 문의 높이', '교실의 긴 쪽의 길이', '학교 복도의 길이']);
            const list = d.shuffle(d.shuffle(['연필의 길이', '지우개의 길이', '필통의 길이', '수학책의 긴 쪽의 길이', '크레파스의 길이']).slice(0, 3).concat([long]));
            return C('길이가 30 cm인 자와 줄자가 있다. 줄자로 재는 것이 더 알맞은 것은?', list, list.indexOf(long), {
              explain: `${josa(long, '은/는')} 1 m보다 길다. 30 cm인 자로는 여러 번 재어야 하므로 줄자로 재는 것이 알맞다.`, facts: { truth: list.map((v) => v === long), want: true }
            });
          })
        ]
      },
      {
        id: 'sum', title: '길이의 합', standard: CALC,
        types: [
          T('sum-row', '길이의 합(가로식)', '①21 심12', (d, n) => {
            // 3 m 50 cm + 1 m 10 cm / 1 m 54 cm + 1 m 18 cm(일의 자리 받아올림) / 4 m 50 cm + 1 m 8 cm(cm가 한 자리)
            const kind = ['tens', 'carry', 'one'][n], [a, b] = pairSum(d, kind, [1, 5], [1, 4]);
            return M('다음을 계산하시오.', ask(a + b), { figure: lines([expr(L(a), '+', L(b))]), explain: whySum(a, b), facts: Object.assign(mc(`${X(a)}+${X(b)}`), { rule: 'sum-row-' + kind }) });
          }, { count: 3 }),
          T('sum-col', '길이의 합(세로식)', '①22', (d, n) => {
            // 4 m 55 cm + 6 m 23 cm(m끼리의 합이 10 이상) / 3 m 54 cm + 6 m 5 cm(cm가 한 자리)
            const [a, b] = n === 0 ? pairSum(d, 'plain', [4, 8], [5, 9], (p, q) => mOf(p) + mOf(q) >= 10) : pairSum(d, 'one', [2, 6], [1, 3]);
            return M('다음을 계산하시오.', ask(a + b), {
              figure: timeColumn([mOf(a) + ' m', cOf(a) + ' cm'], '+', [mOf(b) + ' m', cOf(b) + ' cm']), explain: whySum(a, b), facts: Object.assign(mc(`${X(a)}+${X(b)}`), { rule: n === 0 ? 'sum-col-plain' : 'sum-col-one' })
            });
          }, { count: 2 }),
          T('sum-split', '막대 그림으로 합 알아보기', '①23', (d) => {
            const [c1, c2] = d.until(() => [d.int(1, 4) * 10, d.int(1, 4) * 10], ([p, q]) => p !== q), s = 200 + c1 + c2;
            return M('두 막대의 길이의 합은 몇 m 몇 cm인가?', ask(s), {
              figure: splitBars([c1, c2]), explain: `1 m끼리 더하면 2 m이고, ${c1} cm와 ${c2} cm를 더하면 ${c1 + c2} cm이다. 합은 ${L(s)}이다.`, facts: mc(`1*100+${c1}+1*100+${c2}`)
            });
          }),
          T('sum-bars', '그림에 적힌 두 길이의 합', '①24 심12', (d) => {
            // m가 두 자리: 21 m 42 cm + 28 m 25 cm
            const [a, b] = pairSum(d, d.pick(['plain', 'carry']), [11, 28], [12, 31]);
            return M('색 테이프 가와 나의 길이의 합은 몇 m 몇 cm인가?', ask(a + b), { figure: twoBars([['가', a], ['나', b]], '색 테이프'), explain: whySum(a, b), facts: mc(`${X(a)}+${X(b)}`) });
          }),
          T('sum-chain', '화살표를 따라 더하기', '①25 심12', (d) => {
            const [a, b] = pairSum(d, d.pick(['plain', 'carry']), [1, 5], [1, 4]);
            return M('빈칸에 알맞은 길이는 몇 m 몇 cm인가?', ask(a + b), { figure: chain([L(a), '+' + L(b), box()]), explain: whySum(a, b), facts: mc(`${X(a)}+${X(b)}`) });
          }),
          T('sum-chain2', '화살표를 따라 두 번 더하기', '①25', (d) => {
            const t = threeLengths(d, ['+', '+']), [a, b, c] = t.v;
            return M('㉠, ㉡에 알맞은 길이는 각각 몇 m 몇 cm인가?', [{ label: LABELS[0], answer: mOf(t.r1), unit: 'm' }, { answer: cOf(t.r1), unit: 'cm' }, { label: LABELS[1], answer: mOf(t.r2), unit: 'm' }, { answer: cOf(t.r2), unit: 'cm' }], {
              figure: lines([chain([L(a), '+' + L(b), box(LABELS[0])]), chain([LABELS[0], '+' + L(c), box(LABELS[1])])]),
              explain: `㉠은 ${L(a)} + ${L(b)} = ${L(t.r1)}이다. ㉡은 ${L(t.r1)} + ${L(c)} = ${L(t.r2)}이다.`,
              facts: { unit: [{ expr: `${X(a)}+${X(b)}`, base: 100, at: [0, 1] }, { expr: `${X(a)}+${X(b)}+${X(c)}`, base: 100, at: [2, 3] }], unseen: [100] }
            });
          }),
          T('sum-mask', '덧셈 세로식의 □', '심13', (d) => {
            // 4 m 21 cm + 3 m □ cm = 7 m 57 cm
            const [a, b] = pairSum(d, d.pick(['plain', 'carry']), [2, 6], [1, 3]), s = a + b;
            return N('□ 안에 알맞은 수는?', cOf(b), {
              figure: timeColumn([mOf(a) + ' m', cOf(a) + ' cm'], '+', [mOf(b) + ' m', box() + ' cm'], [mOf(s) + ' m', cOf(s) + ' cm']),
              explain: `cm끼리 더하면 ${cOf(s)} cm이다. ${cOf(s)} − ${cOf(a)} = ${cOf(b)}이므로 □ 안에 알맞은 수는 ${cOf(b)}이다.`, facts: { calc: [[`${cOf(s)}-${cOf(a)}`, 0]] }
            });
          }),
          T('sum-join', '문장제: 이어 붙인 길이', '①26 심14', (d) => {
            const [a, b] = pairSum(d, d.pick(['plain', 'carry']), [2, 5], [1, 4]);
            return M(`길이가 ${L(a)}인 털실과 ${L(b)}인 털실을 겹치지 않게 이어 붙였다. 이어 붙인 털실의 길이는 몇 m 몇 cm인가?`, ask(a + b), { explain: whySum(a, b), facts: mc(`${X(a)}+${X(b)}`) });
          }),
          T('sum-twice', '문장제: 같은 길이 둘을 이은 길이', '①26', (d) => {
            const a = d.int(2, 4) * 100 + d.until(() => d.int(12, 48), (v) => v % 10 !== 0);
            return M(`길이가 ${L(a)}인 막대 2개를 겹치지 않게 한 줄로 이어 놓았다. 이어 놓은 막대의 전체 길이는 몇 m 몇 cm인가?`, ask(a + a), {
              explain: `${L(a)} + ${L(a)}를 계산한다. ${mOf(a)} m + ${mOf(a)} m = ${mOf(a) * 2} m, ${cOf(a)} cm + ${cOf(a)} cm = ${cOf(a) * 2} cm이므로 ${L(a + a)}이다.`, facts: mc(`${X(a)}+${X(a)}`)
            });
          }),
          T('sum-as-cm', '문장제: 합을 「몇 cm」로 나타내기', '①26', (d) => {
            const [a, b] = pairSum(d, 'plain', [2, 4], [1, 4]), [p, q] = d.shuffle(NAMES);
            return N(`${name(p, '은/는')} 리본을 ${L(a)}, ${name(q, '은/는')} 리본을 ${L(b)} 가지고 있다. 두 사람이 가진 리본의 길이의 합은 몇 cm인가?`, a + b, {
              unit: 'cm', explain: `${L(a)} + ${L(b)} = ${L(a + b)}이다. ${L(a + b)}는 ${a + b} cm이다.`, facts: { calc: [[`${X(a)}+${X(b)}`, 0]], unseen: [100] }
            });
          }),
          T('sum-mixed', '문장제: 단위가 섞인 두 길이의 합', '①27', (d) => {
            // 153 cm + 2 m 32 cm = 3 m 85 cm
            const [a, b] = pairSum(d, d.pick(['plain', 'carry']), [1, 3], [1, 4]);
            return M(`노란색 테이프의 길이는 ${LC(a)}이고, 파란색 테이프의 길이는 ${L(b)}이다. 두 테이프를 겹치지 않게 이어 붙인 길이는 몇 m 몇 cm인가?`, ask(a + b), {
              explain: `${a} cm는 ${L(a)}이다. ${L(a)} + ${L(b)} = ${L(a + b)}`, facts: mc(`${a}+${X(b)}`)
            });
          }),
          T('sum-more', '문장제: 「보다 몇 cm 더」', '①27', (d) => {
            // 2 m 65 cm보다 108 cm 더 멀리 → 3 m 73 cm
            const [a, b] = pairSum(d, 'one', [2, 6], [1, 1]), [p, q] = d.shuffle(NAMES);
            return M(`${name(p, '은/는')} 공을 ${L(a)} 던졌다. ${name(q, '은/는')} ${nick(p)}보다 ${LC(b)} 더 멀리 던졌다. ${name(q, '이/가')} 공을 던진 거리는 몇 m 몇 cm인가?`, ask(a + b), {
              explain: `${b} cm는 ${L(b)}이다. ${L(a)} + ${L(b)} = ${L(a + b)}`, facts: mc(`${X(a)}+${b}`)
            });
          }),
          T('sum-both', '합을 두 가지 단위로 나타낸 것 모두 고르기', '①28', (d) => {
            // 750 cm + 127 cm → 877 cm, 8 m 77 cm
            const [a, b] = pairSum(d, 'plain', [3, 7], [1, 2]), s = a + b, m = mOf(s), c = cOf(s);
            const rows = d.shuffle([[LC(s), true], [L(s), true], [`${Math.floor(s / 10)} m ${s % 10} cm`, false], [`${m} m ${c % 10} cm`, false]]), made = pairOptions(d, rows.map((r) => r[1]));
            return C(`길이가 ${LC(a)}인 끈과 ${LC(b)}인 끈이 있다. 두 끈의 길이의 합을 바르게 나타낸 것을 모두 고른 것은?`, made.options, made.answer, {
              figure: tagged(rows.map((r) => r[0])), explain: `${a} cm는 ${L(a)}, ${b} cm는 ${L(b)}이다. 합은 ${L(s)}이고, ${L(s)}는 ${s} cm이다.`,
              facts: { sets: { labels: LABELS, flags: rows.map((r) => r[1]), options: made.sets } }
            });
          }),
          T('sum-ends', '가장 긴 것과 가장 짧은 것의 합', '①29 심16', (d) => {
            // 331 cm, 2 m 23 cm, 142 cm → 3 m 31 cm + 1 m 42 cm
            const t = d.until(() => {
              const m = d.int(2, 4), v = d.shuffle([m * 100 + d.int(11, 60), m * 100 + d.int(11, 60), (m + d.pick([-1, 1, 2])) * 100 + d.int(11, 60)]), cmAt = d.shuffle([0, 1, 2]).slice(0, d.int(1, 2));
              return { v, cmAt, hi: Math.max.apply(null, v), lo: Math.min.apply(null, v) };
            }, (s) => new Set(s.v).size === 3 && cOf(s.hi) + cOf(s.lo) <= 99 && cOf(s.hi) % 10 !== 0 && cOf(s.lo) % 10 !== 0);
            const shown = (v) => (t.cmAt.includes(t.v.indexOf(v)) ? [LC(v), String(v)] : [L(v), X(v)]);
            return M('세 끈의 길이이다. 가장 긴 끈과 가장 짧은 끈의 길이의 합은 몇 m 몇 cm인가?', ask(t.hi + t.lo), {
              figure: numbers(t.v.map((v) => shown(v)[0])), explain: `「몇 m 몇 cm」로 나타내면 ${t.v.map(L).join(', ')}이다. 가장 긴 ${L(t.hi)}와 가장 짧은 ${L(t.lo)}를 더하면 ${L(t.hi + t.lo)}이다.`,
              facts: mc(`${shown(t.hi)[1]}+${shown(t.lo)[1]}`)
            });
          }),
          T('sum-route', '이어진 두 구간의 거리', '①30 심15', (d) => {
            // m가 두 자리이고 m끼리 받아올림: 65 m 50 cm + 27 m 10 cm
            const [a, b] = pairSum(d, d.pick(['tens', 'plain']), [35, 68], [14, 29], (p, q) => mOf(p) + mOf(q) <= 97 && (mOf(p) % 10) + (mOf(q) % 10) >= 10);
            const places = ['집'].concat(d.shuffle(['공원', '학교', '도서관', '놀이터']).slice(0, 2));
            return M(`${places[0]}에서 ${josa(places[1], '을/를')} 지나 ${places[2]}까지 가는 거리는 몇 m 몇 cm인가?`, ask(a + b), {
              figure: road(places, [L(a), L(b)], null, a / (a + b), `길 그림: ${places[0]}에서 ${places[1]}까지 ${L(a)}, ${places[1]}에서 ${places[2]}까지 ${L(b)}`), explain: whySum(a, b), facts: mc(`${X(a)}+${X(b)}`)
            });
          })
        ]
      },
      { id: 'diff', title: '길이의 차', standard: CALC, types: [] },
      { id: 'body', title: '몸의 부분과 1 m로 어림하기', standard: GUESS, types: [] },
      { id: 'sense', title: '알맞은 단위와 실제 길이', standard: GUESS, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
