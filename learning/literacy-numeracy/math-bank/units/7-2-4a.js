// 중학교 1학년 2학기 4단원 입체도형의 성질 — 단원 틀, 그림 도구(겨냥도·전개도·회전시키는 평면도형), 앞쪽 묶음(다면체, 정다면체, 회전체와 단면·전개도).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1·2: 89·99꼴, 심화꼴 72꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-2-4/싣기_대조표.md 에 있다.
// (겉넓이와 부피의 기본 문항은 7-2-4b.js 에, 실력 문항은 7-2-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 9수03-07 「다면체와 회전체의 성질을 탐구하고, 이를 설명할 수 있다」, 9수03-08 「입체도형의 겉넓이와 부피를 구할 수 있다」.
//
// 싣는 기준
//  - 초등 6학년에서 배운 것(각기둥·각뿔의 면·모서리·꼭짓점 세기, 원기둥·원뿔·구의 구성 요소, 직육면체의 부피와 겉넓이)을 그대로 다시 묻지 않는다.
//    이 단원의 문항은 각뿔대, n으로 나타낸 개수, 「□면체」, 정다면체, 회전체와 단면, π를 쓰는 겉넓이·부피, 뿔과 구의 부피를 쓴다.
//  - 교육과정의 금: 「회전체 단면의 모양은 회전체의 성질을 이해하는 데 필요한 정도로 다룬다」 — 단면은 회전축에 수직인 평면(원)과 회전축을 포함하는 평면(선대칭도형, 모두 합동)으로
//    자른 것만 싣는다. 「다각형과 다면체는 그 모양이 볼록인 경우만 다룬다」. 「복잡하게 변형된 … 입체도형의 겉넓이와 부피를 구하는 문제는 다루지 않는다」 —
//    기본에는 입체 하나(각기둥·원기둥·각뿔·원뿔·구·반구, 밑면이 부채꼴·반원인 기둥)만, 실력에는 한두 번 더 셈하는 것(속이 뚫린 원기둥, 원기둥에 원뿔이나 반구 하나를 붙인 것,
//    잘라 낸 뿔의 치수가 그림에 적힌 뿔대, 평면도형 하나를 돌린 회전체)까지만 싣는다.
//  - 용어는 교육과정의 것(다면체, 각뿔대, 정다면체, 회전체, 회전축, 원뿔대)과 초등에서 배운 것(모선, 겨냥도, 전개도, 밑면, 옆면)을 쓴다. 원주율은 π.
//  - 답: 개수는 「개」, 길이는 cm. 이름은 「□각뿔대」「□면체」「정□면체」의 □를 수로 받거나 고르기로 받는다. π가 드는 넓이·부피는 π의 계수를 받고 칸 뒤에 「π cm²」「π cm³」를 적는다.
//    한 유형(차례)의 답은 늘 자연수 계수이거나 늘 분수 계수이다(구의 부피는 반지름이 3의 배수인 유형과 아닌 유형을 따로 두었다).
//  - 그림은 셈하여 그린다. 보이지 않는 모서리와 가려진 밑면의 둘레는 점선이다. 치수는 그림에 적힌 수가 정하고, 그림 설명(aria-label)에 그림에 적힌 것을 모두 말로 적는다.
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-2-4b.js, 7-2-4c.js 의 것까지 여기에 모아 적는다)
//  - 교과서 본문에 없는 관계식 v − e + f = 2(①14 심10), 면을 세어 모서리를 구하는 요령(심11), 꼭짓점마다 잘라 낸 입체를 떠올려 세기(심12).
//  - 면의 한가운데를 이어 새 입체를 떠올리는 것(①23 ②23), 전개도를 접어 자리를 따지는 일이 대부분인 것과 쪽 그림에서 배치를 확인하지 못한 전개도(①24·25 심15~18),
//    다면체를 자른 단면(심19), 최단 거리(심20), 쌓기나무 규칙(심21).
//  - 회전축에 수직도 아니고 회전축을 포함하지도 않는 단면·고리 모양 단면·오목한 단면(①36 ②34·35), 굴린 원뿔의 자취(①38 심58), 요령으로 구하는 길이(심32의 ⑵).
//  - 복잡하게 변형된 입체(교육과정의 금): 세 번 넘게 셈하는 겉넓이(①51·67 ②52·71 심60, ①40의 오각기둥·①87의 원뿔대 겉넓이), 뚫리거나 잘린 직육면체(①52·53 ②54·55 심40~46),
//    기울인 그릇(①70 ②98 심52), 구와 정팔면체(①81 ②82 심66), 원기둥과 구 여럿(①79 ②97 심63·64·67), 속이 파인 반구(②90 심69),
//    도형 둘·셋을 이어 붙이거나 뺀 평면도형을 돌린 것(①88·89 ②88·89 심70·71·72), 부채꼴 띠 기둥·비스듬히 잘린 원기둥·도려낸 구(심39·47·68), 칸막이 수조(심48).
//  - 닮음(중2)이 있어야 길이가 나오는 것(①69 심54·61), 길이 없이 비로만 따지는 것(②99 심50·65), 접은 모양을 떠올려야 하는 것(심51).
//  - 초등 내용 그대로인 것(①6·24 심6·34 — 각기둥·각뿔의 개수, 직육면체의 겉넓이. ①3·44·45 ②8에 섞인 각기둥·직육면체 부분도 뗐다),
//    뜻 없는 셈(①18 — 따로 구한 개수를 다시 더하고 곱하기. ①8 심2·3은 하나하나 구하는 일과 견주는 일로 바꾸어 실었다).
//  - 그리기·까닭 쓰기(①22·28·35 ②22·27·28)는 고르기와 수 답으로 바꾸어 실었다. 쪽 그림에서도 그림을 알 수 없는 것(①78 ②37·56·76 심22~26·31)은 싣지 않았다.
//  - 같은 일이어서 한 번만 실은 것: ①65(원뿔과 부피가 같은 원기둥의 높이 = 물 붓기), ②47(겉넓이에서 밑넓이를 빼고 둘레로 나누기 = 원기둥의 겉넓이로 높이),
//    ②69(원뿔대의 부피 — 사다리꼴을 돌린 꼴로 실었다), ②94(원기둥 둘의 부피 = 두 입체의 부피를 더하기), ②44·61·74·91(글만 남아 그림을 모르는 묶음 — 같은 계열의 꼴에 들어 있다).
//  - 「회전체의 겉넓이와 부피」는 묶음을 따로 두지 않았다. 평면도형을 돌려 회전체를 알아낸 뒤 셈하는 꼴은 모두 실력의 잣대(한두 번 더 생각하는 것)에 들어 실력 묶음에 실었다.
//
// 2026-10-13 다시 보기 — 「수학 실력에 필요한 문제는 모두 싣는다」는 기준으로 위의 「뺀 것」을 다시 보았다. 꼴마다의 판정은 싣기_대조표.md 에 있고, 다시 실은 유형은 7-2-4c.js 에 있다.
//  - 다시 실은 것: 면의 한가운데를 이은 정다면체(①23 ②23), 면의 모양과 개수로 모서리 세기(심11), 꼭짓점마다 잘라 낸 각기둥(심12), 세 점을 지나는 평면으로 자른 정육면체(심19),
//    고리 모양 단면(①36), 원기둥의 단면이 될 수 없는 모양(②34), 굴린 원뿔(①38 심58), 빗변이 회전축일 때 가장 큰 단면의 반지름(심32의 ⑵),
//    세 번 넘게 셈하는 겉넓이(①51·67 ②52·71 심60, ①40의 오각기둥, ①87의 원뿔대), 구멍·홈이 있는 기둥(①52 ②54 심40·41, ①50의 겉넓이), 부채꼴 띠 기둥과 비스듬히 잘린 원기둥(심39·47),
//    기울인 그릇(①70 ②98 심52), 구와 정팔면체(①81 ②82 심66), 원기둥과 구 여럿(①79 ②97 심63·64·67), 도형 둘·셋을 잇거나 뺀 평면도형을 돌린 것(①88 ②88·89·90 심69·70·71),
//    길이 없이 비로 따지는 것(②99 심50·65), 접어 만든 삼각뿔(심51), 구의 4등분 조각과 구 안의 원뿔(②76 ①78 — 그림은 풀이로 되살렸다),
//    원뿔 그릇에 물이 차는 시간(①69 심54)과 회전축에서 떨어진 직각삼각형(심61) — 닮음 없이 풀리도록 길이를 그림에 모두 적었다.
//  - 그대로 뺀 것: 초등 내용 그대로(①6·24·53 심6·18·34·42~45·48), 뜻 없는 셈(①14·18), 그림을 끝내 알 수 없는 것(①25 ②37·55·56 심15~17·23~26·46·72),
//    오목한 단면 그리기(②35), 이미 실은 유형과 같은 일(심10·68), 답이 그림에서 보이는 것(심20), 규칙 찾기(심21).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, N, M, C, F } = B.kit;
  const G = B.kit.geo;
  const { V, claimQ, gcd } = B.kit.mid;
  const SOLID = '9수03-07', MEAS = '9수03-08';
  // 기본 문항. 심화 자료에서만 나온 꼴(ref 가 「심」으로만 이루어진 것)은 출처를 심화 자료로 적는다.
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')', make }, more || {});
  // 원주율: 글에는 수식 글꼴의 π, 답 칸 뒤의 단위에는 글자 그대로의 π(답 칸의 단위는 기록에 글 그대로 남는다).
  const PI = V('π'), U2 = 'π cm²', U3 = 'π cm³', UL = 'π cm';
  const TAGS = ['가', '나', '다', '라', '마', '바'], KEYS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];
  const cm = (v) => v + ' cm';
  const calc = (expr, unseen) => Object.assign({ calc: [[expr, 0]] }, unseen && unseen.length ? { unseen } : {});
  const fixed = (...values) => ({ calc: values.map((v, i) => [String(v), i]), unseen: values });
  const sum = (list) => list.reduce((s, v) => s + v, 0);

  // ── 이름 ─────────────────────────────────────────────────────
  const NUMW = { 3: '삼', 4: '사', 5: '오', 6: '육', 7: '칠', 8: '팔', 9: '구', 10: '십', 11: '십일', 12: '십이', 13: '십삼', 14: '십사', 20: '이십' };
  const gon = (n) => NUMW[n] + '각형', hedron = (k) => NUMW[k] + '면체';
  // 각기둥·각뿔·각뿔대: 면·모서리·꼭짓점의 개수와 그것을 셈하는 식(검사용·풀이용)
  const KIND = {
    prism: { word: '각기둥', side: '직사각형', f: [1, 2], e: [3, 0], v: [2, 0] },
    pyr: { word: '각뿔', side: '삼각형', f: [1, 1], e: [2, 0], v: [1, 1] },
    frus: { word: '각뿔대', side: '사다리꼴', f: [1, 2], e: [3, 0], v: [2, 0] }
  };
  const PART = { f: '면', e: '모서리', v: '꼭짓점' };
  const solid = (kind, n) => ({ kind, n, name: NUMW[n] + KIND[kind].word });
  const cnt = (s, part) => KIND[s.kind][part][0] * s.n + KIND[s.kind][part][1];
  // 검사 식(7+2, 3*7)과 풀이 식(7 + 2 = 9, 3 × 7 = 21), n을 쓴 식(n + 2, 3n)
  const cntJs = (s, part) => { const [k, c] = KIND[s.kind][part]; return (k === 1 ? String(s.n) : k + '*' + s.n) + (c ? '+' + c : ''); };
  const cntSay = (s, part) => { const [k, c] = KIND[s.kind][part]; return (k === 1 ? String(s.n) : k + ' × ' + s.n) + (c ? ' + ' + c : '') + ' = ' + cnt(s, part); };
  const cntN = (kind, part) => { const [k, c] = KIND[kind][part]; return (k === 1 ? '' : k) + V('n') + (c ? ' + ' + c : ''); };
  const REG = [
    { f: 4, shape: '정삼각형', p: 3, m: 3, v: 4, e: 6 }, { f: 6, shape: '정사각형', p: 4, m: 3, v: 8, e: 12 }, { f: 8, shape: '정삼각형', p: 3, m: 4, v: 6, e: 12 },
    { f: 12, shape: '정오각형', p: 5, m: 3, v: 20, e: 30 }, { f: 20, shape: '정삼각형', p: 3, m: 5, v: 12, e: 30 }
  ].map((r) => Object.assign(r, { name: '정' + NUMW[r.f] + '면체' }));

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
  // 낱말 하나 고르기
  function pickWord(d, text, want, others, explain, figure) {
    const options = d.shuffle([want].concat(others));
    return C(text, options, options.indexOf(want), { figure, explain, facts: { truth: options.map((o) => o === want), want: true } });
  }
  // 이름표를 붙여 늘어놓은 낱말들
  const words = (list, keys) => '<div class="mb-numbers">' + list.map((w, i) => '<span style="font-size:1.05rem">' + (keys ? keys[i] + '. ' : '') + w + '</span>').join('') + '</div>';
  const listed = (list) => list.join(', ');
  // 만든 문항의 facts 에 덧붙인다(같은 글로 다른 그림을 묻는 차례에 rule 이름을 달 때).
  const more = (item, extra) => { Object.assign(item.facts, extra.facts); return item; };

  // ── 그림(픽셀 단위) ──────────────────────────────────────────
  // 눈높이: 평평하게 놓인 원(반지름 r)은 가로 반지름 r, 세로 반지름 r × TILT 인 타원으로 보인다. 화면에서 아래쪽이 앞이다.
  const RAD = Math.PI / 180, TILT = 0.3;
  const f1 = (n) => Math.round(n * 10) / 10;
  const xy = (p) => f1(p[0]) + ' ' + f1(p[1]);
  const ptsOf = (list) => list.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ');
  const CREAM = '#fff8e1', SKY = '#dbeafe', SAND = '#fde3a7', ROSE = '#fecdd3', INK = '#1f2933';
  const MATH = "font-family:'MB Math','Times New Roman',serif;font-style:italic";
  const isMark = (text) => /^[㉠-㉤]$/.test(text);
  // 글의 너비(어림): 한글·기호는 글자 크기만큼, 숫자·로마자는 그 0.58배
  const wide = (text, size) => Array.from(String(text)).reduce((s, ch) => s + (/[0-9a-zA-Z°π]/.test(ch) ? 0.58 : ch === ' ' || ch === '.' ? 0.3 : 1), 0) * (size || 12);
  // 선분. kind: ''(실선), 'dash'(점선), 'thin'(가는 선)
  const stroke = (p, q, kind, css) => '<line class="mb-line' + (kind === 'dash' ? ' is-cut' : kind === 'thin' ? ' is-thin' : '') + '"' + (css ? ' style="' + css + '"' : '') + ' x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '"/>';
  const curve = (d, kind, css) => '<path class="mb-line' + (kind === 'dash' ? ' is-cut' : kind === 'thin' ? ' is-thin' : '') + '" style="fill:none' + (css ? ';' + css : '') + '" d="' + d + '"/>';
  const blob = (d, color) => '<path d="' + d + 'Z" style="fill:' + color + ';stroke:none"/>';
  const fill = (list, color) => '<polygon points="' + ptsOf(list) + '" style="fill:' + color + ';stroke:none"/>';
  const shape = (list, color) => '<polygon class="mb-poly" points="' + ptsOf(list) + '"' + (color ? ' style="fill:' + color + '"' : '') + '/>';
  const dot = (p, r) => '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + (r || 2.2) + '" style="fill:' + INK + '"/>';
  // 그림 속 글. π는 수식 글꼴로 적는다.
  // kind 에 on-face 가 들면 글자 둘레에 면 색 테두리를 둘러, 밑을 지나는 숨은 모서리 점선이 글자를 가로지르지 않게 한다.
  const HALO = 'paint-order:stroke;stroke:' + CREAM + ';stroke-width:3.4px;stroke-linejoin:round';
  const styleOf = (text, kind) => [isMark(text) ? 'font-size:15px' : '', /on-face/.test(kind || '') ? HALO : ''].filter(Boolean).join(';');
  const word = (p, text, kind) => '<text class="mb-label' + (kind ? ' ' + kind : '') + '"' + (styleOf(text, kind) ? ' style="' + styleOf(text, kind) + '"' : '') + ' x="' + f1(p[0]) + '" y="' + f1(p[1]) + '" text-anchor="middle" dominant-baseline="central">' + String(text).replace(/π/g, '<tspan style="' + MATH + '">π</tspan>') + '</text>';
  // 타원(가운데 c, 반지름 rx·ry) 위의 점. t 는 오른쪽 끝에서 앞쪽(화면 아래)으로 도는 각(도)
  const onEll = (c, rx, ry, t) => [c[0] + rx * Math.cos(t * RAD), c[1] + ry * Math.sin(t * RAD)];
  function arcD(c, rx, ry, t0, t1) {
    const n = Math.max(8, Math.ceil(Math.abs(t1 - t0) / 5)); let out = '';
    for (let k = 0; k <= n; k += 1) out += (k ? 'L' : 'M') + xy(onEll(c, rx, ry, t0 + (t1 - t0) * k / n));
    return out;
  }
  const tail = (d) => 'L' + d.slice(1);
  // 그릴 것을 모으며 차지한 자리를 재어, 끝에 꼭 맞는 크기의 그림으로 낸다.
  function canvas() {
    const parts = []; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const see = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
    const cv = {
      add: (html) => { parts.push(html); return cv; },
      point: (p) => see(p[0], p[1]),
      box: (c, hw, hh) => { see(c[0] - hw, c[1] - hh); see(c[0] + hw, c[1] + hh); },
      // 글(가운데 c). kind: ''(이름), 'is-length'(길이)
      write: (c, text, kind) => { const size = isMark(text) ? 15 : /is-length/.test(kind || '') ? 12 : 13; parts.push(word(c, text, kind)); cv.box(c, wide(text, size) / 2 + 1, size / 2 + 2); return cv; },
      // 너비가 64px 에 못 미치는 그림은 양옆 여백을 넓힌다(화면 검사가 너무 좁은 그림을 떨어뜨린다).
      out: (label, pad) => {
        const m = pad == null ? 6 : pad, side = Math.max(m, (64 - (x1 - x0)) / 2), w = x1 - x0 + side * 2, h = y1 - y0 + m * 2;
        return '<svg class="mb-geo" viewBox="' + f1(x0 - side) + ' ' + f1(y0 - m) + ' ' + f1(w) + ' ' + f1(h) + '" width="' + Math.ceil(w) + '" role="img" aria-label="' + label + '">' + parts.join('') + '</svg>';
      }
    };
    return cv;
  }
  const one = (draw, label, pad) => { const cv = canvas(); draw(cv); return cv.out(label, pad); };
  const tiles = (list, labels) => G.tiles(list.map((svg, i) => [(labels || TAGS)[i], svg]));
  const half = (text) => wide(text, isMark(text) ? 15 : 12) / 2;
  const kindOf = (text) => (isMark(text) ? '' : 'is-length');
  // 선분 p–q 옆에 글을 적는다. away: 이 점의 반대쪽에 적는다(도형의 안쪽 점을 주면 글이 바깥에 놓인다). at: 선분 위의 자리(0~1), gap: 선에서 띄우는 거리
  function beside(cv, p, q, away, text, at, gap, kind) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, t = at == null ? 0.5 : at, m = [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
    if ((away[0] - m[0]) * n[0] + (away[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const far = (gap == null ? 4 : gap) + (half(text) + 1) * Math.abs(n[0]) + 7.5 * Math.abs(n[1]);
    cv.write([m[0] + n[0] * far, m[1] + n[1] * far], text, kind || kindOf(text));
  }
  // 직각 표시: 점 v 에서 a 쪽, b 쪽으로 한 변이 s 인 작은 네모(비스듬히 놓인 면에서는 평행사변형으로 보인다)
  function corner(v, a, b, s) {
    const size = s || 6, ua = [a[0] - v[0], a[1] - v[1]], ub = [b[0] - v[0], b[1] - v[1]], la = Math.hypot(ua[0], ua[1]) || 1, lb = Math.hypot(ub[0], ub[1]) || 1;
    const p1 = [v[0] + ua[0] / la * size, v[1] + ua[1] / la * size], p3 = [v[0] + ub[0] / lb * size, v[1] + ub[1] / lb * size], p2 = [p1[0] + p3[0] - v[0], p1[1] + p3[1] - v[1]];
    return '<polyline class="mb-mark" points="' + ptsOf([p1, p2, p3]) + '"/>';
  }
  // 가리키는 선: spot 에서 at(글 자리) 쪽으로 가는 가는 선을 긋고 글을 적는다.
  function leader(cv, at, spot, text) {
    const dx = at[0] - spot[0], dy = at[1] - spot[1], L = Math.hypot(dx, dy) || 1, gap = Math.abs(dx) > Math.abs(dy) ? half(text) + 3 : 9;
    cv.add(stroke(spot, [at[0] - dx / L * gap, at[1] - dy / L * gap], 'thin'));
    cv.write(at, text, kindOf(text));
  }
  // 세로로 잰 길이: x 자리에 y0~y1 을 잇는 가는 선과 양 끝의 짧은 금, 그 왼쪽에 글
  function dimV(cv, x, y0, y1, text) {
    cv.add(stroke([x, y0], [x, y1], 'thin') + stroke([x - 3, y0], [x + 3, y0], 'thin') + stroke([x - 3, y1], [x + 3, y1], 'thin'));
    cv.write([x - 5 - half(text), (y0 + y1) / 2], text, kindOf(text));
  }

  // ── 그림: 둥근 입체 ──────────────────────────────────────────
  // 원기둥. top: 윗면의 가운데, rx: 밑면의 반지름, h: 높이. o: { side, top: 빛깔, bare: 윗면의 뒤쪽 선을 긋지 않는다 }
  function addCyl(cv, top, rx, h, o) {
    const opt = o || {}, ry = rx * TILT, bot = [top[0], top[1] + h], L = top[0] - rx, R = top[0] + rx;
    cv.box([top[0], top[1] + h / 2], rx, h / 2 + ry);
    cv.add(blob('M' + xy([L, top[1]]) + 'L' + xy([L, bot[1]]) + tail(arcD(bot, rx, ry, 180, 0)) + 'L' + xy([R, top[1]]) + tail(arcD(top, rx, ry, 0, 180)), opt.side || CREAM));
    cv.add(blob(arcD(top, rx, ry, 0, 360), opt.top || CREAM));
    cv.add(curve(arcD(bot, rx, ry, 180, 360), 'dash') + curve(arcD(bot, rx, ry, 180, 0)) + stroke([L, top[1]], [L, bot[1]]) + stroke([R, top[1]], [R, bot[1]]) + curve(arcD(top, rx, ry, 180, 0)));
    if (!opt.bare) cv.add(curve(arcD(top, rx, ry, 180, 360)));
    return { top, bot, rx, ry, h };
  }
  // 원뿔. apex: 꼭짓점, rx: 밑면의 반지름, h: 높이. 옆 선은 꼭짓점에서 밑면 타원에 그은 접선이다.
  function addCone(cv, apex, rx, h, o) {
    const opt = o || {}, ry = rx * TILT, base = [apex[0], apex[1] + h], a = Math.asin(Math.min(0.98, ry / h)) / RAD, tR = onEll(base, rx, ry, -a), tL = onEll(base, rx, ry, 180 + a);
    cv.box([apex[0], apex[1] + (h + ry) / 2], rx, (h + ry) / 2);
    cv.add(blob('M' + xy(apex) + 'L' + xy(tL) + tail(arcD(base, rx, ry, 180 + a, -a)), opt.side || CREAM));
    if (!opt.bare) cv.add(curve(arcD(base, rx, ry, 180 + a, 360 - a), 'dash'));
    cv.add(curve(arcD(base, rx, ry, 180 + a, -a)) + stroke(apex, tL) + stroke(apex, tR));
    return { apex, base, rx, ry, h, tL, tR };
  }
  // 꼭짓점이 아래에 있는 원뿔(그릇·아래로 붙인 원뿔). top: 밑면(위쪽 원)의 가운데. o.open: 윗면의 선을 모두 긋는다(그릇), 아니면 뒤쪽 선은 긋지 않는다.
  function addCup(cv, top, rx, h, o) {
    const opt = o || {}, ry = rx * TILT, apex = [top[0], top[1] + h], a = Math.asin(Math.min(0.98, ry / h)) / RAD, tR = onEll(top, rx, ry, a), tL = onEll(top, rx, ry, 180 - a);
    cv.box([top[0], top[1] + h / 2], rx, h / 2 + ry);
    cv.add(blob('M' + xy(apex) + 'L' + xy(tL) + tail(arcD(top, rx, ry, 180 - a, 180)) + tail(arcD(top, rx, ry, 180, 360)) + tail(arcD(top, rx, ry, 0, a)), opt.side || CREAM));
    if (opt.open) cv.add(blob(arcD(top, rx, ry, 0, 360), opt.top || CREAM) + curve(arcD(top, rx, ry, 0, 360)));
    else cv.add(curve(arcD(top, rx, ry, 0, 180)) + curve(arcD(top, rx, ry, 180, 360), 'dash'));
    cv.add(stroke(apex, tL) + stroke(apex, tR));
    return { apex, top, rx, ry, h, tL, tR };
  }
  // 구. c: 중심, R: 반지름. 가운데를 두르는 원은 앞쪽 반은 가는 실선, 뒤쪽 반은 점선으로 긋는다.
  function addSphere(cv, c, R, o) {
    cv.box(c, R, R);
    cv.add('<circle class="mb-poly" cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + f1(R) + '"' + (o && o.fill ? ' style="fill:' + o.fill + '"' : '') + '/>');
    cv.add(curve(arcD(c, R, R * TILT, 180, 360), 'dash') + curve(arcD(c, R, R * TILT, 180, 0), 'thin'));
    return { c, R };
  }
  // 반구(평평한 면이 아래). c: 평평한 면의 가운데. o.bare: 평평한 면의 선을 긋지 않는다(다른 입체에 붙을 때)
  function addDome(cv, c, R, o) {
    cv.box([c[0], c[1] - R / 2], R, R / 2); cv.box(c, R, R * TILT);
    cv.add(blob(arcD(c, R, R, 180, 360) + tail(arcD(c, R, R * TILT, 0, 180)), CREAM) + curve(arcD(c, R, R, 180, 360)));
    if (!(o && o.bare)) cv.add(curve(arcD(c, R, R * TILT, 180, 360), 'dash') + curve(arcD(c, R, R * TILT, 180, 0)));
  }
  // 반구(평평한 면이 위). c: 평평한 면의 가운데. o.bare: 평평한 면을 그리지 않는다(다른 입체에 붙을 때)
  function addBowl(cv, c, R, o) {
    cv.box([c[0], c[1] + R / 2], R, R / 2); cv.box(c, R, R * TILT);
    cv.add(blob(arcD(c, R, R, 180, 0), CREAM) + curve(arcD(c, R, R, 180, 0)));
    if (!(o && o.bare)) cv.add(blob(arcD(c, R, R * TILT, 0, 360), (o && o.top) || CREAM) + curve(arcD(c, R, R * TILT, 0, 360)));
  }
  // 원뿔대. top: 윗면의 가운데, r1: 위, r2: 아래 반지름
  function addFrustum(cv, top, r1, r2, h, o) {
    const ry1 = r1 * TILT, ry2 = r2 * TILT, bot = [top[0], top[1] + h], s = r2 > r1 ? 1 : -1, a = s * Math.asin(Math.min(0.98, ry2 * Math.abs(r2 - r1) / (h * r2))) / RAD;
    cv.box([top[0], top[1] + h / 2], Math.max(r1, r2), h / 2 + Math.max(ry1, ry2));
    cv.add(blob('M' + xy(onEll(top, r1, ry1, 180 + a)) + 'L' + xy(onEll(bot, r2, ry2, 180 + a)) + tail(arcD(bot, r2, ry2, 180 + a, -a)) + 'L' + xy(onEll(top, r1, ry1, -a)) + tail(arcD(top, r1, ry1, -a, 180 + a)), CREAM));
    cv.add(blob(arcD(top, r1, ry1, 0, 360), (o && o.top) || CREAM));
    cv.add(curve(arcD(bot, r2, ry2, 180 + a, 360 - a), 'dash') + curve(arcD(bot, r2, ry2, 180 + a, -a)) + stroke(onEll(top, r1, ry1, 180 + a), onEll(bot, r2, ry2, 180 + a)) + stroke(onEll(top, r1, ry1, -a), onEll(bot, r2, ry2, -a)) + curve(arcD(top, r1, ry1, 0, 360)));
    return { top, bot, r1, r2, ry1, ry2, tR: [onEll(top, r1, ry1, -a), onEll(bot, r2, ry2, -a)] };
  }

  // ── 그림: 면이 평평한 입체 ───────────────────────────────────
  // verts: [x, y(안쪽), z(위)](px), faces: 꼭짓점 번호의 고리. o: { sk: 안쪽으로 갈수록 오른쪽으로 밀리는 정도, tl: 위로 밀리는 정도, fill }
  // 보이는 면만 칠하고, 보이는 면에 닿은 모서리는 실선, 나머지는 점선으로 긋는다. 화면 좌표를 돌려준다.
  function addPoly(cv, at, verts, faces, o) {
    const opt = o || {}, sk = opt.sk || 0, tl = opt.tl == null ? TILT : opt.tl;
    const sub3 = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]], dot3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
    const cross3 = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
    const avg = (list) => [0, 1, 2].map((i) => list.reduce((s, p) => s + p[i], 0) / list.length), heart = avg(verts);
    const seen = faces.map((ring) => { let n = cross3(sub3(verts[ring[1]], verts[ring[0]]), sub3(verts[ring[2]], verts[ring[0]])); if (dot3(n, sub3(avg(ring.map((v) => verts[v])), heart)) < 0) n = n.map((x) => -x); return dot3(n, [sk, -1, tl]) > 1e-9; });
    const P = verts.map(([x, y, z]) => [at[0] + x + y * sk, at[1] - (z + y * tl)]), sides = new Map();
    P.forEach(cv.point);
    faces.forEach((ring, f) => { if (seen[f]) cv.add(fill(ring.map((v) => P[v]), opt.fill || CREAM)); ring.forEach((v, i) => { const w = ring[(i + 1) % ring.length], key = Math.min(v, w) + '-' + Math.max(v, w); sides.set(key, (sides.get(key) || false) || seen[f]); }); });
    for (const pass of [false, true]) sides.forEach((shown, key) => { if (shown !== pass) return; const [v, w] = key.split('-').map(Number); cv.add(stroke(P[v], P[w], shown ? '' : 'dash')); });
    return P;
  }
  const ngon = (n, R, turn) => Array.from({ length: n }, (_, i) => [R * Math.cos((turn + 360 * i / n) * RAD), R * Math.sin((turn + 360 * i / n) * RAD)]);
  const ring = (n, from) => Array.from({ length: n }, (_, i) => (from || 0) + i);
  function prismOf(n, R, H, turn) {
    const base = ngon(n, R, turn), r = ring(n);
    return { verts: base.map(([x, y]) => [x, y, 0]).concat(base.map(([x, y]) => [x, y, H])), faces: [r, ring(n, n)].concat(r.map((i) => [i, (i + 1) % n, (i + 1) % n + n, i + n])) };
  }
  function pyramidOf(n, R, H, turn) {
    const base = ngon(n, R, turn), r = ring(n);
    return { verts: base.map(([x, y]) => [x, y, 0]).concat([[0, 0, H]]), faces: [r].concat(r.map((i) => [i, (i + 1) % n, n])) };
  }
  // 각뿔대: 위 밑면(반지름 R1)이 아래 밑면(반지름 R2)보다 작다.
  function frustumOf(n, R1, R2, H, turn) {
    const low = ngon(n, R2, turn), up = ngon(n, R1, turn), r = ring(n);
    return { verts: low.map(([x, y]) => [x, y, 0]).concat(up.map(([x, y]) => [x, y, H])), faces: [r, ring(n, n)].concat(r.map((i) => [i, (i + 1) % n, (i + 1) % n + n, i + n])) };
  }
  // 각뿔 2개를 밑면끼리 맞붙인 입체(n = 4 이면 팔면체, n = 3 이면 면이 6개)
  function bipyramidOf(n, R, H, turn) {
    const base = ngon(n, R, turn), r = ring(n);
    return { verts: base.map(([x, y]) => [x, y, 0]).concat([[0, 0, H], [0, 0, -H]]), faces: r.map((i) => [i, (i + 1) % n, n]).concat(r.map((i) => [i, (i + 1) % n, n + 1])) };
  }
  // 직육면체(가로 2a, 세로 2b, 높이 c)의 한 꼭짓점(오른쪽 앞 위)을 세 모서리 위의 점을 지나는 평면으로 잘라 낸 입체. 면은 7개.
  function cutBoxOf(a, b, c, t) {
    return { verts: [[-a, -b, 0], [a, -b, 0], [a, b, 0], [-a, b, 0], [-a, -b, c], [a, b, c], [-a, b, c], [a - t, -b, c], [a, -b + t, c], [a, -b, c - t]],
      faces: [[0, 1, 2, 3], [4, 7, 8, 5, 6], [0, 1, 9, 7, 4], [1, 2, 5, 8, 9], [2, 3, 6, 5], [3, 0, 4, 6], [7, 8, 9]] };
  }
  const TURN = { 3: -84, 4: -62, 5: -80, 6: -8 };
  // 작은 그림 칸에 넣는 입체들. round: 회전체인가, faces: 면의 개수(다면체), said: 그림 설명
  const ART = {
    cyl: { round: true, name: '원기둥', draw: (cv) => addCyl(cv, [0, 0], 25, 46), said: '원기둥' },
    cone: { round: true, name: '원뿔', draw: (cv) => addCone(cv, [0, 0], 26, 54), said: '원뿔' },
    ball: { round: true, name: '구', draw: (cv) => addSphere(cv, [0, 0], 27), said: '구' },
    bowl: { round: true, name: '반구', draw: (cv) => addBowl(cv, [0, 0], 28), said: '반구' },
    cfrus: { round: true, name: '원뿔대', draw: (cv) => addFrustum(cv, [0, 0], 15, 27, 44), said: '원뿔대' },
    octa: { round: false, name: '팔면체', faces: 8, kind: 'other', draw: (cv) => { const p = bipyramidOf(4, 27, 31, -62); addPoly(cv, [0, 0], p.verts, p.faces); }, said: '사각뿔 2개를 밑면끼리 맞붙인 모양의 입체도형' }
  };
  [3, 4, 5, 6].forEach((n) => {
    ART['prism' + n] = { round: false, kind: 'prism', n, name: NUMW[n] + '각기둥', faces: n + 2, draw: (cv) => { const p = prismOf(n, 27, 44, TURN[n]); addPoly(cv, [0, 0], p.verts, p.faces); }, said: `위와 아래의 면이 합동인 ${gon(n)}인 기둥 모양의 입체도형` };
    ART['pyr' + n] = { round: false, kind: 'pyr', n, name: NUMW[n] + '각뿔', faces: n + 1, draw: (cv) => { const p = pyramidOf(n, 28, 52, TURN[n]); addPoly(cv, [0, 0], p.verts, p.faces); }, said: `아래의 면이 ${gon(n)}이고 위가 뾰족한 입체도형` };
    ART['frus' + n] = { round: false, kind: 'frus', n, name: NUMW[n] + '각뿔대', faces: n + 2, draw: (cv) => { const p = frustumOf(n, n === 3 ? 15 : 16, 29, 42, TURN[n]); addPoly(cv, [0, 0], p.verts, p.faces); }, said: `위의 면이 아래의 면보다 작은 ${gon(n)}이고 옆면이 모두 사다리꼴인 입체도형` };
  });
  const art = (key) => one((cv) => ART[key].draw(cv), ART[key].said + '의 겨냥도');
  // 큰 겨냥도 하나(이름을 묻는 문항): k 배로 키워 그린다.
  function bigArt(kind, n) {
    const p = kind === 'prism' ? prismOf(n, 44, 70, TURN[n]) : kind === 'pyr' ? pyramidOf(n, 46, 84, TURN[n]) : frustumOf(n, 25, 47, 66, TURN[n]);
    return one((cv) => addPoly(cv, [0, 0], p.verts, p.faces), ART[kind + n].said + '의 겨냥도');
  }

  // ── 그림: 치수를 적은 둥근 입체의 겨냥도 ─────────────────────
  // 화면 크기: 반지름 r, 높이 h(cm)를 한 그림 안에 알맞게 넣는 배율
  const scaleOf = (r, h, maxR, maxH) => Math.min((maxR || 52) / r, (maxH || 104) / h);
  const clampR = (v) => Math.max(22, v), clampH = (v) => Math.max(26, v);
  // 원기둥. o: { r: 반지름 글, d: 지름 글, h: 높이 글, label }
  function cylFig(r, h, o) {
    const k = scaleOf(r, h), rx = clampR(r * k), hh = clampH(h * k), cv = canvas(), s = addCyl(cv, [0, 0], rx, hh);
    if (o.r) { cv.add(stroke([0, 0], [rx, 0], 'thin') + dot([0, 0])); cv.write([rx / 2 + 2, -s.ry - 9], o.r, kindOf(o.r)); }
    if (o.d) { cv.add(stroke([-rx, 0], [rx, 0], 'thin') + dot([0, 0])); cv.write([0, -s.ry - 9], o.d, kindOf(o.d)); }
    if (o.h) cv.write([rx + 5 + half(o.h), hh / 2], o.h, kindOf(o.h));
    return cv.out(o.label);
  }
  // 원뿔. o: { r, h, l: 반지름·높이·모선 글, label }. 높이를 적으면 꼭짓점에서 밑면의 중심까지 점선과 직각 표시를 긋는다.
  function coneFig(r, h, o) {
    const k = scaleOf(r, h), rx = clampR(r * k), hh = clampH(h * k), cv = canvas(), s = addCone(cv, [0, 0], rx, hh), c = [0, hh];
    if (o.h) { cv.add(stroke([0, 0], c, 'dash') + stroke(c, [rx, hh], 'dash') + corner(c, [0, 0], [rx, hh]) + dot(c)); if (2 * half(o.h) + 9 <= rx * 0.66 && hh * 0.34 >= s.ry + 8) cv.write([-4 - half(o.h), hh * 0.66], o.h, isMark(o.h) ? '' : 'is-length on-face'); else leader(cv, [-rx * 0.5 - 8 - half(o.h), hh * 0.3], [0, hh * 0.45], o.h); }
    else if (o.r) cv.add(stroke(c, [rx, hh], 'dash') + dot(c));
    if (o.r) cv.write([rx / 2 + 2, hh + s.ry * 0.87 + 9], o.r, kindOf(o.r));
    if (o.l) beside(cv, [0, 0], s.tR, [-rx, hh], o.l);
    return cv.out(o.label);
  }
  // 구. o: { r: 반지름 글, d: 지름 글, label }
  function sphereFig(R, o) {
    const cv = canvas(); addSphere(cv, [0, 0], R);
    const p = onEll([0, 0], R, R, -38), q = onEll([0, 0], R, R, 142);
    if (o.r) { cv.add(stroke([0, 0], p, 'thin') + dot([0, 0])); beside(cv, [0, 0], p, [0, R], o.r, 0.55, 3); }
    if (o.d) { cv.add(stroke(q, p, 'thin') + dot([0, 0])); beside(cv, [0, 0], p, [0, R], o.d, 0.5, 3); }
    return cv.out(o.label);
  }
  // 반구(평평한 면이 위). o: { r, label }
  function hemiFig(R, o) {
    const cv = canvas(); addBowl(cv, [0, 0], R);
    if (o.r) { cv.add(stroke([0, 0], [R, 0], 'thin') + dot([0, 0])); cv.write([R / 2, -R * TILT - 9], o.r, kindOf(o.r)); }
    return cv.out(o.label);
  }
  // 원뿔대. r1: 위, r2: 아래 반지름(cm), h: 화면에 그릴 높이의 바탕이 되는 수. o: { r1, r2, h, l: 글, label }
  function coneFrustumFig(r1, r2, h, o) {
    const k = scaleOf(r2, h, 56, 70), a = r1 * k, b = r2 * k, hh = clampH(h * k), cv = canvas(), s = addFrustum(cv, [0, 0], a, b, hh);
    if (o.r1) { cv.add(stroke([0, 0], [a, 0], 'thin') + dot([0, 0])); cv.write([a / 2 + 1, -s.ry1 - 9], o.r1, kindOf(o.r1)); }
    if (o.r2) { cv.add(stroke([0, hh], [b, hh], 'dash') + dot([0, hh])); cv.write([b / 2 + 2, hh + s.ry2 * 0.87 + 9], o.r2, kindOf(o.r2)); }
    if (o.h) { cv.add(stroke([0, 0], [0, hh], 'dash') + corner([0, hh], [0, 0], [b, hh])); cv.write([-4 - half(o.h), hh / 2], o.h, kindOf(o.h)); }
    if (o.l) beside(cv, s.tR[0], s.tR[1], [0, hh / 2], o.l);
    return cv.out(o.label);
  }

  // ── 그림: 전개도 ─────────────────────────────────────────────
  // 원기둥의 전개도(옆면인 직사각형의 위와 아래에 밑면인 원). r: 밑면의 반지름(px) — 옆면의 가로는 밑면의 둘레에 맞춘다. o: { w, h, r: 가로·세로·반지름 글, label }
  function cylNet(r, h, o) {
    const w = 2 * Math.PI * r, cv = canvas();
    [[0, 0], [w, h]].forEach(cv.point);
    cv.add(shape([[0, 0], [0, h], [w, h], [w, 0]]));
    [[w / 2, -r], [w / 2, h + r]].forEach((c) => { cv.box(c, r, r); cv.add('<circle class="mb-poly" cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + f1(r) + '"/>'); });
    if (o.r) { const c = [w / 2, -r]; cv.add(stroke(c, [c[0] + r, c[1]], 'thin') + dot(c)); cv.write([c[0] + r + 5 + half(o.r), c[1]], o.r, kindOf(o.r)); }
    if (o.w) { cv.add(stroke([3, h / 2], [w / 2 - half(o.w) - 5, h / 2], 'thin') + stroke([w / 2 + half(o.w) + 5, h / 2], [w - 3, h / 2], 'thin') + stroke([3, h / 2 - 4], [3, h / 2 + 4], 'thin') + stroke([w - 3, h / 2 - 4], [w - 3, h / 2 + 4], 'thin')); cv.write([w / 2, h / 2], o.w, kindOf(o.w)); }
    if (o.h) cv.write([w + 5 + half(o.h), h / 2], o.h, kindOf(o.h));
    return cv.out(o.label, 5);
  }
  // 원뿔의 전개도(옆면인 부채꼴과 그 호에 닿은 밑면인 원). l: 부채꼴의 반지름(px), r: 원의 반지름(px) — 부채꼴의 중심각은 360° × r ÷ l.
  // o: { l, r: 글, angle: 중심각 글, arc: 호 옆에 적는 글, label }
  function coneNet(l, r, o) {
    const ang = 360 * r / l, a0 = 90 - ang / 2, a1 = 90 + ang / 2, O = [0, 0], cv = canvas(), c = [0, l + r];
    for (let t = a0; t <= a1 + 0.01; t += ang / 12) cv.point(onEll(O, l, l, t));
    cv.point(O);
    cv.add('<path class="mb-poly" d="M0 0L' + xy(onEll(O, l, l, a0)) + tail(arcD(O, l, l, a0, a1)) + 'Z"/>');
    cv.box(c, r, r); cv.add('<circle class="mb-poly" cx="0" cy="' + f1(c[1]) + '" r="' + f1(r) + '"/>');
    const pR = onEll(O, l, l, a0);
    if (o.l) beside(cv, O, pR, [0, l], o.l);
    if (o.angle) { cv.add(curve(arcD(O, 11, 11, a0, a1), 'thin')); cv.write([0, ang > 150 ? 22 : 26], o.angle, 'is-length'); }
    if (o.r) { cv.add(stroke(c, [r, c[1]], 'thin') + dot(c)); cv.write([r + 5 + half(o.r), c[1]], o.r, kindOf(o.r)); }
    if (o.arc) { const p = onEll(O, l, l, a1 - ang * 0.2); cv.write([p[0] - 6 - half(o.arc), p[1] + 9], o.arc, kindOf(o.arc)); }
    return cv.out(o.label, 5);
  }
  // 원뿔대의 전개도(옆면은 큰 부채꼴에서 작은 부채꼴을 뺀 모양, 밑면은 크고 작은 원)
  function frustumNet(label) {
    const O = [0, 0], l1 = 30, l2 = 66, r1 = 10, r2 = 22, ang = 120, a0 = 90 - ang / 2, a1 = 90 + ang / 2, cv = canvas();
    for (let t = a0; t <= a1 + 0.01; t += 10) cv.point(onEll(O, l2, l2, t));
    cv.add('<path class="mb-poly" d="' + arcD(O, l2, l2, a0, a1) + tail(arcD(O, l1, l1, a1, a0)) + 'Z"/>');
    [[[0, l1 - r1], r1], [[0, l2 + r2], r2]].forEach(([c, r]) => { cv.box(c, r, r); cv.add('<circle class="mb-poly" cx="0" cy="' + f1(c[1]) + '" r="' + r + '"/>'); });
    return cv.out(label, 5);
  }
  // 다각형 여럿을 이어 붙인 전개도: 두 다각형이 함께 쓰는 변은 접는 선(점선), 나머지는 테두리(실선)
  function netOf(polys, label, extra) {
    const cv = canvas(), key = (p, q) => { const a = f1(p[0]) + ',' + f1(p[1]), b = f1(q[0]) + ',' + f1(q[1]); return a < b ? a + '|' + b : b + '|' + a; }, count = new Map(), ends = new Map();
    polys.forEach((poly) => { poly.forEach(cv.point); cv.add(fill(poly, CREAM)); poly.forEach((p, i) => { const q = poly[(i + 1) % poly.length], k = key(p, q); count.set(k, (count.get(k) || 0) + 1); ends.set(k, [p, q]); }); });
    for (const pass of [2, 1]) count.forEach((n, k) => { if ((n > 1 ? 2 : 1) !== pass) return; const [p, q] = ends.get(k); cv.add(stroke(p, q, n > 1 ? 'dash' : '')); });
    if (extra) extra(cv);
    return cv.out(label, 6);
  }
  // 가운데(0, 0)를 둘러싼 다각형의 변 p→q 에서, 변을 따라 along(0~1)만큼 간 자리에서 바깥쪽으로 far 만큼 나간 점
  const outOf = (p, q, along, far) => { const L = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], side = u[1] * mid[0] - u[0] * mid[1] >= 0 ? 1 : -1, n = [u[1] * side, -u[0] * side]; return [p[0] + u[0] * along * L + n[0] * far, p[1] + u[1] * along * L + n[1] * far]; };
  // 각뿔의 전개도: 가운데 정n각형(한 변 a)의 변마다 높이 s 인 이등변삼각형. o: { a, s: 글 }
  function pyrNet(n, a, s, o) {
    const R = a / (2 * Math.sin(Math.PI / n)), base = ngon(n, R, 90 + 180 / n), polys = [base], opt = o || {};
    base.forEach((p, i) => { const q = base[(i + 1) % n]; polys.push([p, q, outOf(p, q, 0.5, s)]); });
    const fixedPolys = polys;
    return netOf(fixedPolys, opt.label, (cv) => {
      // 치수는 아래쪽 변과 거기에 붙은 삼각형에 적는다.
      const tri = fixedPolys.slice(1).sort((x, y) => y[2][1] - x[2][1])[0], [p, q, t] = tri, mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      if (opt.s) { cv.add(stroke(mid, t, 'thin') + corner(mid, t, q, 5)); leader(cv, [mid[0] + a * 0.5 + half(opt.s) + 6, mid[1] + s * 0.62], [mid[0], mid[1] + s * 0.5], opt.s); }
      if (opt.a) cv.write([mid[0], mid[1] - 11], opt.a, kindOf(opt.a));
    });
  }
  // 각뿔대의 전개도: 가운데 큰 정n각형의 변마다 사다리꼴, 그 가운데 하나의 바깥 변에 작은 정n각형
  function frusNet(n, label) {
    const A = n === 3 ? 58 : n === 4 ? 52 : 38, a = A * 0.42, t = n === 3 ? 40 : 30, R = A / (2 * Math.sin(Math.PI / n)), base = ngon(n, R, 90 + 180 / n), polys = [base];
    const outward = outOf;
    let cap = null;
    base.forEach((p, i) => {
      const q = base[(i + 1) % n], lo = (1 - a / A) / 2, c = outward(p, q, lo, t), e = outward(p, q, 1 - lo, t);
      polys.push([p, q, e, c]);
      if (i === 0) { const r = a / (2 * Math.sin(Math.PI / n)), ap = r * Math.cos(Math.PI / n), mid = [(c[0] + e[0]) / 2, (c[1] + e[1]) / 2], L = Math.hypot(mid[0], mid[1]), ctr = [mid[0] + mid[0] / L * ap, mid[1] + mid[1] / L * ap], ang = Math.atan2(c[1] - ctr[1], c[0] - ctr[0]) / RAD, dir = ((Math.atan2(e[1] - ctr[1], e[0] - ctr[0]) / RAD - ang + 540) % 360) - 180 > 0 ? 1 : -1; cap = Array.from({ length: n }, (_, j) => [ctr[0] + r * Math.cos((ang + dir * 360 * j / n) * RAD), ctr[1] + r * Math.sin((ang + dir * 360 * j / n) * RAD)]); cap[0] = c; cap[1] = e; }
    });
    polys.push(cap);
    return netOf(polys, label);
  }
  // 정사면체의 전개도(큰 정삼각형을 작은 정삼각형 4개로 나눈 모양), 정팔면체의 전개도(정삼각형 6개를 한 줄로 잇고 양 끝에 하나씩 위아래로 붙인 모양)
  function tetraNet(label) {
    const s = 46, h = s * Math.sqrt(3) / 2, A = [0, 0], Bp = [2 * s, 0], Cp = [s, -2 * h], m1 = [s, 0], m2 = [s * 1.5, -h], m3 = [s * 0.5, -h];
    return netOf([[m1, m2, m3], [A, m1, m3], [m1, Bp, m2], [m3, m2, Cp]], label);
  }
  function octaNet(label) {
    const s = 38, h = s * Math.sqrt(3) / 2, Bt = (i) => [i * s, 0], Tp = (i) => [i * s + s / 2, -h];
    return netOf([[Bt(0), Bt(1), Tp(0)], [Bt(1), Tp(0), Tp(1)], [Bt(1), Bt(2), Tp(1)], [Bt(2), Tp(1), Tp(2)], [Bt(2), Bt(3), Tp(2)], [Bt(3), Tp(2), Tp(3)], [Tp(2), Tp(3), [3 * s, -2 * h]], [Bt(0), Bt(1), [s / 2, h]]], label);
  }

  // ── 그림: 회전축과 평면도형 ──────────────────────────────────
  // 회전축 l 은 세로 직선(x = 0)이고 평면도형은 그 왼쪽에 놓인다. 축 위에 도는 방향을 나타내는 고리를 그린다.
  function axis(cv, y0, y1) {
    const top = y0 - 34, hub = [0, top + 9], rx = 10, ry = 4, tip = onEll(hub, rx, ry, 240), before = onEll(hub, rx, ry, 216), ux = tip[0] - before[0], uy = tip[1] - before[1], ul = Math.hypot(ux, uy), nx = -uy / ul, ny = ux / ul;
    cv.add(stroke([0, top], [0, y1 + 12], '', 'stroke-width:1.3'));
    cv.add(curve(arcD(hub, rx, ry, -60, 240), '', 'stroke:#2563eb;stroke-width:1.3') + fill([[tip[0] + ux / ul * 4, tip[1] + uy / ul * 4], [tip[0] + nx * 3.2, tip[1] + ny * 3.2], [tip[0] - nx * 3.2, tip[1] - ny * 3.2]], '#2563eb'));
    cv.add('<text x="0" y="' + f1(top - 9) + '" text-anchor="middle" dominant-baseline="central" style="' + MATH + ';font-size:16px;fill:' + INK + '">l</text>');
    cv.point([0, y1 + 12]); cv.box([0, top - 9], 6, 9); cv.box(hub, rx + 3, ry + 3);
  }
  // 화면 길이: 수 v 에 배율 k 를 곱하되 lo~hi px 사이에 들게 한다(치수는 적힌 수가 정하므로 그림은 글이 겹치지 않는 크기로 그린다).
  const spx = (v, k, lo, hi) => Math.min(hi, Math.max(lo, v * k));
  const L_ = (p) => [-p[0], p[1]];   // 축에서의 거리(왼쪽으로)를 화면의 x 로
  const flatPoly = (cv, pts) => { const list = pts.map(L_); list.forEach(cv.point); cv.add(shape(list, SKY)); return list; };
  // kind 별 그림. 길이는 px, 글은 o 에 적는다(없으면 적지 않는다). 모두 cv.out 까지 마친 svg 를 돌려준다.
  //  rect: 한 변이 축 위에 놓인 직사각형(가로 w, 세로 h) — o: { w, h }
  //  rectOff: 축에서 g 만큼 떨어진 직사각형 — o: { g, w, h }
  //  tri: 직각을 낀 한 변(세로 b)이 축 위에 놓이고 다른 변(가로 a)이 아래에 있는 직각삼각형 — o: { a, b, c }
  //  triFar: 가로 변(a)의 한 끝만 축 위에 있고 세로 변(h)이 축에서 떨어져 있는 직각삼각형 — o: { a, h }
  //  triHyp: 빗변이 축 위에 놓인 직각삼각형(위쪽 변 p, 아래쪽 변 q, 빗변 c — px 는 p, q 에서 셈한다) — o: { p, q, c }
  //  trap: 높이(h)가 축 위에 놓인 직각사다리꼴(윗변 a, 아랫변 b) — o: { a, b, h, s, ext: 잘라 낸 쪽 높이 글, extS: 잘라 낸 쪽 모선 글 }
  //  trapOff: 축에서 g 만큼 떨어진 직각사다리꼴 / triOff: 축에서 떨어진 직각삼각형 / iso: 한 변이 축 위에 놓인 이등변삼각형(원뿔 2개)
  //  semi: 지름이 축 위에 놓인 반원(반지름 r) — o: { d, r } / quarter: 한 반지름이 축 위에 놓인 사분원 — o: { r }
  function spin(kind, v, o) {
    const cv = canvas(), opt = o || {}, w = (c, text) => cv.write(c, text, kindOf(text));
    let bottom = 0;
    if (kind === 'rect' || kind === 'rectOff') {
      const g = kind === 'rectOff' ? v.g : 0; bottom = v.h;
      flatPoly(cv, [[g, 0], [g + v.w, 0], [g + v.w, v.h], [g, v.h]]);
      if (g) cv.add(stroke([-g, 0], [0, 0], 'dash') + stroke([-g, v.h], [0, v.h], 'dash'));
      if (opt.w) w([-(g + v.w / 2), v.h + 10], opt.w);
      if (opt.g) w([-g / 2, v.h + 10], opt.g);
      if (opt.h) w([-(g + v.w) - 5 - half(opt.h), v.h / 2], opt.h);
    } else if (kind === 'tri' || kind === 'triOff') {
      const g = kind === 'triOff' ? v.g : 0; bottom = v.b;
      const P = flatPoly(cv, [[g, 0], [g, v.b], [g + v.a, v.b]]);
      cv.add(corner(P[1], P[0], P[2]));
      if (g) cv.add(stroke([-g, v.b], [0, v.b], 'dash') + stroke([-g, 0], [0, 0], 'dash'));
      if (opt.a) w([-(g + v.a / 2), v.b + 10], opt.a);
      if (opt.b) w([6 + half(opt.b), v.b / 2], opt.b);
      if (opt.c) beside(cv, P[0], P[2], P[1], opt.c);
    } else if (kind === 'triFar') {
      bottom = v.h;
      const P = flatPoly(cv, [[0, 0], [v.a, 0], [v.a, v.h]]);
      cv.add(corner(P[1], P[0], P[2]));
      if (opt.a) w([-v.a / 2, -9], opt.a);
      if (opt.h) w([-v.a - 5 - half(opt.h), v.h / 2], opt.h);
    } else if (kind === 'triHyp') {
      const c = Math.hypot(v.p, v.q), far = v.p * v.q / c, y = v.p * v.p / c; bottom = c;
      const P = flatPoly(cv, [[0, 0], [far, y], [0, c]]);
      cv.add(corner(P[1], P[0], P[2]));
      if (opt.p) beside(cv, P[0], P[1], P[2], opt.p);
      if (opt.q) beside(cv, P[1], P[2], P[0], opt.q);
      if (opt.c) w([6 + half(opt.c), c / 2], opt.c);
    } else if (kind === 'trap' || kind === 'trapOff') {
      const g = kind === 'trapOff' ? v.g : 0; bottom = v.h;
      const P = flatPoly(cv, [[g, 0], [g + v.a, 0], [g + v.b, v.h], [g, v.h]]);
      cv.add(corner(P[0], P[1], P[3]) + corner(P[3], P[0], P[2]));
      if (g) cv.add(stroke([-g, 0], [0, 0], 'dash') + stroke([-g, v.h], [0, v.h], 'dash'));
      if (opt.ext) {
        const up = v.h * v.a / (v.b - v.a);
        cv.add(stroke(P[1], [0, -up], 'dash')); cv.point([0, -up]);
        w([6 + half(opt.ext), -up / 2], opt.ext);
        if (opt.extS) beside(cv, P[1], [0, -up], [0, 0], opt.extS);
        bottom = v.h; cv.point([0, -up - 4]);
        if (opt.a) w([-v.a / 2, 9], opt.a);
        axis(cv, -up, bottom);
      } else if (opt.a) w([-(g + v.a / 2), -9], opt.a);
      if (opt.b) w([-(g + v.b / 2), v.h + 10], opt.b);
      if (opt.h) w([6 + half(opt.h), v.h / 2], opt.h);
      if (opt.s) beside(cv, P[1], P[2], P[0], opt.s);
      if (opt.ext) return cv.out(opt.label, 6);
    } else if (kind === 'iso') {
      bottom = v.h;
      flatPoly(cv, [[0, 0], [v.a, v.h / 2], [0, v.h]]);
    } else if (kind === 'semi') {
      bottom = 2 * v.r; cv.box([-v.r / 2, v.r], v.r / 2, v.r);
      cv.add('<path class="mb-poly" style="fill:' + SKY + '" d="' + arcD([0, v.r], v.r, v.r, 270, 90) + 'Z"/>');
      if (opt.d) w([6 + half(opt.d), v.r], opt.d);
      if (opt.r) { cv.add(stroke([0, v.r], [-v.r, v.r], 'thin') + dot([0, v.r])); w([-v.r / 2, v.r - 9], opt.r); }
    } else if (kind === 'quarter') {
      bottom = v.r; cv.box([-v.r / 2, v.r / 2], v.r / 2, v.r / 2);
      cv.add('<path class="mb-poly" style="fill:' + SKY + '" d="M0 ' + f1(v.r) + tail(arcD([0, v.r], v.r, v.r, 180, 270)) + 'Z"/>' + corner([0, v.r], [0, 0], [-v.r, v.r]));
      if (opt.r) w([-v.r / 2, v.r + 10], opt.r);
    }
    axis(cv, 0, bottom);
    return cv.out(opt.label, 6);
  }

  // ── 단원 틀 ──────────────────────────────────────────────────
  B.addUnit({
    id: '7-2-4', grade: 7, semester: 2, no: 4, title: '입체도형의 성질', version: 2,
    groups: [
      { id: 'poly', title: '다면체', standard: SOLID, types: [] },
      { id: 'regular', title: '정다면체', standard: SOLID, types: [] },
      { id: 'turn', title: '회전체와 단면, 전개도', standard: SOLID, types: [] },
      { id: 'prism', title: '기둥의 겉넓이와 부피', standard: MEAS, types: [] },
      { id: 'cone', title: '뿔의 겉넓이와 부피', standard: MEAS, types: [] },
      { id: 'sphere', title: '구의 겉넓이와 부피', standard: MEAS, types: [] },
      { id: 'spin', title: '회전체의 겉넓이와 부피', standard: MEAS, types: [] }
    ]
  });

  // ── 다면체 ───────────────────────────────────────────────────
  const POLY_NAMES = ['직육면체', '삼각뿔대', '오각기둥', '사각뿔', '정팔면체', '육각뿔', '오각뿔대', '정육면체', '삼각기둥', '칠각뿔'];
  const ROUND_NAMES = ['구', '원뿔', '원기둥', '원뿔대', '반구'];
  const POLY_LEAD = '다각형인 면으로만 둘러싸인 입체도형이 다면체이다. ';
  const TURN_LEAD = '평면도형을 한 직선을 축으로 하여 1회전 시킬 때 생기는 입체도형이 회전체이다. ';
  // 그림 칸 다섯: 다면체 a 개와 회전체 (5 − a) 개
  const mixedArt = (d) => { const a = d.int(2, 3); return d.shuffle(d.shuffle(['prism3', 'prism5', 'pyr3', 'pyr4', 'frus4', 'frus5', 'octa']).slice(0, a).concat(d.shuffle(['cyl', 'cone', 'ball', 'cfrus', 'bowl']).slice(0, 5 - a))); };
  const mixedNames = (d, n) => { const a = d.int(2, n - 2); return d.shuffle(d.shuffle(POLY_NAMES).slice(0, a).concat(d.shuffle(ROUND_NAMES).slice(0, n - a))); };
  // 「옳은 것은?」「옳지 않은 것은?」: 차례 0 은 옳은 것, 1 은 옳지 않은 것
  const claims = (d, n, subject, yes, no, figure) => { const item = claimQ(d, `다음 중 ${subject}에 대한 설명으로 ${n ? '옳지 않은' : '옳은'} 것은?`, yes, no, !n); return figure ? Object.assign(item, { figure }) : item; };

  B.addTypes('7-2-4', 'poly', [
    T('poly-mean', '다면체와 각뿔대의 뜻', '①1', (d, n) => {
      if (n === 0) return pickWord(d, '다각형인 면으로만 둘러싸인 입체도형을 무엇이라 하는가?', '다면체', ['회전체', '각뿔대', '원뿔대'], POLY_LEAD + '다면체는 면의 개수에 따라 사면체, 오면체, 육면체, …라 한다.');
      return pickWord(d, '각뿔을 밑면에 평행한 평면으로 자를 때 생기는 두 입체도형 중에서 각뿔이 아닌 쪽의 입체도형을 무엇이라 하는가?', '각뿔대', ['각기둥', '원뿔대', '정다면체'], '각뿔을 밑면에 평행한 평면으로 자르면 위쪽에는 작은 각뿔이, 아래쪽에는 각뿔대가 생긴다.');
    }, { count: 2 }),
    T('poly-pick-art', '그림에서 다면체 모두 고르기', '①2 ②1', (d) => {
      const keys = mixedArt(d), flags = keys.map((k) => !ART[k].round), labels = TAGS.slice(0, 5), made = setOptions(d, labels, flags);
      return C('다음 입체도형 중 다면체를 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(keys.map(art)),
        explain: POLY_LEAD + `${listed(labels.filter((_, i) => !flags[i]))}는 굽은 면이 있으므로 다면체가 아니다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('poly-pick-name', '이름을 보고 다면체 모두 고르기', '①2 ②2', (d) => {
      const names = mixedNames(d, 5), flags = names.map((w) => POLY_NAMES.includes(w)), labels = KEYS.slice(0, 5), made = setOptions(d, labels, flags), round = names.filter((_, i) => !flags[i]);
      return C('다음 중 다면체를 모두 고른 것은?', made.options, made.answer, {
        figure: words(names, labels),
        explain: POLY_LEAD + `${josa(listed(round), '은/는')} 굽은 면이 있으므로 다면체가 아니다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('poly-how-many', '이름을 보고 몇 면체인지 구하기', '①3 ②5', (d, n) => {
      const s = solid(['prism', 'pyr', 'frus'][n], d.int(5, 9)), k = cnt(s, 'f');
      return N(`${josa(s.name, '은/는')} 몇 면체인가?`, k, { unit: '면체', explain: `${s.name}의 면의 개수는 ${cntSay(s, 'f')}이므로 ${hedron(k)}이다.`, facts: calc(cntJs(s, 'f'), [s.n, 1, 2]) });
    }, { count: 3 }),
    T('poly-art-faces', '겨냥도를 보고 몇 면체인지 구하기', '①3 ②3', (d) => {
      const [kind, n] = d.pick([['prism', 5], ['prism', 6], ['pyr', 5], ['pyr', 6], ['frus', 4], ['frus', 5]]), s = solid(kind, n), k = cnt(s, 'f');
      return N('다음 다면체는 몇 면체인가?', k, { unit: '면체', figure: bigArt(kind, n), explain: `밑면이 ${gon(n)}인 ${KIND[kind].word}이다. 보이지 않는 면까지 세면 면의 개수는 ${cntSay(s, 'f')}이므로 ${hedron(k)}이다.`, facts: calc(cntJs(s, 'f'), [n, 1, 2]) });
    }),
    T('poly-frustum-art', '각뿔대의 겨냥도를 보고 이름과 면의 개수 구하기', '①10 ②7', (d) => {
      const n = d.int(3, 6), s = solid('frus', n);
      return M(`다음 입체도형은 ${box()}각뿔대이다. ${box()} 안에 알맞은 수와 이 입체도형의 면의 개수를 구하시오.`, [{ label: '□ 안의 수', answer: n }, { label: '면의 개수', answer: n + 2, unit: '개' }], {
        figure: bigArt('frus', n), shown: `${s.name}, ${n + 2}개`,
        explain: `두 밑면이 ${gon(n)}이므로 ${s.name}이다. 면은 밑면 2개와 옆면 ${n}개로 ${n} + 2 = ${n + 2}(개)이다.`,
        facts: { calc: [[String(n), 0], [n + '+2', 1]], unseen: [n, 2] }
      });
    }),
    T('poly-frustum-counts', '각뿔대의 면, 모서리, 꼭짓점의 개수', '①7 ②7·8', (d) => {
      const s = solid('frus', d.int(4, 9));
      return M(`${s.name}의 면, 모서리, 꼭짓점의 개수를 각각 구하시오.`, ['f', 'e', 'v'].map((part) => ({ label: PART[part], answer: cnt(s, part), unit: '개' })), {
        explain: `${s.name}의 밑면은 ${gon(s.n)} 2개이다. 면은 ${cntSay(s, 'f')}(개), 모서리는 ${cntSay(s, 'e')}(개), 꼭짓점은 ${cntSay(s, 'v')}(개)이다.`,
        facts: { calc: ['f', 'e', 'v'].map((part, i) => [cntJs(s, part), i]), unseen: [s.n, 2, 3] }
      });
    }),
    T('poly-mixed-counts', '서로 다른 다면체의 모서리, 면, 꼭짓점의 개수', '①8 심3', (d) => {
      const [a, b, c] = d.shuffle([5, 6, 7, 8]).slice(0, 3), p = solid('prism', a), y = solid('pyr', b), f = solid('frus', c);
      return M(`${p.name}의 모서리의 개수, ${y.name}의 면의 개수, ${f.name}의 꼭짓점의 개수를 차례로 구하시오.`, [{ label: p.name + '의 모서리', answer: 3 * a, unit: '개' }, { label: y.name + '의 면', answer: b + 1, unit: '개' }, { label: f.name + '의 꼭짓점', answer: 2 * c, unit: '개' }], {
        explain: `${p.name}의 모서리는 ${cntSay(p, 'e')}(개), ${y.name}의 면은 ${cntSay(y, 'f')}(개), ${f.name}의 꼭짓점은 ${cntSay(f, 'v')}(개)이다.`,
        facts: { calc: [[cntJs(p, 'e'), 0], [cntJs(y, 'f'), 1], [cntJs(f, 'v'), 2]], unseen: [a, b, c, 1, 2, 3] }
      });
    }),
    T('poly-side-shape', '다면체와 옆면의 모양의 짝', '①7·11 ②13', (d) => {
      const ns = d.shuffle([3, 5, 6, 7]), good = [['pyr', '삼각형'], ['prism', '직사각형'], ['frus', '사다리꼴']].map(([k, w], i) => [solid(k, ns[i]).name + ' – ' + w, true]);
      const bad = d.pick([[solid('frus', ns[3]).name + ' – 삼각형', '각뿔대의 옆면은 모두 사다리꼴이다.'], [solid('prism', ns[3]).name + ' – ' + gon(ns[3]), `각기둥의 옆면은 모두 직사각형이다. ${gon(ns[3])}은 밑면의 모양이다.`], [solid('pyr', ns[3]).name + ' – 사다리꼴', '각뿔의 옆면은 모두 삼각형이다.'], [solid('frus', ns[3]).name + ' – 직사각형', '각뿔대의 옆면은 모두 사다리꼴이다.']]);
      const rows = d.shuffle(good.concat([[bad[0], false]]));
      return C('다음 중 다면체와 그 옆면의 모양을 짝 지은 것으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), { explain: '옆면의 모양은 각기둥은 직사각형, 각뿔은 삼각형, 각뿔대는 사다리꼴이다. ' + bad[1], facts: { truth: rows.map((r) => r[1]), want: false } });
    }),
    T('poly-compare', '다면체의 면, 모서리, 꼭짓점의 개수 비교', '①4 ②5·6 심4', (d, n) => {
      if (n === 0) {
        const list = d.until(() => d.shuffle([solid('pyr', d.int(4, 9)), solid('prism', d.int(3, 8)), solid('frus', d.int(3, 8)), solid('pyr', d.int(4, 9)), solid('prism', d.int(3, 8))]).slice(0, 4), (rows) => { const v = rows.map((s) => cnt(s, 'f')), top = Math.max(...v); return v.filter((x) => x === top).length === 1 && new Set(rows.map((s) => s.name)).size === 4 && new Set(v).size >= 3; });
        const values = list.map((s) => cnt(s, 'f')), at = values.indexOf(Math.max(...values));
        return C('다음 중 면의 개수가 가장 많은 다면체는?', list.map((s) => s.name), at, { explain: list.map((s) => `${s.name} ${cnt(s, 'f')}개`).join(', ') + `이므로 면의 개수가 가장 많은 것은 ${list[at].name}이다.`, facts: { choose: { exprs: list.map((s) => cntJs(s, 'f')), rule: 'max' }, unseen: [1, 2, 3, 4, 5, 6, 7, 8, 9] } });
      }
      const part = n === 1 ? 'e' : 'v', m = n === 1 ? d.pick([4, 6]) : d.int(3, 6);
      const same = [solid('prism', m), solid('frus', m), solid('pyr', n === 1 ? 3 * m / 2 : 2 * m - 1)], odd = d.pick(n === 1 ? [solid('pyr', m), solid('prism', m + 1), solid('frus', m - 1)] : [solid('pyr', m + 1), solid('prism', m + 1), solid('frus', m - 1)].filter((s) => s.n >= 3));
      const list = d.shuffle(same.concat([odd])), at = list.indexOf(odd);
      return C(`다음 중 ${PART[part]}의 개수가 나머지 셋과 다른 하나는?`, list.map((s) => s.name), at, { explain: list.map((s) => `${s.name} ${cnt(s, part)}개`).join(', ') + `이므로 ${PART[part]}의 개수가 다른 것은 ${odd.name}이다.`, facts: { choose: { exprs: list.map((s) => cntJs(s, part)), rule: 'odd' }, unseen: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] } });
    }, { count: 3 }),
    T('poly-n-rule', 'n각기둥, n각뿔, n각뿔대의 개수를 n을 사용한 식으로 나타내기', '②9', (d, n) => {
      const part = ['f', 'v', 'e'][n], kind = d.pick(['prism', 'pyr', 'frus']), right = cntN(kind, part), all = [V('n') + ' + 1', V('n') + ' + 2', '2' + V('n'), '3' + V('n')], options = d.shuffle(all);
      const why = { prism: `${V('n')}각기둥의 밑면은 2개, 옆면은 ${V('n')}개이고, 꼭짓점은 두 밑면에 ${V('n')}개씩, 모서리는 두 밑면에 ${V('n')}개씩과 옆에 ${V('n')}개가 있다.`, pyr: `${V('n')}각뿔의 밑면은 1개, 옆면은 ${V('n')}개이고, 꼭짓점은 밑면에 ${V('n')}개와 뿔의 꼭짓점 1개, 모서리는 밑면에 ${V('n')}개와 옆에 ${V('n')}개가 있다.`, frus: `${V('n')}각뿔대의 밑면은 2개, 옆면은 ${V('n')}개이고, 꼭짓점은 두 밑면에 ${V('n')}개씩, 모서리는 두 밑면에 ${V('n')}개씩과 옆에 ${V('n')}개가 있다.` }[kind];
      return C(`${V('n')}${KIND[kind].word}의 ${PART[part]}의 개수를 ${V('n')}을 사용한 식으로 나타낸 것은?`, options, options.indexOf(right), { explain: `${why} 따라서 ${PART[part]}의 개수는 ${right}이다.`, facts: { truth: options.map((o) => o === right), want: true } });
    }, { count: 3 }),
    T('poly-art-cond', '그림에서 조건에 맞는 다면체 모두 고르기', '②14 ①27', (d, n) => {
      const keys = d.until(() => d.shuffle(['prism3', 'pyr3', 'frus3', 'prism4', 'pyr4', 'frus4', 'pyr5', 'frus5', 'prism5']).slice(0, 5), (list) => { const hit = list.filter((k) => (n ? ART[k].faces === 6 : ART[k].kind === 'frus')).length; return hit >= 2 && hit <= 3; });
      const flags = keys.map((k) => (n ? ART[k].faces === 6 : ART[k].kind === 'frus')), labels = TAGS.slice(0, 5), made = setOptions(d, labels, flags);
      return C(n ? '다음 다면체 중 육면체를 모두 고른 것은?' : '다음 다면체 중 각뿔대를 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(keys.map(art)),
        explain: n ? '보이지 않는 면까지 센다. ' + keys.map((k, i) => `${labels[i]}(${ART[k].name}) ${ART[k].faces}개`).join(', ') + '이므로 면이 6개인 것을 고른다.' : '각뿔대는 두 밑면이 서로 평행하고 크기가 다르며 옆면이 모두 사다리꼴이다. ' + keys.map((k, i) => `${labels[i]}는 ${ART[k].name}`).join(', ') + '이다.',
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('poly-net-solid', '전개도로 만든 다면체', '①13 ②16', (d, n) => {
      if (n === 0) {
        const k = d.pick([3, 4]), s = solid('frus', k);
        return M(`다음 전개도로 만든 입체도형은 ${box()}각뿔대이다. ${box()} 안에 알맞은 수와 이 입체도형의 모서리의 개수를 구하시오.`, [{ label: '□ 안의 수', answer: k }, { label: '모서리의 개수', answer: 3 * k, unit: '개' }], {
          figure: frusNet(k, `전개도: 큰 ${gon(k)}의 변마다 사다리꼴이 하나씩 붙어 있고, 그 가운데 한 사다리꼴의 바깥쪽 변에 작은 ${gon(k)}이 붙어 있다`), shown: `${s.name}, ${3 * k}개`,
          explain: `크기가 다른 ${gon(k)} 2개가 밑면이고 사다리꼴 ${k}개가 옆면이므로 ${s.name}이다. 모서리의 개수는 ${cntSay(s, 'e')}이다.`,
          facts: { calc: [[String(k), 0], ['3*' + k, 1]], unseen: [k, 3] }
        });
      }
      const k = d.pick([3, 4, 5]), s = solid('pyr', k);
      return M(`다음 전개도로 만든 입체도형은 ${box()}각뿔이다. ${box()} 안에 알맞은 수와 이 입체도형의 꼭짓점의 개수를 구하시오.`, [{ label: '□ 안의 수', answer: k }, { label: '꼭짓점의 개수', answer: k + 1, unit: '개' }], {
        figure: pyrNet(k, k === 3 ? 50 : k === 4 ? 40 : 34, k === 3 ? 30 : 44, { label: `전개도: ${gon(k)}의 변마다 삼각형이 하나씩 붙어 있다` }), shown: `${s.name}, ${k + 1}개`,
        explain: `${gon(k)} 1개가 밑면이고 삼각형 ${k}개가 옆면이므로 ${s.name}이다. 꼭짓점의 개수는 ${cntSay(s, 'v')}이다.`,
        facts: { calc: [[String(k), 0], [k + '+1', 1]], unseen: [k, 1] }
      });
    }, { count: 2 }),
    T('poly-claims', '다면체에 대한 설명', '①12 ②15', (d, n) => claims(d, n, '다면체', [
      '각뿔대의 옆면은 모두 사다리꼴이다.', '각뿔대의 두 밑면은 서로 평행하다.', '각뿔의 옆면은 모두 삼각형이다.', '오각뿔대는 칠면체이다.', '면의 개수가 가장 적은 다면체는 사면체이다.', '육각뿔의 꼭짓점은 7개이다.', '사각뿔대의 모서리는 12개이다.'
    ], [
      ['다면체는 원 또는 다각형인 면으로 둘러싸인 입체도형이다.', '다면체는 다각형인 면으로만 둘러싸인 입체도형이다.'],
      ['각뿔대의 두 밑면은 서로 합동이다.', '각뿔대의 두 밑면은 서로 평행하지만 크기가 다르므로 합동이 아니다.'],
      ['팔각기둥은 팔면체이다.', '팔각기둥의 면은 8 + 2 = 10(개)이므로 팔각기둥은 십면체이다.'],
      ['각뿔대의 옆면은 모두 삼각형이다.', '각뿔대의 옆면은 모두 사다리꼴이다.', '각뿔대의 옆면은 모두 사다리꼴이다.'],
      ['각뿔대의 밑면은 1개이다.', '각뿔대의 밑면은 서로 평행한 두 면이므로 2개이다.'],
      ['오각뿔의 면은 5개이다.', '오각뿔의 면은 밑면 1개와 옆면 5개로 6개이다.'],
      ['칠각뿔대는 칠면체이다.', '칠각뿔대의 면은 7 + 2 = 9(개)이므로 칠각뿔대는 구면체이다.', '오각뿔대는 칠면체이다.']
    ]), { count: 2 })
  ]);

  // ── 정다면체 ─────────────────────────────────────────────────
  const REG_LEAD = '정다면체는 정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 다섯 가지뿐이다. ';
  const regRow = (r) => `${r.name}(면 ${r.shape}, 한 꼭짓점에 모인 면 ${r.m}개)`;
  B.addTypes('7-2-4', 'regular', [
    T('reg-mean', '정다면체의 뜻', '①1 ②17', (d) => {
      const right = '정다각형, 면', options = d.shuffle([right, '정다각형, 모서리', '정삼각형, 면', '다각형, 꼭짓점']);
      return C('다음은 정다면체의 뜻이다. ㉠, ㉡에 알맞은 것을 차례로 적은 것은?', options, options.indexOf(right), {
        figure: lines(['각 면이 모두 합동인 ㉠이고, 각 꼭짓점에 모인 ㉡의 개수가 같은 다면체']),
        explain: '각 면이 모두 합동인 정다각형이고, 각 꼭짓점에 모인 면의 개수가 같은 다면체를 정다면체라 한다.', facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('reg-not', '정다면체가 아닌 것', '①15', (d) => {
      const fake = d.pick(['정십면체', '정십육면체', '정구면체', '정십사면체']), list = d.shuffle(d.shuffle(REG.map((r) => r.name)).slice(0, 3).concat([fake]));
      return C('다음 중 정다면체가 아닌 것은?', list, list.indexOf(fake), { explain: REG_LEAD + `${josa(fake, '은/는')} 없다.`, facts: { truth: list.map((w) => w !== fake), want: false } });
    }),
    T('reg-shape', '정다면체의 면의 모양', '①16 ②18', (d) => {
      const r = d.pick(REG);
      return pickWord(d, `${r.name}의 면의 모양은?`, r.shape, ['정삼각형', '정사각형', '정오각형', '정육각형'].filter((w) => w !== r.shape), `면의 모양은 정사면체·정팔면체·정이십면체가 정삼각형, 정육면체가 정사각형, 정십이면체가 정오각형이다.`);
    }),
    T('reg-meet', '정다면체의 한 꼭짓점에 모인 면의 개수', '①16 ②18', (d) => {
      const r = d.pick(REG.slice(1));
      return N(`${r.name}의 한 꼭짓점에 모인 면의 개수는?`, r.m, { unit: '개', explain: `한 꼭짓점에 모인 면의 개수는 정사면체 3개, 정육면체 3개, 정팔면체 4개, 정십이면체 3개, 정이십면체 5개이다.`, facts: fixed(r.m) });
    }),
    T('reg-pair', '정다면체, 면의 모양, 한 꼭짓점에 모인 면의 개수의 짝', '①16 심14', (d) => {
      const rows = d.shuffle(REG).slice(0, 4), right = d.int(0, 3), line = (r, shapeW, m) => `${r.name} – ${shapeW} – ${m}`;
      const wrong = (r) => (d.bool() ? line(r, r.shape, r.m === 3 ? 4 : 3) : line(r, r.shape === '정삼각형' ? '정사각형' : '정삼각형', r.m));
      const options = rows.map((r, i) => (i === right ? line(r, r.shape, r.m) : wrong(r)));
      return C('다음 중 정다면체, 면의 모양, 한 꼭짓점에 모인 면의 개수를 차례로 바르게 짝 지은 것은?', options, right, { explain: rows.map(regRow).join(', ') + '이다.', facts: { truth: options.map((_, i) => i === right), want: true } });
    }),
    T('reg-ve', '정다면체의 꼭짓점과 모서리의 개수', '①17', (d) => {
      const r = d.pick(REG.slice(1));
      return M(`${r.name}의 꼭짓점의 개수와 모서리의 개수를 각각 구하시오.`, [{ label: '꼭짓점', answer: r.v, unit: '개' }, { label: '모서리', answer: r.e, unit: '개' }], {
        explain: `${r.name}의 면은 ${r.shape} ${r.f}개이고 한 꼭짓점에 면이 ${r.m}개씩 모인다. 꼭짓점은 ${r.p} × ${r.f} ÷ ${r.m} = ${r.v}(개), 모서리는 두 면이 하나씩 함께 쓰므로 ${r.p} × ${r.f} ÷ 2 = ${r.e}(개)이다.`,
        facts: { calc: [[`${r.p}*${r.f}/${r.m}`, 0], [`${r.p}*${r.f}/2`, 1]], unseen: [r.p, r.f, r.m, 2] }
      });
    }),
    T('reg-most', '정다면체의 여러 개수 비교', '①19 심13', (d, n) => {
      if (n === 0) {
        const list = d.shuffle(REG), at = list.findIndex((r) => r.f === 12);
        return C('다음 정다면체 중 꼭짓점의 개수가 가장 많은 것은?', list.map((r) => r.name), at, { explain: list.map((r) => `${r.name} ${r.v}개`).join(', ') + '이므로 꼭짓점의 개수가 가장 많은 것은 정십이면체이다.', facts: { choose: { exprs: list.map((r) => String(r.v)), rule: 'max' }, unseen: [4, 8, 6, 20, 12] } });
      }
      const pool = [['정사면체의 모서리의 개수', 6], ['정육면체의 꼭짓점의 개수', 8], ['정십이면체의 면의 개수', 12], ['정팔면체의 한 꼭짓점에 모인 면의 개수', 4], ['정이십면체의 한 꼭짓점에 모인 면의 개수', 5], ['정육면체의 모서리의 개수', 12], ['정팔면체의 꼭짓점의 개수', 6], ['정십이면체의 한 꼭짓점에 모인 면의 개수', 3]];
      const list = d.until(() => d.shuffle(pool).slice(0, 4), (rows) => new Set(rows.map((r) => r[1])).size === 4), low = Math.min(...list.map((r) => r[1])), at = list.findIndex((r) => r[1] === low);
      return C('다음 중 그 값이 가장 작은 것은?', list.map((r) => r[0]), at, { explain: list.map((r) => `${r[0]}는 ${r[1]}`).join(', ') + `이므로 가장 작은 것은 ${list[at][0]}이다.`, facts: { choose: { exprs: list.map((r) => String(r[1])), rule: 'min' }, unseen: [3, 4, 5, 6, 8, 12] } });
    }, { count: 2 }),
    T('reg-cond-all', '조건에 맞는 정다면체 모두 고르기', '①20 ②19', (d, n) => {
      const e = d.pick([12, 30]), cond = [['각 꼭짓점에 모인 면의 개수가 3개인', (r) => r.m === 3], ['면의 모양이 정삼각형인', (r) => r.shape === '정삼각형'], [`모서리의 개수가 ${e}개인`, (r) => r.e === e]][n];
      const labels = REG.map((r) => r.name), flags = REG.map(cond[1]), made = setOptions(d, labels, flags);
      return C(`다음 중 ${cond[0]} 정다면체를 모두 고른 것은?`, made.options, made.answer, {
        explain: REG.map((r) => (n === 2 ? `${r.name} ${r.e}개` : n === 1 ? `${r.name}의 면은 ${r.shape}` : `${r.name} ${r.m}개`)).join(', ') + '이다.',
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 3 }),
    T('reg-cond-one', '조건 둘에 맞는 정다면체', '①20 ②20', (d, n) => {
      const r = d.pick(n === 1 ? REG.slice(1) : REG);
      const cond = [`각 면이 모두 합동인 ${r.shape}이고 각 꼭짓점에 모인 면의 개수가 ${r.m}개인`, `각 꼭짓점에 모인 면의 개수가 ${r.m}개이고 모서리의 개수가 ${r.e}개인`, `면의 모양이 ${r.shape}이고 꼭짓점의 개수가 ${r.v}개인`][n];
      return N(`${cond} 정다면체는 정${box()}면체이다. ${box()} 안에 알맞은 수는?`, r.f, {
        lead: '정', unit: '면체',
        explain: `${regRow(r)}이고, ${r.name}의 꼭짓점은 ${r.v}개, 모서리는 ${r.e}개이다. 조건에 맞는 정다면체는 ${r.name}이다.`,
        facts: { calc: [[String(r.f), 0]], unseen: [r.f], rule: 'reg-cond-' + n }
      });
    }, { count: 3 }),
    T('reg-claims', '정다면체에 대한 설명', '①21 ②21', (d, n) => claims(d, n, '정다면체', [
      '정다면체의 각 면은 모두 합동인 정다각형이다.', '정다면체는 다섯 가지뿐이다.', '모든 면이 정육각형인 정다면체는 없다.', '정육면체와 정팔면체의 모서리의 개수는 같다.', '정사면체, 정팔면체, 정이십면체의 면의 모양은 모두 정삼각형이다.',
      '정십이면체의 한 꼭짓점에 모인 면은 3개이다.', '정다면체의 면의 모양은 정삼각형, 정사각형, 정오각형 중 하나이다.'
    ], [
      ['정다면체는 무수히 많다.', REG_LEAD.trim(), '정다면체는 다섯 가지뿐이다.'],
      ['정팔면체의 면의 모양은 정팔각형이다.', '정팔면체의 면의 모양은 정삼각형이다.'],
      ['각 면이 모두 합동인 정다각형인 다면체는 모두 정다면체이다.', '각 면이 모두 합동인 정다각형이어도 각 꼭짓점에 모인 면의 개수가 같아야 정다면체이다.'],
      ['각 꼭짓점에 모인 면의 개수가 같은 다면체는 모두 정다면체이다.', '각 꼭짓점에 모인 면의 개수가 같아도 각 면이 모두 합동인 정다각형이어야 정다면체이다.'],
      ['면이 정오각형인 정다면체의 한 꼭짓점에 모인 면은 5개이다.', '면이 정오각형인 정다면체는 정십이면체이고 한 꼭짓점에 모인 면은 3개이다.', '정십이면체의 한 꼭짓점에 모인 면은 3개이다.'],
      ['정십이면체의 면의 개수와 정이십면체의 모서리의 개수는 같다.', '정십이면체의 면은 12개이고 정이십면체의 모서리는 30개이다.'],
      ['정육면체의 한 꼭짓점에 모인 면은 4개이다.', '정육면체의 한 꼭짓점에 모인 면은 3개이다.']
    ]), { count: 2 }),
    T('reg-net', '전개도로 만든 정다면체', '②24', (d, n) => {
      const r = REG[n ? 2 : 0];
      return M(`다음 전개도로 만든 정다면체는 정${box()}면체이다. ${box()} 안에 알맞은 수와 이 정다면체의 한 꼭짓점에 모인 면의 개수를 구하시오.`, [{ label: '□ 안의 수', answer: r.f }, { label: '모인 면의 개수', answer: r.m, unit: '개' }], {
        figure: n ? octaNet('전개도: 합동인 정삼각형 8개. 6개가 한 줄로 이어져 있고 줄의 양 끝에 하나씩 위와 아래로 붙어 있다') : tetraNet('전개도: 합동인 정삼각형 4개. 가운데 정삼각형의 세 변에 하나씩 붙어 큰 정삼각형을 이룬다'),
        shown: `${r.name}, ${r.m}개`,
        explain: `면이 합동인 정삼각형 ${r.f}개이므로 ${r.name}이다. ${r.name}의 한 꼭짓점에 모인 면은 ${r.m}개이다.`,
        facts: { calc: [[String(r.f), 0], [String(r.m), 1]], unseen: [r.m], rule: 'reg-net-' + n }
      });
    }, { count: 2 })
  ]);

  // ── 회전체 ───────────────────────────────────────────────────
  const CUT = { 원기둥: '직사각형', 원뿔: '이등변삼각형', 원뿔대: '사다리꼴', 구: '원', 반구: '반원' };
  const AXIS_CUT = '회전체를 회전축을 포함하는 평면으로 자를 때 생기는 단면은 회전축을 대칭축으로 하는 선대칭도형이다. ';
  // 작은 그림 칸에 넣는, 회전축과 평면도형
  const SPIN = {
    rect: { art: () => spin('rect', { w: 24, h: 44 }, { label: '한 변이 회전축 위에 놓인 직사각형' }), makes: '원기둥' },
    tri: { art: () => spin('tri', { a: 26, b: 44 }, { label: '직각을 낀 한 변이 회전축 위에 놓인 직각삼각형' }), makes: '원뿔' },
    trap: { art: () => spin('trap', { a: 14, b: 28, h: 42 }, { label: '두 밑변에 수직인 변이 회전축 위에 놓인 사다리꼴' }), makes: '원뿔대' },
    semi: { art: () => spin('semi', { r: 22 }, { label: '지름이 회전축 위에 놓인 반원' }), makes: '구' },
    rectOff: { art: () => spin('rectOff', { g: 12, w: 18, h: 44 }, { label: '회전축에서 떨어져 있는 직사각형' }), makes: '가운데가 원기둥 모양으로 뚫린 원기둥' },
    triOff: { art: () => spin('triOff', { g: 10, a: 20, b: 44 }, { label: '회전축에서 떨어져 있는 직각삼각형' }), makes: '가운데가 원기둥 모양으로 뚫린 입체도형' },
    iso: { art: () => spin('iso', { a: 24, h: 48 }, { label: '한 변이 회전축 위에 놓인 이등변삼각형' }), makes: '원뿔 2개를 밑면끼리 붙인 입체도형' }
  };
  // 가운데가 원기둥 모양으로 뚫린 원기둥. R: 바깥 반지름, r: 안쪽 반지름, h: 높이(px). o: { R, r, h: 글, label }
  function hollowFig(R, r, h, o) {
    const cv = canvas(), ry = r * TILT, s = addCyl(cv, [0, 0], R, h), opt = o || {};
    cv.add(blob(arcD([0, 0], r, ry, 0, 360), '#e2e8f0') + curve(arcD([0, 0], r, ry, 0, 360)) + stroke([-r, 0], [-r, h], 'dash') + stroke([r, 0], [r, h], 'dash') + curve(arcD([0, h], r, ry, 0, 360), 'dash'));
    if (opt.R || opt.r) cv.add(dot([0, 0]));
    if (opt.R) { cv.add(stroke([0, 0], [R, 0], 'thin')); leader(cv, [R + 6 + half(opt.R), -s.ry - 12], [R * 0.8, 0], opt.R); }
    if (opt.r) { cv.add(stroke([0, 0], [-r, 0], 'thin')); leader(cv, [-R - 4 - half(opt.r), -s.ry - 12], [-r * 0.5, 0], opt.r); }
    if (opt.h) cv.write([R + 5 + half(opt.h), h / 2 + 6], opt.h, kindOf(opt.h));
    return cv.out(opt.label);
  }
  const SOLID_TILE = {
    cyl: () => art('cyl'), cone: () => art('cone'), cfrus: () => art('cfrus'), ball: () => art('ball'),
    hollow: () => hollowFig(27, 11, 44, { label: '가운데가 원기둥 모양으로 뚫린 원기둥의 겨냥도' })
  };

  B.addTypes('7-2-4', 'turn', [
    T('turn-mean', '회전체, 회전축, 원뿔대의 뜻', '①1·31', (d, n) => {
      if (n === 1) return pickWord(d, '원뿔을 밑면에 평행한 평면으로 자를 때 생기는 두 입체도형 중에서 원뿔이 아닌 쪽의 입체도형을 무엇이라 하는가?', '원뿔대', ['각뿔대', '원기둥', '반구'], '원뿔을 밑면에 평행한 평면으로 자르면 위쪽에는 작은 원뿔이, 아래쪽에는 원뿔대가 생긴다.');
      if (d.bool()) return pickWord(d, '평면도형을 한 직선을 축으로 하여 1회전 시킬 때 생기는 입체도형을 무엇이라 하는가?', '회전체', ['다면체', '정다면체', '각뿔대'], TURN_LEAD + '이때 축으로 사용한 직선을 회전축이라 한다.');
      return pickWord(d, '평면도형을 한 직선을 축으로 하여 1회전 시켜 회전체를 만들 때, 축으로 사용한 직선을 무엇이라 하는가?', '회전축', ['모선', '대칭축', '높이'], TURN_LEAD + '이때 축으로 사용한 직선을 회전축이라 한다.');
    }, { count: 2 }),
    T('turn-pick-art', '그림에서 회전체 모두 고르기', '①26 ②26', (d) => {
      const keys = mixedArt(d), flags = keys.map((k) => ART[k].round), labels = TAGS.slice(0, 5), made = setOptions(d, labels, flags);
      return C('다음 입체도형 중 회전체를 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(keys.map(art)),
        explain: TURN_LEAD + '회전체는 ' + keys.map((k, i) => (flags[i] ? `${labels[i]}(${ART[k].name})` : '')).filter(Boolean).join(', ') + '이고, 나머지는 다면체이다.',
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('turn-pick-name', '이름을 보고 회전체 모두 고르기', '②25 ①27', (d) => {
      const names = mixedNames(d, 6), flags = names.map((w) => ROUND_NAMES.includes(w)), labels = KEYS.slice(0, 6), made = setOptions(d, labels, flags);
      return C('다음 중 회전체를 모두 고른 것은?', made.options, made.answer, {
        figure: words(names, labels),
        explain: TURN_LEAD + `${josa(listed(names.filter((_, i) => flags[i])), '이/가')} 회전체이고, 나머지는 다면체이다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('turn-make', '평면도형을 1회전 시킬 때 생기는 회전체의 이름', '①28 ②27', (d, n) => {
      const figure = n ? spin('quarter', { r: 46 }, { label: '한 반지름이 회전축 l 위에 놓인 사분원(원의 4분의 1)' }) : spin('trap', { a: 24, b: 48, h: 56 }, { label: '두 밑변에 수직인 변이 회전축 l 위에 놓인 사다리꼴. 윗변이 아랫변보다 짧다' });
      return more(pickWord(d, `다음 평면도형을 직선 ${V('l')}을 회전축으로 하여 1회전 시킬 때 생기는 회전체는?`, n ? '반구' : '원뿔대', n ? ['구', '원뿔', '원기둥', '원뿔대'] : ['원뿔', '원기둥', '각뿔대', '반구'],
        n ? '사분원을 한 반지름을 회전축으로 하여 1회전 시키면 구의 절반인 반구가 생긴다.' : '사다리꼴의 윗변과 아랫변이 크기가 다른 두 원을 그리므로 두 밑면의 크기가 다른 원뿔대가 생긴다.', figure), { facts: { rule: 'turn-make-' + n } });
    }, { count: 2 }),
    T('turn-frustum-dims', '사다리꼴을 돌려 만든 원뿔대의 두 밑면의 반지름과 높이', '②27', (d) => {
      const a = d.int(2, 4), b = a + d.int(2, 4), h = d.until(() => d.int(3, 8), (v) => v !== a && v !== b);
      return M(`다음 사다리꼴을 직선 ${V('l')}을 회전축으로 하여 1회전 시킬 때 생기는 회전체의 두 밑면의 반지름의 길이와 높이를 각각 구하시오.`, [{ label: '작은 밑면의 반지름', answer: a, unit: 'cm' }, { label: '큰 밑면의 반지름', answer: b, unit: 'cm' }, { label: '높이', answer: h, unit: 'cm' }], {
        figure: spin('trap', { a: spx(a, 13, 36, 60), b: spx(b, 13, 64, 100), h: spx(h, 13, 44, 100) }, { a: cm(a), b: cm(b), h: cm(h), label: `사다리꼴과 회전축 l. 윗변 ${cm(a)}, 아랫변 ${cm(b)}이고, 두 밑변에 수직인 길이 ${cm(h)}인 변이 회전축 위에 놓여 있다` }),
        explain: `회전체는 원뿔대이다. 회전축에서 뻗은 윗변과 아랫변이 두 밑면의 반지름이 되고, 회전축 위에 놓인 변이 높이가 된다.`,
        facts: { calc: [[String(a), 0], [String(b), 1], [String(h), 2]] }
      });
    }),
    T('turn-hollow', '회전축에서 떨어진 평면도형을 돌린 회전체 고르기', '①29 ②28', (d) => {
      const keys = d.shuffle(['cyl', 'hollow', 'cfrus', 'cone']), labels = TAGS.slice(0, 4);
      return C(`다음 직사각형을 직선 ${V('l')}을 회전축으로 하여 1회전 시킬 때 생기는 회전체는?`, labels, keys.indexOf('hollow'), {
        figure: spin('rectOff', { g: 22, w: 30, h: 60 }, { label: '직사각형과 회전축 l. 직사각형이 회전축에서 떨어져 있다' }) + tiles(keys.map((k) => SOLID_TILE[k]())),
        explain: '직사각형이 회전축에서 떨어져 있으므로 회전축과 직사각형 사이의 빈 곳이 돌아 생기는 원기둥 모양만큼 가운데가 뚫린다.',
        facts: { kindPick: { kinds: keys, target: 'hollow' } }
      });
    }),
    T('turn-which-plane', '회전체를 만든 평면도형 고르기', '①30 ②29·30', (d, n) => {
      const keys = n ? d.shuffle(['rect', 'rectOff', 'tri', 'trap']) : d.shuffle(d.shuffle(['rect', 'tri', 'semi', 'iso', 'triOff']).slice(0, 3).concat(['trap'])), want = n ? 'rectOff' : 'trap', labels = TAGS.slice(0, 4);
      return C(n ? `다음 회전체는 어떤 평면도형을 직선 ${V('l')}을 회전축으로 하여 1회전 시킨 것인가?` : `다음 평면도형 중 직선 ${V('l')}을 회전축으로 하여 1회전 시킬 때 생기는 회전체가 원뿔대인 것은?`, labels, keys.indexOf(want), {
        figure: (n ? hollowFig(44, 18, 62, { label: '가운데가 원기둥 모양으로 뚫린 원기둥의 겨냥도' }) : '') + tiles(keys.map((k) => SPIN[k].art())),
        explain: '1회전 시킬 때 생기는 회전체는 ' + keys.map((k, i) => `${labels[i]}는 ${SPIN[k].makes}`).join(', ') + '이다.',
        facts: { kindPick: { kinds: keys, target: want } }
      });
    }, { count: 2 }),
    T('turn-section-name', '회전체를 자를 때 생기는 단면의 모양', '①31 ②31', (d, n) => {
      const name = d.pick(n ? ['원기둥', '원뿔', '원뿔대', '구'] : ['원기둥', '원뿔', '원뿔대']), right = n ? '원' : CUT[name];
      return pickWord(d, `${josa(name, '을/를')} ${n ? '회전축에 수직인' : '회전축을 포함하는'} 평면으로 자를 때 생기는 단면의 모양은?`, right, ['원', '직사각형', '이등변삼각형', '사다리꼴', '반원'].filter((w) => w !== right).slice(0, 4),
        n ? '회전체를 회전축에 수직인 평면으로 자를 때 생기는 단면의 경계는 항상 원이다.' : AXIS_CUT + `${name}의 단면은 ${right}이다.`);
    }, { count: 2 }),
    T('turn-section-pair', '회전체와 회전축을 포함하는 평면으로 자른 단면의 짝', '①32 ②32', (d) => {
      const good = d.shuffle(Object.keys(CUT)), bad = d.pick([['원뿔', '직각삼각형'], ['원뿔대', '직사각형'], ['원기둥', '원'], ['반구', '원'], ['구', '반원']]);
      const rows = d.shuffle(good.filter((w) => w !== bad[0]).slice(0, 3).map((w) => [w + ' – ' + CUT[w], true]).concat([[bad[0] + ' – ' + bad[1], false]]));
      return C('다음 중 회전체와 그 회전체를 회전축을 포함하는 평면으로 자를 때 생기는 단면의 모양을 짝 지은 것으로 옳지 않은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => !r[1]), {
        explain: `${josa(bad[0], '을/를')} 회전축을 포함하는 평면으로 자를 때 생기는 단면은 ${CUT[bad[0]]}이다.`, facts: { truth: rows.map((r) => r[1]), want: false }
      });
    }),
    T('turn-always-same', '회전축에 수직인 평면으로 자른 단면이 항상 합동인 회전체', '심28', (d) => {
      const list = d.shuffle(['구', '원뿔', '원기둥', '원뿔대', '반구']);
      return C('다음 회전체 중 회전축에 수직인 평면으로 자를 때 생기는 단면이 항상 합동인 것은?', list, list.indexOf('원기둥'), {
        explain: '회전축에 수직인 평면으로 자를 때 생기는 단면은 모두 원이지만, 자르는 자리에 따라 원의 크기가 달라지지 않는 것은 원기둥뿐이다.', facts: { truth: list.map((w) => w === '원기둥'), want: true }
      });
    }),
    T('turn-claims', '회전체에 대한 설명', '①33 ②33 심27', (d, n) => claims(d, n, '회전체', [
      '회전체를 회전축에 수직인 평면으로 자를 때 생기는 단면의 경계는 항상 원이다.', '회전체를 회전축을 포함하는 평면으로 자를 때 생기는 단면은 모두 합동이다.', '회전체를 회전축을 포함하는 평면으로 자를 때 생기는 단면은 선대칭도형이다.',
      '구를 평면으로 자를 때 생기는 단면은 항상 원이다.', '원기둥을 회전축을 포함하는 평면으로 자를 때 생기는 단면은 직사각형이다.', '원뿔대의 두 밑면은 서로 평행하다.', '원뿔을 밑면에 평행한 평면으로 자르면 원뿔대를 만들 수 있다.'
    ], [
      ['원뿔을 회전축에 수직인 평면으로 자를 때 생기는 단면은 이등변삼각형이다.', '원뿔을 회전축에 수직인 평면으로 자를 때 생기는 단면은 원이다. 이등변삼각형은 회전축을 포함하는 평면으로 자를 때 생긴다.'],
      ['원뿔대의 두 밑면은 서로 합동인 원이다.', '원뿔대의 두 밑면은 서로 평행하지만 크기가 다른 원이므로 합동이 아니다.'],
      ['구를 회전축에 수직인 평면으로 자를 때 생기는 단면은 모두 합동이다.', '구를 회전축에 수직인 평면으로 자를 때 생기는 단면은 모두 원이지만 자르는 자리에 따라 크기가 다르다.'],
      ['원뿔대를 회전축을 포함하는 평면으로 자를 때 생기는 단면은 원이다.', '원뿔대를 회전축을 포함하는 평면으로 자를 때 생기는 단면은 사다리꼴이다.'],
      ['원기둥을 회전축을 포함하는 평면으로 자를 때 생기는 단면은 원이다.', '원기둥을 회전축을 포함하는 평면으로 자를 때 생기는 단면은 직사각형이다.', '원기둥을 회전축을 포함하는 평면으로 자를 때 생기는 단면은 직사각형이다.'],
      ['구의 회전축은 1개뿐이다.', '구의 중심을 지나는 직선은 모두 회전축이 될 수 있으므로 구의 회전축은 무수히 많다.']
    ]), { count: 2 }),
    T('turn-cut-area', '원기둥과 원뿔을 회전축을 포함하는 평면으로 자른 단면의 넓이', '①34', (d, n) => {
      const r = d.int(2, 6), h = d.until(() => d.int(3, 10), (v) => v !== r && v !== 2 * r), label = `${n ? '원뿔' : '원기둥'}의 겨냥도. 밑면의 반지름 ${cm(r)}, 높이 ${cm(h)}`;
      return N(`다음 ${n ? '원뿔을' : '원기둥을'} 회전축을 포함하는 평면으로 자를 때 생기는 단면의 넓이는?`, n ? r * h : 2 * r * h, {
        unit: 'cm²', figure: n ? coneFig(r, h, { r: cm(r), h: cm(h), label }) : cylFig(r, h, { r: cm(r), h: cm(h), label }),
        explain: n ? `단면은 밑변의 길이가 밑면의 지름 ${2 * r} cm이고 높이가 ${h} cm인 이등변삼각형이다. ${2 * r} × ${h} ÷ 2 = ${r * h}(cm²)` : `단면은 가로의 길이가 밑면의 지름 ${2 * r} cm이고 세로의 길이가 ${h} cm인 직사각형이다. ${2 * r} × ${h} = ${2 * r * h}(cm²)`,
        facts: calc(n ? `2*${r}*${h}/2` : `2*${r}*${h}`, [2])
      });
    }, { count: 2 }),
    T('turn-big-cut', '구를 평면으로 자를 때 생기는 가장 큰 단면의 넓이', '①35 ②78', (d) => {
      const r = d.int(3, 9);
      return N(`반지름의 길이가 ${r} cm인 구를 평면으로 자를 때 생기는 단면 중 가장 큰 단면의 넓이는?`, r * r, { unit: U2, explain: `구의 중심을 지나는 평면으로 자를 때 단면이 가장 크고, 그 단면은 반지름의 길이가 ${r} cm인 원이다. ${PI} × ${r} × ${r} = ${r * r}${PI}(cm²)`, facts: calc(`${r}*${r}`) });
    }),
    T('turn-cone-net', '원뿔의 전개도에서 길이 구하기', '①37·55 ②38', (d, n) => {
      const r = d.int(2, 5), l = r + d.int(2, 5), k = Math.min(52 / r, 100 / l, 12), h = Math.sqrt(l * l - r * r), label = `원뿔의 겨냥도. 밑면의 반지름 ${cm(r)}, 모선 ${cm(l)}`;
      const cone = coneFig(r, h, { r: cm(r), l: cm(l), label });
      if (n === 1) return N('다음 원뿔의 전개도에서 옆면인 부채꼴의 호의 길이는?', 2 * r, { unit: UL, figure: cone, explain: `옆면인 부채꼴의 호의 길이는 밑면인 원의 둘레의 길이와 같다. 2 × ${PI} × ${r} = ${2 * r}${PI}(cm)`, facts: calc(`2*${r}`, [2]) });
      return M('다음은 원뿔과 그 전개도이다. ㉠, ㉡에 알맞은 수를 각각 구하시오.', [{ label: '㉠', answer: l, unit: 'cm' }, { label: '㉡', answer: r, unit: 'cm' }], {
        figure: cone + coneNet(l * k * 0.62, r * k * 0.62, { l: '㉠', r: '㉡', label: '원뿔의 전개도. 옆면인 부채꼴의 반지름 ㉠ cm, 밑면인 원의 반지름 ㉡ cm' }),
        explain: `옆면인 부채꼴의 반지름의 길이는 원뿔의 모선의 길이와 같으므로 ㉠ = ${l}이고, 밑면인 원의 반지름의 길이는 ㉡ = ${r}이다.`,
        facts: { calc: [[String(l), 0], [String(r), 1]] }
      });
    }, { count: 2 }),
    T('turn-net-pick', '원뿔과 원뿔대의 전개도 고르기', '②39 ①31', (d) => {
      const want = d.pick(['cone', 'cfrus']), keys = d.shuffle(['cyl', 'cone', 'cfrus']), labels = TAGS.slice(0, 3);
      const NET = { cyl: () => cylNet(9, 30, { label: '직사각형의 위와 아래에 크기가 같은 원이 하나씩 붙은 그림' }), cone: () => coneNet(52, 16, { label: '부채꼴의 호에 원이 하나 붙은 그림' }), cfrus: () => frustumNet('큰 부채꼴에서 작은 부채꼴을 뺀 모양의 안쪽 호에 작은 원, 바깥쪽 호에 큰 원이 하나씩 붙은 그림') };
      return C(`다음 중 ${want === 'cone' ? '원뿔' : '원뿔대'}의 전개도는?`, labels, keys.indexOf(want), {
        figure: tiles(keys.map((k) => NET[k]())),
        explain: '원기둥의 옆면은 직사각형, 원뿔의 옆면은 부채꼴이고, 원뿔대의 옆면은 큰 부채꼴에서 작은 부채꼴을 뺀 모양이다. 원뿔대의 밑면은 크기가 다른 두 원이다.',
        facts: { kindPick: { kinds: keys, target: want } }
      });
    })
  ]);

  // 같은 단원의 다른 파일이 함께 쓰는 것
  B.kit.m724 = {
    SOLID, MEAS, T, PI, U2, U3, UL, TAGS, KEYS, cm, calc, fixed, sum, NUMW, gon, hedron, KIND, PART, solid, cnt, cntJs, cntSay, cntN, REG, setOptions, pickWord, words, listed, claims,
    RAD, TILT, f1, xy, ptsOf, CREAM, SKY, SAND, ROSE, INK, MATH, wide, stroke, curve, blob, fill, shape, dot, word, onEll, arcD, tail, canvas, one, tiles, half, kindOf, beside, corner, leader, dimV,
    addCyl, addCone, addCup, addSphere, addDome, addBowl, addFrustum, addPoly, ngon, ring, prismOf, pyramidOf, frustumOf, bipyramidOf, cutBoxOf, TURN, ART, art, bigArt,
    scaleOf, clampR, clampH, cylFig, coneFig, sphereFig, hemiFig, coneFrustumFig, cylNet, coneNet, frustumNet, netOf, outOf, pyrNet, frusNet, tetraNet, octaNet, axis, spx, spin, SPIN, hollowFig, POLY_NAMES, ROUND_NAMES
  };
})(typeof window !== 'undefined' ? window : globalThis);
