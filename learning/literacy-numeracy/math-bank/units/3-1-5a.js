// 3학년 1학기 5단원 길이와 시간 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 10종의 평가 자료(단원평가·형성평가·수학익힘·수행평가 220개 문서)에 나온 문제 꼴을 세 덩이로 나누어 모은
// 목록(기본꼴 1~3, 모두 224꼴)에서 고른 것이다. 꼴과 조건은 그 문제를 따르고 수와 문장만 바꾼다.
// (천재 박만구 교과서는 이 단원이 3단원이라 그 책의 자료는 3단원 폴더에서 가져왔다.)
//
// 고른 기준
//  - 숫자만 다르거나 말만 다른 꼴은 한 번만 싣는다. 단위 바꾸기는 한 문항에서 두 방향을 함께 묻는다(65 cm 8 mm=□mm, 209 mm=□cm □mm).
//    견주기는 묶음마다 꼴을 달리했다(mm는 두 길이 >·=·<, km는 세 곳의 차례, 초는 가장 빠른 기록).
//  - 자로 선 긋기·초바늘 그려 넣기·길이를 어림하고 직접 재기처럼 손으로 하는 활동, 「초」를 넣어 문장 짓기 같은 서술형은 싣지 않는다.
//  - 길이를 소수로 나타내는 것(1.5 km)은 6단원 뒤의 것이라 싣지 않는다.
//  - 두 단계 이상이거나 거꾸로 생각해야 하는 꼴은 실력 문항으로 보냈다(3-1-5b.js).
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, LABELS, box, lines, tagged, ruler, kmLine, timeColumn, route, N, M, C } = B.kit;
  const G = B.kit.geo;
  const UNIT = '4수03-16', MEASURE = '4수03-15', SECOND = '4수03-13', TIME = '4수03-14';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;

  // ── 시간 ─────────────────────────────────────────────────────
  // [시, 분, 초] ↔ 초. 검사가 다시 셈하는 식은 초로 적는다(S).
  const secs = ([h, m, s]) => h * 3600 + m * 60 + s;
  const hms = (t) => [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60];
  const S = ([h, m, s]) => '(' + [h ? h + '*3600' : '', m ? m + '*60' : '', s ? String(s) : ''].filter(Boolean).join('+') + ')';
  const say = (hour) => ([h, m, s]) => [h ? h + hour : '', m ? m + '분' : '', s ? s + '초' : ''].filter(Boolean).join(' ');
  const at = say('시'), span = say('시간');
  const cells = (hour) => ([h, m, s]) => (h ? [h + hour] : []).concat([m + '분', s + '초']);
  const atCells = cells('시'), spanCells = cells('시간');
  const ask = (units, t) => units.map((unit, i) => ({ answer: t[t.length - units.length + i], unit }));
  // 초·분에서 받아올림(받아내림)이 일어나는 두 시간을 뽑는다.
  const sumPair = (d, hours, carryMinute) => d.until(() => [[hours ? d.int(1, 7) : 0, d.int(11, 48), d.int(12, 56)], [hours ? d.int(1, 3) : 0, d.int(11, 48), d.int(12, 56)]],
    ([a, b]) => a[2] + b[2] >= 61 && (carryMinute ? a[1] + b[1] + 1 >= 61 : a[1] + b[1] + 1 <= 58) && a[1] !== b[1] && a[2] !== b[2]);
  const diffPair = (d, hours, borrowMinute) => d.until(() => [[hours ? d.int(4, 11) : 0, d.int(11, 56), d.int(8, 48)], [hours ? d.int(1, 3) : 0, d.int(8, 52), d.int(15, 56)]],
    ([a, b]) => a[2] < b[2] - 1 && (borrowMinute ? a[1] - 1 < b[1] - 1 : a[1] - 1 > b[1] + 1) && (hours ? secs(a) - secs(b) >= 3700 : a[1] - 1 > b[1] + 1));

  // ── 어림에 쓰는 것들(사실 그대로) ────────────────────────────
  // [대상, 수, 알맞은 단위]
  const LENGTHS = [['쌀 한 톨의 길이', 5, 'mm'], ['개미의 몸길이', 4, 'mm'], ['공책의 두께', 5, 'mm'], ['젓가락의 길이', 20, 'cm'], ['수학책의 긴 쪽의 길이', 26, 'cm'], ['3학년 학생의 키', 130, 'cm'],
    ['교실 문의 높이', 2, 'm'], ['버스의 길이', 11, 'm'], ['한라산의 높이', 1950, 'm'], ['마라톤 선수가 달리는 거리', 42, 'km'], ['서울에서 부산까지의 거리', 400, 'km']];
  const WRONG_UNIT = { mm: 'm', cm: 'km', m: 'mm', km: 'cm' };
  const OVER_KM = ['서울에서 부산까지의 거리', '한강의 길이', '마라톤 선수가 달리는 거리', '비행기가 1시간 동안 날아가는 거리'];
  const UNDER_KM = ['교실 칠판의 긴 쪽의 길이', '버스의 길이', '10층 아파트의 높이', '줄넘기 줄의 길이', '학교 복도의 길이', '축구 골대의 너비'];
  // [일, 수, 알맞은 단위]
  const TIMES = [['눈을 한 번 깜박이는 데 걸리는 시간', 1, '초'], ['100 m를 달리는 데 걸리는 시간', 20, '초'], ['이를 닦는 데 걸리는 시간', 3, '분'], ['점심을 먹는 데 걸리는 시간', 30, '분'],
    ['밤에 잠을 자는 시간', 9, '시간'], ['학교에서 보내는 시간', 6, '시간']];
  const IN_ONE_SECOND = ['손뼉 한 번 치기', '눈 한 번 깜박이기', '고개 한 번 끄덕이기'];
  const NOT_IN_ONE_SECOND = ['손 씻기', '이 닦기', '운동장 한 바퀴 달리기', '동화책 한 권 읽기', '점심 먹기', '옷 갈아입기'];

  B.addUnit({
    id: '3-1-5', grade: 3, semester: 1, no: 5, title: '길이와 시간', version: 6,
    groups: [
      {
        id: 'mm', title: 'mm와 cm', standard: UNIT,
        types: [
          T('mm-ticks', '자의 작은 눈금과 mm', '①1 ②1 ③4', (d) => {
            const n = d.int(3, 9);
            return N(`자에서 작은 눈금 ${n}칸의 길이는 몇 mm인가?`, n, { unit: 'mm', explain: `자의 작은 눈금 한 칸의 길이는 1 mm이다. ${n}칸은 ${n} mm이다.`, facts: { calc: [[String(n), 0]] } });
          }),
          T('mm-read', '자 그림에서 길이 읽기', '①7 ②4 ③5', (d) => {
            const to = d.until(() => d.int(23, 48), (v) => v % 10 !== 0 && v % 10 !== 5);
            return M('물건의 길이는 몇 cm 몇 mm인가?', [{ answer: Math.floor(to / 10), unit: 'cm' }, { answer: to % 10, unit: 'mm' }], {
              figure: ruler(0, to, Math.floor(to / 10) + 1), explain: `물건의 오른쪽 끝이 ${Math.floor(to / 10)} cm에서 작은 눈금 ${to % 10}칸을 더 간 곳에 있다.`, facts: { ruler: true }
            });
          }, { standard: MEASURE }),
          T('mm-say', '「몇 cm보다 몇 mm 더 긴 길이」', '①3 ②3 ③7', (d) => {
            const c = d.int(4, 28), m = d.int(2, 9);
            return N(`${c} cm보다 ${m} mm 더 긴 길이는 몇 mm인가?`, c * 10 + m, { unit: 'mm', explain: `${c} cm는 ${c * 10} mm이다. ${c * 10} mm보다 ${m} mm 더 긴 길이는 ${c * 10 + m} mm이다.`, facts: { calc: [[`${c}*10+${m}`, 0]], unseen: [10] } });
          }),
          T('mm-convert', 'cm와 mm로 나타낸 길이 바꾸기', '①5·6 ②7 ③2·3', (d) => {
            // 65 cm 8 mm=□mm, 209 mm=□cm □mm
            const c = d.int(12, 68), m = d.int(1, 9), v = d.until(() => d.int(102, 498), (x) => x % 10 !== 0 && Math.floor(x / 10) !== c);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: c * 10 + m }, { label: LABELS[1], answer: Math.floor(v / 10) }, { label: LABELS[2], answer: v % 10 }], {
              figure: lines([`${c} cm ${m} mm = ${box(LABELS[0])} mm`, `${v} mm = ${box(LABELS[1])} cm ${box(LABELS[2])} mm`]),
              explain: `1 cm는 10 mm이다. ${c} cm ${m} mm는 ${c * 10} mm보다 ${m} mm 더 긴 ${c * 10 + m} mm이고, ${v} mm는 ${Math.floor(v / 10) * 10} mm보다 ${v % 10} mm 더 긴 ${Math.floor(v / 10)} cm ${v % 10} mm이다.`,
              facts: { calc: [[`${c}*10+${m}`, 0]], unseen: [10], unit: [{ expr: String(v), base: 10, at: [1, 2] }] }
            });
          }),
          T('mm-name', '길이 읽기', '①2 ②2 ③1', (d) => {
            const [c, m] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y);
            const rows = d.shuffle([[`${c} 센티미터 ${m} 밀리미터`, true], [`${c} 미터 ${m} 센티미터`, false], [`${c} 밀리미터 ${m} 센티미터`, false], [`${c} 센티미터 ${m} 미터`, false]]);
            return C(`${c} cm ${m} mm를 바르게 읽은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
              explain: 'cm는 센티미터, mm는 밀리미터라고 읽는다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
            });
          }),
          T('mm-compare', '두 길이의 비교', '①22 ②21 ③31', (d) => {
            // 130 mm ○ 10 cm 9 mm
            const c = d.int(8, 32), m = d.int(1, 9), v = d.until(() => c * 10 + m + d.int(-24, 24), (x) => x % 10 !== 0 && Math.floor(x / 10) !== c || x === c * 10 + m);
            const flip = d.bool(), left = flip ? `${c} cm ${m} mm` : `${v} mm`, right = flip ? `${v} mm` : `${c} cm ${m} mm`;
            const x = flip ? c * 10 + m : v, y = flip ? v : c * 10 + m;
            return C('두 길이를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, x > y ? 0 : x === y ? 1 : 2, {
              figure: versus(left, right), explain: `${c} cm ${m} mm는 ${c * 10 + m} mm이다.`,
              facts: { choose: { exprs: flip ? [`${c}*10+${m}`, String(v)] : [String(v), `${c}*10+${m}`], rule: 'compare' }, unseen: [10] }
            });
          })
        ]
      },
      {
        id: 'km', title: 'km와 m', standard: UNIT,
        types: [
          T('km-line', '수직선에서 거리 읽기', '①8 ②13 ③15', (d) => {
            const from = d.int(1, 6), k = d.until(() => d.int(2, 9), (v) => v !== 5);
            return M('1 km를 똑같이 10칸으로 나눈 수직선이다. 화살표가 가리키는 곳은 몇 km 몇 m인가?', [{ answer: from, unit: 'km' }, { answer: k * 100, unit: 'm' }], {
              figure: kmLine(from, 1, from * 1000 + k * 100), explain: `작은 눈금 한 칸은 100 m이다. ${from} km에서 ${k}칸을 더 갔으므로 ${from} km ${k * 100} m이다.`, facts: { kmLine: true }
            });
          }),
          T('km-convert', 'km와 m로 나타낸 거리 바꾸기', '①12·13 ②12 ③11·12', (d) => {
            // 9 km 46 m=□m, 5100 m=□km □m
            const k = d.int(2, 9), m = d.pick([d.int(3, 9), d.int(12, 95), d.int(105, 880)]), v = d.until(() => d.int(1005, 9990), (x) => x % 1000 !== 0 && Math.floor(x / 1000) !== k && (x % 1000 < 100 || x % 100 === 0));
            return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: k * 1000 + m }, { label: LABELS[1], answer: Math.floor(v / 1000) }, { label: LABELS[2], answer: v % 1000 }], {
              figure: lines([`${k} km ${m} m = ${box(LABELS[0])} m`, `${v} m = ${box(LABELS[1])} km ${box(LABELS[2])} m`]),
              explain: `1 km는 1000 m이다. ${k} km ${m} m는 ${k * 1000} m보다 ${m} m 더 먼 ${k * 1000 + m} m이고, ${v} m는 ${Math.floor(v / 1000) * 1000} m보다 ${v % 1000} m 더 먼 ${Math.floor(v / 1000)} km ${v % 1000} m이다.`,
              facts: { calc: [[`${k}*1000+${m}`, 0]], unseen: [1000], unit: [{ expr: String(v), base: 1000, at: [1, 2] }] }
            });
          }),
          T('km-say', '「몇 km보다 몇 m 더 먼 거리」', '①15 ②3 ③13', (d) => {
            const k = d.int(2, 9), m = d.until(() => d.int(105, 950), (v) => v % 100 !== 0);
            return N(`${k} km보다 ${m} m 더 먼 거리는 몇 m인가?`, k * 1000 + m, { unit: 'm', explain: `${k} km는 ${k * 1000} m이다. ${k * 1000} m보다 ${m} m 더 먼 거리는 ${k * 1000 + m} m이다.`, facts: { calc: [[`${k}*1000+${m}`, 0]], unseen: [1000] } });
          }),
          T('km-wrong', '거리를 잘못 나타낸 것 찾기', '①9 ②10 ③8·18', (d) => {
            // 2 km 89 m=2089 m, 1530 m=1 km 530 m, 3 km 7 m=3070 m(틀림)
            const k = d.shuffle([2, 3, 4, 5, 6, 7, 8]).slice(0, 4), small = d.int(3, 9), mid = d.int(12, 95), big = d.int(105, 880), round = d.int(1, 9) * 100;
            const rows = [[k[0], mid, k[0] * 1000 + mid, true], [k[1], big, k[1] * 1000 + big, false], [k[2], round, k[2] * 1000 + round, true], [k[3], small, k[3] * 1000 + small * 10, true]];
            // 마지막 줄만 틀리게 적는다: 3 km 7 m 를 3070 m 로.
            const list = d.shuffle(rows.map(([km, m, said, mFirst], i) => ({ text: mFirst ? `${km} km ${m} m = ${said} m` : `${said} m = ${km} km ${m} m`, expr: `${km}*1000+${m}`, said, bad: i === 3 })));
            const bad = list.find((row) => row.bad);
            return C('거리를 잘못 나타낸 것은?', list.map((row) => row.text), list.indexOf(bad), {
              explain: `${k[3]} km ${small} m는 ${k[3] * 1000} m보다 ${small} m 더 먼 ${k[3] * 1000 + small} m이다.`, facts: { claimed: list.map((row) => [row.expr, row.said]), claimedWant: false }
            });
          }),
          T('km-order', '세 곳의 거리 비교', '①23 ②22 ③32', (d) => {
            // 우체국 1 km 500 m, 도서관 1040 m, 경찰서 1 km 404 m → 가까운 곳부터
            const places = d.shuffle(['은행', '병원', '소방서', '수영장', '놀이터', '박물관']).slice(0, 3), k = d.int(1, 4);
            const meters = d.until(() => [d.int(1, 9) * 100 + d.pick([0, 50]), d.int(12, 98), d.int(105, 890)].map((m) => k * 1000 + m), (v) => new Set(v).size === 3 && new Set(v.map((x) => Math.floor((x % 1000) / 100))).size >= 2);
            const order = d.shuffle([0, 1, 2]), dist = order.map((i) => meters[i]);
            const said = dist.map((v, i) => (i === 1 ? `${v} m` : `${Math.floor(v / 1000)} km ${v % 1000} m`));
            const right = [0, 1, 2].sort((p, q) => dist[p] - dist[q]);
            const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
            return C(`집에서 ${places[0]}까지의 거리는 ${said[0]}, ${places[1]}까지의 거리는 ${said[1]}, ${places[2]}까지의 거리는 ${said[2]}이다. 집에서 가까운 곳부터 차례대로 나열한 것은?`,
              list.map((o) => o.map((i) => places[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
                explain: dist.map((v, i) => `${places[i]} ${v} m`).join(', ') + '이다.',
                facts: { choose: { exprs: dist.map((v, i) => (i === 1 ? String(v) : `${Math.floor(v / 1000)}*1000+${v % 1000}`)), rule: 'ascending', orders: list }, unseen: [1000] }
              });
          })
        ]
      },
      {
        id: 'guess', title: '길이 어림과 알맞은 단위', standard: MEASURE,
        types: [
          T('guess-unit', '알맞은 길이 단위 고르기', '①16 ②14 ③20', (d) => {
            const [thing, n, unit] = d.pick(LENGTHS), list = ['mm', 'cm', 'm', 'km'];
            return C(`${josa(thing, '은/는')} 약 ${n} □이다. □ 안에 알맞은 단위는?`, list, list.indexOf(unit), { explain: `${josa(thing, '은/는')} 약 ${n} ${unit}이다.`, facts: { truth: list.map((u) => u === unit), want: true } });
          }),
          T('guess-wrong', '단위를 잘못 쓴 문장 찾기', '①19 ②16 ③22', (d) => {
            const picks = d.until(() => d.shuffle(LENGTHS).slice(0, 4), (list) => new Set(list.map(([, , u]) => u)).size >= 3), bad = d.int(0, 3);
            const list = picks.map(([thing, n, unit], i) => `${josa(thing, '은/는')} 약 ${n} ${i === bad ? WRONG_UNIT[unit] : unit}이다.`);
            return C('길이의 단위를 알맞게 쓰지 않은 것은?', list, bad, { explain: `${josa(picks[bad][0], '은/는')} 약 ${picks[bad][1]} ${picks[bad][2]}이다.`, facts: { truth: list.map((_, i) => i !== bad), want: false } });
          }),
          T('guess-over', '1 km보다 긴 것 고르기', '①18 ②17 ③23', (d) => {
            const long = d.pick(OVER_KM), list = d.shuffle(d.shuffle(UNDER_KM).slice(0, 3).concat([long]));
            return C('길이가 1 km보다 긴 것은?', list, list.indexOf(long), { explain: `1 km는 1000 m이다. ${josa(long, '은/는')} 1 km보다 훨씬 길다.`, facts: { truth: list.map((v) => v === long), want: true } });
          }),
          T('guess-span', '아는 길이로 어림하기', '③27', (d) => {
            const who = d.pick(NAMES), a = d.int(12, 16), n = d.int(4, 7);
            return N(`${who}의 한 뼘의 길이는 약 ${a} cm이다. 책상의 긴 쪽의 길이가 ${who}의 뼘으로 ${n}뼘쯤일 때, 책상의 긴 쪽의 길이는 약 몇 cm인가?`, a * n, {
              unit: 'cm', lead: '약', explain: `한 뼘이 약 ${a} cm이므로 ${n}뼘은 약 ${a} × ${n} = ${a * n}(cm)이다.`, facts: { calc: [[`${a}*${n}`, 0]] }
            });
          }),
          T('guess-map', '기준 거리로 어림하기', '①21 ②20 ③28·29', (d) => {
            // 집~학교가 약 500 m일 때 약 1 km 떨어진 곳
            const [base, far] = d.pick([['500 m', ['1 km', '1 km 500 m']], ['1 km', ['2 km', '3 km']], ['2 km', ['4 km', '6 km']]]), k = d.int(2, 3);
            const places = ['집'].concat(d.shuffle(['학교', '공원', '도서관', '병원', '우체국']).slice(0, 3));
            return C(`그림에서 이웃한 두 곳 사이의 거리는 모두 같다. 집에서 ${places[1]}까지의 거리가 약 ${base}일 때, 집에서 약 ${far[k - 2]} 떨어진 곳은?`, places.slice(1), k - 1, {
              figure: route(places.map((place, i) => [place, i * 33.3, 50, true]), [[0, 1, '약 ' + base, -5], [1, 2], [2, 3]], 44),
              explain: `약 ${far[k - 2]}는 약 ${base}의 ${k}배이다. 집에서 ${k}칸 떨어진 곳은 ${places[k]}이다.`, facts: { truth: places.slice(1).map((_, i) => i === k - 1), want: true, mapSteps: k }
            });
          })
        ]
      },
      {
        id: 'sec', title: '초와 분', standard: SECOND,
        types: [
          T('sec-turn', '초바늘이 도는 시간', '①27 ②36 ③34', (d) => {
            const n = d.int(2, 5);
            return N(`초바늘이 시계를 ${n}바퀴 도는 데 걸리는 시간은 몇 초인가?`, n * 60, { unit: '초', explain: `초바늘이 시계를 한 바퀴 도는 데 걸리는 시간은 60초이다. ${n}바퀴는 ${n * 60}초이다.`, facts: { calc: [[`${n}*60`, 0]], unseen: [60] } });
          }),
          T('sec-read', '초 단위까지 시각 읽기', '①28 ②38 ③36', (d) => {
            // 바늘이 서로 겹치지 않고, 짧은바늘이 어느 숫자 사이인지 또렷한 시각
            const apart = (p, q) => { const gap = Math.abs(p - q) % 360; return Math.min(gap, 360 - gap); };
            const [h, m, s] = d.until(() => [d.int(1, 11), d.int(2, 10) * 5, d.int(1, 11) * 5], ([x, y, z]) => y !== z && apart(x * 30 + y / 2, y * 6) >= 24 && apart(x * 30 + y / 2, z * 6) >= 24);
            return M('시계가 나타내는 시각은 몇 시 몇 분 몇 초인가?', ask(['시', '분', '초'], [h, m, s]), {
              figure: G.clock(h, m, s), explain: `짧은바늘이 ${josa(h, '과/와')} ${h + 1} 사이에 있으므로 ${h}시, 긴바늘이 ${josa(m / 5, '을/를')} 가리키므로 ${m}분, 초바늘이 ${josa(s / 5, '을/를')} 가리키므로 ${s}초이다.`, facts: { clockFace: true }
            });
          }),
          T('sec-hand', '초바늘이 가리키는 곳과 초', '②36 ③35', (d) => {
            // 초바늘이 6에서 작은 눈금 두 칸 더 간 곳 → 32초
            const k = d.int(2, 11), j = d.int(1, 4);
            return N(`시계의 초바늘이 숫자 ${k}에서 작은 눈금 ${j}칸을 더 간 곳을 가리키고 있다. 초바늘이 나타내는 시각은 몇 초인가?`, k * 5 + j, { unit: '초', explain: `초바늘이 숫자 ${josa(k, '을/를')} 가리키면 ${k * 5}초이다. 작은 눈금 한 칸은 1초이므로 ${k * 5 + j}초이다.`, facts: { calc: [[`${k}*5+${j}`, 0]], unseen: [5] } });
          }),
          T('sec-convert', '분과 초로 나타낸 시간 바꾸기', '①30·31 ②41 ③38·39', (d) => {
            // 6분 42초=□초, 206초=□분 □초
            const m = d.int(2, 8), s = d.int(5, 55), v = d.until(() => d.int(130, 580), (x) => x % 60 !== 0 && Math.floor(x / 60) !== m);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: m * 60 + s }, { label: LABELS[1], answer: Math.floor(v / 60) }, { label: LABELS[2], answer: v % 60 }], {
              figure: lines([`${m}분 ${s}초 = ${box(LABELS[0])}초`, `${v}초 = ${box(LABELS[1])}분 ${box(LABELS[2])}초`]),
              explain: `1분은 60초이다. ${m}분 ${s}초는 ${m * 60}초보다 ${s}초 더 긴 ${m * 60 + s}초이고, ${v}초는 ${Math.floor(v / 60) * 60}초보다 ${v % 60}초 더 긴 ${Math.floor(v / 60)}분 ${v % 60}초이다.`,
              facts: { calc: [[`${m}*60+${s}`, 0]], unseen: [60], unit: [{ expr: String(v), base: 60, at: [1, 2] }] }
            });
          }),
          T('sec-fastest', '가장 빠른 기록 고르기', '①33·34 ②44 ③42', (d) => {
            // 265초, 4분 13초, 217초, 3분 52초 가운데 가장 짧은 시간
            // 기록이 분이 바뀌는 언저리에 몰리게 한다(분만 보고는 못 고르게).
            const who = d.shuffle(NAMES).slice(0, 3), base = d.int(3, 6) * 60 + d.int(-8, 8);
            const times = d.until(() => [base + d.int(-28, 28), base + d.int(-28, 28), base + d.int(-28, 28)], (v) => new Set(v).size === 3 && v.every((t) => t % 60 !== 0) && new Set(v.map((t) => Math.floor(t / 60))).size >= 2);
            const said = times.map((t, i) => (i === 1 ? `${t}초` : `${Math.floor(t / 60)}분 ${t % 60}초`));
            return C(`운동장 한 바퀴를 달리는 데 ${name(who[0], '은/는')} ${said[0]}, ${name(who[1], '은/는')} ${said[1]}, ${name(who[2], '은/는')} ${said[2]}가 걸렸다. 가장 빨리 달린 사람은?`, who, times.indexOf(Math.min(...times)), {
              explain: times.map((t, i) => `${who[i]} ${t}초`).join(', ') + '이다. 걸린 시간이 가장 짧은 사람이 가장 빨리 달렸다.',
              facts: { choose: { exprs: times.map((t, i) => (i === 1 ? String(t) : `${Math.floor(t / 60)}*60+${t % 60}`)), rule: 'min' }, unseen: [60] }
            });
          }),
          T('sec-unit', '알맞은 시간 단위 고르기', '①36 ②45 ③45', (d) => {
            const [thing, n, unit] = d.pick(TIMES), list = ['초', '분', '시간'];
            return C(`${josa(thing, '은/는')} 약 ${n}□이다. □ 안에 알맞은 단위는?`, list, list.indexOf(unit), { explain: `${josa(thing, '은/는')} 약 ${n}${unit}이다.`, facts: { truth: list.map((u) => u === unit), want: true } });
          }),
          T('sec-wrong', '시간의 단위를 잘못 쓴 문장 찾기', '③46', (d) => {
            const WRONG = { 초: '시간', 분: '초', 시간: '초' };
            const picks = d.until(() => d.shuffle(TIMES).slice(0, 4), (list) => new Set(list.map(([, , u]) => u)).size === 3), bad = d.int(0, 3);
            const list = picks.map(([thing, n, unit], i) => `${josa(thing, '은/는')} 약 ${n}${i === bad ? WRONG[unit] : unit}이다.`);
            return C('시간의 단위를 알맞게 쓰지 않은 것은?', list, bad, { explain: `${josa(picks[bad][0], '은/는')} 약 ${picks[bad][1]}${picks[bad][2]}이다.`, facts: { truth: list.map((_, i) => i !== bad), want: false } });
          }),
          T('sec-one', '1초 동안 할 수 있는 일', '①35 ②37 ③44', (d) => {
            const quick = d.pick(IN_ONE_SECOND), list = d.shuffle(d.shuffle(NOT_IN_ONE_SECOND).slice(0, 3).concat([quick]));
            return C('1초 동안 할 수 있는 일로 알맞은 것은?', list, list.indexOf(quick), { explain: `1초는 아주 짧은 시간이다. ${quick}는 1초쯤 걸린다.`, facts: { truth: list.map((v) => v === quick), want: true } });
          })
        ]
      },
      {
        id: 'tadd', title: '시간의 덧셈', standard: TIME,
        types: [
          T('tadd-ms', '분과 초의 덧셈', '①40 ②50 ③50', (d) => {
            const [a, b] = sumPair(d, false, false), sum = hms(secs(a) + secs(b));
            return M('다음을 계산하시오.', ask(['분', '초'], sum), {
              figure: timeColumn(spanCells(a), '+', spanCells(b)), explain: `초끼리 더하면 ${a[2] + b[2]}초이고, 60초는 1분이므로 ${span(sum)}이다.`,
              facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'ms', at: 0 }], timeRule: { op: '+', a, b } }
            });
          }),
          T('tadd-hms', '시각과 시간의 덧셈', '①42 ②50 ③50', (d) => {
            const [a, b] = sumPair(d, true, true), sum = hms(secs(a) + secs(b));
            return M('다음을 계산하시오.', ask(['시', '분', '초'], sum), {
              figure: timeColumn(atCells(a), '+', spanCells(b)), explain: `초끼리 더하면 ${a[2] + b[2]}초, 분끼리 더하면 ${a[1] + b[1]}분이다. 60초는 1분, 60분은 1시간으로 받아올림하면 ${at(sum)}이다.`,
              facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'hms', at: 0 }], timeRule: { op: '+', a, b }, rule: 'carry' }
            });
          }),
          T('tadd-end', '문장제: 끝난 시각', '①54 ②52 ③61', (d) => {
            const [a, b] = sumPair(d, true, false), sum = hms(secs(a) + secs(b)), who = d.pick(NAMES);
            return M(`${name(who, '은/는')} ${at(a)}부터 ${span(b)} 동안 연을 만들었다. 연을 다 만든 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], sum), {
              explain: `${at(a)}에서 ${span(b)}이 지난 시각은 ${at(sum)}이다.`.replace('초이 지난', '초가 지난'), facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'hms', at: 0 }] }
            });
          }),
          T('tadd-two', '문장제: 두 시간의 합', '①52 ②53 ③62', (d) => {
            // 35분 27초 + 42분 38초 = 1시간 18분 5초
            const [a, b] = sumPair(d, false, true), sum = hms(secs(a) + secs(b));
            return M(`수영을 ${span(a)} 동안 한 다음 바로 달리기를 ${span(b)} 동안 하였다. 수영과 달리기를 한 시간은 모두 몇 시간 몇 분 몇 초인가?`, ask(['시간', '분', '초'], sum), {
              explain: `초끼리 더하면 ${a[2] + b[2]}초, 분끼리 더하면 ${a[1] + b[1]}분이다. 받아올림하면 ${span(sum)}이다.`, facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'hms', at: 0 }] }
            });
          }),
          T('tadd-easy', '받아올림이 없는 덧셈', '①41 ②49 ③49', (d) => {
            const [a, b] = d.until(() => [[d.int(1, 8), d.int(11, 38), d.int(11, 38)], [d.int(1, 3), d.int(11, 20), d.int(11, 20)]], ([x, y]) => x[1] !== y[1] && x[2] !== y[2] && x[1] !== x[2]), sum = hms(secs(a) + secs(b));
            return M('다음을 계산하시오.', ask(['시', '분', '초'], sum), {
              figure: timeColumn(atCells(a), '+', spanCells(b)), explain: `시는 시끼리, 분은 분끼리, 초는 초끼리 더한다. ${at(sum)}`, facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'hms', at: 0 }], timePlain: { op: '+', a, b }, rule: 'noCarry' }
            });
          }),
          T('tadd-clock', '시계의 시각에서 얼마 후의 시각', '①55 ③59', (d) => {
            const apart = (p, q) => { const gap = Math.abs(p - q) % 360; return Math.min(gap, 360 - gap); };
            const [h, m, s] = d.until(() => [d.int(1, 10), d.int(2, 6) * 5, d.int(4, 11) * 5], ([x, y, z]) => y !== z && apart(x * 30 + y / 2, y * 6) >= 24 && apart(x * 30 + y / 2, z * 6) >= 24);
            const b = d.until(() => [0, d.int(12, 24), d.int(15, 50)], (v) => s + v[2] >= 61 && (s + v[2]) % 60 !== 0), sum = hms(secs([h, m, s]) + secs(b));
            return M(`시계가 나타내는 시각에서 ${span(b)} 후의 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], sum), {
              figure: G.clock(h, m, s), explain: `시계가 나타내는 시각은 ${at([h, m, s])}이다. ${span(b)} 후의 시각은 ${at(sum)}이다.`, facts: { clock: [{ expr: `${S([h, m, s])}+${S(b)}`, parts: 'hms', at: 0 }] }
            });
          }),
          T('tadd-fix', '잘못 계산한 덧셈 바로잡기', '①51 ②57 ③51', (d) => {
            // 3시 25분 30초+2시간 19분 45초=5시 44분 15초 → 5시 45분 15초
            const [a, b] = sumPair(d, true, false), sum = hms(secs(a) + secs(b)), wrong = [a[0] + b[0], a[1] + b[1], (a[2] + b[2]) % 60];
            return M('다음은 잘못 계산한 것이다. 바르게 계산한 값은 몇 시 몇 분 몇 초인가?', ask(['시', '분', '초'], sum), {
              figure: timeColumn(atCells(a), '+', spanCells(b), atCells(wrong)), explain: `초끼리 더한 ${a[2] + b[2]}초에서 60초를 1분으로 받아올림하지 않았다. 바르게 계산하면 ${at(sum)}이다.`,
              facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'hms', at: 0 }], timeRule: { op: '+', a, b }, wrongClock: wrong }
            });
          })
        ]
      },
      {
        id: 'tsub', title: '시간의 뺄셈', standard: TIME,
        types: [
          T('tsub-ms', '분과 초의 뺄셈', '①45 ②65 ③57', (d) => {
            const [a, b] = diffPair(d, false, false), gap = hms(secs(a) - secs(b));
            return M('다음을 계산하시오.', ask(['분', '초'], gap), {
              figure: timeColumn(spanCells(a), '-', spanCells(b)), explain: `${a[2]}초에서 ${b[2]}초를 뺄 수 없으므로 1분을 60초로 받아내림하여 계산하면 ${span(gap)}이다.`,
              facts: { clock: [{ expr: `${S(a)}-${S(b)}`, parts: 'ms', at: 0 }], timeRule: { op: '-', a, b } }
            });
          }),
          T('tsub-hms', '시각과 시간의 뺄셈', '①47 ②65 ③57', (d) => {
            const [a, b] = diffPair(d, true, true), gap = hms(secs(a) - secs(b));
            return M('다음을 계산하시오.', ask(['시', '분', '초'], gap), {
              figure: timeColumn(atCells(a), '-', spanCells(b)), explain: `1분을 60초로, 1시간을 60분으로 받아내림하여 계산하면 ${at(gap)}이다.`,
              facts: { clock: [{ expr: `${S(a)}-${S(b)}`, parts: 'hms', at: 0 }], timeRule: { op: '-', a, b }, rule: 'carry' }
            });
          }),
          T('tsub-easy', '받아내림이 없는 뺄셈', '①46 ②64 ③55', (d) => {
            const [a, b] = d.until(() => [[d.int(5, 11), d.int(31, 56), d.int(31, 56)], [d.int(1, 3), d.int(11, 28), d.int(11, 28)]], ([x, y]) => x[1] - y[1] !== x[2] - y[2] && x[1] !== x[2]), diff = hms(secs(a) - secs(b));
            return M('다음을 계산하시오.', ask(['시', '분', '초'], diff), {
              figure: timeColumn(atCells(a), '-', spanCells(b)), explain: `시는 시끼리, 분은 분끼리, 초는 초끼리 뺀다. ${at(diff)}`, facts: { clock: [{ expr: `${S(a)}-${S(b)}`, parts: 'hms', at: 0 }], timePlain: { op: '-', a, b }, rule: 'noCarry' }
            });
          }),
          T('tsub-fix', '잘못 계산한 뺄셈 바로잡기', '①51 ②73 ③58', (d) => {
            // 초를 받아내림하고도 분에서 1분을 빼지 않은 계산
            const [a, b] = diffPair(d, true, false), diff = hms(secs(a) - secs(b)), wrong = [a[0] - b[0], a[1] - b[1], a[2] + 60 - b[2]];
            return M('다음은 잘못 계산한 것이다. 바르게 계산한 값은 몇 시 몇 분 몇 초인가?', ask(['시', '분', '초'], diff), {
              figure: timeColumn(atCells(a), '-', spanCells(b), atCells(wrong)), explain: `초끼리 뺄 수 없어 1분을 60초로 받아내림하였는데, 분에서 1분을 빼지 않았다. 바르게 계산하면 ${at(diff)}이다.`,
              facts: { clock: [{ expr: `${S(a)}-${S(b)}`, parts: 'hms', at: 0 }], timeRule: { op: '-', a, b }, wrongClock: wrong }
            });
          }),
          T('tsub-clocks', '두 시계의 시각으로 걸린 시간 구하기', '①64 ③65', (d) => {
            const apart = (p, q) => { const gap = Math.abs(p - q) % 360; return Math.min(gap, 360 - gap); };
            const clear = ([x, y, z]) => y !== z && y > 0 && z > 0 && apart(x * 30 + y / 2, y * 6) >= 24 && apart(x * 30 + y / 2, z * 6) >= 24;
            const [start, took] = d.until(() => [[d.int(1, 10), d.int(1, 7) * 5, d.int(6, 11) * 5], [0, d.int(2, 4) * 5, d.int(2, 9) * 5]], ([x, y]) => x[2] + y[2] >= 65 && clear(x) && clear(hms(secs(x) + secs(y))));
            const end = hms(secs(start) + secs(took));
            return M('그림 그리기를 시작한 시각과 끝낸 시각이다. 그림을 그리는 데 걸린 시간은 몇 분 몇 초인가?', ask(['분', '초'], took), {
              figure: lines(['시작한 시각', G.clock(start[0], start[1], start[2]), '끝낸 시각', G.clock(end[0], end[1], end[2])]),
              explain: `시작한 시각은 ${at(start)}, 끝낸 시각은 ${at(end)}이다. ${at(end)} − ${at(start)} = ${span(took)}`, facts: { clock: [{ expr: `${S(end)}-${S(start)}`, parts: 'ms', at: 0 }] }
            });
          }),
          T('tsub-start', '문장제: 시작한 시각', '①65 ②67 ③63', (d) => {
            const [a, b] = diffPair(d, true, false), gap = hms(secs(a) - secs(b));
            return M(`영화가 ${at(a)}에 끝났다. 영화를 상영한 시간이 ${span(b)}일 때, 영화가 시작한 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], gap), {
              explain: `${at(a)}에서 ${span(b)} 전의 시각은 ${at(gap)}이다.`, facts: { clock: [{ expr: `${S(a)}-${S(b)}`, parts: 'hms', at: 0 }] }
            });
          }),
          T('tsub-took', '문장제: 걸린 시간', '①63 ②68 ③64', (d) => {
            const [end, took] = diffPair(d, true, true), start = hms(secs(end) - secs(took)), who = d.pick(NAMES);
            return M(`${name(who, '은/는')} ${at(start)}에 집에서 출발하여 ${at(end)}에 할머니 댁에 도착하였다. 가는 데 걸린 시간은 몇 시간 몇 분 몇 초인가?`, ask(['시간', '분', '초'], took), {
              explain: `도착한 시각에서 출발한 시각을 빼면 ${span(took)}이다.`, facts: { clock: [{ expr: `${S(end)}-${S(start)}`, parts: 'hms', at: 0 }] }
            });
          }),
          T('tsub-rest', '문장제: 남은 시간', '①62 ②70', (d) => {
            const [a, b] = diffPair(d, false, false), gap = hms(secs(a) - secs(b));
            return M(`달걀을 ${span(a)} 동안 삶으려고 한다. 삶기 시작한 지 ${span(b)}가 지났다면 앞으로 더 삶아야 하는 시간은 몇 분 몇 초인가?`, ask(['분', '초'], gap), {
              explain: `${span(a)}에서 ${span(b)}를 빼면 ${span(gap)}이다.`, facts: { clock: [{ expr: `${S(a)}-${S(b)}`, parts: 'ms', at: 0 }] }
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
