// 6학년 2학기 3단원 소수의 나눗셈 — 실력 문항.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 6-2-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 나누면 언제나 작아진다고 여긴다. 1보다 작은 수로 나누면 몫이 나누어지는 수보다 커진다는 것을 나누는 수와 1의 크기로 가리지 못하고, 나누어지는 수가 1보다 작으면 몫도 작다고 여긴다.
//  - 「두 수를 똑같이 옮기면 몫은 그대로」를 숫자 배열만 보고 쓴다. 한쪽만 옮기거나 서로 다른 자리만큼 옮긴 식(86.4 ÷ 0.24)의 몫도 처음 몫과 같다고 한다.
//  - 세로셈에서 몫의 숫자는 바르게 구하고도 소수점을 나누어지는 수의 처음 소수점 자리에 찍는다. 소수점을 옮기며 붙인 0을 계산하지 않고 멈추거나, 나누어지는 수에 0을 붙이지 않고 있는 자리만큼만 옮긴다.
//  - 몫을 자연수까지 구하고 남는 양을 적을 때 세로셈에 남은 숫자(옮긴 소수점 기준)를 그대로 적는다(2.1 kg을 21 kg으로, 0.99 kg을 9.9 kg으로).
//    몫을 끝까지 나누어 구한 소수 부분을 남는 양으로 읽기도 한다(8.4병이면 0.4 L가 남는다고 한다).
//  - 「소수 첫째 자리까지 나타내시오」를 소수 첫째 자리까지만 계산하고 멈추라는 말로 읽는다(한 자리 더 구해 반올림해야 한다).
//  - 「가득 채운 병의 수」(버림)와 「남김없이 담는 데 필요한 병의 수」(올림)를 가르지 못하고 언제나 몫의 자연수 부분만 답한다.
//  - 무엇을 무엇으로 나누는지 가리지 못하고 문장에 나온 차례대로, 또는 큰 수를 작은 수로 나눈다(1 m의 무게와 1 kg의 길이). 단위가 다른 두 양을 그대로 나누고, 묻는 것과 상관없는 수로 나눈다.
//  - 몫이 꼭 자연수로 떨어질 때 「그보다 큰(작은) 자연수」에 그 수를 넣어 센다.
//
// 실력에는 ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(어떤 수를 한 번 거꾸로 구해 바르게 계산하기,
// 두 몫 사이의 □, 몫과 견주는 소수의 □, 수 카드로 몫이 가장 큰 식 만들기, 단위량을 구해 한 번 더 나누기, 빼고 나서 나누기, 1 kg의 값 견주기, 반올림한 두 값 견주기,
// 담고 남은 양으로 한 번 더 셈하기, 한쪽을 먼저 계산하는 □, 시간을 소수로 고쳐 나누기)만 실었다. 기본에서 하는 나눗셈 한 번·반올림 한 번을 고르기로 바꾼 것은 싣지 않았다.
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

  const R = (r) => fx(r.n, r.k);
  const NAT3679 = (d) => nat(d.pick([3, 6, 7, 9]));
  // 몫이 q 인 나눗셈 하나(나누는 수는 소수 한 자리 수)
  const pair = (d, q, ok) => d.until(() => { const y = Y.a1(d); return { y, q, x: mulD(q, y) }; }, (v) => v.x.k <= 2 && sig(v.x) <= 3 && v.x.n < 10000 && (!ok || ok(v)));
  // 몫을 자연수까지 구하고 남는 수가 있는 나눗셈: x = y × q + r (0 < r < y). 남는 수는 소수이다.
  const smk = (d, pickY, pickQ, pickR, ok) => d.until(() => { const y = pickY(d), q = pickQ(y), r = pickR(y); return { y, q, r, x: plus(mulD(y, nat(q)), r) }; }, (v) => v.r.n > 0 && v.r.k >= 1 && less(v.r, v.y) && v.x.k >= 1 && v.x.k <= 2 && sig(v.x) <= 3 && (!ok || ok(v)));
  const r1 = (d) => (y) => dec(d.int(1, y.n * P10[1 - y.k] - 1), 1);
  const r2 = (d) => (y) => ({ n: nz(d, 1, y.n * P10[2 - y.k] - 1), k: 2 });
  // 수 하나를 0.01의 개수(자연수)로 적은 식
  const cent = (x) => { const i = ix(x); return { s: x.k === 2 ? i.s : `${i.s}*${P10[2 - x.k]}`, un: i.un.concat([P10[2 - x.k]]) }; };

  B.addGroup('6-2-3', {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 상황·그림·수에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-bigger-count', '계산하지 않고 몫이 나누어지는 수보다 큰 나눗셈 세기', '기본 ①27 ②12 / 심26·31·39·61', (d) => {
        // 함정: 나누는 수가 1에 아주 가깝고(0.96, 1.04), 나누어지는 수가 1보다 작은 식(0.84 ÷ 0.6)과 자연수인 식이 섞여 있다. 「나누면 작아진다」고 여기는 아이, 나누어지는 수가 작으면
        //  몫도 작다고 여기는 아이, 소수로 나누면 언제나 커진다고 여기는 아이(1.04로 나누어도 커진다고 한다)가 걸린다. 나누는 수가 1보다 작은 것만 센다.
        const small = () => (d.bool() ? dec(nz(d, 86, 99), 2) : Y.s1(d)), big = () => (d.bool() ? dec(nz(d, 101, 114), 2) : dec(nz(d, 11, 29), 1));
        const xs = () => d.pick([() => nat(d.int(2, 60)), () => dec(nz(d, 12, 98), 1), () => dec(nz(d, 12, 98), 2), () => dec(nz(d, 105, 995), 2)])();
        const rows = d.until(() => d.shuffle([true, false, d.bool(), d.bool()]).map((flag) => ({ x: xs(), y: flag ? small() : big(), flag })), (list) => { const k = list.filter((v) => v.flag).length; return k >= 1 && k <= 3 && new Set(list.map((v) => S(v.x))).size === 4 && new Set(list.map((v) => S(v.y))).size === 4 && list.some((v) => v.flag && less(v.x, nat(1))) && list.some((v) => !v.flag && v.y.k === 2); });
        const hits = rows.map((v, i) => (v.flag ? LAB[i] : '')).filter(Boolean);
        return N('계산하지 않고 알아볼 때, 몫이 나누어지는 수보다 큰 것은 모두 몇 개인가?', hits.length, {
          unit: '개', figure: tagged(rows.map((v) => eq(S(v.x), '/', S(v.y)))),
          explain: `1보다 작은 수로 나누면 몫이 나누어지는 수보다 크고, 1보다 큰 수로 나누면 몫이 나누어지는 수보다 작다. 나누는 수가 1보다 작은 것은 ${hits.join(', ')}이다.`,
          facts: { choose: { exprs: rows.map((v) => `${S(v.x)}/${S(v.y)}/${S(v.x)}`), rule: 'countAbove', target: 1 } }
        });
      }),
      H('hard-shift-count', '자연수의 나눗셈을 보고 소수점의 자리가 다른 여러 식의 몫 알기', '심4·5·7 / 기본 ①7·19 ②8 ③6', (d) => {
        // 함정: 두 수의 소수점을 서로 다른 자리만큼 옮긴 식뿐이다(86.4 ÷ 0.24, 8.64 ÷ 2.4, 864 ÷ 2.4, 8.64 ÷ 24 …). 「두 수가 모두 소수이면 몫은 그대로」라고 여기는 아이,
        //  나누어지는 수가 줄면 몫도 준다는 것만 보는 아이가 걸린다. 나누는 수가 더 많이 줄어든 식의 몫만 처음 몫보다 크다.
        const m = d.until(() => { const c = nz(d, 12, 48), Q = nz(d, 12, 48); return { c, Q, X: c * Q }; }, (w) => w.X % 10 !== 0 && w.X <= 999), big = d.bool();
        const rows = d.until(() => d.shuffle([[0, 1], [1, 2], [0, 2], [1, 0], [2, 1], [2, 0]]).slice(0, 4), (list) => { const k = list.filter(([p, q]) => q > p).length; return k >= 1 && k <= 3 && list.some(([p, q]) => p > 0 && q > 0); }).map(([p, q]) => ({ x: dec(m.X, p), y: dec(m.c, q), more: q > p }));
        const ms = rows.map((v) => xmil(v.x, v.y)), hits = rows.map((v, i) => (v.more === big ? LAB[i] : '')).filter(Boolean);
        return N(`${m.X} ÷ ${m.c} = ${m.Q}이다. 계산하지 않고 알아볼 때, 몫이 ${m.Q}보다 ${big ? '큰' : '작은'} 것은 모두 몇 개인가?`, hits.length, {
          unit: '개', figure: tagged(rows.map((v) => eq(S(v.x), '/', S(v.y)))),
          explain: `나누어지는 수가 ${part(1)}배가 되면 몫도 ${part(1)}배가 되고, 나누는 수가 ${part(1)}배가 되면 몫은 10배가 된다. 몫은 ${rows.map((v, i) => `${LAB[i]} ${S(quo(v.x, v.y))}`).join(', ')}이므로 ${m.Q}보다 ${big ? '큰' : '작은'} 것은 ${hits.join(', ')}이다.`,
          facts: { choose: { exprs: ms.map((e) => e.s), rule: big ? 'countAbove' : 'countBelow', target: m.Q * 1000 }, unseen: ms.reduce((all, e) => all.concat(e.un), []) }
        });
      }),
      H('hard-point-first', '잘못 계산한 세로셈에서 처음으로 틀린 곳 찾기', '심18 / 기본 ①11·20 ②22 ③20', (d) => {
        // 함정: 몫의 숫자는 모두 바르게 구했다. 「숫자가 맞으니 계산은 맞다」고 여기는 아이, 어느 단계에서 틀렸는지 짚지 못하는 아이가 걸린다.
        //  세 가지 꼴: 0 몫의 소수점을 처음 소수점 자리에 찍음(13.5 ÷ 0.9 = 1.5) → ㉢, 1 붙인 0을 계산하지 않고 멈춤(36 ÷ 1.8 = 2) → ㉡, 2 나누어지는 수에 0을 붙이지 않고 한 자리만 옮김(7.2 ÷ 0.08 = 9) → ㉠.
        const kind = d.int(0, 2);
        let v, figure, rows, fix;
        if (kind === 0) {
          v = mk(d, Y.a1, () => qn(d, 12, 98), (w) => w.x.k === 1 && w.q.n % 10 !== 0);
          const p = plan(v.y, v.x), at = p.intLen - 1, cells = p.work.quot.map((q, i) => (q !== null ? String(q) : i === at ? '0' : ''));
          figure = sdiv(v.y, v.x, { steps: true, given: { cells, dot: at } });
          rows = [[`나누어지는 수와 나누는 수의 소수점을 오른쪽으로 한 자리씩 옮겨 ${S(sh(v.x, 1))} ÷ ${josa(v.y.n, '을/를')} 계산한다.`, true], [`${S(sh(v.x, 1))} ÷ ${v.y.n}의 몫의 숫자는 차례로 ${digs(v.q.n).join(', ')}이다.`, true], ['몫의 소수점은 나누어지는 수의 처음 소수점의 자리에 맞추어 찍는다.', false]];
          fix = '몫의 소수점은 나누어지는 수의 옮긴 소수점의 자리에 맞추어 찍어야 한다. 옮긴 소수점이 나누어지는 수의 끝에 있으므로 몫은 자연수이다.';
        } else if (kind === 1) {
          v = mk(d, Y.b1, () => nat(10 * d.int(2, 19)), (w) => w.x.k === 0 && w.x.n % 10 !== 0);
          figure = sdiv(v.y, v.x, { steps: true, upto: S(v.x).length });
          rows = [[`나누어지는 수와 나누는 수의 소수점을 오른쪽으로 한 자리씩 옮겨 ${S(sh(v.x, 1))} ÷ ${josa(v.y.n, '을/를')} 계산한다.`, true], [`${v.x.n} ÷ ${v.y.n} = ${v.q.n / 10}이고 남은 수가 없으므로 계산을 끝낸다.`, false], ['옮긴 소수점이 나누어지는 수의 끝에 있으므로 몫에는 소수점을 찍지 않는다.', true]];
          fix = `소수점을 옮기며 붙인 0까지 계산해야 한다. 남은 수가 없어도 몫의 일의 자리에 0을 써야 한다.`;
        } else {
          v = mk(d, Y.a2, () => nat(10 * d.int(2, 15)), (w) => w.x.k === 1);
          figure = sdiv(v.y, v.x, { steps: true, short: true });
          rows = [[`나누는 수의 소수점은 오른쪽으로 두 자리, 나누어지는 수의 소수점은 오른쪽으로 한 자리 옮겨 ${v.x.n} ÷ ${josa(v.y.n, '을/를')} 계산한다.`, false], [`${v.x.n} ÷ ${v.y.n} = ${v.x.n / v.y.n}이므로 몫에 ${josa(v.x.n / v.y.n, '을/를')} 쓴다.`, true], ['옮긴 소수점이 나누어지는 수의 끝에 있으므로 몫에는 소수점을 찍지 않는다.', true]];
          fix = `두 수의 소수점은 같은 자리만큼 옮겨야 한다. 나누어지는 수에 0을 붙여 두 자리 옮기면 ${S(sh(v.x, 2))} ÷ ${v.y.n}이다.`;
        }
        return C(`${S(v.x)} ÷ ${J(v.y, '을/를')} 세로로 잘못 계산한 것이다. 계산한 차례대로 적은 설명 가운데 처음으로 잘못된 것은?`, THREE, rows.findIndex((row) => !row[1]), {
          figure: figure + tagged(rows.map((row) => row[0])),
          explain: `${fix} 바르게 계산하면 ${told(v.x, v.y)}이다.`,
          facts: { truth: rows.map((row) => row[1]), want: false }
        });
      }),
      H('hard-rest-point', '세로셈에 남은 수로 남는 양 바르게 구하기', '심47 / 기본 ①61·63 ③48·52', (d) => {
        // 함정: 소수점을 옮겨 계산한 세로셈의 맨 아래에 남은 수는 옮긴 소수점을 기준으로 한 수이다. 남은 숫자를 그대로 읽는 아이(2.1 kg을 21 kg으로, 0.99 kg을 9.9 kg으로)가 걸린다.
        //  두 가지 꼴: (소수 한 자리 수)÷(소수 한 자리 수) — 남은 수가 자연수처럼 보인다, (소수 두 자리 수)÷(소수 한 자리 수) — 남은 수의 소수점이 한 자리 밀려 있다.
        const two = d.bool(), v = two ? smk(d, Y.b1, () => d.int(2, 9), r2(d), (w) => w.x.k === 2) : smk(d, Y.b1, () => d.int(2, 9), r1(d)), wrong = S(sh(v.r, 1)), g = xrem(v.x, v.y);
        return D(`귤 ${S(v.x)} kg을 한 상자에 ${S(v.y)} kg씩 담으려고 다음과 같이 계산하고, 「상자 ${v.q}개에 담고 ${wrong} kg이 남는다.」고 하였다. 남는 귤의 양을 바르게 구하면 몇 kg인가?`, V(v.r), {
          unit: 'kg', figure: sdiv(v.y, v.x, { steps: true, stop: true, restDot: 'moved' }),
          explain: `남는 양의 소수점은 옮긴 소수점이 아니라 나누어지는 수의 처음 소수점의 자리에 맞추어 찍는다. ${S(v.x)} − ${S(v.y)} × ${v.q} = ${S(v.r)}(kg)이다. 남는 양은 한 상자에 담는 ${S(v.y)} kg보다 적어야 한다.`,
          facts: { calc: [[g.s, 0]], unseen: g.un }
        });
      }),
      H('hard-rest-frac', '몫의 소수 부분을 남는 양으로 잘못 읽은 것 바로잡기', '심48 / 기본 ①63 ②53 ③52', (d) => {
        // 함정: 몫을 끝까지 나누어 8.4를 얻고 소수 부분 0.4를 남는 양으로 읽었다. 0.4는 「한 병의 0.4만큼」이지 0.4 L가 아니다. 몫의 소수 부분과 남는 양을 같은 것으로 여기는 아이가 걸린다.
        const m = d.until(() => { const y = d.bool() ? nat(d.int(3, 9)) : Y.b1(d), Q = qd(d, 21, 98, 1), x = mulD(Q, y), t = rest(x, y); return { y, Q, x, q: t.q, r: t.r, part: dec(Q.n % 10, 1) }; }, (w) => w.x.k === 1 && sig(w.x) <= 3 && w.r.k >= 1 && S(w.r) !== S(w.part));
        const g = xrem(m.x, m.y);
        return D(`식혜 ${S(m.x)} L를 한 병에 ${S(m.y)} L씩 담으려고 ${S(m.x)} ÷ ${S(m.y)} = ${J(m.Q, '이라고/라고')} 계산하고, 「병 ${m.q}개에 담고 ${S(m.part)} L가 남는다.」고 하였다. 남는 식혜의 양을 바르게 구하면 몇 L인가?`, V(m.r), {
          unit: 'L', explain: `몫의 소수 부분 ${J(m.part, '은/는')} 한 병에 담는 양의 ${S(m.part)}만큼이라는 뜻이다. 병 ${m.q}개에 담은 식혜는 ${S(m.y)} × ${m.q} = ${S(mulD(m.y, nat(m.q)))}(L)이므로 남는 식혜는 ${S(m.x)} − ${S(mulD(m.y, nat(m.q)))} = ${S(m.r)}(L)이다.`,
          facts: { calc: [[g.s, 0]], unseen: g.un }
        });
      }),
      H('hard-round-stop', '소수 첫째 자리까지만 계산한 몫을 바르게 반올림하기', '심34 / 기본 ①49·53 ②44 ③40', (d) => {
        // 함정: 「소수 첫째 자리까지 나타내시오」를 소수 첫째 자리까지만 계산하고 멈추라는 말로 읽었다. 세로셈은 소수 첫째 자리에서 멈춰 있고 남은 수가 있다.
        //  한 자리 더 구하면 소수 둘째 자리 숫자가 5 이상이어서 올려야 한다. 멈춘 몫을 그대로 답하는 아이가 걸린다.
        const v = d.until(() => { const x = d.bool() ? dec(nz(d, 12, 98), 1) : nat(d.int(2, 30)), y = Y.s1(d); return { x, y, r: rnd(x, y, 1), cut: cutq(x, y, 1), g: Number(cutq(x, y, 2).slice(-1)) }; }, (w) => endless(w.x, w.y) && less(w.y, w.x) && w.g >= 5 && w.r.n % 10 !== 0 && w.r.n < 1000);
        const p = plan(v.y, v.x, { pad: 0 }), pad = p.mv + 2 - p.own.length - p.lift, left = plan(v.y, v.x, { pad }).work.rest, e = xround(v.x, v.y, 1);
        return D(`${S(v.x)} ÷ ${S(v.y)}의 몫을 반올림하여 소수 첫째 자리까지 나타내려고 다음과 같이 계산하고 몫을 ${dj(v.cut, '이라고/라고')} 하였다. 몫을 반올림하여 소수 첫째 자리까지 바르게 나타내면?`, v.r.n / 10, {
          figure: sdiv(v.y, v.x, { steps: true, pad }),
          explain: `소수 첫째 자리까지 나타내려면 소수 둘째 자리까지 구하여 반올림해야 한다. 남은 ${left}에 0을 내려 계산하면 몫의 소수 둘째 자리 숫자는 ${v.g}이다. 올려서 ${dj(R(v.r), '으로/로')} 나타낸다.`,
          facts: { calc: [[e.s, 0]], unseen: e.un }
        });
      }),
      H('hard-fill-need', '문장제: 가득 채운 병의 수와 모두 담는 데 필요한 병의 수', '심50·52 / 기본 ②55·56 ③53', (d) => {
        // 함정: 같은 나눗셈인데 「가득 찬 병」은 몫의 자연수 부분이고 「남김없이 모두 담는 데 필요한 병」은 하나 더 많다. 언제나 몫의 자연수 부분만 답하는 아이, 반올림하는 아이가 걸린다.
        const m = d.until(() => { const y = Y.b1(d), x = d.bool() ? nat(d.int(12, 60)) : dec(nz(d, 121, 598), 1), t = rest(x, y); return { x, y, q: t.q, r: t.r }; }, (w) => w.r.n > 0 && w.q >= 3 && w.q <= 40), e = xfloor(m.x, m.y);
        return M(`간장 ${S(m.x)} L를 ${S(m.y)} L들이 병에 담으려고 한다. 병에 가득 채워 담을 때 가득 찬 병은 ㉠개이고, 간장을 남김없이 모두 병에 담으려면 병은 적어도 ㉡개 필요하다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(m.q)), inp(LAB[1], nat(m.q + 1))], {
          explain: `${S(m.x)} ÷ ${S(m.y)}의 몫을 자연수까지 구하면 ${m.q}이고 ${S(m.r)} L가 남는다. 가득 찬 병은 ${m.q}개이고, 남은 ${S(m.r)} L도 담아야 하므로 병은 적어도 ${m.q} + 1 = ${m.q + 1}(개) 필요하다.`,
          facts: { calc: [[e.s, 0], [`${e.s}+1`, 1]], unseen: e.un.concat([1]) }
        });
      }),
      H('hard-rate-order', '문장제: 1 m의 무게와 1 kg의 길이', '심39·63·64 / 기본 ②63 ③65', (d) => {
        // 함정: 같은 두 수로 나누는 차례만 바꾼 두 물음이다. 문장에 나온 차례대로 나누거나 큰 수를 작은 수로만 나누는 아이는 두 답을 같게 쓰거나 서로 바꾸어 쓴다.
        //  1 m의 무게는 (무게) ÷ (길이)로 1보다 작고, 1 kg의 길이는 (길이) ÷ (무게)이다.
        const m = d.until(() => { const k = d.pick([4, 5, 8]), w = dec(d.int(3, 24), 1); return { k, w, len: mulD(w, nat(k)) }; }, (v) => v.w.k === 1 && v.len.k === 1), e = xq(m.len, m.w), one = quo(m.w, m.len);
        return M(`굵기가 일정한 철사 ${S(m.len)} m의 무게가 ${S(m.w)} kg이다. 이 철사 1 m의 무게는 ㉠ kg이고, 무게가 1 kg인 철사의 길이는 ㉡ m이다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], one), inp(LAB[1], nat(m.k))], {
          explain: `1 m의 무게는 무게를 길이로 나누어 ${S(m.w)} ÷ ${S(m.len)} = ${S(one)}(kg)이고, 1 kg의 길이는 길이를 무게로 나누어 ${S(m.len)} ÷ ${S(m.w)} = ${m.k}(m)이다.`,
          facts: { calc: [[`${S(m.w)}/${S(m.len)}`, 0], [e.s, 1]], unseen: e.un }
        });
      }),
      H('hard-unit-mismatch', '문장제: 단위가 다른 두 길이는 몇 배', '심38 / 기본 ②60', (d) => {
        // 함정: 한쪽은 m, 다른 쪽은 cm로 적혀 있다. 적힌 수를 그대로 나누는 아이(2.85 ÷ 150)가 걸린다. 단위를 맞춘 다음 나눈다.
        const cm = d.pick([120, 130, 140, 150, 160]), y = dec(cm, 2), v = d.until(() => { const q = qd(d, 15, 29, 1); return { q, x: mulD(q, y) }; }, (w) => w.x.k === 2 && sig(w.x) <= 3), p = d.pick(NAMES);
        return D(`농구대의 높이는 ${S(v.x)} m이고 ${nick(p)}의 키는 ${cm} cm이다. 농구대의 높이는 ${nick(p)}의 키의 몇 배인가?`, V(v.q), {
          unit: '배', explain: `${cm} cm는 ${S(y)} m이다. 단위를 m로 맞추어 나누면 ${S(v.x)} ÷ ${S(y)} = ${S(v.q)}(배)이다.`,
          facts: { calc: [[`${S(v.x)}/(${cm}/100)`, 0]], unseen: [100] }
        });
      }),
      H('hard-extra', '문장제: 쓰지 않는 수가 섞인 덜어 내기', '기본 ②57 ③70', (d) => {
        // 함정: 우유의 양은 쓰지 않는 조건이다. 적힌 수를 차례로 모두 쓰는 아이, 먼저 나온 수로 나누는 아이가 걸린다.
        const m = d.until(() => { const milk = dec(nz(d, 12, 45), 2), v = mk(d, Y.s1, () => qn(d, 4, 40), (w) => w.x.k === 0 && w.x.n <= 30 && w.q.n % 10 !== 0); return { milk, v }; }, (w) => S(w.milk) !== S(w.v.y) && quo(w.v.x, w.milk) !== null && S(quo(w.v.x, w.milk)) !== S(w.v.q)), v = m.v;
        return ask(`식빵 한 개를 만드는 데 우유 ${S(m.milk)} L와 밀가루 ${S(v.y)} kg이 필요하다. 우유는 넉넉하게 있을 때, 밀가루 ${v.x.n} kg으로 만들 수 있는 식빵은 몇 개인가?`, v.x, v.y, {
          unit: '개', explain: `밀가루의 양을 식빵 한 개에 드는 밀가루의 양으로 나눈다. 우유의 양은 쓰지 않는다. ${told(v.x, v.y)}(개)이다.`
        });
      }),
      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-wrong-any', '잘못 계산한 어떤 수를 구해 바르게 계산하기', '심26 / 기본 ①41 ②72 ③59', (d, n) => {
        if (n === 0) {
          // 나누어야 할 것을 곱한 경우: 같은 수로 두 번 나눈다.
          const m = d.until(() => { const y = Y.a1(d), r = d.int(2, 60), any = mulD(nat(r), y); return { y, r, any, got: mulD(any, y) }; }, (w) => w.got.k >= 1 && sig(w.got) <= 3 && sig(w.any) <= 3 && w.r % 10 !== 0), g = ix(m.got), j = ix(m.y);
          return N(`어떤 수를 ${J(m.y, '으로/로')} 나누어야 할 것을 잘못하여 ${J(m.y, '을/를')} 곱하였더니 ${J(m.got, '이/가')} 되었다. 바르게 계산한 값은?`, m.r, {
            explain: `어떤 수는 ${S(m.got)} ÷ ${S(m.y)} = ${S(m.any)}이다. 바르게 계산하면 ${S(m.any)} ÷ ${S(m.y)} = ${m.r}이다.`,
            facts: { calc: [[`${g.s}*${P10[2 - m.got.k]}/(${j.s}*${j.s})`, 0]], unseen: g.un.concat(j.un, [P10[2 - m.got.k]]) }
          });
        }
        // 어떤 수가 나누는 수 자리에 있는 경우: 곱셈식에서 어떤 수를 구해 그 수로 나눈다.
        const m = d.until(() => { const any = Y.a1(d), r = d.int(2, 60), X = mulD(nat(r), any); return { any, r, X, got: mulD(X, any) }; }, (w) => w.X.k === 0 && w.X.n >= 6 && w.X.n <= 99 && w.X.n % 10 !== 0 && w.got.k >= 1 && sig(w.got) <= 3 && w.r % 10 !== 0), g = ix(m.got), X = m.X.n;
        return N(`${josa(X, '을/를')} 어떤 수로 나누어야 할 것을 잘못하여 ${X}에 어떤 수를 곱하였더니 ${J(m.got, '이/가')} 되었다. 바르게 계산한 값은?`, m.r, {
          explain: `어떤 수는 ${S(m.got)} ÷ ${X} = ${S(m.any)}이다. 바르게 계산하면 ${X} ÷ ${S(m.any)} = ${m.r}이다.`,
          facts: { calc: [[`${X}*${X}*${P10[m.got.k]}/${g.s}`, 0]], unseen: g.un.concat([P10[m.got.k]]) }
        });
      }, { count: 2 }),
      H('hard-between', '두 몫 사이에 있는 자연수', '심23·24 / 기본 ①28 ③60', (d) => {
        // 한쪽 몫은 자연수로 떨어진다. 그 수는 □에 들어가지 않는다.
        const m = d.until(() => { const leftNat = d.bool(), W = d.int(3, 14), gap = d.int(3, 6), f = d.int(1, 9); return leftNat ? { leftNat, q1: nat(W), q2: dec((W + gap) * 10 + f, 1) } : { leftNat, q1: dec((W - gap) * 10 - f, 1), q2: nat(W) }; }, (w) => w.q1.n > 0 && V(w.q1) > 1 && (w.leftNat ? w.q1.n : w.q2.n) % 10 !== 0);
        const rows = d.until(() => [pair(d, m.q1, (w) => w.x.k >= 1), pair(d, m.q2, (w) => w.x.k >= 1)], ([p, q]) => S(p.y) !== S(q.y)), [l, r] = rows, lo = Math.floor(V(m.q1)) + 1, hi = m.q2.k ? Math.floor(V(m.q2)) : m.q2.n - 1, f1 = xab(l.x, l.y), f2 = xab(r.x, r.y);
        return N('□ 안에 들어갈 수 있는 자연수는 모두 몇 개인가?', hi - lo + 1, {
          unit: '개', figure: lines([eqs(S(l.x), '/', S(l.y), '<', box(), '<', S(r.x), '/', S(r.y))]),
          explain: `${told(l.x, l.y)}, ${told(r.x, r.y)}이다. □는 ${S(m.q1)}보다 크고 ${S(m.q2)}보다 작은 자연수이므로 ${lo}부터 ${hi}까지 ${hi - lo + 1}개이다. ${J(m.leftNat ? m.q1 : m.q2, '은/는')} 들어가지 않는다.`,
          facts: { digit: { template: `(${f1.a})*(${f2.b})<□*(${f1.b})*(${f2.b})<(${f2.a})*(${f1.b})`, lo: 1, hi: hi + 3, ask: 'count' } }
        });
      }),
      H('hard-digit', '몫과 비교하는 소수의 □ 안에 들어갈 수 있는 숫자', '심25', (d) => {
        // 몫은 W.fe 이고 견주는 수 W.□e 는 소수 둘째 자리 숫자가 같다. □에 f 를 넣으면 두 수가 같아지므로 f 는 들어가지 않는다.
        const up = d.bool(), v = mk(d, Y.a1, () => ({ n: d.int(1, 9) * 100 + d.int(1, 8) * 10 + d.int(1, 9), k: 2 })), W = Math.floor(v.q.n / 100), f = Math.floor(v.q.n / 10) % 10, e = v.q.n % 10, g = xab(v.x, v.y), count = up ? 9 - f : f;
        return N('0부터 9까지의 수 가운데 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', count, {
          unit: '개', figure: eq(S(v.x), '/', S(v.y), up ? '<' : '>', `${W}.${box()}${e}`),
          explain: `${told(v.x, v.y)}이다. 소수 둘째 자리 숫자가 ${josa(e, '으로/로')} 같으므로 □ 안에는 ${f}보다 ${up ? '큰' : '작은'} 수만 들어갈 수 있다. ${up ? Array.from({ length: 9 - f }, (_, i) => f + 1 + i).join(', ') : Array.from({ length: f }, (_, i) => i).join(', ')}의 ${count}개이다.`,
          facts: { digit: { template: `(${g.a})*100${up ? '<' : '>'}(${W}*100+□*10+${e})*(${g.b})`, lo: 0, hi: 9, ask: 'count' } }
        });
      }),
      H('hard-cards', '수 카드로 몫이 가장 큰 나눗셈 만들기', '심30·31 / 기본 ①30 ②75 ③61', (d, n) => {
        if (n === 0) {
          // 카드 3장으로 □□ ÷ 0.□: 가장 큰 두 자리 수를 가장 작은 소수로 나눈다.
          const s = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3).sort((p, q) => p - q), (w) => ((w[2] * 10 + w[1]) * 10) % w[0] === 0), [c, b, a] = s, top = a * 10 + b;
          return N('수 카드 3장을 한 번씩 모두 사용하여 다음과 같은 나눗셈식을 만들려고 한다. 몫이 가장 클 때의 몫은?', top * 10 / c, {
            figure: cards(d.shuffle(s)) + eq(`${box()}${box()}`, '/', `0.${box()}`),
            explain: `몫이 가장 크려면 나누어지는 수는 가장 크게, 나누는 수는 가장 작게 한다. ${top} ÷ 0.${c} = ${top * 10} ÷ ${c} = ${top * 10 / c}이다.`,
            facts: { calc: [[`(${a}*10+${b})*10/${c}`, 0]], unseen: [10] }
          });
        }
        // 카드 4장으로 □.□ ÷ □.□: 가장 큰 소수를 가장 작은 소수로 나누고 몫을 반올림한다.
        const m = d.until(() => { const s = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((p, q) => p - q), x = dec(s[3] * 10 + s[2], 1), y = dec(s[0] * 10 + s[1], 1); return { s, x, y, r: rnd(x, y, 1) }; }, (w) => endless(w.x, w.y) && w.r.n % 10 !== 0), e = xround(m.x, m.y, 1);
        return D('수 카드 4장을 한 번씩 모두 사용하여 다음과 같은 나눗셈식을 만들려고 한다. 몫이 가장 클 때의 몫을 반올림하여 소수 첫째 자리까지 나타내시오.', m.r.n / 10, {
          figure: cards(d.shuffle(m.s)) + eq(`${box()}.${box()}`, '/', `${box()}.${box()}`),
          explain: `몫이 가장 크려면 가장 큰 수 ${J(m.x, '을/를')} 가장 작은 수 ${J(m.y, '으로/로')} 나눈다. ${S(m.x)} ÷ ${S(m.y)} = ${cutq(m.x, m.y, 2)}…이므로 반올림하여 소수 첫째 자리까지 나타내면 ${R(m.r)}이다.`,
          facts: { calc: [[e.s, 0]], unseen: e.un }
        });
      }, { count: 2 }),
      H('hard-unit-then', '문장제: 1 L로 가는 거리를 구해 필요한 양 구하기', '심64 / 기본 ②64', (d) => {
        // 나눗셈 두 번: 1 L로 가는 거리를 구하고, 가려는 거리를 그 거리로 나눈다.
        const m = d.until(() => { const u = d.bool() ? qd(d, 52, 98, 1) : nat(d.int(6, 15)), a = dec(nz(d, 11, 29), 1), need = d.int(5, 40); return { u, a, need, b: mulD(u, a), far: mulD(u, nat(need)) }; }, (w) => w.b.k >= 1 && sig(w.b) <= 3 && w.far.k <= 1 && sig(w.far) <= 3 && w.need % 10 !== 0);
        const iC = ix(m.far), ia = ix(m.a), ib = ix(m.b), e = m.b.k - m.far.k - m.a.k;
        return N(`휘발유 ${S(m.a)} L로 ${S(m.b)} km를 가는 자동차가 있다. 이 자동차로 ${S(m.far)} km를 가려면 휘발유는 몇 L 필요한가?`, m.need, {
          unit: 'L', explain: `휘발유 1 L로 가는 거리는 ${S(m.b)} ÷ ${S(m.a)} = ${S(m.u)}(km)이다. ${S(m.far)} km를 가는 데 필요한 휘발유는 ${S(m.far)} ÷ ${S(m.u)} = ${m.need}(L)이다.`,
          facts: { calc: [[e >= 0 ? `${iC.s}*${ia.s}*${P10[e]}/${ib.s}` : `${iC.s}*${ia.s}/(${ib.s}*${P10[-e]})`, 0]], unseen: iC.un.concat(ia.un, ib.un, [P10[Math.abs(e)]]) }
        });
      }),
      H('hard-net', '문장제: 빼고 나서 나누기', '심67 / 기본 ①38·40 ②65 ③70', (d, n) => {
        if (n === 0) {
          // 빈 상자의 무게를 뺀 다음 한 개의 무게로 나눈다.
          const m = d.until(() => { const u = Y.a2(d), cnt = d.int(4, 30), net = mulD(u, nat(cnt)), box0 = dec(nz(d, 15, 95), 2); return { u, cnt, net, box0, full: plus(net, box0) }; }, (w) => sig(w.net) <= 3 && w.net.k >= 1 && w.full.k >= 1 && sig(w.full) <= 3 && w.cnt % 10 !== 0), cf = cent(m.full), cb = cent(m.box0), cu = cent(m.u);
          return N(`무게가 같은 구슬을 상자에 담아 무게를 재었더니 ${S(m.full)} kg이었다. 빈 상자의 무게는 ${S(m.box0)} kg이고 구슬 한 개의 무게는 ${S(m.u)} kg일 때, 상자에 담은 구슬은 몇 개인가?`, m.cnt, {
            unit: '개', explain: `구슬만의 무게는 ${S(m.full)} − ${S(m.box0)} = ${S(m.net)}(kg)이다. 구슬의 수는 ${S(m.net)} ÷ ${S(m.u)} = ${m.cnt}(개)이다.`,
            facts: { calc: [[`(${cf.s}-${cb.s})/(${cu.s})`, 0]], unseen: cf.un.concat(cb.un, cu.un) }
          });
        }
        // 줄어든 무게가 잘라 낸 길이의 무게이다. 줄어든 무게를 잘라 낸 길이로 나눈다.
        const m = d.until(() => { const len = dec(nz(d, 12, 48), 1), u = qd(d, 12, 48, 1), cut = mulD(u, len), left = dec(nz(d, 105, 895), 2); return { len, u, cut, left, all: plus(left, cut) }; }, (w) => w.cut.k >= 1 && sig(w.cut) <= 3 && w.all.k >= 1 && w.all.n < 10000 && V(w.all) < 20);
        return D(`굵기가 일정한 통나무의 무게는 ${S(m.all)} kg이다. 이 통나무를 ${S(m.len)} m 잘라 내고 남은 통나무의 무게를 재었더니 ${S(m.left)} kg이었다. 이 통나무 1 m의 무게는 몇 kg인가?`, V(m.u), {
          unit: 'kg', explain: `잘라 낸 통나무 ${S(m.len)} m의 무게는 ${S(m.all)} − ${S(m.left)} = ${S(m.cut)}(kg)이다. 통나무 1 m의 무게는 ${S(m.cut)} ÷ ${S(m.len)} = ${S(m.u)}(kg)이다.`,
          facts: { calc: [[`(${S(m.all)}-${S(m.left)})/${S(m.len)}`, 0]] }
        });
      }, { count: 2 }),
      H('hard-price', '문장제: 1 kg의 값을 구해 어느 쪽이 얼마나 더 싼지 알기', '심66 / 기본 ①37', (d) => {
        // 값을 무게로 나눈다. 전체 값이 싼 쪽의 1 kg의 값이 더 싼 것은 아니다. 틀린 보기: 비싼 쪽, 전체 값끼리의 차
        const m = d.until(() => { const ys = d.shuffle([4, 5, 6, 8, 12, 15, 16, 18, 24, 25]).slice(0, 2), us = [100 * d.int(20, 95), 100 * d.int(20, 95)]; return ys.map((yn, i) => ({ y: dec(yn, 1), u: us[i], p: us[i] * yn / 10 })); },
          (w) => w.every((v) => v.p % 100 === 0 && String(v.p).replace(/0+$/, '').length <= 3) && Math.abs(w[0].u - w[1].u) >= 300 && Math.abs(w[0].u - w[1].u) <= 3000 && w[0].p !== w[1].p && (w[0].p < w[1].p) !== (w[0].u < w[1].u) && Math.abs(w[0].p - w[1].p) !== Math.abs(w[0].u - w[1].u));
        const winner = m[0].u < m[1].u ? 0 : 1, gap = Math.abs(m[0].u - m[1].u), other = Math.abs(m[0].p - m[1].p), names = ['가', '나'], es = m.map((v) => xq(nat(v.p), v.y));
        const list = d.shuffle([[0, gap], [1, gap], [0, other], [1, other]]);
        return C(`가 가게에서는 고구마 ${S(m[0].y)} kg을 ${m[0].p}원에 팔고, 나 가게에서는 고구마 ${S(m[1].y)} kg을 ${m[1].p}원에 판다. 고구마 1 kg의 값은 어느 가게가 얼마나 더 싼가?`, list.map(([who, g]) => `${names[who]} 가게, ${g}원`), list.findIndex(([who, g]) => who === winner && g === gap), {
          explain: `고구마 1 kg의 값은 가 가게가 ${m[0].p} ÷ ${S(m[0].y)} = ${m[0].u}(원), 나 가게가 ${m[1].p} ÷ ${S(m[1].y)} = ${m[1].u}(원)이다. ${names[winner]} 가게가 ${gap}원 더 싸다.`,
          facts: { who: { values: m.map((v) => v.u), exprs: es.map((e) => e.s), options: list, smaller: true }, unseen: es.reduce((all, e) => all.concat(e.un), []) }
        });
      }),
      H('hard-round-two', '한 몫을 두 자리까지 반올림하여 나타낸 수의 크기 비교', '심35·37 / 기본 ①52 ②42·43 ③39', (d) => {
        // 소수 셋째 자리까지 구해 두 번 반올림한다. 올려서 나타낸 쪽이 더 크다.
        const v = d.until(() => { const [x, y] = d.bool() ? [dec(nz(d, 12, 98), 1), Y.s1(d)] : [nat(d.int(5, 40)), NAT3679(d)]; return { x, y, r1: rnd(x, y, 1), r2: rnd(x, y, 2) }; }, (w) => endless(w.x, w.y) && less(w.y, w.x) && w.r1.n % 10 !== 0 && w.r2.n % 10 !== 0), e1 = xround(v.x, v.y, 1), e2 = xround(v.x, v.y, 2), sign = v.r1.n * 10 > v.r2.n ? 0 : 2;
        return C(`${S(v.x)} ÷ ${S(v.y)}의 몫을 반올림하여 소수 첫째 자리까지 나타낸 수를 ㉠, 소수 둘째 자리까지 나타낸 수를 ㉡이라고 할 때, ○ 안에 알맞은 것은?`, SIGNS, sign, {
          figure: versus(ex('㉠'), ex('㉡')),
          explain: `${S(v.x)} ÷ ${S(v.y)} = ${cutq(v.x, v.y, 3)}…이다. ㉠은 ${R(v.r1)}, ㉡은 ${R(v.r2)}이다. ${R(v.r1)} ${SIGNS[sign]} ${R(v.r2)}이다.`,
          facts: { choose: { exprs: [e1.s, e2.s], rule: 'compare' }, unseen: e1.un.concat(e2.un) }
        });
      }),
      H('hard-rest-again', '문장제: 담고 남은 것을 작은 그릇에 다시 담기', '심53 / 기본 ①66', (d) => {
        // 병에 담고 남은 양이 다음 나눗셈의 나누어지는 수이다.
        const m = d.until(() => { const y1 = dec(d.int(5, 18), 1), y2 = dec(d.int(2, 4), 1), q1 = d.int(3, 12), r = dec(d.int(1, y1.n - 1), 1), x = plus(mulD(y1, nat(q1)), r), t = rest(r, y2); return { y1, y2, q1, r, x, q2: t.q, r2: t.r }; }, (w) => w.y1.k === 1 && w.r.k === 1 && w.x.k === 1 && sig(w.x) <= 3 && w.q2 >= 1 && w.y1.n >= w.y2.n * 2);
        const X = ix(m.x).s, A = ix(m.y1).s, Bn = ix(m.y2).s, e = xfloor(m.x, m.y1), un = ix(m.x).un.concat(ix(m.y1).un, ix(m.y2).un, e.un);
        return M(`식혜 ${S(m.x)} L를 ${S(m.y1)} L들이 병에 가득 채워 담고, 병에 담고 남은 식혜는 ${S(m.y2)} L들이 컵에 가득 채워 담으려고 한다. 가득 찬 병은 ㉠개, 가득 찬 컵은 ㉡개이다. ㉠, ㉡에 알맞은 수는?`, [inp(LAB[0], nat(m.q1)), inp(LAB[1], nat(m.q2))], {
          explain: `${S(m.x)} ÷ ${S(m.y1)}의 몫을 자연수까지 구하면 ${m.q1}이고 ${S(m.r)} L가 남는다. 남은 ${S(m.r)} L를 ${S(m.y2)} L씩 담으면 ${S(m.r)} ÷ ${S(m.y2)}의 몫의 자연수 부분인 ${m.q2}개의 컵이 가득 찬다.`,
          facts: { calc: [[e.s, 0], [`((${X}%${A})-(${X}%${A})%${Bn})/${Bn}`, 1]], unseen: un }
        });
      }),
      H('hard-rest-more', '문장제: 남김없이 담으려면 더 필요한 양', '심51 / 기본 ①64 ②54 ③54', (d) => {
        // 남는 양을 구한 다음, 한 봉지를 더 채우는 데 모자란 양을 구한다: (한 봉지의 양) − (남는 양)
        const fits = (w) => plus(w.y, w.r, -1).k >= 1, v = d.bool() ? smk(d, (dd) => nat(dd.int(3, 9)), () => d.int(2, 12), r1(d), fits) : smk(d, Y.b1, () => d.int(2, 9), r1(d), fits), more = plus(v.y, v.r, -1), f = xab(v.x, v.y), p = P10[v.x.k + v.y.k];
        return D(`쌀 ${S(v.x)} kg을 한 봉지에 ${S(v.y)} kg씩 담으려고 한다. 쌀을 남김없이 모두 담아 봉지마다 ${S(v.y)} kg씩 되게 하려면 쌀은 적어도 몇 kg 더 필요한가?`, V(more), {
          unit: 'kg', explain: `${S(v.x)} ÷ ${S(v.y)}의 몫을 자연수까지 구하면 ${v.q}이고 ${S(v.r)} kg이 남는다. 남은 쌀로 한 봉지를 더 채우려면 ${S(v.y)} − ${S(v.r)} = ${S(more)}(kg)이 더 필요하다.`,
          facts: { calc: [[`((${f.b})-(${f.a})%(${f.b}))/${p}`, 0]], unseen: f.un.concat([p]) }
        });
      }),
      H('hard-rest-redo', '문장제: 전체를 되살려 다른 길이로 다시 나누기', '심28 / 기본 ①65 ③55', (d) => {
        // 곱셈과 덧셈으로 전체 길이를 되살린 다음 다시 나누어 몫과 남는 양을 구한다.
        const m = d.until(() => { const c1 = d.int(5, 9), q1 = d.int(3, 9), r = dec(d.int(1, c1 * 10 - 1), 1), c2 = d.int(2, 4), total = plus(nat(c1 * q1), r), t = rest(total, nat(c2)); return { c1, q1, r, c2, total, q2: t.q, r2: t.r }; }, (w) => w.r.k === 1 && w.r2.k === 1 && w.c1 % w.c2 !== 0 && sig(w.total) <= 3);
        const Tn = `(${m.c1}*${m.q1}*10+${ix(m.r).s})`, C2 = `(${m.c2}*10)`;
        return M(`색 테이프를 ${m.c1} m씩 자르면 ${m.q1}도막이 되고 ${S(m.r)} m가 남는다. 같은 길이의 색 테이프를 ${m.c2} m씩 자르면 몇 도막이 되고 몇 m가 남는가?`, [{ label: '도막', answer: m.q2, unit: '개' }, { label: '남는 길이', answer: V(m.r2), unit: 'm', decimal: true }], {
          explain: `색 테이프의 길이는 ${m.c1} × ${m.q1} + ${S(m.r)} = ${S(m.total)}(m)이다. ${S(m.total)} ÷ ${m.c2}의 몫을 자연수까지 구하면 ${m.q2}이고 남는 길이는 ${S(m.total)} − ${m.c2} × ${m.q2} = ${S(m.r2)}(m)이다.`,
          facts: { calc: [[`(${Tn}-${Tn}%${C2})/${C2}`, 0], [`${Tn}%${C2}/10`, 1]], unseen: ix(m.r).un.concat([10]) }
        });
      }),
      H('hard-rest-square', '문장제: 철사로 정사각형을 만들고 남는 길이', '심55 / 기본 ③70', (d) => {
        // 정사각형 한 개에 드는 철사의 길이(네 변)를 먼저 구한다.
        const m = d.until(() => { const s = dec(nz(d, 21, 69), 1), per = mulD(s, nat(4)), q = d.int(2, 7), r = dec(d.int(1, per.n * P10[1 - per.k] - 1), 1); return { s, per, q, r, x: plus(mulD(per, nat(q)), r) }; }, (w) => sig(w.per) <= 2 && w.r.k === 1 && w.x.k === 1 && sig(w.x) <= 3);
        const X = ix(m.x), Sx = ix(m.s), P = `(${Sx.s}*4)`;
        return M(`길이가 ${S(m.x)} cm인 철사로 한 변의 길이가 ${S(m.s)} cm인 정사각형을 여러 개 만들려고 한다. 정사각형은 몇 개까지 만들 수 있고, 남는 철사는 몇 cm인가?`, [{ label: '정사각형', answer: m.q, unit: '개' }, { label: '남는 철사', answer: V(m.r), unit: 'cm', decimal: true }], {
          explain: `정사각형 한 개를 만드는 데 철사가 ${S(m.s)} × 4 = ${S(m.per)}(cm) 든다. ${S(m.x)} ÷ ${S(m.per)}의 몫을 자연수까지 구하면 ${m.q}이고 남는 철사는 ${S(m.x)} − ${S(m.per)} × ${m.q} = ${S(m.r)}(cm)이다.`,
          facts: { calc: [[`(${X.s}-${X.s}%${P})/${P}`, 0], [`${X.s}%${P}/10`, 1]], unseen: X.un.concat(Sx.un, [4, 10]) }
        });
      }),
      H('hard-box-equal', '한쪽을 먼저 계산하여 □ 구하기', '기본 ①29', (d) => {
        // 왼쪽 나눗셈의 몫을 먼저 구한다. 오른쪽 식의 나누는 수는 나누어지는 수를 그 몫으로 나누어 구한다.
        const m = d.until(() => { const l = mk(d, Y.a2, () => qn(d, 4, 80), (w) => w.x.k === 0 && w.x.n <= 99), t = qd(d, 12, 98, 1); return { l, t, X2: mulD(l.q, t) }; }, (w) => w.X2.k <= 1 && sig(w.X2) <= 3 && String(w.X2.n).replace(/0+$/, '') !== String(w.l.x.n).replace(/0+$/, '') && w.l.q.n % 10 !== 0);
        return D('□ 안에 알맞은 수는?', V(m.t), {
          figure: eq(S(m.l.x), '/', S(m.l.y), '=', S(m.X2), '/', box()),
          explain: `${told(m.l.x, m.l.y)}이다. ${S(m.X2)} ÷ □ = ${m.l.q.n}이므로 □ = ${S(m.X2)} ÷ ${m.l.q.n} = ${S(m.t)}이다.`,
          facts: { calc: [[`${S(m.X2)}/(${S(m.l.x)}/${S(m.l.y)})`, 0]] }
        });
      }),
      H('hard-hour', '문장제: 1시간 30분을 소수로 고쳐 1시간 동안 간 거리 구하기', '심40 / 기본 ②47 ③43', (d) => {
        // 1시간 30분 = 1.5시간으로 고친 다음 나누고 반올림한다.
        const X = d.until(() => d.int(16, 59), (w) => w % 3 !== 0), x = nat(X), y = dec(15, 1), r = rnd(x, y, 0), p = d.pick(NAMES), top = `(${X}*60*2+(1*60+30))`, low = '(2*(1*60+30))';
        return N(`${name(p, '은/는')} 자전거를 타고 일정한 빠르기로 1시간 30분 동안 ${X} km를 갔다. 1시간 동안 간 거리는 몇 km인지 반올림하여 일의 자리까지 나타내시오.`, r.n, {
          unit: 'km', explain: `30분은 0.5시간이므로 1시간 30분은 1.5시간이다. ${X} ÷ 1.5 = ${cutq(x, y, 1)}…이다. 소수 첫째 자리 숫자가 ${cutq(x, y, 1).slice(-1)}이므로 반올림하여 일의 자리까지 나타내면 ${r.n}이다.`,
          facts: { calc: [[`(${top}-${top}%${low})/${low}`, 0]], unseen: [60, 2] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
