// 고등학교 확률과 통계 Ⅲ-2 「통계적 추정」 — 단원 틀·도구와 앞쪽 묶음(모집단과 표본, 표본평균의 분포, 표본평균의 확률).
// 수집해 둔 천재 T셀파 확률과 통계(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 26꼴, 기본꼴_2: 25꼴, 심화꼴: 5꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-3-7/싣기_대조표.md 에 있다.
// (모평균의 추정, 모비율과 표본비율, 모비율의 추정, 신뢰구간의 길이는 11-3-7b.js 에, 실력 문항은 11-3-7c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: [12확통03-05] 모집단과 표본의 뜻을 알고, 표본추출의 방법을 설명할 수 있다.
//   [12확통03-06] 표본평균과 모평균, 표본비율과 모비율의 관계를 이해하고 설명할 수 있다.
//   [12확통03-07] 공학 도구를 이용하여 모평균 및 모비율을 추정하고 그 결과를 해석할 수 있다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(모평균·모표준편차·모분산, 모집단의 확률분포 표, 카드·공, 표본의 값, 합과 제곱합, 신뢰구간의 끝값),
//    묻는 것(확률, 경계값, 구간의 한 끝, 표본의 크기, 모표준편차, 신뢰구간, 신뢰도, 개수), 확률의 꼴(한쪽, 두 값 사이, 두 값 밖)이 다르면 따로 싣는다.
//  - 교육과정: 「표본의 추출방법을 임의추출로 제한」「모평균 추정은 모집단의 분포가 정규분포인 경우만, 모비율의 추정은 표본의 크기가 큰 경우만」에 맞춰
//    신뢰구간은 모두 정규 모집단·큰 표본으로 지었다. 「복잡한 신뢰구간의 계산은 다루지 않는다」는 정도를 말하는 줄이라 빼는 까닭으로 쓰지 않았다(합과 제곱합으로 구하는 꼴은 실력).
//    교과서대로 「특별한 언급이 없으면 임의추출은 복원추출」로 둔다.
//  - 표준정규분포표의 값은 문제마다 쓰는 값과 쓰지 않는 값을 섞은 표 조각(ztab)으로 준다. 1.96·2.58은 「P(|Z| ≤ 1.96) = 0.95로 계산한다」처럼 글로 준다.
//  - 답: 확률(소수 넷째 자리)과 신뢰구간(끝값이 소수 둘째 자리 이상)은 고르기로 낸다. 분산·표본비율처럼 분수로 적히는 값은 분자·분모 칸(크기가 같은 분수도 맞게 친다),
//    표준편차·끝값이 소수 첫째 자리이면 소수 칸으로 받는다. 이 단원의 답은 모두 0보다 크므로(모평균을 묻는 실력 문항 하나만 빼고) 부호 단추를 달지 않는다.
//    고르기의 참·거짓은 손으로 적지 않고 코드로 셈한다. 확률 보기는 정답 하나에 흔한 실수(0.5에 더하고 빼기를 바꿈, √n을 빼먹음, 이웃한 z의 값)를 섞었다.
//  - 원문이 따로 구한 값을 더한 곳(E(X̄) + σ(X̄), m + σ, n + a, x̄ + a, E(X̄) + 1/V(X̄))은 칸마다 받거나 한쪽 값을 묻는다.
//  - 수와 상황은 새로 썼다. 늘 같은 답이 나오는 꼴(표본의 크기가 커질 때 확률의 변화, 길이의 변화)은 묻는 쪽을 바꾸어 답이 달라지게 했다.
//
// 뺀 것과 까닭(11-3-7b.js, 11-3-7c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 같은 과목의 다른 단원에 있는 일: 개수로 묻는 표본비율의 확률(②11 — 「몇 명 이상일 확률」은 11-3-6 이항분포의 정규근사와 셈이 같다. 비율로 묻는 ②10은 싣는다).
//  - 수를 읽기만 하는 변형: 표본의 크기를 묻는 ①1의 변형.
//  - 겹침: ①9 변형(X₁ + X₂ = s일 확률 — P(X̄ = k)와 같은 일), ②7 변형(빈칸 p̂ = X/n — 표본비율 구하기와 같은 일), 심1(E(X̄) + σ(X̄) — ①11), 심3(신뢰구간의 위 끝 — ②4).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~구하시오.」, 확률·신뢰구간은 「~을 구한 것은?」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, N, M, C, D } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, nb, V, sup } = B.kit.mid;
  const { ms, pr, ev, vr, sd, nrm, bar, hat, dist, ztab, pw, jh, qAns, nC, nP, nPi, plainOf, esc } = B.kit.hs;
  const UNIT = '11-3-7', STD5 = '12확통03-05', STD6 = '12확통03-06', STD7 = '12확통03-07';

  // ── 수와 글 ──
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  // p/q 를 끝나는 소수로 적은 글(여섯째 자리 안에서 끝나지 않으면 null). 음수는 −.
  function dstr(p, q) {
    if (q < 0) { p = -p; q = -q; }
    const g = gcd(Math.abs(p), q) || 1; p /= g; q /= g;
    let t = q; while (t % 2 === 0) t /= 2; while (t % 5 === 0) t /= 5;
    if (t !== 1) return null;
    let k = 0, s = 1; while (s % q !== 0) { s *= 10; k += 1; }
    if (k > 6) return null;
    const v = p * (s / q), a = Math.abs(v), whole = Math.floor(a / s), part = a % s;
    return (v < 0 ? MINUS : '') + String(whole) + (k ? '.' + String(part).padStart(k, '0') : '');
  }
  const qs = (x) => dstr(x.p, x.q);                                   // 유리수를 소수 글로(끝나지 않으면 null)
  const qv = (x) => x.p / x.q;                                        // 유리수의 실수 값
  const dq = (s) => { const t = String(s), i = t.indexOf('.'); return i < 0 ? Q(Number(t)) : Q(Number(t.replace('.', '')), 10 ** (t.length - i - 1)); };   // 소수 글 → 유리수
  const places = (x) => { const s = qs(x); return s == null ? 99 : s.includes('.') ? s.split('.')[1].length : 0; };
  const fq = (x) => (x.q === 1 ? String(x.p) : frac(x.p, x.q));       // 유리수를 분수 글로(양수)
  const fqs = (x) => (x.q === 1 ? String(x.p) : x.p + '/' + x.q);     // 풀이에 적는 짧은 분수 글
  const jx = (s, pair) => jh(String(s), pair);                         // 수 글 뒤 토씨(소수는 끝 숫자로 읽는다)
  const pct = (k) => k + ' %';
  const listJ = (arr, pair) => arr.slice(0, -1).map(String).concat([jx(arr[arr.length - 1], pair)]).join(', ');   // 「1, 3, 5가」
  const XB = bar('X'), xb = bar('x'), PH = hat('p'), PQ = hat('p') + hat('q');
  const Mv = V('m'), Sg = ms('σ'), Nv = V('n'), Sv = V('s');
  const P95 = `(단, ${V('Z')}가 표준정규분포를 따르는 확률변수일 때, ${pr('|Z| <= 1.96')} = 0.95로 계산한다.)`;
  const P99 = `(단, ${V('Z')}가 표준정규분포를 따르는 확률변수일 때, ${pr('|Z| <= 2.58')} = 0.99로 계산한다.)`;
  const ZC = { 95: 196, 99: 258 };
  const zcond = (c) => (c === 95 ? P95 : P99);

  // ── 표준정규분포표(만분의 몇) ──
  const ZT = { 0.2: 793, 0.4: 1554, 0.5: 1915, 0.6: 2257, 0.8: 2881, 1: 3413, 1.2: 3849, 1.4: 4192, 1.5: 4332, 1.6: 4452, 1.8: 4641, 2: 4772, 2.2: 4861, 2.4: 4918, 2.5: 4938, 2.6: 4953, 3: 4987 };
  const ZS = Object.keys(ZT).map(Number).sort((a, b) => a - b);
  const zp = (z) => ZT[z];
  const p4 = (v) => '0.' + String(v).padStart(4, '0');                // 만분의 v 를 소수 넷째 자리 글로
  const zq = (z) => dq(String(z));
  // 쓰는 z 와 쓰지 않는 z 를 섞은 표 조각
  function ztabOf(d, need, extra) {
    const set = new Set(need), pool = ZS.filter((z) => !set.has(z)), want = need.length + (extra == null ? 2 : extra);
    while (set.size < want) set.add(d.pick(pool));
    return ztab([...set].sort((a, b) => a - b).map((z) => [z, zp(z) / 10000]));
  }
  const ztx = (z) => `${pr('0 <= Z <= ' + z)} = ${p4(zp(z))}`;          // 풀이에 적는 표의 값

  // ── 단위와 상황 ──
  const U = {
    g: { t: 'g', b: true }, kg: { t: 'kg', b: true }, mL: { t: 'mL', b: false }, mm: { t: 'mm', b: false }, cm: { t: 'cm', b: false },
    kWh: { t: 'kWh', b: false }, min: { t: '분', b: true, ko: true }, pt: { t: '점', b: true, ko: true }, hr: { t: '시간', b: true, ko: true }
  };
  const amt = (v, u) => (u.ko ? v + u.t : v + ' ' + u.t);                              // 수와 단위(우리말 단위는 붙인다)
  const amtJ = (v, u, pair) => { const [w, wo] = pair.split('/'); return amt(v, u) + (u.b ? w : wo); };   // 단위 뒤 토씨
  // 정규분포를 따르는 모집단의 상황. lo·hi: 모평균의 범위, sd: 모표준편차로 쓸 수 있는 크기
  const CTX = [
    { subj: '어느 공장에서 만드는 과자 한 봉지의 무게', from: '이 공장에서 만든 과자', cnt: '봉지', what: '무게', all: '이 공장에서 만드는 과자 한 봉지의 무게', u: U.g, lo: 60, hi: 300 },
    { subj: '어느 농장에서 수확한 배 한 개의 무게', from: '이 농장에서 수확한 배', cnt: '개', what: '무게', all: '이 농장에서 수확한 배 한 개의 무게', u: U.g, lo: 300, hi: 700 },
    { subj: '어느 회사에서 만드는 음료 한 병의 용량', from: '이 회사에서 만든 음료', cnt: '병', what: '용량', all: '이 회사에서 만드는 음료 한 병의 용량', u: U.mL, lo: 150, hi: 500 },
    { subj: '어느 고등학교 학생들의 하루 수면 시간', from: '이 학교 학생', cnt: '명', what: '하루 수면 시간', all: '이 학교 학생들의 하루 수면 시간', u: U.min, lo: 300, hi: 480 },
    { subj: '어느 도시 직장인의 출근 시간', from: '이 도시 직장인', cnt: '명', what: '출근 시간', all: '이 도시 직장인의 출근 시간', u: U.min, lo: 30, hi: 90 },
    { subj: '어느 공장에서 만드는 볼트의 길이', from: '이 공장에서 만든 볼트', cnt: '개', what: '길이', all: '이 공장에서 만드는 볼트의 길이', u: U.mm, lo: 30, hi: 90 },
    { subj: '어느 마을 가구의 한 달 전기 사용량', from: '이 마을의 가구', cnt: '가구', what: '한 달 전기 사용량', all: '이 마을 가구의 한 달 전기 사용량', u: U.kWh, lo: 150, hi: 400 },
    { subj: '어느 빵집에서 만드는 식빵 한 개의 무게', from: '이 빵집에서 만든 식빵', cnt: '개', what: '무게', all: '이 빵집에서 만드는 식빵 한 개의 무게', u: U.g, lo: 300, hi: 800 },
    { subj: '어느 지역 고등학생의 하루 운동 시간', from: '이 지역 고등학생', cnt: '명', what: '하루 운동 시간', all: '이 지역 고등학생의 하루 운동 시간', u: U.min, lo: 30, hi: 120 }
  ];
  const lead = (c, m, s) => `${josa(c.subj, '은/는')} 평균이 ${amt(m, c.u)}, 표준편차가 ${amtJ(s, c.u, '인/인')} 정규분포를 따른다고 한다.`;
  const leadM = (c, s) => `${josa(c.subj, '은/는')} 평균이 ${amt(Mv, c.u)}, 표준편차가 ${amtJ(s, c.u, '인/인')} 정규분포를 따른다고 한다.`;
  const many = (c, n) => josa(n + c.cnt, '을/를');                     // 「64개를」「25명을」

  // ── 검사 근거 마무리(11-1-7a.js 와 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수(√n, 10000 따위)를 facts.unseen 에 밝힌다.
  function seal(item) {
    const f = item.facts || {}, shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], f.pick ? [f.pick.expr] : [], (f.choose && f.choose.exprs) || []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) out.add(Number(n));
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 답 칸 ──
  const factsOf = (o, base) => Object.assign(base, o.unseen ? { unseen: o.unseen } : {}, o.rule ? { rule: o.rule } : {});
  // 자연수 하나(개수·표본의 크기·경계값). o.value: 다시 셈하는 식, o.range: 최솟값을 따지는 부등식
  const numQ = (text, answer, o) => N(text, answer, { signed: Boolean(o.signed), unit: o.unit, figure: o.figure, explain: o.explain, facts: factsOf(o, Object.assign(o.value !== undefined ? { value: o.value } : {}, o.range ? { range: o.range } : {})) });
  // 유리수 하나(정수면 수 칸, 아니면 분자·분모 칸)
  const ratQ = (text, q, o) => qAns(text, q, { signed: Boolean(o.signed), figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 소수 첫째 자리 수 하나
  const decQ = (text, v, o) => D(text, v, { unit: o.unit, figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 수 여럿: rows 는 [이름표, 답, 검사 식, 소수 칸인가]
  const slots = (text, rows, o) => M(text, rows.map(([label, answer, , dec]) => Object.assign({ label, answer }, dec ? { decimal: true } : {}, o.unit ? { unit: o.unit } : {})), {
    figure: o.figure, explain: o.explain, shown: o.shown, facts: factsOf(o, { calc: rows.map((r, i) => [r[2], i]) })
  });
  // 하나 고르기: rows 는 { h 글, ok 참인가 }. ok 가 want 인 것이 꼭 하나다(참·거짓은 코드가 셈한 값이다).
  function oneQ(d, text, rows, want, o) {
    const list = o.keep ? rows.slice() : d.shuffle(rows);
    if (list.filter((r) => r.ok === want).length !== 1) return null;
    if (new Set(list.map((r) => stripH(r.h))).size !== list.length) return null;
    const at = list.findIndex((r) => r.ok === want);
    return C(text, list.map((r) => r.h), at, { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: list.map((r) => r.ok), want }, o.rule ? { rule: o.rule } : {}) });
  }
  // 확률 고르기: 만분의 값(right, wrongs). expr 은 right/10000 이 되는 검사 식(정수끼리 셈하고 마지막에 한 번 나눈다).
  function probQ(d, text, right, wrongs, o) {
    const pool = [...new Set(wrongs.filter((v) => Number.isInteger(v) && v > 0 && v < 10000 && v !== right))];
    if (pool.length < 4) return null;
    const vals = d.shuffle([right].concat(d.shuffle(pool).slice(0, 4)));
    return C(text, vals.map(p4), vals.indexOf(right), { figure: o.figure, explain: o.explain, facts: Object.assign({ pick: { expr: o.expr, options: vals.map((v) => v / 10000) } }, o.rule ? { rule: o.rule } : {}) });
  }
  // 구간 고르기: rows 는 [아래 끝(유리수), 위 끝(유리수)], 첫째가 정답. 아래 끝이 모두 다르고 끝나는 소수여야 한다. v: 가운데 글자('m', 'p')
  function ciQ(d, text, rows, v, o) {
    const strs = rows.map(([lo, hi]) => [qs(lo), qs(hi)]);
    if (strs.some(([a, b]) => a == null || b == null || a.startsWith(MINUS))) return null;
    if (new Set(rows.map(([lo]) => qv(lo))).size !== rows.length) return null;
    const order = d.shuffle(rows.map((_, i) => i));
    return C(text, order.map((i) => ms(`${strs[i][0]} <= ${v} <= ${strs[i][1]}`)), order.indexOf(0), {
      figure: o.figure, explain: o.explain, facts: Object.assign({ pick: { expr: o.expr, options: order.map((i) => qv(rows[i][0])) } }, o.rule ? { rule: o.rule } : {})
    });
  }
  // 보기 ㄱ·ㄴ·ㄷ 가운데 옳은 것을 모두 고른 것: claims 는 { h, ok }
  const KOR = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
  function setQ(d, text, claims, o) {
    const n = claims.length, right = claims.map((c, i) => (c.ok ? i : -1)).filter((i) => i >= 0);
    if (!right.length) return null;
    const all = [];
    for (let mask = 1; mask < (1 << n); mask += 1) all.push([...Array(n).keys()].filter((i) => mask & (1 << i)));
    const key = (s) => s.join(','), rk = key(right);
    const others = d.shuffle(all.filter((s) => key(s) !== rk)).slice(0, (o.size || 5) - 1);
    const opts = d.shuffle([right].concat(others)).sort((a, b) => a.length - b.length || key(a).localeCompare(key(b)));
    const box = `<div class="mb-lines" style="padding:8px 12px;border:1.5px solid #94a3b8;border-radius:8px">${claims.map((c, i) => '<div>' + KOR[i] + '. ' + c.h + '</div>').join('')}</div>`;
    return C(text, opts.map((s) => s.map((i) => KOR[i]).join(', ')), opts.findIndex((s) => key(s) === rk), {
      figure: (o.figure || '') + box, explain: o.explain, facts: Object.assign({ truth: opts.map((s) => key(s) === rk), want: true }, o.rule ? { rule: o.rule } : {})
    });
  }
  // 표본평균 X̄ 의 확률분포표(칸에 ㉠ 같은 빈칸 글을 넣을 수 있다)
  function distX(xs, ps) {
    const cell = (h) => '<td>' + h + '</td>';
    const row1 = '<tr><th>' + XB + '</th> ' + xs.map(cell).join(' ') + ' <th>합계</th></tr>';
    const row2 = '<tr><th>' + pr(XB + ' = ' + xb) + '</th> ' + ps.map(cell).join(' ') + ' <td>1</td></tr>';
    const said = '확률분포표: X̄의 값 ' + xs.map((h) => plainOf(h)).join(', ') + ' / 확률 ' + ps.map((h) => plainOf(h)).join(', ') + ' / 합계 1';
    return tight('<table class="mb-table mb-dist" aria-label="' + esc(said).replace(/"/g, '&quot;') + '"><tbody>' + row1 + ' ' + row2 + '</tbody></table>');
  }
  // 휴대폰 너비에 맞게 표 칸의 안쪽 여백을 줄인다(분수가 든 칸이 다섯·여섯 개인 확률분포표).
  const tight = (h) => String(h).replace(/<(td|th)>/g, '<$1 style="padding:4px 5px">');
  const distT = (xs, ps, o) => tight(dist(xs, ps, o));
  const both = (a, b) => '<div class="mb-lines">' + [a, b].filter(Boolean).map((h) => '<div style="margin:4px 0">' + h + '</div>').join('') + '</div>';

  // 다른 파일(b·c)이 함께 쓰는 도구
  B.kit.u37x = {
    UNIT, STD5, STD6, STD7, gcd, dstr, qs, qv, dq, places, fq, fqs, jx, pct, XB, xb, PH, PQ, Mv, Sg, Nv, Sv, P95, P99, ZC, zcond,
    ZT, ZS, zp, p4, zq, ztabOf, ztx, U, amt, amtJ, CTX, lead, leadM, many,
    stripH, seal, retry, srcOf, T, H, numQ, ratQ, decQ, slots, oneQ, probQ, ciQ, setQ, KOR, distX, distT, tight, both
  };

  B.addUnit({
    id: '11-3-7', grade: 11, semester: 3, no: 7, title: '통계적 추정', version: 1,
    groups: [
      { id: 'pop', title: '모집단과 표본', standard: STD5, types: [] },
      { id: 'mean', title: '표본평균의 분포', standard: STD6, types: [] },
      { id: 'prob', title: '표본평균의 확률', standard: STD6, types: [] },
      { id: 'est', title: '모평균의 추정', standard: STD7, types: [] },
      { id: 'ratio', title: '모비율과 표본비율', standard: STD6, types: [] },
      { id: 'pest', title: '모비율의 추정', standard: STD7, types: [] },
      { id: 'len', title: '신뢰구간의 길이와 표본의 크기', standard: STD7, types: [] }
    ]
  });

  // ════════════════════════════════════════════════════════════════
  // ── 모집단과 표본 ──
  const SURVEYS = [
    { act: (n) => `어느 공장에서 만든 전구 가운데 ${n}개를 임의추출하여 수명을 조사하였다.`, pop: '이 공장에서 만든 전구 전체', smp: (n) => `임의추출한 전구 ${n}개`, w: ['이 공장에서 만든 전구 가운데 불량품', (n) => `조사한 전구 ${n}개의 평균 수명`] },
    { act: (n) => `어느 도시의 시민 가운데 ${n}명을 임의추출하여 하루 대중교통 이용 시간을 조사하였다.`, pop: '이 도시의 시민 전체', smp: (n) => `임의추출한 시민 ${n}명`, w: ['이 도시에서 대중교통을 이용하는 시민', (n) => `조사한 시민 ${n}명의 평균 이용 시간`] },
    { act: (n) => `어느 과수원에서 수확한 사과 가운데 ${n}개를 임의추출하여 당도를 조사하였다.`, pop: '이 과수원에서 수확한 사과 전체', smp: (n) => `임의추출한 사과 ${n}개`, w: ['이 과수원에서 수확한 사과 가운데 당도가 높은 사과', (n) => `조사한 사과 ${n}개의 평균 당도`] },
    { act: (n) => `가입자가 150만 명인 어느 통신사에서 가입자 가운데 ${n}명을 임의추출하여 새 요금제를 좋아하는지 조사하였다.`, pop: '이 통신사의 가입자 150만 명 전체', smp: (n) => `임의추출한 가입자 ${n}명`, w: ['새 요금제를 좋아하는 가입자', (n) => `조사한 가입자 ${n}명 가운데 새 요금제를 좋아하는 사람의 비율`] },
    { act: (n) => `어느 고등학교 학생 가운데 ${n}명을 임의추출하여 하루 운동 시간을 조사하였다.`, pop: '이 고등학교 학생 전체', smp: (n) => `임의추출한 학생 ${n}명`, w: ['이 고등학교 학생 가운데 운동을 하는 학생', (n) => `조사한 학생 ${n}명의 평균 운동 시간`] }
  ];
  const SAMPLE_ONLY = ['어느 공장에서 만든 형광등의 수명', '어느 회사에서 만든 통조림의 맛', '한강의 수질 오염도', '어느 라디오 프로그램의 청취율', '새로 개발한 감기약의 효과',
    '어느 회사에서 만든 새 자동차의 충돌 안전도', '우리나라 고등학생의 하루 수면 시간', '어느 과수원에서 수확한 배의 당도', '어느 바다의 미세 플라스틱 양'];
  const CENSUS_ONLY = ['어느 반 학생들의 혈액형', '국회의원 선거의 개표', '비행기 탑승객의 보안 검색', '어느 고등학교 학생들의 결핵 검사', '병역 판정 검사',
    '인구 주택 총조사', '어느 반 학생들의 봉사 활동 시간', '우리나라 고등학교의 학급 수', '어느 학교 신입생의 건강 검진'];

  B.addTypes(UNIT, 'pop', [
    T('pop-name', '조사에서 모집단과 표본 고르기', '①1', (d) => {
      const s = d.pick(SURVEYS), n = d.pick([100, 120, 150, 200, 250, 300, 400, 500]), askPop = d.bool();
      const rows = [{ h: s.pop, ok: askPop }, { h: s.smp(n), ok: !askPop }, { h: s.w[0], ok: false }, { h: s.w[1](n), ok: false }];
      return oneQ(d, `${s.act(n)} 이 조사의 ${askPop ? '모집단' : '표본'}은?`, rows, true, {
        explain: `조사하려는 대상 전체가 모집단(${s.pop}), 모집단에서 뽑은 일부가 표본(${s.smp(n)})이다. 「평균」「비율」은 표본에서 구한 값이지 대상의 모임이 아니다.`
      });
    }),
    T('pop-term', '모집단·표본·표본의 크기·추출의 뜻(빈칸)', '①2', (d) => {
      const words = ['모집단', '표본', '크기', '추출'], at = d.int(0, 3), BXs = ['㈎', '㈏', '㈐', '㈑'].map((t) => `<span class="mb-box">${t}</span>`);
      const box = `<div class="mb-lines" style="padding:8px 12px;border:1.5px solid #94a3b8;border-radius:8px"><div>통계 조사에서 조사하려는 대상 전체를 ${BXs[0]}(이)라 하고, ${BXs[0]}에서 뽑은 일부를 ${BXs[1]}(이)라 한다.
 또, 표본에 들어 있는 대상의 개수를 표본의 ${BXs[2]}(이)라 하고, 모집단에서 표본을 뽑는 일을 ${BXs[3]}(이)라 한다.</div></div>`;
      const rows = words.concat(['전수조사']).map((w, i) => ({ h: w, ok: i === at }));
      return oneQ(d, `다음 글의 ${['㈎', '㈏', '㈐', '㈑'][at]}에 알맞은 말은?`, rows, true, {
        figure: box, explain: `㈎ 모집단, ㈏ 표본, ㈐ 크기, ㈑ 추출이다. 전수조사는 모집단 전체를 조사하는 일이다.`
      });
    }),
    T('pop-survey', '전수조사와 표본조사 가운데 알맞은 것', '①3', (d, n) => {
      if (n === 0) {
        const wantSample = d.bool(), target = wantSample ? SAMPLE_ONLY : CENSUS_ONLY, other = wantSample ? CENSUS_ONLY : SAMPLE_ONLY;
        const rows = [{ h: d.pick(target), ok: true }].concat(d.shuffle(other).slice(0, 3).map((h) => ({ h, ok: false })));
        const why = wantSample ? '검사하면 물건이 망가지거나 대상이 너무 많고 넓게 흩어져 있어 모두 조사하기 어려우면 표본조사가 알맞다.' : '개인마다 결과가 꼭 필요하거나 대상이 적어 모두 조사할 수 있으면 전수조사가 알맞다.';
        return oneQ(d, `다음 중 ${wantSample ? '전수조사보다 표본조사' : '표본조사보다 전수조사'}가 더 알맞은 것은?`, rows, true, { explain: why });
      }
      const k = d.int(1, 3), pick = d.shuffle(d.shuffle(SAMPLE_ONLY).slice(0, k).map((h) => ({ h, ok: true })).concat(d.shuffle(CENSUS_ONLY).slice(0, 4 - k).map((h) => ({ h, ok: false }))));
      return setQ(d, '다음 보기에서 표본조사가 알맞은 것만을 있는 대로 고른 것은?', pick, {
        explain: `표본조사가 알맞은 것: ${pick.map((c, i) => (c.ok ? KOR[i] : null)).filter(Boolean).join(', ')}. 검사하면 망가지는 것(수명·맛·당도·안전도·효과)과 모두 조사할 수 없는 것(수질·청취율)은 표본조사, 개인마다 결과가 필요한 것은 전수조사가 알맞다.`
      });
    }, { count: 2 }),
    T('pop-pairs', '추출 방법에 따라 나오는 순서쌍', '①4', (d, n) => {
      const v = d.pick([[1, 2, 3], [2, 4, 6], [1, 3, 5], [3, 5, 7], [2, 3, 4]]);
      const pair = (a, b) => nb('(' + a + ', ' + b + ')');
      const rep = [], norep = [], comb = [], combRep = [];
      for (const a of v) for (const b of v) { rep.push([a, b]); if (a !== b) norep.push([a, b]); if (a < b) comb.push([a, b]); if (a <= b) combRep.push([a, b]); }
      const lists = [rep, norep, comb, combRep], want = n === 0 ? 0 : 1;
      const rows = lists.map((l, i) => ({ h: l.map(([a, b]) => pair(a, b)).join(', '), ok: i === want }));
      const how = n === 0 ? '한 장씩 복원추출' : '한 장씩 비복원추출';
      return oneQ(d, `세 개의 숫자 ${listJ(v, '이/가')} 하나씩 적힌 카드 3장 가운데 2장을 ${how}할 때, 나오는 모든 경우를 순서쌍으로 나타낸 것은?`, rows, true, {
        explain: n === 0 ? '복원추출은 뽑은 카드를 되돌려 놓고 다음 카드를 뽑으므로 같은 카드가 다시 나올 수 있다. 순서가 다르면 다른 경우이므로 3 × 3 = 9가지이다.'
          : '비복원추출은 뽑은 카드를 되돌려 놓지 않으므로 같은 카드가 다시 나오지 않고, 순서가 다르면 다른 경우이다. 3 × 2 = 6가지이다.'
      });
    }, { count: 2 }),
    T('pop-count', '추출 방법에 따른 경우의 수', '①5', (d) => {
      const k = d.int(4, 8), r = d.pick([2, 3]);
      const a = k ** r, b = r === 2 ? k * (k - 1) : k * (k - 1) * (k - 2), c = r === 2 ? b / 2 : b / 6;
      const ea = r === 2 ? `${k}*${k}` : `${k}*${k}*${k}`, eb = r === 2 ? `${k}*${k - 1}` : `${k}*${k - 1}*${k - 2}`, ec = r === 2 ? `${eb}/2` : `${eb}/6`;
      return slots(`1부터 ${k}까지의 자연수가 하나씩 적힌 카드 ${k}장 가운데 ${r}장을 다음과 같이 임의추출할 때, 나오는 모든 경우의 수를 각각 구하시오.`, [
        [`한 장씩 복원추출`, a, ea], [`한 장씩 비복원추출`, b, eb], [`동시에 ${r}장 추출`, c, ec]
      ], {
        explain: `복원추출은 같은 카드가 다시 나올 수 있고 순서를 따지므로 ${nPi(k, r)} = ${a}, 비복원추출은 같은 카드가 나오지 않고 순서를 따지므로 ${nP(k, r)} = ${b}, 동시에 뽑으면 순서가 없으므로 ${nC(k, r)} = ${c}이다.`
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 표본평균의 분포 ──
  // 표본의 편차(평균에서 떨어진 정도)와 표본분산: 표본분산이 제곱수가 되는 것만
  const DEVS = [[-1, 0, 1], [-2, 0, 2], [-3, 0, 3], [-4, 0, 4], [-1, -1, -1, 3], [1, 1, 1, -3], [-2, -2, -2, 6], [-1, -1, 0, 1, 1], [-2, -2, 0, 2, 2], [-3, -3, 0, 3, 3], [-4, -4, 0, 4, 4]];
  // 숫자 v, v+2, v+4 가 적힌 카드가 각각 c1, c2, c3 장일 때 크기가 2인 표본의 X̄ 의 확률(분자, 분모 T²)
  const xbarOf3 = (c) => { const [a, b, e] = c; return [a * a, 2 * a * b, b * b + 2 * a * e, 2 * b * e, e * e]; };
  const cardsText = (vals, cnts) => vals.map((v, i) => Array(cnts[i]).fill(v)).flat().join(', ');
  const cardsJ = (vals, cnts, pair) => listJ(vals.map((v, i) => Array(cnts[i]).fill(v)).flat(), pair);

  B.addTypes(UNIT, 'mean', [
    T('mean-sample', '표본의 값으로 표본평균·표본분산·표본표준편차', '①7', (d) => {
      const dev = d.pick(DEVS), n = dev.length, c = d.int(8, 40), vals = d.shuffle(dev.map((x) => c + x));
      const ss = dev.reduce((s, x) => s + x * x, 0), S2 = ss / (n - 1), S = Math.round(Math.sqrt(S2));
      if (S * S !== S2) return null;
      return slots(`어느 모집단에서 크기가 ${n}인 표본을 임의추출하였더니 그 값이 ${listJ(vals, '이었다/였다')}. 이 표본의 표본평균 ${XB}, 표본분산 ${ms('S^2', 'S')}, 표본표준편차 ${ms('S', 'S')}의 값을 차례로 구하시오.`, [
        ['표본평균', c, `(${vals.join('+')})/${n}`], ['표본분산', S2, `(${dev.map((x) => `${x < 0 ? -x : x}*${x < 0 ? -x : x}`).join('+')})/(${n}-1)`], ['표본표준편차', S, `${S}`]
      ], {
        explain: `${XB} = ${c}이다. 편차의 제곱의 합은 ${ss}이고 표본분산은 n − 1 = ${jx(n - 1, '으로/로')} 나누어 ${ms('S^2', 'S')} = ${ss}/${n - 1} = ${S2}, ${ms('S', 'S')} = ${S}이다.`
      });
    }),
    T('mean-table', '크기가 2인 표본의 표본평균의 확률분포 만들기', '①8', (d) => {
      const v = d.int(1, 5), vals = [v, v + 2, v + 4], cnt = [d.int(1, 3), d.int(1, 3), d.int(1, 3)], t = cnt[0] + cnt[1] + cnt[2];
      if (cnt[0] === cnt[2] && cnt[1] === cnt[0]) return null;
      const right = xbarOf3(cnt).map((x) => Q(x, t * t));
      const noTwo = [cnt[0] ** 2, cnt[0] * cnt[1], cnt[1] ** 2 + cnt[0] * cnt[2], cnt[1] * cnt[2], cnt[2] ** 2].map((x) => Q(x, t * t));
      const sub = (c) => (c > 0 ? c - 1 : 0), noRep = [cnt[0] * sub(cnt[0]), 2 * cnt[0] * cnt[1], cnt[1] * sub(cnt[1]) + 2 * cnt[0] * cnt[2], 2 * cnt[1] * cnt[2], cnt[2] * sub(cnt[2])].map((x) => Q(x, t * (t - 1)));
      const pop = vals.map((_, i) => Q(cnt[i], t)), plain = [pop[0], Q(0, 1), pop[1], Q(0, 1), pop[2]];
      const at = d.shuffle([0, 1, 2, 3, 4]).slice(0, 3).sort((a, b) => a - b), marks = ['㉠', '㉡', '㉢'];
      const cells = right.map((x, i) => (at.includes(i) ? marks[at.indexOf(i)] : fq(x)));
      const show = (arr) => at.map((i) => (arr[i].p === 0 ? '0' : fq(arr[i]))).join(', ');
      const rows = [right, noTwo, noRep, plain].map((arr, i) => ({ h: show(arr), ok: i === 0 }));
      return oneQ(d, `숫자 ${cardsJ(vals, cnt, '이/가')} 하나씩 적힌 카드 ${t}장이 들어 있는 상자에서 카드 한 장을 꺼낼 때 카드에 적힌 수를 확률변수 ${V('X')}라 하자. 이 모집단에서 크기가 2인 표본을 임의추출하여 구한 표본평균 ${XB}의 확률분포를 표로 나타내면 다음과 같다. ㉠, ㉡, ㉢에 알맞은 수를 차례로 나열한 것은?`, rows, true, {
        figure: distX(vals.flatMap((x, i) => (i < 2 ? [x, x + 1] : [x])).map(String), cells),
        explain: `카드에 적힌 수가 ${vals.join(', ')}일 확률은 ${pop.map(fqs).join(', ')}이다. 임의추출은 복원추출이므로 두 번 뽑은 수의 쌍마다 확률을 곱해 더한다. 예를 들어 ${XB} = ${jx(v + 1, '은/는')} (${v}, ${v + 2}), (${v + 2}, ${v}) 두 경우이다. ㉠, ㉡, ㉢은 ${show(right)}이다.`
      });
    }),
    T('mean-point', '표본평균이 한 값일 확률', '①9', (d, n) => {
      const a = d.int(1, 4) * (n === 0 ? 2 : 1), g = n === 0 ? 2 : d.pick([1, 2]), vals = [0, 1, 2, 3].map((i) => a + i * g);
      const j = d.int(1, 5), k = Q(2 * a + j * g, 2);
      let w, figure, popText;
      if (n === 0) {
        w = [1, 1, 1, 1];
        popText = `네 개의 수 ${listJ(vals, '이/가')} 하나씩 적힌 카드 4장이 들어 있는 상자에서 카드 한 장을 꺼낼 때 카드에 적힌 수를 확률변수 ${V('X')}라 하자.`;
      } else {
        w = d.pick([[1, 3, 3, 1], [1, 2, 3, 2], [2, 1, 1, 4], [3, 2, 2, 1], [1, 1, 2, 4], [2, 3, 1, 2]]);
        popText = `모집단의 확률변수 ${V('X')}의 확률분포가 다음 표와 같다.`;
      }
      const tot = w.reduce((s, x) => s + x, 0), probs = w.map((x) => Q(x, tot));
      if (n === 1) figure = distT(vals, probs.map(fq));
      const terms = [], prods = [];
      let right = Q(0, 1);
      for (let p = 0; p < 4; p += 1) for (let q = 0; q < 4; q += 1) if (p + q === j) { right = qadd(right, qmul(probs[p], probs[q])); terms.push(`(${vals[p]}, ${vals[q]})`); prods.push(`${w[p]}*${w[q]}`); }
      const kt = qs(k);
      return ratQ(`${popText} 이 모집단에서 크기가 2인 표본을 임의추출할 때, 표본평균 ${XB}에 대하여 ${pr(XB + ' = ' + kt)}의 값은?`, right, {
        figure, value: `(${prods.join('+')})/(${tot}*${tot})`,
        explain: `${XB} = ${kt}이면 두 수의 합이 ${qs(qmul(k, Q(2)))}이다. 그런 순서쌍은 ${terms.join(', ')}이고 확률을 곱해 더하면 ${fqs(right)}이다.`
      });
    }, { count: 2 }),
    T('mean-direct', '표본평균의 확률분포 표로 V(X̄) 셈하기', '①10', (d) => {
      const v = d.int(1, 5), vals = [v, v + 2, v + 4], cnt = [d.int(1, 3), d.int(1, 3), d.int(1, 3)], t = cnt[0] + cnt[1] + cnt[2];
      const ps = xbarOf3(cnt).map((x) => Q(x, t * t)), xs = [v, v + 1, v + 2, v + 3, v + 4];
      let e = Q(0, 1), e2 = Q(0, 1);
      xs.forEach((x, i) => { e = qadd(e, qmul(Q(x), ps[i])); e2 = qadd(e2, qmul(Q(x * x), ps[i])); });
      const varX = qsub(e2, qmul(e, e));
      if (varX.q === 1 || varX.p <= 0) return null;
      return ratQ(`어느 모집단에서 크기가 2인 표본을 임의추출할 때, 표본평균 ${XB}의 확률분포가 다음 표와 같다. ${vr(XB)}의 값은?`, varX, {
        figure: distX(xs.map(String), ps.map(fq)),
        value: `(${xs.map((x, i) => `${x}*${x}*${ps[i].p}*${(t * t) / ps[i].q}`).join('+')})/${t * t}-(${xs.map((x, i) => `${x}*${ps[i].p}*${(t * t) / ps[i].q}`).join('+')})*(${xs.map((x, i) => `${x}*${ps[i].p}*${(t * t) / ps[i].q}`).join('+')})/(${t * t}*${t * t})`,
        explain: `${ev(XB)} = ${fqs(e)}, ${ev(XB + sup(2))}을 표로 셈하면 ${fqs(e2)}이므로 ${vr(XB)} = ${fqs(e2)} − (${fqs(e)})² = ${fqs(varX)}이다. 이 값은 모분산을 표본의 크기 2로 나눈 것과 같다.`
      });
    }),
    T('mean-ev', '모평균·모표준편차·표본의 크기로 표본평균의 평균·분산·표준편차', '①11 심1', (d, n) => {
      const m = d.int(10, 120);
      if (n === 0) {
        const s = d.int(2, 15), size = d.int(9, 100), v = Q(s * s, size);
        if (v.q === 1) return null;
        return ratQ(`모평균이 ${m}, 모표준편차가 ${s}인 모집단에서 임의추출한 크기가 ${size}인 표본의 표본평균을 ${XB}라 할 때, ${vr(XB)}의 값은?`, v, {
          value: `${s}*${s}/${size}`, explain: `${vr(XB)} = σ²/n = ${s}²/${size} = ${fqs(v)}이다. 주어진 ${jx(s, '은/는')} 표준편차이므로 제곱하여 나눈다.`
        });
      }
      const r = d.pick([2, 4, 5, 10]), t = d.int(3, 35);
      if (t % 10 === 0 || (t * r) % 10 !== 0) return null;
      const s = (t * r) / 10, size = r * r;
      return slots(`모평균이 ${m}, 모분산이 ${s * s}인 모집단에서 임의추출한 크기가 ${size}인 표본의 표본평균을 ${XB}라 할 때, ${ev(XB)}와 ${sd(XB)}의 값을 차례로 구하시오.`, [
        [ev(XB), m, `${m}`], [sd(XB), t / 10, `${s}/${r}`, true]
      ], { shown: `${ev(XB)} = ${m}, ${sd(XB)} = ${dstr(t, 10)}`, explain: `${ev(XB)} = ${m}이다. 모분산이 ${s * s}이므로 모표준편차는 ${s}이고 ${sd(XB)} = ${s}/√${size} = ${s}/${r} = ${dstr(t, 10)}이다.` });
    }, { count: 2 }),
    T('mean-back', 'V(X̄)로 모표준편차 구하기', '①12', (d) => {
      const r = d.int(3, 10), t = d.int(2, 5), s = t * r, size = r * r, m = d.int(10, 90);
      return ratQ(`모평균이 ${m}, 모표준편차가 ${Sg}인 모집단에서 크기가 ${size}인 표본을 임의추출할 때, 표본평균 ${XB}의 분산이 ${t * t}이다. ${Sg}의 값은? (단, ${Sg} &gt; 0)`, Q(s), {
        value: `${r}*${t}`, explain: `${vr(XB)} = σ²/${size} = ${t * t}에서 σ² = ${t * t * size}, σ = ${s}이다.`
      });
    }),
    T('mean-normal', '표본평균이 따르는 정규분포', '①13', (d, n) => {
      const sq = (x) => pw(x.q === 1 ? String(x.p) : '(' + frac(x.p, x.q) + ')', 2);
      const ND = (mean, s) => nrm(mean.q === 1 ? mean.p : (mean.p < 0 ? MINUS : '') + frac(Math.abs(mean.p), mean.q), sq(s));
      if (n === 0) {
        const r = d.pick([2, 3, 4, 5]), size = r * r, m = Q(d.pick([-20, -15, -12, -8, -5, 12, 30, 45, 65, 80, 100, 150])), s = d.pick([Q(1, 2), Q(3), Q(2), Q(6), Q(10), Q(3, 2)]);
        const right = ND(m, qdiv(s, Q(r)));
        const rows = [{ h: right, ok: true }, { h: ND(m, qdiv(s, Q(size))), ok: false }, { h: ND(m, s), ok: false }, { h: ND(qdiv(m, Q(r)), qdiv(s, Q(r))), ok: false }];
        return oneQ(d, `모집단이 정규분포 ${ND(m, s)}을 따를 때, 이 모집단에서 임의추출한 크기가 ${size}인 표본의 표본평균 ${XB}가 따르는 정규분포는?`, rows, true, {
          explain: `정규분포를 따르는 모집단에서 뽑은 표본평균은 정규분포 N(m, (σ/√n)²)을 따른다. 평균은 그대로 ${qs(m) || fqs(m)}, 표준편차는 ${fqs(s)}/√${size} = ${fqs(qdiv(s, Q(r)))}이다.`
        });
      }
      const r = d.pick([6, 7, 8, 9, 10]), size = r * r, m = d.int(10, 90), s = d.int(2, 9), se = Q(s, r);
      const rows = [
        { h: `근사적으로 정규분포 ${ND(Q(m), se)}을 따른다.`, ok: true },
        { h: `근사적으로 정규분포 ${ND(Q(m), Q(s))}을 따른다.`, ok: false },
        { h: `근사적으로 정규분포 ${ND(Q(m), Q(s, size))}을 따른다.`, ok: false },
        { h: '모집단이 정규분포를 따르지 않으므로 정규분포에 가깝다고 할 수 없다.', ok: false }
      ];
      return oneQ(d, `분포를 알지 못하는 어느 모집단의 모평균이 ${m}, 모분산이 ${s * s}이다. 이 모집단에서 크기가 ${size}인 표본을 임의추출할 때, 표본평균 ${XB}의 분포에 대한 설명으로 옳은 것은?`, rows, true, {
        explain: `표본의 크기가 충분히 크면(n ≥ 30) 모집단의 분포와 관계없이 ${XB}는 근사적으로 정규분포 N(m, σ²/n)을 따른다. σ = ${s}이므로 표준편차는 ${s}/${r} = ${fqs(se)}이다.`
      });
    }, { count: 2 }),
    T('mean-poptab', '모집단의 확률분포 표로 V(X̄)', '①14', (d) => {
      const a = d.int(0, 3), vals = [a, a + 1, a + 2, a + 3], w = d.pick([[1, 4, 2, 3], [2, 3, 3, 2], [3, 1, 4, 2], [1, 2, 3, 4], [4, 1, 1, 4], [2, 4, 1, 3]]), size = d.pick([5, 10, 20]);
      const ps = w.map((x) => Q(x, 10));
      let e = Q(0, 1), e2 = Q(0, 1);
      vals.forEach((x, i) => { e = qadd(e, qmul(Q(x), ps[i])); e2 = qadd(e2, qmul(Q(x * x), ps[i])); });
      const varX = qsub(e2, qmul(e, e)), vb = qdiv(varX, Q(size));
      if (vb.q === 1) return null;
      return ratQ(`어느 모집단의 확률변수 ${V('X')}의 확률분포가 다음 표와 같다. 이 모집단에서 크기가 ${size}인 표본을 임의추출할 때, 표본평균 ${XB}에 대하여 ${vr(XB)}의 값은?`, vb, {
        figure: distT(vals, ps.map((x) => qs(x))),
        value: `((${vals.map((x, i) => `${x}*${x}*${w[i]}`).join('+')})*10-(${vals.map((x, i) => `${x}*${w[i]}`).join('+')})*(${vals.map((x, i) => `${x}*${w[i]}`).join('+')}))/(100*${size})`,
        explain: `${ev('X')} = ${qs(e)}, ${ev('X^2')} = ${qs(e2)}이므로 ${vr('X')} = ${qs(e2)} − ${qs(e)}² = ${qs(varX)}이다. ${vr(XB)} = ${qs(varX)}/${size} = ${fqs(vb)}이다.`
      });
    }),
    T('mean-findn', '모집단의 분포와 V(X̄)로 표본의 크기', '①15', (d) => {
      const vals = d.pick([[1, 2, 3], [1, 2, 4], [2, 3, 4], [1, 3, 5]]), cnt = [d.int(1, 3), d.int(1, 3), d.int(1, 3)], t = cnt[0] + cnt[1] + cnt[2], size = d.int(2, 9);
      let e = Q(0, 1), e2 = Q(0, 1);
      vals.forEach((x, i) => { e = qadd(e, Q(x * cnt[i], t)); e2 = qadd(e2, Q(x * x * cnt[i], t)); });
      const varX = qsub(e2, qmul(e, e)), vb = qdiv(varX, Q(size));
      if (varX.p === 0) return null;
      return numQ(`숫자 ${cardsJ(vals, cnt, '이/가')} 하나씩 적힌 공 ${t}개가 들어 있는 상자에서 ${Nv}개의 공을 임의추출할 때, 공에 적힌 수의 평균을 ${XB}라 하자. 표본평균 ${XB}의 분산이 ${fq(vb)}일 때, 자연수 ${Nv}의 값은?`, size, {
        value: `${varX.p}*${vb.q}/(${varX.q}*${vb.p})`,
        explain: `공에 적힌 수를 X라 하면 ${ev('X')} = ${fqs(e)}, ${ev('X^2')} = ${fqs(e2)}이므로 ${vr('X')} = ${fqs(varX)}이다. ${fqs(varX)} ÷ n = ${fqs(vb)}에서 n = ${size}이다.`
      });
    })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 표본평균의 확률 ──
  // 정규 모집단: 표본평균의 표준편차 s(= σ/√n)가 깔끔한 것. 반환: { c, m, r, size, sig(글), s(유리수) }
  const SE = [Q(1, 2), Q(1), Q(3, 2), Q(2), Q(5, 2), Q(3), Q(4), Q(5)];
  function popX(d, o) {
    const c = d.pick(CTX), s = d.pick((o && o.se) || SE), r = d.int(2, 10), sig = qmul(s, Q(r));
    if (places(sig) > 1) return null;
    const m = d.int(c.lo, c.hi);
    return { c, m, r, size: r * r, s, sigT: qs(sig), sig };
  }
  const sampleText = (P) => `${P.c.from} 가운데 임의추출한 ${P.size}${P.c.cnt}의 ${P.c.what}의 표본평균을 ${XB}라 할 때`;
  const seLine = (P) => `${sd(XB)} = ${P.sigT}/√${P.size} = ${qs(P.s)}이므로 ${XB}는 정규분포 ${nrm(P.m, pw(qs(P.s), 2))}을 따른다.`;
  const near = (z) => { const i = ZS.indexOf(z); return [ZS[i - 1], ZS[i + 1]].filter((x) => x != null); };

  B.addTypes(UNIT, 'prob', [
    T('prob-one', '표본평균이 한쪽 범위에 들 확률', '①18', (d) => {
      const P = popX(d); if (!P) return null;
      const z = d.pick([0.5, 0.8, 1, 1.2, 1.5, 1.6, 2, 2.5, 3]), above = d.bool(), ge = d.bool();
      const cut = qadd(Q(P.m), qmul(Q(above ? 1 : -1), qmul(zq(z), P.s)));
      if (places(cut) > 2) return null;
      const pz = zp(z), right = (ge === above) ? 5000 - pz : 5000 + pz, opp = 10000 - right;
      const wr = [opp, pz, ...near(z).map((y) => (ge === above ? 5000 - zp(y) : 5000 + zp(y))), ...near(z).map((y) => (ge === above ? 5000 + zp(y) : 5000 - zp(y)))];
      const ct = qs(cut);
      return probQ(d, `${lead(P.c, P.m, P.sigT)} ${sampleText(P)}, 표본평균이 ${amt(ct, P.c.u)} ${ge ? '이상' : '이하'}일 확률을 아래 표준정규분포표를 이용하여 구한 것은?`, right, wr, {
        figure: ztabOf(d, [z]), expr: `(5000${right > 5000 ? '+' : '-'}${pz})/10000`,
        explain: `${seLine(P)} ${pr(XB + ms((ge ? ' >= ' : ' <= ') + ct))} = ${pr('Z' + (ge ? ' >= ' : ' <= ') + (above ? '' : '-') + z)} = 0.5 ${right > 5000 ? '+' : MINUS} ${p4(pz)} = ${p4(right)}이다.`
      });
    }),
    T('prob-two', '표본평균이 두 값 사이에 있을 확률', '①19', (d) => {
      const P = popX(d); if (!P) return null;
      const z1 = d.pick([0.5, 0.8, 1, 1.2, 1.5, 2]), z2 = d.pick([0.8, 1, 1.2, 1.5, 1.6, 2, 2.5]), straddle = d.bool() || z1 >= z2;
      const lo = straddle ? qsub(Q(P.m), qmul(zq(z1), P.s)) : qadd(Q(P.m), qmul(zq(z1), P.s)), hi = qadd(Q(P.m), qmul(zq(z2), P.s));
      if (places(lo) > 2 || places(hi) > 2 || (!straddle && z1 >= z2)) return null;
      const a = zp(z1), b = zp(z2), right = straddle ? a + b : b - a;
      const wr = straddle ? [Math.abs(b - a), 5000 + b, 5000 + a, 10000 - a - b, 5000 - b + a, ...near(z2).map((y) => a + zp(y)), ...near(z1).map((y) => zp(y) + b)]
        : [a + b, 5000 - a, 5000 - b, 5000 + b - a, ...near(z2).map((y) => zp(y) - a), ...near(z1).map((y) => b - zp(y))];
      const [lt, ht] = [qs(lo), qs(hi)];
      return probQ(d, `모집단이 정규분포 ${nrm(P.m, pw(P.sigT, 2))}을 따를 때, 이 모집단에서 임의추출한 크기가 ${P.size}인 표본의 표본평균 ${XB}에 대하여 ${pr(ms(lt + ' <= ') + XB + ms(' <= ' + ht))}를 아래 표준정규분포표를 이용하여 구한 것은?`, right, wr, {
        figure: ztabOf(d, [...new Set([z1, z2])]), expr: straddle ? `(${a}+${b})/10000` : `(${b}-${a})/10000`,
        explain: `${seLine(P)} ${pr(ms(lt + ' <= ') + XB + ms(' <= ' + ht))} = ${pr(ms((straddle ? '-' : '') + z1 + ' <= Z <= ' + z2))} = ${straddle ? `${p4(a)} + ${p4(b)}` : `${p4(b)} − ${p4(a)}`} = ${p4(right)}이다.`
      });
    }),
    T('prob-out', '표본평균이 두 값 밖에 있을 확률', '①20', (d) => {
      const P = popX(d); if (!P) return null;
      const z1 = d.pick([1, 1.5, 2, 2.5]), z2 = d.pick([1, 1.5, 2, 2.5, 3]);
      if (z1 === z2) return null;
      const lo = qsub(Q(P.m), qmul(zq(z1), P.s)), hi = qadd(Q(P.m), qmul(zq(z2), P.s));
      if (places(lo) > 2 || places(hi) > 2) return null;
      const a = zp(z1), b = zp(z2), right = 10000 - a - b;
      const wr = [a + b, 5000 - a, 5000 - b, Math.abs(b - a), 10000 - 2 * a, 10000 - 2 * b, 5000 - a + b, 5000 - b + a];
      const [lt, ht] = [qs(lo), qs(hi)];
      return probQ(d, `${lead(P.c, P.m, P.sigT)} ${P.c.from} 가운데 ${many(P.c, P.size)} 임의추출하여 ${P.c.what}의 표본평균이 ${amt(lt, P.c.u)} 이하이거나 ${amt(ht, P.c.u)} 이상이면 다시 점검한다. 다시 점검하게 될 확률을 아래 표준정규분포표를 이용하여 구한 것은?`, right, wr, {
        figure: ztabOf(d, [z1, z2]), expr: `(10000-${a}-${b})/10000`,
        explain: `${seLine(P)} 구하는 확률은 1 − ${pr(ms('-' + z1 + ' <= Z <= ' + z2))} = 1 − (${p4(a)} + ${p4(b)}) = ${p4(right)}이다.`
      });
    }),
    T('prob-cut', '확률이 주어질 때 표본평균의 경계값', '①21', (d) => {
      const P = popX(d, { se: [Q(1), Q(2), Q(4), Q(5), Q(10)] }); if (!P) return null;
      const z = d.pick([0.6, 0.8, 1, 1.2, 1.4, 1.5, 1.6, 2, 2.4, 2.5]), above = d.bool(), ge = d.bool();
      const cut = qadd(Q(P.m), qmul(Q(above ? 1 : -1), qmul(zq(z), P.s)));
      if (cut.q !== 1 || cut.p <= 0) return null;
      const pz = zp(z), val = (ge === above) ? 5000 - pz : 5000 + pz;
      return numQ(`${lead(P.c, P.m, P.sigT)} ${sampleText(P)}, ${pr(XB + ms((ge ? ' >= ' : ' <= ') + 'c'))} = ${jx(p4(val), '을/를')} 만족시키는 상수 ${V('c')}의 값을 아래 표준정규분포표를 이용하여 구하시오.`, cut.p, {
        figure: ztabOf(d, [z], 3), value: `${P.m}${above ? '+' : '-'}${zq(z).p}*${P.s.p}/(${zq(z).q}*${P.s.q})`,
        explain: `${seLine(P)} 확률이 ${p4(val)}이고 ${val > 5000 ? '0.5보다 크므로 ' + (ge ? 'c는 평균보다 작다' : 'c는 평균보다 크다') : '0.5보다 작으므로 ' + (ge ? 'c는 평균보다 크다' : 'c는 평균보다 작다')}. 0.5와의 차 ${jx(p4(pz), '은/는')} z = ${z}의 값이므로 c = ${P.m} ${above ? '+' : MINUS} ${z} × ${qs(P.s)} = ${cut.p}이다.`
      });
    }),
    T('prob-end', '확률이 주어질 때 구간의 한 끝', '①22', (d) => {
      const P = popX(d, { se: [Q(1), Q(2), Q(4), Q(5), Q(10)] }); if (!P) return null;
      const za = d.pick([0.5, 1, 1.5, 2, 2.5]), zb = d.pick([0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.5, 1.6, 2, 2.4, 2.5, 2.6]), unknownHigh = d.bool();
      const lo = qsub(Q(P.m), qmul(zq(unknownHigh ? za : zb), P.s)), hi = qadd(Q(P.m), qmul(zq(unknownHigh ? zb : za), P.s));
      const ans = unknownHigh ? hi : lo, known = unknownHigh ? lo : hi;
      if (places(known) > 2 || ans.q !== 1 || ans.p <= 0) return null;
      const tot = zp(za) + zp(zb), kt = qs(known), at = qs(ans);
      const cond = unknownHigh ? pr(ms(kt + ' <= ') + XB + ms(' <= a')) : pr(ms('a <= ') + XB + ms(' <= ' + kt));
      return numQ(`${lead(P.c, P.m, P.sigT)} ${sampleText(P)}, ${cond} = ${jx(p4(tot), '을/를')} 만족시키는 상수 ${V('a')}의 값을 아래 표준정규분포표를 이용하여 구하시오.`, ans.p, {
        figure: ztabOf(d, [za, zb]), value: `(${P.m}*${zq(zb).q}*${P.s.q}${unknownHigh ? '+' : '-'}${zq(zb).p}*${P.s.p})/(${zq(zb).q}*${P.s.q})`,
        explain: `${seLine(P)} 아는 끝 ${jx(kt, '은/는')} z = ${unknownHigh ? MINUS : ''}${za}이고 ${ztx(za)}이다. 남은 넓이 ${p4(tot)} − ${p4(zp(za))} = ${jx(p4(zp(zb)), '은/는')} z = ${zb}의 값이므로 a = ${P.m} ${unknownHigh ? '+' : MINUS} ${zb} × ${qs(P.s)} = ${at}이다.`
      });
    }),
    T('prob-abs', 'P(|X̄ − m| ≥ a)로 a 구하기', '①23', (d) => {
      const r = d.pick([2, 3, 4, 5]), size = r * r, s = d.pick([1, 2, 3, 4]), sig = s * r, m = d.int(50, 150), z = d.pick([0.5, 1, 1.5, 2, 2.5]);
      const a = Q(z * 10 * s, 10);
      if (a.q !== 1) return null;
      const val = 10000 - 2 * zp(z);
      return numQ(`모집단이 정규분포 ${nrm(m, pw(sig, 2))}을 따를 때, 이 모집단에서 크기가 ${size}인 표본을 임의추출하여 구한 표본평균 ${XB}에 대하여 ${pr(ms('|') + XB + ms(' - ' + m + '| >= a'))} = ${jx(p4(val), '을/를')} 만족시키는 양수 ${V('a')}의 값을 아래 표준정규분포표를 이용하여 구하시오.`, a.p, {
        figure: ztabOf(d, [z], 3), value: `${zq(z).p}*${s}/${zq(z).q}`,
        explain: `${sd(XB)} = ${sig}/${r} = ${s}이다. ${pr(ms('|Z| >= a/' + s))} = ${p4(val)}이면 ${pr(ms('0 <= Z <= a/' + s))} = (1 − ${p4(val)})/2 = ${p4(zp(z))}이므로 a/${s} = ${z}, a = ${a.p}이다.`
      });
    }),
    T('prob-n', '확률 조건을 만족시키는 표본의 크기', '①24', (d, n) => {
      const c = d.pick(CTX), m = d.int(c.lo, c.hi);
      if (n === 0) {
        const z = d.pick([0.5, 1, 1.2, 1.5, 2, 2.5]), r = d.int(4, 20), sig = d.int(2, 30), cut = qdiv(qmul(zq(z), Q(sig)), Q(r));
        if (places(cut) > 2) return null;
        const val = 5000 + zp(z), ct = qs(cut);
        return numQ(`${lead(c, m, sig)} ${c.from} 가운데 임의추출한 ${Nv}${c.cnt}의 ${c.what}의 표본평균을 ${XB}라 할 때, ${pr(XB + ms(' <= ' + qs(qadd(Q(m), cut))))} = ${p4(val)}이다. 자연수 ${Nv}의 값을 아래 표준정규분포표를 이용하여 구하시오.`, r * r, {
          figure: ztabOf(d, [z], 3), value: `(${zq(z).p}*${sig}*${cut.q})*(${zq(z).p}*${sig}*${cut.q})/(${zq(z).q}*${cut.p}*${zq(z).q}*${cut.p})`,
          explain: `${XB}는 정규분포 N(${m}, ${sig}²/n)을 따른다. ${ct}/(${sig}/√n) = ${z}이어야 하므로 √n = ${z} × ${sig}/${ct} = ${r}, n = ${r * r}이다.`
        });
      }
      const z = d.pick([1, 1.5, 2, 2.5, '1.64']), sig = d.int(4, 40), cut = d.pick([1, 2, 3, 4, 5]);
      const zz = z === '1.64' ? Q(164, 100) : zq(z), half = z === '1.64' ? 4500 : zp(z), val = 2 * half;
      const T2 = qdiv(qmul(qmul(zz, zz), Q(sig * sig)), Q(cut * cut)), need = Math.ceil(qv(T2) - 1e-12);
      if (need < 4 || need > 3000) return null;
      const tab = z === '1.64' ? '' : ztabOf(d, [z], 3), note = z === '1.64' ? ` (단, ${V('Z')}가 표준정규분포를 따르는 확률변수일 때, ${pr('0 <= Z <= 1.64')} = 0.45로 계산한다.)` : ' 아래 표준정규분포표를 이용하여 구하시오.';
      return numQ(`${lead(c, m, sig)} ${c.from} 가운데 임의추출한 ${Nv}${c.cnt}의 ${c.what}의 표본평균을 ${XB}라 할 때, ${pr(ms('|') + XB + ms(' - ' + m + '| <= ' + cut))} ≥ ${jx(val === 9000 ? '0.9' : p4(val), '을/를')} 만족시키는 자연수 ${Nv}의 최솟값을 구하시오.${z === '1.64' ? note : ''}`, need, {
        figure: tab || undefined, range: { ineq: `x*${T2.q}>${T2.p - 1}`, lo: 1, hi: 10000, want: 'min' },
        explain: `${pr(ms('|Z| <= ' + (cut === 1 ? '' : cut) + '√n/' + sig))} ≥ ${val === 9000 ? '0.9' : p4(val)}이려면 ${cut === 1 ? '' : cut}√n/${sig} ≥ ${z === '1.64' ? '1.64' : z}, n ≥ ${dstr(T2.p, T2.q) || fqs(T2)}이다. 자연수 n의 최솟값은 ${need}이다.`
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
