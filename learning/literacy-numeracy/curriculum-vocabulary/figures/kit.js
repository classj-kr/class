// 교과 단어 도식 도구 (사람 없는 수학·과학 도식 전용).
// 단원 파일(figures/<학기>/<과목>-<단원>.js)이 put('5-2/수학/1/이상', svg('isang', body, style)) 처럼 등록한다.
//
// 약속
// - viewBox 0 0 640 360, 바탕은 kit 의 svg() 가 깐다. 칸 글(beats)은 원고 쪽에 있고, 도식은 칸 수에 맞춰 움직인다.
// - 클래스 b1~b5: 그 칸부터 나타남. h2~h5: 그 칸부터 사라짐. 칸이 열리면 무대에 on1~onN 이 붙는다.
// - 움직임은 `.on2 .sc-<id> .무엇 { ... }` 처럼 장면 고유 클래스 아래에 적는다.
//   transform 속성이 있는 <g> 에 CSS transform 을 주면 속성이 지워지므로, 움직일 것은 속성 없는 <g> 로 감싼다.
//   돌리기·뒤집기는 transform-box: fill-box; transform-origin: center 와 함께 쓴다.
// - 글자는 수·기호·짧은 이름표(점 ㄱ, 대칭축 같은 것)만. 문장은 칸 글로.
(function (root) {
  'use strict';
  const C = {
    ink: '#24413c', muted: '#6b7f79', line: '#c4d3cc', paper: '#fbfcf8',
    green: '#22594f', mint: '#d9efe6', orange: '#d9772b', peach: '#fbe3cf', blue: '#3d7fc1', sky: '#dbe9f7',
    yellow: '#f2c94c', red: '#c0392b', purple: '#7d5ba6', lilac: '#ebe2f5'
  };
  const svg = (id, body, style = '') => `<svg viewBox="0 0 640 360" class="sc-${id}" role="img" xmlns="http://www.w3.org/2000/svg"><style>${style}</style><rect width="640" height="360" fill="${C.paper}"/>${body}</svg>`;
  const text = (x, y, label, { size = 20, color = C.ink, weight = 700, anchor = 'middle', cls = '' } = {}) => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${color}">${label}</text>`;
  const arrow = (x1, y1, x2, y2, color = C.muted, cls = '', width = 4) => {
    const a = Math.atan2(y2 - y1, x2 - x1), l = 12;
    const p = (d) => `${(x2 - l * Math.cos(a + d)).toFixed(1)} ${(y2 - l * Math.sin(a + d)).toFixed(1)}`;
    return `<path class="${cls}" d="M${x1} ${y1} L${x2} ${y2} M${p(-0.5)} L${x2} ${y2} L${p(0.5)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  };
  // 수직선: from~to 정수 눈금, x0~x1 화면 폭. 돌려주는 at(n) 으로 수의 화면 x 를 얻는다.
  const numberLine = (from, to, { y = 200, x0 = 60, x1 = 580, every = 1, label = 1 } = {}) => {
    const at = (n) => x0 + (n - from) * (x1 - x0) / (to - from);
    let body = `<path d="M${x0 - 20} ${y} H${x1 + 20}" stroke="${C.ink}" stroke-width="3"/>`;
    for (let n = from; n <= to; n += every) {
      body += `<path d="M${at(n)} ${y - 9} V${y + 9}" stroke="${C.ink}" stroke-width="2"/>`;
      if ((n - from) % label === 0) body += text(at(n), y + 34, n, { size: 17, weight: 600 });
    }
    return { body, at };
  };
  const figures = root.CurriculumFigures = root.CurriculumFigures || {};
  const put = (key, markup) => { figures[key] = markup; };
  root.FigureKit = { C, svg, text, arrow, numberLine, put };
})(typeof window !== 'undefined' ? window : globalThis);
