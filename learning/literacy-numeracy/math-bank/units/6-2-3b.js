// 6학년 2학기 3단원 소수의 나눗셈 — 어림하여 몫의 크기 알기, 몫의 크기 비교와 조건에 맞는 수, 몫을 반올림하여 나타내기, 나누어 주고 남는 양, 소수의 나눗셈의 활용(문장제·도형).
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 6-2-3a.js 에 있다. 실력 문항은 6-2-3c.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 교육과정: 「소수의 곱셈과 나눗셈에서 … 어림셈이 필요한 여러 가지 실생활 상황을 제시하여 어림셈의 필요성과 유용성을 알게 한다.」 — 어림으로 몫의 소수점 자리 찾기,
//   몫이 어느 자연수에 가까운지, 기준 수와 견주기, 1보다 작은 수로 나눌 때의 몫, 어림셈 문장제를 「어림하여 몫의 크기 알기」 한 묶음에 모았다. 어림하는 문항의 수는 일부러 계산하기 번거롭게 골랐다.
// 반올림: 나누어떨어지지 않는 나눗셈만 쓴다. 소수 둘째 자리까지 나타내는 것은 소수점을 옮긴 뒤 한 자리 수로 나눌 때만, 두 자리 수로 나눌 때는 일의 자리·소수 첫째 자리까지만 묻는다.
//   반올림한 수의 끝자리가 0이 되는 수(4.0, 2.30)는 쓰지 않는다. 자리는 언제나 정해 준다.
// 남는 양: 몫은 자연수까지만 구하고 남는 양은 소수이다(칸 둘). 남는 양의 소수점은 나누어지는 수의 처음 소수점 자리에 맞춘다.
// 문장제는 얼개마다 한 번씩 싣는다: 같은 양씩 덜어 내기, 걸리는 시간, 몇 배, 몇 배의 거꾸로(기준이 되는 양), 넓이와 한 변, 정다각형의 변의 수, 단위량(1 m의 무게, 1 kg의 값, 1 L로 가는 거리).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  // ── 함께 쓰는 도우미 시작(6-2-3a.js, 6-2-3b.js, 6-2-3c.js 에 똑같이 적는다. 파일마다 따로 닫혀 있어 함께 쓸 수 없다) ──
  const { josa, name, nick, NAMES, box, frac, lines, chain, numbers, cards, table, N, M, C, D } = B.kit;
  const STD = '6수01-15';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const LAB = ['㉠', '㉡', '㉢', '㉣'], THREE = LAB.slice(0, 3);
  const SIGNS = ['&gt;', '=', '&lt;'], GT = '&gt;', LT = '&lt;';
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SG = { '+': '+', '-': '−', '*': '×', '/': '÷', '=': '=', '>': GT, '<': LT };
  const ex = (html) => '<span class="mb-expr">' + html + '</span>';
  // 식 한 줄: 조각을 이어 적는다. '+', '-', '*', '/', '=', '>', '<' 은 기호로 바꾼다.
  const eq = (...parts) => ex(parts.map((p) => (typeof p === 'string' && SG[p] ? '<i>' + SG[p] + '</i>' : p)).join(' '));
  // 길어서 휴대폰 너비를 넘을 수 있는 식은 글씨를 조금 작게 적는다.
  const eqs = (...parts) => eq(...parts).replace('class="mb-expr"', 'class="mb-expr" style="font-size:1.02rem"');
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const tagged = (list, tags) => lines(list.map((html, i) => tag((tags || LAB)[i]) + html));
  const said = (who, text) => `${who}: 「${text}」`;
  const versus = (left, right) => `<div class="mb-versus">${left}<span class="mb-ring"></span>${right}</div>`;

  // ── 수 하나 ──
  // 수는 { n: 소수점을 뗀 자연수, k: 소수점 아래 자리 수 }로 다룬다(끝자리 0은 떼어 둔다). 2.35 = { n: 235, k: 2 }.
  const P10 = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000];
  const dec = (n, k) => { while (k > 0 && n % 10 === 0) { n /= 10; k -= 1; } return { n, k }; };
  const nat = (n) => ({ n, k: 0 });
  const fx = (n, k) => { const t = String(n).padStart(k + 1, '0'); return k ? t.slice(0, -k) + '.' + t.slice(-k) : t; };
  const S = (x) => fx(x.n, x.k);                 // 글에 적는 꼴
  const V = (x) => x.n / P10[x.k];               // 답 칸에 넣는 값
  const mulD = (a, b) => dec(a.n * b.n, a.k + b.k);                                    // 곱
  const plus = (x, y, sign) => { const K = Math.max(x.k, y.k); return dec(x.n * P10[K - x.k] + (sign || 1) * y.n * P10[K - y.k], K); };
  const sh = (x, e) => (e >= x.k ? nat(x.n * P10[e - x.k]) : { n: x.n, k: x.k - e });   // 10을 e번 곱한 수(소수점을 오른쪽으로 e자리 옮긴다)
  const sig = (x) => String(x.n).replace(/0+$/, '').length;                            // 소수점과 끝자리 0을 뗀 숫자의 수
  const less = (x, y) => x.n * P10[y.k] < y.n * P10[x.k];
  // x ÷ y 를 자연수의 분수 a / b 로 나타낸다(소수점을 떼어 같은 자리로 맞춘다).
  const frc = (x, y) => ({ a: x.n * P10[y.k], b: y.n * P10[x.k] });
  // 나눗셈: 소수 셋째 자리 안에서 나누어떨어지면 몫을, 아니면 null 을 돌려준다.
  const quo = (x, y) => { const f = frc(x, y); for (let K = 0; K <= 3; K += 1) if ((f.a * P10[K]) % f.b === 0) return dec(f.a * P10[K] / f.b, K); return null; };
  // 몫을 반올림하여 소수 p째 자리까지 나타낸 수(끝자리 0을 떼지 않는다), 소수 p째 자리까지만 구한 몫(글), 몫을 자연수까지 구했을 때의 몫과 남는 수
  const rnd = (x, y, p) => { const f = frc(x, y); return { n: Math.floor((2 * f.a * P10[p] + f.b) / (2 * f.b)), k: p }; };
  const cutq = (x, y, p) => { const f = frc(x, y); return fx(Math.floor(f.a * P10[p] / f.b), p); };
  const rest = (x, y) => { const f = frc(x, y), q = Math.floor(f.a / f.b); return { q, r: dec(f.a - q * f.b, x.k + y.k) }; };
  const endless = (x, y) => { const f = frc(x, y); return (f.a * 1000) % f.b !== 0; };      // 소수 셋째 자리까지 구해도 나누어떨어지지 않는다.
  // 토씨: 소수는 끝자리 숫자를 마지막에 읽는다(0.3은, 0.25는). 자연수를 적은 글에도 쓴다.
  const BATCHIM = [true, true, false, true, false, false, true, true, true, false], RIEUL = [false, true, false, false, false, false, false, true, true, false];
  const dj = (text, pair) => { const [yes, no] = pair.split('/'), k = Number(String(text).slice(-1)); return text + (yes === '으로' ? (BATCHIM[k] && !RIEUL[k] ? '으로' : '로') : BATCHIM[k] ? yes : no); };
  const J = (x, pair) => dj(S(x), pair);
  const part = (k) => frac(1, P10[k]);
  // 분수 뒤 토씨: 분자를 마지막에 읽는다(100분의 15는).
  const fj = (top, bottom, pair) => frac(top, bottom) + josa(top, pair).slice(String(top).length);
  const PLACES = ['', '한', '두'], NTH = ['일의 자리', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'];
  const nz = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  const digs = (n) => String(n).split('').map(Number);
  // 단위 기호 뒤 토씨(읽는 소리대로): m·cm·km·L·mL·m² 는 받침 없음, g·kg 은 받침 있음
  const uj = (unit, pair) => unit + pair.split('/')[/g$/.test(unit) ? 0 : 1];
  // 나누는 수: 소수 한 자리 수(0.□, □.□)와 소수 두 자리 수(0.0□, 0.□□). 소수점을 떼면 한두 자리 수이다.
  const Y = {
    s1: (d) => ({ n: d.int(2, 9), k: 1 }), b1: (d) => ({ n: nz(d, 11, 98), k: 1 }), a1: (d) => (d.bool() ? { n: d.int(2, 9), k: 1 } : { n: nz(d, 11, 98), k: 1 }),
    s2: (d) => ({ n: d.int(2, 9), k: 2 }), b2: (d) => ({ n: nz(d, 11, 98), k: 2 }), a2: (d) => (d.int(0, 2) === 0 ? { n: d.int(2, 9), k: 2 } : { n: nz(d, 11, 98), k: 2 })
  };
  // 몫 q 와 나누는 수 y 를 먼저 정하고 나누어지는 수 x 를 만든다(어떤 씨앗에서도 나누어떨어진다). 나누어지는 수는 소수 두 자리까지, 소수점과 끝자리 0을 뗀 숫자는 세 자리까지.
  const mk = (d, pickY, pickQ, ok) => d.until(() => { const y = pickY(d), q = pickQ(y); return { y, q, x: mulD(q, y) }; }, (v) => v.q.n > 0 && v.x.k <= 2 && sig(v.x) <= 3 && v.x.n < 10000 && (!ok || ok(v)));
  const qn = (d, lo, hi) => nat(d.int(lo, hi));
  const qd = (d, lo, hi, k) => ({ n: nz(d, lo, hi), k });

  // ── 검사가 다시 셈하는 식 ──
  // 소수 답은 글에 적힌 소수 그대로 나눈 식으로(검사가 소수 셋째 자리까지 맞춰 본다), 자연수 답과 견주기는 정수 식으로 적는다.
  // 수 하나를 소수점을 뗀 자연수로 적은 식: 2.35 → (2*100+35). 글에 없는 수(100, 소수 부분이 0으로 시작하는 05의 5)는 un 에 모은다.
  const ix = (x) => { if (!x.k) return { s: String(x.n), un: [] }; const w = Math.floor(x.n / P10[x.k]), f = x.n % P10[x.k]; return { s: `(${w}*${P10[x.k]}+${f})`, un: [P10[x.k]].concat(f < P10[x.k - 1] ? [f] : []) }; };
  // x ÷ y 를 자연수의 분수 a / b 로 적은 식
  const xab = (x, y) => { const i = ix(x), j = ix(y); return { a: y.k ? `${i.s}*${P10[y.k]}` : i.s, b: x.k ? `${j.s}*${P10[x.k]}` : j.s, un: i.un.concat(j.un, y.k ? [P10[y.k]] : [], x.k ? [P10[x.k]] : []) }; };
  const xq = (x, y) => { const f = xab(x, y); return { s: `(${f.a})/(${f.b})`, un: f.un }; };                                                   // 자연수로 떨어지는 몫
  const xmil = (x, y) => { const f = xab(x, y), g = frc(x, y); return { s: `(${f.a})*1000/(${f.b})`, un: f.un.concat([1000]), v: g.a * 1000 / g.b }; };   // 몫의 1000배
  const xfloor = (x, y) => { const f = xab(x, y); return { s: `((${f.a})-(${f.a})%(${f.b}))/(${f.b})`, un: f.un }; };                            // 몫의 자연수 부분
  const xrem = (x, y) => { const f = xab(x, y), p = P10[x.k + y.k]; return { s: `(${f.a})%(${f.b})/${p}`, un: f.un.concat([p]) }; };                 // 몫을 자연수까지 구했을 때 남는 수
  // 몫을 반올림하여 소수 p째 자리까지 나타낸 수. whole 이면 소수점을 뗀 자연수(10을 p번 곱한 수)로 적는다.
  const xround = (x, y, p, whole) => { const f = xab(x, y), top = `((${f.a})*${2 * P10[p]}+(${f.b}))`, low = `(2*(${f.b}))`; return { s: `(${top}-${top}%${low})/${low}` + (p && !whole ? `/${P10[p]}` : ''), un: f.un.concat([2, 2 * P10[p], P10[p]]) }; };
  const inp = (label, x, unit) => Object.assign({ label, answer: V(x) }, x.k ? { decimal: true } : {}, unit ? { unit } : {});
  // 몫 하나를 답하는 문항. 몫이 소수이면 소수 칸(식은 글에 적힌 수 그대로), 자연수이면 수 하나(정수 식)로 답한다.
  const ask = (text, x, y, o) => {
    const q = quo(x, y); if (!q) throw new Error('나누어떨어지지 않는다');
    const e = q.k ? { s: `${S(x)}/${S(y)}`, un: [] } : xq(x, y), f = Object.assign({}, o.facts || {});
    f.calc = [[e.s, 0]]; f.unseen = (f.unseen || []).concat(e.un);
    return (q.k ? D : N)(text, V(q), Object.assign({}, o, { facts: f }));
  };
  // 풀이 글: 소수점을 같은 자리만큼 옮겨 나누는 수를 자연수로 만든다.
  const how = (x, y) => { const q = quo(x, y); return y.k ? `나누어지는 수와 나누는 수의 소수점을 오른쪽으로 ${PLACES[y.k]} 자리씩 옮기면 ${S(sh(x, y.k))} ÷ ${y.n}이다. ${S(sh(x, y.k))} ÷ ${y.n} = ${S(q)}이다.` : `${S(x)} ÷ ${y.n} = ${S(q)}이다.`; };
  const told = (x, y) => `${S(x)} ÷ ${S(y)} = ${S(quo(x, y))}`;
  const CALC = '다음을 계산하시오.';
  // 여러 몫을 크기 차례로 늘어놓는 보기
  const orderChoice = (d, values, labels, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };

  // ── 그림 ──
  const PALE = 'color:#94a3b8', BLUE = 'color:#2563eb';
  const dot = (style) => `<span style="display:inline-block;width:0${style ? ';' + style : ''}">.</span>`;
  // 소수점이 한 자리 옮겨 가는 표시(숫자 아래의 작은 곡선)
  const HOP = '<span style="position:absolute;left:1px;right:-1px;bottom:0;height:5px;border:1.6px solid #2563eb;border-top:0;border-radius:0 0 9px 9px"></span>';
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
  // 세로셈에 적는 숫자 줄을 정한다. own: 나누어지는 수의 숫자, lift: 소수점을 옮기느라 붙인 0의 수, pad: 내려 쓴 0의 수, mv: 옮긴 소수점 바로 앞 칸(몫의 일의 자리 칸).
  // o.pad 를 주지 않으면 나누어떨어질 때까지(소수 셋째 자리 안에서) 0을 내려 쓴다. o.stop 이면 몫을 자연수까지만 구하고, o.upto 이면 앞의 몇 칸까지만 계산한다.
  // o.short 이면 나누어지는 수에 0을 붙이지 않고 소수점을 있는 자리만큼만 옮긴다(두 수의 소수점을 서로 다른 자리만큼 옮긴 잘못된 계산).
  function plan(y, x, o) {
    o = o || {};
    const s = y.k, c = y.n, xt = S(x), intLen = xt.split('.')[0].length, own = xt.replace('.', ''), lift = o.short ? 0 : Math.max(0, s - x.k), mv = intLen - 1 + (o.short ? Math.min(s, x.k) : s);
    let ds = own + '0'.repeat(lift), pad = 0;
    if (!o.stop && !o.upto) { if (o.pad !== undefined) pad = o.pad; else while (Number(ds + '0'.repeat(pad)) % c !== 0 && ds.length + pad - 1 - mv < 3) pad += 1; }
    ds += '0'.repeat(pad);
    const upto = o.stop ? mv + 1 : o.upto || ds.length;
    return { s, c, xt, intLen, own, lift, pad, mv, ds, n: ds.length, upto, work: ldiv(c, ds.slice(0, upto)) };
  }
  // 나누는 수가 소수인 나눗셈의 세로셈. y ) x 를 적는다(y 가 자연수이면 소수점을 옮기지 않는다).
  //  - o.shift: 소수점을 옮긴 표시를 그린다 — 처음 소수점은 옅게, 옮긴 소수점은 파랗게, 건너뛴 숫자 아래에는 작은 곡선, 옮기느라 붙인 0은 파랗게 적는다.
  //  - o.steps: 몫과 계산 과정도 적는다(소수점을 옮긴 표시도 함께 그린다). 몫의 소수점은 옮긴 소수점 자리에 맞추어 찍고, 내려 쓴 0은 옅게 적는다.
  //  - 빈칸: o.quot(몫을 가리는 이름표), o.rows({ 줄 번호: 이름표 }), o.rest(남는 수를 가리는 이름표). o.nodot: 몫에 소수점을 찍지 않는다.
  //  - o.given({ cells, dot }): 잘못 계산한 세로셈처럼 몫의 칸(자리마다 글자)과 소수점을 찍을 칸을 그대로 정해 줄 때 쓴다.
  //  - o.stop: 몫을 자연수까지만 구하고 남는 수를 적는다. 남는 수의 소수점은 나누어지는 수의 처음 소수점 자리에 찍는다(o.restDot: 'moved' 이면 옮긴 소수점 자리에 잘못 찍는다).
  //  - o.upto: 앞의 몇 칸까지만 계산하고 멈춘 세로셈(붙인 0을 계산하지 않아 몫의 끝자리 0을 빠뜨린 것).
  function sdiv(y, x, o) {
    o = o || {};
    const calcd = Boolean(o.steps), show = (calcd || Boolean(o.shift)) && y.k > 0, p = plan(y, x, calcd ? o : { pad: 0, short: o.short });
    const ds = show || calcd ? p.ds : p.own, n = ds.length, mv = show ? p.mv : p.intLen - 1, lift = show ? p.lift : 0, g = o.given || {}, hidden = o.rows || {};
    const rows = calcd ? p.work.rows.slice() : [];
    if (o.stop && rows.length && !rows[rows.length - 1].sub) rows.pop();
    // 몫
    const cells = g.cells || Array.from({ length: n }, (_, i) => { const v = p.work.quot[i]; return calcd && v !== null && v !== undefined ? String(v) : calcd && !o.stop && i >= mv && i < p.upto ? '0' : ''; });
    const qdot = o.nodot ? null : g.dot !== undefined ? g.dot : !o.stop && n - 1 > mv ? mv : null;
    const dotted = (i) => i === qdot && cells.slice(i + 1).some(Boolean);
    const quotText = cells.map((ch, i) => ch + (dotted(i) ? '.' : '')).join('');
    const line = (value, end, label, cls) => {
      const t = String(value), from = end - t.length + 1;
      let h = `<tr${cls ? ` class="${cls}"` : ''}><td></td><td></td>`;
      for (let col = 0; col < n; col += 1) {
        if (col < from || col > end) h += '<td></td>';
        else if (label !== undefined) { if (col === from) h += `<td colspan="${t.length}" class="mb-ld-blank">${box(label)}</td>`; }
        else h += `<td>${t[col - from]}</td>`;
      }
      return h + '</tr>';
    };
    let out = '';
    if (calcd) out += '<tr class="mb-ld-quot"><td></td><td></td>' + (o.quot !== undefined ? `<td colspan="${n}" class="mb-ld-blank">${box(o.quot)}</td>` : cells.map((ch, i) => `<td>${ch}${dotted(i) ? dot() : ''}</td>`).join('')) + '</tr>';
    // 나누는 수: 소수점을 옮긴 표시를 그릴 때는 숫자를 한 칸씩 띄워 곡선을 그린다.
    const yt = S(y), ydot = yt.indexOf('.');
    const left = show ? yt.split('').map((ch, i) => (ch === '.' ? `<span style="display:inline-block;width:0.3em;text-align:center;${PALE}">.</span>` : `<span style="position:relative;display:inline-block;width:0.68em;text-align:center">${ch}${i > ydot ? HOP : ''}</span>`)).join('') : yt;
    out += `<tr class="mb-ld-top"><td style="white-space:nowrap">${left}</td><td class="mb-ld-hook"></td>` + ds.split('').map((ch, i) => {
      const lifted = i >= p.own.length && i < p.own.length + lift, padded = i >= p.own.length + lift;
      let point = '';
      if (i === p.intLen - 1 && (x.k > 0 || show || n > p.own.length)) point += dot(show || x.k === 0 ? PALE : '');   // 처음 소수점(자연수이면 옅게)
      if (show && i === mv && i < n - 1) point += dot(BLUE);                                                           // 옮긴 소수점
      const hop = show && i >= p.intLen && i <= mv ? HOP : '';
      return `<td style="position:relative${lifted ? ';' + BLUE : padded ? ';' + PALE : ''}">${ch}${point}${hop}</td>`;
    }).join('') + (calcd || n > 1 ? '' : '<td></td>') + '</tr>';
    rows.forEach((row, k) => { out += line(row.value, row.end, hidden[k], row.sub ? 'mb-ld-sub' : ''); });
    // 남는 수: 끝 칸에 맞추어 적고, 소수점을 찍는 칸까지 앞에 0을 채운다.
    let restText = '';
    if (o.stop) {
      const tail = ds.slice(mv + 1), rem = String(p.work.rest * P10[tail.length] + Number(tail || 0)), at = o.restDot === 'moved' ? mv : p.intLen - 1, from = Math.min(at, n - rem.length);
      const marks = Array.from({ length: n }, (_, i) => (i < from ? '' : i < n - rem.length ? '0' : rem[i - (n - rem.length)]));
      restText = marks.map((ch, i) => ch + (i === at && at < n - 1 ? '.' : '')).join('');
      out += '<tr><td></td><td></td>' + (o.rest !== undefined
        ? '<td></td>'.repeat(from) + `<td colspan="${n - from}" class="mb-ld-blank">${box(o.rest)}</td>`
        : marks.map((ch, i) => `<td>${ch}${ch !== '' && i === at && at < n - 1 ? dot() : ''}</td>`).join('')) + '</tr>';
    }
    let process = '';
    if (calcd) {
      process = `, ${o.nodot ? `몫의 숫자 ${quotText}(소수점을 찍지 않았다)` : `몫 ${o.quot !== undefined ? '□' : quotText}`}, 계산 과정: ` + rows.map((row, k) => (hidden[k] !== undefined ? '□' : row.value)).join(', ');
      if (o.stop) process += `, 남는 수 ${o.rest !== undefined ? '□' : restText}`;
    }
    return `<table class="mb-longdiv" role="img" aria-label="나눗셈 세로셈 ${p.xt} 나누기 ${yt}${show ? (o.short ? `, 나누는 수의 소수점은 오른쪽으로 ${PLACES[y.k]} 자리, 나누어지는 수의 소수점은 오른쪽으로 ${PLACES[Math.min(y.k, x.k)]} 자리 옮김` : `, 소수점을 오른쪽으로 ${PLACES[y.k]} 자리씩 옮김`) : ''}${process}">${out}</table>`;
  }
  // 세로셈 과정의 줄을 검사가 다시 셈하는 식. x 에 0을 zeros 개 붙인 자연수를 c 로 나눈다(c 는 나누는 수 y 의 소수점을 뗀 수).
  function rowExprs(y, x, zeros) {
    const c = y.n, i0 = ix(x), base = zeros ? `${i0.s}*${P10[zeros]}` : i0.s, n = S(x).replace('.', '').length + zeros;
    const pre = (i) => (i === n - 1 ? `(${base})` : `((${base}-(${base})%${P10[n - 1 - i]})/${P10[n - 1 - i]})`);
    const fl = (e) => `((${e}-${e}%${c})/${c})`;
    return {
      of: (row) => (row.sub ? `${c}*(${fl(pre(row.at))}${row.at > 0 ? `-10*${fl(pre(row.at - 1))}` : ''})` : `${pre(row.end)}-${c}*${fl(pre(row.at))}*${P10[row.end - row.at]}`),
      un: i0.un.concat([10, 100, 1000, 10000, 100000], S(y).split('.').includes(String(c)) ? [] : [c])
    };
  }
  // 수직선: 0부터 total(0.1의 개수)까지 0.1마다 눈금을 긋고 0에서부터 step(0.1의 개수)씩 뛰어 센다.
  function hopLine(total, step) {
    const u = Math.min(15, 264 / total), x = (v) => (18 + v * u).toFixed(1), y = 40, word = 'style="font-size:13px;font-weight:600"';
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(total)}" y2="${y}"/>`;
    for (let v = 0; v <= total; v += 1) { const len = v % 10 === 0 || v === total ? 6.5 : 3.5; out += `<line class="mb-axis" x1="${x(v)}" y1="${y - len}" x2="${x(v)}" y2="${y + len}"/>`; }
    for (let v = 0; v <= total; v += 10) if (v === 0 || total - v >= 3) out += `<text class="mb-axis-label" ${word} x="${x(v)}" y="${y + 23}" text-anchor="middle">${v / 10}</text>`;
    out += `<text class="mb-axis-label" ${word} x="${x(total)}" y="${y + 23}" text-anchor="middle">${fx(total, 1)}</text>`;
    for (let v = 0; v + step <= total; v += step) out += `<path class="mb-jump" style="stroke-width:1.6" d="M${x(v)} ${y - 8}Q${x(v + step / 2)} ${y - 8 - Math.min(28, step * u * 0.6 + 8)} ${x(v + step)} ${y - 8}"/>`;
    const w = Math.ceil(36 + total * u);
    return `<svg class="mb-numberline" viewBox="0 0 ${w} 70" width="${w}" role="img" aria-label="수직선: 0부터 ${fx(total, 1)}까지 0.1마다 눈금을 긋고 0에서부터 ${fx(step, 1)}씩 뛰어 세었다.">${out}</svg>`;
  }
  // 숫자 사이에 소수점을 찍을 자리(㉠㉡㉢)를 적은 수
  const spots = (text) => ex(String(text).split('').map((ch, i) => (i ? `<span style="font-size:0.7em;color:#1d4ed8;margin:0 2px;vertical-align:-0.4em">${LAB[i - 1]}</span>` : '') + ch).join(''));
  // ── 함께 쓰는 도우미 끝 ──

  // 몫이 10을 몇 번 곱한 수 사이에 있는지 곱셈으로 어림하는 풀이 글: 2.8 × 1 = 2.8, 2.8 × 10 = 28이므로 몫은 1보다 크고 10보다 작다.
  const bound = (x, y) => {
    const f = frc(x, y), p = [-1, 0, 1, 2, 3].filter((e) => (e < 0 ? f.a * 10 >= f.b : f.a >= f.b * P10[e])).pop(), lo = p < 0 ? { n: 1, k: 1 } : nat(P10[p]), hi = p < 0 ? nat(1) : nat(P10[p + 1]);
    return `${S(y)} × ${S(lo)} = ${S(mulD(y, lo))}, ${S(y)} × ${S(hi)} = ${S(mulD(y, hi))}이므로 몫은 ${S(lo)}보다 크고 ${S(hi)}보다 작다.`;
  };
  // 가장 가까운 자연수로 어림하는 수: 자연수 w 에서 0.1~0.3(또는 0.4)만큼 떨어진 소수 한 자리 수
  const near1 = (d, w, far) => dec(w * 10 + d.pick([-1, 1]) * d.int(1, far || 3), 1);
  // 몫이 q 인 나눗셈 하나(나누는 수는 소수 한 자리 수)
  const pair = (d, q, ok) => d.until(() => { const y = Y.a1(d); return { y, q, x: mulD(q, y) }; }, (v) => v.x.k <= 2 && sig(v.x) <= 3 && v.x.n < 10000 && (!ok || ok(v)));
  const div = (v) => eq(S(v.x), '/', S(v.y));
  const unAll = (list) => list.reduce((all, e) => all.concat(e.un), []);
  // 나누는 수가 서로 다른 나눗셈 여럿. qs: 몫(소수점을 뗀 수, 소수 한 자리)
  const rowsOf = (d, qs) => d.until(() => qs.map((q) => pair(d, dec(q, 1))), (list) => new Set(list.map((v) => S(v.y))).size === list.length && new Set(list.map((v) => S(v.x))).size === list.length);

  // ── 어림하여 몫의 크기 알기 ──
  B.addTypes('6-2-3', 'est', [
    T('est-pick', '어림하여 소수점의 위치가 맞는 몫 고르기', '①26 ②30 ③31 심20', (d, n) => {
      // 첫째 문항은 (소수 두 자리 수)÷(소수 한 자리 수), 둘째 문항은 (자연수)÷(소수 두 자리 수), 셋째 문항은 1보다 작은 수로 나누는 (소수 한 자리 수)÷(소수 한 자리 수).
      // 보기는 숫자 배열이 같고 소수점의 위치만 다르다.
      const v = [
        () => mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2),
        () => mk(d, Y.a2, () => qn(d, 12, 98), (w) => w.x.k === 0 && w.x.n <= 99 && w.q.n % 10 !== 0),
        () => mk(d, Y.s1, () => qn(d, 12, 98), (w) => w.x.k === 1 && w.q.n % 10 !== 0)
      ][n](), rows = d.shuffle([dec(v.q.n, 2), dec(v.q.n, 1), nat(v.q.n), nat(v.q.n * 10)]), m = xmil(v.x, v.y);
      return C(`어림하여 ${S(v.x)} ÷ ${S(v.y)}의 몫을 찾으려고 한다. 알맞은 것은?`, rows.map(S), rows.findIndex((r) => r.n * P10[3 - r.k] === m.v), {
        explain: `${bound(v.x, v.y)} 알맞은 것은 ${S(v.q)}이다.`,
        facts: { pick: { expr: m.s, options: rows.map((r) => r.n * P10[3 - r.k]) }, unseen: m.un, rule: ['pickTwoOne', 'pickNat', 'pickSmall'][n] }
      });
    }, { count: 3 }),
    T('est-spot', '어림하여 몫에 소수점을 찍을 자리 고르기', '②30 ③31 심20', (d) => {
      // 몫의 숫자는 세 개이고 소수점은 ㉠(첫째 숫자 뒤)이나 ㉡(둘째 숫자 뒤)에 찍는다.
      const v = mk(d, Y.a1, () => qd(d, 105, 995, d.pick([1, 2]))), qs = String(v.q.n), hit = 2 - v.q.k, m = xmil(v.x, v.y);
      return C(`어림하여 ${S(v.x)} ÷ ${S(v.y)}의 몫에 소수점을 찍으려고 한다. 소수점을 찍어야 할 곳은?`, LAB.slice(0, 2), hit, {
        figure: eq(S(v.x), '/', S(v.y), '=') + spots(qs),
        explain: `${bound(v.x, v.y)} ${LAB[hit]}에 소수점을 찍으면 ${S(v.q)}이다.`,
        facts: { pick: { expr: m.s, options: [v.q.n * 10, v.q.n * 100] }, unseen: m.un }
      });
    }),
    T('est-range', '어림하여 몫이 1보다 크고 10보다 작은 나눗셈 찾기', '①26', (d) => {
      // 나누어지는 수는 숫자 배열이 같고 소수점의 위치만 다르다. 몫은 10배씩 차이 나므로 하나만 1과 10 사이에 있다.
      const m = d.until(() => { const y = Y.a1(d), n0 = nz(d, 105, 995); return { y, rows: d.shuffle([dec(n0, 2), dec(n0, 1), nat(n0)]) }; }, (w) => w.rows.filter((x) => { const f = frc(x, w.y); return f.a * 10 >= f.b * 13 && f.a * 10 <= f.b * 85; }).length === 1);
      const hit = m.rows.findIndex((x) => { const f = frc(x, m.y); return f.a > f.b && f.a < f.b * 10; });
      return C('어림하여 알아볼 때, 몫이 1보다 크고 10보다 작은 것은?', THREE, hit, {
        figure: tagged(m.rows.map((x) => eq(S(x), '/', S(m.y)))),
        explain: `${S(m.y)} × 1 = ${S(m.y)}, ${S(m.y)} × 10 = ${S(sh(m.y, 1))}이므로 나누어지는 수가 ${S(m.y)}보다 크고 ${S(sh(m.y, 1))}보다 작은 ${LAB[hit]}의 몫이 1보다 크고 10보다 작다.`,
        facts: { between: { low: '1', high: '10', exprs: m.rows.map((x) => `${S(x)}/${S(m.y)}`) } }
      });
    }),
    T('est-near', '곱셈식을 보고 몫이 어느 자연수에 더 가까운지 알기', '②31', (d) => {
      const m = d.until(() => { const y = Y.b1(d), W = d.int(2, 8), off = d.int(1, y.n * 10 - 1); return { y, W, off, x: dec(y.n * 10 * W + off, 2) }; }, (w) => Math.abs(w.off - w.y.n * 5) >= w.y.n * 2 && w.x.n < 10000);
      const lo = mulD(m.y, nat(m.W)), hi = mulD(m.y, nat(m.W + 1)), near = m.off < m.y.n * 5 ? 0 : 1;
      return C(`${S(m.y)} × ${m.W} = ${S(lo)}, ${S(m.y)} × ${m.W + 1} = ${S(hi)}이다. ${S(m.x)} ÷ ${S(m.y)}의 몫은 ${josa(m.W, '과/와')} ${m.W + 1} 가운데 어느 수에 더 가까운가?`, [String(m.W), String(m.W + 1)], near, {
        explain: `${J(m.x, '은/는')} ${J(lo, '과/와')} ${S(hi)} 가운데 ${S([lo, hi][near])}에 더 가깝다. 몫도 ${[m.W, m.W + 1][near]}에 더 가깝다.`,
        facts: { closer: { expr: `${S(m.x)}/${S(m.y)}`, estimates: [m.W, m.W + 1] } }
      });
    }),
    T('est-about', '어림하여 몫에 가장 가까운 수 고르기', '③32 ②34 심20', (d, n) => {
      if (n === 0) {
        // 두 수를 가장 가까운 자연수로 어림하면 자연수의 나눗셈이 된다. 틀린 보기는 몫과 2만큼 차이 난다.
        const m = d.until(() => { const c = d.int(3, 9), Q = d.int(3, 9); return { c, Q, y: near1(d, c), x: near1(d, c * Q, 4) }; }, (w) => Math.abs(V(w.x) / V(w.y) - w.Q) < 0.7), rows = d.shuffle([m.Q - 2, m.Q, m.Q + 2]);
        return C(`어림하여 ${S(m.x)} ÷ ${S(m.y)}의 몫에 가장 가까운 수를 찾으면?`, rows.map(String), rows.indexOf(m.Q), {
          explain: `${J(m.x, '을/를')} ${josa(m.c * m.Q, '으로/로')}, ${J(m.y, '을/를')} ${josa(m.c, '으로/로')} 어림하면 ${m.c * m.Q} ÷ ${m.c} = ${m.Q}이다. 몫은 ${m.Q}에 가장 가깝다.`,
          facts: { closer: { expr: `${S(m.x)}/${S(m.y)}`, estimates: rows } }
        });
      }
      // 문장제: 1 L로 갈 수 있는 거리. 틀린 보기에는 소수점을 잘못 찍은 값이 있다.
      const m = d.until(() => { const c = d.int(3, 6), Q = d.int(11, 19); return { c, Q, y: near1(d, c, 2), x: dec(c * Q * 100 + d.pick([-1, 1]) * d.int(4, 38), 2) }; }, (w) => Math.abs(V(w.x) / V(w.y) - w.Q) < 1.4 && w.x.k === 2);
      const rows = d.shuffle([nat(m.Q), dec(m.Q, 1), nat(m.Q - 5), nat(m.Q + 5)]);
      return C(`휘발유 ${S(m.y)} L로 ${S(m.x)} km를 가는 자동차가 있다. 어림하여 알아볼 때, 이 자동차가 휘발유 1 L로 갈 수 있는 거리에 가장 가까운 것은?`, rows.map((r) => `약 ${S(r)} km`), rows.findIndex((r) => r.k === 0 && r.n === m.Q), {
        explain: `${J(m.x, '을/를')} ${josa(m.c * m.Q, '으로/로')}, ${J(m.y, '을/를')} ${josa(m.c, '으로/로')} 어림하면 ${m.c * m.Q} ÷ ${m.c} = ${m.Q}이다. 휘발유 1 L로 약 ${m.Q} km를 갈 수 있다.`,
        facts: { closer: { expr: `${S(m.x)}/${S(m.y)}`, estimates: rows.map(V) } }
      });
    }, { count: 2 }),
    T('est-expr', '가까운 자연수로 어림하여 몫 구하기', '③33 ②35 심20', (d) => {
      const m = d.until(() => { const c = d.int(3, 9), Q = d.int(3, 9); return { c, Q, y: near1(d, c), x: dec(c * Q * 100 + d.pick([-1, 1]) * d.int(6, 42), 2) }; }, (w) => w.x.k === 2), R = m.c * m.Q;
      const rx = xround(m.x, nat(1), 0), ry = xround(m.y, nat(1), 0);
      return M(`${S(m.x)} ÷ ${J(m.y, '을/를')} 어림하여 계산하려고 한다. 두 수를 각각 가장 가까운 자연수로 어림할 때, ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], nat(R)), inp(LAB[1], nat(m.c)), inp(LAB[2], nat(m.Q))], {
        figure: lines([`${S(m.x)} ÷ ${S(m.y)}의 몫은 약 ${eq(box(LAB[0]), '/', box(LAB[1]), '=', box(LAB[2]))}`]),
        explain: `${J(m.x, '은/는')} ${R}에, ${J(m.y, '은/는')} ${m.c}에 가장 가깝다. ${R} ÷ ${m.c} = ${m.Q}이므로 몫은 약 ${m.Q}이다.`,
        facts: { calc: [[rx.s, 0], [ry.s, 1], [`(${rx.s})/(${ry.s})`, 2]], unseen: rx.un.concat(ry.un, [1]) }
      });
    }),
    T('est-above', '어림하여 몫을 기준 수와 비교하기', '②32 ③34', (d, n) => {
      if (n === 0) {
        // 나누어지는 수는 모두 (나누는 수)×(기준 수)에서 조금 크거나 작다. 하나만 다르다.
        const Tn = d.int(2, 9), big = d.bool(), flags = d.shuffle([true, false, false]);
        const rows = d.until(() => flags.map((flag) => { const y = Y.b1(d), s = flag === big ? 1 : -1, q = dec(Tn * 10 + s * d.int(2, 8), 1); return { y, s, x: mulD(q, y) }; }), (list) => new Set(list.map((v) => v.y.n)).size === 3 && list.every((v) => v.x.k === 2 && v.x.n < 10000)), hit = flags.indexOf(true);
        return C(`어림하여 몫이 ${Tn}보다 ${big ? '큰' : '작은'} 것을 찾으면?`, THREE, hit, {
          figure: tagged(rows.map(div)),
          explain: rows.map((v, i) => `${LAB[i]}의 나누어지는 수는 ${S(v.y)} × ${Tn} = ${S(mulD(v.y, nat(Tn)))}보다 ${v.s > 0 ? '크다' : '작다'}`).join('. ') + `. 몫이 ${Tn}보다 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
          facts: { choose: { exprs: rows.map((v) => `${S(v.x)}/${S(v.y)}`), rule: big ? 'onlyAbove' : 'onlyBelow', target: Tn } }
        });
      }
      // 두 나눗셈의 몫을 어림하여 비교한다. 두 수를 가장 가까운 자연수로 어림한 몫은 2 이상 차이 난다.
      const rows = d.until(() => { const qs = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2); return qs.map((Q) => { const c = d.int(3, 9); return { c, Q, y: near1(d, c, 2), x: near1(d, c * Q, 4) }; }); }, (list) => Math.abs(list[0].Q - list[1].Q) >= 2 && list[0].c !== list[1].c && list[0].c * list[0].Q !== list[1].c * list[1].Q && list.every((v) => Math.abs(V(v.x) / V(v.y) - v.Q) < 0.6));
      return C('두 수를 각각 가장 가까운 자연수로 어림하여 몫의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, rows[0].Q > rows[1].Q ? 0 : 2, {
        figure: versus(div(rows[0]), div(rows[1])),
        explain: rows.map((v) => `${S(v.x)} ÷ ${J(v.y, '은/는')} 약 ${v.c * v.Q} ÷ ${v.c} = ${v.Q}`).join('이고, ') + `이다. ${rows[0].Q} ${rows[0].Q > rows[1].Q ? GT : LT} ${rows[1].Q}이다.`,
        facts: { choose: { exprs: rows.map((v) => `${S(v.x)}/${S(v.y)}`), rule: 'compare' } }
      });
    }, { count: 2 }),
    T('est-max', '어림하여 몫이 가장 큰(작은) 나눗셈 찾기', '②32', (d) => {
      const big = d.bool(), rows = d.until(() => { const qs = d.shuffle([2, 4, 6, 8, 10, 12]).slice(0, 3); return qs.map((Q) => { const c = d.int(3, 9); return { c, Q, y: near1(d, c, 2), x: near1(d, c * Q, 4) }; }); }, (list) => list.every((v) => Math.abs(V(v.x) / V(v.y) - v.Q) < 0.7));
      const qs = rows.map((v) => v.Q), hit = qs.indexOf(big ? Math.max(...qs) : Math.min(...qs));
      return C(`어림하여 알아볼 때, 몫이 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
        figure: tagged(rows.map(div)),
        explain: rows.map((v, i) => `${LAB[i]}은 약 ${v.c * v.Q} ÷ ${v.c} = ${v.Q}`).join(', ') + `이다. 몫이 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: rows.map((v) => `${S(v.x)}/${S(v.y)}`), rule: big ? 'max' : 'min' } }
      });
    }),
    T('est-price', '문장제: 무게를 자연수로 어림하여 1 kg의 값 비교하기', '②33', (d) => {
      const m = d.until(() => { const [A, Bn] = d.shuffle([3, 4, 5, 6, 7, 8, 9]).slice(0, 2), ua = 100 * d.int(6, 15), ub = 100 * d.int(6, 15); return { A, Bn, ua, ub, a: near1(d, A, 2), b: near1(d, Bn, 2) }; }, (w) => Math.abs(w.ua - w.ub) >= 200 && (w.ua < w.ub) === (w.A * w.ua / V(w.a) < w.Bn * w.ub / V(w.b)) && Math.abs(w.A * w.ua / V(w.a) - w.Bn * w.ub / V(w.b)) >= 100);
      const pa = m.A * m.ua, pb = m.Bn * m.ub, cheap = m.ua < m.ub ? 0 : 1;
      return C(`가 가게에서는 콩 ${S(m.a)} kg을 ${pa}원에 팔고, 나 가게에서는 콩 ${S(m.b)} kg을 ${pb}원에 판다. 콩의 무게를 가장 가까운 자연수로 어림하여 계산할 때, 콩 1 kg의 값이 더 싼 가게는?`, ['가 가게', '나 가게'], cheap, {
        explain: `${J(m.a, '을/를')} ${josa(m.A, '으로/로')} 어림하면 가 가게의 콩 1 kg의 값은 약 ${pa} ÷ ${m.A} = ${m.ua}(원)이고, ${J(m.b, '을/를')} ${josa(m.Bn, '으로/로')} 어림하면 나 가게의 콩 1 kg의 값은 약 ${pb} ÷ ${m.Bn} = ${m.ub}(원)이다. ${['가', '나'][cheap]} 가게가 더 싸다.`,
        facts: { choose: { exprs: [`${pa}/${S(m.a)}`, `${pb}/${S(m.b)}`], rule: 'min' } }
      });
    }),
    T('est-word', '문장제: 어림셈으로 알아보기', '③35', (d, n) => {
      if (n === 0) {
        const c = d.int(3, 9), Q = d.int(4, 15), X = c * Q, y = near1(d, c, 2), ry = xround(y, nat(1), 0);
        return N(`소금 ${X} kg을 한 자루에 ${S(y)} kg씩 담으려고 한다. ${J(y, '을/를')} 가장 가까운 자연수로 어림하여 계산하면 소금을 담은 자루는 약 몇 개가 되는가?`, Q, {
          unit: '개', explain: `${J(y, '은/는')} ${c}에 가장 가깝다. ${X} ÷ ${c} = ${Q}이므로 자루는 약 ${Q}개가 된다.`,
          facts: { calc: [[`${X}/(${ry.s})`, 0]], unseen: ry.un.concat([1]) }
        });
      }
      // 한 개에 드는 양과 전체 양을 모두 쉬운 수와 견준다: 끈은 조금 길고 한 개에 드는 끈은 조금 짧으면 더 많이 만들 수 있다.
      const c = d.int(2, 5), cnt = d.pick([10, 20]), more = d.bool(), y = dec(c * 10 + (more ? -1 : 1) * d.int(1, 3), 1), x = dec(c * cnt * 10 + (more ? 1 : -1) * d.int(2, 9), 1);
      return C(`끈 ${S(x)} m를 ${S(y)} m씩 잘라 리본을 만들려고 한다. 어림하여 알아볼 때, 만들 수 있는 리본의 수로 옳은 것은?`, [`${cnt}개보다 많다.`, `${cnt}개보다 적다.`], more ? 0 : 1, {
        explain: `리본 한 개에 끈을 ${c} m씩 쓰면 ${c * cnt} m로 리본 ${cnt}개를 만든다. 끈은 ${c * cnt} m보다 ${more ? '길고' : '짧고'} 리본 한 개에 쓰는 끈은 ${c} m보다 ${more ? '짧으므로' : '길므로'} 리본을 ${cnt}개보다 ${more ? '많이' : '적게'} 만들 수 있다.`,
        facts: { choose: { exprs: [`${S(x)}/${S(y)}`, String(cnt)], rule: 'max' } }
      });
    }, { count: 2 }),
    T('est-wrong-point', '어림하여 소수점의 위치가 잘못된 계산 찾기', '②23·35 ③21·31 심18·20', (d) => {
      // 세 식 가운데 하나만 몫의 소수점을 한 자리 잘못 찍었다(바른 몫의 10배 또는 1/10배). 식마다 계산 구조가 다르다.
      const rows = d.shuffle([
        mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2),
        mk(d, Y.a1, () => qn(d, 12, 98), (w) => w.x.k === 0 && w.x.n <= 99 && w.q.n % 10 !== 0),
        mk(d, Y.s1, () => qn(d, 12, 98), (w) => w.x.k === 1 && w.q.n % 10 !== 0)
      ]), bad = d.int(0, 2), shown = rows.map((v, i) => (i !== bad ? v.q : d.bool() ? sh(v.q, 1) : dec(v.q.n, v.q.k + 1))), w = rows[bad];
      return C('어림하여 몫의 소수점의 위치가 잘못된 계산을 찾으면?', THREE, bad, {
        figure: tagged(rows.map((v, i) => eq(S(v.x), '/', S(v.y), '=', S(shown[i])))),
        explain: `${LAB[bad]}에서 ${bound(w.x, w.y)} ${J(shown[bad], '이/가')} 될 수 없다. 바르게 계산하면 ${told(w.x, w.y)}이다.`,
        facts: { claimed: rows.map((v, i) => [xmil(v.x, v.y).s, shown[i].n * P10[3 - shown[i].k]]), claimedWant: false }
      });
    }),
    T('est-less-one', '몫이 1보다 작아지는 나누는 수 고르기', '심21', (d) => {
      // 나누는 수가 나누어지는 수보다 크면 몫이 1보다 작다. 틀린 보기: 1보다 작은 소수(작은 수로 나누면 몫도 작다고 여긴다), 나누어지는 수보다 조금 작은 수.
      const x = dec(nz(d, 205, 5995), 2), t = Math.floor(x.n / 10), rows = d.shuffle([dec(nz(d, t + 4, Math.min(998, t + 400)), 1), dec(nz(d, 12, 98), 2), dec(nz(d, 11, t - 3), 1)]);
      const hit = rows.findIndex((y) => less(x, y));
      return C('□ 안에 넣었을 때 몫이 1보다 작아지는 수는?', rows.map(S), hit, {
        figure: eq(S(x), '/', box(), '<', 1),
        explain: `나누는 수가 나누어지는 수 ${S(x)}보다 크면 몫이 1보다 작다. ${S(x)}보다 큰 수는 ${S(rows[hit])}이다.`,
        facts: { choose: { exprs: rows.map((y) => `${S(x)}/${S(y)}`), rule: 'onlyBelow', target: 1 } }
      });
    }),
    T('est-bigger', '계산하지 않고 몫이 나누어지는 수보다 큰 나눗셈 찾기', '①27 ②12', (d) => {
      // 1보다 작은 수로 나누면 몫이 나누어지는 수보다 크다. 나누는 수 넷 가운데 하나만 1보다 작다.
      const x = dec(nz(d, 105, 995), 2), ys = d.until(() => d.shuffle([Y.s1(d), Y.b1(d), Y.b1(d), Y.b1(d)]), (list) => new Set(list.map((y) => y.n)).size === 4), hit = ys.findIndex((y) => y.n < 10);
      return C(`계산하지 않고 알아볼 때, 몫이 ${S(x)}보다 큰 것은?`, ys.map((y) => eq(S(x), '/', S(y))), hit, {
        explain: `1보다 작은 수로 나누면 몫이 나누어지는 수보다 크고, 1보다 큰 수로 나누면 몫이 나누어지는 수보다 작다. 나누는 수가 1보다 작은 것은 ${S(x)} ÷ ${S(ys[hit])}이다.`,
        facts: { choose: { exprs: ys.map((y) => `${S(x)}/${S(y)}`), rule: 'onlyAbove', target: V(x) } }
      });
    })
  ]);

  // ── 몫의 크기 비교와 조건에 맞는 수 ──
  B.addTypes('6-2-3', 'comp', [
    T('cp-sign', '두 몫의 크기 비교', '①21 ②26 ③26 심17', (d, n) => {
      let rows;
      if (n === 0) {
        // (소수)÷(소수) 둘. 네 번에 한 번은 몫이 같다.
        const q = d.int(12, 98), q2 = d.int(0, 3) === 0 ? q : d.until(() => q + d.pick([-1, 1]) * d.int(1, 9), (w) => w >= 11 && w <= 98);
        rows = d.until(() => rowsOf(d, [q, q2]), (list) => list.every((v) => v.x.k >= 1));
      } else if (n === 1) {
        // 한쪽은 자연수 하나
        const v = pair(d, dec(d.int(12, 98), 1), (w) => w.x.k >= 1), W = Math.floor(V(v.q)), k = nat(d.pick(v.q.k ? [W, W + 1] : [W - 1, W, W + 1]));
        rows = d.bool() ? [v, { x: k, y: nat(1), q: k, plain: true }] : [{ x: k, y: nat(1), q: k, plain: true }, v];
      } else {
        // (자연수)÷(소수) 둘
        rows = d.until(() => [0, 1].map(() => mk(d, Y.a1, () => (d.bool() ? qn(d, 2, 40) : qd(d, 12, 295, 1)), (w) => w.x.k === 0 && w.x.n <= 99)), ([p, q]) => S(p.x) !== S(q.x) && S(p.y) !== S(q.y) && Math.abs(V(p.q) - V(q.q)) <= 6);
      }
      const ms = rows.map((v) => xmil(v.x, v.y)), sign = ms[0].v > ms[1].v ? 0 : ms[0].v === ms[1].v ? 1 : 2, show = (v) => (v.plain ? ex(S(v.x)) : div(v));
      return C(['두 나눗셈의 몫의 크기를 비교할 때, ○ 안에 알맞은 것은?', '몫과 수의 크기를 비교할 때, ○ 안에 알맞은 것은?', '(자연수) ÷ (소수)의 몫의 크기를 비교할 때, ○ 안에 알맞은 것은?'][n], SIGNS, sign, {
        figure: versus(show(rows[0]), show(rows[1])),
        explain: `${rows.filter((v) => !v.plain).map((v) => told(v.x, v.y)).join(', ')}이다. ` + (sign === 1 ? (n === 1 ? '몫과 수가 같다.' : '두 몫은 같다.') : `${S(rows[0].q)} ${SIGNS[sign]} ${S(rows[1].q)}이다.`),
        facts: { choose: { exprs: ms.map((m) => m.s), rule: 'compare' }, unseen: unAll(ms).concat([1]), rule: ['signDec', 'signValue', 'signNat'][n] }
      });
    }, { count: 3 }),
    T('cp-max', '몫이 가장 큰(작은) 나눗셈 찾기', '①22 ②27 ③27 심17', (d) => {
      const q = d.int(15, 90), rows = rowsOf(d, d.shuffle([q, q + d.int(1, 5), q - d.int(1, 5)])), ms = rows.map((v) => xmil(v.x, v.y)), vals = ms.map((m) => m.v), big = d.bool(), hit = vals.indexOf(big ? Math.max(...vals) : Math.min(...vals));
      return C(`몫이 가장 ${big ? '큰' : '작은'} 것은?`, THREE, hit, {
        figure: tagged(rows.map(div)),
        explain: `몫은 ${rows.map((v, i) => `${LAB[i]} ${S(v.q)}`).join(', ')}이다. 가장 ${big ? '큰' : '작은'} 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: ms.map((m) => m.s), rule: big ? 'max' : 'min' }, unseen: unAll(ms) }
      });
    }),
    T('cp-order', '몫을 크기 차례로 늘어놓기', '①22 ②27 심17', (d) => {
      const q = d.int(15, 85), rows = rowsOf(d, d.shuffle([q, q + d.int(1, 6), q + d.int(7, 12)])), ms = rows.map((v) => xmil(v.x, v.y)), desc = d.bool(), choice = orderChoice(d, ms.map((m) => m.v), THREE, desc);
      return C(`몫이 ${desc ? '큰' : '작은'} 것부터 차례대로 쓴 것은?`, choice.options, choice.answer, {
        figure: tagged(rows.map(div)),
        explain: `몫은 ${rows.map((v, i) => `${LAB[i]} ${S(v.q)}`).join(', ')}이다. ${choice.right.map((i) => S(rows[i].q)).join(desc ? ` ${GT} ` : ` ${LT} `)}이다.`,
        facts: { choose: { exprs: ms.map((m) => m.s), rule: desc ? 'descending' : 'ascending', orders: choice.list }, unseen: unAll(ms) }
      });
    }),
    T('cp-nocalc', '나누어지는 수가 같을 때 계산하지 않고 몫의 크기 비교하기', '②8·27 ③27', (d) => {
      // 같은 수를 나눌 때 나누는 수가 작을수록 몫이 크다. 나누는 수에는 1보다 작은 수가 섞여 있다.
      const x = d.bool() ? nat(d.int(12, 96)) : dec(nz(d, 105, 995), 2), ys = d.until(() => d.shuffle([Y.s1(d), Y.b1(d), Y.b1(d)]), (list) => new Set(list.map((y) => y.n)).size === 3), big = d.bool(), ns = ys.map((y) => y.n), hit = ns.indexOf(big ? Math.min(...ns) : Math.max(...ns));
      return C(`나누어지는 수가 같은 세 나눗셈이 있다. 계산하지 않고 알아볼 때, 몫이 가장 ${big ? '큰' : '작은'} 것은?`, ys.map((y) => eq(S(x), '/', S(y))), hit, {
        explain: `같은 수를 나눌 때 나누는 수가 작을수록 몫이 크다. 나누는 수가 가장 ${big ? '작은' : '큰'} ${S(x)} ÷ ${S(ys[hit])}의 몫이 가장 ${big ? '크다' : '작다'}.`,
        facts: { choose: { exprs: ys.map((y) => `${S(x)}/${S(y)}`), rule: big ? 'max' : 'min' } }
      });
    }),
    T('cp-near', '몫이 주어진 자연수에 가장 가까운 나눗셈 찾기', '②27', (d) => {
      const Tn = d.int(2, 8), gaps = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8]).slice(0, 3), rows = rowsOf(d, gaps.map((g) => Tn * 10 + d.pick([-1, 1]) * g)), ms = rows.map((v) => xmil(v.x, v.y)), hit = gaps.indexOf(Math.min(...gaps));
      return C(`몫이 ${Tn}에 가장 가까운 것은?`, THREE, hit, {
        figure: tagged(rows.map(div)),
        explain: `몫은 ${rows.map((v, i) => `${LAB[i]} ${S(v.q)}`).join(', ')}이다. ${josa(Tn, '과/와')}의 차가 가장 작은 것은 ${LAB[hit]}이다.`,
        facts: { choose: { exprs: ms.map((m) => m.s), rule: 'nearest', target: Tn * 1000 }, unseen: unAll(ms) }
      });
    }),
    T('cp-odd', '몫이 다른 하나 찾기', '①22 ②28 ③28 심13', (d) => {
      // 두 식은 몫이 같고 한 식만 조금 다르다.
      const q = d.int(12, 98), q2 = d.until(() => q + d.pick([-10, -1, 1, 10]), (w) => w >= 11 && w <= 99), order = d.shuffle([0, 1, 2]), rows = rowsOf(d, order.map((i) => (i === 2 ? q2 : q))), ms = rows.map((v) => xmil(v.x, v.y)), hit = order.indexOf(2);
      return C('세 나눗셈을 계산할 때, 몫이 나머지와 다른 하나는?', THREE, hit, {
        figure: tagged(rows.map(div)),
        explain: `몫은 ${rows.map((v, i) => `${LAB[i]} ${S(v.q)}`).join(', ')}이다. ${LAB[hit]}만 다르다.`,
        facts: { choose: { exprs: ms.map((m) => m.s), rule: 'odd' }, unseen: unAll(ms) }
      });
    }),
    T('cp-target', '몫이 주어진 수인 나눗셈 찾기', '③29 심13', (d) => {
      // 틀린 보기의 몫은 주어진 수와 숫자 하나만 다르다.
      const q = d.int(15, 90), order = d.shuffle([q, q + d.pick([-1, 1]) * d.int(1, 3), q + d.pick([-10, 10])]), rows = rowsOf(d, order), ms = rows.map((v) => xmil(v.x, v.y)), hit = order.indexOf(q);
      return C(`몫이 ${S(rows[hit].q)}인 것은?`, rows.map(div), hit, {
        explain: `몫은 차례로 ${rows.map((v) => S(v.q)).join(', ')}이다.`,
        facts: { choose: { exprs: ms.map((m) => m.s), rule: 'equals', target: ms[hit].v }, unseen: unAll(ms) }
      });
    }),
    T('cp-match', '나눗셈과 몫 짝 짓기', '①23 ②28 ③29 심13', (d) => {
      const q = d.int(15, 80), rows = rowsOf(d, d.shuffle([q, q + d.int(2, 9), q + d.int(11, 18)])), ms = rows.map((v) => xmil(v.x, v.y)), list = d.shuffle(d.shuffle(ORDERS.slice(1)).slice(0, 3).concat([ORDERS[0]]));
      return C('나눗셈과 몫을 알맞게 짝 지은 것은?', list.map((o) => o.map((j, i) => `${LAB[i]} ${S(rows[j].q)}`).join(', ')), list.findIndex((o) => o.join() === '0,1,2'), {
        figure: tagged(rows.map(div)),
        explain: rows.map((v, i) => `${LAB[i]} ${told(v.x, v.y)}`).join(', ') + '이다.',
        facts: { match: { exprs: ms.map((m) => m.s), options: list.map((o) => o.map((j) => ms[j].v)) }, unseen: unAll(ms) }
      });
    }),
    T('cp-in-range', '몫이 두 수 사이에 있는 나눗셈 찾기', '③29 ①22', (d) => {
      const q = d.int(25, 85), lo = dec(q - 2, 1), hi = dec(q + 2, 1), order = d.shuffle([q, q - d.int(4, 9), q + d.int(4, 9)]), rows = rowsOf(d, order), hit = order.indexOf(q);
      return C(`몫이 ${S(lo)}보다 크고 ${S(hi)}보다 작은 것은?`, rows.map(div), hit, {
        explain: `몫은 차례로 ${rows.map((v) => S(v.q)).join(', ')}이다. ${S(lo)}보다 크고 ${S(hi)}보다 작은 몫은 ${S(rows[hit].q)}이다.`,
        facts: { between: { low: S(lo), high: S(hi), exprs: rows.map((v) => `${S(v.x)}/${S(v.y)}`) } }
      });
    }),
    T('cp-pick-div', '여러 수에서 골라 나누기', '①24 ②25 ③24 심12·16', (d, n) => {
      if (n === 0) {
        // 가장 큰 수(소수 두 자리 수)를 가장 작은 수(소수 한 자리 수)로 나눈다. 가운데 수는 가장 큰 수보다 조금 작은 소수 한 자리 수이다.
        const v = mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2 && Math.floor(w.x.n / 10) - w.y.n >= 5), top = Math.floor(v.x.n / 10), mid = dec(d.until(() => top - d.int(0, 3), (w) => w % 10 !== 0), 1);
        return ask('다음 수 가운데 가장 큰 수를 가장 작은 수로 나눈 몫은?', v.x, v.y, {
          figure: numbers(d.shuffle([S(v.x), S(mid), S(v.y)])),
          explain: `가장 큰 수는 ${S(v.x)}, 가장 작은 수는 ${S(v.y)}이다. ${told(v.x, v.y)}이다.`, facts: { rule: 'pickDec' }
        });
      }
      // 자연수를 소수로 나눈다(작은 수로 큰 수를 나눈다).
      const v = d.bool() ? mk(d, Y.a2, () => qn(d, 2, 300), (w) => w.x.k === 0 && w.x.n <= 99) : mk(d, Y.s1, () => qn(d, 2, 150), (w) => w.x.k === 0 && w.x.n <= 99);
      return ask('두 수 가운데 자연수를 소수로 나눈 몫은?', v.x, v.y, {
        figure: numbers(d.shuffle([S(v.x), S(v.y)])),
        explain: `자연수는 ${S(v.x)}, 소수는 ${S(v.y)}이다. ${how(v.x, v.y)}`, facts: { rule: 'pickNat' }
      });
    }, { count: 2 }),
    T('cp-chain', '이어서 두 번 나누기', '①25 ②24 ③25 심14', (d) => {
      const m = d.until(() => { const r = d.int(2, 30), y2 = Y.s1(d), mid = mulD(nat(r), y2), y1 = Y.b1(d); return { r, y2, mid, y1, x: mulD(mid, y1) }; }, (w) => w.mid.k === 1 && w.x.k === 2 && sig(w.x) <= 3 && w.y1.n !== w.y2.n);
      const i = ix(m.x), j1 = ix(m.y1), j2 = ix(m.y2);
      return M('㉠, ㉡에 알맞은 수는?', [inp(LAB[0], m.mid), inp(LAB[1], nat(m.r))], {
        figure: chain([S(m.x), `÷ ${S(m.y1)}`, box(LAB[0]), `÷ ${S(m.y2)}`, box(LAB[1])]),
        explain: `${S(m.x)} ÷ ${S(m.y1)} = ${S(m.mid)}이고, 이 수를 ${J(m.y2, '으로/로')} 나누면 ${S(m.mid)} ÷ ${S(m.y2)} = ${m.r}이다.`,
        facts: { calc: [[`${S(m.x)}/${S(m.y1)}`, 0], [`${i.s}/(${j1.s}*${j2.s})`, 1]], unseen: i.un.concat(j1.un, j2.un) }
      });
    }),
    T('cp-said', '말로 나타낸 두 수의 몫 구하기', '②29', (d) => {
      const m = d.until(() => { const b = d.int(2, 9), Q = nz(d, 12, 98); return { b, Q, A: b * Q }; }, (w) => w.A % 10 !== 0 && w.A >= 100);
      return N(`㉠은 ${m.A}의 ${part(1)}배인 수이고, ㉡은 0.1이 ${m.b}개인 수이다. ㉠ ÷ ㉡의 몫은?`, m.Q, {
        explain: `㉠은 ${fx(m.A, 1)}, ㉡은 ${fx(m.b, 1)}이다. ${fx(m.A, 1)} ÷ ${fx(m.b, 1)} = ${m.A} ÷ ${m.b} = ${m.Q}이다.`,
        facts: { calc: [[`${m.A}/${m.b}`, 0]] }
      });
    }),
    T('box-mul', '곱셈식에서 모르는 수 구하기', '①29 ②71 ③57 심22', (d, n) => {
      if (n === 0) {
        // 식으로 준다. 몫은 소수.
        const v = mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2), front = d.bool();
        return ask('□ 안에 알맞은 수는?', v.x, v.y, {
          figure: front ? eq(box(), '*', S(v.y), '=', S(v.x)) : eq(S(v.y), '*', box(), '=', S(v.x)),
          explain: `곱셈식을 나눗셈식으로 나타내면 □ = ${S(v.x)} ÷ ${S(v.y)}이다. ${told(v.x, v.y)}이다.`
        });
      }
      // 말로 준다. 곱이 자연수이고 몫도 자연수.
      const v = mk(d, Y.a1, () => qn(d, 2, 60), (w) => w.x.k === 0 && w.x.n <= 99 && w.x.n % 10 !== 0);
      return ask(`어떤 수에 ${J(v.y, '을/를')} 곱하였더니 ${josa(v.x.n, '이/가')} 되었다. 어떤 수는?`, v.x, v.y, {
        explain: `어떤 수는 ${josa(v.x.n, '을/를')} ${J(v.y, '으로/로')} 나눈 몫이다. ${told(v.x, v.y)}이다.`
      });
    }, { count: 2 }),
    T('box-div', '나눗셈식에서 모르는 나누는 수 구하기', '①29 ③58 심22', (d, n) => {
      if (n === 0) {
        // 식으로 준다. □는 자연수: 8.4 ÷ □ = 1.2
        const v = mk(d, Y.b1, () => qn(d, 2, 9), (w) => w.x.k === 1);
        return ask('□ 안에 알맞은 수는?', v.x, v.y, {
          figure: eq(S(v.x), '/', box(), '=', S(v.y)),
          explain: `나누는 수는 나누어지는 수를 몫으로 나누어 구한다. □ = ${S(v.x)} ÷ ${S(v.y)} = ${v.q.n}이다.`
        });
      }
      // 말로 준다. 어떤 수는 소수: 7.28을 어떤 수로 나누었더니 5.2
      const v = mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2);
      return ask(`${J(v.x, '을/를')} 어떤 수로 나누었더니 ${J(v.y, '이/가')} 되었다. 어떤 수는?`, v.x, v.y, {
        explain: `어떤 수는 ${J(v.x, '을/를')} 몫 ${J(v.y, '으로/로')} 나누어 구한다. ${told(v.x, v.y)}이다.`
      });
    }, { count: 2 }),
    T('box-nat', '몫과 비교하는 □ 안의 자연수', '①28 ②74 ③60 심23', (d, n) => {
      const v = mk(d, Y.a1, () => qd(d, 21, 98, 1), (w) => w.x.k >= 1), W = Math.floor(V(v.q)), f = xab(v.x, v.y);
      if (n === 0) {
        return N('□ 안에 들어갈 수 있는 가장 큰 자연수는?', W, {
          figure: eq(S(v.x), '/', S(v.y), '>', box()),
          explain: `${told(v.x, v.y)}이다. ${S(v.q)}보다 작은 자연수 가운데 가장 큰 수는 ${W}이다.`,
          facts: { digit: { template: `${f.a}>□*(${f.b})`, lo: 1, hi: W + 3, ask: 'max' } }
        });
      }
      if (n === 1) {
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', W, {
          unit: '개', figure: eq(box(), '<', S(v.x), '/', S(v.y)),
          explain: `${told(v.x, v.y)}이다. □는 ${S(v.q)}보다 작은 자연수이므로 1부터 ${W}까지 ${W}개이다.`,
          facts: { digit: { template: `□*(${f.b})<${f.a}`, lo: 1, hi: W + 3, ask: 'count' } }
        });
      }
      return N('□ 안에 들어갈 수 있는 가장 작은 자연수는?', W + 1, {
        figure: eq(S(v.x), '/', S(v.y), '<', box()),
        explain: `${told(v.x, v.y)}이다. ${S(v.q)}보다 큰 자연수 가운데 가장 작은 수는 ${W + 1}이다.`,
        facts: { digit: { template: `${f.a}<□*(${f.b})`, lo: 1, hi: W + 4, ask: 'min' } }
      });
    }, { count: 3 }),
    T('box-check', '몫에 나누는 수를 곱하여 나누어지는 수의 빈 숫자 찾기', '③19', (d) => {
      // 나누어지는 수의 소수 첫째 자리나 둘째 자리 숫자 하나를 가렸다. (나누는 수) × (몫)으로 되찾는다.
      const first = d.bool(), v = mk(d, Y.b2, () => qn(d, 2, 39), (w) => w.x.k === 2 && w.x.n >= 100 && (first ? Math.floor(w.x.n / 10) % 10 : w.x.n % 10) !== 0);
      const W = Math.floor(v.x.n / 100), t = Math.floor(v.x.n / 10) % 10, h = v.x.n % 10, j = ix(v.y);
      return N('□ 안에 알맞은 숫자는?', first ? t : h, {
        figure: eq(first ? `${W}.${box()}${h}` : `${W}.${t}${box()}`, '/', S(v.y), '=', v.q.n),
        explain: `나누는 수에 몫을 곱하면 나누어지는 수가 된다. ${S(v.y)} × ${v.q.n} = ${S(v.x)}이므로 □ 안에 알맞은 숫자는 ${first ? t : h}이다.`,
        facts: { calc: [[first ? `(${j.s}*${v.q.n}-${W}*100-${h})/10` : `${j.s}*${v.q.n}-${W}*100-${t}*10`, 0]], unseen: j.un.concat([100, 10]) }
      });
    }),
    T('card-pick', '수를 골라 몫이 가장 큰(작은) (자연수)÷(소수) 만들기', '②75 ③24', (d, n) => {
      // 자연수 둘과 소수 둘에서 하나씩 고른다. 몫이 가장 크려면 큰 자연수를 작은 소수로, 가장 작으려면 작은 자연수를 큰 소수로 나눈다.
      const m = d.until(() => { const [y1, y2] = [Y.a1(d), Y.b1(d)].sort((p, q) => p.n - q.n), n2 = mulD(nat(d.int(2, 60)), y1), n1 = mulD(nat(d.int(2, 30)), y2); return { y1, y2, n1, n2 }; }, (w) => w.y1.n < w.y2.n && w.n1.k === 0 && w.n2.k === 0 && w.n1.n < w.n2.n && w.n2.n <= 99 && w.n1.n >= 2 && quo(w.n2, w.y1).n % 10 !== 0 && quo(w.n1, w.y2).n % 10 !== 0);
      const [x, y] = n === 0 ? [m.n2, m.y1] : [m.n1, m.y2];
      return ask(`다음 수 가운데 자연수 하나와 소수 하나를 골라 (자연수) ÷ (소수)의 나눗셈식을 만들려고 한다. 몫이 가장 ${n === 0 ? '클' : '작을'} 때의 몫은?`, x, y, {
        figure: numbers(d.shuffle([S(m.n1), S(m.n2), S(m.y1), S(m.y2)])),
        explain: `몫이 가장 ${n === 0 ? '크려면 나누어지는 수는 가장 크게, 나누는 수는 가장 작게' : '작으려면 나누어지는 수는 가장 작게, 나누는 수는 가장 크게'} 한다. ${told(x, y)}이다.`
      });
    }, { count: 2 })
  ]);

  // ── 몫을 반올림하여 나타내기 ──
  // 반올림 문항의 수: 나누어떨어지지 않고, 소수로 나타낸 값의 끝자리가 0이 아니다(ps 의 자리마다).
  const rmk = (d, pick, ps, ok) => d.until(() => { const [x, y] = pick(); return { x, y, r: ps.map((p) => rnd(x, y, p)) }; }, (v) => endless(v.x, v.y) && v.r.every((r) => r.n > 0 && (r.k === 0 || r.n % 10 !== 0)) && (!ok || ok(v)));
  const R = (r) => fx(r.n, r.k);
  const NAT3679 = (d) => nat(d.pick([3, 6, 7, 9]));
  // 풀이 글: 구하려는 자리보다 한 자리 아래까지 구해 반올림한다.
  const why = (x, y, p) => { const c = cutq(x, y, p + 1), g = Number(c.slice(-1)), r = R(rnd(x, y, p)); return `${S(x)} ÷ ${S(y)} = ${c}…이다. ${NTH[p + 1]} 숫자가 ${g}이므로 ${g >= 5 ? '올려서' : '버려서'} ${dj(r, '으로/로')} 나타낸다.`; };
  // 반올림한 몫 하나를 답하는 문항
  const rAsk = (text, v, p, o) => { const e = xround(v.x, v.y, p), r = v.r[0], f = Object.assign({ calc: [[e.s, 0]] }, o.facts || {}); f.unseen = (f.unseen || []).concat(e.un); return (p ? D : N)(text, r.n / P10[p], Object.assign({ explain: why(v.x, v.y, p) }, o, { facts: f })); };
  const roundType = (id, title, ref, p, specs) => T(id, title, ref, (d, n) => {
    const sp = specs[n], v = rmk(d, () => sp.pick(d), [p], sp.ok);
    return rAsk(`몫을 반올림하여 ${NTH[p]}까지 나타내시오.`, v, p, { figure: sp.col ? sdiv(v.y, v.x) : eq(S(v.x), '/', S(v.y)), facts: { rule: sp.rule } });
  }, { count: specs.length });
  const bigger = (v) => less(v.y, v.x);
  B.addTypes('6-2-3', 'round', [
    T('rd-three', '한 몫을 여러 자리까지 반올림하여 나타내기', '①49 ②38 ③36 심33', (d, n) => {
      // 첫째 문항은 (소수)÷(소수), 둘째 문항은 (자연수)÷(자연수). 소수 셋째 자리까지 구하므로 옮긴 뒤 한 자리 수로 나눈다.
      const v = rmk(d, () => (n === 0 ? [dec(nz(d, 12, 98), 1), Y.s1(d)] : [nat(d.int(5, 40)), NAT3679(d)]), [0, 1, 2], bigger), es = [0, 1, 2].map((p) => xround(v.x, v.y, p));
      return M('몫을 반올림하여 일의 자리, 소수 첫째 자리, 소수 둘째 자리까지 각각 나타내려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?', v.r.map((r, p) => Object.assign({ label: LAB[p], answer: r.n / P10[p] }, p ? { decimal: true } : {})), {
        figure: lines([eq(S(v.x), '/', S(v.y)), `일의 자리까지: ${box(LAB[0])}`, `소수 첫째 자리까지: ${box(LAB[1])}`, `소수 둘째 자리까지: ${box(LAB[2])}`]),
        explain: `${S(v.x)} ÷ ${S(v.y)} = ${cutq(v.x, v.y, 3)}…이다. 구하려는 자리 바로 아래 자리에서 반올림하면 차례로 ${v.r.map(R).join(', ')}이다.`,
        facts: { calc: es.map((e, p) => [e.s, p]), unseen: unAll(es) }
      });
    }, { count: 2 }),
    T('rd-given', '소수로 구해 둔 몫을 반올림하여 나타내기', '①49 ②39 ③36', (d) => {
      const p = d.pick([1, 2]), v = rmk(d, () => [dec(nz(d, 21, 98), 1), Y.b1(d)], [p], bigger);
      return rAsk(`${S(v.x)} ÷ ${S(v.y)}의 몫을 ${NTH[p + 1]}까지 구하였더니 ${cutq(v.x, v.y, p + 1)}…이었다. 몫을 반올림하여 ${NTH[p]}까지 나타내면?`, v, p, {});
    }),
    roundType('rd-one', '몫을 반올림하여 소수 첫째 자리까지 나타내기', '①50 ②36·37 ③37 심33', 1, [
      { rule: 'r1NatOne', pick: (d) => [nat(d.int(2, 40)), Y.s1(d)] },                                              // 23 ÷ 0.7
      { rule: 'r1OneOne', col: true, pick: (d) => [dec(nz(d, 21, 398), 1), Y.b1(d)], ok: bigger },                              // 11.2 ÷ 2.6
      { rule: 'r1Nat', pick: (d) => [d.bool() ? nat(d.int(2, 40)) : dec(nz(d, 12, 98), 1), NAT3679(d)] }            // 8.6 ÷ 3, 2 ÷ 6
    ]),
    roundType('rd-zero', '몫을 반올림하여 일의 자리까지 나타내기', '①50 ②36 ③36', 0, [
      { rule: 'r0One', pick: (d) => [dec(nz(d, 21, 98), 1), Y.s1(d)] },                                              // 6.5 ÷ 0.3
      { rule: 'r0NatOne', pick: (d) => [nat(d.int(11, 60)), Y.b1(d)], ok: bigger }                                   // 21 ÷ 3.6
    ]),
    roundType('rd-two', '몫을 반올림하여 소수 둘째 자리까지 나타내기', '①51 ②36·37 ③37 심33', 2, [
      { rule: 'r2One', pick: (d) => [dec(nz(d, 4, 98), 1), Y.s1(d)] },                                               // 2.9 ÷ 0.3
      { rule: 'r2Nat', pick: (d) => [d.bool() ? nat(d.int(2, 30)) : dec(nz(d, 21, 698), 1), NAT3679(d)] },          // 8 ÷ 3, 43.6 ÷ 9
      { rule: 'r2TwoOne', col: true, pick: (d) => [dec(nz(d, 105, 695), 2), Y.s1(d)] }                                          // 1.15 ÷ 0.3
    ]),
    T('rd-compare', '반올림하여 나타낸 수와 몫의 크기 비교', '②41 ③38 심36', (d) => {
      // 올려서 나타냈으면 몫보다 크고, 버려서 나타냈으면 몫보다 작다.
      const p = d.pick([0, 1]), v = rmk(d, () => [nat(d.int(3, 30)), d.bool() ? Y.b1(d) : NAT3679(d)], [p], bigger), f = frc(v.x, v.y), up = v.r[0].n * f.b > f.a * P10[p], e = xround(v.x, v.y, p);
      return C(`${S(v.x)} ÷ ${S(v.y)}의 몫을 반올림하여 ${NTH[p]}까지 나타낸 수를 ㉠, ${S(v.x)} ÷ ${S(v.y)}의 몫을 ㉡이라고 할 때, ○ 안에 알맞은 것은?`, SIGNS, up ? 0 : 2, {
        figure: versus(ex('㉠'), ex('㉡')),
        explain: `${why(v.x, v.y, p)} ${up ? '올려서' : '버려서'} 나타내었으므로 ㉠은 ㉡보다 ${up ? '크다' : '작다'}.`,
        facts: { choose: { exprs: [e.s, `${S(v.x)}/${S(v.y)}`], rule: 'compare' }, unseen: e.un }
      });
    }),
    T('rd-wrong', '몫을 반올림하여 잘못 나타낸 사람 찾기', '①53 ②44 ③40 심34', (d) => {
      // 세 사람이 일의 자리, 소수 첫째 자리, 소수 둘째 자리까지 나타내었다. 한 사람만 올려야 할 것을 버리거나 버려야 할 것을 올렸다.
      const bad = d.int(0, 2), who = d.shuffle(NAMES).slice(0, 3);
      const v = rmk(d, () => (d.bool() ? [dec(nz(d, 12, 98), 1), Y.s1(d)] : [nat(d.int(5, 40)), NAT3679(d)]), [0, 1, 2], (w) => { const g = Number(cutq(w.x, w.y, bad + 1).slice(-1)), slip = w.r[bad].n + (g >= 5 ? -1 : 1); return less(w.y, w.x) && slip > 0 && (bad === 0 || slip % 10 !== 0); });
      const g = Number(cutq(v.x, v.y, bad + 1).slice(-1)), shown = v.r.map((r, p) => (p === bad ? r.n + (g >= 5 ? -1 : 1) : r.n));
      return C(`${S(v.x)} ÷ ${S(v.y)}의 몫을 반올림하여 나타낸 것을 말하였다. 잘못 말한 사람은?`, who, bad, {
        figure: lines(shown.map((s, p) => said(who[p], `${NTH[p]}까지 나타내면 ${fx(s, p)}이다.`))),
        explain: `${S(v.x)} ÷ ${S(v.y)} = ${cutq(v.x, v.y, 3)}…이다. ${NTH[bad]}까지 나타내려면 ${NTH[bad + 1]} 숫자 ${josa(g, '을/를')} ${g >= 5 ? '올려' : '버려'} ${dj(R(v.r[bad]), '으로/로')} 나타내야 한다.`,
        facts: { claimed: shown.map((s, p) => [xround(v.x, v.y, p, true).s, s]), claimedWant: false }
      });
    }),
    T('rd-times', '문장제: 몇 배인지 반올림하여 나타내기', '①54 ②45 ③42 심38', (d, n) => {
      if (n === 0) {
        const v = rmk(d, () => [dec(nz(d, 21, 98), 1), Y.b1(d)], [1], bigger);
        return rAsk(`빨간색 테이프의 길이는 ${S(v.x)} m이고 파란색 테이프의 길이는 ${S(v.y)} m이다. 빨간색 테이프의 길이는 파란색 테이프의 길이의 몇 배인지 반올림하여 소수 첫째 자리까지 나타내시오.`, v, 1, { unit: '배' });
      }
      // (자연수)÷(자연수): 나누는 수는 두 자리 수
      const v = rmk(d, () => [nat(d.int(21, 60)), nat(d.int(11, 19))], [1], bigger);
      return rAsk(`도서관에 동화책이 ${v.x.n}권, 위인전이 ${v.y.n}권 있다. 동화책의 수는 위인전의 수의 몇 배인지 반올림하여 소수 첫째 자리까지 나타내시오.`, v, 1, { unit: '배' });
    }, { count: 2 }),
    T('rd-unit', '문장제: 1 m의 무게를 반올림하여 나타내기', '①55 ③43 심39', (d) => {
      const v = rmk(d, () => [dec(nz(d, 12, 58), 1), Y.s1(d)], [2]);
      return rAsk(`굵기가 일정한 쇠막대 ${S(v.y)} m의 무게가 ${S(v.x)} kg이다. 이 쇠막대 1 m의 무게는 몇 kg인지 반올림하여 소수 둘째 자리까지 나타내시오.`, v, 2, { unit: 'kg' });
    }),
    T('rd-share', '문장제: 똑같이 나눈 한 몫을 반올림하여 나타내기', '②46 ③43 ①55', (d) => {
      const v = rmk(d, () => [dec(nz(d, 12, 98), 1), NAT3679(d)], [2]);
      return rAsk(`물 ${S(v.x)} L를 ${v.y.n}명이 똑같이 나누어 마시려고 한다. 한 명이 마시는 물은 몇 L인지 반올림하여 소수 둘째 자리까지 나타내시오.`, v, 2, { unit: 'L' });
    }),
    T('rd-rect', '넓이와 밑변의 길이로 높이를 구해 반올림하여 나타내기', '①55 ③43', (d) => {
      const v = rmk(d, () => [nat(d.int(11, 60)), NAT3679(d)], [1], bigger);
      return rAsk(`넓이가 ${v.x.n} cm²이고 밑변의 길이가 ${v.y.n} cm인 평행사변형의 높이는 몇 cm인지 반올림하여 소수 첫째 자리까지 나타내시오.`, v, 1, { unit: 'cm' });
    })
  ]);

  // ── 나누어 주고 남는 양 ──
  // 몫을 자연수까지 구하고 남는 수가 있는 나눗셈: x = y × q + r (0 < r < y). 남는 수는 소수이다.
  const smk = (d, pickY, pickQ, pickR, ok) => d.until(() => { const y = pickY(d), q = pickQ(y), r = pickR(y); return { y, q, r, x: plus(mulD(y, nat(q)), r) }; }, (v) => v.r.n > 0 && v.r.k >= 1 && less(v.r, v.y) && v.x.k >= 1 && v.x.k <= 2 && sig(v.x) <= 3 && (!ok || ok(v)));
  const natY = (lo, hi) => (d) => nat(d.int(lo, hi));
  const r1 = (d) => (y) => dec(d.int(1, y.n * P10[1 - y.k] - 1), 1);          // 소수 한 자리 수인 남는 수
  const r2 = (d) => (y) => ({ n: nz(d, 1, y.n * P10[2 - y.k] - 1), k: 2 });   // 소수 두 자리 수인 남는 수
  // 몫과 남는 수를 답하는 칸 둘
  const two = (v, a, b) => [Object.assign({ label: a[0], answer: v.q }, a[1] ? { unit: a[1] } : {}), Object.assign({ label: b[0], answer: V(v.r), decimal: true }, b[1] ? { unit: b[1] } : {})];
  const restFacts = (v, more) => { const e = xfloor(v.x, v.y), g = xrem(v.x, v.y); return Object.assign({ calc: [[e.s, 0], [g.s, 1]], unseen: e.un.concat(g.un) }, more || {}); };
  const restWhy = (v) => (v.y.k ? `소수점을 오른쪽으로 ${PLACES[v.y.k]} 자리씩 옮겨 ${S(sh(v.x, v.y.k))} ÷ ${josa(v.y.n, '을/를')} 계산하면 몫의 자연수 부분은 ${v.q}이다. ` : `${S(v.x)} ÷ ${v.y.n}의 몫을 자연수까지 구하면 ${v.q}이다. `) + `남는 수는 ${S(v.x)} − ${S(v.y)} × ${v.q} = ${S(v.r)}이다.`;
  B.addTypes('6-2-3', 'rest', [
    T('rs-expr', '몫을 자연수까지 구하고 남는 수 구하기', '①58 ②50 ③49', (d, n) => {
      // 첫째 문항은 (소수 한 자리 수)÷(자연수), 둘째 문항은 (소수 한 자리 수)÷(소수 한 자리 수), 셋째 문항은 (소수 두 자리 수)÷(소수 한 자리 수).
      const v = [() => smk(d, natY(3, 9), () => d.int(2, 12), r1(d)), () => smk(d, Y.b1, () => d.int(2, 9), r1(d)), () => smk(d, Y.b1, () => d.int(2, 9), r2(d), (w) => w.x.k === 2)][n]();
      return M('몫을 자연수까지 구하고 그때의 남는 수를 구하시오.', two(v, ['몫'], ['남는 수']), {
        figure: eq(S(v.x), '/', S(v.y)), explain: restWhy(v), facts: restFacts(v, { rule: ['restNat', 'restOne', 'restTwo'][n] })
      });
    }, { count: 3 }),
    T('rs-minus', '뺄셈으로 덜어 내어 나누어 줄 수 있는 수와 남는 양 구하기', '①59 ②49 ③47 심45', (d, n) => {
      // 첫째 문항은 자연수씩, 둘째 문항은 소수씩 덜어 낸다. 더 뺄 수 없을 때까지 뺀 횟수가 몫이고 남은 수가 남는 양이다.
      const v = n === 0 ? smk(d, natY(2, 6), () => d.int(3, 4), r1(d)) : smk(d, (dd) => ({ n: dd.int(3, 9), k: 1 }), () => d.int(3, 4), r1(d)), e = xfloor(v.x, v.y);
      const parts = [S(v.x)]; for (let i = 0; i < v.q; i += 1) parts.push('-', S(v.y));
      const [thing, unit, one, rest0] = n === 0 ? ['끈', 'm', `한 사람에게 ${S(v.y)} m씩 나누어 주려고`, `나누어 줄 수 있는 사람은 ${box(LAB[1])}명이고, 남는 끈은 ${box(LAB[0])} m이다.`] : ['설탕', 'kg', `한 봉지에 ${S(v.y)} kg씩 담으려고`, `담을 수 있는 봉지는 ${box(LAB[1])}개이고, 남는 설탕은 ${box(LAB[0])} kg이다.`];
      return M(`${thing} ${S(v.x)} ${uj(unit, '을/를')} ${one} 한다. 뺄셈식을 보고 ㉠, ㉡에 알맞은 수를 구하시오.`, [inp(LAB[0], v.r), inp(LAB[1], nat(v.q))], {
        figure: lines([eqs(...parts, '=', box(LAB[0])), rest0]),
        explain: `${S(v.x)}에서 ${J(v.y, '을/를')} ${v.q}번 빼면 ${J(v.r, '이/가')} 남고, 더 뺄 수 없다. 뺀 횟수가 몫이고 남은 수가 남는 양이다.`,
        facts: { calc: [[parts.join(''), 0], [e.s, 1]], unseen: e.un }
      });
    }, { count: 2 }),
    T('rs-col', '세로셈으로 나누어 줄 수 있는 수와 남는 양 구하기', '①60 ②50 ③48 심45', (d, n) => {
      // 첫째 문항은 자연수로, 둘째 문항은 소수로 나눈다. 남는 수의 소수점은 나누어지는 수의 처음 소수점 자리에 맞추어 찍는다.
      const v = n === 0 ? smk(d, natY(3, 9), () => d.int(2, 12), r1(d)) : smk(d, Y.a1, () => d.int(2, 9), r1(d), (w) => w.x.k === 1);
      const text = n === 0 ? `물 ${S(v.x)} L를 한 병에 ${S(v.y)} L씩 담으려고 세로로 계산한 것이다. 담을 수 있는 병의 수 ㉠과 남는 물의 양 ㉡은?` : `밀가루 ${S(v.x)} kg을 한 사람에게 ${S(v.y)} kg씩 나누어 주려고 세로로 계산한 것이다. 나누어 줄 수 있는 사람 수 ㉠과 남는 밀가루의 양 ㉡은?`;
      return M(text, two(v, [LAB[0], n === 0 ? '개' : '명'], [LAB[1], n === 0 ? 'L' : 'kg']), {
        figure: sdiv(v.y, v.x, { steps: true, stop: true, quot: LAB[0], rest: LAB[1] }),
        explain: `${restWhy(v)} 남는 수의 소수점은 나누어지는 수의 처음 소수점 자리에 맞추어 찍는다.`, facts: restFacts(v)
      });
    }, { count: 2 }),
    T('rs-word-nat', '문장제: 자연수씩 나누어 주고 남는 양', '①60 ②50 ③50 심45', (d) => {
      const v = smk(d, natY(3, 9), () => d.int(2, 12), r1(d));
      return M(`감자 ${S(v.x)} kg을 자루 한 개에 ${S(v.y)} kg씩 가득 담으려고 한다. 가득 담은 자루는 몇 개이고, 남는 감자는 몇 kg인가?`, two(v, ['자루', '개'], ['남는 감자', 'kg']), {
        explain: `자루의 수는 소수로 나타낼 수 없으므로 몫을 자연수까지만 구한다. ${restWhy(v)}`, facts: restFacts(v)
      });
    }),
    T('rs-word-dec', '문장제: 소수씩 나누어 주고 남는 양', '①61 ②51 ③51 심46', (d, n) => {
      if (n === 0) {
        // (소수 한 자리 수)÷(소수 한 자리 수)
        const v = smk(d, Y.b1, () => d.int(2, 9), r1(d));
        return M(`보리 ${S(v.x)} kg을 한 봉지에 ${S(v.y)} kg씩 담으려고 한다. 담을 수 있는 봉지는 몇 개이고, 남는 보리는 몇 kg인가?`, two(v, ['봉지', '개'], ['남는 보리', 'kg']), { explain: restWhy(v), facts: restFacts(v) });
      }
      // (소수 두 자리 수)÷(소수 한 자리 수): 남는 양은 소수 두 자리 수
      const v = smk(d, Y.a1, () => d.int(2, 9), r2(d), (w) => w.x.k === 2);
      return M(`끈 ${S(v.x)} m를 한 도막이 ${S(v.y)} m가 되도록 자르려고 한다. 자를 수 있는 도막은 몇 개이고, 남는 끈은 몇 m인가?`, two(v, ['도막', '개'], ['남는 끈', 'm']), { explain: restWhy(v), facts: restFacts(v) });
    }, { count: 2 }),
    T('rs-count', '문장제: 몇 개까지 만들 수 있는지 구하기', '②55 ③50 심50', (d) => {
      const m = d.until(() => { const y = dec(nz(d, 35, 98), 1), X = d.int(20, 95); return { y, x: nat(X), t: rest(nat(X), y) }; }, (w) => w.t.r.n > 0 && w.t.q >= 2), e = xfloor(m.x, m.y);
      return N(`쿠키 한 개를 만드는 데 버터 ${S(m.y)} g이 필요하다. 버터 ${m.x.n} g으로 쿠키를 몇 개까지 만들 수 있는가?`, m.t.q, {
        unit: '개', explain: `${m.x.n} ÷ ${S(m.y)} = ${cutq(m.x, m.y, 1)}…이다. 쿠키의 수는 소수로 나타낼 수 없으므로 몫의 자연수 부분인 ${m.t.q}개까지 만들 수 있다.`,
        facts: { calc: [[e.s, 0]], unseen: e.un }
      });
    }),
    T('rs-check', '몫과 남는 수가 맞는지 확인하는 식', '①62 ②53 ③55', (d) => {
      const v = smk(d, Y.b1, () => d.int(2, 15), r1(d));
      return M(`${S(v.x)} ÷ ${S(v.y)}의 몫을 자연수까지 구하고, 계산 결과가 맞는지 확인하는 식을 썼다. ㉠, ㉡에 알맞은 수는?`, two(v, [LAB[0]], [LAB[1]]), {
        figure: eq(S(v.y), '*', box(LAB[0]), '+', box(LAB[1]), '=', S(v.x)),
        explain: `${restWhy(v)} 나누는 수에 몫을 곱하고 남는 수를 더하면 나누어지는 수가 된다. ${S(v.y)} × ${v.q} + ${S(v.r)} = ${S(v.x)}이다.`, facts: restFacts(v)
      });
    }),
    T('rs-pick', '나누어 줄 수 있는 수와 남는 양을 바르게 구한 사람 찾기', '②52 ①63', (d) => {
      // 틀린 말: 한 번 더 나누어 줄 수 있는데 멈춘 것(남는 양이 한 사람 몫보다 많다), 남는 양의 소수점을 잘못 찍은 것.
      const v = smk(d, Y.b1, () => d.int(3, 9), r1(d)), who = d.shuffle(NAMES).slice(0, 3), a = v.x.n, b = v.y.n, r = v.r.n;
      const rows = d.shuffle([[v.q, r], [v.q - 1, r + b], [v.q, r * 10]]), hit = rows.findIndex((row) => row[0] === v.q && row[1] === r);
      return C(`리본 ${S(v.x)} m를 한 사람에게 ${S(v.y)} m씩 나누어 주려고 한다. 나누어 줄 수 있는 사람 수와 남는 리본의 길이를 바르게 말한 사람은?`, who, hit, {
        figure: lines(rows.map((row, i) => said(who[i], `${row[0]}명에게 나누어 줄 수 있고, ${S(dec(row[1], 1))} m가 남는다.`))),
        explain: `${restWhy(v)} 남는 리본은 한 사람에게 주는 ${S(v.y)} m보다 짧아야 한다.`,
        facts: { remainders: rows.map(() => [a, b]), said: rows, want: 'right' }
      });
    })
  ]);

  // ── 소수의 나눗셈의 활용 ──
  const POLY = [['정삼각형', 3], ['정사각형', 4], ['정오각형', 5], ['정육각형', 6], ['정팔각형', 8]];
  const word = (text, v, unit, explain) => ask(text, v.x, v.y, { unit, explain });
  B.addTypes('6-2-3', 'word', [
    T('w-pack', '문장제: 같은 양씩 덜어 담기', '①31 ②57 ③63 심58', (d, n) => {
      if (n === 0) {
        const v = mk(d, Y.b2, () => qn(d, 2, 39), (w) => w.x.k === 2 && w.x.n >= 100 && w.q.n % 10 !== 0);
        return word(`주스 ${S(v.x)} L를 병 한 개에 ${S(v.y)} L씩 나누어 담으려고 한다. 필요한 병은 몇 개인가?`, v, '개', `주스의 양을 병 한 개에 담는 양으로 나눈다. ${told(v.x, v.y)}(개)이다.`);
      }
      const v = mk(d, Y.b1, () => qn(d, 2, 49), (w) => w.x.k === 0 && w.x.n <= 99 && w.x.n % 10 !== 0 && w.q.n % 10 !== 0);
      return word(`길이가 ${v.x.n} cm인 색 테이프를 ${S(v.y)} cm씩 자르면 모두 몇 도막이 되는가?`, v, '도막', `색 테이프의 길이를 한 도막의 길이로 나눈다. ${told(v.x, v.y)}(도막)이다.`);
    }, { count: 2 }),
    T('w-time', '문장제: 걸리는 시간 구하기', '①32 ②63 ③66', (d, n) => {
      if (n === 0) {
        const v = mk(d, Y.b1, () => qn(d, 3, 29), (w) => w.x.k === 1 && w.q.n % 10 !== 0);
        return word(`1분에 ${S(v.y)} L씩 물이 나오는 수도로 물 ${S(v.x)} L를 받으려면 몇 분이 걸리는가?`, v, '분', `받으려는 물의 양을 1분에 나오는 물의 양으로 나눈다. ${told(v.x, v.y)}(분)이다.`);
      }
      const v = mk(d, (dd) => ({ n: nz(dd, 21, 59), k: 1 }), () => qd(d, 12, 58, 1), (w) => w.x.k >= 1), p = d.pick(NAMES);
      return word(`${name(p, '은/는')} 일정한 빠르기로 1시간에 ${S(v.y)} km를 걷는다. 같은 빠르기로 ${S(v.x)} km를 걷는 데 걸리는 시간은 몇 시간인가?`, v, '시간', `걷는 거리를 1시간에 걷는 거리로 나눈다. ${told(v.x, v.y)}(시간)이다.`);
    }, { count: 2 }),
    T('w-times', '문장제: 몇 배인지 구하기', '①33 ②59 ③64 심59', (d, n) => {
      if (n === 0) {
        const v = mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2);
        return word(`수박의 무게는 ${S(v.x)} kg이고 멜론의 무게는 ${S(v.y)} kg이다. 수박의 무게는 멜론의 무게의 몇 배인가?`, v, '배', `수박의 무게를 멜론의 무게로 나눈다. ${told(v.x, v.y)}(배)이다.`);
      }
      // 표에서 가장 무거운 것과 가장 가벼운 것을 골라 나눈다.
      const v = mk(d, Y.s1, () => qn(d, 12, 48), (w) => w.x.k === 1 && w.q.n % 10 !== 0), mid = dec(d.until(() => d.int(v.y.n + 3, v.x.n - 3), (w) => w % 10 !== 0), 1), rows = d.shuffle([v.x, mid, v.y]);
      return ask('세 상자의 무게를 나타낸 표이다. 가장 무거운 상자의 무게는 가장 가벼운 상자의 무게의 몇 배인가?', v.x, v.y, {
        unit: '배', figure: table(['상자', '무게(kg)'], rows.map((r, i) => [['가', '나', '다'][i], S(r)])),
        explain: `가장 무거운 상자는 ${S(v.x)} kg, 가장 가벼운 상자는 ${S(v.y)} kg이다. ${told(v.x, v.y)}(배)이다.`
      });
    }, { count: 2 }),
    T('w-base', '문장제: 몇 배인 관계에서 기준이 되는 양 구하기', '①34 ②61 심60', (d) => {
      const v = mk(d, (dd) => ({ n: nz(dd, 11, 29), k: 1 }), () => qd(d, 52, 198, 1), (w) => w.x.k === 1);
      return word(`붓의 길이는 ${S(v.x)} cm이고, 이것은 연필의 길이의 ${S(v.y)}배이다. 연필의 길이는 몇 cm인가?`, v, 'cm', `(연필의 길이) × ${S(v.y)} = ${S(v.x)}이므로 연필의 길이는 붓의 길이를 ${J(v.y, '으로/로')} 나눈 몫이다. ${told(v.x, v.y)}(cm)이다.`);
    }),
    T('w-rect', '넓이와 한 변의 길이로 다른 변의 길이 구하기', '①35 ②66 ③67 심71', (d, n) => {
      // 첫째 문항은 직사각형의 가로(몫이 자연수), 둘째 문항은 평행사변형의 밑변의 길이(몫이 소수).
      if (n === 0) {
        const v = mk(d, Y.a2, () => qn(d, 2, 39), (w) => w.x.k === 2);
        return word(`넓이가 ${S(v.x)} m²이고 세로가 ${S(v.y)} m인 직사각형의 가로는 몇 m인가?`, v, 'm', `직사각형의 넓이는 가로와 세로의 곱이므로 가로는 넓이를 세로로 나눈 몫이다. ${told(v.x, v.y)}(m)이다.`);
      }
      const v = mk(d, Y.b1, () => qd(d, 12, 98, 1), (w) => w.x.k === 2);
      return word(`넓이가 ${S(v.x)} cm²이고 높이가 ${S(v.y)} cm인 평행사변형의 밑변의 길이는 몇 cm인가?`, v, 'cm', `평행사변형의 넓이는 밑변의 길이와 높이의 곱이므로 밑변의 길이는 넓이를 높이로 나눈 몫이다. ${told(v.x, v.y)}(cm)이다.`);
    }, { count: 2 }),
    T('w-poly', '둘레와 한 변의 길이로 정다각형의 이름 알기', '①36 ②67 심56', (d) => {
      const at = d.int(0, POLY.length - 1), sides = POLY[at][1], y = d.until(() => Y.b1(d), (w) => sig(mulD(w, nat(sides))) <= 3), x = mulD(y, nat(sides)), e = xq(x, y);
      const drop = d.until(() => d.int(0, POLY.length - 1), (w) => w !== at), list = POLY.filter((_, i) => i !== drop);
      return C(`한 변의 길이가 ${S(y)} cm이고 둘레가 ${S(x)} cm인 정다각형이 있다. 이 정다각형의 이름은?`, list.map((p) => p[0]), list.findIndex((p) => p[1] === sides), {
        explain: `정다각형은 변의 길이가 모두 같으므로 변의 수는 둘레를 한 변의 길이로 나눈 몫이다. ${S(x)} ÷ ${S(y)} = ${sides}이므로 ${POLY[at][0]}이다.`,
        facts: { pick: { expr: e.s, options: list.map((p) => p[1]) }, unseen: e.un }
      });
    }),
    T('w-unit', '문장제: 하나에 해당하는 양 구하기', '②63 ③65 심63', (d, n) => {
      if (n === 0) {
        const v = mk(d, Y.b1, () => qn(d, 2, 49), (w) => w.x.k === 0 && w.x.n <= 99 && w.x.n % 10 !== 0 && w.q.n % 10 !== 0);
        return word(`굵기가 일정한 통나무 ${S(v.y)} m의 무게가 ${v.x.n} kg이다. 이 통나무 1 m의 무게는 몇 kg인가?`, v, 'kg', `통나무의 무게를 통나무의 길이로 나눈다. ${told(v.x, v.y)}(kg)이다.`);
      }
      if (n === 1) {
        // 1 kg의 값: 값이 네 자리 수가 된다.
        const m = d.until(() => { const y = Y.s1(d), U = 500 * d.int(4, 19); return { y, U, P: U * y.n / 10 }; }, (w) => w.P % 100 === 0);
        return ask(`젤리 ${S(m.y)} kg의 값이 ${m.P}원이다. 같은 젤리 1 kg의 값은 얼마인가?`, nat(m.P), m.y, { unit: '원', explain: `젤리의 값을 젤리의 무게로 나눈다. ${m.P} ÷ ${S(m.y)} = ${m.P * 10} ÷ ${m.y.n} = ${m.U}(원)이다.` });
      }
      const v = mk(d, Y.b1, () => qd(d, 52, 195, 1), (w) => w.x.k >= 1);
      return word(`휘발유 ${S(v.y)} L로 ${S(v.x)} km를 가는 자동차가 있다. 이 자동차가 휘발유 1 L로 갈 수 있는 거리는 몇 km인가?`, v, 'km', `간 거리를 사용한 휘발유의 양으로 나눈다. ${told(v.x, v.y)}(km)이다.`);
    }, { count: 3 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
