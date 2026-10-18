// 중학교 3학년 2학기 6단원 산점도와 상관관계 — 단원 틀·그림 도구와 앞쪽 묶음(산점도 그리기와 읽기, 조건을 만족시키는 점의 수와 비율, 두 변량의 비교).
// 수집해 둔 미래엔(황선욱) 2015 교과서·지도서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 38꼴, 심화꼴: 13꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/9-2-6/싣기_대조표.md 에 있다.
// (조건에 맞는 자료의 평균과 대푯값, 상관관계의 종류, 상황과 상관관계, 산점도 해석은 9-2-6b.js 에, 실력 문항은 9-2-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 자료와 가능성. 성취기준은 9수04-09(자료를 산점도로 나타내고 상관관계를 말할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(표 / 눈금이 있는 산점도 / 눈금 없이 이름 붙은 점 / 눈금 없는 모양 그림 / 상황의 말)과
//    묻는 것(점의 수 / 비율·백분율 / 평균·대푯값 / 상관관계의 종류 / 사람 고르기 / 설명의 옳고 그름)과 가르는 선(가로·세로 기준선 / 대각선 / 합이 같은 직선 / 차가 같은 띠)이 다를 때만 따로 싣는다.
//  - 교육과정(2022): 「상관관계는 양의 상관관계, 음의 상관관계, 상관관계가 없는 경우로 구분하여 다룬다.」 강한·약한 상관관계를 가르는 꼴과 보기 속 강약 문장은 싣지 않는다. 상관계수(고등학교)도 쓰지 않는다.
//  - 답: 점의 수는 자연수, 비율은 분수(크기가 같은 분수를 모두 받는다 — 문제에 「기약분수로」가 없다), 백분율은 「 %」 단위를 단 자연수, 평균은 자연수(차례마다 늘 자연수가 되게 수를 고른다)로 받는다.
//    음수가 될 수 있는 답이 없는 단원이므로 부호 단추는 달지 않는다. 사람(A~E)·산점도·상황은 고르기로 받는다. 「모두 고르시오」는 「모두 고른 것」 고르기로 바꾸었다.
//  - 그림: 산점도는 이 파일의 scatter 로 그린다(공용 graph 의 축·눈금 그리는 법을 따랐다 — 점마다 작은 원, 0과 첫 눈금 사이를 줄였다는 물결 표시, 축 끝의 화살표).
//    점은 모두 모눈의 교점에 놓고, 같은 자리에 두 점을 놓지 않는다(자료를 지을 때부터 자리가 겹치지 않게 고른다). 기준선(대각선 등)은 그리는 도구에 점선으로 있으나,
//    문제 그림에는 긋지 않았다(교과서 문제 그림에 없고, 그으면 「어느 쪽인가」만 남는다). 상관관계의 모양을 보이는 작은 그림만 교과서처럼 점들의 경향을 점선으로 긋는다.
//    그림 설명(aria-label)에 축의 이름·눈금과 점의 좌표를 모두 적는다(검사와 화면 읽기가 그것으로 그림을 읽는다). 이름 붙은 점(A~E)은 이름과 좌표를 따로 적는다.
//    「~에 비하여」를 묻는 그림은 교과서처럼 눈금의 수와 모눈 없이 그리고, 설명에는 같은 간격의 칸으로 잰 자리를 적는다.
//  - 꼴 목록에 적힌 원문 답은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(9-2-6b.js, 9-2-6c.js 의 것까지 여기에 모아 적는다)
//  - 교육과정 밖: 상관관계의 강약(①28 — 강한 음·약한 양 고르기, 「㈏는 ㈎보다 강하다」), 설명 고르기 보기 속의 강약 문장(①27·36의 보기 하나씩 — 그 보기만 뺐다).
//  - 활동·작도: 생각 열기의 표에서 도시 찾기와 관계 말하기(①2), 준비 학습의 점 그래프 완성(①4 — 앞 학년 되짚기), 공학 도구·실제 자료 조사·통계 포스터(①38).
//    산점도 그리기(①1)는 「표에 맞는 산점도 고르기」로 바꾸어 실었다.
//  - 한 조건의 비율(①11)은 ratio-both 의 둘째 차례로 실었다. 주어진 산점도에 맞는 상황 하나 고르기(①30의 변형)는 situ-shape(모두 고른 것)와 같은 일이라 따로 싣지 않았다.
//  - 그림을 모르는 것은 없다. 수준별 문제은행의 그림은 없지만 꼴은 풀이 글로 알 수 있어 새로 지었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, table, N, M, C, F } = B.kit;
  const { LAB, range, tail, f1, nb } = B.kit.mid;
  const STD = '9수04-09';
  // ref 에 기본꼴(①)만 있으면 기본 자료, 심화꼴(심)만 있으면 심화 자료
  const sourceOf = (ref) => '수집본 ' + (/①/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});

  // ── 셈 ──
  const sum = (a) => a.reduce((s, v) => s + v, 0);
  const cnt = (pts, f) => pts.filter(([x, y]) => f(x, y)).length;
  const ones = (k) => Array.from({ length: k }, () => '1').join('+');   // 검사 식: 센 점마다 1
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // 상관계수(그림을 지을 때 점의 모양을 가리는 데만 쓴다. 문항에는 나오지 않는다 — 고등학교 내용)
  function corr(pts) {
    const n = pts.length, mx = sum(pts.map((p) => p[0])) / n, my = sum(pts.map((p) => p[1])) / n;
    let sxy = 0, sxx = 0, syy = 0;
    for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; syy += (y - my) ** 2; }
    return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
  }
  // 점들의 경향을 나타내는 직선(최소제곱): y = a + b x. 「~에 비하여」 문항의 답을 가리는 데 쓴다.
  function fit(pts) {
    const n = pts.length, mx = sum(pts.map((p) => p[0])) / n, my = sum(pts.map((p) => p[1])) / n;
    let sxy = 0, sxx = 0;
    for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) ** 2; }
    const b = sxy / sxx; return { a: my - b * mx, b };
  }

  // ── 글 ──
  const subj = (w) => josa(w, '이/가'), topic = (w) => josa(w, '은/는'), obj = (w) => josa(w, '을/를'), wa = (w) => josa(w, '과/와');
  // 수와 단위: 단위 기호(cm, kg, kcal, °C, %)는 띄어 쓰고, 우리말 단위(점, 개, 시간)와 각도(°)는 붙여 쓴다.
  const amt = (v, u) => v + (/^([A-Za-z%]|°C)/.test(u) ? ' ' : '') + u;
  const REL = { ge: '이상', le: '이하', lt: '미만', gt: '초과' };
  const test = (rel, v, t) => (rel === 'ge' ? v >= t : rel === 'le' ? v <= t : rel === 'lt' ? v < t : v > t);
  const ptx = ([x, y]) => `(${x}, ${y})`;
  const ptj = (p, pair) => ptx(p) + tail(p[1], pair);   // 좌표 뒤 토씨는 뒤의 수를 읽는 소리에 맞춘다
  const list = (pts) => pts.map(ptx).join(', ');
  // 문항 끝: 몇 명인가? / 몇 종인가?
  const howMany = (c) => `${topic(c.who)} 몇 ${c.cnt}인가?`;

  // ── 소재 ──
  // 가로·세로가 다른 양인 자료. X·Y: [가장 작은 눈금, 가장 큰 눈금, 눈금 간격], k: 점들의 경향(1 양, −1 음, 0 없음).
  //  aw·bw: 「키가 클수록 대체로 몸무게도 많이 나간다」의 「클수록」「많이 나간다」(경향을 말하는 설명에 쓴다).
  const PAIR = [
    { a: '키', au: 'cm', b: '몸무게', bu: 'kg', X: [145, 180, 5], Y: [35, 70, 5], k: 1, about: '키와 몸무게', aw: '클수록', bw: '많이 나간다' },
    { a: '공부 시간', au: '시간', b: '수학 점수', bu: '점', X: [0, 10, 1], Y: [40, 100, 10], k: 1, about: '일주일 동안의 공부 시간과 수학 점수', aw: '길수록', bw: '높다' },
    { a: '독서 시간', au: '시간', b: '국어 점수', bu: '점', X: [0, 14, 2], Y: [40, 100, 10], k: 1, about: '한 달 동안의 독서 시간과 국어 점수', aw: '길수록', bw: '높다' },
    { a: '키', au: 'cm', b: '발 길이', bu: 'mm', X: [150, 180, 5], Y: [215, 250, 5], k: 1, about: '키와 발 길이', aw: '클수록', bw: '길다' },
    { who: '야구 선수', a: '홈런 수', au: '개', b: '타점', bu: '점', X: [0, 35, 5], Y: [40, 110, 10], k: 1, about: '한 해 동안의 홈런 수와 타점', group: '프로 야구 선수', aw: '많을수록', bw: '높다' },
    { who: '과일 주스', cnt: '종', a: '당류', au: 'g', b: '열량', bu: 'kcal', X: [10, 22, 2], Y: [60, 110, 5], k: 1, about: '한 병에 들어 있는 당류와 열량', group: '과일 주스', aw: '많을수록', bw: '높다' },
    { a: '운동 시간', au: '분', b: '소모 열량', bu: 'kcal', X: [10, 40, 5], Y: [60, 180, 20], k: 1, about: '자전거를 탄 운동 시간과 소모 열량', aw: '길수록', bw: '많다' },
    { who: '지점', cnt: '곳', a: '높이', au: 'm', b: '기온', bu: '°C', X: [0, 1400, 200], Y: [8, 24, 2], k: -1, about: '높이와 같은 시각의 기온', group: '어느 산의 지점', aw: '높을수록', bw: '높다' },
    { who: '도시', cnt: '곳', a: '위도', au: '°', b: '7월 평균 기온', bu: '°C', X: [10, 60, 5], Y: [12, 30, 2], k: -1, about: '위도와 7월 평균 기온', group: '북반구의 도시', aw: '높을수록', bw: '높다' },
    { a: '키', au: 'cm', b: '수학 점수', bu: '점', X: [145, 180, 5], Y: [40, 100, 10], k: 0, about: '키와 수학 점수' },
    { a: '몸무게', au: 'kg', b: '팔굽혀펴기 횟수', bu: '회', X: [35, 70, 5], Y: [10, 50, 5], k: 0, about: '몸무게와 1분 동안의 팔굽혀펴기 횟수' }
  ].map((c) => Object.assign({ who: '학생', cnt: '명', group: '어느 반 학생' }, c));
  // 가로·세로가 같은 잣대인 자료(두 번의 점수 따위). up: 가로보다 세로가 큰 것을 이르는 말(「향상된」), high: 크다는 말(높은·많은).
  const SAME = [
    { a: '1차 점수', b: '2차 점수', u: '점', sc: [[0, 10, 1]], about: '양궁 시합에서 1차와 2차에 얻은 점수', up: '1차보다 2차 점수가 높은' },
    { a: '1차 점수', b: '2차 점수', u: '점', sc: [[0, 10, 1]], about: '1차와 2차의 수학 수행평가 점수', up: '1차보다 2차 점수가 높은' },
    { a: '1학기 성적', b: '2학기 성적', u: '점', sc: [[40, 100, 10], [50, 100, 5]], about: '1학기와 2학기의 수학 성적', up: '1학기보다 2학기에 성적이 향상된' },
    { a: '중간고사 점수', b: '기말고사 점수', u: '점', sc: [[40, 100, 10]], about: '중간고사와 기말고사의 과학 점수', up: '중간고사보다 기말고사 점수가 높은' },
    { a: '국어 점수', b: '영어 점수', u: '점', sc: [[30, 100, 10], [40, 100, 10]], about: '국어 점수와 영어 점수' },
    { a: '말하기 점수', b: '듣기 점수', u: '점', sc: [[0, 10, 1]], about: '영어 말하기 점수와 듣기 점수' },
    { who: '야구 선수', a: '작년 홈런 수', b: '올해 홈런 수', u: '개', sc: [[0, 12, 1]], about: '작년과 올해 친 홈런의 수', up: '작년보다 올해 홈런을 많이 친', group: '야구 선수', high: '많은' },
    { who: '관광객', a: '1회 기록', b: '2회 기록', u: '개', sc: [[0, 12, 1]], about: '두 번에 걸친 제기차기 기록', up: '1회보다 2회에 제기를 많이 찬', group: '어느 민속 마을의 관광객', high: '많은' }
  ].map((c) => Object.assign({ who: '학생', cnt: '명', group: '어느 반 학생', high: '높은' }, c));
  // 소재를 고르고 눈금을 정한다. 돌려주는 것: { c, X, Y } (X·Y 는 { lo, hi, step, name })
  const scaleOf = ([lo, hi, step], name) => ({ lo, hi, step, name });
  const cells = (S) => Math.round((S.hi - S.lo) / S.step);
  const idx = (S, v) => Math.round((v - S.lo) / S.step);   // 눈금 v 가 몇째 칸 선인가(0부터)
  const pairOf = (d, list) => { const c = d.pick(list || PAIR); return { c, X: scaleOf(c.X, `${c.a}(${c.au})`), Y: scaleOf(c.Y, `${c.b}(${c.bu})`) }; };
  const sameOf = (d, list) => { const c = d.pick(list || SAME), sc = d.pick(c.sc); return { c: Object.assign({ au: c.u, bu: c.u }, c), X: scaleOf(sc, `${c.a}(${c.u})`), Y: scaleOf(sc, `${c.b}(${c.u})`) }; };
  const intro = (c, n) => `다음 산점도는 ${c.group} ${n}${c.cnt}의 ${obj(c.about)} 조사하여 나타낸 것이다.`;

  // ── 자료 ──
  // 눈금의 교점에 놓인 서로 다른 점 n개. kind: 1(오른쪽 위로 향하는 경향), −1(오른쪽 아래로), 0(경향 없음). spread: 경향에서 벗어나는 정도(칸).
  function gridSet(d, X, Y, n, kind, spread) {
    const nx = cells(X), ny = cells(Y), s = spread == null ? 1.3 : spread, seen = new Set(), out = [];
    for (let tries = 0; out.length < n && tries < n * 40; tries += 1) {
      let i, j;
      // 0인 눈금(축 위)에는 점을 놓지 않는다(점수 0점, 0시간 따위는 드물고, 축 위의 점은 잘 보이지 않는다).
      if (kind === 0) { i = d.int(X.lo === 0 ? 1 : 0, nx); j = d.int(Y.lo === 0 ? 1 : 0, ny); } else {
        const t = d.next(); i = Math.round(t * nx + (d.next() - 0.5)); j = Math.round((kind > 0 ? t : 1 - t) * ny + (d.next() + d.next() - 1) * s * 1.6);
      }
      if (i < (X.lo === 0 ? 1 : 0) || i > nx || j < (Y.lo === 0 ? 1 : 0) || j > ny || seen.has(i + ',' + j)) continue;
      seen.add(i + ',' + j); out.push([X.lo + i * X.step, Y.lo + j * Y.step]);
    }
    return out;
  }
  // 점들의 모양이 경향(kind)에 맞는가. 양·음은 뚜렷하게, 없음은 어느 쪽으로도 기울지 않게.
  const shapeOk = (pts, kind) => (kind > 0 ? corr(pts) >= 0.55 : kind < 0 ? corr(pts) <= -0.55 : Math.abs(corr(pts)) <= 0.18);
  // 자료 짓기: 조건(ok)에 맞을 때까지 다시 만든다.
  const data = (d, X, Y, n, kind, ok, spread) => d.until(() => gridSet(d, X, Y, n, kind, spread), (p) => p.length === n && shapeOk(p, kind) && (!ok || ok(p)));

  // ── 그림 ──
  const INK = '#1f2933', TREND = '#c2410c';
  const label = (x, y, anchor, text, size, more) => `<text class="mb-axis-label" style="font-size:${size}px${more || ''}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${text}</text>`;
  // 산점도. o.X·o.Y: { lo, hi, step, name }, o.pts: [[x, y], …](서로 다른 자리, 모두 눈금 위), o.marks: [{ x, y, name }](이름 붙은 점 — pts 에도 들어 있다),
  //  o.nums: false 이면 눈금의 수와 모눈을 그리지 않는다(「~에 비하여」 그림), o.every: [가로, 세로] 수를 적는 눈금의 칸 간격, o.square: 가로·세로 한 칸의 크기를 같게,
  //  o.small: 고르기 보기에 넣는 작은 그림, o.w: 그림 너비의 상한, o.guides: [[x1, y1, x2, y2], …] 점선(기준선).
  function scatter(o) {
    const X = o.X, Y = o.Y, nx = cells(X), ny = cells(Y), nums = o.nums !== false, small = Boolean(o.small);
    const fs = 12, ch0 = fs * 0.6, yTexts = nums ? range(0, ny).map((j) => String(Y.lo + j * Y.step)) : [];
    const L = nums ? 7 + Math.max(...yTexts.map((s) => s.length)) * ch0 + 3 : 14;
    const gapX = nums && X.lo > 0 ? (small ? 9 : 13) : 0, gapY = nums && Y.lo > 0 ? (small ? 9 : 13) : 0;
    const top = 32, Wmax = o.w || 286, R = small ? 10 : 16;
    let cw = Math.min(small ? 30 : 28, (Wmax - L - gapX - R) / nx), ch = Math.min(small ? 22 : 26, (small ? 110 : 240) / ny);
    if (o.square) { cw = Math.min(cw, ch); ch = cw; }
    // 수를 적는 눈금의 간격(칸): 이웃한 수가 닿지 않게 넓힌다(o.every 로 정할 수 있다).
    const xw = Math.max(...range(0, nx).map((i) => String(X.lo + i * X.step).length)) * fs * 0.56 + 4;
    const [ex, ey] = o.every || [Math.ceil(xw / cw), Math.ceil((fs + 2) / ch)];
    const x0 = L + gapX, right = x0 + nx * cw, yTop = top, yLo = top + ny * ch, base = yLo + gapY;
    const gx = (v) => x0 + (v - X.lo) / X.step * cw, gy = (v) => yLo - (v - Y.lo) / Y.step * ch;
    const W = Math.ceil(right + R), H = Math.ceil(base + (nums ? 33 : 20));
    let out = '';
    if (nums) {
      for (let i = 0; i <= nx; i += 1) out += `<line class="mb-gridline" x1="${f1(gx(X.lo + i * X.step))}" y1="${f1(yTop)}" x2="${f1(gx(X.lo + i * X.step))}" y2="${f1(yLo)}"/>`;
      for (let j = 0; j <= ny; j += 1) out += `<line class="mb-gridline" x1="${f1(x0)}" y1="${f1(gy(Y.lo + j * Y.step))}" x2="${f1(right)}" y2="${f1(gy(Y.lo + j * Y.step))}"/>`;
    }
    // 축과 화살표
    out += `<line class="mb-axis" x1="${f1(L)}" y1="${f1(base)}" x2="${f1(right + R - 5)}" y2="${f1(base)}"/><path d="M${f1(right + R - 1)} ${f1(base)}l-6.5 -3.2v6.4z" style="fill:${INK}"/>`
      + `<line class="mb-axis" x1="${f1(L)}" y1="${f1(base)}" x2="${f1(L)}" y2="${f1(yTop - 12)}"/><path d="M${f1(L)} ${f1(yTop - 16)}l-3.2 6.5h6.4z" style="fill:${INK}"/>`;
    // 0과 첫 눈금 사이를 줄였다는 물결 표시
    const wave = (x, y, vertical) => (vertical
      ? `<rect x="${f1(x - 3)}" y="${f1(y - 3.5)}" width="6" height="7" style="fill:#fff"/><path d="M${f1(x)} ${f1(y + 3.5)}l-3.5 -1.6l7 -3.6l-3.5 -1.6" style="fill:none;stroke:${INK};stroke-width:1"/>`
      : `<rect x="${f1(x - 3.5)}" y="${f1(y - 3)}" width="7" height="6" style="fill:#fff"/><path d="M${f1(x - 3.5)} ${f1(y)}l1.6 -3.5l3.6 7l1.6 -3.5" style="fill:none;stroke:${INK};stroke-width:1"/>`);
    if (gapX) out += wave(L + gapX / 2, base, false);
    if (gapY) out += wave(L, yLo + gapY / 2, true);
    if (nums) {
      out += label(L - 3, base + 13, 'end', '0', fs);
      for (let i = 0; i <= nx; i += ex) if (!(X.lo === 0 && i === 0)) out += label(gx(X.lo + i * X.step), base + 13.5, 'middle', X.lo + i * X.step, fs);
      for (let j = 0; j <= ny; j += ey) if (!(Y.lo === 0 && j === 0)) out += label(L - 3, gy(Y.lo + j * Y.step) + fs * 0.35, 'end', Y.lo + j * Y.step, fs);
    } else out += `<text x="${f1(L - 2)}" y="${f1(base + 13)}" text-anchor="end" style="font-size:12px;font-weight:600;fill:${INK}">O</text>`;
    // 축의 이름: 가로축은 오른쪽 아래, 세로축은 왼쪽 위
    out += label(W - 1, H - 4, 'end', X.name, 12) + label(L + 5, yTop - 17, 'start', Y.name, 12);
    for (const g of o.guides || []) out += `<line x1="${f1(gx(g[0]))}" y1="${f1(gy(g[1]))}" x2="${f1(gx(g[2]))}" y2="${f1(gy(g[3]))}" style="stroke:${TREND};stroke-width:1.3;stroke-dasharray:4 3"/>`;
    for (const [x, y] of o.pts) out += `<circle cx="${f1(gx(x))}" cy="${f1(gy(y))}" r="${small ? 2.4 : 3}" style="fill:${INK}"/>`;
    // 이름 붙은 점: 이름을 다른 점·이름과 떨어진 쪽에 적는다(흰 테두리를 둘러 모눈선이 글자를 긋지 않게). 세로축 이름의 자리도 피한다.
    const nameW = (t) => [...t].reduce((w, ch) => w + (/[가-힣]/.test(ch) ? 12 : 7), 0);
    const placed = [[L + 3, yTop - 30, L + 7 + nameW(Y.name), yTop - 13]];
    for (const m of o.marks || []) {
      const px = gx(m.x), py = gy(m.y), tries = [[6, -5, 'start'], [-6, -5, 'end'], [6, 13, 'start'], [-6, 13, 'end'], [0, -8, 'middle'], [0, 17, 'middle']];
      const boxOf = ([dx, dy, an]) => { const x1 = an === 'start' ? px + dx : an === 'end' ? px + dx - 9 : px - 4.5; return [x1, py + dy - 10, x1 + 9, py + dy + 1]; };
      const clear = (b) => b[0] > L + 1 && b[2] < W - 1 && b[1] > 2 && b[3] < base - 1 && o.pts.every(([x, y]) => { const qx = gx(x), qy = gy(y); return qx < b[0] - 3 || qx > b[2] + 3 || qy < b[1] - 3 || qy > b[3] + 3; })
        && placed.every((p) => b[2] < p[0] - 2 || b[0] > p[2] + 2 || b[3] < p[1] - 2 || b[1] > p[3] + 2);
      const pick = tries.find((t) => clear(boxOf(t))) || tries[0];
      placed.push(boxOf(pick));
      out += `<text x="${f1(px + pick[0])}" y="${f1(py + pick[1])}" text-anchor="${pick[2]}" style="font-size:12.5px;font-weight:700;fill:${INK};paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round">${m.name}</text>`;
    }
    const said = `산점도. 가로축: ${X.name}, 세로축: ${Y.name}. `
      + (nums ? `눈금: 가로 ${X.lo}부터 ${X.hi}까지 ${X.step}씩, 세로 ${Y.lo}부터 ${Y.hi}까지 ${Y.step}씩. ` : '축에 눈금의 수가 없다(점의 자리는 가로·세로 같은 간격의 칸으로 잰 것이다). ')
      + `점 ${o.pts.length}개: ${list(o.pts)}.` + ((o.marks || []).length ? ` 이름 붙은 점: ${o.marks.map((m) => `${m.name}(${m.x}, ${m.y})`).join(', ')}.` : '')
      + ((o.guides || []).length ? ` 점선: ${o.guides.map((g) => `${ptj([g[0], g[1]], '과/와')} ${ptj([g[2], g[3]], '을/를')} 잇는 직선`).join(', ')}.` : '');
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 눈금이 없는 작은 산점도(상관관계의 모양을 보는 그림). 점의 자리는 두 축 모두 0~10으로 잰 수(소수 한 자리).
  //  kind: 'pos'(오른쪽 위로 향하는 직선 주위), 'neg'(오른쪽 아래로), 'round'(둥글게 흩어짐), 'flat'(x축에 평행한 직선 주위), 'tall'(y축에 평행한 직선 주위)
  const r1 = (v) => Math.round(v * 10) / 10;
  function shapePts(d, kind, n) {
    const u = () => d.next() * 2 - 1;
    return d.until(() => {
      const out = [];
      while (out.length < n) {
        let x, y;
        if (kind === 'pos' || kind === 'neg') { const t = 1.2 + d.next() * 7.6, w = u() * 1.15; x = t + w * 0.7; y = kind === 'pos' ? t - w * 0.7 + u() * 0.35 : 10 - t - w * 0.7 + u() * 0.35; }
        else if (kind === 'round') { x = 5 + u() * 3.4; y = 5 + u() * 3.4; if ((x - 5) ** 2 + (y - 5) ** 2 > 3.4 ** 2) continue; }
        else if (kind === 'flat') { x = 1.3 + d.next() * 7.4; y = 5 + u() * 0.9; }
        else { x = 5 + u() * 0.9; y = 1.3 + d.next() * 7.4; }
        out.push([r1(Math.min(9.6, Math.max(0.4, x))), r1(Math.min(9.6, Math.max(0.4, y)))]);
      }
      return out;
    }, (p) => { const r = corr(p); return kind === 'pos' ? r >= 0.85 : kind === 'neg' ? r <= -0.85 : Math.abs(r) <= 0.12; });
  }
  // 경향을 나타내는 점선(교과서 그림처럼 점들의 가운데를 지나는 선분)
  const TREND_OF = { pos: [1.2, 1.2, 8.8, 8.8], neg: [1.2, 8.8, 8.8, 1.2], flat: [1.2, 5, 8.8, 5], tall: [5, 1.2, 5, 8.8] };
  const TREND_SAID = { pos: '왼쪽 아래에서 오른쪽 위로', neg: '왼쪽 위에서 오른쪽 아래로', flat: 'x축에 평행하게', tall: 'y축에 평행하게' };
  function shapeFig(pts, o) {
    const opt = o || {}, w = opt.w || 112, h = opt.h || Math.round(w * 0.9), L = 14, Bm = 16, Tp = 14, R = 10;
    const gx = (v) => L + 3 + v / 10 * (w - L - R - 3), gy = (v) => h - Bm - 3 - v / 10 * (h - Tp - Bm - 3);
    let out = `<line class="mb-axis" x1="${L}" y1="${h - Bm}" x2="${w - 5}" y2="${h - Bm}"/><path d="M${w - 1} ${h - Bm}l-6 -3v6z" style="fill:${INK}"/>`
      + `<line class="mb-axis" x1="${L}" y1="${h - Bm}" x2="${L}" y2="${Tp - 2}"/><path d="M${L} ${Tp - 6}l-3 6h6z" style="fill:${INK}"/>`
      + `<text x="${L - 2}" y="${h - 3}" text-anchor="end" style="font-size:12px;font-weight:600;fill:${INK}">O</text>`
      + `<text x="${w - 4}" y="${h - 3}" text-anchor="end" style="font-size:12px;fill:${INK};font-style:italic;font-family:'MB Math','Times New Roman',serif">x</text>`
      + `<text x="${L + 5}" y="${Tp}" style="font-size:12px;fill:${INK};font-style:italic;font-family:'MB Math','Times New Roman',serif">y</text>`;
    if (opt.trend) { const t = TREND_OF[opt.trend]; out += `<line x1="${f1(gx(t[0]))}" y1="${f1(gy(t[1]))}" x2="${f1(gx(t[2]))}" y2="${f1(gy(t[3]))}" style="stroke:${TREND};stroke-width:1.4;stroke-dasharray:4 3"/>`; }
    for (const [x, y] of pts) out += `<circle cx="${f1(gx(x))}" cy="${f1(gy(y))}" r="1.7" style="fill:${INK}"/>`;
    const said = `눈금이 없는 산점도(가로축 x, 세로축 y, 점의 자리는 두 축 모두 0부터 10까지로 잰 수). 점 ${pts.length}개: ${list(pts)}.`
      + (opt.trend ? ` 점들의 가운데를 지나는 점선이 ${TREND_SAID[opt.trend]} 그어져 있다.` : '');
    return `<svg class="mb-geo" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 그림만 있는 보기에는 앞에 기호를 붙인다(글이 없어 서로 가려지지 않으므로).
  const figOpt = (tag, fig) => `<span style="display:inline-flex;align-items:flex-start;gap:6px"><span style="font-weight:700">${tag}</span>${fig}</span>`;
  // 이름(㈎ ㈏ …)을 단 작은 그림 여럿을 한 줄에 놓는다.
  const figRow = (figs, names) => `<div style="display:flex;flex-wrap:wrap;gap:8px 10px;align-items:flex-start">${figs.map((f, i) => `<div style="display:grid;gap:2px;justify-items:center"><span style="font-weight:700">${names[i]}</span>${f}</div>`).join('')}</div>`;
  // 두 변량의 표(세로로 긴 표 — 휴대폰 너비를 넘지 않는다)
  const pairTable = (c, pts) => table(['번호', `${c.a}(${c.au})`, `${c.b}(${c.bu})`], pts.map(([x, y], i) => [String(i + 1), String(x), String(y)]));
  // 보기 ㄱ, ㄴ, … 을 단 줄
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  const bogi = (rows) => '<div class="mb-lines" style="border:1px solid #8a96a3;border-radius:8px;padding:8px 12px;font-size:1.02rem">' + rows.map((r, i) => `<div>${HAN[i]}. ${r}</div>`).join('') + '</div>';
  // 「모두 고른 것」의 보기: 맞는 묶음 하나와 다른 묶음 넷(사전 차례로 늘어놓는다)
  function comboChoice(d, text, flags, o) {
    const k = flags.length, right = range(0, k - 1).filter((i) => flags[i]), key = (s) => s.map((i) => HAN[i]).join(', ');
    const pool = [];
    for (let m = 1; m < 1 << k; m += 1) pool.push(range(0, k - 1).filter((i) => m & (1 << i)));
    const others = d.shuffle(pool.filter((s) => key(s) !== key(right))).sort((p, q) => Math.abs(p.length - right.length) - Math.abs(q.length - right.length)).slice(0, 4);
    const opts = [key(right)].concat(others.map(key)).sort();
    return C(text, opts, opts.indexOf(key(right)), { figure: o.figure, explain: o.explain, facts: { truth: opts.map((s) => s === key(right)), want: true } });
  }

  // ═══ 산점도 그리기와 읽기 ═══
  const PLOT = [
    T('plot-table', '표에 맞는 산점도 고르기', '①1', (d) => {
      // 점 여섯 개(가로의 값이 모두 다르다). 틀린 그림은 한 점을 위나 아래로 한두 칸 옮겼거나 두 점의 세로 값을 맞바꿔 찍은 것이다.
      const { c, X: X0, Y: Y0 } = pairOf(d, PAIR.filter((p) => p.k !== 0));
      const xi = d.int(0, cells(X0) - 5), yi = d.int(0, cells(Y0) - 5);
      const X = scaleOf([X0.lo + xi * X0.step, X0.lo + (xi + 5) * X0.step, X0.step], X0.name), Y = scaleOf([Y0.lo + yi * Y0.step, Y0.lo + (yi + 5) * Y0.step, Y0.step], Y0.name);
      const cols = d.shuffle(range(0, 5));
      const js = d.until(() => cols.map((i) => Math.max(0, Math.min(5, Math.round((c.k > 0 ? i : 5 - i) + (d.next() * 2 - 1) * 1.4)))), () => true);
      const pts = cols.map((i, n) => [X.lo + i * X.step, Y.lo + js[n] * Y.step]);
      const key = (p) => p.map((q) => q.join(',')).sort().join('|');
      const moves = [];
      pts.forEach((p, i) => [-2, -1, 1, 2].forEach((m) => { const v = p[1] + m * Y.step; if (v >= Y.lo && v <= Y.hi) moves.push({ kind: 'move', i, v }); }));
      for (let i = 0; i < 6; i += 1) for (let j = i + 1; j < 6; j += 1) if (pts[i][1] !== pts[j][1]) moves.push({ kind: 'swap', i, j });
      const apply = (mv) => pts.map((p, i) => (mv.kind === 'move' ? (i === mv.i ? [p[0], mv.v] : p) : i === mv.i ? [p[0], pts[mv.j][1]] : i === mv.j ? [p[0], pts[mv.i][1]] : p));
      const wrongs = d.until(() => d.shuffle(moves).slice(0, 3), (w) => new Set(w.map((mv) => key(apply(mv))).concat([key(pts)])).size === 4 && w.some((mv) => mv.kind === 'swap'));
      const sets = d.shuffle([{ p: pts, ok: true }].concat(wrongs.map((mv) => ({ p: apply(mv), ok: false, mv }))));
      const at = sets.findIndex((s) => s.ok);
      const why = sets.filter((s) => !s.ok).map((s) => { const k = sets.indexOf(s), mv = s.mv; return mv.kind === 'move' ? `${LAB[k]}: ${mv.i + 1}번의 ${obj(c.b)} ${josa(mv.v, '으로/로')} 찍었다.` : `${LAB[k]}: ${mv.i + 1}번과 ${mv.j + 1}번의 ${obj(c.b)} 맞바꿔 찍었다.`; });
      return C(`다음 표는 ${c.group} 6${c.cnt}의 ${obj(c.about)} 조사하여 나타낸 것이다. 이 자료에서 ${obj(c.a)} 가로축, ${obj(c.b)} 세로축으로 하는 산점도로 알맞은 것은?`,
        sets.map((s, k) => figOpt(LAB[k], scatter({ X, Y, pts: s.p, small: true, w: 220 }))), at, {
          figure: pairTable(c, pts),
          explain: `표의 순서쌍 ${list(pts)}${tail(pts[5][1], '을/를')} 모두 찍은 것은 ${LAB[at]}이다. ` + why.join(' '),
          facts: { truth: sets.map((s) => s.ok), want: true }
        });
    }),
    T('plot-point', '산점도에서 한 점의 두 변량 읽기', '①3', (d) => {
      // 수를 두 칸마다 적은 눈금에서, 수가 적히지 않은 눈금 위의 점 A를 읽는다.
      const { c, X, Y } = pairOf(d, PAIR.filter((p) => cells(scaleOf(p.X)) >= 6 && cells(scaleOf(p.Y)) >= 6));
      const odd = ([x, y]) => idx(X, x) % 2 === 1 && idx(Y, y) % 2 === 1;
      const n = d.int(10, 13), pts = data(d, X, Y, n, c.k, (p) => p.some(odd)), A = d.pick(pts.filter(odd));
      const near = (S, v) => `${S.lo + (idx(S, v) - 1) * S.step}${tail(S.lo + (idx(S, v) - 1) * S.step, '과/와')} ${S.lo + (idx(S, v) + 1) * S.step}`;
      return M(`${intro(c, n)} 점 A가 나타내는 ${c.who}의 ${wa(c.a)} ${obj(c.b)} 차례로 구하시오.`, [{ label: c.a, answer: A[0], unit: c.au }, { label: c.b, answer: A[1], unit: c.bu }], {
        figure: scatter({ X, Y, pts, marks: [{ x: A[0], y: A[1], name: 'A' }], every: [2, 2] }),
        shown: `${c.a} ${amt(A[0], c.au)}, ${c.b} ${amt(A[1], c.bu)}`,
        explain: `점 A는 가로축에서 ${near(X, A[0])}의 가운데 눈금, 세로축에서 ${near(Y, A[1])}의 가운데 눈금 위에 있다. 따라서 ${c.a} ${amt(A[0], c.au)}, ${c.b} ${amt(A[1], c.bu)}이다.`,
        facts: { calc: [[String(A[0]), 0], [String(A[1]), 1]] }
      });
    })
  ];

  // ═══ 조건을 만족시키는 점의 수와 비율 ═══
  // 기준값 t 를 눈금에서 고른다(양 끝 눈금은 피한다).
  const inner = (d, S) => S.lo + d.int(1, cells(S) - 1) * S.step;
  const cond = (c, axis, rel, t) => `${subj(axis === 0 ? c.a : c.b)} ${amt(t, axis === 0 ? c.au : c.bu)} ${REL[rel]}`;
  const COUNT = [
    T('count-value', '한 값을 갖는 점의 수', '①5', (d, k) => {
      // 차례 0: 세로의 값이 t 인 점(가로로 놓인 한 줄). 차례 1: 점 A와 가로의 값이 같은 점(세로로 놓인 한 줄, A 포함).
      const { c, X, Y } = k === 0 ? sameOf(d, SAME.filter((s) => s.sc[0][2] === 1)) : pairOf(d);
      const n = d.int(14, 20);
      if (k === 0) {
        const pts = data(d, X, Y, n, 1, (p) => p.some(([, y]) => cnt(p, (u, v) => v === y) >= 3 && y > Y.lo && y < Y.hi));
        const t = d.pick(pts.filter(([, y]) => cnt(pts, (u, v) => v === y) >= 3 && y > Y.lo && y < Y.hi))[1], hit = pts.filter(([, y]) => y === t);
        return N(`${intro(c, n)} ${subj(c.b)} ${amt(t, c.bu)}인 ${howMany(c)}`, hit.length, { unit: c.cnt, figure: scatter({ X, Y, pts }),
          explain: `세로축의 ${t}인 눈금선 위에 있는 점은 ${list(hit)}의 ${hit.length}개이다.`, facts: { calc: [[ones(hit.length), 0]], unseen: [1] } });
      }
      const pts = data(d, X, Y, n, c.k, (p) => p.some(([x]) => cnt(p, (u) => u === x) >= 3));
      const A = d.pick(pts.filter(([x]) => cnt(pts, (u) => u === x) >= 3)), hit = pts.filter(([x]) => x === A[0]);
      return N(`${intro(c, n)} 점 A가 나타내는 ${wa(c.who)} ${subj(c.a)} 같은 ${topic(c.who)} A를 포함하여 몇 ${c.cnt}인가?`, hit.length, { unit: c.cnt,
        figure: scatter({ X, Y, pts, marks: [{ x: A[0], y: A[1], name: 'A' }] }),
        explain: `점 A를 지나고 세로축에 평행한 직선(가로의 값이 ${A[0]}인 눈금선) 위의 점은 ${list(hit)}의 ${hit.length}개이다. 점 A도 센다.`, facts: { calc: [[ones(hit.length), 0]], unseen: [1] } });
    }, { count: 2 }),
    T('count-side', '한 변량이 기준 이상·이하·미만인 점의 수', '①6', (d) => {
      // 기준선 위에 점이 둘 넘게 있게 하여 이상·이하(넣는다)와 미만(뺀다)을 가려야 답이 나오게 한다.
      const { c, X, Y } = pairOf(d), n = d.int(14, 20), axis = d.int(0, 1), rel = d.pick(['ge', 'le', 'lt']), S = axis === 0 ? X : Y;
      let t;
      const pts = data(d, X, Y, n, c.k, (p) => { t = inner(d, S); const on = cnt(p, (x, y) => (axis ? y : x) === t), k = cnt(p, (x, y) => test(rel, axis ? y : x, t)); return on >= 2 && k >= 3 && k <= n - 3; });
      const hit = pts.filter(([x, y]) => test(rel, axis ? y : x, t));
      return N(`${intro(c, n)} ${cond(c, axis, rel, t)}인 ${howMany(c)}`, hit.length, { unit: c.cnt, figure: scatter({ X, Y, pts }),
        explain: `${axis ? '세로' : '가로'}축의 ${t}인 눈금선${rel === 'lt' ? '보다 ' + (axis ? '아래쪽' : '왼쪽') + '에 있는 점(선 위의 점은 넣지 않는다)' : ' 위의 점과 그보다 ' + (rel === 'ge' ? (axis ? '위쪽' : '오른쪽') : (axis ? '아래쪽' : '왼쪽')) + '에 있는 점'}을 센다. ${list(hit)}의 ${hit.length}개이다.`,
        facts: { calc: [[ones(hit.length), 0]], unseen: [1] } });
    }),
    T('count-range', '한 변량이 범위 안에 있는 점의 수', '①7', (d) => {
      const { c, X, Y } = d.bool() ? sameOf(d) : pairOf(d), n = d.int(15, 22), axis = d.int(0, 1), S = axis === 0 ? X : Y;
      let lo, hi;
      const pts = data(d, X, Y, n, c.k == null ? 1 : c.k, (p) => {
        const i = d.int(1, cells(S) - 3), w = d.int(1, 2); lo = S.lo + i * S.step; hi = lo + (w + 1) * S.step; if (hi >= S.hi) return false;
        const v = (x, y) => (axis ? y : x), k = cnt(p, (x, y) => v(x, y) >= lo && v(x, y) <= hi);
        return cnt(p, (x, y) => v(x, y) === lo) >= 1 && cnt(p, (x, y) => v(x, y) === hi) >= 1 && k >= 4 && k <= n - 4;
      });
      const v = (x, y) => (axis ? y : x), hit = pts.filter(([x, y]) => v(x, y) >= lo && v(x, y) <= hi), name = axis ? c.b : c.a, u = axis ? c.bu : c.au;
      return N(`${intro(c, n)} ${subj(name)} ${amt(lo, u)} 이상 ${amt(hi, u)} 이하인 ${howMany(c)}`, hit.length, { unit: c.cnt, figure: scatter({ X, Y, pts }),
        explain: `${axis ? '세로' : '가로'}축의 ${lo}인 눈금선과 ${hi}인 눈금선 사이에 있는 점을 두 선 위의 점까지 넣어 센다. ${list(hit)}의 ${hit.length}개이다.`,
        facts: { calc: [[ones(hit.length), 0]], unseen: [1] } });
    }),
    T('count-both', '두 변량이 모두 조건에 맞는 점의 수', '①8', (d) => {
      const { c, X, Y } = pairOf(d), n = d.int(15, 22), [ra, rb] = d.pick([['ge', 'ge'], ['le', 'ge'], ['ge', 'le'], ['le', 'le']]);
      let p0, q0;
      const pts = data(d, X, Y, n, c.k, (p) => {
        p0 = inner(d, X); q0 = inner(d, Y);
        const k = cnt(p, (x, y) => test(ra, x, p0) && test(rb, y, q0));
        return k >= 3 && k <= n - 5 && cnt(p, (x, y) => (x === p0 && test(rb, y, q0)) || (y === q0 && test(ra, x, p0))) >= 2;
      });
      const hit = pts.filter(([x, y]) => test(ra, x, p0) && test(rb, y, q0));
      return N(`${intro(c, n)} ${cond(c, 0, ra, p0)}이고 ${cond(c, 1, rb, q0)}인 ${howMany(c)}`, hit.length, { unit: c.cnt, figure: scatter({ X, Y, pts }),
        explain: `가로축의 ${p0}인 눈금선과 세로축의 ${q0}인 눈금선으로 나뉜 곳 가운데 ${ra === 'ge' ? '오른쪽' : '왼쪽'} ${rb === 'ge' ? '위' : '아래'}에 있는 점을 두 선 위의 점까지 넣어 센다. ${list(hit)}의 ${hit.length}개이다.`,
        facts: { calc: [[ones(hit.length), 0]], unseen: [1] } });
    }),
    T('ratio-both', '조건에 맞는 점의 비율', '①9 ①11', (d, k) => {
      // 차례 0: 두 변량이 모두 기준 이상. 차례 1: 한 변량이 기준 미만.
      const { c, X, Y } = pairOf(d), n = d.pick([12, 15, 16, 18, 20]);
      let p0, q0, axis = 0;
      const ok = (x, y) => (k === 0 ? x >= p0 && y >= q0 : (axis ? y : x) < (axis ? q0 : p0));
      const pts = data(d, X, Y, n, c.k, (p) => {
        p0 = inner(d, X); q0 = inner(d, Y); axis = d.int(0, 1);
        const m = cnt(p, ok);
        return m >= 2 && m <= n - 3 && gcd(m, n) > 1 && (k === 1 || cnt(p, (x, y) => (x === p0 && y >= q0) || (y === q0 && x >= p0)) >= 1) && (k === 0 || cnt(p, (x, y) => (axis ? y === q0 : x === p0)) >= 1);
      });
      const hit = pts.filter(([x, y]) => ok(x, y)), m = hit.length, g = gcd(m, n);
      const text = k === 0 ? `${cond(c, 0, 'ge', p0)}이고 ${cond(c, 1, 'ge', q0)}인 ${c.who}의 비율은?` : `${cond(c, axis, 'lt', axis ? q0 : p0)}인 ${c.who}의 비율은?`;
      return F(`${intro(c, n)} ${text}`, m / g, n / g, { anyForm: true, figure: scatter({ X, Y, pts }),
        explain: `조건에 맞는 점은 ${list(hit)}의 ${m}개${k === 1 ? '(기준선 위의 점은 넣지 않는다)' : '(기준선 위의 점도 넣는다)'}이다. 전체 ${n}${c.cnt} 가운데 ${m}${c.cnt}이므로 비율은 ${m}/${n} = ${g > 1 ? `${m / g}/${n / g}` : `${m}/${n}`}이다.`.replace(`${m}/${n} = ${m}/${n}`, `${m}/${n}`),
        facts: { value: `(${ones(m)})/${n}`, unseen: [1] } });
    }, { count: 2 }),
    T('pct-both', '두 변량이 모두 조건에 맞는 점의 백분율', '①10', (d) => {
      const { c, X, Y } = d.bool() ? sameOf(d, SAME.filter((s) => s.sc[0][2] === 1)) : pairOf(d), n = d.pick([20, 25]);
      let t, s;
      const pts = data(d, X, Y, n, c.k == null ? 1 : c.k, (p) => {
        t = inner(d, X); s = c.u ? t : inner(d, Y);
        const m = cnt(p, (x, y) => x >= t && y >= s);
        return m >= 3 && m <= n - 6 && cnt(p, (x, y) => (x === t && y >= s) || (y === s && x >= t)) >= 2;
      });
      const hit = pts.filter(([x, y]) => x >= t && y >= s), m = hit.length;
      const ask = c.u ? `${wa(c.a)} ${subj(c.b)} 모두 ${amt(t, c.u)} 이상인` : `${cond(c, 0, 'ge', t)}이고 ${cond(c, 1, 'ge', s)}인`;
      return N(`${intro(c, n)} ${ask} ${topic(c.who)} 전체의 몇 %인가?`, m * 100 / n, { unit: ' %', figure: scatter({ X, Y, pts, square: Boolean(c.u) }),
        explain: `조건에 맞는 점은 경계선 위의 점까지 넣어 ${list(hit)}의 ${m}개이다. ${m} ÷ ${n} × 100 = ${m * 100 / n}(%)이다.`,
        facts: { calc: [[`(${ones(m)})*100/${n}`, 0]], unseen: [1, 100] } });
    }),
    T('ratio-among', '「~인 것 중에서 ~인 것」의 비율', '①12', (d) => {
      // 분모는 전체가 아니라 앞 조건에 맞는 점의 수이다. 뒤 조건은 이상이거나 미만.
      const { c, X, Y } = pairOf(d), n = d.int(15, 22), rb = d.pick(['ge', 'lt']);
      let p0, q0;
      const pts = data(d, X, Y, n, c.k, (p) => {
        p0 = inner(d, X); q0 = inner(d, Y);
        const sub = p.filter(([x]) => x >= p0), m = cnt(sub, (x, y) => test(rb, y, q0));
        return sub.length >= 5 && sub.length <= 10 && m >= 2 && m <= sub.length - 1 && cnt(p, (x) => x === p0) >= 1 && cnt(sub, (x, y) => y === q0) >= 1;
      });
      const sub = pts.filter(([x]) => x >= p0), hit = sub.filter(([, y]) => test(rb, y, q0)), m = hit.length, s = sub.length, g = gcd(m, s);
      return F(`${intro(c, n)} ${cond(c, 0, 'ge', p0)}인 ${c.who} 중에서 ${cond(c, 1, rb, q0)}인 ${c.who}의 비율은?`, m / g, s / g, { anyForm: true, figure: scatter({ X, Y, pts }),
        explain: `${cond(c, 0, 'ge', p0)}인 점은 ${list(sub)}의 ${s}개이다. 이 가운데 ${cond(c, 1, rb, q0)}인 점은 ${m}개이므로 비율은 ${m}/${s}${g > 1 ? ` = ${m / g}/${s / g}` : ''}이다(전체 ${n}${c.cnt}로 나누지 않는다).`,
        facts: { value: `(${ones(m)})/(${ones(s)})`, unseen: [1] } });
    })
  ];

  // ═══ 두 변량의 비교 ═══
  // 합이 s 인 점을 이은 직선이 그림(가로·세로 눈금이 같은 S)의 테두리와 만나는 두 점
  const sumEnds = (S, s) => (s - S.hi < S.lo ? [[S.lo, s - S.lo], [s - S.lo, S.lo]] : [[s - S.hi, S.hi], [S.hi, s - S.hi]]);
  const same = (d, step1) => sameOf(d, step1 ? SAME.filter((s) => s.sc.some((v) => v[2] === 1)) : undefined);
  // 대각선(두 변량이 같은 점을 이은 직선) 위·위쪽·아래쪽
  const COMPARE = [
    T('cmp-equal', '두 변량이 같은 점의 수', '①13', (d, k) => {
      // 차례 0: 점의 수. 차례 1: 전체의 몇 %.
      const { c, X, Y } = same(d), n = k === 0 ? d.int(14, 20) : d.pick([20, 25]);
      const pts = data(d, X, Y, n, 1, (p) => { const m = cnt(p, (x, y) => x === y); return m >= 3 && m <= 7 && (k === 0 || (m * 100) % n === 0); }, 1.5);
      const hit = pts.filter(([x, y]) => x === y), m = hit.length;
      const ask = `${wa(c.a)} ${subj(c.b)} 같은 ${c.who}`;
      const explain = `두 변량이 같은 점은 두 점 ${ptj([X.lo, X.lo], '과/와')} ${ptj([X.hi, X.hi], '을/를')} 잇는 대각선 위에 있다. ${list(hit)}의 ${m}개이다.`;
      if (k === 0) return N(`${intro(c, n)} ${topic(ask)} 몇 ${c.cnt}인가?`, m, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }), explain, facts: { calc: [[ones(m), 0]], unseen: [1] } });
      return N(`${intro(c, n)} ${topic(ask)} 전체의 몇 %인가?`, m * 100 / n, { unit: ' %', figure: scatter({ X, Y, pts, square: true }), explain: explain + ` ${m} ÷ ${n} × 100 = ${m * 100 / n}(%)이다.`, facts: { calc: [[`(${ones(m)})*100/${n}`, 0]], unseen: [1, 100] } });
    }, { count: 2 }),
    T('cmp-more', '한 변량이 다른 변량보다 큰 점의 수', '①14', (d) => {
      const { c, X, Y } = same(d), n = d.int(15, 20), upper = d.bool();
      const pts = data(d, X, Y, n, 1, (p) => { const a = cnt(p, (x, y) => y > x), b = cnt(p, (x, y) => y < x); return cnt(p, (x, y) => x === y) >= 2 && a >= 3 && b >= 3 && a !== b; }, 1.7);
      const hit = pts.filter(([x, y]) => (upper ? y > x : y < x)), m = hit.length;
      const ask = upper ? `${subj(c.b)} ${c.a}보다 ${c.high}` : `${subj(c.a)} ${c.b}보다 ${c.high}`;
      return N(`${intro(c, n)} ${ask} ${howMany(c)}`, m, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }),
        explain: `${upper ? '세로' : '가로'}의 값이 더 큰 점은 두 값이 같은 점을 이은 대각선보다 ${upper ? '위쪽' : '아래쪽'}에 있다(대각선 위의 점은 넣지 않는다). ${list(hit)}의 ${m}개이다.`,
        facts: { calc: [[ones(m), 0]], unseen: [1] } });
    }),
    T('cmp-up-ratio', '한 변량이 다른 변량보다 큰 점의 비율', '①15', (d) => {
      const { c, X, Y } = sameOf(d, SAME.filter((s) => s.up)), n = d.pick([10, 12, 15, 16, 18, 20, 24, 25, 30]);
      const pts = data(d, X, Y, n, 1, (p) => { const m = cnt(p, (x, y) => y > x); return cnt(p, (x, y) => x === y) >= 2 && m >= 2 && m <= n - 3 && gcd(m, n) > 1; }, 1.7);
      const hit = pts.filter(([x, y]) => y > x), m = hit.length, g = gcd(m, n);
      return F(`${intro(c, n)} ${c.up} ${c.who}의 비율은?`, m / g, n / g, { anyForm: true, figure: scatter({ X, Y, pts, square: true }),
        explain: `${subj(c.b)} ${c.a}보다 큰 점은 두 값이 같은 점을 이은 대각선보다 위쪽에 있는 점이다(대각선 위의 점은 넣지 않는다). ${list(hit)}의 ${m}개이므로 비율은 ${m}/${n}${g > 1 ? ` = ${m / g}/${n / g}` : ''}이다.`,
        facts: { value: `(${ones(m)})/${n}`, unseen: [1] } });
    }),
    T('cmp-mean-is', '두 변량의 평균이 c인 점의 수', '①16', (d) => {
      // 평균이 c 인 점은 합이 2c 인 점이고, 오른쪽 아래로 향하는 한 직선 위에 놓인다.
      const { c, X, Y } = same(d, true), n = d.int(15, 20);
      let t;
      const pts = data(d, X, Y, n, 1, (p) => { t = d.int(X.lo + 3, X.hi - 3); const m = cnt(p, (x, y) => x + y === 2 * t); return m >= 2 && m <= 5 && cnt(p, (x, y) => Math.abs(x + y - 2 * t) === 1) >= 2 && cnt(p, (x, y) => x === t && y === t) <= 1; }, 1.4);
      const hit = pts.filter(([x, y]) => x + y === 2 * t), m = hit.length;
      return N(`${intro(c, n)} ${wa(c.a)} ${c.b}의 평균이 ${amt(t, c.u)}인 ${howMany(c)}`, m, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }),
        explain: `두 변량의 평균이 ${t}이면 두 변량의 합이 ${2 * t}이다. 합이 ${2 * t}인 점은 두 점 ${ptj(sumEnds(X, 2 * t)[0], '과/와')} ${ptj(sumEnds(X, 2 * t)[1], '을/를')} 잇는 직선 위에 있다. ${list(hit)}의 ${m}개이다.`,
        facts: { calc: [[ones(m), 0]], unseen: [1] } });
    }),
    T('cmp-sum-atleast', '두 변량의 합이 c 이상인 점의 수', '심7', (d) => {
      const { c, X, Y } = same(d), n = d.int(16, 24);
      let s;
      const pts = data(d, X, Y, n, 1, (p) => { s = X.lo + Y.lo + d.int(Math.ceil(cells(X) * 0.9), Math.floor(cells(X) * 1.5)) * X.step; const m = cnt(p, (x, y) => x + y >= s); return m >= 4 && m <= n - 4 && cnt(p, (x, y) => x + y === s) >= 2; }, 1.4);
      const hit = pts.filter(([x, y]) => x + y >= s), m = hit.length;
      return N(`${intro(c, n)} ${wa(c.a)} ${obj(c.b)} 합하여 ${amt(s, c.u)} 이상인 ${howMany(c)}`, m, { unit: c.cnt, figure: scatter({ X, Y, pts, square: true }),
        explain: `합이 ${s}인 점은 오른쪽 아래로 향하는 한 직선 위에 있다. 그 직선 위의 점과 그보다 오른쪽 위에 있는 점을 센다. ${list(hit)}의 ${m}개이다.`,
        facts: { calc: [[ones(m), 0]], unseen: [1] } });
    }),
    T('cmp-diff-who', 'A~E 가운데 두 변량의 차가 가장 큰 사람', '①17', (d) => {
      // 이름 붙은 다섯 점의 두 변량의 차는 모두 다르고, 가장 큰 것이 한 눈금 넘게 앞선다. 대각선 위의 점에는 이름을 붙이지 않는다.
      const { c, X, Y } = same(d), n = d.int(14, 18), names = ['A', 'B', 'C', 'D', 'E'];
      // 답인 점을 먼저 고르고, 차가 그보다 한 눈금 작은 점(대각선의 반대쪽)과 더 작은 점 셋을 고른다.
      let marks;
      const diff = ([x, y]) => Math.abs(x - y);
      const pts = data(d, X, Y, n, 1, (p) => {
        const off = p.filter(([x, y]) => x !== y), big = d.pick(off), top = diff(big);
        if (top < 2 * X.step) return false;
        const rival = off.filter((q) => diff(q) === top - X.step && Math.sign(q[1] - q[0]) !== Math.sign(big[1] - big[0])), rest = off.filter((q) => diff(q) < top - X.step);
        if (!rival.length || rest.length < 3) return false;
        marks = d.shuffle([big, d.pick(rival)].concat(d.shuffle(rest).slice(0, 3)));
        return true;
      }, 1.8);
      const at = marks.map(([x, y]) => Math.abs(x - y)).indexOf(Math.max(...marks.map(([x, y]) => Math.abs(x - y))));
      const said = marks.map(([x, y], i) => `${names[i]}: ${Math.max(x, y)} − ${Math.min(x, y)} = ${Math.abs(x - y)}`).join(', ');
      return C(`${intro(c, n)} ${c.who} A, B, C, D, E 가운데 ${wa(c.a)} ${c.b}의 차가 가장 큰 ${topic(c.who)}?`, names, at, {
        figure: scatter({ X, Y, pts, square: true, marks: marks.map(([x, y], i) => ({ x, y, name: names[i] })) }),
        explain: `두 점수의 차를 구하면 ${said}이다. 차가 가장 큰 것은 ${names[at]}이다(두 값이 같은 점을 이은 대각선에서 가장 멀리 떨어진 점).`,
        facts: { choose: { exprs: marks.map(([x, y]) => `${Math.max(x, y)}-${Math.min(x, y)}`), rule: 'max' } }
      });
    })
  ];

  B.addUnit({
    id: '9-2-6', grade: 9, semester: 2, no: 6, title: '산점도와 상관관계', version: 1,
    groups: [
      { id: 'plot', title: '산점도 그리기와 읽기', standard: STD, types: PLOT },
      { id: 'count', title: '조건을 만족시키는 점의 수와 비율', standard: STD, types: COUNT },
      { id: 'compare', title: '두 변량의 비교', standard: STD, types: COMPARE },
      { id: 'mean', title: '조건에 맞는 자료의 평균과 대푯값', standard: STD, types: [] },
      { id: 'kind', title: '상관관계의 종류', standard: STD, types: [] },
      { id: 'situ', title: '상황과 상관관계', standard: STD, types: [] },
      { id: 'read', title: '상관관계로 산점도 해석하기', standard: STD, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(9-2-6b.js, 9-2-6c.js)이 함께 쓰는 도구
  B.kit.m926 = {
    STD, sourceOf, T, sum, cnt, ones, gcd, corr, fit, subj, topic, obj, wa, amt, REL, test, ptx, ptj, idx, sumEnds, list, howMany, PAIR, SAME, scaleOf, cells, pairOf, sameOf, intro,
    gridSet, shapeOk, data, scatter, shapePts, shapeFig, figOpt, figRow, pairTable, HAN, bogi, comboChoice, inner, cond, same
  };
})(typeof window !== 'undefined' ? window : globalThis);
