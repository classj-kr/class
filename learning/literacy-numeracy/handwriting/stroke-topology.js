(function (root) {
  'use strict';
  // Approximate pen-down topology only. Displayed shapes come from the licensed educational font.
  function stroke(start, ...segments) {
    const points = [start];
    let from = start;
    for (const segment of segments) {
      if (segment.length === 2) points.push(segment);
      else {
        const [x1, y1, x2, y2, x, y] = segment;
        for (let k = 1; k <= 12; k++) {
          const t = k / 12,
            q = 1 - t;
          points.push([
            q * q * q * from[0] + 3 * q * q * t * x1 + 3 * q * t * t * x2 + t * t * t * x,
            q * q * q * from[1] + 3 * q * q * t * y1 + 3 * q * t * t * y2 + t * t * t * y,
          ]);
        }
      }
      from = points[points.length - 1];
    }
    return points;
  }
  function oval(cx, cy, rx, ry) {
    return Array.from({ length: 65 }, (_, i) => {
      const a = -Math.PI / 2 - (i * Math.PI) / 32;
      return [cx + rx * Math.cos(a) + 0.9 * Math.sin(a) * Math.cos(a), cy + ry * Math.sin(a)];
    });
  }
  const bases = {
    ㄱ: [stroke([20, 23], [38, 21, 60, 21, 77, 21], [78, 21, 78, 22, 78, 25], [78, 44, 76, 63, 74, 81])],
    ㄴ: [stroke([24, 19], [23, 37, 23, 57, 23, 76], [23, 79, 25, 80, 29, 80], [45, 80, 62, 79, 79, 78])],
    ㄷ: [
      stroke([23, 23], [42, 21, 61, 21, 78, 21]),
      stroke([23, 23], [22, 41, 22, 59, 23, 77], [23, 80, 26, 81, 30, 80], [46, 80, 62, 79, 79, 78]),
    ],
    ㄹ: [
      stroke([22, 21], [42, 20, 60, 20, 77, 20], [78, 27, 77, 40, 76, 49]),
      stroke([23, 50], [40, 49, 60, 49, 76, 49]),
      stroke([23, 50], [22, 58, 22, 68, 23, 78], [38, 80, 59, 79, 79, 78]),
    ],
    ㅁ: [
      stroke([23, 24], [23, 42, 23, 62, 24, 80]),
      stroke([23, 24], [42, 22, 61, 22, 77, 22], [78, 22, 78, 24, 78, 27], [78, 43, 77, 62, 76, 80]),
      stroke([24, 80], [41, 80, 60, 80, 76, 80]),
    ],
    ㅂ: [
      stroke([25, 18], [24, 39, 24, 60, 25, 81]),
      stroke([77, 18], [78, 38, 77, 60, 76, 80]),
      stroke([25, 48], [42, 47, 60, 47, 77, 47]),
      stroke([25, 81], [43, 81, 60, 80, 76, 80]),
    ],
    ㅅ: [stroke([52, 20], [50, 45, 40, 65, 20, 82]), stroke([48, 42], [57, 60, 68, 73, 81, 81])],
    ㅇ: [oval(50, 51, 28.5, 32)],
    ㅈ: [
      stroke([20, 25], [39, 23, 60, 23, 78, 23], [72, 45, 50, 67, 21, 82]),
      stroke([53, 49], [61, 62, 71, 74, 81, 81]),
    ],
    ㅊ: [
      stroke([42, 12], [48, 12, 54, 13, 60, 14]),
      stroke([20, 33], [39, 31, 60, 31, 78, 31], [71, 52, 49, 71, 21, 85]),
      stroke([53, 55], [61, 67, 72, 78, 81, 85]),
    ],
    ㅋ: [
      stroke([21, 23], [40, 21, 60, 21, 78, 21], [79, 41, 77, 63, 75, 82]),
      stroke([22, 50], [41, 49, 60, 49, 77, 49]),
    ],
    ㅌ: [
      stroke([22, 22], [42, 20, 62, 20, 79, 20]),
      stroke([23, 49], [41, 48, 61, 48, 77, 47]),
      stroke([23, 22], [22, 40, 22, 60, 23, 78], [42, 80, 62, 79, 80, 78]),
    ],
    ㅍ: [
      stroke([16, 24], [39, 22, 63, 22, 84, 22]),
      stroke([33, 23], [33, 42, 33, 61, 34, 79]),
      stroke([68, 23], [69, 42, 68, 60, 67, 79]),
      stroke([16, 81], [39, 80, 64, 80, 85, 79]),
    ],
    ㅎ: [
      stroke([42, 12], [49, 12, 55, 13, 61, 14]),
      stroke([19, 31], [40, 29, 62, 29, 82, 29]),
      oval(50, 61, 25, 22),
    ],
    ㅏ: [stroke([47, 13], [46, 37, 47, 63, 45, 87]), stroke([46, 48], [57, 47, 68, 47, 79, 47])],
    ㅑ: [
      stroke([47, 13], [46, 37, 47, 63, 45, 87]),
      stroke([46, 35], [57, 34, 68, 34, 79, 34]),
      stroke([46, 64], [57, 63, 68, 63, 79, 63]),
    ],
    ㅓ: [stroke([20, 49], [32, 48, 44, 48, 56, 48]), stroke([56, 13], [55, 37, 56, 63, 54, 87])],
    ㅕ: [
      stroke([20, 35], [32, 34, 44, 34, 56, 34]),
      stroke([20, 65], [32, 64, 44, 64, 55, 64]),
      stroke([56, 13], [55, 37, 56, 63, 54, 87]),
    ],
    ㅗ: [stroke([51, 20], [50, 34, 50, 48, 49, 64]), stroke([14, 66], [38, 64, 63, 64, 86, 64])],
    ㅛ: [
      stroke([36, 20], [35, 34, 35, 48, 34, 65]),
      stroke([66, 20], [65, 34, 65, 48, 64, 64]),
      stroke([14, 67], [38, 65, 63, 65, 86, 65]),
    ],
    ㅜ: [stroke([14, 35], [38, 33, 63, 33, 86, 33]), stroke([51, 34], [50, 50, 51, 68, 49, 84])],
    ㅠ: [
      stroke([14, 35], [38, 33, 63, 33, 86, 33]),
      stroke([36, 34], [35, 50, 36, 68, 34, 84]),
      stroke([67, 34], [66, 50, 67, 68, 65, 84]),
    ],
    ㅡ: [stroke([14, 52], [38, 50, 63, 50, 86, 50])],
    ㅣ: [stroke([51, 13], [50, 37, 51, 63, 49, 87])],
  };
  function bounds(paths) {
    const p = paths.flat();
    return [
      Math.min(...p.map((v) => v[0])),
      Math.min(...p.map((v) => v[1])),
      Math.max(...p.map((v) => v[0])),
      Math.max(...p.map((v) => v[1])),
    ];
  }
  function fit(paths, [x, y, w, h]) {
    const [l, t, r, b] = bounds(paths),
      dx = r - l,
      dy = b - t;
    const sx = dx < 6 ? h / Math.max(1, dy) : w / dx,
      sy = dy < 6 ? w / Math.max(1, dx) : h / dy;
    return paths.map((p) =>
      p.map((v) => [x + w / 2 + (v[0] - (l + r) / 2) * sx, y + h / 2 + (v[1] - (t + b) / 2) * sy]),
    );
  }
  const combined = {
    ㄲ: 'ㄱㄱ',
    ㄸ: 'ㄷㄷ',
    ㅃ: 'ㅂㅂ',
    ㅆ: 'ㅅㅅ',
    ㅉ: 'ㅈㅈ',
    ㄳ: 'ㄱㅅ',
    ㄵ: 'ㄴㅈ',
    ㄶ: 'ㄴㅎ',
    ㄺ: 'ㄹㄱ',
    ㄻ: 'ㄹㅁ',
    ㄼ: 'ㄹㅂ',
    ㄽ: 'ㄹㅅ',
    ㄾ: 'ㄹㅌ',
    ㄿ: 'ㄹㅍ',
    ㅀ: 'ㄹㅎ',
    ㅄ: 'ㅂㅅ',
  };
  for (const [c, p] of Object.entries(combined))
    bases[c] = [...fit(bases[p[0]], [15, 20, 31, 62]), ...fit(bases[p[1]], [54, 20, 31, 62])];
  for (const [c, p] of Object.entries({ ㅐ: 'ㅏ', ㅒ: 'ㅑ', ㅔ: 'ㅓ', ㅖ: 'ㅕ' }))
    bases[c] = [...fit(bases[p], [27, 13, 29, 74]), stroke([76, 13], [75, 37, 76, 63, 74, 87])];
  const compound = {
    ㅘ: ['ㅗ', 'ㅏ'],
    ㅙ: ['ㅗ', 'ㅐ'],
    ㅚ: ['ㅗ', 'ㅣ'],
    ㅝ: ['ㅜ', 'ㅓ'],
    ㅞ: ['ㅜ', 'ㅔ'],
    ㅟ: ['ㅜ', 'ㅣ'],
    ㅢ: ['ㅡ', 'ㅣ'],
  };
  for (const [c, [a, b]] of Object.entries(compound))
    bases[c] = [...fit(bases[a], [15, 55, 47, 26]), ...fit(bases[b], [69, 13, 18, 74])];
  const CHO = Array.from('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'),
    JUNG = Array.from('ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'),
    JONG = ['', ...Array.from('ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ')];
  const cache = new Map();
  function model(char) {
    if (cache.has(char)) return cache.get(char).map((p) => p.map((v) => [...v]));
    let paths;
    if (bases[char]) paths = bases[char];
    else {
      const n = char?.codePointAt(0) - 0xac00;
      if (!Number.isInteger(n) || n < 0 || n >= 11172) return null;
      const a = CHO[Math.floor(n / 588)],
        b = JUNG[Math.floor(n / 28) % 21],
        c = JONG[n % 28],
        final = Boolean(c);
      if (compound[b]) {
        const [h, v] = compound[b];
        const lower =
          h === 'ㅡ'
            ? final
              ? [13, 59, 50, 10]
              : [13, 77, 50, 10]
            : final
              ? [13, 51, 50, 14]
              : [13, 66, 50, 18];
        paths = [
          ...fit(bases[a], final ? [14, 13, 36, 30] : [14, 19, 36, 37]),
          ...fit(bases[h], lower),
          ...fit(bases[v], final ? [72, 9, 16, 56] : [72, 12, 16, 74]),
        ];
      } else if ('ㅗㅛㅜㅠㅡ'.includes(b)) {
        const lower =
          b === 'ㅡ'
            ? final
              ? [15, 61, 70, 8]
              : [15, 80, 70, 8]
            : final
              ? [15, 51, 70, 15]
              : [15, 65, 70, 20];
        paths = [...fit(bases[a], final ? [24, 11, 52, 31] : [23, 14, 54, 42]), ...fit(bases[b], lower)];
      } else {
        const wide = 'ㅐㅒㅔㅖ'.includes(b);
        paths = [
          ...fit(bases[a], final ? [14, 17, wide ? 35 : 39, 41] : [14, 25, wide ? 35 : 39, 51]),
          ...fit(
            bases[b],
            final ? [wide ? 60 : 65, 10, wide ? 28 : 22, 55] : [wide ? 60 : 65, 13, wide ? 28 : 22, 74],
          ),
        ];
      }
      if (c) paths.push(...fit(bases[c], [20, 72, 61, 18]));
    }
    if (cache.size < 256) cache.set(char, paths);
    return paths.map((p) => p.map((v) => [...v]));
  }
  const api = { model, CHO, JUNG, JONG };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandwritingStrokeTopology = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
