// 6학년 1학기 3단원 소수의 나눗셈 — 단원 틀과 기본 문항(계산 원리, (소수)÷(자연수) 계산, (자연수)÷(자연수)의 몫을 소수로, 세로셈 과정과 잘못된 계산).
// 수집해 둔 교과서 8종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 65·79·77꼴, 심화꼴 82꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/6-1-3/싣기_대조표.md 에 있다.
// (어림, 몫의 크기 비교와 조건에 맞는 수, 문장제·도형은 6-1-3b.js 에, 실력 문항은 6-1-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
// 영역은 수와 연산. 성취기준은 6수01-14('(자연수)÷(자연수)'에서 나눗셈의 몫을 소수로 나타낼 수 있다)와
// 6수01-15(소수의 나눗셈의 계산 원리를 탐구하고 그 계산을 할 수 있다) 가운데 (소수)÷(자연수)까지이다.
//
// 싣는 기준
//  - (소수)÷(자연수)와 (자연수)÷(자연수)의 몫을 소수로 나타내는 것만 싣는다. (자연수)÷(소수), (소수)÷(소수), 몫의 반올림, 나누어 주고 남는 양은 6학년 2학기의 일이다.
//  - 하는 일이 다르면 다른 문제다: 주는 것(가로식, 세로셈, 계산 과정의 빈칸, 자연수의 나눗셈과 견주기, 분수로 고쳐 계산하기, 수 모형, 문장), 묻는 것(값, 고르기, 차례, 처음 틀린 곳),
//    계산 구조가 다르면 따로 싣고 계산 문항에는 facts.rule 에 그 이름을 단다(이름대로 되게 수를 뽑는다): 각 자리에서 나누어떨어지는 것, 내림이 있는 것, 몫이 1보다 작은 것,
//    소수점 아래 0을 내려 계산하는 것, 몫의 소수 첫째 자리가 0인 것, 몫이 0.0□인 것, 두 자리 수로 나누는 것, (자연수)÷(자연수).
//  - 교육과정: 「소수의 나눗셈은 계산 원리를 탐구하여 이해하는 수준에서 다룬다.」 「복잡한 계산은 계산기를 사용하게 할 수 있다.」
//    나누어지는 수는 소수 두 자리까지이고 소수점을 뗀 수가 네 자리 이하이다. 나누는 수는 한 자리 수이고 두 자리 수는 12·15·20·25·50처럼 쉬운 것만 드물게 쓴다.
//    몫은 소수 둘째 자리까지이고 셋째 자리는 3 ÷ 8 꼴 한 유형뿐이다. 나누어떨어지지 않는 나눗셈은 싣지 않는다(몫의 반올림은 2학기).
//  - 수는 모두 정수(소수점을 뗀 수와 소수점 아래 자리 수)로 뽑아 셈하고 글에 적을 때만 소수로 적는다. 몫과 나누는 수를 먼저 정하고 나누어지는 수를 거꾸로 만든다.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(빈 곳에 몫 써넣기, 화살표 상자, 표, 사다리, 잇기, 기호에 수를 넣어 나누기는 계산 문항과 같은 문제).
//
// 뺀 것과 까닭(6-1-3b.js, 6-1-3c.js 의 것까지 여기에 모아 적는다)
//  - 6학년 2학기 「소수의 나눗셈」의 일: 나누는 수가 소수가 되는 식(심51 ③54의 13.16 ÷ □ = 4), 몫을 반올림하여 나타내기(심52), 한 통에 3 kg씩 덜어 담기(①36 심28 — 똑같이 나누는 판단으로 바꾸어 실었다),
//    두 수에 같은 수를 곱해도 몫이 같다는 성질(③10)
//  - 비·비율·비례의 일(6-1-4, 6-2): 값에 맞추어 양 구하기(②75, 심62의 값으로 묻는 변형, ①62의 8천 원에 34 m), 빠르기를 구해 여러 단계로 견주기(③72 심64)
//  - 도형·측정의 일: 삼각형의 높이·마름모의 대각선(①56 ②73 심74 — 넓이 공식을 거꾸로 푸는 일이 고비), 넓이를 셈한 뒤 견주기·변 바꾸기(②74 심75), 각뿔·각기둥·정육면체의 모서리(①58 ②64 ③63 심71·72 —
//    모서리 수가 고비), 이어 붙인 도형의 둘레(①64), 직사각형 안 두 원의 지름(심78), 직사각형과 둘레가 같은 정다각형(심70의 변형 — 둘레 셈이 절반을 넘는다), 몫의 단위 바꾸기(심66)
//  - 조건 풀이·경우 따지기·세기가 어려움의 대부분인 것: 간격·나무 심기(①63 ②76·77 ③70·71 심80·81), 겹쳐 이어 붙이기(②78 심79), 바구니 무게 지우기(②72 심61), 세로셈의 가려진 숫자 여럿(①41 심15),
//    □를 하나씩 넣어 보기(①40), 몫이 정해진 식을 수 카드로 만들기(①44 심44), 새로 약속한 셈(심45), 규칙 찾기(②58), 순서도(③74), 어떤 수를 두 단계 거꾸로 풀기(②50 심50 심17)
//  - 뜻 없는 셈: 두 몫의 합·차(①27 ②26 ③45 심33), 기호 여럿을 잇는 긴 계산(①46 심34), 가장 큰 몫과 가장 작은 몫의 합·차(심43), 두 □의 합(③54의 변형)
//  - 계산기에 맡기는 금을 넘는 것: 0을 두 번 내려 몫이 소수 세 자리가 되는 (소수)÷(자연수)(②16 ③17), 다섯 자리 나누어지는 수(①11의 448.84 ÷ 4, ②69), 네 자리 수를 두 자리 수로 나누기(①17·③20의 일부), 10·100으로 나누어 소수 넷째 자리까지 가는 놀이(③76)
//  - 작도·서술형·열린 답: 묶기(①1 ②10 — 수 모형을 보고 과정의 빈칸을 채우는 것으로 바꿈), 계산 과정·까닭·방법 쓰기(①6·30·31 ②11·45·46 ③9·33·34·39 심6·20~23 —
//    과정의 빈칸, 방법 고르기, 처음 잘못된 곳 고르기, 잘못된 까닭 고르기, 바른 몫 구하기, 틀린 사람 고르기로 바꿈), 문제 만들기(①55의 변형 ②66 ③73 — 식에 알맞은 상황 고르기로 바꿈), 놀이(③75·77)
//  - 같은 문제여서 한 번만 실은 것: 빈 곳에 몫 써넣기·화살표·표(①19 ③21 — 계산 문항과 같다), 기호에 수를 넣어 나누기(③49), 한 수를 두 수로 각각 나누기(②23의 변형),
//    ×1/■ 꼴로 쓴 분수 계산(②7의 변형 — 분수의 나눗셈으로 고치기와 같다), 세로셈 빈칸 가운데 다른 수 찾기(③32 — 세로셈 과정의 빈칸과 같다), 잘못 곱한 어떤 수만 구하기(②51 — 곱셈식의 □와 같다),
//    몫이 몇 분의 일인 나눗셈 만들기(③7 — 몫을 보고 나누어지는 수 찾기와 같다), 몫이 같은 두 식 찾기(①23 ②42의 변형 — 몫이 다른 하나 찾기와 같다),
//    휘발유 1 L로 가는 거리(②62 ③59의 변형 — 1시간 동안 간 거리와 얼개가 같다), 400 g에 든 양으로 100 g에 든 양 구하기(③60 — 50분 동안 간 거리로 10분 동안 간 거리 구하기와 얼개가 같다)
//  - 그림이 필요해 미룬 것은 없다. 세로셈(소수점·내려 쓴 0·몫의 0), 수 모형, 수직선, 똑같이 나눈 도형은 단원 파일의 그림 함수로 그렸다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, lines, chain, N, M, C, D } = B.kit;
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

  const CALC = '다음을 계산하시오.';
  // 계산 문항. pick(d) 는 { x: 나누어지는 수, c: 나누는 수 }를 돌려준다. layout: 'col'(세로셈) | 'row'(가로식).
  // 같은 꼴의 식이 계산 구조만 달리하여 여러 번 실리므로 facts.rule 에 구조의 이름(유형 이름)을 단다. 구조의 조건은 pick 이 지킨다.
  const calcType = (id, title, ref, layout, pick, more) => T(id, title, ref, (d) => {
    const v = pick(d);
    return qAns(CALC, v.x, v.c, { figure: layout === 'col' ? ddiv(v.c, v.x) : eq(S(v.x), '/', v.c, '=', box()), explain: how(v.x, v.c), facts: { rule: id } });
  }, more);
  // 자리마다 나누어떨어지는 몫: 숫자마다 1부터 9 ÷ c 까지
  const digitwise = (d, c, len, k) => { let n = 0; for (let i = 0; i < len; i += 1) n = n * 10 + d.int(1, Math.floor(9 / c)); return { n, k }; };
  // (자연수)÷(자연수): 몫이 소수 places 자리 수가 되는 a, c
  const natPair = (d, cs, places, ok) => d.until(() => { const c = d.pick(cs), a = d.int(1, 99); return { c, x: nat(a), q: quo(nat(a), c) }; }, (v) => v.q && v.q.k === places && (!ok || ok(v)));

  // 잘못 계산한 세로셈. kind: 0 몫의 소수 첫째 자리 0을 빠뜨림, 1 몫의 소수점을 잘못 찍음, 2 소수점 아래 0을 내리지 않고 멈춤.
  function wrongDiv(d, kind) {
    if (kind === 0) {
      const v = gen(d, C29, () => ({ n: d.int(1, 9) * 100 + d.int(1, 9), k: 2 }), (w) => w.x.k >= 1 && w.x.n >= 100), text = S(v.x), intLen = text.split('.')[0].length, n = intLen + 2;
      // 몫 W.0f 를 W.f 로 적었다(0을 쓰지 않고 다음 숫자를 바로 붙여 썼다).
      const cells = Array.from({ length: n }, (_, i) => (i === intLen - 1 ? String(Math.floor(v.q.n / 100)) : i === intLen ? String(v.q.n % 10) : ''));
      return Object.assign(v, { figure: ddiv(v.c, v.x, { steps: true, given: { cells, dot: intLen - 1 } }), wrong: `${Math.floor(v.q.n / 100)}.${v.q.n % 10}`, why: `수를 하나 내려도 나눌 수 없으면 몫의 그 자리에 0을 쓰고 수를 하나 더 내려 계산한다.` });
    }
    if (kind === 1) {
      // 몫의 숫자는 맞지만 소수점을 한 자리 오른쪽에 찍었다(몫이 1보다 작으면 일의 자리 0도 쓰지 않았다).
      const v = gen(d, C29, () => (d.bool() ? qd(d, 12, 98, 2) : qd(d, 112, 298, 2)), (w) => w.x.k === 2 && plainQ(w.q) && w.x.n < 1000 && w.x.n >= 100), small = v.q.n < 100;
      const cells = small ? [''].concat(digs(v.q.n).map(String)) : digs(v.q.n).map(String);
      return Object.assign(v, { figure: ddiv(v.c, v.x, { steps: true, given: { cells, dot: 1 } }), wrong: fx(v.q.n, 1), why: `몫의 소수점은 나누어지는 수의 소수점 자리에 맞추어 찍는다.${small ? ' 나누어지는 수의 일의 자리 숫자가 나누는 수보다 작으면 몫의 일의 자리에 0을 쓴다.' : ''}` });
    }
    const v = gen(d, [2, 4, 5, 6, 8], () => qd(d, 112, 995, 2), (w) => w.x.k === 1 && plainQ(w.q) && w.x.n >= 100 && w.x.n < 1000), cut = Math.floor(v.q.n / 10);
    return Object.assign(v, { figure: ddiv(v.c, v.x, { steps: true, pad: 0 }), wrong: fx(cut, 1), why: `남은 수가 있으면 소수점 아래 0을 내려 나누어떨어질 때까지 계산한다.` });
  }
  // 분수로 고쳐 계산하다 틀린 과정. kind: 0 소수 두 자리 수를 분모가 10인 분수로 고침, 1 끝에서 소수로 잘못 고침, 2 분자만 10배 하고 분모는 그대로 둠.
  // 줄마다 값(1000배 한 정수)을 함께 돌려준다: 처음 식, ㉠, ㉡, ㉢.
  function wrongFrac(d, kind) {
    if (kind === 0) {
      const v = gen(d, C29, () => qd(d, 12, 98, 2), (w) => w.x.k === 2 && w.x.n >= 100 && w.x.n < 1000), p = v.q.n;
      return Object.assign(v, { steps: [eq(frac(v.x.n, 10), '/', v.c), ex(frac(p, 10)), ex(fx(p, 1))], values: [p * 10, p * 100, p * 100, p * 100], first: 0, why: `${J(v.x, '은/는')} 소수 두 자리 수이므로 분모가 100인 분수 ${frac(v.x.n, 100)}${dj(String(v.x.n), '으로/로').slice(String(v.x.n).length)} 고쳐야 한다.` });
    }
    if (kind === 1) {
      const v = gen(d, C29, () => qd(d, 12, 98, 2), (w) => w.x.k === 2 && w.x.n >= 100 && w.x.n < 1000), p = v.q.n;
      return Object.assign(v, { steps: [eq(frac(v.x.n, 100), '/', v.c), ex(frac(p, 100)), ex(fx(p, 1))], values: [p * 10, p * 10, p * 10, p * 100], first: 2, why: `${frac(p, 100)}${dj(String(p), '은/는').slice(String(p).length)} 0.01이 ${p}개인 수이므로 ${fx(p, 2)}이다.` });
    }
    const v = gen(d, [4, 5, 6, 8], () => qd(d, 112, 495, 2), (w) => w.x.k === 1 && w.x.n >= 10 && w.x.n < 1000), p = v.q.n, a = v.x.n;
    return Object.assign(v, { steps: [eq(frac(a, 10), '/', v.c), eq(frac(a * 10, 10), '/', v.c), eq(frac(p, 10), '=', fx(p, 1))], values: [p * 10, p * 10, p * 100, p * 100], first: 1, why: `분자를 10배 하면 분모도 10배 하여 ${frac(a * 10, 100)}${dj(String(a * 10), '으로/로').slice(String(a * 10).length)} 고쳐야 크기가 같다.` });
  }

  B.addUnit({
    id: '6-1-3', grade: 6, semester: 1, no: 3, title: '소수의 나눗셈', version: 2,
    groups: [
      {
        id: 'prin', title: '(소수)÷(자연수)의 계산 원리', standard: DEC,
        types: [
          T('pr-model', '수 모형을 보고 (소수)÷(자연수) 알아보기', '①1 ②10 ③4', (d, n) => {
            if (n === 0) {
              // 자리마다 나누어떨어진다: 1 모형과 0.1 모형을 따로 똑같이 나눈다.
              const c = d.pick([2, 3, 4]), q = d.until(() => digitwise(d, c, 2, 1), (r) => r.n % 11 !== 0), x = times(q, c), [w, t] = digs(x.n), [qw, qt] = digs(q.n);
              return M(`${J(x, '을/를')} 수 모형으로 나타내었다. 수 모형을 똑같이 ${c}묶음으로 나누려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], nat(qw)), inp(LAB[1], nat(qt)), inp(LAB[2], q)], {
                figure: model(w, t) + lines([`한 묶음: 1 모형 ${box(LAB[0])}개, 0.1 모형 ${box(LAB[1])}개`, eq(S(x), '/', c, '=', box(LAB[2]))]),
                explain: `1 모형 ${w}개를 ${c}묶음으로 나누면 한 묶음에 ${qw}개, 0.1 모형 ${t}개를 ${c}묶음으로 나누면 한 묶음에 ${qt}개이다. 한 묶음은 ${S(q)}이다.`,
                facts: { calc: [[`${w}/${c}`, 0], [`${t}/${c}`, 1], [`${S(x)}/${c}`, 2]], rule: 'modelPlain' }
              });
            }
            // 1 모형 하나가 남는다: 0.1 모형 10개로 바꾸어 나눈다.
            const c = d.pick([2, 3]), qw = d.int(1, c === 2 ? 3 : 2), w = qw * c + 1, t = d.pick(c === 2 ? [2, 4, 6, 8] : [2, 5, 8]), x = dec(w * 10 + t, 1), q = quo(x, c);
            return M(`${J(x, '을/를')} 수 모형으로 나타내었다. 수 모형을 똑같이 ${c}묶음으로 나누려고 한다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], nat(10 + t)), inp(LAB[1], nat((10 + t) / c)), inp(LAB[2], q)], {
              figure: model(w, t) + lines([`1 모형을 한 묶음에 ${qw}개씩 놓으면 1개가 남는다.`, `남은 1 모형 1개를 0.1 모형 10개로 바꾸면 0.1 모형은 모두 ${box(LAB[0])}개이다.`, `한 묶음: 1 모형 ${qw}개, 0.1 모형 ${box(LAB[1])}개`, eq(S(x), '/', c, '=', box(LAB[2]))]),
              explain: `0.1 모형은 10 + ${t} = ${10 + t}(개)이고 ${c}묶음으로 나누면 한 묶음에 ${(10 + t) / c}개이다. 한 묶음은 1 모형 ${qw}개와 0.1 모형 ${(10 + t) / c}개이므로 ${S(q)}이다.`,
              facts: { calc: [[`10+${t}`, 0], [`(10+${t})/${c}`, 1], [`${S(x)}/${c}`, 2]], rule: 'modelChange' }
            });
          }, { count: 2 }),
          T('pr-unit', '단위를 바꾸어 계산하기', '①2 ②1 ③3', (d, n) => {
            if (n === 0) {
              // cm를 mm로 바꾸어 자연수의 나눗셈으로 계산한 뒤 되돌린다.
              const v = gen(d, C29, () => qd(d, 12, 98, 1), (w) => w.x.k === 1 && w.x.n >= 100), i = ix(v.x);
              return M(`길이가 ${S(v.x)} cm인 철사를 ${v.c}도막으로 똑같이 자르려고 한다. 1 cm = 10 mm임을 이용하여 한 도막의 길이를 구하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?`, [inp(LAB[0], nat(v.x.n)), inp(LAB[1], nat(v.q.n)), inp(LAB[2], v.q)], {
                figure: lines([`${S(v.x)} cm = ${box(LAB[0])} mm`, `${box(LAB[0])} ÷ ${v.c} = ${box(LAB[1])}(mm)`, `한 도막의 길이: ${box(LAB[2])} cm`]),
                explain: `${S(v.x)} cm는 ${v.x.n} mm이다. ${v.x.n} ÷ ${v.c} = ${v.q.n}(mm)이고 ${v.q.n} mm는 ${S(v.q)} cm이다.`,
                facts: { calc: [[i.s, 0], [`${i.s}/${v.c}`, 1], [`${S(v.x)}/${v.c}`, 2]], unseen: i.un }
              });
            }
            // 같은 길이를 cm와 m로 적은 두 끈
            const v = gen(d, [2, 3, 4], () => qd(d, 112, 298, 2), (w) => w.x.k === 2 && plainQ(w.q)), [p, s] = d.shuffle(NAMES).slice(0, 2);
            return qAns(`${name(p, '은/는')} 길이가 ${v.x.n} cm인 끈을, ${name(s, '은/는')} 길이가 ${S(v.x)} m인 끈을 각각 ${v.c}도막으로 똑같이 잘랐다. ${name(p, '이/가')} 자른 한 도막의 길이가 ${v.q.n} cm일 때, ${name(s, '이/가')} 자른 한 도막의 길이는 몇 m인가?`, v.x, v.c, {
              unit: 'm', explain: `${S(v.x)} m는 ${v.x.n} cm이므로 두 끈의 길이는 같다. 한 도막의 길이 ${v.q.n} cm를 m로 나타내면 ${S(v.q)} m이다.`
            });
          }, { count: 2 }),
          T('pr-nat', '자연수의 나눗셈을 이용하여 (소수)÷(자연수) 계산하기', '①3 ②2 ③1 심1', (d, n) => {
            if (n === 0) {
              // 나누어지는 수가 1/10배, 1/100배가 되는 두 식
              const v = gen(d, C29, () => ({ n: nz(d, 112, 498), k: 0 }), (w) => w.x.n % 10 !== 0 && w.x.n < 1000 && plainQ(w.q)), a = v.x.n, rs = [1, 2].map((k) => dec(v.q.n, k));
              return M(`${a} ÷ ${v.c} = ${v.q.n}이다. ㉠, ㉡에 알맞은 수는?`, rs.map((r, j) => inp(LAB[j], r)), {
                figure: lines([1, 2].map((k, j) => eq(fx(a, k), '/', v.c, '=', box(LAB[j])))),
                explain: `나누어지는 수가 ${part(1)}배, ${part(2)}배가 되면 몫도 ${part(1)}배, ${part(2)}배가 된다. ${v.q.n}의 ${part(1)}배는 ${S(rs[0])}, ${part(2)}배는 ${S(rs[1])}이다.`,
                facts: { calc: [1, 2].map((k, j) => [`${fx(a, k)}/${v.c}`, j]) }
              });
            }
            // 둘째 문항은 몫이 1보다 작아지는 것, 셋째 문항은 몫의 가운데에 0이 있는 것
            const v = n === 1 ? gen(d, C29, () => ({ n: nz(d, 12, 98), k: 0 }), (w) => w.x.n % 10 !== 0 && w.x.n >= 100 && w.x.n < 1000) : gen(d, C29, () => ({ n: d.int(1, 9) * 100 + d.int(1, 9), k: 0 }), (w) => w.x.n % 10 !== 0);
            const x = dec(v.x.n, 2), r = dec(v.q.n, 2);
            return qAns(`${v.x.n} ÷ ${v.c} = ${v.q.n}이다. ${S(x)} ÷ ${v.c}의 몫은?`, x, v.c, {
              explain: `${J(x, '은/는')} ${v.x.n}의 ${part(2)}배이므로 몫도 ${v.q.n}의 ${part(2)}배인 ${S(r)}이다.${n === 1 ? ' 몫이 1보다 작으므로 일의 자리에 0을 쓴다.' : ''}`,
              facts: { rule: ['', 'natSmall', 'natZero'][n] }
            });
          }, { count: 3 }),
          T('pr-nat-ratio', '나누어지는 수가 몇 분의 일이 될 때 몫의 변화', '①5 ②2 ③1 심3', (d) => {
            const v = gen(d, C29, () => ({ n: nz(d, 112, 498), k: 0 }), (w) => w.x.n % 10 !== 0 && plainQ(w.q)), k = d.pick([1, 2]), x = dec(v.x.n, k);
            const rows = d.shuffle([[`${part(1)}배`, k === 1], [`${part(2)}배`, k === 2], ['10배', false], ['100배', false]]);
            return C(`${v.x.n} ÷ ${v.c} = ${v.q.n}이다. ${S(x)} ÷ ${v.c}의 몫은 ${v.q.n}의 몇 배인가?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              explain: `${J(x, '은/는')} ${v.x.n}의 ${part(k)}배이다. 나누어지는 수가 ${part(k)}배가 되면 몫도 ${part(k)}배가 되므로 ${S(x)} ÷ ${v.c} = ${fx(v.q.n, k)}이다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('pr-nat-zero', '0을 붙인 자연수의 나눗셈을 이용하여 계산하기', '①4 ②3 ③2', (d) => {
            // 4.5 ÷ 6: 45 ÷ 6은 나누어떨어지지 않으므로 450 ÷ 6을 이용한다. 4.5는 450의 1/100배이다.
            const v = gen(d, [2, 4, 5, 6, 8], () => qd(d, 12, 995, 2), (w) => w.x.k === 1 && plainQ(w.q));
            return qAns(`${v.x.n * 10} ÷ ${v.c} = ${v.q.n}이다. ${S(v.x)} ÷ ${v.c}의 몫은?`, v.x, v.c, {
              explain: `${J(v.x, '은/는')} ${v.x.n * 10}의 ${part(2)}배이므로 몫도 ${v.q.n}의 ${part(2)}배인 ${S(v.q)}이다.`, facts: { rule: 'natPad' }
            });
          }),
          T('pr-nat-which', '이용할 자연수의 나눗셈 고르기', '②3', (d) => {
            const v = gen(d, [2, 4, 5, 6, 8], () => qd(d, 105, 995, 2), (w) => w.x.k === 1), a = v.x.n, flip = d.bool(), rows = flip ? [a * 10, a] : [a, a * 10];
            return C(`자연수의 나눗셈의 몫을 이용하여 ${S(v.x)} ÷ ${josa(v.c, '을/를')} 계산하려고 한다. 몫이 자연수가 되어 이용할 수 있는 식은?`, rows.map((r) => eq(r, '/', v.c)), flip ? 0 : 1, {
              explain: `${a} ÷ ${josa(v.c, '은/는')} 나누어떨어지지 않는다. ${a * 10} ÷ ${v.c} = ${v.q.n}이고 ${J(v.x, '은/는')} ${a * 10}의 ${part(2)}배이므로 ${told(v.x, v.c)}이다.`,
              facts: { claimed: rows.map((r) => [`${r}%${v.c}`, 0]), claimedWant: true }
            });
          }),
          T('pr-dividend', '몫을 보고 나누어지는 수 찾기', '①6 ②5 ③8 심2', (d, n) => {
            if (n === 0) {
              const v = gen(d, C29, () => ({ n: nz(d, 112, 498), k: 0 }), (w) => w.x.n % 10 !== 0 && plainQ(w.q)), k = d.pick([1, 2]), x = dec(v.x.n, k), r = dec(v.q.n, k);
              return D(`${v.x.n} ÷ ${v.c} = ${v.q.n}이다. □ ÷ ${v.c} = ${S(r)}일 때 □ 안에 알맞은 수는?`, V(x), {
                explain: `몫 ${J(r, '은/는')} ${v.q.n}의 ${part(k)}배이므로 나누어지는 수도 ${v.x.n}의 ${part(k)}배인 ${S(x)}이다.`,
                facts: { calc: [[`${S(r)}*${v.c}`, 0]], rule: 'dividendDec' }
              });
            }
            // 120 ÷ 8 = 15 → □ ÷ 8 = 1.5: 나누어지는 수가 자연수 12이다.
            const v = natPair(d, [4, 5, 6, 8], 1, (w) => w.x.n > w.c && w.x.n >= 11), a = v.x.n, i = ix(v.q);
            return N(`${a * 10} ÷ ${v.c} = ${v.q.n}이다. □ ÷ ${v.c} = ${S(v.q)}일 때 □ 안에 알맞은 수는?`, a, {
              explain: `몫 ${J(v.q, '은/는')} ${v.q.n}의 ${part(1)}배이므로 나누어지는 수도 ${a * 10}의 ${part(1)}배인 ${a}이다.`,
              facts: { calc: [[`${i.s}*${v.c}/10`, 0]], unseen: i.un, rule: 'dividendNat' }
            });
          }, { count: 2 }),
          T('pr-pick-expr', '자연수의 나눗셈을 보고 몫이 주어진 수인 식 고르기', '①7 ②4', (d) => {
            const v = gen(d, C29, () => ({ n: nz(d, 112, 989), k: 0 }), (w) => w.x.n % 10 !== 0 && w.x.n >= 1000 && plainQ(w.q)), a = v.x.n, k = d.pick([1, 2]), rows = d.shuffle([1, 2, 3]);
            return C(`${a} ÷ ${v.c} = ${v.q.n}이다. 몫이 ${fx(v.q.n, k)}인 나눗셈은?`, rows.map((j) => eq(fx(a, j), '/', v.c)), rows.indexOf(k), {
              explain: `${dj(fx(v.q.n, k), '은/는')} ${v.q.n}의 ${part(k)}배이므로 나누어지는 수도 ${a}의 ${part(k)}배인 ${fx(a, k)}이어야 한다.`,
              facts: { pick: { expr: `${v.q.n}*${v.c}*${P10[3 - k]}`, options: rows.map((j) => a * P10[3 - j]) }, unseen: [P10[3 - k]] }
            });
          }),
          T('pr-move-wrong', '자연수의 몫에서 소수점을 잘못 옮긴 것 찾기', '①7·31 ②46 심20', (d) => {
            // 세 줄 가운데 한 줄만 소수점을 한 자리 잘못 옮겼다(1/10배와 1/100배를 헷갈렸다).
            const rows = d.until(() => [0, 1, 2].map(() => { const v = gen(d, C29, () => ({ n: nz(d, 112, 498), k: 0 }), (w) => w.x.n % 10 !== 0 && w.x.n < 1000 && plainQ(w.q)); return Object.assign(v, { k: d.pick([1, 2]) }); }), (list) => new Set(list.map((v) => v.x.n)).size === 3), bad = d.int(0, 2);
            const shown = rows.map((v, i) => (i === bad ? 3 - v.k : v.k));
            return C('자연수의 나눗셈을 이용하여 소수의 나눗셈을 계산하였다. 잘못 계산한 것은?', THREE, bad, {
              figure: tagged(rows.map((v, i) => `${eq(v.x.n, '/', v.c, '=', v.q.n)}이므로 ${eq(fx(v.x.n, v.k), '/', v.c, '=', fx(v.q.n, shown[i]))}`)),
              explain: `${dj(fx(rows[bad].x.n, rows[bad].k), '은/는')} ${rows[bad].x.n}의 ${part(rows[bad].k)}배이므로 몫도 ${rows[bad].q.n}의 ${part(rows[bad].k)}배인 ${fx(rows[bad].q.n, rows[bad].k)}이다.`,
              facts: { claimed: rows.map((v, i) => [mil(dec(v.x.n, v.k), v.c).s, v.q.n * P10[3 - shown[i]]]), claimedWant: false }
            });
          }),
          T('pr-talk', '자연수의 나눗셈으로 계산하는 방법을 잘못 말한 사람 찾기', '②46 ③1 심20', (d) => {
            const v = gen(d, C29, () => ({ n: nz(d, 12, 48), k: 0 }), (w) => w.x.n % 10 !== 0 && w.x.n < 100 && w.x.n > w.c * 10), x = dec(v.x.n, 1), r = dec(v.q.n, 1), who = d.shuffle(NAMES).slice(0, 3), kind = d.int(0, 2);
            const rows = d.shuffle([
              { ok: kind !== 0, text: `${J(x, '은/는')} ${v.x.n}의 ${part(kind === 0 ? 2 : 1)}배이다.` },
              { ok: kind !== 1, text: `나누는 수가 같을 때 나누어지는 수가 ${part(1)}배가 되면 몫${kind === 1 ? '은 10배' : `도 ${part(1)}배`}가 된다.` },
              { ok: kind !== 2, text: `${S(x)} ÷ ${v.c}의 몫은 ${kind === 2 ? fx(v.q.n, 2) : S(r)}이다.` }
            ]), hit = rows.findIndex((row) => !row.ok);
            return C(`${v.x.n} ÷ ${v.c} = ${josa(v.q.n, '을/를')} 이용하여 ${S(x)} ÷ ${josa(v.c, '을/를')} 계산하는 방법을 말하였다. 잘못 말한 사람은?`, who, hit, {
              figure: lines(rows.map((row, i) => said(who[i], row.text))),
              explain: `${J(x, '은/는')} ${v.x.n}의 ${part(1)}배이다. 나누어지는 수가 ${part(1)}배가 되면 몫도 ${part(1)}배가 되므로 ${S(x)} ÷ ${v.c} = ${S(r)}이다.`,
              facts: { truth: rows.map((row) => row.ok), want: false }
            });
          }),
          T('pr-frac', '분수의 나눗셈으로 고쳐 계산하기', '①9 ②7 ③5 심4', (d, n) => {
            if (n === 2) {
              // 몫이 1보다 작거나 몫의 소수 첫째 자리가 0인 것: 분자가 두 자리 수(84/100), 가운데가 0인 수(208/100)이다.
              const v = d.bool() ? gen(d, C29, () => qd(d, 12, 98, 2), (w) => w.x.k === 2 && w.x.n >= 100) : gen(d, C29, () => ({ n: d.int(1, 9) * 100 + d.int(1, 9), k: 2 }), (w) => w.x.k === 2 && w.x.n < 1000);
              return M('소수를 분수로 고쳐 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], nat(v.q.n)), inp(LAB[1], v.q)], {
                figure: lines([eq(S(v.x), '/', v.c, '=', frac(v.x.n, 100), '/', v.c), eq('=', frac(box(LAB[0]), 100), '=', box(LAB[1]))]),
                explain: `${frac(v.x.n, 100)} ÷ ${v.c} = ${frac(`${v.x.n} ÷ ${v.c}`, 100)} = ${frac(v.q.n, 100)}이다. 0.01이 ${v.q.n}개인 수는 ${S(v.q)}이다.`,
                facts: { calc: [[`${v.x.n}/${v.c}`, 0], [`${S(v.x)}/${v.c}`, 1]], rule: 'fracSmall' }
              });
            }
            // 첫째 문항은 분모가 10(소수 한 자리 수), 둘째 문항은 분모가 100(소수 두 자리 수).
            const v = n === 0 ? gen(d, C29, () => qd(d, 12, 98, 1), (w) => w.x.k === 1 && w.x.n >= 100) : gen(d, C29, () => qd(d, 112, 498, 2), (w) => w.x.k === 2 && plainQ(w.q) && w.x.n < 1000), den = P10[v.x.k], i = ix(v.x);
            return M('소수를 분수로 고쳐 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [inp(LAB[0], nat(v.x.n)), inp(LAB[1], nat(v.q.n)), inp(LAB[2], v.q)], {
              figure: lines([eq(S(v.x), '/', v.c, '=', frac(box(LAB[0]), den), '/', v.c), eq('=', frac(`${box(LAB[0])} ÷ ${v.c}`, den), '=', frac(box(LAB[1]), den), '=', box(LAB[2]))]),
              explain: `${S(v.x)} = ${frac(v.x.n, den)}이다. 분모는 그대로 두고 분자를 나누면 ${frac(`${v.x.n} ÷ ${v.c}`, den)} = ${frac(v.q.n, den)}이고, 소수로 나타내면 ${S(v.q)}이다.`,
              facts: { calc: [[i.s, 0], [`${i.s}/${v.c}`, 1], [`${S(v.x)}/${v.c}`, 2]], unseen: i.un, rule: ['fracTen', 'fracHundred'][n] }
            });
          }, { count: 3 }),
          T('pr-frac-hundred', '분모를 100으로 다시 고쳐 계산하기', '①10 ②8 ③6 심4', (d) => {
            // 2.6 ÷ 4: 26 ÷ 4가 나누어떨어지지 않으므로 26/10을 260/100으로 고친다.
            const v = gen(d, [2, 4, 5, 6, 8], () => qd(d, 12, 495, 2), (w) => w.x.k === 1 && plainQ(w.q) && w.x.n < 100), a = v.x.n;
            return M('소수를 분수로 고쳐 계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [inp(LAB[0], nat(a * 10)), inp(LAB[1], nat(v.q.n)), inp(LAB[2], v.q)], {
              figure: lines([eq(S(v.x), '/', v.c, '=', frac(a, 10), '/', v.c), eq('=', frac(box(LAB[0]), 100), '/', v.c), eq('=', frac(box(LAB[1]), 100), '=', box(LAB[2]))]),
              explain: `${a} ÷ ${josa(v.c, '은/는')} 나누어떨어지지 않으므로 ${frac(a, 10)}${dj(String(a), '을/를').slice(String(a).length)} ${frac(a * 10, 100)}으로 고친다. ${a * 10} ÷ ${v.c} = ${v.q.n}이므로 ${frac(v.q.n, 100)} = ${S(v.q)}이다.`,
              facts: { calc: [[`${a}*100/10`, 0], [`${a}*100/10/${v.c}`, 1], [`${S(v.x)}/${v.c}`, 2]] }
            });
          }),
          T('pr-method', '(소수)÷(자연수)를 어떤 방법으로 계산했는지 알기', '①9 ②11 ③9 심6', (d) => {
            // 분수의 나눗셈, 자연수의 나눗셈, 0.1의 개수 가운데 하나로 계산한 것을 보인다.
            const v = gen(d, C29, () => qd(d, 12, 48, 1), (w) => w.x.k === 1 && w.x.n >= 10), a = v.x.n, kind = d.int(0, 2), r = S(v.q);
            const shown = [
              [eq(S(v.x), '/', v.c, '=', frac(a, 10), '/', v.c), eq('=', frac(`${a} ÷ ${v.c}`, 10), '=', frac(v.q.n, 10), '=', r)],
              [eq(a, '/', v.c, '=', v.q.n), `${v.q.n}의 ${part(1)}배 → ${eq(S(v.x), '/', v.c, '=', r)}`],
              [`${J(v.x, '은/는')} 0.1이 ${a}개인 수이고 ${a} ÷ ${v.c} = ${v.q.n}이다.`, `0.1이 ${v.q.n}개인 수 → ${eq(S(v.x), '/', v.c, '=', r)}`]
            ][kind];
            const rows = d.shuffle([['소수를 분수로 고쳐 분자를 자연수로 나누었다.', 0], [`자연수의 나눗셈을 한 다음 몫을 ${part(1)}배 하였다.`, 1], ['0.1이 모두 몇 개인지 알아보고 그 개수를 나누었다.', 2], ['나누어지는 수와 나누는 수에 같은 수를 곱하여 계산하였다.', 3]]);
            return C('다음 계산에 대한 설명으로 옳은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === kind), {
              figure: lines(shown),
              explain: [`${J(v.x, '을/를')} 분모가 10인 분수로 고쳐 분모는 그대로 두고 분자를 ${josa(v.c, '으로/로')} 나누었다.`, `${a} ÷ ${josa(v.c, '을/를')} 먼저 계산하고, ${J(v.x, '이/가')} ${a}의 ${part(1)}배이므로 몫도 ${part(1)}배 하였다.`, `0.1이 ${a}개인 수를 ${josa(v.c, '으로/로')} 나누면 0.1이 ${v.q.n}개라고 세었다.`][kind] + ` 어느 방법으로 계산해도 ${told(v.x, v.c)}이다.`,
              facts: { truth: rows.map((row) => row[1] === kind), want: true }
            });
          })
        ]
      },
      {
        id: 'calc', title: '(소수)÷(자연수) 계산', standard: DEC,
        types: [
          calcType('c-each1', '각 자리에서 나누어떨어지는 (소수 한 자리 수)÷(자연수)', '①11 ②12 ③11 심7', 'row', (d) => gen(d, [2, 3, 4], (c) => digitwise(d, c, d.pick([2, 3]), 1))),
          calcType('c-each2', '각 자리에서 나누어떨어지는 (소수 두 자리 수)÷(자연수)', '①11 ②12 ③12 심7', 'col', (d) => gen(d, [2, 3, 4], (c) => digitwise(d, c, 3, 2))),
          calcType('c-down1', '각 자리에서 나누어떨어지지 않는 (소수 한 자리 수)÷(자연수)', '①12 ②13 ③13 심7', 'col', (d) => gen(d, C29, () => qd(d, 12, 199, 1), (v) => v.x.k === 1 && v.x.n < 1000 && plainQ(v.q) && !eachPlace(v.x, v.c))),
          calcType('c-down2', '각 자리에서 나누어떨어지지 않는 (소수 두 자리 수)÷(자연수)', '①12 ②13 ③14 심7', 'col', (d) => gen(d, C29, () => qd(d, 112, 989, 2), (v) => v.x.k === 2 && plainQ(v.q) && !eachPlace(v.x, v.c))),
          calcType('c-wide', '(네 자리 소수 한 자리 수)÷(자연수)', '①11 ③13', 'col', (d) => gen(d, C29, () => qd(d, 112, 989, 1), (v) => v.x.k === 1 && v.x.n >= 1000 && plainQ(v.q))),
          calcType('c-small2', '몫이 1보다 작은 (소수 두 자리 수)÷(자연수)', '①13 ②14 ③15 심8', 'col', (d) => gen(d, C29, () => qd(d, 11, 99, 2), (v) => v.x.k === 2 && plainQ(v.q))),
          calcType('c-small1', '몫이 1보다 작은 (소수 한 자리 수)÷(자연수)', '①13 ②14 ③15', 'row', (d) => gen(d, C29, () => ({ n: d.int(2, 9), k: 1 }), (v) => v.x.k === 1 && v.x.n >= 10)),
          calcType('c-zero-down', '소수점 아래 0을 내려 계산하는 (소수)÷(자연수)', '①14 ②15 ③16 심9', 'col', (d) => gen(d, [2, 4, 5, 6, 8], () => qd(d, 112, 995, 2), (v) => v.x.k === 1 && plainQ(v.q))),
          calcType('c-zero-down-small', '소수점 아래 0을 내려 계산하고 몫이 1보다 작은 (소수)÷(자연수)', '①14 ②15 ③16 심9', 'row', (d) => gen(d, [2, 4, 5, 6, 8], () => qd(d, 12, 98, 2), (v) => v.x.k === 1 && plainQ(v.q))),
          calcType('c-mid-zero', '몫의 소수 첫째 자리에 0이 있는 (소수 두 자리 수)÷(자연수)', '①15 ②17 ③18 심10', 'col', (d) => gen(d, C29, () => ({ n: d.int(1, 12) * 100 + d.int(1, 9), k: 2 }), (v) => v.x.k === 2)),
          calcType('c-mid-zero-down', '0을 내려 계산하고 몫의 소수 첫째 자리에 0이 있는 (소수)÷(자연수)', '①15 ②17 ③19 심10', 'col', (d) => gen(d, [2, 4, 5, 6, 8], () => ({ n: d.int(1, 12) * 100 + d.int(1, 9), k: 2 }), (v) => v.x.k === 1)),
          T('c-hundredth', '몫이 0.0□인 (소수)÷(자연수)', '①16 ②18 ③15 심8', (d, n) => {
            // 첫째 문항은 (소수 두 자리 수)÷(자연수), 둘째 문항은 0을 내려 계산하는 (소수 한 자리 수)÷(자연수).
            const v = gen(d, C29, () => ({ n: d.int(2, 9), k: 2 }), (w) => w.x.k === 2 - n);
            return qAns(CALC, v.x, v.c, { figure: eq(S(v.x), '/', v.c, '=', box()), explain: `${how(v.x, v.c)} 몫의 일의 자리와 소수 첫째 자리에 0을 쓴다.`, facts: { rule: ['hundredthTwo', 'hundredthDown'][n] } });
          }, { count: 2 }),
          calcType('c-two-digit', '(소수)÷(두 자리 자연수)', '①17 ②13·15·17 ③20', 'col', (d) => gen(d, [12, 15, 25], () => (d.bool() ? qd(d, 105, 495, 2) : qd(d, 12, 98, d.pick([1, 2]))), (v) => v.x.k >= 1 && v.x.n < 1000 && v.x.n >= 10)),
          T('c-chain', '이어서 두 번 나누기', '②23 ③22 심16', (d) => {
            const v = d.until(() => { const a = d.int(2, 9), b = d.int(2, 9), r = qd(d, 12, 298, 2); return { a, b, r, m: times(r, b), x: times(times(r, b), a) }; }, (w) => w.a !== w.b && w.m.k >= 1 && w.x.k >= 1 && w.x.n < 1000 && w.x.n >= 100);
            return M('㉠, ㉡에 알맞은 수는?', [inp(LAB[0], v.m), inp(LAB[1], v.r)], {
              figure: chain([S(v.x), `÷ ${v.a}`, box(LAB[0]), `÷ ${v.b}`, box(LAB[1])]),
              explain: `${S(v.x)} ÷ ${v.a} = ${S(v.m)}이고, 이 수를 ${josa(v.b, '으로/로')} 나누면 ${S(v.m)} ÷ ${v.b} = ${S(v.r)}이다.`,
              facts: { calc: [[`${S(v.x)}/${v.a}`, 0], [`${S(v.x)}/${v.a}/${v.b}`, 1]] }
            });
          })
        ]
      },
      {
        id: 'nat', title: '(자연수)÷(자연수)의 몫을 소수로 나타내기', standard: NAT,
        types: [
          T('n-frac', '몫을 분수로 나타낸 뒤 소수로 고치기', '①47 ②27 ③26 심5', (d, n) => {
            if (n === 2) {
              // 약분한 다음 분모를 10으로 고친다: 6 ÷ 15 = 6/15 = 2/5 = 4/10 = 0.4
              const [c, g] = d.pick([[15, 3], [35, 7], [45, 9], [6, 3], [14, 7], [18, 9]]), low = c / g, t = d.until(() => d.int(1, 9), (w) => w % low !== 0), a = g * t, m = 10 / low, r = quo(nat(a), c);
              return M('나눗셈의 몫을 분수로 나타낸 뒤 약분하여 소수로 고치는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [inp(LAB[0], nat(t)), inp(LAB[1], nat(t * m)), inp(LAB[2], r)], {
                figure: lines([eq(a, '/', c, '=', frac(a, c), '=', frac(box(LAB[0]), low)), eq('=', frac(box(LAB[1]), 10), '=', box(LAB[2]))]),
                explain: `${frac(a, c)}의 분자와 분모를 ${josa(g, '으로/로')} 나누면 ${frac(t, low)}이다. 분자와 분모에 ${josa(m, '을/를')} 곱하면 ${frac(t * m, 10)}이고, 소수로 나타내면 ${S(r)}이다.`,
                facts: { calc: [[`${a}*${low}/${c}`, 0], [`${a}*10/${c}`, 1], [`${a}/${c}`, 2]], rule: 'fracReduce' }
              });
            }
            // 첫째 문항은 분모를 10으로(2, 5로 나누기), 둘째 문항은 분모를 100으로(4, 20, 25, 50으로 나누기).
            const den = n === 0 ? 10 : 100, v = natPair(d, n === 0 ? [2, 5] : [4, 20, 25, 50], n + 1, (w) => w.x.n < w.c * 4), a = v.x.n, m = den / v.c;
            return M('나눗셈의 몫을 분수로 나타낸 뒤 소수로 고치는 과정이다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], nat(a * m)), inp(LAB[1], v.q)], {
              figure: lines([eq(a, '/', v.c, '=', frac(a, v.c), '=', frac(box(LAB[0]), den), '=', box(LAB[1]))]),
              explain: `${a} ÷ ${v.c} = ${frac(a, v.c)}이다. 분자와 분모에 ${josa(m, '을/를')} 곱하면 ${frac(a * m, den)}이고, 소수로 나타내면 ${S(v.q)}이다.`,
              facts: { calc: [[`${a}*${den}/${v.c}`, 0], [`${a}/${v.c}`, 1]], rule: ['fracTen', 'fracHundred'][n] }
            });
          }, { count: 3 }),
          T('n-frac-nat', '자연수를 분모가 100인 분수로 고쳐 나누기', '③27 ①47', (d) => {
            // 7 ÷ 4 = 700/100 ÷ 4 = 175/100 = 1.75
            const v = natPair(d, [4, 8, 25], 2, (w) => w.x.n < 40), a = v.x.n;
            return M('자연수를 분모가 100인 분수로 고쳐 계산하는 과정이다. ㉠, ㉡에 알맞은 수는?', [inp(LAB[0], nat(v.q.n)), inp(LAB[1], v.q)], {
              figure: lines([eq(a, '/', v.c, '=', frac(a * 100, 100), '/', v.c), eq('=', frac(box(LAB[0]), 100), '=', box(LAB[1]))]),
              explain: `${a} = ${frac(a * 100, 100)}이다. ${a * 100} ÷ ${v.c} = ${v.q.n}이므로 ${frac(v.q.n, 100)} = ${S(v.q)}이다.`,
              facts: { calc: [[`${a * 100}/${v.c}`, 0], [`${a}/${v.c}`, 1]] }
            });
          }),
          T('n-nat', '10배·100배 한 자연수의 나눗셈을 이용하여 몫을 소수로 나타내기', '①48 ③28', (d) => {
            // 300 ÷ 12 = 25 → 30 ÷ 12 = 2.5, 3 ÷ 12 = 0.25
            const v = d.until(() => { const c = d.pick([4, 8, 12, 25]), a = d.int(1, 9); return { c, a, q: quo(nat(a), c) }; }, (w) => w.q && w.q.k === 2 && w.q.n % 10 !== 0 && w.a < w.c), rs = [dec(v.q.n, 1), v.q];
            return M(`${v.a * 100} ÷ ${v.c} = ${v.q.n}이다. ㉠, ㉡에 알맞은 수는?`, rs.map((r, j) => inp(LAB[j], r)), {
              figure: lines([eq(v.a * 10, '/', v.c, '=', box(LAB[0])), eq(v.a, '/', v.c, '=', box(LAB[1]))]),
              explain: `나누어지는 수가 ${part(1)}배, ${part(2)}배가 되면 몫도 ${part(1)}배, ${part(2)}배가 된다. ${v.q.n}의 ${part(1)}배는 ${S(rs[0])}, ${part(2)}배는 ${S(rs[1])}이다.`,
              facts: { calc: [[`${v.a * 10}/${v.c}`, 0], [`${v.a}/${v.c}`, 1]] }
            });
          }),
          T('n-big', '몫이 1보다 큰 (자연수)÷(자연수)', '①49 ②28 ③23 심11', (d, n) => {
            // 첫째 문항은 0을 한 번 내린다(몫이 소수 한 자리 수), 둘째 문항은 0을 두 번 내린다(몫이 소수 두 자리 수).
            const v = natPair(d, n === 0 ? [2, 4, 5, 6, 8] : [4, 8], n + 1, (w) => w.x.n > w.c);
            return qAns(CALC, v.x, v.c, { figure: ddiv(v.c, v.x), explain: `나누어지는 수의 오른쪽 끝자리에 0이 계속 있는 것으로 생각하여 0을 내려 계산한다. ${how(v.x, v.c)}`, facts: { rule: ['natBigOne', 'natBigTwo'][n] } });
          }, { count: 2 }),
          T('n-small', '나누는 수가 더 큰 (자연수)÷(자연수)', '①50 ②29 ③24 심11', (d, n) => {
            const v = natPair(d, n === 0 ? [2, 4, 5, 6, 8] : [4, 8], n + 1, (w) => w.x.n < w.c);
            return qAns(CALC, v.x, v.c, { figure: n === 0 ? eq(v.x.n, '/', v.c, '=', box()) : ddiv(v.c, v.x), explain: `나누어지는 수가 나누는 수보다 작으므로 몫의 일의 자리에 0을 쓰고 0을 내려 계산한다. ${how(v.x, v.c)}`, facts: { rule: ['natSmallOne', 'natSmallTwo'][n] } });
          }, { count: 2 }),
          T('n-two-digit', '(자연수)÷(두 자리 자연수)', '①49·50 ②28·29 ③23·24 심11', (d) => {
            const v = natPair(d, [12, 15, 20, 25, 50], d.pick([1, 2]), (w) => w.x.n % w.c !== 0 && w.x.n % 10 !== 0);
            return qAns(CALC, v.x, v.c, { figure: ddiv(v.c, v.x), explain: how(v.x, v.c), facts: { rule: 'natTwoDigit' } });
          }),
          T('n-three-digit', '(세 자리 자연수)÷(자연수)', '①49 ③23 심11', (d) => {
            const v = d.until(() => { const c = d.pick([4, 5, 6, 8]), a = d.int(101, 399); return { c, x: nat(a), q: quo(nat(a), c) }; }, (w) => w.q && w.q.k >= 1 && w.q.k <= 2 && w.x.n % 10 !== 0);
            return qAns(CALC, v.x, v.c, { figure: ddiv(v.c, v.x), explain: how(v.x, v.c), facts: { rule: 'natThreeDigit' } });
          }),
          T('n-thousandth', '몫이 소수 세 자리 수인 (자연수)÷(자연수)', '①50 ②29 ③25', (d) => {
            const a = d.pick([1, 3, 5, 7]), x = nat(a);
            return qAns(CALC, x, 8, { figure: ddiv(8, x), explain: `0을 세 번 내려 계산한다. ${how(x, 8)}`, facts: { rule: 'natThousandth' } });
          }),
          T('n-places', '몫이 소수 몇 자리 수인지 가리기', '②30 ①26', (d) => {
            // 0을 한 번 내리면 나누어떨어지는 식(몫이 소수 한 자리 수)과 두 번 내려야 하는 식(몫이 소수 두 자리 수)
            const one = d.bool(), mk = (places) => natPair(d, places === 1 ? [2, 4, 5, 6, 8, 15, 25] : [4, 8, 20, 25], places, (w) => w.x.n > 2 && w.x.n < 90 && w.x.n % 10 !== 0);
            const rows = d.until(() => d.shuffle([mk(one ? 1 : 2), mk(one ? 2 : 1), mk(one ? 2 : 1), mk(one ? 2 : 1)]), (list) => new Set(list.map((v) => `${v.x.n}÷${v.c}`)).size === 4), hit = rows.findIndex((v) => v.q.k === (one ? 1 : 2));
            return C(`몫을 소수로 나타낼 때, 몫이 소수 ${one ? '한' : '두'} 자리 수인 것은?`, rows.map((v) => eq(v.x.n, '/', v.c)), hit, {
              explain: `몫은 차례로 ${rows.map((v) => S(v.q)).join(', ')}이다. 0을 한 번 내려 나누어떨어지면 몫이 소수 한 자리 수이고, 두 번 내려야 나누어떨어지면 소수 두 자리 수이다.`,
              facts: { claimed: rows.map((v) => [`${v.x.n}*10%${v.c}`, 0]), claimedWant: one }
            });
          })
        ]
      },
      {
        id: 'col', title: '세로셈의 계산 과정과 잘못된 계산', standard: DEC,
        types: [
          T('col-point', '계산해 둔 세로셈의 몫에 소수점 찍기', '①8 ②20 ③31', (d, n) => {
            // 첫째 문항은 (소수 두 자리 수)÷(자연수), 둘째 문항은 (자연수)÷(자연수).
            const v = n === 0 ? gen(d, C29, () => (d.bool() ? qd(d, 112, 989, 2) : { n: d.int(1, 9) * 100 + d.int(1, 9), k: 2 }), (w) => w.x.k === 2 && w.x.n >= 1000) : natPair(d, [4, 8, 20, 25], 2, (w) => w.x.n % 10 !== 0);
            return qAns('나눗셈을 세로로 계산하고 몫에 소수점을 찍지 않았다. 소수점을 찍어 몫을 바르게 나타내면?', v.x, v.c, {
              figure: ddiv(v.c, v.x, { steps: true, nodot: true }),
              explain: `몫의 소수점은 나누어지는 수의 소수점 자리에 맞추어 찍는다. ${n === 0 ? '' : `자연수 ${v.x.n}의 소수점은 일의 자리 숫자 바로 뒤에 있다. `}몫은 ${S(v.q)}이다.`,
              facts: { rule: ['pointDec', 'pointNat'][n] }
            });
          }, { count: 2 }),
          T('col-steps', '세로셈의 계산 과정', '①18 ②19 ③30 심13', (d, n) => {
            // 문항마다 계산 구조가 다르다: 내림이 있는 것, 몫이 1보다 작은 것, 0을 내려 계산하는 것, 몫의 소수 첫째 자리가 0인 것, (자연수)÷(자연수).
            const pickers = [
              () => gen(d, C29, () => qd(d, 112, 298, 2), (w) => w.x.k === 2 && plainQ(w.q) && w.x.n < 1000 && !eachPlace(w.x, w.c) && digs(w.x.n)[0] >= w.c),
              () => gen(d, C29, () => qd(d, 12, 98, 2), (w) => w.x.k === 2 && plainQ(w.q) && w.x.n >= 100),
              () => gen(d, [2, 4, 5, 6, 8], () => qd(d, 112, 298, 2), (w) => w.x.k === 1 && plainQ(w.q) && w.x.n >= 10 && w.x.n < 100 && digs(w.x.n)[0] >= w.c),
              () => gen(d, C29, () => ({ n: d.int(1, 4) * 100 + d.int(1, 9), k: 2 }), (w) => w.x.k === 2 && w.x.n < 1000 && (w.q.n % 10) * w.c >= 10),
              () => natPair(d, [4, 5, 8], d.pick([1, 2]), (w) => w.x.n > w.c)
            ];
            // 빈칸에 들어갈 수가 서로 같으면 다시 뽑는다.
            const made = d.until(() => { const w = pickers[n](), zeros = w.q.k - w.x.k, steps = ldiv(w.c, S(w.x).replace('.', '') + '0'.repeat(zeros)); return { w, zeros, steps, asks: [[1, 4], [0, 1], [1, 3], [1], [1]][n].filter((k) => k < steps.rows.length - 1) }; }, (m) => new Set(m.asks.map((k) => m.steps.rows[k].value)).size === m.asks.length);
            const v = made.w, pad = made.zeros, work = made.steps, asks = made.asks, rx = rowExprs(v.c, v.x, pad), hidden = {};
            asks.forEach((k, j) => { hidden[k] = LAB[j + 1]; });
            return M(`나눗셈을 세로로 계산한 것이다. ${LAB.slice(0, asks.length + 1).join(', ')}에 알맞은 수는?`, [inp(LAB[0], v.q)].concat(asks.map((k, j) => inp(LAB[j + 1], nat(work.rows[k].value)))), {
              figure: ddiv(v.c, v.x, { steps: true, quot: LAB[0], rows: hidden }),
              explain: `${how(v.x, v.c)} 계산 과정에 적히는 수는 차례로 ${work.rows.map((row) => row.value).join(', ')}이다.`,
              facts: { calc: [[`${S(v.x)}/${v.c}`, 0]].concat(asks.map((k, j) => [rx.of(work.rows[k]), j + 1])), unseen: rx.un, rule: ['stepsDown', 'stepsSmall', 'stepsZeroDown', 'stepsMidZero', 'stepsNat'][n] }
            });
          }, { count: 5 }),
          T('col-zero-which', '소수점 아래 0을 내려 계산해야 하는 식 가리기', '①26 ②22 심12', (d) => {
            // 나누어지는 수는 같고 나누는 수만 다르다. 0을 내려야 하는 식은 하나뿐이다.
            const m = d.until(() => { const a = nz(d, 12, 96), cs = d.shuffle(C29).slice(0, 4); return { a, cs }; }, (w) => w.cs.filter((c) => w.a % c !== 0).length === 1 && w.cs.every((c) => quo(dec(w.a, 1), c))), x = dec(m.a, 1), hit = m.cs.findIndex((c) => m.a % c !== 0);
            return C('나누어떨어질 때까지 계산할 때, 소수점 아래 0을 내려 계산해야 하는 것은?', m.cs.map((c) => eq(S(x), '/', c)), hit, {
              explain: `${m.a} ÷ ${josa(m.cs[hit], '은/는')} 나누어떨어지지 않으므로 ${S(x)} ÷ ${josa(m.cs[hit], '은/는')} 소수 첫째 자리에서 수가 남는다. 0을 내려 계산하면 ${told(x, m.cs[hit])}이다.`,
              facts: { claimed: m.cs.map((c) => [`${m.a}%${c}`, 0]), claimedWant: false }
            });
          }),
          T('col-continue', '남은 수가 있는 계산을 이어서 하기', '②21', (d) => {
            const v = gen(d, [2, 4, 5, 6, 8], () => qd(d, 112, 995, 2), (w) => w.x.k === 1 && plainQ(w.q) && w.x.n >= 10 && w.x.n < 1000), rest = ldiv(v.c, String(v.x.n)).rest;
            return qAns(`${S(v.x)} ÷ ${josa(v.c, '을/를')} 다음과 같이 계산하였더니 ${josa(rest, '이/가')} 남았다. 소수점 아래 0을 내려 나누어떨어질 때까지 계산한 몫은?`, v.x, v.c, {
              figure: ddiv(v.c, v.x, { steps: true, pad: 0 }),
              explain: `남은 ${rest} 옆에 0을 내려 쓰면 ${rest * 10}이고 ${rest * 10} ÷ ${v.c} = ${rest * 10 / v.c}이다. 몫의 소수 둘째 자리에 ${josa(rest * 10 / v.c, '을/를')} 쓰면 ${S(v.q)}이다.`
            });
          }),
          T('col-wrong-why', '세로셈을 잘못 계산한 까닭 알기', '①30 ②45 ③33·34 심21·22', (d) => {
            const kind = d.int(0, 2), w = wrongDiv(d, kind);
            const rows = d.shuffle([['수를 하나 내려도 나눌 수 없는데 몫의 그 자리에 0을 쓰지 않았다.', 0], ['몫의 소수점을 나누어지는 수의 소수점 자리에 맞추어 찍지 않았다.', 1], ['남은 수가 있는데 소수점 아래 0을 내려 계산하지 않았다.', 2], ['나누는 수와 몫의 곱을 나누어지는 수보다 크게 썼다.', 3]]);
            return C(`${S(w.x)} ÷ ${josa(w.c, '을/를')} 잘못 계산한 것이다. 잘못 계산한 까닭으로 알맞은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === kind), {
              figure: w.figure, explain: `${w.why} 바르게 계산하면 ${told(w.x, w.c)}이다.`,
              facts: { truth: rows.map((row) => row[1] === kind), want: true }
            });
          }),
          T('col-wrong-fix', '잘못 계산한 세로셈 바로잡기', '①30 ②45 ③33·34 심21·22', (d, n) => {
            // 첫째 문항은 몫의 0을 빠뜨린 것, 둘째 문항은 몫의 소수점을 잘못 찍은 것, 셋째 문항은 0을 내리지 않고 멈춘 것.
            const w = wrongDiv(d, n);
            return qAns('나눗셈을 잘못 계산한 것이다. 바르게 계산한 몫은?', w.x, w.c, { figure: w.figure, explain: `${w.why} 바르게 계산하면 ${told(w.x, w.c)}이다.`, facts: { rule: ['fixZero', 'fixPoint', 'fixDown'][n] } });
          }, { count: 3 }),
          T('check-person', '잘못 계산한 사람 찾기', '①31 ②34·44 ③29 심19', (d) => {
            // 세 사람 가운데 한 사람만 틀렸다. 틀린 꼴: 몫의 0을 빠뜨림(7.42 ÷ 7 = 1.6), 소수점을 잘못 찍음(6.8 ÷ 8 = 8.5), (자연수)÷(자연수)의 소수점(25 ÷ 4 = 62.5).
            const who = d.shuffle(NAMES).slice(0, 3), bad = d.int(0, 2);
            const makers = [
              () => { const v = gen(d, C29, () => ({ n: d.int(1, 9) * 100 + d.int(1, 9), k: 2 }), (w) => w.x.k === 2); return Object.assign(v, { wrong: dec(Math.floor(v.q.n / 100) * 10 + v.q.n % 10, 1) }); },
              () => { const v = gen(d, C29, () => qd(d, 12, 98, 2), (w) => w.x.k >= 1 && plainQ(w.q)); return Object.assign(v, { wrong: dec(v.q.n, 1) }); },
              () => { const v = natPair(d, [4, 8], 2, (w) => w.x.n > w.c); return Object.assign(v, { wrong: dec(v.q.n, 1) }); }
            ];
            const rows = d.shuffle(makers.map((make) => make())), shown = rows.map((v, i) => (i === bad ? v.wrong : v.q));
            return C('나눗셈을 계산하였다. 잘못 계산한 사람은?', who, bad, {
              figure: lines(rows.map((v, i) => `${who[i]}: ${eq(S(v.x), '/', v.c, '=', S(shown[i]))}`)),
              explain: `${name(who[bad], '이/가')} 잘못 계산하였다. 바르게 계산하면 ${told(rows[bad].x, rows[bad].c)}이다.`,
              facts: { claimed: rows.map((v, i) => [mil(v.x, v.c).s, shown[i].n * P10[3 - shown[i].k]]), claimedWant: false }
            });
          }),
          T('check-frac-where', '분수로 고쳐 계산한 과정에서 처음 잘못된 곳 찾기', '②9 심23', (d) => {
            const w = wrongFrac(d, d.int(0, 2));
            return C('소수를 분수로 고쳐 계산한 과정에서 처음으로 잘못된 곳은?', THREE, w.first, {
              figure: lines([eq(S(w.x), '/', w.c)].concat(w.steps.map((step, i) => tag(LAB[i]) + eq('=') + ' ' + step))),
              explain: `${w.why} 바르게 계산하면 ${told(w.x, w.c)}이다.`,
              facts: { claimed: [0, 1, 2].map((i) => [String(w.values[i]), w.values[i + 1]]), claimedWant: false }
            });
          }),
          T('check-frac-value', '분수로 고쳐 잘못 계산한 것을 바르게 계산하기', '②9 심23', (d) => {
            const w = wrongFrac(d, d.int(0, 2));
            return qAns('다음은 잘못 계산한 것이다. 바르게 계산한 몫은?', w.x, w.c, {
              figure: lines([eq(S(w.x), '/', w.c, '=') + ' ' + w.steps[0], eq('=') + ' ' + w.steps[1] + ' ' + eq('=') + ' ' + w.steps[2]]),
              explain: `${w.why} 바르게 계산하면 ${told(w.x, w.c)}이다.`
            });
          })
        ]
      },
      { id: 'est', title: '어림하여 몫의 소수점 자리 찾기', standard: DEC, types: [] },
      { id: 'comp', title: '몫의 크기 비교와 조건에 맞는 수', standard: DEC, types: [] },
      { id: 'word', title: '소수의 나눗셈의 활용', standard: DEC, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
