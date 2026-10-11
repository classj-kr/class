// 3학년 2학기 5단원 들이와 무게 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가(40개 문서)의 문제 꼴 94개와
// 기본 자료의 꼴을 참고하되, 그대로 옮기지 않고 꼴마다 따져서 냈다.
//
// 실력 문항의 잣대: 어려움은 이 단원에서 배운 것을 정확히 아는가에서 나와야 한다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적고,
// 그 오개념을 가진 아이가 고를 보기를 넣어 문제를 냈다.
//   ① 단위가 다른 물건으로 잰 수는 비교할 수 없다(동전 30개와 구슬 30개).
//   ② 0이 끼는 단위 바꾸기: 4 L 50 mL를 450 mL나 4500 mL로 적는다.
//   ③ 저울의 작은 눈금 한 칸을 언제나 100 g으로 읽는다.
// 그다음에 계산을 두 번 넘게 해야 하는 문제를 실었다(넘친 양으로 그릇의 들이, 더 무거운 쪽을 구해 합, 반을 덜어 낸 뒤의 무게로 빈 병의 무게).
//
// 뺀 것과 까닭
//  - 상위 학년의 특정 단원에 해당하는 것은 모두 뺐다.
//      4학년 「곱셈과 나눗셈」: 그릇을 컵으로 채우는 횟수·한 컵의 들이처럼 네 자리 수를 나누는 꼴, 1 t은 몇 kg의 몇 배, 실을 수 있는 무게로 필요한 트럭 수
//      6학년 「비례식과 비례배분」에 가까운 것: 수도에서 나오는 물의 양
//      중학교 방정식 꼴: 합과 차로 두 무게 구하기, 두 저울을 이어 한 개의 무게 구하기, 바꿔 넣어 푸는 저울
//  - 경우 따지기가 어려움의 대부분: 들이를 맞추는 그릇 고르기, 둘을 골라 가장 많게 섞기, 무게가 같도록 둘로 나누기
//  - 서술형: 비교 방법·어림한 방법 쓰기, 문제 만들기
// 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { dial, M, C } = B.kit;
  const VOL = '4수03-17', VOL_CALC = '4수03-19', WEIGHT = '4수03-20', WEIGHT_CALC = '4수03-23';
  const H = (id, title, source, make, more) => Object.assign({ id, level: '실력', title, source, make }, more || {});
  const hi = (v) => Math.floor(v / 1000), lo = (v) => v % 1000;
  const write = (v, small, big) => [hi(v) ? hi(v) + ' ' + big : '', lo(v) ? lo(v) + ' ' + small : ''].filter(Boolean).join(' ');
  const vol = (v) => write(v, 'mL', 'L'), wt = (v) => write(v, 'g', 'kg');
  const X = (v) => (hi(v) && lo(v) ? `(${hi(v)}*1000+${lo(v)})` : hi(v) ? `${hi(v)}*1000` : String(lo(v)));
  const two = (expr) => [[`((${expr})-(${expr})%1000)/1000`, 0], [`(${expr})%1000`, 1]];
  const ask = (v, small, big) => [{ answer: hi(v), unit: big }, { answer: lo(v), unit: small }];

  B.addGroup('3-2-5', {
    id: 'hard', title: '실력 문제', standard: WEIGHT,
    types: [
      H('h-unit', '서로 다른 물건으로 잰 무게', '다른 단위로 잰 무게는 견줄 수 없다(심화 51), 단위 물건이 달라 견줄 수 없음(기본 ①69)', (d) => {
        const n = d.int(12, 30);
        const rows = d.shuffle([
          { text: '사과와 배의 무게는 같다.', ok: false },                                    // 수가 같으면 무게도 같다고 여기는 아이
          { text: '동전 1개와 구슬 1개의 무게가 같은지 알아야 두 과일의 무게를 비교할 수 있다.', ok: true },
          { text: '동전이 구슬보다 무거우므로 사과가 더 무겁다.', ok: false },                   // 주어지지 않은 것을 덧붙이는 아이
          { text: '구슬이 동전보다 작으므로 배가 더 가볍다.', ok: false }
        ]);
        return C(`저울로 무게를 재었더니 사과는 동전 ${n}개와, 배는 구슬 ${n}개와 무게가 같았다. 옳은 것은?`, rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
          explain: '무게를 잰 단위가 동전과 구슬로 서로 다르다. 동전 1개와 구슬 1개의 무게가 같은지 모르므로 수가 같아도 무게가 같다고 할 수 없다.', facts: { truth: rows.map((row) => row.ok), want: true }
        });
      }),
      H('h-zero', '0이 끼는 들이 바꾸기', 'L와 mL 고쳐 쓰기(심화 13), 0이 끼는 바꾸기(기본 ①19)', (d) => {
        const a = d.int(2, 9), b = d.int(2, 9) * 10, list = d.shuffle([a * 1000 + b, a * 100 + b, a * 1000 + b * 10, a * 1000 + b / 10]);      // 바른 것, 이어 쓴 것, 0을 뒤에 붙인 것, 자리를 하나 더 민 것
        return C(`${a} L ${b} mL는 몇 mL인가?`, list.map((v) => v + ' mL'), list.indexOf(a * 1000 + b), {
          explain: `${a} L는 ${a * 1000} mL이다. ${a * 1000} mL보다 ${b} mL 더 많은 들이는 ${a * 1000 + b} mL이다.`, facts: { pick: { expr: `${a}*1000+${b}`, options: list }, unseen: [1000] }
        });
      }, { standard: VOL }),
      H('h-tick', '저울의 작은 눈금 한 칸의 크기', '저울 눈금 읽기(심화 57), 저울 눈금을 잘못 읽은 말 바로잡기(기본 ①101)', (d) => {
        // 한 바퀴 4 kg, 작은 눈금 한 칸 200 g: 한 칸을 100 g으로 읽으면 틀린다
        const ticks = d.pick([6, 7, 8, 9, 11, 12, 13, 14]), value = ticks * 200, list = d.shuffle([value, ticks * 100, hi(value) * 1000 + (ticks - hi(value) * 5) * 100, value + 200].filter((v, i, all) => all.indexOf(v) === i));
        return C('저울에 올린 물건의 무게는?', list.map((v) => wt(v)), list.indexOf(value), {
          figure: dial(4000, 200, 1000, value), explain: `1 kg이 작은 눈금 5칸으로 나뉘어 있으므로 작은 눈금 한 칸은 200 g이다. 바늘이 0에서 ${ticks}칸 간 곳을 가리키므로 ${wt(value)}이다.`,
          facts: { pick: { expr: `${ticks}*200`, options: list } }
        });
      }),
      H('h-overflow', '넘친 물의 양으로 그릇의 들이 구하기', '넘친 물로 그릇의 들이 구하기(심화 37, 기본 ①57)', (d) => {
        const [a, b, over] = d.until(() => [d.int(1, 3) * 1000 + d.int(4, 18) * 50, d.int(1, 3) * 1000 + d.int(4, 18) * 50, d.int(3, 9) * 50], ([x, y, z]) => lo(x) + lo(y) > 1000 && lo(x + y) < z && lo(x) !== lo(y));
        return M(`빈 수조에 물을 ${vol(a)} 부은 다음 ${vol(b)}를 더 부었더니 물이 ${over} mL 넘쳤다. 수조의 들이는 몇 L 몇 mL인가?`, ask(a + b - over, 'mL', 'L'), {
          explain: `부은 물은 모두 ${vol(a)} + ${vol(b)} = ${vol(a + b)}이다. 넘친 물을 빼면 ${vol(a + b)} - ${over} mL = ${vol(a + b - over)}이다.`, facts: { calc: two(`${X(a)}+${X(b)}-${over}`), unseen: [1000] }
        });
      }, { standard: VOL_CALC }),
      H('h-heavier', '더 무거운 쪽을 구해 두 무게의 합 구하기', '「~보다 더」로 한쪽을 구해 합(심화 84, 기본 ①118)', (d) => {
        const [a, more] = d.until(() => [d.int(1, 3) * 1000 + d.int(4, 18) * 50, d.int(6, 18) * 50], ([x, y]) => lo(x) + y > 1000 && lo(x + x + y) !== 0);
        return M(`수박의 무게는 ${wt(a)}이고, 호박은 수박보다 ${more} g 더 무겁다. 수박과 호박의 무게의 합은 몇 kg 몇 g인가?`, ask(a + a + more, 'g', 'kg'), {
          explain: `호박의 무게는 ${wt(a)} + ${more} g = ${wt(a + more)}이다. ${wt(a)} + ${wt(a + more)} = ${wt(a + a + more)}`, facts: { calc: two(`${X(a)}+${X(a)}+${more}`), unseen: [1000] }
        });
      }, { standard: WEIGHT_CALC }),
      H('h-half', '물을 반만 마신 뒤의 무게로 빈 병의 무게 구하기', '그릇의 무게 빼기·더하기(심화 90)', (d) => {
        const bottle = d.int(3, 8) * 50, half = d.int(4, 9) * 50, full = bottle + half * 2;
        return M(`물이 가득 든 병의 무게는 ${wt(full)}이다. 물을 반만 마신 뒤에 다시 재었더니 ${wt(bottle + half)}이었다. 빈 병의 무게는 몇 g인가?`, [{ answer: bottle, unit: 'g' }], {
          explain: `마신 물의 무게는 ${wt(full)} - ${wt(bottle + half)} = ${half} g이고, 남은 물의 무게도 ${half} g이다. 빈 병의 무게는 ${wt(bottle + half)} - ${half} g = ${bottle} g이다.`,
          facts: { calc: [[`${X(bottle + half)}-(${X(full)}-${X(bottle + half)})`, 0]], unseen: [1000] }
        });
      }, { standard: WEIGHT_CALC })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
