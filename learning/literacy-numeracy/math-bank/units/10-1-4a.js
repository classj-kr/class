// 고등학교 1학년 1학기(공통수학1) 4단원 이차방정식과 이차함수 — 단원 틀·도구와 앞쪽 묶음(이차함수의 그래프와 x축, 이차함수의 그래프와 직선).
// 수집해 둔 천재 T셀파 공통수학1 두 종(홍진곤, 전인태 — 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록
// (기본꼴_1: 22꼴, 기본꼴_2: 27꼴, 심화꼴: 2꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/10-1-4/싣기_대조표.md 에 있다.
// (제한된 범위에서의 최대·최소와 그 활용은 10-1-4b.js 에, 실력 문항은 10-1-4c.js 에 있다. 세 파일이 함께 쓰는 도구는 B.kit.m1014 로 내보낸다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계(방정식과 부등식). 성취기준은 10공수1-02-04(이차방정식과 이차함수의 관계), 10공수1-02-05(그래프와 직선의 위치 관계),
// 10공수1-02-06(이차함수의 최대, 최소)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·그림·교점·접점·합과 곱), 묻는 것(위치 관계·값·범위·개수·최솟값·고르기), 조건의 꼴(세 경우를 다 묻는가,
//    「적어도 한 점」, k의 값에 관계없이)이 다르면 따로 싣는다. 수만 다른 것은 한 번만 싣는다(count 를 둔 유형은 차례마다 하는 일이 다르다).
//  - 위치 관계는 판별식으로 따진다. 「적어도 한 점에서 만난다」「x축과 만나도록」은 D ≥ 0(접할 때를 넣는다)이다.
//  - 답: 값은 부호 단추가 붙은 칸, 개수·길이·넓이·양수로 정해 준 문자만 단추 없이 받는다. 범위는 「k [부등호] [±][ ]」(경계는 정수 — 칸 모양이
//    답을 흘리지 않게 한 유형 안에서는 늘 정수가 되도록 수를 고른다), 세 경우를 묻는 꼴은 ⑴⑵⑶ 세 줄의 끼워 넣는 칸, 위치 관계는 세 말 가운데 고르기.
//    원문의 a + b, ab, a − b, a² + b², M + k 처럼 따로 구한 값을 묶은 물음은 값을 칸마다 따로 묻는다(과제 글).
//  - 그림: 포물선만 그리는 그림은 공용 plane 을 쓴다. 축 위에 글자(교점의 x좌표)만 적고 한 축으로만 점선을 내려야 하거나, 그림 설명이 꼭짓점의 좌표·직선의
//    기울기를 말하면 답이 새는 그림은 이 파일의 coord(눈금 없는 좌표평면, 교과서 그림의 꼴)로 그리고 그림 설명을 따로 적는다.
//  - 꼴 목록에 적힌 원문 답은 따르지 않는다. 답은 모두 코드가 셈한다. 참·거짓은 손으로 적지 않고 판별식·부호를 셈해 가린다.
//
// 뺀 것과 까닭(10-1-4b.js, 10-1-4c.js 의 것까지 여기에 모아 적는다)
//  - 앞 학년(중3) 내용 그대로: x축과의 교점의 좌표 구하기(①2 — 9-1-6 axes-intercepts, ⑵는 서술형), x절편 둘과 y절편으로 식 구하기(①7의 홍중 5 —
//    9-1-6 formula-xints-yint), 그래프로 a, b, c, a + b + c, a − b + c 의 부호(①10의 그 부분 — 9-1-6 sign-abc·sign-values. b² − 4ac 는 xaxis-graph-roots#2 에 실음),
//    실수 전체에서의 최댓값·최솟값(②1 — 중3 9수02-22, 고1 교육과정은 「제한된 범위에서만 다룬다」).
//  - 겹침(하는 일이 이미 실은 유형과 같다): 생각열기의 세 그래프와 x축의 교점의 개수(①1 변형 → xaxis-graph-roots#1), 판별식 빈칸 개념 확인(①1·①11 변형),
//    그림에서 읽는 x절편(①7 변형 전중 02 → xaxis-roots-coef#2), 같은 문항을 다시 실은 문서, 공학 도구로 구하는 최대·최소(②3 변형), 최댓값과 최솟값의 합만
//    묻는 꼴(②3의 전보 07 → 값을 따로), 양 끝값이 같은 꼴·꼭짓점이 y축 위인 꼴·계수가 분수인 꼴(②3 변형 — 수만 다르다).
//  - 판단이 갈릴 수 있는 것: 판별식이 k의 이차식이 되어 이차부등식(10-1-6 여러 가지 부등식)을 풀어야 하는 꼴은 심1(직선과 만나지 않는 자연수 k)만 실력에 싣고(①6의 홍대 5는 10-1-6 quadk-all-* 와 같은 일이라 뺐다) 풀이를 「두 일차식의
//    곱이 음수이면 부호가 다르다」로 적었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { MINUS, GT, LT, GE, LE, Q, qadd, qsub, qmul, qdiv, qneg, isInt, fl, tx, mag, nb: nb1, tail, lastOf, js, V, sup, nz, pm, ansV, asQ, poly, plane, ineqAns, rt, sqParts, radText, radAns, claimQ, SG, f1, plain } = B.kit.mid;
  const S4 = '10공수1-02-04', S5 = '10공수1-02-05', S6 = '10공수1-02-06';
  // 한 덩이(줄이 갈리지 않는 글)로 묶되, 맨 바깥의 「 = 」 뒤에서는 줄이 갈릴 수 있게 나눈다. 긴 등식이 휴대폰 너비(360px)를 넘어
  // 카드 전체를 넓히지 않게 한다. 등호는 앞 덩이 끝에 붙는다. 괄호·분수 안의 등호에서는 나누지 않는다.
  const depthOf = (s) => (s.match(/<span[ >]/g) || []).length - (s.match(/<\/span>/g) || []).length
    + (s.match(/[({]/g) || []).length - (s.match(/[)}]/g) || []).length;
  const nb = (h) => {
    const out = [];
    let cur = null;
    for (const part of String(h).split(' = ')) {
      cur = cur == null ? part : cur + ' = ' + part;
      if (depthOf(cur) === 0) { out.push(cur); cur = null; }
    }
    if (cur != null) out.push(cur);
    return out.map((part, i) => nb1(i < out.length - 1 ? part + ' =' : part)).join(' ');
  };

  // ── 검사 근거 마무리(9-1-4a.js 의 방법) ──
  // 다시 셈하는 식의 수 가운데 글·그림 설명·보기에 보이지 않는 수는 facts.derived 에 밝힌 것만 facts.unseen 으로 옮긴다. 밝히지 않은 수가 나오면 오류를 낸다.
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || []));
  }
  function seal(item) {
    const f = item.facts || {}, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!derived.has(Number(n)) && !out.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 6000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => '수집본 ' + (/[①②]/.test(ref) ? (/심/.test(ref) ? '기본·심화' : '기본') : '심화') + ' 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 글 ──
  const X = V('x'), Y = V('y'), K = V('k'), Av = V('a'), Bv = V('b'), Cv = V('c'), Mv = V('m'), Nv = V('n'), Pv = V('p'), Tv = V('t'), Fv = V('f');
  const X2 = X + sup(2), XA = X + '축', YA = Y + '축';
  const num = (v) => (typeof v === 'number' ? v : fl(v));
  const iq = (n) => tx(asQ(n));                                   // 화면에 적는 수(음수는 −, 분수는 분수 꼴)
  const jn = (n) => js(asQ(n));                                   // 검사 식에 적는 수
  const sgn = (n) => { const q = asQ(n); return `${q.p < 0 ? MINUS : '+'} ${mag(q)}`; };   // 「+ 3」「− 3」
  const par = (n) => (num(n) < 0 ? `(${iq(n)})` : iq(n));       // 식 속의 수(음수는 괄호)
  const is = (l, r) => nb(`${l} = ${typeof r === 'string' ? r : iq(r)}`);
  const pt = (x, y) => nb(`(${typeof x === 'string' ? x : iq(x)}, ${typeof y === 'string' ? y : iq(y)})`);
  const coefT = (k) => (k === 1 ? '' : k === -1 ? MINUS : iq(k));   // 문자 앞의 계수(1, −1 은 수를 적지 않는다)
  const kv = (k, v) => `${coefT(k)}${v}`;                          // 2k, −k, k
  const more = (k, v) => `${k < 0 ? MINUS : '+'} ${Math.abs(k) === 1 && v ? '' : Math.abs(k)}${v}`;   // 뒤에 잇는 항: 「+ 2k」「− k」「− 3」
  const quadR = (a, b, c, v) => poly([[a, (v || X) + sup(2)], [b, v || X], [c, '']]);
  const fy = (a, b, c) => nb(`${Y} = ${quadR(a, b, c)}`);
  const linR = (m, n, v) => poly([[m, v || X], [n, '']]);
  const ly = (m, n) => nb(`${Y} = ${linR(m, n)}`);
  const eq0 = (h) => nb(`${h} = 0`);
  const fx = nb(`${Y} = ${Fv}(${X})`);
  const dq = frac('<i class="mb-var">D</i>', 4);                  // D/4
  const Dv = '<i class="mb-var">D</i>';
  const cmpW = (v) => (v > 0 ? GT : v < 0 ? LT : '=');
  // 판별식 D = b² − 4ac 를 셈한 글(0과의 크기까지)
  const dCmp = (a, b, c) => { const v = b * b - 4 * a * c; return nb(`${Dv} = ${par(b)}${sup(2)} ${MINUS} 4 × ${par(a)} × ${par(c)} = ${iq(v)}`) + (v === 0 ? '' : ' ' + nb(`${cmpW(v)} 0`)); };
  // 식·좌표·낱말 뒤에 토씨를 붙인다. 끝소리로 고른다: 숫자는 읽는 소리(분수는 분자), x²은 「제곱」, 문자 m·n·l 은 받침이 있고 나머지 문자는 없다, 한글은 그 글자.
  function jw(h, pair) {
    const [withB, without] = pair.split('/');
    const flat = String(h).replace(/<sup>2<\/sup>/g, '²').replace(/<span class="mb-frac"><span>([^<]*)<\/span><span class="mb-frac-bar">\/<\/span><span>[^<]*<\/span><\/span>/g, '$1').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').replace(/[\s)\]]+$/, '');
    const last = flat.slice(-1);
    if (/\d/.test(last)) return h + tail(Number(/\d+$/.exec(flat)[0]), pair);
    let bat, rieul = false;
    if (last === '²') bat = true;
    else if (/[A-Za-z]/.test(last)) { bat = /[LMNlmn]/.test(last); rieul = /[Ll]/.test(last); }
    else { const code = last.charCodeAt(0) - 0xAC00, t = code >= 0 && code <= 11171 ? code % 28 : 0; bat = t !== 0; rieul = t === 8; }
    if (withB === '으로') return h + (bat && !rieul ? '으로' : '로');
    return h + (bat ? withB : without);
  }
  const nj = (n, pair) => { const q = asQ(n); return iq(q) + tail(lastOf(q), pair); };   // 수 뒤 토씨

  // ── 위치 관계 ──
  const REL = ['서로 다른 두 점에서 만난다.', '한 점에서 만난다(접한다).', '만나지 않는다.'];
  const REL_SAID = ['서로 다른 두 점에서 만난다', '한 점에서 만난다(접한다)', '만나지 않는다'];
  const relOf = (D) => (D > 0 ? 0 : D === 0 ? 1 : 2);
  // 위치 관계 셋 가운데 고르기(정답 자리는 섞는다)
  function relQ(d, text, D, explain, rule, o) {
    const order = d.shuffle([0, 1, 2]), right = relOf(D);
    return C(text, order.map((i) => REL[i]), order.indexOf(right), Object.assign({ explain, facts: { truth: order.map((i) => i === right), want: true, rule } }, o || {}));
  }
  // ⑴ 서로 다른 두 점, ⑵ 한 점, ⑶ 만나지 않음 — 세 경우의 문자의 범위(경계 k0 는 정수). two, none: 두 점·만나지 않을 때의 부등호('<' | '>').
  const RM = { '<': LT, '>': GT, '<=': LE, '>=': GE };
  function threeQ(text, v, k0, two, none, o) {
    const template = `⑴ ${v} {0} {1}<br>⑵ ${v} = {2}<br>⑶ ${v} {3} {4}`;
    return inline(text, template, [{ rel: true, answer: two }, { answer: k0, signed: true }, { answer: k0, signed: true }, { rel: true, answer: none }, { answer: k0, signed: true }],
      Object.assign({}, o, { figure: lines(['⑴ 서로 다른 두 점에서 만난다.', '⑵ 한 점에서 만난다.', '⑶ 만나지 않는다.']), shown: `⑴ ${nb(`${v} ${RM[two]} ${iq(k0)}`)} ⑵ ${is(v, k0)} ⑶ ${nb(`${v} ${RM[none]} ${iq(k0)}`)}` }));
  }
  // 문자의 값 여럿: 「a = [±][ ]  b = [±][ ]」
  const vals = (text, pairs, o) => M(text, pairs.map(([lead, answer]) => ({ lead: lead + ' =', answer, signed: true })), Object.assign({}, o, { shown: pairs.map(([lead, answer]) => is(lead, answer)).join(', ') }));
  // 최댓값과 최솟값(부호 단추 — 단위를 주면 단추 없이)
  const maxMin = (text, mx, mn, o) => M(text, [{ lead: '최댓값:', answer: mx, signed: !o.unit, unit: o.unit }, { lead: '최솟값:', answer: mn, signed: !o.unit, unit: o.unit }], Object.assign({}, o, { shown: `최댓값: ${iq(mx)}${o.unit ? ' ' + o.unit : ''}, 최솟값: ${iq(mn)}${o.unit ? ' ' + o.unit : ''}` }));

  // ── 그림: 눈금 없는 좌표평면(교과서 그림의 꼴) ──
  // coord(o): o.x, o.y [작은 끝, 큰 끝](0을 넣는다), o.parabolas [{ a, p, q, name }](y = a(x − p)² + q), o.lines [{ m, n, name, dash }](y = mx + n),
  //  o.points [{ x, y, name, side: 'ur'|'ul'|'dr'|'dl'|'u'|'d'|'l'|'r', drop: 'x'|'y'|true }](drop: 그 축으로 점선), o.xnums [{ v, text }], o.ynums [{ v, text }](축 위의 글),
  //  o.poly [[x, y], …](옅게 칠한 도형), o.say(그림 설명 — 그림에서 읽어야 할 수를 적는다. 답이 되는 값은 적지 않는다), o.tall(세로 최대 높이).
  // 가로·세로의 한 칸 크기는 따로 줄어들 수 있다(세로로 긴 그림을 줄인다).
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const INK = ['#1d4ed8', '#b42318', '#15803d'];
  const sideOf = { ur: [6, -6, 'start'], ul: [-6, -6, 'end'], dr: [6, 15, 'start'], dl: [-6, 15, 'end'], u: [0, -8, 'middle'], d: [0, 17, 'middle'], l: [-8, 5, 'end'], r: [8, 5, 'start'] };
  function coord(o) {
    const [xlo, xhi] = o.x, [ylo, yhi] = o.y;
    const ux = Math.min(26, 236 / (xhi - xlo)), uy = Math.min(ux, (o.tall || 230) / (yhi - ylo));
    const padL = 22, padR = 28, padT = 28, padB = 22, W = padL + padR + (xhi - xlo) * ux, Hh = padT + padB + (yhi - ylo) * uy;
    const PX = (v) => f1(padL + (num(v) - xlo) * ux), PY = (v) => f1(padT + (yhi - num(v)) * uy), ox = PX(0), oy = PY(0);
    const text = (x, y, t, anchor, style) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor || 'middle'}" style="font-size:12.5px;font-weight:600;fill:#1f2933;${HALO}${style ? ';' + style : ''}">${t}</text>`;
    let under = '', out = '', words = '';
    if (o.poly) under += `<path d="M${o.poly.map(([x, y]) => PX(x) + ' ' + PY(y)).join('L')}Z" style="fill:rgba(251,191,36,0.42);stroke:#1f2933;stroke-width:1.3;stroke-linejoin:round"/>`;
    out += `<line x1="${f1(PX(xlo) - 8)}" y1="${oy}" x2="${f1(PX(xhi) + 9)}" y2="${oy}" style="stroke:#1f2933;stroke-width:1"/><path d="M${f1(PX(xhi) + 15)} ${oy}l-7 -3.4v6.8z" style="fill:#1f2933"/>`
      + `<line x1="${ox}" y1="${f1(PY(ylo) + 8)}" x2="${ox}" y2="${f1(PY(yhi) - 9)}" style="stroke:#1f2933;stroke-width:1"/><path d="M${ox} ${f1(PY(yhi) - 15)}l-3.4 7h6.8z" style="fill:#1f2933"/>`;
    words += `<text x="${f1(PX(xhi) + 13)}" y="${f1(oy + 15)}" text-anchor="middle" style="font-size:13.5px;fill:#1f2933;${ITALIC};${HALO}">x</text>`
      + `<text x="${f1(ox + 11)}" y="${f1(PY(yhi) - 6)}" text-anchor="middle" style="font-size:13.5px;fill:#1f2933;${ITALIC};${HALO}">y</text>`
      + (o.noO ? '' : text(ox - 8, oy + (o.oUp ? -5 : 14), 'O'));
    (o.parabolas || []).forEach((c, k) => {
      const a = num(c.a), p = num(c.p || 0), q = num(c.q || 0), f = (x) => a * (x - p) * (x - p) + q, cuts = [xlo, xhi];
      for (const v of [ylo, yhi]) { const r = (v - q) / a; if (r >= 0) cuts.push(p - Math.sqrt(r), p + Math.sqrt(r)); }
      const xs = cuts.filter((x) => x >= xlo && x <= xhi).sort((s, t) => s - t);
      let last = null;
      for (let i = 0; i + 1 < xs.length; i += 1) {
        const s = xs[i], t = xs[i + 1], m = f((s + t) / 2);
        if (t - s < 1e-9 || m < ylo || m > yhi) continue;
        const pts = [];
        for (let j = 0; j <= 80; j += 1) { const x = s + (t - s) * j / 80; pts.push(PX(x) + ' ' + PY(Math.min(yhi, Math.max(ylo, f(x))))); }
        out += `<path d="M${pts.join('L')}" style="fill:none;stroke:${INK[k % 3]};stroke-width:1.8"/>`;
        last = [t, f(t)];
      }
      if (c.name && last) words += text(Number(PX(last[0])) + (last[0] > p ? -6 : 6), Number(PY(last[1])) + (last[1] >= yhi - 0.01 ? 13 : -5), c.name, last[0] > p ? 'end' : 'start', 'fill:' + INK[k % 3]);
    });
    (o.lines || []).forEach((l) => {
      const m = num(l.m), n = num(l.n || 0); let lo = xlo, hi = xhi;
      if (m !== 0) { const s = (ylo - n) / m, t = (yhi - n) / m; lo = Math.max(lo, Math.min(s, t)); hi = Math.min(hi, Math.max(s, t)); }
      out += `<line x1="${PX(lo)}" y1="${PY(m * lo + n)}" x2="${PX(hi)}" y2="${PY(m * hi + n)}" style="stroke:#15803d;stroke-width:1.7${l.dash ? ';stroke-dasharray:5 3' : ''}"/>`;
      if (l.name) words += text(Number(PX(hi)) + (m < 0 ? 4 : -4), Number(PY(m * hi + n)) + (m < 0 ? 13 : -5), l.name, m < 0 ? 'start' : 'end', 'fill:#15803d');
    });
    const DASH = 'stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2';
    for (const p of o.points || []) {
      if ((p.drop === 'x' || p.drop === true) && num(p.y) !== 0) out += `<line x1="${PX(p.x)}" y1="${PY(p.y)}" x2="${PX(p.x)}" y2="${oy}" style="${DASH}"/>`;
      if ((p.drop === 'y' || p.drop === true) && num(p.x) !== 0) out += `<line x1="${PX(p.x)}" y1="${PY(p.y)}" x2="${ox}" y2="${PY(p.y)}" style="${DASH}"/>`;
    }
    for (const p of o.points || []) {
      out += `<circle class="mb-dot" cx="${PX(p.x)}" cy="${PY(p.y)}" r="3"/>`;
      if (p.name) { const [dx, dy, an] = sideOf[p.side || 'ur']; words += text(Number(PX(p.x)) + dx, Number(PY(p.y)) + dy, p.name, an, 'font-size:13px'); }
    }
    for (const m of o.xnums || []) words += text(Number(PX(m.v)) + (m.dx || 0), oy + (m.up ? -6 : 15), m.text == null ? plain(asQ(m.v)) : m.text);
    for (const m of o.ynums || []) words += text(ox + (m.right ? 5 : -5), Number(PY(m.v)) + 4, m.text == null ? plain(asQ(m.v)) : m.text, m.right ? 'start' : 'end');
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(Hh)}" width="${Math.round(W)}" role="img" aria-label="${o.say}">${under}${out}${words}</svg>`;
  }
  // 그림 속 문자(기울인 글자)
  const sv = (t) => `<tspan style="${ITALIC};font-size:1.1em">${t}</tspan>`;
  const sT = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));

  B.kit.m1014 = {
    nb,
    S4, S5, S6, seal, retry, srcOf, T, H, X, Y, K, Av, Bv, Cv, Mv, Nv, Pv, Tv, Fv, X2, XA, YA, num, iq, jn, sgn, par, is, pt, coefT, kv, more, quadR, fy, linR, ly, eq0, fx, dq, Dv,
    cmpW, dCmp, jw, nj, REL, REL_SAID, relOf, relQ, RM, threeQ, vals, maxMin, coord, sv, sT, ITALIC, HALO
  };

  // ── 묶음 ──
  B.addUnit({
    id: '10-1-4', grade: 10, semester: 1, no: 4, title: '이차방정식과 이차함수', version: 1,
    groups: [
      // ── 가. 이차함수의 그래프와 x축 ──
      {
        id: 'xaxis', title: '이차함수의 그래프와 x축', standard: S4,
        types: [
          T('xaxis-relation', '이차함수의 그래프와 x축의 위치 관계', '①1', (d, n) => {
            if (n === 0) {
              const a = d.pick([1, 1, 2, 3, -1, -2, -3]), kind = d.int(0, 2);
              let b, c;
              if (kind === 1) { const p = nz(d, -4, 4); b = -2 * a * p; c = a * p * p; } else { b = nz(d, -9, 9); c = nz(d, -12, 12); }
              const D = b * b - 4 * a * c;
              if (relOf(D) !== kind || Math.abs(b) > 16 || Math.abs(c) > 32) return null;
              return relQ(d, `이차함수 ${fy(a, b, c)}의 그래프와 ${XA}의 위치 관계는?`, D,
                `이차방정식 ${eq0(quadR(a, b, c))}의 판별식은 ${dCmp(a, b, c)}이므로 그래프와 ${XA}은 ${REL_SAID[kind]}.`, 'x-rel');
            }
            // 일차항의 계수에 근호가 든 식: D/4 = (√s)² − ac
            const s = d.pick([2, 3, 5, 6, 7]), a = d.pick([1, 2, 3, -1, -2]), sg = pm(d), kind = d.int(0, 2);
            let c;
            if (kind === 1) { if (s % a !== 0) return null; c = s / a; } else c = nz(d, -6, 6);
            const q = s - a * c;
            if (relOf(q) !== kind) return null;
            const count = [2, 1, 0][kind], f = `${coefT(a)}${X2} ${sg > 0 ? '+' : MINUS} 2${rt(s)}${X} ${sgn(c)}`;
            return N(`이차함수 ${nb(`${Y} = ${f}`)}의 그래프와 ${XA}의 교점의 개수는?`, count, {
              explain: `이차방정식 ${eq0(f)}의 판별식을 ${Dv}라 하면 ${dq} = (${sg < 0 ? MINUS : ''}${rt(s)})${sup(2)} ${MINUS} ${par(a)} × ${par(c)} = ${iq(q)}${q === 0 ? '' : ' ' + cmpW(q) + ' 0'}이다. `
                + `따라서 그래프와 ${XA}은 ${REL_SAID[kind]}. 교점의 개수는 ${count}이다.`,
              facts: { value: String(count), derived: [count], rule: 'x-count' }
            });
          }, { count: 2 }),
          T('xaxis-claims', '실근은 x축과의 교점의 x좌표 — 옳지 않은 설명 고르기', '①3', (d) => {
            const r1 = nz(d, -5, 5), r2 = nz(d, -5, 5);
            if (r1 >= r2) return null;
            const b = -(r1 + r2), c = r1 * r2;
            if (b === 0 || [r1, r2, -r1, -r2].includes(c) || Math.abs(c) > 20) return null;
            const f = quadR(1, b, c), E = eq0(f);
            const yes = [`그래프와 ${XA}의 교점의 ${X}좌표는 ${iq(r1)}, ${iq(r2)}이다.`, `이차방정식 ${E}의 실근은 ${iq(r1)}, ${iq(r2)}이다.`,
              `그래프는 ${XA}과 서로 다른 두 점에서 만난다.`, `이차방정식 ${E}의 판별식의 값은 양수이다.`];
            const no = [
              [`그래프가 ${YA}과 만나는 점의 ${Y}좌표가 ${iq(c)}이므로 ${is(X, c)}${tail(Math.abs(c), '은/는')} 이차방정식 ${E}의 근이다.`,
                `${YA}과 만나는 점의 ${Y}좌표는 실근이 아니다. 이차방정식 ${E}의 실근은 그래프와 ${XA}의 교점의 ${X}좌표 ${iq(r1)}, ${iq(r2)}이다.`, ''],
              [`이차방정식 ${E}의 실근은 ${iq(-r2)}, ${iq(-r1)}이다.`, `${nb(`${f} = (${X} ${sgn(-r1)})(${X} ${sgn(-r2)})`)}이므로 실근은 ${iq(r1)}, ${iq(r2)}이다.`, yes[1]]
            ];
            return claimQ(d, `이차함수 ${fy(1, b, c)}의 그래프에 대한 설명으로 옳지 않은 것은?`, yes, no, false);
          }),
          T('xaxis-graph-roots', '그래프의 모양으로 실근·허근의 개수와 판별식의 부호', '①4·10', (d, n) => {
            const a = d.pick([1, -1, 0.5, -0.5]), kind = d.int(0, 2), sa = Math.sign(a), p = n === 0 ? d.int(-2, 2) : nz(d, -2, 2);
            const q = kind === 1 ? 0 : (kind === 0 ? -sa : sa) * d.int(1, 3);
            const fig = plane({ x: [-5, 5], y: [-5, 5], parabolas: [{ a, p, q }], ticks: 'none', grid: false });
            if (n === 0) {
              const real = [2, 1, 0][kind], imag = [0, 0, 2][kind];
              return M(`이차함수 ${fx}의 그래프가 그림과 같을 때, 이차방정식 ${eq0(`${Fv}(${X})`)}의 서로 다른 실근의 개수와 허근의 개수를 각각 구하시오.`,
                [{ lead: '서로 다른 실근:', answer: real, unit: '개' }, { lead: '허근:', answer: imag, unit: '개' }], {
                  figure: fig, shown: `서로 다른 실근 ${real}개, 허근 ${imag}개`,
                  explain: [`그래프가 ${XA}과 서로 다른 두 점에서 만나므로 서로 다른 두 실근을 갖고 허근은 없다.`, `그래프가 ${XA}에 접하므로 중근(서로 같은 두 실근)을 갖는다. 서로 다른 실근은 1개이고 허근은 없다.`,
                    `그래프가 ${XA}과 만나지 않으므로 실근이 없고 서로 다른 두 허근을 갖는다.`][kind],
                  facts: { roots: [real, imag] }
                });
            }
            // 계수와 판별식의 부호(a, b, c 의 부호는 중3에서 하는 일 — 판별식의 부호를 늘 보기에 넣는다)
            const c = a * p * p + q, b = -2 * a * p, D = b * b - 4 * a * c;
            if (c === 0 || Math.abs(c) > 4.5) return null;
            const Dt = `${Bv}${sup(2)} ${MINUS} 4${Av}${Cv}`;
            const all = [[`${Av} ${GT} 0`, a > 0, 'a'], [`${Av} ${LT} 0`, a < 0, 'a'], [`${Bv} ${GT} 0`, b > 0, 'b'], [`${Bv} ${LT} 0`, b < 0, 'b'], [`${Cv} ${GT} 0`, c > 0, 'c'], [`${Cv} ${LT} 0`, c < 0, 'c'],
              [`${Dt} ${GT} 0`, D > 0, 'D'], [`${Dt} = 0`, D === 0, 'D'], [`${Dt} ${LT} 0`, D < 0, 'D']];
            const right = d.bool() ? all.find((s) => s[1] && s[2] === 'D') : d.pick(all.filter((s) => s[1]));
            // 맞는 말과 같은 문자의 반대말(a > 0 과 a < 0)은 함께 내지 않는다(둘 중 하나만 보면 풀린다).
            const wrongD = d.pick(all.filter((s) => !s[1] && s[2] === 'D' && s !== right)), others = d.shuffle(all.filter((s) => !s[1] && s[2] !== 'D' && s[2] !== right[2])).slice(0, 2);
            const rows = d.shuffle([right, wrongD].concat(others));
            return C(`이차함수 ${nb(`${Y} = ${Av}${X2} + ${Bv}${X} + ${Cv}`)}의 그래프가 그림과 같을 때, 다음 중 옳은 것은? (단, ${Av}, ${Bv}, ${jw(Cv, '은/는')} 상수이다.)`, rows.map((r) => nb(r[0])), rows.indexOf(right), {
              figure: fig,
              explain: `${a > 0 ? '아래로' : '위로'} 볼록하므로 ${nb(`${Av} ${a > 0 ? GT : LT} 0`)}, 축이 ${YA}의 ${p > 0 ? '오른쪽' : '왼쪽'}에 있으므로 ${Av}와 ${Bv}의 부호가 ${p > 0 ? '다르고' : '같고'} ${nb(`${Bv} ${b > 0 ? GT : LT} 0`)}, `
                + `${YA}과 원점보다 ${c > 0 ? '위쪽' : '아래쪽'}에서 만나므로 ${nb(`${Cv} ${c > 0 ? GT : LT} 0`)}이다. 그래프가 ${XA}과 ${['서로 다른 두 점에서 만나므로', '한 점에서 만나므로(접하므로)', '만나지 않으므로'][kind]} ${nb(`${Dt} ${D > 0 ? GT : D < 0 ? LT : '='} 0`)}이다.`,
              facts: { truth: rows.map((r) => r === right), want: true }
            });
          }, { count: 2 }),
          T('xaxis-three-cases', 'x축과의 위치 관계 세 가지에 맞는 k의 값과 범위', '①5', (d, n) => {
            if (n === 0) {
              const a = d.pick([1, 1, 2, -1, -2, 3]), s = d.pick([1, 1, 2, -1]), t = d.int(-4, 4), b = nz(d, -8, 8), top = b * b - 4 * a * t;
              if (top % (4 * a * s) !== 0) return null;
              const k0 = top / (4 * a * s);
              if (k0 === 0 || Math.abs(k0) > 12) return null;
              const two = a * s > 0 ? '<' : '>', none = two === '<' ? '>' : '<', f = nb(`${quadR(a, b, 0)} ${more(s, K)}${t ? ' ' + sgn(t) : ''}`);
              return threeQ(`이차함수 ${nb(`${Y} = ${f}`)}의 그래프와 ${XA}의 위치 관계가 다음과 같을 때, 실수 ${K}의 값 또는 범위를 구하시오.`, K, k0, two, none, {
                explain: `이차방정식 ${eq0(f)}의 판별식은 ${nb(`${Dv} = ${par(b)}${sup(2)} ${MINUS} 4 × ${par(a)} × (${poly([[s, K], [t, '']])})`)} = ${poly([[-4 * a * s, K], [top, '']])}이다. `
                  + `⑴ ${nb(`${Dv} ${GT} 0`)}에서 ${nb(`${K} ${RM[two]} ${iq(k0)}`)}, ⑵ ${nb(`${Dv} = 0`)}에서 ${is(K, k0)}, ⑶ ${nb(`${Dv} ${LT} 0`)}에서 ${nb(`${K} ${RM[none]} ${iq(k0)}`)}이다.`,
                facts: { calc: [1, 2, 4].map((i) => [`((${jn(b)})*(${jn(b)})-4*(${jn(a)})*(${jn(t)}))/(4*(${jn(a)})*(${jn(s)}))`, i]), derived: [4] }
              });
            }
            // k 가 일차항과 상수항에 함께 든 꼴: y = ±x² + 2(k − p)x ± k², D/4 = (k − p)² − k² = p² − 2pk
            const sa = pm(d), p = 2 * nz(d, -3, 3), k0 = p / 2, two = p > 0 ? '<' : '>', none = two === '<' ? '>' : '<';
            const f = nb(`${sa < 0 ? MINUS : ''}${X2} + 2(${K} ${sgn(-p)})${X} ${sa < 0 ? MINUS : '+'} ${K}${sup(2)}`);
            return threeQ(`이차함수 ${nb(`${Y} = ${f}`)}의 그래프와 ${XA}의 위치 관계가 다음과 같을 때, 실수 ${K}의 값 또는 범위를 구하시오.`, K, k0, two, none, {
              explain: `이차방정식 ${eq0(f)}의 판별식을 ${Dv}라 하면 ${dq} = ${nb(`(${K} ${sgn(-p)})${sup(2)} ${MINUS} ${K}${sup(2)}`)} = ${poly([[-2 * p, K], [p * p, '']])}이다. `
                + `⑴ ${nb(`${Dv} ${GT} 0`)}에서 ${nb(`${K} ${RM[two]} ${iq(k0)}`)}, ⑵ ${nb(`${Dv} = 0`)}에서 ${is(K, k0)}, ⑶ ${nb(`${Dv} ${LT} 0`)}에서 ${nb(`${K} ${RM[none]} ${iq(k0)}`)}이다.`,
              facts: { calc: [1, 2, 4].map((i) => [`(${jn(p)})/2`, i]) }
            });
          }, { count: 2 }),
          T('xaxis-one-case', 'x축과의 위치 관계 하나로 상수 구하기', '①6', (d, n) => {
            if (n === 0) {
              // 한 점에서 만날 때: y = ax² + bx + c − p, p = c − b²/(4a)(정수가 아닌 분수)
              const a = d.pick([2, 3, 4, -2, -3, -4]), b = nz(d, -7, 7), c = d.int(-5, 5), p = qsub(Q(c), Q(b * b, 4 * a));
              if (isInt(p) || p.q > 16) return null;
              const f = `${quadR(a, b, c)} ${MINUS} ${Pv}`;
              return ansV(`이차함수 ${nb(`${Y} = ${f}`)}의 그래프가 ${XA}과 한 점에서 만날 때, 실수 ${Pv}의 값은?`, p, 'frac', {
                explain: `이차방정식 ${eq0(f)}이 중근을 가져야 하므로 판별식 ${nb(`${Dv} = ${par(b)}${sup(2)} ${MINUS} 4 × ${par(a)} × (${poly([[c, ''], [-1, Pv]])}) = 0`)}이다. `
                  + `${nb(`${poly([[4 * a, Pv], [b * b - 4 * a * c, '']])} = 0`)}에서 ${is(Pv, p)}이다.`,
                facts: { value: `${jn(c)}-(${jn(b)})*(${jn(b)})/(4*(${jn(a)}))`, derived: [4] }
              });
            }
            // x축과 만나도록 하는 정수 a 의 최솟값(최댓값): D/4 = −sa − t ≥ 0
            const s = nz(d, -5, 5), t = nz(d, -12, 12), bound = -t / s, ask = s < 0 ? 'min' : 'max';
            const ans = ask === 'min' ? Math.ceil(bound - 1e-9) : Math.floor(bound + 1e-9);
            if (Math.abs(ans) > 9 || ans === 0) return null;
            const f = `${X2} + 2${Av}${X} + ${Av}${sup(2)} ${more(s, Av)} ${sgn(t)}`;
            return N(`이차함수 ${nb(`${Y} = ${f}`)}의 그래프가 ${XA}과 만나도록 하는 정수 ${Av}의 ${ask === 'min' ? '최솟값' : '최댓값'}은?`, ans, {
              signed: true,
              explain: `${XA}과 만나려면(접할 때를 넣어) 이차방정식 ${eq0(f)}이 실근을 가져야 하므로 판별식 ${Dv}가 ${nb(`${Dv} ${GE} 0`)}이어야 한다. `
                + `${dq} = ${nb(`${Av}${sup(2)} ${MINUS} (${Av}${sup(2)} ${more(s, Av)} ${sgn(t)})`)} = ${poly([[-s, Av], [-t, '']])} ${GE} 0에서 ${nb(`${Av} ${ask === 'min' ? GE : LE} ${iq(Q(-t, s))}`)}이다. 따라서 정수 ${Av}의 ${ask === 'min' ? '최솟값' : '최댓값'}은 ${iq(ans)}이다.`,
              facts: { value: jn(ans), derived: [Math.abs(ans)] }
            });
          }, { count: 2 }),
          T('xaxis-roots-coef', 'x축과의 두 교점으로 계수 구하기', '①7', (d, n) => {
            if (n === 0) {
              const r1 = nz(d, -6, 6), r2 = nz(d, -6, 6);
              if (r1 >= r2 || r1 === -r2) return null;
              const a = -(r1 + r2), b = r1 * r2;
              return vals(`이차함수 ${nb(`${Y} = ${X2} + ${Av}${X} + ${Bv}`)}의 그래프가 ${XA}과 두 점 ${pt(r1, 0)}, ${pt(r2, 0)}에서 만날 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
                explain: `교점의 ${X}좌표 ${iq(r1)}, ${jw(iq(r2), '은/는')} 이차방정식 ${eq0(`${X2} + ${Av}${X} + ${Bv}`)}의 두 실근이다. 근과 계수의 관계에서 ${nb(`${iq(r1)} + ${par(r2)} = ${MINUS}${Av}`)}, ${nb(`${iq(r1)} × ${par(r2)} = ${Bv}`)}이므로 ${is(Av, a)}, ${is(Bv, b)}이다.`,
                facts: { calc: [[`0-(${jn(r1)})-(${jn(r2)})`, 0], [`(${jn(r1)})*(${jn(r2)})`, 1]] }
              });
            }
            // 한 교점의 x좌표가 문자: y = mx² + ax + c, (r, 0), (b, 0)
            const m = d.pick([1, 1, 2, 3]), r = nz(d, -5, 5), b = nz(d, -6, 6);
            if (b === r) return null;
            const c = m * r * b, a = -m * (r + b);
            if (Math.abs(c) > 40 || a === 0) return null;
            return vals(`이차함수 ${nb(`${Y} = ${coefT(m)}${X2} + ${Av}${X} ${sgn(c)}`)}의 그래프가 ${XA}과 두 점 ${pt(r, 0)}, ${pt(Bv, 0)}에서 만날 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
              explain: `${iq(r)}${tail(Math.abs(r), '과/와')} ${jw(Bv, '은/는')} 이차방정식 ${eq0(`${coefT(m)}${X2} + ${Av}${X} ${sgn(c)}`)}의 두 실근이다. 두 근의 곱에서 ${nb(`${iq(r)} × ${Bv} = ${m === 1 ? iq(c) : frac(iq(c), m)}`)}이므로 ${is(Bv, b)}이고, `
                + `두 근의 합에서 ${nb(`${iq(r)} + ${par(b)} = ${MINUS}${m === 1 ? Av : frac(Av, m)}`)}이므로 ${is(Av, a)}이다.`,
              facts: { calc: [[`0-(${m})*((${jn(r)})+(${jn(c)})/((${m})*(${jn(r)})))`, 0], [`(${jn(c)})/((${m})*(${jn(r)}))`, 1]] }
            });
          }, { count: 2 }),
          T('xaxis-shifted-roots', 'f(x) = 0의 두 근으로 f(mx + h) = 0의 두 근의 합·곱', '①8', (d, n) => {
            const m = d.pick([1, 1, 2]), h = nz(d, -4, 4);
            if (n === 0) {
              const p = nz(d, -4, 3), q = p + d.int(2, 5), a = d.pick([1, -1, 0.5, -0.5]), vy = -a * ((q - p) / 2) ** 2;
              if (q === 0 || q > 5 || Math.abs(vy) > 4.6 || (p - h) % m !== 0 || (q - h) % m !== 0) return null;
              const r1 = (p - h) / m, r2 = (q - h) / m, ask = d.bool() ? '합' : '곱', value = ask === '합' ? r1 + r2 : r1 * r2;
              if (value === 0) return null;
              const fig = plane({ x: [Math.min(p, 0) - 1, Math.max(q, 0) + 1], y: [-5, 5], parabolas: [{ a, p: (p + q) / 2, q: vy }],
                points: [{ x: p, y: 0, name: sT(p), side: a > 0 ? 'dl' : 'ul' }, { x: q, y: 0, name: sT(q), side: a > 0 ? 'dr' : 'ur' }], ticks: 'none', grid: false });
              const inside = linR(m, h);
              return N(`이차함수 ${fx}의 그래프가 그림과 같을 때, 이차방정식 ${eq0(`${Fv}(${inside})`)}의 두 실근의 ${ask}은?`, value, {
                signed: true, figure: fig,
                explain: `그래프가 ${XA}과 ${is(X, p)}, ${is(X, q)}에서 만나므로 ${eq0(`${Fv}(${X})`)}의 두 근은 ${iq(p)}, ${iq(q)}이다. ${eq0(`${Fv}(${inside})`)}이면 ${is(inside, p)} 또는 ${is(inside, q)}이므로 `
                  + `${is(X, r1)} 또는 ${is(X, r2)}이다. 두 실근의 ${ask}은 ${iq(value)}이다.`,
                facts: ask === '합' ? { value: `((${jn(p)})+(${jn(q)})-2*(${jn(h)}))/(${m})`, derived: [2] } : { value: `((${jn(p)})-(${jn(h)}))*((${jn(q)})-(${jn(h)}))/(${m}*${m})` }
              });
            }
            const s = nz(d, -8, 8), mm = d.pick([1, 2, 3]);
            if ((s - 2 * h) % mm !== 0) return null;
            const value = (s - 2 * h) / mm, inside = linR(mm, h);
            return N(`이차함수 ${fx}의 그래프가 ${XA}과 서로 다른 두 점 (α, 0), (β, 0)에서 만난다. ${nb(`α + β = ${iq(s)}`)}일 때, 이차방정식 ${eq0(`${Fv}(${inside})`)}의 두 실근의 합은?`, value, {
              signed: true,
              explain: `${eq0(`${Fv}(${X})`)}의 두 근은 α, β이다. ${eq0(`${Fv}(${inside})`)}이면 ${nb(`${inside} = α`)} 또는 ${nb(`${inside} = β`)}이므로 두 실근의 합은 `
                + `${nb(`${frac(`α ${sgn(-h)}`, mm)} + ${frac(`β ${sgn(-h)}`, mm)}`)} = ${frac(`α + β ${sgn(-2 * h)}`, mm)} = ${iq(value)}이다.`,
              facts: { value: `((${jn(s)})-2*(${jn(h)}))/(${mm})`, derived: [2] }
            });
          }, { count: 2 }),
          T('xaxis-distance-coef', 'x축과 만나는 두 점 사이의 거리로 계수 구하기', '①9', (d, n) => {
            if (n === 0) {
              const k = d.int(2, 6), c = nz(d, -12, 20), s = k * k - c;
              if (s < 2) return null;
              const [u, w] = sqParts(s), AB = w === 1 ? String(2 * u) : radText(2 * u, w);
              return N(`이차함수 ${nb(`${Y} = ${X2} + 2${K}${X} ${sgn(c)}`)}의 그래프가 ${XA}과 서로 다른 두 점 A, B에서 만난다. ${nb(`${SG('AB')} = ${AB}`)}일 때, 양수 ${K}의 값은?`, k, {
                explain: `${eq0(`${X2} + 2${K}${X} ${sgn(c)}`)}의 근은 ${nb(`${X} = ${MINUS}${K} ± ${rt(`${K}${sup(2)} ${sgn(-c)}`)}`)}이므로 ${nb(`${SG('AB')} = 2${rt(`${K}${sup(2)} ${sgn(-c)}`)}`)}이다. `
                  + `${nb(`2${rt(`${K}${sup(2)} ${sgn(-c)}`)} = ${AB}`)}에서 ${nb(`${K}${sup(2)} ${sgn(-c)} = ${s}`)}, ${nb(`${K}${sup(2)} = ${k * k}`)}이고 ${K}는 양수이므로 ${is(K, k)}이다.`,
                facts: { value: String(k), derived: [k] }
              });
            }
            const a0 = d.int(3, 9), dd = d.int(1, a0 - 1);
            if ((a0 * a0 - dd * dd) % 4 !== 0) return null;
            const c = (a0 * a0 - dd * dd) / 4;
            if (c < 1 || c > 20) return null;
            return inline(`이차함수 ${nb(`${Y} = ${X2} + ${Av}${X} + ${c}`)}의 그래프가 ${XA}과 만나는 서로 다른 두 점을 A, B라 하자. ${nb(`${SG('AB')} = ${dd}`)}일 때, 실수 ${Av}의 값을 모두 구하시오.`,
              `${Av} = ±{0}`, [{ answer: a0 }], {
                shown: is(Av, '±' + a0),
                explain: `두 점의 ${X}좌표를 α, β라 하면 근과 계수의 관계에서 ${nb(`α + β = ${MINUS}${Av}`)}, ${nb(`αβ = ${c}`)}이다. ${nb(`(β ${MINUS} α)${sup(2)} = (α + β)${sup(2)} ${MINUS} 4αβ`)}이므로 `
                  + `${nb(`${dd * dd} = ${Av}${sup(2)} ${MINUS} ${4 * c}`)}, ${nb(`${Av}${sup(2)} = ${a0 * a0}`)}이다. 따라서 ${is(Av, a0)} 또는 ${is(Av, -a0)}이다.`,
                facts: { calc: [[`(${dd}*${dd}+4*${c})**0.5`, 0]], derived: [4, 0.5] }
              });
          }, { count: 2 })
        ]
      },
      // ── 나. 이차함수의 그래프와 직선 ──
      {
        id: 'line', title: '이차함수의 그래프와 직선의 위치 관계', standard: S5,
        types: [
          T('line-relation', '이차함수의 그래프와 직선의 위치 관계', '①11', (d) => {
            const a = d.pick([1, 1, 2, -1, -2, 3, -3]), m = nz(d, -5, 5), kind = d.int(0, 2);
            let b, c, n;
            if (kind === 1) { const r = nz(d, -3, 3); b = m - 2 * a * r; n = d.int(-6, 6); c = n + a * r * r; } else { b = d.int(-7, 7); c = d.int(-8, 8); n = d.int(-8, 8); }
            const B_ = b - m, C_ = c - n, D = B_ * B_ - 4 * a * C_;
            if (relOf(D) !== kind || Math.abs(c) > 20 || Math.abs(b) > 12 || (B_ === 0 && C_ === 0)) return null;
            return relQ(d, `이차함수 ${fy(a, b, c)}의 그래프와 직선 ${ly(m, n)}의 위치 관계는?`, D,
              `${nb(`${quadR(a, b, c)} = ${linR(m, n)}`)}, 곧 ${eq0(quadR(a, B_, C_))}의 판별식은 ${dCmp(a, B_, C_)}이므로 그래프와 직선은 ${REL_SAID[kind]}.`, 'l-rel');
          }),
          T('line-cases-k', '직선과의 위치 관계에 맞는 k의 값과 범위', '①12', (d, n) => {
            if (n === 0) {
              // k 가 직선의 y절편: D = (b − m)² − 4a(c − k)
              const a = d.pick([1, 1, 2, -1, -2]), m = nz(d, -4, 4), b = d.int(-6, 6), c = d.int(-6, 6), B_ = b - m;
              if ((B_ * B_) % (4 * Math.abs(a)) !== 0) return null;
              const k0 = c - B_ * B_ / (4 * a), two = a > 0 ? '>' : '<', none = two === '<' ? '>' : '<';
              if (Math.abs(k0) > 15 || k0 === 0) return null;
              return threeQ(`이차함수 ${fy(a, b, c)}의 그래프와 직선 ${nb(`${Y} = ${linR(m, 0)} + ${K}`)}의 위치 관계가 다음과 같을 때, 실수 ${K}의 값 또는 범위를 구하시오.`, K, k0, two, none, {
                explain: `${nb(`${quadR(a, b, c)} = ${linR(m, 0)} + ${K}`)}, 곧 ${eq0(`${quadR(a, B_, c)} ${MINUS} ${K}`)}의 판별식은 ${nb(`${Dv} = ${par(B_)}${sup(2)} ${MINUS} 4 × ${par(a)} × (${poly([[c, ''], [-1, K]])})`)} = ${poly([[4 * a, K], [B_ * B_ - 4 * a * c, '']])}이다. `
                  + `⑴ ${nb(`${Dv} ${GT} 0`)}에서 ${nb(`${K} ${RM[two]} ${iq(k0)}`)}, ⑵ ${nb(`${Dv} = 0`)}에서 ${is(K, k0)}, ⑶ ${nb(`${Dv} ${LT} 0`)}에서 ${nb(`${K} ${RM[none]} ${iq(k0)}`)}이다.`,
                facts: { calc: [1, 2, 4].map((i) => [`${jn(c)}-((${jn(b)})-(${jn(m)}))*((${jn(b)})-(${jn(m)}))/(4*(${jn(a)}))`, i]), derived: [4] }
              });
            }
            if (n === 1) {
              // k 가 포물선의 상수항에(계수 s): D = (b − m)² − 4a(sk − n)
              const a = d.pick([1, 2, -1]), s = d.pick([1, 2, 3, 4, -1]), b = d.int(-6, 6), m = nz(d, -5, 5), n0 = d.int(-6, 6), B_ = b - m, top = B_ * B_ + 4 * a * n0;
              if (B_ === 0 || top % (4 * a * s) !== 0) return null;
              const k0 = top / (4 * a * s), want = d.bool() ? 'two' : 'none', rel = (want === 'two') === (a * s > 0) ? '<' : '>';
              if (Math.abs(k0) > 12 || k0 === 0) return null;
              const f = nb(`${quadR(a, b, 0)} ${more(s, K)}`);
              return ineqAns(`이차함수 ${nb(`${Y} = ${f}`)}의 그래프와 직선 ${jw(ly(m, n0), '이/가')} ${want === 'two' ? '서로 다른 두 점에서 만나도록' : '만나지 않도록'} 하는 실수 ${K}의 값의 범위를 구하시오.`, rel, k0, K, {
                explain: `${nb(`${f} = ${linR(m, n0)}`)}, 곧 ${eq0(`${quadR(a, B_, -n0)} ${more(s, K)}`)}의 판별식은 ${nb(`${Dv} = ${par(B_)}${sup(2)} ${MINUS} 4 × ${par(a)} × (${poly([[s, K], [-n0, '']])})`)} = ${poly([[-4 * a * s, K], [top, '']])}이다. `
                  + `${want === 'two' ? nb(`${Dv} ${GT} 0`) : nb(`${Dv} ${LT} 0`)}이어야 하므로 ${nb(`${K} ${RM[rel]} ${iq(k0)}`)}이다.`,
                facts: { calc: [[`(((${jn(b)})-(${jn(m)}))*((${jn(b)})-(${jn(m)}))+4*(${jn(a)})*(${jn(n0)}))/(4*(${jn(a)})*(${jn(s)}))`, 1]], derived: [4] }
              });
            }
            // k 가 포물선과 직선에 함께: y = x² + bx + pk + q, y = mx + k 가 한 점에서 만난다.
            const pK = d.pick([2, 3, -1, -2]), b = d.int(-5, 5), m = nz(d, -4, 4), q = d.int(-6, 6), B_ = b - m;
            if (B_ % 2 !== 0 || B_ === 0) return null;
            const top = B_ * B_ / 4 - q;
            if (top % (pK - 1) !== 0) return null;
            const k = top / (pK - 1);
            if (k === 0 || Math.abs(k) > 12) return null;
            const f = nb(`${quadR(1, b, 0)} ${more(pK, K)}${q ? ' ' + sgn(q) : ''}`);
            return N(`이차함수 ${nb(`${Y} = ${f}`)}의 그래프와 직선 ${nb(`${Y} = ${linR(m, 0)} + ${K}`)}가 한 점에서 만날 때, 실수 ${K}의 값은?`, k, {
              signed: true,
              explain: `${nb(`${f} = ${linR(m, 0)} + ${K}`)}, 곧 ${eq0(`${quadR(1, B_, q)} ${more(pK - 1, K)}`)}이 중근을 가져야 하므로 ${dq} = ${nb(`${par(B_ / 2)}${sup(2)} ${MINUS} (${poly([[pK - 1, K], [q, '']])}) = 0`)}이다. 따라서 ${is(K, k)}이다.`,
              facts: { value: `(((${jn(b)})-(${jn(m)}))*((${jn(b)})-(${jn(m)}))/4-(${jn(q)}))/((${jn(pK)})-1)`, derived: [4] }
            });
          }, { count: 3 }),
          T('line-at-least', '적어도 한 점에서 만나는 조건과 만나지 않는 자연수', '①13', (d, n) => {
            if (n === 0) {
              // y = x² − 2mx + m² + c 와 y = ex + f 가 적어도 한 점에서 만난다: D = 4em + e² − 4c + 4f ≥ 0
              const e = d.pick([2, -2, 4, -4]), c = nz(d, -6, 6), f = d.int(-6, 6), top = 4 * c - 4 * f - e * e;
              if (top % (4 * e) !== 0) return null;
              const m0 = top / (4 * e), rel = e > 0 ? '>=' : '<=';
              if (Math.abs(m0) > 10 || m0 === 0) return null;
              const g = `${X2} ${MINUS} 2${Mv}${X} + ${Mv}${sup(2)} ${sgn(c)}`;
              return ineqAns(`이차함수 ${nb(`${Y} = ${g}`)}의 그래프와 직선 ${jw(ly(e, f), '이/가')} 적어도 한 점에서 만나도록 하는 실수 ${Mv}의 값의 범위를 구하시오.`, rel, m0, Mv, {
                explain: `${nb(`${g} = ${linR(e, f)}`)}, 곧 ${eq0(`${X2} ${MINUS} (2${Mv} ${sgn(e)})${X} + ${Mv}${sup(2)}${c - f ? ' ' + sgn(c - f) : ''}`)}이 실근을 가져야 한다. `
                  + `적어도 한 점에서 만나는 것은 서로 다른 두 점에서 만나거나 접하는 것이므로 ${nb(`${Dv} ${GE} 0`)}이다. ${nb(`${Dv} = (2${Mv} ${sgn(e)})${sup(2)} ${MINUS} 4${c - f ? `(${Mv}${sup(2)} ${sgn(c - f)})` : Mv + sup(2)}`)} = ${poly([[4 * e, Mv], [e * e - 4 * c + 4 * f, '']])} ${GE} 0에서 ${nb(`${Mv} ${RM[rel]} ${iq(m0)}`)}이다.`,
                facts: { calc: [[`(4*(${jn(c)})-4*(${jn(f)})-(${jn(e)})*(${jn(e)}))/(4*(${jn(e)}))`, 1]], derived: [4] }
              });
            }
            if (n === 1) {
              // y = −x² + bx + c 와 y = mx + k 가 적어도 한 점에서 만나는 자연수 k 의 개수: k ≤ c + (m − b)²/4
              const b = d.int(-5, 5), c = d.int(-4, 6), m = nz(d, -5, 5), B_ = m - b;
              if (B_ % 2 === 0) return null;
              const count = c + (B_ * B_ - 1) / 4;
              if (count < 2 || count > 25) return null;
              return N(`이차함수 ${fy(-1, b, c)}의 그래프와 직선 ${nb(`${Y} = ${linR(m, 0)} + ${K}`)}가 적어도 한 점에서 만나도록 하는 자연수 ${K}의 개수는?`, count, {
                explain: `${nb(`${quadR(-1, b, c)} = ${linR(m, 0)} + ${K}`)}, 곧 ${eq0(`${quadR(1, B_, -c)} + ${K}`)}의 판별식이 ${nb(`${Dv} ${GE} 0`)}이어야 한다(접할 때를 넣는다). `
                  + `${nb(`${Dv} = ${par(B_)}${sup(2)} ${MINUS} 4${c ? `(${K} ${sgn(-c)})` : K}`)} = ${poly([[-4, K], [B_ * B_ + 4 * c, '']])} ${GE} 0에서 ${nb(`${K} ${LE} ${iq(Q(B_ * B_ + 4 * c, 4))}`)}이므로 자연수 ${K}는 1부터 ${count}까지 ${count}개이다.`,
                facts: { value: `(${jn(c)})+((${jn(m)}-(${jn(b)}))*((${jn(m)})-(${jn(b)}))-1)/4`, derived: [4] }
              });
            }
            // y = x² + bx + m 과 y = ex 가 만나지 않는 자연수 m 의 최솟값: m > (b − e)²/4
            const b = d.int(-6, 6), e = nz(d, -4, 4), B_ = b - e, ans = Math.floor(B_ * B_ / 4) + 1;
            if (B_ === 0 || ans > 20) return null;
            return N(`이차함수 ${nb(`${Y} = ${quadR(1, b, 0)} + ${Mv}`)}의 그래프와 직선 ${jw(ly(e, 0), '이/가')} 만나지 않도록 하는 자연수 ${Mv}의 최솟값은?`, ans, {
              explain: `${nb(`${quadR(1, b, 0)} + ${Mv} = ${linR(e, 0)}`)}, 곧 ${eq0(`${quadR(1, B_, 0)} + ${Mv}`)}의 판별식이 ${nb(`${Dv} ${LT} 0`)}이어야 한다(접하면 만난다). `
                + `${nb(`${Dv} = ${par(B_)}${sup(2)} ${MINUS} 4${Mv} ${LT} 0`)}에서 ${nb(`${Mv} ${GT} ${iq(Q(B_ * B_, 4))}`)}이므로 자연수 ${Mv}의 최솟값은 ${ans}이다.`,
              facts: { value: B_ % 2 === 0 ? `(${jn(b)}-(${jn(e)}))*((${jn(b)})-(${jn(e)}))/4+1` : `((${jn(b)}-(${jn(e)}))*((${jn(b)})-(${jn(e)}))-1)/4+1`, derived: [4] }
            });
          }, { count: 3 }),
          T('line-tangent-line', '이차함수의 그래프에 접하는 직선', '①14', (d, n) => {
            const a = n === 0 ? d.pick([1, 1, 2, -1, -2]) : d.pick([1, -1]), b = d.int(-6, 6), c = d.int(-6, 10), m = nz(d, -4, 4), B_ = b - m;
            if (B_ === 0 || (B_ * B_) % (4 * Math.abs(a)) !== 0) return null;
            const n0 = c - B_ * B_ / (4 * a);
            if (n0 === 0 || Math.abs(n0) > 20) return null;
            const why = `구하는 직선을 ${nb(`${Y} = ${linR(m, 0)} + ${Nv}`)}이라 하면 ${nb(`${quadR(a, b, c)} = ${linR(m, 0)} + ${Nv}`)}, 곧 ${eq0(`${quadR(a, B_, c)} ${MINUS} ${Nv}`)}이 중근을 가져야 한다. `
              + `${nb(`${Dv} = ${par(B_)}${sup(2)} ${MINUS} 4 × ${par(a)} × (${poly([[c, ''], [-1, Nv]])}) = 0`)}에서 ${is(Nv, n0)}이다.`;
            const value = `${jn(c)}-((${jn(b)})-(${jn(m)}))*((${jn(b)})-(${jn(m)}))/(4*(${jn(a)}))`;
            if (n === 0) {
              return N(`이차함수 ${fy(a, b, c)}의 그래프에 접하고 기울기가 ${iq(m)}인 직선의 ${Y}절편은?`, n0, { signed: true, explain: why, facts: { value, derived: [4] } });
            }
            const q = nz(d, -6, 6);
            if (q === n0) return null;
            return inline(`직선 ${eq0(poly([[m, X], [-1, Y], [q, '']]))}과 평행하고 이차함수 ${fy(a, b, c)}의 그래프에 접하는 직선의 방정식을 구하시오.`, `${Y} = {0}${X} {1}`,
              [{ answer: m, signed: true }, { answer: n0, signed: true }], {
                shown: ly(m, n0),
                explain: `직선 ${eq0(poly([[m, X], [-1, Y], [q, '']]))}은 ${ly(m, q)}이므로 기울기가 ${iq(m)}이다. 평행한 직선은 기울기가 같다. ` + why,
                facts: { calc: [[jn(m), 0], [value, 1]], derived: [4] }
              });
          }, { count: 2 }),
          T('line-roots-coef', '교점의 x좌표(합과 곱)로 계수 구하기', '①15', (d, n) => {
            if (n === 0) {
              const r1 = nz(d, -5, 5), r2 = nz(d, -5, 5), m = nz(d, -4, 4), n0 = d.int(-6, 6);
              if (r1 >= r2) return null;
              const a = m - (r1 + r2), b = n0 + r1 * r2;
              if (a === 0 || b === 0) return null;
              return vals(`이차함수 ${nb(`${Y} = ${X2} + ${Av}${X} + ${Bv}`)}의 그래프와 직선 ${jw(ly(m, n0), '이/가')} 만나는 두 점의 ${X}좌표가 ${iq(r1)}, ${iq(r2)}일 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
                explain: `${iq(r1)}, ${jw(iq(r2), '은/는')} 이차방정식 ${nb(`${X2} + ${Av}${X} + ${Bv} = ${linR(m, n0)}`)}, 곧 ${eq0(`${X2} + (${Av} ${sgn(-m)})${X} + ${Bv}${n0 ? ' ' + sgn(-n0) : ''}`)}의 두 근이다. `
                  + `근과 계수의 관계에서 ${nb(`${iq(r1)} + ${par(r2)} = ${MINUS}(${Av} ${sgn(-m)})`)}, ${nb(`${iq(r1)} × ${par(r2)} = ${Bv}${n0 ? ' ' + sgn(-n0) : ''}`)}이므로 ${is(Av, a)}, ${is(Bv, b)}이다.`,
                facts: { calc: [[`(${jn(m)})-(${jn(r1)})-(${jn(r2)})`, 0], [`(${jn(n0)})+(${jn(r1)})*(${jn(r2)})`, 1]] }
              });
            }
            if (n === 1) {
              // 그림: y = −x² + b 와 y = ax + c 의 두 교점(x좌표만 적혀 있다)
              const r1 = -d.int(1, 3), r2 = d.int(1, 3), a = -(r1 + r2), c = nz(d, -2, 3), b = c - r1 * r2, y1 = a * r1 + c, y2 = a * r2 + c;
              if (a === 0 || b < 2 || Math.abs(y1) < 1 || Math.abs(y2) < 1 || Math.max(b, y1, y2) > 7 || Math.min(y1, y2) < -5) return null;
              const fig = coord({ x: [r1 - 1.2, r2 + 1.2], y: [Math.min(y1, y2, 0) - 1.4, Math.max(b, y1, y2, 0) + 1.2],
                parabolas: [{ a: -1, p: 0, q: b }], lines: [{ m: a, n: c }], points: [{ x: r1, y: y1, drop: 'x' }, { x: r2, y: y2, drop: 'x' }], oUp: c < 0 || (r1 === -1 && y1 > 0),
                xnums: [{ v: r1, dx: y1 > 0 ? 7 : -7, up: y1 < 0 }, { v: r2, dx: y2 > 0 ? -7 : 7, up: y2 < 0 }],
                say: `좌표평면: 위로 볼록한 포물선 y = −x² + b와 직선 y = ax ${c < 0 ? '−' : '+'} ${Math.abs(c)}${tail(Math.abs(c), '이/가')} 두 점에서 만난다. 두 교점에서 x축으로 내린 점선이 x축의 ${sT(r1)}, ${sT(r2)}인 곳에 닿는다.` });
              return vals(`이차함수 ${nb(`${Y} = ${MINUS}${X2} + ${Bv}`)}의 그래프와 직선 ${jw(nb(`${Y} = ${Av}${X} ${sgn(c)}`), '이/가')} 그림과 같이 서로 다른 두 점에서 만날 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
                figure: fig,
                explain: `두 교점의 ${X}좌표 ${iq(r1)}, ${jw(iq(r2), '은/는')} ${nb(`${MINUS}${X2} + ${Bv} = ${Av}${X} ${sgn(c)}`)}, 곧 ${eq0(`${X2} + ${Av}${X} ${sgn(c)} ${MINUS} ${Bv}`)}의 두 근이다. `
                  + `근과 계수의 관계에서 ${nb(`${iq(r1)} + ${par(r2)} = ${MINUS}${Av}`)}, ${nb(`${iq(r1)} × ${par(r2)} = ${iq(c)} ${MINUS} ${Bv}`)}이므로 ${is(Av, a)}, ${is(Bv, b)}이다.`,
                facts: { calc: [[`0-(${jn(r1)})-(${jn(r2)})`, 0], [`(${jn(c)})-(${jn(r1)})*(${jn(r2)})`, 1]] }
              });
            }
            if (n === 2) {
              // 두 교점의 x좌표의 합과 곱이 주어진다.
              const p0 = nz(d, -6, 6), m = nz(d, -4, 4), s = nz(d, -7, 7), t = nz(d, -8, 8);
              if (s * s - 4 * t <= 0) return null;
              const a = m - s, b = p0 - t;
              if (a === 0 || b === 0) return null;
              return vals(`이차함수 ${nb(`${Y} = ${X2} + ${Av}${X} ${sgn(p0)}`)}의 그래프와 직선 ${nb(`${Y} = ${linR(m, 0)} + ${Bv}`)}의 두 교점의 ${X}좌표의 합이 ${iq(s)}이고 곱이 ${iq(t)}일 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
                explain: `교점의 ${X}좌표는 ${nb(`${X2} + ${Av}${X} ${sgn(p0)} = ${linR(m, 0)} + ${Bv}`)}, 곧 ${eq0(`${X2} + (${Av} ${sgn(-m)})${X} ${sgn(p0)} ${MINUS} ${Bv}`)}의 두 근이다. `
                  + `근과 계수의 관계에서 ${nb(`${MINUS}(${Av} ${sgn(-m)}) = ${iq(s)}`)}, ${nb(`${iq(p0)} ${MINUS} ${Bv} = ${iq(t)}`)}이므로 ${is(Av, a)}, ${is(Bv, b)}이다.`,
                facts: { calc: [[`(${jn(m)})-(${jn(s)})`, 0], [`(${jn(p0)})-(${jn(t)})`, 1]] }
              });
            }
            // 최고차항의 계수가 1인 f: f(x) − (mx + n) = (x − r1)(x − r2)
            const r1 = nz(d, -4, 4), r2 = nz(d, -4, 5), m = nz(d, -4, 4), n0 = nz(d, -6, 6), t0 = d.int(-4, 5);
            if (r1 >= r2 || [r1, r2].includes(t0)) return null;
            const v = (t0 - r1) * (t0 - r2) + m * t0 + n0;
            if (Math.abs(v) > 60) return null;
            return N(`최고차항의 계수가 1인 이차함수 ${fx}의 그래프와 직선 ${jw(ly(m, n0), '이/가')} 두 점에서 만나고, 두 교점의 ${X}좌표가 ${iq(r1)}, ${iq(r2)}이다. ${Fv}(${iq(t0)})의 값은?`, v, {
              signed: true,
              explain: `${eq0(`${Fv}(${X}) ${MINUS} (${linR(m, n0)})`)}의 두 근이 ${iq(r1)}, ${iq(r2)}이고 최고차항의 계수가 1이므로 ${nb(`${Fv}(${X}) ${MINUS} (${linR(m, n0)}) = (${X} ${sgn(-r1)})(${X} ${sgn(-r2)})`)}이다. `
                + `따라서 ${nb(`${Fv}(${iq(t0)}) = (${iq(t0)} ${sgn(-r1)})(${iq(t0)} ${sgn(-r2)}) + ${par(m)} × ${par(t0)} ${sgn(n0)} = ${iq(v)}`)}이다.`,
              facts: { value: `((${jn(t0)})-(${jn(r1)}))*((${jn(t0)})-(${jn(r2)}))+(${jn(m)})*(${jn(t0)})+(${jn(n0)})` }
            });
          }, { count: 4 }),
          T('line-roots-expr', '교점의 x좌표 α, β로 만든 식의 값', '①16', (d, n) => {
            if (n === 0) {
              const b = d.int(-6, 6), c = d.int(-6, 6), m = nz(d, -4, 4), n0 = d.int(-6, 6), h = nz(d, -3, 3), S = m - b, P = c - n0;
              if (S * S - 4 * P <= 0 || P === 0) return null;
              const inner = P + h * S + h * h, v = inner * inner;
              if (inner === 0 || v > 400) return null;
              return N(`이차함수 ${fy(1, b, c)}의 그래프와 직선 ${jw(ly(m, n0), '이/가')} 서로 다른 두 점에서 만나고, 두 교점의 ${X}좌표를 α, β라 할 때, ${nb(`(α ${sgn(h)})${sup(2)}(β ${sgn(h)})${sup(2)}`)}의 값은?`, v, {
                explain: `α, β는 ${nb(`${quadR(1, b, c)} = ${linR(m, n0)}`)}, 곧 ${eq0(quadR(1, b - m, c - n0))}의 두 근이므로 ${nb(`α + β = ${iq(S)}`)}, ${nb(`αβ = ${iq(P)}`)}이다. `
                  + `${nb(`(α ${sgn(h)})(β ${sgn(h)}) = αβ ${more(h, '(α + β)')} + ${h * h} = ${iq(inner)}`)}이므로 구하는 값은 ${nb(`${par(inner)}${sup(2)} = ${v}`)}이다.`,
                facts: { value: `((${jn(c)}-(${jn(n0)}))+(${jn(h)})*((${jn(m)})-(${jn(b)}))+(${jn(h)})*(${jn(h)}))**2`, derived: [2] }
              });
            }
            // y = x² 와 y = mx − c, α + β = s 일 때 m|α − β| = s√(s² − 4c)
            const s = pm(d) * d.int(2, 6), c = nz(d, -8, 8), dsc = s * s - 4 * c;
            if (dsc <= 1) return null;
            const [u, w] = sqParts(dsc);
            if (w === 1) return null;
            const coefA = s * u;
            return radAns(`이차함수 ${nb(`${Y} = ${X2}`)}의 그래프와 직선 ${nb(`${Y} = ${Mv}${X} ${sgn(-c)}`)}의 두 교점의 ${X}좌표를 α, β라 하자. ${nb(`α + β = ${iq(s)}`)}일 때, ${nb(`${Mv}|α ${MINUS} β|`)}의 값은?`, coefA, w, {
              explain: `α, β는 ${eq0(`${X2} ${MINUS} ${Mv}${X} ${sgn(c)}`)}의 두 근이므로 ${nb(`α + β = ${Mv}`)}, ${nb(`αβ = ${iq(c)}`)}이다. 따라서 ${is(Mv, s)}이다. `
                + `${nb(`(α ${MINUS} β)${sup(2)} = (α + β)${sup(2)} ${MINUS} 4αβ = ${dsc}`)}이므로 ${nb(`|α ${MINUS} β| = ${radText(u, w)}`)}이고 구하는 값은 ${nb(`${par(s)} × ${radText(u, w)} = ${radText(coefA, w)}`)}이다.`,
              facts: { calc: [[`(${jn(s)})*${u}`, 0], [String(w), 1]], derived: [u, w] }
            });
          }, { count: 2 }),
          T('line-tangent-point', '접점이 주어질 때 계수 구하기', '①17', (d, n) => {
            if (n === 0) {
              const p = nz(d, -4, 4), m = nz(d, -4, 4), n0 = d.int(-6, 6), q = m * p + n0, a = m - 2 * p, b = n0 + p * p;
              if (a === 0 || b === 0 || Math.abs(q) > 20) return null;
              return vals(`이차함수 ${nb(`${Y} = ${X2} + ${Av}${X} + ${Bv}`)}의 그래프와 직선 ${jw(ly(m, n0), '이/가')} 점 ${pt(p, q)}에서 접할 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
                explain: `${eq0(`${X2} + ${Av}${X} + ${Bv} ${MINUS} (${linR(m, n0)})`)}은 ${is(X, p)}${tail(Math.abs(p), '을/를')} 중근으로 가지므로 좌변은 ${jw(nb(`(${X} ${sgn(-p)})${sup(2)} = ${quadR(1, -2 * p, p * p)}`), '과/와')} 같다. `
                  + `${nb(`${X2} + (${Av} ${sgn(-m)})${X} + ${Bv}${n0 ? ' ' + sgn(-n0) : ''}`)}의 계수를 맞대면 ${is(Av, a)}, ${is(Bv, b)}이다.`,
                facts: { calc: [[`(${jn(m)})-2*(${jn(p)})`, 0], [`(${jn(n0)})+(${jn(p)})*(${jn(p)})`, 1]], derived: [2] }
              });
            }
            // x축과 점 (b, 0)에서 접한다: y = cx² + ex + a
            const c = d.pick([1, 2, 3, -1, -2, -3]), b = nz(d, -4, 4), e = -2 * c * b, a = c * b * b;
            return vals(`이차함수 ${nb(`${Y} = ${coefT(c)}${X2} ${sgn(e)}${X} + ${Av}`)}의 그래프가 ${XA}과 점 ${pt(Bv, 0)}에서 접할 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
              explain: `${XA}에 접하므로 꼭짓점이 ${XA} 위에 있다. ${nb(`${Y} = ${coefT(c)}(${X} ${sgn(-b)})${sup(2)} + ${Av} ${sgn(-a)}`)}이므로 ${is(Bv, b)}이고 ${nb(`${Av} ${sgn(-a)} = 0`)}에서 ${is(Av, a)}이다. `
                + `(판별식으로는 ${nb(`${dq} = ${par(e / 2)}${sup(2)} ${MINUS} ${par(c)} × ${Av} = 0`)}이다.)`,
              facts: { calc: [[`(${jn(e)})*(${jn(e)})/(4*(${jn(c)}))`, 0], [`0-(${jn(e)})/(2*(${jn(c)}))`, 1]], derived: [4, 2] }
            });
          }, { count: 2 }),
          T('line-identity-tangent', 'k의 값에 관계없이 항상 접할 조건', '①19', (d, n) => {
            if (n === 0) {
              // y = x² − 2kx + k² + sk + w 와 y = 2ax + b: D = 4(2a − s)k + 4a² ... → a = s/2, b = w − s²/4
              const t = nz(d, -3, 3), s = 2 * t, w = d.int(-5, 5), a = t, b = w - t * t;
              const g = `${X2} ${MINUS} 2${K}${X} + ${K}${sup(2)} ${more(s, K)}${w ? ' ' + sgn(w) : ''}`;
              return vals(`이차함수 ${nb(`${Y} = ${g}`)}의 그래프와 직선 ${nb(`${Y} = 2${Av}${X} + ${Bv}`)}가 실수 ${K}의 값에 관계없이 항상 접할 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
                explain: `${nb(`${g} = 2${Av}${X} + ${Bv}`)}, 곧 ${eq0(`${X2} ${MINUS} 2(${K} + ${Av})${X} + ${K}${sup(2)} ${more(s, K)}${w ? ' ' + sgn(w) : ''} ${MINUS} ${Bv}`)}의 판별식이 0이어야 한다. `
                  + `${dq} = ${nb(`(${K} + ${Av})${sup(2)} ${MINUS} (${K}${sup(2)} ${more(s, K)}${w ? ' ' + sgn(w) : ''} ${MINUS} ${Bv})`)} = ${nb(`(2${Av} ${sgn(-s)})${K} + ${Av}${sup(2)}${w ? ' ' + sgn(-w) : ''} + ${Bv}`)} = 0이 ${K}의 값에 관계없이 성립하므로 `
                  + `${nb(`2${Av} ${sgn(-s)} = 0`)}, ${nb(`${Av}${sup(2)}${w ? ' ' + sgn(-w) : ''} + ${Bv} = 0`)}이다. 따라서 ${is(Av, a)}, ${is(Bv, b)}이다.`,
                facts: { calc: [[`(${jn(s)})/2`, 0], [`(${jn(w)})-(${jn(s)})*(${jn(s)})/4`, 1]], derived: [2, 4] }
              });
            }
            // y = x² − 2(a + uk)x + u²k² + 2tk + b 가 k 에 관계없이 x축에 접한다: a = t/u, b = a²
            const u = d.pick([1, 1, 2]), a = nz(d, -3, 3), t = a * u, b = a * a;
            const ku = kv(u, K), g = `${X2} ${MINUS} 2(${Av} + ${ku})${X} + ${u === 1 ? '' : u * u}${K}${sup(2)} ${more(2 * t, K)} + ${Bv}`;
            return vals(`이차함수 ${nb(`${Y} = ${g}`)}의 그래프가 실수 ${K}의 값에 관계없이 항상 ${XA}에 접할 때, 상수 ${Av}, ${Bv}의 값은?`, [[Av, a], [Bv, b]], {
              explain: `${eq0(g)}의 판별식이 0이어야 한다. ${dq} = ${nb(`(${Av} + ${ku})${sup(2)} ${MINUS} (${u === 1 ? '' : u * u}${K}${sup(2)} ${more(2 * t, K)} + ${Bv})`)} = ${nb(`2(${u === 1 ? '' : u}${Av} ${sgn(-t)})${K} + ${Av}${sup(2)} ${MINUS} ${Bv}`)} = 0이 `
                + `${K}의 값에 관계없이 성립하므로 ${nb(`${u === 1 ? '' : u}${Av} ${sgn(-t)} = 0`)}, ${nb(`${Av}${sup(2)} ${MINUS} ${Bv} = 0`)}이다. 따라서 ${is(Av, a)}, ${is(Bv, b)}이다.`,
              facts: { calc: [[`(${jn(2 * t)})/(2*${u})`, 0], [`((${jn(2 * t)})/(2*${u}))**2`, 1]], derived: [2, u] }
            });
          }, { count: 2 }),
          T('line-always', 'k의 값에 관계없이 위치 관계가 정해지는가', '①20', (d) => {
            // 판별식 D(k) = Ak² + Bk + C 의 부호가 k 에 관계없이 정해지는가
            let text, A, Bk, Cc, said;
            if (d.bool()) {
              // 정해진 포물선과 y축 위의 한 점을 지나는 직선 y = kx + n
              const b = nz(d, -5, 5), c = d.int(-5, 5), n0 = d.int(-5, 5);
              if (n0 === c) return null;
              const kl = `${K}${X}${n0 ? ' ' + sgn(n0) : ''}`;
              text = `이차함수 ${fy(1, b, c)}의 그래프와 직선 ${nb(`${Y} = ${kl}`)}`;
              A = 1; Bk = -2 * b; Cc = b * b - 4 * (c - n0);
              said = `${nb(`${quadR(1, b, c)} = ${kl}`)}, 곧 ${eq0(`${X2} + (${iq(b)} ${MINUS} ${K})${X} ${sgn(c - n0)}`)}의 판별식은 ${nb(`${Dv} = (${iq(b)} ${MINUS} ${K})${sup(2)} ${MINUS} 4 × ${par(c - n0)}`)}이다.`;
            } else {
              // 포물선 y = x² + kx + k² + c 와 직선 y = mx + n
              const m = d.int(-3, 3), c = nz(d, -5, 5), n0 = d.int(-5, 5);
              text = `이차함수 ${nb(`${Y} = ${X2} + ${K}${X} + ${K}${sup(2)} ${sgn(c)}`)}의 그래프와 직선 ${ly(m, n0)}`;
              A = -3; Bk = -2 * m; Cc = m * m - 4 * (c - n0);
              said = `${nb(`${X2} + ${K}${X} + ${K}${sup(2)} ${sgn(c)} = ${linR(m, n0)}`)}, 곧 ${eq0(`${X2} + ${m ? `(${K} ${sgn(-m)})` : K}${X} + ${K}${sup(2)}${c - n0 ? ' ' + sgn(c - n0) : ''}`)}의 판별식은 ${nb(`${Dv} = ${poly([[-3, K + sup(2)], [-2 * m, K], [Cc, '']])}`)}이다.`;
            }
            if (m0Bad(A, Bk, Cc)) return null;
            const disc = Bk * Bk - 4 * A * Cc, always = disc < 0 ? (A > 0 ? 0 : 2) : 3;
            const OPT = [`${K}의 값에 관계없이 항상 서로 다른 두 점에서 만난다.`, `${K}의 값에 관계없이 항상 한 점에서 만난다.`, `${K}의 값에 관계없이 항상 만나지 않는다.`, `${K}의 값에 따라 위치 관계가 달라진다.`];
            const order = d.shuffle([0, 1, 2, 3]);
            const vertexK = Q(-Bk, 2 * A), top = qsub(Q(Cc), Q(Bk * Bk, 4 * A));
            return C(`${text}의 위치 관계에 대한 설명으로 옳은 것은? (단, ${jw(K, '은/는')} 실수이다.)`, order.map((i) => OPT[i]), order.indexOf(always), {
              explain: `${said} ${nb(`${Dv} = ${coefT(A)}${vertexK.p ? `(${K} ${sgn(qneg(vertexK))})` : K}${sup(2)}${top.p ? ' ' + sgn(top) : ''}`)}이므로 `
                + (always === 0 ? `${Dv}는 ${K}의 값에 관계없이 늘 양수이다. 따라서 항상 서로 다른 두 점에서 만난다.` : always === 2 ? `${Dv}는 ${K}의 값에 관계없이 늘 음수이다. 따라서 항상 만나지 않는다.`
                  : `${K}의 값에 따라 ${Dv}의 부호가 바뀐다. 따라서 위치 관계가 달라진다.`),
              facts: { truth: order.map((i) => i === always), want: true }
            });
          }),
          T('line-xaxis-and-line', 'x축에 접하고 직선과 두 점에서 만날 조건', '①21', (d) => {
            // y = x² + 2mx + n 이 x축에 접하면 n = m², 직선 y = cx + e 와 두 점: −4cm + c² + 4e > 0
            const c = d.pick([2, -2, 4, -4]), e = d.int(-5, 5), top = c * c + 4 * e;
            if (top % (4 * c) !== 0) return null;
            const m0 = top / (4 * c), rel = c > 0 ? '<' : '>';
            if (m0 === 0 || Math.abs(m0) > 8) return null;
            return ineqAns(`이차함수 ${nb(`${Y} = ${X2} + 2${Mv}${X} + ${Nv}`)}의 그래프는 ${XA}과 한 점에서 만나고, 직선 ${jw(ly(c, e), '과/와')} 서로 다른 두 점에서 만난다. 실수 ${Mv}의 값의 범위를 구하시오.`, rel, m0, Mv, {
              explain: `${XA}과 한 점에서 만나므로 ${nb(`${dq} = ${Mv}${sup(2)} ${MINUS} ${Nv} = 0`)}, 곧 ${is(Nv, Mv + sup(2))}이다. ${nb(`${X2} + 2${Mv}${X} + ${Mv}${sup(2)} = ${linR(c, e)}`)}, 곧 `
                + `${eq0(`${X2} + (2${Mv} ${sgn(-c)})${X} + ${Mv}${sup(2)}${e ? ' ' + sgn(-e) : ''}`)}의 판별식이 양수여야 하므로 ${nb(`(2${Mv} ${sgn(-c)})${sup(2)} ${MINUS} 4${e ? `(${Mv}${sup(2)} ${sgn(-e)})` : Mv + sup(2)}`)} = ${poly([[-4 * c, Mv], [top, '']])} ${GT} 0이다. 따라서 ${nb(`${Mv} ${RM[rel]} ${iq(m0)}`)}이다.`,
              facts: { calc: [[`((${jn(c)})*(${jn(c)})+4*(${jn(e)}))/(4*(${jn(c)}))`, 1]], derived: [4] }
            });
          })
        ]
      }
    ]
  });
  // 판별식 D(k) 가 늘 0인 꼴(모든 k 에서 접함)이나 판별식의 판별식이 0인 꼴(한 k 에서만 접함 — 답은 「달라진다」이지만 경계가 아슬아슬하다)은 쓰지 않는다.
  function m0Bad(A, Bk, Cc) { return (A === 0 && Bk === 0) || Bk * Bk - 4 * A * Cc === 0; }
})(typeof window !== 'undefined' ? window : globalThis);
