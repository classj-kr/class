// 중학교 단원이 함께 쓰는 도구: 유리수와 그 셈, 수를 적는 글(음수·분수·토씨), 문자, 식(조각의 배열)과 한 단계씩 계산하기,
// 식을 휴대폰 너비에 맞추어 그리기, 음수 쪽까지 있는 수직선, 수 고르기, 값 하나를 답하는 문항, 풀이 글, 참·거짓을 가리는 문장.
// 처음에 7-1-2(정수와 유리수) 단원 파일 안에 지었던 것을 옮겨 왔다. 단원 파일은 `const { Q, tx, V, ex, … } = B.kit.mid;` 로 꺼내 쓴다.
// engine.js·geometry.js 다음, 단원 파일들 앞에 읽힌다(index.html 과 tools/question-bank·tests 의 불러오는 줄).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, numbers, N, M, C, F, D, inline } = B.kit;
  const LAB = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const MINUS = '−', GT = '&gt;', LT = '&lt;', GE = '≥', LE = '≤';
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);

  // ── 유리수 ──
  // { p, q }: 분자(부호를 가진 정수)와 분모(양수), 언제나 기약분수. d 가 있으면 소수(d 자리)로 적는다.
  const gcd = (x, y) => (y ? gcd(y, x % y) : Math.abs(x)), lcm = (x, y) => x / gcd(x, y) * y;
  const Q = (p, q) => { let a = p, b = q == null ? 1 : q; if (b < 0) { a = -a; b = -b; } const g = gcd(a, b) || 1; return { p: a / g, q: b / g }; };
  const dc = (tenths) => Object.assign(Q(tenths, 10), { d: 1 }), dc2 = (hundredths) => Object.assign(Q(hundredths, 100), { d: 2 });
  const plainQ = (x) => Q(x.p, x.q);
  const qadd = (x, y) => Q(x.p * y.q + y.p * x.q, x.q * y.q), qsub = (x, y) => Q(x.p * y.q - y.p * x.q, x.q * y.q);
  const qmul = (x, y) => Q(x.p * y.p, x.q * y.q), qdiv = (x, y) => Q(x.p * y.q, x.q * y.p);
  const keepD = (v, x) => (x.d ? Object.assign(v, { d: x.d }) : v);
  const qneg = (x) => keepD(Q(-x.p, x.q), x), qabs = (x) => keepD(Q(Math.abs(x.p), x.q), x);
  const qpow = (x, n) => Q(x.p ** n, x.q ** n), qcmp = (x, y) => x.p * y.q - y.p * x.q;
  const isInt = (x) => x.q === 1, fl = (x) => x.p / x.q;
  const asDec = (x) => (x.q !== 1 && 10 % x.q === 0 ? Object.assign(Q(x.p, x.q), { d: 1 }) : x);

  // ── 수를 적는 글 ──
  // 음수의 빼기표는 −(U+2212). mag 크기만, tx −3·3, sx −3·+3, px (−3)·(+3)
  const digits = (x) => (x.d ? (Math.abs(x.p) / x.q).toFixed(x.d) : null);
  const mag = (x) => digits(x) || (x.q === 1 ? String(Math.abs(x.p)) : frac(Math.abs(x.p), x.q));
  // 줄이 바뀌어도 떨어지면 안 되는 글(부호와 분수, 분수와 토씨, 문자가 든 짧은 식)을 한 덩이로 묶는다.
  const nb = (h) => '<span style="white-space:nowrap">' + h + '</span>';
  const isFrac = (x) => !x.d && x.q !== 1, glue = (x, h) => (isFrac(x) ? nb(h) : h);
  const tx = (x) => (x.p < 0 ? glue(x, MINUS + mag(x)) : mag(x));
  const sx = (x) => (x.p === 0 ? mag(x) : glue(x, (x.p < 0 ? MINUS : '+') + mag(x)));
  const px = (x) => (x.p === 0 ? '0' : glue(x, '(' + (x.p < 0 ? MINUS : '+') + mag(x) + ')'));
  // 그림 설명(aria-label)과 그림 속 글에 적는 글: 분수는 3/4 으로 적는다.
  const plain = (x, plus) => (x.p < 0 ? MINUS : plus && x.p > 0 ? '+' : '') + (digits(x) || (x.q === 1 ? Math.abs(x.p) : Math.abs(x.p) + '/' + x.q));
  // 토씨는 읽을 때 마지막에 오는 숫자에 맞춘다: 정수는 그 수, 분수는 분자(사분의 삼), 소수는 끝자리.
  const tail = (n, pair) => josa(n, pair).slice(String(n).length);
  const lastOf = (x) => (x.d ? Number(digits(x).slice(-1)) : Math.abs(x.p));
  const tj = (x, pair) => glue(x, (x.p < 0 ? MINUS : '') + mag(x) + tail(lastOf(x), pair));
  const sj = (x, pair) => glue(x, (x.p < 0 ? MINUS : x.p > 0 ? '+' : '') + mag(x) + tail(lastOf(x), pair));
  const pj = (x, pair) => glue(x, (x.p === 0 ? '0' : '(' + (x.p < 0 ? MINUS : '+') + mag(x) + ')') + tail(lastOf(x), pair));
  // 검사가 다시 셈하는 식에 적는 글: 음수는 (-3), 분수는 (3/4)
  const js = (x) => { const m = digits(x) || (x.q === 1 ? String(Math.abs(x.p)) : Math.abs(x.p) + '/' + x.q); return x.p < 0 ? '(-' + m + ')' : x.q === 1 || x.d ? m : '(' + m + ')'; };
  // 문자
  const V = (name) => '<i class="mb-var">' + name + '</i>';
  const sup = (n) => '<sup>' + n + '</sup>';

  // ── 식 ──
  // 식은 조각의 배열이다. 조각은 연산 기호('+', '-', '*', '/')이거나 항이다.
  //  P(x) 부호와 괄호를 붙인 수 (+3)·(−3) / U(x) 그대로 적은 수 3·−3(맨 앞이 아닌 음수는 괄호에 넣는다)
  //  G(식, '(' | '{' | '[') 묶음 / W(x, n) 거듭제곱 (−2)³·3² / WN(x, n) −3²(3²에 −를 붙인 수) / MN(항) 앞에 −를 붙인 항 −(−3)²·−|−4| / A(식) 절댓값
  const P = (x) => ({ k: 'p', x }), U = (x) => ({ k: 'u', x });
  const G = (list, br) => ({ k: 'g', list, br: br || '(' });
  const W = (x, n) => ({ k: 'w', x, n }), WN = (x, n) => ({ k: 'wn', x, n });
  const MN = (term) => ({ k: 'm', term }), A = (list) => ({ k: 'a', list });
  const isNum = (t) => t.k === 'p' || t.k === 'u';
  const valT = (t) => (isNum(t) ? t.x : t.k === 'g' ? val(t.list) : t.k === 'w' ? qpow(t.x, t.n) : t.k === 'wn' ? qneg(qpow(t.x, t.n)) : t.k === 'm' ? qneg(valT(t.term)) : qabs(val(t.list)));
  // 곱셈·나눗셈을 앞에서부터, 그다음 덧셈·뺄셈을 앞에서부터
  function val(list) {
    const terms = [valT(list[0])], ops = [];
    for (let i = 1; i < list.length; i += 2) {
      const v = valT(list[i + 1]), last = terms.length - 1;
      if (list[i] === '*') terms[last] = qmul(terms[last], v); else if (list[i] === '/') terms[last] = qdiv(terms[last], v); else { ops.push(list[i]); terms.push(v); }
    }
    return terms.reduce((s, v, i) => (i === 0 ? v : ops[i - 1] === '+' ? qadd(s, v) : qsub(s, v)));
  }
  const OPS = { '+': '+', '-': MINUS, '*': '×', '/': '÷' }, BR = { '(': ['(', ')'], '{': ['{', '}'], '[': ['[', ']'] };
  function htmlT(t, first, bare) {
    if (t.k === 'p') return px(t.x);
    if (t.k === 'u') return t.x.p < 0 && !first ? '(' + tx(t.x) + ')' : tx(t.x);
    if (t.k === 'g') return BR[t.br][0] + html(t.list, bare) + BR[t.br][1];
    if (t.k === 'w') return (t.x.p < 0 || t.x.q !== 1 ? '(' + tx(t.x) + ')' : tx(t.x)) + sup(t.n);
    if (t.k === 'wn') return (first ? '' : '(') + MINUS + mag(t.x) + sup(t.n) + (first ? '' : ')');
    if (t.k === 'm') return (first ? '' : '(') + MINUS + htmlT(t.term, false, bare) + (first ? '' : ')');
    return '|' + html(t.list, bare) + '|';
  }
  // bare: 연산 기호를 글자 그대로 적는다(풀이 글). 아니면 식 글꼴(mb-expr)에 맞춘 <i> 로 감싼다.
  function html(list, bare) { return list.map((t, i) => (typeof t === 'string' ? (bare ? OPS[t] : '<i>' + OPS[t] + '</i>') : htmlT(t, i === 0, bare))).join(' '); }
  const inl = (list) => html(list, true);
  function jsT(t) {
    if (isNum(t)) return js(t.x);
    if (t.k === 'g') return '(' + jsx(t.list) + ')';
    if (t.k === 'w') return '(' + js(t.x) + '**' + t.n + ')';
    if (t.k === 'wn') return '(-(' + js(t.x) + '**' + t.n + '))';
    if (t.k === 'm') return '(-' + jsT(t.term) + ')';
    return val(t.list).p < 0 ? '(0-(' + jsx(t.list) + '))' : '(' + jsx(t.list) + ')';
  }
  function jsx(list) { return list.map((t) => (typeof t === 'string' ? t : jsT(t))).join(''); }

  // 한 번에 한 단계씩 계산한다(다 계산했으면 null): 거듭제곱 → 묶음 안 → 곱셈·나눗셈(앞에서부터) → 덧셈·뺄셈(앞에서부터).
  // 계산해 나온 수를 괄호 꼴 (+3)·(−3)으로 적을 식인가: 일부러 괄호 꼴로 적은 수 P 가 있는 식(음수라서 괄호에 넣은 수 auto 는 세지 않는다).
  const hasP = (list) => list.some((t) => typeof t !== 'string' && ((t.k === 'p' && !t.auto) || ((t.k === 'g' || t.k === 'a') && hasP(t.list)) || (t.k === 'm' && hasP([t.term]))));
  // 음수는 괄호에 넣어 적고 양수는 그대로 적는 수(식의 맨 앞에서도 (−24) × … 로 적는다)
  const S = (x) => (x.p < 0 ? { k: 'p', x, auto: true } : U(x));
  const isPow = (t) => t.k === 'w' || t.k === 'wn' || (t.k === 'm' && t.term.k === 'w');
  function step(list, par) {
    const mk = (x) => (par ? P(x) : U(x)), out = list.slice();
    if (out.some((t) => typeof t !== 'string' && isPow(t))) return out.map((t) => (typeof t !== 'string' && isPow(t) ? mk(valT(t)) : t));
    for (let i = 0; i < out.length; i += 1) {
      const t = out[i];
      if (typeof t === 'string' || isNum(t)) continue;
      if (t.k === 'm') { out[i] = isNum(t.term) ? mk(qneg(t.term.x)) : MN(step([t.term], par)[0]); return out; }
      if (t.list.length === 1 && isNum(t.list[0])) { out[i] = mk(t.k === 'a' ? qabs(t.list[0].x) : t.list[0].x); return out; }
      const inner = step(t.list, par);
      out[i] = t.k === 'g' && inner.length === 1 && isNum(inner[0]) ? mk(inner[0].x) : Object.assign({}, t, { list: inner });
      return out;
    }
    if (out.length === 1) return null;
    let at = out.findIndex((t) => t === '*' || t === '/'); if (at < 0) at = 1;
    const a = out[at - 1].x, b = out[at + 1].x;
    let v = out[at] === '*' ? qmul(a, b) : out[at] === '/' ? qdiv(a, b) : out[at] === '+' ? qadd(a, b) : qsub(a, b);
    if ((out[at] === '+' || out[at] === '-') && a.d && b.d && v.q !== 1) v = Object.assign(v, { d: Math.max(a.d, b.d) });
    out.splice(at - 1, 3, mk(v));
    return out;
  }
  // 계산해 가는 줄들(식의 배열). 마지막은 수 하나이다.
  function trace(list) { const par = hasP(list), out = [list]; for (let i = 0; i < 60; i += 1) { const next = step(out[out.length - 1], par); if (!next) break; out.push(next); } return out; }
  const chainOf = (list) => trace(list).map((row) => (row.length === 1 && isNum(row[0]) ? tx(row[0].x) : inl(row))).filter((s, i, all) => i === 0 || s !== all[i - 1]).join(' = ');
  // 계산하는 동안 나오는 수가 모두 정수인가(정수 계산 문항에서 중간에 분수가 나오지 않게)
  const flatNums = (list) => list.reduce((all, t) => (typeof t === 'string' ? all : isNum(t) ? all.concat([t.x]) : t.k === 'm' ? all.concat(flatNums([t.term])) : t.list ? all.concat(flatNums(t.list)) : all), []);
  const intsOnly = (list) => trace(list).every((row) => flatNums(row).every(isInt));
  const biggest = (list) => Math.max(...trace(list).map((row) => Math.max(...flatNums(row).map((x) => Math.max(Math.abs(x.p), x.q)))));

  // ── 식을 그리는 글 ──
  // 식의 너비를 어림해(em) 휴대폰 화면의 문항 칸에 들어가도록 글씨 크기를 줄인다. 그래도 넘치면 줄을 바꾸게 둔다.
  function emOf(h) {
    const s = String(h).replace(/<span class="mb-frac"><span>([^<]*)<\/span><span class="mb-frac-bar">\/<\/span><span>([^<]*)<\/span><\/span>/g, (m, n, den) => 'F'.repeat(Math.max(n.length, den.length)) + 'f')
      .replace(/<span class="mb-box">[^<]*<\/span>/g, 'B').replace(/<sup>(.*?)<\/sup>/g, (m, inner) => 's'.repeat(inner.replace(/<[^>]+>/g, '').length)).replace(/<i>[^<]*<\/i>/g, 'o').replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, 'o');
    let em = 0;
    for (const ch of s) em += ch === 'o' ? 0.86 : ch === 'f' ? 0.62 : ch === 'F' ? 0.6 : ch === 'B' ? 1.4 : ch === 's' ? 0.48 : ch === ' ' ? 0.28 : /[(){}[\]|]/.test(ch) ? 0.38 : /[가-힣㉠-㉯]/.test(ch) ? 1.02 : 0.6;
    return em;
  }
  const FIT = 17.2;
  const fit = (em) => { const size = Math.min(1.35, FIT / em); return size >= 1.35 ? '' : ' style="font-size:' + Math.max(size, 0.9).toFixed(2) + 'rem' + (size < 0.9 ? ';white-space:normal' : '') + '"'; };
  const ex = (h, extra) => '<span class="mb-expr"' + fit(emOf(h) + (extra || 0)) + '>' + h + '</span>';
  const show = (list) => ex(html(list));
  const tag = (label) => '<span class="mb-tag mb-tag-short">' + label + '</span>';
  const tagged = (list, tags) => lines(list.map((h, i) => tag((tags || LAB)[i]) + h));
  // 이름표를 붙인 식 여러 줄(글씨 크기는 가장 긴 줄에 맞춘다)
  const taggedEx = (list, tags) => { const style = fit(Math.max(...list.map(emOf)) + 2.6); return lines(list.map((h, i) => tag((tags || LAB)[i]) + '<span class="mb-expr"' + style + '>' + h + '</span>')); };
  // 계산 과정: 줄마다 { h 식, mark 줄 끝의 이름표 }. 둘째 줄부터 앞에 = 를 붙인다.
  function proc(rows) {
    const style = fit(Math.max(...rows.map((r, i) => emOf(r.h) + (i ? 1.3 : 0) + (r.mark ? 2.2 : 0))));
    return lines(rows.map((r, i) => '<span class="mb-expr"' + (style || ' style="font-size:1.2rem"') + '>' + (i ? '<i>=</i> ' : '') + r.h + (r.mark ? '<span style="margin-left:0.6em;font-weight:700;color:#1d4ed8">' + r.mark + '</span>' : '') + '</span>'));
  }
  // 차례로 계산하는 칸. 조각은 칸에 적는 글이거나 { step: 화살표 위에 적는 글 }이다.
  const flow = (parts) => '<div class="mb-chain">' + parts.map((part) => (part.step ? '<span class="mb-step">' + part.step + '</span>' : '<span class="mb-node">' + part + '</span>')).join('') + '</div>';

  // ── 그림 ──
  const f1 = (v) => Number(v.toFixed(1));
  // 수직선(음수 쪽까지). lo~hi: 정수 눈금의 두 끝. o.parts 1을 똑같이 나눈 칸 수, o.labels 수를 적을 정수(주지 않으면 모두),
  //  o.points [{ at 유리수, name }], o.moves 화살표 [{ from, to, label }](유리수, 아래 것부터 위로 쌓는다)
  //  o.rays 부등식의 해 [{ at 수, dir: 1(오른쪽) | -1(왼쪽), closed: 경계를 포함하는가 }] — 경계에 ○(●)를 찍고 그쪽으로 굵은 선을 화살표로 뻗는다.
  // 그림 설명에는 점마다 0에서 어느 쪽으로 몇 칸 간 곳인지 적는다(검사와 화면 읽기가 그 글로 수를 읽는다).
  function nline(lo, hi, o) {
    const opt = o || {}, parts = opt.parts || 1, span = hi - lo, u = Math.min(30, 288 / span), left = 20, x = (v) => left + (v - lo) * u;
    const moves = opt.moves || [], points = opt.points || [], rays = opt.rays || [], labelled = moves.some((m) => m.label), gap = labelled ? 25 : 16;
    const y = moves.length ? 10 + moves.length * gap + (labelled ? 4 : 0) : points.length ? 26 : rays.length ? 22 : 10, width = left * 2 + span * u, height = y + 27;
    const labels = opt.labels || range(lo, hi), text = (v) => (v < 0 ? MINUS + -v : String(v));
    let out = `<line class="mb-axis" x1="${f1(x(lo) - 11)}" y1="${y}" x2="${f1(x(hi) + 11)}" y2="${y}"/>`
      + `<path d="M${f1(x(lo) - 17)} ${y}l7 -3.6v7.2z" style="fill:#1f2933"/><path d="M${f1(x(hi) + 17)} ${y}l-7 -3.6v7.2z" style="fill:#1f2933"/>`;
    for (let i = 0; i <= span * parts; i += 1) { const big = i % parts === 0, at = f1(x(lo) + i * u / parts); out += `<line class="mb-axis" x1="${at}" y1="${y - (big ? 5.5 : 3)}" x2="${at}" y2="${y + (big ? 5.5 : 3)}"/>`; }
    for (const v of labels) out += `<text class="mb-axis-label" style="font-size:12.5px" x="${f1(x(v))}" y="${y + 20}" text-anchor="middle">${text(v)}</text>`;
    moves.forEach((m, k) => {
      const a = x(fl(m.from)), b = x(fl(m.to)), yy = y - 13 - k * gap, dir = b > a ? 1 : -1;
      out += `<line x1="${f1(a)}" y1="${yy}" x2="${f1(a)}" y2="${y}" style="stroke:#8a96a3;stroke-width:0.8;stroke-dasharray:2 2"/><line x1="${f1(b)}" y1="${yy}" x2="${f1(b)}" y2="${y}" style="stroke:#8a96a3;stroke-width:0.8;stroke-dasharray:2 2"/>`
        + `<line x1="${f1(a)}" y1="${yy}" x2="${f1(b - dir * 6)}" y2="${yy}" style="stroke:#1d4ed8;stroke-width:1.8"/><path d="M${f1(b)} ${yy}l${-dir * 8} -3.8v7.6z" style="fill:#1d4ed8"/>`
        + (m.label ? `<text x="${f1((a + b) / 2)}" y="${yy - 5}" text-anchor="middle" style="font-size:12px;font-weight:700;fill:#1d4ed8">${m.label}</text>` : '');
    });
    for (const p of points) out += `<circle class="mb-dot" cx="${f1(x(fl(p.at)))}" cy="${y}" r="3.3"/><text class="mb-km-label" style="font-size:13.5px" x="${f1(x(fl(p.at)))}" y="${y - 10}" text-anchor="middle">${p.name}</text>`;
    for (const r of rays) {
      const a = f1(x(fl(asQ(r.at)))), end = r.dir > 0 ? x(hi) + 9 : x(lo) - 9, yy = y - 12;
      out += `<path d="M${a} ${y - 3.6}V${yy}H${f1(end - r.dir * 6)}" style="fill:none;stroke:#1d4ed8;stroke-width:1.9;stroke-linejoin:round"/><path d="M${f1(end)} ${yy}l${-r.dir * 8} -3.8v7.6z" style="fill:#1d4ed8"/>`
        + `<circle cx="${a}" cy="${y}" r="3.7" style="fill:${r.closed ? '#1d4ed8' : '#fff'};stroke:#1d4ed8;stroke-width:1.6"/>`;
    }
    const steps = (v) => Math.abs(v.p) * parts / v.q + '칸', side = (v) => (v.p > 0 ? '오른쪽' : '왼쪽');
    const where = (v) => (v.p === 0 ? '0이 적힌 눈금' : `0에서 ${side(v)}으로 ${parts > 1 ? '작은 눈금 ' : ''}${steps(v)} 간 곳`);
    const said = `수직선: ${text(lo)}부터 ${text(hi)}까지 정수마다 눈금이 있다` + (parts > 1 ? `. 1을 똑같이 ${parts}칸으로 나눈 작은 눈금이 있다` : '') + '. '
      + (labels.length === span + 1 ? '정수 눈금마다 수를 적었다' : `수를 적은 눈금은 ${labels.map(text).join(', ')}`) + '.'
      + points.map((p) => ` 점 ${p.name}: ${where(p.at)}.`).join('')
      + rays.map((r) => ` ${where(asQ(r.at))}에 ${r.closed ? '색칠한 점(●)' : '속이 빈 점(○)'}이 있고, 거기서 ${r.dir > 0 ? '오른쪽' : '왼쪽'}으로 굵은 선이 화살표로 뻗어 있다.`).join('')
      + moves.map((m, k) => { const len = qsub(m.to, m.from); return ` 화살표 ${k + 1}: ${k && qcmp(m.from, moves[k - 1].to) === 0 ? `화살표 ${k}의 끝` : plain(m.from)}에서 ${side(len)}으로 ${m.label ? plain(qabs(len)) + '만큼' : steps(len)}.`; }).join('');
    return `<svg class="mb-numberline" viewBox="0 0 ${f1(width)} ${height}" width="${Math.round(width)}" role="img" aria-label="${said}">${out}</svg>`;
  }

  // ── 수 고르기 ──
  const nz = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v !== 0);
  const pm = (d) => (d.bool() ? 1 : -1);
  const co = (d, q, lo, hi) => d.until(() => d.int(lo, hi), (n) => gcd(n, q) === 1);
  // 정수가 아닌 양의 기약분수: 분모는 dens 에서, 크기는 max 까지
  const fr = (d, dens, max) => { const q = d.pick(dens); return Q(co(d, q, 1, Math.max(q - 1, Math.floor((max || 2) * q))), q); };
  const distinct = (list) => new Set(list.map((x) => x.p + '/' + x.q)).size === list.length;

  // ── 문항 도구 ──
  const okKind = (v, kind) => (kind === 'int' ? v.q === 1 && Math.abs(v.p) <= 9999 : kind === 'frac' ? v.q > 1 && v.q <= 60 && Math.abs(v.p) <= 240 : v.q !== 1 && 10 % v.q === 0 && Math.abs(fl(v)) < 100);
  // 값 하나를 답하는 문항. kind: 'int' 정수 / 'frac' 분수(기약분수·가분수, 크기가 같은 분수를 모두 받는다) / 'dec' 소수 한 자리. 어느 칸에나 부호 단추가 붙는다.
  function ansV(text, v, kind, o) {
    if (!okKind(v, kind)) throw new Error('답의 꼴이 유형과 다르다');
    const more = { figure: o.figure, unit: o.unit, explain: o.explain, facts: o.facts };
    if (kind === 'int') return N(text, v.p, Object.assign({ signed: true }, more));
    if (kind === 'dec') return D(text, fl(v), Object.assign({ signed: true }, more));
    return F(text, Math.abs(v.p), v.q, Object.assign({ improper: Math.abs(v.p) > v.q, anyForm: true, signed: true, negative: v.p < 0 }, more));
  }
  const valueFacts = (list, more) => { const value = jsx(list); return Object.assign({ value }, /\(0-/.test(value) ? { unseen: [0] } : {}, more || {}); };
  const CALC = '다음을 계산하시오.';
  // 식 하나를 계산하는 문항. 같은 꼴의 식이 여럿이므로 계산 구조의 이름(rule)을 단다.
  const calcQ = (list, kind, o) => ansV(o.text || CALC, val(list), kind, { figure: show(list), explain: o.explain || chainOf(list) + '이다.', facts: valueFacts(list, { rule: o.rule }) });
  // 조건에 맞는 식이 나올 때까지 다시 만든다.
  const pickEx = (d, make, kind, ok) => d.until(make, (list) => okKind(val(list), kind) && (!ok || ok(list)));

  // ── 풀이 글 ──
  const SAME_ADD = '부호가 같은 두 수의 합은 두 수의 절댓값의 합에 공통인 부호를 붙인다. ', DIFF_ADD = '부호가 다른 두 수의 합은 두 수의 절댓값의 차에 절댓값이 큰 수의 부호를 붙인다. ';
  const TO_ADD = '뺄셈은 빼는 수의 부호를 바꾸어 더한다. ';
  const SAME_MUL = '부호가 같은 두 수의 곱은 두 수의 절댓값의 곱에 +를 붙인다. ', DIFF_MUL = '부호가 다른 두 수의 곱은 두 수의 절댓값의 곱에 −를 붙인다. ';
  const SAME_DIV = '부호가 같은 두 수의 나눗셈은 절댓값의 나눗셈의 몫에 +를 붙인다. ', DIFF_DIV = '부호가 다른 두 수의 나눗셈은 절댓값의 나눗셈의 몫에 −를 붙인다. ';
  const BY_RECIP = '나눗셈은 나누는 수의 역수를 곱하여 계산한다. ';
  const rawMag = (n, L) => (L === 1 ? String(Math.abs(n)) : frac(Math.abs(n), L));
  const uniq = (list) => list.filter((s, i) => i === 0 || s !== list[i - 1]);
  // 두 수의 덧셈 x + y 를 규칙대로 풀어 적는다. 소수끼리는 소수로, 소수와 분수가 섞이면 분수로 고쳐 계산한다.
  function addTold(x0, y0, head) {
    const dec = Boolean(x0.d && y0.d), x = dec ? x0 : plainQ(x0), y = dec ? y0 : plainQ(y0), out = [head || `${px(x0)} + ${px(y0)}`];
    let v = qadd(x, y); if (dec) v = asDec(v);
    if (!dec && (x0.d || y0.d)) out.push(`${px(x)} + ${px(y)}`);
    if (x.p === 0 || y.p === 0) return uniq(out.concat([tx(v)])).join(' = ');
    const L = dec ? 1 : lcm(x.q, y.q), xn = x.p * L / x.q, yn = y.p * L / y.q, mx = dec ? mag(x) : rawMag(xn, L), my = dec ? mag(y) : rawMag(yn, L);
    if (!dec && (x.q !== L || y.q !== L)) out.push(`(${x.p < 0 ? MINUS : '+'}${mx}) + (${y.p < 0 ? MINUS : '+'}${my})`);
    if (x.p * y.p > 0) out.push(`${x.p < 0 ? MINUS : '+'}(${mx} + ${my})`);
    else if (v.p !== 0) { const big = qcmp(qabs(x), qabs(y)) > 0; out.push(`${(big ? x : y).p < 0 ? MINUS : '+'}(${big ? mx : my} − ${big ? my : mx})`); }
    return uniq(out.concat([tx(v)])).join(' = ');
  }
  const subTold = (x, y) => addTold(x, qneg(y), `${px(x)} − ${px(y)} = ${px(x)} + ${px(qneg(y))}`);
  // 두 수의 곱셈. keep 이면 소수를 분수로 고치지 않고 계산한다(답이 소수인 문항).
  function mulTold(x0, y0, keep) {
    const x = keep ? x0 : plainQ(x0), y = keep ? y0 : plainQ(y0), v = qmul(x, y), out = [`${px(x0)} × ${px(y0)}`];
    if (!keep && (x0.d || y0.d)) out.push(`${px(x)} × ${px(y)}`);
    if (v.p !== 0) out.push(`${v.p < 0 ? MINUS : '+'}(${mag(x)} × ${mag(y)})`);
    return uniq(out.concat([tx(keep ? asDec(v) : v)])).join(' = ');
  }
  // 두 수의 나눗셈. 정수끼리 나누어떨어지거나 keep 이면 절댓값끼리 나누고, 아니면 역수를 곱한다.
  function divTold(x0, y0, keep) {
    const x = keep ? x0 : plainQ(x0), y = keep ? y0 : plainQ(y0), v = qdiv(x, y), out = [`${px(x0)} ÷ ${px(y0)}`], s = v.p < 0 ? MINUS : '+';
    if (v.p === 0) return out.concat(['0']).join(' = ');
    if (keep || (isInt(x) && isInt(y) && isInt(v))) return out.concat([`${s}(${mag(x)} ÷ ${mag(y)})`, tx(keep ? asDec(v) : v)]).join(' = ');
    if (x0.d || y0.d) out.push(`${px(x)} ÷ ${px(y)}`);
    const r = qdiv(Q(1), y);
    return uniq(out.concat([`${px(x)} × ${px(r)}`, `${s}(${mag(x)} × ${mag(r)})`, tx(v)])).join(' = ');
  }
  // 덧셈·뺄셈만 있는 식을 통분하여 한 번에 계산한 과정
  function commonTold(list) {
    const L = list.reduce((m, t) => (typeof t === 'string' ? m : lcm(m, t.x.q)), 1), parts = []; let total = 0;
    list.forEach((t, i) => { if (typeof t === 'string') return; const n = (list[i - 1] === '-' ? -1 : 1) * t.x.p * L / t.x.q; total += n; parts.push((parts.length ? (n < 0 ? ' − ' : ' + ') : (n < 0 ? MINUS : '')) + rawMag(n, L)); });
    return [inl(list), parts.join('')].concat(gcd(total, L) === 1 || L === 1 ? [] : [(total < 0 ? MINUS : '') + rawMag(total, L)], [tx(Q(total, L))]).join(' = ');
  }

  const un = (unit) => (/^[A-Za-z°C]/.test(unit) ? ' ' + unit : unit);
  const sv = (n) => (n < 0 ? MINUS : '+') + Math.abs(n);

  // ── 참·거짓을 가리는 문장 ──
  // 틀린 문장은 [글, 바로잡은 말, 함께 싣지 않을 옳은 문장]이다(뜻이 맞서는 두 문장이 한 문항에 나오면 답이 드러난다).
  function claimQ(d, text, yes, no, wantTrue) {
    const bad = d.shuffle(no).slice(0, wantTrue ? 3 : 1), clash = bad.map((s) => s[2]).filter(Boolean);
    const good = d.shuffle(yes.filter((s) => !clash.includes(s))).slice(0, wantTrue ? 1 : 3);
    const rows = d.shuffle(good.map((s) => [s, true, '']).concat(bad.map((s) => [s[0], false, s[1]]))), at = rows.findIndex((r) => r[1] === wantTrue);
    return C(text, rows.map((r) => r[0]), at, { explain: wantTrue ? rows.filter((r) => !r[1]).map((r) => r[2]).join(' ') : rows[at][2], facts: { truth: rows.map((r) => r[1]), want: wantTrue } });
  }

  // ── 문자식 ──
  // 수나 유리수를 유리수로 맞춘다.
  const asQ = (x) => (typeof x === 'number' ? Q(x) : x);
  // 항의 크기 부분: 계수의 절댓값과 문자 글. 계수 1은 적지 않는다(1x 가 아니라 x). v 는 이미 그린 글이다: V('x'), V('x') + sup(2), V('a') + V('b'), 상수항은 ''.
  const mono = (c, v) => { const q = asQ(c); return !v ? mag(q) : Math.abs(q.p) === 1 && q.q === 1 ? v : mag(q) + v; };
  // 다항식: 항 [계수, 문자 글]의 배열. 계수가 0인 항은 적지 않는다. 맨 앞 항의 +는 적지 않고, 뒤 항은 「 + 」「 − 」로 잇는다. 모두 0이면 0.
  function poly(terms) {
    const live = terms.map(([c, v]) => [asQ(c), v]).filter(([c]) => c.p !== 0);
    if (live.length === 0) return '0';
    return nb(live.map(([c, v], i) => (i === 0 ? (c.p < 0 ? MINUS : '') : c.p < 0 ? ' ' + MINUS + ' ' : ' + ') + mono(c, v)).join(''));
  }
  // 일차식 ax + b (v 는 문자 글, 주지 않으면 x)
  const lin = (a, b, v) => poly([[a, v || V('x')], [b, '']]);
  // 답이 일차식 ax + b 인 문항: 계수 칸(뒤에 문자)과 상수항 칸. 두 칸 모두 부호 단추가 붙는다. a, b 는 0이 아닌 정수여야 한다(계수가 분수이거나 항이 하나인 답은 고르기나 다른 꼴로).
  // 틀렸을 때 보이는 답은 식 그대로(3x − 2)이다. facts 에는 calc: [[계수를 셈하는 식, 0], [상수항을 셈하는 식, 1]] 을 적는다.
  function linAns(text, a, b, v, o) {
    if (!Number.isInteger(a) || !Number.isInteger(b) || a === 0 || b === 0) throw new Error('일차식 답의 계수와 상수항은 0이 아닌 정수여야 한다');
    const name = v || V('x');
    return M(text, [{ answer: a, signed: true, unit: name }, { answer: b, signed: true }], Object.assign({}, o, { shown: lin(a, b, name) }));
  }

  // 답이 점의 좌표인 문항: 「( [±][ ] , [±][ ] )」 두 칸으로 받고, 틀리면 (−3, 2) 꼴로 보인다. x, y 는 정수.
  function pointAns(text, x, y, o) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) throw new Error('좌표 답은 정수여야 한다');
    return M(text, [{ answer: x, signed: true, lead: '(' }, { answer: y, signed: true, lead: ',', unit: ')' }], Object.assign({}, o, { shown: `(${signedText(x)}, ${signedText(y)})` }));
  }

  // ── 좌표평면 ──
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const num = (v) => (typeof v === 'number' ? v : fl(v));
  const signedText = (v) => (v < 0 ? MINUS + Math.abs(v) : String(v));
  // 원점에서 어느 쪽으로 몇 칸 간 곳인지(그림 설명). 좌표를 숫자 짝으로 적지 않는다 — 좌표를 읽어 내는 것이 문제일 수 있다.
  function whereOnPlane(x, y) {
    const part = (v, plus, minus) => (v === 0 ? '' : `${v > 0 ? plus : minus}으로 ${Number(Math.abs(v).toFixed(2))}칸`);
    const parts = [part(x, '오른쪽', '왼쪽'), part(y, '위쪽', '아래쪽')].filter(Boolean);
    return parts.length ? `원점에서 ${parts.join(', ')} 간 곳` : '원점';
  }
  // plane(o): 좌표평면.
  //  o.x, o.y [작은 끝, 큰 끝](정수, 주지 않으면 −5~5). 한 칸은 1이다.
  //  o.points [{ x, y, name, side, guide }] 점(수나 유리수). side: 이름 자리 'ur'(기본)·'ul'·'dr'·'dl'. guide: 두 축으로 점선을 내린다.
  //  o.poly [[x, y], …] 꼭짓점을 차례로 이은 도형(옅게 칠한다). o.segs [[x1, y1, x2, y2], …] 선분.
  //  o.lines [{ a, name }] 정비례 관계 y = ax 의 그래프(a 는 수나 유리수). o.curves [{ a, name }] 반비례 관계 y = a/x 의 그래프.
  //  o.parabolas [{ a, p, q, name, dash }] 이차함수 y = a(x − p)² + q 의 그래프(포물선, p·q 는 주지 않으면 0). 상자 안에 드는 부분만 그린다.
  //  o.ticks: 'all'(기본, 정수 눈금마다 수) · 'none'(O, x, y 만) · 수의 배열(두 축에 적을 수). o.grid: false 이면 모눈을 긋지 않는다. o.say: 그림 설명에 덧붙일 말.
  // 그림 설명: 점은 원점에서 간 칸 수로, 직선은 「오른쪽으로 1칸 갈 때 위로 몇 칸」으로, 곡선은 지나는 모눈 점으로 적는다(검사와 화면 읽기가 이 글로 그림을 읽는다).
  function plane(o) {
    const opt = o || {}, [xlo, xhi] = opt.x || [-5, 5], [ylo, yhi] = opt.y || [-5, 5];
    const u = Math.min(24, 260 / (xhi - xlo)), padL = 16, padR = 26, padT = 24, padB = 16, W = padL + padR + (xhi - xlo) * u, H = padT + padB + (yhi - ylo) * u;
    const X = (v) => f1(padL + (v - xlo) * u), Y = (v) => f1(padT + (yhi - v) * u);
    // 원점의 이름 O 는 왼쪽 아래에 적는다. 오른쪽 위로 올라가는 직선이 그 자리를 지나면 오른쪽 아래에 적는다.
    const first = (opt.lines || [])[0], oSide = opt.oSide ? (opt.oSide === 'r' ? 1 : -1) : first && first.x == null && num(first.a) > 0 ? 1 : -1;
    const ticks = opt.ticks || 'all', shown = (v) => v !== 0 && (ticks === 'all' || (Array.isArray(ticks) && ticks.includes(v)));
    let out = '';
    if (opt.grid !== false) {
      for (let v = xlo; v <= xhi; v += 1) out += `<line class="mb-gridline" x1="${X(v)}" y1="${Y(ylo)}" x2="${X(v)}" y2="${Y(yhi)}"/>`;
      for (let v = ylo; v <= yhi; v += 1) out += `<line class="mb-gridline" x1="${X(xlo)}" y1="${Y(v)}" x2="${X(xhi)}" y2="${Y(v)}"/>`;
    }
    if (opt.poly) out += `<path d="M${opt.poly.map(([x, y]) => X(num(x)) + ' ' + Y(num(y))).join('L')}Z" style="fill:rgba(37,99,235,0.14);stroke:#1d4ed8;stroke-width:1.6;stroke-linejoin:round"/>`;
    // 축과 화살촉, 이름
    out += `<line class="mb-axis" x1="${X(xlo) - 8}" y1="${Y(0)}" x2="${X(xhi) + 9}" y2="${Y(0)}"/><path d="M${X(xhi) + 15} ${Y(0)}l-7 -3.4v6.8z" style="fill:#1f2933"/>`
      + `<line class="mb-axis" x1="${X(0)}" y1="${Y(ylo) + 8}" x2="${X(0)}" y2="${Y(yhi) - 9}"/><path d="M${X(0)} ${Y(yhi) - 15}l-3.4 7h6.8z" style="fill:#1f2933"/>`
      + `<text x="${X(xhi) + 21}" y="${Y(0) + 4}" text-anchor="middle" style="font-size:13.5px;fill:#1f2933;${ITALIC}">x</text><text x="${X(0) + 9}" y="${Y(yhi) - 10}" text-anchor="middle" style="font-size:13.5px;fill:#1f2933;${ITALIC}">y</text>`
      + `<text x="${X(0) + oSide * 7}" y="${Y(0) + 12}" text-anchor="middle" style="font-size:11px;fill:#1f2933;font-weight:600">O</text>`;
    for (let v = xlo; v <= xhi; v += 1) if (shown(v)) out += `<text class="mb-axis-label" style="font-size:10.5px" x="${X(v)}" y="${Y(0) + 12}" text-anchor="middle">${signedText(v)}</text>`;
    for (let v = ylo; v <= yhi; v += 1) if (shown(v)) out += `<text class="mb-axis-label" style="font-size:10.5px" x="${X(0) - 4}" y="${Y(v) + 3.6}" text-anchor="end">${signedText(v)}</text>`;
    for (const [x1, y1, x2, y2] of opt.segs || []) out += `<line x1="${X(num(x1))}" y1="${Y(num(y1))}" x2="${X(num(x2))}" y2="${Y(num(y2))}" style="stroke:#1d4ed8;stroke-width:1.6"/>`;
    const said = [`좌표평면: x축은 ${signedText(xlo)}부터 ${signedText(xhi)}까지, y축은 ${signedText(ylo)}부터 ${signedText(yhi)}까지이고 모눈 한 칸은 1이다.`];
    const COLORS = ['#1d4ed8', '#b42318', '#15803d', '#7c3aed'];
    (opt.lines || []).forEach((line, k) => {
      const color = COLORS[k % COLORS.length], dash = line.dash ? ';stroke-dasharray:5 3' : '', title = `직선${line.name ? ' ' + line.name : ''}`;
      // x = p: y축에 평행한 직선
      if (line.x != null) {
        const p = num(line.x);
        out += `<line x1="${X(p)}" y1="${Y(ylo)}" x2="${X(p)}" y2="${Y(yhi)}" style="stroke:${color};stroke-width:1.8${dash}"/>`;
        if (line.name) out += `<text x="${X(p) + 5}" y="${Y(yhi) + 11}" text-anchor="start" style="font-size:12px;font-weight:700;fill:${color}">${line.name}</text>`;
        said.push(`${title}: x축 위의 ${plain(asQ(line.x))}인 점을 지나고 y축에 평행하다.`);
        return;
      }
      // y = ax + b (b 를 주지 않으면 원점을 지난다)
      const a = num(line.a), b = line.b == null ? 0 : num(line.b);
      // 상자 안에 드는 구간
      let lo = xlo, hi = xhi;
      if (a !== 0) { const p = (ylo - b) / a, q = (yhi - b) / a; lo = Math.max(lo, Math.min(p, q)); hi = Math.min(hi, Math.max(p, q)); }
      out += `<line x1="${X(lo)}" y1="${Y(a * lo + b)}" x2="${X(hi)}" y2="${Y(a * hi + b)}" style="stroke:${color};stroke-width:1.8${dash}"/>`;
      if (line.name) out += `<text x="${X(hi) + (a < 0 ? 4 : -4)}" y="${Y(a * hi + b) + (a < 0 ? 13 : -5)}" text-anchor="${a < 0 ? 'start' : 'end'}" style="font-size:12px;font-weight:700;fill:${color}">${line.name}</text>`;
      const q = asQ(line.a), run = `오른쪽으로 ${q.q}칸 갈 때 ${q.p < 0 ? '아래쪽' : '위쪽'}으로 ${Math.abs(q.p)}칸 간다`;
      said.push(b === 0 ? `${title}: 원점을 지나고, ${run}.` : a === 0 ? `${title}: y축 위의 ${plain(asQ(line.b))}인 점을 지나고 x축에 평행하다.` : `${title}: y축 위의 ${plain(asQ(line.b))}인 점을 지나고, ${run}.`);
    });
    (opt.curves || []).forEach((curve, k) => {
      const a = num(curve.a), color = COLORS[(k + (opt.lines || []).length) % COLORS.length], lattice = [];
      for (const side of [1, -1]) {
        const pts = [];
        for (let i = 1; i <= 240; i += 1) { const x = side * i * Math.max(Math.abs(xlo), Math.abs(xhi)) / 240, y = a / x; if (x >= xlo && x <= xhi && y >= ylo && y <= yhi) pts.push(X(x) + ' ' + Y(y)); }
        if (pts.length > 1) out += `<path d="M${pts.join('L')}" style="fill:none;stroke:${color};stroke-width:1.8"/>`;
      }
      for (let x = xlo; x <= xhi; x += 1) if (x !== 0 && Number.isInteger(a / x) && a / x >= ylo && a / x <= yhi) lattice.push(`(${signedText(x)}, ${signedText(a / x)})`);
      if (curve.name) { const x = a > 0 ? Math.min(xhi, Math.abs(a) / Math.max(0.6, yhi - 0.8)) : Math.max(xlo, -Math.abs(a) / Math.max(0.6, yhi - 0.8)); out += `<text x="${X(x) + (a > 0 ? 6 : -6)}" y="${Y(a / x) + 4}" text-anchor="${a > 0 ? 'start' : 'end'}" style="font-size:12px;font-weight:700;fill:${color}">${curve.name}</text>`; }
      said.push(`곡선${curve.name ? ' ' + curve.name : ''}: 원점에 대하여 대칭인 한 쌍의 매끄러운 곡선이고 두 축과 만나지 않는다. 지나는 모눈 점은 ${lattice.join(', ')}이다.`);
    });
    (opt.parabolas || []).forEach((para, k) => {
      const a = num(para.a), p = num(para.p || 0), q = num(para.q || 0), f = (x) => a * (x - p) * (x - p) + q;
      const color = COLORS[(k + (opt.lines || []).length + (opt.curves || []).length) % COLORS.length], dash = para.dash ? ';stroke-dasharray:5 3' : '';
      // 상자의 위·아래 변과 만나는 x 를 풀어 구간을 나누고, 상자 안에 드는 구간만 촘촘히 잇는다(끝이 상자 변에 꼭 닿는다).
      const cuts = [xlo, xhi];
      for (const c of [ylo, yhi]) { const r = (c - q) / a; if (r >= 0) cuts.push(p - Math.sqrt(r), p + Math.sqrt(r)); }
      const xs = cuts.filter((x) => x >= xlo && x <= xhi).sort((s, t) => s - t);
      let last = null;
      for (let i = 0; i + 1 < xs.length; i += 1) {
        const s = xs[i], t = xs[i + 1], mid = f((s + t) / 2);
        if (t - s < 1e-9 || mid < ylo || mid > yhi) continue;
        const pts = [];
        for (let j = 0; j <= 160; j += 1) { const x = s + (t - s) * j / 160; pts.push(X(x) + ' ' + Y(Math.min(yhi, Math.max(ylo, f(x))))); }
        out += `<path d="M${pts.join('L')}" style="fill:none;stroke:${color};stroke-width:1.8${dash}"/>`;
        last = t;
      }
      if (para.name && last != null) { const y = f(last), right = last > p; out += `<text x="${X(last) + (right ? -6 : 6)}" y="${Y(y) + (y >= yhi - 0.01 ? 13 : -5)}" text-anchor="${right ? 'end' : 'start'}" style="font-size:12px;font-weight:700;fill:${color}">${para.name}</text>`; }
      const lattice = [];
      for (let x = Math.ceil(xlo); x <= xhi; x += 1) { const y = f(x); if (Math.abs(y - Math.round(y)) < 1e-9 && y >= ylo && y <= yhi) lattice.push(`(${signedText(x)}, ${signedText(Math.round(y))})`); }
      said.push(`포물선${para.name ? ' ' + para.name : ''}: 꼭짓점은 ${whereOnPlane(p, q)}이고 ${a > 0 ? '아래로' : '위로'} 볼록하다. ${lattice.length ? '지나는 모눈 점은 ' + lattice.join(', ') + '이다.' : '지나는 모눈 점은 없다.'}`);
    });
    for (const p of opt.points || []) {
      const x = num(p.x), y = num(p.y), side = p.side || 'ur', dx = side[1] === 'r' ? 6 : -6, dy = side[0] === 'u' ? -6 : 14;
      if (p.guide) out += `<line x1="${X(x)}" y1="${Y(y)}" x2="${X(x)}" y2="${Y(0)}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/><line x1="${X(x)}" y1="${Y(y)}" x2="${X(0)}" y2="${Y(y)}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/>`;
      out += `<circle class="mb-dot" cx="${X(x)}" cy="${Y(y)}" r="3.2"/>`;
      if (p.name) out += `<text class="mb-km-label" style="font-size:13px" x="${X(x) + dx}" y="${Y(y) + dy}" text-anchor="${dx > 0 ? 'start' : 'end'}">${p.name}</text>`;
      said.push(`점${p.name ? ' ' + p.name : ''}: ${whereOnPlane(x, y)}.`);
    }
    if (opt.poly) said.push(`도형의 꼭짓점: ${opt.poly.map(([x, y]) => whereOnPlane(num(x), num(y))).join(' / ')}.`);
    if (opt.say) said.push(opt.say);
    return `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W)}" role="img" aria-label="${said.join(' ')}">${out}</svg>`;
  }

  // graph(o): 두 양 사이의 관계를 나타낸 그래프(제1사분면의 꺾은선이나 곡선).
  //  o.xname, o.yname 축에 적는 양과 단위('시간(분)', '거리(km)'). o.xmax, o.ymax 축의 끝 값, o.xstep, o.ystep 눈금 간격(수를 적는 간격).
  //  o.paths [{ pts: [[x, y], …], name, smooth }] 점을 차례로 이은 선. smooth 이면 매끄러운 곡선으로 잇는다(물의 높이처럼 휘는 그래프 — 휘는 모양은 점을 촘촘히 주어 정한다).
  //  o.marks [[x, y], …] 축으로 점선을 내려 읽을 자리를 보인다. o.plain: true 이면 눈금 수와 모눈 없이 모양만 그린다(보기 그림). o.w: 그림 너비(기본 280, 보기 그림은 132쯤).
  // 그림 설명에는 축의 양과 선이 지나는 점을 차례로 적는다.
  function graph(o) {
    const w = o.w || 280, small = w < 200, L = small ? 20 : 34, R = small ? 10 : 16, T = small ? 16 : 22, Bm = small ? 20 : 34, h = o.h || Math.round(w * (small ? 0.82 : 0.66));
    const gx = (v) => f1(L + v / o.xmax * (w - L - R)), gy = (v) => f1(h - Bm - v / o.ymax * (h - T - Bm));
    let out = '';
    if (!o.plain) {
      for (let v = o.xstep; v <= o.xmax + 1e-9; v += o.xstep) out += `<line class="mb-gridline" x1="${gx(v)}" y1="${gy(0)}" x2="${gx(v)}" y2="${gy(o.ymax)}"/><text class="mb-axis-label" style="font-size:10.5px" x="${gx(v)}" y="${gy(0) + 12}" text-anchor="middle">${Number(v.toFixed(2))}</text>`;
      for (let v = o.ystep; v <= o.ymax + 1e-9; v += o.ystep) out += `<line class="mb-gridline" x1="${gx(0)}" y1="${gy(v)}" x2="${gx(o.xmax)}" y2="${gy(v)}"/><text class="mb-axis-label" style="font-size:10.5px" x="${gx(0) - 4}" y="${gy(v) + 3.6}" text-anchor="end">${Number(v.toFixed(2))}</text>`;
    }
    out += `<line class="mb-axis" x1="${gx(0)}" y1="${gy(0)}" x2="${w - 4}" y2="${gy(0)}"/><path d="M${w - 1} ${gy(0)}l-7 -3.4v6.8z" style="fill:#1f2933"/>`
      + `<line class="mb-axis" x1="${gx(0)}" y1="${gy(0)}" x2="${gx(0)}" y2="7"/><path d="M${gx(0)} 3l-3.4 7h6.8z" style="fill:#1f2933"/>`
      + `<text x="${gx(0) - 6}" y="${gy(0) + 12}" text-anchor="middle" style="font-size:11px;fill:#1f2933;font-weight:600">O</text>`
      + `<text x="${w - 2}" y="${h - (small ? 4 : 6)}" text-anchor="end" style="font-size:${small ? 10 : 11.5}px;fill:#1f2933;font-weight:600">${o.xname || ''}</text><text x="${gx(0) + 7}" y="${small ? 9 : 11}" style="font-size:${small ? 10 : 11.5}px;fill:#1f2933;font-weight:600">${o.yname || ''}</text>`;
    for (const [x, y] of o.marks || []) out += `<line x1="${gx(x)}" y1="${gy(y)}" x2="${gx(x)}" y2="${gy(0)}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/><line x1="${gx(x)}" y1="${gy(y)}" x2="${gx(0)}" y2="${gy(y)}" style="stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2"/>`;
    const COLORS = ['#1d4ed8', '#b42318', '#15803d'], said = [`그래프: 가로축은 ${o.xname || 'x'}, 세로축은 ${o.yname || 'y'}.`];
    (o.paths || []).forEach((path, k) => {
      const color = COLORS[k % COLORS.length], P = path.pts.map(([x, y]) => [Number(gx(x)), Number(gy(y))]);
      let d = `M${P[0][0]} ${P[0][1]}`;
      if (path.smooth && P.length > 2) {
        // 점들을 지나는 매끄러운 곡선(이웃한 점의 기울기로 이어 붙인다)
        for (let i = 0; i < P.length - 1; i += 1) {
          const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
          d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${p2[0]} ${p2[1]}`;
        }
      } else d += P.slice(1).map((p) => `L${p[0]} ${p[1]}`).join('');
      out += `<path d="${d}" style="fill:none;stroke:${color};stroke-width:${small ? 1.8 : 2};stroke-linejoin:round;stroke-linecap:round"/>`;
      if (path.name) { const last = P[P.length - 1]; out += `<text x="${Math.min(last[0] + 3, w - 12)}" y="${last[1] - 5}" text-anchor="middle" style="font-size:12px;font-weight:700;fill:${color}">${path.name}</text>`; }
      said.push(`${path.smooth ? '곡선' : '선'}${path.name ? ' ' + path.name : ''}: ${path.pts.map(([x, y]) => `(${Number(x.toFixed(2))}, ${Number(y.toFixed(2))})`).join(', ')}${path.smooth ? '을 매끄럽게' : '을 차례로'} 이었다.`);
    });
    if (o.say) said.push(o.say);
    return `<svg class="mb-geo" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${said.join(' ')}">${out}</svg>`;
  }

  // 직선·반직선·선분의 기호: 글자 위에 ↔, →, ― 를 얹는다. 글줄 높이는 그대로 두고(위쪽 여백 0.36em), 표시는 작은 그림으로 그린다.
  // 화면에 보이지 않는 낱말(직선·반직선·선분)을 함께 넣어, 글로 옮기거나 소리 내어 읽을 때 세 기호가 가려지게 한다.
  const WORD = { line: '직선', ray: '반직선', seg: '선분' };
  function over(kind, name) {
    const w = name.length * 0.7 + 0.2, W = Math.round(w * 10), y = 2.5, h = 1.7;
    const head = (x, s) => `M${x + s * 2.4} ${y - h}L${x} ${y}L${x + s * 2.4} ${y + h}`;
    const dd = kind === 'seg' ? `M0.6 ${y}H${W - 0.6}` : kind === 'ray' ? `M0.6 ${y}H${W - 0.8}${head(W - 0.6, -1)}` : `M0.8 ${y}H${W - 0.8}${head(0.6, 1)}${head(W - 0.6, -1)}`;
    return `<span style="position:relative;display:inline-block;padding-top:0.36em;line-height:1.12;white-space:nowrap"><span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${WORD[kind]} </span>${name}`
      // 선분의 줄은 글자 너비에 꼭 맞춘다(글꼴마다 글자 너비가 달라 어림한 너비로는 옆 글자 위까지 나간다). 화살표는 머리가 찌그러지지 않게 어림한 너비로 둔다.
      + (kind === 'seg'
        ? `<svg class="mb-inline" aria-hidden="true" viewBox="0 0 ${W} 5" preserveAspectRatio="none" style="position:absolute;left:0;top:0;width:100%;height:0.5em;overflow:visible"><path d="${dd}" style="fill:none;stroke:currentColor;stroke-width:0.8;stroke-linecap:butt"/></svg></span>`
        : `<svg class="mb-inline" aria-hidden="true" viewBox="0 0 ${W} 5" style="position:absolute;left:50%;top:0;width:${w.toFixed(2)}em;height:0.5em;margin-left:-${(w / 2).toFixed(2)}em;overflow:visible"><path d="${dd}" style="fill:none;stroke:currentColor;stroke-width:0.8;stroke-linecap:round;stroke-linejoin:round"/></svg></span>`);
  }
  const LN = (name) => over('line', name), RY = (name) => over('ray', name), SG = (name) => over('seg', name);

  // ── 중2에서 더한 것 ──
  // 화면에는 안 보이고 글로 옮길 때만 남는 글(기록·검사가 표기를 가려 읽게 한다)
  const SR = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
  // 순환소수: rep('0.', '3') → 0.3 위에 점, rep('1.2', '45') → 1.245 의 4와 5 위에 점(순환마디의 첫 숫자와 끝 숫자). head 는 순환마디 앞까지의 글('0.', '−2.1').
  function rep(head, cycle) {
    const c = String(cycle), dot = (ch) => '<span class="mb-rdot">' + ch + '</span>';
    return '<span style="white-space:nowrap">' + head + (c.length === 1 ? dot(c) : dot(c[0]) + c.slice(1, -1) + dot(c[c.length - 1])) + '<span style="' + SR + '">(순환마디 ' + c + ')</span></span>';
  }
  // 순환소수의 값(유리수). repQ('1.2', '45') = 1.2454545… = 137/110
  function repQ(head, cycle) {
    const text = String(head).replace(MINUS, '-'), neg = text.startsWith('-'), [w, f = ''] = text.replace('-', '').split('.'), k = String(cycle).length;
    const value = Q(Number(w + f + cycle) - Number(w + f), 10 ** f.length * (10 ** k - 1));
    return neg ? qneg(value) : value;
  }
  // 순환소수의 소수점 아래 n번째 자리의 숫자
  const repDigit = (head, cycle, n) => { const f = (String(head).split('.')[1] || ''), c = String(cycle); return Number(n <= f.length ? f[n - 1] : c[(n - f.length - 1) % c.length]); };

  // 연립방정식: sys(['x + y = 5', '2x − y = 1']) — 왼쪽에 중괄호를 두고 식을 위아래로 놓는다. 글로 옮기면 「식1, 식2」가 된다.
  function sys(rows) {
    const brace = '<svg class="mb-inline" aria-hidden="true" viewBox="0 0 10 40" preserveAspectRatio="none" style="width:0.5em;height:auto;align-self:stretch;overflow:visible"><path d="M8.5 1C3.5 1 5.5 8 5.5 12.5C5.5 17 4 19 1 20C4 21 5.5 23 5.5 27.5C5.5 32 3.5 39 8.5 39" style="fill:none;stroke:currentColor;stroke-width:1.3;vector-effect:non-scaling-stroke"/></svg>';
    return '<span class="mb-sys">' + brace + '<span class="mb-sys-rows">' + rows.map((row, i) => '<span>' + row + (i < rows.length - 1 ? '<span style="' + SR + '">, </span>' : '') + '</span>').join('') + '</span></span>';
  }

  // 답이 부등식인 문항: 「x [부등호 고르기] [±][ ]」로 받고, 틀리면 「x ≥ −3」 꼴로 보인다. rel 은 '<' | '<=' | '>' | '>=', value 는 정수.
  const REL_MARK = { '<': '&lt;', '<=': '≤', '>': '&gt;', '>=': '≥' };
  function ineqAns(text, rel, value, v, o) {
    if (!REL_MARK[rel] || !Number.isInteger(value)) throw new Error('부등식 답은 부등호 넷 가운데 하나와 정수여야 한다');
    const name = v || V('x');
    return inline(text, name + ' {0} {1}', [{ rel: true, answer: rel }, { answer: value, signed: true }], Object.assign({}, o, { shown: name + ' ' + REL_MARK[rel] + ' ' + signedText(value) }));
  }
  // 답이 단항식인 문항: 「[±][ ] x^[ ] y^[ ]」로 받는다. coef 는 0이 아닌 정수, vars 는 [[문자, 지수], …](지수는 자연수 — 1이어도 칸에 1을 적게 한다. 문제 글에 그 말이 붙는다).
  function monoAns(text, coef, vars, o) {
    if (!Number.isInteger(coef) || coef === 0 || !vars.length || vars.some(([, e]) => !Number.isInteger(e) || e < 1)) throw new Error('단항식 답: 계수는 0이 아닌 정수, 지수는 자연수여야 한다');
    const template = '{0}' + vars.map(([name], i) => V(name) + '<sup>{' + (i + 1) + '}</sup>').join('');
    const shownText = (coef < 0 ? MINUS : '') + mono(coef, vars.map(([name, e]) => V(name) + (e > 1 ? sup(e) : '')).join(''));
    return inline(text + ' <span style="white-space:nowrap">(단, 지수가 1이면 1을 적는다.)</span>', template, [{ answer: coef, signed: true }].concat(vars.map(([, e]) => ({ answer: e }))), Object.assign({}, o, { shown: shownText }));
  }
  // 답이 다항식인 문항: 항마다 「[±][ ] 문자」로 받는다. terms 는 [[계수, 문자 글], …](문자 글은 V('x'), V('x') + sup(2), 상수항은 ''). 계수는 0이 아닌 정수이고, 1이어도 1을 적게 한다.
  function polyAns(text, terms, o) {
    if (!terms.length || terms.some(([k]) => !Number.isInteger(k) || k === 0)) throw new Error('다항식 답의 계수는 0이 아닌 정수여야 한다');
    return inline(text, terms.map(([, name], i) => '{' + i + '}' + name).join(' '), terms.map(([k]) => ({ answer: k, signed: true })), Object.assign({}, o, { shown: poly(terms) }));
  }

  // ── 중3에서 더한 것 ──
  // 근호: rt('12') → √12. 근호 안의 글 위에 줄을 긋고, √ 기호는 작은 그림으로 그려 안의 글 높이에 맞춘다(글꼴마다 √ 글자의 높이가 달라 줄과 이어지지 않는다).
  // 보이지 않는 √ 글자를 함께 넣어, 글로 옮기거나(기록·검사) 소리 내어 읽을 때 근호가 남는다. 안에는 식이나 답 칸 자리('{1}')를 넣어도 된다.
  // 그림(svg) 속 글에는 쓸 수 없다 — 그림의 길이 글에 근호가 필요하면 문제 글로 길이를 알려 준다.
  const rt = (inner) => '<span class="mb-rad"><span class="mb-sr">√</span><svg aria-hidden="true" viewBox="0 0 10 20" preserveAspectRatio="none"><path d="M0.6 12.4L2.8 11.2L5.7 19.3L9.7 0.6"/></svg><span class="mb-rad-in">' + inner + '</span></span>';
  // 답 칸 틀(template)에서 한 덩어리로 붙어 있어야 할 부분(인수분해한 괄호 하나)을 묶는다. 좁은 화면에서 괄호 가운데서 줄이 갈리지 않는다.
  const grp = (html) => '<span class="mb-nw">' + html + '</span>';
  // n = a² × b (b 는 제곱인 수를 인수로 갖지 않는다)로 가른다: sqParts(12) → [2, 3], 곧 √12 = 2√3.
  function sqParts(n) {
    let a = 1, b = n;
    for (let k = 2; k * k <= b; k += 1) while (b % (k * k) === 0) { a *= k; b /= k * k; }
    return [a, b];
  }
  // a√b 의 글: radText(−2, 3) → −2√3, radText(1, 5) → √5, 근호 안이 1이면 수만(radText(4, 1) → 4).
  const radText = (coef, n) => (n === 1 ? signedText(coef) : (coef < 0 ? MINUS : '') + (Math.abs(coef) === 1 ? '' : Math.abs(coef)) + rt(n));
  // 답이 a√b 인 문항: 「[±][ ]√[ ]」(a 가 1이면 「√[ ]」 한 칸). a 는 0, −1이 아닌 정수(−√b 가 답이면 고르기나 다른 꼴로), b 는 2 이상이고 제곱인 수를 인수로 갖지 않는 자연수.
  // 틀렸을 때 보이는 답은 근호 그대로(−2√3)이다. facts 에는 계수와 근호 안의 수를 셈하는 식을 calc 로 적는다.
  function radAns(text, coef, n, o) {
    if (!Number.isInteger(coef) || coef === 0 || coef === -1 || !Number.isInteger(n) || n < 2 || sqParts(n)[0] !== 1) throw new Error('근호 답: 계수는 0, −1이 아닌 정수, 근호 안은 2 이상이고 제곱인 수를 인수로 갖지 않는 자연수여야 한다');
    const opts = Object.assign({}, o, { shown: radText(coef, n) });
    return coef === 1 ? inline(text, rt('{0}'), [{ answer: n }], opts) : inline(text, '{0}' + rt('{1}'), [{ answer: coef, signed: true }, { answer: n }], opts);
  }

  B.kit.mid = {
    LAB, MINUS, GT, LT, GE, LE, range, gcd, lcm, Q, dc, dc2, plainQ, qadd, qsub, qmul, qdiv, keepD, qneg, qabs, qpow, qcmp, isInt, fl, asDec, U, mag, tx,
    sx, px, digits, nb, isFrac, glue, plain, tail, lastOf, tj, sj, pj, js, V, sup, P, G, W, WN, MN, A, isNum, valT, val, OPS, BR, htmlT, html, inl, jsT,
    jsx, hasP, S, isPow, step, trace, chainOf, flatNums, intsOnly, biggest, emOf, FIT, fit, ex, show, tag, tagged, taggedEx, proc, flow, f1, nline, nz, pm,
    co, fr, distinct, okKind, ansV, valueFacts, CALC, calcQ, pickEx, SAME_ADD, DIFF_ADD, TO_ADD, SAME_MUL, DIFF_MUL, SAME_DIV, DIFF_DIV, BY_RECIP, rawMag,
    uniq, addTold, subTold, mulTold, divTold, commonTold, un, sv, claimQ,
    asQ, mono, poly, lin, linAns, pointAns, whereOnPlane, plane, graph,
    over, LN, RY, SG,
    rep, repQ, repDigit, sys, ineqAns, monoAns, polyAns,
    rt, grp, sqParts, radText, radAns
  };
})(typeof window !== 'undefined' ? window : globalThis);

// ── 중학교 도형 그림 판(B.kit.mgeo) ── 7-2-3 「평면도형의 성질」에서 지은 것을 옮겼다. 쓰는 본보기는 units/7-2-3a.js·b.js·c.js.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const inSum = (n) => 180 * (n - 2);   // n각형의 내각의 크기의 합
  // ── 그림 판 ──────────────────────────────────────────────────
  // 화면 좌표(px, y 는 아래로 커진다)에 바로 그린다. 각은 오른쪽이 0°이고 시계 반대쪽으로 커진다.
  // 그린 것의 크기를 재어 두었다가 꼭 맞는 그림 틀(viewBox)을 만든다. 글씨는 13px 이고, 그림 너비는 휴대폰 카드(288px)를 넘기지 않게 짓는다.
  const RAD = Math.PI / 180, r1 = (v) => Math.round(v * 10) / 10, FS = 13;
  const at = (c, r, a) => [c[0] + r * Math.cos(a * RAD), c[1] - r * Math.sin(a * RAD)];
  // 점 p 에서 q 를 바라보는 방향(도)
  const dirOf = (p, q) => (Math.atan2(p[1] - q[1], q[0] - p[0]) / RAD + 360) % 360;
  const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const mid = (p, q, t) => { const k = t == null ? 0.5 : t; return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; };
  const XY = (p) => r1(p[0]) + ' ' + r1(p[1]);
  // 두 직선 pq, rs 가 만나는 점
  const meet = (p, q, r, s) => { const u = [q[0] - p[0], q[1] - p[1]], w = [s[0] - r[0], s[1] - r[1]], t = ((r[0] - p[0]) * w[1] - (r[1] - p[1]) * w[0]) / (u[0] * w[1] - u[1] * w[0]); return [p[0] + u[0] * t, p[1] + u[1] * t]; };
  // 점 p 에서, 다른 점들이 있는 쪽의 반대 방향(이름을 적을 쪽)
  const awayFrom = (p, others) => { let x = 0, y = 0; for (const q of others) { const L = dist(p, q) || 1; x += (q[0] - p[0]) / L; y += (q[1] - p[1]) / L; } return (Math.atan2(y, -x) / RAD + 360) % 360; };
  // 글의 너비 어림(px)
  const textW = (s) => { let w = 0; for (const ch of String(s).replace(/<[^>]+>/g, '')) w += /[가-힣㉠-㉯]/.test(ch) ? 1 : /[A-Z]/.test(ch) ? 0.74 : ch === ' ' ? 0.3 : /[°()′.,]/.test(ch) ? 0.4 : 0.62; return w * FS; };
  // 중심 c, 반지름 r 인 원 위에서 a0° 에서 a1° 까지 가는 호(경로 조각). a1 이 크면 시계 반대쪽으로 돈다.
  const arcTo = (c, r, a0, a1) => `A${r1(r)} ${r1(r)} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 0 : 1} ${XY(at(c, r, a1))}`;
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3.2px;stroke-linejoin:round';
  // 그림 속의 문자(기울인 글자)
  const sv = (name) => `<tspan style="font-style:italic;font-family:'MB Math','Times New Roman',serif;font-size:1.12em">${name}</tspan>`;
  // 색칠한 부분
  const TINT = 'fill:rgba(251,191,36,0.45)', WHITE = 'fill:#fff', CLEAR = 'fill:none';

  function Board() {
    const out = [], texts = [], rects = [], bb = [1e9, 1e9, -1e9, -1e9];
    const grow = (p, m) => { const k = m || 0; bb[0] = Math.min(bb[0], p[0] - k); bb[1] = Math.min(bb[1], p[1] - k); bb[2] = Math.max(bb[2], p[0] + k); bb[3] = Math.max(bb[3], p[1] + k); };
    const growArc = (c, r, a0, a1) => { const lo = Math.min(a0, a1), hi = Math.max(a0, a1); for (let a = lo; a < hi; a += 10) grow(at(c, r, a), 1); grow(at(c, r, hi), 1); };
    const b = {
      grow,
      // 선분. kind: 'thin' 가는 선, 'cut' 점선
      seg(p, q, kind, css) { grow(p, 1); grow(q, 1); out.push(`<line class="mb-line${kind === 'thin' ? ' is-thin' : kind === 'cut' ? ' is-cut' : ''}"${css ? ` style="${css}"` : ''} x1="${r1(p[0])}" y1="${r1(p[1])}" x2="${r1(q[0])}" y2="${r1(q[1])}"/>`); return b; },
      // 다각형(칠하지 않는다. css 로 칠을 바꾼다)
      poly(pts, css) { pts.forEach((p) => grow(p, 1)); out.push(`<polygon class="mb-poly" style="${css || CLEAR}" points="${pts.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}"/>`); return b; },
      disk(c, r, css) { grow([c[0] - r, c[1] - r], 1); grow([c[0] + r, c[1] + r], 1); out.push(`<circle class="mb-poly" style="${css || CLEAR}" cx="${r1(c[0])}" cy="${r1(c[1])}" r="${r1(r)}"/>`); return b; },
      // 굽은 변이 있는 도형. d: 경로 글, pts: 그림의 크기를 재는 데 쓸 점들
      shape(d, pts, css) { pts.forEach((p) => grow(p, 1)); out.push(`<path class="mb-poly" style="${css || CLEAR}" d="${d}"/>`); return b; },
      // 부채꼴(중심 c, 반지름 r, a0° → a1° 시계 반대쪽)
      fan(c, r, a0, a1, css) { growArc(c, r, a0, a1); grow(c, 1); out.push(`<path class="mb-poly" style="${css || CLEAR}" d="M${XY(c)}L${XY(at(c, r, a0))}${arcTo(c, r, a0, a1)}Z"/>`); return b; },
      // 호만 긋는다. kind: 'thin' 가는 선, 'bold' 굵은 파란 선
      arc(c, r, a0, a1, kind) { growArc(c, r, a0, a1); out.push(`<path class="mb-line${kind === 'thin' ? ' is-thin' : ''}" style="fill:none${kind === 'bold' ? ';stroke:#1d4ed8;stroke-width:3.2' : ''}" d="M${XY(at(c, r, a0))}${arcTo(c, r, a0, a1)}"/>`); return b; },
      dot(p, r) { grow(p, 3); out.push(`<circle class="mb-dot" cx="${r1(p[0])}" cy="${r1(p[1])}" r="${r || 2.6}"/>`); return b; },
      // 글. o.blue: 값(각도·길이)의 빛깔, o.plain: 흰 테두리 없이, o.size: 글씨 크기(기본 13px)
      text(p, html, o) {
        const opt = o || {}, size = opt.size || FS, w = textW(html) * size / FS;
        grow([p[0] - w / 2, p[1] - size * 0.55]); grow([p[0] + w / 2, p[1] + size * 0.55]);
        rects.push([p[0] - w / 2, p[1] - size * 0.5, p[0] + w / 2, p[1] + size * 0.5]);
        texts.push(`<text class="mb-label" style="font-size:${size}px;${opt.blue ? 'fill:#1d4ed8;font-weight:700;' : ''}${opt.plain ? '' : HALO}" x="${r1(p[0])}" y="${r1(p[1])}" text-anchor="middle" dominant-baseline="central">${html}</text>`);
        return b;
      },
      // 점의 이름: 점 p 에서 a° 쪽으로 조금 떨어뜨려 적는다.
      name(p, label, a, gap) { return b.text(at(p, gap == null ? 11 : gap, a), label); },
      // 꼭짓점 v 에서 a0° 쪽 변에서 a1° 쪽 변까지(시계 반대쪽) 벌어진 각에 표시(호, 직각이면 네모)와 글을 넣는다.
      // 직각 표시(네모)는 글 없이 표시만 할 때 그린다(구하는 각에는 o.square: false 를 준다). 글은 두 변에 닿지 않게, 좁은 각일수록 꼭짓점에서 멀리 적는다.
      // o.r 호의 반지름, o.d 글까지의 거리, o.arc: false 이면 글만, o.size 글씨 크기, o.ink 이름처럼 검은 글씨로
      angle(v, a0, a1, label, o) {
        const opt = o || {};
        let to = a1; while (to <= a0) to += 360; while (to - a0 > 360) to -= 360;
        const span = to - a0, m = a0 + span / 2, right = Math.abs(span - 90) < 0.01 && (label == null || label === '') && opt.square !== false;
        const r = opt.r || (span < 40 ? 22 : span > 130 ? 11 : 15);
        if (opt.arc === false) { /* 표시 없이 글만 */ } else if (right) {
          const p1 = at(v, 9, a0), p3 = at(v, 9, to), p2 = [p1[0] + p3[0] - v[0], p1[1] + p3[1] - v[1]];
          out.push(`<polyline class="mb-mark" points="${[p1, p2, p3].map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ')}"/>`);
        } else { out.push(`<path class="mb-line is-thin" style="fill:none" d="M${XY(at(v, r, a0))}${arcTo(v, r, a0, to)}"/>`); growArc(v, r, a0, to); }
        if (label != null && label !== '') {
          // 글 상자의 네 귀가 두 변에서 떨어질 때까지 꼭짓점에서 멀리 민다.
          const k = (opt.size || FS) / FS, w = textW(label) * k + 5, h = FS * k + 3, c0 = Math.cos(a0 * RAD), s0 = Math.sin(a0 * RAD), c1 = Math.cos(to * RAD), s1 = Math.sin(to * RAD);
          const fits = (dd) => { const c = at(v, dd, m); return [[-1, -1], [1, -1], [1, 1], [-1, 1]].every(([sx, sy]) => { const ux = c[0] + sx * w / 2 - v[0], uy = -(c[1] + sy * h / 2 - v[1]); return c0 * uy - s0 * ux >= 1.5 && s1 * ux - c1 * uy >= 1.5; }); };
          let dd = (opt.arc === false ? 0 : right ? 10 : r) + 2 + (w / 2) * Math.abs(Math.cos(m * RAD)) + (h / 2) * Math.abs(Math.sin(m * RAD));
          if (span < 180) while (dd < 96 && !fits(dd)) dd += 2;
          b.text(at(v, opt.d || dd, m), label, { blue: !opt.ink, size: opt.size });
        }
        return b;
      },
      // 점 v 에서 여러 쪽(dirs, 도)으로 선이 뻗어 있을 때, 선 사이가 가장 넓게 빈 쪽에 이름을 적는다.
      nameFree(v, label, dirs) {
        const list = dirs.map((a) => ((a % 360) + 360) % 360).sort((x, y) => x - y); let best = 0, from = 0;
        list.forEach((a, i) => { const gap = i + 1 < list.length ? list[i + 1] - a : list[0] + 360 - a; if (gap > best) { best = gap; from = a; } });
        return b.angle(v, from, from + best, label, { arc: false, ink: true });
      },
      // 꼭짓점 v 에서 점 p 쪽 변과 점 q 쪽 변 사이의 각(180°보다 작은 쪽)
      corner(v, p, q, label, o) { const a = dirOf(v, p), c = dirOf(v, q); return (c - a + 360) % 360 < 180 ? b.angle(v, a, c, label, o) : b.angle(v, c, a, label, o); },
      // 크기가 같은 각의 표시: 꼭짓점 v 에서 a° 쪽으로 d 만큼 떨어진 곳에 점(●)이나 가위표(×)
      sym(v, a, kind, d) {
        const p = at(v, d || 21, a); grow(p, 4);
        out.push(kind === 'x' ? `<path d="M${r1(p[0] - 3)} ${r1(p[1] - 3)}l6 6M${r1(p[0] + 3)} ${r1(p[1] - 3)}l-6 6" style="stroke:#b42318;stroke-width:1.5;fill:none"/>` : `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="2.5" style="fill:#b42318"/>`);
        return b;
      },
      // 선분 p–q 옆에 글을 적는다. inside: 글을 두지 않을 쪽에 있는 점(도형의 안쪽), o.t 선분을 따라간 자리, o.gap 선에서 띄울 거리, o.plain 흰 테두리 없이
      beside(p, q, label, inside, o) {
        const opt = o || {}, m = mid(p, q, opt.t), L = dist(p, q);
        let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
        if ((inside[0] - m[0]) * n[0] + (inside[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
        const off = (textW(label) / 2) * Math.abs(n[0]) + 7 * Math.abs(n[1]) + (opt.gap == null ? 5 : opt.gap);
        return b.text([m[0] + n[0] * off, m[1] + n[1] * off], label, { blue: true, plain: opt.plain });
      },
      // 치수선: 선분 p–q 와 나란히 off 만큼 떨어진 가는 선과 양 끝 눈금, 그 바깥에 글
      dim(p, q, label, inside, off) {
        const L = dist(p, q), m = mid(p, q), k = off == null ? 10 : off;
        let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
        if ((inside[0] - m[0]) * n[0] + (inside[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
        const a = [p[0] + n[0] * k, p[1] + n[1] * k], c = [q[0] + n[0] * k, q[1] + n[1] * k];
        b.seg(a, c, 'thin');
        for (const e of [a, c]) b.seg([e[0] - n[0] * 3.5, e[1] - n[1] * 3.5], [e[0] + n[0] * 3.5, e[1] + n[1] * 3.5], 'thin');
        return b.beside(a, c, label, [m[0] - n[0] * 30, m[1] - n[1] * 30], { gap: 4 });
      },
      // 호의 길이: 호(중심 c, 반지름 R, a0° → a1°) 바깥에 가는 호와 양 끝 눈금을 긋고 그 바깥에 글을 적는다.
      arcDim(c, R, a0, a1, label, off) {
        const rr = R + (off == null ? 8 : off), m = (a0 + a1) / 2;
        b.arc(c, rr, a0, a1, 'thin');
        for (const a of [a0, a1]) b.seg(at(c, rr - 3.5, a), at(c, rr + 3.5, a), 'thin');
        const need = (textW(label) / 2) * Math.abs(Math.cos(m * RAD)) + 7 * Math.abs(Math.sin(m * RAD)) + 5;
        return b.text(at(c, rr + need, m), label, { blue: true });
      },
      // 길이가 같다는 표시(짧은 금 n 개)
      tick(p, q, n) {
        const m = mid(p, q), L = dist(p, q), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], k = n || 1;
        for (let i = 0; i < k; i += 1) { const c = [m[0] + u[0] * (i - (k - 1) / 2) * 4.2, m[1] + u[1] * (i - (k - 1) / 2) * 4.2]; out.push(`<line x1="${r1(c[0] + u[1] * 4.6)}" y1="${r1(c[1] - u[0] * 4.6)}" x2="${r1(c[0] - u[1] * 4.6)}" y2="${r1(c[1] + u[0] * 4.6)}" style="stroke:#b42318;stroke-width:1.5"/>`); }
        return b;
      },
      // 평행하다는 표시(선분 p–q 위의 화살촉)
      arrow(p, q, t) {
        const m = mid(p, q, t), a = dirOf(p, q), p1 = at(m, 7, a + 152), p2 = at(m, 7, a - 152);
        out.push(`<path d="M${XY(p1)}L${XY(m)}L${XY(p2)}" style="fill:none;stroke:#b42318;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round"/>`);
        return b;
      },
      // 글끼리 겹쳤거나 옆으로 바짝 붙었는가(그러면 수를 다시 고른다)
      clash() { return rects.some((a, i) => rects.some((c, j) => j > i && a[0] < c[2] + 5 && c[0] < a[2] + 5 && a[1] < c[3] + 1 && c[1] < a[3] + 1)); },
      svg(label) {
        const k = 5, x = bb[0] - k, y = bb[1] - k, w = bb[2] - bb[0] + 2 * k, h = bb[3] - bb[1] + 2 * k;
        return `<svg class="mb-geo" viewBox="${r1(x)} ${r1(y)} ${r1(w)} ${r1(h)}" width="${Math.round(w)}" role="img" aria-label="${label}">${out.join('')}${texts.join('')}</svg>`;
      }
    };
    return b;
  }

  // ── 다각형 짓기 ──
  // 내각의 크기(도, 꼭짓점 차례)로 볼록한 다각형의 꼭짓점을 만든다. 꼭짓점 0은 밑변의 왼쪽 끝이고 화면에서 시계 반대쪽으로 돈다.
  // 변의 길이는 도형이 닫히는 것 가운데 서로 가장 비슷한 것으로 잡는다. size: [가로, 세로] 안에 꼭 맞게 키운다.
  // 돌려주는 것: pts 꼭짓점, dirs 변 i(꼭짓점 i → i + 1)의 방향, ok 변의 길이가 고른가
  function polyOf(angles, size) {
    const n = angles.length, dirs = [0];
    for (let i = 1; i < n; i += 1) dirs.push(dirs[i - 1] + 180 - angles[i]);
    const cs = dirs.map((a) => [Math.cos(a * RAD), Math.sin(a * RAD)]);
    let sxx = 0, sxy = 0, syy = 0, bx = 0, by = 0;
    for (const [x, y] of cs) { sxx += x * x; sxy += x * y; syy += y * y; bx += x; by += y; }
    const det = sxx * syy - sxy * sxy, lx = (bx * syy - by * sxy) / det, ly = (by * sxx - bx * sxy) / det;
    const len = cs.map(([x, y]) => 1 - x * lx - y * ly), raw = [[0, 0]];
    for (let i = 0; i < n - 1; i += 1) raw.push([raw[i][0] + len[i] * cs[i][0], raw[i][1] - len[i] * cs[i][1]]);
    const xs = raw.map((p) => p[0]), ys = raw.map((p) => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), k = Math.min(size[0] / (Math.max(...xs) - x0), size[1] / (Math.max(...ys) - y0));
    return { pts: raw.map(([x, y]) => [(x - x0) * k, (y - y0) * k]), dirs, ok: Math.min(...len) > 0.5 && Math.max(...len) < 2 };
  }
  // 내각의 크기가 모두 5°의 배수인 볼록한 n각형의 내각. ok(각들)로 조건을 더 건다.
  const RANGE = { 3: [35, 100], 4: [60, 125], 5: [80, 140], 6: [100, 145] };
  function anglesOf(d, n, ok) {
    const [lo, hi] = RANGE[n];
    return d.until(() => { const a = []; for (let i = 0; i < n - 1; i += 1) a.push(5 * d.int(lo / 5, hi / 5)); a.push(inSum(n) - a.reduce((s, v) => s + v, 0)); return a; },
      (a) => a[n - 1] >= lo && a[n - 1] <= hi && polyOf(a, [160, 120]).ok && (!ok || ok(a)));
  }
  // 꼭짓점의 이름: 맨 위 꼭짓점이 A 이고 시계 반대쪽으로 B, C, …
  const ALPHA = 'ABCDEFGHIJKL';
  const vnames = (pts) => { const n = pts.length; let top = 0; pts.forEach((p, i) => { if (p[1] < pts[top][1] - 0.5) top = i; }); return pts.map((_, i) => ALPHA[(i - top + n) % n]); };
  // 삼각형 ABC(A 위, B 왼쪽 아래, C 오른쪽 아래)의 세 꼭짓점
  const triOf = (a, bv, c, size) => { const [pB, pC, pA] = polyOf([bv, c, a], size || [165, 120]).pts; return { A: pA, B: pB, C: pC }; };
  // 정n각형의 꼭짓점. 첫 변은 p → q 이고 시계 반대쪽으로 돈다(도형은 p → q 의 왼쪽에 놓인다).
  const regOn = (p, q, n) => { const s = dist(p, q), a = dirOf(p, q), pts = [p]; for (let i = 0; i < n - 1; i += 1) pts.push(at(pts[i], s, a + i * 360 / n)); return pts; };
  // 밑변이 가로로 놓인 정n각형(한 변 s)
  const regPts = (n, s) => regOn([0, 0], [s, 0], n);

  B.kit.mgeo = { RAD, r1, FS, at, dirOf, dist, mid, XY, meet, awayFrom, textW, arcTo, HALO, sv, TINT, WHITE, CLEAR, Board, polyOf, RANGE, anglesOf, ALPHA, vnames, triOf, regOn, regPts };
})(typeof window !== 'undefined' ? window : globalThis);
