// 1학년 1학기 1단원 9까지의 수 — 단원 틀, 그림 도우미, 기본 문항(수 세기, 수 읽기, 몇째, 수의 순서).
// 수집해 둔 평가 자료(미래엔·아이스크림미디어·천재, 기본 문서 22개와 심화 문서 5개)에서 뽑은 꼴 목록(기본꼴_1 70꼴, 심화꼴 48꼴)을
// 처음부터 끝까지 대조하여, 꼴마다 ① 이 단원(0과 9까지의 수)의 일인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (1만큼 더 큰 수와 더 작은 수, 0, 수의 크기 비교의 기본 문항과 실력 문항은 1-1-1b.js에 있다.)
// 영역은 수와 연산, 성취기준은 [2수01-01](수를 세고 읽고 쓰기)과 [2수01-03](수의 계열, 크기 비교) 가운데 0과 9까지의 수이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다(주는 것이 그림인가 수인가 말인가, 묻는 것이 수인가 말인가 그림인가, 맞는 것인가 틀린 것인가).
//    숫자만 다르거나 물건·이름만 다른 것은 한 번만 싣는다. 다만 1~5와 6~9의 세기는 차시가 달라 따로 싣고 facts.rule 에 이름을 단다.
//  - 답으로 한글을 쓰게 하지 않는다(교육과정: 수를 「여덟」「첫째」처럼 한글로 쓰게 하는 것은 지양한다). 읽는 말과 순서 말은 고르게 하고, 답 칸에는 숫자만 받는다.
//  - 색칠하기·그리기·잇기(작도)는 「바르게 색칠한 것·이은 것 고르기」로 바꾸어 싣는다.
//  - 수는 0부터 9까지만 쓴다. 덧셈식·뺄셈식, 모으기와 가르기, 「2만큼 더 큰 수」, 10 이상의 수는 쓰지 않는다. 비교하는 기호(>, <)도 이 단원에서는 쓰지 않는다.
//  - 물음은 짧게, 한 문장에 한 가지만 적는다. 세는 물건은 다섯 개씩 끊어 가지런히 놓고 한 그림에 9개를 넘기지 않는다.
//
// 뺀 것과 까닭(이 파일이 맡은 묶음)
//  - 한글 쓰기·서술형: 수를 넣어 문장 만들기(기본 16).
//  - 작도뿐인 것: 흩어진 수를 순서대로 잇기(기본 36). 색칠·잇기 꼴(기본 9·13·14·17·18, 심화 4·9·12)은 고르기로 바꾸어 실었다.
//  - 같은 문제: 세어 보고 보기 수에서 고르기(기본 2)는 세어 쓰기와 답 꼴만 다르다. 두 가지 읽기가 다 맞는 짝 고르기(기본 7의 변형)는 「수를 두 가지로 읽기」와,
//    그림을 주고 관계있는 것 고르기(기본 10의 변형, 심화 5의 변형)는 「수를 나타내는 것 세기」에 세기만 얹은 것이다.
//    □개만큼 묶고 남은 것의 수(심화 11)는 색칠한 것과 색칠하지 않은 것 세기와 같은 일이고, 「9는 6과 □」로 읽히면 1-1-3의 가르기다.
//  - 그림 없이 순서 둘을 개수로 바꾸어 합치는 문제(기본 29 「앞에서 둘째, 뒤에서 넷째이면 모두 몇 명」)는 1-1-3의 모으기에 기대므로 뺐다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, tagged, numbers, table, josa, N, M, C } = B.kit;
  const G = B.kit.geo;
  const NUM = '2수01-01', ORDER = '2수01-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 낱말 ────────────────────────────────────────────────────
  const NATIVE = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'];
  const SINO = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const NTH = ['', '첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째'];
  // 소리나 모양이 닮아 헷갈리는 수(여섯과 여덟, 일곱과 아홉, 삼과 사, 일과 이)
  const CONF = { 1: 2, 2: 1, 3: 4, 4: 3, 5: 6, 6: 8, 7: 9, 8: 6, 9: 7 };
  const ANIMALS = ['토끼', '사자', '기린', '여우', '사슴', '오리', '하마', '참새'];
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const some = (d, list, k) => d.shuffle(list).slice(0, k);
  // 「일곱」이라고, 「칠」이라고 — 낱말을 따옴표로 묶고 토씨를 붙인다.
  const q = (word, pair) => '「' + word + '」' + (pair ? josa(word, pair).slice(String(word).length) : '');
  const both = (n) => `${q(NATIVE[n])} 또는 ${q(SINO[n], '이라고/라고')}`;
  // 정답 자리 p 와 헷갈릴 자리(반대쪽에서 센 자리, 옆 자리)를 겹치지 않게 넷 고른다.
  const spots = (d, n, p) => { const out = []; for (const v of [p, n + 1 - p, p - 1, p + 1, p + 2, p - 2]) if (v >= 1 && v <= n && !out.includes(v) && out.length < 4) out.push(v); return d.shuffle(out); };

  // ── 그림 ────────────────────────────────────────────────────
  // 그림 속 수와 이름은 aria-label 에 적는다(검사가 그 글로 식의 수를 맞춰 본다).
  const f1 = (v) => String(Math.round(v * 10) / 10);
  const paint = (fill, line, width) => `style="fill:${fill};stroke:${line};stroke-width:${width || 1}"`;
  const svg = (w, h, scale, label, body, more) => `<svg class="mb-dots" viewBox="0 0 ${f1(w)} ${f1(h)}" width="${Math.round(w * scale)}" role="img" aria-label="${label}"${more || ''}>${body}</svg>`;
  const word = (x, y, text, size, more) => `<text class="mb-axis-label" style="font-size:${size}px${more || ''}" x="${f1(x)}" y="${f1(y)}" text-anchor="middle">${text}</text>`;
  const KIND = {
    ball: { name: '공', fill: '#f5b942', line: '#a86a00' },
    star: { name: '별', fill: '#fde047', line: '#a16207' },
    apple: { name: '사과', fill: '#f87171', line: '#991b1b' },
    block: { name: '블록', fill: '#93c5fd', line: '#1e3a8a' }
  };
  const KEYS = Object.keys(KIND);
  const PASTEL = ['#fecaca', '#fed7aa', '#fef08a', '#bbf7d0', '#bfdbfe', '#ddd6fe', '#fbcfe8', '#a5f3fc', '#e7e5e4'];
  const BEADS = [['빨간색', '#ef4444', '#991b1b'], ['노란색', '#facc15', '#a16207'], ['파란색', '#3b82f6', '#1e3a8a']];
  // 물건 하나. off 이면 색칠하지 않은(흰) 것으로 그린다.
  function mark(kind, x, y, r, off) {
    const k = KIND[kind], ink = paint(off ? '#fff' : k.fill, k.line);
    if (kind === 'block') return `<rect x="${f1(x - r * 0.88)}" y="${f1(y - r * 0.88)}" width="${f1(r * 1.76)}" height="${f1(r * 1.76)}" rx="1.6" ${ink}/>`;
    if (kind === 'star') {
      let points = '';
      for (let i = 0; i < 10; i += 1) { const a = -Math.PI / 2 + (i * Math.PI) / 5, len = i % 2 ? r * 0.5 : r * 1.12; points += f1(x + len * Math.cos(a)) + ',' + f1(y + len * Math.sin(a)) + ' '; }
      return `<polygon points="${points.trim()}" ${ink}/>`;
    }
    if (kind === 'apple') return `<circle cx="${f1(x)}" cy="${f1(y + r * 0.12)}" r="${f1(r * 0.9)}" ${ink}/><path d="M${f1(x)} ${f1(y - r * 0.76)}q${f1(r * 0.1)} ${f1(-r * 0.42)} ${f1(r * 0.56)} ${f1(-r * 0.46)}" style="fill:none;stroke:#15803d;stroke-width:1.6;stroke-linecap:round"/>`;
    return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" ${ink}/>`;
  }
  // 물건 n 개를 다섯 개씩 끊어 가지런히 놓는다. o.seq: 자리마다의 물건(섞어 놓을 때), o.on: 색칠한 자리(나머지는 흰색),
  // o.r·o.gap·o.cols: 크기와 간격과 한 줄의 개수, o.label: 그림 설명.
  function things(kind, n, o) {
    o = o || {};
    const seq = o.seq || Array.from({ length: n }, () => kind), r = o.r || 6.5, gap = o.gap || 18, cols = o.cols || 5, pad = r + (o.pad || 4.5), rows = Math.max(1, Math.ceil(seq.length / cols));
    const w = pad * 2 + (cols - 1) * gap, h = pad * 2 + (rows - 1) * gap;
    const body = seq.map((kd, i) => mark(kd, pad + (i % cols) * gap, pad + Math.floor(i / cols) * gap, r, o.on ? !o.on.includes(i) : false)).join('');
    const said = o.label || `${KIND[kind].name} ${seq.length}개` + (o.on ? `, 그 가운데 색칠한 것 ${o.on.length}개` : '');
    return svg(w, h, o.scale || 1.2, said, body);
  }
  // 두 가지 물건이 섞여 있는 그림
  function mixed(seq) {
    const kinds = seq.filter((kd, i) => seq.indexOf(kd) === i), count = (kd) => seq.filter((v) => v === kd).length;
    return things(kinds[0], seq.length, { seq, label: `${josa(KIND[kinds[0]].name, '과/와')} ${josa(KIND[kinds[1]].name, '이/가')} 섞여 있다: ${kinds.map((kd) => KIND[kd].name + ' ' + count(kd) + '개').join(', ')}` });
  }
  // 한 줄로 놓은 동그라미 n 개. on: 색칠한 자리(0부터).
  function strip(n, on) {
    const r = 6.5, gap = 17, pad = 10.5, w = pad * 2 + (n - 1) * gap;
    const body = range(0, n - 1).map((i) => `<circle cx="${f1(pad + i * gap)}" cy="${pad}" r="${r}" ${on.includes(i) ? paint('#1d4ed8', '#1e3a8a') : paint('#fff', '#64748b')}/>`).join('');
    return svg(w, pad * 2, 1.15, `동그라미 ${n}개를 한 줄로 놓고 ${on.length}개를 색칠(왼쪽에서 ${on.map((i) => i + 1).join(', ')}번째)`, body, ' style="vertical-align:middle"');
  }
  // 한 줄로 선 것. cells: [{ name(아래에 적는 이름), fill, line, said(그림 설명에 적는 말) }], o.left·o.right: 두 끝에 적는 말(앞·뒤, 왼쪽·오른쪽), o.what: 그림 설명의 첫머리.
  function queue(cells, o) {
    const n = cells.length, named = cells.some((c) => c.name), r = named ? 12 : 10.5, pitch = named ? 36 : 28, pad = 8;
    const w = pad * 2 + (n - 1) * pitch + r * 2, cy = 21 + r, h = cy + r + (named ? 21 : 7);
    let body = `<text class="mb-axis-label" style="font-size:13px" x="${pad}" y="13" text-anchor="start">${o.left}</text><text class="mb-axis-label" style="font-size:13px" x="${f1(w - pad)}" y="13" text-anchor="end">${o.right}</text>`;
    cells.forEach((c, i) => {
      const x = pad + r + i * pitch;
      body += `<circle cx="${f1(x)}" cy="${f1(cy)}" r="${r}" ${paint(c.fill || '#f1f5f9', c.line || '#475569', 1.2)}/>` + (c.name ? word(x, cy + r + 15, c.name, 12) : '');
    });
    return svg(w, h, 1, `${o.what}. 왼쪽 끝이 「${o.left}」, 오른쪽 끝이 「${o.right}」. 왼쪽부터 ${cells.map((c) => c.said || c.name).join(', ')}`, body);
  }
  // 위로 쌓은 칸. names: 위에서부터 칸에 적는 이름.
  function stack(names) {
    const n = names.length, bw = 78, bh = 24, pad = 8, top = 21, w = bw + pad * 2, h = top + n * bh + 21;
    let body = word(w / 2, 14, '위', 13) + word(w / 2, top + n * bh + 15, '아래', 13);
    names.forEach((label, i) => { body += `<rect x="${pad}" y="${top + i * bh}" width="${bw}" height="${bh}" ${paint(PASTEL[i % PASTEL.length], '#475569', 1.1)}/>` + word(w / 2, top + i * bh + 16.5, label, 12.5); });
    return svg(w, h, 1, `칸을 위로 쌓았다. 위에서부터 ${names.join(', ')}`, body);
  }
  // n 층 건물(층마다 한 칸). 층수는 적지 않는다.
  function building(n) {
    const bw = 74, bh = 22, pad = 10, top = 20, w = bw + pad * 2, h = top + n * bh + 8;
    let body = `<path d="M${pad - 4} ${top}L${w / 2} 5L${w - pad + 4} ${top}Z" ${paint('#fca5a5', '#475569', 1.1)}/>`;
    for (let i = 0; i < n; i += 1) {
      body += `<rect x="${pad}" y="${top + i * bh}" width="${bw}" height="${bh}" ${paint('#fffdf5', '#475569', 1.1)}/>`
        + [0.2, 0.62].map((at) => `<rect x="${f1(pad + bw * at)}" y="${top + i * bh + 6}" width="13" height="10" ${paint('#bfdbfe', '#475569', 0.8)}/>`).join('');
    }
    body += `<path d="M2 ${top + n * bh + 1}H${w - 2}" style="stroke:#475569;stroke-width:1.6"/>`;
    return svg(w, h, 1, `${n}층 건물. 한 층에 한 칸씩 ${n}칸을 쌓았다`, body);
  }
  // 접시. counts: 접시마다 놓인 물건의 수(0~4), tags: 접시 아래에 적는 이름.
  function plates(counts, kind, tags) {
    const pw = 78, ph = 30, gap = 10, pad = 6, n = counts.length, w = pad * 2 + n * pw + (n - 1) * gap, h = pad + ph + (tags ? 22 : 7);
    let body = '';
    counts.forEach((c, i) => {
      const x = pad + i * (pw + gap), cx = x + pw / 2;
      body += `<rect x="${x}" y="${pad}" width="${pw}" height="${ph}" rx="15" ${paint('#f8fafc', '#64748b', 1.3)}/>`;
      for (let k = 0; k < c; k += 1) body += mark(kind, cx - ((c - 1) * 15) / 2 + k * 15, pad + ph / 2, 5.5);
      if (tags) body += word(cx, pad + ph + 16, tags[i], 13);
    });
    const what = KIND[kind].name;
    return svg(w, h, 1, `접시 ${n}개: ` + counts.map((c, i) => (tags ? tags[i] + ' 접시에 ' : '') + what + ' ' + c + '개').join(', '), body);
  }
  // 칸 셋과 그 사이의 화살표 둘. boxes: 칸에 적는 것(수나 ㉠), caps: 화살표 위에 두 줄로 적는 말, dirs: 화살표가 가리키는 쪽.
  function steps(boxes, caps, dirs, label) {
    const bw = 38, bh = 34, span = 74, pad = 5, w = pad * 2 + 3 * bw + 2 * span, y = 24, mid = y + bh / 2;
    let body = '';
    boxes.forEach((v, i) => {
      const x = pad + i * (bw + span), blank = typeof v === 'string';
      body += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" ${paint('#fff', '#1f2933', blank ? 2 : 1.2)}/>` + word(x + bw / 2, mid + 6, v, blank ? 15 : 18, blank ? ';fill:#1d4ed8' : '');
    });
    caps.forEach((cap, i) => {
      const x1 = pad + bw + i * (bw + span) + 6, x2 = x1 + span - 12, tip = dirs[i] === 'left' ? x1 : x2, back = dirs[i] === 'left' ? 6 : -6;
      body += `<path d="M${x1} ${mid}H${x2}M${tip + back} ${mid - 4.5}L${tip} ${mid}L${tip + back} ${mid + 4.5}" style="fill:none;stroke:#1d4ed8;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round"/>`
        + word((x1 + x2) / 2, 12, cap[0], 11.5, ';fill:#1d4ed8') + word((x1 + x2) / 2, 26, cap[1], 11.5, ';fill:#1d4ed8');
    });
    return svg(w, y + bh + 5, 1, label, body);
  }
  // 수를 한 줄로 놓은 칸. cells: 수, 빈칸의 이름(㉠ …), 가려진 칸(null).
  function numrow(cells, what) {
    const cw = 30, ch = 32, pad = 4, n = cells.length, w = Math.max(pad * 2 + n * cw, 64);
    const body = cells.map((c, i) => {
      const x = pad + i * cw, blank = typeof c === 'string';
      return `<rect x="${x}" y="${pad}" width="${cw}" height="${ch}" ${paint(c === null ? '#cbd5e1' : '#fffdf5', '#1f2933', 1.1)}/>` + (c === null ? '' : word(x + cw / 2, pad + ch / 2 + 6, c, blank ? 14 : 17, blank ? ';fill:#1d4ed8' : ''));
    }).join('');
    return svg(w, pad * 2 + ch, 1, `${what || '수를 한 줄로 놓았다'}. 왼쪽부터 ${cells.map((c) => (c === null ? '가려짐' : c)).join(', ')}`, body);
  }
  const tiles = (list) => G.tiles(list);
  // 같은 단원의 다른 파일이 쓰는 도구
  B.kit.g111 = { NATIVE, SINO, NTH, CONF, ANIMALS, KIND, KEYS, PASTEL, BEADS, range, some, q, both, spots, things, mixed, strip, queue, stack, building, plates, steps, numrow, tiles };

  B.addUnit({
    id: '1-1-1', grade: 1, semester: 1, no: 1, title: '9까지의 수', version: 1,
    groups: [
      {
        id: 'count', title: '수 세기', standard: NUM,
        types: [
          T('count-five', '5까지의 수 세기', '①1·2 심1', (d) => {
            const kind = d.pick(KEYS), n = d.int(2, 5), what = KIND[kind].name;
            return N(`${josa(what, '은/는')} 모두 몇 개인가?`, n, { unit: '개', figure: things(kind, n), explain: `${NATIVE.slice(1, n + 1).join(', ')}${josa(NATIVE[n], '으로/로').slice(NATIVE[n].length)} 세면 ${n}개이다.`, facts: { rule: 'to5', calc: [[String(n), 0]] } });
          }),
          T('count-nine', '9까지의 수 세기', '①1·2 심1', (d) => {
            const kind = d.pick(KEYS), n = d.int(6, 9), what = KIND[kind].name;
            return N(`${josa(what, '은/는')} 모두 몇 개인가?`, n, { unit: '개', figure: things(kind, n), explain: `윗줄이 5개이다. 이어서 ${NATIVE.slice(6, n + 1).join(', ')}${josa(NATIVE[n], '으로/로').slice(NATIVE[n].length)} 세면 ${n}개이다.`, facts: { rule: 'to9', calc: [[String(n), 0]] } });
          }),
          T('count-mixed', '섞여 있는 두 가지 세기', '①1 심1', (d) => {
            const [ka, kb] = some(d, KEYS, 2), [a, b] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x !== y && x + y >= 6 && x + y <= 9);
            const seq = d.shuffle(Array.from({ length: a }, () => ka).concat(Array.from({ length: b }, () => kb))), A = KIND[ka].name, Bn = KIND[kb].name;
            return M(`${josa(A, '과/와')} ${josa(Bn, '은/는')} 각각 몇 개인가?`, [{ label: A, answer: a, unit: '개' }, { label: Bn, answer: b, unit: '개' }], {
              figure: mixed(seq), explain: `${A}만 골라 세면 ${a}개, ${Bn}만 골라 세면 ${b}개이다.`, facts: { calc: [[String(a), 0], [String(b), 1]] }
            });
          }),
          T('count-pair', '그림의 수를 바르게 쓴 것 고르기', '①11', (d) => {
            // 그림마다 수가 하나씩 적혀 있다. 적힌 수는 네 그림의 개수를 서로 바꾸어 놓은 것이라 하나씩 세어 보아야 한다.
            const kinds = d.shuffle(KEYS), counts = some(d, range(5, 9), 4), j = d.int(0, 3), rest = [0, 1, 2, 3].filter((i) => i !== j), said = counts.slice();
            rest.forEach((i, k) => { said[i] = counts[rest[(k + 1) % 3]]; });
            return C('그림의 수를 바르게 쓴 것은?', said.map(String), j, {
              figure: tiles(kinds.map((kd, i) => [String(said[i]), things(kd, counts[i])])),
              explain: `그림을 세면 ${kinds.map((kd, i) => KIND[kd].name + ' ' + counts[i] + '개').join(', ')}이다. ${KIND[kinds[j]].name}의 수 ${josa(counts[j], '을/를')} 바르게 썼다.`,
              facts: { claimed: counts.map((c, i) => [String(c), said[i]]), claimedWant: true }
            });
          }),
          T('count-pick', '수만큼 있는 그림 고르기', '①12·13 심2', (d) => {
            const kind = d.pick(KEYS), what = KIND[kind].name, lo = d.int(4, 6), counts = d.shuffle([lo, lo + 1, lo + 2, lo + 3]), n = d.pick([lo + 1, lo + 2]);
            return C(`${josa(what, '이/가')} ${n}개인 것은?`, LABELS, counts.indexOf(n), {
              figure: tiles(counts.map((c, i) => [LABELS[i], things(kind, c)])), explain: `㉠부터 차례로 세면 ${counts.join('개, ')}개이다.`,
              facts: { choose: { exprs: counts.map(String), rule: 'equals', target: n } }
            });
          }),
          T('count-match', '그림의 수만큼 색칠한 것 고르기', '①13·14 심9', (d) => {
            const kind = d.pick(KEYS), what = KIND[kind].name, n = d.int(4, 7), shaded = d.shuffle([n - 1, n, n + 1]);
            return C(`${what}의 수만큼 색칠한 것은?`, LABELS.slice(0, 3), shaded.indexOf(n), {
              figure: things(kind, n) + tagged(shaded.map((k) => strip(9, range(0, k - 1)))),
              explain: `${josa(what, '은/는')} ${n}개이다. ㉠부터 차례로 ${shaded.join('개, ')}개를 색칠하였다.`, facts: { choose: { exprs: shaded.map(String), rule: 'equals', target: n } }
            });
          }),
          T('count-shaded', '색칠한 것과 색칠하지 않은 것 세기', '①15 심10·11', (d) => {
            const kind = d.pick(KEYS), what = KIND[kind].name, total = d.int(7, 9), k = d.until(() => d.int(2, total - 2), (v) => v !== total - v);
            const on = some(d, range(0, total - 1), k).sort((x, y) => x - y);
            return M(`색칠한 ${josa(what, '과/와')} 색칠하지 않은 ${josa(what, '은/는')} 각각 몇 개인가?`, [{ label: '색칠한 것', answer: k, unit: '개' }, { label: '색칠하지 않은 것', answer: total - k, unit: '개' }], {
              figure: things(kind, total, { on }), explain: `색칠한 것만 세면 ${k}개, 색칠하지 않은 것만 세면 ${total - k}개이다.`, facts: { calc: [[String(k), 0], [`${total}-${k}`, 1]] }
            });
          })
        ]
      },
      {
        id: 'read', title: '수 읽기', standard: NUM,
        types: [
          T('say-count', '세어서 읽는 말 고르기', '①3', (d) => {
            const kind = d.pick(KEYS), what = KIND[kind].name, n = d.int(3, 8), list = d.shuffle([n, n - 1, n + 1, d.pick([n - 2, n + 2].filter((v) => v >= 1 && v <= 9))]);
            return C(`${what}의 수를 바르게 읽은 것은?`, list.map((v) => NATIVE[v]), list.indexOf(n), {
              figure: things(kind, n), explain: `${josa(what, '은/는')} ${n}개이다. ${josa(n, '은/는')} ${q(NATIVE[n], '이라고/라고')} 읽는다.`, facts: { truth: list.map((v) => v === n), want: true }
            });
          }),
          T('say-count-both', '세어서 두 가지로 읽기', '①4 심3', (d) => {
            // 하나 더 세거나 덜 센 아이가 고르는 보기(둘 다 옆 수로 읽은 것)를 넣는다
            const kind = d.pick(KEYS), what = KIND[kind].name, n = d.int(5, 9), m = n === 9 ? 8 : n + d.pick([-1, 1]), rows = d.shuffle([[n, n], [n, m], [m, n], [m, m]]);
            return C(`${what}의 수를 두 가지로 바르게 읽은 것은?`, rows.map(([x, y]) => `${NATIVE[x]}, ${SINO[y]}`), rows.findIndex(([x, y]) => x === n && y === n), {
              figure: things(kind, n), explain: `${josa(what, '은/는')} ${n}개이다. ${josa(n, '은/는')} ${both(n)} 읽는다.`, facts: { truth: rows.map(([x, y]) => x === n && y === n), want: true }
            });
          }),
          T('read-both', '수를 두 가지로 읽기', '①5·7', (d) => {
            const n = d.int(1, 9), c = CONF[n], rows = d.shuffle([[n, n], [c, n], [n, c], [c, c]]);
            return C(`${josa(n, '을/를')} 두 가지로 바르게 읽은 것은?`, rows.map(([x, y]) => `${NATIVE[x]}, ${SINO[y]}`), rows.findIndex(([x, y]) => x === n && y === n), {
              explain: `${josa(n, '은/는')} ${both(n)} 읽는다.`, facts: { truth: rows.map(([x, y]) => x === n && y === n), want: true }
            });
          }),
          T('read-one', '수를 바르게 읽은 말 고르기', '①6', (d) => {
            const n = d.int(1, 9), others = [CONF[n]].concat(some(d, range(1, 9).filter((v) => v !== n && v !== CONF[n]), 2));
            const rows = d.shuffle([[n, d.bool()]].concat(others.map((v) => [v, d.bool()])));
            return C(`수 ${josa(n, '을/를')} 바르게 읽은 것은?`, rows.map(([v, native]) => (native ? NATIVE : SINO)[v]), rows.findIndex(([v]) => v === n), {
              explain: `${josa(n, '은/는')} ${both(n)} 읽는다.`, facts: { truth: rows.map(([v]) => v === n), want: true }
            });
          }),
          T('read-pair-right', '수와 읽는 말의 짝이 맞는 것', '①7', (d) => {
            // 틀린 짝은 다른 보기의 수를 읽은 말이다.
            const ns = some(d, range(1, 9), 4), j = d.int(0, 3), rest = [0, 1, 2, 3].filter((i) => i !== j), read = ns.slice();
            rest.forEach((i, k) => { read[i] = ns[rest[(k + 1) % 3]]; });
            const forms = ns.map(() => d.bool());
            return C('수와 읽는 말을 바르게 짝 지은 것은?', ns.map((v, i) => `${v} - ${(forms[i] ? NATIVE : SINO)[read[i]]}`), j, {
              explain: `${josa(ns[j], '은/는')} ${both(ns[j])} 읽는다.`, facts: { truth: ns.map((v, i) => v === read[i]), want: true }
            });
          }),
          T('read-pair-wrong', '수를 잘못 읽은 것', '①7', (d) => {
            const ns = some(d, range(1, 9), 4), j = d.int(0, 3), forms = ns.map(() => d.bool()), read = ns.map((v, i) => (i === j ? CONF[v] : v));
            return C('수를 잘못 읽은 것은?', ns.map((v, i) => `${v} - ${(forms[i] ? NATIVE : SINO)[read[i]]}`), j, {
              explain: `${josa(ns[j], '은/는')} ${both(ns[j])} 읽는다. ${q((forms[j] ? NATIVE : SINO)[read[j]], '은/는')} ${josa(read[j], '을/를')} 읽은 말이다.`, facts: { truth: ns.map((v, i) => v === read[i]), want: false }
            });
          }),
          T('read-write', '읽는 말을 수로 쓰기', '①8 심8', (d) => {
            const [a, b] = some(d, range(1, 9), 2), first = d.bool(), words = first ? [NATIVE[a], SINO[b]] : [SINO[b], NATIVE[a]], values = first ? [a, b] : [b, a];
            return M('㉠, ㉡을 수로 쓰면?', [{ label: LABELS[0], answer: values[0] }, { label: LABELS[1], answer: values[1] }], {
              figure: tagged(words), explain: `${q(words[0], '은/는')} ${values[0]}, ${q(words[1], '은/는')} ${values[1]}이다.`,
              facts: { calc: [[String(a), first ? 0 : 1]], unseen: [a], big: { written: [[SINO[b], first ? 1 : 0]] } }
            });
          }),
          T('read-triple', '그림과 수와 읽는 말이 모두 맞는 것', '①9 심4', (d) => {
            // 잇기를 고르기로 바꾼 것. 틀린 보기: 읽는 말만 다른 것, 수만 다른 것, 그림만 다른 것.
            const ks = some(d, range(3, 8), 4), kinds = d.shuffle(KEYS), side = () => d.pick([-1, 1]);
            const rows = d.shuffle([[ks[0], ks[0], ks[0]], [ks[1], ks[1], ks[1] + side()], [ks[2], ks[2] + side(), ks[2]], [ks[3], ks[3] + side(), 0]]).map(([c, n, w]) => [c, n, w || n]);
            const j = rows.findIndex(([c, n, w]) => c === n && n === w), forms = rows.map(() => d.bool());
            return C('그림과 수와 읽는 말이 모두 맞는 것은?', LABELS, j, {
              figure: tiles(rows.map(([c, n, w], i) => [LABELS[i], things(kinds[i], c) + `<div style="font-size:1.05rem;font-weight:600">${n}, ${(forms[i] ? NATIVE : SINO)[w]}</div>`])),
              explain: `${LABELS[j]}은 ${josa(KIND[kinds[j]].name, '이/가')} ${rows[j][0]}개이고, ${josa(rows[j][0], '은/는')} ${both(rows[j][0])} 읽는다.`,
              facts: { truth: rows.map(([c, n, w]) => c === n && n === w), want: true }
            });
          }),
          T('read-related', '수를 나타내는 것 세기', '①10 심5', (d) => {
            // 닮은 말(삼과 사), 하나 많거나 적은 점이 섞여 있다.
            const n = d.int(2, 5), near = n + d.pick([-1, 1]), drawn = d.pick([n, near]), dots = (k) => '●'.repeat(k);
            const rows = d.shuffle([[NATIVE[n], n], [SINO[n], n], [dots(drawn), drawn], [SINO[CONF[n]], CONF[n]], [NATIVE[near], near]]), right = rows.filter((row) => row[1] === n);
            return N(`다음 중에서 ${josa(n, '을/를')} 나타내는 것은 모두 몇 개인가?`, right.length, {
              unit: '개', figure: numbers(rows.map((row) => row[0])), explain: `${josa(n, '을/를')} 나타내는 것은 ${right.map((row) => row[0]).join(', ')}이다.`,
              facts: { tallyOf: { list: rows.map((row) => String(row[1])), target: String(n) } }
            });
          }),
          T('read-odd', '나타내는 수가 다른 하나', '심6', (d) => {
            const n = d.int(2, 5), m = d.pick([CONF[n], n + 1]), rows = d.shuffle([[NATIVE[n], n], ['●'.repeat(n), n], [String(n), n], [d.bool() ? NATIVE[m] : SINO[m], m]]);
            return C('나타내는 수가 나머지와 다른 하나는?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] !== n), {
              explain: `${q(rows.find((row) => row[1] !== n)[0], '은/는')} ${josa(m, '을/를')} 나타낸다. 나머지는 모두 ${josa(n, '을/를')} 나타낸다.`,
              facts: { choose: { exprs: rows.map((row) => String(row[1])), rule: 'odd' }, unseen: [n, m] }
            });
          }),
          T('read-word-pair', '두 가지 읽는 말의 짝', '심7', (d) => {
            const ns = some(d, range(1, 9), 4), j = d.int(0, 3), other = d.until(() => d.int(1, 9), (v) => v !== ns[j]), sino = ns.map((v, i) => (i === j ? other : v));
            return C('두 말이 나타내는 수가 서로 다른 것은?', ns.map((v, i) => `${NATIVE[v]}, ${SINO[sino[i]]}`), j, {
              explain: `${q(NATIVE[ns[j]], '은/는')} ${ns[j]}, ${q(SINO[other], '은/는')} ${josa(other, '을/를')} 읽은 말이다.`, facts: { truth: ns.map((v, i) => v === sino[i]), want: false }
            });
          }),
          T('read-pick', '읽는 말만큼 있는 그림 고르기', '①12', (d) => {
            const kind = d.pick(KEYS), what = KIND[kind].name, lo = d.int(3, 6), counts = d.shuffle([lo, lo + 1, lo + 2, lo + 3]), n = d.pick([lo + 1, lo + 2]);
            return C(`${what}의 수가 ${q(NATIVE[n])}인 것은?`, LABELS, counts.indexOf(n), {
              figure: tiles(counts.map((c, i) => [LABELS[i], things(kind, c)])), explain: `${q(NATIVE[n], '은/는')} ${n}이다. ${LABELS[counts.indexOf(n)]}의 ${josa(what, '이/가')} ${n}개이다.`,
              facts: { choose: { exprs: counts.map(String), rule: 'equals', target: n } }
            });
          })
        ]
      },
      {
        id: 'nth', title: '몇째', standard: NUM,
        types: [
          T('nth-words', '순서를 나타내는 말의 차례', '①20 심14', (d) => {
            // 틀린 보기: 개수를 나타내는 말(여섯), 빈칸 바로 뒤의 말, 멀리 떨어진 말
            const s = d.int(1, 6), k = s + 2, far = k + 2 <= 9 ? k + 2 : k - 3, rows = d.shuffle([NTH[k], NATIVE[k], NTH[k + 1], NTH[far]]);
            return C('순서에 맞게 □ 안에 알맞은 말은?', rows, rows.indexOf(NTH[k]), {
              figure: lines([`${NTH[s]}, ${NTH[s + 1]}, ${box()}, ${NTH[s + 3]}`]), explain: `${NTH[k - 1]} 다음은 ${NTH[k]}이다. ${q(NATIVE[k], '은/는')} 순서가 아니라 개수를 나타내는 말이다.`,
              facts: { truth: rows.map((row) => row === NTH[k]), want: true }
            });
          }),
          T('nth-number', '순서를 수로 나타내기', '①21 심13', (d) => {
            const i = d.int(2, 5), j = d.int(i + 2, 7);
            return M('순서를 수로 나타내었다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: i }, { label: LABELS[1], answer: j }], {
              figure: table(['순서', '수'], range(1, 7).map((v) => [NTH[v], v === i ? box(LABELS[0]) : v === j ? box(LABELS[1]) : v])),
              explain: `${NTH[i]}는 ${i}, ${NTH[j]}는 ${josa(j, '으로/로')} 나타낸다.`, facts: { calc: [[`${i - 1}+1`, 0], [`${j - 1}+1`, 1]] }
            });
          }),
          T('nth-vs-count', '개수와 순서를 색칠한 것 구별하기', '①17 심12', (d) => {
            // 하나만 색칠한 줄을 「하나」로 읽는 아이, 둘을 바꾸어 읽는 아이, 둘 다 개수로 읽는 아이가 고르는 보기를 넣는다.
            const k = d.int(4, 7), countFirst = d.bool(), drawn = countFirst ? [range(0, k - 1), [k - 1]] : [[k - 1], range(0, k - 1)];
            const said = (count, nth) => (countFirst ? `㉠ ${count}, ㉡ ${nth}` : `㉠ ${nth}, ㉡ ${count}`);
            const rows = d.shuffle([[said(NATIVE[k], NTH[k]), true], [said(NTH[k], NATIVE[k]), false], [said(NATIVE[k], NATIVE[1]), false], [said(NATIVE[k], NATIVE[k]), false]]);
            return C('색칠한 것을 바르게 말한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), {
              figure: tagged(drawn.map((on) => strip(9, on))),
              explain: `${countFirst ? '㉠' : '㉡'}은 ${k}개를 색칠하였으므로 ${q(NATIVE[k])}, ${countFirst ? '㉡' : '㉠'}은 왼쪽에서 ${NTH[k]}에 있는 하나만 색칠하였으므로 ${q(NTH[k])}이다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('nth-shade-pick', '몇째에 색칠한 것 고르기', '①18·19', (d) => {
            // 틀린 보기: 오른쪽에서 센 것, 하나 앞, 하나 뒤
            const p = d.pick([2, 3, 4, 6, 7, 8]), at = d.shuffle([p, 10 - p, p - 1, p + 1]);
            return C(`왼쪽에서 ${NTH[p]}에 색칠한 것은?`, LABELS, at.indexOf(p), {
              figure: tagged(at.map((v) => strip(9, [v - 1]))), explain: `왼쪽에서부터 첫째, 둘째, …로 세면 ${LABELS[at.indexOf(p)]}이 ${NTH[p]}에 색칠한 것이다.`,
              facts: { choose: { exprs: at.map(String), rule: 'equals', target: p } }
            });
          }),
          T('nth-who', '앞에서 몇째에 선 사람 찾기', '①22 심17', (d) => {
            const n = d.int(6, 7), who = some(d, NAMES, n), p = d.until(() => d.int(2, n - 1), (v) => v !== n + 1 - v), list = spots(d, n, p);
            return C(`앞에서 ${NTH[p]}에 서 있는 사람은?`, list.map((v) => who[v - 1]), list.indexOf(p), {
              figure: queue(who.map((w, i) => ({ name: w, fill: PASTEL[i] })), { left: '앞', right: '뒤', what: `${n}명이 한 줄로 서 있다` }),
              explain: `「앞」에서부터 첫째, 둘째, …로 세면 ${NTH[p]}에 서 있는 사람은 ${who[p - 1]}이다.`, facts: { truth: list.map((v) => v === p), want: true }
            });
          }),
          T('nth-number-row', '몇째에 있는 수 찾기', '①22', (d) => {
            // 순서 말과 같은 수(셋째와 3)가 다른 자리에 놓여 있다.
            const p = d.int(2, 5), row = d.until(() => some(d, range(1, 9), 7), (list) => list.includes(p) && list[p - 1] !== p);
            return N(`왼쪽에서 ${NTH[p]}에 있는 수는?`, row[p - 1], {
              figure: numrow(row), explain: `왼쪽에서부터 첫째, 둘째, …로 세면 ${NTH[p]}에 있는 수는 ${row[p - 1]}이다.`, facts: { calc: [[String(row[p - 1]), 0]] }
            });
          }),
          T('nth-where', '왼쪽에서 몇째인지 고르기', '①23·25', (d) => {
            const n = d.int(8, 9), p = d.until(() => d.int(3, n - 2), (v) => v !== n + 1 - v), list = spots(d, n, p);
            return C('색칠한 구슬은 왼쪽에서 몇째인가?', list.map((v) => NTH[v]), list.indexOf(p), {
              figure: queue(range(1, n).map((v) => (v === p ? { fill: '#1d4ed8', line: '#1e3a8a', said: '색칠한 구슬' } : { fill: '#fff', said: '흰 구슬' })), { left: '왼쪽', right: '오른쪽', what: `구슬 ${n}개가 한 줄로 놓여 있다` }),
              explain: `왼쪽에서부터 세면 색칠한 구슬은 ${NTH[p]}이다. 오른쪽에서 세면 ${NTH[n + 1 - p]}이다.`, facts: { truth: list.map((v) => v === p), want: true }
            });
          }),
          T('nth-right', '오른쪽에서 몇째에 있는 것 찾기', '①24', (d) => {
            // 왼쪽에서 세면 다른 색이 나온다.
            const k = d.pick([2, 3, 4, 6, 7]), seq = d.until(() => range(1, 9).map(() => d.int(0, 2)), (s) => s[9 - k] !== s[k - 1] && new Set(s).size === 3), color = BEADS[seq[9 - k]][0];
            return C(`오른쪽에서 ${NTH[k]} 구슬은 무슨 색인가?`, BEADS.map((b) => b[0]), seq[9 - k], {
              figure: queue(seq.map((c) => ({ fill: BEADS[c][1], line: BEADS[c][2], said: BEADS[c][0] })), { left: '왼쪽', right: '오른쪽', what: '구슬 9개가 한 줄로 놓여 있다' }),
              explain: `「오른쪽」에서부터 첫째, 둘째, …로 세면 ${NTH[k]} 구슬은 ${color}이다.`, facts: { truth: BEADS.map((b, i) => i === seq[9 - k]), want: true }
            });
          }),
          T('nth-stack-who', '아래에서 몇째 칸 찾기', '①26 심15', (d) => {
            const n = d.int(6, 8), who = some(d, NAMES, n), k = d.until(() => d.int(2, n - 1), (v) => v !== n + 1 - v), top = n + 1 - k, list = spots(d, n, top);
            return C(`아래에서 ${NTH[k]} 칸에 적힌 이름은?`, list.map((v) => who[v - 1]), list.indexOf(top), {
              figure: stack(who), explain: `「아래」에서부터 첫째, 둘째, …로 세면 ${NTH[k]} 칸에 적힌 이름은 ${who[top - 1]}이다.`, facts: { truth: list.map((v) => v === top), want: true }
            });
          }),
          T('nth-stack-where', '위에서 몇째인지 고르기', '심16', (d) => {
            const n = d.int(6, 8), who = some(d, NAMES, n), k = d.until(() => d.int(2, n - 1), (v) => v !== n + 1 - v), list = spots(d, n, k);
            return C(`${q(who[k - 1])}의 칸은 위에서 몇째인가?`, list.map((v) => NTH[v]), list.indexOf(k), {
              figure: stack(who), explain: `「위」에서부터 세면 ${who[k - 1]}의 칸은 ${NTH[k]}이다. 아래에서 세면 ${NTH[n + 1 - k]}이다.`, facts: { truth: list.map((v) => v === k), want: true }
            });
          }),
          T('nth-two-refs', '두 쪽에서 센 순서로 찾기', '①27', (d) => {
            const n = d.int(6, 7), who = some(d, ANIMALS, n), p = d.until(() => d.int(2, n - 1), (v) => v !== n + 1 - v), list = spots(d, n, p);
            return C(`왼쪽에서 ${NTH[p]}이고 오른쪽에서 ${NTH[n + 1 - p]}인 동물은?`, list.map((v) => who[v - 1]), list.indexOf(p), {
              figure: queue(who.map((w, i) => ({ name: w, fill: PASTEL[i] })), { left: '왼쪽', right: '오른쪽', what: `동물 ${n}마리가 한 줄로 서 있다` }),
              explain: `왼쪽에서 ${NTH[p]}인 동물은 ${who[p - 1]}이다. 오른쪽에서 세어도 ${NTH[n + 1 - p]}이다.`, facts: { truth: list.map((v) => v === p), want: true }
            });
          }),
          T('nth-between', '몇째와 몇째 사이에 선 사람', '①28', (d) => {
            const n = 7, who = some(d, NAMES, n), a = d.int(2, 4), list = d.shuffle([a + 1, a, a + 2, a === 3 ? 1 : n - a]);
            return C(`앞에서 ${NTH[a]}와 ${NTH[a + 2]} 사이에 서 있는 사람은?`, list.map((v) => who[v - 1]), list.indexOf(a + 1), {
              figure: queue(who.map((w, i) => ({ name: w, fill: PASTEL[i] })), { left: '앞', right: '뒤', what: `${n}명이 한 줄로 서 있다` }),
              explain: `앞에서 ${NTH[a]}는 ${who[a - 1]}, ${NTH[a + 2]}는 ${who[a + 1]}이다. 그 사이에 서 있는 사람은 ${NTH[a + 1]}인 ${who[a]}이다.`, facts: { truth: list.map((v) => v === a + 1), want: true }
            });
          })
        ]
      },
      {
        id: 'order', title: '수의 순서', standard: ORDER,
        types: [
          T('order-fill', '1부터 순서대로 쓴 수의 빈칸', '①32 심22', (d) => {
            const blanks = d.until(() => some(d, range(2, 8), 3).sort((x, y) => x - y), (b) => !(b[1] === b[0] + 1 && b[2] === b[1] + 1));
            const cells = range(1, 9).map((v) => (blanks.includes(v) ? LABELS[blanks.indexOf(v)] : v));
            return M('수를 순서대로 썼다. ㉠, ㉡, ㉢에 알맞은 수는?', blanks.map((v, i) => ({ label: LABELS[i], answer: v })), {
              figure: numrow(cells, '수를 순서대로 썼다'), explain: '1부터 순서대로 쓰면 1, 2, 3, 4, 5, 6, 7, 8, 9이다.',
              facts: { rule: 'from1', calc: blanks.map((v, i) => [blanks.includes(v - 1) ? `${v + 1}-1` : `${v - 1}+1`, i]) }
            });
          }),
          T('order-fill-mid', '1에서 시작하지 않는 수의 빈칸', '①32', (d) => {
            // 첫 칸이 빈칸이라 뒤의 수에서 거꾸로 하나 세어야 한다.
            const s = d.int(2, 5), values = range(s, s + 4);
            return M('순서에 맞게 ㉠, ㉡, ㉢에 알맞은 수를 쓰시오.', [0, 2, 4].map((at, i) => ({ label: LABELS[i], answer: values[at] })), {
              figure: numrow(values.map((v, i) => (i % 2 === 0 ? LABELS[i / 2] : v)), '수를 순서대로 썼다'), explain: `순서대로 쓰면 ${values.join(', ')}이다. ${s + 1} 바로 앞의 수는 ${s}이다.`,
              facts: { rule: 'mid', calc: [[`${s + 1}-1`, 0], [`${s + 1}+1`, 1], [`${s + 3}+1`, 2]], unseen: [1] }
            });
          }),
          T('order-back', '순서를 거꾸로 하여 쓴 수의 빈칸', '①33 심23', (d) => {
            const t = d.int(7, 9), values = range(0, 5).map((i) => t - i), [i, j] = d.pick([[2, 4], [2, 5], [3, 5]]);
            return M('순서를 거꾸로 하여 수를 썼다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: values[i] }, { label: LABELS[1], answer: values[j] }], {
              figure: numrow(values.map((v, at) => (at === i ? LABELS[0] : at === j ? LABELS[1] : v)), '순서를 거꾸로 하여 수를 썼다'), explain: `${t}부터 순서를 거꾸로 하여 쓰면 ${values.join(', ')}이다.`,
              facts: { rule: 'back', calc: [[`${values[i - 1]}-1`, 0], [`${values[j - 1]}-1`, 1]], unseen: [1] }
            });
          }),
          T('order-back-silent', '차례를 스스로 알아내는 수의 빈칸', '①33 심23', (d) => {
            // 「거꾸로」라는 말이 없다. 나란히 적힌 두 수를 보고 수가 작아지는 차례임을 알아내야 한다.
            const t = d.int(8, 9), values = range(0, 5).map((i) => t - i), [i, j] = d.pick([[1, 4], [1, 5], [2, 5], [1, 3]]);
            return M('수가 놓인 차례를 보고 ㉠, ㉡에 알맞은 수를 쓰시오.', [{ label: LABELS[0], answer: values[i] }, { label: LABELS[1], answer: values[j] }], {
              figure: numrow(values.map((v, at) => (at === i ? LABELS[0] : at === j ? LABELS[1] : v))), explain: `수의 순서를 거꾸로 하여 쓴 것이다. ${t}부터 거꾸로 쓰면 ${values.join(', ')}이다.`,
              facts: { rule: 'silent', calc: [[`${values[i - 1]}-1`, 0], [j === 5 ? `${values[4]}-1` : `${values[j + 1]}+1`, 1]], unseen: [1] }
            });
          }),
          T('order-who', '수를 순서대로 쓴 것 고르기', '①34', (d) => {
            // 틀린 보기: 거꾸로 쓴 것, 수 하나를 건너뛴 것, 두 수의 자리를 바꾼 것
            const s = d.int(1, 5), t = d.int(5, 9), u = d.int(1, 4), w = d.int(1, 5);
            const rows = d.shuffle([[range(s, s + 4), true], [range(0, 4).map((i) => t - i), false], [[u, u + 1, u + 3, u + 4, u + 5], false], [[w, w + 1, w + 3, w + 2, w + 4], false]]);
            return C('수를 순서대로 쓴 것은?', LABELS, rows.findIndex((row) => row[1]), {
              figure: tagged(rows.map((row) => row[0].join(' '))), explain: `${s}부터 순서대로 쓰면 ${range(s, s + 4).join(', ')}이다. 나머지는 거꾸로 썼거나, 수를 건너뛰었거나, 자리를 바꾸어 썼다.`,
              facts: { truth: rows.map((row) => row[1]), want: true }
            });
          }),
          T('order-wrong', '자리가 바뀐 두 수 찾기', '①35', (d) => {
            const gap = d.int(1, 2), a = d.int(2, 6 - gap), b = a + gap, row = range(1, 7).map((v) => (v === a ? b : v === b ? a : v));
            return M('수를 순서대로 놓다가 두 수의 자리가 바뀌었다. 자리가 바뀐 두 수는?', [{ answer: a }, { answer: b }], {
              unordered: true, figure: numrow(row), explain: `순서대로 놓으면 1, 2, 3, 4, 5, 6, 7이다. ${josa(a, '과/와')} ${b}의 자리가 바뀌었다.`, facts: { calc: [[String(a), 0], [String(b), 1]] }
            });
          }),
          T('order-after', '어떤 수보다 뒤에 오는 수', '심24', (d) => {
            // 바로 앞의 수를 고르는 아이가 있다.
            const t = d.int(4, 7), after = d.int(t + 1, Math.min(9, t + 2)), list = d.shuffle([after, t - 1, t - 2, t - 3]);
            return C(`수를 순서대로 쓸 때 ${t}보다 뒤에 오는 수는?`, list.map(String), list.indexOf(after), {
              explain: `수를 순서대로 쓰면 ${t} 뒤에 ${range(t + 1, 9).join(', ')}${josa(9, '이/가').slice(1)} 온다. ${josa(t - 1, '은/는')} ${t}보다 앞에 오는 수이다.`,
              facts: { choose: { exprs: list.map(String), rule: 'onlyAbove', target: t } }
            });
          }),
          T('order-between', '두 수 사이에 있는 수', '①69·70 심47', (d) => {
            // 조건 둘을 겹치는 꼴은 싣지 않고, 「□와 □ 사이의 수」 한 가지만 묻는다. 두 끝의 수는 사이에 있는 수가 아니다.
            const a = d.int(2, 6), list = d.shuffle([a, a + 1, a + 2, a + 3]);
            return C(`${josa(a, '과/와')} ${a + 2} 사이에 있는 수는?`, list.map(String), list.indexOf(a + 1), {
              explain: `수를 순서대로 쓰면 ${a}, ${a + 1}, ${a + 2}이다. ${josa(a, '과/와')} ${a + 2} 사이에 있는 수는 ${a + 1}이다.`,
              facts: { between: { low: String(a), high: String(a + 2), exprs: list.map(String) } }
            });
          })
        ]
      },
      { id: 'one', title: '1만큼 더 큰 수와 1만큼 더 작은 수', standard: ORDER, types: [] },
      { id: 'zero', title: '0', standard: NUM, types: [] },
      { id: 'compare', title: '수의 크기 비교', standard: ORDER, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
