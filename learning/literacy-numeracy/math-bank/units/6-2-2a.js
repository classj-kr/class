// 6학년 2학기 2단원 공간과 입체 — 단원 틀, 그림 도구(쌓기나무 그림·모눈 칸 그림·물건과 사진), 기본 문항(여러 방향에서 본 모양, 쌓은 모양과 쌓기나무의 개수, 위·앞·옆에서 본 모양).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 68·64·64꼴, 심화꼴 63꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭) / 미룸」을 가른 대조표는 references/textbooks/수학/_분석/6-2-2/싣기_대조표.md 에 있다.
// (본 모양으로 쌓은 모양 알기·수 쓰기·층별 모양·여러 가지 모양 만들기의 기본 문항은 6-2-2b.js, 실력 문항은 6-2-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 도형과 측정 가운데 도형(공간 감각). 쌓은 모양을 보고 개수를 세고, 본 모양으로 나타내고, 본 모양에서 쌓은 모양을 추측하는 것이 이 단원의 일이다.
//   6수03-09 쌓기나무로 만든 입체도형을 보고 사용된 쌓기나무의 개수를 구할 수 있다.
//   6수03-10 쌓기나무로 만든 입체도형의 위, 앞, 옆에서 본 모양을 표현할 수 있고, 이러한 표현을 보고 입체도형의 모양을 추측할 수 있다.
//   교육과정: 「쌓기나무로 만든 입체도형의 위, 앞, 옆에서 본 모양에 대한 평가를 할 때는 간단한 모양을 이용한다.」
//   → 위에서 본 모양은 가로·세로 세 칸 안(붙여 만든 모양만 네 칸), 높이는 3층까지(한 줄로 붙인 4개를 세운 것만 4층), 쌓기나무는 열네 개 안쪽으로 한다.
//
// 싣는 기준
//  - 주는 것(쌓은 모양의 그림, 위에서 본 모양, 위에서 본 모양에 쓴 수, 위·앞·옆에서 본 모양, 층별 모양)과 묻는 것(개수, 본 모양, 쌓은 모양, 층의 개수, 같은 모양)이 다르면 다른 문제다.
//    쌓은 모양만 다른 것은 한 번만 싣고, 유형 안에서 씨앗마다 쌓은 모양이 바뀐다.
//  - 그림은 모두 칸마다 쌓은 수(높이 표)에서 셈하여 그린다.
//    쌓은 모양은 비스듬히 내려다본 그림으로, 쌓기나무마다 윗면·앞면·옆면을 먼 것부터 차례로 칠해 가려지는 것이 저절로 맞게 한다. 「앞」「옆」(오른쪽 옆)을 화살표로 적는다.
//    앞에서 본 모양은 세로줄마다 가장 높은 층, 옆에서 본 모양은 가로줄마다 가장 높은 층이고, 오른쪽 옆에서 보면 앞줄이 왼쪽에 온다.
//  - 뒤에 숨은 쌓기나무: 그림에서 삼각형 반 칸 단위로 무엇이 보이는지를 따로 셈하고(picture), 같은 그림이 되는 쌓은 모양을 모두 찾아(readings)
//    「위에서 본 모양을 알면 하나로 정해지는가」「쌓기나무의 수를 알면 하나로 정해지는가」「그림만으로 하나로 정해지는가」를 판정한다.
//    쌓은 모양은 쌓기나무가 면끼리 닿아 한 덩어리인 것으로 본다(따로 떨어진 쌓기나무는 모양에 넣지 않는다).
//    위에서 본 모양 없이 그림만 주는 문항은 「쌓기나무 N개로 쌓은 모양」이나 「뒤에 숨겨진 쌓기나무는 없다」를 함께 적고, 자리마다 맨 위 쌓기나무의 윗면이 다 보이는 모양만 쓴다
//    (비스듬히 본 그림에서는 앞·오른쪽의 높은 기둥과 뒤의 낮은 기둥의 윗면이 나란히 놓여 높이를 잘못 읽기 쉽다). 가려진 자리까지 세는 문제는 실력에 있다.
//  - 「그리시오」는 고르기나 수 답으로 바꾸었다(본 모양 그리기 → 본 모양 고르기·왼쪽부터 몇 층인가, 수 쓰기 → ㉠ 자리에 쓸 수, 층별 모양 그리기 → 층 모양 고르기).
//  - 여러 방향에서 본 물건: 수집본은 컵·집·조형물의 사진을 쓴다. 여기서는 탁자 위에 놓은 상자·공·고깔·통을 그림으로 그리고, 네 방향에서 찍은 사진을 왼쪽·오른쪽 차례가 정확한 그림으로 그린다.
//
// 뺀 것과 까닭(단원 전체)
//  - 겉넓이·부피·넓이 셈(①22 ③60 심60·61): 6-1 측정의 일이다. 겉면에 색칠한 쌓기나무 세기(심62), 규칙에 따라 층을 늘려 가며 세기(③61 심63): 경우 따지기·규칙 찾기다.
//  - 위·앞·옆에서 본 모양만 주고 가장 많은·가장 적은 경우를 따지기(①62 ②29 ③30 심42~44), 만들 수 있는 모양·쌓는 방법의 가짓수(①63 ②52·54 ③31·54 심45·46·55),
//    조건 여럿을 풀어 모양 맞추기(①9·55·56·65 ②30 ③59 심47), 놓을 자리마다 따지기(①20), 본 모양이 변하지 않게 가장 많이 빼내기·더 쌓기(①42 심50), 가능한 모양을 두 가지 그리기(②25 ③50·51): 경우 따지기·조건 풀이다.
//    본 모양 셋으로 묻는 문제는 쌓은 모양이 하나로 정해지는 것만 실었다(모든 경우를 따져 판정한다).
//  - 숨은 자리의 높이가 정해지지 않을 때의 가장 적은·많은 개수(①31·32 ②14 ③15 심12): 한 자리의 경우 따지기다. 같은 뜻(위에서 본 모양이 없으면 개수가 정해지지 않는다)은
//    「개수를 정확히 알 수 있는 모양」「위에서 본 모양이 없을 때 될 수 있는 개수」가 묻는다.
//  - 뒤에서 본 모양(③24): 성취기준의 방향(위·앞·옆)에 없다. 보이는·보이지 않는 쌓기나무의 수(②42): 「보인다」의 뜻이 한 가지로 읽히지 않는다.
//  - 그리기(①6·13·28 ②9·56·59 ③9 심6·18·58)·까닭 쓰기(①7 ②39 ③6 심8)·열린 과제와 놀이(③62·63)·앞 학년 되짚기(②63·64 ③64): 고르기나 수 답으로 바꿀 수 있는 것은 바꾸어 실었다.
//  - 물건의 생김새(손잡이가 보이는 쪽, 앞뒤가 다른 조형물·건물)로 가리는 사진 꼴(①3·5 ②6 ③3, 심4의 일부), 구멍이 있는 상자(①68 ②60): 그림을 그릴 도구가 없어 미루었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 풀이는 「~이다.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C } = B.kit;
  const G = B.kit.geo;
  const COUNT = '6수03-09', VIEW = '6수03-10';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마'], MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'], DIRS = ['위', '앞', '옆'];
  const sum = (list) => list.reduce((s, v) => s + v, 0);
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // 서로 다른 것만 남긴다(먼저 나온 것을 남긴다).
  const distinct = (list) => list.filter((a, i) => list.findIndex((b) => same(a, b)) === i);

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
  // 그림 칸(가, 나, 다, 라) 가운데 하나를 고르는 문제. flags: 칸마다 맞는가(코드로 셈한 것). 맞는 칸이 하나가 아니면 멈춘다.
  function pickTile(text, flags, o) {
    if (flags.filter(Boolean).length !== 1) throw new Error('맞는 그림이 하나가 아니다');
    return C(text, (o.labels || TAGS).slice(0, flags.length), flags.indexOf(true), { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: flags, want: true }, o.facts || {}) });
  }

  // ── 그림(픽셀 단위) ──────────────────────────────────────────
  const f1 = (n) => Math.round(n * 10) / 10;
  const ptsOf = (list) => list.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ');
  const INK = '#243042', BLUE = '#1d4ed8';
  // 그릴 것을 모으며 차지한 자리를 재어, 끝에 꼭 맞는 크기의 그림으로 낸다. 너비가 64px 에 못 미치면 양옆 여백을 넓힌다(화면 검사가 너무 좁은 그림을 떨어뜨린다).
  function canvas() {
    const parts = []; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const see = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
    return {
      add: (html) => { parts.push(html); }, see,
      box: (c, hw, hh) => { see(c[0] - hw, c[1] - hh); see(c[0] + hw, c[1] + hh); },
      out: (label, pad) => {
        const m = pad == null ? 4 : pad, side = Math.max(m, (64 - (x1 - x0)) / 2), w = x1 - x0 + side * 2, tall = Math.max(y1 - y0 + m * 2, 26);
        return '<svg class="mb-geo" viewBox="' + f1(x0 - side) + ' ' + f1(y0 - m) + ' ' + f1(w) + ' ' + f1(tall) + '" width="' + Math.ceil(w) + '" role="img" aria-label="' + label + '">' + parts.join('') + '</svg>';
      }
    };
  }
  const word = (p, text, css) => '<text class="mb-label" style="' + (css || 'font-size:13px') + '" x="' + f1(p[0]) + '" y="' + f1(p[1]) + '" text-anchor="middle" dominant-baseline="central">' + text + '</text>';
  // 화살표: from 에서 to 로. 글은 화살표가 시작하는 쪽 바깥에 적는다.
  function arrow(cv, from, to, text) {
    const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, a = 6.5, w = 3.4, base = [to[0] - ux * a, to[1] - uy * a];
    cv.add('<line x1="' + f1(from[0]) + '" y1="' + f1(from[1]) + '" x2="' + f1(base[0]) + '" y2="' + f1(base[1]) + '" style="stroke:' + BLUE + ';stroke-width:1.8;stroke-linecap:round"/>'
      + '<polygon points="' + ptsOf([to, [base[0] - uy * w, base[1] + ux * w], [base[0] + uy * w, base[1] - ux * w]]) + '" style="fill:' + BLUE + '"/>');
    const c = [from[0] - ux * 8.5, from[1] - uy * 8.5];
    cv.add(word(c, text, 'font-size:12.5px;font-weight:700;fill:' + BLUE)); cv.box(c, 7.5, 7.5); cv.see(to[0], to[1]);
  }
  // 이름표가 붙은 그림 칸 여럿. 다른 그림 옆에 끼어 한 줄에 하나씩 놓이지 않게 너비를 다 쓴다.
  const tiles = (list, labels) => G.tiles(list.map((svg, i) => [(labels || TAGS)[i], svg])).replace('class="mb-tiles"', 'class="mb-tiles" style="flex:1 1 100%"');

  // ── 쌓은 모양(높이 표) ───────────────────────────────────────
  // h[r][c]: 칸마다 쌓은 수. r = 0 이 뒷줄이고 아래로 갈수록 앞줄, c = 0 이 왼쪽이다(위에서 본 모양과 같은 차례 — 아래쪽이 앞, 오른쪽이 옆).
  const total = (h) => sum(h.map(sum));
  const peak = (h) => Math.max(...h.map((row) => Math.max(...row)));
  const copy = (h) => h.map((row) => row.slice());
  const cellsOf = (h) => { const out = []; h.forEach((row, r) => row.forEach((v, c) => { if (v > 0) out.push([r, c]); })); return out; };
  // 앞에서 본 모양: 왼쪽부터 세로줄마다 가장 높은 층
  const frontOf = (h) => h[0].map((_, c) => Math.max(...h.map((row) => row[c])));
  // 옆(오른쪽)에서 본 모양: 가로줄마다 가장 높은 층. 오른쪽에서 보면 앞줄이 왼쪽에, 뒷줄이 오른쪽에 보인다.
  const sideOf = (h) => h.map((row) => Math.max(...row)).reverse();
  // k층의 모양(1: 쌓기나무가 있다)
  const layerOf = (h, k) => h.map((row) => row.map((v) => (v >= k ? 1 : 0)));
  const footOf = (h) => layerOf(h, 1);
  const layerCounts = (h) => Array.from({ length: peak(h) }, (_, i) => total(layerOf(h, i + 1)));
  // 바깥쪽의 빈 줄을 떼어 낸다.
  function trim(h) {
    const rs = h.map((row, r) => (row.some((v) => v > 0) ? r : -1)).filter((r) => r >= 0), cs = h[0].map((_, c) => (h.some((row) => row[c] > 0) ? c : -1)).filter((c) => c >= 0);
    return h.slice(rs[0], rs[rs.length - 1] + 1).map((row) => row.slice(cs[0], cs[cs.length - 1] + 1));
  }
  const mirrored = (h) => h.map((row) => row.slice().reverse());
  const said = (h) => h.map((row) => row.join(' ')).join(' / ');
  const ROWS = { 1: ['한 줄'], 2: ['뒷줄', '앞줄'], 3: ['뒷줄', '가운뎃줄', '앞줄'], 4: ['맨 뒷줄', '뒤에서 둘째 줄', '앞에서 둘째 줄', '맨 앞줄'] };
  const COLS = { 1: ['한 칸'], 2: ['왼쪽', '오른쪽'], 3: ['왼쪽', '가운데', '오른쪽'], 4: ['맨 왼쪽', '왼쪽에서 둘째', '왼쪽에서 셋째', '맨 오른쪽'] };
  // 칸의 자리를 말로: 「뒷줄 왼쪽 칸」
  const where = (h, r, c) => (h[0].length === 1 ? ROWS[h.length][r] : (h.length > 1 ? ROWS[h.length][r] + ' ' : '') + COLS[h[0].length][c]) + ' 칸';
  const levels = (list) => list.map((v) => v + '층').join(', ');
  const byLayer = (h) => { const n = layerCounts(h); return n.map((v, i) => `${i + 1}층에 ${v}개`).join(', ') + (n.length > 1 ? `이므로 ${n.join(' + ')} = ${total(h)}(개)이다.` : '이다.'); };
  const plus = (h) => cellsOf(h).map(([r, c]) => h[r][c]).join('+');

  // ── 쌓기나무 그림 ────────────────────────────────────────────
  // 비스듬히 내려다본 그림. x 는 왼쪽→오른쪽(오른쪽 아래로 그린다), y 는 앞→뒤(오른쪽 위로 그린다), z 는 위. 한 모서리가 u(px).
  // 앞면은 왼쪽 아래에, 옆면(오른쪽)은 오른쪽 아래에, 윗면은 위에 보인다. 보는 쪽에 가까운 정도는 x − y + z 이고, 먼 것부터 칠한다.
  const COS = Math.sqrt(3) / 2;
  const proj = (x, y, z, u) => [(x + y) * COS * u, -((y - x) / 2 + z) * u];
  const WOOD = ['#fff7dc', '#f6d27e', '#e0aa4c'], ROSE = ['#ffd9d4', '#f58d82', '#d85f54'];   // 윗면, 앞면, 옆면(밝은 것부터)
  const cubesOf = (h) => { const out = [], R = h.length; h.forEach((row, r) => row.forEach((v, c) => { for (let z = 0; z < v; z += 1) out.push({ x: c, y: R - 1 - r, z }); })); return out; };
  // o: { u, tint: { 'x,y,z': [윗면, 앞면, 옆면 빛깔] }, marks: [{ x, y, z, text }](그 쌓기나무의 윗면에 적는 글), arrows: false(앞·옆 화살표를 그리지 않는다), label }
  function isoArt(cubes, o) {
    const opt = o || {}, u = opt.u || 20, cv = canvas(), has = new Set(cubes.map((c) => c.x + ',' + c.y + ',' + c.z)), P = (x, y, z) => proj(x, y, z, u);
    const face = (pts, color) => { pts.forEach((p) => cv.see(p[0], p[1])); cv.add('<polygon points="' + ptsOf(pts) + '" style="fill:' + color + ';stroke:' + INK + ';stroke-width:1.2;stroke-linejoin:round"/>'); };
    cubes.slice().sort((p, q) => (p.x - p.y + p.z) - (q.x - q.y + q.z)).forEach(({ x, y, z }) => {
      const tone = (opt.tint && opt.tint[x + ',' + y + ',' + z]) || WOOD;
      if (!has.has(x + ',' + y + ',' + (z + 1))) face([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], tone[0]);
      if (!has.has(x + ',' + (y - 1) + ',' + z)) face([P(x, y, z), P(x + 1, y, z), P(x + 1, y, z + 1), P(x, y, z + 1)], tone[1]);
      if (!has.has((x + 1) + ',' + y + ',' + z)) face([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], tone[2]);
    });
    (opt.marks || []).forEach((m) => cv.add(word(P(m.x + 0.5, m.y + 0.5, m.z + 1), m.text, 'font-size:' + (u >= 20 ? 13 : 11.5) + 'px')));
    if (opt.arrows !== false) {
      const xs = cubes.map((c) => c.x), ys = cubes.map((c) => c.y), xa = Math.min(...xs), xb = Math.max(...xs) + 1, ya = Math.min(...ys), yb = Math.max(...ys) + 1, len = 15 / u, fx = xa + (xb - xa) * 0.62, sy = ya + (yb - ya) * 0.38;
      // 앞 화살표는 앞쪽 가운데보다 조금 오른쪽에서, 옆 화살표는 오른쪽 가운데보다 조금 앞에서 가리킨다(그림이 옆으로 덜 퍼진다).
      arrow(cv, P(fx, ya - 0.45 - len, 0), P(fx, ya - 0.45, 0), '앞');
      arrow(cv, P(xb + 0.45 + len, sy, 0), P(xb + 0.45, sy, 0), '옆');
    }
    return cv.out(opt.label || '쌓기나무를 붙여 만든 모양');
  }
  // 높이 표를 그림으로. o.marks: [[r, c, 글]](그 자리의 맨 위 쌓기나무에 적는다), o.tint: [[r, c, z]](색칠할 쌓기나무)
  function stackArt(h, o) {
    const opt = o || {}, R = h.length, tint = {};
    (opt.tint || []).forEach(([r, c, z]) => { tint[c + ',' + (R - 1 - r) + ',' + z] = ROSE; });
    return isoArt(cubesOf(h), { u: opt.u, arrows: opt.arrows, tint, marks: (opt.marks || []).map(([r, c, text]) => ({ x: c, y: R - 1 - r, z: h[r][c] - 1, text })),
      label: (opt.said || '쌓기나무를 쌓은 모양') + '. 뒷줄부터 줄마다 왼쪽부터 쌓은 수: ' + said(h) });
  }

  // ── 그림에서 보이는 것 ───────────────────────────────────────
  // 그림은 정삼각형 모눈 위에 놓인다. 쌓기나무 하나는 삼각형 여섯 개(윗면 둘, 앞면 둘, 옆면 둘)를 차지하고,
  // (x, y, z) 와 (x + 1, y − 1, z + 1) 은 그림에서 같은 자리에 겹친다. 삼각형마다 가장 가까운 쌓기나무의 면이 보인다.
  const TRI = (x, y, z) => { const a = x - z + 24, b = y + z + 25; return [((a - 1) * 64 + b) * 2 + 1, ((a - 1) * 64 + b) * 2, ((a - 1) * 64 + b - 1) * 2 + 1, (a * 64 + b - 1) * 2, (a * 64 + b - 1) * 2 + 1, (a * 64 + b) * 2]; };
  // 그림: types(삼각형 → 보이는 면의 갈래 0 윗면, 1 앞면, 2 옆면), shown(쌓기나무 → 면마다 보이는 삼각형의 수)
  function picture(cubes) {
    const types = new Map(), shown = new Map();
    cubes.slice().sort((p, q) => (q.x - q.y + q.z) - (p.x - p.y + p.z)).forEach((c) => {
      const got = [0, 0, 0];
      TRI(c.x, c.y, c.z).forEach((key, k) => { if (!types.has(key)) { types.set(key, k >> 1); got[k >> 1] += 1; } });
      shown.set(c.x + ',' + c.y + ',' + c.z, got);
    });
    return { types, shown };
  }
  // 그림에서 기둥(칸)마다 보이는 정도. lost: 통째로 가려진 기둥의 수, tops: 맨 위 쌓기나무의 윗면이 가장 덜 보이는 기둥의 것(0 안 보임, 1 반, 2 다 보임),
  // thin: 맨 위 쌓기나무의 윗면이 반만 보이는데 다른 면도 거의 보이지 않는(세모 셋이 안 되는) 기둥이 있는가(그런 기둥은 그림에서 알아보기 어렵다),
  // top(r, c): 그 칸의 윗면이 보이는 정도, faces(r, c, z): 그 쌓기나무의 [윗면, 앞면, 옆면]이 보이는 정도(반 칸 단위), gone(r, c): 그 칸이 통째로 가려졌는가
  function sight(h) {
    const { shown } = picture(cubesOf(h)), R = h.length, at = (r, c, z) => shown.get(c + ',' + (R - 1 - r) + ',' + z); let lost = 0, tops = 2, thin = false;
    const gone = (r, c) => { for (let z = 0; z < h[r][c]; z += 1) if (sum(at(r, c, z)) > 0) return false; return true; };
    cellsOf(h).forEach(([r, c]) => { if (gone(r, c)) lost += 1; const got = at(r, c, h[r][c] - 1); tops = Math.min(tops, got[0]); if (got[0] < 2 && sum(got) < 3) thin = true; });
    return { lost, tops, thin, top: (r, c) => at(r, c, h[r][c] - 1)[0], faces: at, gone };
  }
  // 기둥마다 맨 위 쌓기나무의 윗면이 다 보이거나, 반만 보이더라도 다른 면과 함께 세모 셋 넘게 보이는가(그림에서 칸마다 쌓은 수를 읽을 수 있다)
  const clear = (h) => { const s = sight(h); return s.tops >= 1 && !s.thin; };
  // 기둥마다 맨 위 쌓기나무의 윗면이 다 보이는가. 위에서 본 모양 없이 그림만 주는 모양은 이것만 쓴다
  // (앞이나 오른쪽에 더 높은 기둥이 있으면 뒤의 기둥이 반쯤 가려지고, 높이가 다른 기둥의 윗면이 그림에서 나란히 놓여 높이를 잘못 읽기 쉽다).
  const open = (h) => sight(h).tops === 2;
  // 같은 그림이 되는 쌓은 모양을 모두 찾는다(cap 개까지). 가까운 칸부터 높이를 정해 가며, 새로 보이게 되는 삼각형이 그림과 다르면 그만둔다
  // (먼 칸의 쌓기나무는 가까운 칸의 쌓기나무를 가리지 못하므로 한 번 정해진 삼각형은 바뀌지 않는다).
  // o.top: 위에서 본 모양을 안다(쌓기나무가 놓인 칸은 그대로다). 모르면 왼쪽과 뒤쪽으로 두 칸씩 넓혀 숨을 수 있는 자리를 모두 찾고, 칸끼리 변으로 이어진 모양만 센다.
  // o.total: 쌓기나무의 수가 이것인 모양만, o.shown: 통째로 가려진 기둥이 없는 모양만 찾는다. o.loose: 칸끼리 이어지지 않은 모양(따로 떨어져 숨은 쌓기나무)도 센다.
  // 돌려주는 것: [{ total, cols: { 'x,y': 높이 }, extra: 처음 모양에 없던 칸 [[x, y, 높이]], same: 처음 모양 그대로인가 }]
  function readings(h, o) {
    const opt = o || {}, R = h.length, Cn = h[0].length, ext = opt.top ? 0 : 2, most = peak(h) + 1, cap = opt.cap || 24;
    const want = picture(cubesOf(h)).types, cells = [];
    for (let x = -ext; x < Cn; x += 1) for (let y = 0; y < R + ext; y += 1) { const t = x >= 0 && y < R ? h[R - 1 - y][x] : 0; if (opt.top && !t) continue; cells.push({ x, y, t }); }
    cells.sort((p, q) => (q.x - q.y) - (p.x - p.y));
    const owned = new Set(), cur = cells.map(() => 0), out = [];
    const linked = () => {
      const on = new Set(cells.filter((_, i) => cur[i] > 0).map((c) => c.x + ',' + c.y)), first = on.values().next().value, seen = new Set([first]), queue = [first];
      while (queue.length) { const [x, y] = queue.pop().split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const key = (x + dx) + ',' + (y + dy); if (on.has(key) && !seen.has(key)) { seen.add(key); queue.push(key); } } }
      return seen.size === on.size;
    };
    (function place(i, n, used) {
      if (out.length >= cap) return;
      if (i === cells.length) {
        if (n !== want.size || (opt.total != null && used !== opt.total) || !(opt.top || opt.loose || linked())) return;
        const cols = {}, extra = []; cells.forEach((c, k) => { if (cur[k]) cols[c.x + ',' + c.y] = cur[k]; if (cur[k] && !c.t) extra.push([c.x, c.y, cur[k]]); });
        out.push({ total: used, cols, extra, same: cells.every((c, k) => c.t === cur[k]) }); return;
      }
      const { x, y } = cells[i];
      for (let k = opt.top ? 1 : 0; k <= most; k += 1) {
        if (opt.total != null && used + k > opt.total) break;
        const added = []; let ok = true;
        for (let z = k - 1; z >= 0 && ok; z -= 1) { const keys = TRI(x, y, z); for (let t = 0; t < 6; t += 1) { if (owned.has(keys[t])) continue; if (want.get(keys[t]) !== (t >> 1)) { ok = false; break; } owned.add(keys[t]); added.push(keys[t]); } }
        if (ok && !(opt.shown && k > 0 && !added.length)) { cur[i] = k; place(i + 1, n + added.length, used + k); }
        added.forEach((key) => owned.delete(key));
      }
      cur[i] = 0;
    })(0, 0, 0);
    return out;
  }
  // 위에서 본 모양을 함께 주면 쌓은 모양이 하나로 정해지는가
  const fixedByTop = (h) => readings(h, { top: true, cap: 2 }).length === 1;
  // 그림만으로 하나로 정해지는가(뒤에 숨은 쌓기나무가 있을 수 없다)
  const fixedAlone = (h) => readings(h, { cap: 2 }).length === 1;
  // 「쌓기나무 N개로 쌓은 모양」이라고 알려 주면 하나로 정해지는가
  const fixedByCount = (h) => readings(h, { total: total(h), cap: 2 }).length === 1;
  // 「뒤에 숨겨진 쌓기나무는 없다」고 알려 주면 하나로 정해지는가(통째로 가려진 기둥이 없는 모양은 이것뿐이다)
  const fixedIfShown = (h) => sight(h).lost === 0 && readings(h, { shown: true, cap: 2 }).length === 1;

  // ── 쌓은 모양 고르기 ─────────────────────────────────────────
  const NEAR = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  // 변끼리 이어진 칸 n개. 가로줄 R개, 세로줄 Cn개에 모두 칸이 있다(테두리가 꼭 R×Cn).
  function footprint(d, R, Cn, n) {
    return d.until(() => {
      const cells = [[d.int(0, R - 1), d.int(0, Cn - 1)]];
      for (let guard = 0; cells.length < n && guard < 400; guard += 1) { const [r, c] = d.pick(cells), [dr, dc] = d.pick(NEAR), p = [r + dr, c + dc]; if (p[0] >= 0 && p[0] < R && p[1] >= 0 && p[1] < Cn && !cells.some((q) => q[0] === p[0] && q[1] === p[1])) cells.push(p); }
      return cells;
    }, (cells) => cells.length === n && new Set(cells.map((q) => q[0])).size === R && new Set(cells.map((q) => q[1])).size === Cn);
  }
  // 쌓은 모양 하나. o: { sizes: [[가로줄 수, 세로줄 수] …], cells: [가장 적게, 가장 많이], peak: [가장 높은 층의 범위], lean: 높은 기둥을 뒤쪽·왼쪽에 몰아 둘 확률 }
  function pile(d, o) {
    const [R, Cn] = d.pick(o.sizes), n = d.int(Math.max(o.cells[0], R + Cn - 1), Math.max(R + Cn - 1, Math.min(o.cells[1], R * Cn))), top = d.int(o.peak[0], o.peak[1]);
    const h = Array.from({ length: R }, () => Array(Cn).fill(0)), cells = d.shuffle(footprint(d, R, Cn, n));
    let heights = cells.map((_, i) => (i === 0 ? top : d.pick([1, 1, 1, 2, 2, 3].filter((v) => v <= top))));
    if (o.lean && d.next() < o.lean) { heights = heights.sort((a, b) => b - a); cells.sort((p, q) => (p[1] + p[0]) - (q[1] + q[0]) || p[0] - q[0]); }
    cells.forEach(([r, c], i) => { h[r][c] = heights[i]; });
    return h;
  }
  const SQ = [[3, 3]], MID = [[3, 3], [3, 3], [2, 3], [3, 2]], ANY = [[3, 3], [3, 3], [2, 3], [3, 2], [2, 2]];

  // ── 모눈 칸 그림 ─────────────────────────────────────────────
  // cells[r][c]: null(칸 없음), ''(빈 칸), 그 밖에는 칸에 적을 글. o: { u: 한 칸(px), frame: 바탕 모눈을 깐다, front·side: 「앞」「옆」을 적는다, tint: { 'r,c': 빛깔 }, label }
  function gridArt(cells, o) {
    const opt = o || {}, u = opt.u || 22, R = cells.length, Cn = cells[0].length, cv = canvas(), W = Cn * u, tall = R * u;
    cv.see(0, 0); cv.see(W, tall);
    if (opt.frame) {
      for (let x = 0; x <= Cn; x += 1) cv.add('<line class="mb-gridline" x1="' + x * u + '" y1="0" x2="' + x * u + '" y2="' + tall + '"/>');
      for (let y = 0; y <= R; y += 1) cv.add('<line class="mb-gridline" x1="0" y1="' + y * u + '" x2="' + W + '" y2="' + y * u + '"/>');
    }
    cells.forEach((row, r) => row.forEach((v, c) => {
      if (v == null) return;
      cv.add('<rect x="' + c * u + '" y="' + r * u + '" width="' + u + '" height="' + u + '" style="fill:' + ((opt.tint && opt.tint[r + ',' + c]) || WOOD[0]) + ';stroke:' + INK + ';stroke-width:1.3"/>');
      if (v !== '') cv.add(word([c * u + u / 2, r * u + u / 2 + 0.5], v, 'font-size:' + (u >= 20 ? 14 : 12.5) + 'px'));
    }));
    const note = 'font-size:12px;font-weight:700;fill:' + BLUE;
    if (opt.front) { cv.add('<polygon points="' + ptsOf([[W / 2, tall + 3], [W / 2 - 4, tall + 9], [W / 2 + 4, tall + 9]]) + '" style="fill:' + BLUE + '"/>' + word([W / 2, tall + 17.5], '앞', note)); cv.box([W / 2, tall + 17.5], 7, 7); }
    if (opt.side) { cv.add('<polygon points="' + ptsOf([[W + 3, tall / 2], [W + 9, tall / 2 - 4], [W + 9, tall / 2 + 4]]) + '" style="fill:' + BLUE + '"/>' + word([W + 17.5, tall / 2], '옆', note)); cv.box([W + 17.5, tall / 2], 7, 7); }
    return cv.out(opt.label || '모눈 칸 그림');
  }
  const marksOf = (rows) => rows.map((row) => row.map((v) => (v == null ? '×' : v === '' ? '○' : v)).join(' ')).join(' / ');
  // 위에서 본 모양. o.text: [[r, c, 글]](칸에 적을 글), o.numbers: 칸마다 쌓은 수를 적는다, o.hide: [[r, c, 글]](수 대신 적을 글)
  function topArt(h, o) {
    const opt = o || {}, cells = h.map((row) => row.map((v) => (v > 0 ? (opt.numbers ? String(v) : '') : null)));
    (opt.text || []).concat(opt.hide || []).forEach(([r, c, text]) => { cells[r][c] = text; });
    const plain = cells.every((row) => row.every((v) => v == null || v === ''));
    return gridArt(cells, { u: opt.u, frame: opt.frame, front: opt.front !== false, side: opt.side !== false, tint: opt.tint,
      label: (opt.said || '위에서 본 모양') + '(칸 ' + cellsOf(h).length + '개). 뒷줄부터 줄마다 왼쪽부터 ' + (plain ? '' : '칸에 적힌 것, ') + '○는 칸이 있는 자리, ×는 없는 자리: ' + marksOf(cells) });
  }
  // 앞이나 옆에서 본 모양. list: 왼쪽부터 층수, top: 모눈의 높이(칸)
  function viewArt(list, o) {
    const opt = o || {}, top = opt.top || Math.max(...list), cells = Array.from({ length: top }, (_, r) => list.map((v) => (v >= top - r ? '' : null)));
    return gridArt(cells, { u: opt.u || 20, frame: opt.frame !== false, label: (opt.said || '본 모양') + '. 왼쪽부터 ' + levels(list) });
  }
  // 한 층의 모양(1: 쌓기나무가 있다)
  const layerArt = (m, o) => gridArt(m.map((row) => row.map((v) => (v ? '' : null))), { u: (o && o.u) || 18, frame: true, label: ((o && o.said) || '층의 모양') + '(칸 ' + total(m) + '개). 뒷줄부터 줄마다 왼쪽부터 ○는 칸이 있는 자리, ×는 없는 자리: ' + marksOf(m.map((row) => row.map((v) => (v ? '' : null)))) });
  // 본 모양 셋(위, 앞, 옆)을 나란히
  const threeViews = (h, o) => tiles([topArt(h, Object.assign({ u: 20, side: false }, o || {})), viewArt(frontOf(h), { top: peak(h), said: '앞에서 본 모양' }), viewArt(sideOf(h), { top: peak(h), said: '옆에서 본 모양' })], DIRS);
  // 층수 목록에서 한 곳만 한 층 다른 것들
  const oneOff = (list, top) => { const out = []; list.forEach((v, i) => [v - 1, v + 1].forEach((w) => { if (w >= 1 && w <= top) out.push(list.map((x, j) => (j === i ? w : x))); })); return out; };
  // 칸 그림 셋(위, 앞, 옆)을 같은 꼴(칸이 있는가)로 바꾸어 견준다.
  const topCells = (h) => h.map((row) => row.map((v) => (v > 0 ? 1 : 0)));
  const viewCells = (list) => { const top = Math.max(...list); return Array.from({ length: top }, (_, r) => list.map((v) => (v >= top - r ? 1 : 0))); };
  const cellArt = (m, o) => gridArt(m.map((row) => row.map((v) => (v ? '' : null))), Object.assign({ u: 20, label: '칸 그림. 윗줄부터 줄마다 왼쪽부터 ○는 칸이 있는 자리, ×는 없는 자리: ' + marksOf(m.map((row) => row.map((v) => (v ? '' : null)))) }, o || {}));

  // ── 탁자 위의 물건과 사진 ────────────────────────────────────
  // 물건은 가로 3칸, 세로 3칸인 탁자의 칸에 놓는다. x 는 왼쪽부터, y 는 앞에서부터 센 칸.
  const THINGS = { box: { name: '상자', tone: '#f58d82' }, ball: { name: '공', tone: '#7db4f5' }, cone: { name: '고깔', tone: '#f6c945' }, can: { name: '통', tone: '#86d39a' } };
  const SIDES = ['front', 'right', 'back', 'left'], SIDE_WORD = { front: '앞', right: '오른쪽', back: '뒤', left: '왼쪽' };
  // 그 쪽에서 볼 때 [왼쪽부터의 자리, 먼 정도]
  const LOOK = { front: (it) => [it.x, it.y], right: (it) => [it.y, 2 - it.x], back: (it) => [2 - it.x, 2 - it.y], left: (it) => [2 - it.y, it.x] };
  // 그 쪽에서 볼 때 왼쪽부터 보이는 물건(같은 자리에 겹치면 가까운 것만 남긴다: 크기가 같은 물건은 뒤의 것을 다 가린다)
  function seenFrom(items, side) {
    const spots = {}; items.forEach((it) => { const [at, far] = LOOK[side](it); if (!spots[at] || far < spots[at].far) spots[at] = { far, it }; });
    return Object.keys(spots).sort().map((at) => spots[at].it);
  }
  const nameOf = (it) => it.name || THINGS[it.kind].name;
  const shade = (hex, k) => '#' + [1, 3, 5].map((i) => Math.round(parseInt(hex.slice(i, i + 2), 16) * k).toString(16).padStart(2, '0')).join('');
  // 탁자와 물건(비스듬히 내려다본 그림). o.names: { front, right, back, left }(네 쪽에서 보는 방향의 이름)
  function sceneArt(items, o) {
    const opt = o || {}, u = opt.u || 30, cv = canvas(), P = (x, y, z) => proj(x, y, z, u), line = 'stroke:' + INK + ';stroke-width:1.2;stroke-linejoin:round';
    const floor = [P(0, 0, 0), P(3, 0, 0), P(3, 3, 0), P(0, 3, 0)]; floor.forEach((p) => cv.see(p[0], p[1]));
    cv.add('<polygon points="' + ptsOf(floor) + '" style="fill:#f1f5f9;stroke:#64748b;stroke-width:1.2"/>');
    for (let k = 1; k < 3; k += 1) { const a = P(k, 0, 0), b = P(k, 3, 0), c = P(0, k, 0), e = P(3, k, 0); cv.add('<line class="mb-gridline" x1="' + f1(a[0]) + '" y1="' + f1(a[1]) + '" x2="' + f1(b[0]) + '" y2="' + f1(b[1]) + '"/><line class="mb-gridline" x1="' + f1(c[0]) + '" y1="' + f1(c[1]) + '" x2="' + f1(e[0]) + '" y2="' + f1(e[1]) + '"/>'); }
    const names = opt.names || {};
    if (names.back) arrow(cv, P(1.5, 4.25, 0), P(1.5, 3.3, 0), names.back);
    if (names.left) arrow(cv, P(-1.25, 1.5, 0), P(-0.3, 1.5, 0), names.left);
    items.slice().sort((p, q) => (p.x - p.y) - (q.x - q.y)).forEach((it) => {
      const tone = it.tone || THINGS[it.kind].tone, cx = it.x + 0.5, cy = it.y + 0.5, c0 = P(cx, cy, 0), wide = (r) => r * u * Math.sqrt(1.5), flat = (r) => r * u * Math.SQRT1_2;
      const see = (hw, up) => { cv.see(c0[0] - hw, c0[1] + hw); cv.see(c0[0] + hw, c0[1] - up); };
      if (it.kind === 'box') {
        const s = 0.31, t = 0.62, Q = (dx, dy, z) => P(cx + dx, cy + dy, z);
        cv.add('<polygon points="' + ptsOf([Q(-s, -s, t), Q(s, -s, t), Q(s, s, t), Q(-s, s, t)]) + '" style="fill:' + tone + ';' + line + '"/>'
          + '<polygon points="' + ptsOf([Q(-s, -s, 0), Q(s, -s, 0), Q(s, -s, t), Q(-s, -s, t)]) + '" style="fill:' + shade(tone, 0.88) + ';' + line + '"/>'
          + '<polygon points="' + ptsOf([Q(s, -s, 0), Q(s, s, 0), Q(s, s, t), Q(s, -s, t)]) + '" style="fill:' + shade(tone, 0.74) + ';' + line + '"/>');
        see(wide(0.45), t * u + flat(0.45));
      } else if (it.kind === 'ball') {
        const r = 0.33, c = P(cx, cy, r), R = wide(r);
        cv.add('<circle cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + f1(R) + '" style="fill:' + tone + ';' + line + '"/><circle cx="' + f1(c[0] - R * 0.3) + '" cy="' + f1(c[1] - R * 0.35) + '" r="' + f1(R * 0.22) + '" style="fill:#fff;opacity:0.7"/>');
        see(R, r * u + R);
      } else if (it.kind === 'cone') {
        const r = 0.34, a = wide(r), b = flat(r), tall = 0.85 * u, ang = Math.asin(b / tall), px = a * Math.cos(ang), py = b * Math.sin(ang);
        cv.add('<path d="M' + f1(c0[0]) + ' ' + f1(c0[1] - tall) + 'L' + f1(c0[0] + px) + ' ' + f1(c0[1] - py) + 'A' + f1(a) + ' ' + f1(b) + ' 0 1 1 ' + f1(c0[0] - px) + ' ' + f1(c0[1] - py) + 'Z" style="fill:' + tone + ';' + line + '"/>');
        see(a, tall);
      } else {
        const r = 0.3, a = wide(r), b = flat(r), tall = 0.9 * u;
        cv.add('<path d="M' + f1(c0[0] - a) + ' ' + f1(c0[1] - tall) + 'V' + f1(c0[1]) + 'A' + f1(a) + ' ' + f1(b) + ' 0 0 0 ' + f1(c0[0] + a) + ' ' + f1(c0[1]) + 'V' + f1(c0[1] - tall) + 'Z" style="fill:' + shade(tone, 0.86) + ';' + line + '"/>'
          + '<ellipse cx="' + f1(c0[0]) + '" cy="' + f1(c0[1] - tall) + '" rx="' + f1(a) + '" ry="' + f1(b) + '" style="fill:' + tone + ';' + line + '"/>');
        see(a, tall + b);
      }
    });
    if (names.front) arrow(cv, P(1.5, -1.25, 0), P(1.5, -0.3, 0), names.front);
    if (names.right) arrow(cv, P(4.25, 1.5, 0), P(3.3, 1.5, 0), names.right);
    const told = items.map((it) => `${josa(nameOf(it), '은/는')} 왼쪽에서 ${it.x + 1}째, 앞에서 ${it.y + 1}째 칸`).join(', ');
    const who = SIDES.filter((s) => names[s]).map((s) => (names[s] === SIDE_WORD[s] ? `화살표는 ${names[s]}에서 보는 쪽` : `${names[s]}는 ${SIDE_WORD[s]}`)).join(', ');
    return cv.out('탁자 위에 놓인 물건. ' + told + (who ? '. 보는 방향: ' + who : ''));
  }
  // 사진: 왼쪽부터 차례로 놓인 물건을 옆에서 본 모양으로 그린다.
  function photoArt(list, o) {
    const cv = canvas(), gap = 34, ground = 40, line = 'stroke:' + INK + ';stroke-width:1.2;stroke-linejoin:round';
    cv.see(0, 0); cv.see(gap * list.length + 6, ground + 8);
    cv.add('<rect x="0" y="0" width="' + (gap * list.length + 6) + '" height="' + (ground + 8) + '" rx="4" style="fill:#f8fafc;stroke:#94a3b8;stroke-width:1"/><line x1="0" y1="' + ground + '" x2="' + (gap * list.length + 6) + '" y2="' + ground + '" style="stroke:#94a3b8;stroke-width:1"/>');
    list.forEach((it, i) => {
      const x = 3 + gap * i + gap / 2, tone = it.tone || THINGS[it.kind].tone;
      if (it.kind === 'box') cv.add('<rect x="' + (x - 10) + '" y="' + (ground - 20) + '" width="20" height="20" style="fill:' + tone + ';' + line + '"/>');
      else if (it.kind === 'ball') cv.add('<circle cx="' + x + '" cy="' + (ground - 10.5) + '" r="10.5" style="fill:' + tone + ';' + line + '"/>');
      else if (it.kind === 'cone') cv.add('<polygon points="' + ptsOf([[x, ground - 28], [x + 11, ground], [x - 11, ground]]) + '" style="fill:' + tone + ';' + line + '"/>');
      else cv.add('<rect x="' + (x - 9.5) + '" y="' + (ground - 29) + '" width="19" height="29" rx="2" style="fill:' + tone + ';' + line + '"/>');
    });
    return cv.out(((o && o.said) || '사진') + ': 왼쪽부터 ' + list.map(nameOf).join(', '), 3);
  }
  // 물건 셋을 가로줄도 세로줄도 겹치지 않게 놓는다(어느 쪽에서 보아도 서로 가리지 않고, 네 쪽에서 본 왼쪽·오른쪽 차례가 모두 다르다).
  function scene3(d) {
    const kinds = d.shuffle(['box', 'ball', 'cone', 'can']).slice(0, 3), ys = d.pick([[0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1]]);
    return kinds.map((kind, i) => ({ kind, x: i, y: ys[i] }));
  }
  // 네 쪽에 이름(가, 나, 다, 라)을 섞어 붙인다.
  const viewers = (d) => { const t = d.shuffle(TAGS.slice(0, 4)); return { front: t[0], right: t[1], back: t[2], left: t[3] }; };
  const sideBy = (names, tag) => SIDES.find((s) => names[s] === tag);
  const orderOf = (items, side) => seenFrom(items, side).map(nameOf);

  // 6-2-2b.js, 6-2-2c.js 가 같은 도구를 쓴다(이 파일이 먼저 불린다).
  B.kit.blocks622 = { TAGS, MARKS, DIRS, sum, same, distinct, setOptions, pickTile, canvas, word, tiles, INK, BLUE, WOOD, ROSE, total, peak, copy, cellsOf, frontOf, sideOf, layerOf, footOf, layerCounts, trim, mirrored, said, where, levels, byLayer, plus,
    cubesOf, isoArt, stackArt, picture, sight, clear, open, readings, fixedByTop, fixedAlone, fixedByCount, fixedIfShown, footprint, pile, SQ, MID, ANY, gridArt, marksOf, topArt, viewArt, layerArt, threeViews, oneOff, topCells, viewCells, cellArt, NEAR, COUNT, VIEW };

  B.addUnit({
    id: '6-2-2', grade: 6, semester: 2, no: 2, title: '공간과 입체', version: 1,
    groups: [
      { id: 'dir', title: '여러 방향에서 본 모양', standard: VIEW, types: [] },
      { id: 'count', title: '쌓은 모양과 쌓기나무의 개수', standard: COUNT, types: [] },
      { id: 'views', title: '위, 앞, 옆에서 본 모양', standard: VIEW, types: [] },
      { id: 'guess', title: '본 모양으로 쌓은 모양 알기', standard: VIEW, types: [] },
      { id: 'nums', title: '위에서 본 모양에 수를 써서 나타내기', standard: VIEW, types: [] },
      { id: 'layers', title: '층별로 나타낸 모양', standard: VIEW, types: [] },
      { id: 'make', title: '쌓기나무로 여러 가지 모양 만들기', standard: VIEW, types: [] }
    ]
  });

  // ── 문항을 짓는 도구 ─────────────────────────────────────────
  // 조건에 맞는 쌓은 모양을 고른다.
  const grab = (d, o, ok) => d.until(() => pile(d, o), ok);
  const within = (h, lo, hi) => total(h) >= lo && total(h) <= hi;
  // 그림만 주고 「쌓기나무 N개로 쌓은 모양」이라고 알려 주는 모양
  const counted = (d, o, ok) => grab(d, Object.assign({ sizes: SQ, cells: [5, 8], peak: [2, 3], lean: 0.5 }, o || {}), (s) => within(s, (o && o.lo) || 6, (o && o.hi) || 12) && open(s) && (!ok || ok(s)) && fixedByCount(s));
  const given = (h) => `쌓기나무 ${total(h)}개로 쌓은 모양이다.`;
  const reversed = (list) => list.slice().reverse();
  const rowsSaid = (h) => h.map((row, r) => `${ROWS[h.length][r]}은 왼쪽부터 ${row.filter((v) => v > 0).join(', ')}`).join(', ');
  // 주어진 것(위에서 본 모양 foot, 앞에서 본 모양 front, 옆에서 본 모양 side)에 맞는 쌓은 모양 하나. 못 만들면 null.
  function built(d, o) {
    const R = o.foot ? o.foot.length : o.side ? o.side.length : o.rows, Cn = o.foot ? o.foot[0].length : o.front ? o.front.length : o.cols, top = o.top || 3;
    let foot = o.foot;
    if (!foot) { foot = Array.from({ length: R }, () => Array(Cn).fill(0)); footprint(d, R, Cn, d.int(Math.max(R + Cn - 1, o.cells ? o.cells[0] : 0), Math.max(R + Cn - 1, Math.min(R * Cn, o.cells ? o.cells[1] : 9)))).forEach(([r, c]) => { foot[r][c] = 1; }); }
    const cap = (r, c) => Math.min(o.front ? o.front[c] : top, o.side ? o.side[R - 1 - r] : top), on = cellsOf(foot);
    const h = foot.map((row, r) => row.map((v, c) => (v ? d.int(1, cap(r, c)) : 0)));
    if (o.front) for (let c = 0; c < Cn; c += 1) { const can = on.filter((q) => q[1] === c && cap(q[0], c) >= o.front[c]); if (!can.length) return null; h[d.pick(can)[0]][c] = o.front[c]; }
    if (o.side) for (let r = 0; r < R; r += 1) { const want = o.side[R - 1 - r], can = on.filter((q) => q[0] === r && cap(r, q[1]) >= want); if (!can.length) return null; h[r][d.pick(can)[1]] = want; }
    if ((o.front && !same(frontOf(h), o.front)) || (o.side && !same(sideOf(h), o.side))) return null;
    return h;
  }
  // 앞에서 본 모양(front)이나 옆에서 본 모양(side)이 주어진 쌓은 모양 가운데, 세로줄마다 뒤에서 앞으로(가로줄마다 왼쪽에서 오른쪽으로) 낮아지게 쌓은 것 하나.
  // 이렇게 쌓으면 맨 위 쌓기나무의 윗면이 다 보이는 모양이 잘 나온다. 칸이 한 덩어리로 이어지고 줄마다 칸이 있는 것만 돌려준다(아니면 null).
  function stair(d, o) {
    const R = o.front ? o.rows : o.side.length, Cn = o.front ? o.front.length : o.cols, h = Array.from({ length: R }, () => Array(Cn).fill(0));
    if (o.front) for (let c = 0; c < Cn; c += 1) { const a = d.int(0, R - 1), b = d.int(a, R - 1); let v = o.front[c]; for (let r = a; r <= b; r += 1) { h[r][c] = v; v = d.int(1, v); } }
    else for (let r = 0; r < R; r += 1) { const a = d.int(0, Cn - 1), b = d.int(a, Cn - 1); let v = o.side[R - 1 - r]; for (let c = a; c <= b; c += 1) { h[r][c] = v; v = d.int(1, v); } }
    return h.every((row) => row.some(Boolean)) && h[0].every((_, c) => h.some((row) => row[c])) && joined(h) ? h : null;
  }
  // 본 모양(층수 목록) 넷: 맞는 것 하나와 틀린 것 셋. first 에 넣은 것(흔한 잘못)을 먼저 쓰고 모자라면 한 곳만 한 층 다른 것으로 채운다.
  function fourViews(d, right, first, top) {
    const pool = distinct(first.concat(d.shuffle(oneOff(right, top)))).filter((v) => !same(v, right)), list = d.shuffle([right].concat(pool.slice(0, 3)));
    if (list.length < 4) throw new Error('본 모양 보기가 모자란다');
    return list;
  }
  // 칸들이 변끼리 이어져 한 덩어리인가
  function joined(m) {
    const on = cellsOf(m), seen = new Set([on[0].join()]), queue = [on[0]];
    while (queue.length) { const [r, c] = queue.pop(); for (const [dr, dc] of NEAR) { const key = (r + dr) + ',' + (c + dc); if (m[r + dr] && m[r + dr][c + dc] && !seen.has(key)) { seen.add(key); queue.push([r + dr, c + dc]); } } }
    return seen.size === on.length;
  }
  // 위에서 본 모양에서 한 칸을 더하거나 뺀 것들(가로줄·세로줄의 수는 그대로이고 한 덩어리다)
  function nearFoots(foot) {
    const out = [], R = foot.length, Cn = foot[0].length, full = (m) => m.every((row) => row.some(Boolean)) && m[0].every((_, c) => m.some((row) => row[c])) && joined(m);
    for (let r = 0; r < R; r += 1) for (let c = 0; c < Cn; c += 1) {
      const m = foot.map((row) => row.slice());
      if (foot[r][c]) { m[r][c] = 0; if (full(m)) out.push(m); } else if (NEAR.some(([dr, dc]) => foot[r + dr] && foot[r + dr][c + dc])) { m[r][c] = 1; out.push(m); }
    }
    return out;
  }
  const footArt = (m, o) => gridArt(m.map((row) => row.map((v) => (v ? '' : null))), Object.assign({ u: 18, frame: true, front: true, label: '위에서 본 모양(칸 ' + total(m) + '개). 뒷줄부터 줄마다 왼쪽부터 ○는 칸이 있는 자리, ×는 없는 자리: ' + marksOf(m.map((row) => row.map((v) => (v ? '' : null)))) }, o || {}));
  // 위에서 본 모양이 foot 인 쌓은 모양 가운데 그림에서 읽을 수 있는 것 하나
  const raised = (d, foot, ok) => d.until(() => built(d, { foot, top: d.pick([2, 2, 3]) }), (s) => s && total(s) <= 10 && open(s) && (!ok || ok(s)));
  const pair = (h, o) => tiles([stackArt(h, o), topArt(h)], ['쌓은 모양', '위에서 본 모양']);
  const HIDDEN_NONE = '뒤에 숨겨진 쌓기나무는 없다.';
  Object.assign(B.kit.blocks622, { grab, within, counted, given, reversed, rowsSaid, built, fourViews, nearFoots, footArt, raised, pair, HIDDEN_NONE, sceneArt, photoArt, T });

  // ── 여러 방향에서 본 모양 ────────────────────────────────────
  B.addTypes('6-2-2', 'dir', [
    T('dir-who', '사진을 찍은 방향', '①1 ②1 ③1 심2', (d) => {
      const items = scene3(d), names = viewers(d), tag = d.pick(TAGS.slice(0, 4)), list = seenFrom(items, sideBy(names, tag));
      const flags = TAGS.slice(0, 4).map((t) => same(orderOf(items, sideBy(names, t)), list.map(nameOf))), across = names[SIDES[(SIDES.indexOf(sideBy(names, tag)) + 2) % 4]];
      return pickTile('탁자 위에 물건 3개를 놓고 가, 나, 다, 라 방향에서 사진을 찍었다. 다음 사진을 찍은 방향은?', flags, {
        figure: sceneArt(items, { names }) + tiles([photoArt(list)], ['사진']),
        explain: `${tag} 방향에서 보면 왼쪽부터 ${list.map(nameOf).join(', ')}의 차례로 보인다. 맞은편인 ${across} 방향에서는 왼쪽과 오른쪽이 바뀌어 ${orderOf(items, sideBy(names, across)).join(', ')}의 차례로 보인다.`,
        facts: { b622: { kind: 'dirWho', items, names, photo: list.map(nameOf) } }
      });
    }),
    T('dir-photo', '정해 준 방향에서 찍은 사진', '①2 ②2 ③2 심1', (d) => {
      const items = scene3(d), names = viewers(d), order = d.shuffle(SIDES), tag = d.pick(TAGS.slice(0, 4)), want = orderOf(items, sideBy(names, tag));
      return pickTile(`탁자 위에 물건 3개를 놓고 여러 방향에서 사진을 찍었다. ${tag} 방향에서 찍은 사진은?`, order.map((s) => same(orderOf(items, s), want)), {
        labels: MARKS, figure: sceneArt(items, { names }) + tiles(order.map((s) => photoArt(seenFrom(items, s))), MARKS),
        explain: `${tag} 방향에 서서 보면 가장 왼쪽에 ${want[0]}, 가운데에 ${want[1]}, 가장 오른쪽에 ${want[2]}${josa(want[2], '이/가').slice(want[2].length)} 보인다.`,
        facts: { b622: { kind: 'dirPhoto', items, names, tag, photos: order.map((s) => orderOf(items, s)) } }
      });
    }),
    T('dir-cannot', '찍을 수 없는 사진', '①4 ②3·4 ③5 심3', (d) => {
      const items = scene3(d), names = viewers(d), real = SIDES.map((s) => seenFrom(items, s)), orders = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => items[i]));
      const can = (list) => SIDES.some((s) => same(orderOf(items, s), list.map(nameOf))), fake = d.pick(orders.filter((list) => !can(list))), shown = d.shuffle(d.shuffle(real).slice(0, 3).concat([fake]));
      return pickTile('탁자 위에 물건 3개를 놓고 가, 나, 다, 라 방향에서 사진을 찍으려고 한다. 어느 방향에서도 찍을 수 없는 사진은?', shown.map((list) => !can(list)), {
        labels: MARKS, figure: sceneArt(items, { names }) + tiles(shown.map((list) => photoArt(list)), MARKS),
        explain: SIDES.map((s) => `${names[s]} 방향에서는 왼쪽부터 ${orderOf(items, s).join(', ')}`).join(', ') + `의 차례로 보인다. 왼쪽부터 ${fake.map(nameOf).join(', ')}의 차례로 보이는 방향은 없다.`,
        facts: { b622: { kind: 'dirCannot', items, photos: shown.map((list) => list.map(nameOf)) } }
      });
    }),
    T('dir-hidden', '가려서 보이지 않는 방향', '②5', (d, n) => {
      const order = d.shuffle([['빨간 상자', '#f58d82'], ['노란 상자', '#f6c945'], ['파란 상자', '#7db4f5']]), row = d.bool(), k = d.int(0, 2), names = viewers(d), four = TAGS.slice(0, 4);
      const items = order.map(([name, tone], i) => ({ kind: 'box', name, tone, x: row ? i : k, y: row ? k : i })), figure = sceneArt(items, { names });
      if (n === 1) {
        const tag = names[d.pick(row ? ['left', 'right'] : ['front', 'back'])], seen = orderOf(items, sideBy(names, tag)), options = d.shuffle(order.map((o) => o[0])).concat(['세 상자가 모두 보인다.']);
        const flags = options.map((o, i) => (i < 3 ? same(seen, [o]) : seen.length === 3));
        return C(`크기가 같은 상자 3개를 탁자 위에 한 줄로 놓았다. ${tag} 방향에서 사진을 찍을 때 사진에 보이는 것은?`, options, flags.indexOf(true), {
          figure, explain: `${tag} 방향에서 보면 상자 3개가 앞뒤로 한 줄로 놓여 있다. 크기가 같으므로 가장 가까이 있는 ${seen[0]}가 뒤의 두 상자를 가려서 ${seen[0]}만 보인다.`, facts: { truth: flags, want: true, b622: { kind: 'dirSeen', items, names, tag } }
        });
      }
      const flags = four.map((t) => orderOf(items, sideBy(names, t)).length === 3), made = setOptions(d, four, flags), ends = four.filter((_, i) => !flags[i]);
      return C('크기가 같은 상자 3개를 탁자 위에 한 줄로 놓았다. 가, 나, 다, 라 방향 가운데 상자 3개가 모두 보이는 방향을 모두 고른 것은?', made.options, made.answer, {
        figure, explain: `${ends.join(', ')} 방향에서 보면 상자가 앞뒤로 한 줄로 놓여 있어서 가장 가까이 있는 상자가 뒤의 상자를 가린다. 상자가 왼쪽과 오른쪽으로 나란히 보이는 ${four.filter((_, i) => flags[i]).join(', ')} 방향에서는 3개가 모두 보인다.`,
        facts: { sets: { labels: four, flags, options: made.sets }, b622: { kind: 'dirAll', items, names } }
      });
    }, { count: 2 }),
    T('dir-side-word', '보는 자리에서 왼쪽과 오른쪽에 보이는 물건', '①8 심5', (d) => {
      const items = scene3(d), names = viewers(d), tag = d.pick(TAGS.slice(0, 4)), seen = orderOf(items, sideBy(names, tag)), left = d.bool(), want = left ? seen[0] : seen[2], options = d.shuffle(items.map(nameOf));
      return C(`탁자 위에 물건 3개를 놓았다. ${tag} 방향에 서서 볼 때 가장 ${left ? '왼쪽' : '오른쪽'}에 보이는 물건은?`, options, options.indexOf(want), {
        figure: sceneArt(items, { names }), explain: `${tag} 방향에 서서 물건을 바라보면 왼쪽부터 ${seen.join(', ')}의 차례로 보인다. 보는 자리가 바뀌면 왼쪽과 오른쪽도 바뀐다.`, facts: { truth: options.map((o) => o === want), want: true, b622: { kind: 'dirEnd', items, names, tag, left } }
      });
    }),
    T('dir-prism', '각기둥을 위와 앞에서 본 모양', '①5·6 ③4', (d, n) => {
      const k = d.pick([3, 5, 6]), name = { 3: '삼각기둥', 5: '오각기둥', 6: '육각기둥' }[k], poly = { 3: '삼각형', 5: '오각형', 6: '육각형' }, other = d.pick([3, 5, 6].filter((x) => x !== k));
      const want = n === 0 ? poly[k] : '직사각형', options = d.shuffle([poly[k], '직사각형', poly[other], '원']);
      return C(`${name}을 한 밑면이 바닥에 닿게 세워 놓았다. 이 각기둥을 ${n === 0 ? '위' : '앞'}에서 본 모양은?`, options, options.indexOf(want), {
        explain: n === 0 ? `세워 놓은 각기둥을 위에서 보면 밑면의 모양이 보인다. ${name}의 밑면은 ${poly[k]}이다.` : '각기둥의 옆면은 모두 직사각형이다. 세워 놓은 각기둥을 앞에서 보면 옆면이 옆으로 이어져 직사각형 모양으로 보인다.',
        facts: { truth: options.map((o) => o === want), want: true }
      });
    }, { count: 2 })
  ]);

  // ── 쌓은 모양과 쌓기나무의 개수 ──────────────────────────────
  // 숨은 쌓기나무가 있을 수 없는 모양인지 먼저 싸게 걸러 본다: 2층이 넘는 기둥의 왼쪽이나 뒤에 칸이 있는데 왼쪽 뒤 대각선 자리가 비었거나 낮으면 그 자리에 숨을 수 있다.
  // 2층이 넘는 기둥의 왼쪽 뒤 대각선 자리가 테두리 안의 빈칸이고, 그 빈칸이 다른 칸과 변으로 닿아 있는 곳이 있는가(교과서에서 흔히 보는 숨는 자리)
  const hasNook = (h) => cellsOf(h).some(([r, c]) => h[r][c] >= 2 && r >= 1 && c >= 1 && !h[r - 1][c - 1] && (h[r - 1][c] || h[r][c - 1]));
  const maybeAlone = (h) => cellsOf(h).every(([r, c]) => { const v = h[r][c], back = h[r - 1] ? h[r - 1][c] : 0, left = h[r][c - 1] || 0, diag = h[r - 1] ? h[r - 1][c - 1] || 0 : 0; return v < 2 || diag >= v - 1 || (!back && !left); });
  // 위에서 본 모양이 없으면 뒤에 쌓기나무가 숨어 있을 수 있는 모양: 같은 그림이 되는 다른 모양이 있고, 숨는 자리가 그림의 테두리 안에 있다. 돌려주는 것: 숨는 자리 [r, c] 들(없으면 null)
  // (같은 그림이 되는 모양이 limit 가지를 넘거나, 처음 모양의 칸을 바꾸어야 하는 것이 있으면 쓰지 않는다.)
  function hideouts(h, limit, loose) {
    const list = readings(h, { cap: limit + 1, loose }), R = h.length, spots = [];
    if (list.length < 2 || list.length > limit) return null;
    for (const x of list) {
      if (x.same) continue;
      if (!cellsOf(h).every(([r, c]) => x.cols[c + ',' + (R - 1 - r)] === h[r][c])) return null;
      for (const [cx, cy] of x.extra) { const r = R - 1 - cy; if (cx < 0 || r < 0) return null; if (!spots.some((q) => q[0] === r && q[1] === cx)) spots.push([r, cx]); }
    }
    return spots.length ? spots : null;
  }
  // 숨는 자리가 꼭 한 곳 생기게 지은 모양: 기둥 하나만 2층이 넘게 쌓고(tall), 그 기둥의 왼쪽 뒤 대각선 자리는 비워 둔다. 나머지 기둥은 모두 1층이다. 못 지으면 null.
  function nookPile(d, o) {
    const [R, Cn] = d.pick(o.sizes), n = d.int(Math.max(o.cells[0], R + Cn - 1), Math.max(R + Cn - 1, Math.min(o.cells[1], R * Cn - 1))), cells = footprint(d, R, Cn, n), h = Array.from({ length: R }, () => Array(Cn).fill(0));
    cells.forEach(([r, c]) => { h[r][c] = 1; });
    const spots = cells.filter(([r, c]) => r >= 1 && c >= 1 && !h[r - 1][c - 1] && (h[r - 1][c] || h[r][c - 1]));
    if (!spots.length) return null;
    const [r, c] = d.pick(spots); h[r][c] = d.int(o.tall[0], o.tall[1]);
    return h;
  }
  const NOOKS = [[2, 3], [3, 2], [2, 2], [3, 3]];
  Object.assign(B.kit.blocks622, { nookPile, NOOKS });
  B.addTypes('6-2-2', 'count', [
    T('count-plain', '숨은 쌓기나무가 있을 수 없는 모양의 개수', '②7 ③13', (d) => {
      const h = grab(d, { sizes: ANY, cells: [4, 7], peak: [2, 3], lean: 0.85 }, (s) => within(s, 5, 11) && maybeAlone(s) && sight(s).tops === 2 && fixedAlone(s));
      return N('쌓기나무로 쌓은 모양이다. 똑같은 모양으로 쌓는 데 필요한 쌓기나무는 몇 개인가?', total(h), {
        unit: '개', figure: stackArt(h, { u: 24 }), explain: `자리마다 맨 위 쌓기나무의 윗면이 모두 보이고, 높이 쌓은 쌓기나무의 뒤에 다른 쌓기나무가 숨을 수 있는 자리가 없다. ${byLayer(h)}`, facts: { calc: [[plus(h), 0]], b622: { kind: 'totalAlone', h } }
      });
    }),
    T('count-top', '쌓은 모양과 위에서 본 모양으로 개수 구하기', '①24 ②11 ③11 심11', (d) => {
      const h = grab(d, { sizes: MID, cells: [5, 8], peak: [2, 3] }, (s) => within(s, 7, 13) && clear(s) && fixedByTop(s));
      return N('쌓기나무로 쌓은 모양과 위에서 본 모양이다. 똑같은 모양으로 쌓는 데 필요한 쌓기나무는 몇 개인가?', total(h), {
        unit: '개', figure: pair(h), explain: `위에서 본 모양의 칸마다 쌓은 쌓기나무의 수를 세면 ${rowsSaid(h)}이다. 모두 더하면 ${total(h)}개이다.`, facts: { calc: [[plus(h), 0]], b622: { kind: 'totalTop', h } }
      });
    }),
    T('count-above', '위에서 본 모양과 1층에 쌓은 쌓기나무', '①50 ②45', (d) => {
      const h = grab(d, { sizes: MID, cells: [4, 7], peak: [2, 3] }, (s) => within(s, 7, 13)), n = total(h), base = cellsOf(h).length;
      return M(`쌓기나무 ${n}개로 쌓은 모양을 위에서 본 모양이다. 1층에 쌓은 쌓기나무와 2층 이상에 쌓은 쌓기나무는 각각 몇 개인가?`, [{ label: '1층', answer: base, unit: '개' }, { label: '2층 이상', answer: n - base, unit: '개' }], {
        figure: topArt(h), explain: `위에서 본 모양은 1층의 모양과 같다. 칸이 ${base}개이므로 1층에 쌓은 쌓기나무는 ${base}개이고, 2층 이상에 쌓은 쌓기나무는 ${n} − ${base} = ${n - base}(개)이다.`,
        facts: { calc: [[String(base), 0], [`${n}-${base}`, 1]], b622: { kind: 'above', foot: footOf(h), n } }
      });
    }),
    T('count-spare', '똑같이 쌓고 남는 쌓기나무', '①29 ②61 ③57 심52', (d) => {
      const h = grab(d, { sizes: MID, cells: [5, 8], peak: [2, 3] }, (s) => within(s, 7, 13) && clear(s) && fixedByTop(s)), have = total(h) + d.int(2, 7);
      return N(`쌓기나무 ${have}개를 가지고 있다. 다음과 똑같은 모양으로 쌓으면 쌓기나무는 몇 개 남는가?`, have - total(h), {
        unit: '개', figure: pair(h), explain: `위에서 본 모양의 칸마다 쌓은 수를 세어 더하면 쌓은 모양의 쌓기나무는 ${total(h)}개이다. ${have} − ${total(h)} = ${have - total(h)}(개)가 남는다.`,
        facts: { calc: [[`${have}-(${plus(h)})`, 0]], b622: { kind: 'spare', h, have } }
      });
    }),
    T('count-compare', '두 모양의 쌓기나무 수 비교', '①30 ②11 심14', (d) => {
      const one = (lo, hi) => grab(d, { sizes: MID, cells: [4, 7], peak: [2, 3], lean: 0.5 }, (s) => within(s, lo, hi) && open(s) && fixedIfShown(s)), b = one(6, 10), a = one(total(b) + 1, total(b) + 3);
      return N(`쌓기나무로 쌓은 모양 가와 나이다. ${HIDDEN_NONE} 가는 나보다 쌓기나무가 몇 개 더 많은가?`, total(a) - total(b), {
        unit: '개', figure: tiles([stackArt(a, { u: 18 }), stackArt(b, { u: 18 })]), explain: `가는 ${byLayer(a)} 나는 ${byLayer(b)} 가가 ${total(a)} − ${total(b)} = ${total(a) - total(b)}(개) 더 많다.`,
        facts: { calc: [[`(${plus(a)})-(${plus(b)})`, 0]], b622: { kind: 'diff', a, b } }
      });
    }),
    T('count-pick-n', '정해진 개수로 쌓은 모양 고르기', '②15 ③13', (d) => {
      const base = d.int(7, 10), sums = d.shuffle([base - 1, base, base + 1, base + 2]), want = d.pick(sums);
      const list = sums.map((n) => grab(d, { sizes: MID, cells: [4, 7], peak: [2, 3], lean: 0.5 }, (s) => total(s) === n && open(s) && fixedIfShown(s)));
      return pickTile(`쌓기나무 ${want}개로 쌓은 모양은? ${HIDDEN_NONE}`, list.map((h) => total(h) === want), {
        figure: tiles(list.map((h) => stackArt(h, { u: 16 }))), explain: list.map((h, i) => `${TAGS[i]}는 ${total(h)}개`).join(', ') + `로 쌓은 모양이다. 층별로 세거나 자리마다 쌓은 수를 세어 더한다.`,
        facts: { choose: { exprs: list.map(plus), rule: 'equals', target: want }, b622: { kind: 'pickTotal', list, want } }
      });
    }),
    T('count-top-match', '쌓은 모양을 위에서 본 모양 고르기', '①11 ②8 ③7 심10', (d) => {
      const made = d.until(() => {
        const h = counted(d, { sizes: MID, cells: [4, 7] }), foot = footOf(h), R = foot.length, pool = distinct([mirrored(foot), foot.slice().reverse()].concat(d.shuffle(nearFoots(foot)))).filter((m) => !same(m, foot));
        return pool.length >= 3 ? { h, foot, list: d.shuffle([foot].concat(pool.slice(0, 3))) } : null;
      }, Boolean), { h, foot, list } = made;
      return pickTile(`${given(h)} 이 모양을 위에서 본 모양은?`, list.map((m) => same(m, foot)), {
        figure: stackArt(h) + tiles(list.map((m) => footArt(m))), explain: `위에서 본 모양은 1층에 쌓은 쌓기나무의 모양과 같다. 1층에는 ${ROWS[h.length].map((name, r) => `${name}에 ${foot[r].filter(Boolean).length}개`).join(', ')}가 놓여 있다.`,
        facts: { b622: { kind: 'top', h, list } }
      });
    }, { standard: VIEW }),
    T('count-top-rev', '위에서 본 모양에 맞는 쌓은 모양 고르기', '①26 ③7', (d) => {
      const made = d.until(() => {
        const R = d.pick([2, 3]), foot = Array.from({ length: R }, () => [0, 0, 0]); footprint(d, R, 3, d.int(R + 2, R + 3)).forEach(([r, c]) => { foot[r][c] = 1; });
        const pool = distinct([mirrored(foot)].concat(d.shuffle(nearFoots(foot)))).filter((m) => !same(m, foot));
        return pool.length >= 3 ? [foot].concat(pool.slice(0, 3)) : null;
      }, Boolean), foot = made[0], foots = d.shuffle(made), list = foots.map((m) => raised(d, m, fixedIfShown));
      return pickTile(`쌓기나무로 쌓은 모양 가, 나, 다, 라 가운데 위에서 본 모양이 다음과 같은 것은? ${HIDDEN_NONE}`, list.map((h) => same(footOf(h), foot)), {
        figure: tiles([footArt(foot, { u: 20 })], ['위에서 본 모양']) + tiles(list.map((h) => stackArt(h, { u: 16 }))), explain: `위에서 본 모양은 1층의 모양과 같다. 1층에 쌓기나무가 ${ROWS[foot.length].map((name, r) => `${name}에 ${foot[r].filter(Boolean).length}개`).join(', ')} 놓인 모양을 찾는다. 쌓기나무가 놓인 칸의 자리까지 같아야 한다.`,
        facts: { b622: { kind: 'topRev', foot, list } }
      });
    }, { standard: VIEW }),
    T('count-known', '개수를 정확히 알 수 있는 모양', '①27 ②13 ③10 심7', (d) => {
      const sure = grab(d, { sizes: [[2, 3], [3, 2], [2, 2], [3, 3]], cells: [4, 6], peak: [2, 3], lean: 0.85 }, (s) => within(s, 5, 10) && maybeAlone(s) && sight(s).tops === 2 && fixedAlone(s));
      const unsure = () => d.until(() => { const s = nookPile(d, { sizes: NOOKS, cells: [4, 7], tall: [2, 3] }); if (!s || !within(s, 5, 10) || !clear(s)) return null; const spots = hideouts(s, 3); return spots ? { s, spots } : null; }, Boolean);
      const items = d.shuffle([{ s: sure, spots: null }, unsure(), unsure()]), flags = items.map((it) => !it.spots);
      return pickTile('쌓기나무로 쌓은 모양 가, 나, 다이다. 위에서 본 모양이 없어도 쌓기나무의 개수를 정확히 알 수 있는 것은?', flags, {
        figure: tiles(items.map((it) => stackArt(it.s, { u: 18 }))),
        explain: items.map((it, i) => (it.spots ? `${TAGS[i]}는 위에서 볼 때 ${where(it.s, it.spots[0][0], it.spots[0][1])}의 자리에 쌓기나무가 높이 쌓은 쌓기나무에 가려져 있을 수 있다. ` : '')).join('') + `${TAGS[flags.indexOf(true)]}는 뒤에 쌓기나무가 숨을 수 있는 자리가 없어서 ${total(items[flags.indexOf(true)].s)}개로 정해진다.`,
        facts: { b622: { kind: 'known', list: items.map((it) => it.s) } }
      });
    }),
    T('count-possible', '위에서 본 모양이 없을 때 될 수 있는 개수', '②12 ③14', (d) => {
      const made = d.until(() => { const s = nookPile(d, { sizes: NOOKS, cells: [4, 7], tall: [2, 2] }); if (!s || !within(s, 5, 9) || !clear(s)) return null; const spots = hideouts(s, 2, true); return spots && spots.length === 1 ? { s, spot: spots[0] } : null; }, Boolean);
      const n = total(made.s), labels = [n - 1, n, n + 1, n + 2].map((v) => v + '개'), flags = [false, true, true, false], opts = setOptions(d, labels, flags);
      return C('쌓기나무로 쌓은 모양이다. 위에서 본 모양이 주어지지 않았을 때, 똑같은 모양으로 쌓는 데 필요한 쌓기나무의 개수가 될 수 있는 것을 모두 고른 것은?', opts.options, opts.answer, {
        figure: stackArt(made.s, { u: 24 }), explain: `보이는 대로 세면 ${n}개이다. 그런데 위에서 볼 때 ${where(made.s, made.spot[0], made.spot[1])}의 자리에 쌓기나무 1개가 높이 쌓은 쌓기나무에 가려져 있을 수 있으므로 ${n + 1}개일 수도 있다. 위에서 본 모양이 있어야 개수가 하나로 정해진다.`,
        facts: { sets: { labels, flags, options: opts.sets }, b622: { kind: 'possible', h: made.s, n } }
      });
    })
  ]);

  // ── 위, 앞, 옆에서 본 모양 ───────────────────────────────────
  // 앞줄만(오른쪽 줄만) 보고 그린 잘못: 세로줄마다 맨 앞 칸의 높이, 가로줄마다 맨 오른쪽 칸의 높이
  const nearFront = (h) => h[0].map((_, c) => { for (let r = h.length - 1; r >= 0; r -= 1) if (h[r][c]) return h[r][c]; return 0; });
  const nearSide = (h) => h.map((row) => { for (let c = row.length - 1; c >= 0; c -= 1) if (row[c]) return row[c]; return 0; }).reverse();
  const viewOf = (h, dir) => (dir === '앞' ? frontOf(h) : sideOf(h));
  const threeCells = (h) => [topCells(h), viewCells(frontOf(h)), viewCells(sideOf(h))];
  const allDiffer = (list) => list.every((a, i) => list.every((b, j) => i >= j || !same(a, b)));
  const frontWhy = (h) => `앞에서 보면 세로줄마다 가장 높이 쌓은 층이 보이므로 왼쪽부터 ${levels(frontOf(h))}이다.`;
  const sideWhy = (h) => `옆에서 보면 가로줄마다 가장 높이 쌓은 층이 보이고 앞줄이 왼쪽에 보이므로 왼쪽부터 ${levels(sideOf(h))}이다.`;
  const whyOf = (h, dir) => (dir === '앞' ? frontWhy(h) : sideWhy(h));
  Object.assign(B.kit.blocks622, { nearFront, nearSide, viewOf, threeCells, allDiffer, frontWhy, sideWhy, whyOf, maybeAlone, hideouts });
  B.addTypes('6-2-2', 'views', [
    T('views-name', '위, 앞, 옆 가운데 어느 방향에서 본 모양인가', '①10 ②17 ③16 심15', (d, n) => {
      const h = counted(d, { sizes: MID, cells: [4, 7] }, (s) => allDiffer(threeCells(s))), pics = threeCells(h);
      const why = `위에서 본 모양은 1층의 모양과 같다. ${frontWhy(h)} ${sideWhy(h)}`;
      if (n === 1) {
        const order = d.shuffle([0, 1, 2]), right = order.map((i) => DIRS[i]).join(', '), perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => DIRS[i]).join(', '));
        const options = d.shuffle([right].concat(d.shuffle(perms.filter((p) => p !== right)).slice(0, 3)));
        return C(`${given(h)} 가, 나, 다는 이 모양을 위, 앞, 옆에서 본 모양이다. 가, 나, 다를 본 방향을 차례로 쓴 것은?`, options, options.indexOf(right), {
          figure: stackArt(h) + tiles(order.map((i) => cellArt(pics[i]))), explain: `${why} 그러므로 가, 나, 다는 차례로 ${right}에서 본 모양이다.`,
          facts: { truth: options.map((o) => o === right), want: true, b622: { kind: 'names', h, shown: order.map((i) => pics[i]), options } }
        });
      }
      const k = d.int(0, 2), flags = DIRS.map((_, i) => same(pics[i], pics[k]));
      return C(`${given(h)} 이 모양을 위, 앞, 옆 가운데 한 방향에서 보았더니 다음과 같았다. 어느 방향에서 본 모양인가?`, DIRS, k, {
        figure: stackArt(h) + tiles([cellArt(pics[k])], ['본 모양']), explain: `${why} 그림은 ${DIRS[k]}에서 본 모양이다.`, facts: { truth: flags, want: true, b622: { kind: 'name', h, shown: pics[k] } }
      });
    }, { count: 2 }),
    T('views-pick', '쌓은 모양을 앞과 옆에서 본 모양 고르기', '①12 ②18 ③17 심16', (d, n) => {
      const dir = n === 0 ? '앞' : '옆', h = counted(d, {}, (s) => !same(viewOf(s, dir), reversed(viewOf(s, dir)))), right = viewOf(h, dir), other = viewOf(h, n === 0 ? '옆' : '앞');
      const list = fourViews(d, right, [reversed(right), other, n === 0 ? nearFront(h) : nearSide(h)], peak(h));
      return pickTile(`${given(h)} 이 모양을 ${dir}에서 본 모양은?`, list.map((v) => same(v, right)), {
        figure: stackArt(h) + tiles(list.map((v) => viewArt(v, { top: peak(h) }))), explain: whyOf(h, dir), facts: { b622: { kind: 'view', h, dir, list } }
      });
    }, { count: 2 }),
    T('views-levels', '앞과 옆에서 본 모양의 층수', '①13·14 ②19 ③18·19·21', (d, n) => {
      const dir = n === 0 ? '앞' : '옆', h = grab(d, { sizes: SQ, cells: [5, 8], peak: [2, 3] }, (s) => within(s, 7, 13) && clear(s) && fixedByTop(s) && new Set(viewOf(s, dir)).size > 1), list = viewOf(h, dir);
      return M(`쌓기나무로 쌓은 모양과 위에서 본 모양이다. 이 모양을 ${dir}에서 본 모양을 그리려고 한다. 왼쪽 줄부터 차례로 몇 층으로 그려야 하는가?`, list.map((v, i) => ({ label: COLS[3][i] + ' 줄', answer: v, unit: '층' })), {
        figure: pair(h), explain: whyOf(h, dir), facts: { calc: list.map((v, i) => [String(v), i]), b622: { kind: 'levels', h, dir } }
      });
    }, { count: 2 }),
    T('views-cells', '본 모양의 칸 수', '①21 ③22 심20', (d) => {
      const dir = d.pick(['앞', '옆']), h = counted(d, { sizes: MID }), list = viewOf(h, dir);
      return N(`${given(h)} 이 모양을 ${dir}에서 본 모양을 모눈종이에 그리면 모두 몇 칸을 색칠하게 되는가?`, sum(list), {
        unit: '칸', figure: stackArt(h, { u: 22 }), explain: `${whyOf(h, dir)} 색칠하는 칸은 ${list.join(' + ')} = ${sum(list)}(칸)이다.`, facts: { calc: [[list.join('+'), 0]], b622: { kind: 'cells', h, dir } }
      });
    }),
    T('views-wrong', '잘못 그린 본 모양 찾기', '①18 ②20 심19', (d) => {
      const h = counted(d, {}), k = d.int(0, 2), foot = footOf(h), top = peak(h), slips = (list) => distinct(oneOff(list, top).concat([reversed(list)])).filter((v) => !same(v, list));
      const shownFoot = k === 0 ? d.pick(nearFoots(foot)) : foot, front = k === 1 ? d.pick(slips(frontOf(h))) : frontOf(h), side = k === 2 ? d.pick(slips(sideOf(h))) : sideOf(h);
      const flags = [same(shownFoot, foot), same(front, frontOf(h)), same(side, sideOf(h))];
      if (flags.filter((x) => !x).length !== 1) throw new Error('잘못 그린 본 모양이 하나가 아니다');
      return C(`${given(h)} 이 모양을 위, 앞, 옆에서 본 모양을 그렸는데 하나를 잘못 그렸다. 잘못 그린 것은 어느 방향에서 본 모양인가?`, DIRS, k, {
        figure: stackArt(h) + tiles([footArt(shownFoot, { u: 20 }), viewArt(front, { top }), viewArt(side, { top })], DIRS),
        explain: [`위에서 본 모양은 1층의 모양과 같고 ${ROWS[3].map((name, r) => `${name}에 ${foot[r].filter(Boolean).length}칸`).join(', ')}이다.`, frontWhy(h), sideWhy(h)][k] + ` ${DIRS[k]}에서 본 모양을 잘못 그렸다.`,
        facts: { truth: flags, want: false, b622: { kind: 'wrong', h, shown: [shownFoot, front, side] } }
      });
    }),
    T('views-cannot', '위, 앞, 옆에서 볼 수 없는 모양', '①17', (d) => {
      const made = d.until(() => {
        const h = counted(d, { sizes: MID, cells: [4, 7] }, (s) => allDiffer(threeCells(s))), pics = threeCells(h), k = d.int(0, 2);
        const fakes = (k === 0 ? nearFoots(footOf(h)) : distinct(oneOff(viewOf(h, DIRS[k]), peak(h)).concat([reversed(viewOf(h, DIRS[k]))])).map(viewCells)).filter((m) => !pics.some((p) => same(p, m)));
        return fakes.length ? { h, list: d.shuffle(pics.concat([d.pick(fakes)])), pics } : null;
      }, Boolean), { h, list, pics } = made, flags = list.map((m) => !pics.some((p) => same(p, m)));
      return pickTile(`${given(h)} 위, 앞, 옆 어느 방향에서 보아도 볼 수 없는 모양은?`, flags, {
        figure: stackArt(h) + tiles(list.map((m) => cellArt(m))), explain: `위에서 본 모양은 1층의 모양과 같다. ${frontWhy(h)} ${sideWhy(h)} ${TAGS[flags.indexOf(true)]}는 어느 방향에서 본 모양도 아니다.`,
        facts: { b622: { kind: 'cannot', h, list } }
      });
    }),
    T('views-unseen', '색칠한 쌓기나무가 보이지 않는 방향', '②21 ③23', (d) => {
      const made = d.until(() => {
        const h = counted(d, {}), s = sight(h), found = [];
        cellsOf(h).forEach(([r, c]) => { for (let z = 0; z < h[r][c]; z += 1) {
          const seen = [z === h[r][c] - 1, !h.some((row, rr) => rr > r && row[c] > z), !h[r].some((v, cc) => cc > c && v > z)];
          if (seen.filter(Boolean).length === 2 && sum(s.faces(r, c, z)) >= 3) found.push({ r, c, z, seen });
        } });
        return found.length ? Object.assign({ h }, d.pick(found)) : null;
      }, Boolean), { h, r, c, z, seen } = made, k = seen.indexOf(false);
      return C(`${given(h)} 쌓기나무 1개를 색칠했다. 위, 앞, 옆 가운데 색칠한 쌓기나무가 보이지 않는 방향은?`, DIRS, k, {
        figure: stackArt(h, { u: 22, tint: [[r, c, z]], said: `쌓기나무를 쌓은 모양(${where(h, r, c)}의 ${z + 1}층 쌓기나무를 색칠했다)` }),
        explain: ['색칠한 쌓기나무의 위에 다른 쌓기나무가 놓여 있어서 위에서는 보이지 않는다.', '색칠한 쌓기나무의 앞쪽에 같은 층까지 쌓은 쌓기나무가 있어서 앞에서는 가려져 보이지 않는다.', '색칠한 쌓기나무의 오른쪽에 같은 층까지 쌓은 쌓기나무가 있어서 옆에서는 가려져 보이지 않는다.'][k] + ' 나머지 두 방향에서는 보인다.',
        facts: { truth: seen, want: false, b622: { kind: 'unseen', h, cube: [r, c, z] } }
      });
    }),
    T('views-change', '쌓기나무를 빼거나 더 쌓은 뒤의 본 모양', '②23 ③20 심48', (d, n) => {
      // n = 0: 색칠한 쌓기나무 1개를 빼낸다. n = 1: ㉠ 자리에 1개를 더 쌓는다. 본 모양이 달라지는 경우와 그대로인 경우를 섞는다.
      const step = n === 0 ? -1 : 1, made = d.until(() => {
        const h = counted(d, {}), s = sight(h), dir = d.pick(['앞', '옆']), moves = d.next() < 0.65;
        const spots = cellsOf(h).filter(([r, c]) => s.top(r, c) === 2 && (n === 1 ? h[r][c] < 3 : h[r][c] >= 2)).map(([r, c]) => { const g = copy(h); g[r][c] += step; return { r, c, g }; }).filter((x) => !same(viewOf(x.g, dir), viewOf(h, dir)) === moves);
        if (!spots.length) return null;
        const pick = d.pick(spots), right = viewOf(pick.g, dir), before = viewOf(h, dir), line = dir === '앞' ? pick.c : 2 - pick.r, naive = before.map((v, i) => (i === line ? v + step : v));
        const first = [before, naive, reversed(right)].filter((v) => v.every((x) => x >= 1 && x <= 3));
        return { h, dir, pick, right, before, list: fourViews(d, right, first, 3) };
      }, Boolean), { h, dir, pick, right, before, list } = made, changed = !same(right, before);
      const text = n === 0 ? `${given(h)} 색칠한 쌓기나무 1개를 빼낸 뒤의 모양을 ${dir}에서 본 모양은?` : `${given(h)} ㉠ 자리에 쌓기나무 1개를 더 쌓은 뒤의 모양을 ${dir}에서 본 모양은?`;
      const lineName = dir === '앞' ? '세로줄' : '가로줄';
      const why = changed ? `쌓기나무를 ${n === 0 ? '빼내면' : '더 쌓으면'} 그 ${lineName}에서 가장 높이 쌓은 층이 ${n === 0 ? '낮아진다' : '높아진다'}.`
        : `쌓기나무를 ${n === 0 ? '빼내도' : '더 쌓아도'} 같은 ${lineName}에 그만큼 높이 쌓은 쌓기나무가 ${n === 0 ? '남아' : '이미'} 있어서 ${dir}에서 본 모양은 달라지지 않는다.`;
      return pickTile(text, list.map((v) => same(v, right)), {
        figure: stackArt(h, n === 0 ? { tint: [[pick.r, pick.c, h[pick.r][pick.c] - 1]], said: `쌓기나무를 쌓은 모양(${where(h, pick.r, pick.c)}의 맨 위 쌓기나무를 색칠했다)` } : { marks: [[pick.r, pick.c, '㉠']], said: `쌓기나무를 쌓은 모양(${where(h, pick.r, pick.c)}에 ㉠)` }) + tiles(list.map((v) => viewArt(v, { top: 3 }))),
        explain: `${why} ${dir}에서 본 모양은 왼쪽부터 ${levels(right)}이다.`,
        facts: { b622: { kind: 'change', h, g: pick.g, dir, list } }
      });
    }, { count: 2 }),
    T('views-two-same', '두 모양에서 본 모양이 같은 방향', '①19', (d) => {
      const made = d.until(() => {
        const a = grab(d, { sizes: SQ, cells: [5, 7], peak: [2, 3], lean: 0.5 }, (s) => within(s, 7, 12) && open(s) && fixedIfShown(s)), k = d.int(0, 2);
        const b = k === 0 ? built(d, { foot: footOf(a) }) : stair(d, k === 1 ? { front: frontOf(a), rows: 3 } : { side: sideOf(a), cols: 3 });
        if (!b || !open(b) || !fixedIfShown(b) || !within(b, 7, 12)) return null;
        const flags = [same(footOf(a), footOf(b)), same(frontOf(a), frontOf(b)), same(sideOf(a), sideOf(b))];
        return flags.filter(Boolean).length === 1 && flags[k] ? { a, b, k, flags } : null;
      }, Boolean), { a, b, k, flags } = made;
      return C(`쌓기나무로 쌓은 두 모양 가와 나이다. ${HIDDEN_NONE} 위, 앞, 옆 가운데 두 모양을 본 모양이 서로 같은 방향은?`, DIRS, k, {
        figure: tiles([stackArt(a, { u: 18 }), stackArt(b, { u: 18 })]),
        explain: [`두 모양은 1층의 모양이 같으므로 위에서 본 모양이 같다.`, `두 모양을 앞에서 본 모양은 모두 왼쪽부터 ${levels(frontOf(a))}이다.`, `두 모양을 옆에서 본 모양은 모두 왼쪽부터 ${levels(sideOf(a))}이다.`][k] + ' 나머지 두 방향에서 본 모양은 서로 다르다.',
        facts: { truth: flags, want: true, b622: { kind: 'twoSame', a, b } }
      });
    })
  ]);

  // ── 꼴 목록을 다시 대조해 보탠 기본 문항 ─────────────────────
  B.addTypes('6-2-2', 'dir', [
    T('dir-missing', '잃어버린 사진을 찍은 방향', '①1 ②1 심5', (d) => {
      // 사진 석 장을 방향과 맞추고 남는 방향을 찾는다.
      const items = scene3(d), names = viewers(d), four = TAGS.slice(0, 4), lost = d.pick(four), shown = d.shuffle(four.filter((t) => t !== lost)).map((t) => seenFrom(items, sideBy(names, t)));
      const flags = four.map((t) => !shown.some((list) => same(list.map(nameOf), orderOf(items, sideBy(names, t)))));
      return pickTile('탁자 위에 물건 3개를 놓고 가, 나, 다, 라 방향에서 사진을 한 장씩 찍었는데 한 장을 잃어버렸다. 남은 사진이 다음과 같을 때, 잃어버린 사진을 찍은 방향은?', flags, {
        figure: sceneArt(items, { names }) + tiles(shown.map((list) => photoArt(list)), ['사진 1', '사진 2', '사진 3']),
        explain: four.filter((t) => t !== lost).map((t) => `${t} 방향에서는 왼쪽부터 ${orderOf(items, sideBy(names, t)).join(', ')}`).join(', ') + `의 차례로 보이고, 이 사진들은 모두 남아 있다. 남은 사진에 없는 것은 ${lost} 방향에서 찍은 사진(왼쪽부터 ${orderOf(items, sideBy(names, lost)).join(', ')})이다.`,
        facts: { b622: { kind: 'dirMissing', items, names, photos: shown.map((list) => list.map(nameOf)) } }
      });
    }),
    T('dir-scene', '사진에 맞게 물건을 놓은 탁자 찾기', '②4 심4', (d) => {
      // 같은 물건 셋을 놓은 탁자 넷. 앞에서 볼 때의 왼쪽·오른쪽 차례가 사진과 같은 것은 하나뿐이다.
      // 틀린 탁자 하나는 오른쪽에서 볼 때, 하나는 뒤에서 볼 때 사진과 같은 차례가 된다(보는 쪽을 바꾸어 생각하면 고르게 된다).
      const kinds = d.shuffle(['box', 'ball', 'cone', 'can']).slice(0, 3), perms = [[0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1]], put = (order, ys) => order.map((kind, i) => ({ kind, x: i, y: ys[i] }));
      const right = put(kinds, d.pick(perms)), turn = d.pick(perms), fromSide = turn.map((_, x) => kinds[turn.indexOf(x)]).map((kind, x) => ({ kind, x, y: kinds.indexOf(kind) }));
      const fromBack = put(kinds.slice().reverse(), d.pick(perms)), other = put(d.pick([[1, 0, 2], [0, 2, 1]]).map((i) => kinds[i]), d.pick(perms));
      const list = d.shuffle([right, fromSide, fromBack, other]), flags = list.map((items) => same(orderOf(items, 'front'), kinds.map((k) => THINGS[k].name)));
      return pickTile('탁자 위에 물건 3개를 놓고 앞에서 사진을 찍었다. 가, 나, 다, 라 가운데 이 사진을 찍은 탁자는?', flags, {
        figure: tiles([photoArt(kinds.map((kind) => ({ kind })))], ['앞에서 찍은 사진']) + tiles(list.map((items) => sceneArt(items, { u: 19, names: { front: '앞' } }))),
        explain: `사진에는 왼쪽부터 ${kinds.map((k) => THINGS[k].name).join(', ')}의 차례로 보인다. 앞에 서서 볼 때 물건이 이 차례로 보이는 탁자는 ${TAGS[flags.indexOf(true)]}이다. 물건이 앞뒤로 놓인 자리는 달라도 왼쪽과 오른쪽의 차례는 같아야 한다.`,
        facts: { b622: { kind: 'dirScene', scenes: list, photo: kinds.map((k) => THINGS[k].name) } }
      });
    })
  ]);
  B.addTypes('6-2-2', 'count', [
    T('count-top-possible', '위에서 본 모양이 될 수 있는 것', '②10 ③8 심9', (d) => {
      // 그림만으로는 쌓기나무 1개가 숨어 있을 수 있는 자리가 꼭 한 곳 있다. 위에서 본 모양은 보이는 대로인 것과 그 자리에 칸이 더 있는 것, 두 가지가 될 수 있다.
      const made = d.until(() => {
        const s = nookPile(d, { sizes: NOOKS, cells: [4, 7], tall: [2, 2] }); if (!s || !within(s, 5, 9) || !clear(s)) return null;
        const spots = hideouts(s, 2, true); if (!spots || spots.length !== 1) return null;
        const seen = footOf(s), more = seen.map((row) => row.slice()); more[spots[0][0]][spots[0][1]] = 1;
        const wrong = d.shuffle(nearFoots(seen).filter((m) => !same(m, more))).slice(0, 2);
        return wrong.length === 2 ? { s, spot: spots[0], seen, more, list: d.shuffle([seen, more].concat(wrong)) } : null;
      }, Boolean), { s, spot, seen, more, list } = made, labels = TAGS.slice(0, 4), flags = list.map((m) => same(m, seen) || same(m, more)), opts = setOptions(d, labels, flags);
      return C('쌓기나무로 쌓은 모양이다. 가, 나, 다, 라 가운데 이 모양을 위에서 본 모양이 될 수 있는 것을 모두 고른 것은?', opts.options, opts.answer, {
        figure: stackArt(s, { u: 22 }) + tiles(list.map((m) => footArt(m))),
        explain: `보이는 쌓기나무만으로 그린 것이 ${labels[list.findIndex((m) => same(m, seen))]}이다. 그런데 위에서 볼 때 ${where(s, spot[0], spot[1])}의 자리에 쌓기나무 1개가 높이 쌓은 쌓기나무에 가려져 있을 수 있으므로 ${labels[list.findIndex((m) => same(m, more))]}도 될 수 있다. 나머지는 그 자리에 쌓기나무가 있다면 그림에 보여야 하거나, 보이는 쌓기나무의 자리에 칸이 없다.`,
        facts: { sets: { labels, flags, options: opts.sets }, b622: { kind: 'topPossible', h: s, list } }
      });
    }, { standard: VIEW })
  ]);
  // 조건에 맞는 것을 tries 번까지 만들어 본다(못 만들면 null — 멈추지 않고 다른 것으로 바꾸어 짓는다).
  const attempt = (d, tries, make, ok) => { for (let i = 0; i < tries; i += 1) { const v = make(); if (v && ok(v)) return v; } return null; };
  // 그림만 주는 쌓은 모양(맨 위 쌓기나무의 윗면이 다 보이고 「뒤에 숨겨진 쌓기나무는 없다」로 하나로 읽힌다)
  const shownPile = (s) => total(s) <= 11 && open(s) && fixedIfShown(s);
  B.addTypes('6-2-2', 'views', [
    T('views-same-front', '앞에서 본 모양이 다른 것 찾기', '①16 ③17 심17', (d) => {
      // 셋은 앞에서 본 모양이 같고(쌓은 모양은 서로 다르다) 하나만 한 줄이 한 층 다르다.
      const list = d.until(() => {
        const a = grab(d, { sizes: [[2, 3], [3, 3]], cells: [4, 6], peak: [2, 3], lean: 0.6 }, (s) => shownPile(s) && new Set(frontOf(s)).size > 1), F = frontOf(a), like = (front) => () => stair(d, { front, rows: d.pick([2, 3]) });
        const b = attempt(d, 300, like(F), (s) => shownPile(s) && !same(s, a)), c = b && attempt(d, 300, like(F), (s) => shownPile(s) && !same(s, a) && !same(s, b));
        let odd = null; for (const v of d.shuffle(oneOff(F, 3))) if (!odd) odd = attempt(d, 150, like(v), shownPile);
        return c && odd ? d.shuffle([a, b, c, odd]) : null;
      }, Boolean);
      const flags = list.map((h) => list.filter((g) => same(frontOf(g), frontOf(h))).length === 1), at = flags.indexOf(true), F = frontOf(list[(at + 1) % 4]);
      return pickTile(`쌓기나무로 쌓은 모양 가, 나, 다, 라 가운데 앞에서 본 모양이 나머지 셋과 다른 것은? ${HIDDEN_NONE}`, flags, {
        figure: tiles(list.map((h) => stackArt(h, { u: 16 }))), explain: `앞에서 보면 세로줄마다 가장 높이 쌓은 층이 보인다. ${TAGS[at]}를 앞에서 본 모양은 왼쪽부터 ${levels(frontOf(list[at]))}이고, 나머지 셋은 모두 왼쪽부터 ${levels(F)}이다.`,
        facts: { b622: { kind: 'oddFront', list } }
      });
    }),
    T('views-rev', '본 모양에 맞는 쌓은 모양 고르기', '①15 심16', (d) => {
      // 틀린 모양: 본 모양이 좌우로 뒤집힌 것, 다른 방향(앞↔옆)에서 본 모양이 그 그림인 것, 한 줄만 한 층 다른 것. 만들 수 없는 것은 본 모양이 다른 모양으로 채운다.
      const dir = d.pick(['앞', '옆']), made = d.until(() => {
        const a = grab(d, { sizes: [[2, 3], [3, 2], [3, 3]], cells: [4, 6], peak: [2, 3], lean: 0.6 }, (s) => shownPile(s) && viewOf(s, dir).length === 3 && !same(viewOf(s, dir), reversed(viewOf(s, dir)))), F = viewOf(a, dir);
        const like = (v) => () => stair(d, dir === '앞' ? { front: v, rows: d.pick([2, 3]) } : { side: v, cols: d.pick([2, 3]) }), other = () => stair(d, dir === '앞' ? { side: F, cols: 3 } : { front: F, rows: 3 });
        const wrong = [attempt(d, 200, like(reversed(F)), shownPile), attempt(d, 200, other, (s) => shownPile(s) && !same(viewOf(s, dir), F))].concat(d.shuffle(oneOff(F, 3)).map((v) => attempt(d, 100, like(v), shownPile))).filter(Boolean);
        const pool = distinct(wrong).filter((s) => !same(viewOf(s, dir), F));
        return pool.length >= 3 ? { F, list: d.shuffle([a].concat(pool.slice(0, 3))) } : null;
      }, Boolean), { F, list } = made, flags = list.map((s) => same(viewOf(s, dir), F));
      return pickTile(`쌓기나무로 쌓은 모양 가, 나, 다, 라 가운데 ${dir}에서 본 모양이 다음과 같은 것은? ${HIDDEN_NONE}`, flags, {
        figure: tiles([viewArt(F, { top: 3, said: `${dir}에서 본 모양` })], [`${dir}에서 본 모양`]) + tiles(list.map((s) => stackArt(s, { u: 16 }))),
        explain: `${dir === '앞' ? '앞에서 보면 세로줄마다 가장 높이 쌓은 층이 보인다.' : '옆에서 보면 가로줄마다 가장 높이 쌓은 층이 보이고 앞줄이 왼쪽에 보인다.'} ` + list.map((s, i) => `${TAGS[i]}는 왼쪽부터 ${levels(viewOf(s, dir))}`).join(', ') + `이므로 ${TAGS[flags.indexOf(true)]}가 맞다.`,
        facts: { b622: { kind: 'viewRev', list, dir, want: F } }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
