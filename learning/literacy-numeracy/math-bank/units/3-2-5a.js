// 3학년 2학기 5단원 들이와 무게 — 단원 틀과 기본 문항.
// 수집해 둔 교과서 9종의 평가 자료(단원평가·형성평가·수학익힘·수행평가)에서 뽑은 문제 꼴 목록(기본꼴 1~3, 모두 369꼴)을
// 처음부터 끝까지 대조하여, 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (교과서마다 단원 차례가 달라 최수일·장혜원·강문봉·박만구의 자료는 4단원 폴더에서 가져왔다.)
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다(비교하기, 눈금 읽기, 단위 바꾸기, 어림하기, 받아올림·받아내림이 있는 계산과 없는 계산, 문장제의 얼개).
//    들이와 무게에서 셈의 구조가 같은 계산은 한쪽에만 여러 구조를 싣고 다른 쪽에는 받아올림·받아내림이 있는 것만 실었다.
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      4학년 「곱셈과 나눗셈」·「큰 수」: 1000을 두 자리 수로 나누는 꼴(1 t은 20 kg의 몇 배, 20 kg짜리 몇 포대가 1 t), 네 자리 수를 나누는 한 개의 무게,
//        다섯 자리 수가 되는 mL끼리의 덧셈
//      6학년 「비례식과 비례배분」에 가까운 것: 수도에서 1분에 나오는 물의 양으로 걸리는 시간 구하기
//      중학교 방정식 꼴: 합과 차를 아는 두 무게, 두 저울의 조건을 이어 한 개의 무게 구하기
//  - 정해진 들이가 되게 그릇을 골라 여러 번 옮겨 붓기, 무게가 같게 둘로 나누기처럼 경우 따지기가 어려움의 대부분인 것은 싣지 않는다.
//  - 방법 쓰기·문제 만들기(서술형), 직접 재어 보기(활동)는 싣지 않는다.
// 수와 단위는 띄어 쓴다(2 L 300 mL, 1 kg 500 g). 묻는 말: 수나 값은 "~은?/~는?", 양은 "몇 ~인가?".
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { name, NAMES, LABELS, box, lines, beaker, dial, levels, timeColumn, N, M, C } = B.kit;
  const VOL = '4수03-17', VOL_CALC = '4수03-19', WEIGHT = '4수03-20', WEIGHT_CALC = '4수03-23';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SIGNS = ['&gt;', '=', '&lt;'];
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const sign = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  const hi = (v) => Math.floor(v / 1000), lo = (v) => v % 1000;
  // 양을 큰 단위와 작은 단위로 적는다: 2300 → 2 L 300 mL
  const write = (v, small, big) => [hi(v) ? hi(v) + ' ' + big : '', lo(v) ? lo(v) + ' ' + small : ''].filter(Boolean).join(' ');
  const vol = (v) => write(v, 'mL', 'L'), wt = (v) => write(v, 'g', 'kg');
  // 식에 적는 꼴(글에 적힌 수 그대로)과, 답 두 칸(큰 단위·작은 단위)을 다시 셈하는 식
  const X = (v) => (hi(v) && lo(v) ? `(${hi(v)}*1000+${lo(v)})` : hi(v) ? `${hi(v)}*1000` : String(lo(v)));
  const two = (expr) => [[`((${expr})-(${expr})%1000)/1000`, 0], [`(${expr})%1000`, 1]];
  const ask = (v, small, big) => [{ answer: hi(v), unit: big }, { answer: lo(v), unit: small }];
  const cells = (v, small, big) => [hi(v) + ' ' + big, lo(v) + ' ' + small];
  // 두 양(작은 단위의 수는 50의 배수). carry: 더할 때 받아올림(뺄 때 받아내림)이 있는가
  const amount = (d, top) => d.int(1, top) * 1000 + d.int(3, 18) * 50;
  const addPair = (d, carry) => d.until(() => [amount(d, 5), amount(d, 4)], ([a, b]) => lo(a) !== lo(b) && (carry ? lo(a) + lo(b) > 1000 : lo(a) + lo(b) < 1000));
  const subPair = (d, borrow) => d.until(() => [amount(d, 8), amount(d, 4)], ([a, b]) => hi(a) > hi(b) + 1 && (borrow ? lo(a) < lo(b) : lo(a) > lo(b)));
  const rule = (op, a, b, carry) => ({ unitRule: { op, a: [hi(a), lo(a)], b: [hi(b), lo(b)], carry }, rule: (carry ? 'carry' : 'noCarry') + op });
  // 어림에 쓰는 것들(사실 그대로): [물건, 수, 알맞은 단위]
  const VOLS = [['요구르트병의 들이', 80, 'mL'], ['종이컵의 들이', 180, 'mL'], ['음료수 캔의 들이', 250, 'mL'], ['숟가락의 들이', 5, 'mL'], ['양동이의 들이', 5, 'L'], ['주전자의 들이', 2, 'L'], ['욕조의 들이', 200, 'L'], ['냉장고의 들이', 500, 'L']];
  const WEIGHTS = [['연필 한 자루의 무게', 5, 'g'], ['달걀 한 개의 무게', 60, 'g'], ['휴대 전화의 무게', 200, 'g'], ['수박 한 통의 무게', 6, 'kg'], ['3학년 학생의 몸무게', 35, 'kg'], ['자전거의 무게', 12, 'kg'], ['코끼리의 무게', 5, 't'], ['버스의 무게', 12, 't']];
  const said = ([thing, n, unit], use) => `${thing}는 약 ${n} ${use || unit}이다.`;
  // 단위가 나머지와 다른 하나: 셋은 한 단위, 하나는 다른 단위
  const oddUnit = (d, pool, major, minor) => { const rows = d.shuffle(d.shuffle(pool.filter(([, , u]) => u === major)).slice(0, 3).concat([d.pick(pool.filter(([, , u]) => u === minor))])); return { rows, at: rows.findIndex(([, , u]) => u === minor) }; };

  B.addUnit({
    id: '3-2-5', grade: 3, semester: 2, no: 5, title: '들이와 무게', version: 3,
    groups: [
      {
        id: 'vcmp', title: '들이 비교하기', standard: VOL,
        types: [
          T('vc-level', '옮겨 담은 물의 높이로 비교하기', '①2·3 ②2 ③1 심3', (d) => {
            const heights = d.until(() => [d.int(2, 10), d.int(2, 10), d.int(2, 10)], (h) => new Set(h).size === 3);
            return C('가, 나, 다 그릇에 물을 가득 채운 뒤 모양과 크기가 같은 그릇에 각각 옮겨 담았다. 들이가 가장 많은 그릇은?', ['가 그릇', '나 그릇', '다 그릇'], heights.indexOf(Math.max(...heights)), {
              figure: levels(['가', '나', '다'], heights), explain: '모양과 크기가 같은 그릇에 옮겨 담았으므로 물의 높이가 높을수록 들이가 많다.', facts: { levels: 'most' }
            });
          }),
          T('vc-cups', '옮겨 담은 컵의 수로 비교하기', '①4·5 ②4 ③3 심5', (d) => {
            const [a, b] = d.until(() => [d.int(4, 12), d.int(3, 9)], ([x, y]) => x > y + 1);
            return N(`주전자와 물병에 물을 가득 채운 뒤 모양과 크기가 같은 컵에 옮겨 담았더니 주전자는 ${a}컵, 물병은 ${b}컵이 되었다. 주전자의 들이는 물병의 들이보다 컵 몇 개만큼 더 많은가?`, a - b, {
              unit: '개', explain: `같은 컵으로 재었으므로 컵의 수를 비교한다. ${a} - ${b} = ${a - b}`, facts: { calc: [[`${a}-${b}`, 0]] }
            });
          }),
          T('vc-times', '옮겨 담은 컵의 수로 몇 배인지 구하기', '①6 ③4 심6', (d) => {
            const k = d.int(2, 4), n = d.int(2, 4);
            return N(`수조와 냄비에 물을 가득 채운 뒤 모양과 크기가 같은 컵에 옮겨 담았더니 수조는 ${k * n}컵, 냄비는 ${k}컵이 되었다. 수조의 들이는 냄비의 들이의 몇 배인가?`, n, {
              unit: '배', explain: `${k * n} ÷ ${k} = ${n}`, facts: { calc: [[`${k * n}/${k}`, 0]] }
            });
          }),
          T('vc-pours', '가득 채우는 데 부은 횟수로 컵의 들이 비교하기', '①7·8 ②5 ③5 심7', (d) => {
            // 부은 횟수가 적을수록 컵의 들이가 많다
            const counts = d.until(() => [d.int(4, 14), d.int(4, 14), d.int(4, 14)], (c) => new Set(c).size === 3);
            return C(`똑같은 물통에 물을 가득 채우려면 가 컵으로는 ${counts[0]}번, 나 컵으로는 ${counts[1]}번, 다 컵으로는 ${counts[2]}번 부어야 한다. 들이가 가장 많은 컵은?`, ['가 컵', '나 컵', '다 컵'], counts.indexOf(Math.min(...counts)), {
              explain: '같은 물통을 채울 때 부은 횟수가 적을수록 한 번에 붓는 양이 많다. 부은 횟수가 가장 적은 컵의 들이가 가장 많다.', facts: { choose: { exprs: counts.map(String), rule: 'min' } }
            });
          })
        ]
      },
      {
        id: 'vunit', title: '들이의 단위 L와 mL', standard: VOL,
        types: [
          T('vu-name', '들이 읽기', '①11·12 ②10 ③11', (d) => {
            const [a, b] = [d.int(2, 9), d.int(2, 9) * 100];
            const rows = d.shuffle([[`${a} 리터 ${b} 밀리리터`, true], [`${a} 밀리리터 ${b} 리터`, false], [`${a} 리터 ${b} 미터`, false], [`${a} 킬로그램 ${b} 그램`, false]]);
            return C(`${a} L ${b} mL를 바르게 읽은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), { explain: 'L는 리터, mL는 밀리리터라고 읽는다.', facts: { truth: rows.map(([, ok]) => ok), want: true } });
          }),
          T('vu-read', '비커의 눈금 읽기(몇 mL)', '①13 ②13 ③13 심12', (d) => {
            const level = d.pick([200, 300, 400, 600, 700, 800, 900]);
            return N('비커에 담긴 물은 몇 mL인가?', level, { unit: 'mL', figure: beaker(1000, 100, 500, level), explain: `작은 눈금 한 칸은 100 mL이다. 물은 ${level / 100}칸까지 차 있으므로 ${level} mL이다.`, facts: { calc: [[`${level / 100}*100`, 0]] } });
          }),
          T('vu-read2', '비커의 눈금 읽기(몇 L 몇 mL)', '①14 ②14 ③14 심12', (d) => {
            const level = d.pick([1100, 1200, 1300, 1400, 1600, 1700, 1800, 1900]);
            return M('비커에 담긴 물은 몇 L 몇 mL인가?', ask(level, 'mL', 'L'), {
              figure: beaker(2000, 100, 500, level), explain: `작은 눈금 한 칸은 100 mL이다. 물은 1 L에서 ${(level - 1000) / 100}칸 더 차 있으므로 ${vol(level)}이다.`, facts: { calc: two(`${level / 100}*100`), unseen: [1000] }
            });
          }),
          T('vu-say', '「몇 L보다 몇 mL 더 많은 들이」', '①15 ②15 ③15', (d) => {
            const a = d.int(2, 9), b = d.int(1, 19) * 50;
            return N(`${a} L보다 ${b} mL 더 많은 들이는 몇 mL인가?`, a * 1000 + b, { unit: 'mL', explain: `${a} L는 ${a * 1000} mL이다. ${a * 1000} mL보다 ${b} mL 더 많은 들이는 ${a * 1000 + b} mL이다.`, facts: { calc: [[`${a}*1000+${b}`, 0]], unseen: [1000] } });
          }),
          T('vu-convert', 'L와 mL로 나타낸 들이 바꾸기', '①17·18·19 ②16 ③16 심13', (d) => {
            // 0이 끼는 수를 하나 넣는다: 5 L 40 mL, 3070 mL
            const a = d.int(2, 9) * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10, b = d.int(2, 9) * 1000 + d.pick([20, 30, 40, 60, 70, 80, 90, 5, 8]);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: hi(b) }, { label: LABELS[2], answer: lo(b) }], {
              figure: lines([`${vol(a)} = ${box(LABELS[0])} mL`, `${b} mL = ${box(LABELS[1])} L ${box(LABELS[2])} mL`]),
              explain: `1 L는 1000 mL이다. ${vol(a)}는 ${hi(a) * 1000} mL보다 ${lo(a)} mL 더 많은 ${a} mL이고, ${b} mL는 ${hi(b) * 1000} mL보다 ${lo(b)} mL 더 많은 ${vol(b)}이다.`,
              facts: { calc: [[X(a), 0], [`(${b}-${b}%1000)/1000`, 1], [`${b}%1000`, 2]], unseen: [1000] }
            });
          }),
          T('vu-wrong', '들이를 잘못 나타낸 것 찾기', '①22 ②18 ③18', (d) => {
            // 틀린 것: 4 L 60 mL 를 4600 mL 로(0을 빠뜨림)
            const rows = d.until(() => [d.int(2, 9) * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10, d.int(2, 9) * 1000 + d.int(1, 9) * 100, d.int(2, 9) * 1000 + d.int(2, 9) * 10], (x) => new Set(x.map(hi)).size === 3);
            const order = d.shuffle([0, 1, 2]), told = rows.map((v, i) => (i === 2 ? hi(v) * 1000 + lo(v) * 10 : v));
            return C('들이를 잘못 나타낸 것은?', order.map((i) => (i === 1 ? `${told[i]} mL = ${vol(rows[i])}` : `${vol(rows[i])} = ${told[i]} mL`)), order.indexOf(2), {
              explain: `${vol(rows[2])}는 ${hi(rows[2]) * 1000} mL보다 ${lo(rows[2])} mL 더 많은 ${rows[2]} mL이다.`, facts: { claimed: order.map((i) => [X(rows[i]), told[i]]), claimedWant: false, unseen: [1000] }
            });
          }),
          T('vu-compare', '두 들이의 크기 비교', '①23 ②19 ③19 심14', (d) => {
            const a = d.int(2, 8) * 1000 + d.int(1, 18) * 50, b = a + d.pick([-150, -100, -50, 50, 100, 150]);
            return C('두 들이의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(a, b), {
              figure: versus(vol(a), b + ' mL'), explain: `${vol(a)}는 ${a} mL이다. ${a} mL와 ${b} mL의 크기를 비교한다.`, facts: { choose: { exprs: [X(a), String(b)], rule: 'compare' }, unseen: [1000] }
            });
          }),
          T('vu-max', '들이가 가장 많은 것 고르기', '①24·25 ②20 ③20 심15', (d) => {
            const base = d.int(2, 7) * 1000, v = d.until(() => [base + d.int(1, 18) * 50, base + d.int(1, 18) * 50, base - 1000 + d.int(10, 19) * 50], (x) => new Set(x).size === 3);
            const show = d.shuffle([0, 1, 2]), text = (i, k) => (k === 1 ? v[i] + ' mL' : vol(v[i]));
            return C('들이가 가장 많은 것은?', show.map((i, k) => text(i, k)), show.indexOf(v.indexOf(Math.max(...v))), {
              explain: `모두 mL로 나타내면 ${show.map((i) => v[i] + ' mL').join(', ')}이다.`, facts: { choose: { exprs: show.map((i, k) => (k === 1 ? String(v[i]) : X(v[i]))), rule: 'max' }, unseen: [1000] }
            });
          })
        ]
      },
      {
        id: 'vest', title: '들이 어림하기', standard: VOL,
        types: [
          T('ve-odd', '알맞은 단위가 다른 하나', '①26·27 ②24 ③22 심22', (d) => {
            const { rows, at } = oddUnit(d, VOLS, 'mL', 'L');
            return C('들이를 나타낼 때, □ 안에 알맞은 단위가 나머지와 다른 하나는?', rows.map(([thing, n]) => `${thing}는 약 ${n} □이다.`), at, {
              explain: `${said(rows[at])} 나머지는 모두 mL가 알맞다.`, facts: { truth: rows.map((_, i) => i === at), want: true }
            });
          }),
          T('ve-wrong', '들이의 단위를 잘못 쓴 문장 찾기', '①31 ②27 ③26 심21', (d) => {
            const rows = d.until(() => d.shuffle(VOLS).slice(0, 4), (x) => new Set(x.map(([, , u]) => u)).size === 2), bad = d.int(0, 3);
            return C('들이의 단위를 알맞게 쓰지 않은 것은?', rows.map((row, i) => said(row, i === bad ? (row[2] === 'L' ? 'mL' : 'L') : row[2])), bad, {
              explain: said(rows[bad]), facts: { truth: rows.map((_, i) => i !== bad), want: false }
            });
          }),
          T('ve-times', '아는 들이의 몇 배로 어림하기', '①32 ②29 ③28 심26', (d) => {
            const [cup, n] = d.pick([[500, 4], [500, 6], [200, 5], [250, 4], [250, 8], [500, 8], [200, 10]]);
            return N(`들이가 ${cup} mL인 컵으로 ${n}번 부었더니 빈 물통이 가득 찼다. 물통의 들이는 약 몇 L인가?`, cup * n / 1000, {
              unit: 'L', lead: '약', explain: `${cup} × ${n} = ${cup * n}(mL)이고 ${cup * n} mL는 ${cup * n / 1000} L이다.`, facts: { calc: [[`${cup}*${n}/1000`, 0]], unseen: [1000] }
            });
          }),
          T('ve-near', '실제 들이에 가장 가깝게 어림한 사람', '①36 ②32 ③31 심28', (d) => {
            const who = d.shuffle(NAMES).slice(0, 3), real = d.int(1, 3) * 1000, gaps = d.until(() => [d.pick([-1, 1]) * d.int(1, 7) * 50, d.pick([-1, 1]) * d.int(1, 7) * 50, d.pick([-1, 1]) * d.int(1, 7) * 50], (g) => new Set(g.map(Math.abs)).size === 3 && g.some((x) => x < 0) && g.some((x) => x > 0));
            const best = gaps.map(Math.abs).indexOf(Math.min(...gaps.map(Math.abs)));
            return C(`들이가 ${real / 1000} L인 물병의 들이를 세 사람이 어림하였다. ${who.map((w, i) => `${name(w, '은/는')} ${vol(real + gaps[i])}`).join(', ')}라고 어림했을 때, 실제 들이에 가장 가깝게 어림한 사람은?`, who, best, {
              explain: `실제 들이와의 차는 ${who.map((w, i) => `${w} ${Math.abs(gaps[i])} mL`).join(', ')}이다. 차가 가장 작은 ${name(who[best], '이/가')} 가장 가깝게 어림하였다.`,
              facts: { choose: { exprs: gaps.map((g, i) => X(real + gaps[i])), rule: 'nearest', target: real }, unseen: [1000] }
            });
          })
        ]
      },
      {
        id: 'vcalc', title: '들이의 덧셈과 뺄셈', standard: VOL_CALC,
        types: [
          T('vcalc-add0', '받아올림이 없는 덧셈', '①38 ②37 ③34', (d) => {
            const [a, b] = addPair(d, false);
            return M('다음을 계산하시오.', ask(a + b, 'mL', 'L'), { figure: timeColumn(cells(a, 'mL', 'L'), '+', cells(b, 'mL', 'L')), explain: `L는 L끼리, mL는 mL끼리 더한다. ${vol(a + b)}`, facts: Object.assign({ calc: two(`${X(a)}+${X(b)}`), unseen: [1000] }, rule('+', a, b, false)) });
          }),
          T('vcalc-add1', '받아올림이 있는 덧셈', '①40 ②39 ③36 심29', (d) => {
            const [a, b] = addPair(d, true);
            return M('다음을 계산하시오.', ask(a + b, 'mL', 'L'), { figure: timeColumn(cells(a, 'mL', 'L'), '+', cells(b, 'mL', 'L')), explain: `mL끼리 더하면 ${lo(a) + lo(b)} mL이다. 1000 mL를 1 L로 받아올림하면 ${vol(a + b)}이다.`, facts: Object.assign({ calc: two(`${X(a)}+${X(b)}`), unseen: [1000] }, rule('+', a, b, true)) });
          }),
          T('vcalc-sub0', '받아내림이 없는 뺄셈', '①39 ②38 ③35', (d) => {
            const [a, b] = subPair(d, false);
            return M('다음을 계산하시오.', ask(a - b, 'mL', 'L'), { figure: timeColumn(cells(a, 'mL', 'L'), '-', cells(b, 'mL', 'L')), explain: `L는 L끼리, mL는 mL끼리 뺀다. ${vol(a - b)}`, facts: Object.assign({ calc: two(`${X(a)}-${X(b)}`), unseen: [1000] }, rule('-', a, b, false)) });
          }),
          T('vcalc-sub1', '받아내림이 있는 뺄셈', '①41 ②40 ③37 심29', (d) => {
            const [a, b] = subPair(d, true);
            return M('다음을 계산하시오.', ask(a - b, 'mL', 'L'), { figure: timeColumn(cells(a, 'mL', 'L'), '-', cells(b, 'mL', 'L')), explain: `mL끼리 뺄 수 없으므로 1 L를 1000 mL로 받아내림한다. ${1000 + lo(a)} - ${lo(b)} = ${1000 + lo(a) - lo(b)}(mL)이므로 ${vol(a - b)}이다.`, facts: Object.assign({ calc: two(`${X(a)}-${X(b)}`), unseen: [1000] }, rule('-', a, b, true)) });
          }),
          T('vcalc-mixed', '단위가 섞인 계산', '①44·45 ②43 ③40', (d) => {
            const a = d.int(2, 5) * 1000 + d.int(4, 18) * 50, b = d.until(() => d.int(22, 38) * 50, (v) => v % 1000 !== 0 && (lo(a) + lo(v)) % 1000 !== 0);
            return M('다음을 계산하여 몇 L 몇 mL인지 구하시오.', ask(a + b, 'mL', 'L'), {
              figure: `<span class="mb-expr">${vol(a)} <i>+</i> ${b} mL</span>`, explain: `${b} mL는 ${vol(b)}이다. ${vol(a)} + ${vol(b)} = ${vol(a + b)}`, facts: { calc: two(`${X(a)}+${b}`), unseen: [1000] }
            });
          }),
          T('vcalc-fix', '잘못 계산한 것 바로잡기', '①? ②46 ③45 심31', (d) => {
            // 받아올림한 1 L를 더하지 않은 계산
            const [a, b] = addPair(d, true), wrong = (hi(a) + hi(b)) * 1000 + (lo(a) + lo(b)) % 1000;
            return M('다음은 잘못 계산한 것이다. 바르게 계산한 값은 몇 L 몇 mL인가?', ask(a + b, 'mL', 'L'), {
              figure: timeColumn(cells(a, 'mL', 'L'), '+', cells(b, 'mL', 'L'), cells(wrong, 'mL', 'L')), explain: `mL끼리 더한 ${lo(a) + lo(b)} mL에서 1000 mL를 1 L로 받아올림하지 않았다. 바르게 계산하면 ${vol(a + b)}이다.`,
              facts: { calc: two(`${X(a)}+${X(b)}`), unseen: [1000], wrongAmount: wrong }
            });
          }),
          T('vcalc-sum', '문장제: 두 들이의 합', '①52 ②47 ③47 심34', (d) => {
            const [a, b] = addPair(d, true);
            return M(`물통에 물이 ${vol(a)} 들어 있다. 여기에 물 ${vol(b)}를 더 부으면 물통의 물은 모두 몇 L 몇 mL가 되는가?`, ask(a + b, 'mL', 'L'), { explain: `${vol(a)} + ${vol(b)} = ${vol(a + b)}`, facts: { calc: two(`${X(a)}+${X(b)}`), unseen: [1000] } });
          }),
          T('vcalc-diff', '문장제: 두 들이의 차', '①53 ②48 ③48 심35', (d) => {
            const [a, b] = subPair(d, true);
            return M(`주스 ${vol(a)} 중에서 ${vol(b)}를 마셨다. 남은 주스는 몇 L 몇 mL인가?`, ask(a - b, 'mL', 'L'), { explain: `${vol(a)} - ${vol(b)} = ${vol(a - b)}`, facts: { calc: two(`${X(a)}-${X(b)}`), unseen: [1000] } });
          }),
          T('vcalc-repeat', '문장제: 같은 양을 여러 번 붓기', '①56 ②50 심41', (d) => {
            const [cup, n] = d.until(() => [d.int(3, 9) * 100, d.int(3, 6)], ([x, y]) => x * y > 1000 && (x * y) % 1000 !== 0);
            return M(`빈 수조에 물을 ${cup} mL씩 ${n}번 부었다. 수조에 담긴 물은 모두 몇 L 몇 mL인가?`, ask(cup * n, 'mL', 'L'), {
              explain: `${cup} × ${n} = ${cup * n}(mL)이고 ${cup * n} mL는 ${vol(cup * n)}이다.`, facts: { calc: two(`${cup}*${n}`), unseen: [1000] }
            });
          })
        ]
      },
      {
        id: 'wcmp', title: '무게 비교하기', standard: WEIGHT,
        types: [
          T('wc-count', '같은 물건의 수로 무게 비교하기', '①63·64 ②57 ③62 심49', (d) => {
            const [a, b] = d.until(() => [d.int(8, 25), d.int(8, 25)], ([x, y]) => x > y + 2);
            return N(`저울로 무게를 재었더니 가위는 바둑돌 ${a}개, 풀은 바둑돌 ${b}개와 무게가 같았다. 가위는 풀보다 바둑돌 몇 개만큼 더 무거운가?`, a - b, {
              unit: '개', explain: `같은 바둑돌로 재었으므로 바둑돌의 수를 비교한다. ${a} - ${b} = ${a - b}`, facts: { calc: [[`${a}-${b}`, 0]] }
            });
          }),
          T('wc-each', '한 개의 무게 비교하기', '①66·67 ②59 ③64 심53', (d) => {
            const k = d.int(2, 4), n = d.int(2, 4);
            return N(`저울의 한쪽에 귤 ${k * n}개를, 다른 쪽에 사과 ${k}개를 올렸더니 저울이 어느 쪽으로도 기울지 않았다. 귤끼리, 사과끼리 무게가 같을 때, 사과 1개의 무게는 귤 몇 개의 무게와 같은가?`, n, {
              unit: '개', explain: `사과 ${k}개의 무게가 귤 ${k * n}개의 무게와 같으므로 사과 1개의 무게는 귤 ${k * n} ÷ ${k} = ${n}(개)의 무게와 같다.`, facts: { calc: [[`${k * n}/${k}`, 0]] }
            });
          })
        ]
      },
      {
        id: 'wunit', title: '무게의 단위 kg, g, t', standard: WEIGHT,
        types: [
          T('wu-read', '저울의 눈금 읽기(몇 g)', '①72 ②64 ③71 심57', (d) => {
            const value = d.pick([200, 300, 400, 600, 700, 800, 900]);
            return N('저울에 올린 물건의 무게는 몇 g인가?', value, { unit: 'g', figure: dial(2000, 100, 500, value), explain: `작은 눈금 한 칸은 100 g이다. 바늘이 0에서 ${value / 100}칸 간 곳을 가리키므로 ${value} g이다.`, facts: { calc: [[`${value / 100}*100`, 0]] } });
          }),
          T('wu-read2', '저울의 눈금 읽기(몇 kg 몇 g)', '①73 ②65 ③72 심57', (d) => {
            const value = d.pick([1100, 1200, 1300, 1400, 1600, 1700, 1800, 1900]);
            return M('저울에 올린 물건의 무게는 몇 kg 몇 g인가?', ask(value, 'g', 'kg'), {
              figure: dial(2000, 100, 500, value), explain: `작은 눈금 한 칸은 100 g이다. 바늘이 1 kg에서 ${(value - 1000) / 100}칸 더 간 곳을 가리키므로 ${wt(value)}이다.`, facts: { calc: two(`${value / 100}*100`), unseen: [1000] }
            });
          }),
          T('wu-say', '「몇 kg보다 몇 g 더 무거운 무게」', '①75 ②66 ③73', (d) => {
            const a = d.int(2, 9), b = d.int(1, 19) * 50;
            return N(`${a} kg보다 ${b} g 더 무거운 무게는 몇 g인가?`, a * 1000 + b, { unit: 'g', explain: `${a} kg은 ${a * 1000} g이다. ${a * 1000} g보다 ${b} g 더 무거운 무게는 ${a * 1000 + b} g이다.`, facts: { calc: [[`${a}*1000+${b}`, 0]], unseen: [1000] } });
          }),
          T('wu-convert', 'kg과 g으로 나타낸 무게 바꾸기', '①78·79·80 ②67 ③74 심58', (d) => {
            const a = d.int(2, 9) * 1000 + d.pick([20, 30, 40, 60, 70, 80, 90, 5, 8]), b = d.int(2, 9) * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10;
            return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: hi(b) }, { label: LABELS[2], answer: lo(b) }], {
              figure: lines([`${wt(a)} = ${box(LABELS[0])} g`, `${b} g = ${box(LABELS[1])} kg ${box(LABELS[2])} g`]),
              explain: `1 kg은 1000 g이다. ${wt(a)}은 ${hi(a) * 1000} g보다 ${lo(a)} g 더 무거운 ${a} g이고, ${b} g은 ${hi(b) * 1000} g보다 ${lo(b)} g 더 무거운 ${wt(b)}이다.`,
              facts: { calc: [[X(a), 0], [`(${b}-${b}%1000)/1000`, 1], [`${b}%1000`, 2]], unseen: [1000] }
            });
          }),
          T('wu-ton', 't과 kg으로 나타낸 무게 바꾸기', '①81 ②69 ③77 심58', (d) => {
            const [a, b] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a * 1000 }, { label: LABELS[1], answer: b }], {
              figure: lines([`${a} t = ${box(LABELS[0])} kg`, `${b * 1000} kg = ${box(LABELS[1])} t`]), explain: `1 t은 1000 kg이다. ${a} t은 ${a * 1000} kg이고 ${b * 1000} kg은 ${b} t이다.`,
              facts: { calc: [[`${a}*1000`, 0], [`${b * 1000}/1000`, 1]], unseen: [1000] }
            });
          }),
          T('wu-make', '더해서 1 t이 되는 무게', '①76 ②68 ③76', (d) => {
            const a = d.int(2, 18) * 50;
            return N(`${a} kg에 몇 kg을 더하면 1 t이 되는가?`, 1000 - a, { unit: 'kg', explain: `1 t은 1000 kg이다. 1000 - ${a} = ${1000 - a}`, facts: { calc: [[`1000-${a}`, 0]], unseen: [1000] } });
          }),
          T('wu-compare', '두 무게의 크기 비교', '①84 ②71 ③79 심59', (d) => {
            const a = d.int(2, 8) * 1000 + d.pick([20, 40, 50, 60, 80, 90]), b = hi(a) * 1000 + lo(a) * 10 + d.pick([-100, 0, 100]);
            return C('두 무게의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(a, b), {
              figure: versus(wt(a), b + ' g'), explain: `${wt(a)}은 ${a} g이다. ${a} g과 ${b} g의 크기를 비교한다.`, facts: { choose: { exprs: [X(a), String(b)], rule: 'compare' }, unseen: [1000] }
            });
          }),
          T('wu-max', '가장 무거운 것 고르기', '①85·86 ②72 ③80 심60', (d) => {
            const base = d.int(2, 7) * 1000, v = d.until(() => [base + d.int(1, 18) * 50, base + d.int(1, 18) * 50, base - 1000 + d.int(10, 19) * 50], (x) => new Set(x).size === 3);
            const show = d.shuffle([0, 1, 2]), things = ['수박', '멜론', '호박'], text = (i, k) => (k === 1 ? v[i] + ' g' : wt(v[i]));
            return C(`무게를 재었더니 ${show.map((i, k) => `${things[k]}${k === 2 ? '은' : '은'} ${text(i, k)}`).join(', ')}이었다. 가장 무거운 것은?`, things, show.indexOf(v.indexOf(Math.max(...v))), {
              explain: `모두 g으로 나타내면 ${show.map((i, k) => `${things[k]} ${v[i]} g`).join(', ')}이다.`, facts: { choose: { exprs: show.map((i, k) => (k === 1 ? String(v[i]) : X(v[i]))), rule: 'max' }, unseen: [1000] }
            });
          })
        ]
      },
      {
        id: 'west', title: '무게 어림하기', standard: WEIGHT,
        types: [
          T('we-odd', '알맞은 단위가 다른 하나', '①91 ②82 ③90 심63', (d) => {
            const [major, minor] = d.pick([['g', 'kg'], ['kg', 'g'], ['kg', 't']]), { rows, at } = oddUnit(d, WEIGHTS, major, minor);
            return C('무게를 나타낼 때, □ 안에 알맞은 단위가 나머지와 다른 하나는?', rows.map(([thing, n]) => `${thing}는 약 ${n} □이다.`), at, {
              explain: `${said(rows[at])} 나머지는 모두 ${major}${major === 'g' ? '이' : major === 'kg' ? '이' : '이'} 알맞다.`, facts: { truth: rows.map((_, i) => i === at), want: true }
            });
          }),
          T('we-wrong', '무게의 단위를 잘못 쓴 문장 찾기', '①95 ②85 ③93 심64', (d) => {
            const SWAP = { g: 'kg', kg: 't', t: 'g' }, rows = d.until(() => d.shuffle(WEIGHTS).slice(0, 4), (x) => new Set(x.map(([, , u]) => u)).size === 3), bad = d.int(0, 3);
            return C('무게의 단위를 알맞게 쓰지 않은 것은?', rows.map((row, i) => said(row, i === bad ? SWAP[row[2]] : row[2])), bad, { explain: said(rows[bad]), facts: { truth: rows.map((_, i) => i !== bad), want: false } });
          }),
          T('we-pick', '알맞은 무게 고르기', '①92 ②83 ③91 심65', (d) => {
            const [thing, n, unit] = d.pick(WEIGHTS.filter(([, , u]) => u !== 't')), other = unit === 'g' ? 'kg' : 'g';
            const list = d.shuffle([[n, unit], [n, other], [n * 10, other], [n, 't']]);
            return C(`${thing}로 가장 알맞은 것은?`, list.map(([v, u]) => `약 ${v} ${u}`), list.findIndex(([v, u]) => v === n && u === unit), { explain: said([thing, n, unit]), facts: { truth: list.map(([v, u]) => v === n && u === unit), want: true } });
          }),
          T('we-near', '실제 무게에 가장 가깝게 어림한 사람', '①99 ②88 ③96 심68', (d) => {
            const who = d.shuffle(NAMES).slice(0, 3), real = d.int(1, 3) * 1000 + 500, gaps = d.until(() => [d.pick([-1, 1]) * d.int(1, 7) * 50, d.pick([-1, 1]) * d.int(1, 7) * 50, d.pick([-1, 1]) * d.int(1, 7) * 50], (g) => new Set(g.map(Math.abs)).size === 3 && g.some((x) => x < 0) && g.some((x) => x > 0));
            const best = gaps.map(Math.abs).indexOf(Math.min(...gaps.map(Math.abs)));
            return C(`무게가 ${wt(real)}인 멜론의 무게를 세 사람이 어림하였다. ${who.map((w, i) => `${name(w, '은/는')} ${wt(real + gaps[i])}`).join(', ')}이라고 어림했을 때, 실제 무게에 가장 가깝게 어림한 사람은?`, who, best, {
              explain: `실제 무게와의 차는 ${who.map((w, i) => `${w} ${Math.abs(gaps[i])} g`).join(', ')}이다. 차가 가장 작은 ${name(who[best], '이/가')} 가장 가깝게 어림하였다.`,
              facts: { choose: { exprs: gaps.map((g, i) => X(real + gaps[i])), rule: 'nearest', target: real }, unseen: [1000] }
            });
          })
        ]
      },
      {
        id: 'wcalc', title: '무게의 덧셈과 뺄셈', standard: WEIGHT_CALC,
        types: [
          T('wcalc-add', '받아올림이 있는 덧셈', '①104 ②95 ③102 심73', (d) => {
            const [a, b] = addPair(d, true);
            return M('다음을 계산하시오.', ask(a + b, 'g', 'kg'), { figure: timeColumn(cells(a, 'g', 'kg'), '+', cells(b, 'g', 'kg')), explain: `g끼리 더하면 ${lo(a) + lo(b)} g이다. 1000 g을 1 kg으로 받아올림하면 ${wt(a + b)}이다.`, facts: Object.assign({ calc: two(`${X(a)}+${X(b)}`), unseen: [1000] }, rule('+', a, b, true)) });
          }),
          T('wcalc-sub', '받아내림이 있는 뺄셈', '①105 ②96 ③103 심73', (d) => {
            const [a, b] = subPair(d, true);
            return M('다음을 계산하시오.', ask(a - b, 'g', 'kg'), { figure: timeColumn(cells(a, 'g', 'kg'), '-', cells(b, 'g', 'kg')), explain: `g끼리 뺄 수 없으므로 1 kg을 1000 g으로 받아내림한다. ${1000 + lo(a)} - ${lo(b)} = ${1000 + lo(a) - lo(b)}(g)이므로 ${wt(a - b)}이다.`, facts: Object.assign({ calc: two(`${X(a)}-${X(b)}`), unseen: [1000] }, rule('-', a, b, true)) });
          }),
          T('wcalc-dial', '저울 두 개의 무게 더하기', '①119', (d) => {
            const [a, b] = d.until(() => [d.pick([600, 700, 800, 900, 1200, 1300, 1400]), d.pick([600, 700, 800, 900, 1100, 1200, 1300])], ([x, y]) => x !== y && (x + y) % 1000 !== 0 && lo(x) + lo(y) > 1000);
            return M('두 저울에 올린 물건의 무게를 더하면 몇 kg 몇 g인가?', ask(a + b, 'g', 'kg'), {
              figure: dial(2000, 100, 500, a) + dial(2000, 100, 500, b), explain: `두 물건의 무게는 ${wt(a)}, ${wt(b)}이다. ${wt(a)} + ${wt(b)} = ${wt(a + b)}`, facts: { calc: two(`${a / 100}*100+${b / 100}*100`), unseen: [1000] }
            });
          }),
          T('wcalc-basket', '문장제: 그릇의 무게 빼기', '①122 ②? 심90', (d) => {
            const basket = d.int(6, 9) * 50, fruit = d.until(() => amount(d, 4), (v) => lo(v) + basket > 1000), total = fruit + basket;
            return M(`귤을 담은 바구니의 무게는 ${wt(total)}이고, 빈 바구니의 무게는 ${basket} g이다. 귤만의 무게는 몇 kg 몇 g인가?`, ask(fruit, 'g', 'kg'), {
              explain: `${wt(total)} - ${basket} g = ${wt(fruit)}`, facts: { calc: two(`${X(total)}-${basket}`), unseen: [1000] }
            });
          }),
          T('wcalc-three', '문장제: 전체에서 두 무게 빼기', '①121 ③? 심83', (d) => {
            const [a, b, c] = d.until(() => [amount(d, 3) + 5000, amount(d, 2), amount(d, 2)], ([x, y, z]) => y !== z && x - y - z > 1000 && lo(x - y - z) !== 0 && lo(x) < lo(y));
            return M(`밀가루 ${wt(a)} 중에서 빵을 만드는 데 ${wt(b)}, 과자를 만드는 데 ${wt(c)}을 사용하였다. 남은 밀가루는 몇 kg 몇 g인가?`, ask(a - b - c, 'g', 'kg'), {
              explain: `${wt(a)} - ${wt(b)} = ${wt(a - b)}, ${wt(a - b)} - ${wt(c)} = ${wt(a - b - c)}`, facts: { calc: two(`${X(a)}-${X(b)}-${X(c)}`), unseen: [1000] }
            });
          })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
