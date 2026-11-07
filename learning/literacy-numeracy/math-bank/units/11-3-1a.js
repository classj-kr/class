// 고등학교 확률과 통계 1단원 「여러 가지 순열과 중복조합」(11-3-1) — 단원 틀·단원 안의 도구와 앞쪽 묶음(중복순열, 중복순열 — 함수·집합, 같은 것이 있는 순열, 최단 거리로 가는 길).
// 수집해 둔 천재 T셀파 확률과 통계(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 38꼴, 기본꼴 2: 28꼴, 심화꼴: 9꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-3-1/싣기_대조표.md 에 있다.
// (중복조합의 묶음은 11-3-1b.js 에, 실력 문항은 11-3-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: 12확통01-01(중복순열, 같은 것이 있는 순열), 12확통01-02(중복조합). 묶음 차례는 교과서의 소단원 차례(여러 가지 순열 → 중복조합)를 따른다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(글·조건 목록·도로망 그림·입체 그림), 묻는 것(경우의 수·개수·n·r·기호 고르기), 세는 법(그대로 세기·끝자리로 나누기·
//    같은 것으로 보기·묶기·사이에 끼우기·전체에서 빼기·겹친 것 더하기·먼저 나누어 주기·바꾸어 놓기)이 다를 때만 따로 싣는다. 소재와 수만 다른 것은 한 번만 싣는다.
//  - 사용자가 정한 것: 수학 실력에 필요해 보이는 꼴은 「간단히 다룬다」 따위를 까닭으로 빼지 않고, 어려운 것은 실력에 싣는다.
//    고1 「경우의 수」(10-1-7)·「함수」(10-2-6)와 하는 일이 같은 꼴도 학년이 달라 싣는다(코디네이터 결정). 같은 과목의 다른 단원(이항정리 11-3-2)과 같은 일만 그쪽에 둔다.
//  - 교육과정의 금은 「항이 세 개 이상인 다항정리에 관한 문제」뿐이다. (a + b + c)ⁿ의 서로 다른 항의 개수는 계수를 셈하는 일이 아니라 중복조합으로 세는 일이라 싣는다.
//  - 답: 경우의 수·개수·n·r 은 모두 수 칸(N, M)으로 받는다. 음수가 되는 답이 없으므로 부호 단추는 달지 않는다. 답은 9999 이하가 되게 수를 고른다
//    (원문의 10584 같은 다섯 자리 답은 사람 수를 줄여 네 자리 안으로 맞추었다). 기호는 공용 도구 nPi·nH·nP·nC(₃Π₄, ₃H₄, ₅P₂, ₅C₂).
//    상황에 맞는 기호를 고르는 꼴만 고르기로 낸다. 원문의 오지선다도 답이 수 하나이면 수 칸으로 받는다.
//  - 답은 모두 코드가 셈한다. 검사 근거는 공식을 수로 적은 식(facts.calc), 후보를 모두 늘어놓아 조건에 맞는 것을 센 목록(facts.count),
//    n·r 을 거꾸로 구하는 문항은 □ 에 수를 넣어 등식이 맞는 것이 하나뿐인지 보는 식(facts.digit)이다. 만들 때 seal 이 같은 검사를 먼저 돌린다.
//    원문 답지의 잘못(대단원 평가 05의 지수 12 — 풀이는 13, 최소성취 08 풀이의 5!/3! = 60)은 따르지 않는다.
//  - 원문 그림을 알 수 없어 풀이의 수에 맞게 새로 그린 도로망: ①34 #2(없는 길), ①35 #2(가운데가 빈 도로망), 실력의 ①38(움직이는 점). 대조표에 「그림 새로 지음」으로 적었다.
//
// 뺀 것과 까닭(11-3-1b.js, 11-3-1c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목 다른 단원: ②18의 변형 (a + b)ⁿ의 항의 개수(11-3-2 이항정리의 몫).
//  - 서술형·활동: ②28(까닭 설명, 문제 만들기, 모둠 문항지).
//  - 그림을 알 수 없음: 심4(한 번 지난 도로를 다시 지나지 않고 P를 들르는 최단 경로 — 풀이에 갈래의 수만 남아 도로망을 되살릴 수 없다).
//  - 겹침(같은 일을 하는 기본 유형에 합쳤다): 심1(①6 rep-num-nozero), 심3(①33 road-via), 심5(②12 heq-lower #2), 심7(②25 hfun-partial), 심8(②9 h-kinds #2).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, lines, N, M, C } = B.kit;
  const { range, V, nb, tail } = B.kit.mid;
  const { Board } = B.kit.mgeo;
  const { nP, nC, nPi, nH, jh, pw, space } = B.kit.hs;
  const UNIT = '11-3-1', S1 = '12확통01-01', S2 = '12확통01-02';

  // ── 세는 도구 ──
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const hits = (flags) => flags.filter(Boolean).length;
  const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
  const nPr = (n, r) => (r < 0 || r > n ? 0 : fact(n) / fact(n - r));
  const nCr = (n, r) => (r < 0 || r > n ? 0 : Math.round(nPr(n, r) / fact(r)));
  const nHr = (n, r) => (r < 0 ? 0 : nCr(n + r - 1, r));
  // 같은 것이 각각 c₁, c₂, … 개씩 있는 것을 모두 일렬로 나열하는 순열의 수
  const same = (counts) => Math.round(fact(sum(counts)) / counts.reduce((p, c) => p * fact(c), 1));
  // 여러 목록에서 하나씩 고른 것 전부 / list 에서 중복을 허용하여 k 개를 늘어놓은 것 전부 / 차례 없이 k 개를 고른 것 전부 / 중복을 허용하여 k 개를 고른 것 전부(작은 것부터)
  const cart = (lists) => lists.reduce((acc, l) => acc.reduce((all, row) => all.concat(l.map((x) => row.concat([x]))), []), [[]]);
  const seqs = (list, k) => cart(range(1, k).map(() => list));
  const combos = (list, k) => (k === 0 ? [[]] : list.length < k ? [] : combos(list.slice(1), k - 1).map((rest) => [list[0]].concat(rest)).concat(combos(list.slice(1), k)));
  const multis = (list, k) => (k === 0 ? [[]] : !list.length ? [] : multis(list, k - 1).map((rest) => [list[0]].concat(rest)).concat(multis(list.slice(1), k)));
  // 같은 것이 섞인 목록을 모두 일렬로 나열한 것 전부(서로 다른 것만)
  function arrange(list) {
    const out = [], walk = (left, made) => { if (!left.length) { out.push(made); return; } const tried = new Set(); left.forEach((x, i) => { if (tried.has(x)) return; tried.add(x); walk(left.slice(0, i).concat(left.slice(i + 1)), made.concat([x])); }); };
    walk(list.slice().sort(), []);
    return out;
  }
  const tally = (list) => { const m = new Map(); for (const x of list) m.set(x, (m.get(x) || 0) + 1); return m; };
  const told = (list) => list.join(', ');
  // 수를 늘어놓고 끝 수에 토씨: listJ([1, 1, 2], '을/를') → '1, 1, 2를'
  const listJ = (list, pair) => told(list.slice(0, -1).concat([josa(list[list.length - 1], pair)]));
  const KN ={ 2: '두', 3: '세', 4: '네', 5: '다섯', 6: '여섯', 7: '일곱', 8: '여덟', 9: '아홉', 10: '열' };

  // ── 검사 식 글 ──
  // n(n−1)…(n−r+1) → "7*6*5", n! → "5*4*3*2", ₙCᵣ → "(7*6*5)/(3*2)", ₙHᵣ = ₙ₊ᵣ₋₁Cᵣ, nʳ → "3**4", 같은 것이 있는 순열 → "(5*4*3*2)/(2*3*2)"
  const prodS = (n, r) => (r <= 0 ? '1' : range(0, r - 1).map((i) => n - i).join('*'));
  const factS = (n) => (n <= 1 ? '1' : prodS(n, n - 1));
  const combS = (n, r) => { const k = Math.min(r, n - r); return k <= 0 ? '1' : `(${prodS(n, k)})/(${factS(k)})`; };
  const hS = (n, r) => combS(n + r - 1, r);
  const powS = (n, r) => `${n}**${r}`;
  const sameS = (counts) => { const den = counts.filter((c) => c > 1).map(factS); return `(${factS(sum(counts))})/(${den.length ? den.join('*') : '1'})`; };
  // □(자연수)를 넣는 식이 v 가 되는 것은 답 하나뿐이다.
  const eqDigit = (expr, v, lo, hi) => ({ digit: { template: `${v - 1}<${expr}<${v + 1}`, lo, hi, ask: 'min' } });

  // ── 검사 근거 마무리(seal) ──
  // 검사가 하는 것을 만들 때 먼저 해 본다: 식의 값과 답, 센 목록과 답, □ 식의 해, 고르기의 근거. 식의 수 가운데 글·그림 설명·보기에 보이지 않는 수는 facts.unseen 에 밝힌다.
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function shownNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  const evalS = (s) => { if (!/^[\d+\-*\/%(). ]+$/.test(s)) throw new Error('검사 식이 아니다: ' + s); return Function('"use strict"; return (' + s + ');')(); };
  function seal(item) {
    const f = item.facts || {}, ans = (i) => item.inputs[i].answer;
    if (!item.choice) for (const input of item.inputs) if (!Number.isInteger(input.answer) || input.answer < 1 || input.answer > 9999) throw new Error('답이 1~9999 의 정수가 아니다: ' + input.answer);
    for (const [s, i] of f.calc || []) { const v = evalS(s); if (v !== ans(i) || !(v > 0)) throw new Error(`검사 식 ${s.slice(0, 80)} = ${v} 인데 답은 ${ans(i)}`); }
    if (f.count && (hits(f.count) !== ans(0) || f.count.every(Boolean) || !f.count.some(Boolean))) throw new Error(`센 목록 ${hits(f.count)} 와 답 ${ans(0)}`);
    if (f.digit) {
      const { template, lo, hi } = f.digit, ok = [];
      for (let x = lo; x <= hi; x += 1) {
        const parts = template.replace(/□/g, String(x)).split(/([<>])/); let good = true;
        for (let i = 1; i < parts.length; i += 2) { const l = evalS(parts[i - 1]), r = evalS(parts[i + 1]); if (!(parts[i] === '<' ? l < r : l > r)) good = false; }
        if (good) ok.push(x);
      }
      if (ok.length !== 1 || ok[0] !== ans(0)) throw new Error('□ 식을 만족하는 수: ' + ok.join(',') + ' / 답 ' + ans(0));
    }
    if (f.choose) {
      const values = f.choose.exprs.map(evalS);
      if (!values.every((v) => v > 0) || values.filter((v) => v === f.choose.target).length !== 1 || values.indexOf(f.choose.target) !== item.choice.answer) throw new Error('choose 근거가 답과 다르다: ' + values.join(','));
    }
    if (f.truth && (f.truth.filter((t) => t === f.want).length !== 1 || f.truth[item.choice.answer] !== f.want)) throw new Error('참·거짓 근거가 답과 다르다');
    if (item.choice && new Set(item.choice.options.map(stripH)).size !== item.choice.options.length) throw new Error('보기가 겹친다');
    const shown = shownNumbers(item), hidden = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([s]) => s).concat(f.choose ? f.choose.exprs : []);
    for (const s of exprs) for (const n of s.match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) hidden.add(Number(n));
    if (hidden.size) f.unseen = [...hidden]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  const sourceOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make: (d, n) => seal(make(d, n)) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: (d, n) => seal(make(d, n)) }, more || {});

  // ── 글 ──
  // 영문자 뒤 토씨: L(엘)·M(엠)·N(엔)·R(알)은 받침이 있다.
  const lj = (ch, pair) => { const [withB, without] = pair.split('/'); return ch + ('LMNR'.includes(ch.slice(-1)) ? (pair === '으로/로' ? (/[LR]$/.test(ch) ? '로' : '으로') : withB) : without); };
  const vk = V('k'), vn = V('n'), vr = V('r'), vf = V('f');
  const fx = (a) => nb(`${vf}(${a})`);
  const setOf = (list) => nb('{' + list.join(', ') + '}');
  const upto = (n) => (n <= 4 ? setOf(range(1, n)) : nb(`{1, 2, …, ${n}}`));
  // 같은 것이 있는 순열의 식 글: 7!/(3! × 2!)
  const sameT = (counts) => { const den = counts.filter((c) => c > 1).map((c) => c + '!'); return den.length ? `${sum(counts)}!/(${den.join(' × ')})` : `${sum(counts)}!`; };

  // ── 도로망 ──
  // 오른쪽·위쪽 한 칸 길의 모음 g = { w, h, E }. A = 왼쪽 아래 (0, 0), B = 오른쪽 위 (w, h). keep(x1, y1, x2, y2)가 거짓인 길은 없다.
  const key = (x1, y1, x2, y2) => x1 + ',' + y1 + '>' + x2 + ',' + y2;
  function net(w, h, keep) {
    const E = new Set();
    for (let x = 0; x <= w; x += 1) for (let y = 0; y <= h; y += 1) {
      if (x < w && (!keep || keep(x, y, x + 1, y))) E.add(key(x, y, x + 1, y));
      if (y < h && (!keep || keep(x, y, x, y + 1))) E.add(key(x, y, x, y + 1));
    }
    return { w, h, E };
  }
  const road = (g, x1, y1, x2, y2) => g.E.has(key(x1, y1, x2, y2));
  // from 에서 to 까지 오른쪽·위쪽으로만 가는 길의 수
  function ways(g, from, to) {
    const [fx0, fy0] = from, [tx, ty] = to;
    if (tx < fx0 || ty < fy0) return 0;
    const f = {};
    for (let x = fx0; x <= tx; x += 1) for (let y = fy0; y <= ty; y += 1) {
      if (x === fx0 && y === fy0) { f[x + ',' + y] = 1; continue; }
      let v = 0;
      if (x > fx0 && road(g, x - 1, y, x, y)) v += f[(x - 1) + ',' + y];
      if (y > fy0 && road(g, x, y - 1, x, y)) v += f[x + ',' + (y - 1)];
      f[x + ',' + y] = v;
    }
    return f[tx + ',' + ty];
  }
  // 가로 w칸·세로 h칸에서 오른쪽·위쪽으로만 가는 걸음 전부(길이 있는지는 보지 않는다): 지나는 점의 목록
  function routes(w, h) {
    return combos(range(0, w + h - 1), w).map((rights) => { const pts = [[0, 0]]; let x = 0, y = 0; for (let i = 0; i < w + h; i += 1) { if (rights.includes(i)) x += 1; else y += 1; pts.push([x, y]); } return pts; });
  }
  const walks = (g, rt) => rt.every((p, i) => i === 0 || road(g, rt[i - 1][0], rt[i - 1][1], p[0], p[1]));
  const passes = (rt, p) => rt.some((q) => q[0] === p[0] && q[1] === p[1]);
  const spot = (p) => `A에서 오른쪽으로 ${p[0]}칸, 위쪽으로 ${p[1]}칸 간 점`;
  // 도로망 그림. o: { pts: [{ p, t, a }] 이름 붙은 점, lake 지날 수 없는 점(호수), hole [x1, y1, x2, y2] 길이 없는 구역(칠함), say 그림 설명 }
  function netFig(g, o) {
    const opt = o || {}, s = Math.min(30, Math.floor(252 / g.w), Math.floor(190 / g.h)), b = Board(), P = ([x, y]) => [x * s, -y * s];
    if (opt.hole) { const [x1, y1, x2, y2] = opt.hole; b.poly([P([x1, y1]), P([x2, y1]), P([x2, y2]), P([x1, y2])], 'fill:#dbe4ee;stroke:none'); }
    if (opt.lake) b.disk(P(opt.lake), s * 0.46, 'fill:#bfdbfe;stroke:#60a5fa;stroke-width:1');
    for (const e of g.E) { const [p, q] = e.split('>').map((t) => t.split(',').map(Number)); b.seg(P(p), P(q)); }
    b.dot(P([0, 0])).dot(P([g.w, g.h])).name(P([0, 0]), 'A', 225).name(P([g.w, g.h]), 'B', 45);
    for (const q of opt.pts || []) { b.dot(P(q.p)); b.name(P(q.p), q.t, q.a == null ? 135 : q.a, q.g); }
    return b.svg(opt.say);
  }
  const gridSay = (w, h) => `도로망 그림: 가로 ${w}칸, 세로 ${h}칸인 바둑판 모양으로 길이 연결되어 있다. 왼쪽 아래 끝이 A, 오른쪽 위 끝이 B이다.`;

  // ════════════════ 중복순열 ════════════════
  const repTypes = [
    T('rep-value', 'ₙΠᵣ의 값', '①1', (d) => {
      const [a, b] = d.pick([[2, 8], [2, 9], [3, 5], [3, 6], [2, 7], [4, 5], [3, 7], [4, 6]]);
      return M(`${jh(nPi(a, b), '과/와')} ${nPi(b, a)}의 값을 차례로 구하시오.`, [{ label: nPi(a, b) + ' =', answer: a ** b }, { label: nPi(b, a) + ' =', answer: b ** a }], {
        explain: `서로 다른 ${vn}개에서 ${vr}개를 택하는 중복순열의 수는 ${nPi(vn, vr)} = ${pw(vn, vr)}이다. ${nPi(a, b)} = ${pw(a, b)} = ${a ** b}, ${nPi(b, a)} = ${pw(b, a)} = ${b ** a}이다. 중복을 허용하므로 ${jh(vr, '이/가')} ${vn}보다 커도 된다.`,
        facts: { calc: [[powS(a, b), 0], [powS(b, a), 1]] }
      });
    }),
    T('rep-inverse', 'ₙΠᵣ = k에서 n이나 r 구하기', '①2', (d, n) => {
      if (n === 0) {
        const [k, r] = d.pick([[2, 5], [2, 6], [3, 4], [3, 5], [4, 3], [5, 3], [6, 3], [7, 3], [4, 4], [5, 4], [2, 7]]), v = k ** r;
        return N(`${nPi(vk, r)} = ${v}일 때, 자연수 ${vk}의 값은?`, k, {
          explain: `${nPi(vk, r)} = ${pw(vk, r)}이고 ${v} = ${pw(k, r)}이므로 ${vk} = ${k}이다.`,
          facts: eqDigit(`□**${r}`, v, 1, 9)
        });
      }
      const [b, k] = d.pick([[2, 5], [2, 7], [2, 9], [3, 4], [3, 6], [3, 7], [4, 4], [4, 5], [5, 4], [6, 4], [7, 4]]), v = b ** k;
      return N(`${nPi(b, vk)} = ${v}일 때, 자연수 ${vk}의 값은?`, k, {
        explain: `${nPi(b, vk)} = ${pw(b, vk)}이고 ${v} = ${pw(b, k)}이므로 ${vk} = ${k}이다.`,
        facts: eqDigit(`${b}**□`, v, 1, 13)
      });
    }, { count: 2 }),
    T('rep-line', '중복을 허용하여 나열하기·한 사람이 하나씩 고르기', '①3', (d, n) => {
      if (n === 0) {
        const [kind, nn, r] = d.pick([['ride', d.int(3, 5), d.int(4, 5)], ['ox', 2, d.int(6, 10)], ['letters', d.int(4, 6), d.int(3, 4)]]), ans = nn ** r;
        const text = kind === 'ride' ? `서로 다른 ${nn}개의 놀이기구 중에서 중복을 허용하여 ${r}개를 순서대로 타는 경우의 수는?`
          : kind === 'ox' ? `○, ×로 답하는 ${r}개의 문제에 답을 적는 경우의 수는? (단, 답을 적지 않은 문제는 없다.)`
            : `${nn}개의 문자 ${told('abcdef'.slice(0, nn).split(''))} 중에서 중복을 허용하여 ${r}개를 택해 일렬로 나열하는 경우의 수는?`;
        return N(text, ans, {
          unit: '가지',
          explain: `${kind === 'ox' ? `문제마다 ○, × 가운데 하나를 적으므로` : `자리마다 ${nn}가지 가운데 하나가 올 수 있으므로`} 서로 다른 ${nn}개에서 ${r}개를 택하는 중복순열의 수와 같다. 따라서 ${nPi(nn, r)} = ${pw(nn, r)} = ${ans}(가지)이다.`,
          facts: { calc: [[powS(nn, r), 0]] }
        });
      }
      const [kind, nn, r] = d.pick([['club', d.int(3, 6), d.int(3, 5)], ['lift', d.int(4, 7), d.int(3, 4)], ['drink', d.int(3, 4), d.int(4, 6)]]), ans = nn ** r;
      const text = kind === 'club' ? `학생 ${r}명이 서로 다른 ${nn}개의 동아리 중에서 각각 한 동아리를 택하는 경우의 수는? (단, 아무도 택하지 않는 동아리가 있을 수 있다.)`
        : kind === 'lift' ? `${nn + 1}층짜리 건물의 엘리베이터에 ${r}명이 타고 1층을 출발하였다. ${r}명이 각각 2층부터 ${nn + 1}층까지 중 한 층에서 내리는 경우의 수는? (단, 2명 이상이 같은 층에서 내릴 수 있다.)`
          : `${r}명의 학생이 서로 다른 ${nn}종류의 음료 중에서 하나씩 고르는 경우의 수는? (단, 음료는 종류마다 ${r}개 이상씩 있다.)`;
      return N(text, ans, {
        unit: '가지',
        explain: `${kind === 'lift' ? `${r}명이 저마다 내릴 층을 2층부터 ${nn + 1}층까지의 ${nn}개 층 가운데에서 고르므로` : `${r}명이 저마다 ${nn}가지 가운데 하나를 고르고 같은 것을 골라도 되므로`} 서로 다른 ${nn}개에서 ${r}개를 택하는 중복순열의 수와 같다. 따라서 ${nPi(nn, r)} = ${pw(nn, r)} = ${ans}(가지)이다.`,
        facts: { calc: [[powS(nn, r), 0]] }
      });
    }, { count: 2 }),
    T('rep-give', '서로 다른 물건을 서로 다른 곳에 나누어 넣기 — 밑과 지수 가르기', '①4', (d, n) => {
      if (n === 0) {
        const [a, b] = d.until(() => [d.int(3, 6), d.int(2, 5)], ([x, y]) => x !== y && y ** x <= 9999 && !(x === 4 && y === 2));
        const [thing, unitW, place] = d.pick([['편지', '통', '우체통'], ['공', '개', '상자'], ['사진', '장', '앨범']]), ans = b ** a;
        return N(`서로 다른 ${a}${unitW}의 ${josa(thing, '을/를')} 서로 다른 ${b}개의 ${place}에 넣는 경우의 수는? (단, ${josa(thing, '을/를')} 넣지 않는 ${josa(place, '이/가')} 있을 수 있다.)`, ans, {
          unit: '가지',
          explain: `${thing}마다 넣을 ${josa(place, '을/를')} 하나씩 고르므로 서로 다른 ${b}개에서 ${a}개를 택하는 중복순열의 수이다. 따라서 ${nPi(b, a)} = ${pw(b, a)} = ${ans}(가지)이다. ${jh(nPi(a, b), '으로/로')} 세면 ${place}마다 ${josa(thing, '을/를')} 하나씩 고르는 셈이 되어 한 ${josa(place, '이/가')} 여러 개를 받는 경우를 세지 못한다.`,
          facts: { calc: [[powS(b, a), 0]] }
        });
      }
      const [a, b] = d.until(() => [d.int(3, 6), d.int(2, 5)], ([x, y]) => x > y && !(x === 4 && y === 2) && y ** x <= 9999);
      const opts = [[nPi(a, b), powS(a, b)], [nPi(b, a), powS(b, a)], [nP(a, b), prodS(a, b)], [nH(b, a), hS(b, a)]];
      const order = d.shuffle([0, 1, 2, 3]), shownO = order.map((i) => opts[i]);
      return C(`서로 다른 운동복 ${a}벌을 학생 ${b}명에게 남김없이 나누어 주는 경우의 수를 나타낸 것은? (단, 운동복을 받지 못하는 학생이 있을 수 있다.)`, shownO.map((o) => o[0]), order.indexOf(1), {
        explain: `운동복마다 받을 학생을 한 명씩 정하므로, 서로 다른 ${b}명에서 중복을 허용하여 ${a}개를 택하는 중복순열이다. 따라서 ${nPi(b, a)} = ${pw(b, a)} = ${b ** a}(가지)이다. ${jh(nPi(a, b), '은/는')} 학생마다 운동복을 한 벌씩 고르는 경우의 수라서 한 학생이 여러 벌을 받는 경우를 세지 못한다.`,
        facts: { choose: { exprs: shownO.map((o) => o[1]), rule: 'equals', target: b ** a } }
      });
    }, { count: 2 }),
    T('rep-groups', '무리마다 고를 수가 다른 중복순열의 곱', '①5', (d, n) => {
      if (n === 0) {
        const [m1, m2, m3, p, q] = d.until(() => [d.int(1, 3), d.int(1, 3), d.int(2, 4), d.int(2, 3), d.int(2, 3)], ([a, b, c, x, y]) => a !== b && (a + c) ** x * (b + c) ** y <= 9999);
        const ans = (m1 + m3) ** p * (m2 + m3) ** q;
        return N(`어느 지역의 중학생은 남자 고등학교 ${m1}곳, 여자 고등학교 ${m2}곳, 남녀 공학 고등학교 ${m3}곳 중 한 곳에 배정된다. 이 지역의 중학교 남학생 ${p}명과 여학생 ${q}명이 고등학교에 배정되는 경우의 수는?`, ans, {
          unit: '가지',
          explain: `남학생은 남자 고등학교와 남녀 공학 고등학교의 ${m1 + m3}곳 가운데 한 곳에, 여학생은 여자 고등학교와 남녀 공학 고등학교의 ${m2 + m3}곳 가운데 한 곳에 배정된다. 따라서 ${nPi(m1 + m3, p)} × ${nPi(m2 + m3, q)} = ${pw(m1 + m3, p)} × ${pw(m2 + m3, q)} = ${ans}(가지)이다.`,
          facts: { calc: [[`(${m1}+${m3})**${p}*(${m2}+${m3})**${q}`, 0]] }
        });
      }
      const [m, s, k] = d.until(() => [d.int(3, 5), d.int(2, 4), d.int(2, 3)], ([a, b, c]) => (nCr(a, 2) * b) ** c <= 9999 && (nCr(a, 2) * b) ** c >= 100);
      const ppl = d.shuffle(NAMES).slice(0, k), c2 = nCr(m, 2), ans = c2 ** k * s ** k;
      return N(`어느 고등학교 학생은 과학 과목 ${m}개 중 서로 다른 2개를 고르고, 사회 과목 ${s}개 중 1개를 고른다. ${told(ppl)}의 ${k}명이 각각 과목을 고르는 경우의 수는? (단, 여러 학생이 같은 과목을 고를 수 있다.)`, ans, {
        unit: '가지',
        explain: `한 학생이 과학 과목 2개를 고르는 경우는 ${nC(m, 2)} = ${c2}(가지)이므로 ${k}명이 고르는 경우는 ${nPi(c2, k)} = ${pw(c2, k)}(가지), 사회 과목을 고르는 경우는 ${nPi(s, k)} = ${pw(s, k)}(가지)이다. 따라서 ${c2 ** k} × ${s ** k} = ${ans}(가지)이다.`,
        facts: { calc: [[`((${m}*${m - 1})/2)**${k}*${s}**${k}`, 0]] }
      });
    }, { count: 2 }),
    T('rep-num-nozero', '0이 없는 숫자로 만든 수와 홀수·짝수·5의 배수', '①6 심1', (d) => {
      const CONDS = [['홀수', (v) => v % 2 === 1, '일의 자리에 홀수'], ['짝수', (v) => v % 2 === 0, '일의 자리에 짝수'], ['5의 배수', (v) => v === 5, '일의 자리에 5']];
      const fit = (l) => CONDS.filter(([, t]) => { const c = l.filter(t).length; return c >= 1 && c < l.length; });
      const digs = d.until(() => d.shuffle(range(1, 9)).slice(0, d.int(3, 5)).sort((x, y) => x - y), (l) => fit(l).length >= 1);
      const m = digs.length, L = d.until(() => d.int(3, 6), (x) => m ** x <= 9999 && x >= 3), conds = fit(digs);
      const [cname, test, sayEnd] = d.pick(conds), ends = digs.filter(test), all = m ** L, part = ends.length * m ** (L - 1);
      return M(`${KN[m]} 개의 숫자 ${told(digs)} 중에서 중복을 허용하여 ${KN[L]} 자리의 자연수를 만들 때, 만들 수 있는 모든 자연수의 개수와 그중 ${cname}의 개수를 차례로 구하시오.`, [{ label: '모든 수', answer: all, unit: '개' }, { label: cname, answer: part, unit: '개' }], {
        explain: `자리마다 ${m}개의 숫자가 모두 올 수 있으므로 ${nPi(m, L)} = ${pw(m, L)} = ${all}(개)이다. ${cname}는 ${sayEnd}인 ${told(ends)}의 ${ends.length}가지가 오고 나머지 ${L - 1}개의 자리는 ${nPi(m, L - 1)}가지이므로 ${ends.length} × ${pw(m, L - 1)} = ${part}(개)이다.`,
        facts: { calc: [[powS(m, L), 0], [`${ends.length}*${m}**${L - 1}`, 1]] }
      });
    }),
    T('rep-num-zero', '0이 있는 숫자로 만든 수와 짝수·홀수', '①7', (d) => {
      const digs = d.until(() => [0].concat(d.shuffle(range(1, 9)).slice(0, d.int(2, 4))).sort((x, y) => x - y), (l) => l.some((v) => v > 0 && v % 2 === 1));
      const m = digs.length, L = d.until(() => d.int(3, 5), (x) => (m - 1) * m ** (x - 1) <= 9999);
      const odd = d.bool(), ends = digs.filter((v) => (odd ? v % 2 === 1 : v % 2 === 0)), all = (m - 1) * m ** (L - 1), part = (m - 1) * m ** (L - 2) * ends.length;
      return M(`${KN[m]} 개의 숫자 ${told(digs)} 중에서 중복을 허용하여 ${KN[L]} 자리의 자연수를 만들 때, 만들 수 있는 모든 자연수의 개수와 그중 ${odd ? '홀수' : '짝수'}의 개수를 차례로 구하시오.`, [{ label: '모든 수', answer: all, unit: '개' }, { label: odd ? '홀수' : '짝수', answer: part, unit: '개' }], {
        explain: `맨 앞자리에는 0이 올 수 없으므로 ${m - 1}가지, 나머지 ${L - 1}개의 자리는 ${nPi(m, L - 1)} = ${pw(m, L - 1)}(가지)이다. 따라서 모든 자연수는 ${m - 1} × ${m ** (L - 1)} = ${all}(개)이다. ${odd ? '홀수' : '짝수'}는 일의 자리에 ${told(ends)}의 ${ends.length}가지가 오고 가운데 ${L - 2}개의 자리는 ${nPi(m, L - 2)}가지이므로 ${m - 1} × ${pw(m, L - 2)} × ${ends.length} = ${part}(개)이다.`,
        facts: { calc: [[`(${m}-1)*${m}**(${L}-1)`, 0], [`(${m}-1)*${m}**(${L}-2)*${ends.length}`, 1]] }
      });
    }),
    T('rep-num-size', '크기 조건이 붙은 수 — 앞자리로 나누어 세기', '①8', (d, n) => {
      if (n === 0) {
        const [m, L] = d.until(() => [d.int(3, 5), d.int(3, 6)], ([a, b]) => (a - 1) * a ** (b - 1) <= 9999 && a ** (b - 1) >= 9), t = d.int(2, m), X = t * 10 ** (L - 1), ans = (t - 1) * m ** (L - 1);
        return N(`1부터 ${m}까지의 숫자 중에서 중복을 허용하여 만든 ${KN[L]} 자리의 자연수 중 ${X}보다 작은 수의 개수는?`, ans, {
          unit: '개',
          explain: `${X}보다 작은 ${KN[L]} 자리의 수는 맨 앞자리가 ${told(range(1, t - 1))}인 수이다. 맨 앞자리는 ${t - 1}가지, 나머지 ${L - 1}개의 자리는 ${nPi(m, L - 1)} = ${pw(m, L - 1)}(가지)이므로 ${t - 1} × ${m ** (L - 1)} = ${ans}(개)이다.`,
          facts: { calc: [[`(${t}-1)*${m}**${L - 1}`, 0]] }
        });
      }
      const [m, L] = d.until(() => [d.int(3, 5), d.int(4, 6)], ([a, b]) => a ** b <= 9999), t = d.int(2, m - 1), u = d.int(2, m - 1), X = t * 10 ** (L - 1) + u * 10 ** (L - 2);
      const p1 = (m - t) * m ** (L - 1), p2 = (m - u) * m ** (L - 2), p3 = m ** (L - 2), ans = p1 + p2 + p3;
      return N(`1부터 ${m}까지의 숫자 중에서 중복을 허용하여 만든 ${KN[L]} 자리의 자연수 중 ${X}보다 큰 수의 개수는?`, ans, {
        unit: '개',
        explain: `맨 앞자리가 ${t}보다 큰 수는 ${m - t} × ${pw(m, L - 1)} = ${p1}(개), 맨 앞자리가 ${t}이고 둘째 자리가 ${u}보다 큰 수는 ${m - u} × ${pw(m, L - 2)} = ${p2}(개)이다. 앞의 두 자리가 ${t}${u}인 수는 나머지 자리에 0이 오지 않으므로 모두 ${X}보다 크고 ${pw(m, L - 2)} = ${p3}(개)이다. 따라서 ${p1} + ${p2} + ${p3} = ${ans}(개)이다.`,
        facts: { calc: [[`(${m}-${t})*${m}**${L - 1}+(${m}-${u})*${m}**${L - 2}+${m}**${L - 2}`, 0]] }
      });
    }, { count: 2 })
  ];

  // ════════════════ 중복순열 — 함수·집합 ════════════════
  const funTypes = [
    T('repfun-count', '함수 X → Y의 개수', '①11', (d) => {
      const [p, q] = d.until(() => [d.int(2, 5), d.int(2, 7)], ([a, b]) => a !== b && b ** a <= 9999 && b ** a >= 16);
      return N(`두 집합 X = ${upto(p)}, Y = ${upto(q)}에 대하여 X에서 Y로의 함수의 개수는?`, q ** p, {
        unit: '개',
        explain: `X의 원소 ${p}개가 저마다 Y의 원소 ${q}개 가운데 하나에 대응하므로 서로 다른 ${q}개에서 ${p}개를 택하는 중복순열의 수와 같다. 따라서 ${nPi(q, p)} = ${pw(q, p)} = ${q ** p}(개)이다.`,
        facts: { calc: [[powS(q, p), 0]] }
      });
    }),
    T('repfun-cond', '원소마다 대응 조건이 붙은 함수의 개수', '①12', (d, n) => {
      if (n === 0) {
        const [p, q] = d.until(() => [d.int(3, 5), d.int(3, 7)], ([a, b]) => a !== b && b ** (a - 1) <= 9999), a = d.int(1, p), b = d.int(1, q), ans = q ** (p - 1);
        return N(`두 집합 X = ${upto(p)}, Y = ${upto(q)}에 대하여 ${fx(a)} = ${b}인 함수 ${vf}: X → Y의 개수는?`, ans, {
          unit: '개',
          explain: `${fx(a)} = ${josa(b, '으로/로')} 정해져 있으므로 나머지 원소 ${p - 1}개가 저마다 Y의 원소 ${q}개 가운데 하나에 대응한다. 따라서 ${nPi(q, p - 1)} = ${pw(q, p - 1)} = ${ans}(개)이다.`,
          facts: { calc: [[`${q}**(${p}-1)`, 0]] }
        });
      }
      const cnt = (top, o) => range(1, top).filter((v) => v % 2 === (o ? 1 : 0)).length;
      const [p, q, odd] = d.until(() => [d.int(4, 5), d.int(4, 7), d.bool()], ([a, b, o]) => a !== b && cnt(b, o) ** cnt(a, o) * b ** (a - cnt(a, o)) <= 9999);
      const kind = odd ? '홀수' : '짝수', inX = cnt(p, odd), inY = cnt(q, odd), rest = p - inX;
      const ans = inY ** inX * q ** rest;
      return N(`두 집합 X = ${upto(p)}, Y = ${upto(q)}에 대하여 X의 ${kind}인 원소는 모두 Y의 ${kind}인 원소에 대응시키는 함수 ${vf}: X → Y의 개수는?`, ans, {
        unit: '개',
        explain: `X의 ${kind}인 원소 ${inX}개는 Y의 ${kind}인 원소 ${inY}개 가운데 하나에 대응하므로 ${nPi(inY, inX)} = ${pw(inY, inX)}(가지), 나머지 원소 ${rest}개는 Y의 원소 ${q}개 가운데 하나에 대응하므로 ${nPi(q, rest)} = ${pw(q, rest)}(가지)이다. 따라서 ${inY ** inX} × ${q ** rest} = ${ans}(개)이다.`,
        facts: { calc: [[`${inY}**${inX}*${q}**${rest}`, 0]] }
      });
    }, { count: 2 }),
    T('repfun-onto2', '치역과 공역이 같은 함수(공역의 원소 2개)', '①13', (d) => {
      const p = d.int(3, 8), [Y, ys] = d.pick([[setOf(['a', 'b']), ['a', 'b']], [setOf([1, 2]), [1, 2]], [setOf([0, 1]), [0, 1]]]), all = seqs(ys, p), flags = all.map((t) => new Set(t).size === 2);
      return N(`두 집합 X = ${upto(p)}, Y = ${Y}에 대하여 X에서 Y로의 함수 중 치역과 공역이 같은 함수의 개수는?`, hits(flags), {
        unit: '개',
        explain: `X에서 Y로의 함수는 ${nPi(2, p)} = ${pw(2, p)} = ${2 ** p}(개)이다. 공역의 원소가 2개이므로 치역이 공역과 같지 않은 것은 모든 원소가 한 원소에 대응하는 상수함수 2개뿐이다. 따라서 ${2 ** p} − 2 = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }),
    T('repfun-zero', '함숫값의 곱이 0인 함수(여사건)', '①14', (d) => {
      const [p, q] = d.until(() => [d.int(2, 4), d.int(3, 6)], ([a, b]) => b ** a <= 1300), Y = range(0, q - 1), all = seqs(Y, p), flags = all.map((t) => t.includes(0));
      const prodT = range(1, p).map((i) => fx(i)).join(''), none = (q - 1) ** p;
      return N(`두 집합 X = ${upto(p)}, Y = ${setOf(Y)}에 대하여 ${nb(prodT + ' = 0')}을 만족시키는 함수 ${vf}: X → Y의 개수는?`, hits(flags), {
        unit: '개',
        explain: `곱이 0이려면 함숫값 가운데 적어도 하나가 0이어야 한다. X에서 Y로의 함수는 ${nPi(q, p)} = ${pw(q, p)} = ${q ** p}(개)이고, 함숫값이 모두 0이 아닌 함수는 X에서 ${setOf(range(1, q - 1))}로의 함수이므로 ${nPi(q - 1, p)} = ${pw(q - 1, p)} = ${none}(개)이다. 따라서 ${q ** p} − ${none} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }),
    T('repfun-subsets', '두 부분집합의 순서쌍 (A, B)', '①15', (d, n) => {
      const sz = n === 1 ? d.int(3, 6) : d.int(4, 6), U = range(1, sz), masks = range(0, (1 << sz) - 1), pairs = cart([masks, masks]);
      if (n === 0) {
        const k = d.int(1, sz), bit = 1 << (k - 1), flags = pairs.map(([a, b]) => (a & b) === bit);
        return N(`집합 U = ${upto(sz)}의 두 부분집합 A, B에 대하여 ${nb(`A ∩ B = {${k}}`)}가 성립하도록 하는 순서쌍 (A, B)의 개수는?`, hits(flags), {
          unit: '개',
          explain: `원소 ${josa(k, '은/는')} A ∩ B에 넣고, 나머지 원소 ${sz - 1}개는 저마다 A − B, B − A, (A ∪ B)ᶜ의 세 곳 가운데 한 곳에 넣으면 순서쌍 (A, B)가 하나 정해진다. 따라서 ${nPi(3, sz - 1)} = ${pw(3, sz - 1)} = ${hits(flags)}(개)이다.`,
          facts: { count: flags }
        });
      }
      if (n === 1) {
        const flags = pairs.map(([a, b]) => (a & b) === a);
        return N(`집합 U = ${upto(sz)}의 두 부분집합 A, B에 대하여 ${nb('A ⊂ B')}인 순서쌍 (A, B)의 개수는?`, hits(flags), {
          unit: '개',
          explain: `${nb('A ⊂ B')}이면 U의 원소는 저마다 A, B − A, Bᶜ의 세 곳 가운데 한 곳에 들어간다. 원소마다 들어갈 곳을 정하면 순서쌍 (A, B)가 하나 정해지므로 ${nPi(3, sz)} = ${pw(3, sz)} = ${hits(flags)}(개)이다.`,
          facts: { count: flags }
        });
      }
      const flags = pairs.map(([a, b]) => a !== 0 && (a & b) === a);
      return N(`전체집합 U = ${upto(sz)}의 공집합이 아닌 두 부분집합 A, B에 대하여 ${nb('A ⊂ B')}를 만족시키는 순서쌍 (A, B)의 개수는?`, hits(flags), {
        unit: '개',
        explain: `U의 원소를 저마다 A, B − A, Bᶜ의 세 곳 가운데 한 곳에 넣는 경우는 ${nPi(3, sz)} = ${pw(3, sz)} = ${3 ** sz}(가지)이다. 이 가운데 A = ∅인 경우는 원소를 B − A, Bᶜ의 두 곳에 넣는 ${nPi(2, sz)} = ${pw(2, sz)} = ${2 ** sz}(가지)이다. A가 공집합이 아니면 B도 공집합이 아니므로 ${3 ** sz} − ${2 ** sz} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }, { count: 3 })
  ];

  // ════════════════ 같은 것이 있는 순열 ════════════════
  const WORDS = ['LOVELY', 'OPINION', 'BANANA', 'LETTER', 'COOKIE', 'PEPPER', 'SUCCESS', 'ADDRESS', 'BALLOON', 'CHEESE', 'LITTLE', 'APPLE', 'ELEVEN', 'PIZZA', 'COFFEE', 'TOMATO', 'POTATO', 'BUBBLE', 'GOOGLE', 'YELLOW', 'CANADA', 'MISSION'];
  // 양 끝에 놓을 서로 다른 두 글자(낱말에 한 번씩만 있는 글자)
  const ENDS = [['HAPPINESS', 'H', 'N'], ['BALLOON', 'B', 'N'], ['ADDRESS', 'A', 'R'], ['MISSION', 'M', 'N'], ['COFFEE', 'C', 'O'], ['YELLOW', 'Y', 'W'], ['SUCCESS', 'U', 'E'], ['TOMATO', 'M', 'A'], ['LETTER', 'L', 'R'], ['GOOGLE', 'L', 'E'], ['CHEESE', 'C', 'H'], ['BUBBLE', 'U', 'L']];
  const COLORS = ['빨간', '파란', '노란', '초록', '흰', '검은'];
  const countsOf = (word) => [...tally(word.split('')).values()];
  const repeatsT = (word) => [...tally(word.split(''))].filter(([, c]) => c > 1).map(([ch, c]) => `‘${ch}’가 ${c}개`).join(', ');
  const sameTypes = [
    T('same-all', '같은 것이 있는 것을 모두 일렬로 나열하기', '①17', (d, n) => {
      if (n === 0) {
        const word = d.pick(WORDS), cnt = countsOf(word), ans = same(cnt);
        return N(`영어 단어 ‘${word}’에 있는 ${word.length}개의 문자를 모두 일렬로 나열하는 경우의 수는?`, ans, {
          unit: '가지',
          explain: `${word.length}개의 문자 가운데 ${repeatsT(word)}씩 있으므로 같은 것이 있는 순열의 수 ${sameT(cnt)} = ${ans}(가지)이다.`,
          facts: { calc: [[sameS(cnt), 0]] }
        });
      }
      const k = d.int(2, 3), cols = d.shuffle(COLORS).slice(0, k), cnt = d.until(() => cols.map(() => d.int(1, 4)), (c) => c.some((v) => v > 1) && sum(c) >= 5 && same(c) <= 9999), ans = same(cnt);
      const [thing, unitW] = d.pick([['공', '개'], ['깃발', '개'], ['구슬', '개']]);
      return N(`모양과 크기가 같은 ${cols.map((c, i) => `${c} ${thing} ${cnt[i]}${unitW}`).join(', ')}를 모두 일렬로 나열하는 경우의 수는? (단, 같은 색의 ${thing}끼리는 서로 구별하지 않는다.)`, ans, {
        unit: '가지',
        explain: `${sum(cnt)}개 가운데 같은 것이 각각 ${told(cnt)}개씩 있으므로 ${sameT(cnt)} = ${ans}(가지)이다.`,
        facts: { calc: [[sameS(cnt), 0]] }
      });
    }, { count: 2 }),
    T('same-ends', '정해진 것을 맨 앞·양 끝에 두고 나열하기', '①18', (d, n) => {
      if (n === 0) {
        const cols = d.shuffle(['빨간', '파란', '초록', '노란']).slice(0, 3), cnt = d.until(() => [d.int(2, 4), d.int(1, 3), d.int(2, 3)], (c) => sum(c) >= 6 && same(c) <= 9999);
        const both = d.bool(), rest = both ? [cnt[0], cnt[1], cnt[2] - 2] : [cnt[0], cnt[1], cnt[2] - 1], ans = same(rest);
        return N(`모양과 크기가 같은 ${cols.map((c, i) => `${c} 깃발 ${cnt[i]}개`).join(', ')}를 모두 일렬로 나열하여 신호를 만들 때, ${both ? `${cols[2]} 깃발이 양 끝에 오는` : `맨 앞에 ${cols[2]} 깃발이 오는`} 신호의 수는? (단, 같은 색의 깃발끼리는 서로 구별하지 않는다.)`, ans, {
          unit: '가지',
          explain: `${both ? `${cols[2]} 깃발 2개를 양 끝에 놓으면` : `${cols[2]} 깃발 1개를 맨 앞에 놓으면`} 나머지 ${sum(rest)}개의 자리에 ${cols.map((c, i) => [c, rest[i]]).filter(([, v]) => v > 0).map(([c, v]) => `${c} 깃발 ${v}개`).join(', ')}를 나열하면 된다. 따라서 ${sameT(rest.filter((v) => v > 0))} = ${ans}(가지)이다.`,
          facts: { calc: [[sameS(rest.filter((v) => v > 0)), 0]] }
        });
      }
      const [word, p, q] = d.pick(ENDS), restW = word.split(''), cut = (ch) => restW.splice(restW.indexOf(ch), 1);
      cut(p); cut(q);
      const cnt = [...tally(restW).values()], ans = 2 * same(cnt);
      return N(`영어 단어 ‘${word}’에 있는 ${word.length}개의 문자를 모두 일렬로 나열할 때, 양 끝에 ${lj(p, '과/와')} ${lj(q, '이/가')} 오는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `양 끝에 ${lj(p, '과/와')} ${lj(q, '을/를')} 놓는 경우는 2!가지이다. 나머지 ${restW.length}개의 문자 가운데 ${[...tally(restW)].filter(([, c]) => c > 1).map(([ch, c]) => `‘${ch}’가 ${c}개`).join(', ')}씩 있으므로 가운데에 나열하는 경우는 ${sameT(cnt)} = ${same(cnt)}(가지)이다. 따라서 2 × ${same(cnt)} = ${ans}(가지)이다.`,
        facts: { calc: [[`2*${sameS(cnt)}`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('same-even', '같은 숫자가 있는 카드로 짝수·홀수 만들기(0 없음)', '①19', (d) => {
      const [list, odd] = d.until(() => {
        const kinds = d.shuffle(range(1, 9)).slice(0, d.int(3, 4)).sort((x, y) => x - y), cnt = kinds.map(() => d.int(1, 3)), l = [];
        kinds.forEach((v, i) => { for (let j = 0; j < cnt[i]; j += 1) l.push(v); });
        return [l, d.bool()];
      }, ([l, o]) => { const e = [...new Set(l)].filter((v) => v % 2 === (o ? 1 : 0)); return l.length >= 5 && l.length <= 7 && e.length === 2 && same([...tally(l).values()]) <= 9999 && l.length > new Set(l).size; });
      const ends = [...new Set(list)].filter((v) => v % 2 === (odd ? 1 : 0)), parts = ends.map((e) => { const r = list.slice(); r.splice(r.indexOf(e), 1); return [e, [...tally(r).values()], r]; }), ans = sum(parts.map(([, c]) => same(c)));
      return N(`${KN[list.length]} 개의 숫자 ${listJ(list, '을/를')} 모두 일렬로 나열하여 만들 수 있는 ${KN[list.length]} 자리의 자연수 중 ${odd ? '홀수' : '짝수'}의 개수는?`, ans, {
        unit: '개',
        explain: `일의 자리에 ${told(ends)} 가운데 하나가 와야 한다. ` + parts.map(([e, c, r]) => `일의 자리가 ${e}이면 나머지 ${listJ(r, '을/를')} 나열하여 ${sameT(c)} = ${same(c)}(개)`).join(', ') + `이다. 따라서 ${parts.map(([, c]) => same(c)).join(' + ')} = ${ans}(개)이다.`,
        facts: { calc: [[parts.map(([, c]) => sameS(c)).join('+'), 0]] }
      });
    }),
    T('same-zero-even', '0이 섞인 같은 숫자 카드로 짝수 만들기', '①20', (d) => {
      const list = d.until(() => {
        const kinds = d.shuffle(range(1, 9)).slice(0, 3).sort((x, y) => x - y), cnt = kinds.map(() => d.int(1, 3)), l = [0];
        kinds.forEach((v, i) => { for (let j = 0; j < cnt[i]; j += 1) l.push(v); });
        return l.sort((x, y) => x - y);
      }, (l) => l.length >= 6 && l.length <= 7 && [...new Set(l)].filter((v) => v > 0 && v % 2 === 0).length === 1 && l.length - 1 > new Set(l).size - 1 && same([...tally(l).values()]) <= 9999);
      const e = list.find((v) => v > 0 && v % 2 === 0), r0 = list.slice(1), c0 = [...tally(r0).values()];
      const r1 = list.slice(); r1.splice(r1.indexOf(e), 1);
      const c1 = [...tally(r1).values()], r1z = r1.slice(1), c1z = [...tally(r1z).values()], part1 = same(c1) - same(c1z), ans = same(c0) + part1;
      return N(`${KN[list.length]} 개의 숫자 ${listJ(list, '을/를')} 모두 일렬로 나열하여 만들 수 있는 ${KN[list.length]} 자리의 자연수 중 짝수의 개수는?`, ans, {
        unit: '개',
        explain: `일의 자리에 0 또는 ${josa(e, '이/가')} 와야 한다. 일의 자리가 0이면 나머지 ${listJ(r0, '을/를')} 나열하여 ${sameT(c0)} = ${same(c0)}(개)이다. 일의 자리가 ${e}이면 나머지 ${listJ(r1, '을/를')} 나열하는 ${same(c1)}가지에서 0이 맨 앞에 오는 ${same(c1z)}가지를 빼서 ${part1}(개)이다. 따라서 ${same(c0)} + ${part1} = ${ans}(개)이다.`,
        facts: { calc: [[`${sameS(c0)}+${sameS(c1)}-${sameS(c1z)}`, 0]] }
      });
    }),
    T('same-comb', '같은 것이 있는 순열과 조합(자리 고르기) 견주기', '①21', (d) => {
      const [p, q] = d.until(() => [d.int(2, 6), d.int(2, 4)], ([a, b]) => a !== b && a + b <= 9 && a + b >= 6), n0 = p + q, ans = same([p, q]);
      const opts = [[nC(n0, p), combS(n0, p)], [nP(n0, p), prodS(n0, p)], [nPi(n0, p), powS(n0, p)], [nH(n0, p), hS(n0, p)]];
      const order = d.shuffle([0, 1, 2, 3]), shownO = order.map((i) => opts[i]);
      return C(`모양과 크기가 같은 흰 바둑돌 ${p}개와 검은 바둑돌 ${q}개를 모두 일렬로 나열하는 경우의 수와 같은 것은?`, shownO.map((o) => o[0]), order.indexOf(0), {
        explain: `같은 것이 있는 순열의 수로 세면 ${sameT([p, q])} = ${ans}(가지)이다. ${n0}개의 자리 가운데 흰 바둑돌을 놓을 ${p}개의 자리를 고르면 나머지 자리는 검은 바둑돌이 차지하므로 ${nC(n0, p)} = ${ans}(가지)와 같다.`,
        facts: { choose: { exprs: shownO.map((o) => o[1]), rule: 'equals', target: ans } }
      });
    }),
    T('same-product', '곱·합이 정해진 수의 배열 — 수 묶음을 찾아 나열하기', '①23', (d, n) => {
      if (n === 0) {
        const [p, q, r] = d.shuffle([2, 3, 5, 7]).slice(0, 3), e1 = d.int(2, 3), e3 = d.int(1, 2), k = e1 + 2 + e3, K = p ** e1 * q * q * r ** e3, ans = 2 * same([e1, 2, e3]);
        const X = (i) => V('x') + '<sub>' + i + '</sub>', xs = range(1, k).map(X);
        const vals = d.shuffle([p, -q, q, r]).map((v) => (v < 0 ? '−' + (-v) : String(v)));
        return N(`${jh(told(xs), '은/는')} 각각 ${told(vals)}의 네 수 중 어느 한 값이다. 등식 ${nb(xs.join(' × ') + ' = ' + K)}${tail(K, '을/를')} 만족시키는 순서쌍 (${told(xs)})의 개수는?`, ans, {
          unit: '개',
          explain: `${K} = ${nb(pw(p, e1) + ' × ' + pw(q, 2) + (e3 > 1 ? ' × ' + pw(r, e3) : ' × ' + r))}이므로 ${k}개의 수 가운데 ${josa(p, '이/가')} ${e1}개, ${josa(r, '이/가')} ${e3}개이고 나머지 2개는 각각 ${q} 또는 −${q}이다. 곱이 양수이므로 −${josa(q, '은/는')} 0개 또는 2개이다. 곧 ${josa(q, '이/가')} 2개인 묶음과 −${josa(q, '이/가')} 2개인 묶음의 두 가지가 있고, 각 묶음을 나열하는 경우는 ${sameT([e1, 2, e3])} = ${same([e1, 2, e3])}(개)이다. 따라서 2 × ${same([e1, 2, e3])} = ${ans}(개)이다.`,
          facts: { calc: [[`2*${sameS([e1, 2, e3])}`, 0]] }
        });
      }
      const [p, q, s] = d.until(() => [d.int(3, 5), d.int(3, 4), d.int(6, 14)], ([a, b, c]) => { const ms = multis(range(1, b), a).filter((t) => sum(t) === c); return ms.length >= 2 && ms.length <= 3 && sum(ms.map((t) => same([...tally(t).values()]))) <= 80; });
      const dom = 'abcde'.slice(0, p).split(''), all = seqs(range(1, q), p), flags = all.map((t) => sum(t) === s), ms = multis(range(1, q), p).filter((t) => sum(t) === s);
      return N(`두 집합 X = ${setOf(dom)}, Y = ${upto(q)}에 대하여 함수 ${vf}: X → Y 중에서 ${nb(dom.map(fx).join(' + ') + ' = ' + s)}${tail(s, '을/를')} 만족시키는 함수 ${vf}의 개수는?`, hits(flags), {
        unit: '개',
        explain: `Y의 원소 가운데 중복을 허용하여 고른 ${p}개의 수의 합이 ${s}인 묶음은 ` + ms.map((t) => `(${told(t.slice().reverse())})`).join(', ') + `이다. 묶음마다 그 수들을 X의 원소에 대응시키는 경우는 ` + ms.map((t) => `${sameT([...tally(t).values()])} = ${same([...tally(t).values()])}`).join(', ') + `(가지)이므로 ${ms.map((t) => same([...tally(t).values()])).join(' + ')} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }, { count: 2 }),
    T('same-stairs', '걸음 수가 정해진 계단 오르기', '①24', (d) => {
      const [st, k] = d.until(() => [d.int(8, 14), d.int(5, 12)], ([a, b]) => b < a && a < 2 * b && nCr(b, a - b) <= 9999 && a - b >= 2 && 2 * b - a >= 2), y = st - k, x = 2 * k - st, ans = nCr(k, y);
      return N(`한 걸음에 1계단 또는 2계단씩 오를 수 있는 ${st}개의 계단이 있다. 이 ${st}개의 계단을 ${k}걸음에 모두 오르는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `1계단씩 오르는 걸음 수를 ${V('a')}, 2계단씩 오르는 걸음 수를 ${V('b')}라 하면 ${nb(`${V('a')} + ${V('b')} = ${k}`)}, ${nb(`${V('a')} + 2${V('b')} = ${st}`)}에서 ${V('a')} = ${x}, ${V('b')} = ${y}이다. 1계단 ${x}번과 2계단 ${y}번을 일렬로 나열하면 되므로 ${sameT([x, y])} = ${ans}(가지)이다.`,
        facts: { calc: [[`${sameS([x, y])}`, 0]] }
      });
    })
  ];

  // ════════════════ 같은 것이 있는 순열 — 차례·이웃 조건 ════════════════
  const orderTypes = [
    T('order-fixed', '몇 개의 차례가 정해진 나열', '①26', (d, n) => {
      if (n === 0) {
        const runners = d.bool();
        if (runners) {
          const k = d.int(5, 7), r = d.int(2, 3), ppl = 'ABCDEFG'.slice(0, k).split(''), chain = d.shuffle(ppl).slice(0, r), ans = nPr(k, k) / fact(r);
          const said = chain.slice(0, -1).map((p, i) => `${lj(p, '이/가')} ${chain[i + 1]}보다`).join(', ');
          return N(`${KN[k]} 명의 학생 ${told(ppl)}가 달리기 시합을 할 때, ${said} 먼저 결승선을 통과하는 경우의 수는? (단, 어떤 두 학생도 동시에 결승선을 통과하지 않는다.)`, ans, {
            unit: '가지',
            explain: `${told(chain)}의 차례가 정해져 있으므로 이 ${r}명을 같은 문자로 보고 ${k}명을 일렬로 나열한 뒤 그 자리에 ${chain.join(', ')}의 차례로 넣으면 된다. 따라서 ${k}!/${r}! = ${ans}(가지)이다.`,
            facts: { calc: [[`(${factS(k)})/(${factS(r)})`, 0]] }
          });
        }
        const k = d.int(5, 7), [a, b] = d.shuffle(range(1, k)).slice(0, 2), ans = fact(k) / 2;
        return N(`1부터 ${k}까지의 자연수를 모두 일렬로 나열할 때, ${josa(a, '이/가')} ${b}보다 앞에 오도록 나열하는 경우의 수는?`, ans, {
          unit: '가지',
          explain: `${josa(a, '과/와')} ${josa(b, '을/를')} 같은 것으로 보고 ${k}개를 일렬로 나열한 뒤 앞의 것을 ${a}, 뒤의 것을 ${josa(b, '으로/로')} 바꾸면 된다. 따라서 ${k}!/2! = ${ans}(가지)이다.`,
          facts: { calc: [[`(${factS(k)})/2`, 0]], unseen: [2] }
        });
      }
      if (n === 1) {
        const [p, q] = d.until(() => [d.int(2, 4), d.int(2, 4)], ([x, y]) => x + y >= 5), ans = same([p, q]), digs = range(1, p), lets = 'abcd'.slice(0, q).split('');
        return N(`숫자 ${listJ(digs, '과/와')} 문자 ${told(lets)}를 모두 일렬로 나열할 때, 숫자는 작은 수부터 차례로, 문자는 알파벳 순서로 나열하는 경우의 수는?`, ans, {
          unit: '가지',
          explain: `숫자 ${p}개를 같은 것으로, 문자 ${q}개를 같은 것으로 보고 일렬로 나열한 뒤 숫자 자리에는 작은 수부터, 문자 자리에는 알파벳 순서로 넣으면 된다. 따라서 ${sameT([p, q])} = ${ans}(가지)이다.`,
          facts: { calc: [[sameS([p, q]), 0]] }
        });
      }
      const [chain, dup, cd] = d.until(() => { const s = d.shuffle(range(1, 9)); return [s.slice(0, 3).sort((x, y) => x - y), s[3], d.int(2, 3)]; }, ([c, dd]) => !c.includes(dd));
      const list = chain.concat(range(1, cd).map(() => dup)).sort((x, y) => x - y), ans = same([3, cd]);
      return N(`${KN[list.length]} 개의 숫자 ${listJ(list, '을/를')} 모두 일렬로 나열할 때, ${listJ(chain, '은/는')} 이 순서대로 나열하는 경우의 수는?`, ans, {
        unit: '가지',
        explain: `${told(chain)}의 차례가 정해져 있으므로 세 수를 같은 문자 □로 보고 □, □, □와 ${listJ(range(1, cd).map(() => dup), '을/를')} 나열한 뒤 □ 자리에 작은 수부터 차례로 넣는다. 따라서 ${sameT([3, cd])} = ${ans}(가지)이다.`,
        facts: { calc: [[sameS([3, cd]), 0]], unseen: [3] }
      });
    }, { count: 3 }),
    T('order-adjacent', '차례 조건과 이웃 조건을 함께', '①27', (d) => {
      const k = d.int(6, 8), r = d.int(2, 3), lets = 'abcdefgh'.slice(0, k).split(''), chain = lets.slice(0, r), pair = lets.slice(k - 2), ans = fact(k - 1) / fact(r) * 2;
      const conds = chain.slice(0, -1).map((c, i) => `${c}는 ${chain[i + 1]}의 앞에 온다.`).concat([`${told(pair)}는 이웃한다.`]);
      return N(`다음 조건을 모두 만족시키며 ${KN[k]} 개의 문자 ${told(lets)}를 모두 일렬로 나열하는 경우의 수는?`, ans, {
        unit: '가지',
        figure: lines(conds.map((c, i) => '㈎㈏㈐'[i] + ' ' + c)),
        explain: `이웃하는 ${told(pair)}를 한 묶음으로 보면 ${k - 1}개를 나열하는 것이 되고, ${told(chain)}는 차례가 정해져 있으므로 같은 문자로 본다. 그러면 ${k - 1}!/${r}! = ${fact(k - 1) / fact(r)}(가지)이고, 묶음 안에서 ${told(pair)}의 차례를 바꾸는 2가지를 곱하여 ${fact(k - 1) / fact(r)} × 2 = ${ans}(가지)이다.`,
        facts: { calc: [[`(${factS(k - 1)})/(${factS(r)})*2`, 0]], unseen: [2] }
      });
    }),
    T('order-between', '같은 것이 있을 때 두 수 사이에 k개가 오도록', '①28', (d) => {
      const [list, a, b, k] = d.until(() => {
        const s = d.shuffle(range(1, 9)), dup = s[0], rep = d.int(2, 3), singles = s.slice(1, 1 + d.int(3, 4)).sort((x, y) => x - y);
        const l = range(1, rep).map(() => dup).concat(singles).sort((x, y) => x - y), [x, y] = singles.slice(0, 2);
        return [l, x, y, d.int(1, 3)];
      }, ([l, , , kk]) => l.length >= 6 && l.length <= 7 && l.length - kk - 1 >= 2);
      const L = list.length, all = arrange(list), flags = all.map((t) => Math.abs(t.indexOf(a) - t.indexOf(b)) === k + 1);
      const rest = list.slice(); rest.splice(rest.indexOf(a), 1); rest.splice(rest.indexOf(b), 1);
      const cr = [...tally(rest).values()], pos = L - k - 1, ans = pos * 2 * same(cr);
      return N(`${KN[L]} 개의 숫자 ${listJ(list, '을/를')} 모두 일렬로 나열할 때, ${josa(a, '과/와')} ${b} 사이에 ${k}개의 숫자가 오도록 나열하는 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `${josa(a, '과/와')} ${b} 사이에 ${k}개가 오는 두 자리는 1번째와 ${k + 2}번째 자리부터 ${pos}번째와 ${L}번째 자리까지 ${pos}가지이고, 두 수의 차례를 바꾸는 2가지가 있다. 나머지 ${L - 2}개의 자리에 ${listJ(rest, '을/를')} 나열하는 경우는 ${sameT(cr)} = ${same(cr)}(가지)이므로 ${pos} × 2 × ${same(cr)} = ${ans}(가지)이다.`,
        facts: { count: flags }
      });
    }),
    T('order-repeat-apart', '중복을 허용한 나열에서 같은 문자끼리 이웃하지 않게', '①29', (d) => {
      const m = d.int(3, 5), lets = 'abcde'.slice(0, m).split(''), t = d.pick(lets), all = seqs(lets, 3), flags = all.map((s) => !(s[0] === t && s[1] === t) && !(s[1] === t && s[2] === t));
      return N(`${KN[m]} 개의 문자 ${told(lets)} 중에서 중복을 허용하여 3개를 택해 일렬로 나열할 때, ${t}끼리는 서로 이웃하지 않도록 나열하는 경우의 수는?`, hits(flags), {
        unit: '가지',
        explain: `모든 경우는 ${nPi(m, 3)} = ${pw(m, 3)} = ${m ** 3}(가지)이다. ${t}끼리 이웃하는 것은 ${t}${t}□ 꼴 ${m}가지와 □${t}${t} 꼴 ${m}가지인데 ${t}${t}${t}가 두 번 세어졌으므로 ${m} + ${m} − 1 = ${2 * m - 1}(가지)이다. 따라서 ${m ** 3} − ${2 * m - 1} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }),
    T('order-apart', '같은 것이 있을 때 같은 색끼리 이웃하지 않게', '①30', (d) => {
      const extra = d.int(1, 2), cols = d.shuffle(['노란', '빨간', '파란']).slice(0, extra), list = ['W', 'W', 'K', 'K'].concat(cols.map((_, i) => 'E' + i)), all = arrange(list);
      const adj = (t, c) => t.some((x, i) => i > 0 && x === c && t[i - 1] === c), flags = all.map((t) => !adj(t, 'W') && !adj(t, 'K'));
      const L = list.length, tot = all.length, one = fact(L - 1) / 2, both = fact(L - 2);
      return N(`흰 공 2개, 검은 공 2개, ${cols.map((c) => c + ' 공 1개').join(', ')}를 모두 일렬로 나열할 때, 같은 색의 공끼리는 서로 이웃하지 않게 나열하는 경우의 수는? (단, 같은 색의 공끼리는 구별하지 않는다.)`, hits(flags), {
        unit: '가지',
        explain: `모든 경우는 ${sameT([2, 2].concat(cols.map(() => 1)))} = ${tot}(가지)이다. 흰 공 2개가 이웃하는 경우는 흰 공을 한 묶음으로 보아 ${L - 1}!/2! = ${one}(가지), 검은 공 2개가 이웃하는 경우도 ${one}가지, 둘 다 이웃하는 경우는 ${L - 2}! = ${both}(가지)이다. 따라서 ${tot} − (${one} + ${one} − ${both}) = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    })
  ];

  // ════════════════ 최단 거리로 가는 길 ════════════════
  const roadTypes = [
    T('road-grid', '바둑판 도로망의 최단 경로 수', '①32', (d) => {
      const [w, h] = d.until(() => [d.int(3, 7), d.int(3, 5)], ([a, b]) => a !== b && nCr(a + b, a) <= 9999), g = net(w, h), ans = nCr(w + h, w);
      return N('그림과 같이 직사각형 모양으로 연결된 도로망이 있다. 이 도로망을 따라 A 지점에서 출발하여 B 지점까지 최단 거리로 가는 경우의 수는?', ans, {
        unit: '가지',
        figure: netFig(g, { say: gridSay(w, h) }),
        explain: `오른쪽으로 한 칸 가는 것을 ${V('a')}, 위쪽으로 한 칸 가는 것을 ${V('b')}로 나타내면, 최단 거리로 가는 경우의 수는 ${V('a')} ${w}개와 ${V('b')} ${h}개를 모두 일렬로 나열하는 경우의 수와 같다. 따라서 ${sameT([w, h])} = ${ans}(가지)이다.`,
        facts: { calc: [[sameS([w, h]), 0]] }
      });
    }),
    T('road-via', '정해진 점을 지나는 최단 경로', '①33 심3', (d, n) => {
      const [w, h] = d.until(() => [d.int(4, 7), d.int(3, 5)], ([a, b]) => nCr(a + b, a) <= 1800), g = net(w, h), all = routes(w, h);
      if (n === 0) {
        const P = [d.int(1, w - 1), d.int(1, h - 1)], flags = all.map((rt) => passes(rt, P)), ap = nCr(P[0] + P[1], P[0]), pb = nCr(w - P[0] + h - P[1], w - P[0]);
        return N('그림과 같이 직사각형 모양으로 연결된 도로망이 있다. 이 도로망을 따라 A 지점에서 출발하여 P 지점을 지나 B 지점까지 최단 거리로 가는 경우의 수는?', hits(flags), {
          unit: '가지',
          figure: netFig(g, { pts: [{ p: P, t: 'P' }], say: gridSay(w, h) + ` 점 P는 ${spot(P)}이다.` }),
          explain: `A에서 P까지 최단 거리로 가는 경우는 ${sameT([P[0], P[1]])} = ${ap}(가지), P에서 B까지는 ${sameT([w - P[0], h - P[1]])} = ${pb}(가지)이므로 ${ap} × ${pb} = ${hits(flags)}(가지)이다.`,
          facts: { count: flags }
        });
      }
      const [P, Q] = d.until(() => { const p = [d.int(1, w - 2), d.int(1, h - 1)]; return [p, [d.int(p[0] + 1, w - 1), d.int(p[1], h - 1)]]; }, ([p, q]) => q[0] < w && q[1] <= h - 1 && (q[0] - p[0]) + (q[1] - p[1]) >= 1);
      const flags = all.map((rt) => passes(rt, P) && passes(rt, Q)), ap = nCr(P[0] + P[1], P[0]), pq = nCr(Q[0] - P[0] + Q[1] - P[1], Q[0] - P[0]), qb = nCr(w - Q[0] + h - Q[1], w - Q[0]);
      return N('그림과 같이 직사각형 모양으로 연결된 도로망이 있다. 이 도로망을 따라 A 지점에서 출발하여 P 지점과 Q 지점을 모두 지나 B 지점까지 최단 거리로 가는 경우의 수는?', hits(flags), {
        unit: '가지',
        figure: netFig(g, { pts: [{ p: P, t: 'P' }, { p: Q, t: 'Q', a: 315 }], say: gridSay(w, h) + ` 점 P는 ${spot(P)}, 점 Q는 ${spot(Q)}이다.` }),
        explain: `A → P는 ${sameT([P[0], P[1]].filter((v) => v > 0))} = ${ap}(가지), P → Q는 ${pq}가지, Q → B는 ${sameT([w - Q[0], h - Q[1]].filter((v) => v > 0))} = ${qb}(가지)이므로 ${ap} × ${pq} × ${qb} = ${hits(flags)}(가지)이다.`,
        facts: { count: flags }
      });
    }, { count: 2 }),
    T('road-block', '막힌 점·없는 길이 있는 도로망', '①34', (d, n) => {
      if (n === 0) {
        const [w, h, S] = d.until(() => { const a = d.int(3, 6), b = d.int(3, 4); return [a, b, [d.int(1, a - 1), d.int(1, b - 1)]]; }, ([a, b]) => nCr(a + b, a) <= 1800);
        const g = net(w, h, (x1, y1, x2, y2) => !((x1 === S[0] && y1 === S[1]) || (x2 === S[0] && y2 === S[1]))), all = routes(w, h), flags = all.map((rt) => walks(g, rt));
        const tot = nCr(w + h, w), as = nCr(S[0] + S[1], S[0]), sb = nCr(w - S[0] + h - S[1], w - S[0]);
        return N('호수가 있는 어느 지역의 도로망이 그림과 같이 연결되어 있다. 이 도로망을 따라 A 지점에서 출발하여 B 지점까지 최단 거리로 가는 경우의 수는?', hits(flags), {
          unit: '가지',
          figure: netFig(g, { lake: S, say: gridSay(w, h) + ` 다만 ${spot(S)}에는 호수가 있어 그 점으로 들어가거나 나오는 길이 없다.` }),
          explain: `호수가 없을 때 최단 거리로 가는 경우는 ${sameT([w, h])} = ${tot}(가지)이다. 이 가운데 호수 자리의 점을 지나는 경우는 ${as} × ${sb} = ${as * sb}(가지)이므로 ${tot} − ${as * sb} = ${hits(flags)}(가지)이다. (점마다 그 점까지 가는 경우의 수를 왼쪽 점과 아래쪽 점의 수를 더해 적어 나가도 같다.)`,
          facts: { count: flags }
        });
      }
      const [w, h, P, e] = d.until(() => {
        const a = d.int(4, 6), b = d.int(3, 4), p = [d.int(2, a - 1), d.int(2, b - 1)], vert = d.bool();
        const x1 = vert ? d.int(0, p[0]) : d.int(0, p[0] - 1), y1 = vert ? d.int(0, p[1] - 1) : d.int(0, p[1]);
        return [a, b, p, [x1, y1, vert ? x1 : x1 + 1, vert ? y1 + 1 : y1]];
      }, ([a, b, p]) => nCr(a + b, a) <= 1800 && p[0] < a && p[1] < b);
      const g = net(w, h, (x1, y1, x2, y2) => !(x1 === e[0] && y1 === e[1] && x2 === e[2] && y2 === e[3])), all = routes(w, h), flags = all.map((rt) => walks(g, rt) && passes(rt, P));
      const full = net(w, h), ap0 = ways(full, [0, 0], P), cut = ways(full, [0, 0], [e[0], e[1]]) * ways(full, [e[2], e[3]], P), pb = ways(full, P, [w, h]), ans = (ap0 - cut) * pb;
      const eSay = `${spot([e[0], e[1]])}과 ${e[2] > e[0] ? '그 오른쪽' : '그 위쪽'} 점 사이에는 길이 없다.`;
      return N('그림과 같이 연결된 도로망이 있다. 이 도로망을 따라 A 지점에서 출발하여 P 지점을 지나 B 지점까지 최단 거리로 가는 경우의 수는?', hits(flags), {
        unit: '가지',
        figure: netFig(g, { pts: [{ p: P, t: 'P' }], say: gridSay(w, h) + ` 점 P는 ${spot(P)}이다. ${eSay}` }),
        explain: `길이 모두 있다면 A에서 P까지 ${ap0}가지인데, 이 가운데 없는 길을 지나는 것이 ${cut}가지이므로 A → P는 ${ap0} − ${cut} = ${ap0 - cut}(가지)이다. P → B는 ${pb}가지이므로 ${ap0 - cut} × ${pb} = ${ans}(가지)이다.`,
        facts: { count: flags }
      });
    }, { count: 2 }),
    T('road-shape', '직사각형이 아닌 도로망 — 반드시 지나는 점·빈 구역', '①35', (d, n) => {
      if (n === 0) {
        const [a, b, c, e, W, Hh] = d.until(() => { const k = d.int(1, 2), a0 = d.int(k + 1, 4), b0 = d.int(k + 1, 4), W0 = d.int(a0 + 2, 7), H0 = d.int(b0 + 2, 6); return [a0, b0, a0 - k, b0 - k, W0, H0]; }, ([a0, b0, c0, e0, W0, H0]) => c0 >= 1 && e0 >= 1 && nCr(W0 + H0, W0) <= 1800);
        const inR1 = (x, y) => x <= a && y <= b, inR2 = (x, y) => x >= c && y >= e, g = net(W, Hh, (x1, y1, x2, y2) => (inR1(x1, y1) && inR1(x2, y2)) || (inR2(x1, y1) && inR2(x2, y2)));
        const all = routes(W, Hh), flags = all.map((rt) => walks(g, rt)), cuts = range(c, a).map((x) => [x, c + b - x]).filter(([x, y]) => y >= e && y <= b);
        const parts = cuts.map((p) => nCr(p[0] + p[1], p[0]) * nCr(W - p[0] + Hh - p[1], W - p[0]));
        return N('그림과 같이 연결된 도로망이 있다. 이 도로망을 따라 A 지점에서 출발하여 B 지점까지 최단 거리로 가는 경우의 수는?', hits(flags), {
          unit: '가지',
          figure: netFig(g, { say: `도로망 그림: 바둑판 모양의 두 직사각형 도로망이 겹쳐 이어져 있다. A쪽 도로망은 A에서 오른쪽으로 ${a}칸, 위쪽으로 ${b}칸이고, B쪽 도로망은 A에서 오른쪽으로 ${c}칸, 위쪽으로 ${e}칸 간 점부터 오른쪽으로 ${W}칸, 위쪽으로 ${Hh}칸 간 점 B까지이다. 두 도로망은 가로 ${a - c}칸, 세로 ${b - e}칸만큼 겹친다.` }),
          explain: `두 도로망이 겹친 부분의 대각선 위의 점 ${cuts.map((p) => `(${p[0]}, ${p[1]})`).join(', ')} 가운데 꼭 한 점을 지나야 한다(A에서 오른쪽으로 몇 칸, 위쪽으로 몇 칸 간 점을 (몇, 몇)으로 적었다). ` + cuts.map((p, i) => `(${p[0]}, ${p[1]})${tail(p[1], '을/를')} 지나는 경우는 ${nCr(p[0] + p[1], p[0])} × ${nCr(W - p[0] + Hh - p[1], W - p[0])} = ${parts[i]}(가지)`).join(', ') + `이므로 ${parts.join(' + ')} = ${hits(flags)}(가지)이다.`,
          facts: { count: flags }
        });
      }
      const [w, h, hole] = d.until(() => { const a = d.int(5, 7), b = d.int(4, 5), wide = d.bool(), hw = wide ? 3 : 2, hh = wide ? 2 : 3, x1 = d.int(1, a - hw - 1), y1 = d.int(1, b - hh - 1); return [a, b, [x1, y1, x1 + hw, y1 + hh]]; }, ([a, b, ho]) => ho[2] <= a - 1 && ho[3] <= b - 1 && nCr(a + b, a) <= 1800);
      const [x1, y1, x2, y2] = hole, inside = (x, y) => x > x1 && x < x2 && y > y1 && y < y2, g = net(w, h, (p, q, r, s) => !inside(p, q) && !inside(r, s));
      const all = routes(w, h), flags = all.map((rt) => walks(g, rt)), I = range(x1 + 1, x2 - 1).flatMap((x) => range(y1 + 1, y2 - 1).map((y) => [x, y]));
      const full = net(w, h), tot = nCr(w + h, w), via = (p) => ways(full, [0, 0], p) * ways(full, p, [w, h]), v1 = via(I[0]), v2 = via(I[1]), v12 = ways(full, [0, 0], I[0]) * ways(full, I[0], I[1]) * ways(full, I[1], [w, h]);
      return N('그림과 같이 가운데에 길이 없는 구역이 있는 도로망이 있다. 이 도로망을 따라 A 지점에서 출발하여 B 지점까지 최단 거리로 가는 경우의 수는?', hits(flags), {
        unit: '가지',
        figure: netFig(g, { hole, say: gridSay(w, h) + ` 다만 ${spot([x1, y1])}부터 ${spot([x2, y2])}까지의 가로 ${x2 - x1}칸, 세로 ${y2 - y1}칸인 직사각형 구역 안에는 길이 없고, 그 둘레의 길만 있다.` }),
        explain: `구역 안에도 길이 있다면 ${sameT([w, h])} = ${tot}(가지)이다. 구역 안의 두 점 (${I[0]}), (${I[1]}) 가운데 하나라도 지나는 경우를 빼면 된다(A에서 오른쪽으로 몇 칸, 위쪽으로 몇 칸 간 점을 (몇, 몇)으로 적었다). 첫째 점을 지나는 경우 ${v1}가지, 둘째 점을 지나는 경우 ${v2}가지, 두 점을 모두 지나는 경우 ${v12}가지이므로 ${tot} − (${v1} + ${v2} − ${v12}) = ${hits(flags)}(가지)이다.`.replace(/\((\d),(\d)\)/g, '($1, $2)'),
        facts: { count: flags }
      });
    }, { count: 2 }),
    T('road-3d', '입체 도로망(층이 있는 경로)', '①36', (d) => {
      const [a, bb, c] = d.until(() => [d.int(2, 4), d.int(1, 2), d.int(2, 3)], ([x, y, z]) => same([x, y, z]) <= 9999 && x + y + z >= 6), ans = same([a, bb, c]);
      const S = space({ u: 30 });
      for (let z = 0; z <= c; z += 1) {
        for (let x = 0; x <= bb; x += 1) S.seg([x, 0, z], [x, a, z]);
        for (let y = 0; y <= a; y += 1) S.seg([0, y, z], [bb, y, z]);
        if (z < c) for (let x = 0; x <= bb; x += 1) for (let y = 0; y <= a; y += 1) S.seg([x, y, z], [x, y, z + 1], 'thin');
        S.text([bb, -1, z], (z + 1) + '층', { plain: true, size: 12 });
      }
      S.dot([bb, 0, 0]).name([bb, 0, 0], 'A', 270).dot([0, a, c]).name([0, a, c], 'B', 45);
      const figure = S.svg(`입체 도로망 그림: 1층부터 ${c + 1}층까지 층마다 가로 ${a}칸, 앞뒤 ${bb}칸인 바둑판 모양의 길이 있고, 층과 층은 아래위로 겹친 점마다 세로 길로 이어져 있다. A는 1층의 앞쪽 왼쪽 끝, B는 ${c + 1}층의 뒤쪽 오른쪽 끝이다.`);
      return N(`다음 그림은 어느 건물의 1층에 있는 A 지점에서 ${c + 1}층에 있는 B 지점까지 가는 길을 나타낸 것이다. 이 길을 따라 A 지점에서 출발하여 B 지점까지 최단 거리로 가는 경우의 수는?`, ans, {
        unit: '가지',
        figure,
        explain: `최단 거리로 가려면 오른쪽으로 ${a}칸, 뒤쪽으로 ${bb}칸, 위쪽으로 ${c}칸을 가야 한다. 세 방향의 한 칸을 각각 ${V('a')}, ${V('b')}, ${V('c')}로 나타내면 ${V('a')} ${a}개, ${V('b')} ${bb}개, ${V('c')} ${c}개를 일렬로 나열하는 경우의 수와 같으므로 ${sameT([a, bb, c])} = ${ans}(가지)이다.`,
        facts: { calc: [[sameS([a, bb, c]), 0]] }
      });
    })
  ];

  // b·c 파일이 함께 쓰는 도구
  B.kit.u31x = {
    UNIT, S1, S2, sum, hits, fact, nPr, nCr, nHr, same, cart, seqs, combos, multis, arrange, tally, told, listJ, KN,
    prodS, factS, combS, hS, powS, sameS, eqDigit, stripH, seal, T, H, lj, vk, vn, vr, vf, fx, setOf, upto, sameT,
    net, road, ways, routes, walks, passes, spot, netFig, gridSay
  };

  B.addUnit({
    id: '11-3-1', grade: 11, semester: 3, no: 1, title: '여러 가지 순열과 중복조합', version: 1,
    groups: [
      { id: 'rep', title: '중복순열', standard: S1, types: repTypes },
      { id: 'repfun', title: '중복순열 — 함수·집합', standard: S1, types: funTypes },
      { id: 'same', title: '같은 것이 있는 순열', standard: S1, types: sameTypes.concat(orderTypes) },
      { id: 'road', title: '최단 거리로 가는 길', standard: S1, types: roadTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
