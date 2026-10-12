// 6학년 1학기 2단원 각기둥과 각뿔 — 단원 틀, 그림 도구(겨냥도·전개도), 기본 문항(각기둥, 각기둥의 이름과 구성 요소).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 73·67·68꼴, 심화꼴 68꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭) / 미룸」을 가른 대조표는 references/textbooks/수학/_분석/6-1-2/싣기_대조표.md 에 있다.
// (전개도·각뿔·각기둥과 각뿔 견주기의 기본 문항은 6-1-2b.js, 실력 문항은 6-1-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 도형과 측정 가운데 도형. 각기둥·각뿔의 뜻, 구성 요소, 성질, 각기둥의 전개도가 이 단원의 일이다.
//   6수03-05 각기둥과 각뿔을 이해하고, 구성 요소와 성질을 탐구하고 설명할 수 있다.
//   6수03-06 각기둥의 전개도를 그릴 수 있다.
//   교육과정: 「입체도형의 전개도에 대한 평가는 전개도가 될 수 있는 것과 될 수 없는 것을 구별하는 데 중점을 둔다.」
//             「각기둥의 전개도는 간단한 형태만 다루고, 각뿔과 원뿔의 전개도는 다루지 않는다.」
//
// 싣는 기준
//  - 뜻·구성 요소·성질 그 자체를 묻는다. 주는 것(글·겨냥도·전개도), 묻는 것, 도형(각기둥인가 각뿔인가), 쓰는 성질이 다르면 다른 문제다.
//    밑면의 변의 수나 이름만 다른 것은 한 번만 싣고, 한 유형 안에서 씨앗마다 삼각~팔각으로 바뀌게 한다.
//  - 면·모서리·꼭짓점의 수는 그림에서 세거나 규칙(□각기둥: 면 □ + 2, 모서리 □ × 3, 꼭짓점 □ × 2 / □각뿔: 면 □ + 1, 모서리 □ × 2, 꼭짓점 □ + 1)을 한 번 대는 것,
//    수 하나에서 이름을 한 번에 거꾸로 찾는 것까지 기본에 싣는다. 거꾸로 찾은 뒤 한 번 더 대는 것은 실력에 있다.
//  - 길이는 그림에서 한 번 읽는 것(높이, 맞닿는 변)과 「모서리의 길이가 모두 같은 도형의 모든 모서리의 길이의 합 = 한 모서리 × 모서리의 수」뿐이다.
//  - 그림은 셈하여 그린다. 겨냥도는 밑면의 다각형을 눕혀(위에서 비스듬히 내려다본 꼴) 좌표를 셈하고, 면마다 바깥쪽을 향하는 방향을 따져
//    보이는 모서리는 실선, 보이지 않는 모서리는 점선으로 긋는다. 각기둥의 옆 모서리는 서로 평행하고 길이가 같으며, 각뿔의 옆 모서리는 한 점에서 만난다.
//    각기둥인지 각뿔인지, 어느 면이 밑면이 될 수 있는지는 꼭짓점의 자리로 판정한다(basePairs, pyramidBases).
//    전개도는 옆면 직사각형을 한 줄로 잇고 밑면을 변에 맞춰 정확한 크기로 붙인다. 접는 선은 점선, 자르는 선은 실선이다.
//    전개도가 될 수 있는지는 밑면의 수와 자리, 옆면의 수, 옆면의 높이, 맞닿는 변의 길이, 두 밑면의 모양을 차례로 따져 판정한다(judge).
//  - 서술형·작도는 싣지 않는다. 고르기나 수 답으로 바꿀 수 있는 것은 바꾸었다(밑면 색칠하기 → 바르게 색칠한 그림 고르기, 전개도 그리기 → 빠뜨린 면을 붙일 자리·겨냥도에 맞는 전개도 고르기).
//
// 뺀 것과 까닭(단원 전체)
//  - 넓이(①73 ②66 심66~68): 옆면의 넓이·밑면의 넓이·겉넓이는 측정(5-1 넓이, 6-1 겉넓이, 중학교)의 일이다. 넓이는 한 번도 싣지 않았다.
//  - 모든 모서리의 길이의 합을 여러 단계로 셈하는 것(①68·70·72 ②61~63 ③52 심59·60), 합에서 거꾸로 한 모서리·높이를 구하는 것(①69 ②64 ③53 심61~63):
//    곱셈 두 번에 덧셈, □가 있는 식을 거꾸로 푸는 셈이 일의 대부분인 측정 문제다. 모서리의 길이가 모두 같아 곱셈 한 번으로 끝나는 것만 실었다.
//  - 둘레(①71 ②65·67 ③54 심54·58·64·65): 한 밑면의 둘레, 전개도의 둘레, 옆면을 이은 선분(밑면의 둘레)은 길이를 여럿 더하는 측정 문제다.
//  - 수의 합·차 조건을 식으로 세워 거꾸로 푸는 것(①26 ②36·37 ③49·51 심43): 방정식 꼴의 조건 풀기다.
//  - 뜻 없는 셈: 면·모서리·꼭짓점의 수를 더하고 빼기(①64 ②11·29·30 ③44 심36·37·39·40), 세 수를 이어 쓴 비밀번호(②30의 변형 ③45), 규칙의 빈칸끼리 더하기(②28의 합)
//  - 붙여 만든 입체도형의 꼭짓점(③48): 맞붙는 꼭짓점을 빼는 경우 따지기이고, 만든 도형은 각기둥도 각뿔도 아니다.
//  - 위·앞·옆에서 본 모양(①42의 변형 심13): 6학년 2학기 「공간과 입체」
//  - 다각형 고르기(①1): 4학년 2학기 되짚기
//  - 그리기·색칠하기(①9·41 ②6·50~53 ③6·65·66·68 심55·56), 까닭·같은 점 쓰기(②4·42·58·59 ③4·20·24·57 심3·4·5·30·47): 고르기로 바꿀 수 있는 것은 바꾸어 실었다.
//  - 놀이(③47), 열린 답(③46의 변형)
//  - 옆면이 평행사변형인 기둥 꼴을 「각기둥이 아닌 도형」으로 쓰는 것(심3의 변형): 수학에서는 빗각기둥도 각기둥이라서 그렇게 가르치면 틀린 생각을 심는다.
//    각기둥이 아닌 도형으로는 두 밑면의 크기가 다른 것(옆면이 사다리꼴), 굽은 면이 있는 것, 뿔 모양만 쓴다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 수와 단위 기호는 띄어 쓴다(7 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C } = B.kit;
  const G = B.kit.geo;
  const SOLID = '6수03-05', NET = '6수03-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바', '사', '아'], MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const POINTS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const cm = (v) => v + ' cm';
  const fixed = (...values) => ({ calc: values.map((v, i) => [String(v), i]), unseen: values });

  // ── 이름과 수 ────────────────────────────────────────────────
  const NUM = { 3: '삼', 4: '사', 5: '오', 6: '육', 7: '칠', 8: '팔', 9: '구', 10: '십', 11: '십일', 12: '십이', 13: '십삼', 14: '십사', 15: '십오', 16: '십육', 17: '십칠', 18: '십팔', 19: '십구', 20: '이십' };
  const gon = (n) => NUM[n] + '각형', prismName = (n) => NUM[n] + '각기둥', pyramidName = (n) => NUM[n] + '각뿔';
  // 밑면의 변이 n개인 각기둥·각뿔의 면, 모서리, 꼭짓점의 수
  const PRISM = { face: (n) => n + 2, edge: (n) => n * 3, vert: (n) => n * 2 }, PYRAMID = { face: (n) => n + 1, edge: (n) => n * 2, vert: (n) => n + 1 };
  // 검사가 다시 셈할 식: 규칙을 적는다(답은 그림의 얼개에서 센 수다).
  const PRISM_EXPR = { face: (n) => `${n}+2`, edge: (n) => `${n}*3`, vert: (n) => `${n}*2` }, PYRAMID_EXPR = { face: (n) => `${n}+1`, edge: (n) => `${n}*2`, vert: (n) => `${n}+1` };
  const PART = { face: '면', edge: '모서리', vert: '꼭짓점' }, PARTS = ['face', 'edge', 'vert'];

  // ── 보기 짜기 ────────────────────────────────────────────────
  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋
  function setOptions(d, labels, flags, join) {
    const key = (list) => list.join(join || ', '), right = labels.filter((_, i) => flags[i]), pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }
  // 설명 고르기: want 가 true 이면 옳은 것 하나와 틀린 것 셋, false 이면 옳은 것 셋과 틀린 것 하나. 틀린 설명은 [틀린 말, 바로잡는 말]로 적는다.
  function say(d, text, trues, falses, want, lead, figure) {
    const wrong = d.shuffle(falses).slice(0, want ? 3 : 1), rows = d.shuffle((want ? [d.pick(trues)] : d.shuffle(trues).slice(0, 3)).map((t) => [t, true]).concat(wrong.map((f) => [f[0], false])));
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === want), {
      figure, explain: [lead].concat(wrong.map((f) => f[1])).filter(Boolean).join(' '), facts: { truth: rows.map((r) => r[1]), want }
    });
  }
  // 낱말 하나 고르기
  function pickWord(d, text, want, others, explain, figure) {
    const options = d.shuffle([want].concat(others));
    return C(text, options, options.indexOf(want), { figure, explain, facts: { truth: options.map((o) => o === want), want: true } });
  }

  // ── 그림(픽셀 단위) ──────────────────────────────────────────
  const f1 = (n) => Math.round(n * 10) / 10;
  const ptsOf = (list) => list.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ');
  // 선분. kind: ''(실선), 'dash'(점선), 'thin'(가는 선). css 로 빛깔·굵기를 바꾼다.
  const stroke = (p, q, kind, css) => '<line class="mb-line' + (kind === 'dash' ? ' is-cut' : kind === 'thin' ? ' is-thin' : '') + '"' + (css ? ' style="' + css + '"' : '') + ' x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '"/>';
  const fill = (list, color) => '<polygon points="' + ptsOf(list) + '" style="fill:' + color + ';stroke:none"/>';
  // css: 글에 더할 꾸밈. HALO 는 글 둘레를 바탕색으로 둘러 밑에 깔린 점선이 비치지 않게 한다.
  const HALO = 'paint-order:stroke;stroke:#fff8e1;stroke-width:4px;stroke-linejoin:round';
  const word = (p, text, kind, css) => '<text class="mb-label' + (kind ? ' ' + kind : '') + '"' + (/^[㉠-㉤]$/.test(text) || css ? ' style="' + (/^[㉠-㉤]$/.test(text) ? 'font-size:15px;' : '') + (css || '') + '"' : '') + ' x="' + f1(p[0]) + '" y="' + f1(p[1]) + '" text-anchor="middle" dominant-baseline="central">' + text + '</text>';
  // 글의 너비(어림): 한글·기호는 글자 크기만큼, 숫자·로마자는 그 0.58배
  const wide = (text, size) => Array.from(String(text)).reduce((s, ch) => s + (/[0-9a-zA-Z]/.test(ch) ? 0.58 : ch === ' ' ? 0.3 : 1), 0) * size;
  const CREAM = '#fff8e1', YELLOW = 'rgba(251,191,36,0.5)', BLUE = 'rgba(96,165,250,0.5)', BOLD = 'stroke:#dc2626;stroke-width:3.4';
  // 그릴 것을 모으며 차지한 자리를 재어, 끝에 꼭 맞는 크기의 그림으로 낸다.
  function canvas() {
    const parts = []; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const see = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
    return {
      add: (html) => { parts.push(html); },
      point: (p) => see(p[0], p[1]),
      box: (c, hw, hh) => { see(c[0] - hw, c[1] - hh); see(c[0] + hw, c[1] + hh); },
      size: () => [x1 - x0, y1 - y0],
      // 너비가 64px 에 못 미치는 그림은 양옆 여백을 넓힌다(화면 검사가 너무 좁은 그림을 떨어뜨린다).
      out: (label, pad) => {
        const m = pad == null ? 6 : pad, side = Math.max(m, (64 - (x1 - x0)) / 2), w = x1 - x0 + side * 2, h = y1 - y0 + m * 2;
        return '<svg class="mb-geo" viewBox="' + f1(x0 - side) + ' ' + f1(y0 - m) + ' ' + f1(w) + ' ' + f1(h) + '" width="' + Math.ceil(w) + '" role="img" aria-label="' + label + '">' + parts.join('') + '</svg>';
      }
    };
  }
  // 글 상자(가운데 c, 반너비 hw, 반높이 hh)가 선분 a–b 나 다른 글 상자에 닿는가
  const hitSeg = (c, hw, hh, a, b) => { for (let k = 0; k <= 40; k += 1) { const x = a[0] + (b[0] - a[0]) * k / 40, y = a[1] + (b[1] - a[1]) * k / 40; if (Math.abs(x - c[0]) < hw && Math.abs(y - c[1]) < hh) return true; } return false; };
  // 점 pt 에서 선분 a–b 까지의 거리
  const segGap = (pt, a, b) => { const rx = b[0] - a[0], ry = b[1] - a[1], t = Math.max(0, Math.min(1, ((pt[0] - a[0]) * rx + (pt[1] - a[1]) * ry) / ((rx * rx + ry * ry) || 1))); return Math.hypot(pt[0] - a[0] - rx * t, pt[1] - a[1] - ry * t); };
  const hitBox = (c, hw, hh, t) => Math.abs(c[0] - t.c[0]) < hw + t.hw && Math.abs(c[1] - t.c[1]) < hh + t.hh;
  const tiles = (list, labels) => G.tiles(list.map((svg, i) => [(labels || TAGS)[i], svg]));
  // 점 pt 의 이름을 적을 자리: 그 점에서 나가는 선들 사이의 빈 쪽 가운데 둘레의 선과 가장 멀리 떨어지는 곳. walls: 그어 놓은 선분들, taken: 이미 적은 글 상자들
  function nameSpot(pt, walls, taken, blocked) {
    const angs = [];
    for (const [a, b] of walls) {
      const da = Math.hypot(a[0] - pt[0], a[1] - pt[1]), db = Math.hypot(b[0] - pt[0], b[1] - pt[1]);
      if (da < 0.7 && db > 0.7) angs.push(Math.atan2(b[1] - pt[1], b[0] - pt[0]));
      else if (db < 0.7 && da > 0.7) angs.push(Math.atan2(a[1] - pt[1], a[0] - pt[0]));
      else if (da > 0.7 && db > 0.7 && segGap(pt, a, b) < 0.7) { angs.push(Math.atan2(a[1] - pt[1], a[0] - pt[0])); angs.push(Math.atan2(b[1] - pt[1], b[0] - pt[0])); }
    }
    angs.sort((x, y) => x - y);
    const mids = angs.length ? angs.map((a, i) => { const b = i + 1 < angs.length ? angs[i + 1] : angs[0] + 2 * Math.PI; return [(a + b) / 2, b - a]; }) : [[-Math.PI / 2, 6]];
    const spots = [];
    for (const far of [12, 15, 19]) for (const [mid, gap] of mids) {
      const c = [pt[0] + far * Math.cos(mid), pt[1] + far * Math.sin(mid)];
      if ((blocked && blocked(c)) || taken.some((t) => hitBox(c, 7.5, 8, t))) continue;
      spots.push({ c, gap, far, room: Math.min(40, ...walls.map((w) => segGap(c, w[0], w[1]))) });
    }
    // 선과 7px 넘게 떨어지는 자리 가운데 점에 가장 가까운 것, 없으면 선과 가장 멀리 떨어지는 것
    const clear = spots.filter((s) => s.room >= 7.5).sort((p, q) => p.far - q.far || (Math.abs(q.room - p.room) > 0.6 ? q.room - p.room : q.gap - p.gap));
    if (clear.length) return clear[0].c;
    spots.sort((p, q) => q.room - p.room);
    return spots.length ? spots[0].c : [pt[0], pt[1] - 12];
  }
  // 선분 a–b 옆에 길이 글을 적을 자리: 되도록 그림 바깥쪽(가운데 mid 에서 먼 쪽)의 여러 자리 가운데 선이나 다른 글에 닿지 않는 첫 자리
  function lengthSpot(a, b, text, mid, walls, taken, blocked) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, n = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const out = (m[0] - mid[0]) * n[0] + (m[1] - mid[1]) * n[1] >= 0 ? 1 : -1, hw = wide(text, 12) / 2 + 1, hh = 7.5;
    for (const s of [out, -out]) for (const gap of [4, 8, 12]) for (const t of [0.5, 0.4, 0.6, 0.3, 0.7]) {
      const far = gap + hw * Math.abs(n[0]) + hh * Math.abs(n[1]), c = [a[0] + (b[0] - a[0]) * t + n[0] * s * far, a[1] + (b[1] - a[1]) * t + n[1] * s * far];
      if (blocked && s === out && blocked(c)) continue;
      if (!walls.some((w) => hitSeg(c, hw + 1.5, hh + 1, w[0], w[1])) && !taken.some((box) => hitBox(c, hw + 4, hh + 2, box))) return { c, hw, hh, tidy: true };
    }
    return { c: [m[0] + n[0] * out * (14 + hw), m[1] + n[1] * out * (14 + hh)], hw, hh, tidy: false };
  }

  // 그림 안쪽의 선분(각뿔의 높이) 옆에 글을 적을 자리: 실선이나 다른 글에 닿지 않는 자리를 찾는다. 점선 위에 놓일 수밖에 없으면 글 둘레를 바탕색으로 두른다(halo).
  function innerSpot(a, b, text, walls, taken) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, n = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L], hw = wide(text, 12) / 2 + 1, hh = 7.5, solid = walls.filter((w) => w[2] !== 'dash');
    let best = null;
    for (const gap of [3, 6, 10, 15, 21]) for (const t of [0.8, 0.88, 0.7, 0.6, 0.5, 0.4]) for (const s of [1, -1]) {
      const far = gap + hw * Math.abs(n[0]) + hh * Math.abs(n[1]), c = [a[0] + (b[0] - a[0]) * t + n[0] * s * far, a[1] + (b[1] - a[1]) * t + n[1] * s * far];
      if (solid.some((w) => hitSeg(c, hw + 1.5, hh + 1, w[0], w[1])) || taken.some((box) => hitBox(c, hw + 3, hh + 2, box))) continue;
      const crossed = walls.filter((w) => w[2] === 'dash' && hitSeg(c, hw, hh, w[0], w[1])).length;
      if (!crossed) return { c, hw, hh, halo: false };
      if (gap <= 6 && (!best || crossed < best.crossed)) best = { c, hw, hh, crossed, halo: true };
    }
    return best;
  }

  // ── 평면 다각형 ──────────────────────────────────────────────
  const RAD = Math.PI / 180;
  const sub2 = (p, q) => [p[0] - q[0], p[1] - q[1]], dot2 = (u, v) => u[0] * v[0] + u[1] * v[1], cross2 = (u, v) => u[0] * v[1] - u[1] * v[0];
  const dist2 = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const near = (a, b) => Math.abs(a - b) < 1e-6, samePt = (p, q) => near(p[0], q[0]) && near(p[1], q[1]);
  const r6 = (v) => Math.round(v * 1e6) / 1e6;
  const regular = (n, r, rot) => Array.from({ length: n }, (_, i) => [r * Math.cos(((rot || 0) + (360 * i) / n) * RAD), r * Math.sin(((rot || 0) + (360 * i) / n) * RAD)]);
  // 한 변의 길이가 s 인 정n각형
  const regularSide = (n, s) => regular(n, s / (2 * Math.sin(Math.PI / n)), 0);
  const area2 = (pts) => pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
  const ccw = (pts) => (area2(pts) > 0 ? pts.slice() : pts.slice().reverse());
  const centre = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const turn2 = (pts, deg) => { const c = centre(pts), co = Math.cos(deg * RAD), si = Math.sin(deg * RAD); return pts.map(([x, y]) => [c[0] + (x - c[0]) * co - (y - c[1]) * si, c[1] + (x - c[0]) * si + (y - c[1]) * co]); };
  // 세 변의 길이가 a, b, c 인 삼각형(꼭짓점 0→1 이 a, 1→2 가 b, 2→0 이 c)
  const triangle = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a), y = Math.sqrt(Math.max(0, c * c - x * x)); return [[0, 0], [a, 0], [x, y]]; };
  // 다각형의 꼭짓점 i 에서 안쪽 각의 크기(라디안)
  const angleAt = (pts, i) => { const n = pts.length, u = sub2(pts[(i + n - 1) % n], pts[i]), v = sub2(pts[(i + 1) % n], pts[i]); return Math.abs(Math.atan2(cross2(u, v), dot2(u, v))); };
  const sidesOf = (pts) => pts.map((p, i) => dist2(p, pts[(i + 1) % pts.length]));
  // 볼록한 두 다각형이 겹치는가(변끼리 맞닿기만 한 것은 겹친 것이 아니다)
  function overlap2(P, Q) {
    for (const poly of [P, Q]) for (let i = 0; i < poly.length; i += 1) {
      const a = poly[i], b = poly[(i + 1) % poly.length], nx = -(b[1] - a[1]), ny = b[0] - a[0], L = Math.hypot(nx, ny) || 1;
      const span = (pts) => { const v = pts.map((p) => (p[0] * nx + p[1] * ny) / L); return [Math.min(...v), Math.max(...v)]; }, [p0, p1] = span(P), [q0, q1] = span(Q);
      if (p1 <= q0 + 1e-6 || q1 <= p0 + 1e-6) return false;
    }
    return true;
  }
  const insidePoly = (pts, x, y) => { let hit = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i, i += 1) { const a = pts[i], b = pts[j]; if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) hit = !hit; } return hit; };

  // ── 입체도형의 얼개 ──────────────────────────────────────────
  // 입체: { verts: [[x, y(안쪽), z(위)]], faces: [꼭짓점 번호의 고리], rings: 고리로 이름을 붙이는 면의 수(각기둥 꼴 2, 각뿔 꼴 1), names }
  const sub3 = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]], add3 = (p, q) => [p[0] + q[0], p[1] + q[1], p[2] + q[2]], mul3 = (p, k) => [p[0] * k, p[1] * k, p[2] * k];
  const dot3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const cross3 = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const len3 = (p) => Math.sqrt(dot3(p, p)), unit3 = (p) => mul3(p, 1 / (len3(p) || 1));
  const avg3 = (list) => [0, 1, 2].map((i) => list.reduce((s, p) => s + p[i], 0) / list.length);
  const facePts = (solid, f) => solid.faces[f].map((v) => solid.verts[v]);
  // 면의 바깥쪽을 향하는 방향(길이 1). 볼록한 입체만 다룬다.
  function normalOf(solid, f) {
    const pts = facePts(solid, f); let n = [0, 0, 0];
    pts.forEach((p, i) => { n = add3(n, cross3(p, pts[(i + 1) % pts.length])); });
    if (dot3(n, sub3(avg3(pts), avg3(solid.verts))) < 0) n = mul3(n, -1);
    return unit3(n);
  }
  // 모서리: { v: [두 끝], faces: [이 모서리에서 만나는 두 면], key }
  function edgesOf(solid) {
    const map = new Map();
    solid.faces.forEach((ring, f) => ring.forEach((v, i) => {
      const w = ring[(i + 1) % ring.length], key = Math.min(v, w) + '-' + Math.max(v, w);
      if (!map.has(key)) map.set(key, { v: [Math.min(v, w), Math.max(v, w)], faces: [], key });
      map.get(key).faces.push(f);
    }));
    return [...map.values()];
  }
  const edgeKey = (v, w) => Math.min(v, w) + '-' + Math.max(v, w);
  const isRectFace = (pts) => pts.length === 4 && pts.every((p, i) => Math.abs(dot3(sub3(pts[(i + 3) % 4], p), sub3(pts[(i + 1) % 4], p))) < 1e-6);
  // 두 면이 서로 평행한가
  const parallelFaces = (solid, f, g) => f !== g && Math.abs(Math.abs(dot3(normalOf(solid, f), normalOf(solid, g))) - 1) < 1e-6;
  // 면 f 를 그 면에 수직인 쪽으로 밀어 옮기면 면 g 와 꼭 겹치는가(서로 평행하고 합동이며 마주 보는 두 면)
  function shifted(solid, f, g) {
    const A = facePts(solid, f), Bp = facePts(solid, g);
    if (A.length !== Bp.length) return false;
    const n = normalOf(solid, f), t = dot3(sub3(Bp[0], A[0]), n), move = mul3(n, t);
    return Math.abs(t) > 1e-6 && A.every((p) => Bp.some((q) => len3(sub3(add3(p, move), q)) < 1e-6));
  }
  // 밑면이 될 수 있는 두 면의 짝 전부: 한 면을 수직으로 밀어 옮기면 다른 면과 겹치고(평행·합동), 나머지 면이 모두 직사각형이다.
  function basePairs(solid) {
    const out = [], all = solid.faces.map((_, i) => i);
    for (const f of all) for (const g of all) {
      if (f >= g || !shifted(solid, f, g)) continue;
      const rest = all.filter((i) => i !== f && i !== g);
      if (rest.length === solid.faces[f].length && rest.every((i) => isRectFace(facePts(solid, i)))) out.push([f, g]);
    }
    return out;
  }
  const isPrism = (solid) => !solid.curved && basePairs(solid).length > 0;
  // 각뿔의 밑면이 될 수 있는 면 전부: 그 면 밖의 꼭짓점이 하나뿐이고, 나머지 면이 모두 그 점을 지나는 삼각형이다.
  function pyramidBases(solid) {
    const out = [];
    solid.faces.forEach((ring, f) => {
      const rest = solid.faces.filter((_, i) => i !== f), tips = solid.verts.map((_, v) => v).filter((v) => !ring.includes(v));
      if (tips.length === 1 && rest.length === ring.length && rest.every((r) => r.length === 3 && r.includes(tips[0]))) out.push(f);
    });
    return out;
  }
  const isPyramid = (solid) => !solid.curved && pyramidBases(solid).length > 0;
  // 서로 평행한 두 면이 있는가, 서로 평행하고 합동인 두 면이 있는가
  const hasParallel = (solid) => solid.faces.some((_, f) => solid.faces.some((__, g) => parallelFaces(solid, f, g)));
  const hasTwin = (solid) => solid.faces.some((_, f) => solid.faces.some((__, g) => f !== g && shifted(solid, f, g)));
  // 두 고리(위·아래)를 이은 입체. 꼭짓점: 윗고리 0…n−1, 아랫고리 n…2n−1. 면: 윗면, 아랫면, 옆의 면 n개(i번째는 꼭짓점 i 와 i+1 사이)
  function ringSolid(top, bottom) {
    const n = top.length, ring = top.map((_, i) => i);
    return { verts: top.concat(bottom), faces: [ring, ring.map((i) => i + n)].concat(ring.map((i) => [i, i + n, ((i + 1) % n) + n, (i + 1) % n])), n, rings: 2, names: POINTS.slice(0, n * 2) };
  }
  // 한 점과 고리를 이은 입체. 꼭짓점: 뿔의 꼭짓점 0, 밑면 1…n. 면: 밑면, 옆면 n개
  function tipSolid(tip, base) {
    const n = base.length;
    return { verts: [tip].concat(base), faces: [base.map((_, i) => i + 1)].concat(base.map((_, i) => [0, i + 1, ((i + 1) % n) + 1])), n, rings: 1, names: POINTS.slice(0, n + 1) };
  }
  // 밑면의 꼭짓점 차례: 위에서 볼 때 시계 반대 방향으로 돌고, 가장 뒤쪽(조금 왼쪽) 꼭짓점에서 시작한다(교과서 그림의 ㄱ, ㄴ, ㄷ … 차례).
  function arrange(base) {
    const pts = ccw(base), score = pts.map((p) => p[1] - 0.3 * p[0]), at = score.indexOf(Math.max(...score));
    return pts.map((_, i) => pts[(at + i) % pts.length]);
  }
  // 세워 그릴 밑면의 놓임새: 꼭짓점들의 가로 자리가 고르게 떨어지는 쪽으로 돌린다(모서리가 겹쳐 보이지 않게). tip: 각뿔의 꼭짓점(밑면 가운데 위)의 가로 자리도 함께 따진다.
  // 가장 고른 놓임새는 좌우가 똑같아 납작해 보이므로, 그 7할까지 고른 것 가운데 앞에서 보이는 옆면이 많고 좌우가 덜 똑같은 것을 고른다.
  function settle(base, tip) {
    const cands = [];
    for (let deg = 0; deg < 360; deg += 3) {
      const pts = ccw(turn2(base, deg)), n = pts.length, xs = pts.map((p) => p[0]).concat(tip ? [centre(pts)[0]] : []), sorted = xs.slice().sort((p, q) => p - q), span = sorted[sorted.length - 1] - sorted[0], mid = (sorted[0] + sorted[sorted.length - 1]) / 2;
      let gap = Infinity;
      for (let i = 1; i < sorted.length; i += 1) gap = Math.min(gap, sorted[i] - sorted[i - 1]);
      cands.push({ pts, score: gap / span, front: pts.filter((p, i) => pts[(i + 1) % n][0] - p[0] > 1e-9).length, lop: Math.max(...sorted.map((x, i) => Math.abs(x + sorted[sorted.length - 1 - i] - 2 * mid))) / span });
    }
    const best = Math.max(...cands.map((c) => c.score)), pool = cands.filter((c) => c.score >= best * 0.7).sort((p, q) => q.front - p.front || q.lop - p.lop), c = centre(pool[0].pts);
    return arrange(pool[0].pts.map(([x, y]) => [x - c[0], y - c[1]]));
  }
  const mirror2 = (pts) => pts.map(([x, y]) => [-x, y]);
  // 보는 쪽: UP 은 위에서 비스듬히 내려다본 꼴(밑면이 타원 위에 놓인다), SIDE 는 옆으로 비껴 본 꼴(눕힌 기둥)
  const UP = [0, 0.42], SIDE = [0.5, 0.36];
  // 세운 각기둥·각뿔·뿔대 꼴. base: 밑면([x, y], 길이 단위는 마음대로), flip: 좌우를 뒤집어 놓는다.
  function upPrism(base, h, flip) { const b = settle(flip ? mirror2(base) : base); return Object.assign(ringSolid(b.map(([x, y]) => [x, y, h]), b.map(([x, y]) => [x, y, 0])), { dep: UP }); }
  function upPyramid(base, h, flip) { const b = settle(flip ? mirror2(base) : base, true); return Object.assign(tipSolid([0, 0, h], b.map(([x, y]) => [x, y, 0])), { dep: UP }); }
  // 위쪽 면이 아래쪽 면보다 작은 꼴(각뿔의 위를 밑면과 평행하게 잘라 낸 모양)
  function upFrustum(base, h, k, flip) { const b = settle(flip ? mirror2(base) : base); return Object.assign(ringSolid(b.map(([x, y]) => [x * k, y * k, h]), b.map(([x, y]) => [x, y, 0])), { dep: UP }); }
  // 앞면이 다각형 front([x, z])이고 안쪽으로 depth 만큼 들어간 눕힌 기둥. 꼭짓점: 앞면 0…n−1, 뒷면 n…2n−1
  function lyingPrism(front, depth) { return Object.assign(ringSolid(front.map(([x, z]) => [x, 0, z]), front.map(([x, z]) => [x, depth, z])), { dep: SIDE }); }
  // 면의 이름: 가장 앞선 글자에서 시작한다. 고리인 면(윗면·아랫면)은 글자 차례대로, 옆의 면은 아래로 먼저 내려가게 읽는다(면 ㄱㅁㅂㄴ). 삼각형은 글자 차례대로.
  function faceName(solid, f) {
    const ring = solid.faces[f], rank = ring.map((v) => POINTS.indexOf(solid.names[v])), L = ring.length;
    if (L === 3) return ring.map((v) => solid.names[v]).sort((a, b) => POINTS.indexOf(a) - POINTS.indexOf(b)).join('');
    const at = rank.indexOf(Math.min(...rank)), fwd = rank[(at + 1) % L], back = rank[(at + L - 1) % L], step = (f < solid.rings ? fwd < back : fwd > back) ? 1 : L - 1;
    return ring.map((_, i) => solid.names[ring[(at + i * step) % L]]).join('');
  }
  const faceSaid = (solid, f) => '면 ' + faceName(solid, f);
  const edgeName = (solid, key) => key.split('-').map((v) => solid.names[Number(v)]).sort((a, b) => POINTS.indexOf(a) - POINTS.indexOf(b)).join('');

  // ── 그림: 겨냥도 ─────────────────────────────────────────────
  // 볼록한 입체를 비스듬히 본 그림. 안쪽으로 1 들어간 점은 오른쪽으로 dep[0], 위로 dep[1] 옮겨 그린다(평행한 모서리는 그림에서도 평행하다).
  // 면의 바깥쪽이 보는 쪽을 향하면 보이는 면이고, 보이는 면에 닿은 모서리는 실선, 나머지는 점선이다.
  // o: { size: [너비, 높이](px), names(true 또는 { 꼭짓점 번호: 이름 }), lens: [[끝 a, 끝 b, 글], …](끝은 꼭짓점 번호나 [x, y, z]), tint: { 면 번호: 빛깔 }, faceText: { 면 번호: 글 },
  //      style: { 모서리 key: 'solid' | 'dash' | 'none' }, bold: [모서리 key], dots: [꼭짓점 번호],
  //      marks: [{ a, b, kind, css, right: 직각 표시를 할 쪽(b 에서), text, inner: 글을 그림 안쪽에 적는다 }](덧그리는 선분), spots: [{ p, name, dot }](덧찍는 점),
  //      over: (at, cv) => 덧그릴 것(at 은 [x, y, z] 를 그림의 자리로 바꾼다), label }
  function draw(solid, o) {
    const opt = o || {}, dep = opt.dep || solid.dep || UP, size = opt.size || [116, 110];
    const flat = (p) => [p[0] + p[1] * dep[0], -(p[2] + p[1] * dep[1])], spot3 = (x) => (typeof x === 'number' ? solid.verts[x] : x);
    const every = solid.verts.concat((opt.marks || []).reduce((all, m) => all.concat([spot3(m.a), spot3(m.b)]), []), (opt.spots || []).map((s) => s.p)).map(flat);
    const xs = every.map((p) => p[0]), ys = every.map((p) => p[1]), k = Math.min(size[0] / (Math.max(...xs) - Math.min(...xs)), size[1] / ((Math.max(...ys) - Math.min(...ys)) || 1));
    const at = (p) => { const q = flat(p); return [q[0] * k, q[1] * k]; }, P = solid.verts.map(at), mid = [P.reduce((s, p) => s + p[0], 0) / P.length, P.reduce((s, p) => s + p[1], 0) / P.length];
    const seen = solid.faces.map((_, f) => dot3(normalOf(solid, f), [dep[0], -1, dep[1]]) > 1e-9), E = edgesOf(solid);
    const cv = canvas(), walls = [], taken = [];
    P.forEach(cv.point);
    solid.faces.forEach((ring, f) => { if (seen[f]) cv.add(fill(ring.map((v) => P[v]), CREAM)); });
    Object.keys(opt.tint || {}).forEach((f) => cv.add(fill(solid.faces[f].map((v) => P[v]), opt.tint[f])));
    const kindOf = (e) => (opt.style && opt.style[e.key]) || (e.faces.some((f) => seen[f]) ? 'solid' : 'dash');
    for (const pass of ['dash', 'solid']) E.forEach((e) => {
      if (kindOf(e) !== pass) return;
      walls.push([P[e.v[0]], P[e.v[1]], pass]);
      cv.add(stroke(P[e.v[0]], P[e.v[1]], pass === 'dash' ? 'dash' : '', (opt.bold || []).includes(e.key) ? BOLD : ''));
    });
    const lens = (opt.lens || []).slice(), inner = [];
    (opt.marks || []).forEach((m) => {
      const a3 = spot3(m.a), b3 = spot3(m.b), a = at(a3), b = at(b3);
      walls.push([a, b, m.kind === 'dash' ? 'dash' : 'solid']); cv.add(stroke(a, b, m.kind || '', m.css));
      if (m.right) {
        // 직각 표시. 글이 그 위에 놓이지 않게 자리를 잡아 둔다.
        const u = unit3(sub3(a3, b3)), w = unit3(m.right), s = 8 / k, corner = at(add3(b3, add3(mul3(u, s), mul3(w, s))));
        cv.add('<polyline class="mb-mark" points="' + ptsOf([at(add3(b3, mul3(u, s))), corner, at(add3(b3, mul3(w, s)))]) + '"/>');
        taken.push({ c: [(b[0] + corner[0]) / 2, (b[1] + corner[1]) / 2], hw: Math.abs(corner[0] - b[0]) / 2 + 1, hh: Math.abs(corner[1] - b[1]) / 2 + 1 });
      }
      if (m.text) (m.inner ? inner : lens).push([a3, b3, m.text]);
    });
    if (opt.over) cv.add(opt.over(at, cv));
    (opt.dots || []).forEach((v) => cv.add('<circle cx="' + f1(P[v][0]) + '" cy="' + f1(P[v][1]) + '" r="4" style="fill:#dc2626"/>'));
    (opt.spots || []).forEach((s) => { if (s.dot !== false) { const p = at(s.p); cv.add('<circle class="mb-dot" cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="2.4"/>'); } });
    const put = (c, text, kind, hw, hh, css) => { cv.add(word(c, text, kind, css)); cv.box(c, hw, hh); taken.push({ c, hw, hh }); };
    const names = opt.names === true ? solid.names : opt.names || {};
    solid.verts.forEach((_, v) => { if (names[v]) put(nameSpot(P[v], walls, taken), names[v], '', 6.5, 7); });
    (opt.spots || []).forEach((s) => { if (s.name) put(nameSpot(at(s.p), walls, taken), s.name, '', 6.5, 7); });
    // 면 위에 적는 글: 그 면 안에서 둘레의 선(뒤에 비치는 점선까지)과 가장 멀리 떨어지는 자리에 적는다.
    Object.keys(opt.faceText || {}).forEach((f) => {
      const ring = solid.faces[f].map((v) => P[v]), xs = ring.map((p) => p[0]), ys = ring.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
      let best = null;
      for (let i = 1; i < 12; i += 1) for (let j = 1; j < 12; j += 1) { const c = [x0 + (w * i) / 12, y0 + (h * j) / 12]; if (!insidePoly(ring, c[0], c[1])) continue; const room = Math.min(...walls.map((s) => segGap(c, s[0], s[1]))); if (!best || room > best.room) best = { c, room }; }
      put(best ? best.c : [x0 + w / 2, y0 + h / 2], opt.faceText[f], '', 7, 7.5);
    });
    draw.tidy = true;
    // 그림 안쪽의 선분에 적는 글(각뿔의 높이)을 먼저 놓는다.
    let lost = false;
    inner.forEach(([a, b, text]) => { const s = innerSpot(at(a), at(b), text, walls, taken); if (s) put(s.c, text, 'is-length', s.hw, s.hh, s.halo ? HALO : ''); else { lens.push([a, b, text]); lost = true; } });
    lens.forEach(([a, b, text]) => { const s = lengthSpot(at(spot3(a)), at(spot3(b)), text, mid, walls, taken); if (!s.tidy) draw.tidy = false; put(s.c, text, 'is-length', s.hw, s.hh); });
    if (lost) draw.tidy = false;
    return cv.out(opt.label || '입체도형');
  }
  // 겨냥도에서 보이는 면인가(색칠할 면을 고를 때 쓴다)
  const seenFaces = (solid) => solid.faces.map((_, f) => dot3(normalOf(solid, f), [(solid.dep || UP)[0], -1, (solid.dep || UP)[1]]) > 1e-9);
  const seenEdges = (solid) => { const seen = seenFaces(solid); return edgesOf(solid).filter((e) => e.faces.some((f) => seen[f])).map((e) => e.key); };
  // 굽은 면이 있는 도형: 둥근 기둥, 둥근 뿔
  function roundPillar(o) {
    const rx = 26, ry = 9, h = 56, cv = canvas();
    cv.point([-rx, -ry]); cv.point([rx, h + ry]);
    cv.add('<path d="M' + -rx + ' 0V' + h + 'A' + rx + ' ' + ry + ' 0 0 0 ' + rx + ' ' + h + 'V0Z" style="fill:' + CREAM + ';stroke:none"/><ellipse class="mb-poly" cx="0" cy="0" rx="' + rx + '" ry="' + ry + '"/>');
    cv.add('<path class="mb-line is-cut" style="fill:none" d="M' + -rx + ' ' + h + 'A' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + h + '"/><path class="mb-line" style="fill:none" d="M' + -rx + ' ' + h + 'A' + rx + ' ' + ry + ' 0 0 0 ' + rx + ' ' + h + '"/>');
    cv.add(stroke([-rx, 0], [-rx, h]) + stroke([rx, 0], [rx, h]));
    return cv.out((o && o.label) || '위와 아래의 면이 원이고 옆이 굽은 면인 기둥 모양의 도형');
  }
  function roundCone(o) {
    const rx = 27, ry = 9, h = 62, cv = canvas(), ty = h - (ry * ry) / h, tx = rx * Math.sqrt(1 - (ry * ry) / (h * h));
    cv.point([-rx, 0]); cv.point([rx, h + ry]);
    cv.add('<path d="M0 0L' + f1(-tx) + ' ' + f1(ty) + 'A' + rx + ' ' + ry + ' 0 1 0 ' + f1(tx) + ' ' + f1(ty) + 'Z" style="fill:' + CREAM + ';stroke:none"/>');
    cv.add('<path class="mb-line is-cut" style="fill:none" d="M' + f1(-tx) + ' ' + f1(ty) + 'A' + rx + ' ' + ry + ' 0 0 1 ' + f1(tx) + ' ' + f1(ty) + '"/><path class="mb-line" style="fill:none" d="M' + f1(-tx) + ' ' + f1(ty) + 'A' + rx + ' ' + ry + ' 0 1 0 ' + f1(tx) + ' ' + f1(ty) + '"/>');
    cv.add(stroke([0, 0], [-tx, ty]) + stroke([0, 0], [tx, ty]));
    return cv.out((o && o.label) || '밑면이 원이고 옆이 굽은 면인 뿔 모양의 도형');
  }
  // 평면도형 하나
  function flatShape(points, label) { const cv = canvas(); points.forEach(cv.point); cv.add('<polygon class="mb-poly" points="' + ptsOf(points) + '"/>'); return cv.out(label); }
  const roundShape = () => { const cv = canvas(); cv.point([0, 0]); cv.point([52, 52]); cv.add('<circle class="mb-poly" cx="26" cy="26" r="26"/>'); return cv.out('원'); };

  // ── 전개도 ───────────────────────────────────────────────────
  // 전개도: { rects: [옆면 { x, y, w, h }](왼쪽부터 한 줄), bases: [밑면 { on: 'top' | 'bottom', at: 붙은 옆면의 번호, pts }] }. 좌표는 cm, y 는 아래로 커진다.
  // 밑면의 꼭짓점은 붙은 변의 왼쪽 끝, 오른쪽 끝, 그리고 그 다음 꼭짓점들의 차례로 적는다(i번째 꼭짓점은 옆면 at+i 의 왼쪽 모서리와 만난다).
  // 선분 a–b 를 선분 c–d 로 옮기는 회전과 평행이동(뒤집지 않는다)
  function carry(a, b, c, d) {
    const t = Math.atan2(d[1] - c[1], d[0] - c[0]) - Math.atan2(b[1] - a[1], b[0] - a[0]), co = Math.cos(t), si = Math.sin(t);
    return (p) => [c[0] + (p[0] - a[0]) * co - (p[1] - a[1]) * si, c[1] + (p[0] - a[0]) * si + (p[1] - a[1]) * co];
  }
  // 밑면이 base(위에서 본 모양)이고 높이가 h 인 각기둥의 전개도. 옆면 i 의 가로는 밑면의 i번째 변이다. top, bottom: 두 밑면을 붙일 옆면의 번호
  function netOf(base, h, o) {
    const opt = o || {}, V = ccw(base), n = V.length, X = [0];
    for (let i = 0; i < n; i += 1) X.push(X[i] + dist2(V[i], V[(i + 1) % n]));
    const j = opt.top || 0, j2 = opt.bottom == null ? j : opt.bottom, Mr = V.map(([x, y]) => [x, -y]);
    // 위쪽 밑면은 밖에서 본 모양 그대로 돌려 붙이고, 아래쪽 밑면은 밖(아래)에서 본 모양이라 뒤집힌 모양을 돌려 붙인다. 수학 좌표(y 위)에서 놓고 화면 좌표로 뒤집는다.
    const up = carry(V[j], V[(j + 1) % n], [X[j], 0], [X[j + 1], 0]), down = carry(Mr[j2], Mr[(j2 + 1) % n], [X[j2], -h], [X[j2 + 1], -h]), screen = ([x, y]) => [r6(x), r6(-y)];
    return {
      rects: V.map((_, i) => ({ x: r6(X[i]), y: 0, w: r6(X[i + 1] - X[i]), h })),
      bases: [{ on: 'top', at: j, pts: V.map((_, i) => screen(up(V[(j + i) % n]))) }, { on: 'bottom', at: j2, pts: V.map((_, i) => screen(down(Mr[(j2 + i) % n]))) }]
    };
  }
  const rectPts = (r) => [[r.x, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h], [r.x + r.w, r.y]];
  // 면을 읽는 차례로 늘어놓는다: 위쪽에 붙은 밑면, 옆면(왼쪽부터), 아래쪽에 붙은 밑면. { kind, pts, rect | base }
  function piecesOf(net) {
    const byX = (a, b) => centre(a.pts)[0] - centre(b.pts)[0], bases = (on) => net.bases.filter((b) => b.on === on).map((b) => ({ kind: 'base', pts: b.pts, base: b })).sort(byX);
    return bases('top').concat(net.rects.map((r) => ({ kind: 'side', pts: rectPts(r), rect: r })), bases('bottom'));
  }
  // 전개도가 되지 않는 까닭(되면 null): 'bases'(밑면이 2개가 아니다), 'side'(두 밑면이 같은 쪽에 있다), 'count'(옆면의 수가 밑면의 변의 수와 다르다),
  // 'height'(옆면의 높이가 서로 다르다), 'length'(맞닿는 변의 길이가 다르다), 'shape'(두 밑면이 합동이 아니다)
  // 옆면을 밑면의 둘레에 차례로 감아 본다: 밑면의 i번째 변이 옆면 at+i 의 가로와 같아야 하고, 한 바퀴 돌면 처음 옆면으로 돌아와야 한다.
  function judge(net) {
    const R = net.rects, tops = net.bases.filter((b) => b.on === 'top'), bots = net.bases.filter((b) => b.on === 'bottom');
    if (net.bases.length !== 2) return 'bases';
    if (tops.length !== 1) return 'side';
    const n = tops[0].pts.length, m = R.length;
    if (bots[0].pts.length !== n) return 'shape';
    if (m !== n) return 'count';
    if (R.some((r) => !near(r.h, R[0].h) || !near(r.y, R[0].y))) return 'height';
    for (const b of net.bases) {
      const r = R[b.at], y = b.on === 'top' ? r.y : r.y + r.h;
      if (!samePt(b.pts[0], [r.x, y]) || !samePt(b.pts[1], [r.x + r.w, y])) return 'length';
      for (let i = 0; i < n; i += 1) if (!near(dist2(b.pts[i], b.pts[(i + 1) % n]), R[(b.at + i) % n].w)) return 'length';
    }
    for (let k = 0; k < n; k += 1) if (Math.abs(angleAt(tops[0].pts, (k - tops[0].at + n) % n) - angleAt(bots[0].pts, (k - bots[0].at + n) % n)) > 1e-6) return 'shape';
    return null;
  }
  const isNet = (net) => judge(net) === null;
  const WHY = {
    bases: (net) => `밑면이 ${net.bases.length}개이다`,
    side: () => '두 밑면이 옆면의 같은 쪽에 붙어 있어서 접으면 두 밑면이 서로 겹친다',
    count: (net) => `밑면의 변은 ${net.bases[0].pts.length}개인데 옆면은 ${net.rects.length}개이다`,
    height: () => '옆면의 높이가 서로 달라서 접었을 때 맞닿는 선분의 길이가 다르다',
    length: () => '밑면의 변과 그 변에 맞닿는 옆면의 변의 길이가 다른 곳이 있다',
    shape: () => '두 밑면의 모양과 크기가 다르다'
  };
  const whyText = (net) => WHY[judge(net)](net);
  const cloneNet = (net) => ({ rects: net.rects.map((r) => Object.assign({}, r)), bases: net.bases.map((b) => ({ on: b.on, at: b.at, pts: b.pts.map((p) => p.slice()) })) });
  // 전개도의 면들이 서로 겹치지 않는가(그림으로 그릴 수 있는가)
  // 맞닿은 곳은 옆면끼리 이어진 곳과 밑면이 옆면에 붙은 곳뿐이어야 한다(밑면끼리 변이 닿으면 접는 선처럼 보인다).
  function drawable(net) {
    const pcs = piecesOf(net);
    for (let i = 0; i < pcs.length; i += 1) for (let j = i + 1; j < pcs.length; j += 1) if (overlap2(pcs[i].pts, pcs[j].pts)) return false;
    return linesOf(pcs).folds.length === net.rects.length - 1 + net.bases.length;
  }
  // 전개도가 되지 않게 고친 그림들(되는 전개도에서 한 군데만 바꾼다). 못 만들면 null.
  const FAKE = {
    // 옆면을 하나 더 그리거나 덜 그린 것
    more: (net) => { const out = cloneNet(net), last = out.rects[out.rects.length - 1]; out.rects.push({ x: r6(last.x + last.w), y: last.y, w: out.rects[0].w, h: last.h }); return out; },
    fewer: (net) => { const out = cloneNet(net), k = out.rects.length - 1; if (out.bases.some((b) => b.at === k)) return null; out.rects.pop(); return out; },
    // 밑면을 하나만 그린 것
    one: (net, d) => { const out = cloneNet(net); out.bases.splice(d.int(0, 1), 1); return out; },
    // 두 밑면을 같은 쪽에 붙인 것(아래쪽 밑면을 위쪽으로 넘긴다)
    side: (net) => { const out = cloneNet(net), b = out.bases[1], r = out.rects[b.at]; if (b.at === out.bases[0].at) return null; b.on = 'top'; b.pts = b.pts.map(([x, y]) => [x, r6(2 * r.y + r.h - y)]); return drawable(out) ? out : null; },
    // 옆면 하나의 높이를 다르게 그린 것(끝에 있는 옆면)
    height: (net, d, by) => { const out = cloneNet(net), k = d.pick([0, out.rects.length - 1].filter((i) => !out.bases.some((b) => b.at === i && b.on === 'bottom'))), r = out.rects[k]; if (r == null) return null; r.h = r6(r.h + (by || (d.bool() ? 0.3 : -0.3) * r.h)); return r.h > 0.2 && drawable(out) ? out : null; },
    // 옆면 하나의 가로를 다르게 그린 것(밑면이 붙지 않은 옆면). 그 오른쪽의 면들은 함께 밀린다.
    width: (net, d, by) => {
      const out = cloneNet(net), free = out.rects.map((_, i) => i).filter((i) => !out.bases.some((b) => b.at === i));
      if (!free.length) return null;
      const k = d.pick(free), dx = by || (d.bool() ? 0.35 : -0.3) * out.rects[k].w;
      out.rects[k].w = r6(out.rects[k].w + dx);
      out.rects.forEach((r, i) => { if (i > k) r.x = r6(r.x + dx); });
      out.bases.forEach((b) => { if (b.at > k) b.pts = b.pts.map(([x, y]) => [r6(x + dx), y]); });
      return out.rects[k].w > 0.2 && drawable(out) ? out : null;
    },
    // 아래쪽 밑면을 뒤집지 않고 붙인 것(세 변의 길이가 모두 다른 밑면이면 맞닿는 변의 길이가 어긋난다)
    turned: (net) => { const out = cloneNet(net), b = out.bases[1], r = out.rects[b.at], n = b.pts.length, flipped = b.pts.map(([x, y]) => [r6(2 * r.x + r.w - x), y]); b.pts = flipped.map((_, i) => flipped[(1 - i + n) % n]); return drawable(out) && !isNet(out) ? out : null; }
  };
  // 접었을 때 전개도의 점이 가는 꼭짓점: 'T3'(위쪽 밑면의 3번 꼭짓점), 'B0' … 되는 전개도에만 쓴다.
  function foldMap(net) {
    const n = net.rects.length, map = new Map(), key = (p) => f1(p[0] * 100) + ',' + f1(p[1] * 100);
    net.rects.forEach((r, i) => { map.set(key([r.x, r.y]), 'T' + i); map.set(key([r.x + r.w, r.y]), 'T' + ((i + 1) % n)); map.set(key([r.x, r.y + r.h]), 'B' + i); map.set(key([r.x + r.w, r.y + r.h]), 'B' + ((i + 1) % n)); });
    // 옆면 한 줄의 양 끝은 같은 모서리이다(왼쪽 끝의 T0·B0 과 오른쪽 끝의 T0·B0).
    net.bases.forEach((b) => b.pts.forEach((p, i) => { if (!map.has(key(p))) map.set(key(p), (b.on === 'top' ? 'T' : 'B') + ((b.at + i) % n)); }));
    return { at: (p) => map.get(key(p)), key };
  }
  // 면들의 변을 접는 선(두 면이 함께 가진 부분)과 자르는 선(한 면에만 있는 부분)으로 가른다.
  function linesOf(pieces) {
    const edges = [], folds = [], cuts = [];
    pieces.forEach((pc, i) => pc.pts.forEach((p, k) => edges.push({ i, a: p, b: pc.pts[(k + 1) % pc.pts.length] })));
    edges.forEach((e) => {
      const L = dist2(e.a, e.b), ux = (e.b[0] - e.a[0]) / L, uy = (e.b[1] - e.a[1]) / L, spans = [], pt = (t) => [e.a[0] + ux * t, e.a[1] + uy * t];
      edges.forEach((f) => {
        if (f.i === e.i || Math.abs((f.a[0] - e.a[0]) * uy - (f.a[1] - e.a[1]) * ux) > 1e-6 || Math.abs((f.b[0] - e.a[0]) * uy - (f.b[1] - e.a[1]) * ux) > 1e-6) return;
        const t1 = (f.a[0] - e.a[0]) * ux + (f.a[1] - e.a[1]) * uy, t2 = (f.b[0] - e.a[0]) * ux + (f.b[1] - e.a[1]) * uy, lo = Math.max(0, Math.min(t1, t2)), hi = Math.min(L, Math.max(t1, t2));
        if (hi - lo > 1e-6) { spans.push([lo, hi]); if (e.i < f.i) folds.push([pt(lo), pt(hi)]); }
      });
      spans.sort((p, q) => p[0] - q[0]);
      let cur = 0;
      for (const [lo, hi] of spans) { if (lo - cur > 1e-6) cuts.push([pt(cur), pt(lo)]); cur = Math.max(cur, hi); }
      if (L - cur > 1e-6) cuts.push([pt(cur), pt(L)]);
    });
    return { folds, cuts };
  }
  // 테두리를 따라 한 바퀴 돌며 만나는 점을 차례로 돌려준다. 맨 위 왼쪽 점에서 시작해 왼쪽 아래로 돈다(교과서의 ㄱ, ㄴ, ㄷ … 차례). 한 줄로 이어지지 않으면 null.
  function outlineOf(net) {
    const cuts = linesOf(piecesOf(net)).cuts, key = (p) => f1(p[0] * 100) + ',' + f1(p[1] * 100), next = new Map(), where = new Map();
    const link = (a, b) => { if (!next.has(key(a))) next.set(key(a), []); next.get(key(a)).push(key(b)); where.set(key(a), a); };
    for (const [a, b] of cuts) { link(a, b); link(b, a); }
    if ([...next.values()].some((list) => list.length !== 2)) return null;
    const start = [...next.keys()].sort((p, q) => where.get(p)[1] - where.get(q)[1] || where.get(p)[0] - where.get(q)[0])[0], path = [start];
    let prev = start, cur = next.get(start)[0];
    while (cur !== start) { path.push(cur); const step = next.get(cur).find((x) => x !== prev); prev = cur; cur = step; if (path.length > 60) return null; }
    if (path.length !== next.size) return null;
    let ring = path.map((x) => where.get(x));
    // 화면에서 시계 반대 방향(왼쪽 아래로 먼저)으로 돌게 한다. y 가 아래로 커지므로 넓이의 부호가 반대다.
    if (area2(ring) > 0) ring = [ring[0]].concat(ring.slice(1).reverse());
    return ring;
  }
  // 테두리의 선분들(자른 모서리): { a, b: 두 끝의 번호(ring 에서), name, edge: 접었을 때의 모서리, at: 두 끝의 자리, len }
  function cutsOf(net, ring) {
    const fm = foldMap(net), n = ring.length;
    return ring.map((p, i) => { const j = (i + 1) % n, q = ring[j]; return { a: i, b: j, name: [POINTS[i], POINTS[j]].sort((x, y) => POINTS.indexOf(x) - POINTS.indexOf(y)).join(''), edge: [fm.at(p), fm.at(q)].sort().join('-'), at: [p, q], len: dist2(p, q) }; });
  }
  const boundsOf = (pieces) => { const xs = [], ys = []; pieces.forEach((pc) => pc.pts.forEach((p) => { xs.push(p[0]); ys.push(p[1]); })); const x = Math.min(...xs), y = Math.min(...ys); return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y }; };
  // 전개도 그림. o: { unit: 1 cm 의 크기(px), most: [너비, 높이]의 한도(px), grid: 모눈을 깐다(한 칸 1 cm), faceText: [면마다 글](piecesOf 차례), tint: { 면 번호: 빛깔 },
  //   names: 테두리의 점 이름(outlineOf 차례), lens: [{ a, b, text }](선분 옆에 적는 글), ghosts: [{ pts, text }](붙일 자리 후보), label }
  function netArt(net, o) {
    const opt = o || {}, most = opt.most || [286, 250], pieces = piecesOf(net), all = pieces.concat((opt.ghosts || []).map((g) => ({ pts: g.pts }))), box = boundsOf(all);
    let u = opt.unit || Math.min(most[0] / box.w, most[1] / box.h), cv = netCanvas(net, pieces, opt, u, box);
    for (let k = 0; k < 3; k += 1) {
      const [w, h] = cv.size();
      if (w + 10 <= most[0] && h + 10 <= most[1]) break;
      u = Math.min(u, (most[0] - 10 - (w - box.w * u)) / box.w, (most[1] - 10 - (h - box.h * u)) / box.h); cv = netCanvas(net, pieces, opt, u, box);
    }
    netArt.tidy = !cv.far;
    return cv.out(opt.label || '전개도', opt.names ? 5 : 4);
  }
  function netCanvas(net, pieces, opt, u, box) {
    const gx = opt.grid ? Math.floor(box.x + 1e-6) : box.x, gy = opt.grid ? Math.floor(box.y + 1e-6) : box.y, at = (p) => [(p[0] - gx) * u, (p[1] - gy) * u], cv = canvas(), taken = [];
    const inside = (c) => pieces.some((pc) => insidePoly(pc.pts.map(at), c[0], c[1]));
    pieces.forEach((pc) => pc.pts.forEach((p) => cv.point(at(p))));
    if (opt.grid) {
      const cols = Math.ceil(box.x + box.w - 1e-6) - gx, rows = Math.ceil(box.y + box.h - 1e-6) - gy;
      cv.point([0, 0]); cv.point([cols * u, rows * u]);
      for (let x = 0; x <= cols; x += 1) cv.add('<line class="mb-gridline" x1="' + f1(x * u) + '" y1="0" x2="' + f1(x * u) + '" y2="' + f1(rows * u) + '"/>');
      for (let y = 0; y <= rows; y += 1) cv.add('<line class="mb-gridline" x1="0" y1="' + f1(y * u) + '" x2="' + f1(cols * u) + '" y2="' + f1(y * u) + '"/>');
    }
    pieces.forEach((pc, i) => cv.add(fill(pc.pts.map(at), (opt.tint && opt.tint[i]) || (opt.grid ? 'rgba(251,191,36,0.3)' : CREAM))));
    (opt.ghosts || []).forEach((g) => {
      const c = g.pts.map(at); c.forEach(cv.point);
      cv.add('<polygon points="' + ptsOf(c) + '" style="fill:rgba(96,165,250,0.16);stroke:#2563eb;stroke-width:1.2;stroke-dasharray:2 3"/>' + word(centre(c), g.text));
    });
    // 맞닿은 곳은 접는 선(점선), 테두리는 자르는 선(실선)
    const lines = linesOf(pieces), walls = lines.folds.concat(lines.cuts).map(([a, b]) => [at(a), at(b)]);
    lines.folds.forEach(([a, b]) => cv.add(stroke(at(a), at(b), 'dash')));
    lines.cuts.forEach(([a, b]) => cv.add(stroke(at(a), at(b))));
    const put = (c, text, kind, hw, hh) => { cv.add(word(c, text, kind)); cv.box(c, hw, hh); taken.push({ c, hw, hh }); };
    (opt.faceText || []).forEach((text, i) => { if (text != null && pieces[i]) put(centre(pieces[i].pts.map(at)), text, '', 7, 7.5); });
    if (opt.names) (outlineOf(net) || []).forEach((p, i) => put(nameSpot(at(p), walls, taken, inside), opt.names[i], '', 6.5, 7));
    const mid = [(box.x + box.w / 2 - gx) * u, (box.y + box.h / 2 - gy) * u];
    (opt.lens || []).forEach((item) => { const s = lengthSpot(at(item.a), at(item.b), item.text, mid, walls, taken, inside); if (!s.tidy) cv.far = true; put(s.c, item.text, 'is-length', s.hw, s.hh); });
    return cv;
  }

  // 6-1-2b.js, 6-1-2c.js 가 같은 도구를 쓴다(이 파일이 먼저 불린다).
  B.kit.solid612 = { TAGS, MARKS, POINTS, cm, fixed, NUM, gon, prismName, pyramidName, PRISM, PYRAMID, PRISM_EXPR, PYRAMID_EXPR, PART, PARTS, setOptions, say, pickWord,
    canvas, stroke, fill, word, wide, tiles, ptsOf, f1, CREAM, YELLOW, BLUE, BOLD, RAD, dist2, near, r6, regular, regularSide, triangle, ccw, centre, turn2, sidesOf, angleAt, overlap2,
    sub3, add3, mul3, dot3, unit3, avg3, facePts, normalOf, edgesOf, edgeKey, isRectFace, parallelFaces, shifted, basePairs, isPrism, pyramidBases, isPyramid, hasParallel, hasTwin,
    ringSolid, tipSolid, arrange, settle, UP, SIDE, upPrism, upPyramid, upFrustum, lyingPrism, faceName, faceSaid, edgeName, draw, seenFaces, seenEdges, roundPillar, roundCone, flatShape, roundShape,
    netOf, rectPts, piecesOf, judge, isNet, WHY, whyText, cloneNet, drawable, FAKE, foldMap, linesOf, outlineOf, cutsOf, boundsOf, netArt };

  B.addUnit({
    id: '6-1-2', grade: 6, semester: 1, no: 2, title: '각기둥과 각뿔', version: 1,
    groups: [
      { id: 'prism', title: '각기둥', standard: SOLID, types: [] },
      { id: 'pname', title: '각기둥의 이름과 구성 요소', standard: SOLID, types: [] },
      { id: 'net', title: '각기둥의 전개도', standard: NET, types: [] },
      { id: 'fold', title: '전개도를 접었을 때', standard: NET, types: [] },
      { id: 'pyramid', title: '각뿔', standard: SOLID, types: [] },
      { id: 'yname', title: '각뿔의 이름과 구성 요소', standard: SOLID, types: [] },
      { id: 'both', title: '각기둥과 각뿔', standard: SOLID, types: [] }
    ]
  });

  // ── 문제에 쓰는 도형 ─────────────────────────────────────────
  // 그림의 얼개에서 센 면, 모서리, 꼭짓점의 수
  const countsOf = (solid) => ({ face: solid.faces.length, edge: edgesOf(solid).length, vert: solid.verts.length });
  const shapeWord = (pts) => (pts.length === 3 ? '삼각형' : pts.length === 4 ? (isRectFace(pts) ? '직사각형' : '사각형') : gon(pts.length));
  // 그림 설명: 면의 모양과 수를 적는다.
  function describe(solid) {
    const tally = new Map();
    solid.faces.forEach((_, f) => { const k = shapeWord(facePts(solid, f)); tally.set(k, (tally.get(k) || 0) + 1); });
    return [...tally].map(([k, c]) => `${k} 모양의 면 ${c}개`).join('와 ') + '로 둘러싸인 입체도형';
  }
  const HEIGHTS = [1.7, 1.9, 2.1], TILE = [78, 74];
  // 밑면이 정다각형인 세운 각기둥·각뿔
  const prismOf = (d, n) => upPrism(regular(n, 1, 0), d.pick(HEIGHTS), d.bool());
  const pyramidOf = (d, n) => upPyramid(regular(n, 1, 0), d.pick([2, 2.2, 2.4]), d.bool());
  // 가리기 문항의 도형 하나. 성질은 꼭짓점의 자리로 판정한다: prism(각기둥), pyramid(각뿔), poly(모든 면이 다각형), parallel(서로 평행한 두 면이 있다), twin(서로 평행하고 합동인 두 면이 있다)
  const shapeItem = (solid, kind) => ({ kind, solid, prism: isPrism(solid), pyramid: isPyramid(solid), poly: true, parallel: hasParallel(solid), twin: hasTwin(solid), art: (size, o) => draw(solid, Object.assign({ size: size || TILE, label: describe(solid) }, o || {})) });
  const SHAPES = {
    prism: (d, n) => shapeItem(prismOf(d, n || d.pick([3, 5, 6])), 'prism'),
    box: (d) => { const [a, b, c] = d.pick([[2.2, 1.5, 1.3], [1.5, 1.5, 2.2], [2, 1.6, 1.8]]); return shapeItem(upPrism([[0, 0], [a, 0], [a, b], [0, b]], c, d.bool()), 'box'); },
    cube: (d) => shapeItem(upPrism([[0, 0], [1.7, 0], [1.7, 1.7], [0, 1.7]], 1.7, d.bool()), 'cube'),
    pyramid: (d, n) => shapeItem(pyramidOf(d, n || d.pick([3, 4, 5, 6])), 'pyramid'),
    // 위쪽 면이 아래쪽 면보다 작은 꼴(옆의 면이 사다리꼴)
    frustum: (d, n) => shapeItem(upFrustum(regular(n || d.pick([4, 5, 6]), 1, 0), 1.5, 0.55, d.bool()), 'frustum'),
    pillar: () => ({ kind: 'pillar', prism: false, pyramid: false, poly: false, parallel: true, twin: true, art: () => roundPillar() }),
    cone: () => ({ kind: 'cone', prism: false, pyramid: false, poly: false, parallel: false, twin: false, art: () => roundCone() })
  };
  const whyNotPrism = (it) => (!it.poly ? '다각형이 아닌 면이 있다' : !it.parallel ? '서로 평행한 두 면이 없다' : !it.twin ? '서로 평행한 두 면이 합동이 아니다' : '직사각형이 아닌 옆면이 있다');
  const whyNotPyramid = (it) => (it.kind === 'cone' ? '밑면이 다각형이 아니다' : it.kind === 'pillar' ? '굽은 면이 있고 뿔 모양이 아니다' : '옆으로 둘러싼 면이 삼각형이 아니다');
  // 납작한 도형들(평면도형)
  const FLATS = [
    () => flatShape(regular(3, 30, -90), '삼각형'), () => flatShape([[0, 0], [0, 40], [62, 40], [62, 0]], '직사각형'), () => flatShape(regular(5, 28, -90), '오각형'),
    () => flatShape(regular(6, 28, 0), '육각형'), () => roundShape(), () => flatShape([[10, 0], [0, 40], [60, 40], [46, 0]], '사다리꼴')
  ];
  // 밑면으로 쓸 다각형 하나(변이 n개, 길쭉하게 눌러 정다각형이 아니게 그린다)
  const basePolygon = (d, n) => flatShape(turn2(regular(n, 30, -90 + d.int(0, 40)).map(([x, y]) => [x * 1.2, y * 0.86]), d.int(0, 50)), `변이 ${n}개인 다각형`);
  // 이름 고르기의 보기: 맞는 이름 하나와 pool 에서 고른 다른 이름 셋
  function nameOptions(d, right, pool) {
    const wrong = [...new Set(pool)].filter((x) => x && x !== right), options = d.shuffle([right].concat(d.shuffle(wrong).slice(0, 3)));
    return { options, answer: options.indexOf(right), truth: options.map((o) => o === right) };
  }
  // 세운 기둥의 옆면의 번호(ringSolid): 윗면 0, 아랫면 1, 옆면 2…
  const sideFaces = (solid) => solid.faces.map((_, f) => f).slice(solid.rings);
  // 겨냥도에서 가장 넓게 보이는 옆면(글을 적기 좋다)
  function widestSide(solid) {
    const seen = seenFaces(solid), list = sideFaces(solid).filter((f) => seen[f]), wideOf = (f) => { const xs = facePts(solid, f).map((p) => p[0] + p[1] * (solid.dep || UP)[0]); return Math.max(...xs) - Math.min(...xs); };
    return list.sort((a, b) => wideOf(b) - wideOf(a))[0];
  }
  // 세운 기둥에 적는 길이: 밑면의 변마다(보이는 아래쪽 모서리, 가려졌으면 위쪽 모서리) 그 길이를, 가장 바깥쪽 옆 모서리에 높이를 적는다. which: 길이를 적을 밑면의 변의 번호들
  function prismLens(solid, which) {
    const n = solid.n, shown = new Set(seenEdges(solid)), len = (v, w) => Math.round(len3(sub3(solid.verts[v], solid.verts[w])) * 100) / 100, out = [];
    (which || solid.verts.slice(0, n).map((_, i) => i)).forEach((i) => { const j = (i + 1) % n, low = shown.has(edgeKey(i + n, j + n)); out.push(low ? [i + n, j + n, cm(len(i, j))] : [i, j, cm(len(i, j))]); });
    const xs = solid.verts.slice(0, n).map((p) => p[0]), far = xs.indexOf(Math.max(...xs));
    out.push([far, far + n, cm(len(far, far + n))]);
    return out;
  }
  Object.assign(B.kit.solid612, { countsOf, shapeWord, describe, HEIGHTS, TILE, prismOf, pyramidOf, shapeItem, SHAPES, whyNotPrism, whyNotPyramid, FLATS, basePolygon, nameOptions, sideFaces, widestSide, prismLens });

  // ── 각기둥 ───────────────────────────────────────────────────
  B.addTypes('6-1-2', 'prism', [
    T('prism-solid', '평면도형과 입체도형 가르기', '①2 ②2 ③2 심1', (d) => {
      const k = d.pick([2, 3]), solids = d.shuffle([SHAPES.prism(d), SHAPES.pyramid(d, d.pick([4, 5, 6])), SHAPES.pillar(), SHAPES.cone(), SHAPES.box(d)]).slice(0, k).map((it) => Object.assign(it, { deep: true }));
      const items = d.shuffle(solids.concat(d.shuffle(FLATS).slice(0, 5 - k).map((art) => ({ art })))), flags = items.map((it) => Boolean(it.deep)), made = setOptions(d, TAGS.slice(0, 5), flags);
      return C('입체도형을 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())),
        explain: `삼각형, 직사각형, 원처럼 종이 위에 납작하게 그려지는 도형은 평면도형이고, 면으로 둘러싸여 공간을 차지하는 도형은 입체도형이다. 입체도형은 ${TAGS.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels: TAGS.slice(0, 5), flags, options: made.sets } }
      });
    }),
    T('prism-word', '각기둥의 뜻', '①5 ②1 ③1', (d, n) => (n === 0
      ? pickWord(d, '두 면이 서로 평행하고 합동인 다각형이며, 나머지 면이 모두 직사각형인 입체도형을 무엇이라고 하는가?', '각기둥', ['각뿔', '다각형', '직사각형'], '서로 평행한 두 면이 합동인 다각형이고 옆으로 둘러싼 면이 모두 직사각형인 입체도형을 각기둥이라고 한다.')
      : pickWord(d, '각기둥의 두 밑면에 대한 설명으로 옳은 것은?', '서로 평행하고 합동이다.', ['서로 수직이고 합동이다.', '서로 평행하지만 크기가 다르다.', '한 모서리에서 만난다.'], '각기둥의 두 밑면은 서로 평행하고 합동인 다각형이다. 두 밑면은 만나지 않는다.')), { count: 2 }),
    T('prism-cond', '조건에 맞는 입체도형 고르기', '①3 심2', (d, n) => {
      // n = 0: 모든 면이 다각형인 것, 1: 서로 평행한 두 면이 있는 것, 2: 서로 평행하고 합동인 두 면이 있는 것. 조건을 하나씩 더해 가면 각기둥이 남는다.
      const key = ['poly', 'parallel', 'twin'][n], ask = ['모든 면이 다각형인', '서로 평행한 두 면이 있는', '서로 평행하고 합동인 두 면이 있는'][n];
      const items = d.until(() => d.shuffle([SHAPES.prism(d), SHAPES.pyramid(d), SHAPES.frustum(d), SHAPES.pillar(), SHAPES.cone(), SHAPES.prism(d, 4)]).slice(0, 5), (list) => { const hit = list.filter((it) => it[key]).length; return hit >= 2 && hit <= 3 && list.some((it) => it.kind === 'frustum'); });
      const flags = items.map((it) => it[key]), made = setOptions(d, TAGS.slice(0, 5), flags), miss = items.map((it, i) => (it[key] ? '' : TAGS[i])).filter(Boolean);
      const why = ['굽은 면은 다각형이 아니다.', '뿔 모양의 도형에는 서로 평행한 두 면이 없다.', '위쪽 면이 아래쪽 면보다 작은 도형은 서로 평행한 두 면이 있지만 그 두 면이 합동이 아니다. 뿔 모양의 도형에는 서로 평행한 두 면이 없다.'][n];
      return C(`${ask} 입체도형을 모두 고른 것은?`, made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())), explain: `${why} ${miss.join(', ')}는 조건에 맞지 않으므로 ${TAGS.filter((_, i) => flags[i]).join(', ')}를 고른다.`,
        facts: { sets: { labels: TAGS.slice(0, 5), flags, options: made.sets } }
      });
    }, { count: 3 }),
    T('prism-find', '여러 입체도형 가운데 각기둥 고르기', '①4 ②3 ③3 심1', (d) => {
      const others = d.shuffle([SHAPES.pyramid(d), SHAPES.frustum(d), SHAPES.pillar(), SHAPES.cone()]).slice(0, 3), ns = d.shuffle([3, 5, 6]);
      const items = d.shuffle([SHAPES.prism(d, ns[0]), d.bool() ? SHAPES.prism(d, ns[1]) : SHAPES.box(d)].concat(others)), flags = items.map((it) => it.prism), made = setOptions(d, TAGS.slice(0, 5), flags);
      return C('각기둥을 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())),
        explain: '서로 평행한 두 면이 합동인 다각형이고 나머지 면이 모두 직사각형인 입체도형이 각기둥이다. ' + items.map((it, i) => (it.prism ? '' : `${TAGS[i]}는 ${whyNotPrism(it)}. `)).join('') + `각기둥은 ${TAGS.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels: TAGS.slice(0, 5), flags, options: made.sets } }
      });
    }),
    T('prism-why-not', '각기둥이 아닌 까닭', '①6 ②4·5 ③4 심3', (d, n) => {
      // 까닭 쓰기를 까닭 고르기로 바꾸었다. 보기의 참·거짓은 도형의 성질로 따진다.
      const it = n === 0 ? SHAPES.frustum(d) : SHAPES.pillar();
      const rows = d.shuffle([['서로 평행한 두 면이 합동이 아니다.', it.parallel && !it.twin], ['서로 평행한 두 면이 없다.', !it.parallel], ['다각형이 아닌 면이 있다.', !it.poly], ['면이 모두 삼각형이다.', false]]);
      return C(n === 0 ? '다음 입체도형이 각기둥이 아닌 까닭으로 알맞은 것은?' : '다음 도형은 각기둥이 아니다. 그 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: it.art([112, 104]),
        explain: n === 0 ? '위와 아래의 두 면은 서로 평행한 다각형이지만 크기가 달라서 합동이 아니다. 각기둥은 서로 평행한 두 면이 합동이어야 한다.' : '위와 아래의 두 면은 서로 평행하고 합동이지만 원이라서 다각형이 아니고, 옆의 면도 굽은 면이다. 각기둥은 모든 면이 다각형이어야 한다.',
        facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { count: 2 }),
    T('prism-base-word', '밑면과 옆면의 뜻', '①7 ③1', (d, n) => (n === 0
      ? pickWord(d, '각기둥에서 서로 평행하고 합동인 두 면을 무엇이라고 하는가?', '밑면', ['옆면', '모서리', '높이'], '각기둥에서 서로 평행하고 합동인 두 면을 밑면이라고 하고, 두 밑면과 만나는 면을 옆면이라고 한다.')
      : pickWord(d, '각기둥에서 두 밑면과 만나는 면을 무엇이라고 하는가?', '옆면', ['밑면', '모서리', '꼭짓점'], '각기둥에서 두 밑면과 만나는 면을 옆면이라고 한다. 각기둥의 옆면은 모두 직사각형이다.')), { count: 2 }),
    T('prism-base-point', '그림에서 밑면과 옆면 찾기', '①7 ③5', (d) => {
      const solid = prismOf(d, d.pick([3, 5, 6])), side = widestSide(solid), swap = d.bool(), right = swap ? '옆면, 밑면' : '밑면, 옆면', options = d.shuffle(['밑면, 옆면', '옆면, 밑면', '밑면, 밑면', '옆면, 옆면']);
      return C('각기둥에서 ㉠, ㉡이 가리키는 면의 이름을 차례로 쓴 것은?', options, options.indexOf(right), {
        figure: draw(solid, { size: [128, 122], tint: { 0: YELLOW, [side]: BLUE }, faceText: { 0: swap ? '㉡' : '㉠', [side]: swap ? '㉠' : '㉡' }, label: `각기둥의 겨냥도. 위쪽의 면에 ${swap ? '㉡' : '㉠'}, 옆쪽의 면에 ${swap ? '㉠' : '㉡'}을 적었다.` }),
        explain: `${swap ? '㉡' : '㉠'}이 적힌 면은 마주 보는 아래쪽 면과 서로 평행하고 합동이므로 밑면이다. ${swap ? '㉠' : '㉡'}이 적힌 면은 두 밑면과 만나는 직사각형 모양의 면이므로 옆면이다.`,
        facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('prism-base-shaded', '밑면을 바르게 색칠한 것', '①8·9 ②6 ③6', (d) => {
      // 밑면 색칠하기를 바르게 색칠한 그림 고르기로 바꾸었다. 색칠한 두 면이 밑면인지는 도형의 얼개로 따진다(basePairs).
      const n = d.pick([3, 5, 6]), solid = prismOf(d, n), sides = d.shuffle(sideFaces(solid)), pairs = d.shuffle([[0, 1], [sides[0], sides[1]], [0, sides[2]], [1, sides[0]]]);
      const bases = basePairs(solid), ok = (p) => bases.some((b) => b.includes(p[0]) && b.includes(p[1])), at = pairs.findIndex(ok);
      return C('각기둥의 두 밑면을 바르게 색칠한 것은?', TAGS.slice(0, 4), at, {
        figure: tiles(pairs.map((p) => draw(solid, { size: TILE, tint: { [p[0]]: YELLOW, [p[1]]: YELLOW }, label: '두 면을 색칠한 각기둥' }))),
        explain: `각기둥의 밑면은 서로 평행하고 합동인 두 면이다. ${TAGS[at]}는 서로 평행한 ${gon(n)} 모양의 두 면을 색칠했다. 나머지는 직사각형 모양의 옆면을 색칠했다.`,
        facts: { kindPick: { kinds: pairs.map((p, i) => (ok(p) ? 'base' : 'no' + i)), target: 'base' } }
      });
    }),
    T('prism-other-base', '다른 밑면 찾기', '①10 ②8 ③7', (d) => {
      const solid = prismOf(d, d.pick([3, 5])), f = d.pick([0, 1]), g = basePairs(solid)[0].find((x) => x !== f), rows = d.shuffle([g].concat(d.shuffle(sideFaces(solid)).slice(0, 3)));
      return C(`각기둥에서 ${faceSaid(solid, f)}이 한 밑면일 때 다른 밑면은?`, rows.map((x) => faceSaid(solid, x)), rows.indexOf(g), {
        figure: draw(solid, { size: [128, 122], names: true, label: '꼭짓점에 이름을 붙인 각기둥의 겨냥도' }),
        explain: `각기둥의 두 밑면은 서로 평행하고 합동이다. ${faceSaid(solid, f)}과 평행하고 합동인 면은 ${faceSaid(solid, g)}이다. 나머지 면은 직사각형 모양의 옆면이다.`,
        facts: { truth: rows.map((x) => x === g), want: true }
      });
    }),
    T('prism-side-names', '옆면을 면의 이름으로 찾기', '①11 ②7 ③7 심7', (d) => {
      // 다섯 면을 모두 보기에 올린다(옆면이 셋뿐인 삼각기둥). 「모두 고른 것」이 그 도형의 옆면 전부가 되게 한다.
      const solid = prismOf(d, 3), picks = d.shuffle(solid.faces.map((_, f) => f)), labels = picks.map((f) => faceSaid(solid, f)), flags = picks.map((f) => !basePairs(solid)[0].includes(f)), made = setOptions(d, labels, flags);
      return C('각기둥의 옆면을 모두 고른 것은?', made.options, made.answer, {
        figure: draw(solid, { size: [128, 122], names: true, label: '꼭짓점에 이름을 붙인 각기둥의 겨냥도' }),
        explain: `서로 평행하고 합동인 ${faceSaid(solid, 0)}과 ${faceSaid(solid, 1)}이 밑면이고, 두 밑면과 만나는 직사각형 모양의 면이 옆면이다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('prism-face-count', '밑면과 옆면의 수', '①12 ②9 ③8 심9', (d) => {
      const n = d.int(3, 8), solid = prismOf(d, n), bases = basePairs(solid)[0].length;
      return M('각기둥의 밑면과 옆면은 각각 몇 개인가?', [{ label: '밑면', answer: bases, unit: '개' }, { label: '옆면', answer: solid.faces.length - bases, unit: '개' }], {
        figure: draw(solid, { size: [128, 122], label: '각기둥의 겨냥도' }),
        explain: `서로 평행하고 합동인 두 면이 밑면이므로 밑면은 2개이다. 밑면이 ${gon(n)}이므로 두 밑면과 만나는 옆면은 ${n}개이다. 점선으로 그린 모서리에 둘러싸인 보이지 않는 면까지 센다.`,
        facts: { calc: [['2', 0], [String(n), 1]], unseen: [2, n] }
      });
    }),
    T('prism-shapes', '밑면과 옆면의 모양', '①12 ②12·13 ③10 심11', (d, k) => {
      if (k === 0) return pickWord(d, '각기둥의 옆면은 모두 어떤 도형인가?', '직사각형', ['삼각형', '오각형', '원'], '각기둥의 옆면은 두 밑면과 수직으로 만나는 면이고, 모두 직사각형이다.');
      if (k === 1) return pickWord(d, '각기둥에서 밑면과 옆면은 서로 어떻게 만나는가?', '수직으로 만난다.', ['서로 평행하다.', '만나지 않는다.', '한 점에서만 만난다.'], '각기둥의 옆면은 두 밑면과 수직으로 만난다. 서로 평행한 것은 두 밑면이다.');
      const n = d.pick([3, 5, 6, 7, 8]), solid = prismOf(d, n), right = `${gon(n)}, 직사각형`, options = d.shuffle([right, `직사각형, ${gon(n)}`, `${gon(n)}, 삼각형`, `${gon(n + 1)}, 직사각형`]);
      return C('각기둥의 밑면의 모양과 옆면의 모양을 차례로 쓴 것은?', options, options.indexOf(right), {
        figure: draw(solid, { size: [128, 122], label: '각기둥의 겨냥도' }), explain: `서로 평행하고 합동인 두 면이 밑면이고, 그 모양은 ${gon(n)}이다. 옆면은 모두 직사각형이다.`,
        facts: { truth: options.map((o) => o === right), want: true }
      });
    }, { count: 3 }),
    T('prism-perp-count', '밑면과 수직으로 만나는 면의 수', '①13 ②10 ③8 심9', (d) => {
      const n = d.int(3, 8), solid = prismOf(d, n);
      return N('각기둥에서 밑면과 수직으로 만나는 면은 모두 몇 개인가?', sideFaces(solid).length, {
        unit: '개', figure: draw(solid, { size: [128, 122], label: '각기둥의 겨냥도' }),
        explain: `각기둥에서 밑면과 수직으로 만나는 면은 옆면이다. 밑면이 ${gon(n)}이므로 옆면은 ${n}개이다.`, facts: { calc: [[String(n), 0]], unseen: [n] }
      });
    }),
    T('prism-perp-most', '밑면과 수직으로 만나는 면이 가장 많은 각기둥', '②10 심10', (d) => {
      const ns = d.shuffle([3, 4, 5, 6, 7, 8]).slice(0, 4), at = ns.indexOf(Math.max(...ns));
      return C('밑면과 수직으로 만나는 면이 가장 많은 각기둥은?', TAGS.slice(0, 4), at, {
        figure: tiles(ns.map((n) => draw(prismOf(d, n), { size: TILE, label: '각기둥의 겨냥도' }))),
        explain: `밑면과 수직으로 만나는 면은 옆면이고, 옆면의 수는 한 밑면의 변의 수와 같다. ${TAGS[at]}는 밑면이 ${gon(ns[at])}이라서 옆면이 ${ns[at]}개로 가장 많다.`,
        facts: { rank: { values: ns, nth: 1 } }
      });
    }),
    T('prism-say', '각기둥에 대한 설명', '①14 ②54 ③9 심25', (d, n) => say(d, n === 0 ? '각기둥에 대한 설명으로 옳지 않은 것은?' : '각기둥에 대한 설명으로 옳은 것은?',
      ['두 밑면은 서로 평행하다.', '두 밑면은 합동인 다각형이다.', '옆면은 모두 직사각형이다.', '밑면과 옆면은 서로 수직으로 만난다.', '옆면의 수는 한 밑면의 변의 수와 같다.'],
      [['밑면과 옆면은 서로 평행하다.', '밑면과 옆면은 서로 수직으로 만난다.'], ['옆면은 모두 삼각형이다.', '각기둥의 옆면은 모두 직사각형이다.'], ['두 밑면은 서로 수직으로 만난다.', '두 밑면은 서로 평행하여 만나지 않는다.'],
        ['밑면의 모양은 언제나 직사각형이다.', '밑면은 삼각형, 오각형처럼 여러 가지 다각형이 될 수 있다.'], ['밑면은 언제나 바닥에 닿은 면이다.', '각기둥을 눕혀 놓으면 밑면이 바닥에 닿지 않는다.'],
        ['각기둥의 이름은 옆면의 모양에 따라 정해진다.', '각기둥의 이름은 밑면의 모양에 따라 정해진다.'], ['두 밑면은 모양은 같지만 크기가 다를 수 있다.', '두 밑면은 합동이므로 모양과 크기가 모두 같다.']],
      n === 1, n === 1 ? '각기둥은 서로 평행한 두 밑면이 합동인 다각형이고, 옆면이 모두 직사각형인 입체도형이다.' : '각기둥은 서로 평행한 두 밑면이 합동인 다각형이고, 옆면은 모두 밑면과 수직으로 만나는 직사각형이다.'), { count: 2 })
  ]);

  // ── 각기둥의 이름과 구성 요소 ────────────────────────────────
  B.addTypes('6-1-2', 'pname', [
    T('pname-name', '겨냥도를 보고 각기둥의 이름 쓰기', '①15 ②14 ③11 심14', (d) => {
      const n = d.int(3, 8), made = nameOptions(d, prismName(n), [pyramidName(n), prismName(n === 4 ? 6 : 4), prismName(n + 2), prismName(n * 2), prismName(n + 1)]);
      return C('각기둥의 이름은?', made.options, made.answer, {
        figure: draw(prismOf(d, n), { size: [128, 122], label: '각기둥의 겨냥도' }), explain: `각기둥의 이름은 밑면의 모양에 따라 정해진다. 밑면의 모양이 ${gon(n)}이므로 ${prismName(n)}이다.`, facts: { truth: made.truth, want: true }
      });
    }),
    T('pname-pick', '이름에 맞는 각기둥 고르기', '②15 ③11·12', (d) => {
      const n = d.pick([4, 5, 6, 7]), items = d.shuffle([['ok', prismOf(d, n)], ['less', prismOf(d, n - 1)], ['more', prismOf(d, n + 1)], ['pyramid', pyramidOf(d, n)]]), at = items.findIndex((it) => it[0] === 'ok');
      return C(`다음 가운데 ${josa(prismName(n), '은/는')}?`, TAGS.slice(0, 4), at, {
        figure: tiles(items.map((it) => draw(it[1], { size: TILE, label: describe(it[1]) }))),
        explain: `${josa(prismName(n), '은/는')} 밑면의 모양이 ${gon(n)}인 각기둥이다. ${TAGS[at]}는 서로 평행한 두 밑면이 ${gon(n)}이고 옆면이 모두 직사각형이다.`,
        facts: { kindPick: { kinds: items.map((it) => it[0]), target: 'ok' } }
      });
    }),
    T('pname-rule-word', '이름을 정하는 면', '①15 ①50', (d) => pickWord(d, '각기둥과 각뿔의 이름은 어느 면의 모양에 따라 정해지는가?', '밑면', ['옆면', '가장 넓은 면', '앞에서 보이는 면'], '각기둥과 각뿔의 이름은 밑면의 모양에 따라 정해진다. 밑면이 오각형인 각기둥은 오각기둥, 밑면이 오각형인 각뿔은 오각뿔이다.')),
    T('pname-part-word', '모서리, 꼭짓점, 높이의 뜻', '①16 ③14', (d, n) => {
      if (n === 0) return pickWord(d, '각기둥에서 두 밑면 사이의 거리를 무엇이라고 하는가?', '높이', ['모서리', '꼭짓점', '옆면'], '각기둥에서 두 밑면 사이의 거리를 높이라고 한다. 높이는 두 밑면을 잇는 모서리의 길이와 같다.');
      const [said, want, call, more] = d.pick([['면과 면이 만나는 선분', '모서리', '모서리라고', '모서리와 모서리가 만나는 점은 꼭짓점이다.'], ['모서리와 모서리가 만나는 점', '꼭짓점', '꼭짓점이라고', '면과 면이 만나는 선분은 모서리이다.']]);
      return pickWord(d, `각기둥에서 ${josa(said, '을/를')} 무엇이라고 하는가?`, want, ['모서리', '꼭짓점'].filter((w) => w !== want).concat(['높이', '밑면']), `각기둥에서 ${josa(said, '을/를')} ${call} 한다. ${more}`);
    }, { count: 2 }),
    T('pname-point', '그림에서 모서리, 꼭짓점, 높이 찾기', '①17 ②18 ③14 심22', (d) => {
      // 굵게 그은 선분(모서리), 큰 점(꼭짓점), 기둥 옆에 나란히 그은 가는 선(높이)이 서로 떨어져 있게 놓는다.
      const WORDS = ['모서리', '꼭짓점', '높이'], order = d.shuffle(WORDS), mark = (w) => MARKS[order.indexOf(w)], n = d.pick([3, 5, 6]), solid = prismOf(d, n), h = solid.verts[0][2];
      const tops = solid.verts.slice(0, n), ys = tops.map((p, i) => p[1] + tops[(i + 1) % n][1]), e = ys.indexOf(Math.max(...ys)), xs = tops.map((p) => p[0]), far = xs.indexOf(Math.max(...xs)), [x, y] = tops[far], gap = 0.42;
      const front = tops.map((p) => p[1]), v = n + front.indexOf(Math.min(...front));
      const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => WORDS[i]).join(', ')), right = order.join(', '), options = d.shuffle([right].concat(d.shuffle(perms.filter((p) => p !== right)).slice(0, 3)));
      return C('각기둥에서 ㉠, ㉡, ㉢이 가리키는 부분의 이름을 차례로 쓴 것은?', options, options.indexOf(right), {
        figure: draw(solid, { size: [112, 118], bold: [edgeKey(e, (e + 1) % n)], lens: [[e, (e + 1) % n, mark('모서리')]], dots: [v], names: { [v]: mark('꼭짓점') },
          marks: [{ a: [x + gap, y, 0], b: [x + gap, y, h], kind: 'thin', text: mark('높이') }, { a: [x + gap - 0.1, y, 0], b: [x + gap + 0.1, y, 0], kind: 'thin' }, { a: [x + gap - 0.1, y, h], b: [x + gap + 0.1, y, h], kind: 'thin' }],
          label: `각기둥의 겨냥도. ${mark('모서리')}은 굵게 그은 선분, ${mark('꼭짓점')}은 큰 점, ${mark('높이')}은 두 밑면 사이의 거리를 가리킨다.` }),
        explain: `${mark('모서리')}은 면과 면이 만나는 선분이므로 모서리, ${mark('꼭짓점')}은 모서리와 모서리가 만나는 점이므로 꼭짓점, ${mark('높이')}은 두 밑면 사이의 거리이므로 높이이다.`,
        facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('pname-height', '각기둥의 높이 읽기', '①18 ②20 ③16 심23', (d, n) => {
      // 길이가 적힌 그림에서 높이를 읽는다. 그림은 적힌 길이의 비율대로 그린다. n = 1 은 눕혀 놓은 각기둥(색칠한 면이 밑면이라고 알려 준다).
      const [a, b, c] = d.pick([[5, 6, 7], [4, 5, 6], [6, 7, 8], [5, 5, 6], [6, 8, 10], [5, 7, 8]]), h = d.until(() => d.int(8, 14), (v) => ![a, b, c].includes(v));
      if (n === 1) {
        // 앞쪽 삼각형의 오른쪽 변은 그림 안쪽에 놓이므로 길이를 적지 않는다(글이 면 위에 겹친다).
        const solid = lyingPrism(triangle(a, b, c), h), figure = draw(solid, { size: [176, 118], tint: { 0: YELLOW }, lens: [[0, 1, cm(a)], [2, 0, cm(c)], [1, 4, cm(h)]], label: `눕혀 놓은 각기둥의 겨냥도. 색칠한 삼각형 모양의 면의 두 변 ${a} cm, ${c} cm, 두 삼각형 모양의 면을 잇는 모서리 ${h} cm` });
        return N('색칠한 면이 한 밑면일 때, 각기둥의 높이는 몇 cm인가?', h, {
          unit: 'cm', figure, explain: `각기둥의 높이는 두 밑면 사이의 거리이다. 색칠한 면과 그 면에 평행한 뒤쪽 면이 밑면이므로, 두 밑면을 잇는 모서리의 길이 ${h} cm가 높이이다. ${a} cm, ${c} cm는 밑면의 변의 길이이다.`, facts: { calc: [[String(h), 0]] }
        });
      }
      const solid = upPrism(triangle(a, b, c), h, d.bool());
      return N('각기둥의 높이는 몇 cm인가?', h, {
        unit: 'cm', figure: draw(solid, { size: [112, 132], lens: prismLens(solid), label: `각기둥의 겨냥도. 밑면의 세 변 ${a} cm, ${b} cm, ${c} cm, 두 밑면을 잇는 모서리 ${h} cm` }),
        explain: `각기둥의 높이는 두 밑면 사이의 거리이고, 두 밑면을 잇는 모서리의 길이와 같다. 높이는 ${h} cm이다. ${a} cm, ${b} cm, ${c} cm는 밑면의 변의 길이이다.`, facts: { calc: [[String(h), 0]] }
      });
    }, { count: 2 }),
    T('pname-height-edges', '높이를 잴 수 있는 모서리', '①19 ②23 ③15 심23', (d, k) => {
      if (k === 1) {
        const n = d.pick([3, 5, 6, 7, 8]), solid = prismOf(d, n), count = edgesOf(solid).filter((e) => e.faces.every((f) => f >= 2)).length;
        return N('각기둥에서 높이를 잴 수 있는 모서리는 모두 몇 개인가?', count, {
          unit: '개', figure: draw(solid, { size: [128, 122], label: '각기둥의 겨냥도' }), explain: `각기둥의 높이는 두 밑면 사이의 거리이므로 두 밑면을 잇는 모서리의 길이를 재면 된다. 밑면이 ${gon(n)}이므로 두 밑면을 잇는 모서리는 ${n}개이다.`, facts: { calc: [[String(n), 0]], unseen: [n] }
        });
      }
      // 두 밑면을 잇는 모서리 셋을 모두 보기에 올린다(삼각기둥).
      const solid = prismOf(d, 3), E = edgesOf(solid), up = E.filter((e) => e.faces.every((f) => f >= 2)), flat = E.filter((e) => !e.faces.every((f) => f >= 2));
      const picks = d.shuffle(up.concat(d.shuffle(flat).slice(0, 2))), labels = picks.map((e) => '모서리 ' + edgeName(solid, e.key)), flags = picks.map((e) => up.includes(e)), made = setOptions(d, labels, flags);
      return C('각기둥의 높이를 잴 수 있는 모서리를 모두 고른 것은?', made.options, made.answer, {
        figure: draw(solid, { size: [128, 122], names: true, label: '꼭짓점에 이름을 붙인 각기둥의 겨냥도' }),
        explain: `각기둥의 높이는 두 밑면 사이의 거리이다. 두 밑면을 잇는 ${labels.filter((_, i) => flags[i]).join(', ')}의 길이가 높이와 같다. 나머지는 밑면의 변이다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('pname-count-fig', '그림을 보고 각기둥의 면, 모서리, 꼭짓점의 수 세기', '①20 ②24 ③31', (d) => {
      const n = d.int(3, 8), solid = prismOf(d, n), c = countsOf(solid);
      return M('각기둥의 면, 모서리, 꼭짓점은 각각 몇 개인가?', PARTS.map((p) => ({ label: PART[p], answer: c[p], unit: '개' })), {
        figure: draw(solid, { size: [128, 122], label: '각기둥의 겨냥도' }),
        explain: `밑면이 ${gon(n)}인 ${prismName(n)}이다. 면은 밑면 2개와 옆면 ${n}개로 ${c.face}개, 모서리는 두 밑면에 ${n}개씩과 옆에 ${n}개로 ${c.edge}개, 꼭짓점은 두 밑면에 ${n}개씩 ${c.vert}개이다. 점선으로 그린 보이지 않는 부분까지 센다.`,
        facts: { calc: PARTS.map((p, i) => [PRISM_EXPR[p](n), i]), unseen: [n, 2, 3] }
      });
    }),
    T('pname-count-name', '이름만 듣고 각기둥의 면, 모서리, 꼭짓점의 수 구하기', '①21 ②26 ③32 심31·32', (d) => {
      const n = d.int(9, 12);
      return M(`${prismName(n)}의 면, 모서리, 꼭짓점은 각각 몇 개인가?`, PARTS.map((p) => ({ label: PART[p], answer: PRISM[p](n), unit: '개' })), {
        explain: `${prismName(n)}의 한 밑면의 변은 ${n}개이다. 면의 수는 ${n} + 2 = ${n + 2}, 모서리의 수는 ${n} × 3 = ${n * 3}, 꼭짓점의 수는 ${n} × 2 = ${n * 2}이다.`,
        facts: { calc: PARTS.map((p, i) => [PRISM_EXPR[p](n), i]), unseen: [n, 2, 3] }
      });
    }),
    T('pname-rule', '각기둥의 면, 모서리, 꼭짓점의 수의 규칙', '①22 ②28 ③33', () => M('각기둥의 면, 모서리, 꼭짓점의 수를 한 밑면의 변의 수로 나타내었다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: '㉠', answer: 2 }, { label: '㉡', answer: 3 }, { label: '㉢', answer: 2 }], {
      // 휴대폰 너비에서 한 줄에 들어가게 글씨를 조금 줄인다.
      figure: B.kit.lines(['(면의 수) = (한 밑면의 변의 수) + ㉠', '(모서리의 수) = (한 밑면의 변의 수) × ㉡', '(꼭짓점의 수) = (한 밑면의 변의 수) × ㉢']).replace('class="mb-lines"', 'class="mb-lines" style="font-size:1rem"'),
      explain: '면은 옆면이 한 밑면의 변의 수만큼 있고 밑면이 2개 더 있다. 모서리는 두 밑면에 변의 수만큼씩 있고 두 밑면을 잇는 모서리가 변의 수만큼 있으므로 3배이다. 꼭짓점은 두 밑면에 변의 수만큼씩 있으므로 2배이다.', facts: fixed(2, 3, 2)
    })),
    T('pname-back-name', '수를 듣고 각기둥의 이름 찾기', '①23 ②33 ③37 심19', (d, k) => {
      const part = PARTS[k], n = d.int(5, 10), cnt = PRISM[part](n);
      const made = nameOptions(d, prismName(n), [cnt, cnt - 2, cnt / 2, cnt / 3, cnt - 1, n + 1, n - 1].filter((x) => Number.isInteger(x) && x >= 3 && x <= 20 && x !== n).map(prismName));
      const how = { face: `각기둥의 면의 수는 한 밑면의 변의 수보다 2 큰 수이다. ${cnt} − 2 = ${n}`, edge: `각기둥의 모서리의 수는 한 밑면의 변의 수의 3배이다. ${cnt} ÷ 3 = ${n}`, vert: `각기둥의 꼭짓점의 수는 한 밑면의 변의 수의 2배이다. ${cnt} ÷ 2 = ${n}` }[part];
      return C(`${josa(PART[part], '이/가')} ${cnt}개인 각기둥의 이름은?`, made.options, made.answer, { explain: `${how}이므로 밑면이 ${gon(n)}인 ${prismName(n)}이다.`, facts: { truth: made.truth, want: true } });
    }, { count: 3 }),
    T('pname-say-count', '수가 들어간 각기둥의 설명', '①25 ②56 ③43 심34', (d) => {
      const n = d.int(3, 8), bad = d.int(0, 3), value = { 옆면: n, 면: n + 2, 모서리: n * 3, 꼭짓점: n * 2 };
      const rows = [['옆면', `${n}`, n + 2], ['면', `${n}+2`, n + 1], ['모서리', `${n}*3`, n * 2], ['꼭짓점', `${n}*2`, n * 3]].map(([part, expr, wrong], i) => ({ part, expr, said: i === bad ? wrong : value[part] }));
      const list = d.shuffle(rows), at = list.indexOf(rows[bad]);
      return C(`${prismName(n)}에 대한 설명으로 옳지 않은 것은?`, list.map((r) => `${josa(r.part, '은/는')} ${r.said}개이다.`), at, {
        explain: `${josa(prismName(n), '은/는')} 한 밑면의 변이 ${n}개이므로 옆면은 ${n}개, 면은 ${n + 2}개, 모서리는 ${n * 3}개, 꼭짓점은 ${n * 2}개이다. ${josa(rows[bad].part, '은/는')} ${rows[bad].said}개가 아니라 ${value[rows[bad].part]}개이다.`,
        facts: { claimed: list.map((r) => [r.expr, r.said]), claimedWant: false }
      });
    }),
    T('pname-order', '각기둥의 면, 모서리, 꼭짓점의 수 비교', '②31 ③41', (d) => {
      const right = '모서리, 꼭짓점, 면', options = d.shuffle([right, '모서리, 면, 꼭짓점', '꼭짓점, 모서리, 면', '면, 꼭짓점, 모서리']), n = d.int(4, 8);
      return C(`${prismName(n)}의 면, 모서리, 꼭짓점을 수가 많은 것부터 차례로 쓴 것은?`, options, options.indexOf(right), {
        explain: `${prismName(n)}의 모서리는 ${n * 3}개, 꼭짓점은 ${n * 2}개, 면은 ${n + 2}개이다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('pname-model', '꼭짓점과 모서리로 각기둥 모양 만들기', '①16 심37', (d) => {
      const n = d.int(3, 8), c = countsOf(prismOf(d, n));
      return M(`고무찰흙을 꼭짓점으로, 막대를 모서리로 하여 ${prismName(n)} 모양을 만들려고 한다. 고무찰흙과 막대는 각각 몇 개 필요한가?`, [{ label: '고무찰흙', answer: c.vert, unit: '개' }, { label: '막대', answer: c.edge, unit: '개' }], {
        explain: `${prismName(n)}의 꼭짓점은 ${n} × 2 = ${n * 2}(개)이고 모서리는 ${n} × 3 = ${n * 3}(개)이다. 고무찰흙은 꼭짓점의 수만큼, 막대는 모서리의 수만큼 필요하다.`,
        facts: { calc: [[PRISM_EXPR.vert(n), 0], [PRISM_EXPR.edge(n), 1]], unseen: [n, 2, 3] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
