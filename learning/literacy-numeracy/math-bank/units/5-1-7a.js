// 5학년 1학기 종합 — 5학년 1학기까지 배운 여러 단원(자연수의 혼합 계산, 약수와 배수, 규칙과 대응, 약분과 통분, 분수의 덧셈과 뺄셈, 다각형의 둘레와 넓이)의
// 개념을 연결하고, 등적변형·묶음 추론·거꾸로 추론·변 이동으로 해결하는 응용 문항.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, mixed, N, M, F } = B.kit;
  const U = '5-1-7';
  const MIX = '6수01-01', GCD = '6수01-02', RULE = '6수02-01', RED = '6수01-06', FADD = '6수01-08', PERI = '6수03-11', UNITS = '6수03-12', RECT = '6수03-13', AREA = '6수03-14';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref, make }, more || {});
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (num, den, pair) => frac(num, den) + tail(num, pair);
  const mj = (w, num, den, pair) => mixed(w, num, den) + tail(num, pair);
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

  // ── 그림 도구(풀이 스포일러 없이 문제 상황만 정확히 그린다) ─────────────
  // 1) 대각선으로 나뉜 직각삼각형이 들어 있는 사다리꼴 ㄱㄴㄷㄹ 그림(실제 직각 좌표 비례 적용, 높이는 표시하지 않음)
  function trapDiagSvg(topB, botB, leg1, leg2) {
    const W = 264, Hh = 152;
    const hReal = (leg1 * leg2) / botB;
    const xA = (leg1 * leg1) / botB;
    const maxW = Math.max(botB, xA + topB);
    const scale = Math.min(176 / maxW, 86 / hReal);
    const x0 = 36, yBot = 122, yTop = yBot - hReal * scale;
    const Bpt = [x0, yBot];
    const Cpt = [x0 + botB * scale, yBot];
    const Apt = [x0 + xA * scale, yTop];
    const Dpt = [Apt[0] + topB * scale, yTop];

    // 꼭짓점 ㄱ의 직각 표시(변 ㄱㄴ과 대각선 ㄱㄷ 방향 단위벡터)
    const uAB = [(Bpt[0] - Apt[0]) / (leg1 * scale), (Bpt[1] - Apt[1]) / (leg1 * scale)];
    const uAC = [(Cpt[0] - Apt[0]) / (leg2 * scale), (Cpt[1] - Apt[1]) / (leg2 * scale)];
    const sq = 7.5;
    const r1 = [Apt[0] + uAB[0] * sq, Apt[1] + uAB[1] * sq];
    const r3 = [Apt[0] + uAC[0] * sq, Apt[1] + uAC[1] * sq];
    const r2 = [r1[0] + uAC[0] * sq, r1[1] + uAC[1] * sq];

    let out = '';
    out += `<polygon points="${Apt[0].toFixed(1)},${Apt[1].toFixed(1)} ${Bpt[0].toFixed(1)},${Bpt[1].toFixed(1)} ${Cpt[0].toFixed(1)},${Cpt[1].toFixed(1)} ${Dpt[0].toFixed(1)},${Dpt[1].toFixed(1)}" style="fill:#fef3c7;stroke:#1e293b;stroke-width:1.5;stroke-linejoin:round"/>`;
    out += `<polygon points="${Apt[0].toFixed(1)},${Apt[1].toFixed(1)} ${Bpt[0].toFixed(1)},${Bpt[1].toFixed(1)} ${Cpt[0].toFixed(1)},${Cpt[1].toFixed(1)}" style="fill:#dbeafe;stroke:#1e293b;stroke-width:1.4;stroke-linejoin:round"/>`;
    out += `<polyline points="${r1[0].toFixed(1)},${r1[1].toFixed(1)} ${r2[0].toFixed(1)},${r2[1].toFixed(1)} ${r3[0].toFixed(1)},${r3[1].toFixed(1)}" style="fill:none;stroke:#1e3a8a;stroke-width:1.2"/>`;

    // 꼭짓점 기호 ㄱ, ㄴ, ㄷ, ㄹ
    out += `<text x="${(Apt[0] - 6).toFixed(1)}" y="${(Apt[1] - 6).toFixed(1)}" text-anchor="end" style="font-size:11.5px;font-weight:700;fill:#111827">ㄱ</text>`;
    out += `<text x="${(Bpt[0] - 6).toFixed(1)}" y="${(Bpt[1] + 4).toFixed(1)}" text-anchor="end" style="font-size:11.5px;font-weight:700;fill:#111827">ㄴ</text>`;
    out += `<text x="${(Cpt[0] + 6).toFixed(1)}" y="${(Cpt[1] + 4).toFixed(1)}" style="font-size:11.5px;font-weight:700;fill:#111827">ㄷ</text>`;
    out += `<text x="${(Dpt[0] + 6).toFixed(1)}" y="${(Dpt[1] - 4).toFixed(1)}" style="font-size:11.5px;font-weight:700;fill:#111827">ㄹ</text>`;

    // 변의 길이 표시
    out += `<text x="${((Apt[0] + Dpt[0]) / 2).toFixed(1)}" y="${(yTop - 7).toFixed(1)}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${topB} cm</text>`;
    out += `<text x="${((Bpt[0] + Cpt[0]) / 2).toFixed(1)}" y="${(yBot + 16).toFixed(1)}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${botB} cm</text>`;
    out += `<text x="${((Apt[0] + Bpt[0]) / 2 - 8).toFixed(1)}" y="${((Apt[1] + Bpt[1]) / 2 - 2).toFixed(1)}" text-anchor="end" style="font-size:11px;font-weight:700;fill:#1e3a8a">${leg1} cm</text>`;
    out += `<text x="${((Apt[0] + Cpt[0]) / 2 - 6).toFixed(1)}" y="${((Apt[1] + Cpt[1]) / 2 + 12).toFixed(1)}" text-anchor="end" style="font-size:11px;font-weight:700;fill:#1e3a8a">${leg2} cm</text>`;

    const said = `변 ㄱㄹ이 ${topB} cm, 변 ㄴㄷ이 ${botB} cm로 서로 평행한 사다리꼴 ㄱㄴㄷㄹ에서 각 ㄴㄱㄷ이 직각이고 변 ㄱㄴ이 ${leg1} cm, 선분 ㄱㄷ이 ${leg2} cm인 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 2) 둘레와 가로가 주어진 직사각형 공원의 둘레에 나무를 심는 그림(세로와 간격은 스포일러 없이 표시)
  function parkTreesSvg(perim, w) {
    const W = 252, Hh = 144, x0 = 36, y0 = 28, rw = 148, rh = 82;
    let out = '';
    out += `<rect x="${x0}" y="${y0}" width="${rw}" height="${rh}" style="fill:#ecfccb;stroke:#1e293b;stroke-width:1.5"/>`;
    const tree = (cx, cy) => {
      out += `<circle cx="${cx}" cy="${cy}" r="4.5" style="fill:#16a34a;stroke:#14532d;stroke-width:1.1"/>`;
    };
    tree(x0, y0);
    tree(x0 + 34, y0);
    tree(x0 + 68, y0);
    tree(x0 + rw, y0);
    tree(x0, y0 + 34);
    tree(x0, y0 + rh);
    tree(x0 + rw, y0 + rh);
    out += `<text x="${x0 + 106}" y="${y0 - 6}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#15803d">⋯</text>`;
    out += `<text x="${x0 - 9}" y="${y0 + 58}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#15803d">⋮</text>`;
    out += `<text x="${x0 + rw / 2}" y="${y0 + rh / 2 - 3}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#365314">둘레 ${perim} m</text>`;
    out += `<text x="${x0 + rw / 2}" y="${y0 + rh / 2 + 13}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#4d7c0f">(네 모퉁이에 반드시 심음)</text>`;
    out += `<text x="${x0 + rw / 2}" y="${y0 + rh + 17}" text-anchor="middle" style="font-size:11.5px;font-weight:700;fill:#1e293b">가로 ${w} m</text>`;
    out += `<text x="${x0 + rw + 10}" y="${y0 + rh / 2 + 4}" style="font-size:11px;font-weight:700;fill:#64748b">세로</text>`;
    const said = `둘레가 ${perim} m이고 가로가 ${w} m인 직사각형 공원의 둘레에 네 모퉁이를 포함하여 일정한 간격으로 나무를 심는 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 3) 직사각형 종이에서 가장 큰 정사각형을 두 번 차례로 잘라 내는 그림
  function rectFoldTwiceSvg(w0, h0) {
    const W = 248, Hh = 146, x0 = 30, y0 = 22;
    const scale = Math.min(176 / w0, 96 / h0);
    const pw = w0 * scale, ph = h0 * scale;
    const sq1 = h0 * scale, remW = (w0 - h0) * scale;
    let out = '';
    out += `<rect x="${x0}" y="${y0}" width="${pw.toFixed(1)}" height="${ph.toFixed(1)}" style="fill:#f8fafc;stroke:#1e293b;stroke-width:1.5"/>`;
    // 마지막 남은 직사각형(오른쪽 아래) 색칠
    out += `<rect x="${(x0 + sq1).toFixed(1)}" y="${(y0 + remW).toFixed(1)}" width="${remW.toFixed(1)}" height="${(ph - remW).toFixed(1)}" style="fill:#fde68a;stroke:none"/>`;
    // 첫 번째 정사각형 절단선(세로 점선)과 두 번째 정사각형 절단선(가로 점선)
    out += `<line x1="${(x0 + sq1).toFixed(1)}" y1="${y0}" x2="${(x0 + sq1).toFixed(1)}" y2="${(y0 + ph).toFixed(1)}" style="stroke:#dc2626;stroke-width:1.4;stroke-dasharray:4 3"/>`;
    out += `<line x1="${(x0 + sq1).toFixed(1)}" y1="${(y0 + remW).toFixed(1)}" x2="${(x0 + pw).toFixed(1)}" y2="${(y0 + remW).toFixed(1)}" style="stroke:#dc2626;stroke-width:1.4;stroke-dasharray:4 3"/>`;
    out += `<rect x="${x0}" y="${y0}" width="${pw.toFixed(1)}" height="${ph.toFixed(1)}" style="fill:none;stroke:#1e293b;stroke-width:1.5"/>`;

    out += `<text x="${(x0 + sq1 / 2).toFixed(1)}" y="${(y0 + ph / 2 + 4).toFixed(1)}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#475569">① 정사각형</text>`;
    out += `<text x="${(x0 + sq1 + remW / 2).toFixed(1)}" y="${(y0 + remW / 2 + 4).toFixed(1)}" text-anchor="middle" style="font-size:10px;font-weight:700;fill:#475569">②</text>`;
    out += `<text x="${(x0 + pw / 2).toFixed(1)}" y="${(y0 + ph + 17).toFixed(1)}" text-anchor="middle" style="font-size:11.5px;font-weight:700;fill:#1e293b">${w0} cm</text>`;
    out += `<text x="${(x0 + pw + 8).toFixed(1)}" y="${(y0 + ph / 2 + 4).toFixed(1)}" style="font-size:11.5px;font-weight:700;fill:#1e293b">${h0} cm</text>`;
    const said = `가로 ${w0} cm, 세로 ${h0} cm인 직사각형에서 가장 큰 정사각형 ①을 잘라 내고, 남은 직사각형에서 다시 가장 큰 정사각형 ②를 잘라 내어 색칠한 직사각형이 남은 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 4) 정사각형 타일을 계단 모양으로 이어 붙인 규칙 그림(첫째, 둘째, 셋째)
  function stairPerimSvg(s) {
    const W = 268, Hh = 136, u = 22, base = 104;
    let out = '';
    const drawStair = (xStart, steps, label) => {
      for (let r = 0; r < steps; r += 1) {
        const cols = steps - r;
        for (let c = 0; c < cols; c += 1) {
          const x = xStart + c * u, y = base - (r + 1) * u;
          out += `<rect x="${x}" y="${y}" width="${u}" height="${u}" style="fill:#dbeafe;stroke:#1e3a8a;stroke-width:1.3"/>`;
        }
      }
      out += `<text x="${(xStart + (steps * u) / 2).toFixed(1)}" y="${base + 18}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${label}</text>`;
    };
    drawStair(24, 1, '첫째');
    out += `<text x="35" y="${base - u - 5}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#1e3a8a">${s} cm</text>`;
    drawStair(80, 2, '둘째');
    drawStair(158, 3, '셋째');
    out += `<text x="244" y="${base - 20}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#475569">⋯</text>`;
    const said = `한 변이 ${s} cm인 정사각형을 첫째 1개, 둘째 3개, 셋째 6개로 계단 모양으로 이어 붙인 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  B.addUnit({
    id: U, grade: 5, semester: 1, no: 7, title: '초 5학년 1학기 종합', semesterAdvanced: true, version: 2,
    groups: [
      {
        id: 'hard', title: '초 5학년 1학기 종합', standard: AREA,
        types: [
          H('adv-tri-two-ways-trap', '직각삼각형의 넓이를 두 가지로 나타내어 사다리꼴의 넓이 구하기', '수집본 5-1-6 심화꼴 91번(미래엔·YBM·지학사 구제)', (d) => {
            // 정수 답 칸을 쓰므로 공통 높이와 최종 넓이가 자연수인 직각삼각형만 고른다.
            const [leg1, leg2, botB, topB] = d.pick([
              [15, 20, 25, 13],
              [15, 20, 25, 17],
              [30, 40, 50, 7],
              [30, 40, 50, 11],
              [12, 16, 20, 10],
              [30, 40, 50, 14]
            ]);
            const triArea2 = leg1 * leg2, triArea = triArea2 / 2, h = triArea2 / botB;
            const trapArea = (topB + botB) * h / 2;
            return N(`그림과 같이 변 ㄱㄹ과 변 ㄴㄷ이 서로 평행한 사다리꼴 ㄱㄴㄷㄹ에서 각 ㄴㄱㄷ은 직각이고, 변 ㄱㄹ은 ${topB} cm, 변 ㄴㄷ은 ${botB} cm, 변 ㄱㄴ은 ${leg1} cm, 선분 ㄱㄷ은 ${leg2} cm이다. 사다리꼴 ㄱㄴㄷㄹ의 넓이는 몇 cm²인가?`, trapArea, {
              unit: 'cm²',
              figure: trapDiagSvg(topB, botB, leg1, leg2),
              hint: `먼저 직각삼각형 ㄱㄴㄷ의 넓이를 (${leg1} × ${leg2} ÷ 2)로 구하세요. 삼각형 ㄱㄴㄷ에서 변 ㄴㄷ(${botB} cm)을 밑변으로 생각하면 사다리꼴의 높이를 구할 수 있습니다.`,
              explain: `직각삼각형 ㄱㄴㄷ에서 서로 수직인 두 변 ㄱㄴ(${leg1} cm)과 ㄱㄷ(${leg2} cm)으로 넓이를 구하면 ${leg1} × ${leg2} ÷ 2 = ${triArea}(cm²)이다. 같은 삼각형 ㄱㄴㄷ에서 변 ㄴㄷ(${botB} cm)을 밑변으로 놓으면 높이는 ${triArea} × 2 ÷ ${botB} = ${h}(cm)이고, 이것이 곧 사다리꼴 ㄱㄴㄷㄹ의 높이이다. 따라서 사다리꼴 ㄱㄴㄷㄹ의 넓이는 (${topB} + ${botB}) × ${h} ÷ 2 = ${trapArea}(cm²)이다.`,
              facts: { calc: [[`(${topB}+${botB})*(${leg1}*${leg2}/${botB})/2`, 0]], unseen: [2] }
            });
          }, { standard: AREA }),
          H('adv-gcd-park-trees', '둘레에서 세로를 구한 뒤 최대공약수 간격으로 나무 심기', '수집본 5-1-2 · 5-1-6 융합 · KMA 초5', (d) => {
            const [w, h] = d.pick([
              [48, 36],
              [60, 45],
              [56, 42],
              [72, 48],
              [64, 40],
              [75, 45]
            ]);
            const perim = (w + h) * 2, gap = gcd(w, h), trees = perim / gap;
            return N(`둘레가 ${perim} m이고 가로가 ${w} m인 직사각형 모양의 공원이 있다. 이 공원의 둘레를 따라 일정한 간격으로 나무를 심으려고 한다. 네 모퉁이에는 반드시 나무를 심고 나무를 되도록 적게 심으려면, 필요한 나무는 모두 몇 그루인가?`, trees, {
              unit: '그루',
              figure: parkTreesSvg(perim, w),
              hint: `먼저 직사각형의 둘레(${perim} m)에서 세로의 길이를 구하세요. 나무를 가장 적게 심으려면 가로와 세로의 최대공약수를 간격으로 삼아야 합니다.`,
              explain: `직사각형 공원의 가로와 세로의 합은 ${perim} ÷ 2 = ${w + h}(m)이므로 세로는 ${w + h} − ${w} = ${h}(m)이다. 네 모퉁이에 반드시 심으면서 나무를 되도록 적게 심으려면 나무 사이의 간격이 가로 ${w} m와 세로 ${h} m의 최대공약수인 ${gap} m가 되어야 한다. 둘레 전체가 ${perim} m이므로 필요한 나무는 ${perim} ÷ ${gap} = ${trees}(그루)이다.`,
              facts: { calc: [[`${perim}/${gap}`, 0]], unseen: [2, gap] }
            });
          }, { standard: GCD }),
          H('adv-frac-sum-equiv', '약분한 기약분수와 분모·분자의 합으로 처음 분수 추론하기', '수집본 5-1-4 심화꼴 14번(YBM·비상·지학사 구제)', (d) => {
            const [a, b] = d.pick([
              [3, 5],
              [2, 7],
              [3, 7],
              [4, 7],
              [3, 8],
              [5, 8],
              [4, 9]
            ]);
            const k = d.int(4, 9), num = a * k, den = b * k, sumAB = a + b, totalSum = sumAB * k;
            return M(`어떤 분수를 약분하여 기약분수로 나타내었더니 ${fj(a, b, '이/가')} 되었다. 처음 분수의 분모와 분자의 합이 ${totalSum}일 때, 처음 분수의 분모와 분자를 각각 구하시오.`, [
              { label: '분모', answer: den },
              { label: '분자', answer: num }
            ], {
              hint: `처음 분수는 ${frac(a, b)}의 분모와 분자에 같은 수를 곱한 분수입니다. 분자와 분모를 한 묶음(${a} + ${b} = ${sumAB})으로 보고 몇 배 한 것인지 찾아보세요.`,
              explain: `약분하여 ${fj(a, b, '이/가')} 되는 분수는 분자와 분모에 0이 아닌 같은 수를 곱한 분수이다. 한번에 묶어 보면 분자와 분모에 곱한 수가 1일 때 합은 ${a} + ${b} = ${sumAB}이다. 처음 분수의 분모와 분자의 합이 ${totalSum}이므로 분모와 분자에 곱한 수는 ${totalSum} ÷ ${sumAB} = ${k}이다. 따라서 처음 분수는 ${frac(a + '×' + k, b + '×' + k)} = ${frac(num, den)}이므로 분모는 ${den}, 분자는 ${num}이다.`,
              facts: { calc: [[`${b}*(${totalSum}/(${a}+${b}))`, 0], [`${a}*(${totalSum}/(${a}+${b}))`, 1]] }
            });
          }, { standard: RED }),
          H('adv-frac-rect-perim', '분수의 덧셈·뺄셈으로 세로를 구해 직사각형의 둘레 구하기', '수집본 5-1-5 심화꼴 43·61번(디딤돌·비상·아이스크림 구제)', (d) => {
            const [wWhole, a1, b1, dWhole, a2, b2] = d.pick([
              [4, 3, 4, 1, 1, 6],
              [5, 2, 3, 1, 1, 4],
              [4, 5, 6, 1, 1, 4],
              [5, 3, 5, 1, 1, 2],
              [6, 3, 4, 2, 1, 6]
            ]);
            const L = (b1 * b2) / gcd(b1, b2);
            const wNum = (wWhole * b1 + a1) * (L / b1);
            const dNum = (dWhole * b2 + a2) * (L / b2);
            const hNum = wNum - dNum;
            const hWhole = Math.floor(hNum / L), hRem = hNum % L, gH = gcd(hRem, L);
            const perimNum = (wNum + hNum) * 2;
            const gP = gcd(perimNum, L), pTop = perimNum / gP, pBot = L / gP;
            const pWhole = Math.floor(pTop / pBot), pRem = pTop % pBot;
            return F(`가로가 ${mixed(wWhole, a1, b1)} m이고 세로가 가로보다 ${mixed(dWhole, a2, b2)} m 더 짧은 직사각형 모양의 텃밭이 있다. 이 텃밭의 둘레는 몇 m인가?`, pRem, pBot, {
              whole: pWhole,
              unit: 'm',
              hint: `먼저 (가로) − ${mixed(dWhole, a2, b2)}을 계산하여 세로의 길이를 구하세요. 직사각형의 둘레는 (가로 + 세로) × 2이므로 가로와 세로를 더한 뒤 같은 수를 한 번 더 더하면 됩니다.`,
              explain: `두 분모 ${b1}, ${b2}의 최소공배수 ${josa(L, '으로/로')} 통분하면 가로는 ${mixed(wWhole, a1 * (L / b1), L)} m이고, 세로는 가로보다 ${mixed(dWhole, a2 * (L / b2), L)} m 짧으므로 ${mixed(wWhole, a1 * (L / b1), L)} − ${mixed(dWhole, a2 * (L / b2), L)} = ${mixed(hWhole, hRem / gH, L / gH)}(m)이다. 따라서 텃밭의 둘레는 (가로) + (세로) + (가로) + (세로) = ${mixed(pWhole, pRem, pBot)}(m)이다.`,
              facts: { value: `((${wWhole}+${a1}/${b1})+(${wWhole}+${a1}/${b1}-(${dWhole}+${a2}/${b2})))*2`, unseen: [2] }
            });
          }, { standard: FADD }),
          H('adv-lcm-square-area-m2', '직사각형 타일로 만든 가장 작은 정사각형의 넓이를 m²로 구하기', '수집본 5-1-2 심화꼴 87번 · 5-1-6 넓이 단위 융합', (d) => {
            const [tw, th] = d.pick([
              [40, 50],
              [50, 60],
              [60, 100],
              [40, 75],
              [75, 100]
            ]);
            const sideCm = (tw * th) / gcd(tw, th), sideM = sideCm / 100, areaM2 = sideM * sideM;
            return N(`가로가 ${tw} cm, 세로가 ${th} cm인 직사각형 모양의 타일을 겹치지 않게 같은 방향으로 빈틈없이 이어 붙여 가장 작은 정사각형 모양의 벽면을 꾸미려고 한다. 완성된 정사각형 벽면의 넓이는 몇 m²인가?`, areaM2, {
              unit: 'm²',
              hint: `먼저 가로 ${tw} cm와 세로 ${th} cm의 최소공배수로 정사각형 한 변의 길이(cm)를 구한 뒤, 100 cm = 1 m를 이용해 m 단위로 바꾸어 넓이를 구해 보세요.`,
              explain: `가장 작은 정사각형의 한 변의 길이는 ${josa(tw, '과/와')} ${th}의 최소공배수인 ${sideCm} cm이다. 100 cm = 1 m이므로 정사각형의 한 변의 길이는 ${sideCm} cm = ${sideM} m이고, 구하는 정사각형 벽면의 넓이는 ${sideM} × ${sideM} = ${areaM2}(m²)이다.`,
              facts: { calc: [[`(${sideCm}/100)*(${sideCm}/100)`, 0]], unseen: [100, sideCm] }
            });
          }, { standard: UNITS }),
          H('adv-frac-time-unit-add', '분 단위를 약분하여 시간 단위 분수로 고쳐 계산하기', '수집본 5-1-5 심화꼴 52~54번 구제', (d) => {
            const [w1, a1, b1, mins] = d.pick([
              [1, 3, 4, 40],
              [2, 1, 4, 50],
              [1, 5, 6, 45],
              [2, 2, 3, 45],
              [1, 3, 5, 45]
            ]);
            const g0 = gcd(mins, 60), a2 = mins / g0, b2 = 60 / g0;
            const L = (b1 * b2) / gcd(b1, b2);
            const sumNum = (w1 * b1 + a1) * (L / b1) + a2 * (L / b2);
            const gS = gcd(sumNum, L), top = sumNum / gS, bot = L / gS;
            const whole = Math.floor(top / bot), rem = top % bot;
            return F(`독서 모임에서 첫째 날에는 ${mixed(w1, a1, b1)}시간 동안 책을 읽고, 둘째 날에는 ${mins}분 동안 책을 읽었다. 이틀 동안 책을 읽은 시간은 모두 몇 시간인가?`, rem, bot, {
              whole,
              unit: '시간',
              hint: `1시간은 60분이므로 ${mins}분을 분모가 60인 분수(${frac(mins, 60)}시간)로 나타낸 뒤 기약분수로 약분하여 첫째 날 시간과 더해 보세요.`,
              explain: `1시간은 60분이므로 둘째 날 읽은 ${mins}분은 ${frac(mins, 60)} = ${frac(a2, b2)}(시간)이다. 따라서 이틀 동안 책을 읽은 시간은 ${mixed(w1, a1, b1)} + ${frac(a2, b2)} = ${mixed(w1, a1 * (L / b1), L)} + ${frac(a2 * (L / b2), L)} = ${mixed(whole, rem, bot)}(시간)이다.`,
              facts: { value: `${w1}+${a1}/${b1}+${mins}/60`, unseen: [60] }
            });
          }, { standard: FADD }),
          H('adv-rect-fold-twice', '직사각형에서 가장 큰 정사각형을 두 번 잘라 낸 뒤 남은 넓이 구하기', '수집본 5-1-6 심화꼴 36번(YBM·미래엔 구제) · KMA 초5', (d) => {
            const [w0, h0] = d.pick([
              [15, 9],
              [16, 10],
              [18, 11],
              [20, 13],
              [22, 14],
              [24, 15]
            ]);
            const rem1 = w0 - h0, rem2 = h0 - rem1, area = rem1 * rem2;
            return N(`가로가 ${w0} cm, 세로가 ${h0} cm인 직사각형 모양의 종이에서 그림과 같이 잘라 낼 수 있는 가장 큰 정사각형 ①을 잘라 내고, 남은 직사각형에서 다시 가장 큰 정사각형 ②를 잘라 내었다. 마지막에 남은 색칠한 직사각형의 넓이는 몇 cm²인가?`, area, {
              unit: 'cm²',
              figure: rectFoldTwiceSvg(w0, h0),
              hint: `직사각형에서 잘라 낼 수 있는 가장 큰 정사각형의 한 변의 길이는 직사각형의 짧은 변의 길이와 같습니다. 첫 번째 잘라 낸 뒤 남은 가로와 세로를 먼저 구해 보세요.`,
              explain: `가로 ${w0} cm, 세로 ${h0} cm인 직사각형에서 가장 큰 정사각형 ①은 한 변이 ${h0} cm이므로, 잘라 내고 남은 직사각형은 가로가 ${w0} − ${h0} = ${rem1}(cm), 세로가 ${h0} cm이다. 여기서 다시 가장 큰 정사각형 ②(한 변 ${rem1} cm)를 잘라 내면 마지막에 남은 직사각형은 가로가 ${rem1} cm, 세로가 ${h0} − ${rem1} = ${rem2}(cm)이므로 넓이는 ${rem1} × ${rem2} = ${area}(cm²)이다.`,
              facts: { calc: [[`(${w0}-${h0})*(${h0}-(${w0}-${h0}))`, 0]] }
            });
          }, { standard: RECT }),
          H('adv-rule-stair-perim', '규칙에 따라 이어 붙인 계단 모양 도형의 둘레를 변의 이동으로 구하기', '수집본 5-1-6 심화꼴 17·23번 · 5-1-3 규칙과 대응 융합', (d) => {
            const s = d.pick([2, 3, 4, 5]), step = d.pick([6, 7, 8, 9, 10]);
            const sideLen = s * step, perim = sideLen * 4;
            return N(`한 변이 ${s} cm인 정사각형 모양의 타일을 그림과 같은 규칙으로 겹치지 않게 이어 붙여 계단 모양을 만들고 있다. ${step}째 모양의 둘레는 몇 cm인가?`, perim, {
              unit: 'cm',
              figure: stairPerimSvg(s),
              hint: '계단 모양의 오른쪽 위 계단 선분들을 바깥쪽(위쪽과 오른쪽)으로 밀어내면 어떤 도형의 둘레와 같아지는지 생각해 보세요.',
              explain: `계단 모양에서 가로 방향의 짧은 변들을 위로 밀어 올리고, 세로 방향의 짧은 변들을 오른쪽으로 밀어내면 한 변에 타일이 ${step}개씩 놓인 큰 정사각형의 둘레와 같아진다. ${step}째 모양의 밑변과 왼쪽 변의 길이는 각각 ${s} × ${step} = ${sideLen}(cm)이므로, 전체 둘레는 ${sideLen} × 4 = ${perim}(cm)이다.`,
              facts: { calc: [[`${s}*${step}*4`, 0]], unseen: [4] }
            });
          }, { standard: PERI }),
          H('adv-peri-bundle-rect-area', '정사각형과 둘레가 같고 가로가 세로의 몇 배인 직사각형의 넓이', '수집본 5-1-6 심화꼴 32·33번(YBM·미래엔 구제, 묶음 해설)', (d) => {
            const [times, hRect] = d.pick([
              [2, 4], [2, 5], [2, 6], [2, 8],
              [3, 3], [3, 4], [3, 5], [3, 6]
            ]);
            const wRect = hRect * times, halfPerim = wRect + hRect, perim = halfPerim * 2, sqSide = perim / 4, area = wRect * hRect;
            return N(`한 변의 길이가 ${sqSide} cm인 정사각형과 둘레가 같은 직사각형이 있다. 이 직사각형의 가로가 세로의 ${times}배일 때, 직사각형의 넓이는 몇 cm²인가?`, area, {
              unit: 'cm²',
              hint: `먼저 정사각형의 둘레(${sqSide} × 4)를 구한 뒤 2로 나누어 직사각형의 (가로 + 세로)를 구하세요. 세로를 1묶음으로 놓으면 (가로 + 세로)는 몇 묶음인지 생각해 보세요.`,
              explain: `정사각형의 둘레는 ${sqSide} × 4 = ${perim}(cm)이므로 직사각형의 (가로) + (세로)는 ${perim} ÷ 2 = ${halfPerim}(cm)이다. 세로를 1묶음이라고 하면 가로는 ${times}묶음이므로 합쳐서 ${times} + 1 = ${times + 1}(묶음)이다. 따라서 세로는 ${halfPerim} ÷ ${times + 1} = ${hRect}(cm), 가로는 ${hRect} × ${times} = ${wRect}(cm)이고, 직사각형의 넓이는 ${wRect} × ${hRect} = ${area}(cm²)이다.`,
              facts: { calc: [[`((${sqSide}*4/2)/(${times}+1)*${times})*((${sqSide}*4/2)/(${times}+1))`, 0]], unseen: [4, 2, 1] }
            });
          }, { standard: RECT }),
          H('adv-pour-equal-frac', '물을 옮겨 부어 같아졌을 때 처음 물의 양 거꾸로 추론하기', '수집본 5-1-5 심화꼴 64번 구제 · KMAO 초5', (d) => {
            const [wA, a1, b1, wB, a2, b2] = d.pick([
              [2, 1, 4, 0, 3, 8],
              [1, 2, 3, 0, 1, 2],
              [2, 1, 6, 0, 3, 4],
              [3, 1, 5, 0, 3, 10],
              [1, 3, 4, 0, 5, 6]
            ]);
            const L = (b1 * b2) / gcd(b1, b2);
            const aNum = (wA * b1 + a1) * (L / b1);
            const pNum = (wB * b2 + a2) * (L / b2);
            const eqNum = aNum + pNum, eqWhole = Math.floor(eqNum / L), eqRem = eqNum % L, gEq = gcd(eqRem, L);
            const initBNum = aNum + pNum * 2;
            const gB = gcd(initBNum, L), top = initBNum / gB, bot = L / gB;
            const whole = Math.floor(top / bot), rem = top % bot;
            const display = (w, a, b) => a ? mixed(w, a, b) : String(w);
            const text = `가 물통에는 물이 ${mixed(wA, a1, b1)} L 들어 있다. 나 물통에서 물 ${frac(a2, b2)} L를 가 물통에 옮겨 부었더니 두 물통에 들어 있는 물의 양이 서로 같아졌다. 처음 나 물통에 들어 있던 물은 몇 L인가?`;
            const options = {
              unit: 'L',
              hint: `나 물통에서 ${frac(a2, b2)} L를 덜어 내어 가 물통에 부었더니 같아졌으므로, 먼저 가 물통에 ${frac(a2, b2)} L를 더해 같아졌을 때의 물의 양을 구한 뒤 거꾸로 나 물통의 처음 양을 구해 보세요.`,
              explain: `가 물통에 ${frac(a2, b2)} L를 옮겨 부은 뒤의 물의 양은 ${mixed(wA, a1, b1)} + ${frac(a2, b2)} = ${display(eqWhole, eqRem / gEq, L / gEq)}(L)이다. 이때 나 물통에 남은 물도 ${display(eqWhole, eqRem / gEq, L / gEq)} L이므로, 처음 나 물통에 들어 있던 물은 덜어 냈던 ${frac(a2, b2)} L를 다시 더한 ${display(eqWhole, eqRem / gEq, L / gEq)} + ${frac(a2, b2)} = ${display(whole, rem, bot)}(L)이다.`,
              facts: { value: `${wA}+${a1}/${b1}+${a2}/${b2}+${a2}/${b2}` }
            };
            return rem === 0 ? N(text, whole, options) : F(text, rem, bot, { ...options, whole, anyForm: true });
          }, { standard: FADD })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
