// 2학년 2학기 4단원 시각과 시간 — 기본 문항(달력)과 실력 문항.
// 단원 틀과 그림 도구(B.kit.g224)는 2-2-4a.js, 1시간과 걸린 시간·하루의 시간은 2-2-4b.js.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 시는 짧은바늘로, 분은 긴바늘로 읽는다는 것을 섞는다(긴바늘이 9를 가리키면 9시라고 읽는다).
//  - 짧은바늘이 두 숫자 사이에 있을 때 다가가는 숫자를 시로 읽는다(4시 55분을 5시 55분으로). 짧은바늘이 5에 거의 닿아 있어도 아직 4시이다.
//  - 「8시 10분 전」을 8시 10분이나 8시 50분으로 읽는다. 8시가 되기 10분 전이므로 7시 50분이다.
//  - 걸린 시간을 분끼리, 시끼리 따로 빼서 구한다(9시 40분 ~ 10시 20분을 20분이나 1시간 20분으로). 몇 시에서 끊어 세어야 한다.
//  - 시각의 숫자가 12를 지나 1로 돌아가는 것을 놓친다(오전 11시 ~ 오후 1시를 10시간으로, 11시에서 3시까지를 8바퀴로).
//  - 「1시간 25분」과 「80분」을 적힌 수만 보고 견준다.
//  - 달마다 날수가 다르다는 것, 같은 요일은 7일마다 돌아온다는 것을 달력이 눈앞에 없으면 쓰지 못한다.
//
// 싣는 기준(실력)
//  - ① 그림·상황의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 두 번 넘게 생각해야 풀리는 것만 싣는다.
//    기본에서 하는 일을 고르기로 바꾼 것은 싣지 않는다. 보기를 쓴 문항에는 보기마다 「어떤 아이가 고르는가」를 주석으로 달았다.
//  - 시계에서 고르는 문항은 겉으로 보아서는 가릴 수 없게, 긴바늘은 같고 짧은바늘만 숫자 한 칸씩 다른 시계를 섞는다.
//  - 달력은 한 달 안에서만 묻는다. 그 달의 날수를 알아야 하는 것(마지막 날의 요일, 한 요일의 횟수)까지 싣는다.
//
// 뺀 것과 까닭
//  - 큰 환산(심39의 3일 8시간 = 80시간, 심42의 3년 5개월 = 41개월·3년 11개월 = 47개월, ①48의 2일 1시간 = 49시간): 교육과정의 「지나친 단위 환산」.
//    일·시간은 2일 안쪽, 년·개월은 3년 안쪽에서만 실었다.
//  - 달을 넘는 날짜 셈과 여러 달에 걸친 기간의 날수(①63·64 심47·52): 조건을 두세 개 이어 가며 달을 넘기는 꼴이다. 한 달 안에서만 묻는다.
//  - 교시를 거꾸로 네 번 되짚기(심28), 빨리 가는 시계(심40), 거울에 비친 시계(심10): 어려움이 이 단원의 내용이 아니라 조건 풀이에서 온다.
//  - 160분 영화의 시작한 시각(심26의 변형): 「분을 시간과 분으로 바꾼 뒤 시각을 구하기」는 h-end-min 이 묻는다. 방향만 뒤집은 것이라 한 번만 실었다.
//  - 이틀 일정표에서 떠난 시각과 닿은 시각을 찾아 걸린 시간 구하기(심38): 표 읽기를 뺀 얼개가 h-next-day 와 같다.
//  - 달력에 표시하기·빈 달력 채우기(①58의 변형, 심50), 달력에서 알 수 있는 점 쓰기(심51): 그리기와 서술형.
//    「3일이 목요일일 때 9일의 요일」 같은 물음은 h-weekday-jump 가 묻는다.
//  - 날수가 30일인 달·31일인 달을 모두 고르기(①57·심43의 변형)는 실력에 한 번만 실었다(h-month-all).
//  - 「매주 수요일과 일요일」처럼 두 요일의 횟수를 더하기(①66): 한 요일의 횟수만 물었다(h-part-count). 볼 것은 그 달의 날수와 7일마다 돌아온다는 것이다.
//  - 주일·일은 「2주일 며칠 → 며칠」과 「며칠 → 1주일 며칠」, 년·개월은 「2년 몇 개월 → 개월」과 「개월 → 1년 몇 개월」로 수의 범위를 갈랐다(서로 답을 알려 주지 않게).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, lines, table, N, M, C } = B.kit;
  const G = B.kit.geo;
  const K = B.kit.g224;
  const { READ, SPAN, UNITS, TAGS, at, span, mins, numOf, clear, BIG, clock, DAYS_IN, WEEK, ORD, weekdayOf, calendar, weekdayOptions, setOptions, value, allClear, atOf, minsOf, ACTS } = K;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const asc = (x, y) => x - y;
  // 달력을 그리는 달(2월은 날수가 해마다 달라 그리지 않는다)
  const MONTHS = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // 한 달에서 그 요일인 날짜들
  const datesOf = (month, first, w) => Array.from({ length: DAYS_IN[month] }, (_, i) => i + 1).filter((day) => weekdayOf(first, day) === w);

  B.addTypes('2-2-4', 'cal', [
    T('cal-basic', '1주일은 7일, 1년은 12개월', '①53', () => M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 7 }, { label: LABELS[1], answer: 12 }], {
      figure: lines([`1주일은 ${box(LABELS[0])}일이다.`, `1년은 ${box(LABELS[1])}개월이다.`]), explain: '1주일은 7일이고, 1년은 1월부터 12월까지 12개월이다.', facts: { calc: [['7', 0], ['12', 1]], unseen: [7, 12] }
    })),
    T('week-to-days', '몇 주일 며칠을 날수로 나타내기', '①54', (d) => {
      // 1주일 며칠 ↔ 날수: 두 문항의 수가 겹치지 않게 여기서는 2주일, 거꾸로는 1주일로 낸다.
      const w = 2, r = d.int(1, 6);
      return N(`${w}주일 ${r}일은 며칠인가?`, w * 7 + r, {
        unit: '일', explain: `1주일은 7일이므로 ${w}주일은 7 + 7 = ${w * 7}(일)이다. ${w * 7} + ${r} = ${w * 7 + r}(일)`, facts: { calc: [[`${w}*7+${r}`, 0]], unseen: [7] }
      });
    }),
    T('week-from-days', '날수를 몇 주일 며칠로 나타내기', '①54 심41', (d) => {
      const v = d.int(8, 13);
      return M(`${v}일은 몇 주일 며칠인가?`, [{ answer: Math.floor(v / 7), unit: '주일' }, { answer: v % 7, unit: '일' }], {
        explain: `7일은 1주일이다. ${v}일은 ${Math.floor(v / 7) * 7}일보다 ${v % 7}일 더 긴 시간이므로 ${Math.floor(v / 7)}주일 ${v % 7}일이다.`, facts: { unit: [{ expr: String(v), base: 7, at: [0, 1] }] }
      });
    }),
    T('year-to-months', '몇 년 몇 개월을 개월로 나타내기', '①55', (d) => {
      // 몇 년 몇 개월 ↔ 개월: 두 문항의 수가 겹치지 않게 여기서는 2년, 거꾸로는 1년으로 낸다.
      const y = 2, r = d.int(1, 11);
      return N(`${y}년 ${r}개월은 몇 개월인가?`, y * 12 + r, {
        unit: '개월', explain: `1년은 12개월이므로 ${y}년은 12 + 12 = ${y * 12}(개월)이다. ${y * 12} + ${r} = ${y * 12 + r}(개월)`, facts: { calc: [[`${y}*12+${r}`, 0]], unseen: [12] }
      });
    }),
    T('year-from-months', '개월을 몇 년 몇 개월로 나타내기', '①55 심41', (d) => {
      const v = d.int(13, 23);
      return M(`${v}개월은 몇 년 몇 개월인가?`, [{ answer: Math.floor(v / 12), unit: '년' }, { answer: v % 12, unit: '개월' }], {
        explain: `12개월은 1년이다. ${v}개월은 ${Math.floor(v / 12) * 12}개월보다 ${v % 12}개월 더 긴 시간이므로 ${Math.floor(v / 12)}년 ${v % 12}개월이다.`, facts: { unit: [{ expr: String(v), base: 12, at: [0, 1] }] }
      });
    }),
    T('month-table', '달마다의 날수 표', '①56', (d) => {
      // 2월은 가리지 않는다(28일 또는 29일).
      const start = d.pick([1, 7]), months = [0, 1, 2, 3, 4, 5].map((i) => start + i), hidden = d.shuffle(months.filter((mo) => mo !== 2)).slice(0, 3).sort(asc);
      return M('달마다의 날수를 나타낸 표이다. ㉠, ㉡, ㉢에 알맞은 수는?', hidden.map((mo, i) => ({ label: LABELS[i], answer: DAYS_IN[mo] })), {
        figure: table(['월', '날수(일)'], months.map((mo) => [`${mo}월`, hidden.includes(mo) ? box(LABELS[hidden.indexOf(mo)]) : mo === 2 ? '28(29)' : DAYS_IN[mo]])),
        explain: hidden.map((mo) => `${mo}월은 ${DAYS_IN[mo]}일`).join(', ') + '까지 있다. 날수가 30일인 달은 4월, 6월, 9월, 11월이다.',
        facts: { calc: hidden.map((mo, i) => [String(DAYS_IN[mo]), i]), unseen: [30, 31], months: hidden }
      });
    }),
    T('month-pick', '날수가 30일인 달 고르기', '①57 심43', (d) => {
      const hit = d.pick([4, 6, 9, 11]), list = d.shuffle([hit, 2].concat(d.shuffle([1, 3, 5, 7, 8, 10, 12]).slice(0, 2)));
      return C('날수가 30일인 달은?', list.map((mo) => mo + '월'), list.indexOf(hit), {
        explain: '날수가 30일인 달은 4월, 6월, 9월, 11월이다. 2월은 28일(또는 29일)이고, 나머지 달은 31일이다.', facts: { truth: list.map((mo) => DAYS_IN[mo] === 30), want: true, months: list }
      });
    }),
    T('month-pair', '날수가 같은 달끼리 짝 짓기', '①57', (d) => {
      // 짝 넷 가운데 하나만 날수가 같다. 달 여덟은 모두 다르다.
      const pairs = d.until(() => { const eight = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 8); return [0, 2, 4, 6].map((i) => eight.slice(i, i + 2).sort(asc)); }, (list) => list.filter(([a, b]) => DAYS_IN[a] === DAYS_IN[b]).length === 1);
      const hit = pairs.findIndex(([a, b]) => DAYS_IN[a] === DAYS_IN[b]), [a, b] = pairs[hit];
      return C('날수가 같은 달끼리 짝 지은 것은?', pairs.map(([x, y]) => `${x}월과 ${y}월`), hit, {
        explain: `${a}월과 ${b}월은 모두 ${DAYS_IN[a]}일까지 있다. 날수가 30일인 달은 4월, 6월, 9월, 11월이고, 2월은 28일(또는 29일), 나머지 달은 31일이다.`,
        facts: { truth: pairs.map(([x, y]) => DAYS_IN[x] === DAYS_IN[y]), want: true, months: pairs }
      });
    }),
    T('cal-weekday', '달력에서 날짜의 요일 읽기', '①58', (d) => {
      const month = d.pick(MONTHS), first = d.int(0, 6), day = d.int(9, DAYS_IN[month]), w = weekdayOf(first, day), made = weekdayOptions(d, w);
      return C(`${month}월 ${day}일은 무슨 요일인가?`, made.options, made.answer, {
        figure: calendar(month, first), explain: `달력에서 ${day}일이 있는 칸의 맨 위를 보면 ${WEEK[w]}요일이다.`, facts: { truth: made.list.map((x) => x === w), want: true, cal: [month, first] }
      });
    }),
    T('cal-count', '한 요일이 있는 횟수', '①59 심45', (d) => {
      const month = d.pick(MONTHS), first = d.int(0, 6), w = d.int(0, 6), dates = datesOf(month, first, w);
      return N(`이 달에 ${WEEK[w]}요일은 모두 몇 번 있는가?`, dates.length, {
        unit: '번', figure: calendar(month, first), explain: `${WEEK[w]}요일인 날짜는 ${dates.join('일, ')}일이다. 모두 ${dates.length}번 있다.`,
        facts: { count: Array.from({ length: DAYS_IN[month] }, (_, i) => weekdayOf(first, i + 1) === w), cal: [month, first] }
      });
    }),
    T('cal-nth', '몇째 요일의 날짜', '①60', (d) => {
      // 첫째 주에 그 요일이 없는 달력: 둘째 줄에 있는 날짜가 첫째 ○요일이다.
      const month = d.pick(MONTHS), first = d.int(1, 6), w = d.int(0, first - 1), n = d.int(2, 4), dates = datesOf(month, first, w);
      return N(`이 달의 ${ORD[n - 1]} ${WEEK[w]}요일은 며칠인가?`, dates[n - 1], {
        unit: '일', figure: calendar(month, first), explain: `${WEEK[w]}요일인 날짜는 차례로 ${dates.join('일, ')}일이다. ${ORD[n - 1]} ${WEEK[w]}요일은 ${dates[n - 1]}일이다.`,
        facts: { parts: [[`${dates[0]}+7*${n - 1}`, 0]], cal: [month, first] }
      });
    }),
    T('cal-seven', '같은 요일인 날짜는 7일마다', '①59의 변형', (d) => {
      const w = d.int(0, 6), f = d.int(1, 3);
      return M(`어느 달의 ${WEEK[w]}요일인 날짜를 차례로 모두 적었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: f + 14 }, { label: LABELS[1], answer: f + 28 }], {
        figure: lines([`${f}일, ${f + 7}일, ${box(LABELS[0])}일, ${f + 21}일, ${box(LABELS[1])}일`]),
        explain: `같은 요일은 7일마다 돌아온다. ${f + 7} + 7 = ${f + 14}, ${f + 21} + 7 = ${f + 28}`, facts: { calc: [[`${f + 7}+7`, 0], [`${f + 21}+7`, 1]], unseen: [7] }
      });
    }),
    T('cal-week-shift', '1주일, 2주일 전과 후의 날짜', '①61 심44', (d) => {
      const month = d.pick(MONTHS), w = d.int(1, 2), after = d.bool(), day = after ? d.int(2, DAYS_IN[month] - 7 * w - 1) : d.int(7 * w + 2, DAYS_IN[month] - 1), ans = after ? day + 7 * w : day - 7 * w;
      return N(`${month}월 ${day}일에서 ${w}주일 ${after ? '후는' : '전은'} ${month}월 며칠인가?`, ans, {
        unit: '일', explain: `${w}주일은 ${7 * w}일이다. ${day} ${after ? '+' : '−'} ${7 * w} = ${ans}(일)`, facts: { calc: [[`${day}${after ? '+' : '-'}${w}*7`, 0]], unseen: [7] }
      });
    }),
    T('cal-after', '며칠 뒤의 요일', '①62', (d) => {
      const month = d.pick(MONTHS), first = d.int(0, 6), n = d.pick([9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20]), day = d.int(2, DAYS_IN[month] - n), w = weekdayOf(first, day + n), made = weekdayOptions(d, w);
      return C(`${month}월 ${day}일에서 ${n}일 후는 무슨 요일인가?`, made.options, made.answer, {
        figure: calendar(month, first), explain: `${day} + ${n} = ${day + n}이므로 ${n}일 후는 ${month}월 ${day + n}일이다. 달력에서 ${day + n}일은 ${WEEK[w]}요일이다.`,
        facts: { truth: made.list.map((x) => x === w), want: true, cal: [month, first] }
      });
    }),
    T('cal-weeks-after', '몇 주일 뒤의 날짜와 요일', '심49', (d) => {
      // 보기: 바른 것, 요일을 하루 밀어 센 것, 주일 수를 날수로 더한 것(3주일 후를 3일 후로), 1주일만 더한 것
      const month = d.pick(MONTHS), n = d.int(2, 3), day = d.int(1, 8), w = d.int(0, 6), date = day + 7 * n, said = (x, y) => `${x}일, ${WEEK[y % 7]}요일`;
      const right = said(date, w), rows = d.shuffle([right, said(date, w + 1), said(day + n, w + n), said(day + 7, w)]);
      return C(`${month}월 ${day}일은 ${WEEK[w]}요일이다. 이날에서 ${n}주일 후는 ${month}월 며칠이고 무슨 요일인가?`, rows, rows.indexOf(right), {
        explain: `${n}주일은 ${7 * n}일이므로 ${day} + ${7 * n} = ${date}(일)이다. 같은 요일은 7일마다 돌아오므로 ${n}주일 후도 ${WEEK[w]}요일이다.`,
        facts: { truth: rows.map((row) => row === right), want: true }
      });
    }),
    T('unit-claims', '단위를 바꾸어 나타낸 것 가운데 틀린 것', '①52 심39', (d) => {
      // 틀린 것은 하나: 60·24·7·12가 아니라 100이나 10으로 바꾼 것(1시간 20분 = 120분, 1년 2개월 = 12개월)
      // 같은 회차의 「2주일 며칠」「2년 몇 개월」 문항과 수가 겹치지 않게 주일과 년은 1로 둔다.
      const h = d.int(1, 2), m = d.int(1, 11) * 5, k = d.int(2, 9), w = 1, r = d.int(1, 6), y = 1, mo = d.int(1, 9), bad = d.int(0, 3);
      const rows = d.shuffle([
        { left: `${h}시간 ${m}분`, expr: `${h}*60+${m}`, v: h * 60 + m, unit: '분', slip: h * 100 + m },
        { left: `1일 ${k}시간`, expr: `24+${k}`, v: 24 + k, unit: '시간', slip: 10 + k },
        { left: `${w}주일 ${r}일`, expr: `${w}*7+${r}`, v: w * 7 + r, unit: '일', slip: w * 10 + r },
        { left: `${y}년 ${mo}개월`, expr: `${y}*12+${mo}`, v: y * 12 + mo, unit: '개월', slip: y * 10 + mo }
      ].map((row, i) => Object.assign(row, { said: i === bad ? row.slip : row.v })));
      const wrong = rows.find((row) => row.said !== row.v);
      return C('단위를 바꾸어 나타낸 것이다. 잘못 나타낸 것은?', rows.map((row) => `${row.left} = ${row.said}${row.unit}`), rows.indexOf(wrong), {
        explain: `1시간은 60분, 1일은 24시간, 1주일은 7일, 1년은 12개월이다. ${wrong.left}은 ${wrong.v}${wrong.unit}이다.`, facts: { claimed: rows.map((row) => [row.expr, row.said]), claimedWant: false }
      });
    })
  ]);

  // ── 실력 문제 ─────────────────────────────────────────────────
  B.addGroup('2-2-4', {
    id: 'hard', title: '실력 문제', standard: SPAN,
    types: [
      H('h-swap', '두 바늘을 바꾸어 읽기 쉬운 시각', '①13 심4', (d) => {
        // 보기마다 고르는 아이
        //  - k시 (h×5)분: 긴바늘이 가리키는 숫자를 시로, 짧은바늘이 지나온 숫자를 분으로 읽는 아이(두 바늘을 바꾸어 읽는다)
        //  - (h+1)시 m분: 짧은바늘이 다가가는 숫자를 시로 읽는 아이
        //  - h시 k분: 긴바늘이 가리키는 숫자를 그대로 분으로 읽는 아이
        const [h, m] = d.until(() => [d.int(1, 10), d.int(7, 10) * 5], ([x, y]) => clear(x, y) && y / 5 !== x && y / 5 !== x + 1), k = m / 5;
        const list = d.shuffle([[h, m], [k, h * 5], [h + 1, m], [h, k]]);
        return C('시계가 나타내는 시각은?', list.map(([x, y]) => at(x, y)), list.findIndex(([x, y]) => x === h && y === m), {
          figure: clock(h, m, BIG), explain: `짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있으므로 ${h}시가 지났고, 긴바늘이 ${josa(k, '을/를')} 가리키므로 ${m}분이다. 시는 짧은바늘로, 분은 긴바늘로 읽는다.`,
          facts: { kindPick: { kinds: list.map(value), target: h * 60 + m }, shown: [[h, m]] }
        });
      }, { standard: READ }),
      H('h-near-pick', '짧은바늘이 다음 숫자에 거의 닿은 시각의 시계', '심4 ①9·13', (d) => {
        // 세 시계는 긴바늘이 같은 곳을 가리키고 짧은바늘만 숫자 한 칸씩 다르다.
        //  - (h-1)시 m분: 짧은바늘이 h에 거의 닿아 있다. 「h시이면 짧은바늘이 h를 가리켜야 한다」고 여기는 아이가 고른다.
        //  - (h+1)시 m분: 짧은바늘이 h+1을 지나 있다. 두 숫자 가운데 어느 쪽이 시인지 헷갈리는 아이가 고른다.
        //  - h시 (60-m)분: 긴바늘을 12에서 거꾸로 세어 읽는 아이가 고른다(55분을 5분 자리로).
        const who = d.pick(NAMES), m = d.pick([50, 55]), h = d.until(() => d.int(2, 10), (x) => allClear([[x, m], [x - 1, m], [x + 1, m], [x, 60 - m]]));
        const list = d.shuffle([[h, m], [h - 1, m], [h + 1, m], [h, 60 - m]]);
        return C(`${name(who, '은/는')} ${at(h, m)}에 집을 나섰다. 이 시각을 나타내는 시계는?`, TAGS, list.findIndex(([x, y]) => x === h && y === m), {
          figure: G.tiles(list.map((t, i) => [TAGS[i], clock(t[0], t[1])])),
          explain: `${at(h, m)}에는 긴바늘이 ${josa(m / 5, '을/를')} 가리킨다. 아직 ${h + 1}시가 되지 않았으므로 짧은바늘은 ${josa(h, '과/와')} ${h + 1} 사이에 있고, ${h + 1}에 거의 닿아 있다.`,
          facts: { kindPick: { kinds: list.map(value), target: h * 60 + m }, shown: list }
        });
      }, { standard: READ }),
      H('h-before-pick', '「몇 시 몇 분 전」을 나타내는 시계', '①19 심12', (d) => {
        // 바른 시계는 (h-1)시 (60-k)분.
        //  - h시 k분: 「전」을 빼고 읽는 아이 / h시 (60-k)분: 분만 바꾸고 시는 그대로 두는 아이 / (h-1)시 k분: 시만 하나 줄이는 아이
        const k = d.pick([5, 10, 15]), h = d.until(() => d.int(2, 11), (x) => allClear([[x - 1, 60 - k], [x, k], [x, 60 - k], [x - 1, k]]));
        const list = d.shuffle([[h - 1, 60 - k], [h, k], [h, 60 - k], [h - 1, k]]);
        return C(`${h}시 ${k}분 전을 나타내는 시계는?`, TAGS, list.findIndex(([x, y]) => x === h - 1 && y === 60 - k), {
          figure: G.tiles(list.map((t, i) => [TAGS[i], clock(t[0], t[1])])),
          explain: `${h}시 ${k}분 전은 ${h}시가 되기 ${k}분 전이므로 ${h - 1}시 ${60 - k}분이다. 짧은바늘은 ${josa(h - 1, '과/와')} ${h} 사이에 있고, 긴바늘은 ${josa((60 - k) / 5, '을/를')} 가리킨다.`,
          facts: { kindPick: { kinds: list.map(value), target: (h - 1) * 60 + 60 - k }, shown: list }
        });
      }, { standard: READ }),
      H('h-before-words', '바늘이 있는 곳을 적은 글을 「몇 분 전」으로 읽기', '심13', (d) => {
        // 3시 50분으로 읽은 뒤 다시 바꾸는 두 단계. 「3시 10분 전」이라고 답하기 쉽다.
        const h = d.int(1, 11), k = d.pick([9, 10, 11]);
        return M(`시계의 짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있고, 긴바늘이 ${josa(k, '을/를')} 가리킨다. 이 시각은 몇 시 몇 분 전인가?`, [{ answer: h + 1, unit: '시' }, { answer: 60 - k * 5, unit: '분 전' }], {
          explain: `짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있고 긴바늘이 ${josa(k, '을/를')} 가리키므로 ${h}시 ${k * 5}분이다. ${60 - k * 5}분이 더 지나면 ${h + 1}시가 되므로 ${h + 1}시 ${60 - k * 5}분 전이다.`,
          facts: { calc: [[String(h + 1), 0], [`60-${k}*5`, 1]], unseen: [60, 5] }
        });
      }, { standard: READ }),
      H('h-cross', '시가 바뀌는 사이의 걸린 시간', '심31 ①31', (d) => {
        // 흔한 틀린 답: 분끼리 빼는 것(40 − 20 = 20분), 시가 바뀌었다고 1시간을 더하는 것(1시간 20분)
        const h = d.int(1, 10), m1 = d.int(7, 11) * 5, m2 = d.int(1, 5) * 5;
        return N(`지금 시각은 ${at(h, m1)}이다. 영화는 ${at(h + 1, m2)}에 시작한다. 영화가 시작할 때까지 몇 분 남았는가?`, 60 - m1 + m2, {
          unit: '분', explain: `${at(h, m1)}에서 ${h + 1}시까지 ${60 - m1}분, ${h + 1}시에서 ${at(h + 1, m2)}까지 ${m2}분이다. ${60 - m1} + ${m2} = ${60 - m1 + m2}(분)`,
          facts: { calc: [[`60-${m1}+${m2}`, 0]], unseen: [60] }
        });
      }),
      H('h-cross-long', '끝난 시각의 분이 더 작을 때 걸린 시간', '심24', (d) => {
        // 8시 20분 ~ 10시 10분: 시끼리, 분끼리 따로 빼면 2시간 10분이 된다. 1시간씩 간 뒤 남은 분을 몇 시에서 끊어 센다.
        const h1 = d.int(1, 8), m1 = d.int(4, 10) * 5, dh = d.int(1, 2), dm = d.until(() => d.int(3, 10) * 5, (x) => m1 + x > 60), h2 = h1 + dh + 1, m2 = m1 + dm - 60;
        return M(`기차가 ${at(h1, m1)}에 출발해서 ${at(h2, m2)}에 도착했다. 기차를 탄 시간은 몇 시간 몇 분인가?`, [{ answer: dh, unit: '시간' }, { answer: dm, unit: '분' }], {
          explain: `${at(h1, m1)}에서 ${dh}시간이 지나면 ${at(h1 + dh, m1)}이다. 거기서 ${h2}시까지 ${60 - m1}분, ${h2}시에서 ${at(h2, m2)}까지 ${m2}분이므로 ${60 - m1} + ${m2} = ${dm}(분)이 더 걸렸다.`,
          facts: { clock: [{ expr: `${mins(h2, m2)}-${mins(h1, m1)}`, parts: 'ms', at: 0 }] }
        });
      }),
      H('h-stopped', '12시를 지나는 사이에 긴바늘이 도는 바퀴 수', '심20', (d) => {
        // 11시에서 3시까지: 11 − 3 = 8이 아니라 12시를 지나 4시간이다.
        const h1 = d.int(9, 11), h2 = d.int(1, 4), n = 12 - h1 + h2;
        return N(`시계가 오전 ${h1}시에 멈추었다. 지금은 같은 날 오후 ${h2}시이다. 멈춘 시계의 긴바늘을 몇 바퀴 돌려야 지금 시각이 되는가?`, n, {
          unit: '바퀴', explain: `오전 ${h1}시에서 낮 12시까지 ${12 - h1}시간, 낮 12시에서 오후 ${h2}시까지 ${h2}시간이므로 모두 ${n}시간이다. 긴바늘은 1시간에 한 바퀴 돌므로 ${n}바퀴 돌려야 한다.`,
          facts: { calc: [[`12-${h1}+${h2}`, 0]], unseen: [12] }
        });
      }),
      H('h-unit-compare', '나타낸 방법이 다른 시간 견주기', '①33 심21·29', (d) => {
        // 분으로만 적은 시간이 두 시간 사이에 온다.
        //  - 「95분」을 고르는 아이: 적힌 수가 가장 큰 것을 고른다(1시간 55분은 115분이다).
        //  - 가장 짧은 「1시간 몇 분」을 고르는 아이는 드물다. 1시간을 60분으로 바꾸어야 견줄 수 있다.
        const who = d.shuffle(NAMES).slice(0, 3), [x, y, z] = d.until(() => [d.int(4, 11) * 5, d.int(13, 22) * 5, d.int(1, 8) * 5], ([p, q, r]) => 60 + r < q && q < 60 + p);
        const rows = d.shuffle([{ text: `1시간 ${x}분`, expr: `1*60+${x}`, v: 60 + x }, { text: `${y}분`, expr: String(y), v: y }, { text: `1시간 ${z}분`, expr: `1*60+${z}`, v: 60 + z }]);
        return C('세 사람이 줄넘기를 한 시간이다. 가장 오래 한 사람은?', who, rows.findIndex((row) => row.v === 60 + x), {
          figure: lines(rows.map((row, i) => `${who[i]}: ${row.text}`)), explain: `분으로 나타내면 ${rows.map((row, i) => `${who[i]} ${row.v}분`).join(', ')}이다. 가장 긴 시간은 ${60 + x}분이다.`,
          facts: { choose: { exprs: rows.map((row) => row.expr), rule: 'max' }, unseen: [60] }
        });
      }),
      H('h-later-end', '끝낸 시각을 구해 더 늦게 끝낸 사람 찾기', '①37 ①33', (d) => {
        // 한 사람은 먼저 시작해서 1시간 넘게 하고, 한 사람은 나중에 시작해서 1시간 안에 끝낸다. 끝낸 시각은 5분에서 15분 차이.
        const who = d.shuffle(NAMES).slice(0, 2);
        const made = d.until(() => { const h = d.int(1, 8); return [{ from: h * 60 + d.int(0, 5) * 5, dur: 60 + d.int(1, 6) * 5 }, { from: (h + 1) * 60 + d.int(0, 4) * 5, dur: d.int(4, 9) * 5 }]; },
          ([p, q]) => (p.from % 60) + (p.dur - 60) < 60 && (q.from % 60) + q.dur < 60 && Math.abs(p.from + p.dur - q.from - q.dur) >= 5 && Math.abs(p.from + p.dur - q.from - q.dur) <= 15);
        const rows = d.shuffle(made), ends = rows.map((row) => row.from + row.dur);
        return C('두 사람이 숙제를 시작한 시각과 숙제를 하는 데 걸린 시간이다. 숙제를 더 늦게 끝낸 사람은?', who, ends[0] > ends[1] ? 0 : 1, {
          figure: table(['이름', '시작한 시각', '걸린 시간'], rows.map((row, i) => [who[i], atOf(row.from), span(row.dur)])),
          explain: rows.map((row, i) => `${name(who[i], '은/는')} ${atOf(row.from)}에서 ${span(row.dur)}이 지난 ${atOf(ends[i])}에 끝냈다.`).join(' '),
          facts: { choose: { exprs: rows.map((row) => `${minsOf(row.from)}+${row.dur >= 60 ? `1*60+${row.dur - 60}` : row.dur}`), rule: 'max' }, unseen: [60] }
        });
      }),
      H('h-end-min', '분으로만 나타낸 시간이 지난 뒤의 시각', '심25', (d) => {
        const who = d.pick(NAMES), act = d.pick(ACTS), h = d.int(1, 9), m = d.int(0, 4) * 5, e = d.int(5, 35), v = 60 + e;
        return M(`${name(who, '은/는')} ${at(h, m)}부터 ${v}분 동안 ${act.did}. 끝낸 시각은 몇 시 몇 분인가?`, [{ answer: h + 1, unit: '시' }, { answer: m + e, unit: '분' }], {
          explain: `${v}분은 1시간 ${e}분이다. ${at(h, m)}에서 1시간이 지나면 ${at(h + 1, m)}이고, 거기서 ${e}분이 더 지나면 ${at(h + 1, m + e)}이다.`,
          facts: { clock: [{ expr: `${mins(h, m)}+${v}`, parts: 'ms', at: 0 }] }
        });
      }),
      H('h-pieces', '이어서 한 시간을 모아 끝난 시각 구하기', '①42 심27', (d) => {
        const h = d.int(1, 8), [a, b] = d.pick([[40, 10], [45, 15], [35, 10], [40, 15], [35, 20], [45, 10]]), total = 2 * a + b;
        return M(`축구 경기를 ${h}시에 시작했다. 전반전 ${a}분, 쉬는 시간 ${b}분, 후반전 ${a}분을 차례로 했다. 경기가 끝난 시각은 몇 시 몇 분인가?`, [{ answer: h + 1, unit: '시' }, { answer: total - 60, unit: '분' }], {
          explain: `${a} + ${b} + ${a} = ${total}(분)이고, ${total}분은 1시간 ${total - 60}분이다. ${h}시에서 1시간 ${total - 60}분이 지나면 ${at(h + 1, total - 60)}이다.`,
          facts: { clock: [{ expr: `${h}*60+${a}+${b}+${a}`, parts: 'ms', at: 0 }] }
        });
      }),
      H('h-lap-left', '긴바늘이 한 바퀴 돈 뒤 남은 시간', '심32', (d) => {
        const h1 = d.int(1, 8), m1 = d.int(1, 5) * 5, dm = d.int(1, 6) * 5, h2 = h1 + 2, m2 = m1 + dm;
        return M(`영화가 ${at(h1, m1)}에 시작해서 ${at(h2, m2)}에 끝난다. 영화가 시작하고 시계의 긴바늘이 한 바퀴 돌았다. 영화가 끝날 때까지 남은 시간은 몇 시간 몇 분인가?`, [{ answer: 1, unit: '시간' }, { answer: dm, unit: '분' }], {
          explain: `긴바늘이 한 바퀴 돌면 1시간이 지나 ${at(h1 + 1, m1)}이 된다. ${at(h1 + 1, m1)}에서 ${at(h2, m1)}까지 1시간, 거기서 ${at(h2, m2)}까지 ${dm}분이 남았다.`,
          facts: { clock: [{ expr: `${mins(h2, m2)}-${mins(h1, m1)}-60`, parts: 'ms', at: 0 }] }
        });
      }),
      H('h-table-longest', '시간표에서 가장 오래 하는 공연', '①36 심30', (d) => {
        // 세 공연의 걸린 시간이 5분이나 10분씩만 다르고, 끝난 시각의 분이 시작한 시각의 분보다 작은 공연이 섞여 있다(분끼리만 보면 가릴 수 없다).
        const names = d.shuffle(['합창', '연극', '마술', '무용', '인형극', '풍물놀이']).slice(0, 3);
        const rows = d.until(() => { let t = 60 + d.pick([0, 10, 20, 30]); return [0, 1, 2].map(() => { const dur = d.pick([50, 55, 60, 65, 70, 75]), row = { from: t, to: t + dur, dur }; t += dur + 10; return row; }); },
          (list) => new Set(list.map((row) => row.dur)).size === 3 && Math.max(...list.map((row) => row.dur)) - Math.min(...list.map((row) => row.dur)) <= 15 && list.some((row) => row.to % 60 < row.from % 60) && list.every((row) => row.to % 60 !== row.from % 60));
        const best = Math.max(...rows.map((row) => row.dur));
        return C('공연 시간표이다. 가장 오래 하는 공연은?', names, rows.findIndex((row) => row.dur === best), {
          figure: table(['공연', '시작', '끝'], rows.map((row, i) => [names[i], atOf(row.from), atOf(row.to)])),
          explain: rows.map((row, i) => `${josa(names[i], '은/는')} ${span(row.dur)}`).join(', ') + ' 동안 한다. 몇 시에서 끊어 세면 헷갈리지 않는다.',
          facts: { choose: { exprs: rows.map((row) => `${minsOf(row.to)}-${minsOf(row.from)}`), rule: 'max' }, unseen: [60] }
        });
      }),
      H('h-noon-min', '오전에서 오후로 넘어가는 시간(분까지)', '①47 심35', (d) => {
        // 흔한 틀린 답: 11 − 1 = 10시간으로 세는 것, 30분을 빼지 않고 2시간 30분이라고 하는 것
        const who = d.pick(NAMES), a = d.int(9, 11), m = d.pick([20, 30, 40]), b = d.int(1, 2), total = (12 - a) * 60 - m + b * 60;
        return M(`${name(who, '은/는')} 오전 ${a}시 ${m}분부터 오후 ${b}시까지 도서관에 있었다. 도서관에 있던 시간은 몇 시간 몇 분인가?`, [{ answer: Math.floor(total / 60), unit: '시간' }, { answer: total % 60, unit: '분' }], {
          explain: `오전 ${a}시 ${m}분부터 낮 12시까지 ${span((12 - a) * 60 - m)}, 낮 12시부터 오후 ${b}시까지 ${b}시간이다. 모두 ${span(total)}이다.`,
          facts: { clock: [{ expr: `12*60-(${a}*60+${m})+${b}*60`, parts: 'ms', at: 0 }], unseen: [12] }
        });
      }, { standard: UNITS }),
      H('h-midnight', '밤 12시를 넘는 시간', '심36', (d) => {
        // 흔한 틀린 답: 10 − 7 = 3시간. 밤 12시에서 끊어 세어야 한다.
        const who = d.pick(NAMES), a = d.int(9, 11), b = d.int(6, 8);
        return N(`${name(who, '은/는')} 오후 ${a}시에 잠들어서 다음 날 오전 ${b}시에 일어났다. 잠을 잔 시간은 몇 시간인가?`, 12 - a + b, {
          unit: '시간', explain: `오후 ${a}시부터 밤 12시까지 ${12 - a}시간, 밤 12시부터 다음 날 오전 ${b}시까지 ${b}시간이다. ${12 - a} + ${b} = ${12 - a + b}(시간)`,
          facts: { calc: [[`12-${a}+${b}`, 0]], unseen: [12] }
        });
      }, { standard: UNITS }),
      H('h-next-day', '첫째 날 오전부터 둘째 날 오후까지', '심37·38 ①50', (d) => {
        const a = d.int(8, 11), b = d.int(1, 5), total = 24 + 12 - a + b;
        return N(`배가 첫째 날 오전 ${a}시에 출발해서 둘째 날 오후 ${b}시에 도착했다. 배를 탄 시간은 몇 시간인가?`, total, {
          unit: '시간', explain: `첫째 날 오전 ${a}시부터 둘째 날 오전 ${a}시까지 24시간이다. 둘째 날 오전 ${a}시부터 낮 12시까지 ${12 - a}시간, 낮 12시부터 오후 ${b}시까지 ${b}시간이다. 24 + ${12 - a} + ${b} = ${total}(시간)`,
          facts: { calc: [[`24+12-${a}+${b}`, 0]], unseen: [24, 12] }
        });
      }, { standard: UNITS }),
      H('h-month-all', '날수가 30일인 달을 모두 찾기', '①57 심43', (d) => {
        // 틀린 묶음은 바른 묶음에서 한 달을 빼거나, 31일인 달·2월을 하나 더하거나, 한 달을 바꾼 것이다(달마다의 날수를 하나라도 잘못 알면 고른다).
        const n = d.int(2, 3), months = d.shuffle([4, 6, 9, 11]).slice(0, n).concat(d.shuffle([1, 3, 5, 7, 8, 10, 12]).slice(0, 4 - n), [2]).sort(asc);
        const labels = months.map((mo) => mo + '월'), flags = months.map((mo) => DAYS_IN[mo] === 30), made = setOptions(d, labels, flags);
        return C('다음 달 가운데 날수가 30일인 달을 모두 고른 것은?', made.options, made.answer, {
          figure: lines([labels.join(', ')]), explain: `날수가 30일인 달은 4월, 6월, 9월, 11월이다. 2월은 28일(또는 29일)이고, 나머지 달은 31일이다.`,
          facts: { sets: { labels, flags, options: made.sets }, months }
        });
      }, { standard: UNITS }),
      H('h-part-nth', '아랫부분이 보이지 않는 달력에서 몇째 요일의 날짜', '①65 심46', (d) => {
        const month = d.pick(MONTHS), first = d.int(0, 6), w = d.int(0, 6), n = d.int(3, 4), dates = datesOf(month, first, w);
        return N(`${month}월 달력의 아랫부분이 찢어져 보이지 않는다. 이 달의 ${ORD[n - 1]} ${WEEK[w]}요일은 며칠인가?`, dates[n - 1], {
          unit: '일', figure: calendar(month, first, 2), explain: `첫째 ${WEEK[w]}요일은 ${dates[0]}일이다. 같은 요일은 7일마다 돌아오므로 ${WEEK[w]}요일인 날짜는 ${dates.slice(0, n).join('일, ')}일로 이어진다. ${ORD[n - 1]} ${WEEK[w]}요일은 ${dates[n - 1]}일이다.`,
          facts: { calc: [[`${dates[0]}+7*${n - 1}`, 0]], unseen: [7, n - 1], cal: [month, first, 2] }
        });
      }, { standard: UNITS }),
      H('h-part-lastday', '아랫부분이 보이지 않는 달력에서 마지막 날의 요일', '①65 심46', (d) => {
        // 그 달이 며칠까지 있는지 알아야 한다. 30일까지인 달을 31일까지로(또는 거꾸로) 여기면 요일이 하루 어긋난다 — 그 요일을 보기에 꼭 넣는다.
        const month = d.pick(MONTHS), first = d.int(0, 6), days = DAYS_IN[month], w = weekdayOf(first, days), anchor = days - 28;
        const start = (w - (days === 31 ? d.int(1, 3) : d.int(0, 2)) + 7) % 7, list = [0, 1, 2, 3].map((i) => (start + i) % 7);
        return C(`${month}월 달력의 아랫부분이 찢어져 보이지 않는다. ${month}월의 마지막 날은 무슨 요일인가?`, list.map((x) => WEEK[x] + '요일'), list.indexOf(w), {
          figure: calendar(month, first, 2), explain: `${month}월은 ${days}일까지 있다. ${anchor}일이 ${WEEK[w]}요일이고 같은 요일은 7일마다 돌아오므로 ${anchor + 7}일, ${anchor + 14}일, ${anchor + 21}일, ${days}일도 ${WEEK[w]}요일이다.`,
          facts: { truth: list.map((x) => x === w), want: true, cal: [month, first, 2] }
        });
      }, { standard: UNITS }),
      H('h-part-count', '아랫부분이 보이지 않는 달력에서 한 요일의 횟수', '①66 심45', (d) => {
        // 3일과 같은 요일(31일이 있다면 31일이 되는 요일)만 묻는다: 31일까지 있는 달은 5번, 30일까지 있는 달은 4번이다.
        const month = d.pick(MONTHS), first = d.int(0, 6), w = weekdayOf(first, 3), dates = datesOf(month, first, w);
        return N(`${month}월 달력의 아랫부분이 찢어져 보이지 않는다. ${month}월에 ${WEEK[w]}요일은 모두 몇 번 있는가?`, dates.length, {
          unit: '번', figure: calendar(month, first, 2), explain: `${month}월은 ${DAYS_IN[month]}일까지 있다. ${WEEK[w]}요일인 날짜는 7일마다 돌아오므로 ${dates.join('일, ')}일이다. 모두 ${dates.length}번 있다.`,
          facts: { count: Array.from({ length: DAYS_IN[month] }, (_, i) => weekdayOf(first, i + 1) === w), cal: [month, first, 2] }
        });
      }, { standard: UNITS }),
      H('h-weekday-jump', '달력 없이 며칠 뒤의 요일 알아내기', '심48·50', (d) => {
        // 보기는 답이 든 이어진 네 요일이다. 7일씩 건너뛰지 않고 하루씩 세다 틀리면 옆 요일을 고른다.
        const day = d.int(2, 9), w = d.int(0, 6), weeks = d.int(1, 2), r = d.pick([-2, -1, 1, 2]), target = day + 7 * weeks + r, ans = (w + r + 7) % 7, made = weekdayOptions(d, ans);
        const same = Array.from({ length: weeks + 1 }, (_, i) => day + 7 * i);
        return C(`어느 달의 ${day}일은 ${WEEK[w]}요일이다. 같은 달 ${target}일은 무슨 요일인가?`, made.options, made.answer, {
          explain: `같은 요일은 7일마다 돌아오므로 ${same.join('일, ')}일이 ${WEEK[w]}요일이다. ${target}일은 ${day + 7 * weeks}일의 ${Math.abs(r)}일 ${r > 0 ? '뒤' : '앞'}이므로 ${WEEK[ans]}요일이다.`,
          facts: { truth: made.list.map((x) => x === ans), want: true }
        });
      }, { standard: UNITS })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
