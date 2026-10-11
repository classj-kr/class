// 3학년 2학기 5단원 들이와 무게 — 꼴 목록을 다시 대조해 보탠 문항.
// 꼴 목록 넷(기본꼴 1~3, 심화꼴)과 덧문서 모음을 처음부터 끝까지 다시 읽고, 3-2-5a.js·3-2-5b.js 의 유형이 묻지 않는 꼴을 옮겼다.
// 꼴과 조건은 그 문제를 따르고 수와 상황은 새로 썼다. ref 의 ①n 은 기본꼴_1 의 n번, ②n·③n 은 기본꼴_2·3, 심n 은 심화꼴의 n번, 덧은 덧문서 모음이다.
//
// 싣는 기준
//  - 주는 것(글·눈금 그림·표), 묻는 것(값·고르기·차례·빈칸), 계산 구조(받아올림·받아내림, 한쪽이 몇 L·몇 mL뿐인가, 단위가 섞였는가),
//    문장제의 얼개(합치기·덜어 내기·비교·처음 양·여러 번)가 다르면 따로 실었다.
//  - 들이와 무게에 같은 얼개가 되풀이되는 꼴은 양쪽에 싣되 셈의 구조나 묻는 것을 다르게 잡았다
//    (들이는 「몇 L − 몇 L 몇 mL」를 식으로, 무게는 문장제로. 들이는 뺄셈식의 빈칸, 무게는 덧셈식의 빈칸 …).
//  - 양팔저울 그림을 그리는 도구가 없어, 저울 그림으로 묻는 꼴은 원문에 글로만 낸 변형이 있는 것만 글로 실었다.
//
// 뺀 것과 까닭
//  - 4학년 「곱셈과 나눗셈」: 네 자리 수를 나누는 꼴 — 그릇을 컵으로 채우는 횟수·한 컵의 들이(심17·18·19), 필요한 트럭 수(①89 심62),
//    한 개의 무게·개수(①90 ①97 ②89 ③121 심61 심70 심91), 1 t은 몇 kg의 몇 배·몇 포대(①98 ③88 ③89 심71, 덧: 10 kg 몇 포대가 1 t), 값으로 병 수 구하기(③60),
//    1 L의 반·5 L의 반(②22, 심26의 일부), 100 mL 몇 개가 500 mL(①32의 변형). (몇 L 몇 mL)의 4배(③55)는 네 자리 수의 곱셈이다.
//    mL끼리 더해 다섯 자리 수가 되는 셈(②41의 변형).
//  - 6학년 비례·중학교 반비례: 수도에서 나오는 물(심46), 부은 횟수의 비로 컵 들이의 배 구하기(①9 ③8 심9)
//  - 방정식 꼴: 합과 차로 두 무게(①123 심92), 두 저울을 이어 바꿔 넣기(③65 심55), 두 그릇의 물을 같게 하기(③57)
//  - 경우 따지기·조건 풀이: 그릇 고르기(①59 ③59 심43, 덧: 통에 나누어 담기), 범위에 드는 두 물건(②113), 무게가 같게 나누기(②114 ③124 심93),
//    □에 들어갈 수 모두(①88), 저울 둘·셋으로 한 개의 무게 차례(①67 ③68 ③69 심54), 추로 재는 방법의 수(③70), 가벼운 구슬 찾기(덧)
//  - 뜻 없는 셈: 빈칸 수끼리 더하기(①45·①80의 변형 ③77 심58의 일부 심75), 두 계산 결과의 차(심79)
//  - 서술형·작도·활동·앞 학년: ①47 ①70 ①111 ①124 ①126 ②9 ②35 ②36 ②54 ②55 ②92 ②115 ③10 ③67 ③126 ③127 ③128 심4 심11 심27 심48 심56 심72 심94
//    (까닭을 쓰게 하는 ①10 ②8 ②63 ③66 심10 은 오개념 보기를 넣은 고르기 문항으로 바꾸어 실력에 실었다.)
//  - 교육과정 밖 단위: 근(③125)
//  - 묻는 틀만 다른 것(같은 것끼리 잇기 ①21 ①83 ②73 ③16 ③27 ③78 ③95, 풀어 쓴 계산 과정 따라 쓰기 ①46 ①110, 합과 차를 함께 ①48 ①112 ②43 ②99, 화살표 틀 심76)은
//    이미 있는 유형과 같은 문제로 보아 싣지 않았다.
//  - 셈의 얼개가 이미 있는 유형과 같고 상황만 다른 문장제는 한 번만 실었다: 전체에서 둘 빼기(①54 ③48 심38 → wcalc-three), 더한 뒤 빼기(③49 → h-overflow),
//    같은 책 두 권을 넣은 가방(덧 → h-half), 처음 양 둘을 구해 더하기(심89 → vcalc-first), 합친 양과 다른 그릇 비교(③58 → h-sum-who)
// 그림이 필요해 미룬 꼴: 기운 양팔저울 그림으로 묻는 꼴(①60~63 ②56~58 ③61 ③62 심47), 재는 도구 고르기(①37 ②34, 덧: 추 고르기),
//    크기가 다른 두 병을 견주어 어림하기(②31 ③31), 물건 그림에서 고르기(②86 과 ①26·①28·③22·③90 의 그림 변형)
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다. 수와 단위는 띄어 쓴다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, lines, tagged, table, beaker, dial, levels, timeColumn, N, M, C } = B.kit;
  const VOL = '4수03-17', VOL_CALC = '4수03-19', WEIGHT_CALC = '4수03-23';   // 무게의 단위·어림(4수03-20)은 묶음의 성취기준을 그대로 쓴다
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 기본 자료에만 나오지만 뜻을 정확히 알아야 하거나 두 번 넘게 계산해야 하는 문제
  const HB = (id, title, ref, make, more) => T(id, title, ref, make, Object.assign({ level: '실력' }, more || {}));
  const SIGNS = ['&gt;', '=', '&lt;'];
  const versus = (left, right) => `<div class="mb-versus"><span class="mb-expr">${left}</span><span class="mb-ring"></span><span class="mb-expr">${right}</span></div>`;
  const sign = (x, y) => (x > y ? 0 : x === y ? 1 : 2);
  const hi = (v) => Math.floor(v / 1000), lo = (v) => v % 1000;
  // 양을 큰 단위와 작은 단위로 적는다: 2300 → 2 L 300 mL. 단위 기호 뒤 토씨는 읽는 소리대로 글에 직접 적는다(mL·L 는/를/가, g·kg·t 은/을/이).
  const write = (v, small, big) => [hi(v) ? hi(v) + ' ' + big : '', lo(v) ? lo(v) + ' ' + small : ''].filter(Boolean).join(' ');
  const vol = (v) => write(v, 'mL', 'L'), wt = (v) => write(v, 'g', 'kg');
  // 식에 적는 꼴(글에 적힌 수 그대로)과, 답 두 칸(큰 단위·작은 단위)을 다시 셈하는 식
  const X = (v) => (hi(v) && lo(v) ? `(${hi(v)}*1000+${lo(v)})` : hi(v) ? `${hi(v)}*1000` : String(lo(v)));
  const two = (text) => [[`((${text})-(${text})%1000)/1000`, 0], [`(${text})%1000`, 1]];
  const ask = (v, small, big) => [{ answer: hi(v), unit: big }, { answer: lo(v), unit: small }];
  const cells = (v, small, big) => [hi(v) + ' ' + big, lo(v) + ' ' + small];
  // 두 양(작은 단위의 수는 50의 배수). carry: 더할 때 받아올림(뺄 때 받아내림)이 있는가
  const amount = (d, top) => d.int(1, top) * 1000 + d.int(3, 18) * 50;
  const addPair = (d, carry) => d.until(() => [amount(d, 5), amount(d, 4)], ([a, b]) => lo(a) !== lo(b) && (carry ? lo(a) + lo(b) > 1000 : lo(a) + lo(b) < 1000));
  const subPair = (d, borrow) => d.until(() => [amount(d, 8), amount(d, 4)], ([a, b]) => hi(a) > hi(b) + 1 && (borrow ? lo(a) < lo(b) : lo(a) > lo(b)));
  const rule = (op, a, b, carry) => ({ unitRule: { op, a: [hi(a), lo(a)], b: [hi(b), lo(b)], carry }, rule: (carry ? 'carry' : 'noCarry') + op });
  // 계산 결과가 r 이 되는 식: 받아올림이 있는 덧셈 [a, b] 또는 받아내림이 있는 뺄셈 [a, b]. r 의 작은 단위 수는 150~850 이어야 한다.
  const near = (d, op, r) => d.until(() => { const b = amount(d, 3); return op === '+' ? [r - b, b] : [r + b, b]; },
    ([a, b]) => a > 1000 && lo(a) !== 0 && lo(a) !== lo(b) && (op === '+' ? lo(a) + lo(b) > 1000 : lo(a) < lo(b)));
  // 차례를 묻는 보기 넷: 바른 차례와 꾐 보기(lures)를 넣고 나머지는 다른 차례로 채워 섞는다.
  const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const orderOptions = (d, right, lures) => {
    const picked = [];
    for (const o of [right].concat(lures || [], d.shuffle(PERMS))) if (picked.length < 4 && !picked.some((p) => p.join() === o.join())) picked.push(o);
    return d.shuffle(picked);
  };
  const where = (orders, right) => orders.findIndex((o) => o.join() === right.join());
  // 어림에 쓰는 물건(사실 그대로). 한 갈래 안의 물건은 크기가 비슷하니 한 문제에는 갈래마다 하나만 넣는다.
  const V_TINY = [['숟가락', 5, 'mL']], V_CUP = [['요구르트병', 80, 'mL'], ['종이컵', 180, 'mL'], ['음료수 캔', 250, 'mL']], V_JUG = [['주전자', 2, 'L'], ['양동이', 5, 'L']], V_TUB = [['욕조', 200, 'L'], ['냉장고', 500, 'L']];
  const W_TINY = [['연필 한 자루', 5, 'g']], W_HAND = [['달걀 한 개', 60, 'g'], ['휴대 전화 한 대', 200, 'g']], W_LOAD = [['수박 한 통', 6, 'kg'], ['자전거 한 대', 12, 'kg'], ['3학년 학생 한 명', 35, 'kg']], W_HUGE = [['코끼리 한 마리', 5, 't'], ['버스 한 대', 12, 't']];

  // ── 들이 비교하기 ───────────────────────────────────────────────
  B.addTypes('3-2-5', 'vcmp', [
    T('vc-pour', '옮겨 담아 넘치는지로 비교하기', '①1 ②1 ③1 심1', (d) => {
      const [from, to] = d.pick([['주전자', '물병'], ['꽃병', '냄비'], ['물통', '보온병'], ['우유병', '유리컵']]);
      const over = d.bool(), more = d.bool(), bigger = over ? 0 : 1, want = more ? bigger : 1 - bigger;
      return C(`${from}에 물을 가득 채운 뒤 빈 ${to}에 모두 옮겨 담았더니 ${josa(to, '이/가')} ${over ? '가득 차고 물이 넘쳤다' : '가득 차지 않았다'}. 들이가 더 ${more ? '많은' : '적은'} 것은?`, [from, to, '알 수 없다'], want, {
        explain: over ? `물이 넘쳤으므로 ${from}에 들어 있던 물은 ${to}에 담을 수 있는 양보다 많다. 들이는 ${josa(from, '이/가')} 더 많고 ${josa(to, '이/가')} 더 적다.`
          : `${josa(to, '이/가')} 가득 차지 않았으므로 ${from}에 들어 있던 물은 ${to}에 담을 수 있는 양보다 적다. 들이는 ${josa(to, '이/가')} 더 많고 ${josa(from, '이/가')} 더 적다.`,
        facts: { truth: [0, 1, 2].map((i) => i === want), want: true }
      });
    }),
    T('vc-chain', '옮겨 담은 결과를 이어 세 그릇 비교하기', '심2', (d) => {
      // 들이가 가장 많은 그릇과 가운데 그릇, 가운데 그릇과 가장 적은 그릇을 한 번씩 옮겨 담는다.
      const names = d.pick([['물통', '꽃병', '냄비'], ['주전자', '물병', '보온병'], ['양동이', '항아리', '수조']]);
      const cap = d.shuffle([0, 1, 2]), by = [0, 1, 2].map((r) => cap.indexOf(r));   // cap[i]: 그릇 i 의 들이 차례(0이 가장 많다), by[r]: r째로 많은 그릇
      const pour = (x, y) => { const [a, b] = d.bool() ? [x, y] : [y, x]; return `${names[a]}에 물을 가득 채운 뒤 빈 ${names[b]}에 모두 옮겨 담았더니 ${josa(names[b], '이/가')} ${cap[a] < cap[b] ? '가득 차고 물이 넘쳤다' : '가득 차지 않았다'}.`; };
      const told = d.shuffle([pour(by[0], by[1]), pour(by[1], by[2])]), big = d.bool(), right = big ? by : by.slice().reverse(), options = orderOptions(d, right, [right.slice().reverse()]);
      return C(`${told.join(' ')} 세 그릇을 들이가 ${big ? '많은' : '적은'} 것부터 차례로 쓴 것은?`, options.map((o) => o.map((i) => names[i]).join(', ')), where(options, right), {
        explain: `들이는 ${josa(names[by[0]], '이/가')} ${names[by[1]]}보다 많고, ${josa(names[by[1]], '이/가')} ${names[by[2]]}보다 많다.`,
        facts: { sequence: { ranks: [0, 1, 2].map((i) => right.indexOf(i)), options } }
      });
    }),
    T('vc-level-order', '옮겨 담은 물의 높이로 세 그릇의 차례 정하기', '①3 ②3 ③3 심3', (d) => {
      const heights = d.until(() => [d.int(2, 10), d.int(2, 10), d.int(2, 10)], (h) => new Set(h).size === 3 && !(h[0] < h[1] && h[1] < h[2]));
      const names = ['가', '나', '다'], right = [0, 1, 2].sort((x, y) => heights[x] - heights[y]), orders = orderOptions(d, right, [right.slice().reverse()]);
      return C('가, 나, 다 그릇에 물을 가득 채운 뒤 모양과 크기가 같은 그릇에 각각 옮겨 담았다. 들이가 적은 것부터 차례로 쓴 것은?', orders.map((o) => o.map((i) => names[i]).join(', ')), where(orders, right), {
        figure: levels(names, heights), explain: `모양과 크기가 같은 그릇에 옮겨 담았으므로 물의 높이가 낮을수록 들이가 적다. 물의 높이가 낮은 것부터 쓰면 ${right.map((i) => names[i]).join(', ')} 차례이다.`,
        facts: { choose: { exprs: heights.map(String), rule: 'ascending', orders } }
      });
    }),
    T('vc-cups-most', '옮겨 담은 컵의 수로 세 그릇 비교하기', '①4 ②5 ③4', (d) => {
      const names = ['꽃병', '주전자', '물병'], cups = d.until(() => [d.int(3, 12), d.int(3, 12), d.int(3, 12)], (c) => new Set(c).size === 3), most = d.bool();
      const best = cups.indexOf(most ? Math.max(...cups) : Math.min(...cups));
      return C(`꽃병, 주전자, 물병에 물을 가득 채운 뒤 모양과 크기가 같은 컵에 옮겨 담았더니 꽃병은 ${cups[0]}컵, 주전자는 ${cups[1]}컵, 물병은 ${cups[2]}컵이 되었다. 들이가 가장 ${most ? '많은' : '적은'} 것은?`, names, best, {
        explain: `같은 컵으로 재었으므로 컵의 수가 ${most ? '많을수록 들이가 많다' : '적을수록 들이가 적다'}. ${cups[best]}컵이 된 ${names[best]}의 들이가 가장 ${most ? '많다' : '적다'}.`,
        facts: { choose: { exprs: cups.map(String), rule: most ? 'max' : 'min' } }
      });
    }),
    T('vc-cups-double', '부은 횟수로 들이가 몇 배인 그릇 찾기', '심8', (d) => {
      // 같은 컵으로 부은 횟수가 많을수록 큰 그릇이다(컵을 비교하는 vc-pours 와 거꾸로).
      const k = d.pick([2, 3]), c = d.int(2, 4), others = d.until(() => [d.int(2, 14), d.int(2, 14)], ([x, y]) => new Set([x, y, c, k * c]).size === 4);
      const counts = d.shuffle([k * c].concat(others)), names = ['가 물병', '나 물병', '라 물병'];
      return C(`같은 컵으로 물을 부어 가득 채우려면 가 물병은 ${counts[0]}번, 나 물병은 ${counts[1]}번, 다 물병은 ${c}번, 라 물병은 ${counts[2]}번 부어야 한다. 들이가 다 물병의 ${k}배인 물병은?`, names, counts.indexOf(k * c), {
        explain: `같은 컵으로 부은 횟수가 많을수록 물병의 들이가 많다. 다 물병의 ${k}배인 물병은 ${c} × ${k} = ${k * c}(번) 부어야 가득 찬다.`,
        facts: { choose: { exprs: counts.map(String), rule: 'equals', target: k * c } }
      });
    }),
    T('vc-pours-order', '덜어 낸 횟수로 컵의 들이 차례 정하기', '①8 ③7 심7', (d) => {
      const counts = d.until(() => [d.int(3, 15), d.int(3, 15), d.int(3, 15)], (c) => new Set(c).size === 3);
      // 횟수가 많을수록 큰 컵이라고 여기는 아이는 거꾸로 쓴 차례를 고른다.
      const names = ['가', '나', '다'], right = [0, 1, 2].sort((x, y) => counts[x] - counts[y]), orders = orderOptions(d, right, [right.slice().reverse()]);
      return C(`수조에 가득 든 물을 모두 덜어 내려면 가 컵으로는 ${counts[0]}번, 나 컵으로는 ${counts[1]}번, 다 컵으로는 ${counts[2]}번 덜어 내야 한다. 컵의 들이가 많은 것부터 차례로 쓴 것은?`, orders.map((o) => o.map((i) => names[i]).join(', ')), where(orders, right), {
        explain: `같은 양의 물을 덜어 낼 때 덜어 낸 횟수가 적을수록 한 번에 덜어 내는 양이 많다. 횟수가 적은 컵부터 쓰면 ${right.map((i) => names[i]).join(', ')} 차례이다.`,
        facts: { choose: { exprs: counts.map(String), rule: 'ascending', orders } }
      });
    }),
    T('vc-fewest', '컵의 들이로 붓는 횟수 비교하기', '②7 ③9', (d) => {
      const caps = d.shuffle([150, 200, 250, 300, 400, 500]).slice(0, 3), many = d.bool(), best = caps.indexOf(many ? Math.min(...caps) : Math.max(...caps)), names = ['가 컵', '나 컵', '다 컵'];
      return C(`들이가 ${caps[0]} mL인 가 컵, ${caps[1]} mL인 나 컵, ${caps[2]} mL인 다 컵이 있다. 똑같은 어항에 물을 가득 채울 때, 물을 붓는 횟수가 가장 ${many ? '많은' : '적은'} 컵은?`, names, best, {
        explain: many ? `컵의 들이가 적을수록 물을 여러 번 부어야 한다. 들이가 가장 적은 ${names[best]}으로 부을 때 횟수가 가장 많다.` : `컵의 들이가 많을수록 물을 붓는 횟수가 적다. 들이가 가장 많은 ${names[best]}으로 부을 때 횟수가 가장 적다.`,
        facts: { choose: { exprs: caps.map(String), rule: many ? 'min' : 'max' } }
      });
    })
  ]);

  // ── 들이의 단위 L와 mL ──────────────────────────────────────────
  B.addTypes('3-2-5', 'vunit', [
    T('vu-misread', '들이를 잘못 읽은 것 찾기', '①12', (d) => {
      const [a, b, c, e] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]), z = d.int(2, 9) * 10, h = d.int(1, 9) * 100;
      // 0을 붙여 읽은 것, 수를 이어 붙여 읽은 것, 단위를 바꾸어 읽은 것
      const wrong = d.pick([`${a} L ${z} mL → ${a} 리터 ${z * 10} 밀리리터`, `${a} L ${z} mL → ${a * 100 + z} 밀리리터`, `${a} L ${z} mL → ${a} 밀리리터 ${z} 리터`]);
      const rows = d.shuffle([[wrong, false], [`${b} L ${h} mL → ${b} 리터 ${h} 밀리리터`, true], [`${c * 100} mL → ${c * 100} 밀리리터`, true], [`${e} L → ${e} 리터`, true]]);
      return C('들이를 잘못 읽은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => !ok), {
        explain: `L는 리터, mL는 밀리리터라고 읽는다. ${a} L ${z} mL는 ${a} 리터 ${z} 밀리리터라고 읽는다.`, facts: { truth: rows.map(([, ok]) => ok), want: false }
      });
    }),
    T('vu-beakers', '가득 찬 비커와 덜 찬 비커로 물의 양 구하기', '①14 ①34 ③32 심12 심26', (d) => {
      const n = d.int(2, 4), level = d.pick([200, 300, 400, 500, 600, 700, 800, 900]);
      return M(`수조에 있던 물을 들이가 1 L인 비커 여러 개에 옮겨 담았더니 비커 ${n}개가 가득 차고, 남은 물을 담은 비커는 그림과 같았다. 수조에 있던 물은 몇 L 몇 mL인가?`, ask(n * 1000 + level, 'mL', 'L'), {
        figure: beaker(1000, 100, 500, level), explain: `가득 찬 비커 ${n}개의 물은 ${n} L이다. 남은 물은 작은 눈금 ${level / 100}칸까지 차 있으므로 ${level} mL이다. 수조에 있던 물은 ${n} L ${level} mL이다.`,
        facts: { calc: two(`${n}*1000+${level / 100}*100`) }
      });
    }),
    T('vu-liters', '1 L씩 부은 횟수로 그릇의 들이를 mL로 나타내기', '①16 ②12 ②32', (d) => {
      const n = d.int(3, 9);
      return N(`들이가 1 L인 그릇에 물을 가득 담아 빈 항아리에 ${n}번 부었더니 항아리가 가득 찼다. 항아리의 들이는 몇 mL인가?`, n * 1000, {
        unit: 'mL', explain: `항아리의 들이는 ${n} L이다. 1 L는 1000 mL이므로 ${n} L는 ${n * 1000} mL이다.`, facts: { calc: [[`1*${n}*1000`, 0]], unseen: [1000] }
      });
    }),
    T('vu-steps', '몇 mL를 몇 L 몇 mL로 바꾸는 과정', '①20 ②15', (d) => {
      const a = d.int(2, 9), b = d.int(1, 9) * 100, v = a * 1000 + b;
      return M('들이를 몇 L 몇 mL로 나타내는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a * 1000 }, { label: LABELS[1], answer: a }], {
        figure: lines([`${v} mL = ${box(LABELS[0])} mL + ${b} mL`, `= ${box(LABELS[1])} L + ${b} mL`, `= ${box(LABELS[1])} L ${b} mL`]),
        explain: `${v} mL는 ${a * 1000} mL보다 ${b} mL 더 많은 들이이다. ${a * 1000} mL는 ${a} L이므로 ${v} mL는 ${a} L ${b} mL이다.`,
        facts: { calc: [[`${v}-${b}`, 0], [`(${v}-${b})/1000`, 1]], unseen: [1000] }
      });
    }),
    T('vu-odd-one', '나타내는 들이가 다른 하나', '③17 심13', (d) => {
      // 셋은 같은 들이이고 하나만 0의 자리가 다르다(6 L 300 mL 와 6030 mL, 「6 L보다 30 mL 더」).
      const a = d.int(2, 9), b = d.int(2, 9) * 100, v = a * 1000 + b, slip = d.bool(), p = slip ? b / 10 : b, q = slip ? v : a * 1000 + b / 10;
      const rows = d.shuffle([[`${a} L ${b} mL`, `${a}*1000+${b}`, v], [`${a} L보다 ${p} mL 더 많은 들이`, `${a}*1000+${p}`, a * 1000 + p], [`${q} mL`, String(q), q], [`${a * 1000} mL보다 ${b} mL 더 많은 들이`, `${a * 1000}+${b}`, v]]);
      const odd = rows.findIndex(([, , value]) => value !== v);
      return C('나타내는 들이가 나머지 셋과 다른 것은?', rows.map(([text]) => text), odd, {
        explain: slip ? `${a} L보다 ${p} mL 더 많은 들이는 ${a * 1000 + p} mL이고, 나머지는 모두 ${v} mL이다.` : `${a} L ${b} mL는 ${v} mL이다. ${q} mL만 나머지 셋과 다르다.`, facts: { choose: { exprs: rows.map(([, text]) => text), rule: 'odd' }, unseen: [1000] }
      });
    }),
    T('vu-order', '세 들이를 차례대로 늘어놓기', '①25 ②20 ②23 ③21 심15', (d) => {
      // 8 L 90 mL, 8900 mL(8 L 900 mL), 7950 mL: 0이 끼는 수와 mL로만 적은 수를 섞는다.
      const a = d.int(2, 8), z = d.int(2, 9) * 10, items = d.shuffle([[a * 1000 + z, true], [a * 1000 + z * 10, d.bool()], [(a - 1) * 1000 + d.int(91, 99) * 10, false]]);
      const values = items.map(([v]) => v), exprs = items.map(([v, mixed]) => (mixed ? X(v) : String(v))), big = d.bool();
      const right = [0, 1, 2].sort((x, y) => (big ? values[y] - values[x] : values[x] - values[y])), orders = orderOptions(d, right, [right.slice().reverse()]);
      return C(`들이가 ${big ? '많은' : '적은'} 것부터 차례로 기호를 쓴 것은?`, orders.map((o) => o.map((i) => LABELS[i]).join(', ')), where(orders, right), {
        figure: tagged(items.map(([v, mixed]) => (mixed ? vol(v) : v + ' mL'))), explain: `모두 mL로 나타내면 ${values.map((v, i) => `${LABELS[i]} ${v} mL`).join(', ')}이다.`,
        facts: { choose: { exprs, rule: big ? 'descending' : 'ascending', orders }, unseen: [1000] }
      });
    })
  ]);

  // ── 들이 어림하기 ───────────────────────────────────────────────
  B.addTypes('3-2-5', 'vest', [
    T('ve-unit', '들이에 알맞은 단위 쓰기', '①26 ②24 ③22 심20', (d) => {
      // 수는 같고 단위만 다른 두 물건
      const [big, small, n] = d.pick([['욕조', '우유갑', 200], ['냉장고', '생수병', 500], ['양동이', '숟가락', 5], ['큰 생수통', '물약 병', 20]]);
      const bigFirst = d.bool(), things = bigFirst ? [big, small] : [small, big], right = bigFirst ? 'L, mL' : 'mL, L', options = d.shuffle(['L, mL', 'mL, L', 'L, L', 'mL, mL']);
      return C('㉠, ㉡에 알맞은 단위를 차례로 쓴 것은?', options, options.indexOf(right), {
        figure: lines(things.map((thing, i) => `${thing}의 들이는 약 ${n} ${box(LABELS[i])}이다.`)),
        explain: `${big}의 들이는 약 ${n} L이고, ${small}의 들이는 약 ${n} mL이다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('ve-pick', '알맞은 들이 고르기', '①28 ②26 ③26 ③27', (d) => {
      const [thing, right, wrong] = d.pick([['주전자', '약 2 L', ['약 2 mL', '약 20 mL', '약 200 L']], ['양동이', '약 5 L', ['약 5 mL', '약 50 mL', '약 500 L']], ['욕조', '약 200 L', ['약 200 mL', '약 2 L', '약 20 mL']],
        ['종이컵', '약 180 mL', ['약 180 L', '약 18 L', '약 2 mL']], ['음료수 캔', '약 250 mL', ['약 250 L', '약 25 L', '약 3 mL']], ['요구르트병', '약 80 mL', ['약 80 L', '약 8 L', '약 1 mL']]]);
      const options = d.shuffle([right].concat(wrong));
      return C(`${thing}의 들이로 가장 알맞은 것은?`, options, options.indexOf(right), { explain: `${thing}의 들이는 ${right}이다.`, facts: { truth: options.map((o) => o === right), want: true } });
    }),
    T('ve-thing', '들이에 알맞은 물건 고르기', '①29 ②25 ③23 ③25 심24 심25', (d) => {
      const rows = d.shuffle([V_TINY[0], d.pick(V_CUP), d.pick(V_JUG), d.pick(V_TUB)]), at = d.int(0, 3), [thing, n, unit] = rows[at];
      return C(`들이가 약 ${n} ${unit}인 것은?`, rows.map(([each]) => each), at, { explain: `${thing}의 들이는 약 ${n} ${unit}이다.`, facts: { truth: rows.map((_, i) => i === at), want: true } });
    }),
    T('ve-more', '1 L보다 들이가 많은(적은) 것 찾기', '①30 ②27 ②28 ③24 심23 심24', (d) => {
      const under = V_TINY.concat(V_CUP), over = V_JUG.concat(V_TUB), more = d.bool();
      const rows = d.shuffle(more ? d.shuffle(under).slice(0, 3).concat([d.pick(over)]) : d.shuffle(over).slice(0, 3).concat([d.pick(under)]));
      const hit = rows.map(([, , unit]) => (unit === 'L') === more), [thing, n, unit] = rows[hit.indexOf(true)];
      return C(`들이가 1 L보다 ${more ? '많은' : '적은'} 것은?`, rows.map(([each]) => each), hit.indexOf(true), {
        explain: `${thing}의 들이는 약 ${n} ${unit}이다. 나머지는 모두 1 L보다 ${more ? '적다' : '많다'}.`, facts: { truth: hit, want: true }
      });
    }),
    T('ve-chain', '두 번 거쳐 어림하기', '①33 심26', (d) => {
      const [a, b] = d.until(() => [d.int(2, 4), d.int(2, 5)], ([x, y]) => x !== y);
      return N(`들이가 1 L인 생수병에 물을 가득 담아 ${a}번 부으면 주전자가 가득 차고, 그 주전자에 물을 가득 담아 ${b}번 부으면 항아리가 가득 찬다. 항아리의 들이는 약 몇 L인가?`, a * b, {
        unit: 'L', lead: '약', explain: `주전자의 들이는 약 ${a} L이다. 항아리의 들이는 주전자의 들이의 ${b}배이므로 ${a} × ${b} = ${a * b}(L)이다.`, facts: { calc: [[`1*${a}*${b}`, 0]] }
      });
    }),
    T('ve-judge', '들이를 잘못 어림한 사람 찾기', '①35 ②30', (d) => {
      // 셈은 맞게 하고 단위를 L로 잘못 붙인 사람을 찾는다(200 mL씩 3번이면 약 600 L).
      const who = d.shuffle(NAMES).slice(0, 3), CUP = { 100: '국자', 200: '우유갑', 250: '컵', 500: '물병' }, vessels = d.shuffle(['꽃병', '주전자', '냄비']);
      const bad = d.pick([[200, 3], [200, 4], [100, 6], [100, 8], [250, 3]]), ok = d.until(() => d.pick([[200, 2], [200, 4], [100, 5], [100, 7], [250, 3]]), (r) => r[0] !== bad[0]);
      const whole = d.until(() => d.pick([[500, 4], [500, 2], [250, 4], [200, 5], [500, 6], [250, 8]]), (r) => r[0] !== bad[0] && r[0] !== ok[0]);
      const rows = d.shuffle([{ c: bad[0], n: bad[1], said: `${bad[0] * bad[1]} L`, value: bad[0] * bad[1] * 1000 }, { c: ok[0], n: ok[1], said: `${ok[0] * ok[1]} mL`, value: ok[0] * ok[1] }, { c: whole[0], n: whole[1], said: `${whole[0] * whole[1] / 1000} L`, value: whole[0] * whole[1] }]);
      const at = rows.findIndex((row) => row.value !== row.c * row.n);
      return C('세 사람이 들이를 어림한 것이다. 잘못 어림한 사람은?', who, at, {
        figure: lines(rows.map((row, i) => `${who[i]}: 들이가 ${row.c} mL인 ${josa(CUP[row.c], '으로/로')} ${row.n}번 부으면 가득 차므로 ${vessels[i]}의 들이는 약 ${row.said}이다.`)),
        explain: `${rows[at].c} × ${rows[at].n} = ${rows[at].c * rows[at].n}(mL)이므로 ${vessels[at]}의 들이는 약 ${rows[at].c * rows[at].n} mL이다.`,
        facts: { claimed: rows.map((row) => [`${row.c}*${row.n}`, row.value]), claimedWant: false }
      });
    })
  ]);

  // ── 들이의 덧셈과 뺄셈 ──────────────────────────────────────────
  B.addTypes('3-2-5', 'vcalc', [
    T('vcalc-whole', '몇 L에서 몇 L 몇 mL 빼기', '①42 ②51 ③40 심29', (d) => {
      const a = d.int(5, 9), b = d.int(1, a - 2) * 1000 + d.int(3, 18) * 50, r = a * 1000 - b;
      return M('다음을 계산하시오.', ask(r, 'mL', 'L'), {
        figure: expr(`${a} L`, '-', vol(b)), explain: `${a} L를 ${a - 1} L 1000 mL로 바꾸어 계산한다. ${a - 1} L 1000 mL - ${vol(b)} = ${vol(r)}`, facts: { calc: two(`${a}*1000-${X(b)}`), unseen: [1000] }
      });
    }),
    T('vcalc-ml', '몇 L 몇 mL에서 몇 mL 빼기', '①43', (d) => {
      const a = d.int(2, 8) * 1000 + d.int(2, 12) * 50, c = d.until(() => d.int(5, 19) * 50, (v) => v > lo(a)), r = a - c;
      return M('다음을 계산하시오.', ask(r, 'mL', 'L'), {
        figure: expr(vol(a), '-', `${c} mL`), explain: `${lo(a)} mL에서 ${c} mL를 뺄 수 없으므로 1 L를 1000 mL로 받아내림한다. ${1000 + lo(a)} - ${c} = ${lo(r)}(mL)이므로 ${vol(r)}이다.`,
        facts: { calc: two(`${X(a)}-${c}`), unseen: [1000] }
      });
    }),
    T('vcalc-mlml', 'mL끼리 더하여 몇 L 몇 mL로 나타내기', '①44 ②41 ③38', (d) => {
      const [a, b] = d.until(() => [d.int(2, 5) * 1000 + d.int(5, 9) * 100, d.int(1, 3) * 1000 + d.int(5, 9) * 100], ([x, y]) => (x + y) % 1000 !== 0 && lo(x) !== lo(y)), s = a + b;
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: s }, { label: LABELS[1], answer: hi(s) }, { label: LABELS[2], answer: lo(s) }], {
        figure: lines([`${a} mL + ${b} mL = ${box(LABELS[0])} mL`, `= ${box(LABELS[1])} L ${box(LABELS[2])} mL`]), explain: `${a} + ${b} = ${s}(mL)이고 ${s} mL는 ${vol(s)}이다.`,
        facts: { calc: [[`${a}+${b}`, 0], [`((${a}+${b})-(${a}+${b})%1000)/1000`, 1], [`(${a}+${b})%1000`, 2]], unseen: [1000] }
      });
    }),
    T('vcalc-blank-sub', '뺄셈식의 빈칸(받아내림)', '②47 ③46 심30', (d) => {
      const [a, b] = subPair(d, true), c = a - b;
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: hi(a) }, { label: LABELS[1], answer: lo(b) }], {
        figure: timeColumn([`${box(LABELS[0])} L`, `${lo(a)} mL`], '-', [`${hi(b)} L`, `${box(LABELS[1])} mL`], cells(c, 'mL', 'L')),
        explain: `mL끼리의 계산 결과 ${josa(lo(c), '이/가')} ${lo(a)}보다 크므로 받아내림이 있다. ${1000 + lo(a)} - ㉡ = ${lo(c)}에서 ㉡은 ${lo(b)}이다. L끼리의 계산은 ㉠ - 1 - ${hi(b)} = ${hi(c)}이므로 ㉠은 ${hi(a)}이다.`,
        facts: { calc: [[`${hi(c)}+${hi(b)}+1`, 0], [`1000+${lo(a)}-${lo(c)}`, 1]], unseen: [1000, 1] }
      });
    }),
    T('vcalc-missing', '빼는 들이 구하기', '③47', (d) => {
      const [a, x] = subPair(d, true), c = a - x;
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: hi(x) }, { label: LABELS[1], answer: lo(x) }], {
        figure: lines([`${vol(a)} − ${box(LABELS[0])} L ${box(LABELS[1])} mL`, `= ${vol(c)}`]), explain: `빼는 들이는 ${vol(a)} - ${vol(c)} = ${vol(x)}이다.`,
        facts: { calc: two(`${X(a)}-${X(c)}`), unseen: [1000] }
      });
    }),
    T('vcalc-compare', '두 계산 결과의 크기 비교', '①50 ②46 ③42 심32', (d) => {
      const part = () => d.int(3, 17) * 50, [r1, r2] = d.until(() => [d.int(3, 6) * 1000 + part(), d.int(3, 6) * 1000 + part()], ([x, y]) => Math.abs(x - y) <= 300);
      const [p, q] = near(d, '+', r1), [r, s] = near(d, '-', r2);
      return C('㉠과 ㉡의 계산 결과를 바르게 비교한 것은?', ['㉠이 더 많다', '㉠과 ㉡이 같다', '㉡이 더 많다'], sign(r1, r2), {
        figure: tagged([`${vol(p)} + ${vol(q)}`, `${vol(r)} − ${vol(s)}`]), explain: `㉠ ${vol(p)} + ${vol(q)} = ${vol(r1)}, ㉡ ${vol(r)} - ${vol(s)} = ${vol(r2)}`,
        facts: { choose: { exprs: [`${X(p)}+${X(q)}`, `${X(r)}-${X(s)}`], rule: 'compare' }, unseen: [1000] }
      });
    }),
    T('vcalc-over', '계산 결과가 기준보다 많은(적은) 것 고르기', '②45 ③42 심32', (d) => {
      const t = d.int(4, 7) * 1000, more = d.bool(), hit = d.int(0, 2);
      const results = d.until(() => [0, 1, 2].map((i) => t + ((i === hit) === more ? 1 : -1) * d.int(3, 8) * 50), (list) => new Set(list).size === 3);
      const ops = d.shuffle(['+', '-', d.pick(['+', '-'])]), rows = results.map((r, i) => near(d, ops[i], r));
      return C(`계산 결과가 ${t / 1000} L보다 ${more ? '많은' : '적은'} 것은?`, LABELS.slice(0, 3), hit, {
        figure: tagged(rows.map(([a, b], i) => `${vol(a)} ${ops[i] === '+' ? '+' : '−'} ${vol(b)}`)),
        explain: `계산 결과는 ${results.map((r, i) => `${LABELS[i]} ${vol(r)}`).join(', ')}이다. ${t / 1000} L보다 ${more ? '많은' : '적은'} 것은 ${LABELS[hit]}이다.`,
        facts: { choose: { exprs: rows.map(([a, b], i) => `${X(a)}${ops[i]}${X(b)}`), rule: more ? 'onlyAbove' : 'onlyBelow', target: t }, unseen: [1000] }
      });
    }),
    T('vcalc-top2', '둘을 골라 가장 많게 섞기', '①58 심44', (d) => {
      // 3 L 800 mL, 3280 mL, 3 L 90 mL: 3 L 90 mL 를 3900 mL 로 읽으면 잘못 고른다.
      const a = d.int(1, 4), [x, y, z] = d.until(() => [d.int(12, 18) * 50, d.int(12, 48) * 10, d.int(5, 9) * 10], ([p, q]) => (p + q) % 1000 !== 0 && q % 100 !== 0);
      const items = d.shuffle([[a * 1000 + x, true], [a * 1000 + y, false], [a * 1000 + z, true]]), exprs = items.map(([v, mixed]) => (mixed ? X(v) : String(v)));
      const [i, j] = [0, 1, 2].sort((m, n) => items[n][0] - items[m][0]).slice(0, 2).sort((m, n) => m - n), sum = items[i][0] + items[j][0];
      return M('주스 ㉠, ㉡, ㉢ 가운데 두 가지를 섞어 양이 가장 많게 하려고 한다. 섞은 주스는 몇 L 몇 mL인가?', ask(sum, 'mL', 'L'), {
        figure: tagged(items.map(([v, mixed]) => (mixed ? vol(v) : v + ' mL'))),
        explain: `모두 mL로 나타내면 ${items.map(([v], k) => `${LABELS[k]} ${v} mL`).join(', ')}이다. 양이 많은 ${LABELS[i]}, ${LABELS[j]}을 섞으면 ${vol(items[i][0])} + ${vol(items[j][0])} = ${vol(sum)}이다.`,
        facts: { calc: two(`${exprs[i]}+${exprs[j]}`), ends: items.map(([v]) => v), unseen: [1000] }
      });
    }),
    T('vcalc-who', '누가 얼마나 더 많이 마셨는지 구하기', '①53 ③41 심35', (d) => {
      const who = d.shuffle(NAMES).slice(0, 2), big = d.int(2, 4) * 1000 + d.int(2, 9) * 50, small = d.until(() => d.int(1, hi(big) - 1) * 1000 + d.int(4, 19) * 50, (v) => lo(v) > lo(big)), gap = big - small;
      const firstBig = d.bool(), mixedFirst = d.bool(), amounts = firstBig ? [big, small] : [small, big], winner = firstBig ? 0 : 1;
      const shown = amounts.map((v, i) => ((i === 0) === mixedFirst ? vol(v) : v + ' mL')), exprs = amounts.map((v, i) => ((i === 0) === mixedFirst ? X(v) : String(v)));
      // 받아내림한 1 L를 빼지 않으면 1 L 더 많은 값이 나온다.
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, gap + 1000], [1 - winner, gap + 1000]]);
      return C(`일주일 동안 ${name(who[0], '은/는')} 우유를 ${shown[0]} 마셨고, ${name(who[1], '은/는')} ${shown[1]} 마셨다. 누가 우유를 얼마나 더 많이 마셨는가?`, list.map(([k, n]) => `${who[k]}, ${vol(n)}`), list.findIndex(([k, n]) => k === winner && n === gap), {
        explain: `${who[0]} ${vol(amounts[0])}, ${who[1]} ${vol(amounts[1])}이다. ${vol(big)} - ${vol(small)} = ${vol(gap)}이므로 ${name(who[winner], '이/가')} ${vol(gap)} 더 많이 마셨다.`,
        facts: { who: { exprs, values: amounts, options: list }, unseen: [1000] }
      });
    }),
    T('vcalc-first', '문장제: 쓰고 남은 양으로 처음 양 구하기', '심36', (d) => {
      const [b, c] = addPair(d, true);
      return M(`물통에 든 물 중에서 ${vol(b)}를 썼더니 ${vol(c)}가 남았다. 처음 물통에 들어 있던 물은 몇 L 몇 mL인가?`, ask(b + c, 'mL', 'L'), {
        explain: `처음 물의 양은 쓴 물과 남은 물을 더한 것이다. ${vol(b)} + ${vol(c)} = ${vol(b + c)}`, facts: { calc: two(`${X(b)}+${X(c)}`), unseen: [1000] }
      });
    }),
    T('vcalc-more', '문장제: 「~보다 더 많이」', '②49 심34', (d) => {
      const who = d.pick(NAMES), [a, b] = d.until(() => [d.int(1, 3) * 1000 + d.int(11, 19) * 50, d.int(0, 1) * 1000 + d.int(6, 19) * 50], ([x, y]) => lo(x) !== lo(y) && lo(x) + lo(y) > 1000);
      return M(`${nick(who)}네 가족은 물을 어제 ${vol(a)} 마셨고, 오늘은 어제보다 ${vol(b)} 더 많이 마셨다. ${nick(who)}네 가족이 오늘 마신 물은 몇 L 몇 mL인가?`, ask(a + b, 'mL', 'L'), {
        explain: `${vol(a)} + ${vol(b)} = ${vol(a + b)}`, facts: { calc: two(`${X(a)}+${X(b)}`), unseen: [1000] }
      });
    }),
    T('vcalc-beaker-fill', '비커의 눈금을 읽어 더 부어야 할 양 구하기', '②50 ③34 덧', (d) => {
      const level = d.pick([200, 300, 400, 600, 700, 800, 900]), r = 2000 - level;
      return M('비커에 물이 그림과 같이 들어 있다. 비커의 2 L 눈금까지 물을 채우려면 몇 L 몇 mL를 더 부어야 하는가?', ask(r, 'mL', 'L'), {
        figure: beaker(2000, 100, 500, level), explain: `비커에 든 물은 작은 눈금 ${level / 100}칸까지이므로 ${level} mL이다. 2 L - ${level} mL = ${vol(r)}`,
        facts: { calc: two(`2*1000-${level / 100}*100`), unseen: [1000] }
      });
    }),
    T('vcalc-ladle', '문장제: 모자란 들이를 1 L씩 채우는 횟수', '심42 덧', (d) => {
      const now = d.int(2, 6) * 1000 + d.int(3, 18) * 50, k = d.int(3, 9), cap = now + k * 1000;
      return N(`들이가 ${vol(cap)}인 양동이에 물이 ${vol(now)} 들어 있다. 들이가 1 L인 바가지에 물을 가득 담아 부을 때, 양동이를 가득 채우려면 몇 번 부어야 하는가?`, k, {
        unit: '번', explain: `더 부어야 하는 물은 ${vol(cap)} - ${vol(now)} = ${k} L이다. 1 L씩 ${k}번 부어야 한다.`, facts: { calc: [[`(${X(cap)}-${X(now)})/1000/1`, 0]], unseen: [1000] }
      });
    })
  ]);

  // ── 무게 비교하기 ───────────────────────────────────────────────
  B.addTypes('3-2-5', 'wcmp', [
    T('wc-tilt', '양팔저울이 기운 쪽으로 무게 비교하기', '①60 ②56 ③61 심47', (d) => {
      const pair = d.pick([['풀', '지우개'], ['가위', '필통'], ['당근', '고구마'], ['귤', '키위']]), down = d.bool(), heavy = d.bool(), heavier = down ? 1 : 0, want = heavy ? heavier : 1 - heavier;
      return C(`양팔저울의 한쪽 접시에 ${josa(pair[0], '을/를')}, 다른 쪽 접시에 ${josa(pair[1], '을/를')} 올렸더니 ${josa(pair[1], '을/를')} 올린 쪽이 ${down ? '아래로 내려갔다' : '위로 올라갔다'}. 더 ${heavy ? '무거운' : '가벼운'} 것은?`, [pair[0], pair[1], '알 수 없다'], want, {
        explain: `양팔저울에서는 더 무거운 쪽이 아래로 내려간다. ${josa(pair[heavier], '이/가')} ${pair[1 - heavier]}보다 무겁다.`, facts: { truth: [0, 1, 2].map((i) => i === want), want: true }
      });
    }),
    T('wc-two-scales', '저울에 두 번 올려 세 물건 비교하기', '①61 ①62 ②57 ②58 ③62', (d) => {
      // 가운데 무게인 공이 두 번 다 올라가야 차례가 정해진다.
      const names = ['빨간 공', '파란 공', '노란 공'], rank = d.shuffle([1, 2, 3]), by = [3, 2, 1].map((r) => rank.indexOf(r));   // rank[i]: 공 i 의 무게 차례(3이 가장 무겁다)
      const weigh = (x, y) => { const [a, b] = d.bool() ? [x, y] : [y, x]; return `${josa(names[a], '과/와')} ${josa(names[b], '을/를')} 올렸더니 ${names[rank[a] > rank[b] ? a : b]} 쪽이 내려갔`; };
      const told = d.shuffle([weigh(by[0], by[1]), weigh(by[1], by[2])]), heavy = d.bool();
      return C(`빨간 공, 파란 공, 노란 공의 무게를 양팔저울로 비교하였다. ${told[0]}고, ${told[1]}다. 가장 ${heavy ? '무거운' : '가벼운'} 공은?`, names, heavy ? by[0] : by[2], {
        explain: `내려간 쪽이 더 무겁다. ${josa(names[by[0]], '이/가')} ${names[by[1]]}보다 무겁고, ${josa(names[by[1]], '이/가')} ${names[by[2]]}보다 무겁다.`,
        facts: { rank: { values: rank, nth: heavy ? 1 : 3 } }
      });
    }),
    T('wc-times', '같은 물건의 수로 몇 배인지 구하기', '①65 심50', (d) => {
      const k = d.int(3, 9), n = d.int(2, 6);
      return N(`저울로 무게를 재었더니 필통은 클립 ${k * n}개, 지우개는 클립 ${k}개와 무게가 같았다. 필통의 무게는 지우개의 무게의 몇 배인가?`, n, {
        unit: '배', explain: `같은 클립으로 재었으므로 클립의 수로 비교한다. ${k * n} ÷ ${k} = ${n}`, facts: { calc: [[`${k * n}/${k}`, 0]] }
      });
    }),
    T('wc-one-heavier', '수평인 저울에서 한 개가 더 무거운 것', '①66 ②61 심53', (d) => {
      // 개수가 많은 쪽이 무겁다고 여기는 아이는 많이 올린 것을 고른다.
      const [a, b] = d.until(() => [d.int(2, 7), d.int(2, 7)], ([x, y]) => x !== y);
      return C(`양팔저울의 한쪽 접시에 감자 ${a}개를, 다른 쪽 접시에 고구마 ${b}개를 올렸더니 저울이 어느 쪽으로도 기울지 않았다. 감자끼리, 고구마끼리 무게가 같을 때, 한 개의 무게가 더 무거운 것은?`, ['감자', '고구마', '한 개의 무게는 서로 같다'], a < b ? 0 : 1, {
        explain: `감자 ${a}개와 고구마 ${b}개의 무게가 같다. 같은 무게를 더 적은 개수로 만드는 ${a < b ? '감자' : '고구마'} 한 개가 더 무겁다.`, facts: { choose: { exprs: [String(a), String(b)], rule: 'min' } }
      });
    }),
    T('wc-unit-heavier', '같은 물건을 잰 세 가지 단위의 한 개 무게', '①68 ②62 심52', (d) => {
      const counts = d.until(() => [d.int(8, 30), d.int(8, 30), d.int(8, 30)], (c) => new Set(c).size === 3), names = ['공깃돌', '동전', '바둑돌'], best = counts.indexOf(Math.min(...counts));
      return C(`저울로 필통의 무게를 재었더니 공깃돌로는 ${counts[0]}개, 동전으로는 ${counts[1]}개, 바둑돌로는 ${counts[2]}개와 무게가 같았다. 공깃돌끼리, 동전끼리, 바둑돌끼리 무게가 같을 때, 한 개의 무게가 가장 무거운 것은?`, names, best, {
        explain: `같은 필통의 무게를 만드는 데 든 개수가 적을수록 한 개가 무겁다. 가장 적은 ${counts[best]}개가 든 ${josa(names[best], '이/가')} 가장 무겁다.`, facts: { choose: { exprs: counts.map(String), rule: 'min' } }
      });
    })
  ]);

  // ── 무게의 단위 kg, g, t ────────────────────────────────────────
  B.addTypes('3-2-5', 'wunit', [
    T('wu-name', '무게 읽기', '①71 ②64 ③71', (d) => {
      const [a, t, c, e] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]), b = d.int(2, 9) * 100;
      const rows = d.shuffle(d.bool()
        ? [[`${a} kg ${b} g → ${a} 킬로그램 ${b} 그램`, true], [`${t} t → ${t} 킬로그램`, false], [`${c * 100} g → ${c * 100} 킬로그램`, false], [`${e} kg → ${e} 그램`, false]]
        : [[`${t} t → ${t} 톤`, true], [`${a} kg ${b} g → ${a} 그램 ${b} 킬로그램`, false], [`${c * 100} g → ${c * 100} 톤`, false], [`${e} kg → ${e} 그램`, false]]);
      return C('무게를 바르게 읽은 것은?', rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), { explain: 'kg은 킬로그램, g은 그램, t은 톤이라고 읽는다.', facts: { truth: rows.map(([, ok]) => ok), want: true } });
    }),
    T('wu-read-pick', '저울의 눈금을 g으로 나타낸 것 고르기', '①74 ③73 심57', (d) => {
      const value = d.pick([1200, 1300, 1400, 1600, 1700, 1800, 1900]), r = value - 1000;   // 1100 은 바늘이 「1 kg」 글자를 가린다
      const rows = d.shuffle([[`${value} g`, String(value)], [`${1000 + r / 10} g`, String(1000 + r / 10)], [`1 kg ${r / 10} g`, `1*1000+${r / 10}`], [`${value / 100} kg`, `${value / 100}*1000`]]);
      return C('저울에 올린 물건의 무게를 바르게 나타낸 것은?', rows.map(([text]) => text), rows.findIndex(([text]) => text === `${value} g`), {
        figure: dial(2000, 100, 500, value), explain: `바늘이 1 kg에서 작은 눈금 ${r / 100}칸 더 간 곳을 가리키므로 ${wt(value)}이다. 1 kg은 1000 g이므로 ${wt(value)}은 ${value} g이다.`,
        facts: { choose: { exprs: rows.map(([, text]) => text), rule: 'equals', target: value }, unseen: [1000] }
      });
    }),
    T('wu-say-max', '여러 가지로 나타낸 세 무게 비교하기', '③81 덧', (d) => {
      // 1200 g, 「1 kg보다 20 g 더 무거운 무게」, 1 kg 2 g: 나타낸 꼴이 서로 다르다.
      const who = d.shuffle(NAMES).slice(0, 3), k = d.int(1, 5), h = d.int(2, 9), heavy = d.bool(), rest = d.shuffle([h * 100, h * 10, h]), values = rest.map((r) => k * 1000 + r);
      const shown = [`${values[0]} g`, `${k} kg보다 ${rest[1]} g 더 무거운 무게`, `${k} kg ${rest[2]} g`], exprs = [String(values[0]), `${k}*1000+${rest[1]}`, `${k}*1000+${rest[2]}`];
      return C(`세 사람이 딴 사과의 무게를 나타낸 것이다. 사과를 가장 ${heavy ? '많이' : '적게'} 딴 사람은?`, who, values.indexOf(heavy ? Math.max(...values) : Math.min(...values)), {
        figure: lines(shown.map((text, i) => `${who[i]}: ${text}`)), explain: `모두 g으로 나타내면 ${who.map((w, i) => `${w} ${values[i]} g`).join(', ')}이다.`,
        facts: { choose: { exprs, rule: heavy ? 'max' : 'min' }, unseen: [1000] }
      });
    }),
    T('wu-thousand', '단위 사이의 관계', '①77 ②12 ②66 ③11 ③71', () => N('□ 안에 공통으로 들어갈 수는?', 1000, {
      figure: lines([`1 L = ${box()} mL`, `1 kg = ${box()} g`, `1 t = ${box()} kg`]), explain: '1 L는 1000 mL, 1 kg은 1000 g, 1 t은 1000 kg이다.', facts: { calc: [['1*1000', 0]], unseen: [1000] }
    })),
    T('wu-steps', '몇 kg 몇 g을 몇 g으로 바꾸는 과정', '②69', (d) => {
      const a = d.int(2, 9), b = d.pick([20, 30, 40, 60, 70, 80, 90, 5, 8]);
      return M('무게를 g으로 나타내는 과정이다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a * 1000 }, { label: LABELS[1], answer: a * 1000 + b }], {
        figure: lines([`${a} kg ${b} g = ${a} kg + ${b} g`, `= ${box(LABELS[0])} g + ${b} g`, `= ${box(LABELS[1])} g`]),
        explain: `${a} kg은 ${a * 1000} g이다. ${a * 1000} g보다 ${b} g 더 무거운 무게는 ${a * 1000 + b} g이다.`, facts: { calc: [[`${a}*1000`, 0], [`${a}*1000+${b}`, 1]], unseen: [1000] }
      });
    }),
    T('wu-ton-mixed', '몇 t 몇 kg과 몇 kg으로 나타낸 무게 바꾸기', '①81 ②81 ③76', (d) => {
      const a = d.int(2, 8), b = d.int(1, 9) * 100 + d.int(1, 9) * 10, c = d.int(2, 9) * 1000 + d.pick([20, 30, 40, 50, 60, 70, 80, 90]);
      return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a * 1000 + b }, { label: LABELS[1], answer: hi(c) }, { label: LABELS[2], answer: lo(c) }], {
        figure: lines([`${a} t ${b} kg = ${box(LABELS[0])} kg`, `${c} kg = ${box(LABELS[1])} t ${box(LABELS[2])} kg`]),
        explain: `1 t은 1000 kg이다. ${a} t ${b} kg은 ${a * 1000} kg보다 ${b} kg 더 무거운 ${a * 1000 + b} kg이고, ${c} kg은 ${hi(c) * 1000} kg보다 ${lo(c)} kg 더 무거운 ${hi(c)} t ${lo(c)} kg이다.`,
        facts: { calc: [[`${a}*1000+${b}`, 0], [`(${c}-${c}%1000)/1000`, 1], [`${c}%1000`, 2]], unseen: [1000] }
      });
    }),
    T('wu-right', '무게를 바르게 나타낸 것 찾기', '①82 ②72 ③80 심58 덧', (d) => {
      const [a, b, k, t] = d.shuffle([2, 3, 4, 5, 6, 7, 8, 9]), z = d.int(2, 9) * 10, v = b * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10;
      const rows = d.shuffle([
        [d.bool() ? `${v} g = ${wt(v)}` : `${wt(v)} = ${v} g`, X(v), v],
        [`${a} kg ${z} g = ${a * 1000 + z * 10} g`, `${a}*1000+${z}`, a * 1000 + z * 10],   // 0을 빠뜨리고 이어 쓴 것
        [`${k * 1000} g = ${k} t`, String(k * 1000), k * 1000 * 1000],                      // 1 t을 1000 g으로 안 것
        [`${t} t = ${t * 100} kg`, `${t}*1000`, t * 100]                                    // 1 t을 100 kg으로 안 것
      ]);
      return C('무게를 바르게 나타낸 것은?', rows.map(([text]) => text), rows.findIndex(([, , said]) => said === v), {
        explain: `1 kg은 1000 g이고 1 t은 1000 kg이다. ${a} kg ${z} g은 ${a * 1000 + z} g, ${k * 1000} g은 ${k} kg, ${t} t은 ${t * 1000} kg이다.`,
        facts: { claimed: rows.map(([, text, said]) => [text, said]), claimedWant: true, unseen: [1000] }
      });
    }),
    T('wu-ton-compare', 'kg과 t으로 나타낸 두 무게의 크기 비교', '①84 ②76', (d) => {
      // 900 kg 과 9 t 처럼 수만 보면 틀리는 짝을 섞는다.
      const t = d.int(2, 9), kg = d.pick([t * 1000 + d.int(1, 9) * 100, t * 1000, t * 100, (t - 1) * 1000 + 900]), left = d.bool(), values = left ? [kg, t * 1000] : [t * 1000, kg];
      return C('두 무게의 크기를 비교할 때, ○ 안에 알맞은 것은?', SIGNS, sign(values[0], values[1]), {
        figure: left ? versus(`${kg} kg`, `${t} t`) : versus(`${t} t`, `${kg} kg`), explain: kg === t * 1000 ? `${t} t은 ${t * 1000} kg이므로 두 무게는 같다.` : `${t} t은 ${t * 1000} kg이다. ${kg} kg은 ${t * 1000} kg보다 ${kg > t * 1000 ? '무겁다' : '가볍다'}.`,
        facts: { choose: { exprs: left ? [String(kg), `${t}*1000`] : [`${t}*1000`, String(kg)], rule: 'compare' }, unseen: [1000] }
      });
    }),
    T('wu-order', 'g, kg, t이 섞인 세 무게를 차례대로 늘어놓기', '①86 ②77 ②79 ③83 ③84 심60', (d) => {
      const t = d.int(2, 8), h = d.int(2, 9) * 100, kg = d.pick([t * 1000 + d.int(1, 9) * 100, (t - 1) * 1000 + d.int(1, 9) * 100]);
      const items = d.shuffle([[`${t} t`, `${t}*1000*1000`, t * 1000000], [`${kg} kg`, `${kg}*1000`, kg * 1000], [`${t} kg ${h} g`, `${t}*1000+${h}`, t * 1000 + h]]), heavy = d.bool();
      const right = [0, 1, 2].sort((x, y) => (heavy ? items[y][2] - items[x][2] : items[x][2] - items[y][2])), orders = orderOptions(d, right, [right.slice().reverse()]);
      return C(`무게가 ${heavy ? '무거운' : '가벼운'} 것부터 차례로 기호를 쓴 것은?`, orders.map((o) => o.map((i) => LABELS[i]).join(', ')), where(orders, right), {
        figure: tagged(items.map(([text]) => text)), explain: `${t} t은 ${t * 1000} kg이고, ${t} kg ${h} g은 ${t + 1} kg보다 가볍다. ${heavy ? '무거운' : '가벼운'} 것부터 쓰면 ${right.map((i) => LABELS[i]).join(', ')} 차례이다.`,
        facts: { choose: { exprs: items.map(([, text]) => text), rule: heavy ? 'descending' : 'ascending', orders }, unseen: [1000] }
      });
    }),
    T('wu-limit', '한도 안의 무게 고르기', '①87', (d) => {
      const cap = d.pick([5, 8, 10]), mixed = d.bool(), show = ([v, m]) => (m ? wt(v) : v + ' g');
      const rows = d.shuffle([[cap * 1000 - d.int(1, 5) * 100, mixed], [cap * 1000 + d.int(1, 4) * 100, !mixed], [cap * 1000 + d.int(2, 9) * 10, mixed], [(cap + d.int(1, 3)) * 1000, true]]);
      const values = rows.map(([v]) => v), hit = values.findIndex((v) => v <= cap * 1000);
      return C(`${cap} kg까지 실을 수 있는 수레에 짐 하나를 실으려고 한다. 실을 수 있는 짐의 무게는?`, rows.map(show), hit, {
        explain: `${cap} kg은 ${cap * 1000} g이다. ${show(rows[hit])}은 ${cap * 1000} g보다 가볍고, 나머지는 모두 ${cap * 1000} g보다 무겁다.`, facts: { only: { values, test: 'atMost', target: cap * 1000 } }
      });
    }),
    T('wu-units', '들이의 단위와 무게의 단위 가려내기', '①125 ③85', (d) => {
      const weight = d.bool();
      const rows = d.shuffle(weight ? [['g, kg, t', true], ['g, kg, mL', false], ['L, kg, t', false], ['g, cm, t', false]] : [['mL, L', true], ['mL, kg', false], ['g, L', false], ['cm, L', false]]);
      return C(`${weight ? '무게' : '들이'}의 단위끼리 모은 것은?`, rows.map(([text]) => text), rows.findIndex(([, ok]) => ok), {
        explain: 'mL와 L는 들이의 단위이고, g과 kg과 t은 무게의 단위이다. cm는 길이의 단위이다.', facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    }),
    T('wu-ton-times', '같은 무게 여러 개를 t으로 나타내기', '③87', (d) => {
      const [a, b] = d.pick([[40, 50], [20, 50], [50, 40], [50, 60], [25, 40], [80, 50], [50, 80], [25, 80]]);
      return N(`무게가 ${a} kg인 상자 ${b}개의 무게는 모두 몇 t인가?`, a * b / 1000, {
        unit: 't', explain: `${a} × ${b} = ${a * b}(kg)이고 ${a * b} kg은 ${a * b / 1000} t이다.`, facts: { calc: [[`${a}*${b}/1000`, 0]], unseen: [1000] }
      });
    })
  ]);

  // ── 무게 어림하기 ───────────────────────────────────────────────
  B.addTypes('3-2-5', 'west', [
    T('we-unit', '무게에 알맞은 단위 쓰기', '①91 ②82 ③90 심63', (d) => {
      // 수는 같고 단위만 다른 세 물건
      const [n, light, middle, heavy] = d.pick([[5, '연필 한 자루', '고양이 한 마리', '코끼리 한 마리'], [10, '볼펜 한 자루', '자전거 한 대', '버스 한 대'], [1, '클립 한 개', '두꺼운 사전 한 권', '작은 자동차 한 대']]);
      const rows = d.shuffle([[light, 'g'], [middle, 'kg'], [heavy, 't']]), right = rows.map(([, unit]) => unit).join(', ');
      const options = d.shuffle([right].concat(d.shuffle(PERMS.map((o) => o.map((i) => ['g', 'kg', 't'][i]).join(', ')).filter((text) => text !== right)).slice(0, 3)));
      return C('㉠, ㉡, ㉢에 알맞은 단위를 차례로 쓴 것은?', options, options.indexOf(right), {
        figure: lines(rows.map(([thing], i) => `${thing}의 무게는 약 ${n} ${box(LABELS[i])}이다.`)),
        explain: `${light}의 무게는 약 ${n} g, ${middle}의 무게는 약 ${n} kg, ${heavy}의 무게는 약 ${n} t이다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('we-thing', '무게에 알맞은 물건 고르기', '①93 ②83 ③92 ③94 심66', (d) => {
      const rows = d.shuffle([W_TINY[0], d.pick(W_HAND), d.pick(W_LOAD), d.pick(W_HUGE)]), at = d.int(0, 3), [thing, n, unit] = rows[at];
      return C(`무게가 약 ${n} ${unit}인 것은?`, rows.map(([each]) => each), at, { explain: `${thing}의 무게는 약 ${n} ${unit}이다.`, facts: { truth: rows.map((_, i) => i === at), want: true } });
    }),
    T('we-heavier', '기준보다 무거운(가벼운) 것 찾기', '①94 ②84 ②85 ③91 심65', (d) => {
      const ton = d.bool();   // 1 t보다 무거운 것 하나, 또는 1 kg보다 가벼운 것 하나
      const rows = d.shuffle(ton ? d.shuffle(W_HAND.concat(W_LOAD)).slice(0, 3).concat([d.pick(W_HUGE)]) : d.shuffle(W_LOAD.concat(W_HUGE)).slice(0, 3).concat([d.pick(W_TINY.concat(W_HAND))]));
      const hit = rows.map(([, , unit]) => (ton ? unit === 't' : unit === 'g')), [thing, n, unit] = rows[hit.indexOf(true)];
      return C(`무게가 ${ton ? '1 t보다 무거운' : '1 kg보다 가벼운'} 것은?`, rows.map(([each]) => each), hit.indexOf(true), {
        explain: `${thing}의 무게는 약 ${n} ${unit}이다. 나머지는 모두 ${ton ? '1 t보다 가볍다' : '1 kg보다 무겁다'}.`, facts: { truth: hit, want: true }
      });
    }),
    T('we-sum', '여러 물건의 무게를 합하여 어림하기', '①96 ③97 심69 덧', (d) => {
      const a = d.pick([400, 500]), m = d.int(3, 4), n = d.int(1, 3), total = a * m + 100 * n;
      return M(`가방의 무게는 무게가 ${a} g인 책 ${m}권과 무게가 100 g인 공책 ${n}권을 합한 무게와 비슷하다. 가방의 무게는 약 몇 kg 몇 g인가?`, [{ answer: hi(total), unit: 'kg', lead: '약' }, { answer: lo(total), unit: 'g' }], {
        explain: `책 ${m}권은 ${a} × ${m} = ${a * m}(g), 공책 ${n}권은 100 × ${n} = ${100 * n}(g)이다. ${a * m} + ${100 * n} = ${total}(g)이고 ${total} g은 ${wt(total)}이다.`, facts: { calc: two(`${a}*${m}+100*${n}`), unseen: [1000] }
      });
    }),
    T('we-judge', '무게를 잘못 어림한 사람 찾기', '①100 ②88 덧', (d) => {
      // 셈은 500 g인데 5 kg이라고 말한 사람을 찾는다. 나머지 둘은 여러 물건을 합하거나 같은 것 여러 개로 바르게 어림하였다.
      const who = d.shuffle(NAMES).slice(0, 3), [g1, n1] = d.pick([[50, 10], [40, 10], [60, 10], [30, 20]]), [a, m, b] = d.pick([[200, 2, 100], [300, 2, 100], [200, 3, 50]]), [g3, n3] = d.pick([[500, 4], [250, 8], [400, 5], [500, 6]]);
      const rows = d.shuffle([
        { text: `무게가 ${g1} g인 공책 ${n1}권의 무게와 비슷하므로 위인전의 무게는 약 ${g1 * n1 / 100} kg이다.`, expr: `${g1}*${n1}`, said: g1 * n1 * 10 },
        { text: `무게가 ${a} g인 사과 ${m}개와 무게가 ${b} g인 귤 1개를 합한 무게와 비슷하므로 배의 무게는 약 ${a * m + b} g이다.`, expr: `${a}*${m}+${b}*1`, said: a * m + b },
        { text: `무게가 ${g3} g인 오렌지 ${n3}개의 무게와 비슷하므로 멜론의 무게는 약 ${g3 * n3 / 1000} kg이다.`, expr: `${g3}*${n3}`, said: g3 * n3 }
      ]);
      return C('세 사람이 무게를 어림한 것이다. 잘못 어림한 사람은?', who, rows.findIndex((row) => row.said === g1 * n1 * 10), {
        figure: lines(rows.map((row, i) => `${who[i]}: ${row.text}`)), explain: `${g1} × ${n1} = ${g1 * n1}(g)이므로 위인전의 무게는 약 ${g1 * n1} g이다.`,
        facts: { claimed: rows.map((row) => [row.expr, row.said]), claimedWant: false }
      });
    }),
    T('we-table', '어림한 무게와 잰 무게의 차 비교하기', '③99', (d) => {
      const things = ['필통', '동화책', '가방'], real = [d.int(25, 45) * 10, d.int(60, 85) * 10, 1000 + d.int(0, 5) * 100];
      const gaps = d.shuffle([40, 50, 70, 90, 110, 130, 150, 180]).slice(0, 3), est = real.map((r, i) => r + (d.bool() ? 1 : -1) * gaps[i]), best = gaps.indexOf(Math.min(...gaps));
      return C('세 물건의 무게를 어림한 다음 저울로 재어 나타낸 표이다. 잰 무게에 가장 가깝게 어림한 물건은?', things, best, {
        figure: table(['물건', '어림한 무게', '잰 무게'], things.map((thing, i) => [thing, wt(est[i]), wt(real[i])])),
        explain: `어림한 무게와 잰 무게의 차는 ${things.map((thing, i) => `${thing} ${gaps[i]} g`).join(', ')}이다. 차가 가장 작은 ${josa(things[best], '을/를')} 가장 가깝게 어림하였다.`,
        facts: { choose: { exprs: real.map((r, i) => `${X(Math.max(r, est[i]))}-${X(Math.min(r, est[i]))}`), rule: 'min' }, unseen: [1000] }
      });
    }),
    T('we-dial-about', '저울의 눈금을 보고 약 몇 kg인지 어림하기', '②91', (d) => {
      const value = d.pick([800, 1200, 1400, 1600, 2400, 2600, 2800, 3200]), k = Math.round(value / 1000);   // 1800·2200 은 바늘이 「2 kg」 글자를 가린다
      return C('저울에 올린 물건의 무게는 약 몇 kg인가?', ['약 1 kg', '약 2 kg', '약 3 kg'], k - 1, {
        figure: dial(4000, 200, 1000, value), explain: `작은 눈금 한 칸은 200 g이므로 바늘은 ${wt(value)}을 가리킨다. ${k} kg에 가장 가까우므로 약 ${k} kg이다.`,
        facts: { choose: { exprs: ['1*1000', '2*1000', '3*1000'], rule: 'nearest', target: value }, unseen: [1000] }
      });
    })
  ]);

  // ── 무게의 덧셈과 뺄셈 ──────────────────────────────────────────
  const fine = (d, top) => d.int(1, top) * 1000 + d.int(11, 89) * 10;   // 작은 단위의 수가 10의 배수인 무게
  B.addTypes('3-2-5', 'wcalc', [
    T('wcalc-add0', '받아올림이 없는 덧셈', '①102 ②93 ③100', (d) => {
      const [a, b] = d.until(() => [fine(d, 5), fine(d, 4)], ([x, y]) => lo(x) + lo(y) < 1000 && lo(x) !== lo(y) && lo(x + y) % 100 !== 0);
      return M('다음을 계산하시오.', ask(a + b, 'g', 'kg'), { figure: timeColumn(cells(a, 'g', 'kg'), '+', cells(b, 'g', 'kg')), explain: `kg은 kg끼리, g은 g끼리 더한다. ${wt(a + b)}`, facts: Object.assign({ calc: two(`${X(a)}+${X(b)}`), unseen: [1000] }, rule('+', a, b, false)) });
    }),
    T('wcalc-sub0', '받아내림이 없는 뺄셈', '①103 ②95 ③101', (d) => {
      const [a, b] = d.until(() => [fine(d, 8), fine(d, 4)], ([x, y]) => hi(x) > hi(y) && lo(x) > lo(y) && lo(x - y) % 100 !== 0);
      return M('다음을 계산하시오.', ask(a - b, 'g', 'kg'), { figure: timeColumn(cells(a, 'g', 'kg'), '-', cells(b, 'g', 'kg')), explain: `kg은 kg끼리, g은 g끼리 뺀다. ${wt(a - b)}`, facts: Object.assign({ calc: two(`${X(a)}-${X(b)}`), unseen: [1000] }, rule('-', a, b, false)) });
    }),
    T('wcalc-room', '문장제: 몇 kg에서 몇 kg 몇 g 빼기', '①106 ①117 ②105 ③116', (d) => {
      const cap = d.int(8, 15), a = d.int(3, cap - 2) * 1000 + d.int(3, 18) * 50, r = cap * 1000 - a;
      return M(`${cap} kg까지 담을 수 있는 여행 가방에 짐을 ${wt(a)} 담았다. 이 가방에 더 담을 수 있는 짐은 몇 kg 몇 g인가?`, ask(r, 'g', 'kg'), {
        explain: `${cap} kg을 ${cap - 1} kg 1000 g으로 바꾸어 계산한다. ${cap - 1} kg 1000 g - ${wt(a)} = ${wt(r)}`, facts: { calc: two(`${cap}*1000-${X(a)}`), unseen: [1000] }
      });
    }),
    T('wcalc-fix', '단위를 잘못 바꾼 계산 바로잡기', '덧 ①109', (d) => {
      // 1050 g 을 1 kg 500 g 으로 바꾼 계산
      const z = d.int(2, 6), b = 1000 + z * 10, a = d.int(1, 4) * 1000 + d.int(2, 18 - z * 2) * 50, wrong = a + 1000 + z * 100;
      return M('다음은 잘못 계산한 것이다. 바르게 계산하면 몇 kg 몇 g인가?', ask(a + b, 'g', 'kg'), {
        figure: lines([`${wt(a)} + ${b} g`, `= ${wt(a)} + 1 kg ${z * 100} g`, `= ${wt(wrong)}`]), explain: `${b} g은 1 kg ${z * 10} g이다. ${wt(a)} + 1 kg ${z * 10} g = ${wt(a + b)}`,
        facts: { calc: two(`${X(a)}+${b}`), unseen: [1000], wrongAmount: wrong }
      });
    }),
    T('wcalc-blank-add', '덧셈식의 빈칸(받아올림)', '①49 ①113 ③45 ③105 심74', (d) => {
      const [a, b] = addPair(d, true), s = a + b;
      return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: lo(a) }, { label: LABELS[1], answer: hi(b) }], {
        figure: timeColumn([`${hi(a)} kg`, `${box(LABELS[0])} g`], '+', [`${box(LABELS[1])} kg`, `${lo(b)} g`], cells(s, 'g', 'kg')),
        explain: `g끼리의 계산 결과 ${josa(lo(s), '이/가')} ${lo(b)}보다 작으므로 받아올림이 있다. ㉠ + ${lo(b)} = ${1000 + lo(s)}에서 ㉠은 ${lo(a)}이다. kg끼리의 계산은 1 + ${hi(a)} + ㉡ = ${hi(s)}이므로 ㉡은 ${hi(b)}이다.`,
        facts: { calc: [[`1000+${lo(s)}-${lo(b)}`, 0], [`${hi(s)}-${hi(a)}-1`, 1]], unseen: [1000, 1] }
      });
    }),
    T('wcalc-missing', '더하는 무게 구하기', '③106 심74', (d) => {
      const [c, b] = subPair(d, true), x = c - b;
      return N('□ 안에 알맞은 수는?', x, {
        figure: lines([`${box()} g + ${wt(b)} = ${wt(c)}`]), explain: `${wt(c)} - ${wt(b)} = ${wt(x)}이고 ${wt(x)}은 ${x} g이다.`, facts: { calc: [[`${X(c)}-${X(b)}`, 0]], unseen: [1000] }
      });
    }),
    T('wcalc-max3', '세 계산 결과 가운데 가장 무거운(가벼운) 것', '①114 ②100 ③111 ③112 심77 덧', (d) => {
      const base = d.int(4, 7) * 1000 + 500, results = d.until(() => [0, 1, 2].map(() => base + d.int(-6, 6) * 50), (list) => new Set(list).size === 3), kinds = d.shuffle(['g', '+', '-']), heavy = d.bool();
      const rows = results.map((r, i) => (kinds[i] === 'g' ? [`${r} g`, String(r)] : (([a, b]) => [`${wt(a)} ${kinds[i] === '+' ? '+' : '−'} ${wt(b)}`, `${X(a)}${kinds[i]}${X(b)}`])(near(d, kinds[i], r))));
      return C(`무게가 가장 ${heavy ? '무거운' : '가벼운'} 것은?`, LABELS.slice(0, 3), results.indexOf(heavy ? Math.max(...results) : Math.min(...results)), {
        figure: tagged(rows.map(([text]) => text)), explain: `모두 g으로 나타내면 ${results.map((r, i) => `${LABELS[i]} ${r} g`).join(', ')}이다.`,
        facts: { choose: { exprs: rows.map(([, text]) => text), rule: heavy ? 'max' : 'min' }, unseen: [1000] }
      });
    }),
    T('wcalc-ends', '가장 무거운 것과 가장 가벼운 것의 차', '①51 ①115 ②44 ③44 ③113 심33 심78 덧', (d) => {
      // 8 kg, 8100 g(또는 7850 g), 1 kg 800 g, 1650 g: 단위를 맞추어야 가장 무거운 것과 가장 가벼운 것이 보인다.
      const top = d.int(5, 8), low = d.int(1, 3);
      const items = d.until(() => d.shuffle([[top * 1000, true], [d.bool() ? top * 1000 + d.int(1, 4) * 50 : (top - 1) * 1000 + d.int(16, 19) * 50, false], [low * 1000 + d.int(4, 9) * 100, true], [low * 1000 + d.int(7, 19) * 50, false]]),
        (list) => { const v = list.map(([x]) => x); return new Set(v).size === 4 && lo(Math.max(...v) - Math.min(...v)) !== 0; });
      const values = items.map(([v]) => v), max = Math.max(...values), min = Math.min(...values), text = ([v, mixed]) => (mixed ? wt(v) : v + ' g'), form = ([v, mixed]) => (mixed ? X(v) : String(v));
      return M('㉠, ㉡, ㉢, ㉣ 가운데 가장 무거운 무게와 가장 가벼운 무게의 차는 몇 kg 몇 g인가?', ask(max - min, 'g', 'kg'), {
        figure: tagged(items.map(text)), explain: `모두 g으로 나타내면 ${values.map((v, i) => `${LABELS[i]} ${v} g`).join(', ')}이다. 가장 무거운 무게는 ${max} g, 가장 가벼운 무게는 ${min} g이므로 차는 ${wt(max - min)}이다.`,
        facts: { calc: two(`${form(items[values.indexOf(max)])}-${form(items[values.indexOf(min)])}`), ends: values, unseen: [1000] }
      });
    }),
    T('wcalc-sum-mixed', '문장제: 단위가 섞인 두 무게의 합', '①109 ①116 심80 덧', (d) => {
      const who = d.pick(NAMES), [a, b] = d.until(() => [amount(d, 4), d.int(22, 58) * 50], ([x, y]) => y % 1000 !== 0 && lo(x) + lo(y) > 1000);
      return M(`${name(who, '은/는')} 산에서 밤 ${wt(a)}과 도토리 ${b} g을 주웠다. ${name(who, '이/가')} 주운 밤과 도토리의 무게는 모두 몇 kg 몇 g인가?`, ask(a + b, 'g', 'kg'), {
        explain: `${b} g은 ${wt(b)}이다. ${wt(a)} + ${wt(b)} = ${wt(a + b)}`, facts: { calc: two(`${X(a)}+${b}`), unseen: [1000] }
      });
    }),
    T('wcalc-lighter', '문장제: 「~보다 몇 g 더 가볍다」', '②104 ③109', (d) => {
      const [a, b] = d.until(() => [d.int(3, 6) * 1000 + d.int(2, 12) * 50, d.int(22, 38) * 50], ([x, y]) => y % 1000 !== 0 && lo(x) < lo(y) && x - y >= 1000);
      return M(`가 상자의 무게는 ${wt(a)}이고, 나 상자는 가 상자보다 ${b} g 더 가볍다. 나 상자의 무게는 몇 kg 몇 g인가?`, ask(a - b, 'g', 'kg'), {
        explain: `${b} g은 ${wt(b)}이다. ${wt(a)} - ${wt(b)} = ${wt(a - b)}`, facts: { calc: two(`${X(a)}-${b}`), unseen: [1000] }
      });
    }),
    T('wcalc-diff-g', '문장제: 두 무게의 차를 g으로 나타내기', '①117 ②106 ③108 ③110', (d) => {
      const [a, b] = subPair(d, true);
      return N(`옥수수 한 상자의 무게는 ${wt(a)}이고, 당근 한 상자의 무게는 ${wt(b)}이다. 옥수수 한 상자는 당근 한 상자보다 몇 g 더 무거운가?`, a - b, {
        unit: 'g', explain: `${wt(a)} - ${wt(b)} = ${wt(a - b)}이고 ${wt(a - b)}은 ${a - b} g이다.`, facts: { calc: [[`${X(a)}-${X(b)}`, 0]], unseen: [1000] }
      });
    }),
    T('wcalc-double', '문장제: 무게가 같은 것 두 개', '②52 ②103 ③120 심16', (d) => {
      const a = d.int(1, 4) * 1000 + d.int(11, 19) * 50;
      return M(`수박 한 통의 무게는 ${wt(a)}이다. 무게가 같은 수박 2통의 무게는 모두 몇 kg 몇 g인가?`, ask(a * 2, 'g', 'kg'), {
        explain: `${wt(a)} + ${wt(a)} = ${wt(a * 2)}`, facts: { calc: two(`${X(a)}*2`), unseen: [1000] }
      });
    }),
    T('wcalc-sum3', '문장제: 세 무게의 합', '①120 ③51 ③117 심82 덧', (d) => {
      const [basket, a, b] = d.until(() => [d.int(4, 9) * 50, d.int(1, 3) * 1000 + d.int(2, 9) * 100, d.int(5, 18) * 50], ([x, y, z]) => lo(y) + z + x > 1000 && lo(x + y + z) !== 0);
      return M(`무게가 ${basket} g인 바구니에 복숭아 ${wt(a)}과 자두 ${b} g을 담았다. 복숭아와 자두를 담은 바구니의 무게는 몇 kg 몇 g인가?`, ask(basket + a + b, 'g', 'kg'), {
        explain: `${wt(a)} + ${b} g = ${wt(a + b)}, ${wt(a + b)} + ${basket} g = ${wt(basket + a + b)}`, facts: { calc: two(`${basket}+${X(a)}+${b}`), unseen: [1000] }
      });
    }),
    T('wcalc-plate', '저울의 눈금에서 빈 그릇의 무게 빼기', '②108 ③115 심90', (d) => {
      const total = d.pick([1600, 1700, 1800, 1900]), plate = d.pick([300, 400, 500]), r = total - plate;
      return M(`무게가 ${plate} g인 빈 접시에 방울토마토를 담아 저울에 올렸더니 그림과 같았다. 방울토마토만의 무게는 몇 kg 몇 g인가?`, ask(r, 'g', 'kg'), {
        figure: dial(2000, 100, 500, total), explain: `저울의 바늘은 ${wt(total)}을 가리킨다. ${wt(total)} - ${plate} g = ${wt(r)}`, facts: { calc: two(`${total / 100}*100-${plate}`), unseen: [1000] }
      });
    }),
    T('wcalc-ton3', '문장제: kg끼리 더하여 t으로 나타내기', '②98 ③86', (d) => {
      const total = d.pick([2000, 3000]), [a, b] = d.until(() => [d.int(3, 14) * 100, d.int(3, 14) * 100], ([x, y]) => { const z = total - x - y; return z >= 300 && z <= 1400 && new Set([x, y, z]).size === 3 && [x, y, z].every((v) => v % 1000 !== 0); }), c = total - a - b;
      return N(`트럭에 무게가 ${a} kg, ${b} kg, ${c} kg인 짐을 실었다. 트럭에 실은 짐의 무게는 모두 몇 t인가?`, total / 1000, {
        unit: 't', explain: `${a} + ${b} + ${c} = ${total}(kg)이고 ${total} kg은 ${total / 1000} t이다.`, facts: { calc: [[`(${a}+${b}+${c})/1000`, 0]], unseen: [1000] }
      });
    }),
    T('wcalc-ton-left', '문장제: 몇 t에서 몇 kg 빼기', '②112', (d) => {
      const t = d.int(2, 5), a = d.until(() => d.int(22, t * 20 - 2) * 50, (v) => v % 1000 !== 0);
      return N(`${t} t까지 실을 수 있는 트럭에 짐을 ${a} kg 실었다. 이 트럭에 더 실을 수 있는 짐은 몇 kg인가?`, t * 1000 - a, {
        unit: 'kg', explain: `${t} t은 ${t * 1000} kg이다. ${t * 1000} - ${a} = ${t * 1000 - a}`, facts: { calc: [[`${t}*1000-${a}`, 0]], unseen: [1000] }
      });
    })
  ]);

  // ── 실력 문제 ──────────────────────────────────────────────────
  B.addTypes('3-2-5', 'hard', [
    H('h-height', '물의 높이만으로 들이를 비교할 수 있는가', '심10 ①10', (d) => {
      const tall = d.pick(['가', '나']), short = tall === '가' ? '나' : '가';
      const rows = d.shuffle([
        { text: `물의 높이가 더 높은 ${tall} 그릇의 들이가 더 많다.`, ok: false },                                       // 그릇의 모양은 보지 않고 높이만 보는 아이
        { text: `물의 높이가 더 낮은 ${short} 그릇의 들이가 더 많다.`, ok: false },                                      // 낮은 그릇은 넓을 것이라고 넘겨짚는 아이
        { text: '모양과 크기가 같은 그릇에 각각 옮겨 담아 물의 높이를 비교하면 알 수 있다.', ok: true },
        { text: '그릇의 모양이 다르면 들이를 비교할 방법이 없다.', ok: false }                                          // 눈으로 못 견주면 견줄 수 없다고 여기는 아이
      ]);
      return C(`모양과 크기가 서로 다른 가 그릇과 나 그릇에 물을 가득 채웠더니 물의 높이는 ${tall} 그릇이 더 높았다. 두 그릇의 들이에 대하여 옳게 말한 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        explain: '그릇의 모양과 크기가 다르면 물의 높이만으로는 들이를 비교할 수 없다. 모양과 크기가 같은 그릇에 옮겨 담으면 물의 높이로 비교할 수 있다.', facts: { truth: rows.map((row) => row.ok), want: true }
      });
    }, { standard: VOL }),
    HB('h-cup-size', '컵의 크기가 다를 때 부은 횟수로 비교하기', '②8', (d) => {
      const n = d.int(4, 9), bigFirst = d.bool(), big = bigFirst ? '가' : '나', small = bigFirst ? '나' : '가';
      const rows = d.shuffle([
        { text: '부은 횟수가 같으므로 두 물통의 들이는 같다.', ok: false },                                              // 컵의 크기는 보지 않고 횟수만 보는 아이
        { text: `한 번에 붓는 물이 더 많은 큰 컵으로 채운 ${big} 물통의 들이가 더 많다.`, ok: true },
        { text: `작은 컵으로 채운 ${small} 물통의 들이가 더 많다.`, ok: false },                                         // 「작은 컵일수록 여러 번 붓는다」를 뒤집어 쓰는 아이
        { text: '컵의 크기가 다르므로 어느 물통의 들이가 더 많은지 알 수 없다.', ok: false }                             // 단위가 다르면 언제나 비교할 수 없다고 외운 아이
      ]);
      return C(`가 물통은 ${bigFirst ? '큰' : '작은'} 컵으로 ${n}번, 나 물통은 ${bigFirst ? '작은' : '큰'} 컵으로 ${n}번 물을 가득 담아 부었더니 가득 찼다. 옳은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        explain: `부은 횟수가 ${n}번으로 같으므로 한 번에 붓는 물이 더 많은 쪽의 들이가 더 많다. 큰 컵으로 채운 ${big} 물통의 들이가 더 많다.`, facts: { truth: rows.map((row) => row.ok), want: true }
      });
    }, { standard: VOL }),
    HB('h-same-unit', '같은 단위로 잰 것끼리 비교하기', '②63 ③66', (d) => {
      // 500원짜리로 잰 물건(odd)과 100원짜리로 잰 한 물건(twin)의 동전 수를 같게 둔다.
      const things = ['크레파스', '물감', '풀'], odd = d.int(0, 2), same = [0, 1, 2].filter((i) => i !== odd), twin = d.pick(same), n = d.int(5, 12), m = d.until(() => d.int(5, 15), (v) => v !== n);
      const counts = [0, 1, 2].map((i) => (i === odd || i === twin ? n : m)), coin = (i) => (i === odd ? '500원짜리' : '100원짜리');
      const rows = d.shuffle([[0, 1], [0, 2], [1, 2]].map(([i, j]) => ({ text: `${josa(things[i], '과/와')} ${things[j]}`, ok: i !== odd && j !== odd })).concat([{ text: '비교할 수 있는 두 물건이 없다', ok: false }]));
      // 동전의 수가 같은 두 물건을 고르는 아이(수만 본다), 동전이 섞이면 아무것도 비교할 수 없다고 여기는 아이
      return C(`저울로 무게를 재었더니 ${things.map((thing, i) => `${josa(thing, '은/는')} ${coin(i)} 동전 ${counts[i]}개`).join(', ')}와 무게가 같았다. 동전의 수만으로 무게를 비교할 수 있는 두 물건은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
        explain: `같은 100원짜리 동전으로 잰 ${josa(things[same[0]], '과/와')} ${josa(things[same[1]], '은/는')} 동전의 수로 무게를 비교할 수 있다. 500원짜리 동전 1개와 100원짜리 동전 1개는 무게가 다르므로 ${josa(things[odd], '은/는')} 동전의 수만으로 비교할 수 없다.`,
        facts: { truth: rows.map((row) => row.ok), want: true }
      });
    }),
    H('h-borrow', '받아내림이 있는 뺄셈에서 생기는 잘못', '심31', (d) => {
      const [a, b] = d.until(() => subPair(d, true), ([x, y]) => lo(y) - lo(x) !== 500), r = a - b, gap = lo(b) - lo(a), up = hi(a) - hi(b);
      // 바른 값, 받아내림한 1 L를 빼지 않은 값, mL끼리 큰 수에서 작은 수를 뺀 값, 받아내림은 하고 mL는 큰 수에서 작은 수를 뺀 값
      const list = d.shuffle([r, r + 1000, up * 1000 + gap, (up - 1) * 1000 + gap]);
      return C('다음을 바르게 계산한 것은?', list.map(vol), list.indexOf(r), {
        figure: expr(vol(a), '-', vol(b)), explain: `${lo(a)} mL에서 ${lo(b)} mL를 뺄 수 없으므로 1 L를 1000 mL로 받아내림한다. ${1000 + lo(a)} - ${lo(b)} = ${lo(r)}(mL), ${hi(a) - 1} - ${hi(b)} = ${hi(r)}(L)이므로 ${vol(r)}이다.`,
        facts: { pick: { expr: `${X(a)}-${X(b)}`, options: list }, unseen: [1000] }
      });
    }, { standard: VOL_CALC }),
    H('h-less-sum', '더 적은 쪽을 구해 두 들이의 합 구하기', '심84 ①55 ②110 덧', (d) => {
      const [one, other] = d.shuffle(NAMES).slice(0, 2);
      const [a, less] = d.until(() => [d.int(2, 4) * 1000 + d.int(2, 12) * 50, d.int(0, 1) * 1000 + d.int(13, 19) * 50], ([x, y]) => lo(x) < lo(y) && x - y >= 500 && lo(x + x - y) !== 0);
      return M(`${name(one, '은/는')} 물을 ${vol(a)} 마셨고, ${name(other, '은/는')} ${nick(one)}보다 ${vol(less)} 더 적게 마셨다. 두 사람이 마신 물은 모두 몇 L 몇 mL인가?`, ask(a + a - less, 'mL', 'L'), {
        explain: `${name(other, '이/가')} 마신 물은 ${vol(a)} - ${vol(less)} = ${vol(a - less)}이다. ${vol(a)} + ${vol(a - less)} = ${vol(a + a - less)}`, facts: { calc: two(`${X(a)}+${X(a)}-${X(less)}`), unseen: [1000] }
      });
    }, { standard: VOL_CALC }),
    H('h-scoop', '같은 양씩 여러 번 덜어 내고 남은 양', '심41 ①56 ③52 ③53 덧', (d) => {
      const [a, c, n] = d.until(() => [d.int(4, 8) * 1000 + d.int(2, 12) * 50, d.int(6, 18) * 50, d.int(2, 5)], ([x, y, z]) => y * z > 1000 && (y * z) % 1000 !== 0 && x - y * z >= 1000 && lo(x) < lo(y * z));
      return M(`항아리에 물이 ${vol(a)} 들어 있다. 이 물을 들이가 ${c} mL인 바가지에 가득 담아 ${n}번 덜어 냈다. 항아리에 남은 물은 몇 L 몇 mL인가?`, ask(a - c * n, 'mL', 'L'), {
        explain: `덜어 낸 물은 ${c} × ${n} = ${c * n}(mL)이고 ${c * n} mL는 ${vol(c * n)}이다. ${vol(a)} - ${vol(c * n)} = ${vol(a - c * n)}`, facts: { calc: two(`${X(a)}-${c}*${n}`), unseen: [1000] }
      });
    }, { standard: VOL_CALC }),
    HB('h-two-cups', '두 그릇으로 몇 번씩 부어 채운 들이', '③54', (d) => {
      const [c1, n1, c2, n2] = d.until(() => [d.int(4, 9) * 100, d.int(2, 5), d.pick([150, 250, 350, 450]), d.int(2, 4)], ([p, x, q, y]) => x !== y && p * x + q * y > 1000 && (p * x + q * y) % 1000 !== 0), total = c1 * n1 + c2 * n2;
      return M(`빈 어항에 들이가 ${c1} mL인 그릇으로 ${n1}번, 들이가 ${c2} mL인 컵으로 ${n2}번 물을 가득 담아 부었더니 어항이 가득 찼다. 어항의 들이는 몇 L 몇 mL인가?`, ask(total, 'mL', 'L'), {
        explain: `${c1} × ${n1} = ${c1 * n1}(mL), ${c2} × ${n2} = ${c2 * n2}(mL)이다. ${c1 * n1} + ${c2 * n2} = ${total}(mL)이고 ${total} mL는 ${vol(total)}이다.`, facts: { calc: two(`${c1}*${n1}+${c2}*${n2}`), unseen: [1000] }
      });
    }, { standard: VOL_CALC }),
    HB('h-servings', '여러 사람 몫을 만들고 남는 물', '②53', (d) => {
      const [a, b, n] = d.until(() => [d.int(4, 7) * 50, d.int(2, 5) * 50, d.int(2, 3)], ([x, y, k]) => x !== y && 2000 - k * (x + y) >= 300), left = 2000 - n * (a + b);
      return N(`물 2 L가 있다. 카레 1인분을 만드는 데 물 ${a} mL, 떡볶이 1인분을 만드는 데 물 ${b} mL가 든다. 카레와 떡볶이를 ${n}인분씩 만들면 물은 몇 mL 남는가?`, left, {
        unit: 'mL', explain: `카레에 드는 물은 ${a} × ${n} = ${a * n}(mL), 떡볶이에 드는 물은 ${b} × ${n} = ${b * n}(mL)이다. 2 L는 2000 mL이므로 2000 - ${a * n} - ${b * n} = ${left}(mL)가 남는다.`,
        facts: { calc: [[`2*1000-${a}*${n}-${b}*${n}`, 0]], unseen: [1000] }
      });
    }, { standard: VOL_CALC }),
    H('h-drunk-total', '마시기 전과 후의 양으로 마신 물의 합 구하기', '심39 심88 덧', (d) => {
      const who = d.shuffle(NAMES).slice(0, 2), a1 = d.int(2, 4) * 1000 + d.int(2, 9) * 50, b1 = d.until(() => d.int(1, hi(a1) - 1) * 1000 + d.int(10, 19) * 50, (v) => lo(v) > lo(a1));
      const [a2, b2] = d.until(() => [d.int(2, 3) * 1000, d.int(21, 39) * 50], ([x, y]) => y % 1000 !== 0 && a1 - b1 + x - y > 1000 && lo(a1 - b1 + x - y) !== 0), total = a1 - b1 + a2 - b2;
      return M(`${name(who[0], '과/와')} ${name(who[1], '이/가')} 물을 마시기 전과 마신 후에 물통에 든 물의 양을 나타낸 표이다. 두 사람이 마신 물은 모두 몇 L 몇 mL인가?`, ask(total, 'mL', 'L'), {
        figure: table(['', who[0], who[1]], [['마시기 전', vol(a1), vol(a2)], ['마신 후', vol(b1), b2 + ' mL']]),
        explain: `${name(who[0], '이/가')} 마신 물은 ${vol(a1)} - ${vol(b1)} = ${vol(a1 - b1)}, ${name(who[1], '이/가')} 마신 물은 ${vol(a2)} - ${b2} mL = ${vol(a2 - b2)}이다. ${vol(a1 - b1)} + ${vol(a2 - b2)} = ${vol(total)}`,
        facts: { calc: two(`(${X(a1)}-${X(b1)})+(${X(a2)}-${b2})`), unseen: [1000] }
      });
    }, { standard: VOL_CALC }),
    H('h-gain', '늘어난 무게 비교하기', '심87 ③56', (d) => {
      // 나중에 더 무거운 호박이 더 많이 늘어난 호박은 아니다.
      const [a1, g1, b1, g2] = d.until(() => [d.int(1, 3) * 1000 + d.int(4, 18) * 50, d.int(16, 50) * 50, d.int(1, 3) * 1000 + d.int(4, 18) * 50, d.int(16, 50) * 50],
        ([p, x, q, y]) => x !== y && Math.abs(x - y) <= 500 && p !== q && (p + x > q + y) !== (x > y) && lo(p + x) !== 0 && lo(q + y) !== 0 && lo(p + x) < lo(p) && lo(q + y) < lo(q));
      const a2 = a1 + g1, b2 = b1 + g2;
      return C('호박 두 개의 무게를 7월과 9월에 재어 나타낸 표이다. 두 달 동안 무게가 더 많이 늘어난 호박은?', ['가 호박', '나 호박', '늘어난 무게가 같다'], g1 > g2 ? 0 : 1, {
        figure: table(['', '7월', '9월'], [['가 호박', wt(a1), wt(a2)], ['나 호박', wt(b1), wt(b2)]]),
        explain: `가 호박은 ${wt(a2)} - ${wt(a1)} = ${wt(g1)}, 나 호박은 ${wt(b2)} - ${wt(b1)} = ${wt(g2)} 늘어났다.`, facts: { choose: { exprs: [`${X(a2)}-${X(a1)}`, `${X(b2)}-${X(b1)}`], rule: 'max' }, unseen: [1000] }
      });
    }, { standard: WEIGHT_CALC }),
    H('h-sum-who', '각각 더한 양을 비교하여 차 구하기', '심40 심86 덧', (d) => {
      const who = d.shuffle(NAMES).slice(0, 2);
      const [a1, a2, b1, b2] = d.until(() => [amount(d, 3), amount(d, 3), amount(d, 3), amount(d, 3)], ([p, q, r, s]) => new Set([p, q, r, s]).size === 4 && p + q !== r + s && Math.abs(p + q - r - s) <= 900 && Math.abs(p - r) !== Math.abs(p + q - r - s) && p !== r);
      const sums = [a1 + a2, b1 + b2], winner = sums[0] > sums[1] ? 0 : 1, gap = Math.abs(sums[0] - sums[1]), other = Math.abs(a1 - b1);   // other: 빨간색 페인트만 비교한 값
      const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, other], [1 - winner, other]]);
      return C(`${name(who[0], '은/는')} 빨간색 페인트 ${vol(a1)}와 파란색 페인트 ${a2} mL를 샀고, ${name(who[1], '은/는')} 빨간색 페인트 ${b1} mL와 파란색 페인트 ${vol(b2)}를 샀다. 누가 페인트를 얼마나 더 많이 샀는가?`, list.map(([k, n]) => `${who[k]}, ${vol(n)}`), list.findIndex(([k, n]) => k === winner && n === gap), {
        explain: `${name(who[0], '이/가')} 산 페인트는 ${vol(a1)} + ${vol(a2)} = ${vol(sums[0])}, ${name(who[1], '이/가')} 산 페인트는 ${vol(b1)} + ${vol(b2)} = ${vol(sums[1])}이다. ${name(who[winner], '이/가')} ${vol(gap)} 더 많이 샀다.`,
        facts: { who: { exprs: [`${X(a1)}+${a2}`, `${b1}+${X(b2)}`], values: sums, options: list }, unseen: [1000] }
      });
    }, { standard: VOL_CALC }),
    H('h-family', '「더 무겁다」와 「더 가볍다」를 이어 구한 뒤 합 구하기', '심85 ③50', (d) => {
      const [a, b, c] = d.until(() => [d.int(3, 6) * 1000 + d.int(4, 18) * 50, d.int(1, 2) * 1000 + d.int(4, 18) * 50, d.int(2, 4) * 1000 + d.int(4, 18) * 50],
        ([x, y, z]) => y !== z && lo(x) + lo(y) > 1000 && lo(x + y) < lo(z) && x + y - z >= 1000 && lo(x + x + y - z) !== 0);
      const cat = a + b, rabbit = cat - c;
      return M(`강아지의 무게는 ${wt(a)}이다. 고양이는 강아지보다 ${wt(b)} 더 무겁고, 토끼는 고양이보다 ${wt(c)} 더 가볍다. 강아지와 토끼의 무게의 합은 몇 kg 몇 g인가?`, ask(a + rabbit, 'g', 'kg'), {
        explain: `고양이는 ${wt(a)} + ${wt(b)} = ${wt(cat)}, 토끼는 ${wt(cat)} - ${wt(c)} = ${wt(rabbit)}이다. ${wt(a)} + ${wt(rabbit)} = ${wt(a + rabbit)}`,
        facts: { calc: two(`${X(a)}+(${X(a)}+${X(b)}-${X(c)})`), unseen: [1000] }
      });
    }, { standard: WEIGHT_CALC }),
    H('h-basket-n', '같은 무게 여러 개를 담은 바구니에서 빈 바구니의 무게', '심90 ①122 ②111 ③122', (d) => {
      const [each, n, basket] = d.until(() => [d.pick([250, 300, 350, 400, 450]), d.int(3, 6), d.int(6, 18) * 50], ([e, k, b]) => e * k > 1000 && (e * k) % 1000 !== 0 && lo(e * k + b) !== 0 && lo(e * k + b) < lo(e * k)), total = each * n + basket;
      return N(`참외 ${n}개를 담은 바구니의 무게는 ${wt(total)}이다. 참외 한 개의 무게가 ${each} g일 때, 빈 바구니의 무게는 몇 g인가?`, basket, {
        unit: 'g', explain: `참외 ${n}개의 무게는 ${each} × ${n} = ${each * n}(g)이고 ${each * n} g은 ${wt(each * n)}이다. ${wt(total)} - ${wt(each * n)} = ${basket} g`, facts: { calc: [[`${X(total)}-${each}*${n}`, 0]], unseen: [1000] }
      });
    }, { standard: WEIGHT_CALC }),
    HB('h-box-room', '담을 수 있는 무게에서 이미 담은 것을 빼기', '덧', (d) => {
      // 9 kg 500 g까지 담는 상자에 6 kg인 수박 1통과 200 g인 사과 2개
      const [cap, melon, each, n] = d.until(() => [d.int(8, 12) * 1000 + d.int(2, 9) * 50, d.int(3, 6), d.pick([150, 200, 250, 300, 350]), d.int(2, 4)],
        ([c, m, e, k]) => c - m * 1000 - e * k >= 1000 && lo(c) < e * k && e * k < 1000 && lo(c - e * k) !== 0), left = cap - melon * 1000 - each * n;
      return M(`${wt(cap)}까지 담을 수 있는 상자에 무게가 ${melon} kg인 수박 1통과 무게가 ${each} g인 사과 ${n}개를 담았다. 이 상자에 더 담을 수 있는 무게는 몇 kg 몇 g인가?`, ask(left, 'g', 'kg'), {
        explain: `사과 ${n}개의 무게는 ${each} × ${n} = ${each * n}(g)이다. 담은 과일은 모두 ${melon} kg ${each * n} g이므로 ${wt(cap)} - ${melon} kg ${each * n} g = ${wt(left)}`,
        facts: { calc: two(`${X(cap)}-${melon}*1000-${each}*${n}`), unseen: [1000] }
      });
    }, { standard: WEIGHT_CALC }),
    HB('h-dog', '같은 강아지를 안고 잰 두 사람의 몸무게', '③123', (d) => {
      const [one, other] = d.shuffle(NAMES).slice(0, 2), part = () => d.int(2, 18) * 50;
      const [a, b, dog] = d.until(() => [d.int(24, 32) * 1000 + part(), d.int(24, 32) * 1000 + part(), d.int(2, 4) * 1000 + part()], ([x, y, z]) => hi(x) !== hi(y) && lo(x + z) < lo(x) && lo(y + z) < lo(z) && lo(x + z) !== 0 && lo(y + z) !== 0);
      const ta = a + dog, tb = b + dog;
      return M(`${name(one, '과/와')} ${name(other, '이/가')} 같은 강아지를 안고 몸무게를 재었다. ${name(one, '이/가')} 강아지를 안고 재면 ${wt(ta)}, ${name(other, '이/가')} 강아지를 안고 재면 ${wt(tb)}이다. ${nick(one)}의 몸무게가 ${wt(a)}일 때, ${nick(other)}의 몸무게는 몇 kg 몇 g인가?`, ask(b, 'g', 'kg'), {
        explain: `강아지의 무게는 ${wt(ta)} - ${wt(a)} = ${wt(dog)}이다. ${nick(other)}의 몸무게는 ${wt(tb)} - ${wt(dog)} = ${wt(b)}이다.`, facts: { calc: two(`${X(tb)}-(${X(ta)}-${X(a)})`), unseen: [1000] }
      });
    }, { standard: WEIGHT_CALC }),
    H('h-swap-basket', '바구니의 무게를 구해 다른 것을 담은 무게 구하기', '심90', (d) => {
      const [a, b, k] = d.until(() => [amount(d, 5) + 1000, amount(d, 4), d.int(6, 12) * 50], ([x, y, z]) => hi(x) !== hi(y) && lo(x) + z > 1000 && lo(y) + z > 1000);
      return M(`고구마 ${wt(a)}을 바구니에 담아 무게를 재었더니 ${wt(a + k)}이었다. 고구마를 모두 꺼내고 같은 바구니에 감자 ${wt(b)}을 담으면 무게는 몇 kg 몇 g이 되는가?`, ask(b + k, 'g', 'kg'), {
        explain: `바구니의 무게는 ${wt(a + k)} - ${wt(a)} = ${k} g이다. 감자를 담으면 ${wt(b)} + ${k} g = ${wt(b + k)}이 된다.`, facts: { calc: two(`${X(a + k)}-${X(a)}+${X(b)}`), unseen: [1000] }
      });
    }, { standard: WEIGHT_CALC })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
