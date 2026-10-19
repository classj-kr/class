// 고등학교 1학년 1학기(공통수학1) 3단원 복소수와 이차방정식 — 단원 틀·도구와 앞쪽 묶음
// (복소수의 뜻, 복소수의 사칙연산, i의 거듭제곱, 음수의 제곱근, 복소수의 조건과 z, z̄).
// 수집해 둔 천재 T셀파 공통수학1 두 종(홍진곤·전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록
// (기본꼴_1: 복소수 36꼴, 기본꼴_2: 이차방정식 38꼴, 심화꼴: 2꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/10-1-3/싣기_대조표.md 에 있다.
// (이차방정식의 풀이와 판별식, 판별식으로 정하는 미정계수, 근과 계수의 관계, 두 수를 근으로 하는 이차방정식, 켤레근은 10-1-3b.js 에, 실력 문항은 10-1-3c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 영역은 변화와 관계(방정식과 부등식). 성취기준은 10공수1-02-01(복소수의 뜻과 성질, 사칙연산), 10공수1-02-02(실근과 허근, 판별식), 10공수1-02-03(근과 계수의 관계).
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(식·등식·보기·조건), 묻는 것(값·a + bi·실수부분과 허수부분·고르기·개수), 계산의 얼개(덧셈·곱셈·나눗셈·켤레·거듭제곱·근호)가 다르면 따로 싣는다.
//    같은 꼴에서 수만 바꾼 유형은 만들지 않았다. 계산 문항은 차례(count)마다 계산의 얼개가 다르다.
//  - 교육과정: 이차방정식은 계수가 실수인 것만 다룬다(10공수1-02-02 해설). 복소평면·극형식·절댓값(|z|)은 쓰지 않는다. 「순허수」는 교육과정 용어가 아니어서 「실수부분이 0인 허수」로 적는다.
//  - 답: a + bi 는 「[±][ ] [±][ ]i」 두 칸(둘째 칸의 부호 단추가 더하기·빼기 노릇), 실수부분·허수부분이 분수이면 「[±][ ]/[ ] [±][ ]/[ ] i」(기약분수),
//    근호가 든 허수는 「[±][ ]√[ ] i」 꼴로 받는다. 한 유형의 칸 모양은 씨앗·차례가 바뀌어도 같다(분수가 되는 나눗셈과 정수가 되는 나눗셈은 다른 차례).
//    칸에는 0이나 1도 적게 한다(문제 글에 붙인다). 음수가 될 수 있는 수 칸에는 모두 부호 단추를 단다(개수만 뺀다).
//    음수의 제곱근의 곱·몫처럼 답의 꼴(실수·허수, 근호의 유무)이 씨앗마다 달라지는 꼴은 고르기로 내고, 틀린 보기는 √a√b = √ab 를 그대로 쓴 잘못 같은 실제 잘못으로 만든다.
//  - 원문의 「a + b의 값」「ab의 값」처럼 따로 구한 실수부분·허수부분을 뜻 없이 더하거나 곱하는 꼴은 a + bi 를 칸마다 받는다.
//  - 참·거짓은 손으로 적지 않고 코드로 가린다(수로 셈한 값, 셈한 판별식). 답은 모두 코드가 셈한다. 원문 답지의 잘못(①19 전인태 소단원 평가 정답란 i)은 따르지 않는다.
//  - 검사 근거: 칸마다 글에 보이는 수로 다시 셈하는 식(facts.calc·value)을 단다. 글에 없는 수(약분한 수, i의 거듭제곱 주기 4)는 seal 이 facts.unseen 에 밝히고, 밝히기로 한 수(derived) 밖의 수가 나오면 오류를 낸다.
//
// 뺀 것과 까닭(10-1-3b.js, 10-1-3c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 뒤 단원(공통수학1 Ⅱ-3 이차부등식·연립이차부등식)을 풀어야 하는 꼴: 판별식 조건이 인수분해해 푸는 k의 이차부등식이 되는 것(②10의 홍교 대단원4),
//    두 이차방정식이 모두 허근(실근)을 갖는 범위(②12). 판별식 조건이 k² < c 꼴로만 남는 것(②10, 심2)은 제곱을 견주면 풀리므로 실었다.
//  - 중학교 단원에 이미 있는 일: 원에 내접하는 직사각형의 변의 차(②36 — 9-1-3 곱셈 공식의 변형), 정사각형 안의 정삼각형(②37 — 피타고라스 정리와 근의 공식),
//    실근만 나오는 이차방정식 풀이(②의 머리말 — 9-1-4).
//  - 서술형 전용: 켤레근이 근임을 증명하기(②33 — 같은 사실을 참·거짓 문장으로 ②4 에 실었다), 판별식 부호의 까닭 설명하기(②4 — 참·거짓으로 바꾸어 실었다).
//  - 놀이·활동: 복소수로 (a² + b²)(c² + d²) = m² + n² 찾기(②38 — 답이 하나로 정해지지 않는다).
//  - 겹침(같은 일): 허수단위의 뜻 빈칸(①36 — ①23의 참·거짓), 계산 결과의 실수부분·허수부분(①12의 √2(1 − i) + 4√2(1 + i) — ①9), α, β 둘로 한꺼번에 사칙계산(①11의 변형 — ①9~11),
//    두 복소수의 곱의 식의 값(①16의 홍중간19 — ①10), 근호가 든 분수의 이차식(①16의 전중기08 — ①16의 둘째 차례), 근호 계수의 덧셈(①9의 변형 — ①9).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, numbers, N, M, C, inline } = B.kit;
  const { MINUS, gcd, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, mag, tx, nb: nb0, tail, V, sup, tag, fit, nz, ansV, asQ, mono, rt, sqParts, claimQ } = B.kit.mid;

  // ── 긴 식의 줄 바꿈 ──
  // 붙여 쓴 식(white-space:nowrap)이 길면 360px 화면에서 문항 밖으로 넘친다(긴 판별식·전개식·풀이의 등식 사슬).
  // 긴 식은 겉에 드러난 관계 기호(=, <, > …) 앞에서, 그 조각도 길면 괄호 밖의 +, − 앞에서 줄이 갈릴 수 있게 조각마다 붙여 둔다.
  // 짧은 식은 통째로 붙여 둔다(줄 끝에 「x」만 남지 않게). 글자와 빈칸은 그대로라 글로 읽은 식과 토씨는 바뀌지 않는다.
  const NBO = '<span style="white-space:nowrap">';
  const plainLen = (h) => String(h).replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<span style="position:absolute[^"]*">[^<]*<\/span>/g, '').replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, '<').length;
  const cutAt = (h, marks) => {
    const parts = [];
    let depth = 0, last = 0;
    for (let i = 0; i < h.length;) {
      if (h[i] === '<') {
        const j = h.indexOf('>', i), t = h.slice(i, j + 1);
        if (t[1] === '/') depth -= 1; else if (!/\/>$/.test(t) && !/^<(br|img|hr|input|wbr)\b/i.test(t)) depth += 1;
        i = j + 1; continue;
      }
      if ('({['.includes(h[i])) depth += 1; else if (')}]'.includes(h[i])) depth -= 1;
      // 앞서 나눠 붙인 식(빈칸 뒤의 조각이 기호로 시작한다)은 그 빈칸에서도 나눈다.
      const m = depth === 0 && i > last ? marks.find((s) => h.startsWith(s, i) || h.startsWith(' ' + NBO + s.slice(1), i)) : null;
      if (m) { parts.push(h.slice(last, i)); last = i + 1; i += 1; continue; }
      i += 1;
    }
    parts.push(h.slice(last));
    return parts;
  };
  const REL_MARKS = [' = ', ' &lt; ', ' &gt; ', ' ≤ ', ' ≥ ', ' ≠ '], OP_MARKS = [' + ', ' ' + MINUS + ' '];
  const nb = (h) => {
    const s = String(h);
    if (plainLen(s) <= 20) return nb0(s);
    const pieces = cutAt(s, REL_MARKS).flatMap((p) => (plainLen(p) > 24 ? cutAt(p, OP_MARKS) : [p]));
    return pieces.length < 2 ? nb0(s) : pieces.map(nb0).join(' ');
  };
  const STD1 = '10공수1-02-01', STD2 = '10공수1-02-02', STD3 = '10공수1-02-03', UNIT = '10-1-3';
  const HAN = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ'];

  // ── 검사 근거 마무리 ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  // 문항에서 보이는 수(검사와 같은 방법으로 읽는다): 글·그림(그림 설명 포함)·보기
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(facts.derived)가 아닌 수가 나오면 오류를 낸다(식을 잘못 적은 것).
  function seal(item) {
    const f0 = item.facts || {};
    // 0 에 음수를 곱한 −0 은 답 0 과 같지 않게 보이므로 식 끝에 +0 을 붙인다.
    if (f0.calc) f0.calc = f0.calc.map(([t, i]) => [/\+0$/.test(t) ? t : '(' + t + ')+0', i]);
    if (f0.value !== undefined && !/\+0$/.test(f0.value)) f0.value = '(' + f0.value + ')+0';
    const f = f0, derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], (f.choose && f.choose.exprs) || [], f.pick ? [f.pick.expr] : []);
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
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 수와 글 ──
  const iq = (n) => tx(Q(n));
  const sT = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                      // 검사 식에 적는 정수
  const jq = (q) => (q.q === 1 ? jn(q.p) : '(' + q.p + '/' + q.q + ')');      // 검사 식에 적는 유리수
  const I = V('i'), X = V('x'), X2 = V('x') + sup(2), Z = V('z');
  const va = V('a'), vb = V('b'), vc = V('c'), vk = V('k'), vm = V('m'), vx = V('x'), vy = V('y');
  const AL = 'α', BE = 'β', OM = 'ω';
  // 앞 항 뒤에 이어 적는 항들: 「 + 3x − 5」
  const moreH = (terms) => terms.map(([c, v]) => [asQ(c), v]).filter(([c]) => c.p !== 0).map(([c, v]) => (c.p < 0 ? ' ' + MINUS + ' ' : ' + ') + mono(qabs(c), v)).join('');
  // 항들을 이어 적은 식(맨 앞 항의 +는 적지 않는다, 모두 0이면 0)
  const sumH = (terms) => { const live = terms.map(([c, v]) => [asQ(c), v]).filter(([c]) => c.p !== 0); if (!live.length) return '0'; const [c0, v0] = live[0]; return nb((c0.p < 0 ? MINUS : '') + mono(qabs(c0), v0) + moreH(live.slice(1))); };
  const SR = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
  // 켤레복소수의 기호: 식 위에 가로줄을 긋는다(글자 그대로의 윗줄은 읽기 글꼴에서 어긋나므로 작은 그림으로). 글로 옮기면 「…의 켤레복소수」가 남는다.
  const bar = (h) => '<span style="position:relative;display:inline-block;padding-top:0.32em;line-height:1.12;white-space:nowrap">' + h
    + '<svg class="mb-inline" aria-hidden="true" viewBox="0 0 10 4" preserveAspectRatio="none" style="position:absolute;left:0.06em;top:0.06em;width:calc(100% - 0.12em);height:0.36em;overflow:visible"><path d="M0 2H10" style="fill:none;stroke:currentColor;stroke-width:1;vector-effect:non-scaling-stroke"/></svg>'
    + '<span style="' + SR + '">의 켤레복소수</span></span>';
  const ZB = bar(Z);
  const ZBAR_NOTE = `(단, ${ZB}는 ${Z}의 켤레복소수이다.)`;
  const BAR_NOTE = ' (단, 식 위의 가로줄은 켤레복소수를 나타낸다.)';

  // 식 뒤의 토씨: 식을 읽을 때 끝나는 소리에 맞춘다(제곱으로 끝나면 받침, 분수는 분자, 근호는 근호 안의 수, 수는 그 수, i·x 는 받침 없음, m·n 은 받침, 켤레복소수 기호는 「켤레복소수」).
  // 읽는 글은 검사(tests/math-bank-units.test.cjs 의 tight)와 같은 방법으로 만든다: 분수는 분자만, 위첨자는 「제곱」, 글줄 속 작은 그림은 지운다.
  function spanEnd(html, from) { const re = /<span\b[^>]*>|<\/span>/g; re.lastIndex = from; let depth = 0, m; while ((m = re.exec(html))) { if (m[0][1] === '/') { depth -= 1; if (depth === 0) return m.index + m[0].length; } else depth += 1; } return -1; }
  function readOf(html) {
    let out = String(html || ''), at;
    const mark = '<span class="mb-frac-bar">/</span>';
    while ((at = out.indexOf(mark)) >= 0) { const end = spanEnd(out, at + mark.length); if (end < 0) break; out = out.slice(0, at) + out.slice(end); }
    return out.replace(/<svg\b[^>]*class="mb-inline"[\s\S]*?<\/svg>/g, '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/g, '제곱')
      .replace(/<[^>]+>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  }
  function endJ(h, pair) {
    const [withB, without] = pair.split('/'), t = readOf(h).replace(/[\s)\]}]+$/g, ''), ch = t[t.length - 1];
    if (/제곱$/.test(t)) return pair === '으로/로' ? '으로' : withB;
    if (/\d/.test(ch)) return tail(Number(ch), pair);
    if (/[가-힣]/.test(ch)) return josa(ch, pair).slice(1);
    if (/[mnlr]/.test(ch)) return pair === '으로/로' ? (ch === 'l' ? '로' : '으로') : withB;
    return pair === '으로/로' ? '로' : without;
  }
  const ej = (h, pair) => h + endJ(h, pair);

  // ── 식의 너비 어림과 그리기(휴대폰 너비에 맞게 글씨를 줄인다) ──
  function emW(h) {
    const s = String(h); let pos = 0;
    const textW = (t) => { let w = 0; for (const ch of t.replace(/&[a-z]+;/g, 'o')) w += ch === ' ' ? 0.28 : /[가-힣㉠-㉯㈎-㈑]/.test(ch) ? 1.02 : /[(){}[\]|]/.test(ch) ? 0.38 : /[−+=±×÷<>≤≥⋯]/.test(ch) ? 0.8 : 0.6; return w; };
    function inside() {
      let w = 0;
      while (pos < s.length) {
        if (s.startsWith('</', pos)) { pos = s.indexOf('>', pos) + 1; return w; }
        if (s[pos] === '<') {
          const end = s.indexOf('>', pos), tagText = s.slice(pos, end + 1); pos = end + 1;
          if (/\/>$/.test(tagText) || /^<br/i.test(tagText)) continue;
          const name = (tagText.match(/^<([a-z0-9]+)/i) || [, ''])[1].toLowerCase();
          if (name === 'svg') { pos = s.indexOf('</svg>', pos) + 6; w += /class="mb-inline"[^>]*position:absolute/.test(tagText) ? 0 : 0.62; continue; }
          if (/class="mb-frac"/.test(tagText)) {
            const parts = [];
            while (pos < s.length && !s.startsWith('</', pos)) { if (s[pos] === '<') { pos = s.indexOf('>', pos) + 1; parts.push(inside()); } else pos += 1; }
            pos = s.indexOf('>', pos) + 1;
            w += Math.max(parts[0] || 0, parts[2] || 0) + 0.3; continue;
          }
          const inner = inside();
          if (/mb-sr|mb-frac-bar|position:absolute;width:1px/.test(tagText)) continue;
          if (name === 'sup' || name === 'sub') { w += inner * 0.65; continue; }
          w += inner; continue;
        }
        const next = s.indexOf('<', pos), chunk = s.slice(pos, next < 0 ? s.length : next); pos = next < 0 ? s.length : next; w += textW(chunk);
      }
      return w;
    }
    return inside();
  }
  const exq = (h) => '<span class="mb-expr"' + fit(1.07 * emW(h) + 0.3) + '>' + h + '</span>';
  // 이름표(ㄱ. ㄴ. …)를 붙인 여러 줄
  const tagRows = (list, tags) => { const style = fit(1.07 * Math.max(...list.map(emW)) + 2.9); return lines(list.map((h, i) => tag((tags || HAN.map((x) => x + '.'))[i]) + '<span class="mb-expr"' + style + '>' + h + '</span>')); };

  // ── 복소수(실수부분과 허수부분이 유리수) ──
  const cz = (r, m) => ({ r: asQ(r), m: asQ(m || 0) });
  const cadd = (u, w) => cz(qadd(u.r, w.r), qadd(u.m, w.m));
  const csub = (u, w) => cz(qsub(u.r, w.r), qsub(u.m, w.m));
  const cmul = (u, w) => cz(qsub(qmul(u.r, w.r), qmul(u.m, w.m)), qadd(qmul(u.r, w.m), qmul(u.m, w.r)));
  const cconj = (u) => cz(u.r, qneg(u.m));
  const cnorm = (u) => qadd(qmul(u.r, u.r), qmul(u.m, u.m));
  const cdiv = (u, w) => { const n = cnorm(w), t = cmul(u, cconj(w)); return cz(qdiv(t.r, n), qdiv(t.m, n)); };
  const cpow = (u, n) => { let out = cz(1, 0); for (let i = 0; i < n; i += 1) out = cmul(out, u); return out; };
  const ceq = (u, w) => qcmp(u.r, w.r) === 0 && qcmp(u.m, w.m) === 0;
  const cint = (u) => isInt(u.r) && isInt(u.m);
  const ipow = (n) => [cz(1, 0), cz(0, 1), cz(-1, 0), cz(0, -1)][((n % 4) + 4) % 4];
  const czero = (u) => u.r.p === 0 && u.m.p === 0;
  // 허수부분의 글: |b|i (1이면 i 만)
  const imT = (q) => { const a = qabs(q); return a.p === 1 && a.q === 1 ? I : mag(a) + I; };
  // a + bi 의 글(0인 부분은 적지 않는다)
  function cxH(u) {
    if (u.m.p === 0) return tx(u.r);
    if (u.r.p === 0) return nb((u.m.p < 0 ? MINUS : '') + imT(u.m));
    return nb(tx(u.r) + (u.m.p < 0 ? ' ' + MINUS + ' ' : ' + ') + imT(u.m));
  }
  // 곱하거나 빼는 자리에 놓을 때 괄호에 넣는다(양의 실수, 양의 허수 bi 는 그대로)
  const cxP = (u) => ((u.m.p !== 0 && u.r.p !== 0) || u.r.p < 0 || u.m.p < 0 ? '(' + cxH(u) + ')' : cxH(u));
  // 정수 복소수를 적을 때 쓰는 짧은 이름
  const zi = (a, b) => cz(a, b);
  // 실수이거나 bi 꼴인 수들을 부호로 이어 적는다: 2i − 4 − 8i + 16
  const joinC = (list) => list.map((u, i) => { const neg = u.r.p < 0 || (u.r.p === 0 && u.m.p < 0), h = cxH(neg ? cz(qneg(u.r), qneg(u.m)) : u); return i === 0 ? (neg ? MINUS : '') + h : (neg ? ' ' + MINUS + ' ' : ' + ') + h; }).join('');

  // ── 답 칸 ──
  const NOTE01 = ' <span style="white-space:nowrap">(단, 0이나 1도 칸에 적는다.)</span>';
  const NOTEF = ' <span style="white-space:nowrap">(단, 분수는 기약분수로 적는다.)</span>';
  const ABI = nb(va + ' + ' + vb + I);
  const CALC_ABI = `다음을 계산하여 ${ABI}(${va}, ${vb}는 실수) 꼴로 나타내시오.`;
  // 답이 a + bi(a, b 정수): 「[±][ ] [±][ ]i」. calc: [실수부분을 셈하는 식, 허수부분을 셈하는 식]
  function cxAns(text, u, o) {
    if (!cint(u) || Math.abs(u.r.p) > 9999 || Math.abs(u.m.p) > 9999) throw new Error('a + bi 칸: 실수부분과 허수부분이 정수여야 한다');
    const opt = o || {};
    return inline(text + NOTE01, '{0} {1}' + I, [{ answer: u.r.p, signed: true }, { answer: u.m.p, signed: true }], Object.assign({}, opt, {
      shown: cxH(u), facts: Object.assign({ calc: [[opt.calc[0], 0], [opt.calc[1], 1]], derived: opt.derived || [] }, opt.facts || {})
    }));
  }
  // 답이 a + bi(a, b 가 정수가 아닌 분수): 「[±][ ]/[ ] [±][ ]/[ ] i」. calc: [a의 분자, a의 분모, b의 분자, b의 분모]를 셈하는 식
  function cxFracAns(text, u, o) {
    if (isInt(u.r) || isInt(u.m)) throw new Error('분수 a + bi 칸: 실수부분과 허수부분이 모두 정수가 아니어야 한다');
    const opt = o || {};
    return inline(text + NOTEF, frac('{0}', '{1}') + ' ' + frac('{2}', '{3}') + I, [{ answer: u.r.p, signed: true }, { answer: u.r.q }, { answer: u.m.p, signed: true }, { answer: u.m.q }], Object.assign({}, opt, {
      shown: cxH(u), facts: Object.assign({ calc: opt.calc.map((t, i) => [t, i]), derived: opt.derived || [] }, opt.facts || {})
    }));
  }
  // 답이 (k/m)i(정수가 아닌 분수): 「[±][ ]/[ ] i」
  function imFracAns(text, q, o) {
    if (isInt(q)) throw new Error('분수 허수 칸: 정수가 아니어야 한다');
    const opt = o || {};
    return inline(text + NOTEF, frac('{0}', '{1}') + I, [{ answer: q.p, signed: true }, { answer: q.q }], Object.assign({}, opt, {
      shown: nb((q.p < 0 ? MINUS : '') + mag(qabs(q)) + I), facts: Object.assign({ calc: opt.calc.map((t, i) => [t, i]), derived: opt.derived || [] }, opt.facts || {})
    }));
  }
  // 답이 k√t i(k 는 0이 아닌 정수, t 는 제곱인 수를 인수로 갖지 않는 2 이상의 수): 「[±][ ]√[ ] i」
  function radImAns(text, k, t, o) {
    if (!Number.isInteger(k) || k === 0 || t < 2 || sqParts(t)[0] !== 1) throw new Error('근호 허수 칸');
    const opt = o || {};
    return inline(text + NOTE01, '{0}' + rt('{1}') + I, [{ answer: k, signed: true }, { answer: t }], Object.assign({}, opt, {
      shown: nb((k < 0 ? MINUS : '') + (Math.abs(k) === 1 ? '' : Math.abs(k)) + rt(t) + I), facts: Object.assign({ calc: opt.calc.map((s, i) => [s, i]), derived: opt.derived || [] }, opt.facts || {})
    }));
  }
  // 수 여럿을 답하는 문항: 칸 앞에 「a =」를 적는다.
  const valsQ = (text, pairs, o) => M(text, pairs.map(([n, v, sign]) => ({ answer: v, signed: sign !== false, lead: (n.startsWith('<') ? n : V(n)) + ' =' })), Object.assign({}, o, { shown: pairs.map(([n, v]) => nb(`${n.startsWith('<') ? n : V(n)} = ${iq(v)}`)).join(', ') }));
  // 옳은 것 하나와 나머지를 섞는다. 보기는 [글, 옳은가]이다. 보기가 겹치거나 옳은 보기가 하나가 아니면 null(다시 만든다).
  function choose(d, text, rows, o) {
    const list = d.shuffle(rows), opt = o || {};
    if (new Set(list.map((r) => stripH(r[0]))).size !== list.length || list.filter((r) => r[1]).length !== 1) return null;
    return C(text, list.map((r) => r[0]), list.findIndex((r) => r[1]), Object.assign({}, opt, { facts: Object.assign({ truth: list.map((r) => r[1]), want: true }, opt.facts || {}) }));
  }
  // 「옳은 것만을 있는 대로 고른 것」: 보기 ㄱ, ㄴ, ㄷ …의 참·거짓(flags)으로 고르기 보기를 만든다.
  function pickSets(d, text, rows, o) {
    const flags = rows.map((r) => r[1]), labels = HAN.slice(0, rows.length), right = labels.filter((_, i) => flags[i]);
    if (!right.length || right.length === rows.length) return null;
    const cand = [];
    for (let i = 0; i < rows.length; i += 1) { const s = labels.filter((_, j) => (j === i ? !flags[j] : flags[j])); if (s.length) cand.push(s); }
    for (const s of [labels.slice(), [labels[0]], [labels[1]], [labels[rows.length - 1]]]) if (!cand.some((c) => c.join() === s.join()) && s.join() !== right.join()) cand.push(s);
    const opts = d.shuffle(d.shuffle(cand).slice(0, 4).concat([right]));
    const opt = o || {};
    return C(text, opts.map((s) => s.join(', ')), opts.indexOf(right), Object.assign({}, opt, { figure: opt.figure || tagRows(rows.map((r) => r[0])), facts: Object.assign({ sets: { labels, flags, options: opts.map((s) => s.slice()) } }, opt.facts || {}) }));
  }

  // ── 풀이 글: 두 복소수의 곱을 전개한 줄 ──
  function mulTold(u, w) {
    const ac = qmul(u.r, w.r), ad = qmul(u.r, w.m), bc = qmul(u.m, w.r), bd = qmul(u.m, w.m), v = cmul(u, w);
    const sq = I + sup(2);
    const parts = sumH([[ac, ''], [ad, I], [bc, I], [bd, sq]]);
    return `${cxP(u)}${cxP(w)} = ${parts} = ${cxH(v)}`;
  }

  // ── 다항식(계수의 배열, 차수 차례) — 10-1-3b·c 도 쓴다 ──
  const trimP = (p) => { const out = p.map(asQ); while (out.length > 1 && out[out.length - 1].p === 0) out.pop(); return out; };
  const P = (...cs) => trimP(cs);
  const VX = ['', X, X2];
  const polyH = (p, v) => { const x = v || X, vx2 = x + sup(2); return sumH(trimP(p).map((c, i) => [c, ['', x, vx2][i]]).reverse()); };

  B.kit.m1013 = {
    STD1, STD2, STD3, UNIT, HAN, stripH, seal, retry, T, H, iq, sT, jn, jq, I, X, X2, Z, ZB, ZBAR_NOTE, va, vb, vc, vk, vm, vx, vy, AL, BE, OM, moreH, sumH, bar, endJ, ej, emW, exq, tagRows,
    cz, cadd, csub, cmul, cconj, cnorm, cdiv, cpow, ceq, cint, ipow, czero, imT, cxH, cxP, NOTE01, NOTEF, ABI, CALC_ABI, cxAns, cxFracAns, imFracAns, radImAns, valsQ, choose, pickSets, mulTold,
    trimP, P, VX, polyH, nb
  };

  // ── 단원 틀 ──
  B.addUnit({
    id: '10-1-3', grade: 10, semester: 1, no: 3, title: '복소수와 이차방정식', version: 1,
    groups: [
      { id: 'cx', title: '복소수의 뜻', standard: STD1, types: [] },
      { id: 'calc', title: '복소수의 사칙연산', standard: STD1, types: [] },
      { id: 'pow', title: 'i의 거듭제곱', standard: STD1, types: [] },
      { id: 'neg', title: '음수의 제곱근', standard: STD1, types: [] },
      { id: 'cond', title: '복소수의 조건과 켤레복소수', standard: STD1, types: [] },
      { id: 'disc', title: '이차방정식의 근의 판별', standard: STD2, types: [] },
      { id: 'kval', title: '판별식으로 미정계수 정하기', standard: STD2, types: [] },
      { id: 'vieta', title: '근과 계수의 관계와 식의 값', standard: STD3, types: [] },
      { id: 'coef', title: '근과 계수의 관계로 계수와 근 구하기', standard: STD3, types: [] },
      { id: 'make', title: '두 수를 근으로 하는 이차방정식', standard: STD3, types: [] },
      { id: 'conj', title: '켤레근과 잘못 보고 푼 이차방정식', standard: STD3, types: [] }
    ]
  });

  // ── 실수·허수를 가르는 데 쓰는 수: [글, 실수인가, 까닭] ──
  function numberPool(d) {
    const s = d.pick([2, 3, 5, 6, 7]), s2 = d.pick([2, 3, 5, 7].filter((v) => v !== s)), a = d.int(1, 9), b = d.int(2, 9), e = d.int(2, 9), m = d.pick([3, 4, 5, 7]), k = d.int(2, 9), c = d.int(2, 9);
    const real = d.shuffle([
      [nb(I + sup(2)), `${I}${sup(2)} = ${MINUS}1은 실수`],
      [nb(I + sup(4)), `${I}${sup(4)} = 1은 실수`],
      ['0', '0은 실수'],
      [rt(s), `${ej(rt(s), '은/는')} 실수`],
      [rt(`(${MINUS}${e})${sup(2)}`), `${rt(`(${MINUS}${e})${sup(2)}`)} = ${ej(String(e), '은/는')} 실수`],
      [frac(`${a} + ${rt(s2)}`, m), `${frac(`${a} + ${rt(s2)}`, m)}${tail(s2, '은/는')} 허수부분이 0인 실수`],
      [iq(-k), `${ej(iq(-k), '은/는')} 실수`]
    ]);
    const imag = d.shuffle([
      [nb(b + I), `${ej(nb(b + I), '은/는')} 허수`],
      [nb(c + ' ' + MINUS + ' ' + b + I), `${ej(nb(c + ' ' + MINUS + ' ' + b + I), '은/는')} 허수`],
      [rt(MINUS + s), `${rt(MINUS + s)} = ${ej(nb(rt(s) + I), '은/는')} 허수`],
      [nb(MINUS + I), `${MINUS}${I}는 허수`],
      [nb(I + sup(3)), `${I}${sup(3)} = ${MINUS}${I}는 허수`],
      [nb(frac(1, b) + I), `${ej(nb(frac(1, b) + I), '은/는')} 허수`]
    ]);
    return { real, imag };
  }

  // ── 복소수의 뜻 ──
  B.addTypes(UNIT, 'cx', [
    T('cx-parts', '실수부분과 허수부분', '①1', (d) => {
      const kind = d.int(0, 3), a = nz(d, -9, 9), b = d.int(2, 9);
      let h, re, im, why;
      if (kind === 0) { re = a; im = -b; h = cxH(zi(re, im)); why = `${h} = ${iq(re)} + (${MINUS}${b})${I}이므로 허수부분은 ${MINUS}${b}${I}가 아니라 ${MINUS}${b}이다.`; }
      else if (kind === 1) { re = 0; im = a; h = cxH(zi(0, a)); why = `${h} = 0 + ${a < 0 ? '(' + iq(a) + ')' : a}${I}이므로 실수부분은 0이다.`; }
      else if (kind === 2) { re = a; im = (d.bool() ? 1 : -1) * b; h = nb((im < 0 ? MINUS : '') + b + I + (a < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(a)); why = `순서를 바꾸어 ${ABI} 꼴로 적으면 ${cxH(zi(re, im))}이다.`; }
      else { re = a; im = 0; h = iq(a); why = `실수 ${h}${endJ(h, '은/는')} ${h} + 0${I}이므로 허수부분은 0이다.`; }
      return M(`복소수 ${h}의 실수부분과 허수부분은?`, [{ label: '실수부분', answer: re, signed: true }, { label: '허수부분', answer: im, signed: true }], {
        shown: `실수부분 ${iq(re)}, 허수부분 ${iq(im)}`,
        explain: `복소수를 ${ABI}(${va}, ${vb}는 실수) 꼴로 나타내었을 때 ${va}가 실수부분, ${vb}가 허수부분이다. ${why}`,
        facts: { calc: [[jn(re), 0], [jn(im), 1]] }
      });
    }),
    T('cx-sort', '실수와 허수로 가르기', '①2', (d, n) => {
      const { real, imag } = numberPool(d);
      if (n === 0) {
        const r = d.int(2, 4), rows = d.shuffle(real.slice(0, r).map((x) => [x, true]).concat(imag.slice(0, 6 - r).map((x) => [x, false])));
        const flags = rows.map((x) => !x[1]);
        return N('다음 수 가운데 허수는 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: numbers(rows.map((x) => x[0][0])),
          explain: `실수가 아닌 복소수가 허수이다. ${rows.filter((x) => !x[1]).map((x) => x[0][1]).join(', ')}이고 나머지는 실수이므로 허수는 ${flags.filter(Boolean).length}개이다.`,
          facts: { count: flags }
        });
      }
      const r = d.int(2, 3), rows = d.shuffle(real.slice(0, r).map((x) => [x, true]).concat(imag.slice(0, 5 - r).map((x) => [x, false])));
      return pickSets(d, '다음 보기 가운데 실수만을 있는 대로 고른 것은?', rows.map((x) => [x[0][0], x[1]]), {
        explain: `${rows.filter((x) => x[1]).map((x) => x[0][1]).join(', ')}이다. ${rows.filter((x) => !x[1]).map((x) => x[0][1]).join(', ')}이다.`
      });
    }, { count: 2 }),
    T('cx-selfconj', 'z = z̄를 만족시키는 복소수의 개수', '①3', (d) => {
      const { real, imag } = numberPool(d);
      const r = d.int(2, 4), rows = d.shuffle(real.slice(0, r).map((x) => [x, true]).concat(imag.slice(0, 6 - r).map((x) => [x, false])));
      const flags = rows.map((x) => x[1]);
      return N(`다음 복소수 ${Z} 가운데 ${nb(Z + ' = ' + ZB)}를 만족시키는 것은 모두 몇 개인가? ${ZBAR_NOTE}`, flags.filter(Boolean).length, {
        unit: '개', figure: numbers(rows.map((x) => x[0][0])),
        explain: `${nb(Z + ' = ' + va + ' + ' + vb + I)}(${va}, ${vb}는 실수)라 하면 ${nb(ZB + ' = ' + va + ' ' + MINUS + ' ' + vb + I)}이므로 ${nb(Z + ' = ' + ZB)}에서 ${nb(vb + ' = 0')}, 곧 ${Z}는 실수이다. 실수는 ${rows.filter((x) => x[1]).map((x) => x[0][0]).join(', ')}의 ${flags.filter(Boolean).length}개이다.`,
        facts: { count: flags }
      });
    }),
    T('cx-eq-simple', '복소수가 서로 같을 조건', '①4', (d, n) => {
      if (n === 0) {
        // (x + p) + (y + q)i = a + bi
        const p = nz(d, -6, 6), q = nz(d, -6, 6), a = nz(d, -9, 9), b = nz(d, -9, 9), x = a - p, y = b - q;
        if (x === 0 || y === 0) return null;
        const L = nb(`(${vx}${moreH([[p, '']])}) + (${vy}${moreH([[q, '']])})${I}`);
        return valsQ(`등식 ${ej(L + ' = ' + cxH(zi(a, b)), '을/를')} 만족시키는 실수 ${vx}, ${vy}의 값은?`, [['x', x], ['y', y]], {
          explain: `${vx}, ${vy}가 실수이므로 ${nb(vx + moreH([[p, '']]))}, ${nb(vy + moreH([[q, '']]))}도 실수이다. 실수부분끼리, 허수부분끼리 같으므로 ${nb(vx + moreH([[p, '']]) + ' = ' + iq(a))}, ${nb(vy + moreH([[q, '']]) + ' = ' + iq(b))}에서 ${nb(vx + ' = ' + iq(x))}, ${nb(vy + ' = ' + iq(y))}이다.`,
          facts: { calc: [[`${jn(a)}-${jn(p)}`, 0], [`${jn(b)}-${jn(q)}`, 1]] }
        });
      }
      if (d.bool()) {
        // px + qi = c + yi
        const p = d.int(2, 5) * (d.bool() ? 1 : -1), x = nz(d, -6, 6), q = nz(d, -9, 9), c = p * x;
        const L = nb(`${p < 0 ? MINUS : ''}${Math.abs(p)}${vx}${q < 0 ? ' ' + MINUS + ' ' : ' + '}${Math.abs(q) === 1 ? '' : Math.abs(q)}${I}`), R = nb(`${iq(c)} + ${vy}${I}`);
        return valsQ(`등식 ${ej(L + ' = ' + R, '을/를')} 만족시키는 실수 ${vx}, ${vy}의 값은?`, [['x', x], ['y', q]], {
          explain: `실수부분끼리 같으므로 ${nb(sT(p) + vx + ' = ' + iq(c))}에서 ${nb(vx + ' = ' + iq(x))}, 허수부분끼리 같으므로 ${nb(vy + ' = ' + iq(q))}이다.`,
          facts: { calc: [[`${jn(c)}/${jn(p)}`, 0], [jn(q), 1]] }
        });
      }
      // a + xi = y + bi (양쪽의 자리를 바꾸어 적은 꼴)
      const a = nz(d, -9, 9), b = nz(d, -9, 9);
      const L = nb(`${iq(a)} + ${vx}${I}`), R = nb(`${vy}${b < 0 ? ' ' + MINUS + ' ' : ' + '}${Math.abs(b) === 1 ? '' : Math.abs(b)}${I}`);
      return valsQ(`등식 ${ej(L + ' = ' + R, '을/를')} 만족시키는 실수 ${vx}, ${vy}의 값은?`, [['x', b], ['y', a]], {
        explain: `좌변의 실수부분은 ${iq(a)}, 허수부분은 ${vx}이고, 우변의 실수부분은 ${vy}, 허수부분은 ${iq(b)}이다. 따라서 ${nb(vx + ' = ' + iq(b))}, ${nb(vy + ' = ' + iq(a))}이다.`,
        facts: { calc: [[jn(b), 0], [jn(a), 1]] }
      });
    }, { count: 2 }),
    T('cx-eq-sys', '같을 조건에서 연립방정식 풀기', '①5', (d) => {
      const al = nz(d, -3, 3), be = nz(d, -3, 3), ga = nz(d, -3, 3), de = nz(d, -3, 3), det = al * de - be * ga, x = nz(d, -5, 5), y = nz(d, -5, 5), e = d.bool() ? 0 : nz(d, -6, 6);
      if (det === 0) return null;
      const c = al * x + be * y, dd = ga * x + de * y + e;
      if (c === 0 || dd === 0) return null;
      const re = sumH([[al, vx], [be, vy]]), im = sumH([[ga, vx], [de, vy], [e, '']]);
      const L = nb(`(${re}) + (${im})${I}`);
      return valsQ(`등식 ${ej(L + ' = ' + cxH(zi(c, dd)), '을/를')} 만족시키는 실수 ${vx}, ${vy}의 값은?`, [['x', x], ['y', y]], {
        explain: `${vx}, ${vy}가 실수이므로 실수부분끼리, 허수부분끼리 같다. ${nb(re + ' = ' + iq(c))}, ${nb(im + ' = ' + iq(dd))}${endJ(iq(dd), '을/를')} 연립하여 풀면 ${nb(vx + ' = ' + iq(x))}, ${nb(vy + ' = ' + iq(y))}이다.`,
        facts: { calc: [[`(${jn(c)}*${jn(de)}-${jn(be)}*(${jn(dd)}-${jn(e)}))/(${jn(al)}*${jn(de)}-${jn(be)}*${jn(ga)})`, 0], [`(${jn(al)}*(${jn(dd)}-${jn(e)})-${jn(ga)}*${jn(c)})/(${jn(al)}*${jn(de)}-${jn(be)}*${jn(ga)})`, 1]] }
      });
    }),
    T('cx-eq-conj', '켤레복소수가 낀 같을 조건', '①6', (d, n) => {
      if (n === 0) {
        // 켤레((a + p) + (b + q)i) = r·b
        const p = nz(d, -6, 6), q = nz(d, -6, 6), r = d.pick([-3, -2, 2, 3]), b = -q, a = r * b - p;
        if (a === 0) return null;
        const inner = nb(`(${va}${moreH([[p, '']])}) + (${vb}${moreH([[q, '']])})${I}`), R = nb(sT(r) + vb);
        return valsQ(`등식 ${ej(bar(inner) + ' = ' + R, '을/를')} 만족시키는 실수 ${va}, ${vb}의 값은? ${BAR_NOTE}`, [['a', a], ['b', b]], {
          explain: `좌변은 ${nb(`(${va}${moreH([[p, '']])}) ${MINUS} (${vb}${moreH([[q, '']])})${I}`)}이고 우변은 실수이므로 ${nb(vb + moreH([[q, '']]) + ' = 0')}, ${nb(va + moreH([[p, '']]) + ' = ' + R)}이다. 따라서 ${nb(vb + ' = ' + iq(b))}, ${nb(va + ' = ' + iq(a))}이다.`,
          facts: { calc: [[`${jn(r)}*(0-${jn(q)})-${jn(p)}`, 0], [`0-${jn(q)}`, 1]] }
        });
      }
      // 켤레((u + vi)a + p + qi) = b + ci
      const u = d.pick([1, -1, 2]), v = d.pick([1, -1, 2, -2]), a = nz(d, -5, 5), p = nz(d, -6, 6), q = nz(d, -6, 6), c = -(v * a + q), b = u * a + p;
      if (c === 0 || b === 0) return null;
      const innerH = nb(`${cxP(zi(u, v))}${va}${p < 0 ? ' ' + MINUS + ' ' : ' + '}${Math.abs(p)}${q < 0 ? ' ' + MINUS + ' ' : ' + '}${Math.abs(q) === 1 ? '' : Math.abs(q)}${I}`);
      const R = nb(`${vb}${c < 0 ? ' ' + MINUS + ' ' : ' + '}${Math.abs(c) === 1 ? '' : Math.abs(c)}${I}`);
      return valsQ(`등식 ${ej(bar(innerH) + ' = ' + R, '을/를')} 만족시키는 실수 ${va}, ${vb}의 값은? ${BAR_NOTE}`, [['a', a], ['b', b]], {
        explain: `${innerH} = ${nb(`(${sumH([[u, va], [p, '']])}) + (${sumH([[v, va], [q, '']])})${I}`)}이므로 그 켤레복소수는 ${nb(`(${sumH([[u, va], [p, '']])}) ${MINUS} (${sumH([[v, va], [q, '']])})${I}`)}이다. 허수부분끼리 같으므로 ${nb(MINUS + '(' + sumH([[v, va], [q, '']]) + ') = ' + iq(c))}에서 ${nb(va + ' = ' + iq(a))}, 실수부분끼리 같으므로 ${nb(vb + ' = ' + sumH([[u, va], [p, '']]) + ' = ' + iq(b))}이다.`,
        facts: { calc: [[`(0-${jn(c)}-${jn(q)})/${jn(v)}`, 0], [`${jn(u)}*(0-${jn(c)}-${jn(q)})/${jn(v)}+${jn(p)}`, 1]] }
      });
    }, { count: 2 }),
    T('cx-eq-expand', '곱을 전개한 뒤 같을 조건', '①7 심1', (d, n) => {
      if (n === 0) {
        // (a + pi)(q + ri) + s(t − bi) = 0
        const p = nz(d, -4, 4), q = nz(d, -4, 4), r = nz(d, -4, 4), s = d.int(2, 5), t = nz(d, -6, 6), num = p * r - s * t;
        if (num % q !== 0) return null;
        const a = num / q, bn = a * r + p * q;
        if (a === 0 || bn % s !== 0 || bn === 0) return null;
        const b = bn / s;
        const L = nb(`(${va}${p < 0 ? ' ' + MINUS + ' ' : ' + '}${Math.abs(p) === 1 ? '' : Math.abs(p)}${I})${cxP(zi(q, r))} + ${s}(${iq(t)} ${MINUS} ${vb}${I})`);
        return valsQ(`등식 ${ej(L + ' = 0', '이/가')} 성립할 때, 실수 ${va}, ${vb}의 값은?`, [['a', a], ['b', b]], {
          explain: `좌변을 전개하여 정리하면 ${nb(`(${sumH([[q, va], [-p * r + s * t, '']])}) + (${sumH([[r, va], [p * q, ''], [-s, vb]])})${I} = 0`)}이다. ${va}, ${vb}가 실수이므로 ${nb(sumH([[q, va], [-p * r + s * t, '']]) + ' = 0')}에서 ${nb(va + ' = ' + iq(a))}, ${nb(sumH([[r, va], [p * q, ''], [-s, vb]]) + ' = 0')}에서 ${nb(vb + ' = ' + iq(b))}이다.`,
          facts: { calc: [[`(${jn(p)}*${jn(r)}-${s}*${jn(t)})/${jn(q)}`, 0], [`((${jn(p)}*${jn(r)}-${s}*${jn(t)})/${jn(q)}*${jn(r)}+${jn(p)}*${jn(q)})/${s}`, 1]] }
        });
      }
      // px + (q + ri)y = c + di
      const p = d.int(2, 5) * (d.bool() ? 1 : -1), q = nz(d, -4, 4), r = d.pick([1, 2, -1]), x = nz(d, -5, 5), y = nz(d, -5, 5), c = p * x + q * y, dd = r * y;
      if (c === 0) return null;
      const L = nb(`${p < 0 ? MINUS : ''}${Math.abs(p)}${vx} + ${cxP(zi(q, r))}${vy}`);
      return valsQ(`등식 ${ej(L + ' = ' + cxH(zi(c, dd)), '을/를')} 만족시키는 실수 ${vx}, ${vy}의 값은?`, [['x', x], ['y', y]], {
        explain: `좌변을 정리하면 ${nb(`(${sumH([[p, vx], [q, vy]])}) ${r < 0 ? MINUS : '+'} ${Math.abs(r) === 1 ? '' : Math.abs(r)}${vy}${I}`)}이다. 허수부분끼리 같으므로 ${r === 1 ? '' : nb(sumH([[r, vy]]) + ' = ' + iq(dd)) + '에서 '}${nb(vy + ' = ' + iq(y))}, 실수부분끼리 같으므로 ${nb(sumH([[p, vx], [q, vy]]) + ' = ' + iq(c))}에서 ${nb(vx + ' = ' + iq(x))}이다.`,
        facts: { calc: [[`(${jn(c)}-${jn(q)}*${jn(dd)}/${jn(r)})/${jn(p)}`, 0], [`${jn(dd)}/${jn(r)}`, 1]] }
      });
    }, { count: 2 }),
    T('cx-conj', '켤레복소수 구하기', '①8', (d) => {
      const kind = d.int(0, 3), a = nz(d, -9, 9), b = nz(d, -9, 9);
      const u = kind === 0 ? zi(a, b) : kind === 1 ? zi(0, b) : kind === 2 ? zi(a, 0) : zi(a, Math.abs(b) === 1 ? 1 : b);
      const w = cconj(u);
      return cxAns(`복소수 ${cxH(u)}의 켤레복소수를 ${ABI}(${va}, ${vb}는 실수) 꼴로 나타내시오.`, w, {
        explain: `켤레복소수는 허수부분의 부호만 바꾼 복소수이다. ${u.m.p === 0 ? `${cxH(u)} = ${cxH(u)} + 0${I}이므로 켤레복소수는 자기 자신 ${cxH(w)}이다.` : `${cxH(u)}의 허수부분 ${iq(u.m.p)}의 부호를 바꾸면 켤레복소수는 ${cxH(w)}이다.`}`,
        calc: [jn(u.r.p), `0-${jn(u.m.p)}`]
      });
    }),
    T('cx-claim', '복소수의 뜻에 대한 설명에서 옳지 않은 것', '①33', (d) => {
      const n = d.int(2, 12), k = d.int(2, 9), m = d.int(2, 7), a = d.int(2, 9), b = d.int(2, 9), c = d.int(2, 9);
      const yes = [
        `${josa(n, '은/는')} 복소수이다.`,
        `${nb(k + I)}는 허수이다.`,
        `제곱하여 ${MINUS}${josa(m * m, '이/가')} 되는 복소수는 ${nb(m + I)}, ${nb(MINUS + m + I)}의 2개이다.`,
        `${nb(k + I)}의 실수부분은 0이다.`,
        `실수 ${a}의 켤레복소수는 ${a} 자신이다.`,
        `${nb(I + sup(2) + ' = ' + MINUS + '1')}이다.`,
        `0이 아닌 실수 ${vb}에 대하여 ${nb('(' + vb + I + ')' + sup(2))}은 음수이다.`
      ];
      const no = [
        [`두 허수의 곱은 항상 허수이다.`, `${nb(a + I + ' × ' + b + I + ' = ' + MINUS + a * b)}처럼 두 허수의 곱이 실수일 수 있다.`],
        [`복소수 ${nb(c + ' ' + MINUS + ' ' + b + I)}의 허수부분은 ${nb(MINUS + b + I)}이다.`, `허수부분은 ${MINUS}${b}이다.`],
        [`0은 복소수가 아니다.`, `${nb('0 = 0 + 0' + I)}이므로 0도 복소수이다.`],
        [`제곱하여 ${MINUS}${josa(m * m, '이/가')} 되는 복소수는 ${nb(m + I)} 하나뿐이다.`, `${nb(m + I)}와 ${nb(MINUS + m + I)}의 2개이다.`, `제곱하여 ${MINUS}${josa(m * m, '이/가')} 되는 복소수는 ${nb(m + I)}, ${nb(MINUS + m + I)}의 2개이다.`],
        [`실수는 복소수가 아니다.`, `실수 ${va}는 ${nb(va + ' + 0' + I)}이므로 복소수이다.`, `${josa(n, '은/는')} 복소수이다.`]
      ];
      return claimQ(d, '복소수에 대한 다음 설명 가운데 옳지 않은 것은?', yes, no, false);
    })
  ]);

  // ── 복소수의 사칙연산 ──
  B.addTypes(UNIT, 'calc', [
    T('calc-add', '복소수의 덧셈과 뺄셈', '①9', (d, n) => {
      if (n === 2) {
        // 분수 계수: (p1/q1 + (p2/q2)i) + (r1/s1 + (r2/s2)i)
        const dens = [2, 3, 4, 5, 6], q1 = d.pick(dens), q2 = d.pick(dens), s1 = d.pick(dens), s2 = d.pick(dens);
        const p1 = nz(d, -7, 7), p2 = nz(d, -7, 7), r1 = nz(d, -7, 7), r2 = nz(d, -7, 7);
        const u = cz(Q(p1, q1), Q(p2, q2)), w = cz(Q(r1, s1), Q(r2, s2));
        if (isInt(u.r) || isInt(u.m) || isInt(w.r) || isInt(w.m)) return null;
        const v = cadd(u, w);
        if (isInt(v.r) || isInt(v.m) || Math.max(v.r.q, v.m.q) > 30) return null;
        const g1 = gcd(Math.abs(u.r.p * w.r.q + w.r.p * u.r.q), u.r.q * w.r.q), g2 = gcd(Math.abs(u.m.p * w.m.q + w.m.p * u.m.q), u.m.q * w.m.q);
        const ex = `${cxP(u)} + ${cxP(w)}`;
        return cxFracAns(CALC_ABI, v, {
          figure: exq(ex),
          explain: `실수부분은 실수부분끼리, 허수부분은 허수부분끼리 더한다. 실수부분은 ${nb(tx(u.r) + ' + ' + (w.r.p < 0 ? '(' + tx(w.r) + ')' : tx(w.r)) + ' = ' + tx(v.r))}, 허수부분은 ${nb(tx(u.m) + ' + ' + (w.m.p < 0 ? '(' + tx(w.m) + ')' : tx(w.m)) + ' = ' + tx(v.m))}이므로 ${cxH(v)}이다.`,
          calc: [`(${u.r.p}*${w.r.q}+${w.r.p}*${u.r.q})/${g1}`, `${u.r.q}*${w.r.q}/${g1}`, `(${u.m.p}*${w.m.q}+${w.m.p}*${u.m.q})/${g2}`, `${u.m.q}*${w.m.q}/${g2}`],
          derived: [g1, g2, u.r.q, w.r.q, u.m.q, w.m.q, Math.abs(u.r.p), Math.abs(w.r.p), Math.abs(u.m.p), Math.abs(w.m.p)],
          facts: { rule: 'add-frac' }
        });
      }
      const u = zi(nz(d, -9, 9), nz(d, -9, 9)), w = n === 1 && d.bool() ? zi(0, nz(d, -9, 9)) : zi(nz(d, -9, 9), nz(d, -9, 9));
      const v = n === 0 ? cadd(u, w) : csub(u, w);
      const op = n === 0 ? '+' : MINUS;
      return cxAns(CALC_ABI, v, {
        figure: exq(`${cxP(u)} ${op} ${cxP(w)}`),
        explain: n === 0
          ? `실수부분은 실수부분끼리, 허수부분은 허수부분끼리 더한다. ${nb(`(${iq(u.r.p)} + ${jn(w.r.p).replace('-', MINUS)}) + (${iq(u.m.p)} + ${jn(w.m.p).replace('-', MINUS)})${I}`)} = ${cxH(v)}이다.`
          : `괄호 앞이 ${MINUS}이므로 빼는 수의 실수부분과 허수부분을 모두 뺀다. ${nb(`(${iq(u.r.p)} ${MINUS} ${jn(w.r.p).replace('-', MINUS)}) + (${iq(u.m.p)} ${MINUS} ${jn(w.m.p).replace('-', MINUS)})${I}`)} = ${cxH(v)}이다.`,
        calc: n === 0 ? [`${jn(u.r.p)}+${jn(w.r.p)}`, `${jn(u.m.p)}+${jn(w.m.p)}`] : [`${jn(u.r.p)}-${jn(w.r.p)}`, `${jn(u.m.p)}-${jn(w.m.p)}`],
        facts: { rule: n === 0 ? 'add' : 'sub' }
      });
    }, { count: 3 }),
    T('calc-mul', '복소수의 곱셈', '①10', (d, n) => {
      let u, w, ex;
      if (n === 0) { u = zi(nz(d, -6, 6), nz(d, -6, 6)); w = d.bool() ? zi(nz(d, -6, 6), nz(d, -6, 6)) : zi(0, nz(d, -5, 5)); if (w.r.p === 0) [u, w] = [w, u]; ex = `${cxP(u)}${cxP(w)}`; }
      else if (n === 1) { u = zi(nz(d, -6, 6), nz(d, -6, 6)); w = u; ex = `${cxP(u)}${sup(2)}`; }
      else { u = zi(nz(d, -8, 8), nz(d, -8, 8)); w = cconj(u); ex = `${cxP(u)}${cxP(w)}`; }
      const v = cmul(u, w), [a, b, c, e] = [u.r.p, u.m.p, w.r.p, w.m.p];
      if (n === 0 && (v.r.p === 0 || v.m.p === 0)) return null;
      return cxAns(CALC_ABI, v, {
        figure: exq(ex),
        explain: `${I}를 문자처럼 생각하여 전개하고 ${nb(I + sup(2) + ' = ' + MINUS + '1')}을 쓴다. ${mulTold(u, w)}${n === 2 ? '이다. 서로 켤레복소수인 두 복소수의 곱은 실수이다.' : '이다.'}`,
        calc: n === 1 ? [`${jn(a)}*${jn(a)}-${jn(b)}*${jn(b)}`, `2*${jn(a)}*${jn(b)}`] : [`${jn(a)}*${jn(c)}-${jn(b)}*${jn(e)}`, `${jn(a)}*${jn(e)}+${jn(b)}*${jn(c)}`],
        derived: n === 1 ? [2] : [],
        facts: { rule: ['mul', 'square', 'mul-conj-pair'][n] }
      });
    }, { count: 3 }),
    T('calc-div', '복소수의 나눗셈', '①11', (d, n) => {
      if (n === 0) {
        // 결과의 실수부분·허수부분이 분수
        const w = zi(nz(d, -4, 4), nz(d, -4, 4)), u = d.bool() ? zi(nz(d, -6, 6), nz(d, -6, 6)) : zi(nz(d, 1, 6), 0), v = cdiv(u, w);
        if (isInt(v.r) || isInt(v.m) || v.r.p === 0 || v.m.p === 0) return null;
        const [a, b, c, e] = [u.r.p, u.m.p, w.r.p, w.m.p], nn = c * c + e * e, g1 = nn / v.r.q, g2 = nn / v.m.q;
        return cxFracAns(CALC_ABI, v, {
          figure: exq(frac(cxH(u), cxH(w))),
          explain: `분모의 켤레복소수 ${ej(cxH(cconj(w)), '을/를')} 분모와 분자에 곱한다. 분모는 ${nb(cxP(w) + cxP(cconj(w)) + ' = ' + nn)}, 분자는 ${nb(cxP(u) + cxP(cconj(w)) + ' = ' + cxH(cmul(u, cconj(w))))}이므로 ${cxH(v)}이다.`,
          calc: [`(${jn(a)}*${jn(c)}+${jn(b)}*${jn(e)})/${g1}`, `(${jn(c)}*${jn(c)}+${jn(e)}*${jn(e)})/${g1}`, `(${jn(b)}*${jn(c)}-${jn(a)}*${jn(e)})/${g2}`, `(${jn(c)}*${jn(c)}+${jn(e)}*${jn(e)})/${g2}`],
          derived: [g1, g2],
          facts: { rule: 'div-frac' }
        });
      }
      const q = zi(nz(d, -6, 6), nz(d, -6, 6)), w = n === 1 ? zi(nz(d, -4, 4), nz(d, -4, 4)) : zi(0, nz(d, -3, 3)), u = cmul(q, w);
      if (u.r.p === 0 || u.m.p === 0) return null;
      const [a, b, c, e] = [u.r.p, u.m.p, w.r.p, w.m.p];
      return cxAns(CALC_ABI, q, {
        figure: exq(frac(cxH(u), cxH(w))),
        explain: n === 1
          ? `분모의 켤레복소수 ${ej(cxH(cconj(w)), '을/를')} 분모와 분자에 곱한다. 분모는 ${nb(cxP(w) + cxP(cconj(w)) + ' = ' + (c * c + e * e))}, 분자는 ${nb(cxP(u) + cxP(cconj(w)) + ' = ' + cxH(cmul(u, cconj(w))))}이므로 ${cxH(q)}이다.`
          : `분모가 ${cxH(w)}이므로 분모와 분자에 ${ej(cxH(cconj(w)), '을/를')} 곱하면 분모는 ${nb(cxP(w) + ' × ' + cxP(cconj(w)) + ' = ' + (e * e))}이다. 분자는 ${nb(cxP(u) + ' × ' + cxP(cconj(w)) + ' = ' + cxH(cmul(u, cconj(w))))}이므로 ${cxH(q)}이다.`,
        calc: [`(${jn(a)}*${jn(c)}+${jn(b)}*${jn(e)})/(${jn(c)}*${jn(c)}+${jn(e)}*${jn(e)})`, `(${jn(b)}*${jn(c)}-${jn(a)}*${jn(e)})/(${jn(c)}*${jn(c)}+${jn(e)}*${jn(e)})`],
        facts: { rule: n === 1 ? 'div-int' : 'div-imag' }
      });
    }, { count: 3 }),
    T('calc-chain', '곱과 나눗셈을 잇는 계산', '①12', (d) => {
      const w = zi(nz(d, -6, 6), nz(d, -6, 6)), z3 = d.pick([zi(1, 1), zi(1, -1), zi(2, 1), zi(1, 2), zi(2, -1), zi(1, -2)]), num = cmul(w, z3), k = d.pick([1, 2, 3, -1, -2]);
      const z1 = zi(0, k), z2 = cdiv(num, z1);
      if (!cint(z2) || z2.r.p === 0 || z2.m.p === 0 || Math.abs(z2.r.p) > 9 || Math.abs(z2.m.p) > 9) return null;
      const top = nb(cxH(z1) + cxP(z2));
      const [c, e] = [z3.r.p, z3.m.p];
      return cxAns(CALC_ABI, w, {
        figure: exq(frac(top, cxH(z3))),
        explain: `분자는 ${nb(cxP(z1) + cxP(z2) + ' = ' + cxH(num))}이다. 분모의 켤레복소수 ${ej(cxH(cconj(z3)), '을/를')} 분모와 분자에 곱하면 ${frac(nb(cxP(num) + cxP(cconj(z3))), nb(cxP(z3) + cxP(cconj(z3))))} = ${frac(cxH(cmul(num, cconj(z3))), String(c * c + e * e))} = ${cxH(w)}이다.`,
        calc: [`((${k})*(0-${jn(z2.m.p)})*${jn(c)}+(${k})*${jn(z2.r.p)}*${jn(e)})/(${jn(c)}*${jn(c)}+${jn(e)}*${jn(e)})`, `((${k})*${jn(z2.r.p)}*${jn(c)}-(${k})*(0-${jn(z2.m.p)})*${jn(e)})/(${jn(c)}*${jn(c)}+${jn(e)}*${jn(e)})`],
        facts: { rule: 'chain' }
      });
    }),
    T('calc-conj', '켤레복소수가 낀 계산', '①13', (d, n) => {
      if (n === 0) {
        const u = zi(nz(d, -6, 6), nz(d, -6, 6)), w = zi(nz(d, -6, 6), nz(d, -6, 6));
        if (d.bool()) {
          const v = cadd(u, cconj(w));
          return cxAns(CALC_ABI + BAR_NOTE, v, {
            figure: exq(`${cxH(u)} + ${bar(cxH(w))}`),
            explain: `${bar(cxH(w))} = ${cxH(cconj(w))}이므로 ${nb(cxH(u) + ' + ' + cxP(cconj(w)) + ' = ' + cxH(v))}이다.`,
            calc: [`${jn(u.r.p)}+${jn(w.r.p)}`, `${jn(u.m.p)}-${jn(w.m.p)}`],
            facts: { rule: 'conj-add' }
          });
        }
        const pr = cmul(u, w), v = cconj(pr);
        if (pr.r.p === 0 || pr.m.p === 0) return null;
        return cxAns(CALC_ABI + BAR_NOTE, v, {
          figure: exq(bar(cxP(u) + cxP(w))),
          explain: `먼저 곱하면 ${mulTold(u, w)}이고, 그 켤레복소수는 ${cxH(v)}이다.`,
          calc: [`${jn(u.r.p)}*${jn(w.r.p)}-${jn(u.m.p)}*${jn(w.m.p)}`, `0-(${jn(u.r.p)}*${jn(w.m.p)}+${jn(u.m.p)}*${jn(w.r.p)})`],
          facts: { rule: 'conj-mul' }
        });
      }
      // z = a + bi 일 때 (z − z̄)/(z + z̄) = (b/a)i
      const a = nz(d, -9, 9), b = nz(d, -9, 9), q = Q(b, a);
      if (Math.abs(a) < 2 || isInt(q)) return null;
      return imFracAns(`복소수 ${nb(Z + ' = ' + cxH(zi(a, b)))}에 대하여 ${frac(nb(Z + ' ' + MINUS + ' ' + ZB), nb(Z + ' + ' + ZB))}의 값은? ${ZBAR_NOTE}`, q, {
        explain: `${nb(ZB + ' = ' + cxH(zi(a, -b)))}이므로 ${nb(Z + ' ' + MINUS + ' ' + ZB + ' = ' + cxH(zi(0, 2 * b)))}, ${nb(Z + ' + ' + ZB + ' = ' + (2 * a < 0 ? MINUS : '') + Math.abs(2 * a))}이다. 따라서 ${frac(cxH(zi(0, 2 * b)), iq(2 * a))} = ${nb((q.p < 0 ? MINUS : '') + mag(qabs(q)) + I)}이다.`,
        calc: [`${jn(b)}*${q.q}/${jn(a)}`, `${jn(a)}*${q.p}/${jn(b)}`],
        derived: [q.q, Math.abs(q.p)]
      });
    }, { count: 2 }),
    T('calc-zfrac', 'z와 z̄가 낀 분수식의 값', '①14', (d, n) => {
      const a = nz(d, -5, 5), b = nz(d, -4, 4), z = zi(a, b), zb = cconj(z);
      if (n === 0) {
        const k = nz(d, -3, 3), val = cadd(cdiv(z, csub(zb, cz(k))), cdiv(zb, csub(z, cz(k))));
        if (val.m.p !== 0 || !isInt(val.r) || val.r.p === 0 || a === k || cdiv(z, csub(zb, cz(k))).m.p === 0) return null;
        const KH = (k < 0 ? ' + ' : ' ' + MINUS + ' ') + Math.abs(k);
        const v1 = cdiv(z, csub(zb, cz(k)));
        return ansV(`${nb(Z + ' = ' + cxH(z))}일 때, ${frac(Z, nb(ZB + KH))} + ${frac(ZB, nb(Z + KH))}의 값은? ${ZBAR_NOTE}`, val.r, 'int', {
          explain: `${nb(ZB + ' = ' + cxH(zb))}이므로 ${frac(Z, nb(ZB + KH))} = ${frac(cxH(z), cxH(csub(zb, cz(k))))} = ${cxH(v1)}이다. ${frac(ZB, nb(Z + KH))}는 그 켤레복소수 ${cxH(cconj(v1))}이므로 두 수의 합은 ${iq(val.r.p)}이다.`,
          facts: { value: `2*(${jn(a)}*${jn(a)}-${jn(b)}*${jn(b)}-${jn(k)}*${jn(a)})/((${jn(a)}-${jn(k)})*(${jn(a)}-${jn(k)})+${jn(b)}*${jn(b)})`, derived: [2] }
        });
      }
      const k = d.int(1, 3), nn = a * a + b * b, v = cmul(zb, cz(Q(nn + k, nn)));
      if (isInt(v.r) || isInt(v.m)) return null;
      const g1 = gcd(Math.abs(a * (nn + k)), nn), g2 = gcd(Math.abs(b * (nn + k)), nn);
      return cxFracAns(`${nb(Z + ' = ' + cxH(z))}일 때, ${ej(ZB + ' + ' + frac(k, Z), '을/를')} ${ABI}(${va}, ${vb}는 실수) 꼴로 나타내시오. ${ZBAR_NOTE}`, v, {
        explain: `${frac(k, Z)} = ${frac(k, cxH(z))} = ${frac(nb(k === 1 ? cxH(zb) : k + cxP(zb)), String(nn))}이고 ${nb(ZB + ' = ' + cxH(zb))}이므로 더하면 ${cxH(v)}이다.`,
        calc: [`${jn(a)}*(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)}+${k})/${g1}`, `(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})/${g1}`, `0-${jn(b)}*(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)}+${k})/${g2}`, `(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})/${g2}`],
        derived: [g1, g2]
      });
    }, { count: 2 }),
    T('calc-sym', 'z + z̄와 zz̄로 묶어 식의 값 구하기', '①15', (d, n) => {
      if (n === 0) {
        const a = nz(d, -5, 5), b = nz(d, -5, 5), z = zi(a, b), s = 2 * a, p = a * a + b * b;
        return ansV(`${nb(Z + ' = ' + cxH(z))}일 때, ${nb(Z + sup(2) + ZB + ' + ' + Z + ZB + sup(2))}의 값은? ${ZBAR_NOTE}`, Q(p * s), 'int', {
          explain: `${nb(Z + sup(2) + ZB + ' + ' + Z + ZB + sup(2) + ' = ' + Z + ZB + '(' + Z + ' + ' + ZB + ')')}이다. ${nb(Z + ' + ' + ZB + ' = ' + iq(s))}, ${nb(Z + ZB + ' = ' + cxP(z) + cxP(cconj(z)) + ' = ' + p)}이므로 ${nb(p + ' × ' + (s < 0 ? '(' + iq(s) + ')' : s) + ' = ' + iq(p * s))}이다.`,
          facts: { value: `(${jn(a)}*${jn(a)}+${jn(b)}*${jn(b)})*2*${jn(a)}`, derived: [2] }
        });
      }
      const a = nz(d, -5, 5), b = nz(d, -5, 5), c = nz(d, -5, 5), e = nz(d, -5, 5), al = zi(a, b), be = zi(c, e);
      const ALb = bar(AL), BEb = bar(BE);
      return ansV(`${nb(AL + ' = ' + cxH(al))}, ${nb(BE + ' = ' + cxH(be))}일 때, ${nb(AL + BE + ' + ' + AL + BEb + ' + ' + ALb + BE + ' + ' + ALb + BEb)}의 값은? (단, ${ALb}, ${BEb}는 각각 ${AL}, ${BE}의 켤레복소수이다.)`, Q(4 * a * c), 'int', {
        explain: `주어진 식은 ${nb(AL + '(' + BE + ' + ' + BEb + ') + ' + ALb + '(' + BE + ' + ' + BEb + ') = (' + AL + ' + ' + ALb + ')(' + BE + ' + ' + BEb + ')')}이다. ${nb(AL + ' + ' + ALb + ' = ' + iq(2 * a))}, ${nb(BE + ' + ' + BEb + ' = ' + iq(2 * c))}이므로 ${nb((a < 0 ? '(' + iq(2 * a) + ')' : 2 * a) + ' × ' + (c < 0 ? '(' + iq(2 * c) + ')' : 2 * c) + ' = ' + iq(4 * a * c))}이다.`,
        facts: { value: `2*${jn(a)}*2*${jn(c)}`, derived: [2] }
      });
    }, { count: 2 }),
    T('calc-quadval', '분수 꼴의 복소수를 간단히 한 뒤 식의 값', '①16', (d, n) => {
      if (n === 0) {
        // α = c/(p + qi) = t(p − qi), α² − 2(tp)α + k 의 값 = k − t²(p² + q²)
        const p = d.int(1, 3), q = nz(d, -3, 3), t = d.pick([1, 2]), c = t * (p * p + q * q), m = t * p, nn = t * t * (p * p + q * q), k = nz(d, -9, 9);
        const al = zi(t * p, -t * q);
        if (k === nn) return null;
        return ansV(`${nb(AL + ' = ')}${frac(c, cxH(zi(p, q)))}일 때, ${nb(AL + sup(2) + moreH([[-2 * m, AL], [k, '']]))}의 값은?`, Q(k - nn), 'int', {
          explain: `${AL} = ${frac(nb(c + cxP(zi(p, -q))), nb(cxP(zi(p, q)) + cxP(zi(p, -q))))} = ${cxH(al)}이다. ${nb(AL + ' ' + MINUS + ' ' + m + ' = ' + cxH(zi(0, -t * q)))}의 양변을 제곱하면 ${nb(AL + sup(2) + moreH([[-2 * m, AL], [m * m, '']]) + ' = ' + iq(-t * t * q * q))}, 곧 ${nb(AL + sup(2) + moreH([[-2 * m, AL]]) + ' = ' + iq(-nn))}이므로 구하는 값은 ${nb(iq(-nn) + moreH([[k, '']]) + ' = ' + iq(k - nn))}이다.`,
          facts: { value: `${jn(k)}-${c}*${c}/(${p}*${p}+${jn(q)}*${jn(q)})`, derived: [] }
        });
      }
      // α = (m − √t i)/2 는 α² − mα + s = 0 의 근(s = (m² + t)/4). (α² − mα + s)(α + u) + v 를 전개한 식의 값은 v
      const m = nz(d, -3, 3), t = d.pick([3, 7, 11, 15, 19].filter((x) => (m * m + x) % 4 === 0)), u = nz(d, -3, 3), v = nz(d, -6, 6);
      if (!t) return null;
      const s = (m * m + t) / 4, c3 = u - m, c2 = s - m * u, c1 = s * u + v;
      if (c3 === 0 || c2 === 0 || c1 === 0) return null;
      const alH = frac(nb(iq(m) + ' ' + MINUS + ' ' + rt(t) + I), 2);
      return ansV(`${AL} = ${alH}일 때, ${nb(AL + sup(3) + moreH([[c3, AL + sup(2)], [c2, AL], [c1, '']]))}의 값은?`, Q(v), 'int', {
        explain: `${nb('2' + AL + moreH([[-m, '']]) + ' = ' + MINUS + rt(t) + I)}의 양변을 제곱하면 ${nb('4' + AL + sup(2) + moreH([[-4 * m, AL], [m * m, '']]) + ' = ' + MINUS + t)}, 곧 ${nb(AL + sup(2) + moreH([[-m, AL], [s, '']]) + ' = 0')}이다. 주어진 식은 ${nb('(' + AL + sup(2) + moreH([[-m, AL], [s, '']]) + ')(' + AL + moreH([[u, '']]) + ')' + moreH([[v, '']]))}이므로 그 값은 ${iq(v)}이다.`,
        facts: { value: `${jn(c1)}-(${jn(m)}*${jn(m)}+${t})/4*(${jn(c3)}+${jn(m)})`, derived: [4] }
      });
    }, { count: 2 })
  ]);

  // ── i의 거듭제곱 ──
  // i + i² + … + iⁿ 의 실수부분과 허수부분(검사 식): 실수부분 −((n%4) − (n%4)%2)/2, 허수부분 (n%4)(3 − n%4)/2
  const sumRe = (n) => `(0-(${n}%4-${n}%4%2)/2)`, sumIm = (n) => `(${n}%4*(3-${n}%4)/2)`;
  const powRe = (n) => `((${n}+1)%2*(1-${n}%4))`, powIm = (n) => `(${n}%2*(2-${n}%4))`;
  const isum = (n) => { let s = cz(0, 0); for (let k = 1; k <= n; k += 1) s = cadd(s, ipow(k)); return s; };
  const ipH = (n) => (n === 1 ? I : nb(I + sup(n)));
  B.addTypes(UNIT, 'pow', [
    T('pow-single', 'i의 거듭제곱의 값', '①17', (d) => {
      const ns = d.shuffle(Array.from({ length: 50 }, (_, i) => i + 5)).slice(0, d.int(2, 3)).sort((x, y) => x - y), v = ns.reduce((s, k) => cadd(s, ipow(k)), cz(0, 0));
      if (czero(v)) return null;
      return cxAns(CALC_ABI, v, {
        figure: exq(ns.map(ipH).join(' + ')),
        explain: `${nb(I + sup(4) + ' = 1')}이므로 지수를 4로 나눈 나머지만 보면 된다. ${ns.map((k) => `${ipH(k)} = ${cxH(ipow(k))}`).join(', ')}이므로 ${cxH(v)}이다.`,
        calc: [ns.map(powRe).join('+'), ns.map(powIm).join('+')],
        derived: [2, 4]
      });
    }),
    T('pow-sum', 'i의 거듭제곱의 합', '①18', (d, n) => {
      const N = d.int(18, 99);
      if (N % 4 === 0) return null;
      if (n === 0) {
        const v = isum(N);
        return cxAns(CALC_ABI, v, {
          figure: exq(`${I} + ${ipH(2)} + ${ipH(3)} + ${ipH(4)} + ⋯ + ${ipH(N)}`),
          explain: `${nb(I + ' + ' + ipH(2) + ' + ' + ipH(3) + ' + ' + ipH(4) + ' = ' + I + ' ' + MINUS + ' 1 ' + MINUS + ' ' + I + ' + 1 = 0')}이므로 네 항씩 묶으면 0이다. ${N}${tail(N, '을/를')} 4로 나눈 나머지는 ${N % 4}이므로 남는 항은 ${Array.from({ length: N % 4 }, (_, i) => ipH(N - N % 4 + i + 1)).join(', ')}이고, 그 합은 ${cxH(v)}이다.`,
          calc: [sumRe(N), sumIm(N)],
          derived: [2, 3, 4]
        });
      }
      const v = cadd(isum(N), csub(isum(N + 1), cz(0, 1)));
      return cxAns(CALC_ABI, v, {
        figure: exq(`(${I} + ${ipH(2)}) + (${ipH(2)} + ${ipH(3)}) + ⋯ + (${ipH(N)} + ${ipH(N + 1)})`),
        explain: `괄호를 풀면 (${I} + ${ipH(2)} + ⋯ + ${ipH(N)}) + (${ipH(2)} + ${ipH(3)} + ⋯ + ${ipH(N + 1)})이다. 네 항씩 묶으면 0이므로 앞의 합은 ${cxH(isum(N))}, 뒤의 합은 ${cxH(csub(isum(N + 1), cz(0, 1)))}이고, 모두 더하면 ${cxH(v)}이다.`,
        calc: [`${sumRe(N)}+${sumRe(N + 1)}`, `${sumIm(N)}+${sumIm(N + 1)}-1`],
        derived: [2, 3, 4, N + 1]
      });
    }, { count: 2 }),
    T('pow-recip', '1/i의 거듭제곱의 합', '①19', (d) => {
      const N = d.int(14, 61), from0 = d.bool();
      if (N % 4 === 3 && from0) return null;
      // 1/iᵏ = (−i)ᵏ 이므로 합은 (1 + i + … + iᴺ 의 켤레복소수)
      const total = cconj(cadd(isum(N), from0 ? cz(1, 0) : cz(0, 0)));
      if (czero(total)) return null;
      const terms = (from0 ? '1 + ' : '') + `${frac(1, I)} + ${frac(1, ipH(2))} + ${frac(1, ipH(3))} + ⋯ + ${frac(1, ipH(N))}`;
      return cxAns(CALC_ABI, total, {
        figure: exq(terms),
        explain: `${frac(1, I)} = ${frac(nb(MINUS + I), nb(I + ' × (' + MINUS + I + ')'))} = ${MINUS}${I}이므로 ${frac(1, I + sup('<i class="mb-var">k</i>'))} = (${MINUS}${I})${sup('<i class="mb-var">k</i>')}이고, 이 합은 ${(from0 ? '1 + ' : '') + I + ' + ' + ipH(2) + ' + ⋯ + ' + ipH(N)}의 켤레복소수이다. ${(from0 ? '1 + ' : '')}${I} + ⋯ + ${ipH(N)} = ${cxH(cconj(total))}이므로 구하는 값은 ${cxH(total)}이다.`,
        calc: [`${from0 ? '1+' : ''}${sumRe(N)}`, `0-${sumIm(N)}`],
        derived: [2, 3, 4]
      });
    }),
    T('pow-onei', '(1 ± i)² = ±2i를 이용한 계산', '①21', (d, n) => {
      if (n === 0) {
        const N = d.int(3, 6), s = d.pick([1, -1]), base = zi(1, s), two = zi(0, 2 * s);
        let v = cz(0, 0); for (let k = 1; k <= N; k += 1) v = cadd(v, cpow(two, k));
        const bH = '(' + cxH(base) + ')', terms = N <= 4 ? Array.from({ length: N }, (_, k) => nb(bH + sup(2 * k + 2))).join(' + ') : `${nb(bH + sup(2))} + ${nb(bH + sup(4))} + ⋯ + ${nb(bH + sup(2 * N))}`;
        return cxAns(CALC_ABI, v, {
          figure: exq(terms),
          explain: `${nb(bH + sup(2) + ' = 1 ' + (s > 0 ? '+' : MINUS) + ' 2' + I + ' + ' + I + sup(2) + ' = ' + cxH(two))}이므로 주어진 식은 ${Array.from({ length: N }, (_, k) => (k === 0 ? cxH(two) : nb('(' + cxH(two) + ')' + sup(k + 1)))).join(' + ')} = ${joinC(Array.from({ length: N }, (_, k) => cpow(two, k + 1)))} = ${cxH(v)}이다.`,
          calc: [Array.from({ length: N }, (_, k) => `(2**${k + 1})*${powRe(k + 1)}*(${jn(s)}**${k + 1})`).join('+'), Array.from({ length: N }, (_, k) => `(2**${k + 1})*${powIm(k + 1)}*(${jn(s)}**${k + 1})`).join('+')],
          derived: [2, 4, 5, 6, ...Array.from({ length: N + 1 }, (_, k) => k + 1)],
          facts: { rule: 'onei-sum' }
        });
      }
      if (n === 1) {
        const k = d.int(2, 6), plus = k % 2 === 0, v = plus ? cadd(cpow(zi(0, 2), k), cpow(zi(0, -2), k)) : csub(cpow(zi(0, 2), k), cpow(zi(0, -2), k));
        const ex = `(1 + ${I})${sup(2 * k)} ${plus ? '+' : MINUS} (1 ${MINUS} ${I})${sup(2 * k)}`;
        return cxAns(CALC_ABI, v, {
          figure: exq(ex),
          explain: `${nb('(1 + ' + I + ')' + sup(2) + ' = 2' + I)}, ${nb('(1 ' + MINUS + ' ' + I + ')' + sup(2) + ' = ' + MINUS + '2' + I)}이므로 주어진 식은 ${nb('(2' + I + ')' + sup(k) + ' ' + (plus ? '+' : MINUS) + ' (' + MINUS + '2' + I + ')' + sup(k))} = ${cxH(cpow(zi(0, 2), k))} ${plus ? '+' : MINUS} ${cxP(cpow(zi(0, -2), k))} = ${cxH(v)}이다.`,
          calc: [`(2**${k})*${powRe(k)}*(1+(${plus ? 1 : -1})*((-1)**${k}))`, `(2**${k})*${powIm(k)}*(1+(${plus ? 1 : -1})*((-1)**${k}))`],
          derived: [2, 4, k],
          facts: { rule: 'onei-pair' }
        });
      }
      const Mx = d.int(5, 20), Nx = d.int(5, 20);
      if (Mx % 4 === Nx % 4) return null;
      const v = cadd(ipow(-Mx), ipow(Nx));
      if (czero(v)) return null;
      const A = frac(nb('1 ' + MINUS + ' ' + I), nb('1 + ' + I)), Bf = frac(nb('1 + ' + I), nb('1 ' + MINUS + ' ' + I));
      return cxAns(CALC_ABI, v, {
        figure: exq(`(${A})${sup(Mx)} + (${Bf})${sup(Nx)}`),
        explain: `${A} = ${frac(nb('(1 ' + MINUS + ' ' + I + ')' + sup(2)), nb('(1 + ' + I + ')(1 ' + MINUS + ' ' + I + ')'))} = ${frac(nb(MINUS + '2' + I), 2)} = ${MINUS}${I}, ${Bf} = ${I}이므로 주어진 식은 ${nb('(' + MINUS + I + ')' + sup(Mx) + ' + ' + I + sup(Nx))} = ${cxH(ipow(-Mx))} + ${cxP(ipow(Nx))} = ${cxH(v)}이다.`,
        calc: [`${powRe(Mx)}*((-1)**${Mx})+${powRe(Nx)}`, `${powIm(Mx)}*((-1)**${Mx})+${powIm(Nx)}`],
        derived: [2, 4],
        facts: { rule: 'onei-frac' }
      });
    }, { count: 3 }),
    T('pow-zsum', '복소수 z를 간단히 한 뒤 거듭제곱의 합', '①22', (d, n) => {
      if (n === 0) {
        const s = d.pick([1, -1]), N = d.int(9, 30), z = zi(0, s);
        if (N % 4 === 3) return null;
        let v = cz(0, 0); for (let k = 0; k <= N; k += 1) v = cadd(v, cpow(z, k));
        const zH = s > 0 ? frac(nb('1 + ' + I), nb('1 ' + MINUS + ' ' + I)) : frac(nb('1 ' + MINUS + ' ' + I), nb('1 + ' + I));
        return cxAns(`복소수 ${Z} = ${zH}에 대하여 ${nb('1 + ' + Z + ' + ' + Z + sup(2) + ' + ⋯ + ' + Z + sup(N))}${endJ(sup(N), '을/를')} ${ABI}(${va}, ${vb}는 실수) 꼴로 나타내시오.`, v, {
          explain: `분모의 켤레복소수를 분모와 분자에 곱하면 ${nb(Z + ' = ' + cxH(z))}이다. ${nb('1 + ' + Z + ' + ' + Z + sup(2) + ' + ' + Z + sup(3) + ' = 0')}이므로 네 항씩 묶으면 0이고, 남는 항의 합은 ${cxH(v)}이다.`,
          calc: [`1+${sumRe(N)}`, `${jn(s)}*${sumIm(N)}`],
          derived: [2, 3, 4]
        });
      }
      const s = d.pick([1, -1]), N = d.int(5, 40), z2 = zi(0, s);
      if (N % 4 === 0) return null;
      let v = cz(0, 0); for (let k = 1; k <= N; k += 1) v = cadd(v, cpow(z2, k));
      const zH = nb(frac(rt(2), 2) + ' ' + (s > 0 ? '+' : MINUS) + ' ' + frac(rt(2), 2) + I);
      return cxAns(`복소수 ${Z} = ${zH}에 대하여 ${nb(Z + sup(2) + ' + ' + Z + sup(4) + ' + ' + Z + sup(6) + ' + ⋯ + ' + Z + sup(2 * N))}${endJ(sup(2), '을/를')} ${ABI}(${va}, ${vb}는 실수) 꼴로 나타내시오.`, v, {
        explain: `${nb(Z + ' = ' + frac(rt(2), 2) + '(1 ' + (s > 0 ? '+' : MINUS) + ' ' + I + ')')}이므로 ${nb(Z + sup(2))} = ${frac(1, 2)}${nb('(1 ' + (s > 0 ? '+' : MINUS) + ' ' + I + ')' + sup(2))} = ${frac(1, 2)} × ${cxP(zi(0, 2 * s))} = ${cxH(z2)}이다. 주어진 식은 ${s > 0 ? nb(I + ' + ' + I + sup(2) + ' + ⋯ + ' + I + sup(N)) : nb('(' + MINUS + I + ') + (' + MINUS + I + ')' + sup(2) + ' + ⋯ + (' + MINUS + I + ')' + sup(N))}이고, 네 항씩 묶으면 0이므로 남는 항의 합은 ${cxH(v)}이다.`,
        calc: [sumRe(N), `${jn(s)}*${sumIm(N)}`],
        derived: [2, 3, 4, N]
      });
    }, { count: 2 })
  ]);

  // ── 음수의 제곱근 ──
  // 근호 안이 음수인 수의 글: √−12
  const rn = (n) => rt(MINUS + n);
  // k√t 의 글(t = 1 이면 수만), 허수이면 뒤에 i
  const radNum = (k, t, im) => { const head = t === 1 ? String(Math.abs(k)) : (Math.abs(k) === 1 ? '' : Math.abs(k)) + rt(t); return nb((k < 0 ? MINUS : '') + head + (im ? I : '')); };
  // 근호 안의 수 n 을 √n = k√t 로
  const kt = (n) => sqParts(n);
  B.addTypes(UNIT, 'neg', [
    T('neg-root', '음수의 제곱근', '①23 ①36', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 5), t = d.pick([2, 3, 5, 6, 7]), m = k * k * t;
        return inline(`${MINUS}${m}의 제곱근을 허수단위 ${I}를 써서 나타내시오.`, '±{0}' + rt('{1}') + I, [{ answer: k }, { answer: t }], {
          shown: nb('±' + k + rt(t) + I),
          explain: `${nb('(' + k + rt(t) + I + ')' + sup(2) + ' = ' + (k * k * t) + I + sup(2) + ' = ' + MINUS + m)}, ${nb('(' + MINUS + k + rt(t) + I + ')' + sup(2) + ' = ' + MINUS + m)}이므로 ${MINUS}${m}의 제곱근은 ${nb('±' + rt(m) + I + ' = ±' + k + rt(t) + I)}이다.`,
          facts: { calc: [[`(${m}/${t})**0.5`, 0], [`${m}/(${k}*${k})`, 1]], derived: [k, t, 0.5] }
        });
      }
      const k = d.int(2, 9), a = d.int(2, 8), t = d.pick([2, 3, 5, 6]);
      const yes = [
        `${MINUS}${k * k}의 제곱근은 ${nb(k + I)}와 ${nb(MINUS + k + I)}이다.`,
        `${nb(rn(k * k) + ' = ' + k + I)}이다.`,
        `${nb(rn(1) + ' = ' + I)}이다.`,
        `${nb('(' + rt(t) + I + ')' + sup(2) + ' = ' + MINUS + t)}이다.`,
        `${nb('(' + MINUS + a + I + ')' + sup(2) + ' = ' + MINUS + a * a)}이다.`
      ];
      const no = [
        [`${nb(rn(k * k) + ' = ±' + k + I)}이다.`, `${nb(rn(k * k) + ' = ' + k + I)}이다. ${rn(k * k)}${endJ(rn(k * k), '은/는')} ${MINUS}${k * k}의 두 제곱근 가운데 ${nb(k + I)}만 나타낸다.`],
        [`${MINUS}${k * k}의 제곱근은 ${nb(k + I)} 하나뿐이다.`, `${MINUS}${k * k}의 제곱근은 ${nb(k + I)}와 ${nb(MINUS + k + I)}의 두 개이다.`, `${MINUS}${k * k}의 제곱근은 ${nb(k + I)}와 ${nb(MINUS + k + I)}이다.`],
        [`${nb('(' + a + I + ')' + sup(2) + ' = ' + a * a)}이다.`, `${nb('(' + a + I + ')' + sup(2) + ' = ' + a * a + I + sup(2) + ' = ' + MINUS + a * a)}이다.`],
        [`${rn(1)}${endJ(rn(1), '은/는')} 제곱하여 1이 되는 수이다.`, `${rn(1)}${endJ(rn(1), '은/는')} 제곱하여 ${MINUS}1이 되는 수 ${I}이다.`, `${nb(rn(1) + ' = ' + I)}이다.`]
      ];
      return claimQ(d, '음수의 제곱근에 대한 다음 설명 가운데 옳은 것은?', yes, no, true);
    }, { count: 2 }),
    T('neg-add', '음수의 제곱근의 덧셈과 뺄셈', '①24', (d) => {
      const t = d.pick([2, 3, 5, 6, 7]), a = d.int(1, 4), b = d.int(1, 4), c = d.pick([1, 2, 3, -1, -2, -3]), k = a + c * b;
      if (a === b || Math.abs(k) < 2) return null;
      const ex = `${rn(a * a * t)} ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${rn(b * b * t)}`;
      return radImAns('다음을 계산하시오.', k, t, {
        figure: exq(ex),
        explain: `${nb(rn(a * a * t) + ' = ' + radNum(a, t, true))}, ${nb(rn(b * b * t) + ' = ' + radNum(b, t, true))}이므로 ${nb(radNum(a, t, true) + ' ' + (c < 0 ? MINUS : '+') + ' ' + (Math.abs(c * b) === 1 ? '' : Math.abs(c * b)) + rt(t) + I + ' = ' + radNum(k, t, true))}이다.`,
        calc: [`${a}+${jn(c)}*${b}`, `${a * a * t}/(${a}*${a})`],
        derived: [a, b]
      });
    }),
    T('neg-mul', '음수의 제곱근의 곱셈과 나눗셈', '①25', (d, n) => {
      // 값: { re: [k, t] 실수 k√t, im: [k, t] 허수 k√t i }
      let ex, val, why;
      if (n === 0) {
        const kind = d.int(0, 2);
        // √(−p) √(−q) = −√(pq), √p √(−q) = √(pq) i, √(−p) √q = √(pq) i  (p, q 를 고른다)
        const p = d.pick([2, 3, 5, 6]), q = d.until(() => d.int(2, 12), (x) => x !== p);
        const [kk, tt] = kt(p * q);
        if (kind === 0) { ex = `${rn(p)} × ${rn(q)}`; val = { k: -kk, t: tt, im: false }; why = `${nb(rn(p) + ' = ' + rt(p) + I)}, ${nb(rn(q) + ' = ' + rt(q) + I)}이므로 곱은 ${nb(rt(p * q) + I + sup(2) + ' = ' + MINUS + radNum(kk, tt))}이다. 두 수가 모두 음수일 때는 ${nb(rt(V('a')) + rt(V('b')) + ' = ' + rt(V('a') + V('b')))}가 성립하지 않는다.`; }
        else if (kind === 1) { ex = `${rt(p)} × ${rn(q)}`; val = { k: kk, t: tt, im: true }; why = `${nb(rn(q) + ' = ' + rt(q) + I)}이므로 곱은 ${nb(rt(p * q) + I + (kk > 1 ? ' = ' + radNum(kk, tt, true) : ''))}이다.`; }
        else { ex = `${rn(p)} × ${rt(q)}`; val = { k: kk, t: tt, im: true }; why = `${nb(rn(p) + ' = ' + rt(p) + I)}이므로 곱은 ${nb(rt(p * q) + I + (kk > 1 ? ' = ' + radNum(kk, tt, true) : ''))}이다.`; }
      } else {
        const kind = d.int(0, 2);
        // √p/√(−q) = −√(p/q) i, √(−p)/√q = √(p/q) i, √(−p)/√(−q) = √(p/q) (p = q·m²·… 로 근호가 정리되게)
        const q = d.pick([2, 3, 5]), m = d.int(2, 4), p = q * m * m;
        if (kind === 0) { ex = frac(rt(p), rn(q)); val = { k: -m, t: 1, im: true }; why = `${nb(rn(q) + ' = ' + rt(q) + I)}이므로 ${frac(rt(p), nb(rt(q) + I))} = ${frac(m, I)} = ${nb(MINUS + m + I)}이다. 분모만 음수일 때는 ${nb(frac(rt(V('a')), rt(V('b'))) + ' = ' + rt(frac(V('a'), V('b'))))}가 성립하지 않는다.`; }
        else if (kind === 1) { ex = frac(rn(p), rt(q)); val = { k: m, t: 1, im: true }; why = `${nb(rn(p) + ' = ' + rt(p) + I)}이므로 ${frac(nb(rt(p) + I), rt(q))} = ${nb(m + I)}이다.`; }
        else { ex = frac(rn(p), rn(q)); val = { k: m, t: 1, im: false }; why = `${frac(nb(rt(p) + I), nb(rt(q) + I))} = ${frac(rt(p), rt(q))} = ${m}이다.`; }
      }
      const opts = [val, { k: -val.k, t: val.t, im: val.im }, { k: val.k, t: val.t, im: !val.im }, { k: -val.k, t: val.t, im: !val.im }];
      const h = (o) => (o.t === 1 && !o.im ? iq(o.k) : radNum(o.k, o.t, o.im));
      const extra = n === 1 ? { k: val.k * val.k, t: 1, im: false } : null;
      const rows = opts.map((o, i) => [h(o), i === 0]);
      if (extra && extra.k !== Math.abs(val.k)) rows.push([h(extra), false]);
      return choose(d, '다음 식을 계산한 값은?', rows, { figure: exq(ex), explain: why, facts: { rule: n === 0 ? 'neg-mul' : 'neg-div' } });
    }, { count: 2 }),
    T('neg-mix', '음수의 제곱근이 섞인 식을 a + bi 꼴로 나타내기', '①26', (d, n) => {
      if (n === 0) {
        // √−(k1²t)·√−(k2²t) + √(m²q)/√−q + √−(n²r)/√−r
        const t = d.pick([2, 3, 5]), k1 = d.int(1, 3), k2 = d.int(1, 3), m = d.int(2, 4), q = d.pick([2, 3]), nn = d.int(2, 4), r = d.pick([2, 3, 5]);
        const p1 = k1 * k1 * t, p2 = k2 * k2 * t, re = -k1 * k2 * t + nn, im = -m;
        if (p1 === p2 || re === 0) return null;
        const ex = `${rn(p1)} × ${rn(p2)} + ${frac(rt(m * m * q), rn(q))} + ${frac(rn(nn * nn * r), rn(r))}`;
        return cxAns(CALC_ABI, zi(re, im), {
          figure: exq(ex),
          explain: `${nb(rn(p1) + ' × ' + rn(p2) + ' = ' + radNum(k1, t, true) + ' × ' + radNum(k2, t, true) + ' = ' + iq(-k1 * k2 * t))}, ${frac(rt(m * m * q), rn(q))} = ${frac(m + rt(q), rt(q) + I)} = ${frac(m, I)} = ${nb(MINUS + m + I)}, ${frac(rn(nn * nn * r), rn(r))} = ${frac(nn + rt(r) + I, rt(r) + I)} = ${nn}이므로 모두 더하면 ${cxH(zi(re, im))}이다.`,
          calc: [`0-(${p1}*${p2})**0.5+(${nn * nn * r}/${r})**0.5`, `0-(${m * m * q}/${q})**0.5`],
          derived: [0.5]
        });
      }
      // (p + √−(k²t))(q − √−(l²t)) = (pq + klt) + (kq − pl)√t i
      const t = d.pick([2, 3, 5, 6, 7]), k = d.int(1, 3), l = d.int(1, 3), p = d.int(1, 5), q = d.int(1, 5), re = p * q + k * l * t, co = k * q - p * l;
      if (co === 0) return null;
      const ex = `(${p} + ${rn(k * k * t)})(${q} ${MINUS} ${rn(l * l * t)})`;
      return inline(`${CALC_ABI}${NOTE01}`, '{0} {1}' + rt('{2}') + I, [{ answer: re, signed: true }, { answer: co, signed: true }, { answer: t }], {
        shown: nb(iq(re) + (co < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(co) === 1 ? '' : Math.abs(co)) + rt(t) + I),
        figure: exq(ex),
        explain: `${nb(rn(k * k * t) + ' = ' + radNum(k, t, true))}, ${nb(rn(l * l * t) + ' = ' + radNum(l, t, true))}이므로 ${nb('(' + p + ' + ' + radNum(k, t, true) + ')(' + q + ' ' + MINUS + ' ' + radNum(l, t, true) + ')')}을 전개하면 ${nb(p * q + moreH([[-p * l, rt(t) + I], [k * q, rt(t) + I]]) + ' + ' + (k * l * t))} = ${nb(iq(re) + (co < 0 ? ' ' + MINUS + ' ' : ' + ') + (Math.abs(co) === 1 ? '' : Math.abs(co)) + rt(t) + I)}이다.`,
        facts: { calc: [[`${p}*${q}+${k}*${l}*${t}`, 0], [`${k}*${q}-${p}*${l}`, 1], [`${k * k * t}/(${k}*${k})`, 2]], derived: [k, l, t] }
      });
    }, { count: 2 }),
    T('neg-claim', '음수의 제곱근 계산의 참·거짓', '①27', (d) => {
      const a = d.int(2, 9), p = d.pick([2, 3, 5, 6]), q = d.until(() => d.pick([2, 3, 5, 6, 7, 8]), (x) => x !== p), m = d.int(2, 3), r = d.pick([2, 3]);
      const [kk, tt] = kt(p * q);
      const pool = [
        d.bool() ? [nb(rt(`(${MINUS}${a})${sup(2)}`) + ' = ' + MINUS + a), false] : [nb(rt(`(${MINUS}${a})${sup(2)}`) + ' = ' + a), true],
        d.bool() ? [nb(rn(p) + ' × ' + rn(q) + ' = ' + radNum(kk, tt)), false] : [nb(rn(p) + ' × ' + rn(q) + ' = ' + MINUS + radNum(kk, tt)), true],
        d.bool() ? [nb(frac(rt(m * m * r), rn(r)) + ' = ' + MINUS + m + I), true] : [nb(frac(rt(m * m * r), rn(r)) + ' = ' + m + I), false]
      ];
      const why = [
        `${rt(`(${MINUS}${a})${sup(2)}`)} = ${rt(a * a)} = ${a}`,
        `${rn(p)} × ${rn(q)} = ${rt(p)}${I} × ${rt(q)}${I} = ${MINUS}${radNum(kk, tt)}`,
        `${frac(rt(m * m * r), rn(r))} = ${frac(m, I)} = ${MINUS}${m}${I}`
      ];
      return pickSets(d, '다음 보기 가운데 옳은 것만을 있는 대로 고른 것은?', pool, { explain: why.join(', ') + '이다.' });
    })
  ]);

  // ── 복소수의 조건과 켤레복소수 ──
  B.addTypes(UNIT, 'cond', [
    T('cond-zclaim', '켤레복소수의 성질의 참·거짓', '①32', (d) => {
      const W = V('w'), WB = bar(W);
      const yes = [
        `${nb(Z + ' + ' + ZB)}는 항상 실수이다.`,
        `${nb(Z + ZB)}는 항상 실수이다.`,
        `${nb(Z + ' = ' + ZB)}이면 ${Z}는 실수이다.`,
        `${nb(Z + ZB + ' = 0')}이면 ${nb(Z + ' = 0')}이다.`,
        `${nb(bar(Z + ' + ' + W) + ' = ' + ZB + ' + ' + WB)}이다.`,
        `${nb(bar(Z + W) + ' = ' + ZB + WB)}이다.`
      ];
      const no = [
        `${nb(Z + sup(2))}이 실수이면 ${Z}는 실수이다.`,
        `${nb(Z + ' + ' + ZB + ' = 0')}이면 ${Z}는 실수부분이 0인 허수이다.`,
        `${nb(Z + ' ' + MINUS + ' ' + ZB)}는 항상 허수이다.`,
        `${nb(Z + ZB + ' = 1')}이면 ${nb(Z + ' = 1')} 또는 ${nb(Z + ' = ' + MINUS + '1')}이다.`
      ];
      const why = {
        [no[0]]: `${nb(Z + ' = ' + I)}이면 ${nb(Z + sup(2) + ' = ' + MINUS + '1')}은 실수이지만 ${Z}는 실수가 아니다`,
        [no[1]]: `${nb(Z + ' = 0')}이면 ${nb(Z + ' + ' + ZB + ' = 0')}이지만 0은 허수가 아니다`,
        [no[2]]: `${Z}가 실수이면 ${nb(Z + ' ' + MINUS + ' ' + ZB + ' = 0')}이다`,
        [no[3]]: `${nb(Z + ' = ' + I)}이면 ${nb(Z + ZB + ' = ' + I + '(' + MINUS + I + ') = 1')}이다`
      };
      const nT = d.int(1, 2), rows = d.shuffle(d.shuffle(yes).slice(0, nT).map((s) => [s, true]).concat(d.shuffle(no).slice(0, 3 - nT).map((s) => [s, false])));
      return pickSets(d, `복소수 ${Z}, ${V('w')}에 대하여 다음 보기 가운데 옳은 것만을 있는 대로 고른 것은? (단, ${ZB}, ${WB}는 각각 ${Z}, ${V('w')}의 켤레복소수이다.)`, rows, {
        explain: `${nb(Z + ' = ' + va + ' + ' + vb + I)}(${va}, ${vb}는 실수)로 놓고 따진다. ` + rows.filter((r) => !r[1]).map((r) => why[r[0]]).join('. ') + '.'
      });
    }),
    T('cond-zsolve', 'z와 z̄가 낀 등식에서 z 구하기', '①34', (d, n) => {
      const a = nz(d, -5, 5), b = nz(d, -5, 5), z = zi(a, b), zb = cconj(z);
      if (n === 0) {
        const c1 = zi(nz(d, -3, 3), nz(d, -3, 3)), c2 = zi(nz(d, -3, 3), nz(d, -3, 3)), [p, q, r, s] = [c1.r.p, c1.m.p, c2.r.p, c2.m.p];
        if (p * p + q * q === r * r + s * s) return null;
        const rhs = cadd(cmul(c1, z), cmul(c2, zb));
        if (rhs.r.p === 0 || rhs.m.p === 0) return null;
        const [e, f] = [rhs.r.p, rhs.m.p], det = (p + r) * (p - r) - (s - q) * (q + s);
        return cxAns(`등식 ${ej(nb(cxP(c1) + Z + ' + ' + cxP(c2) + ZB + ' = ' + cxH(rhs)), '을/를')} 만족시키는 복소수 ${ej(Z, '을/를')} ${ABI}(${va}, ${vb}는 실수) 꼴로 나타내시오. ${ZBAR_NOTE}`, z, {
          explain: `${nb(Z + ' = ' + va + ' + ' + vb + I)}로 놓으면 ${nb(ZB + ' = ' + va + ' ' + MINUS + ' ' + vb + I)}이다. 좌변을 정리하면 ${nb('(' + sumH([[p + r, va], [s - q, vb]]) + ') + (' + sumH([[q + s, va], [p - r, vb]]) + ')' + I)}이므로 ${nb(sumH([[p + r, va], [s - q, vb]]) + ' = ' + iq(e))}, ${nb(sumH([[q + s, va], [p - r, vb]]) + ' = ' + iq(f))}${endJ(iq(f), '을/를')} 연립하여 풀면 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이다. 따라서 ${nb(Z + ' = ' + cxH(z))}이다.`,
          calc: [`(${jn(e)}*(${jn(p)}-${jn(r)})-(${jn(s)}-${jn(q)})*${jn(f)})/(${det})`, `((${jn(p)}+${jn(r)})*${jn(f)}-(${jn(q)}+${jn(s)})*${jn(e)})/(${det})`],
          derived: [Math.abs(det)]
        });
      }
      // (p + qi)z + k·i·z̄ = rhs 에서 z 를 구해 zz̄
      const c1 = zi(nz(d, -3, 3), nz(d, -3, 3)), k = nz(d, -3, 3), c2 = zi(0, k), [p, q, s] = [c1.r.p, c1.m.p, k];
      if (p * p + q * q === s * s) return null;
      const rhs = cadd(cmul(c1, z), cmul(c2, zb));
      if (rhs.r.p === 0 || rhs.m.p === 0) return null;
      const [e, f] = [rhs.r.p, rhs.m.p], det = p * p - (s - q) * (q + s);
      const L = nb(`${cxP(c1)}${Z}${k < 0 ? ' ' + MINUS + ' ' : ' + '}${Math.abs(k) === 1 ? '' : Math.abs(k)}${I}${ZB}`);
      const aE = `(${jn(e)}*${jn(p)}-(${jn(s)}-${jn(q)})*${jn(f)})/(${det})`, bE = `(${jn(p)}*${jn(f)}-(${jn(q)}+${jn(s)})*${jn(e)})/(${det})`;
      return ansV(`등식 ${ej(L + ' = ' + cxH(rhs), '을/를')} 만족시키는 복소수 ${Z}에 대하여 ${nb(Z + ZB)}의 값은? ${ZBAR_NOTE}`, Q(a * a + b * b), 'int', {
        explain: `${nb(Z + ' = ' + va + ' + ' + vb + I)}로 놓고 좌변을 정리하면 ${nb('(' + sumH([[p, va], [s - q, vb]]) + ') + (' + sumH([[q + s, va], [p, vb]]) + ')' + I)}이다. 실수부분과 허수부분을 견주어 풀면 ${nb(va + ' = ' + iq(a))}, ${nb(vb + ' = ' + iq(b))}이므로 ${nb(Z + ZB + ' = ' + va + sup(2) + ' + ' + vb + sup(2) + ' = ' + (a * a + b * b))}이다.`,
        facts: { value: `${aE}*${aE}+${bE}*${bE}`, derived: [Math.abs(det)] }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
