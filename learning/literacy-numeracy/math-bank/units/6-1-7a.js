// 6학년 1학기 종합 — 6학년 1학기까지 배운 여러 단원(분수의 나눗셈, 각기둥과 각뿔, 소수의 나눗셈, 비와 비율, 여러 가지 그래프, 직육면체의 부피와 겉넓이)의
// 개념을 연결하고, 등적변형·묶음 모형·단면과 면 이동 원리·부피 보존으로 해결하는 응용 문항.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, mixed, table, N, D, F } = B.kit;
  const K525 = B.kit.box525;
  const G615 = B.kit.g615;
  const U = '6-1-7';
  const FDIV = '6수01-11', PRISM = '6수03-03', DDIV = '6수01-15', RATIO = '6수04-03', GRAPH = '6수05-02', VOL = '6수03-05', SURF = '6수03-06';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref, make }, more || {});
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  // 1) AMC8 2025 1번형: 모눈 정사각형 위에서 합동인 직각삼각형 조각들을 짝지어 색칠한 넓이의 백분율을 구하는 그림
  function gridShadeSvg(n, fullCells, halfPairs) {
    const size = 164, pad = 12, cell = (size - pad * 2) / n;
    let out = `<rect x="${pad}" y="${pad}" width="${size - pad * 2}" height="${size - pad * 2}" style="fill:#f8fafc;stroke:#1e293b;stroke-width:1.5"/>`;
    fullCells.forEach(([r, c]) => {
      const x = pad + c * cell, y = pad + r * cell;
      out += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cell.toFixed(1)}" height="${cell.toFixed(1)}" style="fill:#60a5fa;stroke:none"/>`;
    });
    halfPairs.forEach(([r, c, dir]) => {
      const x = pad + c * cell, y = pad + r * cell;
      const pts = dir === 0
        ? `${x.toFixed(1)},${y.toFixed(1)} ${(x + cell).toFixed(1)},${y.toFixed(1)} ${x.toFixed(1)},${(y + cell).toFixed(1)}`
        : `${(x + cell).toFixed(1)},${y.toFixed(1)} ${(x + cell).toFixed(1)},${(y + cell).toFixed(1)} ${x.toFixed(1)},${(y + cell).toFixed(1)}`;
      out += `<polygon points="${pts}" style="fill:#60a5fa;stroke:none"/>`;
    });
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

  // 2) 직육면체를 밑면에 평행하게 자르는 문제 그림(스포일러 없이 절단 위치와 가로·세로·높이만 표시)
  function cutBoxSvg(a, b, c) {
    const W = 216, Hh = 138;
    let out = '';
    out += `<polygon points="34,40 118,40 144,20 60,20" style="fill:#e2e8f0;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    out += `<polygon points="34,40 118,40 118,104 34,104" style="fill:#f8fafc;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    out += `<polygon points="118,40 144,20 144,84 118,104" style="fill:#cbd5e1;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    out += `<polygon points="34,72 118,72 144,52 60,52" style="fill:rgba(251,191,36,0.32);stroke:#dc2626;stroke-width:1.4;stroke-dasharray:4 2"/>`;
    out += `<text x="76" y="121" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${a} cm</text>`;
    out += `<text x="140" y="103" style="font-size:11px;font-weight:700;fill:#1e293b">${b} cm</text>`;
    out += `<text x="152" y="56" style="font-size:11px;font-weight:700;fill:#1e293b">${c} cm</text>`;
    const said = `가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체를 밑면에 평행한 점선을 따라 한 번 자르는 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 3) 물이 담긴 직육면체 수조에 돌을 완전히 잠기게 넣은 그림
  function stoneTankSvg(a, b, h0, stoneV) {
    const W = 236, Hh = 148;
    let out = '';
    // 물 부분(아랫부분)
    out += `<polygon points="32,74 120,74 146,54 58,54" style="fill:#93c5fd;stroke:#2563eb;stroke-width:1.2;stroke-linejoin:round"/>`;
    out += `<polygon points="32,74 120,74 120,114 32,114" style="fill:#dbeafe;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    out += `<polygon points="120,74 146,54 146,94 120,114" style="fill:#bfdbfe;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    // 수조 바깥 테두리(윗부분)
    out += `<polygon points="32,38 120,38 146,18 58,18" style="fill:none;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    out += `<line x1="32" y1="38" x2="32" y2="74" style="stroke:#1e293b;stroke-width:1.3"/>`;
    out += `<line x1="120" y1="38" x2="120" y2="74" style="stroke:#1e293b;stroke-width:1.3"/>`;
    out += `<line x1="146" y1="18" x2="146" y2="54" style="stroke:#1e293b;stroke-width:1.3"/>`;
    out += `<line x1="58" y1="18" x2="58" y2="94" style="stroke:#64748b;stroke-width:1;stroke-dasharray:3 2"/>`;
    // 물속에 잠긴 돌
    out += `<ellipse cx="78" cy="99" rx="18" ry="9" style="fill:#94a3b8;stroke:#334155;stroke-width:1.3"/>`;
    out += `<text x="78" y="102" text-anchor="middle" style="font-size:9.5px;font-weight:700;fill:#0f172a">돌</text>`;
    // 치수 및 안내
    out += `<text x="76" y="130" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${a} cm</text>`;
    out += `<text x="142" y="112" style="font-size:11px;font-weight:700;fill:#1e293b">${b} cm</text>`;
    out += `<text x="154" y="80" style="font-size:11px;font-weight:700;fill:#1d4ed8">처음 물 ${h0} cm</text>`;
    out += `<text x="154" y="42" style="font-size:10.5px;font-weight:700;fill:#334155">돌 ${stoneV} cm³</text>`;
    const said = `안쪽 가로 ${a} cm, 세로 ${b} cm이고 처음 물의 높이가 ${h0} cm인 직육면체 수조에 부피가 ${stoneV} cm³인 돌을 넣는 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 4) 직육면체의 오른쪽 위 앞 귀퉁이에서 작은 정육면체를 잘라 낸 입체도형 그림
  function cornerCutBoxSvg(a, b, c) {
    const W = 228, Hh = 148;
    // 앞면 왼아래 (34,110), 오른아래 (124,110), 윗면 앞왼 (34,42), 뒤쪽 이동벡터 (28,-22)
    // 오른쪽 위 앞 귀퉁이 홈: 가로 32, 높이 28, 안쪽 깊이 (11,-9)
    let out = '';
    // 윗면(ㄱ자 모양)
    out += `<polygon points="34,42 92,42 103,33 135,33 152,20 62,20" style="fill:#e2e8f0;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    // 앞면(ㄱ자 모양)
    out += `<polygon points="34,42 92,42 92,70 124,70 124,110 34,110" style="fill:#f8fafc;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    // 오른쪽 옆면(ㄱ자 모양)
    out += `<polygon points="124,70 135,61 135,33 152,20 152,88 124,110" style="fill:#cbd5e1;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    // 잘려 나간 귀퉁이 안쪽의 세 면(윗면·앞면·오른쪽면과 평행한 면들)
    out += `<polygon points="92,70 124,70 135,61 103,61" style="fill:#bae6fd;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    out += `<polygon points="103,33 135,33 135,61 103,61" style="fill:#dbeafe;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    out += `<polygon points="92,42 103,33 103,61 92,70" style="fill:#93c5fd;stroke:#1e293b;stroke-width:1.3;stroke-linejoin:round"/>`;
    // 치수 표시
    out += `<text x="79" y="127" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${a} cm</text>`;
    out += `<text x="148" y="109" style="font-size:11px;font-weight:700;fill:#1e293b">${b} cm</text>`;
    out += `<text x="160" y="58" style="font-size:11px;font-weight:700;fill:#1e293b">${c} cm</text>`;
    const said = `가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 한 귀퉁이에서 작은 정육면체를 잘라 낸 입체도형 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  B.addUnit({
    id: U, grade: 6, semester: 1, no: 7, title: '초 6학년 1학기 종합', semesterAdvanced: true, version: 3,
    groups: [
      {
        id: 'hard', title: '초 6학년 1학기 종합', standard: RATIO,
        types: [
          H('adv-grid-shade-pct', '대칭·합동 등적변형으로 색칠한 부분의 백분율 구하기', 'AMC8 2025 1번 개작(등적변형 + 백분율)', (d) => {
            const [n, fullCount, halfCount] = d.pick([
              [5, 4, 6],
              [5, 5, 8],
              [5, 6, 8],
              [4, 2, 4],
              [4, 5, 6]
            ]);
            const totalCells = n * n, shadedCells = fullCount + halfCount / 2, pct = shadedCells * 100 / totalCells;
            const allCoords = [];
            for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) allCoords.push([r, c]);
            const picked = d.shuffle(allCoords);
            const fullCells = picked.slice(0, fullCount);
            const halfPairs = picked.slice(fullCount, fullCount + halfCount).map(([r, c], i) => [r, c, i % 2]);
            return N(`정사각형을 똑같이 ${totalCells}칸(${n}×${n})으로 나눈 모눈종이에 그림과 같이 색칠하였다. 색칠한 부분(온전한 칸 ${fullCount}개와 칸을 대각선으로 이등분한 직각삼각형 ${halfCount}개)의 넓이는 정사각형 전체 넓이의 몇 %인가?`, pct, {
              unit: '%',
              figure: gridShadeSvg(n, fullCells, halfPairs),
              hint: '모눈 한 칸을 대각선으로 나눈 직각삼각형 2개를 합치면 온전한 모눈 1칸과 넓이가 같습니다. 색칠한 부분이 모두 모눈 몇 칸과 같은지 먼저 구해 보세요.',
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
            return N(`가로가 ${a} cm, 세로가 ${b} cm, 높이가 ${c} cm인 직육면체 모양의 나무토막을 그림과 같이 밑면에 평행하게 한 번 잘라 두 직육면체로 나누었다. 나누어진 두 직육면체의 겉넓이의 합은 모두 몇 cm²인가?`, totalSurf, {
              unit: 'cm²',
              figure: cutBoxSvg(a, b, c),
              hint: '나무토막을 두 조각으로 나눈 뒤 각각의 높이를 구해 계산할 필요가 없습니다. 처음 직육면체의 겉넓이에 자르면서 새로 생긴 단면 2개의 넓이만 더해 보세요.',
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
          }, { standard: VOL }),
          H('adv-stone-submerge-height', '물에 잠긴 돌의 부피와 소수의 나눗셈으로 올라간 수면 높이 구하기', '수집본 6-1-6 · 6-1-3 소수의 나눗셈 융합 · KMA 초6', (d) => {
            const [a, b, h0, stoneV] = d.pick([
              [10, 8, 6, 120],
              [12, 5, 7, 90],
              [10, 6, 5, 150],
              [8, 5, 6, 60],
              [15, 4, 8, 90],
              [12, 10, 5, 180]
            ]);
            const baseArea = a * b, rise = stoneV / baseArea, finalH = h0 + rise;
            return D(`안쪽 가로가 ${a} cm, 세로가 ${b} cm인 직육면체 모양의 수조에 물이 ${h0} cm 높이만큼 들어 있다. 이 수조에 부피가 ${stoneV} cm³인 돌을 물에 완전히 잠기도록 넣었더니 물이 넘치지 않고 수면이 올라갔다. 돌을 넣은 뒤 수조의 물의 높이는 몇 cm인가?`, finalH, {
              unit: 'cm',
              figure: stoneTankSvg(a, b, h0, stoneV),
              hint: `물에 완전히 잠긴 돌의 부피(${stoneV} cm³)만큼 수조의 물이 위로 밀려 올라갑니다. 돌의 부피를 수조의 밑넓이(${a} × ${b})로 나누어 올라간 물의 높이를 먼저 구해 보세요.`,
              explain: `수조의 밑넓이는 ${a} × ${b} = ${baseArea}(cm²)이다. 물에 잠긴 돌의 부피(${stoneV} cm³)만큼 수면이 올라가므로, 올라간 물의 높이는 ${stoneV} ÷ ${baseArea} = ${rise}(cm)이다. 따라서 돌을 넣은 뒤 물의 높이는 ${h0} + ${rise} = ${finalH}(cm)이다.`,
              facts: { calc: [[`${h0}+${stoneV}/(${a}*${b})`, 0]] }
            });
          }, { standard: VOL }),
          H('adv-corner-cut-surface', '귀퉁이를 잘라 낸 입체도형의 면을 이동하여 겉넓이 구하기', '수집본 6-1-6 심화꼴 · MathKangaroo · KMA 초6', (d) => {
            const [a, b, c] = K525.dims3(d, 5, 10);
            const surf = (a * b + b * c + a * c) * 2;
            return N(`가로가 ${a} cm, 세로가 ${b} cm, 높이가 ${c} cm인 직육면체의 오른쪽 위 귀퉁이에서 작은 정육면체 모양을 잘라 내어 그림과 같은 입체도형을 만들었다. 만든 입체도형의 겉넓이는 몇 cm²인가?`, surf, {
              unit: 'cm²',
              figure: cornerCutBoxSvg(a, b, c),
              hint: '귀퉁이에서 잘려 나간 3개의 면 대신 안쪽에 새로 생긴 파란색 면 3개를 바깥쪽(위, 앞, 오른쪽)으로 밀어내면 어떤 도형의 겉넓이와 같아지는지 살펴보세요.',
              explain: `직육면체의 귀퉁이에서 작은 정육면체를 잘라 내면 위, 앞, 오른쪽 면에서 정사각형이 1개씩 줄어들지만, 잘려 나간 자리 안쪽에 똑같은 크기의 정사각형 면이 3개 새로 생긴다. 안쪽의 세 면을 각각 위, 앞, 오른쪽으로 밀어내면 처음 직육면체의 겉넓이와 똑같아진다. 따라서 구하는 겉넓이는 (${a} × ${b} + ${b} × ${c} + ${a} × ${c}) × 2 = ${surf}(cm²)이다.`,
              facts: { calc: [[`(${a}*${b}+${b}*${c}+${a}*${c})*2`, 0]], unseen: [2] }
            });
          }, { standard: SURF }),
          H('adv-prism-wire-edge', '각기둥의 꼭짓점 수로 모서리 수를 구해 한 모서리의 길이(소수) 구하기', '수집본 6-1-2 · 6-1-3 소수의 나눗셈 융합', (d) => {
            const [n, edgeLen] = d.pick([
              [3, 4.5], [3, 5.2],
              [4, 3.5], [4, 4.2],
              [5, 2.8], [5, 3.4],
              [6, 2.5], [6, 3.2]
            ]);
            const vertices = n * 2, edges = n * 3, wireLen = Math.round(edges * edgeLen * 10) / 10;
            const prismNames = { 3: '삼각기둥', 4: '사각기둥', 5: '오각기둥', 6: '육각기둥' };
            return D(`꼭짓점이 ${vertices}개인 각기둥이 있다. 길이가 ${wireLen} cm인 철사를 남김없이 모두 사용하여 모든 모서리의 길이가 같게 이 각기둥의 뼈대를 만들었다면, 한 모서리의 길이는 몇 cm인가?`, edgeLen, {
              unit: 'cm',
              hint: `먼저 꼭짓점이 ${vertices}개인 각기둥의 한 밑면의 변의 수(${vertices} ÷ 2)를 구해 어떤 각기둥인지 찾고, 그 각기둥의 모서리가 모두 몇 개인지 구해 보세요.`,
              explain: `각기둥의 꼭짓점 수는 (한 밑면의 변의 수) × 2이므로, 한 밑면의 변의 수는 ${vertices} ÷ 2 = ${n}(개)인 ${prismNames[n]}이다. ${prismNames[n]}의 모서리는 모두 ${n} × 3 = ${edges}(개)이고 모든 모서리의 길이가 같으므로, 한 모서리의 길이는 ${wireLen} ÷ ${edges} = ${edgeLen}(cm)이다.`,
              facts: { calc: [[`${wireLen}/(${vertices}/2*3)`, 0]], unseen: [2, 3] }
            });
          }, { standard: DDIV }),
          H('adv-two-groups-pct', '기준량이 서로 다른 두 집단을 합쳤을 때 전체에 대한 백분율 구하기', '수집본 6-1-4 · 6-1-5 심화 · KMA 초6', (d) => {
            const [nA, pctA, nB, pctB] = d.pick([
              [120, 40, 80, 65],
              [150, 30, 50, 70],
              [160, 25, 40, 50],
              [140, 35, 60, 55],
              [180, 30, 120, 45]
            ]);
            const partA = (nA * pctA) / 100, partB = (nB * pctB) / 100;
            const totN = nA + nB, totPart = partA + partB, totPct = (totPart * 100) / totN;
            return N(`가 학교와 나 학교의 6학년 전체 학생 수와 그중 안경을 쓴 학생의 비율을 조사하여 나타낸 표이다. 두 학교의 6학년 학생 전체에 대한 안경을 쓴 학생 전체의 비율은 몇 %인가?`, totPct, {
              unit: '%',
              figure: table(['학교', '6학년 전체 학생 수(명)', '안경을 쓴 학생의 비율(%)'], [['가 학교', nA, pctA], ['나 학교', nB, pctB]]),
              hint: `두 학교의 전체 학생 수(기준량)가 서로 다르므로 백분율끼리 바로 평균을 내면 안 됩니다. 각 학교에서 안경을 쓴 학생이 몇 명인지 먼저 구해 더하세요.`,
              explain: `가 학교에서 안경을 쓴 학생은 ${nA} × ${frac(pctA, 100)} = ${partA}(명)이고, 나 학교에서 안경을 쓴 학생은 ${nB} × ${frac(pctB, 100)} = ${partB}(명)이다. 두 학교의 6학년 전체 학생 수는 ${nA} + ${nB} = ${totN}(명)이고 안경을 쓴 학생은 모두 ${partA} + ${partB} = ${totPart}(명)이므로, 전체에 대한 백분율은 ${frac(totPart, totN)} × 100 = ${totPct}(%)이다.`,
              facts: { calc: [[`(${nA}*${pctA}/100+${nB}*${pctB}/100)/(${nA}+${nB})*100`, 0]], unseen: [100] }
            });
          }, { standard: RATIO }),
          H('adv-frac-div-tri-height', '삼각형의 넓이 공식과 분수의 나눗셈을 연결해 높이 구하기', '수집본 6-1-1 심화꼴 · 5-1-6 삼각형의 넓이 융합', (d) => {
            const [wWhole, a, b, base] = d.pick([
              [4, 1, 2, 6],
              [5, 1, 4, 7],
              [6, 2, 5, 8],
              [7, 1, 3, 11],
              [5, 3, 5, 8]
            ]);
            const impTop = wWhole * b + a;
            // 높이 = (넓이 × 2) ÷ 밑변 = (impTop * 2) / (b * base)
            const rawTop = impTop * 2, rawBot = b * base, g = gcd(rawTop, rawBot);
            const hTop = rawTop / g, hBot = rawBot / g, hWhole = Math.floor(hTop / hBot), hRem = hTop % hBot;
            return F(`넓이가 ${mixed(wWhole, a, b)} m²이고 밑변의 길이가 ${base} m인 삼각형 모양의 화단이 있다. 이 화단의 높이는 몇 m인가?`, hRem, hBot, {
              whole: hWhole,
              unit: 'm',
              hint: `(삼각형의 넓이) = (밑변) × (높이) ÷ 2이므로, 높이를 구하려면 먼저 넓이에 2를 곱한 뒤 밑변의 길이(${base} m)로 나누어야 합니다.`,
              explain: `삼각형의 넓이는 (밑변) × (높이) ÷ 2이므로, (높이) = (넓이) × 2 ÷ (밑변)이다. 대분수를 가분수로 고치면 ${mixed(wWhole, a, b)} = ${frac(impTop, b)}이므로, 높이는 ${frac(impTop, b)} × 2 ÷ ${base} = ${frac(impTop * 2, b)} × ${frac(1, base)} = ${hWhole ? mixed(hWhole, hRem, hBot) : frac(hRem, hBot)}(m)이다.`,
              facts: { value: `(${wWhole}+${a}/${b})*2/${base}`, unseen: [2] }
            });
          }, { standard: FDIV })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
