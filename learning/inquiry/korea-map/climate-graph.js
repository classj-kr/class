// 기후 그래프(기온 꺾은선 + 강수량 막대)를 SVG로 그린다. 자료 해석형 문제와 학습 화면의 관측 지점 그래프에 쓴다.
(function () {
  "use strict";

  const MONTHS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  // station: { name, temp[12], rain[12] }. options.title이 있으면 그 제목을, showName이면 지점 이름을 쓴다.
  function build(station, options) {
    const opts = options || {};
    const width = 420, height = 250;
    const left = 42, right = 46, top = 28, bottom = 34;
    const plotW = width - left - right, plotH = height - top - bottom;
    const tMin = -20, tMax = 40;
    const rMax = Math.max(300, Math.ceil(Math.max(...station.rain) / 100) * 100);
    const x = (i) => left + (i + 0.5) * plotW / 12;
    const yT = (t) => top + (tMax - t) / (tMax - tMin) * plotH;
    const yR = (r) => top + plotH - r / rMax * plotH;
    const barW = plotW / 12 * 0.62;

    const parts = [];
    parts.push(`<rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="#fffdf7"/>`);
    for (let t = tMin; t <= tMax; t += 10) {
      parts.push(`<line x1="${left}" y1="${yT(t)}" x2="${left + plotW}" y2="${yT(t)}" stroke="${t === 0 ? "#8b9aa0" : "#e3e6e0"}" stroke-width="${t === 0 ? 1.2 : 1}"/>`);
      parts.push(`<text x="${left - 6}" y="${yT(t) + 4}" text-anchor="end" font-size="10" fill="#c0392b">${t}</text>`);
    }
    for (let r = 0; r <= rMax; r += rMax / 3) {
      parts.push(`<text x="${left + plotW + 6}" y="${yR(r) + 4}" font-size="10" fill="#2f6fb3">${Math.round(r)}</text>`);
    }
    parts.push(`<text x="${left - 4}" y="${top - 12}" text-anchor="end" font-size="10" fill="#c0392b">기온(℃)</text>`);
    parts.push(`<text x="${left + plotW + 4}" y="${top - 12}" font-size="10" fill="#2f6fb3">강수량(mm)</text>`);
    station.rain.forEach((r, i) => {
      const h = Math.max(0, top + plotH - yR(Math.min(r, rMax)));
      parts.push(`<rect x="${x(i) - barW / 2}" y="${top + plotH - h}" width="${barW}" height="${h}" fill="#4f8fe8" opacity=".85"/>`);
    });
    const path = station.temp.map((t, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${yT(t).toFixed(1)}`).join(" ");
    parts.push(`<path d="${path}" fill="none" stroke="#e0403a" stroke-width="2.4" stroke-linejoin="round"/>`);
    station.temp.forEach((t, i) => parts.push(`<circle cx="${x(i)}" cy="${yT(t)}" r="2.6" fill="#e0403a"/>`));
    MONTHS.forEach((m, i) => parts.push(`<text x="${x(i)}" y="${height - bottom + 16}" text-anchor="middle" font-size="10" fill="#587079">${m}월</text>`));
    parts.push(`<line x1="${left}" y1="${top + plotH}" x2="${left + plotW}" y2="${top + plotH}" stroke="#8b9aa0"/>`);

    const avg = station.temp.reduce((a, b) => a + b, 0) / 12;
    const total = station.rain.reduce((a, b) => a + b, 0);
    const range = Math.max(...station.temp) - Math.min(...station.temp);
    const stats = `연평균 ${avg.toFixed(1)}℃ · 연교차 ${range.toFixed(1)}℃ · 연 강수량 ${Math.round(total)}mm`;
    const title = opts.title || (opts.showName ? station.name : "어느 지점의 기후 그래프");
    parts.push(`<text x="${width / 2}" y="${height - 6}" text-anchor="middle" font-size="11" font-weight="700" fill="#17323a">${title} · ${stats}</text>`);

    return {
      svg: `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${title}" preserveAspectRatio="xMidYMid meet">${parts.join("")}</svg>`,
      avg: avg.toFixed(1), total: Math.round(total), range: range.toFixed(1)
    };
  }

  function render(container, station, options) {
    const result = build(station, options);
    container.innerHTML = result.svg;
    return result;
  }

  window.ClimateGraph = { render, build };
})();
