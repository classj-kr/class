(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FractionBoard = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const MAX_DENOMINATOR = 24, MAX_UNITS = 4, MAX_CARDS = 6;
  const SHAPES = { bar: '사각막대', grid: '사각형', line: '수직선', circle: '원판' };
  const COLORS = ['#287f71', '#d98343', '#5e78b4', '#ac5d7b', '#8068a8'];
  const integer = (value, low, high) => Number.isInteger(value) && value >= low && value <= high;
  const range = count => Array.from({ length: count }, (_, i) => i);
  const count = card => card.cells.length;
  function rowsFor(d) {
    for (let r = Math.floor(Math.sqrt(d)); r > 0; r--) if (d % r === 0) return r;
  }
  function makeCard(id, shape = 'bar', n = 3, d = 8) {
    if (!SHAPES[shape] || !integer(d, 1, MAX_DENOMINATOR) || !integer(n, 0, d * MAX_UNITS)) throw Error('분수 범위를 확인해 주세요.');
    return { id, shape, denominator: d, units: Math.max(1, Math.ceil(n / d)), cells: range(n), rows: rowsFor(d), color: COLORS[0], lines: true, shading: true, labels: true };
  }
  function setFraction(card, n, d) {
    if (!integer(d, 1, MAX_DENOMINATOR)) throw Error('등분 수는 1부터 24까지 정할 수 있어요.');
    if (!integer(n, 0, d * MAX_UNITS)) throw Error(`색칠할 칸 수는 0부터 ${d * MAX_UNITS}까지예요. 전체는 4개까지 놓을 수 있어요.`);
    return { ...card, denominator: d, units: Math.max(card.units, Math.ceil(n / d)), cells: range(n), rows: d % card.rows === 0 ? card.rows : rowsFor(d) };
  }
  function setDenominator(card, d, keepAmount) {
    if (!integer(d, 1, MAX_DENOMINATOR)) throw Error('등분 수는 1부터 24까지 정할 수 있어요.');
    const scaled = count(card) * d;
    if (keepAmount && scaled % card.denominator !== 0) throw Error(`${count(card)}/${card.denominator}의 양을 ${d}등분한 온전한 칸으로는 나타낼 수 없어요. 등분 수를 바꾸거나 ‘양 유지’를 꺼 주세요.`);
    return setFraction(card, keepAmount ? scaled / card.denominator : count(card), d);
  }
  function setUnits(card, units) {
    if (!integer(units, 1, MAX_UNITS)) throw Error('전체는 1개부터 4개까지 놓을 수 있어요.');
    if (card.cells.some(i => i >= units * card.denominator)) throw Error('줄이려는 전체에 색칠한 부분이 있어요. 먼저 그 부분을 지워 주세요.');
    return { ...card, units };
  }
  function paint(card, index) {
    if (card.shape === 'line') {
      if (!integer(index, 0, card.units * card.denominator)) return card;
      return { ...card, cells: range(index) };
    }
    if (!integer(index, 0, card.units * card.denominator - 1)) return card;
    return { ...card, cells: card.cells.includes(index) ? card.cells.filter(i => i !== index) : [...card.cells, index].sort((a, b) => a - b) };
  }
  function changeShape(card, shape) {
    if (!SHAPES[shape]) return card;
    return { ...card, shape, cells: shape === 'line' ? range(count(card)) : [...card.cells] };
  }
  function mixed(card) {
    const n = count(card), d = card.denominator, whole = Math.floor(n / d), rest = n % d;
    return n < d ? '' : rest ? `${whole}과 ${rest}/${d}` : String(whole);
  }
  function validate(value) {
    if (!value || value.version !== 1 || !Array.isArray(value.cards) || !integer(value.cards.length, 1, MAX_CARDS)) throw Error('그림 자료를 읽을 수 없어요.');
    const ids = new Set();
    const cards = value.cards.map(c => {
      if (!c || typeof c.id !== 'string' || !/^[a-z0-9-]{1,50}$/.test(c.id) || ids.has(c.id) || !SHAPES[c.shape] || !integer(c.denominator, 1, MAX_DENOMINATOR) || !integer(c.units, 1, MAX_UNITS) || !integer(c.rows, 1, c.denominator) || c.denominator % c.rows || !COLORS.includes(c.color) || !Array.isArray(c.cells) || c.cells.length > c.units * c.denominator || c.cells.some(i => !integer(i, 0, c.units * c.denominator - 1)) || new Set(c.cells).size !== c.cells.length || ['lines', 'shading', 'labels'].some(key => typeof c[key] !== 'boolean')) throw Error('그림 자료를 읽을 수 없어요.');
      ids.add(c.id);
      return { ...makeCard(c.id), shape: c.shape, denominator: c.denominator, units: c.units, rows: c.rows, color: c.color, cells: c.shape === 'line' ? range(c.cells.length) : [...c.cells].sort((a,b) => a-b), lines: c.lines, shading: c.shading, labels: c.labels };
    });
    return { version: 1, cards, selectedId: ids.has(value.selectedId) ? value.selectedId : cards[0].id };
  }
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
  const text = (x, y, content, size = 18, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="#354b46" font-family="Malgun Gothic, sans-serif" ${extra}>${esc(content)}</text>`;
  const stroke = 'stroke="#536b63" stroke-width="1.5"';
  const round = n => Number(n.toFixed(4));
  function geometry(card, maxUnits = card.units, interactive = false) {
    const d = card.denominator, n = count(card), selected = new Set(card.cells);
    const unit = ['bar', 'line'].includes(card.shape) ? 640 : card.shape === 'grid' ? 252 : 200;
    const gap = card.shape === 'line' ? 0 : 32;
    const width = 48 + unit * maxUnits + gap * (maxUnits - 1);
    const height = card.shape === 'grid' ? 242 : card.shape === 'circle' ? 276 : 174;
    let body = '';
    const piece = (index, label, content) => interactive
      ? `<g class="piece" role="button" tabindex="${index === 0 ? 0 : -1}" data-cell="${index}" aria-label="${esc(label)}" aria-pressed="${card.shape === 'line' ? index === n : selected.has(index)}">${content}</g>`
      : content;
    const fill = i => card.shading && selected.has(i) ? card.color : '#f3f1e9';
    if (card.shape === 'line') {
      const y = 88, end = 24 + unit * card.units;
      body += `<path d="M24 ${y}H${end}" fill="none" ${stroke}/>`;
      if (card.shading && n) body += `<path d="M24 ${y}H${24 + unit * n / d}" fill="none" stroke="${card.color}" stroke-width="8" stroke-linecap="round"/>`;
      for (let i = 0; i <= d * card.units; i++) {
        const x = 24 + unit * i / d, whole = i % d === 0;
        if (card.lines || whole) body += `<path d="M${x} ${y - (whole ? 17 : 9)}v${whole ? 34 : 18}" ${stroke}/>`;
        if (card.labels && whole) body += text(x, 134, i / d, 22);
        body += piece(i, `${i}/${d} 위치 표시`, `<rect class="hit" x="${x - unit / d / 2}" y="50" width="${unit / d}" height="66" fill="transparent"/>`);
      }
      if (card.shading) body += `<circle cx="${24 + unit * n / d}" cy="${y}" r="9" fill="${card.color}" stroke="#fff" stroke-width="3" pointer-events="none"/>`;
    } else {
      for (let u = 0; u < card.units; u++) {
        const x = 24 + u * (unit + gap);
        if (card.labels) body += text(x + unit / 2, 24, '1', 18);
        if (card.shape === 'bar' || card.shape === 'grid') {
          const rows = card.shape === 'bar' ? 1 : card.rows, cols = d / rows, h = card.shape === 'bar' ? 86 : 168, y = 46;
          for (let i = 0; i < d; i++) {
            const index = u * d + i;
            body += piece(index, `전체 ${u + 1}의 ${i + 1}번째 칸 색칠`, `<rect class="hit" x="${x + (i % cols) * unit / cols}" y="${y + Math.floor(i / cols) * h / rows}" width="${unit / cols}" height="${h / rows}" fill="${fill(index)}"/>`);
          }
          if (card.lines) {
            for (let i = 1; i < cols; i++) body += `<path d="M${x + unit * i / cols} ${y}v${h}" ${stroke} pointer-events="none"/>`;
            for (let i = 1; i < rows; i++) body += `<path d="M${x} ${y + h * i / rows}h${unit}" ${stroke} pointer-events="none"/>`;
          }
          body += `<rect x="${x}" y="${y}" width="${unit}" height="${h}" fill="none" ${stroke} pointer-events="none"/>`;
        } else {
          const cx = x + 100, cy = 146, r = 98;
          for (let i = 0; i < d; i++) {
            const start = i * 2 * Math.PI / d - Math.PI / 2, end = (i + 1) * 2 * Math.PI / d - Math.PI / 2;
            const point = a => `${round(cx + r * Math.cos(a))} ${round(cy + r * Math.sin(a))}`;
            const content = d === 1 ? `<circle class="hit" cx="${cx}" cy="${cy}" r="${r}" fill="${fill(u*d+i)}"/>` : `<path class="hit" d="M${cx} ${cy}L${point(start)}A${r} ${r} 0 ${d === 1 ? 1 : 0} 1 ${point(end)}Z" fill="${fill(u*d+i)}"/>`;
            body += piece(u*d+i, `전체 ${u + 1}의 ${i + 1}번째 조각 색칠`, content);
            if (card.lines && d > 1) body += `<path d="M${cx} ${cy}L${point(start)}" ${stroke} pointer-events="none"/>`;
          }
          body += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" ${stroke} pointer-events="none"/>`;
        }
      }
    }
    return { width, height, body };
  }
  function drawing(card, maxUnits, interactive = true) {
    const g = geometry(card, maxUnits, interactive);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g.width} ${g.height}" class="fraction-drawing ${card.shape}" role="group" aria-label="${SHAPES[card.shape]} 색칠 영역">${g.body}</svg>`;
  }
  function exportSVG(cards, transparent = true, maxUnits = Math.max(...cards.map(c => c.units))) {
    const width = 1600, rowHeight = 370, height = 32 + rowHeight * cards.length;
    let content = transparent ? '' : `<rect width="${width}" height="${height}" fill="#ffffff"/>`;
    cards.forEach((card, i) => {
      const y = 24 + i * rowHeight, g = geometry(card, maxUnits);
      if (card.labels) {
        content += text(92, y + 27, count(card), 30) + `<path d="M65 ${y+40}h54" stroke="#354b46" stroke-width="2"/>` + text(92, y+74, card.denominator, 30);
        if (mixed(card)) content += text(190, y+48, `= ${mixed(card)}`, 24);
      }
      content += `<svg x="32" y="${y+85}" width="1536" height="260" viewBox="0 0 ${g.width} ${g.height}">${g.body}</svg>`;
    });
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`;
  }
  return { MAX_DENOMINATOR, MAX_UNITS, MAX_CARDS, SHAPES, COLORS, count, rowsFor, makeCard, setFraction, setDenominator, setUnits, paint, changeShape, mixed, validate, drawing, exportSVG };
});
