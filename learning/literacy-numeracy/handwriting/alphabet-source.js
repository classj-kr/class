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
  // 3차 베지어 곡선 점들. 손으로 쓴 곡선(비스듬히 솟는 아치, 감기는 꼬리)에 쓴다.
  function bez(p0, c1, c2, p3) {
    const len = Math.hypot(c1[0] - p0[0], c1[1] - p0[1]) + Math.hypot(c2[0] - c1[0], c2[1] - c1[1]) + Math.hypot(p3[0] - c2[0], p3[1] - c2[1]),
      n = Math.max(4, Math.ceil(len / STEP));
    return Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n, u = 1 - t;
      return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * c1[k] + 3 * u * t * t * c2[k] + t * t * t * p3[k]);
    });
  }
  // 기둥 옆에서 비스듬히 솟아 오른쪽 어깨를 넘어 바닥줄까지 내려오는 아치(n·h·m).
  const arch = (x0, x1) => {
    const w = x1 - x0;
    return [
      bez([x0, 49], [x0 + w * 0.1, 40.5], [x0 + w * 0.3, X], [x0 + w * 0.54, X]),
      bez([x0 + w * 0.54, X], [x0 + w * 0.84, X], [x1, 40.5], [x1, 46]),
      [x1, B],
    ];
  };
  // a·d·g·q의 둥근 몸통: 기둥 쪽 위에서 시작해 시계 반대 방향으로 돌아 기둥에 닿는다. 위가 살짝 납작한 달걀꼴.
  const bowl = (sx) => [
    bez([sx - 0.5, 41.5], [sx - 3, 38], [sx - 7.5, X], [sx - 13, X]),
    bez([sx - 13, X], [sx - 22, X], [sx - 26.5, 43], [sx - 26.5, 50.5]),
    bez([sx - 26.5, 50.5], [sx - 26.5, 58.5], [sx - 21, B], [sx - 13.5, B]),
    bez([sx - 13.5, B], [sx - 7, B], [sx - 1.5, 59], [sx, 54]),
  ];
  // 기둥 끝이 바닥줄에서 오른쪽으로 살짝 삐친다(a·d·u).
  const tail = (x, top) => [[x, top], [x, 57.5], bez([x, 57.5], [x, 61.5], [x + 1.8, B], [x + 4.5, B])];
  // 아랫줄까지 내려가 왼쪽으로 둥글게 감기는 꼬리(g·j).
  const hook = (x, w) => [[x, 79], bez([x, 79], [x, 86.5], [x - w * 0.35, D], [x - w * 0.6, D]), bez([x - w * 0.6, D], [x - w * 0.85, D], [x - w, 87.5], [x - w * 1.05, 84.5])];

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

    a: [stroke(...bowl(62)), stroke(...tail(62, X))],
    b: [
      stroke([37.5, T], [37.5, B]),
      stroke(
        bez([37.5, 45], [40, 40], [44.5, X], [50.5, X]),
        bez([50.5, X], [58.5, X], [63.5, 43], [63.5, 50.5]),
        bez([63.5, 50.5], [63.5, 58.5], [58.5, B], [50.5, B]),
        bez([50.5, B], [45, B], [40, 61], [37.5, 57]),
      ),
    ],
    c: [
      stroke(
        bez([62, 42], [60, 38.5], [56, X], [51, X]),
        bez([51, X], [43, X], [37.5, 43], [37.5, 50]),
        bez([37.5, 50], [37.5, 57.5], [43, B], [51, B]),
        bez([51, B], [56, B], [60, 60.5], [62, 57.5]),
      ),
    ],
    d: [stroke(...bowl(62)), stroke(...tail(62, T))],
    e: [
      stroke(
        [37.5, 50],
        [63, 50],
        bez([63, 50], [63, 42.5], [58, X], [50.5, X]),
        bez([50.5, X], [42.5, X], [37.5, 43], [37.5, 50]),
        bez([37.5, 50], [37.5, 57.5], [43, B], [51, B]),
        bez([51, B], [56, B], [59.5, 61], [61.5, 58.5]),
      ),
    ],
    f: [stroke(bez([60.5, 15.5], [58.5, 12.5], [56, T], [53, T]), bez([53, T], [49, T], [47, 14.5], [47, 20]), [47, B]), stroke([39.5, X], [57.5, X])],
    g: [stroke(...bowl(62)), stroke([62, X], ...hook(62, 22))],
    h: [stroke([38, T], [38, B]), stroke(...arch(38, 62))],
    i: [stroke([50, X], [50, B]), dot(50, 26)],
    j: [stroke([55, X], ...hook(55, 14)), dot(55, 26)],
    k: [stroke([39, T], [39, B]), stroke([61, X], [39.5, 51], [62, B])],
    l: [stroke([50, T], [50, B])],
    m: [stroke([30.5, X], [30.5, B]), stroke(...arch(30.5, 50)), stroke(...arch(50, 69.5))],
    n: [stroke([38, X], [38, B]), stroke(...arch(38, 62))],
    o: [
      stroke(
        bez([50.5, X], [42.5, X], [37, 43], [37, 50]),
        bez([37, 50], [37, 57.5], [42.5, B], [50.5, B]),
        bez([50.5, B], [58.5, B], [64, 57.5], [64, 50]),
        bez([64, 50], [64, 43], [58.5, X], [50.5, X]),
      ),
    ],
    p: [
      stroke([37.5, X], [37.5, D]),
      stroke(
        bez([37.5, 45], [40, 40], [44.5, X], [50.5, X]),
        bez([50.5, X], [58.5, X], [63.5, 43], [63.5, 50.5]),
        bez([63.5, 50.5], [63.5, 58.5], [58.5, B], [50.5, B]),
        bez([50.5, B], [45, B], [40, 61], [37.5, 57]),
      ),
    ],
    q: [stroke(...bowl(62)), stroke([62, X], [62, D])],
    r: [stroke([42, X], [42, B]), stroke(bez([42, 49.5], [43.5, 41.5], [48.5, X], [54.5, X]), bez([54.5, X], [57.5, X], [60, 38], [61.5, 39.5]))],
    s: [
      stroke(
        bez([60.5, 41.5], [58.5, 38.5], [55, X], [50, X]),
        bez([50, X], [44, X], [39.5, 39.5], [39.5, 43.5]),
        bez([39.5, 43.5], [39.5, 47.5], [44, 48.8], [50, 50]),
        bez([50, 50], [56.5, 51.3], [61.5, 53], [61.5, 57]),
        bez([61.5, 57], [61.5, 61], [56.5, B], [50, B]),
        bez([50, B], [44, B], [40, 61.5], [38.5, 58.5]),
      ),
    ],
    t: [stroke([47, 19], [47, 56.5], bez([47, 56.5], [47, 61], [49.5, B], [53, B]), bez([53, B], [55.5, B], [57.5, 62], [59, 60.5])), stroke([39.5, X], [57.5, X])],
    u: [stroke([38, X], [38, 52], bez([38, 52], [38, 59], [42.5, B], [49, B]), bez([49, B], [56, B], [62, 58.5], [62, 51])), stroke(...tail(62, X))],
    v: [stroke([36.5, X], [50, B], [63.5, X])],
    w: [stroke([30, X], [40, B], [50, X], [60, B], [70, X])],
    x: [stroke([38, X], [62, B]), stroke([62, X], [38, B])],
    y: [stroke([37.5, X], [50.5, 61]), stroke([63.5, X], [49, 81], bez([49, 81], [46.5, 86], [44, D], [40.5, D]), bez([40.5, D], [39, D], [37.5, 88.5], [36.5, 87.5]))],
    z: [stroke([38, X], [62, X], [38, B], [62.5, B])],
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
