// 중학교 1학년 2학기 1단원 기본 도형 — 단원 틀·그림 도구와 앞쪽 묶음(점·선·면, 직선·반직선·선분, 두 점 사이의 거리와 중점, 각, 맞꼭지각, 수직과 수선).
// 수집해 둔 교과서 3종(미래엔 황선욱, 천재 김동재·김화경)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1·2: 79·76꼴, 심화꼴 60꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/7-2-1/싣기_대조표.md 에 있다.
// (위치 관계와 평행선 묶음은 7-2-1b.js 에, 실력 문항은 7-2-1c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 도형과 측정. 성취기준은 9수03-01(점, 선, 면, 각과 점·직선·평면의 위치 관계), 9수03-02(평행선에서 동위각과 엇각의 성질)이다.
//
// 싣는 기준
//  - 이 단원에서 새로 배우는 것을 쓰는 꼴만 싣는다: 교점·교선, 직선·반직선·선분의 기호, 두 점 사이의 거리와 중점, 평각과 각의 기호(∠AOB), 맞꼭지각,
//    직교·수선의 발·점과 직선 사이의 거리·수직이등분선, 꼬인 위치를 포함한 위치 관계, 동위각·엇각과 평행선의 성질.
//    초등 3·4학년의 선분·직선 가리기와 각도 재기, 5·6학년의 면·모서리 세기를 말만 바꾸어 다시 싣지 않는다(평각에서 남은 각 하나를 구하는 꼴은 각을 기호로 읽어 구하는 꼴로 묶었다).
//  - 하는 일이 다르면 다른 문제다: 주는 것(그림·기호·문장), 묻는 것(값·개수·고르기·모두 고르기)이 다르면 따로 싣는다. 입체나 수만 바꾼 것은 한 유형의 차례로 묶는다.
//  - 답: 각도는 °, 길이는 cm, 개수는 개. 모서리·면·각의 이름이나 기호를 쓴 식이 답인 꼴은 고르기(「모두 고른 것」)로 바꾸었다. 부호 단추는 쓰지 않는다.
//  - 도형은 수치대로 그린다(각과 길이에서 좌표를 셈한다). 묻는 각은 그림에 적힌 수치로 정해진다.
//  - 입체에서 모서리끼리, 모서리와 면, 면끼리의 위치 관계는 꼭짓점의 3차원 좌표로 셈한다(모서리는 한없이 늘인 직선, 면은 넓힌 평면으로 본다).
//    기본 문항은 「늘여야 만나는」 모서리·면이 답에 끼지 않는 것만 묻고, 그것을 가려내는 일은 실력에 두었다.
//  - 용어와 기호는 교육과정의 것(교점, 교선, 두 점 사이의 거리, 중점, 수직이등분선, 꼬인 위치, 교각, 맞꼭지각, 엇각, 동위각, 평각, 직교, 수선의 발, ∠, ⊥, ∥)을 쓴다.
//  - 꼴 목록에 적힌 원문 답지의 잘못은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(7-2-1b.js, 7-2-1c.js 의 것까지 여기에 모아 적는다)
//  - 상위 학년·뒤 단원·교육과정 밖: 평면이 정해지는 조건(①47 심7), 피타고라스 정리가 있어야 하는 직선 거리(②11), 정오각형의 대각선과 변이 평행함을 쓰는 단면(심30 — 7-2-3),
//    볼록하지 않은 입체(심35 — 교육과정 「다각형과 다면체는 그 모양이 볼록인 경우만 다룬다」), 대칭이동(심60).
//  - 이미 실린 유형과 하는 일이 같은 것: 차만 나오는 두 문자(심19 → angle-flat-x. ①33·②31의 x − y 는 값이 정해지는 수 문제로 바꾸어 실었다), 네 직선의 맞꼭지각(심23 → hard-vert-pairs, 직선 수만 다르다),
//    세 평행선에서 엇각을 두 번 읽는 것(②65 → para-one).
//  - 요령이 이 단원의 성질에서 나오지 않는 것: 잘린 면이 정삼각형임을 알아채어 구하는 60°(①57 심33의 ∠BCF).
//  - 쪽 그림에서도 그림을 알 수 없는 것: ②33 ②64 ②65 심48 심52, ①73의 세 평행선, ①67의 직선 넷, ①78의 종이 띠.
//  - 초등에서 이미 실은 문제: 겹친 두 직각(심18 — 4-1-2 실력), 전개도를 접을 때 겹치는 꼭짓점·평행한 면만 묻는 것(심36, 심38의 발18 — 5-2-5).
//  - 같은 일이어서 한 번만 실은 것: 평각에서 남은 각 하나(①25 ②21 → angle-read), 동위각을 두 직선에서 되풀이하는 것(①72), 눕힌 삼각기둥·그림만 다른 사다리꼴(①55 ②37 심31),
//    반원 위의 점으로 만드는 직선(심6), 두 선분의 길이의 비(심12), 하나 건넌 세 각의 합(심20·21), 정오각기둥의 설명 가리기(심29), 겹친 종이 띠(심56 — 평행선 두 쌍).
// 다시 실은 것(처음에는 꼬임·경우 따지기·조건 여럿·보조선 여럿·요령·그림 모름이라는 까닭으로 뺐다. 사용자: 「수학 실력에 필요해 보이는 문제는 다 넣어」)
//  - 기본(7-2-1b.js 끝): 서로 수직인 세 평면이 나누는 공간(심43), 평행한지 가린 다음 각 구하기(①68), 평행선에 걸친 정삼각형·정사각형(①73 ②66 심55), 평행한 두 거울(①79).
//  - 실력(7-2-1c.js 끝): 세 직선이 세 점에서 만날 때의 동위각·엇각(②59 심44), 중점 넷을 지나는 평면으로 자른 정육면체(심34), 사각뿔을 얹은 직육면체(①58),
//    조건 넷으로 방정식 세우기(①22), 합만 나오는 몇 배 조건(①29 ②25 심15), 좌표평면의 수선의 발과 넓이(①41), 넓이를 두 가지로 나타내는 거리(①40),
//    두 각을 같은 비로 나눈 선(①76 심53), 꺾인 각 안의 반직선과 배 조건(①76), 삼각형 안의 평행선과 각의 이등분(①77), 세 번 꺾인 선(②70 심51),
//    한쪽으로 불룩한 두 번 꺾임(심50), 양쪽을 접은 종이(①78의 지 20 ②76), 전개도로 만든 정육면체(①59 ②54 심37·38·39), 시계 바늘(심58·59).
//  - 서술형·활동: 둘레에서 위치 관계 찾아 말하기(②56 — 고르기로 바꾸어 실었다), 까닭 쓰기(①67·②71의 서술 부분).
//  - 뜻 없는 셈: 따로 구한 개수·각을 더하고 빼기(②3의 a + b + c, ①27의 ∠x − ∠y + ∠z, ①55·56·②47·53의 a + b). 하나하나 구하는 일은 실었다.
// 묻는 말: 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, N, M, C, F } = B.kit;
  const { LAB, V, nb, range, tagged, claimQ, over, LN, RY, SG } = B.kit.mid;
  const STD1 = '9수03-01', STD2 = '9수03-02';
  // 그림이 문제를 가르는 문항은 글이 같아도 다른 문제다. 그림(svg)이 있는 문항에는 유형과 차례의 이름을 facts.rule 에 달아 둔다.
  const ruled = (id, make) => (d, n) => { const it = make(d, n || 0); if (it.figure && /<svg/.test(it.figure) && !it.facts.rule) it.facts = Object.assign({}, it.facts, { rule: id + '#' + (n || 0) }); return it; };
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make: ruled(id, make) }, more || {});
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②32' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make: ruled(id, make) }, more || {});

  // ── 글 ──────────────────────────────────────────────────────
  // 로마자 이름 뒤의 토씨만 돌려준다(엘·엠·엔은 받침이 있다): pt('AB', '과/와') → '와', pt('l', '은/는') → '은'
  const pt = (name, pair) => { const [w, wo] = pair.split('/'), ch = String(name).slice(-1), fin = 'LMNRlmnr'.includes(ch); if (w === '으로') return fin && !'LlRr'.includes(ch) ? '으로' : '로'; return fin ? w : wo; };
  // 식의 글: '{x}' 는 문자. mh HTML, ms SVG, mp 그림 설명
  const IT = "font-style:italic;font-family:'MB Math','Times New Roman',serif;font-weight:400";
  const mh = (s) => String(s).replace(/\{([a-zA-Z])\}/g, (m, c) => V(c));
  const ms = (s) => String(s).replace(/\{([a-zA-Z])\}/g, (m, c) => `<tspan style="${IT};font-size:1.16em">${c}</tspan>`);
  const mp = (s) => String(s).replace(/[{}]/g, '');
  const ang = (name) => nb('∠' + name), angV = (c) => nb('∠' + V(c)), deg = (n) => n + '°';
  // 직선·반직선·선분의 기호(글자 위의 ↔, →, ―)는 공용 도구의 over, LN, RY, SG 를 쓴다.
  const sym = (kind, name) => over(kind, name);
  const list = (names) => names.join(', ');

  // ── 보기 짜기 ────────────────────────────────────────────────
  // 여럿을 고르는 문제: labels 가운데 flags 가 참인 것을 모두 고른 것 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋.
  // o: { figure, explain, show(이름 → 보기 글), traps: [꼭 넣을 틀린 묶음], facts }
  function setQ(d, text, labels, flags, o) {
    const key = (set) => set.join('|'), right = labels.filter((_, i) => flags[i]), pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of (o.traps || []).concat(d.shuffle(pool))) { if (out.length === 4) break; if (cand.length && !seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const sets = d.shuffle(out), show = o.show || ((x) => x);
    return C(text, sets.map((set) => set.map(show).join(', ')), sets.findIndex((s) => key(s) === key(right)), { figure: o.figure, explain: o.explain, facts: Object.assign({ sets: { labels, flags, options: sets } }, o.facts || {}) });
  }
  // 설명 고르기: rows 는 { s 글, ok 참인가, why 바로잡는 말(틀린 설명), g 같은 것을 말하는 설명끼리의 이름 }. want 가 true 이면 옳은 것 하나, false 이면 옳지 않은 것 하나를 고른다.
  function sayQ(d, text, rows, want, o) {
    const opt = o || {}, picked = [], used = new Set();
    const take = (pool, k) => { for (const r of d.shuffle(pool)) { if (picked.filter((p) => p.ok === r.ok).length >= k) break; if (r.g && used.has(r.g)) continue; if (r.g) used.add(r.g); picked.push(r); } };
    take(rows.filter((r) => r.ok === want), 1); take(rows.filter((r) => r.ok !== want), 3);
    const shown = d.shuffle(picked), at = shown.findIndex((r) => r.ok === want);
    if (shown.length !== 4) throw new Error('설명이 모자란다');
    const why = want ? shown.filter((r) => !r.ok).map((r) => r.why).join(' ') : shown[at].why;
    return C(text, shown.map((r) => r.s), at, { figure: opt.figure, explain: (opt.lead ? opt.lead + ' ' : '') + why, facts: { truth: shown.map((r) => r.ok), want } });
  }
  // ㉠, ㉡, … 을 붙인 설명 가운데 옳은 것을 모두 고르기. rows 는 { s, ok, why }.
  function tagQ(d, text, rows, o) {
    const opt = o || {}, tags = LAB.slice(0, rows.length), wrong = rows.map((r, i) => (r.ok ? '' : tags[i] + ' ' + r.why)).filter(Boolean).join(' ');
    return setQ(d, text, tags, rows.map((r) => r.ok), { figure: (opt.figure || '') + tagged(rows.map((r) => r.s), tags), explain: (opt.lead ? opt.lead + ' ' : '') + wrong + ` 따라서 옳은 것은 ${list(tags.filter((_, i) => rows[i].ok))}이다.`, traps: opt.traps });
  }
  // 조건에 맞게 옳은 것·틀린 것을 섞어 k 개 고른다(옳은 것과 틀린 것이 적어도 하나씩). 같은 것을 말하는 설명(g)은 하나만.
  function mixRows(d, rows, k) {
    return d.until(() => { const out = [], used = new Set(); for (const r of d.shuffle(rows)) { if (out.length === k) break; if (r.g && used.has(r.g)) continue; if (r.g) used.add(r.g); out.push(r); } return out; },
      (out) => out.length === k && out.some((r) => r.ok) && out.some((r) => !r.ok));
  }

  // ── 그림: 판(좌표는 수학에서처럼 위쪽이 +) ─────────────────────
  const f1 = (n) => Math.round(n * 10) / 10, RAD = Math.PI / 180;
  const pol = (p, a, r) => [p[0] + r * Math.cos(a * RAD), p[1] + r * Math.sin(a * RAD)];
  const dirOf = (p, q) => (Math.atan2(q[1] - p[1], q[0] - p[0]) / RAD + 360) % 360;
  const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const mid2 = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const segGap = (p, a, b) => { const rx = b[0] - a[0], ry = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * rx + (p[1] - a[1]) * ry) / (rx * rx + ry * ry || 1))); return Math.hypot(p[0] - a[0] - rx * t, p[1] - a[1] - ry * t); };
  // 글의 너비(어림): 한글은 글자 크기만큼, 숫자·로마자·기호는 그 0.56배
  const wide = (text, size) => Array.from(mp(String(text))).reduce((s, ch) => s + (/[가-힣㉠-㉯]/.test(ch) ? 1 : ch === ' ' ? 0.3 : 0.56), 0) * size;
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const CREAM = '#fff8e1', BLUE = '#1d4ed8';
  // 그릴 것을 모으며 차지한 자리를 재어, 끝에 꼭 맞는 크기의 그림으로 낸다.
  function sheet() {
    const parts = []; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const see = (x, y, m) => { const k = m || 0; x0 = Math.min(x0, x - k); x1 = Math.max(x1, x + k); y0 = Math.min(y0, -y - k); y1 = Math.max(y1, -y + k); };
    const X = (p) => f1(p[0]), Y = (p) => f1(-p[1]);
    const S = {
      add(html) { parts.push(html); return S; },
      see(p, m) { see(p[0], p[1], m); return S; },
      // 선분. kind: ''(실선), 'dash'(점선), 'thin'(가는 선)
      seg(p, q, kind, css) { see(p[0], p[1], 1); see(q[0], q[1], 1); parts.push(`<line class="mb-line${kind === 'dash' ? ' is-cut' : kind === 'thin' ? ' is-thin' : ''}"${css ? ` style="${css}"` : ''} x1="${X(p)}" y1="${Y(p)}" x2="${X(q)}" y2="${Y(q)}"/>`); return S; },
      poly(pts, css) { pts.forEach((p) => see(p[0], p[1], 1)); parts.push(`<polygon points="${pts.map((p) => X(p) + ',' + Y(p)).join(' ')}" style="${css}"/>`); return S; },
      dot(p, r) { see(p[0], p[1], 3); parts.push(`<circle class="mb-dot" cx="${X(p)}" cy="${Y(p)}" r="${r || 2.6}"/>`); return S; },
      // 글. o: { small(각의 크기·길이: 12px 파란 글씨), size, css }
      text(p, t, o) {
        const opt = o || {}, size = opt.size || (opt.small ? 12 : 13), hw = wide(t, size) / 2 + 1;
        see(p[0] - hw, p[1] - size * 0.62); see(p[0] + hw, p[1] + size * 0.62);
        parts.push(`<text class="mb-label${opt.small ? ' is-length' : ''}" style="${HALO}${opt.size ? ';font-size:' + opt.size + 'px' : ''}${opt.css ? ';' + opt.css : ''}" x="${X(p)}" y="${Y(p)}" text-anchor="middle" dominant-baseline="central">${ms(t)}</text>`); return S;
      },
      // 점 p 에서 a 쪽으로 dd 만큼 떨어진 자리에 이름을 적는다.
      name(p, t, a, dd) { return S.text(pol(p, a, dd == null ? 11 : dd), t); },
      // 호: v 를 중심으로 a0° 에서 a1° 까지 시계 반대쪽으로
      arc(v, a0, a1, r) { const p = pol(v, a0, r), q = pol(v, a1, r); parts.push(`<path class="mb-line is-thin" style="fill:none" d="M${X(p)} ${Y(p)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${X(q)} ${Y(q)}"/>`); return S; },
      // 직각 표시: a0° 쪽 변과 a0 + 90° 쪽 변 사이
      right(v, a0, size) { const s = size || 8, p1 = pol(v, a0, s), p3 = pol(v, a0 + 90, s), p2 = [p1[0] + p3[0] - v[0], p1[1] + p3[1] - v[1]]; parts.push(`<polyline class="mb-mark" points="${[p1, p2, p3].map((p) => X(p) + ',' + Y(p)).join(' ')}"/>`); return S; },
      // 각 표시: 호와 그 안쪽의 글. a0° 에서 a1° 까지 시계 반대쪽으로. o: { r 호의 반지름, d 글까지의 거리, at 글의 자리(직접), arc: false }
      angle(v, a0, a1, t, o) {
        const opt = o || {}, span = a1 - a0, r = opt.r || (span < 40 ? 22 : span > 120 ? 12 : 15), m = (a0 + a1) / 2;
        if (opt.arc !== false) S.arc(v, a0, a1, r);
        if (t) {
          const hw = wide(t, 12) / 2 + 2, need = span < 170 ? (hw + 1) / Math.tan((span / 2) * RAD) : 0;
          S.text(opt.at ? [v[0] + opt.at[0], v[1] + opt.at[1]] : pol(v, m, opt.d || Math.max(r + 10, Math.min(need, 64))), t, { small: true });
        }
        return S;
      },
      // 길이 표시: p 에서 q 까지 점선으로 휜 선을 긋고 가운데에 글을 적는다. up 이 false 이면 반대쪽으로 휜다.
      span(p, q, t, up, bulge) {
        const L = dist(p, q), s = up === false ? -1 : 1, h = bulge || Math.min(15, 8 + L * 0.04), n = [-(q[1] - p[1]) / L * s, (q[0] - p[0]) / L * s], m = mid2(p, q), c = [m[0] + n[0] * h * 2, m[1] + n[1] * h * 2];
        see(m[0] + n[0] * h, m[1] + n[1] * h, 2);
        parts.push(`<path d="M${X(p)} ${Y(p)}Q${X(c)} ${Y(c)} ${X(q)} ${Y(q)}" style="fill:none;stroke:#5b6770;stroke-width:1;stroke-dasharray:2.5 2.5"/>`);
        return S.text([m[0] + n[0] * h, m[1] + n[1] * h], t, { small: true });
      },
      // 길이가 같다는 표시(작은 금 k 개)
      tick(p, q, k) { const m = mid2(p, q), a = dirOf(p, q); for (let i = 0; i < (k || 1); i += 1) { const c = pol(m, a, (i - ((k || 1) - 1) / 2) * 3.4); S.seg(pol(c, a + 90, 4), pol(c, a - 90, 4), 'thin'); } return S; },
      // 변 p–q 의 바깥쪽(c 의 반대쪽)에 길이를 적는다.
      side(p, q, t, c, gap) { const m = mid2(p, q), L = dist(p, q); let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L]; if ((m[0] - c[0]) * n[0] + (m[1] - c[1]) * n[1] < 0) n = [-n[0], -n[1]]; const hw = wide(t, 12) / 2 + 1, far = (gap == null ? 5 : gap) + hw * Math.abs(n[0]) + 7.5 * Math.abs(n[1]); return S.text([m[0] + n[0] * far, m[1] + n[1] * far], t, { small: true }); },
      size() { return [x1 - x0, y1 - y0]; },
      // 너비가 64px 에 못 미치는 그림은 양옆 여백을 넓힌다(화면 검사가 너무 좁은 그림을 떨어뜨린다).
      out(label, o) {
        const opt = o || {}, m = opt.pad == null ? 6 : opt.pad, side = Math.max(m, (64 - (x1 - x0)) / 2), w = x1 - x0 + side * 2, h = Math.max(y1 - y0 + m * 2, 24);
        return `<svg class="mb-geo" viewBox="${f1(x0 - side)} ${f1(y0 - m)} ${f1(w)} ${f1(h)}" width="${Math.ceil(w)}" role="img" aria-label="${label}">${parts.join('')}</svg>`;
      }
    };
    return S;
  }
  const tiles = (items) => '<div class="mb-tiles">' + items.map(([label, svg]) => '<figure class="mb-tile"><figcaption>' + label + '</figcaption>' + svg + '</figure>').join('') + '</div>';

  // 한 직선 위의 점들. names: 왼쪽부터의 이름, pos: 자리(길이 단위)
  // o: { w 그림 너비, ends: 'seg'(양 끝 점에서 끝나는 선분), lname 직선의 이름, spans: [[i, j, 글, 위인가]], ticks: [[i, j, 금의 수]], say 덧붙일 말 }
  function onLine(names, pos, o) {
    const opt = o || {}, total = pos[pos.length - 1] - pos[0], u = (opt.w || 228) / total, S = sheet(), at = (i) => [(pos[i] - pos[0]) * u, 0], ext = opt.ends === 'seg' ? 0 : 16;
    S.seg([-ext, 0], [total * u + ext, 0]);
    (opt.ticks || []).forEach(([i, j, k]) => S.tick(at(i), at(j), k));
    names.forEach((name, i) => { S.dot(at(i)); S.text([at(i)[0], -13], name); });
    if (opt.lname) S.text([total * u + ext + 9, 0], '{' + opt.lname + '}');
    (opt.spans || []).forEach(([i, j, t, up]) => S.span(at(i), at(j), t, up !== false, up === false ? 26 : 0));
    const said = (opt.lname ? `직선 ${opt.lname} 위에` : opt.ends === 'seg' ? `선분 ${names[0]}${names[names.length - 1]} 위에` : '한 직선 위에') + ` 왼쪽부터 점 ${list(names)}${pt(names[names.length - 1], '이/가')} 차례로 있다.`
      + (opt.spans || []).map(([i, j, t]) => ` 점 ${names[i]}에서 점 ${names[j]}까지의 길이는 ${t}이다.`).join('')
      + (opt.ticks && opt.ticks.length ? ' ' + opt.ticks.map(([i, j]) => `선분 ${names[i]}${names[j]}`).join(', ') + '에 길이가 같다는 표시가 있다.' : '') + (opt.say ? ' ' + opt.say : '');
    return S.out(said);
  }

  // 한 점 O 에서 뻗은 선들. arms: [{ a 방향(도), len, name 끝 점의 이름, ns 이름을 적는 쪽(±90), vn 선의 이름(문자) }]
  // marks: [{ from, to, t, r, d, at } | { right: 시작 방향 }]. o: { oname, oat 이름 방향 }
  function star(arms, marks, o) {
    const opt = o || {}, S = sheet(), O = [0, 0];
    arms.forEach((m) => { const len = m.len || 80; S.seg(O, pol(O, m.a, len), m.dash ? 'dash' : ''); });
    (marks || []).forEach((m) => { if (m.right != null) S.right(O, m.right, 9); else S.angle(O, m.from, m.to, m.t, m); });
    arms.forEach((m) => {
      const len = m.len || 80;
      if (m.name) { const p = pol(O, m.a, len - 12); S.dot(p); S.name(p, m.name, m.a + (m.ns || 90), 11); }
      if (m.vn) S.text(pol(O, m.a, len + 9), '{' + m.vn + '}');
    });
    if (opt.oname) { S.dot(O, 2.4); S.name(O, opt.oname, opt.oat == null ? 270 : opt.oat, opt.od || 12); }
    return S;
  }

  // ── 그림: 입체도형(꼭짓점의 3차원 좌표 [가로 x, 안쪽 y, 높이 z]) ─────
  const sub3 = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]], dot3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const cross3 = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const avg3 = (pts) => [0, 1, 2].map((i) => pts.reduce((s, p) => s + p[i], 0) / pts.length);
  const zero3 = (v) => Math.abs(v[0]) + Math.abs(v[1]) + Math.abs(v[2]) < 1e-7;
  // 입체: V 꼭짓점(이름 → 좌표), faces 면(꼭짓점 이름을 둘레 차례로 적은 글), edges 모서리(두 글자, 가나다순)
  function makeSolid(kind, V3, faces, more) {
    const edges = [];
    faces.forEach((f) => { for (let i = 0; i < f.length; i += 1) { const e = [f[i], f[(i + 1) % f.length]].sort().join(''); if (!edges.includes(e)) edges.push(e); } });
    edges.sort();
    if (Object.keys(V3).length - edges.length + faces.length !== 2) throw new Error('입체의 얼개가 어긋났다: ' + kind);
    return Object.assign({ kind, V: V3, faces, edges }, more || {});
  }
  // 두 직선(두 점의 이름)의 위치 관계: 'meet' 한 점에서 만난다, 'para' 평행하다, 'skew' 꼬인 위치에 있다, 'same' 일치한다
  function relLL(sol, e, g) {
    const a = sol.V[e[0]], u = sub3(sol.V[e[1]], a), c = sol.V[g[0]], w = sub3(sol.V[g[1]], c), n = cross3(u, w);
    if (zero3(n)) return zero3(cross3(u, sub3(c, a))) ? 'same' : 'para';
    return Math.abs(dot3(sub3(c, a), n)) < 1e-7 ? 'meet' : 'skew';
  }
  const perpLL = (sol, e, g) => relLL(sol, e, g) === 'meet' && Math.abs(dot3(sub3(sol.V[e[1]], sol.V[e[0]]), sub3(sol.V[g[1]], sol.V[g[0]]))) < 1e-7;
  const normalOf = (sol, f) => cross3(sub3(sol.V[f[1]], sol.V[f[0]]), sub3(sol.V[f[2]], sol.V[f[0]]));
  // 직선과 평면: 'in' 포함된다, 'para' 평행하다, 'meet' 한 점에서 만난다
  function relLP(sol, e, f) {
    const n = normalOf(sol, f), u = sub3(sol.V[e[1]], sol.V[e[0]]);
    if (Math.abs(dot3(u, n)) > 1e-7) return 'meet';
    return Math.abs(dot3(sub3(sol.V[e[0]], sol.V[f[0]]), n)) < 1e-7 ? 'in' : 'para';
  }
  const perpLP = (sol, e, f) => zero3(cross3(sub3(sol.V[e[1]], sol.V[e[0]]), normalOf(sol, f)));
  // 두 평면: 'para' 평행하다, 'meet' 한 직선에서 만난다, 'same' 일치한다
  function relPP(sol, f, g) {
    const n = normalOf(sol, f), m = normalOf(sol, g);
    if (!zero3(cross3(n, m))) return 'meet';
    return Math.abs(dot3(sub3(sol.V[g[0]], sol.V[f[0]]), n)) < 1e-7 ? 'same' : 'para';
  }
  const perpPP = (sol, f, g) => Math.abs(dot3(normalOf(sol, f), normalOf(sol, g))) < 1e-7;
  const share = (x, y) => x.split('').some((c) => y.includes(c));
  const hasEdge = (f, e) => { const i = f.indexOf(e[0]), j = f.indexOf(e[1]); return i >= 0 && j >= 0 && (Math.abs(i - j) === 1 || Math.abs(i - j) === f.length - 1); };
  // 이 모서리와 만나는 모서리가 모두 끝점에서 만나는가(늘여야 만나는 모서리가 없는가)
  const cleanEdge = (sol, e) => sol.edges.every((g) => g === e || relLL(sol, e, g) !== 'meet' || share(e, g));
  const others = (sol, e) => sol.edges.filter((g) => g !== e);

  const BOXF = ['ABCD', 'EFGH', 'ABFE', 'BFGC', 'CGHD', 'AEHD'];
  // 윗면 ABCD(둘레 차례로 [x, y]), 그 바로 아래 EFGH 인 사각기둥
  const column4 = (kind, top, h, say, bottom) => { const V3 = {}; 'ABCD'.split('').forEach((k, i) => { V3[k] = [top[i][0], top[i][1], h]; const b = (bottom || top)[i]; V3['EFGH'[i]] = [b[0], b[1], 0]; }); return makeSolid(kind, V3, BOXF, { say }); };
  const BELOW4 = '꼭짓점 A, B, C, D의 아래에 차례로 꼭짓점 E, F, G, H가 있다';
  const SOL = {
    // 직육면체: 윗면 ABCD(A 왼쪽 뒤, B 왼쪽 앞, C 오른쪽 앞, D 오른쪽 뒤), 아랫면 EFGH
    box: (a, b, c) => column4('직육면체', [[0, b], [0, 0], [a, 0], [a, b]], c, '윗면은 사각형 ABCD, 아랫면은 사각형 EFGH이고 ' + BELOW4),
    // 밑면이 사다리꼴인 사각기둥(세운 것): 윗면 ABCD 에서 변 AD 와 변 BC 가 평행하고 AD 가 더 길다.
    trap: (c) => column4('밑면이 사다리꼴인 사각기둥', [[0, 2.2], [1.7, 0], [3.9, 0], [5.6, 2.2]], c || 3.4, '윗면은 사다리꼴 ABCD, 아랫면은 사다리꼴 EFGH이다. 윗면에서 변 AD와 변 BC가 평행하고 뒤쪽의 변 AD가 앞쪽의 변 BC보다 길다. ' + BELOW4),
    // 직육면체의 한쪽을 비스듬히 잘라 낸 사각기둥: 윗면 ABCD 가 아랫면 EFGH 보다 오른쪽이 짧아 면 CGHD 가 기울었다.
    slant: () => column4('직육면체의 한쪽을 비스듬히 잘라 낸 입체도형', [[0, 2.6], [0, 0], [2.5, 0], [2.5, 2.6]], 3, '윗면은 직사각형 ABCD, 아랫면은 직사각형 EFGH이고 ' + BELOW4 + '. 윗면이 아랫면보다 오른쪽으로 짧아서 오른쪽 면 CGHD가 기울어져 있다. 면 BFGC와 면 AEHD는 사다리꼴이다', [[0, 2.6], [0, 0], [4.4, 0], [4.4, 2.6]]),
    // 삼각기둥(세운 것): 윗면 ABC(A 뒤, B 왼쪽 앞, C 오른쪽 앞), 아랫면 DEF
    tri: (h) => makeSolid('삼각기둥', { A: [1.1, 3, h || 3.2], B: [0, 0, h || 3.2], C: [4, 0, h || 3.2], D: [1.1, 3, 0], E: [0, 0, 0], F: [4, 0, 0] }, ['ABC', 'DEF', 'ABED', 'BEFC', 'ADFC'], { say: '윗면은 삼각형 ABC, 아랫면은 삼각형 DEF이고 꼭짓점 A, B, C의 아래에 차례로 꼭짓점 D, E, F가 있다' }),
    // 눕힌 삼각기둥: 앞면이 ∠B 가 직각인 직각삼각형 ABC, 뒷면이 삼각형 DEF
    lying: (a, h, dp) => makeSolid('삼각기둥', { A: [0, 0, h], B: [0, 0, 0], C: [a, 0, 0], D: [0, dp, h], E: [0, dp, 0], F: [a, dp, 0] }, ['ABC', 'DEF', 'ABED', 'BEFC', 'ADFC'], { say: '앞쪽 밑면은 ∠ABC가 직각인 직각삼각형 ABC(A 위, B 왼쪽 아래, C 오른쪽 아래), 뒤쪽 밑면은 삼각형 DEF이고 꼭짓점 A, B, C의 뒤에 차례로 꼭짓점 D, E, F가 있다', rightAt: 'B' }),
    // 삼각뿔: 꼭짓점 A, 밑면 BCD(B 왼쪽, C 앞, D 오른쪽)
    tetra: () => makeSolid('삼각뿔', { A: [2.3, 1.1, 3.6], B: [0, 1.5, 0], C: [2, 0, 0], D: [4.4, 1.7, 0] }, ['ABC', 'ACD', 'ABD', 'BCD'], { say: '꼭짓점 A가 위에 있고 밑면은 삼각형 BCD(B 왼쪽, C 앞, D 오른쪽)이다' }),
    // 사각뿔: 꼭짓점 A, 밑면 BCDE(직사각형. B 왼쪽 앞, C 오른쪽 앞, D 오른쪽 뒤, E 왼쪽 뒤)
    pyr4: () => makeSolid('사각뿔', { A: [2, 1.3, 3.6], B: [0, 0, 0], C: [4, 0, 0], D: [4, 2.6, 0], E: [0, 2.6, 0] }, ['ABC', 'ACD', 'ADE', 'AEB', 'BCDE'], { say: '꼭짓점 A가 위에 있고 밑면은 직사각형 BCDE(B 왼쪽 앞, C 오른쪽 앞, D 오른쪽 뒤, E 왼쪽 뒤)이다' }),
    // 정 k 각기둥: 윗면의 꼭짓점 k 개에 이어 그 아래 꼭짓점 k 개
    prism(k, h) {
      const names = 'ABCDEFGHIJKL'.slice(0, 2 * k), start = { 3: 90, 5: 108, 6: 120 }[k], V3 = {};
      for (let i = 0; i < k; i += 1) { const x = 2 * Math.cos((start + i * 360 / k) * RAD), y = 2 * Math.sin((start + i * 360 / k) * RAD); V3[names[i]] = [x, y, h || 3.4]; V3[names[k + i]] = [x, y, 0]; }
      const top = names.slice(0, k), bot = names.slice(k), faces = [top, bot];
      for (let i = 0; i < k; i += 1) { const j = (i + 1) % k; faces.push(top[i] + top[j] + bot[j] + bot[i]); }
      const word = { 3: '삼', 5: '오', 6: '육' }[k];
      return makeSolid('정' + word + '각기둥', V3, faces, { dep: [0.25, 0.42], say: `윗면은 정${word}각형 ${top}, 아랫면은 정${word}각형 ${bot}이고 꼭짓점 ${list(top.split(''))}의 아래에 차례로 꼭짓점 ${list(bot.split(''))}${pt(bot, '이/가')} 있다` });
    },
    // 정 k 각뿔(이름 없이 그릴 때 쓴다)
    pyramid(k) {
      const names = 'ABCDEFGH'.slice(0, k + 1), start = { 3: 90, 5: 108, 6: 120 }[k], V3 = { A: [0, 0, 3.6] };
      for (let i = 0; i < k; i += 1) V3[names[i + 1]] = [2 * Math.cos((start + i * 360 / k) * RAD), 2 * Math.sin((start + i * 360 / k) * RAD), 0];
      const base = names.slice(1), faces = [base];
      for (let i = 0; i < k; i += 1) faces.push('A' + base[i] + base[(i + 1) % k]);
      return makeSolid({ 3: '삼', 5: '오', 6: '육' }[k] + '각뿔', V3, faces, { dep: [0.25, 0.42] });
    },
    // 직육면체의 한 꼭짓점을, 그 꼭짓점과 이웃한 세 꼭짓점 A, G, C 를 지나는 평면으로 잘라 낸 입체(꼭짓점 7개)
    corner: (a, b, c) => makeSolid('직육면체의 한 꼭짓점을 잘라 낸 입체도형', { A: [0, 0, c], G: [a, b, c], C: [a, 0, 0], D: [0, b, c], B: [0, 0, 0], F: [a, b, 0], E: [0, b, 0] }, ['AGC', 'ADG', 'ABC', 'GCF', 'ADEB', 'DGFE', 'BCFE'],
      { say: '직육면체에서 앞쪽 오른쪽 위의 꼭짓점을, 이웃한 세 꼭짓점 A(앞쪽 왼쪽 위), G(뒤쪽 오른쪽 위), C(앞쪽 오른쪽 아래)를 지나는 평면으로 잘라 냈다. 면은 삼각형 AGC, ADG, ABC, GCF와 직사각형 ADEB, DGFE, BCFE이다. D는 뒤쪽 왼쪽 위, B는 앞쪽 왼쪽 아래, F는 뒤쪽 오른쪽 아래, E는 뒤쪽 왼쪽 아래의 꼭짓점이다' }),
    // 직육면체의 한 귀퉁이를 작게 잘라 낸 입체(꼭짓점 10개). 이름 없이 그린다.
    chip: (a, b, c, t) => makeSolid('직육면체의 한 귀퉁이를 잘라 낸 입체도형', { A: [0, b, c], B: [0, 0, c], I: [a - t, 0, c], J: [a, t, c], D: [a, b, c], K: [a, 0, c - t], E: [0, b, 0], F: [0, 0, 0], G: [a, 0, 0], H: [a, b, 0] }, ['ABIJD', 'EFGH', 'ABFE', 'BFGKI', 'JKGHD', 'AEHD', 'IKJ'], {})
  };
  // 겨냥도. 안쪽으로 1 들어간 점은 오른쪽으로 dep[0], 위로 dep[1] 옮겨 그린다. 보이지 않는 모서리는 점선.
  // o: { size: [너비, 높이], names: false(이름 없이), extra: [[a, b]](더 긋는 선분: 면의 대각선), lens: [[모서리, 글]], marks: [[꼭짓점, 이웃, 이웃]](직각 표시), label }
  function drawSolid(sol, o) {
    const opt = o || {}, dep = sol.dep || [0.5, 0.36], keys = Object.keys(sol.V), size = opt.size || [150, 110], raw = {};
    keys.forEach((k) => { const [x, y, z] = sol.V[k]; raw[k] = [x + y * dep[0], z + y * dep[1]]; });
    const xs = keys.map((k) => raw[k][0]), ys = keys.map((k) => raw[k][1]), sc = Math.min(size[0] / (Math.max(...xs) - Math.min(...xs)), size[1] / (Math.max(...ys) - Math.min(...ys)));
    const P = {}; keys.forEach((k) => { P[k] = [raw[k][0] * sc, raw[k][1] * sc]; });
    const heart = avg3(keys.map((k) => sol.V[k]));
    // 면의 바깥쪽 법선이 보는 쪽(오른쪽 위 앞)을 향하면 보이는 면이다.
    const seenF = sol.faces.map((f) => { const p = f.split('').map((k) => sol.V[k]); let n = cross3(sub3(p[1], p[0]), sub3(p[2], p[0])); if (dot3(n, sub3(avg3(p), heart)) < 0) n = n.map((v) => -v); return dot3(n, [dep[0], -1, dep[1]]) > 1e-9; });
    const seenE = (e) => sol.faces.some((f, i) => seenF[i] && hasEdge(f, e));
    const S = sheet(), walls = sol.edges.map((e) => [P[e[0]], P[e[1]]]), c2 = [keys.reduce((s, k) => s + P[k][0], 0) / keys.length, keys.reduce((s, k) => s + P[k][1], 0) / keys.length];
    sol.faces.forEach((f, i) => { if (seenF[i]) S.poly(f.split('').map((k) => P[k]), 'fill:' + CREAM + ';stroke:none'); });
    for (const pass of [false, true]) sol.edges.forEach((e) => { if (seenE(e) === pass) S.seg(P[e[0]], P[e[1]], pass ? '' : 'dash'); });
    (opt.extra || []).forEach(([a, b]) => { const vis = sol.faces.some((f, i) => seenF[i] && f.includes(a) && f.includes(b)); S.seg(P[a], P[b], '', 'stroke:' + BLUE + ';stroke-width:1.8' + (vis ? '' : ';stroke-dasharray:4 3')); walls.push([P[a], P[b]]); });
    (opt.marks || []).forEach(([v, p, q]) => { const a = dirOf(P[v], P[p]), b = dirOf(P[v], P[q]), s = 7, p1 = pol(P[v], a, s), p3 = pol(P[v], b, s); S.add(`<polyline class="mb-mark" points="${[p1, [p1[0] + p3[0] - P[v][0], p1[1] + p3[1] - P[v][1]], p3].map((p) => f1(p[0]) + ',' + f1(-p[1])).join(' ')}"/>`); });
    // 꼭짓점 이름: 그 꼭짓점에서 나가는 선들 사이의 빈 쪽 가운데 둘레의 선과 가장 멀리 떨어지는 자리에 적는다.
    if (opt.names !== false) keys.forEach((k) => {
      const nbrs = sol.edges.filter((e) => e.includes(k)).map((e) => (e[0] === k ? e[1] : e[0])).concat((opt.extra || []).filter((x) => x.includes(k)).map((x) => (x[0] === k ? x[1] : x[0])));
      const angs = nbrs.map((w) => Math.atan2(P[w][1] - P[k][1], P[w][0] - P[k][0])).sort((a, b) => a - b);
      const spots = angs.map((a, i) => { const b = i + 1 < angs.length ? angs[i + 1] : angs[0] + 2 * Math.PI, c = [P[k][0] + 12 * Math.cos((a + b) / 2), P[k][1] + 12 * Math.sin((a + b) / 2)]; return { c, gap: b - a, room: Math.min(...walls.map((w) => segGap(c, w[0], w[1]))), inside: sol.faces.some((f) => inPoly(c, f.split('').map((v) => P[v]))) }; });
      // 그림의 바깥쪽 자리를 먼저 고르고(안쪽은 가려진 꼭짓점뿐), 그 가운데 선에서 가장 먼 자리에 적는다.
      spots.sort((p, q) => (p.inside !== q.inside ? (p.inside ? 1 : -1) : Math.abs(q.room - p.room) > 0.6 ? q.room - p.room : q.gap - p.gap));
      S.text(spots[0].c, k);
    });
    (opt.lens || []).forEach(([e, t]) => S.side(P[e[0]], P[e[1]], t, c2, 6));
    return S.out(opt.label || sol.kind + '의 겨냥도');
  }
  function inPoly(c, pts) { let hit = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i, i += 1) { const a = pts[i], b = pts[j]; if ((a[1] > c[1]) !== (b[1] > c[1]) && c[0] < (b[0] - a[0]) * (c[1] - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit; } return hit; }
  const solidSay = (sol, more) => `${sol.kind}의 겨냥도: ${sol.say}.${more ? ' ' + more : ''}`;
  const edgeList = (edges) => list(edges);

  // ── 그림: 평행한 두 직선 l(위), m(아래) ──────────────────────
  // 돌려주는 판에 yl, ym, w 가 달려 있다. cross(x, a): 직선 l 위의 x 에서 방향 a°(0 < a < 180)로 가로지르는 직선을 긋고 두 교점을 돌려준다.
  function para(o) {
    const opt = o || {}, S = sheet(), w = opt.w || 236, gap = opt.gap || 72, tilt = opt.tilt || 0;
    S.yl = gap; S.ym = 0; S.w = w;
    // 아래 직선은 tilt° 만큼 기울여 그릴 수 있다(평행하지 않은 두 직선). 기울이는 중심은 pivot.
    const pivot = opt.pivot || [w / 2, 0];
    S.mAt = (x) => [x, pivot[1] + (x - pivot[0]) * Math.tan(tilt * RAD)];
    S.seg([0, gap], [w, gap]); S.seg(S.mAt(0), S.mAt(w));
    const names = opt.names || ['l', 'm'];
    if (names[0]) S.text([w + 9, gap], '{' + names[0] + '}');
    if (names[1]) S.text([S.mAt(w)[0] + 9, S.mAt(w)[1]], '{' + names[1] + '}');
    S.cross = (x, a, ext) => {
      const P = [x, gap], k = ext == null ? 20 : ext;
      // 아래 직선과의 교점: P + t(cos a, sin a) 가 아래 직선 위에 있게
      const ca = Math.cos(a * RAD), sa = Math.sin(a * RAD), tt = Math.tan(tilt * RAD), t = (pivot[1] + (x - pivot[0]) * tt - gap) / (sa - ca * tt), Q = [x + t * ca, gap + t * sa];
      S.seg(pol(P, a, k), pol(Q, a + 180, k));
      return [P, Q];
    };
    return S;
  }
  // 교점 둘레의 네 자리: 가로지르는 직선의 방향이 a°(위쪽), 가로 직선의 기울기가 tilt° 일 때 자리 k(0 오른쪽 위, 1 왼쪽 위, 2 왼쪽 아래, 3 오른쪽 아래)의 [시작, 끝] 방향
  const sector = (a, k, tilt) => { const t = tilt || 0; return [[t, a], [a, 180 + t], [180 + t, 180 + a], [180 + a, 360 + t]][k]; };
  const sizeAt = (a, k, tilt) => { const [p, q] = sector(a, k, tilt); return q - p; };
  const SPOT = ['오른쪽 위', '왼쪽 위', '왼쪽 아래', '오른쪽 아래'];

  B.addUnit({
    id: '7-2-1', grade: 7, semester: 2, no: 1, title: '기본 도형', version: 2,
    groups: [
      { id: 'point', title: '점·선·면, 교점과 교선', standard: STD1, types: [
        T('point-claims', '점, 선, 면과 교점, 교선에 대한 설명', '①1 ②4', (d) => claimQ(d, '다음 가운데 옳지 않은 것은?', [
          '점이 움직인 자리는 선이 된다.', '선이 움직인 자리는 면이 된다.', '선과 선이 만나서 생기는 점을 교점이라고 한다.', '선과 면이 만나서 생기는 점을 교점이라고 한다.',
          '면과 면이 만나서 생기는 선을 교선이라고 한다.', '도형을 이루는 기본 요소는 점, 선, 면이다.', '선은 무수히 많은 점으로 이루어져 있다.'
        ], [
          ['선과 면이 만나면 교선이 생긴다.', '선과 면이 만나서 생기는 것은 교점이다.', '선과 면이 만나서 생기는 점을 교점이라고 한다.'],
          ['면과 면이 만나면 교점이 생긴다.', '면과 면이 만나서 생기는 것은 교선이다.', '면과 면이 만나서 생기는 선을 교선이라고 한다.'],
          ['교선은 선과 선이 만나서 생긴다.', '교선은 면과 면이 만나서 생긴다. 선과 선이 만나면 교점이 생긴다.', '선과 선이 만나서 생기는 점을 교점이라고 한다.'],
          ['선은 무수히 많은 면으로 이루어져 있다.', '선은 무수히 많은 점으로 이루어져 있다.', '선은 무수히 많은 점으로 이루어져 있다.'],
          ['면이 움직인 자리는 선이 된다.', '선이 움직인 자리가 면이 된다.', '선이 움직인 자리는 면이 된다.']
        ], false)),
        T('point-count', '도형에서 교점과 교선의 개수', '①3 ②1·2·3', (d, n) => {
          if (n === 0) {
            const k = d.pick([4, 5, 6]), turn = d.int(0, 59), pts = range(0, k - 1).map((i) => { const a = turn + i * 360 / k + d.int(-9, 9); return [f1(64 * Math.cos(a * RAD)), f1(40 * Math.sin(a * RAD))]; });
            const S = sheet().poly(pts, 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round');
            return N('다음 도형에서 변과 변이 만나서 생기는 교점은 모두 몇 개인가?', k, { unit: '개', figure: S.out(['사', '오', '육'][k - 4] + '각형'), explain: `변과 변이 만나는 점은 꼭짓점이다. 교점의 개수는 꼭짓점의 개수와 같은 ${k}개이다.`, facts: { segments: { closed: true, points: pts } } });
          }
          const sol = d.pick([() => SOL.prism(3), () => SOL.box(4, 2.6, 3), () => SOL.prism(5), () => SOL.prism(6), () => SOL.tetra(), () => SOL.pyr4(), () => SOL.pyramid(5)])();
          const v = Object.keys(sol.V).length, e = sol.edges.length, name = sol.kind.replace(/^정/, '');
          return M('다음 입체도형에서 교점의 개수와 교선의 개수를 차례로 구하시오.', [{ label: '교점', answer: v, unit: '개' }, { label: '교선', answer: e, unit: '개' }], {
            figure: drawSolid(sol, { names: false, label: name + '의 겨냥도' }),
            explain: `입체도형에서 교점은 모서리와 모서리가 만나는 꼭짓점이고, 교선은 면과 면이 만나는 모서리이다. ${name}의 꼭짓점은 ${v}개, 모서리는 ${e}개이므로 교점은 ${v}개, 교선은 ${e}개이다.`,
            facts: { calc: [[String(v), 0], [String(e), 1]], unseen: [v, e] }
          });
        }, { count: 2 }),
        T('point-most', '이름만 듣고 교점·교선이 가장 많은 입체도형 고르기', '심1 ②2', (d) => {
          // 각기둥은 꼭짓점 2n개·모서리 3n개, 각뿔은 꼭짓점 (n + 1)개·모서리 2n개. 이름의 수가 가장 큰 것이 답이 되지 않게 고른다.
          const POOL = [['삼각기둥', 3, 1], ['사각기둥', 4, 1], ['오각기둥', 5, 1], ['육각기둥', 6, 1], ['사각뿔', 4, 0], ['오각뿔', 5, 0], ['육각뿔', 6, 0], ['칠각뿔', 7, 0], ['팔각뿔', 8, 0]];
          const edge = d.bool(), expr = ([, k, prism]) => (edge ? (prism ? '3*' + k : '2*' + k) : prism ? '2*' + k : k + '+1'), val = (s) => (s.includes('*') ? Number(s[0]) * Number(s[2]) : Number(s[0]) + 1);
          const rows = d.until(() => d.shuffle(POOL).slice(0, 4), (r) => { const vs = r.map((x) => val(expr(x))), top = Math.max(...vs), big = Math.max(...r.map((x) => x[1])); return vs.filter((v) => v === top).length === 1 && r[vs.indexOf(top)][1] !== big && r.some((x) => x[2]) && r.some((x) => !x[2]); });
          const vs = rows.map((x) => val(expr(x))), word = edge ? '교선' : '교점';
          return C(`다음 입체도형 가운데 ${word}의 개수가 가장 많은 것은?`, rows.map((x) => x[0]), vs.indexOf(Math.max(...vs)), {
            explain: `${word}의 개수는 ${edge ? '모서리' : '꼭짓점'}의 개수와 같다. ${rows.map((x, i) => `${x[0]} ${vs[i]}개`).join(', ')}이므로 가장 많은 것은 ${rows[vs.indexOf(Math.max(...vs))][0]}이다.`,
            facts: { choose: { exprs: rows.map(expr), rule: 'max' }, unseen: [1, 2, 3, 4, 5, 6, 7, 8] }
          });
        }),
        T('point-edge-faces', '입체도형에서 교선과 교점 찾기', '①4', (d, n) => {
          const sol = d.pick([() => SOL.box(4, 2.6, 3), () => SOL.tri(), () => SOL.tetra()])(), figure = drawSolid(sol, { label: solidSay(sol) });
          if (n === 0) {
            const e = d.pick(sol.edges), pairs = [];
            sol.faces.forEach((f, i) => sol.faces.slice(i + 1).forEach((g) => pairs.push([f, g])));
            const ok = (p) => hasEdge(p[0], e) && hasEdge(p[1], e), near = pairs.filter((p) => !ok(p) && (hasEdge(p[0], e) || hasEdge(p[1], e)));
            const opts = d.shuffle([pairs.find(ok)].concat(d.shuffle(near).slice(0, 3)));
            return C(`다음 ${sol.kind}에서 모서리 ${e}${pt(e, '을/를')} 교선으로 하는 두 면은?`, opts.map((p) => `면 ${p[0]}, 면 ${p[1]}`), opts.findIndex(ok), { figure, explain: `모서리 ${e}${pt(e, '은/는')} 면 ${pairs.find(ok)[0]}${pt(pairs.find(ok)[0], '과/와')} 면 ${pairs.find(ok)[1]}${pt(pairs.find(ok)[1], '이/가')} 만나서 생기는 교선이다.`, facts: { truth: opts.map(ok), want: true } });
          }
          if (n === 1) {
            const e = d.pick(sol.edges), [f, g] = sol.faces.filter((x) => hasEdge(x, e)), cand = sol.edges.filter((x) => x !== e && (hasEdge(f, x) || hasEdge(g, x)));
            const opts = d.shuffle([e].concat(d.shuffle(cand).slice(0, 3)));
            return C(`다음 ${sol.kind}에서 면 ${f}${pt(f, '과/와')} 면 ${g}의 교선은?`, opts.map((x) => '모서리 ' + x), opts.indexOf(e), { figure, explain: `두 면에 모두 들어 있는 모서리는 모서리 ${e}이다. 면과 면이 만나서 생기는 선이 교선이다.`, facts: { truth: opts.map((x) => hasEdge(f, x) && hasEdge(g, x)), want: true } });
          }
          const [f, e] = d.until(() => [d.pick(sol.faces), d.pick(sol.edges)], ([x, y]) => y.split('').filter((c) => x.includes(c)).length === 1);
          const hit = e.split('').find((c) => f.includes(c)), opts = d.shuffle([hit, e.replace(hit, '')].concat(d.shuffle(f.split('').filter((c) => c !== hit)).slice(0, 2)));
          return C(`다음 ${sol.kind}에서 면 ${f}${pt(f, '과/와')} 모서리 ${e}의 교점은?`, opts.map((x) => '점 ' + x), opts.indexOf(hit), { figure, explain: `모서리 ${e}의 두 끝 점 가운데 면 ${f} 위에 있는 점은 점 ${hit}이다. 선과 면이 만나서 생기는 점이 교점이다.`, facts: { truth: opts.map((x) => x === hit), want: true } });
        }, { count: 3 })
      ] },

      { id: 'line', title: '직선, 반직선, 선분', standard: STD1, types: [
        T('line-claims', '직선, 반직선, 선분에 대한 설명', '①2 ②4', (d) => {
          const POOL = [
            [['한 점을 지나는 직선은 무수히 많다.', true], ['한 점을 지나는 직선은 하나뿐이다.', false, '한 점을 지나는 직선은 무수히 많다.']],
            [['서로 다른 두 점을 지나는 직선은 하나뿐이다.', true], ['서로 다른 두 점을 지나는 직선은 무수히 많다.', false, '서로 다른 두 점을 지나는 직선은 하나뿐이다.']],
            [['두 점을 잇는 선 가운데 길이가 가장 짧은 것은 선분이다.', true], ['두 점을 잇는 선은 선분 하나뿐이다.', false, '두 점을 잇는 선은 무수히 많고 그 가운데 가장 짧은 것이 선분이다.']],
            [[`${RY('AB')}와 ${RY('BA')}는 서로 다른 반직선이다.`, true], [`${RY('AB')}와 ${RY('BA')}는 같은 반직선이다.`, false, '반직선 AB와 반직선 BA는 시작점과 뻗는 방향이 달라 서로 다른 반직선이다.']],
            [['시작점과 뻗는 방향이 모두 같은 두 반직선은 같은 반직선이다.', true], ['시작점이 같은 두 반직선은 항상 같은 반직선이다.', false, '시작점이 같아도 뻗는 방향이 다르면 다른 반직선이다.']],
            [[`${LN('AB')}와 ${LN('BA')}는 같은 직선이다.`, true], [`${LN('AB')}와 ${LN('BA')}는 서로 다른 직선이다.`, false, '직선 AB와 직선 BA는 같은 직선이다.']]
          ];
          const rows = d.until(() => d.shuffle(POOL).slice(0, 4).map((pair) => d.pick(pair)), (r) => r.some((x) => x[1]) && r.some((x) => !x[1])).map(([s, ok, why]) => ({ s, ok, why }));
          return tagQ(d, '다음 가운데 옳은 것을 모두 고른 것은?', rows);
        }),
        T('line-symbol', '직선, 반직선, 선분을 기호로 나타내기', '①6', (d, n) => {
          const [a, b] = d.pick([['A', 'B'], ['P', 'Q'], ['C', 'D'], ['M', 'N']]), kind = d.pick(['line', 'rayAB', 'rayBA', 'seg']);
          const KO = { line: '직선', ray: '반직선', seg: '선분' }, opts = d.shuffle([['line', a, b], ['ray', a, b], ['ray', b, a], ['seg', a, b]]);
          const want = kind === 'line' ? ['line', a, b] : kind === 'rayAB' ? ['ray', a, b] : kind === 'rayBA' ? ['ray', b, a] : ['seg', a, b], at = opts.findIndex((o) => o.join() === want.join());
          const facts = { lineName: { kind: KO[want[0]], from: want[1], to: want[2], options: opts.map((o) => [KO[o[0]], o[1], o[2]]) } };
          const why = { line: `두 점 ${a}, ${b}를 지나 양쪽으로 한없이 뻗은 선은 직선 ${a}${b}이다.`, rayAB: `점 ${a}에서 시작하여 점 ${b} 쪽으로 뻗은 선은 반직선 ${a}${b}이다. 반직선은 시작점을 먼저 쓴다.`, rayBA: `점 ${b}에서 시작하여 점 ${a} 쪽으로 뻗은 선은 반직선 ${b}${a}이다. 반직선은 시작점을 먼저 쓴다.`, seg: `두 점 ${a}, ${b}를 곧게 이은 선은 선분 ${a}${b}이다.` }[kind];
          if (n === 1) {
            const told = { line: `두 점 ${a}, ${b}를 지나 양쪽으로 한없이 뻗은 곧은 선`, rayAB: `점 ${a}에서 시작하여 점 ${b}의 방향으로 한없이 뻗은 곧은 선`, rayBA: `점 ${b}에서 시작하여 점 ${a}의 방향으로 한없이 뻗은 곧은 선`, seg: `두 점 ${a}, ${b}를 곧게 이은 선` }[kind];
            return C(`${told}을 기호로 나타낸 것은?`, opts.map((o) => sym(o[0], o[1] + o[2])), at, { explain: why, facts });
          }
          const tiltA = d.pick([0, 12, -12]), A = [0, 0], Bp = pol(A, tiltA, 110), S = sheet();
          S.seg(kind === 'line' || kind === 'rayBA' ? pol(A, tiltA + 180, 34) : A, kind === 'line' || kind === 'rayAB' ? pol(Bp, tiltA, 34) : Bp).dot(A).dot(Bp).name(A, a, tiltA - 90, 13).name(Bp, b, tiltA - 90, 13);
          const said = { line: `두 점 ${a}, ${b}를 지나 양쪽으로 뻗어 나간 곧은 선`, rayAB: `점 ${a}에서 시작하여 점 ${b}를 지나 한쪽으로 뻗어 나간 곧은 선`, rayBA: `점 ${b}에서 시작하여 점 ${a}를 지나 한쪽으로 뻗어 나간 곧은 선`, seg: `점 ${a}에서 점 ${b}까지만 그은 곧은 선` }[kind];
          return C('다음 그림의 도형을 기호로 나타낸 것은?', opts.map((o) => sym(o[0], o[1] + o[2])), at, { figure: S.out(said + `. 점 ${a}가 왼쪽, 점 ${b}가 오른쪽에 있다.`), explain: why, facts });
        }, { count: 2 }),
        T('line-ab-ba', '두 점으로 나타낸 직선, 반직선, 선분이 같은지 가리기', '①7', (d) => {
          const [a, b] = d.pick([['A', 'B'], ['P', 'Q'], ['C', 'D']]), kinds = d.shuffle(['line', 'ray', 'seg']), right = kinds.map((k) => (k === 'ray' ? '≠' : '=')).join(', ');
          const all = []; for (const x of ['=', '≠']) for (const y of ['=', '≠']) for (const z of ['=', '≠']) all.push([x, y, z].join(', '));
          const opts = d.shuffle([right].concat(d.shuffle(all.filter((s) => s !== right)).slice(0, 3)));
          return C(`두 점 ${a}, ${b}에 대하여 다음 □ 안에 =, ≠ 가운데 알맞은 것을 ㉠, ㉡, ㉢의 차례로 쓴 것은?`, opts, opts.indexOf(right), {
            figure: tagged(kinds.map((k) => `${sym(k, a + b)} ${box()} ${sym(k, b + a)}`), LAB),
            explain: `직선 ${a}${b}와 직선 ${b}${a}는 같은 직선이고, 선분 ${a}${b}와 선분 ${b}${a}도 같은 선분이다. 반직선 ${a}${b}와 반직선 ${b}${a}는 시작점과 뻗는 방향이 달라 서로 다르다.`,
            facts: { truth: opts.map((s) => s === right), want: true }
          });
        }),
        T('line-same-ray', '한 직선 위의 점으로 나타낸 반직선 가운데 같은 것 찾기', '①8 ②5', (d) => {
          const order = ['A', 'B', 'C', 'D'], at = (c) => order.indexOf(c), side = (r) => Math.sign(at(r[1]) - at(r[0]));
          const rays = []; order.forEach((p) => order.forEach((q) => { if (p !== q) rays.push(p + q); }));
          const same = (r, s) => r[0] === s[0] && side(r) === side(s);
          const ray = d.until(() => d.pick(rays), (r) => rays.some((s) => s !== r && same(r, s)));
          const yes = d.pick(rays.filter((s) => s !== ray && same(ray, s)));
          // 틀린 보기: 시작점은 같고 방향이 반대인 것(없으면 두 글자를 뒤집은 것), 방향은 같고 시작점이 다른 것, 그 밖의 것 하나
          const wrong = rays.filter((s) => s !== ray && !same(ray, s)), back = wrong.filter((s) => s[0] === ray[0]), first = back.length ? d.pick(back) : ray[1] + ray[0], second = d.pick(wrong.filter((s) => s !== first && s[0] !== ray[0] && side(s) === side(ray)));
          const no = [first, second, d.pick(wrong.filter((s) => s !== first && s !== second))];
          const opts = d.shuffle([yes].concat(no));
          return C(`다음 그림과 같이 직선 ${V('l')} 위에 네 점 A, B, C, D가 있다. 다음 가운데 ${RY(ray)}${pt(ray, '과/와')} 같은 것은?`, opts.map(RY), opts.indexOf(yes), {
            figure: onLine(order, [0, 1, 2, 3], { lname: 'l' }),
            explain: `반직선 ${ray}${pt(ray, '은/는')} 점 ${ray[0]}에서 시작하여 점 ${ray[1]} 쪽으로 뻗는다. 시작점과 뻗는 방향이 모두 같은 것은 반직선 ${yes}이다.`,
            facts: { sameRay: { order, ray, options: opts } }
          });
        }),
        T('line-same-pairs', '한 직선 위의 점으로 나타낸 도형이 같은지 가리기', '①9 ②6 심4', (d) => {
          const order = ['A', 'B', 'C', 'D'], at = (c) => order.indexOf(c), side = (r) => Math.sign(at(r[1]) - at(r[0]));
          const same = (kind, p, q) => (kind === 'line' ? true : kind === 'seg' ? p.split('').sort().join('') === q.split('').sort().join('') : p[0] === q[0] && side(p) === side(q));
          const why = (kind, p, q) => (kind === 'ray' ? (p[0] !== q[0] ? `반직선 ${p}${pt(p, '과/와')} 반직선 ${q}${pt(q, '은/는')} 시작점이 다르다.` : `반직선 ${p}${pt(p, '과/와')} 반직선 ${q}${pt(q, '은/는')} 뻗는 방향이 다르다.`) : `선분 ${p}${pt(p, '과/와')} 선분 ${q}${pt(q, '은/는')} 양 끝 점이 다르다.`);
          const POOL = [['line', 'AB', 'CD'], ['line', 'AC', 'BD'], ['line', 'BC', 'DA'], ['ray', 'AB', 'AC'], ['ray', 'CA', 'CB'], ['ray', 'BC', 'BD'], ['ray', 'DB', 'DA'], ['ray', 'BA', 'BC'], ['ray', 'CB', 'CD'], ['ray', 'AB', 'BC'], ['ray', 'BC', 'CD'], ['ray', 'AD', 'BC'], ['ray', 'AB', 'BA'], ['ray', 'CD', 'DC'], ['seg', 'BC', 'CB'], ['seg', 'AD', 'DA'], ['seg', 'AC', 'BC'], ['seg', 'AB', 'AC']];
          const rows = mixRows(d, POOL.map(([kind, p, q]) => ({ s: `${sym(kind, p)} = ${sym(kind, q)}`, ok: same(kind, p, q), why: kind === 'line' ? '' : why(kind, p, q), g: kind + (same(kind, p, q) ? 'T' : p[0] === q[0] ? 'F1' : 'F2') })), 4);
          return tagQ(d, `다음 그림과 같이 직선 ${V('l')} 위에 네 점 A, B, C, D가 있다. 다음 가운데 옳은 것을 모두 고른 것은?`, rows, { figure: onLine(order, [0, 1, 2, 3], { lname: 'l' }), lead: '한 직선 위의 어느 두 점으로 나타내어도 같은 직선이다. 반직선은 시작점과 뻗는 방향이 모두 같아야 같고, 선분은 양 끝 점이 같아야 같다.' });
        }),
        T('line-common', '두 반직선의 공통 부분', '①10', (d) => {
          const order = d.pick([['A', 'B', 'C'], ['A', 'B', 'C', 'D']]), k = order.length;
          const [i, j] = d.until(() => [d.int(0, k - 2), d.int(1, k - 1)], ([x, y]) => x < y), r1 = order[i] + order[d.int(i + 1, k - 1)], r2 = order[j] + order[d.int(0, j - 1)];
          const right = order[i] + order[j], segs = []; order.forEach((p, x) => order.slice(x + 1).forEach((q) => segs.push(p + q)));
          const opts = d.shuffle([['seg', right]].concat(d.shuffle(segs.filter((s) => s !== right)).slice(0, 2).map((s) => ['seg', s]), [d.pick([['ray', r1], ['line', right], ['ray', right]])]));
          return C(`다음 그림과 같이 한 직선 위에 ${k === 3 ? '세' : '네'} 점 ${list(order)}${pt(order[k - 1], '이/가')} 있다. ${RY(r1)}${pt(r1, '과/와')} ${RY(r2)}의 공통 부분은?`, opts.map(([kind, s]) => sym(kind, s)), opts.findIndex(([kind, s]) => kind === 'seg' && s === right), {
            figure: onLine(order, range(0, k - 1)),
            explain: `반직선 ${r1}${pt(r1, '은/는')} 점 ${r1[0]}에서 시작하여 점 ${r1[1]} 쪽으로, 반직선 ${r2}${pt(r2, '은/는')} 점 ${r2[0]}에서 시작하여 점 ${r2[1]} 쪽으로 뻗는다. 두 반직선에 모두 들어 있는 부분은 선분 ${right}이다.`,
            facts: { truth: opts.map(([kind, s]) => kind === 'seg' && s === right), want: true }
          });
        }),
        T('line-meet', '점 종이 위의 네 점으로 만든 직선, 반직선, 선분이 만나는지 가리기', '①5', (d) => {
          // 두 직선 AB, CD 의 교점이 A + s(B − A) = C + t(D − C) 일 때: 선분 위는 0~1, 반직선 AB 위는 s ≥ 0, 반직선 BA 위는 s ≤ 1. 경계 가까이에 놓이는 그림은 쓰지 않는다.
          const cols = 9, rows = 6, cr = (u, v) => u[0] * v[1] - u[1] * v[0], far = (v) => Math.abs(v) >= 0.22 && Math.abs(v - 1) >= 0.22;
          const cfg = d.until(() => {
            const P = range(0, 3).map(() => [d.int(0, cols), d.int(0, rows)]), [A, Bp, Cp, Dp] = P, u = [Bp[0] - A[0], Bp[1] - A[1]], w = [Dp[0] - Cp[0], Dp[1] - Cp[1]], den = cr(u, w);
            if (den === 0) return null;
            const ac = [Cp[0] - A[0], Cp[1] - A[1]], s = cr(ac, w) / den, t = cr(ac, u) / den, X = [A[0] + s * u[0], A[1] + s * u[1]];
            return { P, s, t, X, u, w };
          }, (c) => c && Math.hypot(c.u[0], c.u[1]) >= 2 && Math.hypot(c.w[0], c.w[1]) >= 2 && far(c.s) && far(c.t) && c.X[0] >= -0.4 && c.X[0] <= cols + 0.4 && c.X[1] >= -0.4 && c.X[1] <= rows + 0.4
            && !(c.s > 0 && c.s < 1 && c.t > 0 && c.t < 1) && c.P.every((p, i) => c.P.every((q, j) => i === j || Math.hypot(p[0] - q[0], p[1] - q[1]) >= 1.9))
            && [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]].every(([i, j, k]) => cr([c.P[j][0] - c.P[i][0], c.P[j][1] - c.P[i][1]], [c.P[k][0] - c.P[i][0], c.P[k][1] - c.P[i][1]]) !== 0));
          const { s, t } = cfg, onS = (v) => v > 0 && v < 1;
          const POOL = [
            { s: `${LN('AB')}와 ${LN('CD')}`, ok: true, g: 'll' }, { s: `${LN('AB')}와 ${SG('CD')}`, ok: onS(t), g: 'cd' }, { s: `${SG('AB')}와 ${LN('CD')}`, ok: onS(s), g: 'ab' },
            { s: `${RY('AB')}와 ${SG('CD')}`, ok: s > 0 && onS(t), g: 'cd' }, { s: `${RY('BA')}와 ${SG('CD')}`, ok: s < 1 && onS(t), g: 'cd' }, { s: `${SG('AB')}와 ${RY('CD')}`, ok: onS(s) && t > 0, g: 'ab' },
            { s: `${RY('AB')}와 ${RY('CD')}`, ok: s > 0 && t > 0, g: 'rr' }, { s: `${RY('BA')}와 ${RY('DC')}`, ok: s < 1 && t < 1, g: 'rr' }, { s: `${SG('AB')}와 ${SG('CD')}`, ok: false, g: 'ss' }
          ];
          const picked = mixRows(d, POOL, 4), U = 22, S = sheet();
          for (let x = 0; x <= cols; x += 1) for (let y = 0; y <= rows; y += 1) S.add(`<circle class="mb-grid" cx="${x * U}" cy="${-y * U}" r="1.4"/>`);
          S.see([0, 0], 4).see([cols * U, rows * U], 4);
          const mid = [cfg.P.reduce((q, p) => q + p[0], 0) / 4, cfg.P.reduce((q, p) => q + p[1], 0) / 4];
          cfg.P.forEach((p, i) => { const q = [p[0] * U, p[1] * U]; S.dot(q, 3); S.name(q, 'ABCD'[i], dirOf(mid, p), 12); });
          const where = (v, a, b) => (onS(v) ? `선분 ${a}${b} 위에 있다` : v > 1 ? `선분 ${a}${b}${pt(b, '을/를')} 점 ${b} 쪽으로 늘인 곳에 있다` : `선분 ${a}${b}${pt(b, '을/를')} 점 ${a} 쪽으로 늘인 곳에 있다`);
          const cell = (p) => `왼쪽에서 ${p[0] + 1}번째, 아래에서 ${p[1] + 1}번째 점`;
          const tags = LAB.slice(0, 4);
          return setQ(d, '다음 그림과 같이 점 종이 위에 네 점 A, B, C, D가 있다. 다음 가운데 서로 만나는 것을 모두 고른 것은?', tags, picked.map((r) => r.ok), {
            figure: S.out(`가로 ${cols + 1}개, 세로 ${rows + 1}개의 점이 같은 간격으로 찍힌 점 종이. 점 A는 ${cell(cfg.P[0])}, 점 B는 ${cell(cfg.P[1])}, 점 C는 ${cell(cfg.P[2])}, 점 D는 ${cell(cfg.P[3])}에 있다.`) + tagged(picked.map((r) => r.s), tags),
            explain: `직선 AB와 직선 CD는 평행하지 않으므로 한 점에서 만난다. 그 교점은 ${where(s, 'A', 'B')}. 또 ${where(t, 'C', 'D')}. 직선은 양쪽으로, 반직선은 한쪽으로 한없이 뻗고 선분은 뻗지 않으므로 서로 만나는 것은 ${list(tags.filter((_, i) => picked[i].ok))}이다.`
          });
        }),
        T('line-count-free', '어느 세 점도 한 직선 위에 있지 않은 점으로 만드는 직선과 반직선의 개수', '①12 ②9', (d) => {
          const k = d.pick([3, 4]), names = 'ABCD'.slice(0, k).split(''), turn = d.int(0, 80), pts = names.map((_, i) => { const a = 90 + turn + i * 360 / k + d.int(-12, 12); return [Math.round(66 * Math.cos(a * RAD)), Math.round(44 * Math.sin(a * RAD))]; });
          const S = sheet(); pts.forEach((p, i) => { S.dot(p, 3); S.name(p, names[i], dirOf([0, 0], p), 12); });
          const pairs = k * (k - 1) / 2;
          return M(`다음 그림과 같이 어느 세 점도 한 직선 위에 있지 않은 ${k === 3 ? '세' : '네'} 점 ${list(names)}${pt(names[k - 1], '이/가')} 있다. 이 가운데 두 점을 지나는 서로 다른 직선의 개수와 반직선의 개수를 차례로 구하시오.`, [{ label: '직선', answer: pairs, unit: '개' }, { label: '반직선', answer: pairs * 2, unit: '개' }], {
            figure: S.out(`어느 세 점도 한 직선 위에 있지 않은 점 ${k}개: ${list(names)}`),
            explain: `두 점을 고르는 방법은 ${names.map((p, i) => names.slice(i + 1).map((q) => p + q)).reduce((a, b) => a.concat(b), []).join(', ')}의 ${pairs}가지이고, 고른 두 점마다 직선이 하나씩 정해지므로 직선은 ${pairs}개이다. 직선 하나마다 시작점이 다른 반직선이 2개씩 있으므로 반직선은 ${pairs} × 2 = ${pairs * 2}(개)이다.`,
            facts: { choose2: pts, calc: [[`${pairs}*2`, 1]], unseen: [pairs, 2] }
          });
        }),
        T('line-count-on', '한 직선 위의 점으로 만드는 직선, 반직선, 선분의 개수', '②8', (d) => {
          const k = d.pick([3, 4]), names = 'ABCD'.slice(0, k).split(''), rays = 2 * (k - 1), segs = k * (k - 1) / 2;
          return M(`다음 그림과 같이 직선 ${V('l')} 위에 ${k === 3 ? '세' : '네'} 점 ${list(names)}${pt(names[k - 1], '이/가')} 있다. 이 가운데 두 점을 골라 만들 수 있는 서로 다른 직선, 반직선, 선분의 개수를 차례로 구하시오.`, [{ label: '직선', answer: 1, unit: '개' }, { label: '반직선', answer: rays, unit: '개' }, { label: '선분', answer: segs, unit: '개' }], {
            figure: onLine(names, range(0, k - 1), { lname: 'l' }),
            explain: `어느 두 점을 골라도 같은 직선 ${V('l')}이므로 직선은 1개이다. 반직선은 시작점과 방향이 같으면 같은 반직선이다. 양 끝의 점에서는 1개씩, 사이의 점에서는 양쪽으로 2개씩 생기므로 ${k === 3 ? '1 + 2 + 1' : '1 + 2 + 2 + 1'} = ${rays}(개)이다. 선분은 두 점을 고르는 방법의 수만큼인 ${segs}개이다.`,
            facts: { calc: [['1', 0], [`2*${k}-2`, 1], [`${k}*(${k}-1)/2`, 2]], unseen: [1, 2, k] }
          });
        })
      ] },

      { id: 'dist', title: '두 점 사이의 거리와 중점', standard: STD1, types: [
        T('dist-read', '여러 선 가운데 두 점 사이의 거리 읽기', '①14 ②10', (d) => {
          // 두 점을 잇는 선 셋(선분, 위로 꺾인 선, 아래로 꺾인 선)을 길이대로 그린다. 꺾인 점은 두 원의 교점으로 셈한다.
          const [a, p1, p2, q1, q2] = d.until(() => { const len = d.int(8, 14); return [len, d.int(3, len - 2), d.int(3, len - 2), d.int(3, len - 2), d.int(3, len - 2)]; },
            ([len, x1, x2, y1, y2]) => x1 + x2 >= len + 2 && x1 + x2 <= len + 5 && y1 + y2 >= len + 2 && y1 + y2 <= len + 6 && x1 + x2 !== y1 + y2 && Math.abs(x1 - x2) <= len - 4 && Math.abs(y1 - y2) <= len - 4);
          const u = 196 / a, A = [0, 0], Bp = [a * u, 0], knee = (r1, r2, s) => { const x = (r1 * r1 - r2 * r2 + a * a) / (2 * a); return [x * u, s * Math.sqrt(r1 * r1 - x * x) * u]; }, K1 = knee(p1, p2, 1), K2 = knee(q1, q2, -1), S = sheet();
          S.seg(A, K1).seg(K1, Bp).seg(A, K2).seg(K2, Bp).seg(A, Bp).dot(A).dot(Bp).name(A, 'A', 180, 12).name(Bp, 'B', 0, 12);
          const c = [a * u / 2, 0];
          S.side(A, K1, p1 + ' cm', c).side(K1, Bp, p2 + ' cm', c).side(A, K2, q1 + ' cm', c).side(K2, Bp, q2 + ' cm', c).text([a * u / 2, 9], a + ' cm', { small: true });
          return N('다음 그림에서 두 점 A, B 사이의 거리는 몇 cm인가?', a, { unit: 'cm', figure: S.out(`두 점 A, B를 잇는 선 세 개. 곧게 이은 선분 AB의 길이는 ${a} cm이다. 위쪽으로 꺾인 선은 ${p1} cm와 ${p2} cm의 두 선분, 아래쪽으로 꺾인 선은 ${q1} cm와 ${q2} cm의 두 선분으로 이루어져 있다.`),
            explain: `두 점 A, B를 잇는 선 가운데 길이가 가장 짧은 것은 선분 AB이다. 선분 AB의 길이가 두 점 A, B 사이의 거리이므로 ${a} cm이다.`, facts: { minOf: [a, p1 + p2, q1 + q2] } });
        }),
        T('dist-mid', '중점의 뜻으로 길이 구하기', '①15 ②12', (d) => {
          const half = d.int(4, 14), L = half * 2;
          return M(`다음 그림에서 점 M은 ${SG('AB')}의 중점이다. ㉠, ㉡에 알맞은 수를 차례로 구하시오.`, [{ label: '㉠', answer: 2 }, { label: '㉡', answer: half }], {
            figure: onLine(['A', 'M', 'B'], [0, 1, 2], { ends: 'seg', w: 190, ticks: [[0, 1, 1], [1, 2, 1]] }) + lines([`${SG('AB')} = ${box('㉠')}${SG('AM')}`, `${SG('AB')} = ${L} cm일 때, ${SG('BM')} = ${box('㉡')} cm`]),
            explain: `점 M이 선분 AB의 중점이면 ${SG('AM')} = ${SG('BM')}이므로 ${SG('AB')} = 2${SG('AM')}이다. ${SG('AB')} = ${L} cm일 때 ${SG('BM')} = ${L} ÷ 2 = ${half}(cm)이다.`,
            facts: { calc: [['2', 0], [`${L}/2`, 1]], unseen: [2] }
          });
        }),
        T('dist-mid-mid', '중점의 중점', '①16 ②13', (d, n) => {
          const q = d.int(3, 11), head = `다음 그림에서 점 M은 ${SG('AB')}의 중점이고 점 N은 ${SG('AM')}의 중점이다. `, fig = (span) => onLine(['A', 'N', 'M', 'B'], [0, 1, 2, 4], { ends: 'seg', spans: [span] });
          if (n === 0) return N(head + `${SG('AB')} = ${q * 4} cm일 때, ${SG('AN')}의 길이는 몇 cm인가?`, q, { unit: 'cm', figure: fig([0, 3, q * 4 + ' cm']), explain: `${SG('AM')} = ${q * 4} ÷ 2 = ${q * 2}(cm)이고 ${SG('AN')} = ${q * 2} ÷ 2 = ${q}(cm)이다.`, facts: { calc: [[`${q * 4}/2/2`, 0]], unseen: [2] } });
          if (n === 1) return N(head + `${SG('AN')} = ${q} cm일 때, ${SG('AB')}의 길이는 몇 cm인가?`, q * 4, { unit: 'cm', figure: fig([0, 1, q + ' cm']), explain: `${SG('AM')} = 2${SG('AN')} = ${q * 2}(cm)이고 ${SG('AB')} = 2${SG('AM')} = ${q * 4}(cm)이다.`, facts: { calc: [[`${q}*2*2`, 0]], unseen: [2] } });
          return N(head + `${SG('MB')} = ${q * 2} cm일 때, ${SG('NB')}의 길이는 몇 cm인가?`, q * 3, { unit: 'cm', figure: fig([2, 3, q * 2 + ' cm']), explain: `${SG('AM')} = ${SG('MB')} = ${q * 2} cm이고 ${SG('NM')} = ${q * 2} ÷ 2 = ${q}(cm)이다. ${SG('NB')} = ${SG('NM')} + ${SG('MB')} = ${q} + ${q * 2} = ${q * 3}(cm)이다.`, facts: { calc: [[`${q * 2}/2+${q * 2}`, 0]], unseen: [2] } });
        }, { count: 3 }),
        T('dist-mid-claims', '중점과 등분점이 있는 선분의 길이 사이의 관계', '①17 ②19', (d, n) => {
          const names = n === 0 ? ['A', 'N', 'M', 'B'] : ['A', 'M', 'P', 'N', 'B'], pos = n === 0 ? [0, 1, 2, 4] : [0, 2, 3, 4, 6], len = (s) => Math.abs(pos[names.indexOf(s[0])] - pos[names.indexOf(s[1])]);
          const CAND = n === 0 ? [['AB', 4, 1, 'AN'], ['AN', 1, 1, 'NM'], ['MB', 2, 1, 'NM'], ['NB', 3, 1, 'AN'], ['NM', 1, 4, 'AB'], ['AM', 1, 2, 'AB'], ['AB', 3, 1, 'AN'], ['AN', 1, 2, 'AB'], ['MB', 1, 3, 'AB'], ['NB', 2, 1, 'AM'], ['NB', 2, 1, 'MB'], ['AN', 1, 3, 'NB']]
            : [['MB', 2, 1, 'AM'], ['MP', 1, 4, 'AN'], ['PB', 2, 1, 'MN'], ['AP', 3, 1, 'PN'], ['AM', 2, 3, 'AP'], ['AB', 3, 1, 'MN'], ['AN', 2, 1, 'MB'], ['PN', 1, 2, 'AM'], ['AP', 1, 2, 'AB'], ['MB', 3, 1, 'MP'], ['AN', 3, 1, 'PN'], ['PB', 3, 1, 'MP']];
          const told = (x, p, q, y) => `${SG(x)} = ${q === 1 ? (p === 1 ? '' : p) : frac(p, q)}${SG(y)}`;
          const rows = CAND.map(([x, p, q, y]) => ({ s: told(x, p, q, y), ok: len(x) * q === len(y) * p, why: len(x) === len(y) ? `${SG(x)}의 길이와 ${SG(y)}의 길이는 같다.` : `${SG(x)}의 길이는 ${SG(y)}의 길이의 ${len(x) % len(y) === 0 ? len(x) / len(y) + '배' : frac(len(x), len(y)) + '배'}이다.`, g: x + y }));
          const figure = onLine(names, pos, { ends: 'seg' });
          if (n === 0) return tagQ(d, `다음 그림에서 점 M은 ${SG('AB')}의 중점이고 점 N은 ${SG('AM')}의 중점이다. 다음 가운데 옳은 것을 모두 고른 것은?`, mixRows(d, rows, 4), { figure, lead: `${SG('AN')} = ${SG('NM')}이고 ${SG('AM')} = ${SG('MB')} = 2${SG('AN')}이다.` });
          return sayQ(d, `다음 그림에서 두 점 M, N은 ${SG('AB')}를 삼등분하는 점이고 점 P는 ${SG('MN')}의 중점이다. 다음 가운데 옳지 않은 것은?`, rows, false, { figure, lead: `${SG('AM')} = ${SG('MN')} = ${SG('NB')}이고 ${SG('MP')} = ${SG('PN')} = ${frac(1, 2)}${SG('MN')}이다.` });
        }, { count: 2 }),
        T('dist-linked', '맞물린 중점', '①18 ②17', (d, n) => {
          if (n === 0) {
            const t = d.int(2, 8), ask = d.pick(['CB', 'AB']), ans = ask === 'CB' ? t * 2 : t * 3;
            return N(`다음 그림에서 점 C는 ${SG('AD')}의 중점이고 점 D는 ${SG('CB')}의 중점이다. ${SG('AD')} = ${t * 2} cm일 때, ${SG(ask)}의 길이는 몇 cm인가?`, ans, { unit: 'cm',
              figure: onLine(['A', 'C', 'D', 'B'], [0, 1, 2, 3], { ends: 'seg', spans: [[0, 2, t * 2 + ' cm']] }),
              explain: `${SG('AC')} = ${SG('CD')} = ${t * 2} ÷ 2 = ${t}(cm)이고 ${SG('DB')} = ${SG('CD')} = ${t} cm이다. ${ask === 'CB' ? `${SG('CB')} = ${t} + ${t} = ${ans}(cm)이다.` : `${SG('AB')} = ${t} × 3 = ${ans}(cm)이다.`}`,
              facts: { calc: [[ask === 'CB' ? `${t * 2}/2*2` : `${t * 2}/2*3`, 0]], unseen: [2, 3] } });
          }
          const [x, y, p, q] = d.pick([['AB', 'AD', 1, 3], ['AC', 'AD', 2, 3], ['BD', 'AD', 2, 3], ['AB', 'AC', 1, 2], ['BC', 'AD', 1, 3]]);
          return F(`다음 그림에서 점 B는 ${SG('AC')}의 중점이고 점 C는 ${SG('BD')}의 중점이다. □ 안에 알맞은 수를 기약분수로 나타내시오.`, p, q, {
            figure: onLine(['A', 'B', 'C', 'D'], [0, 1, 2, 3], { ends: 'seg' }) + lines([`${SG(x)} = ${box()} × ${SG(y)}`]),
            explain: `${SG('AB')} = ${SG('BC')}이고 ${SG('BC')} = ${SG('CD')}이므로 세 선분 AB, BC, CD의 길이가 모두 같다. ${SG(x)}${pt(x, '은/는')} 이 길이의 ${p}배, ${SG(y)}${pt(y, '은/는')} ${q}배이므로 ${SG(x)} = ${frac(p, q)}${SG(y)}이다.`,
            facts: { value: `${p}/${q}`, unseen: [p, q] }
          });
        }, { count: 2 }),
        T('dist-two-mids', '이웃한 두 선분의 중점 사이의 거리', '①19 ②14', (d, n) => {
          const [a, b] = d.until(() => [d.int(2, 8), d.int(2, 8)], ([x, y]) => x !== y && Math.max(x, y) <= 2.2 * Math.min(x, y)), names = ['A', 'M', 'B', 'N', 'C'], pos = [0, a, 2 * a, 2 * a + b, 2 * a + 2 * b];
          const head = `다음 그림에서 점 M은 ${SG('AB')}의 중점이고 점 N은 ${SG('BC')}의 중점이다. `;
          if (n === 0) return N(head + `${SG('AB')} = ${2 * a} cm, ${SG('BC')} = ${2 * b} cm일 때, ${SG('MN')}의 길이는 몇 cm인가?`, a + b, { unit: 'cm', figure: onLine(names, pos, { ends: 'seg', spans: [[0, 2, 2 * a + ' cm'], [2, 4, 2 * b + ' cm']] }),
            explain: `${SG('MB')} = ${2 * a} ÷ 2 = ${a}(cm), ${SG('BN')} = ${2 * b} ÷ 2 = ${b}(cm)이므로 ${SG('MN')} = ${a} + ${b} = ${a + b}(cm)이다.`, facts: { calc: [[`${2 * a}/2+${2 * b}/2`, 0]], unseen: [2] } });
          return N(head + `${SG('MN')} = ${a + b} cm일 때, ${SG('AC')}의 길이는 몇 cm인가?`, 2 * (a + b), { unit: 'cm', figure: onLine(names, pos, { ends: 'seg', spans: [[1, 3, a + b + ' cm']] }),
            explain: `${SG('AB')} = 2${SG('MB')}, ${SG('BC')} = 2${SG('BN')}이므로 ${SG('AC')} = 2(${SG('MB')} + ${SG('BN')}) = 2${SG('MN')} = ${2 * (a + b)}(cm)이다.`, facts: { calc: [[`${a + b}*2`, 0]], unseen: [2] } });
        }, { count: 2 }),
        T('dist-mids-shared', '한 끝 점이 같은 두 선분의 중점 사이의 거리', '②16', (d) => {
          const [a, b] = d.until(() => [d.int(5, 11), d.int(2, 7)], ([x, y]) => y <= x - 2 && y >= x / 2 - 1), AB = 2 * a, BC = 2 * b;
          return N(`다음 그림에서 점 M은 ${SG('AB')}의 중점이고 점 N은 ${SG('AC')}의 중점이다. ${SG('AB')} = ${AB} cm, ${SG('BC')} = ${BC} cm일 때, ${SG('MN')}의 길이는 몇 cm인가?`, b, { unit: 'cm',
            figure: onLine(['A', 'M', 'N', 'B', 'C'], [0, a, a + b, AB, AB + BC], { ends: 'seg', spans: [[0, 3, AB + ' cm'], [3, 4, BC + ' cm']] }),
            explain: `${SG('AC')} = ${AB} + ${BC} = ${AB + BC}(cm)이므로 ${SG('AN')} = ${AB + BC} ÷ 2 = ${a + b}(cm)이다. ${SG('AM')} = ${AB} ÷ 2 = ${a}(cm)이므로 ${SG('MN')} = ${a + b} − ${a} = ${b}(cm)이다.`,
            facts: { calc: [[`(${AB}+${BC})/2-${AB}/2`, 0]], unseen: [2] } });
        }),
        T('dist-mid-part', '전체에서 한쪽을 덜어 낸 선분의 중점', '①20', (d) => {
          const [h, c] = d.until(() => [d.int(4, 10), d.int(4, 10)], ([x, y]) => y <= 2 * x && y >= x - 2), AC = 2 * h + c;
          return N(`다음 그림에서 점 M은 ${SG('AB')}의 중점이다. ${SG('AC')} = ${AC} cm, ${SG('BC')} = ${c} cm일 때, ${SG('MC')}의 길이는 몇 cm인가?`, h + c, { unit: 'cm',
            figure: onLine(['A', 'M', 'B', 'C'], [0, h, 2 * h, AC], { ends: 'seg', spans: [[0, 3, AC + ' cm'], [2, 3, c + ' cm', false]], ticks: [[0, 1, 1], [1, 2, 1]] }),
            explain: `${SG('AB')} = ${AC} − ${c} = ${2 * h}(cm)이고 ${SG('MB')} = ${2 * h} ÷ 2 = ${h}(cm)이다. ${SG('MC')} = ${SG('MB')} + ${SG('BC')} = ${h} + ${c} = ${h + c}(cm)이다.`,
            facts: { calc: [[`(${AC}-${c})/2+${c}`, 0]], unseen: [2] } });
        }),
        T('dist-symbols', '길이와 중점에 대한 문장을 기호로 나타내기', '①11 ②7', (d) => {
          const len = d.int(5, 12), k = d.pick([2, 3]), arrow = ' ➜ ';
          const rows = [
            { g: 'd', ok: true, s: `두 점 A, B 사이의 거리는 ${len} cm이다.${arrow}${SG('AB')} = ${len} cm` },
            { g: 'd', ok: false, s: `두 점 A, B 사이의 거리는 ${len} cm이다.${arrow}${RY('AB')} = ${len} cm`, why: `두 점 A, B 사이의 거리는 선분 AB의 길이이므로 ${SG('AB')} = ${len} cm로 나타낸다. 반직선은 한없이 뻗어 길이를 말할 수 없다.` },
            { g: 'd', ok: false, s: `두 점 A, B 사이의 거리는 ${len} cm이다.${arrow}${LN('AB')} = ${len} cm`, why: `두 점 A, B 사이의 거리는 선분 AB의 길이이므로 ${SG('AB')} = ${len} cm로 나타낸다. 직선은 한없이 뻗어 길이를 말할 수 없다.` },
            { g: 'k', ok: true, s: `선분 AB의 길이는 선분 CD의 길이의 ${k}배이다.${arrow}${SG('AB')} = ${k}${SG('CD')}` },
            { g: 'k', ok: false, s: `선분 AB의 길이는 선분 CD의 길이의 ${k}배이다.${arrow}${k}${SG('AB')} = ${SG('CD')}`, why: `선분 AB가 더 길므로 ${SG('AB')} = ${k}${SG('CD')}로 나타낸다.` },
            { g: 'm', ok: true, s: `점 M은 선분 AB의 중점이다.${arrow}${SG('AM')} = ${SG('BM')}` },
            { g: 'm', ok: false, s: `점 M은 선분 AB의 중점이다.${arrow}${SG('AM')} = 2${SG('AB')}`, why: `점 M이 선분 AB의 중점이면 ${SG('AB')} = 2${SG('AM')}이다.` },
            { g: 'e', ok: true, s: `두 선분 AB, CD의 길이가 같다.${arrow}${SG('AB')} = ${SG('CD')}` },
            { g: 'h', ok: true, s: `점 M은 선분 AB의 중점이다.${arrow}${SG('AM')} = ${frac(1, 2)}${SG('AB')}` }
          ];
          const picked = d.until(() => { const out = [], used = new Set(); for (const r of d.shuffle(rows)) { if (out.length === 4) break; if (used.has(r.g) || (r.g === 'h' && used.has('m')) || (r.g === 'm' && used.has('h'))) continue; used.add(r.g); out.push(r); } return out; }, (out) => out.length === 4 && out.filter((r) => !r.ok).length === 1);
          const at = picked.findIndex((r) => !r.ok);
          return C('다음 문장을 기호로 나타낸 것으로 옳지 않은 것은?', picked.map((r) => r.s), at, { explain: picked[at].why, facts: { truth: picked.map((r) => r.ok), want: false } });
        })
      ] },

      { id: 'angle', title: '각', standard: STD1, types: [
        T('angle-name', '그림의 각을 점 이름으로 나타내기', '①23 ②20', (d) => {
          const Bp = [0, 0], Cp = [118, 0], A = [d.int(52, 78), d.int(72, 86)], Dp = [170, 0], S = sheet(), which = d.pick(['x', 'y', 'z']);
          S.seg(Bp, [186, 0]).seg(Bp, A).seg(A, Cp).dot(Dp);
          S.angle(A, dirOf(A, Bp), dirOf(A, Cp), '{x}', { r: 14 }).angle(Bp, 0, dirOf(Bp, A), '{y}', { r: 16 }).angle(Cp, 0, dirOf(Cp, A), '{z}', { r: 13 });
          S.name(A, 'A', 90).name(Bp, 'B', 215, 12).name(Cp, 'C', 270, 12).name(Dp, 'D', 270, 12);
          const SPEC = { x: ['A', 'B', 'C', ['BAC', 'ABC', 'BAD', 'ACB']], y: ['B', 'A', 'C', ['ABC', 'BAC', 'ACB', 'ACD']], z: ['C', 'A', 'D', ['ACD', 'ACB', 'BCD', 'CAD']] }[which], opts = d.shuffle(SPEC[3]);
          return C(`다음 그림에서 ${angV(which)}를 점 A, B, C, D를 사용하여 기호로 나타낸 것은?`, opts.map((o) => '∠' + o), opts.indexOf(SPEC[3][0]), {
            figure: S.out('삼각형 ABC와, 변 BC를 점 C 쪽으로 늘인 선 위의 점 D. ∠x는 꼭짓점 A에서 삼각형의 안쪽에 표시한 각, ∠y는 꼭짓점 B에서 삼각형의 안쪽에 표시한 각, ∠z는 점 C에서 삼각형의 바깥쪽(선분 CA와 선분 CD 사이)에 표시한 각이다.'),
            explain: `${angV(which)}는 점 ${SPEC[0]}${pt(SPEC[0], '을/를')} 꼭짓점으로 하고 두 반직선 ${SPEC[0]}${SPEC[1]}, ${SPEC[0]}${SPEC[2]}${pt(SPEC[2], '을/를')} 변으로 하는 각이므로 ∠${SPEC[3][0]}이다. 각의 꼭짓점을 가운데에 쓴다.`,
            facts: { readAngle: { names: [SPEC[0], SPEC[1], SPEC[2]], options: opts } }
          });
        }),
        T('angle-kinds', '평각을 나눈 각을 예각, 직각, 둔각, 평각으로 나누기', '①24', (d) => {
          // 반직선 OD 는 직선 AB 에 수직이다(직각 표시는 하지 않는다 — 적힌 각을 더해 알아낸다).
          const [p, q] = d.until(() => [5 * d.int(6, 12), 5 * d.int(6, 12)], ([x, y]) => x !== y && x + y !== 90), parts = [p, 90 - p, q, 90 - q], cut = [180, 180 - p, 90, 90 - q, 0], pts = ['A', 'C', 'D', 'E', 'B'];
          const size = (name) => Math.abs(cut[pts.indexOf(name[0])] - cut[pts.indexOf(name[2])]), kindOf = (v) => (v < 90 ? '예각' : v === 90 ? '직각' : v < 180 ? '둔각' : '평각');
          const want = d.pick(['둔각', '예각']), ALL = ['AOC', 'AOD', 'AOE', 'COD', 'COE', 'COB', 'DOE', 'DOB', 'EOB'];
          const labels = d.until(() => d.shuffle(ALL).slice(0, 5).sort(), (ls) => { const k = ls.filter((x) => kindOf(size(x)) === want).length; return k >= 2 && k <= 3 && ls.some((x) => size(x) === 90); });
          const S = star([{ a: 180, name: 'A', ns: -90, len: 108 }, { a: 180 - p, name: 'C', len: 108 }, { a: 90, name: 'D', ns: -90, len: 108 }, { a: 90 - q, name: 'E', ns: -90, len: 108 }, { a: 0, name: 'B', ns: 90, len: 108 }],
            [{ from: 180 - p, to: 180, t: deg(parts[0]), r: 26, d: 44 }, { from: 90, to: 180 - p, t: deg(parts[1]), r: 34, d: 52 }, { from: 90 - q, to: 90, t: deg(parts[2]), r: 26, d: 44 }, { from: 0, to: 90 - q, t: deg(parts[3]), r: 34, d: 52 }], { oname: 'O' });
          return setQ(d, `다음 그림에서 ∠AOB는 평각이다. 다음 가운데 ${want}인 것을 모두 고른 것은?`, labels, labels.map((x) => kindOf(size(x)) === want), {
            show: (x) => '∠' + x, figure: S.out(`직선 AB 위의 점 O에서 위쪽으로 세 반직선 OC, OD, OE가 왼쪽부터 차례로 뻗어 있다. ∠AOC = ${parts[0]}°, ∠COD = ${parts[1]}°, ∠DOE = ${parts[2]}°, ∠EOB = ${parts[3]}°이다.`),
            explain: `${labels.map((x) => `∠${x} = ${size(x)}°`).join(', ')}이다. ${want === '둔각' ? '90°보다 크고 180°보다 작은 각이 둔각' : '0°보다 크고 90°보다 작은 각이 예각'}이므로 ${want}인 것은 ${labels.filter((x) => kindOf(size(x)) === want).map((x) => '∠' + x).join(', ')}이다.`
          });
        }),
        T('angle-read', '평각 위의 각을 기호로 읽어 크기 구하기', '②22 ①25 ②21', (d) => {
          const t = 5 * d.int(10, 16), flip = d.bool(), near = flip ? 'B' : 'A', far = flip ? 'A' : 'B';
          const S = star([{ a: 180, name: 'A', ns: -90 }, { a: flip ? t : 180 - t, name: 'C', ns: flip ? -90 : 90 }, { a: 90, name: 'D', ns: flip ? 90 : -90 }, { a: 0, name: 'B', ns: 90 }],
            [flip ? { from: 0, to: t, t: deg(t), r: 20 } : { from: 180 - t, to: 180, t: deg(t), r: 20 }, { right: flip ? 90 : 0 }], { oname: 'O' });
          return M(`다음 그림에서 ∠AOB가 평각일 때, ∠COD와 ∠CO${far}의 크기를 차례로 구하시오.`, [{ label: '∠COD', answer: 90 - t, unit: '°' }, { label: '∠CO' + far, answer: 180 - t, unit: '°' }], {
            figure: S.out(`직선 AB 위의 점 O에서 위쪽으로 두 반직선 OC, OD가 뻗어 있다. ∠${near}OC = ${t}°이고 ∠DO${far}에 직각 표시가 있다. 반직선 OC는 반직선 O${near}와 반직선 OD 사이에 있다.`),
            explain: `∠DO${far} = 90°이므로 ∠${near}OD = 180° − 90° = 90°이다. ∠COD = 90° − ${t}° = ${90 - t}°이고 ∠CO${far} = 180° − ${t}° = ${180 - t}°이다.`,
            facts: { calc: [[`90-${t}`, 0], [`180-${t}`, 1]], unseen: [90, 180] }
          });
        }),
        T('angle-flat-x', '평각을 나눈 각이 식으로 주어졌을 때', '①26 ②23', (d, n) => {
          if (n === 0) {
            const [x, b, a] = d.until(() => { const xx = d.int(15, 35), bb = d.pick([1, 2]); return [xx, bb, 90 - (bb + 1) * xx]; }, ([xx, bb, aa]) => aa >= 5 && aa <= 40 && aa % 5 === 0 && bb * xx >= 28 && xx + aa >= 28);
            const L = x + a, R = b * x, e1 = `({x} + ${a})°`, e2 = `${b === 1 ? '' : b}{x}°`;
            const S = star([{ a: 180, name: 'A', ns: -90, len: 104 }, { a: 180 - L, len: 80 }, { a: R, len: 80 }, { a: 0, name: 'B', ns: 90, len: 104 }],
              [{ from: 180 - L, to: 180, t: e1, r: 15, at: [-(26 + wide(e1, 12) / 2), 9] }, { right: R }, { from: 0, to: R, t: e2, r: 15, at: [26 + wide(e2, 12) / 2, 9] }], { oname: 'O' });
            return N(`다음 그림에서 ∠AOB가 평각일 때, ${V('x')}의 값은?`, x, { figure: S.out(`직선 AB 위의 점 O에서 위쪽으로 두 반직선이 뻗어 있다. 왼쪽 각은 (x + ${a})°, 가운데 각에는 직각 표시가 있고, 오른쪽 각은 ${b === 1 ? '' : b}x°이다.`),
              explain: `평각의 크기는 180°이므로 (${V('x')} + ${a}) + 90 + ${b === 1 ? '' : b}${V('x')} = 180이다. ${b + 1}${V('x')} = ${90 - a}에서 ${V('x')} = ${x}이다.`, facts: { calc: [[`(180-90-${a})/(${b}+1)`, 0]], unseen: [180, 90, 1].concat(b === 1 ? [1] : []) } });
          }
          const [x, p, q, r, a, c] = d.until(() => { const xx = d.pick([10, 12, 15, 18, 20, 24, 25]), pp = d.int(1, 4), qq = d.int(1, 3), rr = d.int(2, 4), cc = 5 * d.int(1, 6); return [xx, pp, qq, rr, 180 - (pp + qq + rr) * xx + cc, cc]; },
            ([xx, pp, qq, rr, aa, cc]) => aa >= 5 && aa <= 40 && aa % 5 === 0 && pp * xx + aa >= 32 && qq * xx >= 30 && rr * xx - cc >= 32 && pp * xx + aa <= 80 && rr * xx - cc <= 80);
          const L = p * x + a, R = r * x - c, co = (k) => (k === 1 ? '' : k), e1 = `(${co(p)}{x} + ${a})°`, e2 = `${co(q)}{x}°`, e3 = `(${co(r)}{x} − ${c})°`;
          const S = star([{ a: 180, name: 'A', ns: -90, len: 112 }, { a: 180 - L, len: 84 }, { a: R, len: 84 }, { a: 0, name: 'B', ns: 90, len: 112 }],
            [{ from: 180 - L, to: 180, t: e1, r: 15, at: [-(26 + wide(e1, 12) / 2), 9] }, { from: R, to: 180 - L, t: e2, r: 15, d: 38 }, { from: 0, to: R, t: e3, r: 15, at: [26 + wide(e3, 12) / 2, 9] }], { oname: 'O' });
          return N(`다음 그림에서 ∠AOB가 평각일 때, ${V('x')}의 값은?`, x, { figure: S.out(`직선 AB 위의 점 O에서 위쪽으로 두 반직선이 뻗어 있다. 왼쪽 각은 (${co(p)}x + ${a})°, 가운데 각은 ${co(q)}x°, 오른쪽 각은 (${co(r)}x − ${c})°이다.`),
            explain: `평각의 크기는 180°이므로 (${co(p)}${V('x')} + ${a}) + ${co(q)}${V('x')} + (${co(r)}${V('x')} − ${c}) = 180이다. ${p + q + r}${V('x')} = ${180 - a + c}에서 ${V('x')} = ${x}이다.`,
            facts: { calc: [[`(180-${a}+${c})/(${p}+${q}+${r})`, 0]], unseen: [180, 1] } });
        }, { count: 2 }),
        T('angle-ratio', '평각을 비로 나눈 각', '①27 ②24 심14', (d) => {
          const ratio = d.pick([[1, 2, 3], [2, 4, 3], [2, 3, 4], [3, 4, 5], [2, 3, 5], [3, 2, 4], [1, 3, 2], [4, 3, 2], [3, 5, 4], [2, 5, 3]]), sum = ratio[0] + ratio[1] + ratio[2], unit = 180 / sum, v = ratio.map((k) => k * unit), i = d.int(0, 2), nm = ['x', 'y', 'z'];
          const S = star([{ a: 180, name: 'A', ns: -90 }, { a: 180 - v[0] }, { a: v[2] }, { a: 0, name: 'B', ns: 90 }], [{ from: 180 - v[0], to: 180, t: '{x}' }, { from: v[2], to: 180 - v[0], t: '{y}' }, { from: 0, to: v[2], t: '{z}' }], { oname: 'O' });
          return N(`다음 그림에서 ∠AOB는 평각이고 ${angV('x')} : ${angV('y')} : ${angV('z')} = ${ratio.join(' : ')}일 때, ${angV(nm[i])}의 크기는?`, v[i], { unit: '°',
            figure: S.out('직선 AB 위의 점 O에서 위쪽으로 두 반직선이 뻗어 있다. 세 각은 왼쪽부터 차례로 ∠x, ∠y, ∠z이다.'),
            explain: `세 각의 크기의 합은 180°이다. ${ratio.join(' + ')} = ${sum}이므로 ${angV(nm[i])} = 180° × ${frac(ratio[i], sum)} = ${v[i]}°이다.`,
            facts: { calc: [[`180/(${ratio.join('+')})*${ratio[i]}`, 0]], unseen: [180] } });
        }),
        T('angle-right-split', '직각을 똑같이 나눈 반직선', '①28', (d) => {
          const k = d.pick([2, 3]), part = 90 / k, ends = k === 2 ? ['D'] : ['D', 'E'], ask = d.pick(ends), at = ends.indexOf(ask) + 1, ans = 90 + part * at;
          const arms = [{ a: 180, name: 'A', ns: -90 }, { a: 90, name: 'C', ns: 90 }].concat(ends.map((nm, i) => ({ a: 90 - part * (i + 1), name: nm, ns: 90 })), [{ a: 0, name: 'B', ns: 90 }]);
          const S = star(arms, [{ right: 90 }], { oname: 'O' });
          const equal = k === 2 ? '∠COD = ∠DOB' : '∠COD = ∠DOE = ∠EOB';
          return N(`다음 그림에서 ∠AOB는 평각이고 ∠AOC = 90°이다. ${equal}일 때, ∠AO${ask}의 크기는?`, ans, { unit: '°',
            figure: S.out(`직선 AB 위의 점 O에서 위쪽으로 반직선 OC, ${ends.map((e) => 'O' + e).join(', ')}${pt(ends[ends.length - 1], '이/가')} 왼쪽부터 차례로 뻗어 있다. ∠AOC에 직각 표시가 있다.`),
            explain: `∠COB = 180° − 90° = 90°이고 이 각을 똑같이 ${k}개로 나누었으므로 나누어진 각 하나의 크기는 90° ÷ ${k} = ${part}°이다. ∠AO${ask} = 90° + ${at === 1 ? part + '°' : part + '° × ' + at} = ${ans}°이다.`,
            facts: { calc: [[`90+90/${k}*${at}`, 0]], unseen: [k, at] } });
        })
      ] },

      { id: 'vert', title: '맞꼭지각', standard: STD1, types: [
        T('vert-find', '맞꼭지각 찾기', '①30', (d, n) => {
          if (n === 0) {
            const a0 = d.int(0, 20), a1 = a0 + d.int(50, 68), a2 = a1 + d.int(50, 68), cuts = [a0, a1, a2, a0 + 180, a1 + 180, a2 + 180, a0 + 360], letters = d.bool() ? 'abcdef' : 'cdefab';
            const S = star([a0, a1, a2].reduce((all, a) => all.concat([{ a, len: 78 }, { a: a + 180, len: 78 }]), []), range(0, 5).map((i) => ({ from: cuts[i], to: cuts[i + 1], t: '{' + letters[i] + '}', r: 15, d: 32 })));
            const i = d.int(0, 5), opp = (i + 3) % 6, opts = d.shuffle([opp].concat(d.shuffle([1, 2, 4, 5].map((k) => (i + k) % 6)).slice(0, 3)));
            return C(`다음 그림과 같이 세 직선이 한 점에서 만날 때, ${angV(letters[i])}의 맞꼭지각은?`, opts.map((k) => angV(letters[k])), opts.indexOf(opp), {
              figure: S.out(`한 점에서 만나는 세 직선이 만드는 여섯 각. 오른쪽에서 시작하여 시계 반대 방향으로 차례로 ∠${letters.split('').join(', ∠')}이다.`),
              explain: `맞꼭지각은 두 직선이 만나서 생기는 네 각 가운데 서로 마주 보는 각이다. ${angV(letters[i])}${pt(letters[i], '과/와')} 마주 보는 각은 ${angV(letters[opp])}이다.`, facts: { truth: opts.map((k) => k === opp), want: true } });
          }
          const t = d.int(48, 72), S = star([{ a: 180, name: 'A', ns: -90 }, { a: 0, name: 'B', ns: 90 }, { a: t, name: 'C', ns: -90 }, { a: t + 180, name: 'D', ns: -90 }], [], { oname: 'O', oat: 315 });
          const [given, right, wrongs] = d.pick([['AOC', 'BOD', ['AOD', 'BOC', 'AOB']], ['AOD', 'BOC', ['AOC', 'BOD', 'COD']], ['BOC', 'AOD', ['BOD', 'AOC', 'AOB']], ['BOD', 'AOC', ['BOC', 'AOD', 'COD']]]), opts = d.shuffle([right].concat(wrongs));
          return C(`다음 그림과 같이 두 직선 AB, CD가 점 O에서 만날 때, ∠${given}의 맞꼭지각은?`, opts.map((o) => '∠' + o), opts.indexOf(right), {
            figure: S.out('두 직선 AB, CD가 점 O에서 만난다. 점 A는 왼쪽, 점 B는 오른쪽, 점 C는 오른쪽 위, 점 D는 왼쪽 아래에 있다.'),
            explain: `∠${given}${pt(given, '과/와')} 서로 마주 보는 각은 ∠${right}이다.`, facts: { readAngle: { names: [right[1], right[0], right[2]], options: opts } } });
        }, { count: 2 }),
        T('vert-two', '두 직선이 만날 때 한 각으로 나머지 각 구하기', '①31 ②27', (d) => {
          const t = d.pick([50, 55, 60, 65, 70, 75, 105, 110, 115, 120, 125, 130]), h = t / 2, cuts = [-h, h, 180 - h, 180 + h, 360 - h], g = d.int(0, 3), yAt = d.pick([1, 3]), val = (k) => (k % 2 === 0 ? t : 180 - t);
          const given = val(g), marks = range(0, 3).map((k) => ({ from: cuts[k], to: cuts[k + 1], t: k === g ? deg(given) : k === (g + 2) % 4 ? '{x}' : k === (g + yAt) % 4 ? '{y}' : '', r: 14, arc: k !== (g + 4 - yAt) % 4 })).filter((m) => m.t);
          const S = star([{ a: h, len: 70 }, { a: h + 180, len: 70 }, { a: -h, len: 70 }, { a: 180 - h, len: 70 }], marks), W = ['오른쪽', '위쪽', '왼쪽', '아래쪽'];
          return M(`다음 그림에서 ${angV('x')}, ${angV('y')}의 크기를 차례로 구하시오.`, [{ label: angV('x'), answer: given, unit: '°' }, { label: angV('y'), answer: 180 - given, unit: '°' }], {
            shown: `${angV('x')} = ${given}°, ${angV('y')} = ${180 - given}°`,
            figure: S.out(`한 점에서 만나는 두 직선이 만드는 네 각. ${W[g]} 각의 크기는 ${given}°이고, ${W[(g + 2) % 4]} 각은 ∠x, ${W[(g + yAt) % 4]} 각은 ∠y이다.`),
            explain: `${angV('x')}는 ${given}°인 각의 맞꼭지각이므로 ${given}°이다. ${angV('y')}는 ${given}°인 각과 합하여 평각을 이루므로 180° − ${given}° = ${180 - given}°이다.`,
            facts: { calc: [[String(given), 0], [`180-${given}`, 1]], unseen: [180] } });
        }),
        T('vert-expr', '맞꼭지각이 식으로 주어졌을 때', '①32 ②30', (d, n) => {
          if (n === 0) {
            const [x, k, c] = d.until(() => [d.int(12, 40), d.pick([2, 3]), 5 * d.int(2, 8)], ([xx, kk, cc]) => { const v = kk * xx + cc; return (v >= 50 && v <= 78) || (v >= 102 && v <= 130); }), v = k * x + c, h = v / 2, e = `(${k}{x} + ${c})°`;
            const S = star([{ a: h, len: 76 }, { a: h + 180, len: 76 }, { a: -h, len: 76 }, { a: 180 - h, len: 76 }], [{ from: 180 - h, to: 180 + h, t: e, r: 14, at: [-(24 + wide(e, 12) / 2), 0] }, { from: -h, to: h, t: deg(v), r: 14, at: [24 + wide(deg(v), 12) / 2, 0] }]);
            return N(`다음 그림에서 ${V('x')}의 값은?`, x, { figure: S.out(`한 점에서 만나는 두 직선. 왼쪽 각은 (${k}x + ${c})°, 그와 마주 보는 오른쪽 각은 ${v}°이다.`),
              explain: `맞꼭지각의 크기는 서로 같으므로 ${k}${V('x')} + ${c} = ${v}이다. ${k}${V('x')} = ${v - c}에서 ${V('x')} = ${x}이다.`, facts: { calc: [[`(${v}-${c})/${k}`, 0]] } });
          }
          const [a, b] = d.until(() => [d.int(8, 40), d.int(5, 30)], ([p, q]) => { const v = 2 * p + q; return (v >= 48 && v <= 76) || (v >= 104 && v <= 132); }), x = a + b, v = x + a, h = v / 2, e1 = `({x} + ${a})°`, e2 = `(2{x} − ${b})°`;
          const S = star([{ a: h, len: 76 }, { a: h + 180, len: 76 }, { a: -h, len: 76 }, { a: 180 - h, len: 76 }], [{ from: 180 - h, to: 180 + h, t: e1, r: 14, at: [-(24 + wide(e1, 12) / 2), 0] }, { from: -h, to: h, t: e2, r: 14, at: [24 + wide(e2, 12) / 2, 0] }, { from: h, to: 180 - h, t: '{y}°', r: 14 }]);
          return M(`다음 그림에서 ${V('x')}, ${V('y')}의 값을 차례로 구하시오.`, [{ label: V('x'), answer: x }, { label: V('y'), answer: 180 - v }], { shown: `${V('x')} = ${x}, ${V('y')} = ${180 - v}`,
            figure: S.out(`한 점에서 만나는 두 직선. 왼쪽 각은 (x + ${a})°, 그와 마주 보는 오른쪽 각은 (2x − ${b})°, 위쪽 각은 y°이다.`),
            explain: `맞꼭지각의 크기는 서로 같으므로 ${V('x')} + ${a} = 2${V('x')} − ${b}에서 ${V('x')} = ${x}이다. 왼쪽 각의 크기는 ${x} + ${a} = ${v}(°)이고 위쪽 각과 합하여 평각을 이루므로 ${V('y')} = 180 − ${v} = ${180 - v}이다.`,
            facts: { calc: [[`${a}+${b}`, 0], [`180-(${a}+${b}+${a})`, 1]], unseen: [180] } });
        }, { count: 2 }),
        T('vert-right', '직각이 낀 맞꼭지각', '②26 ①33 ②31 심22', (d, n) => {
          if (n === 0) {
            const g = 5 * d.int(10, 14);
            const S = star([{ a: 0, len: 72 }, { a: 180, len: 72 }, { a: 90, len: 72 }, { a: 270, len: 72 }, { a: -g, len: 72 }, { a: 180 - g, len: 72 }], [{ right: 180 }, { from: 360 - g, to: 360, t: deg(g), r: 18 }, { from: 90, to: 180 - g, t: '{x}', r: 30 }]);
            return N(`다음 그림에서 ${angV('x')}의 크기는?`, 90 - g, { unit: '°', figure: S.out(`가로 직선과 세로 직선이 수직으로 만나고(직각 표시), 그 교점을 비스듬한 직선이 지난다. 가로 직선의 오른쪽과 비스듬한 직선의 아래쪽 사이의 각이 ${g}°이고, 세로 직선의 위쪽과 비스듬한 직선의 위쪽 사이의 각이 ∠x이다.`),
              explain: `세로 직선의 아래쪽과 비스듬한 직선의 아래쪽 사이의 각은 90° − ${g}° = ${90 - g}°이다. ${angV('x')}는 이 각의 맞꼭지각이므로 ${90 - g}°이다.`, facts: { calc: [[`90-${g}`, 0]], unseen: [90] } });
          }
          const t = 5 * d.int(5, 8);
          const S = star([{ a: 0, len: 74 }, { a: 180, len: 74 }, { a: t, len: 74 }, { a: t + 180, len: 74 }, { a: t + 90, len: 74 }, { a: t + 270, len: 74 }], [{ right: t }, { from: 0, to: t, t: deg(t), r: 24 }, { from: 180, to: t + 270, t: '{a}', r: 17 }]);
          return N(`다음 그림에서 ${angV('a')}의 크기는?`, 90 + t, { unit: '°', figure: S.out(`가로 직선과, 서로 수직인 두 비스듬한 직선이 한 점에서 만난다. 위쪽의 두 비스듬한 반직선 사이에 직각 표시가 있고, 가로 직선의 오른쪽과 오른쪽 위로 뻗은 반직선 사이의 각이 ${t}°이다. ∠a는 가로 직선의 왼쪽에서 아래로 돌아, 왼쪽 아래로 뻗은 반직선을 지나 오른쪽 아래로 뻗은 반직선까지의 각이다.`),
            explain: `${angV('a')}와 마주 보는 각은 ${t}°인 각과 직각을 합한 각이다. 맞꼭지각의 크기는 서로 같으므로 ${angV('a')} = ${t}° + 90° = ${90 + t}°이다.`, facts: { calc: [[`${t}+90`, 0]], unseen: [90] } });
        }, { count: 2 }),
        T('vert-three', '세 직선이 한 점에서 만날 때', '①34 ②28·29 심20·21', (d, n) => {
          if (n === 0) {
            const [p, q] = d.until(() => [5 * d.int(9, 16), 5 * d.int(8, 14)], ([x, y]) => 180 - x - y >= 40 && x !== y && 180 - x - y !== x && 180 - x - y !== y);
            const arms = [0, 180, q, q + 180, 180 - p, 360 - p].map((a) => ({ a, len: 72 }));
            const S = star(arms, [{ from: 180 - p, to: 180, t: deg(p), r: 17 }, { from: 0, to: q, t: deg(q), r: 17 }, { from: 180, to: 180 + q, t: '{x}', r: 17 }, { from: 180 + q, to: 360 - p, t: '{y}', r: 15 }]);
            return M(`다음 그림과 같이 세 직선이 한 점에서 만날 때, ${angV('x')}, ${angV('y')}의 크기를 차례로 구하시오.`, [{ label: angV('x'), answer: q, unit: '°' }, { label: angV('y'), answer: 180 - p - q, unit: '°' }], { shown: `${angV('x')} = ${q}°, ${angV('y')} = ${180 - p - q}°`,
              figure: S.out(`가로 직선과 비스듬한 두 직선이 한 점에서 만난다. 가로 직선의 왼쪽과 왼쪽 위로 뻗은 반직선 사이의 각이 ${p}°, 가로 직선의 오른쪽과 오른쪽 위로 뻗은 반직선 사이의 각이 ${q}°이다. ∠x는 가로 직선의 왼쪽과 왼쪽 아래로 뻗은 반직선 사이의 각이고, ∠y는 아래쪽으로 뻗은 두 반직선 사이의 각이다.`),
              explain: `${angV('x')}는 ${q}°인 각의 맞꼭지각이므로 ${q}°이다. ${angV('y')}는 위쪽으로 뻗은 두 반직선 사이의 각의 맞꼭지각이고, 그 각은 180° − ${p}° − ${q}° = ${180 - p - q}°이므로 ${angV('y')} = ${180 - p - q}°이다.`,
              facts: { calc: [[String(q), 0], [`180-${p}-${q}`, 1]], unseen: [180] } });
          }
          const [x, m, c] = d.until(() => { const xx = d.int(28, 44), mm = d.pick([2, 3]); return [xx, mm, 180 - (mm + 1) * xx]; }, ([xx, mm, cc]) => cc >= 28 && cc <= 60 && mm * xx >= 60 && mm * xx <= 120 && cc !== xx);
          const top = m * x, arms = [0, 180, c, c + 180, c + top, c + top + 180].map((a) => ({ a, len: 74 })), eT = `${m}{x}°`;
          const S = star(arms, [{ from: c, to: c + top, t: eT, r: 15 }, { from: 180, to: 180 + c, t: deg(c), r: 20 }, { from: 180 + c + top, to: 360, t: '{x}°', r: 20 }]);
          return N(`다음 그림과 같이 세 직선이 한 점에서 만날 때, ${V('x')}의 값은?`, x, {
            figure: S.out(`가로 직선과 비스듬한 두 직선이 한 점에서 만나 여섯 각을 만든다. 하나 건너 하나씩인 세 각의 크기가 적혀 있다: 위쪽의 두 비스듬한 반직선 사이의 각 ${m}x°, 가로 직선의 왼쪽과 왼쪽 아래로 뻗은 반직선 사이의 각 ${c}°, 가로 직선의 오른쪽과 오른쪽 아래로 뻗은 반직선 사이의 각 x°.`),
            explain: `${c}°인 각과 ${V('x')}°인 각을 맞꼭지각으로 옮기면 ${m}${V('x')}°인 각의 양옆에 놓여 평각을 이룬다. ${m}${V('x')} + ${c} + ${V('x')} = 180에서 ${m + 1}${V('x')} = ${180 - c}, ${V('x')} = ${x}이다.`,
            facts: { calc: [[`(180-${c})/(${m}+1)`, 0]], unseen: [180, 1] } });
        }, { count: 2 })
      ] },

      { id: 'perp', title: '수직과 수선, 점과 직선 사이의 거리', standard: STD1, types: [
        T('perp-claims', '직교하는 두 직선에 대한 설명', '①36', (d) => {
          const S = star([{ a: 180, name: 'A', ns: -90 }, { a: 0, name: 'B', ns: 90 }, { a: 90, name: 'C', ns: 90, len: 64 }, { a: 270, name: 'D', ns: -90, len: 64 }], [{ right: 0 }], { oname: 'O', oat: 225 });
          const rows = [
            { ok: true, s: `${LN('AB')} ⊥ ${LN('CD')}` }, { ok: true, s: '두 직선 AB, CD는 직교한다.' }, { ok: true, s: '직선 CD는 직선 AB의 수선이다.', g: 'sus' }, { ok: true, s: '점 C에서 직선 AB에 내린 수선의 발은 점 O이다.', g: 'footC' },
            { ok: true, s: `점 A와 직선 CD 사이의 거리는 ${SG('AO')}의 길이이다.`, g: 'dA' }, { ok: true, s: '∠AOD = 90°', g: 'ang' },
            { ok: false, s: `점 D와 직선 AB 사이의 거리는 ${SG('AD')}의 길이이다.`, why: `점 D에서 직선 AB에 내린 수선의 발은 점 O이므로 점 D와 직선 AB 사이의 거리는 ${SG('DO')}의 길이이다.` },
            { ok: false, s: '점 A에서 직선 CD에 내린 수선의 발은 점 C이다.', why: '점 A에서 직선 CD에 내린 수선의 발은 두 직선의 교점인 점 O이다.' },
            { ok: false, s: `점 B와 직선 CD 사이의 거리는 ${SG('BC')}의 길이이다.`, why: `점 B에서 직선 CD에 내린 수선의 발은 점 O이므로 점 B와 직선 CD 사이의 거리는 ${SG('BO')}의 길이이다.` },
            { ok: false, s: '∠BOD는 예각이다.', why: '두 직선이 직교하므로 ∠BOD = 90°이다.', g: 'ang' }
          ];
          return sayQ(d, '다음 그림에 대한 설명으로 옳지 않은 것은?', rows, false, { figure: S.out('가로 직선 AB와 세로 직선 CD가 점 O에서 만나고 직각 표시가 있다. 점 A는 왼쪽, 점 B는 오른쪽, 점 C는 위쪽, 점 D는 아래쪽에 있다.') });
        }),
        T('perp-bisector', '수직이등분선', '②34', (d) => {
          const half = d.int(3, 12), S = sheet(), A = [0, 0], Mp = [90, 0], Bp = [180, 0], P = [90, 50];
          S.seg(A, Bp).seg([90, -34], [90, 72]).right(Mp, 0, 8).tick(A, Mp, 1).tick(Mp, Bp, 1).dot(A).dot(Bp).dot(Mp, 2.4).dot(P).name(A, 'A', 180, 12).name(Bp, 'B', 0, 12).name(Mp, 'M', 225, 13).name(P, 'P', 0, 12).text([90, 82], '{l}');
          return M(`다음 그림에서 직선 ${V('l')}은 ${SG('AB')}의 수직이등분선이다. ${SG('AB')} = ${half * 2} cm일 때, ㉠, ㉡에 알맞은 수를 차례로 구하시오.`, [{ label: '㉠', answer: half }, { label: '㉡', answer: 90 }], {
            figure: S.out('선분 AB의 한가운데 점 M을 지나는 세로 직선 l. 직선 l 위에, 점 M의 위쪽에 점 P가 있다. 선분 AM과 선분 MB에 길이가 같다는 표시가 있고 점 M에 직각 표시가 있다.') + lines([`${SG('AM')} = ${box('㉠')} cm`, `∠PMB = ${box('㉡')}°`]),
            explain: `선분의 중점을 지나고 그 선분에 수직인 직선이 수직이등분선이다. 점 M은 ${SG('AB')}의 중점이므로 ${SG('AM')} = ${half * 2} ÷ 2 = ${half}(cm)이고, 직선 ${V('l')}${pt('l', '과/와')} ${SG('AB')}${pt('B', '은/는')} 수직이므로 ∠PMB = 90°이다.`,
            facts: { calc: [[`${half * 2}/2`, 0], ['90', 1]], unseen: [2, 90] } });
        }),
        T('perp-trapezoid', '사다리꼴에서 수선, 수선의 발, 점과 변 사이의 거리', '①37 ②35·37', (d, n) => {
          // 사다리꼴 ABCD(A 왼쪽 위, B 왼쪽 아래, C 오른쪽 아래, D 오른쪽 위). mirror 이면 ∠C, ∠D 가 직각, 아니면 ∠A, ∠B 가 직각이다.
          const [top, h, bot] = d.until(() => [d.int(3, 8), d.int(4, 8), d.int(6, 12)], ([t, hh, b]) => b - t >= 2 && b - t <= 5 && hh !== t && hh !== b), mirror = d.bool(), u = Math.min(17, 168 / bot);
          const Pt = mirror ? { A: [(bot - top) * u, h * u], B: [0, 0], C: [bot * u, 0], D: [bot * u, h * u] } : { A: [0, h * u], B: [0, 0], C: [bot * u, 0], D: [top * u, h * u] }, cen = [bot * u / 2, h * u / 2], S = sheet();
          S.poly(['A', 'B', 'C', 'D'].map((k) => Pt[k]), 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round');
          if (mirror) S.right(Pt.C, 90, 8).right(Pt.D, 180, 8); else S.right(Pt.A, 270, 8).right(Pt.B, 0, 8);
          'ABCD'.split('').forEach((k) => S.name(Pt[k], k, dirOf(cen, Pt[k]), 12));
          const upright = mirror ? 'CD' : 'AB';
          S.side(Pt.A, Pt.D, top + ' cm', cen).side(Pt.B, Pt.C, bot + ' cm', cen).side(Pt[upright[0]], Pt[upright[1]], h + ' cm', cen);
          const figure = S.out(`사다리꼴 ABCD. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다. ${mirror ? '∠C와 ∠D' : '∠A와 ∠B'}에 직각 표시가 있다. 변 AD의 길이는 ${top} cm, 변 BC의 길이는 ${bot} cm, 변 ${upright}의 길이는 ${h} cm이다.`);
          const sides = ['AB', 'BC', 'CD', 'AD'], vec = (s) => [Pt[s[1]][0] - Pt[s[0]][0], Pt[s[1]][1] - Pt[s[0]][1]], perp = (s, r) => Math.abs(vec(s)[0] * vec(r)[0] + vec(s)[1] * vec(r)[1]) < 1e-6;
          if (n === 0) {
            const base = d.pick(['BC', 'AD']), opts = d.shuffle(sides.filter((s) => s !== base));
            return C(`다음 사다리꼴 ABCD에서 변 ${base}${pt(base, '과/와')} 직교하는 변은?`, opts.map((s) => '변 ' + s), opts.indexOf(upright), { figure, explain: `${mirror ? '∠C와 ∠D' : '∠A와 ∠B'}가 직각이므로 변 ${upright}${pt(upright, '은/는')} 변 ${base}${pt(base, '과/와')} 수직으로 만난다.`, facts: { truth: opts.map((s) => perp(s, base)), want: true } });
          }
          // 꼭짓점 p 에서 변 s 에 내린 수선의 발이 꼭짓점인 경우만 묻는다.
          const foot = (p, s) => { const a = Pt[s[0]], v = vec(s), t = ((Pt[p][0] - a[0]) * v[0] + (Pt[p][1] - a[1]) * v[1]) / (v[0] * v[0] + v[1] * v[1]); return 'ABCD'.split('').find((k) => Math.hypot(Pt[k][0] - a[0] - t * v[0], Pt[k][1] - a[1] - t * v[1]) < 1e-6); };
          const asks = []; 'ABCD'.split('').forEach((p) => sides.forEach((s) => { if (!s.includes(p) && foot(p, s)) asks.push([p, s, foot(p, s)]); }));
          const [p, s, ft] = d.pick(asks);
          if (n === 1) {
            const opts = d.shuffle('ABCD'.split(''));
            return C(`다음 사다리꼴 ABCD에서 점 ${p}에서 변 ${s}에 내린 수선의 발은?`, opts.map((k) => '점 ' + k), opts.indexOf(ft), { figure, explain: `점 ${p}에서 변 ${s}에 수직으로 그은 선분은 변 ${[p, ft].sort().join('')}이고, 이 선분이 변 ${s}${pt(s, '과/와')} 만나는 점 ${ft}${pt(ft, '이/가')} 수선의 발이다.`, facts: { truth: opts.map((k) => k === ft), want: true } });
          }
          const len = Math.round(Math.hypot(Pt[p][0] - Pt[ft][0], Pt[p][1] - Pt[ft][1]) / u);
          return N(`다음 사다리꼴 ABCD에서 점 ${p}${pt(p, '과/와')} 변 ${s} 사이의 거리는 몇 cm인가?`, len, { unit: 'cm', figure, explain: `점 ${p}에서 변 ${s}에 내린 수선의 발은 점 ${ft}이다. 점 ${p}${pt(p, '과/와')} 변 ${s} 사이의 거리는 선분 ${[p, ft].sort().join('')}의 길이인 ${len} cm이다.`, facts: { calc: [[String(len), 0]] } });
        }, { count: 3 }),
        T('perp-parallelogram', '평행사변형에서 점과 직선 사이의 거리', '①38 ②38', (d) => {
          // 밑변 BC 를 b, 옆으로 기운 만큼을 p = 0.75h 로 잡으면 CD = 1.25h, 점 A 와 직선 CD 사이의 거리 AF = 0.8b 이다. 수선의 발 F 가 변 CD 위에 놓이게 고른다.
          const [h, af] = d.pick([[4, 5], [4, 6], [6, 7], [6, 8], [6, 9], [8, 9], [8, 10], [8, 11], [8, 12]]), b = af * 1.25, p = 0.75 * h, u = 214 / (b + p);
          const Bp = [0, 0], Cp = [b * u, 0], Dp = [(b + p) * u, h * u], A = [p * u, h * u], E = [(b + p) * u, 0], t = ((p - b) * p + h * h) / (p * p + h * h), Fp = [Cp[0] + t * p * u, t * h * u], cen = [(b + p) * u / 2, h * u / 2], S = sheet();
          S.poly([A, Bp, Cp, Dp], 'fill:' + CREAM + ';stroke:#1f2933;stroke-width:1.6;stroke-linejoin:round').seg(Cp, E, 'dash').seg(Dp, E, 'dash').seg(A, Fp, 'thin').right(E, 90, 7).right(Fp, dirOf(Fp, Dp), 7);
          S.name(A, 'A', 135).name(Bp, 'B', 225).name(Cp, 'C', 270, 12).name(Dp, 'D', 45).name(E, 'E', 315, 12).name(Fp, 'F', (dirOf(Fp, A) + dirOf(Fp, Cp)) / 2, 13);
          S.text([E[0] + 6 + wide(h + ' cm', 12) / 2, h * u / 2], h + ' cm', { small: true }).side(A, Fp, af + ' cm', [A[0], 0], 4);
          return M('다음 그림의 평행사변형 ABCD에서 ㉠ 점 A와 직선 BC 사이의 거리, ㉡ 점 B와 직선 CD 사이의 거리를 차례로 구하시오.', [{ label: '㉠', answer: h, unit: 'cm' }, { label: '㉡', answer: af, unit: 'cm' }], {
            figure: S.out(`평행사변형 ABCD. 점 A는 왼쪽 위, 점 B는 왼쪽 아래, 점 C는 오른쪽 아래, 점 D는 오른쪽 위에 있다. 점 D에서 변 BC를 점 C 쪽으로 늘인 선에 내린 수선의 발이 점 E이고 선분 DE의 길이는 ${h} cm이다. 점 A에서 변 CD에 내린 수선의 발이 점 F이고 선분 AF의 길이는 ${af} cm이다. 점 E와 점 F에 직각 표시가 있다.`),
            explain: `변 AD와 직선 BC는 평행하므로 점 A와 직선 BC 사이의 거리는 점 D와 직선 BC 사이의 거리인 ${SG('DE')}의 길이와 같은 ${h} cm이다. 변 AB와 직선 CD도 평행하므로 점 B와 직선 CD 사이의 거리는 점 A와 직선 CD 사이의 거리인 ${SG('AF')}의 길이와 같은 ${af} cm이다.`,
            facts: { calc: [[String(h), 0], [String(af), 1]] } });
        }),
        T('perp-grid', '모눈종이에서 점과 직선 사이의 거리', '①39', (d) => {
          const cols = 9, rows = 7, U = 20, flat = d.bool(), at = flat ? d.int(3, 4) : d.int(4, 5), unit = d.pick([1, 2, 3]);
          const gaps = d.until(() => [d.int(1, 3), -d.int(1, 3), d.pick([1, -1]) * d.int(1, 3)], (g) => new Set(g.map(Math.abs)).size >= 2), along = d.shuffle(flat ? [1, 3, 5, 7, 8] : [1, 2, 4, 5, 6]).slice(0, 3).sort((x, y) => x - y);
          const pts = gaps.map((g, i) => (flat ? [along[i], at + g] : [at + g, along[i]])), names = d.shuffle(['A', 'B', 'C']), S = sheet();
          for (let x = 0; x <= cols; x += 1) S.add(`<line class="mb-gridline" x1="${x * U}" y1="0" x2="${x * U}" y2="${-rows * U}"/>`);
          for (let y = 0; y <= rows; y += 1) S.add(`<line class="mb-gridline" x1="0" y1="${-y * U}" x2="${cols * U}" y2="${-y * U}"/>`);
          S.see([0, 0], 2).see([cols * U, rows * U], 2);
          if (flat) S.seg([-8, at * U], [cols * U + 8, at * U]).text([cols * U + 17, at * U], '{l}'); else S.seg([at * U, -8], [at * U, rows * U + 8]).text([at * U, rows * U + 17], '{l}');
          pts.forEach((p, i) => { S.dot([p[0] * U, p[1] * U], 3); S.name([p[0] * U, p[1] * U], names[i], 45, 11); });
          const order = ['A', 'B', 'C'], gapOf = (nm) => Math.abs(gaps[names.indexOf(nm)]), sideOf = (nm) => { const g = gaps[names.indexOf(nm)]; return flat ? (g > 0 ? '위쪽' : '아래쪽') : g > 0 ? '오른쪽' : '왼쪽'; };
          return M(`다음 그림에서 모눈 한 칸의 가로와 세로의 길이는 각각 ${unit} cm이다. 세 점 A, B, C와 직선 ${V('l')} 사이의 거리를 차례로 구하시오.`, order.map((nm) => ({ label: nm, answer: gapOf(nm) * unit, unit: 'cm' })), {
            figure: S.out(`모눈종이 위에 ${flat ? '가로' : '세로'}로 놓인 직선 l과 세 점 A, B, C. 모눈 한 칸의 길이는 ${unit} cm이다. ${order.map((nm) => `점 ${nm}${pt(nm, '은/는')} 직선 l에서 ${sideOf(nm)}으로 ${gapOf(nm)}칸 떨어져 있다.`).join(' ')}`),
            explain: `점에서 직선 ${V('l')}에 내린 수선의 발까지의 거리를 모눈의 칸 수로 센다. ${order.map((nm) => `점 ${nm}${pt(nm, '은/는')} ${gapOf(nm)}칸이므로 ${gapOf(nm) * unit} cm`).join(', ')}이다.`,
            facts: { calc: order.map((nm, i) => [`${gapOf(nm)}*${unit}`, i]) } });
        })
      ] },

      { id: 'plane', title: '평면에서의 위치 관계', standard: STD1, types: [] },
      { id: 'space', title: '공간에서의 위치 관계', standard: STD1, types: [] },
      { id: 'trans', title: '동위각과 엇각', standard: STD2, types: [] },
      { id: 'para', title: '평행선의 성질', standard: STD2, types: [] }
    ]
  });

  // 같은 단원의 다른 파일(7-2-1b.js, 7-2-1c.js)이 함께 쓰는 것
  B.kit.m721 = {
    STD1, STD2, T, H, pt, mh, ms, mp, ang, angV, deg, over, LN, RY, SG, sym, list, setQ, sayQ, tagQ, mixRows,
    f1, RAD, pol, dirOf, dist, mid2, segGap, wide, CREAM, BLUE, sheet, tiles, onLine, star,
    sub3, dot3, cross3, makeSolid, relLL, perpLL, relLP, perpLP, relPP, perpPP, share, hasEdge, cleanEdge, others, SOL, drawSolid, solidSay, edgeList,
    para, sector, sizeAt, SPOT
  };
})(typeof window !== 'undefined' ? window : globalThis);
