// 2학년 1학기 6단원 곱셈 — 단원 틀, 그림 도구, 기본 문항(여러 가지 방법으로 세기, 묶어 세기, 몇의 몇 배).
// 영역: 수와 연산. 성취기준 [2수01-10] 곱셈이 이루어지는 실생활 상황과 연결하여 곱셈의 의미를 이해한다.
// 교육과정의 금: 「곱셈의 의미는 배의 개념과 동수누가를 통하여 다루고, 1의 곱과 0의 곱은 실생활과 관련지어 다룬다」
//   (1의 곱·0의 곱과 곱셈구구는 2학년 2학기). 이 단원에서는 곱셈구구를 외워 쓰지 않는다.
// 수집해 둔 교과서 평가 자료의 꼴 목록(기본꼴_1 69꼴 = ①n, 심화꼴 40꼴 = 심n)을 하나씩 따져 옮긴 것이다. 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다.
//
// 싣는 기준
//  - 한 묶음의 수는 2~9, 묶음 수도 2~9이고 곱은 40을 넘지 않는다(거의 다 6~36). 1 × □, □ × 1, 0의 곱은 싣지 않는다.
//    (「4씩 1묶음은 4」처럼 묶어 세는 표의 첫 칸에만 1묶음이 나온다. 곱셈식으로는 적지 않는다.)
//  - 곱은 묶어 세기(4, 8, 12)와 같은 수 거듭 더하기(4 + 4 + 4 = 12)로 구한다. 풀이도 그렇게 적는다.
//    곱셈 기호를 배우기 전 묶음(세기, 묶어 세기, 몇의 몇 배)의 풀이에는 ×를 쓰지 않는다.
//  - 그림의 물건은 줄을 맞추어 놓고, 한 그림에 36개를 넘기지 않는다. 묶음은 둥근 테두리로 두른다(묶는 수를 스스로 정하는 문항은 테두리 없이 줄만 맞춘다).
//    그림 설명(aria-label)에 「몇 개씩 몇 묶음」「한 줄에 몇 개씩 몇 줄」을 적어 검사가 답을 다시 읽는다.
//  - 답은 숫자만 받는다. 곱셈식을 읽은 말, 「몇씩 몇 묶음」 같은 말은 고르기로 받는다.
//  - 같은 그림(묶음 그림·줄 맞춘 그림)이 여러 유형에 나오지만, 묻는 것(묶음 수·전체·몇의 몇 배·덧셈식·곱셈식)이 다를 때만 따로 실었다.
//
// 뺀 것과 까닭(꼴 번호)
//  - 그리기·묶어 표시하기: ①5, ①13, ①19, ①33의 ○ 그리기, 심16(수만 묻는 것은 bundle-fill, times-make 에 실음)
//  - 방법·까닭을 글로 쓰기, 주변에서 찾아 말하기: ①6, ①17, ①19, 심8, 심19, 심33
//  - 세 수의 곱·몇 배의 몇 배(곱을 두 번 엮음): ①45의 보기 「6 × 3 × 3」, ①68, 심38, 심39
//  - 기호 셋을 따로 구해 다시 식에 넣기: ①69
//  - 나눗셈으로만 풀리는 것: 심40(▲의 7배가 28 — 「16은 4의 몇 배」처럼 거듭 더해 찾을 수 있는 것은 times-how 에 실음)
//  - 뜻 없는 셈(구한 값 둘을 그냥 더하기): 심29(문장제로 된 두 곱의 합은 h-sum2 에 실음)
//  - 곱이 40을 넘어 일고여덟 번 더해야 하는 수: ①41의 9를 8번·8을 7번, ①46·①57의 6 × 7, 읽기만 하는 6 × 9·7 × 8·8 × 9(수를 줄여 실음)
// 바꾸어 실은 것
//  - 답이 여럿인 것은 답이 하나가 되게: ①12·①22·심4(묶는 수를 정해 줌), ①24의 「모두 고르기」·①53·심6·심11(맞는 것이 하나뿐이게)
//  - 한글 쓰기는 고르기로: ①39(expr-read)
//  - 그림은 줄 맞춘 물건으로: 쌓기나무(①24·심10·심18), 동물의 다리(①23·심9·심22), 구멍이 있는 단추(①66 — 글로), 성냥개비 도형(심35 — 글로)
// 한 유형으로 묶어 실은 것(하는 일이 같다)
//  - ①2·①12(세는 방법을 정해 주지 않은 전체 수 → count-all), ①3·①7(수 차례의 빈칸 → count-skip), ①9·①10(bundle-fill), ①21·①22·①23(times-picture),
//    ①20·①26(times-say), ①36·①37(expr-write), ①41·①42·①43(expr-sum), ①53·①54(pic-cannot), ①55·①56(word-bundle), ①63·심36·심37(h-sum2)
// 묻는 말: 값을 물을 때는 「~은?/~는?」, 양을 물을 때는 「몇 ~인가?」, 시키는 말은 「~하시오.」. 문장은 짧게, 한 문장에 한 가지만 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, lines, table, numbers, numberLine, N, M, C, E } = B.kit;
  const UNIT = '2-1-6', MEAN = '2수01-10';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 수 고르기와 풀이 글 ──────────────────────────────────────
  // 한 묶음의 수 a(2~9)와 묶음 수 n(2~9). 곱은 6 이상 hi(기본 36) 이하.
  const pair = (d, ok, hi) => d.until(() => [d.int(2, 9), d.int(2, 9)], ([a, n]) => a * n >= 6 && a * n <= (hi || 36) && (!ok || ok(a, n)));
  const plus = (a, n) => Array.from({ length: n }, () => a).join(' + ');        // 4 + 4 + 4
  const plusExpr = (a, n) => Array.from({ length: n }, () => a).join('+');      // 검사가 셈하는 식
  const seq = (a, n) => Array.from({ length: n }, (_, i) => a * (i + 1)).join(', ');   // 4, 8, 12
  const adds = (a, n) => `${plus(a, n)} = ${a * n}`;                            // 4 + 4 + 4 = 12
  const why = (a, n) => `${a} × ${n} = ${plus(a, n)} = ${a * n}`;               // 4 × 3 = 4 + 4 + 4 = 12
  // 곱이 t 인 (한 묶음의 수, 묶음 수) 모두
  const waysOf = (t) => { const out = []; for (let x = 2; x <= 9; x += 1) if (t % x === 0 && t / x >= 2 && t / x <= 9) out.push([x, t / x]); return out; };
  const uniq = (list) => list.filter((p, i) => list.findIndex((q) => q.join() === p.join()) === i);
  const inRange = ([x, y]) => x >= 2 && x <= 9 && y >= 2 && y <= 9 && x * y <= 40;

  // ── 그림 ─────────────────────────────────────────────────────
  const fix = (v) => Math.round(v * 100) / 100;
  const THINGS = {
    bead: { word: '구슬', kind: 'ball', fill: '#93c5fd', line: '#1d4ed8' },
    star: { word: '별', kind: 'star', fill: '#fcd34d', line: '#a86a00' },
    apple: { word: '사과', kind: 'apple', fill: '#f87171', line: '#b91c1c' },
    orange: { word: '귤', kind: 'ball', fill: '#fdba74', line: '#c2410c' },
    cookie: { word: '쿠키', kind: 'cookie', fill: '#e0b27a', line: '#8a5a2b' },
    red: { word: '빨간 구슬', kind: 'ball', fill: '#f87171', line: '#b91c1c' },
    blue: { word: '파란 구슬', kind: 'ball', fill: '#93c5fd', line: '#1d4ed8' }
  };
  const anyThing = (d) => THINGS[d.pick(['bead', 'star', 'apple', 'orange', 'cookie'])];
  // 물건 하나(동그라미·별·사과·네모난 과자)
  function mark(t, cx, cy, r) {
    const st = `style="fill:${t.fill};stroke:${t.line};stroke-width:0.8;stroke-linejoin:round"`;
    if (t.kind === 'star') {
      let p = '';
      for (let i = 0; i < 10; i += 1) { const ang = -Math.PI / 2 + (i * Math.PI) / 5, rad = i % 2 ? r * 0.5 : r * 1.14; p += (i ? 'L' : 'M') + fix(cx + rad * Math.cos(ang)) + ' ' + fix(cy + rad * Math.sin(ang)); }
      return `<path d="${p}Z" ${st}/>`;
    }
    if (t.kind === 'cookie') return `<rect x="${fix(cx - r * 0.92)}" y="${fix(cy - r * 0.92)}" width="${fix(r * 1.84)}" height="${fix(r * 1.84)}" rx="${fix(r * 0.45)}" ${st}/><circle cx="${fix(cx - r * 0.32)}" cy="${fix(cy - r * 0.22)}" r="0.85" style="fill:${t.line}"/><circle cx="${fix(cx + r * 0.36)}" cy="${fix(cy + r * 0.3)}" r="0.85" style="fill:${t.line}"/>`;
    if (t.kind === 'apple') return `<circle cx="${fix(cx)}" cy="${fix(cy + r * 0.1)}" r="${fix(r * 0.9)}" ${st}/><path d="M${fix(cx)} ${fix(cy - r * 0.72)}q${fix(r * 0.12)} ${fix(-r * 0.4)} ${fix(r * 0.55)} ${fix(-r * 0.42)}" style="fill:none;stroke:#166534;stroke-width:1.2;stroke-linecap:round"/>`;
    return `<circle cx="${fix(cx)}" cy="${fix(cy)}" r="${fix(r)}" ${st}/>`;
  }
  // 줄 맞춰 놓은 물건. rows 줄, 한 줄에 cols 개.
  // o.loop: 'rows'(가로줄마다 한 묶음) | 'cols'(세로줄마다 한 묶음)으로 둥근 테두리를 두른다. 없으면 줄만 맞춘다.
  // o.count: 앞에서부터 그만큼만 그린다(하나씩 세기). o.said: 그림 설명을 바꿔 적는다. o.scale: 그림 배율의 한도.
  function array(rows, cols, thing, options) {
    const o = options || {}, R = 6, G = 18.5, LOOP = 6.5, pad = 10;
    const gx = G + (o.loop === 'cols' ? LOOP : 0), gy = G + (o.loop === 'rows' ? LOOP : 0);
    const w0 = pad * 2 + (cols - 1) * gx + R * 2, scale = Math.min(o.scale || 1.35, 288 / w0);
    const width = Math.max(w0, 62 / scale), height = pad * 2 + (rows - 1) * gy + R * 2, left = (width - w0) / 2 + pad + R, top = pad + R;
    const band = 'style="fill:#f4f8ff;stroke:#2563eb;stroke-width:1.1"';
    let out = '';
    if (o.loop === 'rows') for (let r = 0; r < rows; r += 1) out += `<rect x="${fix(left - R - 4)}" y="${fix(top + r * gy - R - 3.5)}" width="${fix((cols - 1) * gx + R * 2 + 8)}" height="${R * 2 + 7}" rx="${R + 3.5}" ${band}/>`;
    if (o.loop === 'cols') for (let c = 0; c < cols; c += 1) out += `<rect x="${fix(left + c * gx - R - 3.5)}" y="${fix(top - R - 4)}" width="${R * 2 + 7}" height="${fix((rows - 1) * gy + R * 2 + 8)}" rx="${R + 3.5}" ${band}/>`;
    const total = o.count || rows * cols;
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) if (r * cols + c < total) out += mark(thing, left + c * gx, top + r * gy, R);
    const said = o.said || (o.count ? `${thing.word} ${total}개` : o.loop === 'rows' ? `${thing.word} ${total}개: ${cols}개씩 ${rows}묶음` : o.loop === 'cols' ? `${thing.word} ${total}개: ${rows}개씩 ${cols}묶음` : `${thing.word} ${total}개: 한 줄에 ${cols}개씩 ${rows}줄`);
    return `<svg class="mb-dots" viewBox="0 0 ${fix(width)} ${fix(height)}" width="${Math.round(width * scale)}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // a 개씩 n 묶음. 한 묶음이 6개 이상이면 가로줄을, 아니면 세로줄을 한 묶음으로 두른다(flat 이면 다섯 묶음까지는 가로줄로).
  const groups = (a, n, thing, flat, scale) => (a >= 6 || (flat && n <= 5) ? array(n, a, thing, { loop: 'rows', scale }) : array(a, n, thing, { loop: 'cols', scale }));
  // 두 가지 물건. sets: [{ thing, n, per }] — 이름표를 왼쪽에 적고 per 개씩 끊어 줄지어 놓는다.
  function twoSets(sets) {
    const R = 6, G = 18.5, pad = 8, gap = 12, labelW = Math.max.apply(null, sets.map((s) => s.thing.word.length)) * 11 + 8;
    const widest = Math.max.apply(null, sets.map((s) => Math.min(s.n, s.per))), width = pad * 2 + labelW + (widest - 1) * G + R * 2;
    let y = pad + R, out = '';
    sets.forEach((s, i) => {
      if (i) { out += `<line x1="${pad}" y1="${fix(y - G + R + gap / 2)}" x2="${fix(width - pad)}" y2="${fix(y - G + R + gap / 2)}" style="stroke:#cbd5e1;stroke-width:1;stroke-dasharray:3 3"/>`; y += gap - (G - R * 2); }
      out += `<text class="mb-axis-label" style="font-size:11px;font-weight:700" x="${pad}" y="${fix(y + 4)}">${s.thing.word}</text>`;
      for (let k = 0; k < s.n; k += 1) out += mark(s.thing, pad + labelW + R + (k % s.per) * G, y + Math.floor(k / s.per) * G, R);
      y += Math.ceil(s.n / s.per) * G;
    });
    const height = y - G + R + pad;
    return `<svg class="mb-dots" viewBox="0 0 ${fix(width)} ${fix(height)}" width="${Math.round(width * Math.min(1.3, 288 / width))}" role="img" aria-label="${sets.map((s) => `${s.thing.word} ${s.n}개`).join(', ')}">${out}</svg>`;
  }
  // 칸으로 나뉜 색 테이프 여럿. list: [{ word, cells, fill, line }]
  function tapes(list) {
    const U = 17, H = 16, pad = 8, labelW = 44, gap = 12;
    const width = pad * 2 + labelW + Math.max.apply(null, list.map((t) => t.cells)) * U, height = pad * 2 + list.length * H + (list.length - 1) * gap;
    let out = '';
    list.forEach((t, i) => {
      const y = pad + i * (H + gap);
      out += `<text class="mb-axis-label" style="font-size:11px;font-weight:700" x="${pad}" y="${y + 11.5}">${t.word}</text>`;
      for (let c = 0; c < t.cells; c += 1) out += `<rect x="${pad + labelW + c * U}" y="${y}" width="${U}" height="${H}" style="fill:${t.fill};stroke:${t.line};stroke-width:0.9"/>`;
    });
    return `<svg class="mb-dots" viewBox="0 0 ${width} ${height}" width="${Math.round(width * Math.min(1.25, 288 / width))}" role="img" aria-label="색 테이프: ${list.map((t) => `${t.word} ${t.cells}칸`).join(', ')}">${out}</svg>`;
  }
  // 0부터 step 씩 n 번 뛰어 세는 수직선. blanks: 수 대신 빈칸으로 두는 곳 { 몇 번째 뛴 곳: 이름표 }
  function skipLine(step, n, blanks) {
    const max = step * n, unit = Math.min(13, 250 / max), x = (v) => fix(16 + v * unit), y = 34, width = fix(32 + max * unit);
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(max)}" y2="${y}"/>`;
    for (let v = 0; v <= max; v += 1) out += `<line class="mb-axis" x1="${x(v)}" y1="${y - (v % step === 0 ? 5 : 3)}" x2="${x(v)}" y2="${y + (v % step === 0 ? 5 : 3)}"/>`;
    for (let k = 0; k < n; k += 1) out += `<path class="mb-jump" d="M${x(k * step)} ${y - 6}Q${x(k * step + step / 2)} ${y - 30} ${x((k + 1) * step)} ${y - 6}"/>`;
    for (let k = 0; k <= n; k += 1) {
      const cx = x(k * step);
      if (blanks[k]) out += `<rect x="${fix(cx - 9)}" y="${y + 8}" width="18" height="16" rx="2.5" style="fill:#fff;stroke:#1f2933;stroke-width:1.4"/><text x="${cx}" y="${y + 20}" text-anchor="middle" style="font-size:10.5px;font-weight:600;fill:#1f2933">${blanks[k]}</text>`;
      else out += `<text class="mb-axis-label" style="font-size:11px;font-weight:700" x="${cx}" y="${y + 20}" text-anchor="middle">${k * step}</text>`;
    }
    return `<svg class="mb-numberline" viewBox="0 0 ${width} 62" width="${Math.round(width * 1.08)}" role="img" aria-label="수직선: 0부터 ${step}씩 ${n}번 뛰어 센다. 뛴 곳의 수 가운데 ${Object.keys(blanks).length}개는 빈칸">${out}</svg>`;
  }
  // 줄 맞춰 놓은 물건을 종이로 가린 그림: 첫 줄과 양 끝 줄만 보인다.
  function covered(rows, cols, thing) {
    const R = 6, G = 18.5, pad = 10, width = pad * 2 + (cols - 1) * G + R * 2, height = pad * 2 + (rows - 1) * G + R * 2, left = pad + R, top = pad + R;
    let out = '';
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) out += mark(thing, left + c * G, top + r * G, R);
    const x0 = left + G * 0.5, x1 = left + (cols - 1.5) * G, y0 = top + G * 0.5, y1 = height - 3;
    out += `<rect x="${fix(x0)}" y="${fix(y0)}" width="${fix(x1 - x0)}" height="${fix(y1 - y0)}" rx="3" style="fill:#e2e8f0;stroke:#64748b;stroke-width:1.1"/>`;
    out += `<path d="M${fix(x0 + 6)} ${fix(y0 + 7)}H${fix(x1 - 6)}M${fix(x0 + 6)} ${fix(y0 + 13)}H${fix((x0 + x1) / 2)}" style="fill:none;stroke:#94a3b8;stroke-width:1;stroke-linecap:round"/>`;
    return `<svg class="mb-dots" viewBox="0 0 ${fix(width)} ${fix(height)}" width="${Math.round(width * Math.min(1.35, 288 / width))}" role="img" aria-label="종이로 일부를 가린 그림: ${josa(thing.word, '이/가')} 한 줄에 ${cols}개씩 ${rows}줄">${out}</svg>`;
  }
  // 꽃 n 송이. 한 송이에 꽃잎이 a 장씩 있다.
  function flowers(a, n) {
    const S = 40, pad = 4, w0 = pad * 2 + n * S, width = Math.max(w0, 60), height = pad * 2 + S, rx = Math.min(5, 25 / a);
    let out = '';
    for (let i = 0; i < n; i += 1) {
      const cx = (width - w0) / 2 + pad + S / 2 + i * S, cy = pad + S / 2;
      for (let k = 0; k < a; k += 1) out += `<ellipse cx="${fix(cx)}" cy="${fix(cy - 10)}" rx="${fix(rx)}" ry="7.5" transform="rotate(${fix((k * 360) / a)} ${fix(cx)} ${fix(cy)})" style="fill:#fbcfe8;stroke:#be185d;stroke-width:0.8"/>`;
      out += `<circle cx="${fix(cx)}" cy="${fix(cy)}" r="4" style="fill:#fcd34d;stroke:#a86a00;stroke-width:0.8"/>`;
    }
    return `<svg class="mb-dots" viewBox="0 0 ${fix(width)} ${height}" width="${Math.round(width * Math.min(1.25, 288 / width))}" role="img" aria-label="꽃 ${n}송이: 한 송이에 꽃잎 ${a}장씩">${out}</svg>`;
  }
  // 한 묶음씩 늘어나는 그림: a 개씩 steps[0] 묶음, steps[1] 묶음, … 을 사이를 띄워 나란히 놓는다.
  function grow(a, steps, thing) {
    const R = 6, G = 18.5, gx = 25, pad = 10, gap = 16, top = pad + R, height = pad * 2 + (a - 1) * G + R * 2;
    let x = pad + R, out = '';
    steps.forEach((n, s) => {
      if (s) { const mid = fix(x + (gap - gx) / 2); out += `<line x1="${mid}" y1="4" x2="${mid}" y2="${fix(height - 4)}" style="stroke:#cbd5e1;stroke-width:1;stroke-dasharray:3 3"/>`; x += gap; }
      for (let c = 0; c < n; c += 1) {
        out += `<rect x="${fix(x - R - 3.5)}" y="${fix(top - R - 4)}" width="${R * 2 + 7}" height="${fix((a - 1) * G + R * 2 + 8)}" rx="${R + 3.5}" style="fill:#f4f8ff;stroke:#2563eb;stroke-width:1.1"/>`;
        for (let r = 0; r < a; r += 1) out += mark(thing, x, top + r * G, R);
        x += gx;
      }
    });
    const width = x - gx + R + pad;
    return `<svg class="mb-dots" viewBox="0 0 ${fix(width)} ${fix(height)}" width="${Math.round(width * Math.min(1.2, 288 / width))}" role="img" aria-label="${thing.word}: ${steps.map((n) => `${a}개씩 ${n}묶음`).join(', ')}">${out}</svg>`;
  }
  // 이름표를 단 작은 그림 여럿
  const tiles = (list) => '<div class="mb-tiles">' + list.map(([label, html]) => `<figure class="mb-tile"><figcaption>${label}</figcaption>${html}</figure>`).join('') + '</div>';
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const SIGNS = ['&gt;', '=', '&lt;'];

  // 여러 가지로 묶을 수 있는 수: 묶는 방법과, 줄 맞춰 놓을 때의 [줄 수, 한 줄의 수]
  const WAYS = { 12: waysOf(12), 16: waysOf(16), 18: waysOf(18), 24: waysOf(24) };
  const BOARD = { 12: [3, 4], 16: [4, 4], 18: [3, 6], 24: [4, 6] };

  // b 파일이 함께 쓰는 도구
  B.kit.g216 = { UNIT, MEAN, T, pair, plus, plusExpr, seq, adds, why, waysOf, uniq, inRange, WAYS, BOARD, fix, THINGS, anyThing, mark, array, groups, twoSets, tapes, skipLine, covered, flowers, grow, tiles, versus, SIGNS };

  B.addUnit({
    id: '2-1-6', grade: 2, semester: 1, no: 6, title: '곱셈', version: 1,
    groups: [
      {
        id: 'count', title: '여러 가지 방법으로 세기', standard: MEAN,
        types: [
          T('count-one', '하나씩 세기', '①1 심1', (d) => {
            const thing = anyThing(d), n = d.int(9, 17);
            return N(`하나씩 세어 보면 ${josa(thing.word, '은/는')} 모두 몇 개인가?`, n, {
              unit: '개', figure: array(Math.ceil(n / 5), 5, thing, { count: n }),
              explain: `1, 2, 3, …으로 하나씩 세면 마지막에 센 수는 ${n}이다.`, facts: { calc: [[String(n), 0]] }
            });
          }),
          T('count-skip', '묶음 그림을 보고 뛰어 세기', '①3 ①7 심1 심3', (d) => {
            // 3, 6, □, □, □
            const thing = anyThing(d), a = d.int(2, 5), n = d.int(4, 6), tags = LABELS.slice(0, n - 2);
            return M(`${josa(thing.word, '을/를')} ${a}씩 뛰어 세었다. ${tags.join(', ')}에 알맞은 수는?`, tags.map((t, i) => ({ label: t, answer: a * (i + 3) })), {
              figure: groups(a, n, thing, d.bool()) + lines([[a, a * 2].concat(tags.map((t) => box(t))).join(', ')]),
              explain: `${a}씩 뛰어 세면 ${seq(a, n)}이다. ${josa(thing.word, '은/는')} 모두 ${a * n}개이다.`,
              facts: { calc: tags.map((t, i) => [plusExpr(a, i + 3), i]) }
            });
          }),
          T('count-line', '수직선에서 뛰어 세기', '심1', (d) => {
            // 0, 2, 4, □, 8, □
            const step = d.int(2, 5), n = d.int(5, 6), [i, j] = d.shuffle([2, 3, 4, 5, 6].filter((k) => k <= n)).slice(0, 2).sort((x, y) => x - y);
            return M(`수직선에서 0부터 ${step}씩 뛰어 세었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: step * i }, { label: LABELS[1], answer: step * j }], {
              figure: skipLine(step, n, { [i]: LABELS[0], [j]: LABELS[1] }),
              explain: `0부터 ${step}씩 뛰어 세면 ${seq(step, n)}이다.`, facts: { calc: [[plusExpr(step, i), 0], [plusExpr(step, j), 1]] }
            });
          }),
          T('count-jump', '몇씩 몇 번 뛰어 센 수', '①4 심2', (d) => {
            const [a, n] = pair(d, (x, y) => y >= 3 && y <= 6);
            return N(`${a}씩 ${n}번 뛰어 센 수는?`, a * n, { explain: `${a}씩 ${n}번 뛰어 세면 ${seq(a, n)}이다.`, facts: { calc: [[E(a, '*', n), 0]] } });
          }),
          T('count-all', '줄 맞춰 놓인 물건의 수', '①2 ①12 심4', (d) => {
            // 세는 방법은 정해 주지 않는다(테두리 없이 줄만 맞춘 그림).
            const thing = anyThing(d), [cols, rows] = pair(d, (x, y) => x >= 3 && y <= 5 && x !== y && x * y >= 12);
            return N(`${josa(thing.word, '은/는')} 모두 몇 개인가?`, rows * cols, {
              unit: '개', figure: array(rows, cols, thing),
              explain: `한 줄에 ${cols}개씩 ${rows}줄이다. ${cols}씩 묶어 세면 ${seq(cols, rows)}이므로 모두 ${rows * cols}개이다.`, facts: { calc: [[E(cols, '*', rows), 0]] }
            });
          })
        ]
      },
      {
        id: 'bundle', title: '묶어 세기', standard: MEAN,
        types: [
          T('bundle-table', '묶음이 늘 때의 수', '①7', (d) => {
            // 4씩 1묶음 4, 2묶음 □, 3묶음 □, 4묶음 □
            const a = d.int(2, 9);
            return M(`${a}씩 묶어 세었다. ㉠, ㉡, ㉢에 알맞은 수는?`, [2, 3, 4].map((k, i) => ({ label: LABELS[i], answer: a * k })), {
              figure: table(['묶음', '수'], [[`${a}씩 1묶음`, a]].concat([2, 3, 4].map((k, i) => [`${a}씩 ${k}묶음`, box(LABELS[i])]))),
              explain: `한 묶음이 늘 때마다 ${a}씩 커진다. ${a}씩 뛰어 세면 ${seq(a, 4)}이다.`, facts: { calc: [2, 3, 4].map((k, i) => [plusExpr(a, k), i]) }
            });
          }),
          T('bundle-count', '정해 준 수씩 묶으면 몇 묶음', '①8', (d) => {
            // 테두리 없는 그림: 세로줄로, 한 줄을 갈라, 또는 두 줄씩 묶어야 한다(한 줄의 수와 묶는 수가 다르다).
            const thing = anyThing(d);
            const [rows, cols, a] = d.until(() => [d.int(2, 4), d.int(3, 8), d.int(2, 9)], ([r, c, k]) => {
              const total = r * c, n = total / k;
              return total >= 8 && total <= 30 && Number.isInteger(n) && n >= 2 && n <= 9 && k !== c && (k === r || c % k === 0 || (k === 2 * r && c % 2 === 0));
            });
            const total = rows * cols, n = total / a;
            return N(`${josa(thing.word, '을/를')} ${a}개씩 묶으면 몇 묶음인가?`, n, {
              unit: '묶음', figure: array(rows, cols, thing),
              explain: `${josa(thing.word, '은/는')} 모두 ${total}개이다. ${a}씩 묶어 세면 ${seq(a, n)}이므로 ${n}묶음이다.`, facts: { calc: [[`${rows}*${cols}/${a}`, 0]] }
            });
          }),
          T('bundle-fill', '묶음 수와 전체 수', '①9 ①10 ①13 심3', (d) => {
            const thing = anyThing(d), [a, n] = pair(d);
            return M(`${josa(thing.word, '을/를')} ${a}개씩 묶었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: a * n }], {
              figure: groups(a, n, thing, d.bool()) + lines([`${a}개씩 ${box(LABELS[0])}묶음이므로 모두 ${box(LABELS[1])}개이다.`]),
              explain: `${a}개씩 ${n}묶음이다. ${a}씩 묶어 세면 ${seq(a, n)}이므로 모두 ${a * n}개이다.`, facts: { calc: [[String(n), 0], [E(a, '*', n), 1]] }
            });
          }),
          T('bundle-add', '묶음 그림을 덧셈식으로', '①11', (d) => {
            // 틀린 보기: 한 번 덜 더한 식, 한 번 더 더한 식, 묶는 수와 묶음 수를 더한 식
            const thing = anyThing(d), [a, n] = pair(d, (x, y) => y >= 3 && y <= 5 && x !== y && x * (y + 1) <= 40);
            const list = d.shuffle([n, n - 1, n + 1].map((k) => [plus(a, k), plusExpr(a, k)]).concat([[`${a} + ${n}`, `${a}+${n}`]]));
            return C(`${thing.word}의 수를 덧셈식으로 바르게 나타낸 것은?`, list.map(([said]) => said), list.findIndex(([, text]) => text === plusExpr(a, n)), {
              figure: groups(a, n, thing, d.bool()), explain: `${a}개씩 ${n}묶음이므로 ${josa(a, '을/를')} ${n}번 더한다. ${adds(a, n)}이다.`,
              facts: { choose: { exprs: list.map(([, text]) => text), rule: 'equals', target: a * n } }
            });
          }),
          T('bundle-two', '두 가지 방법으로 묶어 세기', '①14 ①12 ①17 심4 심5', (d) => {
            // 가로줄로 묶을 때와 세로줄로 묶을 때: 묶는 수가 달라도 전체는 같다.
            const thing = anyThing(d), [cols, rows] = pair(d, (x, y) => x !== y && x >= 3 && y <= 5 && x * y >= 12), total = rows * cols;
            return M(`${josa(thing.word, '을/를')} 두 가지 방법으로 묶어 세었다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: rows }, { label: LABELS[1], answer: cols }, { label: LABELS[2], answer: total }], {
              figure: array(rows, cols, thing) + lines([`${cols}개씩 묶으면 ${box(LABELS[0])}묶음이다.`, `${rows}개씩 묶으면 ${box(LABELS[1])}묶음이다.`, `${josa(thing.word, '은/는')} 모두 ${box(LABELS[2])}개이다.`]),
              explain: `한 줄에 ${cols}개씩 ${rows}줄이므로 ${cols}개씩 묶으면 ${rows}묶음이다. 세로로 ${rows}개씩 묶으면 ${cols}묶음이다. 묶는 방법이 달라도 모두 ${total}개이다.`,
              facts: { calc: [[String(rows), 0], [String(cols), 1], [E(rows, '*', cols), 2]] }
            });
          }),
          T('bundle-pick', '그림에 맞는 「몇씩 몇 묶음」', '①15', (d) => {
            const thing = anyThing(d), [a, n] = pair(d, (x, y) => x !== y && x <= 8 && y <= 8 && (x + 1) * (y + 1) <= 40);
            const list = d.shuffle([[a, n], [a, n + 1], [a + 1, n], [a + 1, n + 1]]);
            return C(`${josa(thing.word, '을/를')} 묶은 그림이다. 바르게 나타낸 것은?`, list.map(([x, y]) => `${x}개씩 ${y}묶음`), list.findIndex(([x, y]) => x === a && y === n), {
              figure: groups(a, n, thing, d.bool()), explain: `한 묶음에 ${a}개씩 들어 있고, 묶음은 ${n}개이다.`,
              facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: a * n } }
            });
          }),
          T('bundle-same', '수가 같은 「몇씩 몇 묶음」', '①16', (d) => {
            // 5씩 4묶음과 수가 같은 것: 4씩 5묶음. 나머지는 묶는 수나 묶음 수가 하나씩 다르다.
            const [a, n, others] = d.until(() => {
              const [x, y] = pair(d, (p, q) => p !== q);
              return [x, y, uniq([[x, y - 1], [x, y + 1], [y, x - 1], [y, x + 1], [y - 1, x], [x + 1, y]]).filter((p) => inRange(p) && p[0] * p[1] !== x * y)];
            }, ([, , pool]) => pool.length >= 3);
            const list = d.shuffle([[n, a]].concat(d.shuffle(others).slice(0, 3)));
            return C(`${a}씩 ${n}묶음과 수가 같은 것은?`, list.map(([x, y]) => `${x}씩 ${y}묶음`), list.findIndex(([x, y]) => x === n && y === a), {
              explain: `${a}씩 ${n}묶음은 ${a * n}이다. ${list.map(([x, y]) => `${x}씩 ${y}묶음은 ${x * y}`).join(', ')}이다.`,
              facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: a * n } }
            });
          }),
          T('bundle-wrong', '잘못 말한 사람 찾기', '①18 심7', (d) => {
            // 구슬 12개: 「6 + 6으로 나타낼 수 있다」「4씩 4묶음이다」「2개씩 묶으면 6묶음이다」
            const thing = anyThing(d), total = d.pick([12, 16, 18, 24]), who = d.shuffle(NAMES).slice(0, 3);
            const ways = d.until(() => d.shuffle(WAYS[total]).slice(0, 3), (list) => list[0][1] <= 4);
            const bad = d.int(0, 2), slip = (k) => (k >= 9 ? k - 1 : k <= 2 ? k + 1 : d.bool() ? k - 1 : k + 1);
            const said = ways.map(([x, k], i) => [x, i === bad ? slip(k) : k]);
            const talk = [
              `${said[0][1] > 1 ? plus(said[0][0], said[0][1] - 1) + ' + ' : ''}${josa(said[0][0], '으로/로')} 나타낼 수 있다.`,
              `${said[1][0]}씩 ${said[1][1]}묶음이다.`,
              `${said[2][0]}개씩 묶으면 ${said[2][1]}묶음이다.`
            ];
            const [bx, bk] = said[bad];
            return C(`${thing.word} ${total}개를 보고 세 사람이 말하였다. 잘못 말한 사람은?`, who, bad, {
              figure: lines(who.map((w, i) => `<span class="mb-tag">${w}</span>${talk[i]}`)),
              explain: `${josa(thing.word, '은/는')} 모두 ${total}개이다. ${bad === 0 ? adds(bx, bk) : `${bx}씩 ${bk}묶음은 ${bx * bk}`}이므로 ${name(who[bad], '이/가')} 잘못 말하였다.`,
              facts: { claimed: said.map(([x, k], i) => [i === 0 ? plusExpr(x, k) : E(x, '*', k), total]), claimedWant: false }
            });
          })
        ]
      },
      {
        id: 'times', title: '몇의 몇 배', standard: MEAN,
        types: [
          T('times-say', '「몇씩 몇 묶음」을 「몇의 몇 배」로', '①20 ①26', (d) => {
            const [a, n] = pair(d, (x, y) => x !== y);
            return M(`${a}씩 ${n}묶음은 ${box(LABELS[0])}의 ${box(LABELS[1])}배이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: n }], {
              explain: `${a}씩 ${n}묶음은 ${a}의 ${n}배이다.`, facts: { calc: [[String(a), 0], [String(n), 1]] }
            });
          }),
          T('times-picture', '묶음 그림을 「몇의 몇 배」로', '①21 ①22 ①23 심9', (d) => {
            const thing = anyThing(d), [a, n] = pair(d, (x, y) => x !== y);
            return N(`${josa(thing.word, '을/를')} ${a}개씩 묶었다. ${thing.word}의 수는 ${a}의 몇 배인가?`, n, {
              unit: '배', figure: groups(a, n, thing, d.bool()), explain: `${a}개씩 ${n}묶음이므로 ${a}의 ${n}배이다.`, facts: { calc: [[String(n), 0]] }
            });
          }),
          T('times-pick', '그림의 수를 「몇의 몇 배」로 고르기', '①24 심6 심10', (d) => {
            // 테두리 없는 그림. 보기마다 값을 구해 그림의 수와 견준다. 맞는 것은 하나뿐이다.
            const thing = anyThing(d), [cols, rows] = pair(d, (x, y) => x >= 3 && y <= 5 && x * y >= 12), total = rows * cols;
            const good = d.pick(waysOf(total));
            // 틀린 보기: 값이 그림의 수에 가까운 것 셋. 앞의 수나 뒤의 수가 정답과 같은 것은 하나씩만 둔다(한 수만 보고 고르지 못하게).
            const near = []; for (let x = 2; x <= 9; x += 1) for (let y = 2; y <= 9; y += 1) if (x * y !== total && Math.abs(x * y - total) <= 8 && x * y <= 40) near.push([x, y]);
            const wrong = d.until(() => d.shuffle(near).slice(0, 3), (three) => three.filter(([x]) => x === good[0]).length <= 1 && three.filter(([, y]) => y === good[1]).length <= 1);
            const list = d.shuffle([good].concat(wrong));
            return C(`${thing.word}의 수를 바르게 나타낸 것은?`, list.map(([x, y]) => `${x}의 ${y}배`), list.findIndex(([x, y]) => x * y === total), {
              figure: array(rows, cols, thing),
              explain: `${josa(thing.word, '은/는')} 한 줄에 ${cols}개씩 ${rows}줄이므로 모두 ${total}개이다. ${good[0]}의 ${good[1]}배는 ${adds(good[0], good[1])}이다.`,
              facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: total } }
            });
          }),
          T('times-two', '같은 수를 두 가지 「몇의 몇 배」로', '①25 심11', (d) => {
            const thing = anyThing(d), [cols, rows] = pair(d, (x, y) => x !== y && x >= 3 && y <= 5 && x * y >= 12);
            return M(`${thing.word}의 수를 몇의 몇 배로 나타내려고 한다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: rows }, { label: LABELS[1], answer: cols }], {
              figure: array(rows, cols, thing) + lines([`${cols}의 ${box(LABELS[0])}배`, `${rows}의 ${box(LABELS[1])}배`]),
              explain: `${cols}개씩 묶으면 ${rows}묶음이므로 ${cols}의 ${rows}배이다. ${rows}개씩 묶으면 ${cols}묶음이므로 ${rows}의 ${cols}배이다.`,
              facts: { calc: [[String(rows), 0], [String(cols), 1]] }
            });
          }),
          T('times-line', '수직선: 뛰어 센 수와 몇의 몇 배', '①27 심13', (d) => {
            const [a, n] = pair(d, (x, y) => x <= 7 && y >= 3 && y <= 6 && x * y <= 30 && x !== y);
            return M('수직선을 보고 ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: n }, { label: LABELS[1], answer: a * n }], {
              figure: numberLine(a * n, a, { hideEnd: true, length: 250 }) + lines([`${a}씩 ${box(LABELS[0])}번 뛰어 센 수는 ${box(LABELS[1])}이다.`, `${a}의 ${box(LABELS[0])}배는 ${box(LABELS[1])}이다.`]),
              explain: `0부터 ${a}씩 ${n}번 뛰어 세면 ${seq(a, n)}이다. ${a}의 ${n}배는 ${a * n}이다.`, facts: { calc: [[String(n), 0], [E(a, '*', n), 1]] }
            });
          }),
          T('times-how', '「몇은 몇의 몇 배」', '①28 심13', (d) => {
            // 거듭 더해 찾는다: 16은 4의 몇 배 → 4 + 4 + 4 + 4 = 16
            const [a, n] = pair(d, (x, y) => y <= 5), p = a * n;
            return N(`${josa(p, '은/는')} ${a}의 몇 배인가?`, n, {
              unit: '배', explain: `${adds(a, n)}이다. ${josa(a, '을/를')} ${n}번 더했으므로 ${josa(p, '은/는')} ${a}의 ${n}배이다.`, facts: { calc: [[E(p, '/', a), 0]] }
            });
          }),
          T('times-compare', '두 가지 물건의 수 비교', '①29 심14', (d) => {
            // 적은 쪽을 한 묶음으로 삼는다. 많은 쪽을 적은 쪽의 수만큼씩 끊어 놓았다.
            const [k, m] = d.until(() => [d.int(2, 5), d.int(2, 5)], ([x, y]) => x * y <= 20 && x !== y), small = THINGS.apple, big = THINGS.orange;
            return N(`${big.word}의 수는 ${small.word}의 수의 몇 배인가?`, m, {
              unit: '배', figure: twoSets([{ thing: small, n: k, per: k }, { thing: big, n: k * m, per: k }]),
              explain: `${josa(small.word, '은/는')} ${k}개, ${josa(big.word, '은/는')} ${k * m}개이다. ${adds(k, m)}이므로 ${big.word}의 수는 ${small.word}의 수의 ${m}배이다.`,
              facts: { calc: [[E(k * m, '/', k), 0]] }
            });
          }),
          T('times-length', '길이의 몇 배', '①30', (d) => {
            const [s, m] = d.until(() => [d.int(2, 4), d.int(2, 5)], ([x, y]) => x * y <= 12 && x !== y);
            return N('파란색 테이프의 길이는 빨간색 테이프의 길이의 몇 배인가?', m, {
              unit: '배', figure: tapes([{ word: '빨간색', cells: s, fill: '#fca5a5', line: '#b91c1c' }, { word: '파란색', cells: s * m, fill: '#93c5fd', line: '#1d4ed8' }]),
              explain: `빨간색 테이프는 ${s}칸, 파란색 테이프는 ${s * m}칸이다. ${adds(s, m)}이므로 ${m}배이다.`, facts: { calc: [[E(s * m, '/', s), 0]] }
            });
          }),
          T('times-given', '문장: 몇 배인지 구하기', '①31 심15', (d) => {
            const [s, m] = pair(d, (x, y) => y <= 5 && x !== y), [one, two] = d.shuffle(NAMES).slice(0, 2);
            return N(`${nick(one)}의 끈은 ${s} cm이다. ${nick(two)}의 끈은 ${s * m} cm이다. ${nick(two)}의 끈의 길이는 ${nick(one)}의 끈의 길이의 몇 배인가?`, m, {
              unit: '배', explain: `${adds(s, m)}이므로 ${s * m} cm는 ${s} cm의 ${m}배이다.`, facts: { calc: [[E(s * m, '/', s), 0]] }
            });
          }),
          T('times-cards', '가장 큰 수는 가장 작은 수의 몇 배', '①32', (d) => {
            // 5, 6, 3, 9 → 9는 3의 3배. 다른 두 수끼리는 같은 배가 되지 않게 고른다.
            const [small, m, x, y] = d.until(() => { const s = d.int(2, 6), k = d.int(2, 5); return [s, k, d.int(s + 1, s * k - 1), d.int(s + 1, s * k - 1)]; }, ([s, k, p, q]) => {
              const all = [s, s * k, p, q];
              let same = 0; for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) if (Math.max(all[i], all[j]) / Math.min(all[i], all[j]) === k) same += 1;
              return s * k <= 30 && p !== q && same === 1;
            });
            const big = small * m, list = d.shuffle([small, big, x, y]);
            return N('가장 큰 수는 가장 작은 수의 몇 배인가?', m, {
              unit: '배', figure: numbers(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${adds(small, m)}이므로 ${m}배이다.`, facts: { divEnds: list }
            });
          }),
          T('times-make', '그림의 몇 배만큼의 수', '①33 심16 심18', (d) => {
            const thing = anyThing(d), [a, n] = pair(d, (x) => x <= 6, 30);
            return N(`그림의 ${n}배만큼 ${josa(thing.word, '을/를')} 놓으려고 한다. ${josa(thing.word, '은/는')} 몇 개 필요한가?`, a * n, {
              unit: '개', figure: array(1, a, thing, { said: `${thing.word} ${a}개` }),
              explain: `그림의 ${josa(thing.word, '은/는')} ${a}개이다. ${a}의 ${n}배는 ${adds(a, n)}이다.`, facts: { calc: [[E(a, '*', n), 0]] }
            });
          }),
          T('times-situation', '상황을 「몇의 몇 배」로', '①34', (d) => {
            const [a, n] = d.until(() => [d.int(7, 9), d.int(3, 4)], ([x, y]) => x * (y + 1) <= 40), who = d.pick(NAMES);
            const list = d.shuffle([[a, n], [a, n - 1], [a, n + 1], [n, a - 1]]);
            return C(`${name(who, '은/는')} ${a}살이다. 삼촌의 나이는 ${nick(who)}의 나이의 ${n}배이다. 삼촌의 나이를 바르게 나타낸 것은?`, list.map(([x, y]) => `${x}의 ${y}배`), list.findIndex(([x, y]) => x === a && y === n), {
              explain: `${a}살의 ${n}배이므로 ${a}의 ${n}배이다.`, facts: { choose: { exprs: list.map(([x, y]) => E(x, '*', y)), rule: 'equals', target: a * n } }
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
