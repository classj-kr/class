// 6학년 1학기 3단원 소수의 나눗셈 — 어림하여 몫의 소수점 자리 찾기, 몫의 크기 비교와 조건에 맞는 수, 소수의 나눗셈의 활용(문장제·도형·수직선).
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 6-1-3a.js 에 있다. 실력 문항은 6-1-3c.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 수 하나·검사 식·그림 도우미는 6-1-3a.js 의 것을 그대로 옮겨 적었다(파일마다 따로 닫혀 있어 함께 쓸 수 없다).
// 교육과정: 「소수의 곱셈과 나눗셈에서 … 어림셈이 필요한 여러 가지 실생활 상황을 제시하여 어림셈의 필요성과 유용성을 알게 한다.」 — 어림으로 몫의 소수점 자리 찾기,
//   어림한 식, 기준 수와 견주기, 한 몫이 기준보다 많은지 판단하기를 「어림하여 몫의 소수점 자리 찾기」 한 묶음에 모았다.
// 문장제는 얼개마다 한 번씩 싣는다: 똑같이 나누기(소수·자연수), 한 개의 무게(몫이 1보다 작다), 하나에 해당하는 양(시간·휘발유), 일주일, 몇 배, 평균, 정다각형의 한 변,
//   넓이와 한 변, 똑같이 나눈 도형의 한 칸, 수직선의 눈금 한 칸.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, lines, chain, numbers, cards, table, pieces, N, M, C, D } = B.kit;
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

  // ── 견주기에 쓰는 것 ──
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;
  const div = (v) => eq(S(v.x), '/', v.c);
  // 단위 기호 뒤 토씨(읽는 소리대로): m·cm·km·L·mL·m² 는 받침 없음, g·kg 은 받침 있음
  const uj = (unit, pair) => unit + pair.split('/')[/g$/.test(unit) ? 0 : 1];
  // 여러 몫을 견줄 때의 정수 식: 몫 x ÷ c 마다 다른 줄의 나누는 수를 모두 곱한다(c 가 1이면 수 하나). 자리 수는 가장 많은 쪽에 맞춘다.
  const cross = (rows) => {
    const K = Math.max(...rows.map((r) => r.x.k)), list = rows.map((r) => ix(r.x)), others = (i) => rows.filter((_, j) => j !== i).map((r) => r.c);
    return {
      exprs: rows.map((r, i) => [list[i].s].concat(K > r.x.k ? [String(P10[K - r.x.k])] : [], others(i).map(String)).join('*')),
      values: rows.map((r, i) => r.x.n * P10[K - r.x.k] * others(i).reduce((m, c) => m * c, 1)),
      un: list.reduce((all, p) => all.concat(p.un), []).concat(rows.map((r) => P10[K - r.x.k]), [1])
    };
  };
  // 몫이 서로 가깝고(한가운데 값에서 spread 안쪽) 모두 다른 나눗셈 count 개. 몫은 소수 둘째 자리까지, 나누는 수는 서로 다르다.
  const nearRows = (d, count, lo, hi, spread) => d.until(() => { const v0 = d.int(lo, hi), w = Math.max(6, Math.round(v0 * spread)); return d.shuffle(C29).slice(0, count).map((c) => { const q = dec(v0 + d.int(-w, w), 2); return { c, q, x: times(q, c) }; }); },
    (list) => list.every((v) => v.q.n > 0 && v.x.k >= 1 && v.x.n < 10000) && new Set(list.map((v) => V(v.q))).size === list.length);
  const orderChoice = (d, values, labels, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };
  // 숫자 사이에 소수점을 찍을 자리(㉠㉡㉢)를 적은 수
  const spots = (text) => ex(String(text).split('').map((ch, i) => (i ? `<span style="font-size:0.7em;color:#1d4ed8;margin:0 2px;vertical-align:-0.4em">${LAB[i - 1]}</span>` : '') + ch).join(''));
  // 수직선: 왼쪽 끝과 오른쪽 끝(글) 사이를 parts 칸으로 똑같이 나눈다. mark: [왼쪽 끝에서 센 눈금 수, 이름표]
  function stepLine(left, right, parts, mark) {
    const u = 236 / parts, x = (i) => (32 + i * u).toFixed(1), y = 40, word = 'style="font-size:13px;font-weight:600"';
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(parts)}" y2="${y}"/>`;
    for (let i = 0; i <= parts; i += 1) { const len = i === 0 || i === parts ? 7 : 4.5; out += `<line class="mb-axis" x1="${x(i)}" y1="${y - len}" x2="${x(i)}" y2="${y + len}"/>`; }
    out += `<text class="mb-axis-label" ${word} x="${x(0)}" y="${y + 24}" text-anchor="middle">${left}</text><text class="mb-axis-label" ${word} x="${x(parts)}" y="${y + 24}" text-anchor="middle">${right}</text>`;
    if (mark) out += `<text class="mb-axis-label" ${word} x="${x(mark[0])}" y="${y - 21}" text-anchor="middle">${mark[1]}</text><path class="mb-pointer" d="M${x(mark[0])} ${y - 8}l-4 -9h8z"/>`;
    return `<svg class="mb-numberline" viewBox="0 0 300 72" width="300" role="img" aria-label="수직선: ${dj(left, '과/와')} ${right} 사이를 똑같이 ${parts}칸으로 나누었다.${mark ? ` ${mark[1]}은 ${left}에서 작은 눈금 ${mark[0]}칸 간 곳` : ''}">${out}</svg>`;
  }

  // ── 어림하여 몫의 소수점 자리 찾기 ──
  B.addTypes('6-1-3', 'est', [
    T('est-expr', '가까운 자연수로 어림하여 몫 구하기', '①32 ②31 심24', (d, n) => {
      // 나누어지는 수를 가장 가까운 자연수로 어림하면 나누는 수로 나누어떨어진다(나누어지는 수와 그 자연수의 차는 0.5보다 작다).
      const m = d.until(() => { const c = d.int(3, 9), t = d.int(3, 9), q = dec(t * 100 + d.pick([-1, 1]) * d.int(1, Math.floor(46 / c)), 2); return { c, t, q, x: times(q, c) }; }, (w) => w.x.k >= 1), R = m.c * m.t;
      if (n === 0) {
        return M(`${S(m.x)} ÷ ${josa(m.c, '을/를')} 어림하여 계산하려고 한다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(R)), inp(LAB[1], nat(m.t))], {
          figure: lines([`${J(m.x, '을/를')} 가장 가까운 자연수로 어림하면 ${box(LAB[0])}이다.`, `${S(m.x)} ÷ ${m.c}의 몫은 약 ${box(LAB[0])} ÷ ${m.c} = ${box(LAB[1])}이다.`]),
          explain: `${J(m.x, '은/는')} ${R}에 가장 가깝다. ${R} ÷ ${m.c} = ${m.t}이므로 몫은 약 ${m.t}이다. 계산하면 ${told(m.x, m.c)}이다.`,
          facts: { calc: [[String(R), 0], [`${R}/${m.c}`, 1]], unseen: [R] }
        });
      }
      return N(`밀가루 ${S(m.x)} kg을 그릇 ${m.c}개에 똑같이 나누어 담으려고 한다. ${J(m.x, '을/를')} 가장 가까운 자연수로 어림하여 계산하면 그릇 한 개에 담는 밀가루는 약 몇 kg인가?`, m.t, {
        unit: 'kg', explain: `${J(m.x, '은/는')} ${R}에 가장 가깝다. ${R} ÷ ${m.c} = ${m.t}이므로 그릇 한 개에 담는 밀가루는 약 ${m.t} kg이다.`,
        facts: { calc: [[`${R}/${m.c}`, 0]], unseen: [R] }
      });
    }, { count: 2 }),
    T('est-pick', '어림하여 소수점의 위치가 맞는 몫 고르기', '①34 ②32 ③35·37 심25', (d, n) => {
      // 첫째 문항은 몫이 1보다 큰 것, 둘째 문항은 몫이 1보다 작은 것. 보기는 숫자 배열이 같고 소수점의 위치만 다르다.
      const v = n === 0 ? gen(d, C29, () => qd(d, 212, 989, 2), (w) => w.x.k === 2 && plainQ(w.q) && w.x.n >= 1000) : gen(d, C29, () => qd(d, 12, 98, 2), (w) => w.x.k === 2 && plainQ(w.q) && w.x.n >= 100);
      const rows = d.shuffle([0, 1, 2, 3]), W = Math.floor(v.q.n / 100), m = mil(v.x, v.c);
      return C(`어림하여 ${S(v.x)} ÷ ${v.c}의 몫을 찾으려고 한다. 알맞은 것은?`, rows.map((k) => fx(v.q.n, k)), rows.indexOf(2), {
        explain: n === 0
          ? `${v.c} × ${W} = ${v.c * W}, ${v.c} × ${W + 1} = ${v.c * (W + 1)}이므로 몫은 ${W}보다 크고 ${W + 1}보다 작다. 알맞은 것은 ${S(v.q)}이다.`
          : `나누어지는 수 ${J(v.x, '이/가')} 나누는 수 ${v.c}보다 작으므로 몫은 1보다 작다. ${v.c} × 0.1 = ${S(dec(v.c, 1))}보다는 크므로 몫은 0.1보다 크다. 알맞은 것은 ${S(v.q)}이다.`,
        facts: { pick: { expr: m.s, options: rows.map((k) => v.q.n * P10[3 - k]) }, unseen: m.un, rule: ['pickBig', 'pickSmall'][n] }
      });
    }, { count: 2 }),
    T('est-expr-pick', '문장제: 몫을 가장 가깝게 어림한 식 고르기', '①32 ②31 ③35', (d) => {
      // 틀린 보기: 나누어지는 수를 몇십으로 내리거나 올린 식
      const m = d.until(() => { const c = d.int(3, 9), t = d.int(3, 9), q = dec(t * 100 + d.pick([-1, 1]) * d.int(1, Math.floor(46 / c)), 2); return { c, t, q, x: times(q, c) }; }, (w) => w.x.k >= 1 && (w.c * w.t) % 10 !== 0 && w.c * w.t > 10);
      const R = m.c * m.t, down = Math.floor(R / 10) * 10, rows = d.shuffle([R, down, down + 10]);
      return C(`끈 ${S(m.x)} m를 ${m.c}명이 똑같이 나누어 가지려고 한다. 한 명이 가지는 끈의 길이를 어림하려고 할 때, 가장 가깝게 어림한 식은?`, rows.map((r) => eq(r, '/', m.c)), rows.indexOf(R), {
        explain: `${J(m.x, '은/는')} ${R}에 가장 가깝다. ${R} ÷ ${m.c} = ${m.t}이므로 한 명이 가지는 끈은 약 ${m.t} m이다.`,
        facts: { closer: { expr: `${S(m.x)}/${m.c}`, estimates: rows.map((r) => r / m.c) } }
      });
    }),
    T('est-spot', '어림하여 몫에 소수점을 찍을 자리 고르기', '①33 ②33 ③36 심24', (d) => {
      // 몫이 10보다 큰 것, 0을 내려 계산하는 것, 몫의 가운데에 0이 있는 것 가운데 하나
      const v = d.pick([
        () => gen(d, C29, () => qd(d, 1012, 2489, 2), (w) => w.x.k === 2 && plainQ(w.q)),
        () => gen(d, [2, 4, 5, 6, 8], () => qd(d, 212, 995, 2), (w) => w.x.k === 1 && w.x.n >= 100),
        () => gen(d, C29, () => ({ n: d.int(2, 12) * 100 + d.int(1, 9), k: 2 }), (w) => w.x.k >= 1 && w.x.n >= 100)
      ])();
      const qs = String(v.q.n), len = qs.length, hit = len - 3, m = mil(v.x, v.c), W = Math.floor(v.q.n / 100);
      return C(`어림하여 ${S(v.x)} ÷ ${v.c}의 몫에 소수점을 찍으려고 한다. 소수점을 찍어야 할 곳은?`, LAB.slice(0, len - 1), hit, {
        figure: eq(S(v.x), '/', v.c, '=') + spots(qs),
        explain: `${v.c} × ${W} = ${v.c * W}, ${v.c} × ${W + 1} = ${v.c * (W + 1)}이므로 몫은 ${W}보다 크고 ${W + 1}보다 작다. ${LAB[hit]}에 소수점을 찍으면 ${S(v.q)}이다.`,
        facts: { pick: { expr: m.s, options: Array.from({ length: len - 1 }, (_, g) => v.q.n * 1000 / P10[len - 1 - g]) }, unseen: m.un }
      });
    }),
    T('est-wrong-point', '어림하여 소수점의 위치가 잘못된 계산 찾기', '②34 심25', (d) => {
      // 세 식 가운데 하나만 몫의 소수점을 한 자리 잘못 찍었다(바른 몫의 10배 또는 1/10배).
      const rows = d.until(() => [gen(d, C29, () => qd(d, 212, 989, 2), (w) => w.x.k === 2 && plainQ(w.q)), gen(d, C29, () => qd(d, 12, 98, 2), (w) => w.x.k >= 1 && plainQ(w.q)), gen(d, C29, () => qd(d, 12, 98, 1), (w) => w.x.k === 1)], (list) => new Set(list.map((v) => v.c)).size === 3);
      const order = d.shuffle(rows), bad = d.int(0, 2), shown = order.map((v, i) => (i !== bad ? v.q : v.q.k <= 2 && d.bool() ? dec(v.q.n, v.q.k + 1) : dec(v.q.n * 10, v.q.k)));
      const w = order[bad];
      return C('어림하여 몫의 소수점의 위치가 잘못된 계산을 찾으면?', THREE, bad, {
        figure: tagged(order.map((v, i) => eq(S(v.x), '/', v.c, '=', S(shown[i])))),
        explain: `${S(w.x)} ÷ ${josa(w.c, '은/는')} ${w.x.n >= w.c * P10[w.x.k] ? `${w.c} × ${Math.floor(V(w.q))} = ${w.c * Math.floor(V(w.q))}, ${w.c} × ${Math.floor(V(w.q)) + 1} = ${w.c * (Math.floor(V(w.q)) + 1)}에서 몫이 ${Math.floor(V(w.q))}보다 크고 ${Math.floor(V(w.q)) + 1}보다 작다` : '나누어지는 수가 나누는 수보다 작아 몫이 1보다 작다'}. ${J(shown[bad], '이/가')} 될 수 없다. 바르게 계산하면 ${told(w.x, w.c)}이다.`,
        facts: { claimed: order.map((v, i) => [mil(v.x, v.c).s, shown[i].n * P10[3 - shown[i].k]]), claimedWant: false }
      });
    }),
    T('est-above', '어림하여 몫이 기준 수보다 큰(작은) 나눗셈 찾기', '①35 ②35 심26', (d, n) => {
      // 나누어지는 수는 모두 (나누는 수)×(기준 수)에서 조금 크거나 작다. 첫째 문항은 하나를 고르고, 둘째 문항은 개수를 센다.
      const Tn = d.int(2, 9), big = d.bool(), count = n === 0 ? 3 : 4, hits = n === 0 ? 1 : d.int(1, 3), flags = d.shuffle(Array.from({ length: count }, (_, i) => i < hits));
      const rows = d.until(() => d.shuffle(C29).slice(0, count).map((c, i) => { const s = flags[i] === big ? 1 : -1, q = dec(Tn * 100 + s * nz(d, 2, 38), 2); return { c, s, q, x: times(q, c) }; }), (list) => list.every((v) => v.x.k >= 1));
      const exprs = rows.map((v) => `${S(v.x)}/${v.c}`), why = rows.map((v, i) => `${LAB[i]}의 나누어지는 수는 ${v.c} × ${Tn} = ${v.c * Tn}보다 ${v.s > 0 ? '크다' : '작다'}`).join('. ') + '.';
      if (n === 0) {
        return C(`어림하여 몫이 ${Tn}보다 ${big ? '큰' : '작은'} 것을 찾으면?`, THREE, flags.indexOf(true), {
          figure: tagged(rows.map(div)), explain: `${why} 몫이 ${Tn}보다 ${big ? '큰' : '작은'} 것은 ${LAB[flags.indexOf(true)]}이다.`,
          facts: { choose: { exprs, rule: big ? 'onlyAbove' : 'onlyBelow', target: Tn } }
        });
      }
      return N(`어림하여 알아볼 때, 몫이 ${Tn}보다 ${big ? '큰' : '작은'} 것은 모두 몇 개인가?`, hits, {
        unit: '개', figure: tagged(rows.map(div)), explain: `${why} 몫이 ${Tn}보다 ${big ? '큰' : '작은'} 것은 ${rows.map((v, i) => (flags[i] ? LAB[i] : '')).filter(Boolean).join(', ')}이다.`,
        facts: { choose: { exprs, rule: big ? 'countAbove' : 'countBelow', target: Tn } }
      });
    }, { count: 2 }),
    T('est-one', '몫이 1보다 작은(큰) 나눗셈 찾기', '①24 ②36 ③38 심27', (d) => {
      // 나누어지는 수와 나누는 수의 크기만 비교하면 된다. 하나만 다르다.
      const small = d.bool(), flags = d.shuffle([true, false, false, false]);
      const rows = d.until(() => d.shuffle(C29).slice(0, 4).map((c, i) => { const q = flags[i] === small ? qd(d, 72, 98, 2) : qd(d, 104, 145, 2); return { c, q, x: times(q, c) }; }), (list) => list.every((v) => v.x.k === 2)), hit = flags.indexOf(true);
      return C(`계산하지 않고 알아보려고 한다. 몫이 1보다 ${small ? '작은' : '큰'} 것은?`, rows.map(div), hit, {
        explain: `나누어지는 수가 나누는 수보다 작으면 몫이 1보다 작고, 크면 몫이 1보다 크다. ${J(rows[hit].x, '은/는')} ${rows[hit].c}보다 ${small ? '작으므로' : '크므로'} ${S(rows[hit].x)} ÷ ${rows[hit].c}의 몫만 1보다 ${small ? '작다' : '크다'}.`,
        facts: { choose: { exprs: rows.map((v) => `${S(v.x)}/${v.c}`), rule: small ? 'onlyBelow' : 'onlyAbove', target: 1 } }
      });
    }),
    T('est-one-word', '문장제: 한 몫이 1보다 큰지 작은지 알기', '③38 ②39', (d) => {
      const c = d.pick([4, 6, 8]), q = dec(d.pick([85, 90, 95, 105, 110, 115, 120]), 2), x = times(q, c);
      return C(`길이가 ${S(x)} m인 끈을 ${c}명이 똑같이 나누어 가지려고 한다. 계산하지 않고 알아볼 때, 한 명이 가지는 끈의 길이에 대한 설명으로 옳은 것은?`, ['1 m보다 길다.', '1 m와 같다.', '1 m보다 짧다.'], x.n > c * 10 ? 0 : 2, {
        explain: `끈의 길이 ${S(x)} m가 사람 수 ${c}보다 ${x.n > c * 10 ? '크므로' : '작으므로'} ${S(x)} ÷ ${c}의 몫은 1보다 ${x.n > c * 10 ? '크다' : '작다'}. 한 명이 가지는 끈은 1 m보다 ${x.n > c * 10 ? '길다' : '짧다'}.`,
        facts: { choose: { exprs: [S(x), String(c)], rule: 'compare' } }
      });
    }),
    T('est-mult', '곱셈식을 보고 몫이 어느 자연수에 더 가까운지 알기', '②37', (d) => {
      const m = d.until(() => { const c = d.int(3, 9), q0 = d.int(2, 9), q = dec(q0 * 10 + d.pick([2, 3, 7, 8]), 1); return { c, q0, q, x: times(q, c) }; }, (w) => w.x.k === 1), lo = m.c * m.q0, hi = m.c * (m.q0 + 1), near = m.q.n % 10 < 5 ? 0 : 1;
      return C(`${m.c} × ${m.q0} = ${lo}, ${m.c} × ${m.q0 + 1} = ${hi}이다. ${S(m.x)} ÷ ${m.c}의 몫은 ${josa(m.q0, '과/와')} ${m.q0 + 1} 가운데 어느 수에 더 가까운가?`, [String(m.q0), String(m.q0 + 1)], near, {
        explain: `${J(m.x, '은/는')} ${josa(lo, '과/와')} ${hi} 가운데 ${[lo, hi][near]}에 더 가깝다. 몫도 ${[m.q0, m.q0 + 1][near]}에 더 가깝다. 계산하면 ${told(m.x, m.c)}이다.`,
        facts: { closer: { expr: `${S(m.x)}/${m.c}`, estimates: [m.q0, m.q0 + 1] } }
      });
    }),
    T('est-judge', '문장제: 어림하여 한 몫이 기준보다 많은지 알기', '②38 ①36 심28', (d) => {
      const m = d.until(() => { const c = d.int(3, 6), t = d.int(2, 6), s = d.pick([-1, 1]), q = dec(t * 100 + s * nz(d, 4, 38), 2); return { c, t, s, q, x: times(q, c) }; }, (w) => w.x.k >= 1);
      return C(`똑같은 음료수 ${m.c}병에 들어 있는 설탕은 모두 ${S(m.x)} g이다. 어림하여 알아볼 때, 음료수 한 병에 들어 있는 설탕의 양으로 옳은 것은?`, [`${m.t} g보다 많다.`, `${m.t} g보다 적다.`], m.s > 0 ? 0 : 1, {
        explain: `한 병에 ${m.t} g씩 들어 있다면 ${m.c}병에는 ${m.c} × ${m.t} = ${m.c * m.t}(g)이 들어 있다. ${S(m.x)} g은 ${m.c * m.t} g보다 ${m.s > 0 ? '많으므로' : '적으므로'} 한 병에 들어 있는 설탕은 ${m.t} g보다 ${m.s > 0 ? '많다' : '적다'}.`,
        facts: { choose: { exprs: [S(m.x), `${m.c}*${m.t}`], rule: 'max' } }
      });
    }),
    T('est-compare', '문장제: 어림으로 한 개의 양 비교하기', '②39 ③40', (d) => {
      // 한쪽은 기준보다 조금 무겁고 다른 쪽은 조금 가볍다. 전체가 무거운 쪽이 답인 것은 아니다.
      const m = d.until(() => { const t = d.int(2, 6), up = d.int(0, 1), cs = d.shuffle([2, 3, 4, 5, 6]).slice(0, 2); return { t, up, rows: cs.map((c, i) => { const q = dec(t * 100 + (i === up ? 1 : -1) * nz(d, 5, 45), 2); return { c, q, x: times(q, c) }; }) }; }, (w) => w.rows.every((v) => v.x.k === 1));
      const names = ['식용유', '간장'];
      return C(`식용유 ${m.rows[0].c}병의 무게는 ${S(m.rows[0].x)} kg이고, 간장 ${m.rows[1].c}병의 무게는 ${S(m.rows[1].x)} kg이다. 한 병의 무게를 ${m.t} kg과 비교하는 방법으로 어림할 때, 한 병의 무게가 더 무거운 것은?`, names, m.up, {
        explain: m.rows.map((v, i) => `${names[i]} ${v.c}병의 무게는 ${v.c} × ${m.t} = ${v.c * m.t}(kg)보다 ${i === m.up ? '무거우므로' : '가벼우므로'} 한 병은 ${m.t} kg보다 ${i === m.up ? '무겁다' : '가볍다'}`).join('. ') + `. 한 병의 무게가 더 무거운 것은 ${names[m.up]}이다.`,
        facts: { choose: { exprs: m.rows.map((v) => `${S(v.x)}/${v.c}`), rule: 'max' } }
      });
    })
  ]);

  // ── 몫의 크기 비교와 조건에 맞는 수 ──
  // (자연수)÷(자연수) 가운데 몫이 소수 둘째 자리 안에서 나누어떨어지는 것
  const natAny = (d, ok) => d.until(() => { const c = d.pick([2, 4, 5, 8, 12, 15, 20, 25]), a = d.int(2, 60); return { c, x: nat(a), q: quo(nat(a), c) }; }, (v) => v.q && v.q.k >= 1 && v.q.k <= 2 && (!ok || ok(v)));
  B.addTypes('6-1-3', 'comp', [
    T('comp-sign', '두 몫의 크기 비교', '①20·51 ②40 ③41 심30', (d, n) => {
      let rows;
      if (n === 0) {
        // (소수)÷(자연수) 둘. 네 번에 한 번은 몫이 같다.
        rows = d.int(0, 3) === 0 ? d.until(() => { const q = qd(d, 150, 950, 2), cs = d.shuffle(C29).slice(0, 2); return cs.map((c) => ({ c, q, x: times(q, c) })); }, (list) => list.every((v) => v.x.k >= 1 && v.x.n < 10000)) : nearRows(d, 2, 150, 950, 0.06);
      } else if (n === 1) {
        // 한쪽은 수 하나
        const v = gen(d, C29, () => qd(d, 12, 498, 2), (w) => w.x.k >= 1), k = dec(d.until(() => v.q.n + d.pick([-1, 1]) * d.int(1, 9), (w) => w > 0), 2);
        rows = d.bool() ? [v, { x: k, c: 1, q: k }] : [{ x: k, c: 1, q: k }, v];
      } else {
        // (자연수)÷(자연수) 둘. 네 번에 한 번은 몫이 같다.
        const same = d.int(0, 3) === 0;
        rows = d.until(() => [natAny(d), natAny(d)], ([p, q]) => (p.x.n !== q.x.n || p.c !== q.c) && p.c !== q.c && (same ? V(p.q) === V(q.q) : V(p.q) !== V(q.q) && Math.abs(V(p.q) - V(q.q)) <= 0.6));
      }
      const cr = cross(rows), w = cr.values, sign = w[0] > w[1] ? 0 : w[0] === w[1] ? 1 : 2, show = (v) => (v.c === 1 ? ex(S(v.x)) : div(v)), say = (v) => (v.c === 1 ? S(v.x) : told(v.x, v.c));
      return C(['두 나눗셈의 몫의 크기를 비교할 때, ○ 안에 알맞은 것은?', '몫과 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', '몫을 소수로 나타내어 크기를 비교할 때, ○ 안에 알맞은 것은?'][n], SIGNS, sign, {
        figure: versus(show(rows[0]), show(rows[1])),
        explain: `${rows.filter((v) => v.c !== 1).map(say).join(', ')}이다. ` + (sign === 1 ? '두 몫은 같다.' : `${S(rows[0].q)} ${SIGNS[sign]} ${S(rows[1].q)}이다.`),
        facts: { choose: { exprs: cr.exprs, rule: 'compare' }, unseen: cr.un, rule: ['signDec', 'signValue', 'signNat'][n] }
      });
    }, { count: 3 }),
    T('comp-max', '몫이 가장 큰(작은) 나눗셈 찾기', '①21 ②41 ③42 심31', (d) => {
      const rows = nearRows(d, 3, 150, 950, 0.07), cr = cross(rows), big = d.bool(), hit = cr.values.indexOf(big ? Math.max(...cr.values) : Math.min(...cr.values));
      return C(`몫이 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
        figure: tagged(rows.map(div)),
        explain: `몫은 ${rows.map((v, i) => `${LAB[i]} ${S(v.q)}`).join(', ')}이다. 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: cr.exprs, rule: big ? 'max' : 'min' }, unseen: cr.un }
      });
    }),
    T('comp-order', '몫을 크기 차례로 늘어놓기', '①21·51 ②41 ③42 심31', (d) => {
      const rows = nearRows(d, 3, 120, 950, 0.1), cr = cross(rows), desc = d.bool(), choice = orderChoice(d, cr.values, THREE, desc);
      return C(`몫이 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, choice.options, choice.answer, {
        figure: tagged(rows.map(div)),
        explain: `몫은 ${rows.map((v, i) => `${LAB[i]} ${S(v.q)}`).join(', ')}이다. ${choice.right.map((i) => S(rows[i].q)).join(desc ? ` ${GT} ` : ` ${LT} `)}이다.`,
        facts: { choose: { exprs: cr.exprs, rule: desc ? 'descending' : 'ascending', orders: choice.list }, unseen: cr.un }
      });
    }),
    T('comp-near-one', '몫이 1에 가장 가까운 나눗셈 찾기', '①21 심32', (d) => {
      // 1보다 조금 큰 몫과 조금 작은(또는 조금 큰) 몫이 하나씩 있고, 나머지 둘은 1에서 멀다.
      const rows = d.until(() => { const f = d.int(2, 8), g = d.until(() => d.int(2, 9), (w) => w !== f), cs = d.shuffle(C29).slice(0, 4); return d.shuffle([dec(100 + f, 2), dec(100 + d.pick([-1, 1]) * g, 2), qd(d, 312, 989, 2), dec(d.int(4, 28), 2)]).map((q, i) => ({ c: cs[i], q, x: times(q, cs[i]) })); }, (list) => list.every((v) => v.x.k >= 1 && v.x.n < 10000));
      const gaps = rows.map((v) => Math.abs(v.q.n * P10[2 - v.q.k] - 100)), hit = gaps.indexOf(Math.min(...gaps));
      return C('몫이 1에 가장 가까운 것은?', LAB, hit, {
        figure: tagged(rows.map(div)),
        explain: `몫은 ${rows.map((v, i) => `${LAB[i]} ${S(v.q)}`).join(', ')}이다. 1과의 차가 가장 작은 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: rows.map((v) => `${S(v.x)}/${v.c}`), rule: 'nearest', target: 1 } }
      });
    }),
    T('comp-nocalc', '계산하지 않고 몫의 크기 비교하기', '①22', (d, n) => {
      const big = d.bool();
      if (n === 0) {
        // 나누어지는 수가 같다: 나누는 수가 작을수록 몫이 크다.
        const cs = d.pick([[2, 4, 8], [2, 3, 6], [3, 6, 9], [2, 6, 9]]), lcm = { '2,4,8': 8, '2,3,6': 6, '3,6,9': 18, '2,6,9': 18 }[cs.join()], x = dec(d.until(() => lcm * d.int(Math.ceil(110 / lcm), Math.floor(990 / lcm)), (w) => w % 10 !== 0), 2), rows = d.shuffle(cs);
        const hit = rows.indexOf(big ? Math.min(...cs) : Math.max(...cs));
        return C(`나누어지는 수가 같은 세 나눗셈이 있다. 계산하지 않고 알아볼 때, 몫이 가장 ${big ? '큰' : '작은'} 것은?`, rows.map((c) => eq(S(x), '/', c)), hit, {
          explain: `같은 수를 나눌 때 나누는 수가 작을수록 몫이 크다. 나누는 수가 가장 ${big ? '작은' : '큰'} ${S(x)} ÷ ${rows[hit]}의 몫이 가장 ${big ? '크다' : '작다'}.`,
          facts: { choose: { exprs: rows.map((c) => `${S(x)}/${c}`), rule: big ? 'max' : 'min' }, rule: 'nocalcDivisor' }
        });
      }
      // 나누는 수가 같고 나누어지는 수의 숫자 배열이 같다: 나누어지는 수가 클수록 몫이 크다.
      const a = nz(d, 1012, 9898), c = d.int(2, 9), rows = d.shuffle([1, 2, 3]), hit = rows.indexOf(big ? 1 : 3);
      return C(`나누는 수가 같은 세 나눗셈이 있다. 계산하지 않고 알아볼 때, 몫이 가장 ${big ? '큰' : '작은'} 것은?`, rows.map((k) => eq(fx(a, k), '/', c)), hit, {
        explain: `같은 수로 나눌 때 나누어지는 수가 클수록 몫이 크다. 나누어지는 수가 가장 ${big ? '큰' : '작은'} ${fx(a, rows[hit])} ÷ ${c}의 몫이 가장 ${big ? '크다' : '작다'}.`,
        facts: { choose: { exprs: rows.map((k) => `${fx(a, k)}/${c}`), rule: big ? 'max' : 'min' }, rule: 'nocalcDividend' }
      });
    }, { count: 2 }),
    T('comp-odd', '몫이 다른 하나 찾기', '①23 ②42 ③44 심18', (d) => {
      // 두 식은 몫이 같고 한 식만 조금 다르다.
      const rows = d.until(() => { const q = qd(d, 112, 989, 2), q2 = dec(q.n + d.pick([-10, -1, 1, 10]), 2), cs = d.shuffle(C29).slice(0, 3); return d.shuffle([q, q, q2].map((r, i) => ({ c: cs[i], q: r, x: times(r, cs[i]), odd: i === 2 }))); }, (list) => list.every((v) => v.q.n > 0 && v.x.k >= 1 && v.x.n < 10000));
      const hit = rows.findIndex((v) => v.odd), ms = rows.map((v) => mil(v.x, v.c));
      return C('몫이 나머지와 다른 하나는?', THREE, hit, {
        figure: tagged(rows.map(div)),
        explain: `몫은 ${rows.map((v, i) => `${LAB[i]} ${S(v.q)}`).join(', ')}이다. ${LAB[hit]}만 다르다.`,
        facts: { choose: { exprs: ms.map((m) => m.s), rule: 'odd' }, unseen: ms.reduce((all, m) => all.concat(m.un), []) }
      });
    }),
    T('comp-target', '몫이 주어진 수인 나눗셈 찾기', '①23 ②43 ③44 심18', (d) => {
      // 틀린 보기의 몫은 주어진 수와 숫자 하나만 다르다.
      const rows = d.until(() => { const q = qd(d, 112, 989, 2), cs = d.shuffle(C29).slice(0, 3); return d.shuffle([q, dec(q.n + d.pick([-1, 1]) * d.int(1, 4), 2), dec(q.n + d.pick([-10, 10, 20, -20]), 2)].map((r, i) => ({ c: cs[i], q: r, x: times(r, cs[i]), hit: i === 0 }))); }, (list) => list.every((v) => v.q.n > 0 && v.x.k >= 1 && v.x.n < 10000));
      const hit = rows.findIndex((v) => v.hit), ms = rows.map((v) => mil(v.x, v.c));
      return C(`몫이 ${S(rows[hit].q)}인 것은?`, rows.map(div), hit, {
        explain: `몫은 차례로 ${rows.map((v) => S(v.q)).join(', ')}이다.`,
        facts: { choose: { exprs: ms.map((m) => m.s), rule: 'equals', target: ms[hit].v }, unseen: ms.reduce((all, m) => all.concat(m.un), []) }
      });
    }),
    T('comp-match', '나눗셈과 몫 짝 짓기', '①23 ②43 ③43', (d) => {
      const rows = nearRows(d, 3, 120, 950, 0.2), ms = rows.map((v) => mil(v.x, v.c)), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('나눗셈과 몫을 알맞게 짝 지은 것은?', list.map((o) => o.map((j, i) => `${LAB[i]} ${S(rows[j].q)}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map(div)),
        explain: rows.map((v, i) => `${LAB[i]} ${told(v.x, v.c)}`).join(', ') + '이다.',
        facts: { match: { exprs: ms.map((m) => m.s), options: list.map((o) => o.map((j) => ms[j].v)) }, unseen: ms.reduce((all, m) => all.concat(m.un), []) }
      });
    }),
    T('comp-digit', '몫의 소수 첫째 자리 숫자가 0인 나눗셈 찾기', '①25 ②47', (d) => {
      const rows = d.until(() => { const cs = d.shuffle(C29).slice(0, 4); return d.shuffle([{ n: d.int(1, 9) * 100 + d.int(1, 9), k: 2 }, qd(d, 112, 989, 2), qd(d, 112, 989, 2), qd(d, 12, 98, 1)].map((q, i) => ({ c: cs[i], q, x: times(q, cs[i]), hit: i === 0 }))); }, (list) => list.every((v) => v.x.k >= 1 && v.x.n < 10000 && (v.hit || Math.floor(v.q.n * P10[2 - v.q.k] / 10) % 10 !== 0)));
      const hit = rows.findIndex((v) => v.hit), ms = rows.map((v) => mil(v.x, v.c));
      return C('몫의 소수 첫째 자리 숫자가 0인 것은?', rows.map(div), hit, {
        explain: `몫은 차례로 ${rows.map((v) => S(v.q)).join(', ')}이다. 소수 첫째 자리 숫자가 0인 것은 ${S(rows[hit].x)} ÷ ${rows[hit].c}이다.`,
        facts: { claimed: ms.map((m) => [`((${m.s})-(${m.s})%100)/100%10`, 0]), claimedWant: true }
      });
    }),
    T('comp-pick-div', '여러 수에서 골라 나누기', '①28 ②24·25 ③48 심39', (d, n) => {
      if (n === 0) {
        // 가장 큰 수(소수)를 가장 작은 수(자연수)로 나눈다.
        const v = gen(d, C29, () => qd(d, 212, 989, 2), (w) => w.x.k >= 1 && V(w.x) > w.c + 3), top = v.x.n * P10[2 - v.x.k];
        const y = dec(d.until(() => d.int(v.c * 100 + 11, top - 11), (w) => w % 10 !== 0), 2), m = d.int(v.c + 1, Math.floor(V(v.x)));
        return qAns('다음 수 가운데 가장 큰 수를 가장 작은 수로 나눈 몫은?', v.x, v.c, {
          figure: numbers(d.shuffle([S(v.x), S(y), String(v.c), String(m)])),
          explain: `가장 큰 수는 ${S(v.x)}, 가장 작은 수는 ${v.c}이다. ${told(v.x, v.c)}이다.`, facts: { rule: 'pickBig' }
        });
      }
      // 가장 작은 수(소수)를 가장 큰 수(자연수)로 나눈다.
      const v = gen(d, [6, 7, 8, 9], () => qd(d, 12, 78, 2), (w) => w.x.k >= 1 && V(w.x) < w.c - 2 && V(w.x) > 1), low = v.x.n * P10[2 - v.x.k];
      const y = dec(d.until(() => d.int(low + 11, v.c * 100 - 11), (w) => w % 10 !== 0), 2), m = d.int(Math.floor(V(v.x)) + 1, v.c - 1);
      return qAns('다음 수 가운데 가장 작은 수를 가장 큰 수로 나눈 몫은?', v.x, v.c, {
        figure: numbers(d.shuffle([S(v.x), S(y), String(v.c), String(m)])),
        explain: `가장 작은 수는 ${S(v.x)}, 가장 큰 수는 ${v.c}이다. ${told(v.x, v.c)}이다.`, facts: { rule: 'pickSmall' }
      });
    }, { count: 2 }),
    T('comp-place', '자릿값으로 나타낸 수 나누기', '①29 ②25 ③50 심40', (d) => {
      const v = gen(d, C29, () => qd(d, 112, 989, 2), (w) => w.x.k === 2 && w.x.n >= 1000 && Math.floor(w.x.n / 10) % 10 !== 0), A = Math.floor(v.x.n / 100), b = Math.floor(v.x.n / 10) % 10, e = v.x.n % 10;
      return D(`1이 ${A}개, 0.1이 ${b}개, 0.01이 ${e}개인 수를 ${josa(v.c, '으로/로')} 나눈 몫은?`, V(v.q), {
        explain: `1이 ${A}개, 0.1이 ${b}개, 0.01이 ${e}개인 수는 ${S(v.x)}이다. ${told(v.x, v.c)}이다.`,
        facts: { calc: [[`(${A}+0.1*${b}+0.01*${e})/${v.c}`, 0]] }
      });
    }),
    T('box-mul', '곱셈식의 □ 구하기', '①37 ②48 ③54 심46', (d, n) => {
      // 첫째 문항은 곱이 소수, 둘째 문항은 곱이 자연수((자연수)÷(자연수)의 몫을 소수로 나타낸다).
      const v = n === 0 ? gen(d, C29, () => qd(d, 12, 989, 2), (w) => w.x.k >= 1 && plainQ(w.q)) : natAny(d, (w) => w.x.n % w.c !== 0), front = d.bool();
      return qAns('□ 안에 알맞은 수는?', v.x, v.c, {
        figure: front ? eq(box(), '*', v.c, '=', S(v.x)) : eq(v.c, '*', box(), '=', S(v.x)),
        explain: `곱셈식을 나눗셈식으로 나타내면 □ = ${S(v.x)} ÷ ${v.c}이다. ${told(v.x, v.c)}이다.`, facts: { rule: ['boxDec', 'boxNat'][n] }
      });
    }, { count: 2 }),
    T('box-word', '어떤 수에 자연수를 곱한 결과로 어떤 수 구하기', '①37 ②49·51 ③54·55', (d) => {
      const v = gen(d, C29, () => qd(d, 105, 989, 2), (w) => w.x.k >= 1);
      return qAns(`어떤 수에 ${josa(v.c, '을/를')} 곱하였더니 ${J(v.x, '이/가')} 되었다. 어떤 수는?`, v.x, v.c, { explain: `어떤 수는 ${S(v.x)}${dj(S(v.x), '을/를').slice(-1)} ${josa(v.c, '으로/로')} 나눈 몫이다. ${told(v.x, v.c)}이다.` });
    }),
    T('box-nat', '몫과 비교하는 □ 안의 자연수', '①38 ②53 ③46 심35·36', (d, n) => {
      if (n === 0) {
        // 들어갈 수 있는 자연수의 개수
        const v = gen(d, C29, () => qd(d, 312, 989, 2), (w) => w.x.k >= 1), W = Math.floor(V(v.q)), i = ix(v.x);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', W, {
          unit: '개', figure: eq(S(v.x), '/', v.c, '>', box()),
          explain: `${told(v.x, v.c)}이다. □는 ${S(v.q)}보다 작은 자연수이므로 1부터 ${W}까지 ${W}개이다.`,
          facts: { digit: { template: `${i.s}>□*${v.c}*${P10[v.x.k]}`, lo: 1, hi: W + 2, ask: 'count' } }
        });
      }
      if (n === 1) {
        // 가장 작은 자연수
        const v = gen(d, C29, () => qd(d, 212, 1989, 2), (w) => w.x.k >= 1), W = Math.floor(V(v.q)), i = ix(v.x);
        return N('□ 안에 들어갈 수 있는 가장 작은 자연수는?', W + 1, {
          figure: eq(S(v.x), '/', v.c, '<', box()),
          explain: `${told(v.x, v.c)}이다. ${S(v.q)}보다 큰 자연수 가운데 가장 작은 수는 ${W + 1}이다.`,
          facts: { digit: { template: `${i.s}<□*${v.c}*${P10[v.x.k]}`, lo: 1, hi: W + 4, ask: 'min' } }
        });
      }
      // (자연수)÷(자연수)의 몫보다 작은 가장 큰 자연수
      const v = natAny(d, (w) => V(w.q) > 2 && w.c <= 8), W = Math.floor(V(v.q));
      return N('□ 안에 들어갈 수 있는 가장 큰 자연수는?', W, {
        figure: eq(v.x.n, '/', v.c, '>', box()),
        explain: `${told(v.x, v.c)}이다. ${S(v.q)}보다 작은 자연수 가운데 가장 큰 수는 ${W}이다.`,
        facts: { digit: { template: `${v.x.n}>□*${v.c}`, lo: 1, hi: W + 3, ask: 'max' } }
      });
    }, { count: 3 }),
    T('box-digit', '몫과 비교하는 소수의 □ 안의 숫자', '①39 ②54 ③47 심38', (d) => {
      // 몫은 W.fg(g는 0이 아니다)이고 오른쪽 수는 소수 한 자리 수 W.□이다. □에는 f까지 들어갈 수 있다.
      const v = gen(d, C29, () => ({ n: d.int(1, 19) * 100 + d.int(1, 8) * 10 + d.int(1, 9), k: 2 }), (w) => w.x.k >= 1), W = Math.floor(v.q.n / 100), f = Math.floor(v.q.n / 10) % 10, i = ix(v.x);
      return N('0부터 9까지의 수 가운데 □ 안에 들어갈 수 있는 가장 큰 수는?', f, {
        figure: eq(S(v.x), '/', v.c, '>', `${W}.${box()}`),
        explain: `${told(v.x, v.c)}이다. ${W}.□가 ${S(v.q)}보다 작으려면 □는 ${f}이거나 ${f}보다 작아야 한다. 가장 큰 수는 ${f}이다.`,
        facts: { digit: { template: `${i.s}*${P10[2 - v.x.k]}>(${W}*10+□)*10*${v.c}`, lo: 0, hi: 9, ask: 'max' } }
      });
    }),
    T('box-divisor', '몫이 1보다 작아지는 나누는 수', '③47', (d) => {
      const x = d.bool() ? qd(d, 21, 79, 1) : qd(d, 205, 795, 2), W = Math.floor(V(x)), i = ix(x);
      return N('1부터 9까지의 자연수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', 9 - W, {
        unit: '개', figure: eq(S(x), '/', box(), '<', 1),
        explain: `몫이 1보다 작으려면 나누는 수가 나누어지는 수 ${S(x)}보다 커야 한다. □ 안에 들어갈 수 있는 수는 ${W + 1}부터 9까지 ${9 - W}개이다.`,
        facts: { digit: { template: `${i.s}<□*${P10[x.k]}`, lo: 1, hi: 9, ask: 'count' } }
      });
    }),
    T('box-check', '몫에 나누는 수를 곱하여 나누어지는 수의 빈 숫자 찾기', '심14', (d) => {
      const v = gen(d, C29, () => qd(d, 212, 989, 2), (w) => w.x.k === 2 && plainQ(w.q) && w.x.n >= 1000 && Math.floor(w.x.n / 10) % 10 !== 0), W = Math.floor(v.x.n / 100), f = Math.floor(v.x.n / 10) % 10, g = v.x.n % 10, i = ix(v.q);
      return N('□ 안에 알맞은 숫자는?', f, {
        figure: eq(`${W}.${box()}${g}`, '/', v.c, '=', S(v.q)),
        explain: `몫에 나누는 수를 곱하면 나누어지는 수가 된다. ${S(v.q)} × ${v.c} = ${S(v.x)}이므로 □ 안에 알맞은 숫자는 ${f}이다.`,
        facts: { calc: [[`(${i.s}*${v.c}-${W}*100-${g})/10`, 0]], unseen: i.un.concat([100, 10]) }
      });
    }),
    T('card-nn', '수 카드로 몫이 가장 큰(작은) (자연수)÷(자연수) 만들기', '①42 ②55 ③52 심42', (d, n) => {
      // 첫째 문항은 가장 큰 수를 가장 작은 수로, 둘째 문항은 가장 작은 수를 가장 큰 수로 나눈다.
      const s = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, q) => p - q), (w) => { const r = n === 0 ? quo(nat(w[2]), w[0]) : quo(nat(w[0]), w[2]); return r && r.k >= 1 && r.k <= 2; });
      const [a, c] = n === 0 ? [s[2], s[0]] : [s[0], s[2]];
      return qAns(`수 카드 3장 가운데 2장을 골라 한 번씩만 사용하여 나눗셈식 □ ÷ □를 만들려고 한다. 몫이 가장 ${n === 0 ? '클' : '작을'} 때의 몫은?`, nat(a), c, {
        figure: cards(d.shuffle(s)),
        explain: `몫이 가장 ${n === 0 ? '크려면 가장 큰 수를 가장 작은 수로' : '작으려면 가장 작은 수를 가장 큰 수로'} 나눈다. ${told(nat(a), c)}이다.`
      });
    }, { count: 2, standard: NAT }),
    T('card-rest', '수 카드로 가장 큰 소수를 만들어 남은 수로 나누기', '①43 ②57 심41', (d) => {
      const s = d.until(() => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((p, q) => q - p), (w) => w[3] >= 2 && (w[0] * 100 + w[1] * 10 + w[2]) % w[3] === 0 && ((w[0] * 100 + w[1] * 10 + w[2]) / w[3]) % 100 !== 0), x = dec(s[0] * 100 + s[1] * 10 + s[2], 2), r = quo(x, s[3]);
      return D('수 카드 4장 가운데 3장을 골라 한 번씩만 사용하여 가장 큰 소수 두 자리 수 □.□□를 만들었다. 만든 수를 남은 수 카드에 적힌 수로 나눈 몫은?', V(r), {
        figure: cards(d.shuffle(s)),
        explain: `가장 큰 소수 두 자리 수는 큰 수부터 차례로 놓은 ${S(x)}이고 남은 수는 ${s[3]}이다. ${told(x, s[3])}이다.`,
        facts: { calc: [[`(${s[0]}*100+${s[1]}*10+${s[2]})/100/${s[3]}`, 0]], unseen: [10, 100] }
      });
    })
  ]);

  // ── 소수의 나눗셈의 활용 ──
  const POLY = [['정삼각형', 3], ['정사각형', 4], ['정오각형', 5], ['정육각형', 6], ['정팔각형', 8]];
  const word = (text, v, unit, explain, more) => qAns(text, v.x, v.c, Object.assign({ unit, explain }, more || {}));
  B.addTypes('6-1-3', 'word', [
    T('w-share', '문장제: 똑같이 나누기', '①52 ②59 ③57 심53', (d) => {
      const v = gen(d, C29, () => (d.bool() ? qd(d, 112, 989, 2) : qd(d, 21, 398, 1)), (w) => w.x.k >= 1 && plainQ(w.q));
      return word(`보리차 ${S(v.x)} L를 병 ${v.c}개에 똑같이 나누어 담았다. 병 한 개에 담은 보리차는 몇 L인가?`, v, 'L', `${S(v.x)} L를 ${josa(v.c, '으로/로')} 나눈다. ${told(v.x, v.c)}(L)이다.`);
    }),
    T('w-one', '문장제: 한 개의 무게', '①52 ②59 ③57 심53', (d) => {
      const v = gen(d, C29, () => qd(d, 12, 98, 2), (w) => w.x.k >= 1 && plainQ(w.q) && w.x.n >= 10);
      return word(`무게가 같은 사과 ${v.c}개의 무게를 재었더니 ${S(v.x)} kg이었다. 사과 한 개의 무게는 몇 kg인가?`, v, 'kg', `${S(v.x)} kg을 ${josa(v.c, '으로/로')} 나눈다. ${told(v.x, v.c)}(kg)이다. 나누어지는 수가 나누는 수보다 작으므로 몫은 1보다 작다.`);
    }),
    T('w-share-nat', '문장제: 자연수를 자연수로 똑같이 나누기', '①52 ②60 ③58 심53', (d, n) => {
      // 첫째 문항은 몫이 1보다 크고, 둘째 문항은 나누는 수가 더 커서 몫이 1보다 작다.
      const v = natPair(d, [2, 4, 5, 6, 8], d.pick([1, 2]), (w) => (n === 0 ? w.x.n > w.c && w.x.n <= 50 : w.x.n < w.c && w.x.n >= 2));
      if (n === 0) return word(`고구마 ${v.x.n} kg을 ${v.c}명이 똑같이 나누어 가졌다. 한 명이 가진 고구마는 몇 kg인가?`, v, 'kg', `${v.x.n} kg을 ${josa(v.c, '으로/로')} 나눈다. ${told(v.x, v.c)}(kg)이다.`);
      return word(`길이가 ${v.x.n} m인 끈을 ${v.c}도막으로 똑같이 잘랐다. 한 도막의 길이는 몇 m인가?`, v, 'm', `${v.x.n} m를 ${josa(v.c, '으로/로')} 나눈다. ${told(v.x, v.c)}(m)이다. 한 도막은 1 m보다 짧다.`);
    }, { count: 2, standard: NAT }),
    T('w-rate', '문장제: 하나에 해당하는 양', '①52 ②62 ③59 심55', (d) => {
      const v = gen(d, [2, 3, 4, 5, 6], () => qd(d, 312, 698, 2), (w) => w.x.k >= 1 && plainQ(w.q));
      return word(`일정한 빠르기로 ${v.c}시간 동안 ${S(v.x)} km를 걸었다. 1시간 동안 걸은 거리는 몇 km인가?`, v, 'km', `${v.c}시간 동안 걸은 거리를 ${josa(v.c, '으로/로')} 나눈다. ${told(v.x, v.c)}(km)이다.`);
    }),
    T('w-week', '문장제: 일주일 동안의 양으로 하루의 양 구하기', '①52 심55', (d) => {
      const v = gen(d, [7], () => (d.bool() ? qd(d, 12, 98, 2) : qd(d, 11, 19, 1)), (w) => w.x.k >= 1), p = d.pick(NAMES);
      return word(`${name(p, '은/는')} 일주일 동안 우유를 ${S(v.x)} L 마셨다. 매일 같은 양을 마셨다면 하루에 마신 우유는 몇 L인가?`, v, 'L', `일주일은 7일이다. ${told(v.x, 7)}(L)이다.`, { facts: { unseen: [7] } });
    }),
    T('w-times', '문장제: 몇 배인지 소수로 나타내기', '①53 ②61 ③61 심54', (d, n) => {
      if (n === 0) {
        const v = gen(d, C29, () => (d.bool() ? qd(d, 105, 498, 2) : qd(d, 12, 148, 1)), (w) => w.x.k >= 1 && V(w.q) > 1);
        return word(`쌀의 무게는 ${S(v.x)} kg이고 보리의 무게는 ${v.c} kg이다. 쌀의 무게는 보리의 무게의 몇 배인가?`, v, '배', `쌀의 무게를 보리의 무게로 나눈다. ${told(v.x, v.c)}(배)이다.`);
      }
      const v = natPair(d, [2, 4, 5, 6, 8], d.pick([1, 2]), (w) => w.x.n > w.c && w.x.n <= 40);
      return word(`파란색 끈의 길이는 ${v.x.n} cm이고 빨간색 끈의 길이는 ${v.c} cm이다. 파란색 끈의 길이는 빨간색 끈의 길이의 몇 배인가?`, v, '배', `파란색 끈의 길이를 빨간색 끈의 길이로 나눈다. ${told(v.x, v.c)}(배)이다.`);
    }, { count: 2 }),
    T('w-avg', '문장제: 평균 구하기', '①59 ②71 ③67 심67', (d, n) => {
      if (n === 0) {
        // 소수 한 자리 수 넷의 평균: 합은 소수 한 자리 수이고 4로 나눈 몫은 소수 둘째 자리 안에서 나누어떨어진다.
        const vs = d.until(() => { const base = d.int(85, 115); return [0, 1, 2, 3].map(() => base + d.int(-12, 12)); }, (list) => new Set(list).size === 4 && list.every((w) => w % 10 !== 0) && list.reduce((s, w) => s + w, 0) % 2 === 0 && list.reduce((s, w) => s + w, 0) % 40 !== 0);
        const sum = dec(vs.reduce((s, w) => s + w, 0), 1), r = quo(sum, 4), p = d.pick(NAMES);
        return D(`${name(p, '이/가')} 50 m 달리기를 네 번 한 기록을 나타낸 표이다. 기록의 평균은 몇 초인가?`, V(r), {
          unit: '초', figure: table(['회', '기록(초)'], vs.map((w, i) => [`${i + 1}회`, fx(w, 1)])),
          explain: `기록의 합은 ${vs.map((w) => fx(w, 1)).join(' + ')} = ${S(sum)}(초)이다. 평균은 ${told(sum, 4)}(초)이다.`,
          facts: { calc: [[`(${vs.map((w) => fx(w, 1)).join('+')})/4`, 0]] }
        });
      }
      const [a, b] = d.until(() => [d.int(72, 98), d.int(72, 98)], ([p, q]) => (p + q) % 2 === 1 && Math.abs(p - q) >= 3), sum = nat(a + b);
      return D(`수학 시험을 두 번 보았더니 점수가 ${a}점, ${b}점이었다. 두 점수의 평균은 몇 점인가?`, V(quo(sum, 2)), {
        unit: '점', explain: `점수의 합은 ${a} + ${b} = ${a + b}(점)이다. 평균은 ${told(sum, 2)}(점)이다.`,
        facts: { calc: [[`(${a}+${b})/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('s-poly', '정다각형의 둘레로 한 변의 길이 구하기', '①54 ②63 ③62 심68', (d) => {
      const [shape, sides] = d.pick(POLY), v = gen(d, [sides], () => (d.bool() ? qd(d, 112, 989, 2) : qd(d, 12, 98, 2)), (w) => w.x.k >= 1 && w.x.n >= 100);
      return word(`둘레가 ${S(v.x)} cm인 ${shape}의 한 변의 길이는 몇 cm인가?`, v, 'cm', `${shape}은 길이가 같은 변이 ${sides}개이다. ${told(v.x, sides)}(cm)이다.`, { facts: { unseen: [sides] } });
    }),
    T('s-rect', '넓이와 한 변의 길이로 다른 변의 길이 구하기', '①55 ②65 ③65 심73', (d, n) => {
      // 첫째 문항은 직사각형의 세로, 둘째 문항은 평행사변형의 높이.
      const v = gen(d, C29, () => (d.bool() ? qd(d, 212, 989, 2) : qd(d, 21, 98, 2)), (w) => w.x.k >= 1 && w.x.n >= 100);
      if (n === 0) return word(`넓이가 ${S(v.x)} cm²이고 가로가 ${v.c} cm인 직사각형의 세로는 몇 cm인가?`, v, 'cm', `직사각형의 넓이는 가로와 세로의 곱이므로 세로는 넓이를 가로로 나눈 몫이다. ${told(v.x, v.c)}(cm)이다.`);
      return word(`넓이가 ${S(v.x)} cm²이고 밑변의 길이가 ${v.c} cm인 평행사변형의 높이는 몇 cm인가?`, v, 'cm', `평행사변형의 넓이는 밑변의 길이와 높이의 곱이므로 높이는 넓이를 밑변의 길이로 나눈 몫이다. ${told(v.x, v.c)}(cm)이다.`);
    }, { count: 2 }),
    T('s-part', '똑같이 나눈 도형의 한 칸의 넓이', '①57 ②59 ③66 심76', (d) => {
      const [parts, cols] = d.pick([[4, 4], [5, 5], [6, 3], [8, 4]]), v = gen(d, [parts], () => qd(d, 112, 989, 2), (w) => w.x.k >= 1 && plainQ(w.q));
      return word(`넓이가 ${S(v.x)} m²인 직사각형 모양의 밭을 그림과 같이 똑같이 ${parts}칸으로 나누었다. 색칠한 한 칸의 넓이는 몇 m²인가?`, v, 'm²', `전체 넓이를 칸 수로 나눈다. ${told(v.x, parts)}(m²)이다.`, { figure: pieces('grid', parts, { shaded: 1, cols }) });
    }),
    T('line-step', '수직선에서 작은 눈금 한 칸의 크기 구하기', '②79 ③51 심82', (d) => {
      const parts = d.pick([4, 5, 6, 8]), v = gen(d, [parts], () => qd(d, 12, 245, 2), (w) => w.x.k >= 1 && plainQ(w.q));
      return word(`수직선에서 0과 ${S(v.x)} 사이를 똑같이 ${parts}칸으로 나누었다. 작은 눈금 한 칸의 크기는?`, v, undefined, `두 수 사이의 거리 ${J(v.x, '을/를')} 칸 수 ${josa(parts, '으로/로')} 나눈다. ${told(v.x, parts)}이다.`, { figure: stepLine('0', S(v.x), parts) });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
