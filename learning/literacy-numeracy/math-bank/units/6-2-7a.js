// 6학년 2학기 종합 — 6학년 2학기까지 배운 여러 단원(분수의 나눗셈, 공간과 입체, 소수의 나눗셈, 비례식과 비례배분, 원의 넓이, 원기둥·원뿔·구)의
// 개념을 연결하고, 도형의 이동·비례배분·거꾸로 추론·전개도 대응으로 해결하는 응용 문항.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, N, D } = B.kit;
  const K622 = B.kit.blocks622;
  const K626 = B.kit.round626;
  const U = '6-2-7';
  const FDIV = '6수01-11', SPACE = '6수03-09', RATIO = '6수04-05', CIRCLE = '6수03-16', SOLID = '6수03-07', NET = '6수03-08';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref, make }, more || {});
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (num, den, pair) => frac(num, den) + tail(num, pair);
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  // ── 그림 도구(풀이 스포일러 없이 문제 상황만 정확히 그린다) ─────────────
  // 1) 일부분이 겹쳐진 두 직사각형 가, 나 그림
  function overlapRectsSvg(areaA) {
    const W = 252, Hh = 142;
    let out = '';
    // 직사각형 가(왼쪽 위)와 나(오른쪽 아래) 및 겹친 영역
    out += `<rect x="28" y="22" width="112" height="76" style="fill:#dbeafe;stroke:#1e293b;stroke-width:1.4"/>`;
    out += `<rect x="96" y="48" width="124" height="72" style="fill:#fef3c7;stroke:#1e293b;stroke-width:1.4"/>`;
    out += `<rect x="96" y="48" width="44" height="50" style="fill:#86efac;stroke:#1e293b;stroke-width:1.4"/>`;
    out += `<rect x="28" y="22" width="112" height="76" style="fill:none;stroke:#1e293b;stroke-width:1.4"/>`;
    out += `<text x="62" y="54" text-anchor="middle" style="font-size:12px;font-weight:700;fill:#1e3a8a">가</text>`;
    out += `<text x="62" y="72" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e3a8a">(${areaA} cm²)</text>`;
    out += `<text x="176" y="88" text-anchor="middle" style="font-size:12px;font-weight:700;fill:#92400e">나</text>`;
    const said = `넓이가 ${areaA} cm²인 직사각형 가와 직사각형 나가 일부분이 겹쳐진 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 2) 평행한 두 직선 사이에 놓여 높이가 같은 두 평행사변형 가, 나 그림
  function sameHeightParaSvg(b1, b2) {
    const W = 268, Hh = 144, yTop = 32, yBot = 112;
    const scale = Math.min(136 / (b1 + b2), 6);
    const w1 = Math.max(36, b1 * scale), w2 = Math.max(48, b2 * scale);
    const x1 = 36, x2 = x1 + w1 + 26, shift = 16;
    let out = '';
    // 평행한 두 직선
    out += `<line x1="16" y1="${yTop}" x2="252" y2="${yTop}" style="stroke:#475569;stroke-width:1.4"/>`;
    out += `<line x1="16" y1="${yBot}" x2="252" y2="${yBot}" style="stroke:#475569;stroke-width:1.4"/>`;
    // 평행사변형 가, 나
    out += `<polygon points="${x1 + shift},${yTop} ${x1 + shift + w1},${yTop} ${x1 + w1},${yBot} ${x1},${yBot}" style="fill:#dbeafe;stroke:#1e293b;stroke-width:1.5;stroke-linejoin:round"/>`;
    out += `<polygon points="${x2 + shift},${yTop} ${x2 + shift + w2},${yTop} ${x2 + w2},${yBot} ${x2},${yBot}" style="fill:#fde68a;stroke:#1e293b;stroke-width:1.5;stroke-linejoin:round"/>`;
    out += `<text x="${(x1 + w1 / 2 + shift / 2).toFixed(1)}" y="${(yTop + yBot) / 2 + 4}" text-anchor="middle" style="font-size:12px;font-weight:700;fill:#1e3a8a">가</text>`;
    out += `<text x="${(x2 + w2 / 2 + shift / 2).toFixed(1)}" y="${(yTop + yBot) / 2 + 4}" text-anchor="middle" style="font-size:12px;font-weight:700;fill:#92400e">나</text>`;
    out += `<text x="${(x1 + w1 / 2).toFixed(1)}" y="${yBot + 17}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${b1} cm</text>`;
    out += `<text x="${(x2 + w2 / 2).toFixed(1)}" y="${yBot + 17}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${b2} cm</text>`;
    const said = `평행한 두 직선 사이에 놓인 밑변이 ${b1} cm인 평행사변형 가와 밑변이 ${b2} cm인 평행사변형 나`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 3) 똑같은 원기둥 모양의 통 k개를 나란히 묶은 위에서 본 그림(보조선 스포일러 없이 반지름만 표시)
  function strappedCansSvg(r, k) {
    const rad = k === 4 ? 22 : 25;
    const x0 = 58 + rad, W = x0 + (k * 2 - 1) * rad + 20, Hh = 104, cy = 52;
    const xLast = x0 + (k - 1) * 2 * rad;
    let out = '';
    for (let i = 0; i < k; i += 1) {
      const cx = x0 + i * 2 * rad;
      out += `<circle cx="${cx}" cy="${cy}" r="${rad}" style="fill:#fff8e1;stroke:#1e293b;stroke-width:1.4"/>`;
      out += `<circle cx="${cx}" cy="${cy}" r="2.2" style="fill:#1e293b"/>`;
    }
    // 바깥을 감싼 붉은 테이프
    const bandD = `M${x0} ${cy - rad} H${xLast} A${rad} ${rad} 0 0 1 ${xLast} ${cy + rad} H${x0} A${rad} ${rad} 0 0 1 ${x0} ${cy - rad} Z`;
    out += `<path d="${bandD}" style="fill:none;stroke:#dc2626;stroke-width:2.4"/>`;
    // 첫째 원의 반지름 표시(위쪽 반지름 선분 + 왼쪽 바깥 지시선)
    const midY = cy - rad * 0.55;
    out += `<line x1="${x0}" y1="${cy}" x2="${x0}" y2="${cy - rad}" style="stroke:#1e3a8a;stroke-width:1.5"/>`;
    out += `<circle cx="${x0}" cy="${midY.toFixed(1)}" r="1.8" style="fill:#1e3a8a"/>`;
    out += `<line x1="${(x0 - rad - 10).toFixed(1)}" y1="${midY.toFixed(1)}" x2="${x0}" y2="${midY.toFixed(1)}" style="stroke:#475569;stroke-width:1"/>`;
    out += `<text x="${(x0 - rad - 13).toFixed(1)}" y="${(midY + 4).toFixed(1)}" text-anchor="end" style="font-size:11px;font-weight:700;fill:#1e3a8a">${r} cm</text>`;
    const said = `밑면의 반지름이 ${r} cm인 원기둥 모양의 통 ${k}개를 나란히 붙여 테이프로 한 바퀴 둘러 묶은 위에서 본 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 4) 구가 꼭 맞게 들어 있는 원기둥 그림
  function sphereInCylSvg(r) {
    return K626.one((cv) => {
      const R = 36, h = R * 2;
      K626.addCyl(cv, [0, 0], R, h, { side: 'rgba(219,234,254,0.38)', top: 'rgba(219,234,254,0.55)' });
      K626.addSphere(cv, [0, R], R, { fill: 'rgba(253,230,138,0.65)' });
      cv.add(K626.stroke([0, R], [R, R]) + K626.dot([0, R], 2.4));
      K626.leader(cv, [R + 28, R - 14], [R * 0.5, R], r + ' cm');
    }, `반지름이 ${r} cm인 구가 위아래 밑면과 옆면에 꼭 맞게 들어 있는 원기둥`);
  }

  B.addUnit({
    id: U, grade: 6, semester: 2, no: 7, title: '초 6학년 2학기 종합', semesterAdvanced: true, version: 1,
    groups: [
      {
        id: 'hard', title: '초 6학년 2학기 종합', standard: CIRCLE,
        types: [
          H('adv-cyl-net-base-area', '원기둥의 전개도에서 옆면의 가로로 한 밑면의 넓이 구하기', '수집본 6-2-6 심화꼴 40번(비상·YBM·디딤돌 구제)', (d) => {
            const [r, h] = d.pick([
              [2, 5],
              [3, 7],
              [3, 8],
              [4, 9],
              [4, 10],
              [5, 12]
            ]);
            const dia = r * 2, around = Math.round(dia * 31) / 10, baseArea = Math.round(r * r * 31) / 10;
            return D(`원기둥의 전개도에서 옆면인 직사각형의 가로가 ${around} cm, 세로가 ${h} cm이다. 이 전개도를 접어서 만든 원기둥의 한 밑면의 넓이는 몇 cm²인가? (원주율: 3.1)`, baseArea, {
              unit: 'cm²',
              figure: K626.netOf(dia, h, 3.1, {
                wText: around + ' cm',
                hText: h + ' cm',
                label: `원기둥의 전개도. 옆면의 가로 ${around} cm, 세로 ${h} cm`
              }),
              hint: `원기둥의 전개도에서 옆면의 가로는 밑면의 둘레(원주)와 같습니다. 먼저 (${around} ÷ 3.1)로 밑면의 지름과 반지름을 구한 뒤 원의 넓이를 구해 보세요.`,
              explain: `원기둥의 전개도에서 옆면의 가로(${around} cm)는 밑면인 원의 둘레와 같으므로, 밑면의 지름은 ${around} ÷ 3.1 = ${dia}(cm)이고 반지름은 ${dia} ÷ 2 = ${r}(cm)이다. 따라서 한 밑면의 넓이는 ${r} × ${r} × 3.1 = ${baseArea}(cm²)이다.`,
              facts: { calc: [[`(${around}/3.1/2)*(${around}/3.1/2)*3.1`, 0]], unseen: [2] }
            });
          }, { standard: NET }),
          H('adv-blocks-top-volume', '위에서 본 모양에 적힌 쌓기나무 수로 입체도형의 부피 구하기', '수집본 6-2-2 심화꼴 60·61번 구제 · 6-1-6 부피 융합', (d) => {
            const hGrid = d.pick([
              [[2, 1, 0], [3, 2, 1], [0, 1, 2]],
              [[3, 2, 1], [1, 2, 0], [0, 1, 1]],
              [[1, 3, 2], [2, 1, 1], [0, 2, 1]],
              [[2, 2, 1], [3, 1, 0], [1, 2, 2]],
              [[3, 1, 2], [2, 3, 1], [0, 1, 2]]
            ]);
            const edge = d.pick([2, 3, 4]), oneVol = edge * edge * edge;
            const nums = [];
            hGrid.forEach((row) => row.forEach((v) => { if (v > 0) nums.push(v); }));
            const count = nums.reduce((s, v) => s + v, 0), totalVol = count * oneVol;
            return N(`한 모서리의 길이가 ${edge} cm인 정육면체 모양의 쌓기나무로 쌓은 입체도형을 위에서 본 모양에 각 자리에 쌓인 쌓기나무의 수를 적은 그림이다. 이 입체도형의 부피는 몇 cm³인가?`, totalVol, {
              unit: 'cm³',
              figure: K622.topArt(hGrid, { numbers: true }),
              hint: `먼저 위에서 본 모양에 적힌 수를 모두 더해 쌓기나무가 모두 몇 개인지 구한 뒤, 쌓기나무 1개의 부피(${edge} × ${edge} × ${edge})를 곱해 보세요.`,
              explain: `사용된 쌓기나무는 모두 ${nums.join(' + ')} = ${count}(개)이다. 한 모서리가 ${edge} cm인 쌓기나무 1개의 부피는 ${edge} × ${edge} × ${edge} = ${oneVol}(cm³)이므로, 입체도형 전체의 부피는 ${oneVol} × ${count} = ${totalVol}(cm³)이다.`,
              facts: { calc: [[`(${nums.join('+')})*(${edge}*${edge}*${edge})`, 0]] }
            });
          }, { standard: SPACE }),
          H('adv-overlap-frac-area', '겹친 부분의 넓이를 매개로 분수의 나눗셈을 이용해 넓이 구하기', '수집본 6-2-4 심화꼴 48번(디딤돌 구제, 해설 개작)', (d) => {
            const [a1, b1, a2, b2, mult] = d.pick([
              [2, 7, 3, 5, 3],
              [3, 8, 2, 5, 2],
              [2, 5, 3, 4, 3],
              [3, 7, 2, 3, 2],
              [4, 9, 2, 5, 2]
            ]);
            const overlap = a1 * a2 * mult, areaA = b1 * a2 * mult, areaB = b2 * a1 * mult;
            return N(`그림과 같이 두 직사각형 가와 나의 일부분이 겹쳐 있다. 색칠한 겹친 부분의 넓이는 가의 넓이의 ${frac(a1, b1)}이고 나의 넓이의 ${frac(a2, b2)}이다. 직사각형 가의 넓이가 ${areaA} cm²일 때, 직사각형 나의 넓이는 몇 cm²인가?`, areaB, {
              unit: 'cm²',
              figure: overlapRectsSvg(areaA),
              hint: `먼저 가의 넓이(${areaA} cm²)에 ${frac(a1, b1)}을 곱해 색칠한 겹친 부분의 넓이를 구하세요. 그 넓이가 나의 넓이의 ${frac(a2, b2)}이므로 분수의 나눗셈으로 나의 넓이를 구할 수 있습니다.`,
              explain: `색칠한 겹친 부분의 넓이는 가의 넓이의 ${frac(a1, b1)}이므로 ${areaA} × ${frac(a1, b1)} = ${overlap}(cm²)이다. 이 ${overlap} cm²가 나의 넓이의 ${frac(a2, b2)}이므로, 직사각형 나의 넓이는 ${overlap} ÷ ${frac(a2, b2)} = ${overlap} ÷ ${a2} × ${b2} = ${areaB}(cm²)이다.`,
              facts: { calc: [[`(${areaA}*${a1}/${b1})/(${a2}/${b2})`, 0]] }
            });
          }, { standard: FDIV }),
          H('adv-wire-ratio-rect-area', '철사 길이의 절반을 비례배분하여 직사각형의 넓이 구하기', '수집본 6-2-4 심화꼴 51번(미래엔·천재 구제)', (d) => {
            const [rW, rH, k] = d.pick([
              [5, 3, 4],
              [5, 4, 4],
              [7, 3, 3],
              [7, 5, 3],
              [4, 3, 6],
              [6, 5, 4]
            ]);
            const w = rW * k, h = rH * k, halfPerim = w + h, wireLen = halfPerim * 2, area = w * h;
            return N(`길이가 ${wireLen} cm인 철사를 남김없이 모두 사용하여 가로와 세로의 비가 ${rW} : ${rH}인 직사각형 한 개를 만들었다. 만든 직사각형의 넓이는 몇 cm²인가?`, area, {
              unit: 'cm²',
              hint: `직사각형의 둘레(${wireLen} cm)에는 가로가 2번, 세로가 2번 들어 있습니다. 먼저 둘레를 2로 나누어 (가로 + 세로)를 구한 뒤 ${rW} : ${rH}로 비례배분해 보세요.`,
              explain: `직사각형의 (가로) + (세로)는 둘레의 절반인 ${wireLen} ÷ 2 = ${halfPerim}(cm)이다. ${halfPerim} cm를 ${rW} : ${rH}로 비례배분하면 가로는 ${halfPerim} × ${frac(rW, rW + rH)} = ${w}(cm), 세로는 ${halfPerim} × ${frac(rH, rW + rH)} = ${h}(cm)이다. 따라서 직사각형의 넓이는 ${w} × ${h} = ${area}(cm²)이다.`,
              facts: { calc: [[`(${wireLen}/2*${rW}/(${rW}+${rH}))*(${wireLen}/2*${rH}/(${rW}+${rH}))`, 0]], unseen: [2] }
            });
          }, { standard: RATIO }),
          H('adv-same-height-para-share', '높이가 같은 두 평행사변형의 밑변의 비로 넓이를 비례배분하기', '수집본 6-2-4 심화꼴 52번(미래엔·디딤돌 구제)', (d) => {
            const [b1, b2, h] = d.pick([
              [6, 9, 8],
              [8, 12, 7],
              [9, 15, 6],
              [10, 15, 8],
              [8, 10, 9]
            ]);
            const g = gcd(b1, b2), s1 = b1 / g, s2 = b2 / g;
            const areaA = b1 * h, areaB = b2 * h, sumArea = areaA + areaB;
            return N(`그림과 같이 평행한 두 직선 사이에 놓인 두 평행사변형 가와 나의 밑변의 길이는 각각 ${b1} cm, ${b2} cm이다. 두 평행사변형 가와 나의 넓이의 합이 ${sumArea} cm²일 때, 평행사변형 가의 넓이는 몇 cm²인가?`, areaA, {
              unit: 'cm²',
              figure: sameHeightParaSvg(b1, b2),
              hint: `평행한 두 직선 사이에 있는 두 평행사변형은 높이가 서로 같습니다. 높이가 같으면 넓이의 비는 밑변의 길이의 비(${b1} : ${b2})와 같음을 이용해 넓이의 합을 비례배분해 보세요.`,
              explain: `두 평행사변형 가와 나는 평행한 두 직선 사이에 있으므로 높이가 서로 같다. 따라서 넓이의 비는 밑변의 길이의 비와 같은 ${b1} : ${b2} = ${s1} : ${s2}이다. 넓이의 합 ${sumArea} cm²를 ${s1} : ${josa(s2, '으로/로')} 비례배분하면 평행사변형 가의 넓이는 ${sumArea} × ${frac(s1, s1 + s2)} = ${areaA}(cm²)이다.`,
              facts: { calc: [[`${sumArea}*${b1}/(${b1}+${b2})`, 0]] }
            });
          }, { standard: RATIO }),
          H('adv-strapped-cans-tape', '원기둥 모양의 통을 묶은 테이프를 굽은 부분과 곧은 부분으로 나누어 구하기', '수집본 6-2-5 심화꼴 69번(디딤돌·동아·미래엔 구제)', (d) => {
            const [r, k] = d.pick([
              [2, 2], [3, 2], [4, 2],
              [2, 3], [3, 3], [4, 3],
              [2, 4], [3, 4]
            ]);
            const dia = r * 2, straightCount = (k - 1) * 2, straightLen = dia * straightCount;
            const curveLen = Math.round(dia * 31) / 10, totalLen = Math.round(dia * 31 + straightLen * 10) / 10;
            return D(`밑면의 반지름이 ${r} cm인 똑같은 원기둥 모양의 통 ${k}개를 그림과 같이 나란히 붙여 놓고 테이프로 팽팽하게 한 바퀴 둘러 묶었다. 사용한 테이프의 가장 짧은 길이는 몇 cm인가? (단, 매듭의 길이는 생각하지 않는다. 원주율: 3.1)`, totalLen, {
              unit: 'cm',
              figure: strappedCansSvg(r, k),
              hint: '양쪽 끝에 둥글게 감긴 두 반원 부분을 합치면 원 1개의 둘레(원주)가 됩니다. 위쪽과 아래쪽의 곧은 선분 길이가 원의 지름 몇 개와 같은지 나누어 생각해 보세요.',
              explain: `밑면의 지름은 ${r} × 2 = ${dia}(cm)이다. 테이프의 양쪽 끝 굽은 부분 2개를 합치면 지름이 ${dia} cm인 원 1개의 원주와 같으므로 ${dia} × 3.1 = ${curveLen}(cm)이다. 위쪽과 아래쪽의 곧은 부분은 각각 원의 중심 사이를 ${k - 1}번 이은 길이(${dia} × ${k - 1} = ${dia * (k - 1)} cm)가 2군데 있으므로 ${dia * (k - 1)} × 2 = ${straightLen}(cm)이다. 따라서 테이프의 전체 길이는 ${curveLen} + ${straightLen} = ${totalLen}(cm)이다.`,
              facts: { calc: [[`${r}*2*3.1+${r}*2*(${k}-1)*2`, 0]], unseen: [2, 1] }
            });
          }, { standard: CIRCLE }),
          H('adv-spin-cone-front-area', '직각삼각형을 돌려 만든 원뿔을 앞에서 본 모양의 넓이 구하기', '수집본 6-2-6 심화꼴 28·54번(디딤돌·천재 구제)', (d) => {
            const [r, h] = d.pick([
              [4, 9],
              [5, 12],
              [6, 10],
              [7, 12],
              [8, 15],
              [9, 14]
            ]);
            const base = r * 2, area = r * h;
            return N(`직각을 낀 두 변의 길이가 ${r} cm, ${h} cm인 직각삼각형을 그림과 같이 세로 변을 중심으로 한 바퀴 돌려 입체도형을 만들었다. 만든 입체도형을 앞에서 본 모양의 넓이는 몇 cm²인가?`, area, {
              unit: 'cm²',
              figure: K626.spin('tri', 36, 58, {
                aText: r + ' cm',
                bText: h + ' cm',
                label: `밑변이 ${r} cm, 높이가 ${h} cm인 직각삼각형을 세로 변을 중심으로 돌리는 그림`
              }),
              hint: `직각삼각형을 한 바퀴 돌리면 밑면의 반지름이 ${r} cm, 높이가 ${h} cm인 원뿔이 됩니다. 이 원뿔을 앞에서 본 모양은 어떤 평면도형이고 밑변의 길이가 몇 cm인지 생각해 보세요.`,
              explain: `직각삼각형을 세로 변을 중심으로 한 바퀴 돌리면 밑면의 반지름이 ${r} cm이고 높이가 ${h} cm인 원뿔이 만들어진다. 이 원뿔을 앞에서 본 모양은 밑변의 길이가 원뿔 밑면의 지름인 ${r} × 2 = ${base}(cm)이고 높이가 ${h} cm인 이등변삼각형이므로, 그 넓이는 ${base} × ${h} ÷ 2 = ${area}(cm²)이다.`,
              facts: { calc: [[`(${r}*2)*${h}/2`, 0]], unseen: [2] }
            });
          }, { standard: SOLID }),
          H('adv-sphere-in-cyl-side', '구가 꼭 맞게 들어간 원기둥의 전개도에서 옆면의 넓이 구하기', '수집본 6-2-6 심화꼴 57·58번(YBM·미래엔·지학사 구제)', (d) => {
            const r = d.pick([3, 4, 5, 6, 7, 8]);
            const dia = r * 2, cylH = r * 2, around = dia * 3, sideArea = around * cylH;
            return N(`그림과 같이 반지름이 ${r} cm인 구가 원기둥 안에 위아래 밑면과 옆면에 모두 꼭 맞게 들어 있다. 이 원기둥의 전개도에서 옆면인 직사각형의 넓이는 몇 cm²인가? (원주율: 3)`, sideArea, {
              unit: 'cm²',
              figure: sphereInCylSvg(r),
              hint: `반지름이 ${r} cm인 구가 원기둥에 꼭 맞게 들어 있으므로, 원기둥의 밑면의 지름과 원기둥의 높이는 모두 구의 지름(${r} × 2)과 같습니다.`,
              explain: `구의 반지름이 ${r} cm이므로 구가 꼭 맞게 들어간 원기둥의 밑면의 지름은 ${r} × 2 = ${dia}(cm)이고, 원기둥의 높이도 구의 지름과 같은 ${cylH} cm이다. 원기둥의 전개도에서 옆면의 가로는 밑면의 둘레인 ${dia} × 3 = ${around}(cm)이고 세로는 높이인 ${cylH} cm이므로, 옆면의 넓이는 ${around} × ${cylH} = ${sideArea}(cm²)이다.`,
              facts: { calc: [[`(${r}*2*3)*(${r}*2)`, 0]], unseen: [2] }
            });
          }, { standard: NET }),
          H('adv-frac-div-remain-back', '남은 양의 분수 조건에서 분수의 나눗셈으로 처음 양 거꾸로 추론하기', '수집본 6-2-1 심화꼴 47번 구제(거꾸로 추론 해설)', (d) => {
            const [a, b, c, unitKg] = d.pick([
              [4, 2, 3, 4],
              [3, 3, 4, 3],
              [5, 1, 2, 3],
              [4, 3, 5, 3],
              [3, 2, 5, 3]
            ]);
            // 둘째 날 남은 비율 = (c - b) / c. 남은 양 rem2 = (c - b) * (a - 1) * unitKg
            const rem2 = (c - b) * (a - 1) * unitKg;
            const afterDay1 = rem2 / (c - b) * c;
            const initKg = afterDay1 / (a - 1) * a;
            return N(`어느 식당에서 쌀 한 자루를 사서 첫째 날에는 전체의 ${fj(1, a, '을/를')} 사용하고, 둘째 날에는 남은 쌀의 ${fj(b, c, '을/를')} 사용하였더니 ${rem2} kg이 남았다. 처음 자루에 들어 있던 쌀은 몇 kg인가?`, initKg, {
              unit: 'kg',
              hint: `뒤에서부터 거꾸로 추론해 보세요. 둘째 날에 남은 쌀의 ${frac(b, c)}를 사용했으므로 마지막에 남은 ${rem2} kg은 첫째 날 남은 쌀의 (1 − ${frac(b, c)} = ${frac(c - b, c)})입니다.`,
              explain: `둘째 날에 첫째 날 남은 쌀의 ${fj(b, c, '을/를')} 사용했으므로, 마지막에 남은 ${rem2} kg은 첫째 날 남은 쌀의 1 − ${frac(b, c)} = ${frac(c - b, c)}이다. 따라서 첫째 날 사용하고 남은 쌀은 ${rem2} ÷ ${frac(c - b, c)} = ${afterDay1}(kg)이다. 이 ${afterDay1} kg은 처음 쌀의 1 − ${frac(1, a)} = ${frac(a - 1, a)}이므로, 처음 자루에 들어 있던 쌀은 ${afterDay1} ÷ ${frac(a - 1, a)} = ${initKg}(kg)이다.`,
              facts: { value: `(${rem2}/(1-${b}/${c}))/(1-1/${a})`, unseen: [1] }
            });
          }, { standard: FDIV }),
          H('adv-roller-paint-radius', '원기둥 롤러를 굴려 칠한 직사각형 넓이에서 밑면의 반지름 구하기', '수집본 6-2-6 심화꼴 59·60번(미래엔·지학사 구제)', (d) => {
            const [r, w, turns] = d.pick([
              [5, 20, 4],
              [4, 25, 4],
              [5, 16, 5],
              [6, 25, 2],
              [8, 25, 2],
              [5, 24, 5]
            ]);
            const around = Math.round(r * 2 * 314) / 100, rollDist = Math.round(around * turns * 100) / 100, paintedArea = Math.round(rollDist * w);
            return N(`길이가 ${w} cm인 원기둥 모양의 페인트 롤러를 벽에 대고 미끄러지지 않게 똑바로 ${turns}바퀴 굴렸더니, 페인트가 칠해진 직사각형 모양의 넓이가 ${paintedArea} cm²가 되었다. 이 롤러의 한 밑면의 반지름은 몇 cm인가? (원주율: 3.14)`, r, {
              unit: 'cm',
              hint: `먼저 칠해진 직사각형의 넓이(${paintedArea} cm²)를 롤러의 길이(${w} cm)로 나누어 ${turns}바퀴 굴러간 거리를 구한 뒤, 1바퀴 굴러간 거리(밑면의 원주)를 구해 보세요.`,
              explain: `롤러가 ${turns}바퀴 굴러간 거리는 칠해진 직사각형의 넓이를 롤러의 길이(${w} cm)로 나눈 ${paintedArea} ÷ ${w} = ${rollDist}(cm)이다. 따라서 롤러가 1바퀴 굴러간 거리(한 밑면의 원주)는 ${rollDist} ÷ ${turns} = ${around}(cm)이므로, 밑면의 지름은 ${around} ÷ 3.14 = ${r * 2}(cm)이고 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다.`,
              facts: { calc: [[`(${paintedArea}/${w}/${turns})/3.14/2`, 0]], unseen: [2] }
            });
          }, { standard: CIRCLE })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
