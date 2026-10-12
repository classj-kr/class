// 4학년 2학기 3단원 소수의 덧셈과 뺄셈 — 소수 두 자리 수의 덧셈과 뺄셈, 자릿수가 다른 계산, 계산의 활용, 문장제의 기본 문항과 실력 문항.
// 꼴 목록(기본꼴 1~3, 심화꼴 102꼴)을 꼴마다 따져서 실었다. 단원 틀과 앞쪽 묶음은 4-2-3a.js 에 있다.
//
// 계산 문항은 구조마다 따로 싣는다(받아올림·받아내림이 없는 것, 한 번, 두 번, 0이 낀 수, 합이 1·10을 넘는 것, 자릿수가 다른 것, 자연수에서 빼는 것).
// 글이 같은 꼴이 되므로 facts.rule 에 구조의 이름을 달고, 구조의 조건은 수를 뽑는 코드(hundPair·sixDigits 의 조건)가 지킨다.
// 덧셈과 뺄셈은 소수 두 자리 수의 범위까지만 낸다. 계산 결과가 자연수가 되는 수는 뽑지 않는다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다(보기마다 어떤 아이가 고르는지 주석으로 달았다).
//   ① 자릿수가 많은 소수가 더 크다고 여긴다(0.35 > 0.4). 소수점 아래를 자연수처럼 읽거나 본다.
//   ② 0.5와 0.50을 다른 수로 보거나, 거꾸로 가운데 0(4.05)도 생략할 수 있다고 여긴다.
//   ③ 숫자가 같으면 나타내는 수도 같다고 여긴다(3.33의 세 3). 10개가 넘는 묶음의 수를 그대로 이어 붙인다.
//   ④ 1/10을 구하면 소수점을 기준으로 수가 왼쪽으로 간다고 여기거나(2.45의 1/10을 24.5), 0.1을 빼는 것으로 여긴다.
//   ⑤ 소수점의 자리가 아니라 끝자리를 맞추어 더하고 뺀다(0.7 + 0.45 = 0.52). 0.5 + 0.7 = 0.12 처럼 소수점을 아무 데나 찍는다.
//   ⑥ 자연수나 소수 한 자리 수에서 소수 두 자리 수를 뺄 때 빈 자리의 숫자를 그대로 내려 쓰거나 받아내림을 빠뜨린다(5 − 1.37 = 4.37).
//   ⑦ 단위를 바꿀 때 빈 자리에 0을 쓰지 않는다(1 m 5 cm = 1.5 m).
// 그다음에 두 번 넘게 따져야 하는 문제를 실었다(잘못 구한 값 바로잡기, 어떤 수를 구해 바르게 계산하기, 수 카드로 만든 수의 합과 차, 세 번 계산하는 문장제).
//
// 뺀 것과 까닭(꼴 번호는 ① ② ③ = 기본꼴 1·2·3, 심 = 심화꼴)
//  - 조건 풀이·경우 따지기·퍼즐: 숫자가 가려진 세로셈(①115~117 ②98·99 ③90 심71·72), 숫자를 골라 넣어 식 완성하기(②108 ③95의 변형 심73),
//    숫자 여섯으로 합·차가 가장 큰(작은) 식(②107 심74), 카드 다섯 장으로 차가 가장 큰 식(①122 — 카드도 알 수 없다), 삼각형에 세 수의 합이 같게 놓기(②103),
//    한도 안에서 가장 무겁게 싣기(②123), 용수철에 단 추의 수(심100 — 간격 세기), 세 장을 겹쳐 이어 붙인 길이(심93의 변형 — 겹친 곳의 수 세기)
//  - 범위 밖: 소수 세 자리 수가 낀 덧셈과 뺄셈(②70 ③102의 변형), 0.6 kg짜리 3봉지(③108 — 같은 수를 세 번 더하는 곱셈), 350 mL 5개(심44의 변형), 합과 차로 두 양 구하기(심102)
//  - 답이 자연수가 되는 것: 합·차가 자연수인 계산(①75·91 ②64 ③58의 변형), 합이 10이 되는 두 수 고르기(심61) — 소수 답 칸은 자연수를 받지 않으므로 뽑지 않는다.
//  - 서술형·문제 만들기·작도: 여러 가지 방법으로 계산하기(①123 ②60 ③64), 계산하지 않고 비교하는 까닭(②101), 문제 만들기(②124 ③96)
//  - 그림이 필요해 미룬 것: 평면도에서 남은 길이(심96), 그림 속 길이의 합·차(③109 — 그림을 알 수 없다)
//  - 같은 문제: 이어 붙이고 잘라 낸 길이(심92)는 겹쳐 이어 붙인 길이와, 합한 양보다 더 적은 양(심87)은 합친 뒤 덜어 내기와, 두 수를 골라 차가 가장 큰 식(②91)은
//    가장 큰 수와 가장 작은 수의 차와, 코스의 합 비교(②121)·세 기록의 합 비교(①133)는 두 사람의 합 비교와 셈이 같다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, frac, mixed, expr, lines, tagged, numbers, cards, chain, table, beaker, route, tapes, josa, name, say, N, M, C, D } = B.kit;
  const G = B.kit.geo;
  const NUM = '4수01-13', ORDER = '4수01-14', CALC = '4수01-16';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const signOf = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const quote = (text) => lines([text]);
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  const digit = (d, not) => d.until(() => d.int(1, 9), (v) => !(not || []).includes(v));
  const uniq = (d, len, from) => d.shuffle(from || [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len);

  const PLACES = ['일의 자리', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'];
  const toNum = (digits) => digits.reduce((n, v) => n * 10 + v, 0);

  // ── 수 적기 ────────────────────────────────────────────────────
  // 수는 모두 정수로 뽑아 셈하고(자바스크립트에서 0.1 + 0.2 는 0.3 이 아니다) 글에 적을 때만 소수로 적는다.
  // fx(235, 2) → '2.35'(자릿수 그대로), sx(350, 2) → '3.5'(끝의 0을 뗀다), val(235, 2) → 2.35(답 칸에 넣는 값)
  const P10 = [1, 10, 100, 1000];
  const fx = (n, k) => { const t = String(n).padStart(k + 1, '0'); return k ? t.slice(0, -k) + '.' + t.slice(-k) : t; };
  const sx = (n, k) => { while (k > 0 && n % 10 === 0) { n /= 10; k -= 1; } return fx(n, k); };
  const val = (n, k) => n / P10[k];
  const d1 = (n) => fx(n, 1), d2 = (n) => fx(n, 2), d3 = (n) => fx(n, 3), s2 = (n) => sx(n, 2), s3 = (n) => sx(n, 3);
  // 토씨: 소수는 끝자리 숫자를 마지막에 읽는다(0.3은, 0.25는, 0.50은). 자연수를 적은 글에도 쓴다.
  const BATCHIM = [true, true, false, true, false, false, true, true, true, false], RIEUL = [false, true, false, false, false, false, false, true, true, false];
  const dj = (text, pair) => { const [yes, no] = pair.split('/'), k = Number(String(text).slice(-1)); return text + (yes === '으로' ? (BATCHIM[k] && !RIEUL[k] ? '으로' : '로') : BATCHIM[k] ? yes : no); };
  const tail = (text, pair) => dj(text, pair).slice(String(text).length);
  // 읽기: 소수점 아래는 숫자를 하나씩 읽는다(3.05 → 삼 점 영오).
  const DIGITS = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const read = (text) => { const [w, f] = String(text).split('.'); return (Number(w) ? say(Number(w)) : '영') + ' 점 ' + f.split('').map((c) => DIGITS[c]).join(''); };
  const said = (word) => '「' + word + '」' + josa(word, '이라고/라고').slice(word.length);
  // 단위 기호 뒤 토씨(읽는 소리대로): m·cm·km·L·mL 는 받침 없음, g·kg 은 받침 있음
  const uj = (unit, pair) => unit + pair.split('/')[/g$/.test(unit) ? 0 : 1];
  // 차례 고르기 보기: 값의 차례를 바르게 적은 것 하나와 틀린 것 셋
  const orderChoice = (d, values, labels, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };

  // ── 그림 ──────────────────────────────────────────────────────
  // 100칸 모눈(전체가 1, 한 칸이 0.01). 왼쪽 줄부터 위에서 아래로 first 칸을 파란색, 이어서 second 칸을 노란색으로 칠한다.
  // crossed: 색칠한 칸 가운데 뒤쪽부터 ×표 한 칸 수(덜어 낸 부분).
  function grid100(first, second, crossed) {
    const u = 13, pad = 2, size = u * 10 + pad * 2;
    let out = '';
    for (let i = 0; i < 100; i += 1) {
      const x = pad + Math.floor(i / 10) * u, y = pad + (i % 10) * u;
      out += `<rect class="${i < first ? 'mb-piece is-on' : i < first + (second || 0) ? 'mb-tape-a' : 'mb-piece'}" x="${x}" y="${y}" width="${u}" height="${u}"/>`;
      if (crossed && i >= first - crossed && i < first) out += `<path class="mb-strike" style="stroke-width:1.1" d="M${x + 3} ${y + 3}l${u - 6} ${u - 6}M${x + u - 3} ${y + 3}l${6 - u} ${u - 6}"/>`;
    }
    const told = second ? `${first}칸은 파란색, ${second}칸은 노란색으로 색칠` : `${first}칸을 색칠` + (crossed ? `, 색칠한 칸 가운데 ${crossed}칸에 ×표` : '');
    return `<svg class="mb-pieces" viewBox="0 0 ${size} ${size}" width="${Math.round(size * 1.12)}" role="img" aria-label="모눈종이: 전체를 똑같이 100칸으로 나누고 ${told}">${out}</svg>`;
  }
  // 열 칸 막대(막대 한 개가 1, 한 칸이 0.1). 앞에서부터 first 칸을 파란색, 이어서 second 칸을 노란색으로 칠한다. 열 칸을 넘으면 막대를 하나 더 그린다.
  function bars(first, second, crossed) {
    const total = first + (second || 0), strips = Math.max(1, Math.ceil(total / 10)), u = 24, pad = 2, width = u * 10 + pad * 2, height = strips * (u + 8) - 8 + pad * 2;
    let out = '';
    for (let i = 0; i < strips * 10; i += 1) {
      const x = pad + (i % 10) * u, y = pad + Math.floor(i / 10) * (u + 8);
      out += `<rect class="${i < first ? 'mb-piece is-on' : i < total ? 'mb-tape-a' : 'mb-piece'}" x="${x}" y="${y}" width="${u}" height="${u}"/>`;
      if (crossed && i >= first - crossed && i < first) out += `<path class="mb-strike" d="M${x + 6} ${y + 6}l${u - 12} ${u - 12}M${x + u - 6} ${y + 6}l${12 - u} ${u - 12}"/>`;
    }
    const told = second ? `${first}칸은 파란색, ${second}칸은 노란색으로 색칠` : `${first}칸을 색칠` + (crossed ? `, 색칠한 칸 가운데 ${crossed}칸에 ×표` : '');
    return `<svg class="mb-pieces" viewBox="0 0 ${width} ${height}" width="${width}" role="img" aria-label="막대 그림: 막대 한 개는 1이고 똑같이 10칸으로 나누어 한 칸은 0.1이다. 막대 ${strips}개에 ${told}">${out}</svg>`;
  }
  // 작은 눈금 수직선. labels: 큰 눈금에 적는 글(사이는 열 칸씩), marks: [[왼쪽 끝에서 센 작은 눈금 수, 이름표]].
  function dline(labels, marks) {
    const total = (labels.length - 1) * 10, u = 244 / total, x = (i) => 28 + i * u, y = 46, word = 'style="font-size:13px;font-weight:600"';
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(total)}" y2="${y}"/>`;
    for (let i = 0; i <= total; i += 1) { const len = i % 10 === 0 ? 7 : i % 5 === 0 ? 5 : 3.5; out += `<line class="mb-axis" x1="${x(i).toFixed(1)}" y1="${y - len}" x2="${x(i).toFixed(1)}" y2="${y + len}"/>`; }
    labels.forEach((text, k) => { out += `<text class="mb-axis-label" ${word} x="${x(k * 10)}" y="${y + 24}" text-anchor="middle">${text}</text>`; });
    marks.forEach(([at, tag]) => { out += `<text class="mb-axis-label" ${word} x="${x(at).toFixed(1)}" y="${y - 22}" text-anchor="middle">${tag}</text><path class="mb-pointer" d="M${x(at).toFixed(1)} ${y - 8}l-4 -9h8z"/>`; });
    const told = marks.map(([at, tag]) => `${tag}은 ${labels[0]}에서 작은 눈금 ${at}칸 간 곳`).join(', ');
    return `<svg class="mb-numberline" viewBox="0 0 300 80" width="300" role="img" aria-label="수직선: ${dj(labels[0], '과/와')} ${labels[1]} 사이를 똑같이 10칸으로 나누었다. ${told}">${out}</svg>`;
  }
  // 화살표로 셈을 나타낸 수직선. 작은 눈금 한 칸이 unit(글)이고, 왼쪽 끝에서 오른쪽으로 a 칸 간 다음 b 칸(음수면 왼쪽으로) 더 간다.
  function jumpLine(labels, unit, a, b) {
    const total = (labels.length - 1) * 10, u = 252 / total, x = (i) => 24 + i * u, y = 58, word = 'style="font-size:13px;font-weight:600"', blue = 'style="stroke:#1d4ed8;stroke-width:1.6;fill:none"', red = 'style="stroke:#b42318;stroke-width:1.6;fill:none"';
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(total)}" y2="${y}"/>`;
    for (let i = 0; i <= total; i += 1) { const len = i % 10 === 0 ? 7 : i % 5 === 0 ? 5 : 3.5; out += `<line class="mb-axis" x1="${x(i).toFixed(1)}" y1="${y - len}" x2="${x(i).toFixed(1)}" y2="${y + len}"/>`; }
    labels.forEach((text, k) => { out += `<text class="mb-axis-label" ${word} x="${x(k * 10)}" y="${y + 24}" text-anchor="middle">${text}</text>`; });
    const arrow = (from, to, h, style) => { const p = x(from).toFixed(1), q = x(to).toFixed(1), s = to > from ? -1 : 1; return `<path ${style} d="M${p} ${h}H${q}M${q} ${h}l${s * 6} -3.5M${q} ${h}l${s * 6} 3.5"/><path style="stroke:#8a96a3;stroke-width:0.8;stroke-dasharray:2 2" d="M${p} ${h}V${y - 8}M${q} ${h}V${y - 8}"/>`; };
    out += arrow(0, a, y - 38, blue) + arrow(a, a + b, y - 22, red);
    return `<svg class="mb-numberline" viewBox="0 0 300 92" width="300" role="img" aria-label="수직선: ${labels[0]}부터 ${labels[labels.length - 1]}까지이고 작은 눈금 한 칸은 ${unit}이다. 화살표는 ${labels[0]}에서 오른쪽으로 ${a}칸 간 다음 ${b > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(b)}칸 갔다">${out}</svg>`;
  }
  // 소수의 세로셈(표). 줄은 칸의 배열이고 소수점은 앞 숫자와 한 칸에 적는다('2.'). told: 그림 설명에 적는 식(검사가 이 글에서 수를 읽는다).
  // o.result: 결과 줄의 칸(없으면 빈칸 하나), o.above: 받아올림·받아내림한 수를 적는 윗줄의 칸.
  const DOT = '<span style="display:inline-block;width:0">.</span>';
  function dcol(top, sign, bottom, told, o) {
    const opt = o || {}, width = Math.max(top.length, bottom.length, opt.result ? opt.result.length : 0, opt.above ? opt.above.length : 0), rule = 'border-bottom:2px solid #1f2933;';
    const tds = (list, style) => Array.from({ length: width - list.length }, () => '').concat(list).map((ch) => `<td${style ? ` style="${style}"` : ''}>${String(ch).endsWith('.') ? String(ch).slice(0, -1) + DOT : ch}</td>`).join('');
    return `<table class="mb-longdiv" role="img" aria-label="세로셈: ${told}">`
      + (opt.above ? `<tr style="font-size:0.62em">` + `<td></td>${tds(opt.above)}</tr>` : '')
      + `<tr><td style="min-width:1.3em"></td>${tds(top)}</tr>`
      + `<tr><td style="min-width:1.3em;text-align:center;${rule}">${sign === '+' ? '+' : '−'}</td>${tds(bottom, rule)}</tr>`
      + `<tr><td></td>${opt.result ? tds(opt.result) : `<td colspan="${width}" style="padding-top:5px"><span class="mb-box" style="min-width:${Math.max(2.6, width * 0.9)}em"></span></td>`}</tr></table>`;
  }
  // 소수를 칸으로 나눈다: '2.35' → ['2.', '3', '5'], '14' → ['1', '4']
  const cellsOf = (text) => String(text).match(/\d\.?/g);
  // 소수점 자리를 맞춘 줄들: 자릿수가 모자란 쪽은 빈칸으로 채운다(4.2 와 1.75 → ['4.', '2', ''], ['1.', '7', '5']).
  const aligned = (texts) => { const fr = texts.map((t) => (String(t).split('.')[1] || '').length), most = Math.max(...fr); return texts.map((t, i) => cellsOf(t).concat(Array.from({ length: most - fr[i] }, () => ''))); };
  const SIGN = { '+': '+', '-': '−' };
  // 소수점 자리를 맞춘 세로셈. result 를 주면 결과 줄에 적는다.
  const column = (a, op, b, result) => { const rows = aligned(result ? [a, b, result] : [a, b]); return dcol(rows[0], op, rows[1], `${a} ${SIGN[op]} ${b}` + (result ? ` = ${result}` : ''), result ? { result: rows[2] } : {}); };
  // 10배·1/10 화살표 사슬. 조각이 { step } 이면 화살표 위의 글이다.
  const st = (label) => ({ step: label });
  const dchain = (parts) => '<div class="mb-chain">' + parts.map((p) => (p && p.step !== undefined ? '<span class="mb-step">' + p.step + '</span>' : '<span class="mb-node">' + p + '</span>')).join('') + '</div>';
  const TENTH = frac(1, 10), HUNDREDTH = frac(1, 100), THOUSANDTH = frac(1, 1000);
  const PARTS = { 10: TENTH, 100: HUNDREDTH, 1000: THOUSANDTH };
  const LEFT = '수를 10배 할 때마다 소수점을 기준으로 수가 왼쪽으로 한 자리씩 옮겨 간다.', RIGHT = `수의 ${TENTH}을 구할 때마다 소수점을 기준으로 수가 오른쪽으로 한 자리씩 옮겨 간다.`;
  // 계산 문항. pick(d) 는 [앞 수, 뒤 수]를 100배 한 정수로 돌려준다. places: 글에 적는 소수 자릿수 [앞, 뒤], layout: 'col'(세로셈) | 'row'(가로식).
  // 같은 꼴의 식이 계산 구조만 달리하여 여러 번 실리므로 facts.rule 에 구조의 이름(유형 이름)을 단다. 구조의 조건은 pick 이 지킨다.
  const calcType = (id, title, ref, op, places, layout, pick, why) => T(id, title, ref, (d) => {
    const [a, b] = pick(d), A = fx(a / P10[2 - places[0]], places[0]), Bt = fx(b / P10[2 - places[1]], places[1]), r = op === '+' ? a + b : a - b;
    return D('다음을 계산하시오.', r / 100, {
      figure: layout === 'col' ? column(A, op, Bt) : quote(expr(A, op, Bt, '=', box())),
      explain: `${why} ${A} ${SIGN[op]} ${Bt} = ${s2(r)}`, facts: { calc: [[`${A}${op}${Bt}`, 0]], rule: id }
    });
  });
  const ALIGN = '소수점의 자리를 맞추어 쓰고 자연수의 계산처럼 계산한 다음 소수점을 그대로 내려 찍는다.';

  // ── 소수 두 자리 수의 덧셈과 뺄셈 ──────────────────────────────
  // 두 수를 [일의 자리(wide 이면 자연수 부분 10~19), 소수 첫째 자리, 소수 둘째 자리 숫자] 둘로 뽑아 100배 한 수 둘로 돌려준다.
  const sixDigits = (d, ok, wide) => { const v = d.until(() => [d.int(wide ? 10 : 0, wide ? 19 : 9), d.int(0, 9), d.int(0, 9), d.int(0, 9), d.int(0, 9), d.int(0, 9)], (x) => ok(x[0], x[1], x[2], x[3], x[4], x[5])); return [v[0] * 100 + v[1] * 10 + v[2], v[3] * 100 + v[4] * 10 + v[5]]; };
  // 두 수 모두 소수 두 자리 수(소수 둘째 자리 숫자가 0이 아니다)
  const hundPair = (d, ok, wide) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => h1 >= 1 && h2 >= 1 && ok(w1, t1, h1, w2, t2, h2), wide);
  const HUND_LABELS = ['0', '0.1', '0.2', '0.3', '0.4', '0.5'];
  B.addTypes('4-2-3', 'hund', [
    T('hund-grid-add', '두 색으로 칠한 모눈을 보고 덧셈식 완성하기', '①77 ②54 ③63', (d) => {
      const [a, b] = d.until(() => [d.int(12, 58), d.int(11, 39)], ([x, y]) => y % 10 !== 0 && (x + y) % 10 !== 0 && x + y <= 96);
      return M('전체 크기가 1인 모눈종이에 파란색을 칠하고 이어서 노란색을 칠했다. 그림을 보고 ㉠, ㉡에 알맞은 수를 구하면?', [{ label: LABELS[0], answer: b / 100, decimal: true }, { label: LABELS[1], answer: (a + b) / 100, decimal: true }], {
        figure: grid100(a, b) + quote(expr(s2(a), '+', box(LABELS[0]), '=', box(LABELS[1]))),
        explain: `한 칸은 0.01이다. 노란색은 ${b}칸이므로 ㉠은 ${d2(b)}이고, 색칠한 칸은 모두 ${a + b}칸이므로 ㉡은 ${d2(a + b)}이다.`, facts: { calc: [[`${b}/100`, 0], [`${a}/100+${b}/100`, 1]] }
      });
    }),
    T('hund-grid-sub', '×표 한 모눈을 보고 뺄셈하기', '①94 ②55 ③63', (d) => {
      const [a, b] = d.until(() => { const x = d.int(31, 96); return [x, d.int(12, x - 11)]; }, ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x - y) % 10 !== 0);
      return D('전체 크기가 1인 모눈종이에 색칠한 다음, 색칠한 부분의 일부에 ×표를 하였다. 색칠한 부분 가운데 ×표를 하지 않은 부분은 얼마인지 소수로 나타내면?', (a - b) / 100, {
        figure: grid100(a, 0, b), explain: `색칠한 부분은 ${d2(a)}, ×표 한 부분은 ${d2(b)}이다. 0.01이 ${a - b}개 남으므로 ${d2(a)} − ${d2(b)} = ${d2(a - b)}`, facts: { calc: [[`${a}/100-${b}/100`, 0]] }
      });
    }),
    T('hund-line-add', '수직선을 보고 소수 두 자리 수의 덧셈식 완성하기', '②54·93', (d) => {
      const [a, b] = d.until(() => [d.int(11, 29), d.int(11, 19)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x + y) % 10 !== 0 && x + y <= 48);
      return M('수직선을 보고 ㉠, ㉡에 알맞은 수를 구하면?', [{ label: LABELS[0], answer: b / 100, decimal: true }, { label: LABELS[1], answer: (a + b) / 100, decimal: true }], {
        figure: jumpLine(HUND_LABELS, '0.01', a, b) + quote(expr(d2(a), '+', box(LABELS[0]), '=', box(LABELS[1]))),
        explain: `작은 눈금 한 칸은 0.01이다. ${d2(a)}에서 오른쪽으로 ${b}칸 더 갔으므로 ㉠은 ${d2(b)}이고, 0에서 모두 ${a + b}칸 갔으므로 ㉡은 ${d2(a + b)}이다.`, facts: { calc: [[`0.01*${b}`, 0], [`0.01*${a}+0.01*${b}`, 1]], rule: 'hundredths' }
      });
    }),
    T('hund-line-sub', '수직선을 보고 소수 두 자리 수의 뺄셈식 완성하기', '①94 ②55', (d) => {
      const [a, b] = d.until(() => [d.int(31, 48), d.int(11, 29)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x - y) % 10 !== 0 && x - y >= 4);
      return M('수직선을 보고 ㉠, ㉡에 알맞은 수를 구하면?', [{ label: LABELS[0], answer: b / 100, decimal: true }, { label: LABELS[1], answer: (a - b) / 100, decimal: true }], {
        figure: jumpLine(HUND_LABELS, '0.01', a, -b) + quote(expr(d2(a), '-', box(LABELS[0]), '=', box(LABELS[1]))),
        explain: `작은 눈금 한 칸은 0.01이다. ${d2(a)}에서 왼쪽으로 ${b}칸 되돌아왔으므로 ㉠은 ${d2(b)}이고, 0에서 ${a - b}칸 간 곳이므로 ㉡은 ${d2(a - b)}이다.`, facts: { calc: [[`0.01*${b}`, 0], [`0.01*${a}-0.01*${b}`, 1]], rule: 'hundredths' }
      });
    }),
    T('hund-count-add', '0.01의 개수로 덧셈하기', '①78 ②57 ③62', (d) => {
      const [a, b] = d.until(() => [d.int(102, 589), d.int(12, 98)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x + y) % 10 !== 0 && Number(d2(y)) * 100 === y && Number(d2(x)) * 100 + Number(d2(y)) * 100 === x + y), A = d2(a), Bt = d2(b);
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a + b }, { label: LABELS[2], answer: (a + b) / 100, decimal: true }], {
        figure: quote(`${dj(A, '은/는')} 0.01이 ${a}개, ${dj(Bt, '은/는')} 0.01이 ${box(LABELS[0])}개이다. ${A} + ${dj(Bt, '은/는')} 0.01이 ${box(LABELS[1])}개이므로 ${box(LABELS[2])}이다.`),
        explain: `${dj(Bt, '은/는')} 0.01이 ${b}개이다. 0.01이 모두 ${a} + ${b} = ${a + b}(개)이므로 ${A} + ${Bt} = ${d2(a + b)}`, facts: { calc: [[`${Bt}*100`, 0], [`${A}*100+${Bt}*100`, 1], [`${A}+${Bt}`, 2]], unseen: [100], rule: 'hundredths' }
      });
    }),
    T('hund-count-sub', '0.01의 개수로 뺄셈하기', '①95 ②57 ③62 심52', (d) => {
      const [a, b] = d.until(() => { const x = d.int(102, 189); return [x, d.int(12, 98)]; }, ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x - y) % 10 !== 0 && Number(d2(x)) * 100 === x && Number(d2(x)) * 100 - Number(d2(y)) * 100 === x - y), A = d2(a), Bt = d2(b);
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: a - b }, { label: LABELS[2], answer: (a - b) / 100, decimal: true }], {
        figure: quote(`${dj(A, '은/는')} 0.01이 ${box(LABELS[0])}개, ${dj(Bt, '은/는')} 0.01이 ${b}개이다. ${A} − ${dj(Bt, '은/는')} 0.01이 ${box(LABELS[1])}개이므로 ${box(LABELS[2])}이다.`),
        explain: `${dj(A, '은/는')} 0.01이 ${a}개이다. 0.01이 ${a} − ${b} = ${a - b}(개) 남으므로 ${A} − ${Bt} = ${d2(a - b)}`, facts: { calc: [[`${A}*100`, 0], [`${A}*100-${Bt}*100`, 1], [`${A}-${Bt}`, 2]], unseen: [100], rule: 'hundredths' }
      });
    }),
    T('hund-natural', '자연수의 덧셈을 이용한 소수 두 자리 수의 덧셈', '①79·96', (d) => {
      const [a, b] = d.until(() => [d.int(12, 98), d.int(102, 489)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x + y) % 10 !== 0);
      return M('자연수의 덧셈을 이용하여 소수의 덧셈을 하려고 한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: (a + b) / 100, decimal: true }], {
        figure: lines([expr(a, '+', b, '=', box(LABELS[0])), expr(d2(a), '+', d2(b), '=', box(LABELS[1]))]),
        explain: `${d2(a)}${tail(d2(a), '과/와')} ${dj(d2(b), '은/는')} 0.01이 ${a}개, ${b}개인 수이다. ${a} + ${b} = ${a + b}이므로 0.01이 ${a + b}개인 ${d2(a + b)}이다.`, facts: { calc: [[`${a}+${b}`, 0], [`${d2(a)}+${d2(b)}`, 1]], rule: 'hundredths' }
      });
    }),
    T('hund-frac-add', '분수로 고쳐 덧셈하기', '①80', (d) => {
      const [a, b] = d.until(() => [d.int(102, 389), d.int(12, 98)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x + y) % 10 !== 0 && Number(d2(x)) * 100 === x && Number(d2(x)) * 100 + y === x + y), A = d2(a), Bt = d2(b);
      return M('소수를 분수로 고쳐 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: a + b }, { label: LABELS[2], answer: (a + b) / 100, decimal: true }], {
        figure: quote(`${A} + ${Bt} = ${frac(box(LABELS[0]), 100)} + ${frac(b, 100)} = ${frac(box(LABELS[1]), 100)} = ${box(LABELS[2])}`),
        explain: `${A} = ${frac(a, 100)}, ${Bt} = ${frac(b, 100)}이다. ${frac(a, 100)} + ${frac(b, 100)} = ${frac(a + b, 100)} = ${d2(a + b)}`, facts: { calc: [[`${A}*100`, 0], [`${A}*100+${b}`, 1], [`${A}+${Bt}`, 2]] }
      });
    }),
    T('hund-col-carry', '받아올림한 수가 나타내는 수', '①76 ②59', (d) => {
      const [a, b] = hundPair(d, (w1, t1, h1, w2, t2, h2) => h1 + h2 >= 11 && t1 + t2 + 1 <= 9 && w1 + w2 <= 9 && w1 + w2 >= 1), A = d2(a), Bt = d2(b), rows = aligned([A, Bt, d2(a + b)]);
      return D('덧셈식에서 □ 안의 수 1이 실제로 나타내는 수는?', 0.1, {
        figure: dcol(rows[0], '+', rows[1], `${A} + ${Bt} = ${d2(a + b)}`, { result: rows[2], above: ['', box(1), ''] }),
        explain: '소수 둘째 자리에서 소수 첫째 자리로 받아올림한 수이다. 0.01이 10개인 수이므로 0.1을 나타낸다.', facts: { parts: [['10/100', 0]] }
      });
    }),
    T('hund-col-borrow', '받아내림한 것을 적어 가며 뺄셈하기', '①93 ②59', (d) => {
      // 4.61 − 3.78: 일의 자리 위에 3, 소수 첫째 자리 위에 15, 소수 둘째 자리 위에 10
      const v = d.until(() => [d.int(2, 9), d.int(1, 8), d.int(1, 8), d.int(0, 8), d.int(1, 9), d.int(2, 9)], (x) => x[0] - 1 >= x[3] && x[1] <= x[4] && x[2] < x[5]), a = v[0] * 100 + v[1] * 10 + v[2], b = v[3] * 100 + v[4] * 10 + v[5], A = d2(a), Bt = d2(b), rows = aligned([A, Bt]);
      return M('받아내림한 것을 적어 가며 계산하려고 한다. ㉠에 알맞은 수와 계산 결과는?', [{ label: LABELS[0], answer: v[1] + 9 }, { label: '계산 결과', answer: (a - b) / 100, decimal: true }], {
        figure: dcol(rows[0], '-', rows[1], `${A} − ${Bt}`, { above: [String(v[0] - 1), box(LABELS[0]), '10'] }),
        explain: `소수 첫째 자리 수 ${v[1]}에서 소수 둘째 자리로 받아내림하면 ${v[1] - 1}${tail(v[1] - 1, '이/가')} 남고, 일의 자리에서 받아내림한 10을 더하면 ${v[1] + 9}이다. ${A} − ${Bt} = ${s2(a - b)}`,
        facts: { parts: [[`${v[1]}-1+10`, 0]], calc: [[`${A}-${Bt}`, 1]] }
      });
    }),
    calcType('hund-add-none', '받아올림이 없는 소수 두 자리 수의 덧셈', '①81 ②65 ③65', '+', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => h1 + h2 <= 9 && t1 + t2 <= 9 && t1 + t2 >= 1 && w1 + w2 <= 9), ALIGN),
    calcType('hund-add-low', '소수 둘째 자리에서 받아올림이 있는 덧셈', '①82 ②66 ③66 심49', '+', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => h1 + h2 >= 11 && t1 + t2 + 1 <= 9 && w1 + w2 <= 9 && w1 + w2 >= 1), '소수 둘째 자리 숫자의 합이 10이거나 10보다 크면 소수 첫째 자리로 받아올림한다.'),
    calcType('hund-add-high', '소수 첫째 자리에서 받아올림이 있는 덧셈', '①82 ②66 ③66 심49', '+', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => h1 + h2 <= 9 && t1 + t2 >= 10 && w1 + w2 + 1 <= 9 && w1 + w2 >= 1), '소수 첫째 자리 숫자의 합이 10이거나 10보다 크면 일의 자리로 받아올림한다.'),
    calcType('hund-add-twice', '받아올림이 두 번 있는 덧셈', '①83 ②67 ③67 심49', '+', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => h1 + h2 >= 11 && t1 + t2 + 1 >= 10 && w1 + w2 + 1 <= 9 && w1 + w2 >= 1), '소수 둘째 자리와 소수 첫째 자리에서 차례로 받아올림한다.'),
    calcType('hund-add-over1', '1보다 작은 두 수의 합이 1을 넘는 덧셈', '②67 ③68 심49', '+', [2, 2], 'row', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => w1 === 0 && w2 === 0 && t1 >= 1 && t2 >= 1 && h1 + h2 !== 10 && t1 * 10 + h1 + t2 * 10 + h2 >= 101), '0.01이 100개이면 1이다.'),
    calcType('hund-add-zero', '합의 끝자리가 0이 되는 덧셈', '①82 ②68', '+', [2, 2], 'row', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => h1 + h2 === 10 && (t1 + t2 + 1) % 10 !== 0 && w1 + w2 >= 1 && w1 * 100 + t1 * 10 + h1 + w2 * 100 + t2 * 10 + h2 <= 999), '소수 둘째 자리의 합이 10이면 소수 둘째 자리는 0이 되고, 소수점 아래 끝자리의 0은 생략할 수 있다.'),
    calcType('hund-add-ten', '합이 10을 넘는 소수 두 자리 수의 덧셈', '①82 ②67 ③72', '+', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => w1 >= 2 && w2 >= 2 && h1 + h2 !== 10 && w1 * 100 + t1 * 10 + h1 + w2 * 100 + t2 * 10 + h2 >= 1001), '일의 자리 숫자의 합이 10이거나 10보다 크면 십의 자리로 받아올림한다.'),
    calcType('hund-sub-none', '받아내림이 없는 소수 두 자리 수의 뺄셈', '①97 ②75 ③69', '-', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => w1 > w2 && t1 >= t2 && h1 > h2), ALIGN),
    calcType('hund-sub-low', '소수 둘째 자리 계산에서 받아내림이 있는 뺄셈', '①98 ②76 ③70 심49', '-', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => w1 > w2 && t1 > t2 && h1 < h2), '소수 둘째 자리끼리 뺄 수 없으면 소수 첫째 자리에서 받아내림한다.'),
    calcType('hund-sub-high', '소수 첫째 자리 계산에서 받아내림이 있는 뺄셈', '①98 ②76 ③70', '-', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => w1 - w2 >= 2 && t1 < t2 && h1 > h2), '소수 첫째 자리끼리 뺄 수 없으면 일의 자리에서 받아내림한다.'),
    calcType('hund-sub-twice', '받아내림이 두 번 있는 뺄셈', '①99 ②77 ③71 심49', '-', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => w1 - w2 >= 2 && t1 >= 1 && t1 <= t2 && h1 < h2), '소수 둘째 자리와 소수 첫째 자리 계산에서 차례로 받아내림한다.'),
    calcType('hund-sub-zero', '0이 낀 수에서 빼는 뺄셈', '①98 ②78 ③71', '-', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => w1 - w2 >= 2 && t1 === 0 && t2 >= 1 && h1 !== h2), '소수 첫째 자리가 0이면 일의 자리에서 먼저 받아내림한다.'),
    calcType('hund-sub-small', '차가 0.1보다 작은 뺄셈', '①99 ②76 ③70', '-', [2, 2], 'row', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => h1 < h2 && w1 * 100 + t1 * 10 + h1 - (w2 * 100 + t2 * 10 + h2) >= 1 && w1 * 100 + t1 * 10 + h1 - (w2 * 100 + t2 * 10 + h2) <= 9), '차가 0.01이 몇 개인 수이면 일의 자리와 소수 첫째 자리에 0을 쓴다.'),
    calcType('hund-sub-ten', '십의 자리가 있는 수의 뺄셈', '③72', '-', [2, 2], 'col', (d) => hundPair(d, (w1, t1, h1, w2, t2, h2) => w2 >= 2 && h1 !== h2 && (t1 < t2 || h1 < h2), true), '낮은 자리부터 차례로 계산하고, 뺄 수 없으면 바로 윗자리에서 받아내림한다.')
  ]);

  // ── 자릿수가 다른 소수의 덧셈과 뺄셈 ───────────────────────────
  // 잘못 계산한 세로셈: 소수점의 자리를 맞추지 않고 끝자리를 맞추어 적었다. 줄마다 오른쪽 끝을 맞춘다.
  const misaligned = (a, op, b, result) => dcol(cellsOf(a), op, cellsOf(b), `${a} ${SIGN[op]} ${b} = ${result}`, { result: cellsOf(result) });
  B.addTypes('4-2-3', 'mixed', [
    T('mixed-count', '0.01의 개수로 자릿수가 다른 뺄셈하기', '③73', (d) => {
      const [a, b] = d.until(() => { const x = d.int(21, 98); return [x * 10, d.int(102, x * 10 - 11)]; }, ([x, y]) => x % 100 !== 0 && y % 10 !== 0 && Number(s2(x)) * 100 === x && Number(s2(x)) * 100 - Number(d2(y)) * 100 === x - y), A = s2(a), Bt = d2(b);
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: a - b }, { label: LABELS[2], answer: (a - b) / 100, decimal: true }], {
        figure: quote(`${dj(A, '은/는')} 0.01이 ${box(LABELS[0])}개, ${dj(Bt, '은/는')} 0.01이 ${b}개이다. ${A} − ${dj(Bt, '은/는')} 0.01이 ${box(LABELS[1])}개이므로 ${box(LABELS[2])}이다.`),
        explain: `${dj(A, '은/는')} ${d2(a)}${tail(d2(a), '과/와')} 같으므로 0.01이 ${a}개이다. 0.01이 ${a} − ${b} = ${a - b}(개) 남으므로 ${A} − ${Bt} = ${d2(a - b)}`, facts: { calc: [[`${A}*100`, 0], [`${A}*100-${Bt}*100`, 1], [`${A}-${Bt}`, 2]], unseen: [100], rule: 'mixed' }
      });
    }),
    calcType('mixed-add-21', '소수 두 자리 수와 소수 한 자리 수의 덧셈(받아올림 없음)', '①84 ②69 ③74 심50', '+', [2, 1], 'col', (d) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => h1 >= 1 && h2 === 0 && t2 >= 1 && t1 + t2 <= 9 && w1 + w2 <= 9), '소수점의 자리를 맞추어 쓴다. 소수 한 자리 수의 소수 둘째 자리에는 0이 있다고 생각한다.'),
    calcType('mixed-add-21c', '소수 두 자리 수와 소수 한 자리 수의 덧셈(받아올림 있음)', '①84 ②69 ③75 심50', '+', [2, 1], 'col', (d) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => h1 >= 1 && h2 === 0 && t2 >= 1 && t1 + t2 >= 10 && w1 + w2 + 1 <= 9), '소수점의 자리를 맞추어 쓰고, 소수 첫째 자리에서 일의 자리로 받아올림한다.'),
    calcType('mixed-add-12', '소수 한 자리 수와 소수 두 자리 수의 덧셈', '①84 ②69 ③75 심50', '+', [1, 2], 'row', (d) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => h1 === 0 && t1 >= 1 && h2 >= 1 && t1 + t2 >= 10 && w1 + w2 + 1 <= 9), '끝자리가 아니라 소수점의 자리를 맞추어 같은 자리 숫자끼리 더한다.'),
    calcType('mixed-add-whole', '자연수와 소수 두 자리 수의 덧셈', '②69 ③75', '+', [0, 2], 'row', (d) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => w1 >= 1 && t1 === 0 && h1 === 0 && h2 >= 1 && w1 + w2 <= 9), '자연수는 일의 자리끼리 더한다. 소수점 아래의 수는 그대로 쓴다.'),
    calcType('mixed-sub-21', '소수 두 자리 수에서 소수 한 자리 수를 빼는 뺄셈(받아내림 없음)', '①100 ②79 ③76 심50', '-', [2, 1], 'col', (d) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => h1 >= 1 && h2 === 0 && t2 >= 1 && t1 >= t2 && w1 > w2), '소수점의 자리를 맞추어 쓴다. 소수 둘째 자리 숫자는 그대로 내려 쓴다.'),
    calcType('mixed-sub-21b', '소수 두 자리 수에서 소수 한 자리 수를 빼는 뺄셈(받아내림 있음)', '①100 ②79 ③76 심50', '-', [2, 1], 'col', (d) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => h1 >= 1 && h2 === 0 && t1 < t2 && w1 - w2 >= 2), '소수점의 자리를 맞추어 쓰고, 소수 첫째 자리끼리 뺄 수 없으면 일의 자리에서 받아내림한다.'),
    calcType('mixed-sub-12', '소수 한 자리 수에서 소수 두 자리 수를 빼는 뺄셈(받아내림 한 번)', '①101 ②80 ③77 심50', '-', [1, 2], 'col', (d) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => h1 === 0 && h2 >= 1 && t1 - 1 >= t2 && w1 > w2), '빈 소수 둘째 자리에 0이 있다고 생각하고 소수 첫째 자리에서 받아내림한다.'),
    calcType('mixed-sub-12b', '소수 한 자리 수에서 소수 두 자리 수를 빼는 뺄셈(받아내림 두 번)', '①101 ②80 ③77 심50', '-', [1, 2], 'row', (d) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => h1 === 0 && h2 >= 1 && t1 >= 1 && t1 <= t2 && w1 - w2 >= 2), '빈 소수 둘째 자리에 0이 있다고 생각하고, 소수 첫째 자리와 일의 자리에서 차례로 받아내림한다.'),
    calcType('mixed-sub-whole', '자연수에서 소수 두 자리 수를 빼는 뺄셈', '②81 ③78', '-', [0, 2], 'row', (d) => sixDigits(d, (w1, t1, h1, w2, t2, h2) => t1 === 0 && h1 === 0 && h2 >= 1 && t2 >= 1 && w1 - w2 >= 2), '자연수의 소수 첫째 자리와 소수 둘째 자리에 0이 있다고 생각하고 일의 자리에서 받아내림한다.'),
    T('mixed-wrong-add', '소수점의 자리를 맞추지 않은 덧셈 바로잡기', '①85 ②83 ③79 심51', (d) => {
      // 3.25 + 3.2 = 3.57: 끝자리를 맞추어 325 + 32 를 계산하였다.
      const [a, b] = d.until(() => [d.int(102, 689), d.int(11, 59)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0), A = d2(a), Bt = d1(b), wrong = d2(a + b), right = a + b * 10;
      return D('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', right / 100, {
        figure: misaligned(A, '+', Bt, wrong), explain: `소수점의 자리를 맞추지 않고 끝자리를 맞추어 계산하였다. 소수점의 자리를 맞추어 계산하면 ${A} + ${Bt} = ${s2(right)}이다.`, facts: { calc: [[`${A}+${Bt}`, 0]], rule: 'mixed-wrong-add' }
      });
    }),
    T('mixed-wrong-sub', '소수점의 자리를 맞추지 않은 뺄셈 바로잡기', '①102 ②83 ③79 심51', (d) => {
      // 6.25 − 2.4 = 6.01: 끝자리를 맞추어 625 − 24 를 계산하였다.
      const [a, b] = d.until(() => [d.int(302, 989), d.int(11, 59)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && x - y * 10 >= 50), A = d2(a), Bt = d1(b), wrong = d2(a - b), right = a - b * 10;
      return D('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', right / 100, {
        figure: misaligned(A, '-', Bt, wrong), explain: `소수점의 자리를 맞추지 않고 끝자리를 맞추어 계산하였다. 소수점의 자리를 맞추어 계산하면 ${A} − ${Bt} = ${s2(right)}이다.`, facts: { calc: [[`${A}-${Bt}`, 0]], rule: 'mixed-wrong-sub' }
      });
    }),
    T('mixed-claimed', '바르게 계산한 식 고르기', '②84', (d) => {
      // 틀린 식: 끝자리를 맞춘 것, 받아올림을 빠뜨린 것, 빈 자리의 숫자를 그대로 내려 쓴 것, 자연수에서 뺄 때 받아내림을 빠뜨린 것
      const right = d.int(0, 3);
      const s1 = () => { const [a, b] = d.until(() => [d.int(102, 589), d.int(11, 39)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x + y) % 10 !== 0); return [`${d2(a)} + ${d1(b)}`, `${a}+${b * 10}`, a + b * 10, a + b]; };
      const s2x = () => { const [a, b] = hundPair(d, (w1, t1, h1, w2, t2, h2) => h1 + h2 >= 11 && t1 + t2 + 1 <= 9 && w1 + w2 <= 9 && w1 + w2 >= 1); return [`${d2(a)} + ${d2(b)}`, `${a}+${b}`, a + b, a + b - 10]; };
      const s3 = () => { const [a, b] = sixDigits(d, (w1, t1, h1, w2, t2, h2) => h1 === 0 && h2 >= 2 && t1 >= 1 && t1 < t2 && w1 - w2 >= 2); return [`${s2(a)} − ${d2(b)}`, `${a}-${b}`, a - b, a - b + 2 * (b % 10)]; };
      const s4 = () => { const w = d.int(3, 9), b = d.int(1, w - 2) * 10 + d.int(1, 9); return [`${w} − ${d1(b)}`, `${w * 100}-${b * 10}`, w * 100 - b * 10, w * 100 - b * 10 + 100]; };
      const rows = [s1(), s2x(), s3(), s4()].map(([text, e, good, bad], i) => ({ text: `${text} = ${s2(i === right ? good : bad)}`, e, said: i === right ? good : bad, fix: `${text} = ${s2(good)}` }));
      return C('바르게 계산한 것은?', rows.map((row) => row.text), right, {
        explain: `소수점의 자리를 맞추어 같은 자리 숫자끼리 계산한다. 바르게 계산한 것은 「${rows[right].text}」이다.`, facts: { claimed: rows.map((row) => [row.e, row.said]), claimedWant: true }
      });
    })
  ]);

  // ── 덧셈과 뺄셈의 활용 ─────────────────────────────────────────
  // 100배 한 정수로 뽑는다: two 는 소수 두 자리 수(끝자리가 0이 아니다), one 은 소수 한 자리 수(100배 하면 10의 배수이고 100의 배수는 아니다).
  const two = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  const one = (d, lo, hi) => d.until(() => d.int(Math.ceil(lo / 10), Math.floor(hi / 10)), (v) => v % 10 !== 0) * 10;
  // 부등호로 이은 식(왼쪽이 더 작다)
  const lt = (...parts) => '<span class="mb-expr">' + parts.join(' <i>&lt;</i> ') + '</span>';
  B.addTypes('4-2-3', 'use', [
    T('use-more', '~보다 ~만큼 더 큰 수', '①103 ②85 ③82 심53', (d) => {
      const [a, b] = d.until(() => [two(d, 105, 689), two(d, 105, 389)], ([x, y]) => (x + y) % 10 !== 0), A = d2(a), Bt = d2(b);
      return D(`${A}보다 ${Bt}만큼 더 큰 수는?`, (a + b) / 100, { explain: `${A} + ${Bt} = ${d2(a + b)}`, facts: { calc: [[`${A}+${Bt}`, 0]] } });
    }),
    T('use-less', '~보다 ~만큼 더 작은 수', '①103 ②85 ③82 심53', (d) => {
      const [a, b] = d.until(() => [one(d, 310, 980), two(d, 105, 589)], ([x, y]) => x - y >= 50), A = s2(a), Bt = d2(b);
      return D(`${A}보다 ${Bt}만큼 더 작은 수는?`, (a - b) / 100, { explain: `${A} − ${Bt} = ${d2(a - b)}`, facts: { calc: [[`${A}-${Bt}`, 0]] } });
    }),
    T('use-sum-diff', '두 수의 합과 차', '②85 ③80', (d) => {
      const [a, b] = d.until(() => [one(d, 20, 590), two(d, 2, 389)], ([x, y]) => x > y), A = s2(a), Bt = d2(b);
      return M(`${dj(A, '과/와')} ${Bt}의 합과 차는?`, [{ label: '합', answer: (a + b) / 100, decimal: true }, { label: '차', answer: (a - b) / 100, decimal: true }], {
        explain: `소수점의 자리를 맞추어 계산한다. ${A} + ${Bt} = ${d2(a + b)}, ${A} − ${Bt} = ${d2(a - b)}`, facts: { calc: [[`${A}+${Bt}`, 0], [`${A}-${Bt}`, 1]] }
      });
    }),
    T('use-compare', '뺄셈과 덧셈의 계산 결과 비교', '①104 ②88 ③86 심55', (d) => {
      const [a, b, c, e] = d.until(() => { const x = two(d, 105, 389), y = two(d, 12, x - 60), z = one(d, 20, 190); return [x, y, z, x - y - z + d.int(-25, 25)]; }, (v) => v[3] > 10 && v[3] % 10 !== 0 && v[0] - v[1] !== v[2] + v[3]);
      const L = `${d2(a)} − ${d2(b)}`, R = `${s2(c)} + ${d2(e)}`;
      return C('계산 결과의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, signOf(a - b, c + e), {
        figure: versus(L, R), explain: `${L} = ${s2(a - b)}, ${R} = ${s2(c + e)}이다.`, facts: { choose: { exprs: [`${d2(a)}-${d2(b)}`, `${s2(c)}+${d2(e)}`], rule: 'compare' } }
      });
    }),
    T('use-compare-near', '두 덧셈의 계산 결과 비교', '②88 ③86 심55', (d) => {
      // 6.32 + 4.09 와 4.1 + 6.31: 한쪽을 조금 늘리고 다른 쪽을 그만큼 줄이면 합이 같다.
      const [a, b, c, e] = d.until(() => { const x = two(d, 205, 689), y = two(d, 105, 489), k = d.int(1, 9); return [x, y, y + k, x - k + d.pick([0, 0, -1, 1])]; }, (v) => v[3] % 10 !== 0 && (v[0] + v[1] === v[2] + v[3]) === (Number(d2(v[0])) + Number(d2(v[1])) === Number(s2(v[2])) + Number(d2(v[3]))));
      const L = `${d2(a)} + ${d2(b)}`, R = `${s2(c)} + ${d2(e)}`;
      return C('계산 결과의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, signOf(a + b, c + e), {
        figure: versus(L, R), explain: `${L} = ${s2(a + b)}, ${R} = ${s2(c + e)}이다.`, facts: { choose: { exprs: [`${d2(a)}+${d2(b)}`, `${s2(c)}+${d2(e)}`], rule: 'compare' }, rule: 'near' }
      });
    }),
    T('use-order', '계산 결과를 큰 것부터 차례로', '①105 ②89 심56', (d) => {
      const rows = d.until(() => [0, 1, 2].map(() => { const r = two(d, 45, 240), y = two(d, 105, 589); return [r + y, y, r]; }), (list) => new Set(list.map((row) => row[2])).size === 3 && list.every((row) => row[0] % 10 !== 0 && row[0] <= 989));
      const pick = orderChoice(d, rows.map((row) => row[2]), LABELS, true);
      return C('계산 결과가 큰 것부터 차례로 쓴 것은?', pick.options, pick.answer, {
        figure: tagged(rows.map((row) => `${d2(row[0])} − ${d2(row[1])}`)), explain: `계산 결과는 ㉠ ${d2(rows[0][2])}, ㉡ ${d2(rows[1][2])}, ㉢ ${d2(rows[2][2])}이다.`,
        facts: { choose: { exprs: rows.map((row) => `${d2(row[0])}-${d2(row[1])}`), rule: 'descending', orders: pick.list } }
      });
    }),
    T('use-max', '계산 결과가 가장 큰(작은) 것', '②89 ③87 심56', (d) => {
      // 덧셈과 뺄셈을 섞고 자릿수가 다른 수를 넣는다.
      const rows = d.until(() => { const base = d.int(420, 780); return [0, 1, 2, 3].map((i) => { const r = base + d.int(-40, 40); if (i % 2 === 0) { const x = one(d, 110, r - 60); return [`${s2(x)} + ${d2(r - x)}`, `${s2(x)}+${d2(r - x)}`, r, r - x]; } const y = two(d, 105, 289); return [`${s2(r + y)} − ${d2(y)}`, `${s2(r + y)}-${d2(y)}`, r, r + y]; }); },
        (list) => new Set(list.map((row) => row[2])).size === 4 && list.every((row) => row[3] % 10 !== 0 && row[3] > 10)), big = d.bool(), best = big ? Math.max(...rows.map((row) => row[2])) : Math.min(...rows.map((row) => row[2]));
      return C(`계산 결과가 가장 ${big ? '큰' : '작은'} 것은?`, LABELS, rows.findIndex((row) => row[2] === best), {
        figure: tagged(rows.map((row) => row[0])), explain: `계산 결과는 차례로 ${rows.map((row) => s2(row[2])).join(', ')}이다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: big ? 'max' : 'min' } }
      });
    }),
    T('use-below', '계산 결과가 1보다 작은 것', '①106 ②89 심57', (d) => {
      const rows = d.until(() => d.shuffle([two(d, 55, 98), two(d, 101, 128), two(d, 101, 128), two(d, 101, 128)]).map((r, i) => { if (i % 2 === 0) { const x = one(d, 20, r - 12); return [`${s2(x)} + ${d2(r - x)}`, `${s2(x)}+${d2(r - x)}`, r, r - x]; } const y = two(d, 35, 889); return [`${s2(r + y)} − ${d2(y)}`, `${s2(r + y)}-${d2(y)}`, r, r + y]; }),
        (list) => new Set(list.map((row) => row[2])).size === 4 && list.every((row) => row[3] % 10 !== 0 && row[3] > 10));
      return C('계산 결과가 1보다 작은 것은?', LABELS, rows.findIndex((row) => row[2] < 100), {
        figure: tagged(rows.map((row) => row[0])), explain: `계산 결과는 차례로 ${rows.map((row) => s2(row[2])).join(', ')}이다. 1보다 작은 것은 ${s2(rows.find((row) => row[2] < 100)[2])}이다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'onlyBelow', target: 1 } }
      });
    }),
    T('use-match', '식과 계산 결과 짝 짓기', '①105 ②87 심54', (d) => {
      const rows = d.until(() => [0, 1, 2].map(() => { const x = one(d, 310, 980), y = one(d, 110, x - 110); return [x, y]; }), (list) => new Set(list.map(([x, y]) => x - y)).size === 3 && list.every(([x, y]) => (x - y) % 100 !== 0 && Number(s2(x)) - Number(s2(y)) === (x - y) / 100));
      const vals = rows.map(([x, y]) => (x - y) / 100), right = [0, 1, 2], orders = d.shuffle([right].concat(d.shuffle(ORDERS.filter((o) => o.join() !== '0,1,2')).slice(0, 3)));
      return C('세 식의 계산 결과를 ㉠, ㉡, ㉢의 차례로 쓴 것은?', orders.map((o) => o.map((i) => vals[i]).join(', ')), orders.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map(([x, y]) => `${s2(x)} − ${s2(y)}`)), explain: rows.map(([x, y]) => `${s2(x)} − ${s2(y)} = ${s2(x - y)}`).join(', '),
        facts: { match: { exprs: rows.map(([x, y]) => `${s2(x)}-${s2(y)}`), options: orders.map((o) => o.map((i) => vals[i])) } }
      });
    }),
    T('use-odd', '계산 결과가 다른 하나', '②89 ③87 심57', (d) => {
      const r = two(d, 35, 189), other = d.until(() => r + d.pick([-1, 1]) * d.pick([10, 20, 30, 100]), (v) => v > 10), odd = d.int(0, 2);
      const rows = d.until(() => [0, 1, 2].map((i) => { const v = i === odd ? other : r, y = two(d, 12, 589); return [v + y, y, v]; }), (list) => list.every((row) => row[0] % 10 !== 0) && new Set(list.map((row) => row[1])).size === 3);
      return C('계산 결과가 나머지와 다른 하나는?', LABELS.slice(0, 3), odd, {
        figure: tagged(rows.map((row) => `${d2(row[0])} − ${d2(row[1])}`)), explain: `계산 결과는 ㉠ ${d2(rows[0][2])}, ㉡ ${d2(rows[1][2])}, ㉢ ${d2(rows[2][2])}이다.`, facts: { choose: { exprs: rows.map((row) => `${d2(row[0])}-${d2(row[1])}`), rule: 'odd' } }
      });
    }),
    T('use-same', '계산 결과가 같은 두 식', '②87 ③85', (d) => {
      // 덧셈 둘과 뺄셈 둘 가운데 값이 같은 것은 덧셈 하나와 뺄셈 하나뿐이다.
      const made = d.until(() => {
        const vs = [two(d, 305, 589), two(d, 305, 589), 0, two(d, 305, 589)]; vs[2] = vs[d.int(0, 1)];
        const rows = vs.map((v, i) => { if (i < 2) { const x = two(d, 105, v - 105); return [`${d2(x)} + ${d2(v - x)}`, v, Number(d2(x)) + Number(d2(v - x)), v - x]; } const y = two(d, 105, 389); return [`${d2(v + y)} − ${d2(y)}`, v, Number(d2(v + y)) - Number(d2(y)), v + y]; });
        return { vs, rows };
      }, ({ vs, rows }) => vs[0] !== vs[1] && vs[3] !== vs[0] && vs[3] !== vs[1] && rows.every((row) => row[3] % 10 !== 0) && [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]].every(([i, j]) => (rows[i][2] === rows[j][2]) === (vs[i] === vs[j])));
      const { vs, rows } = made, same = vs[2] === vs[0] ? [0, 2] : [1, 2], pairs = d.shuffle([same, vs[2] === vs[0] ? [1, 2] : [0, 2], [0, 3], [1, 3]]);
      return C('계산 결과가 같은 두 식은?', pairs.map((p) => p.map((i) => LABELS[i]).join(', ')), pairs.indexOf(same), {
        figure: tagged(rows.map((row) => row[0])), explain: `계산 결과는 차례로 ${vs.map((v) => d2(v)).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map((row) => row[0].replace(/ /g, '').replace('−', '-')), rule: 'same', pairsShown: pairs } }
      });
    }),
    T('use-ends-sum', '가장 큰 수와 가장 작은 수의 합', '①107 ②90 ③81 심59', (d) => {
      const list = d.until(() => [two(d, 35, 98), two(d, 35, 98), two(d, 35, 98), two(d, 35, 98)], (xs) => new Set(xs).size === 4 && (Math.max(...xs) + Math.min(...xs)) % 10 !== 0), hi = Math.max(...list), lo = Math.min(...list);
      return D('가장 큰 수와 가장 작은 수의 합은?', (hi + lo) / 100, { figure: numbers(list.map(d2)), explain: `가장 큰 수는 ${d2(hi)}, 가장 작은 수는 ${d2(lo)}이다. ${d2(hi)} + ${d2(lo)} = ${d2(hi + lo)}`, facts: { calc: [[`${d2(hi)}+${d2(lo)}`, 0]], ends: list } });
    }),
    T('use-ends-diff', '자릿수가 섞인 수 가운데 가장 큰 수와 가장 작은 수의 차', '①108 ②90·91 ③81 심59·61', (d) => {
      // 3.01, 2.99, 3.1: 자릿수가 적은 3.1이 가장 크다.
      const w = d.int(2, 8), list = d.shuffle([w * 100 + d.int(1, 9) * 10, w * 100 + d.int(1, 9), w * 100 - d.int(1, 9), w * 100 - d.int(11, 89)]).slice(0, 3 + d.int(0, 1)), hi = Math.max(...list), lo = Math.min(...list);
      const fixed = (hi - lo) % 100 === 0 ? list.map((v) => (v === lo ? v - 1 : v)) : list, low = Math.min(...fixed);
      return D('가장 큰 수와 가장 작은 수의 차는?', (hi - low) / 100, { figure: numbers(fixed.map(s2)), explain: `가장 큰 수는 ${s2(hi)}, 가장 작은 수는 ${s2(low)}이다. ${s2(hi)} − ${s2(low)} = ${s2(hi - low)}`, facts: { calc: [[`${s2(hi)}-${s2(low)}`, 0]], ends: fixed } });
    }),
    T('use-ends-three', '가장 큰 수와 가장 작은 수의 합에서 나머지 수 빼기', '심60', (d) => {
      const list = d.until(() => [two(d, 205, 889), two(d, 205, 889), two(d, 205, 889)], (xs) => { const s = xs.slice().sort((p, q) => p - q); return s[1] - s[0] >= 60 && s[2] - s[1] >= 60 && (s[2] + s[0] - s[1]) % 10 !== 0; }), s = list.slice().sort((p, q) => p - q);
      return D('가장 큰 수와 가장 작은 수의 합에서 나머지 수를 뺀 값은?', (s[2] + s[0] - s[1]) / 100, {
        figure: numbers(list.map(d2)), explain: `${d2(s[2])} + ${d2(s[0])} = ${s2(s[2] + s[0])}, ${s2(s[2] + s[0])} − ${d2(s[1])} = ${d2(s[2] + s[0] - s[1])}`, facts: { calc: [[`${d2(s[2])}+${d2(s[0])}-${d2(s[1])}`, 0]], ends: list }
      });
    }),
    T('use-chain-add', '이어서 더하기', '①109 ②86 ③84 심58', (d) => {
      const [a, b, c] = d.until(() => [two(d, 105, 489), two(d, 12, 289), two(d, 105, 389)], ([x, y, z]) => (x + y) % 10 !== 0 && (x + y + z) % 10 !== 0);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: (a + b) / 100, decimal: true }, { label: LABELS[1], answer: (a + b + c) / 100, decimal: true }], {
        figure: chain([d2(a), '+' + d2(b), box(LABELS[0]), '+' + d2(c), box(LABELS[1])]), explain: `${d2(a)} + ${d2(b)} = ${d2(a + b)}, ${d2(a + b)} + ${d2(c)} = ${d2(a + b + c)}`, facts: { calc: [[`${d2(a)}+${d2(b)}`, 0], [`${d2(a)}+${d2(b)}+${d2(c)}`, 1]] }
      });
    }),
    T('use-chain-mix', '더하고 빼기', '②86 ③84 심58', (d) => {
      const [a, b, c] = d.until(() => [one(d, 20, 490), two(d, 12, 289), two(d, 12, 389)], ([x, y, z]) => x + y - z >= 12 && (x + y - z) % 10 !== 0);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: (a + b) / 100, decimal: true }, { label: LABELS[1], answer: (a + b - c) / 100, decimal: true }], {
        figure: chain([s2(a), '+' + d2(b), box(LABELS[0]), '-' + d2(c), box(LABELS[1])]), explain: `${s2(a)} + ${d2(b)} = ${d2(a + b)}, ${d2(a + b)} − ${d2(c)} = ${d2(a + b - c)}`, facts: { calc: [[`${s2(a)}+${d2(b)}`, 0], [`${s2(a)}+${d2(b)}-${d2(c)}`, 1]] }
      });
    }),
    T('use-box-add', '□가 있는 덧셈식', '①110 ③88 심66', (d) => {
      const [a, c] = d.until(() => [two(d, 105, 489), one(d, 210, 980)], ([x, z]) => z - x >= 50), A = d2(a), Ct = s2(c);
      return D('□ 안에 알맞은 수는?', (c - a) / 100, { figure: quote(expr(A, '+', box(), '=', Ct)), explain: `□ = ${Ct} − ${A} = ${d2(c - a)}`, facts: { calc: [[`${Ct}-${A}`, 0]] } });
    }),
    T('use-box-sub', '빼는 수가 □인 뺄셈식', '①111 ②94 ③88 심66', (d) => {
      const [a, c] = d.until(() => [one(d, 310, 1890), two(d, 105, 889)], ([x, z]) => x - z >= 50), A = s2(a), Ct = d2(c);
      return D('□ 안에 알맞은 수는?', (a - c) / 100, { figure: quote(expr(A, '-', box(), '=', Ct)), explain: `□ = ${A} − ${Ct} = ${d2(a - c)}`, facts: { calc: [[`${A}-${Ct}`, 0]] } });
    }),
    T('use-box-from', '빼어지는 수가 □인 뺄셈식', '①111 ②94 ③88', (d) => {
      const [b, c] = d.until(() => [two(d, 12, 589), two(d, 105, 689)], ([y, z]) => (y + z) % 10 !== 0), Bt = d2(b), Ct = d2(c);
      return D('□ 안에 알맞은 수는?', (b + c) / 100, { figure: quote(expr(box(), '-', Bt, '=', Ct)), explain: `□ = ${Ct} + ${Bt} = ${d2(b + c)}`, facts: { calc: [[`${Ct}+${Bt}`, 0]] } });
    }),
    T('use-some-add', '어떤 수: 더했더니', '①112 ③88', (d) => {
      const [b, c] = d.until(() => [two(d, 105, 489), one(d, 310, 980)], ([y, z]) => z - y >= 50), Bt = d2(b), Ct = s2(c);
      return D(`어떤 수에 ${dj(Bt, '을/를')} 더했더니 ${dj(Ct, '이/가')} 되었다. 어떤 수는?`, (c - b) / 100, { explain: `어떤 수는 ${Ct}에서 ${dj(Bt, '을/를')} 뺀 수이다. ${Ct} − ${Bt} = ${d2(c - b)}`, facts: { calc: [[`${Ct}-${Bt}`, 0]] } });
    }),
    T('use-some-sub', '어떤 수: 뺐더니', '②95', (d) => {
      const [b, c] = d.until(() => [one(d, 110, 690), two(d, 205, 1589)], ([y, z]) => (y + z) % 100 !== 0), Bt = s2(b), Ct = d2(c);
      return D(`어떤 수에서 ${dj(Bt, '을/를')} 뺐더니 ${dj(Ct, '이/가')} 되었다. 어떤 수는?`, (b + c) / 100, { explain: `어떤 수는 ${Ct}에 ${dj(Bt, '을/를')} 더한 수이다. ${Ct} + ${Bt} = ${d2(b + c)}`, facts: { calc: [[`${Ct}+${Bt}`, 0]] } });
    }),
    T('use-digit', '계산 결과와 비교하는 □ 안의 숫자', '①118 ②100 ③91 심68', (d) => {
      // 8.5 + 2.19 < 10.□: 합의 소수 첫째 자리 숫자보다 큰 숫자만 들어간다.
      const [a, b] = d.until(() => [one(d, 310, 890), two(d, 105, 489)], ([x, y]) => Math.floor((x + y) / 10) % 10 <= 7 && Math.floor((x + y) / 10) % 10 >= 2), sum = a + b, t = Math.floor(sum / 10) % 10, w = Math.floor(sum / 100), fits = []; for (let x = t + 1; x <= 9; x += 1) fits.push(x);
      return N('0부터 9까지의 숫자 가운데 □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', fits.length, {
        unit: '개', figure: quote(lt(`${s2(a)} + ${d2(b)}`, `${w}.${box()}`)), explain: `${s2(a)} + ${d2(b)} = ${d2(sum)}이다. ${d2(sum)}보다 큰 수가 되려면 □ 안에 ${t}보다 큰 숫자가 들어가야 한다. ${fits.join(', ')}이다.`,
        facts: { digit: { template: `${s2(a)}+${d2(b)}<${w}.□`, lo: 0, hi: 9, ask: 'count' }, rule: 'sum' }
      });
    }),
    T('use-next', '계산 결과보다 큰 가장 작은 소수 두 자리 수', '②100 심70', (d) => {
      const [a, b] = d.until(() => [two(d, 205, 689), one(d, 110, 590)], ([x, y]) => (x + y) % 10 <= 8), sum = a + b;
      return D('□ 안에 들어갈 수 있는 소수 두 자리 수 가운데 가장 작은 수는?', (sum + 1) / 100, {
        figure: quote(lt(`${d2(a)} + ${s2(b)}`, box())), explain: `${d2(a)} + ${s2(b)} = ${d2(sum)}이다. ${d2(sum)}보다 큰 소수 두 자리 수 가운데 가장 작은 수는 0.01만큼 더 큰 ${d2(sum + 1)}이다.`, facts: { calc: [[`${d2(a)}+${s2(b)}+0.01`, 0]], unseen: [0.01] }
      });
    }),
    T('use-described', '개수로 나타낸 두 수의 합', '①119 ②92 ③83 심62', (d) => {
      const [p, q] = d.until(() => [d.int(2, 39), d.int(12, 99)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0);
      return D(`0.1이 ${p}개인 수와 0.01이 ${q}개인 수의 합은?`, (p * 10 + q) / 100, { explain: `0.1이 ${p}개인 수는 ${d1(p)}, 0.01이 ${q}개인 수는 ${d2(q)}이다. ${d1(p)} + ${d2(q)} = ${d2(p * 10 + q)}`, facts: { calc: [[`0.1*${p}+0.01*${q}`, 0]] } });
    }),
    T('use-described-relate', '1/10인 수와 다른 수의 합', '②92 ③83 심62', (d) => {
      const [x, y] = d.until(() => [d.int(121, 989), two(d, 105, 689)], ([p, q]) => p % 10 !== 0 && (p + q) % 10 !== 0);
      return D(`${d1(x)}의 ${TENTH}인 수와 ${d2(y)}의 합은?`, (x + y) / 100, { explain: `${d1(x)}의 ${TENTH}은 ${d2(x)}이다. ${d2(x)} + ${d2(y)} = ${d2(x + y)}`, facts: { calc: [[`${d1(x)}/10+${d2(y)}`, 0]] } });
    }),
    T('use-line-sum', '수직선의 두 점이 나타내는 수의 합', '①120 ②93 ③83 심65', (d) => {
      const from = d.int(11, 68), [i, j] = d.until(() => [d.int(1, 8), d.int(2, 9)], ([p, q]) => p < q && (p + q) % 10 !== 0), L = [sx(from, 1), sx(from + 1, 1)], at = (k) => `(${L[0]}+(${L[1]}-${L[0]})/10*${k})`, x = from * 10 + i, y = from * 10 + j;
      return D('수직선에서 ㉠과 ㉡이 나타내는 수의 합은?', (x + y) / 100, {
        figure: dline(L, [[i, LABELS[0]], [j, LABELS[1]]]), explain: `작은 눈금 한 칸은 0.01이다. ㉠은 ${d2(x)}, ㉡은 ${d2(y)}이다. ${d2(x)} + ${d2(y)} = ${d2(x + y)}`, facts: { calc: [[`${at(i)}+${at(j)}`, 0]] }
      });
    }),
    T('use-pick-sum', '합이 기준보다 작은 두 수 고르기', '③95 심61', (d) => {
      // 5.1, 4.95, 5.02: 합이 10보다 작은 것은 4.95 + 5.02뿐이다.
      const w = d.int(3, 7), u = d.int(3, 9), z = w * 100 - u, y = w * 100 + d.int(1, u - 1), x = w * 100 + (Math.floor(u / 10) + 1) * 10, T2 = w * 2, list = d.shuffle([x, y, z]), pairs = d.shuffle([[0, 1], [0, 2], [1, 2]]);
      return C(`두 수를 골라 더할 때, 합이 ${T2}보다 작은 두 수는?`, pairs.map(([i, j]) => `${s2(list[i])}, ${s2(list[j])}`), pairs.findIndex(([i, j]) => list[i] + list[j] < T2 * 100), {
        figure: numbers(list.map(s2)), explain: `${s2(y)} + ${s2(z)} = ${s2(y + z)}이고, 나머지 두 합 ${s2(x + y)}, ${s2(x + z)}${tail(s2(x + z), '은/는')} ${T2}보다 크다.`, facts: { choose: { exprs: pairs.map(([i, j]) => `${s2(list[i])}+${s2(list[j])}`), rule: 'onlyBelow', target: T2 } }
      });
    }),
    T('use-range-sum', '범위에 맞는 두 수를 골라 더하기', '심40', (d) => {
      const w1 = d.int(1, 4), w2 = w1 + d.int(2, 4), p = two(d, w1 * 100 + 31, w1 * 100 + 98), r = two(d, w1 * 100 + 1, w1 * 100 + 28), q = d.until(() => two(d, w2 * 100 + 21, w2 * 100 + 139), (v) => (p + v) % 10 !== 0), s = two(d, w2 * 100 + 141, w2 * 100 + 189), list = d.shuffle([p, q, r, s]);
      return D(`수 가운데 ${w1}.3보다 크고 ${w1 + 1}보다 작은 수와 ${w2}.2보다 크고 ${w2 + 1}.4보다 작은 수의 합은?`, (p + q) / 100, {
        figure: numbers(list.map(d2)), explain: `${w1}.3보다 크고 ${w1 + 1}보다 작은 수는 ${d2(p)}, ${w2}.2보다 크고 ${w2 + 1}.4보다 작은 수는 ${d2(q)}이다. ${d2(p)} + ${d2(q)} = ${d2(p + q)}`, facts: { calc: [[`${d2(p)}+${d2(q)}`, 0]] }
      });
    })
  ]);

  // ── 덧셈과 뺄셈 문장제 ─────────────────────────────────────────
  // 길 그림의 거리를 그림 설명에도 적는다(검사가 그 글에서 식의 수를 읽는다).
  const labelled = (svg, label) => svg.replace('aria-label="길 그림"', 'aria-label="길 그림: ' + label + '"');
  const two2 = (d) => d.shuffle(NAMES).slice(0, 2);
  B.addTypes('4-2-3', 'word', [
    T('word-join1', '합치기: 소수 한 자리 수', '①124 ②109 ③97', (d) => {
      const [a, b] = d.until(() => [one(d, 110, 490), one(d, 20, 290)], ([x, y]) => (x + y) % 100 !== 0 && (x % 100) + (y % 100) >= 110), A = s2(a), Bt = s2(b);
      return D(`사과 ${A} kg과 귤 ${Bt} kg을 한 바구니에 담았다. 바구니에 담은 과일은 모두 몇 kg인가?`, (a + b) / 100, { unit: 'kg', explain: `${A} + ${Bt} = ${s2(a + b)}`, facts: { calc: [[`${A}+${Bt}`, 0]] } });
    }),
    T('word-join2', '합치기: 소수 두 자리 수', '①124 ②109 ③98 심80', (d) => {
      const who = d.pick(NAMES), [a, b] = d.until(() => [two(d, 105, 389), two(d, 105, 389)], ([x, y]) => (x + y) % 10 !== 0), A = d2(a), Bt = d2(b);
      return D(`${name(who, '은/는')} 어제 ${A} km, 오늘 ${Bt} km를 걸었다. 이틀 동안 걸은 거리는 모두 몇 km인가?`, (a + b) / 100, { unit: 'km', explain: `${A} + ${Bt} = ${d2(a + b)}`, facts: { calc: [[`${A}+${Bt}`, 0]] } });
    }),
    T('word-join-mixed', '합치기: 자릿수가 다른 두 수', '①124 ②109 ③99', (d) => {
      const [a, b] = [two(d, 205, 489), one(d, 110, 290)], A = d2(a), Bt = s2(b);
      return D(`무게가 ${A} kg인 가방에 ${Bt} kg인 책을 넣었다. 책을 넣은 가방의 무게는 몇 kg인가?`, (a + b) / 100, { unit: 'kg', explain: `소수점의 자리를 맞추어 더한다. ${A} + ${Bt} = ${d2(a + b)}`, facts: { calc: [[`${A}+${Bt}`, 0]] } });
    }),
    T('word-more', '더 긴 쪽의 길이', '①125 ②110 ③100 심81', (d) => {
      const [a, b] = d.until(() => [one(d, 210, 590), one(d, 110, 290)], ([x, y]) => (x + y) % 100 !== 0), A = s2(a), Bt = s2(b);
      return D(`빨간색 끈의 길이는 ${A} m이고, 파란색 끈은 빨간색 끈보다 ${Bt} m 더 길다. 파란색 끈의 길이는 몇 m인가?`, (a + b) / 100, { unit: 'm', explain: `더 길므로 더한다. ${A} + ${Bt} = ${s2(a + b)}`, facts: { calc: [[`${A}+${Bt}`, 0]] } });
    }),
    T('word-less', '더 가벼운 쪽의 무게', '②110 ③100 심81', (d) => {
      const [n1, n2] = two2(d), [a, b] = [one(d, 3110, 4590), two(d, 105, 389)], A = s2(a), Bt = d2(b);
      return D(`${n1}의 몸무게는 ${A} kg이고, ${name(n2, '은/는')} ${n1}보다 ${Bt} kg 더 가볍다. ${n2}의 몸무게는 몇 kg인가?`, (a - b) / 100, { unit: 'kg', explain: `더 가벼우므로 뺀다. ${A} − ${Bt} = ${d2(a - b)}`, facts: { calc: [[`${A}-${Bt}`, 0]] } });
    }),
    T('word-left', '쓰고 남은 양', '①126 ②111 ③101 심82', (d) => {
      const [a, b] = d.until(() => [two(d, 205, 689), two(d, 105, 489)], ([x, y]) => x - y >= 50 && (x - y) % 10 !== 0), A = d2(a), Bt = d2(b);
      return D(`고구마 ${A} kg 가운데 ${Bt} kg을 먹었다. 남은 고구마는 몇 kg인가?`, (a - b) / 100, { unit: 'kg', explain: `${A} − ${Bt} = ${d2(a - b)}`, facts: { calc: [[`${A}-${Bt}`, 0]] } });
    }),
    T('word-used', '전체와 남은 양으로 쓴 양 구하기', '①127 ②111', (d) => {
      const [a, c] = d.until(() => [two(d, 105, 289), two(d, 25, 189)], ([x, z]) => x - z >= 20 && (x - z) % 10 !== 0), A = d2(a), Ct = d2(c);
      return D(`우유 ${A} L 가운데 얼마를 마셨더니 ${Ct} L가 남았다. 마신 우유는 몇 L인가?`, (a - c) / 100, { unit: 'L', explain: `마신 양은 처음 양에서 남은 양을 뺀 것이다. ${A} − ${Ct} = ${d2(a - c)}`, facts: { calc: [[`${A}-${Ct}`, 0]] } });
    }),
    T('word-container', '그릇의 무게를 뺀 무게', '②114 ③102 심82', (d) => {
      const [a, b] = d.until(() => [two(d, 305, 789), two(d, 35, 98)], ([x, y]) => (x - y) % 10 !== 0), A = d2(a), Bt = d2(b);
      return D(`감이 담긴 바구니의 무게는 ${A} kg이고, 빈 바구니의 무게는 ${Bt} kg이다. 바구니에 담긴 감의 무게는 몇 kg인가?`, (a - b) / 100, { unit: 'kg', explain: `감의 무게는 전체 무게에서 빈 바구니의 무게를 뺀 것이다. ${A} − ${Bt} = ${d2(a - b)}`, facts: { calc: [[`${A}-${Bt}`, 0]] } });
    }),
    T('word-diff', '두 양의 차', '①128 ②112 ③103 심82', (d) => {
      const [a, b] = d.until(() => [two(d, 105, 389), one(d, 20, 290)], ([x, y]) => x - y >= 20), A = d2(a), Bt = s2(b);
      return D(`초록색 테이프의 길이는 ${A} m, 노란색 테이프의 길이는 ${Bt} m이다. 두 테이프의 길이의 차는 몇 m인가?`, (a - b) / 100, { unit: 'm', explain: `소수점의 자리를 맞추어 뺀다. ${A} − ${Bt} = ${d2(a - b)}`, facts: { calc: [[`${A}-${Bt}`, 0]] } });
    }),
    T('word-who', '누가 얼마나 더 많이', '①129 ②113 ③103 심82', (d) => {
      // 틀린 보기: 받아내림한 것을 빼지 않은 차, 적게 걸은 사람
      const names = two2(d), [hi, lo] = d.until(() => [one(d, 310, 890), one(d, 110, 690)], ([x, y]) => x - y >= 60 && x % 100 < y % 100), flip = d.bool(), vals = flip ? [lo, hi] : [hi, lo], gap = hi - lo;
      const list = d.shuffle([[0, gap], [1, gap], [0, gap + 100], [1, gap + 100]]), winner = flip ? 1 : 0;
      return C(`${name(names[0], '은/는')} ${s2(vals[0])} km, ${name(names[1], '은/는')} ${s2(vals[1])} km를 걸었다. 누가 몇 km 더 많이 걸었는가?`, list.map(([who, n]) => `${names[who]}, ${s2(n)} km`), list.findIndex(([who, n]) => who === winner && n === gap), {
        explain: `${s2(hi)}${tail(s2(hi), '이/가')} ${s2(lo)}보다 크므로 ${name(names[winner], '이/가')} 더 많이 걸었다. ${s2(hi)} − ${s2(lo)} = ${s2(gap)}`, facts: { who: { values: vals, options: list } }
      });
    }),
    T('word-who-fast', '누가 얼마나 더 빨리', '①129 ②113 심82', (d) => {
      // 기록은 수가 작을수록 빠르다. 틀린 보기: 빈 자리의 숫자를 그대로 내려 쓴 차(11.5 − 11.23 = 0.33), 느린 사람
      const names = two2(d), [slow, fast] = d.until(() => [one(d, 910, 1290), two(d, 805, 1189)], ([x, y]) => x - y >= 12 && x - y <= 190 && Math.floor(x / 10) % 10 > Math.floor(y / 10) % 10), flip = d.bool(), vals = flip ? [slow, fast] : [fast, slow], gap = slow - fast, wrong = gap + 2 * (fast % 10);
      const list = d.shuffle([[0, gap], [1, gap], [0, wrong], [1, wrong]]), winner = flip ? 1 : 0;
      return C(`50 m 달리기 기록은 ${name(names[0], '이/가')} ${s2(vals[0])}초, ${name(names[1], '이/가')} ${s2(vals[1])}초이다. 누가 몇 초 더 빨리 달렸는가?`, list.map(([who, n]) => `${names[who]}, ${s2(n)}초`), list.findIndex(([who, n]) => who === winner && n === gap), {
        explain: `걸린 시간이 짧은 ${name(names[winner], '이/가')} 더 빨리 달렸다. 소수점의 자리를 맞추어 빼면 ${s2(slow)} − ${s2(fast)} = ${s2(gap)}`, facts: { who: { values: vals, options: list, smaller: true } }
      });
    }),
    T('word-table-diff', '표에서 가장 큰 값과 가장 작은 값의 차', '①130 ②120 ③103 심59', (d) => {
      const base = d.int(18, 26) * 10, list = d.until(() => [base + d.int(1, 29), base + d.int(1, 29), base + d.int(1, 29), base + d.int(1, 2) * 10], (xs) => new Set(xs).size === 4 && xs.slice(0, 3).every((v) => v % 10 !== 0) && xs[3] % 100 !== 0 && (Math.max(...xs) - Math.min(...xs)) % 10 !== 0), days = ['월요일', '화요일', '수요일', '목요일'], order = d.shuffle(list), hi = Math.max(...list), lo = Math.min(...list);
      return D('요일별로 마신 물의 양을 나타낸 표이다. 물을 가장 많이 마신 날과 가장 적게 마신 날의 마신 양의 차는 몇 L인가?', (hi - lo) / 100, {
        unit: 'L', figure: table(['요일', '마신 물의 양'], days.map((day, i) => [day, `${s2(order[i])} L`])), explain: `가장 많이 마신 양은 ${s2(hi)} L, 가장 적게 마신 양은 ${s2(lo)} L이다. ${s2(hi)} − ${s2(lo)} = ${s2(hi - lo)}`, facts: { calc: [[`${s2(hi)}-${s2(lo)}`, 0]], ends: order }
      });
    }),
    T('word-need', '가득 채우는 데 더 필요한 양', '②115 심82', (d) => {
      const [a, b] = d.until(() => [one(d, 110, 490), two(d, 25, 389)], ([x, y]) => x - y >= 20), A = s2(a), Bt = d2(b);
      return D(`들이가 ${A} L인 통에 물이 ${Bt} L 들어 있다. 통을 가득 채우려면 물을 몇 L 더 부어야 하는가?`, (a - b) / 100, { unit: 'L', explain: `더 부어야 하는 양은 통의 들이에서 들어 있는 양을 뺀 것이다. ${A} − ${Bt} = ${d2(a - b)}`, facts: { calc: [[`${A}-${Bt}`, 0]] } });
    }),
    T('word-twice-left', '전체에서 두 번 덜어 내기', '①131 ②117 ③106 심84', (d) => {
      const [a, b, c] = d.until(() => [one(d, 510, 980), two(d, 105, 389), one(d, 110, 290)], ([x, y, z]) => x - y - z >= 50), A = s2(a), Bt = d2(b), Ct = s2(c);
      return D(`집에서 할머니 댁까지의 거리는 ${A} km이다. 버스를 타고 ${Bt} km를 간 다음 걸어서 ${Ct} km를 갔다. 남은 거리는 몇 km인가?`, (a - b - c) / 100, {
        unit: 'km', explain: `${A} − ${Bt} = ${d2(a - b)}, ${d2(a - b)} − ${Ct} = ${d2(a - b - c)}`, facts: { calc: [[`${A}-${Bt}-${Ct}`, 0]] }
      });
    }),
    T('word-twice-whole', '자연수에서 같은 양을 두 번 덜어 내기', '①131 ②117 심84', (d) => {
      const [w, b] = d.until(() => [d.int(3, 6), one(d, 110, 240)], ([x, y]) => x * 100 - 2 * y >= 20 && (2 * y) % 100 !== 0), Bt = s2(b);
      return D(`밀가루 ${w} kg이 있다. 빵 한 개를 만드는 데 밀가루가 ${Bt} kg 든다. 빵 두 개를 만들고 남은 밀가루는 몇 kg인가?`, (w * 100 - 2 * b) / 100, {
        unit: 'kg', explain: `${w} − ${Bt} = ${s2(w * 100 - b)}, ${s2(w * 100 - b)} − ${Bt} = ${s2(w * 100 - 2 * b)}`, facts: { calc: [[`${w}-${Bt}-${Bt}`, 0]] }
      });
    }),
    T('word-join-then-left', '합친 뒤 덜어 내기', '①132 심87', (d) => {
      const [a, b, c] = d.until(() => [two(d, 105, 389), one(d, 110, 290), two(d, 35, 189)], ([x, y, z]) => (x + y - z) % 10 !== 0), A = d2(a), Bt = s2(b), Ct = d2(c);
      return D(`사과 ${A} kg과 배 ${Bt} kg이 있다. 그 가운데 ${Ct} kg을 먹었다. 남은 과일은 몇 kg인가?`, (a + b - c) / 100, {
        unit: 'kg', explain: `${A} + ${Bt} = ${d2(a + b)}, ${d2(a + b)} − ${Ct} = ${d2(a + b - c)}`, facts: { calc: [[`${A}+${Bt}-${Ct}`, 0]] }
      });
    }),
    T('word-left-then-add', '덜어 낸 뒤 더 넣기', '③106 심85', (d) => {
      const [w, b, c] = d.until(() => [d.int(6, 12), two(d, 205, 589), two(d, 105, 489)], ([x, y, z]) => x * 100 - y >= 50 && (z - y) % 10 !== 0), Bt = d2(b), Ct = d2(c);
      return D(`물통에 물이 ${w} L 들어 있다. 그 가운데 ${Bt} L를 쓰고 ${Ct} L를 더 부었다. 물통에 들어 있는 물은 몇 L인가?`, (w * 100 - b + c) / 100, {
        unit: 'L', explain: `${w} − ${Bt} = ${d2(w * 100 - b)}, ${d2(w * 100 - b)} + ${Ct} = ${d2(w * 100 - b + c)}`, facts: { calc: [[`${w}-${Bt}+${Ct}`, 0]] }
      });
    }),
    T('word-more-total', '더 많은 쪽을 구해 둘을 합치기', '①134 ②116 ③104 심86', (d) => {
      const [n1, n2] = two2(d), [a, b] = d.until(() => [two(d, 25, 189), two(d, 12, 98)], ([x, y]) => (x + x + y) % 10 !== 0), A = d2(a), Bt = d2(b);
      return D(`${name(n1, '은/는')} 주스를 ${A} L 마셨고, ${name(n2, '은/는')} ${n1}보다 ${Bt} L 더 많이 마셨다. 두 사람이 마신 주스는 모두 몇 L인가?`, (a + a + b) / 100, {
        unit: 'L', explain: `${name(n2, '이/가')} 마신 주스는 ${A} + ${Bt} = ${d2(a + b)}(L)이다. ${A} + ${d2(a + b)} = ${d2(a + a + b)}`, facts: { calc: [[`${A}+${A}+${Bt}`, 0]] }
      });
    }),
    T('word-three-sum', '세 양의 합', '②122 심83', (d) => {
      const [a, b, c] = d.until(() => [two(d, 25, 98), two(d, 25, 98), two(d, 105, 189)], ([x, y, z]) => (x + y) % 10 !== 0 && (x + y + z) % 10 !== 0), A = d2(a), Bt = d2(b), Ct = d2(c);
      return D(`세 병에 물이 각각 ${A} L, ${Bt} L, ${Ct} L 들어 있다. 세 병에 들어 있는 물은 모두 몇 L인가?`, (a + b + c) / 100, {
        unit: 'L', explain: `${A} + ${Bt} = ${d2(a + b)}, ${d2(a + b)} + ${Ct} = ${d2(a + b + c)}`, facts: { calc: [[`${A}+${Bt}+${Ct}`, 0]] }
      });
    }),
    T('word-tape', '겹쳐 이어 붙인 전체 길이', '②118 심92·93', (d) => {
      const [a, c] = d.until(() => [one(d, 310, 790), one(d, 40, 130)], ([x, z]) => (2 * x - z) % 100 !== 0), A = s2(a), Ct = s2(c);
      return D(`길이가 ${A} m인 색 테이프 2장을 ${Ct} m만큼 겹쳐서 한 줄로 이어 붙였다. 이어 붙인 색 테이프의 전체 길이는 몇 m인가?`, (2 * a - c) / 100, {
        unit: 'm', figure: tapes(`${A} m`, `${A} m`, `${Ct} m`), explain: `겹친 부분은 두 번 더해지므로 한 번 뺀다. ${A} + ${A} = ${s2(2 * a)}, ${s2(2 * a)} − ${Ct} = ${s2(2 * a - c)}`, facts: { calc: [[`${A}+${A}-${Ct}`, 0]] }
      });
    }),
    T('word-route', '길을 따라 간 거리', '②109 ③107', (d) => {
      const [a, b] = d.until(() => [two(d, 105, 289), two(d, 105, 389)], ([x, y]) => (x + y) % 10 !== 0), A = d2(a), Bt = d2(b), place = d.pick(['학교', '공원', '우체국']);
      return D(`집에서 ${josa(place, '을/를')} 거쳐 도서관까지 가는 거리는 몇 km인가?`, (a + b) / 100, {
        unit: 'km', figure: labelled(route([['집', 0, 50], [place, 48, 50], ['도서관', 100, 50]], [[0, 1, `${A} km`], [1, 2, `${Bt} km`]], 40), `집에서 ${place}까지 ${A} km, ${place}에서 도서관까지 ${Bt} km`),
        explain: `${A} + ${Bt} = ${d2(a + b)}`, facts: { calc: [[`${A}+${Bt}`, 0]] }
      });
    }),
    T('word-route-more', '거쳐 가는 길과 바로 가는 길의 차', '③107 심91', (d) => {
      const [a, b, c] = d.until(() => [two(d, 105, 289), two(d, 105, 389), one(d, 210, 590)], ([x, y, z]) => z > Math.max(x, y) && x + y - z >= 20 && (x + y - z) % 100 !== 0), A = d2(a), Bt = d2(b), Ct = s2(c), place = d.pick(['학교', '공원', '우체국']);
      return D(`집에서 ${josa(place, '을/를')} 거쳐 도서관까지 가는 길은 집에서 도서관으로 바로 가는 길보다 몇 km 더 먼가?`, (a + b - c) / 100, {
        unit: 'km', figure: labelled(route([['집', 0, 100], [place, 50, 0, false], ['도서관', 100, 100]], [[0, 1, `${A} km`], [1, 2, `${Bt} km`], [0, 2, `${Ct} km`, 10]], 66), `집에서 ${place}까지 ${A} km, ${place}에서 도서관까지 ${Bt} km, 집에서 도서관까지 바로 가면 ${Ct} km`),
        explain: `거쳐 가는 길은 ${A} + ${Bt} = ${d2(a + b)}(km)이다. ${d2(a + b)} − ${Ct} = ${d2(a + b - c)}`, facts: { calc: [[`${A}+${Bt}-${Ct}`, 0]] }
      });
    }),
    T('word-units-add', '단위가 다른 두 양의 합', '①137 ②119 ③52 심45', (d) => {
      const [a, n] = d.until(() => [two(d, 105, 289), d.int(12, 98) * 10], ([x, y]) => (y / 10) % 10 !== 0 && (x + y / 10) % 10 !== 0), A = d2(a);
      return D(`물이 ${A} L 들어 있는 통에 물 ${n} mL를 더 부었다. 통에 들어 있는 물은 모두 몇 L인가?`, (a + n / 10) / 100, {
        unit: 'L', explain: `${n} mL는 ${d2(n / 10)} L이다. ${A} + ${d2(n / 10)} = ${d2(a + n / 10)}`, facts: { calc: [[`${A}+${n}/1000`, 0]], unseen: [1000] }
      });
    }),
    T('word-units-sub', '단위가 다른 두 양의 차', '①137 ②119 ③52 심45', (d) => {
      const [a, n] = d.until(() => [one(d, 210, 590), d.int(12, 98) * 10], ([x, y]) => (y / 10) % 10 !== 0 && x - y / 10 >= 30), A = s2(a);
      return D(`밀가루 ${A} kg 가운데 ${n} g을 사용하였다. 남은 밀가루는 몇 kg인가?`, (a - n / 10) / 100, {
        unit: 'kg', explain: `${n} g은 ${d2(n / 10)} kg이다. ${A} − ${d2(n / 10)} = ${d2(a - n / 10)}`, facts: { calc: [[`${A}-${n}/1000`, 0]], unseen: [1000] }
      });
    }),
    T('word-units-compound', '몇 km 몇 m와 소수로 적은 거리의 합', '①137 ②119 ③52', (d) => {
      const who = d.pick(NAMES), [k, m, b] = d.until(() => [d.int(1, 3), d.int(12, 98) * 10, one(d, 30, 190)], ([, y, z]) => (y / 10) % 10 !== 0 && (y / 10 + z) % 100 !== 0), Bt = s2(b), first = k * 100 + m / 10;
      return D(`${name(who, '은/는')} ${k} km ${m} m를 걷고 ${Bt} km를 더 걸었다. 걸은 거리는 모두 몇 km인가?`, (first + b) / 100, {
        unit: 'km', explain: `${k} km ${m} m는 ${d2(first)} km이다. ${d2(first)} + ${Bt} = ${d2(first + b)}`, facts: { calc: [[`${k}+${m}/1000+${Bt}`, 0]], unseen: [1000] }
      });
    })
  ]);

  // ── 실력 ──────────────────────────────────────────────────────
  const asc3 = (d) => uniq(d, 3).sort((p, q) => p - q);
  B.addGroup('4-2-3', {
    id: 'hard', title: '실력 문제', standard: CALC,
    types: [
      H('h-between-count', '두 수 사이에 있는 소수 세 자리 수의 개수', '①62 심15', (d) => {
        // 2.674와 2.68 사이: 2.68을 2.680으로 보아야 2.675부터 2.679까지 센다.
        const w = d.int(0, 9), a = d.int(0, 9), b = d.int(1, 8), c = d.int(1, 7), low = `${w}.${a}${b}${c}`, high = `${w}.${a}${b + 1}`;
        return N(`${low}보다 크고 ${high}보다 작은 소수 세 자리 수는 모두 몇 개인가?`, 9 - c, {
          unit: '개', explain: `${dj(high, '은/는')} ${high}0과 같다. ${low}보다 크고 ${high}0보다 작은 소수 세 자리 수는 ${w}.${a}${b}${c + 1}부터 ${w}.${a}${b}9까지 ${9 - c}개이다.`,
          facts: { digit: { template: `${low}<${w}.${a}${b}□<${high}`, lo: 0, hi: 9, ask: 'count' } }
        });
      }, { standard: ORDER }),
      H('h-box-pair', '□가 들어 있는 두 소수의 크기 비교', '②50', (d) => {
        // □를 몰라도 높은 자리로 비교할 수 있을 때가 있다. 「알 수 없다」를 고르는 아이는 □가 있으면 비교할 수 없다고 여긴다.
        const t = d.int(1, 8), [h2, h1] = uniq(d, 2).sort((p, q) => p - q), kind = d.int(0, 2);
        const high = `${t}${kind === 2 ? 8 : 9}.□${h1}`, low = `${t}□.0${h2}`, left = kind === 1 ? low : high, right = kind === 1 ? high : low, show = (text) => text.replace('□', box());
        return C('㉠과 ㉡의 □ 안에는 0부터 9까지 어느 숫자나 들어갈 수 있다. 더 큰 수는?', ['㉠', '㉡', '□ 안의 숫자에 따라 다르다'], kind, {
          figure: tagged([show(left), show(right)]),
          explain: kind === 2 ? `㉡의 □ 안에 9가 들어가면 ${dj(low.replace('□', 9), '이/가')} 되어 ㉠보다 크고, 0이 들어가면 ${dj(low.replace('□', 0), '이/가')} 되어 ㉠보다 작다.` : `${kind === 1 ? '㉠' : '㉡'}은 가장 커도 ${low.replace('□', 9)}이고, ${kind === 1 ? '㉡' : '㉠'}은 가장 작아도 ${high.replace('□', 0)}이다. □ 안에 어떤 숫자가 들어가도 ${kind === 1 ? '㉡' : '㉠'}이 더 크다.`,
          facts: { big: { boxedPair: { left, right, signs: ['>', '<', '?'] } } }
        });
      }, { standard: ORDER }),
      H('h-relate-wrong', '1/10을 잘못 구한 값 바로잡기', '①43 ②34 심25', (d) => {
        const r = two(d, 105, 989), kind = d.int(0, 2), got = [String(r * 10), String(r), d3(r)][kind], did = ['100배를', '10배를', `${HUNDREDTH}을`][kind];
        return D(`어떤 수의 ${TENTH}을 구해야 할 것을 잘못하여 어떤 수의 ${did} 구했더니 ${dj(got, '이/가')} 되었다. 바르게 구한 값은?`, r / 100, {
          explain: `어떤 수는 ${got}의 ${[HUNDREDTH, TENTH, '100배'][kind]}인 ${d1(r)}이다. ${d1(r)}의 ${TENTH}은 ${d2(r)}이다.`, facts: { calc: [[[`${got}/100/10`, `${got}/10/10`, `${got}*100/10`][kind], 0]] }
        });
      }, { standard: NUM }),
      H('h-back-twice', '10배와 1/10을 거슬러 구하기', '②33 ③47 심24', (d) => {
        const m = two(d, 105, 989), up = d.bool();
        return D(up ? `어떤 수의 ${TENTH}이 ${d3(m)}일 때, 어떤 수의 10배는?` : `어떤 수의 10배가 ${d1(m)}일 때, 어떤 수의 ${TENTH}은?`, up ? m / 10 : m / 1000, {
          explain: up ? `어떤 수는 ${d3(m)}의 10배인 ${d2(m)}이다. ${d2(m)}의 10배는 ${d1(m)}이다.` : `어떤 수는 ${d1(m)}의 ${TENTH}인 ${d2(m)}이다. ${d2(m)}의 ${TENTH}은 ${d3(m)}이다.`, facts: { calc: [[up ? `${d3(m)}*10*10` : `${d1(m)}/10/10`, 0]] }
        });
      }, { standard: NUM }),
      H('h-relate-times', '몇 배 한 수는 몇 분의 1인 수의 몇 배', '①45', (d) => {
        const a = d.int(2, 9), [k1, k2] = d.pick([[100, 10], [10, 10], [10, 100]]), base = k2 === 100 ? a * 100 : a * 10, x = sx(base, 3);
        return N(`${x}의 ${k1}배인 수는 ${x}의 ${PARTS[k2]}인 수의 몇 배인가?`, k1 * k2, {
          unit: '배', explain: `${x}의 ${k1}배는 ${sx(base * k1, 3)}, ${x}의 ${PARTS[k2]}은 ${sx(base / k2, 3)}이다. 소수점을 기준으로 수가 왼쪽으로 ${String(k1 * k2).length - 1}자리 옮겨 간 것이므로 ${k1 * k2}배이다.`, facts: { calc: [[`${k1}*${k2}`, 0]] }
        });
      }, { standard: NUM }),
      H('h-relate-repeat', '10배와 1/10을 거듭하기', '②29 심27', (d) => {
        const m = d.until(() => d.int(105, 989), (v) => v % 10 !== 0), [u, v] = d.pick([[1, 2], [1, 3], [2, 3]]), k = v - u, x = d1(m);
        return D(`넣은 수의 10배인 수가 나오는 상자 ㉮와 넣은 수의 ${TENTH}인 수가 나오는 상자 ㉯가 있다. ${dj(x, '을/를')} 상자에 넣고 나온 수를 다시 상자에 넣는 일을 되풀이하여 상자 ㉮를 모두 ${u}번, 상자 ㉯를 모두 ${v}번 지나게 하였다. 마지막에 나온 수는?`, m / P10[k + 1], {
          explain: `10배를 ${u}번, ${TENTH}을 ${v}번 하면 처음 수의 ${PARTS[P10[k]]}이 된다. ${x}의 ${PARTS[P10[k]]}은 ${fx(m, k + 1)}이다.`, facts: { calc: [[x + '*10'.repeat(u) + '/10'.repeat(v), 0]] }
        });
      }, { standard: NUM }),
      H('h-over-digit', '넘치는 묶음이 낀 수의 자리 숫자', '③19', (d) => {
        const a = d.int(1, 5), b = d.int(1, 9), p = d.until(() => d.int(12, 48), (v) => v % 10 !== 9 && v % 10 !== 0), q = d.int(12, 19), v = a * 10000 + b * 1000 + p * 10 + q;
        return N(`10이 ${a}개, 1이 ${b}개, 0.01이 ${p}개, 0.001이 ${q}개인 수의 소수 둘째 자리 숫자는?`, Math.floor(v / 10) % 10, {
          explain: `0.01이 ${p}개는 0.1이 ${Math.floor(p / 10)}개와 0.01이 ${p % 10}개이고, 0.001이 ${q}개는 0.01이 1개와 0.001이 ${q % 10}개이다. 0.01은 모두 ${p % 10} + 1 = ${p % 10 + 1}(개)이므로 이 수는 ${d3(v)}이고, 소수 둘째 자리 숫자는 ${Math.floor(v / 10) % 10}이다.`, facts: { parts: [[`((${v}-${v}%10)/10)%10`, 0]] }
        });
      }, { standard: NUM }),
      H('h-forms-order', '여러 가지로 나타낸 수의 크기 비교', '①59 ②46 심34', (d) => {
        const [v0, v1, v2] = d.until(() => { const base = d.int(1150, 8850); return [base + d.int(-60, 60), base + d.int(-60, 60), base + d.int(-60, 60)]; }, (list) => new Set(list).size === 3 && !String(list[0]).includes('0') && list[1] % 10 !== 0 && list[2] % 100 !== 0);
        const [a, b, c, e] = String(v0).split('').map(Number), pick = orderChoice(d, [v0, v1, v2], LABELS, true);
        return C('나타내는 수가 큰 것부터 차례로 쓴 것은?', pick.options, pick.answer, {
          figure: tagged([`1이 ${a}개, 0.1이 ${b}개, 0.01이 ${c}개, 0.001이 ${e}개인 수`, `0.001이 ${v1}개인 수`, sx(v2, 3)]), explain: `소수로 나타내면 ㉠ ${d3(v0)}, ㉡ ${d3(v1)}, ㉢ ${sx(v2, 3)}이다. 높은 자리부터 차례로 비교한다.`,
          facts: { choose: { exprs: [`1*${a}+0.1*${b}+0.01*${c}+0.001*${e}`, `0.001*${v1}`, sx(v2, 3)], rule: 'descending', orders: pick.list }, rule: 'forms' }
        });
      }, { standard: ORDER }),
      H('h-forms-min', '읽은 말·관계로 나타낸 수와 크기 비교', '③36 심34·37', (d) => {
        const w = d.int(1, 8), big = d.bool(), [x, y, z] = d.until(() => [w * 100 + d.int(3, 12), w * 1000 + d.int(11, 98), w * 100 + d.int(2, 9)], (list) => list[0] % 10 !== 0 && list[1] % 10 !== 0 && new Set([list[0] * 10, list[1], list[2] * 10]).size === 3);
        const vals = [x * 10, y, z * 10], best = big ? Math.max(...vals) : Math.min(...vals);
        return C(`가장 ${big ? '큰' : '작은'} 수는?`, LABELS.slice(0, 3), vals.indexOf(best), {
          figure: tagged([d2(x), read(d3(y)), `${d1(z)}의 ${TENTH}`]), explain: `소수로 나타내면 ㉠ ${d2(x)}, ㉡ ${d3(y)}, ㉢ ${d2(z)}이다. 높은 자리부터 차례로 비교한다.`,
          facts: { choose: { exprs: [d2(x), d3(y), `${d1(z)}/10`], rule: big ? 'max' : 'min' }, unseen: [Number(d3(y))] }
        });
      }, { standard: ORDER }),
      H('h-cards-second', '수 카드로 두 번째로 작은 소수 만들기', '③39 심78', (d) => {
        const s = asc3(d), list = d.shuffle([0].concat(s));
        return D('수 카드 4장과 소수점 카드를 한 번씩 모두 사용하여 소수 세 자리 수를 만들려고 한다. 만들 수 있는 수 가운데 두 번째로 작은 수는?', (s[0] * 100 + s[2] * 10 + s[1]) / 1000, {
          figure: cards(list.concat(['.'])), explain: `가장 작은 수는 0.${s[0]}${s[1]}${s[2]}이다. 두 번째로 작은 수는 낮은 두 자리의 숫자를 바꾼 0.${s[0]}${s[2]}${s[1]}이다.`, facts: { calc: [[`0+${s[0]}/10+${s[2]}/100+${s[1]}/1000`, 0]], unseen: [10, 100, 1000] }
        });
      }, { standard: ORDER }),
      H('h-some-chain', '어떤 수: 결과를 먼저 구하기', '①113', (d) => {
        const [b, c, e] = d.until(() => [two(d, 105, 289), two(d, 205, 589), two(d, 12, 98)], ([x, y, z]) => y - z >= 50 && (y - z + x) % 10 !== 0), Bt = d2(b), Ct = d2(c), Et = d2(e);
        return D(`어떤 수에서 ${dj(Bt, '을/를')} 뺐더니 ${Ct}보다 ${Et}만큼 더 작은 수가 되었다. 어떤 수는?`, (c - e + b) / 100, {
          explain: `${Ct}보다 ${Et}만큼 더 작은 수는 ${Ct} − ${Et} = ${s2(c - e)}이다. 어떤 수는 ${s2(c - e)} + ${Bt} = ${d2(c - e + b)}이다.`, facts: { calc: [[`${Ct}-${Et}+${Bt}`, 0]] }
        });
      }),
      H('h-wrong-add', '잘못 계산한 어떤 수: 더할 것을 뺌', '③89 심97', (d) => {
        const [b, c] = d.until(() => [two(d, 105, 389), two(d, 105, 589)], ([x, y]) => (y + 2 * x) % 10 !== 0), Bt = d2(b), Ct = d2(c);
        return D(`어떤 수에 ${dj(Bt, '을/를')} 더해야 할 것을 잘못하여 뺐더니 ${dj(Ct, '이/가')} 되었다. 바르게 계산한 값은?`, (c + 2 * b) / 100, {
          explain: `어떤 수는 ${Ct} + ${Bt} = ${s2(c + b)}이다. 바르게 계산하면 ${s2(c + b)} + ${Bt} = ${d2(c + 2 * b)}이다.`, facts: { calc: [[`${Ct}+${Bt}+${Bt}`, 0]] }
        });
      }),
      H('h-wrong-sub', '잘못 계산한 어떤 수: 뺄 것을 더함', '①114 ②96 심97', (d) => {
        const [b, c] = d.until(() => [two(d, 105, 289), two(d, 405, 989)], ([x, y]) => y - 2 * x >= 30 && (y - 2 * x) % 10 !== 0), Bt = d2(b), Ct = d2(c);
        return D(`어떤 수에서 ${dj(Bt, '을/를')} 빼야 할 것을 잘못하여 더했더니 ${dj(Ct, '이/가')} 되었다. 바르게 계산한 값은?`, (c - 2 * b) / 100, {
          explain: `어떤 수는 ${Ct} − ${Bt} = ${s2(c - b)}이다. 바르게 계산하면 ${s2(c - b)} − ${Bt} = ${d2(c - 2 * b)}이다.`, facts: { calc: [[`${Ct}-${Bt}-${Bt}`, 0]] }
        });
      }),
      H('h-wrong-from', '잘못 계산한 어떤 수: 어떤 수를 더해야 할 때', '심98', (d) => {
        const [a, x] = d.until(() => [two(d, 505, 989), two(d, 105, 389)], ([p, q]) => (p + q) % 10 !== 0 && (p - q) % 10 !== 0), At = d2(a), Ct = d2(a - x);
        return D(`${At}에 어떤 수를 더해야 할 것을 잘못하여 뺐더니 ${dj(Ct, '이/가')} 되었다. 바르게 계산한 값은?`, (a + x) / 100, {
          explain: `어떤 수는 ${At} − ${Ct} = ${d2(x)}이다. 바르게 계산하면 ${At} + ${d2(x)} = ${d2(a + x)}이다.`, facts: { calc: [[`${At}+(${At}-${Ct})`, 0]] }
        });
      }),
      H('h-wrong-point', '잘못 계산한 어떤 수: 소수점을 잘못 보고 뺌', '심99', (d) => {
        const [b, c] = d.until(() => [two(d, 105, 389), two(d, 12, 98)], ([x, y]) => (y - x) % 10 !== 0), Bt = d2(b), Wt = d1(b), Ct = d2(c);
        return D(`어떤 수에서 ${dj(Bt, '을/를')} 빼야 할 것을 잘못하여 ${dj(Wt, '을/를')} 뺐더니 ${dj(Ct, '이/가')} 되었다. 바르게 계산한 값은?`, (c + 9 * b) / 100, {
          explain: `어떤 수는 ${Ct} + ${Wt} = ${d2(c + 10 * b)}이다. 바르게 계산하면 ${d2(c + 10 * b)} − ${Bt} = ${d2(c + 9 * b)}이다.`, facts: { calc: [[`${Ct}+${Wt}-${Bt}`, 0]] }
        });
      }),
      H('h-some-relate', '1/10로 알려 준 어떤 수에서 빼기', '②97', (d) => {
        const [m, b] = d.until(() => { const x = two(d, 205, 589); return [x, two(d, 105, x - 20)]; }, ([x, y]) => (x - y) % 10 !== 0), Bt = d2(b);
        return D(`어떤 수의 ${TENTH}은 ${d3(m)}이다. 어떤 수보다 ${Bt}만큼 더 작은 수는?`, (m - b) / 100, {
          explain: `어떤 수는 ${d3(m)}의 10배인 ${d2(m)}이다. ${d2(m)} − ${Bt} = ${d2(m - b)}`, facts: { calc: [[`${d3(m)}*10-${Bt}`, 0]] }
        });
      }),
      H('h-box-both', '양쪽에 계산이 있는 식의 □', '①135 심67', (d) => {
        const [a, c, e] = d.until(() => [two(d, 105, 289), two(d, 505, 989), two(d, 105, 289)], ([x, y, z]) => y - z - x >= 30 && (y - z - x) % 10 !== 0), A = d2(a), Ct = d2(c), Et = d2(e);
        return D('□ 안에 알맞은 수는?', (c - e - a) / 100, {
          figure: quote(expr(A, '+', box(), '=', Ct, '-', Et)), explain: `${Ct} − ${Et} = ${s2(c - e)}이므로 ${A} + □ = ${s2(c - e)}이다. □ = ${s2(c - e)} − ${A} = ${d2(c - e - a)}`, facts: { calc: [[`${Ct}-${Et}-${A}`, 0]] }
        });
      }),
      H('h-digit-between', '두 계산 결과 사이에 있게 하는 □ 안의 숫자', '심69', (d) => {
        const made = d.until(() => {
          const w = d.int(3, 8), t = d.int(0, 8), l = d.int(1, 5), r = l + d.int(2, 4), L = w * 100 + t * 10 + l, R = w * 100 + t * 10 + r, a = two(d, 105, L - 105), e = two(d, 105, 289);
          return { w, t, l, r, A: d2(a), Bt: d2(L - a), Ct: d2(R + e), Et: d2(e), L, R, b: L - a, c: R + e };
        }, (m) => m.b % 10 !== 0 && m.c % 10 !== 0 && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].every((x) => { const mid = Number(`${m.w}.${m.t}${x}`), v = m.w * 100 + m.t * 10 + x; return (Number(m.A) + Number(m.Bt) < mid && mid < Number(m.Ct) - Number(m.Et)) === (m.L < v && v < m.R); }));
        const { w, t, l, r, A, Bt, Ct, Et, L, R } = made, fits = []; for (let x = l + 1; x < r; x += 1) fits.push(x);
        return N('0부터 9까지의 숫자 가운데 □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', fits.length, {
          unit: '개', figure: quote(`${A} + ${Bt} &lt; ${w}.${t}${box()} &lt; ${Ct} − ${Et}`),
          explain: `${A} + ${Bt} = ${d2(L)}, ${Ct} − ${Et} = ${d2(R)}이다. ${d2(L)}보다 크고 ${d2(R)}보다 작아야 하므로 □ 안에 들어갈 수 있는 숫자는 ${fits.join(', ')}이다.`,
          facts: { digit: { template: `${A}+${Bt}<${w}.${t}□<${Ct}-${Et}`, lo: 0, hi: 9, ask: 'count' }, rule: 'two-sides' }
        });
      }),
      H('h-described-chain', '설명하는 수와 그보다 큰 수의 합', '심63', (d) => {
        const [n, b] = d.until(() => [d.int(105, 589), two(d, 105, 289)], ([x, y]) => x % 10 !== 0 && (2 * x + y) % 10 !== 0), Bt = d2(b);
        return D(`㉠은 0.01이 ${n}개인 수이고, ㉡은 ㉠보다 ${Bt}만큼 더 큰 수이다. ㉠과 ㉡의 합은?`, (2 * n + b) / 100, {
          explain: `㉠은 ${d2(n)}이고, ㉡은 ${d2(n)} + ${Bt} = ${s2(n + b)}이다. ${d2(n)} + ${s2(n + b)} = ${d2(2 * n + b)}`, facts: { calc: [[`0.01*${n}+0.01*${n}+${Bt}`, 0]] }
        });
      }),
      H('h-diff-tenth', '두 소수의 차의 1/10', '심64', (d) => {
        const [a, b] = d.until(() => { const x = one(d, 310, 980); return [x, two(d, 105, x - 30)]; }, () => true), A = s2(a), Bt = d2(b);
        return D(`${dj(A, '과/와')} ${Bt}의 차의 ${TENTH}은?`, (a - b) / 1000, {
          explain: `${A} − ${Bt} = ${d2(a - b)}이다. ${d2(a - b)}의 ${TENTH}은 ${d3(a - b)}이다.`, facts: { calc: [[`(${A}-${Bt})/10`, 0]] }
        });
      }),
      H('h-cards-sum', '수 카드로 만든 가장 큰 수와 가장 작은 수의 합', '①121 ②104 ③92 심76', (d) => {
        const [lo, mid, hi] = asc3(d), big = hi * 100 + mid * 10 + lo, small = lo * 100 + mid * 10 + hi;
        return D('수 카드 3장과 소수점 카드를 한 번씩 모두 사용하여 소수 두 자리 수를 만들려고 한다. 만들 수 있는 가장 큰 수와 가장 작은 수의 합은?', (big + small) / 100, {
          figure: cards(d.shuffle([lo, mid, hi]).concat(['.'])), explain: `가장 큰 수는 ${d2(big)}, 가장 작은 수는 ${d2(small)}이다. ${d2(big)} + ${d2(small)} = ${s2(big + small)}`,
          facts: { calc: [[`(${hi}+${mid}/10+${lo}/100)+(${lo}+${mid}/10+${hi}/100)`, 0]], unseen: [10, 100] }
        });
      }),
      H('h-cards-diff', '수 카드로 만든 가장 큰 수와 가장 작은 수의 차', '①121 ②104 ③92 심76', (d) => {
        const [lo, mid, hi] = asc3(d), big = hi * 100 + mid * 10 + lo, small = lo * 100 + mid * 10 + hi;
        return D('수 카드 3장과 소수점 카드를 한 번씩 모두 사용하여 소수 두 자리 수를 만들려고 한다. 만들 수 있는 가장 큰 수와 가장 작은 수의 차는?', (big - small) / 100, {
          figure: cards(d.shuffle([lo, mid, hi]).concat(['.'])), explain: `가장 큰 수는 ${d2(big)}, 가장 작은 수는 ${d2(small)}이다. ${d2(big)} − ${d2(small)} = ${d2(big - small)}`,
          facts: { calc: [[`(${hi}+${mid}/10+${lo}/100)-(${lo}+${mid}/10+${hi}/100)`, 0]], unseen: [10, 100] }
        });
      }),
      H('h-cards-mixed', '자릿수가 다른 두 수를 만들어 빼기', '②105 ③93 심77', (d) => {
        // 가장 큰 소수 한 자리 수는 □□.□ 꼴이다.
        const [lo, mid, hi] = asc3(d), big = (hi * 10 + mid) * 100 + lo * 10, small = lo * 100 + mid * 10 + hi;
        return D('수 카드 3장과 소수점 카드를 한 번씩 모두 사용하여 만들 수 있는 가장 큰 소수 한 자리 수와 가장 작은 소수 두 자리 수의 차는?', (big - small) / 100, {
          figure: cards(d.shuffle([lo, mid, hi]).concat(['.'])), explain: `가장 큰 소수 한 자리 수는 ${s2(big)}, 가장 작은 소수 두 자리 수는 ${d2(small)}이다. ${s2(big)} − ${d2(small)} = ${d2(big - small)}`,
          facts: { calc: [[`(${hi}*10+${mid}+${lo}/10)-(${lo}+${mid}/10+${hi}/100)`, 0]], unseen: [10, 100] }
        });
      }),
      H('h-cards-top-two', '가장 큰 수와 두 번째로 큰 수의 합', '③94', (d) => {
        const [lo, mid, hi] = asc3(d), first = hi * 100 + mid * 10 + lo, second = hi * 100 + lo * 10 + mid;
        return D('수 카드 3장과 소수점 카드를 한 번씩 모두 사용하여 만들 수 있는 소수 두 자리 수 가운데 가장 큰 수와 두 번째로 큰 수의 합은?', (first + second) / 100, {
          figure: cards(d.shuffle([lo, mid, hi]).concat(['.'])), explain: `가장 큰 수는 ${d2(first)}, 두 번째로 큰 수는 ${d2(second)}이다. ${d2(first)} + ${d2(second)} = ${s2(first + second)}`,
          facts: { calc: [[`(${hi}+${mid}/10+${lo}/100)+(${hi}+${lo}/10+${mid}/100)`, 0]], unseen: [10, 100] }
        });
      }),
      H('h-cards-form', '수 카드로 차가 가장 큰 뺄셈식 만들기', '②106 ③92', (d) => {
        const s = uniq(d, 4).sort((p, q) => p - q), big = s[3] * 10 + s[2], small = s[0] * 10 + s[1], blank = `${box()}.${box()}`;
        return D('수 카드 4장을 한 번씩 모두 사용하여 다음과 같은 뺄셈식을 만들려고 한다. 차가 가장 클 때의 차는?', (big - small) / 10, {
          figure: cards(d.shuffle(s)) + quote(expr(blank, '-', blank)), explain: `가장 큰 수 ${d1(big)}에서 가장 작은 수 ${dj(d1(small), '을/를')} 뺀다. ${d1(big)} − ${d1(small)} = ${d1(big - small)}`,
          facts: { calc: [[`(${s[3]}+${s[2]}/10)-(${s[0]}+${s[1]}/10)`, 0]], unseen: [10] }
        });
      }),
      H('h-word-three', '문장제: 한 양을 먼저 구해 전체에서 빼기', '심88', (d) => {
        const [w, a, b] = d.until(() => [one(d, 310, 690), two(d, 105, 189), two(d, 12, 58)], ([x, y, z]) => x - 2 * y - z >= 20 && (2 * y + z) % 10 !== 0), Wt = s2(w), A = d2(a), Bt = d2(b);
        return D(`물 ${Wt} L 가운데 오전에 ${A} L를 마셨고, 오후에는 오전보다 ${Bt} L 더 많이 마셨다. 남은 물은 몇 L인가?`, (w - 2 * a - b) / 100, {
          unit: 'L', explain: `오후에 마신 물은 ${A} + ${Bt} = ${d2(a + b)}(L)이다. ${Wt} − ${A} − ${d2(a + b)} = ${d2(w - 2 * a - b)}`, facts: { calc: [[`${Wt}-${A}-(${A}+${Bt})`, 0]] }
        });
      }),
      H('h-word-two-sums', '문장제: 두 사람의 합을 비교하기', '①133 ②121 ③105 심89', (d) => {
        // 틀린 보기: 더 잘 뛴 한 번의 기록만 비교한 차, 합이 작은 사람
        const names = two2(d), made = d.until(() => { const rows = [[two(d, 285, 439), one(d, 260, 430)], [two(d, 285, 439), one(d, 260, 430)]]; return { rows, sums: rows.map(([x, y]) => x + y), best: rows.map(([x, y]) => Math.max(x, y)) }; },
          ({ sums, best }) => Math.abs(sums[0] - sums[1]) >= 3 && Math.abs(sums[0] - sums[1]) <= 60 && best[0] !== best[1] && Math.abs(best[0] - best[1]) !== Math.abs(sums[0] - sums[1]));
        const { rows, sums, best } = made, gap = Math.abs(sums[0] - sums[1]), other = Math.abs(best[0] - best[1]), winner = sums[0] > sums[1] ? 0 : 1, list = d.shuffle([[0, gap], [1, gap], [0, other], [1, other]]);
        return C(`멀리뛰기를 두 번씩 하였다. ${names[0]}의 기록은 ${d2(rows[0][0])} m와 ${s2(rows[0][1])} m이고, ${names[1]}의 기록은 ${d2(rows[1][0])} m와 ${s2(rows[1][1])} m이다. 두 기록의 합은 누가 몇 m 더 긴가?`, list.map(([who, n]) => `${names[who]}, ${s2(n)} m`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `${names[0]}의 합은 ${d2(sums[0])} m, ${names[1]}의 합은 ${d2(sums[1])} m이다. ${d2(Math.max(...sums))} − ${d2(Math.min(...sums))} = ${s2(gap)}`, facts: { who: { values: sums, options: list } }
        });
      }),
      H('h-word-equal-sum', '문장제: 합이 같은 두 모둠의 빈 값', '①135', (d) => {
        const [a, b, c] = d.until(() => [one(d, 12510, 13890), one(d, 12510, 13890), one(d, 12510, 13890)], ([x, y, z]) => new Set([x, y, z, x + y - z]).size === 4 && (x + y - z) % 100 !== 0 && x + y - z >= 12000 && x + y - z <= 14500), A = s2(a), Bt = s2(b), Ct = s2(c);
        return D(`가 모둠 두 사람의 키는 ${A} cm와 ${Bt} cm이고, 나 모둠 두 사람의 키는 ${Ct} cm와 □ cm이다. 두 모둠의 키의 합이 같을 때, □ 안에 알맞은 수는?`, (a + b - c) / 100, {
          explain: `가 모둠의 키의 합은 ${A} + ${Bt} = ${s2(a + b)}(cm)이다. □ = ${s2(a + b)} − ${Ct} = ${s2(a + b - c)}`, facts: { calc: [[`${A}+${Bt}-${Ct}`, 0]] }
        });
      }),
      H('h-word-box', '문장제: 물건 한 개의 무게로 빈 상자의 무게 구하기', '①136 심101', (d) => {
        const [book, empty] = [two(d, 35, 98), one(d, 60, 190)], a = empty + 10 * book, A = s2(a), Bt = s2(a - book);
        return D(`똑같은 책 10권이 든 상자의 무게는 ${A} kg이다. 책 한 권을 꺼낸 다음 무게를 재었더니 ${Bt} kg이었다. 빈 상자의 무게는 몇 kg인가?`, empty / 100, {
          unit: 'kg', explain: `책 한 권의 무게는 ${A} − ${Bt} = ${d2(book)}(kg)이고, 10권의 무게는 그 10배인 ${s2(10 * book)} kg이다. 빈 상자의 무게는 ${A} − ${s2(10 * book)} = ${s2(empty)}(kg)이다.`, facts: { calc: [[`${A}-(${A}-${Bt})*10`, 0]] }
        });
      }),
      H('h-tape-overlap', '문장제: 겹친 부분의 길이', '심94', (d) => {
        const [a, over] = d.until(() => [two(d, 505, 989), two(d, 105, 389)], ([x, y]) => (2 * x - y) % 10 !== 0), A = d2(a), Ct = d2(2 * a - over);
        return D(`길이가 ${A} cm인 색 테이프 2장을 겹쳐서 한 줄로 이어 붙였더니 전체 길이가 ${Ct} cm가 되었다. 겹친 부분의 길이는 몇 cm인가?`, over / 100, {
          unit: 'cm', figure: tapes(`${A} cm`, `${A} cm`, '?'), explain: `겹치지 않게 이으면 ${A} + ${A} = ${s2(2 * a)}(cm)이다. 겹친 부분만큼 짧아졌으므로 ${s2(2 * a)} − ${Ct} = ${d2(over)}`, facts: { calc: [[`${A}+${A}-${Ct}`, 0]] }
        });
      }),
      H('h-line-overlap', '문장제: 한 길 위에서 겹친 구간', '심95', (d) => {
        const [x, over, y] = d.until(() => [two(d, 205, 589), two(d, 105, 389), two(d, 205, 489)], ([p, q, r]) => (p + q) % 10 !== 0 && (q + r) % 10 !== 0 && (p + q + r) % 10 !== 0), A = d2(x + over), Bt = d2(over + y), Ct = d2(x + over + y);
        return D(`한 길 위에 집, 병원, 공원, 학교가 차례로 있다. 집에서 공원까지의 거리는 ${A} km, 병원에서 학교까지의 거리는 ${Bt} km, 집에서 학교까지의 거리는 ${Ct} km이다. 병원에서 공원까지의 거리는 몇 km인가?`, over / 100, {
          unit: 'km', figure: route([['집', 0, 50], ['병원', 30, 50], ['공원', 64, 50], ['학교', 100, 50]], [[0, 1], [1, 2], [2, 3]], 40),
          explain: `집에서 공원까지와 병원에서 학교까지를 더하면 병원에서 공원까지가 두 번 들어간다. ${A} + ${Bt} = ${s2(x + 2 * over + y)}, ${s2(x + 2 * over + y)} − ${Ct} = ${d2(over)}`, facts: { calc: [[`${A}+${Bt}-${Ct}`, 0]] }
        });
      }),
      H('h-route-units', '문장제: 단위가 섞인 두 길의 비교', '심47', (d) => {
        // 틀린 보기: m를 km로 바꿀 때 자리를 잘못 둔 차, 더 먼 길
        const places = ['우체국', '도서관'], made = d.until(() => { const rows = [[d.int(4, 19), d.int(12, 88) * 10], [d.int(4, 19), d.int(12, 88) * 10]]; return { rows, sums: rows.map(([km, m]) => km * 100 + m) }; },
          ({ rows, sums }) => rows.every(([km]) => km % 10 !== 0) && rows[0][0] !== rows[1][0] && Math.abs(sums[0] - sums[1]) >= 30 && Math.abs(sums[0] - sums[1]) <= 90 && (rows[0][0] < rows[1][0]) !== (sums[0] < sums[1]));
        const { rows, sums } = made, gap = Math.abs(sums[0] - sums[1]), winner = sums[0] < sums[1] ? 0 : 1, list = d.shuffle([[0, gap], [1, gap], [0, gap * 10], [1, gap * 10]]);
        return C(`집에서 서점까지 가는 길이 두 가지 있다. 우체국을 거쳐 가는 길은 ${d1(rows[0][0])} km를 간 다음 ${rows[0][1]} m를 더 가야 하고, 도서관을 거쳐 가는 길은 ${d1(rows[1][0])} km를 간 다음 ${rows[1][1]} m를 더 가야 한다. 어느 곳을 거쳐 가는 길이 몇 km 더 짧은가?`, list.map(([who, n]) => `${places[who]}, ${sx(n, 3)} km`), list.findIndex(([who, n]) => who === winner && n === gap), {
          explain: `우체국을 거쳐 가는 길은 ${d1(rows[0][0])} + ${d2(rows[0][1] / 10)} = ${s3(sums[0])}(km), 도서관을 거쳐 가는 길은 ${d1(rows[1][0])} + ${d2(rows[1][1] / 10)} = ${s3(sums[1])}(km)이다. 차는 ${sx(gap, 3)} km이다.`, facts: { who: { values: sums, options: list, smaller: true } }
        });
      }),
      H('h-units-twice', '문장제: 단위를 맞추어 두 번 덜어 내기', '심46', (d) => {
        const [n, a, b] = d.until(() => [d.int(505, 989) * 10, two(d, 105, 389), two(d, 105, 389)], ([x, y, z]) => (x / 10) % 10 !== 0 && x / 10 - y - z >= 30 && (x / 10 - y - z) % 10 !== 0), A = d2(a), Bt = d2(b);
        return D(`밀가루 ${n} g에서 ${A} kg을 덜어 내고, 다시 ${Bt} kg을 덜어 냈다. 남은 밀가루는 몇 kg인가?`, (n / 10 - a - b) / 100, {
          unit: 'kg', explain: `${n} g은 ${d2(n / 10)} kg이다. ${d2(n / 10)} − ${A} = ${s2(n / 10 - a)}, ${s2(n / 10 - a)} − ${Bt} = ${d2(n / 10 - a - b)}`, facts: { calc: [[`${n}/1000-${A}-${Bt}`, 0]], unseen: [1000] }
        });
      }),
      H('h-table-gap', '문장제: 표에서 차를 구해 비교하기', '심90', (d) => {
        const who = d.pick(NAMES), [h1, g1, g2] = d.until(() => [d.int(1201, 1289), d.int(31, 79), d.int(31, 79)], ([x, p, q]) => p !== q && p % 10 !== 0 && q % 10 !== 0 && x % 10 !== 0 && (x + p) % 10 !== 0 && (x + p + q) % 10 !== 0), hs = [h1, h1 + g1, h1 + g1 + g2], first = g1 > g2;
        return D(`${who}의 키를 해마다 같은 날에 잰 표이다. 1년 동안 키가 가장 많이 자랐을 때 자란 키는 몇 cm인가?`, Math.max(g1, g2) / 10, {
          unit: 'cm', figure: table(['학년', '키'], ['2학년', '3학년', '4학년'].map((grade, i) => [grade, `${d1(hs[i])} cm`])),
          explain: `2학년에서 3학년 사이에 ${d1(hs[1])} − ${d1(hs[0])} = ${d1(g1)}(cm), 3학년에서 4학년 사이에 ${d1(hs[2])} − ${d1(hs[1])} = ${d1(g2)}(cm) 자랐다. 더 큰 수는 ${d1(Math.max(g1, g2))}이다.`,
          facts: { calc: [[first ? `${d1(hs[1])}-${d1(hs[0])}` : `${d1(hs[2])}-${d1(hs[1])}`, 0]] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
