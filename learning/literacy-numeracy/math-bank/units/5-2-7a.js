// 5학년 2학기 학기 실력 — 5학년 2학기까지 배운 여러 단원의 개념을 연결하고, 그림·분할·대응과 거꾸로 추론으로 해결하는 응용 문항.
//
// 구성 원칙
//  - 차시 연습(기본)과 단원 종합이 한 단원 안의 개념·유형을 다룬다면, 학기 실력은 서로 다른 단원의 개념을 함께 쓰거나
//    상위 학년 공식(무한등비급수, 연립방정식, 이차방정식) 없이 초등 수준의 그림·분할·대응·역추론으로 구조를 꿰뚫어 푸는 문항만 싣는다.
//  - 나열이 일의 대부분인 경우의 수 문제나 단순 계산 반복 문제는 싣지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, mixed, table, N, C } = B.kit;
  const K523 = B.kit.sym523;
  const K525 = B.kit.box525;
  const U = '5-2-7';
  const ROUND = '6수01-03', FMUL = '6수01-09', DMUL = '6수01-13', SYM = '6수03-02', SOLID = '6수03-04', AVG = '6수05-01';
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref, make }, more || {});

  // 소수나 자연수 글의 끝자리 숫자로 토씨를 붙인다(1.5를, 2.25는).
  const BATCHIM = [true, true, false, true, false, false, true, true, true, false];
  const RIEUL = [false, true, false, false, false, false, false, true, true, false];
  const dj = (text, pair) => {
    const [yes, no] = pair.split('/'), k = Number(String(text).slice(-1));
    return text + (yes === '으로' ? (BATCHIM[k] && !RIEUL[k] ? '으로' : '로') : BATCHIM[k] ? yes : no);
  };

  // ── 그림 도구 ────────────────────────────────────────────────
  // 1) 튀어 오르는 공의 이동 거리를 띠 분할과 왕복 짝짓기로 나타낸 그림
  function bounceStripSvg(h) {
    const W = 288, x0 = 76, barW = 196, hh = 20;
    const h1 = h / 2, h2 = h / 4, h3 = h / 8;
    let out = '';
    // 첫째 줄: 처음 내려온 거리 (h m 띠 1개)
    out += `<text x="6" y="25" style="font-size:11px;font-weight:700;fill:#1e293b">처음 내려옴</text>`;
    out += `<rect x="${x0}" y="11" width="${barW}" height="${hh}" style="fill:#bfdbfe;stroke:#1e3a8a;stroke-width:1.2"/>`;
    out += `<text x="${x0 + barW / 2}" y="25" text-anchor="middle" style="font-size:11.5px;font-weight:700;fill:#1e3a8a">${h} m (띠 1개)</text>`;

    // 둘째 줄: 튀어 올라간 거리 모으기 (1/2 + 1/4 + 1/8 + ... = 띠 1개)
    const y2 = 45;
    out += `<text x="6" y="${y2 + 14}" style="font-size:11px;font-weight:700;fill:#1e293b">튀어 올라감</text>`;
    const splits = [0, 0.5, 0.75, 0.875, 0.9375, 1];
    const colors = ['#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706'];
    for (let i = 0; i < splits.length - 1; i += 1) {
      const sx = x0 + splits[i] * barW, sw = (splits[i + 1] - splits[i]) * barW;
      out += `<rect x="${sx.toFixed(1)}" y="${y2}" width="${sw.toFixed(1)}" height="${hh}" style="fill:${colors[i]};stroke:#78350f;stroke-width:1.1"/>`;
    }
    out += `<text x="${x0 + barW * 0.25}" y="${y2 + 14}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#78350f">1/2</text>`;
    out += `<text x="${x0 + barW * 0.625}" y="${y2 + 14}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#78350f">1/4</text>`;
    out += `<text x="${x0 + barW * 0.8125}" y="${y2 + 14}" text-anchor="middle" style="font-size:9.5px;font-weight:700;fill:#78350f">1/8</text>`;
    out += `<text x="${x0 + barW * 0.95}" y="${y2 + 14}" text-anchor="middle" style="font-size:10px;font-weight:700;fill:#78350f">…</text>`;

    // 셋째 줄: 다시 내려온 거리 모으기 (튀어 올라간 거리와 똑같이 짝지어 띠 1개)
    const y3 = 79;
    out += `<text x="6" y="${y3 + 14}" style="font-size:11px;font-weight:700;fill:#1e293b">다시 내려옴</text>`;
    for (let i = 0; i < splits.length - 1; i += 1) {
      const sx = x0 + splits[i] * barW, sw = (splits[i + 1] - splits[i]) * barW;
      out += `<rect x="${sx.toFixed(1)}" y="${y3}" width="${sw.toFixed(1)}" height="${hh}" style="fill:#bbf7d0;stroke:#14532d;stroke-width:1.1"/>`;
    }
    out += `<text x="${x0 + barW * 0.25}" y="${y3 + 14}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#14532d">1/2</text>`;
    out += `<text x="${x0 + barW * 0.625}" y="${y3 + 14}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#14532d">1/4</text>`;
    out += `<text x="${x0 + barW * 0.8125}" y="${y3 + 14}" text-anchor="middle" style="font-size:9.5px;font-weight:700;fill:#14532d">1/8</text>`;
    out += `<text x="${x0 + barW * 0.95}" y="${y3 + 14}" text-anchor="middle" style="font-size:10px;font-weight:700;fill:#14532d">…</text>`;

    const said = `공이 움직인 거리를 나타낸 띠 그림: 처음 내려온 거리 ${h} m 띠 1개, 튀어 올라간 거리를 절반씩 이어 붙인 ${h} m 띠 1개(${h1} m, ${h2} m, ${h3} m …), 다시 내려온 거리를 이어 붙인 ${h} m 띠 1개`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} 108" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 2) 연못에 세운 두 막대의 등분 모형 그림(물에 잠긴 칸 수를 m칸으로 같게 맞춤)
  function pondRodsSvg(n1, n2, m, diffCm) {
    const W = 264, Hh = 152, base = 134, unitH = Math.min(13, 96 / n1), waterY = base - m * unitH;
    const x1 = 76, x2 = 156, rw = 28;
    const yTop1 = base - n1 * unitH, yTop2 = base - n2 * unitH;
    let out = '';
    // 물 영역과 바닥
    out += `<rect x="24" y="${waterY.toFixed(1)}" width="216" height="${(base - waterY).toFixed(1)}" style="fill:#dbeafe;stroke:none"/>`;
    out += `<line x1="24" y1="${waterY.toFixed(1)}" x2="240" y2="${waterY.toFixed(1)}" style="stroke:#2563eb;stroke-width:1.5;stroke-dasharray:4 3"/>`;
    out += `<text x="28" y="${(waterY - 4).toFixed(1)}" style="font-size:10.5px;font-weight:700;fill:#1d4ed8">수면</text>`;
    out += `<line x1="20" y1="${base}" x2="244" y2="${base}" style="stroke:#334155;stroke-width:2"/>`;

    // 긴 막대(n1칸)와 짧은 막대(n2칸)
    const drawRod = (x, n, label) => {
      for (let k = 0; k < n; k += 1) {
        const yy = base - (k + 1) * unitH, under = k < m;
        out += `<rect x="${x}" y="${yy.toFixed(1)}" width="${rw}" height="${unitH.toFixed(1)}" style="fill:${under ? '#60a5fa' : '#fef3c7'};stroke:#1e293b;stroke-width:1"/>`;
      }
      out += `<text x="${x + rw / 2}" y="${base + 14}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${label}(${n}칸)</text>`;
    };
    drawRod(x1, n1, '긴 막대');
    drawRod(x2, n2, '짧은 막대');

    // 길이 차 표시
    out += `<line x1="${x1 + rw + 4}" y1="${yTop1.toFixed(1)}" x2="${x2 + rw + 14}" y2="${yTop1.toFixed(1)}" style="stroke:#dc2626;stroke-width:1;stroke-dasharray:2 2"/>`;
    out += `<line x1="${x2 + rw}" y1="${yTop2.toFixed(1)}" x2="${x2 + rw + 14}" y2="${yTop2.toFixed(1)}" style="stroke:#dc2626;stroke-width:1;stroke-dasharray:2 2"/>`;
    out += `<line x1="${x2 + rw + 10}" y1="${yTop1.toFixed(1)}" x2="${x2 + rw + 10}" y2="${yTop2.toFixed(1)}" style="stroke:#dc2626;stroke-width:1.4"/>`;
    out += `<text x="${x2 + rw + 16}" y="${((yTop1 + yTop2) / 2 + 4).toFixed(1)}" style="font-size:11px;font-weight:700;fill:#dc2626">차 ${diffCm} cm</text>`;
    const said = `연못에 세운 두 막대: 물에 잠긴 깊이를 똑같이 ${m}칸으로 맞추었을 때 긴 막대는 ${n1}칸, 짧은 막대는 ${n2}칸이고 두 막대의 길이의 차는 ${diffCm} cm`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 3) 정사각형의 가로·세로를 늘였을 때 생기는 ㄱ자 영역을 3조각으로 나눈 그림
  function squareExpandSvg(d, areaGain) {
    const W = 252, Hh = 158, x0 = 28, y0 = 16, sPx = 78, dPx = 34;
    let out = '';
    // 처음 정사각형
    out += `<rect x="${x0}" y="${y0}" width="${sPx}" height="${sPx}" style="fill:#f8fafc;stroke:#1e293b;stroke-width:1.4"/>`;
    out += `<text x="${x0 + sPx / 2}" y="${y0 + sPx / 2 + 4}" text-anchor="middle" style="font-size:11.5px;font-weight:700;fill:#334155">처음 정사각형</text>`;
    // 늘어난 직사각형 2개 (가, 나)
    out += `<rect x="${x0 + sPx}" y="${y0}" width="${dPx}" height="${sPx}" style="fill:#fde68a;stroke:#1e293b;stroke-width:1.3"/>`;
    out += `<text x="${x0 + sPx + dPx / 2}" y="${y0 + sPx / 2 + 4}" text-anchor="middle" style="font-size:11.5px;font-weight:700;fill:#78350f">가</text>`;
    out += `<rect x="${x0}" y="${y0 + sPx}" width="${sPx}" height="${dPx}" style="fill:#fde68a;stroke:#1e293b;stroke-width:1.3"/>`;
    out += `<text x="${x0 + sPx / 2}" y="${y0 + sPx + dPx / 2 + 4}" text-anchor="middle" style="font-size:11.5px;font-weight:700;fill:#78350f">나</text>`;
    // 모서리 작은 정사각형 (다)
    out += `<rect x="${x0 + sPx}" y="${y0 + sPx}" width="${dPx}" height="${dPx}" style="fill:#fca5a5;stroke:#1e293b;stroke-width:1.3"/>`;
    out += `<text x="${x0 + sPx + dPx / 2}" y="${y0 + sPx + dPx / 2 + 4}" text-anchor="middle" style="font-size:11.5px;font-weight:700;fill:#991b1b">다</text>`;
    // 늘인 길이 표시
    out += `<text x="${x0 + sPx + dPx / 2}" y="${y0 - 4}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e293b">${d} m</text>`;
    out += `<text x="${x0 + sPx + dPx + 6}" y="${y0 + sPx + dPx / 2 + 4}" style="font-size:11px;font-weight:700;fill:#1e293b">${d} m</text>`;
    out += `<text x="154" y="54" style="font-size:11px;font-weight:700;fill:#1e293b">늘어난 넓이(가+나+다)</text>`;
    out += `<text x="154" y="72" style="font-size:12px;font-weight:700;fill:#b45309">= ${areaGain} m²</text>`;
    const said = `정사각형의 가로와 세로를 각각 ${d} m씩 늘인 그림: 늘어난 ㄱ자 부분은 합동인 직사각형 가, 나 두 개와 한 변이 ${d} m인 정사각형 다로 나뉘며, 늘어난 넓이의 합은 ${areaGain} m²`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 4) 선대칭과 점대칭을 차례로 완성하는 도형 그림
  function symBothSvg(w, h) {
    const W = 256, Hh = 156, cx = 128, cy = 78, sx = 11, pw = w * sx, ph = h * sx;
    let out = '';
    // 완성될 나머지 세 조각(점선 테두리와 옅은 색)
    out += `<polygon points="${cx},${cy - ph} ${cx + pw},${cy} ${cx},${cy}" style="fill:#fef9c3;stroke:#94a3b8;stroke-width:1.1;stroke-dasharray:3 2"/>`;
    out += `<polygon points="${cx},${cy + ph} ${cx - pw},${cy} ${cx},${cy}" style="fill:#fef9c3;stroke:#94a3b8;stroke-width:1.1;stroke-dasharray:3 2"/>`;
    out += `<polygon points="${cx},${cy + ph} ${cx + pw},${cy} ${cx},${cy}" style="fill:#fef9c3;stroke:#94a3b8;stroke-width:1.1;stroke-dasharray:3 2"/>`;
    // 처음 주어진 직각삼각형 ㄱㄴㄷ (왼쪽 위)
    out += `<polygon points="${cx},${cy - ph} ${cx - pw},${cy} ${cx},${cy}" style="fill:#93c5fd;stroke:#1e3a8a;stroke-width:1.5"/>`;
    // 직각 표시
    out += `<polyline points="${cx - 8},${cy} ${cx - 8},${cy - 8} ${cx},${cy - 8}" style="fill:none;stroke:#1e3a8a;stroke-width:1.1"/>`;
    // 대칭축 직선 가
    out += `<line x1="${cx}" y1="10" x2="${cx}" y2="${Hh - 10}" style="stroke:#dc2626;stroke-width:1.4;stroke-dasharray:5 3"/>`;
    out += `<text x="${cx + 14}" y="18" style="font-size:11px;font-weight:700;fill:#dc2626">대칭축 가</text>`;
    // 대칭의 중심 점 ㅇ(ㄷ)
    out += `<circle cx="${cx}" cy="${cy}" r="3.2" style="fill:#111827"/>`;
    out += `<text x="${cx - 10}" y="${cy - ph - 4}" style="font-size:11.5px;font-weight:700;fill:#111827">ㄱ</text>`;
    out += `<text x="${cx - pw - 12}" y="${cy + 4}" style="font-size:11.5px;font-weight:700;fill:#111827">ㄴ</text>`;
    out += `<text x="${cx + 6}" y="${cy + 14}" style="font-size:11.5px;font-weight:700;fill:#111827">ㅇ</text>`;
    // 길이 표시
    out += `<text x="${cx - pw / 2}" y="${cy + 15}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e3a8a">${w} cm</text>`;
    out += `<text x="${cx + 22}" y="${cy - ph / 2 + 4}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1e3a8a">${h} cm</text>`;
    const said = `밑변이 ${w} cm, 높이가 ${h} cm인 직각삼각형 ㄱㄴㅇ과 세로 대칭축 가, 대칭의 중심 점 ㅇ`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 5) 두 수의 범위의 공통부분을 보여주는 수직선 그림
  function overlapLineSvg(a1, a2, b1, b2) {
    const W = 284, Hh = 86, lo = Math.min(a1, b1) - 2, hi = Math.max(a2, b2) + 2;
    const x = (v) => 28 + (v - lo) / (hi - lo) * 228, axis = 58;
    let out = `<line class="mb-axis" x1="20" y1="${axis}" x2="264" y2="${axis}" style="stroke-width:1.8"/>`;
    for (let v = lo; v <= hi; v += 1) {
      out += `<line class="mb-axis" x1="${x(v).toFixed(1)}" y1="${axis - 4}" x2="${x(v).toFixed(1)}" y2="${axis + 4}" style="stroke-width:1.1"/>`;
    }
    const marks = [...new Set([a1, a2, b1, b2])].sort((p, q) => p - q);
    marks.forEach((v, idx) => {
      const dy = idx > 0 && marks[idx] - marks[idx - 1] <= 1 ? (idx % 2 === 1 ? 26 : 15) : 16;
      out += `<text x="${x(v).toFixed(1)}" y="${axis + dy}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#1e293b">${v}</text>`;
    });
    // 범위 (가): 위쪽 파란 선
    out += `<line x1="${x(a1).toFixed(1)}" y1="22" x2="${x(a2).toFixed(1)}" y2="22" style="stroke:#2563eb;stroke-width:2.4"/>`;
    out += `<circle cx="${x(a1).toFixed(1)}" cy="22" r="3.2" style="fill:#2563eb"/><circle cx="${x(a2).toFixed(1)}" cy="22" r="3.2" style="fill:#2563eb"/>`;
    out += `<text x="${((x(a1) + x(a2)) / 2).toFixed(1)}" y="14" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#1d4ed8">(가) ${a1} 이상 ${a2} 이하</text>`;
    // 범위 (나): 아래쪽 주황 선
    out += `<line x1="${x(b1).toFixed(1)}" y1="38" x2="${x(b2).toFixed(1)}" y2="38" style="stroke:#d97706;stroke-width:2.4"/>`;
    out += `<circle cx="${x(b1).toFixed(1)}" cy="38" r="3.2" style="fill:#d97706"/><circle cx="${x(b2).toFixed(1)}" cy="38" r="3.2" style="fill:#d97706"/>`;
    out += `<text x="${((x(b1) + x(b2)) / 2).toFixed(1)}" y="51" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#b45309">(나) ${b1} 이상 ${b2} 이하</text>`;
    const said = `수직선 위의 두 범위: (가) ${a1} 이상 ${a2} 이하, (나) ${b1} 이상 ${b2} 이하`;
    return `<svg class="mb-numberline" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // 6) 계단 위에서 튀어 오르는 공의 경로 그림
  function stairBounceSvg(stepH, peak2, num, den) {
    const W = 276, Hh = 148, base = 130, stepY = base - 28;
    let out = '';
    // 바닥과 계단 1단
    out += `<path d="M18 ${base} H136 V${stepY} H254" style="fill:none;stroke:#334155;stroke-width:2"/>`;
    out += `<text x="44" y="${base + 14}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#334155">바닥</text>`;
    out += `<text x="228" y="${stepY + 14}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#334155">계단(${stepH} cm)</text>`;
    // 공의 이동 경로 (처음 높이 -> 바닥 -> 첫째 최고점 -> 계단 위 -> 둘째 최고점)
    out += `<circle cx="52" cy="22" r="5" style="fill:#f97316;stroke:#9a3412;stroke-width:1.2"/>`;
    out += `<text x="52" y="13" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:#9a3412">처음 높이 □ cm</text>`;
    out += `<path d="M52 27 V${base - 4} Q82 36 112 36 Q142 36 168 ${stepY - 4} Q192 54 214 54" style="fill:none;stroke:#ea580c;stroke-width:1.6;stroke-dasharray:4 2"/>`;
    out += `<circle cx="112" cy="36" r="4" style="fill:#fdba74;stroke:#9a3412;stroke-width:1.1"/>`;
    out += `<circle cx="214" cy="54" r="4.5" style="fill:#f97316;stroke:#9a3412;stroke-width:1.2"/>`;
    // 둘째 최고점 높이 표시(바닥 기준 peak2 cm)
    out += `<line x1="214" y1="54" x2="214" y2="${base}" style="stroke:#2563eb;stroke-width:1.2;stroke-dasharray:2 2"/>`;
    out += `<text x="214" y="45" text-anchor="middle" style="font-size:11px;font-weight:700;fill:#1d4ed8">바닥에서 ${peak2} cm</text>`;
    const said = `바닥에서 처음 높이 □ cm에서 떨어진 공이 바닥에 닿아 ${num}/${den}만큼 튀어 오르고, 높이 ${stepH} cm인 계단 위에 닿아 다시 ${num}/${den}만큼 튀어 올라 바닥에서 ${peak2} cm 높이에 이른 그림`;
    return `<svg class="mb-geo" viewBox="0 0 ${W} ${Hh}" width="${W}" role="img" aria-label="${said}">${out}</svg>`;
  }

  B.addUnit({
    id: U, grade: 5, semester: 2, no: 7, title: '학기 실력', semesterAdvanced: true, version: 1,
    groups: [
      {
        id: 'model', title: '그림·분할·대응으로 구조 찾기', standard: FMUL,
        types: [
          H('adv-bounce-strip', '띠 분할과 왕복 짝짓기로 튀어 오르는 공의 이동 거리 구하기', 'KMA 2020 하반기 초5 23번(해설 개작)', (d) => {
            const h = d.pick([4, 5, 6, 8, 10, 12, 14, 16, 18, 20]), total = h * 3;
            return N(`공을 땅에서 ${h} m 높이에서 가만히 놓아 떨어뜨리면, 땅에 닿을 때마다 바로 앞에 떨어진 높이의 ${frac(1, 2)}만큼씩 튀어 올랐다가 다시 떨어지기를 멈출 때까지 되풀이한다. 그림과 같이 길이가 ${h} m인 띠를 반씩 나누어 튀어 올라간 거리를 모을 때, 공이 멈출 때까지 움직인 거리는 모두 몇 m인가?`, total, {
              unit: 'm',
              figure: bounceStripSvg(h),
              hint: `길이가 ${h} m인 띠에서 절반, 남은 부분의 절반을 차례로 색칠하면 띠 1개가 꼭 채워집니다. 튀어 올라간 거리와 다시 내려온 거리를 짝지어 보세요.`,
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
            return N(`길이가 서로 다른 두 막대를 바닥이 평평한 연못에 똑바로 세웠더니, 긴 막대는 전체 길이의 ${frac(a1, b1)}${josa(a1, '이/가')} 물에 잠기고 짧은 막대는 전체 길이의 ${frac(a2, b2)}${josa(a2, '이/가')} 물에 잠겼다. 두 막대의 길이의 차가 ${diffCm} cm일 때, 연못의 물의 깊이는 몇 cm인가?`, depth, {
              unit: 'cm',
              figure: pondRodsSvg(n1, n2, m, diffCm),
              hint: '두 막대가 물에 잠긴 길이는 연못의 깊이로 서로 같습니다. 크기가 같은 분수를 이용해 두 분수의 분자(물에 잠긴 칸 수)를 같게 맞춰 보세요.',
              explain: `두 막대가 물에 잠긴 길이는 연못의 깊이로 서로 같다. 크기가 같은 분수의 성질로 두 분수의 분자(물에 잠긴 칸 수)를 ${josa(m, '으로/로')} 같게 맞추면 ${frac(a1, b1)} = ${frac(m, n1)}, ${frac(a2, b2)} = ${frac(m, n2)}이다. 즉 연못의 깊이를 똑같이 ${m}칸으로 놓으면 긴 막대는 ${n1}칸, 짧은 막대는 ${n2}칸이다. 두 막대의 차 ${n1} − ${n2} = ${gap}(칸)이 ${diffCm} cm이므로 한 칸은 ${diffCm} ÷ ${gap} = ${unit}(cm)이고, 연못의 깊이는 ${unit} × ${m} = ${depth}(cm)이다.`,
              facts: { calc: [[`${diffCm}/(${n1}-${n2})*${m}`, 0]] }
            });
          }),
          H('adv-square-expand', '늘어난 ㄱ자 모양을 나누어 처음 정사각형의 한 변 구하기', 'KMA 2025 하반기 초5 24번(해설 개작)', (d) => {
            const dLen = d.pick([1.5, 2.5, 3.5]), s = d.pick([4, 6, 8, 10, 12, 14]);
            const corner = dLen * dLen, twoStrips = 2 * dLen * s, areaGain = twoStrips + corner, twoD = dLen * 2;
            return N(`정사각형 모양의 땅에서 가로와 세로를 각각 ${dLen} m씩 늘였더니 넓이가 ${areaGain} m²만큼 늘어났다. 처음 정사각형의 한 변의 길이는 몇 m인가?`, s, {
              unit: 'm',
              figure: squareExpandSvg(dLen, areaGain),
              hint: `늘어난 ㄱ자 모양에서 오른쪽 아래 모서리의 작은 정사각형(${dLen} m × ${dLen} m) 넓이를 먼저 빼 보세요. 남은 두 직사각형을 이어 붙이면 가로와 세로가 얼마인지 알 수 있습니다.`,
              explain: `늘어난 부분 가운데 모서리의 작은 정사각형 다의 넓이는 ${dLen} × ${dLen} = ${corner}(m²)이다. 늘어난 넓이에서 다의 넓이를 빼면 합동인 두 직사각형 가와 나의 넓이의 합은 ${areaGain} − ${corner} = ${twoStrips}(m²)이다. 가와 나를 옆으로 이어 붙이면 한 변이 ${dLen} + ${dLen} = ${twoD}(m)이고 다른 한 변이 처음 정사각형의 한 변인 직사각형이 되므로, 처음 정사각형의 한 변의 길이는 ${twoStrips} ÷ ${twoD} = ${s}(m)이다.`,
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
          }, { standard: SOLID })
        ]
      },
      {
        id: 'infer', title: '여러 단원 개념을 연결해 추론하기', standard: ROUND,
        types: [
          H('adv-round-bus-chair', '두 어림 조건에서 수의 범위의 공통부분 추론하기', 'KMA 2025 하반기 초5 26번', (d) => {
            const busCap = d.pick([30, 35, 40, 45]), busFull = d.int(2, 4);
            const rLo = d.int(12, 18), rHi = rLo + d.int(3, 5);
            const a1 = busCap * busFull + rLo, a2 = busCap * busFull + rHi;
            // 두 번째 조건(긴 의자)의 범위 [b1, b2]가 [a1, a2]와 오직 한 수(ans)에서만 겹치도록 설정
            const pickLeft = d.bool(), ans = pickLeft ? a1 : a2;
            const b1 = pickLeft ? ans - d.int(3, 5) : ans;
            const b2 = pickLeft ? ans : ans + d.int(3, 5);
            return N(`어느 학년 학생 전체가 현장 체험 학습을 가려고 한다. 조건 (가)와 (나)를 모두 만족하는 이 학년 전체 학생 수는 몇 명인가?<br>㈎ 한 대에 ${busCap}명씩 타는 버스에 빈자리 없이 차례로 타면 ${busFull}대는 모두 차고, 마지막 버스에는 ${rLo}명 이상 ${rHi}명 이하가 탄다.<br>㈏ 강당에 모였을 때 학생 수를 어림한 범위는 ${b1}명 이상 ${b2}명 이하이다.`, ans, {
              unit: '명',
              figure: overlapLineSvg(a1, a2, b1, b2),
              hint: `조건 (가)에서 ${busFull}대에 탄 학생 수(${busCap} × ${busFull})에 마지막 버스 인원을 더해 학생 수의 범위를 먼저 구한 뒤, 조건 (나)의 범위와 겹치는 수를 찾아보세요.`,
              explain: `조건 (가)에서 버스 ${busFull}대에 탄 학생은 ${busCap} × ${busFull} = ${busCap * busFull}(명)이고 마지막 버스에 ${rLo}명 이상 ${rHi}명 이하가 타므로, 전체 학생 수는 ${busCap * busFull} + ${rLo} = ${a1}(명) 이상 ${busCap * busFull} + ${rHi} = ${a2}(명) 이하이다. 이 범위와 조건 (나)의 ${b1}명 이상 ${b2}명 이하를 수직선에 함께 나타내면 두 범위에 공통으로 들어가는 수는 ${ans}명뿐이다.`,
              facts: { calc: [[pickLeft ? `${busCap}*${busFull}+${rLo}` : `${busCap}*${busFull}+${rHi}`, 0]] }
            });
          }, { standard: ROUND }),
          H('adv-stair-bounce', '계단 위에서 튀어 오르는 공의 처음 높이 거꾸로 추론하기', 'KMAO 2026 초5 22번', (d) => {
            const [num, den] = d.pick([[3, 4], [2, 3], [3, 5]]);
            const stepH = d.pick([12, 16, 20, 24]), k = d.int(2, 4);
            // (H1 - stepH) 가 den 의 배수가 되고 H1 이 num 의 배수가 되도록 구성
            const fall2 = den * num * k, bounce2 = num * num * k;
            const h1 = stepH + fall2;
            // h1 이 num 으로 나누어떨어지도록 stepH 를 num 의 배수로 선택(12, 24 는 2와 3의 공배수)
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
            // 점대칭 3자리 수: 180° 돌렸을 때 처음과 완전히 겹치려면 가운데(십의 자리)는 0, 2, 5, 8 중 하나이고,
            // 백의 자리와 일의 자리는 서로 같거나(2-2, 5-5, 8-8) 6과 9처럼 180° 돌리면 서로 바뀌는 짝(6-9, 9-6)이어야 한다.
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
