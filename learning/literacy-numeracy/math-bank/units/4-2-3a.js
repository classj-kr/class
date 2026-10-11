// 4학년 2학기 3단원 소수의 덧셈과 뺄셈 — 단원 틀과 기본 문항(쓰고 읽기, 자릿값, 소수 사이의 관계, 단위, 크기 비교, 소수 한 자리 수의 덧셈과 뺄셈).
// 수집해 둔 교과서 8종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 137·124·109꼴, 심화꼴 102꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/4-2-3/싣기_대조표.md 에 있다.
// (소수 두 자리 수의 덧셈과 뺄셈, 자릿수가 다른 계산, 계산의 활용, 문장제, 실력 문항은 4-2-3b.js 에 있다.)
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다. 주는 것(식·그림·표·수직선·읽은 말), 묻는 것(값·고르기·차례·틀린 것·빈칸), 수의 꼴(소수 두 자리·세 자리, 0이 낀 자리,
//    10개가 넘는 묶음)이 다르면 따로 싣는다. 글이 같은 꼴이 되는 것은 facts.rule 에 서로 다른 이름을 달고, 그 조건은 수를 뽑는 코드가 지킨다.
//  - 숫자만 다르거나 상황(이름·물건)만 다른 것은 한 번만 싣는다.
//  - 수는 모두 정수(100배·1000배 한 수)로 뽑아 셈하고 글에 적을 때만 소수로 적는다. 답이 자연수가 되는 수는 뽑지 않는다(자연수 답은 따로 N 으로 받는다).
//  - 소수 세 자리 수는 쓰고 읽기·자릿값·크기 비교·10배와 1/10·단위 바꾸기에서만 다룬다(덧셈과 뺄셈은 소수 두 자리 수의 범위까지).
// 뺀 것과 까닭(꼴 번호는 ① ② ③ = 기본꼴 1·2·3, 심 = 심화꼴)
//  - 작도: 모눈에 색칠하기(①9 심3), 수직선에 나타내기(①12 ②25 ③10), 색칠하거나 화살표로 나타내어 비교하기(①52·53 ③31), 0에 빗금 치기(②24 ③30의 변형)
//  - 서술형: 비교한 방법·틀린 까닭 쓰기(②53 ③38), 소수를 여러 방법으로 설명하기(③11)
//  - 그림이 필요해 미룬 것: 1000칸 모눈(①8 ③13, ②2의 변형 — 휴대폰 너비에서는 한 칸이 5px 남짓이라 셀 수 없다), 자릿값 칸에 숫자 옮겨 쓰기(③41, ②29의 변형)
//  - 조건 풀이·경우 따지기가 어려움의 대부분인 것: 숫자끼리의 관계가 낀 조건(①32 ③26 심13의 일부·14), 수 카드로 만든 수 가운데 범위 안의 수 모두(①67 ②52),
//    □가 낀 세 소수의 차례(심39)
//  - 범위 밖: 0.939보다 0.01만큼 작은 수(①35 — 소수 세 자리 수의 뺄셈), 상자 300개의 높이로 한 개의 높이(심30 — 자연수÷자연수의 몫이 소수)
//  - 뜻 없는 셈: □ 안에 들어갈 수끼리 더하기(심18 — □가 다른 것 고르기만 실었다)
//  - 같은 문제: 규칙을 따라가는 화살표 길(②38)은 사슬과 같고 길 그림도 알 수 없다. 글자 암호 풀기(②28의 변형)는 놀이, 수직선에 나타낸 두 수의 비교(②39의 수직선 쪽)는 수직선 읽기와 같다.
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
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

  // ── 소수 두 자리 수와 소수 세 자리 수: 쓰고 읽기 ─────────────────
  const READ = [
    T('read-frac100', '분모가 100인 분수를 소수로 나타내기', '①1 ②1 ③1 심1', (d) => {
      const k = d.until(() => d.int(11, 99), (v) => v % 10 !== 0);
      return D('분수를 소수로 나타내면?', k / 100, { figure: quote(frac(k, 100)), explain: `${frac(k, 100)}${tail(k, '은/는')} 0.01이 ${k}개인 수이므로 소수로 ${d2(k)}이다.`, facts: { calc: [[`${k}/100`, 0]], rule: 'hundredths' } });
    }),
    T('read-frac100-zero', '분자가 한 자리 수인 분모 100인 분수', '①1 ③1 심2', (d) => {
      // 틀린 보기: 분모의 0을 세지 않은 것(0.4), 0을 하나 더 쓴 것(0.004)
      const k = d.int(2, 9), list = d.shuffle([[d2(k), k / 100], [d1(k), k / 10], [d3(k), k / 1000]]);
      return C(`${frac(k, 100)}${tail(k, '을/를')} 소수로 바르게 나타낸 것은?`, list.map((row) => row[0]), list.findIndex((row) => row[1] === k / 100), {
        explain: `${frac(1, 100)}은 0.01이다. ${frac(k, 100)}${tail(k, '은/는')} 0.01이 ${k}개인 수이므로 ${d2(k)}이다.`, facts: { pick: { expr: `${k}/100`, options: list.map((row) => row[1]) }, rule: 'hundredths' }
      });
    }),
    T('read-mixed100', '분모가 100인 대분수를 소수로 나타내기', '①1 ②1 ③1 심1', (d) => {
      const w = d.int(1, 9), k = d.until(() => (d.bool() ? d.int(1, 9) : d.int(11, 99)), (v) => v % 10 !== 0), n = w * 100 + k;
      return D('대분수를 소수로 나타내면?', n / 100, { figure: quote(mixed(w, k, 100)), explain: `${frac(k, 100)}${tail(k, '은/는')} ${d2(k)}이므로 ${josa(w, '과/와')} ${d2(k)}만큼인 수 ${d2(n)}이다.`, facts: { calc: [[`${w}+${k}/100`, 0]], rule: 'hundredths' } });
    }),
    T('read-frac1000', '분모가 1000인 분수를 소수로 나타내기', '①2 ②1 ③12 심1', (d) => {
      const k = d.until(() => d.int(101, 999), (v) => v % 10 !== 0);
      return D('분수를 소수로 나타내면?', k / 1000, { figure: quote(frac(k, 1000)), explain: `${frac(k, 1000)}${tail(k, '은/는')} 0.001이 ${k}개인 수이므로 소수로 ${d3(k)}이다.`, facts: { calc: [[`${k}/1000`, 0]], rule: 'thousandths' } });
    }),
    T('read-frac1000-zero', '분자가 두 자리 수인 분모 1000인 분수', '①2 ③12 심1·2', (d) => {
      // 틀린 보기: 0.23(분모 100으로 봄), 2.3, 0.203(0을 가운데에 넣음)
      const a = d.int(1, 9), b = digit(d, [a]), k = a * 10 + b, list = d.shuffle([[d3(k), k / 1000], [d2(k), k / 100], [d1(k), k / 10], [d3(a * 100 + b), (a * 100 + b) / 1000]]);
      return C(`${frac(k, 1000)}${tail(k, '을/를')} 소수로 바르게 나타낸 것은?`, list.map((row) => row[0]), list.findIndex((row) => row[1] === k / 1000), {
        explain: `${frac(1, 1000)}은 0.001이다. ${frac(k, 1000)}${tail(k, '은/는')} 0.001이 ${k}개인 수이므로 ${d3(k)}이다.`, facts: { pick: { expr: `${k}/1000`, options: list.map((row) => row[1]) }, rule: 'thousandths' }
      });
    }),
    T('read-mixed1000', '분모가 1000인 대분수를 소수로 나타내기', '①2 ②1 ③12', (d) => {
      const w = d.int(1, 9), k = d.until(() => d.int(11, 99), (v) => v % 10 !== 0), n = w * 1000 + k;
      return D('대분수를 소수로 나타내면?', n / 1000, { figure: quote(mixed(w, k, 1000)), explain: `${frac(k, 1000)}${tail(k, '은/는')} ${d3(k)}이므로 ${josa(w, '과/와')} ${d3(k)}만큼인 수 ${d3(n)}이다.`, facts: { calc: [[`${w}+${k}/1000`, 0]], rule: 'thousandths' } });
    }),
    T('read-frac-wrong', '분수를 소수로 잘못 나타낸 것', '①6 ③1·12 심2', (d) => {
      // 틀리게 적는 꼴: 14/1000 = 0.14, 1과 7/100 = 1.7, 5/100 = 0.5
      const a = d.until(() => d.int(11, 99), (v) => v % 10 !== 0), b = d.until(() => d.int(11, 99), (v) => v % 10 !== 0), c = d.int(2, 9), w = d.int(1, 5), e = d.until(() => d.int(101, 999), (v) => v % 10 !== 0);
      // 줄: [분수 글, 적힌 소수, 분자(대분수는 가분수로 고친 것), 분모]
      const risky = [
        (ok) => [frac(b, 1000), ok ? d3(b) : d2(b), b, 1000],
        (ok) => [mixed(w, c, 100), ok ? d2(w * 100 + c) : d1(w * 10 + c), w * 100 + c, 100],
        (ok) => [frac(c, 100), ok ? d2(c) : d1(c), c, 100]
      ], keep = d.shuffle([0, 1, 2]);
      const rows = d.shuffle([risky[keep[0]](false), risky[keep[1]](true), [frac(a, 100), d2(a), a, 100], [frac(e, 1000), d3(e), e, 1000]]);
      const wrong = rows.findIndex((row) => row[2] / row[3] !== Number(row[1]));
      return C('분수를 소수로 잘못 나타낸 것은?', rows.map((row) => `${row[0]} = ${row[1]}`), wrong, {
        explain: `분모가 100인 분수는 소수 두 자리 수로, 분모가 1000인 분수는 소수 세 자리 수로 나타낸다. 바르게 나타내면 ${rows[wrong][0]} = ${fx(rows[wrong][2], rows[wrong][3] === 100 ? 2 : 3)}이다.`,
        facts: { claimed: rows.map((row) => [`${row[2]}/${row[3]}`, Number(row[1])]), claimedWant: false }
      });
    }),
    T('read-part-of', '전체의 얼마인지 소수로 나타내기', '②12', (d) => {
      const k = d.until(() => d.int(105, 895), (v) => v % 10 !== 0), who = d.pick(['어린이', '여학생', '4학년 학생']);
      return D(`운동장에 모인 1000명 가운데 ${josa(who, '은/는')} ${k}명이다. ${josa(who, '은/는')} 전체의 얼마인지 소수로 나타내면?`, k / 1000, { explain: `전체를 똑같이 1000으로 나눈 것 중의 ${k}이므로 ${frac(k, 1000)}이고 소수로 ${d3(k)}이다.`, facts: { calc: [[`${k}/1000`, 0]] } });
    }),
    T('read-say2', '소수 두 자리 수 읽기', '①3 ②4 ③15', (d) => {
      // 15.06: 자연수 부분을 숫자 하나씩 읽은 것(일오 점), 0을 빼고 읽거나 소수 부분을 자연수처럼 읽은 것(점 육, 점 사십칠), 두 숫자의 차례를 바꾼 것
      const w = d.int(11, 59), h = d.int(1, 9), t = d.pick([0, 0, digit(d, [h])]), x = `${w}.${t}${h}`, ws = String(w).split('').map((c) => DIGITS[c]).join('');
      const rows = d.shuffle([[read(x), true], [`${ws} 점 ${DIGITS[t]}${DIGITS[h]}`, false], [`${say(w)} 점 ${t === 0 ? DIGITS[h] : say(t * 10 + h)}`, false], [`${say(w)} 점 ${DIGITS[h]}${DIGITS[t]}`, false]]);
      return C(`${dj(x, '을/를')} 바르게 읽은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `자연수 부분은 자연수를 읽듯이 읽고, 소수점 아래는 숫자를 하나씩 차례로 읽는다. ${dj(x, '은/는')} ${said(read(x))} 읽는다.`, facts: Object.assign(truthOf(rows, true), { rule: 'two' })
      });
    }),
    T('read-say3', '소수 세 자리 수 읽기', '①3 ②4 ③15·16 심7', (d) => {
      // 4.203: 소수 부분을 자연수처럼 읽은 것(이백삼), 0을 빼고 읽은 것(이삼), 0의 자리를 옮겨 읽은 것(영이삼)
      const w = d.int(0, 9), a = d.int(1, 9), c = digit(d, [a]), x = `${w}.${a}0${c}`, head = w ? say(w) : '영';
      const rows = d.shuffle([[read(x), true], [`${head} 점 ${say(a * 100 + c)}`, false], [`${head} 점 ${DIGITS[a]}${DIGITS[c]}`, false], [`${head} 점 영${DIGITS[a]}${DIGITS[c]}`, false]]);
      return C(`${dj(x, '을/를')} 바르게 읽은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `소수점 아래는 숫자를 하나씩 차례로 읽고, 0도 「영」이라고 읽는다. ${dj(x, '은/는')} ${said(read(x))} 읽는다.`, facts: Object.assign(truthOf(rows, true), { rule: 'three' })
      });
    }),
    T('read-say-wrong', '소수를 잘못 읽은 것', '①5 ②5 ③16', (d) => {
      const [a, b, c] = uniq(d, 3), [p, q, r] = uniq(d, 3), bad = d.int(0, 2);
      const x = `${a}.${b}${c}`, y = `${p}.0${q}`, z = `0.${r}${a}${q}`;
      const rows = d.shuffle([
        [x, bad === 0 ? `${say(a)} 점 ${say(b * 10 + c)}` : read(x), bad !== 0],
        [y, bad === 1 ? `${say(p)} 점 ${DIGITS[q]}` : read(y), bad !== 1],
        [z, bad === 2 ? `영 점 ${say(r * 100 + a * 10 + q)}` : read(z), bad !== 2]
      ]);
      const miss = rows.find((row) => !row[2]);
      return C('소수를 잘못 읽은 것은?', rows.map((row) => `${row[0]} → ${row[1]}`), rows.indexOf(miss), {
        explain: `소수점 아래는 숫자를 하나씩 차례로 읽고, 0도 빠뜨리지 않고 읽는다. ${dj(miss[0], '은/는')} ${said(read(miss[0]))} 읽는다.`, facts: { truth: rows.map((row) => row[2]), want: false }
      });
    }),
    T('read-write2', '읽은 말을 소수 두 자리 수로 쓰기', '①4', (d) => {
      const w = d.int(1, 9), h = d.int(1, 9), t = d.pick([0, digit(d, [h])]), x = `${w}.${t}${h}`;
      return D('다음을 소수로 쓰면?', (w * 100 + t * 10 + h) / 100, { figure: quote(read(x)), explain: `「점」 뒤의 말은 소수점 아래의 숫자를 차례로 읽은 것이다. ${read(x)} → ${x}`, facts: { spoken: [read(x), x] } });
    }),
    T('read-write3', '읽은 말을 소수 세 자리 수로 쓰기', '①4 심7', (d) => {
      const w = d.int(11, 49), a = d.int(1, 9), b = d.pick([0, digit(d, [a])]), c = d.int(1, 9), x = `${w}.${a}${b}${c}`;
      return D('다음을 소수로 쓰면?', (w * 1000 + a * 100 + b * 10 + c) / 1000, { figure: quote(read(x)), explain: `「점」 앞의 말은 자연수 부분이고, 뒤의 말은 소수점 아래의 숫자를 차례로 읽은 것이다. ${read(x)} → ${x}`, facts: { spoken: [read(x), x] } });
    }),
    T('read-grid', '색칠한 모눈을 소수로 나타내기', '①7 ②2 ③2', (d) => {
      const k = d.until(() => d.int(12, 96), (v) => v % 10 !== 0);
      return D('전체 크기가 1인 모눈종이에서 색칠한 부분의 크기를 소수로 나타내면?', k / 100, { figure: grid100(k), explain: `전체를 똑같이 100칸으로 나눈 것 중의 ${k}칸이므로 ${frac(k, 100)}이고 소수로 ${d2(k)}이다.`, facts: { calc: [[`${k}/100`, 0]] } });
    }),
    T('read-line2', '수직선에서 소수 두 자리 수 읽기', '①10 ②3 ③3 심4', (d) => {
      const w = d.int(0, 8), t = d.int(0, 7), from = w * 10 + t, i = d.int(1, 9), j = d.int(11, 19), L = [0, 1, 2].map((k) => sx(from + k, 1));
      const at = (k) => `${L[0]}+(${L[1]}-${L[0]})/10*${k}`;
      return M('수직선에서 ㉠, ㉡이 나타내는 수는?', [{ label: LABELS[0], answer: (from * 10 + i) / 100, decimal: true }, { label: LABELS[1], answer: (from * 10 + j) / 100, decimal: true }], {
        figure: dline(L, [[i, LABELS[0]], [j, LABELS[1]]]), explain: `${dj(L[0], '과/와')} ${L[1]} 사이를 똑같이 10칸으로 나누었으므로 작은 눈금 한 칸은 0.01이다. ㉠은 ${L[0]}에서 ${i}칸 간 ${d2(from * 10 + i)}, ㉡은 ${L[1]}에서 ${j - 10}칸 간 ${d2(from * 10 + j)}이다.`,
        facts: { calc: [[at(i), 0], [at(j), 1]] }
      });
    }),
    T('read-line3', '수직선에서 소수 세 자리 수 읽기', '①11 ②3 ③14 심4', (d) => {
      const from = d.until(() => d.int(101, 989), (v) => v % 10 !== 9), k = d.int(1, 9), L = [sx(from, 2), sx(from + 1, 2)];
      return D('수직선에서 ㉠이 나타내는 수는?', (from * 10 + k) / 1000, {
        figure: dline(L, [[k, LABELS[0]]]), explain: `${dj(L[0], '과/와')} ${L[1]} 사이를 똑같이 10칸으로 나누었으므로 작은 눈금 한 칸은 0.001이다. ㉠은 ${L[0]}에서 ${k}칸 간 ${d3(from * 10 + k)}이다.`,
        facts: { calc: [[`${L[0]}+(${L[1]}-${L[0]})/10*${k}`, 0]] }
      });
    })
  ];

  // ── 자릿값 ─────────────────────────────────────────────────────
  // 1000배 한 수 n 의 자리 숫자를 검사가 다시 셈하는 식(k: 0 일의 자리 … 3 소수 셋째 자리)
  const dxOf = (n, k) => `((${n}-${n}%${P10[3 - k]})/${P10[3 - k]})%10`;
  // 숫자 t 가 자리 p(-1 십의 자리, 0 일의 자리, 1~3 소수 첫째~셋째 자리)에 한 번만 든 수를 적은 글과, 그 숫자가 나타내는 값(1000배)
  function withDigitAt(d, t, p) {
    const [x, y, z] = [digit(d, [t]), digit(d, [t]), digit(d, [t])];
    const text = p === -1 ? `${t}${x}.${y}${z}` : p === 0 ? `${t}.${x}${y}${z}` : p === 1 ? d.pick([`${x}.${t}${y}${z}`, `${x}.${t}${y}`]) : p === 2 ? d.pick([`${x}.${y}${t}`, `${x}${z}.${y}${t}`]) : `${x}.${y}${z}${t}`;
    return { text, value: t * (p === -1 ? 10000 : P10[3 - p]) };
  }
  const PLACE = [
    T('place-count100', '0.01이 몇 개인 수', '①14 ②9 ③6 심5', (d) => {
      const n = d.until(() => d.int(102, 989), (v) => v % 10 !== 0);
      return D(`0.01이 ${n}개인 수는?`, n / 100, { explain: `0.01이 100개이면 1이다. 0.01이 ${n}개이면 ${d2(n)}이다.`, facts: { calc: [[`0.01*${n}`, 0]], rule: 'hundredths' } });
    }),
    T('place-count1000', '0.001이 몇 개인 수', '①15 ②9 ③20 심5', (d) => {
      const n = d.until(() => (d.bool() ? d.int(12, 98) : d.int(1002, 9989)), (v) => v % 10 !== 0);
      return D(`0.001이 ${n}개인 수는?`, n / 1000, { explain: `0.001이 10개이면 0.01, 100개이면 0.1, 1000개이면 1이다. 0.001이 ${n}개이면 ${d3(n)}이다.`, facts: { calc: [[`0.001*${n}`, 0]], rule: 'thousandths' } });
    }),
    T('place-back100', '소수 두 자리 수는 0.01이 몇 개인 수', '①16 ②9 ③6 심5', (d) => {
      const n = d.until(() => d.int(102, 989), (v) => v % 10 !== 0 && Number(d2(v)) * 100 === v);
      return N(`${dj(d2(n), '은/는')} 0.01이 몇 개인 수인가?`, n, { unit: '개', explain: `1은 0.01이 100개인 수이다. ${dj(d2(n), '은/는')} 0.01이 ${n}개인 수이다.`, facts: { calc: [[`${d2(n)}*100`, 0]], unseen: [100], rule: 'hundredths' } });
    }),
    T('place-back1000', '소수 세 자리 수는 0.001이 몇 개인 수', '①16 ②9 ③20 심5', (d) => {
      const n = d.until(() => (d.bool() ? d.int(105, 989) : d.int(1002, 9989)), (v) => v % 10 !== 0 && Number(d3(v)) * 1000 === v);
      return N(`${dj(d3(n), '은/는')} 0.001이 몇 개인 수인가?`, n, { unit: '개', explain: `1은 0.001이 1000개인 수이다. ${dj(d3(n), '은/는')} 0.001이 ${n}개인 수이다.`, facts: { calc: [[`${d3(n)}*1000`, 0]], unseen: [1000], rule: 'thousandths' } });
    }),
    T('place-compose2', '1, 0.1, 0.01이 몇 개인 수', '①17 ②6 ③5 심5', (d) => {
      const [a, b, c] = [d.int(1, 9), d.int(1, 9), d.int(1, 9)];
      return D(`1이 ${a}개, 0.1이 ${b}개, 0.01이 ${c}개인 수는?`, (a * 100 + b * 10 + c) / 100, { explain: `${a} + 0.${b} + 0.0${c} = ${a}.${b}${c}`, facts: { calc: [[`1*${a}+0.1*${b}+0.01*${c}`, 0]], rule: 'full' } });
    }),
    T('place-compose3', '1, 0.1, 0.01, 0.001이 몇 개인 수', '①18 ②6 ③18 심5', (d) => {
      const [a, b, c, e] = [d.int(1, 9), d.int(1, 9), d.int(1, 9), d.int(1, 9)];
      return D(`1이 ${a}개, 0.1이 ${b}개, 0.01이 ${c}개, 0.001이 ${e}개인 수는?`, (a * 1000 + b * 100 + c * 10 + e) / 1000, { explain: `${a} + 0.${b} + 0.0${c} + 0.00${e} = ${a}.${b}${c}${e}`, facts: { calc: [[`1*${a}+0.1*${b}+0.01*${c}+0.001*${e}`, 0]] } });
    }),
    T('place-compose-frac', '분수 단위가 몇 개인 수', '②6 ③5·18 심5', (d) => {
      const [a, b, c, e] = [d.int(1, 9), d.int(1, 9), d.int(1, 9), d.int(1, 9)];
      return D(`1이 ${a}개, ${TENTH}이 ${b}개, ${HUNDREDTH}이 ${c}개, ${THOUSANDTH}이 ${e}개인 수를 소수로 나타내면?`, (a * 1000 + b * 100 + c * 10 + e) / 1000, {
        explain: `${TENTH}은 0.1, ${HUNDREDTH}은 0.01, ${THOUSANDTH}은 0.001이다. ${a} + 0.${b} + 0.0${c} + 0.00${e} = ${a}.${b}${c}${e}`, facts: { calc: [[`${a}+${b}/10+${c}/100+${e}/1000`, 0]] }
      });
    }),
    T('place-compose-tens', '10부터 0.01까지 몇 개인 수', '②8 ③18 심5', (d) => {
      const [a, b, c, e] = [d.int(2, 9), d.int(1, 9), d.int(1, 9), d.int(1, 9)];
      return D(`10이 ${a}개, 1이 ${b}개, 0.1이 ${c}개, 0.01이 ${e}개인 수는?`, (a * 1000 + b * 100 + c * 10 + e) / 100, { explain: `${a * 10} + ${b} + 0.${c} + 0.0${e} = ${a}${b}.${c}${e}`, facts: { calc: [[`10*${a}+1*${b}+0.1*${c}+0.01*${e}`, 0]] } });
    }),
    T('place-compose-gap', '빈 자리가 있는 수', '①19 ②8 ③18', (d) => {
      const [a, b, c] = [d.int(1, 9), d.int(1, 9), d.int(1, 9)], first = d.bool();
      const n = first ? a * 1000 + b * 100 + c : a * 1000 + b * 10 + c, units = first ? ['0.1', '0.001'] : ['0.01', '0.001'];
      return D(`1이 ${a}개, ${units[0]}이 ${b}개, ${units[1]}이 ${c}개인 수는?`, n / 1000, {
        explain: `${first ? '소수 둘째 자리' : '소수 첫째 자리'}에는 0을 쓴다. ${a} + ${fx(b, first ? 1 : 2)} + ${d3(c)} = ${d3(n)}`, facts: { calc: [[`1*${a}+${units[0]}*${b}+${units[1]}*${c}`, 0]], rule: 'gap' }
      });
    }),
    T('place-compose-over', '10개가 넘는 묶음이 낀 수', '①19 ②8 ③19', (d) => {
      const a = d.int(1, 8), first = d.bool(), b = first ? d.int(11, 19) : d.int(1, 9), c = first ? d.int(1, 9) : d.until(() => d.int(12, 98), (v) => v % 10 !== 0);
      const n = first ? a * 1000 + b * 100 + c * 10 : a * 1000 + b * 100 + c, units = first ? ['0.1', '0.01'] : ['0.1', '0.001'];
      return D(`1이 ${a}개, ${units[0]}이 ${b}개, ${units[1]}이 ${c}개인 수는?`, n / 1000, {
        explain: first ? `0.1이 ${b}개이면 ${d1(b)}이다. ${a} + ${d1(b)} + ${d2(c)} = ${s3(n)}` : `0.001이 ${c}개이면 ${d3(c)}이다. ${a} + ${d1(b)} + ${d3(c)} = ${d3(n)}`,
        facts: { calc: [[`1*${a}+${units[0]}*${b}+${units[1]}*${c}`, 0]], rule: 'over' }
      });
    }),
    T('place-decompose2', '소수 두 자리 수를 자리마다 몇 개로 나타내기', '①20 ②7 ③4', (d) => {
      const [a, b, c] = uniq(d, 3), n = a * 100 + b * 10 + c, hideTenth = d.bool();
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: hideTenth ? 0.1 : 0.01, decimal: true }], {
        figure: quote(`${dj(d2(n), '은/는')} 1이 ${box(LABELS[0])}개, ${hideTenth ? box(LABELS[1]) : '0.1'}이 ${b}개, ${hideTenth ? '0.01' : box(LABELS[1])}이 ${c}개인 수이다.`),
        explain: `${d2(n)}의 일의 자리 숫자는 ${a}, 소수 첫째 자리 숫자는 ${b}, 소수 둘째 자리 숫자는 ${c}이다. ${dj(d2(n), '은/는')} 1이 ${a}개, 0.1이 ${b}개, 0.01이 ${c}개인 수이다.`,
        facts: { parts: [[`(${n}-${n}%100)/100`, 0], [hideTenth ? '1/10' : '1/100', 1]] }
      });
    }),
    T('place-decompose3', '소수 세 자리 수를 자리마다 몇 개로 나타내기', '②7 ③17', (d) => {
      const ds = uniq(d, 4), n = toNum(ds), [i, j] = d.pick([[0, 2], [1, 3], [0, 3], [1, 2], [2, 3]]), UNIT = ['1', '0.1', '0.01', '0.001'];
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: ds[i] }, { label: LABELS[1], answer: ds[j] }], {
        figure: quote(`${dj(d3(n), '은/는')} ${UNIT.map((u, k) => `${u}이 ${k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : ds[k]}개`).join(', ')}인 수이다.`),
        explain: `${d3(n)}의 ${PLACES[i]} 숫자는 ${ds[i]}, ${PLACES[j]} 숫자는 ${ds[j]}이다.`, facts: { parts: [[dxOf(n, i), 0], [dxOf(n, j), 1]] }
      });
    }),
    T('place-table', '자릿값 표에 숫자 쓰기', '①21 ③17', (d) => {
      // 0이 낀 수: 0의 자리와 다른 한 자리를 묻는다
      const [a, x, e] = uniq(d, 3), zeroAt = d.int(1, 2), ds = zeroAt === 1 ? [a, 0, x, e] : [a, x, 0, e], n = toNum(ds), other = d.pick([1, 2, 3].filter((k) => k !== zeroAt)), asks = [zeroAt, other].sort();
      return M(`${d3(n)}의 각 자리 숫자를 표에 써넣으려고 한다. ㉠, ㉡에 알맞은 숫자는?`, asks.map((k, i) => ({ label: LABELS[i], answer: ds[k] })), {
        figure: table(['자리', '숫자'], PLACES.map((place, k) => [place, asks.includes(k) ? box(LABELS[asks.indexOf(k)]) : ds[k]])),
        explain: `${d3(n)}의 ${PLACES[asks[0]]} 숫자는 ${ds[asks[0]]}, ${PLACES[asks[1]]} 숫자는 ${ds[asks[1]]}이다.`, facts: { parts: [[dxOf(n, asks[0]), 0], [dxOf(n, asks[1]), 1]] }
      });
    }),
    T('place-name2', '숫자의 자리 이름과 나타내는 수(소수 두 자리 수)', '①22 ②13 ③7 심8', (d) => {
      const [a, b, c] = uniq(d, 3), x = `${a}.${b}${c}`, k = d.int(1, 2), t = k === 1 ? b : c;
      const rows = d.shuffle([[1, 1], [1, 2], [2, 2], [2, 1]].map(([place, size]) => [`${PLACES[place]} 숫자이고, ${dj(fx(t, size), '을/를')} 나타낸다.`, place === k && size === k]));
      return C(`${x}에서 숫자 ${t}에 대한 설명으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `${x}에서 ${josa(t, '은/는')} ${PLACES[k]} 숫자이고 ${dj(fx(t, k), '을/를')} 나타낸다.`, facts: truthOf(rows, true)
      });
    }),
    T('place-name3', '자리 숫자와 나타내는 수(소수 세 자리 수)', '①23 ②14 ③21·22 심8', (d) => {
      const [a, b, c, e] = uniq(d, 4), zero = d.int(0, 2), ds = [a, zero === 1 ? 0 : b, zero === 2 ? 0 : c, e], n = toNum(ds), k = d.pick([1, 2, 3].filter((p) => ds[p] !== 0)), t = ds[k];
      return M(`${d3(n)}에서 ${PLACES[k]} 숫자와 그 숫자가 나타내는 수는?`, [{ label: '숫자', answer: t }, { label: '나타내는 수', answer: t / P10[k], decimal: true }], {
        explain: `${d3(n)}의 ${PLACES[k]} 숫자는 ${t}이고 ${dj(fx(t, k), '을/를')} 나타낸다.`, facts: { parts: [[dxOf(n, k), 0], [`${t}/${P10[k]}`, 1]] }
      });
    }),
    T('place-value-first', '숫자가 나타내는 수(소수 첫째 자리)', '①24 ②15·16 ③8·22 심8', (d) => {
      const [a, b, c, e] = uniq(d, 4), x = `${a}.${b}${c}${e}`;
      return D(`${x}에서 숫자 ${josa(b, '이/가')} 나타내는 수는?`, b / 10, { explain: `${josa(b, '은/는')} 소수 첫째 자리 숫자이므로 ${dj(d1(b), '을/를')} 나타낸다.`, facts: { calc: [[`${b}/10`, 0]], unseen: [10], rule: 'first' } });
    }),
    T('place-value-second', '숫자가 나타내는 수(소수 둘째 자리)', '①25 ②15·16 ③8·22 심8', (d) => {
      const [a, b, c] = uniq(d, 3), x = `${a}.${b}${c}`;
      return D(`${x}에서 숫자 ${josa(c, '이/가')} 나타내는 수는?`, c / 100, { explain: `${josa(c, '은/는')} 소수 둘째 자리 숫자이므로 ${dj(d2(c), '을/를')} 나타낸다.`, facts: { calc: [[`${c}/100`, 0]], unseen: [100], rule: 'second' } });
    }),
    T('place-value-third', '숫자가 나타내는 수(소수 셋째 자리)', '①26 ②16 ③22 심8', (d) => {
      // 보기: 숫자 그대로(7), 자리를 하나씩 잘못 본 것(0.7, 0.07)
      const [a, b, c, e] = uniq(d, 4), x = `${d.bool() ? a : 0}.${b}${c}${e}`, list = d.shuffle([String(e), d1(e), d2(e), d3(e)]);
      return C(`${x}에서 숫자 ${josa(e, '이/가')} 나타내는 수는?`, list, list.indexOf(d3(e)), { explain: `${josa(e, '은/는')} 소수 셋째 자리 숫자이므로 ${dj(d3(e), '을/를')} 나타낸다.`, facts: { choose: { exprs: list, rule: 'equals', target: e / 1000 }, rule: 'third' } });
    }),
    T('place-pick-value', '숫자가 나타내는 수를 주고 소수 고르기', '①27 ②17·18 ③23', (d) => {
      const t = d.int(1, 9), k = d.int(1, 3), rows = d.shuffle([0, 1, 2, 3].map((p) => { const ds = [digit(d, [t]), digit(d, [t]), digit(d, [t]), digit(d, [t])]; ds[p] = t; return [d3(toNum(ds)), p === k]; }));
      return C(`숫자 ${josa(t, '이/가')} ${dj(fx(t, k), '을/를')} 나타내는 수는?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `${dj(fx(t, k), '을/를')} 나타내는 숫자는 ${PLACES[k]} 숫자이다. ${PLACES[k]} 숫자가 ${t}인 수는 ${rows.find((row) => row[1])[0]}이다.`, facts: truthOf(rows, true)
      });
    }),
    T('place-digit-pick', '어느 자리 숫자가 ■인 수 고르기', '②19 심10', (d) => {
      const t = d.int(1, 9), k = d.int(1, 2), o = () => digit(d, [t]);
      const rows = d.shuffle([[`${t}${o()}.${o()}${o()}`, false], [`1${t}.${o()}${o()}`.replace(/^1(?=1)/, '2'), false], [`${o()}.${o()}${t}`, k === 2], [`0.${t}${o()}`, k === 1]]);
      return C(`${PLACES[k]} 숫자가 ${t}인 수는?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `소수점 바로 오른쪽이 소수 첫째 자리, 그다음이 소수 둘째 자리이다. ${PLACES[k]} 숫자가 ${t}인 수는 ${rows.find((row) => row[1])[0]}이다.`, facts: truthOf(rows, true)
      });
    }),
    T('place-digit-max', '소수 둘째 자리 숫자가 가장 큰 수', '①29 ②19 심10', (d) => {
      // 수가 크다고 그 자리 숫자가 큰 것은 아니다: 답은 가장 큰 수가 아니다.
      const rows = d.until(() => { const hs = uniq(d, 4); return hs.map((h, i) => { const w = d.int(0, 9), t = d.int(0, 9), e = d.int(1, 9); return i % 2 ? { n: w * 1000 + t * 100 + h * 10 + e, text: `${w}.${t}${h}${e}`, h } : { n: w * 1000 + t * 100 + h * 10, text: `${w}.${t}${h}`, h }; }); },
        (list) => { const top = Math.max(...list.map((r) => r.h)), big = Math.max(...list.map((r) => r.n)); return new Set(list.map((r) => r.n)).size === 4 && list.find((r) => r.h === top).n !== big; });
      const top = Math.max(...rows.map((r) => r.h));
      return C('소수 둘째 자리 숫자가 가장 큰 수는?', rows.map((r) => r.text), rows.findIndex((r) => r.h === top), {
        explain: `소수 둘째 자리 숫자는 차례로 ${rows.map((r) => r.h).join(', ')}이다. 가장 큰 숫자는 ${top}이다.`, facts: { rank: { values: rows.map((r) => r.h), nth: 1 } }
      });
    }),
    T('place-same-rank', '같은 숫자가 나타내는 수의 크기', '①28 ②20 ③23 심9', (d) => {
      const t = d.int(2, 9), big = d.bool(), rows = d.shuffle([-1, 0, 1, 2, 3]).slice(0, 4).map((p) => withDigitAt(d, t, p)), best = big ? Math.max(...rows.map((r) => r.value)) : Math.min(...rows.map((r) => r.value));
      return C(`숫자 ${josa(t, '이/가')} 나타내는 수가 가장 ${big ? '큰' : '작은'} 것은?`, rows.map((r) => r.text), rows.findIndex((r) => r.value === best), {
        explain: `숫자 ${josa(t, '이/가')} 나타내는 수는 차례로 ${rows.map((r) => sx(r.value, 3)).join(', ')}이다. 같은 숫자라도 자리에 따라 나타내는 수가 다르다.`, facts: { rank: { values: rows.map((r) => r.value), nth: big ? 1 : 4 } }
      });
    }),
    T('place-same-odd', '같은 숫자가 나타내는 수가 다른 하나', '②20 ③23 심9', (d) => {
      const t = d.int(1, 9), o = () => digit(d, [t]), odd = d.bool() ? [`0.${t}${o()}`, d1(t)] : [`${o()}.${o()}${o()}${t}`, d3(t)];
      const rows = d.shuffle([[`0.${o()}${t}`, d2(t)], [`${o()}.0${t}`, d2(t)], [d.bool() ? `${o()}${o()}.${o()}${t}` : `${o()}.${o()}${t}${o()}`, d2(t)], odd]);
      return C(`숫자 ${josa(t, '이/가')} 나타내는 수가 나머지와 다른 하나는?`, rows.map((row) => row[0]), rows.indexOf(odd), {
        explain: `${odd[0]}에서 ${josa(t, '은/는')} ${dj(odd[1], '을/를')} 나타낸다. 나머지 수에서는 모두 소수 둘째 자리 숫자이므로 ${dj(d2(t), '을/를')} 나타낸다.`, facts: { tileOdd: rows.map((row) => row[1]) }
      });
    }),
    T('place-digit-forms', '여러 가지로 나타낸 수의 자리 숫자', '②19 ③20 심10', (d) => {
      // 0.01이 ■개인 수는 끝 숫자가, 0.001이 ■개인 수와 분모 1000인 분수는 가운데 숫자가 소수 둘째 자리 숫자이다.
      const t = d.int(1, 9), o = () => digit(d, [t]), right = d.int(0, 2), put = (at) => { const ds = [o(), o(), o()]; ds[at] = t; return toNum(ds); };
      const ns = [put(right === 0 ? 1 : d.pick([0, 2])), put(right === 1 ? 1 : d.pick([0, 2])), put(right === 2 ? 2 : 1)];
      const rows = [[frac(ns[0], 1000), right === 0], [`0.001이 ${ns[1]}개인 수`, right === 1], [`0.01이 ${ns[2]}개인 수`, right === 2]];
      return C(`나타내는 수의 소수 둘째 자리 숫자가 ${t}인 것은?`, rows.map((row) => row[0]), right, {
        explain: `소수로 나타내면 차례로 ${d3(ns[0])}, ${d3(ns[1])}, ${d2(ns[2])}이다. 소수 둘째 자리 숫자가 ${t}인 수는 ${[d3(ns[0]), d3(ns[1]), d2(ns[2])][right]}이다.`, facts: truthOf(rows, true)
      });
    }),
    T('place-digits-write', '자리 숫자를 말로 주고 소수 쓰기', '①30 심7', (d) => {
      const [a, x, e] = uniq(d, 3), zeroAt = d.int(1, 2), b = zeroAt === 1 ? 0 : x, c = zeroAt === 2 ? 0 : x;
      return D(`일의 자리 숫자가 ${a}, 소수 첫째 자리 숫자가 ${b}, 소수 둘째 자리 숫자가 ${c}, 소수 셋째 자리 숫자가 ${e}인 소수 세 자리 수는?`, (a * 1000 + b * 100 + c * 10 + e) / 1000, {
        explain: `일의 자리부터 차례로 숫자를 쓰고 일의 자리 뒤에 소수점을 찍는다. ${a}.${b}${c}${e}`, facts: { calc: [[`${a}+${b}/10+${c}/100+${e}/1000`, 0]], unseen: [10, 100, 1000] }
      });
    }),
    T('place-cond', '자리마다 조건을 준 소수', '①31 ②23 ③9·25 심13', (d) => {
      // 조건 하나가 자리 하나를 정한다(조건끼리 얽힌 것은 싣지 않는다).
      const w = d.int(1, 8), [c, e] = uniq(d, 2), b = d.pick([0, digit(d, [c, e])]), n = w * 1000 + b * 100 + c * 10 + e;
      return D('조건을 모두 만족하는 수는?', n / 1000, {
        figure: conditions(['소수 세 자리 수이다.', `${w}보다 크고 ${w + 1}보다 작다.`, `소수 첫째 자리 숫자는 ${b}이다.`, `소수 둘째 자리 숫자는 ${dj(d2(c), '을/를')} 나타낸다.`, `소수 셋째 자리 숫자는 ${e}이다.`]),
        explain: `${w}보다 크고 ${w + 1}보다 작으므로 일의 자리 숫자는 ${w}이다. ${dj(d2(c), '을/를')} 나타내는 소수 둘째 자리 숫자는 ${c}이다. 따라서 ${d3(n)}이다.`, facts: { calc: [[`${w}+${b}/10+${d2(c)}+${e}/1000`, 0]], unseen: [10, 1000] }
      });
    }),
    T('place-odd', '나타내는 수가 다른 하나', '①13 ②22 ③6·20 심12', (d) => {
      // 0.01이 452개인 수는 4.52이다: 가운데 0을 빼고 세면 틀린다.
      const [a, b, e] = uniq(d, 3), n = a * 1000 + b * 100 + e, short = a * 100 + b * 10 + e;
      const rows = d.shuffle([[d3(n), d3(n)], [`0.001이 ${n}개인 수`, `0.001*${n}`], [`1이 ${a}개, 0.1이 ${b}개, 0.001이 ${e}개인 수`, `1*${a}+0.1*${b}+0.001*${e}`], [`0.01이 ${short}개인 수`, `0.01*${short}`]]);
      return C('나타내는 수가 나머지와 다른 하나는?', LABELS, rows.findIndex((row) => row[1] === `0.01*${short}`), {
        figure: tagged(rows.map((row) => row[0])), explain: `0.01이 ${short}개인 수는 ${d2(short)}이다. 나머지는 모두 ${dj(d3(n), '을/를')} 나타낸다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
      });
    })
  ];

  // ── 소수 사이의 관계(10배, 1/10) ───────────────────────────────
  const RELATE = [
    T('relate-unit', '1, 0.1, 0.01, 0.001 사이의 관계', '②26', (d) => {
      const [x, op, k, ans] = d.pick([['0.001', '*', 100, 0.1], ['0.001', '*', 10, 0.01], ['0.01', '*', 10, 0.1], ['1', '/', 100, 0.01], ['1', '/', 1000, 0.001], ['0.1', '/', 10, 0.01], ['0.1', '/', 100, 0.001]]);
      return D(op === '*' ? `${x}의 ${k}배는?` : `${x}의 ${PARTS[k]}은?`, ans, { explain: op === '*' ? `${LEFT} ${x}의 ${k}배는 ${ans}이다.` : `${RIGHT} ${x}의 ${PARTS[k]}은 ${ans}이다.`, facts: { calc: [[`${x}${op}${k}`, 0]] } });
    }),
    T('relate-times', '소수의 10배와 100배', '①36 ②27 ③42 심16', (d) => {
      const n = d.until(() => d.int(1001, 9989), (v) => v % 10 !== 0), x = d3(n);
      return M(`${x}의 10배와 100배는?`, [{ label: '10배', answer: n / 100, decimal: true }, { label: '100배', answer: n / 10, decimal: true }], {
        explain: `${LEFT} ${x}의 10배는 ${d2(n)}, 100배는 ${d1(n)}이다.`, facts: { calc: [[`${x}*10`, 0], [`${x}*100`, 1]] }
      });
    }),
    T('relate-part-whole', '자연수의 1/10과 1/100', '①37 ②28 ③43 심16', (d) => {
      const n = d.until(() => d.int(102, 989), (v) => v % 10 !== 0);
      return M(`${n}의 ${TENTH}은 ㉠, ${HUNDREDTH}은 ㉡이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: n / 10, decimal: true }, { label: LABELS[1], answer: n / 100, decimal: true }], {
        explain: `${RIGHT} ${n}의 ${TENTH}은 ${d1(n)}, ${HUNDREDTH}은 ${d2(n)}이다.`, facts: { calc: [[`${n}/10`, 0], [`${n}/100`, 1]] }
      });
    }),
    T('relate-part-deci', '소수의 1/10과 1/100', '①37 ②28 ③43 심16', (d) => {
      const n = d.until(() => d.int(12, 98), (v) => v % 10 !== 0), x = d1(n);
      return M(`${x}의 ${TENTH}은 ㉠, ${HUNDREDTH}은 ㉡이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: n / 100, decimal: true }, { label: LABELS[1], answer: n / 1000, decimal: true }], {
        explain: `${RIGHT} 빈 자리에는 0을 쓴다. ${x}의 ${TENTH}은 ${d2(n)}, ${HUNDREDTH}은 ${d3(n)}이다.`, facts: { calc: [[`${x}/10`, 0], [`${x}/100`, 1]] }
      });
    }),
    T('relate-chain-up', '10배씩 커지는 사슬', '①38 ②29 ③40', (d) => {
      const n = d.until(() => d.int(1001, 9989), (v) => v % 10 !== 0), x = d3(n);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: n / 100, decimal: true }, { label: LABELS[1], answer: n / 10, decimal: true }], {
        figure: dchain([x, st('10배'), box(LABELS[0]), st('10배'), box(LABELS[1])]), explain: `${LEFT} ㉠은 ${d2(n)}, ㉡은 ${d1(n)}이다.`, facts: { calc: [[`${x}*10`, 0], [`${x}*10*10`, 1]] }
      });
    }),
    T('relate-chain-down', '1/10씩 작아지는 사슬', '①38 ②29 ③40', (d) => {
      const n = d.until(() => d.int(101, 989), (v) => v % 10 !== 0), x = d1(n);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: n / 100, decimal: true }, { label: LABELS[1], answer: n / 1000, decimal: true }], {
        figure: dchain([x, st(TENTH), box(LABELS[0]), st(TENTH), box(LABELS[1])]), explain: `${RIGHT} ㉠은 ${d2(n)}, ㉡은 ${d3(n)}이다.`, facts: { calc: [[`${x}/10`, 0], [`${x}/10/10`, 1]] }
      });
    }),
    T('relate-chain-back', '거꾸로 채우는 1/10 사슬', '③47 심26', (d) => {
      const v = d.until(() => d.int(12, 98), (x) => x % 10 !== 0 && Number(d2(x)) * 100 === x), end = d2(v);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: v }, { label: LABELS[1], answer: v / 10, decimal: true }], {
        figure: dchain([box(LABELS[0]), st(TENTH), box(LABELS[1]), st(TENTH), end]), explain: `${TENTH}을 구하기 전의 수는 10배 한 수이다. ㉡은 ${end}의 10배인 ${d1(v)}, ㉠은 ${d1(v)}의 10배인 ${v}이다.`,
        facts: { calc: [[`${end}*100`, 0], [`${end}*10`, 1]], unseen: [100] }
      });
    }),
    T('relate-ratio-times', '몇 배인지 구하기', '①39 ②30 ③44 심17', (d) => {
      const m = d.until(() => d.int(102, 9989), (v) => v % 10 !== 0), k = d.pick([10, 100, 1000]), small = d3(m), big = sx(m * k, 3);
      return N(`${dj(big, '은/는')} ${small}의 몇 배인가?`, k, { unit: '배', explain: `${small}에서 ${big}${tail(big, '으로/로')} 소수점을 기준으로 수가 왼쪽으로 ${String(k).length - 1}자리 옮겨 갔으므로 ${k}배이다.`, facts: { parts: [[`${m * k}/${m}`, 0]] } });
    }),
    T('relate-ratio-part', '얼마의 몇 분의 1인지 구하기', '①39 ②30 ③44 심17', (d) => {
      // 틀린 보기: 자리 수를 잘못 센 것, 거꾸로 몇 배라고 한 것
      const m = d.until(() => d.int(102, 9989), (v) => v % 10 !== 0), k = d.pick([10, 100, 1000]), small = d3(m), big = sx(m * k, 3);
      const rows = d.shuffle([[TENTH, k === 10], [HUNDREDTH, k === 100], [THOUSANDTH, k === 1000], [`${k}배`, false]]);
      return C(`${dj(small, '은/는')} ${big}의 얼마인가?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `${big}에서 ${small}${tail(small, '으로/로')} 소수점을 기준으로 수가 오른쪽으로 ${String(k).length - 1}자리 옮겨 갔으므로 ${PARTS[k]}이다.`, facts: truthOf(rows, true)
      });
    }),
    T('relate-ratio-odd', '□ 안의 수가 다른 하나', '②30 ③44 심17·18', (d) => {
      const [k1, k2] = d.shuffle([10, 100, 1000]).slice(0, 2), ks = d.shuffle([k1, k1, k2]);
      const ms = d.until(() => [d.int(2, 9) * 100, d.int(102, 989), d.int(2, 9)], (list) => list[1] % 10 !== 0), order = d.shuffle([0, 1, 2]);
      const rows = ks.map((k, i) => { const m = ms[order[i]]; return `${dj(sx(m * k, 3), '은/는')} ${sx(m, 3)}의 ${box()}배이다.`; });
      return C('□ 안에 알맞은 수가 나머지와 다른 하나는?', LABELS.slice(0, 3), ks.indexOf(k2), {
        figure: tagged(rows), explain: `□ 안에 알맞은 수는 차례로 ${ks.join(', ')}이다. 소수점을 기준으로 수가 왼쪽으로 몇 자리 옮겨 갔는지 센다.`, facts: { tileOdd: ks }
      });
    }),
    T('relate-same', '같은 수를 나타내는 것', '①40 ②31 ③45 심19', (d) => {
      // 바른 것 하나와, 자리를 한 번 덜 옮기거나 더 옮기면 같아 보이는 것 셋
      const T0 = d.until(() => d.int(11, 99), (v) => v % 10 !== 0) * 100, x = (n) => sx(n, 3), right = d.int(0, 3);
      const forms = [
        (ok) => { const base = ok ? T0 / 10 : T0 / 100; return [`${x(base)}의 10배`, `${x(base)}*10`]; },
        (ok) => { const base = ok ? T0 / 100 : T0 / 10; return [`${x(base)}의 100배`, `${x(base)}*100`]; },
        (ok) => { const base = ok ? T0 * 10 : T0 * 100; return [`${x(base)}의 ${TENTH}`, `${x(base)}/10`]; },
        (ok) => { const base = ok ? T0 * 100 : T0 * 10; return [`${x(base)}의 ${HUNDREDTH}`, `${x(base)}/100`]; }
      ];
      const rows = forms.map((form, i) => form(i === right));
      return C(`${dj(x(T0), '과/와')} 같은 수는?`, rows.map((row) => row[0]), right, {
        explain: `10배 하면 소수점을 기준으로 수가 왼쪽으로, ${TENTH}을 구하면 오른쪽으로 한 자리씩 옮겨 간다. ${rows[right][0]}${right < 2 ? '는' : '은'} ${x(T0)}이다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'nearest', target: T0 / 1000 } }
      });
    }),
    T('relate-odd', '나타내는 수가 다른 하나(10배와 1/10)', '①40 ②31 ③45 심19', (d) => {
      const T0 = d.until(() => d.int(11, 99), (v) => v % 10 !== 0) * 100, x = (n) => sx(n, 3), odd = d.int(0, 3);
      const forms = [
        (ok) => { const base = ok ? T0 / 10 : T0 / 100; return [`${x(base)}의 10배`, `${x(base)}*10`]; },
        (ok) => { const base = ok ? T0 / 100 : T0 / 10; return [`${x(base)}의 100배`, `${x(base)}*100`]; },
        (ok) => { const base = ok ? T0 * 10 : T0 * 100; return [`${x(base)}의 ${TENTH}`, `${x(base)}/10`]; },
        (ok) => { const base = ok ? T0 * 100 : T0 * 10; return [`${x(base)}의 ${HUNDREDTH}`, `${x(base)}/100`]; }
      ];
      const rows = forms.map((form, i) => form(i !== odd));
      return C('나타내는 수가 나머지와 다른 하나는?', LABELS, odd, {
        figure: tagged(rows.map((row) => row[0])), explain: `${LABELS[odd]}만 ${x(odd === 0 || odd === 3 ? T0 / 10 : T0 * 10)}이고 나머지는 모두 ${x(T0)}이다.`, facts: { choose: { exprs: rows.map((row) => row[1]), rule: 'odd' } }
      });
    }),
    T('relate-talk', '10배와 1/10에 대한 설명 가리기', '②31 ③45', (d) => {
      const a = d.int(2, 9), b = d.int(2, 9), c = d.until(() => d.int(12, 98), (v) => v % 10 !== 0), right = d.int(0, 3);
      const claims = [
        [`0.1의 ${HUNDREDTH}은 0.001이다.`, `0.1의 ${HUNDREDTH}은 0.01이다.`],
        [`0.0${a}의 10배는 0.${a}이다.`, `0.0${a}의 10배는 0.00${a}이다.`],
        [`${b}의 ${HUNDREDTH}은 0.0${b}이다.`, `${b}의 ${HUNDREDTH}은 0.${b}이다.`],
        [`${d1(c)}의 100배는 ${c}0이다.`, `${d1(c)}의 100배는 ${c}이다.`]
      ];
      const rows = d.shuffle(claims.map((pair, i) => [i === right ? pair[0] : pair[1], i === right]));
      return C('바르게 설명한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `${LEFT} ${RIGHT} 바른 설명은 「${rows.find((row) => row[1])[0]}」이다.`, facts: truthOf(rows, true)
      });
    }),
    T('relate-compare', '관계로 나타낸 두 수의 크기 비교', '②36 심20', (d) => {
      const [n, m] = d.until(() => { const v = d.int(1002, 9989); return [v, Math.round(v / 10) + d.int(-30, 30)]; }, ([v, w]) => v % 10 !== 0 && w % 10 !== 0 && w > 100 && w < 1000);
      return C('두 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, signOf(n, m * 10), {
        figure: versus(`${n}의 ${THOUSANDTH}`, `${d3(m)}의 10배`), explain: `${n}의 ${THOUSANDTH}은 ${d3(n)}, ${d3(m)}의 10배는 ${d2(m)}이다. ${d3(n)}${['>', '=', '<'][signOf(n, m * 10)].replace('>', ' &gt; ').replace('<', ' &lt; ')}${d2(m)}`,
        facts: { choose: { exprs: [`${n}/1000`, `${d3(m)}*10`], rule: 'compare' } }
      });
    }),
    T('relate-order', '관계로 나타낸 세 수의 크기 비교', '①41 ②36 심20', (d) => {
      const [p, q, r] = d.until(() => { const base = d.int(210, 960); return [base + d.int(-9, 9), base + d.int(-9, 9), base + d.int(-9, 9)]; }, (list) => new Set(list).size === 3 && list[0] % 10 !== 0 && list[2] % 10 !== 0);
      const rows = [`${d3(p)}의 10배`, `${q}의 ${HUNDREDTH}`, `${d1(r)}의 ${TENTH}`], pick = orderChoice(d, [p, q, r], LABELS, true);
      return C('나타내는 수가 큰 것부터 차례로 쓴 것은?', pick.options, pick.answer, {
        figure: tagged(rows), explain: `소수로 나타내면 ㉠ ${d2(p)}, ㉡ ${s2(q)}, ㉢ ${d2(r)}이다. 높은 자리부터 차례로 비교한다.`, facts: { choose: { exprs: [`${d3(p)}*10`, `${q}/100`, `${d1(r)}/10`], rule: 'descending', orders: pick.list } }
      });
    }),
    T('relate-back-part', '1/10, 1/100이 주어진 어떤 수', '①42 ②33', (d) => {
      const m = d.until(() => d.int(12, 989), (v) => v % 10 !== 0), k = d.pick([10, 100]), x = d3(m);
      return D(`어떤 수의 ${PARTS[k]}이 ${x}이다. 어떤 수는?`, (m * k) / 1000, { explain: `어떤 수는 ${x}의 ${k}배이다. ${x}의 ${k}배는 ${sx(m * k, 3)}이다.`, facts: { calc: [[`${x}*${k}`, 0]] } });
    }),
    T('relate-back-times', '10배, 100배가 주어진 어떤 수', '③47', (d) => {
      const m = d.until(() => d.int(102, 9989), (v) => v % 10 !== 0), k = d.pick([10, 100]), x = d1(m);
      return D(`어떤 수의 ${k}배가 ${x}이다. 어떤 수는?`, m / (10 * k), { explain: `어떤 수는 ${x}의 ${PARTS[k]}이다. ${x}의 ${PARTS[k]}은 ${fx(m, k === 10 ? 2 : 3)}이다.`, facts: { calc: [[`${x}/${k}`, 0]] } });
    }),
    T('relate-digits', '같은 숫자 둘이 나타내는 수는 몇 배', '①44 ②32 ③46 심23', (d) => {
      const t = d.int(1, 9), [p, q] = d.pick([[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]), ds = [0, 1, 2, 3].map((i) => (i === p || i === q ? t : digit(d, [t]))), x = `${ds[0]}.${ds[1]}${ds[2]}${ds[3]}`, k = P10[q - p];
      return N(`${x}에서 ${PLACES[p]} 숫자 ${josa(t, '이/가')} 나타내는 수는 ${PLACES[q]} 숫자 ${josa(t, '이/가')} 나타내는 수의 몇 배인가?`, k, {
        unit: '배', explain: `${PLACES[p]} 숫자 ${josa(t, '은/는')} ${dj(sx(t * P10[3 - p], 3), '을/를')}, ${PLACES[q]} 숫자 ${josa(t, '은/는')} ${dj(sx(t * P10[3 - q], 3), '을/를')} 나타낸다. 자리가 ${q - p}칸 차이 나므로 ${k}배이다.`,
        facts: { parts: [[`(${t}*${P10[3 - p]})/(${t}*${P10[3 - q]})`, 0]] }
      });
    }),
    T('relate-described', '설명하는 수의 10배와 1/10', '①46 ②35 ③43 심21', (d) => {
      const [a, b, c] = [d.int(1, 9), d.int(1, 9), d.int(1, 9)], n = a * 100 + b * 10 + c, up = d.bool();
      return D(`1이 ${a}개, 0.1이 ${b}개, 0.01이 ${c}개인 수의 ${up ? '10배는' : TENTH + '은'}?`, up ? n / 10 : n / 1000, {
        explain: `1이 ${a}개, 0.1이 ${b}개, 0.01이 ${c}개인 수는 ${d2(n)}이다. ${d2(n)}의 ${up ? '10배는 ' + d1(n) : TENTH + '은 ' + d3(n)}이다.`, facts: { calc: [[`(1*${a}+0.1*${b}+0.01*${c})${up ? '*' : '/'}10`, 0]] }
      });
    }),
    T('relate-digit-after', '1/100인 수에서 숫자가 나타내는 수', '①47 ③20·43 심22', (d) => {
      const [a, b, c] = uniq(d, 3), n = a * 100 + b * 10 + c, last = d.bool(), t = last ? c : b;
      return D(`${n}의 ${HUNDREDTH}인 수에서 숫자 ${josa(t, '이/가')} 나타내는 수는?`, last ? t / 100 : t / 10, {
        explain: `${n}의 ${HUNDREDTH}은 ${d2(n)}이다. ${d2(n)}에서 ${josa(t, '은/는')} ${last ? '소수 둘째' : '소수 첫째'} 자리 숫자이므로 ${dj(fx(t, last ? 2 : 1), '을/를')} 나타낸다.`,
        facts: { calc: [[`${t}/${last ? 100 : 10}`, 0]], unseen: [10] }
      });
    }),
    T('relate-word-ten', '문장제: 10개의 양', '①48 ②37 ③48 심28', (d) => {
      const m = d.until(() => d.int(105, 989), (v) => v % 10 !== 0);
      return D(`구슬 한 개의 무게는 ${d2(m)} g이다. 똑같은 구슬 10개의 무게는 몇 g인가?`, m / 10, { unit: 'g', explain: `10개의 무게는 한 개의 무게의 10배이다. ${d2(m)}의 10배는 ${d1(m)}이다.`, facts: { calc: [[`${d2(m)}*10`, 0]] } });
    }),
    T('relate-word-boxes', '문장제: 10개씩 10상자의 양', '②37 ③48 심28', (d) => {
      const m = d.until(() => d.int(12, 98), (v) => v % 10 !== 0 && Number(d2(v)) * 10 * 10 === v);
      return N(`주스가 한 병에 ${d2(m)} L씩 들어 있다. 한 상자에 10병씩 담은 상자가 10상자 있을 때, 주스는 모두 몇 L인가?`, m, {
        unit: 'L', explain: `한 상자의 주스는 ${d2(m)}의 10배인 ${d1(m)} L이다. 10상자의 주스는 ${d1(m)}의 10배인 ${m} L이다.`, facts: { calc: [[`${d2(m)}*10*10`, 0]] }
      });
    }),
    T('relate-word-part', '문장제: 1/10로 줄인 길이', '①49 ③48', (d) => {
      const m = d.until(() => d.int(205, 989), (v) => v % 10 !== 0);
      return D(`높이가 ${d2(m)} m인 탑이 있다. 높이가 이 탑의 ${TENTH}인 모형을 만들 때, 모형의 높이는 몇 m인가?`, m / 1000, { unit: 'm', explain: `${RIGHT} ${d2(m)}의 ${TENTH}은 ${d3(m)}이다.`, facts: { calc: [[`${d2(m)}/10`, 0]] } });
    }),
    T('relate-word-one', '문장제: 10개의 양으로 한 개의 양', '심29', (d) => {
      const m = d.until(() => d.int(123, 489), (v) => v % 10 !== 0);
      return D(`똑같은 블록 10개를 쌓은 높이가 ${d1(m)} cm이다. 블록 한 개의 높이는 몇 cm인가?`, m / 100, { unit: 'cm', explain: `블록 한 개의 높이는 10개를 쌓은 높이의 ${TENTH}이다. ${d1(m)}의 ${TENTH}은 ${d2(m)}이다.`, facts: { calc: [[`${d1(m)}/10`, 0]] } });
    })
  ];

  // ── 단위를 소수로 나타내기 ─────────────────────────────────────
  const UNITS3 = [['m', 'km'], ['g', 'kg'], ['mL', 'L']];
  const UNIT = [
    T('unit-cm', 'cm를 m로 나타내기', '①50 ②1·10 ③49 심41', (d) => {
      const n = d.until(() => (d.bool() ? d.int(12, 98) : d.int(102, 989)), (v) => v % 10 !== 0);
      return D(`${n} cm는 몇 m인가?`, n / 100, { unit: 'm', explain: `1 cm는 0.01 m이다. ${n} cm는 0.01 m가 ${n}개이므로 ${d2(n)} m이다.`, facts: { calc: [[`${n}/100`, 0]], unseen: [100] } });
    }),
    T('unit-m-cm', '몇 m 몇 cm를 m로 나타내기', '①50 ②10 ③49', (d) => {
      const m = d.int(1, 9), c = d.until(() => d.int(12, 98), (v) => v % 10 !== 0);
      return D(`${m} m ${c} cm는 몇 m인가?`, (m * 100 + c) / 100, { unit: 'm', explain: `${c} cm는 ${d2(c)} m이다. ${m} m ${c} cm는 ${d2(m * 100 + c)} m이다.`, facts: { calc: [[`${m}+${c}/100`, 0]], unseen: [100] } });
    }),
    T('unit-thousand', 'm, g, mL를 km, kg, L로 나타내기', '①51 ②11 ③50 심41', (d) => {
      const [small, big] = d.pick(UNITS3), n = d.until(() => (d.bool() ? d.int(105, 989) : d.int(1005, 9989)), (v) => v % 10 !== 0);
      return D(`${n} ${uj(small, '은/는')} 몇 ${big}인가?`, n / 1000, { unit: big, explain: `1 ${uj(small, '은/는')} 0.001 ${big}이다. ${n} ${uj(small, '은/는')} ${d3(n)} ${big}이다.`, facts: { calc: [[`${n}/1000`, 0]], unseen: [1000] } });
    }),
    T('unit-compound', '큰 단위와 작은 단위로 적은 양을 소수로 나타내기', '②11 ③50 심41', (d) => {
      // 작은 단위의 수가 두 자리이면 소수 첫째 자리에 0을 쓴다(3 km 45 m = 3.045 km).
      const [small, big] = d.pick(UNITS3), a = d.int(1, 9), b = d.until(() => (d.bool() ? d.int(12, 98) : d.int(105, 989)), (v) => v % 10 !== 0);
      return D(`${a} ${big} ${b} ${uj(small, '은/는')} 몇 ${big}인가?`, (a * 1000 + b) / 1000, { unit: big, explain: `${b} ${uj(small, '은/는')} ${d3(b)} ${big}이다. ${a} ${big} ${b} ${uj(small, '은/는')} ${d3(a * 1000 + b)} ${big}이다.`, facts: { calc: [[`${a}+${b}/1000`, 0]], unseen: [1000] } });
    }),
    T('unit-wrong', '단위를 잘못 바꾼 것', '③50 심41', (d) => {
      // 35 m = 0.35 km, 2 m 5 cm = 2.5 m: 빈 자리에 0을 쓰지 않았다.
      const a = d.until(() => d.int(12, 98), (v) => v % 10 !== 0), b = d.until(() => d.int(105, 989), (v) => v % 10 !== 0), w = d.int(1, 9), c = d.until(() => d.int(105, 989), (v) => v % 10 !== 0), m = d.int(1, 9), k = d.int(2, 9), bad = d.int(0, 1);
      const rows = d.shuffle([
        [`${a} m = ${bad === 0 ? d2(a) : d3(a)} km`, `${a}/1000`, bad === 0 ? a / 100 : a / 1000],
        [`${m} m ${k} cm = ${bad === 1 ? d1(m * 10 + k) : d2(m * 100 + k)} m`, `${m * 100 + k}/100`, bad === 1 ? (m * 10 + k) / 10 : (m * 100 + k) / 100],
        [`${b} g = ${d3(b)} kg`, `${b}/1000`, b / 1000],
        [`${w} L ${c} mL = ${d3(w * 1000 + c)} L`, `${w * 1000 + c}/1000`, (w * 1000 + c) / 1000]
      ]);
      const wrong = rows.findIndex((row) => row[0].includes(bad === 0 ? ' km' : ' cm'));
      return C('단위를 바꾸어 나타낸 것 가운데 잘못된 것은?', rows.map((row) => row[0]), wrong, {
        explain: bad === 0 ? `1 m는 0.001 km이다. ${a} m = ${d3(a)} km` : `1 cm는 0.01 m이다. ${m} m ${k} cm = ${d2(m * 100 + k)} m`, facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: false }
      });
    }),
    T('unit-beaker', '눈금을 읽어 L 단위의 소수로 나타내기', '②11 심42', (d) => {
      const k = d.pick([5, 6, 7, 9, 10, 11, 13, 14, 15, 17, 18, 19]), level = 25 * k;
      return D('비커에 담긴 물의 양은 몇 L인지 소수로 나타내면?', level / 1000, {
        unit: 'L', figure: beaker(500, 25, 100, level), explain: `작은 눈금 한 칸은 25 mL이므로 물의 양은 ${level} mL이다. 1 mL는 0.001 L이므로 ${level} mL는 ${sx(level, 3)} L이다.`, facts: { calc: [[`25*${k}/1000`, 0]], unseen: [1000] }
      });
    })
  ];

  // ── 소수의 크기 비교 ───────────────────────────────────────────
  // 가까운 두 소수: 앞 수는 소수 ka 자리, 뒤 수는 소수 kb 자리까지 적는다. [앞 글, 뒤 글, 앞 값, 뒤 값](값은 1000배 한 정수)
  function closePair(d, ka, kb) {
    const [p, v, w, step] = d.until(() => {
      const p = d.int(P10[ka] / 10 + 1, P10[ka] * 10 - 1), v = p * P10[3 - ka], step = P10[3 - kb];
      // 뒤 수의 자릿수가 더 적으면 앞 수에 가까운 그 자릿수의 수에서 조금 옮긴다.
      return [p, v, (kb < ka ? Math.round(v / step) * step : v) + d.pick([-1, 1]) * d.int(kb === ka ? 1 : 0, kb === ka ? 30 : 12) * step, step];
    }, ([p, v, w, step]) => p % 10 !== 0 && w > 0 && w !== v && (w / step) % 10 !== 0 && Math.floor(v / 1000) === Math.floor(w / 1000));
    return [fx(p, ka), fx(w / step, kb), v, w];
  }
  const twoType = (id, title, ref, rule, kinds, why) => T(id, title, ref, (d) => {
    const [ka, kb] = d.pick(kinds), flip = d.bool(), pair = closePair(d, ka, kb), [a, b, x, y] = flip ? [pair[1], pair[0], pair[3], pair[2]] : pair;
    return C('두 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, signOf(x, y), { figure: versus(a, b), explain: why, facts: { choose: { exprs: [a, b], rule: 'compare' }, rule } });
  });
  // 자연수 부분이 w 이고 소수 k 자리까지 적는 수(끝자리는 0이 아니다). [글, 값(1000배)]
  const sized = (d, w, k) => { const f = d.until(() => d.int(1, P10[k] - 1), (v) => v % 10 !== 0), n = w * P10[k] + f; return [fx(n, k), n * P10[3 - k]]; };
  const mixedList = (d, w, kinds) => d.until(() => kinds.map((k) => sized(d, w, k)), (list) => new Set(list.map((row) => row[1])).size === list.length);
  const COMPARE = [
    T('compare-grids', '색칠한 모눈으로 크기 비교', '①52 ②39 ③32', (d) => {
      const [a, b] = d.until(() => { const x = d.int(2, 9), y = d.int(1, 9); return d.shuffle(d.bool() ? [x * 10 + y, y * 10 + x] : [x * 10, (x - 1) * 10 + y]); }, ([p, q]) => p !== q && p % 10 + q % 10 > 0 && p < 100 && q < 100 && p >= 10 && q >= 10);
      return C('전체 크기가 1인 모눈종이 ㉠, ㉡에 색칠한 부분의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, signOf(a, b), {
        figure: G.tiles([[LABELS[0], grid100(a)], [LABELS[1], grid100(b)]]) + versus(LABELS[0], LABELS[1]), explain: `㉠은 ${a}칸이므로 ${s2(a)}, ㉡은 ${b}칸이므로 ${s2(b)}이다. 색칠한 칸이 많은 쪽이 더 크다.`,
        facts: { choose: { exprs: [`${a}/100`, `${b}/100`], rule: 'compare' } }
      });
    }),
    T('compare-count', '0.01의 개수로 크기 비교', '②40 ③32·33', (d) => {
      const [p, q] = d.until(() => { const w = d.int(1, 9); return [w * 100 + d.int(11, 99), w * 100 + d.int(1, 9) * 10]; }, ([x, y]) => x % 10 !== 0 && Number(d2(x)) * 100 === x && Number(s2(y)) * 100 === y);
      return M(`${dj(d2(p), '은/는')} 0.01이 ㉠개, ${dj(s2(q), '은/는')} 0.01이 ㉡개인 수이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: p }, { label: LABELS[1], answer: q }], {
        explain: `${dj(s2(q), '은/는')} ${d2(q)}과 같으므로 0.01이 ${q}개인 수이다. ${p}개와 ${q}개를 비교하면 ${p > q ? d2(p) : s2(q)}${tail(p > q ? d2(p) : s2(q), '이/가')} 더 크다.`,
        facts: { calc: [[`${d2(p)}*100`, 0], [`${s2(q)}*100`, 1]], unseen: [100] }
      });
    }),
    twoType('compare-two-2', '소수 두 자리 수끼리의 크기 비교', '①54 ②41 ③27 심31', 'two', [[2, 2]], '자연수 부분이 같으면 소수 첫째 자리 숫자를 비교하고, 그것도 같으면 소수 둘째 자리 숫자를 비교한다.'),
    twoType('compare-two-3', '소수 세 자리 수끼리의 크기 비교', '①55 ②41 ③27 심31', 'three', [[3, 3]], '높은 자리부터 차례로 비교한다. 소수 둘째 자리까지 같으면 소수 셋째 자리 숫자가 큰 수가 더 크다.'),
    twoType('compare-two-mixed', '자릿수가 다른 두 소수의 크기 비교', '①56 ②42 ③28 심31', 'mixed', [[2, 3], [1, 2], [1, 3]], '자릿수가 많다고 더 큰 수는 아니다. 높은 자리부터 같은 자리 숫자끼리 차례로 비교한다.'),
    T('compare-wrong', '크기 비교가 잘못된 것', '②41 심32', (d) => {
      const pairs = d.until(() => [closePair(d, 2, 2), closePair(d, 1, 2), closePair(d, 2, 3), closePair(d, 3, 3)], (list) => new Set(list.map((p) => p[0])).size === 4), bad = d.int(0, 3);
      const rows = d.shuffle(pairs.map(([a, b, x, y], i) => { const more = (x > y) !== (i === bad); return { text: `${a} ${more ? '&gt;' : '&lt;'} ${b}`, claim: more ? [a, b] : [b, a], ok: i !== bad, fix: `${a} ${x > y ? '&gt;' : '&lt;'} ${b}` }; }));
      return C('두 수의 크기를 잘못 비교한 것은?', rows.map((row) => row.text), rows.findIndex((row) => !row.ok), {
        explain: `높은 자리부터 같은 자리 숫자끼리 차례로 비교한다. 바르게 비교하면 ${rows.find((row) => !row.ok).fix}이다.`, facts: { biggerClaims: rows.map((row, i) => [row.claim[0], row.claim[1], i]), truth: rows.map((row) => row.ok), want: false }
      });
    }),
    T('compare-max', '가장 큰 수와 가장 작은 수', '①57 ②44 ③34 심33', (d) => {
      const w = d.int(1, 9), big = d.bool(), list = mixedList(d, w, d.shuffle([2, 3, 2, 3, 1]).slice(0, 4)), best = big ? Math.max(...list.map((row) => row[1])) : Math.min(...list.map((row) => row[1]));
      return C(`가장 ${big ? '큰' : '작은'} 수는?`, list.map((row) => row[0]), list.findIndex((row) => row[1] === best), {
        explain: `자연수 부분이 모두 ${w}이므로 소수 첫째 자리 숫자부터 차례로 비교한다. 가장 ${big ? '큰' : '작은'} 수는 ${list.find((row) => row[1] === best)[0]}이다.`, facts: { choose: { exprs: list.map((row) => row[0]), rule: big ? 'max' : 'min' } }
      });
    }),
    T('compare-order', '세 소수를 큰 수부터 차례로', '①58 ②45 ③34 심33', (d) => {
      const w = d.int(1, 9), list = mixedList(d, w, d.shuffle([1, 2, 3])), pick = orderChoice(d, list.map((row) => row[1]), LABELS, true);
      return C('큰 수부터 차례로 쓴 것은?', pick.options, pick.answer, {
        figure: tagged(list.map((row) => row[0])), explain: `자연수 부분이 모두 ${w}이므로 소수 첫째 자리 숫자부터 차례로 비교한다. 큰 수부터 쓰면 ${list.slice().sort((p, q) => q[1] - p[1]).map((row) => row[0]).join(', ')}이다.`,
        facts: { choose: { exprs: list.map((row) => row[0]), rule: 'descending', orders: pick.list } }
      });
    }),
    T('compare-rank', '세 번째로 큰 수', '심33', (d) => {
      const list = d.until(() => d.shuffle([sized(d, 0, 3), sized(d, 1, 3), sized(d, 0, 3), sized(d, 0, 1), sized(d, 1, 2)]), (rows) => new Set(rows.map((row) => row[1])).size === 5), sorted = list.slice().sort((p, q) => q[1] - p[1]);
      return C('세 번째로 큰 수는?', list.map((row) => row[0]), list.indexOf(sorted[2]), {
        explain: `큰 수부터 차례로 쓰면 ${sorted.map((row) => row[0]).join(', ')}이다. 세 번째로 큰 수는 ${sorted[2][0]}이다.`, facts: { rank: { values: list.map((row) => row[1]), nth: 3 } }
      });
    }),
    T('compare-than', '기준보다 큰 수', '②43', (d) => {
      // 0.7보다 큰 수: 0.079나 0.67은 숫자가 많거나 커 보여도 0.7보다 작다.
      const w = d.int(0, 5), t = d.int(3, 9), v = w * 1000 + t * 100, base = `${w}.${t}`;
      const list = d.shuffle([d3(v + d.int(1, 9)), d2(v / 10 - d.int(2, 8)), d3(w * 1000 + t * 10 + d.int(1, 9)), d2(w * 100 + (t - d.int(1, 2)) * 10 + 9)]);
      return C(`${base}보다 큰 수는?`, list, list.findIndex((x) => Number(x) > Number(base)), {
        explain: `${dj(base, '은/는')} ${base}00과 같다. 높은 자리부터 차례로 비교하면 ${base}보다 큰 수는 ${list.find((x) => Number(x) > Number(base))}이다.`, facts: { choose: { exprs: list, rule: 'onlyAbove', target: Number(base) } }
      });
    }),
    T('compare-counts', '개수로 나타낸 두 수의 크기 비교', '①59 ②46', (d) => {
      const p = d.until(() => d.int(12, 989), (v) => v % 10 !== 0), q = p * 10 + d.pick([-1, 1]) * d.int(1, 9), big = d.bool(), flip = d.bool();
      const rows = [[`0.01이 ${p}개인 수`, `0.01*${p}`, p * 10, d2(p)], [`0.001이 ${q}개인 수`, `0.001*${q}`, q, d3(q)]], list = flip ? [rows[1], rows[0]] : rows, best = big ? Math.max(p * 10, q) : Math.min(p * 10, q);
      return C(`더 ${big ? '큰' : '작은'} 수는?`, list.map((row) => row[0]), list.findIndex((row) => row[2] === best), {
        explain: `0.01이 ${p}개인 수는 ${d2(p)}, 0.001이 ${q}개인 수는 ${d3(q)}이다. 더 ${big ? '큰' : '작은'} 수는 ${list.find((row) => row[2] === best)[3]}이다.`, facts: { choose: { exprs: list.map((row) => row[1]), rule: big ? 'max' : 'min' } }
      });
    }),
    T('compare-words', '읽은 말로 적은 수와 크기 비교', '③36', (d) => {
      const [a, b, x, y] = closePair(d, 3, 3), flip = d.bool();
      return C('두 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, flip ? signOf(y, x) : signOf(x, y), {
        figure: flip ? versus(b, read(a)) : versus(read(a), b), explain: `「${read(a)}」${josa(read(a), "을/를").slice(read(a).length)} 수로 쓰면 ${a}이다. ${a}${tail(a, '과/와')} ${dj(b, '을/를')} 높은 자리부터 차례로 비교한다.`,
        facts: { choose: { exprs: flip ? [b, a] : [a, b], rule: 'compare' }, unseen: [Number(a)], rule: 'words' }
      });
    }),
    T('compare-box', '□ 안에 들어갈 수 있는 숫자의 개수', '①60 ②49 ③35 심38', (d) => {
      // 6.269 < 6.2□9: □가 6일 때는 끝자리까지 비교해야 한다.
      const { w, a, b, c, e, less, fits } = d.until(() => {
        const w = d.int(0, 9), a = d.int(0, 9), b = d.int(2, 7), c = d.int(1, 9), e = d.int(1, 9), less = d.bool(), fits = [];
        for (let x = 0; x <= 9; x += 1) { const left = b * 10 + c, right = x * 10 + e; if (less ? left < right : left > right) fits.push(x); }
        return { w, a, b, c, e, less, fits };
      }, (r) => r.fits.length >= 2 && r.c !== r.e);
      const left = `${w}.${a}${b}${c}`, sign = less ? '&lt;' : '&gt;';
      return N('0부터 9까지의 숫자 가운데 □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', fits.length, {
        unit: '개', figure: quote(`<span class="mb-expr">${left} <i>${sign}</i> ${w}.${a}${box()}${e}</span>`),
        explain: `소수 첫째 자리까지 같으므로 소수 둘째 자리 숫자를 비교한다. □가 ${b}이면 소수 셋째 자리 숫자 ${josa(c, '과/와')} ${josa(e, '을/를')} 비교해야 한다. 들어갈 수 있는 숫자는 ${fits.join(', ')}이다.`,
        facts: { digit: { template: `${left}${less ? '<' : '>'}${w}.${a}□${e}`, lo: 0, hi: 9, ask: 'count' } }
      });
    }),
    T('compare-box-between', '두 수 사이에 있게 하는 □ 안의 숫자', '③35', (d) => {
      // 7.145 < 7.14□ < 7.15: 7.15는 7.150과 같다.
      const w = d.int(0, 9), a = d.int(0, 9), b = d.int(1, 8), lo = d.int(1, 6), low = `${w}.${a}${b}${lo}`, high = `${w}.${a}${b + 1}`, fits = []; for (let x = lo + 1; x <= 9; x += 1) fits.push(x);
      return N('0부터 9까지의 숫자 가운데 □ 안에 들어갈 수 있는 숫자는 모두 몇 개인가?', fits.length, {
        unit: '개', figure: quote(`<span class="mb-expr">${low} <i>&lt;</i> ${w}.${a}${b}${box()} <i>&lt;</i> ${high}</span>`),
        explain: `${dj(high, '은/는')} ${high}0과 같으므로 □ 안에는 ${lo}보다 큰 숫자가 모두 들어갈 수 있다. ${fits.join(', ')}이다.`,
        facts: { digit: { template: `${low}<${w}.${a}${b}□<${high}`, lo: 0, hi: 9, ask: 'count' }, rule: 'between' }
      });
    }),
    T('compare-between', '두 수 사이에 있는 소수', '①61', (d) => {
      const w = d.int(1, 5), lo = w * 100 + d.until(() => d.int(11, 59), (v) => v % 10 !== 0), hi = lo + d.until(() => d.int(15, 38), (v) => (lo + v) % 10 !== 0), low = d2(lo), high = d2(hi);
      const list = d.shuffle([d1(Math.floor(lo / 10) + 1), d3(lo * 10 - d.int(1, 9)), d3(hi * 10 + d.int(1, 9)), d1(Math.floor(hi / 10) + 1)]);
      return C(`${low}보다 크고 ${high}보다 작은 수는?`, list, list.findIndex((x) => Number(x) > Number(low) && Number(x) < Number(high)), {
        explain: `높은 자리부터 차례로 비교한다. ${low}보다 크고 ${high}보다 작은 수는 ${list.find((x) => Number(x) > Number(low) && Number(x) < Number(high))}이다.`, facts: { between: { low, high, exprs: list } }
      });
    }),
    T('compare-word-two', '문장제: 두 양의 크기 비교', '①63 ②47 ③37 심35·36', (d) => {
      const [a, b] = closePair(d, 3, 2), kind = d.int(0, 1);
      const text = kind === 0 ? `집에서 도서관까지의 거리는 ${a} km, 집에서 학교까지의 거리는 ${b} km이다. 집에서 더 가까운 곳은?` : `딸기는 ${a} kg, 방울토마토는 ${b} kg 있다. 더 무거운 것은?`;
      const names = kind === 0 ? ['도서관', '학교'] : ['딸기', '방울토마토'], first = kind === 0 ? Number(a) < Number(b) : Number(a) > Number(b);
      return C(text, names, first ? 0 : 1, { explain: `${a}${tail(a, '과/와')} ${dj(b, '을/를')} 높은 자리부터 차례로 비교하면 ${Number(a) > Number(b) ? a : b}${tail(Number(a) > Number(b) ? a : b, '이/가')} 더 크다.`, facts: { choose: { exprs: [a, b], rule: kind === 0 ? 'min' : 'max' } } });
    }),
    T('compare-word-order', '문장제: 세 양을 차례로 늘어놓기', '①64 ②47 심35', (d) => {
      const places = d.shuffle(['도서관', '공원', '학교', '우체국', '병원']).slice(0, 3), list = mixedList(d, 0, d.shuffle([2, 3, 2])), pick = orderChoice(d, list.map((row) => row[1]), places, false);
      return C('집에서 세 곳까지의 거리를 나타낸 표이다. 집에서 가까운 곳부터 차례로 쓴 것은?', pick.options, pick.answer, {
        figure: table(['곳', '거리'], places.map((place, i) => [place, `${list[i][0]} km`])), explain: `작은 수부터 차례로 쓰면 ${list.slice().sort((p, q) => p[1] - q[1]).map((row) => row[0]).join(', ')}이다.`,
        facts: { choose: { exprs: list.map((row) => row[0]), rule: 'ascending', orders: pick.list } }
      });
    }),
    T('compare-word-race', '문장제: 기록이 가장 빠른 사람', '①129 ③37 심37', (d) => {
      // 걸린 시간은 수가 작을수록 빠르다. 자릿수가 다른 기록이 섞여 있다.
      const who = d.shuffle(NAMES).slice(0, 4), w = d.int(15, 19), list = d.until(() => [sized(d, w, 2), sized(d, w, 1), sized(d, w, 2), sized(d, w, 2)], (rows) => new Set(rows.map((row) => row[1])).size === 4);
      const order = d.shuffle([0, 1, 2, 3]), rows = order.map((i) => list[i]), best = Math.min(...rows.map((row) => row[1]));
      return C('100 m 달리기 기록을 나타낸 표이다. 가장 빨리 달린 사람은?', who, rows.findIndex((row) => row[1] === best), {
        figure: table(['이름', '기록'], who.map((n, i) => [n, `${rows[i][0]}초`])), explain: `걸린 시간이 짧을수록 빨리 달린 것이다. 가장 작은 수는 ${rows.find((row) => row[1] === best)[0]}이다.`, facts: { choose: { exprs: rows.map((row) => row[0]), rule: 'min' } }
      });
    }),
    T('compare-units', '단위가 섞인 양의 크기 비교', '①65 ②48 ③51 심43', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3), [a, b, c] = d.until(() => { const base = d.int(128, 152); return [base + d.int(-6, 6), base + d.int(-6, 6), Math.round(base / 10) * 10 + d.pick([0, 10])]; }, (list) => new Set(list).size === 3 && list[0] % 10 !== 0 && list[1] % 10 !== 0);
      const vals = [a, b, c], best = Math.max(...vals);
      return C(`${who[0]}의 키는 ${d2(a)} m, ${who[1]}의 키는 ${b} cm, ${who[2]}의 키는 ${s2(c)} m이다. 키가 가장 큰 사람은?`, who, vals.indexOf(best), {
        explain: `${b} cm는 ${d2(b)} m이다. ${d2(a)}, ${d2(b)}, ${s2(c)} 가운데 가장 큰 수는 ${s2(best)}이다.`, facts: { choose: { exprs: [d2(a), `${b}/100`, s2(c)], rule: 'max' }, unseen: [100] }
      });
    }),
    T('compare-cards-max', '수 카드로 가장 큰 소수 만들기', '①66 ②51 ③39 심75', (d) => {
      const list = uniq(d, 4), s = list.slice().sort((p, q) => q - p);
      return D('수 카드 4장과 소수점 카드를 한 번씩 모두 사용하여 소수 세 자리 수를 만들려고 한다. 만들 수 있는 가장 큰 수는?', toNum(s) / 1000, {
        figure: cards(list.concat(['.'])), explain: `높은 자리부터 큰 숫자를 차례로 놓는다. ${s[0]}.${s[1]}${s[2]}${s[3]}`, facts: { calc: [[`${s[0]}+${s[1]}/10+${s[2]}/100+${s[3]}/1000`, 0]], unseen: [10, 100, 1000] }
      });
    }),
    T('compare-cards-min', '수 카드로 가장 작은 소수 만들기', '③39 심75·78', (d) => {
      const s = uniq(d, 3).sort((p, q) => p - q), list = d.shuffle([0].concat(s));
      return D('수 카드 4장과 소수점 카드를 한 번씩 모두 사용하여 소수 세 자리 수를 만들려고 한다. 만들 수 있는 가장 작은 수는?', toNum(s) / 1000, {
        figure: cards(list.concat(['.'])), explain: `소수는 일의 자리에 0을 놓을 수 있다. 높은 자리부터 작은 숫자를 차례로 놓으면 0.${s[0]}${s[1]}${s[2]}이다.`, facts: { calc: [[`0+${s[0]}/10+${s[1]}/100+${s[2]}/1000`, 0]], unseen: [10, 100, 1000] }
      });
    }),
    T('compare-cards-zero', '수 카드로 1보다 작은 소수 만들기', '②51 심79', (d) => {
      const [lo, hi] = uniq(d, 2).sort((p, q) => p - q), list = d.shuffle([0, lo, hi]);
      return D('수 카드 3장과 소수점 카드를 한 번씩 모두 사용하여 1보다 작은 소수 두 자리 수를 만들려고 한다. 만들 수 있는 가장 큰 수는?', (hi * 10 + lo) / 100, {
        figure: cards(list.concat(['.'])), explain: `1보다 작으려면 일의 자리에 0을 놓아야 한다. 소수 첫째 자리에 큰 숫자를 놓으면 0.${hi}${lo}이다.`, facts: { calc: [[`0+${hi}/10+${lo}/100`, 0]], unseen: [10, 100] }
      });
    }),
    T('compare-same', '크기가 같은 소수', '①34 ②24 ③29 심12', (d) => {
      // 틀린 보기: 가운데에 0을 넣은 것(6.02), 소수점을 옮긴 것(0.62), 0 뒤에 숫자가 더 있는 것(6.203)
      const w = d.int(1, 9), a = d.int(1, 9), b = d.int(1, 9), x = `${w}.${a}`, list = d.shuffle([`${w}.0${a}`, `0.${w}${a}`, `${x}0`, `${x}0${b}`]);
      return C(`${dj(x, '과/와')} 크기가 같은 수는?`, list, list.indexOf(`${x}0`), { explain: `소수점 아래 끝자리에 있는 0은 생략할 수 있다. ${x}0 = ${x}`, facts: { choose: { exprs: list, rule: 'equals', target: Number(x) } } });
    }),
    T('compare-same-odd', '크기가 다른 하나', '①34 ③29 심12', (d) => {
      const w = d.int(1, 9), a = d.int(1, 9), x = `${w}.${a}`, list = d.shuffle([x, `${x}0`, `${x}00`, `${w}.0${a}`]);
      return C('크기가 나머지와 다른 하나는?', list, list.indexOf(`${w}.0${a}`), { explain: `소수점 아래 끝자리에 있는 0은 생략할 수 있으므로 ${x}, ${x}0, ${x}00은 크기가 같다. ${w}.0${a}의 0은 끝자리가 아니므로 생략할 수 없다.`, facts: { choose: { exprs: list, rule: 'odd' } } });
    }),
    T('compare-zero-drop', '생략할 수 있는 0이 있는 소수', '①33 ②24 ③30 심11', (d) => {
      const [a, b, c] = uniq(d, 3), keep = d.pick([`${a}${b}.${c}0`, `${a}.${b}${c}0`, `${a}.${b}0`]);
      const rows = d.shuffle([[keep, true], [`0.00${a}`, false], [`${b}.${c}0${a}`, false], [`${c}0.0${b}`, false]]);
      return C('생략할 수 있는 0이 있는 소수는?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
        explain: `소수점 아래 끝자리에 있는 0만 생략할 수 있다. ${keep}의 끝자리 0은 생략해도 크기가 같다.`, facts: truthOf(rows, true)
      });
    })
  ];

  // ── 소수 한 자리 수의 덧셈과 뺄셈 ──────────────────────────────
  // 소수 한 자리 수 둘을 [자연수 부분, 소수 첫째 자리 숫자, 자연수 부분, 소수 첫째 자리 숫자]로 뽑아 100배 한 수 둘로 돌려준다. wide: 앞 수의 자연수 부분이 두 자리.
  const tenthPair = (d, ok, wide) => { const [w1, f1, w2, f2] = d.until(() => [d.int(wide ? 10 : 0, wide ? 49 : 9), d.int(1, 9), d.int(0, 9), d.int(1, 9)], (v) => ok(v[0], v[1], v[2], v[3])); return [(w1 * 10 + f1) * 10, (w2 * 10 + f2) * 10]; };
  const TENTHS = [
    T('tenth-bar-add', '색칠한 막대를 보고 덧셈하기', '①68 ②54 ③54', (d) => {
      const [a, b] = d.until(() => [d.int(1, 7), d.int(1, 7)], ([x, y]) => x + y <= 9 && x !== y);
      return D('전체 크기가 1인 막대를 똑같이 10칸으로 나누어 두 가지 색으로 칠했다. 색칠한 부분은 모두 얼마인지 소수로 나타내면?', (a + b) / 10, {
        figure: bars(a, b), explain: `파란색은 0.${a}, 노란색은 0.${b}이다. 0.1이 모두 ${a + b}개이므로 0.${a} + 0.${b} = 0.${a + b}`, facts: { calc: [[`0.1*${a}+0.1*${b}`, 0]] }
      });
    }),
    T('tenth-bars-add', '막대 두 개에 색칠하여 합이 1을 넘는 덧셈하기', '①69 ②54 ③54', (d) => {
      const [a, b] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x + y >= 11 && x !== y);
      return M(`전체 크기가 1인 막대 2개를 각각 똑같이 10칸으로 나누어 파란색으로 0.${a}만큼, 노란색으로 0.${b}만큼 칠했다. 색칠한 칸은 모두 ㉠칸이고, 0.${a} + 0.${b} = ㉡이다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: (a + b) / 10, decimal: true }], {
        figure: bars(a, b), explain: `한 칸은 0.1이다. 색칠한 칸은 ${a} + ${b} = ${a + b}(칸)이고 0.1이 ${a + b}개이면 ${d1(a + b)}이다.`, facts: { calc: [[`${a}+${b}`, 0], [`0.${a}+0.${b}`, 1]] }
      });
    }),
    T('tenth-bar-sub', '×표 한 막대를 보고 뺄셈하기', '①86 ②55 ③54', (d) => {
      const a = d.int(4, 9), b = d.int(1, a - 1);
      return D('전체 크기가 1인 막대를 똑같이 10칸으로 나누어 색칠한 다음, 색칠한 부분의 일부에 ×표를 하였다. 색칠한 부분 가운데 ×표를 하지 않은 부분은 얼마인지 소수로 나타내면?', (a - b) / 10, {
        figure: bars(a, 0, b), explain: `색칠한 부분은 0.${a}, ×표 한 부분은 0.${b}이다. 0.1이 ${a - b}개 남으므로 0.${a} − 0.${b} = 0.${a - b}`, facts: { calc: [[`0.1*${a}-0.1*${b}`, 0]] }
      });
    }),
    T('tenth-bars-sub', '막대 두 개에서 덜어 내는 뺄셈하기', '①87 ③54', (d) => {
      const a = d.int(11, 18), b = d.int((a % 10) + 1, 9);
      return D('전체 크기가 1인 막대 2개를 각각 똑같이 10칸으로 나누어 색칠한 다음, 색칠한 부분의 일부에 ×표를 하였다. 색칠한 부분 가운데 ×표를 하지 않은 부분은 얼마인지 소수로 나타내면?', (a - b) / 10, {
        figure: bars(a, 0, b), explain: `색칠한 부분은 0.1이 ${a}개이므로 ${d1(a)}, ×표 한 부분은 0.${b}이다. 0.1이 ${a - b}개 남으므로 ${d1(a)} − 0.${b} = 0.${a - b}`, facts: { calc: [[`0.1*${a}-0.1*${b}`, 0]] }
      });
    }),
    T('tenth-line-add', '수직선을 보고 덧셈식 완성하기', '②54 ③55', (d) => {
      const [a, b] = d.until(() => [d.int(3, 9), d.int(2, 9)], ([x, y]) => (x + y) % 10 !== 0);
      return M('수직선을 보고 ㉠, ㉡에 알맞은 수를 구하면?', [{ label: LABELS[0], answer: b / 10, decimal: true }, { label: LABELS[1], answer: (a + b) / 10, decimal: true }], {
        figure: jumpLine(['0', '1', '2'], '0.1', a, b) + quote(expr(d1(a), '+', box(LABELS[0]), '=', box(LABELS[1]))),
        explain: `작은 눈금 한 칸은 0.1이다. ${d1(a)}에서 오른쪽으로 ${b}칸 더 갔으므로 ㉠은 ${d1(b)}이고, 0에서 모두 ${a + b}칸 갔으므로 ㉡은 ${d1(a + b)}이다.`, facts: { calc: [[`0.1*${b}`, 0], [`0.1*${a}+0.1*${b}`, 1]], rule: 'tenths' }
      });
    }),
    T('tenth-line-sub', '수직선을 보고 뺄셈식 완성하기', '①88 ③55', (d) => {
      const [a, b] = d.until(() => [d.int(11, 19), d.int(2, 9)], ([x, y]) => (x - y) % 10 !== 0);
      return M('수직선을 보고 ㉠, ㉡에 알맞은 수를 구하면?', [{ label: LABELS[0], answer: b / 10, decimal: true }, { label: LABELS[1], answer: (a - b) / 10, decimal: true }], {
        figure: jumpLine(['0', '1', '2'], '0.1', a, -b) + quote(expr(d1(a), '-', box(LABELS[0]), '=', box(LABELS[1]))),
        explain: `작은 눈금 한 칸은 0.1이다. ${d1(a)}에서 왼쪽으로 ${b}칸 되돌아왔으므로 ㉠은 ${d1(b)}이고, 0에서 ${a - b}칸 간 곳이므로 ㉡은 ${d1(a - b)}이다.`, facts: { calc: [[`0.1*${b}`, 0], [`0.1*${a}-0.1*${b}`, 1]], rule: 'tenths' }
      });
    }),
    T('tenth-count-add', '0.1의 개수로 덧셈하기', '①70 ②56 ③53', (d) => {
      const [a, b] = d.until(() => [d.int(2, 9), d.int(11, 29)], ([x, y]) => y % 10 !== 0 && (x + y) % 10 !== 0 && Number(d1(y)) * 10 === y && Number(d1(x)) * 10 + Number(d1(y)) * 10 === x + y), A = d1(a), Bt = d1(b);
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: b }, { label: LABELS[1], answer: a + b }, { label: LABELS[2], answer: (a + b) / 10, decimal: true }], {
        figure: quote(`${dj(A, '은/는')} 0.1이 ${a}개, ${dj(Bt, '은/는')} 0.1이 ${box(LABELS[0])}개이다. ${A} + ${dj(Bt, '은/는')} 0.1이 ${box(LABELS[1])}개이므로 ${box(LABELS[2])}이다.`),
        explain: `${dj(Bt, '은/는')} 0.1이 ${b}개이다. 0.1이 모두 ${a} + ${b} = ${a + b}(개)이므로 ${A} + ${Bt} = ${d1(a + b)}`, facts: { calc: [[`${Bt}*10`, 0], [`${A}*10+${Bt}*10`, 1], [`${A}+${Bt}`, 2]], unseen: [10], rule: 'tenths' }
      });
    }),
    T('tenth-count-sub', '0.1의 개수로 뺄셈하기', '①89 ②56 ③53', (d) => {
      const [a, b] = d.until(() => { const x = d.int(21, 98); return [x, d.int(11, x - 2)]; }, ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x - y) % 10 !== 0 && Number(d1(x)) * 10 === x && Number(d1(x)) * 10 - Number(d1(y)) * 10 === x - y), A = d1(a), Bt = d1(b);
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: a - b }, { label: LABELS[2], answer: (a - b) / 10, decimal: true }], {
        figure: quote(`${dj(A, '은/는')} 0.1이 ${box(LABELS[0])}개, ${dj(Bt, '은/는')} 0.1이 ${b}개이다. ${A} − ${dj(Bt, '은/는')} 0.1이 ${box(LABELS[1])}개이므로 ${box(LABELS[2])}이다.`),
        explain: `${dj(A, '은/는')} 0.1이 ${a}개이다. 0.1이 ${a} − ${b} = ${a - b}(개) 남으므로 ${A} − ${Bt} = ${d1(a - b)}`, facts: { calc: [[`${A}*10`, 0], [`${A}*10-${Bt}*10`, 1], [`${A}-${Bt}`, 2]], unseen: [10], rule: 'tenths' }
      });
    }),
    T('tenth-natural', '자연수의 뺄셈을 이용한 소수 한 자리 수의 뺄셈', '①71·90', (d) => {
      const [a, b] = d.until(() => { const x = d.int(21, 98); return [x, d.int(11, x - 2)]; }, ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x - y) % 10 !== 0);
      return M('자연수의 뺄셈을 이용하여 소수의 뺄셈을 하려고 한다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a - b }, { label: LABELS[1], answer: (a - b) / 10, decimal: true }], {
        figure: lines([expr(a, '-', b, '=', box(LABELS[0])), expr(d1(a), '-', d1(b), '=', box(LABELS[1]))]),
        explain: `${d1(a)}${tail(d1(a), '과/와')} ${dj(d1(b), '은/는')} 0.1이 ${a}개, ${b}개인 수이다. ${a} − ${b} = ${a - b}이므로 0.1이 ${a - b}개인 ${d1(a - b)}이다.`, facts: { calc: [[`${a}-${b}`, 0], [`${d1(a)}-${d1(b)}`, 1]], rule: 'tenths' }
      });
    }),
    T('tenth-frac-sub', '분수로 고쳐 뺄셈하기', '②58', (d) => {
      const [a, b] = d.until(() => [d.int(11, 19), d.int(2, 9)], ([x, y]) => x - y >= 1 && x - y <= 9 && Number(d1(x)) * 10 === x && Number(d1(x)) * 10 - y === x - y), A = d1(a), Bt = d1(b);
      return M('소수를 분수로 고쳐 계산하려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: a - b }, { label: LABELS[2], answer: (a - b) / 10, decimal: true }], {
        figure: quote(`${A} − ${Bt} = ${frac(box(LABELS[0]), 10)} − ${frac(b, 10)} = ${frac(box(LABELS[1]), 10)} = ${box(LABELS[2])}`),
        explain: `${A} = ${frac(a, 10)}, ${Bt} = ${frac(b, 10)}이다. ${frac(a, 10)} − ${frac(b, 10)} = ${frac(a - b, 10)} = ${d1(a - b)}`, facts: { calc: [[`${A}*10`, 0], [`${A}*10-${b}`, 1], [`${A}-${Bt}`, 2]] }
      });
    }),
    calcType('tenth-add-under1', '합이 1보다 작은 덧셈', '①72 ②61', '+', [1, 1], 'row', (d) => tenthPair(d, (w1, f1, w2, f2) => w1 === 0 && w2 === 0 && f1 + f2 <= 9), '0.1의 개수를 더한다.'),
    calcType('tenth-add-over1', '1보다 작은 두 수의 합이 1을 넘는 덧셈', '①73 ②62 ③57', '+', [1, 1], 'row', (d) => tenthPair(d, (w1, f1, w2, f2) => w1 === 0 && w2 === 0 && f1 + f2 >= 11), '0.1이 10개이면 1이다.'),
    calcType('tenth-add-plain', '받아올림이 없는 소수 한 자리 수의 덧셈', '①74 ②61 ③56 심48', '+', [1, 1], 'col', (d) => tenthPair(d, (w1, f1, w2, f2) => w1 >= 1 && w2 >= 1 && w1 + w2 <= 9 && f1 + f2 <= 9), ALIGN),
    calcType('tenth-add-carry', '받아올림이 있는 소수 한 자리 수의 덧셈', '①75 ②63 ③58 심48', '+', [1, 1], 'col', (d) => tenthPair(d, (w1, f1, w2, f2) => w1 + w2 >= 1 && w1 + w2 <= 8 && f1 + f2 >= 11), '소수 첫째 자리 숫자의 합이 10이거나 10보다 크면 일의 자리로 받아올림한다.'),
    calcType('tenth-add-ten', '합이 10을 넘는 소수 한 자리 수의 덧셈', '①75 ②64 ③58', '+', [1, 1], 'row', (d) => tenthPair(d, (w1, f1, w2, f2) => w1 >= 2 && w2 >= 2 && w1 + w2 >= 9 && f1 + f2 >= 11), '소수 첫째 자리와 일의 자리에서 차례로 받아올림한다.'),
    calcType('tenth-sub-plain', '받아내림이 없는 소수 한 자리 수의 뺄셈', '①91 ②71 ③59', '-', [1, 1], 'col', (d) => tenthPair(d, (w1, f1, w2, f2) => w1 > w2 && f1 > f2), ALIGN),
    calcType('tenth-sub-borrow', '받아내림이 있는 소수 한 자리 수의 뺄셈', '①92 ②72 ③60 심48', '-', [1, 1], 'col', (d) => tenthPair(d, (w1, f1, w2, f2) => w2 >= 1 && w1 - w2 >= 2 && f1 < f2), '소수 첫째 자리끼리 뺄 수 없으면 일의 자리에서 받아내림한다.'),
    calcType('tenth-sub-under1', '차가 1보다 작은 뺄셈', '①92 ②72 ③60', '-', [1, 1], 'row', (d) => tenthPair(d, (w1, f1, w2, f2) => w2 >= 1 && w1 === w2 + 1 && f1 < f2), '일의 자리에서 받아내림하면 일의 자리의 차는 0이다.'),
    calcType('tenth-sub-ten', '십의 자리가 있는 수의 뺄셈', '①92 ②73', '-', [1, 1], 'col', (d) => tenthPair(d, (w1, f1, w2, f2) => w2 >= 1 && f1 < f2, true), '소수 첫째 자리끼리 뺄 수 없으면 일의 자리에서 받아내림한다.'),
    calcType('tenth-sub-whole', '자연수에서 소수 한 자리 수를 빼는 뺄셈', '②74 ③61', '-', [0, 1], 'row', (d) => { const w = d.int(2, 9), b = d.int(0, w - 1) * 10 + d.int(1, 9); return [w * 100, b * 10]; }, '자연수의 소수 첫째 자리에 0이 있다고 생각하고 일의 자리에서 받아내림한다.'),
    T('tenth-wrong-add', '받아올림을 빠뜨린 덧셈 바로잡기', '②82', (d) => {
      // 7.8 + 1.9 = 8.7: 받아올림한 수를 일의 자리에 더하지 않았다.
      const [w1, f1, w2, f2] = d.until(() => [d.int(1, 7), d.int(2, 9), d.int(1, 7), d.int(2, 9)], (v) => v[0] + v[2] <= 8 && v[1] + v[3] >= 11), A = `${w1}.${f1}`, Bt = `${w2}.${f2}`;
      const wrong = `${w1 + w2}.${(f1 + f2) % 10}`, right = (w1 + w2) * 10 + f1 + f2;
      return D('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', right / 10, {
        figure: column(A, '+', Bt, wrong), explain: `소수 첫째 자리에서 받아올림한 수를 일의 자리에 더하지 않았다. 바르게 계산하면 ${A} + ${Bt} = ${d1(right)}이다.`, facts: { calc: [[`${A}+${Bt}`, 0]], rule: 'tenth-wrong-add' }
      });
    }),
    T('tenth-wrong-sub', '받아내림을 빠뜨린 뺄셈 바로잡기', '②82', (d) => {
      // 5.2 − 1.5 = 4.7: 받아내림하고 남은 수로 일의 자리를 계산하지 않았다.
      const [w1, f1, w2, f2] = d.until(() => [d.int(3, 9), d.int(1, 8), d.int(1, 7), d.int(2, 9)], (v) => v[0] - v[2] >= 2 && v[1] < v[3]), A = `${w1}.${f1}`, Bt = `${w2}.${f2}`;
      const wrong = `${w1 - w2}.${f1 + 10 - f2}`, right = (w1 - w2) * 10 + f1 - f2;
      return D('다음은 잘못 계산한 것이다. 바르게 계산한 값은?', right / 10, {
        figure: column(A, '-', Bt, wrong), explain: `일의 자리에서 받아내림하고도 일의 자리 수를 1 줄이지 않았다. 바르게 계산하면 ${A} − ${Bt} = ${d1(right)}이다.`, facts: { calc: [[`${A}-${Bt}`, 0]], rule: 'tenth-wrong-sub' }
      });
    })
  ];

  B.addUnit({
    id: '4-2-3', grade: 4, semester: 2, no: 3, title: '소수의 덧셈과 뺄셈', version: 1,
    groups: [
      { id: 'read', title: '소수 두 자리 수와 소수 세 자리 수', standard: NUM, types: READ },
      { id: 'place', title: '소수의 자릿값', standard: NUM, types: PLACE },
      { id: 'relate', title: '소수 사이의 관계', standard: NUM, types: RELATE },
      { id: 'unit', title: '단위를 소수로 나타내기', standard: NUM, types: UNIT },
      { id: 'compare', title: '소수의 크기 비교', standard: ORDER, types: COMPARE },
      { id: 'tenth', title: '소수 한 자리 수의 덧셈과 뺄셈', standard: CALC, types: TENTHS },
      { id: 'hund', title: '소수 두 자리 수의 덧셈과 뺄셈', standard: CALC, types: [] },
      { id: 'mixed', title: '자릿수가 다른 소수의 덧셈과 뺄셈', standard: CALC, types: [] },
      { id: 'use', title: '덧셈과 뺄셈의 활용', standard: CALC, types: [] },
      { id: 'word', title: '덧셈과 뺄셈 문장제', standard: CALC, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
