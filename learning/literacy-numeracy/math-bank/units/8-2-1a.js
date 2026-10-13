// 중학교 2학년 2학기 1단원 삼각형의 성질 — 단원 틀·그림 도구와 앞쪽 묶음
// (이등변삼각형의 성질, 이등변삼각형이 되는 조건, 직각삼각형의 합동 조건, 각의 이등분선의 성질).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 77꼴, 기본꼴 2: 72꼴, 심화꼴: 62꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/8-2-1/싣기_대조표.md 에 있다.
// (외심·내심 쪽 묶음은 8-2-1b.js 에, 실력 문항은 8-2-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-09(이등변삼각형의 성질을 이해하고 정당화할 수 있다), 9수03-10(삼각형의 외심과 내심의 성질을 이해하고 정당화할 수 있다)이다.
// 직각삼각형의 합동 조건과 각의 이등분선의 성질은 교과서가 이등변삼각형 다음, 외심·내심 앞에 두므로 9수03-09 에 넣었다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(각·길이·같다는 표시), 묻는 것(각·길이·넓이·합동 조건·옳은 식), 푸는 길(성질을 바로 대기 / 이등변삼각형을 찾아내기 / 합동으로 길이·각 옮기기)이 다르면 따로 싣는다.
//    그림의 수만 바꾼 것, 같은 그림에서 글자만 바꾼 것은 한 유형이다.
//  - 그림은 수치대로 그린다. 코드가 각과 길이에서 좌표를 셈해 그리므로 그림과 답이 어긋나지 않는다. 묻는 각·길이는 그림에 x 로만 적는다.
//    같은 길이(짧은 금), 같은 각(●·×), 직각(네모), 평행(화살촉)은 그림에 표시하고 그림 설명(aria-label)에도 말로 적는다.
//  - 답: 각도는 「□°」, 길이는 「□ cm」, 넓이는 「□ cm²」로 받는다. 길이가 분수이면 분수 칸으로 받는다. 합동 조건·옳은 식·설명의 빈칸은 고르기로 받는다.
//  - 교육과정의 금: 「정확한 용어와 기호의 사용, 복잡한 형식 논리 규칙의 이용을 요구하는 연역적 정당화 문제는 다루지 않는다」「증명을 할 때, ‘가정’, ‘결론’ 용어는 다루지 않는다」.
//    증명을 처음부터 쓰게 하는 꼴은 싣지 않고, 교과서 본문에 실린 설명의 빈칸만 고르기로 실었다. 「가정」「결론」이라는 말은 쓰지 않는다.
//  - 중1에서 한 일은 다시 싣지 않는다: 이등변삼각형의 꼭지각의 외각으로 밑각 구하기(7-2-3 tri-iso-ext), 이등변삼각형 두 겹·세 겹에 외각을 거듭 쓰기(7-2-3 hard-iso-chain),
//    정다각형의 대각선이 이루는 각(7-2-3 hard-reg-diagonal), 정사각형 안의 정삼각형·한 직선 위의 두 정삼각형(7-2-2 hard-square-tri·hard-equi-line), 수직이등분선 위의 점(7-2-2 find-bisector).
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다. 내접원의 수치는 실제로 그려지는 삼각형(세 변과 넓이가 맞는 것)만 쓴다.
//
// 뺀 것과 까닭(8-2-1b.js, 8-2-1c.js 의 것까지 여기에 모아 적는다)
//  - 중1 단원에 이미 실린 것: 이등변삼각형 두 겹과 외각(①9 ②5 심8 — 7-2-3 hard-iso-chain), 꼭지각의 외각으로 밑각(①3·②2 가운데 꼭지각의 외각 꼴 — 7-2-3 tri-iso-ext), 정오각형의 대각선(②9 — 7-2-3 hard-reg-diagonal),
//    정사각형 안의 정삼각형(①15 — 7-2-2 hard-square-tri), 한 직선 위의 두 정삼각형(심17 — 7-2-2 hard-equi-line).
//  - 증명 전체를 쓰게 하는 것: ①27·①33의 서술(빈칸 고르기로 바꾸어 실었다).
//  - 이 단원의 범위 밖이거나 과제 글이 금으로 정한 것: 이등변삼각형 다섯 겹(심9), 외심의 외심(①60 심44), 연장선을 둘 그어야 하는 사다리꼴(①43), 방심·수심 꼴(심32·33),
//    원 밖의 점에서 그은 두 접선과 내심(심62), 외접원의 호의 비·내접원의 호의 길이(심41·54 — 중1의 호와 중심각 셈이 주가 된다), 두 삼각형의 내심과 연장선의 교점(심51), 내심의 내심(②60의 변형).
//  - 답이 문자식이거나 문자로만 좇는 것: 이등변삼각형에 끼운 정삼각형(심15), 둘레와 넓이의 비(심56).
//  - 쪽 그림에서도 그림을 알 수 없는 것: 돌려 놓은 삼각형과 평행선(심20), RHS 합동과 넓이·비(심27), 외심과 두 각으로 각의 차(심42), 한 삼각형의 외심과 내심의 ∠x(②72),
//    직사각형을 접은 x + y(②11의 변형), 김화경 문서의 그림 문제(그림도 답도 없다).
//  - 보조선과 연립이 겹치는 것: 사각형 안 두 각의 이등분선(심31 — 원문 글에 정사각형 조건도 빠져 있다).
//  - 뜻 없는 셈(따로 구한 두 값을 더하고 빼기): ∠x + ∠y·x + y(①18·38·64·65의 변형), ∠x − ∠y(①52의 변형) — 값을 따로 묻는 것으로 바꾸어 실었다.
//  - 같은 일이어서 한 번만 실은 것은 대조표에 「겹침」으로 적었다(밑각의 삼등분선과 외각의 이등분선 ②8, 내심을 지나는 평행선의 참·거짓 심48, 외접원과 내접원의 둘레 심60).
//  - 그림을 고쳐 가며 수의 범위를 좁힌 곳: 외심이 변에 붙지 않게 가장 큰 내각을 76°까지로(각의 비 2 : 3 : 4 는 80°가 되어 뺐다), 내심과 높이 사이의 각은 16° 이상으로.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 각도는 수에 붙여 적고(56°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, josa, N, M, C, F } = B.kit;
  const { V, nb, SG } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, TINT, WHITE, CLEAR, Board, textW } = B.kit.mgeo;
  const UNIT = '8-2-1', ISO = '9수03-09', CEN = '9수03-10';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const X = V('x'), SYM = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'];
  const sg = SG, deg = (v) => v + '°', cm = (v) => v + ' cm';
  const eq = (p, q) => nb(`${sg(p)} = ${sg(q)}`);
  // 알파벳·기호로 끝나는 말 뒤의 토씨. L·M·N·R 는 받침이 있고(엘·엠·엔·알), ㉠~㉥ 은 기역·니은…으로 읽어 받침이 있다.
  function jo(word, pair) {
    const last = String(word).replace(/<[^>]+>/g, '').slice(-1), [a, b] = pair.split('/'), bat = /[LMNRlmn㉠-㉭]/.test(last);
    if (a === '으로') return word + (bat && !/[LlR㉣]/.test(last) ? '으로' : '로');
    return word + (bat ? a : b);
  }

  // ── 답 ──
  const degQ = (text, v, o) => N(text, v, Object.assign({ unit: '°' }, o));
  const cmQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm' }, o));
  const cm2Q = (text, v, o) => N(text, v, Object.assign({ unit: 'cm²' }, o));
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // 분수인 길이·넓이(기약분수가 아니어도 받는다). 틀리면 「24/5 cm」처럼 보인다.
  const fracQ = (text, p, q, unit, o) => { const g = gcd(p, q); return F(text, p / g, q / g, Object.assign({ improper: p > q, anyForm: true, unit }, o)); };
  // π가 드는 길이·넓이: 칸 뒤에 π와 단위를 붙여 계수만 받는다.
  const piQ = (text, k, unit, o) => Object.assign(N(text, k, Object.assign({}, o, { unit: 'π ' + unit })), { shown: `${k}π ${unit}` });
  // 고르기: 맞는 보기 하나와 틀린 보기들을 섞는다.
  function pickOne(d, text, right, wrongs, o) {
    const opt = o || {}, rows = d.shuffle([[right, true]].concat(wrongs.map((w) => [w, false]))), hit = rows.findIndex((r) => r[1]);
    return C(text, rows.map((r) => r[0]), hit, { figure: opt.figure, explain: opt.explain, facts: Object.assign({ truth: rows.map((r) => r[1]), want: true }, opt.rule ? { rule: opt.rule } : {}) });
  }
  // 「모두 고른 것」: flags 가 참인 줄의 기호가 정답이다. 틀린 보기는 정답과 한 줄, 두 줄 다른 묶음에서 고른다.
  const bits = (m) => { let n = 0; for (let x = m; x; x >>= 1) n += x & 1; return n; };
  function allQ(d, text, tags, flags, o) {
    const n = flags.length, key = (m) => tags.filter((_, i) => m & (1 << i)).join(', '), right = flags.reduce((m, f, i) => m | (f ? 1 << i : 0), 0), pool = [];
    for (let m = 1; m < (1 << n); m += 1) if (m !== right) pool.push(m);
    const wrong = d.shuffle(pool.filter((m) => bits(m ^ right) === 1)).concat(d.shuffle(pool.filter((m) => bits(m ^ right) === 2))).slice(0, 3);
    return pickOne(d, text, key(right), wrong.map(key), o);
  }
  // 문장·식 가리기. yes: 옳은 것들, no: [틀린 것, 바로잡은 말, 함께 싣지 않을 옳은 것(들)]. wantTrue: 옳은 것을 고르는가.
  // (뜻이 맞서는 둘이 한 문항에 나오면 답이 드러나므로 함께 싣지 않는다.)
  function sayQ(d, text, yes, no, wantTrue, figure) {
    const bad = d.shuffle(no).slice(0, wantTrue ? 3 : 1), clash = bad.reduce((all, s) => all.concat(s[2] || []), []);
    const good = d.shuffle(yes.filter((s) => !clash.includes(s))).slice(0, wantTrue ? 1 : 3);
    const rows = d.shuffle(good.map((s) => [s, true, '']).concat(bad.map((s) => [s[0], false, s[1]]))), hit = rows.findIndex((r) => r[1] === wantTrue);
    return C(text, rows.map((r) => r[0]), hit, { figure, explain: wantTrue ? rows.filter((r) => !r[1]).map((r) => r[2]).filter((s, i, all) => all.indexOf(s) === i).join(' ') : rows[hit][2], facts: { truth: rows.map((r) => r[1]), want: wantTrue } });
  }
  // 이름표를 붙인 줄(㉠ …)
  const tagged = (rows, tags) => lines(rows.map((h, i) => '<span class="mb-tag mb-tag-short">' + (tags || SYM)[i] + '</span>' + h));

  // ── 셈(화면 좌표: y 는 아래로 커진다. 각은 오른쪽이 0°이고 시계 반대쪽으로 커진다) ──
  // 점 p 에서 직선 ab 에 내린 수선의 발
  const foot = (p, a, b) => { const ux = b[0] - a[0], uy = b[1] - a[1], t = ((p[0] - a[0]) * ux + (p[1] - a[1]) * uy) / (ux * ux + uy * uy); return [a[0] + ux * t, a[1] + uy * t]; };
  // 점 p 를 직선 ab 에 대하여 접은 자리
  const refl = (p, a, b) => { const f = foot(p, a, b); return [2 * f[0] - p[0], 2 * f[1] - p[1]]; };
  // 점 p 에서 q 쪽으로 len 만큼 간 점
  const along = (p, q, len) => { const L = dist(p, q); return [p[0] + (q[0] - p[0]) * len / L, p[1] + (q[1] - p[1]) * len / L]; };
  // a° 에서 b° 로 가는 가장 짧은 돌림(−180 ~ 180), 꼭짓점 v 에서 p 쪽과 q 쪽 사이 한가운데 방향
  const turn = (a, b) => ((b - a + 540) % 360) - 180;
  const midDir = (v, p, q) => { const a = dirOf(v, p); return a + turn(a, dirOf(v, q)) / 2; };
  // ∠pvq 의 크기(도)
  const angleAt = (v, p, q) => Math.abs(turn(dirOf(v, p), dirOf(v, q)));
  // 선분 pq 의 수직이등분선 위의 다른 한 점
  const perpAt = (m, p, q) => [m[0] + (q[1] - p[1]), m[1] - (q[0] - p[0])];
  const circumOf = (a, b, c) => { const m1 = mid(a, b), m2 = mid(b, c); return meet(m1, perpAt(m1, a, b), m2, perpAt(m2, b, c)); };
  const inOf = (a, b, c) => { const la = dist(b, c), lb = dist(c, a), lc = dist(a, b), s = la + lb + lc; return [(la * a[0] + lb * b[0] + lc * c[0]) / s, (la * a[1] + lb * b[1] + lc * c[1]) / s]; };
  // 밑변 BC 가 가로로 놓인 삼각형 ABC(∠B, ∠C 의 크기로). 꼭짓점 A 가 위에 온다.
  const baseTri = (bDeg, cDeg, L) => { const pB = [0, 0], pC = [L || 100, 0]; return { A: meet(pB, at(pB, 10, bDeg), pC, at(pC, 10, 180 - cDeg)), B: pB, C: pC }; };
  // AB = AC 인 이등변삼각형(꼭지각의 크기로)
  const isoTri = (apex) => baseTri(90 - apex / 2, 90 - apex / 2);
  // 세 변의 길이로(a = BC, b = CA, c = AB)
  const sssTri = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a), y = Math.sqrt(Math.max(c * c - x * x, 0)); return { A: [x, -y], B: [0, 0], C: [a, 0] }; };
  // 점들을 [가로, 세로] 안에 꼭 맞게 키운다(모양은 그대로). 돌려주는 것에 배율 k 가 붙는다.
  function fitPts(P, size) {
    const all = Object.values(P), xs = all.map((p) => p[0]), ys = all.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys);
    const k = Math.min(size[0] / (Math.max(...xs) - x0 || 1), size[1] / (Math.max(...ys) - y0 || 1)), out = {};
    for (const key of Object.keys(P)) out[key] = [(P[key][0] - x0) * k, (P[key][1] - y0) * k];
    Object.defineProperty(out, 'k', { value: k, enumerable: false });
    return out;
  }
  // 점들을 c 를 중심으로 a° 만큼 돌린다(시계 반대쪽).
  const spin = (P, a, c) => { const o = c || [0, 0], out = {}; for (const key of Object.keys(P)) { const r = dist(o, P[key]); out[key] = r < 1e-9 ? o.slice() : at(o, r, dirOf(o, P[key]) + a); } return out; };

  // ── 그림 ──
  // 이름 붙은 점들 P({ A: [x, y], … })로 그림을 짓는다. 선분·각은 점 이름으로 적는다: seg('AB CD'), ang('ABC', 글)은 꼭짓점 B 의 각.
  // 그은 선분을 기억해 두었다가 names() 가 점마다 선이 가장 성긴 쪽에 이름을 적는다(이름이 한 글자 대문자인 점만). over: { D: 270 } 방향을 정해 주거나 { D: null } 적지 않는다, { D: [방향, 거리] }, { O: 'AB' } 두 점 사이.
  function scene(P, board) {
    const b = board || Board(), segs = [], S = { b, P };
    const each = (names, f) => { for (const pair of names.split(' ')) f(P[pair[0]], P[pair[1]]); return S; };
    S.poly = (names, css) => { const list = names.split('').map((n) => P[n]); b.poly(list, css); list.forEach((p, i) => segs.push([p, list[(i + 1) % list.length]])); return S; };
    S.seg = (names, kind) => each(names, (p, q) => { b.seg(p, q, kind); segs.push([p, q]); });
    // 길이가 같다는 표시. t: 선분을 따라간 자리(주지 않으면 한가운데)
    S.tick = (names, n, t) => each(names, (p, q) => b.tick(p, t == null ? q : mid(p, q, 2 * t), n));
    S.arrow = (names, t) => each(names, (p, q) => b.arrow(p, q, t));
    S.ang = (name, label, o) => { b.corner(P[name[1]], P[name[0]], P[name[2]], label, o); return S; };
    // 직각 표시(네모)
    S.right = (names) => { for (const n of names.split(' ')) b.corner(P[n[1]], P[n[0]], P[n[2]]); return S; };
    // 크기가 같은 각의 표시(● 또는 ×)
    S.same = (names, kind, far) => { for (const n of names.split(' ')) b.sym(P[n[1]], midDir(P[n[1]], P[n[0]], P[n[2]]), kind, far); return S; };
    S.len = (pair, label, inside, o) => { b.beside(P[pair[0]], P[pair[1]], label, typeof inside === 'string' ? P[inside] : inside, o); return S; };
    S.dim = (pair, label, inside, off) => { b.dim(P[pair[0]], P[pair[1]], label, typeof inside === 'string' ? P[inside] : inside, off); return S; };
    S.dot = (names) => { for (const n of names) b.dot(P[n]); return S; };
    S.names = (over) => {
      const set = over || {};
      for (const n of Object.keys(P)) {
        if (!/^[A-Z]$/.test(n) || set[n] === null) continue;
        const p = P[n];
        if (typeof set[n] === 'number') { b.name(p, n, set[n]); continue; }
        if (Array.isArray(set[n])) { b.name(p, n, set[n][0], set[n][1]); continue; }
        // 'AB': 점 A 쪽과 점 B 쪽 사이의 한가운데에 적는다. 'AB|BC': 그 가운데 더 넓게 벌어진 쪽
        if (typeof set[n] === 'string') { const best = set[n].split('|').sort((x, y) => angleAt(p, P[y[0]], P[y[1]]) - angleAt(p, P[x[0]], P[x[1]]))[0]; b.name(p, n, midDir(p, P[best[0]], P[best[1]]), 12); continue; }
        const dirs = [];
        for (const [u, w] of segs) {
          if (dist(p, u) < 0.6) dirs.push(dirOf(p, w));
          else if (dist(p, w) < 0.6) dirs.push(dirOf(p, u));
          else if (dist(p, foot(p, u, w)) < 0.6 && dist(p, u) + dist(p, w) < dist(u, w) + 0.6) dirs.push(dirOf(p, u), dirOf(p, w));
        }
        if (dirs.length) b.nameFree(p, n, dirs); else b.name(p, n, 90);
      }
      return S;
    };
    S.clash = () => b.clash();
    S.svg = (label) => b.svg(label);
    return S;
  }
  // x에 대한 식 kx + c: 그림 속 글, 그림 설명, 문제 글. unit 은 '°' 또는 ''(길이).
  const kx = (k) => (k === 1 ? '' : String(k));
  const exSvg = (k, c, unit) => (c === 0 ? `${kx(k)}${sv('x')}${unit}` : `(${kx(k)}${sv('x')}${c > 0 ? '+' : '−'}${Math.abs(c)})${unit}`);
  const exSay = (k, c, unit) => (c === 0 ? `${kx(k)}x${unit}` : `(${kx(k)}x ${c > 0 ? '+' : '−'} ${Math.abs(c)})${unit}`);
  const exHtml = (k, c, unit) => nb(c === 0 ? `${kx(k)}${X}${unit}` : `(${kx(k)}${X} ${c > 0 ? '+' : '−'} ${Math.abs(c)})${unit}`);

  // AB = AC 인 이등변삼각형 ABC 의 그림(꼭지각 a). more: 덧붙일 점을 짓는 함수(P → { 이름: 점 }), size: [가로, 세로]
  const isoPts = (a, more, size) => { const base = isoTri(a); return fitPts(Object.assign({}, base, more ? more(base) : {}), size || (a >= 100 ? [220, 110] : a >= 70 ? [190, 125] : [150, 150])); };
  const isoScene = (a, more, size, t) => scene(isoPts(a, more, size)).poly('BCA').tick('AB AC', 1, t);
  const ISO_SAY = '삼각형 ABC. 변 AB와 변 AC에 길이가 같다는 표시가 있다. ';

  // 폭이 일정한 종이 띠를 접은 그림. th: 접는 선 BC 와 띠의 변이 이루는 각(26~58).
  // 띠의 아래 변 위의 점 B 와 위 변 위의 점 C 를 이은 선분 BC 로 접으면, 접힌 아래 변이 위 변과 점 A 에서 만난다. 점 D 는 위 변에서 점 A 의 왼쪽, 점 E 는 접기 전의 아래 변(점선) 위에 있다.
  function stripScene(th) {
    const H = 66, pB = [0, H], pC = [H / Math.tan(th * RAD), 0], pA = [H / Math.tan(2 * th * RAD), 0];
    const xr = Math.max(pC[0], H / Math.sin(2 * th * RAD)) + 30, xl = Math.min(0, pA[0]) - 52, R1 = refl([xr, 0], pB, pC), R2 = refl([xr, H], pB, pC);
    const P = { A: pA, B: pB, C: pC, D: [xl + 14, 0], E: [xr - 14, H], p: [xl, 0], q: [xl, H], r: [xr, 0], s: [xr, H], u: R1, w: R2 }, S = scene(P), b = S.b;
    b.poly([P.p, pC, pB, P.q], 'fill:#eef2f6').poly([pB, pC, R1, R2], 'fill:rgba(148,163,184,0.5)');
    b.seg(pC, P.r, 'cut').seg(P.r, P.s, 'cut').seg(P.s, pB, 'cut').seg(pA, pC).seg(pB, pC);
    b.dot(P.D, 2.2).dot(P.E, 2.2);
    b.name(pA, 'A', (2 * th + 180) / 2, 15).name(pB, 'B', 250, 12).name(pC, 'C', Math.max(th, 32), 18).name(P.D, 'D', 90).name(P.E, 'E', 270);
    return S;
  }
  const STRIP_SAY = '폭이 일정한 종이 띠. 띠의 아래 변 위의 점 B와 위 변 위의 점 C를 이은 선분 BC를 접는 선으로 하여 오른쪽 부분을 위로 접었다. 접힌 아래 변이 위 변과 점 A에서 만나 삼각형 ABC가 겹친 부분이 된다. 점 D는 위 변에서 점 A의 왼쪽에 있고, 점 E는 접기 전의 아래 변(점선) 위에서 점 B의 오른쪽에 있다. ';

  // ── 문장 ──
  const ISO_TRUE = [
    '이등변삼각형의 두 밑각의 크기는 같다.', '이등변삼각형의 꼭지각의 이등분선은 밑변을 수직이등분한다.', '두 내각의 크기가 같은 삼각형은 이등변삼각형이다.',
    '정삼각형은 이등변삼각형이다.', '이등변삼각형의 꼭지각의 이등분선과 밑변이 이루는 각의 크기는 90°이다.', '이등변삼각형은 두 변의 길이가 같은 삼각형이다.'
  ];
  const ISO_FALSE = [
    ['정삼각형은 이등변삼각형이 아니다.', '정삼각형은 세 변의 길이가 같으므로 두 변의 길이가 같은 삼각형, 곧 이등변삼각형이다.', ['정삼각형은 이등변삼각형이다.']],
    ['이등변삼각형의 꼭지각의 이등분선과 밑변이 이루는 각의 크기는 90°보다 크다.', '꼭지각의 이등분선은 밑변과 수직으로 만나므로 이루는 각의 크기는 90°이다.', ['이등변삼각형의 꼭지각의 이등분선과 밑변이 이루는 각의 크기는 90°이다.', '이등변삼각형의 꼭지각의 이등분선은 밑변을 수직이등분한다.']],
    ['이등변삼각형의 한 밑각의 이등분선은 그 대변을 수직이등분한다.', '대변을 수직이등분하는 것은 꼭지각의 이등분선이다.', ['이등변삼각형의 꼭지각의 이등분선은 밑변을 수직이등분한다.']],
    ['이등변삼각형의 꼭지각의 크기와 한 밑각의 크기는 항상 같다.', '크기가 항상 같은 것은 두 밑각이다.', ['이등변삼각형의 두 밑각의 크기는 같다.']],
    ['두 내각의 크기가 같은 삼각형은 정삼각형이다.', '두 내각의 크기가 같은 삼각형은 이등변삼각형이다. 세 내각의 크기가 모두 같아야 정삼각형이다.', ['두 내각의 크기가 같은 삼각형은 이등변삼각형이다.']]
  ];

  // AB = AC 인 이등변삼각형 ABC 와 꼭지각의 이등분선 AD(점 D 는 밑변 BC 위). P: 점 A, B, C, D 와 덧붙인 점. ∠BAD, ∠DAC 에 ● 를 찍는다.
  const apexScene = (P, far) => scene(P).poly('BCA').tick('AB AC', 1, 0.62).seg('AD').same('BAD DAC', 'dot', far || 27);
  const apexPts = (a, more, size) => isoPts(a, (P) => Object.assign({ D: mid(P.B, P.C) }, more ? more(P) : {}), size);
  const APEX_HEAD = `${eq('AB', 'AC')}인 이등변삼각형 ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 하자.`;
  const APEX_SAY = `${ISO_SAY}점 D는 변 BC 위에 있고 선분 AD가 그어져 있다. ∠BAD와 ∠DAC에 크기가 같다는 표시가 있다. `;
  const APEX_WHY = '이등변삼각형의 꼭지각의 이등분선은 밑변을 수직이등분한다.';
  const APEX_TRUE = [eq('BD', 'CD'), '∠B = ∠C', '∠ADC = 90°', '△ABD ≡ △ACD', nb(`${sg('AD')} ⊥ ${sg('BC')}`), '∠ADB = ∠ADC'];
  const APEX_FALSE = [
    ['∠BAC = ∠ACB', '꼭지각 ∠BAC와 밑각 ∠ACB의 크기가 같다고 할 수 없다. 크기가 같은 것은 두 밑각 ∠B, ∠C이다.'],
    [eq('AB', 'BC'), `변 AB와 밑변 BC의 길이가 같다고 할 수 없다. 길이가 같은 두 변은 ${sg('AB')}, ${sg('AC')}이다.`],
    [eq('AD', 'BD'), `${sg('AD')}와 ${sg('BD')}의 길이가 같다고 할 수 없다. 꼭지각의 이등분선이 이등분하는 것은 밑변 BC이다.`],
    ['∠BAD = ∠ABD', '∠BAD는 꼭지각의 절반이고 ∠ABD는 밑각이므로 크기가 같다고 할 수 없다.'],
    [eq('AD', 'BC'), `${sg('AD')}와 밑변 BC의 길이가 같다고 할 수 없다. 꼭지각의 이등분선이 밑변을 수직이등분할 뿐이다.`]
  ];
  const POINT_TRUE = [eq('PB', 'PC'), '∠PDC = 90°', '△PBD ≡ △PCD', '△ABP ≡ △ACP', '∠PBD = ∠PCD', '∠ABP = ∠ACP', '∠BPD = ∠CPD'];
  const POINT_FALSE = [
    [eq('AP', 'BP'), `점 P는 변 BC의 수직이등분선 위에 있으므로 ${eq('PB', 'PC')}이지만, ${sg('AP')}와 ${sg('BP')}의 길이가 같다고 할 수는 없다.`],
    ['∠ABP = ∠PBD', `${sg('BP')}가 ∠B를 이등분한다고 할 수 없다.`],
    [eq('PD', 'BD'), `${sg('PD')}와 ${sg('BD')}의 길이가 같다고 할 수 없다. 점 D가 이등분하는 것은 변 BC이다.`],
    [eq('AP', 'PD'), '점 P는 선분 AD 위의 한 점일 뿐이므로 선분 AD의 중점이라고 할 수 없다.'],
    ['△ABP ≡ △BDP', `△ABP와 합동인 삼각형은 △ACP이다. △ABP와 △BDP가 합동이라고 할 수 없다.`]
  ];


  B.addUnit({
    id: '8-2-1', grade: 8, semester: 2, no: 1, title: '삼각형의 성질', version: 1,
    groups: [
      {
        id: 'iso', title: '이등변삼각형의 성질', standard: ISO,
        types: [
          T('iso-words', '증명의 뜻과 이등변삼각형의 성질을 적은 문장의 빈칸', '①1', (d) => pickOne(d, '다음 ㈎, ㈏, ㈐에 알맞은 말을 차례로 나열한 것은?', '증명, 밑각, 수직이등분', ['증명, 꼭지각, 수직이등분', '작도, 밑각, 수직이등분', '증명, 밑각, 삼등분'], {
            figure: lines(['이미 알고 있는 사실을 이용하여 어떤 성질이 옳은지 밝히는 과정을 ㈎이라고 한다.', '이등변삼각형의 두 ㈏의 크기는 같다.', '이등변삼각형의 꼭지각의 이등분선은 밑변을 ㈐한다.']),
            explain: '옳은지 밝히는 과정은 증명이다. 이등변삼각형에서 크기가 같은 두 각은 밑각이고, 꼭지각의 이등분선은 밑변을 수직이등분한다.'
          })),
          T('iso-claims', '이등변삼각형에 대한 설명 가리기', '②15', (d) => {
            const wantTrue = d.bool();
            return sayQ(d, `다음 중 이등변삼각형에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, ISO_TRUE, ISO_FALSE, wantTrue);
          }),
          T('iso-angle', '이등변삼각형의 꼭지각과 밑각', '①2 ②1', (d, n) => {
            if (n === 0) {
              const a = 2 * d.int(15, 55), x = (180 - a) / 2, S = isoScene(a).ang('BAC', deg(a)).ang('ABC', sv('x')).names();
              return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 ∠A = ${a}°일 때, ∠B의 크기는?`, x, {
                figure: S.svg(`${ISO_SAY}∠A = ${a}°, ∠B = x`),
                explain: `${eq('AB', 'AC')}이므로 ∠B = ∠C이다. ∠B = (180° − ${a}°) ÷ 2 = ${x}°이다.`, facts: { calc: [[`(180-${a})/2`, 0]], unseen: [180, 2] }
              });
            }
            const c = d.until(() => d.int(24, 76), (v) => v !== 60 && v !== 45), x = 180 - 2 * c, S = isoScene(x).ang('ACB', deg(c)).ang('BAC', sv('x'), { square: false }).names();
            return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 ∠C = ${c}°일 때, ∠A의 크기는?`, x, {
              figure: S.svg(`${ISO_SAY}∠C = ${c}°, ∠A = x`),
              explain: `${eq('AB', 'AC')}이므로 ∠B = ∠C = ${c}°이다. ∠A = 180° − ${c}° × 2 = ${x}°이다.`, facts: { calc: [[`180-${c}*2`, 0]], unseen: [180, 2] }
            });
          }, { count: 2 }),
          T('iso-ext', '밑각의 외각이 그려진 이등변삼각형', '①3 ②2', (d, n) => {
            const a = 2 * d.int(15, 50), e = 90 + a / 2;
            const S = isoScene(a, (P) => ({ D: [P.C[0] + 34, 0] }), a >= 70 ? [215, 120] : [185, 150]).seg('CD');
            const head = `${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 BC의 연장선 위에 점 D가 있다.`, said = `${ISO_SAY}점 D는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. `;
            if (n === 0) {
              S.ang('DCA', deg(e)).ang('BAC', sv('x'), { square: false }).names();
              return degQ(`${head} ∠ACD = ${e}°일 때, ∠A의 크기는?`, a, {
                figure: S.svg(`${said}∠ACD = ${e}°, ∠A = x`),
                explain: `∠ACB = 180° − ${e}° = ${180 - e}°이고 ${eq('AB', 'AC')}이므로 ∠B = ∠ACB = ${180 - e}°이다. ∠A = 180° − ${180 - e}° × 2 = ${a}°이다.`,
                facts: { calc: [[`180-(180-${e})*2`, 0]], unseen: [180, 2] }
              });
            }
            S.ang('BAC', deg(a)).ang('DCA', sv('x'), { square: false }).names();
            return degQ(`${head} ∠A = ${a}°일 때, ∠ACD의 크기는?`, e, {
              figure: S.svg(`${said}∠A = ${a}°, ∠ACD = x`),
              explain: `${eq('AB', 'AC')}이므로 ∠ACB = (180° − ${a}°) ÷ 2 = ${90 - a / 2}°이다. ∠ACD = 180° − ${90 - a / 2}° = ${e}°이다.`,
              facts: { calc: [[`180-(180-${a})/2`, 0]], unseen: [180, 2] }
            });
          }, { count: 2 }),
          T('iso-expr', '각의 크기가 x에 대한 식인 이등변삼각형', '①4', (d) => {
            const v = d.until(() => { const x = d.int(10, 32), k = d.pick([2, 3, 4, 5]), m = d.pick([1, 2, 3]); return { x, k, m, a: k * x, c: (180 - k * x) / 2 - m * x }; },
              (w) => w.a >= 40 && w.a <= 100 && Number.isInteger(w.c) && w.c !== 0 && Math.abs(w.c) <= 40 && w.c % 5 === 0);
            const S = isoScene(v.a).ang('BAC', exSvg(v.k, 0, '°')).ang('ABC', exSvg(v.m, v.c, '°')).names();
            return N(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 ∠A = ${exHtml(v.k, 0, '°')}, ∠B = ${exHtml(v.m, v.c, '°')}일 때, ${X}의 값은?`, v.x, {
              figure: S.svg(`${ISO_SAY}∠A = ${exSay(v.k, 0, '°')}, ∠B = ${exSay(v.m, v.c, '°')}`),
              explain: `${eq('AB', 'AC')}이므로 ∠C = ∠B = ${exHtml(v.m, v.c, '°')}이다. 세 내각의 크기의 합은 180°이므로 ${v.k}${X} + 2${exHtml(v.m, v.c, '')} = 180이다. ${v.k + 2 * v.m}${X} = ${180 - 2 * v.c}에서 ${X} = ${v.x}이다.`,
              facts: { calc: [[`(180-2*(${v.c}))/(${v.k}+2*${v.m})`, 0]], unseen: [180, 2, 1] }
            });
          }),
          T('apex-xy', '꼭지각의 이등분선이 그어진 그림에서 길이와 각', '①18 ②13', (d, n) => {
            if (n === 0) {
              const a = 2 * d.int(22, 45), k = d.int(3, 12), P = apexPts(a), S = apexScene(P);
              S.dim('BC', cm(2 * k), 'A', 25).len('DC', `${sv('x')} cm`, [P.D[0], P.D[1] + 50]).ang('ADB', `${sv('y')}°`, { square: false }).names();
              return M(`${APEX_HEAD} ${nb(`${sg('BC')} = ${2 * k} cm`)}, ${nb(`${sg('DC')} = ${X} cm`)}, ∠ADB = ${V('y')}°일 때, ${X}, ${V('y')}의 값은?`, [{ label: 'x', answer: k }, { label: 'y', answer: 90 }], {
                figure: S.svg(`${APEX_SAY}변 BC의 길이는 ${2 * k} cm, 선분 DC의 길이는 x cm, ∠ADB = y°`),
                explain: `${APEX_WHY} ${sg('DC')} = ${2 * k} ÷ 2 = ${k}(cm)이고 ∠ADB = 90°이므로 ${X} = ${k}, ${V('y')} = 90이다.`,
                facts: { calc: [[`${2 * k}/2`, 0], ['90', 1]], unseen: [2, 90], rule: 'apex-xy-base' }
              });
            }
            const t = d.int(25, 40), k = d.int(3, 12), P = apexPts(2 * t), S = apexScene(P);
            S.ang('CAD', deg(t), { arc: false }).len('BD', cm(k), 'A').len('DC', `${sv('x')} cm`, 'A').ang('ABC', `${sv('y')}°`).names();
            return M(`${APEX_HEAD} ∠CAD = ${t}°, ${nb(`${sg('BD')} = ${k} cm`)}, ${nb(`${sg('DC')} = ${X} cm`)}, ∠B = ${V('y')}°일 때, ${X}, ${V('y')}의 값은?`, [{ label: 'x', answer: k }, { label: 'y', answer: 90 - t }], {
              figure: S.svg(`${APEX_SAY}∠CAD = ${t}°, 선분 BD의 길이는 ${k} cm, 선분 DC의 길이는 x cm, ∠B = y°`),
              explain: `${APEX_WHY} ${eq('DC', 'BD')} = ${k} cm이다. ∠BAD = ∠CAD = ${t}°이고 ∠ADB = 90°이므로 △ABD에서 ∠B = 180° − (90° + ${t}°) = ${90 - t}°이다. ${X} = ${k}, ${V('y')} = ${90 - t}이다.`,
              facts: { calc: [[`${k}`, 0], [`180-(90+${t})`, 1]], unseen: [180, 90], rule: 'apex-xy-angle' }
            });
          }, { count: 2 }),
          T('apex-area', '꼭지각의 이등분선의 길이로 이등변삼각형의 넓이 구하기', '①18', (d) => {
            const v = d.until(() => ({ h: d.int(4, 12), k: d.int(3, 9) }), (w) => w.h !== w.k && w.h / w.k >= 0.75 && w.h / w.k <= 1.7);
            const P = fitPts({ A: [0, -v.h], B: [-v.k, 0], C: [v.k, 0], D: [0, 0] }, [200, 150]), S = apexScene(P);
            S.len('AD', cm(v.h), 'B', { t: 0.72, gap: 4 }).len('BD', cm(v.k), 'A').names();
            return cm2Q(`${APEX_HEAD} ${nb(`${sg('AD')} = ${v.h} cm`)}, ${nb(`${sg('BD')} = ${v.k} cm`)}일 때, △ABC의 넓이는?`, v.h * v.k, {
              figure: S.svg(`${APEX_SAY}선분 AD의 길이는 ${v.h} cm, 선분 BD의 길이는 ${v.k} cm`),
              explain: `${APEX_WHY} ${sg('AD')} ⊥ ${sg('BC')}이고 ${sg('BC')} = 2 × ${v.k} = ${2 * v.k}(cm)이므로 △ABC의 넓이는 ${frac(1, 2)} × ${2 * v.k} × ${v.h} = ${v.h * v.k}(cm²)이다.`,
              facts: { calc: [[`2*${v.k}*${v.h}/2`, 0]], unseen: [2] }
            });
          }),
          T('apex-mid', '꼭짓점과 밑변의 중점을 이은 선분', '①18 심1', (d) => {
            const t = d.int(22, 40), P = isoPts(2 * t, (Q) => ({ M: mid(Q.B, Q.C) })), S = scene(P).poly('BCA').tick('AB AC', 1, 0.62).seg('AM').tick('BM MC', 2);
            S.ang('BAM', deg(t), { arc: false }).ang('ACB', sv('x')).names();
            return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 BC의 중점을 M이라 하자. ∠BAM = ${t}°일 때, ∠C의 크기는?`, 90 - t, {
              figure: S.svg(`${ISO_SAY}점 M은 변 BC 위에 있고 선분 AM이 그어져 있다. 선분 BM과 선분 CM에 길이가 같다는 표시(두 줄)가 있다. ∠BAM = ${t}°, ∠C = x`),
              explain: `${eq('AB', 'AC')}, ${eq('BM', 'CM')}이고 ${sg('AM')}은 공통이므로 △ABM ≡ △ACM(SSS 합동)이다. ∠CAM = ∠BAM = ${t}°이므로 ∠BAC = ${2 * t}°이고 ∠C = (180° − ${2 * t}°) ÷ 2 = ${90 - t}°이다.`,
              facts: { calc: [[`(180-${t}*2)/2`, 0]], unseen: [180, 2] }
            });
          }),
          T('apex-claims', '꼭지각의 이등분선이 그어진 그림: 옳은 것과 옳지 않은 것', '②14', (d) => {
            const a = 2 * d.until(() => d.int(20, 50), (w) => Math.abs(w - 30) >= 4 && Math.abs(w - 45) >= 4), wantTrue = d.bool(), S = apexScene(apexPts(a)).names();
            return sayQ(d, `${APEX_HEAD} 다음 중 ${wantTrue ? '항상 옳은' : '옳다고 할 수 없는'} 것은?`, APEX_TRUE, APEX_FALSE, wantTrue, S.svg(APEX_SAY.trim().replace(/\.$/, '')));
          }),
          T('apex-point', '꼭지각의 이등분선 위의 점', '①19', (d) => {
            // 점 P 가 외심·내심·중점처럼 보이지 않게 자리를 고른다.
            const far = (P) => { const r = dist(P.P, P.D), sides = [dist(P.A, P.P), dist(P.B, P.P), dist(P.B, P.D), r]; return Math.abs(sides[0] - sides[1]) > 14 && Math.abs(r - sides[2]) > 12 && Math.abs(sides[0] - r) > 14 && Math.abs(angleAt(P.B, P.A, P.P) - angleAt(P.B, P.P, P.D)) > 7 && r > 26 && sides[0] > 48; };
            const P = d.until(() => { const a = 2 * d.int(28, 44), t = d.pick([0.36, 0.42, 0.62, 0.7]); return apexPts(a, (Q) => ({ P: mid(Q.A, mid(Q.B, Q.C), t) })); }, far), wantTrue = d.bool();
            const S = apexScene(P).seg('PB PC').dot('P').names({ P: [20, 13] });
            return sayQ(d, `${APEX_HEAD} 선분 AD 위의 점 P에 대하여 다음 중 ${wantTrue ? '항상 옳은' : '옳다고 할 수 없는'} 것은?`, POINT_TRUE, POINT_FALSE, wantTrue,
              S.svg(`${APEX_SAY}점 P는 선분 AD 위에 있고 선분 PB와 선분 PC가 그어져 있다`));
          }),

          T('iso-parallel', '꼭짓점을 지나고 밑변에 평행한 직선', '①5 ②3 심3', (d, n) => {
            const a = 2 * d.int(25, 50), x = 90 - a / 2;
            if (n === 0) {
              const S = isoScene(a, (P) => ({ D: [P.A[0] + 62, P.A[1]], p: [P.A[0] - 62, P.A[1]] }), [200, 125]);
              S.seg('pD').arrow('pD', 0.88).arrow('BC', 0.55).ang('BAC', deg(a)).ang('DAC', sv('x')).names({ A: 90 });
              return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 꼭짓점 A를 지나고 변 BC에 평행한 직선 위에 점 D가 있다. ∠BAC = ${a}°일 때, ∠DAC의 크기는?`, x, {
                figure: S.svg(`${ISO_SAY}꼭짓점 A를 지나는 직선이 변 BC와 평행하다는 표시가 있고, 점 D는 그 직선 위에서 점 A의 오른쪽(점 C 쪽)에 있다. ∠BAC = ${a}°, ∠DAC = x`),
                explain: `${eq('AB', 'AC')}이므로 ∠ACB = (180° − ${a}°) ÷ 2 = ${x}°이다. 평행선에서 엇각의 크기는 같으므로 ∠DAC = ∠ACB = ${x}°이다.`,
                facts: { calc: [[`(180-${a})/2`, 0]], unseen: [180, 2], rule: 'iso-parallel-alt' }
              });
            }
            const S = isoScene(a, (P) => ({ D: [P.A[0] + 66, P.A[1]], E: at(P.A, 40, dirOf(P.B, P.A)) }), [200, 150]);
            S.seg('AD AE').arrow('AD', 0.7).arrow('BC', 0.55).ang('BAC', deg(a)).ang('EAD', sv('x')).names({ A: 180 });
            return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 BA의 연장선 위에 점 E가 있고, 꼭짓점 A에서 변 BC에 평행한 반직선 AD를 그었다. ∠BAC = ${a}°일 때, ∠EAD의 크기는?`, x, {
              figure: S.svg(`${ISO_SAY}점 E는 변 BA를 점 A 너머로 늘인 선 위에 있다. 반직선 AD는 변 BC와 평행하다는 표시가 있고 점 C 쪽으로 뻗어 있다. ∠BAC = ${a}°, ∠EAD = x`),
              explain: `${eq('AB', 'AC')}이므로 ∠B = (180° − ${a}°) ÷ 2 = ${x}°이다. 평행선에서 동위각의 크기는 같으므로 ∠EAD = ∠B = ${x}°이다.`,
              facts: { calc: [[`(180-${a})/2`, 0]], unseen: [180, 2], rule: 'iso-parallel-same' }
            });
          }, { count: 2 }),
          T('iso-inner', '이등변삼각형 안에 생긴 또 하나의 이등변삼각형', '①6 심4', (d, n) => {
            if (n === 0) {
              // AD = BD: △DAB 의 밑각은 ∠A 와 ∠DBA 이다.
              const a = 2 * d.int(15, 24), bv = 90 - a / 2, x = bv - a;
              const S = isoScene(a, (P) => { const m = mid(P.A, P.B); return { D: meet(m, perpAt(m, P.A, P.B), P.A, P.C) }; }, [150, 165]);
              S.seg('BD').tick('AD', 2, 0.3).tick('BD', 2).ang('BAC', deg(a)).ang('DBC', sv('x')).names();
              return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 AC 위의 점 D에 대하여 ${eq('AD', 'BD')}이다. ∠A = ${a}°일 때, ∠DBC의 크기는?`, x, {
                figure: S.svg(`${ISO_SAY}점 D는 변 AC 위에 있고 선분 BD가 그어져 있다. 선분 AD와 선분 BD에 길이가 같다는 표시(두 줄)가 있다. ∠A = ${a}°, ∠DBC = x`),
                explain: `${eq('AB', 'AC')}이므로 ∠ABC = (180° − ${a}°) ÷ 2 = ${bv}°이다. ${eq('AD', 'BD')}이므로 ∠DBA = ∠A = ${a}°이다. ∠DBC = ${bv}° − ${a}° = ${x}°이다.`,
                facts: { calc: [[`(180-${a})/2-${a}`, 0]], unseen: [180, 2] }
              });
            }
            // BC = BD: △BCD 의 밑각은 ∠C 와 ∠BDC 이다.
            const c = d.int(64, 74), a = 180 - 2 * c, x = c - a;
            const S = isoScene(a, (P) => { const f = foot(P.B, P.A, P.C); return { D: [2 * f[0] - P.C[0], 2 * f[1] - P.C[1]] }; }, [150, 165]);
            S.seg('BD').tick('BC BD', 2).ang('ACB', deg(c)).ang('ABD', sv('x')).names();
            return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 AC 위의 점 D에 대하여 ${eq('BC', 'BD')}이다. ∠C = ${c}°일 때, ∠ABD의 크기는?`, x, {
              figure: S.svg(`${ISO_SAY}점 D는 변 AC 위에 있고 선분 BD가 그어져 있다. 변 BC와 선분 BD에 길이가 같다는 표시(두 줄)가 있다. ∠C = ${c}°, ∠ABD = x`),
              explain: `${eq('AB', 'AC')}이므로 ∠ABC = ∠C = ${c}°이다. ${eq('BC', 'BD')}이므로 ∠BDC = ∠C = ${c}°이고 ∠DBC = 180° − ${c}° × 2 = ${a}°이다. ∠ABD = ${c}° − ${a}° = ${x}°이다.`,
              facts: { calc: [[`${c}-(180-${c}*2)`, 0]], unseen: [180, 2] }
            });
          }, { count: 2 }),
          T('iso-base-bisector', '밑각의 이등분선이 그어진 이등변삼각형', '①7 심5', (d, n) => {
            const draw = (w) => { const S0 = isoScene(180 - 2 * w, (P) => ({ D: meet(P.B, at(P.B, 10, w / 2), P.A, P.C) }), [165, 150], 0.25).seg('BD').same('ABD DBC', 'dot', 30); return n === 0 ? S0.ang('BAC', deg(180 - 2 * w)).ang('BDC', sv('x'), { square: false }).names() : S0.ang('ADB', deg(w + w / 2)).ang('BAC', sv('x'), { square: false }).names(); };
            const bv = d.until(() => 2 * d.int(25, 37), (w) => !draw(w).clash()), a = 180 - 2 * bv, h = bv / 2, S = draw(bv);
            const head = `${eq('AB', 'AC')}인 이등변삼각형 ABC에서 ∠B의 이등분선이 변 AC와 만나는 점을 D라 하자.`, said = `${ISO_SAY}점 D는 변 AC 위에 있고 선분 BD가 그어져 있다. ∠ABD와 ∠DBC에 크기가 같다는 표시가 있다. `;
            if (n === 0) {
              return degQ(`${head} ∠A = ${a}°일 때, ∠BDC의 크기는?`, a + h, {
                figure: S.svg(`${said}∠A = ${a}°, ∠BDC = x`),
                explain: `${eq('AB', 'AC')}이므로 ∠ABC = (180° − ${a}°) ÷ 2 = ${bv}°이고 ∠ABD = ${bv}° ÷ 2 = ${h}°이다. ∠BDC는 △ABD의 외각이므로 ∠BDC = ∠A + ∠ABD = ${a}° + ${h}° = ${a + h}°이다.`,
                facts: { calc: [[`${a}+(180-${a})/2/2`, 0]], unseen: [180, 2] }
              });
            }
            const g = bv + h;
            return degQ(`${head} ∠ADB = ${g}°일 때, ∠A의 크기는?`, a, {
              figure: S.svg(`${said}∠ADB = ${g}°, ∠A = x`),
              explain: `∠DBC = ∠${X}라 하면 ∠C = ∠ABC = 2∠${X}이다. ∠ADB는 △DBC의 외각이므로 ∠${X} + 2∠${X} = ${g}°에서 ∠${X} = ${h}°이다. ∠C = ∠ABC = ${bv}°이므로 ∠A = 180° − ${bv}° × 2 = ${a}°이다.`,
              facts: { calc: [[`180-(${g}/3*2)*2`, 0]], unseen: [180, 3, 2] }
            });
          }, { count: 2 }),
          T('iso-in-out', '밑각의 이등분선과 외각의 이등분선이 만나 이루는 각', '①8 ②8 심12', (d) => {
            const bv = 2 * d.int(28, 36), a = 180 - 2 * bv, ext = 180 - bv, x = a / 2;
            const S = scene(fitPts((() => { const P = isoTri(a), D = meet(P.B, at(P.B, 10, bv / 2), P.C, at(P.C, 10, ext / 2)); return Object.assign(P, { D, E: [Math.max(P.C[0] + 40, D[0] + 6), 0] }); })(), [235, 150]));
            S.poly('BCA').tick('AB AC', 1, 0.25).seg('CE BD CD').same('ABD DBC', 'dot', 34).same('ACD DCE', 'x', 24).ang('BAC', deg(a)).ang('BDC', sv('x')).names({ C: 270, E: 270 });
            return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 BC의 연장선 위에 점 E가 있다. ∠B의 이등분선과 ∠ACE의 이등분선이 만나는 점을 D라 하자. ∠A = ${a}°일 때, ∠BDC의 크기는?`, x, {
              figure: S.svg(`${ISO_SAY}점 E는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. 점 B에서 그은 선분과 점 C에서 그은 선분이 삼각형 밖의 점 D에서 만난다. ∠ABD와 ∠DBC에 크기가 같다는 표시(●)가, ∠ACD와 ∠DCE에 크기가 같다는 표시(×)가 있다. ∠A = ${a}°, ∠BDC = x`),
              explain: `∠ABC = ∠ACB = (180° − ${a}°) ÷ 2 = ${bv}°이므로 ∠DBC = ${bv / 2}°이다. ∠ACE = 180° − ${bv}° = ${ext}°이므로 ∠DCE = ${ext / 2}°이다. ∠DCE는 △DBC의 외각이므로 ∠BDC = ${ext / 2}° − ${bv / 2}° = ${x}°이다.`,
              facts: { calc: [[`(180-(180-${a})/2)/2-(180-${a})/2/2`, 0]], unseen: [180, 2] }
            });
          }),
          T('iso-two-on-line', '한 직선 위에 나란히 놓인 두 이등변삼각형', '②4 심7', (d) => {
            const v = d.until(() => { const p = d.int(46, 68), q = 2 * d.int(15, 32); return { p, q, r: 90 - q / 2 }; }, (w) => 180 - w.p - w.r >= 36 && 180 - w.p - w.r <= 76 && w.p !== w.r && Math.abs(w.p - (180 - w.p - w.r)) >= 3);
            const x = 180 - v.p - v.r;
            const S = scene(fitPts((() => { const one = baseTri(v.p, v.p, 100), h = 100 * Math.tan(v.p * RAD) / 2, w2 = 2 * (h * 0.96) / Math.tan(v.r * RAD); return { A: one.A, B: one.B, C: one.C, D: [100 + w2 / 2, -h * 0.96], E: [100 + w2, 0] }; })(), [250, 140]));
            S.poly('BCA').poly('CED').tick('AB AC').tick('DC DE', 2).ang('ABC', deg(v.p)).ang('CDE', deg(v.q), { square: false }).ang('ACD', sv('x')).names({ C: 270 });
            return degQ(`세 점 B, C, E가 한 직선 위에 있고 ${eq('AB', 'AC')}, ${eq('DC', 'DE')}이다. ∠ABC = ${v.p}°, ∠CDE = ${v.q}°일 때, ∠ACD의 크기는?`, x, {
              figure: S.svg(`한 직선 위에 세 점 B, C, E가 이 차례로 놓여 있고, 그 직선의 위쪽에 삼각형 ABC와 삼각형 DCE가 점 C에서 맞닿아 있다. 변 AB와 변 AC에 길이가 같다는 표시(한 줄), 변 DC와 변 DE에 길이가 같다는 표시(두 줄)가 있다. ∠ABC = ${v.p}°, ∠CDE = ${v.q}°, ∠ACD = x`),
              explain: `${eq('AB', 'AC')}이므로 ∠ACB = ∠ABC = ${v.p}°이다. ${eq('DC', 'DE')}이므로 ∠DCE = (180° − ${v.q}°) ÷ 2 = ${v.r}°이다. ∠ACD = 180° − (${v.p}° + ${v.r}°) = ${x}°이다.`,
              facts: { calc: [[`180-${v.p}-(180-${v.q})/2`, 0]], unseen: [180, 2] }
            });
          }),
          T('iso-two-on-side', '한 변 위의 점에서 만나는 두 이등변삼각형', '①12', (d) => {
            const build = (w) => { const P = baseTri(w.b, w.c, 100), ab = dist(P.A, P.B); return Object.assign(P, { D: [ab, 0], E: along(P.C, P.A, 100 - ab) }); };
            const v = d.until(() => ({ b: 2 * d.int(24, 36), c: 2 * d.int(20, 30) }), (w) => { if (w.b === w.c) return false; const P = build(w), ab = dist(P.A, P.B), ca = dist(P.A, P.C); return ab > 38 && ab < 72 && 100 - ab < ca * 0.8; });
            const x = (v.b + v.c) / 2, S = scene(fitPts(build(v), [235, 150]));
            S.poly('BCA').seg('AD DE').tick('BA BD').tick('CD CE', 2).ang('ABC', deg(v.b)).ang('ACB', deg(v.c)).ang('ADE', sv('x')).names();
            return degQ(`△ABC에서 변 BC 위의 점 D와 변 AC 위의 점 E에 대하여 ${eq('BA', 'BD')}, ${eq('CD', 'CE')}이다. ∠B = ${v.b}°, ∠C = ${v.c}°일 때, ∠ADE의 크기는?`, x, {
              figure: S.svg(`삼각형 ABC. 점 D는 변 BC 위에, 점 E는 변 AC 위에 있고 선분 AD와 선분 DE가 그어져 있다. 변 BA와 선분 BD에 길이가 같다는 표시(한 줄), 선분 CD와 선분 CE에 길이가 같다는 표시(두 줄)가 있다. ∠B = ${v.b}°, ∠C = ${v.c}°, ∠ADE = x`),
              explain: `${eq('BA', 'BD')}이므로 ∠BDA = (180° − ${v.b}°) ÷ 2 = ${90 - v.b / 2}°이다. ${eq('CD', 'CE')}이므로 ∠CDE = (180° − ${v.c}°) ÷ 2 = ${90 - v.c / 2}°이다. ∠ADE = 180° − (${90 - v.b / 2}° + ${90 - v.c / 2}°) = ${x}°이다.`,
              facts: { calc: [[`180-(180-${v.b})/2-(180-${v.c})/2`, 0]], unseen: [180, 2] }
            });
          }),
          T('iso-trisect', '꼭지각을 삼등분하는 두 선분', '심6', (d) => {
            const a = 6 * d.int(14, 20), t = a / 3, bv = 90 - a / 2, x = bv + t;
            const S = isoScene(a, (P) => ({ D: meet(P.A, at(P.A, 10, dirOf(P.A, P.B) + t), P.B, P.C), E: meet(P.A, at(P.A, 10, dirOf(P.A, P.B) + 2 * t), P.B, P.C) }), [240, 122]);
            S.seg('AD AE').same('BAD DAE EAC', 'dot', 30).ang('ADE', sv('x'), { square: false }).names({ A: 90 });
            return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 BC 위의 두 점 D, E에 대하여 ∠BAD = ∠DAE = ∠EAC이다. ∠BAC = ${a}°일 때, ∠ADE의 크기는?`, x, {
              figure: S.svg(`${ISO_SAY}변 BC 위에 점 B, D, E, C가 이 차례로 놓여 있고 선분 AD와 선분 AE가 그어져 있다. ∠BAD, ∠DAE, ∠EAC에 크기가 같다는 표시가 있다. ∠ADE = x`),
              explain: `${eq('AB', 'AC')}이므로 ∠B = (180° − ${a}°) ÷ 2 = ${bv}°이다. ∠BAD = ${a}° ÷ 3 = ${t}°이다. ∠ADE는 △ABD의 외각이므로 ∠ADE = ∠B + ∠BAD = ${bv}° + ${t}° = ${x}°이다.`,
              facts: { calc: [[`(180-${a})/2+${a}/3`, 0]], unseen: [180, 2, 3] }
            });
          }),
          T('iso-fold-strip', '종이 띠를 접어 생긴 각', '①17 ②10', (d, n) => {
            if (n === 0) {
              const th = d.int(41, 57), x = 180 - 2 * th, S = stripScene(th);
              S.b.angle(S.P.B, 0, th, deg(th), { r: 20 }); S.ang('BAC', sv('x'), { square: false });
              return degQ(`폭이 일정한 종이 띠를 그림과 같이 선분 BC를 접는 선으로 하여 접었다. ∠CBE = ${th}°일 때, ∠BAC의 크기는?`, x, {
                figure: S.svg(`${STRIP_SAY}∠CBE = ${th}°, ∠BAC = x`),
                explain: `접은 각이므로 ∠ABC = ∠CBE = ${th}°이다. 띠의 두 변은 평행하므로 ∠ACB = ∠CBE = ${th}°(엇각)이다. △ABC에서 ∠BAC = 180° − ${th}° × 2 = ${x}°이다.`,
                facts: { calc: [[`180-${th}*2`, 0]], unseen: [180, 2] }
              });
            }
            const th = d.int(27, 40), S = stripScene(th);
            S.ang('DAB', deg(2 * th)).ang('ACB', sv('x'));
            return degQ(`폭이 일정한 종이 띠를 그림과 같이 선분 BC를 접는 선으로 하여 접었다. ∠DAB = ${2 * th}°일 때, ∠ACB의 크기는?`, th, {
              figure: S.svg(`${STRIP_SAY}∠DAB = ${2 * th}°, ∠ACB = x`),
              explain: `띠의 두 변은 평행하므로 ∠ACB = ∠CBE(엇각)이고, 접은 각이므로 ∠ABC = ∠CBE이다. 따라서 ∠ABC = ∠ACB이다. ∠DAB는 △ABC의 외각이므로 ∠ABC + ∠ACB = ${2 * th}°이고 ∠ACB = ${2 * th}° ÷ 2 = ${th}°이다.`,
              facts: { calc: [[`${2 * th}/2`, 0]], unseen: [2] }
            });
          }, { count: 2 })
        ]
      },
      { id: 'cond', title: '이등변삼각형이 되는 조건', standard: ISO, types: [] },
      { id: 'rt', title: '직각삼각형의 합동 조건', standard: ISO, types: [] },
      { id: 'bis', title: '각의 이등분선의 성질', standard: ISO, types: [] },
      { id: 'circum', title: '삼각형의 외심', standard: CEN, types: [] },
      { id: 'incenter', title: '삼각형의 내심', standard: CEN, types: [] },
      { id: 'both', title: '외심과 내심', standard: CEN, types: [] }
    ]
  });

  // ── 이등변삼각형이 되는 조건 ──
  const HALF = frac(1, 2);
  B.addTypes(UNIT, 'cond', [
    T('cond-two-angles', '두 내각의 크기가 같은 삼각형의 변의 길이', '①20 ②17', (d, n) => {
      const k = d.int(4, 12);
      if (n === 0) {
        // ∠A = ∠B 이므로 CA = CB (같은 두 각이 그림의 아래쪽에 나란히 있지 않다)
        const p = d.until(() => d.int(40, 72), (v) => Math.abs(v - 60) >= 5), q = 180 - 2 * p;
        const S = scene(fitPts(baseTri(p, q), [200, 150]));
        S.poly('BCA').ang('ABC', deg(p)).ang('ACB', deg(q)).len('BC', cm(k), 'A').len('AC', `${sv('x')} cm`, 'B').names();
        return cmQ(`△ABC에서 ∠B = ${p}°, ∠C = ${q}°이고 ${nb(`${sg('BC')} = ${k} cm`)}일 때, ${sg('AC')}의 길이는?`, k, {
          figure: S.svg(`삼각형 ABC. ∠B = ${p}°, ∠C = ${q}°, 변 BC의 길이는 ${k} cm, 변 AC의 길이는 x cm`),
          explain: `∠A = 180° − (${p}° + ${q}°) = ${p}°이므로 ∠A = ∠B이다. 두 내각의 크기가 같은 삼각형은 이등변삼각형이므로 ${eq('AC', 'BC')} = ${k} cm이다.`,
          facts: { calc: [[`${k}`, 0]], rule: 'cond-inner' }
        });
      }
      // 외각으로 준 꼴: ∠A = ∠C 이므로 BA = BC
      const q = d.int(26, 40), S = scene(fitPts((() => { const P = baseTri(180 - 2 * q, q); return Object.assign(P, { D: [-42, 0] }); })(), [235, 120]));
      S.poly('BCA').seg('BD').ang('ABD', deg(2 * q)).ang('ACB', deg(q)).len('AB', cm(k), 'C').len('BC', `${sv('x')} cm`, 'A').names({ B: 270, D: 270 });
      return cmQ(`△ABC에서 변 CB의 연장선 위에 점 D가 있다. ∠ABD = ${2 * q}°, ∠C = ${q}°이고 ${nb(`${sg('AB')} = ${k} cm`)}일 때, ${sg('BC')}의 길이는?`, k, {
        figure: S.svg(`삼각형 ABC. 점 D는 변 CB를 점 B 쪽으로 늘인 선 위에 있다. ∠ABD = ${2 * q}°, ∠C = ${q}°, 변 AB의 길이는 ${k} cm, 변 BC의 길이는 x cm`),
        explain: `∠ABD는 △ABC의 외각이므로 ∠A = ${2 * q}° − ${q}° = ${q}°이다. ∠A = ∠C이므로 △ABC는 ${eq('BA', 'BC')}인 이등변삼각형이다. ${sg('BC')}의 길이는 ${k} cm이다.`,
        facts: { calc: [[`${k}`, 0]], rule: 'cond-outer' }
      });
    }, { count: 2 }),
    T('cond-split', '한 선분으로 나누어진 두 이등변삼각형', '①21 ②18', (d) => {
      const a = d.until(() => d.int(34, 56), (v) => Math.abs(v - 45) >= 4), k = d.int(4, 12);
      const S = scene(fitPts((() => { const P = { B: [0, 0], A: [0, -100], C: [100 * Math.tan(a * RAD), 0] }; P.D = mid(P.A, P.C); return P; })(), [215, 150]));
      S.poly('BCA').seg('BD').ang('BAC', deg(a)).ang('ABD', deg(a)).ang('DBC', deg(90 - a)).len('AD', cm(k), 'B').len('DC', `${sv('x')} cm`, 'B').names();
      return cmQ(`△ABC에서 변 AC 위의 점 D에 대하여 ∠A = ∠ABD = ${a}°, ∠DBC = ${90 - a}°이다. ${nb(`${sg('AD')} = ${k} cm`)}일 때, ${sg('DC')}의 길이는?`, k, {
        figure: S.svg(`삼각형 ABC. 점 D는 변 AC 위에 있고 선분 BD가 그어져 있다. ∠A = ${a}°, ∠ABD = ${a}°, ∠DBC = ${90 - a}°, 선분 AD의 길이는 ${k} cm, 선분 DC의 길이는 x cm`),
        explain: `∠A = ∠ABD이므로 ${eq('DA', 'DB')} = ${k} cm이다. △ABC에서 ∠C = 180° − (${a}° + ${a}° + ${90 - a}°) = ${90 - a}°이므로 ∠C = ∠DBC이고 ${eq('DB', 'DC')}이다. ${sg('DC')}의 길이는 ${k} cm이다.`,
        facts: { calc: [[`${k}`, 0]], rule: 'cond-split' }
      });
    }),
    T('cond-30-right', '한 예각의 크기가 30°인 직각삼각형을 정삼각형과 이등변삼각형으로 나누기', '①22 ②19', (d) => {
      const k = d.int(3, 12), r3 = Math.sqrt(3);
      const S = scene(fitPts((() => { const P = { B: [0, 0], C: [100 * r3, 0], A: [100 * r3, -100] }; P.D = mid(P.A, P.B); return P; })(), [225, 132]));
      S.poly('BCA').seg('CD').right('BCA').ang('ABC', '30°').tick('AD CD').len('AC', cm(k), 'B').names();
      return cmQ(`∠C = 90°인 직각삼각형 ABC에서 ∠B = 30°이고, 변 AB 위의 점 D에 대하여 ${eq('AD', 'CD')}이다. ${nb(`${sg('AC')} = ${k} cm`)}일 때, ${sg('AB')}의 길이는?`, 2 * k, {
        figure: S.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 ∠B = 30°이다. 점 D는 변 AB 위에 있고 선분 CD가 그어져 있다. 선분 AD와 선분 CD에 길이가 같다는 표시가 있다. 변 AC의 길이는 ${k} cm`),
        explain: `∠A = 60°이고 ${eq('AD', 'CD')}이므로 ∠DCA = 60°이다. △ADC는 세 내각의 크기가 모두 60°인 정삼각형이므로 ${eq('AD', 'CD')} = ${k} cm이다. ∠DCB = 90° − 60° = 30° = ∠B이므로 ${eq('DB', 'DC')} = ${k} cm이다. ${sg('AB')} = ${k} + ${k} = ${2 * k}(cm)이다.`,
        facts: { calc: [[`${k}+${k}`, 0]] }
      });
    }),
    T('cond-expr', '이등변삼각형이 되는 변의 길이가 x에 대한 식인 삼각형', '①23', (d) => {
      const v = d.until(() => { const x = d.int(3, 9), k = d.pick([2, 3]), c1 = d.int(-4, 2); return { x, k, c1, c2: (k - 1) * x + c1, len: k * x + c1 }; }, (w) => w.c2 > 0 && w.c2 !== w.c1 && w.len >= 5);
      const T2 = scene(isoPts(2 * d.int(22, 38), null, [150, 150]));
      T2.poly('BCA').same('ABC ACB', 'dot', 22).len('AB', exSvg(v.k, v.c1, ' cm'), 'C').len('AC', exSvg(1, v.c2, ' cm'), 'B').names();
      return N(`∠B = ∠C인 △ABC에서 ${nb(`${sg('AB')} = ${exHtml(v.k, v.c1, '')} cm`)}, ${nb(`${sg('AC')} = ${exHtml(1, v.c2, '')} cm`)}일 때, ${X}의 값은?`, v.x, {
        figure: T2.svg(`삼각형 ABC. ∠B와 ∠C에 크기가 같다는 표시가 있다. 변 AB의 길이는 ${exSay(v.k, v.c1, '')} cm, 변 AC의 길이는 ${exSay(1, v.c2, '')} cm`),
        explain: `두 내각의 크기가 같은 삼각형은 이등변삼각형이므로 ${eq('AB', 'AC')}이다. ${exHtml(v.k, v.c1, '')} = ${exHtml(1, v.c2, '')}에서 ${v.k - 1 === 1 ? '' : v.k - 1}${X} = ${v.c2 - v.c1}, ${X} = ${v.x}이다.`,
        facts: { calc: [[`(${v.c2}-(${v.c1}))/(${v.k}-1)`, 0]], unseen: [1, 0] }
      });
    }),
    T('cond-not-iso', '두 내각의 크기로 이등변삼각형인지 가리기', '①24', (d) => {
      const third = (p, q) => 180 - p - q, isIso = ([p, q]) => p === q || third(p, q) === p || third(p, q) === q;
      // 이등변삼각형인 보기: 밑각(60°가 아닌 것)과 꼭지각을 하나씩 적는다. 나머지 한 각을 구해야 두 각이 같음을 알 수 있다.
      const good = d.shuffle([35, 40, 45, 50, 55, 65, 70, 75]).slice(0, 3).map((base) => [base, 180 - 2 * base]);
      const bad = d.until(() => [5 * d.int(7, 15), 5 * d.int(7, 15)], (w) => !isIso(w) && third(w[0], w[1]) >= 25 && Math.min(Math.abs(w[0] - w[1]), Math.abs(third(w[0], w[1]) - w[0]), Math.abs(third(w[0], w[1]) - w[1])) <= 10);
      const show = ([p, q]) => nb(`∠A = ${p}°, ∠B = ${q}°`);
      return pickOne(d, '다음 중 △ABC가 이등변삼각형이 아닌 것은?', show(bad), good.map((r) => show(d.bool() ? r : [r[1], r[0]])), {
        explain: `∠A = ${bad[0]}°, ∠B = ${bad[1]}°이면 ∠C = 180° − (${bad[0]}° + ${bad[1]}°) = ${third(bad[0], bad[1])}°이므로 크기가 같은 두 내각이 없다. 나머지는 ∠C를 구하면 두 내각의 크기가 같으므로 이등변삼각형이다.`
      });
    }),
    T('cond-fold-strip', '종이 띠를 접어 생긴 이등변삼각형의 변의 길이', '①25 ②11', (d) => {
      const [p, q] = d.pick([[5, 6], [5, 7], [5, 8], [6, 7], [6, 8], [6, 9], [7, 8], [7, 9], [7, 10], [7, 11], [8, 9], [8, 10], [8, 11], [8, 12], [9, 10], [9, 11], [9, 13]]);
      const th = Math.acos(q / (2 * p)) / RAD, S = stripScene(th);
      S.b.beside(S.P.B, S.P.A, cm(p), S.P.C).beside(S.P.B, S.P.C, cm(q), S.P.A);
      return cmQ(`폭이 일정한 종이 띠를 그림과 같이 선분 BC를 접는 선으로 하여 접었다. ${nb(`${sg('AB')} = ${p} cm`)}, ${nb(`${sg('BC')} = ${q} cm`)}일 때, ${sg('AC')}의 길이는?`, p, {
        figure: S.svg(`${STRIP_SAY}선분 AB의 길이는 ${p} cm, 선분 BC의 길이는 ${q} cm`),
        explain: `띠의 두 변은 평행하므로 ∠ACB = ∠CBE(엇각)이고, 접은 각이므로 ∠ABC = ∠CBE이다. ∠ABC = ∠ACB이므로 △ABC는 ${eq('AB', 'AC')}인 이등변삼각형이다. ${sg('AC')}의 길이는 ${p} cm이다.`,
        facts: { calc: [[`${p}`, 0]], rule: 'cond-strip' }
      });
    }),
    T('cond-golden', '꼭지각의 크기가 36°인 이등변삼각형의 밑각의 이등분선', '②20', (d) => {
      const k = d.int(4, 12), S = isoScene(36, (P) => ({ D: meet(P.C, at(P.C, 10, 144), P.A, P.B) }), [128, 175], 0.42);
      S.seg('CD').same('ACD DCB', 'dot', 26).ang('BAC', '36°').len('BC', cm(k), 'A').names();
      return cmQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 ∠A = 36°이고, ∠C의 이등분선이 변 AB와 만나는 점을 D라 하자. ${nb(`${sg('BC')} = ${k} cm`)}일 때, ${sg('AD')}의 길이는?`, k, {
        figure: S.svg(`${ISO_SAY}점 D는 변 AB 위에 있고 선분 CD가 그어져 있다. ∠ACD와 ∠DCB에 크기가 같다는 표시가 있다. ∠A = 36°, 변 BC의 길이는 ${k} cm`),
        explain: `∠B = ∠ACB = (180° − 36°) ÷ 2 = 72°이므로 ∠ACD = ∠DCB = 36°이다. ∠A = ∠ACD이므로 ${eq('AD', 'CD')}이다. ∠BDC = 180° − (72° + 36°) = 72° = ∠B이므로 ${eq('CD', 'CB')} = ${k} cm이다. ${sg('AD')}의 길이는 ${k} cm이다.`,
        facts: { calc: [[`${k}`, 0]], rule: 'cond-golden' }
      });
    }),
    T('cond-proof-angles', '두 내각의 크기가 같은 삼각형이 이등변삼각형임을 설명하는 과정의 빈칸', '①26', (d) => {
      const T2 = scene(isoPts(2 * d.int(24, 34), (P) => ({ D: mid(P.B, P.C) }), [150, 140])).poly('BCA').seg('AD').same('BAD DAC', 'dot', 28).same('ABC ACB', 'x', 20).names();
      const rows = ['△ABD와 △ACD에서', `∠BAD = ㈎, ${sg('AD')}는 공통`, '∠B = ∠C이고 삼각형의 세 내각의 크기의 합은 180°이므로 ∠ADB = ∠ADC', `따라서 △ABD ≡ △ACD (㈏ 합동)이므로 ${sg('AB')} = ㈐이다.`];
      return pickOne(d, '다음은 ∠B = ∠C인 △ABC에서 ∠A의 이등분선과 변 BC의 교점을 D라 할 때, △ABC가 이등변삼각형임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?',
        `∠CAD, ASA, ${sg('AC')}`, [`∠CAD, SAS, ${sg('AC')}`, `∠ACD, ASA, ${sg('AC')}`, `∠CAD, ASA, ${sg('BC')}`], {
          figure: T2.svg('삼각형 ABC. ∠B와 ∠C에 크기가 같다는 표시(×)가 있다. 점 D는 변 BC 위에 있고 선분 AD가 그어져 있다. ∠BAD와 ∠DAC에 크기가 같다는 표시(●)가 있다') + lines(rows),
          explain: `${sg('AD')}가 ∠A의 이등분선이므로 ∠BAD = ∠CAD이다. ${sg('AD')}는 공통이고 그 양 끝 각의 크기가 각각 같으므로 △ABD ≡ △ACD (ASA 합동)이다. 대응변의 길이가 같으므로 ${eq('AB', 'AC')}이다.`
        });
    }),
    T('cond-proof-bisectors', '두 밑각의 이등분선의 교점으로 생긴 삼각형이 이등변삼각형임을 설명하는 과정의 빈칸', '①27 ②16', (d) => {
      const a = 2 * d.int(24, 34), bv = 90 - a / 2;
      const S = isoScene(a, (P) => ({ D: meet(P.B, at(P.B, 10, bv / 2), P.C, at(P.C, 10, 180 - bv / 2)) }), [170, 150]);
      S.seg('BD CD').same('ABD DBC', 'dot', 32).same('ACD DCB', 'x', 32).names();
      const rows = [`${eq('AB', 'AC')}이므로 ∠ABC = ㈎`, `∠DBC = ${HALF}∠ABC, ∠DCB = ${HALF}∠ACB이므로 ∠DBC = ㈏`, `두 내각의 크기가 같으므로 △DBC는 ${sg('DB')} = ㈐인 이등변삼각형이다.`];
      return pickOne(d, `다음은 ${eq('AB', 'AC')}인 이등변삼각형 ABC에서 ∠B와 ∠C의 이등분선의 교점을 D라 할 때, △DBC가 이등변삼각형임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`,
        `∠ACB, ∠DCB, ${sg('DC')}`, [`∠BAC, ∠DCB, ${sg('DC')}`, `∠ACB, ∠BDC, ${sg('DC')}`, `∠ACB, ∠DCB, ${sg('BC')}`], {
          figure: S.svg(`${ISO_SAY}삼각형의 내부에 점 D가 있고 선분 DB와 선분 DC가 그어져 있다. ∠ABD와 ∠DBC에 크기가 같다는 표시(●)가, ∠ACD와 ∠DCB에 크기가 같다는 표시(×)가 있다`) + lines(rows),
          explain: `이등변삼각형의 두 밑각의 크기는 같으므로 ∠ABC = ∠ACB이다. 그 절반끼리도 같으므로 ∠DBC = ∠DCB이다. 두 내각의 크기가 같은 삼각형은 이등변삼각형이므로 ${eq('DB', 'DC')}이다.`
        });
    })
  ]);

  // ── 직각삼각형과 여러 그림 늘어놓기 ──
  // 직각삼각형: 직각인 꼭짓점 R, 가로 변의 끝 U, 세로 변의 끝 W. 변 RU = k, RW = m.
  const rtLegs = (k, m) => ({ R: [0, 0], U: [k, 0], W: [0, -m] });
  // 빗변 UW = c 이고 ∠U = al 인 직각삼각형
  const rtHyp = (c, al) => rtLegs(c * Math.cos(al * RAD), c * Math.sin(al * RAD));
  // 점들을 뒤집고(flip) 돌려(turnBy°) 놓은 다음 이름을 바꾼다. names: { R: 'C', U: 'A', W: 'B' }
  const laid = (P, names, turnBy, flip) => { const Q = {}; for (const key of Object.keys(P)) Q[(names && names[key]) || key] = flip ? [-P[key][0], P[key][1]] : P[key].slice(); return spin(Q, turnBy || 0); };
  const boxOf = (P) => { const all = Object.values(P), xs = all.map((p) => p[0]), ys = all.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
  // 여러 도형을 같은 배율로 옆으로 나란히 놓는다(아래를 맞춘다). 돌려주는 것: 모든 점을 담은 하나의 P
  function sideBySide(sets, size, gap) {
    const boxes = sets.map(boxOf), g = gap == null ? 40 : gap, total = boxes.reduce((s, bx) => s + bx[2] - bx[0], 0), tall = Math.max(...boxes.map((bx) => bx[3] - bx[1]));
    const k = Math.min((size[0] - g * (sets.length - 1)) / total, size[1] / tall), out = {};
    let x = 0;
    sets.forEach((P, i) => { const bx = boxes[i]; for (const key of Object.keys(P)) out[key] = [x + (P[key][0] - bx[0]) * k, (P[key][1] - bx[3]) * k]; x += (bx[2] - bx[0]) * k + g; });
    return out;
  }
  // 작은 그림 여럿을 칸에 나누어 한 그림에 그린다. cells: [{ P, draw(S) }](P 는 px 단위의 점들). 칸마다 왼쪽 위에 이름표(㉠, ㉡, …)를 적는다.
  function gridBoard(cells, o) {
    const opt = o || {}, cols = opt.cols || 2, W = opt.w || 138, b = Board(), rows = Math.ceil(cells.length / cols);
    let y = 0;
    for (let r = 0; r < rows; r += 1) {
      const row = cells.slice(r * cols, r * cols + cols), boxes = row.map((c) => boxOf(c.P)), h = Math.max(...boxes.map((bx) => bx[3] - bx[1])) + (opt.pad == null ? 46 : opt.pad);
      row.forEach((cell, c) => {
        // 변 바깥에 적는 길이·각 글까지 넣은 그림의 가로 범위를 따로 그려 재고, 그 범위를 칸 가운데에 놓는다. 칸보다 넓으면 줄인다(글이 칸 테두리를 넘지 않게).
        const span = (P) => { const probe = Board(); cell.draw(scene(P, probe)); const m = /viewBox="(\S+) \S+ (\S+) /.exec(probe.svg('')); return [Number(m[1]), Number(m[2])]; };
        let P = cell.P, [sx, sw] = span(P);
        for (let t = 0; t < 3 && sw > W - 8; t += 1) { P = scaled(P, ((W - 8) / sw) * 0.96); [sx, sw] = span(P); }
        const bx = boxOf(P), x0 = c * W, dx = x0 + (W - sw) / 2 - sx, dy = y + 10 + (h - 10 - (bx[3] - bx[1])) / 2 - bx[1], Q = {};
        for (const key of Object.keys(P)) Q[key] = [P[key][0] + dx, P[key][1] + dy];
        b.poly([[x0 + 2, y + 2], [x0 + W - 2, y + 2], [x0 + W - 2, y + h - 2], [x0 + 2, y + h - 2]], 'fill:#fff;stroke:#d9dee3;stroke-width:1');
        b.text([x0 + 14, y + 14], (opt.tags || SYM)[r * cols + c], { blue: true });
        cell.draw(scene(Q, b));
      });
      y += h;
    }
    return b;
  }
  const scaled = (P, k) => { const Q = {}; for (const key of Object.keys(P)) Q[key] = [P[key][0] * k, P[key][1] * k]; return Q; };
  // 직각이등변삼각형 ABC(∠A = 90°, AB = AC)와 꼭짓점 A 를 지나는 직선 l, 두 점 B, C 에서 l 에 내린 수선의 발 D, E. BD = p, CE = q 인 모양으로 그린다.
  // cross: 직선 l 이 삼각형을 가로지른다(두 점 B, C 가 l 의 서로 다른 쪽에 있다).
  function lineScene(p, q, cross, size) {
    const P0 = cross ? { A: [0, 0], B: [q, -p], C: [p, q], D: [q, 0], E: [p, 0] } : { A: [0, 0], B: [-q, p], C: [p, q], D: [-q, 0], E: [p, 0] };
    const lo = Math.min(P0.A[0], P0.D[0], P0.E[0]), hi = Math.max(P0.A[0], P0.D[0], P0.E[0]), pad = (hi - lo) * 0.16 + 1;
    const P = fitPts(Object.assign(P0, { l: [lo - pad, 0], m: [hi + pad, 0] }), size || [230, 130]), S = scene(P);
    S.seg('lm').poly('ABC').seg('BD CE').tick('AB AC').right('ADB AEC BAC');
    S.b.text([P.m[0] + 9, P.m[1]], sv('l'), { plain: true });
    return S;
  }
  const LINE_HEAD = `∠A = 90°이고 ${eq('AB', 'AC')}인 직각이등변삼각형 ABC의 두 꼭짓점 B, C에서 꼭짓점 A를 지나는 직선 ${V('l')}에 내린 수선의 발을 각각 D, E라 하자.`;
  const LINE_SAY = '직각이등변삼각형 ABC. ∠A에 직각 표시가 있고 변 AB와 변 AC에 길이가 같다는 표시가 있다. 꼭짓점 A를 지나는 직선 l 위에 세 점 D, A, E가 이 차례로 놓여 있고, 두 점 B, C는 직선 l의 같은 쪽에 있다. 선분 BD와 선분 CE는 직선 l과 수직으로 만난다. ';

  // ── 직각삼각형의 합동 조건 ──
  const RT_COND = ['RHA 합동', 'RHS 합동', 'SSS 합동', 'SAS 합동'];
  const TRIPLES = [[5, 4, 3], [5, 3, 4], [13, 12, 5], [13, 5, 12], [10, 8, 6], [10, 6, 8], [17, 15, 8], [17, 8, 15]];   // [빗변, 한 변, 다른 한 변]
  const TURNS = [90, 180, 270];
  B.addTypes(UNIT, 'rt', [
    T('rt-words', '직각삼각형의 합동 조건을 적은 문장의 빈칸', '①28', (d) => pickOne(d, '다음은 직각삼각형의 합동 조건이다. ㈎, ㈏에 알맞은 말을 차례로 나열한 것은?', '예각, 변', ['직각, 변', '예각, 각', '둔각, 변'], {
      figure: lines(['빗변의 길이와 한 ㈎의 크기가 각각 같은 두 직각삼각형은 서로 합동이다. (RHA 합동)', '빗변의 길이와 다른 한 ㈏의 길이가 각각 같은 두 직각삼각형은 서로 합동이다. (RHS 합동)']),
      explain: 'RHA 합동은 빗변의 길이와 한 예각의 크기가 각각 같을 때, RHS 합동은 빗변의 길이와 다른 한 변의 길이가 각각 같을 때이다.'
    })),
    T('rt-cond', '수치가 적힌 두 직각삼각형의 합동 조건', '①31 ②21', (d, n) => {
      const text = '그림의 두 직각삼각형 ABC와 DEF가 합동임을 설명할 때 이용하는 합동 조건은?';
      if (n === 0) {
        const al = d.pick([35, 40, 50, 55]), h = d.int(5, 12);
        const S = scene(sideBySide([laid(rtHyp(10, al), { R: 'C', U: 'A', W: 'B' }, 0, d.bool()), laid(rtHyp(10, al), { R: 'F', U: 'D', W: 'E' }, d.pick(TURNS), d.bool())], [225, 105]));
        S.poly('ABC').poly('DEF').right('ACB DFE').ang('BAC', deg(al)).ang('DEF', deg(90 - al)).len('AB', cm(h), 'C').len('DE', cm(h), 'F').names();
        return pickOne(d, text, RT_COND[0], RT_COND.slice(1), {
          figure: S.svg(`직각삼각형 ABC: ∠C에 직각 표시가 있고 ∠A = ${al}°, 변 AB의 길이는 ${h} cm. 직각삼각형 DEF: ∠F에 직각 표시가 있고 ∠E = ${90 - al}°, 변 DE의 길이는 ${h} cm`),
          explain: `△DEF에서 ∠D = 90° − ${90 - al}° = ${al}°이다. 두 직각삼각형에서 빗변의 길이가 ${eq('AB', 'DE')} = ${h} cm로 같고 한 예각의 크기가 ∠A = ∠D = ${al}°로 같으므로 △ABC ≡ △DEF (RHA 합동)이다.`, rule: 'rt-cond-rha'
        });
      }
      const [h, k, m] = d.pick(TRIPLES);
      const S = scene(sideBySide([laid(rtLegs(k, m), { R: 'C', U: 'B', W: 'A' }, 0, d.bool()), laid(rtLegs(k, m), { R: 'F', U: 'E', W: 'D' }, d.pick(TURNS), d.bool())], [225, 105]));
      S.poly('ABC').poly('DEF').right('ACB DFE').len('AB', cm(h), 'C').len('BC', cm(k), 'A').len('DE', cm(h), 'F').len('EF', cm(k), 'D').names();
      return pickOne(d, text, RT_COND[1], [RT_COND[0], RT_COND[2], RT_COND[3]], {
        figure: S.svg(`직각삼각형 ABC: ∠C에 직각 표시가 있고 변 AB의 길이는 ${h} cm, 변 BC의 길이는 ${k} cm. 직각삼각형 DEF: ∠F에 직각 표시가 있고 변 DE의 길이는 ${h} cm, 변 EF의 길이는 ${k} cm`),
        explain: `두 직각삼각형에서 빗변의 길이가 ${eq('AB', 'DE')} = ${h} cm로 같고 다른 한 변의 길이가 ${eq('BC', 'EF')} = ${k} cm로 같으므로 △ABC ≡ △DEF (RHS 합동)이다.`, rule: 'rt-cond-rhs'
      });
    }, { count: 2 }),
    T('rt-symbol', '합동인 두 직각삼각형을 기호로 나타내기', '②21 ①29', (d) => {
      const [h, k, m] = d.pick(TRIPLES), names = d.until(() => d.shuffle(['D', 'E', 'F']), (w) => w[1] + w[0] + w[2] !== 'DEF');   // 차례로 B(빗변과 주어진 변의 끝), A, C(직각)에 대응하는 꼭짓점
      const S = scene(sideBySide([laid(rtLegs(k, m), { R: 'C', U: 'B', W: 'A' }, 0, false), laid(rtLegs(k, m), { R: names[2], U: names[0], W: names[1] }, d.pick(TURNS), d.bool())], [225, 105]));
      const right = names[1] + names[0] + names[2], hyp = [names[0], names[1]].sort().join(''), leg = [names[0], names[2]].sort().join('');
      S.poly('ABC').poly('DEF').right(`ACB ${names[0]}${names[2]}${names[1]}`).len('AB', cm(h), 'C').len('BC', cm(k), 'A').len(hyp, cm(h), names[2]).len(leg, cm(k), names[1]).names();
      const all = ['DEF', 'DFE', 'EDF', 'EFD', 'FDE', 'FED'].filter((w) => w !== right);
      return pickOne(d, '그림의 두 직각삼각형이 합동임을 기호 ≡를 사용하여 바르게 나타낸 것은?', `△ABC ≡ △${right}`, d.shuffle(all).slice(0, 3).map((w) => `△ABC ≡ △${w}`), {
        figure: S.svg(`직각삼각형 ABC: ∠C에 직각 표시가 있고 변 AB의 길이는 ${h} cm, 변 BC의 길이는 ${k} cm. 직각삼각형 DEF: ∠${names[2]}에 직각 표시가 있고 변 ${hyp}의 길이는 ${h} cm, 변 ${leg}의 길이는 ${k} cm`),
        explain: `두 직각삼각형은 빗변의 길이가 ${h} cm, 다른 한 변의 길이가 ${k} cm로 각각 같으므로 RHS 합동이다. 직각인 꼭짓점 C와 ${names[2]}, 길이가 ${k} cm인 변의 다른 끝 점 B와 ${names[0]}, 나머지 꼭짓점 A와 ${jo(names[1], '이/가')} 대응하므로 △ABC ≡ △${right}이다.`
      });
    }),
    T('rt-match', '합동인 두 직각삼각형에서 변의 길이와 각의 크기', '①31 ②22', (d, n) => {
      if (n === 0) {
        // 빗변과 30°, 60°: 한 예각을 구해야 RHA 합동임을 알 수 있다.
        const h = 2 * d.int(3, 9), k = h / 2;
        const S = scene(sideBySide([laid(rtHyp(10, 30), { R: 'C', U: 'A', W: 'B' }, 90, d.bool()), laid(rtHyp(10, 30), { R: 'F', U: 'D', W: 'E' }, d.pick([0, 180]), d.bool())], [230, 118]));
        S.poly('ABC').poly('DEF').right('ACB DFE').ang('BAC', '30°').ang('DEF', '60°').len('AB', cm(h), 'C').len('BC', cm(k), 'A').len('DE', cm(h), 'F').names();
        return cmQ(`∠C = ∠F = 90°인 두 직각삼각형 ABC와 DEF에서 ∠A = 30°, ∠E = 60°이고 ${nb(`${sg('AB')} = ${sg('DE')} = ${h} cm`)}, ${nb(`${sg('BC')} = ${k} cm`)}일 때, ${sg('EF')}의 길이는?`, k, {
          figure: S.svg(`직각삼각형 ABC: ∠C에 직각 표시가 있고 ∠A = 30°, 변 AB의 길이는 ${h} cm, 변 BC의 길이는 ${k} cm. 직각삼각형 DEF: ∠F에 직각 표시가 있고 ∠E = 60°, 변 DE의 길이는 ${h} cm`),
          explain: `△DEF에서 ∠D = 90° − 60° = 30°이다. 빗변의 길이가 같고 ∠A = ∠D이므로 △ABC ≡ △DEF (RHA 합동)이다. ${sg('EF')}의 대응변은 ${sg('BC')}이므로 ${sg('EF')}의 길이는 ${k} cm이다.`,
          facts: { calc: [[`${k}`, 0]], rule: 'rt-match-len' }
        });
      }
      const al = d.until(() => d.int(32, 58), (v) => Math.abs(v - 45) >= 4);
      const S = scene(sideBySide([laid(rtHyp(10, al), { R: 'B', U: 'A', W: 'C' }, 270, d.bool()), laid(rtHyp(10, al), { R: 'E', U: 'D', W: 'F' }, d.pick([0, 90, 180]), d.bool())], [230, 118]));
      S.poly('ABC').poly('DEF').right('ABC DEF').tick('AC DF', 2).tick('AB DE').ang('BAC', deg(al)).ang('DFE', sv('x')).names();
      return degQ(`∠B = ∠E = 90°인 두 직각삼각형 ABC와 DEF에서 ${eq('AC', 'DF')}, ${eq('AB', 'DE')}이다. ∠A = ${al}°일 때, ∠F의 크기는?`, 90 - al, {
        figure: S.svg(`직각삼각형 ABC: ∠B에 직각 표시가 있고 ∠A = ${al}°. 직각삼각형 DEF: ∠E에 직각 표시가 있고 ∠F = x. 변 AC와 변 DF에 길이가 같다는 표시(두 줄), 변 AB와 변 DE에 길이가 같다는 표시(한 줄)가 있다`),
        explain: `빗변의 길이가 ${eq('AC', 'DF')}로 같고 다른 한 변의 길이가 ${eq('AB', 'DE')}로 같으므로 △ABC ≡ △DEF (RHS 합동)이다. ∠F = ∠C = 90° − ${al}° = ${90 - al}°이다.`,
        facts: { calc: [[`90-${al}`, 0]], unseen: [90] }
      });
    }, { count: 2 }),
    T('rt-pairs', '여러 직각삼각형에서 합동인 것끼리 짝 짓기', '①29 ②23', (d) => {
      const big = d.bool(), al = d.pick([35, 40, 50, 55]), be = Math.min(al, 90 - al), h1 = big ? d.pick([12, 13, 14]) : d.pick([6, 7]), u = 84 / h1, [h2, k2, m2] = big ? d.pick([[10, 8, 6], [10, 6, 8]]) : d.pick([[5, 4, 3], [5, 3, 4]]);
      // 0·1: 빗변과 한 예각(RHA), 2·3: 빗변과 다른 한 변(RHS), 4: 빗변이 아닌 변과 한 예각, 5: 직각을 낀 두 변
      const specs = [
        { P: laid(rtHyp(h1, al), null, 0, d.bool()), hyp: cm(h1), angU: deg(al), said: `빗변의 길이가 ${h1} cm이고 한 예각의 크기가 ${al}°` },
        { P: laid(rtHyp(h1, al), null, d.pick(TURNS), d.bool()), hyp: cm(h1), angW: deg(90 - al), said: `빗변의 길이가 ${h1} cm이고 한 예각의 크기가 ${90 - al}°` },
        { P: laid(rtLegs(k2, m2), null, d.pick([0, 180]), d.bool()), hyp: cm(h2), legU: cm(k2), said: `빗변의 길이가 ${h2} cm이고 다른 한 변의 길이가 ${k2} cm` },
        { P: laid(rtLegs(k2, m2), null, d.pick([90, 270]), d.bool()), hyp: cm(h2), legU: cm(k2), said: `빗변의 길이가 ${h2} cm이고 다른 한 변의 길이가 ${k2} cm` },
        { P: laid(rtLegs(h1, h1 * Math.tan(be * RAD)), null, d.pick([0, 90, 180]), d.bool()), legU: cm(h1), angU: deg(be), said: `직각을 낀 한 변의 길이가 ${h1} cm이고 그 변의 한 끝에 있는 예각의 크기가 ${be}°` },
        { P: laid(rtLegs(k2, h2), null, d.pick([0, 90, 270]), d.bool()), legU: cm(k2), legW: cm(h2), said: `직각을 낀 두 변의 길이가 ${k2} cm, ${h2} cm` }
      ];
      const order = d.shuffle([0, 1, 2, 3, 4, 5]), tagOf = (i) => SYM[order.indexOf(i)];
      const b = gridBoard(order.map((i) => ({ P: scaled(specs[i].P, u), draw: (S) => {
        const s = specs[i];
        S.poly('RUW').right('URW');
        if (s.hyp) S.len('UW', s.hyp, 'R'); if (s.legU) S.len('RU', s.legU, 'W'); if (s.legW) S.len('RW', s.legW, 'U');
        if (s.angU) S.ang('RUW', s.angU); if (s.angW) S.ang('RWU', s.angW);
      } })), { pad: 58 });
      const pair = (i, j, key) => { const [x, y] = [tagOf(i), tagOf(j)].sort(); return `${jo(x, '과/와')} ${y}, ${key} 합동`; };
      const both = (i, j) => { const [x, y] = [tagOf(i), tagOf(j)].sort(); return `${jo(x, '과/와')} ${jo(y, '은/는')}`; };
      const rha = d.bool(), right = rha ? pair(0, 1, 'RHA') : pair(2, 3, 'RHS');
      return pickOne(d, '다음 직각삼각형 가운데 서로 합동인 두 삼각형과 그 합동 조건을 바르게 짝 지은 것은?', right, [rha ? pair(2, 3, 'RHA') : pair(0, 1, 'RHS'), pair(d.pick([0, 1]), 4, 'RHA'), pair(d.pick([2, 3]), 5, 'RHS')], {
        figure: b.svg('직각삼각형 여섯 개. ' + order.map((i, at) => `${SYM[at]}: ${specs[i].said}`).join('. ')),
        explain: `${jo(tagOf(1), '은/는')} 나머지 한 예각의 크기가 90° − ${90 - al}° = ${al}°이므로 ${both(0, 1)} 빗변의 길이와 한 예각의 크기가 각각 같다(RHA 합동). ${both(2, 3)} 빗변의 길이와 다른 한 변의 길이가 각각 같다(RHS 합동). ${tagOf(4)}의 ${h1} cm와 ${tagOf(5)}의 ${h2} cm는 빗변의 길이가 아니므로 이 두 삼각형은 다른 삼각형과 합동이 아니다.`
      });
    }),
    T('rt-conditions', '두 직각삼각형이 합동이 되는 조건', '①30 ②24', (d, n) => {
      if (n === 0) {
        const S = scene(sideBySide([laid(rtHyp(10, 56), { R: 'C', U: 'B', W: 'A' }, 0, true), laid(rtHyp(10, 56), { R: 'F', U: 'E', W: 'D' }, 0, true)], [200, 100], 50));
        S.poly('ABC').poly('DEF').right('ACB DFE').names();
        const good = [[`${eq('AB', 'DE')}, ${eq('AC', 'DF')}`, 'RHS'], [`${eq('AB', 'DE')}, ${eq('BC', 'EF')}`, 'RHS'], [`${eq('AB', 'DE')}, ∠A = ∠D`, 'RHA'], [`${eq('AB', 'DE')}, ∠B = ∠E`, 'RHA'], [`${eq('AC', 'DF')}, ${eq('BC', 'EF')}`, 'SAS'], [`${eq('AC', 'DF')}, ∠A = ∠D`, 'ASA']];
        const picked = d.until(() => d.shuffle(good).slice(0, 3), (w) => w.some((g) => g[1] === 'RHA') && w.some((g) => g[1] === 'RHS'));
        return pickOne(d, '∠C = ∠F = 90°인 두 직각삼각형 ABC와 DEF가 합동이 되는 조건이 아닌 것은?', '∠A = ∠D, ∠B = ∠E', picked.map((g) => g[0]), {
          figure: S.svg('직각삼각형 ABC와 직각삼각형 DEF가 같은 방향으로 놓여 있다. ∠C와 ∠F에 직각 표시가 있다'),
          explain: `세 내각의 크기가 각각 같아도 변의 길이는 다를 수 있으므로 ∠A = ∠D, ∠B = ∠E만으로는 합동이라고 할 수 없다. ${picked.map((g) => `${g[0]}이면 ${g[1]} 합동`).join(', ')}이다.`
        });
      }
      const al = d.pick([25, 30, 35, 40, 50, 55, 60, 65]), h = d.int(6, 12);
      const S = scene(fitPts(laid(rtHyp(10, al), { R: 'C', U: 'A', W: 'B' }, 0, d.bool()), [150, 105]));
      S.poly('ABC').right('ACB').ang('BAC', deg(al)).len('AB', cm(h), 'C').names();
      const rows = d.shuffle([[`${sg('DE')} = ${h} cm, ∠D = ${al}°`, true], [`${sg('DE')} = ${h} cm, ∠E = ${90 - al}°`, true], [`${sg('DF')} = ${h} cm, ∠D = ${al}°`, false], [`${sg('EF')} = ${h} cm, ∠E = ${90 - al}°`, false]]);
      return allQ(d, '그림과 같이 ∠C = 90°인 직각삼각형 ABC가 있다. ∠F = 90°인 직각삼각형 DEF에 대한 다음 조건 가운데 △ABC ≡ △DEF가 되는 것을 모두 고른 것은?', SYM, rows.map((r) => r[1]), {
        figure: S.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 ∠A = ${al}°, 변 AB의 길이는 ${h} cm`) + tagged(rows.map((r) => nb(r[0]))),
        explain: `△DEF의 빗변은 직각 ∠F의 대변인 ${sg('DE')}이다. ${sg('DE')} = ${h} cm이고 ∠D = ${al}°(또는 ∠E = ${90 - al}°)이면 빗변의 길이와 한 예각의 크기가 각각 같으므로 RHA 합동이다. ${sg('DF')}, ${sg('EF')}는 빗변이 아니므로 그 길이가 ${h} cm이면 △ABC와 합동이 아니다.`
      });
    }, { count: 2 }),
    T('rt-proof-line', '직각이등변삼각형과 꼭짓점을 지나는 직선: 합동임을 설명하는 과정의 빈칸', '①32', (d) => {
      const [p, q] = d.pick([[4, 3], [5, 3], [5, 4], [6, 4], [7, 5]]), S = lineScene(p, q, false).names({ D: 90, A: 90, E: 90 });
      const rows = ['△ABD와 △CAE에서', `∠ADB = ㈎ = 90°, ${eq('AB', 'CA')}`, '∠DBA = 90° − ∠DAB이고 ∠DAB = 90° − ∠EAC이므로 ∠DBA = ㈏', '따라서 △ABD ≡ △CAE (㈐ 합동)이다.'];
      return pickOne(d, `${LINE_HEAD} 다음은 △ABD ≡ △CAE임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`, '∠CEA, ∠EAC, RHA', ['∠CEA, ∠ECA, RHA', '∠CEA, ∠EAC, RHS', '∠CAE, ∠EAC, RHA'], {
        figure: S.svg(LINE_SAY.trim()) + lines(rows),
        explain: `두 수선의 발에서 ∠ADB = ∠CEA = 90°이다. ∠DAB + ∠EAC = 180° − 90° = 90°이므로 ∠DBA = 90° − ∠DAB = ∠EAC이다. 두 직각삼각형의 빗변의 길이가 ${eq('AB', 'CA')}로 같고 한 예각의 크기가 같으므로 RHA 합동이다.`
      });
    }),
    T('rt-proof-perp', '두 수선의 길이가 같음을 설명하는 과정의 빈칸', '①33', (d, n) => {
      if (n === 0) {
        const t = d.int(28, 52), P0 = { P: [0, 0], A: at([0, 0], 60, 180 - t), B: at([0, 0], 60, -t) };
        Object.assign(P0, { C: [P0.A[0], 0], D: [P0.B[0], 0], l: [P0.A[0] - 30, 0], r: [P0.B[0] + 30, 0], a: at([0, 0], 84, 180 - t), b: at([0, 0], 84, -t) });
        const S = scene(fitPts(P0, [230, 125]));
        S.seg('lr ab AC BD').tick('AP BP').right('ACP BDP').dot('AB').names({ P: 270, A: 90 - t, B: 90 - t, C: 270, D: 90 });
        S.b.text([S.P.r[0] + 8, S.P.r[1]], sv('l'), { plain: true }).text(at(S.P.a, 9, 180 - t), sv('m'), { plain: true });
        const rows = ['△ACP와 △BDP에서', `∠ACP = ∠BDP = 90°, ${eq('AP', 'BP')}`, '∠APC = ㈎ (맞꼭지각)', `따라서 △ACP ≡ △BDP (㈏ 합동)이므로 ${sg('AC')} = ㈐이다.`];
        return pickOne(d, `직선 ${V('l')} 위의 점 P를 지나는 직선 ${V('m')} 위에 ${eq('AP', 'BP')}가 되도록 두 점 A, B를 잡고, 두 점 A, B에서 직선 ${V('l')}에 내린 수선의 발을 각각 C, D라 하자. 다음은 ${eq('AC', 'BD')}임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`,
          `∠BPD, RHA, ${sg('BD')}`, [`∠BPD, RHS, ${sg('BD')}`, `∠PBD, RHA, ${sg('BD')}`, `∠BPD, RHA, ${sg('DP')}`], {
            figure: S.svg('가로로 놓인 직선 l과 비스듬한 직선 m이 점 P에서 만난다. 직선 m 위에서 점 A는 직선 l의 위쪽에, 점 B는 아래쪽에 있고 선분 AP와 선분 BP에 길이가 같다는 표시가 있다. 점 A에서 직선 l에 내린 수선의 발이 C, 점 B에서 내린 수선의 발이 D이고 두 곳에 직각 표시가 있다') + lines(rows),
            explain: `∠APC와 ∠BPD는 맞꼭지각이므로 크기가 같다. 두 직각삼각형의 빗변의 길이가 ${eq('AP', 'BP')}로 같고 한 예각의 크기가 같으므로 △ACP ≡ △BDP (RHA 합동)이다. 대응변의 길이가 같으므로 ${eq('AC', 'BD')}이다.`
          });
      }
      const a = 2 * d.int(22, 34), S = isoScene(a, (P) => ({ D: foot(P.B, P.A, P.C), E: foot(P.C, P.A, P.B) }), [175, 150], 0.22);
      S.seg('BD CE').right('BDC CEB').names();
      const rows = ['△EBC와 △DCB에서', `∠BEC = ∠CDB = 90°, ${sg('BC')}는 공통`, `${eq('AB', 'AC')}이므로 ∠EBC = ㈎`, `따라서 △EBC ≡ △DCB (㈏ 합동)이므로 ${sg('CE')} = ㈐이다.`];
      return pickOne(d, `${eq('AB', 'AC')}인 이등변삼각형 ABC의 두 꼭짓점 B, C에서 변 AC, AB에 내린 수선의 발을 각각 D, E라 하자. 다음은 ${eq('BD', 'CE')}임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`,
        `∠DCB, RHA, ${sg('BD')}`, [`∠DCB, RHS, ${sg('BD')}`, `∠DBC, RHA, ${sg('BD')}`, `∠DCB, RHA, ${sg('CD')}`], {
          figure: S.svg(`${ISO_SAY}점 D는 변 AC 위에, 점 E는 변 AB 위에 있고 선분 BD와 선분 CE가 그어져 있다. ∠BDC와 ∠CEB에 직각 표시가 있다`) + lines(rows),
          explain: `이등변삼각형의 두 밑각의 크기는 같으므로 ∠EBC = ∠DCB이다. 두 직각삼각형의 빗변 ${sg('BC')}가 공통이고 한 예각의 크기가 같으므로 △EBC ≡ △DCB (RHA 합동)이다. ${sg('CE')}의 대응변은 ${sg('BD')}이다.`
        });
    }, { count: 2 }),
    T('rt-line', '직각이등변삼각형과 꼭짓점을 지나는 직선: 선분의 길이와 사각형의 넓이', '①34 ②25', (d, n) => {
      const [p, q] = d.until(() => [d.int(3, 9), d.int(3, 9)], (w) => w[0] !== w[1] && (w[0] + w[1]) % 2 === 0 && Math.max(w[0] / w[1], w[1] / w[0]) <= 2.2), S = lineScene(p, q, false);
      S.len('BD', cm(p), 'A').len('CE', cm(q), 'A').names({ D: 90, A: 90, E: 90 });
      const why = `△ABD와 △CAE에서 ∠ADB = ∠CEA = 90°, ${eq('AB', 'CA')}, ∠DBA = 90° − ∠DAB = ∠EAC이므로 △ABD ≡ △CAE (RHA 합동)이다. 따라서 ${eq('AD', 'CE')} = ${q} cm, ${eq('AE', 'BD')} = ${p} cm이다.`;
      const said = `${LINE_SAY}선분 BD의 길이는 ${p} cm, 선분 CE의 길이는 ${q} cm`;
      if (n === 0) return cmQ(`${LINE_HEAD} ${nb(`${sg('BD')} = ${p} cm`)}, ${nb(`${sg('CE')} = ${q} cm`)}일 때, ${sg('DE')}의 길이는?`, p + q, {
        figure: S.svg(said), explain: `${why} ${sg('DE')} = ${q} + ${p} = ${p + q}(cm)이다.`, facts: { calc: [[`${p}+${q}`, 0]] }
      });
      const area = (p + q) * (p + q) / 2;
      return cm2Q(`${LINE_HEAD} ${nb(`${sg('BD')} = ${p} cm`)}, ${nb(`${sg('CE')} = ${q} cm`)}일 때, 사각형 DBCE의 넓이는?`, area, {
        figure: S.svg(said), explain: `${why} ${sg('DE')} = ${p + q} cm이다. 사각형 DBCE는 ${sg('BD')} ∥ ${sg('CE')}인 사다리꼴이므로 넓이는 ${HALF} × (${p} + ${q}) × ${p + q} = ${area}(cm²)이다.`,
        facts: { calc: [[`(${p}+${q})*(${p}+${q})/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('rt-square', '정사각형의 두 꼭짓점에서 한 선분에 내린 수선: 합동인 삼각형', '①35 ②26', (d) => {
      const [p, q] = d.pick([[4, 3], [5, 3], [5, 2], [7, 4], [6, 4], [7, 3]]), S = squareScene(p, q).names();
      return pickOne(d, '정사각형 ABCD의 변 CD 위에 점 E가 있다. 두 꼭짓점 A, C에서 선분 BE에 내린 수선의 발을 각각 F, G라 할 때, △ABF와 합동인 삼각형과 그 합동 조건을 바르게 짝 지은 것은?', '△BCG, RHA 합동', ['△BCG, RHS 합동', '△CEG, RHA 합동', '△BCE, RHS 합동'], {
        figure: S.svg(SQUARE_SAY.trim()),
        explain: `∠AFB = ∠BGC = 90°이고 정사각형의 변이므로 ${eq('AB', 'BC')}이다. ∠ABF = 90° − ∠CBG = ∠BCG이다. 두 직각삼각형의 빗변의 길이와 한 예각의 크기가 각각 같으므로 △ABF ≡ △BCG (RHA 합동)이다.`
      });
    }),
    T('rt-mid-perp', '이등변삼각형의 밑변의 중점에서 두 변에 내린 수선', '①36', (d) => {
      const k = d.int(3, 9), draw = (w) => midPerpScene(w).tick('BM MC', 2).len('DM', cm(k), 'B', { gap: 3, t: 0.4 }).len('EM', `${sv('x')} cm`, 'C', { gap: 3, t: 0.4 }).names();
      const a = d.until(() => 2 * d.int(30, 45), (w) => !draw(w).clash()), S = draw(a);
      return cmQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 밑변 BC의 중점 M에서 두 변 AB, AC에 내린 수선의 발을 각각 D, E라 하자. ${nb(`${sg('MD')} = ${k} cm`)}일 때, ${sg('ME')}의 길이는?`, k, {
        figure: S.svg(`${ISO_SAY}점 M은 변 BC 위에 있고 선분 BM과 선분 MC에 길이가 같다는 표시(두 줄)가 있다. 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 선분 MD, ME가 그어져 있다. ∠MDB와 ∠MEC에 직각 표시가 있다. 선분 MD의 길이는 ${k} cm, 선분 ME의 길이는 x cm`),
        explain: `△DBM과 △ECM에서 ∠BDM = ∠CEM = 90°, ${eq('BM', 'CM')}, ∠B = ∠C(이등변삼각형의 밑각)이므로 △DBM ≡ △ECM (RHA 합동)이다. ${eq('ME', 'MD')} = ${k} cm이다.`,
        facts: { calc: [[`${k}`, 0]], rule: 'rt-mid' }
      });
    }),
    T('rt-mid-claims', '한 변의 중점에서 두 변에 내린 수선과 RHS 합동: 옳지 않은 것', '심22', (d) => {
      const T2 = scene(midPerpScene(2 * d.int(26, 42)).P).poly('BCA').seg('MD ME').right('MDB MEC').tick('BM MC', 2).tick('BD CE').names();
      return sayQ(d, `△ABC에서 변 BC의 중점 M에서 두 변 AB, AC에 내린 수선의 발을 각각 D, E라 하자. ${eq('BD', 'CE')}일 때, 다음 중 옳다고 할 수 없는 것은?`,
        [eq('DM', 'EM'), '∠B = ∠C', '∠DMB = ∠EMC', eq('AB', 'AC'), '△DBM ≡ △ECM'],
        [[eq('AB', 'BC'), `△DBM ≡ △ECM (RHS 합동)이므로 ∠B = ∠C이고, 길이가 같은 두 변은 ${sg('AB')}와 ${sg('AC')}이다.`, [eq('AB', 'AC')]], [eq('BD', 'DM'), `합동인 두 삼각형에서 ${sg('BD')}의 대응변은 ${sg('CE')}이다. ${sg('BD')}와 ${sg('DM')}의 길이가 같다고 할 수 없다.`], ['∠BMD = ∠B', '∠BMD = 90° − ∠B이므로 ∠B의 크기가 45°일 때만 같다.']], false,
        T2.svg('삼각형 ABC. 점 M은 변 BC 위에 있고 선분 BM과 선분 MC에 길이가 같다는 표시(두 줄)가 있다. 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 선분 MD, ME가 그어져 있다. ∠MDB와 ∠MEC에 직각 표시가 있고, 선분 BD와 선분 CE에 길이가 같다는 표시(한 줄)가 있다'));
    }),
    T('rt-two-perps', '길이가 같은 두 수선으로 각의 크기 구하기', '①37 ②27', (d, n) => {
      if (n === 0) {
        // 변 AC 의 중점 M 에서 두 변 AB, BC 에 내린 수선의 길이가 같다: ∠A = ∠C
        const a = d.int(32, 52), x = 180 - 2 * a;
        const P0 = baseTri(a, a), S = scene(fitPts({ A: P0.B, C: P0.C, B: P0.A, M: mid(P0.B, P0.C), D: foot(mid(P0.B, P0.C), P0.B, P0.A), E: foot(mid(P0.B, P0.C), P0.C, P0.A) }, a < 45 ? [240, 110] : [200, 150]));
        S.poly('ACB').seg('MD ME').right('MDA MEC').tick('MD ME').tick('AM MC', 2).ang('BAC', deg(a)).ang('ABC', sv('x'), { square: false }).names();
        return degQ(`△ABC에서 변 AC의 중점 M에서 두 변 AB, BC에 내린 수선의 발을 각각 D, E라 하자. ${eq('MD', 'ME')}이고 ∠A = ${a}°일 때, ∠B의 크기는?`, x, {
          figure: S.svg(`삼각형 ABC. 점 M은 변 AC 위에 있고 선분 AM과 선분 MC에 길이가 같다는 표시(두 줄)가 있다. 점 D는 변 AB 위에, 점 E는 변 BC 위에 있고 선분 MD, ME에 길이가 같다는 표시(한 줄)가 있다. ∠MDA와 ∠MEC에 직각 표시가 있다. ∠A = ${a}°, ∠B = x`),
          explain: `△ADM과 △CEM에서 ∠ADM = ∠CEM = 90°, ${eq('AM', 'CM')}, ${eq('MD', 'ME')}이므로 △ADM ≡ △CEM (RHS 합동)이다. ∠C = ∠A = ${a}°이므로 ∠B = 180° − ${a}° × 2 = ${x}°이다.`,
          facts: { calc: [[`180-${a}*2`, 0]], unseen: [180, 2] }
        });
      }
      const a = 2 * d.int(20, 36), x = a / 2;
      const S = scene(fitPts((() => { const P = isoTri(a); return Object.assign(P, { D: foot(P.B, P.A, P.C), E: foot(P.C, P.A, P.B) }); })(), [175, 155]));
      S.poly('BCA').seg('BD CE').right('BDC CEB').tick('BE CD').ang('BAC', deg(a)).ang('ECB', sv('x')).names();
      return degQ(`△ABC의 두 꼭짓점 B, C에서 변 AC, AB에 내린 수선의 발을 각각 D, E라 하자. ${eq('BE', 'CD')}이고 ∠A = ${a}°일 때, ∠ECB의 크기는?`, x, {
        figure: S.svg(`삼각형 ABC. 점 D는 변 AC 위에, 점 E는 변 AB 위에 있고 선분 BD와 선분 CE가 그어져 있다. ∠BDC와 ∠CEB에 직각 표시가 있고, 선분 BE와 선분 CD에 길이가 같다는 표시가 있다. ∠A = ${a}°, ∠ECB = x`),
        explain: `△EBC와 △DCB에서 ∠BEC = ∠CDB = 90°, ${sg('BC')}는 공통, ${eq('BE', 'CD')}이므로 △EBC ≡ △DCB (RHS 합동)이다. ∠EBC = ∠DCB이므로 ∠EBC = (180° − ${a}°) ÷ 2 = ${90 - x}°이다. △EBC에서 ∠ECB = 90° − ${90 - x}° = ${x}°이다.`,
        facts: { calc: [[`90-(180-${a})/2`, 0]], unseen: [90, 180, 2] }
      });
    }, { count: 2 }),
    T('rt-rhs-length', '빗변 위에 한 변과 같은 길이를 잡은 직각삼각형: 선분의 길이와 둘레', '①38 심24·25', (d, n) => {
      if (n === 0) {
        const [a, b, c, db, de, be] = d.pick([[8, 6, 10, 4, 3, 5], [16, 12, 20, 8, 6, 10], [9, 12, 15, 3, 4, 5], [18, 24, 30, 6, 8, 10], [24, 18, 30, 12, 9, 15], [36, 15, 39, 24, 10, 26]]);
        const S = cutScene(a, b, c).len('BE', cm(be), 'A').dim('BC', cm(a), 'A', 22).len('DE', `${sv('x')} cm`, 'B', { gap: 3 }).names();
        return cmQ(`${CUT_HEAD} ${nb(`${sg('BE')} = ${be} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}일 때, ${sg('DE')}의 길이는?`, de, {
          figure: S.svg(`${CUT_SAY}선분 BE의 길이는 ${be} cm, 변 BC의 길이는 ${a} cm, 선분 DE의 길이는 x cm`),
          explain: `${CUT_WHY} ${sg('DE')} = ${sg('CE')} = ${a} − ${be} = ${de}(cm)이다.`, facts: { calc: [[`${a}-${be}`, 0]] }
        });
      }
      const [a, b, c] = d.pick([[8, 6, 10], [12, 5, 13], [15, 8, 17], [8, 15, 17], [4, 3, 5], [12, 9, 15], [24, 7, 25], [12, 16, 20]]), per = c - b + a;
      const S = cutScene(a, b, c).len('AC', cm(b), 'B').dim('BC', cm(a), 'A', 24).dim('AB', cm(c), 'C', 24).names();
      return cmQ(`${CUT_HEAD} ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}일 때, △DBE의 둘레의 길이는?`, per, {
        figure: S.svg(`${CUT_SAY}변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
        explain: `${CUT_WHY} ${sg('DB')} = ${c} − ${b} = ${c - b}(cm)이고 ${sg('DE')} + ${sg('EB')} = ${sg('CE')} + ${sg('EB')} = ${sg('BC')} = ${a} cm이다. △DBE의 둘레의 길이는 ${c - b} + ${a} = ${per}(cm)이다.`,
        facts: { calc: [[`${c}-${b}+${a}`, 0]] }
      });
    }, { count: 2 }),
    T('rt-rhs-angle', '빗변을 함께 가진 두 직각삼각형의 RHS 합동으로 각의 크기 구하기', '①39 ②28 심23', (d, n) => {
      if (n === 0) {
        // DE = CE: 선분 BE 가 ∠B 를 이등분한다.
        const g = d.int(59, 71), x = 2 * g - 90, hb = 90 - g;
        const S = scene(fitPts((() => { const P = { C: [0, 0], B: [-100, 0], A: [0, -100 * Math.tan(2 * hb * RAD)] }; P.E = [0, -100 * Math.tan(hb * RAD)]; P.D = foot(P.E, P.A, P.B); return P; })(), g > 66 ? [165, 165] : [220, 150]));
        S.poly('BCA').seg('DE BE').right('BCA EDA').tick('DE CE').ang('DEB', deg(g)).ang('BAC', sv('x')).names();
        return degQ(`∠C = 90°인 직각삼각형 ABC에서 변 AC 위의 점 E에서 변 AB에 내린 수선의 발을 D라 하자. ${eq('DE', 'CE')}이고 ∠DEB = ${g}°일 때, ∠A의 크기는?`, x, {
          figure: S.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 선분 DE와 선분 BE가 그어져 있다. ∠EDA에 직각 표시가 있고 선분 DE와 선분 CE에 길이가 같다는 표시가 있다. ∠DEB = ${g}°, ∠A = x`),
          explain: `△BDE와 △BCE에서 ∠BDE = ∠BCE = 90°, ${sg('BE')}는 공통, ${eq('DE', 'CE')}이므로 △BDE ≡ △BCE (RHS 합동)이다. ∠DBE = ∠CBE = 90° − ${g}° = ${hb}°이므로 ∠ABC = ${2 * hb}°이다. ∠A = 90° − ${2 * hb}° = ${x}°이다.`,
          facts: { calc: [[`90-2*(90-${g})`, 0]], unseen: [90, 2] }
        });
      }
      // AB = AE: 선분 AD 가 ∠A 를 이등분한다.
      const t = d.int(26, 34), x = 2 * t;
      const S = scene(fitPts((() => { const P = { B: [0, 0], A: [0, -100], C: [100 * Math.tan(2 * t * RAD), 0] }; P.D = [100 * Math.tan(t * RAD), 0]; P.E = foot(P.D, P.A, P.C); return P; })(), [240, 125]));
      S.poly('BCA').seg('AD DE').right('ABC DEC').tick('AB AE').ang('EAD', deg(t), { r: 30 }).ang('EDC', sv('x')).names();
      return degQ(`∠B = 90°인 직각삼각형 ABC에서 변 BC 위의 점 D에서 변 AC에 내린 수선의 발을 E라 하자. ${eq('AB', 'AE')}이고 ∠EAD = ${t}°일 때, ∠EDC의 크기는?`, x, {
        figure: S.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있다. 점 D는 변 BC 위에, 점 E는 변 AC 위에 있고 선분 AD와 선분 DE가 그어져 있다. ∠DEC에 직각 표시가 있고 변 AB와 선분 AE에 길이가 같다는 표시가 있다. ∠EAD = ${t}°, ∠EDC = x`),
        explain: `△ABD와 △AED에서 ∠ABD = ∠AED = 90°, ${sg('AD')}는 공통, ${eq('AB', 'AE')}이므로 △ABD ≡ △AED (RHS 합동)이다. ∠BAD = ∠EAD = ${t}°이므로 ∠BAC = ${2 * t}°이고 ∠C = 90° − ${2 * t}° = ${90 - 2 * t}°이다. △EDC에서 ∠EDC = 90° − ${90 - 2 * t}° = ${x}°이다.`,
        facts: { calc: [[`90-(90-2*${t})`, 0]], unseen: [90, 2] }
      });
    }, { count: 2 })
  ]);

  // 정사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위)의 변 CD 위의 점 E, 두 꼭짓점 A, C 에서 선분 BE 에 내린 수선의 발 F, G. AF = p, CG = q 인 모양으로 그린다.
  function squareScene(p, q) {
    const s = 150, P = { A: [0, 0], B: [0, s], C: [s, s], D: [s, 0], E: [s, s - s * q / p] };
    P.F = foot(P.A, P.B, P.E); P.G = foot(P.C, P.B, P.E);
    return scene(P).poly('ABCD').seg('BE AF CG').right('AFB CGB');
  }
  const SQUARE_SAY = '정사각형 ABCD. 꼭짓점 A는 왼쪽 위, B는 왼쪽 아래, C는 오른쪽 아래, D는 오른쪽 위에 있다. 점 E는 변 CD 위에 있고 선분 BE가 그어져 있다. 점 A에서 선분 BE에 내린 수선의 발이 F, 점 C에서 내린 수선의 발이 G이고 두 곳에 직각 표시가 있다. 선분 BE 위에 점 B, F, G, E가 이 차례로 놓여 있다. ';
  // AB = AC 인 이등변삼각형 ABC(꼭지각 a)와 밑변 BC 의 중점 M, 점 M 에서 두 변 AB, AC 에 내린 수선의 발 D, E
  function midPerpScene(a) {
    const P0 = isoTri(a), M = mid(P0.B, P0.C), S = scene(fitPts(Object.assign(P0, { M, D: foot(M, P0.A, P0.B), E: foot(M, P0.A, P0.C) }), a >= 76 ? [230, 125] : [185, 150]));
    return S.poly('BCA').tick('AB AC', 1, 0.2).seg('MD ME').right('MDB MEC');
  }
  // ∠C = 90°인 직각삼각형 ABC(BC = a, CA = b, AB = c)의 빗변 AB 위에 AD = AC 인 점 D, 점 D 를 지나고 AB 에 수직인 직선이 변 BC 와 만나는 점 E. 선분 AE 를 긋는다.
  function cutScene(a, b, c) {
    const P0 = { C: [0, 0], B: [-a, 0], A: [0, -b] }; P0.D = along(P0.A, P0.B, b); P0.E = [-b * (c - b) / a, 0];
    return scene(fitPts(P0, b / a > 1 ? [170, 165] : [225, 150])).poly('BCA').seg('DE AE').right('BCA EDB').tick('AC AD');
  }
  const CUT_HEAD = `∠C = 90°인 직각삼각형 ABC의 변 AB 위에 ${eq('AC', 'AD')}가 되도록 점 D를 잡고, 점 D를 지나고 변 AB에 수직인 직선이 변 BC와 만나는 점을 E라 하자.`;
  const CUT_SAY = '직각삼각형 ABC. ∠C에 직각 표시가 있다. 점 D는 변 AB 위에, 점 E는 변 BC 위에 있고 선분 DE와 선분 AE가 그어져 있다. ∠EDB에 직각 표시가 있고 변 AC와 선분 AD에 길이가 같다는 표시가 있다. ';
  const CUT_WHY = `△ADE와 △ACE에서 ∠ADE = ∠ACE = 90°, ${sg('AE')}는 공통, ${eq('AD', 'AC')}이므로 △ADE ≡ △ACE (RHS 합동)이고 ${eq('DE', 'CE')}이다.`;

  // ── 각의 이등분선의 성질 ──
  // ∠AOB(크기 w)와 그 이등분선 위의 점 P, 점 P 에서 두 변 OA, OB 에 내린 수선의 발 Q, R
  function wedgeScene(w) {
    const O = [0, 0], P0 = { O, A: at(O, 168, w), B: at(O, 168, 0), P: at(O, 112, w / 2), e: at(O, 172, w / 2) };
    P0.Q = foot(P0.P, O, P0.A); P0.R = foot(P0.P, O, P0.B);
    const S = scene(P0);
    S.seg('OA OB Oe PQ PR').right('PQO PRO').dot('P');
    return S;
  }
  const WEDGE_NAMES = { O: 180, B: 270, R: 270 };
  const WEDGE_SAY = '점 O에서 나간 두 반직선 OA, OB와 그 사이를 지나는 반직선 OP. 점 Q는 반직선 OA 위에, 점 R는 반직선 OB 위에 있고 선분 PQ, PR가 그어져 있다. ∠PQO와 ∠PRO에 직각 표시가 있다. ';
  // ∠C = 90°인 직각삼각형 ABC(BC = a, CA = b, AB = c)에서 ∠A 의 이등분선이 변 BC 와 만나는 점 D, 점 D 에서 변 AB 에 내린 수선의 발 E(withE 일 때만 긋는다)
  function bisScene(a, b, c, withE, size) {
    const P0 = { C: [0, 0], B: [-a, 0], A: [0, -b], D: [-a * b / (b + c), 0] }; P0.E = foot(P0.D, P0.A, P0.B);
    if (!withE) delete P0.E;
    const S = scene(fitPts(P0, size || (b / a > 1 ? [175, 165] : [225, 150]))).poly('BCA').seg('AD').right('BCA').same('BAD DAC', 'dot', 30);
    return withE ? S.seg('DE').right('DEB') : S;
  }
  const BIS_HEAD = '∠C = 90°인 직각삼각형 ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 하자.';
  const BIS_SAY = '직각삼각형 ABC. ∠C에 직각 표시가 있다. 점 D는 변 BC 위에 있고 선분 AD가 그어져 있다. ∠BAD와 ∠DAC에 크기가 같다는 표시가 있다. ';
  const BIS_E_SAY = '점 E는 변 AB 위에 있고 선분 DE가 그어져 있다. ∠DEB에 직각 표시가 있다. ';
  // [BC, CA, AB, CD]: 각의 이등분선이 변 BC 를 나눈 길이 CD 가 자연수인 직각삼각형
  const BIS_TRI = [[8, 6, 10, 3], [9, 12, 15, 4], [16, 12, 20, 6], [18, 24, 30, 8], [24, 18, 30, 9], [36, 15, 39, 10]];
  B.addTypes(UNIT, 'bis', [
    T('bis-proof', '각의 이등분선의 성질을 설명하는 과정의 빈칸', '①33 ①42', (d, n) => {
      const w = 2 * d.int(22, 32), S = wedgeScene(w);
      if (n === 0) {
        S.same('QOP POR', 'dot', 34).names(WEDGE_NAMES);
        const rows = ['△POQ와 △POR에서', `∠PQO = ∠PRO = 90°, ${sg('OP')}는 공통, ∠POQ = ㈎`, `따라서 △POQ ≡ △POR (㈏ 합동)이므로 ${sg('PQ')} = ㈐이다.`];
        return pickOne(d, `∠AOB의 이등분선 위의 한 점 P에서 두 변 OA, OB에 내린 수선의 발을 각각 Q, R라 하자. 다음은 ${eq('PQ', 'PR')}임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`,
          `∠POR, RHA, ${sg('PR')}`, [`∠POR, RHS, ${sg('PR')}`, `∠OPR, RHA, ${sg('PR')}`, `∠POR, RHA, ${sg('OR')}`], {
            figure: S.svg(`${WEDGE_SAY}∠QOP와 ∠POR에 크기가 같다는 표시가 있다`) + lines(rows),
            explain: `${sg('OP')}가 ∠AOB의 이등분선이므로 ∠POQ = ∠POR이다. 두 직각삼각형의 빗변 ${sg('OP')}가 공통이고 한 예각의 크기가 같으므로 △POQ ≡ △POR (RHA 합동)이다. 대응변의 길이가 같으므로 ${eq('PQ', 'PR')}이다.`
          });
      }
      S.tick('PQ PR').names(WEDGE_NAMES);
      const rows = ['△POQ와 △POR에서', `∠PQO = ∠PRO = 90°, ${sg('OP')}는 공통, ${sg('PQ')} = ㈎`, '따라서 △POQ ≡ △POR (㈏ 합동)이므로 ∠POQ = ㈐이다.'];
      return pickOne(d, `∠AOB의 내부의 한 점 P에서 두 변 OA, OB에 내린 수선의 발을 각각 Q, R라 하자. 다음은 ${eq('PQ', 'PR')}일 때, 반직선 OP가 ∠AOB의 이등분선임을 설명하는 과정이다. ㈎, ㈏, ㈐에 알맞은 것을 차례로 나열한 것은?`,
        `${sg('PR')}, RHS, ∠POR`, [`${sg('PR')}, RHA, ∠POR`, `${sg('OR')}, RHS, ∠POR`, `${sg('PR')}, RHS, ∠OPR`], {
          figure: S.svg(`${WEDGE_SAY}선분 PQ와 선분 PR에 길이가 같다는 표시가 있다`) + lines(rows),
          explain: `두 직각삼각형의 빗변 ${sg('OP')}가 공통이고 다른 한 변의 길이가 ${eq('PQ', 'PR')}로 같으므로 △POQ ≡ △POR (RHS 합동)이다. 대응각의 크기가 같으므로 ∠POQ = ∠POR이고, 반직선 OP는 ∠AOB의 이등분선이다.`
        });
    }, { count: 2 }),
    T('bis-claims', '각의 두 변까지의 거리가 같은 점: 옳지 않은 것', '①42 ②30', (d) => {
      const S = wedgeScene(2 * d.int(22, 32)); S.tick('PQ PR').names(WEDGE_NAMES);
      return sayQ(d, `∠AOB의 내부의 한 점 P에서 두 변 OA, OB에 내린 수선의 발을 각각 Q, R라 하자. ${eq('PQ', 'PR')}일 때, 다음 중 옳다고 할 수 없는 것은?`,
        [eq('OQ', 'OR'), '∠QPO = ∠RPO', '∠QOP = ∠ROP', '△POQ ≡ △POR'],
        [[eq('OP', 'OR'), `△POQ ≡ △POR (RHS 합동)에서 ${sg('OR')}의 대응변은 ${sg('OQ')}이다. ${sg('OP')}는 직각삼각형 POR의 빗변이므로 ${sg('OR')}보다 길다.`], ['∠QOR = ∠QPR', '사각형 OQPR의 내각의 크기의 합은 360°이므로 ∠QOR + ∠QPR = 180°이다. 두 각의 크기가 같다고 할 수 없다.'], [eq('PQ', 'OQ'), `${sg('PQ')}와 길이가 같은 것은 ${sg('PR')}이다. ${sg('PQ')}와 ${sg('OQ')}의 길이가 같다고 할 수 없다.`]], false,
        S.svg(`${WEDGE_SAY}선분 PQ와 선분 PR에 길이가 같다는 표시가 있다`));
    }),
    T('bis-angle', '두 변까지의 거리가 같은 점으로 각의 크기 구하기', '①42 ②34', (d, n) => {
      if (n === 0) {
        const w = 2 * d.int(22, 34), S = wedgeScene(w);
        S.tick('PQ PR').names(WEDGE_NAMES); S.b.angle(S.P.O, 0, w / 2, sv('x'), { r: 30 });
        return degQ(`∠AOB의 내부의 한 점 P에서 두 변 OA, OB에 내린 수선의 발을 각각 Q, R라 하자. ${eq('PQ', 'PR')}이고 ∠AOB = ${w}°일 때, ∠POB의 크기는?`, w / 2, {
          figure: S.svg(`${WEDGE_SAY}선분 PQ와 선분 PR에 길이가 같다는 표시가 있다. ∠POB = x`),
          explain: `각의 두 변에서 같은 거리에 있는 점은 그 각의 이등분선 위에 있다. ∠POB = ${w}° ÷ 2 = ${w / 2}°이다.`, facts: { calc: [[`${w}/2`, 0]], unseen: [2] }
        });
      }
      const v = d.until(() => ({ a: 2 * d.int(22, 36), b: d.int(46, 72) }), (w) => 180 - w.a - w.b >= 44 && 180 - w.a - w.b <= 76 && Math.abs(180 - w.a - 2 * w.b) >= 8), x = 90 - v.a / 2;
      const S = scene(fitPts((() => { const P = baseTri(v.b, 180 - v.a - v.b); P.D = meet(P.A, at(P.A, 10, dirOf(P.A, P.B) + v.a / 2), P.B, P.C); P.E = foot(P.D, P.A, P.B); P.F = foot(P.D, P.A, P.C); return P; })(), [215, 155]));
      S.poly('BCA').seg('AD DE DF').right('DEA DFA').tick('DE DF').ang('ADE', sv('x'), { r: 26 }).names();
      return degQ(`△ABC에서 변 BC 위의 점 D에서 두 변 AB, AC에 내린 수선의 발을 각각 E, F라 하자. ${eq('DE', 'DF')}이고 ∠BAC = ${v.a}°일 때, ∠ADE의 크기는?`, x, {
        figure: S.svg('삼각형 ABC. 점 D는 변 BC 위에 있고 선분 AD가 그어져 있다. 점 E는 변 AB 위에, 점 F는 변 AC 위에 있고 선분 DE와 선분 DF에 길이가 같다는 표시가 있다. ∠DEA와 ∠DFA에 직각 표시가 있다. ∠ADE = x'),
        explain: `점 D는 ∠BAC의 두 변에서 같은 거리에 있으므로 ${sg('AD')}는 ∠BAC의 이등분선이다. ∠DAE = ${v.a}° ÷ 2 = ${v.a / 2}°이므로 △ADE에서 ∠ADE = 90° − ${v.a / 2}° = ${x}°이다.`,
        facts: { calc: [[`90-${v.a}/2`, 0]], unseen: [90, 2] }
      });
    }, { count: 2 }),
    T('bis-length', '직각삼각형의 한 예각의 이등분선과 수선: 선분의 길이', '①40', (d, n) => {
      const head = `${BIS_HEAD} 점 D에서 변 AB에 내린 수선의 발을 E라 할 때,`;
      if (n === 0) {
        const [a, b, c, k] = d.pick(BIS_TRI.filter((t) => t[1] < t[0])), S = bisScene(a, b, c, true);
        S.len('BD', cm(a - k), 'A').dim('BC', cm(a), 'A', 24).len('DE', `${sv('x')} cm`, 'A', { gap: 3 }).names();
        return cmQ(`${head} ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('BD')} = ${a - k} cm`)}이다. ${sg('DE')}의 길이는?`, k, {
          figure: S.svg(`${BIS_SAY}${BIS_E_SAY}변 BC의 길이는 ${a} cm, 선분 BD의 길이는 ${a - k} cm, 선분 DE의 길이는 x cm`),
          explain: `각의 이등분선 위의 점에서 그 각의 두 변까지의 거리는 같으므로 ${eq('DE', 'DC')}이다. ${sg('DC')} = ${a} − ${a - k} = ${k}(cm)이므로 ${sg('DE')}의 길이는 ${k} cm이다.`,
          facts: { calc: [[`${a}-${a - k}`, 0]] }
        });
      }
      const [a, b, c] = d.pick([[4, 3, 5], [12, 5, 13], [8, 15, 17], [15, 8, 17], [24, 7, 25], [8, 6, 10], [12, 9, 15], [3, 4, 5]]), S = bisScene(a, b, c, true);
      S.len('AC', cm(b), 'B').dim('AB', cm(c), 'C', 24).names();
      return cmQ(`${head} ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('AC')} = ${b} cm`)}이다. ${sg('BE')}의 길이는?`, c - b, {
        figure: S.svg(`${BIS_SAY}${BIS_E_SAY}변 AB의 길이는 ${c} cm, 변 AC의 길이는 ${b} cm`),
        explain: `△AED와 △ACD에서 ∠AED = ∠ACD = 90°, ${sg('AD')}는 공통, ∠EAD = ∠CAD이므로 △AED ≡ △ACD (RHA 합동)이다. ${eq('AE', 'AC')} = ${b} cm이므로 ${sg('BE')} = ${c} − ${b} = ${c - b}(cm)이다.`,
        facts: { calc: [[`${c}-${b}`, 0]] }
      });
    }, { count: 2 }),
    T('bis-area', '직각삼각형의 한 예각의 이등분선과 삼각형의 넓이', '①41 ②32', (d, n) => {
      const [a, b, c, k] = d.pick(BIS_TRI), area = c * k / 2, S = bisScene(a, b, c, false);
      if (n === 0) {
        S.dim('AB', cm(c), 'C', 12).len('DC', `${sv('x')} cm`, 'A').names();
        return cmQ(`${BIS_HEAD} ${nb(`${sg('AB')} = ${c} cm`)}이고 △ABD의 넓이가 ${area} cm²일 때, ${sg('CD')}의 길이는?`, k, {
          figure: S.svg(`${BIS_SAY}변 AB의 길이는 ${c} cm, 선분 CD의 길이는 x cm`),
          explain: `점 D에서 변 AB에 내린 수선의 발을 E라 하면 △ABD의 넓이는 ${HALF} × ${c} × ${sg('DE')} = ${area}이므로 ${sg('DE')} = ${k} cm이다. 각의 이등분선 위의 점에서 그 각의 두 변까지의 거리는 같으므로 ${eq('CD', 'DE')} = ${k} cm이다.`,
          facts: { calc: [[`${area}*2/${c}`, 0]], unseen: [2] }
        });
      }
      S.dim('AB', cm(c), 'C', 12).len('DC', cm(k), 'A').names();
      return cm2Q(`${BIS_HEAD} ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('CD')} = ${k} cm`)}일 때, △ABD의 넓이는?`, area, {
        figure: S.svg(`${BIS_SAY}변 AB의 길이는 ${c} cm, 선분 CD의 길이는 ${k} cm`),
        explain: `점 D에서 변 AB에 내린 수선의 발을 E라 하면 각의 이등분선 위의 점에서 그 각의 두 변까지의 거리는 같으므로 ${eq('DE', 'DC')} = ${k} cm이다. △ABD의 넓이는 ${HALF} × ${c} × ${k} = ${area}(cm²)이다.`,
        facts: { calc: [[`${c}*${k}/2`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('bis-perimeter', '직각삼각형의 한 예각의 이등분선과 수선: 삼각형의 둘레', '②33 심28', (d) => {
      const [a, b, c] = d.pick([[4, 3, 5], [12, 5, 13], [8, 15, 17], [15, 8, 17], [8, 6, 10], [12, 9, 15], [24, 7, 25]]), t = c - b + a, S = bisScene(a, b, c, true);
      S.len('AC', cm(b), 'B').names();
      return cmQ(`${BIS_HEAD} 점 D에서 변 AB에 내린 수선의 발을 E라 하자. ${nb(`${sg('AC')} = ${b} cm`)}이고 △EBD의 둘레의 길이가 ${t} cm일 때, △ABC의 둘레의 길이는?`, t + 2 * b, {
        figure: S.svg(`${BIS_SAY}${BIS_E_SAY}변 AC의 길이는 ${b} cm`),
        explain: `△AED ≡ △ACD (RHA 합동)이므로 ${eq('AE', 'AC')} = ${b} cm, ${eq('DE', 'DC')}이다. △EBD의 둘레의 길이는 ${sg('EB')} + ${sg('BD')} + ${sg('DE')} = ${sg('EB')} + ${sg('BD')} + ${sg('DC')} = ${sg('EB')} + ${sg('BC')}이다. △ABC의 둘레의 길이는 (${sg('AE')} + ${sg('EB')}) + ${sg('BC')} + ${sg('CA')} = ${t} + ${b} + ${b} = ${t + 2 * b}(cm)이다.`,
        facts: { calc: [[`${t}+${b}+${b}`, 0]] }
      });
    }),
    T('bis-quad', '한 대각선이 각을 이등분하고 마주 보는 두 각이 직각인 사각형', '②31', (d) => {
      const [p, q] = d.until(() => [d.int(5, 12), d.int(2, 7)], (w) => w[0] / w[1] >= 1.5 && w[0] / w[1] <= 3.2), L = Math.hypot(p, q);
      const S = scene(fitPts({ B: [0, 0], D: [L, 0], A: [p * p / L, -p * q / L], C: [p * p / L, p * q / L] }, [215, 170]));
      S.poly('ABCD').seg('BD').right('BAD BCD').same('ABD DBC', 'dot', 36).len('AB', cm(p), 'D').len('CD', cm(q), 'B').names();
      return cmQ(`사각형 ABCD에서 ∠A = ∠C = 90°이고 대각선 BD가 ∠B를 이등분한다. ${nb(`${sg('AB')} = ${p} cm`)}, ${nb(`${sg('CD')} = ${q} cm`)}일 때, 사각형 ABCD의 둘레의 길이는?`, 2 * (p + q), {
        figure: S.svg(`사각형 ABCD와 대각선 BD. ∠A와 ∠C에 직각 표시가 있고 ∠ABD와 ∠DBC에 크기가 같다는 표시가 있다. 변 AB의 길이는 ${p} cm, 변 CD의 길이는 ${q} cm`),
        explain: `△ABD와 △CBD에서 ∠A = ∠C = 90°, ${sg('BD')}는 공통, ∠ABD = ∠CBD이므로 △ABD ≡ △CBD (RHA 합동)이다. ${eq('BC', 'BA')} = ${p} cm, ${eq('DA', 'DC')} = ${q} cm이므로 둘레의 길이는 2 × (${p} + ${q}) = ${2 * (p + q)}(cm)이다.`,
        facts: { calc: [[`2*(${p}+${q})`, 0]], unseen: [2] }
      });
    })
  ]);

  // 같은 단원의 다른 파일(8-2-1b.js, 8-2-1c.js)이 함께 쓰는 도구
  B.kit.m821 = {
    UNIT, ISO, CEN, T, X, SYM, HALF, sg, deg, cm, eq, jo, degQ, cmQ, cm2Q, gcd, fracQ, piQ, pickOne, allQ, sayQ, tagged,
    foot, refl, along, turn, midDir, angleAt, perpAt, circumOf, inOf, baseTri, isoTri, sssTri, fitPts, spin, scene, kx, exSvg, exSay, exHtml, isoPts, isoScene, ISO_SAY, stripScene, STRIP_SAY,
    rtLegs, rtHyp, laid, boxOf, sideBySide, gridBoard, scaled, lineScene, LINE_HEAD, LINE_SAY, TRIPLES, squareScene, SQUARE_SAY, midPerpScene, cutScene, wedgeScene, bisScene, BIS_TRI
  };
})(typeof window !== 'undefined' ? window : globalThis);
