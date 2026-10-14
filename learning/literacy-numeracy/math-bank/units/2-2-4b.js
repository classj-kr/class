// 2학년 2학기 4단원 시각과 시간 — 기본 문항(1시간과 걸린 시간, 하루의 시간).
// 단원 틀과 그림 도구(B.kit.g224)는 2-2-4a.js, 달력과 실력 문항은 2-2-4c.js.
//
// 싣는 기준(이 파일)
//  - 걸린 시간은 「시작한 시각의 분 ≤ 끝난 시각의 분」인 것만 기본에 싣는다(3시 10분 ~ 4시 30분). 시가 바뀌면서 분이 작아지는 것
//    (9시 40분 ~ 10시 20분)은 나누어 세어야 하므로 실력에 실었다. 풀이는 세로셈이 아니라 「몇 시에서 몇 시까지 1시간, 거기서 몇 분」으로 적는다.
//  - 「몇 시간 몇 분 ↔ 몇 분」은 3시간 안쪽(65분 ~ 175분), 「1일 몇 시간 ↔ 몇 시간」은 2일 안쪽(25시간 ~ 47시간)에서만 바꾼다.
//  - 표는 휴대폰 너비에 들어가게 세 칸(활동·시작·끝)으로 적고, 시각은 「10시 30분」처럼 적는다(「10:30」 꼴은 쓰지 않는다).
//  - 오전·오후는 고르기로 묻는다. 낮 12시·밤 12시가 답이 되는 물음은 내지 않는다.
//  - 서로 거꾸로인 환산 문항은 수의 범위를 갈랐다(시간·분 → 분은 5분 단위, 분 → 시간·분은 5분 단위가 아닌 수.
//    1일 몇 시간 → 시간은 26 ~ 35시간, 시간 → 1일 몇 시간은 37 ~ 46시간). 한 회차에서 한 문항이 다른 문항의 답을 알려 주지 않게 하려는 것이다.
//
// 뺀 것과 까닭
//  - 시간 띠·하루 시간 띠에 색칠하기(①29·46 심34): 색칠은 하지 않고, 색칠한 띠를 주고 시간을 물었다(hour-strip, day-strip).
//  - 걸린 시간이 같은 것끼리 잇기(①34): 긋기. 「걸린 시간이 같은 것」 고르기로 바꾸었다(span-same).
//  - 60분 뒤의 시각을 시계에 그리기(①37의 변형): 그리기. 「긴바늘이 몇 바퀴 돈 뒤의 시각」을 수로 물었다(end-laps).
//  - 3시 10분 ~ 4시처럼 몇 시가 될 때까지의 분(①31의 변형): 60에서 빼는 일은 before-left 와 hour-fill 이 묻는다. 숫자만 다른 것이라 따로 싣지 않았다.
//  - 걸린 시간을 두 가지로 나타낸 것을 모두 고르기(①32), 하루보다 긴 시간을 모두 고르기(①49): 답이 둘인 고르기.
//    앞의 것은 수로 두 가지를 적게 하고(span-both), 뒤의 것은 보기 가운데 하나만 하루보다 길게 했다(day-longer).
//  - 2시간 15분 숙제를 「6시 5분 전」에 끝냄(①38의 변형): 「전」 바꾸기와 거꾸로 세기를 엮은 것. 조건을 엮은 꼴이라 싣지 않았다.
//  - 하루 계획표를 스스로 만들기(①45의 변형): 정해진 답이 없다.
//  - 여러 활동을 나누어 칠한 하루 시간 띠(①45의 변형): 한 가지 활동만 칠한 띠로 줄여 실었다(day-strip-read, day-strip).
//  - 들어간 시각과 나온 시각을 시계 둘로 준 오전·오후 문항(①46·심35의 변형): 시계에는 오전·오후가 보이지 않아 글로 물었다(day-span).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, lines, tagged, table, N, M, C } = B.kit;
  const G = B.kit.geo;
  const K = B.kit.g224;
  const { at, span, mins, clear, why, BIG, clock, strip, dayStrip, setOptions } = K;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const asc = (x, y) => x - y;
  // 분으로 센 시각(1시 = 60) → 「몇 시 몇 분」
  const atOf = (t) => at(Math.floor(t / 60), t % 60), minsOf = (t) => mins(Math.floor(t / 60), t % 60);

  // 한 일: 이름, 「~했다」, 「~한」
  const ACTS = [
    { noun: '책 읽기', did: '책을 읽었다', what: '책을 읽은' },
    { noun: '그림 그리기', did: '그림을 그렸다', what: '그림을 그린' },
    { noun: '피아노 연습', did: '피아노 연습을 했다', what: '피아노 연습을 한' },
    { noun: '수영', did: '수영을 했다', what: '수영을 한' },
    { noun: '숙제', did: '숙제를 했다', what: '숙제를 한' },
    { noun: '축구', did: '축구를 했다', what: '축구를 한' }
  ];
  const SHOWS = ['요리', '목공', '도자기', '그림', '악기', '과학'];
  // 체험 시간표: 1시간이 안 되는 것 하나와 1시간이 넘는 것 둘을 1시부터 차례로 놓는다. 시작한 시각의 분보다 끝난 시각의 분이 작지 않다.
  // exact 이면 긴 것 하나를 꼭 1시간으로 한다.
  function schedule(d, exact) {
    const names = d.shuffle(SHOWS).slice(0, 3), roles = d.shuffle(['short', 'long', exact ? 'hour' : 'long']);
    let hour = 1;
    return roles.map((role, i) => {
      const m = d.pick([0, 10, 20]), dur = role === 'short' ? d.pick([30, 40]) : role === 'hour' ? 60 : 60 + d.pick([10, 20, 30]);
      const row = { name: names[i], from: hour * 60 + m, to: hour * 60 + m + dur, dur };
      hour += role === 'short' ? 1 : 2;
      return row;
    });
  }
  const scheduleTable = (rows) => table(['체험', '시작', '끝'], rows.map((row) => [row.name, atOf(row.from), atOf(row.to)]));
  K.atOf = atOf; K.minsOf = minsOf; K.ACTS = ACTS; K.SHOWS = SHOWS;

  B.addTypes('2-2-4', 'hour', [
    T('hour-sixty', '긴바늘이 한 바퀴 도는 시간과 1시간', '①24 심18', (d) => {
      const n = d.int(2, 3);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: 60 }, { label: LABELS[1], answer: n * 60 }], {
        figure: lines([`시계의 긴바늘이 한 바퀴 도는 데 걸리는 시간은 ${box(LABELS[0])}분이다.`, `긴바늘이 ${n}바퀴 도는 데 걸리는 시간은 ${box(LABELS[1])}분이다.`]),
        explain: `긴바늘이 한 바퀴 도는 데 걸리는 시간은 60분이고, 60분은 1시간이다. ${n}바퀴는 ${Array(n).fill(60).join(' + ')} = ${n * 60}(분)이다.`,
        facts: { calc: [['60', 0], [`${n}*60`, 1]], unseen: [60] }
      });
    }),
    T('hour-to-min', '몇 시간 몇 분을 분으로 나타내기', '①25 심21', (d) => {
      const h = d.int(1, 2), m = d.int(1, 11) * 5;
      return N(`${h}시간 ${m}분은 몇 분인가?`, h * 60 + m, {
        unit: '분', explain: `${h === 1 ? '1시간은 60분이다.' : `1시간은 60분이므로 ${h}시간은 ${h * 60}분이다.`} ${h * 60} + ${m} = ${h * 60 + m}(분)`, facts: { calc: [[`${h}*60+${m}`, 0]], unseen: [60] }
      });
    }),
    T('hour-from-min', '분을 몇 시간 몇 분으로 나타내기', '①26 심21', (d) => {
      const who = d.pick(NAMES), v = d.until(() => d.int(65, 175), (x) => x % 60 >= 2 && x % 5 !== 0);
      return M(`${name(who, '은/는')} 책을 ${v}분 동안 읽었다. 책을 읽은 시간은 몇 시간 몇 분인가?`, [{ answer: Math.floor(v / 60), unit: '시간' }, { answer: v % 60, unit: '분' }], {
        explain: `60분은 1시간이다. ${v}분은 ${Math.floor(v / 60) * 60}분보다 ${v % 60}분 더 긴 시간이므로 ${span(v)}이다.`, facts: { unit: [{ expr: String(v), base: 60, at: [0, 1] }] }
      });
    }),
    T('hour-laps', '짧은바늘이 가는 동안 긴바늘이 도는 바퀴 수', '①27 심19', (d) => {
      const a = d.int(1, 8), n = d.int(2, 4), b = a + n;
      return N(`시계의 짧은바늘이 숫자 ${a}에서 ${b}까지 가는 동안 긴바늘은 몇 바퀴 도는가?`, n, {
        unit: '바퀴', explain: `짧은바늘이 숫자 한 칸을 가는 데 1시간이 걸리고, 그동안 긴바늘은 한 바퀴 돈다. ${a}에서 ${b}까지는 ${n}칸이므로 긴바늘은 ${n}바퀴 돈다.`,
        facts: { calc: [[`${b}-${a}`, 0]] }
      });
    }),
    T('hour-stopped', '멈춘 시계를 맞추려면 돌려야 하는 바퀴 수', '①28', (d) => {
      const [h1, m] = d.until(() => [d.int(1, 7), d.pick([0, 10, 20, 30, 40, 50])], ([x, y]) => clear(x, y)), n = d.int(2, 4), h2 = h1 + n;
      return N(`멈춘 시계가 다음과 같다. 지금 시각은 ${at(h2, m)}이다. 시계를 맞추려면 긴바늘을 몇 바퀴 돌려야 하는가?`, n, {
        unit: '바퀴', figure: clock(h1, m, BIG), explain: `멈춘 시계는 ${josa(at(h1, m), '을/를')} 나타낸다. ${at(h1, m)}에서 ${at(h2, m)}까지는 ${n}시간이다. 긴바늘은 1시간에 한 바퀴 돌므로 ${n}바퀴 돌려야 한다.`,
        facts: { calc: [[`${h2}-${h1}`, 0]], shown: [[h1, m]] }
      });
    }),
    T('hour-strip', '시간 띠에 색칠한 시간', '①29', (d) => {
      const act = d.pick(ACTS), from = d.int(1, 9), hours = d.int(2, 3), n = d.pick(hours === 2 ? [7, 8, 9, 10, 11] : [8, 9, 10, 11, 13, 14, 15]), first = d.int(0, hours * 6 - n), total = n * 10;
      return M(`작은 칸 하나가 10분인 시간 띠에 ${act.what} 시간을 색칠했다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: total }, { label: LABELS[1], answer: Math.floor(total / 60) }, { label: LABELS[2], answer: total % 60 }], {
        figure: strip(from, hours, first, n) + lines([`색칠한 시간: ${box(LABELS[0])}분 = ${box(LABELS[1])}시간 ${box(LABELS[2])}분`]),
        explain: `색칠한 칸은 ${n}칸이고 한 칸은 10분이므로 ${total}분이다. 60분은 1시간이므로 ${total}분은 ${span(total)}이다.`,
        facts: { calc: [[`${n}*10`, 0]], unit: [{ expr: `${n}*10`, base: 60, at: [1, 2] }], strip: [from, hours, first, n] }
      });
    }),
    T('span-clocks', '두 시계를 보고 걸린 시간 구하기', '①30 심23', (d) => {
      const act = d.pick(ACTS), n = d.int(1, 3), [h, m] = d.until(() => [d.int(1, 8), d.int(1, 10) * 5], ([x, y]) => clear(x, y) && clear(x + n, y));
      return N(`${josa(act.noun, '을/를')} 시작한 시각과 끝낸 시각이다. 걸린 시간은 몇 시간인가?`, n, {
        unit: '시간', figure: G.tiles([['시작한 시각', clock(h, m)], ['끝낸 시각', clock(h + n, m)]]),
        explain: `시작한 시각은 ${at(h, m)}, 끝낸 시각은 ${at(h + n, m)}이다. 그동안 긴바늘이 ${n}바퀴 돌았으므로 ${n}시간이 걸렸다.`,
        facts: { calc: [[`${h + n}-${h}`, 0]], shown: [[h, m], [h + n, m]] }
      });
    }),
    T('span-text', '시작한 시각과 끝낸 시각으로 걸린 시간 구하기', '①31 심23', (d) => {
      const who = d.pick(NAMES), act = d.pick(ACTS), h1 = d.int(1, 9), m1 = d.int(0, 6) * 5, dh = d.int(1, 2), dm = d.int(1, 5) * 5, h2 = h1 + dh, m2 = m1 + dm;
      return M(`${name(who, '은/는')} ${at(h1, m1)}부터 ${at(h2, m2)}까지 ${act.did}. ${act.what} 시간은 몇 시간 몇 분인가?`, [{ answer: dh, unit: '시간' }, { answer: dm, unit: '분' }], {
        explain: `${at(h1, m1)}에서 ${at(h2, m1)}까지 ${dh}시간, ${at(h2, m1)}에서 ${at(h2, m2)}까지 ${dm}분이다.`, facts: { clock: [{ expr: `${mins(h2, m2)}-${mins(h1, m1)}`, parts: 'ms', at: 0 }] }
      });
    }),
    T('span-both', '걸린 시간을 두 가지로 나타내기', '①32', (d) => {
      const h1 = d.int(1, 9), m1 = d.int(0, 5) * 5, dh = d.int(1, 2), dm = d.int(1, 6) * 5, h2 = h1 + dh, m2 = m1 + dm, total = dh * 60 + dm, expr = `${mins(h2, m2)}-${mins(h1, m1)}`;
      return M(`버스가 ${at(h1, m1)}에 출발해서 ${at(h2, m2)}에 도착했다. 버스를 탄 시간을 두 가지로 나타내시오.`, [{ answer: dh, unit: '시간' }, { answer: dm, unit: '분' }, { label: '=', answer: total, unit: '분' }], {
        explain: `${at(h1, m1)}에서 ${at(h2, m1)}까지 ${dh}시간, 거기서 ${at(h2, m2)}까지 ${dm}분이다. ${dh}시간은 ${dh * 60}분이므로 ${dh * 60} + ${dm} = ${total}(분)이다.`,
        facts: { clock: [{ expr, parts: 'ms', at: 0 }], calc: [[expr, 2]] }
      });
    }),
    T('span-longer', '더 오래 한 사람', '①33', (d) => {
      // 걸린 시간이 5분이나 10분만 다르다. 시작한 시각도 끝낸 시각도 서로 다르다.
      const who = d.shuffle(NAMES).slice(0, 2), act = d.pick(ACTS);
      const rows = d.until(() => [0, 1].map(() => ({ h: d.int(1, 9), m: d.int(0, 6) * 5, extra: d.int(1, 6) * 5 })), ([x, y]) => x.m + x.extra < 60 && y.m + y.extra < 60 && Math.abs(x.extra - y.extra) >= 5 && Math.abs(x.extra - y.extra) <= 10 && x.h !== y.h && x.m !== y.m);
      return C(`두 사람이 ${josa(act.noun, '을/를')} 시작한 시각과 끝낸 시각이다. 더 오래 한 사람은?`, who, rows[0].extra > rows[1].extra ? 0 : 1, {
        figure: table(['이름', '시작', '끝'], rows.map((row, i) => [who[i], at(row.h, row.m), at(row.h + 1, row.m + row.extra)])),
        explain: `${name(who[0], '은/는')} ${span(60 + rows[0].extra)}, ${name(who[1], '은/는')} ${span(60 + rows[1].extra)} 동안 했다.`,
        facts: { choose: { exprs: rows.map((row) => `${mins(row.h + 1, row.m + row.extra)}-${mins(row.h, row.m)}`), rule: 'max' }, unseen: [60] }
      });
    }),
    T('span-same', '걸린 시간이 같은 활동 찾기', '①34', (d) => {
      // 보기 셋 가운데 하나만 걸린 시간이 같다. 하나는 10분이 다르고, 하나는 분은 같고 1시간이 더 길다(분만 보는 아이가 고른다).
      const who = d.pick(NAMES), names = d.shuffle(['종이접기', '줄넘기', '수영', '피아노', '축구', '바둑']).slice(0, 3);
      const made = d.until(() => { const dm = d.int(3, 6) * 5, pick = () => d.int(1, 9) * 60 + d.int(0, 5) * 5; return { dm, base: pick(), list: [[pick(), 60 + dm], [pick(), 60 + dm + d.pick([-10, 10])], [pick(), 120 + dm]] }; },
        // 끝난 시각의 분이 시작한 시각의 분보다 크고(시가 바뀌면서 분이 작아지지 않는다), 시작한 시각은 모두 다르다.
        (v) => { const all = [[v.base, 60 + v.dm]].concat(v.list); return all.every(([from, t]) => (from % 60) + (t % 60) < 60) && new Set(all.map(([from]) => from)).size === 4; });
      const dur = 60 + made.dm, rows = d.shuffle(made.list.map(([from, t]) => ({ from, to: from + t, dur: t })));
      return C(`${name(who, '은/는')} ${atOf(made.base)}부터 ${atOf(made.base + dur)}까지 책을 읽었다. 걸린 시간이 이와 같은 활동은?`, names, rows.findIndex((row) => row.dur === dur), {
        figure: table(['활동', '시작', '끝'], rows.map((row, i) => [names[i], atOf(row.from), atOf(row.to)])),
        explain: `책을 읽은 시간은 ${span(dur)}이다. ${rows.map((row, i) => `${names[i]} ${span(row.dur)}`).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map((row) => `${minsOf(row.to)}-${minsOf(row.from)}`), rule: 'equals', target: dur }, unseen: [60] }
      });
    }),
    T('table-one', '시간표에서 한 체험을 하는 시간', '①35 심29', (d) => {
      const rows = schedule(d, false), row = d.pick(rows.filter((r) => r.dur > 60));
      return N(`체험 시간표이다. ${row.name} 체험은 몇 분 동안 하는가?`, row.dur, {
        unit: '분', figure: scheduleTable(rows), explain: `${atOf(row.from)}에서 ${atOf(row.from + 60)}까지 1시간, 거기서 ${atOf(row.to)}까지 ${row.dur - 60}분이다. 1시간 ${row.dur - 60}분은 60 + ${row.dur - 60} = ${row.dur}(분)이다.`,
        facts: { calc: [[`${minsOf(row.to)}-${minsOf(row.from)}`, 0]], unseen: [60] }
      });
    }),
    T('table-under', '시간표에서 1시간보다 짧은 체험', '①36 심30', (d) => {
      const rows = schedule(d, true);
      return C('체험 시간표이다. 하는 시간이 1시간보다 짧은 체험은?', rows.map((row) => row.name), rows.findIndex((row) => row.dur < 60), {
        figure: scheduleTable(rows), explain: rows.map((row) => `${josa(row.name, '은/는')} ${span(row.dur)}`).join(', ') + ' 동안 한다. 1시간보다 짧은 체험은 하나뿐이다.',
        facts: { only: { values: rows.map((row) => row.dur), test: 'atMost', target: 59 }, spans: rows.map((row) => [row.from, row.to]) }
      });
    }),
    T('end-laps', '긴바늘이 몇 바퀴 돈 뒤의 시각', '①37', (d) => {
      const n = d.int(1, 3), [h, m] = d.until(() => [d.int(1, 8), d.int(1, 11) * 5], ([x, y]) => clear(x, y));
      return M(`시계가 나타내는 시각에서 긴바늘이 ${n}바퀴 돌았다. 몇 시 몇 분이 되는가?`, [{ answer: h + n, unit: '시' }, { answer: m, unit: '분' }], {
        figure: clock(h, m, BIG), explain: `시계가 나타내는 시각은 ${at(h, m)}이다. 긴바늘이 한 바퀴 돌면 1시간이 지난다. ${n}시간 뒤는 ${at(h + n, m)}이다.`,
        facts: { calc: [[`${h}+${n}`, 0], [`${m / 5}*5`, 1]], unseen: [5], shown: [[h, m]] }
      });
    }),
    T('end-text', '시작한 시각과 걸린 시간으로 끝낸 시각 구하기', '①37', (d) => {
      const who = d.pick(NAMES), act = d.pick(ACTS), h = d.int(1, 9), m = d.int(0, 5) * 5, dh = d.int(1, 2), dm = d.int(1, 5) * 5;
      return M(`${name(who, '은/는')} ${at(h, m)}부터 ${dh}시간 ${dm}분 동안 ${act.did}. 끝낸 시각은 몇 시 몇 분인가?`, [{ answer: h + dh, unit: '시' }, { answer: m + dm, unit: '분' }], {
        explain: `${at(h, m)}에서 ${dh}시간이 지나면 ${at(h + dh, m)}이다. 거기서 ${dm}분이 더 지나면 ${at(h + dh, m + dm)}이다.`, facts: { clock: [{ expr: `${mins(h, m)}+${dh}*60+${dm}`, parts: 'ms', at: 0 }] }
      });
    }),
    T('end-full', '분을 모으면 1시간이 되는 끝난 시각', '①37 심25', (d) => {
      const h = d.int(1, 8), m = d.pick([20, 30, 40]), dh = d.int(1, 2), dm = 60 - m;
      return N(`영화가 ${at(h, m)}에 시작했다. 영화는 ${dh}시간 ${dm}분 동안 한다. 영화가 끝나는 시각은 몇 시인가?`, h + dh + 1, {
        unit: '시', explain: `${at(h, m)}에서 ${dh}시간이 지나면 ${at(h + dh, m)}이다. 거기서 ${dm}분이 더 지나면 ${m} + ${dm} = 60(분)이므로 ${h + dh + 1}시가 된다.`,
        facts: { calc: [[`(${h}*60+${m}+${dh}*60+${dm})/60`, 0]], unseen: [60] }
      });
    }),
    T('start-clock', '끝낸 시각과 걸린 시간으로 시작한 시각 구하기', '①38 심26', (d) => {
      const who = d.pick(NAMES), act = d.pick(ACTS), [h, m, dh, dm] = d.until(() => [d.int(3, 11), d.int(4, 11) * 5, d.int(1, 2), d.int(1, 4) * 5], ([x, y, , e]) => clear(x, y) && y - e >= 5);
      return M(`${name(who, '은/는')} ${dh}시간 ${dm}분 동안 ${act.did}. 끝냈을 때 시계가 다음과 같았다. 시작한 시각은 몇 시 몇 분인가?`, [{ answer: h - dh, unit: '시' }, { answer: m - dm, unit: '분' }], {
        figure: clock(h, m, BIG), explain: `시계가 나타내는 시각은 ${at(h, m)}이다. ${dh}시간 전은 ${at(h - dh, m)}이고, 거기서 ${dm}분 전은 ${at(h - dh, m - dm)}이다.`,
        facts: { clock: [{ expr: `${h}*60+${m / 5}*5-${dh}*60-${dm}`, parts: 'ms', at: 0 }], unseen: [5], shown: [[h, m]] }
      });
    }),
    T('hour-fill', '1시간이 되려면 더 해야 하는 시간', '①39 심22', (d) => {
      const act = d.pick(ACTS), [h, m] = d.until(() => [d.int(1, 11), d.int(4, 10) * 5], ([x, y]) => clear(x, y));
      return N(`${josa(act.noun, '을/를')} 1시간 동안 하려고 한다. 시작한 시각과 지금 시각이 다음과 같다. 몇 분을 더 하면 1시간이 되는가?`, 60 - m, {
        unit: '분', figure: G.tiles([['시작한 시각', clock(h, 0)], ['지금 시각', clock(h, m)]]),
        explain: `시작한 시각은 ${h}시, 지금 시각은 ${at(h, m)}이다. ${m}분 동안 했으므로 60 − ${m} = ${60 - m}(분)을 더 하면 1시간이 된다.`,
        facts: { calc: [[`60-${m / 5}*5`, 0]], unseen: [60, 5], shown: [[h, 0], [h, m]] }
      });
    }),
    T('hour-repeat', '같은 시간을 여러 번 한 시간', '①40', (d) => {
      const [a, n] = d.pick([[30, 2], [20, 3], [30, 4], [40, 3], [20, 6]]), total = a * n;
      return N(`한 가지에 ${a}분씩 걸리는 체험을 ${n}가지 했다. 체험을 한 시간은 모두 몇 시간인가?`, total / 60, {
        unit: '시간', explain: `${Array(n).fill(a).join(' + ')} = ${total}(분)이다. ` + (total === 60 ? '60분은 1시간이다.' : `60분은 1시간이므로 ${total}분은 ${total / 60}시간이다.`), facts: { calc: [[`${a}*${n}/60`, 0]], unseen: [60] }
      });
    }),
    T('span-parts', '쉬는 시간이 낀 공연에 걸린 시간', '①41', (d) => {
      // 1부와 2부 사이에 쉬는 시간이 있다. 맨 처음 시각과 맨 끝 시각만 보면 된다(1부와 2부의 시간만 더하면 쉬는 시간이 빠진다).
      const h = d.int(1, 7), [p1, rest, p2] = d.until(() => [d.pick([40, 50, 70, 80, 90]), d.pick([10, 20]), d.pick([40, 50, 60, 70])], ([x, y, z]) => (x + y + z) % 60 !== 0 && x + y + z <= 170 && x % 60 !== 0 && (x + y) % 60 !== 0);
      const t0 = h * 60, t1 = t0 + p1, t2 = t1 + rest, t3 = t2 + p2, total = t3 - t0;
      return M('공연 시간표이다. 1부를 시작해서 2부가 끝날 때까지 걸린 시간은 몇 시간 몇 분인가?', [{ answer: Math.floor(total / 60), unit: '시간' }, { answer: total % 60, unit: '분' }], {
        figure: table(['', '시작', '끝'], [['1부', atOf(t0), atOf(t1)], ['2부', atOf(t2), atOf(t3)]]),
        explain: `1부를 시작한 시각은 ${h}시, 2부가 끝난 시각은 ${atOf(t3)}이다. ${h}시에서 ${Math.floor(t3 / 60)}시까지 ${Math.floor(total / 60)}시간, 거기서 ${atOf(t3)}까지 ${total % 60}분이다. 쉬는 시간도 들어 있다.`,
        facts: { clock: [{ expr: `${minsOf(t3)}-${h}*60`, parts: 'ms', at: 0 }] }
      });
    })
  ]);

  // ── 하루의 시간 ───────────────────────────────────────────────
  // [때를 이르는 말, 시, 오후인가]
  const WHEN = [['새벽', [2, 3, 4, 5], false], ['아침', [7, 8, 9], false], ['낮', [1, 2, 3, 4], true], ['저녁', [6, 7], true], ['밤', [9, 10, 11], true]];
  const HALF = ['오전', '오후'];
  const HALF_PAIRS = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const pairSaid = (pair) => pair.map((i) => HALF[i]).join(', ');

  B.addTypes('2-2-4', 'day', [
    T('day-hours', '하루는 24시간', '①43', () => M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: 24 }, { label: LABELS[1], answer: 12 }, { label: LABELS[2], answer: 2 }], {
      figure: lines([`하루는 ${box(LABELS[0])}시간이다.`, `오전은 ${box(LABELS[1])}시간이다.`, `하루 동안 시계의 짧은바늘은 ${box(LABELS[2])}바퀴 돈다.`]),
      explain: '오전 12시간과 오후 12시간을 더하면 하루는 24시간이다. 짧은바늘은 12시간에 한 바퀴 돌므로 하루에 2바퀴 돈다.', facts: { calc: [['24', 0], ['12', 1], ['2', 2]], unseen: [24, 12, 2] }
    })),
    T('day-name', '오전과 오후의 뜻', '①43', (d) => {
      const pm = d.bool();
      return C(pm ? '낮 12시부터 밤 12시까지를 무엇이라고 하는가?' : '전날 밤 12시부터 낮 12시까지를 무엇이라고 하는가?', HALF, pm ? 1 : 0, {
        explain: '전날 밤 12시부터 낮 12시까지를 오전, 낮 12시부터 밤 12시까지를 오후라고 한다.', facts: { truth: [!pm, pm], want: true }
      });
    }),
    T('day-when', '때에 알맞은 오전과 오후', '①44', (d) => {
      const pm = d.bool(), picks = d.shuffle(WHEN).slice(0, 4).map(([word, hours, isPm]) => ({ text: `${word} ${d.pick(hours)}시`, isPm }));
      const flags = picks.map((p) => p.isPm === pm), made = setOptions(d, LABELS, flags);
      return C(`${HALF[pm ? 1 : 0]}인 때를 모두 고른 것은?`, made.options, made.answer, {
        figure: tagged(picks.map((p) => p.text)), explain: `새벽과 아침은 낮 12시가 되기 전이므로 오전이고, 낮 12시가 지난 낮, 저녁, 밤은 오후이다. ${HALF[pm ? 1 : 0]}인 때는 ${LABELS.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels: LABELS, flags, options: made.sets } }
      });
    }),
    T('day-life', '하루 생활에서 오전과 오후', '①44', (d) => {
      const who = d.pick(NAMES), b0 = box(LABELS[0]), b1 = box(LABELS[1]), ten = () => d.pick([10, 20, 30, 40]);
      const [text, pair, note] = d.pick([
        [`${name(who, '은/는')} ${b0} 8시 ${ten()}분에 학교에 가서 ${b1} ${d.int(1, 3)}시 ${ten()}분에 집으로 돌아왔다.`, [0, 1], '아침에 학교에 가는 때는 오전이고, 낮 12시가 지나 집으로 돌아오는 때는 오후이다.'],
        [`${name(who, '은/는')} ${b0} ${d.int(6, 7)}시에 저녁을 먹고 ${b1} ${d.int(9, 10)}시에 잠자리에 들었다.`, [1, 1], '저녁을 먹는 때와 밤에 잠자리에 드는 때는 모두 낮 12시가 지난 오후이다.'],
        [`${name(who, '은/는')} ${b0} 7시에 일어나서 ${b1} 7시 ${ten()}분에 아침을 먹었다.`, [0, 0], '아침에 일어나는 때와 아침을 먹는 때는 모두 낮 12시가 되기 전인 오전이다.'],
        [`${name(who, '은/는')} ${b0} ${d.int(9, 10)}시에 잠자리에 들어서 다음 날 ${b1} 7시에 일어났다.`, [1, 0], '밤에 잠자리에 드는 때는 오후이고, 다음 날 아침에 일어나는 때는 오전이다.']
      ]);
      return C('㉠, ㉡에 알맞은 말을 차례로 쓴 것은?', HALF_PAIRS.map(pairSaid), HALF_PAIRS.findIndex((p) => p.join() === pair.join()), {
        figure: lines([text]), explain: note, facts: { truth: HALF_PAIRS.map((p) => p.join() === pair.join()), want: true }
      });
    }),
    T('day-plan', '계획표에서 오전과 오후 가리기', '①45 심33', (d) => {
      // 계획표에는 오전·오후가 적혀 있지 않다. 이른 때부터 적혀 있으므로 11시 다음의 1시는 오후이다.
      const who = d.pick(NAMES), keep = (list, n) => d.shuffle(list.map((_, i) => i)).slice(0, n).sort(asc).map((i) => list[i]);
      const am = keep([8, 9, 10, 11], 2), pm = keep([1, 2, 3, 4, 5, 6, 7], 3);
      const acts = keep(['아침 먹기', '숙제하기', '청소하기', '수영하기'], 2).concat(keep(['점심 먹기', '책 읽기', '축구하기', '저녁 먹기', '일기 쓰기'], 3));
      const hours = am.concat(pm), [i, j] = d.shuffle([0, 1, 2, 3, 4]).slice(0, 2).sort(asc), pair = [i < 2 ? 0 : 1, j < 2 ? 0 : 1];
      return C(`${nick(who)}의 하루 계획표이다. 이른 때부터 차례로 적었다. 「${acts[i]}」와 「${acts[j]}」를 하는 때를 차례로 쓴 것은?`, HALF_PAIRS.map(pairSaid), HALF_PAIRS.findIndex((p) => p.join() === pair.join()), {
        figure: table(['시각', '할 일'], hours.map((h, n) => [`${h}시`, acts[n]])),
        explain: `이른 때부터 적었으므로 ${am[1]}시 다음의 ${pm[0]}시는 낮 12시가 지난 오후 ${pm[0]}시이다. 「${acts[i]}」는 ${HALF[pair[0]]} ${hours[i]}시, 「${acts[j]}」는 ${HALF[pair[1]]} ${hours[j]}시에 한다.`,
        facts: { truth: HALF_PAIRS.map((p) => p.join() === pair.join()), want: true }
      });
    }),
    T('day-strip-read', '하루 시간 띠에 색칠한 때 읽기', '①45', (d) => {
      const a = d.int(8, 11), b = d.int(1, 5), place = d.pick(['동물원', '바닷가', '할머니 댁', '놀이공원']);
      return M(`하루 시간 띠에 ${place}에 있던 때를 색칠했다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b }], {
        figure: dayStrip(a, b) + lines([`오전 ${box(LABELS[0])}시부터 오후 ${box(LABELS[1])}시까지 색칠했다.`]),
        explain: `윗줄은 오전, 아랫줄은 오후이다. 윗줄은 눈금 ${a}부터, 아랫줄은 눈금 ${b}까지 색칠했으므로 오전 ${a}시부터 오후 ${b}시까지이다.`,
        facts: { calc: [[String(a), 0], [String(b), 1]] }
      });
    }),
    T('day-strip', '하루 시간 띠에 색칠한 시간', '①46 심34', (d) => {
      const a = d.int(9, 11), b = d.int(1, 4), place = d.pick(['도서관', '박물관', '수영장', '미술관']);
      return N(`하루 시간 띠에 ${place}에 있던 시간을 색칠했다. ${place}에 있던 시간은 몇 시간인가?`, 12 - a + b, {
        unit: '시간', figure: dayStrip(a, b), explain: `색칠한 칸은 오전에 ${12 - a}칸, 오후에 ${b}칸이다. ${12 - a} + ${b} = ${12 - a + b}(시간)`, facts: { calc: [[`12-${a}+${b}`, 0]], unseen: [12] }
      });
    }),
    T('day-span', '오전부터 오후까지 걸린 시간', '①47 심35', (d) => {
      const who = d.pick(NAMES), a = d.int(8, 11), b = d.int(1, 6);
      return N(`${name(who, '은/는')} 오전 ${a}시에 집을 나서서 오후 ${b}시에 돌아왔다. 집 밖에 있던 시간은 몇 시간인가?`, 12 - a + b, {
        unit: '시간', explain: `오전 ${a}시부터 낮 12시까지 ${12 - a}시간, 낮 12시부터 오후 ${b}시까지 ${b}시간이다. ${12 - a} + ${b} = ${12 - a + b}(시간)`, facts: { calc: [[`12-${a}+${b}`, 0]], unseen: [12] }
      });
    }),
    T('day-to-hours', '1일 몇 시간을 시간으로 나타내기', '①48', (d) => {
      const k = d.int(2, 11);
      return N(`1일 ${k}시간은 몇 시간인가?`, 24 + k, { unit: '시간', explain: `1일은 24시간이다. 24 + ${k} = ${24 + k}(시간)`, facts: { calc: [[`24+${k}`, 0]], unseen: [24] } });
    }),
    T('day-from-hours', '시간을 며칠 몇 시간으로 나타내기', '①48', (d) => {
      const v = d.int(37, 46);
      return M(`${v}시간은 며칠 몇 시간인가?`, [{ answer: 1, unit: '일' }, { answer: v - 24, unit: '시간' }], {
        explain: `24시간은 1일이다. ${v}시간은 24시간보다 ${v - 24}시간 더 긴 시간이므로 1일 ${v - 24}시간이다.`, facts: { unit: [{ expr: String(v), base: 24, at: [0, 1] }] }
      });
    }),
    T('day-longer', '하루보다 긴 시간 찾기', '①49', (d) => {
      const list = d.shuffle([d.int(16, 19), d.int(20, 23), 24, d.int(25, 30)]), big = list.find((v) => v > 24);
      return C('하루보다 긴 시간은?', list.map((v) => v + '시간'), list.indexOf(big), {
        explain: `하루는 24시간이다. 24시간보다 긴 시간은 ${big}시간이다.`, facts: { only: { values: list, test: 'atLeast', target: 25 } }
      });
    }),
    T('day-next', '첫째 날 오전부터 둘째 날 오전까지', '①50', (d) => {
      const a = d.int(6, 8), k = d.int(1, 3), b = a + k;
      return N(`기차가 첫째 날 오전 ${a}시에 출발해서 둘째 날 오전 ${b}시에 도착했다. 기차를 탄 시간은 몇 시간인가?`, 24 + k, {
        unit: '시간', explain: `첫째 날 오전 ${a}시부터 둘째 날 오전 ${a}시까지가 하루이고, 하루는 24시간이다. 둘째 날 오전 ${a}시부터 오전 ${b}시까지 ${k}시간이므로 24 + ${k} = ${24 + k}(시간)이다.`,
        facts: { calc: [[`24+${b}-${a}`, 0]], unseen: [24] }
      });
    }),
    T('day-short-turn', '짧은바늘이 한 바퀴 돈 뒤의 때', '①51', (d) => {
      // 보기: 12시간 뒤(바른 것), 하루 뒤(두 바퀴로 여김), 1시간 뒤(긴바늘 한 바퀴로 여김), 날짜를 잘못 바꾼 것
      const day = d.int(3, 24), h = d.int(1, 10), m = d.pick([10, 20, 30, 40, 50]), pm = d.bool();
      const say = (dd, isPm, hh) => `${dd}일 ${HALF[isPm ? 1 : 0]} ${at(hh, m)}`;
      const right = pm ? say(day + 1, false, h) : say(day, true, h);
      const rows = d.shuffle([right, say(day + 1, pm, h), say(day, pm, h + 1), pm ? say(day, false, h) : say(day + 1, true, h)]);
      return C(`${say(day, pm, h)}에 시계를 보았다. 그때부터 시계의 짧은바늘이 한 바퀴 돌았을 때는?`, rows, rows.indexOf(right), {
        explain: `짧은바늘이 한 바퀴 도는 데 12시간이 걸린다. ${say(day, pm, h)}에서 12시간이 지나면 ${right}이다.`, facts: { truth: rows.map((row) => row === right), want: true }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
