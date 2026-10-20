// 5학년 2학기 종합 — 5학년 2학기까지 배운 여러 단원의 개념을 연결하고, 그림·분할·대응과 거꾸로 추론으로 해결하는 응용 문항.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, mixed, lines, table, N } = B.kit;
  const K523 = B.kit.sym523;
  const K525 = B.kit.box525;
  const U = '5-2-7';
  const ROUND = '6수01-03', FMUL = '6수01-09', DMUL = '6수01-13', SYM = '6수03-02', SOLID = '6수03-04', AVG = '6수05-01';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref, make }, more || {});
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const fj = (num, den, pair) => frac(num, den) + tail(num, pair);

  // ── 그림 도구(풀이 스포일러 없이 문제 상황만 정확히 그린다) ─────────────
  // 1) 땅에 떨어져 절반 높이씩 튀어 오르는 공의 움직임 그림
  function bounceBallSvg(h) {
    const W = 280, Hh = 148, base = 126, r0 = 6, top0 = 24, fullH = base - top0;
    const y1 = base - fullH * 0.5, y2 = base - fullH * 0.25, y3 = base - fullH * 0.125;
    const gY = base - 4.5;
    let out = '';
    // 땅(바닥)
    out += `<line x1="20" y1="${base}" x2="262" y2="${base}" style="stroke:#334155;stroke-width:2"/>`;
    out += `<text x="256" y="${base + 15}" text-anchor="end" style="font-size:10.5px;font-weight:700;fill:#475569">땅</text>`;

    // 처음 높이 치수선 (왼쪽)
    const dimX = 44, startX = 72, midY = (top0 + base) / 2;
    out += `<line x1="${dimX - 4}" y1="${top0}" x2="${startX - 8}" y2="${top0}" style="stroke:#64748b;stroke-width:1;stroke-dasharray:2 2"/>`;
    out += `<line x1="${dimX}" y1="${top0}" x2="${dimX}" y2="${midY - 10}" style="stroke:#1e3a8a;stroke-width:1.3"/>`;
    out += `<line x1="${dimX}" y1="${midY + 10}" x2="${dimX}" y2="${base}" style="stroke:#1e3a8a;stroke-width:1.3"/>`;
    out += `<polyline points="${dimX - 3},${top0 + 5} ${dimX},${top0} ${dimX + 3},${top0 + 5}" style="fill:none;stroke:#1e3a8a;stroke-width:1.3"/>`;
    out += `<polyline points="${dimX - 3},${base - 5} ${dimX},${base} ${dimX + 3},${base - 5}" style="fill:none;stroke:#1e3a8a;stroke-width:1.3"/>`;
    out += `<text x="${dimX}" y="${midY + 4}" text-anchor="middle" style="font-size:11.5px;font-weight:700;fill:#1e3a8a">${h} m</text>`;

    // 첫째·둘째·셋째 튀어 오름의 꼭짓점과 바닥 접점(정확한 포물선 반쪽씩 연결)
    const b1 = 78, p1 = 104, b2 = 130, p2 = 150, b3 = 170, p3 = 185, b4 = 200;
    out += `<line x1="${b1}" y1="${y1}" x2="${b2}" y2="${y1}" style="stroke:#cbd5e1;stroke-width:1;stroke-dasharray:2 2"/>`;
    out += `<line x1="${b2}" y1="${y2}" x2="${b3}" y2="${y2}" style="stroke:#cbd5e1;stroke-width:1;stroke-dasharray:2 2"/>`;

    const arch = (xA, xP, yP, xB) =>
      `Q${((xA + xP) / 2).toFixed(1)} ${yP.toFixed(1)} ${xP} ${yP.toFixed(1)} Q${((xP + xB) / 2).toFixed(1)} ${yP.toFixed(1)} ${xB} ${gY.toFixed(1)}`;
    const pathD = [
      `M${startX} ${top0 + r0}`,
      `Q${((startX + b1) / 2).toFixed(1)} ${top0 + r0} ${b1} ${gY.toFixed(1)}`,
      arch(b1, p1, y1, b2),
      arch(b2, p2, y2, b3),
      arch(b3, p3, y3, b4)
    ].join(' ');
    out += `<path d="${pathD}" style="fill:none;stroke:#ea580c;stroke-width:1.6;stroke-dasharray:4 2"/>`;

    // 각 최고점의 공 표시
    out += `<circle cx="${startX}" cy="${top0}" r="${r0}" style="fill:#fb923c;stroke:#9a3412;stroke-width:1.3"/>`;
    out += `<circle cx="${p1}" cy="${y1.toFixed(1)}" r="5" style="fill:#fed7aa;stroke:#9a3412;stroke-width:1.2"/>`;
    out += `<circle cx="${p2}" cy="${y2.toFixed(1)}" r="4.5" style="fill:#fed7aa;stroke:#9a3412;stroke-width:1.1"/>`;
    out += `<circle cx="${p3}" cy="${y3.toFixed(1)}" r="4" style="fill:#fed7aa;stroke:#9a3412;stroke-width:1.1"/>`;
    out += `<text x="212" y="${base - 8}" style="font-size:13px;font-weight:700;fill:#9a3412">⋯</text>`;

    const said = `땅에서 ${h} m 높이에서 놓은 공이 땅에 닿을 때마다 떨어진 높이의 절반씩 튀어 올랐다가 다시 떨어지기를 되풀이하는 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 2) 연못에 세운 두 막대 그림(등분 칸 수 스포일러 없이 수면과 길이 차만 표시)
  function pondRodsSvg(n1, n2, m, diffCm) {
    const W = 256, Hh = 148, base = 128, unitH = 92 / n1, waterY = base - m * unitH;
    const x1 = 68, x2 = 142, rw = 26;
    const yTop1 = base - n1 * unitH, yTop2 = base - n2 * unitH;
    let out = '';
    // 물 영역과 바닥
    out += `<rect x="22" y="${waterY.toFixed(1)}" width="212" height="${(base - waterY).toFixed(1)}" style="fill:#dbeafe;stroke:none"/>`;
    out += `<line x1="22" y1="${waterY.toFixed(1)}" x2="234" y2="${waterY.toFixed(1)}" style="stroke:#2563eb;stroke-width:1.5;stroke-dasharray:4 3"/>`;
    out += `<text x="28" y="${(waterY - 5).toFixed(1)}" style="font-size:10.5px;font-weight:700;fill:#1d4ed8">수면</text>`;
    out += `<line x1="18" y1="${base}" x2="238" y2="${base}" style="stroke:#334155;stroke-width:2"/>`;

    // 긴 막대와 짧은 막대 (물속 부분과 물 위 부분만 구분, 칸 수는 표시하지 않음)
    const drawRod = (x, yTop, label) => {
      out += `<rect x="${x}" y="${yTop.toFixed(1)}" width="${rw}" height="${(waterY - yTop).toFixed(1)}" style="fill:#fef3c7;stroke:#1e293b;stroke-width:1.3"/>`;
      out += `<rect x="${x}" y="${waterY.toFixed(1)}" width="${rw}" height="${(base - waterY).toFixed(1)}" style="fill:#60a5fa;stroke:#1e293b;stroke-width:1.3"/>`;
      out += `<text x="${x + rw / 2}" y="${base + 15}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${label}</text>`;
    };
    drawRod(x1, yTop1, '긴 막대');
    drawRod(x2, yTop2, '짧은 막대');

    // 두 막대의 길이 차 표시
    const dimX = x2 + rw + 14;
    out += `<line x1="${x1 + rw}" y1="${yTop1.toFixed(1)}" x2="${dimX + 4}" y2="${yTop1.toFixed(1)}" style="stroke:#dc2626;stroke-width:1;stroke-dasharray:2 2"/>`;
    out += `<line x1="${x2 + rw}" y1="${yTop2.toFixed(1)}" x2="${dimX + 4}" y2="${yTop2.toFixed(1)}" style="stroke:#dc2626;stroke-width:1;stroke-dasharray:2 2"/>`;
    out += `<line x1="${dimX}" y1="${yTop1.toFixed(1)}" x2="${dimX}" y2="${yTop2.toFixed(1)}" style="stroke:#dc2626;stroke-width:1.4"/>`;
    out += `<text x="${dimX + 7}" y="${((yTop1 + yTop2) / 2 + 4).toFixed(1)}" style="font-size:11px;font-weight:700;fill:#dc2626">${diffCm} cm</text>`;

    const said = `연못에 똑바로 세운 긴 막대와 짧은 막대: 두 막대의 길이의 차는 ${diffCm} cm`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 3) 정사각형의 가로·세로를 늘인 그림(보조선 분할 스포일러 없이 ㄱ자 색칠 영역만 표시)
  function squareExpandSvg(d, areaGain) {
    const W = 256, Hh = 158, x0 = 24, y0 = 30, sPx = 74, dPx = 32, tot = sPx + dPx;
    let out = '';
    // 늘어난 ㄱ자 영역(전체 정사각형 칠한 뒤 처음 정사각형 덮기)
    out += `<rect x="${x0}" y="${y0}" width="${tot}" height="${tot}" style="fill:#fde68a;stroke:#1e293b;stroke-width:1.4"/>`;
    out += `<rect x="${x0}" y="${y0}" width="${sPx}" height="${sPx}" style="fill:#ffffff;stroke:#1e293b;stroke-width:1.4;stroke-dasharray:4 2"/>`;
    out += `<text x="${x0 + sPx / 2}" y="${y0 + sPx / 2 - 4}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#334155">처음</text>`;
    out += `<text x="${x0 + sPx / 2}" y="${y0 + sPx / 2 + 11}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#334155">정사각형</text>`;
    // 가로·세로 늘인 길이 표시
    out += `<line x1="${x0 + sPx}" y1="${y0 - 8}" x2="${x0 + tot}" y2="${y0 - 8}" style="stroke:#1e3a8a;stroke-width:1.2"/>`;
    out += `<line x1="${x0 + sPx}" y1="${y0 - 12}" x2="${x0 + sPx}" y2="${y0 - 4}" style="stroke:#1e3a8a;stroke-width:1.2"/>`;
    out += `<line x1="${x0 + tot}" y1="${y0 - 12}" x2="${x0 + tot}" y2="${y0 - 4}" style="stroke:#1e3a8a;stroke-width:1.2"/>`;
    out += `<text x="${x0 + sPx + dPx / 2}" y="${y0 - 13}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e3a8a">${d} m</text>`;

    out += `<line x1="${x0 - 8}" y1="${y0 + sPx}" x2="${x0 - 8}" y2="${y0 + tot}" style="stroke:#1e3a8a;stroke-width:1.2"/>`;
    out += `<line x1="${x0 - 12}" y1="${y0 + sPx}" x2="${x0 - 4}" y2="${y0 + sPx}" style="stroke:#1e3a8a;stroke-width:1.2"/>`;
    out += `<line x1="${x0 - 12}" y1="${y0 + tot}" x2="${x0 - 4}" y2="${y0 + tot}" style="stroke:#1e3a8a;stroke-width:1.2"/>`;
    out += `<text x="${x0 + sPx / 2}" y="${y0 + sPx + dPx / 2 + 4}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#78350f">${d} m씩 늘임</text>`;

    // 오른쪽에 늘어난 넓이 안내
    out += `<line x1="${x0 + tot - 8}" y1="${y0 + sPx / 2}" x2="144" y2="${y0 + sPx / 2}" style="stroke:#b45309;stroke-width:1.1"/>`;
    out += `<text x="148" y="${y0 + sPx / 2 - 4}" style="font-size:11px;font-weight:700;fill:#78350f">늘어난 넓이</text>`;
    out += `<text x="148" y="${y0 + sPx / 2 + 13}" style="font-size:11.5px;font-weight:700;fill:#b45309">${areaGain} m²</text>`;

    const said = `처음 정사각형의 가로와 세로를 각각 ${d} m씩 늘여 색칠한 ㄱ자 부분의 넓이가 ${areaGain} m²가 된 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 4) 선대칭과 점대칭을 차례로 완성할 직각삼각형 ㄱㄴㅇ과 대칭축 가, 대칭의 중심 ㅇ 그림
  function symBothSvg(w, h) {
    const W = 240, Hh = 156, cx = 132, cy = 104;
    const scale = Math.min(72 / w, 64 / h), pw = w * scale, ph = h * scale;
    let out = '';
    // 대칭축 직선 가 (위아래 여유 있게 배치)
    out += `<line x1="${cx}" y1="14" x2="${cx}" y2="142" style="stroke:#dc2626;stroke-width:1.5;stroke-dasharray:5 3"/>`;
    out += `<text x="${cx + 8}" y="24" style="font-size:11.5px;font-weight:700;fill:#dc2626">가</text>`;
    // 주어진 직각삼각형 ㄱㄴㅇ
    out += `<polygon points="${cx},${(cy - ph).toFixed(1)} ${(cx - pw).toFixed(1)},${cy} ${cx},${cy}" style="fill:#93c5fd;stroke:#1e3a8a;stroke-width:1.5;stroke-linejoin:round"/>`;
    // 직각 표시
    out += `<polyline points="${cx - 8},${cy} ${cx - 8},${cy - 8} ${cx},${cy - 8}" style="fill:none;stroke:#1e3a8a;stroke-width:1.2"/>`;
    // 대칭의 중심 점 ㅇ
    out += `<circle cx="${cx}" cy="${cy}" r="3.2" style="fill:#111827"/>`;
    // 꼭짓점 이름 ㄱ, ㄴ, ㅇ (잘리지 않게 안쪽 여유 확보)
    out += `<text x="${cx - 6}" y="${(cy - ph - 6).toFixed(1)}" text-anchor="end" style="font-size:11.5px;font-weight:700;fill:#111827">ㄱ</text>`;
    out += `<text x="${(cx - pw - 6).toFixed(1)}" y="${cy + 4}" text-anchor="end" style="font-size:11.5px;font-weight:700;fill:#111827">ㄴ</text>`;
    out += `<text x="${cx + 8}" y="${cy + 14}" style="font-size:11.5px;font-weight:700;fill:#111827">ㅇ</text>`;
    // 변의 길이 표시 (선분과 겹치지 않는 바깥쪽)
    out += `<text x="${(cx - pw / 2).toFixed(1)}" y="${cy + 16}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e3a8a">${w} cm</text>`;
    out += `<text x="${cx + 8}" y="${(cy - ph / 2 + 4).toFixed(1)}" style="font-size:11px;font-weight:700;fill:#1e3a8a">${h} cm</text>`;

    const said = `변 ㄴㅇ이 ${w} cm, 변 ㄱㅇ이 ${h} cm인 직각삼각형 ㄱㄴㅇ과 대칭축인 직선 가, 대칭의 중심인 점 ㅇ`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 5) 계단 위에서 튀어 오르는 공의 경로 그림
  function stairBounceSvg(stepH, peak2, num, den) {
    const W = 286, Hh = 154, base = 132, stepY = base - 28;
    let out = '';
    // 바닥과 계단 1단
    out += `<rect x="132" y="${stepY}" width="132" height="${base - stepY}" style="fill:#e2e8f0;stroke:none"/>`;
    out += `<line x1="132" y1="${base}" x2="264" y2="${base}" style="stroke:#64748b;stroke-width:1.1;stroke-dasharray:3 2"/>`;
    out += `<path d="M18 ${base} H132 V${stepY} H264" style="fill:none;stroke:#334155;stroke-width:2"/>`;
    out += `<text x="64" y="${base + 15}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#334155">바닥</text>`;
    out += `<text x="178" y="${stepY + 18}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#334155">계단 ${stepH} cm</text>`;

    // 처음 공 위치와 바닥까지 높이 표시
    const startX = 64, startY = 26, peak1X = 104, peak1Y = 44, hitStepX = 148, peak2X = 182, peak2Y = 62, endStepX = 208;
    const dimX = 36, midLeftY = (startY + base) / 2;
    out += `<line x1="${dimX - 4}" y1="${startY}" x2="${startX - 8}" y2="${startY}" style="stroke:#64748b;stroke-width:1;stroke-dasharray:2 2"/>`;
    out += `<line x1="${dimX}" y1="${startY}" x2="${dimX}" y2="${midLeftY - 10}" style="stroke:#9a3412;stroke-width:1.2"/>`;
    out += `<line x1="${dimX}" y1="${midLeftY + 10}" x2="${dimX}" y2="${base}" style="stroke:#9a3412;stroke-width:1.2"/>`;
    out += `<polyline points="${dimX - 3},${startY + 5} ${dimX},${startY} ${dimX + 3},${startY + 5}" style="fill:none;stroke:#9a3412;stroke-width:1.2"/>`;
    out += `<polyline points="${dimX - 3},${base - 5} ${dimX},${base} ${dimX + 3},${base - 5}" style="fill:none;stroke:#9a3412;stroke-width:1.2"/>`;
    out += `<text x="${dimX}" y="${midLeftY + 4}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#9a3412">□ cm</text>`;

    // 이동 경로: 처음(startX, startY) -> 바닥(74, base-4.5) -> 첫째 최고점(peak1X, peak1Y) -> 계단 위(hitStepX, stepY-4.5) -> 둘째 최고점(peak2X, peak2Y)
    const hit1X = 72, g1Y = base - 4.5, g2Y = stepY - 4.5;
    const pathD = [
      `M${startX} ${startY + 5.5}`,
      `Q${((startX + hit1X) / 2).toFixed(1)} ${startY + 5.5} ${hit1X} ${g1Y}`,
      `Q${((hit1X + peak1X) / 2).toFixed(1)} ${peak1Y} ${peak1X} ${peak1Y}`,
      `Q${((peak1X + hitStepX) / 2).toFixed(1)} ${peak1Y} ${hitStepX} ${g2Y}`,
      `Q${((hitStepX + peak2X) / 2).toFixed(1)} ${peak2Y} ${peak2X} ${peak2Y}`,
      `Q${((peak2X + endStepX) / 2).toFixed(1)} ${peak2Y} ${endStepX} ${g2Y}`
    ].join(' ');
    out += `<path d="${pathD}" style="fill:none;stroke:#ea580c;stroke-width:1.6;stroke-dasharray:4 2"/>`;
    out += `<circle cx="${startX}" cy="${startY}" r="5.5" style="fill:#fb923c;stroke:#9a3412;stroke-width:1.2"/>`;
    out += `<circle cx="${peak1X}" cy="${peak1Y}" r="4.5" style="fill:#fed7aa;stroke:#9a3412;stroke-width:1.1"/>`;
    out += `<circle cx="${peak2X}" cy="${peak2Y}" r="5" style="fill:#fb923c;stroke:#9a3412;stroke-width:1.2"/>`;

    // 둘째 최고점 높이 표시(바닥에서 peak2 cm)
    const rDimX = 240, midRightY = (peak2Y + base) / 2;
    out += `<line x1="${peak2X + 7}" y1="${peak2Y}" x2="${rDimX + 4}" y2="${peak2Y}" style="stroke:#2563eb;stroke-width:1.1;stroke-dasharray:2 2"/>`;
    out += `<line x1="${rDimX}" y1="${peak2Y}" x2="${rDimX}" y2="${base}" style="stroke:#2563eb;stroke-width:1.3"/>`;
    out += `<polyline points="${rDimX - 3},${peak2Y + 5} ${rDimX},${peak2Y} ${rDimX + 3},${peak2Y + 5}" style="fill:none;stroke:#2563eb;stroke-width:1.3"/>`;
    out += `<polyline points="${rDimX - 3},${base - 5} ${rDimX},${base} ${rDimX + 3},${base - 5}" style="fill:none;stroke:#2563eb;stroke-width:1.3"/>`;
    out += `<text x="${rDimX}" y="${peak2Y - 7}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1d4ed8">바닥에서 ${peak2} cm</text>`;

    const said = `바닥에서 □ cm 높이에서 놓은 공이 바닥에 닿아 ${num}/${den}만큼 튀어 오르고, 높이 ${stepH} cm인 계단 위에 닿아 다시 ${num}/${den}만큼 튀어 올라 바닥에서 ${peak2} cm 높이에 이른 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  B.addUnit({
    id: U, grade: 5, semester: 2, no: 7, title: '초 5학년 2학기 종합', semesterAdvanced: true, version: 2,
    groups: [
      {
        id: 'hard', title: '초 5학년 2학기 종합', standard: FMUL,
        types: [
          H('adv-bounce-strip', '띠 분할과 왕복 짝짓기로 튀어 오르는 공의 이동 거리 구하기', 'KMA 2020 하반기 초5 23번(해설 개작)', (d) => {
            const h = d.pick([4, 5, 6, 8, 10, 12, 14, 16, 18, 20]), total = h * 3;
            return N(`공을 땅에서 ${h} m 높이에서 가만히 놓아 떨어뜨리면, 땅에 닿을 때마다 바로 앞에 떨어진 높이의 ${frac(1, 2)}만큼씩 튀어 올랐다가 다시 떨어지기를 멈출 때까지 되풀이한다. 공이 멈출 때까지 움직인 거리는 모두 몇 m인가?`, total, {
              unit: 'm',
              figure: bounceBallSvg(h),
              hint: `길이가 ${h} m인 띠에서 처음 튀어 오른 거리(절반), 그다음 튀어 오른 거리(남은 부분의 절반)를 차례로 색칠하면 ${h} m짜리 띠 1개가 꼭 채워집니다. 튀어 올라간 거리와 다시 내려온 거리를 짝지어 보세요.`,
              explain: `길이가 ${h} m인 띠에서 처음 튀어 오른 거리(${frac(1, 2)}), 그다음 튀어 오른 거리(남은 부분의 절반인 ${frac(1, 4)}), 그다음(${frac(1, 8)})을 차례로 색칠해 모으면 ${h} m짜리 띠 1개가 꼭 채워진다. 공은 튀어 올라간 만큼 똑같이 다시 내려오므로, 튀어 올랐다가 내려온 거리는 ${h} m짜리 띠 2개인 ${h} × 2 = ${h * 2}(m)이다. 여기에 처음 내려온 거리 ${h} m를 더하면 움직인 전체 거리는 ${h} + ${h} × 2 = ${total}(m)이다.`,
              facts: { calc: [[`${h}+${h}*2`, 0]], unseen: [2] }
            });
          }),
          H('adv-pond-rods', '물에 잠긴 칸 수를 같게 맞추어 연못의 깊이 구하기', 'KMAO 2024 초5 12번(해설 개작)', (d) => {
            const [a1, b1, a2, b2, m] = d.pick([
              [2, 5, 3, 4, 6],
              [2, 3, 4, 5, 4],
              [3, 5, 2, 3, 6],
              [3, 7, 2, 3, 6],
              [2, 5, 2, 3, 2]
            ]);
            const n1 = b1 * (m / a1), n2 = b2 * (m / a2), gap = n1 - n2;
            const unit = d.pick([5, 6, 8, 10, 12, 15]), diffCm = gap * unit, depth = m * unit;
            return N(`길이가 서로 다른 두 막대를 바닥이 평평한 연못에 똑바로 세웠더니, 긴 막대는 전체 길이의 ${fj(a1, b1, '이/가')} 물에 잠기고 짧은 막대는 전체 길이의 ${fj(a2, b2, '이/가')} 물에 잠겼다. 두 막대의 길이의 차가 ${diffCm} cm일 때, 연못의 물의 깊이는 몇 cm인가?`, depth, {
              unit: 'cm',
              figure: pondRodsSvg(n1, n2, m, diffCm),
              hint: '두 막대가 물에 잠긴 길이는 연못의 깊이로 서로 같습니다. 크기가 같은 분수를 이용해 두 분수의 분자(물에 잠긴 칸 수)를 같게 맞춰 보세요.',
              explain: `두 막대가 물에 잠긴 길이는 연못의 깊이로 서로 같다. 크기가 같은 분수의 성질로 두 분수의 분자(물에 잠긴 칸 수)를 ${josa(m, '으로/로')} 같게 맞추면 ${frac(a1, b1)} = ${frac(m, n1)}, ${frac(a2, b2)} = ${frac(m, n2)}이다. 즉 연못의 깊이를 똑같이 ${m}칸으로 놓으면 긴 막대는 ${n1}칸, 짧은 막대는 ${n2}칸이다. 두 막대의 차 ${n1} − ${n2} = ${gap}(칸)이 ${diffCm} cm이므로 한 칸은 ${diffCm} ÷ ${gap} = ${unit}(cm)이고, 연못의 깊이는 ${unit} × ${m} = ${depth}(cm)이다.`,
              facts: { calc: [[`${diffCm}/(${n1}-${n2})*${m}`, 0]], unseen: [m, n1, n2] }
            });
          }),
          H('adv-square-expand', '늘어난 ㄱ자 모양을 나누어 처음 정사각형의 한 변 구하기', 'KMA 2025 하반기 초5 24번(해설 개작)', (d) => {
            const dLen = d.pick([1.5, 2.5, 3.5]), s = d.pick([4, 6, 8, 10, 12, 14]);
            const corner = dLen * dLen, twoStrips = 2 * dLen * s, areaGain = twoStrips + corner, twoD = dLen * 2;
            return N(`정사각형 모양의 땅에서 가로와 세로를 각각 ${dLen} m씩 늘였더니 넓이가 ${areaGain} m²만큼 늘어났다. 처음 정사각형의 한 변의 길이는 몇 m인가?`, s, {
              unit: 'm',
              figure: squareExpandSvg(dLen, areaGain),
              hint: `늘어난 ㄱ자 모양을 선으로 나누어 오른쪽 아래 모서리의 작은 정사각형(${dLen} m × ${dLen} m) 넓이를 먼저 빼 보세요. 남은 두 직사각형을 이어 붙이면 처음 정사각형의 한 변을 구할 수 있습니다.`,
              explain: `늘어난 ㄱ자 모양에서 오른쪽 아래 모서리에 생기는 한 변이 ${dLen} m인 작은 정사각형의 넓이는 ${dLen} × ${dLen} = ${corner}(m²)이다. 늘어난 넓이에서 이 넓이를 빼면, 처음 정사각형의 가로·세로에 붙은 합동인 두 직사각형의 넓이의 합은 ${areaGain} − ${corner} = ${twoStrips}(m²)이다. 두 직사각형을 이어 붙이면 폭이 ${dLen} + ${dLen} = ${twoD}(m)인 직사각형이 되므로, 처음 정사각형의 한 변의 길이는 ${twoStrips} ÷ ${twoD} = ${s}(m)이다.`,
              facts: { calc: [[`(${areaGain}-${dLen}*${dLen})/(${dLen}+${dLen})`, 0]] }
            });
          }, { standard: DMUL }),
          H('adv-sym-both-area', '선대칭과 점대칭을 차례로 완성한 도형의 넓이', 'HME 2020 하반기 초5 22번 · KMA 2021 하반기 28번', (d) => {
            const w = d.pick([3, 4, 5, 6, 7]), h = d.pick([4, 5, 6, 8]), total = w * h * 2, oneTwo = w * h;
            return N(`그림의 직각삼각형 ㄱㄴㅇ을 직선 가를 대칭축으로 하는 선대칭도형으로 완성한 뒤, 그 도형을 다시 점 ㅇ을 대칭의 중심으로 하는 점대칭도형으로 완성하였다. 완성한 도형 전체의 넓이는 몇 cm²인가?`, total, {
              unit: 'cm²',
              figure: symBothSvg(w, h),
              hint: '직선 가로 접어 만든 선대칭도형은 처음 직각삼각형이 몇 개인지, 그것을 다시 점 ㅇ을 중심으로 180° 돌려 완성하면 모두 몇 개가 되는지 세어 보세요.',
              explain: `직선 가를 대칭축으로 하는 선대칭도형을 완성하면 합동인 직각삼각형 2개가 되고, 이를 다시 점 ㅇ을 대칭의 중심으로 하는 점대칭도형으로 완성하면 합동인 직각삼각형 4개로 이루어진 마름모가 된다. 직각삼각형 2개를 합치면 가로 ${w} cm, 세로 ${h} cm인 직사각형의 넓이 ${w} × ${h} = ${oneTwo}(cm²)과 같으므로, 4개 전체의 넓이는 ${oneTwo} × 2 = ${total}(cm²)이다.`,
              facts: { calc: [[`${w}*${h}*2`, 0]], unseen: [2] }
            });
          }, { standard: SYM }),
          H('adv-net-fold-area', '전개도를 접었을 때 맞닿는 선분과 평행한 면의 넓이', '수집본 5-2-5 심화꼴 64~66번 구제', (d) => {
            const dims = K525.dims3(d, 3, 9), net = K525.boxNet(d, dims, { cols: 40, rows: 30 }), cuts = K525.cutsOf(net), boxBounds = K525.boundsOf(net.rects);
            const lenOf = (cut) => Math.abs(cut.at[0][0] - cut.at[1][0]) + Math.abs(cut.at[0][1] - cut.at[1][1]);
            const given = dims.map((L) => d.pick(cuts.filter((c) => lenOf(c) === L)));
            const i = d.int(0, 5), opp = net.face.indexOf(net.face[i] ^ 1), rect = net.rects[opp], area = rect.w * rect.h;
            const TAGS = K525.TAGS;
            return N(`직육면체의 전개도이다. 이 전개도를 접어 직육면체를 만들었을 때, 면 ${TAGS[i]}와 평행한 면의 넓이는 몇 cm²인가?`, area, {
              unit: 'cm²',
              figure: K525.netArt(net.rects, {
                unit: Math.min(220 / boxBounds.w, 185 / boxBounds.h),
                faceText: TAGS,
                lens: given.map((g) => ({ a: g.at[0], b: g.at[1], text: lenOf(g) + ' cm' })),
                label: `직육면체의 전개도. 면 가~바가 적혀 있고 테두리의 세 선분의 길이는 ${dims.map((x) => x + ' cm').join(', ')}이며, 면 ${TAGS[opp]}의 가로와 세로는 ${rect.w} cm, ${rect.h} cm`
              }),
              hint: `먼저 전개도를 접었을 때 면 ${TAGS[i]}와 마주 보는(평행한) 면이 어느 면인지 찾고, 맞닿는 선분을 따라가 그 면의 가로와 세로 길이를 구해 보세요.`,
              explain: `전개도를 접었을 때 면 ${TAGS[i]}와 평행한(마주 보는) 면은 면 ${TAGS[opp]}이다. 맞닿는 선분과 평행한 선분의 길이가 같다는 성질로 면 ${TAGS[opp]}의 이웃한 두 변의 길이를 찾으면 ${rect.w} cm와 ${rect.h} cm이므로, 넓이는 ${rect.w} × ${rect.h} = ${area}(cm²)이다.`,
              facts: { calc: [[`${rect.w}*${rect.h}`, 0]] }
            });
          }, { standard: SOLID }),
          H('adv-round-bus-chair', '두 어림 조건에서 수의 범위의 공통부분 추론하기', 'KMA 2025 하반기 초5 26번', (d) => {
            const busCap = d.pick([30, 35, 40, 45]), busFull = d.int(2, 4);
            const rLo = d.int(12, 18), rHi = rLo + d.int(3, 5);
            const a1 = busCap * busFull + rLo, a2 = busCap * busFull + rHi;
            const pickLeft = d.bool(), ans = pickLeft ? a1 : a2;
            const b1 = pickLeft ? ans - d.int(3, 5) : ans;
            const b2 = pickLeft ? ans : ans + d.int(3, 5);
            return N('어느 학년 학생 전체가 현장 체험 학습을 가려고 한다. 다음 두 조건을 모두 만족하는 이 학년 전체 학생 수는 몇 명인가?', ans, {
              unit: '명',
              figure: lines([
                `㈎ 한 대에 ${busCap}명씩 타는 버스에 빈자리 없이 차례로 타면 ${busFull}대는 모두 차고, 마지막 버스에는 ${rLo}명 이상 ${rHi}명 이하가 탄다.`,
                `㈏ 강당에 모였을 때 전체 학생 수를 어림한 범위는 ${b1}명 이상 ${b2}명 이하이다.`
              ]),
              hint: `조건 ㈎에서 ${busFull}대에 탄 학생 수(${busCap} × ${busFull})에 마지막 버스 인원을 더해 학생 수의 범위를 먼저 구한 뒤, 조건 ㈏의 범위와 겹치는 수를 찾아보세요.`,
              explain: `조건 ㈎에서 버스 ${busFull}대에 탄 학생은 ${busCap} × ${busFull} = ${busCap * busFull}(명)이고 마지막 버스에 ${rLo}명 이상 ${rHi}명 이하가 타므로, 전체 학생 수는 ${busCap * busFull} + ${rLo} = ${a1}(명) 이상 ${busCap * busFull} + ${rHi} = ${a2}(명) 이하이다. 이 범위와 조건 ㈏의 ${b1}명 이상 ${b2}명 이하에 공통으로 들어가는 수는 ${ans}명뿐이다.`,
              facts: { calc: [[pickLeft ? `${busCap}*${busFull}+${rLo}` : `${busCap}*${busFull}+${rHi}`, 0]] }
            });
          }, { standard: ROUND }),
          H('adv-stair-bounce', '계단 위에서 튀어 오르는 공의 처음 높이 거꾸로 추론하기', 'KMAO 2026 초5 22번', (d) => {
            const [num, den] = d.pick([[3, 4], [2, 3], [3, 5]]);
            const k = d.int(2, 4);
            const fall2 = den * num * k, bounce2 = num * num * k;
            const validStep = num === 3 ? d.pick([12, 18, 24, 30]) : d.pick([10, 14, 18, 22]);
            const firstPeak = validStep + fall2, startH = (firstPeak / num) * den, peak2 = validStep + bounce2;
            return N(`바닥에서 한 단의 높이가 ${validStep} cm인 계단이 있다. 바닥에서 □ cm 높이에서 공을 가만히 놓아 떨어뜨렸더니, 첫 번째에는 바닥에 닿아 떨어진 높이의 ${frac(num, den)}만큼 튀어 오르고, 두 번째에는 계단 위(${validStep} cm 높이)에 닿아 계단 위까지 떨어진 거리의 ${frac(num, den)}만큼 튀어 올랐다. 두 번째로 튀어 올라 가장 높이 올라갔을 때가 바닥에서 ${peak2} cm 높이였다면, 처음 공을 놓은 높이 □는 몇 cm인가?`, startH, {
              unit: 'cm',
              figure: stairBounceSvg(validStep, peak2, num, den),
              hint: `두 번째 최고점 높이(${peak2} cm)에서 계단 높이(${validStep} cm)를 먼저 빼야 계단 위에서 튀어 오른 높이를 알 수 있습니다. 그 값에서 거꾸로 계산해 보세요.`,
              explain: `두 번째로 튀어 올라 바닥에서 ${peak2} cm가 되었으므로, 계단(${validStep} cm) 위에서 튀어 오른 높이는 ${peak2} − ${validStep} = ${bounce2}(cm)이다. 이 높이는 첫째 최고점에서 계단 위까지 떨어진 거리의 ${frac(num, den)}이므로, 계단 위까지 떨어진 거리는 ${bounce2} ÷ ${num} × ${den} = ${fall2}(cm)이다. 따라서 첫 번째로 튀어 오른 최고점의 높이는 바닥에서 ${fall2} + ${validStep} = ${firstPeak}(cm)이고, 이는 처음 높이의 ${frac(num, den)}이므로 처음 높이는 ${firstPeak} ÷ ${num} × ${den} = ${startH}(cm)이다.`,
              facts: { calc: [[`(((${peak2}-${validStep})/${num}*${den})+${validStep})/${num}*${den}`, 0]] }
            });
          }, { standard: FMUL }),
          H('adv-point-sym-round', '점대칭 숫자의 회전 규칙과 반올림 조건으로 세 자리 수 추론하기', '디딤돌 5-2-3 서술형 · HME 2019 하반기 초5 21번 융합', (d) => {
            const mid = d.pick([0, 2, 5, 8]), useSixNine = d.bool();
            const [hund, one] = useSixNine ? (d.bool() ? [6, 9] : [9, 6]) : (() => { const x = d.pick([2, 5, 8].filter((v) => v !== mid)); return [x, x]; })();
            const ans = hund * 100 + mid * 10 + one;
            const roundedHund = Math.round(ans / 100) * 100;
            const cards = [0, 2, 3, 5, 6, 8, 9];
            return N(`다음 디지털 숫자 카드 가운데 세 장을 골라 세 자리 수를 만들었더니, 만든 세 자리 수 전체가 점대칭도형이 되었다. 이 세 자리 수를 십의 자리에서 반올림하여 백의 자리까지 나타내면 ${josa(roundedHund, '이/가')} 되고, 백의 자리 숫자는 ${hund}, 십의 자리 숫자는 ${mid}일 때, 이 세 자리 수는 얼마인가?`, ans, {
              figure: K523.plainRow(cards.map((x) => K523.digitCard(x))),
              hint: '세 자리 수 전체를 180° 돌렸을 때 처음과 겹치려면 백의 자리 숫자를 180° 돌린 모양이 일의 자리 숫자가 되어야 합니다. 6을 180° 돌리면 어떤 숫자가 되는지 살펴보세요.',
              explain: `세 자리 수 전체를 180° 돌렸을 때 처음과 완전히 겹치려면, 십의 자리 숫자는 180° 돌려도 같은 모양인 0, 2, 5, 8 가운데 하나여야 하고, 백의 자리 숫자를 180° 돌린 모양이 일의 자리 숫자와 같아야 한다. 백의 자리 숫자가 ${hund}이므로 180° 돌리면 ${josa(one, '이/가')} 되어 일의 자리 숫자는 ${one}이다. 따라서 구하는 세 자리 수는 ${ans}이다.`,
              facts: { calc: [[`${hund}*100+${mid}*10+${one}`, 0]], unseen: [100, 10, one] }
            });
          }, { standard: SYM }),
          H('adv-mean-round-recover', '평균으로 구한 합계와 반올림 조건을 연결해 가려진 값 구하기', '수집본 5-2-6 · 5-2-1 융합', (d) => {
            const who = d.pick(NAMES), rBase = d.pick([60, 70, 80, 90]), isMax = d.bool();
            const valC = isMax ? rBase + 4 : rBase - 5;
            const [valA, valB, valD] = d.until(
              () => [d.int(62, 94), d.int(62, 94), d.int(62, 94)],
              ([a, b, dd]) => (a + b + valC + dd) % 4 === 0 && a !== b && dd !== valC
            );
            const avg = (valA + valB + valC + valD) / 4, total = avg * 4;
            return N(`${name(who, '이/가')} 네 번에 걸쳐 한 줄넘기 기록을 나타낸 표인데 3회와 4회 기록이 지워졌다. 네 번의 기록의 평균이 ${avg}번이고, 3회 기록 ㉠은 일의 자리에서 반올림하여 십의 자리까지 나타내면 ${josa(rBase, '이/가')} 되는 자연수 가운데 가장 ${isMax ? '큰' : '작은'} 수일 때, 4회 기록 ㉡은 몇 번인가?`, valD, {
              unit: '번',
              figure: table(['회차', '1회', '2회', '3회', '4회'], [['기록(번)', valA, valB, box('㉠'), box('㉡')]]),
              hint: `먼저 일의 자리에서 반올림하여 ${josa(rBase, '이/가')} 되는 수의 범위(${rBase - 5} 이상 ${rBase + 4} 이하)에서 ㉠을 구한 뒤, (평균) × 4로 네 번의 기록의 합계를 구해 ㉡을 찾아보세요.`,
              explain: `일의 자리에서 반올림하여 십의 자리까지 나타내면 ${josa(rBase, '이/가')} 되는 자연수는 ${rBase - 5} 이상 ${rBase + 4} 이하이므로, 그중 가장 ${isMax ? '큰' : '작은'} 수인 ㉠은 ${valC}이다. 네 번의 기록의 평균이 ${avg}번이므로 합계는 ${avg} × 4 = ${total}(번)이고, ㉡은 ${total} − ${valA} − ${valB} − ${valC} = ${valD}(번)이다.`,
              facts: { calc: [[`${avg}*4-${valA}-${valB}-${valC}`, 0]], unseen: [4, valC] }
            });
          }, { standard: AVG }),
          H('adv-frac-dist-water', '1분 동안 모이는 양을 먼저 묶어 분수의 곱셈을 간단히 하기', '수집본 5-2-2 심화꼴 32번 · YBM 단원심화', (d) => {
            const den = d.pick([5, 6, 7, 8, 9]), num1 = d.int(1, den - 1), num2 = den - num1;
            const w1 = d.int(1, 3), w2 = d.int(1, 3), perMin = w1 + w2 + 1;
            const mins = d.pick([12, 15, 18, 20, 24]), total = perMin * mins;
            return N(`빈 물통에 가 수도꼭지로는 1분에 ${mixed(w1, num1, den)} L씩, 나 수도꼭지로는 1분에 ${mixed(w2, num2, den)} L씩 물이 나온다. 두 수도꼭지를 동시에 틀어 ${mins}분 동안 물을 받으면 물통에 모이는 물은 모두 몇 L인가?`, total, {
              unit: 'L',
              hint: `가 수도꼭지와 나 수도꼭지에서 ${mins}분 동안 나오는 물을 따로 곱하지 말고, 두 수도꼭지에서 1분 동안 함께 나오는 물의 양을 먼저 더해 보세요.`,
              explain: `두 수도꼭지에서 ${mins}분 동안 나오는 물을 따로 곱하면 분수 계산이 복잡하지만, 1분 동안 함께 나오는 물의 양을 먼저 구하면 ${mixed(w1, num1, den)} + ${mixed(w2, num2, den)} = (${w1} + ${w2}) + (${frac(num1, den)} + ${frac(num2, den)}) = ${perMin}(L)로 자연수가 된다. 따라서 ${mins}분 동안 모이는 물은 ${perMin} × ${mins} = ${total}(L)이다.`,
              facts: { calc: [[`(${w1}+${w2}+(${num1}+${num2})/${den})*${mins}`, 0]] }
            });
          }, { standard: FMUL })
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
