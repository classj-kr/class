// 고등학교 기하 Ⅲ-1 벡터의 연산 — 단원 틀·도구와 앞쪽 묶음(벡터의 뜻, 벡터의 덧셈과 뺄셈, 도형 속 벡터를 나타내기, 벡터의 실수배).
// 수집해 둔 천재 T셀파 기하(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 33꼴, 기본꼴_2: 25꼴, 심화 문서 없음)을
// 꼴마다 따져서 실었다. 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-4-6/싣기_대조표.md 에 있다.
// (중점·내분점·무게중심, 벡터의 평행, 합·차의 크기와 힘·속도는 11-4-6b.js 에, 실력 문항은 11-4-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번.
// 성취기준은 12기하03-01(벡터의 뜻을 알고, 벡터의 덧셈, 뺄셈, 실수배를 할 수 있다) 하나다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(평면도형·입체도형·모눈·식), 묻는 것(크기·같은 벡터·간단히 한 벡터·두세 벡터의 일차결합·상수),
//    도형(평행사변형·정육각형·직육면체·정사면체·정팔면체·전개도)이 다르면 따로 싣는다. 수나 글자만 바꾼 유형은 만들지 않는다.
//  - 11-4-7(벡터의 성분과 내적)과의 경계: 화살표로 하는 연산(덧셈·뺄셈·실수배, 도형 위에서 벡터를 다른 벡터로 나타내기, AM⃗ = ½(AB⃗ + AC⃗) 꼴,
//    성분 없이 평행 조건과 일차결합의 계수)만 싣는다. 위치벡터를 쓰는 꼴(원점을 시점으로 한 내분점의 위치벡터, 계수의 합이 1인 직선 위의 점,
//    두 선분의 교점), 성분으로 나타낸 벡터, 내적은 11-4-7 몫이다. 세 점이 한 직선 위에 있을 조건은 교과서가 이 단원에서 AC⃗ = kAB⃗ 로 가르치므로
//    풀이도 그렇게만 쓴다(계수의 합이 1이라는 공식을 쓰지 않는다).
//  - 교육과정에 이 성취기준의 내용을 막는 「다루지 않는다」는 없다(적용 시 고려 사항의 「지나치게 복잡한 공간지각력」은 도형의 방정식에 붙은 정도의 말).
//  - 답: 벡터를 두세 벡터로 나타내는 꼴은 「AB⃗ = [±][ ]a⃗ [±][ ]b⃗」처럼 식 속 칸으로 받는다(계수는 정수 — 한 유형 안에서는 칸이 늘 같은 수이고,
//    문제 글 끝에 「계수가 1이면 1, 0이면 0을 적는다」를 붙인다). 계수가 분수인 꼴과 벡터 하나(이름)가 답인 꼴은 고르기로 낸다.
//    크기는 단추 없이 받고 근호가 든 크기는 근호 칸으로 받되, 한 유형 안에서는 칸 모양이 늘 같게 수를 고른다(√n 이면 늘 √n, k√n 이면 늘 k√n).
//    상수는 음수가 될 수 있으면 부호 단추를 단다. 원문의 「m + n의 값」처럼 따로 구한 값을 더한 꼴은 값을 칸마다 따로 받는다.
//  - 그리기(작도) 꼴은 알맞은 화살표를 고르는 문항으로 바꿨다(①2, ①11, ①27, ①9의 ➋). 모눈 위의 벡터는 새로 그렸다(대조표에 「그림 새로 지음」).
//    평가지(소단원·중단원·대단원 평가)는 쪽 그림이 없어 풀이에 남은 값에 맞게 그림을 새로 지었다(①5 대01, ①6 소1-2, ①8 소1-6, ①10, ①21, ①28, ②5, ②15, ②17, ②20~22, ②24 — 대조표에 표시).
//  - 늘 같은 답이 나오던 꼴은 수·방향을 바꿨다: ①23(원문 k는 늘 4 — 대각선의 방향과 세로 모서리를 바꿔 k = ±2, ±4), ②3(무게중심 — 구하는 벡터와 두 벡터를 바꿔 늘 1/3이 되지 않게),
//    ②18(120°에 크기 1 : 2만 있던 것을 90°·60°의 같은 크기까지). 꼴의 성질이라 바꿀 수 없는 것: add-quad(답은 늘 평행사변형).
//  - 답은 모두 코드가 셈한다: 도형의 꼭짓점 좌표로 벡터를 셈해 계수를 구하고(유리수로 바꿔 맞는지 본다), 고르기의 참·거짓도 좌표나 점 이름의 셈으로 가린다.
//  - 검사 근거: 수 칸은 문제에 적힌 수로 다시 셈하는 식(facts.value·calc)이고, 도형에서 나오는 계수처럼 글에 없는 수는 seal 이 facts.unseen 에 밝힌다.
//
// 뺀 것과 까닭(11-4-6b.js, 11-4-6c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 11-4-7 몫(사용자 결정): ②12(대10 — 위치벡터, 계수의 합이 1인 직선 위의 점), ②13(대17·대24 — 두 선분의 교점), ②25(대19 — 원 위의 점 P와 |OP⃗ + 2OA⃗|).
//    1단계에서 넘긴 대09·대18(끝의 크기를 내적으로 구함)·교대12(내분점의 위치벡터로 넓이)도 11-4-7 몫이다.
//  - ②23(중16 — 원 안에서 만나는 두 현의 곱이 같다는 성질을 써야 한다. 2022 중학교는 「원과 비례에 관한 성질」을 다루지 않는다 — 사용자 결정).
//  - 바꾼 것: ②1의 교대05는 도형 위 화살표로 묻는 차례만 실었다. 교마09·교대05·중09·중11·중12의 원문 「m + n」「k + l」은 값을 칸마다(분수면 고르기로).
//    원문 오타 세 곳(교 127쪽 3, 교 127쪽 표현하기, 교마07)은 쪽 그림대로 바로잡아 실었다. 「보이시오」로 실린 평행·한 직선 위 문항은 배수 k를 묻는다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, C, inline } = B.kit;
  const { LAB, MINUS, Q, nb, V, SG, rt, grp, radText, asQ, sqParts, gcd } = B.kit.mid;
  const { Board, at, dist, mid, XY, awayFrom, sv, dirOf } = B.kit.mgeo;
  const { vec, jh, qAns, proj, esc } = B.kit.hs;
  const S1 = '12기하03-01';

  // ── 검사 근거 마무리 ──
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 0과 1과 o.derived 로 밝히기로 한 수(도형에서 나오는 계수 따위)만 된다.
  function seal(item) {
    // 셈이 0으로 끝나는 식은 −0이 될 수 있다. 검사는 −0과 0을 가르므로 +0 을 붙여 0으로 맞춘다.
    if (item.facts && item.facts.calc) item.facts.calc = item.facts.calc.map(([t, i]) => [`(${t})+0`, i]);
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!derived.has(Number(n)) && !out.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다. 다 만든 문항은 seal 로 검사 근거를 마무리한다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 기본 자료(' + ref + ')', make: retry(make) }, more || {});

  // ── 벡터의 셈(좌표) ──
  const S3 = Math.sqrt(3);
  const num = (c) => (typeof c === 'number' ? c : c.p / c.q);
  const vadd = (p, q) => p.map((v, i) => v + q[i]);
  const vsub = (p, q) => p.map((v, i) => v - q[i]);
  const vmul = (k, p) => p.map((v) => k * v);
  const vlin = (cs, vs) => vs[0].map((_, i) => cs.reduce((s, c, j) => s + num(c) * vs[j][i], 0));
  const vlen = (p) => Math.hypot(...p);
  const same = (p, q) => p.every((v, i) => Math.abs(v - q[i]) < 1e-7);
  const isZero = (p) => p.every((v) => Math.abs(v) < 1e-7);
  const parallel = (p, q) => (p.length === 2 ? Math.abs(p[0] * q[1] - p[1] * q[0]) < 1e-7 : isZero([p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]]));
  // 실수를 분모가 작은 유리수로(맞지 않으면 null)
  function rat(x) { for (let q = 1; q <= 36; q += 1) { const p = Math.round(x * q); if (Math.abs(x * q - p) < 1e-6) return Q(p, q); } return null; }
  function solveN(mx, rhs) {
    const n = rhs.length, A = mx.map((row, i) => row.concat([rhs[i]]));
    for (let c = 0; c < n; c += 1) {
      let piv = c; for (let r = c + 1; r < n; r += 1) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
      if (Math.abs(A[piv][c]) < 1e-9) return null;
      [A[c], A[piv]] = [A[piv], A[c]];
      for (let r = 0; r < n; r += 1) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k <= n; k += 1) A[r][k] -= f * A[c][k]; }
    }
    return A.map((row, i) => row[n] / row[i]);
  }
  // target = Σ cᵢ basisᵢ 의 계수(유리수 Q 의 배열). 나타낼 수 없으면 null.
  function coefs(target, basis) {
    const dim = target.length, n = basis.length, rows = [];
    const choose = (start, acc) => { if (acc.length === n) { rows.push(acc); return; } for (let i = start; i < dim; i += 1) choose(i + 1, acc.concat([i])); };
    choose(0, []);
    for (const idx of rows) {
      const sol = solveN(idx.map((i) => basis.map((v) => v[i])), idx.map((i) => target[i]));
      if (!sol) continue;
      if (!same(vlin(sol, basis), target)) return null;
      const qs = sol.map(rat);
      return qs.every(Boolean) ? qs : null;
    }
    return null;
  }
  // 정수 계수만(아니면 null)
  const intCoefs = (target, basis) => { const c = coefs(target, basis); return c && c.every((q) => q.q === 1) ? c.map((q) => q.p + 0) : null; };
  // 도형의 점 좌표(모형)에서 벡터 XY⃗ = Y − X
  const vecOf = (P, xy) => vsub(P[xy[1]], P[xy[0]]);
  const segsOf = (names) => { const out = []; for (const x of names) for (const y of names) if (x !== y) out.push(x + y); return out; };
  const rev = (xy) => xy[1] + xy[0];

  // ── 점 이름의 셈: XY⃗ = (점 Y) − (점 X) ──
  // terms [[계수, 'XY'], …] → { 점: 계수 }
  function formal(terms) {
    const m = {};
    for (const [k, xy] of terms) { m[xy[1]] = (m[xy[1]] || 0) + k; m[xy[0]] = (m[xy[0]] || 0) - k; }
    for (const key of Object.keys(m)) if (!m[key]) delete m[key];
    return m;
  }
  // 영벡터이면 '0', 벡터 하나(k = 1)이면 'XY', 아니면 null
  function asOne(m) {
    const ks = Object.keys(m);
    if (!ks.length) return '0';
    if (ks.length !== 2) return null;
    const pos = ks.find((k) => m[k] === 1), neg = ks.find((k) => m[k] === -1);
    return pos && neg ? neg + pos : null;
  }

  // ── 글 ──
  const vn = (name) => vec(name);
  const ZV = vec('0');
  const coefH = (c) => { const q = asQ(c), a = Math.abs(q.p); return a === q.q ? '' : q.q === 1 ? String(a) : frac(a, q.q); };
  // 일차결합의 글: lcH([2, -1, Q(1, 3)], ['a', 'b', 'c']) → 2a⃗ − b⃗ + ⅓c⃗ (0인 항은 빼고, 모두 0이면 영벡터)
  function lcH(cs, names) {
    let out = '';
    cs.forEach((c, i) => {
      const q = asQ(c); if (!q.p) return;
      const neg = q.p < 0;
      out += (out ? (neg ? ' ' + MINUS + ' ' : ' + ') : (neg ? MINUS : '')) + coefH(q) + vn(names[i]);
    });
    return out || ZV;
  }
  // { 점: 계수 } 를 k·XY⃗ 꼴 글로(영벡터 포함). 꼴이 맞지 않으면 null
  function formalH(m) {
    const ks = Object.keys(m);
    if (!ks.length) return ZV;
    if (ks.length !== 2 || m[ks[0]] !== -m[ks[1]]) return null;
    const pos = ks.find((k) => m[k] > 0), neg = ks.find((k) => m[k] < 0), k = m[pos];
    return (k === 1 ? '' : String(k)) + vn(neg + pos);
  }
  // 부호가 붙은 항들의 식: [[1, 'AB'], [-1, 'CB']] → AB⃗ − CB⃗
  const termsH = (terms) => terms.map(([k, xy], i) => (i ? (k > 0 ? ' + ' : ' ' + MINUS + ' ') : (k > 0 ? '' : MINUS)) + vn(xy)).join('');
  const jsn = (c) => (c < 0 ? `(${c})` : String(c));
  // 화면에 적는 정수(음수는 −), 괄호에 넣은 음수, 벡터 앞의 계수(1은 적지 않고 −1은 −만)
  const sn = (x) => (x < 0 ? MINUS + Math.abs(x) : String(x));
  const pn = (x) => (x < 0 ? '(' + MINUS + Math.abs(x) + ')' : String(x));
  const kx = (k) => (k === 1 ? '' : k === -1 ? MINUS : sn(k));
  const ab = [vec('a'), vec('b')], abc = [vec('a'), vec('b'), vec('c')];
  const vlist = (h) => nb(h.join(', '));
  // 절댓값 기호로 둘러싼 크기(줄이 갈리지 않게)
  const absH = (h) => nb('|' + h + '|');
  const sqf = (n) => n >= 2 && sqParts(n)[0] === 1;
  const attr = (t) => esc(t).replace(/"/g, '&quot;');
  const LENS = (name, v) => nb(`${SG(name)} = ${v}`);

  // ── 답 ──
  // 벡터를 두세 벡터로 나타내는 답: 「lhs = [±][ ]a⃗ [±][ ]b⃗ …」(계수는 정수). facts.calc 는 칸마다의 계수(도형에서 나오는 수는 derived 로 밝힌다).
  const ZNOTE = ' (단, 계수가 1이면 1, 0이면 0을 적는다.)';
  function lcAns(text, lhs, cs, names, o) {
    const opt = o || {}, cells = names.map((nm, i) => grp(`{${i}}${vn(nm)}`)).join(' ');
    return inline(text + ZNOTE, (lhs ? nb(`${lhs} =`) + ' ' : '') + cells, cs.map((c) => ({ answer: c, signed: true })), Object.assign({}, opt, {
      shown: (lhs ? `${lhs} = ` : '') + lcH(cs, names),
      facts: Object.assign({ calc: cs.map((c, i) => [jsn(c), i]), derived: cs.map((c) => Math.abs(c)) }, opt.facts || {})
    }));
  }
  // 길이(크기): k√q 꼴(q = 1 이면 수 칸). 단추 없이 받는다. 한 유형 안에서는 칸 모양이 늘 같게 부르는 쪽에서 수를 고른다.
  function lenAns(text, k, q, o) {
    const opt = o || {}, unit = opt.unit ? ' ' + opt.unit : '';
    if (q === 1) return N(text, k, Object.assign({}, opt));
    if (k === 1) return inline(text, rt('{0}') + unit, [{ answer: q }], Object.assign({}, opt, { shown: radText(1, q) + unit }));
    return inline(text, grp('{0}' + rt('{1}')) + unit, [{ answer: k }, { answer: q }], Object.assign({}, opt, { shown: radText(k, q) + unit }));
  }
  // 값이 음수일 수 있는 수(늘 부호 단추)
  const numA = (text, v, o) => qAns(text, v, Object.assign({ signed: true }, o));

  // ── 고르기 ──
  // rows = [{ h, ok }]: ok 가 참인 것이 꼭 하나. 보기를 섞어 고르기 문항으로(o.keep 이면 차례 그대로).
  function pickOne(d, text, rows, o) {
    if (rows.filter((r) => r.ok).length !== 1 || new Set(rows.map((r) => stripH(r.h))).size !== rows.length) return null;
    const list = o && o.keep ? rows : d.shuffle(rows);
    const opt = Object.assign({}, o); delete opt.keep;
    return C(text, list.map((r) => r.h), list.findIndex((r) => r.ok), Object.assign(opt, { facts: Object.assign({ truth: list.map((r) => r.ok), want: true }, (o && o.facts) || {}) }));
  }
  // ㄱ, ㄴ, ㄷ(, ㄹ) 가운데 맞는 것을 「있는 대로 고른 것」: 보기 다섯(정답 포함). flags 는 하나 이상 참.
  const GA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
  function comboPick(d, text, labels, flags, o) {
    const n = flags.length, right = flags.map((f, i) => (f ? i : -1)).filter((i) => i >= 0), all = [];
    if (!right.length) return null;
    for (let m = 1; m < (1 << n); m += 1) all.push([...Array(n).keys()].filter((i) => m & (1 << i)));
    const key = (c) => c.join(','), others = d.shuffle(all.filter((c) => key(c) !== key(right))).slice(0, 4);
    const rows = others.concat([right]).sort((u, v) => u.length - v.length || key(u).localeCompare(key(v)));
    return C(text, rows.map((c) => c.map((i) => labels[i]).join(', ')), rows.findIndex((c) => key(c) === key(right)), Object.assign({}, o, { facts: { truth: rows.map((c) => key(c) === key(right)), want: true } }));
  }

  // ── 그림 ──
  const BLUE = '#1d4ed8', INK = '#1f2933', GRID = 'stroke:#cbd5e1;stroke-width:0.8';
  const avg = (ps) => [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length];
  const pairs = (s) => String(s || '').split(/\s+/).filter(Boolean);
  // 화살표(화면 좌표 p → q, 끝에 채운 화살촉)
  function arrowTo(b, p, q, color, w) {
    const L = dist(p, q) || 1, ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L, base = [q[0] - ux * 8, q[1] - uy * 8], c = color || BLUE;
    b.seg(p, base, null, `stroke:${c};stroke-width:${w || 2}`);
    const l = [base[0] - uy * 3.6, base[1] + ux * 3.6], r = [base[0] + uy * 3.6, base[1] - ux * 3.6];
    b.shape(`M${XY(q)}L${XY(l)}L${XY(r)}Z`, [q, l, r], `fill:${c};stroke:none`);
  }
  // 그림 속 벡터의 이름: 기울인 글자 위에 작은 화살표
  function vname(b, p, letter) {
    b.text(p, sv(letter));
    const y = p[1] - 9.5, x0 = p[0] - 3.5, x1 = p[0] + 4.5;
    b.seg([x0, y], [x1, y], 'thin', `stroke:${INK};stroke-width:1`);
    b.shape(`M${XY([x1 + 2.6, y])}L${XY([x1, y - 1.8])}L${XY([x1, y + 1.8])}Z`, [[x1 + 2.6, y]], `fill:${INK};stroke:none`);
  }
  // 도형 그림. pts { A: 좌표 }, P 는 좌표 → 화면 점. o.edges 실선, o.thin 가는 선, o.dash 점선('AB CD'), o.arrows [[시점, 종점, 글자, 'in'?]](파란 화살표),
  //  o.dots 점을 찍을 이름, o.names 이름을 적을 점(기본: 모두), o.at { 이름: 각 }, o.lens [[점, 점, 글]](변 옆의 길이), o.say 그림 설명
  // 점 c 에서 선분 pq 까지의 거리
  const segDist = (c, p, q) => { const L2 = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 || 1, t = Math.max(0, Math.min(1, ((c[0] - p[0]) * (q[0] - p[0]) + (c[1] - p[1]) * (q[1] - p[1])) / L2)); return dist(c, [p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); };
  // 점 v 에 닿은 선분들의 방향(점이 선분의 가운데에 있으면 두 방향)
  const dirsAt = (v, segs) => { const out = []; for (const [p, q] of segs) { if (dist(p, v) < 0.6) out.push(dirOf(v, q)); else if (dist(q, v) < 0.6) out.push(dirOf(v, p)); else if (segDist(v, p, q) < 0.6) out.push(dirOf(v, p), dirOf(v, q)); } return out; };
  function drawFig(o, P) {
    const b = Board(), pts = o.pts, pt = (x) => (typeof x === 'string' ? pts[x] : x), drawn = [], labels = [];
    const cen = o.center ? P(o.center) : avg(Object.keys(pts).map((n) => P(pts[n])));
    const line = (x, y, kind) => { const p = P(pt(x)), q = P(pt(y)); b.seg(p, q, kind); drawn.push([p, q]); };
    if (o.fill) b.poly(o.fill.split('').map((n) => P(pts[n])), 'fill:rgba(37,99,235,0.07)');
    for (const e of pairs(o.dash)) line(e[0], e[1], 'cut');
    for (const e of pairs(o.thin)) line(e[0], e[1], 'thin');
    for (const e of pairs(o.edges)) line(e[0], e[1]);
    const named = (o.names || Object.keys(pts)).map((nm) => P(pts[nm]));
    for (const [f, t, letter, side] of o.arrows || []) {
      const p = P(pt(f)), q = P(pt(t));
      arrowTo(b, p, q); drawn.push([p, q]);
      if (!letter) continue;
      const L = dist(p, q) || 1;
      let nrm = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
      const m0 = mid(p, q), toward = (cen[0] - m0[0]) * nrm[0] + (cen[1] - m0[1]) * nrm[1] > 0;
      if (side === 'in' ? !toward : toward) nrm = [-nrm[0], -nrm[1]];
      // 자리 후보: 가운데의 바깥쪽 → 안쪽 → 앞뒤로 비킨 자리. 다른 벡터 글자(16px)·점 이름 자리(15px)와 떨어진 첫 자리.
      const cands = [];
      for (const tt of [0.5, 0.36, 0.64]) for (const sg of [1, -1]) { const m = mid(p, q, tt); cands.push([m[0] + nrm[0] * 11 * sg, m[1] + nrm[1] * 11 * sg]); }
      const ok = (c) => labels.every((u) => dist(u, c) >= 16) && named.every((u) => dist(u, c) >= 15);
      const at0 = cands.find(ok) || cands[0];
      labels.push(at0); vname(b, at0, letter);
    }
    for (const nm of o.dots || []) b.dot(P(pts[nm]));
    for (const nm of o.names || Object.keys(pts)) {
      const v = P(pts[nm]);
      if (o.at && o.at[nm] != null) { b.name(v, nm, o.at[nm]); continue; }
      const dirs = dirsAt(v, drawn);
      if (dirs.length) b.nameFree(v, nm, dirs); else b.name(v, nm, awayFrom(v, [cen]));
    }
    for (const [p, q, label] of o.lens || []) b.beside(P(pt(p)), P(pt(q)), label, cen);
    return b.svg(attr(o.say));
  }
  const fig2 = (o) => drawFig(o, (p) => [p[0] * (o.u || 40), -p[1] * (o.u || 40)]);
  const fig3 = (o) => drawFig(o, (p) => proj(p, o.view));
  // 모눈 그림: cols × rows 칸(한 칸 g px). arrows [{ p, q, name, tag }](모눈 좌표 — 왼쪽 아래가 [0, 0], 위로 커진다. tag 는 이름을 적을 모눈 좌표),
  //  dots [{ p, name, at }]. 그림 설명 o.say.
  function gridFig(o) {
    const g = o.g || 16, b = Board(), P = (p) => [p[0] * g, -p[1] * g];
    for (let i = 0; i <= o.cols; i += 1) b.seg(P([i, 0]), P([i, o.rows]), 'thin', GRID);
    for (let j = 0; j <= o.rows; j += 1) b.seg(P([0, j]), P([o.cols, j]), 'thin', GRID);
    for (const a of o.arrows || []) {
      const p = P(a.p), q = P(a.q);
      arrowTo(b, p, q, a.color);
      if (a.name && a.tag) vname(b, P(a.tag), a.name);
      else if (a.name) { const m = mid(p, q), L = dist(p, q) || 1, s = a.side || 1; vname(b, [m[0] - (q[1] - p[1]) / L * 10 * s, m[1] + (q[0] - p[0]) / L * 10 * s], a.name); }
    }
    const dots = o.dots || [], arr = (o.arrows || []).map((a) => [P(a.p), P(a.q)]);
    for (const t of dots) {
      b.dot(P(t.p));
      if (!t.name) continue;
      const v = P(t.p), others = dots.filter((u) => u !== t).map((u) => P(u.p));
      const score = (ang) => { const c = at(v, 10, ang); return Math.min(...arr.map(([p, q]) => segDist(c, p, q)), ...others.map((u) => dist(u, c)), 99); };
      const best = t.at != null ? t.at : [45, 135, 225, 315, 90, 0, 180, 270].reduce((x, y) => (score(y) > score(x) + 0.5 ? y : x));
      b.name(v, t.name, best, 10);
    }
    return b.svg(attr(o.say));
  }
  // 작은 그림 여럿(㉠, ㉡, …)
  const panels = (figs) => '<div style="display:flex;flex-wrap:wrap;gap:8px 14px;justify-content:center">' + figs.map((f, i) => `<div style="text-align:center"><div style="font-weight:700">${LAB[i]}</div>${f}</div>`).join('') + '</div>';
  // 모눈에서 움직인 칸: [3, -2] → 오른쪽으로 3칸, 아래로 2칸
  const move = ([x, y]) => [x ? `${x > 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(x)}칸` : '', y ? `${y > 0 ? '위' : '아래'}로 ${Math.abs(y)}칸` : ''].filter(Boolean).join(', ');
  // 모눈 위에 벡터 하나를 가운데에 놓는 시점
  const centerStart = (v, cols, rows) => [Math.floor((cols - v[0]) / 2), Math.floor((rows - v[1]) / 2)];
  // 화살표 이름을 적을 자리: 화살표의 위쪽 끝보다 조금 위(모눈 좌표)
  const topTag = (s, v) => [s[0] + v[0] / 2, Math.max(s[1], s[1] + v[1]) + 0.8];

  // ── 도형 모형(한 변 1, 수학 좌표) ──
  // 정육각형 ABCDEF(교과서 그림: A 왼쪽 위, B 왼쪽, C 왼쪽 아래, D 오른쪽 아래, E 오른쪽, F 오른쪽 위), 세 대각선의 교점 O
  const HEX = { A: [-0.5, S3 / 2], B: [-1, 0], C: [-0.5, -S3 / 2], D: [0.5, -S3 / 2], E: [1, 0], F: [0.5, S3 / 2], O: [0, 0] };
  const HEX_EDGES = 'AB BC CD DE EF FA';
  // 평행사변형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위), 두 대각선의 교점 O
  const PARA = { A: [-1.3, 0.75], B: [-0.7, -0.75], C: [1.3, -0.75], D: [0.7, 0.75], O: [0, 0] };
  // 정삼각형 ABC 와 세 변 AB, BC, CA 의 중점 D, E, F
  const TRI = { A: [0, S3], B: [-1, 0], C: [1, 0], D: [-0.5, S3 / 2], E: [0, 0], F: [0.5, S3 / 2] };
  // 직육면체 ABCD-EFGH(교과서 그림: 윗면 ABCD — A 앞 왼쪽, B 앞 오른쪽, C 뒤 오른쪽, D 뒤 왼쪽, E·F·G·H 는 A·B·C·D 아래). AB = w, AD = dd, AE = h.
  //  공간 좌표 [앞쪽, 오른쪽, 위쪽] — proj 는 앞쪽을 왼쪽 아래로 그린다. 숨은 꼭짓점은 H.
  const box = (w, dd, h) => ({ A: [dd, 0, h], B: [dd, w, h], C: [0, w, h], D: [0, 0, h], E: [dd, 0, 0], F: [dd, w, 0], G: [0, w, 0], H: [0, 0, 0] });
  const BOX_EDGES = 'AB BC CD DA EF FG AE BF CG', BOX_HID = 'GH HE DH';
  // 정사면체 OABC(교과서 그림: O 위, A 왼쪽, B 앞, C 오른쪽 — 모서리 AC 가 숨는다), 한 모서리 2
  const TET = { O: [0, 0, 2 * Math.sqrt(2 / 3)], A: [-1 / S3, -1, 0], B: [2 / S3, 0, 0], C: [-1 / S3, 1, 0] };
  const TET_VIEW = { u: 52, k: 0.55, ang: 270 };
  // 정팔면체(교과서 그림: A 위, F 아래, 가운데 B 왼쪽·C 앞·D 오른쪽·E 뒤 — E 에 모인 모서리가 숨는다), 한 모서리 √2
  const OCT = { A: [0, 0, 1], B: [0, -1, 0], C: [1, 0, 0], D: [0, 1, 0], E: [-1, 0, 0], F: [0, 0, -1] };
  const OCT_VIEW = { u: 58, k: 0.55, ang: 315 };
  const OCT_EDGES = 'AB AC AD BC CD BF CF DF', OCT_HID = 'AE BE DE EF';
  const OPP = { A: 'F', F: 'A', B: 'D', D: 'B', C: 'E', E: 'C' };
  // 한 점(origin)을 시점으로 한 벡터의 계수로 XY⃗ 를 풀어 적는 풀이 글: XY⃗ = (origin)Y⃗ − (origin)X⃗
  function viaOrigin(xy, origin, cof, names) {
    const part = (p) => (p === origin ? null : lcH(cof(p), names));
    const a = part(xy[0]), b = part(xy[1]), total = lcH(cof(xy[1]).map((c, i) => c - (xy[0] === origin ? 0 : cof(xy[0])[i])), names);
    if (xy[0] === origin) return `${vn(xy)} = ${total}`;
    if (xy[1] === origin) return `${vn(xy)} = ${MINUS}${vn(origin + xy[0])} = ${total}`;
    return `${vn(xy)} = ${vn(origin + xy[1])} ${MINUS} ${vn(origin + xy[0])} = (${b}) ${MINUS} (${a}) = ${total}`;
  }

  // ══ 가. 벡터의 뜻 ══
  const mean = [
    // ①1 크기만 가지는 양(스칼라)과 크기와 방향을 함께 가지는 양(벡터). 속력은 늘 넣어 속도와 가르게 한다.
    T('mean-kind', '크기만 가지는 양과 크기와 방향을 함께 가지는 양', '①1', (d) => {
      const nv = d.int(1, 3), vs = d.shuffle(['속도', '가속도', '힘']).slice(0, nv);
      const ss = ['속력'].concat(d.shuffle(['길이', '넓이', '질량', '부피', '밀도', '온도', '시간']).slice(0, 3 - nv));
      const items = d.shuffle(vs.concat(ss)), wantVec = d.bool();
      return comboPick(d, `다음 중 ${wantVec ? '크기와 방향을 함께 가지는' : '크기만 가지는'} 양을 있는 대로 고른 것은?`, GA, items.map((w) => vs.includes(w) === wantVec), {
        figure: lines(items.map((w, i) => `<b>${GA[i]}.</b> ${w}`)),
        explain: '속도·가속도·힘은 크기와 방향을 함께 가지는 양(벡터)이고, 속력·길이·넓이·질량·부피·밀도·온도·시간은 크기만 가지는 양이다. 속력은 빠르기만, 속도는 빠르기와 방향을 함께 나타낸다.' });
    }),

    // ①2 두 점을 잇는 벡터(작도 → 알맞은 화살표 고르기). 모눈 위의 세 점은 새로 지었다.
    T('mean-draw', '두 점을 잇는 벡터를 나타낸 화살표 고르기', '①2', (d) => {
      const P = d.until(() => [0, 1, 2].map(() => [d.int(0, 5), d.int(0, 4)]), (ps) => {
        const [a, b, c] = ps, cr = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
        return Math.abs(cr) >= 3 && ps.every((p, i) => ps.every((q, j) => i === j || Math.hypot(p[0] - q[0], p[1] - q[1]) >= 2.2));
      });
      const names = ['A', 'B', 'C'], [x, y, z] = d.shuffle([0, 1, 2]);
      const list = d.shuffle([[x, y, true], [y, x, false], [x, z, false], [z, y, false]]);
      const where = (p) => `오른쪽으로 ${p[0]}칸, 위로 ${p[1]}칸`;
      const dots = P.map((p, i) => ({ p, name: names[i] }));
      const said = `왼쪽 아래 꼭짓점에서 점 A는 ${where(P[0])}, 점 B는 ${where(P[1])}, 점 C는 ${where(P[2])} 간 곳에 있다.`;
      const figs = list.map(([s, t]) => gridFig({ cols: 5, rows: 4, g: 18, dots, arrows: [{ p: P[s], q: P[t] }], say: `모눈 위의 세 점. ${said} 화살표의 시점은 왼쪽 아래 꼭짓점에서 ${where(P[s])}, 종점은 ${where(P[t])} 간 곳이다.` }));
      const XYn = names[x] + names[y];
      return C(`세 점 A, B, C가 모눈 위에 있다. 벡터 ${jh(vec(XYn), '을/를')} 화살표로 바르게 나타낸 것은?`, LAB.slice(0, 4), list.findIndex((c) => c[2]), {
        figure: panels(figs),
        explain: `벡터 ${jh(vec(XYn), '은/는')} 시점이 ${names[x]}, 종점이 ${jh(names[y], '이므로/이므로')} 점 ${names[x]}에서 점 ${names[y]}로 향하는 화살표이다. 시점과 종점을 바꾼 화살표는 ${jh(vec(rev(XYn)), '을/를')} 나타낸다.`,
        facts: { truth: list.map((c) => c[2]), want: true } });
    }),

    // ①3 직사각형에서 변·대각선 벡터의 크기(대각선은 늘 √n — 칸 모양을 같게)
    T('mean-rect', '직사각형에서 벡터의 크기', '①3', (d) => {
      const p = d.int(1, 5), q = d.int(2, 6), n = p * p + q * q;
      if (p === q || !sqf(n)) return null;
      const P = { A: [0, p], B: [0, 0], C: [q, 0], D: [q, p] };
      const [e, len] = d.pick([['CD', p], ['DC', p], ['BC', q], ['CB', q], ['DA', q]]), g = d.pick(['AC', 'CA', 'BD', 'DB']);
      const u = Math.min(150 / q, 95 / p);
      const figure = fig2({ u, pts: P, edges: 'AB BC CD DA', arrows: [[e[0], e[1]], [g[0], g[1]]], lens: [['A', 'B', String(p)], ['A', 'D', String(q)]],
        say: `직사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위). 선분 AB의 길이 ${p}, 선분 AD의 길이 ${q}. 벡터 ${e}와 ${g}를 화살표로 그렸다.` });
      const tpl = nb(`|${vec(e)}| = {0}`) + ', ' + nb(`|${vec(g)}| = ` + rt('{1}'));
      return inline(`${LENS('AB', p)}, ${LENS('AD', q)}인 직사각형 ABCD에서 두 벡터 ${vec(e)}, ${vec(g)}의 크기를 차례로 구하시오.`, tpl, [{ answer: len }, { answer: n }], {
        figure, shown: nb(`|${vec(e)}| = ${len}`) + ', ' + nb(`|${vec(g)}| = ${radText(1, n)}`),
        explain: `벡터의 크기는 선분의 길이와 같다. |${vec(e)}| = ${SG(e)} = ${len}이다. 선분 ${jh(g, '은/는')} 직각삼각형의 빗변이므로 피타고라스 정리에 의하여 |${vec(g)}| = ${rt(`${p}<sup>2</sup> + ${q}<sup>2</sup>`)} = ${rt(n)}이다.`,
        facts: { calc: [[String(len), 0], [`${p}*${p}+${q}*${q}`, 1]] } });
    }),

    // ①3(교 118쪽 보기) 단위벡터 가리기: 한 변의 길이가 1인 정사각형
    T('mean-unit', '정사각형에서 단위벡터 가리기', '①3', (d) => {
      const P = { A: [0, 1], B: [0, 0], C: [1, 0], D: [1, 1] };
      const sides = ['AB', 'BA', 'BC', 'CB', 'CD', 'DC', 'DA', 'AD'], diags = ['AC', 'CA', 'BD', 'DB'], wantUnit = d.bool();
      const rows = wantUnit ? [{ h: vec(d.pick(sides)), ok: true }].concat(diags.map((s) => ({ h: vec(s), ok: false })))
        : d.shuffle(sides).slice(0, 4).map((s) => ({ h: vec(s), ok: false })).concat([{ h: vec(d.pick(diags)), ok: true }]);
      return pickOne(d, `한 변의 길이가 1인 정사각형 ABCD에서 다음 중 단위벡터${wantUnit ? '인' : '가 아닌'} 것은?`, rows, {
        figure: fig2({ u: 90, pts: P, edges: 'AB BC CD DA', lens: [['A', 'B', '1']], say: '한 변의 길이가 1인 정사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위).' }),
        explain: `크기가 1인 벡터가 단위벡터이다. 변을 나타내는 벡터의 크기는 1이고, 대각선을 나타내는 벡터의 크기는 ${rt('1<sup>2</sup> + 1<sup>2</sup>')} = ${rt(2)}이다.` });
    }),

    // ①4 직육면체에서 모서리·면의 대각선·대각선 벡터의 크기(√ 둘은 늘 √n)
    T('mean-box', '직육면체에서 벡터의 크기', '①4', (d) => {
      const w = d.int(2, 5), dd = d.int(2, 4), h = d.int(1, 5);
      if (new Set([w, dd, h]).size < 3) return null;
      const faces = [['AC', w, dd], ['BD', w, dd], ['EG', w, dd], ['FH', w, dd], ['AF', w, h], ['BE', w, h], ['DG', w, h], ['CH', w, h], ['AH', dd, h], ['DE', dd, h], ['BG', dd, h], ['CF', dd, h]];
      const [fc, f1, f2] = d.pick(faces), sp = d.pick(['AG', 'BH', 'CE', 'DF', 'GA', 'HB', 'EC', 'FD']);
      const [e, el] = d.pick([['DH', h], ['CG', h], ['FB', h], ['HD', h], ['FG', dd], ['EH', dd], ['CB', dd], ['GH', w], ['HG', w], ['DC', w], ['FE', w]]);
      const nf = f1 * f1 + f2 * f2, ns = w * w + dd * dd + h * h;
      if (!sqf(nf) || !sqf(ns)) return null;
      const figure = fig3({ view: { u: 24, k: 0.8, ang: 220 }, pts: box(w, dd, h), edges: BOX_EDGES, dash: BOX_HID, lens: [['A', 'B', String(w)], ['A', 'D', String(dd)], ['A', 'E', String(h)]],
        say: `직육면체 ABCD-EFGH(윗면 ABCD — A 앞 왼쪽, B 앞 오른쪽, C 뒤 오른쪽, D 뒤 왼쪽, E·F·G·H는 A·B·C·D의 아래). 모서리 AB의 길이 ${w}, AD의 길이 ${dd}, AE의 길이 ${h}.` });
      const tpl = nb(`|${vec(e)}| = {0}`) + ', ' + nb(`|${vec(fc)}| = ` + rt('{1}')) + ', ' + nb(`|${vec(sp)}| = ` + rt('{2}'));
      return inline(`${LENS('AB', w)}, ${LENS('AD', dd)}, ${LENS('AE', h)}인 직육면체 ABCD-EFGH에서 세 벡터 ${vec(e)}, ${vec(fc)}, ${vec(sp)}의 크기를 차례로 구하시오.`, tpl, [{ answer: el }, { answer: nf }, { answer: ns }], {
        figure, shown: [nb(`|${vec(e)}| = ${el}`), nb(`|${vec(fc)}| = ${radText(1, nf)}`), nb(`|${vec(sp)}| = ${radText(1, ns)}`)].join(', '),
        explain: `|${vec(e)}|는 모서리 ${e}의 길이 ${el}이다. 면의 대각선 ${fc}는 두 변이 ${f1}, ${f2}인 직사각형의 대각선이므로 |${vec(fc)}| = ${rt(nf)}이다. 대각선 ${sp}는 밑면의 대각선과 높이를 두 변으로 하는 직각삼각형의 빗변이므로 |${vec(sp)}| = ${rt(`${w}<sup>2</sup> + ${dd}<sup>2</sup> + ${h}<sup>2</sup>`)} = ${rt(ns)}이다.`,
        facts: { calc: [[String(el), 0], [`${f1}*${f1}+${f2}*${f2}`, 1], [`${w}*${w}+${dd}*${dd}+${h}*${h}`, 2]] } });
    }),

    // ①5 정육각형(차례 1)·정삼각형 세 개를 이어 붙인 도형(차례 2)에서 벡터의 크기 — 답은 늘 k√3(k ≥ 2)
    T('mean-hex', '정육각형·이어 붙인 정삼각형에서 벡터의 크기', '①5', (d, n) => {
      const s = d.int(2, 6);
      if (n === 0) {
        const t = d.pick(['BF', 'FB', 'AC', 'CA', 'BD', 'DB', 'CE', 'EC', 'DF', 'FD', 'EA', 'AE']);
        const figure = fig2({ u: 52, pts: HEX, names: 'ABCDEF'.split(''), edges: HEX_EDGES, arrows: [[t[0], t[1]]], lens: [['A', 'B', String(s)]],
          say: `한 변의 길이가 ${s}인 정육각형 ABCDEF(A 왼쪽 위, B 왼쪽, C 왼쪽 아래, D 오른쪽 아래, E 오른쪽, F 오른쪽 위). 벡터 ${t}를 화살표로 그렸다.` });
        return lenAns(`한 변의 길이가 ${s}인 정육각형 ABCDEF에서 벡터 ${vec(t)}의 크기는?`, s, 3, {
          figure, explain: `꼭짓점 ${t[0]}, ${t[1]} 사이의 꼭짓점에서 선분 ${t}에 수선을 내리면 선분 ${t}는 이등분되고, 내각이 120°이므로 반쪽의 길이는 ${s} × sin 60° = ${frac(s + rt(3), 2)}이다. 따라서 |${vec(t)}| = ${s}${rt(3)}이다.`,
          facts: { calc: [[String(s), 0], ['3', 1]], derived: [3] } });
      }
      const Pp = { B: [0, 0], C: [2, 0], D: [4, 0], A: [1, S3], E: [3, S3] };
      const t = d.pick(['BE', 'EB', 'AD', 'DA']), side = t.includes('B') ? 'AC' : 'CE';
      const figure = fig2({ u: 34, pts: Pp, edges: 'AB BC CD DE EA AC CE', arrows: [[t[0], t[1]]], lens: [['B', 'C', String(s)]],
        say: `한 변의 길이가 ${s}인 정삼각형 ABC, ACE, CDE를 이어 붙인 도형(B, C, D가 아래쪽에 한 줄로, A, E가 위쪽). 벡터 ${t}를 화살표로 그렸다.` });
      return lenAns(`그림은 한 변의 길이가 ${s}인 정삼각형 세 개를 이어 붙여 만든 도형이다. 벡터 ${vec(t)}의 크기는?`, s, 3, {
        figure, explain: `선분 ${side}의 중점을 M이라 하면 ${t[0]}, M, ${jh(t[1], '이/가')} 한 직선 위에 있고, 정삼각형의 높이는 ${frac(s + rt(3), 2)}이다. 따라서 |${vec(t)}| = 2 × ${frac(s + rt(3), 2)} = ${s}${rt(3)}이다.`,
        facts: { calc: [[String(s), 0], ['3', 1]], derived: [3] } });
    }, { count: 2 }),

    // ①6 평면에서 같은 벡터·반대 벡터: 차례 1 삼각형의 중점(교 118쪽·중02), 차례 2 모눈 위의 벡터(소1-2 — 그림 새로 지음)
    T('mean-equal2d', '평면도형·모눈에서 같은 벡터 찾기', '①6', (d, n) => {
      if (n === 0) {
        const all = segsOf('ABCDEF'.split('')).filter((s) => vlen(vecOf(TRI, s)) < 1.01 && vlen(vecOf(TRI, s)) > 0.99);
        const t = d.pick(all), tv = vecOf(TRI, t);
        const eq = all.filter((s) => s !== t && same(vecOf(TRI, s), tv)), right = d.pick(eq);
        const wrong = d.shuffle(all.filter((s) => s !== t && !same(vecOf(TRI, s), tv)));
        const pick = [rev(right), rev(t)].concat(wrong.filter((s) => s !== rev(right) && s !== rev(t)).slice(0, 2));
        return pickOne(d, `삼각형 ABC에서 세 변 AB, BC, CA의 중점을 각각 D, E, F라고 할 때, 다음 중 벡터 ${jh(vec(t), '과/와')} 같은 벡터는?`,
          [{ h: vec(right), ok: true }].concat(pick.map((s) => ({ h: vec(s), ok: same(vecOf(TRI, s), tv) }))), {
            figure: fig2({ u: 62, pts: TRI, edges: 'AB BC CA', thin: 'DE EF FD', say: '삼각형 ABC와 세 변 AB, BC, CA의 중점 D, E, F를 이은 선분.' }),
            explain: `삼각형의 두 변의 중점을 이은 선분은 나머지 변과 평행하고 그 길이는 절반이다. 그래서 ${jh(vec(t), '과/와')} 크기와 방향이 같은 벡터는 ${jh(vec(right), '이고/이고')}, 시점과 종점이 바뀐 벡터는 방향이 반대이다.` });
      }
      const a = d.until(() => [d.int(-3, 3), d.int(-3, 3)], (v) => v[0] !== 0 && v[1] !== 0);
      const wantNeg = d.bool(), goal = wantNeg ? vmul(-1, a) : a;
      const cand = [vmul(-1, goal), [goal[0], goal[1] + (goal[1] > 0 ? -1 : 1)], [goal[0] + (goal[0] > 0 ? -1 : 1), goal[1]], [-goal[1], goal[0]], [goal[1], goal[0]]]
        .filter((v) => (v[0] || v[1]) && Math.abs(v[0]) <= 3 && Math.abs(v[1]) <= 3 && !same(v, goal));
      const uniq = []; for (const v of cand) if (!uniq.some((u) => same(u, v))) uniq.push(v);
      if (uniq.length < 3) return null;
      const vs = d.shuffle([goal].concat(d.shuffle(uniq).slice(0, 3))), letters = ['b', 'c', 'd', 'e'];
      const all = [a].concat(vs), arrows = all.map((v, i) => {
        const x0 = 4 * i + (v[0] >= 0 ? 0 : -v[0]), y0 = v[1] >= 0 ? d.int(0, 4 - v[1]) : d.int(-v[1], 4);
        return { p: [x0, y0], q: [x0 + v[0], y0 + v[1]], name: ['a'].concat(letters)[i], tag: [4 * i + 1.5, 4.9] };
      });
      const figure = gridFig({ cols: 19, rows: 4, g: 13, arrows, say: '모눈 위의 다섯 벡터: ' + all.map((v, i) => `${['a'].concat(letters)[i]}는 ${move(v)}`).join(' / ') + '.' });
      const at0 = vs.findIndex((v) => same(v, goal));
      return pickOne(d, `모눈 위의 다섯 벡터 가운데 벡터 ${wantNeg ? MINUS : ''}${jh(vec('a'), '과/와')} 같은 벡터는?`, letters.map((l, i) => ({ h: vec(l), ok: i === at0 })), {
        keep: true, figure,
        explain: `같은 벡터는 크기와 방향이 모두 같다. ${vec('a')}는 ${move(a)} 가는 벡터이므로 ${wantNeg ? MINUS + vec('a') + '는 ' + move(goal) + ' 가는 벡터이고, ' : ''}그와 같은 것은 ${vec(letters[at0])}이다.` });
    }, { count: 2 }),

    // ①7 입체도형에서 같은 벡터(차례 1 직육면체), 크기가 같고 방향이 반대인 벡터(차례 2 정팔면체 — 시점·종점만 바꾼 것은 보기에 넣지 않는다)
    T('mean-equal3d', '입체도형에서 같은 벡터·방향이 반대인 벡터 찾기', '①7', (d, n) => {
      if (n === 0) {
        const w = d.int(2, 4), dd = d.int(2, 4), h = d.int(2, 4);
        if (new Set([w, dd, h]).size < 3) return null;
        const P = box(w, dd, h), segs = segsOf('ABCDEFGH'.split('')), kind = (s) => vecOf(P, s).filter((v) => Math.abs(v) > 1e-9).length;
        const t = d.pick(segs.filter((s) => kind(s) <= 2)), tv = vecOf(P, t);
        const eq = segs.filter((s) => s !== t && same(vecOf(P, s), tv)), right = d.pick(eq);
        const pool = d.shuffle(segs.filter((s) => s !== t && !same(vecOf(P, s), tv) && (Math.abs(vlen(vecOf(P, s)) - vlen(tv)) < 1e-9 || parallel(vecOf(P, s), tv))));
        if (pool.length < 4) return null;
        return pickOne(d, `직육면체 ABCD-EFGH에서 다음 중 벡터 ${jh(vec(t), '과/와')} 같은 벡터는?`, [{ h: vec(right), ok: true }].concat(pool.slice(0, 4).map((s) => ({ h: vec(s), ok: false }))), {
          figure: fig3({ view: { u: 24, k: 0.6, ang: 225 }, pts: P, edges: BOX_EDGES, dash: BOX_HID, say: '직육면체 ABCD-EFGH(윗면 ABCD — A 앞 왼쪽, B 앞 오른쪽, C 뒤 오른쪽, D 뒤 왼쪽, E·F·G·H는 A·B·C·D의 아래).' }),
          explain: `벡터를 평행이동하여 겹치면 같은 벡터이다. ${jh(vec(t), '을/를')} 평행이동하면 ${vec(right)}와 겹친다. 크기만 같거나 평행하기만 한 벡터, 방향이 반대인 벡터는 같은 벡터가 아니다.` });
      }
      const edges = pairs(OCT_EDGES + ' ' + OCT_HID).flatMap((s) => [s, rev(s)]);
      const t = d.pick(edges), want = vmul(-1, vecOf(OCT, t));
      const eq = edges.filter((s) => s !== rev(t) && same(vecOf(OCT, s), want));
      if (!eq.length) return null;
      const right = d.pick(eq), pool = d.shuffle(edges.filter((s) => s !== t && s !== rev(t) && !same(vecOf(OCT, s), want) && !same(vecOf(OCT, s), vecOf(OCT, t))));
      return pickOne(d, `정팔면체에서 다음 중 벡터 ${jh(vec(t), '과/와')} 크기가 같고 방향이 반대인 것은?`, [{ h: vec(right), ok: true }].concat(pool.slice(0, 4).map((s) => ({ h: vec(s), ok: false }))), {
        figure: fig3({ view: OCT_VIEW, pts: OCT, edges: OCT_EDGES, dash: OCT_HID, say: '정팔면체(A 위, F 아래, 가운데 정사각형의 꼭짓점 B 왼쪽, C 앞, D 오른쪽, E 뒤).' }),
        explain: `${vec(rev(t))}는 ${jh(vec(t), '과/와')} 크기가 같고 방향이 반대이다. 정팔면체에서 모서리 ${jh(right, '은/는')} 모서리 ${rev(t)}와 평행하고 길이가 같으며 방향도 같으므로 ${vec(right)} = ${vec(rev(t))} = ${MINUS}${vec(t)}이다.` });
    }, { count: 2 }),

    // ①8 정삼각형을 중점으로 나눈 그림에서 같은 벡터로 ±a⃗, ±b⃗ 나타내기
    T('mean-triab', '중점으로 나눈 정삼각형에서 같은 벡터로 나타내기', '①8', (d) => {
      const cls = [['AD', 'DB', 'FE'], ['BE', 'EC', 'DF']], pickV = (cl) => { const s = d.pick(cl); return d.bool() ? s : rev(s); };
      const va = pickV(cls[0]), vb = pickV(cls[1]);
      const pool = cls.flat().flatMap((s) => [s, rev(s)]).filter((s) => s !== va && s !== vb);
      const t = d.pick(pool), c = intCoefs(vecOf(TRI, t), [vecOf(TRI, va), vecOf(TRI, vb)]);
      if (!c) return null;
      const rows = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1]].map((k) => ({ h: lcH(k, ['a', 'b']), ok: k[0] === c[0] && k[1] === c[1] }));
      return pickOne(d, `정삼각형 ABC에서 세 변 AB, BC, CA의 중점을 각각 D, E, F라 하고 ${vec(va)} = ${vec('a')}, ${vec(vb)} = ${jh(vec('b'), '이라/라')}고 할 때, 벡터 ${jh(vec(t), '을/를')} ${vlist(ab)}로 나타낸 것은?`, rows, {
        figure: fig2({ u: 62, pts: TRI, edges: 'AB BC CA', thin: 'DE EF FD', arrows: [[va[0], va[1], 'a'], [vb[0], vb[1], 'b', 'in']], say: `정삼각형 ABC와 세 변 AB, BC, CA의 중점 D, E, F를 이은 선분. 화살표 a는 ${va[0]}에서 ${va[1]}로, b는 ${vb[0]}에서 ${vb[1]}로.` }),
        explain: `${jh(vec(t), '은/는')} ${c[0] ? jh(vec(va), '과/와') : jh(vec(vb), '과/와')} 평행하고 길이가 같다. 방향이 ${(c[0] || c[1]) > 0 ? '같으므로' : '반대이므로'} ${vec(t)} = ${lcH(c, ['a', 'b'])}이다.` });
    }),

    // ①9 바람의 속도(바람 이름은 불어오는 쪽 — 벡터의 방향과 반대). 차례 2 는 ➋(작도)를 알맞은 벡터 고르기로 바꿨다.
    T('mean-wind', '바람의 속도를 벡터로 읽기', '①9', (d, n) => {
      const WIND = ['동', '북동', '북', '북서', '서', '남서', '남', '남동'], name = (i) => WIND[((i % 8) + 8) % 8];
      const lead = `동쪽에서 불어오는 바람을 동풍이라 하고, ‘초속 1 m의 동풍’인 바람의 속도를 그림의 벡터 ${jh(vec('OA'), '으로/로')} 나타낸다.`;
      const NOTE = ' (단, 동심원의 반지름의 길이는 1 m씩 늘어난다.)';
      let arrows;
      if (n === 0) {
        const used = new Set([4]); arrows = [{ name: 'A', dir: 4, len: 1 }];
        for (const nm of ['B', 'C', 'D']) { const dir = d.until(() => d.int(0, 7), (x) => !used.has(x)); used.add(dir); arrows.push({ name: nm, dir, len: d.int(2, 5) }); }
        const q = d.pick(arrows.slice(1)), from = q.dir + 4;
        const say = (s) => `초속 ${s[0]} m의 ${name(s[1])}풍`;
        const rows = [[q.len, from, true], [q.len, q.dir, false], [q.len === 5 ? 4 : q.len + 1, from, false], [q.len, from + 2, false]].map(([s, w, ok]) => ({ h: say([s, w]), ok }));
        return pickOne(d, `${lead} 벡터 ${jh(vec('O' + q.name), '이/가')} 나타내는 바람의 속도는?${NOTE}`, rows, {
          figure: windFig(arrows, name),
          explain: `벡터 ${jh(vec('O' + q.name), '은/는')} ${name(q.dir)}쪽을 향하므로 바람은 그 반대쪽인 ${name(from)}쪽에서 불어온다. 길이가 ${q.len}칸이므로 초속 ${q.len} m의 ${name(from)}풍이다.` });
      }
      const wi = d.int(0, 7), k = d.int(2, 5), off = d.pick([1, -1]);
      const dirs = [wi + 4, wi, wi + 4 + off, wi + 2].map((x) => ((x % 8) + 8) % 8);
      if (dirs.includes(4)) return null;
      const order = d.shuffle([0, 1, 2, 3]), letters = ['B', 'C', 'D', 'E'];
      arrows = [{ name: 'A', dir: 4, len: 1 }].concat(order.map((j, i) => ({ name: letters[i], dir: dirs[j], len: k })));
      const right = order.indexOf(0);
      return pickOne(d, `${lead} ‘초속 ${k} m의 ${name(wi)}풍’인 바람의 속도를 나타내는 벡터는?${NOTE}`, letters.map((l, i) => ({ h: vec('O' + l), ok: i === right })), {
        keep: true, figure: windFig(arrows, name),
        explain: `${name(wi)}풍은 ${name(wi)}쪽에서 불어오는 바람이므로 그 속도를 나타내는 벡터는 반대쪽인 ${name(wi + 4)}쪽을 향한다. 길이가 ${k}칸인 ${vec('O' + letters[right])}이다.` });
    }, { count: 2 }),

    // ①10 비스듬히 당기는 힘의 수평 방향 크기(30°·45° — 답은 늘 k√q, k ≥ 2)
    T('mean-force', '비스듬히 당기는 힘의 수평 방향 크기', '①10', (d) => {
      const th = d.pick([30, 45]), F = 2 * d.int(2, 6), q = th === 30 ? 3 : 2;
      return lenAns(`지면 위에 놓인 물체를 지면과 ${th}°의 각을 이루는 방향으로 ${F} N의 힘으로 잡아당긴다. 이 힘을 벡터 ${vec('a')}, 물체에 수평 방향으로 작용하는 힘을 벡터 ${jh(vec('b'), '이라/라')}고 할 때, ${absH(vec('b'))}의 값은? (단, 힘의 크기의 단위는 N이다.)`, F / 2, q, {
        unit: 'N', figure: forceFig(th, F),
        explain: `${vec('a')}의 끝에서 지면에 수선을 내리면 직각삼각형이 생기고, |${vec('b')}|는 빗변 |${vec('a')}| = ${F}에 이웃한 변의 길이이다. |${vec('b')}| = ${F} × cos ${th}° = ${F} × ${frac(rt(q), 2)} = ${F / 2}${rt(q)} (N)이다.`,
        facts: { calc: [[`${F}/2`, 0], [String(q), 1]], derived: [2, q] } });
    })
  ];

  // 바람 그림: 방위, 반지름이 1 m씩 늘어나는 동심원 다섯 개, O 에서 나가는 화살표(dir 은 동쪽부터 45°씩 시계 반대 방향)
  function windFig(arrows, name) {
    const b = Board(), u = 20, c = [0, 0];
    for (let r = 1; r <= 5; r += 1) b.disk(c, r * u, 'fill:none;stroke:#cbd5e1;stroke-width:1');
    b.seg([-5.5 * u, 0], [5.5 * u, 0], 'thin', 'stroke:#94a3b8'); b.seg([0, -5.5 * u], [0, 5.5 * u], 'thin', 'stroke:#94a3b8');
    b.text([0, -6.4 * u], '북', { plain: true }); b.text([0, 6.4 * u], '남', { plain: true }); b.text([6.6 * u, 0], '동', { plain: true }); b.text([-6.6 * u, 0], '서', { plain: true });
    for (const a of arrows) { const ang = a.dir * 45, q = at(c, a.len * u, ang); arrowTo(b, c, q); b.name(q, a.name, a.dir % 2 === 0 ? ang - 32 : ang, 11); }
    const free = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((g) => [g, Math.min(...arrows.map((a) => Math.min(Math.abs(g - a.dir * 45), 360 - Math.abs(g - a.dir * 45))))]).sort((x, y) => y[1] - x[1])[0][0];
    b.name(c, 'O', free, 10);
    const said = '방위(북, 남, 동, 서)와 점 O를 중심으로 반지름이 1 m씩 늘어나는 동심원 다섯 개. ' + arrows.map((a) => `화살표 O${a.name}는 ${name(a.dir)}쪽으로 ${a.len}칸`).join(', ') + '.';
    return b.svg(attr(said));
  }
  // 힘 그림: 지면 위의 물체를 θ° 방향으로 당기는 힘 a⃗ 와 수평 방향의 힘 b⃗
  function forceFig(th, F) {
    const b = Board(), o = [0, -16], tip = at(o, 112, th), foot = [tip[0], o[1]];
    b.seg([-62, 0], [150, 0]);
    b.poly([[-44, 0], [0, 0], [0, -32], [-44, -32]], 'fill:#e2e8f0');
    b.seg(tip, foot, 'cut');
    arrowTo(b, o, foot); arrowTo(b, o, tip);
    b.angle(o, 0, th, th + '°', { r: 26 });
    const m = mid(o, tip); vname(b, [m[0] - 10, m[1] - 10], 'a');
    vname(b, [foot[0] + 14, o[1] + 2], 'b');
    b.text([tip[0] + 6, tip[1] - 12], `${F} N`, { blue: true });
    return b.svg(attr(`지면 위의 물체를 지면과 ${th}°의 각을 이루는 방향으로 ${F} N의 힘 a로 당기는 그림. b는 물체에서 수평 방향으로 그은 화살표이고, a의 끝에서 수평선에 내린 수선의 발까지 이어진다.`));
  }

  // ══ 나. 벡터의 덧셈과 뺄셈 ══
  const add = [
    // ①11 두 벡터의 합·차(작도 → 알맞은 화살표 고르기). 모눈 위의 벡터는 새로 지었다.
    T('add-draw', '두 벡터의 합·차를 나타낸 화살표 고르기', '①11', (d, n) => {
      const sum = n === 0;
      const [a, b] = d.until(() => [[d.int(-3, 3), d.int(-3, 3)], [d.int(-3, 3), d.int(-3, 3)]], ([p, q]) => p[0] * q[1] - p[1] * q[0] !== 0 && (p[0] || p[1]) && (q[0] || q[1])
        && [vadd(p, q), vsub(p, q)].every((v) => Math.abs(v[0]) <= 5 && Math.abs(v[1]) <= 5 && (v[0] || v[1])));
      const goal = sum ? vadd(a, b) : vsub(a, b);
      const cands = sum ? [goal, vsub(a, b), vsub(b, a), vmul(-1, goal)] : [goal, vadd(a, b), vsub(b, a), vmul(-1, vadd(a, b))];
      const list = d.shuffle(cands.map((v, i) => [v, i === 0]));
      // 보기 그림은 화면 검사의 잣대(너비 60px 이상)를 넘게 가로 칸을 다섯 칸 아래로 줄이지 않는다.
      const cols = Math.max(5, Math.max(...cands.map((v) => Math.abs(v[0]))) + 1), rows = Math.max(...cands.map((v) => Math.abs(v[1]))) + 1;
      const figs = list.map(([v]) => { const s = centerStart(v, cols, rows); return gridFig({ cols, rows, g: 13, arrows: [{ p: s, q: vadd(s, v) }], say: `모눈 위의 화살표: ${move(v)}.` }); });
      const mc = Math.abs(a[0]) + Math.abs(b[0]) + 3, mr = Math.max(Math.abs(a[1]), Math.abs(b[1])) + 1;
      const sa = [a[0] >= 0 ? 0 : -a[0], a[1] >= 0 ? 0 : -a[1]], x1 = Math.abs(a[0]) + 2, sb = [x1 + (b[0] >= 0 ? 0 : -b[0]), b[1] >= 0 ? 0 : -b[1]];
      const main = gridFig({ cols: mc, rows: mr, g: 15, arrows: [{ p: sa, q: vadd(sa, a), name: 'a', tag: topTag(sa, a) }, { p: sb, q: vadd(sb, b), name: 'b', tag: topTag(sb, b) }], say: `모눈 위의 두 벡터: a는 ${move(a)}, b는 ${move(b)}.` });
      const ask = sum ? `${vec('a')} + ${vec('b')}` : `${vec('a')} ${MINUS} ${vec('b')}`;
      return C(`두 벡터 ${vlist(ab)}가 그림과 같을 때, 벡터 ${jh(ask, '을/를')} 나타낸 화살표는?`, LAB.slice(0, 4), list.findIndex((c) => c[1]), {
        figure: `<div style="text-align:center">${main}</div>` + panels(figs),
        explain: sum ? `${vec('a')}의 종점에 ${vec('b')}의 시점을 이어 붙이면 ${vec('a')}의 시점에서 ${vec('b')}의 종점으로 가는 화살표가 ${jh(ask, '이다/이다')}. 모눈으로 세면 ${move(goal)} 가는 화살표이다.`
          : `두 벡터의 시점을 맞추면 ${vec('b')}의 종점에서 ${vec('a')}의 종점으로 가는 화살표가 ${jh(ask, '이다/이다')}. 모눈으로 세면 ${move(goal)} 가는 화살표이다.`,
        facts: { truth: list.map((c) => c[1]), want: true } });
    }, { count: 2 }),

    // ①12 시점과 종점을 이어 합을 한 벡터로(차례 1 세 벡터, 차례 2 네 벡터 — 영벡터가 되기도 한다)
    T('add-chain', '시점과 종점을 이어 벡터의 합 간단히 하기', '①12', (d, n) => {
      const L = d.shuffle('ABCDE'.split(''));
      let terms, ans;
      if (n === 0) { const p = L.slice(0, 4); terms = [p[0] + p[1], p[1] + p[2], p[2] + p[3]]; ans = p[0] + p[3]; }
      else if (d.bool()) { const p = L.slice(0, 4); terms = [p[0] + p[1], p[1] + p[2], p[2] + p[3], p[3] + p[0]]; ans = '0'; }
      else { const p = L.slice(0, 5); terms = [p[0] + p[1], p[1] + p[2], p[2] + p[3], p[3] + p[4]]; ans = p[0] + p[4]; }
      const shownT = d.shuffle(terms);
      if (shownT.every((t, i) => i === 0 || shownT[i - 1][1] === t[0])) return null;
      const used = [...new Set(terms.join(''))], others = d.shuffle(segsOf(used).filter((s) => s !== ans && s !== rev(ans)));
      const wrong = (ans === '0' ? [] : [rev(ans), '0']).concat(others).slice(0, 4);
      const expr = shownT.map(vn).join(' + ');
      return pickOne(d, `${jh(expr, '을/를')} 간단히 한 것은?`, [{ h: vn(ans), ok: true }].concat(wrong.map((s) => ({ h: vn(s), ok: false }))), {
        explain: `교환법칙과 결합법칙으로 앞 벡터의 종점과 뒤 벡터의 시점이 이어지게 차례를 바꾸면 ${terms.map(vn).join(' + ')} = ${vn(ans)}${ans === '0' ? '(시점과 종점이 같다)' : ''}이다.` });
    }, { count: 2 }),

    // ①13 뺄셈이 섞인 식을 한 벡터로: 빼기를 반대 벡터의 덧셈으로 바꾸고 잇는다.
    T('add-sub', '뺄셈이 섞인 벡터의 식 간단히 하기', '①13', (d) => {
      const p = d.shuffle('ABCDE'.split('')).slice(0, 4), j = d.int(1, 2);
      let terms = [[1, p[0] + p[1]], [1, p[1] + p[2]], [1, p[2] + p[3]], [-1, p[0] + p[j]]].map(([k, xy]) => (d.bool() ? [-k, rev(xy)] : [k, xy]));
      if (terms.filter(([k]) => k < 0).length < 2 || new Set(terms.map(([, xy]) => xy.split('').sort().join(''))).size < 4) return null;
      terms = d.shuffle(terms);
      if (terms[0][0] < 0) return null;
      const res = asOne(formal(terms));
      if (!res || res === '0') return null;
      const others = d.shuffle(segsOf(p).filter((s) => s !== res && s !== rev(res)));
      const plus = terms.map(([k, xy]) => (k > 0 ? xy : rev(xy)));
      return pickOne(d, `${jh(termsH(terms), '을/를')} 간단히 한 것은?`, [{ h: vn(res), ok: true }, { h: vn(rev(res)), ok: false }, { h: ZV, ok: false }].concat(others.slice(0, 2).map((s) => ({ h: vn(s), ok: false }))), {
        explain: `빼는 벡터는 방향이 반대인 벡터를 더하는 것과 같다(${MINUS}${vn('XY')} = ${vn('YX')}). 모두 덧셈으로 바꾸면 ${plus.map(vn).join(' + ')}이고, 시점과 종점을 이어 가면 ${vn(res)}이다.` });
    }),

    // ①14 정육각형에서 같은 벡터로 바꿔 합·차를 한 벡터로(차례 1 합, 차례 2 차)
    T('add-hex', '정육각형에서 같은 벡터로 바꿔 합·차 구하기', '①14', (d, n) => {
      const segs = segsOf(Object.keys(HEX)), unit = segs.filter((s) => Math.abs(vlen(vecOf(HEX, s)) - 1) < 1e-9), sum = n === 0;
      const eqTo = (w, from) => segs.find((t) => t[0] === from && same(vecOf(HEX, t), w));
      // 풀이: 합은 v 와 같은 벡터 가운데 시점이 u 의 종점인 것으로, 차는 −v 와 같은 벡터 가운데 시점이 u 의 종점인 것(또는 v 와 같고 시점이 u 의 시점인 것)으로 바꾼다.
      const howOf = (x, y) => {
        const X = vecOf(HEX, x), Y = vecOf(HEX, y);
        if (sum) { const t = eqTo(Y, x[1]); return t && `${vn(y)} = ${jh(vn(t), '이므로/이므로')} ${vn(x)} + ${vn(t)} = ${vn(x[0] + t[1])}`; }
        const t1 = eqTo(vmul(-1, Y), x[1]); if (t1) return `${MINUS}${vn(y)} = ${jh(vn(t1), '이므로/이므로')} ${vn(x)} ${MINUS} ${vn(y)} = ${vn(x)} + ${vn(t1)} = ${vn(x[0] + t1[1])}`;
        const t2 = eqTo(Y, x[0]); return t2 && `${vn(y)} = ${jh(vn(t2), '이므로/이므로')} ${vn(x)} ${MINUS} ${vn(t2)} = ${vn(t2[1] + x[1])}`;
      };
      const [u, v] = d.until(() => [d.pick(unit), d.pick(unit)], ([x, y]) => !parallel(vecOf(HEX, x), vecOf(HEX, y)) && (sum ? x[1] !== y[0] && y[1] !== x[0] : x[0] !== y[0] && x[1] !== y[1]) && Boolean(howOf(x, y)));
      const r = sum ? vadd(vecOf(HEX, u), vecOf(HEX, v)) : vsub(vecOf(HEX, u), vecOf(HEX, v));
      const eq = segs.filter((s) => same(vecOf(HEX, s), r));
      if (!eq.length) return null;
      const right = d.pick(eq), wrong = d.shuffle(segs.filter((s) => !same(vecOf(HEX, s), r) && Math.abs(vlen(vecOf(HEX, s)) - vlen(r)) < 1e-9));
      if (wrong.length < 4) return null;
      const lhs = `${vn(u)} ${sum ? '+' : MINUS} ${vn(v)}`, tail = howOf(u, v);
      return pickOne(d, `정육각형 ABCDEF의 세 대각선 AD, BE, CF의 교점을 O라고 할 때, 다음 중 ${jh(lhs, '과/와')} 같은 벡터는?`, [{ h: vn(right), ok: true }].concat(wrong.slice(0, 4).map((s) => ({ h: vn(s), ok: false }))), {
        figure: fig2({ u: 52, pts: HEX, edges: HEX_EDGES, thin: 'AD BE CF', at: { O: 300 }, say: '정육각형 ABCDEF(A 왼쪽 위, B 왼쪽, C 왼쪽 아래, D 오른쪽 아래, E 오른쪽, F 오른쪽 위)와 세 대각선 AD, BE, CF의 교점 O.' }),
        explain: `정육각형은 정삼각형 여섯 개로 나뉘므로 평행하고 길이가 같은 선분이 많다. ${tail}이고, 이 벡터와 크기와 방향이 같은 것은 ${vn(right)}이다.` });
    }, { count: 2 }),

    // ①15 덧셈·뺄셈 등식의 참·거짓(차례 1 옳지 않은 것, 차례 2 옳은 것)
    T('add-false', '벡터의 덧셈·뺄셈 등식 가운데 옳은 것·옳지 않은 것', '①15', (d, n) => {
      const [X, Y, Z] = d.shuffle('ABC'.split('')), S6 = [X + Y, Y + X, Y + Z, Z + Y, X + Z, Z + X];
      const rows = [], seen = new Set();
      for (let i = 0; i < 400 && rows.length < 60; i += 1) {
        const u = d.pick(S6), v = d.pick(S6), op = d.pick([1, -1]), w = d.int(0, 5) === 0 ? '0' : d.pick(S6);
        if (u === v || u === w || v === w) continue;
        const h = `${termsH([[1, u], [op, v]])} = ${vn(w)}`, k = stripH(h);
        if (seen.has(k)) continue; seen.add(k);
        const m = formal([[1, u], [op, v]]), truth = (w === '0' ? asOne(m) === '0' : asOne(m) === w);
        rows.push({ h, truth, real: formalH(m) || termsH([[1, u], [op, v]]) });
      }
      const T1 = d.shuffle(rows.filter((r) => r.truth)), F1 = d.shuffle(rows.filter((r) => !r.truth));
      const wantFalse = n === 0;
      if (T1.length < 4 || F1.length < 4) return null;
      const chosen = wantFalse ? T1.slice(0, 4).concat(F1.slice(0, 1)) : F1.slice(0, 4).concat(T1.slice(0, 1));
      const key = chosen.find((r) => r.truth !== wantFalse);
      return pickOne(d, `서로 다른 세 점 A, B, C에 대하여 다음 중 옳${wantFalse ? '지 않은' : '은'} 것은?`, chosen.map((r) => ({ h: r.h, ok: r === key })), {
        explain: `빼기는 방향이 반대인 벡터의 덧셈으로 바꾸고, 앞 벡터의 종점과 뒤 벡터의 시점을 이어 본다. ${wantFalse ? `옳지 않은 것의 왼쪽을 간단히 하면 ${key.real}이다.` : `옳은 것은 ${jh(key.h, '이고/이고')}, 나머지는 왼쪽을 간단히 한 벡터가 오른쪽과 다르다.`}` });
    }, { count: 2 }),

    // ①16 결합법칙 설명의 빈칸
    T('add-assoc', '결합법칙 설명의 빈칸 채우기', '①16', (d) => {
      const [P, Qn, R, S] = d.pick([['A', 'B', 'C', 'D'], ['P', 'Q', 'R', 'S'], ['O', 'A', 'B', 'C']]);
      const g = [P + R, Qn + S, P + S], wrong = [[Qn + S, P + R, P + S], [P + R, P + S, Qn + S], [P + S, Qn + S, P + R], [P + R, Qn + S, S + P], [R + P, Qn + S, P + S], [P + R, S + Qn, P + S]];
      const rows = [{ h: g.map(vn).join(', '), ok: true }].concat(d.shuffle(wrong).slice(0, 4).map((w) => ({ h: w.map(vn).join(', '), ok: false })));
      const [a, b, c] = abc;
      const IND = '<span style="display:inline-block;width:2.2em"></span>';
      const figure = lines([`(${a} + ${b}) + ${c} = (${vn(P + Qn)} + ${vn(Qn + R)}) + ${vn(R + S)}`, `${IND}= (㉠) + ${vn(R + S)} = (㉢)`,
        `${a} + (${b} + ${c}) = ${vn(P + Qn)} + (${vn(Qn + R)} + ${vn(R + S)})`, `${IND}= ${vn(P + Qn)} + (㉡) = (㉢)`]);
      return pickOne(d, `세 벡터 ${vlist(abc)}에 대하여 ${vn(P + Qn)} = ${a}, ${vn(Qn + R)} = ${b}, ${vn(R + S)} = ${jh(c, '이/가')} 되도록 네 점 ${[P, Qn, R, S].join(', ')}를 잡고 벡터의 덧셈에 대한 결합법칙을 다음과 같이 확인하였다. ㉠, ㉡, ㉢에 알맞은 벡터를 차례로 나열한 것은?`, rows, {
        figure, explain: `${vn(P + Qn)} + ${vn(Qn + R)} = ${vn(P + R)}, ${vn(Qn + R)} + ${vn(R + S)} = ${jh(vn(Qn + S), '이고/이고')}, 두 줄 모두 끝은 ${vn(P + R)} + ${vn(R + S)} = ${vn(P + Qn)} + ${vn(Qn + S)} = ${vn(P + S)}이다.` });
    }),

    // ①17 벡터 등식이 성립하는 사각형의 모양(대변이 평행하고 길이가 같다 → 평행사변형)
    T('add-quad', '벡터 등식이 성립하는 사각형의 모양', '①17', (d) => {
      const FORMS = [
        [`${vn('AO')} + ${vn('CO')} = ${vn('BO')} + ${vn('DO')}`, `${vn('AO')} ${MINUS} ${vn('BO')} = ${vn('DO')} ${MINUS} ${vn('CO')}, 곧 ${vn('AO')} + ${vn('OB')} = ${vn('DO')} + ${vn('OC')}이므로 ${vn('AB')} = ${vn('DC')}`],
        [`${vn('OA')} + ${vn('OC')} = ${vn('OB')} + ${vn('OD')}`, `${vn('OB')} ${MINUS} ${vn('OA')} = ${vn('OC')} ${MINUS} ${vn('OD')}이므로 ${vn('AB')} = ${vn('DC')}`],
        [`${vn('OB')} ${MINUS} ${vn('OA')} = ${vn('OC')} ${MINUS} ${vn('OD')}`, `왼쪽은 ${vn('AB')}, 오른쪽은 ${jh(vn('DC'), '이므로/이므로')} ${vn('AB')} = ${vn('DC')}`],
        [`${vn('AO')} + ${vn('OD')} = ${vn('BO')} + ${vn('OC')}`, `왼쪽은 ${vn('AD')}, 오른쪽은 ${jh(vn('BC'), '이므로/이므로')} ${vn('AD')} = ${vn('BC')}`],
        [`${vn('OD')} ${MINUS} ${vn('OC')} = ${vn('OA')} ${MINUS} ${vn('OB')}`, `왼쪽은 ${vn('CD')}, 오른쪽은 ${jh(vn('BA'), '이므로/이므로')} ${vn('CD')} = ${vn('BA')}`]
      ];
      const [eqH, why] = d.pick(FORMS);
      const rows = ['평행사변형', '마름모', '직사각형', '정사각형', '등변사다리꼴'].map((s, i) => ({ h: s, ok: i === 0 }));
      return pickOne(d, `사각형 ABCD와 이 사각형의 내부의 한 점 O에 대하여 ${eqH}가 성립할 때, 사각형 ABCD는 어떤 사각형인가?`, rows, {
        explain: `${why}이다. 한 쌍의 대변이 평행하고 길이가 같으므로 사각형 ABCD는 평행사변형이다. 이웃한 변의 길이나 각의 크기는 알 수 없으므로 마름모·직사각형이라고 할 수는 없다.` });
    })
  ];

  // ══ 다. 도형 속 벡터를 주어진 벡터로 나타내기 ══
  const fig = [
    // ①18 평행사변형: 대각선의 교점에서 나간 두 벡터로
    T('fig-para', '평행사변형에서 대각선의 교점을 시점으로 한 두 벡터로 나타내기', '①18', (d) => {
      const base = d.pick([['OA', 'OB'], ['OB', 'OC'], ['OC', 'OD'], ['OD', 'OA']]), bv = base.map((s) => vecOf(PARA, s));
      const t = d.pick(segsOf('ABCD'.split('')));
      const c = intCoefs(vecOf(PARA, t), bv);
      if (!c || c.filter(Boolean).length < 2) return null;
      const cof = (p) => (p === 'O' ? [0, 0] : intCoefs(PARA[p], bv));
      return lcAns(`평행사변형 ABCD의 두 대각선의 교점을 O라 하고 ${vn(base[0])} = ${vec('a')}, ${vn(base[1])} = ${jh(vec('b'), '이라/라')}고 할 때, 벡터 ${jh(vn(t), '을/를')} ${vlist(ab)}로 나타내시오.`, vn(t), c, ['a', 'b'], {
        figure: fig2({ u: 58, pts: PARA, edges: 'AB BC CD DA', thin: 'AC BD', arrows: [['O', base[0][1], 'a', 'in'], ['O', base[1][1], 'b', 'in']], at: { O: 270 }, say: `평행사변형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위)와 두 대각선의 교점 O. 화살표 a는 O에서 ${base[0][1]}로, b는 O에서 ${base[1][1]}로.` }),
        explain: `O는 두 대각선의 중점이므로 ${'ABCD'.split('').filter((p) => !base.includes('O' + p)).map((p) => `${vn('O' + p)} = ${lcH(cof(p), ['a', 'b'])}`).join(', ')}이다. ${viaOrigin(t, 'O', cof, ['a', 'b'])}이다.` });
    }),

    // ①19 정육각형: 중심에서 나간 두 벡터로
    T('fig-hexo', '정육각형에서 중심을 시점으로 한 두 벡터로 나타내기', '①19', (d) => {
      const rad = 'ABCDEF'.split(''), [p, q] = d.until(() => [d.pick(rad), d.pick(rad)], ([x, y]) => x !== y && !parallel(HEX[x], HEX[y]));
      const bv = [HEX[p], HEX[q]], cof = (x) => (x === 'O' ? [0, 0] : intCoefs(HEX[x], bv));
      const t = d.until(() => d.pick(segsOf(Object.keys(HEX))), (s) => ![`O${p}`, `O${q}`, `${p}O`, `${q}O`].includes(s));
      const c = intCoefs(vecOf(HEX, t), bv);
      if (!c || c.some((k) => Math.abs(k) > 2) || c.filter(Boolean).length < 2) return null;
      return lcAns(`정육각형 ABCDEF의 세 대각선 AD, BE, CF의 교점을 O라 하고 ${vn('O' + p)} = ${vec('a')}, ${vn('O' + q)} = ${jh(vec('b'), '이라/라')}고 할 때, 벡터 ${jh(vn(t), '을/를')} ${vlist(ab)}로 나타내시오.`, vn(t), c, ['a', 'b'], {
        figure: fig2({ u: 54, pts: HEX, edges: HEX_EDGES, thin: 'AD BE CF', arrows: [['O', p, 'a', 'in'], ['O', q, 'b', 'in']], at: { O: d.pick([30, 210]) }, say: `정육각형 ABCDEF(A 왼쪽 위, B 왼쪽, C 왼쪽 아래, D 오른쪽 아래, E 오른쪽, F 오른쪽 위)와 세 대각선의 교점 O. 화살표 a는 O에서 ${p}로, b는 O에서 ${q}로.` }),
        explain: `정육각형은 O를 꼭짓점으로 하는 정삼각형 여섯 개로 나뉜다. O에서 각 꼭짓점으로 가는 벡터는 ${rad.filter((x) => x !== p && x !== q).map((x) => `${vn('O' + x)} = ${lcH(cof(x), ['a', 'b'])}`).join(', ')}이다. 따라서 ${viaOrigin(t, 'O', cof, ['a', 'b'])}이다.` });
    }),

    // ①20 정육각형: 한 꼭짓점에서 나간 두 벡터(차례 1 AB⃗·AC⃗, 차례 2 AB⃗·AF⃗), 차례 3 은 평행하지 않은 두 변(대02 — FD⃗ = mAB⃗ + nCD⃗)
    T('fig-hexv', '정육각형에서 꼭짓점을 시점으로 한 두 벡터·두 변으로 나타내기', '①20', (d, n) => {
      const verts = 'ABCDEF'.split('');
      let base, names;
      if (n === 0) { base = ['AB', 'AC']; names = ['a', 'b']; }
      else if (n === 1) { base = ['AB', 'AF']; names = ['a', 'b']; }
      else { base = d.until(() => [d.pick(pairs(HEX_EDGES)), d.pick(pairs(HEX_EDGES))], ([x, y]) => x !== y && !parallel(vecOf(HEX, x), vecOf(HEX, y)) && x[1] !== y[0] && y[1] !== x[0]); names = base; }
      const bv = base.map((s) => vecOf(HEX, s)), origin = n < 2 ? 'A' : base[0][0], cof = (x) => intCoefs(vsub(HEX[x], HEX[origin]), bv);
      const t = d.until(() => d.pick(segsOf(verts)), (s) => !base.includes(s) && !base.includes(rev(s)) && (n < 2 || !parallel(vecOf(HEX, s), bv[0]) && !parallel(vecOf(HEX, s), bv[1])));
      const c = intCoefs(vecOf(HEX, t), bv);
      if (!c || c.filter(Boolean).length < 2) return null;
      const given = n < 2 ? `${vn(base[0])} = ${vec('a')}, ${vn(base[1])} = ${jh(vec('b'), '이라/라')}고 할 때, 벡터 ${jh(vn(t), '을/를')} ${vlist(ab)}로 나타내시오.` : `벡터 ${jh(vn(t), '을/를')} 두 벡터 ${vn(base[0])}, ${jh(vn(base[1]), '으로/로')} 나타내시오.`;
      const arrows = n < 2 ? [[base[0][0], base[0][1], 'a'], [base[1][0], base[1][1], 'b', 'in']] : base.map((s) => [s[0], s[1]]);
      const O2 = Object.assign({}, HEX); delete O2.O;
      const rest = verts.filter((x) => x !== origin && !base.some((s) => s === origin + x));
      return lcAns(`정육각형 ABCDEF에서 ${given}`, vn(t), c, names, {
        figure: fig2({ u: 54, pts: O2, edges: HEX_EDGES, arrows, say: `정육각형 ABCDEF(A 왼쪽 위, B 왼쪽, C 왼쪽 아래, D 오른쪽 아래, E 오른쪽, F 오른쪽 위).${n < 2 ? ` 화살표 a는 A에서 ${base[0][1]}로, b는 A에서 ${base[1][1]}로.` : ''}` }),
        explain: `정육각형의 세 대각선의 교점을 O라 하면 마주 보는 변은 평행하고 길이가 같으며, 대각선 AD는 변의 두 배이다. ${origin}에서 각 꼭짓점으로 가는 벡터는 ${rest.map((x) => `${vn(origin + x)} = ${lcH(cof(x), names)}`).join(', ')}이다. 따라서 ${viaOrigin(t, origin, cof, names)}이다.` });
    }, { count: 3 }),

    // ①21 점대칭한 점을 두 벡터로
    T('fig-sym', '점대칭한 점을 두 벡터로 나타내기', '①21', (d) => {
      const [X, Y] = d.pick([['A', 'B'], ['B', 'A'], ['O', 'A'], ['O', 'B']]);
      const pos = { O: [0, 0], A: [d.int(2, 3), d.int(-1, 1) * 0.6 + 0.4], B: [d.int(1, 2) * 0.8, d.int(2, 3) * 0.7] };
      const cof = { O: [0, 0], A: [1, 0], B: [0, 1] }, c = cof[Y].map((v, i) => 2 * v - cof[X][i]);
      const pts = { O: pos.O, A: pos.A, B: pos.B };
      return lcAns(`세 점 O, A, B에 대하여 ${vn('OA')} = ${vec('a')}, ${vn('OB')} = ${jh(vec('b'), '이라/라')}고 하자. 점 ${jh(X, '을/를')} 점 ${Y}에 대하여 대칭이동한 점을 C라고 할 때, 벡터 ${jh(vn('OC'), '을/를')} ${vlist(ab)}로 나타내시오.`, vn('OC'), c, ['a', 'b'], {
        figure: fig2({ u: 42, pts, arrows: [['O', 'A', 'a'], ['O', 'B', 'b']], dots: ['O', 'A', 'B'], center: [(pos.A[0] + pos.B[0]) / 3, (pos.A[1] + pos.B[1]) / 3], say: '세 점 O, A, B. 화살표 a는 O에서 A로, b는 O에서 B로.' }),
        explain: `점 ${jh(Y, '은/는')} 선분 ${X}C의 중점이므로 ${vn(Y + 'C')} = ${vn(X + Y)}이다. ${vn('OC')} = ${vn('O' + Y)} + ${vn(Y + 'C')} = ${vn('O' + Y)} + ${vn(X + Y)} = ${lcH(c, ['a', 'b'])}이다.` });
    }),

    // ①22 직육면체: 세 모서리 벡터로
    T('fig-box', '직육면체에서 세 모서리 벡터로 나타내기', '①22', (d) => {
      const P = box(3, 2, 2), bv = ['AB', 'AD', 'AE'].map((s) => vecOf(P, s)), cof = (x) => intCoefs(vsub(P[x], P.A), bv);
      const t = d.until(() => d.pick(segsOf('ABCDEFGH'.split(''))), (s) => !['AB', 'AD', 'AE', 'BA', 'DA', 'EA'].includes(s));
      const c = intCoefs(vecOf(P, t), bv);
      if (!c || c.filter(Boolean).length < 2) return null;
      return lcAns(`직육면체 ABCD-EFGH에서 ${vn('AB')} = ${vec('a')}, ${vn('AD')} = ${vec('b')}, ${vn('AE')} = ${jh(vec('c'), '이라/라')}고 할 때, 벡터 ${jh(vn(t), '을/를')} ${vlist(abc)}로 나타내시오.`, vn(t), c, ['a', 'b', 'c'], {
        figure: fig3({ view: { u: 30, k: 0.6, ang: 225 }, pts: P, edges: BOX_EDGES, dash: BOX_HID, arrows: [['A', 'B', 'a'], ['A', 'D', 'b', 'in'], ['A', 'E', 'c']], say: '직육면체 ABCD-EFGH(윗면 ABCD — A 앞 왼쪽, B 앞 오른쪽, C 뒤 오른쪽, D 뒤 왼쪽, E·F·G·H는 A·B·C·D의 아래). 화살표 a는 A에서 B로, b는 A에서 D로, c는 A에서 E로.' }),
        explain: `평행한 모서리는 같은 벡터로 바꿀 수 있다. A에서 각 꼭짓점으로 가는 벡터는 ${'CFGH'.split('').map((x) => `${vn('A' + x)} = ${lcH(cof(x), ['a', 'b', 'c'])}`).join(', ')}이다. 따라서 ${viaOrigin(t, 'A', cof, ['a', 'b', 'c'])}이다.` });
    }),

    // ①23 직육면체: 대각선 벡터의 합을 세로 모서리의 실수배로(원문은 늘 4 — 대각선의 방향과 모서리를 바꿔 k를 달리한다)
    T('fig-box4', '직육면체에서 대각선 벡터의 합을 모서리의 실수배로', '①23', (d) => {
      const P = box(3, 2, 2), PAIRS = [['AG', 'CE'], ['BH', 'DF']], VERT = { A: 'E', B: 'F', C: 'G', D: 'H', E: 'A', F: 'B', G: 'C', H: 'D' };
      const use = d.pick([[0], [1], [0, 1], [0, 1]]), terms = [];
      for (const i of use) { const flip = d.bool(); for (const s of PAIRS[i]) terms.push(flip ? rev(s) : s); }
      const e = d.pick(['AE', 'BF', 'CG', 'DH', 'EA', 'FB', 'GC', 'HD']);
      const total = terms.reduce((s, t) => vadd(s, vecOf(P, t)), [0, 0, 0]), k = total[2] / vecOf(P, e)[2];
      if (!Number.isInteger(k) || k === 0) return null;
      const shown = d.shuffle(terms), expr = shown.map(vn).join(' + ');
      return numA(`직육면체 ABCD-EFGH에서 ${expr} = ${V('k')}${vn(e)}를 만족시키는 실수 ${V('k')}의 값은?`, k, {
        figure: fig3({ view: { u: 30, k: 0.6, ang: 225 }, pts: P, edges: BOX_EDGES, dash: BOX_HID, say: '직육면체 ABCD-EFGH(윗면 ABCD — A 앞 왼쪽, B 앞 오른쪽, C 뒤 오른쪽, D 뒤 왼쪽, E·F·G·H는 A·B·C·D의 아래).' }),
        explain: `대각선 벡터를 세로 모서리와 면의 대각선으로 가른다. 예를 들어 ${vn(shown[0])} = ${vn(shown[0][0] + VERT[shown[0][0]])} + ${vn(VERT[shown[0][0]] + shown[0][1])}이다. 마주 보는 두 대각선의 면의 대각선 부분은 크기가 같고 방향이 반대라 지워지고, 세로 모서리만 ${terms.length}개 남는다. 남은 것을 ${jh(vn(e), '으로/로')} 나타내면 ${V('k')} = ${sn(k)}이다.`,
        facts: { calc: [[jsn(k), 0]], derived: [Math.abs(k)] } });
    }),

    // ①25 정사면체: 한 꼭짓점에서 나간 세 모서리로
    T('fig-tetra', '정사면체에서 한 꼭짓점에서 나간 세 모서리로 나타내기', '①25', (d) => {
      const bv = ['OA', 'OB', 'OC'].map((s) => vecOf(TET, s)), cof = (x) => (x === 'O' ? [0, 0, 0] : intCoefs(TET[x].map((v, i) => v - TET.O[i]), bv));
      const segs = segsOf('ABC'.split(''));
      const [u, v] = d.until(() => [d.pick(segs), d.pick(segs)], ([x, y]) => x !== y && x !== rev(y));
      const op = d.pick([1, -1]), tv = op > 0 ? vadd(vecOf(TET, u), vecOf(TET, v)) : vsub(vecOf(TET, u), vecOf(TET, v));
      const c = intCoefs(tv, bv);
      if (!c || c.every((k) => k === 0)) return null;
      const lhs = termsH([[1, u], [op, v]]), part = (s) => `${vn(s)} = ${lcH(cof(s[1]).map((k, i) => k - cof(s[0])[i]), ['a', 'b', 'c'])}`;
      return lcAns(`정사면체 OABC에서 ${vn('OA')} = ${vec('a')}, ${vn('OB')} = ${vec('b')}, ${vn('OC')} = ${jh(vec('c'), '이라/라')}고 할 때, 벡터 ${jh(lhs, '을/를')} ${vlist(abc)}로 나타내시오.`, lhs, c, ['a', 'b', 'c'], {
        figure: fig3({ view: TET_VIEW, pts: TET, edges: 'OA OB OC AB BC', dash: 'AC', arrows: [['O', 'A', 'a'], ['O', 'B', 'b', 'in'], ['O', 'C', 'c']], say: '정사면체 OABC(O 위, A 왼쪽, B 앞, C 오른쪽). 화살표 a는 O에서 A로, b는 O에서 B로, c는 O에서 C로.' }),
        explain: `${part(u)}, ${part(v)}이므로 ${lhs} = ${lcH(c, ['a', 'b', 'c'])}이다.` });
    }),

    // ①26 정팔면체: 합을 한 벡터로(차례 1 고르기), 그 크기(차례 2 — 한 모서리의 길이 s, 답은 s√2)
    T('fig-octa', '정팔면체에서 벡터의 합을 간단히 하고 크기 구하기', '①26', (d, n) => {
      const NB = { A: 'BCDE', F: 'BCDE', B: 'ACFE', D: 'ACFE', C: 'ABFD', E: 'ABFD' };
      const Vx = d.pick(Object.keys(NB)), ring = NB[Vx], i0 = d.int(0, 1), P1 = ring[i0], Q1 = ring[i0 + 2];
      let terms = [Vx + P1, Vx + Q1];
      if (d.bool()) { const X = ring.split('').find((x) => x !== P1 && x !== Q1 && NB[P1].includes(x)); terms = [Vx + X, X + P1, Vx + Q1]; }
      const shown = d.shuffle(terms), expr = shown.map(vn).join(' + '), ans = Vx + OPP[Vx];
      if (!same(shown.reduce((s, t) => vadd(s, vecOf(OCT, t)), [0, 0, 0]), vecOf(OCT, ans))) return null;
      const why = `${terms.length === 3 ? `${vn(terms[0])} + ${vn(terms[1])} = ${jh(vn(Vx + P1), '이고/이고')} ` : ''}${vn(Vx + P1)}, ${jh(vn(Vx + Q1), '은/는')} 가운데 정사각형의 마주 보는 두 꼭짓점 ${P1}, ${Q1}로 가는 벡터이다. ${P1}${Q1}의 중점은 ${Vx}${OPP[Vx]}의 중점과 같으므로 두 벡터의 합은 ${vn(ans)}이다.`;
      const figure = fig3({ view: OCT_VIEW, pts: OCT, edges: OCT_EDGES, dash: OCT_HID, say: '정팔면체(A 위, F 아래, 가운데 정사각형의 꼭짓점 B 왼쪽, C 앞, D 오른쪽, E 뒤).' });
      if (n === 0) {
        const wrong = d.shuffle([rev(ans), Vx + P1, Vx + Q1, P1 + Q1, Q1 + P1, OPP[Vx] + P1]).slice(0, 4);
        return pickOne(d, `정팔면체에서 ${jh(expr, '을/를')} 간단히 한 것은?`, [{ h: vn(ans), ok: true }].concat(wrong.map((s) => ({ h: vn(s), ok: false }))), { figure, explain: why });
      }
      const s = d.int(2, 6);
      return lenAns(`한 모서리의 길이가 ${s}인 정팔면체에서 벡터 ${expr}의 크기는?`, s, 2, {
        figure, explain: `${why} 선분 ${Vx}${OPP[Vx]}는 한 변이 ${s}인 가운데 정사각형의 대각선과 길이가 같으므로 크기는 ${s}${rt(2)}이다.`,
        facts: { calc: [[String(s), 0], ['2', 1]], derived: [2] } });
    }, { count: 2 })
  ];

  // ══ 라. 벡터의 실수배 ══
  const scal = [
    // ①27 실수배·일차결합(작도 → 알맞은 화살표 고르기). 모눈 위의 벡터는 새로 지었다.
    T('scal-draw', '벡터의 실수배를 나타낸 화살표 고르기', '①27', (d, n) => {
      const [a, b] = d.until(() => [[d.int(-2, 2), d.int(-2, 2)], [d.int(-2, 2), d.int(-2, 2)]], ([p, q]) => p[0] * q[1] - p[1] * q[0] !== 0 && p.every((v) => v !== 0) && (q[0] || q[1]));
      let ks, alt;
      if (n === 0) {
        const useB = d.bool(), k = d.pick(useB && b.every((v) => v % 2 === 0) ? [-3, -2, 2, 3, Q(3, 2)] : [-3, -2, 2, 3]), kv = num(k), sg = Math.sign(kv);
        const v = useB ? b : a, o2 = useB ? a : b;
        ks = useB ? [0, k] : [k, 0];
        alt = [vmul(-kv, v), vmul(kv - sg, v), vmul(kv, o2), vmul(-kv, o2)];
      } else {
        ks = d.pick([[3, 2], [2, -1], [-1, 2], [1, -2], [2, 1], [-2, 1]]);
        alt = [vlin([ks[1], ks[0]], [a, b]), vlin([-ks[0], ks[1]], [a, b]), vlin([ks[0], -ks[1]], [a, b]), vlin([-ks[0], -ks[1]], [a, b])];
      }
      const goal = vlin(ks.map(num), [a, b]);
      const cands = [goal]; for (const v of alt) if (!isZero(v) && !cands.some((u) => same(u, v)) && v.every((x) => Math.abs(x - Math.round(x)) < 1e-9)) cands.push(v);
      if (cands.length < 4 || cands.some((v) => Math.abs(v[0]) > 6 || Math.abs(v[1]) > 6)) return null;
      const four = [cands[0]].concat(d.shuffle(cands.slice(1)).slice(0, 3)), list = d.shuffle(four.map((v, i) => [v, i === 0]));
      const cols = Math.max(5, Math.max(...four.map((v) => Math.abs(v[0]))) + 1), rows = Math.max(...four.map((v) => Math.abs(v[1]))) + 1;
      const figs = list.map(([v]) => { const s = centerStart(v, cols, rows); return gridFig({ cols, rows, g: 12, arrows: [{ p: s, q: vadd(s, v) }], say: `모눈 위의 화살표: ${move(v)}.` }); });
      const mc = Math.abs(a[0]) + Math.abs(b[0]) + 3, mr = Math.max(Math.abs(a[1]), Math.abs(b[1])) + 1;
      const sa = [a[0] >= 0 ? 0 : -a[0], a[1] >= 0 ? 0 : -a[1]], sb = [Math.abs(a[0]) + 2 + (b[0] >= 0 ? 0 : -b[0]), b[1] >= 0 ? 0 : -b[1]];
      const main = gridFig({ cols: mc, rows: mr, g: 15, arrows: [{ p: sa, q: vadd(sa, a), name: 'a', tag: topTag(sa, a) }, { p: sb, q: vadd(sb, b), name: 'b', tag: topTag(sb, b) }], say: `모눈 위의 두 벡터: a는 ${move(a)}, b는 ${move(b)}.` });
      const ask = lcH(ks, ['a', 'b']);
      return C(`두 벡터 ${vlist(ab)}가 그림과 같을 때, 벡터 ${jh(ask, '을/를')} 나타낸 화살표는?`, LAB.slice(0, 4), list.findIndex((c) => c[1]), {
        figure: `<div style="text-align:center">${main}</div>` + panels(figs),
        explain: `실수배 ${V('k')}${vec('a')}는 ${V('k')} &gt; 0이면 ${jh(vec('a'), '과/와')} 같은 방향, ${V('k')} &lt; 0이면 반대 방향이고 크기는 |${V('k')}|배이다. ${jh(ask, '은/는')} 모눈으로 ${move(goal)} 가는 화살표이다.`,
        facts: { truth: list.map((c) => c[1]), want: true } });
    }, { count: 2 }),

    // ①28 모눈 위 벡터의 실수배 관계(차례 1 b⃗ = ka⃗ 의 k), 평행한 벡터 모두 고르기(차례 2). 그림은 새로 지었다.
    T('scal-read', '모눈 위 벡터의 실수배 관계와 평행한 벡터', '①28', (d, n) => {
      if (n === 0) {
        const a = d.until(() => [d.int(-2, 2), d.int(-2, 2)], (v) => v[0] !== 0 && v[1] !== 0), k = d.pick([-3, -2, -1, 2, 3]), b = vmul(k, a);
        if (Math.abs(b[0]) > 6 || Math.abs(b[1]) > 6) return null;
        const sa = [a[0] >= 0 ? 0 : -a[0], 0 + (a[1] >= 0 ? 0 : -a[1])], x1 = Math.abs(a[0]) + 2, sb = [x1 + (b[0] >= 0 ? 0 : -b[0]), b[1] >= 0 ? 0 : -b[1]];
        const figure = gridFig({ cols: x1 + Math.abs(b[0]) + 1, rows: Math.max(Math.abs(a[1]), Math.abs(b[1])) + 1, g: 15, arrows: [{ p: sa, q: vadd(sa, a), name: 'a', tag: topTag(sa, a) }, { p: sb, q: vadd(sb, b), name: 'b', tag: topTag(sb, b) }], say: `모눈 위의 두 벡터: a는 ${move(a)}, b는 ${move(b)}.` });
        return numA(`두 벡터 ${vlist(ab)}가 그림과 같을 때, ${vec('b')} = ${V('k')}${jh(vec('a'), '을/를')} 만족시키는 실수 ${V('k')}의 값은?`, k, {
          figure, explain: `${jh(vec('b'), '은/는')} ${jh(vec('a'), '과/와')} 방향이 ${k > 0 ? '같고' : '반대이고'} 가로·세로로 간 칸 수가 ${Math.abs(k) === 1 ? '같으므로' : `모두 ${Math.abs(k)}배이므로`} ${V('k')} = ${sn(k)}이다.`,
          facts: { calc: [[`${jsn(b[0])}/${jsn(a[0])}`, 0]] } });
      }
      const p = d.until(() => [d.int(-2, 2), d.int(-2, 2)], (v) => v[0] !== 0 && v[1] !== 0 && Math.abs(v[0]) !== Math.abs(v[1]));
      const flags = d.until(() => [0, 1, 2, 3].map(() => d.bool()), (f) => f.some(Boolean) && !f.every(Boolean));
      const vs = flags.map((f) => (f ? vmul(d.pick([-2, -1, 2, Q(-1, 2), Q(1, 2)].filter((k) => p.every((x) => Number.isInteger(x * num(k)))).map(num)), p) : d.pick([[p[0], p[1] + 1], [p[0] + 1, p[1]], [p[1], p[0]], [-p[1], p[0]], [2 * p[0], p[1]]])));
      if (vs.some((v) => isZero(v) || Math.abs(v[0]) > 3 || Math.abs(v[1]) > 3) || vs.some((v, i) => parallel(v, p) !== flags[i]) || vs.some((v, i) => vs.some((w, j) => j < i && same(v, w)))) return null;
      const all = [p].concat(vs), letters = ['a', 'b', 'c', 'd'];
      const arrows = all.map((v, i) => { const x0 = 4 * i + (v[0] >= 0 ? 0 : -v[0]), y0 = v[1] >= 0 ? d.int(0, 4 - v[1]) : d.int(-v[1], 4); return { p: [x0, y0], q: [x0 + v[0], y0 + v[1]], name: ['p'].concat(letters)[i], tag: [4 * i + 1.5, 4.9] }; });
      const figure = gridFig({ cols: 19, rows: 4, g: 13, arrows, say: '모눈 위의 다섯 벡터: ' + all.map((v, i) => `${['p'].concat(letters)[i]}는 ${move(v)}`).join(' / ') + '.' });
      return comboPick(d, `모눈 위의 네 벡터 ${letters.map(vec).join(', ')} 가운데 벡터 ${jh(vec('p'), '과/와')} 평행한 것을 있는 대로 고른 것은?`, letters.map(vec), flags, {
        figure, explain: `영벡터가 아닌 두 벡터는 한 벡터가 다른 벡터의 실수배일 때 평행하다(방향이 반대여도 평행하다). 가로·세로로 간 칸의 비가 ${jh(vec('p'), '과/와')} 같은 것은 ${letters.filter((_, i) => flags[i]).map(vec).join(', ')}이다.` });
    }, { count: 2 }),

    // ①29 실수배의 뜻: 설명 → 벡터(차례 1), 벡터 → 설명(차례 2)
    T('scal-def', '실수배의 방향과 크기', '①29', (d, n) => {
      const k = d.pick([Q(2), Q(3), Q(4), Q(1, 2), Q(1, 3), Q(3, 2), Q(2, 3)]), inv = Q(k.q, k.p), neg = d.bool();
      const kH = (q) => (q.q === 1 ? String(q.p) : frac(q.p, q.q));
      if (n === 0) {
        const opts = [[neg ? -1 : 1, k], [neg ? 1 : -1, k], [neg ? -1 : 1, inv], [neg ? 1 : -1, inv]].map(([s, q]) => lcH([Q(s * q.p, q.q)], ['a']));
        return pickOne(d, `영벡터가 아닌 벡터 ${jh(vec('a'), '에/에')} 대하여 ${jh(vec('a'), '과/와')} 방향이 ${neg ? '반대이고' : '같고'} 크기가 |${vec('a')}|의 ${kH(k)}배인 벡터는?`, opts.map((h, i) => ({ h, ok: i === 0 })), {
          explain: `실수 ${V('k')}에 대하여 ${V('k')}${jh(vec('a'), '은/는')} ${V('k')} &gt; 0이면 ${jh(vec('a'), '과/와')} 같은 방향, ${V('k')} &lt; 0이면 반대 방향이고 크기는 |${V('k')}||${vec('a')}|이다. 따라서 ${jh(opts[0], '이다/이다')}.` });
      }
      const given = lcH([Q((neg ? -1 : 1) * k.p, k.q)], ['a']);
      const say = (same1, q) => `${jh(vec('a'), '과/와')} 방향이 ${same1 ? '같고' : '반대이고'}, 크기는 |${vec('a')}|의 ${kH(q)}배이다.`;
      const rows = [[!neg, k, true], [neg, k, false], [!neg, inv, false], [neg, inv, false]].map(([s, q, ok]) => ({ h: say(s, q), ok }));
      return pickOne(d, `영벡터가 아닌 벡터 ${jh(vec('a'), '에/에')} 대하여 벡터 ${jh(given, '에/에')} 대한 설명으로 옳은 것은?`, rows, {
        explain: `${jh(given, '은/는')} 실수배의 계수가 ${neg ? '음수이므로 방향이 반대' : '양수이므로 방향이 같고'}${neg ? '이고' : ''}, 크기는 계수의 절댓값 ${kH(k)}배이다.` });
    }, { count: 2 }),

    // ①30 실수배가 섞인 식 간단히 하기(차례 1 두 벡터, 차례 2 세 벡터 — 분수 배가 끼고 한 항이 사라지기도 한다)
    T('scal-calc', '실수배가 섞인 벡터의 식 간단히 하기', '①30', (d, n) => {
      const nv = n === 0 ? 2 : 3, names = nv === 2 ? ['a', 'b'] : ['a', 'b', 'c'];
      const inner = () => names.map(() => d.pick([-3, -2, -1, 1, 2, 3]));
      let p, q, u = inner(), w = inner(), frac0 = false;
      if (n === 1 && d.bool()) { frac0 = true; const den = d.pick([2, 3, 4]), top = d.pick([1, 3].filter((t) => gcd(t, den) === 1)); p = Q(top, den); q = Q(-top, den); w = u.map((x) => x - den * d.int(-1, 1)); }
      else { p = Q(d.pick([2, 3, 4, -2, -3])); q = Q(d.pick([2, 3, -2, -3, 1, -1])); }
      const c = names.map((_, i) => num(p) * u[i] + num(q) * w[i]);
      if (!c.every((x) => Number.isInteger(Math.round(x * 1e9) / 1e9)) || c.every((x) => x === 0) || c.some((x) => Math.abs(x) > 20)) return null;
      const ci = c.map((x) => Math.round(x) + 0);
      if (frac0 && w.every((x, i) => x === u[i])) return null;
      const par = (k, v) => (k.p < 0 ? MINUS : '') + (Math.abs(k.p) === 1 && k.q === 1 ? '' : coefH(k)) + `(${lcH(v, names)})`;
      const kH = (k) => (k.q === 1 ? pn(k.p) : (k.p < 0 ? '(' + MINUS : '') + frac(Math.abs(k.p), k.q) + (k.p < 0 ? ')' : ''));
      const expr = `${par(p, u)} ${q.p < 0 ? MINUS : '+'} ${par(Q(Math.abs(q.p), q.q), w)}`;
      return lcAns(`다음 식을 간단히 하시오. ${nb(expr)}`, null, ci, names, {
        explain: `분배법칙으로 괄호를 풀고 같은 벡터끼리 모은다. ${names.map((nm, i) => `${vn(nm)}의 계수는 ${kH(p)} × ${pn(u[i])} + ${kH(q)} × ${pn(w[i])} = ${sn(ci[i])}`).join(', ')}이다. 따라서 ${lcH(ci, names)}이다.`,
        facts: { calc: ci.map((_, i) => [`(${jsn(p.p)}*${jsn(u[i])}+${jsn(q.p)}*${jsn(w[i])})/${p.q}`, i]) } });
    }, { count: 2 }),

    // ①31 벡터에 대한 방정식(차례 1 ax⃗ 가 한쪽에만, 차례 2 x⃗ 가 양쪽에 — 괄호가 끼는 꼴)
    T('scal-eq', '벡터에 대한 방정식 풀기', '①31', (d, n) => {
      const x = [d.int(-4, 4), d.int(-4, 4)];
      if (x.every((v) => v === 0)) return null;
      let eqH, cs, why;
      if (n === 0) {
        const m = d.pick([2, 3, 4]), a1 = d.int(-3, 3), b1 = d.int(-3, 3), g = a1 + m * x[0], h = b1 + m * x[1];
        if (Math.abs(g) > 15 || Math.abs(h) > 15 || (!a1 && !b1)) return null;
        eqH = `${lcH([a1, b1], ['a', 'b'])} + ${m}${vec('x')} = ${lcH([g, h], ['a', 'b'])}`;
        why = `${m}${vec('x')} = ${lcH([g, h], ['a', 'b'])} ${MINUS} (${lcH([a1, b1], ['a', 'b'])}) = ${lcH([g - a1, h - b1], ['a', 'b'])}이므로 ${vec('x')} = ${lcH(x, ['a', 'b'])}`;
        cs = [[`(${jsn(g)}-${jsn(a1)})/${m}`, 0], [`(${jsn(h)}-${jsn(b1)})/${m}`, 1]];
      } else {
        // p b⃗ − x⃗ = q(r x⃗ + s a⃗ + t b⃗)  →  −(1 + qr) x⃗ = qs a⃗ + (qt − p) b⃗
        const qv = d.pick([2, 3]), r = d.pick([1, 2]), t = d.int(-4, 4), D = -(1 + qv * r), s = D * x[0] / qv;
        const pv = qv * t - D * x[1];
        if (!Number.isInteger(s) || pv === 0 || Math.abs(pv) > 15 || s === 0 || Math.abs(s) > 7) return null;
        eqH = `${lcH([0, pv], ['a', 'b'])} ${MINUS} ${vec('x')} = ${qv}(${r === 1 ? '' : r}${vec('x')} ${s < 0 ? MINUS : '+'} ${Math.abs(s) === 1 ? '' : Math.abs(s)}${vec('a')}${t ? ` ${t < 0 ? MINUS : '+'} ${Math.abs(t) === 1 ? '' : Math.abs(t)}${vec('b')}` : ''})`;
        why = `괄호를 풀어 ${vec('x')}를 한쪽으로 모으면 ${MINUS}${1 + qv * r}${vec('x')} = ${lcH([qv * s, qv * t - pv], ['a', 'b'])}이므로 ${vec('x')} = ${lcH(x, ['a', 'b'])}`;
        cs = [[`(${qv}*${jsn(s)})/(0-1-${qv}*${r})`, 0], [`(${qv}*${jsn(t)}-${jsn(pv)})/(0-1-${qv}*${r})`, 1]];
      }
      return lcAns(`다음 등식을 만족시키는 벡터 ${jh(vec('x'), '을/를')} ${vlist(ab)}로 나타내시오. ${nb(eqH)}`, vec('x'), x, ['a', 'b'], { explain: `${why}이다.`, facts: { calc: cs } });
    }, { count: 2 }),

    // ①31(중18) 두 벡터의 등식에서 a⃗ = kb⃗ 의 k(「평행함을 보이시오」→ 배수 k를 묻는다). 답은 늘 정수가 아닌 분수.
    T('scal-eqk', '두 벡터의 등식에서 배수 구하기', '①31', (d) => {
      const c1 = d.pick([Q(1, 2), Q(2), Q(3), Q(1, 3)]), c2 = d.pick([Q(2), Q(3), Q(1, 2), Q(4)]), u = d.int(1, 7), w = d.pick([Q(1, 2), Q(1), Q(2), Q(1, 3)]);
      const top = num(c2) + num(c1) * u, bot = num(c1) + num(c2) * num(w), k = rat(top / bot);
      if (!k || k.q === 1 || Math.abs(k.p) > 40 || k.q > 12) return null;
      const kh = (q) => (q.p === 1 && q.q === 1 ? '' : q.q === 1 ? String(q.p) : frac(q.p, q.q));
      const L = `${kh(c1)}(${vec('a')} ${MINUS} ${u === 1 ? '' : u}${vec('b')})`, R = `${kh(c2)}(${vec('b')} ${MINUS} ${kh(w)}${vec('a')})`;
      const jq = (q) => `(${q.p}/${q.q})`;
      return numA(`영벡터가 아닌 두 벡터 ${vlist(ab)}가 ${nb(L + ' = ' + R)}를 만족시킨다. ${vec('a')} = ${V('k')}${jh(vec('b'), '일/일')} 때, 실수 ${V('k')}의 값은?`, k, {
        explain: `괄호를 풀면 ${lcH([c1, Q(-c1.p * u, c1.q)], ['a', 'b'])} = ${lcH([Q(-c2.p * w.p, c2.q * w.q), c2], ['a', 'b'])}이다. ${vec('a')}를 왼쪽, ${vec('b')}를 오른쪽으로 모으면 ${lcH([rat(bot)], ['a'])} = ${lcH([rat(top)], ['b'])}이므로 ${vec('a')} = ${lcH([k], ['b'])}, ${V('k')} = ${frac(k.p, k.q)}이다. ${vec('a')}는 ${vec('b')}의 실수배이므로 두 벡터는 평행하다.`,
        facts: { value: `(${jq(c2)}+${jq(c1)}*${u})/(${jq(c1)}+${jq(c2)}*${jq(w)})` } });
    }),

    // ①32 조건 ㈎·㈏를 이어 대입해 벡터의 크기
    T('scal-cond', '조건을 대입해 벡터의 크기 구하기', '①32', (d) => {
      const m = d.pick([2, 3, -2]), g = d.pick([1, 2, 3]), t = d.int(-3, 5), beta = d.pick([1, 2, 3]), Lv = d.pick([2, 4, 6, 3]);
      const pv = t * (1 + g), cnum = (t - m) * Lv;
      if (t === m || pv === 0 || cnum % beta !== 0) return null;
      const ans = Math.abs(cnum / beta);
      const bc = `${vec('b')} + ${beta === 1 ? '' : beta}${vec('c')}`;
      const cond = lines([`㈎ ${kx(m)}${vec('a')} = ${vec('b')}, |${vec('a')}| = ${Lv}`, `㈏ ${kx(pv)}${vec('a')} ${MINUS} (${bc}) = ${g === 1 ? '' : g}(${bc})`]);
      return N(`세 벡터 ${vlist(abc)}가 다음 조건을 만족시킬 때, ${absH(vec('c'))}의 값은?`, ans, {
        figure: cond,
        explain: `㈏에서 ${kx(pv)}${vec('a')} = ${1 + g}(${bc})이므로 ${bc} = ${t === 0 ? ZV : kx(t) + vec('a')}이다. ㈎의 ${vec('b')} = ${kx(m)}${jh(vec('a'), '을/를')} 대입하면 ${kx(beta)}${vec('c')} = ${kx(t - m)}${vec('a')}, ${vec('c')} = ${lcH([Q(t - m, beta)], ['a'])}이다. 따라서 |${vec('c')}| = ${beta === 1 ? Math.abs(t - m) : frac(Math.abs(t - m), beta)} × ${Lv} = ${ans}이다.`,
        facts: { calc: [[`(${jsn(pv)}/(1+${g})-(${jsn(m)}))*${Lv}/${beta}*${cnum < 0 ? '(0-1)' : '1'}`, 0]] } });
    }),

    // ①33 평행하지 않은 두 벡터로 된 등식의 계수 비교(원문 m + n → m, n 을 칸마다)
    T('scal-coef', '평행하지 않은 두 벡터의 계수 비교', '①33', (d) => {
      const p = d.pick([1, 2, 3, 4]), nn = d.int(-4, 4), qv = p * (nn + 1), m = p + nn;
      if (nn === 0 || nn === -1 || m === 0 || m === nn) return null;
      const L = `(${V('m')} ${MINUS} ${V('n')})(${vec('a')} + ${vec('b')})`, R = `${p === 1 ? '' : p}(${vec('a')} ${MINUS} ${V('n')}${vec('b')}) ${qv < 0 ? MINUS : '+'} ${Math.abs(qv) === 1 ? '' : Math.abs(qv)}${vec('b')}`;
      const qj = jsn(qv);
      return inline(`서로 평행하지 않고 영벡터가 아닌 두 벡터 ${vlist(ab)}에 대하여 ${nb(L + ' = ' + R)}일 때, 두 실수 ${V('m')}, ${V('n')}의 값을 구하시오.`, nb(`${V('m')} = {0}`) + ', ' + nb(`${V('n')} = {1}`), [{ answer: m, signed: true }, { answer: nn, signed: true }], {
        shown: `${V('m')} = ${sn(m)}, ${V('n')} = ${sn(nn)}`,
        explain: `오른쪽을 정리하면 ${kx(p)}${vec('a')} + (${sn(qv)} ${MINUS} ${kx(p)}${V('n')})${vec('b')}이다. ${vlist(ab)}가 평행하지 않으므로 계수가 각각 같다: ${V('m')} ${MINUS} ${V('n')} = ${p}, ${V('m')} ${MINUS} ${V('n')} = ${sn(qv)} ${MINUS} ${kx(p)}${V('n')}. 두 식에서 ${p === 1 ? '' : `${p}${V('n')} = ${sn(qv - p)}, `}${V('n')} = ${sn(nn)}, ${V('m')} = ${sn(m)}이다.`,
        facts: { calc: [[`${p}+(${qj}-${p})/${p}`, 0], [`(${qj}-${p})/${p}`, 1]] } });
    })
  ];

  // 같은 단원의 b·c 파일이 쓰는 도구
  B.kit.u46 = {
    S1, T, H, stripH, num, vadd, vsub, vmul, vlin, vlen, same, isZero, parallel, rat, coefs, intCoefs, vecOf, segsOf, rev, formal, asOne, formalH, termsH,
    vn, ZV, coefH, lcH, jsn, sn, pn, kx, ab, abc, vlist, sqf, attr, LENS, ZNOTE, lcAns, lenAns, numA, pickOne, comboPick, GA,
    absH, BLUE, INK, arrowTo, vname, drawFig, fig2, fig3, gridFig, panels, move, centerStart,
    HEX, HEX_EDGES, PARA, TRI, box, BOX_EDGES, BOX_HID, TET, TET_VIEW, OCT, OCT_VIEW, OCT_EDGES, OCT_HID, OPP, viaOrigin, S3
  };

  B.addUnit({ id: '11-4-6', grade: 11, semester: 4, no: 6, title: '벡터의 연산', version: 1, groups: [
    { id: 'mean', title: '벡터의 뜻', standard: S1, types: mean },
    { id: 'add', title: '벡터의 덧셈과 뺄셈', standard: S1, types: add },
    { id: 'fig', title: '도형에서 벡터를 다른 벡터로 나타내기', standard: S1, types: fig },
    { id: 'scal', title: '벡터의 실수배', standard: S1, types: scal },
    { id: 'div', title: '중점·내분점·무게중심과 벡터', standard: S1, types: [] },
    { id: 'par', title: '벡터의 평행', standard: S1, types: [] },
    { id: 'size', title: '벡터의 합의 크기와 활용', standard: S1, types: [] }
  ] });
})(typeof window !== 'undefined' ? window : globalThis);
