// 6학년 1학기 6단원 직육면체의 부피와 겉넓이 — 실력 문항.
// 단원 틀과 그림 도구(B.kit.vol616)는 6-1-6a.js 에 있다. 대조표는 수집본의 _분석/6-1-6/싣기_대조표.md.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 부피가 같으면 겉넓이도 같다고 여긴다(쌓기나무의 수가 같은 두 직육면체). 자르면 부피가 그대로이니 겉넓이도 그대로라고 여긴다.
//  - 단위가 다른 길이를 그대로 곱한다(4 m × 250 cm × 3 m = 3000). 1 m³를 100 cm³나 10000 cm³로 여긴다(길이·넓이의 단위 관계를 그대로 가져온다).
//  - 겉넓이를 구할 때 보이는 세 면의 넓이만 더하거나, 뚜껑이 없는 상자에서도 여섯 면을 다 더한다.
//  - 높이는 언제나 세로로 선 모서리라고 여긴다(옆으로 선 면을 밑면으로 보면 그 면에 수직인 모서리가 높이이다).
//  - 쌓기나무 그림에서 보이는 것만 센다. 가장 길거나 가장 높은 상자가 부피도 가장 크다고 여긴다.
//  - 모서리를 2배로 늘이면 부피도 2배가 된다고 여긴다.
//  - 물에 잠긴 물건의 부피를 구할 때 물의 높이 전체나 수조의 높이를 곱한다.
//
// 실력 문항의 잣대: 두 가지만 둔다.
//  ① 문제의 상황·그림에 함정이 있어 뜻을 정확히 대야 풀리는 문제(위의 잘못된 생각이 드러나는 그림·상황을 준다. 어려움은 보기가 아니라 그림과 상황에서 나온다)
//     - 수가 같은 쌓기나무로 만든 두 직육면체의 겉넓이, 한 모서리만 단위가 다른 직육면체, 뚜껑이 없는 상자, 옆으로 선 면의 넓이와 그 면의 한 변까지 적힌 직육면체,
//       위층에 가려 보이지 않는 쌓기나무가 있는 계단 모양 덩어리, 길거나 높아서 커 보이는 상자와 작아 보이는 상자, 자르면 늘어나는 겉넓이
//  ② 두 번 넘게 생각해야 풀리는 문제: 붙이거나 잘라 낸 입체의 부피, 물에 잠긴 물건의 부피, 겉넓이 → 모서리 → 부피(와 그 거꾸로), 부피 → 모서리 → 겉넓이,
//     부피(겉넓이)가 같은 두 입체에서 거꾸로 구하기, 상자에 작은 상자를 빈틈없이 넣는 수, 모서리를 늘인 직육면체의 부피는 몇 배, 겉넓이에서 모서리, 단위를 바꾼 뒤 거꾸로 구하기
// 기본에서 이미 하는 일(공식 한 번, 단위 한 번 바꾸기)을 고르기로 바꾸고 틀린 보기에 흔한 실수 답을 넣은 것은 실력이 아니므로 싣지 않았다. 같은 함정은 보기가 아니라 그림에 넣었다.
// 셈은 네 단계를 넘지 않는다(네 단계인 것은 「겉넓이와 두 모서리로 나머지 모서리 구하기」 하나뿐이다).
//
// 뺀 것과 까닭(심화꼴)
//  - 위·앞·옆에서 본 모양(심16·55), 끈으로 묶은 상자(심56), 전개도에서 같은 길이를 찾아 ㉠ 풀기(심54): 다른 단원의 일이거나 조건 풀이가 일의 대부분이다.
//  - 홈을 판 입체·가운데가 뚫린 입체의 겉넓이(심59·60), 쌓기나무 입체의 겉넓이에서 부피(심64): 면을 하나하나 따져 더하는 것이 일의 대부분이고 넷~다섯 단계이다.
//  - 넓이·길이 단위 셋이 섞인 부피(심31), 부피가 같은 두 입체의 겉넓이(심53), 단위가 섞인 부피에서 겉넓이(심51의 변형 — 수집본 답 42800000은 틀렸고 바른 값은 428000 cm²이다): 네 단계 이상이고 큰 수·소수의 셈이 겹친다.
//  - 똑같이 자른 조각들의 겉넓이의 합(심61): 「자르면 늘어나는 겉넓이」가 같은 상황을 더 짧게 묻는다.
//  - 단위가 다른 두 부피의 몇 배(심29의 변형), 세는 물건이 다르면 비교할 수 없다(심4): 기본 묶음에 실었다(한 번 판단하면 되는 일이다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, C, D } = B.kit;
  const K = B.kit.box525;
  const { tiles, YELLOW, netArt, cubeNet } = K;
  const { TAGS, AX, calc, len, range, prod, surf, three, said3, text3, cms, boxArt, sameScale, cubesArt, pile, brick, blockArt, buried, layersOf, layerSaid, stepsArt, tankArt, openArt, cutArt, netWith } = B.kit.vol616;
  const SURF = '6수03-17', UNIT = '6수03-18', VOL = '6수03-19';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const surfExpr = (v) => `(${v[0]}*${v[1]}+${v[1]}*${v[2]}+${v[0]}*${v[2]})*2`;
  const surfShown = (v) => `(${v[0]} × ${v[1]} + ${v[1]} × ${v[2]} + ${v[0]} × ${v[2]}) × 2 = ${surf(v)}(cm²)`;
  // 쌓기나무의 수는 같고 겉넓이는 다른 두 직육면체
  const SAME_VOLUME = [[[2, 2, 2], [4, 2, 1]], [[2, 2, 2], [4, 1, 2]], [[2, 2, 2], [1, 2, 4]], [[3, 2, 2], [6, 2, 1]], [[3, 2, 2], [4, 3, 1]], [[2, 2, 3], [4, 3, 1]], [[3, 2, 1], [6, 1, 1]], [[4, 2, 2], [4, 4, 1]], [[2, 2, 4], [4, 4, 1]]];
  // 물에 잠기는 정육면체: [수조의 가로, 세로, 높아진 물의 높이, 정육면체의 한 모서리]
  const SUNK = [[12, 9, 2, 6], [18, 12, 1, 6], [24, 9, 1, 6], [9, 8, 3, 6], [16, 16, 2, 8], [32, 16, 1, 8], [20, 25, 2, 10], [25, 40, 1, 10]];
  // 직육면체와 부피가 같은 정육면체: [가로, 세로, 높이, 정육면체의 한 모서리]
  const CUBE_TWIN = [[8, 9, 3, 6], [4, 6, 9, 6], [2, 4, 8, 4], [16, 8, 4, 8], [25, 8, 5, 10], [12, 6, 3, 6], [2, 9, 12, 6], [4, 10, 25, 10], [20, 10, 5, 10], [4, 8, 16, 8]];
  // 직육면체와 겉넓이가 같은 정육면체: [가로, 세로, 높이, 정육면체의 한 모서리]
  const SKIN_TWIN = [[2, 6, 12, 6], [3, 6, 10, 6], [3, 4, 9, 5], [3, 9, 10, 7], [4, 9, 12, 8], [6, 10, 15, 10], [5, 8, 20, 10]];

  B.addGroup('6-1-6', {
    id: 'hard', title: '단원 종합', standard: VOL,
    types: [
      // ── ① 그림·상황에 함정이 있는 문제 ─────────────────────────
      H('hard-same-blocks', '쌓기나무의 수가 같은 두 직육면체의 겉넓이', '심41 ②65', (d) => {
        // 어떤 아이가 틀리는가: 쌓기나무의 수가 같으니 겉넓이도 같다고 여긴다(차를 0으로 본다). 쌓기나무의 수를 겉넓이로 답한다.
        const pair = d.shuffle(d.pick(SAME_VOLUME)), [big, small] = surf(pair[0]) > surf(pair[1]) ? pair : [pair[1], pair[0]];
        return N('부피가 1 cm³인 쌓기나무를 같은 수만큼 써서 직육면체 가와 나를 만들었다. 두 직육면체의 겉넓이의 차는 몇 cm²인가?', surf(big) - surf(small), {
          unit: 'cm²', figure: tiles(pair.map((v) => blockArt(v))),
          explain: `쌓기나무의 한 모서리의 길이는 1 cm이다. 가의 겉넓이는 ${surfShown(pair[0])}, 나의 겉넓이는 ${surfShown(pair[1])}이다. 두 직육면체는 부피가 ${prod(big)} cm³로 같지만 겉넓이는 ${surf(big)} − ${surf(small)} = ${surf(big) - surf(small)}(cm²)만큼 다르다.`,
          facts: calc(`${surfExpr(big)}-${surfExpr(small)}`, [2])
        });
      }, { standard: SURF }),
      H('hard-mixed-units', '한 모서리만 단위가 다른 직육면체의 부피', '심28 ①50 ②46 ③42', (d, n) => {
        // 어떤 아이가 틀리는가: 그림에 적힌 수를 단위를 보지 않고 그대로 곱한다.
        if (n === 1) {
          // 한 모서리만 m, 두 모서리는 cm
          const a = d.pick([2, 3]), [b, c] = d.until(() => [d.pick([50, 80]), d.pick([50, 80])], ([x, y]) => (a * x * y) % 10000 !== 0), v = [a, b / 100, c / 100];
          return D('직육면체 모양 나무 상자의 부피는 몇 m³인가?', (a * b * c) / 10000, {
            unit: 'm³', figure: boxArt(v, [len(a, 'm'), len(b), len(c)], { label: `직육면체의 겨냥도. 가로 ${a} m, 세로 ${b} cm, 높이 ${c} cm` }),
            explain: `단위를 m로 맞춘다. ${b === c ? `${b} cm = ${b / 100} m` : `${b} cm = ${b / 100} m, ${c} cm = ${c / 100} m`}이므로 ${a} × ${b / 100} × ${c / 100} = ${(a * b * c) / 10000}(m³)이다. 단위가 다른 길이를 그대로 곱하면 안 된다.`,
            facts: calc(`${a}*(${b}/100)*(${c}/100)`, [100])
          });
        }
        // 한 모서리만 cm, 두 모서리는 m
        const [a, b, c] = d.until(() => [d.pick([2, 4]), d.pick([2, 3]), d.pick([150, 250])], (w) => Math.max(w[0], w[1], w[2] / 100) <= 2 * Math.min(w[0], w[1], w[2] / 100)), at = d.int(0, 2), rest = d.shuffle([a, b]), texts = [0, 1, 2].map((i) => (i === at ? len(c) : len(rest[i - (i > at ? 1 : 0)], 'm')));
        const v = [0, 1, 2].map((i) => (i === at ? c / 100 : rest[i - (i > at ? 1 : 0)]));
        return N('직육면체 모양 창고의 부피는 몇 m³인가?', (a * b * c) / 100, {
          unit: 'm³', figure: boxArt(v, texts, { label: `직육면체의 겨냥도. 가로 ${texts[0]}, 세로 ${texts[1]}, 높이 ${texts[2]}` }),
          explain: `단위를 m로 맞춘다. ${c} cm = ${c / 100} m이므로 ${v.join(' × ')} = ${(a * b * c) / 100}(m³)이다. 단위가 다른 길이를 그대로 곱하면 안 된다.`,
          facts: calc(`${a}*${b}*(${c}/100)`, [100])
        });
      }, { count: 2, standard: UNIT }),
      H('hard-open-box', '뚜껑이 없는 상자의 겉면의 넓이', '기본 ①61 ②58 ③52', (d) => {
        // 어떤 아이가 틀리는가: 겉넓이 공식을 그대로 써서 없는 윗면까지 더한다.
        const v = three(d, range(4, 10), null, 2.2), [a, b, c] = v, total = a * b + (b * c + a * c) * 2;
        return N('뚜껑이 없는 직육면체 모양 상자가 있다. 이 상자의 바닥과 옆면의 바깥쪽에 색종이를 겹치지 않게 빈틈없이 붙이려고 한다. 필요한 색종이의 넓이는 몇 cm²인가?', total, {
          unit: 'cm²', figure: openArt(v, cms(v), `뚜껑이 없는 직육면체 모양 상자의 겨냥도. ${said3(v)}`),
          explain: `윗면이 없으므로 바닥 1개와 옆면 4개의 넓이를 더한다. 바닥은 ${a} × ${b} = ${a * b}(cm²), 옆면은 (${b} × ${c} + ${a} × ${c}) × 2 = ${(b * c + a * c) * 2}(cm²)이므로 ${a * b} + ${(b * c + a * c) * 2} = ${total}(cm²)이다.`,
          facts: calc(`${a}*${b}+(${b}*${c}+${a}*${c})*2`, [2])
        });
      }, { standard: SURF }),
      H('hard-lying-base', '옆으로 선 면의 넓이와 그 면의 한 변이 적힌 직육면체의 부피', '기본 ①23 ②24 ③20', (d) => {
        // 어떤 아이가 틀리는가: 세로로 선 모서리가 언제나 높이라고 여겨 색칠한 면의 넓이에 그 면의 한 변을 다시 곱한다.
        const v = three(d, range(3, 9), null, 2.2), [a, b, c] = v, area = a * c;
        return N(`직육면체의 앞쪽 면을 색칠했다. 색칠한 면의 넓이가 ${area} cm²일 때 이 직육면체의 부피는 몇 cm³인가?`, area * b, {
          unit: 'cm³', figure: boxArt(v, [null, len(b), len(c)], { tint: { 2: YELLOW }, label: `직육면체의 겨냥도. 앞면을 색칠했다. 세로 ${b} cm, 높이 ${c} cm` }),
          explain: `색칠한 면을 밑면으로 보면 높이는 그 면에 수직인 모서리의 길이 ${b} cm이다. ${area} × ${b} = ${area * b}(cm³). ${c} cm는 색칠한 면의 한 변의 길이이므로 다시 곱하지 않는다.`,
          facts: calc(`${area}*${b}`)
        });
      }),
      H('hard-hidden-blocks', '보이지 않는 쌓기나무가 있는 계단 모양 입체도형의 부피', '심5 기본 ②13 ③10', (d) => {
        // 어떤 아이가 틀리는가: 그림에서 보이는 쌓기나무만 센다. 위층 아래에 가려진 쌓기나무까지 층마다 세어야 한다.
        // 층마다 직사각형 모양으로 빈틈없이 놓은 계단(앞으로 내려오거나 오른쪽으로 내려온다)이라 줄마다 맨 위 쌓기나무가 보인다.
        const made = d.until(() => {
          const front = d.bool(), high = [d.int(2, 3), d.int(1, 3), d.int(1, 2)].sort((x, y) => y - x), wide = front ? d.int(3, 4) : d.int(2, 3);
          const rows = front ? [2, 1, 0].map((k) => Array.from({ length: wide }, () => high[k])) : Array.from({ length: wide }, () => high.slice());
          return { rows, high, cubes: pile(rows) };
        }, (m) => new Set(m.high).size >= 2 && m.cubes.length >= 12 && m.cubes.length <= 24 && buried(m.cubes) >= 3);
        const { rows, cubes } = made, top = layersOf(cubes).length, flags = [];
        for (let x = 0; x < rows[0].length; x += 1) for (let y = 0; y < rows.length; y += 1) for (let z = 0; z < top; z += 1) flags.push(cubes.some((c) => c[0] === x && c[1] === y && c[2] === z));
        return N('부피가 1 cm³인 쌓기나무를 계단 모양으로 빈틈없이 쌓았다. 위에 놓인 쌓기나무의 아래에는 빈 곳이 없다. 이 입체도형의 부피는 몇 cm³인가?', cubes.length, {
          unit: 'cm³', figure: cubesArt(cubes, { most: [150, 124], label: `쌓기나무를 계단 모양으로 쌓은 입체도형. ${layerSaid(cubes)}` }),
          explain: `위층에 가려 보이지 않는 쌓기나무도 세어야 한다. 층마다 세면 ${layerSaid(cubes)}로 모두 ${cubes.length}개이므로 부피는 ${cubes.length} cm³이다.`, facts: { count: flags }
        });
      }, { standard: UNIT }),
      H('hard-looks-big', '커 보이는 상자와 부피가 큰 상자', '기본 ①31 ②26 ③22', (d) => {
        // 그림에 함정을 둔다: 가장 높은 상자와 가장 긴 상자는 커 보이지만 부피는 고르게 생긴 상자보다 조금 작다. 세 상자는 같은 배율로 그린다(셈해야만 가려진다).
        const made = d.until(() => {
          const p = d.int(4, 6), even = [p, d.int(p, p + 1), d.int(p, p + 1)];
          return { even: d.shuffle(even), tall: [d.int(3, 4), d.int(3, 4), d.int(8, 12)], long: [d.int(8, 12), d.int(3, 4), d.int(3, 4)] };
        }, (m) => [m.tall, m.long].every((v) => prod(v) < prod(m.even) && prod(v) >= prod(m.even) * 0.84) && m.tall.slice().sort().join() !== m.long.slice().sort().join());
        const boxes = d.shuffle([made.even, made.tall, made.long]), at = boxes.indexOf(made.even), sizes = sameScale(boxes, [116, 124]);
        return C('직육면체 모양 상자 가, 나, 다 가운데 부피가 가장 큰 상자는?', TAGS.slice(0, 3), at, {
          figure: tiles(boxes.map((v, i) => boxArt(v, cms(v), { size: sizes[i], label: `직육면체 모양 상자의 겨냥도. ${said3(v)}` }))),
          explain: `부피를 구하면 ${boxes.map((v, i) => `${TAGS[i]}는 ${v.join(' × ')} = ${prod(v)}(cm³)`).join(', ')}이다. 가장 큰 것은 ${TAGS[at]}이다. 가장 길거나 가장 높은 상자가 부피도 가장 큰 것은 아니다.`,
          facts: { choose: { exprs: boxes.map((v) => v.join('*')), rule: 'max' } }
        });
      }),
      H('hard-cut-surface', '자르면 늘어나는 겉넓이', '심62 ②85 ③74', (d, n) => {
        // 어떤 아이가 틀리는가: 잘라도 부피가 그대로이니 겉넓이도 그대로라고 여긴다. 자른 자리에 새 면이 조각마다 하나씩 생긴다.
        if (n === 1) {
          const k = d.pick([2, 3]), s = d.int(2, k === 2 ? 5 : 3), t = s * k, count = k * k * k;
          return N(`한 모서리의 길이가 ${t} cm인 정육면체 모양 치즈를 잘라 한 모서리의 길이가 ${s} cm인 정육면체 ${count}개로 나누었다. 나눈 정육면체 ${count}개의 겉넓이의 합은 자르기 전 치즈의 겉넓이의 몇 배인가?`, k, {
            unit: '배', explain: `자르기 전의 겉넓이는 ${t} × ${t} × 6 = ${t * t * 6}(cm²)이다. 작은 정육면체 한 개의 겉넓이는 ${s} × ${s} × 6 = ${s * s * 6}(cm²)이므로 ${count}개의 합은 ${s * s * 6} × ${count} = ${s * s * 6 * count}(cm²)이다. ${s * s * 6 * count} ÷ ${t * t * 6} = ${k}(배). 부피는 그대로이지만 겉넓이는 늘어난다.`,
            facts: calc(`(${s}*${s}*6*${count})/(${t}*${t}*6)`, [6])
          });
        }
        // 조각 수가 k 이면 자르는 자리는 k − 1 곳이고, 자리마다 새 면이 2개씩 생긴다.
        const axis = d.int(0, 2), k = d.pick([2, 2, 3]), v = three(d, [4, 5, 6, 7, 8, 9, 10, 12], (w) => w[axis] % k === 0 && w[axis] >= k * 2, 2.4), [p, q] = v.filter((_, i) => i !== axis), faces = (k - 1) * 2;
        return N(`직육면체 모양 떡을 점선을 따라 똑같은 직육면체 ${k}개로 잘랐다. 자른 조각들의 겉넓이의 합은 자르기 전 떡의 겉넓이보다 몇 cm² 더 넓은가?`, p * q * faces, {
          unit: 'cm²', figure: cutArt(v, axis, k, `직육면체의 겨냥도. ${said3(v)}. ${AX[axis]}를 똑같이 ${k === 2 ? '둘로' : '셋으로'} 나누는 자리 ${k - 1}곳에 자르는 선(점선)을 그었다.`),
          explain: `한 번 자를 때마다 자른 자리의 양쪽에 두 변의 길이가 ${p} cm, ${q} cm인 면이 하나씩, 모두 2개 새로 생긴다. ${k === 2 ? '한 번 잘랐으므로' : `${k - 1}번 잘랐으므로 새로 생긴 면은 ${faces}개이고`} ${p} × ${q} × ${faces} = ${p * q * faces}(cm²) 더 넓다. 나머지 면의 넓이는 그대로이다.`,
          facts: calc(`${p}*${q}*${faces}`, [faces])
        });
      }, { count: 2, standard: SURF }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ───────────────────────
      H('hard-water', '물에 잠긴 물건의 부피', '심65·66 ②86', (d, n) => {
        if (n === 2) {
          // 거꾸로: 돌의 부피를 밑면의 넓이로 나누어 높아지는 높이를 구하고 처음 높이에 더한다.
          const a = d.pick([20, 25, 30, 40]), b = d.pick([10, 12, 15, 20]), before = d.int(8, 14), rise = d.int(2, 5), tall = before + rise + d.int(4, 8), rock = a * b * rise;
          return N(`가로 ${a} cm, 세로 ${b} cm인 직육면체 모양 수조에 물이 ${before} cm 높이까지 들어 있다. 부피가 ${rock} cm³인 돌을 물에 완전히 잠기게 넣으면 물의 높이는 몇 cm가 되는가?`, before + rise, {
            unit: 'cm', figure: tankArt([a, b, tall], before, { a: len(a), b: len(b) }, `물이 든 직육면체 모양 수조의 겨냥도. 가로 ${a} cm, 세로 ${b} cm`),
            explain: `돌의 부피만큼 물이 높아진다. 수조의 밑면의 넓이는 ${a} × ${b} = ${a * b}(cm²)이므로 물은 ${rock} ÷ ${a * b} = ${rise}(cm) 높아진다. ${before} + ${rise} = ${before + rise}(cm)`,
            facts: calc(`${before}+${rock}/(${a}*${b})`)
          });
        }
        if (n === 1) {
          const [a, b, rise, s] = d.pick(SUNK), box = [a, b, s + 6];
          return N(`가로 ${a} cm, 세로 ${b} cm인 직육면체 모양 수조에 물이 들어 있다. 정육면체 모양 쇠 덩어리를 물에 완전히 잠기게 넣었더니 물의 높이가 ${rise} cm 높아졌다. 쇠 덩어리의 한 모서리의 길이는 몇 cm인가?`, s, {
            unit: 'cm', figure: tankArt(box, s + 2, { a: len(a), b: len(b) }, `물이 든 직육면체 모양 수조의 겨냥도. 가로 ${a} cm, 세로 ${b} cm`),
            explain: `쇠 덩어리의 부피는 높아진 물의 부피와 같으므로 ${a} × ${b} × ${rise} = ${a * b * rise}(cm³)이다. ${s} × ${s} × ${s} = ${a * b * rise}이므로 한 모서리의 길이는 ${s} cm이다.`,
            facts: { range: { ineq: `x*x*x>${a}*${b}*${rise}-1`, lo: 1, hi: 20, want: 'min' } }
          });
        }
        // 쓰지 않는 길이(수조의 높이)가 섞여 있다. 처음 물의 높이를 곱하는 아이도 틀린다.
        const a = d.pick([20, 25, 30, 40]), b = d.pick([10, 12, 15, 20]), before = d.int(8, 14), rise = d.int(2, 5), tall = before + rise + d.int(4, 8);
        return N(`가로 ${a} cm, 세로 ${b} cm, 높이 ${tall} cm인 직육면체 모양 수조에 물이 ${before} cm 높이까지 들어 있다. 돌을 물에 완전히 잠기게 넣었더니 물의 높이가 ${before + rise} cm가 되었다. 돌의 부피는 몇 cm³인가?`, a * b * rise, {
          unit: 'cm³', figure: tankArt([a, b, tall], before, { a: len(a), b: len(b) }, `물이 든 직육면체 모양 수조의 겨냥도. 가로 ${a} cm, 세로 ${b} cm`),
          explain: `돌의 부피는 높아진 물의 부피와 같다. 물의 높이는 ${before + rise} − ${before} = ${rise}(cm) 높아졌으므로 ${a} × ${b} × ${rise} = ${a * b * rise}(cm³)이다. 수조의 높이 ${tall} cm는 쓰지 않는다.`,
          facts: calc(`${a}*${b}*(${before + rise}-${before})`)
        });
      }, { count: 3 }),
      H('hard-steps', '직육면체를 붙이거나 잘라 낸 입체도형의 부피', '심57·58 ①34 ②83', (d, n) => {
        if (n === 1) {
          const W = d.int(9, 12), D2 = d.int(3, 5), tall = d.int(8, 10), cw = d.int(4, 5), ch = d.int(4, tall - 3), total = W * D2 * tall - cw * D2 * ch;
          return N('직육면체에서 작은 직육면체 1개를 잘라 내고 남은 입체도형이다. 남은 입체도형의 부피는 몇 cm³인가?', total, {
            unit: 'cm³', figure: stepsArt(W - cw, cw, D2, tall, tall - ch, { W: len(W), H: len(tall), D: len(D2), cutW: len(cw), cutH: len(ch) }, `가로 ${W} cm, 세로 ${D2} cm, 높이 ${tall} cm인 직육면체의 오른쪽 위에서 가로 ${cw} cm, 세로 ${D2} cm, 높이 ${ch} cm인 직육면체를 잘라 낸 입체도형`),
            explain: `자르기 전 직육면체의 부피는 ${W} × ${D2} × ${tall} = ${W * D2 * tall}(cm³)이고, 잘라 낸 직육면체의 부피는 ${cw} × ${D2} × ${ch} = ${cw * D2 * ch}(cm³)이다. ${W * D2 * tall} − ${cw * D2 * ch} = ${total}(cm³)`,
            facts: calc(`${W}*${D2}*${tall}-${cw}*${D2}*${ch}`)
          });
        }
        const w1 = d.int(3, 6), w2 = d.int(3, 6), D2 = d.int(3, 6), tall = d.int(6, 10), low = d.int(2, tall - 3), total = w1 * D2 * tall + w2 * D2 * low;
        return N('직육면체 2개를 옆으로 붙여 만든 입체도형이다. 이 입체도형의 부피는 몇 cm³인가?', total, {
          unit: 'cm³', figure: stepsArt(w1, w2, D2, tall, low, { w1: len(w1), w2: len(w2), H: len(tall), h: len(low), D: len(D2) }, `직육면체 2개를 옆으로 붙여 만든 입체도형. 왼쪽 직육면체는 가로 ${w1} cm, 세로 ${D2} cm, 높이 ${tall} cm이고 오른쪽 직육면체는 가로 ${w2} cm, 세로 ${D2} cm, 높이 ${low} cm`),
          explain: `왼쪽 직육면체의 부피는 ${w1} × ${D2} × ${tall} = ${w1 * D2 * tall}(cm³), 오른쪽 직육면체의 부피는 ${w2} × ${D2} × ${low} = ${w2 * D2 * low}(cm³)이다. ${w1 * D2 * tall} + ${w2 * D2 * low} = ${total}(cm³)`,
          facts: calc(`${w1}*${D2}*${tall}+${w2}*${D2}*${low}`)
        });
      }, { count: 2 }),
      H('hard-cube-skin-volume', '정육면체의 겉넓이에서 부피 구하기', '심49 ②74 ③69', (d) => {
        // 부피를 묻는데 그림은 넓이를 구하기 쉬운 전개도이다. 넓이를 6으로 나누어 한 면의 넓이부터 구해야 한다.
        const s = d.int(2, 10), skin = s * s * 6, room = s * s * s;
        return N(`정육면체의 전개도의 넓이가 ${skin} cm²이다. 이 전개도를 접어서 만든 정육면체의 부피는 몇 cm³인가?`, room, {
          unit: 'cm³', figure: netArt(cubeNet(d).rects, { unit: 28, label: '정육면체의 전개도' }),
          explain: `전개도의 넓이는 정육면체의 겉넓이와 같다. 한 면의 넓이는 ${skin} ÷ 6 = ${s * s}(cm²)이고 ${s} × ${s} = ${s * s}이므로 한 모서리의 길이는 ${s} cm이다. 부피는 ${s} × ${s} × ${s} = ${room}(cm³)이다.`,
          facts: { range: { ineq: `x*x*216>${skin * skin * skin - 1}`, lo: 1, hi: 1100, want: 'min' } }
        });
      }),
      H('hard-cube-volume-skin', '정육면체의 부피에서 겉넓이 구하기', '심50 ①72 ②75', (d) => {
        const s = d.int(2, 10), skin = s * s * 6, room = s * s * s;
        return N(`부피가 ${room} cm³인 정육면체의 겉넓이는 몇 cm²인가?`, skin, {
          unit: 'cm²', explain: `같은 수를 세 번 곱하여 ${josa(room, '이/가')} 되는 수를 찾으면 ${s} × ${s} × ${s} = ${room}이므로 한 모서리의 길이는 ${s} cm이다. 겉넓이는 ${s} × ${s} × 6 = ${skin}(cm²)이다.`,
          facts: { range: { ineq: `x*x*x>${216 * room * room - 1}`, lo: 1, hi: 700, want: 'min' } }
        });
      }, { standard: SURF }),
      H('hard-volume-surface', '부피에서 모서리를 구해 겉넓이 구하기', '심51 ①71 ②79 ③73', (d) => {
        const v = three(d, range(3, 10), null, 2.4), ax = d.int(0, 2), [p, q] = v.filter((_, i) => i !== ax), r = v[ax], shown = v.map((x, i) => (i === ax ? null : len(x)));
        return N(`부피가 ${prod(v)} cm³인 직육면체이다. 이 직육면체의 겉넓이는 몇 cm²인가?`, surf(v), {
          unit: 'cm²', figure: boxArt(v, shown, { label: `직육면체의 겨냥도. ${AX.filter((_, i) => i !== ax).map((name, i) => `${name} ${[p, q][i]} cm`).join(', ')}. ${AX[ax]}는 적혀 있지 않다.` }),
          explain: `${p} × ${q} = ${p * q}이므로 ${AX[ax]}는 ${prod(v)} ÷ ${p * q} = ${r}(cm)이다. 겉넓이는 ${surfShown(v)}이다.`,
          facts: calc(`(${p}*${q}+(${p}+${q})*(${prod(v)}/(${p}*${q})))*2`, [2])
        });
      }, { standard: SURF }),
      H('hard-same-volume', '부피가 같은 두 입체도형에서 모서리 구하기', '심21 ①30·32 ②34 ③66', (d, n) => {
        if (n === 1) {
          const [a, b, c, s] = d.pick(CUBE_TWIN), v = d.shuffle([a, b, c]);
          return N(`${text3(v)}인 직육면체와 부피가 같은 정육면체가 있다. 이 정육면체의 한 모서리의 길이는 몇 cm인가?`, s, {
            unit: 'cm', explain: `직육면체의 부피는 ${v.join(' × ')} = ${prod(v)}(cm³)이다. ${s} × ${s} × ${s} = ${prod(v)}이므로 정육면체의 한 모서리의 길이는 ${s} cm이다.`,
            facts: { range: { ineq: `x*x*x>${v.join('*')}-1`, lo: 1, hi: 20, want: 'min' } }
          });
        }
        const m = d.until(() => { const v = three(d, range(3, 10), (w) => prod(w) <= 400, 3), p = d.int(3, 10), q = d.int(3, 10); return { v, w: [p, q, prod(v) / (p * q)] }; },
          (x) => x.w[0] * x.w[1] <= 60 && Number.isInteger(x.w[2]) && x.w[2] >= 2 && x.w[2] <= 12 && new Set(x.w).size === 3 && Math.max(...x.w) <= 3 * Math.min(...x.w) && x.w.slice().sort().join() !== x.v.slice().sort().join() && x.w.filter((y) => x.v.includes(y)).length <= 1);
        return N('직육면체 가와 나의 부피가 같다. □ 안에 알맞은 수는?', m.w[2], {
          figure: tiles([boxArt(m.v, cms(m.v), { size: [108, 84], label: `직육면체의 겨냥도. ${said3(m.v)}` }), boxArt(m.w, [len(m.w[0]), len(m.w[1]), '□ cm'], { size: [108, 84], label: `직육면체의 겨냥도. 가로 ${m.w[0]} cm, 세로 ${m.w[1]} cm, 높이 □ cm` })]),
          explain: `가의 부피는 ${m.v.join(' × ')} = ${prod(m.v)}(cm³)이다. 나의 부피도 ${prod(m.v)} cm³이므로 ${m.w[0]} × ${m.w[1]} × □ = ${prod(m.v)}이고, □ = ${prod(m.v)} ÷ ${m.w[0] * m.w[1]} = ${m.w[2]}이다.`,
          facts: calc(`${m.v.join('*')}/(${m.w[0]}*${m.w[1]})`)
        });
      }, { count: 2 }),
      H('hard-fit', '상자에 빈틈없이 넣을 수 있는 작은 상자의 수', '심67 ①52 ②52 ③44', (d, n) => {
        if (n === 1) {
          // m와 cm가 섞여 있다. 부피끼리 나누려면 단위부터 맞추어야 한다.
          const v = three(d, range(2, 5)), each = v.map((x) => x * 2), total = prod(each);
          return N(`${text3(v, 'm')}인 직육면체 모양 창고에 한 모서리의 길이가 50 cm인 정육면체 모양 상자를 빈틈없이 가득 쌓으려고 한다. 상자는 모두 몇 개 쌓을 수 있는가?`, total, {
            unit: '개', explain: `1 m = 100 cm이므로 1 m에는 한 모서리의 길이가 50 cm인 상자가 2개 놓인다. 가로에 ${each[0]}개, 세로에 ${each[1]}개씩 ${each[2]}층으로 쌓을 수 있으므로 ${each.join(' × ')} = ${total}(개)이다.`,
            facts: calc(v.map((x) => `(${x}*100/50)`).join('*'), [100])
          });
        }
        const small = d.until(() => [d.int(2, 5), d.int(1, 4), d.int(1, 3)], (w) => new Set(w).size === 3), each = [d.int(2, 5), d.int(2, 5), d.int(2, 5)], big = small.map((x, i) => x * each[i]);
        return N(`${text3(small)}인 직육면체 모양 지우개를 ${text3(big)}인 직육면체 모양 상자에 모두 같은 방향으로 놓아 빈틈없이 가득 채우려고 한다. 지우개는 모두 몇 개 필요한가?`, prod(each), {
          unit: '개', explain: `가로에 ${big[0]} ÷ ${small[0]} = ${each[0]}(개), 세로에 ${big[1]} ÷ ${small[1]} = ${each[1]}(개)씩 놓이고, 높이로 ${big[2]} ÷ ${small[2]} = ${each[2]}(층) 쌓인다. ${each.join(' × ')} = ${prod(each)}(개)`,
          facts: calc(big.map((x, i) => `(${x}/${small[i]})`).join('*'))
        });
      }, { count: 2 }),
      H('hard-scale-times', '모서리를 늘인 직육면체의 부피는 처음의 몇 배', '심68 ①36 ②80·81 ③26', (d, n) => {
        // 어떤 아이가 틀리는가: 모서리가 2배이면 부피도 2배라고 여긴다. 두 부피를 구해 나눈다.
        // 3배로 늘이는 것은 새 부피가 커지므로 짧은 모서리로만 낸다(손으로 셈할 만한 수).
        const k = d.pick([2, 3]), v = three(d, k === 2 ? range(2, 5) : range(1, 4), null, 4);
        if (n === 1) {
          const [i, j] = d.shuffle([0, 1, 2]).slice(0, 2).sort((x, y) => x - y), w = v.map((x, at) => (at === i || at === j ? x * k : x));
          return N(`${text3(v)}인 직육면체의 ${AX[i]}와 ${AX[j]}만 ${k}배로 늘여 새 직육면체를 만들었다. 새 직육면체의 부피는 처음 직육면체의 부피의 몇 배인가?`, k * k, {
            unit: '배', explain: `처음 직육면체의 부피는 ${v.join(' × ')} = ${prod(v)}(cm³)이고, 새 직육면체의 부피는 ${w.join(' × ')} = ${prod(w)}(cm³)이다. ${prod(w)} ÷ ${prod(v)} = ${k * k}(배). 두 모서리가 ${k}배씩 되면 부피는 ${k} × ${k} = ${k * k}(배)가 된다.`,
            facts: calc(`${v.map((x, at) => (at === i || at === j ? `(${x}*${k})` : x)).join('*')}/(${v.join('*')})`)
          });
        }
        const w = v.map((x) => x * k);
        return N(`${text3(v)}인 직육면체의 가로, 세로, 높이를 모두 ${k}배로 늘여 새 직육면체를 만들었다. 새 직육면체의 부피는 처음 직육면체의 부피의 몇 배인가?`, k * k * k, {
          unit: '배', explain: `처음 직육면체의 부피는 ${v.join(' × ')} = ${prod(v)}(cm³)이고, 새 직육면체의 부피는 ${w.join(' × ')} = ${prod(w)}(cm³)이다. ${prod(w)} ÷ ${prod(v)} = ${k * k * k}(배). 세 모서리가 ${k}배씩 되면 부피는 ${k} × ${k} × ${k} = ${k * k * k}(배)가 된다.`,
          facts: calc(`${v.map((x) => `(${x}*${k})`).join('*')}/(${v.join('*')})`)
        });
      }, { count: 2 }),
      H('hard-surface-edge', '겉넓이와 두 모서리로 나머지 모서리 구하기', '심43·44 ①67 ②76 ③71', (d, n) => {
        if (n === 1) {
          // 전개도: 옆면 넷이 한 줄로 이어진 직사각형의 넓이를 그 긴 변(밑면의 둘레)으로 나눈다.
          const v = three(d, range(3, 9), null, 2.4), made = netWith(d, v, (L, strip) => (L === strip.cross ? '□ cm' : len(L)), { label: (strip) => `직육면체의 전개도. 옆면 4개가 한 줄로 이어져 있다. 테두리의 세 선분의 길이 ${v.filter((x) => x !== strip.cross).map((x) => len(x)).join(', ')}, □ cm` });
          const ask = made.strip.cross, [p, q] = v.filter((x) => x !== ask), side = surf(v) - p * q * 2;
          return N(`겉넓이가 ${surf(v)} cm²인 직육면체의 전개도이다. □ 안에 알맞은 수는?`, ask, {
            figure: made.figure,
            explain: `두 밑면의 넓이는 ${p} × ${q} × 2 = ${p * q * 2}(cm²)이므로 옆면 4개의 넓이의 합은 ${surf(v)} − ${p * q * 2} = ${side}(cm²)이다. 한 줄로 이어진 옆면 4개는 한 변이 (${p} + ${q}) × 2 = ${(p + q) * 2}(cm), 다른 한 변이 □ cm인 직사각형이므로 □ = ${side} ÷ ${(p + q) * 2} = ${ask}이다.`,
            facts: calc(`(${surf(v)}-${p}*${q}*2)/((${p}+${q})*2)`, [2])
          });
        }
        const v = three(d, range(3, 10), null, 2.4), [a, b, c] = v, side = surf(v) - a * b * 2;
        return N(`겉넓이가 ${surf(v)} cm²인 직육면체이다. □ 안에 알맞은 수는?`, c, {
          figure: boxArt(v, [len(a), len(b), '□ cm'], { label: `직육면체의 겨냥도. 가로 ${a} cm, 세로 ${b} cm, 높이 □ cm` }),
          explain: `두 밑면의 넓이는 ${a} × ${b} × 2 = ${a * b * 2}(cm²)이므로 옆면 4개의 넓이의 합은 ${surf(v)} − ${a * b * 2} = ${side}(cm²)이다. 옆면 4개를 펼치면 가로가 (${a} + ${b}) × 2 = ${(a + b) * 2}(cm), 세로가 □ cm인 직사각형이므로 □ = ${side} ÷ ${(a + b) * 2} = ${c}이다.`,
          facts: calc(`(${surf(v)}-${a}*${b}*2)/((${a}+${b})*2)`, [2])
        });
      }, { count: 2, standard: SURF }),
      H('hard-same-surface', '직육면체와 겉넓이가 같은 정육면체의 한 모서리', '심46 ①73 ②78', (d) => {
        const [a, b, c, s] = d.pick(SKIN_TWIN), v = d.shuffle([a, b, c]);
        return N(`${text3(v)}인 직육면체와 겉넓이가 같은 정육면체가 있다. 이 정육면체의 한 모서리의 길이는 몇 cm인가?`, s, {
          unit: 'cm', explain: `직육면체의 겉넓이는 ${surfShown(v)}이다. 정육면체의 한 면의 넓이는 ${surf(v)} ÷ 6 = ${surf(v) / 6}(cm²)이고 ${s} × ${s} = ${surf(v) / 6}이므로 한 모서리의 길이는 ${s} cm이다.`,
          facts: { range: { ineq: `x*x*6>${surfExpr(v)}-1`, lo: 1, hi: 30, want: 'min' } }
        });
      }, { standard: SURF }),
      H('hard-m3-back', '단위를 바꾼 뒤 모서리 구하기', '심20·30 ①53 ②50', (d, n) => {
        if (n === 1) {
          const a = d.pick([2, 4, 6]), b = d.pick([50, 150, 250]), base = (a * b) / 100, c = d.until(() => d.int(2, 5), (x) => x !== a), total = base * c;
          return N(`부피가 ${total} m³인 직육면체 모양 물탱크의 가로가 ${a} m, 세로가 ${b} cm일 때 높이는 몇 m인가?`, c, {
            unit: 'm', explain: `${b} cm = ${b / 100} m이므로 한 밑면의 넓이는 ${a} × ${b / 100} = ${base}(m²)이다. 높이는 ${total} ÷ ${base} = ${c}(m)이다.`,
            facts: calc(`${total}/(${a}*${b}/100)`, [100])
          });
        }
        const s = d.int(2, 6), total = s * s * s;
        return N(`부피가 ${total * 1000000} cm³인 정육면체 모양 물탱크의 한 모서리의 길이는 몇 m인가?`, s, {
          unit: 'm', explain: `1000000 cm³ = 1 m³이므로 ${total * 1000000} cm³ = ${total} m³이다. ${s} × ${s} × ${s} = ${total}이므로 한 모서리의 길이는 ${s} m이다.`,
          facts: { range: { ineq: `x*x*x>${total * 1000000}/1000000-1`, lo: 1, hi: 12, want: 'min' } }
        });
      }, { count: 2, standard: UNIT }),
      H('hard-block-edge', '쌓은 전체의 부피로 쌓기나무 한 개의 모서리 구하기', '②36 심64', (d) => {
        const s = d.pick([2, 3, 4]), v = d.until(() => [d.int(2, 4), d.int(2, 3), d.int(1, 3)], (w) => prod(w) >= 8 && prod(w) <= (s === 4 ? 12 : 24)), k = prod(v), total = k * s * s * s;
        return N(`크기가 같은 정육면체 모양 쌓기나무를 빈틈없이 쌓아 직육면체를 만들었다. 이 직육면체의 부피가 ${total} cm³일 때 쌓기나무 한 개의 한 모서리의 길이는 몇 cm인가?`, s, {
          unit: 'cm', figure: blockArt(v),
          explain: `쌓기나무는 ${v.join(' × ')} = ${k}(개)이므로 한 개의 부피는 ${total} ÷ ${k} = ${s * s * s}(cm³)이다. ${s} × ${s} × ${s} = ${s * s * s}이므로 한 모서리의 길이는 ${s} cm이다.`,
          facts: { range: { ineq: `x*x*x>${total}/(${v.join('*')})-1`, lo: 1, hi: 12, want: 'min' } }
        });
      }),
      H('hard-stacked-m3', '상자를 쌓아 만든 직육면체의 부피를 m³로 구하기', '②51 심41', (d) => {
        // 쌓은 수를 길이로 바꾸고(50 cm = 0.5 m) 단위를 맞추어야 한다.
        const v = d.until(() => [d.int(2, 4), d.int(2, 3), d.int(1, 4)], (w) => prod(w) % 8 === 0), size = v.map((x) => x / 2);
        return N('한 모서리의 길이가 50 cm인 정육면체 모양 상자를 빈틈없이 쌓아 직육면체를 만들었다. 쌓아 만든 직육면체의 부피는 몇 m³인가?', prod(v) / 8, {
          unit: 'm³', figure: cubesArt(brick(v), { label: `상자를 가로 ${v[0]}개, 세로 ${v[1]}개, 높이 ${v[2]}층으로 빈틈없이 쌓은 직육면체` }),
          explain: `상자의 한 모서리의 길이는 50 cm = 0.5 m이다. 쌓아 만든 직육면체는 가로 ${size[0]} m, 세로 ${size[1]} m, 높이 ${size[2]} m이므로 부피는 ${size.join(' × ')} = ${prod(v) / 8}(m³)이다.`,
          facts: calc(v.map((x) => `(${x}*50/100)`).join('*'), [100])
        });
      }, { standard: UNIT })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
