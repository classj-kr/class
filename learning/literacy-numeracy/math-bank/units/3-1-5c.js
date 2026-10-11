// 3학년 1학기 5단원 길이와 시간 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록 넷(기본꼴 1~3, 심화꼴)과 덧문서를 처음부터 끝까지 다시 읽고, 3-1-5a.js·3-1-5b.js 의 유형이 묻지 않는 꼴을 옮겼다.
// 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다. ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n 은 기본꼴_2·3, 심n 은 심화꼴의 n번이다.
//
// 앞의 두 파일은 「같은 꼴이라 한 번만」이라며 단위(mm·km·초)나 계산 구조가 다른 것을 한데 묶었다. 여기서는
// 주는 것(식·그림·표·문장), 묻는 것(값·고르기·차례·틀린 것), 계산 구조(받아올림·받아내림이 있는가, 단위가 둘인가 셋인가, 빈 단위가 있는가),
// 문장제의 얼개(합치기·비교·거꾸로·두 번 계산)가 다르면 따로 실었다.
//
// 뺀 것과 까닭
//  - 뒤 단원·위 학년: 길이를 소수로(①14, ①16·①17의 일부), (몇백)×(몇)이 드는 여러 바퀴·되풀이 구간(①25, ②26·심29의 4바퀴, 심30),
//    네 자리 수의 덧셈·뺄셈이 드는 km·m 계산(①26 ②28 심31 심32), 큰 수의 나눗셈(심26), 빠르기(②34),
//    24시간제 시각(②68의 18시, 심53·심55의 일부, 심70), 둘레(②33), 다섯 자리 수 m(①9·①12·①22·심12의 일부)
//  - 앞 학년 되짚기(초가 없이 「시간」과 「분」만 바꾸어 견주는 것): ②76 ③67 ③72 ③75 심39, ②69·심72의 일부
//  - 조건 풀이·경우 따지기: 교시 시간표(①60 심64), 되풀이 횟수 세기(②63), 간격(②31), 쓰이지 않는 시각(①70 심66),
//    정한 시간 안에 드는 활동·닿을 수 있는 곳 고르기(①67 ②61 ③70 ③71 심68), 가장 짧은 두 길(심15), 격자 지도(심24), 단서 맞추기(②75)
//  - 뜻 없는 셈: 단위가 다른 빈칸의 수끼리 더하기(①38 ②11 ③43 심9), 두 계산 결과를 다시 더하거나 빼기(①49의 일부, 심47),
//    가장 긴 시간과 가장 짧은 시간의 합(③53)
//  - 긋기·재기·그리기·쓰기·놀이: 자로 선 긋기와 재어 보기(①8·②4·②5의 일부 ①20 ②19 ③26), 초바늘 그려 넣기(①29 ②40 ③37 — 가리키는 숫자는 sec-point 로 물었다),
//    글 쓰기(①73 ②48 ③19 ③30 ③73 심42), 놀이·활동(③74)
//  - 이미 있는 유형과 수·표기만 다른 것: 한 사람만 시간으로 준 걸린 시간 견주기(①68 — h-longer), 한쪽을 초로만 적은 합과 차(③52 — tsub-both),
//    「더 적게」로 방향만 바꾼 둘의 합(심61 — h-round), 알맞게 쓴 문장 고르기(심19 — guess-wrong 을 뒤집은 것)
//  - 그림이 필요해 미룬 꼴: 실물 그림을 보고 어림값 고르기(②18)
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다. 수와 단위 기호는 띄어 쓴다(7 km 50 m).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, lines, tagged, table, ruler, timeColumn, route, tapes, N, M, C } = B.kit;
  const G = B.kit.geo;
  const UNIT = '4수03-16', MEASURE = '4수03-15', SECOND = '4수03-13', TIME = '4수03-14';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 기본 자료에만 나오지만 두 번 넘게 계산해야 하는 문제
  const HB = (id, title, ref, make, more) => T(id, title, ref, make, Object.assign({ level: '실력' }, more || {}));
  const SIGNS = ['&gt;', '=', '&lt;'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  // 기호를 붙인 줄이 길 때: 식과 결과를 두 줄로 나누어 적는다(둘째 줄은 기호 너비만큼 들여 쓴다).
  const twoLines = (first, second) => first + '<br><span class="mb-tag mb-tag-short"></span>' + second;
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const PLACES = ['은행', '병원', '소방서', '수영장', '놀이터', '박물관', '도서관', '우체국', '공원', '학교'];
  // 세 가지의 차례를 묻는 보기 넷(바른 차례 하나와 다른 차례 셋)
  const fourOrders = (d, right) => d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));

  // ── 길이 ─────────────────────────────────────────────────────
  // mm 로 센 길이를 「몇 cm 몇 mm」로, m 로 센 거리를 「몇 km 몇 m」로 적는다(두 단위의 수가 모두 0이 아닐 때만 쓴다).
  const cm = (v) => `${Math.floor(v / 10)} cm ${v % 10} mm`;
  const km = (v) => `${Math.floor(v / 1000)} km ${v % 1000} m`;
  const cmE = (v) => `(${Math.floor(v / 10)}*10+${v % 10})`;
  const kmE = (v) => `(${Math.floor(v / 1000)}*1000+${v % 1000})`;
  // 길 그림의 설명에 그림 속 거리를 적어 둔다(화면을 읽어 주는 도구와 검사가 그림 속 수를 이 글로 읽는다).
  const said = (svg, label) => svg.replace('aria-label="길 그림"', 'aria-label="길 그림: ' + label + '"');

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
  // 초로 센 시간을 「몇 분 몇 초」로 적은 글과 그 식
  const ms = (t) => `${Math.floor(t / 60)}분 ${t % 60}초`;
  const msE = (t) => `(${Math.floor(t / 60)}*60+${t % 60})`;
  // 분으로 센 시각을 「몇 시 몇 분」으로 적은 글과 그 식(초가 없는 문장제)
  const hm = (t) => `${Math.floor(t / 60)}시 ${t % 60}분`;
  const hmE = (t) => `(${Math.floor(t / 60)}*60+${t % 60})`;
  // 초·분에서 받아올림(받아내림)이 일어나는 두 시간을 뽑는다.
  const sumPair = (d, hours, carryMinute) => d.until(() => [[hours ? d.int(1, 7) : 0, d.int(11, 48), d.int(12, 56)], [hours ? d.int(1, 3) : 0, d.int(11, 48), d.int(12, 56)]],
    ([a, b]) => a[2] + b[2] >= 61 && (carryMinute ? a[1] + b[1] + 1 >= 61 : a[1] + b[1] + 1 <= 58) && a[1] !== b[1] && a[2] !== b[2]);
  const diffPair = (d, hours, borrowMinute) => d.until(() => [[hours ? d.int(4, 11) : 0, d.int(11, 56), d.int(8, 48)], [hours ? d.int(1, 3) : 0, d.int(8, 52), d.int(15, 56)]],
    ([a, b]) => a[2] < b[2] - 1 && (borrowMinute ? a[1] - 1 < b[1] - 1 : a[1] - 1 > b[1] + 1) && (hours ? secs(a) - secs(b) >= 3700 : a[1] - 1 > b[1] + 1));
  // 바늘 셋이 서로 떨어져 있어 또렷이 읽히는 시각(긴바늘과 초바늘은 숫자를 가리킨다)
  const apart = (p, q) => { const gap = Math.abs(p - q) % 360; return Math.min(gap, 360 - gap); };
  const clear = ([h, m, s]) => m !== s && m > 0 && s > 0 && apart(h * 30 + m / 2, m * 6) >= 24 && apart(h * 30 + m / 2, s * 6) >= 24;

  // ── 어림에 쓰는 것들(사실 그대로) ────────────────────────────
  // 크기가 뚜렷이 다른 네 갈래의 [대상, 알맞은 길이]
  const SIZES = [
    [['쌀 한 톨의 길이', '5 mm'], ['개미의 몸길이', '4 mm'], ['공책의 두께', '5 mm']],
    [['젓가락의 길이', '20 cm'], ['수학책의 긴 쪽의 길이', '26 cm'], ['새 연필의 길이', '17 cm']],
    [['교실 문의 높이', '2 m'], ['버스의 길이', '11 m'], ['3층 건물의 높이', '10 m']],
    [['마라톤 선수가 달리는 거리', '42 km'], ['자동차가 고속 도로를 1시간 동안 달리는 거리', '100 km']]
  ];
  const UNDER_CM = ['쌀 한 톨의 길이', '개미의 몸길이', '연필심의 굵기', '공책의 두께'];
  const OVER_CM = ['젓가락의 길이', '수학책의 긴 쪽의 길이', '새 연필의 길이', '교실 문의 높이', '숟가락의 길이', '필통의 길이'];
  // 단위를 가린 [대상, 수] — 수가 그 단위일 때만 말이 된다.
  const BY_UNIT = {
    mm: [['개미의 몸길이', 4], ['쌀 한 톨의 길이', 5], ['실내화의 길이', 210], ['새 연필의 길이', 170], ['공책의 두께', 5]],
    cm: [['젓가락의 길이', 20], ['수학책의 긴 쪽의 길이', 26], ['3학년 학생의 키', 130], ['숟가락의 길이', 18]],
    m: [['교실 문의 높이', 2], ['버스의 길이', 11]]
  };
  const BY_TIME = {
    초: [['눈을 한 번 깜박이는 데 걸리는 시간', 1], ['100 m를 달리는 데 걸리는 시간', 20], ['손을 씻는 데 걸리는 시간', 30], ['물 한 모금을 마시는 데 걸리는 시간', 2]],
    분: [['이를 닦는 데 걸리는 시간', 3], ['점심을 먹는 데 걸리는 시간', 30], ['학교의 쉬는 시간', 10], ['라면을 끓이는 데 걸리는 시간', 5]],
    시간: [['밤에 잠을 자는 시간', 9], ['학교에서 보내는 시간', 6], ['영화 한 편을 보는 시간', 2]]
  };
  const NEED_SECOND = ['100 m 달리기 기록', '50 m 수영 기록', '횡단보도의 초록불이 켜져 있는 시간'];
  const NO_SECOND = ['하루 동안 잠을 잔 시간', '영화 한 편을 보는 시간', '학교에서 보낸 시간', '소풍을 다녀오는 데 걸린 시간', '기차를 타고 간 시간'];

  // ── mm와 cm ──────────────────────────────────────────────────
  B.addTypes('3-1-5', 'mm', [
    T('mm-whole', '몇 cm와 몇십 mm', '①4 ②7 ③2·3', (d) => {
      // 21 cm=□ mm, 940 mm=□ cm
      const [c, w] = d.until(() => [d.int(12, 96), d.int(12, 96)], ([x, y]) => x !== y && x % 10 !== 0 && y % 10 !== 0);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: c * 10 }, { label: LABELS[1], answer: w }], {
        figure: lines([`${c} cm = ${box(LABELS[0])} mm`, `${w * 10} mm = ${box(LABELS[1])} cm`]),
        explain: `1 cm는 10 mm이다. ${c} cm는 ${c * 10} mm이고, ${w * 10} mm는 ${w} cm이다.`,
        facts: { calc: [[`${c}*10`, 0], [`${w * 10}/10`, 1]], unseen: [10] }
      });
    }),
    T('mm-word', '문장제: mm로 잰 길이를 cm와 mm로', '①5 ②7 ③6', (d) => {
      const [thing, lo, hi] = d.pick([['색연필', 112, 178], ['숟가락', 152, 198], ['필통', 182, 238], ['리코더', 302, 338]]);
      const v = d.until(() => d.int(lo, hi), (x) => x % 10 !== 0);
      return M(`${thing}의 길이를 재었더니 ${v} mm였다. ${thing}의 길이는 몇 cm 몇 mm인가?`, [{ answer: Math.floor(v / 10), unit: 'cm' }, { answer: v % 10, unit: 'mm' }], {
        explain: `10 mm는 1 cm이다. ${v} mm는 ${Math.floor(v / 10) * 10} mm보다 ${v % 10} mm 더 긴 길이이므로 ${cm(v)}이다.`, facts: { unit: [{ expr: String(v), base: 10, at: [0, 1] }] }
      });
    }),
    T('mm-steps', 'mm를 cm와 mm로 바꾸는 과정', '①6 ②8', (d) => {
      // 47 mm=40 mm+7 mm=4 cm 7 mm
      const v = d.until(() => d.int(23, 298), (x) => x % 10 !== 0), o = v % 10;
      return M('길이를 바꾸는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: v - o }, { label: LABELS[1], answer: (v - o) / 10 }], {
        figure: lines([`${v} mm = ${box(LABELS[0])} mm + ${o} mm`, `= ${box(LABELS[1])} cm ${o} mm`]),
        explain: `${v} mm는 ${v - o} mm와 ${o} mm로 가를 수 있다. ${v - o} mm는 ${(v - o) / 10} cm이므로 ${v} mm는 ${cm(v)}이다.`,
        facts: { calc: [[`${v}-${o}`, 0], [`(${v}-${o})/10`, 1]], unseen: [10] }
      });
    }),
    T('mm-wrong', '길이를 잘못 나타낸 것 찾기(cm와 mm)', '①9 ②10 ③8 심5', (d) => {
      // 틀린 줄: 8 cm 6 mm 를 806 mm 로(자리를 하나 비움), 또는 128 mm 를 1 cm 28 mm 로(백의 자리만 cm 로 옮김)
      const cs = d.shuffle([2, 3, 4, 6, 7, 8, 9]), os = d.shuffle([2, 3, 4, 6, 7, 8, 9]), big = d.int(11, 48), slip = d.bool();
      const v = d.until(() => d.int(112, 198), (x) => x % 10 !== 0 && x % 100 > 10);
      const rows = d.shuffle([
        { text: `${cs[0]} cm ${os[0]} mm = ${cs[0] * 10 + os[0]} mm`, expr: `${cs[0]}*10+${os[0]}`, value: cs[0] * 10 + os[0] },
        { text: `${big * 10 + os[1]} mm = ${big} cm ${os[1]} mm`, expr: `${big}*10+${os[1]}`, value: big * 10 + os[1] },
        { text: `${cs[1] * 100} mm = ${cs[1] * 10} cm`, expr: `${cs[1] * 10}*10`, value: cs[1] * 100 },
        slip ? { text: `${cs[2]} cm ${os[2]} mm = ${cs[2] * 100 + os[2]} mm`, expr: `${cs[2]}*10+${os[2]}`, value: cs[2] * 100 + os[2], bad: true }
          : { text: `${v} mm = ${Math.floor(v / 100)} cm ${v % 100} mm`, expr: `${Math.floor(v / 100)}*10+${v % 100}`, value: v, bad: true }
      ]);
      return C('길이를 잘못 나타낸 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.bad), {
        explain: slip ? `${cs[2]} cm ${os[2]} mm는 ${cs[2] * 10} mm보다 ${os[2]} mm 더 긴 ${cs[2] * 10 + os[2]} mm이다.` : `${v} mm는 ${Math.floor(v / 10) * 10} mm보다 ${v % 10} mm 더 긴 ${cm(v)}이다.`,
        facts: { claimed: rows.map((row) => [row.expr, row.value]), claimedWant: false }
      });
    }),
    T('mm-talk', '길이를 잘못 말한 사람 찾기', '①9 ②10 ③9 심5', (d) => {
      // 세 사람의 말: 「450 mm는 45 cm와 같다」「455 mm는 45 cm보다 5 mm 더 긴 길이이다」「7 cm 4 mm는 74 mm와 같다」 가운데 하나를 틀리게
      const who = d.shuffle(NAMES).slice(0, 3), bad = d.int(0, 2);
      const a = d.until(() => d.int(21, 48), (x) => x % 10 !== 0), b = d.until(() => d.int(213, 487), (x) => x % 10 !== 0 && Math.floor(x / 10) % 10 !== 0);
      const [c, o] = d.until(() => [d.int(3, 9), d.int(2, 9)], ([x, y]) => x !== y);
      const rows = [
        bad === 0 ? { text: `${a * 10} mm는 ${cm(a)}와 같다.`, expr: cmE(a), value: a * 10, fix: `${a * 10} mm는 ${a} cm와 같다.` } : { text: `${a * 10} mm는 ${a} cm와 같다.`, expr: `${a}*10`, value: a * 10 },
        bad === 1 ? { text: `${b} mm는 ${Math.floor(b / 100) * 10} cm보다 ${b % 10} mm 더 긴 길이이다.`, expr: `${Math.floor(b / 100) * 10}*10+${b % 10}`, value: b, fix: `${b} mm는 ${Math.floor(b / 10)} cm보다 ${b % 10} mm 더 긴 길이이다.` }
          : { text: `${b} mm는 ${Math.floor(b / 10)} cm보다 ${b % 10} mm 더 긴 길이이다.`, expr: `${Math.floor(b / 10)}*10+${b % 10}`, value: b },
        bad === 2 ? { text: `${c} cm ${o} mm는 ${c * 100 + o} mm와 같다.`, expr: `${c}*10+${o}`, value: c * 100 + o, fix: `${c} cm ${o} mm는 ${c * 10 + o} mm와 같다.` } : { text: `${c} cm ${o} mm는 ${c * 10 + o} mm와 같다.`, expr: `${c}*10+${o}`, value: c * 10 + o }
      ];
      return C('세 사람이 길이에 대하여 말한 것이다. 잘못 말한 사람은?', who, bad, {
        figure: lines(rows.map((row, i) => `${who[i]}: ${row.text}`)), explain: `1 cm는 10 mm이다. ${rows[bad].fix}`,
        facts: { claimed: rows.map((row) => [row.expr, row.value]), claimedWant: false }
      });
    }),
    T('mm-match', '같은 길이끼리 짝 짓기(cm와 mm)', '①10 ②9 심4', (d) => {
      // 5 cm 6 mm · 56 cm · 50 cm 6 mm ― 56 mm · 560 mm · 506 mm
      const [x, y] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p !== q);
      const rows = d.shuffle([[`${x} cm ${y} mm`, `${x}*10+${y}`, x * 10 + y], [`${x}${y} cm`, `${x}${y}*10`, x * 100 + y * 10], [`${x}0 cm ${y} mm`, `${x}0*10+${y}`, x * 100 + y]]);
      const right = rows.map((row) => row[2]);
      const list = d.shuffle([right].concat(d.shuffle(ORDERS.slice(1)).slice(0, 3).map((o) => o.map((i) => right[i]))));
      return C('㉠, ㉡, ㉢과 같은 길이를 차례대로 쓴 것은?', list.map((o) => o.map((v) => v + ' mm').join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map((row) => row[0])), explain: rows.map((row, i) => `${LABELS[i]} ${row[0]} = ${row[2]} mm`).join(', '),
        facts: { match: { exprs: rows.map((row) => row[1]), options: list } }
      });
    }),
    T('mm-pick', '자 그림에서 주어진 길이 찾기', '②5', (d) => {
      // 보기: 바른 길이, cm와 mm의 수를 바꾼 것(또는 큰 눈금 하나를 잘못 센 것), 가운데 긴 눈금에서부터 센 것
      const [c, o] = d.until(() => [d.int(1, 3), d.int(1, 9)], ([x, y]) => x !== y && y !== 5);
      const target = c * 10 + o, other = o <= 3 ? o * 10 + c : c <= 2 ? target + 10 : target - 10, near = c * 10 + (o > 5 ? o - 5 : o + 5);
      const list = d.shuffle([target, other, near]);
      return C(`물건의 길이가 ${c} cm ${o} mm인 것은?`, LABELS.slice(0, 3), list.indexOf(target), {
        figure: G.tiles(list.map((v, i) => [LABELS[i], ruler(0, v, 4)])), explain: `오른쪽 끝이 ${c} cm에서 작은 눈금 ${o}칸을 더 간 곳에 있는 것을 찾는다. ` + list.map((v, i) => `${LABELS[i]} ${cm(v)}`).join(', '),
        facts: { truth: list.map((v) => v === target), want: true }
      });
    }, { standard: MEASURE }),
    T('mm-order', '세 길이를 긴 것부터 차례로', '①23 ②22 ③31 심7', (d) => {
      // 24 cm 1 mm, 238 mm, 23 cm 7 mm
      const things = d.shuffle(['연필', '색연필', '볼펜', '숟가락', '빨대', '붓']).slice(0, 3), base = d.int(13, 21) * 10;
      const values = d.until(() => [base + d.int(-18, 28), base + d.int(-18, 28), base + d.int(-18, 28)], (v) => new Set(v).size === 3 && v.every((x) => x % 10 !== 0) && new Set(v.map((x) => Math.floor(x / 10))).size >= 2);
      const shown = values.map((v, i) => (i === 1 ? `${v} mm` : cm(v)));
      const right = [0, 1, 2].sort((p, q) => values[q] - values[p]), list = fourOrders(d, right);
      return C(`${things[0]}의 길이는 ${shown[0]}, ${things[1]}의 길이는 ${shown[1]}, ${things[2]}의 길이는 ${shown[2]}이다. 길이가 긴 것부터 차례대로 나열한 것은?`,
        list.map((o) => o.map((i) => things[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
          explain: values.map((v, i) => `${things[i]} ${v} mm`).join(', ') + '이다.',
          facts: { choose: { exprs: values.map((v, i) => (i === 1 ? String(v) : `${Math.floor(v / 10)}*10+${v % 10}`)), rule: 'descending', orders: list }, unseen: [10] }
        });
    }),
    T('mm-join', '문장제: cm인 부분과 mm인 부분을 합친 길이', '심27', (d) => {
      const c = d.int(6, 24), o = d.int(2, 9);
      return N(`수수깡의 빨간색 부분의 길이는 ${c} cm이고 파란색 부분의 길이는 ${o} mm이다. 수수깡의 전체 길이는 몇 mm인가?`, c * 10 + o, {
        unit: 'mm', explain: `${c} cm는 ${c * 10} mm이다. ${c * 10} mm와 ${o} mm를 더하면 ${c * 10 + o} mm이다.`, facts: { calc: [[`${c}*10+${o}`, 0]], unseen: [10] }
      });
    }),
    T('mm-times', '자 그림에서 읽은 길이를 여러 번 이은 길이', '②35', (d) => {
      const [w, k] = d.until(() => [d.int(6, 9), d.pick([3, 4, 7, 8, 9])], ([x, y]) => (x * y) % 10 !== 0);
      return M(`자 위에 놓인 콩과 길이가 같은 콩 ${k}개를 한 줄로 빈틈없이 이어 놓았다. 이어 놓은 콩 전체의 길이는 몇 cm 몇 mm인가?`, [{ answer: Math.floor((w * k) / 10), unit: 'cm' }, { answer: (w * k) % 10, unit: 'mm' }], {
        figure: ruler(0, w, 2), explain: `콩의 길이는 작은 눈금 ${w}칸이므로 ${w} mm이다. ${w} mm씩 ${k}개이면 ${w * k} mm이고, ${w * k} mm는 ${cm(w * k)}이다.`,
        facts: { unit: [{ expr: `${w}*${k}`, base: 10, at: [0, 1] }] }
      });
    })
  ]);

  // ── km와 m ───────────────────────────────────────────────────
  B.addTypes('3-1-5', 'km', [
    T('km-whole', '몇 km와 몇천 m', '①1·11 ②1·12 ③10~12 심11', (d) => {
      const [k, j] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: k * 1000 }, { label: LABELS[1], answer: j }], {
        figure: lines([`${k} km = ${box(LABELS[0])} m`, `${j * 1000} m = ${box(LABELS[1])} km`]),
        explain: `1 km는 1000 m이다. ${k} km는 ${k * 1000} m이고, ${j * 1000} m는 ${j} km이다.`,
        facts: { calc: [[`${k}*1000`, 0], [`${j * 1000}/1000`, 1]], unseen: [1000] }
      });
    }),
    T('km-word', '문장제: m로 나타낸 거리를 km와 m로', '①13 ②12 ③11·16', (d) => {
      const thing = d.pick(['다리', '터널', '둘레길', '자전거 길']);
      const v = d.until(() => d.int(1005, 9990), (x) => x % 1000 !== 0 && (x % 1000 < 100 || x % 10 === 0));
      return M(`어느 ${thing}의 길이는 ${v} m이다. 이 ${thing}의 길이는 몇 km 몇 m인가?`, [{ answer: Math.floor(v / 1000), unit: 'km' }, { answer: v % 1000, unit: 'm' }], {
        explain: `1000 m는 1 km이다. ${v} m는 ${Math.floor(v / 1000) * 1000} m보다 ${v % 1000} m 더 긴 길이이므로 ${km(v)}이다.`, facts: { unit: [{ expr: String(v), base: 1000, at: [0, 1] }] }
      });
    }),
    T('km-steps', 'km와 m를 m로 바꾸는 과정', '①6 ②8', (d) => {
      // 3 km 800 m=3000 m+800 m=3800 m
      const k = d.int(2, 9), r = d.pick([d.int(12, 95), d.int(105, 880)]);
      return M('거리를 바꾸는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: k * 1000 }, { label: LABELS[1], answer: k * 1000 + r }], {
        figure: lines([`${k} km ${r} m = ${box(LABELS[0])} m + ${r} m`, `= ${box(LABELS[1])} m`]),
        explain: `${k} km는 ${k * 1000} m이다. ${k * 1000} m와 ${r} m를 더하면 ${k * 1000 + r} m이다.`,
        facts: { calc: [[`${k}*1000`, 0], [`${k}*1000+${r}`, 1]], unseen: [1000] }
      });
    }),
    T('km-more', '몇 km보다 몇 m 더 먼 거리인지 구하기', '①15 ③16', (d) => {
      // 2086 m는 2 km보다 □ m 더 먼 거리
      const k = d.int(2, 9), r = d.pick([d.int(12, 95), d.int(105, 950)]), v = k * 1000 + r;
      return N(`${v} m는 ${k} km보다 몇 m 더 먼 거리인가?`, r, {
        unit: 'm', explain: `${k} km는 ${k * 1000} m이다. ${v} m는 ${k * 1000} m보다 ${r} m 더 먼 거리이다.`, facts: { calc: [[`${v}-${k}*1000`, 0]], unseen: [1000] }
      });
    }),
    T('km-match', '같은 거리끼리 짝 짓기(km와 m)', '①10 ②9 ③17 심11', (d) => {
      // 9 km 5 m · 9 km 50 m · 9 km 500 m ― 9005 m · 9050 m · 9500 m
      const [x, y] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([p, q]) => p !== q);
      const rows = d.shuffle([[`${x} km ${y} m`, `${x}*1000+${y}`, x * 1000 + y], [`${x} km ${y}0 m`, `${x}*1000+${y}0`, x * 1000 + y * 10], [`${x} km ${y}00 m`, `${x}*1000+${y}00`, x * 1000 + y * 100]]);
      const right = rows.map((row) => row[2]);
      const list = d.shuffle([right].concat(d.shuffle(ORDERS.slice(1)).slice(0, 3).map((o) => o.map((i) => right[i]))));
      return C('㉠, ㉡, ㉢과 같은 거리를 차례대로 쓴 것은?', list.map((o) => o.map((v) => v + ' m').join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map((row) => row[0])), explain: rows.map((row, i) => `${LABELS[i]} ${row[0]} = ${row[2]} m`).join(', '),
        facts: { match: { exprs: rows.map((row) => row[1]), options: list } }
      });
    }),
    T('km-write', '읽은 말을 길이로 쓰기', '①2 ②2 ③10', (d) => {
      const [k, r] = d.until(() => [d.int(2, 9), d.pick([d.int(3, 9), d.int(12, 95), d.int(105, 880)])], ([x, y]) => x !== y);
      const rows = d.shuffle([[`${k} km ${r} m`, true], [`${k} m ${r} km`, false], [`${k} km ${r} mm`, false], [`${k} cm ${r} m`, false]]);
      return C(`「${k} 킬로미터 ${r} 미터」를 바르게 쓴 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: '킬로미터는 km, 미터는 m라고 쓴다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('km-misread', '길이를 잘못 읽은 것 찾기', '①2 심3', (d) => {
      // 107 mm 를 「107 센티미터」로, 3 cm 4 mm 를 「3 미터 4 밀리미터」로, 5 km 70 m 를 「5 킬로미터 70 밀리미터」로
      const a = d.until(() => d.int(102, 198), (x) => x % 10 !== 0), [c, o] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y);
      const [k, j] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y), r = d.int(12, 95), bad = d.int(0, 2);
      const rows = d.shuffle([
        [`${a} mm`, bad === 0 ? `${a} 센티미터` : `${a} 밀리미터`, bad !== 0, `${a} 밀리미터`],
        [`${c} cm ${o} mm`, bad === 1 ? `${c} 미터 ${o} 밀리미터` : `${c} 센티미터 ${o} 밀리미터`, bad !== 1, `${c} 센티미터 ${o} 밀리미터`],
        [`${k} km ${r} m`, bad === 2 ? `${k} 킬로미터 ${r} 밀리미터` : `${k} 킬로미터 ${r} 미터`, bad !== 2, `${k} 킬로미터 ${r} 미터`],
        [`${j} km`, `${j} 킬로미터`, true, '']
      ]);
      const wrong = rows.find((row) => !row[2]);
      return C('길이를 잘못 읽은 것은?', rows.map(([written, read]) => `${written}: ${read}`), rows.indexOf(wrong), {
        explain: `mm는 밀리미터, cm는 센티미터, m는 미터, km는 킬로미터라고 읽는다. ${wrong[0]}는 ${wrong[3]}라고 읽는다.`, facts: { truth: rows.map((row) => row[2]), want: false }
      });
    }),
    T('km-tick', '수직선의 작은 눈금이 나타내는 거리', '②13', (d) => {
      const n = d.int(2, 9);
      return N(`1 km를 똑같이 10칸으로 나눈 수직선에서 작은 눈금 ${n}칸은 몇 m를 나타내는가?`, n * 100, {
        unit: 'm', explain: `1 km는 1000 m이므로 작은 눈금 한 칸은 100 m를 나타낸다. 작은 눈금 ${n}칸은 ${n * 100} m를 나타낸다.`, facts: { calc: [[`1000/10*${n}`, 0]], unseen: [1000] }
      });
    }),
    T('km-spot', '수직선에서 거리가 놓이는 자리', '①8 ②13', (d) => {
      const k = d.int(1, 8), j = d.int(2, 9);
      return N(`1 km를 똑같이 10칸으로 나눈 수직선에서 ${k} km ${j * 100} m는 ${k} km에서 작은 눈금 몇 칸을 더 간 곳인가?`, j, {
        unit: '칸', explain: `작은 눈금 한 칸은 100 m를 나타낸다. ${j * 100} m는 100 m씩 ${j}칸이다.`, facts: { calc: [[`${j * 100}/100`, 0]], unseen: [100] }
      });
    }),
    T('km-via', '길 그림에서 거쳐 가는 거리', '①24 ②24 ③16 심28', (d) => {
      const [p1, p2] = d.shuffle(PLACES).slice(0, 2);
      const [a, b] = d.until(() => [d.int(41, 89) * 10, d.int(41, 89) * 10], ([x, y]) => x !== y && x + y >= 1020 && (x + y) % 100 !== 0);
      return M(`집에서 ${josa(p1, '을/를')} 지나 ${p2}까지 가는 거리는 몇 km 몇 m인가?`, [{ answer: Math.floor((a + b) / 1000), unit: 'km' }, { answer: (a + b) % 1000, unit: 'm' }], {
        figure: said(route([['집', 0, 50], [p1, 50, 50], [p2, 100, 50]], [[0, 1, a + ' m'], [1, 2, b + ' m']], 40), `집에서 ${p1}까지 ${a} m, ${p1}에서 ${p2}까지 ${b} m`),
        explain: `${a} m + ${b} m = ${a + b} m이다. 1000 m는 1 km이므로 ${km(a + b)}이다.`, facts: { unit: [{ expr: `${a}+${b}`, base: 1000, at: [0, 1] }] }
      });
    }),
    T('km-far', '문장제: 두 곳 가운데 더 먼 곳', '①22 ②21 ③32 심13', (d) => {
      // 2 km 50 m 와 2500 m — 한 곳은 km와 m로, 다른 곳은 m로만 적는다.
      const [p1, p2] = d.shuffle(PLACES).slice(0, 2), k = d.int(1, 6), j = d.int(2, 9);
      const values = d.shuffle([k * 1000 + j * 10, k * 1000 + j * 100]), kmAt = d.int(0, 1);
      const shown = values.map((v, i) => (i === kmAt ? km(v) : `${v} m`));
      return C(`집에서 ${p1}까지의 거리는 ${shown[0]}이고, ${p2}까지의 거리는 ${shown[1]}이다. 집에서 더 먼 곳은?`, [p1, p2], values[0] > values[1] ? 0 : 1, {
        explain: `m로 나타내면 ${p1} ${values[0]} m, ${p2} ${values[1]} m이다.`,
        facts: { choose: { exprs: values.map((v, i) => (i === kmAt ? `${Math.floor(v / 1000)}*1000+${v % 1000}` : String(v))), rule: 'max' }, unseen: [1000] }
      });
    }),
    T('km-forms', '한 길이를 여러 가지로 나타낸 것 가운데 틀린 것', '②3 ③18 심10', (d) => {
      // 4065 m: 4 km 65 m, 4 킬로미터 65 미터, 4 km보다 65 m 더 긴 길이 — 4 km 650 m 는 아니다.
      const k = d.int(2, 9), r = d.int(12, 95), v = k * 1000 + r, thing = d.pick(['산책로', '숲길', '강둑길', '해안 길']);
      const rows = d.shuffle([[`${k} km ${r} m`, true], [`${k} 킬로미터 ${r} 미터`, true], [`${k} km보다 ${r} m 더 긴 길이`, true], [`${k} km ${r * 10} m`, false]]);
      return C(`어느 ${thing}의 길이는 ${v} m이다. 이 길이를 잘못 나타낸 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        explain: `${v} m는 ${k * 1000} m보다 ${r} m 더 긴 길이이므로 ${k} km ${r} m이다. ${k} km ${r * 10} m는 ${k * 1000 + r * 10} m이다.`, facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('km-left', '문장제: 남은 거리', '②25', (d) => {
      const [k, j] = d.until(() => [d.int(3, 9), d.int(1, 7)], ([x, y]) => y < x && x - y !== y), place = d.pick(['동물원', '수목원', '바닷가', '과학관']);
      return N(`집에서 ${place}까지의 거리는 ${k} km이다. 집에서 출발하여 ${j * 1000} m를 갔다면 ${place}까지 남은 거리는 몇 m인가?`, (k - j) * 1000, {
        unit: 'm', explain: `${k} km는 ${k * 1000} m이다. ${k * 1000} m에서 ${j * 1000} m를 빼면 ${(k - j) * 1000} m이다.`, facts: { calc: [[`${k}*1000-${j * 1000}`, 0]], unseen: [1000] }
      });
    }),
    T('km-count', '문장제: 1 m짜리를 이어 놓은 개수', '심17', (d) => {
      const k = d.pick([2, 4, 5, 6, 7, 8, 9]);
      return N(`길이가 1 m인 나무판을 겹치지 않게 한 줄로 이어 놓아 길이가 ${k} km인 숲길을 만들려고 한다. 나무판은 몇 개 필요한가?`, k * 1000, {
        unit: '개', explain: `${k} km는 ${k * 1000} m이다. 1 m인 나무판이 ${k * 1000}개 필요하다.`, facts: { calc: [[`${k}*1000`, 0]], unseen: [1000] }
      });
    })
  ]);

  // ── 길이 어림과 알맞은 단위 ──────────────────────────────────
  B.addTypes('3-1-5', 'guess', [
    T('guess-pick', '대상에 알맞은 길이 고르기', '①17 ②15·17 ③21·24 심21', (d) => {
      const at_ = d.int(0, 3), [thing, right] = d.pick(SIZES[at_]);
      const list = d.shuffle(SIZES.map((group, i) => (i === at_ ? right : d.pick(group)[1])));
      return C(`${josa(thing, '으로/로')} 가장 알맞은 것은?`, list, list.indexOf(right), {
        explain: `${josa(thing, '은/는')} 약 ${right}이다.`, facts: { truth: list.map((v) => v === right), want: true }
      });
    }),
    T('guess-short', '1 cm보다 짧은 것 고르기', '①18 ②17 ③24 심22', (d) => {
      const short = d.pick(UNDER_CM), list = d.shuffle(d.shuffle(OVER_CM).slice(0, 3).concat([short]));
      return C('길이가 1 cm보다 짧은 것은?', list, list.indexOf(short), {
        explain: `1 cm는 10 mm이다. ${josa(short, '은/는')} 10 mm보다 짧아 mm로 나타낸다.`, facts: { truth: list.map((v) => v === short), want: true }
      });
    }),
    T('guess-odd', '알맞은 길이 단위가 다른 하나', '심20', (d) => {
      const [many, lone] = d.pick([['mm', 'cm'], ['cm', 'mm'], ['cm', 'm'], ['mm', 'm']]);
      const rows = d.shuffle(d.shuffle(BY_UNIT[many]).slice(0, 3).map((row) => row.concat([many])).concat([d.pick(BY_UNIT[lone]).concat([lone])]));
      return C('□ 안에 알맞은 길이의 단위가 나머지 셋과 다른 것은?', rows.map(([thing, n]) => `${thing}: 약 ${n} □`), rows.findIndex((row) => row[2] === lone), {
        explain: rows.map(([thing, n, unit]) => `${thing} 약 ${n} ${unit}`).join(', ') + '이다.', facts: { kindPick: { kinds: rows.map((row) => row[2]), target: lone } }
      });
    }),
    T('guess-rank', '길이 단위의 크기 차례', '③25', (d) => {
      const big = d.bool(), right = big ? ['km', 'm', 'cm', 'mm'] : ['mm', 'cm', 'm', 'km'];
      const list = d.shuffle([right].concat(d.shuffle([[1, 0, 2, 3], [0, 2, 1, 3], [0, 1, 3, 2], [3, 2, 1, 0], [1, 0, 3, 2]]).slice(0, 3).map((o) => o.map((i) => right[i]))));
      return C(`길이의 단위를 ${big ? '큰' : '작은'} 것부터 차례대로 나열한 것은?`, list.map((o) => o.join(', ')), list.indexOf(right), {
        explain: `1 km는 1000 m, 1 m는 100 cm, 1 cm는 10 mm이다. ${big ? '큰' : '작은'} 단위부터 쓰면 ${right.join(', ')}이다.`, facts: { truth: list.map((o) => o === right), want: true }
      });
    }, { standard: UNIT }),
    T('guess-closer', '실제 길이에 더 가깝게 어림한 사람', '심25', (d) => {
      // 실제 17 cm 9 mm, 어림 17 cm 5 mm 와 18 cm
      const [one, two] = d.shuffle(NAMES).slice(0, 2), c = d.int(13, 21), r = d.pick([1, 2, 3, 4, 6, 7, 8, 9]), thing = c <= 15 ? '볼펜' : c <= 18 ? d.pick(['숟가락', '칫솔']) : d.pick(['필통', '빗']);
      const half = c * 10 + 5, whole = r > 5 ? (c + 1) * 10 : c * 10, flip = d.bool();
      const guesses = flip ? [whole, half] : [half, whole], shown = guesses.map((v) => (v % 10 ? cm(v) : `${v / 10} cm`));
      const gaps = guesses.map((v) => Math.abs(v - (c * 10 + r)));
      return C(`길이가 ${cm(c * 10 + r)}인 ${thing}의 길이를 ${name(one, '은/는')} 약 ${shown[0]}, ${name(two, '은/는')} 약 ${shown[1]}라고 어림하였다. 실제 길이에 더 가깝게 어림한 사람은?`, [one, two], gaps[0] < gaps[1] ? 0 : 1, {
        explain: `실제 길이와의 차는 ${nick(one)}가 ${gaps[0]} mm, ${nick(two)}가 ${gaps[1]} mm이다. 차가 작을수록 가깝게 어림한 것이다.`,
        facts: { choose: { exprs: guesses.map((v) => (v % 10 ? `${Math.floor(v / 10)}*10+${v % 10}` : `${v / 10}*10`)), rule: 'nearest', target: c * 10 + r }, unseen: [10] }
      });
    }),
    T('guess-far', '기준 거리로 다른 구간의 거리 어림하기', '①21 ②20 ③28 심23', (d) => {
      const places = ['집'].concat(d.shuffle(['학교', '공원', '도서관', '병원', '우체국']).slice(0, 3)), b = d.pick([200, 300, 400]);
      const [from, to] = d.pick([[0, 2], [0, 3], [1, 3]]), steps = to - from;
      return N(`그림에서 이웃한 두 곳 사이의 거리는 모두 같다. 집에서 ${places[1]}까지의 거리가 약 ${b} m일 때, ${places[from]}에서 ${places[to]}까지의 거리는 약 몇 m인가?`, b * steps, {
        unit: 'm', lead: '약',
        figure: said(route(places.map((place, i) => [place, i * 33.3, 50, true]), [[0, 1, `약 ${b} m`, -5], [1, 2], [2, 3]], 44), `네 곳이 같은 간격으로 한 줄에 놓여 있다. 집에서 ${places[1]}까지 약 ${b} m`),
        explain: `${places[from]}에서 ${places[to]}까지의 거리는 이웃한 두 곳 사이의 거리의 ${steps}배이다. 약 ${b} m의 ${steps}배는 약 ${b * steps} m이다.`, facts: { calc: [[`${b}*${steps}`, 0]], unseen: [steps] }
      });
    })
  ]);

  // ── 초와 분 ──────────────────────────────────────────────────
  B.addTypes('3-1-5', 'sec', [
    T('sec-whole', '몇 분과 몇십 초', '①27 ②41 ③38·39', (d) => {
      const [m, j] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y);
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: m * 60 }, { label: LABELS[1], answer: j }], {
        figure: lines([`${m}분 = ${box(LABELS[0])}초`, `${j * 60}초 = ${box(LABELS[1])}분`]),
        explain: `1분은 60초이다. ${m}분은 ${m * 60}초이고, ${j * 60}초는 ${j}분이다.`, facts: { calc: [[`${m}*60`, 0], [`${j * 60}/60`, 1]], unseen: [60] }
      });
    }),
    T('sec-ticks', '초바늘이 지난 작은 눈금과 초', '②36 ③35', (d) => {
      const n = d.until(() => d.int(7, 48), (x) => x % 5 !== 0 && x !== 12);
      return N(`초바늘이 작은 눈금 ${n}칸을 가는 데 걸리는 시간은 몇 초인가?`, n, {
        unit: '초', explain: `초바늘이 작은 눈금 한 칸을 가는 데 걸리는 시간은 1초이다. ${n}칸을 가는 데는 ${n}초가 걸린다.`, facts: { calc: [[String(n), 0]] }
      });
    }),
    T('sec-span', '초바늘이 숫자에서 숫자까지 가는 시간', '②36', (d) => {
      const [p, q] = d.until(() => [d.int(1, 8), d.int(3, 11)], ([x, y]) => y - x >= 2);
      return N(`초바늘이 숫자 ${p}에서 숫자 ${q}까지 가는 데 걸리는 시간은 몇 초인가?`, (q - p) * 5, {
        unit: '초', explain: `초바늘이 숫자 한 칸을 가는 데 걸리는 시간은 5초이다. 숫자 ${p}에서 ${q}까지는 ${q - p}칸이므로 ${(q - p) * 5}초가 걸린다.`, facts: { calc: [[`(${q}-${p})*5`, 0]], unseen: [5] }
      });
    }),
    T('sec-pick', '시각에 맞는 시계 찾기', '①28 ②39 심33', (d) => {
      // 보기: 바른 시계, 긴바늘과 초바늘을 바꾸어 그린 시계, 짧은바늘이 한 칸 더 간 시계
      const t = d.until(() => [d.int(1, 10), d.int(1, 11) * 5, d.int(1, 11) * 5], (v) => clear(v) && clear([v[0], v[2], v[1]]) && clear([v[0] + 1, v[1], v[2]]));
      const list = d.shuffle([t, [t[0], t[2], t[1]], [t[0] + 1, t[1], t[2]]]);
      return C(`${at(t)}를 나타내는 시계는?`, LABELS.slice(0, 3), list.indexOf(t), {
        figure: G.tiles(list.map((v, i) => [LABELS[i], G.clock(v[0], v[1], v[2]).replace('width="176"', 'width="118"')])),
        explain: `${at(t)}에는 짧은바늘이 ${josa(t[0], '과/와')} ${t[0] + 1} 사이에 있고, 긴바늘이 ${josa(t[1] / 5, '을/를')}, 초바늘이 ${josa(t[2] / 5, '을/를')} 가리킨다.`,
        facts: { truth: list.map((v) => v === t), want: true }
      });
    }),
    T('sec-digital', '전자시계의 시각 읽기', '②38 심33', (d) => {
      // 보기: 바른 읽기, 「05」를 50분으로 읽은 것, 분과 초를 바꾸어 읽은 것, 시각을 시간으로 읽은 것
      const [h, m, s] = d.until(() => [d.int(1, 12), d.int(2, 9), d.int(11, 58)], ([x, y, z]) => x !== y && z % 10 !== 0 && z !== y * 10);
      const rows = d.shuffle([[`${h}시 ${m}분 ${s}초`, true], [`${h}시 ${m * 10}분 ${s}초`, false], [`${h}시 ${s}분 ${m}초`, false], [`${h}시간 ${m}분 ${s}초`, false]]);
      return C(`전자시계에 「${h}:0${m}:${s}」${josa(s, '이라고/라고').slice(String(s).length)} 나타나 있다. 이 시각을 바르게 읽은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: `전자시계는 왼쪽부터 차례로 시, 분, 초를 나타낸다. 「0${m}」${josa(m, '은/는').slice(1)} ${m}분이다. 시계가 나타내는 것은 시각이므로 ${h}시 ${m}분 ${s}초라고 읽는다.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('sec-point', '시각에 맞게 초바늘이 가리키는 숫자', '①29 ②40 ③37 심34', (d) => {
      const [h, m, k] = d.until(() => [d.int(1, 12), d.int(2, 58), d.int(1, 11)], ([, y, z]) => y !== z * 5 && y % 5 !== 0);
      return N(`${h}시 ${m}분 ${k * 5}초일 때, 시계의 초바늘이 가리키는 숫자는?`, k, {
        explain: `초바늘이 가리키는 숫자가 1씩 커질 때마다 5초씩 늘어난다. ${k * 5}초는 5초씩 ${k}번이므로 초바늘은 ${josa(k, '을/를')} 가리킨다.`, facts: { calc: [[`${k * 5}/5`, 0]], unseen: [5] }
      });
    }),
    T('sec-word', '문장제: 초로 나타낸 시간을 분과 초로', '②41 ③40', (d) => {
      const who = d.pick(NAMES), v = d.until(() => d.int(72, 290), (x) => x % 60 !== 0), act = d.pick(['훌라후프를 돌렸다', '줄넘기를 하였다', '한 발로 서 있었다', '철봉에 매달려 있었다']);
      return M(`${name(who, '은/는')} ${v}초 동안 ${act}. 이 시간은 몇 분 몇 초인가?`, [{ answer: Math.floor(v / 60), unit: '분' }, { answer: v % 60, unit: '초' }], {
        explain: `60초는 1분이다. ${v}초는 ${Math.floor(v / 60) * 60}초보다 ${v % 60}초 더 긴 시간이므로 ${ms(v)}이다.`, facts: { unit: [{ expr: String(v), base: 60, at: [0, 1] }] }
      });
    }),
    T('sec-steps', '분과 초를 초로 바꾸는 과정', '②8 ③38', (d) => {
      // 6분 42초=360초+42초=402초
      const m = d.int(2, 9), s = d.int(11, 56);
      return M('시간을 바꾸는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: m * 60 }, { label: LABELS[1], answer: m * 60 + s }], {
        figure: lines([`${m}분 ${s}초 = ${box(LABELS[0])}초 + ${s}초`, `= ${box(LABELS[1])}초`]),
        explain: `${m}분은 ${m * 60}초이다. ${m * 60}초와 ${s}초를 더하면 ${m * 60 + s}초이다.`, facts: { calc: [[`${m}*60`, 0], [`${m}*60+${s}`, 1]], unseen: [60] }
      });
    }),
    T('sec-match', '같은 시간끼리 짝 짓기', '①32 ②42 ③41', (d) => {
      // 4분 18초 · 3분 38초 · 4분 38초 ― 258초 · 218초 · 278초
      const m = d.int(2, 6), s = d.int(11, 35);
      const rows = d.shuffle([[m, s], [m, s + 20], [m + 1, s], [m + 1, s + 20]]).slice(0, 3).map(([p, q]) => [`${p}분 ${q}초`, `${p}*60+${q}`, p * 60 + q]);
      const right = rows.map((row) => row[2]);
      const list = d.shuffle([right].concat(d.shuffle(ORDERS.slice(1)).slice(0, 3).map((o) => o.map((i) => right[i]))));
      return C('㉠, ㉡, ㉢과 같은 시간을 차례대로 쓴 것은?', list.map((o) => o.map((v) => v + '초').join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map((row) => row[0])), explain: rows.map((row, i) => `${LABELS[i]} ${row[0]} = ${row[2]}초`).join(', '),
        facts: { match: { exprs: rows.map((row) => row[1]), options: list } }
      });
    }),
    T('sec-right', '시간을 바르게 나타낸 것 찾기', '②42 심35', (d) => {
      // 틀린 줄 셋: 1분을 100초로 셈한 것(3분 20초=320초, 245초=2분 45초), 60초를 한 번 덜 덜어 낸 것(200초=2분 20초)
      const mins = d.shuffle([2, 3, 4, 5, 6, 7]), s1 = d.int(11, 48), s2 = d.int(11, 48), s4 = d.int(11, 48), forward = d.bool();
      const v3 = d.int(2, 5) * 100 + d.int(11, 48), v4 = mins[2] * 60 + s4, v1 = mins[0] * 60 + s1;
      const rows = d.shuffle([
        { text: forward ? `${mins[0]}분 ${s1}초 = ${v1}초` : `${v1}초 = ${mins[0]}분 ${s1}초`, expr: `${mins[0]}*60+${s1}`, value: v1, ok: true },
        { text: `${mins[1]}분 ${s2}초 = ${mins[1] * 100 + s2}초`, expr: `${mins[1]}*60+${s2}`, value: mins[1] * 100 + s2 },
        { text: `${v3}초 = ${Math.floor(v3 / 100)}분 ${v3 % 100}초`, expr: `${Math.floor(v3 / 100)}*60+${v3 % 100}`, value: v3 },
        { text: `${v4}초 = ${mins[2] - 1}분 ${s4}초`, expr: `${mins[2] - 1}*60+${s4}`, value: v4 }
      ]);
      return C('시간을 바르게 나타낸 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        explain: `1분은 60초이다. ${mins[0]}분 ${s1}초는 ${mins[0] * 60}초보다 ${s1}초 더 긴 ${v1}초이다.`, facts: { claimed: rows.map((row) => [row.expr, row.value]), claimedWant: true }
      });
    }),
    T('sec-mix', '길이와 시간을 잘못 나타낸 것 찾기', '①72', (d) => {
      const bad = d.int(0, 3), c = d.int(12, 58), o = d.int(2, 9), k = d.int(2, 8), hund = d.int(1, 9), ten = d.int(1, 9) * 10, m = d.int(2, 7), s = d.int(11, 48);
      const [q, t] = d.until(() => [d.int(2, 5), d.int(11, 48)], ([x, y]) => (x * 100 + y) % 60 !== 0), far = k * 1000 + hund * 100 + ten;
      const rows = d.shuffle([
        { text: `${c} cm ${o} mm = ${bad === 0 ? c * 100 + o : c * 10 + o} mm`, expr: `${c}*10+${o}`, value: bad === 0 ? c * 100 + o : c * 10 + o, fix: `${c} cm ${o} mm는 ${c * 10 + o} mm이다.` },
        bad === 1 ? { text: `${far} m = ${k * 10 + hund} km ${ten} m`, expr: `${k * 10 + hund}*1000+${ten}`, value: far, fix: `${far} m는 ${km(far)}이다.` } : { text: `${far} m = ${km(far)}`, expr: kmE(far), value: far },
        { text: `${m}분 ${s}초 = ${bad === 2 ? m * 100 + s : m * 60 + s}초`, expr: `${m}*60+${s}`, value: bad === 2 ? m * 100 + s : m * 60 + s, fix: `${m}분 ${s}초는 ${m * 60 + s}초이다.` },
        bad === 3 ? { text: `${q * 100 + t}초 = ${q}분 ${t}초`, expr: `${q}*60+${t}`, value: q * 100 + t, fix: `${q * 100 + t}초는 ${ms(q * 100 + t)}이다.` } : { text: `${q * 60 + t}초 = ${q}분 ${t}초`, expr: `${q}*60+${t}`, value: q * 60 + t }
      ].map((row, i) => Object.assign(row, { bad: i === bad })));
      return C('길이와 시간을 잘못 나타낸 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.bad), {
        explain: `1 cm는 10 mm, 1 km는 1000 m, 1분은 60초이다. ${rows.find((row) => row.bad).fix}`, facts: { claimed: rows.map((row) => [row.expr, row.value]), claimedWant: false }
      });
    }),
    T('sec-longer', '문장제: 두 시간 가운데 더 긴 시간', '②43 ③42 심36', (d) => {
      // 3분 20초와 215초 — 1분을 100초로 여기면 3분 20초(320초)가 더 길다고 고른다.
      const [one, two] = d.shuffle(NAMES).slice(0, 2), m = d.int(2, 5), s = d.int(8, 48), a = m * 60 + s;
      const b = d.until(() => a + (d.bool() ? d.int(6, 32) : -d.int(6, 32)), (v) => v % 60 !== 0), flip = d.bool();
      const values = flip ? [b, a] : [a, b], shown = flip ? [`${b}초`, `${m}분 ${s}초`] : [`${m}분 ${s}초`, `${b}초`];
      return C(`훌라후프를 ${name(one, '은/는')} ${shown[0]}, ${name(two, '은/는')} ${shown[1]} 동안 돌렸다. 훌라후프를 더 오래 돌린 사람은?`, [one, two], values[0] > values[1] ? 0 : 1, {
        explain: `${m}분 ${s}초는 ${a}초이다. ${a}초와 ${b}초 가운데 더 긴 시간은 ${Math.max(a, b)}초이다.`,
        facts: { choose: { exprs: flip ? [String(b), `${m}*60+${s}`] : [`${m}*60+${s}`, String(b)], rule: 'max' }, unseen: [60] }
      });
    }),
    T('sec-order', '세 시간을 짧은 것부터 차례로', '①33 ②44 ③42 심38', (d) => {
      const base = d.int(2, 6) * 60 + d.int(-8, 8);
      const times = d.until(() => [base + d.int(-32, 32), base + d.int(-32, 32), base + d.int(-32, 32)], (v) => new Set(v).size === 3 && v.every((t) => t % 60 !== 0) && new Set(v.map((t) => Math.floor(t / 60))).size >= 2);
      const form = d.pick([[0, 1, 0], [1, 0, 1], [0, 0, 1], [1, 1, 0], [0, 1, 1], [1, 0, 0]]);   // 0: 초로만, 1: 분과 초로
      const right = [0, 1, 2].sort((p, q) => times[p] - times[q]), list = fourOrders(d, right);
      return C('시간이 짧은 것부터 차례대로 기호를 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(times.map((t, i) => (form[i] ? ms(t) : `${t}초`))), explain: '초로 나타내면 ' + times.map((t, i) => `${LABELS[i]} ${t}초`).join(', ') + '이다.',
        facts: { choose: { exprs: times.map((t, i) => (form[i] ? `${Math.floor(t / 60)}*60+${t % 60}` : String(t))), rule: 'ascending', orders: list }, unseen: [60] }
      });
    }),
    T('sec-odd', '알맞은 시간 단위가 다른 하나', '②45 심40', (d) => {
      const [many, lone] = d.pick([['초', '분'], ['분', '초'], ['분', '시간'], ['초', '시간'], ['시간', '분']]);
      const rows = d.shuffle(d.shuffle(BY_TIME[many]).slice(0, 3).map((row) => row.concat([many])).concat([d.pick(BY_TIME[lone]).concat([lone])]));
      return C('□ 안에 알맞은 시간의 단위가 나머지 셋과 다른 것은?', rows.map(([thing, n]) => `${thing}: 약 ${n}□`), rows.findIndex((row) => row[2] === lone), {
        explain: rows.map(([thing, n, unit]) => `${thing} 약 ${n}${unit}`).join(', ') + '이다.', facts: { kindPick: { kinds: rows.map((row) => row[2]), target: lone } }
      });
    }),
    T('sec-need', '초 단위까지 재어야 하는 것', '①37 심43', (d) => {
      const need = d.pick(NEED_SECOND), list = d.shuffle(d.shuffle(NO_SECOND).slice(0, 3).concat([need]));
      return C('초 단위까지 재는 것이 가장 알맞은 것은?', list, list.indexOf(need), {
        explain: `${need}처럼 1분보다 짧은 시간까지 정확히 나타내야 할 때 초 단위를 쓴다. 나머지는 시간이나 분으로 나타내면 된다.`, facts: { truth: list.map((v) => v === need), want: true }
      });
    })
  ]);

  // ── 시간의 덧셈 ──────────────────────────────────────────────
  B.addTypes('3-1-5', 'tadd', [
    T('tadd-ms-easy', '분과 초의 덧셈(받아올림 없음)', '①39 ③48', (d) => {
      const [a, b] = d.until(() => [[0, d.int(11, 38), d.int(11, 38)], [0, d.int(11, 20), d.int(11, 20)]], ([x, y]) => x[1] !== y[1] && x[2] !== y[2] && x[1] !== x[2]), sum = hms(secs(a) + secs(b));
      return M('두 시간의 합은 몇 분 몇 초인가?', ask(['분', '초'], sum), {
        figure: timeColumn(spanCells(a), '+', spanCells(b)), explain: `분은 분끼리, 초는 초끼리 더하면 ${span(sum)}이다.`,
        facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'ms', at: 0 }], timePlain: { op: '+', a, b } }
      });
    }),
    T('tadd-steps', '받아올림하는 과정', '①40 ②50', (d) => {
      // 13분 21초+22분 49초=35분 70초=36분 10초
      const [a, b] = sumPair(d, false, false), over = a[2] + b[2];
      return M('계산하는 과정이다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: over }, { label: LABELS[1], answer: a[1] + b[1] + 1 }, { label: LABELS[2], answer: over - 60 }], {
        figure: lines([`${span(a)} + ${span(b)}`, `= ${a[1] + b[1]}분 ${box(LABELS[0])}초`, `= ${box(LABELS[1])}분 ${box(LABELS[2])}초`]),
        explain: `초끼리 더하면 ${over}초이다. ${over}초는 1분 ${over - 60}초이므로 ${a[1] + b[1]}분 ${over}초는 ${a[1] + b[1] + 1}분 ${over - 60}초이다.`,
        facts: { calc: [[`${a[2]}+${b[2]}`, 0], [`${a[1]}+${b[1]}+1`, 1], [`${a[2]}+${b[2]}-60`, 2]], unseen: [1, 60] }
      });
    }),
    T('tadd-misfix', '단위를 어긋나게 맞춘 덧셈 바로잡기', '①41·51 ②57 ③50·51 심50', (d) => {
      // 1시 15분+8분 42초=9시 57분 → 1시 23분 42초
      const [h, m1, m2, s] = d.until(() => [d.int(1, 8), d.int(11, 38), d.int(3, 9), d.int(12, 44)], ([x, y, z, w]) => x + z <= 12 && y + w <= 58 && y !== w && x !== z);
      return M('다음은 잘못 계산한 것이다. 바르게 계산한 값은 몇 시 몇 분 몇 초인가?', ask(['시', '분', '초'], [h, m1 + m2, s]), {
        figure: timeColumn([h + '시', m1 + '분'], '+', [m2 + '분', s + '초'], [h + m2 + '시', m1 + s + '분']),
        explain: `분은 분끼리 더해야 하는데 자리를 잘못 맞추어 시와 분, 분과 초를 더하였다. ${m1}분 + ${m2}분 = ${m1 + m2}분이므로 ${at([h, m1 + m2, s])}이다.`,
        facts: { clock: [{ expr: `${S([h, m1, 0])}+${S([0, m2, s])}`, parts: 'hms', at: 0 }], wrongClock: [h + m2, m1 + s, 0] }
      });
    }),
    T('tadd-hms-one', '시각과 시간의 덧셈(받아올림 한 번)', '①42', (d) => {
      const [a, b] = sumPair(d, true, false), sum = hms(secs(a) + secs(b));
      return M('다음을 계산하시오.', ask(['시', '분', '초'], sum), {
        figure: timeColumn(atCells(a), '+', spanCells(b)), explain: `초끼리 더하면 ${a[2] + b[2]}초이다. 60초를 1분으로 받아올림하면 ${at(sum)}이다.`,
        facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'hms', at: 0 }], timeRule: { op: '+', a, b }, rule: 'carryOnce' }
      });
    }),
    T('tadd-hm', '시간과 분의 덧셈', '②50 ③49', (d) => {
      // 3시간 51분+4시간 45분=8시간 36분
      const [a, b] = d.until(() => [[d.int(1, 5), d.int(21, 56)], [d.int(1, 4), d.int(21, 56)]], ([x, y]) => x[1] + y[1] >= 62 && x[1] !== y[1] && x[0] !== y[0]);
      const total = (a[0] + b[0]) * 60 + a[1] + b[1], whole = `(${a[0]}*60+${a[1]}+${b[0]}*60+${b[1]})`;
      return M('다음을 계산하시오.', [{ answer: Math.floor(total / 60), unit: '시간' }, { answer: total % 60, unit: '분' }], {
        figure: timeColumn([a[0] + '시간', a[1] + '분'], '+', [b[0] + '시간', b[1] + '분']),
        explain: `분끼리 더하면 ${a[1] + b[1]}분이다. 60분을 1시간으로 받아올림하면 ${Math.floor(total / 60)}시간 ${total % 60}분이다.`,
        facts: { calc: [[`(${whole}-${whole}%60)/60`, 0], [`${whole}%60`, 1]], unseen: [60] }
      });
    }),
    T('tadd-secs', '초로만 나타낸 시간 더하기', '①43', (d) => {
      // 28분 35초+80초
      const [m, s, n] = d.until(() => [d.int(12, 48), d.int(8, 38), d.int(65, 115)], ([, y, z]) => y + (z % 60) <= 58 && z !== 80);
      return M('다음을 계산하면 몇 분 몇 초인가?', [{ answer: m + 1, unit: '분' }, { answer: s + n - 60, unit: '초' }], {
        figure: lines([`${m}분 ${s}초 + ${n}초`]), explain: `${n}초는 1분 ${n - 60}초이다. ${m}분 ${s}초에 1분 ${n - 60}초를 더하면 ${m + 1}분 ${s + n - 60}초이다.`,
        facts: { clock: [{ expr: `(${m}*60+${s})+${n}`, parts: 'ms', at: 0 }] }
      });
    }),
    T('tadd-versus', '계산 결과와 시간의 비교', '①50', (d) => {
      // 26분 45초+5분 20초 ○ 32분 50초. 오른쪽에는 바른 합, 받아올림을 잊은 값, 조금 더 긴 시간 가운데 하나를 둔다.
      const [a, b] = sumPair(d, false, false), sum = secs(a) + secs(b), kind = d.int(0, 2);
      const right = kind === 0 ? sum : kind === 1 ? sum - 60 : d.until(() => sum + d.int(8, 25), (v) => v % 60 !== 0);
      return C('계산 결과와 시간을 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sum > right ? 0 : sum === right ? 1 : 2, {
        figure: versus(`${span(a)} + ${span(b)}`, span(hms(right))), explain: `${span(a)} + ${span(b)} = ${span(hms(sum))}이다.`,
        facts: { choose: { exprs: [`${S(a)}+${S(b)}`, S(hms(right))], rule: 'compare' }, clockExprs: true }
      });
    }),
    T('tadd-soon', '몇 초 후의 시각(분이 바뀜)', '①56', (d) => {
      const [t, n] = d.until(() => [[d.int(1, 11), d.int(11, 56), d.int(31, 56)], d.int(8, 45)], ([x, y]) => x[2] + y >= 62), end = hms(secs(t) + n);
      return M(`${at(t)}에서 ${n}초 후의 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], end), {
        explain: `${t[2]}초와 ${n}초를 더하면 ${t[2] + n}초이다. 60초는 1분이므로 ${at(end)}이다.`, facts: { clock: [{ expr: `${S(t)}+${n}`, parts: 'hms', at: 0 }] }
      });
    }),
    T('tadd-more', '문장제: 빨라진 시간으로 앞의 기록 구하기', '①59', (d) => {
      // 오늘 23분 40초, 지난주보다 2분 50초 빨라짐 → 지난주 26분 30초(「빨라졌다」인데 더한다)
      const who = d.pick(NAMES), [a, b] = d.until(() => [[0, d.int(12, 38), d.int(21, 56)], [0, d.int(1, 6), d.int(12, 55)]], ([x, y]) => x[2] + y[2] >= 62 && x[2] !== y[2]), sum = hms(secs(a) + secs(b));
      return M(`${name(who, '이/가')} 오늘 공원을 한 바퀴 달린 기록은 ${span(a)}이다. 이것은 지난주 기록보다 ${span(b)} 빨라진 것이다. 지난주 기록은 몇 분 몇 초인가?`, ask(['분', '초'], sum), {
        explain: `기록이 빨라졌으므로 지난주에는 오늘보다 ${span(b)} 더 걸렸다. ${span(a)} + ${span(b)} = ${span(sum)}`, facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'ms', at: 0 }] }
      });
    }),
    T('tadd-wrong', '잘못 계산한 덧셈 찾기', '②57', (d) => {
      // 셋 가운데 하나는 초끼리 더한 값에서 60초를 덜어 내고도 분에 1분을 더하지 않았다.
      const rows = d.until(() => [sumPair(d, false, false), sumPair(d, false, false), sumPair(d, false, false)], (list) => new Set(list.map(([a]) => a[1])).size === 3);
      const bad = d.int(0, 2), values = rows.map(([a, b], i) => secs(a) + secs(b) - (i === bad ? 60 : 0)), [a, b] = rows[bad];
      return C('계산이 잘못된 것은?', LABELS.slice(0, 3), bad, {
        figure: tagged(rows.map(([x, y], i) => twoLines(`${span(x)} + ${span(y)}`, `= ${span(hms(values[i]))}`))),
        explain: `${LABELS[bad]}은 초끼리 더한 ${a[2] + b[2]}초에서 60초를 1분으로 받아올림하지 않았다. 바르게 계산하면 ${span(hms(values[bad] + 60))}이다.`,
        facts: { claimed: rows.map(([x, y], i) => [`${S(x)}+${S(y)}`, values[i]]), claimedWant: false }
      });
    })
  ]);

  // ── 시간의 뺄셈 ──────────────────────────────────────────────
  B.addTypes('3-1-5', 'tsub', [
    T('tsub-ms-easy', '분과 초의 뺄셈(받아내림 없음)', '①44 ③54', (d) => {
      const [a, b] = d.until(() => [[0, d.int(31, 56), d.int(31, 56)], [0, d.int(11, 28), d.int(11, 28)]], ([x, y]) => x[1] - y[1] !== x[2] - y[2] && x[1] !== x[2] && y[1] !== y[2]), diff = hms(secs(a) - secs(b));
      return M('두 시간의 차는 몇 분 몇 초인가?', ask(['분', '초'], diff), {
        figure: timeColumn(spanCells(a), '-', spanCells(b)), explain: `분은 분끼리, 초는 초끼리 빼면 ${span(diff)}이다.`, facts: { clock: [{ expr: `${S(a)}-${S(b)}`, parts: 'ms', at: 0 }] }
      });
    }),
    T('tsub-at', '시각에서 시각을 빼는 뺄셈', '①63 ③56', (d) => {
      const [a, b] = diffPair(d, true, false), gap = hms(secs(a) - secs(b));
      return M('다음을 계산하시오.', ask(['시간', '분', '초'], gap), {
        figure: timeColumn(atCells(a), '-', atCells(b)), explain: `시각에서 시각을 빼면 시간이 된다. 1분을 60초로 받아내림하여 계산하면 ${span(gap)}이다.`,
        facts: { clock: [{ expr: `${S(a)}-${S(b)}`, parts: 'hms', at: 0 }], timeRule: { op: '-', a, b } }
      });
    }),
    T('tsub-misfix', '단위를 어긋나게 맞춘 뺄셈 바로잡기', '①45·51 ②65 ③58', (d) => {
      // 7시 45분−5분 20초=2분 25초 → 7시 39분 40초
      const [h, m1, m2, s] = d.until(() => [d.int(5, 11), d.int(21, 56), d.int(2, 9), d.int(11, 40)], ([x, y, z, w]) => z < x - 1 && y > w + 2 && y - z >= 4);
      const right = [h, m1 - m2 - 1, 60 - s];
      return M('다음은 잘못 계산한 것이다. 바르게 계산한 값은 몇 시 몇 분 몇 초인가?', ask(['시', '분', '초'], right), {
        figure: timeColumn([h + '시', m1 + '분'], '-', [m2 + '분', s + '초'], [h - m2 + '분', m1 - s + '초']),
        explain: `자리를 잘못 맞추어 시에서 분을, 분에서 초를 빼었다. ${m1}분을 ${m1 - 1}분 60초로 바꾸어 분은 분끼리, 초는 초끼리 빼면 ${at(right)}이다.`,
        facts: { clock: [{ expr: `${S([h, m1, 0])}-${S([0, m2, s])}`, parts: 'hms', at: 0 }], wrongClock: [0, h - m2, m1 - s] }
      });
    }),
    T('tsub-leave', '문장제: 늦지 않으려면 출발해야 하는 시각', '①65 ②66·67 ③55', (d) => {
      // 약속 11시 10분, 가는 데 34분 → 10시 36분(초가 없고 분에서 받아내림)
      const place = d.pick(PLACES), [h, m, n] = d.until(() => [d.int(2, 11), d.int(5, 35), d.int(14, 48)], ([, y, z]) => z - y >= 4), t = h * 60 + m - n, whole = `(${h}*60+${m}-${n})`;
      return M(`${place}에서 ${h}시 ${m}분에 친구를 만나기로 하였다. 집에서 ${place}까지 가는 데 ${n}분이 걸린다면 늦어도 몇 시 몇 분에 집에서 출발해야 하는가?`, [{ answer: Math.floor(t / 60), unit: '시' }, { answer: t % 60, unit: '분' }], {
        explain: `${h}시 ${m}분에서 ${n}분 전의 시각을 구한다. ${m}분에서 ${n}분을 뺄 수 없으므로 1시간을 60분으로 받아내림하면 ${hm(t)}이다.`,
        facts: { calc: [[`(${whole}-${whole}%60)/60`, 0], [`${whole}%60`, 1]], unseen: [60] }
      });
    }),
    T('tsub-until', '문장제: 정각까지 남은 시간', '①62 ②65', (d) => {
      const t = [d.int(1, 10), d.int(12, 52), d.int(8, 52)], rest = hms((t[0] + 1) * 3600 - secs(t));
      return M(`지금 시각은 ${at(t)}이다. ${t[0] + 1}시에 시작하는 인형극이 시작할 때까지 남은 시간은 몇 분 몇 초인가?`, ask(['분', '초'], rest), {
        explain: `${t[0] + 1}시를 ${t[0]}시 59분 60초로 생각하여 ${at(t)}를 빼면 ${span(rest)}이다.`, facts: { clock: [{ expr: `${t[0] + 1}*3600-${S(t)}`, parts: 'ms', at: 0 }] }
      });
    }),
    T('tsub-clock', '시계의 시각에서 얼마 전의 시각', '①55 ②66 ③60', (d) => {
      const t = d.until(() => [d.int(2, 11), d.int(5, 11) * 5, d.int(1, 6) * 5], clear);
      const b = d.until(() => [0, d.int(6, 21), d.int(12, 55)], (v) => v[2] > t[2] + 1), gap = hms(secs(t) - secs(b));
      return M(`시계가 나타내는 시각에서 ${span(b)} 전의 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], gap), {
        figure: G.clock(t[0], t[1], t[2]), explain: `시계가 나타내는 시각은 ${at(t)}이다. 1분을 60초로 받아내림하여 ${span(b)}를 빼면 ${at(gap)}이다.`,
        facts: { clock: [{ expr: `${S(t)}-${S(b)}`, parts: 'hms', at: 0 }] }
      });
    }),
    T('tsub-gap', '문장제: 두 시간의 차', '①61 ②69 ③66', (d) => {
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [a, b] = d.until(() => { const m = d.int(31, 56); return [[0, m, d.int(8, 40)], [0, m - d.int(3, 14), d.int(21, 56)]]; }, ([x, y]) => x[2] < y[2] - 1), gap = hms(secs(a) - secs(b));
      return M(`책을 ${name(one, '은/는')} ${span(a)} 동안 읽었고, ${name(two, '은/는')} ${span(b)} 동안 읽었다. ${name(one, '은/는')} ${nick(two)}보다 몇 분 몇 초 더 오래 읽었는가?`, ask(['분', '초'], gap), {
        explain: `${span(a)}에서 ${span(b)}를 뺀다. 1분을 60초로 받아내림하여 계산하면 ${span(gap)}이다.`, facts: { clock: [{ expr: `${S(a)}-${S(b)}`, parts: 'ms', at: 0 }] }
      });
    }),
    T('tsub-both', '두 시간의 합과 차', '①49', (d) => {
      // 합은 초에서 받아올림, 차는 초에서 받아내림이 일어난다.
      const [a, b] = d.until(() => [[0, d.int(21, 38), d.int(12, 40)], [0, d.int(3, 18), d.int(31, 56)]], ([x, y]) => x[2] + y[2] >= 62 && x[2] < y[2] - 1 && x[1] - 1 > y[1]);
      const sum = hms(secs(a) + secs(b)), gap = hms(secs(a) - secs(b));
      return M(`${span(a)}와 ${span(b)}의 합과 차는 각각 몇 분 몇 초인가?`, [{ label: '합', answer: sum[1], unit: '분' }, { answer: sum[2], unit: '초' }, { label: '차', answer: gap[1], unit: '분' }, { answer: gap[2], unit: '초' }], {
        explain: `합은 60초를 1분으로 받아올림하여 ${span(sum)}이고, 차는 1분을 60초로 받아내림하여 ${span(gap)}이다.`,
        facts: { clock: [{ expr: `${S(a)}+${S(b)}`, parts: 'ms', at: 0 }, { expr: `${S(a)}-${S(b)}`, parts: 'ms', at: 2 }] }
      });
    }),
    T('tsub-which', '걸린 시간을 구해 표에서 찾기', '①66 심54', (d) => {
      // 보기: 바른 시간, 받아내림하고도 분에서 1분을 빼지 않은 시간, 초를 큰 수에서 작은 수로 뺀 시간
      const who = d.pick(NAMES);
      const [start, took] = d.until(() => [[d.int(1, 10), d.int(11, 34), d.int(21, 56)], [0, d.int(3, 5), d.int(11, 50)]], ([x, y]) => x[2] + y[2] >= 65 && y[2] !== 30);
      const end = hms(secs(start) + secs(took)), t = secs(took);
      const list = d.shuffle([t, t + 60, (end[1] - start[1]) * 60 + (start[2] - end[2])]), tags = ['가', '나', '다'];
      return C(`${name(who, '은/는')} ${at(start)}에 노래 한 곡을 틀어 ${at(end)}에 끝까지 다 들었다. ${name(who, '이/가')} 들은 노래는?`, tags, list.indexOf(t), {
        figure: table(['노래', '길이'], list.map((v, i) => [tags[i], ms(v)])), explain: `${at(end)} − ${at(start)} = ${span(took)}이다. 길이가 ${span(took)}인 노래를 찾는다.`,
        facts: { pick: { expr: `${S(end)}-${S(start)}`, options: list }, clockExprs: true }
      });
    }),
    T('tsub-right', '바르게 계산한 뺄셈 찾기', '②73', (d) => {
      // 틀린 두 줄: 받아내림하고도 분에서 1분을 빼지 않은 것, 초를 큰 수에서 작은 수로 뺀 것
      const rows = d.until(() => [diffPair(d, false, false), diffPair(d, false, false), diffPair(d, false, false)], (list) => new Set(list.map(([a]) => a[1])).size === 3);
      const kinds = d.shuffle(['right', 'keep', 'flip']);
      const values = rows.map(([a, b], i) => (kinds[i] === 'right' ? secs(a) - secs(b) : kinds[i] === 'keep' ? secs(a) - secs(b) + 60 : (a[1] - b[1]) * 60 + (b[2] - a[2])));
      const good = kinds.indexOf('right'), [a, b] = rows[good];
      return C('바르게 계산한 것은?', LABELS.slice(0, 3), good, {
        figure: tagged(rows.map(([x, y], i) => twoLines(`${span(x)} − ${span(y)}`, `= ${span(hms(values[i]))}`))),
        explain: `${a[2]}초에서 ${b[2]}초를 뺄 수 없으므로 1분을 60초로 받아내림한다. ${span(a)} − ${span(b)} = ${span(hms(values[good]))}`,
        facts: { claimed: rows.map(([x, y], i) => [`${S(x)}-${S(y)}`, values[i]]), claimedWant: true }
      });
    }),
    T('tsub-soon', '몇 초 전의 시각(분이 바뀜)', '①56', (d) => {
      const [t, n] = d.until(() => [[d.int(1, 11), d.int(11, 56), d.int(5, 28)], d.int(15, 55)], ([x, y]) => y - x[2] >= 4), end = hms(secs(t) - n);
      return M(`${at(t)}보다 ${n}초 전의 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], end), {
        explain: `${t[2]}초에서 ${n}초를 뺄 수 없으므로 1분을 60초로 받아내림한다. ${t[2] + 60}초에서 ${n}초를 빼면 ${t[2] + 60 - n}초이므로 ${at(end)}이다.`, facts: { clock: [{ expr: `${S(t)}-${n}`, parts: 'hms', at: 0 }] }
      });
    })
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  B.addTypes('3-1-5', 'hard', [
    HB('h-four', '네 가지 단위로 나타낸 길이의 비교', '①23 ②23', (d) => {
      // ㉠ 1 km ㉡ 1020 m ㉢ 110 cm ㉣ 1210 mm.
      // 보기: 바른 차례 / 단위를 보지 않고 수만 견주는 아이(1210 > 1020 > 110 > 1) / cm와 mm를 바꾸지 않고 견주는 아이(뒤의 둘을 바꿈) / km와 m를 바꾸지 않고 견주는 아이(앞의 둘을 바꿈)
      const k = d.int(1, 3), far = k * 1000 + (d.bool() ? 1 : -1) * d.int(1, 9) * 10, c = k * 100 + d.int(1, 9) * 10;
      const thin = d.until(() => c * 10 + (d.bool() ? 1 : -1) * d.int(2, 12) * 10, (v) => v !== far);
      const rows = d.shuffle([{ text: `${k} km`, expr: `${k}*1000000`, value: k * 1000000, raw: k }, { text: `${far} m`, expr: `${far}*1000`, value: far * 1000, raw: far },
        { text: `${c} cm`, expr: `${c}*10`, value: c * 10, raw: c }, { text: `${thin} mm`, expr: String(thin), value: thin, raw: thin }]);
      const by = (key) => [0, 1, 2, 3].sort((p, q) => rows[q][key] - rows[p][key]), right = by('value'), swap = (o, i, j) => { const out = o.slice(); out[i] = o[j]; out[j] = o[i]; return out; };
      const picked = [];
      for (const o of [right, by('raw'), swap(right, 2, 3), swap(right, 0, 1), swap(swap(right, 0, 1), 2, 3)]) if (picked.length < 4 && !picked.some((p) => p.join() === o.join())) picked.push(o);
      const list = d.shuffle(picked);
      return C('길이가 긴 것부터 차례대로 기호를 쓴 것은?', list.map((o) => o.map((i) => LABELS[i]).join(', ')), list.findIndex((o) => o.join() === right.join()), {
        figure: tagged(rows.map((row) => row.text)),
        explain: `${k} km는 ${k * 1000} m이고, ${c} cm는 ${c * 10} mm이다. m로 나타낸 길이는 cm나 mm로 나타낸 길이보다 훨씬 길다. 긴 것부터 쓰면 ${right.map((i) => rows[i].text).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map((row) => row.expr), rule: 'descending', orders: list }, unseen: [1000000, 1000, 10] }
      });
    }, { standard: UNIT }),
    H('h-roads', '길 그림에서 두 길의 거리 비교', '①24 ②24 심28', (d) => {
      // 한 길에는 「1 km 몇백 m」가 적혀 있어 m로 바꾸어 더해야 한다.
      // 보기: 바른 답 / 더 긴 길을 고르는 아이 / 1 km를 100 m로 여기거나 계산을 틀려 차가 100 m 어긋나는 아이(길 둘)
      const [p1, p2] = d.shuffle(['학교', '공원', '병원', '은행', '시장']).slice(0, 2), tags = ['가 길', '나 길'];
      const [a1, a2, x, b2] = d.until(() => [d.int(5, 9) * 100, d.int(5, 9) * 100, d.int(1, 4) * 100, d.int(2, 6) * 100], ([p, q, r, s]) => p !== q && r !== s && p + q !== 1000 + r + s && Math.abs(p + q - 1000 - r - s) <= 400);
      const flip = d.bool(), legs = flip ? [[`1 km ${x} m`, `${b2} m`], [`${a1} m`, `${a2} m`]] : [[`${a1} m`, `${a2} m`], [`1 km ${x} m`, `${b2} m`]];
      const values = flip ? [1000 + x + b2, a1 + a2] : [a1 + a2, 1000 + x + b2], winner = values[0] < values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]);
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 100], [1 - winner, gap + 100]]);
      const road = (place, [first, second]) => said(route([['집', 0, 50], [place, 50, 50], ['도서관', 100, 50]], [[0, 1, first], [1, 2, second]], 40), `집에서 ${place}까지 ${first}, ${place}에서 도서관까지 ${second}`);
      return C('집에서 도서관까지 가는 두 길이다. 어느 길이 몇 m 더 짧은가?', list.map(([i, n]) => `${tags[i]}, ${n} m`), list.findIndex(([i, n]) => i === winner && n === gap), {
        figure: G.tiles([[tags[0], road(p1, legs[0])], [tags[1], road(p2, legs[1])]]),
        explain: `가 길은 ${values[0]} m, 나 길은 ${values[1]} m이다. ${tags[winner]}이 ${gap} m 더 짧다.`,
        facts: { who: { values, options: list, exprs: flip ? [`1*1000+${x}+${b2}`, `${a1}+${a2}`] : [`${a1}+${a2}`, `1*1000+${x}+${b2}`], smaller: true }, unseen: [1000] }
      });
    }, { standard: UNIT }),
    HB('h-sumdiff', '표기가 다른 두 길이의 합과 차', '②27', (d) => {
      // 157 mm 와 6 cm 2 mm → 21 cm 9 mm, 9 cm 5 mm
      const [v, w] = d.until(() => [d.int(112, 198), d.int(32, 88)], ([x, y]) => x % 10 !== 0 && y % 10 !== 0 && (x + y) % 10 !== 0 && (x - y) % 10 !== 0 && (x % 10) + (y % 10) >= 11);
      return M(`두 길이 ${v} mm와 ${cm(w)}의 합과 차는 각각 몇 cm 몇 mm인가?`, [{ label: '합', answer: Math.floor((v + w) / 10), unit: 'cm' }, { answer: (v + w) % 10, unit: 'mm' }, { label: '차', answer: Math.floor((v - w) / 10), unit: 'cm' }, { answer: (v - w) % 10, unit: 'mm' }], {
        explain: `${cm(w)}는 ${w} mm이다. 합은 ${v} + ${w} = ${v + w}(mm)이므로 ${cm(v + w)}이고, 차는 ${v} − ${w} = ${v - w}(mm)이므로 ${cm(v - w)}이다.`,
        facts: { unit: [{ expr: `${v}+${cmE(w)}`, base: 10, at: [0, 1] }, { expr: `${v}-${cmE(w)}`, base: 10, at: [2, 3] }], unseen: [10] }
      });
    }, { standard: UNIT }),
    HB('h-tapes', '겹쳐 이어 붙인 띠의 전체 길이', '②29', (d) => {
      const [a, b, o] = d.until(() => [d.int(82, 168), d.int(82, 168), d.int(12, 38)], ([x, y, z]) => [x, y, z, x + y - z].every((v) => v % 10 !== 0) && x !== y);
      return M(`길이가 ${cm(a)}인 띠와 ${cm(b)}인 띠를 ${cm(o)}만큼 겹쳐서 한 줄로 이어 붙였다. 이어 붙인 띠의 전체 길이는 몇 cm 몇 mm인가?`, [{ answer: Math.floor((a + b - o) / 10), unit: 'cm' }, { answer: (a + b - o) % 10, unit: 'mm' }], {
        figure: tapes(cm(a), cm(b), cm(o)), explain: `mm로 나타내면 ${a} mm, ${b} mm, ${o} mm이다. ${a} + ${b} − ${o} = ${a + b - o}(mm)이므로 ${cm(a + b - o)}이다.`,
        facts: { unit: [{ expr: `${cmE(a)}+${cmE(b)}-${cmE(o)}`, base: 10, at: [0, 1] }], unseen: [10] }
      });
    }, { standard: UNIT }),
    HB('h-pieces', '똑같이 자른 한 도막의 비교', '②30', (d) => {
      // 4 cm 2 mm 를 6도막(7 mm), 7 cm 2 mm 를 9도막(8 mm). 긴 끈을 자른 도막이 더 짧게 수를 잡는다.
      // 보기: 바른 답 / 처음 끈이 긴 쪽의 도막이 길다고 여기는 아이 / 나눗셈을 틀려 차가 1 mm 어긋나는 아이(사람 둘)
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [p, u, q, w] = d.until(() => [d.int(2, 9), d.int(3, 9), d.int(2, 9), d.int(3, 9)], ([x, y, z, v]) => y !== v && x !== z && [x * y, z * v].every((len) => len >= 12 && len % 10 !== 0) && (x * y > z * v) !== (y > v));
      const values = [u, w], winner = u > w ? 0 : 1, gap = Math.abs(u - w);
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 1], [1 - winner, gap + 1]]);
      return C(`${name(one, '은/는')} 길이가 ${cm(p * u)}인 끈을 똑같이 ${p}도막으로 자르고, ${name(two, '은/는')} 길이가 ${cm(q * w)}인 끈을 똑같이 ${q}도막으로 잘랐다. 누가 자른 한 도막이 몇 mm 더 긴가?`,
        list.map(([i, n]) => `${[one, two][i]}, ${n} mm`), list.findIndex(([i, n]) => i === winner && n === gap), {
          explain: `${nick(one)}의 한 도막은 ${p * u} ÷ ${p} = ${u}(mm), ${nick(two)}의 한 도막은 ${q * w} ÷ ${q} = ${w}(mm)이다. ${name([one, two][winner], '이/가')} 자른 한 도막이 ${gap} mm 더 길다.`,
          facts: { who: { values, options: list, exprs: [`${cmE(p * u)}/${p}`, `${cmE(q * w)}/${q}`] }, unseen: [10] }
        });
    }, { standard: UNIT }),
    HB('h-grow', '날마다 같은 길이씩 자란 뒤의 길이', '②32', (d) => {
      // 14 cm 5 mm + 6 mm × 6
      const [now, r, t] = d.until(() => [d.int(72, 168), d.int(3, 8), d.int(4, 9)], ([x, y, z]) => x % 10 !== 0 && (x + y * z) % 10 !== 0 && (x % 10) + ((y * z) % 10) >= 10 && y !== z);
      return M(`봉숭아 싹의 길이가 지금 ${cm(now)}이다. 이 싹이 하루에 ${r} mm씩 자란다면 ${t}일 후에는 몇 cm 몇 mm가 되는가?`, [{ answer: Math.floor((now + r * t) / 10), unit: 'cm' }, { answer: (now + r * t) % 10, unit: 'mm' }], {
        explain: `${t}일 동안 ${r} × ${t} = ${r * t}(mm) 자란다. ${cm(now)}는 ${now} mm이므로 ${now} + ${r * t} = ${now + r * t}(mm)이고, 이것은 ${cm(now + r * t)}이다.`,
        facts: { unit: [{ expr: `${cmE(now)}+${r}*${t}`, base: 10, at: [0, 1] }], unseen: [10] }
      });
    }, { standard: UNIT }),
    H('h-span', '가장 긴 시간과 가장 짧은 시간의 차', '①69 ②46 심72', (d) => {
      const who = d.shuffle(NAMES).slice(0, 4);
      const times = d.until(() => [0, 1, 2, 3].map(() => d.int(31, 57) * 60 + d.int(8, 56)), (v) => {
        const hi = Math.max(...v), lo = Math.min(...v);
        return new Set(v.map((t) => Math.floor(t / 60))).size === 4 && new Set(v.map((t) => t % 60)).size === 4 && hi % 60 < (lo % 60) - 1 && hi - lo >= 300;
      });
      const hi = Math.max(...times), lo = Math.min(...times);
      return M('네 사람이 그림을 그린 시간이다. 가장 오래 그린 사람은 가장 짧게 그린 사람보다 몇 분 몇 초 더 오래 그렸는가?', ask(['분', '초'], hms(hi - lo)), {
        figure: table(['이름', '그린 시간'], who.map((w, i) => [w, ms(times[i])])),
        explain: `가장 긴 시간은 ${ms(hi)}, 가장 짧은 시간은 ${ms(lo)}이다. 1분을 60초로 받아내림하여 빼면 ${ms(hi - lo)}이다.`,
        facts: { clock: [{ expr: `${msE(hi)}-${msE(lo)}`, parts: 'ms', at: 0 }] }
      });
    }),
    HB('h-near', '기준 시간에 가장 가까운 시간', '②47', (d) => {
      // 3분에 가장 가까운 시간: 145초, 3분 26초, 194초. 기준보다 짧은 시간과 긴 시간이 섞여 있어 차를 모두 구해야 한다.
      const who = d.shuffle(NAMES).slice(0, 3), goal = d.int(2, 4);
      const gaps = d.until(() => [d.int(8, 40), d.int(8, 40), d.int(8, 40)], (g) => { const s = g.slice().sort((x, y) => x - y); return s[1] - s[0] >= 3 && s[2] !== s[1]; });
      const signs = d.pick([[1, -1, 1], [-1, 1, -1], [-1, 1, 1], [1, -1, -1], [1, 1, -1], [-1, -1, 1]]), form = d.pick([[0, 1, 0], [1, 0, 1], [0, 0, 1], [1, 0, 0], [0, 1, 1]]);
      const times = gaps.map((g, i) => goal * 60 + signs[i] * g), shown = times.map((t, i) => (form[i] ? ms(t) : `${t}초`));
      return C(`눈을 감고 있다가 ${goal}분이 지났다고 생각될 때 손을 들기로 하였다. ${name(who[0], '은/는')} ${shown[0]}, ${name(who[1], '은/는')} ${shown[1]}, ${name(who[2], '은/는')} ${shown[2]} 만에 손을 들었다. ${goal}분에 가장 가깝게 손을 든 사람은?`, who, gaps.indexOf(Math.min(...gaps)), {
        explain: `${goal}분은 ${goal * 60}초이다. 초로 나타내면 ` + times.map((t, i) => `${who[i]} ${t}초`).join(', ') + `이고, ${goal * 60}초와의 차는 차례로 ${gaps.join('초, ')}초이다.`,
        facts: { choose: { exprs: times.map((t, i) => (form[i] ? `${Math.floor(t / 60)}*60+${t % 60}` : String(t))), rule: 'nearest', target: goal * 60 }, unseen: [60] }
      });
    }, { standard: SECOND }),
    H('h-after-min', '분으로만 나타낸 시간 뒤의 시각', '①57 ②54 심56', (d) => {
      // 3시 50분 20초에서 80분 후 → 5시 10분 20초
      const [start, n] = d.until(() => [[d.int(1, 8), d.int(21, 56), d.int(11, 56)], d.int(65, 175)], ([t, v]) => v % 60 !== 0 && t[1] + (v % 60) >= 62), end = hms(secs(start) + n * 60);
      return M(`${at(start)}에서 ${n}분이 지난 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], end), {
        explain: `${n}분은 ${Math.floor(n / 60)}시간 ${n % 60}분이다. ${at(start)}에서 ${Math.floor(n / 60)}시간 ${n % 60}분이 지난 시각은 ${at(end)}이다.`,
        facts: { clock: [{ expr: `${S(start)}+${n}*60`, parts: 'hms', at: 0 }] }
      });
    }),
    H('h-turns', '초바늘이 여러 바퀴 돈 뒤의 시각', '심57', (d) => {
      const [start, n] = d.until(() => [[d.int(1, 10), d.int(26, 56), d.int(11, 56)], d.int(12, 45)], ([t, v]) => t[1] + v >= 62 && v % 10 !== 0), end = hms(secs(start) + n * 60);
      return M(`${at(start)}에서 시계의 초바늘이 ${n}바퀴 돈 뒤의 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], end), {
        explain: `초바늘이 시계를 한 바퀴 도는 데 걸리는 시간은 60초, 곧 1분이다. ${n}바퀴 도는 데 ${n}분이 걸리므로 ${at(start)}에서 ${n}분이 지난 ${at(end)}이다.`,
        facts: { clock: [{ expr: `${S(start)}+${n}*60`, parts: 'hms', at: 0 }] }
      });
    }, { standard: SECOND }),
    H('h-chain', '잇달아 한 두 일을 마친 시각', '①58 ②55 심62', (d) => {
      const who = d.pick(NAMES);
      const [t, a, b] = d.until(() => [[d.int(1, 9), d.int(11, 40), d.int(11, 56)], [0, d.int(21, 38), d.int(15, 56)], [0, d.int(12, 28), d.int(15, 56)]], ([x, y, z]) => {
        const end = hms(secs(x) + secs(y) + secs(z));
        return x[2] + y[2] >= 62 && hms(secs(x) + secs(y))[1] >= 2 && end[0] === x[0] + 1 && end[1] >= 2 && end[2] >= 2 && y[2] !== z[2];
      });
      const mid = hms(secs(t) + secs(a)), end = hms(secs(t) + secs(a) + secs(b));
      return M(`${name(who, '은/는')} ${at(t)}에 숙제를 시작하여 ${span(a)} 동안 수학 숙제를 하고, 바로 이어서 ${span(b)} 동안 국어 숙제를 하였다. 숙제를 모두 마친 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], end), {
        explain: `수학 숙제를 마친 시각은 ${at(mid)}이다. 여기에서 ${span(b)}가 지난 시각은 ${at(end)}이다.`, facts: { clock: [{ expr: `${S(t)}+${S(a)}+${S(b)}`, parts: 'hms', at: 0 }] }
      });
    }),
    H('h-three', '세 시간의 합', '①53 심58', (d) => {
      const who = d.shuffle(NAMES).slice(0, 3);
      const times = d.until(() => [0, 1, 2].map(() => d.int(2, 9) * 60 + d.int(11, 56)), (v) => new Set(v.map((t) => Math.floor(t / 60))).size === 3 && v.reduce((s, t) => s + (t % 60), 0) >= 62 && v.reduce((s, t) => s + (t % 60), 0) % 60 !== 0);
      const total = times.reduce((s, t) => s + t, 0);
      return M('세 사람이 차례로 이어 달린 시간이다. 세 사람이 달린 시간은 모두 몇 분 몇 초인가?', ask(['분', '초'], hms(total)), {
        figure: table(['이름', '달린 시간'], who.map((w, i) => [w, ms(times[i])])),
        explain: `분끼리 더하면 ${times.reduce((s, t) => s + Math.floor(t / 60), 0)}분, 초끼리 더하면 ${times.reduce((s, t) => s + (t % 60), 0)}초이다. 60초를 1분으로 받아올림하면 ${ms(total)}이다.`,
        facts: { clock: [{ expr: times.map(msE).join('+'), parts: 'ms', at: 0 }] }
      });
    }),
    H('h-relay', '두 모둠의 기록을 더해 비교하기', '①53 ②62 심59', (d) => {
      // 첫째 사람이 빠른 모둠이 지게 수를 잡는다.
      // 보기: 바른 답 / 걸린 시간이 긴 모둠을 고르는 아이 / 초의 받아올림을 틀려 차가 10초 어긋나는 아이(모둠 둘)
      const tags = ['가 모둠', '나 모둠'];
      const [a1, a2, b1, b2] = d.until(() => [d.int(66, 170), d.int(66, 170), d.int(66, 170), d.int(66, 170)], (v) => {
        const gap = Math.abs(v[0] + v[1] - v[2] - v[3]);
        return v.every((t) => t % 60 >= 5) && new Set(v).size === 4 && gap >= 3 && gap <= 45 && (v[0] + v[1]) % 60 !== 0 && (v[2] + v[3]) % 60 !== 0 && (v[0] < v[2]) !== (v[0] + v[1] < v[2] + v[3]);
      });
      const values = [a1 + a2, b1 + b2], winner = values[0] < values[1] ? 0 : 1, gap = Math.abs(values[0] - values[1]);
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 10], [1 - winner, gap + 10]]);
      return C('두 모둠의 이어달리기 기록이다. 어느 모둠이 몇 초 더 빨리 들어왔는가?', list.map(([i, n]) => `${tags[i]}, ${n}초`), list.findIndex(([i, n]) => i === winner && n === gap), {
        figure: table(['모둠', '첫째 사람', '둘째 사람'], [[tags[0], ms(a1), ms(a2)], [tags[1], ms(b1), ms(b2)]]),
        explain: `가 모둠은 ${ms(values[0])}, 나 모둠은 ${ms(values[1])}가 걸렸다. 걸린 시간이 짧은 ${tags[winner]}이 ${gap}초 더 빨리 들어왔다.`,
        facts: { who: { values, options: list, exprs: [`${msE(a1)}+${msE(a2)}`, `${msE(b1)}+${msE(b2)}`], smaller: true }, clockExprs: true }
      });
    }),
    H('h-chain-diff', '「~보다 덜, ~보다 더」로 이어진 시간', '심60', (d) => {
      const [one, two, three] = d.shuffle(NAMES).slice(0, 3);
      const [a, x, y] = d.until(() => [[0, d.int(3, 8), d.int(8, 40)], d.int(15, 55), [0, d.int(1, 2), d.int(8, 50)]], ([p, q, r]) => q - p[2] >= 3 && p[2] + 60 - q + r[2] >= 62);
      const mid = hms(secs(a) - x), end = hms(secs(a) - x + secs(y));
      return M(`퍼즐을 맞추는 데 ${name(one, '은/는')} ${span(a)}가 걸렸다. ${name(two, '은/는')} ${nick(one)}보다 ${x}초 덜 걸렸고, ${name(three, '은/는')} ${nick(two)}보다 ${span(y)} 더 걸렸다. ${name(three, '이/가')} 퍼즐을 맞추는 데 걸린 시간은 몇 분 몇 초인가?`, ask(['분', '초'], end), {
        explain: `${nick(two)}가 걸린 시간은 ${span(a)} − ${x}초 = ${span(mid)}이다. ${nick(three)}가 걸린 시간은 ${span(mid)} + ${span(y)} = ${span(end)}이다.`,
        facts: { clock: [{ expr: `${S(a)}-${x}+${S(y)}`, parts: 'ms', at: 0 }] }
      });
    }),
    H('h-box-sub', '□가 있는 시간의 뺄셈식', '심48', (d) => {
      // 7시 18분 45초−□=2시 53분 28초
      const [a, r] = d.until(() => [[d.int(5, 11), d.int(11, 50), d.int(21, 56)], [d.int(1, 3), d.int(21, 56), d.int(8, 40)]], ([x, y]) => x[1] < y[1] - 1 && x[2] > y[2] + 1), gap = hms(secs(a) - secs(r));
      return M('□ 안에 알맞은 시간은 몇 시간 몇 분 몇 초인가?', ask(['시간', '분', '초'], gap), {
        figure: lines([`${at(a)} − ${box()} = ${at(r)}`]), explain: `□는 ${at(a)}에서 ${at(r)}를 뺀 시간이다. 1시간을 60분으로 받아내림하여 계산하면 ${span(gap)}이다.`,
        facts: { clock: [{ expr: `${S(a)}-${S(r)}`, parts: 'hms', at: 0 }] }
      });
    }),
    H('h-blanks-add', '빈칸이 있는 시간의 덧셈', '②60 심49', (d) => {
      // 5시 17분 □초+□시간 □분 20초=8시 20분 10초
      const [a, b] = sumPair(d, true, true), r = hms(secs(a) + secs(b));
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a[2] }, { label: LABELS[1], answer: b[0] }, { label: LABELS[2], answer: b[1] }], {
        figure: timeColumn([a[0] + '시', a[1] + '분', box(LABELS[0]) + '초'], '+', [box(LABELS[1]) + '시간', box(LABELS[2]) + '분', b[2] + '초'], [r[0] + '시', r[1] + '분', r[2] + '초']),
        explain: `초: ㉠ + ${b[2]} = ${r[2] + 60}이므로 ㉠은 ${a[2]}이다(60초를 1분으로 받아올림한다). 분: ${a[1]} + 1 + ㉢ = ${r[1] + 60}이므로 ㉢은 ${b[1]}이다(60분을 1시간으로 받아올림한다). 시: ${a[0]} + 1 + ㉡ = ${r[0]}이므로 ㉡은 ${b[0]}이다.`,
        facts: { timeMasks: { op: '+', a: [a[0], a[1], null], b: [null, null, b[2]], r } }
      });
    }),
    H('h-late', '더 걸린 시간을 더해 출발한 시각 구하기', '②74 심63', (d) => {
      const [usual, more, arrive] = d.until(() => [[d.int(1, 2), d.int(2, 5) * 10, 0], [0, d.int(12, 28), d.int(21, 50)], [d.int(9, 11), d.int(5, 50), d.int(5, 40)]], ([x, y, z]) => {
        const start = hms(secs(z) - secs(x) - secs(y));
        return z[2] < y[2] - 1 && z[1] < x[1] + y[1] && start[1] >= 2 && hms(secs(x) + secs(y))[1] >= 2;
      });
      const all = hms(secs(usual) + secs(more)), start = hms(secs(arrive) - secs(all));
      return M(`집에서 수목원까지 가는 데 보통 ${span(usual)}이 걸린다. 오늘은 길이 막혀 ${span(more)}가 더 걸려서 ${at(arrive)}에 수목원에 도착하였다. 집에서 출발한 시각은 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], start), {
        explain: `오늘 걸린 시간은 ${span(usual)} + ${span(more)} = ${span(all)}이다. ${at(arrive)}에서 ${span(all)} 전의 시각은 ${at(start)}이다.`,
        facts: { clock: [{ expr: `${S(arrive)}-${S(usual)}-${S(more)}`, parts: 'hms', at: 0 }] }
      });
    }),
    H('h-rest', '쉬는 시간을 뺀 시간', '심65', (d) => {
      const who = d.pick(NAMES);
      const [s, e, rest] = d.until(() => { const x = [d.int(1, 8), d.int(5, 50), d.int(21, 56)]; return [x, hms(secs(x) + d.int(80, 170) * 60 + d.int(5, 55)), [0, d.int(8, 25), d.int(11, 55)]]; }, ([x, y, z]) => {
        const all = secs(y) - secs(x), real = all - secs(z);
        return y[2] < x[2] - 1 && y[1] >= 2 && y[2] >= 2 && all % 60 < z[2] - 1 && real >= 3660 && hms(real)[1] >= 2;
      });
      const all = hms(secs(e) - secs(s)), real = hms(secs(e) - secs(s) - secs(rest));
      return M(`${name(who, '은/는')} ${at(s)}부터 ${at(e)}까지 피아노 연습을 하였다. 그 가운데 ${span(rest)} 동안 쉬었다면 쉰 시간을 빼고 피아노를 친 시간은 몇 시간 몇 분 몇 초인가?`, ask(['시간', '분', '초'], real), {
        explain: `피아노 연습을 한 시간은 ${at(e)} − ${at(s)} = ${span(all)}이다. 여기에서 쉰 시간 ${span(rest)}를 빼면 ${span(real)}이다.`,
        facts: { clock: [{ expr: `${S(e)}-${S(s)}-${S(rest)}`, parts: 'hms', at: 0 }] }
      });
    }),
    HB('h-chores', '전체에서 두 부분을 뺀 나머지 시간', '③68', (d) => {
      const [a, b, c] = d.until(() => [[0, d.int(18, 34), d.int(12, 56)], [0, d.int(21, 38), d.int(12, 56)], [0, d.int(11, 28), d.int(12, 50)]], ([x, y, z]) => {
        const total = hms(secs(x) + secs(y) + secs(z));
        return x[2] + y[2] >= 62 && total[0] === 1 && total[1] >= 2 && total[2] >= 2 && total[2] < (x[2] + y[2]) % 60 && x[1] !== y[1];
      });
      const total = hms(secs(a) + secs(b) + secs(c)), two = hms(secs(a) + secs(b));
      return M(`세 가지 집안일을 차례로 이어서 하는 데 모두 ${span(total)}가 걸렸다. 빨래 개기를 한 시간은 몇 분 몇 초인가?`, ask(['분', '초'], c), {
        figure: table(['집안일', '걸린 시간'], [['설거지', span(a)], ['방 청소', span(b)], ['빨래 개기', box()]]),
        explain: `설거지와 방 청소를 한 시간은 ${span(a)} + ${span(b)} = ${span(two)}이다. ${span(total)}에서 ${span(two)}를 빼면 ${span(c)}이다.`,
        facts: { clock: [{ expr: `${S(total)}-${S(a)}-${S(b)}`, parts: 'ms', at: 0 }] }
      });
    }),
    H('h-day-night', '낮과 밤의 길이의 차', '심69', (d) => {
      // 낮 12시간 47분 35초 → 밤 11시간 12분 25초, 차 1시간 35분 10초
      const day = d.until(() => [d.int(13, 14), d.int(11, 52), d.int(11, 52)], (v) => (v[1] * 2) % 60 !== 0 && v[2] !== 30), night = hms(24 * 3600 - secs(day)), gap = hms(secs(day) * 2 - 24 * 3600);
      return M(`어느 날 낮의 길이가 ${span(day)}였다. 이날 낮은 밤보다 몇 시간 몇 분 몇 초 더 긴가?`, ask(['시간', '분', '초'], gap), {
        explain: `하루는 24시간이므로 밤의 길이는 24시간 − ${span(day)} = ${span(night)}이다. ${span(day)} − ${span(night)} = ${span(gap)}`,
        facts: { clock: [{ expr: `${S(day)}-(24*3600-${S(day)})`, parts: 'hms', at: 0 }], unseen: [24] }
      });
    }),
    H('h-clock-slow', '날마다 늦어지는 시계', '심71', (d) => {
      // 하루에 10초씩 늦어지는 시계: 9일 뒤 오전 9시에는 90초 = 1분 30초 늦다 → 오전 8시 58분 30초
      const slow = d.pick([15, 20, 25, 35, 40, 45]), days = d.until(() => d.int(3, 7), (v) => (slow * v) % 60 !== 0 && slow * v > 60), loss = slow * days, hour = d.int(8, 11), shown = hms(hour * 3600 - loss);
      return M(`하루에 ${slow}초씩 늦어지는 시계를 오늘 오전 ${hour}시에 정확히 맞추었다. ${days}일 후 오전 ${hour}시에 이 시계가 가리키는 시각은 오전 몇 시 몇 분 몇 초인가?`, ask(['시', '분', '초'], shown), {
        explain: `${days}일 동안 ${slow} × ${days} = ${loss}(초) 늦어진다. ${loss}초는 ${ms(loss)}이므로 이 시계는 오전 ${hour}시보다 ${ms(loss)} 이른 오전 ${at(shown)}를 가리킨다.`,
        facts: { clock: [{ expr: `${hour}*3600-${slow}*${days}`, parts: 'hms', at: 0 }] }
      });
    }),
    HB('h-longer-by', '세 번 계산하여 구하는 시작한 시각', '①71', (d) => {
      // 줄넘기 1시 30분~2시 10분(40분), 축구는 30분 더 오래(70분은 쓰지 않고 60분 안쪽으로), 축구를 끝낸 시각 → 축구를 시작한 시각
      const who = d.pick(NAMES);
      const [s1, d1, more, e2] = d.until(() => [d.int(1, 3) * 60 + d.int(31, 55), d.int(22, 38), d.int(8, 18), d.int(5, 8) * 60 + d.int(5, 40)], ([x, y, z, w]) => (x % 60) + y >= 64 && w % 60 < y + z - 2 && y + z <= 56);
      const e1 = s1 + d1, start = e2 - d1 - more, whole = `(${hmE(e2)}-(${hmE(e1)}-${hmE(s1)}+${more}))`;
      return M(`${name(who, '은/는')} ${hm(s1)}부터 ${hm(e1)}까지 줄넘기를 하였다. 축구는 줄넘기보다 ${more}분 더 오래 하였고 ${hm(e2)}에 끝냈다. 축구를 시작한 시각은 몇 시 몇 분인가?`, [{ answer: Math.floor(start / 60), unit: '시' }, { answer: start % 60, unit: '분' }], {
        explain: `줄넘기를 한 시간은 ${hm(e1)} − ${hm(s1)} = ${d1}분이다. 축구를 한 시간은 ${d1}분 + ${more}분 = ${d1 + more}분이다. ${hm(e2)}에서 ${d1 + more}분 전의 시각은 ${hm(start)}이다.`,
        facts: { calc: [[`(${whole}-${whole}%60)/60`, 0], [`${whole}%60`, 1]], unseen: [60] }
      });
    }),
    H('h-two-days', '이틀 동안의 시간에서 오늘 끝낸 시각 구하기', '심67', (d) => {
      // 이틀 2시간 45분, 어제 1시 33분~3시 8분(1시간 35분), 오늘 2시 55분 시작 → 오늘 1시간 10분 → 4시 5분
      const who = d.pick(NAMES);
      const [s1, d1, d2, s2] = d.until(() => [d.int(1, 4) * 60 + d.int(26, 55), d.int(66, 110), d.int(36, 88), d.int(2, 6) * 60 + d.int(31, 56)], ([x, y, z, w]) => (x % 60) + (y % 60) >= 64 && (w % 60) + (z % 60) >= 64 && (y + z) % 60 >= 5 && y % 60 !== 0 && z % 60 !== 0 && (x + y) % 60 !== 0 && (w + z) % 60 !== 0);
      const e1 = s1 + d1, total = d1 + d2, end = s2 + d2, whole = `(${hmE(s2)}+(${hmE(total)}-(${hmE(e1)}-${hmE(s1)})))`;
      return M(`${name(who, '이/가')} 어제와 오늘 그림을 그린 시간은 모두 ${Math.floor(total / 60)}시간 ${total % 60}분이다. 어제는 ${hm(s1)}부터 ${hm(e1)}까지 그렸고, 오늘은 ${hm(s2)}에 그리기 시작하였다. 오늘 그림 그리기를 끝낸 시각은 몇 시 몇 분인가?`, [{ answer: Math.floor(end / 60), unit: '시' }, { answer: end % 60, unit: '분' }], {
        explain: `어제 그린 시간은 ${hm(e1)} − ${hm(s1)} = ${Math.floor(d1 / 60)}시간 ${d1 % 60}분이다. 오늘 그린 시간은 ${Math.floor(total / 60)}시간 ${total % 60}분에서 이것을 뺀 ${d2}분이다. ${hm(s2)}에서 ${d2}분이 지난 시각은 ${hm(end)}이다.`,
        facts: { calc: [[`(${whole}-${whole}%60)/60`, 0], [`${whole}%60`, 1]], unseen: [60] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
