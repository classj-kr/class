// 중학교 3학년 2학기 5단원 산포도 — 단원 틀·그림 도구와 앞쪽 묶음(산포도와 편차, 분산과 표준편차).
// 수집해 둔 미래엔 2015(황선욱) 한 종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 67꼴, 심화꼴 17꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/9-2-5/싣기_대조표.md 에 있다.
// (분산과 표준편차의 뜻, 두 자료의 분포 비교, 평균·분산의 조건과 바꾼 자료 묶음은 9-2-5b.js 에, 실력 문항은 9-2-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 자료와 가능성. 성취기준은 9수04-07(분산과 표준편차를 구하고 자료의 분포를 설명할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(자료 나열 / 편차 / 표 / 값마다 도수를 적은 표 / 꺾은선·막대·점 그래프 / 평균·표준편차 표 / 문자로 놓은 자료)과
//    묻는 것(평균 / 편차 / 분산 / 표준편차 / 모르는 변량 / 더 고른 쪽 / 설명의 옳고 그름)이 다를 때만 따로 싣는다. 소재와 수만 다른 것은 한 번만 싣는다.
//  - 교육과정(2022): 「분산과 표준편차를 구하고 자료의 분포를 설명할 수 있다.」 용어는 산포도·편차·분산·표준편차(와 앞에서 배운 변량·평균)만 쓴다.
//    「대푯값과 산포도를 구할 때 공학 도구를 이용할 수 있게」 — 화면에는 공학 도구가 없으므로 표준편차의 어림은 제곱하여 견주는 길로 풀리게 냈다(var-round).
//    대푯값(평균·중앙값·최빈값)만 묻는 문제는 중1 「자료의 정리와 해석」(7-2-5)의 몫이라 싣지 않는다. 평균을 거쳐 분산·표준편차로 가는 문제는 싣는다.
//  - 답의 꼴: 평균·분산·변량은 수 칸(정수 N, 소수 한 자리 D, 분수 F)이고 음수가 될 수 없어 부호 단추를 달지 않는다. 편차는 음수일 수 있으므로 편차 칸에는 모두 부호 단추를 단다.
//    표준편차는 자연수(N), a√b(「[ ]√[ ]」 또는 「√[ ]」 — 한 유형 안에서는 늘 같은 모양), 분모를 유리화한 꼴(고르기)로 받는다. 음수가 될 수 없어 부호 단추를 달지 않는다.
//    분산이 소수인 자료의 표준편차(√6.8 따위)는 답으로 묻지 않고, 분산까지만 묻거나 반올림한 값을 묻는다.
//  - 답은 모두 코드가 셈한다. 검사 근거(facts.calc)는 문제에 적힌 변량으로 평균·분산을 다시 셈하는 식이다(문제에 적히지 않는 수는 seal 이 facts.unseen 에 밝힌다).
//  - 꼴 목록에 적힌 원문 답지의 잘못(대10의 「표준편차는?」에 분산을 답으로 둔 것, 소2-02의 「편차가 클수록 평균에서 멀다」를 옳다고 한 것)은 따르지 않는다.
//
// 뺀 것과 까닭(9-2-5b.js, 9-2-5c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 대푯값만 묻는 꼴(①1~①27, 심1~심7·심12·심13): 평균·중앙값·최빈값만 구하는 일은 2022 교육과정에서 중1 「대푯값」(7-2-5)으로 내려갔다.
//    몇 배 한 자료의 평균(①27의 표09)도 7-2-5c 의 「변량을 모두 몇 배 하고 같은 수를 더한 자료의 평균」에 있다. ①8 은 까닭을 쓰는 서술형이기도 하다.
//  - 뜻 없는 셈: 따로 구한 두 편차의 합(①30 — 편차를 칸마다 따로 묻는다), 두 변량의 무게의 합(①33의 대21), 빈칸 두 개의 합(①37의 a+b — 칸마다 따로).
//  - 대푯값만 묻는 앞 문항: 평균과 중앙값으로 정한 두 변량의 차(①63의 지대10 — 뒤 문항인 표준편차만 실력으로 실었다).
//  - 같은 일(겹침): 편차의 합 구하기(①29의 함께하기2 — 「편차의 합은 항상 0」을 설명 가리기 ①51에서 묻는다), 변량·편차 표의 빈칸 셋(심8 — ①37과 같다),
//    세 자료의 표준편차 견주기(①56의 기산12)와 자료 다섯의 표준편차 견주기(①57 — 같은 일이라 cmp-least 하나로 실었다),
//    두 자료의 표준편차를 반올림해 견주기(①56의 교마09(2) — 반올림은 var-round, 견주기는 cmp-two).
//  - 산점도를 읽어야 하는 문항(교과서 대단원 15~18·24, 지도서 대단원 13~15·17·18, 최07~09)은 같은 대단원의 다른 중단원(상관관계)이라 꼴 목록에서 세지 않았다.
//  - 그림이 필요해 미룬 꼴은 없다. 점 그래프(평균에 점선)는 이 파일의 dotFig 로, 꺾은선·막대그래프는 엔진의 lineChart·barChart 로 그렸다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, nick, NAMES, frac, lines, numbers, table, lineChart, barChart, N, M, C, F, D, inline } = B.kit;
  const { LAB, MINUS, range, gcd, Q, V, sup, nb, tail, rt, grp, sqParts, radText, f1 } = B.kit.mid;
  const STD = '9수04-07', UNIT = '9-2-5';
  const sourceOf = (ref) => (/①/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});

  // ── 셈 ──
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const srt = (a) => a.slice().sort((x, y) => x - y);
  const ssOf = (dv) => sum(dv.map((v) => v * v));                        // 편차 제곱의 합
  // 분산(유리수). 변량이 정수이고 평균이 정수일 때 쓴다.
  const varOf = (list) => { const m = sum(list) / list.length; return Q(ssOf(list.map((v) => v - m)), list.length); };
  const isSq = (n) => Number.isInteger(Math.sqrt(n));
  const isDec1 = (v) => v.q !== 1 && 10 % v.q === 0;                       // 소수 한 자리로 끝나는 수(분모 2, 5, 10)
  // 합이 0인 정수 편차 n개(크기 k 이하). ok(편차들)로 조건을 더 건다.
  function devs(d, n, k, ok) {
    return d.until(() => { const a = Array.from({ length: n - 1 }, () => d.int(-k, k)); a.push(-sum(a)); return a; },
      (a) => Math.abs(a[n - 1]) <= k && new Set(a).size >= Math.min(n - 1, 4) && (!ok || ok(a)));
  }
  // 분산 v(유리수)의 표준편차 √v = a√b / c (b 는 제곱인 수를 인수로 갖지 않는다)
  function sdOf(v) { const [s, m] = sqParts(v.p * v.q), g = gcd(s, v.q); return { a: s / g, b: m, c: v.q / g }; }

  // ── 수와 단위를 적는 글 ──
  const fx = (x) => String(Math.round(x * 1000) / 1000);
  const sgn = (x) => (x < 0 ? MINUS + fx(-x) : fx(x));                       // −3, 0, 4, −0.3
  const lastDigit = (x) => Number(fx(Math.abs(x)).slice(-1));
  const SOUND = { cm: '터', m: '터', mm: '터', kg: '램', g: '램' };
  const isSym = (u) => /^[A-Za-z]/.test(u);
  const amt = (v, u) => sgn(v) + (u ? (isSym(u) ? ' ' : '') + u : '');
  const ut = (u, pair) => { const w = SOUND[u] || u; return josa(w, pair).slice(w.length); };
  const amtj = (v, u, pair) => amt(v, u) + (u ? ut(u, pair) : tail(lastDigit(v), pair));
  const nj = (x, pair) => sgn(x) + tail(lastDigit(x), pair);                // 수 뒤 토씨(소수는 끝자리를 읽는 소리)
  const wj = (word, pair) => josa(word, pair);
  // 분산·평균의 글: 정수, 소수 한 자리, 분수
  const vtext = (v) => (v.q === 1 ? String(v.p) : isDec1(v) ? fx(v.p / v.q) : nb(frac(v.p, v.q)));
  const vj = (v, pair) => (v.q === 1 ? josa(v.p, pair) : isDec1(v) ? nj(v.p / v.q, pair) : nb(frac(v.p, v.q) + tail(v.p, pair)));
  // 표준편차의 글: 자연수, a√b, a√b/c
  function sdText(v) { const { a, b, c } = sdOf(v), top = b === 1 ? String(a) : (a === 1 ? '' : a) + rt(b); return c === 1 ? top : nb(frac(top, c)); }
  // √n = √(a² × b) = a√b
  const outTold = (n) => { const [a, b] = sqParts(n); return a === 1 ? rt(n) : b === 1 ? `${rt(n)} = ${a}` : `${rt(n)} = ${rt(`${a}${sup(2)} × ${b}`)} = ${radText(a, b)}`; };
  // 분산 v 에서 표준편차까지(풀이 글)
  const sdTold = (v) => (v.q === 1 ? outTold(v.p) : `${rt(nb(frac(v.p, v.q)))} = ${nb(frac(rt(v.p), rt(v.q)))} = ${sdText(v)}`);
  const sqTerm = (e) => (e < 0 ? `(${MINUS}${fx(-e)})` : fx(e)) + sup(2);
  const sqSum = (dv) => dv.map(sqTerm).join(' + ');
  // 자료의 평균·편차·분산을 차례로 적은 풀이(평균이 정수인 자료)
  function told(list, u) {
    const n = list.length, m = sum(list) / n, dv = list.map((v) => v - m), v = varOf(list);
    return `평균은 (${list.join(' + ')}) ÷ ${n} = ${amt(m, u)}이고, 편차는 차례로 ${dv.map(sgn).join(', ')}이다. 분산은 (${sqSum(dv)}) ÷ ${n} = ${ssOf(dv)} ÷ ${n} = ${vtext(v)}이다.`;
  }
  // 편차에서 분산까지(풀이 글)
  const devTold = (dv) => `분산은 (${sqSum(dv)}) ÷ ${dv.length} = ${ssOf(dv)} ÷ ${dv.length} = ${vtext(Q(ssOf(dv), dv.length))}이다.`;
  // 편차들의 합을 적은 글(3 − 2 + 5)
  const plusList = (a) => a.map(sgn).join(' + ').replace(/\+ −/g, '− ');
  // 식 속의 편차: 음수만 괄호에 넣는다(74 + (−3), 77 − 3)
  const pe = (e) => (e < 0 ? `(${sgn(e)})` : sgn(e));

  // ── 검사 근거 ──
  // 검사가 다시 셈하는 식(숫자와 + - * / ( ) 만): 평균, 편차 제곱의 합, 분산
  const js = (x) => (x < 0 ? `(-${fx(-x)})` : fx(x));
  const mExpr = (list) => `(${list.map(js).join('+')})/${list.length}`;
  const ssExpr = (list, mean) => list.map((v) => `(${js(v)}-${mean})**2`).join('+');
  const varExpr = (list) => `(${ssExpr(list, '(' + mExpr(list) + ')')})/${list.length}`;
  const devVarExpr = (dv) => `(${dv.map((e) => js(e) + '**2').join('+')})/${dv.length}`;
  // 문제(글·그림·보기)에 숫자로 적히지 않은 수를 facts.unseen 에 밝힌다(검사와 같은 길로 읽는다).
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function seal(item) {
    const f = item.facts || (item.facts = {});
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    const shown = new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
    const miss = new Set(f.unseen || []);
    for (const t of exprs) for (const n of t.match(/\d+(?:\.\d+)?/g) || []) if (!shown.has(n)) miss.add(Number(n));
    if (miss.size) f.unseen = [...miss];
    return item;
  }

  // ── 답 ──
  const unitTail = (u) => (u ? (isSym(u) ? ' ' : '') + u : '');
  // 표준편차가 a√b(b ≥ 2)인 답: 「[ ]√[ ]」(a = 1이면 「√[ ]」). 단위는 칸 뒤에 적는다. vexp: 분산을 다시 셈하는 식 글(검사 근거)
  function radBox(text, a, b, unit, vexp, o) {
    const tpl = (a === 1 ? rt('{0}') : '{0}' + rt('{1}')) + unitTail(unit), inputs = a === 1 ? [{ answer: b }] : [{ answer: a }, { answer: b }];
    const calc = a === 1 ? [[`(${vexp})`, 0]] : [[`((${vexp})/${b})**0.5`, 0], [`(${vexp})/(${a}*${a})`, 1]];
    return seal(inline(text, grp(tpl), inputs, Object.assign({}, o, { shown: radText(a, b) + unitTail(unit), facts: Object.assign({ calc }, (o && o.facts) || {}) })));
  }
  // 분산(유리수 v)을 답하는 칸: 정수 N, 소수 한 자리 D, 분수 F. vexp 는 검사 근거 식.
  function varBox(text, v, vexp, o) {
    const more = Object.assign({}, o || {}), extra = more.facts || {};
    if (v.q === 1) return seal(N(text, v.p, Object.assign(more, { facts: Object.assign({ calc: [[vexp, 0]] }, extra) })));
    if (isDec1(v)) return seal(D(text, v.p / v.q, Object.assign(more, { facts: Object.assign({ calc: [[vexp, 0]] }, extra) })));
    return seal(F(text, v.p, v.q, Object.assign(more, { improper: v.p > v.q, anyForm: true, facts: Object.assign({ value: vexp }, extra) })));
  }

  // ── 소재 ──
  // 낱낱의 자료: short 는 표의 첫 칸에 적는 이름, base 는 평균으로 삼을 수의 범위, k 는 편차의 크기 한도
  const CTX = [
    { what: '턱걸이 횟수', short: '횟수', unit: '회', who: '학생', cnt: '명', base: [8, 12], k: 5 },
    { what: '일주일 동안의 운동 시간', short: '운동 시간', unit: '시간', who: '학생', cnt: '명', base: [7, 10], k: 5 },
    { what: '수행평가 점수', short: '점수', unit: '점', who: '학생', cnt: '명', base: [12, 16], k: 6 },
    { what: '자유투 성공 횟수', short: '횟수', unit: '회', who: '선수', cnt: '명', base: [8, 12], k: 5 },
    { what: '한 달 동안 읽은 책의 수', short: '책의 수', unit: '권', who: '학생', cnt: '명', base: [7, 9], k: 5 },
    { what: '버스를 기다린 시간', short: '기다린 시간', unit: '분', who: '승객', cnt: '명', base: [8, 12], k: 6 },
    { what: '제기차기 기록', short: '기록', unit: '개', who: '학생', cnt: '명', base: [10, 14], k: 7 },
    { what: '한 달 동안의 도서관 방문 횟수', short: '횟수', unit: '회', who: '학생', cnt: '명', base: [8, 12], k: 6 }
  ];
  const intro = (c, n) => `다음은 ${c.who} ${n}${c.cnt}의 ${wj(c.what, '을/를')} 조사하여 나타낸 것이다.`;
  // 이름(A, B, …)을 붙인 것의 편차 표에 쓰는 소재(who 는 표의 첫 칸, 「빵 D의 무게」처럼 읽는다)
  const DEVC = [
    { what: '키', unit: 'cm', who: '학생', cnt: '명', base: [152, 166] },
    { what: '앉은키', unit: 'cm', who: '학생', cnt: '명', base: [76, 84] },
    { what: '몸무게', unit: 'kg', who: '학생', cnt: '명', base: [44, 58] },
    { what: '무게', unit: 'g', who: '빵', cnt: '개', base: [58, 75] },
    { what: '무게', unit: 'g', who: '라면', cnt: '개', base: [105, 125] },
    { what: '접수 후 대기 시간', unit: '분', who: '환자', cnt: '명', base: [10, 18] },
    { what: '일주일 동안의 공부 시간', unit: '시간', who: '학생', cnt: '명', base: [9, 14] }
  ];
  const ABC = ['A', 'B', 'C', 'D', 'E', 'F'];
  const devIntro = (c, n) => `다음은 ${c.who} ${n}${c.cnt}의 ${c.what}에 대한 편차를 조사하여 나타낸 표이다.`;

  // ── 그림 ──
  // 늘어놓은 자료. 단위는 오른쪽 위에 적는다.
  const dataFig = (list, unit) => '<div style="display:grid;gap:4px;max-width:100%">' + (unit ? `<div style="text-align:right;font-size:0.88rem;color:#52606d">(단위: ${unit})</div>` : '') + numbers(list) + '</div>';
  // 칸이 많은 표는 휴대폰 너비에 들어가게 글씨와 여백을 줄여 같은 틀로 그린다.
  function tbl(head, rows, o) {
    if (!(o && o.tight)) return table(head, rows);
    const st = ' style="padding:5px 5px;font-size:0.93rem"', line = (cells, tag) => '<tr>' + cells.map((cell) => `<${tag}${st}>${cell}</${tag}>`).join('') + '</tr>';
    return '<div class="mb-table-wrap"><table class="mb-table">' + (head ? '<thead>' + line(head, 'th') + '</thead>' : '') + '<tbody>' + rows.map((row) => line(row, 'td')).join('') + '</tbody></table></div>';
  }
  // 이름(A, B, …)마다 편차를 적은 표. cells: 칸에 적을 글(빈칸은 '').
  const devTable = (c, cells) => tbl([c.who].concat(ABC.slice(0, cells.length)), [[`편차(${c.unit})`].concat(cells)], { tight: true });
  // 점 그래프: 차례(names)마다 값을 점으로 찍고 평균에 붉은 점선을 긋는다. 세로 눈금은 lo~hi 를 step 간격으로, 수는 major 칸마다 적는다.
  //  o: { names, lo, hi, step, major, mean, title, xname, yname, yunit, xunit, w, h }
  function dotFig(values, o) {
    const n = values.length, w = o.w || 276, h = o.h || 156, L = 32, R = 38, Tp = o.title ? 36 : 20, Bm = 24, step = o.step || 1, major = o.major || 2;
    const gy = (v) => f1(Tp + (o.hi - v) / (o.hi - o.lo) * (h - Tp - Bm)), cw = (w - L - R) / n, gx = (i) => f1(L + cw * (i + 0.5));
    let out = '';
    for (let t = 0; o.lo + t * step <= o.hi + 1e-9; t += 1) out += `<line class="mb-gridline"${t % major === 0 ? ' style="stroke:#8fa3b8"' : ''} x1="${L}" y1="${gy(o.lo + t * step)}" x2="${w - R}" y2="${gy(o.lo + t * step)}"/>`;
    for (let i = 0; i < n; i += 1) out += `<line class="mb-gridline" x1="${gx(i)}" y1="${Tp}" x2="${gx(i)}" y2="${h - Bm}"/>`;
    out += `<line class="mb-axis" x1="${L}" y1="${Tp - 6}" x2="${L}" y2="${h - Bm}"/><line class="mb-axis" x1="${L}" y1="${h - Bm}" x2="${w - R}" y2="${h - Bm}"/>`;
    for (let t = 0; o.lo + t * step <= o.hi + 1e-9; t += major) out += `<text class="mb-axis-label" style="font-size:12px" x="${L - 4}" y="${f1(gy(o.lo + t * step) + 4)}" text-anchor="end">${fx(o.lo + t * step)}</text>`;
    o.names.forEach((s, i) => { out += `<text class="mb-axis-label" style="font-size:12px" x="${gx(i)}" y="${h - Bm + 16}" text-anchor="middle">${s}</text>`; });
    if (o.yunit) out += `<text class="mb-axis-label" style="font-size:12px" x="${L - 1}" y="${Tp - 10}" text-anchor="end">(${o.yunit})</text>`;
    if (o.xunit) out += `<text class="mb-axis-label" style="font-size:12px" x="${w - R + 3}" y="${h - Bm + 16}" text-anchor="start">(${o.xunit})</text>`;
    if (o.title) out += `<text x="${f1((L + w - R) / 2)}" y="17" text-anchor="middle" style="font-size:13.5px;font-weight:700;fill:#1f2933">${o.title}</text>`;
    out += `<line x1="${L}" y1="${gy(o.mean)}" x2="${w - R + 2}" y2="${gy(o.mean)}" style="stroke:#b42318;stroke-width:1.3;stroke-dasharray:4 3"/><text x="${w - R + 4}" y="${f1(gy(o.mean) + 4.5)}" style="font-size:12px;font-weight:700;fill:#b42318">평균</text>`;
    values.forEach((v, i) => { out += `<circle cx="${gx(i)}" cy="${gy(v)}" r="3.4" style="fill:#1d4ed8"/>`; });
    const said = `점 그래프${o.title ? '(' + o.title + ')' : ''}: 가로는 ${o.xname}, 세로는 ${o.yname}. ${o.names.map((s, i) => `${s} ${fx(values[i])}`).join(', ')}. 평균 ${fx(o.mean)}의 높이에 점선이 있다.`;
    return `<svg class="mb-geo" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 설명 넷 가운데 하나를 고르는 문항. rows: [옳은 문장, 틀린 문장, 틀린 까닭] — 넷을 골라 wantTrue 이면 하나만 옳게, 아니면 하나만 틀리게 싣는다.
  function pickClaim(d, text, rows, wantTrue, o) {
    const four = d.shuffle(rows).slice(0, 4), at = d.int(0, 3), opt = o || {};
    const shown = four.map((r, i) => ((i === at) === wantTrue ? r[0] : r[1]));
    const why = wantTrue ? four.filter((r, i) => i !== at).map((r) => r[2]).join(' ') : four[at][2];
    return C(text, shown, at, { figure: opt.figure, explain: (opt.lead || '') + why, facts: { truth: four.map((r, i) => (i === at) === wantTrue), want: wantTrue } });
  }

  // ═══ 산포도와 편차 ═══
  const DEV = [
    T('dev-graph', '점 그래프로 평균을 중심으로 모인 정도 비교하기', '①28', (d) => {
      // 두 팀의 평균은 같고, 한 팀은 평균 둘레에 모여 있고 다른 팀은 흩어져 있다(편차 제곱의 합이 두 배 넘게 차이 난다).
      const m = d.int(78, 86), tight = devs(d, 6, 4, (a) => a.some((v) => Math.abs(v) >= 3));
      const wide = devs(d, 6, 10, (a) => a.filter((v) => Math.abs(v) >= 6).length >= 3 && ssOf(a) > 2 * ssOf(tight));
      const first = d.bool(), want = d.bool();      // first: A 팀이 모여 있다, want: 더 모여 있는 팀을 묻는다
      const A = (first ? tight : wide).map((e) => m + e), Bv = (first ? wide : tight).map((e) => m + e);
      const lo = Math.floor((m - 11) / 5) * 5, hi = Math.ceil((m + 11) / 5) * 5, names = range(1, 6).map(String);
      const fig = (vals, t) => dotFig(vals, { names, lo, hi, step: 5, major: 1, mean: m, title: t, xname: '경기', yname: '점수(점)', yunit: '점', xunit: '경기', h: 150 });
      const pick = want === first ? 0 : 1;
      return seal(C(`다음은 두 농구 팀 A, B가 6경기에서 얻은 점수를 점으로 나타낸 그래프이다. 두 팀의 점수의 평균은 모두 ${m}점이다. 평균을 중심으로 점수가 더 ${want ? '모여' : '흩어져'} 있는 팀은?`, ['A 팀', 'B 팀'], pick, {
        figure: lines([fig(A, 'A 팀'), fig(Bv, 'B 팀')]),
        explain: `점들이 평균의 점선에 가까이 붙어 있을수록 평균을 중심으로 모여 있다. 분산을 구하면 A 팀은 ${vtext(varOf(A))}, B 팀은 ${vtext(varOf(Bv))}이므로 더 ${want ? '모여' : '흩어져'} 있는 팀은 ${pick ? 'B' : 'A'} 팀이다.`,
        facts: { choose: { exprs: [varExpr(A), varExpr(Bv)], rule: want ? 'min' : 'max' } }
      }));
    }),
    T('dev-table', '평균을 구하여 편차를 모두 구하기', '①29', (d) => {
      const c = d.pick(CTX), n = 5, m = d.int(c.base[0], c.base[1]), dv = devs(d, n, c.k, (a) => a.filter((v) => v < 0).length >= 2 && a.filter((v) => v > 0).length >= 2);
      const list = dv.map((e) => m + e);
      return seal(M(`${intro(c, n)} 이 자료의 평균과 ㉠~㉤에 알맞은 편차를 각각 구하시오.`, [{ label: '평균', answer: m, unit: c.unit }].concat(dv.map((e, i) => ({ label: LAB[i], answer: e, signed: true }))), {
        figure: tbl([`${c.short}(${c.unit})`].concat(list), [['편차'].concat(LAB.slice(0, n))], { tight: true }),
        explain: `평균은 (${list.join(' + ')}) ÷ ${n} = ${amt(m, c.unit)}이다. (편차) = (변량) − (평균)이므로 편차는 차례로 ${dv.map(sgn).join(', ')}이다.`,
        facts: { calc: [[mExpr(list), 0]].concat(list.map((v, i) => [`${v}-(${mExpr(list)})`, i + 1])) }
      }));
    }),
    T('dev-decimal', '소수로 된 자료의 평균과 편차', '①30', (d) => {
      // 평균과 묻는 두 편차가 소수 한 자리이고 정수가 아니다. 두 편차는 하나는 양수, 하나는 음수이다.
      const c = d.pick([{ what: '두께', short: '두께', unit: 'cm', who: '책', cnt: '권', lo: 6, hi: 19 }, { what: '50 m 달리기 기록', short: '기록', unit: '초', who: '학생', cnt: '명', lo: 78, hi: 99 }, { what: '하루 동안의 휴대 전화 사용 시간', short: '사용 시간', unit: '시간', who: '학생', cnt: '명', lo: 12, hi: 34 }]);
      const n = 5, okDev = (a, i, mm) => (a[i] - mm) % 10 !== 0;
      const [raw, ask] = d.until(() => [Array.from({ length: n }, () => d.int(c.lo, c.hi)), d.shuffle(range(0, n - 1)).slice(0, 2).sort((x, y) => x - y)], ([a, [i, j]]) => {
        if (sum(a) % n !== 0 || (sum(a) / n) % 10 === 0 || new Set(a).size !== n) return false; const mm = sum(a) / n;
        return (a[i] - mm) * (a[j] - mm) < 0 && okDev(a, i, mm) && okDev(a, j, mm);
      });
      const m = sum(raw) / n, list = raw.map((v) => v / 10), mean = m / 10, e = ask.map((i) => (raw[i] - m) / 10), f1d = (x) => x.toFixed(1);
      return seal(M(`다음은 ${wj(`${c.who} ${n}${c.cnt}의 ${c.what}`, '을/를')} 조사하여 나타낸 표이다. 이 자료의 평균과 ${c.who} ${ABC[ask[0]]}, ${ABC[ask[1]]}의 편차를 각각 구하시오.`, [
        { label: '평균', answer: mean, unit: c.unit, decimal: true },
        { label: ABC[ask[0]] + '의 편차', answer: e[0], unit: c.unit, decimal: true, signed: true },
        { label: ABC[ask[1]] + '의 편차', answer: e[1], unit: c.unit, decimal: true, signed: true }
      ], {
        figure: tbl([c.who].concat(ABC.slice(0, n)), [[`${c.short}(${c.unit})`].concat(list.map(f1d))], { tight: true }),
        explain: `평균은 (${list.map(f1d).join(' + ')}) ÷ ${n} = ${amt(mean, c.unit)}이다. ${ABC[ask[0]]}의 편차는 ${f1d(list[ask[0]])} − ${fx(mean)} = ${amt(e[0], c.unit)}, ${ABC[ask[1]]}의 편차는 ${f1d(list[ask[1]])} − ${fx(mean)} = ${amt(e[1], c.unit)}이다.`,
        facts: { calc: [[`(${list.map(f1d).join('+')})/${n}`, 0], [`${f1d(list[ask[0]])}-(${list.map(f1d).join('+')})/${n}`, 1], [`${f1d(list[ask[1]])}-(${list.map(f1d).join('+')})/${n}`, 2]] }
      }));
    }),
    T('dev-max', '편차의 최댓값', '①31', (d) => {
      // 절댓값이 가장 큰 편차는 음수이다(절댓값으로 고르면 틀린다).
      const c = d.pick(CTX), n = d.pick([5, 6, 7]), m = d.int(c.base[0], c.base[1]);
      const dv = devs(d, n, c.k, (a) => a.filter((v) => v === Math.max(...a)).length === 1 && Math.max(...a) >= 2 && Math.min(...a) < -Math.max(...a));
      const list = dv.map((e) => m + e), top = Math.max(...list);
      return seal(N(`${intro(c, n)} 이 자료의 편차 가운데 가장 큰 값은?`, top - m, {
        signed: true, unit: c.unit, figure: dataFig(list, c.unit),
        explain: `평균은 (${list.join(' + ')}) ÷ ${n} = ${amt(m, c.unit)}이다. 편차는 변량이 클수록 크므로 가장 큰 편차는 가장 큰 변량의 편차인 ${top} − ${m} = ${amt(top - m, c.unit)}이다.`,
        facts: { calc: [[`${top}-(${mExpr(list)})`, 0]] }
      }));
    }),
    T('dev-closest', '편차의 절댓값이 가장 작은 변량', '①32', (d) => {
      const c = d.pick(CTX), n = 5, m = d.int(c.base[0], c.base[1]);
      const dv = devs(d, n, c.k, (a) => { const g = a.map(Math.abs), lo = Math.min(...g); return g.filter((v) => v === lo).length === 1 && lo >= 1 && lo <= 2 && a.some((v) => v < 0 && -v > lo); });
      const list = dv.map((e) => m + e), at = dv.map(Math.abs).indexOf(Math.min(...dv.map(Math.abs)));
      return seal(N(`${intro(c, n)} 편차의 절댓값이 가장 작은 변량은?`, list[at], {
        unit: c.unit, figure: dataFig(list, c.unit),
        explain: `평균은 (${list.join(' + ')}) ÷ ${n} = ${amt(m, c.unit)}이고 편차는 차례로 ${dv.map(sgn).join(', ')}이다. 편차의 절댓값이 작을수록 변량이 평균에 가까우므로 구하는 변량은 ${amt(list[at], c.unit)}이다.`,
        facts: { calc: [[`${list[at]}`, 0]] }
      }));
    }),
    T('dev-to-value', '평균과 편차로 변량 구하기', '①33', (d) => {
      const c = d.pick(DEVC.filter((x) => x.who === '학생')), m = d.int(c.base[0], c.base[1]), e = d.pick([-1, 1]) * d.int(1, 8), who = nick(d.pick(NAMES));
      return N(`어느 반 학생들의 ${c.what}의 평균은 ${amt(m, c.unit)}이다. ${who}의 ${c.what}의 편차가 ${amt(e, c.unit)}일 때, ${who}의 ${wj(c.what, '은/는')}?`, m + e, {
        unit: c.unit,
        explain: `(편차) = (변량) − (평균)이므로 (변량) = (평균) + (편차) = ${m} + ${pe(e)} = ${amt(m + e, c.unit)}이다.`,
        facts: { calc: [[`${m}+(${js(e)})`, 0]] }
      });
    }),
    T('dev-missing', '편차의 합이 0임을 써서 빈 편차 구하기', '①34', (d) => {
      const n = d.pick([5, 6]), dv = devs(d, n, 6, (a) => a.some((v) => v < 0) && a.some((v) => v > 0)), at = d.int(0, n - 1);
      const others = dv.filter((_, i) => i !== at);
      return seal(N(`어떤 자료의 각 변량의 편차가 다음과 같을 때, ${V('x')}의 값은?`, dv[at], {
        signed: true, figure: numbers(dv.map((e, i) => (i === at ? V('x') : sgn(e)))),
        explain: `편차의 합은 항상 0이므로 ${plusList(others)} + ${V('x')} = 0에서 ${V('x')} = ${sgn(dv[at])}이다.`,
        facts: { calc: [[`0-(${others.map(js).join('+')})`, 0]] }
      }));
    }),
    T('dev-missing-value', '빈 편차를 구하여 그 변량 구하기', '①35', (d) => {
      const c = d.pick(DEVC), n = 5, m = d.int(c.base[0], c.base[1]), dv = devs(d, n, 7, (a) => a.every((v) => v !== 0)), at = d.int(0, n - 1);
      const others = dv.filter((_, i) => i !== at), who = c.who + ' ' + ABC[at];
      return seal(N(`${devIntro(c, n)} ${c.what}의 평균이 ${amt(m, c.unit)}일 때, ${who}의 ${wj(c.what, '은/는')}?`, m + dv[at], {
        unit: c.unit, figure: devTable(c, dv.map((e, i) => (i === at ? '' : sgn(e)))),
        explain: `편차의 합은 0이므로 ${who}의 편차는 ${MINUS}(${plusList(others)}) = ${sgn(dv[at])}이다. 따라서 ${who}의 ${wj(c.what, '은/는')} ${m} + ${pe(dv[at])} = ${amt(m + dv[at], c.unit)}이다.`,
        facts: { calc: [[`${m}-(${others.map(js).join('+')})`, 0]] }
      }));
    }),
    T('dev-missing-mean', '빈 편차를 구한 뒤 한 변량으로 평균 구하기', '①36', (d) => {
      const c = d.pick(DEVC), n = 5, m = d.int(c.base[0], c.base[1]), dv = devs(d, n, 7, (a) => a.every((v) => v !== 0)), at = d.int(0, n - 1);
      const others = dv.filter((_, i) => i !== at), who = c.who + ' ' + ABC[at], value = m + dv[at];
      return seal(N(`${devIntro(c, n)} ${who}의 ${wj(c.what, '이/가')} ${amt(value, c.unit)}일 때, ${c.who} ${n}${c.cnt}의 ${c.what}의 평균은?`, m, {
        unit: c.unit, figure: devTable(c, dv.map((e, i) => (i === at ? '' : sgn(e)))),
        explain: `편차의 합은 0이므로 ${who}의 편차는 ${sgn(dv[at])}이다. (평균) = (변량) − (편차)이므로 평균은 ${value} − ${pe(dv[at])} = ${amt(m, c.unit)}이다.`,
        facts: { calc: [[`${value}+(${others.map(js).join('+')})`, 0]] }
      }));
    }),
    T('dev-mixed-table', '변량과 편차가 섞인 표의 빈칸', '①37 심8', (d) => {
      // 다섯 칸: 변량과 편차가 모두 적힌 칸 둘(그 가운데 하나로 평균을 거꾸로 구한다), 변량만 빈 칸 ㉠, 편차만 빈 칸 ㉡,
      // 변량과 편차가 모두 빈 칸(변량을 ㉢으로 묻는다 — 편차의 합이 0임을 써야 한다).
      const c = d.pick(DEVC), n = 5, m = d.int(c.base[0], c.base[1]), dv = devs(d, n, 7, (a) => a.every((v) => v !== 0)), list = dv.map((e) => m + e);
      const role = d.shuffle(['key', 'val', 'dev', 'both', 'full']), K = role.indexOf('key'), A = role.indexOf('val'), Bk = role.indexOf('dev'), Ck = role.indexOf('both'), Fk = role.indexOf('full');
      const vcell = (i) => (i === A ? '㉠' : i === Ck ? '' : String(list[i])), dcell = (i) => (i === Bk ? '㉡' : i === Ck ? '' : sgn(dv[i]));
      const fig = tbl([c.who].concat(ABC.slice(0, n)), [[`${c.what.replace(/^.* /, '')}(${c.unit})`].concat(range(0, n - 1).map(vcell)), [`편차(${c.unit})`].concat(range(0, n - 1).map(dcell))], { tight: true });
      const mE = `${list[K]}-(${js(dv[K])})`, eB = `${list[Bk]}-(${mE})`, eC = `-(${js(dv[K])}+${js(dv[A])}+(${eB})+${js(dv[Fk])})`;
      return seal(M(`다음은 ${c.who} ${n}${c.cnt}의 ${wj(c.what, '과/와')} 그 편차를 조사하여 나타낸 표인데 일부가 지워졌다. ㉠, ㉡에 알맞은 수와 ${c.who} ${ABC[Ck]}의 ${wj(c.what, '을/를')} 각각 구하시오.`, [
        { label: '㉠', answer: list[A], unit: c.unit }, { label: '㉡', answer: dv[Bk], signed: true }, { label: `${c.who} ${ABC[Ck]}`, answer: list[Ck], unit: c.unit }
      ], {
        figure: fig,
        explain: `${c.who} ${ABC[K]}에서 (평균) = (변량) − (편차) = ${list[K]} − ${pe(dv[K])} = ${amt(m, c.unit)}이다. ㉠ = ${m} + ${pe(dv[A])} = ${list[A]}, ㉡ = ${list[Bk]} − ${m} = ${sgn(dv[Bk])}이다. 편차의 합은 0이므로 ${c.who} ${ABC[Ck]}의 편차는 ${sgn(dv[Ck])}이고, ${c.who} ${ABC[Ck]}의 ${wj(c.what, '은/는')} ${m} + ${pe(dv[Ck])} = ${amt(list[Ck], c.unit)}이다.`,
        facts: { calc: [[`(${mE})+(${js(dv[A])})`, 0], [eB, 1], [`(${mE})+(${eC})`, 2]] }
      }));
    })
  ];

  // ═══ 분산과 표준편차 ═══
  const VAR = [
    T('var-int', '자료에서 분산과 표준편차 구하기', '①40', (d) => {
      const c = d.pick(CTX), n = d.pick([5, 6]), m = d.int(c.base[0], c.base[1]);
      const dv = devs(d, n, c.k, (a) => ssOf(a) % n === 0 && isSq(ssOf(a) / n) && ssOf(a) / n >= 4);
      const list = dv.map((e) => m + e), v = ssOf(dv) / n, s = Math.sqrt(v);
      return seal(M(`${intro(c, n)} 이 자료의 분산과 표준편차를 각각 구하시오.`, [{ label: '분산', answer: v }, { label: '표준편차', answer: s, unit: c.unit }], {
        figure: dataFig(list, c.unit), explain: `${told(list, c.unit)} 표준편차는 ${rt(v)} = ${amt(s, c.unit)}이다.`,
        facts: { calc: [[varExpr(list), 0], [`(${varExpr(list)})**0.5`, 1]] }
      }));
    }),
    T('var-rad', '표준편차가 근호로 나오는 자료', '①41', (d) => {
      const c = d.pick(CTX), n = 5, m = d.int(c.base[0], c.base[1]);
      const dv = devs(d, n, Math.max(c.k, 7), (a) => { const s = ssOf(a); if (s % n) return false; const [p, q] = sqParts(s / n); return p >= 2 && q >= 2; });
      const list = dv.map((e) => m + e), v = ssOf(dv) / n, [a, b] = sqParts(v);
      return radBox(`${intro(c, n)} 이 자료의 표준편차는?`, a, b, c.unit, varExpr(list), {
        figure: dataFig(list, c.unit), explain: `${told(list, c.unit)} 표준편차는 ${outTold(v)}(${c.unit})이다.`
      });
    }),
    T('var-steps', '평균, 편차의 제곱의 합, 분산을 차례로 구하기', '①42', (d) => {
      const c = d.pick(CTX), n = 5, m = d.int(c.base[0], c.base[1]);
      const dv = devs(d, n, c.k, (a) => ssOf(a) % n !== 0);
      const list = dv.map((e) => m + e), ss = ssOf(dv);
      return seal(M(`${intro(c, n)} 이 자료의 평균, 편차의 제곱의 합, 분산을 차례로 구하시오.`, [
        { label: '평균', answer: m, unit: c.unit }, { label: '편차의 제곱의 합', answer: ss }, { label: '분산', answer: ss / n, decimal: true }
      ], {
        figure: dataFig(list, c.unit),
        explain: `평균은 (${list.join(' + ')}) ÷ ${n} = ${amt(m, c.unit)}이고 편차는 차례로 ${dv.map(sgn).join(', ')}이다. 편차의 제곱의 합은 ${sqSum(dv)} = ${ss}이고, 분산은 ${ss} ÷ ${n} = ${fx(ss / n)}이다.`,
        facts: { calc: [[mExpr(list), 0], [ssExpr(list, '(' + mExpr(list) + ')'), 1], [varExpr(list), 2]] }
      }));
    }),
    T('var-round', '표준편차를 반올림하여 어림하기', '①43', (d) => {
      // 분산은 소수 한 자리. 표준편차를 반올림한 값은 정수가 아니고, 반올림의 경계에서 넉넉히 떨어져 있다(제곱하여 견주면 갈린다).
      const c = d.pick(CTX), n = 5, m = d.int(c.base[0], c.base[1]);
      const dv = devs(d, n, Math.max(c.k, 7), (a) => { const s = ssOf(a); if (s % n === 0) return false; const t = Math.sqrt(s / n) * 10, r = Math.round(t); return r % 10 !== 0 && Math.abs(t - r) < 0.4 && s / n < 100; });
      const list = dv.map((e) => m + e), v = ssOf(dv) / n, r = Math.round(Math.sqrt(v) * 10) / 10, lo = Math.round(r * 100 - 5) / 100, hi = Math.round(r * 100 + 5) / 100;
      const sqr = (x) => { const k = Math.round(x * 100); return String(k * k / 10000); };
      return seal(M(`${intro(c, n)} 이 자료의 분산과 표준편차를 각각 구하시오. (단, 표준편차는 반올림하여 소수 첫째 자리까지 구한다.)`, [
        { label: '분산', answer: v, decimal: true }, { label: '표준편차', answer: r, decimal: true, unit: c.unit }
      ], {
        figure: dataFig(list, c.unit),
        explain: `${told(list, c.unit)} 표준편차는 ${rt(fx(v))}이다. ${fx(lo)}${sup(2)} = ${sqr(lo)}, ${fx(hi)}${sup(2)} = ${sqr(hi)}이고 ${sqr(lo)} &lt; ${fx(v)} &lt; ${sqr(hi)}이므로 ${rt(fx(v))}${tail(lastDigit(v), '은/는')} ${fx(lo)}보다 크고 ${fx(hi)}보다 작다. 반올림하면 ${amt(r, c.unit)}이다.`,
        facts: { calc: [[varExpr(list), 0], [`((${varExpr(list)})**0.5*10+0.5-((${varExpr(list)})**0.5*10+0.5)%1)/10`, 1]] }
      }));
    }),
    T('var-from-dev', '편차에서 분산과 표준편차 구하기', '①44', (d, k) => {
      if (k === 0) {
        // 분산이 제곱인 수를 인수로 갖지 않는 자연수: 표준편차 √b
        const n = 5, dv = devs(d, n, 6, (a) => { const s = ssOf(a); return s % n === 0 && s / n >= 2 && sqParts(s / n)[0] === 1; }), v = ssOf(dv) / n;
        return seal(inline('어떤 자료의 각 변량의 편차가 다음과 같을 때, 이 자료의 분산과 표준편차를 각각 구하시오.', `분산 {0}, 표준편차 ${grp(rt('{1}'))}`, [{ answer: v }, { answer: v }], {
          figure: numbers(dv.map(sgn)), shown: `분산 ${v}, 표준편차 ${rt(v)}`,
          explain: `${devTold(dv)} 표준편차는 ${rt(v)}이다.`,
          facts: { calc: [[devVarExpr(dv), 0], [devVarExpr(dv), 1]], rule: 'devRad' }
        }));
      }
      // 변량이 6개이고 분산이 분수: 표준편차는 분모를 유리화한 꼴(고르기). 틀린 보기는 분모만 근호를 벗긴 것, 분산 그대로, 분모를 잊은 것, 편차 제곱의 합의 제곱근을 6으로 나눈 것.
      const n = 6;
      const pack = (a) => { const s = ssOf(a), v = Q(s, n), [p1, p2] = sqParts(v.p); return { v, s, list: [sdText(v), nb(frac(radText(p1, p2), v.q)), vtext(v), radText(p1, p2), sdText(Q(s, n * n))] }; };
      const dv = devs(d, n, 5, (a) => { const s = ssOf(a), v = Q(s, n), { b, c } = sdOf(v); if (v.q === 1 || b < 2 || c < 2 || s < 8) return false; const L = pack(a).list.map(stripH); return new Set(L).size === 5; });
      const { v, list } = pack(dv), opts = d.shuffle(list);
      return C('어떤 자료의 각 변량의 편차가 다음과 같을 때, 이 자료의 표준편차는?', opts, opts.indexOf(list[0]), {
        figure: numbers(dv.map(sgn)),
        explain: `${devTold(dv)} 표준편차는 ${sdTold(v)}이다.`,
        facts: { truth: opts.map((o) => o === list[0]), want: true, rule: 'devFrac' }
      });
    }, { count: 2 }),
    T('var-fill-dev', '빈 편차를 채운 뒤 표준편차 구하기', '①45', (d) => {
      const c = d.pick(DEVC), n = 5;
      const dv = devs(d, n, 6, (a) => { const s = ssOf(a); if (s % n) return false; const [p, q] = sqParts(s / n); return p >= 2 && q >= 2 && a.every((x) => x !== 0); }), at = d.int(0, n - 1);
      const v = ssOf(dv) / n, [a, b] = sqParts(v), others = dv.filter((_, i) => i !== at);
      const xE = `-(${others.map(js).join('+')})`, vE = `(${others.map((e) => js(e) + '**2').join('+')}+(${xE})**2)/${n}`;
      return radBox(`${devIntro(c, n)} ${c.who} ${n}${c.cnt}의 ${c.what}의 표준편차는?`, a, b, c.unit, vE, {
        figure: devTable(c, dv.map((e, i) => (i === at ? V('x') : sgn(e)))),
        explain: `편차의 합은 0이므로 ${V('x')} = ${sgn(dv[at])}이다. ${devTold(dv)} 표준편차는 ${outTold(v)}(${c.unit})이다.`
      });
    }),
    T('var-mean-x', '평균으로 모르는 변량을 구한 뒤 분산 구하기', '①46', (d) => {
      const n = 5, m = d.int(6, 14), dv = devs(d, n, 6, (a) => ssOf(a) % n !== 0), list = dv.map((e) => m + e), at = d.int(0, n - 1);
      const others = list.filter((_, i) => i !== at), xE = `${n}*${m}-(${others.join('+')})`;
      const vE = `(${others.map((x) => `(${x}-${m})**2`).join('+')}+(${xE}-${m})**2)/${n}`;
      return varBox(`다음 변량 ${n}개의 평균이 ${m}일 때, 이 자료의 분산은?`, Q(ssOf(dv), n), vE, {
        figure: numbers(list.map((x, i) => (i === at ? V('x') : String(x)))),
        explain: `(${others.join(' + ')} + ${V('x')}) ÷ ${n} = ${m}에서 ${V('x')} = ${list[at]}이다. 편차는 차례로 ${dv.map(sgn).join(', ')}이므로 ${devTold(dv)}`
      });
    }),
    T('var-self-mean', '평균이 모르는 변량 자신인 자료의 표준편차', '①47', (d) => {
      // 변량 a 가 평균과 같다: 나머지 변량의 평균이 곧 a 이다.
      const n = 5, m = d.int(6, 12), rest = devs(d, n - 1, 5, (a) => { const s = ssOf(a); return s % n === 0 && isSq(s / n) && a.every((v) => v !== 0); });
      const at = d.int(1, n - 2), dvAll = rest.slice(0, at).concat([0], rest.slice(at)), list = dvAll.map((e) => m + e), others = list.filter((_, i) => i !== at), s = Math.sqrt(ssOf(rest) / n);
      const aE = `(${others.join('+')})/${n - 1}`;
      return seal(N(`다음 자료의 평균이 ${V('a')}일 때, 이 자료의 표준편차는?`, s, {
        figure: numbers(list.map((x, i) => (i === at ? V('a') : String(x)))),
        explain: `(${others.join(' + ')} + ${V('a')}) ÷ ${n} = ${V('a')}에서 ${sum(others)} + ${V('a')} = ${n}${V('a')}, ${V('a')} = ${m}이다. 편차는 차례로 ${dvAll.map(sgn).join(', ')}이므로 ${devTold(dvAll)} 표준편차는 ${outTold(ssOf(rest) / n)}이다.`,
        facts: { calc: [[`((${others.map((x) => `(${x}-${aE})**2`).join('+')})/${n})**0.5`, 0]] }
      }));
    }),
    T('var-letter', '변량이 문자로 된 자료의 분산', '①48', (d) => {
      const L = d.pick(['a', 'm', 'x', 'k']), n = 5;
      const cs = d.until(() => Array.from({ length: n }, () => d.int(-5, 5)), (a) => sum(a) % n === 0 && new Set(a).size === n && ssOf(a.map((v) => v - sum(a) / n)) % n !== 0 && !a.includes(0));
      const mo = sum(cs) / n, dv = cs.map((v) => v - mo), shown = cs.map((k) => nb(k < 0 ? `${V(L)} ${MINUS} ${-k}` : `${V(L)} + ${k}`));
      return varBox('다음 자료의 분산은?', Q(ssOf(dv), n), `(${cs.map((k) => `(${js(k)}-(${cs.map(js).join('+')})/${n})**2`).join('+')})/${n}`, {
        figure: numbers(shown),
        explain: `평균은 ${nb(mo === 0 ? V(L) : `${V(L)} ${mo < 0 ? MINUS : '+'} ${Math.abs(mo)}`)}이므로 편차는 차례로 ${dv.map(sgn).join(', ')}이다. 편차에는 문자가 남지 않는다. ${devTold(dv)}`
      });
    }),
    T('var-freq', '값마다 도수를 적은 표에서 평균과 분산', '①49', (d) => {
      const c = d.pick([{ subj: (t) => `농구 동아리 회원 ${t}명의 자유투 성공 횟수를`, short: '성공 횟수', unit: '회', who: '회원', cnt: '명' }, { subj: (t) => `학생 ${t}명이 하루 동안 마신 물의 컵 수를`, short: '컵 수', unit: '컵', who: '학생', cnt: '명' }, { subj: (t) => `학생 ${t}명이 한 달 동안 받은 칭찬 스티커의 수를`, short: '스티커 수', unit: '장', who: '학생', cnt: '명' }]);
      const k0 = d.int(3, 7), vals = range(k0, k0 + 4), total = d.pick([10, 20]);
      const f = d.until(() => { const a = Array.from({ length: 4 }, () => d.int(1, total / 2)); a.push(total - sum(a)); return a; }, (a) => {
        if (a[4] < 1) return false; const s = sum(a.map((x, i) => x * vals[i])); if (s % total) return false;
        const mm = s / total, ss = sum(a.map((x, i) => x * (vals[i] - mm) ** 2)); return (ss * 10) % total === 0 && ss % total !== 0 && a.filter((x) => x === Math.max(...a)).length === 1;
      });
      const m = sum(f.map((x, i) => x * vals[i])) / total, ss = sum(f.map((x, i) => x * (vals[i] - m) ** 2));
      const mE = `(${vals.map((v, i) => `${v}*${f[i]}`).join('+')})/${total}`, vE = `(${vals.map((v, i) => `(${v}-${mE})**2*${f[i]}`).join('+')})/${total}`;
      return seal(M(`다음은 ${c.subj(total)} 조사하여 나타낸 표이다. 이 자료의 평균과 분산을 각각 구하시오.`, [
        { label: '평균', answer: m, unit: c.unit }, { label: '분산', answer: ss / total, decimal: true }
      ], {
        figure: tbl([`${c.short}(${c.unit})`].concat(vals), [[`${c.who} 수(${c.cnt})`].concat(f)], { tight: true }),
        explain: `평균은 (${vals.map((v, i) => `${v} × ${f[i]}`).join(' + ')}) ÷ ${total} = ${amt(m, c.unit)}이다. 편차는 차례로 ${vals.map((v) => sgn(v - m)).join(', ')}이고 도수만큼 있으므로 분산은 (${vals.map((v, i) => `${sqTerm(v - m)} × ${f[i]}`).join(' + ')}) ÷ ${total} = ${ss} ÷ ${total} = ${fx(ss / total)}이다.`,
        facts: { calc: [[mE, 0], [vE, 1]] }
      }));
    }),
    T('var-graph', '그래프에서 자료를 읽어 분산·표준편차 구하기', '①50', (d, k) => {
      if (k === 0) {
        // 꺾은선그래프(경기마다의 득점) → 표준편차 √b
        const n = 6, m = d.int(8, 12), dv = devs(d, n, 5, (a) => { const s = ssOf(a); return s % n === 0 && s / n >= 2 && sqParts(s / n)[0] === 1; }), list = dv.map((e) => m + e), v = ssOf(dv) / n;
        return radBox(`다음 꺾은선그래프는 어느 농구 선수가 ${n}경기에서 얻은 득점을 나타낸 것이다. 이 선수의 득점의 표준편차는?`, 1, v, '점', varExpr(list), {
          figure: lineChart(range(1, n).map(String), list, { step: 1, major: 5, top: 20, unit: '점', title: '경기' }),
          explain: `그래프에서 득점은 차례로 ${list.join(', ')}이다. ${told(list, '점')} 표준편차는 ${rt(v)}점이다.`,
          facts: { rule: 'lineSd' }
        });
      }
      // 막대그래프(점수마다의 사람 수) → 분산(소수 한 자리)
      const top = d.pick([4, 5]), vals = range(1, top), total = 10;
      const f = d.until(() => { const a = Array.from({ length: top - 1 }, () => d.int(0, 5)); a.push(total - sum(a)); return a; }, (a) => {
        if (a[top - 1] < 0 || a.filter((x) => x > 0).length < 3 || Math.max(...a) > 6) return false; const s = sum(a.map((x, i) => x * vals[i])); if (s % total) return false;
        const mm = s / total, ss = sum(a.map((x, i) => x * (vals[i] - mm) ** 2)); return ss % total !== 0;
      });
      const m = sum(f.map((x, i) => x * vals[i])) / total, ss = sum(f.map((x, i) => x * (vals[i] - m) ** 2));
      const mE = `(${vals.map((v, i) => `${v}*${f[i]}`).join('+')})/${total}`;
      return varBox(`다음 막대그래프는 1점부터 ${top}점까지의 점수로 매기는 영화 평점에서 관람객 ${total}명이 준 점수를 나타낸 것이다. 이 자료의 분산은?`, Q(ss, total), `(${vals.map((v, i) => `(${v}-${mE})**2*${f[i]}`).join('+')})/${total}`, {
        figure: barChart(vals.map((v) => v + '점'), f, { step: 1, major: 5, top: 10, unit: '명', title: '점수' }),
        explain: `평균은 (${vals.map((v, i) => `${v} × ${f[i]}`).join(' + ')}) ÷ ${total} = ${m}(점)이다. 편차는 차례로 ${vals.map((v) => sgn(v - m)).join(', ')}이므로 분산은 (${vals.map((v, i) => `${sqTerm(v - m)} × ${f[i]}`).join(' + ')}) ÷ ${total} = ${ss} ÷ ${total} = ${fx(ss / total)}이다.`,
        facts: { rule: 'barVar' }
      });
    }, { count: 2 })
  ];

  B.addUnit({
    id: '9-2-5', grade: 9, semester: 2, no: 5, title: '산포도', version: 1,
    groups: [
      { id: 'dev', title: '산포도와 편차', standard: STD, types: DEV },
      { id: 'var', title: '분산과 표준편차', standard: STD, types: VAR },
      { id: 'mean', title: '분산과 표준편차의 뜻', standard: STD, types: [] },
      { id: 'cmp', title: '두 자료의 분포 비교', standard: STD, types: [] },
      { id: 'cond', title: '평균·분산의 조건과 바꾼 자료', standard: STD, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(9-2-5b.js, 9-2-5c.js)이 함께 쓰는 도구
  B.kit.m925 = {
    STD, UNIT, T, sourceOf, sum, srt, ssOf, varOf, isSq, isDec1, devs, sdOf, fx, sgn, lastDigit, isSym, amt, ut, amtj, nj, wj, vtext, vj, sdText, outTold, sdTold, sqTerm, sqSum, told, devTold, plusList, pe,
    js, mExpr, ssExpr, varExpr, devVarExpr, stripH, seal, unitTail, radBox, varBox, CTX, intro, DEVC, ABC, devIntro, dataFig, tbl, devTable, dotFig, pickClaim
  };
})(typeof window !== 'undefined' ? window : globalThis);
