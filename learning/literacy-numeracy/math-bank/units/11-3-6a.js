// 고등학교 확률과 통계 Ⅲ-1-04 「정규분포」 — 단원 틀·도구와 앞쪽 묶음(정규분포곡선의 성질, 표준정규분포표, 표준화와 확률).
// 수집해 둔 천재 T셀파 확률과 통계(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 33꼴, 심화꼴: 2꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-3-6/싣기_대조표.md 에 있다.
// (확률에서 거꾸로 구하기, 이항분포와 정규분포의 관계는 11-3-6b.js 에, 실력 문항은 11-3-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 성취기준: [12확통03-04] 정규분포의 뜻과 성질을 이해하고, 이항분포와의 관계를 설명할 수 있다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(곡선 그림·식·문장·표), 표준정규분포의 구간 꼴(한쪽 꼬리, 같은 쪽 구간, 0을 걸친 구간, 절댓값),
//    묻는 것(확률·경계 z·평균·표준편차·구간의 끝·사람 수·비율)이 다르면 따로 싣는다. 식으로 준 것과 문장(실생활)으로 준 것은 한 유형의 두 차례로 싣는다.
//  - 교육과정: 「정규분포를 따르는 확률변수에서 확률을 구할 때, 표준정규분포로 변환하여 확률을 구할 수 있게 한다」(적용 시 고려 사항).
//    이 단원 내용에 걸리는 「다루지 않는다」 줄은 없다. 확률밀도함수의 식으로 셈하거나 적분하는 문항은 없다.
//  - 표준정규분포표는 문항마다 쓰는 값과 헷갈릴 값 몇 개를 표(ztab)로 준다. 거꾸로 구하는 문항(①12·13·17)은 표에서 z를 찾게 한다.
//  - 답: 표로 구한 넷째 자리 확률(0.8185)과 비율(68.26 %)은 고르기로 낸다(소수 칸은 첫째 자리까지). 경계 z(1.5, −1.5)는 소수 한 자리 칸으로 받고,
//    음수가 될 수 있는 답에는 부호 단추를 단다. 한 유형 안에서 칸의 모양이 같도록 z는 늘 소수 첫째 자리가 0이 아닌 값으로 고른다.
//  - 정규분포곡선 그림은 이 파일의 bell 로 그린다(공용 plot 은 두 축이 늘 그림 안에 있어야 하므로 평균이 82인 곡선이나 가로축 z, y축을 생략한 교과서 꼴을 그릴 수 없다).
//  - 수와 상황은 새로 썼다. 원문 답이 늘 같던 꼴은 수를 바꾸었다.
//
// 뺀 것과 까닭(11-3-6b.js, 11-3-6c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목의 다른 단원에 있는 일: 근사 정규분포 N(50, σ²)에서 거꾸로 n과 분산 구하기(①27 — 11-3-5 「이항분포의 평균으로 n을 구해 분산」).
//  - 교육과정에 없는 공학 탐구 활동: 이산확률변수의 범위 바꾸기와 연속성을 고려한 근삿값(①33 — 교과서 112쪽, 값은 공학 도구로만 나온다).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 문자는 값을 물으면 「상수 a」, 원문이 「실수 t」라 부른 것은 그대로 둔다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, D, inline } = B.kit;
  const { MINUS, Q, V, sup, nb } = B.kit.mid;
  const { ms, fn, pr, nrm, pw, ztab, jh, svgm, qAns } = B.kit.hs;
  const UNIT = '11-3-6', STD = '12확통03-04';

  // ── 수와 글 ──
  const num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));                       // 정수(음수는 −)
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                             // 검사 식에 적는 수
  const dec = (v) => { const t = String(Number(Number(v).toFixed(4))); return t.startsWith('-') ? MINUS + t.slice(1) : t; };   // 소수(끝의 0을 지운다)
  const zt = (k) => dec(k / 10);                                                     // z(십분의 몇 k): 15 → 1.5, −10 → −1
  const p4 = (n) => '0.' + String(n).padStart(4, '0');                              // 만분의 몇 → 0.0228
  const pct = (n) => (n / 100).toFixed(2) + ' %';                                    // 만분의 몇 → 68.26 %
  const X = ms('X'), Y = ms('Y'), Z = ms('Z'), Mv = V('m'), Sv = V('σ');
  const sq = (s) => pw(dec(s), 2);                                                   // 5²
  const nX = (m, s) => nrm(dec(m), sq(s));                                           // N(82, 5²)
  const Pz = (s) => pr(ms(s));                                                       // P(…) — 글은 ms 로
  const Z01 = nrm(0, 1);

  // 표준정규분포표 P(0 ≤ Z ≤ z)를 만분의 몇으로(z 는 십분의 몇: 15 → 1.5). 수치 적분으로 맞춰 본 값이다.
  const ZT = [0, 398, 793, 1179, 1554, 1915, 2257, 2580, 2881, 3159, 3413, 3643, 3849, 4032, 4192, 4332, 4452, 4554, 4641, 4713, 4772, 4821, 4861, 4893, 4918, 4938, 4953, 4965, 4974, 4981, 4987];
  const zp = (k) => ZT[Math.abs(k)];
  const cdf = (k) => (k == null ? null : 5000 + Math.sign(k) * zp(k));              // P(Z ≤ z) (만분의 몇)
  const cdfE = (k) => (k === 0 ? '5000' : k > 0 ? '(5000+' + ZT[k] + ')' : '(5000-' + ZT[-k] + ')');
  // P(lo ≤ Z ≤ hi) — lo·hi 는 십분의 몇, null 은 끝이 없다는 뜻
  const zval = (lo, hi) => (hi == null ? 10000 : cdf(hi)) - (lo == null ? 0 : cdf(lo));
  const zexpr = (lo, hi) => (hi == null ? '10000' : cdfE(hi)) + '-' + (lo == null ? '0' : cdfE(lo));
  const P0 = (k) => Pz('0 <= Z <= ' + zt(Math.abs(k)));                             // P(0 ≤ Z ≤ 1.5)
  // 표로 구하는 차례를 글로: P(−1 ≤ Z ≤ 0.5) = P(0 ≤ Z ≤ 1) + P(0 ≤ Z ≤ 0.5) = 0.3413 + 0.1915 = 0.5328
  function zSteps(lo, hi) {
    const v = p4(zval(lo, hi)), a = lo == null ? null : Math.abs(lo), b = hi == null ? null : Math.abs(hi);
    if (lo == null && hi == null) return '1';
    if (lo == null) return hi === 0 ? '0.5' : hi > 0 ? `0.5 + ${P0(b)} = 0.5 + ${p4(zp(b))} = ${v}` : `0.5 ${MINUS} ${P0(b)} = 0.5 ${MINUS} ${p4(zp(b))} = ${v}`;
    if (hi == null) return lo === 0 ? '0.5' : lo > 0 ? `0.5 ${MINUS} ${P0(a)} = 0.5 ${MINUS} ${p4(zp(a))} = ${v}` : `0.5 + ${P0(a)} = 0.5 + ${p4(zp(a))} = ${v}`;
    if (lo < 0 && hi > 0) return lo === -hi ? `2${P0(b)} = 2 × ${p4(zp(b))} = ${v}` : `${P0(a)} + ${P0(b)} = ${p4(zp(a))} + ${p4(zp(b))} = ${v}`;
    if (lo === 0 || hi === 0) return `${P0(lo === 0 ? b : a)} = ${v}`;
    const [far, near] = lo > 0 ? [b, a] : [a, b];
    return `${P0(far)} ${MINUS} ${P0(near)} = ${p4(zp(far))} ${MINUS} ${p4(zp(near))} = ${v}`;
  }
  // 표준정규분포표 조각: 쓰는 z 와 헷갈릴 z 몇 개(가까운 곳에서)를 차례로
  function tabOf(d, need, extra) {
    const keys = new Set(need.map((k) => Math.abs(k)).filter((k) => k > 0));
    const pool = [5, 8, 10, 12, 13, 14, 15, 16, 18, 20, 22, 24, 25, 26, 28, 30].filter((k) => !keys.has(k));
    for (const k of d.shuffle(pool).slice(0, extra == null ? 2 : extra)) keys.add(k);
    return ztab([...keys].sort((s, t) => s - t).map((k) => [k / 10, ZT[k] / 10000]));
  }
  // 확률 고르기의 틀린 보기: 흔한 실수(0.5를 빼먹음, 더하기·빼기를 바꿈, 여사건, 표의 값 그대로)로 만든 값에서 넷
  function wrongsOf(d, v, parts) {
    const out = new Set(), add = (x) => { if (x > 0 && x < 10000 && x !== v) out.add(x); };
    const [a, b] = parts.concat([0, 0]);
    [v + 5000, v - 5000, 10000 - v, Math.abs(a - b), a + b, a, b, 5000 + a, 5000 - a, 5000 + b, 5000 - b, 2 * a, 2 * b].forEach(add);
    const list = d.shuffle([...out]).slice(0, 4);
    while (list.length < 4) { const x = v + d.pick([-1, 1]) * d.pick(ZT.slice(2)); if (x > 0 && x < 10000 && x !== v && !list.includes(x)) list.push(x); }
    return list;
  }
  // 확률을 고르는 문항: v(만분의 몇)와 그 값을 표의 수로 다시 셈하는 식(만분의 몇으로 적는다)
  function probQ(d, text, v, expr, parts, o) {
    const opts = [v].concat(wrongsOf(d, v, parts || [])).sort((s, t) => s - t), show = o.show || p4;
    return C(text, opts.map(show), opts.indexOf(v), { figure: o.figure, explain: o.explain, facts: Object.assign({ pick: { expr, options: opts }, derived: [5000, 10000, 2].concat(o.derived || []) }, o.rule ? { rule: o.rule } : {}) });
  }

  // ── 검사 근거 마무리(11-1-7a.js 와 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(facts.derived)가 아닌 수가 나오면 오류를 낸다.
  function seal(item) {
    const f = item.facts || {};
    const derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], f.pick ? [f.pick.expr] : []);
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
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/①/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 답 칸 ──
  const factsOf = (o, base) => Object.assign(base, o.derived ? { derived: o.derived } : {}, o.rule ? { rule: o.rule } : {});
  // 정수 하나. o.signed: 부호 단추(음수가 될 수 있는 답), o.value: 다시 셈하는 식
  const numQ = (text, answer, o) => N(text, answer, { signed: Boolean(o.signed), unit: o.unit, figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 소수 한 자리 하나(경계 z 따위)
  const decQ = (text, answer, o) => D(text, answer, { signed: Boolean(o.signed), unit: o.unit, figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 하나 고르기: rows 는 { h 글, ok 참인가 }. ok 가 want 인 것이 꼭 하나다(참·거짓은 코드가 셈한 값이다).
  function oneQ(d, text, rows, want, o) {
    const list = o.keep ? rows.slice() : d.shuffle(rows);
    if (list.filter((r) => r.ok === want).length !== 1) return null;
    if (new Set(list.map((r) => stripH(r.h))).size !== list.length) return null;
    const at = list.findIndex((r) => r.ok === want);
    return C(text, list.map((r) => r.h), at, { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: list.map((r) => r.ok), want }, o.rule ? { rule: o.rule } : {}) });
  }
  // 「옳은 것만을 있는 대로 고른 것」(10-2-5a.js 의 setsQ 와 같은 방법): rows 는 { h 글, ok 옳은가, why 까닭 }. 옳은 묶음 하나와, 하나를 빼거나 더하거나 바꾼 틀린 묶음을 섞어 다섯.
  const GA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
  const bogi = (list) => lines(list.map((h, i) => '<span class="mb-tag mb-tag-short">' + GA[i] + '.</span> ' + h));
  function setsQ(d, text, rows, o) {
    const labels = GA.slice(0, rows.length), flags = rows.map((r) => Boolean(r.ok));
    if (!flags.some(Boolean) || flags.every(Boolean)) return null;
    const key = (s) => s.join('|'), right = labels.filter((_, i) => flags[i]), near = [], far = [];
    labels.forEach((_, i) => { const t = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (t.length) near.push(t); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) near.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    for (let m = 1; m < (1 << labels.length); m += 1) far.push(labels.filter((_, k) => (m >> k) & 1));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(near).concat(d.shuffle(far))) { if (out.length === 5) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const sets = out.sort((a, b) => a.length - b.length || key(a).localeCompare(key(b)));
    const why = rows.map((r, i) => labels[i] + '. ' + r.why).join(' ');
    return C(text, sets.map((s) => s.join(', ')), sets.findIndex((s) => key(s) === key(right)), {
      figure: (o.figure || '') + bogi(rows.map((r) => r.h)),
      explain: (o.lead ? o.lead + ' ' : '') + why + ` 따라서 옳은 것은 ${right.join(', ')}이다.`,
      facts: Object.assign({ sets: { labels, flags, options: sets } }, o.rule ? { rule: o.rule } : {})
    });
  }

  // ── 정규분포곡선 그림 ──
  // bell(o): 가로축 하나에 정규분포곡선을 그린다(교과서처럼 세로축은 생략한다).
  //  o.lo, o.hi 가로축의 범위, o.axis 가로축 이름('x'·'z'), o.curves [{ m, s, name, color }], o.fills [{ c 곡선 차례, from, to }](null 은 끝까지),
  //  o.ticks [{ v, t }] 눈금과 그 밑의 글(svgm 글), o.guides [{ c, x }] 가로축에서 곡선까지 점선, o.say 그림 설명에 덧붙일 말.
  const SQ2PI = Math.sqrt(2 * Math.PI), INK = '#1f2933', HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const HUES = ['#1d4ed8', '#b42318', '#15803d'];
  const dens = (c, x) => Math.exp(-((x - c.m) ** 2) / (2 * c.s * c.s)) / (c.s * SQ2PI);
  const r1 = (v) => Math.round(v * 10) / 10;
  const textW = (s, fs) => [...String(s).replace(/[{}^_]/g, '')].reduce((w, ch) => w + (/[가-힣]/.test(ch) ? 1 : 0.6), 0) * fs;
  function bell(o) {
    const W = o.w || 266, Lp = 10, Rp = 26, top = 22, Hh = o.h || 86, lo = o.lo, hi = o.hi, u = (W - Lp - Rp) / (hi - lo);
    const peak = Math.max(...o.curves.map((c) => dens(c, c.m))), vy = Hh / peak;
    const Xp = (x) => Lp + (x - lo) * u, Yp = (y) => top + Hh - y * vy, Y0 = top + Hh;
    const back = [], mid = [], front = [];
    for (const fl of o.fills || []) {
      const c = o.curves[fl.c || 0], a = Math.max(fl.from == null ? lo : fl.from, lo), b = Math.min(fl.to == null ? hi : fl.to, hi), pts = [];
      for (let i = 0; i <= 120; i += 1) { const x = a + (b - a) * i / 120; pts.push(r1(Xp(x)) + ' ' + r1(Yp(dens(c, x)))); }
      back.push(`<path d="M${r1(Xp(a))} ${Y0}L${pts.join('L')}L${r1(Xp(b))} ${Y0}Z" style="fill:rgba(37,99,235,0.24);stroke:none"/>`);
    }
    for (const g of o.guides || []) { const c = o.curves[g.c || 0]; mid.push(`<line x1="${r1(Xp(g.x))}" y1="${Y0}" x2="${r1(Xp(g.x))}" y2="${r1(Yp(dens(c, g.x)))}" style="stroke:#5b6770;stroke-width:1;stroke-dasharray:3 2"/>`); }
    o.curves.forEach((c, i) => {
      const pts = [];
      for (let k = 0; k <= 220; k += 1) { const x = lo + (hi - lo) * k / 220; pts.push(r1(Xp(x)) + ' ' + r1(Yp(dens(c, x)))); }
      mid.push(`<path d="M${pts.join('L')}" style="fill:none;stroke:${c.color || HUES[i % 3]};stroke-width:1.8;stroke-linejoin:round"/>`);
    });
    back.push(`<line x1="${Lp - 6}" y1="${Y0}" x2="${W - Rp + 8}" y2="${Y0}" style="stroke:${INK};stroke-width:1.2"/><path d="M${W - Rp + 14} ${Y0}l-7 -3.4v6.8z" style="fill:${INK}"/>`);
    front.push(`<text x="${W - Rp + 17}" y="${Y0 + 4}" style="font-size:13px;fill:${INK}">${svgm(o.axis || 'x')}</text>`);
    // 눈금 글: 앞 글과 겹치면 한 줄 아래에 적는다
    let lastEnd = -Infinity, row = 0, rows = 1;
    for (const t of (o.ticks || []).slice().sort((s, q) => s.v - q.v)) {
      const x = Xp(t.v), w = textW(t.t, 12);
      front.push(`<line x1="${r1(x)}" y1="${Y0 - 3}" x2="${r1(x)}" y2="${Y0 + 3}" style="stroke:${INK};stroke-width:1"/>`);
      row = x - w / 2 < lastEnd + 8 && row === 0 ? 1 : 0; rows = Math.max(rows, row + 1);
      front.push(`<text x="${r1(x)}" y="${Y0 + 16 + row * 14}" text-anchor="middle" style="font-size:12px;fill:${INK};${HALO}">${svgm(t.t)}</text>`);
      if (row === 0) lastEnd = x + w / 2;
    }
    // 곡선 이름: 꼭대기 위가 다른 곡선·점선에 걸리면(대칭축이 같은 두 곡선) 어깨 바깥쪽에 적는다
    const guideXs = (o.guides || []).map((g) => Xp(g.x));
    // 다른 곡선이 글 상자를 지나가거나 글 위를 덮으면(글이 다른 곡선 안에 들어가면) 막힌 자리다
    const blocked = (c, bx0, by0, bx1, by1) => o.curves.some((e) => e !== c && Array.from({ length: 13 }, (_, i) => bx0 + (bx1 - bx0) * i / 12).some((px) => { const py = Yp(dens(e, lo + (px - Lp) / u)); return py < by1 + 2; }))
      || guideXs.some((gx) => gx > bx0 - 2 && gx < bx1 + 2 && by1 > top);
    for (const [ci, c] of o.curves.entries()) {
      if (!c.name) continue;
      const w = textW(c.name, 12.5), spots = [[c.m, 0, -6, 'middle']].concat([1, -1].map((sg) => [c.m + sg * 1.7 * c.s, sg * 5, -3, sg > 0 ? 'start' : 'end']));
      const fit = spots.map(([x, dx, dy, an]) => { const px = Xp(x) + dx, py = Yp(dens(c, x)) + dy, x0 = an === 'middle' ? px - w / 2 : an === 'start' ? px : px - w; return { px, py, an, box: [x0, py - 10, x0 + w, py + 2] }; })
        .find((s) => s.box[0] > 0 && s.box[2] < W && !blocked(c, ...s.box)) || null;
      const s = fit || { px: Xp(c.m), py: Yp(dens(c, c.m)) - 6, an: 'middle' };
      front.push(`<text x="${r1(s.px)}" y="${r1(s.py)}" text-anchor="${s.an}" style="font-size:12.5px;fill:${c.color || HUES[ci % 3]};${HALO}">${svgm(c.name)}</text>`);
    }
    const said = ['정규분포곡선 그림. 가로축 ' + (o.axis || 'x')];
    if ((o.ticks || []).length) said.push('가로축 눈금: ' + o.ticks.map((t) => t.t.replace(/-/g, '−')).join(', '));
    const named = o.curves.filter((c) => c.name).map((c) => c.name);
    if (named.length) said.push('곡선 ' + named.join(', '));
    if (o.say) said.push(o.say);
    const Hall = Y0 + 20 + rows * 14;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hall}" width="${W}" role="img" aria-label="${said.join('. ').replace(/"/g, '&quot;')}.">${back.join('')}${mid.join('')}${front.join('')}</svg>`;
  }
  // 표 아래위로 그림과 표를 함께 놓는다
  const both = (fig, tab) => fig + '<div style="margin-top:6px">' + tab + '</div>';

  // 다른 파일(b·c)이 함께 쓰는 도구
  B.kit.u1136 = {
    UNIT, STD, num, jn, dec, zt, p4, pct, X, Y, Z, Mv, Sv, sq, nX, Pz, Z01, ZT, zp, cdf, zval, zexpr, P0, zSteps, tabOf, wrongsOf, probQ,
    stripH, seal, retry, srcOf, T, H, numQ, decQ, oneQ, setsQ, bogi, GA, dens, bell, both
  };

  B.addUnit({
    id: '11-3-6', grade: 11, semester: 3, no: 6, title: '정규분포', version: 1,
    groups: [
      { id: 'curve', title: '정규분포의 뜻과 정규분포곡선의 성질', standard: STD, types: [] },
      { id: 'ztable', title: '표준정규분포와 표준정규분포표', standard: STD, types: [] },
      { id: 'std', title: '정규분포의 표준화와 확률', standard: STD, types: [] },
      { id: 'back', title: '확률에서 거꾸로 — 평균·표준편차·경계', standard: STD, types: [] },
      { id: 'binom', title: '이항분포와 정규분포의 관계', standard: STD, types: [] }
    ]
  });

  // ════════════════════════════════════════════════════════════════
  // ── 정규분포의 뜻과 정규분포곡선의 성질 ──
  // 곡선 셋: 평균과 표준편차(눈으로 가를 수 있게 1.6배 넘게 다르게)
  const SDS = [0.55, 1, 1.7];
  B.addTypes(UNIT, 'curve', [
    T('curve-write', '평균과 표준편차로 정규분포를 N(m, σ²) 꼴로 쓰기', '①1', (d) => {
      const m = d.int(15, 180), s = d.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]);
      return inline(`확률변수 ${jh(X, '이/가')} ${nb(fn('E') + '(' + X + ') = ' + m)}, ${nb(Sv + '(' + X + ') = ' + s)}인 정규분포를 따를 때, ${jh(X, '이/가')} 따르는 정규분포를 ${nrm('m', 'σ^2')} 꼴로 나타내시오.`,
        `${fn('N')}({0}, {1})`, [{ answer: m }, { answer: s * s }], {
          shown: nX(m, s),
          explain: `정규분포 ${nrm('m', 'σ^2')}에서 둘째 자리는 분산이다. 평균이 ${m}, 분산이 ${s}${sup(2)} = ${s * s}이므로 ${nX(m, s)}이다.`,
          facts: { calc: [[`${m}`, 0], [`${s}*${s}`, 1]] }
        });
    }),

    T('curve-pick', '정규분포곡선 셋의 그림에서 평균·표준편차가 가장 큰 확률변수', '①2', (d) => {
      const means = d.shuffle([0, 3.6, 7.2]), sds = d.shuffle(SDS.slice());
      const names = ['X', 'Y', 'Z'], curves = means.map((m, i) => ({ m, s: sds[i] }));
      // 왼쪽부터 (가), (나), (다)를 붙이고 X, Y, Z 를 섞어 맡긴다
      const order = curves.map((c, i) => i).sort((p, q) => curves[p].m - curves[q].m), who = d.shuffle(names.slice());
      const tag = ['(가)', '(나)', '(다)'];
      order.forEach((ci, j) => { curves[ci].name = tag[j]; curves[ci].v = who[j]; });
      const topM = curves.reduce((s, c) => (c.m > s.m ? c : s)), topS = curves.reduce((s, c) => (c.s > s.s ? c : s));
      const right = topM.v + ', ' + topS.v, pairs = [];
      for (const p of names) for (const q of names) pairs.push(p + ', ' + q);
      const rows = [right].concat(d.shuffle(pairs.filter((t) => t !== right)).slice(0, 4)).map((t) => ({ h: t.split(', ').map((v) => ms(v)).join(', '), ok: t === right }));
      const lo = Math.min(...curves.map((c) => c.m - 3.3 * c.s)), hi = Math.max(...curves.map((c) => c.m + 3.3 * c.s));
      const fig = bell({ lo, hi, axis: 'x', curves: order.map((i) => curves[i]), guides: order.map((i, j) => ({ c: j, x: curves[i].m })), say: '세 곡선 (가), (나), (다)는 왼쪽부터 차례로 놓여 있다' });
      const tagOf = (v) => curves.find((c) => c.v === v).name;
      return oneQ(d, `그림에서 세 곡선 (가), (나), (다)는 각각 정규분포를 따르는 세 확률변수 ${ms(who[0])}, ${ms(who[1])}, ${ms(who[2])}의 확률밀도함수의 그래프이다. 평균이 가장 큰 확률변수와 표준편차가 가장 큰 확률변수를 차례로 나열한 것은?`, rows, true, {
        figure: fig,
        explain: `대칭축이 가장 오른쪽에 있는 곡선은 ${tagOf(topM.v)}이므로 평균이 가장 큰 확률변수는 ${ms(topM.v)}이다. 높이가 가장 낮고 양쪽으로 가장 넓게 퍼진 곡선은 ${tagOf(topS.v)}이므로 표준편차가 가장 큰 확률변수는 ${ms(topS.v)}이다.`
      });
    }),

    T('curve-shift', '평행이동·같은 대칭축을 말로 준 곡선 셋에서 옳은 말 고르기', '①3', (d) => {
      const right = d.bool(), wide = d.bool(), s = 1, sC = wide ? 1.7 : 0.6, mA = right ? 2.6 : 6.6, mB = right ? 6.6 : 2.6;
      const cs = [{ m: mA, s, name: '(가)' }, { m: mB, s, name: '(나)' }, { m: mB, s: sC, name: '(다)' }];
      const A = { m: mA, s }, Bq = { m: mB, s }, Cq = { m: mB, s: sC };
      const sc = (t) => `${t} 학교 학생들의 수학 성적`;
      const pool = [
        { h: `A 학교보다 ${sc('B')}의 평균이 크다.`, ok: Bq.m > A.m, why: `곡선 (나)의 대칭축이 (가)보다 ${Bq.m > A.m ? '오른쪽' : '왼쪽'}에 있다.`, k: 'mAB' },
        { h: `A 학교와 ${sc('B')}의 평균은 같다.`, ok: false, why: '곡선 (나)는 (가)를 평행이동한 것이라 대칭축이 다르다.', k: 'mAB' },
        { h: `B 학교와 ${sc('C')}의 평균은 같다.`, ok: true, why: '곡선 (나), (다)의 대칭축이 같다.', k: 'mBC' },
        { h: `A 학교보다 ${sc('C')}의 평균이 크다.`, ok: Cq.m > A.m, why: `곡선 (다)의 대칭축은 (나)와 같고 (가)보다 ${Cq.m > A.m ? '오른쪽' : '왼쪽'}에 있다.`, k: 'mAC' },
        { h: `A 학교보다 ${sc('B')}이 더 고르다.`, ok: false, why: '평행이동한 곡선은 모양이 같으므로 두 학교의 표준편차가 같다.', k: 'sAB' },
        { h: `A 학교와 ${sc('B')}의 표준편차는 같다.`, ok: true, why: '평행이동한 곡선은 모양이 같으므로 표준편차가 같다.', k: 'sAB' },
        { h: `C 학교 학생들의 수학 성적의 표준편차가 가장 크다.`, ok: sC > s, why: `곡선 (다)는 (나)보다 ${sC > s ? '낮고 넓게 퍼져 표준편차가 더 크다' : '높고 좁아 표준편차가 더 작다'}.`, k: 'sC' },
        { h: `C 학교 학생들의 수학 성적이 가장 고르다.`, ok: sC < s, why: `성적이 고를수록 표준편차가 작고 곡선이 높고 좁다. 곡선 (다)는 (나)보다 ${sC < s ? '높고 좁다' : '낮고 넓다'}.`, k: 'sC' }
      ];
      const picked = [];
      for (const r of d.shuffle(pool)) { if (picked.length === 4) break; if (!picked.some((q) => q.k === r.k)) picked.push(r); }
      if (picked.length < 4) return null;
      const lo = Math.min(mA, mB) - 3.3 * Math.max(s, sC), hi = Math.max(mA, mB) + 3.3 * Math.max(s, sC);
      return setsQ(d, `그림에서 세 곡선 (가), (나), (다)는 각각 세 학교 A, B, C 학생들의 수학 성적의 확률밀도함수의 그래프이고, 모두 정규분포곡선이다. 곡선 (나)는 곡선 (가)를 ${ms('x')}축의 ${right ? '양' : '음'}의 방향으로 평행이동한 것이고, 두 곡선 (나), (다)의 대칭축은 서로 같다. 다음 보기에서 옳은 것만을 있는 대로 고른 것은?`, picked, {
        figure: bell({ lo, hi, axis: 'x', curves: cs, guides: [{ c: 0, x: mA }, { c: 1, x: mB }], say: `곡선 (나)는 (가)와 모양이 같고 ${right ? '오른쪽' : '왼쪽'}에 있다. 곡선 (다)는 (나)와 대칭축이 같고 (나)보다 ${wide ? '낮고 넓다' : '높고 좁다'}` })
      });
    }),

    T('curve-facts', '정규분포곡선의 성질 — 참·거짓', '①4', (d) => {
      const xm = ms('x = m');
      const topics = [
        [{ h: `곡선은 직선 ${xm}에 대하여 대칭이다.`, ok: true, why: `정규분포곡선은 직선 ${xm}에 대하여 대칭인 종 모양이다.` },
          { h: `곡선은 직선 ${ms('x = σ')}에 대하여 대칭이다.`, ok: false, why: `대칭축은 평균의 자리 ${xm}이다.` }],
        [{ h: `곡선과 ${ms('x')}축 사이의 넓이는 1이다.`, ok: true, why: `확률밀도함수의 그래프와 ${ms('x')}축 사이의 넓이는 늘 1이다.` },
          { h: `곡선과 ${ms('x')}축 사이의 넓이는 ${jh(Sv, '이/가')} 클수록 크다.`, ok: false, why: `곡선과 ${ms('x')}축 사이의 넓이는 ${Sv}와 상관없이 늘 1이다.` }],
        [{ h: `${jh(Sv, '이/가')} 일정할 때, ${jh(Mv, '이/가')} 커지면 곡선의 모양은 변하지 않고 대칭축만 오른쪽으로 옮겨진다.`, ok: true, why: `${jh(Sv, '이/가')} 같으면 곡선의 모양이 같고, 대칭축 ${xm}만 움직인다.` },
          { h: `${jh(Sv, '이/가')} 일정할 때, ${jh(Mv, '이/가')} 커지면 곡선의 높이가 낮아진다.`, ok: false, why: `${jh(Sv, '이/가')} 같으면 ${jh(Mv, '이/가')} 달라져도 곡선의 모양(높이)은 변하지 않는다.` }],
        [{ h: `${jh(Mv, '이/가')} 일정할 때, ${jh(Sv, '이/가')} 커지면 곡선의 높이는 낮아지고 양쪽으로 넓게 퍼진다.`, ok: true, why: `${jh(Sv, '이/가')} 커지면 대칭축은 그대로이고 곡선이 낮아지며 넓게 퍼진다.` },
          { h: `${jh(Mv, '이/가')} 일정할 때, ${jh(Sv, '이/가')} 커지면 곡선의 높이는 높아지고 좁아진다.`, ok: false, why: `${jh(Sv, '이/가')} 커지면 곡선은 낮아지고 넓게 퍼진다.` }],
        [{ h: `곡선은 ${ms('x')}축을 점근선으로 갖는다.`, ok: true, why: `곡선은 ${ms('x')}축에 한없이 가까워지지만 만나지 않는다.` },
          { h: `곡선은 ${ms('x')}축과 두 점에서 만난다.`, ok: false, why: `곡선은 ${ms('x')}축을 점근선으로 가져 ${ms('x')}축과 만나지 않는다.` }]
      ];
      const rows = d.shuffle(topics).slice(0, 3).map((t) => d.pick(t));
      return setsQ(d, `확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nrm('m', 'σ^2'), '을/를')} 따를 때, ${X}의 확률밀도함수의 그래프에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은?`, rows, {});
    }),

    T('curve-axis', '두 꼬리 확률이 같은 조건과 분산으로 평균·표준편차 구하기', '①5', (d) => {
      const m = d.int(-6, 14), t = d.int(3, 12), a = m - t, b = m + t, s = d.int(2, 7), c = d.pick([2, 3, -2, -3, 4]), e = d.pick([-5, -3, -1, 1, 2, 4, 7]);
      const V2 = c * c * s * s, lin = (c < 0 ? MINUS + Math.abs(c) : c) + X + (e < 0 ? ` ${MINUS} ${-e}` : ` + ${e}`);
      return inline(`정규분포 ${jh(nrm('m', 'σ^2'), '을/를')} 따르는 확률변수 ${jh(X, '이/가')} 다음 조건을 만족시킬 때, ${jh(Mv, '과/와')} ${Sv}의 값을 구하시오. (단, ${nb(Sv + ' &gt; 0')})`,
        `${Mv} = {0}, ${Sv} = {1}`, [{ answer: m, signed: true }, { answer: s }], {
          figure: lines([`(가) ${nb(Pz('X <= ' + num(a)) + ' = ' + Pz('X >= ' + num(b)))}`, `(나) ${nb(fn('V') + '(' + lin + ') = ' + V2)}`]),
          shown: `${Mv} = ${num(m)}, ${Sv} = ${s}`,
          explain: `정규분포곡선은 직선 ${ms('x = m')}에 대하여 대칭이므로 (가)에서 ${Mv} = ${frac(num(a) + ' + ' + (b < 0 ? '(' + num(b) + ')' : b), 2)} = ${num(m)}이다. (나)에서 ${fn('V')}(${lin}) = ${c * c}${fn('V')}(${X}) = ${c * c}${Sv}${sup(2)} = ${V2}이므로 ${Sv}${sup(2)} = ${s * s}, ${Sv} = ${s}이다.`,
          facts: { calc: [[`(${jn(a)}+${jn(b)})/2`, 0], [`(${V2}/(${jn(c)}*${jn(c)}))**0.5`, 1]], derived: [2, 0.5] }
        });
    }),

    T('curve-maxpos', '길이가 일정한 구간의 확률이 최대가 되는 자리', '①6', (d) => {
      const m = d.int(20, 90), s = d.int(2, 9), L = d.pick([2, 4, 6, 8, 10]), a = m - L / 2;
      return numQ(`정규분포 ${jh(nX(m, s), '을/를')} 따르는 확률변수 ${X}에 대하여 ${jh(Pz('a <= X <= a + ' + L), '이/가')} 최대가 되도록 하는 상수 ${V('a')}의 값은?`, a, {
        explain: `정규분포곡선은 직선 ${ms('x = ' + m)}에 대하여 대칭이므로 길이가 ${L}인 구간의 확률은 구간의 가운데가 ${m}일 때 가장 크다. ${frac(ms('a + (a + ' + L + ')'), 2)} = ${m}에서 ${ms('a = ' + a)}이다.`,
        value: `${m}-${L}/2`, derived: [2]
      });
    }),

    T('curve-maxval', '길이가 일정한 구간의 확률의 최댓값', '①7', (d) => {
      const k = d.pick([1, 2, 3]), s = d.int(2, 6), L = 2 * k * s;
      const rowsT = [[1, 3413], [2, 4772], [3, 4987]];
      const tab = `<table class="mb-table" aria-label="표: x가 m + σ일 때 0.3413, m + 2σ일 때 0.4772, m + 3σ일 때 0.4987"><tbody><tr><th>${ms('x')}</th> <th>${Pz('m <= X <= x')}</th></tr> ${rowsT.map(([j, p]) => `<tr><td>${ms('m + ' + (j === 1 ? '' : j) + 'σ')}</td> <td>${p4(p)}</td></tr>`).join(' ')}</tbody></table>`;
      const p = rowsT[k - 1][1], v = 2 * p;
      return probQ(d, `확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nrm('m', pw(s, 2)), '을/를')} 따를 때, 실수 ${V('t')}에 대하여 ${Pz('t <= X <= t + ' + L)}의 최댓값을 다음 표를 이용하여 구한 것은?`, v, `2*${p}`, [p, rowsT[(k % 3)][1]], {
        figure: tab,
        explain: `정규분포곡선은 직선 ${ms('x = m')}에 대하여 대칭이므로 길이가 ${L}인 구간은 ${ms('t = m - ' + L / 2)}일 때 확률이 가장 크다. ${L / 2} = ${k === 1 ? Sv : k + ' × ' + s + ' = ' + k + Sv}이므로 최댓값은 ${Pz('m - ' + (k === 1 ? '' : k) + 'σ <= X <= m + ' + (k === 1 ? '' : k) + 'σ')} = 2 × ${p4(p)} = ${p4(v)}이다.`
      });
    }),

    T('curve-pairsum', '평균에 대칭인 짝으로 확률의 합 구하기', '①8', (d) => {
      const m = d.int(2, 9), s = d.int(1, 4), j = d.int(2, 5), lo = m - j, hi = m + j;
      const sumH = `${Pz('X <= ' + num(lo))} + ${Pz('X <= ' + num(lo + 1))} + ⋯ + ${Pz('X <= ' + num(hi))}`;
      return decQ(`확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nX(m, s), '을/를')} 따를 때, 다음 값은?`, j + 0.5, {
        figure: lines([sumH]),
        explain: `정규분포곡선은 직선 ${ms('x = ' + m)}에 대하여 대칭이므로 ${nb(Pz('X <= ' + m + ' - k') + ' + ' + Pz('X <= ' + m + ' + k') + ' = 1')}이다. ${jh(String(m), '을/를')} 사이에 두고 짝을 지은 ${j}쌍의 합이 각각 1이고 ${Pz('X <= ' + m)} = 0.5이므로 구하는 값은 ${j} + 0.5 = ${dec(j + 0.5)}이다.`,
        value: `(${hi}-${jn(lo)})/2+1/2`, derived: [2]
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 표준정규분포와 표준정규분포표 ──
  const ZKEYS = [3, 5, 6, 8, 10, 12, 13, 14, 15, 17, 18, 20, 22, 23, 24, 25];
  const oddKeys = ZKEYS.filter((k) => k % 10 !== 0);          // 소수 첫째 자리가 0이 아닌 z(칸으로 받을 때)
  const tableNote = '다음 표준정규분포표를 이용하여';
  B.addTypes(UNIT, 'ztable', [
    T('z-shade', '표준정규분포곡선에서 색칠한 부분의 넓이', '①9', (d) => {
      const kind = d.int(0, 3);
      let lo, hi;
      if (kind === 0) { lo = null; hi = d.pick([1, -1]) * d.pick(ZKEYS); }
      else if (kind === 1) { lo = d.pick([1, -1]) * d.pick(ZKEYS); hi = null; }
      else if (kind === 2) { lo = -d.pick(ZKEYS); hi = d.pick(ZKEYS); }
      else { const [p, q] = d.shuffle(ZKEYS).slice(0, 2).sort((s, t) => s - t); [lo, hi] = d.bool() ? [p, q] : [-q, -p]; }
      const v = zval(lo, hi), ticks = [{ v: 0, t: '0' }].concat([lo, hi].filter((k) => k != null && k !== 0).map((k) => ({ v: k / 10, t: zt(k) })));
      const fig = bell({ lo: -3.4, hi: 3.4, axis: 'z', curves: [{ m: 0, s: 1 }], fills: [{ from: lo == null ? null : lo / 10, to: hi == null ? null : hi / 10 }], ticks, guides: [{ x: 0 }],
        say: '색칠한 부분은 ' + (lo == null ? 'z = ' + zt(hi) + '의 왼쪽 전체' : hi == null ? 'z = ' + zt(lo) + '의 오른쪽 전체' : 'z = ' + zt(lo) + '부터 z = ' + zt(hi) + '까지') });
      return probQ(d, `확률변수 ${jh(Z, '이/가')} 표준정규분포 ${jh(Z01, '을/를')} 따를 때, ${Z}의 확률밀도함수의 그래프가 다음과 같다. ${tableNote} 색칠한 부분의 넓이를 구한 것은?`, v, zexpr(lo, hi), [zp(lo || 0), zp(hi || 0)], {
        figure: both(fig, tabOf(d, [lo || 0, hi || 0])),
        explain: `색칠한 부분의 넓이는 ${Pz(lo == null ? 'Z <= ' + zt(hi) : hi == null ? 'Z >= ' + zt(lo) : zt(lo) + ' <= Z <= ' + zt(hi))}이고, 곡선이 직선 ${ms('z = 0')}에 대하여 대칭이므로 ${zSteps(lo, hi)}이다.`
      });
    }),

    T('z-tail', '표준정규분포에서 한쪽 꼬리 확률 구하기', '①10', (d, n) => {
      const k = d.pick(ZKEYS), up = d.bool();
      // n = 0: 0.5보다 작은 확률(P(Z ≥ a), P(Z ≤ −a)), n = 1: 0.5보다 큰 확률(P(Z ≤ a), P(Z ≥ −a))
      const [lo, hi] = n === 0 ? (up ? [k, null] : [null, -k]) : (up ? [null, k] : [-k, null]);
      const v = zval(lo, hi), body = lo == null ? 'Z <= ' + zt(hi) : 'Z >= ' + zt(lo);
      return probQ(d, `확률변수 ${jh(Z, '이/가')} 표준정규분포 ${jh(Z01, '을/를')} 따를 때, ${tableNote} ${jh(Pz(body), '을/를')} 구한 것은?`, v, zexpr(lo, hi), [zp(k)], {
        figure: tabOf(d, [k]), rule: n === 0 ? 'tail-small' : 'tail-big',
        explain: `${Pz(body)} = ${zSteps(lo, hi)}이다.`
      });
    }, { count: 2 }),

    T('z-interval', '표준정규분포에서 구간의 확률 구하기(같은 쪽·0을 걸침·절댓값)', '①11', (d, n) => {
      const [p, q] = d.shuffle(ZKEYS).slice(0, 2).sort((s, t) => s - t);
      let lo, hi, body;
      if (n === 0) { [lo, hi] = d.bool() ? [p, q] : [-q, -p]; body = zt(lo) + ' <= Z <= ' + zt(hi); }
      else if (n === 1) { [lo, hi] = d.bool() ? [-p, q] : [-q, p]; body = zt(lo) + ' <= Z <= ' + zt(hi); }
      else { lo = -q; hi = q; body = '|Z| <= ' + zt(q); }
      const v = zval(lo, hi);
      return probQ(d, `확률변수 ${jh(Z, '이/가')} 표준정규분포 ${jh(Z01, '을/를')} 따를 때, ${tableNote} ${jh(Pz(body), '을/를')} 구한 것은?`, v, zexpr(lo, hi), [zp(lo), zp(hi)], {
        figure: tabOf(d, [lo, hi]), rule: ['int-same', 'int-cross', 'int-abs'][n],
        explain: `${Pz(body)}${n === 2 ? ' = ' + Pz(zt(lo) + ' <= Z <= ' + zt(hi)) : ''} = ${zSteps(lo, hi)}이다.`
      });
    }, { count: 3 }),

    T('z-back', '한쪽 확률로 표준정규분포의 경계 a 구하기', '①12', (d, n) => {
      const k = d.pick(oddKeys), small = d.bool();
      // n = 0: P(Z ≥ a) = p, n = 1: P(Z ≤ a) = p. 확률이 0.5보다 작은가 큰가로 a 의 부호가 갈린다.
      const a = n === 0 ? (small ? k : -k) : (small ? -k : k);
      const pv = n === 0 ? zval(a, null) : zval(null, a), body = n === 0 ? 'Z >= a' : 'Z <= a';
      const piece = Math.abs(pv - 5000), less = pv < 5000;
      const part = a > 0 ? Pz('0 <= Z <= a') : Pz('a <= Z <= 0');
      const how = less ? `0.5 ${MINUS} ${p4(pv)}` : `${p4(pv)} ${MINUS} 0.5`;
      return decQ(`확률변수 ${jh(Z, '이/가')} 표준정규분포 ${jh(Z01, '을/를')} 따를 때, ${tableNote} ${jh(nb(Pz(body) + ' = ' + p4(pv)), '을/를')} 만족시키는 상수 ${V('a')}의 값을 구하시오.`, a / 10, {
        signed: true, figure: tabOf(d, [k], 3), rule: n === 0 ? 'back-up' : 'back-down',
        explain: `${jh(p4(pv), '이/가')} 0.5보다 ${less ? '작으므로' : '크므로'} ${ms(a > 0 ? 'a > 0' : 'a < 0')}이다. ${part} = ${how} = ${p4(piece)}이고, 표에서 ${P0(k)} = ${p4(zp(k))}이므로 ${ms('a = ' + zt(a))}이다.`,
        value: `${a < 0 ? '0-' : ''}${zt(k)}+(${p4(zp(k))}-${less ? '0.5+' + p4(pv) : p4(pv) + '+0.5'})*100`, derived: [0.5, 100]
      });
    }, { count: 2 }),

    T('z-absback', '절댓값이 든 확률로 양수 a 구하기', '①13', (d) => {
      const k = d.pick(oddKeys), inside = d.bool(), pv = inside ? 2 * zp(k) : 10000 - 2 * zp(k);
      const body = inside ? '|Z| <= a' : '|Z| >= a';
      return decQ(`확률변수 ${jh(Z, '이/가')} 표준정규분포 ${jh(Z01, '을/를')} 따를 때, ${tableNote} ${jh(nb(Pz(body) + ' = ' + p4(pv)), '을/를')} 만족시키는 양수 ${V('a')}의 값을 구하시오.`, k / 10, {
        figure: tabOf(d, [k], 3),
        explain: inside
          ? `${Pz('|Z| <= a')} = 2${Pz('0 <= Z <= a')} = ${p4(pv)}이므로 ${Pz('0 <= Z <= a')} = ${p4(zp(k))}이다. 표에서 ${ms('a = ' + zt(k))}이다.`
          : `${Pz('|Z| >= a')} = 2${Pz('Z >= a')} = ${p4(pv)}이므로 ${Pz('Z >= a')} = ${p4(pv / 2)}, ${Pz('0 <= Z <= a')} = 0.5 ${MINUS} ${p4(pv / 2)} = ${p4(zp(k))}이다. 표에서 ${ms('a = ' + zt(k))}이다.`,
        value: inside ? `${zt(k)}+(${p4(zp(k))}-${p4(pv)}/2)*100` : `${zt(k)}+(${p4(zp(k))}-0.5+${p4(pv)}/2)*100`, derived: [2, 0.5, 100]
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 정규분포의 표준화와 확률 ──
  // 실생활 상황: 무게·용량·시간. dp 는 평균·표준편차의 소수 자리 수(수박은 kg 의 소수 첫째 자리).
  const LIFE = [
    { what: '어느 공장에서 생산하는 과자 한 봉지의 무게', x: '과자 한 봉지의 무게', pick: '이 공장에서 생산한 과자 중에서 임의로 택한 한 봉지의 무게', u: ' g', m: [60, 140], s: [2, 8], dp: 0 },
    { what: '어느 농장에서 수확한 수박 한 통의 무게', x: '수박 한 통의 무게', pick: '이 농장에서 수확한 수박 중에서 임의로 택한 한 통의 무게', u: ' kg', m: [50, 80], s: [4, 9], dp: 1 },
    { what: '어느 공장에서 생산하는 음료 한 병의 용량', x: '음료 한 병의 용량', pick: '이 공장에서 생산한 음료 중에서 임의로 택한 한 병의 용량', u: ' mL', m: [250, 520], s: [2, 6], dp: 0 },
    { what: '어느 고등학교 학생들의 등교 시간', x: '등교 시간', pick: '이 학교 학생 중에서 임의로 택한 한 명의 등교 시간', u: '분', m: [18, 40], s: [3, 6], dp: 0 },
    { what: '어느 지역 주민 한 명의 하루 플라스틱 배출량', x: '하루 플라스틱 배출량', pick: '이 지역 주민 중에서 임의로 택한 한 명의 하루 플라스틱 배출량', u: ' g', m: [180, 260], s: [10, 40], dp: 0 }
  ];
  // 구간 꼴: both(평균을 걸침), side(한쪽), up(이상), down(이하)
  // keys: 쓸 z(십분의 몇)의 목록(소수 자리가 있는 양이면 0.5 간격만 쓴다)
  function pickRange(d, keys) {
    const K = keys || ZKEYS, kind = d.int(0, 3);
    if (kind === 0) return [-d.pick(K), d.pick(K)];
    if (kind === 1) { const [p, q] = d.shuffle(K).slice(0, 2).sort((s, t) => s - t); return d.bool() ? [p, q] : [-q, -p]; }
    if (kind === 2) return [d.pick([1, -1]) * d.pick(K), null];
    return [null, d.pick([1, -1]) * d.pick(K)];
  }
  const rangeText = (lo, hi, at, u) => (lo == null ? `${at(hi)}${u} 이하` : hi == null ? `${at(lo)}${u} 이상` : `${at(lo)}${u} 이상 ${at(hi)}${u} 이하`);
  const rangeBody = (lo, hi, at) => (lo == null ? 'X <= ' + at(hi) : hi == null ? 'X >= ' + at(lo) : at(lo) + ' <= X <= ' + at(hi));
  const zBody = (lo, hi) => (lo == null ? 'Z <= ' + zt(hi) : hi == null ? 'Z >= ' + zt(lo) : zt(lo) + ' <= Z <= ' + zt(hi));
  B.addTypes(UNIT, 'std', [
    T('std-expr', '표준화한 확률변수 Z를 X의 식으로 나타내기', '①14', (d, n) => {
      if (n === 0) {
        const m = d.int(5, 60), s = d.int(2, 9);
        const f = (top, bot) => frac(top, bot);
        const rows = [
          { h: f(ms('X - ' + m), s), ok: true }, { h: f(ms('X + ' + m), s), ok: false }, { h: f(ms('X - ' + m), s * s), ok: false },
          { h: f(ms('X - ' + s), m), ok: false }, { h: s + '(' + ms('X - ' + m) + ')', ok: false }
        ];
        return oneQ(d, `확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nX(m, s), '을/를')} 따를 때, ${jh(X, '을/를')} 표준화한 확률변수 ${jh(Z, '을/를')} ${X}의 식으로 나타낸 것은?`, rows, true, {
          rule: 'expr-pick',
          explain: `평균 ${m}, 표준편차 ${jh(String(s), '으로/로')} 표준화하면 ${Z} = ${f(ms('X - ' + m), s)}이고, ${jh(Z, '은/는')} 표준정규분포 ${jh(Z01, '을/를')} 따른다.`
        });
      }
      const k = d.int(2, 5), m = d.pick([1, -1]) * d.int(3, 20), sH = pw('(' + frac(1, k) + ')', 2);
      const b = -k * m;
      return inline(`확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nrm(num(m), sH), '을/를')} 따를 때, ${jh(X, '을/를')} 표준화한 확률변수 ${jh(Z, '을/를')} ${X}의 식으로 나타내시오.`,
        `${Z} = {0}${X} {1}`, [{ answer: k, signed: true }, { answer: b, signed: true }], {
          shown: `${Z} = ${k}${X} ${b < 0 ? MINUS + ' ' + -b : '+ ' + b}`, rule: 'expr-fill',
          explain: `평균이 ${num(m)}, 표준편차가 ${frac(1, k)}이므로 ${Z} = ${frac(ms('X - ' + (m < 0 ? '(' + num(m) + ')' : m)), frac(1, k))} = ${k}(${ms('X ' + (m < 0 ? '+ ' + -m : '- ' + m))}) = ${k}${X} ${b < 0 ? MINUS + ' ' + -b : '+ ' + b}이다.`,
          facts: { calc: [[`${k}`, 0], [`0-${k}*${jn(m)}`, 1]] }
        });
    }, { count: 2 }),

    T('std-prob', '정규분포를 따르는 확률변수의 확률을 표준화하여 구하기', '①15', (d, n) => {
      const c = d.pick(LIFE), [lo, hi] = pickRange(d, n === 1 && c.dp ? [5, 10, 15, 20, 25] : ZKEYS);
      if (n === 0) {
        const m = d.int(10, 150), s = d.int(2, 12), at = (k) => dec(m + k * s / 10);
        const body = rangeBody(lo, hi, at), v = zval(lo, hi);
        return probQ(d, `확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nX(m, s), '을/를')} 따를 때, ${tableNote} ${jh(Pz(body), '을/를')} 구한 것은?`, v, zexpr(lo, hi), [zp(lo || 0), zp(hi || 0)], {
          figure: tabOf(d, [lo || 0, hi || 0]), rule: 'prob-bare',
          explain: `${jh(Z + ' = ' + frac(ms('X - ' + m), s), '으로/로')} 표준화하면 ${Pz(body)} = ${Pz(zBody(lo, hi))}이고, ${zSteps(lo, hi)}이다.`
        });
      }
      const sc = 10 ** c.dp, mi = d.int(c.m[0], c.m[1]), si = c.dp ? d.pick([4, 6, 8]) : d.int(c.s[0], c.s[1]);
      const m = mi / sc, s = si / sc, at = (k) => dec(m + k * s / 10);
      const v = zval(lo, hi);
      return probQ(d, `${jh(c.what, '은/는')} 평균이 ${dec(m)}${c.u}, 표준편차가 ${dec(s)}${c.u}인 정규분포를 따른다고 한다. ${jh(c.pick, '이/가')} ${rangeText(lo, hi, at, c.u)}일 확률을 ${tableNote} 구한 것은?`, v, zexpr(lo, hi), [zp(lo || 0), zp(hi || 0)], {
        figure: tabOf(d, [lo || 0, hi || 0]), rule: 'prob-life',
        explain: `${jh(c.x, '을/를')} 확률변수 ${jh(X, '이라/라')} 하면 ${jh(X, '은/는')} 정규분포 ${jh(nX(m, s), '을/를')} 따른다. ${jh(Z + ' = ' + frac(ms('X - ' + dec(m)), dec(s)), '으로/로')} 표준화하면 구하는 확률은 ${Pz(rangeBody(lo, hi, at))} = ${Pz(zBody(lo, hi))} = ${zSteps(lo, hi)}이다.`
      });
    }, { count: 2 }),

    T('std-count', '정규분포로 전체에서 차지하는 사람 수·비율 구하기', '①16', (d, n) => {
      const m = d.int(50, 75), s = d.int(4, 15), at = (k) => dec(m + k * s / 10);
      if (n === 0) {
        const total = d.pick([10000, 20000]), up = d.bool(), k = d.pick(ZKEYS) * (d.bool() ? 1 : -1);
        const [lo, hi] = up ? [k, null] : [null, k], v = zval(lo, hi), cnt = total * v / 10000;
        if (cnt > 9999) return null;
        return numQ(`어느 지역 고등학교 2학년 학생 ${total}명의 수학 점수는 평균이 ${m}점, 표준편차가 ${s}점인 정규분포를 따른다고 한다. 이 학생 중에서 수학 점수가 ${at(k)}점 ${up ? '이상' : '이하'}인 학생은 몇 명인지 ${tableNote} 구하시오.`, cnt, {
          unit: '명', figure: tabOf(d, [k]),
          explain: `수학 점수를 확률변수 ${jh(X, '이라/라')} 하면 ${Pz(rangeBody(lo, hi, at))} = ${Pz(zBody(lo, hi))} = ${zSteps(lo, hi)}이다. 따라서 학생 수는 ${total} × ${p4(v)} = ${cnt}(명)이다.`,
          value: `${total}*(${zexpr(lo, hi)})/10000`, derived: [5000, 10000]
        });
      }
      const [lo, hi] = [-d.pick(ZKEYS), d.pick(ZKEYS)], v = zval(lo, hi), total = d.pick([150, 200, 300, 400, 500]);
      return probQ(d, `어느 고등학교 학생 ${total}명의 수학 점수는 평균이 ${m}점, 표준편차가 ${s}점인 정규분포를 따른다고 한다. 수학 점수가 ${at(lo)}점 이상 ${at(hi)}점 이하인 학생은 전체의 몇 %인지 ${tableNote} 구한 것은?`, v, zexpr(lo, hi), [zp(lo), zp(hi)], {
        figure: tabOf(d, [lo, hi]), show: pct,
        explain: `수학 점수를 확률변수 ${jh(X, '이라/라')} 하면 ${Pz(rangeBody(lo, hi, at))} = ${Pz(zBody(lo, hi))} = ${zSteps(lo, hi)}이므로 전체의 ${pct(v)}이다.`
      });
    }, { count: 2 }),

    T('std-ksigma', 'P(|X − m| ≤ kσ)를 표준화하여 구하기', '①17', (d, n) => {
      const keyOf = n === 0 ? d.pick([5, 10, 15, 20, 25, 30]) : d.pick(oddKeys);
      const kH = (k) => (k === 10 ? '' : zt(k)) + 'σ', body = '|X - m| <= ' + kH(keyOf), v = 2 * zp(keyOf);
      if (n === 0) {
        return probQ(d, `확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nrm('m', 'σ^2'), '을/를')} 따를 때, ${tableNote} ${jh(Pz(body), '을/를')} 구한 것은?`, v, `2*${zp(keyOf)}`, [zp(keyOf), zp(keyOf === 30 ? 25 : keyOf + 5)], {
          figure: tabOf(d, [keyOf]),
          explain: `${jh(Z + ' = ' + frac(ms('X - m'), Sv), '으로/로')} 표준화하면 ${Pz(body)} = ${Pz('|Z| <= ' + zt(keyOf))} = 2${P0(keyOf)} = 2 × ${p4(zp(keyOf))} = ${p4(v)}이다. 이 값은 ${Mv}, ${Sv}의 값과 상관없다.`
        });
      }
      return decQ(`확률변수 ${jh(X, '이/가')} 정규분포 ${jh(nrm('m', 'σ^2'), '을/를')} 따를 때, ${tableNote} ${jh(nb(Pz('|X - m| <= kσ') + ' = ' + p4(v)), '을/를')} 만족시키는 양수 ${V('k')}의 값을 구하시오.`, keyOf / 10, {
        figure: tabOf(d, [keyOf], 3),
        explain: `${Pz('|X - m| <= kσ')} = ${Pz('|Z| <= k')} = 2${Pz('0 <= Z <= k')} = ${p4(v)}이므로 ${Pz('0 <= Z <= k')} = ${p4(zp(keyOf))}이다. 표에서 ${ms('k = ' + zt(keyOf))}이다.`,
        value: `${zt(keyOf)}+(${p4(zp(keyOf))}-${p4(v)}/2)*100`, derived: [2, 100]
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
