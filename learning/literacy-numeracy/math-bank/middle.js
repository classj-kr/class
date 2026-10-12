// 중학교 단원이 함께 쓰는 도구: 유리수와 그 셈, 수를 적는 글(음수·분수·토씨), 문자, 식(조각의 배열)과 한 단계씩 계산하기,
// 식을 휴대폰 너비에 맞추어 그리기, 음수 쪽까지 있는 수직선, 수 고르기, 값 하나를 답하는 문항, 풀이 글, 참·거짓을 가리는 문장.
// 처음에 7-1-2(정수와 유리수) 단원 파일 안에 지었던 것을 옮겨 왔다. 단원 파일은 `const { Q, tx, V, ex, … } = B.kit.mid;` 로 꺼내 쓴다.
// engine.js·geometry.js 다음, 단원 파일들 앞에 읽힌다(index.html 과 tools/question-bank·tests 의 불러오는 줄).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, frac, lines, numbers, N, M, C, F, D } = B.kit;
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
  // 그림 설명에는 점마다 0에서 어느 쪽으로 몇 칸 간 곳인지 적는다(검사와 화면 읽기가 그 글로 수를 읽는다).
  function nline(lo, hi, o) {
    const opt = o || {}, parts = opt.parts || 1, span = hi - lo, u = Math.min(30, 288 / span), left = 20, x = (v) => left + (v - lo) * u;
    const moves = opt.moves || [], points = opt.points || [], labelled = moves.some((m) => m.label), gap = labelled ? 25 : 16;
    const y = moves.length ? 10 + moves.length * gap + (labelled ? 4 : 0) : points.length ? 26 : 10, width = left * 2 + span * u, height = y + 27;
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
    const steps = (v) => Math.abs(v.p) * parts / v.q + '칸', side = (v) => (v.p > 0 ? '오른쪽' : '왼쪽');
    const where = (v) => (v.p === 0 ? '0이 적힌 눈금' : `0에서 ${side(v)}으로 ${parts > 1 ? '작은 눈금 ' : ''}${steps(v)} 간 곳`);
    const said = `수직선: ${text(lo)}부터 ${text(hi)}까지 정수마다 눈금이 있다` + (parts > 1 ? `. 1을 똑같이 ${parts}칸으로 나눈 작은 눈금이 있다` : '') + '. '
      + (labels.length === span + 1 ? '정수 눈금마다 수를 적었다' : `수를 적은 눈금은 ${labels.map(text).join(', ')}`) + '.'
      + points.map((p) => ` 점 ${p.name}: ${where(p.at)}.`).join('')
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
  //  o.ticks: 'all'(기본, 정수 눈금마다 수) · 'none'(O, x, y 만) · 수의 배열(두 축에 적을 수). o.grid: false 이면 모눈을 긋지 않는다. o.say: 그림 설명에 덧붙일 말.
  // 그림 설명: 점은 원점에서 간 칸 수로, 직선은 「오른쪽으로 1칸 갈 때 위로 몇 칸」으로, 곡선은 지나는 모눈 점으로 적는다(검사와 화면 읽기가 이 글로 그림을 읽는다).
  function plane(o) {
    const opt = o || {}, [xlo, xhi] = opt.x || [-5, 5], [ylo, yhi] = opt.y || [-5, 5];
    const u = Math.min(24, 260 / (xhi - xlo)), padL = 16, padR = 26, padT = 24, padB = 16, W = padL + padR + (xhi - xlo) * u, H = padT + padB + (yhi - ylo) * u;
    const X = (v) => f1(padL + (v - xlo) * u), Y = (v) => f1(padT + (yhi - v) * u);
    // 원점의 이름 O 는 왼쪽 아래에 적는다. 오른쪽 위로 올라가는 직선이 그 자리를 지나면 오른쪽 아래에 적는다.
    const oSide = (opt.lines || []).length && num(opt.lines[0].a) > 0 ? 1 : -1;
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
      const a = num(line.a), color = COLORS[k % COLORS.length];
      // 상자 안에 드는 구간
      let lo = xlo, hi = xhi;
      if (a !== 0) { const p = ylo / a, q = yhi / a; lo = Math.max(lo, Math.min(p, q)); hi = Math.min(hi, Math.max(p, q)); }
      out += `<line x1="${X(lo)}" y1="${Y(a * lo)}" x2="${X(hi)}" y2="${Y(a * hi)}" style="stroke:${color};stroke-width:1.8"/>`;
      if (line.name) out += `<text x="${X(hi) + (a < 0 ? 4 : -4)}" y="${Y(a * hi) + (a < 0 ? 13 : -5)}" text-anchor="${a < 0 ? 'start' : 'end'}" style="font-size:12px;font-weight:700;fill:${color}">${line.name}</text>`;
      const q = asQ(line.a);
      said.push(`직선${line.name ? ' ' + line.name : ''}: 원점을 지나고, 오른쪽으로 ${q.q}칸 갈 때 ${q.p < 0 ? '아래쪽' : '위쪽'}으로 ${Math.abs(q.p)}칸 간다.`);
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

  B.kit.mid = {
    LAB, MINUS, GT, LT, GE, LE, range, gcd, lcm, Q, dc, dc2, plainQ, qadd, qsub, qmul, qdiv, keepD, qneg, qabs, qpow, qcmp, isInt, fl, asDec, U, mag, tx,
    sx, px, digits, nb, isFrac, glue, plain, tail, lastOf, tj, sj, pj, js, V, sup, P, G, W, WN, MN, A, isNum, valT, val, OPS, BR, htmlT, html, inl, jsT,
    jsx, hasP, S, isPow, step, trace, chainOf, flatNums, intsOnly, biggest, emOf, FIT, fit, ex, show, tag, tagged, taggedEx, proc, flow, f1, nline, nz, pm,
    co, fr, distinct, okKind, ansV, valueFacts, CALC, calcQ, pickEx, SAME_ADD, DIFF_ADD, TO_ADD, SAME_MUL, DIFF_MUL, SAME_DIV, DIFF_DIV, BY_RECIP, rawMag,
    uniq, addTold, subTold, mulTold, divTold, commonTold, un, sv, claimQ,
    asQ, mono, poly, lin, linAns, pointAns, whereOnPlane, plane, graph
  };
})(typeof window !== 'undefined' ? window : globalThis);
