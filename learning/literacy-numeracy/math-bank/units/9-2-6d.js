// 중학교 3학년 2학기 6단원 상자그림과 산점도 — 상자그림 묶음(사분위수와 상자그림, 상자그림의 해석과 분포 비교)과 상자그림 실력 문항.
// 2022 교육과정 [9수04-08] 「공학 도구를 이용하여 자료를 상자그림으로 나타내고 분포를 비교할 수 있다.」를 덧붙인 것이다(산점도 묶음은 9-2-6a·b·c.js).
// 해설: 「상자그림을 다룰 때는 두 집단의 분포를 비교하고 해석하는 활동에 중점을 두고, 이를 통해 상자그림의 유용성을 인식하게 한다.」 용어: 사분위수, 상자그림.
// 중3 2022 교과서가 수집본에 없어, 천재 T셀파 「실용 통계」(김동재, 2022 개정 고등 융합 선택)에서 사분위수·상자그림을 쓰는 문제만 읽어 꼴 목록을 만들었다:
//   references/textbooks/수학/_분석/9-2-6-상자/기본꼴_1.md (10꼴). 꼴마다의 판정은 같은 폴더의 싣기_대조표.md 에 있다.
// ref: 상자 ①n = 그 꼴 목록의 n번(산점도 파일의 ①n 은 다른 목록이다).
//
// 싣는 기준
//  - 사분위수는 실용 통계 교과서의 방법(자료를 크기순으로 늘어놓고 중앙값을 기준으로 반씩 나눈 아래쪽 절반과 위쪽 절반의 중앙값)으로 구한다.
//    자료를 주고 사분위수를 묻는 문항은 그 방법을 문제 글에 적는다(HOW). 자료의 수는 모두 짝수로 한다 — 수집본의 자료가 모두 짝수 개이고,
//    홀수 개일 때 중앙값을 두 절반에 넣는지는 교과서마다 달라 헷갈리기 때문이다.
//  - 용어는 2022 중학교 용어(사분위수, 상자그림)와 앞에서 배운 말(최솟값·최댓값·중앙값·평균·계급·도수)만 쓴다.
//    「사분위수 범위」「이상값」「범위」는 쓰지 않고 「제3사분위수와 제1사분위수의 차」「상자의 길이」「멀리 떨어진 값」으로 적는다.
//  - 상자그림은 이 파일의 boxFig 로 그린다: 가로 수직선 위의 상자(제1사분위수~제3사분위수)·상자 안의 선(중앙값)·수염(최솟값·최댓값까지).
//    두 집단은 위아래로 놓아 견준다. 상자그림에서 값을 읽는 문항의 값은 모두 눈금 위에 놓는다.
//  - 상자그림으로 알 수 있는 것만 옳다고 한다: 다섯 수의 크기 견주기와, 사분위수의 뜻으로 따질 수 있는 「절반 이상」「25 % 이상」.
//    낱낱의 값·자료의 개수처럼 상자그림으로 알 수 없는 것을 말한 문장은 옳지 않은 것으로만 쓰고, 그때도 다섯 수로 틀림이 드러나게 한다.
//  - 답은 모두 자연수가 되게 자료를 고른다(소수 둘째 자리 답은 없다). 음수가 될 수 있는 답이 없어 부호 단추를 달지 않는다.
//  - 꼴 목록에 적힌 원문 답은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭
//  - 상자 ①10(이상값이 있는 자료의 대푯값·산포도 고르기): 이상값 판정과 「사분위수 범위」를 산포도로 고르는 일은 2022 중학교 성취기준·용어 밖이다.
//    평균·표준편차만 답이 되는 짝 문항은 9-2-5 「산포도」의 몫이다. 사분위수를 구하는 쪽은 ①1(box-quart, box-gap)과 같다.
//  - 공학 도구로만 구할 수 있는 큰 자료(①1의 강수량 46개): 손으로 사분위수를 구할 수 없다. 같은 일을 자료 10~20개로 실었다.
//  - 상자그림 그리기(①3의 작도·공학 도구)는 「다섯 수에 맞는 상자그림 고르기」(box-draw)로 바꾸었다. 「이상값이 있으므로 상자그림」(①3·①9의 평가 문항)은 이상값 판정이라 뺐다.
//  - 포스터 오류 찾기(①7의 서술형)의 정규분포·신뢰구간·검정 문장은 고등학교 내용이라 뺐다. 상자그림과 히스토그램을 함께 읽는 쪽만 실력(hard-box-peaks)으로 실었다.
//  - 「분포를 파악하기에 가장 알맞은 그래프」(①9의 6월 기온 (3)): 답이 히스토그램이라는 것은 판단이 갈려 싣지 않았다. 낱낱의 값을 보는 그래프(같은 문항 (2))는 box-talk 에 실었다.
//
// 실력(hard 묶음에 덧붙임) — 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 상자가 길면(수염이 길면) 그 안에 든 자료가 많다고 본다. 상자 안에는 어느 상자그림이든 자료의 절반쯤이 들고, 길이는 퍼진 정도일 뿐이다.
//  - 상자그림의 중앙값이 상자 가운데쯤 있으면 자료가 중앙값 근처에 몰려 있다고 본다(봉우리가 둘인 자료도 상자그림은 그렇게 보일 수 있다).
//  - 자료의 수가 다른 두 집단을 상자그림의 길이로 개수까지 견준다. 히스토그램에서 중앙값·사분위수가 든 계급을 그래프의 가운데로 짐작한다.
//  ①(뜻을 정확히 대야 풀리는 것): hard-box-peaks, hard-box-cmp-trap / ②(세 단계 넘게 잇는 것): hard-box-hist, hard-box-two-data
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, numbers, table, N, M, C } = B.kit;
  const { LAB, range, tail, f1, claimQ } = B.kit.mid;
  const { figOpt, subj, topic, obj, amt } = B.kit.m926;
  const STD = '9수04-08';
  const src = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: src(ref), standard: STD, make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: src(ref), standard: STD, make }, more || {});

  // ── 셈 ──
  const srt = (a) => a.slice().sort((x, y) => x - y);
  const medOf = (s) => (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2);
  // 다섯 수(자료의 수는 짝수): 크기순으로 늘어놓고 중앙값을 기준으로 반씩 나눈 두 절반의 중앙값이 제1·제3사분위수
  function five(list) {
    const s = srt(list), h = s.length / 2, lo = s.slice(0, h), hi = s.slice(h);
    return { s, lo, hi, min: s[0], q1: medOf(lo), med: medOf(s), q3: medOf(hi), max: s[s.length - 1], all: [s[0], medOf(lo), medOf(s), medOf(hi), s[s.length - 1]] };
  }
  // 절반의 가운데 두 값이 서로 다르고 평균이 자연수(가운데 두 값의 평균을 내야 답이 나오게). 절반의 수가 홀수이면 가운데 값 하나.
  const midOk = (s) => s.length % 2 === 1 || (Number.isInteger(medOf(s)) && s[s.length / 2 - 1] !== s[s.length / 2]);
  // 가운데 값을 다시 셈하는 식 글(검사 근거)과 풀이 글
  const midExpr = (s) => (s.length % 2 ? String(s[(s.length - 1) / 2]) : `(${s[s.length / 2 - 1]}+${s[s.length / 2]})/2`);
  // 「가운데 값 23」 / 「가운데 두 값 22, 24의 평균 23」 뒤에 토씨(pair)를 붙인다.
  const midSay = (s, pair) => (s.length % 2 ? '가운데 값 ' : `가운데 두 값 ${s[s.length / 2 - 1]}, ${s[s.length / 2]}의 평균 `) + josa(medOf(s), pair);
  const midSayIs = (s) => (s.length % 2 ? '가운데 값 ' : `가운데 두 값 ${s[s.length / 2 - 1]}, ${s[s.length / 2]}의 평균 `) + medOf(s);   // 뒤에 「이다·이고」
  const PART = ['최솟값', '제1사분위수', '중앙값', '제3사분위수', '최댓값'];

  // ── 글 ──
  // 단위 뒤 토씨: 우리말 단위는 끝소리로, 단위 기호는 읽는 소리로(mm·cm → 는/를/가, kg·g → 은/을/이)
  const uj = (u, pair) => { const [a, b] = pair.split('/'); if (!/^[A-Za-z]/.test(u)) return josa(u, pair).slice(u.length); return /g$/.test(u) ? a : b; };
  const ua = (v, u, pair) => amt(v, u) + uj(u, pair);
  const HOW = '(단, 제1사분위수와 제3사분위수는 자료를 작은 값부터 크기순으로 늘어놓고 중앙값을 기준으로 반씩 나누었을 때 아래쪽 절반과 위쪽 절반의 중앙값이다.)';
  const unitNote = (u) => `<div style="text-align:right;font-size:0.88rem;color:#52606d">(단위: ${u})</div>`;
  const dataFig = (list, u) => '<div style="display:grid;gap:4px;max-width:100%">' + unitNote(u) + numbers(list.map(String)) + '</div>';
  const twoData = (names, lists, u) => '<div style="display:grid;gap:6px;max-width:100%">' + unitNote(u)
    + names.map((nm, i) => `<div style="font-weight:700">${nm}</div>` + numbers(lists[i].map(String))).join('') + '</div>';

  // ── 소재 ──
  // 낱낱의 자료. of(n): 「…을 조사하여」 앞의 말, lo~hi: 자료의 값, ax: 상자그림의 눈금 [처음, 한 칸, 칸 수],
  //  far: 멀리 떨어진 값을 넣을 수 있는 자료('high' 큰 쪽, 'low' 작은 쪽)와 그 값의 범위 farAt.
  //  four: 네 집단을 견주는 그림(box-sym)의 말.
  const ONE = [
    { of: (n) => `어느 반 학생 ${n}명의 수학 수행평가 점수`, four: '네 반 학생들의 수학 수행평가 점수', unit: '점', lo: 12, hi: 50, ax: [10, 5, 8] },
    { of: (n) => `어느 반 학생 ${n}명의 1분 동안의 윗몸 일으키기 기록`, four: '네 반 학생들의 1분 동안의 윗몸 일으키기 기록', unit: '회', lo: 15, hi: 58, ax: [10, 5, 10] },
    { of: (n) => `어느 반 학생 ${n}명이 등교하는 데 걸리는 시간`, four: '네 반 학생들이 등교하는 데 걸리는 시간', unit: '분', lo: 4, hi: 40, ax: [0, 5, 10] },
    { of: (n) => `어느 반 학생 ${n}명의 제자리멀리뛰기 기록`, four: '네 반 학생들의 제자리멀리뛰기 기록', unit: 'cm', lo: 145, hi: 235, ax: [140, 10, 10] },
    { of: (n) => `어느 가게의 ${n}일 동안의 하루 주문 건수`, four: '네 가게의 하루 주문 건수', unit: '건', lo: 10, hi: 30, ax: [0, 5, 12], far: 'high', farAt: [48, 70] },
    { of: (n) => `어느 식당을 ${n}일 동안 찾은 하루 손님 수`, four: '네 식당을 찾은 하루 손님 수', unit: '명', lo: 25, hi: 45, ax: [20, 5, 8], far: 'low', farAt: [2, 6] },
    { of: (n) => `야구 선수 ${n}명이 한 시즌 동안 친 홈런의 수`, four: '네 팀 선수들이 한 시즌 동안 친 홈런의 수', unit: '개', lo: 12, hi: 32, ax: [0, 5, 8], far: 'low', farAt: [1, 4] },
    { of: (n) => `어느 반 학생 ${n}명이 한 달 동안 도서관에서 빌린 책의 수`, four: '네 반 학생들이 한 달 동안 도서관에서 빌린 책의 수', unit: '권', lo: 1, hi: 16, ax: [0, 2, 12], far: 'high', farAt: [28, 36] }
  ];
  const intro = (c, n) => `다음은 ${obj(c.of(n))} 조사하여 나타낸 것이다.`;
  // 같은 값이 세 번 넘게 나오지 않는 자료 n개
  function draw(d, lo, hi, n) { const out = []; while (out.length < n) { const v = d.int(lo, hi); if (out.filter((x) => x === v).length < 2) out.push(v); } return out; }
  // 두 집단. names: 그림의 이름, both: 「두 반」, mem(이름): 그 집단의 사람·물건, who·cnt: 「학생·명」, meas: 「점수가」, ax: 눈금
  const PAIRS = [
    { names: ['1반', '2반'], both: '두 반', intro: '1반과 2반 학생들의 수학 점수', mem: (nm) => nm + ' 학생', who: '학생', cnt: '명', meas: '점수가', unit: '점', ax: [40, 5, 12] },
    { names: ['A 공장', 'B 공장'], both: '두 공장', intro: '두 공장 A, B에서 만든 건전지의 수명', mem: (nm) => nm + '에서 만든 건전지', who: '건전지', cnt: '개', meas: '수명이', unit: '시간', ax: [20, 2, 12] },
    { names: ['남학생', '여학생'], both: '남학생과 여학생', intro: '어느 학교 남학생과 여학생의 키', mem: (nm) => nm, who: '학생', cnt: '명', meas: '키가', unit: 'cm', ax: [140, 5, 12] },
    { names: ['1학년', '3학년'], both: '두 학년', intro: '어느 학교 1학년과 3학년 학생들의 하루 수면 시간', mem: (nm) => nm + ' 학생', who: '학생', cnt: '명', meas: '수면 시간이', unit: '분', ax: [360, 20, 10] },
    { names: ['A 모둠', 'B 모둠'], both: '두 모둠', intro: '두 모둠 A, B 학생들의 1분 동안의 줄넘기 기록', mem: (nm) => nm + ' 학생', who: '학생', cnt: '명', meas: '기록이', unit: '회', ax: [60, 10, 12] }
  ];
  const pairIntro = (c) => `다음은 ${obj(c.intro)} 조사하여 상자그림으로 나타낸 것이다.`;
  // 눈금 0~nt 칸 가운데 서로 다른 다섯 자리(작은 것부터)
  // skip0: 눈금이 0에서 시작하는 자료(걸린 시간·건수 …)는 0인 자리를 쓰지 않는다.
  const pick5 = (d, nt, skip0) => srt(d.shuffle(range(skip0 ? 1 : 0, nt)).slice(0, 5));
  // 0~nt 칸 가운데 다섯 자리를 고르는 모든 경우(조건이 빡빡한 두 상자그림을 고를 때 쓴다)
  const ALL5 = {};
  function all5(nt) {
    if (ALL5[nt]) return ALL5[nt];
    const out = [];
    for (let a = 0; a <= nt; a += 1) for (let b = a + 1; b <= nt; b += 1) for (let c = b + 1; c <= nt; c += 1) for (let e = c + 1; e <= nt; e += 1) for (let f = e + 1; f <= nt; f += 1) out.push([a, b, c, e, f]);
    ALL5[nt] = out;
    return out;
  }
  const atOf = ([lo, step]) => (i) => lo + i * step;

  // ── 그림 ──
  const INK = '#1f2933', FILL = '#dbeafe', GRID = '#dde4ec', GRID2 = '#a9b8c8', MARK = '#c2410c';
  const tx = (x, y, anchor, t, size, more) => `<text class="mb-axis-label" style="font-size:${size}px${more || ''}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${t}</text>`;
  const ln = (x1, y1, x2, y2, style) => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" style="${style}"/>`;
  const textW = (t, fs) => [...String(t)].reduce((w, ch) => w + (/[가-힣]/.test(ch) ? fs * 1.02 : ch === ' ' ? fs * 0.3 : fs * 0.6), 0);
  // 상자그림. rows: [{ name, s: [최솟값, 제1사분위수, 중앙값, 제3사분위수, 최댓값] }](위에서부터), o: { lo, hi, step, unit, every(수를 적는 눈금의 칸 간격), small, w,
  //  mark: { row, part, name } — 그 줄의 다섯 수 가운데 part 번째 자리를 이름표와 화살표로 가리킨다 }.
  //  그림 설명(aria-label)에는 눈금과, 줄마다 수염·상자·상자 안의 선의 자리를 수로 적는다(다섯 수의 이름은 적지 않는다 — 이름을 묻는 문항이 있다).
  function boxFig(rows, o) {
    const small = Boolean(o.small), fs = 12, W = o.w || (small ? 240 : 288), nt = Math.round((o.hi - o.lo) / o.step);
    const named = rows.some((r) => r.name), L = named ? Math.ceil(Math.max(...rows.map((r) => textW(r.name || '', 12)))) + 16 : 13, R = 13;
    const cw = (W - L - R) / nt, lw = Math.max(...range(0, nt).map((i) => textW(o.lo + i * o.step, fs))) + 7;
    const every = o.every || [1, 2, 4, 5, 10, 20].find((k) => nt % k === 0 && k * cw >= lw) || nt;
    const markH = o.mark ? 24 : 0, top = 10 + markH, rowH = small ? 30 : 40, bh = small ? 14 : 18, yA = top + rows.length * rowH;
    const H = Math.ceil(yA + 21 + (o.unit ? 16 : 0)), gx = (v) => L + (v - o.lo) / o.step * cw;
    let out = '';
    for (let i = 0; i <= nt; i += 1) out += ln(gx(o.lo + i * o.step), top - 6, gx(o.lo + i * o.step), yA, `stroke:${i % every === 0 ? GRID2 : GRID};stroke-width:1`);
    out += `<line class="mb-axis" x1="${f1(L - 5)}" y1="${f1(yA)}" x2="${f1(W - R + 5)}" y2="${f1(yA)}"/>`;
    for (let i = 0; i <= nt; i += 1) {
      const x = gx(o.lo + i * o.step);
      out += ln(x, yA, x, yA + (i % every === 0 ? 5 : 3), `stroke:${INK};stroke-width:1`);
      if (i % every === 0) out += tx(x, yA + 16, 'middle', o.lo + i * o.step, fs);
    }
    if (o.unit) out += tx(W - 1, yA + 33, 'end', `(${o.unit})`, fs);
    const ink = `stroke:${INK};stroke-width:1.5`;
    rows.forEach((r, k) => {
      const cy = top + k * rowH + rowH / 2, [a, b, c, e, f] = r.s.map(gx), cap = bh * 0.34;
      out += ln(a, cy, b, cy, ink) + ln(e, cy, f, cy, ink) + ln(a, cy - cap, a, cy + cap, ink) + ln(f, cy - cap, f, cy + cap, ink)
        + `<rect x="${f1(b)}" y="${f1(cy - bh / 2)}" width="${f1(e - b)}" height="${bh}" style="fill:${FILL};stroke:${INK};stroke-width:1.5"/>`
        + ln(c, cy - bh / 2, c, cy + bh / 2, `stroke:${INK};stroke-width:2.8`);
      if (r.name) out += tx(L - 10, cy + 4.5, 'end', r.name, 12, ';font-weight:700');
    });
    let markSaid = '';
    if (o.mark) {
      const k = o.mark.row || 0, r = rows[k], cy = top + k * rowH + rowH / 2, x = gx(r.s[o.mark.part]);
      const yT = o.mark.part === 0 || o.mark.part === 4 ? cy - bh * 0.34 : cy - bh / 2;
      out += tx(x, 17, 'middle', o.mark.name, 13, `;font-weight:700;fill:${MARK}`) + ln(x, 21, x, yT - 7, `stroke:${MARK};stroke-width:1.5`)
        + `<path d="M${f1(x)} ${f1(yT - 1)}l-3.4 -7h6.8z" style="fill:${MARK}"/>`;
      markSaid = ` ${o.mark.name}은 가로 눈금 ${r.s[o.mark.part]}인 곳을 가리킨다.`;
    }
    const said = `상자그림. 가로 눈금: ${o.lo}부터 ${o.hi}까지 ${o.step}씩${o.unit ? `(단위: ${o.unit})` : ''}. `
      + rows.map((r) => `${r.name ? r.name + ' — ' : ''}왼쪽 수염 ${r.s[0]}부터 ${r.s[1]}까지, 상자 ${r.s[1]}부터 ${r.s[3]}까지(상자 안의 선 ${r.s[2]}), 오른쪽 수염 ${r.s[3]}부터 ${r.s[4]}까지`).join('. ') + '.' + markSaid;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 히스토그램. o: { lo(첫 계급의 처음 값), cw(계급의 크기), counts, unit(가로축 단위), cnt(세로축 단위) }. 계급은 「이상 ~ 미만」이다.
  function histFig(o) {
    const k = o.counts.length, maxC = Math.max(...o.counts), ystep = maxC > 12 ? 2 : 1, ytop = Math.ceil((maxC + 1) / ystep) * ystep, ny = ytop / ystep;
    const top = 26, L = 32, R = 50, W = 288, rh = Math.min(16, 150 / ny), bw = (W - L - R) / k, yB = top + ny * rh, H = Math.ceil(yB + 22);
    const gy = (v) => yB - v / ystep * rh, gx = (i) => L + i * bw, yEvery = rh < 12 ? 2 : 1;
    let out = '';
    for (let j = 0; j <= ny; j += 1) out += ln(L, gy(j * ystep), L + k * bw, gy(j * ystep), `stroke:${GRID};stroke-width:1`);
    for (let j = 0; j <= ny; j += yEvery) out += tx(L - 5, gy(j * ystep) + 4, 'end', j * ystep, 12);
    o.counts.forEach((c, i) => { if (c) out += `<rect x="${f1(gx(i))}" y="${f1(gy(c))}" width="${f1(bw)}" height="${f1(yB - gy(c))}" style="fill:#fde68a;stroke:${INK};stroke-width:1.2"/>`; });
    out += `<line class="mb-axis" x1="${L}" y1="${f1(yB)}" x2="${f1(L + k * bw + 6)}" y2="${f1(yB)}"/><line class="mb-axis" x1="${L}" y1="${f1(yB)}" x2="${L}" y2="${top - 8}"/>`;
    for (let i = 0; i <= k; i += 1) out += tx(gx(i), yB + 16, 'middle', o.lo + i * o.cw, 12);
    out += tx(L - 4, 14, 'end', `(${o.cnt})`, 12) + tx(W - 1, yB + 16, 'end', `(${o.unit})`, 12);
    const said = `히스토그램. 계급의 크기 ${o.cw}(단위: ${o.unit}), 세로축은 도수(${o.cnt}). ` + o.counts.map((c, i) => `${o.lo + i * o.cw} 이상 ${o.lo + (i + 1) * o.cw} 미만 ${c}${o.cnt}`).join(', ') + '.';
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 줄기와 잎 그림. rows: [[줄기, [잎(작은 것부터)…]], …]
  function stemFig(rows, unit) {
    const s0 = rows[0][0], l0 = rows[0][1][0], key = `${s0}|${l0}${tail(l0, '은/는')} ${amt(s0 * 10 + l0, unit)}`;
    const said = rows.map(([s, ls]) => `줄기 ${s}: ${ls.map((v) => s * 10 + v).join(', ')}`).join(' / ');
    return `<div style="display:grid;gap:3px;max-width:100%"><div style="text-align:right;font-size:0.88rem;color:#52606d">(${key})</div><div class="mb-table-wrap"><table class="mb-table" aria-label="줄기와 잎 그림(${key}). ${said}"><thead><tr><th>줄기</th><th>잎</th></tr></thead><tbody>`
      + rows.map(([s, ls]) => `<tr><td>${s}</td><td style="text-align:left;background:#fff;font-weight:400">${ls.map((v) => `<span style="display:inline-block;min-width:1.12em;text-align:center">${v}</span>`).join('')}</td></tr>`).join('')
      + '</tbody></table></div></div>';
  }
  // 문장 보기: 옳은 것 하나와 옳지 않은 것 넷을 섞는다. cands: [{ t, ok, why }]
  function pickClaims(d, text, cands, o) {
    const yes = d.shuffle(cands.filter((x) => x.ok)), no = d.shuffle(cands.filter((x) => !x.ok));
    const rows = d.shuffle([yes[0]].concat(no.slice(0, o.wrongs || 4))), at = rows.findIndex((r) => r.ok);
    return C(text, rows.map((r) => r.t), at, { figure: o.figure,
      explain: (o.lead ? o.lead + ' ' : '') + `옳은 것은 ${LAB[at]}이다. ` + rows.map((r, i) => (r.ok ? '' : `${LAB[i]}: ${r.why}`)).filter(Boolean).join(' '),
      facts: { truth: rows.map((r) => r.ok), want: true } });
  }
  const enough = (cands, wrongs) => cands.some((x) => x.ok) && cands.filter((x) => !x.ok).length >= (wrongs || 4) && new Set(cands.map((x) => x.t)).size === cands.length;

  // ═══ 사분위수와 상자그림 ═══
  const QUART = [
    T('box-quart', '수를 늘어놓은 자료에서 제1사분위수와 제3사분위수 구하기', '상자 ①1', (d, k) => {
      // 차례 0: 절반의 자료 수가 홀수(절반의 가운데 값). 차례 1: 절반의 자료 수가 짝수(절반의 가운데 두 값의 평균 — 두 값은 서로 다르다).
      const c = d.pick(ONE), n = d.pick(k === 0 ? [10, 14, 18] : [12, 16, 20]);
      const list = d.until(() => draw(d, c.lo, c.hi, n), (a) => { const f = five(a); return midOk(f.lo) && midOk(f.hi) && f.q1 < f.q3; }), f = five(list);
      return M(`${intro(c, n)} 이 자료의 제1사분위수와 제3사분위수를 차례로 구하시오. ${HOW}`,
        [{ label: '제1사분위수', answer: f.q1, unit: c.unit }, { label: '제3사분위수', answer: f.q3, unit: c.unit }], {
          figure: dataFig(list, c.unit),
          shown: `제1사분위수 ${amt(f.q1, c.unit)}, 제3사분위수 ${amt(f.q3, c.unit)}`,
          explain: `작은 값부터 늘어놓으면 ${f.s.join(', ')}이다. 자료가 ${n}개이므로 앞의 ${n / 2}개가 아래쪽 절반, 뒤의 ${n / 2}개가 위쪽 절반이다. `
            + `아래쪽 절반의 ${midSay(f.lo, '이/가')} 제1사분위수, 위쪽 절반의 ${midSay(f.hi, '이/가')} 제3사분위수이다.`,
          facts: { calc: [[midExpr(f.lo), 0], [midExpr(f.hi), 1]], unseen: [2], rule: k === 0 ? 'half-odd' : 'half-even' }
        });
    }, { count: 2 }),
    T('box-gap', '멀리 떨어진 값이 있는 자료의 (제3사분위수) − (제1사분위수)', '상자 ①1', (d) => {
      // 멀리 떨어진 값이 한두 개 끼어 있다. 그 값은 자료의 끝에 놓일 뿐 사분위수는 가운데 쪽 값으로 정해진다(가장 큰 값 − 가장 작은 값과 헷갈리지 않게).
      const c = d.pick(ONE.filter((q) => q.far)), n = d.pick([12, 14, 16, 18, 20]), m = d.int(1, 2);
      let far = [];
      const list = d.until(() => { far = range(1, m).map(() => d.int(c.farAt[0], c.farAt[1])); return d.shuffle(draw(d, c.lo, c.hi, n - m).concat(far)); },
        (a) => { const f = five(a); return midOk(f.lo) && midOk(f.hi) && f.q3 - f.q1 >= 3 && new Set(far).size === far.length; });
      const f = five(list), gap = f.q3 - f.q1, farSay = srt(far).join(', ');
      return N(`${intro(c, n)} 이 자료를 상자그림으로 나타낼 때, 상자의 길이에 해당하는 (제3사분위수) − (제1사분위수)의 값은? ${HOW}`, gap, { unit: c.unit, figure: dataFig(list, c.unit),
        explain: `작은 값부터 늘어놓으면 ${f.s.join(', ')}이다. 제1사분위수는 아래쪽 절반의 ${midSayIs(f.lo)}이고, 제3사분위수는 위쪽 절반의 ${midSayIs(f.hi)}이다. `
          + `따라서 ${f.q3} − ${f.q1} = ${gap}이다. 멀리 떨어진 값 ${farSay}${tail(srt(far)[far.length - 1], '은/는')} 자료의 ${c.far === 'high' ? '맨 끝' : '맨 앞'}에 놓일 뿐 사분위수를 크게 바꾸지 않는다.`,
        facts: { calc: [[`${midExpr(f.hi)}-${midExpr(f.lo)}`, 0]], unseen: [2] } });
    }),
    T('box-stem', '줄기와 잎 그림에서 제1사분위수, 중앙값, 제3사분위수 구하기', '상자 ①2', (d) => {
      const STEMS = [
        { of: (n) => `어느 반 학생 ${n}명의 영어 듣기 평가 점수`, unit: '점', stems: [5, 6, 7, 8, 9] },
        { of: (n) => `어느 반 학생 ${n}명의 1분 동안의 윗몸 일으키기 기록`, unit: '회', stems: [2, 3, 4, 5] },
        { of: (n) => `어느 반 학생 ${n}명의 몸무게`, unit: 'kg', stems: [4, 5, 6, 7] }
      ];
      const c = d.pick(STEMS), n = d.pick([16, 18, 20, 22, 24]);
      const made = d.until(() => {
        const k = Math.min(c.stems.length, d.int(3, 4)), s0 = d.int(0, c.stems.length - k), cuts = srt(d.shuffle(range(1, n - 1)).slice(0, k - 1)), counts = [];
        [0].concat(cuts).forEach((v, i, all) => counts.push((i + 1 < all.length ? all[i + 1] : n) - v));
        const rows = counts.map((m, i) => [c.stems[s0 + i], srt(range(1, m).map(() => d.int(0, 9)))]);
        return { rows, values: rows.flatMap(([s, ls]) => ls.map((l) => s * 10 + l)) };
      }, (r) => { const f = five(r.values); return r.rows.every((x) => x[1].length >= 2 && x[1].length <= 10) && Number.isInteger(f.med) && midOk(f.lo) && midOk(f.hi) && f.q1 < f.med && f.med < f.q3; });
      const f = five(made.values), h = n / 2;
      return M(`다음은 ${obj(c.of(n))} 조사하여 줄기와 잎 그림으로 나타낸 것이다. 이 자료의 제1사분위수, 중앙값, 제3사분위수를 차례로 구하시오. ${HOW}`,
        [{ label: '제1사분위수', answer: f.q1, unit: c.unit }, { label: '중앙값', answer: f.med, unit: c.unit }, { label: '제3사분위수', answer: f.q3, unit: c.unit }], {
          figure: stemFig(made.rows, c.unit),
          shown: `제1사분위수 ${amt(f.q1, c.unit)}, 중앙값 ${amt(f.med, c.unit)}, 제3사분위수 ${amt(f.q3, c.unit)}`,
          explain: `줄기와 잎 그림의 값은 이미 작은 것부터 놓여 있다. 자료가 ${n}개이므로 중앙값은 ${h}번째와 ${h + 1}번째 값 ${f.s[h - 1]}, ${f.s[h]}의 평균 ${f.med}이다. `
            + `아래쪽 절반(1번째~${h}번째)의 ${midSay(f.lo, '이/가')} 제1사분위수, 위쪽 절반(${h + 1}번째~${n}번째)의 ${midSay(f.hi, '이/가')} 제3사분위수이다.`,
          facts: { calc: [[midExpr(f.lo), 0], [midExpr(f.s), 1], [midExpr(f.hi), 2]], unseen: [2] }
        });
    }),
    T('box-term', '상자그림의 이름과 각 부분이 나타내는 값', '상자 ①4 ①3', (d, k) => {
      // 차례 0: 다섯 수로 나타낸 그래프의 이름. 차례 1: 상자그림의 한 곳(㉠)이 나타내는 값 — 상자 안의 선을 평균으로 아는 아이가 걸리게 「평균」을 늘 보기에 넣는다.
      if (k === 0) {
        const opts = d.shuffle(['상자그림', '히스토그램', '도수분포다각형', '줄기와 잎 그림', '산점도']), at = opts.indexOf('상자그림');
        return C('자료의 최솟값, 제1사분위수, 중앙값, 제3사분위수, 최댓값을 이용하여 자료의 분포를 나타낸 그래프는?', opts, at, {
          explain: '다섯 수로 상자와 수염을 그려 분포를 나타낸 그래프는 상자그림이다. 히스토그램과 도수분포다각형은 계급의 도수를, 줄기와 잎 그림은 낱낱의 값을, 산점도는 두 변량의 순서쌍을 나타낸다.',
          facts: { truth: opts.map((s) => s === '상자그림'), want: true } });
      }
      const c = d.pick(ONE), [lo, step, nt] = c.ax, at0 = atOf(c.ax), part = d.int(0, 4), s = d.until(() => pick5(d, nt, lo === 0), (p) => p[3] - p[1] >= 2).map(at0);
      const opts = d.shuffle([PART[part], '평균'].concat(d.shuffle(PART.filter((_, i) => i !== part)).slice(0, 3))), at = opts.indexOf(PART[part]);
      const WHERE = ['왼쪽 수염의 끝', '상자의 왼쪽 끝', '상자 안의 선', '상자의 오른쪽 끝', '오른쪽 수염의 끝'];
      return C('다음 상자그림에서 ㉠이 가리키는 곳이 나타내는 값은?', opts, at, {
        figure: boxFig([{ s }], { lo, hi: lo + nt * step, step, unit: c.unit, mark: { row: 0, part, name: '㉠' } }),
        explain: `㉠은 ${WHERE[part]}이므로 ${PART[part]}이다. 상자그림에서 수염의 두 끝은 최솟값과 최댓값, 상자의 두 끝은 제1사분위수와 제3사분위수, 상자 안의 선은 중앙값이다(평균은 상자그림에 나타나지 않는다).`,
        facts: { truth: opts.map((p) => p === PART[part]), want: true } });
    }, { count: 2 }),
    T('box-draw', '다섯 수와 평균을 정리한 표에 알맞은 상자그림 고르기', '상자 ①3', (d) => {
      // 틀린 그림: 상자 안의 선을 평균에 그은 것, 상자 안의 선을 상자의 한가운데에 그은 것, 상자의 두 끝을 최솟값~최댓값을 네 칸으로 똑같이 나눈 곳에 그은 것.
      const c = d.pick(ONE.filter((q) => q.ax[2] >= 10)), [lo, step, nt] = c.ax, at0 = atOf(c.ax), n = d.pick([20, 24, 28, 30]);
      let p, im, mid, r1, r3;
      d.until(() => { p = pick5(d, nt, lo === 0); im = d.int(p[1] + 1, Math.max(p[1] + 1, p[3] - 1)); mid = (p[1] + p[3]) / 2; r1 = p[0] + (p[4] - p[0]) / 4; r3 = p[0] + 3 * (p[4] - p[0]) / 4; return true; },
        () => Number.isInteger(mid) && Number.isInteger(r1) && Number.isInteger(r3) && mid !== p[2] && im > p[1] && im < p[3] && im !== p[2] && im !== mid
          && r1 > p[0] && r3 < p[4] && r1 < p[2] && p[2] < r3 && (r1 !== p[1] || r3 !== p[3]));
      const sets = d.shuffle([
        { s: p, ok: true },
        { s: [p[0], p[1], im, p[3], p[4]], why: '상자 안의 선을 평균에 그었다' },
        { s: [p[0], p[1], mid, p[3], p[4]], why: '상자 안의 선을 상자의 한가운데에 그었다' },
        { s: [p[0], r1, p[2], r3, p[4]], why: '상자의 두 끝을 제1사분위수와 제3사분위수가 아닌 곳(최솟값과 최댓값 사이를 네 칸으로 똑같이 나눈 곳)에 그었다' }
      ]);
      const at = sets.findIndex((x) => x.ok), v = p.map(at0);
      const tbl = table(['나타내는 값', `${c.unit === 'cm' ? '기록' : '값'}(${c.unit})`], PART.map((nm, i) => [nm, String(v[i])]).concat([['평균', String(at0(im))]]));
      return C(`다음 표는 ${obj(c.of(n))} 정리한 것이다. 이 자료를 나타낸 상자그림으로 알맞은 것은?`,
        sets.map((x, i) => figOpt(LAB[i], boxFig([{ s: x.s.map(at0) }], { lo, hi: lo + nt * step, step, small: true }))), at, {
          figure: tbl,
          explain: `상자그림은 수염의 두 끝이 최솟값 ${josa(v[0], '과/와')} 최댓값 ${v[4]}, 상자의 두 끝이 제1사분위수 ${josa(v[1], '과/와')} 제3사분위수 ${v[3]}, 상자 안의 선이 중앙값 ${v[2]}인 ${LAB[at]}이다. `
            + sets.map((x, i) => (x.ok ? '' : `${LAB[i]}은 ${x.why}.`)).filter(Boolean).join(' '),
          facts: { truth: sets.map((x) => x.ok), want: true } });
    }),
    T('box-read', '상자그림에서 제1사분위수, 중앙값, 제3사분위수 읽기', '상자 ①5', (d) => {
      // 수는 두 칸마다 적는다. 셋 가운데 둘 이상은 수가 적히지 않은 눈금 위에 놓는다.
      const c = d.pick(ONE.filter((q) => q.ax[2] % 2 === 0)), [lo, step, nt] = c.ax, at0 = atOf(c.ax), n = d.pick([20, 24, 28, 30, 32]);
      const s = d.until(() => pick5(d, nt, lo === 0), (p) => [p[1], p[2], p[3]].filter((i) => i % 2 === 1).length >= 2).map(at0);
      return M(`다음은 ${obj(c.of(n))} 조사하여 상자그림으로 나타낸 것이다. 제1사분위수, 중앙값, 제3사분위수를 차례로 구하시오.`,
        [{ label: '제1사분위수', answer: s[1], unit: c.unit }, { label: '중앙값', answer: s[2], unit: c.unit }, { label: '제3사분위수', answer: s[3], unit: c.unit }], {
          figure: boxFig([{ s }], { lo, hi: lo + nt * step, step, unit: c.unit, every: 2 }),
          shown: `제1사분위수 ${amt(s[1], c.unit)}, 중앙값 ${amt(s[2], c.unit)}, 제3사분위수 ${amt(s[3], c.unit)}`,
          explain: `눈금 한 칸은 ${amt(step, c.unit)}이다. 상자의 왼쪽 끝이 제1사분위수 ${amt(s[1], c.unit)}, 상자 안의 선이 중앙값 ${amt(s[2], c.unit)}, 상자의 오른쪽 끝이 제3사분위수 ${amt(s[3], c.unit)}이다.`,
          facts: { calc: [[String(s[1]), 0], [String(s[2]), 1], [String(s[3]), 2]] }
        });
    })
  ];

  // ═══ 상자그림의 해석과 분포 비교 ═══
  const SITU = [
    '세 반 학생들의 50 m 달리기 기록의 분포', '두 공장에서 만든 건전지의 수명의 분포', '1학년과 3학년 학생들의 하루 수면 시간의 분포',
    '네 모둠 학생들의 1분 동안의 줄넘기 기록의 분포', '남학생과 여학생의 키의 분포'
  ];
  const READ = [
    T('box-sym', '중앙값을 중심으로 대칭에 가장 가까운 분포의 상자그림 고르기', '상자 ①7', (d) => {
      // 정답: 상자 안의 선이 상자의 한가운데, 두 수염의 길이가 같다. 틀린 그림은 둘 가운데 하나만 맞거나 둘 다 어긋난다.
      const c = d.pick(ONE.filter((q) => q.ax[2] >= 10)), [lo, step, nt] = c.ax, at0 = atOf(c.ax);
      // 눈금이 0에서 시작하면 양 끝 눈금은 쓰지 않는다(좌우를 뒤집어도 0에 닿지 않게).
      const z = lo === 0 ? 1 : 0;
      const make = (w1, h1, h2, w2) => { const s0 = d.int(z, nt - z - (w1 + h1 + h2 + w2)); return [s0, s0 + w1, s0 + w1 + h1, s0 + w1 + h1 + h2, s0 + w1 + h1 + h2 + w2]; };
      const fit = (...g) => g.reduce((a, b) => a + b, 0) <= nt - 2 * z;
      const sets = d.until(() => {
        const w = d.int(1, 3), h = d.int(1, 3), a = d.int(1, 2), b = a + d.int(2, 3), e = d.int(1, 2), f = e + d.int(2, 3), g = d.int(1, 3), u = d.int(1, 2), t = u + d.int(2, 3);
        if (!fit(w, h, h, w) || !fit(a, g, g, b) || !fit(w, e, f, w) || !fit(u, e, f, t)) return null;
        const flip = (x) => (d.bool() ? x : x.map((i) => nt - i).reverse());
        return [
          { s: make(w, h, h, w), ok: true },
          { s: flip(make(a, g, g, b)), why: '상자 안의 선은 상자의 한가운데에 있지만 두 수염의 길이가 다르다' },
          { s: flip(make(w, e, f, w)), why: '두 수염의 길이는 같지만 상자 안의 선이 상자의 한가운데에 있지 않다' },
          { s: flip(make(u, e, f, t)), why: '상자 안의 선이 한쪽으로 치우쳐 있고 두 수염의 길이도 다르다' }
        ];
      }, (x) => Boolean(x));
      const opts = d.shuffle(sets), at = opts.findIndex((x) => x.ok);
      return C(`다음은 ${obj(c.four)} 조사하여 상자그림으로 나타낸 것이다. 자료가 중앙값을 중심으로 대칭에 가장 가깝게 분포되어 있는 것은?`,
        opts.map((x, i) => figOpt(LAB[i], boxFig([{ s: x.s.map(at0) }], { lo, hi: lo + nt * step, step, small: true }))), at, {
          explain: `중앙값을 중심으로 대칭에 가까우면 상자 안의 선(중앙값)이 상자의 한가운데에 있고, 두 수염의 길이가 같다. 그런 것은 ${LAB[at]}이다. `
            + opts.map((x, i) => (x.ok ? '' : `${LAB[i]}은 ${x.why}.`)).filter(Boolean).join(' '),
          facts: { truth: opts.map((x) => x.ok), want: true } });
    }),
    T('box-graph', '여러 집단의 분포를 비교하기에 알맞은 그래프 고르기', '상자 ①9 ①8', (d) => {
      const s = d.pick(SITU), pool = d.shuffle(['띠그래프', '원그래프', '막대그래프', '꺾은선그래프', '히스토그램']).slice(0, 4);
      const opts = d.shuffle(['상자그림'].concat(pool)), at = opts.indexOf('상자그림');
      return C(`${obj(s)} 한눈에 비교하려고 한다. 이때 쓰기에 가장 알맞은 그래프는?`, opts, at, {
        explain: '수치로 된 자료의 분포를 여러 집단끼리 비교할 때는 집단마다 상자그림을 그려 나란히 놓으면 중앙값·사분위수·최솟값·최댓값을 한눈에 비교할 수 있다. 띠그래프·원그래프는 비율을, 막대그래프는 항목별 수량을, 꺾은선그래프는 시간에 따른 변화를, 히스토그램은 한 집단의 계급별 도수를 나타낸다.',
        facts: { truth: opts.map((x) => x === '상자그림'), want: true } });
    }),
    T('box-talk', '그래프의 쓰임에 대한 설명 가리기(상자그림과 줄기와 잎 그림)', '상자 ①9', (d) => {
      const Y1 = '여러 집단의 분포를 한눈에 비교할 때는 상자그림이 알맞다.';
      const Y2 = '자료의 값을 하나하나 그대로 보려면 줄기와 잎 그림이 알맞다.';
      const Y3 = '시간에 따라 변하는 모습을 나타낼 때는 꺾은선그래프가 알맞다.';
      const Y4 = '계급마다 자료가 몇 개인지 한눈에 보려면 히스토그램이 알맞다.';
      const Y5 = '상자그림을 보면 자료의 최솟값, 제1사분위수, 중앙값, 제3사분위수, 최댓값을 알 수 있다.';
      const no = [
        ['자료의 값을 하나하나 그대로 보려면 상자그림이 알맞다.', '상자그림에는 다섯 수만 나타난다. 낱낱의 값은 줄기와 잎 그림에서 그대로 보인다.', Y2],
        ['상자그림을 보면 자료의 개수를 알 수 있다.', '상자그림에는 자료의 개수가 나타나지 않는다.', ''],
        ['계급마다 자료가 몇 개인지 한눈에 보려면 상자그림이 알맞다.', '상자그림에는 계급과 도수가 없다. 계급마다의 도수는 히스토그램에 나타난다.', Y4]
      ];
      return claimQ(d, '다음 중 그래프에 대한 설명으로 옳지 않은 것은?', [Y1, Y2, Y3, Y4, Y5], no, false);
    }),
    T('box-cmp', '두 집단의 상자그림에서 중앙값의 차와 상자의 길이 읽기', '상자 ①8', (d, k) => {
      // 차례 0: 중앙값의 차. 차례 1: 상자의 길이(제3사분위수와 제1사분위수의 차)가 더 긴 쪽의 상자의 길이.
      const c = d.pick(PAIRS), [lo, step, nt] = c.ax, at0 = atOf(c.ax), [na, nb] = c.names;
      const [pa, pb] = d.until(() => [pick5(d, nt), pick5(d, nt)], ([a, b]) => (k === 0 ? Math.abs(a[2] - b[2]) >= 2 : Math.abs((a[3] - a[1]) - (b[3] - b[1])) >= 2 && a[2] !== b[2]));
      const A = pa.map(at0), Bv = pb.map(at0), figure = boxFig([{ name: na, s: A }, { name: nb, s: Bv }], { lo, hi: lo + nt * step, step, unit: c.unit });
      if (k === 0) {
        const [big, small] = A[2] > Bv[2] ? [A[2], Bv[2]] : [Bv[2], A[2]];
        return N(`${pairIntro(c)} ${c.both}의 중앙값의 차는?`, big - small, { unit: c.unit, figure,
          explain: `상자 안의 선이 중앙값이다. ${na}의 중앙값은 ${amt(A[2], c.unit)}, ${nb}의 중앙값은 ${amt(Bv[2], c.unit)}이므로 차는 ${big} − ${small} = ${big - small}이다.`,
          facts: { calc: [[`${big}-${small}`, 0]] } });
      }
      const la = A[3] - A[1], lb = Bv[3] - Bv[1], W = la > lb ? [na, A] : [nb, Bv];
      return N(`${pairIntro(c)} ${c.both} 가운데 상자의 길이(제3사분위수와 제1사분위수의 차)가 더 긴 쪽의 상자의 길이는?`, Math.max(la, lb), { unit: c.unit, figure,
        explain: `상자의 두 끝이 제1사분위수와 제3사분위수이다. ${topic(na)} ${A[3]} − ${A[1]} = ${la}, ${topic(nb)} ${Bv[3]} − ${Bv[1]} = ${lb}이므로 더 긴 쪽은 ${W[0]}이고 그 길이는 ${amt(Math.max(la, lb), c.unit)}이다.`,
        facts: { calc: [[`${W[1][3]}-${W[1][1]}`, 0]] } });
    }, { count: 2 }),
    T('box-cmp-claims', '두 집단의 상자그림을 비교한 설명 가리기', '상자 ①8', (d) => {
      const c = d.pick(PAIRS), [lo, step, nt] = c.ax, at0 = atOf(c.ax), [na, nb] = c.names, u = c.unit;
      // 옳은 문장: 다섯 수의 크기 견주기, 「절반 이상은 중앙값 이상」, 「제1사분위수 이하는 25 % 이상」, 한 집단의 중앙값이 다른 집단의 제3사분위수보다 클 때의 엇갈린 견주기.
      // 옳지 않은 문장: 거꾸로 된 견주기, 「모두 제1사분위수 이상」(수염이 있다), 잘못 읽은 최댓값, 제3사분위수가 더 작은 집단의 엇갈린 견주기(그보다 큰 것은 25 %를 넘지 않는다).
      let cands = [], A, Bv;
      d.until(() => {
        A = pick5(d, nt).map(at0); Bv = pick5(d, nt).map(at0); cands = [];
        const G = d.shuffle([{ nm: na, s: A }, { nm: nb, s: Bv }]), [X, Y] = G, P = d.pick(G), Q = G.find((g) => g !== P);
        for (const i of [0, 2, 4]) if (A[i] !== Bv[i]) {
          const [R, S] = d.shuffle([X, Y]);
          cands.push({ t: `${R.nm}의 ${topic(PART[i])} ${S.nm}의 ${PART[i]}보다 크다.`, ok: R.s[i] > S.s[i], why: `${R.nm}의 ${topic(PART[i])} ${amt(R.s[i], u)}, ${S.nm}의 ${topic(PART[i])} ${amt(S.s[i], u)}이다.` });
        }
        const lx = X.s[3] - X.s[1], ly = Y.s[3] - Y.s[1];
        if (lx !== ly) cands.push({ t: `가운데 절반의 자료는 ${subj(X.nm)} ${Y.nm}보다 더 넓게 퍼져 있다.`, ok: lx > ly, why: `상자의 길이는 ${X.nm} ${X.s[3]} − ${X.s[1]} = ${lx}, ${Y.nm} ${Y.s[3]} − ${Y.s[1]} = ${ly}이다.` });
        cands.push({ t: `${c.mem(P.nm)}의 절반 이상은 ${c.meas} ${amt(P.s[2], u)} 이상이다.`, ok: true });
        cands.push({ t: `${c.mem(Q.nm)} 가운데 ${c.meas} ${amt(Q.s[1], u)} 이하인 ${topic(c.who)} ${c.mem(Q.nm)} 전체의 25 % 이상이다.`, ok: true });
        cands.push({ t: `${topic(c.mem(P.nm))} 모두 ${c.meas} ${amt(P.s[1], u)} 이상이다.`, ok: false, why: `${P.nm}의 최솟값이 ${amt(P.s[0], u)}이므로 ${amt(P.s[1], u)}보다 작은 것도 있다.` });
        cands.push({ t: `${P.nm}의 최댓값은 ${amt(P.s[4] + step, u)}이다.`, ok: false, why: `${P.nm}의 최댓값은 ${amt(P.s[4], u)}이다.` });
        if (Y.s[3] <= X.s[3]) cands.push({ t: `${c.mem(Y.nm)}의 절반 이상은 ${c.meas} ${X.nm}의 제3사분위수보다 크다.`, ok: false, why: `${Y.nm}의 제3사분위수 ${ua(Y.s[3], u, '이/가')} ${X.nm}의 제3사분위수 ${amt(X.s[3], u)} 이하이므로, 그보다 큰 것은 ${Y.nm}의 25 %를 넘지 않는다.` });
        if (Y.s[2] > X.s[3]) cands.push({ t: `${c.mem(Y.nm)}의 절반 이상은 ${c.meas} ${X.nm}의 제3사분위수보다 크다.`, ok: true });
        // 옳은 것은 하나만 남긴다.
        const yes = d.pick(cands.filter((x) => x.ok)); cands = cands.filter((x) => !x.ok || x === yes);
        return enough(cands);
      }, (x) => x);
      return pickClaims(d, `${pairIntro(c)} 이에 대한 설명으로 옳은 것은?`, cands, {
        figure: boxFig([{ name: na, s: A }, { name: nb, s: Bv }], { lo, hi: lo + nt * step, step, unit: c.unit }),
        lead: `${na}: 최솟값 ${A[0]}, 제1사분위수 ${A[1]}, 중앙값 ${A[2]}, 제3사분위수 ${A[3]}, 최댓값 ${A[4]}. ${nb}: 최솟값 ${Bv[0]}, 제1사분위수 ${Bv[1]}, 중앙값 ${Bv[2]}, 제3사분위수 ${Bv[3]}, 최댓값 ${Bv[4]}. 중앙값 이상인 것은 절반 이상이고, 제1사분위수 이하인 것은 25 % 이상이다.`
      });
    })
  ];

  B.addTypes('9-2-6', 'box', QUART);
  B.addTypes('9-2-6', 'boxcmp', READ);

  // ═══ 실력(hard 묶음 끝에 덧붙인다) ═══
  const HARD = [
    // ── ② 세 단계 넘게 잇는 문제 ──
    H('hard-box-hist', '히스토그램과 같은 자료를 나타낸 상자그림 고르기', '상자 ①6', (d) => {
      // 도수의 합 → 몇 번째 값인가 → 그 값이 든 계급 → 상자그림 넷과 대조. 틀린 그림은 제1사분위수·중앙값·제3사분위수 가운데 하나만 이웃 계급으로 옮긴 것이다.
      const HC = [
        { of: (n) => `어느 반 학생 ${n}명의 국어 점수`, unit: '점', cnt: '명', lo: 40 },
        { of: (n) => `어느 학교 학생 ${n}명이 등교하는 데 걸리는 시간`, unit: '분', cnt: '명', lo: 0 },
        { of: (n) => `어느 반 학생 ${n}명의 1분 동안의 윗몸 일으키기 기록`, unit: '회', cnt: '명', lo: 10 }
      ];
      const c = d.pick(HC), n = d.pick([20, 40]), k = 6, cw = 10, lo = c.lo, hi = lo + k * cw;
      const classOf = (v) => Math.floor((v - lo) / cw);
      // 몇 번째 값(1부터)이 든 계급
      const nth = (counts, m) => { let s = 0; for (let i = 0; i < counts.length; i += 1) { s += counts[i]; if (m <= s) return i; } return -1; };
      const increasing = (s) => s.every((v, i) => i === 0 || v > s[i - 1]);
      // 도수(모두 1 이상) → 사분위수·중앙값이 든 계급(평균을 내는 두 값이 같은 계급에 들어 계급이 하나로 정해질 때만) → 맞는 상자그림 → 틀린 그림 셋
      const { counts, qc, correct, picked } = d.until(() => {
        const cuts = srt(d.shuffle(range(1, n - 1)).slice(0, k - 1)), counts = [];
        [0].concat(cuts).forEach((v, i, all) => counts.push((i + 1 < all.length ? all[i + 1] : n) - v));
        const q = n / 4, cls = [[q, q + 1], [2 * q, 2 * q + 1], [3 * q, 3 * q + 1]].map(([x, y]) => [nth(counts, x), nth(counts, y)]);
        if (!cls.every(([x, y]) => x === y) || new Set(cls.map((p) => p[0])).size < 2) return null;
        const qc = cls.map((p) => p[0]), inner = () => d.pick([2, 4, 6, 8]);
        // 값은 계급 안의 짝수 눈금(계급의 끝 값은 피한다). 같은 계급에 둘이 들면 작은 것부터.
        const correct = [lo + d.pick([2, 4]), lo + qc[0] * cw + inner(), lo + qc[1] * cw + inner(), lo + qc[2] * cw + inner(), lo + (k - 1) * cw + d.pick([6, 8])];
        if (!increasing(correct)) return null;
        const moves = [];
        for (const part of [1, 2, 3]) for (const dir of [-1, 1]) {
          const s = correct.slice(); s[part] += dir * cw;
          if (s[part] > lo && s[part] < hi && increasing(s)) moves.push({ s, part, dir });
        }
        const picked = d.shuffle(moves).slice(0, 3);
        return picked.length === 3 && new Set(picked.map((m) => m.part)).size >= 2 ? { counts, qc, correct, picked } : null;
      }, (x) => Boolean(x));
      // 맞는지는 계급으로 다시 따진다: 제1사분위수·중앙값·제3사분위수가 모두 제 계급에 있어야 한다.
      const fitsHist = (s) => [1, 2, 3].every((p) => classOf(s[p]) === qc[p - 1]) && classOf(s[0]) === 0 && classOf(s[4]) === k - 1;
      const opts = d.shuffle([{ s: correct }].concat(picked.map((m) => ({ s: m.s, m })))).map((x) => Object.assign(x, { ok: fitsHist(x.s) }));
      const at = opts.findIndex((x) => x.ok), q = n / 4, NAME = ['', '제1사분위수', '중앙값', '제3사분위수'];
      const rangeOf = (i) => `${lo + i * cw} 이상 ${lo + (i + 1) * cw} 미만`;
      return C(`다음은 ${obj(c.of(n))} 조사하여 히스토그램으로 나타낸 것이다. 이 자료를 나타낸 상자그림이 될 수 있는 것은?`,
        opts.map((x, i) => figOpt(LAB[i], boxFig([{ s: x.s }], { lo, hi, step: 2, every: 5, small: true }))), at, {
          figure: histFig({ lo, cw, counts, unit: c.unit, cnt: c.cnt }),
          explain: `자료가 ${n}개이므로 아래쪽 절반과 위쪽 절반은 ${n / 2}개씩이다. 제1사분위수는 ${q}번째와 ${q + 1}번째 값의 평균이라 ${rangeOf(qc[0])}인 계급에, `
            + `중앙값은 ${2 * q}번째와 ${2 * q + 1}번째 값의 평균이라 ${rangeOf(qc[1])}인 계급에, 제3사분위수는 ${3 * q}번째와 ${3 * q + 1}번째 값의 평균이라 ${rangeOf(qc[2])}인 계급에 있다. `
            + `이에 맞는 것은 ${LAB[at]}이다. ` + opts.map((x, i) => (x.ok ? '' : `${LAB[i]}은 ${subj(NAME[x.m.part])} ${rangeOf(classOf(x.s[x.m.part]))}인 계급에 있다.`)).filter(Boolean).join(' '),
          facts: { truth: opts.map((x) => x.ok), want: true } });
    }),
    H('hard-box-two-data', '두 자료의 사분위수를 구해 상자그림으로 비교하기', '상자 ①8 ①1', (d) => {
      // 두 자료를 각각 늘어놓아 다섯 수를 구한 다음(두 번), 서로 엇갈려 견준다. 견주는 두 값은 늘 서로 다르다.
      const TC = [
        { names: ['A 회사', 'B 회사'], say: (n) => `두 회사 A, B에서 만든 건전지를 ${n}개씩 골라 수명을 재어 나타낸 것이다`, unit: '시간', lo: 20, hi: 60 },
        { names: ['A 가게', 'B 가게'], say: (n) => `두 가게 A, B를 ${n}일 동안 찾은 하루 손님 수를 나타낸 것이다`, unit: '명', lo: 18, hi: 60 },
        { names: ['1반', '2반'], say: (n) => `1반과 2반에서 ${n}명씩 뽑은 학생들의 1분 동안의 윗몸 일으키기 기록을 나타낸 것이다`, unit: '회', lo: 15, hi: 55 }
      ];
      const c = d.pick(TC), n = d.pick([10, 12]), [na, nb] = c.names;
      let la, lb, fa, fb, cands;
      d.until(() => {
        la = draw(d, c.lo, c.hi, n); lb = draw(d, c.lo, c.hi, n); fa = five(la); fb = five(lb); cands = [];
        const G = [{ nm: na, f: fa.all }, { nm: nb, f: fb.all }];
        const pairs = [];
        for (let i = 0; i < 5; i += 1) for (let j = 0; j < 5; j += 1) if (Math.abs(i - j) <= 2) pairs.push([i, j]);
        for (const [i, j] of d.shuffle(pairs).slice(0, 9)) {
          const [P, Q] = d.shuffle(G);
          if (P.f[i] === Q.f[j]) continue;
          cands.push({ t: `${P.nm}의 ${topic(PART[i])} ${Q.nm}의 ${PART[j]}보다 크다.`, ok: P.f[i] > Q.f[j], cross: i !== j, why: `${P.nm}의 ${topic(PART[i])} ${amt(P.f[i], c.unit)}, ${Q.nm}의 ${topic(PART[j])} ${amt(Q.f[j], c.unit)}이다.` });
        }
        const ga = fa.q3 - fa.q1, gb = fb.q3 - fb.q1;
        if (ga !== gb) { const [P, Q] = d.shuffle([[na, ga], [nb, gb]]); cands.push({ t: `상자의 길이는 ${subj(P[0])} ${Q[0]}보다 길다.`, ok: P[1] > Q[1], cross: true, why: `상자의 길이는 ${na} ${ga}, ${nb} ${gb}이다.` }); }
        // 옳은 것은 하나만 남긴다. 같은 값끼리의 견주기보다 엇갈린 견주기(상자의 길이 포함)를 먼저 고른다.
        const yes = cands.filter((x) => x.ok), cross = yes.filter((x) => x.cross);
        if (!yes.length) return false;
        const keep = d.pick(cross.length ? cross : yes);
        cands = cands.filter((x) => !x.ok || x === keep);
        return [fa, fb].every((f) => midOk(f.lo) && midOk(f.hi) && Number.isInteger(f.med)) && enough(cands);
      }, (x) => x);
      const say = (nm, f) => `${nm}: ${f.s.join(', ')} → 최솟값 ${f.min}, 제1사분위수 ${f.q1}, 중앙값 ${f.med}, 제3사분위수 ${f.q3}, 최댓값 ${f.max}.`;
      return pickClaims(d, `다음은 ${c.say(n)}. 두 자료를 각각 상자그림으로 나타내어 비교할 때, 옳은 것은? ${HOW}`, cands, {
        figure: twoData(c.names, [la, lb], c.unit),
        lead: `작은 값부터 늘어놓고 다섯 수를 구하면 ${say(na, fa)} ${say(nb, fb)}`
      });
    }),
    // ── ① 뜻을 정확히 대야 풀리는 문제 ──
    H('hard-box-peaks', '봉우리가 둘인 자료의 상자그림과 히스토그램 함께 읽기', '상자 ①7', (d) => {
      // 함정: 상자그림만 보고 자료가 중앙값 근처에 몰려 있다고 보는 아이. 자료는 두 무리로 나뉘어 중앙값이 든 계급의 도수가 작다.
      const PC = [
        { of: '어느 학교 학생 24명의 신발 크기', unit: 'mm', lo: 220 },
        { of: '어느 동아리 학생 24명의 하루 운동 시간', unit: '분', lo: 20 }
      ];
      const c = d.pick(PC), n = 24, k = 7, cw = 10, lo = c.lo, hi = lo + k * cw;
      const classOf = (v) => Math.floor((v - lo) / cw), boundary = (v) => (v - lo) % cw === 0;
      // 계급의 도수부터 봉우리 둘로 정한다: 양 끝 계급 1~2, 봉우리 계급(둘째·셋째, 다섯째·여섯째) 3~7, 가운데 넷째 계급은 2~3(골짜기).
      // 12번째·13번째 값이 골짜기 계급에 들게 하고(중앙값이 골짜기에 든다), 골짜기의 도수는 두 봉우리보다 2 이상 작다.
      // 값은 계급 안의 5의 배수(계급의 처음 값과 그 다음 5). 다섯 수는 5의 배수이고 계급의 끝 값이 아니다.
      let list, f, counts;
      d.until(() => {
        counts = [d.int(1, 2), d.int(3, 7), d.int(3, 7), d.int(2, 3), d.int(3, 7), 0, d.int(1, 2)];
        counts[5] = n - counts.reduce((a, b) => a + b, 0);   // 여섯째 계급으로 합을 24에 맞춘다
        if (counts[5] < 3 || counts[5] > 7) return false;
        const below = counts[0] + counts[1] + counts[2];
        if (below > 11 || below + counts[3] < 13 || Math.max(counts[1], counts[2]) < counts[3] + 2 || Math.max(counts[4], counts[5]) < counts[3] + 2) return false;
        list = counts.flatMap((m, i) => range(1, m).map(() => lo + i * cw + 5 * d.int(0, 1)));
        f = five(list);
        return f.all.every((v) => Number.isInteger(v) && v % 5 === 0 && !boundary(v)) && f.q1 < f.med && f.med < f.q3;
      }, (x) => x);
      const s = f.all, cm = classOf(s[2]), km = counts[cm], top = Math.max(...counts);
      const rangeOf = (i) => `${amt(lo + i * cw, c.unit)} 이상 ${amt(lo + (i + 1) * cw, c.unit)} 미만`;
      const c1 = classOf(s[1]), c3 = classOf(s[3]), cmax = classOf(s[4]);
      const wrongCount = (i) => { const near = [counts[i - 1], counts[i + 1]].filter((v) => v != null && v !== counts[i]); return near.length ? near[0] : counts[i] + 1; };
      const c3w = c3 + 1 < k ? c3 + 1 : c3 - 1, U = c.unit;
      const cands = [
        { t: `중앙값이 속하는 계급의 도수는 ${km}명이다.`, ok: true },
        { t: d.pick(['도수가 가장 큰 계급에 중앙값이 속한다.', '자료는 중앙값이 속하는 계급에 가장 많이 몰려 있다.']), ok: false,
          why: `중앙값 ${ua(s[2], U, '이/가')} 속하는 계급의 도수는 ${km}명으로, 가장 큰 도수 ${top}명보다 작다. 자료는 두 무리로 나뉘어 있는데 상자그림은 그것을 보여 주지 않는다.` },
        { t: `제1사분위수가 속하는 계급의 도수는 ${wrongCount(c1)}명이다.`, ok: false, why: `제1사분위수 ${ua(s[1], U, '은/는')} ${rangeOf(c1)}인 계급에 속하고, 그 도수는 ${counts[c1]}명이다.` },
        { t: `제3사분위수는 ${rangeOf(c3w)}인 계급에 속한다.`, ok: false, why: `제3사분위수 ${ua(s[3], U, '은/는')} ${rangeOf(c3)}인 계급에 속한다.` },
        { t: `최댓값이 속하는 계급의 도수는 ${wrongCount(cmax)}명이다.`, ok: false, why: `최댓값 ${ua(s[4], U, '은/는')} ${rangeOf(cmax)}인 계급에 속하고, 그 도수는 ${counts[cmax]}명이다.` }
      ];
      return pickClaims(d, `다음은 ${obj(c.of)} 조사하여 상자그림과 히스토그램으로 나타낸 것이다. 이에 대한 설명으로 옳은 것은?`, cands, {
        figure: '<div style="display:grid;gap:10px;max-width:100%">' + boxFig([{ s }], { lo, hi, step: 5, unit: c.unit, every: 2 }) + histFig({ lo, cw, counts, unit: c.unit, cnt: '명' }) + '</div>',
        lead: `상자그림에서 중앙값은 ${amt(s[2], c.unit)}이므로 ${rangeOf(cm)}인 계급에 속하고, 히스토그램에서 그 계급의 도수는 ${km}명이다.`
      });
    }),
    H('hard-box-cmp-trap', '자료의 수가 다른 두 집단의 상자그림에서 알 수 있는 것', '상자 ①8', (d) => {
      // 함정: 상자(수염)가 길면 그 안에 든 것이 많다고 보는 아이. 한 집단의 수가 다른 집단의 두 배이고, 상자·오른쪽 수염은 수가 적은 쪽이 더 길다.
      //  상자 안(제1사분위수~제3사분위수)에는 자료의 절반 이상이 들고, 제3사분위수 이상인 것은 25 % 이상이며 중앙값보다 큰 것은 절반 이하이다(자료의 수가 짝수일 때의 사분위수).
      const c = d.pick(PAIRS), [lo, step, nt] = c.ax, at0 = atOf(c.ax), nB = d.pick([10, 12, 16, 20]), nA = nB * 2;
      const [na, nb] = d.shuffle(c.names), useT1 = d.bool();
      const fits = (a, b) => (b[3] - b[1]) - (a[3] - a[1]) >= 2 && (b[4] - b[3]) - (a[4] - a[3]) >= 2 && (useT1 ? b[2] > a[3] : b[0] > a[1]) && a[2] !== b[2];
      const [pa, pb] = d.until(() => { const a = d.pick(all5(nt)), bs = all5(nt).filter((b) => fits(a, b)); return bs.length ? [a, d.pick(bs)] : null; }, (x) => Boolean(x));
      const A = pa.map(at0), Bv = pb.map(at0), u = c.unit;
      const cands = [
        useT1 ? { t: `${c.mem(nb)}의 절반 이상은 ${c.meas} ${na}의 제3사분위수보다 크다.`, ok: true }
          : { t: `${c.mem(na)} 가운데 ${c.meas} ${nb}의 최솟값보다 작은 ${topic(c.who)} ${c.mem(na)} 전체의 25 % 이상이다.`, ok: true },
        { t: `${nb}의 상자가 ${na}의 상자보다 길므로, 상자 안에 든 ${topic(c.who)} ${subj(nb)} 더 많다.`, ok: false, why: `상자 안에는 자료의 절반 이상이 든다. ${topic(na)} ${nA}${c.cnt}의 절반인 ${nA / 2}${c.cnt} 이상이고, ${topic(nb)} 모두 ${nB}${c.cnt}이므로 ${subj(nb)} 더 많을 수 없다. 상자의 길이는 퍼진 정도일 뿐이다.` },
        { t: `${nb}의 오른쪽 수염이 ${na}의 오른쪽 수염보다 길므로, 제3사분위수 이상인 ${topic(c.who)} ${subj(nb)} 더 많다.`, ok: false, why: `제3사분위수 이상인 것은 ${subj(na)} ${nA}${c.cnt}의 25 %인 ${nA / 4}${c.cnt} 이상이다. ${nb}의 제3사분위수는 중앙값보다 크므로 그 이상인 것은 중앙값보다 큰 것뿐이라 ${nB}${c.cnt}의 절반인 ${nB / 2}${c.cnt} 이하이다. 수염의 길이는 퍼진 정도일 뿐이다.` },
        { t: `${topic(c.mem(na))} 모두 ${c.meas} ${amt(A[1], u)} 이상 ${amt(A[3], u)} 이하이다.`, ok: false, why: `${na}의 최솟값은 ${amt(A[0], u)}, 최댓값은 ${amt(A[4], u)}이므로 상자 밖에도 자료가 있다.` },
        { t: `${c.both}의 ${c.who} 수가 다르므로 두 중앙값의 크기는 비교할 수 없다.`, ok: false, why: `중앙값은 값이므로 자료의 수가 달라도 비교할 수 있다. ${na}의 중앙값은 ${amt(A[2], u)}, ${nb}의 중앙값은 ${amt(Bv[2], u)}이다.` }
      ];
      const lead = useT1 ? `${nb}의 중앙값 ${ua(Bv[2], u, '이/가')} ${na}의 제3사분위수 ${amt(A[3], u)}보다 크므로, 중앙값 이상인 ${nb}의 절반 이상이 그보다 크다.`
        : `${na}의 제1사분위수 ${ua(A[1], u, '이/가')} ${nb}의 최솟값 ${amt(Bv[0], u)}보다 작으므로, 제1사분위수 이하인 ${na}의 25 % 이상이 그보다 작다.`;
      return pickClaims(d, `${pairIntro(c)} ${topic(c.mem(na))} ${nA}${c.cnt}, ${topic(c.mem(nb))} ${nB}${c.cnt}이다. 이에 대한 설명으로 옳은 것은?`, cands, {
        figure: boxFig(c.names.map((nm) => ({ name: nm, s: nm === na ? A : Bv })), { lo, hi: lo + nt * step, step, unit: u }),
        lead
      });
    })
  ];
  B.addTypes('9-2-6', 'hard', HARD);
})(typeof window !== 'undefined' ? window : globalThis);
