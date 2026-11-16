// 알파벳 본보기: 영어 공책 네 줄 칸(100단위)에 바로 그리는 획 중심선.
// 본보기·따라쓰기·획순·채점이 모두 이 중심선을 쓴다. 획은 둥근 펜으로 그대로 그리므로 글꼴 파일이 따로 없다.
// 굵기·둥근 맺음·글자 너비는 DX경필명조의 영문 꼴을 눈으로 참고했고, 윤곽은 옮기지 않았다.
// 획 수와 순서는 초등 영어 손글씨 순서를 따른다(k·K는 세로선 다음 「<」 한 획, R은 몸통에서 그대로 다리로).
(function (root) {
  'use strict';
  // 네 줄: 윗줄(대문자·긴 소문자 끝), 가운뎃줄(소문자 몸통 위), 바닥줄, 아랫줄(g·j·p·q·y 꼬리).
  const T = 11, X = 37, B = 63, D = 89;
  const STEP = 1.6;
  const rad = (d) => (d * Math.PI) / 180;
  // 각도는 화면 기준: 0 = 오른쪽, 90 = 아래, -90 = 위. 끝 각도가 작으면 시계 반대 방향으로 돈다.
  function arc(cx, cy, rx, ry, from, to) {
    const span = Math.abs(rad(to - from)) * Math.max(rx, ry),
      n = Math.max(4, Math.ceil(span / STEP));
    return Array.from({ length: n + 1 }, (_, i) => {
      const a = rad(from + ((to - from) * i) / n);
      return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
    });
  }
  // 꺾은선과 곡선을 한 획으로 잇는다. 숫자 둘은 점, 배열은 곡선 점들.
  function stroke(...parts) {
    const out = [];
    for (const part of parts) {
      const points = typeof part[0] === 'number' ? [part] : part;
      for (const p of points) {
        const last = out[out.length - 1];
        if (last && Math.hypot(last[0] - p[0], last[1] - p[1]) < 0.01) continue;
        if (last) {
          const d = Math.hypot(p[0] - last[0], p[1] - last[1]),
            n = Math.floor(d / STEP);
          for (let i = 1; i < n; i++) out.push([last[0] + ((p[0] - last[0]) * i) / n, last[1] + ((p[1] - last[1]) * i) / n]);
        }
        out.push([p[0], p[1]]);
      }
    }
    return out.map(([x, y]) => [Math.round(x * 100) / 100, Math.round(y * 100) / 100]);
  }
  const dot = (x, y) => stroke([x, y - 1.2], [x, y + 1.2]);

  // 소문자 둥근 몸통: 가운데 높이 50, 반지름 12.5 × 13
  const BY = (X + B) / 2, BR = 12.5, BH = (B - X) / 2;
  const GLYPHS = {
    A: [stroke([50, T], [28, B]), stroke([50, T], [72, B]), stroke([35.5, 46], [64.5, 46])],
    B: [
      stroke([32, T], [32, B]),
      stroke([32, T], [52, T], arc(52, 24, 13, 13, -90, 90), [32, 37], [55, 37], arc(55, 50, 14, 13, -90, 90), [32, B]),
    ],
    C: [stroke(arc(52, 37, 22, 26, -42, -318))],
    D: [stroke([31, T], [31, B]), stroke([31, T], [44, T], arc(44, 37, 26, 26, -90, 90), [31, B])],
    E: [stroke([33, T], [33, B]), stroke([33, T], [67, T]), stroke([33, 37], [63, 37]), stroke([33, B], [68, B])],
    F: [stroke([34, T], [34, B]), stroke([34, T], [67, T]), stroke([34, 37], [62, 37])],
    G: [stroke(arc(52, 37, 22, 26, -42, -360), [57, 37])],
    H: [stroke([30, T], [30, B]), stroke([70, T], [70, B]), stroke([30, 37], [70, 37])],
    I: [stroke([50, T], [50, B]), stroke([40, T], [60, T]), stroke([40, B], [60, B])],
    J: [stroke([61, T], [61, 47], arc(48, 47, 13, 16, 0, 175))],
    K: [stroke([33, T], [33, B]), stroke([67, T], [34, 39], [69, B])],
    L: [stroke([35, T], [35, B], [67, B])],
    M: [stroke([26, T], [26, B]), stroke([26, T], [50, B], [74, T], [74, B])],
    N: [stroke([31, T], [31, B]), stroke([31, T], [69, B], [69, T])],
    O: [stroke(arc(50, 37, 24, 26, -90, -450))],
    P: [stroke([33, T], [33, B]), stroke([33, T], [52, T], arc(52, 25, 15, 14, -90, 90), [33, 39])],
    Q: [stroke(arc(50, 37, 24, 26, -90, -450)), stroke([55, 49], [73, 66])],
    R: [stroke([33, T], [33, B]), stroke([33, T], [52, T], arc(52, 24, 14, 13, -90, 90), [33, 37], [69, B])],
    S: [stroke(arc(50, 24, 18, 13, -25, -270), arc(50, 50, 19, 13, -90, 155))],
    T: [stroke([28, T], [72, T]), stroke([50, T], [50, B])],
    U: [stroke([29, T], [29, 42], arc(50, 42, 21, 21, 180, 0), [71, T])],
    V: [stroke([28, T], [50, B], [72, T])],
    W: [stroke([21, T], [35.5, B], [50, T], [64.5, B], [79, T])],
    X: [stroke([30, T], [70, B]), stroke([70, T], [30, B])],
    Y: [stroke([29, T], [50, 38]), stroke([71, T], [50, 38], [50, B])],
    Z: [stroke([30, T], [70, T], [30, B], [70, B])],

    a: [stroke(arc(48, BY, BR, BH, -25, -385)), stroke([60.5, X], [60.5, B])],
    b: [stroke([38, T], [38, B]), stroke(arc(50.5, BY, BR, BH, -155, 155))],
    c: [stroke(arc(51, BY, BR, BH, -40, -320))],
    d: [stroke(arc(49.5, BY, BR, BH, -25, -385)), stroke([62, T], [62, B])],
    e: [stroke([38.5, BY], [63.5, BY], arc(51, BY, BR, BH, 0, -318))],
    f: [stroke(arc(55, 18, 7, 7, -25, -180), [48, B]), stroke([40, X], [58, X])],
    g: [stroke(arc(48, BY, BR, BH, -25, -385)), stroke([60.5, X], [60.5, 80], arc(48.5, 80, 12, 9, 0, 165))],
    h: [stroke([38, T], [38, B]), stroke([38, 47], arc(50, 47, 12, 10, 180, 360), [62, B])],
    i: [stroke([50, X], [50, B]), dot(50, 26)],
    j: [stroke([55, X], [55, 80], arc(45, 80, 10, 9, 0, 165)), dot(55, 26)],
    k: [stroke([39, T], [39, B]), stroke([61, X], [39.5, 51], [62, B])],
    l: [stroke([50, T], [50, B])],
    m: [
      stroke([32, X], [32, B]),
      stroke([32, 47], arc(41, 47, 9, 10, 180, 360), [50, B]),
      stroke([50, 47], arc(59, 47, 9, 10, 180, 360), [68, B]),
    ],
    n: [stroke([38, X], [38, B]), stroke([38, 47], arc(50, 47, 12, 10, 180, 360), [62, B])],
    o: [stroke(arc(50, BY, 13, BH, -90, -450))],
    p: [stroke([38, X], [38, D]), stroke(arc(50.5, BY, BR, BH, -155, 155))],
    q: [stroke(arc(49.5, BY, BR, BH, -25, -385)), stroke([62, X], [62, D])],
    r: [stroke([43, X], [43, B]), stroke([43, 48], arc(53, 48, 10, 11, 180, 305))],
    s: [stroke(arc(50, 43.5, 10.5, 6.5, -30, -270), arc(50, 56.5, 11, 6.5, -90, 150))],
    t: [stroke([48, 18], [48, 56], arc(55, 56, 7, 7, 180, 45)), stroke([40, X], [58, X])],
    u: [stroke([38, X], [38, 53], arc(50, 53, 12, 10, 180, 0)), stroke([62, X], [62, B])],
    v: [stroke([37, X], [50, B], [63, X])],
    w: [stroke([31, X], [40.5, B], [50, X], [59.5, B], [69, X])],
    x: [stroke([38, X], [62, B]), stroke([62, X], [38, B])],
    y: [stroke([38, X], [50.5, B]), stroke([63, X], [42, D])],
    z: [stroke([38, X], [62, X], [38, B], [62, B])],
  };
  const has = (char) => Object.prototype.hasOwnProperty.call(GLYPHS, char);
  const api = Object.freeze({
    has,
    model: (char) => (has(char) ? GLYPHS[char].map((s) => s.map((p) => [...p])) : null),
    components: () => [],
    outlines: () => [],
    LINES: Object.freeze([T, X, B, D]),
    PEN: 3.4, // 본보기 획 굵기(100단위)
    FAMILY: 'ClassJ Alphabet',
    VERSION: '1.000',
  });
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandwritingAlphabet = api;
})(typeof window === 'object' ? window : globalThis);
