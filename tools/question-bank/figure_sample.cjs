// figure_preview.cjs에 넘기는 본보기: 각도 단원의 그림 도구들.  node tools/question-bank/figure_preview.cjs tools/question-bank/figure_sample.cjs out.png
module.exports = (B) => {
  const G = B.kit.geo;
  const tri = G.triangle(50, 70, 6, [1, 5.6]);
  const quad = [[1, 5], [6.5, 5], [5.6, 1.4], [2, 2.2]];
  return [
    ['각 70° (이름)', G.board(6, 4, [G.angle([1, 3.4], 0, 70, { label: '70°', names: ['ㄷ', 'ㄴ', 'ㄱ'] })], { grid: false, scale: 1.2, label: '각 ㄱㄴㄷ' })],
    ['둔각 130° ㉠', G.board(7, 4, [G.angle([3.4, 3.4], 0, 130, { label: '㉠' })], { grid: false, scale: 1.2, label: '각' })],
    ['직각', G.board(5, 4, [G.angle([1, 3.4], 0, 90, {})], { grid: false, scale: 1.2, label: '직각' })],
    ['좁은 각 20°', G.board(6, 3, [G.angle([1, 2.4], 0, 20, { label: '20°' })], { grid: false, scale: 1.2, label: '각' })],
    ['각도기 (0, 110)', G.board(12, 7, [G.protractor([6, 6.2], 5.4, { rays: [0, 110] })], { grid: false, scale: 1.02, label: '각도기' })],
    ['각도기 (180, 40) 바깥 눈금', G.board(12, 7, [G.protractor([6, 6.2], 5.4, { rays: [180, 40] })], { grid: false, scale: 1.02, label: '각도기' })],
    ['삼각형 50° 70° ㉠', G.board(8, 6.4, [G.polygon(tri), G.cornerArc(tri, 0, '50°'), G.cornerArc(tri, 1, '70°'), G.cornerArc(tri, 2, '㉠')], { grid: false, scale: 1.15, label: '삼각형' })],
    ['사각형 네 각', G.board(8, 6, [G.polygon(quad), G.cornerArc(quad, 0, Math.round(G.angleOf(quad, 0)) + '°'), G.cornerArc(quad, 1, Math.round(G.angleOf(quad, 1)) + '°'), G.cornerArc(quad, 2, Math.round(G.angleOf(quad, 2)) + '°'), G.cornerArc(quad, 3, '㉠')], { grid: false, scale: 1.15, label: '사각형' })],
    ['직각삼각형', (() => { const t = G.triangle(90, 35, 5, [1.5, 5]); return G.board(8, 6, [G.polygon(t), G.cornerArc(t, 0), G.cornerArc(t, 1, '35°'), G.cornerArc(t, 2, '㉠')], { grid: false, scale: 1.15, label: '직각삼각형' }); })()],
    ['시계 4시', G.clock(4, 0)]
  ];
};
