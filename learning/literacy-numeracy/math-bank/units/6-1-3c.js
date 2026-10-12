// 6학년 1학기 3단원 소수의 나눗셈 — 실력 문항.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 6-1-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 수 하나·검사 식·그림 도우미는 6-1-3a.js 의 것을 그대로 옮겨 적었다(파일마다 따로 닫혀 있어 함께 쓸 수 없다).
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 수를 하나 내려도 나눌 수 없을 때 몫의 그 자리에 0을 쓰지 않는다(6.3 ÷ 6 = 1.5). 세로셈에서 어느 줄부터 틀렸는지 짚지 못한다.
//  - 나누어지는 수가 나누는 수보다 작으면 몫이 1보다 작다는 것을 수의 크기로 가리지 못한다. 소수가 보이면 「작다」, 자연수끼리면 「크다」고 여기고, 큰 수를 작은 수로 나누는 버릇대로 3 ÷ 4를 4 ÷ 3으로 바꾼다.
//  - 몫의 숫자 배열만 맞히고 소수점의 자리를 어림으로 확인하지 않는다. 몫이 1보다 작을 때 일의 자리 0, 0.0□일 때 소수 첫째 자리 0을 쓰지 못한다.
//  - 자연수의 나눗셈으로 몫을 정할 때 숫자 배열만 보고 1/10배와 1/100배를 가른다(870과 8.7을 「10배」라고 한다).
//  - 문장에 적힌 수만 나누는 수로 쓴다: 「일주일」「친구 3명과 함께」「한 시간 → 1분」「정육각형」처럼 글에 숨은 나누는 수를 꺼내지 못하고, 묻는 것과 상관없는 수로 나눈다.
//  - 「~은 ~의 몇 배」에서 문장에 먼저 나온 수를 나누어지는 수로 삼는다. 어느 쪽이 기준(나누는 수)인지 읽지 않는다.
//  - 몫과 소수의 크기를 견줄 때 소수 첫째 자리만 보고 둘째 자리를 놓친다.
//  - 묶음 속 낱개(4개씩 8봉지), 도형 여러 개의 변(정삼각형 3개), 넓이(가로 × 세로)가 나누는 수인데 눈에 보이는 수 하나로만 나눈다.
//
// 실력에는 ① 문제의 상황·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(어떤 수를 한 번 거꾸로 구해 바르게 계산하기,
// 두 몫 사이의 □, 수 카드로 몫이 가장 큰 식 만들기, 더하거나 뺀 뒤 나누기, 모아서 다시 나누기, 나눈 뒤 다시 나누거나 모으기, 두 몫 견주기, 둘레·넓이를 한 번 구해 나누기, 수직선)만 실었다.
// 기본에서 하는 나눗셈 한 번을 고르기로 바꾼 것은 싣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, nick, box, frac, lines, chain, numbers, cards, table, N, M, C, D } = B.kit;
  const DEC = '6수01-15', NAT = '6수01-14';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SG = { '+': '+', '-': '−', '*': '×', '/': '÷', '=': '=', '>': '&gt;', '<': '&lt;' };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  // 식 한 줄: 조각을 이어 적는다. '+', '-', '*', '/', '=' 은 기호로 바꾼다.
  const eq = (...parts) => ex(parts.map((p) => (SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const tagged = (list, tags) => lines(list.map((html, i) => tag((tags || LAB)[i]) + html));
  const said = (who, text) => `${who}: 「${text}」`;

  // ── 수 하나 ──
  // 수는 { n: 소수점을 뗀 자연수, k: 소수점 아래 자리 수 }로 다룬다(끝자리 0은 떼어 둔다). 2.35 = { n: 235, k: 2 }.
  const P10 = [1, 10, 100, 1000, 10000, 100000, 1000000];
  const dec = (n, k) => { while (k > 0 && n % 10 === 0) { n /= 10; k -= 1; } return { n, k }; };
  const nat = (n) => ({ n, k: 0 });
  const fx = (n, k) => { const t = String(n).padStart(k + 1, '0'); return k ? t.slice(0, -k) + '.' + t.slice(-k) : t; };
  const S = (x) => fx(x.n, x.k);                 // 글에 적는 꼴
  const V = (x) => x.n / P10[x.k];               // 답 칸에 넣는 값
  // 나눗셈: 소수 셋째 자리 안에서 나누어떨어지면 몫을, 아니면 null 을 돌려준다.
  const quo = (x, c) => { for (let K = x.k; K <= 3; K += 1) { const m = x.n * P10[K - x.k]; if (m % c === 0) return dec(m / c, K); } return null; };
  const times = (q, c) => dec(q.n * c, q.k);     // 몫과 나누는 수로 나누어지는 수를 만든다.
  // 토씨: 소수는 끝자리 숫자를 마지막에 읽는다(0.3은, 0.25는). 자연수를 적은 글에도 쓴다.
  const BATCHIM = [true, true, false, true, false, false, true, true, true, false], RIEUL = [false, true, false, false, false, false, false, true, true, false];
  const dj = (text, pair) => { const [yes, no] = pair.split('/'), k = Number(String(text).slice(-1)); return text + (yes === '으로' ? (BATCHIM[k] && !RIEUL[k] ? '으로' : '로') : BATCHIM[k] ? yes : no); };
  const J = (x, pair) => dj(S(x), pair);
  const part = (k) => frac(1, P10[k]);
  const nz = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  const digs = (n) => String(n).split('').map(Number);
  const C29 = [2, 3, 4, 5, 6, 7, 8, 9];
  // 몫 q 와 나누는 수 c 를 먼저 정하고 나누어지는 수 x 를 만든다(어떤 씨앗에서도 나누어떨어진다). 나누어지는 수는 소수 두 자리까지, 소수점을 뗀 수는 네 자리까지.
  const gen = (d, cs, pickQ, ok) => d.until(() => { const c = d.pick(cs), q = pickQ(c); return { c, q, x: times(q, c) }; }, (v) => v.q.n > 0 && v.x.k <= 2 && v.x.n < 10000 && (!ok || ok(v)));
  const qd = (d, lo, hi, k) => ({ n: nz(d, lo, hi), k });
  const plainQ = (q) => !String(q.n).includes('0');                              // 몫의 숫자에 0이 없다.
  const eachPlace = (x, c) => digs(x.n).every((v) => v !== 0 && v % c === 0);    // 각 자리에서 나누어떨어진다.

  // ── 검사가 다시 셈하는 식 ──
  // 소수 답은 글에 적힌 소수 그대로 나눈 식으로(검사가 소수 셋째 자리까지 맞춰 본다), 자연수 답과 견주기는 정수 식으로 적는다.
  // 수 하나를 소수점을 뗀 자연수로 적은 식: 2.35 → (2*100+35). 글에 없는 수(100, 소수 부분이 0으로 시작하는 05의 5)는 un 에 모은다.
  const ix = (x) => { if (!x.k) return { s: String(x.n), un: [] }; const w = Math.floor(x.n / P10[x.k]), f = x.n % P10[x.k]; return { s: `(${w}*${P10[x.k]}+${f})`, un: [P10[x.k]].concat(f < P10[x.k - 1] ? [f] : []) }; };
  // 몫을 1000배 한 정수의 식과 값
  const mil = (x, c) => { const i = ix(x), m = P10[3 - x.k]; return { s: `${i.s}*${m}/${c}`, v: x.n * m / c, un: i.un.concat([m]) }; };
  const inp = (label, x, unit) => Object.assign({ label, answer: V(x) }, x.k ? { decimal: true } : {}, unit ? { unit } : {});
  // 몫 하나를 답하는 문항(소수 칸). 식은 글에 적힌 수 그대로 적는다.
  const qAns = (text, x, c, o) => { const r = quo(x, c); if (!r || !r.k) throw new Error('몫이 소수가 아니다'); return D(text, V(r), Object.assign({}, o, { facts: Object.assign({ calc: [[`${S(x)}/${c}`, 0]] }, o.facts || {}) })); };
  // 풀이 글: 자연수의 나눗셈에서 소수점을 옮긴다.
  const how = (x, c) => { const r = quo(x, c), n0 = x.n * P10[r.k - x.k]; return `${n0} ÷ ${c} = ${n0 / c}이다. ${J(x, '은/는')} ${n0}의 ${part(r.k)}배이므로 몫은 ${n0 / c}의 ${part(r.k)}배인 ${S(r)}이다.`; };
  const told = (x, c) => `${S(x)} ÷ ${c} = ${S(quo(x, c))}`;

  // ── 그림 ──
  const svg = (cls, w, h, label, body) => `<svg class="${cls}" style="vertical-align:middle" viewBox="0 0 ${w} ${h}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  const DOT = '<span style="display:inline-block;width:0">.</span>', PALE = 'color:#94a3b8';
  // 나눗셈을 세로로 계산하는 차례(엔진의 longDivision 과 같다). 숫자 글 ds 를 받아 앞자리 0도 한 칸으로 둔다. at: 그 줄을 적게 한 몫의 자리.
  function ldiv(c, ds) {
    const digits = ds.split('').map(Number), n = digits.length, quot = digits.map(() => null), rows = [];
    let cur = 0, started = false;
    for (let i = 0; i < n; i += 1) {
      cur = cur * 10 + digits[i];
      const q = Math.floor(cur / c);
      if (q === 0) { if (started) quot[i] = 0; continue; }
      started = true; quot[i] = q;
      rows.push({ value: q * c, end: i, sub: true, at: i });
      cur -= q * c;
      let j = i, shown = cur;
      while (j < n - 1 && shown < c) { j += 1; shown = shown * 10 + digits[j]; }
      rows.push({ value: shown, end: j, sub: false, at: i });
    }
    return { quot, rows, rest: cur };
  }
  // 소수점이 있는 나눗셈의 세로셈. c ) x 를 적는다. o.steps 이면 몫과 계산 과정도 적는다.
  //  - 몫의 소수점은 나누어지는 수의 소수점 자리에 맞추어 찍고, 몫이 1보다 작으면 일의 자리에 0을 적는다.
  //  - 소수점 아래 0을 내려 계산하면 내려 쓴 0을 나누어지는 수 옆에 옅게 적는다. o.pad: 내려 쓸 0의 수(주지 않으면 나누어떨어질 때까지, 0이면 내리지 않고 멈춘다).
  //  - 빈칸: o.quot(몫을 가리는 이름표), o.rows({ 줄 번호: 이름표 }). o.nodot: 몫에 소수점을 찍지 않는다.
  //  - o.given({ cells, dot }): 잘못 계산한 세로셈처럼 몫의 칸(자리마다 글자)과 소수점을 찍을 칸을 그대로 정해 줄 때 쓴다.
  function ddiv(c, x, o) {
    o = o || {};
    const text = S(x), intLen = text.split('.')[0].length, own = text.replace('.', '');
    let ds = own;
    if (o.steps) { if (o.pad !== undefined) ds += '0'.repeat(o.pad); else while (Number(ds) % c !== 0 && ds.length - intLen < 3) ds += '0'; }
    const n = ds.length, work = ldiv(c, ds), g = o.given || {}, hidden = o.rows || {};
    const cells = g.cells || work.quot.map((q, i) => (q !== null || i >= intLen - 1 ? String(q || 0) : ''));
    const dot = o.nodot ? null : g.dot !== undefined ? g.dot : n > intLen ? intLen - 1 : null;
    const dotted = (i) => i === dot && cells.slice(i + 1).some(Boolean);
    const quotText = cells.map((ch, i) => ch + (dotted(i) ? '.' : '')).join('');
    const line = (value, end, label, cls) => {
      const s = String(value), from = end - s.length + 1;
      let h = `<tr${cls ? ` class="${cls}"` : ''}><td></td><td></td>`;
      for (let col = 0; col < n; col += 1) {
        if (col < from || col > end) h += '<td></td>';
        else if (label !== undefined) { if (col === from) h += `<td colspan="${s.length}" class="mb-ld-blank">${box(label)}</td>`; }
        else h += `<td>${s[col - from]}</td>`;
      }
      return h + '</tr>';
    };
    let out = '';
    if (o.steps) out += '<tr class="mb-ld-quot"><td></td><td></td>' + (o.quot !== undefined ? `<td colspan="${n}" class="mb-ld-blank">${box(o.quot)}</td>` : cells.map((ch, i) => `<td>${ch}${dotted(i) ? DOT : ''}</td>`).join('')) + '</tr>';
    out += `<tr class="mb-ld-top"><td>${c}</td><td class="mb-ld-hook"></td>` + ds.split('').map((ch, i) => {
      const pale = i >= own.length, point = i === intLen - 1 && n > intLen ? (x.k ? DOT : `<span style="display:inline-block;width:0;${PALE}">.</span>`) : '';
      return `<td${pale ? ` style="${PALE}"` : ''}>${ch}${point}</td>`;
    }).join('') + (o.steps || n > 1 ? '' : '<td></td>') + '</tr>'; // 한 자리 수만 적으면 표가 너무 좁아(60px 아래) 화면 검사에 걸린다. 0을 내려 쓸 빈칸을 하나 둔다.
    if (o.steps) work.rows.forEach((row, k) => { out += line(row.value, row.end, hidden[k], row.sub ? 'mb-ld-sub' : ''); });
    const process = o.steps ? `, ${o.nodot ? `몫의 숫자 ${quotText}(소수점을 찍지 않았다)` : `몫 ${o.quot !== undefined ? '□' : quotText}`}, 계산 과정: ` + work.rows.map((row, k) => (hidden[k] !== undefined ? '□' : row.value)).join(', ') : '';
    return `<table class="mb-longdiv" role="img" aria-label="나눗셈 세로셈 ${text} 나누기 ${c}${process}">${out}</table>`;
  }
  // 세로셈 과정의 줄을 검사가 다시 셈하는 식. x 에 0을 pad 개 내려 쓴 자연수(n 자리)를 c 로 나눈다.
  function rowExprs(c, x, pad) {
    const i0 = ix(x), base = pad ? `${i0.s}*${P10[pad]}` : i0.s, n = S(x).replace('.', '').length + pad;
    const pre = (i) => (i === n - 1 ? `(${base})` : `((${base}-(${base})%${P10[n - 1 - i]})/${P10[n - 1 - i]})`);
    const fl = (e) => `((${e}-${e}%${c})/${c})`;
    return {
      of: (row) => (row.sub ? `${c}*(${fl(pre(row.at))}${row.at > 0 ? `-10*${fl(pre(row.at - 1))}` : ''})` : `${pre(row.end)}-${c}*${fl(pre(row.at))}*${P10[row.end - row.at]}`),
      un: i0.un.concat([10, 100, 1000, 10000])
    };
  }
  // 수 모형: 1 모형(정사각형) ones 개와 0.1 모형(막대) tenths 개
  function model(ones, tenths) {
    const s = 26, step = 31; let out = '';
    for (let i = 0; i < ones; i += 1) out += `<rect x="${4 + i * step}" y="4" width="${s}" height="${s}" style="fill:#bfdbfe;stroke:#1e3a8a;stroke-width:1.2"/><text x="${4 + i * step + s / 2}" y="${4 + s / 2 + 4.5}" text-anchor="middle" style="font-size:12px;font-weight:700;fill:#1e3a8a">1</text>`;
    for (let i = 0; i < tenths; i += 1) out += `<rect x="${4 + i * 12}" y="${s + 12}" width="7" height="${s}" style="fill:#fde68a;stroke:#92400e;stroke-width:1"/>`;
    return svg('mb-pieces', Math.max(ones * step, tenths * 12) + 6, s * 2 + 16, `수 모형: 1 모형 ${ones}개, 0.1 모형 ${tenths}개`, out);
  }

  // (자연수)÷(자연수): 몫이 소수 places 자리 수가 되는 a, c
  const natPair = (d, cs, places, ok) => d.until(() => { const c = d.pick(cs), a = d.int(1, 99); return { c, x: nat(a), q: quo(nat(a), c) }; }, (v) => v.q && v.q.k === places && (!ok || ok(v)));

  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const pick = (d, k) => d.shuffle(NAMES).slice(0, k);
  // 수직선: 왼쪽 끝과 오른쪽 끝(글) 사이를 parts 칸으로 똑같이 나눈다. mark: [왼쪽 끝에서 센 눈금 수, 이름표]
  function stepLine(left, right, parts, mark) {
    const u = 236 / parts, x = (i) => (32 + i * u).toFixed(1), y = 40, word = 'style="font-size:13px;font-weight:600"';
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(parts)}" y2="${y}"/>`;
    for (let i = 0; i <= parts; i += 1) { const len = i === 0 || i === parts ? 7 : 4.5; out += `<line class="mb-axis" x1="${x(i)}" y1="${y - len}" x2="${x(i)}" y2="${y + len}"/>`; }
    out += `<text class="mb-axis-label" ${word} x="${x(0)}" y="${y + 24}" text-anchor="middle">${left}</text><text class="mb-axis-label" ${word} x="${x(parts)}" y="${y + 24}" text-anchor="middle">${right}</text>`;
    if (mark) out += `<text class="mb-axis-label" style="font-size:16px;font-weight:600" x="${x(mark[0])}" y="${y - 22}" text-anchor="middle">${mark[1]}</text><path class="mb-pointer" d="M${x(mark[0])} ${y - 8}l-4 -9h8z"/>`;
    return `<svg class="mb-numberline" viewBox="0 0 300 72" width="300" role="img" aria-label="수직선: ${dj(left, '과/와')} ${right} 사이를 똑같이 ${parts}칸으로 나누었다.${mark ? ` ${mark[1]}은 ${left}에서 작은 눈금 ${mark[0]}칸 간 곳` : ''}">${out}</svg>`;
  }
  // 똑같이 나눈 직사각형: 세로 rows 칸, 가로 cols 칸. on 에 적힌 번호의 칸(왼쪽 위부터 0)을 색칠한다.
  function shadeGrid(rows, cols, on) {
    const cell = Math.min(40, 240 / cols); let out = '';
    for (let i = 0; i < rows * cols; i += 1) out += `<rect class="mb-piece${on.includes(i) ? ' is-on' : ''}" x="${2 + (i % cols) * cell}" y="${2 + Math.floor(i / cols) * cell}" width="${cell}" height="${cell}"/>`;
    return svg('mb-pieces', cols * cell + 4, rows * cell + 4, `직사각형을 똑같이 ${rows * cols}칸으로 나누고 ${on.length}칸을 색칠`, out);
  }
  // 덧셈·뺄셈: 소수점 아래 자리 수를 맞추어 셈한다.
  const plus = (x, y, sign) => { const K = Math.max(x.k, y.k); return dec(x.n * P10[K - x.k] + (sign || 1) * y.n * P10[K - y.k], K); };
  const mulN = (x, c) => dec(x.n * c, x.k);
  // 소수 답 하나(식을 글 그대로 적는다). value: { n, k }
  const dAns = (text, value, expr, o) => { if (!value.k || value.n <= 0) throw new Error('답이 소수가 아니다'); return D(text, V(value), Object.assign({}, o, { facts: Object.assign({ calc: [[expr, 0]] }, o.facts || {}) })); };
  const POLY = [['정삼각형', 3], ['정사각형', 4], ['정오각형', 5], ['정육각형', 6], ['정팔각형', 8]];

  B.addGroup('6-1-3', {
    id: 'hard', title: '실력 문제', standard: DEC,
    types: [
      // ── ① 문제의 상황·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-zero-first', '잘못 계산한 세로셈에서 처음으로 틀린 곳 찾기', '심22 / 기본 ①30 ②45 ③34', (d) => {
        // 함정: 몫의 숫자는 모두 맞게 구했지만 0을 써야 할 자리를 건너뛰었다. 「숫자가 맞으니 계산은 맞다」고 여기는 아이, 0을 어느 자리에 쓰는지 모르는 아이가 걸린다.
        //  세 가지 꼴: 소수 첫째 자리 0을 빠뜨림(6.36 ÷ 6 = 1.6), 일의 자리 0을 빠뜨림(4.14 ÷ 6 = 6.9), 0을 내리지 않고 멈춤(8.1 ÷ 2 = 4 … 1). 틀린 설명의 자리는 꼴마다 다르다.
        const kind = d.int(0, 2);
        let v, figure, rows, fix;
        if (kind === 0) {
          v = gen(d, C29, () => ({ n: d.int(1, 9) * 100 + d.int(2, 9), k: 2 }), (w) => w.x.k === 2 && (w.q.n % 10) * w.c >= 10);
          const W = Math.floor(v.q.n / 100), f = v.q.n % 10, whole = W * v.c, th = f * v.c, t = Math.floor(th / 10), h = th % 10, len = String(whole).length;
          figure = ddiv(v.c, v.x, { steps: true, given: { cells: Array.from({ length: len + 2 }, (_, i) => (i === len - 1 ? String(W) : i === len ? String(f) : '')), dot: len - 1 } });
          rows = [[`${whole} ÷ ${v.c} = ${W}이므로 몫의 일의 자리에 ${josa(W, '을/를')} 쓴다.`, true], [`소수 첫째 자리 숫자 ${josa(t, '은/는')} ${v.c}보다 작아 나눌 수 없으므로 소수 둘째 자리 숫자 ${h}까지 내려 ${josa(th, '을/를')} 만든다.`, true], [`${th} ÷ ${v.c} = ${f}이므로 몫의 소수 첫째 자리에 ${josa(f, '을/를')} 쓴다.`, false]];
          fix = `수를 하나 내려도 나눌 수 없으면 몫의 그 자리에 0을 쓴다. 몫의 소수 첫째 자리에는 0을 쓰고 ${josa(f, '은/는')} 소수 둘째 자리에 써야 한다.`;
        } else if (kind === 1) {
          v = gen(d, C29, () => qd(d, 12, 98, 2), (w) => w.x.k === 2 && plainQ(w.q) && w.x.n >= 100 && w.x.n < 1000 && Math.floor(w.x.n / 10) % w.c !== 0);
          const a = digs(v.x.n)[0], two = Math.floor(v.x.n / 10), q1 = Math.floor(v.q.n / 10), q2 = v.q.n % 10, last = v.x.n % 10, next = (two - q1 * v.c) * 10 + last;
          figure = ddiv(v.c, v.x, { steps: true, given: { cells: ['', String(q1), String(q2)], dot: 1 } });
          rows = [[`${josa(a, '은/는')} ${v.c}보다 작아 나눌 수 없으므로 ${two} ÷ ${josa(v.c, '을/를')} 계산하여 몫의 일의 자리에 ${josa(q1, '을/를')} 쓴다.`, false], [`${two}에서 ${v.c} × ${q1} = ${josa(q1 * v.c, '을/를')} 빼고 ${josa(last, '을/를')} 내려 ${josa(next, '을/를')} 만든다.`, true], [`${next} ÷ ${v.c} = ${q2}이므로 몫의 그다음 자리에 ${josa(q2, '을/를')} 쓴다.`, true]];
          fix = `나누어지는 수의 일의 자리 숫자가 나누는 수보다 작으면 몫의 일의 자리에 0을 쓰고 소수점을 찍는다. ${josa(q1, '은/는')} 몫의 소수 첫째 자리에 써야 한다.`;
        } else {
          v = gen(d, [2, 4, 5, 6, 8], () => ({ n: d.int(1, 9) * 100 + d.int(1, 9), k: 2 }), (w) => w.x.k === 1);
          const W = Math.floor(v.q.n / 100), whole = W * v.c, t = v.x.n % 10, len = String(whole).length;
          figure = ddiv(v.c, v.x, { steps: true, pad: 0, given: { cells: Array.from({ length: len + 1 }, (_, i) => (i === len - 1 ? String(W) : '')), dot: -1 } });
          rows = [[`${whole} ÷ ${v.c} = ${W}이므로 몫의 일의 자리에 ${josa(W, '을/를')} 쓴다.`, true], [`소수 첫째 자리 숫자 ${josa(t, '은/는')} ${v.c}보다 작아 나눌 수 없으므로 계산을 끝내고 ${josa(t, '을/를')} 남긴다.`, false], ['몫의 소수점은 나누어지는 수의 소수점 자리에 맞추어 찍는다.', true]];
          fix = `나눌 수 없으면 몫의 소수 첫째 자리에 0을 쓰고, 소수점 아래 0을 내려 ${t * 10} ÷ ${josa(v.c, '을/를')} 계산해야 한다.`;
        }
        return C(`${S(v.x)} ÷ ${josa(v.c, '을/를')} 세로로 잘못 계산한 것이다. 계산한 차례대로 적은 설명 가운데 처음으로 잘못된 것은?`, THREE, rows.findIndex((row) => !row[1]), {
          figure: figure + tagged(rows.map((row) => row[0])),
          explain: `${fix} 바르게 계산하면 ${told(v.x, v.c)}이다.`,
          facts: { truth: rows.map((row) => row[1]), want: false }
        });
      }),
      H('hard-less-one', '계산하지 않고 몫이 1보다 작은 나눗셈 세기', '심27 / 기본 ①24 ②36 ③38', (d) => {
        // 함정: 나누어지는 수와 나누는 수가 아주 가깝다(8.97 ÷ 9, 9.03 ÷ 9). 소수가 보이면 몫이 작다고 여기는 아이, 자연수끼리의 나눗셈은 몫이 1보다 크다고 여기는 아이(12 ÷ 15),
        //  큰 수를 작은 수로 나누는 버릇대로 읽는 아이가 걸린다. 나누어지는 수가 나누는 수보다 작은 것만 센다.
        const decRow = (small) => { const c = d.int(3, 9), q = dec(100 + (small ? -1 : 1) * d.int(1, 9), 2); return { c, x: times(q, c), small }; };
        const natRow = (small) => { const v = d.until(() => { const c = d.pick([4, 5, 8, 12, 15, 20, 25]), a = c + (small ? -1 : 1) * d.int(1, Math.max(2, Math.floor(c / 4))); return { c, x: nat(a), q: quo(nat(a), c) }; }, (w) => w.q && w.q.k <= 2 && w.x.n >= 2); return Object.assign(v, { small }); };
        const rows = d.until(() => { const sides = d.shuffle([true, false, d.bool(), d.bool()]); return d.shuffle([decRow(sides[0]), decRow(sides[1]), natRow(sides[2]), natRow(sides[3])]); }, (list) => { const k = list.filter((v) => v.small).length; return k >= 1 && k <= 3 && new Set(list.map((v) => `${S(v.x)}÷${v.c}`)).size === 4 && (list.some((v) => v.x.k === 0 && v.small) || list.some((v) => v.x.k > 0 && !v.small)); });
        const hits = rows.map((v, i) => (v.small ? LAB[i] : '')).filter(Boolean);
        return N('계산하지 않고 알아볼 때, 몫이 1보다 작은 것은 모두 몇 개인가?', hits.length, {
          unit: '개', figure: tagged(rows.map((v) => eq(S(v.x), '/', v.c))),
          explain: `나누어지는 수가 나누는 수보다 작으면 몫이 1보다 작다. 나누어지는 수가 나누는 수보다 작은 것은 ${hits.join(', ')}이다.`,
          facts: { choose: { exprs: rows.map((v) => `${S(v.x)}/${v.c}`), rule: 'countBelow', target: 1 } }
        });
      }),
      H('hard-spot', '소수점을 빠뜨린 몫을 어림하여 바로잡기', '심24·25 / 기본 ①33 ②33 ③36', (d) => {
        // 함정: 손으로 계산하기 번거로운 수(두 자리 수로 나누기)라서 숫자 배열만으로는 소수점의 자리를 정할 수 없다. 나누는 수의 10배, 100배와 견주어 어림해야 한다.
        //  나누어지는 수의 소수점 아래 자리 수(두 자리)를 그대로 따라 찍는 아이는 맞지만, 숫자 배열의 길이만 보고 찍는 아이(11.34를 1.134나 113.4로)는 걸린다.
        const m = d.until(() => { const c = d.until(() => d.int(11, 39), (w) => w % 10 !== 0), q = qd(d, 112, 9889, 2); return { c, q, x: times(q, c) }; }, (w) => w.x.k === 2 && w.x.n < 100000 && w.x.n >= 1000);
        const lo = V(m.q) < 10 ? 1 : 10;
        return D(`계산기로 ${S(m.x)} ÷ ${josa(m.c, '을/를')} 계산한 몫을 옮겨 적다가 소수점을 빠뜨리고 ${josa(m.q.n, '이라고/라고')} 적었다. 어림하여 몫을 바르게 나타내면?`, V(m.q), {
          explain: `${m.c} × ${lo} = ${m.c * lo}, ${m.c} × ${lo * 10} = ${m.c * lo * 10}이므로 몫은 ${lo}보다 크고 ${lo * 10}보다 작다. ${m.q.n}에 소수점을 찍어 이 사이의 수를 만들면 ${S(m.q)}이다.`,
          facts: { calc: [[`${S(m.x)}/${m.c}`, 0]] }
        });
      }),
      H('hard-hidden', '문장제: 글에 숨은 나누는 수 찾기', '심55·56·63 / 기본 ①52', (d, n) => {
        // 함정: 나누는 수가 글에 숫자로 적혀 있지 않다. 「친구 3명과 함께」를 3으로, 「한 시간」을 1로, 「50분 동안 → 10분 동안」을 50이나 10으로 나누는 아이가 걸린다.
        if (n === 0) {
          const k = d.int(2, 5), v = gen(d, [k + 1], () => qd(d, 12, 98, 2), (w) => w.x.k >= 1 && plainQ(w.q)), p = d.pick(NAMES);
          return dAns(`${name(p, '은/는')} 친구 ${k}명과 함께 주스 ${S(v.x)} L를 남김없이 똑같이 나누어 마셨다. 한 명이 마신 주스는 몇 L인가?`, v.q, `${S(v.x)}/(${k}+1)`, {
            unit: 'L', explain: `${name(p, '과/와')} 친구 ${k}명이므로 마신 사람은 모두 ${k + 1}명이다. ${told(v.x, k + 1)}(L)이다.`, facts: { unseen: [1] }
          });
        }
        if (n === 1) {
          const a = d.pick([3, 9, 15, 21, 27, 33, 39, 45, 51, 57]), r = quo(nat(a), 60);
          return dAns(`한 시간에 ${a} cm씩 일정한 빠르기로 타는 양초가 있다. 이 양초가 1분 동안 타는 길이는 몇 cm인가?`, r, `${a}/60`, {
            unit: 'cm', explain: `한 시간은 60분이다. 1분 동안 타는 길이는 ${a} ÷ 60 = ${S(r)}(cm)이다. 나누어지는 수가 나누는 수보다 작으므로 몫은 1보다 작다.`, facts: { unseen: [60] }
          });
        }
        const m = d.pick([20, 30, 40, 50, 60]), c = m / 10, v = gen(d, [c], () => qd(d, 105, 395, 2), (w) => w.x.k >= 1);
        return dAns(`일정한 빠르기로 ${m}분 동안 ${S(v.x)} km를 가는 자전거가 있다. 이 자전거가 같은 빠르기로 10분 동안 가는 거리는 몇 km인가?`, v.q, `${S(v.x)}/(${m}/10)`, {
          unit: 'km', explain: `${m}분은 10분의 ${c}배이므로 10분 동안 가는 거리는 ${m}분 동안 가는 거리를 ${josa(c, '으로/로')} 나눈 몫이다. ${told(v.x, c)}(km)이다.`
        });
      }, { count: 3 }),
      H('hard-times-swap', '문장제: 기준이 먼저 나오는 「몇 배」', '심54 / 기본 ②61 ③61', (d) => {
        // 함정: 기준이 되는 양(나누는 수)이 문장에 먼저 나온다. 먼저 나온 수를 나누어지는 수로 삼는 아이, 큰 수를 작은 수로 나누는 아이가 걸린다(몫이 1보다 작을 때가 많다).
        const v = d.bool() ? natPair(d, [4, 5, 8], d.pick([1, 2]), (w) => w.x.n < w.c && w.x.n >= 2) : gen(d, C29, () => (d.bool() ? qd(d, 62, 98, 2) : qd(d, 104, 148, 2)), (w) => w.x.k >= 1);
        return qAns(`빨간색 테이프의 길이는 ${v.c} m이고 파란색 테이프의 길이는 ${S(v.x)} m이다. 파란색 테이프의 길이는 빨간색 테이프의 길이의 몇 배인가?`, v.x, v.c, {
          unit: '배', explain: `기준이 되는 빨간색 테이프의 길이로 나눈다. ${told(v.x, v.c)}(배)이다.${V(v.q) < 1 ? ' 파란색 테이프가 더 짧으므로 1배보다 작다.' : ''}`
        });
      }),
      H('hard-extra', '문장제: 쓰지 않는 수가 섞인 똑같이 나누기', '기본 ①52 ②59 ③57', (d) => {
        // 함정: 걸은 시간(분)은 쓰지 않는 조건이다. 적힌 수를 차례로 모두 쓰는 아이, 큰 수로 나누는 아이가 걸린다.
        const days = d.int(3, 9), mins = d.pick([20, 30, 40, 50]), v = gen(d, [days], () => qd(d, 112, 348, 2), (w) => w.x.k >= 1), p = d.pick(NAMES);
        return qAns(`${name(p, '은/는')} ${days}일 동안 매일 ${mins}분씩 걸어서 모두 ${S(v.x)} km를 걸었다. 매일 같은 거리를 걸었다면 하루에 걸은 거리는 몇 km인가?`, v.x, days, {
          unit: 'km', explain: `걸은 거리 ${S(v.x)} km를 걸은 날수 ${josa(days, '으로/로')} 나눈다. 걸은 시간은 쓰지 않는다. ${told(v.x, days)}(km)이다.`
        });
      }),
      H('hard-ratio', '숫자 배열이 같은 두 나눗셈의 몫은 몇 배', '기본 ②6 ①5 / 심3', (d) => {
        // 함정: 870과 8.7처럼 끝자리 0 때문에 숫자 배열이 한 자리 어긋나 보인다. 8.7이 소수 한 자리 수라고 「10배」라고 하는 아이가 걸린다(870은 8.7의 100배이다).
        const c = d.int(2, 9), a = d.until(() => c * d.int(3, 40), (w) => w >= 12 && w <= 98 && w % 10 !== 0), [big, small, ans] = d.pick([[a * 10, dec(a, 1), 100], [a * 10, dec(a, 2), 1000], [a, dec(a, 2), 100], [a * 100, dec(a, 1), 1000], [a * 10, dec(a, 1), 100]]), i = ix(small);
        return N('계산하지 않고 알아보려고 한다. ㉠의 몫은 ㉡의 몫의 몇 배인가?', ans, {
          unit: '배', figure: tagged([eq(big, '/', c), eq(S(small), '/', c)], LAB.slice(0, 2)),
          explain: `${josa(big, '은/는')} ${S(small)}의 ${ans}배이다. 나누는 수가 같을 때 나누어지는 수가 ${ans}배이면 몫도 ${ans}배이다.`,
          facts: { calc: [[`${big}*${P10[small.k]}/${i.s}`, 0]], unseen: i.un.concat([P10[small.k]]) }
        });
      }),
      H('hard-move-mix', '끝자리가 0인 자연수의 나눗셈으로 몫 구하기', '심1·20 / 기본 ①4·7 ②3·4', (d) => {
        // 함정: 1470 ÷ 6 = 245 에서 147은 1470의 1/10배이고 14.7은 1/100배이다. 소수점 아래 자리 수만 세어 14.7을 「1/10배」라고 하는 아이(24.5),
        //  147은 소수가 아니니 몫도 245 그대로라고 하는 아이가 걸린다.
        const v = gen(d, [2, 4, 5, 6, 8], () => qd(d, 112, 995, 2), (w) => w.x.k === 1 && plainQ(w.q) && w.x.n >= 100 && w.x.n < 1000), a = v.x.n, Q = v.q.n, rs = [dec(Q, 1), dec(Q, 2)];
        return M(`${a * 10} ÷ ${v.c} = ${Q}이다. ㉠, ㉡에 알맞은 수는?`, rs.map((r, j) => inp(LAB[j], r)), {
          figure: lines([eq(a, '/', v.c, '=', box(LAB[0])), eq(fx(a, 1), '/', v.c, '=', box(LAB[1]))]),
          explain: `${josa(a, '은/는')} ${a * 10}의 ${part(1)}배이고 ${dj(fx(a, 1), '은/는')} ${a * 10}의 ${part(2)}배이다. 몫도 ${Q}의 ${part(1)}배, ${part(2)}배인 ${rs.map(S).join(', ')}이다.`,
          facts: { calc: [[`${a}/${v.c}`, 0], [`${fx(a, 1)}/${v.c}`, 1]], rule: 'moveMix' }
        });
      }),
      H('hard-fit', '나눗셈식에 알맞은 상황 고르기', '기본 ②66 ③73 ①55', (d) => {
        // 보기마다 고르는 아이: 곱셈 상황 — 수가 둘이면 주어진 식에 맞다고 여기는 아이, 거꾸로 된 몇 배 — 나누어지는 수와 나누는 수를 가리지 않는 아이, 뺄셈 상황 — 「덜어 낸다」를 나눗셈으로 읽는 아이.
        const v = gen(d, [2, 3, 4, 5, 6], () => qd(d, 12, 39, 1), (w) => w.x.k === 1 && V(w.x) > w.c + 1), x = S(v.x), share = d.bool();
        const rows = d.shuffle([
          [share ? `끈 ${x} m를 ${v.c}명이 똑같이 나누어 가질 때 한 명이 가지는 끈의 길이` : `길이가 ${x} m인 끈은 길이가 ${v.c} m인 끈의 몇 배인지 나타내는 수`, true],
          [`한 도막의 길이가 ${x} m인 끈 ${v.c}도막을 겹치지 않게 이은 전체 길이`, false],
          [`길이가 ${v.c} m인 끈은 길이가 ${x} m인 끈의 몇 배인지 나타내는 수`, false],
          [`길이가 ${x} m인 끈에서 ${v.c} m를 잘라 내고 남은 끈의 길이`, false]
        ]);
        return C(`다음 가운데 ${x} ÷ ${josa(v.c, '으로/로')} 구할 수 있는 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
          explain: `${x} ÷ ${josa(v.c, '은/는')} ${J(v.x, '을/를')} 똑같이 ${josa(v.c, '으로/로')} 나눈 한 몫이고, ${J(v.x, '이/가')} ${v.c}의 몇 배인지 나타내는 수이다. 전체 길이는 ${x} × ${v.c}, 거꾸로 된 몇 배는 ${v.c} ÷ ${x}, 남은 길이는 ${x} − ${v.c}로 구한다.`,
          facts: { truth: rows.map((row) => row[1]), want: true }
        });
      }),
      H('hard-digit-second', '몫보다 작은 소수의 □ 안에 들어갈 수 있는 숫자', '심38 / 기본 ①39 ②54', (d) => {
        // 함정: 몫은 W.fg 이고 오른쪽 수의 소수 둘째 자리 e 는 g 보다 크다. 소수 첫째 자리만 견주어 □에 f 도 넣는 아이가 걸린다(f 를 넣으면 오른쪽 수가 더 크다).
        const v = gen(d, C29, () => ({ n: d.int(1, 9) * 100 + d.int(2, 8) * 10 + d.int(1, 7), k: 2 }), (w) => w.x.k >= 1), W = Math.floor(v.q.n / 100), f = Math.floor(v.q.n / 10) % 10, g = v.q.n % 10, e = d.int(g + 1, 9), i = ix(v.x);
        return N('0부터 9까지의 수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', f, {
          unit: '개', figure: eq(S(v.x), '/', v.c, '>', `${W}.${box()}${e}`),
          explain: `${told(v.x, v.c)}이다. □ 안에 ${josa(f, '을/를')} 넣으면 ${W}.${f}${e}${dj(String(e), '이/가').slice(-1)} 되어 ${S(v.q)}보다 크다. □ 안에는 ${f}보다 작은 수 ${Array.from({ length: f }, (_, j) => j).join(', ')}만 들어갈 수 있으므로 ${f}개이다.`,
          facts: { digit: { template: `${i.s}*${P10[2 - v.x.k]}>(${W}*100+□*10+${e})*${v.c}`, lo: 0, hi: 9, ask: 'count' } }
        });
      }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-wrong-any', '잘못 계산한 어떤 수를 구해 바르게 계산하기', '심48·49 / 기본 ①45 ②52 ③55', (d, n) => {
        // 첫째 문항은 나누어야 할 것을 곱한 경우, 둘째 문항은 나누어야 할 것을 더한 경우.
        if (n === 0) {
          const m = d.until(() => { const c = d.int(2, 9), r = qd(d, 12, 298, 2), any = mulN(r, c); return { c, r, any, got: mulN(any, c) }; }, (w) => w.got.n < 10000 && w.any.k >= 1 && w.got.k >= 1);
          return dAns(`어떤 수를 ${josa(m.c, '으로/로')} 나누어야 할 것을 잘못하여 ${josa(m.c, '을/를')} 곱하였더니 ${J(m.got, '이/가')} 되었다. 바르게 계산한 값은?`, m.r, `${S(m.got)}/${m.c}/${m.c}`, {
            explain: `어떤 수는 ${S(m.got)} ÷ ${m.c} = ${S(m.any)}이다. 바르게 계산하면 ${S(m.any)} ÷ ${m.c} = ${S(m.r)}이다.`
          });
        }
        const m = d.until(() => { const c = d.int(2, 9), r = qd(d, 112, 989, 2), any = mulN(r, c); return { c, r, any, got: plus(any, nat(c)) }; }, (w) => w.any.k >= 1 && w.any.n < 10000);
        return dAns(`어떤 수를 ${josa(m.c, '으로/로')} 나누어야 할 것을 잘못하여 ${josa(m.c, '을/를')} 더하였더니 ${J(m.got, '이/가')} 되었다. 바르게 계산한 값은?`, m.r, `(${S(m.got)}-${m.c})/${m.c}`, {
          explain: `어떤 수는 ${S(m.got)} − ${m.c} = ${S(m.any)}이다. 바르게 계산하면 ${S(m.any)} ÷ ${m.c} = ${S(m.r)}이다.`
        });
      }, { count: 2 }),
      H('hard-any-then', '몫에서 어떤 수를 되찾아 다른 수로 나누기', '심47 / 기본 ③56', (d) => {
        const m = d.until(() => { const a = d.int(2, 9), b = d.int(2, 9), r = qd(d, 112, 989, 2), any = mulN(r, b); return { a, b, r, any, mid: quo(any, a) }; }, (w) => w.a !== w.b && w.mid && w.mid.k >= 1 && w.mid.k <= 2 && w.any.n < 10000);
        return dAns(`어떤 수를 ${josa(m.a, '으로/로')} 나누었더니 몫이 ${J(m.mid, '이/가')} 되었다. 어떤 수를 ${josa(m.b, '으로/로')} 나눈 몫은?`, m.r, `${S(m.mid)}*${m.a}/${m.b}`, {
          explain: `어떤 수는 ${S(m.mid)} × ${m.a} = ${S(m.any)}이다. ${S(m.any)} ÷ ${m.b} = ${S(m.r)}이다.`
        });
      }),
      H('hard-between', '두 몫 사이에 있는 자연수', '심37 / 기본 ①38 ③46', (d) => {
        // 왼쪽 몫이 1보다 작은 경우도 있다(0.65 < □ 이면 1부터 들어간다).
        const m = d.until(() => { const cs = d.shuffle(C29).slice(0, 2), q1 = d.bool() ? qd(d, 12, 98, 2) : qd(d, 112, 598, 2), q2 = dec(q1.n * P10[2 - q1.k] + d.int(230, 560), 2); return { rows: [{ c: cs[0], q: q1, x: times(q1, cs[0]) }, { c: cs[1], q: q2, x: times(q2, cs[1]) }] }; }, (w) => w.rows.every((v) => v.x.k >= 1 && v.x.n < 10000 && v.q.k >= 1));
        const [l, r] = m.rows, lo = Math.floor(V(l.q)) + 1, hi = Math.floor(V(r.q)), il = ix(l.x), ir = ix(r.x);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', hi - lo + 1, {
          unit: '개', figure: lines([eq(S(l.x), '/', l.c, '<', box(), '<', S(r.x), '/', r.c)]),
          explain: `${told(l.x, l.c)}, ${told(r.x, r.c)}이다. □는 ${S(l.q)}보다 크고 ${S(r.q)}보다 작은 자연수이므로 ${lo}부터 ${hi}까지 ${hi - lo + 1}개이다.`,
          facts: { digit: { template: `${il.s}*${P10[2 - l.x.k]}*${r.c}<□*100*${l.c}*${r.c}<${ir.s}*${P10[2 - r.x.k]}*${l.c}`, lo: 1, hi: hi + 3, ask: 'count' } }
        });
      }),
      H('hard-divisor-box', '몫이 기준 수보다 작아지는 가장 작은 나누는 수', '심29', (d) => {
        // 나눗셈을 곱셈으로 뒤집어 생각한다: □ × (기준 수)가 나누어지는 수보다 커야 한다.
        const Tn = d.int(3, 9), x = d.until(() => qd(d, 1205, 6895, 2), (w) => w.n % (Tn * 100) !== 0 && Math.floor(w.n / (Tn * 100)) >= 2 && Math.floor(w.n / (Tn * 100)) <= 14), k = Math.floor(x.n / (Tn * 100)) + 1, i = ix(x);
        return N('□ 안에 들어갈 수 있는 가장 작은 자연수는?', k, {
          figure: eq(S(x), '/', box(), '<', Tn),
          explain: `몫이 ${Tn}보다 작으려면 □ × ${josa(Tn, '이/가')} ${S(x)}보다 커야 한다. ${k - 1} × ${Tn} = ${(k - 1) * Tn}, ${k} × ${Tn} = ${k * Tn}이므로 □ 안에 들어갈 수 있는 가장 작은 자연수는 ${k}이다.`,
          facts: { digit: { template: `${i.s}<□*${Tn}*100`, lo: 1, hi: k + 3, ask: 'min' } }
        });
      }),
      H('hard-cards', '수 카드로 몫이 가장 큰(작은) (소수)÷(자연수) 만들기', '심42 / 기본 ①42 ②56 ③53', (d) => {
        // 몫이 가장 크려면 나누어지는 수는 가장 크게, 나누는 수는 가장 작게 한다. 가장 작으려면 그 반대이다.
        const big = d.bool(), s = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, q) => p - q), (w) => { const r = big ? quo(dec(w[2] * 10 + w[1], 1), w[0]) : quo(dec(w[0] * 10 + w[1], 1), w[2]); return r && r.k <= 2; });
        const [top, low, c] = big ? [s[2], s[1], s[0]] : [s[0], s[1], s[2]], x = dec(top * 10 + low, 1), r = quo(x, c);
        return dAns(`수 카드 3장을 한 번씩 모두 사용하여 다음과 같은 나눗셈식을 만들려고 한다. 몫이 가장 ${big ? '클' : '작을'} 때의 몫은?`, r, `(${top}*10+${low})/10/${c}`, {
          figure: cards(d.shuffle(s)) + eq(`${box()}.${box()}`, '/', box()),
          explain: `몫이 가장 ${big ? '크려면 나누어지는 수를 가장 크게, 나누는 수를 가장 작게' : '작으려면 나누어지는 수를 가장 작게, 나누는 수를 가장 크게'} 한다. ${told(x, c)}이다.`,
          facts: { unseen: [10] }
        });
      }),
      H('hard-mix-net', '문장제: 더하거나 뺀 뒤 똑같이 나누기', '심58·60 / 기본 ①61 ②67 ③69', (d, n) => {
        if (n === 0) {
          // 섞은 다음 똑같이 나눈다.
          const m = d.until(() => { const c = d.int(3, 9), r = qd(d, 112, 298, 2), sum = mulN(r, c), a = qd(d, 205, 995, 2); return { c, r, sum, a, b: plus(sum, a, -1) }; }, (w) => w.sum.k >= 1 && w.b.n > 0 && V(w.b) >= 2 && w.b.k >= 1);
          return dAns(`쌀 ${S(m.a)} kg과 보리 ${S(m.b)} kg을 섞어서 봉지 ${m.c}개에 똑같이 나누어 담았다. 한 봉지에 담은 곡식은 몇 kg인가?`, m.r, `(${S(m.a)}+${S(m.b)})/${m.c}`, {
            unit: 'kg', explain: `섞은 곡식은 ${S(m.a)} + ${S(m.b)} = ${S(m.sum)}(kg)이다. 한 봉지에 담은 곡식은 ${S(m.sum)} ÷ ${m.c} = ${S(m.r)}(kg)이다.`
          });
        }
        // 그릇의 무게를 뺀 다음 개수로 나눈다.
        const m = d.until(() => { const c = d.int(3, 9), r = qd(d, 12, 98, 2), net = mulN(r, c), e = qd(d, 15, 85, 2); return { c, r, net, e, full: plus(net, e) }; }, (w) => w.net.k >= 1 && w.full.k >= 1);
        return dAns(`무게가 같은 구슬 ${m.c}개를 상자에 담아 무게를 재었더니 ${S(m.full)} kg이었다. 빈 상자의 무게가 ${S(m.e)} kg일 때, 구슬 한 개의 무게는 몇 kg인가?`, m.r, `(${S(m.full)}-${S(m.e)})/${m.c}`, {
          unit: 'kg', explain: `구슬 ${m.c}개의 무게는 ${S(m.full)} − ${S(m.e)} = ${S(m.net)}(kg)이다. 구슬 한 개의 무게는 ${S(m.net)} ÷ ${m.c} = ${S(m.r)}(kg)이다.`
        });
      }, { count: 2 }),
      H('hard-gather', '문장제: 모은 다음 다시 똑같이 나누기', '심58 / 기본 ②68', (d) => {
        const m = d.until(() => { const c = d.int(3, 9), k = d.int(3, 8), r = qd(d, 105, 395, 2), total = mulN(r, c); return { c, k, r, total, u: quo(total, k) }; }, (w) => w.c !== w.k && w.u && w.u.k >= 1 && w.u.k <= 2 && V(w.u) > 1);
        return dAns(`한 상자에 ${S(m.u)} kg씩 담은 밀가루 ${m.k}상자를 모두 모아 봉지 ${m.c}개에 똑같이 나누어 담았다. 한 봉지에 담은 밀가루는 몇 kg인가?`, m.r, `${S(m.u)}*${m.k}/${m.c}`, {
          unit: 'kg', explain: `밀가루는 모두 ${S(m.u)} × ${m.k} = ${S(m.total)}(kg)이다. 한 봉지에 담은 밀가루는 ${S(m.total)} ÷ ${m.c} = ${S(m.r)}(kg)이다.`
        });
      }),
      H('hard-pack', '문장제: 묶음 속 낱개 하나의 무게', '심57 / 기본 ①62', (d) => {
        // 봉지 수로 한 번, 한 봉지에 든 개수로 한 번 나눈다. 봉지 수로만 나누면 한 봉지의 무게이다.
        const m = d.until(() => { const a = d.int(3, 6), b = d.int(2, 8), r = dec(d.int(6, 18), 2), bag = mulN(r, a); return { a, b, r, bag, x: mulN(bag, b) }; }, (w) => w.a !== w.b && w.bag.k >= 1 && w.x.k >= 1);
        return dAns(`귤이 한 봉지에 ${m.a}개씩 들어 있다. ${m.b}봉지에 들어 있는 귤의 무게가 모두 ${S(m.x)} kg일 때, 귤 한 개의 무게는 몇 kg인가? (귤의 무게는 모두 같다.)`, m.r, `${S(m.x)}/${m.b}/${m.a}`, {
          unit: 'kg', explain: `한 봉지의 무게는 ${S(m.x)} ÷ ${m.b} = ${S(m.bag)}(kg)이다. 한 봉지에 ${m.a}개씩 들어 있으므로 귤 한 개의 무게는 ${S(m.bag)} ÷ ${m.a} = ${S(m.r)}(kg)이다.`
        });
      }),
      H('hard-unit-then', '문장제: 한 개의 양을 구해 몇 개 모으기', '심62', (d) => {
        const m = d.until(() => { const c = d.int(4, 9), k = d.int(2, 7), u = qd(d, 12, 148, 2); return { c, k, u, x: mulN(u, c), r: mulN(u, k) }; }, (w) => w.c !== w.k && w.x.k >= 1 && w.r.k >= 1);
        return dAns(`무게가 같은 책 ${m.c}권의 무게가 ${S(m.x)} kg이다. 이 책 ${m.k}권의 무게는 몇 kg인가?`, m.r, `${S(m.x)}/${m.c}*${m.k}`, {
          unit: 'kg', explain: `책 한 권의 무게는 ${S(m.x)} ÷ ${m.c} = ${S(m.u)}(kg)이다. ${m.k}권의 무게는 ${S(m.u)} × ${m.k} = ${S(m.r)}(kg)이다.`
        });
      }),
      H('hard-two-shares', '문장제: 한 개의 무게를 구해 어느 쪽이 얼마나 더 무거운지 알기', '심65 / 기본 ①60 ②70 ③68', (d) => {
        // 전체가 무거운 쪽의 한 개가 더 무거운 것은 아니다. 틀린 보기: 가벼운 쪽, 전체 무게끼리의 차
        const m = d.until(() => { const cs = d.shuffle(C29).slice(0, 2), q1 = qd(d, 205, 895, 2), q2 = dec(q1.n + d.pick([-1, 1]) * d.int(3, 45), 2); return [{ c: cs[0], q: q1, x: times(q1, cs[0]) }, { c: cs[1], q: q2, x: times(q2, cs[1]) }]; },
          (w) => w.every((v) => v.q.n > 0 && v.x.k >= 1 && v.x.n < 10000) && V(w[0].x) !== V(w[1].x) && (V(w[0].x) > V(w[1].x)) === (V(w[0].q) < V(w[1].q)) && Math.round(Math.abs(V(w[0].x) - V(w[1].x)) * 100) !== Math.round(Math.abs(V(w[0].q) - V(w[1].q)) * 100));
        const cents = (v) => v.q.n * P10[2 - v.q.k], vals = m.map(cents), winner = vals[0] > vals[1] ? 0 : 1, gap = Math.abs(vals[0] - vals[1]), other = Math.abs(m[0].x.n * P10[2 - m[0].x.k] - m[1].x.n * P10[2 - m[1].x.k]), names = ['노란색', '파란색'];
        const list = d.shuffle([[0, gap], [1, gap], [0, other], [1, other]]), exprs = m.map((v) => { const i = ix(v.x); return `${i.s}*${P10[2 - v.x.k]}/${v.c}`; }), un = m.reduce((all, v) => all.concat(ix(v.x).un, [P10[2 - v.x.k]]), []);
        return C(`노란색 구슬 ${m[0].c}개의 무게는 ${S(m[0].x)} g이고, 파란색 구슬 ${m[1].c}개의 무게는 ${S(m[1].x)} g이다. 같은 색 구슬끼리는 무게가 같을 때, 어느 색 구슬 한 개가 몇 g 더 무거운가?`, list.map(([who, g]) => `${names[who]} 구슬, ${S(dec(g, 2))} g`), list.findIndex(([who, g]) => who === winner && g === gap), {
          explain: `노란색 구슬 한 개는 ${told(m[0].x, m[0].c)}(g), 파란색 구슬 한 개는 ${told(m[1].x, m[1].c)}(g)이다. ${names[winner]} 구슬 한 개가 ${S(dec(gap, 2))} g 더 무겁다.`,
          facts: { who: { values: vals, exprs, options: list }, unseen: un }
        });
      }),
      H('hard-same-perimeter', '둘레가 같은 두 정다각형의 한 변의 길이', '심70 / 기본 ②68', (d) => {
        const m = d.until(() => { const [A, Bp] = d.shuffle(POLY).slice(0, 2), s = d.bool() ? qd(d, 21, 98, 1) : qd(d, 105, 495, 2), per = mulN(s, A[1]); return { A, Bp, s, per, r: quo(per, Bp[1]) }; }, (w) => w.r && w.r.k >= 1 && w.r.k <= 2 && w.per.k >= 1);
        return dAns(`한 변의 길이가 ${S(m.s)} cm인 ${m.A[0]}과 둘레가 같은 ${m.Bp[0]}이 있다. 이 ${m.Bp[0]}의 한 변의 길이는 몇 cm인가?`, m.r, `${S(m.s)}*${m.A[1]}/${m.Bp[1]}`, {
          unit: 'cm', explain: `${m.A[0]}의 둘레는 ${S(m.s)} × ${m.A[1]} = ${S(m.per)}(cm)이다. ${m.Bp[0]}은 변이 ${m.Bp[1]}개이므로 한 변의 길이는 ${S(m.per)} ÷ ${m.Bp[1]} = ${S(m.r)}(cm)이다.`,
          facts: { unseen: [m.A[1], m.Bp[1]] }
        });
      }),
      H('hard-wire', '철사로 만든 정다각형 여러 개의 한 변의 길이', '심69', (d) => {
        // 도형의 수로 한 번, 변의 수로 한 번 나눈다. 도형의 수로만 나누면 도형 한 개의 둘레이다.
        const m = d.until(() => { const [shape, sides] = d.pick(POLY.slice(0, 3)), k = d.int(2, 4), r = qd(d, 12, 198, 2), one = mulN(r, sides); return { shape, sides, k, r, one, x: mulN(one, k) }; }, (w) => w.k !== w.sides && w.one.k >= 1);
        return dAns(`길이가 ${S(m.x)} m인 철사를 남김없이 사용하여 크기가 같은 ${m.shape} ${m.k}개를 만들었다. 만든 ${m.shape}의 한 변의 길이는 몇 m인가?`, m.r, `${S(m.x)}/${m.k}/${m.sides}`, {
          unit: 'm', explain: `${m.shape} 한 개를 만드는 데 사용한 철사는 ${S(m.x)} ÷ ${m.k} = ${S(m.one)}(m)이다. ${m.shape}은 변이 ${m.sides}개이므로 한 변의 길이는 ${S(m.one)} ÷ ${m.sides} = ${S(m.r)}(m)이다.`,
          facts: { unseen: [m.sides] }
        });
      }),
      H('hard-paint', '문장제: 넓이를 구해 1 m²에 해당하는 양 구하기', '심77 / 기본 ①65', (d) => {
        // 나누는 수는 가로나 세로가 아니라 넓이이다.
        const m = d.until(() => { const a = d.int(2, 4), b = d.int(2, 4), r = qd(d, 12, 48, 2); return { a, b, r, x: mulN(r, a * b) }; }, (w) => w.a !== w.b && w.x.k >= 1);
        return dAns(`가로가 ${m.a} m, 세로가 ${m.b} m인 직사각형 모양의 담장을 모두 칠하는 데 페인트 ${S(m.x)} L를 사용하였다. 담장 1 m²를 칠하는 데 사용한 페인트는 몇 L인가?`, m.r, `${S(m.x)}/(${m.a}*${m.b})`, {
          unit: 'L', explain: `담장의 넓이는 ${m.a} × ${m.b} = ${m.a * m.b}(m²)이다. 1 m²를 칠하는 데 사용한 페인트는 ${S(m.x)} ÷ ${m.a * m.b} = ${S(m.r)}(L)이다.`
        });
      }),
      H('hard-shaded', '똑같이 나눈 도형에서 색칠한 부분의 넓이', '심76 / 기본 ①57 ③66', (d) => {
        // 나눈 칸 수와 색칠한 칸 수는 그림에서 센다. 색칠한 칸은 흩어져 있다.
        const [rows, cols] = d.pick([[2, 3], [2, 4], [3, 3]]), parts = rows * cols, k = d.int(2, parts === 6 ? 3 : 4);
        const on = d.until(() => d.shuffle(Array.from({ length: parts }, (_, i) => i)).slice(0, k).sort((p, q) => p - q), (list) => list.some((v, i) => i > 0 && v - list[i - 1] > 1));
        const m = d.until(() => { const u = qd(d, 105, 895, 2); return { u, x: mulN(u, parts), r: mulN(u, k) }; }, (w) => w.x.k >= 1 && w.r.k >= 1 && w.x.n < 10000);
        return dAns(`넓이가 ${S(m.x)} m²인 직사각형 모양의 텃밭을 그림과 같이 똑같이 나누고 몇 칸을 색칠하였다. 색칠한 부분의 넓이는 몇 m²인가?`, m.r, `${S(m.x)}/${parts}*${k}`, {
          unit: 'm²', figure: shadeGrid(rows, cols, on),
          explain: `텃밭을 똑같이 ${parts}칸으로 나누었으므로 한 칸의 넓이는 ${S(m.x)} ÷ ${parts} = ${S(m.u)}(m²)이다. 색칠한 부분은 ${k}칸이므로 ${S(m.u)} × ${k} = ${S(m.r)}(m²)이다.`
        });
      }),
      H('hard-line', '수직선에서 똑같이 나눈 눈금이 나타내는 수', '심82 / 기본 ②79 ③51', (d) => {
        // 두 끝의 차를 칸 수로 나누어 한 칸의 크기를 구한 다음, 왼쪽 끝에서 몇 칸 갔는지 센다.
        const m = d.until(() => { const parts = d.pick([4, 5, 6, 8]), step = qd(d, 12, 195, 2), a = d.bool() ? nat(d.int(2, 30)) : qd(d, 12, 98, 1), k = d.int(1, parts - 1); return { parts, step, a, k, b: plus(a, mulN(step, parts)), r: plus(a, mulN(step, k)) }; }, (w) => w.r.k >= 1 && w.b.k <= 1);
        const gap = plus(m.b, m.a, -1);
        return dAns(`수직선에서 ${J(m.a, '과/와')} ${S(m.b)} 사이를 똑같이 ${m.parts}칸으로 나누었다. ㉠이 나타내는 수는?`, m.r, `${S(m.a)}+(${S(m.b)}-${S(m.a)})/${m.parts}*${m.k}`, {
          figure: stepLine(S(m.a), S(m.b), m.parts, [m.k, '㉠']),
          explain: `두 수의 차는 ${S(m.b)} − ${S(m.a)} = ${S(gap)}이므로 작은 눈금 한 칸의 크기는 ${S(gap)} ÷ ${m.parts} = ${S(m.step)}이다. ㉠은 ${S(m.a)}에서 ${m.k}칸 간 곳이므로 ${S(m.a)} + ${S(m.step)} × ${m.k} = ${S(m.r)}이다.`
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
