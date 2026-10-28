(function (root) {
  'use strict';
  // Original pen lettering shared by the font, demonstration and judging.
  // Context cells transform the 100-unit designs without stretching tight ink bounds.
  function stroke(start, ...segments) {
    const out = [start];
    for (const s of segments) {
      const from = out.at(-1);
      if (s.length === 2) out.push(s);
      else
        for (let i = 1; i <= 20; i++) {
          const t = i / 20,
            q = 1 - t;
          out.push([
            q * q * q * from[0] + 3 * q * q * t * s[0] + 3 * q * t * t * s[2] + t * t * t * s[4],
            q * q * q * from[1] + 3 * q * q * t * s[1] + 3 * q * t * t * s[3] + t * t * t * s[5],
          ]);
        }
    }
    return out;
  }
  function oval(cx, cy, rx, ry) {
    return Array.from({ length: 65 }, (_, i) => {
      const a = -Math.PI / 2 - (i * Math.PI) / 32;
      return [cx + rx * Math.cos(a) + 0.65 * Math.sin(2 * a), cy + ry * Math.sin(a)];
    });
  }
  const bases = {
    ㄱ: [stroke([20, 24], [39, 23, 60, 22, 78, 22], [76, 40, 57, 65, 24, 81])],
    ㄴ: [stroke([24, 20], [24, 37, 23, 60, 25, 75], [25, 79, 29, 80, 34, 79], [50, 79, 65, 77, 80, 76])],
    ㄷ: [
      stroke([23, 24], [42, 23, 61, 22, 80, 22]),
      stroke([25, 25], [24, 41, 24, 62, 26, 75], [26, 80, 29, 80, 35, 79], [51, 79, 66, 77, 81, 76]),
    ],
    ㄹ: [
      stroke([22, 23], [40, 22, 60, 21, 78, 21], [78, 29, 77, 40, 76, 49]),
      stroke([23, 51], [41, 50, 60, 49, 76, 49]),
      stroke([24, 51], [23, 60, 24, 69, 25, 77], [25, 80, 29, 81, 34, 80], [50, 80, 66, 78, 81, 77]),
    ],
    ㅁ: [
      stroke([25, 25], [24, 44, 24, 63, 26, 80]),
      stroke([25, 25], [42, 24, 61, 23, 78, 23], [79, 41, 78, 62, 77, 79]),
      stroke([26, 80], [44, 81, 62, 80, 77, 79]),
    ],
    ㅂ: [
      stroke([25, 19], [24, 40, 24, 63, 26, 81]),
      stroke([77, 19], [78, 40, 77, 63, 76, 80]),
      stroke([25, 49], [42, 48, 60, 48, 77, 48]),
      stroke([26, 81], [43, 82, 61, 81, 76, 80]),
    ],
    ㅅ: [stroke([54, 21], [52, 42, 39, 67, 18, 82]), stroke([48, 45], [58, 61, 71, 75, 83, 81])],
    ㅇ: [oval(50, 51, 29, 30)],
    ㅈ: [
      stroke([20, 26], [40, 25, 61, 24, 79, 24], [60, 46, 38, 68, 20, 82]),
      stroke([55, 49], [64, 64, 75, 76, 83, 81]),
    ],
    ㅊ: [
      stroke([42, 13], [49, 13, 55, 14, 61, 15]),
      stroke([20, 35], [40, 34, 60, 33, 79, 33], [62, 54, 39, 75, 20, 85]),
      stroke([57, 57], [65, 69, 76, 80, 83, 85]),
    ],
    ㅋ: [
      stroke([20, 24], [39, 23, 61, 22, 78, 22], [76, 42, 56, 68, 24, 83]),
      stroke([23, 50], [38, 49, 53, 49, 66, 49]),
    ],
    ㅌ: [
      stroke([22, 23], [42, 22, 61, 21, 80, 21]),
      stroke([24, 50], [42, 49, 60, 48, 77, 48]),
      stroke([25, 25], [24, 42, 24, 63, 26, 77], [27, 81, 31, 81, 36, 80], [52, 80, 66, 78, 82, 77]),
    ],
    ㅍ: [
      stroke([17, 25], [39, 24, 63, 23, 84, 23]),
      stroke([34, 26], [34, 44, 35, 63, 36, 82]),
      stroke([68, 25], [70, 43, 69, 64, 67, 81]),
      stroke([17, 82], [40, 82, 63, 81, 85, 80]),
    ],
    ㅎ: [
      stroke([42, 13], [49, 13, 55, 14, 61, 15]),
      stroke([20, 32], [40, 31, 61, 30, 81, 30]),
      oval(50, 63, 25, 21),
    ],
    ㅏ: [stroke([48, 13], [48, 36, 48, 63, 47, 88]), stroke([48, 47], [59, 46, 70, 46, 81, 46])],
    ㅑ: [
      stroke([48, 13], [48, 37, 48, 63, 47, 88]),
      stroke([48, 35], [59, 34, 70, 34, 81, 34]),
      stroke([48, 64], [59, 63, 70, 63, 81, 63]),
    ],
    ㅓ: [stroke([16, 49], [27, 48, 38, 48, 49, 48]), stroke([49, 13], [49, 36, 49, 63, 48, 88])],
    ㅕ: [
      stroke([16, 35], [27, 34, 38, 34, 49, 34]),
      stroke([16, 65], [27, 64, 38, 64, 49, 64]),
      stroke([49, 13], [49, 37, 49, 64, 48, 88]),
    ],
    ㅗ: [stroke([51, 21], [51, 35, 51, 50, 50, 65]), stroke([14, 67], [38, 66, 63, 65, 86, 65])],
    ㅛ: [
      stroke([36, 21], [36, 35, 37, 50, 36, 65]),
      stroke([66, 21], [67, 35, 67, 50, 66, 65]),
      stroke([14, 67], [38, 66, 63, 65, 86, 65]),
    ],
    ㅜ: [stroke([14, 35], [38, 34, 63, 34, 86, 34]), stroke([51, 35], [51, 51, 51, 68, 50, 85])],
    ㅠ: [
      stroke([14, 35], [38, 34, 63, 34, 86, 34]),
      stroke([36, 35], [36, 51, 37, 68, 36, 85]),
      stroke([67, 35], [68, 51, 68, 68, 67, 85]),
    ],
    ㅡ: [stroke([14, 52], [38, 51, 63, 50, 86, 50])],
    ㅣ: [stroke([50, 13], [50, 37, 50, 64, 49, 88])],
  };
  const stem = (x) => stroke([x, 13], [x, 37, x, 64, x - 1, 88]);
  bases.ㅐ = [stem(40), stroke([40, 47], [52, 46, 65, 46, 76, 46]), stem(76)];
  bases.ㅒ = [
    stem(40),
    stroke([40, 35], [52, 34, 65, 34, 76, 34]),
    stroke([40, 64], [52, 63, 65, 63, 76, 63]),
    stem(76),
  ];
  bases.ㅔ = [stroke([16, 49], [25, 48, 34, 48, 43, 48]), stem(43), stem(76)];
  bases.ㅖ = [
    stroke([16, 35], [25, 34, 34, 34, 43, 34]),
    stroke([16, 65], [25, 64, 34, 64, 43, 64]),
    stem(43),
    stem(76),
  ];
  const pairs = {
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
  const compounds = {
    ㅘ: ['ㅗ', 'ㅏ'],
    ㅙ: ['ㅗ', 'ㅐ'],
    ㅚ: ['ㅗ', 'ㅣ'],
    ㅝ: ['ㅜ', 'ㅓ'],
    ㅞ: ['ㅜ', 'ㅔ'],
    ㅟ: ['ㅜ', 'ㅣ'],
    ㅢ: ['ㅡ', 'ㅣ'],
  };
  const CHO = Array.from('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'),
    JUNG = Array.from('ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ'),
    JONG = ['', ...Array.from('ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ')];
  const transform = (paths, [x, y, w, h]) =>
    paths.map((s) => s.map((p) => [x + (p[0] * w) / 100, y + (p[1] * h) / 100]));
  function base(c, context = 'vertical') {
    if (pairs[c])
      return [
        ...transform(base(pairs[c][0], context), [-4, 0, 60, 100]),
        ...transform(base(pairs[c][1], context), [48, 0, 60, 100]),
      ];
    if (context !== 'vertical' && (c === 'ㄱ' || c === 'ㅋ')) {
      const corner = stroke([21, 24], [40, 23, 60, 22, 79, 22], [80, 39, 78, 61, 76, 81]);
      return c === 'ㄱ' ? [corner] : [corner, stroke([23, 51], [41, 50, 59, 49, 78, 49])];
    }
    return bases[c];
  }
  function standalone(c) {
    let p;
    if (compounds[c]) {
      const [h, v] = compounds[c],
        wide = 'ㅐㅔ'.includes(v);
      p = [
        ...transform(base(h), [-8, h === 'ㅗ' ? 49 : 37, 77, h === 'ㅜ' ? 55 : h === 'ㅗ' ? 53 : 68]),
        ...transform(base(v), [wide ? 45 : 51, 0, wide ? 60 : 49, 100]),
      ];
    } else p = base(c);
    if (!p) return null;
    const all = p.flat(),
      l = Math.min(...all.map((p) => p[0])),
      r = Math.max(...all.map((p) => p[0])),
      t = Math.min(...all.map((p) => p[1])),
      b = Math.max(...all.map((p) => p[1]));
    const s = 77 / Math.max(r - l, b - t);
    return p.map((line) => line.map(([x, y]) => [50 + (x - (l + r) / 2) * s, 50 + (y - (t + b) / 2) * s]));
  }
  function components(char) {
    if (bases[char] || pairs[char] || compounds[char])
      return [{ kind: 'jamo', char, paths: standalone(char) }];
    const n = char?.codePointAt(0) - 0xac00;
    if (!Number.isInteger(n) || n < 0 || n >= 11172) return null;
    const a = CHO[Math.floor(n / 588)],
      b = JUNG[Math.floor(n / 28) % 21],
      c = JONG[n % 28],
      final = Boolean(c),
      out = [];
    const add = (kind, letter, box, context = 'vertical') =>
      out.push({ kind, char: letter, paths: transform(base(letter, context), box) });
    if (compounds[b]) {
      const [h, v] = compounds[b],
        wide = 'ㅐㅔ'.includes(v);
      add('initial', a, final ? [-2, 0, 65, 50] : [-2, 2, 65, 62], 'horizontal');
      const box =
        h === 'ㅡ'
          ? [-6, final ? 10 : 33, 73, 90]
          : h === 'ㅜ'
            ? [-6, final ? 31 : 38, 73, final ? 39 : 57]
            : [-6, final ? 41 : 49, 73, final ? 34 : 53];
      add('vowel', h, box);
      add('vowel', v, [wide ? 47 : 52, -1, wide ? 56 : 48, final ? 72 : 104]);
    } else if ('ㅗㅛㅜㅠㅡ'.includes(b)) {
      add(
        'initial',
        a,
        final ? [8, -3, 84, 52] : b === 'ㅡ' ? [9, -3, 82, 80] : [10, -2, 80, 68],
        'horizontal',
      );
      const box =
        b === 'ㅡ'
          ? [0, final ? 9 : 34, 100, 90]
          : 'ㅜㅠ'.includes(b)
            ? [0, final ? 31 : 39, 100, final ? 39 : 59]
            : [0, final ? 41 : 47, 100, final ? 34 : 58];
      add('vowel', b, box);
    } else {
      const wide = 'ㅐㅒㅔㅖ'.includes(b);
      add('initial', a, [0, final ? 2 : 10, wide ? 58 : 66, final ? 63 : 80]);
      add('vowel', b, [wide ? 31 : 39, -1, wide ? 77 : 62, final ? 72 : 104]);
    }
    if (c) {
      // Raised marks in ㅊ/ㅎ need their own headroom below ㅗ/ㅛ/ㅜ/ㅠ.
      const raised = /[ㅊㅎ]/.test(pairs[c] || c);
      add('final', c, raised ? [3, 64, 94, 34] : [3, 59, 94, 40], 'final');
    }
    return out;
  }
  const cache = new Map();
  function model(char) {
    if (!cache.has(char)) {
      const parts = components(char);
      if (!parts) return null;
      if (cache.size >= 256) cache.delete(cache.keys().next().value);
      cache.set(
        char,
        parts.flatMap((p) => p.paths),
      );
    }
    return cache.get(char).map((s) => s.map((p) => [...p]));
  }
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  function sample(p, n) {
    const lengths = [0];
    for (let i = 1; i < p.length; i++) lengths.push(lengths.at(-1) + distance(p[i - 1], p[i]));
    const total = lengths.at(-1);
    if (!total) return Array.from({ length: n }, () => [...p[0]]);
    let j = 1;
    return Array.from({ length: n }, (_, i) => {
      const d = (i / (n - 1)) * total;
      while (j < p.length - 1 && lengths[j] < d) j++;
      const t = (d - lengths[j - 1]) / (lengths[j] - lengths[j - 1] || 1);
      return [p[j - 1][0] + (p[j][0] - p[j - 1][0]) * t, p[j - 1][1] + (p[j][1] - p[j - 1][1]) * t];
    });
  }
  const area = (p) =>
    p.reduce((n, q, i) => {
      const r = p[(i + 1) % p.length];
      return n + q[0] * r[1] - r[0] * q[1];
    }, 0);
  const orient = (p, positive = true) => (area(p) > 0 === positive ? p : [...p].reverse());
  function outlines(points) {
    if (points.length < 2) return [];
    const closed = distance(points[0], points.at(-1)) < 0.01;
    const length = points.slice(1).reduce((n, p, i) => n + distance(points[i], p), 0);
    const dense = sample(points, Math.min(82, Math.max(12, Math.ceil(length / 1.2))));
    const p = closed ? dense.slice(0, -1) : dense,
      left = [],
      right = [],
      halfWidths = [],
      angles = [];
    for (let i = 0; i < p.length; i++) {
      const before = p[i ? i - 1 : closed ? p.length - 1 : 0],
        after = p[i < p.length - 1 ? i + 1 : closed ? 0 : i];
      const dx = after[0] - before[0],
        dy = after[1] - before[1],
        len = Math.hypot(dx, dy) || 1,
        t = i / (p.length - 1);
      const pressure = closed
        ? 1
        : 0.86 + 0.2 * Math.sin(Math.PI * Math.min(1, t * 1.6)) - 0.3 * Math.pow(t, 8);
      const half = (1.25 + (0.75 * Math.abs(dy)) / len) * pressure,
        nx = -dy / len,
        ny = dx / len;
      left.push([p[i][0] + nx * half, p[i][1] + ny * half]);
      right.push([p[i][0] - nx * half, p[i][1] - ny * half]);
      halfWidths.push(half);
      angles.push(Math.atan2(dy, dx));
    }
    if (closed) {
      const outer = Math.abs(area(left)) > Math.abs(area(right)) ? left : right,
        inner = outer === left ? right : left;
      return [orient(outer), orient(inner, false)];
    }
    const end = p.at(-1),
      start = p[0],
      cap = (at, r, a) =>
        Array.from({ length: 7 }, (_, i) => {
          const theta = a + Math.PI / 2 - ((i + 1) * Math.PI) / 8;
          return [at[0] + Math.cos(theta) * r, at[1] + Math.sin(theta) * r];
        });
    const body = orient([
        ...left,
        ...cap(end, halfWidths.at(-1), angles.at(-1)),
        ...right.reverse(),
        ...cap(start, halfWidths[0], angles[0] + Math.PI),
      ]),
      out = [body];
    const dx = p[1][0] - start[0],
      dy = p[1][1] - start[1];
    if (dy > Math.abs(dx) * 2 && length > 16)
      out.push(
        orient([
          [start[0] - 2.8, start[1] - 3.1],
          [start[0] - 1.3, start[1] - 2.8],
          [start[0] + 1.7, start[1] - 0.2],
          [start[0] + 1.8, start[1] + 3.3],
          [start[0] - 0.3, start[1] + 2],
        ]),
      );
    else if (dx > Math.abs(dy) * 2 && length > 12)
      out.push(
        orient([
          [start[0] - 1.7, start[1] - 0.8],
          [start[0] - 0.5, start[1] - 1.5],
          [start[0] + 2.8, start[1] - 0.5],
          [start[0] + 0.7, start[1] + 1.1],
        ]),
      );
    return out;
  }
  const api = {
    model,
    components,
    outlines,
    sample,
    CHO,
    JUNG,
    JONG,
    VERSION: 4,
    FAMILY: 'ClassJ Gyeongpil Myeongjo',
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandwritingFont = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
