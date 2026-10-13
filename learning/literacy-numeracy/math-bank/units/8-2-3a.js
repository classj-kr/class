// 중학교 2학년 2학기 3단원 도형의 닮음 — 단원 틀·그림 도구와 앞쪽 묶음
// (닮은 도형, 닮은 평면도형의 성질, 닮은 입체도형의 성질, 넓이의 비와 부피의 비).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 46꼴, 기본꼴 2: 56꼴, 심화꼴: 32꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/8-2-3/싣기_대조표.md 에 있다.
// (삼각형의 닮음 조건·닮음을 이용한 길이·직각삼각형의 닮음·닮음의 활용은 8-2-3b.js 에, 실력 문항은 8-2-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-12(도형의 닮음의 뜻과 닮은 도형의 성질을 이해하고, 닮음비를 구할 수 있다),
// 9수03-13(삼각형의 닮음 조건을 이해하고, 이를 이용하여 두 삼각형이 닮음인지 판별할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(글·그림·기호), 묻는 것(닮음비·길이·각·넓이·부피·고르기), 닮음을 찾는 길(주어진 닮음 / SSS·SAS·AA 가운데 무엇으로 찾는가),
//    그림의 얼개(나란한 두 도형 / 한 각을 같이 쓰는 겹친 삼각형 / 맞꼭지각으로 엇갈린 삼각형 / 평행사변형 / 직각삼각형과 수선)가 다르면 따로 싣는다. 수와 점 이름만 바꾼 것은 한 유형이다.
//  - 그림은 수치대로 그린다. 코드가 길이와 각에서 좌표를 셈해 그리므로 그림과 답이 어긋나지 않는다. 묻는 길이는 그림에 적지 않고(또는 x로 적고) 적힌 수치로 답이 정해진다.
//    그림 설명(aria-label)에는 그림에서 읽어야 하는 것을 말로 적는다.
//  - 답: 길이는 「□ cm」, 길이가 분수이면 분수 칸, 비는 「□ : □」 두 칸(가장 간단한 자연수의 비), 넓이·부피는 수(π가 들면 칸 뒤에 π와 단위), 닮은 삼각형·닮음 조건·대응은 고르기.
//    한 유형의 답은 늘 같은 꼴이다(자연수로 받는 유형은 수를 골라 늘 자연수가 되게 지었다).
//  - 교육과정의 금: 「증명 과정에서 지나치게 엄밀한 형식 논리 규칙의 이용을 요구하는 문제는 다루지 않는다」 — 닮음임을 밝히는 글을 쓰게 하지 않고 닮은 삼각형과 닮음 조건을 고르게 한다.
//  - 이 단원에서 쓰는 앞 단원의 사실: 맞꼭지각, 평행선의 엇각·동위각(중1), 삼각형의 내각과 외각(중1), 이등변삼각형·평행사변형의 성질과 직각삼각형의 합동·외심(중2).
//  - 꼴 목록에 적힌 원문 풀이의 잘못(기본1의 문제은행 01·06, 김동재 대단원 04·16)은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(8-2-3b.js, 8-2-3c.js 의 것까지 여기에 모아 적는다)
//  - 다음 단원(8-2-4 삼각형과 평행선, 중점을 이은 선분, 무게중심, 각의 이등분선의 비)의 일: 심14·15·29·30·31·32.
//    평행이 주어진 엇갈린 삼각형(①34)과 평행사변형의 연장선(①35 ②38)은 닮은 두 삼각형을 찾아 AA 닮음으로 푸는 꼴로 실었다.
//  - 피타고라스 정리(8-2-5)로 한 변을 먼저 구해야 하는 꼴은 그 길이를 문제에 주어 실었다(②39 ②51, 심24 심26 심28).
//  - 처음 지을 때 「한 번 접은 직사각형은 한 유형만」, 보조선 둘, 요령이 든다는 까닭으로 뺐던 꼴은 다시 보아 실력에 실었다(8-2-3c.js 끝의 묶음):
//    직사각형을 대각선으로 접는 꼴(①45 ②51 심26), 접고 나서 수선을 또 긋는 꼴(심27), 정사각형 접기(심28), 내심을 지나는 평행선(②42), 세 선분의 곱(①43).
//  - 그림을 알 수 없는 꼴: △ABC와 닮은 삼각형 모두 찾기(①38), 도로의 폭 측량(②56), 한 점에서 만나는 세 원(②25 — 색칠한 세 부분이 어디인지 확인하지 못했다).
//  - 같은 일이어서 한 번만 실은 것: ①4(문장 가리기에), ①14(②11과), ②13(②12와), ②24(②23과 — 꼭짓점을 같이 쓰는 닮은 두 뿔), ②37·①34의 변형(①34와 — 평행선의 엇각으로 AA),
//    심22(심21과 — 같은 그림에서 묻는 선분만 다르다), ②23의 변형(심8과), 심2(②7과), 심6(①17과 한 유형의 차례로), 심12(①28과), 심11(①30과), 심16(①37과 한 유형의 차례로), 심19(심20과).
//  - 서술형·활동: 대응점·대응변·대응각 쓰기(①3 — 기호를 읽어 대응을 고르기로 바꿈), 조형물 만들기 활동지(김화경), 닮음임을 설명하기(교과서 196쪽 문제 4 ⑴).
//  - 꼴 목록에 없어 짓지 않은 것: 축도와 축척(과제 글의 보기 — 꼴 목록의 세 문서에 문항이 없다), 겹쳐진 삼각형에서 닮음을 두 번 잇는 꼴(심14는 다음 단원의 일이 섞여 뺐다).
//  - 그림을 못 보았지만 글·풀이·같은 꼴의 그림으로 관계가 정해져 지은 것: ①10(잘라 낸 직사각형), ①26(이등변삼각형과 각의 이등분선), ①27·①29·①37(풀이에 남은 길이와 관계),
//    ②52(정삼각형 접기 — 심25의 그림 설명), 심1(각의 표시로 대응변 찾기 — 두 삼각형의 놓인 모양은 새로 정했다).
// 기본과 실력을 가른 곳
//  - 기본 문서에 여러 번 나오는 꼴은 뜻을 묻는 것이어도 기본에 두었다: 항상 닮은 도형(①1 ②1), 닮음비에서 넓이의 비·부피의 비(①16·17 ②15~19), 끼인각이 아닌 각을 섞은 닮음 조건(①24·25 ②26·29),
//    대응이 뒤집힌 겹친 삼각형의 길이(①30 ②33), 심화 문서의 수준 「하」 문항(심2·4·6·12)과 두 단계를 잇는 것(심16·17).
//  - 기본 문서의 꼴이지만 실력에 둔 것: 조건이 붙은 「항상 닮은 도형」(①2), 잘라 낸 직사각형(①10), 복사한 그림의 넓이(②20) — 뜻을 정확히 대야 풀린다(①).
//    닮음에서 얻은 각으로 식 세우기(①26), 정삼각형 안의 60°(②40), 세 각이 같게 그은 선분(②41), 각의 이등분선과 수선(②49), 대각선의 수직이등분선(①46), 접은 도형(①44 ②52) — 세 단계가 넘는다(②).
// 파일: 8-2-3a.js(틀·그림 도구, 닮은 도형·평면도형·입체도형·넓이의 비와 부피의 비), 8-2-3b.js(닮음 조건·길이·직각삼각형·활용), 8-2-3c.js(실력). 이 차례로 읽혀야 한다(B.kit.m823).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 각도는 수에 붙여 적고(60°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, M, C, F } = B.kit;
  const { V, nb, SG, gcd, sup } = B.kit.mid;
  const G = B.kit.geo;
  const { RAD, r1, at, dirOf, dist, mid, XY, meet, sv, TINT, Board } = B.kit.mgeo;
  const UNIT = '8-2-3', S12 = '9수03-12', S13 = '9수03-13';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const SIM = '∽', PAR = '∥', X = V('x'), Y = V('y');
  const TAG = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'];
  const cm = (v) => v + ' cm';
  const tri = (name) => '△' + name, quad = (name) => '□' + name;
  const RATIO = '가장 간단한 자연수의 비로 나타내시오.';
  // 서로소인 두 수의 비(닮음비로 쓴다)
  const PAIRS = [[1, 2], [2, 3], [3, 4], [3, 5], [4, 5], [2, 5], [1, 3]];

  // ── 답 ──
  const lenQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm' }, o));
  const degQ = (text, v, o) => N(text, v, Object.assign({ unit: '°' }, o));
  const areaQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm²' }, o));
  const volQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm³' }, o));
  // π가 드는 값: 칸 뒤에 π와 단위를 붙여 계수만 받는다.
  const piQ = (text, k, unit, o) => Object.assign(N(text, k, Object.assign({}, o, { unit: 'π ' + unit })), { shown: `${k}π ${unit}` });
  // 비: 「□ : □」 두 칸
  const ratioQ = (text, a, b, o) => M(text, [{ answer: a, unit: ':' }, { answer: b }], Object.assign({}, o, { shown: `${a} : ${b}` }));
  // 분수인 길이·넓이(가분수, 크기가 같은 분수를 모두 받는다)
  const fracQ = (text, p, q, unit, o) => { const g = gcd(p, q); return F(text, p / g, q / g, Object.assign({ improper: p > q, anyForm: true, unit }, o)); };
  // 검사가 다시 셈하는 식: 세제곱수의 세제곱근(반올림하여 자연수로)
  const cbrt = (v) => `((${v}**(1/3)+0.5)-(${v}**(1/3)+0.5)%1)`;

  // 문장 가리기. yes: 옳은 문장들, no: [틀린 문장, 바로잡은 말, 함께 싣지 않을 옳은 문장(들)]. wantTrue: 옳은 것을 고르는가.
  function sayQ(d, text, yes, no, wantTrue, figure) {
    const bad = d.shuffle(no).slice(0, wantTrue ? 3 : 1), clash = bad.reduce((all, s) => all.concat(s[2] || []), []);
    const good = d.shuffle(yes.filter((s) => !clash.includes(s))).slice(0, wantTrue ? 1 : 3);
    const rows = d.shuffle(good.map((s) => [s, true, '']).concat(bad.map((s) => [s[0], false, s[1]]))), hit = rows.findIndex((r) => r[1] === wantTrue);
    return C(text, rows.map((r) => r[0]), hit, { figure, explain: wantTrue ? rows.filter((r) => !r[1]).map((r) => r[2]).join(' ') : rows[hit][2], facts: { truth: rows.map((r) => r[1]), want: wantTrue } });
  }
  // 고르기: 맞는 보기 하나와 틀린 보기들을 섞는다.
  function pickOne(d, text, right, wrongs, o) {
    const rows = d.shuffle([[right, true]].concat(wrongs.map((w) => [w, false])));
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: rows.map((r) => r[1]), want: true }, o.rule ? { rule: o.rule } : {}) });
  }
  const words = (list) => '<div class="mb-numbers">' + list.map((w) => '<span style="font-size:1.05rem">' + w + '</span>').join('') + '</div>';

  // ── 좌표 셈(수학 좌표: 오른쪽이 x, 위쪽이 y. 각은 오른쪽이 0°이고 시계 반대쪽으로 커진다) ──
  const go = (p, len, deg) => [p[0] + len * Math.cos(deg * RAD), p[1] + len * Math.sin(deg * RAD)];
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const toward = (p, q, len) => lerp(p, q, len / dist(p, q));
  const foot = (p, a, b) => lerp(a, b, ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2));
  const mapP = (P, f) => { const out = {}; for (const k of Object.keys(P)) out[k] = f(P[k]); return out; };
  // 삼각형 ABC(B 왼쪽 아래, C 오른쪽 아래): 세 변 BC = a, CA = b, AB = c / 두 변 AB = c, BC = a 와 ∠B / 변 BC = a 와 ∠B, ∠C
  const sss = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return { B: [0, 0], C: [a, 0], A: [x, Math.sqrt(Math.max(0, c * c - x * x))] }; };
  const sas = (c, a, deg) => ({ B: [0, 0], C: [a, 0], A: go([0, 0], c, deg) });
  const asa = (a, bd, cd) => sas(a * Math.sin(cd * RAD) / Math.sin((bd + cd) * RAD), a, bd);
  const angleAt = (v, p, q) => { const g = Math.abs(Math.atan2(p[1] - v[1], p[0] - v[0]) - Math.atan2(q[1] - v[1], q[0] - v[0])) / RAD; return g > 180 ? 360 - g : g; };
  const ren = (P, from, to) => { const out = {}; from.split('').forEach((k, i) => { out[to[i]] = P[k]; }); return out; };
  const rot = (P, deg) => { const c = Math.cos(deg * RAD), s = Math.sin(deg * RAD); return mapP(P, (p) => [p[0] * c - p[1] * s, p[0] * s + p[1] * c]); };
  const flip = (P) => mapP(P, (p) => [-p[0], p[1]]);
  const scale = (P, k) => mapP(P, (p) => [p[0] * k, p[1] * k]);
  // 두 점 a, b 를 잇는 선이 가로가 되게(a 가 왼쪽) 돌린다.
  const level = (P, a, b) => rot(P, -Math.atan2(P[b][1] - P[a][1], P[b][0] - P[a][0]) / RAD);
  const ctr = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  // 점 묶음들을 한 배율로 화면 좌표에 옮겨 왼쪽부터 늘어놓는다(밑을 맞춘다). o: { w, h: 그림의 가로·세로 한도, gap: 사이 띄우기, stack: 위에서 아래로 쌓는다 }
  function lay(sets, o) {
    const opt = o || {}, W = opt.w || 250, H = opt.h || 130, gap = opt.gap == null ? 44 : opt.gap;
    const boxes = sets.map((P) => { const v = Object.values(P), xs = v.map((p) => p[0]), ys = v.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; });
    const k = Math.min((W - gap * (sets.length - 1)) / boxes.reduce((s, q) => s + q[2] - q[0], 0), H / Math.max(...boxes.map((q) => q[3] - q[1])));
    if (opt.stack) {
      const ks = Math.min(W / Math.max(...boxes.map((q) => q[2] - q[0])), (H - gap * (sets.length - 1)) / boxes.reduce((s, q) => s + q[3] - q[1], 0)); let y = 0;
      return sets.map((P, i) => { const q = boxes[i], y0 = y + (q[3] - q[1]) * ks; y = y0 + gap; return mapP(P, (p) => [(p[0] - q[0]) * ks, y0 - (p[1] - q[1]) * ks]); });
    }
    let x = 0;
    return sets.map((P, i) => { const q = boxes[i], x0 = x; x += (q[2] - q[0]) * k + gap; return mapP(P, (p) => [x0 + (p[0] - q[0]) * k, -(p[1] - q[1]) * k]); });
  }

  // ── 그림: 평면도형 ──
  // 크기가 같은 각의 표시: 꼭짓점 v 에서 p 쪽 변과 q 쪽 변 사이에 가는 호와 점(●)이나 가위표(×)
  function eq(b, v, p, q, kind) {
    let a = dirOf(v, p), c = dirOf(v, q);
    if ((c - a + 360) % 360 > 180) { const t = a; a = c; c = t; }
    const span = (c - a + 360) % 360, r = span >= 50 ? 16 : span >= 30 ? 22 : 30;
    b.angle(v, a, a + span, '', { square: false, r });
    return b.sym(v, a + span / 2, kind || 'dot', r * 0.58);
  }
  // 그림 속 글이 서로 겹치지 않는 수가 나올 때까지 다시 만든다(figs 로 그린 판을 모아 두었다가 본다).
  const boards = [];
  const tidy = (make) => (d, n) => d.until(() => { boards.length = 0; return make(d, n); }, () => !boards.some((b) => b.clash()));
  // 도형 여럿을 한 판에 그린다. list 의 항목: { P: 점들(수학 좌표), order: 테두리를 이루는 점 이름('' 이면 테두리 없음), fills: [[점 이름들, 칠]], segs: [[u, v, kind]],
  //  right: [[v, u, w]] 직각 표시, angles: [[v, u, w, 글]], marks: [[v, u, w, kind]] 같은 각 표시, sides: [[u, v, 글, { in: 글을 두지 않을 쪽의 점 이름, t, gap }]],
  //  dims: [[u, v, 글, 띄울 거리, 안쪽 점 이름]], ticks: [[u, v, n]], arrows: [[u, v, t]], at: { 이름: 이름을 적을 방향(도) }, gapOf: { 이름: 띄울 거리 }, hide: 이름을 적지 않을 점들 }
  function figs(list, o) {
    const Q = lay(list.map((s) => s.P), o), b = Board(); boards.push(b);
    list.forEach((s, i) => {
      const p = Q[i], keys = Object.keys(p), c = ctr(keys.map((k) => p[k])), order = s.order == null ? keys.join('') : s.order, pt = (name) => (name ? p[name] : c);
      (s.fills || []).forEach(([names, css]) => b.poly(names.split('').map((k) => p[k]), (css || TINT) + ';stroke:none'));
      if (order) b.poly(order.split('').map((k) => p[k]));
      (s.segs || []).forEach(([a, e, kind]) => b.seg(p[a], p[e], kind));
      (s.right || []).forEach(([v, a, e]) => b.corner(p[v], p[a], p[e], ''));
      (s.marks || []).forEach(([v, a, e, kind]) => eq(b, p[v], p[a], p[e], kind));
      (s.angles || []).forEach(([v, a, e, text]) => b.corner(p[v], p[a], p[e], text));
      (s.ticks || []).forEach(([a, e, n]) => b.tick(p[a], p[e], n));
      (s.arrows || []).forEach(([a, e, t]) => b.arrow(p[a], p[e], t));
      (s.sides || []).forEach(([a, e, text, more]) => b.beside(p[a], p[e], text, pt(more && more.in), more));
      (s.dims || []).forEach(([a, e, text, off, inside]) => b.dim(p[a], p[e], text, pt(inside), off));
      keys.forEach((k) => { if (!(s.hide || '').includes(k)) b.name(p[k], k, s.at && s.at[k] != null ? s.at[k] : dirOf(c, p[k]), s.gapOf && s.gapOf[k]); });
    });
    return { b, Q };
  }
  // 사각형 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위): 변 AB = c, BC = a 와 세 각 ∠A, ∠B, ∠C / 세 변 AB = c, BC = a, CD = e 와 두 각 ∠B, ∠C
  const quadA = (c, a, al, be, ga) => { const pB = [0, 0], pC = [a, 0], pA = go(pB, c, be); return { A: pA, B: pB, C: pC, D: meet(pA, go(pA, 1, be + 180 + al), pC, go(pC, 1, 180 - ga)) }; };
  const quadS = (c, a, e, be, ga) => ({ A: go([0, 0], c, be), B: [0, 0], C: [a, 0], D: go([a, 0], e, 180 - ga) });
  // 사각형 ABCD: 세 변 AB = c, BC = a, AD = e 와 두 각 ∠A, ∠B
  const quadT = (c, a, e, al, be) => { const pA = go([0, 0], c, be); return { A: pA, B: [0, 0], C: [a, 0], D: go(pA, e, be + 180 + al) }; };
  // 평행사변형 ABCD: 변 BC = a, AB = s, ∠B = th
  const pgram = (a, s, th) => { const pA = go([0, 0], s, th); return { A: pA, B: [0, 0], C: [a, 0], D: [pA[0] + a, pA[1]] }; };

  // ── 그림: 입체도형(화면 좌표에 바로 그린다) ──
  const DASH = 'fill:none;stroke:#5b6770;stroke-width:1.2;stroke-dasharray:4 3', FACE = 'fill:#fff8e1', THIN = 'fill:none;stroke-width:1.1', TILT = 0.3;
  // 타원(가운데 c, 반지름 rx·ry)의 앞쪽(아래) 반이나 뒤쪽(위) 반
  const arcHalf = (c, rx, ry, front) => `M${XY([c[0] - rx, c[1]])}A${r1(rx)} ${r1(ry)} 0 0 ${front ? 0 : 1} ${XY([c[0] + rx, c[1]])}`;
  // 원기둥. c: 윗면의 가운데, rx: 밑면의 반지름, h: 높이
  function cylOn(b, c, rx, h) {
    const ry = rx * TILT, e = [c[0], c[1] + h], box = [[c[0] - rx, c[1] - ry], [c[0] + rx, e[1] + ry]];
    b.shape(`M${XY([c[0] - rx, c[1]])}L${XY([e[0] - rx, e[1]])}A${r1(rx)} ${r1(ry)} 0 0 0 ${XY([e[0] + rx, e[1]])}L${XY([c[0] + rx, c[1]])}`, box, FACE);
    b.shape(arcHalf(c, rx, ry, true) + `A${r1(rx)} ${r1(ry)} 0 0 0 ${XY([c[0] - rx, c[1]])}Z`, box, FACE);
    b.shape(arcHalf(e, rx, ry, false), box, DASH);
    return { top: c, bot: e, rx, ry };
  }
  // 원뿔(꼭짓점이 위). 밑면의 가운데는 꼭짓점에서 h 만큼 아래
  function coneOn(b, apex, rx, h) {
    const ry = rx * TILT, c = [apex[0], apex[1] + h], L = [c[0] - rx, c[1]], R = [c[0] + rx, c[1]];
    b.shape(`M${XY(apex)}L${XY(L)}A${r1(rx)} ${r1(ry)} 0 0 0 ${XY(R)}Z`, [apex, [L[0], L[1] + ry], [R[0], R[1] + ry]], FACE);
    b.shape(arcHalf(c, rx, ry, false), [L, R], DASH);
    return { apex, c, rx, ry, h, L, R };
  }
  // 원뿔을 밑면에 평행하게 자른 단면(꼭짓점에서 높이의 t 배 되는 곳)
  function sectionOn(b, cone, t) {
    const c = [cone.apex[0], cone.apex[1] + cone.h * t], r = cone.rx * t;
    b.shape(arcHalf(c, r, r * TILT, true), [c], THIN).shape(arcHalf(c, r, r * TILT, false), [c], DASH);
    return { c, r, L: [c[0] - r, c[1]], R: [c[0] + r, c[1]] };
  }
  // 원뿔 모양의 그릇(꼭짓점이 아래). c: 입구의 가운데, t: 물의 높이 ÷ 그릇의 높이
  function cupOn(b, c, rx, h, t) {
    const ry = rx * TILT, apex = [c[0], c[1] + h], L = [c[0] - rx, c[1]], R = [c[0] + rx, c[1]], w = [c[0], apex[1] - h * t], wr = rx * t;
    b.shape(`M${XY(L)}L${XY(apex)}L${XY(R)}`, [[L[0], L[1] - ry], apex, R], 'fill:#fff');
    b.shape(`M${XY([w[0] - wr, w[1]])}L${XY(apex)}L${XY([w[0] + wr, w[1]])}A${r1(wr)} ${r1(wr * TILT)} 0 0 0 ${XY([w[0] - wr, w[1]])}Z`, [apex], 'fill:#bfdbfe;stroke:none');
    b.shape(arcHalf(w, wr, wr * TILT, true) + `A${r1(wr)} ${r1(wr * TILT)} 0 0 0 ${XY([w[0] - wr, w[1]])}Z`, [w], 'fill:#dbeafe;stroke:#1d4ed8;stroke-width:1.1');
    b.seg(L, apex).seg(R, apex);
    b.shape(arcHalf(c, rx, ry, true) + `A${r1(rx)} ${r1(ry)} 0 0 0 ${XY(L)}Z`, [[L[0], L[1] - ry], [R[0], R[1] + ry]], 'fill:none');
    return { c, apex, L, R, w, wr };
  }
  function sphereOn(b, c, R) {
    b.disk(c, R, FACE).shape(arcHalf(c, R, R * TILT, true), [c], THIN).shape(arcHalf(c, R, R * TILT, false), [c], DASH);
    return { c, R };
  }
  // 세워 놓은 삼각기둥. o: 윗면의 왼쪽 앞 꼭짓점, w: 앞면의 가로, h: 높이, nm: 꼭짓점 이름 여섯(윗면의 뒤·왼쪽·오른쪽, 아랫면의 뒤·왼쪽·오른쪽)
  function prismOn(b, o, w, h, nm) {
    const pB = o, pC = [o[0] + w, o[1]], pA = [o[0] + w * 0.56, o[1] - w * 0.36], pE = [pB[0], pB[1] + h], pF = [pC[0], pC[1] + h], pD = [pA[0], pA[1] + h], P = {};
    [pA, pB, pC, pD, pE, pF].forEach((p, i) => { P[nm[i]] = p; });
    b.poly([pA, pB, pE, pF, pC], FACE).seg(pB, pC).seg(pA, pD, 'cut').seg(pD, pE, 'cut').seg(pD, pF, 'cut');
    b.name(pA, nm[0], 90).name(pB, nm[1], 180).name(pC, nm[2], 0).name(pE, nm[4], 180).name(pF, nm[5], 0);
    b.nameFree(pD, nm[3], [90, dirOf(pD, pE), dirOf(pD, pF)]);
    return P;
  }
  // 직육면체. o: 앞면의 왼쪽 위 꼭짓점, w: 가로, h: 높이, dv: 안쪽으로 가는 모서리(화면에서 오른쪽·위쪽으로 간 길이). 돌려주는 점: 앞면 tl·tr·bl·br, 뒷면 TL·TR·BR
  function boxOn(b, o, w, h, dv) {
    const tl = o, tr = [o[0] + w, o[1]], bl = [o[0], o[1] + h], br = [o[0] + w, o[1] + h], back = (p) => [p[0] + dv[0], p[1] - dv[1]], TL = back(tl), TR = back(tr), BL = back(bl), BR = back(br);
    b.poly([TL, tl, bl, br, BR, TR], FACE).seg(tl, tr).seg(tr, br).seg(tr, TR).seg(BL, TL, 'cut').seg(BL, bl, 'cut').seg(BL, BR, 'cut');
    return { tl, tr, bl, br, TL, TR, BR, BL };
  }
  // 사면체. o: 왼쪽 꼭짓점, s: 크기. 돌려주는 점: A 위, B 왼쪽, C 앞, D 오른쪽
  function tetraOn(b, o, s) {
    const pB = o, pD = [o[0] + s, o[1] - s * 0.06], pC = [o[0] + s * 0.56, o[1] + s * 0.26], pA = [o[0] + s * 0.5, o[1] - s * 0.84];
    b.poly([pA, pB, pC, pD], FACE).seg(pA, pC).seg(pB, pD, 'cut');
    return { A: pA, B: pB, C: pC, D: pD };
  }
  const blue = { blue: true };
  // 닮은 두 삼각기둥(닮음비 m : n). labels: [[몇째 기둥(0, 1), 모서리(이름 둘), 글]]
  function prismsFig(m, n, labels, said) {
    const b = Board(), big = Math.max(m, n), w = [74 * m / big, 74 * n / big], h = [88 * m / big, 88 * n / big], base = 100;
    const P = [prismOn(b, [0, base - h[0]], w[0], h[0], 'ABCDEF'), prismOn(b, [w[0] + 62, base - h[1]], w[1], h[1], 'GHIJKL')];
    for (const [i, name, text] of labels) { const p = P[i][name[0]], q = P[i][name[1]], inside = ctr(Object.values(P[i])); b.beside(p, q, text, name === 'BC' || name === 'HI' ? [inside[0], p[1] - 40] : inside, name === 'AB' || name === 'GH' ? { t: 0.64 } : name === 'BC' || name === 'HI' ? { t: 0.27 } : null); }
    return b.svg(said);
  }
  // 닮은 두 원기둥 A, B. r, h: 원기둥 A 의 밑면의 반지름과 높이(cm), h2: 원기둥 B 의 높이. 원기둥 B 의 반지름은 적지 않는다.
  function cylsFig(r, h, h2, said, noR) {
    const b = Board(), k = Math.min(92 / Math.max(h, h2), 40 / Math.max(r, r * h2 / h)), ra = Math.max(13, r * k), rb = Math.max(13, r * h2 / h * k), ha = h * k, hb = h2 * k, base = 110;
    const a = cylOn(b, [ra, base - ha], ra, ha), c = cylOn(b, [2 * ra + 70 + rb, base - hb], rb, hb);
    if (!noR) b.seg(a.top, [a.top[0] + ra, a.top[1]], 'thin').dot(a.top, 2).text([a.top[0] + ra / 2 + 2, a.top[1] - a.ry - 9], cm(r), blue);
    b.text([a.top[0] + ra + 21, a.top[1] + ha / 2], cm(h), blue).text([c.top[0] + rb + 21, c.top[1] + hb / 2], cm(h2), blue);
    b.text([a.bot[0], a.bot[1] + a.ry + 12], 'A').text([c.bot[0], c.bot[1] + c.ry + 12], 'B');
    return b.svg(said);
  }
  // 닮은 두 직육면체(같은 자리에 놓인 모서리끼리 대응). dims: [[가로, 세로, 높이], [가로, 세로, 높이]](cm), labels: [[가로 글, 세로 글, 높이 글], …](빈 글은 적지 않는다)
  function boxesFig(dims, labels, said, names) {
    const b = Board(), k = Math.min(84 / Math.max(dims[0][2], dims[1][2]), 140 / (dims[0][0] + dims[1][0] + 0.55 * (dims[0][1] + dims[1][1]))), base = 100; let x = 0;
    dims.forEach(([w, dp, h], i) => {
      const q = boxOn(b, [x, base - h * k], w * k, h * k, [dp * k * 0.55, dp * k * 0.36]), c = ctr([q.tl, q.br, q.TR]);
      if (labels[i][0]) b.beside(q.bl, q.br, labels[i][0], c);
      if (labels[i][1]) b.beside(q.tl, q.TL, labels[i][1], q.br);
      if (labels[i][2]) b.beside(q.TR, q.BR, labels[i][2], q.tl, { t: 0.42 });
      if (names) b.text([x + w * k / 2, base + (labels[i][0] ? 28 : 13)], names[i]);
      x += w * k + dp * k * 0.55 + 74;
    });
    return b.svg(said);
  }
  // 원뿔 모양의 그릇에 담긴 물. H: 그릇의 높이, h: 물의 높이(cm)
  function cupFig(H, h, said) {
    const b = Board(), cup = cupOn(b, [0, 0], 46, 104, h / H);
    b.dim([-54, 0], [-54, 104], cm(H), [0, 52], 0).dim([54, cup.w[1]], [54, 104], cm(h), [0, 52], 0);
    return b.svg(said);
  }

  // ── 문장 ──
  const ALWAYS = ['두 정삼각형', '두 정사각형', '두 원', '두 직각이등변삼각형', '두 정오각형', '두 정육각형', '두 구', '두 정육면체', '두 정사면체'];
  const NOT_ALWAYS = [
    ['두 직사각형', '두 직사각형은 가로와 세로의 길이의 비가 다를 수 있다.'], ['두 마름모', '두 마름모는 내각의 크기가 다를 수 있다.'],
    ['두 이등변삼각형', '두 이등변삼각형은 꼭지각의 크기가 다를 수 있다.'], ['두 평행사변형', '두 평행사변형은 이웃한 두 변의 길이의 비나 내각의 크기가 다를 수 있다.'],
    ['두 직각삼각형', '두 직각삼각형은 직각이 아닌 각의 크기가 다를 수 있다.'], ['두 부채꼴', '두 부채꼴은 중심각의 크기가 다를 수 있다.'],
    ['두 원기둥', '두 원기둥은 밑면의 반지름의 길이와 높이의 비가 다를 수 있다.'], ['두 원뿔', '두 원뿔은 밑면의 반지름의 길이와 높이의 비가 다를 수 있다.'],
    ['두 직육면체', '두 직육면체는 세 모서리의 길이의 비가 다를 수 있다.'], ['두 삼각기둥', '두 삼각기둥은 밑면의 모양이나 높이의 비가 다를 수 있다.'], ['두 사각뿔', '두 사각뿔은 밑면의 모양이나 높이의 비가 다를 수 있다.']
  ];
  const SIM_TRUE = [
    '서로 닮은 두 평면도형에서 대응각의 크기는 각각 같다.', '서로 닮은 두 평면도형에서 대응변의 길이의 비는 일정하다.', '합동인 두 도형은 닮음비가 1 : 1인 닮은 도형이다.',
    '두 원의 닮음비는 반지름의 길이의 비와 같다.', '서로 닮은 두 입체도형에서 대응하는 모서리의 길이의 비는 일정하다.', '서로 닮은 두 입체도형에서 대응하는 면은 서로 닮은 도형이다.',
    '한 도형을 일정한 비율로 확대하거나 축소한 도형은 처음 도형과 닮은 도형이다.'
  ];
  const SIM_FALSE = [
    ['서로 닮은 두 평면도형에서 대응변의 길이는 각각 같다.', '서로 닮은 두 평면도형에서 대응변의 길이는 그 비가 일정할 뿐, 같다고 할 수 없다.', ['서로 닮은 두 평면도형에서 대응변의 길이의 비는 일정하다.']],
    ['넓이가 같은 두 직사각형은 항상 닮은 도형이다.', '넓이가 같아도 가로와 세로의 길이의 비가 다르면 닮은 도형이 아니다.'],
    ['서로 닮은 두 도형은 항상 합동이다.', '서로 닮은 두 도형은 닮음비가 1 : 1일 때만 합동이다.', ['합동인 두 도형은 닮음비가 1 : 1인 닮은 도형이다.']],
    ['서로 닮은 두 평면도형에서 대응각의 크기의 비는 닮음비와 같다.', '서로 닮은 두 평면도형에서 대응각의 크기는 각각 같다.', ['서로 닮은 두 평면도형에서 대응각의 크기는 각각 같다.']],
    ['서로 닮은 두 입체도형에서 대응하는 면은 서로 합동이다.', '서로 닮은 두 입체도형에서 대응하는 면은 서로 닮은 도형이다.', ['서로 닮은 두 입체도형에서 대응하는 면은 서로 닮은 도형이다.']],
    ['닮음비는 두 도형의 넓이의 비이다.', '닮음비는 대응변(대응하는 모서리)의 길이의 비이다.']
  ];

  // 모눈 위의 삼각형 둘이 닮음인가(꼭짓점이 모눈 점이므로 변의 길이의 제곱을 견준다)
  const sq3 = (t) => [0, 1, 2].map((i) => (t[i][0] - t[(i + 1) % 3][0]) ** 2 + (t[i][1] - t[(i + 1) % 3][1]) ** 2).sort((x, y) => x - y);
  const simTri = (s, t) => { const a = sq3(s), c = sq3(t); return a[0] * c[1] === a[1] * c[0] && a[1] * c[2] === a[2] * c[1]; };
  const snug = (t) => { const x0 = Math.min(...t.map((p) => p[0])), y0 = Math.min(...t.map((p) => p[1])); return t.map((p) => [p[0] - x0, p[1] - y0]); };

  B.addUnit({
    id: '8-2-3', grade: 8, semester: 2, no: 3, title: '도형의 닮음', version: 2,
    groups: [
      {
        id: 'similar', title: '닮은 도형', standard: S12,
        types: [
          T('sim-always', '항상 닮은 도형 고르기', '①1 ②1', (d, n) => {
            const item = sayQ(d, n === 0 ? '다음 중 항상 닮은 도형인 것은?' : '다음 중 항상 닮은 도형이라고 할 수 없는 것은?', ALWAYS, NOT_ALWAYS, n === 0);
            if (n === 0) item.explain = `${item.choice.options[item.choice.answer]}${/[형원]$/.test(item.choice.options[item.choice.answer]) ? '은' : '는'} 크기와 관계없이 모양이 하나로 정해지므로 항상 닮은 도형이다. ` + item.explain;
            return item;
          }, { count: 2 }),
          T('sim-always-count', '항상 닮은 도형의 개수', '①1 ②1', (d) => {
            const k = d.int(2, 4), list = d.shuffle(d.shuffle(ALWAYS).slice(0, k).concat(d.shuffle(NOT_ALWAYS).slice(0, 6 - k).map((s) => s[0]))), yes = list.filter((s) => ALWAYS.includes(s));
            return N('다음 도형 가운데 항상 닮은 도형인 것은 모두 몇 개인가?', k, {
              unit: '개', figure: words(list),
              explain: `항상 닮은 도형인 것은 ${yes.join(', ')}의 ${k}개이다. 나머지는 변의 길이의 비나 각의 크기가 다를 수 있다.`, facts: { calc: [[String(k), 0]], unseen: [k] }
            });
          }),
          T('sim-match', '닮음의 기호에서 대응변과 대응각 읽기', '①3 ①6', (d, n) => {
            const to = d.pick(['EFD', 'FDE', 'DFE', 'EDF', 'FED', 'DEF']), of = (s) => to['ABC'.indexOf(s)], said = `점 A와 점 ${of('A')}, 점 B와 점 ${of('B')}, 점 C와 점 ${of('C')}가 각각 대응한다`;
            const head = `${tri('ABC')} ${SIM} ${tri(to)}일 때, `, why = `닮음을 기호로 나타낼 때 두 도형의 꼭짓점은 대응하는 차례대로 쓴다. ${said}. `;
            if (n === 0) {
              const side = d.pick(['AB', 'BC', 'AC']), right = [of(side[0]), of(side[1])].sort().join('');
              return pickOne(d, `${head}${SG(side)}의 대응변은?`, SG(right), ['DE', 'EF', 'DF'].filter((s) => s !== right).map((s) => SG(s)), { explain: `${why}${SG(side)}의 대응변은 ${SG(right)}이다.` });
            }
            const v = d.pick(['A', 'B', 'C']);
            return pickOne(d, `${head}∠${v}의 대응각은?`, '∠' + of(v), ['D', 'E', 'F'].filter((s) => s !== of(v)).map((s) => '∠' + s), { explain: `${why}∠${v}의 대응각은 ∠${of(v)}이다.` });
          }, { count: 2 }),
          T('sim-grid', '모눈 위의 삼각형 가운데 닮은 삼각형 찾기', '②3', (d) => {
            // 틀린 그림: 한쪽 방향으로만 2배로 늘인 것, 2배로 늘인 뒤 한 꼭짓점을 한 칸 옮긴 것
            const v = d.until(() => {
              const a = d.int(2, 3), h = d.int(2, 3), c = d.int(0, a), base = [[0, 0], [a, 0], [c, h]], turn = d.pick([(p) => [-2 * p[1], 2 * p[0]], (p) => [2 * p[1], 2 * p[0]], (p) => [-2 * p[0], -2 * p[1]]]);
              const s1 = d.bool() ? [[0, 0], [2 * a, 0], [2 * c, h]] : [[0, 0], [a, 0], [c, 2 * h]], s2 = [[0, 0], [2 * a, 0], [2 * c + (c < a ? 1 : -1), 2 * h]];
              return { base, list: d.shuffle([[snug(base.map(turn)), true], [snug(s1.map((p) => [-p[1], p[0]])), false], [snug(s2), false]]) };
            }, (w) => w.list.every(([t, ok]) => simTri(w.base, t) === ok && Math.max(...t.map((p) => Math.max(p[0], p[1]))) <= 6));
            const u = 16, b = Board(), cols = 16, rows = 16, pt = (p, ox, oy) => [(ox + p[0]) * u, (oy - p[1]) * u];
            for (let i = 0; i <= cols; i += 1) b.seg([i * u, 0], [i * u, rows * u], 'thin', 'stroke:#cbd5e1;stroke-width:0.8');
            for (let j = 0; j <= rows; j += 1) b.seg([0, j * u], [cols * u, j * u], 'thin', 'stroke:#cbd5e1;stroke-width:0.8');
            const spots = [[1, 6], [9, 7], [1, 15], [9, 15]], bp = v.base.map((p) => pt(p, spots[0][0] + 1, spots[0][1] - 1));
            b.poly(bp, FACE); bp.forEach((p, i) => b.name(p, 'ABC'[[1, 2, 0][i]], dirOf(ctr(bp), p), 10));
            v.list.forEach(([t], i) => { const h = Math.max(...t.map((p) => p[1])), q = t.map((p) => pt(p, spots[i + 1][0], spots[i + 1][1])); b.poly(q, FACE); b.text([spots[i + 1][0] * u + 3, (spots[i + 1][1] - h) * u - 10], TAG[i]); });
            const told = (t) => t.map((p) => `(${p[0]}, ${p[1]})`).join(', '), at = v.list.findIndex((r) => r[1]);
            return C(`모눈 위에 그린 삼각형 ㉠, ㉡, ㉢ 가운데 ${tri('ABC')}와 닮은 삼각형은?`, TAG.slice(0, 3), at, {
              figure: b.svg(`모눈 위의 삼각형 ABC와 삼각형 ㉠, ㉡, ㉢. 꼭짓점은 모두 모눈의 점 위에 있다. 꼭짓점의 자리(가로 칸, 세로 칸) — 삼각형 ABC: ${told(v.base)} / ㉠: ${told(v.list[0][0])} / ㉡: ${told(v.list[1][0])} / ㉢: ${told(v.list[2][0])}`),
              explain: `삼각형 ${TAG[at]}의 세 변의 길이는 ${tri('ABC')}의 세 변의 길이의 2배이므로 ${tri('ABC')}를 2배로 확대한 도형과 합동이다. 나머지 두 삼각형은 한쪽 방향으로만 늘였거나 한 꼭짓점의 자리가 달라 대응변의 길이의 비가 일정하지 않다.`,
              facts: { truth: v.list.map((r) => r[1]), want: true }
            });
          }),
          T('sim-claims', '닮은 도형에 대한 설명 가리기', '②2 ①4', (d) => {
            const wantTrue = d.bool();
            return sayQ(d, `다음 중 닮은 도형에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, SIM_TRUE, SIM_FALSE, wantTrue);
          })
        ]
      },
      {
        id: 'plane', title: '닮은 평면도형의 성질', standard: S12,
        types: [
          T('plane-tri', '닮은 두 삼각형에서 닮음비, 대응변의 길이, 대응각의 크기', '①5 ②4', tidy((d, n) => {
            const [m, k] = d.pick([[2, 3], [3, 4], [3, 5], [4, 5]]), big = d.bool(), s1 = big ? k : m, s2 = big ? m : k, head = `그림에서 ${tri('ABC')} ${SIM} ${tri('DEF')}일 때, `;
            if (n === 2) {
              const [A, Bv] = d.until(() => [5 * d.int(8, 15), 5 * d.int(8, 14)], (w) => { const c = 180 - w[0] - w[1]; return c >= 35 && new Set([w[0], w[1], c]).size === 3; }), Cv = 180 - A - Bv, t = asa(10, Bv, Cv);
              const f = figs([{ P: scale(t, s1), order: 'ABC', angles: [['A', 'B', 'C', A + '°'], ['B', 'C', 'A', Bv + '°']] }, { P: ren(scale(t, s2), 'ABC', 'DEF'), order: 'DEF' }], { w: 222, h: 112 });
              return degQ(`${head}∠F의 크기는?`, Cv, {
                figure: f.b.svg(`같은 방향으로 놓인 두 삼각형 ABC와 DEF. 삼각형 ABC에서 ∠A = ${A}°, ∠B = ${Bv}°`),
                explain: `∠F의 대응각은 ∠C이다. ∠C = 180° − ${A}° − ${Bv}° = ${Cv}°이므로 ∠F = ${Cv}°이다.`, facts: { calc: [[`180-${A}-${Bv}`, 0]], unseen: [180] }
              });
            }
            const c0 = d.int(2, 5), a0 = d.until(() => d.int(3, 6), (x) => x !== c0 && x <= 1.7 * c0 && c0 <= 1.7 * x), bd = 5 * d.int(11, 15), t = sas(c0, a0, bd), AB = c0 * s1, BC = a0 * s1, DE = c0 * s2, EF = a0 * s2;
            const f = figs([{ P: scale(t, s1), order: 'ABC', angles: [['B', 'C', 'A', bd + '°']], sides: [['B', 'C', cm(BC)]].concat(n === 0 ? [['A', 'B', cm(AB)]] : []) },
              { P: ren(scale(t, s2), 'ABC', 'DEF'), order: 'DEF', sides: [['E', 'F', cm(EF)]].concat(n === 1 ? [['D', 'E', cm(DE)]] : []) }], { w: 206, h: 108 });
            const said = `같은 방향으로 놓인 두 삼각형 ABC와 DEF. 삼각형 ABC에서 변 BC = ${cm(BC)}, ∠B = ${bd}°${n === 0 ? `, 변 AB = ${cm(AB)}` : ''}. 삼각형 DEF에서 변 EF = ${cm(EF)}${n === 1 ? `, 변 DE = ${cm(DE)}` : ''}`;
            if (n === 0) return ratioQ(`${head}${tri('ABC')}와 ${tri('DEF')}의 닮음비를 ${RATIO}`, s1, s2, {
              figure: f.b.svg(said), explain: `닮음비는 대응변의 길이의 비이다. ${SG('BC')}의 대응변은 ${SG('EF')}이므로 닮음비는 ${BC} : ${EF} = ${s1} : ${s2}이다.`,
              facts: { calc: [[`${BC}/${a0}`, 0], [`${EF}/${a0}`, 1]], unseen: [a0] }
            });
            return lenQ(`${head}${SG('AB')}의 길이는?`, AB, {
              figure: f.b.svg(said), explain: `${SG('BC')}의 대응변은 ${SG('EF')}이므로 닮음비는 ${BC} : ${EF} = ${s1} : ${s2}이다. ${SG('AB')}의 대응변은 ${SG('DE')}이므로 ${SG('AB')} : ${DE} = ${s1} : ${s2}에서 ${SG('AB')} = ${cm(AB)}이다.`,
              facts: { calc: [[`${DE}*${BC}/${EF}`, 0]] }
            });
          }), { count: 3 }),
          T('plane-claims', '닮은 두 도형에 대한 설명 가리기', '①6 ②6', tidy((d, n) => {
            const [m, k] = d.pick([[2, 3], [3, 4], [3, 5]]), big = d.bool(), s1 = big ? k : m, s2 = big ? m : k, wantTrue = d.bool();
            if (n === 0) {
              const v = d.until(() => ({ c0: d.int(2, 4), a0: d.int(3, 5), al: 5 * d.int(17, 22), be: 5 * d.int(15, 19), ga: 5 * d.int(14, 19) }), (w) => {
                const q = quadA(w.c0, w.a0, w.al, w.be, w.ga), dl = 360 - w.al - w.be - w.ga;
                return w.a0 > w.c0 && w.a0 <= 1.7 * w.c0 && w.al !== w.ga && dl >= 70 && dl <= 115 && new Set([w.al, w.be, w.ga, dl]).size === 4 && q.D[0] - q.A[0] > 0.45 * w.a0 && q.D[1] > 0.45 * w.c0 && dist(q.C, q.D) < 2 * w.a0;
              });
              const dl = 360 - v.al - v.be - v.ga, q = quadA(v.c0, v.a0, v.al, v.be, v.ga), c1 = v.c0 * s1, a1 = v.a0 * s1, c2 = v.c0 * s2, a2 = v.a0 * s2;
              const f = figs([{ P: scale(q, s1), order: 'ABCD', angles: [['A', 'B', 'D', v.al + '°'], ['C', 'D', 'B', v.ga + '°']], sides: [['A', 'B', cm(c1)], ['B', 'C', cm(a1)]] },
                { P: ren(scale(q, s2), 'ABCD', 'EFGH'), order: 'EFGH', angles: [['F', 'G', 'E', v.be + '°']], sides: [['F', 'G', cm(a2)]] }], { w: 206, h: 104 });
              const wrongEF = c1 + a2 - a1 > 0 ? c1 + a2 - a1 : c2 + 1, wrongH = dl + (dl >= 100 ? -10 : 10);
              const yes = [`두 사각형의 닮음비는 ${s1} : ${s2}이다.`, `${SG('EF')} = ${cm(c2)}이다.`, `∠E = ${v.al}°이다.`, `∠G = ${v.ga}°이다.`, `∠B = ${v.be}°이다.`, `∠H = ${dl}°이다.`];
              const no = [
                [`두 사각형의 닮음비는 ${s2} : ${s1}이다.`, `닮음비는 ${SG('BC')} : ${SG('FG')} = ${a1} : ${a2} = ${s1} : ${s2}이다.`, [yes[0]]],
                [`${SG('EF')} = ${cm(wrongEF)}이다.`, `${SG('AB')} : ${SG('EF')} = ${s1} : ${s2}이므로 ${SG('EF')} = ${cm(c2)}이다.`, [yes[1]]],
                [`∠E = ${v.ga}°이다.`, `∠E의 대응각은 ∠A이므로 ∠E = ${v.al}°이다.`, [yes[2]]],
                [`∠H = ${wrongH}°이다.`, `∠H = ∠D = 360° − ${v.al}° − ${v.be}° − ${v.ga}° = ${dl}°이다.`, [yes[5]]]
              ];
              return sayQ(d, `그림에서 ${quad('ABCD')} ${SIM} ${quad('EFGH')}일 때, 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue,
                f.b.svg(`같은 방향으로 놓인 두 사각형 ABCD와 EFGH. 사각형 ABCD에서 변 AB = ${cm(c1)}, 변 BC = ${cm(a1)}, ∠A = ${v.al}°, ∠C = ${v.ga}°. 사각형 EFGH에서 변 FG = ${cm(a2)}, ∠F = ${v.be}°`));
            }
            const to = d.pick(['EFD', 'FDE', 'DFE', 'EDF', 'FED']), of = (s) => to['ABC'.indexOf(s)], seg = (s) => [of(s[0]), of(s[1])].sort().join('');
            const c0 = d.int(2, 4), a0 = d.until(() => d.int(3, 5), (x) => x !== c0 && x <= 1.7 * c0 && c0 <= 1.7 * x), bd = 5 * d.int(11, 15), t = sas(c0, a0, bd), AB = c0 * s1, BC = a0 * s1, c2 = c0 * s2, a2 = a0 * s2;
            const second = rot(ren(scale(d.bool() ? flip(t) : t, s2), 'ABC', to), d.pick([150, 180, 205]));
            const f = figs([{ P: scale(t, s1), order: 'ABC', angles: [['B', 'C', 'A', bd + '°']], sides: [['A', 'B', cm(AB)], ['B', 'C', cm(BC)]] }, { P: second, order: 'DEF', sides: [[of('A'), of('B'), cm(c2)]] }], { w: 150, h: 220, gap: 46, stack: true });
            const other = d.pick(['A', 'C']), wrongLen = a2 + (s2 > s1 ? s2 : 1);
            const yes = [`∠${of('B')} = ${bd}°이다.`, `점 A의 대응점은 점 ${of('A')}이다.`, `${SG('BC')}의 대응변은 ${SG(seg('BC'))}이다.`, `${SG(seg('BC'))} = ${cm(a2)}이다.`, `${tri('ABC')}와 ${tri(to)}의 닮음비는 ${s1} : ${s2}이다.`];
            const no = [
              [`${SG('BC')}의 대응변은 ${SG(seg('AC'))}이다.`, `${SG('BC')}의 대응변은 점 B, C의 대응점 ${of('B')}, ${of('C')}를 이은 ${SG(seg('BC'))}이다.`, [yes[2]]],
              [`점 ${other}의 대응점은 점 ${of('B')}이다.`, `기호에서 같은 자리에 적힌 꼭짓점끼리 대응하므로 점 ${other}의 대응점은 점 ${of(other)}이다.`, [yes[1]]],
              [`${SG(seg('BC'))} = ${cm(wrongLen)}이다.`, `${SG('BC')} : ${SG(seg('BC'))} = ${s1} : ${s2}이므로 ${SG(seg('BC'))} = ${cm(a2)}이다.`, [yes[3]]],
              [`${tri('ABC')}와 ${tri(to)}의 닮음비는 ${s2} : ${s1}이다.`, `닮음비는 ${SG('AB')} : ${SG(seg('AB'))} = ${AB} : ${c2} = ${s1} : ${s2}이다.`, [yes[4]]]
            ];
            return sayQ(d, `그림에서 ${tri('ABC')} ${SIM} ${tri(to)}일 때, 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue,
              f.b.svg(`서로 다른 방향으로 놓인 두 삼각형 ABC와 DEF. 삼각형 ABC에서 변 AB = ${cm(AB)}, 변 BC = ${cm(BC)}, ∠B = ${bd}°. 삼각형 DEF에서 변 ${seg('AB')} = ${cm(c2)}`));
          }), { count: 2 }),
          T('plane-quad', '닮은 두 사각형에서 변의 길이와 각의 크기', '①7 ②5', tidy((d, n) => {
            const [m, k] = d.pick([[2, 3], [3, 4], [3, 5]]), big = d.bool(), s1 = big ? k : m, s2 = big ? m : k, head = `그림에서 ${quad('ABCD')} ${SIM} ${quad('EFGH')}일 때, `;
            if (n === 0) {
              const v = d.until(() => ({ c0: d.int(3, 5), a0: d.int(3, 6), e0: d.int(2, 5), al: 5 * d.int(17, 21), be: 5 * d.int(15, 19) }), (w) => {
                const q = quadT(w.c0, w.a0, w.e0, w.al, w.be), gc = angleAt(q.C, q.B, q.D), gd = angleAt(q.D, q.A, q.C);
                return new Set([w.c0, w.a0, w.e0]).size === 3 && gc > 62 && gc < 118 && gd > 62 && gd < 118 && q.D[1] > 0.5 * w.c0 && q.D[0] > q.A[0] + 0.4 * w.a0;
              });
              const q = quadT(v.c0, v.a0, v.e0, v.al, v.be), c1 = v.c0 * s1, e1 = v.e0 * s1, c2 = v.c0 * s2, a2 = v.a0 * s2, x = v.a0 * s1, y = v.e0 * s2;
              const f = figs([{ P: scale(q, s1), order: 'ABCD', sides: [['A', 'B', cm(c1)], ['B', 'C', sv('x') + ' cm'], ['A', 'D', cm(e1)]] },
                { P: ren(scale(q, s2), 'ABCD', 'EFGH'), order: 'EFGH', sides: [['E', 'F', cm(c2)], ['F', 'G', cm(a2)], ['E', 'H', sv('y') + ' cm']] }], { w: 170, h: 100, gap: 60 });
              return M(`${head}${X}, ${Y}의 값은?`, [{ label: `${X} =`, answer: x }, { label: `${Y} =`, answer: y }], {
                figure: f.b.svg(`같은 방향으로 놓인 두 사각형 ABCD와 EFGH. 사각형 ABCD에서 변 AB = ${cm(c1)}, 변 BC = x cm, 변 AD = ${cm(e1)}. 사각형 EFGH에서 변 EF = ${cm(c2)}, 변 FG = ${cm(a2)}, 변 EH = y cm`),
                shown: `${X} = ${x}, ${Y} = ${y}`,
                explain: `${SG('AB')}의 대응변은 ${SG('EF')}이므로 닮음비는 ${c1} : ${c2} = ${s1} : ${s2}이다. ${X} : ${a2} = ${s1} : ${s2}에서 ${X} = ${x}이고, ${e1} : ${Y} = ${s1} : ${s2}에서 ${Y} = ${y}이다.`,
                facts: { calc: [[`${a2}*${c1}/${c2}`, 0], [`${e1}*${c2}/${c1}`, 1]] }
              });
            }
            const v = d.until(() => ({ c0: d.int(2, 4), a0: d.int(3, 5), al: 5 * d.int(17, 22), be: 5 * d.int(15, 19), ga: 5 * d.int(14, 19) }), (w) => {
              const q = quadA(w.c0, w.a0, w.al, w.be, w.ga), dl = 360 - w.al - w.be - w.ga;
              return w.a0 >= w.c0 && w.a0 <= 1.7 * w.c0 && dl >= 70 && dl <= 115 && new Set([w.al, w.be, w.ga, dl]).size === 4 && q.D[0] - q.A[0] > 0.45 * w.a0 && q.D[1] > 0.45 * w.c0 && dist(q.C, q.D) < 2 * w.a0;
            });
            const dl = 360 - v.al - v.be - v.ga, q = quadA(v.c0, v.a0, v.al, v.be, v.ga);
            const f = figs([{ P: scale(q, s1), order: 'ABCD', angles: [['A', 'B', 'D', v.al + '°'], ['B', 'C', 'A', v.be + '°'], ['C', 'D', 'B', v.ga + '°']] }, { P: ren(scale(q, s2), 'ABCD', 'EFGH'), order: 'EFGH' }], { w: 214, h: 104 });
            return degQ(`${head}∠H의 크기는?`, dl, {
              figure: f.b.svg(`같은 방향으로 놓인 두 사각형 ABCD와 EFGH. 사각형 ABCD에서 ∠A = ${v.al}°, ∠B = ${v.be}°, ∠C = ${v.ga}°`),
              explain: `∠H의 대응각은 ∠D이다. 사각형의 네 내각의 크기의 합은 360°이므로 ∠D = 360° − ${v.al}° − ${v.be}° − ${v.ga}° = ${dl}°이고, ∠H = ${dl}°이다.`,
              facts: { calc: [[`360-${v.al}-${v.be}-${v.ga}`, 0]], unseen: [360] }
            });
          }), { count: 2 }),
          T('plane-para', '닮은 두 평행사변형에서 변의 길이와 둘레의 길이', '①8 ①9 ②7', tidy((d, n) => {
            const [m, k] = d.pick([[2, 3], [3, 4], [3, 5], [1, 2]]), a0 = d.int(3, 5), s0 = d.until(() => d.int(2, 4), (x) => x !== a0), th = d.pick([62, 66, 70, 74]);
            const BC = a0 * m, AB = s0 * m, FG = a0 * k, GH = s0 * k, q = pgram(a0, s0, th);
            const f = figs([{ P: scale(q, m), order: 'ABCD', sides: [['B', 'C', cm(BC)]] }, { P: ren(scale(q, k), 'ABCD', 'EFGH'), order: 'EFGH', sides: [['G', 'H', cm(GH)]] }], { w: 206, h: 104 });
            const fig = f.b.svg(`같은 방향으로 놓인 두 평행사변형 ABCD와 EFGH. 평행사변형 ABCD에서 변 BC = ${cm(BC)}. 평행사변형 EFGH에서 변 GH = ${cm(GH)}`), head = `그림의 두 평행사변형에서 ${quad('ABCD')} ${SIM} ${quad('EFGH')}이고 닮음비가 ${m} : ${k}일 때, `;
            if (n === 0) return M(`${head}${SG('AB')}, ${SG('EH')}의 길이는?`, [{ label: `${SG('AB')} =`, answer: AB, unit: 'cm' }, { label: `${SG('EH')} =`, answer: FG, unit: 'cm' }], {
              figure: fig, shown: `${SG('AB')} = ${cm(AB)}, ${SG('EH')} = ${cm(FG)}`,
              explain: `평행사변형의 대변의 길이는 같으므로 ${SG('EF')} = ${SG('GH')} = ${cm(GH)}, ${SG('AD')} = ${SG('BC')} = ${cm(BC)}이다. ${SG('AB')} : ${GH} = ${m} : ${k}에서 ${SG('AB')} = ${cm(AB)}이고, ${BC} : ${SG('EH')} = ${m} : ${k}에서 ${SG('EH')} = ${cm(FG)}이다.`,
              facts: { calc: [[`${GH}*${m}/${k}`, 0], [`${BC}*${k}/${m}`, 1]] }
            });
            return lenQ(`${head}${quad('ABCD')}의 둘레의 길이는?`, 2 * (BC + AB), {
              figure: fig, explain: `${SG('CD')}의 대응변은 ${SG('GH')}이므로 ${SG('CD')} : ${GH} = ${m} : ${k}에서 ${SG('CD')} = ${cm(AB)}이다. ${quad('ABCD')}의 둘레의 길이는 2 × (${BC} + ${AB}) = ${2 * (BC + AB)}(cm)이다.`,
              facts: { calc: [[`2*(${BC}+${GH}*${m}/${k})`, 0]], unseen: [2] }
            });
          }), { count: 2 }),
          T('plane-tri-peri', '닮음비로 대응변을 구하여 삼각형의 둘레의 길이 구하기', '②7 심2', tidy((d) => {
            const [n, m] = d.pick([[2, 3], [3, 4], [3, 5], [4, 5]]), [p, q, r] = d.pick([[4, 5, 6], [5, 6, 7], [4, 6, 7], [5, 7, 8], [6, 7, 8], [5, 6, 8], [4, 5, 7]]), t = sss(p, q, r);
            const AB = m * r, AC = m * q, EF = n * p, ans = n * (p + q + r);
            const f = figs([{ P: scale(t, m), order: 'ABC', sides: [['A', 'B', cm(AB)], ['A', 'C', cm(AC)]] }, { P: ren(scale(t, n), 'ABC', 'DEF'), order: 'DEF', sides: [['E', 'F', cm(EF)]] }], { w: 214, h: 108 });
            return lenQ(`그림에서 ${tri('ABC')} ${SIM} ${tri('DEF')}이고 닮음비가 ${m} : ${n}일 때, ${tri('DEF')}의 둘레의 길이는?`, ans, {
              figure: f.b.svg(`같은 방향으로 놓인 두 삼각형 ABC와 DEF. 삼각형 ABC에서 변 AB = ${cm(AB)}, 변 AC = ${cm(AC)}. 삼각형 DEF에서 변 EF = ${cm(EF)}`),
              explain: `${AB} : ${SG('DE')} = ${m} : ${n}에서 ${SG('DE')} = ${cm(n * r)}, ${AC} : ${SG('DF')} = ${m} : ${n}에서 ${SG('DF')} = ${cm(n * q)}이다. ${tri('DEF')}의 둘레의 길이는 ${n * r} + ${n * q} + ${EF} = ${ans}(cm)이다.`,
              facts: { calc: [[`${AB}*${n}/${m}+${AC}*${n}/${m}+${EF}`, 0]] }
            });
          })),
          T('plane-shortest', '가장 짧은(긴) 변의 길이가 주어진 닮은 삼각형의 둘레의 길이', '②8', (d) => {
            const [m, n] = d.until(() => [d.int(2, 7), d.int(2, 7)], (w) => w[0] !== w[1] && gcd(w[0], w[1]) === 1), [p, q, r] = d.pick([[2, 3, 4], [3, 4, 5], [4, 5, 6], [3, 5, 6], [2, 4, 5], [4, 6, 7], [3, 4, 6]]), short = d.bool();
            const sides = d.shuffle([m * p, m * q, m * r]), key = short ? n * p : n * r, ans = n * (p + q + r), mine = short ? m * p : m * r;
            return lenQ(`세 변의 길이가 ${sides.map(cm).join(', ')}인 ${tri('ABC')}와 닮은 ${tri('DEF')}가 있다. ${tri('DEF')}에서 가장 ${short ? '짧은' : '긴'} 변의 길이가 ${cm(key)}일 때, ${tri('DEF')}의 둘레의 길이는?`, ans, {
              explain: `가장 ${short ? '짧은' : '긴'} 변끼리 대응하므로 닮음비는 ${mine} : ${key} = ${m} : ${n}이다. ${tri('ABC')}의 둘레의 길이가 ${m * (p + q + r)} cm이므로 ${tri('DEF')}의 둘레의 길이는 ${m * (p + q + r)} × ${frac(n, m)} = ${ans}(cm)이다.`,
              facts: { calc: [[`(${m * p}+${m * q}+${m * r})*${key}/${mine}`, 0]] }
            });
          }),
          T('plane-overlap', '겹쳐 놓인 닮은 두 삼각형에서 변의 길이', '②9', tidy((d) => {
            const [m, n] = d.pick([[2, 3], [3, 4], [3, 5], [1, 2], [2, 5], [1, 3]]), k = d.int(2, 5), t = d.until(() => d.int(2, 6), (x) => x !== k && x >= 0.6 * k && x <= 1.5 * k), BE = k * m, EC = k * (n - m), DE = m * t, AC = n * t, ga = d.pick([50, 56, 62, 68]);
            const pC = [BE + EC, 0], pA = go(pC, AC, 180 - ga), P = { A: pA, B: [0, 0], C: pC, D: lerp([0, 0], pA, m / n), E: [BE, 0] };
            const f = figs([{ P, order: 'ABC', segs: [['D', 'E']], sides: [['D', 'E', cm(DE), { in: 'B' }], ['B', 'E', cm(BE)], ['E', 'C', cm(EC)]], at: { E: 270 } }], { w: 190, h: 120 });
            return lenQ(`그림에서 ${tri('ABC')} ${SIM} ${tri('DBE')}이고 ${SG('DE')} = ${cm(DE)}, ${SG('BE')} = ${cm(BE)}, ${SG('EC')} = ${cm(EC)}일 때, ${SG('AC')}의 길이는?`, AC, {
              figure: f.b.svg(`삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 BC 위에 있고 선분 DE가 그어져 있다. 선분 DE = ${cm(DE)}, 선분 BE = ${cm(BE)}, 선분 EC = ${cm(EC)}`),
              explain: `${SG('BC')}의 대응변은 ${SG('BE')}이고 ${SG('BC')} = ${BE} + ${EC} = ${BE + EC}(cm)이므로 닮음비는 ${BE + EC} : ${BE} = ${n} : ${m}이다. ${SG('AC')}의 대응변은 ${SG('DE')}이므로 ${SG('AC')} : ${DE} = ${n} : ${m}에서 ${SG('AC')} = ${cm(AC)}이다.`,
              facts: { calc: [[`${DE}*(${BE}+${EC})/${BE}`, 0]] }
            });
          }))
        ]
      },
      {
        id: 'solid', title: '닮은 입체도형의 성질', standard: S12,
        types: [
          T('solid-sphere', '두 구의 닮음비', '①11', (d) => {
            const [m, n] = d.pick([[1, 2], [2, 3], [3, 4], [1, 3], [3, 5], [2, 5]]), t = d.int(2, 4), ra = m * t, rb = n * t, b = Board(), Rb = 44, Ra = Math.max(16, Rb * m / n);
            const s1 = sphereOn(b, [Ra, 60 - Ra + Rb], Ra), s2 = sphereOn(b, [2 * Ra + 62 + Rb, 60], Rb);
            for (const [s, r] of [[s1, ra], [s2, rb]]) b.seg(s.c, [s.c[0] + s.R, s.c[1]], 'thin').dot(s.c, 2).text([s.c[0] + s.R + 21, s.c[1] - 9], cm(r), blue);
            b.text([s1.c[0], 60 + Rb + 13], 'A').text([s2.c[0], 60 + Rb + 13], 'B');
            return ratioQ(`그림과 같이 반지름의 길이가 각각 ${cm(ra)}, ${cm(rb)}인 두 구 A, B의 닮음비를 ${RATIO}`, m, n, {
              figure: b.svg(`두 구 A와 B. 구 A의 반지름의 길이 ${cm(ra)}, 구 B의 반지름의 길이 ${cm(rb)}`),
              explain: `두 구는 항상 닮은 도형이고, 닮음비는 반지름의 길이의 비와 같다. ${ra} : ${rb} = ${m} : ${n}이다.`, facts: { calc: [[`${ra}/${t}`, 0], [`${rb}/${t}`, 1]], unseen: [t] }
            });
          }),
          T('solid-prism', '닮은 두 삼각기둥에서 닮음비와 대응하는 면', '①12 ①13 ②10', (d, n) => {
            const [m, k] = d.pick([[2, 3], [3, 4], [3, 5], [1, 2]]), c0 = d.int(2, 4), a0 = d.until(() => d.int(2, 5), (x) => x !== c0), h0 = d.int(3, 6), AB = c0 * m, EF = a0 * m, GH = c0 * k, IL = h0 * k;
            const fig = prismsFig(m, k, [[0, 'AB', cm(AB)], [0, 'EF', cm(EF)], [1, 'GH', cm(GH)], [1, 'IL', cm(IL)]],
              `세워 놓은 두 삼각기둥. 작은 삼각기둥은 윗면이 삼각형 ABC, 아랫면이 삼각형 DEF이고 모서리 AD, BE, CF가 서 있다. 큰 삼각기둥은 윗면이 삼각형 GHI, 아랫면이 삼각형 JKL이고 모서리 GJ, HK, IL이 서 있다. 모서리 AB = ${cm(AB)}, 모서리 EF = ${cm(EF)}, 모서리 GH = ${cm(GH)}, 모서리 IL = ${cm(IL)}`);
            const head = `그림의 두 삼각기둥은 서로 닮은 도형이고 ${tri('ABC')}와 ${tri('GHI')}가 대응하는 면이다. `;
            if (n === 0) return ratioQ(`${head}작은 삼각기둥과 큰 삼각기둥의 닮음비를 ${RATIO}`, m, k, {
              figure: fig, explain: `닮음비는 대응하는 모서리의 길이의 비이다. ${SG('AB')}에 대응하는 모서리는 ${SG('GH')}이므로 닮음비는 ${AB} : ${GH} = ${m} : ${k}이다.`,
              facts: { calc: [[`${AB}/${c0}`, 0], [`${GH}/${c0}`, 1]], unseen: [c0] }
            });
            const [face, right] = d.pick([['ADFC', 'GJLI'], ['ADEB', 'GJKH'], ['BEFC', 'HKLI']]), of = (s) => 'GHIJKL'['ABCDEF'.indexOf(s)];
            return pickOne(d, `${head}면 ${face}에 대응하는 면은?`, `면 ${right}`, ['GJLI', 'GJKH', 'HKLI', 'JKL'].filter((s) => s !== right).map((s) => `면 ${s}`), {
              figure: fig, explain: `${tri('ABC')}와 ${tri('GHI')}가 대응하므로 꼭짓점 A, B, C, D, E, F에 대응하는 꼭짓점은 차례로 G, H, I, J, K, L이다. 면 ${face}에 대응하는 면은 면 ${face.split('').map(of).join('')}이다.`
            });
          }, { count: 2 }),
          T('solid-box', '닮은 두 직육면체에서 모서리의 길이', '②12 ②13 ①12', (d) => {
            const [m, k] = d.pick([[2, 3], [1, 2], [3, 4], [3, 5]]), [p, q, r] = d.until(() => [d.int(2, 4), d.int(2, 4), d.int(3, 5)], (w) => new Set(w).size === 3 && w[0] * k <= 12 && w[2] * k <= 15);
            const x = p * m, y = r * k;
            return M(`그림의 두 직육면체 A, B는 서로 닮은 도형이고, 같은 자리에 놓인 모서리끼리 대응한다. ${X}, ${Y}의 값은?`, [{ label: `${X} =`, answer: x }, { label: `${Y} =`, answer: y }], {
              figure: boxesFig([[p * m, q * m, r * m], [p * k, q * k, r * k]], [[sv('x') + ' cm', cm(q * m), cm(r * m)], [cm(p * k), cm(q * k), sv('y') + ' cm']],
                `두 직육면체 A와 B. 직육면체 A의 가로 x cm, 세로 ${cm(q * m)}, 높이 ${cm(r * m)}. 직육면체 B의 가로 ${cm(p * k)}, 세로 ${cm(q * k)}, 높이 y cm`, ['A', 'B']),
              shown: `${X} = ${x}, ${Y} = ${y}`,
              explain: `세로인 모서리끼리 대응하므로 닮음비는 ${q * m} : ${q * k} = ${m} : ${k}이다. ${X} : ${p * k} = ${m} : ${k}에서 ${X} = ${x}이고, ${r * m} : ${Y} = ${m} : ${k}에서 ${Y} = ${y}이다.`,
              facts: { calc: [[`${p * k}*${q * m}/${q * k}`, 0], [`${r * m}*${q * k}/${q * m}`, 1]] }
            });
          }),
          T('solid-tetra-sum', '닮은 두 정사면체에서 모든 모서리의 길이의 합', '심4', (d) => {
            const [m, k] = d.pick([[2, 3], [1, 2], [3, 4], [2, 5], [3, 5], [1, 3]]), t = d.int(2, 4), L = k * t, b = Board(), s2 = 96, s1 = Math.max(34, s2 * m / k);
            tetraOn(b, [0, 84], s1); const q = tetraOn(b, [s1 + 46, 84], s2);
            b.beside(q.A, q.B, cm(L), q.D);
            return lenQ(`그림의 두 정사면체는 서로 닮은 도형이고 닮음비는 ${m} : ${k}이다. 큰 정사면체의 한 모서리의 길이가 ${cm(L)}일 때, 작은 정사면체의 모든 모서리의 길이의 합은?`, 6 * m * t, {
              figure: b.svg(`작은 정사면체와 큰 정사면체. 큰 정사면체의 한 모서리의 길이 ${cm(L)}`),
              explain: `작은 정사면체의 한 모서리의 길이는 ${L} × ${frac(m, k)} = ${m * t}(cm)이다. 정사면체의 모서리는 6개이고 길이가 모두 같으므로 6 × ${m * t} = ${6 * m * t}(cm)이다.`,
              facts: { calc: [[`6*${L}*${m}/${k}`, 0]], unseen: [6] }
            });
          }),
          T('solid-claims', '닮은 두 삼각기둥에 대한 설명 가리기', '②11 ①14', (d) => {
            const [m, k] = d.pick([[2, 3], [3, 4], [1, 2], [3, 5]]), c0 = d.int(2, 4), a0 = d.until(() => d.int(2, 5), (x) => x !== c0), h0 = d.until(() => d.int(3, 6), (x) => x !== c0 && x !== a0), AB = c0 * m, GH = c0 * k, HI = a0 * k, IL = h0 * k, BC = a0 * m, CF = h0 * m, wantTrue = d.bool();
            const fig = prismsFig(m, k, [[0, 'AB', cm(AB)], [1, 'GH', cm(GH)], [1, 'HI', cm(HI)], [1, 'IL', cm(IL)]],
              `세워 놓은 두 삼각기둥. 작은 삼각기둥은 윗면이 삼각형 ABC, 아랫면이 삼각형 DEF이고 모서리 AD, BE, CF가 서 있다. 큰 삼각기둥은 윗면이 삼각형 GHI, 아랫면이 삼각형 JKL이고 모서리 GJ, HK, IL이 서 있다. 모서리 AB = ${cm(AB)}, 모서리 GH = ${cm(GH)}, 모서리 HI = ${cm(HI)}, 모서리 IL = ${cm(IL)}`);
            const wrongBC = HI - (GH - AB) !== BC && HI - (GH - AB) > 0 ? HI - (GH - AB) : BC + 1, wrongCF = IL - (GH - AB) !== CF && IL - (GH - AB) > 0 ? IL - (GH - AB) : CF + 1;
            const yes = [`작은 삼각기둥과 큰 삼각기둥의 닮음비는 ${m} : ${k}이다.`, `${SG('BC')} = ${cm(BC)}이다.`, `${SG('CF')} = ${cm(CF)}이다.`, '면 ADEB에 대응하는 면은 면 GJKH이다.', `${tri('DEF')} ${SIM} ${tri('JKL')}이다.`, `${SG('DE')}에 대응하는 모서리는 ${SG('JK')}이다.`];
            const no = [
              [`작은 삼각기둥과 큰 삼각기둥의 닮음비는 ${k} : ${m}이다.`, `닮음비는 ${SG('AB')} : ${SG('GH')} = ${AB} : ${GH} = ${m} : ${k}이다.`, [yes[0]]],
              [`${SG('BC')} = ${cm(wrongBC)}이다.`, `${SG('BC')} : ${SG('HI')} = ${m} : ${k}이므로 ${SG('BC')} = ${cm(BC)}이다.`, [yes[1]]],
              ['면 ADEB에 대응하는 면은 면 HKLI이다.', '꼭짓점 A, D, E, B에 대응하는 꼭짓점은 차례로 G, J, K, H이므로 면 ADEB에 대응하는 면은 면 GJKH이다.', [yes[3]]],
              [`${SG('CF')} = ${cm(wrongCF)}이다.`, `${SG('CF')} : ${SG('IL')} = ${m} : ${k}이므로 ${SG('CF')} = ${cm(CF)}이다.`, [yes[2]]],
              [`${SG('DE')}에 대응하는 모서리는 ${SG('KL')}이다.`, `꼭짓점 D, E에 대응하는 꼭짓점은 J, K이므로 ${SG('DE')}에 대응하는 모서리는 ${SG('JK')}이다.`, [yes[5]]]
            ];
            return sayQ(d, `그림의 두 삼각기둥은 서로 닮은 도형이고 ${SG('AB')}와 ${SG('GH')}가 대응하는 모서리이다. 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue, fig);
          }),
          T('solid-cyl', '닮은 두 원기둥에서 밑면의 둘레의 길이와 넓이', '①15 ②14', (d, n) => {
            const [m, k] = d.pick([[2, 3], [1, 2], [3, 4], [3, 5], [1, 3], [2, 5]]), big = d.bool(), s1 = big ? k : m, s2 = big ? m : k, r0 = d.int(s2 === 1 ? 2 : 1, 3), h0 = d.until(() => d.int(2, 5), (x) => x > r0), r = r0 * s1, h = h0 * s1, h2 = h0 * s2, r2 = r0 * s2;
            const fig = cylsFig(r, h, h2, `두 원기둥 A와 B. 원기둥 A의 밑면의 반지름의 길이 ${cm(r)}, 높이 ${cm(h)}. 원기둥 B의 높이 ${cm(h2)}`), head = '그림의 두 원기둥 A, B는 서로 닮은 도형이다. ';
            const why = `닮음비는 높이의 비와 같으므로 ${h} : ${h2} = ${s1} : ${s2}이다. 원기둥 B의 밑면의 반지름의 길이를 ${V('r')} cm라 하면 ${r} : ${V('r')} = ${s1} : ${s2}에서 ${V('r')} = ${r2}이다. `;
            if (n === 0) return piQ(`${head}원기둥 B의 밑면의 둘레의 길이는?`, 2 * r2, 'cm', { figure: fig, explain: `${why}밑면의 둘레의 길이는 2π × ${r2} = ${2 * r2}π(cm)이다.`, facts: { calc: [[`2*${r}*${h2}/${h}`, 0]], unseen: [2] } });
            return piQ(`${head}원기둥 B의 밑면의 넓이는?`, r2 * r2, 'cm²', { figure: fig, explain: `${why}밑면의 넓이는 π × ${r2}${sup(2)} = ${r2 * r2}π(cm²)이다.`, facts: { calc: [[`(${r}*${h2}/${h})*(${r}*${h2}/${h})`, 0]] } });
          }, { count: 2 })
        ]
      },
      {
        id: 'ratio', title: '넓이의 비와 부피의 비', standard: S12,
        types: [
          T('ratio-area', '닮은 두 평면도형의 넓이의 비', '①16 ②15', tidy((d, n) => {
            const [m, k] = d.pick(n === 0 ? PAIRS : [[2, 3], [3, 4], [3, 5], [4, 5]]);
            if (n === 0) {
              const shape = d.pick(['삼각형', '사각형', '오각형', '육각형']);
              return ratioQ(`닮음비가 ${m} : ${k}인 두 ${shape}의 넓이의 비를 ${RATIO}`, m * m, k * k, {
                explain: `서로 닮은 두 평면도형의 닮음비가 ${V('m')} : ${V('n')}이면 넓이의 비는 ${V('m')}${sup(2)} : ${V('n')}${sup(2)}이다. ${m}${sup(2)} : ${k}${sup(2)} = ${m * m} : ${k * k}이다.`,
                facts: { calc: [[`${m}*${m}`, 0], [`${k}*${k}`, 1]] }
              });
            }
            const g = d.int(2, 4), [p, q, r] = d.pick([[4, 5, 6], [5, 6, 7], [4, 6, 7], [5, 7, 8]]), t = sss(p, q, r), BC = m * g, EF = k * g;
            const f = figs([{ P: scale(t, m), order: 'ABC', sides: [['B', 'C', cm(BC)]] }, { P: ren(scale(t, k), 'ABC', 'DEF'), order: 'DEF', sides: [['E', 'F', cm(EF)]] }], { w: 214, h: 104 });
            return ratioQ(`그림에서 ${tri('ABC')} ${SIM} ${tri('DEF')}일 때, ${tri('ABC')}와 ${tri('DEF')}의 넓이의 비를 ${RATIO}`, m * m, k * k, {
              figure: f.b.svg(`같은 방향으로 놓인 두 삼각형 ABC와 DEF. 변 BC = ${cm(BC)}, 변 EF = ${cm(EF)}`),
              explain: `닮음비는 ${SG('BC')} : ${SG('EF')} = ${BC} : ${EF} = ${m} : ${k}이다. 넓이의 비는 ${m}${sup(2)} : ${k}${sup(2)} = ${m * m} : ${k * k}이다.`,
              facts: { calc: [[`(${BC}/${g})*(${BC}/${g})`, 0], [`(${EF}/${g})*(${EF}/${g})`, 1]], unseen: [g] }
            });
          }), { count: 2 }),
          T('ratio-solid', '닮은 두 입체도형의 겉넓이의 비와 부피의 비', '②16', (d, n) => {
            const [m, k] = d.pick(PAIRS), solid = d.pick(['정육면체', '사면체', '원기둥', '원뿔', '삼각기둥']);
            if (n === 0) return ratioQ(`닮음비가 ${m} : ${k}인 두 ${solid}의 겉넓이의 비를 ${RATIO}`, m * m, k * k, {
              explain: `서로 닮은 두 입체도형의 닮음비가 ${V('m')} : ${V('n')}이면 겉넓이의 비는 ${V('m')}${sup(2)} : ${V('n')}${sup(2)}이다. ${m}${sup(2)} : ${k}${sup(2)} = ${m * m} : ${k * k}이다.`, facts: { calc: [[`${m}*${m}`, 0], [`${k}*${k}`, 1]] }
            });
            return ratioQ(`닮음비가 ${m} : ${k}인 두 ${solid}의 부피의 비를 ${RATIO}`, m ** 3, k ** 3, {
              explain: `서로 닮은 두 입체도형의 닮음비가 ${V('m')} : ${V('n')}이면 부피의 비는 ${V('m')}${sup(3)} : ${V('n')}${sup(3)}이다. ${m}${sup(3)} : ${k}${sup(3)} = ${m ** 3} : ${k ** 3}이다.`, facts: { calc: [[`${m}*${m}*${m}`, 0], [`${k}*${k}*${k}`, 1]] }
            });
          }, { count: 2 }),
          T('ratio-back', '넓이의 비·부피의 비에서 닮음비와 길이 구하기', '①17 심6', (d, n) => {
            const [m, k] = d.pick([[2, 3], [3, 4], [3, 5], [4, 5], [2, 5], [1, 2], [1, 3]]);
            if (n === 0) {
              const shape = d.pick(['부채꼴', '삼각형', '사각형', '오각형']);
              return ratioQ(`서로 닮은 두 ${shape}의 넓이의 비가 ${m * m} : ${k * k}일 때, 두 ${shape}의 닮음비를 ${RATIO}`, m, k, {
                explain: `넓이의 비 ${m * m} : ${k * k} = ${m}${sup(2)} : ${k}${sup(2)}이므로 닮음비는 ${m} : ${k}이다.`, facts: { calc: [[`${m * m}**0.5`, 0], [`${k * k}**0.5`, 1]], unseen: [0.5] }
              });
            }
            if (n === 1) {
              const solid = d.pick(['원뿔', '원기둥', '정육면체', '구']);
              return ratioQ(`서로 닮은 두 ${solid}의 부피의 비가 ${m ** 3} : ${k ** 3}일 때, 두 ${solid}의 닮음비를 ${RATIO}`, m, k, {
                explain: `부피의 비 ${m ** 3} : ${k ** 3} = ${m}${sup(3)} : ${k}${sup(3)}이므로 닮음비는 ${m} : ${k}이다.`, facts: { calc: [[cbrt(m ** 3), 0], [cbrt(k ** 3), 1]], unseen: [1, 3, 0.5] }
              });
            }
            const t = d.int(2, 5), AB = m * t;
            return lenQ(`${tri('ABC')} ${SIM} ${tri('DEF')}이고 ${tri('ABC')}와 ${tri('DEF')}의 넓이의 비가 ${m * m} : ${k * k}이다. ${SG('AB')} = ${cm(AB)}일 때, ${SG('DE')}의 길이는?`, k * t, {
              explain: `넓이의 비 ${m * m} : ${k * k} = ${m}${sup(2)} : ${k}${sup(2)}이므로 닮음비는 ${m} : ${k}이다. ${AB} : ${SG('DE')} = ${m} : ${k}에서 ${SG('DE')} = ${cm(k * t)}이다.`,
              facts: { calc: [[`${AB}*(${k * k}**0.5)/(${m * m}**0.5)`, 0]], unseen: [0.5] }
            });
          }, { count: 3 }),
          T('ratio-area-value', '닮음비와 한 도형의 넓이로 다른 도형의 넓이 구하기', '②17', (d) => {
            const [m, k] = d.pick(PAIRS), t = d.int(2, 9), four = d.bool(), s = four ? [quad('ABCD'), quad('EFGH')] : [tri('ABC'), tri('DEF')], up = d.bool(), from = up ? m * m * t : k * k * t, to = up ? k * k * t : m * m * t;
            return areaQ(`${s[0]} ${SIM} ${s[1]}이고 닮음비가 ${m} : ${k}이다. ${s[up ? 0 : 1]}의 넓이가 ${from} cm²일 때, ${s[up ? 1 : 0]}의 넓이는?`, to, {
              explain: `닮음비가 ${m} : ${k}이므로 넓이의 비는 ${m}${sup(2)} : ${k}${sup(2)} = ${m * m} : ${k * k}이다. ${up ? `${from} : (${s[1]}의 넓이)` : `(${s[0]}의 넓이) : ${from}`} = ${m * m} : ${k * k}에서 구하는 넓이는 ${to} cm²이다.`,
              facts: { calc: [[up ? `${from}*${k}*${k}/(${m}*${m})` : `${from}*${m}*${m}/(${k}*${k})`, 0]] }
            });
          }),
          T('ratio-volume-value', '닮은 두 입체도형에서 한쪽의 부피로 다른 쪽의 부피 구하기', '②18', (d, n) => {
            if (n === 0) {
              const [m, k] = d.pick([[2, 3], [1, 2], [3, 4], [1, 3], [3, 2], [2, 1], [4, 3]]), g = d.int(2, 4), r0 = d.int(1, 2), t = r0 * r0 * g, h = m * g, h2 = k * g, VB = k ** 3 * t, VA = m ** 3 * t;
              return piQ(`그림의 두 원기둥 A, B는 서로 닮은 도형이다. 원기둥 B의 부피가 ${VB}π cm³일 때, 원기둥 A의 부피는?`, VA, 'cm³', {
                figure: cylsFig(m * r0, h, h2, `두 원기둥 A와 B. 원기둥 A의 높이 ${cm(h)}, 원기둥 B의 높이 ${cm(h2)}`, true),
                explain: `닮음비는 높이의 비와 같으므로 ${h} : ${h2} = ${m} : ${k}이고, 부피의 비는 ${m}${sup(3)} : ${k}${sup(3)} = ${m ** 3} : ${k ** 3}이다. (A의 부피) : ${VB}π = ${m ** 3} : ${k ** 3}에서 A의 부피는 ${VA}π cm³이다.`,
                facts: { calc: [[`${VB}*${h}*${h}*${h}/(${h2}*${h2}*${h2})`, 0]] }
              });
            }
            const [m, k] = d.pick([[1, 2], [2, 3], [1, 3], [2, 5]]), [p, q, r] = d.until(() => [d.int(1, 3), d.int(1, 3), d.int(1, 4)], (w) => w[0] * w[1] * w[2] >= 4 && w[0] * w[1] * w[2] * k ** 3 <= 3000 && new Set(w).size >= 2);
            const a = [p * m, q * m, r * m], VA = a[0] * a[1] * a[2], VB = p * q * r * k ** 3;
            return volQ(`서로 닮은 두 직육면체 A, B가 있다. 직육면체 A의 가로, 세로, 높이는 각각 ${a.map(cm).join(', ')}이고, 직육면체 A의 가로에 대응하는 직육면체 B의 모서리의 길이는 ${cm(p * k)}이다. 직육면체 B의 부피는?`, VB, {
              explain: `직육면체 A의 부피는 ${a.join(' × ')} = ${VA}(cm³)이다. 닮음비는 ${a[0]} : ${p * k} = ${m} : ${k}이므로 부피의 비는 ${m ** 3} : ${k ** 3}이다. ${VA} : (B의 부피) = ${m ** 3} : ${k ** 3}에서 B의 부피는 ${VB} cm³이다.`,
              facts: { calc: [[`${a[0]}*${a[1]}*${a[2]}*${p * k}*${p * k}*${p * k}/(${a[0]}*${a[0]}*${a[0]})`, 0]] }
            });
          }, { count: 2 }),
          T('ratio-vol-to-area', '부피의 비에서 닮음비를 찾아 모서리의 길이와 겉넓이 구하기', '①18 ②19', (d, n) => {
            const [m, k] = d.pick([[2, 3], [1, 2], [3, 4], [1, 3], [2, 5], [3, 5]]);
            if (n === 0) {
              const t = d.int(1, 3), a = m * t * (m === 1 ? 2 : 1), ans = a * k / m;
              return lenQ(`그림의 두 정육면체 A, B의 부피의 비는 ${m ** 3} : ${k ** 3}이다. 정육면체 A의 한 모서리의 길이가 ${cm(a)}일 때, 정육면체 B의 한 모서리의 길이는?`, ans, {
                figure: boxesFig([[m, m, m], [k, k, k]], [[cm(a), '', ''], ['', '', '']], `두 정육면체 A와 B. 정육면체 A의 한 모서리의 길이 ${cm(a)}`, ['A', 'B']),
                explain: `두 정육면체는 항상 닮은 도형이다. 부피의 비 ${m ** 3} : ${k ** 3} = ${m}${sup(3)} : ${k}${sup(3)}이므로 닮음비는 ${m} : ${k}이다. ${a} : (B의 한 모서리의 길이) = ${m} : ${k}에서 ${ans} cm이다.`,
                facts: { calc: [[`${a}*${cbrt(k ** 3)}/${cbrt(m ** 3)}`, 0]], unseen: [1, 3, 0.5] }
              });
            }
            const t = d.int(6, 12), solid = d.pick(['정사면체', '원뿔', '삼각기둥']), SA = m * m * t, SB = k * k * t;
            return areaQ(`서로 닮은 두 ${solid} A, B의 부피의 비가 ${m ** 3} : ${k ** 3}이다. ${solid} A의 겉넓이가 ${SA} cm²일 때, ${solid} B의 겉넓이는?`, SB, {
              explain: `부피의 비 ${m ** 3} : ${k ** 3} = ${m}${sup(3)} : ${k}${sup(3)}이므로 닮음비는 ${m} : ${k}이고, 겉넓이의 비는 ${m}${sup(2)} : ${k}${sup(2)} = ${m * m} : ${k * k}이다. ${SA} : (B의 겉넓이) = ${m * m} : ${k * k}에서 B의 겉넓이는 ${SB} cm²이다.`,
              facts: { calc: [[`${SA}*${cbrt(k ** 3)}*${cbrt(k ** 3)}/(${cbrt(m ** 3)}*${cbrt(m ** 3)})`, 0]], unseen: [1, 3, 0.5] }
            });
          }, { count: 2 }),
          T('ratio-price', '넓이에 정비례하는 값', '②21', (d) => {
            const [m, k, unit] = d.pick([[2, 3, 1000], [2, 3, 500], [3, 4, 500], [3, 5, 300], [4, 5, 300], [1, 2, 2000], [3, 4, 600], [4, 5, 200]]), t = d.pick([4, 5, 6]), r = m * t, r2 = k * t, won = m * m * unit, ans = k * k * unit;
            return N(`어느 가게에서 파는 원 모양 피자의 값은 피자의 넓이에 정비례한다. 반지름의 길이가 ${cm(r)}인 피자의 값이 ${won}원일 때, 반지름의 길이가 ${cm(r2)}인 피자의 값은 몇 원인가?`, ans, {
              unit: '원', explain: `두 원은 항상 닮은 도형이고 닮음비는 ${r} : ${r2} = ${m} : ${k}이므로 넓이의 비는 ${m * m} : ${k * k}이다. 값도 ${m * m} : ${k * k}이므로 ${won} × ${frac(k * k, m * m)} = ${ans}(원)이다.`,
              facts: { calc: [[`${won}*${r2}*${r2}/(${r}*${r})`, 0]] }
            });
          }),
          T('ratio-melt', '큰 구를 녹여 만드는 작은 구의 개수', '②22', (d) => {
            const k = d.int(2, 5), r = d.int(1, 3), R = k * r, thing = d.pick(['쇠구슬', '초콜릿', '양초']);
            return N(`반지름의 길이가 ${cm(R)}인 구 모양의 ${thing} 한 개를 녹여서 반지름의 길이가 ${cm(r)}인 구 모양의 ${thing}${thing === '양초' ? '를' : '을'} 만들려고 한다. 작은 ${thing}${thing === '양초' ? '는' : '은'} 모두 몇 개 만들 수 있는가?`, k ** 3, {
              unit: '개', explain: `큰 구와 작은 구의 닮음비는 ${R} : ${r} = ${k} : 1이므로 부피의 비는 ${k}${sup(3)} : 1${sup(3)} = ${k ** 3} : 1이다. 큰 구 하나의 부피는 작은 구 ${k ** 3}개의 부피와 같다.`,
              facts: { calc: [[`(${R}/${r})*(${R}/${r})*(${R}/${r})`, 0]] }
            });
          }),
          T('ratio-cup', '원뿔 모양의 그릇에 넣은 물의 부피로 그릇의 부피 구하기', '②23 ②24', (d) => {
            const [m, k] = d.pick([[1, 2], [2, 3], [3, 4], [4, 5], [3, 5], [2, 5]]), g = d.pick([2, 3, 4, 5]), t = d.int(1, 5), h = m * g, H = k * g, W = m ** 3 * t, ans = k ** 3 * t;
            return piQ(`그림과 같이 높이가 ${cm(H)}인 원뿔 모양의 그릇에 물을 높이가 ${cm(h)}가 되도록 넣었더니 물의 부피가 ${W}π cm³였다. 이 그릇의 부피는? (단, 그릇의 두께는 생각하지 않는다.)`, ans, 'cm³', {
              figure: cupFig(H, h, `꼭짓점이 아래에 있는 원뿔 모양의 그릇에 물이 담겨 있다. 그릇의 높이 ${cm(H)}, 물의 높이 ${cm(h)}`),
              explain: `물이 담긴 부분과 그릇은 서로 닮은 원뿔이고 닮음비는 ${h} : ${H} = ${m} : ${k}이다. 부피의 비는 ${m}${sup(3)} : ${k}${sup(3)} = ${m ** 3} : ${k ** 3}이므로 ${W}π : (그릇의 부피) = ${m ** 3} : ${k ** 3}에서 그릇의 부피는 ${ans}π cm³이다.`,
              facts: { calc: [[`${W}*${H}*${H}*${H}/(${h}*${h}*${h})`, 0]] }
            });
          }),
          T('ratio-claims', '닮음비가 주어진 두 원기둥에 대한 설명 가리기', '②2 ①14', (d) => {
            const [m, k] = d.pick([[2, 3], [3, 4], [2, 5], [3, 5], [1, 2], [1, 3]]), a = `${m} : ${k}`, a2 = `${m * m} : ${k * k}`, a3 = `${m ** 3} : ${k ** 3}`, wantTrue = d.bool();
            const yes = [`높이의 비는 ${a}이다.`, `밑면의 둘레의 길이의 비는 ${a}이다.`, `밑면의 넓이의 비는 ${a2}이다.`, `옆넓이의 비는 ${a2}이다.`, `겉넓이의 비는 ${a2}이다.`, `부피의 비는 ${a3}이다.`];
            const no = [
              [`밑면의 넓이의 비는 ${a}이다.`, `넓이의 비는 닮음비의 제곱의 비이므로 밑면의 넓이의 비는 ${a2}이다.`, [yes[2]]],
              [`겉넓이의 비는 ${a3}이다.`, `겉넓이의 비는 닮음비의 제곱의 비이므로 ${a2}이다.`, [yes[4]]],
              [`부피의 비는 ${a2}이다.`, `부피의 비는 닮음비의 세제곱의 비이므로 ${a3}이다.`, [yes[5]]],
              [`밑면의 둘레의 길이의 비는 ${a2}이다.`, `둘레의 길이의 비는 닮음비와 같으므로 ${a}이다.`, [yes[1]]],
              [`옆넓이의 비는 ${a}이다.`, `옆넓이의 비는 닮음비의 제곱의 비이므로 ${a2}이다.`, [yes[3]]]
            ];
            return sayQ(d, `닮음비가 ${a}인 두 원기둥 A, B에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue);
          })
        ]
      },
      { id: 'cond', title: '삼각형의 닮음 조건', standard: S13, types: [] },
      { id: 'length', title: '닮음을 이용하여 길이 구하기', standard: S13, types: [] },
      { id: 'right', title: '직각삼각형의 닮음', standard: S13, types: [] },
      { id: 'use', title: '닮음의 활용', standard: S13, types: [] }
    ]
  });

  B.kit.m823 = {
    UNIT, S12, S13, T, SIM, PAR, X, Y, TAG, cm, tri, quad, RATIO, PAIRS, lenQ, degQ, areaQ, volQ, piQ, ratioQ, fracQ, cbrt, sayQ, pickOne, words,
    go, lerp, toward, foot, mapP, sss, sas, asa, angleAt, ren, rot, flip, scale, level, ctr, lay, eq, boards, tidy, figs, quadA, quadS, quadT, pgram,
    DASH, FACE, THIN, TILT, arcHalf, cylOn, coneOn, sectionOn, cupOn, sphereOn, prismOn, boxOn, tetraOn, blue, prismsFig, cylsFig, boxesFig, cupFig
  };
})(typeof window !== 'undefined' ? window : globalThis);
