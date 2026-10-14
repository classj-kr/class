// 중학교 2학년 2학기 4단원 평행선과 선분의 길이의 비 — 단원 틀·그림 도구와 앞쪽 묶음
// (삼각형에서 평행선과 선분의 길이의 비, 평행선 사이의 선분의 길이의 비, 사다리꼴에서 평행선과 선분의 길이의 비).
// 수집해 둔 교과서 3종(미래엔 황선욱 2015·2022, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 66꼴, 심화꼴: 45꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/8-2-4/싣기_대조표.md 에 있다.
// (두 변의 중점을 이은 선분, 중선과 무게중심, 무게중심과 넓이 묶음은 8-2-4b.js 에, 실력 문항은 8-2-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-14(평행선 사이의 선분의 길이의 비를 구할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 그림의 틀(삼각형 안의 평행선 / 꼭짓점 너머에서 엇갈린 꼴 / 변을 늘인 꼴 / 평행선 여럿 / 사다리꼴 / 중점 / 무게중심),
//    주는 것(조각끼리 / 전체와 부분 / 비 / 넓이), 묻는 것(길이 / 길이 둘 / 비 / 넓이 / 고르기), 푸는 길(한 번 / 두 번 잇기 / 거꾸로)이 다르면 따로 싣는다.
//    수와 점의 이름만 바꾼 것은 한 유형이다.
//  - 그림은 수치대로 그린다. 코드가 길이에서 좌표를 셈해 그리므로 그림과 답이 어긋나지 않는다. 주어진 길이는 문제 글과 그림에 함께 적고, 묻는 길이는 그림에 적지 않는다.
//    평행선 여럿의 그림(틀 ㄷ)은 선분에 이름이 없으므로 교과서의 그 꼴처럼 길이를 단위 없이 수와 x, y 로 적고 x, y 의 값을 묻는다. 넓이 문항의 그림에는 길이를 적지 않는다.
//    그림 속 글이 선이나 다른 글에 걸치면 수와 모양을 다시 고른다(Sheet 의 clash). 그림 설명(aria-label)에는 그림에 그려진 것과 적힌 것을 말로 적는다.
//  - 답: 길이는 「□ cm」, 길이가 분수로 나오는 유형은 분수 칸(크기가 같은 분수를 모두 받는다), 비는 「□ : □」, 넓이는 「□ cm²」. 한 유형의 답은 늘 같은 꼴이다.
//  - 용어: 「삼각형의 중점연결정리」는 수업에서만 쓰는 말이라 문제 글에는 「두 변의 중점을 이은 선분」이라고 쓴다. 닮음 기호는 쓰지 않고 「닮은 도형」이라고 적는다.
//  - 교육과정의 금: 「증명 과정에서 지나치게 엄밀한 형식 논리 규칙의 이용을 요구하는 문제는 다루지 않는다.」 까닭을 묻는 꼴(①1)은 교과서의 설명 그대로를 빈칸 둘의 고르기로만 실었다.
//  - 꼴을 바꾸어 실은 것: ①1(서술 빈칸 다섯 → 빈칸 둘 고르기), ①7·심1(작은 그림 여럿 → 글로 적은 길이. 그림을 수치대로 그리면 평행한지가 눈에 보인다),
//    ①14(선분 DC 전체 → 조각 FC. 전체를 적을 자리가 없다), 심9(GF, GC 의 길이 → GF : FC 의 비. 길이대로 그리면 삼각형이 찌그러진다), x + y·xy 로 묻던 꼴(두 값을 따로 묻는다).
//
// 뺀 것과 까닭(8-2-4b.js, 8-2-4c.js 의 것까지 여기에 모아 적는다)
//  - 삼각형의 각의 이등분선과 선분의 길이의 비 가운데 2015 개정 자료(미래엔 2015 문제은행)에만 나오는 꼴(①17·18 심14·15): 2022 개정 교육과정에 이 정리가 없다.
//    2022 자료(미래엔 2022 출제대비 문제은행)에 나온 심13은 정리를 알려 주지 않는 실력 문항으로 실었다(8-2-4c.js).
//  - 앞 단원(8-2-3 도형의 닮음 — 닮음 조건만으로 푸는 것): 평행사변형의 변을 늘여 생긴 삼각형(①15, 심4 — 8-2-3에 같은 그림·같은 일의 유형이 있다), 같은 각과 평행이 함께 있는 삼각형(심2), 삼각형 안의 마름모(심3).
//  - 쪽 그림에서도 그림을 알 수 없는 것: 두 직선이 평행선 위에서 만나 삼각형을 이루는 꼴의 수 자리(①22), 밑변을 함께 쓰는 두 삼각형의 점 R(①41).
//  - 같은 일이어서 한 번만 실은 것: ①40(①39와 — 사다리꼴의 두 대각선의 중점 사이), 심7(①10과 — 평행선 두 쌍), 심16(①20과), 심23·26(①42와 — 주어진 것이 중점이냐 평행이냐, 삼등분점을 스스로 잡느냐만 다르다),
//    심29(①39와), 심33(①55와), 심37·38(①54와 — 중선의 가운데 점과 무게중심 사이), 심40(①61과), 심43(①65와), ①32(심19와). ①6에서 변 위의 선분끼리의 비를 다시 묻는 것은 ①2와 같은 일이어서 싣지 않았다.
//  - 처음 지을 때 「보조선을 스스로 그어야 한다, 닮음·중점을 세 번 넘게 잇는다, 합동을 스스로 찾아야 한다, 어려움이 단원 밖에서 온다」는 까닭으로 뺐던 꼴
//    (①16·28·29·44 심8·10·11·12·20·27·28·31·32·35·39·45)은 다시 따져 실력에 실었다(8-2-4c.js 의 「다시 보아 덧붙인 실력 문항」).
//  - 뜻 없는 셈(따로 구한 두 값을 더하고 곱하기): x + y, xy 로 묻던 꼴은 두 값을 따로 묻는다.
//  - 김화경 문서의 그림 문제는 그림도 답도 없어 꼴만 참고했다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 길이는 수와 단위를 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, lines, N, M, C, F } = B.kit;
  const { V, nb, SG, gcd } = B.kit.mid;
  const { RAD, dirOf, dist, mid, XY, meet, awayFrom, textW, sv, TINT, Board } = B.kit.mgeo;
  const UNIT = '8-2-4', STD = '9수03-14';
  const src = (ref) => (ref.startsWith('심') ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')';
  // ── 줄바꿈 ──
  // 선분 기호는 위에 줄을 얹은 한 덩어리(inline-block)여서, 브라우저가 기호와 뒤따르는 토씨 사이에서 줄을 바꿀 수 있다(「EF」가 줄 끝에, 「의 길이는?」이 다음 줄 머리에 온다).
  // 문항의 글에서 「기호(나 기호로 끝나는 묶음) + 바로 뒤의 한글」과 「분수 + 바로 뒤의 기호」를 줄이 갈리지 않는 한 덩어리로 묶는다.
  const glue = (html) => {
    if (typeof html !== 'string' || !html.includes('</svg></span>')) return html;
    const spans = [], open = [], endAt = {}, startAt = {}, re = /<span\b[^>]*>|<\/span>/g;
    for (let m = re.exec(html); m; m = re.exec(html)) {
      if (m[0] !== '</span>') { open.push({ start: m.index, tag: m[0] }); continue; }
      const s = open.pop(); if (!s) return html;
      s.end = m.index + 7; spans.push(s); endAt[s.end] = s; startAt[s.start] = s;
    }
    if (open.length) return html;
    const cuts = [];
    for (const s of spans) {
      if (!s.tag.includes('display:inline-block') || !html.startsWith('</svg></span>', s.end - 13)) continue;
      // 기호가 묶음의 맨 끝이면 그 묶음째로 뒤의 한글과 묶는다
      let from = s.start, to = s.end, outer = s;
      while (html.startsWith('</span>', to) && endAt[to + 7]) { outer = endAt[to + 7]; to = outer.end; }
      const tail = /^[가-힣]+/.exec(html.slice(to));
      if (tail) { from = outer.start; to += tail[0].length; } else to = s.end;
      const before = endAt[s.start];
      if (before && before.tag === '<span class="mb-frac">') from = Math.min(from, before.start);
      if (from < s.start || to > s.end) cuts.push([from, to]);
    }
    if (!cuts.length) return html;
    // 겹치는 것은 바깥 것 하나로 합친다
    cuts.sort((p, q) => p[0] - q[0] || q[1] - p[1]);
    const kept = [];
    for (const c of cuts) { const last = kept[kept.length - 1]; if (last && c[0] < last[1]) last[1] = Math.max(last[1], c[1]); else kept.push(c.slice()); }
    let out = html;
    for (const [from, to] of kept.reverse()) out = out.slice(0, from) + '<span style="white-space:nowrap">' + out.slice(from, to) + '</span>' + out.slice(to);
    return out;
  };
  // 유형의 make 를 감싸, 지어진 문항의 문제 글·풀이·보기·답 줄에 glue 를 건다.
  const glued = (make) => (d, n) => {
    const item = make(d, n);
    item.text = glue(item.text); item.explain = glue(item.explain);
    if (item.shown) item.shown = glue(item.shown);
    if (item.choice) item.choice.options = item.choice.options.map(glue);
    return item;
  };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: src(ref), make: glued(make) }, more || {});
  const X = V('x'), Y = V('y');

  // ── 글 ──
  const cm = (v) => v + ' cm';
  // 「AD = 6 cm」: 줄 끝에서 갈리지 않게 묶는다.
  const eq = (name, v) => nb(`${SG(name)} = ${v} cm`);
  // 「BC ∥ DE」
  const par = (...names) => nb(names.map((s) => SG(s)).join(' ∥ '));
  // 선분 이름 뒤의 토씨: 끝 글자를 읽은 소리(엘·엠·엔·아르는 받침이 있다)로 가린다.
  const jo = (name, pair) => { const [w, wo] = pair.split('/'); return SG(name) + ('LMN'.includes(name[name.length - 1]) ? w : wo); };
  // 비를 적고, 더 간단히 할 수 있으면 간단히 한 비를 이어 적는다: 6 : 4 = 3 : 2
  const simple = (a, b) => { const g = gcd(a, b); return g > 1 ? `${a} : ${b} = ${a / g} : ${b / g}` : `${a} : ${b}`; };
  // 분수 p/q 를 적는 글(약분하고, 정수이면 정수로)
  const fracOrInt = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : frac(p / g, q / g); };
  // 그림 속의 「x cm」
  const xcm = (name) => sv(name) + ' cm';

  // ── 답 ──
  const lenQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm' }, o));
  const areaQ = (text, v, o) => N(text, v, Object.assign({ unit: 'cm²' }, o));
  // 길이가 분수인 답(기약분수로 적어 두고, 크기가 같은 분수를 모두 받는다). 정수가 되는 수는 쓰지 않는다.
  const lenF = (text, p, q, o) => { const g = gcd(p, q); return F(text, p / g, q / g, Object.assign({ unit: 'cm', improper: p > q, anyForm: true }, o)); };
  // 값 둘(셋). parts: [이름, 답, 단위](단위를 주지 않으면 cm, '' 이면 단위 없이). 틀리면 「EC = 4 cm, DE = 6 cm」처럼 보인다.
  const un = (unit) => (unit === '°' ? '°' : unit === '' ? '' : ' ' + (unit || 'cm'));
  const two = (text, parts, o) => M(text, parts.map(([label, answer, unit]) => ({ label, answer, unit: unit == null ? 'cm' : unit })), Object.assign({}, o, { shown: parts.map(([label, answer, unit]) => `${label} = ${answer}${un(unit)}`).join(', ') }));
  // 비 「□ : □」
  const ratioQ = (text, a, b, o) => M(text, [{ answer: a, unit: ':' }, { answer: b }], o);
  // 문장 가리기. yes: 옳은 문장들, no: [틀린 문장, 바로잡은 말, 함께 싣지 않을 옳은 문장(들)]. wantTrue: 옳은 것을 고르는가.
  function sayQ(d, text, yes, no, wantTrue, figure) {
    const bad = d.shuffle(no).slice(0, wantTrue ? 3 : 1), clash = bad.reduce((all, s) => all.concat(s[2] || []), []);
    const good = d.shuffle(yes.filter((s) => !clash.includes(s))).slice(0, wantTrue ? 1 : 3);
    const rows = d.shuffle(good.map((s) => [s, true, '']).concat(bad.map((s) => [s[0], false, s[1]]))), hit = rows.findIndex((r) => r[1] === wantTrue);
    return C(text, rows.map((r) => r[0]), hit, { figure, explain: wantTrue ? rows.filter((r) => !r[1]).map((r) => r[2]).join(' ') : rows[hit][2], facts: { truth: rows.map((r) => r[1]), want: wantTrue } });
  }

  // ── 좌표 셈(길이의 단위, 오른쪽이 x, 위쪽이 y) ──
  const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const pol = (r, deg) => [r * Math.cos(deg * RAD), r * Math.sin(deg * RAD)];
  const plus = (p, q) => [p[0] + q[0], p[1] + q[1]];
  // 삼각형 ABC(A 위, 밑변 BC 는 가로). sss: BC = a, CA = b, AB = c / sas: AB = c, AC = b, 끼인각 A / sab: BC = a, AB = c, 끼인각 B
  const sss = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return { A: [x, Math.sqrt(Math.max(c * c - x * x, 0))], B: [0, 0], C: [a, 0] }; };
  const sas = (c, b, ang) => sss(Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(ang * RAD)), b, c);
  const sab = (a, c, ang) => ({ A: pol(c, ang), B: [0, 0], C: [a, 0] });
  const angAt = (v, p, q) => { const a = [p[0] - v[0], p[1] - v[1]], c = [q[0] - v[0], q[1] - v[1]]; return Math.acos((a[0] * c[0] + a[1] * c[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(c[0], c[1]))) / RAD; };
  // 세 각이 모두 lo° 이상 hi° 이하인가(너무 납작하거나 뾰족한 삼각형을 거른다)
  const fine = (t, lo, hi) => [angAt(t.A, t.B, t.C), angAt(t.B, t.A, t.C), angAt(t.C, t.A, t.B)].every((v) => v >= (lo || 36) && v <= (hi || 94));
  const cen = (t) => [(t.A[0] + t.B[0] + t.C[0]) / 3, (t.A[1] + t.B[1] + t.C[1]) / 3];
  // 틀 ㄱ: △ABC 의 변 AB, AC 위의 점 D, E (AD : AB = AE : AC = t)
  const cutOf = (t3, t) => Object.assign({}, t3, { D: lerp(t3.A, t3.B, t), E: lerp(t3.A, t3.C, t) });

  // ── 그림 ──
  // 선분 p–q 가 상자 r = [왼쪽, 위, 오른쪽, 아래]를 지나는가
  function cuts(p, q, r) {
    let t0 = 0, t1 = 1; const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [k, v] of [[-dx, p[0] - r[0]], [dx, r[2] - p[0]], [-dy, p[1] - r[1]], [dy, r[3] - p[1]]]) {
      if (k === 0) { if (v < 0) return false; continue; }
      const t = v / k;
      if (k < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; }
    }
    return true;
  }
  // 그림 판(B.kit.mgeo.Board)에 그은 선과 적은 글의 자리를 적어 두는 판. clash() 는 글끼리 겹쳤거나 글이 선(점선 활 포함)에 걸쳤으면 참이다 — 그러면 수를 다시 고른다.
  function Sheet() {
    const b = Board(), drawn = [], boxes = [], seg0 = b.seg, poly0 = b.poly, text0 = b.text, clash0 = b.clash;
    b.seg = (p, q, kind, css) => { drawn.push([p, q]); return seg0(p, q, kind, css); };
    b.poly = (pts, css) => { if (!/stroke:none/.test(css || '')) pts.forEach((p, i) => drawn.push([p, pts[(i + 1) % pts.length]])); return poly0(pts, css); };
    b.text = (p, html, o) => { const size = (o && o.size) || 13, w = textW(html) * size / 13; boxes.push([p[0] - w / 2, p[1] - size * 0.58, p[0] + w / 2, p[1] + size * 0.58, String(html).replace(/<[^>]+>/g, '')]); return text0(p, html, o); };
    // 굽은 선(점선 활)의 자리: 잘게 나눈 점들
    b.curve = (pts) => { for (let i = 0; i + 1 < pts.length; i += 1) drawn.push([pts[i], pts[i + 1]]); return b; };
    b.hits = () => boxes.some((r) => drawn.some(([p, q]) => cuts(p, q, r)));
    // 선에 걸친 글(그림을 손볼 때 본다)
    b.why = () => boxes.filter((r) => drawn.some(([p, q]) => cuts(p, q, r))).map((r) => r[4]).join(' / ') || (clash0() ? '글끼리 겹침' : '');
    b.clash = () => clash0() || b.hits();
    return b;
  }
  // 점선 활: 선분 p–q 의 한쪽(away 의 반대쪽)으로 h 만큼 불룩한 점선(반타원)을 긋고 그 바깥에 글을 적는다(가운데에 다른 점이 있는 선분의 길이, 전체의 길이).
  const BOW = 'fill:none;stroke:#5b6770;stroke-width:1;stroke-dasharray:2.4 2.6';
  function bowOn(b, p, q, text, away, h, at) {
    const m = mid(p, q), L = dist(p, q);
    let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L], sweep = 0;
    if ((away[0] - m[0]) * n[0] + (away[1] - m[1]) * n[1] > 0) { n = [-n[0], -n[1]]; sweep = 1; }
    const peak = [m[0] + n[0] * h, m[1] + n[1] * h], turn = Math.atan2(q[1] - p[1], q[0] - p[0]) / RAD, side = (k) => [m[0] + (q[0] - p[0]) * k + n[0] * h * 0.9, m[1] + (q[1] - p[1]) * k + n[1] * h * 0.9];
    b.shape(`M${XY(p)}A${(L / 2).toFixed(1)} ${h} ${turn.toFixed(1)} 0 ${sweep} ${XY(q)}`, [p, q, peak, side(0.3), side(-0.3)], BOW);
    if (b.curve) b.curve(Array.from({ length: 25 }, (_, i) => { const a = Math.PI * i / 24, c = (1 - Math.cos(a)) / 2, up = Math.sin(a) * h; return [p[0] + (q[0] - p[0]) * c + n[0] * up, p[1] + (q[1] - p[1]) * c + n[1] * up]; }));
    // 글은 활의 가운데 바깥에 적는다. at(0~1)을 주면 p 에서 q 쪽으로 그만큼 간 자리의 바깥에 적는다. 글을 주지 않으면 활만 긋는다. 돌려주는 것: 활의 꼭대기
    if (text == null) return peak;
    const k = at == null ? 0.5 : at, c = lerp(p, q, k), off = h * Math.sqrt(1 - (2 * k - 1) ** 2) + (textW(text) / 2) * Math.abs(n[0]) + 7 * Math.abs(n[1]) + 4;
    b.text([c[0] + n[0] * off, c[1] + n[1] * off], text, { blue: true });
    return peak;
  }
  // Fig(P0, size, o): 이름 붙은 점들(길이의 단위)을 [가로, 세로] 안에 꼭 맞게 화면에 옮기고, 점의 이름으로 그림 판(B.kit.mgeo.Board)에 그린다.
  //  o.hub: 그림의 가운데를 잡을 점들(주지 않으면 모든 점). 점의 이름과 선분 옆의 글은 따로 말하지 않으면 가운데에서 먼 쪽에 적는다.
  //  o.show: { 점: 그림에 적을 이름 }(G′ 처럼 한 글자가 아닌 이름)
  // 선분은 'AB BC' 처럼 두 글자씩 띄어 적고, 다각형과 점의 묶음은 'ABC' 처럼 붙여 적는다.
  function Fig(P0, size, o) {
    const opt = o || {}, keys = Object.keys(P0), xs = keys.map((k) => P0[k][0]), ys = keys.map((k) => P0[k][1]);
    const x0 = Math.min(...xs), y1 = Math.max(...ys), k = Math.min(size[0] / ((Math.max(...xs) - x0) || 1), size[1] / ((y1 - Math.min(...ys)) || 1));
    const P = {}; for (const key of keys) P[key] = [(P0[key][0] - x0) * k, (y1 - P0[key][1]) * k];
    const b = Sheet(), show = opt.show || {}, hubOf = (opt.hub || keys.join('')).split('').map((n) => P[n]);
    const hub = [hubOf.reduce((s, p) => s + p[0], 0) / hubOf.length, hubOf.reduce((s, p) => s + p[1], 0) / hubOf.length];
    const pts = (names) => names.split('').map((n) => P[n]);
    const each = (list, fn) => { for (const s of list.split(' ')) if (s) fn(P[s[0]], P[s[1]]); return f; };
    // 글을 둘 쪽의 반대쪽 점. side 가 없으면 그림의 가운데(글은 바깥쪽), 'in' 이면 그 반대(글은 안쪽), 점 이름이면 그 점(글은 그 점의 반대쪽)
    const other = (p, q, side) => { const m = mid(p, q); return !side ? hub : side === 'in' ? [2 * m[0] - hub[0], 2 * m[1] - hub[1]] : typeof side === 'string' ? P[side] : side; };
    const f = {
      b, P, k, hub,
      // 색칠한 부분
      tint(names) { b.poly(pts(names), TINT + ';stroke:none'); return f; },
      poly(names) { b.poly(pts(names)); return f; },
      // kind: 'thin' 가는 선, 'cut' 점선
      seg(list, kind) { return each(list, (p, q) => b.seg(p, q, kind)); },
      // 길이가 같다는 표시(금 n 개)
      tick(list, n) { return each(list, (p, q) => b.tick(p, q, n)); },
      // 평행하다는 표시(화살촉 n 개). 선분을 적은 차례가 화살의 방향이다.
      arrow(list, n, t) { const c = n || 1; return each(list, (p, q) => { for (let i = 0; i < c; i += 1) b.arrow(p, q, (t == null ? 0.5 : t) + (i - (c - 1) / 2) * 8 / dist(p, q)); }); },
      dot(names) { for (const p of pts(names)) b.dot(p); return f; },
      // 직각 표시: 'ACB' 는 꼭짓점 C 의 각
      right(names) { b.corner(P[names[1]], P[names[0]], P[names[2]]); return f; },
      // 각의 크기: 'ABC' 는 꼭짓점 B 의 각
      angle(names, text) { b.corner(P[names[1]], P[names[0]], P[names[2]], text); return f; },
      // 선분 옆의 글(길이)
      len(seg, text, side, more) { b.beside(P[seg[0]], P[seg[1]], text, other(P[seg[0]], P[seg[1]], side), more); return f; },
      // 점선 활과 글(전체의 길이). h: 불룩한 높이 — 선분 위에 점의 이름이 있으면 26, 조각의 길이도 적혀 있으면 42
      bow(seg, text, h, side, at) { bowOn(b, P[seg[0]], P[seg[1]], text, other(P[seg[0]], P[seg[1]], side), h || 14, at); return f; },
      // 도형 안쪽 선분의 전체 길이: 점선 활을 긋고, 활의 꼭대기에서 가로로 그림의 변(edge)을 지나 그 밖까지 가는 선을 그어 끝에 글을 적는다(안쪽에는 글 자리가 없을 때).
      bowOut(seg, text, h, side, edge, extra) {
        const peak = bowOn(b, P[seg[0]], P[seg[1]], null, other(P[seg[0]], P[seg[1]], side), h || 11), hit = meet(peak, [peak[0] + 1, peak[1]], P[edge[0]], P[edge[1]]), s = Math.sign(hit[0] - peak[0]) || 1, e = [hit[0] + s * (extra || 10), peak[1]];
        b.seg(peak, e, 'thin').text([e[0] + s * (textW(text) / 2 + 3), e[1]], text, { blue: true });
        return f;
      },
      // 좁은 자리의 길이: 선분의 가운데에서 가로로 그림의 변(edge)을 지나 그 밖까지 가는 선을 긋고 끝에 글을 적는다.
      lead(seg, text, edge, extra) {
        const m = mid(P[seg[0]], P[seg[1]]), hit = meet(m, [m[0] + 1, m[1]], P[edge[0]], P[edge[1]]), s = Math.sign(hit[0] - m[0]) || 1, e = [hit[0] + s * (extra || 10), m[1]];
        b.seg(m, e, 'thin').text([e[0] + s * (textW(text) / 2 + 3), e[1]], text, { blue: true });
        return f;
      },
      // 점의 이름: 그림의 가운데에서 먼 쪽에 적는다. dir(도, 오른쪽이 0°이고 위쪽이 90°)을 주면 그쪽에 적는다.
      name(names, dir, gap) { for (const n of names.split('')) b.name(P[n], show[n] || n, dir == null ? awayFrom(P[n], [hub]) : dir, gap); return f; },
      // 점 n 의 이름을 점들(from)의 반대쪽에 적는다.
      nameAway(n, from, gap) { b.name(P[n], show[n] || n, awayFrom(P[n], from.split('').map((k) => P[k])), gap); return f; },
      // 점 n 에서 두 점 a, b 를 바라보는 두 방향의 가운데(작은 각 쪽)에 이름을 적는다.
      nameMid(n, a, c, gap) { const from = dirOf(P[n], P[a]), turn = ((dirOf(P[n], P[c]) - from + 540) % 360) - 180; b.name(P[n], show[n] || n, from + turn / 2, gap == null ? 12 : gap); return f; },
      // 여러 선이 지나는 점의 이름: 그 점에서 선이 뻗은 쪽(toward 의 점들)을 피해 가장 넓게 빈 쪽에 적는다.
      free(n, toward) { b.nameFree(P[n], show[n] || n, toward.split('').map((t) => dirOf(P[n], P[t]))); return f; },
      clash() { return b.clash(); },
      why() { return b.why(); },
      svg(label) { return b.svg(label); }
    };
    return f;
  }
  // 그림을 지어 보고 글이 겹쳤으면(글끼리, 글과 선) 모양을 다시 골라 짓는다.
  const tidy = (d, draw) => d.until(draw, (fig) => !fig.clash());
  // 틀 ㄱ의 그림: △ABC, 선분 DE, 평행 표시, 점의 이름
  const cutFig = (t3, t, size) => Fig(cutOf(t3, t), size || [150, 118], { hub: 'ABC' }).poly('ABC').seg('DE').arrow('DE BC').name('ABCDE');
  const CUT_SAID = '삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 선분 DE가 그어져 있다. 선분 DE와 변 BC에 평행하다는 표시가 있다.';
  const CUT_LEAD = `△ABC에서 두 점 D, E는 각각 변 AB, AC 위의 점이고 ${par('BC', 'DE')}이다.`;

  // 틀 ㄷ: 가로로 놓인 평행선들(위에서부터 names)과 그것을 지나는 직선들. 길이대로 그린다.
  //  ratio: 이웃한 평행선 사이의 거리의 비(위에서부터)
  //  list: 직선마다 { a: 위의 두 평행선 사이에서 잘린 길이, dir: 1(아래로 갈수록 오른쪽) | -1, cross: 바로 앞 직선과 만나는 깊이(맨 위 평행선에서 잰 거리의 비 — 주지 않으면 떨어뜨려 놓는다),
  //          marks: [[위 평행선 번호, 아래 평행선 번호, 글, 'l' | 'r'(글을 둘 쪽), 'bow'(점선 활로)], …] }
  //  o.steep: 가장 짧게 잘린 직선의 (잘린 길이 ÷ 평행선 사이의 거리), o.h 세로 크기, o.w 가로 크기, o.gap 떨어뜨린 두 직선 사이의 가장 좁은 틈(px)
  function strips(ratio, names, list, o) {
    const opt = o || {}, e = list.map((ln) => ln.a / ratio[0]), g0 = Math.min(...e) / (opt.steep || 1.06), gaps = ratio.map((r) => r * g0), total = gaps.reduce((s, v) => s + v, 0);
    const ys = [0]; gaps.forEach((g) => ys.push(ys[ys.length - 1] + g));
    const run = list.map((ln, j) => ln.dir * Math.sqrt(Math.max((e[j] / g0) ** 2 - 1, 0))), ext = 0.15 * total, W = opt.w || 214;
    const place = (u) => { const cx = [0]; for (let j = 1; j < list.length; j += 1) { const dr = run[j] - run[j - 1]; cx.push(list[j].cross != null ? cx[j - 1] - dr * (list[j].cross * g0 - total / 2) : cx[j - 1] + (opt.gap || 44) / u + Math.abs(dr) * (total / 2 + ext)); } return cx; };
    const span = (cx) => { const xs = []; list.forEach((_, j) => { for (const y of [-ext, total + ext]) xs.push(cx[j] + run[j] * (y - total / 2)); }); return [Math.min(...xs), Math.max(...xs)]; };
    let u = (opt.h || Math.min(150, Math.max(108, 40 * total / Math.min(...gaps)))) / total, cx = place(u), [lo, hi] = span(cx);
    for (let i = 0; i < 8 && (hi - lo) * u > W + 0.5; i += 1) { u *= W / ((hi - lo) * u); cx = place(u); [lo, hi] = span(cx); }
    const S = (x, y) => [(x - lo) * u + 18, y * u], pt = (j, i) => S(cx[j] + run[j] * (ys[i] - total / 2), ys[i]), b = Sheet();
    ys.forEach((y, i) => { const L = S(lo, y), R = S(hi, y); b.seg([L[0] - 18, L[1]], [R[0] + 14, R[1]]).text([R[0] + 23, R[1]], sv(names[i]), { plain: true }); });
    list.forEach((ln, j) => {
      b.seg(S(cx[j] + run[j] * (-ext - total / 2), -ext), S(cx[j] + run[j] * (total / 2 + ext), total + ext));
      for (const [i0, i1, text, side, kind] of ln.marks || []) {
        const p = pt(j, i0), q = pt(j, i1), m = mid(p, q), away = [m[0] + (side === 'l' ? 30 : -30), m[1]];
        if (kind === 'bow') bowOn(b, p, q, String(text), away, 12); else b.beside(p, q, String(text), away, { gap: 4 });
      }
    });
    return { b, pt, low: Math.min(...gaps) * u };
  }
  const LV = (name) => V(name);

  // 틀 ㄹ: AD ∥ BC 인 사다리꼴 ABCD(A 왼쪽 위, B 왼쪽 아래). AD = p, BC = q, 높이 h, 점 A 는 점 B 보다 ox 만큼 오른쪽에 있다.
  const trapOf = (p, q, h, ox) => ({ A: [ox, h], B: [0, 0], C: [q, 0], D: [ox + p, h] });
  // 변 AB 의 길이 c 가 정해진 사다리꼴: 점 A 를 (q − p)의 f 배만큼(변 AB 의 길이의 0.5배를 넘지 않게) 오른쪽으로 민다.
  const trapBy = (p, q, c, f) => { const ox = Math.min((q - p) * f, c * 0.5); return trapOf(p, q, Math.sqrt(c * c - ox * ox), ox); };

  // 비 m : k 의 목록(조각이 너무 짧아지지 않는 것)
  const RATIOS = [[2, 1], [1, 2], [3, 2], [2, 3], [4, 3], [3, 4], [5, 3], [3, 5], [5, 4], [4, 5]];
  // 한 변에 조각의 길이와 전체의 길이를 함께 적는 그림에 쓰는 비(위쪽 조각이 짧으면 글이 점선 활에 닿는다)
  const WIDE = RATIOS.filter(([m, k]) => m / (m + k) >= 0.4);

  B.addUnit({
    id: '8-2-4', grade: 8, semester: 2, no: 4, title: '평행선과 선분의 길이의 비', version: 2,
    groups: [
      {
        id: 'tri', title: '삼각형에서 평행선과 선분의 길이의 비', standard: STD,
        types: [
          T('tri-why', '삼각형에서 평행선이 두 변을 같은 비로 나누는 까닭', '①1', (d) => {
            const fig = tidy(d, () => {
              const t3 = sas(d.int(10, 12), d.int(10, 12), d.int(11, 14) * 5), t = d.pick([0.45, 0.5, 0.55]), P0 = cutOf(t3, t);
              P0.F = lerp(P0.B, P0.C, t);
              return Fig(P0, [160, 120], { hub: 'ABC' }).poly('ABC').seg('DE EF').arrow('DE BC').arrow('DB EF', 2).name('ABCDEF');
            });
            const right = `∠FEC, ${SG('DB')}`, options = d.shuffle([right, `∠FEC, ${SG('BF')}`, `∠EFC, ${SG('DB')}`, `∠EFC, ${SG('BF')}`]);
            return C(`△ABC에서 두 점 D, E는 각각 변 AB, AC 위의 점이고 ${par('BC', 'DE')}이다. 점 E를 지나고 ${SG('AB')}에 평행한 직선이 변 BC와 만나는 점을 F라 할 때, 다음은 ${nb(`${SG('AD')} : ${SG('DB')} = ${SG('AE')} : ${SG('EC')}`)}임을 설명하는 과정이다. ㉠, ㉡에 알맞은 것을 차례대로 적은 것은?`, options, options.indexOf(right), {
              figure: fig.svg('삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 AC 위에, 점 F는 변 BC 위에 있고 선분 DE와 선분 EF가 그어져 있다. 선분 DE와 변 BC에 평행하다는 표시가, 선분 DB와 선분 EF에 평행하다는 다른 표시가 있다') + lines([
                `△ADE와 △EFC에서 ∠DAE = ${box('㉠')}(동위각), ∠AED = ∠ECF(동위각)이므로 △ADE와 △EFC는 서로 닮은 도형이다.`,
                `따라서 ${nb(`${SG('AD')} : ${SG('EF')} = ${SG('AE')} : ${SG('EC')}`)}이다.`,
                `이때 □DBFE는 평행사변형이므로 ${nb(`${SG('EF')} = ${box('㉡')}`)}이다.`
              ]),
              explain: `${par('AB', 'EF')}이므로 ∠DAE와 크기가 같은 동위각은 ∠FEC이다. □DBFE는 두 쌍의 대변이 각각 평행한 평행사변형이므로 ${SG('EF')} = ${SG('DB')}이다. ${SG('AD')} : ${SG('EF')} = ${SG('AE')} : ${SG('EC')}에서 ${SG('EF')}를 ${SG('DB')}로 바꾸면 ${SG('AD')} : ${SG('DB')} = ${SG('AE')} : ${SG('EC')}이다.`,
              facts: { truth: options.map((s) => s === right), want: true }
            });
          }),
          T('tri-sides', '삼각형의 두 변 위에서 평행선이 나눈 선분의 길이', '①2', (d, n) => {
            const v = d.until(() => {
              const [m, k] = d.pick(n === 0 ? RATIOS : WIDE), u = d.int(1, 5), w = d.int(1, 5), c = (m + k) * u, bb = (m + k) * w, t3 = sas(c, bb, d.int(10, 16) * 5);
              const fig = n === 0 ? cutFig(t3, m / (m + k)).len('AD', cm(m * u)).len('DB', cm(k * u)).len('AE', cm(m * w)) : cutFig(t3, m / (m + k), [128, 112]).len('AD', cm(m * u)).bow('AB', cm(c), 54).bow('AC', cm(bb), 26);
              return { m, k, u, w, c, bb, t3, fig };
            }, (x) => x.u !== x.w && x.c <= 24 && x.bb <= 24 && fine(x.t3) && !x.fig.clash());
            const ad = v.m * v.u, db = v.k * v.u, ae = v.m * v.w, ec = v.k * v.w;
            if (n === 0) return lenQ(`${CUT_LEAD} ${eq('AD', ad)}, ${eq('DB', db)}, ${eq('AE', ae)}일 때, ${SG('EC')}의 길이는?`, ec, {
              figure: v.fig.svg(`${CUT_SAID} AD = ${cm(ad)}, DB = ${cm(db)}, AE = ${cm(ae)}`),
              explain: `${par('BC', 'DE')}이므로 ${SG('AD')} : ${SG('DB')} = ${SG('AE')} : ${SG('EC')}이다. ${ad} : ${db} = ${ae} : ${SG('EC')}에서 ${SG('EC')} = ${db} × ${ae} ÷ ${ad} = ${ec}(cm)이다.`,
              facts: { calc: [[`${db}*${ae}/${ad}`, 0]] }
            });
            return lenQ(`${CUT_LEAD} ${eq('AB', v.c)}, ${eq('AD', ad)}, ${eq('AC', v.bb)}일 때, ${SG('AE')}의 길이는?`, ae, {
              figure: v.fig.svg(`${CUT_SAID} AB = ${cm(v.c)}, AD = ${cm(ad)}, AC = ${cm(v.bb)}`),
              explain: `${par('BC', 'DE')}이므로 ${SG('AB')} : ${SG('AD')} = ${SG('AC')} : ${SG('AE')}이다. ${v.c} : ${ad} = ${v.bb} : ${SG('AE')}에서 ${SG('AE')} = ${ad} × ${v.bb} ÷ ${v.c} = ${ae}(cm)이다.`,
              facts: { calc: [[`${ad}*${v.bb}/${v.c}`, 0]] }
            });
          }, { count: 2 }),
          T('tri-par', '평행한 두 선분의 길이의 비', '①3', (d, n) => {
            // AD : AB = DE : BC (AD : DB 가 아니다). 차례 0: DE 구하기, 1: AD 구하기(전체 AB 가 주어진다), 2: DB 구하기(AB 를 구한 다음 뺀다)
            const v = d.until(() => {
              const [m, k] = d.pick(RATIOS), u = d.int(1, 5), z = d.int(1, 5), s = m + k, t3 = sab(s * z, s * u, d.int(10, 15) * 5);
              const fig = cutFig(t3, m / s);
              if (n === 0) fig.len('AD', cm(m * u)).len('DB', cm(k * u)).len('BC', cm(s * z));
              else if (n === 1) fig.bow('AB', cm(s * u), 26).len('BC', cm(s * z)).len('DE', cm(m * z), 'A');
              else fig.len('AD', cm(m * u)).len('DE', cm(m * z), 'A').len('BC', cm(s * z));
              return { m, k, u, z, s, t3, fig };
            }, (x) => x.u !== x.z && x.s * Math.max(x.u, x.z) <= 24 && fine(x.t3) && !x.fig.clash());
            const ab = v.s * v.u, ad = v.m * v.u, db = v.k * v.u, bc = v.s * v.z, de = v.m * v.z;
            if (n === 0) return lenQ(`${CUT_LEAD} ${eq('AD', ad)}, ${eq('DB', db)}, ${eq('BC', bc)}일 때, ${SG('DE')}의 길이는?`, de, {
              figure: v.fig.svg(`${CUT_SAID} AD = ${cm(ad)}, DB = ${cm(db)}, BC = ${cm(bc)}`),
              explain: `${SG('AB')} = ${ad} + ${db} = ${ab}(cm)이다. ${par('BC', 'DE')}이므로 ${SG('AD')} : ${SG('AB')} = ${SG('DE')} : ${SG('BC')}이다. ${ad} : ${ab} = ${SG('DE')} : ${bc}에서 ${SG('DE')} = ${bc} × ${ad} ÷ ${ab} = ${de}(cm)이다.`,
              facts: { calc: [[`${bc}*${ad}/(${ad}+${db})`, 0]] }
            });
            if (n === 1) return lenQ(`${CUT_LEAD} ${eq('AB', ab)}, ${eq('BC', bc)}, ${eq('DE', de)}일 때, ${SG('AD')}의 길이는?`, ad, {
              figure: v.fig.svg(`${CUT_SAID} AB = ${cm(ab)}, BC = ${cm(bc)}, DE = ${cm(de)}`),
              explain: `${par('BC', 'DE')}이므로 ${SG('AD')} : ${SG('AB')} = ${SG('DE')} : ${SG('BC')}이다. ${SG('AD')} : ${ab} = ${de} : ${bc}에서 ${SG('AD')} = ${ab} × ${de} ÷ ${bc} = ${ad}(cm)이다.`,
              facts: { calc: [[`${ab}*${de}/${bc}`, 0]] }
            });
            return lenQ(`${CUT_LEAD} ${eq('AD', ad)}, ${eq('DE', de)}, ${eq('BC', bc)}일 때, ${SG('DB')}의 길이는?`, db, {
              figure: v.fig.svg(`${CUT_SAID} AD = ${cm(ad)}, DE = ${cm(de)}, BC = ${cm(bc)}`),
              explain: `${par('BC', 'DE')}이므로 ${SG('AD')} : ${SG('AB')} = ${SG('DE')} : ${SG('BC')}이다. ${ad} : ${SG('AB')} = ${de} : ${bc}에서 ${SG('AB')} = ${ab} cm이다. ${SG('DB')} = ${ab} − ${ad} = ${db}(cm)이다.`,
              facts: { calc: [[`${ad}*${bc}/${de}-${ad}`, 0]] }
            });
          }, { count: 3 }),
          T('tri-ratio', '변을 나눈 비가 주어진 삼각형', '①4', (d, n) => {
            const v = d.until(() => {
              const [m, k] = d.pick(RATIOS), w = d.int(2, 5), t3 = sas(10, d.int(9, 13), d.int(10, 15) * 5), fig = cutFig(t3, m / (m + k));
              if (n === 0) fig.bow('AC', cm((m + k) * w), 26); else fig.len('DE', cm(m * w), 'A');
              return { m, k, w, t3, fig };
            }, (x) => (x.m + x.k) * x.w <= 30 && fine(x.t3) && !x.fig.clash());
            const s = v.m + v.k, fig = v.fig;
            if (n === 0) {
              const ac = s * v.w, ec = v.k * v.w;
              return lenQ(`${CUT_LEAD} ${nb(`${SG('AD')} : ${SG('DB')} = ${v.m} : ${v.k}`)}이고 ${eq('AC', ac)}일 때, ${SG('EC')}의 길이는?`, ec, {
                figure: fig.svg(`${CUT_SAID} AC = ${cm(ac)}`),
                explain: `${par('BC', 'DE')}이므로 ${SG('AE')} : ${SG('EC')} = ${SG('AD')} : ${SG('DB')} = ${v.m} : ${v.k}이다. ${SG('EC')} = ${ac} × ${frac(v.k, `${v.m} + ${v.k}`)} = ${ec}(cm)이다.`,
                facts: { calc: [[`${ac}*${v.k}/(${v.m}+${v.k})`, 0]] }
              });
            }
            const de = v.m * v.w, bc = s * v.w;
            return lenQ(`${CUT_LEAD} ${nb(`${SG('AD')} : ${SG('DB')} = ${v.m} : ${v.k}`)}이고 ${eq('DE', de)}일 때, ${SG('BC')}의 길이는?`, bc, {
              figure: fig.svg(`${CUT_SAID} DE = ${cm(de)}`),
              explain: `${SG('AD')} : ${SG('AB')} = ${v.m} : (${v.m} + ${v.k}) = ${v.m} : ${s}이다. ${par('BC', 'DE')}이므로 ${SG('DE')} : ${SG('BC')} = ${SG('AD')} : ${SG('AB')}이고 ${de} : ${SG('BC')} = ${v.m} : ${s}에서 ${SG('BC')} = ${bc} cm이다.`,
              facts: { calc: [[`${de}*(${v.m}+${v.k})/${v.m}`, 0]] }
            });
          }, { count: 2 }),
          T('tri-hour', '꼭짓점 너머에서 엇갈린 두 선분과 평행선', '①5', (d, n) => {
            // 선분 BE 와 선분 CD 가 점 A 에서 만나고 DE ∥ BC 이다(위에 DE, 아래에 BC). DE : BC = AE : AB = AD : AC = m : k
            const v = d.until(() => {
              const [m, k] = d.pick([[1, 2], [2, 3], [3, 4], [3, 5], [1, 3], [2, 5]]), u = d.int(1, 6), w = d.int(1, 6), z = d.int(2, 7);
              const t3 = n === 2 ? sas(k * u, k * w, d.int(10, 16) * 5) : sab(k * z, k * u, d.int(10, 14) * 5);
              const P0 = Object.assign({}, t3, { D: lerp(t3.C, t3.A, 1 + m / k), E: lerp(t3.B, t3.A, 1 + m / k) }), fig = Fig(P0, [150, 150]).seg('BE CD DE BC').arrow('DE BC').name('BCDE').free('A', 'BCDE');
              if (n === 2) fig.len('AD', cm(m * w), 'E', { t: 0.62 }).len('AC', cm(k * w), 'B').bow('BE', cm((m + k) * u), 17, 'C', 0.27); else fig.len('DE', cm(m * z), 'A').len('BC', cm(k * z), 'A').len('AE', cm(m * u), 'D');
              return { m, k, u, w, z, t3, fig };
            }, (x) => x.k * Math.max(x.u, x.w, x.z) <= 30 && fine(x.t3, 40, 88) && !x.fig.clash());
            const { m, k, u, w, z } = v, said = '선분 BE와 선분 CD가 점 A에서 만난다. 선분 DE와 선분 BC가 그어져 있고, 두 선분에 평행하다는 표시가 있다. 점 D, E는 점 A의 위쪽에, 점 B, C는 점 A의 아래쪽에 있다.';
            const lead = `그림과 같이 ${SG('BE')}와 ${SG('CD')}가 점 A에서 만나고 ${par('DE', 'BC')}이다.`;
            if (n === 0) return lenQ(`${lead} ${eq('DE', m * z)}, ${eq('BC', k * z)}, ${eq('AE', m * u)}일 때, ${SG('AB')}의 길이는?`, k * u, {
              figure: v.fig.svg(`${said} DE = ${cm(m * z)}, BC = ${cm(k * z)}, AE = ${cm(m * u)}`),
              explain: `${par('DE', 'BC')}이므로 ${SG('AE')} : ${SG('AB')} = ${SG('DE')} : ${SG('BC')}이다. ${m * u} : ${SG('AB')} = ${m * z} : ${k * z}에서 ${SG('AB')} = ${k * u} cm이다.`,
              facts: { calc: [[`${m * u}*${k * z}/${m * z}`, 0]] }
            });
            if (n === 1) return lenQ(`${lead} ${eq('DE', m * z)}, ${eq('BC', k * z)}, ${eq('AE', m * u)}일 때, ${SG('BE')}의 길이는?`, (m + k) * u, {
              figure: v.fig.svg(`${said} DE = ${cm(m * z)}, BC = ${cm(k * z)}, AE = ${cm(m * u)}`),
              explain: `${par('DE', 'BC')}이므로 ${SG('AE')} : ${SG('AB')} = ${SG('DE')} : ${SG('BC')}이다. ${m * u} : ${SG('AB')} = ${m * z} : ${k * z}에서 ${SG('AB')} = ${k * u} cm이다. ${SG('BE')} = ${SG('AB')} + ${SG('AE')} = ${k * u} + ${m * u} = ${(m + k) * u}(cm)이다.`,
              facts: { calc: [[`${m * u}*${k * z}/${m * z}+${m * u}`, 0]] }
            });
            return lenQ(`${lead} ${eq('AD', m * w)}, ${eq('AC', k * w)}, ${eq('BE', (m + k) * u)}일 때, ${SG('AE')}의 길이는?`, m * u, {
              figure: v.fig.svg(`${said} AD = ${cm(m * w)}, AC = ${cm(k * w)}, BE = ${cm((m + k) * u)}`),
              explain: `${par('DE', 'BC')}이므로 ${SG('AE')} : ${SG('AB')} = ${SG('AD')} : ${SG('AC')} = ${m * w} : ${k * w}이다. ${SG('AE')} = ${SG('BE')} × ${frac(m * w, `${m * w} + ${k * w}`)} = ${(m + k) * u} × ${frac(m * w, (m + k) * w)} = ${m * u}(cm)이다.`,
              facts: { calc: [[`${(m + k) * u}*${m * w}/(${m * w}+${k * w})`, 0]] }
            });
          }, { count: 3 }),
          T('tri-beyond', '두 변을 늘인 선 위의 점을 이은 평행선', '①6', (d) => {
            // △ABC 의 두 변 AB, AC 를 늘인 선 위의 점 D, E. BC ∥ DE. AB : AD = BC : DE = m : (m + k)
            const v = d.until(() => {
              const [m, k] = d.pick(RATIOS), u = d.int(1, 5), w = d.int(1, 5), s = m + k, big = sab(s * w, s * u, d.int(10, 15) * 5);
              const P0 = { A: big.A, D: big.B, E: big.C, B: lerp(big.A, big.B, m / s), C: lerp(big.A, big.C, m / s) };
              const fig = Fig(P0, [150, 120], { hub: 'ADE' }).poly('ADE').seg('BC').arrow('BC DE').name('ABCDE').len('AB', cm(m * u)).len('BD', cm(k * u)).len('DE', cm(s * w));
              return { m, k, u, w, s, big, fig };
            }, (x) => x.u !== x.w && x.s * Math.max(x.u, x.w) <= 24 && fine(x.big) && !x.fig.clash());
            const { m, k, u, w, s } = v;
            return lenQ(`△ABC의 두 변 AB, AC의 연장선 위에 각각 점 D, E가 있고 ${par('BC', 'DE')}이다. ${eq('AB', m * u)}, ${eq('BD', k * u)}, ${eq('DE', s * w)}일 때, ${SG('BC')}의 길이는?`, m * w, {
              figure: v.fig.svg(`삼각형 ADE. 점 B는 변 AD 위에, 점 C는 변 AE 위에 있고 선분 BC가 그어져 있다. 선분 BC와 변 DE에 평행하다는 표시가 있다. AB = ${cm(m * u)}, BD = ${cm(k * u)}, DE = ${cm(s * w)}`),
              explain: `${SG('AD')} = ${m * u} + ${k * u} = ${s * u}(cm)이다. ${par('BC', 'DE')}이므로 ${SG('AB')} : ${SG('AD')} = ${SG('BC')} : ${SG('DE')}이고 ${m * u} : ${s * u} = ${SG('BC')} : ${s * w}에서 ${SG('BC')} = ${m * w} cm이다.`,
              facts: { calc: [[`${s * w}*${m * u}/(${m * u}+${k * u})`, 0]] }
            });
          }),
          T('tri-pick-par', '변을 나눈 길이로 평행한 것 고르기', '①7', (d) => {
            // 보기마다 [AD, DB, AE, EC]. 평행한 것은 하나뿐이다. 틀린 보기: 두 변에서 같은 길이만큼 차이 나는 것(비가 아니라 차로 견주는 아이), 한 조각이 1 cm 다른 것 둘.
            const v = d.until(() => {
              const [m, k] = d.pick(RATIOS), u = d.int(1, 4), w = d.int(1, 4), a = d.int(3, 9), b = d.int(2, 8), j = d.int(1, 3), [p, q] = d.pick(RATIOS), g = d.int(2, 4), h = d.int(1, 4), [r, s] = d.pick(RATIOS), e = d.int(2, 4), f = d.int(2, 4);
              return { rows: [[m * u, k * u, m * w, k * w], [a, b, a + j, b + j], [p * g, q * g, p * h, q * h + 1], [r * e, s * e, r * f + 1, s * f]], u, w, a, b };
            }, (x) => x.u !== x.w && x.a !== x.b && x.rows.filter((r) => r[0] * r[3] === r[1] * r[2]).length === 1 && x.rows.every((r) => Math.max(...r) <= 20 && r[0] + r[1] !== r[2] + r[3]) && new Set(x.rows.map((r) => r.join())).size === 4);
            // 정답과 틀린 보기 하나는 전체와 부분(AB, AD, AC, AE)으로 적는다.
            const whole = d.shuffle([true, d.bool(), false, false]), order = d.shuffle([0, 1, 2, 3]), rows = order.map((i) => ({ r: v.rows[i], whole: whole[i] }));
            const html = ({ r, whole: wh }) => (wh ? `${eq('AB', r[0] + r[1])}, ${eq('AD', r[0])}, ${eq('AC', r[2] + r[3])}, ${eq('AE', r[2])}` : `${eq('AD', r[0])}, ${eq('DB', r[1])}, ${eq('AE', r[2])}, ${eq('EC', r[3])}`);
            const hit = rows.findIndex(({ r }) => r[0] * r[3] === r[1] * r[2]), R = rows[hit].r;
            return C(`△ABC에서 두 점 D, E가 각각 변 AB, AC 위에 있을 때, 다음 중 ${par('BC', 'DE')}인 것은?`, rows.map(html), hit, {
              explain: `${SG('AD')} : ${SG('DB')} = ${SG('AE')} : ${SG('EC')}이면 ${par('BC', 'DE')}이다. ${rows[hit].whole ? `${SG('DB')} = ${R[0] + R[1]} − ${R[0]} = ${R[1]}(cm), ${SG('EC')} = ${R[2] + R[3]} − ${R[2]} = ${R[3]}(cm)이므로 ` : ''}${SG('AD')} : ${SG('DB')} = ${simple(R[0], R[1])}, ${SG('AE')} : ${SG('EC')} = ${simple(R[2], R[3])}로 두 비가 같다. 나머지는 두 비가 같지 않다.`,
              facts: { claimed: rows.map(({ r }) => [`${r[0]}*${r[3]}`, r[1] * r[2]]), claimedWant: true }
            });
          }),
          T('tri-make-par', '선분이 밑변과 평행하게 되는 조건', '①8', (d) => {
            const v = d.until(() => {
              const [m, k] = d.pick(WIDE), u = d.int(1, 5), w = d.int(1, 6), q = d.pick([2, 3]), s = m + k, t3 = sas(s * u, s * w, d.int(10, 15) * 5);
              const fig = cutFig(t3, m / s, [128, 112]).len('AD', cm(m * u)).bow('AB', cm(s * u), 54).len('AE', `${q}${sv('x')} cm`).len('EC', cm(k * w));
              return { m, k, u, w, q, s, t3, fig };
            }, (x) => x.u !== x.w && (x.m * x.w) % x.q === 0 && x.m * x.w / x.q >= 2 && x.s * Math.max(x.u, x.w) <= 24 && fine(x.t3) && !x.fig.clash());
            const { m, k, u, w, q, s } = v, x = m * w / q;
            return N(`△ABC에서 두 점 D, E는 각각 변 AB, AC 위의 점이다. ${eq('AD', m * u)}, ${eq('AB', s * u)}, ${nb(`${SG('AE')} = ${q}${X} cm`)}, ${eq('EC', k * w)}일 때, ${par('BC', 'DE')}가 되도록 하는 ${X}의 값은?`, x, {
              figure: v.fig.svg(`삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 선분 DE가 그어져 있다. AD = ${cm(m * u)}, AB = ${cm(s * u)}, AE = ${q}x cm, EC = ${cm(k * w)}`),
              explain: `${SG('DB')} = ${s * u} − ${m * u} = ${k * u}(cm)이다. ${SG('AD')} : ${SG('DB')} = ${SG('AE')} : ${SG('EC')}이면 ${par('BC', 'DE')}이므로 ${m * u} : ${k * u} = ${q}${X} : ${k * w}이다. ${q}${X} = ${m * w}에서 ${X} = ${x}이다.`,
              facts: { calc: [[`${m * u}*${k * w}/(${s * u}-${m * u})/${q}`, 0]] }
            });
          }),
          T('tri-cevian', '꼭짓점에서 그은 선분이 평행한 두 선분을 나눈 길이', '①9', (d) => {
            // DP : PE = BQ : QC = r : s. BQ = r·w, QC = s·w, DP = r·z, PE = s·z (z < w)
            const v = d.until(() => {
              const [r, s] = d.pick([[1, 2], [2, 1], [2, 3], [3, 2], [3, 4], [4, 3]]), w = d.int(2, 8), z = d.int(1, 6), a = (r + s) * w, bv = d.int(10, 15) * 5, cv = d.int(10, 15) * 5, t = z / w;
              const A = meet([0, 0], pol(10, bv), [a, 0], plus([a, 0], pol(10, 180 - cv))), t3 = { A, B: [0, 0], C: [a, 0] }, P0 = Object.assign(cutOf(t3, t), { Q: [r * w, 0], P: lerp(A, [r * w, 0], t) });
              const fig = Fig(P0, [156, 122], { hub: 'ABC' }).poly('ABC').seg('DE AQ').arrow('DE BC', 1, 0.82).name('ABCDEQ').free('P', 'ADEQ').len('BQ', cm(r * w)).len('QC', cm(s * w)).len('PE', cm(s * z), 'A');
              return { r, s, w, z, t, fig };
            }, (x) => x.t >= 0.4 && x.t <= 0.7 && x.s * x.z / ((x.r + x.s) * x.w) >= 0.27 && (x.r + x.s) * x.w <= 30 && x.r * x.w >= 3 && !x.fig.clash());
            const { r, s, w, z } = v;
            return lenQ(`△ABC에서 두 점 D, E는 각각 변 AB, AC 위의 점이고 ${par('BC', 'DE')}이다. 점 A와 변 BC 위의 점 Q를 이은 선분이 ${SG('DE')}와 만나는 점을 P라 하자. ${eq('BQ', r * w)}, ${eq('QC', s * w)}, ${eq('PE', s * z)}일 때, ${SG('DP')}의 길이는?`, r * z, {
              figure: v.fig.svg(`삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 AC 위에, 점 Q는 변 BC 위에 있다. 선분 DE와 선분 AQ가 점 P에서 만나고, 선분 DE와 변 BC에 평행하다는 표시가 있다. BQ = ${cm(r * w)}, QC = ${cm(s * w)}, PE = ${cm(s * z)}`),
              explain: `△ABQ에서 ${par('DP', 'BQ')}이므로 ${SG('DP')} : ${SG('BQ')} = ${SG('AP')} : ${SG('AQ')}이고, △AQC에서 ${par('PE', 'QC')}이므로 ${SG('PE')} : ${SG('QC')} = ${SG('AP')} : ${SG('AQ')}이다. 따라서 ${SG('DP')} : ${r * w} = ${s * z} : ${s * w}이고 ${SG('DP')} = ${r * z} cm이다.`,
              facts: { calc: [[`${r * w}*${s * z}/${s * w}`, 0]] }
            });
          }),
          T('tri-two-par', '평행선 두 쌍이 잇달아 있는 삼각형', '①10', (d) => {
            // AF : FD = AE : EC = AD : DB = m : k. AF = m·m·j, FD = m·k·j, AD = m(m + k)j, DB = k(m + k)j
            const v = d.until(() => {
              const [m, k, j] = d.pick([[3, 2, 1], [3, 2, 2], [2, 1, 1], [2, 1, 2], [2, 1, 3], [2, 1, 4]]), s = m + k, t3 = sas(s * s * j, s * s * j * d.pick([0.85, 0.95, 1.05]), d.int(9, 12) * 5);
              const P0 = Object.assign(cutOf(t3, m / s), { F: lerp(t3.A, t3.B, m * m / (s * s)) });
              const fig = Fig(P0, [150, 160], { hub: 'ABC' }).poly('ABC').seg('DE DC FE').arrow('DE BC').arrow('FE DC', 2).name('ABCDEF').len('AF', cm(m * m * j)).len('FD', cm(m * k * j));
              return { m, k, j, s, t3, fig };
            }, (x) => fine(x.t3) && !x.fig.clash());
            const { m, k, j, s } = v, af = m * m * j, fd = m * k * j, ad = m * s * j, db = k * s * j;
            return lenQ(`△ABC에서 두 점 D, F는 변 AB 위의 점이고 점 E는 변 AC 위의 점이다. ${par('DE', 'BC')}, ${par('FE', 'DC')}이고 ${eq('AF', af)}, ${eq('FD', fd)}일 때, ${SG('DB')}의 길이는?`, db, {
              figure: v.fig.svg(`삼각형 ABC. 변 AB 위에 점 A에서 가까운 쪽부터 점 F, D가, 변 AC 위에 점 E가 있다. 선분 DE, 선분 DC, 선분 FE가 그어져 있고, 선분 DE와 변 BC에 평행하다는 표시가, 선분 FE와 선분 DC에 평행하다는 다른 표시가 있다. AF = ${cm(af)}, FD = ${cm(fd)}`),
              explain: `△ADC에서 ${par('FE', 'DC')}이므로 ${SG('AF')} : ${SG('FD')} = ${SG('AE')} : ${SG('EC')}이고, △ABC에서 ${par('DE', 'BC')}이므로 ${SG('AE')} : ${SG('EC')} = ${SG('AD')} : ${SG('DB')}이다. 따라서 ${SG('AD')} : ${SG('DB')} = ${af} : ${fd}이다. ${SG('AD')} = ${af} + ${fd} = ${ad}(cm)이므로 ${SG('DB')} = ${ad} × ${frac(fd, af)} = ${db}(cm)이다.`,
              facts: { calc: [[`(${af}+${fd})*${fd}/${af}`, 0]] }
            });
          }),
          T('tri-two-cuts', '삼각형을 자르는 두 평행선', '①12', (d) => {
            const v = d.until(() => {
              const [i, j, k] = d.pick([[2, 1, 1], [1, 1, 1], [2, 2, 1], [2, 1, 2], [1, 2, 1], [3, 2, 1], [2, 1, 3], [1, 1, 2], [3, 1, 2]]), u = d.int(1, 3), w = d.int(1, 4), s = i + j + k, t3 = sab(s * w, s * u, d.int(11, 15) * 5);
              const P0 = Object.assign({}, t3, { D: lerp(t3.A, t3.B, i / s), E: lerp(t3.A, t3.C, i / s), F: lerp(t3.A, t3.B, (i + j) / s), G: lerp(t3.A, t3.C, (i + j) / s) });
              const fig = Fig(P0, [150, 150], { hub: 'ABC' }).poly('ABC').seg('DE FG').arrow('DE FG BC').name('ABCDEFG').len('AD', cm(i * u)).len('DF', cm(j * u)).len('FB', cm(k * u)).len('BC', cm(s * w));
              return { i, j, k, u, w, s, t3, fig };
            }, (x) => x.u !== x.w && x.s * Math.max(x.u, x.w) <= 24 && fine(x.t3) && !x.fig.clash());
            const { i, j, k, u, w, s } = v, ab = s * u, bc = s * w;
            return two(`△ABC에서 두 점 D, F는 변 AB 위의 점이고 두 점 E, G는 변 AC 위의 점이다. ${par('DE', 'FG', 'BC')}이고 ${eq('AD', i * u)}, ${eq('DF', j * u)}, ${eq('FB', k * u)}, ${eq('BC', bc)}일 때, ${jo('DE', '과/와')} ${SG('FG')}의 길이를 각각 구하시오.`, [[SG('DE'), i * w], [SG('FG'), (i + j) * w]], {
              figure: v.fig.svg(`삼각형 ABC. 변 AB 위에 점 A에서 가까운 쪽부터 점 D, F가, 변 AC 위에 점 A에서 가까운 쪽부터 점 E, G가 있다. 선분 DE, 선분 FG, 변 BC에 평행하다는 표시가 있다. AD = ${cm(i * u)}, DF = ${cm(j * u)}, FB = ${cm(k * u)}, BC = ${cm(bc)}`),
              explain: `${SG('AB')} = ${i * u} + ${j * u} + ${k * u} = ${ab}(cm)이다. ${SG('DE')} : ${SG('BC')} = ${SG('AD')} : ${SG('AB')} = ${i * u} : ${ab}이므로 ${SG('DE')} = ${i * w} cm이다. ${SG('AF')} = ${i * u} + ${j * u} = ${(i + j) * u}(cm)이고 ${SG('FG')} : ${SG('BC')} = ${SG('AF')} : ${SG('AB')} = ${(i + j) * u} : ${ab}이므로 ${SG('FG')} = ${(i + j) * w} cm이다.`,
              facts: { calc: [[`${bc}*${i * u}/(${i * u}+${j * u}+${k * u})`, 0], [`${bc}*(${i * u}+${j * u})/(${i * u}+${j * u}+${k * u})`, 1]] }
            });
          }),
          T('tri-life', '일정한 기울기로 올라가는 비행기의 고도', '①13', (d) => {
            const v = d.until(() => ({ p: d.int(2, 5), r: d.pick([2, 3]), h: d.int(1, 3) }), (x) => x.h < x.p && x.h * 3 >= x.p);
            const { p, r, h } = v, P0 = { A: [0, 0], D: [p, 0], E: [p * r, 0], B: [p, h], C: [p * r, h * r] };
            const fig = Fig(P0, [200, 130]).seg('AE AC').seg('BD CE', 'thin').right('BDA').right('CEA').name('A', 180).name('D', 270).name('E', 0).name('B', 115).name('C', 90).len('AD', p + ' km', 'B').len('BD', h + ' km', 'A').bow('AE', p * r + ' km', 38, 'C');
            return N(`그림과 같이 A 지점에서 이륙한 비행기가 일정한 방향으로 곧게 올라간다. A 지점에서 수평으로 ${p} km 떨어진 D 지점의 바로 위 B를 지날 때 비행기의 고도가 ${h} km였다. 이 비행기가 A 지점에서 수평으로 ${p * r} km 떨어진 E 지점의 바로 위 C를 지날 때의 고도는 몇 km인가?`, h * r, {
              unit: 'km',
              figure: fig.svg(`가로로 놓인 선분 AE 위에 점 D가 있고, 점 A에서 오른쪽 위로 뻗은 선분 AC 위에 점 B가 있다. 선분 BD와 선분 CE는 선분 AE에 수직이다(직각 표시). AD = ${p} km, AE = ${p * r} km, BD = ${h} km`),
              explain: `${SG('BD')}와 ${SG('CE')}는 모두 ${SG('AE')}에 수직이므로 ${par('BD', 'CE')}이다. △ACE에서 ${SG('AD')} : ${SG('AE')} = ${SG('BD')} : ${SG('CE')}이므로 ${p} : ${p * r} = ${h} : ${SG('CE')}이다. ${SG('CE')} = ${h * r} km이다.`,
              facts: { calc: [[`${h}*${p * r}/${p}`, 0]] }
            });
          }),
          T('tri-cross', '평행한 두 선분의 끝을 엇갈리게 이은 두 선분의 교점', '①14', (d) => {
            // DE ∥ BC, AD : DB = m : k. BE 와 CD 의 교점 F 에서 DF : FC = DE : BC = m : (m + k). 그림을 길이대로 그리려고 DC = (2m + k)z 가 되게 변 AC 의 길이를 맞춘다.
            const v = d.until(() => {
              const [m, k] = d.pick([[1, 1], [2, 1], [3, 2], [3, 1]]), u = d.int(2, 6), z = d.int(1, 5), s = m + k, ang = d.int(10, 15) * 5, ad = m * u, dc = (m + s) * z;
              const root2 = dc * dc - (ad * Math.sin(ang * RAD)) ** 2, bb = root2 > 0 ? ad * Math.cos(ang * RAD) + Math.sqrt(root2) : 0, t3 = bb > 0 ? sas(s * u, bb, ang) : null;
              if (!t3 || !fine(t3, 42, 88)) return { fig: null };
              const P0 = cutOf(t3, m / s); P0.F = meet(P0.B, P0.E, P0.C, P0.D);
              const fig = Fig(P0, [176, 150], { hub: 'ABC' }).poly('ABC').seg('DE BE CD').arrow('DE', 1, 0.3).arrow('BC').name('ABCDE').free('F', 'BECD').len('AD', cm(ad)).len('DB', cm(k * u)).len('FC', cm(s * z), 'E');
              return { m, k, u, z, s, ad, fig };
            }, (x) => x.fig && x.s * x.u <= 24 && x.s * x.z <= 24 && !x.fig.clash());
            const { m, k, u, z, s, ad } = v;
            return lenQ(`△ABC에서 두 점 D, E는 각각 변 AB, AC 위의 점이고 ${par('BC', 'DE')}이다. ${jo('BE', '과/와')} ${SG('CD')}가 만나는 점을 F라 하자. ${eq('AD', ad)}, ${eq('DB', k * u)}, ${eq('FC', s * z)}일 때, ${SG('DF')}의 길이는?`, m * z, {
              figure: v.fig.svg(`${CUT_SAID} 선분 BE와 선분 CD가 점 F에서 만난다. AD = ${cm(ad)}, DB = ${cm(k * u)}, FC = ${cm(s * z)}`),
              explain: `${SG('DE')} : ${SG('BC')} = ${SG('AD')} : ${SG('AB')} = ${simple(ad, s * u)}이다. ${par('DE', 'BC')}이므로 ${SG('DF')} : ${SG('FC')} = ${SG('DE')} : ${SG('BC')} = ${m} : ${s}이다. ${SG('DF')} : ${s * z} = ${m} : ${s}에서 ${SG('DF')} = ${m * z} cm이다.`,
              facts: { calc: [[`${s * z}*${ad}/(${ad}+${k * u})`, 0]] }
            });
          }),
          T('tri-fan', '엇갈린 두 선분 사이의 세 평행선', '심6', (d) => {
            // AD ∥ EF ∥ BC, AC 와 BD 가 점 P 에서 만난다. AP : PF : FC = i : j : k → AD : EF : BC = i : j : (j + k)
            const v = d.until(() => {
              const [i, j, k] = d.pick([[3, 4, 3], [1, 2, 1], [2, 3, 2], [3, 4, 2], [2, 3, 3], [3, 4, 4], [1, 2, 2], [3, 5, 3], [2, 5, 3]]), w = d.int(1, 5), f = d.int(9, 12) * 5, g = d.int(9, 12) * 5;
              const cf = 1 / Math.tan(f * RAD), cg = 1 / Math.tan(g * RAD), h = 1;
              const P0 = { P: [0, 0], A: [-i * h * cf, i * h], D: [i * h * cg, i * h], F: [j * h * cf, -j * h], E: [-j * h * cg, -j * h], C: [(j + k) * h * cf, -(j + k) * h], B: [-(j + k) * h * cg, -(j + k) * h] };
              const fig = Fig(P0, [176, 150]).seg('AC DB AD EF BC').arrow('AD EF BC').name('ABCD').name('E', 180).name('F', 0).free('P', 'ABCD').len('AD', cm(i * w), 'P');
              return { i, j, k, w, fig };
            }, (x) => x.i * x.w >= 2 && (x.j + x.k) * x.w <= 30 && !x.fig.clash());
            const { i, j, k, w } = v;
            return two(`그림에서 ${par('AD', 'EF', 'BC')}이고 ${jo('AC', '과/와')} ${SG('BD')}는 점 P에서 만난다. 점 E는 ${SG('PB')} 위의 점, 점 F는 ${SG('PC')} 위의 점이다. ${nb(`${SG('AP')} : ${SG('PF')} : ${SG('FC')} = ${i} : ${j} : ${k}`)}이고 ${eq('AD', i * w)}일 때, ${jo('EF', '과/와')} ${SG('BC')}의 길이를 각각 구하시오.`, [[SG('EF'), j * w], [SG('BC'), (j + k) * w]], {
              figure: v.fig.svg(`선분 AC와 선분 BD가 점 P에서 만난다. 점 A, D는 점 P의 위쪽에, 점 B, C는 점 P의 아래쪽에 있다. 점 E는 선분 PB 위에, 점 F는 선분 PC 위에 있다. 선분 AD, 선분 EF, 선분 BC에 평행하다는 표시가 있다. AD = ${cm(i * w)}`),
              explain: `${par('AD', 'EF')}이므로 ${SG('AD')} : ${SG('EF')} = ${SG('AP')} : ${SG('PF')} = ${i} : ${j}이고 ${SG('EF')} = ${j * w} cm이다. ${par('AD', 'BC')}이므로 ${SG('AD')} : ${SG('BC')} = ${SG('AP')} : ${SG('PC')} = ${i} : (${j} + ${k})이고 ${SG('BC')} = ${(j + k) * w} cm이다.`,
              facts: { calc: [[`${i * w}*${j}/${i}`, 0], [`${i * w}*(${j}+${k})/${i}`, 1]] }
            });
          })
        ]
      },
      { id: 'lines', title: '평행선 사이의 선분의 길이의 비', standard: STD, types: [] },
      { id: 'trap', title: '사다리꼴에서 평행선과 선분의 길이의 비', standard: STD, types: [] },
      { id: 'mid', title: '삼각형의 두 변의 중점을 이은 선분', standard: STD, types: [] },
      { id: 'cent', title: '삼각형의 중선과 무게중심', standard: STD, types: [] },
      { id: 'area', title: '무게중심과 넓이', standard: STD, types: [] }
    ]
  });

  // 엇갈린 꼴에서 구한 길이를 이어서 삼각형 안의 평행선에 쓰는 꼴(두 단계)
  B.addTypes(UNIT, 'tri', [
    T('tri-hour-chain', '엇갈린 꼴 뒤에 이어지는 삼각형 안의 평행선', '①11', (d) => {
      // AB ∥ DG, AG 와 BD 가 점 C 에서 만난다. AB : DG = BC : CD = m : n. E 는 CG 위, F 는 DG 위, CD ∥ EF. DF : FG = i : j.
      const v = d.until(() => {
        const [m, n] = d.pick([[1, 3], [1, 2], [2, 3], [2, 5]]), [i, j] = d.pick([[1, 2], [1, 1], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), z = d.int(1, 6), w = d.int(1, 5), dg = (i + j) * z, cd = n * w, ef = cd * j / (i + j), ab = dg * m / n;
        if (!Number.isInteger(ef) || !Number.isInteger(ab)) return { fig: null };
        const D = [0, 0], G = [dg, 0], Cp = pol(cd, d.int(10, 14) * 5), P0 = { C: Cp, D, G, A: lerp(G, Cp, 1 + m / n), B: lerp(D, Cp, 1 + m / n), F: [i * z, 0], E: lerp(G, Cp, j / (i + j)) };
        const fig = Fig(P0, [176, 170]).seg('AG BD AB DG EF').arrow('AB DG').arrow('DC FE', 2, 0.6).name('ABDG').name('F', 270).free('C', 'ABDG').free('E', 'CGF').len('AB', cm(ab), 'C').len('BC', cm(m * w), 'A').len('DF', cm(i * z), 'C').len('FG', cm(j * z), 'C');
        return { m, n, i, j, z, w, dg, cd, ef, ab, t: { A: Cp, B: D, C: G }, fig };
      }, (x) => x.fig && x.ab >= 2 && x.dg <= 30 && x.cd <= 24 && x.ef !== x.m * x.w && fine(x.t, 38, 92) && !x.fig.clash());
      const { m, i, j, z, w, dg, cd, ef, ab } = v, bc = m * w, df = i * z, fg = j * z;
      return lenQ(`그림에서 ${par('AB', 'DG')}이고 ${jo('AG', '과/와')} ${SG('BD')}는 점 C에서 만난다. 점 E는 ${SG('CG')} 위의 점, 점 F는 ${SG('DG')} 위의 점이고 ${par('CD', 'EF')}이다. ${eq('AB', ab)}, ${eq('BC', bc)}, ${eq('DF', df)}, ${eq('FG', fg)}일 때, ${SG('EF')}의 길이는?`, ef, {
        figure: v.fig.svg(`선분 AG와 선분 BD가 점 C에서 만난다. 점 A, B는 점 C의 위쪽에, 점 D, G는 점 C의 아래쪽에 있고 선분 AB와 선분 DG에 평행하다는 표시가 있다. 점 E는 선분 CG 위에, 점 F는 선분 DG 위에 있고, 선분 CD와 선분 EF에 평행하다는 다른 표시가 있다. AB = ${cm(ab)}, BC = ${cm(bc)}, DF = ${cm(df)}, FG = ${cm(fg)}`),
        explain: `${SG('DG')} = ${df} + ${fg} = ${dg}(cm)이다. ${par('AB', 'DG')}이므로 ${SG('BC')} : ${SG('CD')} = ${SG('AB')} : ${SG('DG')} = ${ab} : ${dg}이고 ${SG('CD')} = ${cd} cm이다. △GDC에서 ${par('EF', 'CD')}이므로 ${SG('EF')} : ${SG('CD')} = ${SG('GF')} : ${SG('GD')} = ${fg} : ${dg}이고 ${SG('EF')} = ${ef} cm이다.`,
        facts: { calc: [[`${bc}*(${df}+${fg})/${ab}*${fg}/(${df}+${fg})`, 0]] }
      });
    })
  ]);

  // ── 평행선 사이의 선분의 길이의 비 ──
  // 그림 속의 길이는 교과서의 이 꼴처럼 단위 없이 수만 적는다(평행선 사이의 좁은 틈에 적어야 한다). 묻는 것은 x, y 의 값이다.
  const KLMN = ['k', 'l', 'm', 'n'], LMN = ['l', 'm', 'n'], lmn = `${LV('l')}, ${LV('m')}, ${LV('n')}`, SX = sv('x'), SY = sv('y');
  const LMN_SAID = '평행한 세 직선 l, m, n이 위에서부터 이 차례로 가로로 놓여 있다.';
  // 두 직선이 잘린 길이의 크기가 너무 다르면 한쪽이 너무 눕는다: 잘린 길이의 배가 1.5를 넘지 않는 짝만 쓴다.
  const PAIRS = [[2, 3], [3, 2], [3, 4], [4, 3], [4, 5], [5, 4], [4, 6], [6, 4], [5, 6], [6, 5], [5, 7], [7, 5]];
  B.addTypes(UNIT, 'lines', [
    T('lines-two', '세 평행선과 두 직선', '①19', (d, n) => {
      const v = d.until(() => {
        const [p, q] = d.pick(RATIOS), [u, w] = d.pick(PAIRS), a1 = p * u, b1 = q * u, a2 = p * w, b2 = q * w, dir = d.pick([1, -1]);
        const st = n === 0
          ? strips([p, q], LMN, [{ a: a1, dir, marks: [[0, 1, a1, 'l'], [1, 2, b1, 'l']] }, { a: a2, dir, marks: [[0, 1, a2, 'r'], [1, 2, SX, 'r']] }])
          : strips([p, q], LMN, [{ a: a1, dir: 1, marks: [[0, 1, a1, 'l', 'bow'], [1, 2, b1, 'r']] }, { a: a2, dir: -1, cross: p * d.pick([0.68, 0.74]), marks: [[0, 1, SX, 'r', 'bow'], [1, 2, b2, 'l']] }], { steep: 1.12 });
        return { a1, b1, a2, b2, st };
      }, (x) => Math.max(x.a1, x.b1, x.a2, x.b2) <= 24 && x.st.low >= 32 && !x.st.b.clash());
      const { a1, b1, a2, b2 } = v;
      if (n === 0) return N(`그림과 같이 평행한 세 직선 ${lmn}이 두 직선과 만날 때, ${X}의 값은?`, b2, {
        figure: v.st.b.svg(`${LMN_SAID} 두 직선이 세 직선과 만난다. 왼쪽 직선이 l과 m 사이에서 잘린 길이는 ${a1}, m과 n 사이에서 잘린 길이는 ${b1}이다. 오른쪽 직선이 l과 m 사이에서 잘린 길이는 ${a2}, m과 n 사이에서 잘린 길이는 x이다.`),
        explain: `평행선 사이에서 잘린 선분의 길이의 비는 같으므로 ${a1} : ${b1} = ${a2} : ${X}이다. ${X} = ${b1} × ${a2} ÷ ${a1} = ${b2}이다.`,
        facts: { calc: [[`${b1}*${a2}/${a1}`, 0]] }
      });
      return N(`그림과 같이 평행한 세 직선 ${lmn}과 만나는 두 직선이 ${LV('l')}과 ${LV('m')} 사이에서 서로 만날 때, ${X}의 값은?`, a2, {
        figure: v.st.b.svg(`${LMN_SAID} 두 직선이 세 직선과 만나고, 두 직선은 l과 m 사이에서 서로 만난다. 직선 l과 왼쪽에서 만나는 직선이 l과 m 사이에서 잘린 길이는 ${a1}, m과 n 사이에서 잘린 길이는 ${b1}이다. 직선 l과 오른쪽에서 만나는 직선이 l과 m 사이에서 잘린 길이는 x, m과 n 사이에서 잘린 길이는 ${b2}이다.`),
        explain: `두 직선이 평행선 사이에서 서로 만나도 평행선 사이에서 잘린 선분의 길이의 비는 같다. ${a1} : ${b1} = ${X} : ${b2}에서 ${X} = ${a1} × ${b2} ÷ ${b1} = ${a2}이다.`,
        facts: { calc: [[`${a1}*${b2}/${b1}`, 0]] }
      });
    }, { count: 2 }),
    T('lines-whole', '한 직선에 전체의 길이가 적힌 세 평행선', '①20 심16', (d) => {
      const v = d.until(() => {
        const [p, q] = d.pick(RATIOS), [u, w] = d.pick(PAIRS), a1 = p * u, b1 = q * u, a2 = p * w, b2 = q * w, dir = d.pick([1, -1]);
        const st = strips([p, q], LMN, [{ a: a1, dir, marks: [[1, 2, b1, 'r'], [0, 2, SX, 'l', 'bow']] }, { a: a2, dir, marks: [[0, 1, a2, 'r'], [1, 2, b2, 'r']] }]);
        return { a1, b1, a2, b2, st };
      }, (x) => Math.max(x.a1 + x.b1, x.a2, x.b2) <= 24 && x.st.low >= 32 && !x.st.b.clash());
      const { a1, b1, a2, b2 } = v;
      return N(`그림과 같이 평행한 세 직선 ${lmn}이 두 직선과 만난다. 왼쪽 직선이 ${LV('l')}과 ${LV('n')} 사이에서 잘린 전체의 길이가 ${X}일 때, ${X}의 값은?`, a1 + b1, {
        figure: v.st.b.svg(`${LMN_SAID} 두 직선이 세 직선과 만난다. 왼쪽 직선이 m과 n 사이에서 잘린 길이는 ${b1}, l과 n 사이에서 잘린 전체의 길이는 x이다. 오른쪽 직선이 l과 m 사이에서 잘린 길이는 ${a2}, m과 n 사이에서 잘린 길이는 ${b2}이다.`),
        explain: `왼쪽 직선이 ${LV('l')}과 ${LV('m')} 사이에서 잘린 길이는 ${X} − ${b1}이다. (${X} − ${b1}) : ${b1} = ${a2} : ${b2}에서 ${X} − ${b1} = ${a1}이므로 ${X} = ${a1 + b1}이다.`,
        facts: { calc: [[`${b1}*${a2}/${b2}+${b1}`, 0]] }
      });
    }),
    T('lines-cross-on', '가운데 평행선 위에서 만나는 두 직선', '①21', (d) => {
      // 한 직선의 길이 a1(l~m), x(m~n)와 다른 직선의 길이 a2, b2. x = a1 × b2 ÷ a2 는 정수가 아니다.
      const v = d.until(() => {
        const [p, q] = d.pick(RATIOS.filter((r) => r[0] >= 2)), w = d.int(1, 4), a1 = d.int(3, 14), a2 = p * w, b2 = q * w;
        const st = strips([p, q], LMN, [{ a: a1, dir: 1, marks: [[0, 1, a1, 'l'], [1, 2, SX, 'r']] }, { a: a2, dir: -1, cross: p, marks: [[0, 1, a2, 'r'], [1, 2, b2, 'l']] }], { steep: 1.15 });
        return { p, q, a1, a2, b2, st };
      }, (x) => (x.a1 * x.q) % x.p !== 0 && x.a1 !== x.a2 && Math.max(x.a1 / x.a2, x.a2 / x.a1) <= 1.5 && Math.max(x.a2, x.b2) <= 20 && x.a1 * x.q / x.p <= 20 && Math.min(x.a1, x.a2, x.b2) >= 3 && x.st.low >= 32 && !x.st.b.clash());
      const { a1, a2, b2 } = v, g = gcd(a1 * b2, a2), top = a1 * b2 / g, bottom = a2 / g;
      return F(`그림과 같이 평행한 세 직선 ${lmn}과 만나는 두 직선이 직선 ${LV('m')} 위에서 서로 만날 때, ${X}의 값은?`, top, bottom, {
        improper: top > bottom, anyForm: true,
        figure: v.st.b.svg(`${LMN_SAID} 두 직선이 세 직선과 만나고, 두 직선은 직선 m 위의 한 점에서 서로 만난다. 직선 l과 왼쪽에서 만나는 직선이 l과 m 사이에서 잘린 길이는 ${a1}, m과 n 사이에서 잘린 길이는 x이다. 직선 l과 오른쪽에서 만나는 직선이 l과 m 사이에서 잘린 길이는 ${a2}, m과 n 사이에서 잘린 길이는 ${b2}이다.`),
        explain: `평행선 사이에서 잘린 선분의 길이의 비는 같으므로 ${a1} : ${X} = ${a2} : ${b2}이다. ${X} = ${a1} × ${b2} ÷ ${a2} = ${frac(top, bottom)}이다.`,
        facts: { value: `${a1}*${b2}/${a2}` }
      });
    }),
    T('lines-three', '세 평행선과 세 직선', '①23', (d) => {
      // 세 직선이 잘린 길이의 배가 크면 그림이 휴대폰 너비를 넘는다: 8 : 9 : 10 인 세 직선만 쓴다.
      const v = d.until(() => {
        const [p, q] = d.pick([[1, 2], [2, 1], [2, 3], [3, 2], [1, 3], [3, 1]]), [u, w, z] = d.shuffle([8, 9, 10]), a1 = p * u, b1 = q * u, a2 = p * w, x = q * w, y = p * z, b3 = q * z, dir = d.pick([1, -1]);
        const st = strips([p, q], LMN, [{ a: a1, dir, marks: [[0, 1, a1, 'l'], [1, 2, b1, 'l']] }, { a: a2, dir, marks: [[0, 1, a2, 'r'], [1, 2, SX, 'r']] }, { a: y, dir, marks: [[0, 1, SY, 'r'], [1, 2, b3, 'r']] }], { w: 224, gap: 40, steep: 1.03 });
        return { a1, b1, a2, x, y, b3, st };
      }, (v2) => v2.st.low >= 32 && !v2.st.b.clash());
      const { a1, b1, a2, x, y, b3 } = v;
      return two(`그림과 같이 평행한 세 직선 ${lmn}이 세 직선과 만날 때, ${X}, ${Y}의 값을 각각 구하시오.`, [[X, x, ''], [Y, y, '']], {
        figure: v.st.b.svg(`${LMN_SAID} 세 직선이 이들과 만난다. 왼쪽 직선이 l과 m 사이에서 잘린 길이는 ${a1}, m과 n 사이에서 잘린 길이는 ${b1}이다. 가운데 직선이 l과 m 사이에서 잘린 길이는 ${a2}, m과 n 사이에서 잘린 길이는 x이다. 오른쪽 직선이 l과 m 사이에서 잘린 길이는 y, m과 n 사이에서 잘린 길이는 ${b3}이다.`),
        explain: `평행선 사이에서 잘린 선분의 길이의 비는 같다. ${a1} : ${b1} = ${a2} : ${X}에서 ${X} = ${x}이고, ${a1} : ${b1} = ${Y} : ${b3}에서 ${Y} = ${y}이다.`,
        facts: { calc: [[`${b1}*${a2}/${a1}`, 0], [`${a1}*${b3}/${b1}`, 1]] }
      });
    }),
    T('lines-four', '네 평행선과 두 직선', '①24', (d) => {
      const v = d.until(() => {
        const [g1, g2, g3] = d.pick([[3, 2, 2], [4, 3, 3], [5, 4, 4], [4, 5, 5], [3, 4, 4], [2, 3, 3], [4, 3, 5], [3, 4, 5], [4, 5, 3], [3, 2, 4], [4, 3, 2], [3, 4, 2], [2, 3, 4], [2, 1, 3], [3, 1, 2]]), [u, w] = d.pick(PAIRS), dir = d.pick([1, -1]);
        const st = strips([g1, g2, g3], KLMN, [{ a: g1 * u, dir, marks: [[0, 1, g1 * u, 'l'], [1, 2, g2 * u, 'l'], [2, 3, SY, 'l']] }, { a: g1 * w, dir, marks: [[0, 1, g1 * w, 'r'], [1, 2, SX, 'r'], [2, 3, g3 * w, 'r']] }], { h: 150, w: 200 });
        return { g1, g2, g3, u, w, st };
      }, (x) => Math.max(x.g1, x.g2, x.g3) * Math.max(x.u, x.w) <= 30 && x.st.low >= 30 && !x.st.b.clash());
      const { g1, g2, g3, u, w } = v;
      return two(`그림과 같이 평행한 네 직선 ${LV('k')}, ${lmn}이 두 직선과 만날 때, ${X}, ${Y}의 값을 각각 구하시오.`, [[X, g2 * w, ''], [Y, g3 * u, '']], {
        figure: v.st.b.svg(`평행한 네 직선 k, l, m, n이 위에서부터 이 차례로 가로로 놓여 있고, 두 직선이 이들과 만난다. 왼쪽 직선이 k와 l 사이에서 잘린 길이는 ${g1 * u}, l과 m 사이에서 잘린 길이는 ${g2 * u}, m과 n 사이에서 잘린 길이는 y이다. 오른쪽 직선이 k와 l 사이에서 잘린 길이는 ${g1 * w}, l과 m 사이에서 잘린 길이는 x, m과 n 사이에서 잘린 길이는 ${g3 * w}이다.`),
        explain: `평행선 사이에서 잘린 선분의 길이의 비는 같다. ${g1 * u} : ${g2 * u} = ${g1 * w} : ${X}에서 ${X} = ${g2 * w}이고, ${g1 * u} : ${Y} = ${g1 * w} : ${g3 * w}에서 ${Y} = ${g3 * u}이다.`,
        facts: { calc: [[`${g2 * u}*${g1 * w}/${g1 * u}`, 0], [`${g1 * u}*${g3 * w}/${g1 * w}`, 1]] }
      });
    })
  ]);

  // ── 사다리꼴에서 평행선과 선분의 길이의 비 ──
  const TRAP_SAID = '사다리꼴 ABCD. 윗변 AD와 아랫변 BC가 가로로 놓여 있다. 점 E는 변 AB 위에, 점 F는 변 DC 위에 있고 선분 EF가 그어져 있다. 변 AD, 선분 EF, 변 BC에 평행하다는 표시가 있다.';
  const TRAP_LEAD = `${par('AD', 'EF', 'BC')}인 사다리꼴 ABCD에서 두 점 E, F는 각각 변 AB, DC 위의 점이다.`;
  B.addTypes(UNIT, 'trap', [
    T('trap-ef', '사다리꼴의 두 밑변에 평행한 선분의 길이', '①25 ①26', (d, n) => {
      const v = d.until(() => {
        const [i, j] = d.pick(RATIOS), u = d.int(1, 5), w = d.int(1, 4), ad = d.int(3, 10), s = i + j, bc = ad + s * w, ab = s * u, P0 = trapBy(ad, bc, ab, d.pick([0.3, 0.45, 0.6]));
        Object.assign(P0, { E: lerp(P0.A, P0.B, i / s), F: lerp(P0.D, P0.C, i / s) });
        const fig = Fig(P0, [170, 132], { hub: 'ABCD' }).poly('ABCD').seg('EF').arrow('AD BC').arrow('EF', 1, n === 0 ? 0.5 : 0.82).name('ABCDEF').len('AD', cm(ad)).len('AE', cm(i * u)).len('EB', cm(j * u));
        if (n === 0) fig.len('BC', cm(bc)); else fig.len('EF', cm(ad + i * w), 'A');
        return { i, j, u, w, ad, s, bc, ab, fig };
      }, (x) => x.bc <= 24 && x.ab <= 20 && x.ab >= 0.55 * x.bc && x.ab <= 1.2 * x.bc && !x.fig.clash());
      const { i, j, u, w, ad, s, bc, ab } = v, ef = ad + i * w;
      if (n === 1) return lenQ(`${TRAP_LEAD} ${eq('AD', ad)}, ${eq('EF', ef)}, ${eq('AE', i * u)}, ${eq('EB', j * u)}일 때, ${SG('BC')}의 길이는?`, bc, {
        figure: v.fig.svg(`${TRAP_SAID} AD = ${cm(ad)}, EF = ${cm(ef)}, AE = ${cm(i * u)}, EB = ${cm(j * u)}`),
        explain: `점 A를 지나고 ${SG('DC')}에 평행한 직선이 ${SG('EF')}, ${SG('BC')}와 만나는 점을 각각 G, H라 하면 ${SG('GF')} = ${SG('HC')} = ${SG('AD')} = ${ad} cm이고 ${SG('EG')} = ${ef} − ${ad} = ${i * w}(cm)이다. △ABH에서 ${par('EG', 'BH')}이므로 ${SG('EG')} : ${SG('BH')} = ${SG('AE')} : ${SG('AB')} = ${i * u} : ${ab}이고 ${SG('BH')} = ${s * w} cm이다. ${SG('BC')} = ${s * w} + ${ad} = ${bc}(cm)이다.`,
        facts: { calc: [[`${ad}+(${ef}-${ad})*(${i * u}+${j * u})/${i * u}`, 0]] }
      });
      return lenQ(`${TRAP_LEAD} ${eq('AD', ad)}, ${eq('BC', bc)}, ${eq('AE', i * u)}, ${eq('EB', j * u)}일 때, ${SG('EF')}의 길이는?`, ef, {
        figure: v.fig.svg(`${TRAP_SAID} AD = ${cm(ad)}, BC = ${cm(bc)}, AE = ${cm(i * u)}, EB = ${cm(j * u)}`),
        explain: `점 A를 지나고 ${SG('DC')}에 평행한 직선이 ${SG('EF')}, ${SG('BC')}와 만나는 점을 각각 G, H라 하면 ${SG('GF')} = ${SG('HC')} = ${SG('AD')} = ${ad} cm이고 ${SG('BH')} = ${bc} − ${ad} = ${s * w}(cm)이다. △ABH에서 ${par('EG', 'BH')}이므로 ${SG('EG')} : ${SG('BH')} = ${SG('AE')} : ${SG('AB')} = ${i * u} : ${ab}이고 ${SG('EG')} = ${i * w} cm이다. ${SG('EF')} = ${i * w} + ${ad} = ${ef}(cm)이다.`,
        facts: { calc: [[`${ad}+(${bc}-${ad})*${i * u}/(${i * u}+${j * u})`, 0]] }
      });
    }, { count: 2 }),
    T('trap-diag', '사다리꼴의 대각선이 평행한 선분을 나눈 두 길이', '심17 ①25', (d) => {
      const v = d.until(() => {
        const [i, j] = d.pick(RATIOS), u = d.int(1, 5), w1 = d.int(2, 5), w2 = d.int(1, 4), s = i + j, ad = s * w2, bc = s * w1, ab = s * u, P0 = trapBy(ad, bc, ab, d.pick([0.3, 0.45, 0.6]));
        Object.assign(P0, { E: lerp(P0.A, P0.B, i / s), F: lerp(P0.D, P0.C, i / s) }); P0.G = meet(P0.A, P0.C, P0.E, P0.F);
        const fig = Fig(P0, [170, 132], { hub: 'ABCD' }).poly('ABCD').seg('EF AC').arrow('AD BC').arrow('EF', 1, 0.8).name('ABCDEF').free('G', 'ACEF').len('AD', cm(ad)).len('BC', cm(bc)).len('AE', cm(i * u)).len('EB', cm(j * u));
        return { i, j, u, w1, w2, s, ad, bc, ab, fig };
      }, (x) => x.w2 < x.w1 && x.bc <= 24 && x.ab <= 20 && x.ab >= 0.55 * x.bc && x.ab <= 1.2 * x.bc && x.j * x.w2 * 170 / x.bc >= 24 && !x.fig.clash());
      const { i, j, u, w1, w2, ad, bc, ab } = v;
      return two(`${TRAP_LEAD} 대각선 AC와 ${SG('EF')}가 만나는 점을 G라 하자. ${eq('AD', ad)}, ${eq('BC', bc)}, ${eq('AE', i * u)}, ${eq('EB', j * u)}일 때, ${jo('EG', '과/와')} ${SG('GF')}의 길이를 각각 구하시오.`, [[SG('EG'), i * w1], [SG('GF'), j * w2]], {
        figure: v.fig.svg(`${TRAP_SAID} 대각선 AC가 그어져 있고 선분 EF와 점 G에서 만난다. AD = ${cm(ad)}, BC = ${cm(bc)}, AE = ${cm(i * u)}, EB = ${cm(j * u)}`),
        explain: `${SG('AB')} = ${i * u} + ${j * u} = ${ab}(cm)이다. △ABC에서 ${par('EG', 'BC')}이므로 ${SG('EG')} : ${SG('BC')} = ${SG('AE')} : ${SG('AB')} = ${i * u} : ${ab}이고 ${SG('EG')} = ${i * w1} cm이다. △ACD에서 ${par('GF', 'AD')}이므로 ${SG('GF')} : ${SG('AD')} = ${SG('CF')} : ${SG('CD')} = ${SG('BE')} : ${SG('BA')} = ${j * u} : ${ab}이고 ${SG('GF')} = ${j * w2} cm이다.`,
        facts: { calc: [[`${bc}*${i * u}/(${i * u}+${j * u})`, 0], [`${ad}*${j * u}/(${i * u}+${j * u})`, 1]] }
      });
    }),
    T('trap-poles', '평행한 두 선분의 끝을 엇갈리게 이은 선분의 교점을 지나는 평행선', '①30', (d, n) => {
      // AB ∥ EF ∥ DC. 두 선분 AB, DC 가 선분 BC 위에 서 있고 AC 와 BD 가 점 E 에서 만난다. BF : FC = BE : ED = AB : DC, EF = AB × DC ÷ (AB + DC)
      const [a, b, w] = n === 0
        ? d.pick([[4, 6], [6, 4], [8, 12], [12, 8], [2, 3], [6, 9], [9, 6], [3, 4], [6, 10], [10, 6], [5, 10], [10, 5], [6, 8], [8, 6], [3, 5], [4, 10], [8, 10]]).concat([0])
        : d.pick([[6, 12, 18], [12, 6, 18], [3, 6, 9], [6, 3, 9], [4, 12, 12], [12, 4, 16], [10, 15, 15], [15, 10, 20], [6, 12, 12], [4, 12, 16], [8, 24, 20], [12, 24, 21], [10, 15, 20], [6, 3, 12]]);
      const width = w || Math.max(a, b) * 1.25, P0 = { A: [0, a], B: [0, 0], C: [width, 0], D: [width, b] };
      P0.E = meet(P0.A, P0.C, P0.B, P0.D); P0.F = [P0.E[0], 0];
      const fig = Fig(P0, [160, 128]).seg('AB BC DC AC BD EF').arrow('BA CD', 1, 0.25).arrow('FE', 1, 0.4).name('ABCD').name('F', 270).free('E', 'ABCDF').len('AB', cm(a)).len('DC', cm(b));
      const said = '가로로 놓인 선분 BC의 두 끝에 선분 AB와 선분 DC가 위로 서 있다. 선분 AC와 선분 BD가 점 E에서 만나고, 점 E에서 선분 BC 위의 점 F까지 선분 EF가 그어져 있다. 선분 AB, 선분 EF, 선분 DC에 평행하다는 표시가 있다.';
      const lead = `그림에서 ${par('AB', 'EF', 'DC')}이고, 점 E는 ${jo('AC', '과/와')} ${SG('BD')}의 교점, 점 F는 ${SG('BC')} 위의 점이다.`, g = gcd(a, b);
      const why = `${par('AB', 'DC')}이므로 ${SG('BE')} : ${SG('ED')} = ${SG('AB')} : ${SG('DC')} = ${a} : ${b}${g > 1 ? ` = ${a / g} : ${b / g}` : ''}이다. △BCD에서 ${par('EF', 'DC')}이므로`;
      if (n === 0) return lenF(`${lead} ${eq('AB', a)}, ${eq('DC', b)}일 때, ${SG('EF')}의 길이는?`, a * b, a + b, {
        figure: fig.svg(`${said} AB = ${cm(a)}, DC = ${cm(b)}`),
        explain: `${why} ${SG('EF')} : ${SG('DC')} = ${SG('BE')} : ${SG('BD')} = ${a / g} : ${(a + b) / g}이다. ${SG('EF')} = ${b} × ${frac(a / g, (a + b) / g)} = ${frac(a * b / gcd(a * b, a + b), (a + b) / gcd(a * b, a + b))}(cm)이다.`,
        facts: { value: `${a}*${b}/(${a}+${b})` }
      });
      return two(`${lead} ${eq('AB', a)}, ${eq('DC', b)}, ${eq('BC', w)}일 때, ${jo('BF', '과/와')} ${SG('EF')}의 길이를 각각 구하시오.`, [[SG('BF'), w * a / (a + b)], [SG('EF'), a * b / (a + b)]], {
        figure: fig.bow('BC', cm(w), 26).svg(`${said} AB = ${cm(a)}, DC = ${cm(b)}, BC = ${cm(w)}`),
        explain: `${why} ${SG('BF')} : ${SG('FC')} = ${SG('BE')} : ${SG('ED')} = ${a / g} : ${b / g}이고 ${SG('BF')} = ${w} × ${frac(a / g, (a + b) / g)} = ${w * a / (a + b)}(cm)이다. 또 ${SG('EF')} : ${SG('DC')} = ${SG('BE')} : ${SG('BD')} = ${a / g} : ${(a + b) / g}이므로 ${SG('EF')} = ${b} × ${frac(a / g, (a + b) / g)} = ${a * b / (a + b)}(cm)이다.`,
        facts: { calc: [[`${w}*${a}/(${a}+${b})`, 0], [`${a}*${b}/(${a}+${b})`, 1]] }
      });
    }, { count: 2 }),
    T('trap-poles-back', '교점을 지나는 평행한 선분의 길이로 한 선분 구하기', '①31', (d) => {
      const [b, e, a] = d.pick([[6, 2, 3], [12, 4, 6], [12, 3, 4], [15, 6, 10], [10, 6, 15], [6, 4, 12], [20, 4, 5], [9, 6, 18], [12, 8, 24], [15, 10, 30]]);
      const v = d.until(() => {
        const width = Math.max(a, b) * d.pick([1.1, 1.25, 1.4, 1.55]), P0 = { A: [0, a], B: [0, 0], C: [width, 0], D: [width, b] }; P0.E = meet(P0.A, P0.C, P0.B, P0.D); P0.F = [P0.E[0], 0];
        const fig = Fig(P0, [176, 136]).seg('AB BC DC AC BD EF').arrow('BA CD', 1, 0.25).arrow('FE', 1, 0.3).name('ABCD').name('F', 270).free('E', 'ABCDF').len('DC', cm(b)).len('EF', cm(e), a > b ? 'D' : 'A', { t: 0.7 });
        return { fig };
      }, (x) => !x.fig.clash());
      const g = gcd(e, b);
      return lenQ(`그림에서 ${par('AB', 'EF', 'DC')}이고, 점 E는 ${jo('AC', '과/와')} ${SG('BD')}의 교점, 점 F는 ${SG('BC')} 위의 점이다. ${eq('DC', b)}, ${eq('EF', e)}일 때, ${SG('AB')}의 길이는?`, a, {
        figure: v.fig.svg(`가로로 놓인 선분 BC의 두 끝에 선분 AB와 선분 DC가 위로 서 있다. 선분 AC와 선분 BD가 점 E에서 만나고, 점 E에서 선분 BC 위의 점 F까지 선분 EF가 그어져 있다. 선분 AB, 선분 EF, 선분 DC에 평행하다는 표시가 있다. DC = ${cm(b)}, EF = ${cm(e)}`),
        explain: `△BCD에서 ${par('EF', 'DC')}이므로 ${SG('BF')} : ${SG('BC')} = ${SG('EF')} : ${SG('DC')} = ${e / g} : ${b / g}이고, ${SG('FC')} : ${SG('BC')} = ${(b - e) / g} : ${b / g}이다. △ABC에서 ${par('EF', 'AB')}이므로 ${SG('EF')} : ${SG('AB')} = ${SG('CF')} : ${SG('CB')} = ${(b - e) / g} : ${b / g}이다. ${SG('AB')} = ${e} × ${frac(b / g, (b - e) / g)} = ${a}(cm)이다.`,
        facts: { calc: [[`${e}*${b}/(${b}-${e})`, 0]] }
      });
    })
  ]);

  // 같은 단원의 다른 파일(8-2-4b.js, 8-2-4c.js)이 함께 쓰는 도구
  B.kit.m824 = { glue, glued,
    UNIT, STD, src, T, X, Y, cm, eq, par, jo, simple, fracOrInt, xcm, tidy, lenQ, areaQ, lenF, two, ratioQ, sayQ, lerp, pol, plus, sss, sas, sab, angAt, fine, cen, cutOf, bowOn, Fig, cutFig, CUT_SAID, CUT_LEAD,
    strips, LV, trapOf, trapBy, RATIOS
  };
})(typeof window !== 'undefined' ? window : globalThis);
