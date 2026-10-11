// 수학 문제은행의 엔진. 단원 파일(units/*.js)이 여기에 단원을 등록하고, 화면(app.js)과 검사가 여기서 문항을 만든다.
// 문항의 꼴과 조건은 수집해 둔 평가 자료의 문제를 하나씩 따른 것이다. 같은 꼴은 한 번만 싣는다.
// 수는 유형 이름에서 정해지므로 언제 열어도, 누가 열어도 같은 문제다(문제은행).
(function (root) {
  'use strict';

  const units = [];

  // ── 씨앗 난수 ────────────────────────────────────────────────
  function Dice(seed) {
    let a = (seed >>> 0) || 1;
    this.next = function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  Dice.prototype.int = function (lo, hi) { return lo + Math.floor(this.next() * (hi - lo + 1)); };
  Dice.prototype.pick = function (list) { return list[this.int(0, list.length - 1)]; };
  Dice.prototype.bool = function () { return this.next() < 0.5; };
  Dice.prototype.shuffle = function (list) {
    const out = list.slice();
    for (let i = out.length - 1; i > 0; i -= 1) { const j = this.int(0, i); const t = out[i]; out[i] = out[j]; out[j] = t; }
    return out;
  };
  // 조건에 맞는 값이 나올 때까지 다시 뽑는다. 조건이 불가능하면 조용히 돌지 않고 멈춘다.
  Dice.prototype.until = function (make, ok) {
    for (let i = 0; i < 20000; i += 1) { const value = make(); if (ok(value)) return value; }
    throw new Error('조건에 맞는 수를 만들지 못했습니다.');
  };
  // 세 자리 수 두 개. test(a, b) 가 참인 짝만 돌려준다.
  Dice.prototype.pair = function (test) {
    return this.until(() => [this.int(100, 999), this.int(100, 999)], ([a, b]) => test(a, b));
  };

  // ── 수의 성질 ────────────────────────────────────────────────
  const digitsOf = (n) => String(n).split('').map(Number);
  // 덧셈에서 받아올림이 일어나는 자리 [일, 십, 백]
  function carryPlaces(a, b) {
    const out = []; let carry = 0;
    for (let i = 0; i < 3; i += 1) {
      const sum = (a % 10) + (b % 10) + carry;
      carry = sum >= 10 ? 1 : 0; out.push(carry === 1);
      a = Math.floor(a / 10); b = Math.floor(b / 10);
    }
    return out;
  }
  // 뺄셈(a ≥ b)에서 받아내림이 일어나는 자리 [일의 자리 계산, 십의 자리 계산]
  function borrowPlaces(a, b) {
    const out = []; let borrow = 0;
    for (let i = 0; i < 2; i += 1) {
      const diff = (a % 10) - (b % 10) - borrow;
      borrow = diff < 0 ? 1 : 0; out.push(borrow === 1);
      a = Math.floor(a / 10); b = Math.floor(b / 10);
    }
    return out;
  }
  // 곱셈 (몇십몇)×(몇)에서 올림이 일어나는 자리 [일의 자리 계산, 십의 자리 계산]
  function mulCarries(a, b) {
    const ones = (a % 10) * b, tens = Math.floor(a / 10) * b + Math.floor(ones / 10);
    return [ones >= 10, tens >= 10];
  }
  const count = (flags) => flags.filter(Boolean).length;
  // 계산 연습에 쓰기 어색한 수(몇백, 같은 숫자 셋)를 거른다.
  const plain = (n) => n % 100 !== 0 && !/^(\d)\1\1$/.test(String(n));

  // ── 우리말 토씨 ──────────────────────────────────────────────
  // 수를 읽었을 때 끝소리에 받침이 있는가(0: 십·백·천, 1 일, 3 삼, 6 육, 7 칠, 8 팔)
  const numberBatchim = (n) => [true, true, false, true, false, false, true, true, true, false][Math.abs(n) % 10];
  const numberRieul = (n) => [false, true, false, false, false, false, false, true, true, false][Math.abs(n) % 10];
  const lastSound = (word) => { const code = String(word).charCodeAt(String(word).length - 1) - 0xAC00; return code >= 0 && code <= 11171 ? code % 28 : 0; };
  const wordBatchim = (word) => lastSound(word) !== 0;
  // josa(352, '을/를') → '352를',  josa('서연', '은/는') → '서연이는'(이름은 name() 을 쓴다)
  function josa(value, pair) {
    const [withBatchim, without] = pair.split('/');
    const isNumber = typeof value === 'number';
    const batchim = isNumber ? numberBatchim(value) : wordBatchim(value);
    if (withBatchim === '으로') return value + (batchim && !(isNumber ? numberRieul(value) : lastSound(value) === 8) ? '으로' : '로');
    return value + (batchim ? withBatchim : without);
  }
  // 이름 뒤 토씨: 받침 있는 이름은 '이'를 붙인다(서연이는, 지우는).
  function name(who, pair) {
    const [withBatchim, without] = pair.split('/');
    if (pair === '이/가') return who + (wordBatchim(who) ? '이가' : '가');
    return who + (wordBatchim(who) ? '이' + without : without);
  }
  const NAMES = ['지우', '서연', '민재', '하린', '도현', '수아', '은호', '채원', '시우', '나은'];

  // ── 그림과 식 ────────────────────────────────────────────────
  const esc = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const LABELS = ['㉠', '㉡', '㉢', '㉣'];
  const box = (label) => '<span class="mb-box">' + (label || '') + '</span>';
  // 가로식. 조각에 box() 를 섞어 쓴다. 연산 기호는 − × 가 아니라 화면 글꼴에 맞춘 것을 쓴다.
  const SIGN = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  function expr() {
    return '<span class="mb-expr">' + Array.from(arguments).map((part) => (SIGN[part] ? '<i>' + SIGN[part] + '</i>' : part === '=' ? '<i>=</i>' : part)).join(' ') + '</span>';
  }
  // 세로셈. 각 줄은 글자 배열이고, 글자 자리에 box() 를 넣으면 가려진 숫자가 된다.
  // above: 받아올림·받아내림한 수를 숫자 위에 작게 적을 때(자리마다 글자 하나, 없으면 빈 글자).
  function column(top, sign, bottom, result, above) {
    const width = Math.max(top.length, bottom.length, result ? result.length : 0, above ? above.length : 0);
    const cells = (list, className) => { const pad = width - list.length; return '<span class="mb-cell"></span>'.repeat(pad) + list.map((ch) => '<span class="mb-cell' + (className || '') + '">' + ch + '</span>').join(''); };
    return '<div class="mb-column" role="img" aria-label="세로셈">'
      + (above ? '<div class="mb-row mb-above"><span class="mb-sign"></span>' + cells(above) + '</div>' : '')
      + '<div class="mb-row"><span class="mb-sign"></span>' + cells(top) + '</div>'
      + '<div class="mb-row"><span class="mb-sign">' + SIGN[sign] + '</span>' + cells(bottom) + '</div>'
      + '<div class="mb-rule"></div>'
      + '<div class="mb-row"><span class="mb-sign"></span>' + (result ? cells(result) : '<span class="mb-cell mb-wide">' + box() + '</span>') + '</div>'
      + '</div>';
  }
  // 곱셈 세로셈에서 자리별 곱을 따로 적는 꼴: 줄을 긋고 자리별 곱(steps)을 적은 뒤 줄을 한 번 더 긋고 결과를 적는다.
  // notes: 자리별 곱 줄 오른쪽에 붙이는 짧은 글(어느 곱인지).
  function columnSteps(top, sign, bottom, steps, result, notes) {
    // 줄이 글자 배열이 아니라 글 하나이면(빈칸 하나) 그 줄 전체를 넓은 칸 하나로 적는다.
    const size = (row) => (Array.isArray(row) ? row.length : 1);
    const width = Math.max(top.length, bottom.length, size(result), Math.max.apply(null, steps.map(size)));
    const cells = (list) => (Array.isArray(list)
      ? '<span class="mb-cell"></span>'.repeat(width - list.length) + list.map((ch) => '<span class="mb-cell">' + ch + '</span>').join('')
      : '<span class="mb-cell mb-wide mb-wide-short">' + list + '</span>');
    const row = (list, mark, note) => '<div class="mb-row"><span class="mb-sign">' + (mark || '') + '</span>' + cells(list) + (notes ? '<span class="mb-note">' + (note || '') + '</span>' : '') + '</div>';
    return '<div class="mb-column' + (notes ? ' mb-column-noted' : '') + '" role="img" aria-label="세로셈">' + row(top) + row(bottom, SIGN[sign]) + '<div class="mb-rule"></div>'
      + steps.map((list, i) => row(list, '', notes && notes[i])).join('') + '<div class="mb-rule"></div>' + row(result) + '</div>';
  }
  // 차례로 계산하는 칸: 수 → (+a) → 수 → (−b) → 수. 조각은 수·box()·'+267'·'÷9' 같은 글이다.
  function chain(parts) {
    return '<div class="mb-chain">' + parts.map((part) => (/^[+\-−×÷]/.test(String(part)) ? '<span class="mb-step">' + String(part).replace('-', '−') + '</span>' : '<span class="mb-node">' + part + '</span>')).join('') + '</div>';
  }
  // 표. head: 첫 줄, rows: 나머지 줄(칸은 글). 칸이 많으면 좁은 화면에서 옆으로 밀어 본다.
  function table(head, rows) {
    const line = (cells, tag) => '<tr>' + cells.map((cell) => '<' + tag + '>' + cell + '</' + tag + '>').join('') + '</tr>';
    return '<div class="mb-table-wrap"><table class="mb-table">' + (head ? '<thead>' + line(head, 'th') + '</thead>' : '') + '<tbody>' + rows.map((row) => line(row, 'td')).join('') + '</tbody></table></div>';
  }
  // 길 그림. nodes: [이름, x, y, 이름을 아래에 적는가](x·y 는 0~100 눈금), edges: [앞 번호, 뒤 번호, 거리 글, 글을 선에서 띄울 높이].
  // 거리 글이 없으면 선만 긋는다. 휴대폰에서도 글씨가 읽히게 그림 폭을 좁게 잡는다.
  function route(nodes, edges, height) {
    const H = height || 40, sx = (x) => 20 + x * 1.3, sy = (y) => 16 + y * (H - 36) / 100;
    let out = '';
    for (const [a, b, label, lift] of edges) {
      const x1 = sx(nodes[a][1]), y1 = sy(nodes[a][2]), x2 = sx(nodes[b][1]), y2 = sy(nodes[b][2]);
      out += '<line class="mb-road" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"/>';
      if (label) out += '<text class="mb-road-label" x="' + (x1 + x2) / 2 + '" y="' + ((y1 + y2) / 2 + (lift == null ? -4 : lift)) + '" text-anchor="middle">' + label + '</text>';
    }
    for (const [name, x, y, below] of nodes) out += '<circle class="mb-place" cx="' + sx(x) + '" cy="' + sy(y) + '" r="2.4"/><text class="mb-place-name" x="' + sx(x) + '" y="' + (sy(y) + (below === false ? -6 : 11)) + '" text-anchor="middle">' + name + '</text>';
    return '<svg class="mb-route" viewBox="0 0 170 ' + H + '" width="340" role="img" aria-label="길 그림">' + out + '</svg>';
  }
  // 겹쳐 이어 붙인 띠 두 장. 길이 글과 겹친 부분 글을 적는다.
  function tapes(first, second, overlap) {
    return '<svg class="mb-tapes" viewBox="0 0 170 52" width="340" role="img" aria-label="겹쳐 이어 붙인 띠 두 장">'
      + '<rect class="mb-tape-a" x="6" y="14" width="92" height="13" rx="1.5"/><rect class="mb-tape-b" x="72" y="19" width="92" height="13" rx="1.5"/>'
      + '<text class="mb-road-label" x="40" y="10" text-anchor="middle">' + first + '</text><text class="mb-road-label" x="132" y="43" text-anchor="middle">' + second + '</text>'
      + '<path class="mb-brace" d="M72 35v4h26v-4"/><text class="mb-road-label" x="85" y="49" text-anchor="middle">' + overlap + '</text></svg>';
  }
  // 띠 그림: 전체(위)와 두 부분(아래). 모르는 쪽에는 '□' 를 넘긴다. ratio 는 왼쪽 부분이 차지하는 몫이다.
  function bar(total, left, right, ratio) {
    const cut = 8 + 154 * (ratio || 0.5);
    return '<svg class="mb-bar" viewBox="0 0 170 44" width="340" role="img" aria-label="띠 그림">'
      + '<path class="mb-brace" d="M8 17v-5h154v5"/><text class="mb-road-label" x="85" y="9" text-anchor="middle">' + total + '</text>'
      + '<rect class="mb-tape-a" x="8" y="21" width="' + (cut - 8) + '" height="16"/><rect class="mb-tape-b" x="' + cut + '" y="21" width="' + (162 - cut) + '" height="16"/>'
      + '<text class="mb-bar-label" x="' + (8 + cut) / 2 + '" y="32" text-anchor="middle">' + left + '</text><text class="mb-bar-label" x="' + (cut + 162) / 2 + '" y="32" text-anchor="middle">' + right + '</text></svg>';
  }
  // 수가 하나씩 적힌 도형들. list: [['circle' | 'triangle' | 'square', 수], …]
  function shapes(list) {
    let out = '';
    list.forEach(([kind, value], i) => {
      const cx = 22 + i * 42;
      if (kind === 'circle') out += '<circle class="mb-shape" cx="' + cx + '" cy="22" r="17"/>';
      else if (kind === 'triangle') out += '<path class="mb-shape" d="M' + cx + ' 3L' + (cx + 20) + ' 39H' + (cx - 20) + 'Z"/>';
      else out += '<rect class="mb-shape" x="' + (cx - 17) + '" y="5" width="34" height="34"/>';
      out += '<text class="mb-shape-text" x="' + cx + '" y="' + (kind === 'triangle' ? 33.5 : 25.5) + '" text-anchor="middle">' + value + '</text>';
    });
    return '<svg class="mb-shapes" viewBox="0 0 ' + (list.length * 42 + 2) + ' 42" width="' + (list.length * 84 + 4) + '" role="img" aria-label="수가 적힌 도형">' + out + '</svg>';
  }
  // 줄지어 놓인 물건(동그라미). loop: 'rows' 는 가로줄마다, 'cols' 는 세로줄마다 한 묶음으로 둘러 준다.
  function dots(rows, cols, options) {
    const o = options || {}, gap = 20, pad = 12, width = pad * 2 + (cols - 1) * gap + 14, height = pad * 2 + (rows - 1) * gap + 14;
    let out = '';
    if (o.loop === 'rows') for (let r = 0; r < rows; r += 1) out += '<rect class="mb-loop" x="' + (pad - 5) + '" y="' + (pad - 3 + r * gap) + '" width="' + ((cols - 1) * gap + 24) + '" height="20" rx="10"/>';
    if (o.loop === 'cols') for (let c = 0; c < cols; c += 1) out += '<rect class="mb-loop" x="' + (pad - 3 + c * gap) + '" y="' + (pad - 5) + '" width="20" height="' + ((rows - 1) * gap + 24) + '" rx="10"/>';
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) out += '<circle class="mb-thing" cx="' + (pad + 7 + c * gap) + '" cy="' + (pad + 7 + r * gap) + '" r="6"/>';
    const said = '물건 ' + rows * cols + '개' + (o.loop === 'rows' ? ', ' + cols + '개씩 ' + rows + '묶음' : o.loop === 'cols' ? ', ' + rows + '개씩 ' + cols + '묶음' : ', ' + cols + '개씩 ' + rows + '줄');
    return '<svg class="mb-dots" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * 1.25) + '" role="img" aria-label="' + said + '">' + out + '</svg>';
  }
  // 수직선에서 0부터 step 씩 뛰어 max 까지 간다. 뛴 자리마다 수를 적는다.
  // options.tick: 작은 눈금 간격(기본 1), options.hideEnd: 끝 수를 적지 않는다(그 수를 물을 때), options.length: 선의 길이(기본 300).
  function numberLine(max, step, options) {
    const o = options || {}, tick = o.tick || 1;
    const unit = Math.min(13, (o.length || 300) / max), x = (v) => 14 + v * unit, y = 34, width = 28 + max * unit;
    let out = '<line class="mb-axis" x1="' + x(0) + '" y1="' + y + '" x2="' + x(max) + '" y2="' + y + '"/>';
    for (let v = 0; v <= max; v += tick) out += '<line class="mb-axis" x1="' + x(v) + '" y1="' + (y - (v % step === 0 ? 5 : 3)) + '" x2="' + x(v) + '" y2="' + (y + (v % step === 0 ? 5 : 3)) + '"/>';
    for (let v = 0; v <= max; v += step) if (!(o.hideEnd && v === max)) out += '<text class="mb-axis-label" x="' + x(v) + '" y="' + (y + 17) + '" text-anchor="middle">' + v + '</text>';
    for (let v = 0; v + step <= max; v += step) out += '<path class="mb-jump" d="M' + x(v) + ' ' + (y - 6) + 'Q' + x(v + step / 2) + ' ' + (y - 30) + ' ' + x(v + step) + ' ' + (y - 6) + '"/>';
    return '<svg class="mb-numberline" viewBox="0 0 ' + width + ' 58" width="' + Math.round(width * 1.15) + '" role="img" aria-label="수직선: 0부터 ' + step + '씩 ' + (max / step) + '번 뛰어 ' + max + '까지">' + out + '</svg>';
  }
  // 10짜리·1짜리 동그라미로 나타낸 수를 여러 줄 놓은 그림(곱셈): a 를 rows 줄.
  function counters(a, rows) {
    const tens = Math.floor(a / 10), ones = a % 10, step = 17, gap = tens && ones ? 10 : 0, pad = 10;
    const width = pad * 2 + (tens + ones) * step + gap - 3, height = pad * 2 + rows * step - 3;
    let out = '';
    for (let r = 0; r < rows; r += 1) {
      const y = pad + 7 + r * step;
      for (let i = 0; i < tens; i += 1) { const x = pad + 7 + i * step; out += '<circle class="mb-chip-ten" cx="' + x + '" cy="' + y + '" r="7"/><text class="mb-chip-text" x="' + x + '" y="' + (y + 2.6) + '" text-anchor="middle">10</text>'; }
      for (let i = 0; i < ones; i += 1) { const x = pad + 7 + tens * step + gap + i * step; out += '<circle class="mb-chip-one" cx="' + x + '" cy="' + y + '" r="7"/><text class="mb-chip-text" x="' + x + '" y="' + (y + 2.6) + '" text-anchor="middle">1</text>'; }
    }
    return '<svg class="mb-counters" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * 1.5) + '" role="img" aria-label="한 줄에 ' + a + '(10이 ' + tens + '개, 1이 ' + ones + '개)씩 ' + rows + '줄">' + out + '</svg>';
  }
  const chars = (n) => String(n).split('');
  // 수 모형: 백 모형(판)·십 모형(막대)·일 모형(낱개)
  // removed 를 주면 그만큼(자리마다 뒤쪽부터)을 덜어 낸 것으로 그린다(옅은 색 + 빗금). 받아내림이 없는 수만 쓴다.
  function blocks(n, label, removed) {
    const [h, t, o] = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
    const out = removed ? [Math.floor(removed / 100), Math.floor(removed / 10) % 10, removed % 10] : [0, 0, 0];
    const parts = []; let x = 4;
    for (let i = 0; i < h; i += 1) {
      let grid = '';
      for (let k = 1; k < 10; k += 1) grid += '<path d="M' + (x + k * 3.4) + ' 6v34M' + x + ' ' + (6 + k * 3.4) + 'h34"/>';
      const gone = i >= h - out[0];
      parts.push('<g class="mb-flat' + (gone ? ' is-out' : '') + '"><rect x="' + x + '" y="6" width="34" height="34" rx="1.5"/>' + grid + '</g>' + (gone ? '<path class="mb-strike" d="M' + (x - 1) + ' 41L' + (x + 35) + ' 5"/>' : '')); x += 38;
    }
    x += h ? 6 : 0;
    for (let i = 0; i < t; i += 1) {
      let ticks = '';
      for (let k = 1; k < 10; k += 1) ticks += '<path d="M' + x + ' ' + (6 + k * 3.4) + 'h5"/>';
      const gone = i >= t - out[1];
      parts.push('<g class="mb-rod' + (gone ? ' is-out' : '') + '"><rect x="' + x + '" y="6" width="5" height="34" rx="1"/>' + ticks + '</g>' + (gone ? '<path class="mb-strike" d="M' + (x - 1.2) + ' 41L' + (x + 6.2) + ' 5"/>' : '')); x += 8;
    }
    x += t ? 6 : 0;
    for (let i = 0; i < o; i += 1) {
      const col = Math.floor(i / 5), row = i % 5, px = x + col * 8, py = 6 + row * 7;
      const gone = i >= o - out[2];
      parts.push('<rect class="mb-one' + (gone ? ' is-out' : '') + '" x="' + px + '" y="' + py + '" width="5.4" height="5.4" rx="1"/>' + (gone ? '<path class="mb-strike" d="M' + (px - 0.8) + ' ' + (py + 6.2) + 'L' + (px + 6.2) + ' ' + (py - 0.8) + '"/>' : ''));
    }
    x += o ? Math.ceil(o / 5) * 8 : 0;
    const width = Math.max(x + 4, 60);
    const said = '수 모형: 백 모형 ' + h + '개, 십 모형 ' + t + '개, 일 모형 ' + o + '개' + (removed ? ' 가운데 백 모형 ' + out[0] + '개, 십 모형 ' + out[1] + '개, 일 모형 ' + out[2] + '개를 덜어 냄' : '');
    return '<figure class="mb-blocks">' + (label ? '<figcaption>' + esc(label) + '</figcaption>' : '')
      + '<svg viewBox="0 0 ' + width + ' 46" width="' + Math.round(width * 2.1) + '" role="img" aria-label="' + said + '">' + parts.join('') + '</svg></figure>';
  }
  // 여러 줄로 늘어놓기, 기호(㉠㉡㉢)를 붙여 늘어놓기, 주어진 수를 띠로 묶어 보이기
  const lines = (rows) => '<div class="mb-lines">' + rows.map((row) => '<div>' + row + '</div>').join('') + '</div>';
  const tagged = (list, tags) => lines(list.map((html, i) => '<span class="mb-tag mb-tag-short">' + (tags || LABELS)[i] + '</span>' + html));
  const numbers = (list) => '<div class="mb-numbers">' + list.map((v) => '<span>' + v + '</span>').join('') + '</div>';
  const cards = (list) => '<span class="mb-cards">' + list.map((d) => '<span class="mb-card">' + d + '</span>').join('') + '</span>';

  // ── 수 고르기(여러 단원이 함께 쓴다) ─────────────────────────
  // 세 자리 수 두 개를 조건에 맞게 뽑는다. rule 은 받아올림·받아내림 자리 배열과 두 수를 받는다.
  const addPair = (d, rule) => d.pair((a, b) => plain(a) && plain(b) && a !== b && rule(carryPlaces(a, b), a, b));
  const subPair = (d, rule) => d.pair((a, b) => plain(a) && plain(b) && a - b >= 11 && rule(borrowPlaces(a, b), a, b));
  const ADD = {
    none: (c) => count(c) === 0,
    ones: (c) => c[0] && !c[1] && !c[2],
    tens: (c) => !c[0] && c[1] && !c[2],
    once: (c) => count(c) === 1 && !c[2],
    twice: (c) => c[0] && c[1] && !c[2],
    thrice: (c) => count(c) === 3,
    many: (c) => count(c) >= 2,
    any: (c) => count(c) >= 1
  };
  const SUB = {
    none: (b) => count(b) === 0,
    ones: (b) => b[0] && !b[1],
    tens: (b) => !b[0] && b[1],
    once: (b) => count(b) === 1,
    twice: (b) => count(b) === 2,
    zeroTens: (b, a) => count(b) === 2 && Math.floor(a / 10) % 10 === 0,
    any: (b) => count(b) >= 1
  };
  // 계산 결과가 lo~hi 에 드는 식(세 자리 수 둘, 받아올림·받아내림이 한 번은 있다). 결과가 몰려 있어야 하는 견주기 문항에 쓴다.
  function pairNear(d, op, lo, hi, rule) {
    return d.until(() => {
      const v = d.int(lo, hi);
      if (op === '+') { const a = d.int(100, v - 100); return [a, v - a]; }
      const b = d.int(100, 999 - v); return [v + b, b];
    }, ([a, b]) => a >= 100 && b >= 100 && a <= 999 && b <= 999 && plain(a) && plain(b) && a !== b
      && count(op === '+' ? carryPlaces(a, b) : borrowPlaces(a, b)) >= 1 && (!rule || rule(a, b)));
  }
  // (두 자리 수)×(한 자리 수)를 조건에 맞게 뽑는다. rule 은 올림 자리 배열과 두 수를 받는다.
  const mulPair = (d, rule) => d.until(() => [d.int(10, 99), d.int(2, 9)], ([a, b]) => rule(mulCarries(a, b), a, b));
  const MUL = {
    tens: (c, a) => a % 10 === 0,                      // (몇십)×(몇)
    none: (c, a) => a % 10 !== 0 && !c[0] && !c[1],    // 올림이 없다
    upper: (c, a) => a % 10 !== 0 && !c[0] && c[1],    // 십의 자리에서 올림
    ones: (c) => c[0] && !c[1],                        // 일의 자리에서 올림
    both: (c) => c[0] && c[1],                         // 올림이 두 번
    any: (c, a) => a % 10 !== 0
  };
  const result = (a, op, b) => (op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : a / b);
  const shown = (a, op, b) => expr(a, op, b, '=', result(a, op, b));

  // ── 문항 꼴 세 가지: 수 하나(N), 수 여럿(M), 고르기(C) ───────
  // 서술형(식 쓰기·설명하기)은 없다. 답은 수를 적거나 보기에서 고른다.
  // o: { figure, unit, lead, explain, facts, unordered }. facts 는 검사가 답을 다른 길로 다시 셈하는 근거다.
  const N = (text, answer, o) => ({ text, figure: o.figure, inputs: [{ answer, unit: o.unit, lead: o.lead }], explain: o.explain || '', facts: o.facts || {} });
  const M = (text, inputs, o) => ({ text, figure: o.figure, inputs, unordered: o.unordered || false, explain: o.explain || '', facts: o.facts || {} });
  const C = (text, options, answer, o) => ({ text, figure: o.figure, choice: { options, answer }, explain: o.explain || '', facts: o.facts || {} });
  // 검사가 따로 셈할 식 글
  const E = (a, op, b) => String(a) + op + b;
  // 이름을 부를 때: 서연이, 지우
  const nick = (who) => who + (wordBatchim(who) ? '이' : '');

  // ── 단원 등록과 문항 만들기 ──────────────────────────────────
  function hash(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function addUnit(unit) { units.push(unit); }
  function findUnit(id) { return units.find((u) => u.id === id) || null; }
  function findGroup(unit, groupId) { return unit.groups.find((g) => g.id === groupId) || null; }
  // 이미 등록한 단원의 묶음에 유형을 더한다(기본과 실력을 다른 파일에 나누어 쓸 때).
  function addTypes(unitId, groupId, types) { findGroup(findUnit(unitId), groupId).types.push(...types); }
  // 이미 등록한 단원 끝에 묶음을 더한다(실력 문항을 한 묶음으로 모아 둘 때).
  function addGroup(unitId, group) { findUnit(unitId).groups.push(group); }
  const LEVELS = ['기본', '실력'];
  const typesOf = (group, level) => group.types.filter((type) => type.level === level);

  // 문제은행: 한 묶음·수준에는 유형마다 문제가 하나씩 있다. 수만 다르거나 말만 다른 같은 문제는 싣지 않는다.
  // (count 를 둔 유형은 차례 n 에 따라 조건이나 묻는 것이 달라지는 서로 다른 문제다.)
  // 문제가 많은 묶음만 회차로 나눈다. 회차 번호가 같으면 누구에게나 같은 문제다.
  const ROUND_SIZE = 10;
  function slots(group, level) {
    const list = [];
    for (const type of typesOf(group, level)) for (let n = 0; n < (type.count || 1); n += 1) list.push({ type, n });
    return list;
  }
  const banks = new Map();
  function bankOf(unit, groupId, level) {
    const id = unit.id + ':' + groupId + ':' + level;
    if (banks.has(id)) return banks.get(id);
    const group = findGroup(unit, groupId);
    // 유형·차례마다 따로 난수를 돌린다. 한 유형을 고쳐도 다른 문항의 수가 바뀌지 않는다.
    const items = slots(group, level).map((slot) => Object.assign(
      { key: slot.type.id + (slot.type.count > 1 ? '#' + (slot.n + 1) : ''), typeId: slot.type.id, typeTitle: slot.type.title, level: slot.type.level, standard: slot.type.standard || group.standard, source: slot.type.source || '' },
      slot.type.make(new Dice(hash(unit.id + ':' + slot.type.id + ':' + slot.n)), slot.n)));
    banks.set(id, items);
    return items;
  }
  const roundCount = (unit, groupId, level) => { const total = bankOf(unit, groupId, level).length; return total ? Math.max(1, Math.round(total / ROUND_SIZE)) : 0; };
  // round 는 1부터 센다. 회차가 여럿이면 비슷한 유형이 한 회차에 몰리지 않게 건너뛰며 나눈다.
  function makeRound(unit, groupId, level, round) {
    const items = bankOf(unit, groupId, level), rounds = roundCount(unit, groupId, level);
    if (!rounds || round < 1 || round > rounds) return [];
    return items.filter((_, i) => i % rounds === round - 1);
  }
  // 답 맞추기. 수는 쉼표·빈칸을 떼고 견준다. unordered 인 문항은 답의 차례를 따지지 않는다.
  const cleanNumber = (text) => String(text == null ? '' : text).replace(/[,\s]/g, '');
  function isCorrect(item, response) {
    if (item.choice) return Number(response) === item.choice.answer;
    const given = (Array.isArray(response) ? response : [response]).map(cleanNumber);
    if (given.length !== item.inputs.length || !given.every((text) => /^\d+$/.test(text))) return false;
    const want = item.inputs.map((input) => input.answer), got = given.map(Number);
    if (item.unordered) { want.sort((a, b) => a - b); got.sort((a, b) => a - b); }
    return want.every((value, i) => value === got[i]);
  }

  root.MathBank = {
    Dice, addUnit, addTypes, addGroup, findUnit, findGroup, typesOf, bankOf, makeRound, roundCount, isCorrect, LEVELS, ROUND_SIZE,
    units: () => units.slice(),
    kit: { digitsOf, carryPlaces, borrowPlaces, mulCarries, count, plain, josa, name, NAMES, esc, LABELS, box, expr, column, columnSteps, chars, blocks, counters, cards, lines, tagged, numbers, chain, table, route, tapes, bar, shapes, dots, numberLine, N, M, C, E, nick, addPair, subPair, pairNear, ADD, SUB, mulPair, MUL, result, shown }
  };
})(typeof window !== 'undefined' ? window : globalThis);
