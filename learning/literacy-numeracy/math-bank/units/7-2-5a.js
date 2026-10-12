// 중학교 1학년 2학기 5단원 자료의 정리와 해석 — 단원 틀·그림 도구와 앞쪽 묶음(대푯값, 줄기와 잎 그림, 도수분포표).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1·2: 85·97꼴, 심화꼴 68꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-2-5/싣기_대조표.md 에 있다.
// (히스토그램·도수분포다각형·상대도수 묶음은 7-2-5b.js 에, 실력 문항은 7-2-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 자료와 가능성. 성취기준은 9수04-01(중앙값·최빈값, 알맞은 대푯값), 9수04-02(줄기와 잎 그림·도수분포표·히스토그램·도수분포다각형), 9수04-03(상대도수와 그 분포)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(자료 나열 / 줄기와 잎 그림 / 도수분포표 / 히스토그램 / 도수분포다각형 / 상대도수의 분포표·그래프 / 두 집단)과
//    묻는 것(대푯값 / 계급의 크기·개수 / 도수 / 범위의 수와 비율 / 가려진 칸 / 설명의 옳고 그름)이 다를 때만 따로 싣는다. 소재와 수만 다른 것은 한 번만 싣는다.
//  - 평균은 초등 5학년 「평균과 가능성」에서 배웠다. 평균만 구하는 문제는 싣지 않고, 중앙값·최빈값과 함께 구하거나 견주는 꼴 안에서만 쓴다.
//  - 답: 중앙값은 유형(차례)마다 늘 자연수이거나 늘 「.5」로 끝나는 소수가 되게 수를 고른다. 상대도수는 소수 둘째 자리까지이고, 백분율은 「 %」 단위를 단 자연수로 받는다.
//    최빈값이 여럿이거나 낱말인 꼴, 계급(○ 이상 ○ 미만)을 답하는 꼴은 고르기로 받는다. 음수가 없는 단원이므로 부호 단추는 달지 않는다.
//  - 용어는 교육과정의 것(변량, 대푯값, 중앙값, 최빈값, 줄기와 잎 그림, 계급, 계급의 크기, 도수, 도수분포표, 히스토그램, 도수분포다각형, 상대도수)만 쓴다.
//    「계급값」은 교수·학습 상황에서만 쓰는 말이므로 묻지 않는다. 산포도·분산·편차는 중학교 3학년 내용이다.
//  - 교육과정: 「상대도수는 도수의 총합이 다른 두 집단의 분포를 비교하는 상황에서 간단히 다루고, 상대도수의 필요성과 유용성을 인식하게 한다.」
//    상대도수는 구하기, 도수의 총합 = 도수 ÷ 상대도수, 분포표의 빈칸 한두 칸, 그래프 읽기, 총합이 다른 두 집단 견주기까지 싣는다.
//  - 그림: 그래프에서 읽는 값은 모두 눈금 선 위에 놓인다. 그림 설명(aria-label)에 축의 양, 계급, 계급마다의 높이(가려진 것은 「가려져 있다」)를 적었다.
//    수집본의 뽑은 글에는 그래프가 없어, 미래엔 2022 평가 자료와 2015 교과서의 쪽 그림에서 생김새(모눈 위에 붙은 막대, 가로축의 계급 끝 값과 물결 표시,
//    양 끝을 가로축에 이은 꺾은선, 실선·점선으로 겹친 두 집단, 윗부분이 찢긴 그래프, 「줄기 | 잎」 표와 읽는 법 줄)를 보고 지었다. 수와 상황은 모두 새로 정했다.
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-2-5b.js, 7-2-5c.js 의 것까지 여기에 모아 적는다)
//  - 초등 5학년 「평균과 가능성」과 같은 일: 평균만 구하기(①1 ②3), 두 사람의 평균 견주기(②4), 두 집단 평균의 차(심8), 평균으로 빠진 변량만 구하기(②5 심12 — 그 뒤에 중앙값을 묻는 실력 문항으로 실었다),
//    변량이 문자식인 평균(①8 — 방정식 풀이가 일의 전부).
//  - 조건 여럿을 풀어 변량 둘·셋을 찾거나 경우를 갈라 맞춰 보는 것: ①11, ②16·18·19·20, 심16·21·22·23·24. 문자식으로 요령껏 묶는 것: 심26·68.
//  - 뜻 없는 셈: 두 자료의 중앙값의 합(①4의 변형), 대푯값끼리의 합·차(②13), 빈 잎의 합(①17 심28 — 빈칸마다 따로 묻는다), 계급의 두 끝 값과 도수의 합(②66의 변형).
//  - 「계급값」(②50), 흩어진 정도 견주기(심51 — 중3), 공학 도구 과제(②96·97), 답이 하나로 정해지지 않는 표 만들기(②38), 서술형으로만 할 수 있는 것(②94 — 분포의 특징은 설명 가리기 문항의 보기로 실었다).
//  - 「상대도수는 간단히」에 어긋나는 것: 찢어지거나 가려진 상대도수 그래프·표에 조건을 붙여 거꾸로 푸는 것(①85 ②87 심55·59·64·65), 두 집단을 합친 상대도수(심67),
//    총합의 비와 도수의 비로 상대도수의 비(심66), 분수 상대도수에서 공배수로 총합 찾기(심56). 찢어진 히스토그램·다각형에 조건을 두 겹 붙인 것(심48).
//    한 칸이 가려져 「상대도수의 총합은 1」 한 번으로 풀리는 것, 도수 하나와 그 상대도수로 총합을 구해 다른 칸을 채우는 것은 실었다.
//  - 쪽 그림에서도 그림을 알 수 없고 수를 되살릴 수 없는 것: ①57(같은 얼개는 「가려진 두 도수의 차」로 실었다), ②91(상대도수가 같은 계급의 도수는 표로 실었다).
//  - 같은 일이어서 한 번만 실은 것: 두 자료의 대푯값을 견준 보기(심7 — 한 자료의 설명 가리기와 같다), 세 대푯값의 크기 견주기(심4 — 셋을 모두 구하는 문항과 같다),
//    히스토그램에서 몇 번째인 변량의 계급(①42 — 표·도수분포다각형·상대도수 그래프에서 묻는다), 계급의 크기가 다른 두 표(②49 — 이웃한 계급을 묶는 문항으로 실었다),
//    두 집단마다 총합을 거꾸로 구해 견주기(②92 — 총합 구하기와 두 집단의 도수 견주기를 따로 실었다), 반올림하여 어림한 비율 견주기(①69의 변형).
//  - 직접 그리는 꼴(줄기와 잎 그림·표·히스토그램·도수분포다각형·상대도수 그래프 그리기)은 빈칸 수, 고르기, 직사각형의 가로·세로로 바꾸어 실었다.
//  - 그림이 필요해 미룬 것은 없다. 히스토그램·도수분포다각형·상대도수 그래프(두 집단, 찢어진 그림, 눈금의 수가 없는 그림)와 줄기와 잎 그림은 이 파일의 그림 함수로 그렸다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, numbers, tagged, table, N, M, C, D } = B.kit;
  const { LAB, range, tail, V, claimQ, f1 } = B.kit.mid;
  const STD1 = '9수04-01', STD2 = '9수04-02', STD3 = '9수04-03';
  const sourceOf = (ref) => (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});

  // ── 셈 ──
  const sum = (a) => a.reduce((s, v) => s + v, 0), srt = (a) => a.slice().sort((x, y) => x - y);
  const median = (a) => { const s = srt(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const tallyOf = (a) => { const m = new Map(); a.forEach((v) => m.set(v, (m.get(v) || 0) + 1)); return m; };
  const topCount = (a) => Math.max(...tallyOf(a).values());
  const modes = (a) => { const m = tallyOf(a), top = Math.max(...m.values()); return [...m.keys()].filter((v) => m.get(v) === top).sort((x, y) => (x > y ? 1 : -1)); };
  // 검사 근거에는 답을 구한 길과 다른 길로 구한 값을 적는다.
  //  크기순으로 r번째인 값: 그 값보다 작은 변량이 r개보다 적고 그 값 이하인 변량이 r개 이상인 값.
  const nth = (a, r) => a.find((v) => a.filter((x) => x < v).length < r && a.filter((x) => x <= v).length >= r);
  //  하나뿐인 최빈값: 어느 값보다도 적게 나오지 않는 값.
  const modeAlt = (a) => a.find((v) => a.every((w) => a.filter((x) => x === v).length >= a.filter((x) => x === w).length));
  const many = (d, n, lo, hi) => Array.from({ length: n }, () => d.int(lo, hi));
  const sameList = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
  const isSorted = (a) => sameList(a, srt(a)) || sameList(a, srt(a).reverse());

  // ── 수와 단위를 적는 글 ──
  // 수는 소수 셋째 자리까지(7.5, 0.25). 소수 뒤 토씨는 끝자리 숫자를 읽는 소리에 맞춘다.
  const fx = (x) => String(Math.round(x * 1000) / 1000);
  const nj = (x, pair) => fx(x) + tail(Number(fx(x).slice(-1)), pair);
  // 단위 기호는 수와 띄어 쓰고(150 cm, 25 %), 우리말 단위는 붙여 쓴다(20분). 토씨는 단위를 읽는 끝소리에 맞춘다.
  const SOUND = { cm: '터', m: '터', mm: '터', kg: '램', g: '램', '%': '트' };
  const amt = (v, u) => fx(v) + (/^[A-Za-z%]/.test(u) ? ' ' : '') + u;
  const ut = (u, pair) => { const w = SOUND[u] || u; return josa(w, pair).slice(w.length); };
  const amtj = (v, u, pair) => amt(v, u) + ut(u, pair);
  const wj = (word, pair) => josa(word, pair);
  const pctOf = (part, whole) => part * 100 / whole;

  // ── 소재 ──
  // 낱낱의 자료(작은 수): 대푯값 문항에 쓴다.
  const RAWS = [
    { what: '턱걸이 횟수', unit: '회', lo: 2, hi: 15 }, { what: '일주일 동안 읽은 책의 수', unit: '권', lo: 1, hi: 12 }, { what: '하루 수면 시간', unit: '시간', lo: 5, hi: 11 },
    { what: '한 달 동안 도서관에 간 횟수', unit: '회', lo: 1, hi: 14 }, { what: '제기차기 기록', unit: '개', lo: 3, hi: 20 }, { what: '농구 자유투 성공 횟수', unit: '회', lo: 2, hi: 16 },
    { what: '일주일 동안의 운동 시간', unit: '시간', lo: 1, hi: 13 }, { what: '하루 동안 받은 문자 메시지의 수', unit: '개', lo: 4, hi: 24 }
  ];
  // 다른 변량과 크게 차이 나는 값이 하나 끼어도 어색하지 않은 소재(far: 그 값의 범위)
  const FARS = [
    { what: '통학 시간', unit: '분', lo: 8, hi: 20, far: [65, 90] }, { what: '하루 동안 받은 문자 메시지의 수', unit: '개', lo: 4, hi: 18, far: [80, 120] },
    { what: '한 달 동안 읽은 책의 수', unit: '권', lo: 1, hi: 8, far: [30, 45] }, { what: '1분 동안의 줄넘기 횟수', unit: '회', lo: 25, hi: 45, far: [140, 180] }
  ];
  const rawIntro = (c, n) => `다음은 학생 ${n}명의 ${wj(c.what, '을/를')} 조사하여 나타낸 자료이다.`;
  // 두 자리 수 자료: 줄기와 잎 그림에 쓴다. stems: 첫 줄기로 삼을 수.
  const STEMS = [
    { what: '줄넘기 횟수', unit: '회', stems: [1, 2, 3], big: '많은', small: '적은' }, { what: '수학 점수', unit: '점', stems: [5, 6], big: '높은', small: '낮은' },
    { what: '통학 시간', unit: '분', stems: [0, 1], big: '긴', small: '짧은' }, { what: '키', unit: 'cm', stems: [13, 14], big: '큰', small: '작은' },
    { what: '윗몸 말아 올리기 횟수', unit: '회', stems: [1, 2], big: '많은', small: '적은' }, { what: '하루 동안 읽은 책의 쪽수', unit: '쪽', stems: [2, 3, 4], big: '많은', small: '적은' },
    { what: '하루 동안 보낸 문자 메시지의 수', unit: '개', stems: [0, 1], big: '많은', small: '적은' }
  ];
  // 계급으로 나누는 자료: frames 는 [첫 계급의 작은 끝 값, 계급의 크기].
  const GC = [
    { what: '통학 시간', short: '통학 시간', unit: '분', big: '긴', small: '짧은', frames: [[10, 10], [5, 5], [10, 5]] },
    { what: '키', short: '키', unit: 'cm', big: '큰', small: '작은', frames: [[140, 5], [145, 5]] },
    { what: '수학 점수', short: '점수', unit: '점', big: '높은', small: '낮은', frames: [[40, 10], [50, 10]], max: 100 },
    { what: '줄넘기 횟수', short: '횟수', unit: '회', big: '많은', small: '적은', frames: [[20, 10], [30, 10], [20, 20]] },
    { what: '일주일 동안의 독서 시간', short: '독서 시간', unit: '시간', big: '긴', small: '짧은', frames: [[2, 2], [4, 2], [3, 3]] },
    { what: '가방의 무게', short: '무게', unit: 'kg', big: '무거운', small: '가벼운', frames: [[2, 1], [3, 1]] },
    { what: '1분 동안의 맥박 수', short: '맥박 수', unit: '회', big: '많은', small: '적은', frames: [[60, 5], [65, 5]] },
    { what: '한 달 동안 읽은 책의 수', short: '책의 수', unit: '권', big: '많은', small: '적은', frames: [[2, 2], [4, 4]] },
    { what: '봉사 활동 시간', short: '봉사 시간', unit: '시간', big: '긴', small: '짧은', frames: [[4, 4], [5, 5]] },
    { what: '하루 운동 시간', short: '운동 시간', unit: '분', big: '긴', small: '짧은', frames: [[20, 10], [30, 30], [20, 20]] }
  ].map((c) => Object.assign({ who: '학생', cnt: '명' }, c));

  // ── 계급과 도수 ──
  // 도수 k개(합 total). o.lo·o.hi: 도수 하나의 범위, o.step: 도수가 모두 step의 배수, o.flat: 가운데가 높은 모양이 아니어도 된다.
  function freqs(d, k, total, ok, o) {
    const opt = o || {}, step = opt.step || 1, t = total / step, lo = opt.lo == null ? 1 : opt.lo, hi = opt.hi || Math.max(4, Math.round(t * 0.42));
    return d.until(() => { const f = []; let left = t; for (let i = 0; i < k - 1; i += 1) { const v = d.int(lo, hi); f.push(v); left -= v; } f.push(left); return f.map((v) => v * step); }, (f) => {
      if (f[k - 1] < lo * step || f[k - 1] > hi * step) return false;
      // 가운데가 높은 산 모양: 가장 큰 도수가 양 끝 계급에 있지 않고, 그 앞에서는 줄지 않으며 그 뒤에서는 늘지 않는다.
      const peak = f.indexOf(Math.max(...f)), hill = peak > 0 && peak < k - 1 && f.every((v, i) => i === 0 || (i <= peak ? v >= f[i - 1] : v <= f[i - 1]));
      return (opt.flat || hill) && (!ok || ok(f));
    });
  }
  // 계급의 틀과 도수를 묶은 것. at(i): i번째 경계값, cls(i): 「10분 이상 20분 미만」, below(j): at(j) 미만인 도수의 합, above(j): at(j) 이상인 도수의 합.
  function grp(c, lo, size, f) {
    const at = (i) => lo + i * size, g = { c, lo, size, f, k: f.length, total: sum(f), at, u: c.unit };
    g.cls = (i) => `${amt(at(i), c.unit)} 이상 ${amt(at(i + 1), c.unit)} 미만`;
    g.below = (j) => sum(f.slice(0, j)); g.above = (j) => sum(f.slice(j));
    return g;
  }
  // 소재의 틀 가운데 계급 k개가 그 소재의 가장 큰 값(max)을 넘지 않는 것을 고른다(수학 점수는 100점까지).
  const frameOf = (d, c, k) => d.pick(c.frames.filter(([lo, size]) => lo + k * size <= (c.max || 1e9)));
  // o: { c 소재, ctx 소재 목록, k 계급의 개수, total 도수의 총합, ok(f) 조건, lo, hi, step, flat }
  function newGrp(d, o) {
    const c = o.c || d.pick(o.ctx || GC), k = o.k || d.pick([5, 6]), [lo, size] = o.frame || frameOf(d, c, k);
    return grp(c, lo, size, freqs(d, k, o.total, o.ok, o));
  }
  // 한 반의 학생 수로 보기 어려운 수(36명 초과)는 「어느 중학교 1학년 학생」으로 적는다.
  const introG = (g, kind, o) => `다음은 ${o && o.noTotal ? '어느 반 ' + g.c.who + '들' : (g.total > 36 ? '어느 중학교 1학년 ' : '어느 반 ') + g.c.who + ' ' + g.total + g.c.cnt}의 ${wj(g.c.what, '을/를')} 조사하여 나타낸 ${kind}이다.`;
  // 계급 i 의 안쪽에 있는 값(경계값이 아니다). 계급의 크기가 1이면 소수 첫째 자리 수를 쓴다(3.5 kg).
  const inside = (g, i) => g.at(i) + (g.size === 1 ? 0.5 : Math.floor(g.size / 2));
  // 계급을 보기로 늘어놓는다(계급이 여섯을 넘지 않으므로 모두 싣는다).
  const classOptions = (g) => range(0, g.k - 1).map((i) => g.cls(i));

  // ── 그림 ──
  // 늘어놓은 자료. 단위는 오른쪽 위에 적는다.
  const dataFig = (list, unit) => '<div style="display:grid;gap:4px;max-width:100%">' + (unit ? `<div style="text-align:right;font-size:0.88rem;color:#52606d">(단위: ${unit})</div>` : '') + numbers(list) + '</div>';
  // 표는 엔진의 table 로 그린다. o.tight: 칸이 셋 이상인 표는 휴대폰 너비에 들어가게 글씨와 여백을 줄여 같은 틀로 그린다.
  function tbl(head, rows, o) {
    if (!(o && o.tight)) return table(head, rows);
    const st = ' style="padding:5px 6px;font-size:0.93rem"', line = (cells, tag) => '<tr>' + cells.map((cell) => `<${tag}${st}>${cell}</${tag}>`).join('') + '</tr>';
    return '<div class="mb-table-wrap"><table class="mb-table"><thead>' + line(head, 'th') + '</thead><tbody>' + rows.map((row) => line(row, 'td')).join('') + '</tbody></table></div>';
  }
  const SUP = (word) => `<sup style="font-size:0.62em">${word}</sup>`;
  // 계급 칸: 첫 줄에만 이상·미만을 적는다(교과서 표기).
  const clsCell = (g, i) => (i === 0 ? `${fx(g.at(0))}${SUP('이상')} ~ ${fx(g.at(1))}${SUP('미만')}` : `${fx(g.at(i))} ~ ${fx(g.at(i + 1))}`);
  // 도수분포표. o.cells: 도수 칸에 적을 글(주지 않으면 도수), o.total: 합계 칸의 글, o.first: { 줄 번호: 계급 칸의 글 }, o.head: 도수 열의 이름,
  //  o.more: [{ head, cells, total }] 덧붙이는 열(상대도수, 둘째 집단), o.noCount: 도수 열을 싣지 않는다, o.note: 표 위 오른쪽에 적는 단위(두 집단의 도수를 나란히 적을 때 「명」).
  function ftab(g, o) {
    const opt = o || {}, cells = opt.cells || g.f, more = opt.more || [], cols = (opt.noCount ? 0 : 1) + more.length;
    const rows = range(0, g.k - 1).map((i) => [opt.first && opt.first[i] != null ? opt.first[i] : clsCell(g, i)].concat(opt.noCount ? [] : [cells[i]], more.map((m) => m.cells[i])));
    rows.push(['합계'].concat(opt.noCount ? [] : [opt.total != null ? opt.total : g.total], more.map((m) => m.total)));
    const made = tbl([`${g.c.short}(${g.c.unit})`].concat(opt.noCount ? [] : [opt.head || (cols > 1 ? `도수(${g.c.cnt})` : `${g.c.who} 수(${g.c.cnt})`)], more.map((m) => m.head)), rows, { tight: cols > 1 });
    return opt.note ? `<div style="display:grid;gap:3px;max-width:100%"><div style="text-align:right;font-size:0.88rem;color:#52606d">(단위: ${opt.note})</div>${made}</div>` : made;
  }
  // 줄기와 잎 그림. rows: [[줄기, [잎, …]], …] — 잎은 수이거나 가린 칸의 이름표(글). o.unit, o.torn: 아래쪽이 찢어져 보이지 않는다.
  // 그림 설명에는 줄기마다의 변량을 그대로 적는다(검사와 화면 읽기가 그 글로 값을 읽는다).
  const leafSpan = (v) => `<span style="display:inline-block;min-width:1.12em;text-align:center">${typeof v === 'number' ? v : box(v)}</span>`;
  const keyLine = (rows, unit) => { const [s, leaves] = rows.find((r) => typeof r[1][0] === 'number'), l = leaves[0]; return `${s}|${l}${tail(l, '은/는')} ${amt(s * 10 + l, unit)}`; };
  function stemFig(rows, o) {
    const key = keyLine(rows, o.unit);
    const said = rows.map(([s, leaves]) => `줄기 ${s}: ${leaves.length ? leaves.map((v) => (typeof v === 'number' ? s * 10 + v : s + (v || '□'))).join(', ') : '잎 없음'}`).join(' / ');
    return `<div style="display:grid;gap:3px;max-width:100%"><div style="text-align:right;font-size:0.88rem;color:#52606d">(${key})</div><div class="mb-table-wrap"><table class="mb-table" aria-label="줄기와 잎 그림(${key}). ${said}${o.torn ? ' / 그 아래는 찢어져 보이지 않는다' : ''}"><thead><tr><th>줄기</th><th>잎</th></tr></thead><tbody>`
      + rows.map(([s, leaves]) => `<tr><td>${s}</td><td style="text-align:left;background:#fff;font-weight:400">${leaves.map(leafSpan).join('')}</td></tr>`).join('')
      + (o.torn ? '<tr><td colspan="2" style="background:repeating-linear-gradient(135deg,#eef2f6 0 6px,#fff 6px 12px);color:#52606d;font-size:0.85rem;font-weight:400">찢어진 부분</td></tr>' : '')
      + '</tbody></table></div></div>';
  }
  // 두 집단을 나란히 놓은 줄기와 잎 그림. rows: [[줄기, [왼쪽 잎…], [오른쪽 잎…]], …](잎은 작은 수부터), names: [왼쪽 이름, 오른쪽 이름].
  // 왼쪽 잎은 줄기에서 멀어질수록 커지게 적는다.
  function stemFig2(rows, names, unit) {
    const [s0, , right0] = rows.find((r) => r[2].length), key = `${s0}|${right0[0]}${tail(right0[0], '은/는')} ${amt(s0 * 10 + right0[0], unit)}`;
    const side = (s, leaves) => (leaves.length ? leaves.map((v) => s * 10 + v).join(', ') : '잎 없음');
    const said = rows.map(([s, left, right]) => `줄기 ${s}: ${names[0]} ${side(s, left)}, ${names[1]} ${side(s, right)}`).join(' / ');
    const cell = (leaves, align) => `<td style="text-align:${align};background:#fff;font-weight:400;padding-left:6px;padding-right:6px">${leaves.map(leafSpan).join('')}</td>`;
    return `<div style="display:grid;gap:3px;max-width:100%"><div style="text-align:right;font-size:0.88rem;color:#52606d">(${key})</div><div class="mb-table-wrap"><table class="mb-table" aria-label="두 집단을 나란히 놓은 줄기와 잎 그림(${key}). ${said}"><thead><tr><th>잎(${names[0]})</th><th>줄기</th><th>잎(${names[1]})</th></tr></thead><tbody>`
      + rows.map(([s, left, right]) => `<tr>${cell(left.slice().reverse(), 'right')}<td style="background:var(--canvas);font-weight:600">${s}</td>${cell(right, 'left')}</tr>`).join('') + '</tbody></table></div></div>';
  }
  // 줄기와 잎 그림에 쓸 자료. counts: 줄기마다의 잎의 수. 돌려주는 것: rows [[줄기, [잎…]]], values(작은 값부터).
  function stemData(d, s0, counts) {
    const rows = counts.map((n, i) => [s0 + i, srt(many(d, n, 0, 9))]);
    return { rows, values: rows.reduce((all, [s, leaves]) => all.concat(leaves.map((l) => s * 10 + l)), []) };
  }

  // 히스토그램·도수분포다각형·상대도수의 분포를 나타낸 그래프.
  //  o.g: 계급의 틀(grp). o.bars: 막대의 높이(히스토그램). o.lines: [{ values, name }] 꺾은선 — 계급의 가운데에 점을 찍고 양 끝을 가로축 위의 점에 잇는다.
  //  o.rel: 세로축이 상대도수(값은 백분의 몇으로 준다: 0.25 → 25). o.ystep: 가는 눈금 한 칸의 값(기본 1, 상대도수는 2 → 0.02).
  //  o.torn: 가려진 계급의 번호들(막대는 윗부분이 찢기고, 꺾은선은 그 점과 양옆 선분이 찢긴 조각에 가려진다). o.noScale: 세로축에 수를 적지 않는다.
  // 그림 설명에 축의 양과 계급마다의 높이를 적는다. 가려진 계급은 「가려져 있다」고 적는다.
  const INK = ['#1d4ed8', '#c2410c'];
  function chart(o) {
    const g = o.g, c = g.c, k = g.k, rel = Boolean(o.rel), bars = o.bars || null, series = o.lines || [], torn = o.torn || [], isTorn = (i) => torn.includes(i);
    const vals = (bars || []).concat(...series.map((s) => s.values)), ystep = o.ystep || (rel ? 2 : 1);
    let n = Math.ceil(Math.max(...vals) / ystep);
    const major = o.ymajor || (rel ? 10 / ystep : n > 8 ? 2 : 1);
    n = (Math.ceil(n / major) + (torn.length ? 1 : 0)) * major;
    const unitW = 6 + (c.unit.length + 2) * (/^[A-Za-z]/.test(c.unit) ? 6.4 : 11), L = rel ? 30 : 26;
    const cw = Math.min(32, (286 - L - unitW) / (k + 1.7)), gap = cw * 0.85, gh = Math.max(6, Math.min(13, 132 / n)), top = series.length > 1 ? 34 : 24, base = top + n * gh;
    const xb = (i) => L + gap + i * cw, xm = (i) => xb(i) + cw / 2, xEnd = xb(k) + cw * 0.85, W = xEnd + unitW, H = base + 24, Y = (v) => base - v / ystep * gh;
    const lab = (x, y, anchor, text, size) => `<text class="mb-axis-label" style="font-size:${size || 10.5}px" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${text}</text>`;
    const jag = (x, y, dx, dy, len) => { let p = ''; const steps = Math.max(2, Math.round(len / 7)); for (let i = 1; i <= steps; i += 1) p += `L${f1(x + dx * len * i / steps + (dy ? (i % 2 ? 2.6 : -2.6) : 0))} ${f1(y + dy * len * i / steps + (dx ? (i % 2 ? 2.6 : -2.6) : 0))}`; return p; };
    let out = '';
    for (let t = 0; t <= n; t += 1) out += `<line class="mb-gridline"${t % major === 0 ? ' style="stroke:#8fa3b8"' : ''} x1="${L}" y1="${f1(base - t * gh)}" x2="${f1(xEnd)}" y2="${f1(base - t * gh)}"/>`;
    for (let i = 0; i <= k; i += 1) out += `<line class="mb-gridline" x1="${f1(xb(i))}" y1="${top}" x2="${f1(xb(i))}" y2="${f1(base)}"/>`;
    out += `<line class="mb-gridline" x1="${f1(xEnd)}" y1="${top}" x2="${f1(xEnd)}" y2="${f1(base)}"/>`;
    const barOf = (v, i) => { const h = isTorn(i) ? base - top + 8 : v / ystep * gh; return `<rect x="${f1(xb(i))}" y="${f1(base - h)}" width="${f1(cw)}" height="${f1(h)}" style="fill:${series.length ? '#e6edf5' : '#cbd8e6'};stroke:#1f2933;stroke-width:1"/>`; };
    if (bars) {
      bars.forEach((v, i) => { if (isTorn(i)) out += barOf(v, i); });
      if (torn.length) {
        // 찢긴 조각: 가려진 막대들의 윗부분을 흰 조각으로 덮고 찢긴 금을 긋는다. 금의 높이는 가려진 도수의 0.6배쯤(가려진 도수보다 낮다).
        const a = Math.min(...torn), b = Math.max(...torn), low = Math.min(...torn.map((i) => bars[i])), yT = Y(Math.max(ystep, Math.floor(low * 0.6 / ystep) * ystep)) - 1;
        const xl = xb(a) - 0.6, xr = xb(b + 1) + 0.6, edge = `M${f1(xl)} ${f1(yT)}${jag(xl, yT, 1, 0, xr - xl)}`;
        out += `<path d="${edge}L${f1(xr)} 2L${f1(xl)} 2Z" style="fill:#fff;stroke:none"/><path d="${edge}" style="fill:none;stroke:#52606d;stroke-width:1.1;stroke-linejoin:round"/>`;
      }
      bars.forEach((v, i) => { if (!isTorn(i) && v > 0) out += barOf(v, i); });
    } else if (torn.length) {
      // 꺾은선의 찢긴 조각: 가려진 점의 양옆 점 사이를 세로로 길게 덮는다. 가려진 점에 닿는 선분은 긋지 않는다(기울기로 높이를 짐작하지 못하게).
      const a = Math.min(...torn), b = Math.max(...torn), xl = xm(a - 1) + 7, xr = xm(b + 1) - 7, yt = top - 6, len = base - 4 - yt;
      out += `<path d="M${f1(xl)} ${yt}${jag(xl, yt, 0, 1, len)}L${f1(xr)} ${f1(base - 4)}${jag(xr, base - 4, 0, -1, len)}Z" style="fill:#fff;stroke:#52606d;stroke-width:1.1;stroke-linejoin:round"/>`;
    }
    // 축, 0과 첫 계급 사이를 줄였다는 물결 표시, 눈금의 수
    out += `<line class="mb-axis" x1="${L}" y1="${top - 8}" x2="${L}" y2="${f1(base)}"/><line class="mb-axis" x1="${L}" y1="${f1(base)}" x2="${f1(xEnd)}" y2="${f1(base)}"/>`
      + `<rect x="${L + 3}" y="${f1(base - 1.5)}" width="7" height="3" style="fill:#fff"/><path d="M${L + 3} ${f1(base)}l1.8 -4l3.4 8l1.8 -4" style="fill:none;stroke:#1f2933;stroke-width:1"/>`;
    out += lab(L - 4, base + 4, 'end', 0);
    if (!o.noScale) for (let t = major; t <= n; t += major) out += lab(L - 4, base - t * gh + 3.6, 'end', rel ? fx(t * ystep / 100) : t * ystep);
    for (let i = 0; i <= k; i += 1) out += lab(xb(i), base + 13, 'middle', fx(g.at(i)));
    out += lab(xEnd + 3, base + 13, 'start', `(${c.unit})`) + lab(2, 11, 'start', rel ? '(상대도수)' : `(${c.cnt})`);
    series.forEach((s, si) => {
      const pts = [[xm(-1), base]].concat(s.values.map((v, i) => [xm(i), Y(v)]), [[xm(k), base]]), hid = (j) => j >= 1 && j <= k && isTorn(j - 1);
      let path = '';
      for (let j = 0; j < pts.length - 1; j += 1) if (!hid(j) && !hid(j + 1)) path += `M${f1(pts[j][0])} ${f1(pts[j][1])}L${f1(pts[j + 1][0])} ${f1(pts[j + 1][1])}`;
      out += `<path d="${path}" style="fill:none;stroke:${INK[si]};stroke-width:1.8;stroke-linecap:round${si ? ';stroke-dasharray:5 3' : ''}"/>`;
      pts.forEach((p, j) => { if (!hid(j)) out += `<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="2.6" style="fill:${INK[si]}"/>`; });
    });
    if (series.length > 1) {
      let lx = Math.max(rel ? 64 : 36, W - 4 - series.reduce((w, s) => w + 32 + s.name.length * 11.5, 0));
      series.forEach((s, si) => { out += `<line x1="${f1(lx)}" y1="9" x2="${f1(lx + 20)}" y2="9" style="stroke:${INK[si]};stroke-width:2${si ? ';stroke-dasharray:5 3' : ''}"/><text x="${f1(lx + 24)}" y="13" style="font-size:11.5px;font-weight:600;fill:#1f2933">${s.name}</text>`; lx += 32 + s.name.length * 11.5; });
    }
    const height = (v) => (rel ? fx(v / 100) : v + c.cnt), row = (values) => values.map((v, i) => `${g.cls(i)} ${isTorn(i) ? '가려져 있다' : height(v)}`).join(', ');
    const kind = bars && series.length ? '히스토그램과 도수분포다각형' : bars ? '히스토그램' : rel ? '상대도수의 분포를 나타낸 그래프' : '도수분포다각형';
    let said = `${kind}: 가로축은 ${c.what}(${c.unit}), 세로축은 ${rel ? '상대도수' : c.who + ' 수(' + c.cnt + ')'}. `;
    if (o.noScale) said += `세로축에 눈금의 수가 적혀 있지 않다. 막대의 높이는 ${bars.map((v, i) => `${g.cls(i)} ${v / ystep}칸`).join(', ')}.`;
    else if (series.length > 1) said += series.map((s, si) => `${s.name}(${si ? '점선' : '실선'}) — ${row(s.values)}`).join(' / ') + '.';
    else said += row(bars || series[0].values) + '.';
    if (series.length) said += ' 꺾은선의 양 끝은 가로축 위에 놓여 있다.';
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W)}" role="img" aria-label="${said}">${out}</svg>`;
  }
  const histFig = (g, o) => chart(Object.assign({ g, bars: g.f }, o || {}));
  const polyFig = (g, o) => chart(Object.assign({ g, lines: [{ values: g.f }] }, o || {}));
  const bothFig = (g, o) => chart(Object.assign({ g, bars: g.f, lines: [{ values: g.f }] }, o || {}));
  // 상대도수의 분포를 나타낸 그래프. r: 계급마다의 상대도수(백분의 몇).
  const relFig = (g, r, o) => chart(Object.assign({ g, rel: true, lines: [{ values: r }], ystep: r.every((v) => v % 5 === 0) ? 5 : 2 }, o || {}));
  const relFig2 = (g, a, b, names, o) => chart(Object.assign({ g, rel: true, lines: [{ values: a, name: names[0] }, { values: b, name: names[1] }], ystep: a.concat(b).every((v) => v % 5 === 0) ? 5 : 2 }, o || {}));
  // 상대도수(백분의 몇) k개: 합이 100이고 모두 step의 배수.
  const rels = (d, k, step, ok, o) => freqs(d, k, 100, ok, Object.assign({ step, hi: Math.floor(40 / step) }, o || {}));
  const r2 = (v) => fx(v / 100);

  // 설명 넷 가운데 하나를 고르는 문항. rows: [옳은 문장, 틀린 문장, 틀린 까닭] — 넷을 골라 wantTrue 이면 하나만 옳게, 아니면 하나만 틀리게 싣는다.
  function pickClaim(d, text, rows, wantTrue, o) {
    const four = d.shuffle(rows).slice(0, 4), at = d.int(0, 3), opt = o || {};
    const shown = four.map((r, i) => ((i === at) === wantTrue ? r[0] : r[1]));
    const why = wantTrue ? four.filter((r, i) => i !== at).map((r) => r[2]).join(' ') : four[at][2];
    return C(text, shown, at, { figure: opt.figure, explain: why, facts: { truth: four.map((r, i) => (i === at) === wantTrue), want: wantTrue } });
  }

  // ═══ 대푯값 ═══
  const REP = [
    T('rep-word', '대푯값·중앙값·최빈값의 뜻', '②1', (d) => {
      const rows = [['대푯값', '자료 전체의 중심적인 경향이나 특징을 대표적으로 나타내는 값'], ['중앙값', '자료의 변량을 작은 값부터 크기순으로 늘어놓았을 때 한가운데 있는 값'], ['최빈값', '자료의 변량 가운데 가장 많이 나타나는 값'], ['평균', '변량의 총합을 변량의 개수로 나눈 값']];
      const at = d.int(0, 2), options = d.shuffle(rows.map((r) => r[0]));
      return C('다음은 무엇을 설명한 것인가?', options, options.indexOf(rows[at][0]), { figure: lines([rows[at][1]]), explain: `${rows[at][1]}을 ${rows[at][0]}이라고 한다.`, facts: { truth: options.map((w) => w === rows[at][0]), want: true } });
    }),
    T('rep-median-odd', '변량의 개수가 홀수인 자료의 중앙값', '①2 ②7', (d) => {
      const c = d.pick(RAWS), n = d.pick([5, 7, 9]), mid = (n + 1) / 2;
      const list = d.until(() => many(d, n, c.lo, c.hi), (l) => new Set(l).size >= Math.min(n - 1, c.hi - c.lo - 1) && l[mid - 1] !== median(l) && !isSorted(l));
      const m = median(list);
      return N(`${rawIntro(c, n)} 이 자료의 중앙값은?`, m, { unit: c.unit, figure: dataFig(list, c.unit), explain: `변량을 작은 값부터 크기순으로 늘어놓으면 ${srt(list).join(', ')}이다. 변량이 ${n}개이므로 중앙값은 ${mid}번째 값인 ${amt(m, c.unit)}이다.`, facts: { calc: [[String(nth(list, mid)), 0]], rule: 'odd' } });
    }),
    T('rep-median-even', '변량의 개수가 짝수인 자료의 중앙값', '①3 ②8 심1', (d, n) => {
      // 차례 0: 가운데 두 값이 달라 중앙값이 자료에 없는 수(.5로 끝난다). 차례 1: 가운데 두 값이 같고, 다른 변량과 크게 차이 나는 값이 하나 끼어 있다.
      const c = d.pick(n === 0 ? RAWS : FARS), size = d.pick([6, 8]), h = size / 2;
      const list = d.until(() => { const l = many(d, size, c.lo, c.hi); if (n === 1) l[d.int(0, size - 1)] = d.int(c.far[0], c.far[1]); return l; }, (l) => { const s = srt(l); return !isSorted(l) && (n === 0 ? (s[h - 1] + s[h]) % 2 === 1 : s[h - 1] === s[h] && s[h - 2] !== s[h - 1] && s[h + 1] !== s[h] && s[size - 2] <= c.hi) && (l[h - 1] + l[h]) / 2 !== median(l); });
      const s = srt(list), a = nth(list, h), b = nth(list, h + 1), m = median(list);
      const text = `${rawIntro(c, size)} 이 자료의 중앙값은?`, explain = `변량을 작은 값부터 크기순으로 늘어놓으면 ${s.join(', ')}이다. 변량이 ${size}개이므로 중앙값은 ${h}번째 값과 ${h + 1}번째 값의 평균인 (${a} + ${b}) ÷ 2 = ${amt(m, c.unit)}이다.`;
      const o = { unit: c.unit, figure: dataFig(list, c.unit), explain, facts: { calc: [[`(${a}+${b})/2`, 0]], unseen: [2], rule: n === 0 ? 'evenHalf' : 'evenSame' } };
      return n === 0 ? D(text, m, o) : N(text, m, o);
    }, { count: 2 }),
    T('rep-mode-one', '최빈값이 하나인 자료의 최빈값', '①5 ②9', (d) => {
      const c = d.pick(RAWS), n = d.pick([9, 10, 11]);
      const list = d.until(() => many(d, n, c.lo, c.hi), (l) => { const m = tallyOf(l), top = Math.max(...m.values()); return top === 3 && modes(l).length === 1 && [...m.values()].filter((v) => v === 2).length >= 1 && modes(l)[0] !== Math.max(...l); });
      const mo = modes(list)[0];
      return N(`${rawIntro(c, n)} 이 자료의 최빈값은?`, mo, { unit: c.unit, figure: dataFig(list, c.unit), explain: `${amtj(mo, c.unit, '이/가')} 3번으로 가장 많이 나타나므로 최빈값은 ${amt(mo, c.unit)}이다.`, facts: { calc: [[String(modeAlt(list)), 0]], rule: 'mode' } });
    }),
    T('rep-mode-many', '최빈값이 여럿인 자료', '②10 심3', (d, n) => {
      const c = d.pick(RAWS), size = d.pick([8, 9, 10]), want = n === 0 ? 2 : d.pick([2, 3]);
      const list = d.until(() => many(d, size, c.lo, c.hi), (l) => modes(l).length === want && topCount(l) >= 2 && new Set(l).size >= want + 2);
      const mo = modes(list), top = topCount(list), told = `${mo.map((v) => amt(v, c.unit)).join(', ')}${ut(c.unit, '이/가')} 각각 ${top}번으로 가장 많이 나타난다.`;
      if (n === 1) {
        const kinds = [...new Set(list)];
        return N(`${rawIntro(c, size)} 이 자료의 최빈값은 모두 몇 개인가?`, mo.length, { unit: '개', figure: dataFig(list, c.unit), explain: `${told} 가장 많이 나타나는 값이 여럿이면 그 값이 모두 최빈값이므로 최빈값은 ${mo.length}개이다.`, facts: { count: kinds.map((v) => list.filter((x) => x === v).length === top) } });
      }
      const other = d.pick([...new Set(list)].filter((v) => !mo.includes(v))), u = c.unit;
      const options = d.shuffle([[`${amt(mo[0], u)}`, false], [`${amt(mo[1], u)}`, false], [`${amt(mo[0], u)}, ${amt(mo[1], u)}`, true], [`${srt([mo[0], mo[1], other]).map((v) => amt(v, u)).join(', ')}`, false]]);
      return C(`${rawIntro(c, size)} 이 자료의 최빈값을 모두 고른 것은?`, options.map((x) => x[0]), options.findIndex((x) => x[1]), { figure: dataFig(list, c.unit), explain: `${told} 가장 많이 나타나는 값이 여럿이면 그 값이 모두 최빈값이다.`, facts: { truth: options.map((x) => x[1]), want: true } });
    }, { count: 2 }),
    T('rep-mode-word', '수가 아닌 자료의 최빈값', '②11 심2', (d, n) => {
      // 차례 0: 낱말을 늘어놓은 자료. 차례 1: 낱말마다 학생 수를 적은 표(최빈값은 학생 수가 아니라 그 낱말이다).
      const set = d.pick([{ what: '좋아하는 운동', words: ['축구', '농구', '야구', '배구', '수영'] }, { what: '좋아하는 과일', words: ['사과', '포도', '딸기', '수박', '참외'] }, { what: '가고 싶은 체험 학습 장소', words: ['박물관', '과학관', '미술관', '동물원', '수목원'] }, { what: '배우고 싶은 악기', words: ['피아노', '기타', '드럼', '플루트', '바이올린'] }]);
      if (n === 0) {
        const words = d.shuffle(set.words).slice(0, 4), counts = d.shuffle(d.pick([[4, 2, 2, 1], [4, 3, 2, 1], [3, 2, 2, 1], [4, 3, 1, 1]])), size = sum(counts);
        const list = d.until(() => d.shuffle(words.reduce((all, w, i) => all.concat(Array.from({ length: counts[i] }, () => w)), [])), (l) => l[0] !== words[counts.indexOf(Math.max(...counts))]);
        const at = counts.indexOf(Math.max(...counts));
        return C(`다음은 학생 ${size}명이 ${wj(set.what, '을/를')} 하나씩 적어 낸 것이다. 이 자료의 최빈값은?`, words, at, { figure: numbers(list), explain: `${wj(words[at], '이/가')} ${counts[at]}번으로 가장 많이 나타나므로 최빈값은 ${words[at]}이다.`, facts: { truth: words.map((w) => list.filter((x) => x === w).length === Math.max(...counts)), want: true } });
      }
      const words = set.words, counts = d.until(() => many(d, 5, 2, 9), (f) => f.filter((v) => v === Math.max(...f)).length === 1 && new Set(f).size <= 4), at = counts.indexOf(Math.max(...counts));
      const options = words.slice(0, 5);
      return C(`다음은 어느 반 학생 ${sum(counts)}명의 ${wj(set.what, '을/를')} 조사하여 나타낸 표이다. 이 자료의 최빈값은?`, options, at, { figure: tbl([set.what.replace(/^.* /, ''), '학생 수(명)'], words.map((w, i) => [w, counts[i]])), explain: `${wj(words[at], '을/를')} 고른 학생이 ${counts[at]}명으로 가장 많다. 최빈값은 가장 많이 나타나는 값이므로 ${counts[at]}명이 아니라 ${words[at]}이다.`, facts: { choose: { exprs: counts.map(String), rule: 'max' } } });
    }, { count: 2 }),
    T('rep-all-three', '한 자료의 평균·중앙값·최빈값을 모두 구하기', '①7 ②12 심4', (d) => {
      const c = d.pick(RAWS), n = 7;
      const list = d.until(() => many(d, n, c.lo, c.hi), (l) => sum(l) % n === 0 && modes(l).length === 1 && topCount(l) >= 2 && !isSorted(l) && new Set([sum(l) / n, median(l), modes(l)[0]]).size >= 2 && l[3] !== median(l));
      const mean = sum(list) / n, med = median(list), mo = modes(list)[0], u = c.unit;
      return M(`${rawIntro(c, n)} 이 자료의 평균, 중앙값, 최빈값은?`, [{ label: '평균', answer: mean, unit: u }, { label: '중앙값', answer: med, unit: u }, { label: '최빈값', answer: mo, unit: u }], {
        figure: dataFig(list, u),
        explain: `평균은 (${list.join(' + ')}) ÷ ${n} = ${amt(mean, u)}이다. 크기순으로 늘어놓으면 ${srt(list).join(', ')}이므로 중앙값은 4번째 값인 ${amt(med, u)}이고, 가장 많이 나타나는 값은 ${amt(mo, u)}이므로 최빈값은 ${amt(mo, u)}이다.`,
        facts: { calc: [[`(${list.join('+')})/${n}`, 0], [String(nth(list, 4)), 1], [String(modeAlt(list)), 2]] }
      });
    }),
    T('rep-median-pick', '여러 자료 가운데 중앙값이 가장 큰(작은) 자료 고르기', '①4', (d) => {
      const big = d.bool();
      const sets = d.until(() => range(0, 3).map(() => many(d, 5, 2, 19)), (ls) => { const ms = ls.map(median), best = big ? Math.max(...ms) : Math.min(...ms), mids = ls.map((l) => l[2]); return new Set(ms).size === 4 && ls.every((l) => new Set(l).size === 5 && !isSorted(l)) && mids.indexOf(big ? Math.max(...mids) : Math.min(...mids)) !== ms.indexOf(best); });
      const ms = sets.map(median), at = ms.indexOf(big ? Math.max(...ms) : Math.min(...ms));
      return C(`다음 자료 ㉠~㉣ 가운데 중앙값이 가장 ${big ? '큰' : '작은'} 것은?`, LAB.slice(0, 4), at, { figure: tagged(sets.map((l) => l.join(', '))), explain: `변량을 크기순으로 늘어놓았을 때 3번째 값이 중앙값이다. 중앙값은 차례로 ${ms.join(', ')}이므로 중앙값이 가장 ${big ? '큰' : '작은'} 것은 ${LAB[at]}이다.`, facts: { truth: ms.map((v, i) => i === at), want: true, choose: { exprs: sets.map((l) => String(nth(l, 3))), rule: big ? 'max' : 'min' } } });
    }),
    T('rep-same-med-mode', '중앙값과 최빈값이 같은 자료 고르기', '심6', (d) => {
      const at = d.int(0, 3);
      const sets = range(0, 3).map((i) => d.until(() => many(d, 7, 1, 9), (l) => modes(l).length === 1 && topCount(l) >= 2 && !isSorted(l) && (median(l) === modes(l)[0]) === (i === at) && l[3] !== median(l)));
      return C('다음 자료 ㉠~㉣ 가운데 중앙값과 최빈값이 서로 같은 것은?', LAB.slice(0, 4), at, { figure: tagged(sets.map((l) => l.join(', '))), explain: `${LAB[at]}의 변량을 크기순으로 늘어놓으면 ${srt(sets[at]).join(', ')}이므로 중앙값은 4번째 값인 ${median(sets[at])}이고, 가장 많이 나타나는 값도 ${modes(sets[at])[0]}이다. 나머지 자료의 (중앙값, 최빈값)은 ${sets.map((l, i) => (i === at ? '' : `${LAB[i]} (${median(l)}, ${modes(l)[0]})`)).filter(Boolean).join(', ')}이다.`, facts: { truth: sets.map((l) => nth(l, 4) === modeAlt(l)), want: true } });
    }),
    T('rep-claims', '한 자료의 대푯값에 대한 설명 가리기', '①12 ②14 심7', (d) => {
      const c = d.pick(RAWS), u = c.unit, n = 8;
      const list = d.until(() => many(d, n, c.lo, c.hi), (l) => { const s = srt(l); return sum(l) % n === 0 && (s[3] + s[4]) % 2 === 1 && modes(l).length <= 2 && topCount(l) === 2 && !isSorted(l) && sum(l) / n !== median(l); });
      const s = srt(list), mean = sum(list) / n, med = median(list), mo = modes(list), add = s[4] + d.int(1, 3), wantTrue = d.bool();
      const moText = mo.map((v) => amt(v, u)).join(', ');
      const rows = [
        [`평균은 ${amt(mean, u)}이다.`, `평균은 ${amt(mean + d.pick([-1, 1]), u)}이다.`, `평균은 ${sum(list)} ÷ ${n} = ${amt(mean, u)}이다.`],
        [`중앙값은 ${amt(med, u)}이다.`, `중앙값은 ${amt(s[3], u)}이다.`, `크기순으로 늘어놓으면 ${s.join(', ')}이고 중앙값은 4번째 값과 5번째 값의 평균인 ${amt(med, u)}이다.`],
        [`최빈값은 ${moText}이다.`, mo.length === 2 ? `최빈값은 ${amt(mo[1], u)} 하나뿐이다.` : `최빈값은 ${amt(s[7] === mo[0] ? s[0] : s[7], u)}이다.`, `가장 많이 나타나는 값은 ${moText}이다.`],
        [`변량 ${amtj(add, u, '을/를')} 하나 추가하면 중앙값은 ${amtj(s[4], u, '이/가')} 된다.`, `변량 ${amtj(add, u, '을/를')} 하나 추가하여도 중앙값은 변하지 않는다.`, `${amtj(add, u, '을/를')} 추가하면 변량이 9개가 되어 중앙값은 5번째 값인 ${amtj(s[4], u, '이/가')} 된다.`]
      ];
      return pickClaim(d, `${rawIntro(c, n)} 이 자료에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: dataFig(list, u) });
    }),
    T('rep-talk', '대푯값의 성질', '①13 ②2 심9', (d, n) => claimQ(d, `대푯값에 대한 설명으로 ${n === 0 ? '옳은' : '옳지 않은'} 것은?`, [
      '평균, 중앙값, 최빈값은 모두 대푯값이다.', '평균은 자료의 변량을 모두 사용하여 구한다.', '자료에 매우 크거나 매우 작은 값이 있으면 평균은 그 값의 영향을 많이 받는다.', '중앙값은 자료에 없는 값일 수도 있다.',
      '최빈값은 한 자료에 여러 개일 수도 있다.', '최빈값은 좋아하는 색깔처럼 수로 나타낼 수 없는 자료에도 쓸 수 있다.', '변량의 개수가 홀수이면 중앙값은 자료의 변량 가운데 하나이다.', '자료에 매우 크거나 매우 작은 값이 있으면 평균보다 중앙값이 대푯값으로 알맞다.'
    ], [
      ['최빈값은 항상 하나뿐이다.', '가장 많이 나타나는 값이 여럿이면 최빈값도 여럿이다.', '최빈값은 한 자료에 여러 개일 수도 있다.'],
      ['중앙값은 항상 자료의 변량 가운데 하나이다.', '변량의 개수가 짝수이면 가운데 두 값의 평균이 중앙값이므로 자료에 없는 값일 수도 있다.', '중앙값은 자료에 없는 값일 수도 있다.'],
      ['중앙값은 변량을 조사한 차례대로 늘어놓았을 때 한가운데 있는 값이다.', '중앙값은 변량을 크기순으로 늘어놓았을 때 한가운데 있는 값이다.'],
      ['최빈값은 매우 크거나 매우 작은 값의 영향을 많이 받는다.', '매우 크거나 매우 작은 값의 영향을 많이 받는 것은 평균이다.', '자료에 매우 크거나 매우 작은 값이 있으면 평균은 그 값의 영향을 많이 받는다.'],
      ['대푯값은 평균 하나뿐이다.', '중앙값과 최빈값도 대푯값이다.', '평균, 중앙값, 최빈값은 모두 대푯값이다.'],
      ['최빈값은 자료의 변량 가운데 가장 큰 값이다.', '최빈값은 가장 많이 나타나는 값이다.'],
      ['평균은 항상 중앙값보다 크다.', '자료에 따라 평균이 중앙값보다 작을 수도 있고 같을 수도 있다.'],
      ['최빈값은 수로 나타낸 자료에서만 구할 수 있다.', '최빈값은 좋아하는 색깔처럼 수가 아닌 자료에서도 구할 수 있다.', '최빈값은 좋아하는 색깔처럼 수로 나타낼 수 없는 자료에도 쓸 수 있다.']
    ], n === 0), { count: 2 }),
    T('rep-median-missing', '크기순으로 놓인 자료에서 중앙값으로 빠진 변량 구하기', '②15 심13', (d) => {
      // 변량 6개가 작은 값부터 놓여 있고 x 는 3번째나 4번째 자리에 있다. 중앙값은 3번째 값과 4번째 값의 평균이다.
      const third = d.bool(), s = d.until(() => srt(many(d, 6, 1, 24)), (l) => new Set(l).size === 6 && l[2] - l[1] >= 2 && l[4] - l[3] >= 2);
      const x = third ? s[2] : s[3], other = third ? s[3] : s[2], m = (s[2] + s[3]) / 2, shown = s.map((v, i) => (i === (third ? 2 : 3) ? V('x') : v));
      return N(`다음은 변량 6개를 작은 값부터 크기순으로 늘어놓은 것이다. 이 자료의 중앙값이 ${fx(m)}일 때, ${V('x')}의 값은?`, x, { figure: numbers(shown), explain: `변량이 6개이므로 중앙값은 3번째 값과 4번째 값의 평균이다. (${third ? `${V('x')} + ${other}` : `${other} + ${V('x')}`}) ÷ 2 = ${fx(m)}에서 ${V('x')} + ${other} = ${fx(2 * m)}이므로 ${V('x')} = ${x}이다.`, facts: { calc: [[`2*${fx(m)}-${other}`, 0]], unseen: [2] } });
    }),
    T('rep-fit-data', '평균보다 중앙값이 대푯값으로 알맞은 자료 고르기', '②22 심10', (d) => {
      // 한 자료에만 다른 변량과 크게 차이 나는 값이 있다.
      const at = d.int(0, 3), sets = range(0, 3).map((i) => { const base = d.int(2, 20), l = d.until(() => many(d, 6, base, base + 9), (v) => new Set(v).size >= 5); if (i === at) l[d.int(0, 5)] = (base + 9) * d.int(5, 7) + d.int(0, 4); return l; });
      const far = Math.max(...sets[at]);
      return C('다음 자료 ㉠~㉣ 가운데 평균보다 중앙값이 대푯값으로 더 알맞은 것은?', LAB.slice(0, 4), at, { figure: tagged(sets.map((l) => l.join(', '))), explain: `${LAB[at]}에는 다른 변량과 크게 차이 나는 값 ${nj(far, '이/가')} 있다. 평균은 이 값의 영향을 많이 받아 자료 전체를 대표하기 어려우므로 중앙값이 대푯값으로 더 알맞다.`, facts: { truth: sets.map((l) => Math.max(...l) > 3 * srt(l)[4]), want: true } });
    })
  ];

  // ═══ 줄기와 잎 그림 ═══
  const stemIntro = (c, n) => `다음은 어느 반 학생${n ? ' ' + n + '명' : '들'}의 ${wj(c.what, '을/를')} 조사하여 나타낸 줄기와 잎 그림이다.`;
  // 줄기와 잎 그림 하나를 만든다. sizes: 줄기마다의 잎의 수.
  const newStem = (d, o) => {
    const c = (o && o.c) || d.pick(STEMS), s0 = d.pick(c.stems);
    const data = d.until(() => stemData(d, s0, (o && o.sizes) || d.shuffle(d.pick([[3, 6, 5, 2], [2, 5, 7, 4], [4, 7, 5, 3], [3, 5, 6, 4], [2, 4, 6, 3]]))), (x) => x.values[0] > 0 && (!o || !o.ok || o.ok(x)));
    return Object.assign({ c, s0, u: c.unit, fig: stemFig(data.rows, { unit: c.unit }) }, data);
  };
  const STEM = [
    T('stem-talk', '줄기와 잎 그림에 대한 설명', '①15 ②25', (d) => { const wantTrue = d.bool(); return claimQ(d, `줄기와 잎 그림에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, [
      '줄기와 잎 그림에서는 자료의 변량을 모두 알 수 있다.', '줄기에는 중복되는 수를 한 번만 쓴다.', '잎에는 중복되는 수를 중복된 횟수만큼 모두 쓴다.', '잎의 총개수는 자료의 변량의 개수와 같다.',
      '변량이 두 자리 수이면 십의 자리 숫자를 줄기로, 일의 자리 숫자를 잎으로 나타낼 수 있다.', '잎이 가장 많은 줄기를 보면 변량이 어느 구간에 많이 몰려 있는지 알 수 있다.'
    ], [
      ['잎에는 중복되는 수를 한 번만 쓴다.', '잎에는 중복되는 수를 중복된 횟수만큼 모두 쓴다.', '잎에는 중복되는 수를 중복된 횟수만큼 모두 쓴다.'],
      ['줄기에는 중복되는 수를 중복된 횟수만큼 모두 쓴다.', '줄기에는 중복되는 수를 한 번만 쓴다.', '줄기에는 중복되는 수를 한 번만 쓴다.'],
      ['줄기와 잎 그림으로 나타내면 자료의 변량을 정확히 알 수 없다.', '줄기와 잎을 이어 읽으면 변량을 모두 알 수 있다.', '줄기와 잎 그림에서는 자료의 변량을 모두 알 수 있다.'],
      ['잎의 총개수는 줄기의 개수와 같다.', '잎의 총개수는 변량의 개수와 같다.', '잎의 총개수는 자료의 변량의 개수와 같다.'],
      ['잎이 가장 많은 줄기의 수가 그 자료에서 가장 큰 변량이다.', '잎이 가장 많은 줄기는 변량이 가장 많이 몰려 있는 구간을 나타낸다.', '잎이 가장 많은 줄기를 보면 변량이 어느 구간에 많이 몰려 있는지 알 수 있다.']
    ], wantTrue); }),
    T('stem-make', '자료를 줄기와 잎 그림으로 나타내기', '①16 ②27 심27', (d, n) => {
      // 그리는 꼴을 바꾸었다. 차례 0: 잎이 가장 많은 줄기. 차례 1: 한 줄기의 잎을 바르게 적은 것(작은 수부터, 중복된 수도 모두).
      const c = d.pick(STEMS.filter((x) => x.stems[0] >= 1 && x.stems[0] < 10)), s0 = d.pick(c.stems), u = c.unit;
      const data = d.until(() => stemData(d, s0, d.shuffle([3, 5, 4, 2])), (x) => { const r = x.rows.find((row) => row[1].length === 5)[1]; return new Set(r).size === 4; });
      const list = d.until(() => d.shuffle(data.values), (l) => { const row = data.rows.find((r) => r[1].length === 5), inOrder = l.filter((v) => Math.floor(v / 10) === row[0]).map((v) => v % 10); return !isSorted(inOrder); });
      const lead = `다음은 학생 ${list.length}명의 ${wj(c.what, '을/를')} 조사하여 나타낸 자료이다. 이 자료를 십의 자리 숫자를 줄기로, 일의 자리 숫자를 잎으로 하는 줄기와 잎 그림으로 나타낼 때,`;
      const [stem, leaves] = data.rows.find((r) => r[1].length === 5);
      if (n === 0) return N(`${lead} 잎이 가장 많은 줄기는?`, stem, { figure: dataFig(list, u), explain: `줄기마다 잎의 수를 세면 ${data.rows.map(([s, l]) => `줄기 ${s}에 ${l.length}개`).join(', ')}이므로 잎이 가장 많은 줄기는 ${stem}이다.`, facts: { calc: [[String(modeAlt(list.map((v) => Math.floor(v / 10)))), 0]], unseen: [stem] } });
      // 틀린 보기: 자료에 적힌 차례대로 적은 것, 중복된 수를 한 번만 적은 것, 큰 수부터 적은 것
      const inOrder = list.filter((v) => Math.floor(v / 10) === stem).map((v) => v % 10), once = [...new Set(leaves)];
      const options = d.shuffle([[leaves.join(' '), true], [inOrder.join(' '), false], [once.join(' '), false], [leaves.slice().reverse().join(' '), false]]);
      return C(`${lead} 줄기 ${stem}의 잎을 바르게 적은 것은?`, options.map((x) => x[0]), options.findIndex((x) => x[1]), { figure: dataFig(list, u), explain: `십의 자리 숫자가 ${stem}인 변량은 ${srt(list.filter((v) => Math.floor(v / 10) === stem)).join(', ')}이다. 잎은 일의 자리 숫자를 작은 수부터 차례로 쓰고, 중복되는 수도 중복된 횟수만큼 모두 쓴다.`, facts: { truth: options.map((x) => x[1]), want: true } });
    }, { count: 2 }),
    T('stem-fill', '자료와 맞대어 줄기와 잎 그림의 빈칸 채우기', '①17 ②26 심28', (d) => {
      const c = d.pick(STEMS.filter((x) => x.stems[0] >= 1 && x.stems[0] < 10)), s0 = d.pick(c.stems), u = c.unit;
      // 줄기 셋에서 잎을 하나씩 가린다(0이 아닌 잎).
      const data = d.until(() => stemData(d, s0, [4, 5, 4]), (x) => x.rows.every((r) => r[1].some((l) => l > 0)));
      const hide = data.rows.map(([, leaves]) => d.pick(range(0, leaves.length - 1).filter((i) => leaves[i] > 0)));
      const rows = data.rows.map(([s, leaves], r) => [s, leaves.map((l, i) => (i === hide[r] ? LAB[r] : l))]), list = d.shuffle(data.values);
      const calc = data.rows.map(([s, leaves], r) => [`(${leaves.map((l) => s * 10 + l).join('+')})-(${leaves.filter((l, i) => i !== hide[r]).map((l) => s * 10 + l).join('+')})-${s * 10}`, r]);
      return M(`다음은 학생 ${list.length}명의 ${wj(c.what, '을/를')} 조사하여 나타낸 자료와 이 자료를 나타낸 줄기와 잎 그림이다. ㉠, ㉡, ㉢에 알맞은 수는?`, data.rows.map(([, leaves], r) => ({ label: LAB[r], answer: leaves[hide[r]] })), {
        figure: dataFig(list, u) + stemFig(rows, { unit: u }),
        explain: `줄기와 잎 그림에 적힌 변량을 자료에서 하나씩 지우면 ${data.rows.slice(0, 2).map(([s, leaves], r) => s * 10 + leaves[hide[r]]).join(', ')}, ${nj(data.rows[2][0] * 10 + data.rows[2][1][hide[2]], '이/가')} 남는다. 따라서 ㉠ = ${data.rows[0][1][hide[0]]}, ㉡ = ${data.rows[1][1][hide[1]]}, ㉢ = ${data.rows[2][1][hide[2]]}이다.`,
        facts: { calc, unseen: data.rows.map(([s]) => s * 10) }
      });
    }),
    T('stem-most-leaves', '잎이 가장 많은(적은) 줄기', '①18 ②29', (d) => {
      const most = d.bool(), x = newStem(d, { ok: (v) => { const n = v.rows.map((r) => r[1].length), best = most ? Math.max(...n) : Math.min(...n); return n.filter((k) => k === best).length === 1 && v.rows[n.indexOf(best)][0] > 0; } });
      const n = x.rows.map((r) => r[1].length), at = n.indexOf(most ? Math.max(...n) : Math.min(...n));
      return N(`${stemIntro(x.c)} 잎이 가장 ${most ? '많은' : '적은'} 줄기는?`, x.rows[at][0], { figure: x.fig, explain: `잎의 수는 ${x.rows.map(([s, l]) => `줄기 ${s}에 ${l.length}개`).join(', ')}이므로 잎이 가장 ${most ? '많은' : '적은'} 줄기는 ${x.rows[at][0]}이다.`, facts: { calc: [[String(x.rows[at][0]), 0]] } });
    }),
    T('stem-total', '줄기와 잎 그림에서 전체 변량의 수', '①19 ②28', (d) => {
      const x = newStem(d), n = x.rows.map((r) => r[1].length);
      return N(`${stemIntro(x.c)} 조사한 학생은 모두 몇 명인가?`, x.values.length, { unit: '명', figure: x.fig, explain: `잎의 총개수가 변량의 개수이다. 잎은 줄기마다 ${n.join(', ')}개이므로 학생은 모두 ${n.join(' + ')} = ${x.values.length}(명)이다.`, facts: { calc: [[n.join('+'), 0]], unseen: n } });
    }),
    T('stem-range', '줄기와 잎 그림에서 가장 큰 값과 가장 작은 값의 차', '①20 ②30', (d) => {
      const x = newStem(d), lo = x.values[0], hi = x.values[x.values.length - 1], c = x.c;
      return N(`${stemIntro(c)} 이 자료에서 가장 큰 변량과 가장 작은 변량의 차는?`, hi - lo, { unit: c.unit, figure: x.fig, explain: `가장 큰 값은 줄기 ${x.rows[x.rows.length - 1][0]}의 마지막 잎에서 ${amt(hi, c.unit)}, 가장 작은 값은 줄기 ${x.rows[0][0]}의 첫 잎에서 ${amt(lo, c.unit)}이므로 차는 ${hi} − ${lo} = ${amt(hi - lo, c.unit)}이다.`, facts: { calc: [[`${hi}-${lo}`, 0]] } });
    }),
    T('stem-count-range', '줄기와 잎 그림에서 범위에 드는 변량의 수', '①21 ②31', (d, n) => {
      // 차례 0: 줄기에서 끊기는 기준 이상. 차례 1: 줄기 가운데에서 끊기는 「이상 ~ 미만」(두 끝 값이 모두 자료에 있다). 차례 2: 한 학생보다 값이 큰 학생 수(그 값은 세지 않는다).
      const x = newStem(d, { ok: (v) => { const r1 = v.rows[1][1], r2 = v.rows[2][1]; return r1.length >= 3 && r2.length >= 3 && r1[1] > r1[0] && r2[r2.length - 2] > r2[0] && r1[1] !== r1[2]; } }), c = x.c, u = c.unit, v = x.values;
      if (n === 0) {
        const t = x.rows[2][0] * 10, flags = v.map((w) => w >= t), k = flags.filter(Boolean).length;
        return N(`${stemIntro(c)} ${wj(c.what, '이/가')} ${amt(t, u)} 이상인 학생은 모두 몇 명인가?`, k, { unit: '명', figure: x.fig, explain: `${amt(t, u)} 이상인 변량은 줄기가 ${x.rows.slice(2).map((r) => r[0]).join(', ')}인 것이므로 잎의 수를 세면 ${x.rows.slice(2).map((r) => r[1].length).join(' + ')} = ${k}(명)이다.`, facts: { count: flags } });
      }
      if (n === 1) {
        const a = x.rows[1][0] * 10 + x.rows[1][1][1], b = x.rows[2][0] * 10 + x.rows[2][1][x.rows[2][1].length - 2], flags = v.map((w) => w >= a && w < b), k = flags.filter(Boolean).length;
        return N(`${stemIntro(c)} ${wj(c.what, '이/가')} ${amt(a, u)} 이상 ${amt(b, u)} 미만인 학생은 모두 몇 명인가?`, k, { unit: '명', figure: x.fig, explain: `${amtj(a, u, '은/는')} 범위에 들고 ${amtj(b, u, '은/는')} 범위에 들지 않는다. 범위에 드는 변량은 ${v.filter((w, i) => flags[i]).join(', ')}의 ${k}개이므로 ${k}명이다.`, facts: { count: flags } });
      }
      const a = x.rows[1][0] * 10 + x.rows[1][1][x.rows[1][1].length - 1], flags = v.map((w) => w > a), k = flags.filter(Boolean).length;
      return N(`${stemIntro(c)} 이 반의 한 학생의 ${wj(c.what, '이/가')} ${amt(a, u)}일 때, 이 학생보다 ${wj(c.what, '이/가')} 더 ${c.big} 학생은 모두 몇 명인가?`, k, { unit: '명', figure: x.fig, explain: `${amt(a, u)}보다 큰 변량을 센다. ${amtj(a, u, '과/와')} 같은 값은 세지 않는다. 줄기가 ${x.rows.slice(2).map((r) => r[0]).join(', ')}인 변량이 모두 ${amt(a, u)}보다 크므로 ${k}명이다.`, facts: { count: flags } });
    }, { count: 3 }),
    T('stem-nth', '줄기와 잎 그림에서 몇 번째인 값', '①22 ①23 ②32', (d, n) => {
      // 차례 0: k번째로 큰(작은) 값. 차례 1: 한 값이 큰 쪽에서 몇 번째인가.
      const x = newStem(d, { ok: (v) => new Set(v.values.slice(-8)).size === 8 && new Set(v.values.slice(0, 7)).size === 7 }), c = x.c, u = c.unit, v = x.values, len = v.length;
      if (n === 0) {
        const fromBig = d.bool(), k = d.int(3, 6), w = fromBig ? v[len - k] : v[k - 1];
        return N(`${stemIntro(c)} 이 자료에서 ${fromBig ? '큰' : '작은'} 값부터 ${k}번째인 변량은?`, w, { unit: u, figure: x.fig, explain: `${fromBig ? '큰' : '작은'} 값부터 차례로 세면 ${(fromBig ? v.slice(-k).reverse() : v.slice(0, k)).join(', ')}이므로 ${k}번째 값은 ${amt(w, u)}이다.`, facts: { calc: [[String(nth(v, fromBig ? len - k + 1 : k)), 0]] } });
      }
      const k = d.int(4, 7), w = v[len - k], flags = v.map((z) => z >= w);
      return N(`${stemIntro(c)} 이 자료에서 변량 ${amtj(w, u, '은/는')} 큰 값부터 몇 번째인가?`, k, { unit: '번째', figure: x.fig, explain: `큰 값부터 차례로 세면 ${v.slice(-k).reverse().join(', ')}이므로 ${amtj(w, u, '은/는')} ${k}번째이다.`, facts: { count: flags } });
    }, { count: 2 }),
    T('stem-mode', '줄기와 잎 그림에서 최빈값', '②33', (d) => {
      const x = newStem(d, { ok: (v) => modes(v.values).length === 1 && topCount(v.values) === 3 }), c = x.c, mo = modes(x.values)[0];
      return N(`${stemIntro(c)} 이 자료의 최빈값은?`, mo, { unit: c.unit, figure: x.fig, explain: `줄기 ${Math.floor(mo / 10)}에 잎 ${mo % 10}${tail(mo % 10, '이/가')} 3번 적혀 있다. ${amtj(mo, c.unit, '이/가')} 3번으로 가장 많이 나타나므로 최빈값은 ${amt(mo, c.unit)}이다.`, facts: { calc: [[String(modeAlt(x.values)), 0]] } });
    }),
    T('stem-percent', '줄기와 잎 그림에서 범위에 드는 비율', '②34 심29', (d) => {
      const sizes = d.shuffle(d.pick([[3, 7, 6, 4], [4, 6, 7, 3], [5, 8, 7, 5], [4, 9, 8, 4]])), total = sum(sizes);
      const x = newStem(d, { sizes, ok: (v) => { const r = v.rows[2][1]; return r[1] > r[0]; } }), c = x.c, u = c.unit, v = x.values;
      // 기준은 셋째 줄기의 가운데 값: 그 값 이상인 변량의 수가 전체의 몇 %인지가 자연수가 되게 고른다.
      const cut = d.until(() => d.pick(x.rows[2][1].slice(1)), (l) => { const t = x.rows[2][0] * 10 + l, k = v.filter((w) => w >= t).length; return Number.isInteger(pctOf(k, total)); }), t = x.rows[2][0] * 10 + cut, k = v.filter((w) => w >= t).length;
      return N(`${stemIntro(c, total)} ${wj(c.what, '이/가')} ${amt(t, u)} 이상인 학생은 전체의 몇 %인가?`, pctOf(k, total), { unit: ' %', figure: x.fig, explain: `${amt(t, u)} 이상인 학생은 ${k}명이고 전체 학생은 ${total}명이므로 ${k} ÷ ${total} × 100 = ${pctOf(k, total)}(%)이다.`, facts: { calc: [[`100*${k}/${total}`, 0]], unseen: [100, k] } });
    }),
    T('stem-claims', '줄기와 잎 그림에 대한 설명 가리기', '①24 ②36 심30', (d) => {
      const x = newStem(d, { ok: (v) => { const n = v.rows.map((r) => r[1].length); return n.filter((k) => k === Math.max(...n)).length === 1 && new Set(v.values.slice(0, 6)).size === 6; } }), c = x.c, u = c.unit, v = x.values, len = v.length, wantTrue = d.bool();
      const n = x.rows.map((r) => r[1].length), top = x.rows[n.indexOf(Math.max(...n))][0], t = x.rows[2][0] * 10, over = v.filter((w) => w >= t).length, lo = v[0], hi = v[len - 1], k = d.int(3, 5);
      const rows = [
        [`조사한 학생은 모두 ${len}명이다.`, `조사한 학생은 모두 ${len + d.pick([-1, 1])}명이다.`, `잎의 총개수는 ${len}이므로 학생은 모두 ${len}명이다.`],
        [`잎이 가장 많은 줄기는 ${top}이다.`, `잎이 가장 많은 줄기는 ${x.rows.find((r) => r[0] !== top)[0]}이다.`, `잎이 가장 많은 줄기는 ${top}이다.`],
        [`${wj(c.what, '이/가')} ${amt(t, u)} 이상인 학생은 ${over}명이다.`, `${wj(c.what, '이/가')} ${amt(t, u)} 이상인 학생은 ${over - x.rows[2][1].length}명이다.`, `${amt(t, u)} 이상인 학생은 줄기가 ${x.rows.slice(2).map((r) => r[0]).join(', ')}인 ${over}명이다.`],
        [`가장 큰 변량과 가장 작은 변량의 차는 ${amt(hi - lo, u)}이다.`, `가장 큰 변량과 가장 작은 변량의 차는 ${amt(hi - lo + d.pick([10, -10]), u)}이다.`, `가장 큰 변량은 ${amt(hi, u)}, 가장 작은 변량은 ${amt(lo, u)}이므로 차는 ${amt(hi - lo, u)}이다.`],
        [`작은 값부터 ${k}번째인 변량은 ${amt(v[k - 1], u)}이다.`, `작은 값부터 ${k}번째인 변량은 ${amt(v[k], u)}이다.`, `작은 값부터 차례로 세면 ${v.slice(0, k).join(', ')}이므로 ${k}번째인 변량은 ${amt(v[k - 1], u)}이다.`]
      ];
      return pickClaim(d, `${stemIntro(c)} 이 그림에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: x.fig });
    }),
    T('stem-two-read', '두 집단을 나란히 놓은 줄기와 잎 그림 읽기', '①25 심29', (d) => {
      const two = newTwoStem(d), c = two.c, u = c.unit, t = two.rows[1][0] * 10 + two.rows[1][2][1], all = two.a.concat(two.b), flags = all.map((w) => w >= t), k = flags.filter(Boolean).length;
      return N(`${twoIntro(two)} 두 집단을 합하여 ${wj(c.what, '이/가')} ${amt(t, u)} 이상인 학생은 모두 몇 명인가?`, k, { unit: '명', figure: two.fig, explain: `왼쪽 잎은 줄기에서 멀어질수록 큰 수이다. ${amt(t, u)} 이상인 학생은 ${two.names[0]}에 ${two.a.filter((w) => w >= t).length}명, ${two.names[1]}에 ${two.b.filter((w) => w >= t).length}명이므로 모두 ${k}명이다.`, facts: { count: flags } });
    }),
    T('stem-two-claims', '두 집단을 나란히 놓은 줄기와 잎 그림에 대한 설명 가리기', '①25 심30', (d) => {
      const two = newTwoStem(d), c = two.c, u = c.unit, [A, Bn] = two.names, wantTrue = d.bool(), last = two.rows[two.rows.length - 1], s = last[0] * 10;
      const maxA = Math.max(...two.a), maxB = Math.max(...two.b), overA = two.a.filter((w) => w >= s).length, overB = two.b.filter((w) => w >= s).length, k = d.int(2, 4), kth = srt(two.b)[two.b.length - k], mid = two.rows[1];
      const rows = [
        [`가장 큰 변량은 ${maxA > maxB ? A : Bn}의 자료에 있다.`, `가장 큰 변량은 ${maxA > maxB ? Bn : A}의 자료에 있다.`, `가장 큰 변량은 ${A}에서 ${amt(maxA, u)}, ${Bn}에서 ${amt(maxB, u)}이다.`],
        [`${A}의 학생 수와 ${Bn}의 학생 수는 같다.`, `${A}의 학생 수가 ${Bn}의 학생 수보다 많다.`, `잎의 수를 세면 두 집단 모두 ${two.a.length}명이다.`],
        [`${wj(c.what, '이/가')} ${amt(s, u)} 이상인 학생은 ${overA > overB ? A : Bn}에 더 많다.`, `${wj(c.what, '이/가')} ${amt(s, u)} 이상인 학생은 ${overA > overB ? Bn : A}에 더 많다.`, `${amt(s, u)} 이상인 학생은 ${A}에 ${overA}명, ${Bn}에 ${overB}명이다.`],
        [`${Bn}의 자료에서 큰 값부터 ${k}번째인 변량은 ${amt(kth, u)}이다.`, `${Bn}의 자료에서 큰 값부터 ${k}번째인 변량은 ${amt(srt(two.b)[two.b.length - k - 1], u)}이다.`, `${Bn}의 변량을 큰 값부터 세면 ${srt(two.b).slice(-k).reverse().join(', ')}이므로 ${k}번째인 변량은 ${amt(kth, u)}이다.`],
        [`줄기 ${mid[0]}의 잎은 ${mid[1].length > mid[2].length ? A : Bn} 쪽이 더 많다.`, `줄기 ${mid[0]}의 잎은 ${mid[1].length > mid[2].length ? Bn : A} 쪽이 더 많다.`, `줄기 ${mid[0]}의 잎은 ${A} 쪽에 ${mid[1].length}개, ${Bn} 쪽에 ${mid[2].length}개이다.`]
      ];
      return pickClaim(d, `${twoIntro(two)} 이 그림에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: two.fig });
    }),
    T('stem-mean-leaf', '평균을 알 때 줄기와 잎 그림의 가려진 잎 구하기', '①14', (d) => {
      const c = d.pick(STEMS.filter((x) => x.stems[0] >= 1 && x.stems[0] < 10)), s0 = d.pick(c.stems), u = c.unit;
      const data = d.until(() => stemData(d, s0, [3, 3, 3]), (x) => sum(x.values) % 9 === 0 && x.rows[1][1].some((l) => l > 0));
      const at = d.pick(range(0, 2).filter((i) => data.rows[1][1][i] > 0)), leaf = data.rows[1][1][at], stem = data.rows[1][0], mean = sum(data.values) / 9;
      const rows = data.rows.map(([s, leaves], r) => [s, leaves.map((l, i) => (r === 1 && i === at ? '' : l))]), shown = data.values.filter((v, i) => i !== 3 + at);
      return N(`다음은 학생 9명의 ${wj(c.what, '을/를')} 조사하여 나타낸 줄기와 잎 그림인데 잎 하나가 가려져 있다. 이 자료의 평균이 ${amt(mean, u)}일 때, 가려진 잎은?`, leaf, {
        figure: stemFig(rows, { unit: u }), explain: `변량의 총합은 ${mean} × 9 = ${mean * 9}이고, 보이는 변량 8개의 합은 ${sum(shown)}이므로 가려진 변량은 ${mean * 9} − ${sum(shown)} = ${stem * 10 + leaf}이다. 따라서 가려진 잎은 ${leaf}이다.`,
        facts: { calc: [[`9*${mean}-(${shown.join('+')})-${stem * 10}`, 0]], unseen: [stem * 10] }
      });
    })
  ];
  // 두 반을 나란히 놓은 줄기와 잎 그림. 두 반의 학생 수는 같고, 가장 큰 값·줄기마다의 잎의 수·끝 줄기의 잎의 수가 서로 다르다.
  function newTwoStem(d) {
    const c = d.pick(STEMS.filter((x) => x.stems[0] < 10)), s0 = d.pick(c.stems), names = d.pick([['1반', '2반'], ['A 동아리', 'B 동아리']]);
    return d.until(() => {
      const left = stemData(d, s0, d.shuffle([2, 4, 3, 3])), right = stemData(d, s0, d.shuffle([2, 4, 3, 3]));
      const rows = left.rows.map(([s, leaves], i) => [s, leaves, right.rows[i][1]]);
      return { c, names, rows, a: left.values, b: right.values, fig: stemFig2(rows, names, c.unit) };
    }, (x) => { const last = x.rows[3], mid = x.rows[1]; return x.a[0] > 0 && x.b[0] > 0 && Math.max(...x.a) !== Math.max(...x.b) && last[1].length !== last[2].length && mid[1].length !== mid[2].length && mid[2].length >= 3 && mid[2][1] > mid[2][0] && new Set(x.b.slice(-5)).size === 5; });
  }
  const twoIntro = (two) => `다음은 ${two.names[0] === '1반' ? '어느 학교 1반과 2반 학생들' : 'A 동아리와 B 동아리 학생들'}의 ${wj(two.c.what, '을/를')} 조사하여 나타낸 줄기와 잎 그림이다.`;

  // ═══ 도수분포표 ═══
  const TABLE = [
    T('tab-word', '변량·계급·계급의 크기·도수의 뜻', '①26', (d) => {
      const rows = [['변량', '키, 점수와 같이 자료를 수량으로 나타낸 것'], ['계급', '변량을 일정한 간격으로 나눈 구간'], ['계급의 크기', '변량을 나눈 구간의 너비'], ['도수', '각 계급에 속하는 변량의 개수'], ['도수분포표', '자료를 몇 개의 계급으로 나누고 각 계급의 도수를 조사하여 나타낸 표']];
      const at = d.int(0, 4), options = d.shuffle(rows.filter((r, i) => i === at || i !== (at + 2) % 5).map((r) => r[0]));
      return C('다음 설명에 알맞은 용어는?', options, options.indexOf(rows[at][0]), { figure: lines([rows[at][1]]), explain: `${wj(rows[at][1], '을/를')} ${wj(rows[at][0], '이라고/라고')} 한다.`, facts: { truth: options.map((w) => w === rows[at][0]), want: true } });
    }),
    T('tab-tally', '자료를 도수분포표로 정리하기', '①27 ①28 ②37', (d) => {
      // 경계값(계급의 끝 값)과 같은 변량이 여러 번 나오는 자료. ㉠, ㉡은 이웃한 두 계급의 도수이다.
      const c = d.pick(GC.filter((x) => x.frames[0][1] >= 5)), [lo, size] = c.frames[0], k = 4, j = d.int(0, 1);
      const data = d.until(() => { const l = many(d, 15, lo, lo + size * k - 1); return l.concat([lo + size * (j + 1), lo + size * (j + 1), lo + size * (j + 2), lo + size * j, lo + size * (j + 1) - 1]); }, (l) => range(0, k - 1).every((i) => l.filter((v) => v >= lo + i * size && v < lo + (i + 1) * size).length >= 2));
      const f = range(0, k - 1).map((i) => data.filter((v) => v >= lo + i * size && v < lo + (i + 1) * size).length), g = grp(c, lo, size, f), list = d.shuffle(data), b = g.at(j + 1);
      const label = (v) => 'c' + Math.floor((v - lo) / size);
      return M(`다음은 학생 ${g.total}명의 ${wj(c.what, '을/를')} 조사하여 나타낸 자료와 이 자료를 정리한 도수분포표이다. ㉠, ㉡에 알맞은 수는?`, [{ label: '㉠', answer: f[j] }, { label: '㉡', answer: f[j + 1] }], {
        figure: dataFig(list, c.unit) + ftab(g, { cells: f.map((v, i) => (i === j ? box('㉠') : i === j + 1 ? box('㉡') : v)) }),
        explain: `${amtj(b, c.unit, '은/는')} 「${amt(b, c.unit)} 이상」인 계급에 속한다. ${g.cls(j)}인 변량은 ${f[j]}개, ${g.cls(j + 1)}인 변량은 ${f[j + 1]}개이다.`,
        facts: { tallyOf: { list: list.map(label), target: 'c' + j }, parts: [[`${g.total}-(${f.filter((v, i) => i !== j + 1).join('+')})`, 1]] }
      });
    }),
    T('tab-blank-ends', '도수분포표의 빈칸: 계급의 끝 값과 도수', '②39', (d) => {
      const g = newGrp(d, { k: 5, total: d.pick([25, 30]) }), i = d.int(1, 3), j = d.until(() => d.int(0, 4), (v) => v !== i), u = g.u;
      return M(`${introG(g, '도수분포표')} ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: '㉠', answer: g.at(i) }, { label: '㉡', answer: g.at(i + 1) }, { label: '㉢', answer: g.f[j] }], {
        figure: ftab(g, { first: { [i]: `${box('㉠')} ~ ${box('㉡')}` }, cells: g.f.map((v, r) => (r === j ? box('㉢') : v)) }),
        explain: `계급의 크기는 ${g.at(i === 1 ? 3 : 1)} − ${g.at(i === 1 ? 2 : 0)} = ${amt(g.size, u)}로 모두 같고 계급은 이어져 있으므로 ㉠ = ${g.at(i)}, ㉡ = ${g.at(i + 1)}이다. ㉢ = ${g.total} − (${g.f.filter((v, r) => r !== j).join(' + ')}) = ${g.f[j]}이다.`,
        facts: { calc: [[String(g.at(i)), 0], [String(g.at(i + 1)), 1], [`${g.total}-(${g.f.filter((v, r) => r !== j).join('+')})`, 2]] }
      });
    }),
    T('tab-size-count', '도수분포표에서 계급의 크기와 계급의 개수', '①29 ②41', (d) => {
      const g = newGrp(d, { total: d.pick([24, 28, 30, 32]) });
      return M(`${introG(g, '도수분포표')} 계급의 크기와 계급의 개수는?`, [{ label: '계급의 크기', answer: g.size, unit: g.u }, { label: '계급의 개수', answer: g.k, unit: '개' }], {
        figure: ftab(g), explain: `계급의 크기는 계급의 양 끝 값의 차이므로 ${g.at(1)} − ${g.at(0)} = ${amt(g.size, g.u)}이다. 계급은 ${g.cls(0)}부터 ${g.cls(g.k - 1)}까지 ${g.k}개이다.`,
        facts: { calc: [[`${g.at(1)}-${g.at(0)}`, 0], [String(g.k), 1]], unseen: [g.k] }
      });
    }),
    T('tab-class-max', '도수가 가장 큰 계급, 도수가 주어진 계급', '①30 ②42', (d) => {
      const max = d.bool(), g = newGrp(d, { total: d.pick([25, 30, 35]), ok: (f) => f.filter((v) => v === Math.max(...f)).length === 1 && new Set(f).size === f.length });
      const at = max ? g.f.indexOf(Math.max(...g.f)) : d.until(() => d.int(0, g.k - 1), (i) => g.f[i] !== Math.max(...g.f)), target = g.f[at];
      return C(`${introG(g, '도수분포표')} ${max ? '도수가 가장 큰 계급은?' : `도수가 ${target}${g.c.cnt}인 계급은?`}`, classOptions(g), at, { figure: ftab(g), explain: `${max ? `도수가 가장 큰 계급은 도수가 ${target}${g.c.cnt}인` : `도수가 ${target}${g.c.cnt}인 계급은`} ${g.cls(at)}${max ? '인 계급' : ''}이다.`, facts: { choose: max ? { exprs: g.f.map(String), rule: 'max' } : { exprs: g.f.map(String), rule: 'equals', target } } });
    }),
    T('tab-missing', '합계에서 빼어 빈칸의 도수 구하기', '①31 ②40', (d) => {
      const g = newGrp(d, { total: d.pick([30, 35, 40, 50]) }), j = d.int(1, g.k - 2), rest = g.f.filter((v, i) => i !== j);
      return N(`${introG(g, '도수분포표')} ${V('A')}의 값은?`, g.f[j], { figure: ftab(g, { cells: g.f.map((v, i) => (i === j ? V('A') : v)) }), explain: `도수의 총합이 ${g.total}이므로 ${V('A')} = ${g.total} − (${rest.join(' + ')}) = ${g.f[j]}이다.`, facts: { calc: [[`${g.total}-(${rest.join('+')})`, 0]] } });
    }),
    T('tab-range-sum', '도수분포표에서 범위에 드는 도수의 합', '①32 ②43 ②45', (d, n) => {
      // 차례 0: 기준 미만(이상)인 수. 차례 1: 합계 칸이 빈 표에서 전체 수. 차례 2: 두 범위의 도수의 차.
      const g = newGrp(d, { total: d.pick([26, 28, 32, 34, 36]), ok: (f) => sum(f.slice(0, 2)) !== sum(f.slice(-2)) }), c = g.c, u = g.u, what = wj(c.what, '이/가');
      if (n === 0) {
        const under = d.bool(), j = under ? d.int(2, 3) : g.k - d.int(2, 3), part = under ? g.f.slice(0, j) : g.f.slice(j);
        return N(`${introG(g, '도수분포표')} ${what} ${amt(g.at(j), u)} ${under ? '미만' : '이상'}인 학생은 모두 몇 명인가?`, sum(part), { unit: '명', figure: ftab(g), explain: `${amt(g.at(j), u)} ${under ? '미만' : '이상'}인 계급의 도수를 모두 더하면 ${part.join(' + ')} = ${sum(part)}(명)이다.`, facts: { calc: [[part.join('+'), 0]] } });
      }
      if (n === 1) return N(`다음은 어느 반 학생들의 ${wj(c.what, '을/를')} 조사하여 나타낸 도수분포표이다. ㉠에 알맞은 수는?`, g.total, { figure: ftab(g, { total: box('㉠') }), explain: `합계 칸에는 도수의 총합을 적는다. ㉠ = ${g.f.join(' + ')} = ${g.total}이다.`, facts: { calc: [[g.f.join('+'), 0]] } });
      const low = g.f.slice(0, 2), high = g.f.slice(-2), more = sum(low) > sum(high);
      const a = `${what} ${amt(g.at(2), u)} 미만인 학생`, b = `${what} ${amt(g.at(g.k - 2), u)} 이상인 학생`;
      return N(`${introG(g, '도수분포표')} ${more ? a : b}은 ${more ? b : a}보다 몇 명 더 많은가?`, Math.abs(sum(low) - sum(high)), { unit: '명', figure: ftab(g), explain: `${amt(g.at(2), u)} 미만인 학생은 ${low.join(' + ')} = ${sum(low)}(명), ${amt(g.at(g.k - 2), u)} 이상인 학생은 ${high.join(' + ')} = ${sum(high)}(명)이므로 차는 ${Math.abs(sum(low) - sum(high))}명이다.`, facts: { calc: [[more ? `(${low.join('+')})-(${high.join('+')})` : `(${high.join('+')})-(${low.join('+')})`, 0]] } });
    }, { count: 3 }),
    T('tab-percent', '도수분포표에서 범위에 드는 비율', '①33 ②46 심33', (d, n) => {
      // 차례 0: 두 계급에 걸친 범위의 비율. 차례 1: 빈 도수 하나를 채운 뒤 기준 이상의 비율.
      const total = d.pick([20, 25, 40, 50]);
      if (n === 0) {
        const g = newGrp(d, { total, ok: (f) => range(1, f.length - 3).some((j) => Number.isInteger(pctOf(f[j] + f[j + 1], total))) }), j = d.pick(range(1, g.k - 3).filter((i) => Number.isInteger(pctOf(g.f[i] + g.f[i + 1], total)))), p = pctOf(g.f[j] + g.f[j + 1], total);
        return N(`${introG(g, '도수분포표')} ${wj(g.c.what, '이/가')} ${amt(g.at(j), g.u)} 이상 ${amt(g.at(j + 2), g.u)} 미만인 학생은 전체의 몇 %인가?`, p, { unit: ' %', figure: ftab(g), explain: `${amt(g.at(j), g.u)} 이상 ${amt(g.at(j + 2), g.u)} 미만인 학생은 ${g.f[j]} + ${g.f[j + 1]} = ${g.f[j] + g.f[j + 1]}(명)이므로 ${g.f[j] + g.f[j + 1]} ÷ ${total} × 100 = ${p}(%)이다.`, facts: { calc: [[`100*(${g.f[j]}+${g.f[j + 1]})/${total}`, 0]], unseen: [100] } });
      }
      const g = newGrp(d, { total, k: 5, ok: (f) => Number.isInteger(pctOf(f[3] + f[4], total)) }), p = pctOf(g.f[3] + g.f[4], total), known = g.f.slice(0, 3).concat([g.f[4]]);
      return N(`${introG(g, '도수분포표')} ${wj(g.c.what, '이/가')} ${amt(g.at(3), g.u)} 이상인 학생은 전체의 몇 %인가?`, p, { unit: ' %', figure: ftab(g, { cells: g.f.map((v, i) => (i === 3 ? V('A') : v)) }), explain: `${V('A')} = ${total} − (${known.join(' + ')}) = ${g.f[3]}이다. ${amt(g.at(3), g.u)} 이상인 학생은 ${g.f[3]} + ${g.f[4]} = ${g.f[3] + g.f[4]}(명)이므로 ${g.f[3] + g.f[4]} ÷ ${total} × 100 = ${p}(%)이다.`, facts: { calc: [[`100*(${total}-(${g.f.slice(0, 3).join('+')}))/${total}`, 0]], unseen: [100] } });
    }, { count: 2 }),
    T('tab-two-blanks', '비율 조건으로 도수분포표의 빈칸 둘 채우기', '①36 ①37 ②80 심35', (d, n) => {
      // 차례 0: 기준 미만인 학생이 전체의 몇 %. 차례 1: 한 계급의 도수가 기준 이상인 학생 수의 몇 분의 일.
      const total = d.pick([20, 25, 40, 50]);
      if (n === 0) {
        const g = newGrp(d, { total, k: 5, ok: (f) => Number.isInteger(pctOf(f[0] + f[1], total)) && f[1] !== f[2] }), p = pctOf(g.f[0] + g.f[1], total), below = total * p / 100;
        return M(`${introG(g, '도수분포표')} ${wj(g.c.what, '이/가')} ${amt(g.at(2), g.u)} 미만인 학생이 전체의 ${p} %일 때, ${V('A')}, ${V('B')}의 값은?`, [{ label: 'A', answer: g.f[1] }, { label: 'B', answer: g.f[2] }], {
          figure: ftab(g, { cells: g.f.map((v, i) => (i === 1 ? V('A') : i === 2 ? V('B') : v)) }),
          explain: `${amt(g.at(2), g.u)} 미만인 학생은 ${total} × ${p} ÷ 100 = ${below}(명)이므로 ${V('A')} = ${below} − ${g.f[0]} = ${g.f[1]}이다. ${V('B')} = ${total} − (${g.f[0]} + ${g.f[1]} + ${g.f[3]} + ${g.f[4]}) = ${g.f[2]}이다.`,
          facts: { calc: [[`${total}*${p}/100-${g.f[0]}`, 0], [`${total}-${total}*${p}/100-(${g.f[3]}+${g.f[4]})`, 1]], unseen: [100] }
        });
      }
      const q = d.pick([3, 4]), g = newGrp(d, { total, k: 5, ok: (f) => sum(f.slice(2)) === q * f[2] && f[2] !== f[3] }), over = sum(g.f.slice(2));
      return M(`${introG(g, '도수분포표')} ${g.cls(2)}인 계급의 도수가 ${amt(g.at(2), g.u)} 이상인 학생 수의 ${frac(1, q)}일 때, ${V('A')}, ${V('B')}의 값은?`, [{ label: 'A', answer: g.f[2] }, { label: 'B', answer: g.f[3] }], {
        figure: ftab(g, { cells: g.f.map((v, i) => (i === 2 ? V('A') : i === 3 ? V('B') : v)) }),
        explain: `${amt(g.at(2), g.u)} 이상인 학생은 ${total} − (${g.f[0]} + ${g.f[1]}) = ${over}(명)이므로 ${V('A')} = ${over} ÷ ${q} = ${g.f[2]}이다. ${V('B')} = ${over} − ${g.f[2]} − ${g.f[4]} = ${g.f[3]}이다.`,
        facts: { calc: [[`(${total}-(${g.f[0]}+${g.f[1]}))/${q}`, 0], [`(${total}-(${g.f[0]}+${g.f[1]}))-(${total}-(${g.f[0]}+${g.f[1]}))/${q}-${g.f[4]}`, 1]] }
      });
    }, { count: 2 }),
    T('tab-claims', '도수분포표에 대한 설명 가리기', '②48 심32', (d) => {
      const total = d.pick([20, 25, 40, 50]), g = newGrp(d, { total, k: 5, ok: (f) => f.filter((v) => v === Math.max(...f)).length === 1 && Number.isInteger(pctOf(f[3] + f[4], total)) && f[1] !== f[2] }), c = g.c, u = g.u, wantTrue = d.bool();
      const top = g.f.indexOf(Math.max(...g.f)), v = inside(g, 1), p = pctOf(g.f[3] + g.f[4], total), what = wj(c.what, '이/가');
      const rows = [
        [`계급의 크기는 ${amt(g.size, u)}이다.`, `계급의 크기는 ${amt(g.k, u)}이다.`, `계급의 크기는 ${g.at(1)} − ${g.at(0)} = ${amt(g.size, u)}이다.`],
        [`도수가 가장 큰 계급은 ${g.cls(top)}이다.`, `도수가 가장 큰 계급은 ${g.cls(g.k - 1)}이다.`, `도수가 가장 큰 계급은 도수가 ${g.f[top]}명인 ${g.cls(top)}이다.`],
        [`${what} ${amt(v, u)}인 학생이 속하는 계급의 도수는 ${g.f[1]}명이다.`, `${what} ${amt(v, u)}인 학생이 속하는 계급의 도수는 ${g.f[2]}명이다.`, `${amtj(v, u, '은/는')} ${g.cls(1)}인 계급에 속하고 그 도수는 ${g.f[1]}명이다.`],
        [`${what} ${amt(g.at(2), u)} 미만인 학생은 ${g.f[0] + g.f[1]}명이다.`, `${what} ${amt(g.at(2), u)} 미만인 학생은 ${g.f[0] + g.f[1] + g.f[2]}명이다.`, `${amt(g.at(2), u)} 미만인 학생은 ${g.f[0]} + ${g.f[1]} = ${g.f[0] + g.f[1]}(명)이다.`],
        [`${what} ${amt(g.at(3), u)} 이상인 학생은 전체의 ${p} %이다.`, `${what} ${amt(g.at(3), u)} 이상인 학생은 전체의 ${g.f[3] + g.f[4]} %이다.`, `${amt(g.at(3), u)} 이상인 학생은 ${g.f[3] + g.f[4]}명이므로 전체의 ${g.f[3] + g.f[4]} ÷ ${total} × 100 = ${p}(%)이다.`]
      ].filter((r) => r[0] !== r[1]);
      return pickClaim(d, `${introG(g, '도수분포표')} 이 표에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: ftab(g) });
    })
  ];

  B.addUnit({
    id: '7-2-5', grade: 7, semester: 2, no: 5, title: '자료의 정리와 해석', version: 1,
    groups: [
      { id: 'rep', title: '대푯값', standard: STD1, types: REP },
      { id: 'stem', title: '줄기와 잎 그림', standard: STD2, types: STEM },
      { id: 'table', title: '도수분포표', standard: STD2, types: TABLE },
      { id: 'hist', title: '히스토그램', standard: STD2, types: [] },
      { id: 'poly', title: '도수분포다각형', standard: STD2, types: [] },
      { id: 'rel', title: '상대도수와 그 분포표', standard: STD3, types: [] },
      { id: 'relg', title: '상대도수의 그래프와 두 집단의 비교', standard: STD3, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(7-2-5b.js, 7-2-5c.js)이 함께 쓰는 도구
  B.kit.m725 = {
    STD1, STD2, STD3, T, sourceOf, sum, srt, median, tallyOf, topCount, modes, nth, modeAlt, many, sameList, isSorted, fx, nj, amt, ut, amtj, wj, pctOf, RAWS, rawIntro, STEMS, GC,
    freqs, grp, frameOf, newGrp, inside, introG, classOptions, dataFig, tbl, SUP, clsCell, ftab, stemFig, stemFig2, stemData, newStem, stemIntro, chart, histFig, polyFig, bothFig, relFig, relFig2, rels, r2, pickClaim
  };
})(typeof window !== 'undefined' ? window : globalThis);
