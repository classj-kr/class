// 6학년 1학기 학기 실력 — 6학년 1학기까지 배운 여러 단원(비와 비율, 여러 가지 그래프, 직육면체의 부피와 겉넓이, 각기둥과 각뿔, 분수·소수의 나눗셈)의
// 개념을 연결하고, 등적변형·묶음 모형·단면 원리·부피 보존으로 해결하는 응용 문항.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, N } = B.kit;
  const K525 = B.kit.box525;
  const G615 = B.kit.g615;
  const U = '6-1-7';
  const RATIO = '6수04-03', GRAPH = '6수05-02', VOL = '6수03-05', SURF = '6수03-06';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref, make }, more || {});

  // 1) AMC8 2025 1번형: 모눈 정사각형 위에서 합동인 직각삼각형 조각들을 짝지어 색칠한 넓이의 백분율을 구하는 그림
  function gridShadeSvg(n, fullCells, halfPairs) {
    const size = 164, pad = 12, cell = (size - pad * 2) / n;
    let out = `<rect x="${pad}" y="${pad}" width="${size - pad * 2}" height="${size - pad * 2}" style="fill:#f8fafc;stroke:#1e293b;stroke-width:1.5"/>`;
    // 온전한 색칠 칸
    fullCells.forEach(([r, c]) => {
      const x = pad + c * cell, y = pad + r * cell;
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cell.toFixed(1)}" height="${cell.toFixed(1)}" style="fill:#60a5fa;stroke:none"/>`;
    });
    // 대각선으로 반씩 색칠된 칸(절반 삼각형 2개가 모여 1칸이 됨)
    halfPairs.forEach(([r, c, dir]) => {
      const x = pad + c * cell, y = pad + r * cell;
      const pts = dir === 0
        ? `${x.toFixed(1)},${y.toFixed(1)} ${(x + cell).toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${(y + cell).toFixed(1)}`
        : `${(x + cell).toFixed(1)},${y.toFixed(1)} ${(x + cell).toFixed(1)},${(y + cell).toFixed(1)} ${x.toFixed(1)},${(y + cell).toFixed(1)}`;
      out += `<polygon points="${pts}" style="fill:#60a5fa;stroke:none"/>`;
    });
    // 모눈선
    for (let i = 0; i <= n; i += 1) {
      const p = (pad + i * cell).toFixed(1);
      out += `<line x1="${pad}" y1="${p}" x2="${size - pad}" y2="${p}" style="stroke:#334155;stroke-width:1"/>`;
      out += `<line x1="${p}" y1="${pad}" x2="${p}" y2="${size - pad}" style="stroke:#334155;stroke-width:1"/>`;
    }
    out += `<rect x="${pad}" y="${pad}" width="${size - pad * 2}" height="${size - pad * 2}" style="fill:none;stroke:#1e293b;stroke-width:1.6"/>`;
    const totalCells = n * n, halfCount = halfPairs.length, fullCount = fullCells.length;
    const said = `똑같이 ${totalCells}칸(${n}×${n})으로 나눈 정사각형 모눈: 온전한 칸 ${fullCount}개와 칸을 대각선으로 이등분한 직각삼각형 ${halfCount}개가 색칠된 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${size} ${size}" width="${size}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 2) 직육면체를 밑면에 평행하게 잘랐을 때 늘어나는 두 단면을 보여주는 그림
  function cutBoxSvg(a, b, c) {
    const W = 252, Hh = 136;
    let out = '';
    // 왼쪽: 자르기 전 직육면체와 절단면 점선
    out += `<polygon points="24,42 84,42 104,24 44,24" style="fill:#e2e8f0;stroke:#1e293b;stroke-width:1.2"/>`;
    out += `<polygon points="24,42 84,42 84,102 24,102" style="fill:#f8fafc;stroke:#1e293b;stroke-width:1.2"/>`;
    out += `<polygon points="84,42 104,24 104,84 84,102" style="fill:#cbd5e1;stroke:#1e293b;stroke-width:1.2"/>`;
    // 가운데 절단선(붉은 점선 평면)
    out += `<polygon points="24,72 84,72 104,54 44,54" style="fill:rgba(251,191,36,0.38);stroke:#dc2626;stroke-width:1.3;stroke-dasharray:3 2"/>`;
    out += `<text x="54" y="118" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#1e293b">가로 ${a} cm, 세로 ${b} cm</text>`;
    out += `<text x="114" y="62" style="font-size:10.5px;font-weight:700;fill:#1e293b">높이 ${c} cm</text>`;
    // 오른쪽 설명: 새로 생기는 두 단면
    out += `<polygon points="158,46 218,46 234,32 174,32" style="fill:#fde68a;stroke:#b45309;stroke-width:1.3"/>`;
    out += `<polygon points="158,82 218,82 234,68 174,68" style="fill:#fde68a;stroke:#b45309;stroke-width:1.3"/>`;
    out += `<text x="196" y="104" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#b45309">새로 생긴 단면 2개</text>`;
    const said = `가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체를 밑면에 평행하게 한 번 잘라 두 직육면체로 만들 때 새로 생기는 단면 2개`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  B.addUnit({
    id: U, grade: 6, semester: 1, no: 7, title: '학기 실력', semesterAdvanced: true, version: 1,
    groups: [
      {
        id: 'synth', title: '비율·그래프·공간 개념 연결하기', standard: RATIO,
        types: [
          H('adv-grid-shade-pct', '대칭·합동 등적변형으로 색칠한 부분의 백분율 구하기', 'AMC8 2025 1번 개작(등적변형 + 백분율)', (d) => {
            const [n, fullCount, halfCount] = d.pick([
              [4, 3, 6],   // (3 + 3) / 16 -> 6/16 X -> 4x4 에서 100으로 나누어떨어지려면 4, 8, 12칸 또는 5x5!
              [5, 4, 6],   // (4 + 3) = 7칸 / 25칸 = 28%
              [5, 5, 8],   // (5 + 4) = 9칸 / 25칸 = 36%
              [5, 6, 6],   // (6 + 3) = 9칸 / 25칸 = 36% -> 다르게: [5, 6, 8] = 10칸 = 40%
              [4, 2, 4],   // (2 + 2) = 4칸 / 16칸 = 25%
              [4, 5, 6]    // (5 + 3) = 8칸 / 16칸 = 50%
            ].filter(([nn, fc, hc]) => ((fc + hc / 2) * 100) % (nn * nn) === 0));
            const totalCells = n * n, shadedCells = fullCount + halfCount / 2, pct = shadedCells * 100 / totalCells;
            const allCoords = [];
            for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) allCoords.push([r, c]);
            const picked = d.shuffle(allCoords);
            const fullCells = picked.slice(0, fullCount);
            const halfPairs = picked.slice(fullCount, fullCount + halfCount).map(([r, c], i) => [r, c, i % 2]);
            return N(`정사각형을 똑같이 ${totalCells}칸(${n}×${n})으로 나눈 모눈종이에 그림과 같이 색칠하였다. 색칠한 부분(온전한 칸 ${fullCount}개와 칸을 대각선으로 이등분한 직각삼각형 ${halfCount}개)의 넓이는 정사각형 전체 넓이의 몇 %인가?`, pct, {
              unit: '%',
              figure: gridShadeSvg(n, fullCells, halfPairs),
              hint: `모눈 한 칸을 대각선으로 나눈 직각삼각형 2개를 합치면 온전한 모눈 1칸과 넓이가 같습니다. 색칠한 부분이 모두 모눈 몇 칸과 같은지 먼저 구해 보세요.`,
              explain: `모눈 한 칸을 대각선으로 이등분한 직각삼각형 2개를 짝지으면 모눈 1칸과 넓이가 같으므로, 직각삼각형 ${halfCount}개의 넓이는 모눈 ${halfCount} ÷ 2 = ${halfCount / 2}(칸)과 같다. 따라서 색칠한 부분의 넓이는 모눈 ${fullCount} + ${halfCount / 2} = ${shadedCells}(칸)이고, 정사각형 전체 ${totalCells}칸에 대한 백분율은 ${frac(shadedCells, totalCells)} × 100 = ${pct}(%)이다.`,
              facts: { calc: [[`(${fullCount}+${halfCount}/2)*100/${totalCells}`, 0]], unseen: [2, 100] }
            });
          }, { standard: RATIO }),
          H('adv-pie-bundle-ratio', '지워진 두 항목의 배 관계(묶음)로 원그래프에서 학생 수 구하기', '디딤돌 6-1-5 단원심화 5번 · 천재 서술형 4번 구제', (d) => {
            const c = G615.SETS.sport, names = d.shuffle(c.names).slice(0, 4);
            const [times, smallPct, total] = d.pick([
              [2, 12, 200], [2, 15, 200], [2, 16, 300],
              [3, 10, 200], [3, 12, 300], [4, 10, 200]
            ]);
            const bigPct = smallPct * times, restSum = 100 - smallPct - bigPct;
            const p2 = d.pick([20, 25, 30].filter((x) => restSum - x >= 12 && restSum - x !== x)), p3 = restSum - p2;
            const pcts = [bigPct, smallPct, p2, p3];
            const ans = total * bigPct / 100;
            return N(`어느 학교 6학년 학생 ${total}명이 좋아하는 운동을 조사하여 나타낸 원그래프인데 ${josa(names[0], '과/와')} ${names[1]}의 백분율이 지워졌다. ${josa(names[0], '을/를')} 좋아하는 학생 수가 ${josa(names[1], '을/를')} 좋아하는 학생 수의 ${times}배일 때, ${josa(names[0], '을/를')} 좋아하는 학생은 몇 명인가?`, ans, {
              unit: '명',
              figure: G615.cap(c.title, G615.pie(names.map((nm, i) => ({ name: nm, pct: pcts[i], show: i < 2 ? 'blank' : 'both' })), { tick: 10 })),
              hint: `먼저 100 %에서 나머지 두 항목의 백분율을 빼어 ${josa(names[0], '과/와')} ${names[1]}의 백분율의 합을 구하세요. ${names[1]}의 비율을 1묶음으로 놓으면 두 항목의 합은 몇 묶음인지 생각해 보세요.`,
              explain: `${josa(names[0], '과/와')} ${names[1]}의 백분율의 합은 100 − ${p2} − ${p3} = ${smallPct + bigPct}(%)이다. ${names[1]}의 비율을 1묶음이라고 하면 ${names[0]}의 비율은 ${times}묶음이므로 합쳐서 ${times} + 1 = ${times + 1}(묶음)이다. 따라서 1묶음인 ${names[1]}의 비율은 ${smallPct + bigPct} ÷ ${times + 1} = ${smallPct}(%)이고, ${names[0]}의 비율은 ${smallPct} × ${times} = ${bigPct}(%)이다. ${josa(names[0], '을/를')} 좋아하는 학생은 ${total} × ${frac(bigPct, 100)} = ${ans}(명)이다.`,
              facts: { calc: [[`${total}*((100-${p2}-${p3})/(${times}+1)*${times})/100`, 0]], unseen: [1, 100] }
            });
          }, { standard: GRAPH }),
          H('adv-box-cut-surface', '직육면체를 잘랐을 때 새로 생기는 단면으로 겉넓이의 합 구하기', '수집본 6-1-6 심화꼴 · KMA 초6', (d) => {
            const [a, b, c] = K525.dims3(d, 4, 10);
            const baseSurf = (a * b + b * c + a * c) * 2, cutFace = a * b, totalSurf = baseSurf + cutFace * 2;
            return N(`가로가 ${a} cm, 세로가 ${b} cm, 높이가 ${c} cm인 직육면체 모양의 나무토막을 그림과 같이 밑면에 평행하게 한 번 잘라 두 직육면체로 나누었다. 나누어진 두 직육면체의 겉넓이의 합은 처음 직육면체의 겉넓이보다 몇 cm² 더 넓어졌는지 구하고, 두 직육면체의 겉넓이의 합은 모두 몇 cm²인지 구할 때, 나누어진 두 직육면체의 겉넓이의 합은 몇 cm²인가?`, totalSurf, {
              unit: 'cm²',
              figure: cutBoxSvg(a, b, c),
              hint: `나무토막을 두 조각으로 나눈 뒤 각각의 높이를 구해 계산할 필요가 없습니다. 처음 직육면체의 겉넓이에 자르면서 새로 생긴 단면 2개의 넓이만 더해 보세요.`,
              explain: `직육면체를 밑면에 평행하게 한 번 자르면, 잘린 자리에 밑면(가로 ${a} cm, 세로 ${b} cm)과 합동인 새로운 면이 2개 더 생긴다. 처음 직육면체의 겉넓이는 (${a} × ${b} + ${b} × ${c} + ${a} × ${c}) × 2 = ${baseSurf}(cm²)이고, 새로 늘어난 두 단면의 넓이의 합은 (${a} × ${b}) × 2 = ${cutFace * 2}(cm²)이므로, 두 직육면체의 겉넓이의 합은 ${baseSurf} + ${cutFace * 2} = ${totalSurf}(cm²)이다.`,
              facts: { calc: [[`(${a}*${b}+${b}*${c}+${a}*${c})*2+${a}*${b}*2`, 0]], unseen: [2] }
            });
          }, { standard: SURF }),
          H('adv-net-fold-volume', '전개도에서 맞닿는 선분으로 가로·세로·높이를 찾아 부피 구하기', '수집본 6-1-2 · 6-1-6 융합', (d) => {
            const dims = K525.dims3(d, 3, 8), [a, b, c] = dims, vol = a * b * c;
            const net = K525.boxNet(d, dims, { cols: 40, rows: 30 }), cuts = K525.cutsOf(net), boxBounds = K525.boundsOf(net.rects);
            const lenOf = (cut) => Math.abs(cut.at[0][0] - cut.at[1][0]) + Math.abs(cut.at[0][1] - cut.at[1][1]);
            const given = dims.map((L) => d.pick(cuts.filter((ct) => lenOf(ct) === L)));
            return N(`직육면체의 전개도이다. 이 전개도를 접어서 만든 직육면체의 부피는 몇 cm³인가?`, vol, {
              unit: 'cm³',
              figure: K525.netArt(net.rects, {
                unit: Math.min(220 / boxBounds.w, 185 / boxBounds.h),
                lens: given.map((g) => ({ a: g.at[0], b: g.at[1], text: lenOf(g) + ' cm' })),
                label: `직육면체의 전개도. 테두리의 세 선분의 길이는 ${dims.map((x) => x + ' cm').join(', ')}`
              }),
              hint: '전개도를 접었을 때 맞닿는 선분은 길이가 같고, 한 꼭짓점에 모이는 서로 다른 세 모서리의 길이가 직육면체의 가로, 세로, 높이가 됩니다.',
              explain: `전개도에 적힌 서로 다른 세 길이 ${a} cm, ${b} cm, ${c} cm가 접었을 때 직육면체의 가로, 세로, 높이가 된다. 따라서 직육면체의 부피는 ${a} × ${b} × ${c} = ${vol}(cm³)이다.`,
              facts: { calc: [[`${a}*${b}*${c}`, 0]] }
            });
          }, { standard: VOL }),
          H('adv-pour-water-height', '직육면체 그릇의 물을 옮겨 담을 때 부피 보존으로 물의 높이 구하기', '수집본 6-1-6 심화꼴 · HME 초6', (d) => {
            const [a1, b1, h1, a2, b2] = d.pick([
              [10, 6, 8, 12, 8],
              [12, 5, 6, 9, 8],
              [15, 4, 6, 10, 9],
              [12, 8, 5, 10, 8],
              [14, 6, 5, 10, 7]
            ]);
            const vol = a1 * b1 * h1, h2 = vol / (a2 * b2);
            return N(`안쪽 가로가 ${a1} cm, 세로가 ${b1} cm인 직육면체 모양의 가 그릇에 물이 ${h1} cm 높이만큼 들어 있다. 이 물을 안쪽 가로가 ${a2} cm, 세로가 ${b2} cm인 빈 직육면체 모양의 나 그릇에 모두 부으면, 나 그릇에 담긴 물의 높이는 몇 cm가 되는가? (단, 그릇의 높이는 물이 넘치지 않을 만큼 충분히 높다.)`, h2, {
              unit: 'cm',
              hint: `물을 다른 그릇에 옮겨 담아도 물의 부피는 변하지 않습니다. 가 그릇에 담긴 물의 부피를 먼저 구한 뒤 나 그릇의 밑넓이(${a2} × ${b2})로 나누어 보세요.`,
              explain: `가 그릇에 들어 있는 물의 부피는 ${a1} × ${b1} × ${h1} = ${vol}(cm³)이다. 물을 나 그릇에 옮겨 담아도 물의 부피는 그대로 ${vol} cm³이고 나 그릇의 한 밑면의 넓이는 ${a2} × ${b2} = ${a2 * b2}(cm²)이므로, 나 그릇의 물의 높이는 ${vol} ÷ ${a2 * b2} = ${h2}(cm)이다.`,
              facts: { calc: [[`(${a1}*${b1}*${h1})/(${a2}*${b2})`, 0]] }
            });
          }, { standard: VOL })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
