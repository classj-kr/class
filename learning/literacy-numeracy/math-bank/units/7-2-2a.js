// 중학교 1학년 2학기 2단원 작도와 합동 — 단원 틀·그림 도구와 앞쪽 묶음(작도의 뜻과 선분·각·평행선의 작도, 대변과 대각·세 변의 길이 사이의 관계, 삼각형의 작도).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1·2: 68·54꼴, 심화꼴 53꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-2-2/싣기_대조표.md 에 있다.
// (삼각형이 하나로 정해지는 조건, 합동, 합동 조건, 그림에서 합동인 삼각형 찾기는 7-2-2b.js 에, 실력 문항은 7-2-2c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-03(삼각형을 작도하고 그 과정을 설명), 9수03-04(삼각형의 합동 조건을 이해하고 두 삼각형이 합동인지 판별)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(문장·작도 그림·수치가 적힌 삼각형·표시만 한 삼각형·겹친 도형), 묻는 것(차례·빈칸·같은 선분·조건 이름·기호로 쓴 식·길이·각도)이 다르면 따로 싣는다.
//  - 직접 작도하는 꼴은 차례 고르기·빈칸 고르기로 바꾸어 실었다. 작도 차례는 차례가 하나로 정해지게 물었다:
//    두 큰 호(점 O의 호와 점 P의 호)나 「직선 긋기와 길이 재기」처럼 앞뒤가 바뀌어도 되는 단계는 앞 단계를 문제에 주거나, 바뀐 차례를 보기에 넣지 않았다.
//  - 그림은 모두 수치대로 그린다. 변의 길이와 각의 크기에서 꼭짓점의 자리를 셈하고, 합동인 두 삼각형은 한 삼각형을 돌리거나 뒤집어 그린다(대응은 코드가 쥐고 있다).
//    그림에 적는 길이·각도는 셈한 값이 자연수인 것뿐이다. 그림 설명(aria-label)에는 그림에 적힌 이름·길이·각도·같다는 표시를 모두 말로 적는다.
//  - 답: 길이(cm, m)·각도(°)·개수는 수로 받고, 작도 차례·합동 조건의 이름·대응하는 꼭짓점·기호로 쓴 식·더 필요한 조건은 고르기로 받는다. 부호 단추는 달지 않는다.
//  - 교육과정: 「증명」「가정」「결론」은 쓰지 않는다(중2). 합동임을 밝히는 글은 「설명」이라 하고 빈칸·고르기로 묻는다.
//    삼각형의 세 각의 크기의 합 180°(초등), 평행선의 동위각·엇각과 맞꼭지각(앞 단원)은 쓴다. 삼각형의 외각의 성질(다음 대단원), 이등변삼각형의 성질·직각삼각형의 합동 조건(중2)은 쓰지 않는다.
//  - 2022 자료를 따라 「한 변의 길이와 양 끝이 아닌 두 각의 크기」(∠A, AB, ∠C)는 나머지 각을 구할 수 있으므로 삼각형이 하나로 정해지는 것으로 친다.
//    「두 변과 그 끼인각이 아닌 각」의 보기는 삼각형이 실제로 두 가지 그려지는 수치(주어진 각의 대변이 더 짧고, 그래도 닿는 길이)로만 짓는다.
//  - 초등 5학년 「합동과 대칭」에서 한 일(대응변의 길이·대응각의 크기 읽기)은 기호 ≡와 대응 차례를 쓰는 꼴 두 유형만 두고, 무게는 작도와 합동 조건에 두었다.
//  - 꼴 목록에 적힌 원문의 어긋남은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-2-2b.js, 7-2-2c.js 의 것까지 여기에 모아 적는다)
//  - 중2 내용: 이등변삼각형의 성질을 써야 풀리는 것(①63의 각 구하기 ②49 심40·50·52), 일차부등식을 풀어 범위를 구하는 것(①20).
//  - 옛 교육과정: 각의 이등분선·수선·수직이등분선의 작도. 이름만 나오는 오답 보기(①26의 ②⑤)도 쓰지 않았다.
//  - 직접 작도·활동이어서 고르기로 바꿀 수 없는 것(②10·12·24 심7·15·16)과 ②6의 북두칠성(그림 모름).
//  - 쪽 그림에서도 그림을 알 수 없는 것: 심28(각을 셈해야 하는 겹친 두 삼각형 — 원문 풀이도 어긋남), 심36(한 점에서 같은 각만큼 벌어진 두 삼각형),
//    심53(정사각형 안에서 수직으로 만나는 두 선분 — 서술형이기도 하다), ①64의 변형(한 변 5 cm, 7 cm인 두 정삼각형의 놓임).
//  - 초등 5학년과 같은 일: 합동인 두 사각형의 대응변·대응각 읽기와 네 각의 합(①40 ②32 — 5-2-3의 match-both·match-angle-sum).
//  - 뜻 없는 셈: x + y, a + b + c(①39의 변형 ②30의 변형)는 길이와 각도를 따로 묻는 것으로 바꾸었다.
//  - 이미 실은 유형과 같은 일: ②53(hard-square-cross#2 와 같은 그림·같은 답).
// 처음에는 뺐다가 다시 실은 것(「수학 실력에 필요한 문제는 다 넣는다」 — 7-2-2c.js 끝의 「다시 실은 꼴」)
//  - 합동을 두 번 넘게 쓰거나 보조선을 긋는 것(①55 심30·39·42·51), 따로 구할 수 없는 두 각의 합(심48), 경우가 많은 조합 세기(심11),
//    정삼각형으로 60°를 만드는 작도(심8 — 직접 작도 대신 각의 크기를 묻는다), 접은 직사각형(심37 — 그림에는 접혀 나온 삼각형의 세 변의 길이를 적는다).
//  - 직각이 둘인 두 삼각형(①67 ②50·54 심37): 나머지 한 각을 구하여 ASA 합동으로 설명한다. 직각삼각형의 합동 조건(중2)의 이름은 쓰지 않는다.
//  - 정사각형의 대각선(①68 심49): 대각선이 만드는 같은 각은 합동을 한 번 더 써서 댄다(△OBC ≡ △OCD, △ABD ≡ △CBD). 이등변삼각형의 성질은 쓰지 않는다.
// 바꾸어 실은 것 가운데 받는 쪽이 한 번 더 볼 것
//  - ①65·심46(정사각형의 두 선분이 이루는 각 90°)과 ①66·심43(정삼각형의 두 선분이 이루는 각)은 뺀 ②53과 같은 그림이다. 원문은 문자로 놓은 두 각의 합으로 푸는데,
//    여기서는 한 각의 크기를 주고 「합동 한 번 → 대응각 → 한 삼각형의 세 각의 합」으로 끝나게 바꾸었다(맞꼭지각으로 옮기는 단계가 없다). 실력 hard-square-cross#2, hard-equi-cross.
//  - 두 쌍의 변이 평행한 사각형(①51 — find-parallel)은 평행사변형의 「마주 보는 변의 길이가 같다」(초등)를 쓰면 SSS 로도 설명되므로, 문제 글에 「평행선에서 엇각의 크기가 같음을 이용하여」를 넣었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { N, M, C, lines } = B.kit;
  const { V, tagged, claimQ, SG } = B.kit.mid;
  const UNIT = '7-2-2', STD3 = '9수03-03', STD4 = '9수03-04';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SYM = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'], BLK = ['㈎', '㈏', '㈐'];

  // ── 글 ──
  // 선분 AB(윗줄), 각, 삼각형, 길이
  const sg = SG;   // 선분 AB: 글자 위에 줄을 얹는다(공용 도구)
  const cm = (v) => v + ' cm';
  const seq = (list) => list.join(' → ');
  // 알파벳·기호로 끝나는 말 뒤의 토씨. L·M·N 은 받침이 있고(엘·엠·엔), ㉠~㉥ 은 기역·니은…으로 읽어 받침이 있다. ㈎·㈏·㈐ 는 받침이 없다.
  function jo(word, pair) {
    const last = String(word).replace(/<[^>]+>/g, '').slice(-1), [a, b] = pair.split('/'), bat = /[LMNlmn㉠-㉭]/.test(last);
    if (a === '으로') return word + (bat && !/[Ll㉣]/.test(last) ? '으로' : '로');
    return word + (bat ? a : b);
  }
  // 고르기: 맞는 보기 하나와 틀린 보기들을 섞는다.
  function pickOne(d, text, right, wrongs, o) {
    const opt = o || {}, rows = d.shuffle([[right, true]].concat(wrongs.map((w) => [w, false]))), at = rows.findIndex((r) => r[1]);
    return C(text, rows.map((r) => r[0]), at, { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => r[1]), want: true }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 「모두 고른 것」: flags 가 참인 줄의 기호가 정답이다. 틀린 보기는 정답과 한 줄, 두 줄 다른 묶음에서 고른다.
  const bits = (m) => { let n = 0; for (let x = m; x; x >>= 1) n += x & 1; return n; };
  function allQ(d, text, tags, flags, o) {
    const n = flags.length, key = (m) => tags.filter((_, i) => m & (1 << i)).join(', '), right = flags.reduce((m, f, i) => m | (f ? 1 << i : 0), 0), pool = [];
    for (let m = 1; m < (1 << n); m += 1) if (m !== right) pool.push(m);
    const wrong = d.shuffle(pool.filter((m) => bits(m ^ right) === 1)).concat(d.shuffle(pool.filter((m) => bits(m ^ right) === 2))).slice(0, 3);
    return pickOne(d, text, key(right), wrong.map(key), o);
  }
  const withFigure = (item, figure) => Object.assign(item, { figure });

  // ── 좌표 셈(수학 좌표: 오른쪽이 x, 위쪽이 y. 각은 오른쪽이 0°이고 시계 반대쪽으로 커진다) ──
  const RAD = Math.PI / 180, f1 = (v) => Math.round(v * 10) / 10;
  const add = (p, q) => [p[0] + q[0], p[1] + q[1]], sub = (p, q) => [p[0] - q[0], p[1] - q[1]], mul = (p, k) => [p[0] * k, p[1] * k];
  const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const polar = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] + r * Math.sin(deg * RAD)];
  const dirDeg = (p, q) => (Math.atan2(q[1] - p[1], q[0] - p[0]) / RAD + 360) % 360;
  const turn = (p, deg, c) => { const o = c || [0, 0], x = p[0] - o[0], y = p[1] - o[1], s = Math.sin(deg * RAD), k = Math.cos(deg * RAD); return [o[0] + x * k - y * s, o[1] + x * s + y * k]; };
  const mean = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const boxOf = (pts) => [Math.min(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[1]))];
  // 두 직선 p + t·u, q + s·v 가 만나는 점
  const meet = (p, u, q, v) => { const den = u[0] * v[1] - u[1] * v[0], t = ((q[0] - p[0]) * v[1] - (q[1] - p[1]) * v[0]) / den; return [p[0] + u[0] * t, p[1] + u[1] * t]; };
  const whole = (v) => Math.abs(v - Math.round(v)) < 1e-6;

  // ── 삼각형 짓기: 꼭짓점 [A, B, C]. 변 i 는 꼭짓점 i 의 대변이다(변 0 = BC, 변 1 = CA, 변 2 = AB) ──
  const triSAS = (b, c, A) => [[0, 0], [c, 0], polar([0, 0], b, A)];                                             // AC = b, AB = c, ∠A
  const triASA = (c, A, Bd) => [[0, 0], [c, 0], polar([0, 0], c * Math.sin(Bd * RAD) / Math.sin((A + Bd) * RAD), A)];   // AB = c, ∠A, ∠B
  const triSSS = (a, b, c) => { const x = (b * b + c * c - a * a) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(b * b - x * x)]]; };   // BC = a, CA = b, AB = c
  const sideOf = (t, i) => dist(t[(i + 1) % 3], t[(i + 2) % 3]);
  const angleOf = (t, i) => { const g = Math.abs(dirDeg(t[i], t[(i + 1) % 3]) - dirDeg(t[i], t[(i + 2) % 3])); return g > 180 ? 360 - g : g; };
  // 변 i 가 가로로 놓이고 꼭짓점 i 가 위에 오게 돌린다. down 이면 꼭짓점 i 가 아래로, mirror 이면 먼저 뒤집는다(거울에 비친 모양).
  function laid(t, i, down, mirror) {
    let q = mirror ? t.map((p) => [-p[0], p[1]]) : t;
    const deg = -dirDeg(q[(i + 1) % 3], q[(i + 2) % 3]);
    q = q.map((p) => turn(p, deg));
    if ((q[i][1] < q[(i + 1) % 3][1]) !== Boolean(down)) q = q.map((p) => turn(p, 180));
    return q;
  }
  // 왼쪽 아래 구석을 at 에 맞춘다.
  const putAt = (pts, at) => { const b = boxOf(pts); return pts.map((p) => [p[0] - b[0] + at[0], p[1] - b[1] + at[1]]); };
  const scaled = (pts, k) => pts.map((p) => mul(p, k));
  // 높이가 너비보다 크지 않은 놓임 가운데 하나를 고른다(휴대폰 화면에서 그림이 길어지지 않게).
  function anyLaid(d, t) {
    const all = [];
    for (let i = 0; i < 3; i += 1) for (const down of [false, true]) for (const mirror of [false, true]) { const q = laid(t, i, down, mirror), b = boxOf(q); if (b[3] - b[1] <= (b[2] - b[0]) * 0.92) all.push({ q, i, down, mirror }); }
    return d.pick(all.length ? all : [{ q: laid(t, 0, false, false), i: 0, down: false, mirror: false }]);
  }

  // ── 그림 판 ──
  // 선·호·점은 수학 좌표로, 표시(같은 길이 표시, 각 표시)와 글은 화소 크기로 그린다. 글은 선·호·다른 글과 겹치지 않는 자리를 찾아 놓는다.
  const INK = '#1f2933', PEN = '#4b5a67', BLUE = '#1d4ed8';
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const widthOf = (text, size) => { let w = 0; for (const ch of String(text)) w += /[가-힣㉠-㉿㈀-㈞]/.test(ch) ? 13 : ch === ' ' ? 3.6 : ch === '°' ? 5.2 : /[A-Z]/.test(ch) ? 9.2 : /[0-9]/.test(ch) ? 7.4 : 7; return w * (size || 13) / 13; };
  function Pic() { this.items = []; this.marks = []; this.labels = []; }
  // kind: ''(굵은 선), 'thin'(가는 선), 'dash'(점선)
  Pic.prototype.seg = function (p, q, kind) { this.items.push({ t: 'seg', p, q, kind: kind || '' }); return this; };
  // 컴퍼스로 그린 호: 중심 c, 반지름 r, a0°~a1°(시계 반대쪽으로)
  Pic.prototype.arc = function (c, r, a0, a1) { this.items.push({ t: 'arc', c, r, a0, a1 }); return this; };
  // 점 p 를 지나는 짧은 호(중심 c). half: 호의 반 길이(좌표 단위)
  Pic.prototype.nick = function (c, p, half) { const r = dist(c, p), a = dirDeg(c, p), w = Math.min(28, (half || 0.42) / r / RAD); return this.arc(c, r, a - w, a + w); };
  Pic.prototype.dot = function (p) { this.items.push({ t: 'dot', p }); return this; };
  Pic.prototype.fill = function (pts, css) { this.items.push({ t: 'fill', pts, css: css || 'fill:rgba(37,99,235,0.10)' }); return this; };
  // 같은 길이 표시: 선분 p–q 의 가운데에 짧은 금 n 개
  Pic.prototype.tick = function (p, q, n, at) { this.marks.push({ t: 'tick', p, q, n, at: at == null ? 0.5 : at }); return this; };
  // 각 표시: 꼭짓점 v 에서 p 쪽과 q 쪽으로 벌어진 각. o.text(각 안에 적는 글), o.mark: 'arc'(호) · 'arc2'(겹호) · 'dot'(점) · 'right'(직각 표시) · 'none'
  Pic.prototype.angle = function (v, p, q, o) { this.marks.push(Object.assign({ t: 'angle', v, p, q, mark: 'arc' }, o || {})); return this; };
  // 점의 이름. dir: [dx, dy](수학 좌표의 방향)를 주면 그쪽에, 없으면 선이 없는 가장 넓은 쪽에 적는다.
  Pic.prototype.name = function (p, text, dir, o) { this.labels.push(Object.assign({ k: 'name', p, text, dir }, o || {})); return this; };
  // 선분 옆의 글(길이). o.away: 이 점의 반대쪽에 적는다. o.italic: 문자(a, b, c), o.letter: 「a cm」처럼 첫 글자만 문자
  Pic.prototype.side = function (p, q, text, o) { this.labels.push(Object.assign({ k: 'side', p, q, text }, o || {})); return this; };
  // 가운데에 다른 점이 있는 선분의 길이: 두 끝을 잇는 점선 활을 그리고 그 가운데에 글을 적는다(어디서 어디까지의 길이인지 보이게). away: 이 점의 반대쪽으로 활을 그린다.
  Pic.prototype.span = function (p, q, text, away) { this.marks.push({ t: 'span', p, q, text, away }); return this; };
  // 그 밖의 글(작도 단계의 기호 따위). dir 쪽으로 gap(px)만큼 띄운다.
  Pic.prototype.note = function (p, text, dir, o) { this.labels.push(Object.assign({ k: 'note', p, text, dir: dir || [0, 1] }, o || {})); return this; };

  // 점 p 둘레에서 선이 없는 가장 넓은 쪽(도). 넓이가 같으면 아래쪽을 고른다.
  function freeSide(p, items) {
    const dirs = [];
    for (const it of items) {
      if (it.t !== 'seg') continue;
      const dp = dist(it.p, p), dq = dist(it.q, p), L = dist(it.p, it.q);
      if (dp < 1e-6) dirs.push(dirDeg(p, it.q));
      else if (dq < 1e-6) dirs.push(dirDeg(p, it.p));
      else if (Math.abs(dp + dq - L) < 1e-6) dirs.push(dirDeg(p, it.p), dirDeg(p, it.q));
    }
    if (!dirs.length) return 90;
    dirs.sort((x, y) => x - y);
    let best = null;
    dirs.forEach((a, i) => {
      const b = i + 1 < dirs.length ? dirs[i + 1] : dirs[0] + 360, gap = b - a, mid = (a + gap / 2) % 360;
      if (!best || gap > best.gap + 1 || (Math.abs(gap - best.gap) <= 1 && Math.sin(mid * RAD) < Math.sin(best.mid * RAD))) best = { gap, mid };
    });
    return best.mid;
  }
  Pic.prototype.layout = function (k) {
    const pts = [];
    for (const it of this.items) {
      if (it.t === 'seg') pts.push(it.p, it.q);
      else if (it.t === 'dot') pts.push(it.p);
      else if (it.t === 'fill') pts.push(...it.pts);
      else { const n = Math.max(2, Math.ceil((it.a1 - it.a0) / 6)); for (let i = 0; i <= n; i += 1) pts.push(polar(it.c, it.r, it.a0 + (it.a1 - it.a0) * i / n)); }
    }
    const bx = boxOf(pts), px = (p) => [(p[0] - bx[0]) * k, (bx[3] - p[1]) * k];
    const ink = [], out = { fill: '', line: '', mark: '', dot: '', text: '' }, box = [0, 0, (bx[2] - bx[0]) * k, (bx[3] - bx[1]) * k];
    const grow = (x, y) => { box[0] = Math.min(box[0], x); box[1] = Math.min(box[1], y); box[2] = Math.max(box[2], x); box[3] = Math.max(box[3], y); };
    const trace = (a, b) => { const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 2.5)); for (let i = 0; i <= n; i += 1) ink.push([a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]); };
    for (const it of this.items) {
      if (it.t === 'fill') out.fill += `<polygon points="${it.pts.map((p) => px(p).map(f1).join(',')).join(' ')}" style="${it.css};stroke:none"/>`;
      else if (it.t === 'seg') {
        const a = px(it.p), b = px(it.q); trace(a, b);
        out.line += `<line class="mb-line${it.kind === 'thin' ? ' is-thin' : it.kind === 'dash' ? ' is-cut' : ''}" x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}"/>`;
      } else if (it.t === 'arc') {
        const a = px(polar(it.c, it.r, it.a0)), b = px(polar(it.c, it.r, it.a1)), n = Math.max(2, Math.ceil((it.a1 - it.a0) * RAD * it.r * k / 2.5));
        for (let i = 0; i <= n; i += 1) ink.push(px(polar(it.c, it.r, it.a0 + (it.a1 - it.a0) * i / n)));
        out.line += `<path d="M${f1(a[0])} ${f1(a[1])}A${f1(it.r * k)} ${f1(it.r * k)} 0 ${it.a1 - it.a0 > 180 ? 1 : 0} 0 ${f1(b[0])} ${f1(b[1])}" style="fill:none;stroke:${PEN};stroke-width:1.1"/>`;
      } else { const a = px(it.p); ink.push(a, [a[0] + 3, a[1]], [a[0] - 3, a[1]], [a[0], a[1] + 3], [a[0], a[1] - 3]); out.dot += `<circle class="mb-dot" cx="${f1(a[0])}" cy="${f1(a[1])}" r="2.6"/>`; }
    }
    const placed = [];
    const hits = (b) => ink.reduce((n, p) => n + (Math.abs(p[0] - b.x) < b.hw && Math.abs(p[1] - b.y) < b.hh ? 1 : 0), 0) + placed.reduce((n, c) => n + (Math.abs(c.x - b.x) < c.hw + b.hw + 1 && Math.abs(c.y - b.y) < c.hh + b.hh - 1 ? 40 : 0), 0);
    const put = (lb, spots, size) => {
      const hw = widthOf(lb.text, size) / 2 + 1.5, hh = size * 0.5 + 1.5;
      let best = null;
      for (const [x, y] of spots) { const b = { x, y, hw, hh }, n = hits(b); if (!best || n < best.n) best = { b, n }; if (n === 0) break; }
      const b = best.b; placed.push(b); grow(b.x - hw, b.y - hh); grow(b.x + hw, b.y + hh);
      const style = (lb.italic ? ITALIC + ';font-size:' + (size + 1.5) + 'px;' : lb.blue ? 'fill:' + BLUE + ';font-weight:700;' : '') + HALO;
      const shown = lb.letter ? `<tspan style="${ITALIC};font-size:${size + 2}px">${lb.text[0]}</tspan>${lb.text.slice(1)}` : lb.text;
      out.text += `<text class="${lb.k === 'side' || lb.k === 'angle' ? 'mb-label is-length' : 'mb-label'}" style="${style}" x="${f1(b.x)}" y="${f1(b.y)}" text-anchor="middle" dominant-baseline="central">${shown}</text>`;
    };
    // 표시
    for (const m of this.marks) {
      if (m.t === 'tick') {
        const a = px(m.p), b = px(m.q), L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], w = [-u[1], u[0]], c = [a[0] + (b[0] - a[0]) * m.at, a[1] + (b[1] - a[1]) * m.at];
        for (let i = 0; i < m.n; i += 1) {
          const s = (i - (m.n - 1) / 2) * 3.6, x = c[0] + u[0] * s, y = c[1] + u[1] * s;
          out.mark += `<line x1="${f1(x - w[0] * 4.6)}" y1="${f1(y - w[1] * 4.6)}" x2="${f1(x + w[0] * 4.6)}" y2="${f1(y + w[1] * 4.6)}" style="stroke:${INK};stroke-width:1.2"/>`;
          trace([x - w[0] * 5, y - w[1] * 5], [x + w[0] * 5, y + w[1] * 5]);
        }
        continue;
      }
      if (m.t === 'span') {
        const a = px(m.p), b = px(m.q), L = Math.hypot(b[0] - a[0], b[1] - a[1]), c = px(m.away), mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        let w = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L];
        if ((c[0] - mid[0]) * w[0] + (c[1] - mid[1]) * w[1] > 0) w = [-w[0], -w[1]];
        const bow = 15, ctrl = [mid[0] + w[0] * bow * 2, mid[1] + w[1] * bow * 2], size = 12, hw = widthOf(m.text, size) / 2 + 3, tip = [mid[0] + w[0] * bow, mid[1] + w[1] * bow];
        out.mark += `<path d="M${f1(a[0] + w[0] * 3)} ${f1(a[1] + w[1] * 3)}Q${f1(ctrl[0])} ${f1(ctrl[1])} ${f1(b[0] + w[0] * 3)} ${f1(b[1] + w[1] * 3)}" style="fill:none;stroke:${PEN};stroke-width:1;stroke-dasharray:3 2.5"/>`
          + `<rect x="${f1(tip[0] - hw)}" y="${f1(tip[1] - 8)}" width="${f1(hw * 2)}" height="16" style="fill:#fff"/>`;
        for (let i = 1; i < 12; i += 1) { const t = i / 12, x = (1 - t) * (1 - t) * a[0] + 2 * t * (1 - t) * ctrl[0] + t * t * b[0], y = (1 - t) * (1 - t) * a[1] + 2 * t * (1 - t) * ctrl[1] + t * t * b[1]; if (Math.hypot(x - tip[0], y - tip[1]) > hw + 2) ink.push([x, y]); }
        put({ k: 'side', text: m.text }, [tip], size);
        continue;
      }
      // 각: p 쪽에서 q 쪽으로 시계 반대쪽으로 도는 각이 180°보다 크면 두 쪽을 바꾼다.
      let a0 = dirDeg(m.v, m.p), a1 = dirDeg(m.v, m.q);
      if ((a1 - a0 + 360) % 360 > 180) { const s = a0; a0 = a1; a1 = s; }
      const span = (a1 - a0 + 360) % 360, v = px(m.v), at = (deg, r) => [v[0] + r * Math.cos(deg * RAD), v[1] - r * Math.sin(deg * RAD)], mid = a0 + span / 2;
      const r = m.r || (span > 100 ? 11 : span < 35 ? 19 : 14);
      const bow = (rr) => { const s = at(a0, rr), e = at(a0 + span, rr); for (let i = 0; i <= 8; i += 1) ink.push(at(a0 + span * i / 8, rr)); return `<path d="M${f1(s[0])} ${f1(s[1])}A${rr} ${rr} 0 0 0 ${f1(e[0])} ${f1(e[1])}" style="fill:none;stroke:${INK};stroke-width:1.1"/>`; };
      if (m.mark === 'right') { const s = 8, p1 = at(a0, s), p3 = at(a0 + span, s), p2 = [p1[0] + p3[0] - v[0], p1[1] + p3[1] - v[1]]; out.mark += `<polyline class="mb-mark" points="${[p1, p2, p3].map((p) => p.map(f1).join(',')).join(' ')}"/>`; trace(p1, p2); trace(p2, p3); }
      else if (m.mark === 'dot') { const c = at(mid, Math.max(13, 7 / Math.tan(Math.min(span, 170) / 2 * RAD))); out.mark += `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="2.4" style="fill:${BLUE}"/>`; ink.push(c); }
      else if (m.mark !== 'none') out.mark += bow(r) + (m.mark === 'arc2' ? bow(r + 3.4) : '');
      if (m.text != null && m.text !== '') {
        // 글 상자의 네 귀가 두 변 사이에 들어가는 가장 가까운 자리를 찾는다(좁은 각일수록 꼭짓점에서 멀다). 다른 글과 겹치면 조금 더 멀리 적는다.
        const size = 12, hw = widthOf(m.text, size) / 2 + 1, hh = size * 0.5, lim = Math.min(span, 170) / 2 - 3;
        const inside = (R) => { const c0 = at(mid, R); return [[-hw, -hh], [hw, -hh], [-hw, hh], [hw, hh]].every(([dx, dy]) => { const a = Math.atan2(-(c0[1] + dy - v[1]), c0[0] + dx - v[0]) / RAD, off = Math.abs(((a - mid) % 360 + 540) % 360 - 180); return off <= lim; }); };
        let R = (m.mark === 'right' ? 16 : r + 9);
        while (R < 86 && !inside(R)) R += 1;
        const lean = Math.min(12, span / 5);
        put({ k: 'angle', text: m.text }, [at(mid, R), at(mid, R + 7), at(mid + lean, R + 5), at(mid - lean, R + 5), at(mid, R + 14), at(mid + lean, R + 12), at(mid - lean, R + 12)], size);
      }
    }
    // 글: 점의 이름 → 선분 옆의 글 → 그 밖의 글
    const TURNS = [0, 28, -28, 55, -55, 85, -85, 125, -125, 180];
    for (const lb of this.labels.filter((x) => x.k === 'name')) {
      const size = lb.italic ? 13.5 : 13, base = lb.dir ? Math.atan2(lb.dir[1], lb.dir[0]) / RAD : freeSide(lb.p, this.items), a = px(lb.p), hw = widthOf(lb.text, size) / 2, spots = [];
      for (const gap of [lb.gap || 6, (lb.gap || 6) + 6]) for (const t of TURNS) { const c = Math.cos((base + t) * RAD), s = Math.sin((base + t) * RAD), off = gap + Math.abs(c) * hw + Math.abs(s) * size * 0.5; spots.push([a[0] + c * off, a[1] - s * off]); }
      put(lb, spots, size);
    }
    for (const lb of this.labels.filter((x) => x.k === 'side')) {
      const size = lb.italic ? 13.5 : 12, a = px(lb.p), b = px(lb.q), L = Math.hypot(b[0] - a[0], b[1] - a[1]), hw = widthOf(lb.text, size) / 2;
      let w = [-(b[1] - a[1]) / L, (b[0] - a[0]) / L];
      if (lb.away) { const c = px(lb.away), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if ((c[0] - m[0]) * w[0] + (c[1] - m[1]) * w[1] > 0) w = [-w[0], -w[1]]; }
      const spots = [];
      for (const s of (lb.only ? [1] : [1, -1])) for (const t of [lb.at || 0.5, 0.38, 0.62]) { const off = 6 + Math.abs(w[0]) * hw + Math.abs(w[1]) * size * 0.5; spots.push([a[0] + (b[0] - a[0]) * t + w[0] * off * s, a[1] + (b[1] - a[1]) * t + w[1] * off * s]); }
      put(lb, spots, size);
    }
    for (const lb of this.labels.filter((x) => x.k === 'note')) {
      const size = lb.italic ? 13.5 : 13, a = px(lb.p), base = Math.atan2(lb.dir[1], lb.dir[0]) / RAD, hw = widthOf(lb.text, size) / 2, spots = [];
      for (const gap of [lb.gap == null ? 5 : lb.gap, (lb.gap == null ? 5 : lb.gap) + 6]) for (const t of TURNS.slice(0, 7)) { const c = Math.cos((base + t) * RAD), s = Math.sin((base + t) * RAD), off = gap + Math.abs(c) * hw + Math.abs(s) * size * 0.5; spots.push([a[0] + c * off, a[1] - s * off]); }
      put(lb, spots, size);
    }
    return { html: out.fill + out.line + out.mark + out.dot + out.text, x: box[0] - 5, y: box[1] - 5, w: box[2] - box[0] + 10, h: box[3] - box[1] + 10 };
  };
  // 휴대폰 너비(360px 화면에서 문항 칸 안쪽은 290px)를 넘지 않게 배율을 줄여 가며 놓는다. o.k: 한 칸의 화소 수(기본 32), o.maxW, o.maxH, o.fixed: 배율을 줄이지 않는다.
  Pic.prototype.fit = function (o) {
    const opt = o || {}, maxW = opt.maxW || 286, maxH = opt.maxH || 215;
    let k = opt.k || 32, made = this.layout(k);
    for (let i = 0; i < 6 && !opt.fixed && (made.w > maxW || made.h > maxH); i += 1) { k *= Math.min(maxW / made.w, maxH / made.h) * 0.985; made = this.layout(k); }
    return made;
  };
  Pic.prototype.svg = function (label, o) {
    const m = this.fit(o), w = Math.max(60, Math.ceil(m.w)), h = Math.max(24, Math.ceil(m.h));
    return `<svg class="mb-geo" viewBox="${f1(m.x - (w - m.w) / 2)} ${f1(m.y - (h - m.h) / 2)} ${w} ${h}" width="${w}" role="img" aria-label="${label}">${m.html}</svg>`;
  };
  // 그림 여러 장을 한 판에 칸으로 나누어 놓는다(보기 삼각형). cells: [{ tag, pic }], o.cols: 한 줄의 칸 수, o.k: 한 칸(1 cm)의 화소 수 — 모든 칸에 같은 배율을 쓴다(크기를 견줄 수 있게).
  // o.head: 맨 위에 테두리 없이 따로 놓을 그림(주어진 삼각형). 어느 칸이든 칸 너비를 넘으면 모든 칸의 배율을 함께 줄인다.
  function gridFig(cells, label, o) {
    const opt = o || {}, cols = opt.cols || 2, cellW = Math.floor(288 / cols), all = (opt.head ? [opt.head] : []).concat(cells.map((c) => c.pic));
    let k = opt.k || 20, made = all.map((p) => p.fit({ k, fixed: true }));
    for (let i = 0; i < 6 && Math.max(...made.map((m) => m.w)) > cellW - 8; i += 1) { k *= (cellW - 8) / Math.max(...made.map((m) => m.w)) * 0.985; made = all.map((p) => p.fit({ k, fixed: true })); }
    const width = cellW * Math.min(cols, cells.length), rows = Math.ceil(cells.length / cols);
    let y = 0, out = '';
    if (opt.head) { const m = made.shift(); out += `<g transform="translate(${f1(8 - m.x)} ${f1(-m.y)})">${m.html}</g>`; y = m.h + 8; }
    for (let r = 0; r < rows; r += 1) {
      const row = made.slice(r * cols, r * cols + cols), h = Math.max(...row.map((m) => m.h)) + 24;
      row.forEach((m, c) => {
        const x = c * cellW, tag = cells[r * cols + c].tag;
        out += `<rect x="${x + 2}" y="${f1(y + 2)}" width="${cellW - 4}" height="${f1(h - 4)}" rx="8" style="fill:#fff;stroke:#d9dee3;stroke-width:1"/>`
          + `<text class="mb-label" style="fill:${BLUE};font-weight:700" x="${x + 16}" y="${f1(y + 15)}" text-anchor="middle" dominant-baseline="central">${tag}</text>`
          + `<g transform="translate(${f1(x + (cellW - m.w) / 2 - m.x)} ${f1(y + 20 + (h - 24 - m.h) / 2 - m.y)})">${m.html}</g>`;
      });
      y += h;
    }
    return `<svg class="mb-geo" viewBox="0 0 ${width} ${f1(y)}" width="${width}" role="img" aria-label="${label}">${out}</svg>`;
  }

  // 삼각형 하나를 판에 그린다. o.names: 꼭짓점 이름 셋, o.sides: { 변 번호: 글 }, o.angles: { 꼭짓점 번호: 글 }, o.marks: { 꼭짓점 번호: 표시 }, o.ticks: { 변 번호: 금의 수 }, o.italic: 변의 글이 문자
  function drawTri(pic, t, o) {
    const opt = o || {}, c = mean(t);
    for (let i = 0; i < 3; i += 1) pic.seg(t[(i + 1) % 3], t[(i + 2) % 3]);
    Object.keys(opt.ticks || {}).forEach((i) => pic.tick(t[(Number(i) + 1) % 3], t[(Number(i) + 2) % 3], opt.ticks[i]));
    for (let i = 0; i < 3; i += 1) {
      const text = (opt.angles || {})[i], mark = (opt.marks || {})[i];
      if (text != null || mark) pic.angle(t[i], t[(i + 1) % 3], t[(i + 2) % 3], { text, mark: mark || 'arc' });
    }
    Object.keys(opt.sides || {}).forEach((i) => pic.side(t[(Number(i) + 1) % 3], t[(Number(i) + 2) % 3], opt.sides[i], { away: c, italic: opt.italic, letter: /^[a-z] /.test(opt.sides[i]) }));
    if (opt.names) opt.names.forEach((n, i) => pic.name(t[i], n));
    return pic;
  }
  // 이름으로 짓는 그림: o.pts { 이름: 좌표 }, o.segs ['AB', …], o.thin, o.dash, o.ticks { AB: 1 }, o.lens { AB: '5 cm' }, o.spans { BE: '9 cm' }(점선 활과 함께 적는 길이), o.angs [['ABC', 글, 표시, 호의 반지름(px)]], o.fills ['ABC'], o.dirs { 이름: [dx, dy] }, o.hide '이름들', o.dots '이름들'
  function shape(o, into) {
    const pic = into || new Pic(), P = o.pts, c = mean(Object.keys(P).map((n) => P[n]));
    (o.fills || []).forEach((s) => pic.fill(s.split('').map((n) => P[n])));
    (o.segs || []).forEach((s) => pic.seg(P[s[0]], P[s[1]]));
    (o.thin || []).forEach((s) => pic.seg(P[s[0]], P[s[1]], 'thin'));
    (o.dash || []).forEach((s) => pic.seg(P[s[0]], P[s[1]], 'dash'));
    Object.keys(o.ticks || {}).forEach((s) => pic.tick(P[s[0]], P[s[1]], o.ticks[s]));
    (o.angs || []).forEach(([s, text, mark, r]) => pic.angle(P[s[1]], P[s[0]], P[s[2]], { text, mark: mark || 'arc', r }));
    Object.keys(o.lens || {}).forEach((s) => pic.side(P[s[0]], P[s[1]], o.lens[s], { away: (o.away || {})[s] || c }));
    Object.keys(o.spans || {}).forEach((s) => pic.span(P[s[0]], P[s[1]], o.spans[s], (o.away || {})[s] || c));
    (o.dots || '').split('').forEach((n) => pic.dot(P[n]));
    Object.keys(P).forEach((n) => { if (!(o.hide || '').includes(n)) pic.name(P[n], n, (o.dirs || {})[n]); });
    return pic;
  }

  // ── 작도 그림 ──
  // 선분 옮기기: 선분 AB 와 길이가 같은 선분 CD. syms: [점 B 의 호(길이 재기), 직선과 점 C, 점 D 의 호]
  function segCopyFig(syms) {
    const pic = new Pic(), L = 2.9, A = [0, 0], Bp = [L, 0], Cp = [L + 1.6, 0], D = [Cp[0] + L, 0];
    pic.seg(A, Bp).seg([Cp[0] - 0.7, 0], [D[0] + 0.75, 0]).nick(A, Bp, 0.62).nick(Cp, D, 0.62).dot(A).dot(Bp).dot(Cp).dot(D);
    pic.name(A, 'A', [0, -1]).name(Bp, 'B', [0.55, -1]).name(Cp, 'C', [0, -1]).name(D, 'D', [0.55, -1]);
    if (syms) pic.note(polar(A, L, 12), syms[0], [0.2, 1], { blue: true, gap: 3 }).note([Cp[0] - 0.42, 0], syms[1], [0, 1], { blue: true }).note(polar(Cp, L, 12), syms[2], [0.2, 1], { blue: true, gap: 3 });
    return pic.svg('왼쪽에 선분 AB가 있고, 오른쪽에 직선과 그 위의 두 점 C, D가 있다. 점 B를 지나는 짧은 호와 점 D를 지나는 짧은 호가 그려져 있다.'
      + (syms ? ` 점 B를 지나는 호에 ${syms[0]}, 점 C를 지나는 직선에 ${syms[1]}, 점 D를 지나는 호에 ${jo(syms[2], '이/가')} 적혀 있다.` : ''));
  }
  // 선분을 2배로 늘이기: 점 A 에서 그은 선 위에 B, C. syms: [연장선, 점 B 의 호, 점 C 의 호]
  function segDoubleFig(syms) {
    const pic = new Pic(), L = 3.1, A = [0, 0], Bp = [L, 0], Cp = [2 * L, 0];
    pic.seg(A, [2 * L + 1, 0]).nick(A, Bp, 0.62).nick(Bp, Cp, 0.62).dot(A).dot(Bp).dot(Cp).tick(A, Bp, 2).tick(Bp, Cp, 2);
    pic.name(A, 'A', [0, -1]).name(Bp, 'B', [0.55, -1]).name(Cp, 'C', [0.55, -1]);
    pic.note([2 * L + 1, 0], syms[0], [1, 0], { blue: true }).note(polar(A, L, 11), syms[1], [0.2, 1], { blue: true, gap: 3 }).note(polar(Bp, L, 11), syms[2], [0.2, 1], { blue: true, gap: 3 });
    return pic.svg(`점 A에서 오른쪽으로 그은 선 위에 세 점 A, B, C가 차례로 있고, 선분 AB와 선분 BC에 같은 표시가 있다. 선의 오른쪽 끝에 ${syms[0]}, 점 B를 지나는 호에 ${syms[1]}, 점 C를 지나는 호에 ${jo(syms[2], '이/가')} 적혀 있다.`);
  }
  // 각 옮기기: ∠XOY 와 크기가 같고 반직선 PQ 를 한 변으로 하는 ∠RPQ. syms: [점 O 의 큰 호, 점 P 의 큰 호, 점 A 의 작은 호, 점 C 의 작은 호, 반직선 PR]
  function angleCopyFig(deg, syms) {
    const pic = new Pic(), r = 1.75, ray = 2.95, back = deg > 90 ? -ray * Math.cos(deg * RAD) + 0.3 : 0;
    const O = [back, 0], P = [O[0] + ray + 1.05 + back, 0], chord = 2 * r * Math.sin(deg / 2 * RAD);
    const half = (o, names, s) => {
      const y = add(o, [ray, 0]), x = polar(o, ray, deg), a = polar(o, r, deg), b = add(o, [r, 0]);
      pic.seg(o, add(o, [ray + 0.35, 0])).seg(o, polar(o, ray + 0.35, deg)).arc(o, r, -9, deg + 9).nick(b, a, 0.46).dot(o).dot(x).dot(y);
      pic.name(o, names[0], [-0.6, -1]).name(x, names[1], [Math.cos((deg + 90) * RAD), Math.sin((deg + 90) * RAD)]).name(y, names[2], [0, -1]);
      pic.name(a, names[3], [Math.cos((deg + 90) * RAD), Math.sin((deg + 90) * RAD)], { gap: 5 }).name(b, names[4], [0.75, -1], { gap: 4 });
      if (syms) {
        pic.note(polar(o, r, deg * 0.45), s[0], [Math.cos(deg * 0.45 * RAD), Math.sin(deg * 0.45 * RAD)], { blue: true, gap: 3 });
        const w = Math.min(28, 0.46 / chord / RAD), tip = polar(b, chord, dirDeg(b, a) - w);
        pic.note(tip, s[1], [Math.cos((deg - 55) * RAD), Math.sin((deg - 55) * RAD)], { blue: true, gap: 2 });
      }
    };
    half(O, ['O', 'X', 'Y', 'A', 'B'], syms ? [syms[0], syms[2]] : null);
    half(P, ['P', 'R', 'Q', 'C', 'D'], syms ? [syms[1], syms[3]] : null);
    if (syms) pic.note(polar(P, ray + 0.35, deg), syms[4], [Math.cos(deg * RAD), Math.sin(deg * RAD)], { blue: true, gap: 3 });
    return pic.svg(`왼쪽에 ∠XOY가 있다. 점 O를 중심으로 하는 호가 반직선 OX, OY와 각각 점 A, B에서 만나고, 점 A를 지나는 짧은 호가 있다. 오른쪽에 반직선 PQ가 있다. 점 P를 중심으로 하는 호가 반직선 PQ와 점 D에서 만나고, 점 D를 중심으로 하는 짧은 호가 이 호와 점 C에서 만난다. 반직선 PC 위에 점 R가 있다.`
      + (syms ? ` 점 O를 중심으로 하는 호에 ${syms[0]}, 점 P를 중심으로 하는 호에 ${syms[1]}, 점 A를 지나는 짧은 호에 ${syms[2]}, 점 C를 지나는 짧은 호에 ${syms[3]}, 반직선 PR에 ${jo(syms[4], '이/가')} 적혀 있다.` : ''), { k: 34 });
  }
  // 평행선: 직선 l 밖의 점 P 를 지나고 l 에 평행한 직선. alt 이면 엇각 자리(점 Q 가 점 P 와 점 A 사이, 점 R 가 점 P 의 왼쪽), 아니면 동위각 자리.
  // syms: [점 P 와 점 A 를 지나는 직선, 점 A 의 호, 점 P 의 호, 점 C 의 작은 호, 점 R 의 작은 호, 직선 PR]
  function parallelFig(alt, phi, syms) {
    const pic = new Pic(), r = 1.2, AP = 3.5, A = [0, 0], u = [Math.cos(phi * RAD), Math.sin(phi * RAD)], P = mul(u, AP), Bp = mul(u, r), Cp = [r, 0], s = alt ? 180 : 0;
    const Q = polar(P, r, phi + s), R = polar(P, r, s), left = Math.min(-1.3, P[0] - (alt ? 2.5 : 1.3)), right = Math.max(P[0] + (alt ? 1.3 : 2.6), 2.7);
    pic.seg([left, 0], [right, 0]).seg(mul(u, -0.85), mul(u, AP + (alt ? 0.9 : 1.75))).seg([left, P[1]], [right, P[1]]);
    pic.arc(A, r, -11, phi + 11).arc(P, r, s - 11, phi + s + 11).nick(Bp, Cp, 0.4).nick(Q, R, 0.4).dot(P);
    const side = [Math.cos((phi + 90) * RAD), Math.sin((phi + 90) * RAD)];
    pic.name(A, 'A', [-0.9, -1]).name(Bp, 'B', side, { gap: 5 }).name(Cp, 'C', [0.8, -1], { gap: 4 }).name(P, 'P', alt ? [1, 0.9] : side, { gap: 5 });
    pic.name(Q, 'Q', alt ? [-side[0], -side[1]] : side, { gap: 5 }).name(R, 'R', alt ? [-0.8, 1] : [0.8, -1], { gap: 4 }).name([right, 0], 'l', [1, 0], { italic: true, gap: 4 });
    if (syms) {
      const top = mul(u, AP + (alt ? 0.9 : 1.75));
      pic.note(top, syms[0], u, { blue: true, gap: 3 }).note(polar(A, r, phi * 0.5), syms[1], [Math.cos(phi * 0.5 * RAD), Math.sin(phi * 0.5 * RAD)], { blue: true, gap: 3 });
      pic.note(polar(P, r, s + phi * 0.5), syms[2], [Math.cos((s + phi * 0.5) * RAD), Math.sin((s + phi * 0.5) * RAD)], { blue: true, gap: 3 });
      pic.note(add(Cp, [0.1, -0.35]), syms[3], [0.3, -1], { blue: true, gap: 3 }).note(add(R, alt ? [-0.1, 0.35] : [0.1, -0.35]), syms[4], alt ? [-0.3, 1] : [0.3, -1], { blue: true, gap: 3 });
      pic.note([alt ? left : right, P[1]], syms[5], [alt ? -1 : 1, 0], { blue: true, gap: 4 });
    }
    const where = alt ? '점 Q는 점 P와 점 A 사이에 있고, 점 R는 점 P의 왼쪽에 있어 ∠BAC와 ∠QPR는 엇갈린 자리에 있다' : '점 Q는 점 P에서 점 A의 반대쪽에 있고, 점 R는 점 P의 오른쪽에 있어 ∠BAC와 ∠QPR는 같은 쪽 자리에 있다';
    return pic.svg(`가로로 놓인 직선 l과 그 위쪽의 점 P가 있다. 점 P를 지나는 비스듬한 직선이 직선 l과 점 A에서 만난다. 점 A를 중심으로 하는 호가 이 직선과 점 B에서, 직선 l과 점 C에서 만난다. 점 P를 중심으로 하고 반지름의 길이가 같은 호가 비스듬한 직선과 점 Q에서 만나고, 점 Q를 중심으로 하는 짧은 호가 이 호와 점 R에서 만난다. 직선 PR가 그어져 있다. ${where}.`
      + (syms ? ` 점 P와 점 A를 지나는 직선에 ${syms[0]}, 점 A를 중심으로 하는 호에 ${syms[1]}, 점 P를 중심으로 하는 호에 ${syms[2]}, 점 C를 지나는 짧은 호에 ${syms[3]}, 점 R를 지나는 짧은 호에 ${syms[4]}, 직선 PR에 ${jo(syms[5], '이/가')} 적혀 있다.` : ''), { k: 33, maxH: 205 });
  }
  // 세 변의 길이가 주어진 삼각형의 작도. syms: [점 C 의 호(선분 BC), 점 A 에서 만나는 두 호, 선분 AB·AC]
  function sssFig(syms) {
    const pic = new Pic(), a = 4.3, b = 3.5, c = 3.0, Bp = [0, 0], Cp = [a, 0], A = triSSS(a, b, c)[2], A2 = [(c * c + a * a - b * b) / (2 * a), 0];
    const top = [A2[0], Math.sqrt(c * c - A2[0] * A2[0])];
    pic.seg([-0.75, 0], [a + 1.05, 0]).seg(top, Bp).seg(top, Cp).nick(Bp, Cp, 0.5).nick(Bp, top, 0.55).nick(Cp, top, 0.55).dot(Bp);
    pic.name(top, 'A', [0, 1], { gap: 9 }).name(Bp, 'B', [-0.5, -1]).name(Cp, 'C', [0.75, -1], { gap: 4 }).name([a + 1.05, 0], 'l', [1, 0], { italic: true, gap: 4 });
    pic.side(Bp, Cp, 'a', { away: top, italic: true, only: true }).side(top, Bp, 'c', { away: Cp, italic: true, only: true }).side(top, Cp, 'b', { away: Bp, italic: true, only: true });
    if (syms) {
      pic.note(polar(Bp, a, -7), syms[0], [0.5, -1], { blue: true, gap: 3 });
      pic.note(polar(Bp, c, dirDeg(Bp, top) + 0.55 / c / RAD), syms[1], [-1, 0.6], { blue: true, gap: 3 }).note(polar(Cp, b, dirDeg(Cp, top) - 0.55 / b / RAD), syms[1], [1, 0.6], { blue: true, gap: 3 });
      pic.note(lerp(top, Bp, 0.5), syms[2], [1, -0.25], { blue: true, gap: 5 }).note(lerp(top, Cp, 0.5), syms[2], [-1, -0.25], { blue: true, gap: 5 });
    }
    return pic.svg('직선 l 위에 두 점 B, C가 있고 그 위쪽에 점 A가 있다. 삼각형 ABC에서 변 BC의 길이는 a, 변 CA의 길이는 b, 변 AB의 길이는 c이다. 점 C를 지나는 짧은 호가 직선 l 위에 있고, 점 A에서 두 호가 엇갈린다.'
      + (syms ? ` 점 C를 지나는 호에 ${syms[0]}, 점 A에서 엇갈리는 두 호에 ${syms[1]}, 선분 AB와 선분 AC에 ${jo(syms[2], '이/가')} 적혀 있다.` : ''), { k: 36 });
  }
  // 반직선 위로 각을 옮긴 자국: 꼭짓점 v 에서 from° 쪽 변과 to° 쪽 변 사이의 큰 호와, 옮긴 변 위의 작은 호
  function copiedAngle(pic, v, from, to, r) {
    const lo = Math.min(from, to), hi = Math.max(from, to), chord = 2 * r * Math.sin((hi - lo) / 2 * RAD);
    pic.arc(v, r, lo - 10, hi + 10).nick(polar(v, r, from), polar(v, r, to), Math.min(0.34, chord * 0.5));
  }
  // 두 변의 길이 a, c 와 그 끼인각 ∠B 가 주어진 삼각형의 작도. syms: [점 C 의 호(선분 BC), ∠B 를 옮긴 호, 점 A 의 호, 선분 AC]
  function sasFig(deg, syms) {
    const pic = new Pic(), a = 4.2, c = 3.3, Bp = [0, 0], Cp = [a, 0], A = polar(Bp, c, deg), P = polar(Bp, c + 1.15, deg);
    pic.seg([-0.75, 0], [a + 1.05, 0]).seg(Bp, polar(Bp, c + 1.5, deg)).seg(A, Cp).nick(Bp, Cp, 0.5).nick(Bp, A, 0.5).dot(Bp).dot(P);
    copiedAngle(pic, Bp, 0, deg, 1.0);
    const side = [Math.cos((deg + 90) * RAD), Math.sin((deg + 90) * RAD)];
    pic.name(A, 'A', side, { gap: 6 }).name(Bp, 'B', [-0.6, -1]).name(Cp, 'C', [0.75, -1], { gap: 4 }).name(P, 'P', side, { gap: 5 }).name([a + 1.05, 0], 'l', [1, 0], { italic: true, gap: 4 });
    pic.side(Bp, Cp, 'a', { away: A, italic: true, only: true, at: 0.6 }).side(Bp, A, 'c', { away: Cp, italic: true, only: true, at: 0.68 });
    if (syms) {
      pic.note(polar(Bp, a, -7), syms[0], [0.5, -1], { blue: true, gap: 3 }).note(polar(Bp, 1.0, deg * 0.5), syms[1], [Math.cos(deg * 0.5 * RAD), Math.sin(deg * 0.5 * RAD)], { blue: true, gap: 3 });
      pic.note(polar(Bp, c, deg - 0.5 / c / RAD), syms[2], [Math.cos((deg - 80) * RAD), Math.sin((deg - 80) * RAD)], { blue: true, gap: 2 }).note(lerp(A, Cp, 0.5), syms[3], [0.8, 0.7], { blue: true, gap: 5 });
    }
    return pic.svg('직선 l 위에 두 점 B, C가 있고, 점 B에서 비스듬히 올라간 반직선 BP 위에 점 A가 있다. 선분 BC의 길이는 a, 선분 AB의 길이는 c이다. 점 C를 지나는 짧은 호가 직선 l 위에 있고, 점 B에는 각을 옮긴 호가, 점 A에는 반직선 BP와 만나는 짧은 호가 있다. 선분 AC가 그어져 있다.'
      + (syms ? ` 점 C를 지나는 호에 ${syms[0]}, 점 B에서 각을 옮긴 호에 ${syms[1]}, 점 A를 지나는 호에 ${syms[2]}, 선분 AC에 ${jo(syms[3], '이/가')} 적혀 있다.` : ''), { k: 36 });
  }
  // 한 변의 길이 a 와 그 양 끝 각 ∠B, ∠C 가 주어진 삼각형의 작도
  function asaFig(beta, gamma) {
    const pic = new Pic(), a = 4.3, Bp = [0, 0], Cp = [a, 0], ub = [Math.cos(beta * RAD), Math.sin(beta * RAD)], uc = [Math.cos((180 - gamma) * RAD), Math.sin((180 - gamma) * RAD)];
    const A = meet(Bp, ub, Cp, uc), P = add(A, mul(ub, 1.0)), Q = add(A, mul(uc, 1.0));
    pic.seg([-0.75, 0], [a + 1.05, 0]).seg(Bp, add(A, mul(ub, 1.35))).seg(Cp, add(A, mul(uc, 1.35))).nick(Bp, Cp, 0.5).dot(Bp).dot(P).dot(Q);
    copiedAngle(pic, Bp, 0, beta, 0.9); copiedAngle(pic, Cp, 180, 180 - gamma, 0.9);
    pic.name(A, 'A', [0, -1], { gap: 9 }).name(Bp, 'B', [-0.6, -1]).name(Cp, 'C', [0.75, -1], { gap: 4 }).name(P, 'P', [Math.cos((beta - 90) * RAD), Math.sin((beta - 90) * RAD)], { gap: 5 });
    pic.name(Q, 'Q', [Math.cos((270 - gamma) * RAD), Math.sin((270 - gamma) * RAD)], { gap: 5 }).name([a + 1.05, 0], 'l', [1, 0], { italic: true, gap: 4 }).side(Bp, Cp, 'a', { away: A, italic: true, only: true });
    return pic.svg('직선 l 위에 두 점 B, C가 있고, 선분 BC의 길이는 a이다. 점 B에서 비스듬히 올라간 반직선 BP와 점 C에서 비스듬히 올라간 반직선 CQ가 점 A에서 만난다. 점 C를 지나는 짧은 호가 직선 l 위에 있고, 점 B와 점 C에는 각을 옮긴 호가 있다.', { k: 36 });
  }

  // ── 가. 작도의 뜻과 선분·각·평행선의 작도 ──
  const RULER = '눈금 없는 자', COMPASS = '컴퍼스';
  const JOBS = [
    ['두 점을 연결하여 선분을 그린다.', RULER], ['주어진 선분을 연장한다.', RULER],
    ['원을 그린다.', COMPASS], ['주어진 선분의 길이를 재어 다른 직선 위로 옮긴다.', COMPASS], ['두 선분의 길이를 비교한다.', COMPASS]
  ];
  const TOOL_SAID = '작도에서 눈금 없는 자는 두 점을 연결하여 선분을 그리거나 선분을 연장하는 데 사용하고, 컴퍼스는 원을 그리거나 선분의 길이를 재어 옮기는 데 사용한다.';
  const DRAW_TRUE = ['작도할 때는 눈금 없는 자와 컴퍼스만을 사용한다.', '두 점을 연결하여 선분을 그릴 때는 눈금 없는 자를 사용한다.', '선분을 연장할 때는 눈금 없는 자를 사용한다.', '원을 그릴 때는 컴퍼스를 사용한다.',
    '주어진 선분의 길이를 다른 직선 위로 옮길 때는 컴퍼스를 사용한다.', '두 선분의 길이를 비교할 때는 컴퍼스를 사용한다.', '크기가 같은 각을 작도할 때는 눈금 없는 자와 컴퍼스를 모두 사용한다.'];
  const DRAW_FALSE = [
    ['선분을 연장할 때는 컴퍼스를 사용한다.', '선분을 연장할 때는 눈금 없는 자를 사용한다.', DRAW_TRUE[2]],
    ['주어진 선분의 길이를 다른 직선 위로 옮길 때는 눈금 없는 자를 사용한다.', '눈금 없는 자로는 길이를 잴 수 없다. 선분의 길이를 옮길 때는 컴퍼스를 사용한다.', DRAW_TRUE[4]],
    ['크기가 같은 각을 작도할 때는 눈금 없는 자만 사용한다.', '크기가 같은 각을 작도할 때는 원을 그리고 길이를 옮겨야 하므로 컴퍼스도 사용한다.', DRAW_TRUE[6]],
    ['주어진 각과 크기가 같은 각을 작도할 때는 각도기를 사용한다.', '작도에서는 각도기를 사용하지 않는다. 눈금 없는 자와 컴퍼스만을 사용한다.', DRAW_TRUE[6]],
    ['두 선분의 길이를 비교할 때는 눈금 없는 자를 사용한다.', '눈금 없는 자로는 길이를 잴 수 없다. 두 선분의 길이는 컴퍼스로 비교한다.', DRAW_TRUE[5]],
    ['작도할 때는 눈금 있는 자로 길이를 재어 선분을 그린다.', '작도에서는 눈금 없는 자와 컴퍼스만을 사용한다.', DRAW_TRUE[0]]
  ];
  // 차례 고르기: order(바른 차례의 기호들)와 틀린 차례들(wrongs)에서 보기를 짓는다.
  const orderQ = (d, text, right, wrongs, o) => pickOne(d, text, seq(right), d.shuffle(wrongs).slice(0, 3).map(seq), o);
  const AB = sg('AB'), CD = sg('CD');
  const ANGLE_TASK = '∠XOY와 크기가 같고 반직선 PQ를 한 변으로 하는 ∠RPQ';
  const PARA_TASK = '직선 ' + V('l') + ' 밖의 한 점 P를 지나고 직선 ' + V('l') + '과 평행한 직선';
  const copyDeg = (d) => d.pick([42, 48, 52, 68, 72, 112, 118, 124]);   // 60° 언저리는 쓰지 않는다(선분 OA 와 AB 의 길이가 같아 보인다)

  B.addUnit({
    id: '7-2-2', grade: 7, semester: 2, no: 2, title: '작도와 합동', version: 2,
    groups: [
      {
        id: 'tools', title: '작도의 뜻과 선분·각·평행선의 작도', standard: STD3,
        types: [
          T('tools-word', '작도의 뜻과 도구의 쓰임', '①1 ②1', (d) => {
            const rows = ['눈금 없는 자와 컴퍼스만을 사용하여 도형을 그리는 것', '작도에서 두 점을 연결하여 선분을 그리거나 선분을 연장하는 데 사용하는 도구', '작도에서 원을 그리거나 주어진 선분의 길이를 옮기는 데 사용하는 도구'];
            return pickOne(d, '다음 ㈎, ㈏, ㈐에 알맞은 말을 차례로 나열한 것은?', '작도, 눈금 없는 자, 컴퍼스', ['작도, 컴퍼스, 눈금 없는 자', '합동, 눈금 없는 자, 컴퍼스', '작도, 각도기, 컴퍼스'], {
              figure: tagged(rows, BLK), explain: '눈금 없는 자와 컴퍼스만을 사용하여 도형을 그리는 것을 작도라 한다. ' + TOOL_SAID
            });
          }),
          T('tools-pick', '하는 일에 맞는 작도 도구', '①2 ②3', (d, n) => {
            const tools = [RULER, COMPASS, '각도기', '눈금 있는 자'];
            if (n === 0) {
              const job = d.pick(JOBS.filter((j) => j[1] === RULER));
              return pickOne(d, '작도에서 다음과 같은 일을 할 때 사용하는 도구는?', RULER, tools.filter((t) => t !== RULER), { figure: lines([job[0]]), explain: TOOL_SAID });
            }
            return pickOne(d, `선분 AB를 점 B의 방향으로 연장한 반직선이 그려져 있다. 이 반직선 위에 ${AB} = ${sg('BC')}가 되도록 점 C를 작도할 때 사용하는 도구는?`, COMPASS, tools.filter((t) => t !== COMPASS), {
              explain: `컴퍼스로 ${AB}의 길이를 재고, 점 B를 중심으로 하고 반지름의 길이가 ${AB}인 원을 그려 반직선과 만나는 점을 C로 잡는다. 눈금 없는 자로는 길이를 잴 수 없다.`
            });
          }, { count: 2 }),
          T('tools-sort', '컴퍼스로 하는 일과 눈금 없는 자로 하는 일 나누기', '①3', (d) => {
            const jobs = d.until(() => d.shuffle(JOBS).slice(0, 4), (list) => list.some((j) => j[1] === RULER)), tool = d.pick([RULER, COMPASS]), flags = jobs.map((j) => j[1] === tool);
            return allQ(d, `다음 중 작도에서 ${jo(tool, '을/를')} 사용하는 것을 모두 고른 것은?`, SYM, flags, { figure: tagged(jobs.map((j) => j[0]), SYM), explain: TOOL_SAID });
          }),
          T('tools-claims', '작도에 대한 설명 가리기', '①4 ②2 심1', (d) => {
            const want = d.bool();
            return claimQ(d, want ? '작도에 대한 설명으로 옳은 것은?' : '작도에 대한 설명으로 옳지 않은 것은?', DRAW_TRUE, DRAW_FALSE, want);
          }),
          T('seg-order-words', '길이가 같은 선분의 작도: 문장으로 쓴 과정의 차례', '①5', (d) => {
            // 직선 긋기와 길이 재기는 앞뒤가 바뀌어도 되므로, 바뀐 차례(길이 재기 → 직선 → 원)는 보기에 넣지 않는다. 틀린 보기는 모두 원을 마지막이 아닌 자리에 둔다.
            const tags = d.shuffle(SYM.slice(0, 3)), [L, Mm, K] = tags, body = { [L]: `눈금 없는 자로 직선 ${V('l')}을 긋고, 그 위에 점 C를 잡는다.`, [Mm]: `컴퍼스로 ${AB}의 길이를 잰다.`, [K]: `점 C를 중심으로 하고 반지름의 길이가 ${AB}인 원을 그려 직선 ${V('l')}과의 교점을 D라 한다.` };
            return orderQ(d, '다음은 선분 AB와 길이가 같은 선분 CD를 작도하는 과정이다. 작도 순서를 바르게 나열한 것은?', [L, Mm, K], [[K, L, Mm], [K, Mm, L], [L, K, Mm], [Mm, K, L]], {
              figure: tagged(SYM.slice(0, 3).map((s) => body[s]), SYM),
              explain: `직선을 긋고 점 C를 잡은 다음(${L}), 컴퍼스로 ${AB}의 길이를 재고(${Mm}), 점 C를 중심으로 하고 반지름의 길이가 ${AB}인 원을 그린다(${K}). 원은 점 C를 잡고 길이를 잰 다음에야 그릴 수 있다.`
            });
          }),
          T('seg-order-fig', '길이가 같은 선분의 작도: 그림의 기호로 쓴 차례', '①6 ②4', (d) => {
            const s = d.shuffle(SYM.slice(0, 3)), [m, l, k] = s;
            return orderQ(d, '그림은 선분 AB와 길이가 같은 선분 CD를 작도하는 과정을 나타낸 것이다. 작도 순서를 바르게 나열한 것은?', [l, m, k], [[k, l, m], [k, m, l], [l, k, m], [m, k, l]], {
              figure: segCopyFig(s),
              explain: `점 C를 지나는 직선을 긋고(${l}), 컴퍼스로 ${AB}의 길이를 잰 다음(${m}), 점 C를 중심으로 하고 반지름의 길이가 ${AB}인 원을 그려 직선과의 교점을 D라 한다(${k}).`
            });
          }),
          T('seg-claims', '길이가 같은 선분의 작도 그림에 대한 설명', '①7', (d) => {
            const s = d.shuffle(SYM.slice(0, 3)), [m, l, k] = s, good = `작도 순서는 ${seq([l, m, k])}이다.`;
            const yes = [`${AB}의 길이를 잴 때는 컴퍼스를 사용한다.`, '점 C를 지나는 직선을 그을 때는 눈금 없는 자를 사용한다.', good, `${AB} = ${CD}이다.`, `점 D는 점 C를 중심으로 하고 반지름의 길이가 ${AB}인 원 위에 있다.`];
            const no = [[`${AB}의 길이를 잴 때는 눈금 없는 자를 사용한다.`, `눈금 없는 자로는 길이를 잴 수 없다. ${AB}의 길이는 컴퍼스로 잰다.`, yes[0]],
              [`작도 순서는 ${seq([k, l, m])}이다.`, `점 D를 정하는 호(${k})는 직선을 긋고(${l}) ${AB}의 길이를 잰(${m}) 다음에 그린다.`, good],
              ['점 D는 점 A를 중심으로 하는 원을 그려서 정한다.', `점 D는 점 C를 중심으로 하고 반지름의 길이가 ${AB}인 원이 직선과 만나는 점이다.`, yes[4]]];
            return withFigure(claimQ(d, '그림은 선분 AB와 길이가 같은 선분 CD를 작도하는 과정을 나타낸 것이다. 다음 중 옳지 않은 것은?', yes, no, false), segCopyFig(s));
          }),
          T('seg-double-blank', '선분을 2배로 늘이는 작도 과정의 빈칸', '②5 심3', (d, n) => {
            const s = SYM.slice(0, 3), AC = sg('AC'), fig = segDoubleFig(s), head = `다음은 선분 AB를 점 B의 방향으로 연장하여 ${AC} = 2${AB}인 선분 AC를 작도하는 과정이다. `;
            if (n === 0) {
              const rows = [`㈎를 사용하여 ${AB}를 점 B의 방향으로 연장한다.`, `㈏를 사용하여 ${AB}의 길이를 잰다.`, `점 B를 중심으로 하고 반지름의 길이가 ${AB}인 원을 그려 ${AB}의 연장선과의 교점을 C라 한다.`];
              return pickOne(d, head + '㈎, ㈏에 알맞은 도구를 차례로 나열한 것은?', `${RULER}, ${COMPASS}`, [`${COMPASS}, ${RULER}`, `${RULER}, ${RULER}`, `${COMPASS}, ${COMPASS}`], {
                figure: fig + tagged(rows, s), explain: `선분을 연장할 때는 눈금 없는 자를, 선분의 길이를 잴 때는 컴퍼스를 사용한다.`
              });
            }
            const rows = [`눈금 없는 자를 사용하여 ${AB}를 점 B의 방향으로 연장한다.`, `컴퍼스를 사용하여 ${AB}의 길이를 잰다.`, `점 ㈎를 중심으로 하고 반지름의 길이가 ㈏인 원을 그려 ${AB}의 연장선과의 교점을 C라 한다.`];
            return pickOne(d, head + '㈎, ㈏에 알맞은 것을 차례로 나열한 것은?', `B, ${AB}`, [`A, ${AB}`, `B, ${AC}`, `A, ${AC}`], {
              figure: fig + tagged(rows, s), explain: `${sg('BC')} = ${AB}가 되어야 ${AC} = 2${AB}이다. 점 B를 중심으로 하고 반지름의 길이가 ${AB}인 원을 그려 연장선과 만나는 점을 C로 잡는다.`
            });
          }, { count: 2 }),
          T('seg-triple', '선분을 3배로 늘이는 작도 과정의 차례', '②6 심2', (d) => {
            // 연장하기와 길이 재기는 앞뒤가 바뀌어도 되므로 그 차례만 바꾼 것은 보기에 넣지 않는다.
            const tags = d.shuffle(SYM.slice(0, 4)), [E, Mm, C1, C2] = tags;
            const body = { [E]: `눈금 없는 자로 ${AB}를 점 B의 방향으로 연장한다.`, [Mm]: `컴퍼스로 ${AB}의 길이를 잰다.`, [C1]: `점 B를 중심으로 하고 반지름의 길이가 ${AB}인 원을 그려 연장선과의 교점을 C라 한다.`, [C2]: `점 C를 중심으로 하고 반지름의 길이가 ${AB}인 원을 그려 연장선과의 교점 가운데 점 B가 아닌 점을 D라 한다.` };
            return orderQ(d, `다음은 선분 AB를 점 B의 방향으로 연장하여 ${sg('AD')} = 3${AB}인 선분 AD를 작도하는 과정이다. 작도 순서를 바르게 나열한 것은?`, [E, Mm, C1, C2], [[E, Mm, C2, C1], [E, C1, Mm, C2], [C1, C2, E, Mm], [E, C2, Mm, C1], [Mm, C1, E, C2]], {
              figure: tagged(SYM.slice(0, 4).map((s) => body[s]), SYM),
              explain: `${AB}를 연장하고(${E}) 컴퍼스로 ${AB}의 길이를 잰 다음(${Mm}), 점 B를 중심으로 원을 그려 점 C를 잡고(${C1}), 다시 점 C를 중심으로 원을 그려 점 D를 잡는다(${C2}). 점 C가 정해져야 점 C를 중심으로 하는 원을 그릴 수 있다.`
            });
          }),
          T('angle-blank', '크기가 같은 각의 작도 과정의 빈칸', '①8', (d) => {
            const s = SYM.slice(0, 5), OA = sg('OA');
            const rows = ['점 O를 중심으로 하는 원을 그려 반직선 OX, OY와의 교점을 각각 A, B라 한다.', '점 P를 중심으로 하고 반지름의 길이가 ㈎인 원을 그려 반직선 PQ와의 교점을 D라 한다.', '컴퍼스로 ㈏의 길이를 잰다.',
              `점 D를 중심으로 하고 반지름의 길이가 ㈏인 원을 그려 ${s[1]}의 원과의 교점을 C라 한다.`, '반직선 PC를 긋고, 그 위에 점 R를 잡는다.'];
            return pickOne(d, `그림은 ${ANGLE_TASK}를 작도한 것이다. 다음 작도 과정의 ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, `${OA}, ${AB}`, [`${AB}, ${OA}`, `${OA}, ${sg('OB')}`, `${sg('OX')}, ${AB}`], {
              figure: angleCopyFig(copyDeg(d), null) + tagged(rows, s),
              explain: `점 P를 중심으로 하는 원은 점 O를 중심으로 하는 원과 반지름의 길이가 같아야 하므로 ㈎는 ${OA}이다. 두 변이 벌어진 정도를 옮기려면 ${AB}의 길이를 재어 점 D를 중심으로 하는 원을 그려야 하므로 ㈏는 ${AB}이다.`
            });
          }),
          T('angle-order', '크기가 같은 각의 작도: 그림의 기호로 쓴 차례', '①9 ②7 심4', (d) => {
            // 점 O 의 호와 점 P 의 호는 앞뒤가 바뀌어도 되므로 두 호를 문제에 주고 나머지 셋의 차례를 묻는다.
            const s = d.shuffle(SYM.slice(0, 5)), [o, p, a, c, ray] = s;
            return pickOne(d, `그림은 ${ANGLE_TASK}를 작도하는 과정을 나타낸 것이다. 작도 순서가 ${seq([o, p, '㈎', '㈏', '㈐'])}일 때, ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`,
              [a, c, ray].join(', '), d.shuffle([[a, ray, c], [c, a, ray], [c, ray, a], [ray, a, c], [ray, c, a]]).slice(0, 3).map((x) => x.join(', ')), {
                figure: angleCopyFig(copyDeg(d), s),
                explain: `점 O와 점 P를 중심으로 반지름의 길이가 같은 원을 그린 다음(${o}, ${p}), 컴퍼스로 ${AB}의 길이를 재고(${a}), 점 D를 중심으로 하고 반지름의 길이가 ${AB}인 원을 그려 점 C를 잡은 뒤(${c}), 반직선 PC를 긋는다(${ray}).`
              });
          }),
          T('angle-equal', '크기가 같은 각의 작도에서 길이가 같은 선분', '①10 ②8 ②9', (d, n) => {
            const fig = angleCopyFig(copyDeg(d), null), why = `점 O와 점 P를 중심으로 반지름의 길이가 같은 원을 그렸으므로 ${sg('OA')} = ${sg('OB')} = ${sg('PC')} = ${sg('PD')}이고, ${AB}의 길이를 옮겼으므로 ${AB} = ${CD}이다.`;
            if (n === 1) {
              const odd = d.pick(['AB', 'CD']);
              return pickOne(d, `그림은 ${ANGLE_TASK}를 작도한 것이다. 다음 선분 가운데 길이가 나머지 넷과 다른 하나는?`, sg(odd), ['OA', 'OB', 'PC', 'PD'].map(sg), { figure: fig, explain: `${why} ${sg(odd)}의 길이는 원의 반지름의 길이와 같다고 할 수 없다.` });
            }
            const eq = (x, y) => `${sg(x)} = ${sg(y)}`, yes = d.shuffle([eq('OA', 'PC'), eq('OB', 'PD'), eq('OA', 'PD'), eq('AB', 'CD'), '∠AOB = ∠CPD']).slice(0, 3), bad = d.pick([['OB', 'CD'], ['OA', 'CD'], ['AB', 'PD'], ['OA', 'AB'], ['PC', 'CD']]);
            return pickOne(d, `그림은 ${ANGLE_TASK}를 작도한 것이다. 다음 중 옳지 않은 것은?`, eq(bad[0], bad[1]), yes, { figure: fig, explain: `${why} ${sg(bad[0])}와 ${sg(bad[1])}의 길이는 같다고 할 수 없다.` });
          }, { count: 2 }),
          T('para-order', '평행선의 작도: 그림의 기호로 쓴 차례', '①12', (d) => {
            // 점 A 의 호와 점 P 의 호의 앞뒤만 바꾼 차례는 보기에 넣지 않는다.
            const s = d.shuffle(SYM), [t, a, p, m, q, L] = s;
            return orderQ(d, `그림은 ${PARA_TASK}을 작도하는 과정을 나타낸 것이다. 작도 순서를 바르게 나열한 것은?`, [t, a, p, m, q, L], [[t, a, p, q, m, L], [t, a, p, m, L, q], [t, m, a, p, q, L], [a, t, p, m, q, L]], {
              figure: parallelFig(false, d.pick([52, 68]), s),
              explain: `점 P를 지나는 직선을 그어 직선 ${V('l')}과의 교점을 A라 하고(${t}), 점 A를 중심으로 원을 그려 두 점 B, C를 잡는다(${a}). 점 P를 중심으로 반지름의 길이가 같은 원을 그려 점 Q를 잡고(${p}), 컴퍼스로 ${sg('BC')}의 길이를 잰 다음(${m}), 점 Q를 중심으로 하고 반지름의 길이가 ${sg('BC')}인 원을 그려 점 R를 잡는다(${q}). 마지막으로 직선 PR를 긋는다(${L}).`
            });
          }),
          T('para-claims', '평행선의 작도 그림에 대한 설명', '①11 ②11 심5 심6', (d) => {
            const alt = d.bool(), prop = alt ? '엇각' : '동위각', other = alt ? '동위각' : '엇각', eq = (x, y) => `${sg(x)} = ${sg(y)}`, rule = (w) => `「${w}의 크기가 같으면 두 직선은 평행하다.」는 성질을 이용하였다.`;
            const yes = [eq('AB', 'AC'), eq('AB', 'PQ'), eq('AC', 'PR'), eq('BC', 'QR'), '∠BAC = ∠QPR', '크기가 같은 각의 작도를 이용하였다.', rule(prop)];
            const same = `점 A와 점 P를 중심으로 반지름의 길이가 같은 원을 그렸으므로 ${sg('AB')} = ${sg('AC')} = ${sg('PQ')} = ${sg('PR')}이고, ${sg('BC')}의 길이를 옮겼으므로 ${sg('BC')} = ${sg('QR')}이다.`;
            const no = [[eq('AC', 'BC'), same + ` ${sg('BC')}의 길이는 원의 반지름의 길이와 같다고 할 수 없다.`], [eq('AB', 'QR'), same + ` ${sg('QR')}의 길이는 원의 반지름의 길이와 같다고 할 수 없다.`],
              [eq('BC', 'PQ'), same + ` ${sg('BC')}의 길이는 원의 반지름의 길이와 같다고 할 수 없다.`], [rule(other), `∠BAC와 ∠QPR는 ${prop}이다. ${prop}의 크기가 같으면 두 직선은 평행하다는 성질을 이용하였다.`, rule(prop)]];
            return withFigure(claimQ(d, `그림은 ${PARA_TASK}을 작도한 것이다. 다음 중 옳지 않은 것은?`, yes, no, false), parallelFig(alt, d.pick([52, 68]), null));
          }),
          T('para-prop', '평행선의 작도에 이용한 평행선의 성질', '①12 ①11', (d, n) => {
            // 그림에 따라 답이 달라진다: 차례 0 은 동위각 자리, 차례 1 은 엇각 자리에 각을 옮긴 그림이다.
            const alt = n === 1, prop = alt ? '엇각' : '동위각', rule = (w) => `${w}의 크기가 같으면 두 직선은 평행하다.`;
            return pickOne(d, `그림은 ${PARA_TASK}을 작도한 것이다. 이 작도에서 이용한 성질은?`, rule(prop), [rule(alt ? '동위각' : '엇각'), '맞꼭지각의 크기는 서로 같다.', '평각의 크기는 180°이다.'], {
              figure: parallelFig(alt, d.pick([52, 68]), null),
              explain: `∠BAC와 크기가 같은 ∠QPR를 작도하였다. 그림에서 ∠BAC와 ∠QPR는 ${prop}이므로 「${rule(prop)}」는 성질을 이용한 것이다.`,
              rule: alt ? 'para-alt' : 'para-corr'
            });
          }, { count: 2 })
        ]
      },
      { id: 'sides', title: '대변과 대각, 삼각형의 세 변의 길이 사이의 관계', standard: STD3, types: [] },
      { id: 'build', title: '삼각형의 작도', standard: STD3, types: [] },
      { id: 'fixed', title: '삼각형이 하나로 정해지는 조건', standard: STD3, types: [] },
      { id: 'cong', title: '도형의 합동과 합동인 도형의 성질', standard: STD4, types: [] },
      { id: 'cond', title: '삼각형의 합동 조건', standard: STD4, types: [] },
      { id: 'find', title: '그림에서 합동인 삼각형 찾기와 합동의 활용', standard: STD4, types: [] }
    ]
  });
  // ── 나. 대변과 대각, 삼각형의 세 변의 길이 사이의 관계 ──
  // 변의 이름: 꼭짓점 이름 N 에서 변 i(꼭짓점 i 의 대변)
  const sideName = (N, i) => [N[(i + 1) % 3], N[(i + 2) % 3]].sort().join('');
  const LONGEST = '삼각형에서 가장 긴 변의 길이는 나머지 두 변의 길이의 합보다 작아야 한다.';
  const validTri = (d) => d.until(() => [d.int(2, 9), d.int(3, 10), d.int(4, 13)].sort((x, y) => x - y), ([a, b, c]) => a + b > c && c > a);
  const evenTri = (d) => { const a = d.int(2, 7), b = d.int(a, 8); return [a, b, a + b]; };       // 두 변의 길이의 합이 가장 긴 변의 길이와 같다.
  const overTri = (d) => { const a = d.int(2, 6), b = d.int(a, 7); return [a, b, a + b + d.int(1, 3)]; };
  const triText = (t) => t.map(cm).join(', ');
  // 대변의 길이·대각의 크기를 읽을 삼각형: 각의 크기(세 꼭짓점)와 그림에 적을 변의 길이(자연수가 아닌 변은 적지 않는다).
  function measuredTri(d) {
    const kind = d.pick(['right', 'right', 'half', 'wide']);
    if (kind === 'right') { const [p, q, h] = d.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]), flip = d.bool(); return { angles: [null, null, 90], lens: flip ? [p, q, h] : [q, p, h], t: flip ? [[0, q], [p, 0], [0, 0]] : [[0, p], [q, 0], [0, 0]] }; }
    if (kind === 'half') { const s = d.int(3, 8); return { angles: [30, 60, 90], lens: [s, null, 2 * s], t: triASA(2, 30, 60) }; }
    const s = d.int(4, 9); return { angles: [30, 30, 120], lens: [s, s, null], t: triASA(2, 30, 30) };
  }
  const X = V('x');

  B.addTypes(UNIT, 'sides', [
    T('opp-name', '대변과 대각의 이름', '①13 ②13', (d, n) => {
      const names = d.pick([['A', 'B', 'C'], ['D', 'E', 'F'], ['P', 'Q', 'R']]), name = names.join(''), i = d.int(0, 2);
      const t = scaled(anyLaid(d, triASA(5, d.pick([48, 55, 64]), d.pick([38, 44, 72]))).q, 0.72);
      const figure = drawTri(new Pic(), t, { names }).svg(`삼각형 ${name}. 세 꼭짓점은 ${names.join(', ')}이다.`);
      const side = sg(sideName(names, i)), angle = '∠' + names[i], others = [0, 1, 2].filter((k) => k !== i);
      if (n === 0) return pickOne(d, `그림의 △${name}에서 ${angle}의 대변은?`, side, others.map((k) => sg(sideName(names, k))), { figure, explain: `대변은 한 각과 마주 보는 변이다. ${jo(angle, '과/와')} 마주 보는 변은 ${side}이다.` });
      return pickOne(d, `그림의 △${name}에서 ${side}의 대각은?`, angle, others.map((k) => '∠' + names[k]), { figure, explain: `대각은 한 변과 마주 보는 각이다. ${jo(side, '과/와')} 마주 보는 각은 ${angle}이다.` });
    }, { count: 2 }),
    T('opp-size', '대변의 길이와 대각의 크기', '①14 ②14', (d) => {
      const m = measuredTri(d), order = d.shuffle([0, 1, 2]), N3 = [];
      // 꼭짓점 order[k] 에 이름 A, B, C 를 차례로 붙인다.
      order.forEach((v, k) => { N3[v] = 'ABC'[k]; });
      // 대각을 물을 변 j(그 대각의 크기가 그림에 있다)를 먼저 고르고, 대변을 물을 각 i(그 대변의 길이가 그림에 있다)는 다른 꼭짓점에서 고른다.
      const j = d.pick([0, 1, 2].filter((v) => m.angles[v] != null)), i = d.pick([0, 1, 2].filter((v) => v !== j && m.lens[v] != null));
      const t = scaled(anyLaid(d, m.t).q, 3.7 / Math.max(...[0, 1, 2].map((v) => sideOf(m.t, v))));
      const sides = {}, texts = {}, marks = {}, said = [];
      [0, 1, 2].forEach((v) => {
        if (m.lens[v] != null) { sides[v] = cm(m.lens[v]); said.push(`변 ${sideName(N3, v)}의 길이는 ${cm(m.lens[v])}`); }
        if (m.angles[v] === 90) { marks[v] = 'right'; said.push(`∠${N3[v]}에는 직각 표시가 있다`); } else if (m.angles[v] != null) { texts[v] = m.angles[v] + '°'; said.push(`∠${N3[v]}의 크기는 ${m.angles[v]}°`); }
      });
      const figure = drawTri(new Pic(), t, { names: N3, sides, angles: texts, marks }).svg(`삼각형 ABC. ${said.join(', ')}.`);
      return M(`그림의 △ABC에서 ∠${N3[i]}의 대변의 길이와 ${sg(sideName(N3, j))}의 대각의 크기를 구하시오.`, [{ label: '대변의 길이', answer: m.lens[i], unit: 'cm' }, { label: '대각의 크기', answer: m.angles[j], unit: '°' }], {
        figure, explain: `∠${N3[i]}의 대변은 ${sg(sideName(N3, i))}이므로 그 길이는 ${cm(m.lens[i])}이다. ${sg(sideName(N3, j))}의 대각은 ∠${N3[j]}이므로 그 크기는 ${m.angles[j]}°이다.`,
        facts: { calc: [[String(m.lens[i]), 0], [String(m.angles[j]), 1]], unseen: m.angles[j] === 90 ? [90] : [] }
      });
    }),
    T('opp-claims', '삼각형 ABC에 대한 설명 가리기', '①15', (d) => {
      const yes = [`∠A의 대변은 ${sg('BC')}이다.`, `${sg('AB')}의 대각은 ∠C이다.`, '∠B와 ∠ABC는 같은 각이다.', '세 각의 크기의 합은 180°이다.', '삼각형 ABC를 기호로 △ABC와 같이 나타낸다.', `${sg('BC')}의 대각은 ∠A이다.`, `∠C의 대변은 ${sg('AB')}이다.`];
      const no = [[`∠A의 대변은 ${sg('AB')}이다.`, `∠A의 대변은 ∠A와 마주 보는 변인 ${sg('BC')}이다.`, yes[0]], [`${sg('AB')}의 대각은 ∠A이다.`, `${sg('AB')}의 대각은 ${sg('AB')}와 마주 보는 각인 ∠C이다.`, yes[1]],
        ['∠B와 ∠ABC는 서로 다른 각이다.', '∠B는 ∠ABC를 간단히 나타낸 것으로, 같은 각이다.', yes[2]], ['삼각형 ABC를 기호로 ∠ABC와 같이 나타낸다.', '삼각형 ABC는 기호로 △ABC와 같이 나타낸다. ∠ABC는 각을 나타낸다.', yes[4]],
        [`${sg('BC')}의 대각은 ∠B이다.`, `${sg('BC')}의 대각은 ${sg('BC')}와 마주 보는 각인 ∠A이다.`, yes[5]]];
      return claimQ(d, '△ABC에 대한 설명으로 옳지 않은 것은?', yes, no, false);
    }),
    T('tri-can', '삼각형의 세 변의 길이가 될 수 있는 것과 없는 것', '①16 ②15', (d, n) => {
      const key = (t) => t.join(), distinct = (rows) => new Set(rows.map(key)).size === rows.length;
      if (n === 0) {
        const bad = d.int(0, 2) ? evenTri(d) : overTri(d), rows = d.until(() => d.shuffle([validTri(d), validTri(d), d.until(() => validTri(d), ([a, b, c]) => a + b === c + 1), bad]), distinct), [a, b, c] = bad;
        return C('세 변의 길이가 다음과 같을 때, 삼각형을 만들 수 없는 것은?', rows.map(triText), rows.indexOf(bad), {
          explain: `${LONGEST} ${a} + ${b} ${a + b === c ? '=' : '&lt;'} ${c}이므로 세 변의 길이가 ${triText(bad)}인 삼각형은 만들 수 없다.`,
          facts: { only: { values: rows.map(([x, y, z]) => z - (x + y)), test: 'atLeast', target: 0 } }
        });
      }
      const good = validTri(d), rows = d.until(() => d.shuffle([good, evenTri(d), overTri(d), evenTri(d)]), distinct), [a, b, c] = good;
      return C('세 변의 길이가 다음과 같을 때, 삼각형을 만들 수 있는 것은?', rows.map(triText), rows.indexOf(good), {
        explain: `${LONGEST} ${a} + ${b} &gt; ${c}이므로 세 변의 길이가 ${triText(good)}인 삼각형은 만들 수 있다. 나머지는 가장 긴 변의 길이가 나머지 두 변의 길이의 합과 같거나 그보다 크다.`,
        facts: { only: { values: rows.map(([x, y, z]) => x + y - z), test: 'atLeast', target: 1 } }
      });
    }, { count: 2 }),
    T('tri-four', '막대 넷 가운데 셋으로 만들 수 있는 삼각형의 개수', '①17 ②17', (d) => {
      const pick3 = (s) => [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]].map((ix) => ix.map((i) => s[i])), ok = ([a, b, c]) => a + b > c;
      const s = d.until(() => d.shuffle([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 4).sort((x, y) => x - y), (x) => { const k = pick3(x).filter(ok).length; return k >= 2 && k <= 3 && pick3(x).some(([a, b, c]) => a + b === c); });
      const sets = pick3(s), flags = sets.map(ok), k = flags.filter(Boolean).length, show = (t) => `(${t.join(', ')})`, even = sets.filter(([a, b, c]) => a + b === c);
      return N(`길이가 ${s.map(cm).join(', ')}인 막대가 하나씩 있다. 이 가운데 3개를 골라 만들 수 있는 삼각형은 모두 몇 개인가?`, k, {
        unit: '개', explain: `막대 3개를 고르는 방법은 ${sets.map(show).join(', ')}의 4가지이다. ${LONGEST} 삼각형을 만들 수 있는 것은 ${sets.filter(ok).map(show).join(', ')}의 ${k}개이다. ${even.map((t) => `${show(t)}은 ${t[0]} + ${t[1]} = ${t[2]}`).join(', ')}이므로 삼각형이 되지 않는다.`,
        facts: { count: flags }
      });
    }),
    T('tri-x-ends', '나머지 한 변의 길이가 될 수 있는 가장 작은 자연수와 가장 큰 자연수', '①18', (d) => {
      const a = d.int(3, 7), b = a + d.int(1, 6), lo = b - a + 1, hi = a + b - 1;
      return M(`삼각형의 세 변의 길이가 ${cm(a)}, ${cm(b)}, ${X} cm일 때, ${X}의 값이 될 수 있는 자연수 가운데 가장 작은 수와 가장 큰 수를 구하시오.`, [{ label: '가장 작은 수', answer: lo }, { label: '가장 큰 수', answer: hi }], {
        explain: `${LONGEST} ${X} = ${lo - 1}이면 ${a} + ${lo - 1} = ${b}이므로 삼각형이 되지 않고, ${X} = ${lo}이면 ${a} + ${lo} &gt; ${b}이므로 삼각형이 된다. ${X} = ${hi}이면 ${hi} &lt; ${a} + ${b}이므로 삼각형이 되고, ${X} = ${hi + 1}이면 ${a} + ${b} = ${hi + 1}이므로 삼각형이 되지 않는다.`,
        facts: { calc: [[`${b}-${a}+1`, 0], [`${a}+${b}-1`, 1]], unseen: [1] }
      });
    }),
    T('tri-x-count', '나머지 한 변의 길이가 될 수 있는 자연수의 개수', '①19 ②16 심10', (d) => {
      const a = d.int(3, 7), b = a + d.int(1, 6), lo = b - a + 1, hi = a + b - 1;
      return N(`삼각형의 세 변의 길이가 ${cm(a)}, ${cm(b)}, ${X} cm일 때, ${X}의 값이 될 수 있는 자연수는 모두 몇 개인가?`, hi - lo + 1, {
        unit: '개', explain: `${X} cm인 변이 가장 길면 ${X} &lt; ${a} + ${b}이어야 하고, ${cm(b)}인 변이 가장 길면 ${b} &lt; ${a} + ${X}이어야 한다. 자연수를 넣어 보면 ${X}의 값이 될 수 있는 수는 ${lo}부터 ${hi}까지의 ${hi - lo + 1}개이다.`,
        facts: { digit: { template: `${b}-${a}<□<${a}+${b}`, lo: 1, hi: a + b + 3, ask: 'count' } }
      });
    }),
    T('tri-x-pick', '나머지 한 변의 길이가 될 수 있는 값 고르기', '②16 심9', (d) => {
      // 틀린 보기에 두 변의 길이의 차(합과 같아지는 길이)와 합을 넣는다.
      const a = d.int(3, 7), b = a + d.int(2, 6), good = d.int(b - a + 1, a + b - 1), rows = [b - a, good, a + b, d.bool() ? a + b + d.int(1, 3) : b - a - 1].sort((x, y) => x - y);
      return C(`삼각형의 세 변의 길이가 ${cm(a)}, ${cm(b)}, ${X} cm일 때, 다음 중 ${X}의 값이 될 수 있는 것은?`, rows.map(String), rows.indexOf(good), {
        explain: `${LONGEST} ${X} = ${good}이면 가장 긴 변의 길이가 나머지 두 변의 길이의 합보다 작으므로 삼각형이 된다. ${X} = ${b - a}이면 ${a} + ${b - a} = ${b}, ${X} = ${a + b}이면 ${a} + ${b} = ${a + b}이므로 삼각형이 되지 않는다.`,
        facts: { between: { low: `${b}-${a}`, high: `${a}+${b}`, exprs: rows.map(String) } }
      });
    })
  ]);

  // ── 다. 삼각형의 작도 ──
  const Va = V('a'), Vb = V('b'), Vc = V('c'), Vl = V('l');
  const perms3 = (x) => [[x[0], x[1], x[2]], [x[0], x[2], x[1]], [x[1], x[0], x[2]], [x[1], x[2], x[0]], [x[2], x[0], x[1]], [x[2], x[1], x[0]]];
  B.addTypes(UNIT, 'build', [
    T('sss-blank', '세 변의 길이가 주어진 삼각형의 작도 과정의 빈칸', '①21 ②19', (d) => {
      const s = SYM.slice(0, 4), rows = [`직선 ${Vl}을 긋고, 그 위에 길이가 ${Va}인 선분 BC를 작도한다.`, '점 B를 중심으로 하고 반지름의 길이가 ㈎인 원을 그린다.', `점 C를 중심으로 하고 반지름의 길이가 ㈏인 원을 그려 ${s[1]}의 원과의 교점을 A라 한다.`, '선분 AB, 선분 AC를 긋는다.'];
      return pickOne(d, `그림은 세 변의 길이 ${Va}, ${Vb}, ${Vc}가 주어졌을 때 △ABC를 작도한 것이다. 다음 작도 과정의 ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, `${Vc}, ${Vb}`, [`${Vb}, ${Vc}`, `${Va}, ${Vb}`, `${Va}, ${Vc}`], {
        figure: sssFig(null) + tagged(rows, s), explain: `그림에서 ${sg('AB')}의 길이가 ${Vc}이므로 점 B를 중심으로 하는 원의 반지름의 길이는 ${Vc}이고, ${sg('AC')}의 길이가 ${Vb}이므로 점 C를 중심으로 하는 원의 반지름의 길이는 ${Vb}이다.`
      });
    }),
    T('sss-order', '세 변의 길이가 주어진 삼각형의 작도: 그림의 기호로 쓴 차례', '①22 ②18', (d) => {
      const s = d.shuffle(SYM.slice(0, 3)), right = seq(s);
      return pickOne(d, `그림은 세 변의 길이 ${Va}, ${Vb}, ${Vc}가 주어졌을 때 직선 ${Vl} 위에 △ABC를 작도하는 과정을 나타낸 것이다. 작도 순서를 바르게 나열한 것은?`, right, d.shuffle(perms3(s).map(seq).filter((x) => x !== right)).slice(0, 3), {
        figure: sssFig(s), explain: `직선 ${Vl} 위에 길이가 ${Va}인 선분 BC를 작도하고(${s[0]}), 두 점 B, C를 중심으로 하고 반지름의 길이가 각각 ${Vc}, ${Vb}인 원을 그려 교점 A를 잡은 다음(${s[1]}), 선분 AB, AC를 긋는다(${s[2]}).`
      });
    }),
    T('sss-equi', '정삼각형의 작도 과정의 차례', '심12', (d) => {
      const tags = d.shuffle(SYM.slice(0, 4)), [L, Bc, Cc, S] = tags;
      const body = { [L]: `직선을 긋고, 그 위에 길이가 ${Va}인 선분 BC를 작도한다.`, [Bc]: `점 B를 중심으로 하고 반지름의 길이가 ${Va}인 원을 그린다.`, [Cc]: `점 C를 중심으로 하고 반지름의 길이가 ${Va}인 원을 그려 ${Bc}의 원과의 교점을 A라 한다.`, [S]: '선분 AB, 선분 AC를 긋는다.' };
      return orderQ(d, `다음은 한 변의 길이가 ${Va}인 정삼각형 ABC를 작도하는 과정이다. 작도 순서를 바르게 나열한 것은?`, [L, Bc, Cc, S], [[L, Cc, Bc, S], [Bc, L, Cc, S], [L, Bc, S, Cc], [S, L, Bc, Cc], [Bc, Cc, L, S]], {
        figure: tagged(SYM.slice(0, 4).map((s) => body[s]), SYM),
        explain: `정삼각형은 세 변의 길이가 모두 ${Va}인 삼각형이므로 세 변의 길이가 주어진 삼각형의 작도와 같다. 선분 BC를 작도하고(${L}), 점 B를 중심으로 하는 원(${Bc})과 점 C를 중심으로 하는 원(${Cc})의 교점 A를 잡은 다음, 선분 AB, AC를 긋는다(${S}).`
      });
    }),
    T('sas-order-fig', '두 변의 길이와 그 끼인각의 크기가 주어진 삼각형의 작도: 그림의 기호로 쓴 차례', '①23 ②20 ②23', (d) => {
      // 각을 먼저 옮기고 두 변을 어느 쪽부터 잡아도 되므로, 선분 BC 를 처음에 작도한 것으로 주고 나머지 셋의 차례를 묻는다.
      const s = d.shuffle(SYM.slice(0, 4)), [bc, ang, arcA, ac] = s, right = [ang, arcA, ac].join(', ');
      return pickOne(d, `그림은 두 변의 길이 ${Va}, ${Vc}와 그 끼인각 ∠B의 크기가 주어졌을 때 △ABC를 작도하는 과정을 나타낸 것이다. 작도 순서가 ${seq([bc, '㈎', '㈏', '㈐'])}일 때, ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`,
        right, d.shuffle(perms3([ang, arcA, ac]).map((x) => x.join(', ')).filter((x) => x !== right)).slice(0, 3), {
          figure: sasFig(d.pick([50, 57, 64]), s),
          explain: `길이가 ${Va}인 선분 BC를 작도한 다음(${bc}), 반직선 BC를 한 변으로 하고 ∠B와 크기가 같은 각을 작도한다(${ang}). 점 B를 중심으로 하고 반지름의 길이가 ${Vc}인 원을 그려 각의 변과의 교점을 A라 하고(${arcA}), 선분 AC를 긋는다(${ac}).`
        });
    }),
    T('order-names', '요소의 이름으로 쓴 작도 순서에서 옳지 않은 것', '①24 ①27 ②21 심13 심14', (d, n) => {
      const N3 = ['A', 'B', 'C'], v = d.int(0, 2), [u, w] = [0, 1, 2].filter((k) => k !== v);
      if (n === 0) {
        // 끼인각이 ∠v 인 두 변: 꼭짓점 v 를 지나는 두 변(변 u, 변 w)
        const Xs = sg(sideName(N3, w)), Ys = sg(sideName(N3, u)), Z = '∠' + N3[v], bad = d.pick([[Xs, Ys, Z], [Ys, Xs, Z]]);
        return pickOne(d, `${Xs}, ${Ys}의 길이와 그 끼인각 ${Z}의 크기가 주어졌을 때, △ABC를 작도하는 순서로 옳지 않은 것은?`, seq(bad), d.shuffle([[Z, Xs, Ys], [Z, Ys, Xs], [Xs, Z, Ys], [Ys, Z, Xs]]).slice(0, 3).map(seq), {
          explain: `두 변을 먼저 이어서 작도하면 두 변이 벌어진 정도가 정해져 버리므로 ${jo(Z, '을/를')} 옮길 수 없다. ${jo(Z, '은/는')} 맨 처음에 작도하거나, 한 변을 작도한 다음에 작도한다.`
        });
      }
      // 변 v 와 그 양 끝 각 ∠u, ∠w
      const Xs = sg(sideName(N3, v)), Y = '∠' + N3[u], Z = '∠' + N3[w], bad = d.pick([[Y, Z, Xs], [Z, Y, Xs]]);
      return pickOne(d, `${Xs}의 길이와 그 양 끝 각 ${Y}, ${Z}의 크기가 주어졌을 때, △ABC를 작도하는 순서로 옳지 않은 것은?`, seq(bad), d.shuffle([[Xs, Y, Z], [Xs, Z, Y], [Y, Xs, Z], [Z, Xs, Y]]).slice(0, 3).map(seq), {
        explain: `두 각은 ${Xs}의 양 끝에 있어야 한다. 두 각을 먼저 작도하면 그 사이에 ${jo(Xs, '을/를')} 놓을 수 없다. 한 각을 작도하였으면 ${jo(Xs, '을/를')} 작도한 다음에 다른 각을 작도한다.`
      });
    }, { count: 2 }),
    T('sas-last', '두 변의 길이와 그 끼인각의 크기가 주어진 삼각형의 작도에서 마지막에 하는 일', '①25', (d) => {
      const N3 = ['A', 'B', 'C'], v = d.int(0, 2), [u, w] = [0, 1, 2].filter((k) => k !== v), Xs = sg(sideName(N3, w)), Ys = sg(sideName(N3, u)), Z = '∠' + N3[v], last = sg(sideName(N3, v));
      return pickOne(d, `${Xs}, ${Ys}의 길이와 그 끼인각 ${Z}의 크기가 주어졌을 때, △ABC를 작도하는 과정에서 가장 마지막에 하는 것은?`, `${jo(last, '을/를')} 긋는다.`, [`${jo(Xs, '을/를')} 작도한다.`, `${jo(Ys, '을/를')} 작도한다.`, `${jo(Z, '을/를')} 작도한다.`], {
        explain: `${jo(Z, '과/와')} 두 변 ${Xs}, ${jo(Ys, '을/를')} 작도하면 세 꼭짓점이 모두 정해진다. 마지막으로 나머지 두 꼭짓점을 이어 ${jo(last, '을/를')} 그으면 △ABC가 된다.`
      });
    }),
    T('build-basic', '삼각형의 작도에 이용하는 작도', '①26', (d, n) => {
      const rows = d.shuffle([['길이가 같은 선분의 작도', true], ['크기가 같은 각의 작도', n === 1], ['평행선의 작도', false]]);
      const given = n === 0 ? '세 변의 길이가' : d.bool() ? '두 변의 길이와 그 끼인각의 크기가' : '한 변의 길이와 그 양 끝 각의 크기가';
      return allQ(d, `${given} 주어졌을 때 삼각형을 작도하는 과정에서 이용하는 작도를 모두 고른 것은?`, SYM, rows.map((r) => r[1]), {
        figure: tagged(rows.map((r) => r[0]), SYM),
        explain: n === 0 ? '세 변의 길이를 컴퍼스로 옮겨 그리므로 길이가 같은 선분의 작도만 이용한다. 각을 옮기지 않는다.' : '변의 길이를 옮길 때는 길이가 같은 선분의 작도를, 각의 크기를 옮길 때는 크기가 같은 각의 작도를 이용한다.'
      });
    }, { count: 2 }),
    T('asa-blank', '한 변의 길이와 그 양 끝 각의 크기가 주어진 삼각형의 작도 과정의 빈칸', '②22 ②23', (d) => {
      const s = SYM.slice(0, 4), rows = [`직선 ${Vl}을 긋고, 그 위에 길이가 ${Va}인 선분 BC를 작도한다.`, '반직선 BC를 한 변으로 하고 ∠B와 크기가 같은 ㈎를 작도한다.', '반직선 CB를 한 변으로 하고 ∠C와 크기가 같은 ∠QCB를 작도한다.', '반직선 BP와 반직선 ㈏의 교점을 A라 한다.'];
      return pickOne(d, `그림은 한 변의 길이 ${Va}와 그 양 끝 각 ∠B, ∠C의 크기가 주어졌을 때 △ABC를 작도한 것이다. 다음 작도 과정의 ㈎, ㈏에 알맞은 것을 차례로 나열한 것은?`, '∠PBC, CQ', ['∠PBC, BC', '∠PCB, CQ', '∠BPC, BC'], {
        figure: asaFig(d.pick([42, 48, 55]), d.pick([58, 64, 70])) + tagged(rows, s),
        explain: '점 B에서 반직선 BC를 한 변으로 하는 ∠PBC를, 점 C에서 반직선 CB를 한 변으로 하는 ∠QCB를 작도한다. 두 각의 다른 변인 반직선 BP와 반직선 CQ가 만나는 점이 A이다.'
      });
    })
  ]);

  // 같은 단원의 다른 파일(7-2-2b.js, 7-2-2c.js)이 함께 쓰는 것
  B.kit.m722 = {
    UNIT, STD3, STD4, T, SYM, BLK, sg, cm, seq, jo, pickOne, allQ, bits, withFigure, orderQ, RAD, f1, add, sub, mul, dist, lerp, polar, dirDeg, turn, mean, boxOf, meet, whole,
    triSAS, triASA, triSSS, sideOf, angleOf, laid, putAt, scaled, anyLaid, Pic, gridFig, drawTri, shape, sideName, LONGEST, validTri, evenTri, overTri, triText, perms3
  };
})(typeof window !== 'undefined' ? window : globalThis);
