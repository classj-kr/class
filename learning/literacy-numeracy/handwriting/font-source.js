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
      return [
        cx + rx * (1 + 0.018 * Math.sin(a)) * Math.cos(a) + 0.85 * Math.sin(2 * a),
        cy + ry * Math.sin(a) - 0.55 * Math.cos(a),
      ];
    });
  }
  const bases = {
    ㄱ: [stroke([20, 24], [39, 23, 60, 22, 78, 22], [76, 40, 57, 65, 24, 81])],
    ㄴ: [stroke([24, 20], [24, 37, 23, 60, 25, 75], [25, 79, 29, 80, 34, 79], [50, 79, 65, 77, 80, 76])],
    ㄷ: [
      stroke([15, 24], [38, 23, 61, 22, 80, 22]),
      stroke([25, 25], [24, 41, 24, 61, 26, 72], [26, 80, 30, 82, 38, 81], [54, 80, 68, 77, 81, 75]),
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
      stroke([12, 23], [36, 22, 62, 21, 82, 21], [65, 43, 37, 68, 12, 84]),
      stroke([55, 49], [64, 64, 76, 77, 85, 82]),
    ],
    ㅊ: [
      stroke([40, 11], [46, 15, 56, 18, 64, 16]),
      stroke([16, 35], [39, 34, 61, 33, 82, 33], [62, 54, 36, 75, 14, 85]),
      stroke([57, 57], [65, 69, 77, 80, 86, 85]),
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
      stroke([11, 25], [35, 24, 67, 23, 91, 23]),
      stroke([32, 37], [36, 48, 36, 65, 36, 82]),
      stroke([69, 36], [72, 48, 69, 65, 66, 81]),
      stroke([11, 82], [37, 82, 67, 81, 92, 80]),
    ],
    ㅎ: [
      stroke([40, 11], [46, 15, 56, 18, 64, 16]),
      stroke([20, 32], [40, 31, 61, 30, 81, 30]),
      oval(50, 63, 25, 21),
    ],
    ㅏ: [stroke([48, 13], [48, 36, 48, 63, 47, 88]), stroke([48, 47], [59, 46, 70, 46, 81, 46])],
    ㅑ: [
      stroke([48, 13], [48, 37, 48, 63, 47, 88]),
      stroke([48, 35], [59, 34, 70, 34, 81, 34]),
      stroke([48, 64], [59, 63, 70, 63, 81, 63]),
    ],
    ㅓ: [stroke([24, 49], [32, 48, 41, 48, 49, 48]), stroke([49, 13], [49, 36, 49, 63, 48, 88])],
    ㅕ: [
      stroke([24, 35], [32, 34, 41, 34, 49, 34]),
      stroke([24, 65], [32, 64, 41, 64, 49, 64]),
      stroke([49, 13], [49, 37, 49, 64, 48, 88]),
    ],
    ㅗ: [stroke([51, 21], [51, 35, 51, 50, 50, 65]), stroke([6, 67], [35, 66, 65, 65, 94, 65])],
    ㅛ: [
      stroke([36, 21], [36, 35, 37, 50, 36, 65]),
      stroke([66, 21], [67, 35, 67, 50, 66, 65]),
      stroke([6, 67], [35, 66, 65, 65, 94, 65]),
    ],
    ㅜ: [stroke([6, 35], [35, 34, 65, 34, 94, 34]), stroke([51, 35], [51, 51, 51, 68, 50, 85])],
    ㅠ: [
      stroke([6, 35], [35, 34, 65, 34, 94, 34]),
      stroke([36, 35], [36, 51, 37, 68, 36, 85]),
      stroke([67, 35], [68, 51, 68, 68, 67, 85]),
    ],
    ㅡ: [stroke([6, 52], [35, 51, 65, 50, 94, 50])],
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
  bases.ㅔ = [stroke([22, 49], [29, 48, 36, 48, 43, 48]), stem(43), stem(76)];
  bases.ㅖ = [
    stroke([22, 35], [29, 34, 36, 34, 43, 34]),
    stroke([22, 65], [29, 64, 36, 64, 43, 64]),
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
        ...transform(base(pairs[c][0], context), [0, 0, 57, 100]),
        ...transform(base(pairs[c][1], context), [44, 0, 57, 100]),
      ];
    if (context !== 'vertical' && (c === 'ㄱ' || c === 'ㅋ')) {
      const corner = context === 'final'
        ? stroke([21, 24], [40, 23, 60, 22, 79, 22], [80, 41, 79, 64, 78, 81])
        : stroke([21, 24], [40, 23, 60, 22, 79, 22], [78, 39, 73, 62, 68, 81]);
      return c === 'ㄱ' ? [corner] : [corner, stroke([23, 51], [41, 50, 59, 49, 78, 49])];
    }
    if (context === 'final' && c === 'ㄴ')
      return [stroke([24, 20], [25, 36, 24, 59, 28, 74], [29, 79, 34, 80, 40, 79], [54, 79, 68, 79, 80, 78])];
    if (context === 'final' && c === 'ㄹ')
      return [
        stroke([16, 23], [37, 22, 60, 21, 78, 21], [78, 29, 77, 40, 76, 49]),
        stroke([17, 51], [38, 50, 60, 49, 76, 49]),
        stroke([24, 51], [23, 60, 24, 69, 25, 77], [25, 80, 29, 81, 34, 80], [50, 80, 66, 78, 81, 77]),
      ];
    if (context === 'final' && c === 'ㅁ')
      return [
        stroke([25, 25], [24, 44, 24, 63, 26, 80]),
        stroke([34, 25], [49, 24, 64, 23, 78, 23], [79, 41, 78, 62, 77, 79]),
        stroke([26, 80], [44, 81, 62, 80, 77, 79]),
      ];
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
  function uprightBottom(c) {
    if (!c) return 94.5;
    if (c === 'ㄴ') return 71.5;
    if (c === 'ㅇ') return 59.5;
    if ('ㅊㅎ'.includes(c)) return 50.5;
    if (pairs[c] || 'ㄹㅂㅍ'.includes(c)) return 53.5;
    return c === 'ㄱ' ? 57.5 : 56.5;
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
    const finalLetters = pairs[c] || c;
    const raisedFinal = /[ㅊㅎ]/.test(finalLetters);
    const tieredFinal = /[ㄹㅂㅍㅊㅎ]/.test(finalLetters);
    // All upright vowels enter at the same height. Their lower end changes
    // with the final consonant; scaling the entire cell also moved the head.
    const vowelBottom = uprightBottom(c);
    const vowelHeight = (vowelBottom - 8) / 0.75;
    const vowelTop = 8 - 0.13 * vowelHeight;
    const add = (kind, letter, box, context = 'vertical') =>
      out.push({ kind, char: letter, paths: transform(base(letter, context), box) });
    if (compounds[b]) {
      const [h, v] = compounds[b],
        wide = 'ㅐㅔ'.includes(v);
      add('initial', a, final ? [0, 0, 61, raisedFinal ? 44 : 50] : [0, 6, 61, 56], 'horizontal');
      const box =
        h === 'ㅡ'
          ? [0, final ? 10 : 33, 73, 90]
          : h === 'ㅜ'
            ? [0, final ? 31 : 38, 73, final ? 39 : 57]
            : [0, final ? (raisedFinal ? 31 : tieredFinal ? 36 : 41) : 49, 73, final ? 31 : 53];
      add('vowel', h, box);
      add('vowel', v, [wide ? 47 : 52, vowelTop, wide ? 56 : 48, vowelHeight]);
    } else if ('ㅗㅛㅜㅠㅡ'.includes(b)) {
      add(
        'initial',
        a,
        final
          ? pairs[a]
            ? [12, raisedFinal ? 0 : -1, 76, 'ㅜㅠ'.includes(b) ? 44 : raisedFinal ? 42 : 52]
            : a === 'ㅇ'
              ? [18, 0, 64, 50]
              : [15, -1, 70, 'ㅜㅠ'.includes(b) ? 44 : raisedFinal ? 46 : 52]
          : b === 'ㅡ'
            ? [14, 0, 72, 73]
            : [14, 1, 72, 62],
        'horizontal',
      );
      const box =
        b === 'ㅡ'
          ? [0, final ? (tieredFinal ? 1.5 : 9) : 34, 100, 90]
          : 'ㅜㅠ'.includes(b)
            ? [0, final ? 31 : 39, 100, final ? 39 : 59]
            : [0, final ? (raisedFinal ? 24.5 : tieredFinal ? 36 : 41) : 47, 100, final ? 31 : 58];
      add('vowel', b, box);
    } else {
      const wide = 'ㅐㅒㅔㅖ'.includes(b);
      const roundInitial = final && a === 'ㅇ';
      const leftVowel = 'ㅓㅕㅔㅖ'.includes(b);
      const opticalLeft = roundInitial ? -1 : 'ㅇㅎ'.includes(a) && 'ㅓㅕㅔㅖ'.includes(b) ? -6 : 0;
      const initialY = roundInitial ? (leftVowel ? 1 : 3.5) : final ? 7 : 14,
        initialWidth = wide ? 58 : roundInitial ? 63 : 66,
        initialHeight = roundInitial && leftVowel ? 54 : final ? 57 : 62;
      add('initial', a, [opticalLeft, initialY, initialWidth, initialHeight]);
      add('vowel', b, [wide ? 31 : 39, vowelTop, wide ? 77 : 62, vowelHeight]);
      if (!final && 'ㄴㄷㄹㅌ'.includes(a)) {
        const foot = out[0].paths.at(-1),
          end = foot.at(-1);
        const stem = out[1].paths.find((p) => Math.abs(p.at(-1)[1] - p[0][1]) > 40);
        const target = stem[0][0] - 1;
        foot.push([end[0] + (target - end[0]) / 2, end[1] - 0.55], [target, end[1] - 1.1]);
      }
    }
    if (c) {
      // Optical width and height depend on the final's construction, not one flat box.
      const box =
        c === 'ㅇ'
          ? [24.5, 50.5, 63, 51]
          : c === 'ㄴ'
            ? compounds[b] || 'ㅗㅛㅜㅠㅡ'.includes(b)
              ? [-2, 63.5, 94, 34]
              : [10, 59, 88, 39]
            : raisedFinal
              ? [pairs[c] ? 5 : c === 'ㅊ' ? 0 : 8, 50.5, pairs[c] ? 90 : c === 'ㅊ' ? 92 : 84, 50]
              : tieredFinal
                ? [pairs[c] ? 5 : 10, pairs[c] ? 53 : 46, pairs[c] ? 90 : 88, pairs[c] ? 48 : 54]
                : [pairs[c] ? 5 : 8, 59, pairs[c] ? 90 : 84, 40];
      add('final', c, box, 'final');
    }
    return opticalLayout(out, a, b, c);
  }
  // Optical cells for original jamo paths. Keys describe vowel layout and final
  // construction, so a correction applies to every syllable with that structure.
  const layoutOptics = {
    initial: {
      "right:open:ㄱ": [-5.111, 0.295, 1.0, 1.241],
      "right:low:ㄱ": [-6.3, -0.334, 1.019, 1.09],
      "right:n:ㄱ": [-6.371, 1.44, 1.02, 1.148],
      "right:tier:ㄱ": [-6.299, -0.334, 1.019, 1.09],
      "right:round:ㄱ": [-6.297, -0.334, 1.019, 1.09],
      "left:low:ㄱ": [-2.193, -0.368, 1.019, 1.088],
      "left:n:ㄱ": [-2.162, 1.297, 1.012, 1.14],
      "left:tier:ㄱ": [-2.193, -0.368, 1.019, 1.088],
      "left:round:ㄱ": [-2.146, -0.537, 1.018, 1.076],
      "up:open:ㄱ": [-2.463, 7.197, 1.275, 1.14],
      "up:low:ㄱ": [-3.0, 1.922, 1.235, 0.999],
      "up:n:ㄱ": [-2.832, 3.614, 1.233, 1.041],
      "up:tier:ㄱ": [-3.424, 3.465, 1.228, 1.099],
      "up:round:ㄱ": [-3.782, 4.486, 1.249, 1.171],
      "down:open:ㄱ": [-3.642, 0.396, 1.182, 1.152],
      "down:low:ㄱ": [-3.101, 6.684, 1.207, 1.23],
      "down:n:ㄱ": [-3.311, 10.056, 1.207, 1.413],
      "down:tier:ㄱ": [-3.028, 6.299, 1.207, 1.204],
      "down:round:ㄱ": [-2.998, 6.101, 1.207, 1.187],
      "right:open:ㄲ": [-1.959, -3.003, 0.878, 1.126],
      "up:raised:ㄲ": [-8.019, 1.863, 1.071, 0.886],
      "stem:open:ㄲ": [0.066, -3.026, 0.879, 1.125],
      "right:open:ㄴ": [-0.084, -1.582, 0.988, 1.034],
      "left:low:ㄴ": [3.165, -2.974, 1.097, 0.853],
      "up:open:ㄴ": [-3.262, 1.608, 1.268, 0.864],
      "down:open:ㄴ": [-1.921, -5.916, 1.274, 0.722],
      "right:open:ㄷ": [-0.96, -2.534, 0.99, 1.089],
      "right:low:ㄷ": [1.451, -4.22, 1.177, 0.793],
      "up:open:ㄷ": [-4.298, 1.535, 1.284, 0.907],
      "down:open:ㄷ": [-3.405, -5.946, 1.27, 0.764],
      "right:open:ㄸ": [-0.607, -1.82, 0.85, 1.134],
      "stem:open:ㄸ": [3.404, -1.784, 0.849, 1.134],
      "right:open:ㄹ": [-4.148, -1.171, 0.878, 1.322],
      "up:open:ㄹ": [-4.844, 3.677, 1.185, 1.088],
      "down:open:ㄹ": [-4.313, -5.333, 1.156, 0.919],
      "right:open:ㅁ": [-5.327, -3.912, 0.924, 1.008],
      "up:open:ㅁ": [-5.167, 1.04, 1.155, 0.882],
      "right:open:ㅂ": [-5.254, -5.776, 0.937, 1.12],
      "right:low:ㅂ": [-4.236, -6.503, 0.941, 0.995],
      "up:open:ㅂ": [-4.502, 0.8, 1.168, 1.031],
      "down:open:ㅂ": [-4.848, -7.224, 1.125, 0.873],
      "right:open:ㅃ": [0.698, -4.731, 0.917, 1.083],
      "stem:open:ㅃ": [3.667, -4.643, 0.916, 1.081],
      "right:open:ㅅ": [-2.435, -3.309, 1.231, 1.167],
      "right:low:ㅅ": [-2.711, -3.682, 1.207, 0.964],
      "up:open:ㅅ": [-3.446, -2.131, 1.342, 0.962],
      "down:open:ㅅ": [-2.935, -8.659, 1.434, 0.841],
      "right:open:ㅆ": [-0.632, -5.648, 0.881, 0.998],
      "compound:open:ㅆ": [-0.156, -2.786, 0.778, 0.795],
      "stem:open:ㅆ": [3.327, -6.003, 0.881, 1.014],
      "right:open:ㅇ": [-5.669, -3.857, 1.029, 0.999],
      "right:low:ㅇ": [-3.46, -1.368, 0.992, 0.952],
      "left:open:ㅇ": [2.29, -3.843, 1.03, 0.998],
      "left:n:ㅇ": [-0.452, 5.767, 0.994, 1.043],
      "left:tier:ㅇ": [-0.44, 2.083, 0.993, 0.992],
      "left:low:ㅇ": [-0.437, 2.653, 0.994, 1.004],
      "left:round:ㅇ": [-0.437, 2.653, 0.994, 1.005],
      "up:open:ㅇ": [-4.437, 0.865, 1.045, 1.0],
      "down:open:ㅇ": [-4.236, -6.613, 0.952, 0.887],
      "flat:open:ㅇ": [-4.624, -3.767, 1.046, 0.849],
      "flat:n:ㅇ": [-4.215, -0.309, 1.034, 1.072],
      "flat:tier:ㅇ": [-4.242, -2.84, 0.981, 0.988],
      "flat:low:ㅇ": [-4.249, -2.316, 0.996, 1.008],
      "flat:round:ㅇ": [-4.256, -1.79, 1.009, 1.027],
      "stem:open:ㅇ": [-2.685, -3.849, 1.03, 0.997],
      "stem:n:ㅇ": [-0.45, 1.725, 0.995, 0.987],
      "stem:tier:ㅇ": [-0.463, -2.391, 0.991, 0.941],
      "stem:low:ㅇ": [-0.452, -1.886, 0.991, 0.948],
      "stem:round:ㅇ": [-0.442, -0.549, 0.991, 0.954],
      "right:open:ㅈ": [-3.295, -3.588, 1.06, 1.148],
      "left:round:ㅈ": [-0.946, -1.914, 1.011, 0.962],
      "up:open:ㅈ": [-5.586, 1.624, 1.161, 0.863],
      "down:open:ㅈ": [-5.624, -6.084, 1.208, 0.78],
      "stem:open:ㅈ": [0.732, -3.552, 1.064, 1.151],
      "right:open:ㅉ": [-0.595, -5.958, 0.819, 0.976],
      "stem:open:ㅉ": [2.454, -6.173, 0.816, 0.968],
      "right:open:ㅊ": [-4.245, -6.201, 1.027, 1.209],
      "up:open:ㅊ": [-6.396, 2.206, 1.199, 0.923],
      "down:open:ㅊ": [-5.433, -5.076, 1.185, 0.805],
      "right:open:ㅋ": [-6.225, -0.304, 1.062, 1.266],
      "up:open:ㅋ": [-3.54, 11.119, 1.304, 1.358],
      "down:open:ㅋ": [-4.642, 1.749, 1.229, 1.228],
      "right:open:ㅌ": [-1.942, -1.141, 0.979, 1.229],
      "up:open:ㅌ": [-4.118, 3.773, 1.278, 1.042],
      "down:open:ㅌ": [-3.91, -4.177, 1.223, 0.877],
      "right:open:ㅍ": [-2.504, -3.105, 0.978, 1.124],
      "up:open:ㅍ": [-5.608, 1.123, 1.061, 0.991],
      "up:n:ㅍ": [-5.939, 1.094, 1.034, 0.946],
      "down:open:ㅍ": [-5.857, 0.909, 1.01, 1.265],
      "right:open:ㅎ": [-2.447, -2.152, 1.004, 1.294],
      "up:open:ㅎ": [-4.586, 5.766, 1.052, 1.11],
      "down:open:ㅎ": [-4.619, -0.958, 0.97, 1.021],
    },
    vowel: {
      "ㅏ:open:ㅏ": [0.602, 0.592, 0.93, 1.025],
      "ㅏ:low:ㅏ": [0.282, 7.988, 0.916, 1.417],
      "ㅏ:n:ㅏ": [0.379, 4.264, 0.911, 1.112],
      "ㅏ:tier:ㅏ": [0.299, 8.119, 0.914, 1.446],
      "ㅏ:round:ㅏ": [0.545, 5.076, 0.938, 1.268],
      "ㅓ:low:ㅓ": [0.934, 1.194, 1.499, 1.124],
      "ㅓ:n:ㅓ": [1.166, -0.727, 1.476, 1.04],
      "ㅓ:tier:ㅓ": [0.964, 4.37, 1.489, 1.261],
      "ㅕ:round:ㅕ": [1.865, 1.204, 1.387, 0.909],
      "ㅗ:open:ㅗ": [-4.851, -7.21, 0.921, 0.832],
      "ㅗ:low:ㅗ": [-7.519, -13.058, 0.978, 1.18],
      "ㅗ:n:ㅗ": [-6.12, -6.406, 0.942, 1.222],
      "ㅗ:tier:ㅗ": [-7.539, -11.459, 0.964, 1.156],
      "ㅗ:round:ㅗ": [-7.439, -13.27, 0.955, 1.119],
      "ㅜ:open:ㅜ": [-4.859, 0.953, 0.918, 1.264],
      "ㅜ:low:ㅜ": [-4.85, -1.284, 0.925, 1.127],
      "ㅜ:n:ㅜ": [-2.903, 6.261, 0.934, 1.309],
      "ㅜ:tier:ㅜ": [-4.984, -3.04, 0.932, 0.951],
      "ㅜ:round:ㅜ": [-4.957, -1.843, 0.923, 1.04],
      "ㅗ:raised:ㅗ": [-2.777, 1.408, 0.932, 1.132],
      "ㅣ:open:ㅣ": [4.239, -0.385, 0.738, 1.026],
      "ㅙ:open:ㅗ": [-5.278, -12.479, 0.828, 0.754],
      "ㅙ:open:ㅐ": [-9.84, 0.437, 0.746, 1.049],
      "ㅑ:open:ㅑ": [0.394, -3.272, 0.902, 0.826],
      "ㅓ:open:ㅓ": [1.816, -6.349, 1.403, 1.064],
      "ㅓ:round:ㅓ": [2.171, 0.876, 1.34, 1.098],
      "ㅕ:open:ㅕ": [2.972, -6.092, 1.245, 0.842],
      "ㅕ:n:ㅕ": [2.75, -4.983, 1.277, 0.827],
      "ㅕ:tier:ㅕ": [2.882, 1.805, 1.247, 1.094],
      "ㅕ:low:ㅕ": [2.785, -2.982, 1.264, 0.878],
      "ㅛ:open:ㅛ": [-4.801, -6.543, 0.958, 0.792],
      "ㅠ:open:ㅠ": [-5.929, -0.544, 0.978, 1.176],
      "ㅡ:open:ㅡ": [-4.0, -3.977, 0.958, 0.716],
      "ㅡ:n:ㅡ": [-4.0, 1.808, 0.958, 0.738],
      "ㅡ:tier:ㅡ": [-4.0, 1.782, 0.958, 0.65],
      "ㅡ:low:ㅡ": [-4.0, -0.497, 0.958, 0.691],
      "ㅡ:round:ㅡ": [-4.0, -2.768, 0.958, 0.753],
      "ㅣ:n:ㅣ": [4.19, -0.875, 0.956, 1.019],
      "ㅣ:tier:ㅣ": [4.154, -0.086, 0.913, 1.083],
      "ㅣ:low:ㅣ": [4.087, 1.358, 1.045, 1.135],
      "ㅣ:round:ㅣ": [4.166, -0.445, 0.955, 1.062],
    },
  };
  const finalInkCells = {
    "r:ㄱ": [19.25, 63.25, 73.5, 96.0],
    "r:ㄴ": [23.0, 65.5, 77.0, 93.0],
    "r:ㄹ": [23.5, 58.25, 78.0, 93.0],
    "r:ㅁ": [24.25, 61.25, 75.25, 97.0],
    "r:ㅄ": [15.25, 56.75, 84.75, 96.0],
    "r:ㅇ": [31.25, 61.5, 72.0, 96.0],
    "l:ㄱ": [23.25, 63.25, 77.5, 96.0],
    "l:ㄴ": [27.0, 65.5, 81.0, 93.0],
    "l:ㄹ": [27.5, 58.25, 82.0, 93.0],
    "l:ㅁ": [28.25, 61.25, 79.25, 97.0],
    "l:ㅇ": [35.25, 61.5, 76.0, 96.0],
    "h:ㄱ": [17.25, 64.25, 71.5, 96.0],
    "h:ㄴ": [16.5, 68.5, 75.0, 93.0],
    "h:ㄹ": [18.5, 58.75, 76.0, 93.0],
    "h:ㅁ": [19.25, 62.25, 73.25, 97.0],
    "h:ㅇ": [25.0, 61.5, 67.0, 96.0],
    "c:ㄴ": [26.75, 68.5, 82.0, 93.0],
    "h:ㅊ": [15.5, 55.5, 77.75, 95.25],
    "l:ㄳ": [18.25, 57.5, 84.75, 96.0],
    "r:ㄺ": [16.5, 58.25, 73.5, 95.25],
    "r:ㄼ": [14.5, 55.25, 73.0, 95.0],
    "r:ㄻ": [14.5, 57.75, 74.75, 96.0],
    "r:ㄵ": [13.0, 61.5, 78.0, 94.5],
    "h:ㄿ": [15.75, 59.25, 78.0, 93.0],
    "s:ㄴ": [27.0, 65.5, 81.0, 93.0],
    "s:ㄹ": [27.5, 58.25, 82.0, 93.0],
    "s:ㄺ": [20.5, 58.25, 77.5, 95.25],
    "s:ㅁ": [28.25, 61.25, 79.25, 97.0],
    "s:ㅇ": [35.25, 61.5, 76.0, 96.0],
  };
  function opticalLayout(parts, a, b, c) {
    const side = compounds[b] ? 'compound' : 'ㅗㅛ'.includes(b) ? 'up' : 'ㅜㅠ'.includes(b) ? 'down' : b === 'ㅡ' ? 'flat' : b === 'ㅣ' ? 'stem' : 'ㅓㅕㅔㅖ'.includes(b) ? 'left' : 'right';
    const end = !c ? 'open' : c === 'ㄴ' ? 'n' : c === 'ㅇ' ? 'round' : 'ㅊㅎ'.includes(c) ? 'raised' : 'ㄹㅂㅍ'.includes(c) ? 'tier' : 'low';
    const horizontal = ['up', 'down', 'flat'].includes(side);
    return parts.map((part) => {
      let cell;
      if (part.kind === 'initial') {
        const table = layoutOptics.initial;
        cell = table[`${side}:${end}:${a}`] || table[`${side}:open:${a}`];
        if (!cell && ['left', 'stem'].includes(side))
          cell = table[`right:${end}:${a}`] || table[`right:open:${a}`];
      } else if (part.kind === 'vowel') {
        const table = layoutOptics.vowel;
        cell = table[`${b}:${end}:${part.char}`] || table[`${b}:open:${part.char}`];
        if (!cell && b === 'ㅛ') cell = table[`ㅗ:${end}:ㅗ`] || table['ㅗ:open:ㅗ'];
        if (!cell && b === 'ㅠ') cell = table[`ㅜ:${end}:ㅜ`] || table['ㅜ:open:ㅜ'];
      } else {
        cell = [0, 0, 1, 1];
      }
      if (!cell) return part;
      const points = part.paths.flat(),
        cx = (Math.min(...points.map((p) => p[0])) + Math.max(...points.map((p) => p[0]))) / 2,
        cy = (Math.min(...points.map((p) => p[1])) + Math.max(...points.map((p) => p[1]))) / 2;
      const [tx, ty, sx, sy] = cell;
      let paths = part.paths.map((path) => path.map(([x, y]) => [cx + (x - cx) * sx + tx, cy + (y - cy) * sy + ty]));
      if (part.kind === 'initial') {
        const top = Math.min(...paths.flat().map((p) => p[1]));
        if (top < 6.5) paths = paths.map((path) => path.map(([x, y]) => [x, y + 6.5 - top]));
      }
      if (part.kind === 'vowel' && horizontal) {
        const xs = paths.flat().map((p) => p[0]),
          left = Math.min(...xs), right = Math.max(...xs);
        paths = paths.map((path) => path.map(([x, y]) => [3.8 + ((x - left) * 84.4) / (right - left), y]));
      }
      if (part.kind === 'vowel' && !'ㅗㅛㅜㅠㅡ'.includes(part.char)) {
        const ys = paths.flat().map((p) => p[1]),
          top = Math.min(...ys), bottom = Math.max(...ys),
          targetBottom = uprightBottom(c);
        paths = paths.map((path) => path.map(([x, y]) => [x, 8 + ((y - top) * (targetBottom - 8)) / (bottom - top)]));
      }
      if (part.kind === 'final') {
        const ys = paths.flat().map((p) => p[1]),
          top = Math.min(...ys), bottom = Math.max(...ys);
        if (bottom > 94)
          paths = paths.map((path) => path.map(([x, y]) => [x, top + ((y - top) * (94 - top)) / (bottom - top)]));
      }
      if (part.kind === 'final') {
        const target = finalInkCells[`${horizontal ? 'h' : compounds[b] ? 'c' : side === 'stem' ? 's' : side === 'left' ? 'l' : 'r'}:${c}`];
        if (target) {
          for (let iteration = 0; iteration < 3; iteration++) {
            const ink = paths.flatMap(outlines).flat(),
              left = Math.min(...ink.map((p) => p[0])), right = Math.max(...ink.map((p) => p[0])),
              top = Math.min(...ink.map((p) => p[1])), bottom = Math.max(...ink.map((p) => p[1]));
            paths = paths.map((path) => path.map(([x, y]) => [
              target[0] + ((x - left) * (target[2] - target[0])) / (right - left),
              target[1] + ((y - top) * (target[3] - target[1])) / (bottom - top),
            ]));
          }
        }
      }
      return { ...part, paths };
    });
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
  function outlines(points, strokeIndex, strokes) {
    if (points.length < 2) return [];
    const closed = distance(points[0], points.at(-1)) < 0.01;
    const length = points.slice(1).reduce((n, p, i) => n + distance(points[i], p), 0);
    let design = points;
    const headVector = sample(points, 24),
      dx0 = headVector[1][0] - points[0][0],
      dy0 = headVector[1][1] - points[0][1];
    // A pen enters freely at a stem's head, but does not make another head
    // where that stem already meets a crossbar (ㄷ, ㄹ, ㅁ, ㅍ).
    const verticalReach = Math.max(...points.map((p) => p[1])) - Math.min(...points.map((p) => p[1])),
      entryScale = Math.min(1, Math.max(0.55, verticalReach / 50)),
      clearance = 5 + 3 * entryScale;
    const attached =
      Array.isArray(strokes) &&
      strokes.some(
        (other, i) =>
          i !== strokeIndex &&
          other.some((p) => distance(p, points[0]) < clearance),
      );
    if (!closed && !attached && dy0 > Math.abs(dx0) * 2 && length > 22) {
      const [x, y] = points[0],
        body = sample(points, Math.max(16, Math.ceil(length)));
      const entry = stroke(
        [x - 6.2 * entryScale, y - 4 * entryScale],
        [
          x - 4.2 * entryScale, y - 2.7 * entryScale,
          x + 0.2 * entryScale, y - 0.4 * entryScale,
          x, y + 1.7 * entryScale,
        ],
      );
      design = [...entry, ...body.filter((p, i) => i > 0 && distance(p, points[0]) > 2.2)];
    }
    const dense = sample(design, Math.min(90, Math.max(14, Math.ceil(length / 1.1))));
    const p = closed ? dense.slice(0, -1) : dense,
      left = [],
      right = [],
      halfWidths = [],
      angles = [];
    const tail = sample(points, 24),
      endDx = points.at(-1)[0] - tail.at(-2)[0],
      endDy = points.at(-1)[1] - tail.at(-2)[1],
      downwardEnd = endDy > Math.abs(endDx) * 2 && length > 30;
    for (let i = 0; i < p.length; i++) {
      const before = p[i ? i - 1 : closed ? p.length - 1 : 0],
        after = p[i < p.length - 1 ? i + 1 : closed ? 0 : i];
      const dx = after[0] - before[0],
        dy = after[1] - before[1],
        len = Math.hypot(dx, dy) || 1,
        t = i / (p.length - 1);
      const nx = -dy / len,
        ny = dx / len;
      const lift = Math.max(0, Math.min(1, (t - 0.95) / 0.05)),
        release = lift * lift * (3 - 2 * lift),
        pressure = closed
          ? 1
          : (0.9 + 0.1 * Math.min(1, t / 0.07) + 0.025 * Math.sin(Math.PI * t)) *
            (1 - (downwardEnd ? 0.35 : 0.04) * release);
      // Pen lettering stays close to one weight. Closed bowls keep a small
      // optical contrast; open strokes do not acquire a broad-nib appearance.
      const across = nx * 0.965926 + ny * 0.258819,
        along = -nx * 0.258819 + ny * 0.965926,
        horizontalWeight = !closed && Math.abs(dy) < Math.abs(dx) * 0.3 && length > 20 ? (length > 65 ? 1.2 : 1.1) : 1,
        half = Math.hypot((closed ? 2.65 : 2.45) * across, (closed ? 2.25 : 2.45) * along) * pressure * horizontalWeight;
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
          const theta = Math.PI / 2 - ((i + 1) * Math.PI) / 8,
            forward = Math.cos(theta) * r * 0.72,
            normal = Math.sin(theta) * r;
          return [
            at[0] + Math.cos(a) * forward - Math.sin(a) * normal,
            at[1] + Math.sin(a) * forward + Math.cos(a) * normal,
          ];
        });
    const body = orient([
        ...left,
        ...cap(end, halfWidths.at(-1), angles.at(-1)),
        ...right.reverse(),
        ...cap(start, halfWidths[0], angles[0] + Math.PI),
      ]),
      out = [body];
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
    VERSION: 6,
    FAMILY: 'ClassJ Gyeongpil Myeongjo',
  };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.HandwritingFont = Object.freeze(api);
})(typeof window === 'object' ? window : globalThis);
