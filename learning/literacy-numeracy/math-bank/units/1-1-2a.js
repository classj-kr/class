// 1학년 1학기 2단원 여러 가지 모양 — 단원 틀, 그림 도구, 기본 문항(같은 모양 찾기, 모양의 특징).
// 수집해 둔 국정 교과서 평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 43꼴, 심화꼴: 38꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭) / 미룸」을 가른 대조표는 references/textbooks/수학/_분석/1-1-2/싣기_대조표.md 에 있다.
// (만들기 묶음의 기본 문항과 실력 문항은 1-1-2b.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 영역: 도형과 측정 가운데 도형.
//   2수03-01 교실 및 생활 주변에서 여러 가지 물건을 관찰하여 직육면체, 원기둥, 구의 모양을 찾고, 이를 이용하여 여러 가지 모양을 만들 수 있다.
//   교육과정: 「입체도형과 평면도형의 모양을 다룰 때 모양의 특징을 직관적으로 파악하여 모양을 분류하고, 분류한 모양을 지칭하기 위해 일상용어를 사용하게 할 수 있다.」
//   → 「상자 모양」「둥근기둥 모양」「공 모양」이라고 부르고 이름 옆에 작은 그림을 함께 보인다. 직육면체·원기둥·구, 면·모서리·꼭짓점이라는 말은 쓰지 않는다.
//
// 싣는 기준
//  - 물건에서 같은 모양 찾기·모으기·세기, 세 모양의 특징(평평한 부분·둥근 부분·뾰족한 부분이 있는가, 잘 굴러가는가, 쌓을 수 있는가),
//    세 모양으로 만든 모양에서 쓴 모양을 가려 세고 견주기를 싣는다. 주는 것(물건·모양·설명·일부만 보이는 그림)과 묻는 것이 다르면 다른 문제다.
//  - 굴러가고 쌓는 말은 하나로 맞춘다: 상자 모양은 잘 쌓을 수 있고 잘 굴러가지 않는다 / 둥근기둥 모양은 눕히면 잘 굴러가고 세우면 쌓을 수 있다 /
//    공 모양은 어느 쪽으로도 잘 굴러가고 쌓을 수 없다. 「한 방향으로만」「여러 방향으로」 같은 다른 말은 쓰지 않는다.
//  - 설명의 참·거짓은 손으로 적지 않고 아래의 표(HAS, SAY)에서 셈한다. 모양에 따라 말이 갈릴 수 있는 설명(세워 둔 둥근기둥 모양이 「잘 굴러가지 않는다」)은 그 모양에는 쓰지 않는다.
//  - 답으로 한글을 적게 하지 않는다. 모양과 물건은 고르기로, 수는 숫자로 받는다. 물음은 한 줄을 넘지 않게 짧게 쓴다.
//  - 그림: 세 모양은 비스듬히 본 간단한 입체 그림(보이는 선만 실선, 옅은 색, 공은 원에 그늘선 하나)으로 그린다. 물건은 그 모양에 이름표를 붙여 그린다.
//    일부만 보이는 그림은 판으로 가려 그리되 모양을 가르는 부분(뾰족한 부분, 평평한 부분)이 보이게 한다. 그림 속 모양과 수는 aria-label 에 적는다.
//
// 뺀 것과 까닭(단원 전체)
//  - 평평한 부분의 수 세기(①27 심20): 면의 수 세기는 5~6학년의 일이다. 이 단원은 있다·없다까지 다룬다.
//  - 위에서 본 모양(심16): 평면 모양 ○는 1-2-3, 본 모양은 그보다 뒤다.
//  - 한 모양을 다른 모양보다 몇 개 더 썼는가(①36 심30): 뺄셈은 다음 단원(1-1-3)이다. 「어느 쪽이 더 많은가」는 실었다.
//  - 물건 이름 쓰기(①15 심12): 한글 답이다 → 이름만 보고 그 모양인 것 고르기로 바꾸어 실었다.
//  - 잇기·색칠하기·길 따라가기·만들기(①8·16·24·43 심9의 잇기·13·37·38): 작도·놀이다. 짝 맞추기로 바꿀 수 있는 것(①8·24 심13)은 고르기로 실었다.
//  - 까닭 쓰기(①28·29·35): 서술형이다 → 답만 고르게 바꾸어 실었다.
//  - 조각 여섯 가운데 쓴 조각 찾기(심36): 원본 그림의 조각을 알 수 없다 → 미룸. 크기만 다른 조각을 가리는 일은 모양의 뜻과도 멀다.
// 묻는 말: 모양·물건은 「~은?」, 수는 「몇 개인가?」. 풀이는 「~이다.」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, NAMES } = B.kit;
  const G = B.kit.geo;
  const STD = '2수03-01';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const KINDS = ['box', 'cyl', 'ball'];
  const KIND = { box: '상자 모양', cyl: '둥근기둥 모양', ball: '공 모양' };
  const MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'], TAGS = ['가', '나', '다', '라'];
  const conditions = (list) => '<ul class="mb-conditions">' + list.map((line) => '<li>' + line + '</li>').join('') + '</ul>';

  // ── 세 모양의 특징 ───────────────────────────────────────────
  // 평평한 부분(flat), 둥근 부분(round), 뾰족한 부분(sharp)이 있는가
  const HAS = { box: { flat: true, round: false, sharp: true }, cyl: { flat: true, round: true, sharp: false }, ball: { flat: false, round: true, sharp: false } };
  // 굴러가는가, 쌓을 수 있는가(둥근기둥 모양은 눕히면 굴러가고 세우면 쌓을 수 있다)
  const ROLLS = { box: false, cyl: true, ball: true }, STACKS = { box: true, cyl: true, ball: false };
  // 설명: text 글, on 무엇에 대한 말인가, ok(모양) 그 모양에 맞는가(null 은 그 모양에는 쓰지 않는 말)
  const SAY = {
    flatYes: { text: '평평한 부분이 있다.', on: ['flat'], ok: (k) => HAS[k].flat },
    flatNo: { text: '평평한 부분이 없다.', on: ['flat'], ok: (k) => !HAS[k].flat },
    roundYes: { text: '둥근 부분이 있다.', on: ['round'], ok: (k) => HAS[k].round },
    roundNo: { text: '둥근 부분이 없다.', on: ['round'], ok: (k) => !HAS[k].round },
    sharpYes: { text: '뾰족한 부분이 있다.', on: ['sharp'], ok: (k) => HAS[k].sharp },
    sharpNo: { text: '뾰족한 부분이 없다.', on: ['sharp'], ok: (k) => !HAS[k].sharp },
    onlyFlat: { text: '평평한 부분만 있다.', on: ['flat', 'round'], ok: (k) => HAS[k].flat && !HAS[k].round },
    onlyRound: { text: '둥근 부분만 있다.', on: ['flat', 'round'], ok: (k) => HAS[k].round && !HAS[k].flat },
    both: { text: '평평한 부분과 둥근 부분이 모두 있다.', on: ['flat', 'round'], ok: (k) => HAS[k].flat && HAS[k].round },
    rollNo: { text: '잘 굴러가지 않는다.', on: ['roll'], ok: (k) => ({ box: true, cyl: null, ball: false }[k]) },
    rollLie: { text: '눕히면 잘 굴러간다.', on: ['roll'], ok: (k) => ({ box: false, cyl: true, ball: null }[k]) },
    rollAny: { text: '어느 쪽으로도 잘 굴러간다.', on: ['roll'], ok: (k) => ({ box: false, cyl: false, ball: true }[k]) },
    stackWell: { text: '잘 쌓을 수 있다.', on: ['stack'], ok: (k) => ({ box: true, cyl: null, ball: false }[k]) },
    stackStand: { text: '세우면 쌓을 수 있다.', on: ['stack'], ok: (k) => ({ box: null, cyl: true, ball: false }[k]) },
    stackNo: { text: '쌓을 수 없다.', on: ['stack'], ok: (k) => ({ box: false, cyl: false, ball: true }[k]) },
    rollStack: { text: '눕히면 잘 굴러가고 세우면 쌓을 수 있다.', on: ['roll', 'stack'], ok: (k) => k === 'cyl' }
  };
  // 풀이에 적는 말
  const LOOK = { box: '상자 모양은 평평한 부분과 뾰족한 부분이 있고 둥근 부분이 없다.', cyl: '둥근기둥 모양은 평평한 부분과 둥근 부분이 있고 뾰족한 부분이 없다.', ball: '공 모양은 둥근 부분만 있다.' };
  const MOVE = { box: '상자 모양은 잘 쌓을 수 있고 잘 굴러가지 않는다.', cyl: '둥근기둥 모양은 눕히면 잘 굴러가고 세우면 쌓을 수 있다.', ball: '공 모양은 어느 쪽으로도 잘 굴러가고 쌓을 수 없다.' };
  const SUM = { box: LOOK.box + ' 잘 쌓을 수 있고 잘 굴러가지 않는다.', cyl: LOOK.cyl + ' 눕히면 잘 굴러가고 세우면 쌓을 수 있다.', ball: LOOK.ball + ' 어느 쪽으로도 잘 굴러가고 쌓을 수 없다.' };
  const WHY = {
    box: '평평한 부분과 뾰족한 부분이 있으면 상자 모양이다.',
    cyl: '평평한 부분과 둥근 부분이 모두 있으면 둥근기둥 모양이다.',
    ball: '둥근 부분만 있으면 공 모양이다.'
  };
  // 한 모양에 대한 설명을 맞는 것 right 개, 틀린 것 wrong 개 고른다. 서로 다른 것(평평한 부분, 굴러가기 …)을 말하는 설명만 함께 쓴다(「있다」와 「없다」가 나란히 놓이면 답이 드러난다).
  function pickSays(d, kind, right, wrong) {
    const keys = Object.keys(SAY).filter((key) => key !== 'onlyFlat' && key !== 'rollStack' && SAY[key].ok(kind) !== null);
    return d.until(() => {
      const used = new Set(), out = []; let t = right, f = wrong;
      for (const key of d.shuffle(keys)) {
        const s = SAY[key], ok = Boolean(s.ok(kind));
        if ((ok ? t : f) === 0 || s.on.some((x) => used.has(x))) continue;
        s.on.forEach((x) => used.add(x)); out.push(key); if (ok) t -= 1; else f -= 1;
      }
      return t === 0 && f === 0 ? d.shuffle(out) : null;
    }, Boolean);
  }

  // ── 보기 짜기 ────────────────────────────────────────────────
  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋
  function setOptions(d, labels, flags, show) {
    const key = (list) => list.join(', '), right = labels.filter((_, i) => flags[i]), pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map((o) => (show ? o.map(show).join(', ') : key(o))), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }
  // 낱말 여럿을 잇고 끝에 토씨를 붙인다: 주사위, 벽돌이
  const listed = (words, pair) => words.slice(0, -1).concat([josa(words[words.length - 1], pair)]).join(', ');

  // ── 그림: 세 모양 ────────────────────────────────────────────
  const r1 = (n) => Math.round(n * 10) / 10;
  const INK = '#1f2933', PEN = 'stroke:' + INK + ';stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round';
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');
  // 옅은 빛깔
  const TINT = { cream: '#ffefb0', sky: '#d3e6ff', pink: '#ffdbe3', mint: '#d1f0d9', lilac: '#e4dcff', peach: '#ffdcba', sand: '#ecdcc0', gray: '#dfe6ee', white: '#ffffff', lime: '#dff0b4' };
  const PALETTE = [TINT.cream, TINT.sky, TINT.pink, TINT.mint, TINT.lilac, TINT.peach];
  const poly = (pts, fill) => '<polygon points="' + pts.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ') + '" style="fill:' + fill + ';' + PEN + '"/>';
  const path = (d, fill, pen) => '<path d="' + d + '" style="fill:' + fill + ';' + (pen || PEN) + '"/>';
  const word = (x, y, text, css) => '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="middle" style="' + css + '">' + text + '</text>';
  // 비스듬히 본 그림: 안쪽으로 1 들어간 점은 오른쪽으로 DX, 위로 DY 옮겨 그린다. 둥근 면은 납작한 타원으로 그린다(세로 반지름이 가로의 ELL 배).
  const DX = 0.5, DY = 0.36, ELL = 0.36;
  // 모양 하나: ['box', 가로, 높이, 안쪽 길이] | ['cyl', 반지름, 높이](세운 둥근기둥) | ['lie', 반지름, 길이](눕힌 둥근기둥) | ['ball', 반지름]
  const kindOf = (spec) => (spec[0] === 'lie' ? 'cyl' : spec[0]);
  const tall = (spec) => (spec[0] === 'box' || spec[0] === 'cyl' ? spec[2] : spec[1] * 2);
  // 바닥에 닿은 곳의 가운데 (bx, by) 에서 그림이 차지하는 자리: 왼쪽 l, 오른쪽 r, 위 up, 아래 down
  function span(spec) {
    const k = spec[0];
    if (k === 'box') { const dx = spec[3] * DX, dy = spec[3] * DY; return { l: spec[1] / 2 + dx / 2, r: spec[1] / 2 + dx / 2, up: spec[2] + dy / 2, down: dy / 2 }; }
    if (k === 'cyl') return { l: spec[1], r: spec[1], up: spec[2] + spec[1] * ELL, down: spec[1] * ELL };
    if (k === 'lie') return { l: spec[2] / 2 + spec[1] * ELL, r: spec[2] / 2 + spec[1] * ELL, up: spec[1] * 2, down: 0 };
    return { l: spec[1], r: spec[1], up: spec[1] * 2, down: 0 };
  }
  // 보이는 선만 실선으로 긋는다. 윗면(둥근기둥의 평평한 부분)은 조금 밝게, 옆면은 조금 어둡게 칠한다.
  function shape(spec, bx, by, tint) {
    const k = spec[0], light = mix(tint, '#ffffff', 0.62), dark = mix(tint, '#334155', 0.15);
    if (k === 'box') {
      const w = spec[1], h = spec[2], dx = spec[3] * DX, dy = spec[3] * DY, x = bx - w / 2 - dx / 2, y = by + dy / 2;
      return poly([[x, y], [x + w, y], [x + w, y - h], [x, y - h]], tint)
        + poly([[x, y - h], [x + w, y - h], [x + w + dx, y - h - dy], [x + dx, y - h - dy]], light)
        + poly([[x + w, y], [x + w + dx, y - dy], [x + w + dx, y - h - dy], [x + w, y - h]], dark);
    }
    if (k === 'cyl') {
      const r = spec[1], ry = r * ELL, top = by - spec[2], side = 'M' + r1(bx - r) + ' ' + r1(top) + 'V' + r1(by) + 'A' + r1(r) + ' ' + r1(ry) + ' 0 0 0 ' + r1(bx + r) + ' ' + r1(by) + 'V' + r1(top);
      return path(side + 'Z', tint, 'stroke:none') + path(side, 'none')
        + '<ellipse cx="' + r1(bx) + '" cy="' + r1(top) + '" rx="' + r1(r) + '" ry="' + r1(ry) + '" style="fill:' + light + ';' + PEN + '"/>';
    }
    if (k === 'lie') {
      const r = spec[1], rx = r * ELL, xl = bx - spec[2] / 2, xr = bx + spec[2] / 2, side = 'M' + r1(xr) + ' ' + r1(by - 2 * r) + 'H' + r1(xl) + 'A' + r1(rx) + ' ' + r1(r) + ' 0 0 0 ' + r1(xl) + ' ' + r1(by) + 'H' + r1(xr);
      return path(side + 'Z', tint, 'stroke:none') + path(side, 'none')
        + '<ellipse cx="' + r1(xr) + '" cy="' + r1(by - r) + '" rx="' + r1(rx) + '" ry="' + r1(r) + '" style="fill:' + light + ';' + PEN + '"/>';
    }
    const r = spec[1], cy = by - r, q = 0.64 * r, at = (deg) => r1(bx + q * Math.cos(deg * Math.PI / 180)) + ' ' + r1(cy + q * Math.sin(deg * Math.PI / 180));
    return '<circle cx="' + r1(bx) + '" cy="' + r1(cy) + '" r="' + r1(r) + '" style="fill:' + tint + ';' + PEN + '"/>'
      + path('M' + at(8) + 'A' + r1(q) + ' ' + r1(q) + ' 0 0 1 ' + at(104), 'none', 'stroke:#64748b;stroke-width:1.2;stroke-linecap:round');
  }
  // 놓인 조각들(parts: [{ spec, bx, by, tint } 또는 { html, box: [x0, y0, x1, y1] }], 그리는 차례대로)을 꼭 맞는 크기의 그림으로 낸다.
  // o: { scale(그림의 배율), pad, icon(글 속에 넣는 작은 그림의 높이) }. 너비 64px·높이 24px 에 못 미치는 그림은 여백을 넓힌다(화면 검사가 찌그러진 그림을 떨어뜨린다).
  function fit(parts, label, o) {
    const opt = o || {}, pad = opt.pad == null ? 4 : opt.pad, scale = opt.scale || 1;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, body = '';
    for (const p of parts) {
      const s = p.html ? null : span(p.spec), b = p.html ? p.box : [p.bx - s.l, p.by - s.up, p.bx + s.r, p.by + s.down];
      if (b) { x0 = Math.min(x0, b[0]); y0 = Math.min(y0, b[1]); x1 = Math.max(x1, b[2]); y1 = Math.max(y1, b[3]); }
      body += p.html || shape(p.spec, p.bx, p.by, p.tint);
    }
    if (opt.icon) {
      const w = x1 - x0 + 3, h = y1 - y0 + 3;
      return '<svg viewBox="' + r1(x0 - 1.5) + ' ' + r1(y0 - 1.5) + ' ' + r1(w) + ' ' + r1(h) + '" width="' + r1(w * opt.icon / h) + '" height="' + opt.icon + '" class="mb-inline" aria-hidden="true" style="vertical-align:-4px;margin-right:3px">' + body + '</svg>';
    }
    const side = Math.max(pad, (64 / scale - (x1 - x0)) / 2), edge = Math.max(pad, (24 / scale - (y1 - y0)) / 2), w = x1 - x0 + side * 2, h = y1 - y0 + edge * 2;
    return '<svg class="mb-geo" viewBox="' + r1(x0 - side) + ' ' + r1(y0 - edge) + ' ' + r1(w) + ' ' + r1(h) + '" width="' + Math.ceil(w * scale) + '" role="img" aria-label="' + label + '">' + body + '</svg>';
  }
  // 이름 옆에 붙이는 작은 그림과 이름
  const BIG = { box: ['box', 42, 34, 26], cyl: ['cyl', 18, 42], ball: ['ball', 23] };
  const icon = (kind, size) => fit([{ spec: { box: ['box', 26, 21, 16], cyl: ['cyl', 11, 23], ball: ['ball', 14] }[kind], bx: 0, by: 0, tint: TINT.cream }], '', { icon: size || 20 });
  const nm = (kind) => icon(kind) + KIND[kind];
  const kindOptions = () => KINDS.map(nm);
  // 모양 하나를 크게 보이는 그림 칸(이름표: 모양의 이름)
  const shown = (kind) => G.tiles([[KIND[kind], fit([{ spec: BIG[kind], bx: 0, by: 0, tint: TINT.cream }], KIND[kind])]]);
  // 모양별 수를 적은 글: 상자 모양 2개, 둥근기둥 모양 3개
  const tally = (counts) => KINDS.filter((k) => counts[k]).map((k) => KIND[k] + ' ' + counts[k] + '개').join(', ');
  const countOf = (kinds) => { const c = { box: 0, cyl: 0, ball: 0 }; kinds.forEach((k) => { c[k] += 1; }); return c; };

  // ── 그림: 물건 ───────────────────────────────────────────────
  // 물건: [이름, 모양, 빛깔, 흔히 보는 모습과 다른가(납작하다·아주 작다·가늘다 …), 그림 없이 이름만으로도 모양이 떠오르는가]
  const THINGS = [
    ['주사위', ['box', 30, 30, 30], 'white', false, true], ['과자 상자', ['box', 42, 28, 12], 'peach', false, false], ['필통', ['box', 50, 12, 18], 'sky', false, false],
    ['동화책', ['box', 42, 8, 32], 'mint', true, false], ['냉장고', ['box', 30, 50, 26], 'gray', false, true], ['휴지 상자', ['box', 44, 18, 26], 'pink', false, true],
    ['벽돌', ['box', 44, 16, 22], 'peach', false, true], ['지우개', ['box', 26, 9, 14], 'pink', true, false], ['택배 상자', ['box', 40, 30, 30], 'sand', false, true],
    ['서랍장', ['box', 40, 40, 22], 'sand', false, false],
    ['통조림', ['cyl', 18, 22], 'gray', false, true], ['작은북', ['cyl', 24, 16], 'pink', false, false], ['딱풀', ['cyl', 8, 42], 'cream', false, true],
    ['음료수 캔', ['cyl', 12, 34], 'mint', false, true], ['건전지', ['lie', 7, 36], 'cream', false, true], ['김밥', ['lie', 11, 44], 'gray', false, false],
    ['분필', ['lie', 4.5, 40], 'white', true, true], ['물통', ['cyl', 12, 44], 'sky', false, false], ['케이크', ['cyl', 25, 14], 'pink', true, false],
    ['과자 통', ['cyl', 13, 42], 'peach', false, false], ['통나무', ['lie', 12, 48], 'sand', true, false], ['양초', ['cyl', 7, 38], 'cream', true, false],
    ['축구공', ['ball', 20], 'white', false, true], ['농구공', ['ball', 22], 'peach', false, true], ['배구공', ['ball', 19], 'cream', false, true],
    ['구슬', ['ball', 7], 'sky', true, true], ['수박', ['ball', 24], 'mint', false, true], ['볼링공', ['ball', 20], 'lilac', false, true],
    ['테니스공', ['ball', 10], 'lime', false, true], ['탁구공', ['ball', 7.5], 'peach', true, true], ['털실 뭉치', ['ball', 15], 'pink', false, false],
    ['야구공', ['ball', 10.5], 'white', false, true], ['고무공', ['ball', 14], 'pink', false, false]
  ].map(([name, spec, tint, odd, known]) => ({ name, spec, kind: kindOf(spec), tint: TINT[tint], odd, known }));
  const thing = (name) => THINGS.find((t) => t.name === name);
  // 그 모양인 물건 n 개. plain 이면 흔히 보는 모습의 물건만 고른다.
  const take = (d, kind, n, plain) => d.shuffle(THINGS.filter((t) => t.kind === kind && (!plain || !t.odd))).slice(0, n);
  // 모양마다 정해진 수만큼 골라 섞는다. counts: { box, cyl, ball }
  const mixed = (d, counts, plain) => d.shuffle(KINDS.reduce((all, k) => all.concat(take(d, k, counts[k] || 0, plain)), []));
  const said = (t) => t.name + '(' + KIND[t.kind] + ')';
  // 물건 여럿을 줄지어 놓은 그림. o: { tags(물건마다 붙이는 기호), names: false(이름표를 적지 않는다), per(한 줄에 놓는 수), cell(한 칸의 너비), scale(그림의 배율), head(그림 설명의 머리말), sum(모양별 수를 그림 설명에 덧붙인다) }
  function things(list, o) {
    const opt = o || {}, n = list.length, per = opt.per || (n <= 4 ? n : n <= 6 ? 3 : 4), cw = opt.cell || (per >= 4 ? 70 : per === 3 ? 84 : 66);
    const names = opt.names !== false, spans = list.map((t) => span(t.spec)), high = Math.max.apply(null, spans.map((s) => s.up + s.down));
    const tagH = opt.tags ? 16 : 3, rowH = tagH + high + (names ? 21 : 5), gap = 7, rows = Math.ceil(n / per), scale = opt.scale || 1;
    let body = '';
    list.forEach((t, i) => {
      const row = Math.floor(i / per), inRow = Math.min(per, n - row * per), left = (i % per) * cw + (per - inRow) * cw / 2, top = row * (rowH + gap), ground = top + tagH + high;
      body += shape(t.spec, left + cw / 2, ground - spans[i].down, t.tint);
      if (opt.tags) body += word(left + 11, top + 13, opt.tags[i], 'font-size:15px;font-weight:700;fill:#1d4ed8');
      if (names) body += word(left + cw / 2, ground + 15, t.name, 'font-size:12px;font-weight:600;fill:' + INK);
    });
    const label = (opt.head || '물건') + ' ' + n + '개: ' + list.map((t, i) => (opt.tags ? opt.tags[i] + ' ' : '') + said(t)).join(', ') + (opt.sum ? '. ' + tally(countOf(list.map((t) => t.kind))) : '');
    return '<svg class="mb-geo" viewBox="0 0 ' + per * cw + ' ' + r1(rows * rowH + (rows - 1) * gap) + '" width="' + Math.ceil(per * cw * scale) + '" role="img" aria-label="' + label + '">' + body + '</svg>';
  }
  // 물건 하나만 크게 그린 그림 칸(이름표: 물건의 이름)
  const one = (t) => G.tiles([[t.name, fit([{ spec: t.spec, bx: 0, by: 0, tint: t.tint }], said(t), { scale: 1.3 })]]);

  // ── 그림: 일부만 보이는 모양, 주머니, 낱개 모양 ───────────────
  // 판에 가려 일부만 보이는 모양. 위쪽만(top) 또는 오른쪽만(side) 보인다. o: { spec(모양의 크기), scale(그림의 배율) } 상자 모양은 뾰족한 부분이, 둥근기둥 모양은 평평한 부분과 둥근 부분이 함께 보인다.
  const SEEN = { box: '뾰족한 부분과 평평한 부분이 보인다', cyl: '평평한 부분과 둥근 부분이 보인다', ball: '둥근 부분만 보인다' };
  function peek(kind, mode, o) {
    const opt = o || {}, sp = opt.spec || { box: ['box', 46, 44, 30], cyl: ['cyl', 22, 50], ball: ['ball', 27] }[kind], s = span(sp), x0 = -s.l, x1 = s.r, y0 = -s.up, y1 = s.down;
    const cut = mode === 'side' ? x0 + (x1 - x0) * 0.5 : y0 + (kind === 'box' ? sp[3] * DY + 13 : kind === 'cyl' ? sp[1] * ELL * 2 + 12 : sp[1] * 0.8);
    const cover = mode === 'side' ? [x0 - 9, y0 - 7, cut, y1 + 7] : [x0 - 9, cut, x1 + 9, y1 + 7];
    const board = '<rect x="' + r1(cover[0]) + '" y="' + r1(cover[1]) + '" width="' + r1(cover[2] - cover[0]) + '" height="' + r1(cover[3] - cover[1]) + '" rx="4" style="fill:#c3cfdb;stroke:#64748b;stroke-width:1.3"/>';
    return fit([{ spec: sp, bx: 0, by: 0, tint: TINT.cream }, { html: board, box: cover }], '판에 가려 일부만 보이는 ' + KIND[kind] + ': ' + SEEN[kind], { scale: opt.scale });
  }
  // 속이 보이지 않는 주머니
  const pouch = () => fit([{ html: '<path d="M-13 -20Q-36 4 -26 30Q0 40 26 30Q36 4 13 -20Z" style="fill:#e7d3b1;' + PEN + '"/><path d="M-13 -20L-18 -32Q0 -26 18 -32L13 -20Z" style="fill:#d9c098;' + PEN + '"/>'
    + '<path d="M-14 -20H14" style="fill:none;stroke:#b45309;stroke-width:3;stroke-linecap:round"/>' + word(0, 16, '?', 'font-size:24px;font-weight:700;fill:#7c5a1e'), box: [-34, -34, 34, 37] }], '속이 보이지 않는 주머니');
  // 낱개 모양을 한 줄로 늘어놓은 그림(상자 모양, 둥근기둥 모양, 공 모양 차례). o: { head(그림 설명의 머리말), scale }
  const LOOSE = { box: ['box', 22, 18, 14], cyl: ['cyl', 9, 22], ball: ['ball', 10] };
  function loose(counts, o) {
    const opt = o || {}, parts = []; let x = 0;
    KINDS.forEach((k) => { for (let i = 0; i < (counts[k] || 0); i += 1) { const s = span(LOOSE[k]); parts.push({ spec: LOOSE[k], bx: x + s.l, by: -s.down, tint: TINT.cream }); x += s.l + s.r + 7; } if (counts[k]) x += 5; });
    return fit(parts, (opt.head || '낱개 모양') + ': ' + tally(counts), { scale: opt.scale });
  }

  B.kit.g112 = { STD, KINDS, KIND, MARKS, TAGS, conditions, HAS, ROLLS, STACKS, SAY, LOOK, MOVE, SUM, WHY, pickSays, setOptions, listed, r1, INK, PEN, TINT, PALETTE, mix, poly, path, word, DX, DY, ELL,
    kindOf, tall, span, shape, fit, BIG, icon, nm, kindOptions, shown, tally, countOf, THINGS, thing, take, mixed, said, things, one, SEEN, peek, pouch, LOOSE, loose };

  // ── 단원 ─────────────────────────────────────────────────────
  B.addUnit({
    id: '1-1-2', grade: 1, semester: 1, no: 2, title: '여러 가지 모양', version: 1,
    groups: [
      { id: 'find', title: '같은 모양 찾기', standard: STD, types: [] },
      { id: 'feature', title: '모양의 특징', standard: STD, types: [] },
      { id: 'make', title: '여러 가지 모양 만들기', standard: STD, types: [] }
    ]
  });

  // ── 같은 모양 찾기 ───────────────────────────────────────────
  B.addTypes('1-1-2', 'find', [
    T('find-name', '물건을 보고 모양 고르기', '①2·7 심1', (d, n) => {
      const kind = ['cyl', 'box', 'ball'][n], t = d.pick(take(d, kind, 4));
      return C('이 물건은 어떤 모양인가?', kindOptions(), KINDS.indexOf(kind), { figure: one(t), explain: WHY[kind], facts: { kindPick: { kinds: KINDS, target: kind } } });
    }, { count: 3 }),
    T('find-same', '보기와 같은 모양인 물건', '①1·8', (d) => {
      const kind = d.pick(KINDS), same = take(d, kind, 2, true), list = d.shuffle([same[1]].concat(KINDS.filter((k) => k !== kind).map((k) => take(d, k, 1, true)[0])));
      const at = list.indexOf(same[1]);
      return C('보기와 같은 모양인 물건은?', MARKS.slice(0, 3), at, {
        figure: G.tiles([['보기', things([same[0]], { cell: 70, head: '보기' })]]) + things(list, { tags: MARKS }),
        explain: `보기는 ${KIND[kind]}이다. ${same[1].name}도 ${KIND[kind]}이다.`, facts: { kindPick: { kinds: list.map((t) => t.kind), target: kind } }
      });
    }),
    T('find-pick', '그 모양인 물건 하나 고르기', '①3 심1', (d) => {
      const kind = d.pick(KINDS), rest = d.shuffle(KINDS.filter((k) => k !== kind)), list = mixed(d, { [kind]: 1, [rest[0]]: 2, [rest[1]]: 1 }, true), at = list.findIndex((t) => t.kind === kind);
      return C(`${nm(kind)}인 물건은?`, MARKS.slice(0, 4), at, {
        figure: things(list, { tags: MARKS }), explain: `${josa(list[at].name, '이/가')} ${KIND[kind]}이다. ${WHY[kind]}`, facts: { kindPick: { kinds: list.map((t) => t.kind), target: kind } }
      });
    }),
    T('find-all', '그 모양인 물건 모두 고르기', '①4 심4', (d) => {
      const kind = d.pick(KINDS), rest = d.shuffle(KINDS.filter((k) => k !== kind)), a = d.int(2, 3), b = d.int(1, 5 - a), list = mixed(d, { [kind]: a, [rest[0]]: b, [rest[1]]: 6 - a - b }, true);
      const flags = list.map((t) => t.kind === kind), made = setOptions(d, MARKS, flags);
      return C(`${nm(kind)}을 모두 고르면?`, made.options, made.answer, {
        figure: things(list, { tags: MARKS }), explain: `${listed(list.filter((t) => t.kind === kind).map((t) => t.name), '이/가')} ${KIND[kind]}이다.`, facts: { sets: { labels: MARKS, flags, options: made.sets } }
      });
    }),
    T('find-not', '그 모양이 아닌 물건', '①5', (d) => {
      const kind = d.pick(KINDS), other = d.pick(KINDS.filter((k) => k !== kind)), list = mixed(d, { [kind]: 2, [other]: 1 }, true), at = list.findIndex((t) => t.kind !== kind);
      return C(`${nm(kind)}이 아닌 물건은?`, MARKS.slice(0, 3), at, {
        figure: things(list, { tags: MARKS }), explain: `${josa(list[at].name, '은/는')} ${KIND[other]}이다.`, facts: { truth: list.map((t) => t.kind !== kind), want: true }
      });
    }),
    T('find-odd', '모양이 다른 하나', '①6 심3', (d) => {
      const kind = d.pick(KINDS), other = d.pick(KINDS.filter((k) => k !== kind)), list = mixed(d, { [kind]: 3, [other]: 1 }, true), at = list.findIndex((t) => t.kind === other);
      return C('모양이 다른 하나는?', MARKS.slice(0, 4), at, {
        figure: things(list, { tags: MARKS }), explain: `${josa(list[at].name, '은/는')} ${KIND[other]}이고, 나머지는 모두 ${KIND[kind]}이다.`, facts: { tileOdd: list.map((t) => t.kind) }
      });
    }),
    T('find-pair', '같은 모양끼리 짝 지은 것', '①9 심9', (d) => {
      const kind = d.pick(KINDS), same = take(d, kind, 2, true), used = new Set(same.map((t) => t.name));
      // 나머지 세 쌍은 서로 다른 두 모양이다.
      const others = d.shuffle([['box', 'cyl'], ['cyl', 'ball'], ['box', 'ball']]).map((pair) => d.shuffle(pair).map((k) => { const t = take(d, k, 6, true).find((x) => !used.has(x.name)); used.add(t.name); return t; }));
      const pairs = d.shuffle([same].concat(others)), at = pairs.indexOf(same);
      return C('같은 모양끼리 짝 지은 것은?', TAGS, at, {
        figure: G.tiles(pairs.map((pair, i) => [TAGS[i], things(pair, { per: 2, cell: 66, scale: 0.9 })])),
        explain: `${listed(same.map((t) => t.name), '은/는')} 둘 다 ${KIND[kind]}이다.`, facts: { truth: pairs.map((pair) => pair[0].kind === pair[1].kind), want: true }
      });
    }),
    T('find-group-name', '모아 놓은 물건의 모양', '①10', (d) => {
      const kind = d.pick(KINDS), list = take(d, kind, 3);
      return C('어떤 모양끼리 모았는가?', kindOptions(), KINDS.indexOf(kind), { figure: things(list, { head: '모아 놓은 물건' }), explain: WHY[kind], facts: { kindPick: { kinds: KINDS, target: kind } } });
    }),
    T('find-group-wrong', '다른 모양이 섞인 묶음', '심8', (d) => {
      const order = d.shuffle(KINDS), odd = take(d, order[1], 1, true)[0];
      // 한 묶음에만 다른 모양이 하나 섞여 있다.
      const groups = d.shuffle([take(d, order[0], 3, true), d.shuffle(take(d, order[2], 2, true).concat([odd])), take(d, order[1], 4, true).filter((t) => t !== odd).slice(0, 3)]), at = groups.findIndex((g) => g.includes(odd));
      return C('다른 모양이 섞인 것은?', TAGS.slice(0, 3), at, {
        figure: G.tiles(groups.map((g, i) => [TAGS[i], things(g, { per: 3, cell: 62 })])),
        explain: `${TAGS[at]}에서 ${josa(odd.name, '은/는')} ${KIND[odd.kind]}이고, 나머지는 ${KIND[order[2]]}이다.`, facts: { truth: groups.map((g) => new Set(g.map((t) => t.kind)).size > 1), want: true }
      });
    }),
    T('find-count', '그 모양인 물건의 수', '①11 심5', (d) => {
      const kind = d.pick(KINDS), rest = d.shuffle(KINDS.filter((k) => k !== kind)), a = d.int(2, 4), b = d.int(1, 6 - a), list = mixed(d, { [kind]: a, [rest[0]]: b, [rest[1]]: 7 - a - b }, true);
      return N(`${nm(kind)}은 몇 개인가?`, a, {
        unit: '개', figure: things(list), explain: `${listed(list.filter((t) => t.kind === kind).map((t) => t.name), '이/가')} ${KIND[kind]}이다.`, facts: { count: list.map((t) => t.kind === kind) }
      });
    }),
    T('find-count3', '세 모양의 물건을 각각 세기', '심6', (d) => {
      const c = d.shuffle(d.pick([[3, 4, 1], [2, 3, 3], [4, 2, 2], [3, 3, 2], [1, 4, 3]])), counts = { box: c[0], cyl: c[1], ball: c[2] }, list = mixed(d, counts, true);
      return M('모양마다 몇 개인지 쓰시오.', KINDS.map((k) => ({ label: KIND[k], answer: counts[k], unit: '개' })), {
        figure: things(list, { sum: true }), explain: KINDS.map((k) => `${KIND[k]}: ${list.filter((t) => t.kind === k).map((t) => t.name).join(', ')}`).join(' / '),
        facts: { calc: KINDS.map((k, i) => [String(counts[k]), i]), tallyOf: { list: list.map((t) => t.kind), target: 'box' } }
      });
    }),
    T('find-most', '가장 많은 모양, 가장 적은 모양', '①12 심7', (d, n) => {
      const c = d.shuffle([3, 2, 1]), counts = { box: c[0], cyl: c[1], ball: c[2] }, list = mixed(d, counts, true), want = n === 0 ? 3 : 1, at = c.indexOf(want);
      return C(n === 0 ? '가장 많은 모양은?' : '가장 적은 모양은?', kindOptions(), at, {
        figure: things(list, { sum: true }), explain: tally(counts) + '이다.', facts: { choose: { exprs: c.map(String), rule: n === 0 ? 'max' : 'min' } }
      });
    }, { count: 2 }),
    T('find-part', '일부만 보이는 모양', '①13', (d, n) => {
      const kind = ['box', 'cyl'][n];
      return C('가려진 모양은 어떤 모양인가?', kindOptions(), KINDS.indexOf(kind), {
        figure: peek(kind, d.pick(['top', 'side'])), explain: `${SEEN[kind]}. ${WHY[kind]}`, facts: { kindPick: { kinds: KINDS, target: kind }, rule: 'part-' + kind }
      });
    }, { count: 2 }),
    T('find-part-three', '일부만 보이는 세 모양에서 고르기', '①13', (d) => {
      const order = d.shuffle(KINDS), kind = d.pick(KINDS), mode = d.pick(['top', 'side']);
      return C(`${nm(kind)}은 어느 것인가?`, TAGS.slice(0, 3), order.indexOf(kind), {
        figure: G.tiles(order.map((k, i) => [TAGS[i], peek(k, mode, { scale: 0.8 })])),
        explain: '뾰족한 부분이 보이면 상자 모양, 평평한 부분과 둥근 부분이 보이면 둥근기둥 모양, 둥근 부분만 보이면 공 모양이다.', facts: { kindPick: { kinds: order, target: kind } }
      });
    }),
    T('find-part-same', '일부만 보이는 모양과 같은 모양인 물건', '①14 심10', (d) => {
      const kind = d.pick(['box', 'cyl']), list = d.shuffle(KINDS.map((k) => take(d, k, 1, true)[0])), at = list.findIndex((t) => t.kind === kind);
      return C('가려진 모양과 같은 모양인 물건은?', MARKS.slice(0, 3), at, {
        figure: peek(kind, d.pick(['top', 'side'])) + things(list, { tags: MARKS }),
        explain: `${SEEN[kind]}. 가려진 모양은 ${KIND[kind]}이고, ${list[at].name}도 ${KIND[kind]}이다.`, facts: { kindPick: { kinds: list.map((t) => t.kind), target: kind } }
      });
    }),
    T('find-recall', '이름만 보고 그 모양인 것 고르기', '①15 심12', (d) => {
      const kind = d.pick(KINDS), rest = d.shuffle(KINDS.filter((k) => k !== kind)), known = (k, n) => d.shuffle(THINGS.filter((t) => t.kind === k && t.known)).slice(0, n);
      const list = d.shuffle(known(kind, 1).concat(known(rest[0], 2), known(rest[1], 1))), at = list.findIndex((t) => t.kind === kind);
      return C(`${nm(kind)}인 것은?`, list.map((t) => t.name), at, {
        explain: `${josa(list[at].name, '이/가')} ${KIND[kind]}이다. ${WHY[kind]}`, facts: { kindPick: { kinds: list.map((t) => t.kind), target: kind } }
      });
    })
  ]);

  // ── 모양의 특징 ──────────────────────────────────────────────
  // 설명이 꼭 한 모양에만 맞는가를 표에서 다시 따진 참·거짓
  const fits = (keys, kind) => keys.every((key) => SAY[key].ok(kind) === true);
  B.addTypes('1-1-2', 'feature', [
    T('feat-one', '설명에 알맞은 모양(생김새)', '①17', (d, n) => {
      const key = ['sharpYes', 'onlyRound', 'both', 'onlyFlat'][n], truth = KINDS.map((k) => fits([key], k)), at = truth.indexOf(true);
      return C('설명에 알맞은 모양은?', kindOptions(), at, { figure: conditions([SAY[key].text]), explain: LOOK[KINDS[at]], facts: { truth, want: true } });
    }, { count: 4 }),
    T('feat-move', '설명에 알맞은 모양(굴리기와 쌓기)', '①17·24 심13', (d, n) => {
      const key = ['rollNo', 'rollAny', 'rollStack'][n], truth = KINDS.map((k) => fits([key], k)), at = truth.indexOf(true);
      return C('설명에 알맞은 모양은?', kindOptions(), at, { figure: conditions([SAY[key].text]), explain: MOVE[KINDS[at]], facts: { truth, want: true } });
    }, { count: 3 }),
    T('feat-thing', '설명에 알맞은 물건', '①18', (d, n) => {
      const key = ['flatNo', 'roundNo', 'rollLie'][n];
      // 「눕히면 잘 굴러간다」는 세워 놓은 둥근기둥 모양 하나와 상자 모양 둘 가운데에서 고른다(공 모양에는 쓰지 않는 말이다).
      const list = n === 2 ? d.shuffle(take(d, 'box', 2, true).concat([d.pick(THINGS.filter((t) => t.spec[0] === 'cyl' && !t.odd))])) : d.shuffle(KINDS.map((k) => take(d, k, 1, true)[0]));
      const truth = list.map((t) => fits([key], t.kind)), at = truth.indexOf(true);
      return C('설명에 알맞은 물건은?', MARKS.slice(0, 3), at, {
        figure: conditions([SAY[key].text]) + things(list, { tags: MARKS }), explain: `${josa(list[at].name, '은/는')} ${KIND[list[at].kind]}이다. ${SUM[list[at].kind]}`, facts: { truth, want: true }
      });
    }, { count: 3 }),
    T('feat-both', '두 설명에 모두 알맞은 모양·물건', '①20 심15', (d, n) => {
      const keys = n === 0 ? ['flatYes', 'sharpNo'] : ['sharpNo', 'flatNo'], said2 = conditions(keys.map((key) => SAY[key].text));
      if (n === 0) {
        const truth = KINDS.map((k) => fits(keys, k)), at = truth.indexOf(true);
        return C('두 설명에 모두 알맞은 모양은?', kindOptions(), at, { figure: said2, explain: '평평한 부분이 있는 모양은 상자 모양과 둥근기둥 모양이다. 이 가운데 뾰족한 부분이 없는 모양은 둥근기둥 모양이다.', facts: { truth, want: true } });
      }
      const list = d.shuffle(KINDS.map((k) => take(d, k, 1, true)[0])), truth = list.map((t) => fits(keys, t.kind)), at = truth.indexOf(true);
      return C('두 설명에 모두 알맞은 물건은?', MARKS.slice(0, 3), at, {
        figure: said2 + things(list, { tags: MARKS }), explain: `뾰족한 부분도 평평한 부분도 없으면 공 모양이다. ${josa(list[at].name, '이/가')} 공 모양이다.`, facts: { truth, want: true }
      });
    }, { count: 2 }),
    T('feat-touch', '만져 본 느낌으로 모양 알기', '①20 심19', (d) => {
      const kind = d.pick(KINDS), clue = { box: '만져 보니 뾰족한 부분이 있다.', cyl: '만져 보니 둥근 부분도 있고 평평한 부분도 있다.', ball: '만져 보니 어디나 둥글다.' }[kind];
      return C('주머니 속 모양은 어떤 모양인가?', kindOptions(), KINDS.indexOf(kind), { figure: pouch() + conditions([clue]), explain: WHY[kind], facts: { kindPick: { kinds: KINDS, target: kind } } });
    }),
    T('feat-true', '한 모양을 바르게 설명한 것', '①21 심17', (d, n) => {
      const kind = ['ball', 'box', 'cyl'][n], keys = pickSays(d, kind, 1, 3), truth = keys.map((key) => SAY[key].ok(kind) === true);
      return C('이 모양을 바르게 설명한 것은?', keys.map((key) => SAY[key].text), truth.indexOf(true), { figure: shown(kind), explain: SUM[kind], facts: { truth, want: true } });
    }, { count: 3 }),
    T('feat-false', '한 물건을 잘못 설명한 것', '①22 심19', (d, n) => {
      const kind = ['cyl', 'ball', 'box'][n], t = d.pick(take(d, kind, 5, true)), keys = pickSays(d, kind, 3, 1), truth = keys.map((key) => SAY[key].ok(kind) === true);
      return C('이 물건을 잘못 설명한 것은?', keys.map((key) => SAY[key].text), truth.indexOf(false), { figure: one(t), explain: `${josa(t.name, '은/는')} ${KIND[kind]}이다. ${SUM[kind]}`, facts: { truth, want: false } });
    }, { count: 3 }),
    T('feat-each', '모양마다 붙인 설명 가운데 틀린 것', '①23', (d) => {
      const order = d.shuffle(KINDS), bad = d.pick(KINDS);
      const keys = d.until(() => order.map((k) => d.pick(Object.keys(SAY).filter((key) => key !== 'onlyFlat' && SAY[key].ok(k) === (k !== bad)))), (list) => new Set(list).size === 3);
      return C('잘못 설명한 것은?', order.map((k, i) => `${nm(k)}은 ${SAY[keys[i]].text}`), order.indexOf(bad), { explain: SUM[bad], facts: { truth: order.map((k, i) => SAY[keys[i]].ok(k) === true), want: false } });
    }),
    T('feat-count', '설명에 알맞은 물건의 수', '①25 심21', (d) => {
      const key = d.pick(['sharpYes', 'flatNo', 'both']), kind = KINDS.find((k) => fits([key], k)), rest = d.shuffle(KINDS.filter((k) => k !== kind)), a = d.int(2, 4), b = d.int(1, 6 - a);
      const list = mixed(d, { [kind]: a, [rest[0]]: b, [rest[1]]: 7 - a - b }, true);
      return N('설명에 알맞은 물건은 몇 개인가?', a, {
        unit: '개', figure: conditions([SAY[key].text]) + things(list), explain: `${SAY[key].text.slice(0, -1).replace(/있다$/, '있는').replace(/없다$/, '없는')} 모양은 ${KIND[kind]}이다. ${listed(list.filter((t) => t.kind === kind).map((t) => t.name), '이/가')} ${KIND[kind]}이다.`,
        facts: { count: list.map((t) => fits([key], t.kind)) }
      });
    }),
    T('feat-wheel', '바퀴로 쓸 수 없는 모양', '①26', () => C('바퀴로 쓸 수 없는 모양은?', kindOptions(), 0, {
      explain: '바퀴는 잘 굴러가야 한다. 상자 모양은 잘 굴러가지 않는다.', facts: { truth: KINDS.map((k) => !ROLLS[k]), want: true }
    })),
    T('feat-tower', '가진 모양을 쌓을 수 없는 사람', '①28', (d) => {
      const names = d.shuffle(NAMES).slice(0, 3), sets = d.shuffle([{ ball: d.int(2, 3) }, { box: d.int(1, 2), cyl: d.int(1, 2) }, d.bool() ? { box: d.int(2, 3) } : { cyl: d.int(2, 3) }]), truth = sets.map((s) => KINDS.every((k) => !s[k] || !STACKS[k]));
      return C('모양을 쌓을 수 없는 사람은?', names, truth.indexOf(true), {
        figure: G.tiles(sets.map((s, i) => [names[i], loose(s, { head: names[i] + '의 모양' })])), explain: '공 모양은 쌓을 수 없다. 상자 모양은 잘 쌓을 수 있고, 둥근기둥 모양은 세우면 쌓을 수 있다.', facts: { truth, want: true }
      });
    }),
    T('feat-why', '축구공이 공 모양인 까닭', '①29', (d) => {
      const rows = d.shuffle([['어느 쪽으로도 잘 굴러가야 해서', true], ['잘 쌓을 수 있어야 해서', false], ['뾰족한 부분이 있어야 해서', false], ['평평한 부분이 있어야 해서', false]]);
      return C('축구공이 공 모양인 까닭은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), { explain: '공 모양은 어느 쪽으로도 잘 굴러간다. 축구공은 어느 쪽으로 차도 잘 굴러가야 한다.', facts: { truth: rows.map((r) => r[1]), want: true } });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
