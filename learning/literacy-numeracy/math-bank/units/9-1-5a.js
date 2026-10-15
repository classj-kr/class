// 중학교 3학년 1학기 5단원 이차함수와 그 그래프 — 단원 틀·단원 안의 도구와 앞쪽 묶음(이차함수의 뜻, 함숫값, 이차함수 y = ax²의 그래프).
// 수집해 둔 교과서 한 종(미래엔 황선욱 2015)의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1: 41꼴, 심화꼴: 17꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 뺌(까닭) / 겹침」을 가른 대조표는 references/textbooks/수학/_분석/9-1-5/싣기_대조표.md 에 있다.
// (그래프의 성질, 그래프 위의 점과 식, 그래프 위의 점과 길이는 9-1-5b.js 에, 실력 문항은 9-1-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계. 성취기준은 9수02-21(이차함수의 개념을 이해한다), 9수02-22(이차함수의 그래프를 그릴 수 있고, 그 성질을 설명할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·상황·표·그림·점), 묻는 것(값·계수·좌표·고르기·차례·개수)이 다르면 따로 싣는다. 수와 이름만 다른 것은 한 번만 싣는다.
//  - 이 단원은 y = ax²의 그래프까지다. 평행이동한 그래프(y = ax² + q, y = a(x − p)² + q)와 y = ax² + bx + c의 그래프는 다음 단원(9-1-6)의 일이라 꼴 목록을 만들 때 이미 뺐다.
//    「x의 값이 증가할 때 y의 값의 증가·감소」「x축에 서로 대칭인 그래프」는 교과서가 y = ax²의 성질로 가르치므로 싣는다.
//  - 답: 음수일 수 있는 수(함숫값·계수·좌표)는 모두 부호 단추가 붙은 칸으로 받는다. 넓이·길이·시간·개수만 단추 없이 받는다.
//    한 유형 안에서는 씨앗이 바뀌어도 칸의 모양이 같다(정수 칸, 분수 칸, 근호 칸 「[±][ ]√[ ]」을 유형마다 하나로 정했다).
//    이차함수의 식이 답인 꼴은 계수가 분수인 것이 많아 고르기로 냈다. 「a + b의 값」「모든 k의 값의 곱」처럼 따로 구한 수를 더하거나 곱하는 꼴은
//    구하는 수 하나를 묻거나(다른 점의 y좌표, 양수인 k), 수를 하나하나 답하게 바꾸었다. 「모두 구하시오」는 「모두 고른 것」 고르기나 두 칸(차례 없이)으로 바꾸었다.
//  - 용어는 교육과정의 것만 쓴다: 이차함수, 포물선, 축, 꼭짓점, 함숫값, f(x). 정해진 수는 「수 a」로 적는다(「상수」는 쓰지 않는다).
//  - 그림: 눈금이 있는 좌표평면은 공용 도구 plane 의 parabolas 로 그린다(이 파일의 geo 가 원점 이름·눈금 수·이름표·축 위의 수를 12px 로 덧대고 겹치지 않는 자리를 고른다).
//    그래프를 고르는 문항은 이 파일의 작은 좌표평면 mini 를 보기마다 그린다. 모양만 보이는 그림(눈금 없는 그림)은 그래프를 보기 좋게 그리고,
//    그림 설명에는 그림에서 읽을 수 있는 것(볼록한 쪽, 폭의 차례, 점의 자리)만 적는다(계수를 적으면 답이 드러난다).
//    정사각형을 잘라 낸 그림은 공용 도형 판 B.kit.mgeo 의 Board 로 그린다.
//    뽑은 글에는 그림이 없어 교과서·지도서 쪽 그림을 보고 그림의 얼개를 정했고, 수준별 문제은행·중단원 마무리의 그림은 풀이 글로 되살렸다. 수와 상황은 모두 새로 정했다.
//  - 꼴 목록에 적힌 원문 답은 따르지 않는다. 답은 모두 코드가 셈한다.
//
// 뺀 것과 까닭(9-1-5b.js, 9-1-5c.js 의 것까지 여기에 모아 적는다)
//  - 앞 단원·앞 학년의 일: 이차식 가리기(①2의 변형 — 교과서 준비 문제), 일차함수의 함숫값(①8의 변형 — 중2 8-1-5).
//  - 서술형·작도: 그래프 그리기(①15 — 「알맞은 그래프 고르기」로 바꾸어 실었다), 까닭 쓰기(①7의 「이유」, ①8의 「f(40)이 소수가 아님을 설명」, ①23의 「x축보다 아래에 나타나지 않는 이유」).
//  - 상위 학년(고등학교)의 일: 포물선과 직선의 교점으로 만든 삼각형(심12 — 이차함수의 그래프와 직선의 위치 관계).
//  - 뜻 없는 셈: q − p(①26의 지수09 — 범위 자체를 고르게 했다), a + b·ab·a − b·모든 근의 합·곱(여러 꼴 — 수를 하나하나 답하거나 모두 고르게 바꾸었다).
//  - 교육과정 밖의 기호: 가우스 기호 [a](심16 — 기호는 빼고 「두 그래프 사이」에 드는 a 를 모두 고르게 했다).
//  - 같은 일이어서 한 번만 실은 것은 대조표에 「겹침」으로 적었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, box, N, M, C, F, inline } = B.kit;
  const { LAB, MINUS, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, tj, js, V, sup, tag, f1, nz, pm, ansV, asQ, mono, poly, plain, plane, rt, radText, sqParts, gcd } = B.kit.mid;
  const { Board, TINT, sv } = B.kit.mgeo;
  const S21 = '9수02-21', S22 = '9수02-22';
  // ref 에 기본꼴(①)만 있으면 기본 자료, 심화꼴(심)만 있으면 심화 자료
  const sourceOf = (ref) => '수집본 ' + (/①/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), FN = V('f'), GN = V('g'), A = V('a'), BB = V('b'), CC = V('c'), K = V('k'), MM = V('m'), NN = V('n'), TT = V('t'), HH = V('h'), PP = V('p'), QQ = V('q');
  const X2 = X + sup(2), XA = X + '축', YA = Y + '축';
  const TAG6 = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ'];
  const num = (v) => (typeof v === 'number' ? v : fl(v));
  const iq = (n) => tx(asQ(n));                                   // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (n) => js(asQ(n));                                   // 검사 식에 적는 수: (-3), (3/4), (-3/4)
  const par = (n) => (num(n) < 0 ? `(${iq(n)})` : iq(n));         // 곱셈식에 적는 수(음수는 괄호)
  const nj = (n, pair) => tj(asQ(n), pair);                       // 수 뒤에 토씨
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);
  const quad = (a, b, c) => poly([[a, X2], [b || 0, X], [c || 0, '']]);      // ax² + bx + c
  const eqY = (h) => nb(`${Y} = ${h}`);
  const eqA = (a) => eqY(quad(a));                                 // y = ax²
  const fx = (h) => nb(`${FN}(${X}) = ${h}`);
  const fv = (v) => nb(`${FN}(${typeof v === 'string' ? v : iq(v)})`);
  const cx = (v) => (typeof v === 'string' ? v : iq(v));
  const pt = (x, y) => nb(`(${cx(x)}, ${cx(y)})`);
  // 문자 뒤 토씨: l(엘)·m(엠)·n(엔)만 받침이 있다(엘 뒤의 「으로/로」는 「로」).
  const ltail = (name, pair) => { const [yes, no] = pair.split('/'), c = String(name).replace(/<[^>]+>/g, '').trim().slice(-1).toLowerCase(); return pair === '으로/로' ? (c === 'm' || c === 'n' ? yes : no) : /[lmn]/.test(c) ? yes : no; };
  // 식 뒤 토씨: 식의 끝이 거듭제곱(제곱)이면 받침이 있고, 수면 그 수를 읽은 소리, 문자면 문자 이름으로 정한다.
  function ejosa(h, pair) {
    const t = String(h).replace(/<sup>[^<]*<\/sup>/g, '²').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const last = t.replace(/[)\]]+$/, '');
    if (/²$/.test(last)) return pair.split('/')[pair === '으로/로' ? 0 : 0];
    const m = last.match(/(\d+)$/);
    if (m) return tail(Number(m[1]), pair);
    return ltail(last.slice(-1), pair);
  }
  const ptj = (x, y, pair) => nb(`(${cx(x)}, ${cx(y)})`) + (typeof y === 'string' ? ltail(y, pair) : tail(lastOf(asQ(y)), pair));
  const sgnTerm = (n) => `${num(n) < 0 ? MINUS : '+'} ${iq(qabs(asQ(n)))}`;   // 「+ 3」「− 3」
  const sgnCoef = (c, v) => `${num(c) < 0 ? MINUS : '+'} ${num(c) === 1 || num(c) === -1 ? '' : iq(qabs(asQ(c)))}${v}`;   // 「+ 3k」「− k」
  const coef = (c, v) => `${num(c) < 0 ? MINUS : ''}${num(c) === 1 || num(c) === -1 ? '' : iq(qabs(asQ(c)))}${v}`;          // 「3k」「−k」(맨 앞 항)
  // 이름표를 붙인 식을 두 줄로 늘어놓는다. 긴 글은 한 줄에 하나씩(rows1).
  const grid2 = (list, tags) => '<div class="mb-lines" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 10px">' + list.map((h, i) => '<div>' + tag((tags || TAG6)[i]) + h + '</div>').join('') + '</div>';
  const rows1 = (list, tags) => lines(list.map((h, i) => tag((tags || TAG6)[i]) + h));
  const tagsOf = (flags, tags) => flags.map((f, i) => (f ? (tags || TAG6)[i] : '')).filter(Boolean).join(', ');
  // 「모두 고른 것」: 맞는 것(flags 가 참인 것)의 모임과, 하나를 빠뜨리거나 더하거나 바꿔친 모임 n − 1개를 보기로 낸다.
  function setPick(d, flags, tags, n) {
    const idx = flags.map((_, i) => i), yes = idx.filter((i) => flags[i]), no = idx.filter((i) => !flags[i]);
    const key = (s) => s.slice().sort((p, q) => p - q).join(',');
    const cands = [];
    if (yes.length > 1) for (const i of yes) cands.push(yes.filter((j) => j !== i));
    for (const j of no) cands.push(yes.concat([j]));
    for (const i of yes) for (const j of no) cands.push(yes.filter((k) => k !== i).concat([j]));
    if (no.length) cands.push(no);
    const seen = new Set([key(yes)]), pool = [];
    for (const s of d.shuffle(cands)) { const k = key(s); if (s.length && !seen.has(k)) { seen.add(k); pool.push(s); } }
    if (pool.length < n - 1) throw new Error('보기를 만들 모임이 모자라다');
    const sets = d.shuffle([yes].concat(pool.slice(0, n - 1))).map((s) => s.slice().sort((p, q) => p - q));
    const truth = sets.map((s) => key(s) === key(yes));
    return { options: sets.map((s) => s.map((i) => (tags || TAG6)[i]).join(', ')), at: truth.indexOf(true), truth };
  }
  // 가로로 놓은 표: 첫 칸은 이름, 나머지 칸은 값(글).
  const xyTable = (rows) => '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + rows.map((row) => '<tr>' + row.map((c) => '<td style="padding:5px 9px">' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const ssq = (v) => (v < 0 ? `(${iq(v)})` : iq(v)) + sup(2);   // (−3)², 3²
  // 대입한 식: a × p² + b × p + c 를 풀어 적는다(계수 1은 적지 않고, 음수·분수는 괄호에 넣는다).
  const sqOf = (p) => (num(p) < 0 || !isInt(asQ(p)) ? `(${iq(p)})` : iq(p)) + sup(2);
  const times = (c, h) => (num(c) === 1 ? h : num(c) === -1 ? MINUS + h : `${iq(c)} × ${h}`);
  const subst = (a, b, c, p) => [times(a, sqOf(p)), num(b || 0) === 0 ? '' : `${num(b) < 0 ? MINUS : '+'} ${times(qabs(asQ(b)), num(p) < 0 || !isInt(asQ(p)) ? `(${iq(p)})` : iq(p))}`, num(c || 0) === 0 ? '' : sgnTerm(c)].filter(Boolean).join(' ');

  // ── 그림 ──
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  // 그림 속 글: 문자는 기울인 글자로(sv), 음수는 −
  const svText = (t) => String(t).replace(/<i class="mb-var">([^<]*)<\/i>/g, (all, name) => sv(name)).replace(/<sup>([^<]*)<\/sup>/g, '<tspan dy="-5" style="font-size:0.72em">$1</tspan><tspan dy="5"> </tspan>');
  const bare = (t) => String(t).replace(/<[^>]+>/g, '');
  const textW = (t, size) => { let w = 0; for (const ch of bare(t)) w += /[가-힣㉠-㉯ㄱ-ㅎ]/.test(ch) ? 1 : /[A-Z]/.test(ch) ? 0.72 : ch === ' ' ? 0.3 : /[()+.,/]/.test(ch) ? 0.5 : /[−=]/.test(ch) ? 0.62 : 0.62; return w * (size || 12) + 3; };
  // 점에서 선분까지의 거리
  const toSeg = (x, y, [x1, y1, x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - x1 - t * dx, y - y1 - t * dy); };
  // 글 상자(가운데 cx0, cy0, 반 너비 w, 반 높이 h)와 점들·선분들·다른 상자 사이의 가장 좁은 틈
  // 점들을 10px 칸으로 나누어 둔다(가까운 칸의 점만 재려고). 20px 넘게 떨어진 점은 재지 않는다.
  const CELL = 10, FAR = 20;
  function indexDots(dots) { const g = new Map(); for (const p of dots) { const k = Math.floor(p[0] / CELL) + ',' + Math.floor(p[1] / CELL); if (!g.has(k)) g.set(k, []); g.get(k).push(p); } return g; }
  function roomOf(cx0, cy0, w, h, dots, segs, boxes) {
    let m2 = FAR * FAR;
    const near = (p) => { const ddx = Math.abs(p[0] - cx0) - w, ddy = Math.abs(p[1] - cy0) - h, ex = ddx > 0 ? ddx : 0, ey = ddy > 0 ? ddy : 0, v = ex * ex + ey * ey; if (v < m2) m2 = v; };
    if (dots instanceof Map) {
      for (let i = Math.floor((cx0 - w - FAR) / CELL); i <= Math.floor((cx0 + w + FAR) / CELL); i += 1) for (let j = Math.floor((cy0 - h - FAR) / CELL); j <= Math.floor((cy0 + h + FAR) / CELL); j += 1) { const list = dots.get(i + ',' + j); if (list) for (const p of list) near(p); }
    } else for (const p of dots) near(p);
    let m = Math.sqrt(m2);
    for (const s of segs) for (const sx of [-1, -0.5, 0, 0.5, 1]) for (const sy of [-1, 0, 1]) m = Math.min(m, toSeg(cx0 + sx * w, cy0 + sy * h, s));
    for (const [bx, by, bw, bh] of boxes) { const gx = Math.abs(bx - cx0) - bw - w, gy = Math.abs(by - cy0) - bh - h; m = Math.min(m, Math.max(gx, gy)); }
    return m;
  }

  // geo(o): 좌표평면. 공용 도구 plane 에 다음을 덧댄다(plane 의 o 를 그대로 받는다).
  //  ① 원점 이름 O 와 눈금 수(o.ticks: 'all' · 'none' · 수의 배열)를 12px 로, 선·글과 닿지 않는 자리에 적는다.
  //  ② 포물선의 이름(parabolas[i].name)과 점의 이름(points[i].name)을 선·다른 글과 닿지 않는 자리에 적는다(o.nameAt: 포물선 이름을 둘 x 의 차례, 기본은 상자 끝).
  //  ③ 축 위에 적는 수: o.xnums [{ v, text }](x축 위의 v인 곳 아래나 위), o.ynums [{ v, text }](y축 위의 v인 곳 왼쪽이나 오른쪽).
  //  ④ o.aria 를 주면 그림 설명을 그것으로 바꾼다(모양만 보이는 그림 — 공용 설명은 포물선이 지나는 모눈 점을 적으므로 계수가 드러난다).
  //  ⑤ o.lines [{ y: c, dash }] x축에 평행한 직선(공용 plane 의 직선과 따로 그린다), o.marks [[x, y, x, y], …] 가는 점선.
  // geoOk(o): 모든 글이 2px 넘게 떨어져 놓였는가(수를 다시 고르는 데 쓴다).
  function build(o) {
    const [xlo, xhi] = o.x || [-5, 5], [ylo, yhi] = o.y || [-5, 5], u = Math.min(24, 260 / (xhi - xlo));
    const PX = (v) => 16 + (num(v) - xlo) * u, PY = (v) => 24 + (yhi - num(v)) * u;
    const paras = (o.parabolas || []).map((p) => ({ a: num(p.a), p: num(p.p || 0), q: num(p.q || 0), name: p.name, dash: p.dash, side: p.side }));
    let svg = plane(Object.assign({}, o, { ticks: 'none', lines: [], parabolas: (o.parabolas || []).map((p) => Object.assign({}, p, { name: '' })), points: (o.points || []).map((p) => Object.assign({}, p, { name: '' })), say: o.say }));
    svg = svg.replace(/<text x="[^"]*" y="[^"]*" text-anchor="middle" style="font-size:11px;fill:#1f2933;font-weight:600">O<\/text>/, '');
    // 장애물: 축, 포물선, 직선·선분·점선, 점
    const segs = [[PX(xlo) - 8, PY(0), PX(xhi) + 9, PY(0)], [PX(0), PY(ylo) + 8, PX(0), PY(yhi) - 9]], dots = [];
    const curvePts = paras.map((pa) => { const pts = []; for (let i = 0; i <= 160; i += 1) { const x = xlo + (xhi - xlo) * i / 160, y = pa.a * (x - pa.p) * (x - pa.p) + pa.q; if (y >= ylo - 1e-9 && y <= yhi + 1e-9) { const q = [PX(x), PY(y)], last = pts[pts.length - 1]; if (last && Math.hypot(q[0] - last[0], q[1] - last[1]) > 3) { const k = Math.ceil(Math.hypot(q[0] - last[0], q[1] - last[1]) / 3); for (let j = 1; j < k; j += 1) pts.push([last[0] + (q[0] - last[0]) * j / k, last[1] + (q[1] - last[1]) * j / k]); } pts.push(q); } } return pts; });
    curvePts.forEach((pts) => dots.push(...pts));
    let extra = '';
    for (const l of o.hlines || []) { segs.push([PX(xlo), PY(l.y), PX(xhi), PY(l.y)]); extra += `<line x1="${f1(PX(xlo))}" y1="${f1(PY(l.y))}" x2="${f1(PX(xhi))}" y2="${f1(PY(l.y))}" style="stroke:#7c3aed;stroke-width:1.6${l.dash ? ';stroke-dasharray:5 3' : ''}"/>`; }
    for (const [x1, y1, x2, y2] of o.marks || []) { segs.push([PX(x1), PY(y1), PX(x2), PY(y2)]); extra += `<line x1="${f1(PX(x1))}" y1="${f1(PY(y1))}" x2="${f1(PX(x2))}" y2="${f1(PY(y2))}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/>`; }
    for (const [x1, y1, x2, y2] of o.segs || []) segs.push([PX(x1), PY(y1), PX(x2), PY(y2)]);
    for (const p of o.points || []) { dots.push([PX(p.x), PY(p.y)]); if (p.guide) { segs.push([PX(p.x), PY(p.y), PX(p.x), PY(0)]); segs.push([PX(p.x), PY(p.y), PX(0), PY(p.y)]); } }
    if (o.poly) o.poly.forEach((p, i) => { const q = o.poly[(i + 1) % o.poly.length]; segs.push([PX(p[0]), PY(p[1]), PX(q[0]), PY(q[1])]); });
    const near = indexDots(dots);
    // 축의 이름 x, y 는 plane 이 적은 자리에 있다.
    const boxes = [[PX(xhi) + 21, PY(0), 5, 6], [PX(0) + 9, PY(yhi) - 14, 5, 6]], why = [];
    let texts = '';
    const put = (cx0, cy0, t, size, style) => { const w = textW(t, size) / 2, h = size * 0.62; boxes.push([cx0, cy0, w, h]); texts += `<text x="${f1(cx0)}" y="${f1(cy0)}" text-anchor="middle" dominant-baseline="central" style="font-size:${size}px;${style || 'font-weight:600;fill:#1f2933'};${HALO}">${svText(t)}</text>`; };
    // 후보 자리를 차례로 놓아 보아 틈이 need 를 넘는 첫 자리, 없으면 가장 넓은 자리에 적는다.
    const best = (cands, t, size, need, label) => {
      const w = textW(t, size) / 2, h = size * 0.62; let pick = null;
      for (const [x, y] of cands) { const r = roomOf(x, y, w, h, near, segs, boxes); if (r >= need) { pick = { x, y, r }; break; } if (!pick || r > pick.r) pick = { x, y, r }; }
      if (pick.r < 2) why.push((label || bare(t)) + ' 틈 ' + pick.r.toFixed(1));
      return pick;
    };
    // 점의 이름
    for (const p of o.points || []) {
      if (!p.name) continue;
      const x = PX(p.x), y = PY(p.y), rr = 11, order = p.side ? { ur: [45], ul: [135], dr: [315], dl: [225], u: [90], d: [270], l: [180], r: [0] }[p.side] : [];
      const angles = order.concat([45, 135, 315, 225, 90, 270, 0, 180]);
      const at = best([rr, rr + 5, rr + 10].flatMap((r) => angles.map((a) => [x + r * Math.cos(a * Math.PI / 180), y - r * Math.sin(a * Math.PI / 180)])), p.name, 13, 2.5, p.name);
      put(at.x, at.y, p.name, 13);
    }
    // 포물선의 이름: 상자를 나가는 끝 둘레(바깥쪽부터), 그다음 곡선을 따라 안쪽으로
    paras.forEach((pa, k) => {
      if (!pa.name) return;
      const pts = curvePts[k], cands = [];
      const side = pa.side || o.nameSide, ends = side === 'l' ? [pts[0], pts[pts.length - 1]] : [pts[pts.length - 1], pts[0]];
      for (const e of ends) for (const r of [10, 14]) for (const a of [90, 270, 0, 180, 45, 135, 315, 225]) cands.push([e[0] + r * Math.cos(a * Math.PI / 180), e[1] - r * Math.sin(a * Math.PI / 180)]);
      for (const f of [0.9, 0.8, 0.7]) for (const e of [pts[Math.round((pts.length - 1) * f)], pts[Math.round((pts.length - 1) * (1 - f))]]) for (const a of [0, 180, 90, 270]) cands.push([e[0] + 12 * Math.cos(a * Math.PI / 180), e[1] - 12 * Math.sin(a * Math.PI / 180)]);
      const at = best(cands, pa.name, 13, 3, pa.name);
      put(at.x, at.y, pa.name, 13, 'font-weight:700;fill:' + ['#1d4ed8', '#b42318', '#15803d', '#7c3aed'][k % 4]);
    });
    // 축 위에 적는 수
    for (const m of o.xnums || []) { const t = m.text == null ? plain(asQ(m.v)) : m.text, x = PX(m.v); const at = best([[x, PY(0) + 11], [x, PY(0) - 9], [x + 9, PY(0) + 11], [x - 9, PY(0) + 11], [x + 9, PY(0) - 9], [x - 9, PY(0) - 9]], t, 12, 2.5); put(at.x, at.y, t, 12); }
    for (const m of o.ynums || []) { const t = m.text == null ? plain(asQ(m.v)) : m.text, y = PY(m.v), w = textW(t, 12) / 2; const at = best([[PX(0) - 5 - w, y], [PX(0) + 5 + w, y], [PX(0) - 5 - w, y - 8], [PX(0) + 5 + w, y - 8], [PX(0) - 5 - w, y + 8], [PX(0) + 5 + w, y + 8]], t, 12, 2.5); put(at.x, at.y, t, 12); }
    // 눈금 수: 선·점·글과 닿지 않는 것만 적는다.
    const ticks = o.ticks || 'all', want = (v) => v !== 0 && (ticks === 'all' || (Array.isArray(ticks) && ticks.includes(v)));
    for (let v = Math.ceil(xlo); v <= xhi; v += 1) if (want(v)) { const t = plain(Q(v)), w = textW(t, 12) / 2, x = PX(v), y = PY(0) + 11; if (roomOf(x, y, w, 6, near, segs, boxes) >= 2) put(x, y, t, 12, 'fill:#334155'); }
    for (let v = Math.ceil(ylo); v <= yhi; v += 1) if (want(v)) { const t = plain(Q(v)), w = textW(t, 12) / 2, x = PX(0) - 5 - w, y = PY(v); if (roomOf(x, y, w, 6, near, segs, boxes) >= 2) put(x, y, t, 12, 'fill:#334155'); }
    // 원점의 이름 O
    const oAt = best([[PX(0) - 8, PY(0) + 10], [PX(0) + 8, PY(0) + 10], [PX(0) - 8, PY(0) - 9], [PX(0) + 8, PY(0) - 9], [PX(0) - 13, PY(0) + 10], [PX(0) + 13, PY(0) + 10], [PX(0) - 13, PY(0) - 9], [PX(0) + 13, PY(0) - 9], [PX(0) - 18, PY(0) + 10], [PX(0) + 18, PY(0) + 10], [PX(0) - 18, PY(0) - 9], [PX(0) + 18, PY(0) - 9]], 'O', 12, 2, 'O');
    put(oAt.x, oAt.y, 'O', 12);
    // 그림 틀을 글이 모두 들어가게 넓힌다.
    const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)" width="(\d+)"/), W0 = Number(m[1]), H0 = Number(m[2]);
    let x0 = 0, y0 = 0, x1 = W0, y1 = H0;
    for (const [bx, by, bw, bh] of boxes) { x0 = Math.min(x0, bx - bw - 4); y0 = Math.min(y0, by - bh - 5); x1 = Math.max(x1, bx + bw + 4); y1 = Math.max(y1, by + bh + 4); }
    x0 = Math.floor(x0); y0 = Math.floor(y0); x1 = Math.ceil(x1); y1 = Math.ceil(y1);
    svg = svg.replace(m[0], `viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}" width="${x1 - x0}"`);
    if (o.aria) svg = svg.replace(/aria-label="[^"]*"/, 'aria-label="' + o.aria + '"');
    return { svg: svg.replace('</svg>', extra + texts + '</svg>'), ok: why.length === 0, why, width: x1 - x0 };
  }
  const geo = (o) => build(o).svg, geoOk = (o) => { const b = build(o); return b.ok && b.width <= 290; }, geoWhy = (o) => build(o).why;

  // mini(o): 작은 좌표평면(보기 그림). 범위는 −R~R(o.R, 기본 3), 모눈(o.grid)과 포물선 하나 y = ax²(o.a). o.name 그림 설명 앞의 이름.
  // 그림 설명에는 볼록한 쪽과 상자 안에서 지나는 모눈 점을 적는다(모눈을 그린 그림이므로 그림에서 읽을 수 있다).
  function mini(o) {
    const R = o.R || 3, u = 46 / R, pL = 8, pR = 16, pT = 16, pB = 8, W = pL + pR + 2 * R * u, H = pT + pB + 2 * R * u, PX = (v) => pL + (v + R) * u, PY = (v) => pT + (R - v) * u, a = num(o.a);
    let out = '';
    if (o.grid) for (let v = -R; v <= R; v += 1) out += `<line class="mb-gridline" x1="${f1(PX(v))}" y1="${f1(PY(-R))}" x2="${f1(PX(v))}" y2="${f1(PY(R))}"/><line class="mb-gridline" x1="${f1(PX(-R))}" y1="${f1(PY(v))}" x2="${f1(PX(R))}" y2="${f1(PY(v))}"/>`;
    out += `<line class="mb-axis" x1="${f1(PX(-R) - 3)}" y1="${f1(PY(0))}" x2="${f1(PX(R) + 4)}" y2="${f1(PY(0))}"/><path d="M${f1(PX(R) + 10)} ${f1(PY(0))}l-6 -3v6z" style="fill:#1f2933"/>`
      + `<line class="mb-axis" x1="${f1(PX(0))}" y1="${f1(PY(-R) + 3)}" x2="${f1(PX(0))}" y2="${f1(PY(R) - 4)}"/><path d="M${f1(PX(0))} ${f1(PY(R) - 10)}l-3 6h6z" style="fill:#1f2933"/>`;
    const pts = [];
    for (let i = 0; i <= 200; i += 1) { const x = -R + 2 * R * i / 200, y = a * x * x; if (y >= -R - 1e-9 && y <= R + 1e-9) pts.push(f1(PX(x)) + ' ' + f1(PY(y))); }
    out += `<path d="M${pts.join('L')}" style="fill:none;stroke:#1d4ed8;stroke-width:1.9"/>`;
    out += `<text x="${f1(PX(R) + 8)}" y="${f1(PY(0) + (a > 0 ? 14 : -6))}" text-anchor="middle" style="font-size:13px;fill:#1f2933;${ITALIC};${HALO}">x</text><text x="${f1(PX(0) + 9)}" y="${f1(PY(R) - 4)}" text-anchor="middle" style="font-size:13px;fill:#1f2933;${ITALIC};${HALO}">y</text>`
      + `<text x="${f1(PX(0) - u / 2)}" y="${f1(PY(0) + (a > 0 ? 1 : -1) * u / 2)}" text-anchor="middle" dominant-baseline="central" style="font-size:12px;font-weight:600;fill:#1f2933;${HALO}">O</text>`;
    const lattice = [];
    for (let x = -R; x <= R; x += 1) { const y = a * x * x; if (Math.abs(y - Math.round(y)) < 1e-9 && Math.abs(y) <= R) lattice.push(`(${plain(Q(x))}, ${plain(Q(Math.round(y)))})`); }
    const said = `좌표평면${o.name ? ' ' + o.name : ''}: ${o.grid ? `x축과 y축이 −${R}부터 ${R}까지 있고 모눈 한 칸은 1이다. ` : ''}꼭짓점이 원점인 포물선이 ${a > 0 ? '아래로' : '위로'} 볼록하다.${o.grid ? ` 지나는 모눈 점은 ${lattice.join(', ')}이다.` : ''}${o.say ? ' ' + o.say : ''}`;
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W)}" role="img" aria-label="${said}">${out}</svg>`;
  }
  // 작은 그림 넷을 두 줄로 놓고 이름(㉠~㉣)을 단다.
  const picks = (figs, tags) => '<div style="display:grid;grid-template-columns:repeat(2,max-content);gap:8px 14px">' + figs.map((h, i) => `<div style="display:grid;gap:1px;justify-items:start"><div style="font-size:0.95rem;font-weight:600">${(tags || LAB)[i]}</div>${h}</div>`).join('') + '</div>';

  // ── 이차함수인 식과 아닌 식 ──
  // h: 적힌 식, yes: 이차함수인가, as: 정리한 식(정리해야 가려지는 식), why: 아닌 까닭
  const PLAIN_YES = [
    (d) => { const a = d.pick([Q(2), Q(-3), Q(1, 2), Q(-2, 3), Q(4), Q(-1, 4)]); return { h: eqA(a), yes: true }; },
    (d) => { const c = d.int(2, 9); return { h: eqY(poly([[c, ''], [-1, X2]])), yes: true }; },
    (d) => { const k = d.pick([2, 3, 4, 5]); return { h: eqY(frac(X2, k)), yes: true }; },
    (d) => { const a = pm(d) * d.int(2, 4), b = nz(d, -6, 6); return { h: eqY(quad(a, b, 0)), yes: true }; },
    (d) => { const a = pm(d) * d.int(1, 3), c = nz(d, -7, 7); return { h: eqY(quad(a, 0, c)), yes: true }; }
  ];
  const PLAIN_NO = [
    (d) => { const c = nz(d, -5, 5); return { h: eqY(frac(1, X2) + ' ' + sgnTerm(c)), yes: false, why: `${X}${sup(2)}이 분모에 있다` }; },
    (d) => ({ h: is(Y, nz(d, -9, 9)), yes: false, why: `${X}의 항이 없다` }),
    (d) => { const k = d.int(2, 8); return { h: eqY((d.bool() ? MINUS : '') + frac(k, X)), yes: false, why: `${X}가 분모에 있다` }; },
    (d) => { const a = pm(d) * d.int(2, 5), b = nz(d, -7, 7); return { h: eqY(quad(0, a, b)), yes: false, why: '일차식이다' }; },
    (d) => { const a = pm(d) * d.int(1, 3), b = nz(d, -6, 6); return { h: eqY(poly([[a, X + sup(3)], [b, X]])), yes: false, why: '삼차식이다' }; }
  ];
  // 정리해야 가려지는 식
  const EXPAND = {
    // 이차항이 사라진다: k(x + p)² − k(x² + q) = 2kpx + k(p² − q)
    vanishSq: (d) => { const k = d.int(2, 4), p = nz(d, -3, 3), q = nz(d, -3, 3); return { h: eqY(`${k}(${X} ${sgnTerm(p)})${sup(2)} ${MINUS} ${k}(${X2} ${sgnTerm(q)})`), yes: false, as: eqY(quad(0, 2 * k * p, k * (p * p - q))), why: `${X}${sup(2)}의 항이 사라진다` }; },
    // (x + p)² − x² = 2px + p²
    vanishPlain: (d) => { const p = nz(d, -6, 6); return { h: eqY(`(${X} ${sgnTerm(p)})${sup(2)} ${MINUS} ${X2}`), yes: false, as: eqY(quad(0, 2 * p, p * p)), why: `${X}${sup(2)}의 항이 사라진다` }; },
    // x² + x + c − (x² + x) = c
    vanishAll: (d) => { const c = d.int(2, 9); return { h: eqY(`${X2} + ${X} + ${c} ${MINUS} (${X2} + ${X})`), yes: false, as: is(Y, c), why: `${X}의 항이 없다` }; },
    // −x(x + p) + (x² − q) = −px − q
    vanishMix: (d) => { const p = d.int(1, 5), q = d.int(1, 6); return { h: eqY(`${MINUS}${X}(${X} + ${p}) + (${X2} ${MINUS} ${q})`), yes: false, as: eqY(quad(0, -p, -q)), why: `${X}${sup(2)}의 항이 사라진다` }; },
    // x(x − p)²: 삼차식이 남는다
    cubic: (d) => { const p = d.int(1, 5); return { h: eqY(`${X}(${X} ${MINUS} ${p})${sup(2)}`), yes: false, as: eqY(poly([[1, X + sup(3)], [-2 * p, X2], [p * p, X]])), why: '삼차식이다' }; },
    // x²(x + p): 삼차식
    cubic2: (d) => { const p = nz(d, -5, 5); return { h: eqY(`${X2}(${X} ${sgnTerm(p)})`), yes: false, as: eqY(poly([[1, X + sup(3)], [p, X2]])), why: '삼차식이다' }; },
    // 삼차항이 사라져 이차가 된다: x²(x + p) − x³ = px²
    keepCube: (d) => { const p = pm(d) * d.int(2, 5); return { h: eqY(`${X2}(${X} ${sgnTerm(p)}) ${MINUS} ${X}${sup(3)}`), yes: true, as: eqY(quad(p)) }; },
    // x(x² + p) − x²(x + q) = −qx² + px
    keepCube2: (d) => { const p = d.int(1, 5), q = d.int(1, 4); return { h: eqY(`${X}(${X2} + ${p}) ${MINUS} ${X2}(${X} + ${q})`), yes: true, as: eqY(quad(-q, p, 0)) }; },
    // 이차항이 남는다: −a x² − (x + p)²
    keepSq: (d) => { const a = d.int(1, 3), p = nz(d, -3, 3); return { h: eqY(`${MINUS}${a === 1 ? '' : a}${X2} ${MINUS} (${X} ${sgnTerm(p)})${sup(2)}`), yes: true, as: eqY(quad(-a - 1, -2 * p, -p * p)) }; },
    keepProd: (d) => { const p = nz(d, -5, 5), q = nz(d, -5, 5); return { h: eqY(`(${X} ${sgnTerm(p)})(${X} ${sgnTerm(q)})`), yes: true, as: eqY(quad(1, p + q, p * q)) }; },
    keepMul: (d) => { const p = d.int(2, 6); return { h: eqY(`${X}(${p} ${MINUS} ${X})`), yes: true, as: eqY(quad(-1, p, 0)) }; },
    // 2x² − (x + p)(x − p) = x² + p²
    keepDiff: (d) => { const p = d.int(1, 4); return { h: eqY(`2${X2} ${MINUS} (${X} + ${p})(${X} ${MINUS} ${p})`), yes: true, as: eqY(quad(1, 0, p * p)) }; }
  };
  const whyText = (r) => (r.yes ? `${r.as || r.h}이므로 이차함수이다.` : `${r.as ? r.as + '이므로 ' : ''}${r.why}.`);

  // ── 상황(이차함수인가) ──
  // say: 보기로 쓰는 말, eq: y를 x에 대한 식으로 나타낸 것, deg: 차수(분수 꼴은 0)
  const CM = 'cm', CM2 = 'cm²', CM3 = 'cm³';
  const STORY = [
    () => ({ say: `반지름의 길이가 ${X} ${CM}인 원의 넓이 ${Y} ${CM2}`, eq: eqY(`π${X2}`), deg: 2 }),
    () => ({ say: `반지름의 길이가 ${X} ${CM}인 원의 둘레의 길이 ${Y} ${CM}`, eq: eqY(`2π${X}`), deg: 1 }),
    () => ({ say: `한 모서리의 길이가 ${X} ${CM}인 정육면체의 겉넓이 ${Y} ${CM2}`, eq: eqY(quad(6)), deg: 2 }),
    () => ({ say: `한 모서리의 길이가 ${X} ${CM}인 정육면체의 부피 ${Y} ${CM3}`, eq: eqY(X + sup(3)), deg: 3 }),
    () => ({ say: `반지름의 길이가 ${X} ${CM}인 구의 부피 ${Y} ${CM3}`, eq: eqY(`${frac(4, 3)}π${X}${sup(3)}`), deg: 3 }),
    () => ({ say: `반지름의 길이가 ${X} ${CM}인 구의 겉넓이 ${Y} ${CM2}`, eq: eqY(`4π${X2}`), deg: 2 }),
    (d) => { const h = d.int(2, 9); return { say: `밑면의 반지름의 길이가 ${X} ${CM}이고 높이가 ${h} ${CM}인 원기둥의 부피 ${Y} ${CM3}`, eq: eqY(`${h}π${X2}`), deg: 2 }; },
    (d) => { const k = d.int(2, 4); return { say: `윗변의 길이가 ${X} ${CM}, 아랫변의 길이가 ${k}${X} ${CM}, 높이가 2${X} ${CM}인 사다리꼴의 넓이 ${Y} ${CM2}`, eq: eqY(quad(k + 1)), deg: 2 }; },
    (d) => { const k = d.int(1, 6); return { say: `밑변의 길이가 2${X} ${CM}, 높이가 (${X} + ${k}) ${CM}인 삼각형의 넓이 ${Y} ${CM2}`, eq: eqY(quad(1, k, 0)), deg: 2 }; },
    (d) => { const k = d.int(1, 5); return { say: `두 대각선의 길이가 각각 2${X} ${CM}, (${X} + ${k}) ${CM}인 마름모의 넓이 ${Y} ${CM2}`, eq: eqY(quad(1, k, 0)), deg: 2 }; },
    (d) => { const t = d.pick([[60, 6], [90, 4], [120, 3], [45, 8]]); return { say: `반지름의 길이가 ${X} ${CM}이고 중심각의 크기가 ${t[0]}°인 부채꼴의 넓이 ${Y} ${CM2}`, eq: eqY(`${frac(1, t[1])}π${X2}`), deg: 2 }; },
    (d) => { const p = d.pick([10, 12, 16, 20]); return { say: `둘레의 길이가 ${2 * p} ${CM}이고 가로의 길이가 ${X} ${CM}인 직사각형의 넓이 ${Y} ${CM2}`, eq: eqY(quad(-1, p, 0)), deg: 2 }; },
    (d) => { const k = d.int(3, 8); return { say: `한 변의 길이가 각각 ${X} ${CM}, (${k} ${MINUS} ${X}) ${CM}인 두 정사각형의 넓이의 합 ${Y} ${CM2}`, eq: eqY(quad(2, -2 * k, k * k)), deg: 2 }; },
    () => ({ say: `${X}각형의 대각선의 개수 ${Y}`, eq: eqY(`${frac(1, 2)}${X2} ${MINUS} ${frac(3, 2)}${X}`), deg: 2 }),
    () => ({ say: `한 변의 길이가 ${X} ${CM}인 정사각형의 둘레의 길이 ${Y} ${CM}`, eq: eqY(quad(0, 4)), deg: 1 }),
    () => ({ say: `한 변의 길이가 ${X} ${CM}인 정삼각형의 둘레의 길이 ${Y} ${CM}`, eq: eqY(quad(0, 3)), deg: 1 }),
    (d) => { const v = d.pick([40, 50, 60, 80]); return { say: `시속 ${v} km로 ${X}시간 동안 달린 거리 ${Y} km`, eq: eqY(quad(0, v)), deg: 1 }; },
    (d) => { const D = d.pick([12, 24, 30, 60]); return { say: `${D} km를 ${X}시간 동안 달린 자동차의 속력 시속 ${Y} km`, eq: eqY(frac(D, X)), deg: 0 }; },
    (d) => { const p = d.pick([600, 800, 900, 1200]); return { say: `한 개에 ${p}원인 음료수 ${X}개의 값 ${Y}원`, eq: eqY(quad(0, p)), deg: 1 }; },
    (d) => { const k = d.int(1, 4); return { say: `한 변의 길이가 각각 ${X} ${CM}, (${X} + ${k}) ${CM}인 두 정사각형의 둘레의 길이의 합 ${Y} ${CM}`, eq: eqY(quad(0, 8, 4 * k)), deg: 1 }; }
  ];
  const STORY_YES = STORY.map((f, i) => i).filter((i) => [0, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13].includes(i));
  const STORY_NO = STORY.map((f, i) => i).filter((i) => !STORY_YES.includes(i));

  // 잘라 낸 정사각형 그림: 한 변이 x + p 인 정사각형의 왼쪽 위에서 한 변이 cut 인 정사각형을 잘라 냈다(cut 은 [글, 그림 속 비율]).
  function cutFig(p, cut, name) {
    const S = 92, s = S * cut[1], b = Board(), o = [0, 0];
    b.poly([o, [S, 0], [S, S], [0, S]], TINT).poly([o, [s, 0], [s, s], [0, s]], 'fill:#fff');
    b.seg([s, 0], [s, s], 'thin').seg([0, s], [s, s], 'thin');
    b.text([S / 2, S + 12], `${sv('x')} + ${p}`, { plain: true }).text([S + 8 + textW(`x + ${p}`, 13) / 2, S / 2], `${sv('x')} + ${p}`, { plain: true });
    b.text([s / 2, s / 2], cut[0].replace('x', sv('x')), { size: 12 });
    if (name) b.text([-13, -6], name, { plain: true });
    return b.svg(`그림${name ? ' ' + name : ''}: 한 변의 길이가 x + ${p}인 정사각형의 한 귀퉁이에서 한 변의 길이가 ${cut[0]}인 정사각형을 잘라 내고 남은 부분을 색칠하였다.`);
  }

  B.addUnit({
    id: '9-1-5', grade: 9, semester: 1, no: 5, title: '이차함수와 그 그래프', version: 1,
    groups: [
      {
        id: 'quad', title: '이차함수의 뜻', standard: S21,
        types: [
          T('quad-term', '이차함수의 뜻', '①16', (d) => {
            const opts = d.shuffle(['이차함수', '일차함수', '이차방정식', '이차식']);
            return C(`함수 ${is(Y, FN + '(' + X + ')')}에서 ${eqY(`${A}${X2} + ${BB}${X} + ${CC}`)} (단, ${A}, ${BB}, ${CC}는 수, ${A} ≠ 0)와 같이 ${Y}가 ${X}에 대한 이차식으로 나타내어질 때, 이 함수를 ${X}에 대한 무엇이라 하는가?`, opts, opts.indexOf('이차함수'), {
              explain: `${Y}가 ${X}에 대한 이차식으로 나타내어지는 함수를 ${X}에 대한 이차함수라 한다.`,
              facts: { truth: opts.map((o) => o === '이차함수'), want: true }
            });
          }),
          T('quad-pick', '식을 보고 이차함수인 것 모두 고르기', '①1', (d) => {
            // 정리하지 않아도 꼴이 보이는 식 넷(이차함수 둘, 아닌 것 둘). 아닌 것: 분모에 x²·x, 상수, 일차식, 삼차식
            const yes = d.shuffle(PLAIN_YES).slice(0, 2).map((f) => f(d)), no = d.shuffle(PLAIN_NO).slice(0, 2).map((f) => f(d));
            const rows = d.shuffle(yes.concat(no)), pick = setPick(d, rows.map((r) => r.yes), LAB, 4);
            return C(`다음 중 ${Y}가 ${X}에 대한 이차함수인 것을 모두 고른 것은?`, pick.options, pick.at, {
              figure: rows1(rows.map((r) => r.h), LAB),
              explain: `${tagsOf(rows.map((r) => r.yes), LAB)}은 ${Y}가 ${X}에 대한 이차식이다. ${rows.map((r, i) => (r.yes ? '' : `${LAB[i]}은 ${r.why}.`)).filter(Boolean).join(' ')}`,
              facts: { truth: pick.truth, want: true }
            });
          }),
          T('quad-count', '이차함수인 것의 개수', '①1·2', (d) => {
            // 꼴이 보이는 식, 정리해야 가려지는 식, 이차방정식(등식 = 0)을 섞은 다섯
            const eqn = (() => { const a = d.int(2, 5), b = nz(d, -6, 6), c = nz(d, -7, 7); return { h: nb(`${quad(a, b, c)} = 0`), yes: false, why: '이차방정식이지 함수가 아니다' }; })();
            const rows = d.until(() => {
              const pool = [d.pick(PLAIN_YES)(d), d.pick(PLAIN_NO)(d), EXPAND[d.pick(['keepCube', 'keepCube2', 'keepProd', 'keepMul', 'keepDiff'])](d), EXPAND[d.pick(['vanishSq', 'vanishPlain', 'vanishAll', 'vanishMix', 'cubic', 'cubic2'])](d), d.pick([PLAIN_YES, PLAIN_NO])[0](d)];
              return d.shuffle(pool.slice(0, 4).concat([eqn]));
            }, (list) => { const n = list.filter((r) => r.yes).length; return n >= 1 && n <= 3; });
            const n = rows.filter((r) => r.yes).length;
            return N(`다음 중 ${Y}가 ${X}에 대한 이차함수인 것은 모두 몇 개인가?`, n, { unit: '개',
              figure: rows1(rows.map((r) => r.h)),
              explain: rows.map((r, i) => `${TAG6[i]}: ${whyText(r)}`).join(' ') + ` 따라서 이차함수는 ${n}개이다.`,
              facts: { value: rows.map((r) => (r.yes ? '1' : '0')).join('+'), unseen: [0, 1] }
            });
          }),
          T('quad-expand', '정리해 보아야 가려지는 이차함수', '①2', (d, n) => {
            if (n === 0) {
              // 이차함수가 아닌 것 하나: 이차항이 사라지는 식
              const no = EXPAND[d.pick(['vanishSq', 'vanishPlain', 'vanishMix'])](d), yes = d.shuffle(['keepCube2', 'keepSq', 'keepProd', 'keepMul', 'keepDiff']).slice(0, 3).map((k) => EXPAND[k](d)).concat([d.pick(PLAIN_YES)(d)]);
              const rows = d.shuffle(yes.concat([no]));
              return C(`다음 중 ${Y}가 ${X}에 대한 이차함수가 아닌 것은?`, rows.map((r) => r.h), rows.indexOf(no), {
                explain: `${no.as}이므로 ${no.why}. 나머지는 정리하면 ${X}${sup(2)}의 항이 남는다.`,
                facts: { truth: rows.map((r) => r.yes), want: false, rule: 'expand-not' }
              });
            }
            // 이차함수인 것 하나: 삼차항이 사라져 이차가 되는 식. 나머지는 이차항이 사라지거나 삼차가 남는다.
            const yes = EXPAND[d.pick(['keepCube', 'keepCube2'])](d), no = d.shuffle(['vanishSq', 'vanishPlain', 'vanishAll', 'vanishMix', 'cubic', 'cubic2']).slice(0, 4).map((k) => EXPAND[k](d));
            const rows = d.shuffle(no.concat([yes]));
            return C(`다음 중 ${Y}가 ${X}에 대한 이차함수인 것은?`, rows.map((r) => r.h), rows.indexOf(yes), {
              explain: `${yes.as}이므로 이차함수이다. ${no.map((r) => `${r.h}${ejosa(r.h, '은/는')} ${r.as}이므로 ${r.why}.`).join(' ')}`,
              facts: { truth: rows.map((r) => r.yes), want: true, rule: 'expand-is' }
            });
          }, { count: 2 }),
          T('quad-coef', '이차함수가 되게 하는 계수의 조건', '①3 심1', (d, n) => {
            if (n === 0) {
              // kx(x − p) − qx² + r 또는 k(1 + x²) + px − qx²: x²의 계수가 k − q 이므로 k = q 이면 이차함수가 아니다.
              const q = pm(d) * d.int(2, 6), p = d.int(1, 5), r = nz(d, -7, 7), form = d.bool();
              const h = form ? eqY(`${K}${X}(${X} ${MINUS} ${p}) ${q < 0 ? '+' : MINUS} ${Math.abs(q)}${X2} ${sgnTerm(r)}`) : eqY(`${K}(1 + ${X2}) + ${p}${X} ${q < 0 ? '+' : MINUS} ${Math.abs(q)}${X2}`);
              const as = form ? `(${K} ${q < 0 ? '+' : MINUS} ${Math.abs(q)})${X2} ${sgnCoef(-p, K + X)} ${sgnTerm(r)}` : `(${K} ${q < 0 ? '+' : MINUS} ${Math.abs(q)})${X2} + ${p}${X} + ${K}`;
              return N(`${h}${ejosa(h, '이/가')} ${X}에 대한 이차함수가 되지 않게 하는 수 ${K}의 값은?`, q, { signed: true,
                explain: `${eqY(as)}이므로 ${X}${sup(2)}의 계수 ${K} ${q < 0 ? '+' : MINUS} ${Math.abs(q)}${tail(Math.abs(q), '이/가')} 0이면 이차함수가 아니다. 따라서 ${is(K, q)}이다.`,
                facts: { value: jn(q), rule: 'coef-one' }
              });
            }
            // k(k + p)x² + mx − nx²: x²의 계수 k² + pk − n = (k − r1)(k − r2) 가 0이 되는 k 는 둘이다.
            const [r1, r2] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5)], ([u, v]) => u < v && u * v < 0 && u + v !== 0), p = -(r1 + r2), nn = -r1 * r2, m = nz(d, -6, 6);
            const h = eqY(`${K}(${K} ${sgnTerm(p)})${X2} ${sgnCoef(m, X)} ${MINUS} ${nn}${X2}`);
            const set = (u, v) => [u, v].sort((s, t) => s - t).map(iq).join(', ');
            const right = set(r1, r2), opts = [];
            for (const s of [right, set(-r1, -r2), set(0, -p), `${iq(r1)}`, set(r1, -r2)]) if (!opts.includes(s)) opts.push(s);
            const list = d.shuffle(opts.slice(0, 4));
            return C(`${h}${ejosa(h, '이/가')} ${X}에 대한 이차함수일 때, 수 ${K}의 값이 될 수 없는 것을 모두 고른 것은?`, list, list.indexOf(right), {
              explain: `${eqY(`(${K}${sup(2)} ${sgnCoef(p, K)} ${MINUS} ${nn})${X2} ${sgnCoef(m, X)}`)}이므로 ${nb(`${K}${sup(2)} ${sgnTerm(p)}${K} ${MINUS} ${nn} ≠ 0`)}이어야 한다. ${nb(`(${K} ${sgnTerm(-r1)})(${K} ${sgnTerm(-r2)}) ≠ 0`)}이므로 ${K}는 ${right}${tail(Math.abs(r2), '이/가')} 될 수 없다.`,
              facts: { truth: list.map((s) => s === right), want: true, rule: 'coef-two' }
            });
          }, { count: 2 }),
          T('quad-story', '상황을 식으로 나타내어 이차함수인 것 가리기', '①4', (d, n) => {
            if (n === 0) {
              const yes = d.shuffle(STORY_YES).slice(0, 2).map((i) => STORY[i](d)), no = d.shuffle(STORY_NO).slice(0, 2).map((i) => STORY[i](d));
              const rows = d.shuffle(yes.concat(no)), pick = setPick(d, rows.map((r) => r.deg === 2), LAB, 4);
              return C(`다음 중 ${Y}가 ${X}에 대한 이차함수인 것을 모두 고른 것은?`, pick.options, pick.at, {
                figure: rows1(rows.map((r) => r.say), LAB),
                explain: rows.map((r, i) => `${LAB[i]}: ${r.eq}`).join(', ') + `이므로 이차함수인 것은 ${tagsOf(rows.map((r) => r.deg === 2), LAB)}이다.`,
                facts: { truth: pick.truth, want: true, rule: 'story-all' }
              });
            }
            const yes = d.shuffle(STORY_YES).slice(0, 4).map((i) => STORY[i](d)), no = STORY[d.pick(STORY_NO)](d), rows = d.shuffle(yes.concat([no]));
            return C(`다음 중 ${Y}가 ${X}에 대한 이차함수가 아닌 것은?`, rows.map((r) => r.say), rows.indexOf(no), {
              explain: `${no.eq}이므로 이차함수가 아니다. 나머지는 ${yes.map((r) => r.eq).join(', ')}${ejosa(yes[yes.length - 1].eq, '으로/로')} 이차함수이다.`,
              facts: { truth: rows.map((r) => r.deg === 2), want: false, rule: 'story-not' }
            });
          }, { count: 2 }),
          T('quad-story-eq', '상황을 이차함수의 식으로 나타내기', '①5', (d) => {
            const s = d.pick([
              () => { const k = d.int(1, 7); return { text: `밑변의 길이가 2${X} ${CM}, 높이가 (${X} + ${k}) ${CM}인 삼각형의 넓이를 ${Y} ${CM2}라 하자.`, abc: [1, k, 0], told: `${Y} = ${frac(1, 2)} × 2${X} × (${X} + ${k})`, calc: ['2/2', `2*${k}/2`, '0'] }; },
              () => { const k = d.int(1, 5); return { text: `한 변의 길이가 각각 (${X} ${MINUS} ${k}) ${CM}, (${X} + ${k}) ${CM}인 두 정사각형의 넓이의 합을 ${Y} ${CM2}라 하자.`, abc: [2, 0, 2 * k * k], told: `${Y} = (${X} ${MINUS} ${k})${sup(2)} + (${X} + ${k})${sup(2)}`, calc: ['1+1', `2*${k}-2*${k}`, `${k}*${k}+${k}*${k}`] }; },
              () => { const p = d.int(1, 6), q = d.until(() => d.int(1, 6), (v) => v !== p); return { text: `가로의 길이가 (${X} + ${p}) ${CM}, 세로의 길이가 (${X} + ${q}) ${CM}인 직사각형의 넓이를 ${Y} ${CM2}라 하자.`, abc: [1, p + q, p * q], told: `${Y} = (${X} + ${p})(${X} + ${q})`, calc: ['1', `${p}+${q}`, `${p}*${q}`] }; },
              () => { const p = d.pick([8, 10, 12, 15]); return { text: `둘레의 길이가 ${2 * p} ${CM}이고 가로의 길이가 ${X} ${CM}인 직사각형의 넓이를 ${Y} ${CM2}라 하자.`, abc: [-1, p, 0], told: `세로의 길이가 (${p} ${MINUS} ${X}) ${CM}이므로 ${Y} = ${X}(${p} ${MINUS} ${X})`, calc: ['0-1', `${2 * p}/2`, '0'] }; }
            ])();
            return M(`${s.text} ${Y}를 ${X}에 대한 식으로 나타내어 ${eqY(`${A}${X2} + ${BB}${X} + ${CC}`)} 꼴로 정리할 때, 수 ${A}, ${BB}, ${CC}의 값은?`, [[A, 0], [BB, 1], [CC, 2]].map(([lead, i]) => ({ lead: lead + ' =', answer: s.abc[i], signed: true })), {
              shown: [A, BB, CC].map((l, i) => is(l, s.abc[i])).join(', '),
              explain: `${s.told} = ${quad(...s.abc)}이므로 ${[A, BB, CC].map((l, i) => is(l, s.abc[i])).join(', ')}이다.`,
              facts: { calc: s.calc.map((c, i) => [c, i]), unseen: [0, 1, 2] }
            });
          }),
          T('quad-story-value', '상황을 나타낸 이차함수의 값', '①6', (d, n) => {
            if (n === 0) {
              // 식을 세운 뒤 x의 값을 넣는다.
              const s = d.pick([
                () => { const k = d.int(1, 4), x = d.int(k + 1, 9); return { text: `한 변의 길이가 각각 (${X} ${MINUS} ${k}) ${CM}, (${X} + ${k}) ${CM}인 두 정사각형의 넓이의 합을 ${Y} ${CM2}라 하자.`, x, v: 2 * x * x + 2 * k * k, eq: eqY(quad(2, 0, 2 * k * k)), calc: `(${x}-${k})*(${x}-${k})+(${x}+${k})*(${x}+${k})` }; },
                () => { const p = d.int(1, 6), q = d.until(() => d.int(1, 6), (v) => v !== p), x = d.int(2, 9); return { text: `가로의 길이가 (${X} + ${p}) ${CM}, 세로의 길이가 (${X} + ${q}) ${CM}인 직사각형의 넓이를 ${Y} ${CM2}라 하자.`, x, v: (x + p) * (x + q), eq: eqY(quad(1, p + q, p * q)), calc: `(${x}+${p})*(${x}+${q})` }; }
              ])();
              return N(`${s.text} ${is(X, s.x)}일 때, ${Y}의 값은?`, s.v, {
                explain: `${s.eq}이므로 ${is(X, s.x)}일 때 ${is(Y, s.v)}이다.`,
                facts: { value: s.calc, rule: 'story-forward' }
              });
            }
            // 떨어뜨린 공의 높이 h = −5t² + H: 땅에 떨어지는 때(h = 0)이거나 높이가 c m가 되는 때
            const ht = (H) => poly([[-5, TT + sup(2)], [H, '']]);
            if (d.bool()) {
              const T0 = d.int(2, 6), H0 = 5 * T0 * T0;
              return N(`높이가 ${H0} m인 곳에서 공을 떨어뜨렸을 때, ${TT}초 후의 공의 높이를 ${HH} m라 하면 ${is(HH, ht(H0))}이다. 공이 땅에 떨어지는 것은 공을 떨어뜨린 지 몇 초 후인가?`, T0, { unit: '초 후',
                explain: `땅에 떨어질 때 ${is(HH, 0)}이므로 ${nb(`0 = ${ht(H0)}`)}에서 ${is(TT + sup(2), H0 / 5)}이다. ${TT} &gt; 0이므로 ${is(TT, T0)}이다.`,
                facts: { value: `(${H0}/5)**(1/2)`, unseen: [1, 2], rule: 'story-back' }
              });
            }
            const t = d.int(2, 5), c = 5 * d.int(2, 12), H = c + 5 * t * t;
            return N(`높이가 ${H} m인 곳에서 공을 떨어뜨렸을 때, ${TT}초 후의 공의 높이를 ${HH} m라 하면 ${is(HH, ht(H))}이다. 공의 높이가 ${c} m가 되는 것은 공을 떨어뜨린 지 몇 초 후인가?`, t, { unit: '초 후',
              explain: `${nb(`${c} = ${ht(H)}`)}에서 ${is(TT + sup(2), (H - c) / 5)}이다. ${TT} &gt; 0이므로 ${is(TT, t)}이다.`,
              facts: { value: `((${H}-${c})/5)**(1/2)`, unseen: [1, 2], rule: 'story-back-c' }
            });
          }, { count: 2 }),
          T('quad-cut', '잘라 낸 넓이가 이차함수인 그림 고르기', '①7', (d) => {
            // 한 변이 x + p 인 정사각형에서 정사각형을 잘라 낸다. 잘라 낸 한 변이 수이면 넓이는 이차함수, x 가 든 식이면 x²이 지워져 일차함수이다.
            const p = d.int(2, 4), [r1, r2] = d.shuffle([1, 2, 3, 4, 5]).slice(0, 2), r3 = d.int(1, p - 1);
            const rows = d.shuffle([
              { cut: [String(r1), 0.26], yes: true, as: quad(1, 2 * p, p * p - r1 * r1), sub: `${r1}${sup(2)}` },
              { cut: [String(r2), 0.34], yes: true, as: quad(1, 2 * p, p * p - r2 * r2), sub: `${r2}${sup(2)}` },
              { cut: ['x', 0.6], yes: false, as: quad(0, 2 * p, p * p), sub: X2 },
              { cut: [`x + ${r3}`, 0.72], yes: false, as: quad(0, 2 * (p - r3), p * p - r3 * r3), sub: `(${X} + ${r3})${sup(2)}` }
            ]);
            const pick = setPick(d, rows.map((r) => r.yes), LAB, 4);
            return C(`다음은 한 변의 길이가 ${X} + ${p}인 정사각형에서 작은 정사각형을 잘라 낸 그림이다. 색칠한 부분의 넓이를 ${Y}라 할 때, ${Y}가 ${X}에 대한 이차함수인 것을 모두 고른 것은?`, pick.options, pick.at, {
              figure: picks(rows.map((r, i) => cutFig(p, r.cut, ''))),
              explain: rows.map((r, i) => `${LAB[i]}: ${Y} = (${X} + ${p})${sup(2)} ${MINUS} ${r.sub} = ${r.as}`).join(', ') + `이므로 이차함수인 것은 ${tagsOf(rows.map((r) => r.yes), LAB)}이다.`,
              facts: { truth: pick.truth, want: true }
            });
          })
        ]
      },
      {
        id: 'value', title: '함숫값', standard: S21,
        types: [
          T('value-basic', '이차함수의 함숫값', '①8', (d) => {
            const a = nz(d, -4, 4), b = nz(d, -6, 6), c = nz(d, -9, 9), p = pm(d) * d.int(1, 4), v = a * p * p + b * p + c;
            return N(`이차함수 ${fx(quad(a, b, c))}에 대하여 ${fv(p)}의 값은?`, v, { signed: true,
              explain: `${fv(p)} = ${subst(a, b, c, p)} = ${iq(v)}이다.`,
              facts: { value: `${jn(a)}*${jn(p)}**2+${jn(b)}*${jn(p)}+${jn(c)}`, unseen: [1] }
            });
          }),
          T('value-frac-in', '분수를 넣은 함숫값', '①8', (d) => {
            const [a, b, c, p] = d.until(() => [nz(d, -4, 4), nz(d, -5, 5), nz(d, -6, 6), Q(pm(d) * d.pick([1, 3]), d.pick([2, 3]))], ([u, v, w, x]) => { const val = qadd(qadd(qmul(Q(u), qmul(x, x)), qmul(Q(v), x)), Q(w)); return !isInt(val) && val.q <= 9 && Math.abs(val.p) <= 60; });
            const v = qadd(qadd(qmul(Q(a), qmul(p, p)), qmul(Q(b), p)), Q(c));
            return ansV(`이차함수 ${fx(quad(a, b, c))}에 대하여 ${fv(p)}의 값은?`, v, 'frac', {
              explain: `${fv(p)} = ${subst(a, b, c, p)} = ${iq(v)}이다.`,
              facts: { value: `${jn(a)}*${jn(p)}*${jn(p)}+${jn(b)}*${jn(p)}+${jn(c)}`, unseen: [1] }
            });
          }),
          T('value-root-in', '근호가 있는 수를 넣은 함숫값', '①8', (d) => {
            const [a, b, c, k] = d.until(() => [nz(d, -3, 3), nz(d, -5, 5), nz(d, -7, 7), d.pick([2, 3, 5, 6, 7])], ([u, v, w, s]) => u * s + w !== 0);
            const head = a * k + c;
            return inline(`이차함수 ${fx(quad(a, b, c))}에 대하여 ${fv(rt(k))}의 값은?`, '{0} {1}' + rt('{2}'), [{ answer: head, signed: true }, { answer: b, signed: true }, { answer: k }], {
              shown: `${iq(head)} ${b < 0 ? MINUS : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${rt(k)}`,
              explain: `(${rt(k)})${sup(2)} = ${k}이므로 ${fv(rt(k))} = ${times(a, k)} ${b < 0 ? MINUS : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${rt(k)} ${sgnTerm(c)} = ${iq(head)} ${b < 0 ? MINUS : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}${rt(k)}이다.`,
              facts: { calc: [[`${jn(a)}*${k}+${jn(c)}`, 0], [jn(b), 1], [String(k), 2]], unseen: [1] }
            });
          }),
          T('value-sum', '함숫값의 합과 차', '①9', (d, n) => {
            if (n === 0) {
              const a = nz(d, -3, 3), b = nz(d, -6, 6), c = nz(d, -9, 9), [p, q] = d.until(() => [d.int(-3, 3), d.int(-3, 3)], ([u, v]) => u !== v), f = (x) => a * x * x + b * x + c, minus = d.bool(), v = minus ? f(p) - f(q) : f(p) + f(q);
              return N(`이차함수 ${fx(quad(a, b, c))}에 대하여 ${fv(p)} ${minus ? MINUS : '+'} ${fv(q)}의 값은?`, v, { signed: true,
                explain: `${is(fv(p), f(p))}, ${is(fv(q), f(q))}이므로 ${fv(p)} ${minus ? MINUS : '+'} ${fv(q)} = ${iq(f(p))} ${minus ? MINUS : '+'} ${par(f(q))} = ${iq(v)}이다.`,
                facts: { value: `(${jn(a)}*${jn(p)}**2+${jn(b)}*${jn(p)}+${jn(c)})${minus ? '-' : '+'}(${jn(a)}*${jn(q)}**2+${jn(b)}*${jn(q)}+${jn(c)})`, unseen: [1], rule: 'sum-int' }
              });
            }
            // 계수가 분수인 이차함수: 함숫값 하나하나는 분수이지만 둘의 차는 정수이다.
            const [a, b, c, p, q] = d.until(() => [Q(pm(d) * d.int(1, 2), 3), nz(d, -4, 4), nz(d, -5, 5), nz(d, -2, 2), d.pick([-4, -2, 2, 4])], ([u, v, w, s, t]) => s !== t && (s * s - t * t) % 3 === 0 && s % 3 !== 0);
            const f = (x) => qadd(qadd(qmul(a, Q(x * x)), Q(b * x)), Q(c)), v = qsub(f(p), f(q));
            return ansV(`이차함수 ${fx(quad(a, b, c))}에 대하여 ${fv(p)} ${MINUS} ${fv(q)}의 값은?`, v, 'int', {
              explain: `${is(fv(p), f(p))}, ${is(fv(q), f(q))}이므로 ${fv(p)} ${MINUS} ${fv(q)} = ${iq(f(p))} ${MINUS} ${par(f(q))} = ${iq(v)}이다.`,
              facts: { value: `(${jn(a)}*${jn(p)}*${jn(p)}+${jn(b)}*${jn(p)}+${jn(c)})-(${jn(a)}*${jn(q)}*${jn(q)}+${jn(b)}*${jn(q)}+${jn(c)})`, unseen: [1], rule: 'sum-frac' }
            });
          }, { count: 2 }),
          T('value-coef', '함숫값으로 식의 계수 구하기', '①10', (d) => {
            // 모르는 계수가 x의 계수이거나 x²의 계수이다.
            const which = d.bool(), a = nz(d, -4, 4), b = nz(d, -6, 6), c = nz(d, -8, 8), p = pm(d) * d.int(1, 3), v = a * p * p + b * p + c;
            const h = which ? quad(a, 0, 0) + ` + ${A}${X} ${sgnTerm(c)}` : `${A}${X2} ${sgnTerm(b)}${X} ${sgnTerm(c)}`;
            return N(`이차함수 ${fx(h)}에 대하여 ${is(fv(p), v)}일 때, 수 ${A}의 값은?`, which ? b : a, { signed: true,
              explain: which ? `${fv(p)} = ${iq(a * p * p)} ${p < 0 ? MINUS : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}${A} ${sgnTerm(c)} = ${iq(v)}에서 ${is(A, b)}이다.` : `${fv(p)} = ${p * p === 1 ? '' : p * p}${A} ${sgnTerm(b * p)} ${sgnTerm(c)} = ${iq(v)}에서 ${is(A, a)}이다.`,
              facts: { value: which ? `(${jn(v)}-${jn(a)}*${jn(p)}**2-${jn(c)})/${jn(p)}` : `(${jn(v)}-${jn(b)}*${jn(p)}-${jn(c)})/${jn(p)}**2`, unseen: [1] }
            });
          }),
          T('value-coef-then', '함숫값으로 계수를 정하고 다른 함숫값 구하기', '①11', (d) => {
            const a = nz(d, -3, 3), b = nz(d, -6, 6), c = nz(d, -8, 8), [p, q] = d.until(() => [pm(d) * d.int(1, 3), d.int(-3, 3)], ([u, v]) => u !== v), f = (x) => a * x * x + b * x + c;
            return N(`이차함수 ${fx(quad(a, 0, 0) + ` + ${A}${X} ${sgnTerm(c)}`)}에 대하여 ${is(fv(p), f(p))}일 때, ${fv(q)}의 값은? (단, ${A}는 수이다.)`, f(q), { signed: true,
              explain: `${fv(p)} = ${iq(a * p * p)} ${p < 0 ? MINUS : '+'} ${Math.abs(p) === 1 ? '' : Math.abs(p)}${A} ${sgnTerm(c)} = ${iq(f(p))}에서 ${is(A, b)}이다. ${fx(quad(a, b, c))}이므로 ${is(fv(q), f(q))}이다.`,
              facts: { value: `${jn(a)}*${jn(q)}**2+((${jn(f(p))}-${jn(a)}*${jn(p)}**2-${jn(c)})/${jn(p)})*${jn(q)}+${jn(c)}`, unseen: [1] }
            });
          }),
          T('value-two', '두 조건으로 계수 두 개 구하기', '①12 심3', (d, n) => {
            if (n === 0) {
              // y = kx² + ax + b 에서 x = p, q 일 때의 y의 값으로 a, b
              const k = d.pick([1, 1, 2, -1]), a = nz(d, -8, 8), b = nz(d, -7, 7), [p, q] = d.until(() => [d.int(-2, 1), d.int(1, 3)], ([u, v]) => u !== v), f = (x) => k * x * x + a * x + b;
              const U = `(${jn(f(p))}-${jn(k)}*${jn(p)}**2)`, W = `(${jn(f(q))}-${jn(k)}*${jn(q)}**2)`, aE = `(${U}-${W})/(${jn(p)}-${jn(q)})`;
              const eqOf = (x) => (x === 0 ? is(BB, f(0)) : nb(`${iq(k * x * x)} ${sgnCoef(x, A)} + ${BB} = ${iq(f(x))}`));
              return M(`이차함수 ${eqY(quad(k, 0, 0) + ` + ${A}${X} + ${BB}`)}에서 ${is(X, p)}일 때 ${is(Y, f(p))}, ${is(X, q)}일 때 ${is(Y, f(q))}이다. 수 ${A}, ${BB}의 값은?`, [{ lead: A + ' =', answer: a, signed: true }, { lead: BB + ' =', answer: b, signed: true }], {
                shown: `${is(A, a)}, ${is(BB, b)}`,
                explain: `${is(X, p)}, ${is(Y, f(p))}${tail(Math.abs(f(p)), '을/를')} 대입하면 ${eqOf(p)}, ${is(X, q)}, ${is(Y, f(q))}${tail(Math.abs(f(q)), '을/를')} 대입하면 ${eqOf(q)}이다. ${p === 0 ? `${is(BB, b)}${tail(Math.abs(b), '을/를')} 뒤의 식에 넣으면` : '두 식을 연립하여 풀면'} ${is(A, a)}, ${is(BB, b)}이다.`,
                facts: { calc: [[aE, 0], [`${U}-${aE}*${jn(p)}`, 1]], unseen: [0, 1, 2], rule: 'two-coef' }
              });
            }
            // f(x) = kx² + ax + b 에서 f(p), f(q)로 a, b 를 정하고 f(r). 답은 정수이다(심3의 ax² + bx 꼴도 같은 일이라 이 꼴로 낸다).
            const k = nz(d, -3, 3), a = nz(d, -6, 6), b = nz(d, -7, 7), [p, q, r] = d.until(() => [d.int(-3, 0), d.int(1, 3), d.int(-3, 3)], ([u, v, w]) => u !== v && w !== u && w !== v), f = (x) => k * x * x + a * x + b;
            const U = `(${jn(f(p))}-${jn(k)}*${jn(p)}**2)`, W = `(${jn(f(q))}-${jn(k)}*${jn(q)}**2)`, aE = `(${U}-${W})/(${jn(p)}-${jn(q)})`, bE = `${U}-${aE}*${jn(p)}`;
            const eqOf = (x) => (x === 0 ? is(BB, f(0)) : nb(`${iq(k * x * x)} ${sgnCoef(x, A)} + ${BB} = ${iq(f(x))}`));
            return N(`이차함수 ${fx(quad(k, 0, 0) + ` + ${A}${X} + ${BB}`)}에 대하여 ${is(fv(p), f(p))}, ${is(fv(q), f(q))}일 때, ${fv(r)}의 값은? (단, ${A}, ${BB}는 수이다.)`, f(r), { signed: true,
              explain: `${is(fv(p), f(p))}에서 ${eqOf(p)}, ${is(fv(q), f(q))}에서 ${eqOf(q)}이다. 연립하여 풀면 ${is(A, a)}, ${is(BB, b)}이므로 ${fx(quad(k, a, b))}이고 ${is(fv(r), f(r))}이다.`,
              facts: { value: `${jn(k)}*${jn(r)}**2+${aE}*${jn(r)}+(${bE})`, unseen: [0, 1, 2], rule: 'two-then' }
            });
          }, { count: 2 }),
          T('value-solve', '함숫값이 주어질 때 x의 값', '①13 심2', (d, n) => {
            if (n === 0) {
              // f(a) = k 의 두 해 가운데 정수인 것: (x − m)(vx − w) 꼴에서 만든다.
              const c = d.until(() => { const m = nz(d, -4, 4), v = d.pick([2, 3, 5]), w = pm(d) * d.until(() => d.int(1, 2 * v), (t) => t % v !== 0), s = pm(d), k = nz(d, -9, 9); return { m, v, w, s, k, p: s * v, q: -s * (v * m + w), r: s * m * w + k }; },
                (o) => o.q !== 0 && o.r !== 0 && Math.abs(o.r) <= 20 && Math.abs(o.q) <= 14);
              const { m, v, w, s, k, p, q, r } = c, D = `(${jn(q)}**2-4*${jn(p)}*(${jn(r)}-${jn(k)}))`;
              const sign = Math.abs((-q + Math.sqrt(q * q - 4 * p * (r - k))) / (2 * p) - m) < 1e-9 ? '+' : '-';
              return N(`이차함수 ${fx(quad(p, q, r))}에 대하여 ${is(fv(A), k)}일 때, 정수 ${A}의 값은?`, m, { signed: true,
                explain: `${fv(A)} = ${iq(k)}에서 ${nb(`${poly([[p, A + sup(2)], [q, A], [r - k, '']])} = 0`)}, ${nb(`${s < 0 ? MINUS : ''}(${A} ${sgnTerm(-m)})(${v}${A} ${sgnTerm(-w)}) = 0`)}이므로 ${is(A, m)} 또는 ${is(A, Q(w, v))}이다. ${A}는 정수이므로 ${is(A, m)}이다.`,
                facts: { value: `(0-${jn(q)}${sign}${D}**(1/2))/(2*${jn(p)})`, unseen: [0, 1, 2, 4], rule: 'solve-int' }
              });
            }
            // 계수를 먼저 정하고, 함숫값이 0이 되는 x(완전제곱식이라 하나뿐)
            const s = pm(d) * d.int(1, 3), rr = nz(d, -4, 4), p = pm(d) * d.int(1, 2), c2 = s, a = -2 * rr * s, c0 = s * rr * rr, v = c2 * p * p + a * p + c0;
            if (a === 0) throw new Error('다시');
            return N(`이차함수 ${fx(quad(c2, 0, 0) + ` + ${A}${X} ${sgnTerm(c0)}`)}에 대하여 ${is(fv(p), v)}, ${is(fv(BB), 0)}일 때, 수 ${BB}의 값은? (단, ${A}는 수이다.)`, rr, { signed: true,
              explain: `${is(fv(p), v)}에서 ${is(A, a)}이다. ${fv(BB)} = ${poly([[c2, BB + sup(2)], [a, BB], [c0, '']])} = ${c2 < 0 ? MINUS : ''}${Math.abs(c2) === 1 ? '' : Math.abs(c2)}(${BB} ${sgnTerm(-rr)})${sup(2)} = 0이므로 ${is(BB, rr)}이다.`,
              facts: { value: `0-((${jn(v)}-${jn(c2)}*${jn(p)}**2-${jn(c0)})/${jn(p)})/(2*${jn(c2)})`, unseen: [0, 1, 2], rule: 'solve-double' }
            });
          }, { count: 2 })
        ]
      },
      { id: 'shape', title: '이차함수 y = ax²의 그래프', standard: S22, types: [] },
      { id: 'nature', title: '그래프의 성질', standard: S22, types: [] },
      { id: 'point', title: '그래프 위의 점과 이차함수의 식', standard: S22, types: [] },
      { id: 'length', title: '그래프 위의 점과 길이', standard: S22, types: [] }
    ]
  });

  // ── 이차함수 y = ax²의 그래프 ──
  // 보기로 쓰는 계수의 크기(서로 다른 양의 유리수). 부호는 따로 정한다.
  const MAGS = [Q(1), Q(2), Q(3), Q(4), Q(5), Q(1, 2), Q(1, 3), Q(2, 3), Q(3, 2), Q(1, 4), Q(3, 4), Q(2, 5), Q(5, 2), Q(4, 3), Q(1, 5), Q(5, 3)];
  const sgnQ = (s, m) => (s < 0 ? qneg(m) : m);
  const absJ = (a) => js(qabs(asQ(a)));
  const convex = (a) => (num(a) > 0 ? '아래로' : '위로');
  // 서로 크기가 다른 계수 n개(같은 크기에 부호만 다른 것은 없다)
  const coefs = (d, n) => d.shuffle(MAGS).slice(0, n).map((m) => sgnQ(pm(d), m));
  const fxs = (list) => list.map((a) => eqA(a));

  B.addTypes('9-1-5', 'shape', [
    T('shape-table', '이차함수 y = ax²의 함숫값 표 채우기', '①14', (d) => {
      const a = pm(d) * d.int(1, 3), xs = [-2, -1, 0, 1, 2], hide = d.shuffle([0, 1, 3, 4]).slice(0, 3).sort((p, q) => p - q);
      const cells = xs.map((x, i) => (hide.includes(i) ? box(LAB[hide.indexOf(i)]) : iq(a * x * x)));
      return M(`다음은 이차함수 ${eqA(a)}에서 ${X}의 값에 대한 ${Y}의 값을 나타낸 표이다. ${LAB.slice(0, 3).join(', ')}에 알맞은 수는?`, hide.map((i, k) => ({ lead: LAB[k] + ' =', answer: a * xs[i] * xs[i], signed: true })), {
        figure: xyTable([[X].concat(xs.map(iq)), [Y].concat(cells)]),
        shown: hide.map((i, k) => `${LAB[k]} ${iq(a * xs[i] * xs[i])}`).join(', '),
        explain: hide.map((i) => `${is(X, xs[i])}일 때 ${Y} = ${times(a, sqOf(xs[i]))} = ${iq(a * xs[i] * xs[i])}`).join(', ') + '이다.',
        facts: { calc: hide.map((i, k) => [`${jn(a)}*${jn(xs[i])}**2`, k]) }
      });
    }),
    T('shape-draw-pick', '이차함수 y = ax²의 그래프 고르기', '①15', (d) => {
      // 그래프 그리기(작도)를 고르기로 바꾸었다. 보기는 a, −a, 1/a, −1/a 의 그래프(모눈 위에서 지나는 점으로 가린다).
      const m = d.pick([Q(2), Q(3), Q(1, 2), Q(1, 3)]), cands = d.shuffle([m, qneg(m), Q(m.q, m.p), qneg(Q(m.q, m.p))]), target = d.pick(cands);
      const key = (q) => q.p + '/' + q.q, at = cands.findIndex((c) => key(c) === key(target)), lat = isInt(target) ? 1 : target.q;
      return C(`다음 중 이차함수 ${eqA(target)}의 그래프는? (단, 모눈 한 칸은 1이다.)`, LAB.slice(0, 4), at, {
        figure: picks(cands.map((c, i) => mini({ a: c, grid: true, name: LAB[i] }))),
        explain: `${eqA(target)}의 그래프는 원점을 꼭짓점으로 하고 ${convex(target)} 볼록하며, 점 ${ptj(lat, qmul(target, Q(lat * lat)), '을/를')} 지난다.`,
        facts: { truth: cands.map((c) => key(c) === key(target)), want: true }
      });
    }),
    T('shape-words', '그래프의 성질에 알맞은 말 채우기', '①16', (d, n) => {
      if (n === 0) {
        const a = sgnQ(pm(d), d.pick(MAGS.slice(1))), right = d.bool(), up = num(a) > 0;
        const rise = up === right ? '증가' : '감소', quads = up ? '1, 2' : '3, 4';
        const all = [];
        for (const c of ['위', '아래']) for (const qd of ['1, 2', '3, 4']) for (const t of ['증가', '감소']) all.push(`${c}, ${qd}, ${t}`);
        const good = `${up ? '아래' : '위'}, ${quads}, ${rise}`, opts = d.shuffle([good].concat(d.shuffle(all.filter((s) => s !== good)).slice(0, 3)));
        return C(`다음은 이차함수 ${eqA(a)}의 그래프에 대한 설명이다. ${LAB.slice(0, 4).join(', ')}에 알맞은 것을 차례대로 나열한 것은?`, opts, opts.indexOf(good), {
          figure: lines([`꼭짓점의 좌표는 ${pt(0, 0)}이고 ${box(LAB[0])}로 볼록한 포물선이다.`, `제${box(LAB[1])}사분면과 제${box(LAB[2])}사분면을 지난다.`, `${nb(`${X} ${right ? '&gt;' : '&lt;'} 0`)}일 때, ${X}의 값이 증가하면 ${Y}의 값은 ${box(LAB[3])}한다.`]),
          explain: `${eqA(a)}에서 ${X}${sup(2)}의 계수가 ${num(a) > 0 ? '양수' : '음수'}이므로 ${up ? '아래로' : '위로'} 볼록하고 제${quads}사분면을 지난다. ${nb(`${X} ${right ? '&gt;' : '&lt;'} 0`)}일 때 ${X}의 값이 증가하면 ${Y}의 값은 ${rise}한다.`,
          facts: { truth: opts.map((s) => s === good), want: true, rule: 'words-one' }
        });
      }
      const good = 'y축, 원점, 아래, 위', opts = d.shuffle([good, 'x축, 원점, 아래, 위', 'y축, 원점, 위, 아래', 'x축, 원점, 위, 아래']);
      return C(`다음은 이차함수 ${eqY(`${A}${X2}`)}의 그래프에 대한 설명이다. ${LAB.slice(0, 4).join(', ')}에 알맞은 것을 차례대로 나열한 것은?`, opts, opts.indexOf(good), {
        figure: lines([`${box(LAB[0])}을 축으로 하고 ${box(LAB[1])}을 꼭짓점으로 하는 포물선이다.`, `${nb(`${A} &gt; 0`)}이면 ${box(LAB[2])}로 볼록하고, ${nb(`${A} &lt; 0`)}이면 ${box(LAB[3])}로 볼록하다.`]),
        explain: `이차함수 ${eqY(`${A}${X2}`)}의 그래프는 ${Y}축을 축으로 하고 원점을 꼭짓점으로 하는 포물선이며, ${nb(`${A} &gt; 0`)}이면 아래로, ${nb(`${A} &lt; 0`)}이면 위로 볼록하다.`,
        facts: { truth: opts.map((s) => s === good), want: true, rule: 'words-all' }
      });
    }, { count: 2 }),
    T('shape-vertex-axis', '꼭짓점·축의 방정식·x축에 대칭인 그래프의 식', '①17', (d) => {
      const a = pm(d) * d.int(2, 7);
      return inline(`이차함수 ${eqA(a)}의 그래프에 대하여 꼭짓점의 좌표, 축의 방정식, ${XA}에 대칭인 그래프를 나타내는 이차함수의 식을 차례대로 구하시오.`,
        `꼭짓점의 좌표 ({0}, {1})<br>축의 방정식 ${X} = {2}<br>${XA}에 대칭인 그래프의 식 ${Y} = {3}${X2}`, [{ answer: 0, signed: true }, { answer: 0, signed: true }, { answer: 0, signed: true }, { answer: -a, signed: true }], {
          shown: `${pt(0, 0)}, ${is(X, 0)}, ${eqA(-a)}`,
          explain: `${eqA(a)}의 그래프는 원점을 꼭짓점으로 하고 ${YA}을 축으로 하므로 꼭짓점의 좌표는 ${pt(0, 0)}, 축의 방정식은 ${is(X, 0)}이다. ${XA}에 대칭인 그래프는 ${X}${sup(2)}의 계수의 부호만 바뀌므로 ${eqA(-a)}이다.`,
          facts: { calc: [['0', 0], ['0', 1], ['0', 2], [`0-${jn(a)}`, 3]], unseen: [0] }
        });
    }),
    T('shape-convex', '볼록한 쪽으로 그래프 가리기', '①18', (d) => {
      const down = d.bool(), list = d.until(() => coefs(d, 6), (cs) => { const k = cs.filter((c) => (num(c) > 0) === down).length; return k >= 2 && k <= 4; });
      const flags = list.map((c) => (num(c) > 0) === down), pick = setPick(d, flags, TAG6, 4);
      return C(`다음 이차함수 중 그 그래프가 ${down ? '아래로' : '위로'} 볼록한 것을 모두 고른 것은?`, pick.options, pick.at, {
        figure: grid2(fxs(list)),
        explain: `${Y} = ${A}${X2}의 그래프는 ${nb(`${A} ${down ? '&gt;' : '&lt;'} 0`)}이면 ${down ? '아래로' : '위로'} 볼록하다. ${X}${sup(2)}의 계수가 ${down ? '양수' : '음수'}인 것은 ${tagsOf(flags)}이다.`,
        facts: { truth: pick.truth, want: true }
      });
    }),
    T('shape-narrow', '폭이 가장 좁은(넓은) 그래프', '①19', (d) => {
      // 가장 좁은(넓은) 것의 계수가 음수이거나, 계수가 가장 큰 수가 가장 좁은 것이 아니게 한다.
      const narrow = d.bool(), list = d.until(() => coefs(d, 5), (cs) => { const ab = cs.map((c) => Math.abs(num(c))), ext = narrow ? Math.max(...ab) : Math.min(...ab), i = ab.indexOf(ext); return num(cs[i]) < 0 || cs.some((c) => (narrow ? num(c) > num(cs[i]) : num(c) < num(cs[i]))); });
      const ab = list.map((c) => Math.abs(num(c))), at = ab.indexOf(narrow ? Math.max(...ab) : Math.min(...ab));
      return C(`다음 이차함수 중 그 그래프의 폭이 가장 ${narrow ? '좁은' : '넓은'} 것은?`, fxs(list), at, {
        explain: `${Y} = ${A}${X2}의 그래프는 ${A}의 절댓값이 ${narrow ? '클수록 폭이 좁다' : '작을수록 폭이 넓다'}. ${X}${sup(2)}의 계수의 절댓값이 가장 ${narrow ? '큰' : '작은'} 것은 ${eqA(list[at])}이다.`,
        facts: { choose: { exprs: list.map(absJ), rule: narrow ? 'max' : 'min' }, unseen: [1] }
      });
    }),
    T('shape-convex-narrow', '볼록한 쪽과 폭을 함께 따져 고르기', '①20', (d) => {
      // 볼록한 쪽이 맞는 것 가운데 가장 좁은(넓은) 것. 볼록한 쪽을 따지지 않고 고른 것(전체에서 가장 좁은·넓은 것)은 반대로 볼록하다.
      const down = d.bool(), narrow = d.bool();
      const list = d.until(() => coefs(d, 5), (cs) => {
        const same = cs.filter((c) => (num(c) > 0) === down), ab = cs.map((c) => Math.abs(num(c))), ext = narrow ? Math.max(...ab) : Math.min(...ab);
        return same.length >= 2 && same.length <= 3 && (num(cs[ab.indexOf(ext)]) > 0) !== down;
      });
      const ok = list.map((c) => (num(c) > 0) === down), ab = list.map((c, i) => (ok[i] ? Math.abs(num(c)) : (narrow ? -1 : 99))), best = narrow ? Math.max(...ab) : Math.min(...ab), at = ab.indexOf(best);
      return C(`다음 이차함수 중 그 그래프가 ${down ? '아래로' : '위로'} 볼록하면서 폭이 가장 ${narrow ? '좁은' : '넓은'} 것은?`, fxs(list), at, {
        explain: `${down ? '아래로' : '위로'} 볼록한 것은 ${X}${sup(2)}의 계수가 ${down ? '양수' : '음수'}인 ${list.filter((c, i) => ok[i]).map(eqA).join(', ')}이다. 이 가운데 계수의 절댓값이 가장 ${narrow ? '큰' : '작은'} ${eqA(list[at])}의 그래프의 폭이 가장 ${narrow ? '좁다' : '넓다'}.`,
        facts: { truth: list.map((c, i) => i === at), want: true }
      });
    }),
    T('shape-order', '폭의 차례대로 늘어놓기', '①21', (d) => {
      // 틀린 보기: 계수의 크기(부호까지) 차례, 거꾸로 된 차례, 이웃한 둘을 바꾼 차례
      const wide = d.bool(), list = coefs(d, 5), idx = [0, 1, 2, 3, 4];
      const byAbs = idx.slice().sort((p, q) => Math.abs(num(list[p])) - Math.abs(num(list[q])) * 1), right = wide ? byAbs : byAbs.slice().reverse();
      const bySigned = idx.slice().sort((p, q) => num(list[p]) - num(list[q])), wrong = [wide ? bySigned : bySigned.slice().reverse(), right.slice().reverse()];
      const sw = d.int(0, 3), swapped = right.slice(); [swapped[sw], swapped[sw + 1]] = [swapped[sw + 1], swapped[sw]]; wrong.push(swapped);
      const sw2 = (sw + 2) % 4, swapped2 = right.slice(); [swapped2[sw2], swapped2[sw2 + 1]] = [swapped2[sw2 + 1], swapped2[sw2]]; wrong.push(swapped2);
      const orders = [right];
      for (const o of wrong) if (!orders.some((p) => p.join() === o.join())) orders.push(o);
      const shown = d.shuffle(orders.slice(0, 4));
      return C(`다음 이차함수의 그래프를 폭이 ${wide ? '넓은' : '좁은'} 것부터 차례대로 나열한 것은?`, shown.map((o) => o.map((i) => TAG6[i]).join(', ')), shown.findIndex((o) => o.join() === right.join()), {
        figure: grid2(fxs(list)),
        explain: `${X}${sup(2)}의 계수의 절댓값이 ${wide ? '작을수록 폭이 넓다' : '클수록 폭이 좁다'}. 절댓값을 비교하면 ${right.map((i) => TAG6[i]).join(', ')}의 차례이다.`,
        facts: { choose: { exprs: list.map(absJ), rule: wide ? 'ascending' : 'descending', orders: shown }, unseen: [1] }
      });
    }),
    T('shape-sym-pair', 'x축에 서로 대칭인 그래프 짝 짓기', '①22', (d, n) => {
      if (n === 0) {
        // 대칭인 두 짝과, 부호가 반대인 역수(대칭이 아닌 짝) 둘. 보기는 짝 둘을 묶은 것이다.
        const [c1, c2] = d.until(() => d.shuffle(MAGS.slice(1)).slice(0, 2), ([u, v]) => qcmp(u, Q(v.q, v.p)) !== 0 && [u, v].every((w) => !MAGS.slice(0, 1).some((z) => qcmp(z, w) === 0)));
        const s1 = pm(d), s2 = pm(d), items = [sgnQ(s1, c1), sgnQ(-s1, c1), sgnQ(s2, c2), sgnQ(-s2, c2), sgnQ(-s1, Q(c1.q, c1.p)), sgnQ(-s2, Q(c2.q, c2.p))];
        const order = d.shuffle([0, 1, 2, 3, 4, 5]), at = (k) => order.indexOf(k), name = (p, q) => [TAG6[Math.min(at(p), at(q))], TAG6[Math.max(at(p), at(q))]].join('과 ');
        const P1 = name(0, 1), P2 = name(2, 3), W1 = name(0, 4), W2 = name(2, 5);
        const sets = [[P1, P2], [P1, W2], [W1, P2], [W1, W2]].map((s) => s.join(', ')), opts = d.shuffle(sets);
        return C(`다음 이차함수 중 그 그래프가 ${XA}에 서로 대칭인 것끼리 바르게 짝 지은 것은?`, opts, opts.indexOf(sets[0]), {
          figure: grid2(order.map((k) => eqA(items[k]))),
          explain: `${Y} = ${A}${X2}의 그래프와 ${Y} = ${MINUS}${A}${X2}의 그래프는 ${XA}에 서로 대칭이다. ${X}${sup(2)}의 계수의 절댓값이 같고 부호가 반대인 것은 ${P1}, ${P2}이다. 부호가 반대인 역수(${nj(items[0], '과/와')} ${iq(items[4])})는 대칭이 아니다.`,
          facts: { truth: opts.map((s) => s === sets[0]), want: true, rule: 'sym-pairs' }
        });
      }
      // 여덟 개 가운데 대칭인 짝의 수. 대칭이 아닌 것은 부호가 반대인 역수, 짝이 없는 것.
      const k = d.int(1, 3), mags = d.shuffle(MAGS.slice(1)).filter((m, i, all) => !all.slice(0, i).some((z) => qcmp(z, Q(m.q, m.p)) === 0));
      const items = [];
      for (let i = 0; i < k; i += 1) { const s = pm(d); items.push(sgnQ(s, mags[i]), sgnQ(-s, mags[i])); }
      // 남은 자리: 부호가 반대인 역수 하나와 서로 크기가 다른 것들
      const s0 = num(items[0]) > 0 ? -1 : 1; items.push(sgnQ(s0, Q(mags[0].q, mags[0].p)));
      for (let i = k; items.length < 8; i += 1) items.push(sgnQ(pm(d), mags[i]));
      const list = d.shuffle(items), cnt = list.filter((c, i) => list.some((e, j) => j > i && qcmp(c, qneg(e)) === 0)).length;
      return N(`다음 이차함수 중 그 그래프가 ${XA}에 서로 대칭인 것은 모두 몇 쌍인가?`, cnt, { unit: '쌍',
        figure: grid2(fxs(list), TAG6),
        explain: `${X}${sup(2)}의 계수의 절댓값이 같고 부호가 반대인 두 그래프가 ${XA}에 서로 대칭이다. 그런 짝은 ${list.map((c, i) => list.map((e, j) => (j > i && qcmp(c, qneg(e)) === 0 ? `${TAG6[i]}과 ${TAG6[j]}` : '')).filter(Boolean).join(', ')).filter(Boolean).join(', ')}이므로 ${cnt}쌍이다.`,
        facts: { value: list.map((c, i) => (list.some((e, j) => j > i && qcmp(c, qneg(e)) === 0) ? '1' : '0')).join('+'), unseen: [0, 1], rule: 'sym-count' }
      });
    }, { count: 2 })
  ]);

  // 같은 단원의 다른 파일(9-1-5b.js, 9-1-5c.js)이 함께 쓰는 도구
  B.kit.m915 = {
    S21, S22, sourceOf, T, X, Y, FN, GN, A, BB, CC, K, MM, NN, TT, HH, PP, QQ, X2, XA, YA, TAG6, num, iq, jn, par, nj, is, quad, eqY, eqA, fx, fv, cx, pt, ptj, ltail, ejosa, sgnTerm,
    grid2, rows1, tagsOf, setPick, xyTable, ssq, sqOf, times, subst, sgnCoef, coef, MAGS, sgnQ, absJ, convex, coefs, fxs, HALO, ITALIC, svText, bare, textW, toSeg, roomOf, geo, geoOk, geoWhy, mini, picks
  };
})(typeof window !== 'undefined' ? window : globalThis);
