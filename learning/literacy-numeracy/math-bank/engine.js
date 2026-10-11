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
  // 몇 조로 끝나는 수(3000000000000 = 삼조)는 받침이 없다. 십·백·천·만·억으로 끝나는 수는 받침이 있다.
  const endsInJo = (n) => Math.abs(n) >= 1e12 && Math.abs(n) % 1e12 === 0;
  const numberBatchim = (n) => !endsInJo(n) && [true, true, false, true, false, false, true, true, true, false][Math.abs(n) % 10];
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

  // ── 큰 수(만·억·조) ──────────────────────────────────────────
  // 네 자리씩 끊은 묶음 [일, 만, 억, 조]
  const BIG_UNITS = ['', '만', '억', '조'];
  const groupsOf = (n) => [n % 1e4, Math.floor(n / 1e4) % 1e4, Math.floor(n / 1e8) % 1e4, Math.floor(n / 1e12)];
  // 끊어 쓰기: cut(302560000) → '3억 256만'
  const cut = (n) => groupsOf(n).map((g, i) => (g ? g + BIG_UNITS[i] : '')).reverse().filter(Boolean).join(' ') || '0';
  // 읽기: say(302560000) → '삼억 이백오십육만'. 만 단위로 띄어 읽는다. 1만은 '만', 1억·1조는 '일억'·'일조'.
  function say(n) {
    const DIGITS = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'], PLACES = ['천', '백', '십', ''];
    const four = (g) => String(g).padStart(4, '0').split('').map((ch, i) => (ch === '0' ? '' : (ch === '1' && i < 3 ? '' : DIGITS[Number(ch)]) + PLACES[i])).join('');
    return groupsOf(n).map((g, i) => (g ? (g === 1 && i === 1 ? '' : four(g)) + BIG_UNITS[i] : '')).reverse().filter(Boolean).join(' ');
  }
  // 수를 다르게 적은 글(끊어 쓴 글·읽은 글) 뒤에 토씨를 붙인다: named(3e12, '3조', '은/는') → '3조는'
  const named = (n, shown, pair) => shown + josa(say(n), pair).slice(say(n).length);

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
  // 나눗셈을 세로로 계산하는 차례를 그대로 밟는다. quot: 자리마다 몫의 숫자(아직 몫이 서지 않은 자리는 null),
  // rows: 과정의 줄 { value, end(끝 칸), sub(빼는 수인가) } — 빼는 수, 그다음에 남은 수와 내려 쓴 수가 번갈아 온다.
  function longDivision(divisor, dividend) {
    const digits = String(dividend).split('').map(Number), n = digits.length, quot = digits.map(() => null), rows = [];
    let cur = 0, started = false;
    for (let i = 0; i < n; i += 1) {
      cur = cur * 10 + digits[i];
      const q = Math.floor(cur / divisor);
      if (q === 0) { if (started) quot[i] = 0; continue; }
      started = true; quot[i] = q;
      rows.push({ value: q * divisor, end: i, sub: true });
      cur -= q * divisor;
      // 남은 수 옆에, 다음에 나눌 수 있을 때까지 아래 자리 숫자를 내려 쓴다.
      let j = i, shown = cur;
      while (j < n - 1 && shown < divisor) { j += 1; shown = shown * 10 + digits[j]; }
      rows.push({ value: shown, end: j, sub: false });
    }
    return { quot, rows };
  }
  // 나눗셈의 세로셈. 나누는 수 ) 나누어지는 수 를 적는다. o.steps 이면 몫과 계산 과정도 적는다.
  // 빈칸: o.quot(몫을 가리는 이름표), o.rows({ 줄 번호: 이름표 } — 과정의 줄은 0부터 센다). 이름표가 '' 이면 빈 네모.
  // o.given({ quot, rows }): 잘못 계산한 세로셈처럼 과정을 그대로 정해 줄 때 쓴다.
  function divSteps(divisor, dividend, options) {
    const o = options || {}, digits = String(dividend).split(''), n = digits.length, work = o.given || longDivision(divisor, dividend);
    // 수 하나를 끝 칸(end)에 맞춰 적은 줄. label 이 주어지면 그 수 자리에 빈칸을 둔다.
    const line = (text, end, label, cls) => {
      const len = String(text).length, from = end - len + 1;
      let out = '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td></td><td></td>';
      for (let c = 0; c < n; c += 1) {
        if (c < from || c > end) out += '<td></td>';
        else if (label !== undefined) { if (c === from) out += '<td colspan="' + len + '" class="mb-ld-blank">' + box(label) + '</td>'; }
        else out += '<td>' + String(text)[c - from] + '</td>';
      }
      return out + '</tr>';
    };
    const quotient = o.given ? String(o.given.quot) : work.quot.filter((q) => q !== null).join(''), hidden = o.rows || {};
    let out = o.steps ? line(quotient, n - 1, o.quot, 'mb-ld-quot') : '';
    out += '<tr class="mb-ld-top"><td>' + divisor + '</td><td class="mb-ld-hook"></td>' + digits.map((digit) => '<td>' + digit + '</td>').join('') + '</tr>';
    if (o.steps) work.rows.forEach((row, k) => { out += line(row.value, row.end, hidden[k], row.sub ? 'mb-ld-sub' : ''); });
    const said = o.steps ? ', 몫 ' + (o.quot !== undefined ? '□' : quotient) + ', 계산 과정: ' + work.rows.map((row, k) => (hidden[k] !== undefined ? '□' : row.value)).join(', ') : '';
    return '<table class="mb-longdiv" role="img" aria-label="나눗셈 세로셈 ' + dividend + ' 나누기 ' + divisor + said + '">' + out + '</table>';
  }
  const divColumn = (divisor, dividend) => divSteps(divisor, dividend);
  // 들이·무게의 눈금에 적는 글: 1000의 배수는 큰 단위로 적는다(1 L, 2 kg). 수와 단위는 띄어 쓴다.
  const amount = (value, small, big) => (value === 0 ? '0' : value % 1000 === 0 ? value / 1000 + ' ' + big : value + ' ' + small);
  // 눈금 비커. max: 가장 큰 눈금(mL), step: 작은 눈금 한 칸(mL), major: 수를 적는 눈금 간격(mL), level: 물의 높이(mL)
  function beaker(max, step, major, level) {
    const H = 112, W = 74, x0 = 10, y0 = 16, bottom = y0 + H, y = (ml) => bottom - (ml / max) * H;
    let out = '<rect class="mb-water" x="' + (x0 + 1) + '" y="' + y(level).toFixed(1) + '" width="' + (W - 2) + '" height="' + (bottom + 5 - y(level)).toFixed(1) + '"/>';
    out += '<path class="mb-vessel" d="M' + x0 + ' ' + (y0 - 8) + 'V' + (bottom + 6) + 'H' + (x0 + W) + 'V' + (y0 - 8) + '"/>';
    for (let v = step; v <= max; v += step) {
      const big = v % major === 0;
      out += '<line class="mb-ruler-tick" x1="' + (x0 + W) + '" y1="' + y(v).toFixed(1) + '" x2="' + (x0 + W - (big ? 18 : 10)) + '" y2="' + y(v).toFixed(1) + '"/>';
      if (big) out += '<text class="mb-km-label" x="' + (x0 + W + 5) + '" y="' + (y(v) + 4).toFixed(1) + '">' + amount(v, 'mL', 'L') + '</text>';
    }
    return '<svg class="mb-beaker" viewBox="0 0 150 140" width="195" role="img" aria-label="눈금 비커: 가장 큰 눈금 ' + max + ' mL, 작은 눈금 한 칸 ' + step + ' mL, 물은 작은 눈금 ' + level / step + '칸까지">' + out + '</svg>';
  }
  // 바늘 저울. max: 바늘이 한 바퀴 돌 때의 무게(g), step: 작은 눈금 한 칸(g), major: 수를 적는 눈금 간격(g), value: 바늘이 가리키는 무게(g)
  function dial(max, step, major, value) {
    const cx = 80, cy = 80, r = 62, at = (v, len) => { const a = (v / max) * 2 * Math.PI; return (cx + len * Math.sin(a)).toFixed(1) + ' ' + (cy - len * Math.cos(a)).toFixed(1); };
    const xy = (v, len) => at(v, len).split(' ');
    let out = '<circle class="mb-clock-face" cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
    for (let v = 0; v < max; v += step) {
      const big = v % major === 0, p = xy(v, r), q = xy(v, r - (big ? 10 : 5.5));
      out += '<line class="mb-ruler-tick" x1="' + p[0] + '" y1="' + p[1] + '" x2="' + q[0] + '" y2="' + q[1] + '"/>';
      if (big) { const t = xy(v, r - 29); out += '<text class="mb-km-label" x="' + t[0] + '" y="' + (Number(t[1]) + 4).toFixed(1) + '" text-anchor="middle">' + amount(v, 'g', 'kg') + '</text>'; }
    }
    const tip = xy(value, r - 14);
    out += '<line class="mb-needle" x1="' + cx + '" y1="' + cy + '" x2="' + tip[0] + '" y2="' + tip[1] + '"/><circle class="mb-dot" cx="' + cx + '" cy="' + cy + '" r="3.2"/>';
    return '<svg class="mb-dial" viewBox="0 0 160 160" width="200" role="img" aria-label="바늘 저울: 한 바퀴 ' + max + ' g, 작은 눈금 한 칸 ' + step + ' g, 바늘은 0에서 작은 눈금 ' + value / step + '칸">' + out + '</svg>';
  }
  // 모양과 크기가 같은 그릇에 옮겨 담은 물의 높이. names: 그릇 이름, heights: 물의 높이(칸 수, 1~10)
  function levels(names, heights) {
    const W = 44, gap = 22, H = 80, x = (i) => 14 + i * (W + gap), bottom = 14 + H;
    let out = '';
    names.forEach((name, i) => {
      const top = bottom - heights[i] * 7;
      out += '<rect class="mb-water" x="' + (x(i) + 1) + '" y="' + top + '" width="' + (W - 2) + '" height="' + (bottom - top) + '"/><path class="mb-vessel" d="M' + x(i) + ' 10V' + bottom + 'H' + (x(i) + W) + 'V10"/>'
        + '<text class="mb-km-label" x="' + (x(i) + W / 2) + '" y="' + (bottom + 16) + '" text-anchor="middle">' + name + '</text>';
    });
    return '<svg class="mb-levels" viewBox="0 0 ' + (14 + names.length * (W + gap)) + ' 116" width="' + Math.round((14 + names.length * (W + gap)) * 1.3) + '" role="img" aria-label="같은 그릇에 옮겨 담은 물의 높이: ' + names.map((name, i) => name + ' ' + heights[i] + '칸').join(', ') + '">' + out + '</svg>';
  }
  // 그림그래프. units: 그림 하나가 나타내는 수(큰 것부터 2~3가지), rows: [이름, 수] — 수가 null 이면 그 줄의 그림을 비워 둔다.
  // head: [항목 이름, 수량 이름], each: 수 뒤에 붙는 낱말(명·상자 …). 그림 설명에는 줄마다 그림의 종류와 개수만 적는다.
  // options.legend === false 이면 그림이 나타내는 수를 적지 않는다(표와 견주어 알아내는 문제).
  function pictograph(head, rows, units, each, options) {
    const sizes = units.length === 3 ? ['big', 'mid', 'small'] : ['big', 'small'];
    const split = (value) => { let rest = value; return units.map((u) => { const n = Math.floor(rest / u); rest -= n * u; return n; }); };
    const icon = (size) => '<i class="mb-pic mb-pic-' + size + '"></i>';
    const body = rows.map(([name, value]) => '<tr><td>' + name + '</td><td class="mb-picto-cell">' + (value === null ? '' : split(value).map((n, i) => icon(sizes[i]).repeat(n)).join('')) + '</td></tr>').join('');
    const said = rows.map(([name, value]) => name + ' ' + (value === null ? '그림 없음' : split(value).map((n, i) => units[i] + '짜리 ' + n + '개').join(', '))).join(' / ');
    return '<div class="mb-table-wrap"><table class="mb-table mb-picto" role="img" aria-label="그림그래프: ' + said + '"><thead><tr><th>' + head[0] + '</th><th>' + head[1] + '</th></tr></thead><tbody>' + body + '</tbody></table></div>'
      + (options && options.legend === false ? '' : '<div class="mb-picto-legend">' + units.map((u, i) => '<span>' + icon(sizes[i]) + ' ' + u + each + '</span>').join('') + '</div>');
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
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) if (!o.count || r * cols + c < o.count) out += '<circle class="mb-thing' + ((o.loop === 'rows' ? r : c) < (o.on || 0) ? ' is-on' : '') + '" cx="' + (pad + 7 + c * gap) + '" cy="' + (pad + 7 + r * gap) + '" r="6"/>';
    const said = o.count ? '물건 ' + o.count + '개' : '물건 ' + rows * cols + '개' + (o.loop === 'rows' ? ', ' + cols + '개씩 ' + rows + '묶음' : o.loop === 'cols' ? ', ' + rows + '개씩 ' + cols + '묶음' : ', ' + cols + '개씩 ' + rows + '줄') + (o.on ? ', 그 가운데 ' + o.on + '묶음을 색칠' : '');
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
  // 모눈: 세로 rows 칸, 가로 left + right 칸. 왼쪽 left 칸과 오른쪽 right 칸을 다른 빛깔로 칠한다(곱을 갈라 계산하는 그림).
  function splitGrid(rows, left, right) {
    const u = 11, pad = 3, width = pad * 2 + (left + right) * u, height = pad * 2 + rows * u;
    let out = '';
    for (let r = 0; r < rows; r += 1) for (let c = 0; c < left + right; c += 1) out += '<rect class="' + (c < left ? 'mb-tape-a' : 'mb-tape-b') + '" x="' + (pad + c * u) + '" y="' + (pad + r * u) + '" width="' + u + '" height="' + u + '"/>';
    return '<svg class="mb-splitgrid" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * 1.25) + '" role="img" aria-label="모눈: 세로 ' + rows + '칸, 가로 ' + (left + right) + '칸. 왼쪽 ' + left + '칸과 오른쪽 ' + right + '칸을 다른 빛깔로 칠했다">' + out + '</svg>';
  }
  // 자(작은 눈금 한 칸이 1mm)와 그 위에 놓인 물건. from·to 는 물건 두 끝이 놓인 곳(mm), cm 는 자에 적는 마지막 수.
  function ruler(from, to, cm) {
    const u = 4.6, x = (mm) => 11 + mm * u, width = 22 + cm * 10 * u, top = 27;
    let out = '<rect class="mb-ruler-body" x="4" y="' + top + '" width="' + (width - 8) + '" height="33" rx="2.5"/>';
    for (let mm = 0; mm <= cm * 10; mm += 1) out += '<line class="mb-ruler-tick" x1="' + x(mm) + '" y1="' + top + '" x2="' + x(mm) + '" y2="' + (top + (mm % 10 === 0 ? 13 : mm % 5 === 0 ? 9.5 : 6)) + '"/>';
    for (let c = 0; c <= cm; c += 1) out += '<text class="mb-ruler-number" x="' + x(c * 10) + '" y="' + (top + 26) + '" text-anchor="middle">' + c + '</text>';
    out += '<line class="mb-ruler-guide" x1="' + x(from) + '" y1="6" x2="' + x(from) + '" y2="' + top + '"/><line class="mb-ruler-guide" x1="' + x(to) + '" y1="6" x2="' + x(to) + '" y2="' + top + '"/>';
    out += '<rect class="mb-ruler-thing" x="' + x(from) + '" y="9" width="' + (to - from) * u + '" height="12" rx="2"/>';
    const place = (mm) => '눈금 ' + Math.floor(mm / 10) + (mm % 10 ? '에서 작은 눈금 ' + (mm % 10) + '칸 더 간 곳' : '');
    return '<svg class="mb-ruler" viewBox="0 0 ' + width + ' 66" width="' + Math.round(width * 1.35) + '" role="img" aria-label="자 위에 놓인 물건: 왼쪽 끝은 ' + place(from) + ', 오른쪽 끝은 ' + place(to) + '">' + out + '</svg>';
  }
  // 1km 를 열 칸으로 똑같이 나눈 수직선. from: 왼쪽 끝(km), spans: 그리는 km 수, at: 화살표가 가리키는 곳(m).
  function kmLine(from, spans, at) {
    const u = 250 / (spans * 10), x = (i) => 18 + i * u, y = 32, width = 36 + spans * 10 * u, k = (at - from * 1000) / 100;
    let out = '<line class="mb-axis" x1="' + x(0) + '" y1="' + y + '" x2="' + x(spans * 10) + '" y2="' + y + '"/>';
    for (let i = 0; i <= spans * 10; i += 1) out += '<line class="mb-axis" x1="' + x(i) + '" y1="' + (y - (i % 10 === 0 ? 6 : 3.5)) + '" x2="' + x(i) + '" y2="' + (y + (i % 10 === 0 ? 6 : 3.5)) + '"/>';
    for (let i = 0; i <= spans; i += 1) out += '<text class="mb-km-label" x="' + x(i * 10) + '" y="' + (y + 20) + '" text-anchor="middle">' + (from + i) + ' km</text>';
    out += '<path class="mb-pointer" d="M' + x(k) + ' ' + (y - 8) + 'l-4.5 -9h9z"/>';
    return '<svg class="mb-numberline" viewBox="0 0 ' + width + ' 58" width="' + Math.round(width * 1.05) + '" role="img" aria-label="수직선: 1 km를 10칸으로 똑같이 나누었다. 화살표는 ' + (from + Math.floor(k / 10)) + ' km에서 작은 눈금 ' + (k % 10) + '칸 더 간 곳">' + out + '</svg>';
  }
  // 시간의 세로셈. 줄마다 칸 글(예: ['3시', '25분', '30초'])을 받는다. result 를 주면 결과 줄도 적는다(빈칸 섞어 쓰기).
  function timeColumn(first, sign, second, result) {
    const width = Math.max(first.length, second.length, result ? result.length : 0);
    const row = (cells, mark, cls) => '<tr' + (cls ? ' class="' + cls + '"' : '') + '><th>' + (mark || '') + '</th>' + '<td></td>'.repeat(width - cells.length) + cells.map((cell) => '<td>' + cell + '</td>').join('') + '</tr>';
    return '<table class="mb-timecol"><tbody>' + row(first) + row(second, SIGN[sign]) + row(result || Array.from({ length: width }, () => ''), '', 'mb-timecol-result') + '</tbody></table>';
  }
  // 분수. 화면에는 가로줄로 보이고, 글로 옮기면 3/4 가 되게 빗금을 숨겨 둔다.
  const frac = (n, d) => '<span class="mb-frac"><span>' + n + '</span><span class="mb-frac-bar">/</span><span>' + d + '</span></span>';
  // 대분수: 자연수와 진분수를 붙여 적는다.
  const mixed = (whole, n, d) => '<span class="mb-mixed">' + whole + frac(n, d) + '</span>';
  // 0부터 spans 까지의 수직선. 1을 parts 칸으로 똑같이 나누고 at(0에서 센 작은 눈금의 수)에 화살표를 둔다.
  function partLine(spans, parts, at) {
    const total = spans * parts, u = Math.min(24, 252 / total), x = (i) => 16 + i * u, y = 30, width = 32 + total * u;
    let out = '<line class="mb-axis" x1="' + x(0) + '" y1="' + y + '" x2="' + x(total) + '" y2="' + y + '"/>';
    for (let i = 0; i <= total; i += 1) out += '<line class="mb-axis" x1="' + x(i) + '" y1="' + (y - (i % parts === 0 ? 6 : 3.5)) + '" x2="' + x(i) + '" y2="' + (y + (i % parts === 0 ? 6 : 3.5)) + '"/>';
    for (let i = 0; i <= spans; i += 1) out += '<text class="mb-km-label" x="' + x(i * parts) + '" y="' + (y + 20) + '" text-anchor="middle">' + i + '</text>';
    out += '<path class="mb-pointer" d="M' + x(at) + ' ' + (y - 8) + 'l-4.5 -9h9z"/>';
    return '<svg class="mb-numberline" viewBox="0 0 ' + width + ' 56" width="' + Math.round(width * 1.05) + '" role="img" aria-label="수직선: 0부터 ' + spans + '까지, 1을 똑같이 ' + parts + '칸으로 나누었다. 화살표는 0에서 작은 눈금 ' + at + '칸 간 곳">' + out + '</svg>';
  }
  // 나눈 도형. kind: 'bar'(띠) | 'circle'(원) | 'grid'(가로 cols 칸씩 여러 줄), n: 조각 수.
  // options: shaded 색칠한 조각 수(앞에서부터), uneven 크기가 다르게 나눔, cols 격자의 가로 칸 수, size 그림 너비.
  function pieces(kind, n, options) {
    const o = options || {}, shaded = o.shaded || 0, cls = (i) => (i < shaded ? 'mb-piece is-on' : 'mb-piece');
    // 크기가 다르게 나눌 때의 몫(눈에 띄게 다르다)
    const share = Array.from({ length: n }, (_, i) => (o.uneven ? [1.9, 0.6, 1.3, 0.75, 1.6, 0.85, 1.2, 0.7][i % 8] : 1)), total = share.reduce((s, v) => s + v, 0);
    let out = '', width = 124, height = 44;
    if (kind === 'circle') {
      width = 64; height = 64; let from = -90;
      for (let i = 0; i < n; i += 1) {
        const to = from + (share[i] / total) * 360, p = (deg) => (32 + 28 * Math.cos((deg * Math.PI) / 180)).toFixed(2) + ' ' + (32 + 28 * Math.sin((deg * Math.PI) / 180)).toFixed(2);
        out += '<path class="' + cls(i) + '" d="M32 32L' + p(from) + 'A28 28 0 ' + (to - from > 180 ? 1 : 0) + ' 1 ' + p(to) + 'Z"/>'; from = to;
      }
    } else if (kind === 'grid') {
      const cols = o.cols || n, rows = n / cols, cell = Math.min(24, 120 / cols); width = cols * cell + 4; height = rows * cell + 4;
      for (let i = 0; i < n; i += 1) out += '<rect class="' + cls(i) + '" x="' + (2 + (i % cols) * cell) + '" y="' + (2 + Math.floor(i / cols) * cell) + '" width="' + cell + '" height="' + cell + '"/>';
    } else {
      let x = 2;
      for (let i = 0; i < n; i += 1) { const w = (share[i] / total) * 120; out += '<rect class="' + cls(i) + '" x="' + x.toFixed(2) + '" y="2" width="' + w.toFixed(2) + '" height="40"/>'; x += w; }
    }
    const said = (kind === 'circle' ? '원' : '사각형') + '을 ' + (o.uneven ? '크기가 다르게 ' : '똑같이 ') + n + '조각으로 나누고 ' + shaded + '조각을 색칠';
    return '<svg class="mb-pieces" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * (o.scale || 1.6)) + '" role="img" aria-label="' + said + '">' + out + '</svg>';
  }
  // 한 조각만 선이 그어진 도형: rows×cols 로 똑같이 나눌 수 있는 사각형에서 한 칸만 색칠해 보인다(나머지 선은 긋지 않는다).
  function onePiece(rows, cols) {
    const cell = 22, width = cols * cell + 4, height = rows * cell + 4;
    return '<svg class="mb-pieces" viewBox="0 0 ' + width + ' ' + height + '" width="' + Math.round(width * 1.7) + '" role="img" aria-label="사각형의 한 칸만 색칠: 가로로 ' + cols + '칸, 세로로 ' + rows + '칸이 들어가는 크기">'
      + '<rect class="mb-piece" x="2" y="2" width="' + cols * cell + '" height="' + rows * cell + '"/><rect class="mb-piece is-on" x="2" y="2" width="' + cell + '" height="' + cell + '"/></svg>';
  }
  // 작은 정사각형을 이어 붙인 모양. cells: [가로, 세로] 자리의 목록.
  // 모양마다 정사각형의 크기가 같아 보이게 배율은 그대로 두고, 좁은 모양은 양옆 여백만 넓힌다.
  function squares(cells, scale) {
    const cell = 16, cols = Math.max.apply(null, cells.map((c) => c[0])) + 1, rows = Math.max.apply(null, cells.map((c) => c[1])) + 1;
    const width = Math.max(cols * cell + 4, 44), left = (width - cols * cell) / 2;
    return '<svg class="mb-pieces" viewBox="0 0 ' + width + ' ' + (rows * cell + 4) + '" width="' + Math.round(width * (scale || 1.5)) + '" role="img" aria-label="작은 정사각형 ' + cells.length + '개를 이어 붙인 모양">'
      + cells.map((c) => '<rect class="mb-piece is-on" x="' + (left + c[0] * cell) + '" y="' + (2 + c[1] * cell) + '" width="' + cell + '" height="' + cell + '"/>').join('') + '</svg>';
  }
  // 1 을 열 칸으로 똑같이 나눈 수직선. from: 왼쪽 끝의 수, k: 화살표가 가리키는 작은 눈금(1~9).
  function tenthLine(from, k) {
    const u = 25, x = (i) => 18 + i * u, y = 32, width = 36 + 10 * u;
    let out = '<line class="mb-axis" x1="' + x(0) + '" y1="' + y + '" x2="' + x(10) + '" y2="' + y + '"/>';
    for (let i = 0; i <= 10; i += 1) out += '<line class="mb-axis" x1="' + x(i) + '" y1="' + (y - (i % 10 === 0 ? 6 : 3.5)) + '" x2="' + x(i) + '" y2="' + (y + (i % 10 === 0 ? 6 : 3.5)) + '"/>';
    out += '<text class="mb-km-label" x="' + x(0) + '" y="' + (y + 20) + '" text-anchor="middle">' + from + '</text><text class="mb-km-label" x="' + x(10) + '" y="' + (y + 20) + '" text-anchor="middle">' + (from + 1) + '</text>';
    out += '<path class="mb-pointer" d="M' + x(k) + ' ' + (y - 8) + 'l-4.5 -9h9z"/>';
    return '<svg class="mb-numberline" viewBox="0 0 ' + width + ' 58" width="' + Math.round(width * 1.05) + '" role="img" aria-label="수직선: ' + josa(from, '과/와') + ' ' + (from + 1) + ' 사이를 10칸으로 똑같이 나누었다. 화살표는 ' + from + '에서 작은 눈금 ' + k + '칸 더 간 곳">' + out + '</svg>';
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
  // 분수 하나를 답하는 문항: 분자와 분모를 위아래 칸에 적는다. 답은 더 줄일 수 없는 분수(기약분수)로 적는다.
  // o.whole 을 주면 대분수(자연수 칸 + 분자·분모 칸), o.improper: true 면 가분수(분자가 분모보다 크다), o.unit 은 분수 뒤에 적는 단위.
  const F = (text, top, bottom, o) => ({ text, figure: o.figure, inputs: (o.whole != null ? [{ answer: o.whole, label: '자연수' }] : []).concat([{ answer: top, label: '분자' }, { answer: bottom, label: '분모' }]), fraction: true, mixed: o.whole != null, improper: Boolean(o.improper), unit: o.unit || '', explain: o.explain || '', facts: o.facts || {} });
  // 소수 하나를 답하는 문항(소수 셋째 자리까지)
  const D = (text, answer, o) => ({ text, figure: o.figure, inputs: [{ answer, unit: o.unit, lead: o.lead, decimal: true }], explain: o.explain || '', facts: o.facts || {} });
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
  // 막대그래프(4학년). names: 항목, values: 값(null 이면 막대를 그리지 않는다).
  // options: step(눈금 한 칸의 크기, 기본 1), major(수를 적는 굵은 눈금 사이의 칸 수, 기본 5), top(맨 끝 눈금의 값), unit('명'),
  //          title(항목 쪽 이름: '운동'), flip(가로 막대), second(둘째 막대의 값들)와 legend([첫째 이름, 둘째 이름]).
  // 그림 설명(aria-label)에 눈금 한 칸의 크기와 항목마다의 값을 적는다(검사가 그 글로 식의 수를 맞춰 본다).
  function barChart(names, values, options) {
    const o = options || {}, step = o.step || 1, major = o.major || 5, unit = o.unit || '', series = o.second ? [values, o.second] : [values];
    const biggest = Math.max.apply(null, series.reduce((all, list) => all.concat(list), []).filter((v) => v != null));
    const top = o.top || Math.ceil(biggest / (step * major)) * step * major, ticks = top / step, n = names.length;
    const word = 'style="font-size:11px;font-weight:600"', fills = ['#93c5fd', '#fdba74'];
    const bar = (x, y, w, h, k) => '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" style="fill:' + fills[k] + ';stroke:#1e3a8a;stroke-width:1"/>';
    const label = (x, y, anchor, value) => '<text class="mb-axis-label" ' + word + ' x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anchor + '">' + value + '</text>';
    const rule = (x1, y1, x2, y2, strong, axis) => '<line class="' + (axis ? 'mb-axis' : 'mb-gridline') + '"' + (strong ? ' style="stroke:#8fa3b8"' : '') + ' x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
    let out = '', width, height;
    if (!o.flip) {
      const H = Math.min(12, 168 / ticks), W = Math.min(48, 244 / n), left = 34, topPad = 24, y = (v) => topPad + (top - v) / step * H, base = topPad + ticks * H;
      width = left + n * W + 12; height = base + (o.title ? 40 : 24);
      for (let t = 0; t <= ticks; t += 1) out += rule(left, y(t * step), left + n * W, y(t * step), t % major === 0);
      for (let i = 0; i <= n; i += 1) out += rule(left + i * W, topPad, left + i * W, base);
      for (let t = 0; t <= ticks; t += major) out += label(left - 5, y(t * step) + 4, 'end', t * step);
      if (unit) out += label(left - 4, topPad - 10, 'end', '(' + unit + ')');
      series.forEach((list, k) => list.forEach((v, i) => {
        if (v == null) return;
        const bw = W * (series.length > 1 ? 0.3 : 0.5);
        out += bar(left + i * W + (series.length > 1 ? W * 0.2 + k * bw : W * 0.25), y(v), bw, base - y(v), k);
      }));
      names.forEach((name, i) => { out += label(left + i * W + W / 2, base + 15, 'middle', name); });
      out += rule(left, topPad, left, base, false, true) + rule(left, base, left + n * W, base, false, true);
      if (o.title) out += label(left + n * W, base + 32, 'end', o.title);
    } else {
      const longest = Math.max.apply(null, names.concat(o.title ? [o.title] : []).map((name) => String(name).length)), left = 14 + longest * 11, off = String(top).length * 3.3 + 4, room = unit ? Math.max(30, off + Array.from(unit).length * 11 + 12) : 30, W = Math.min(13, (298 - room - left) / ticks), H = 26, topPad = o.title ? 22 : 8, x = (v) => left + v / step * W, base = topPad + n * H;
      width = left + ticks * W + room; height = base + 24;
      for (let t = 0; t <= ticks; t += 1) out += rule(x(t * step), topPad, x(t * step), base, t % major === 0);
      for (let i = 0; i <= n; i += 1) out += rule(left, topPad + i * H, x(top), topPad + i * H);
      for (let t = 0; t <= ticks; t += major) out += label(x(t * step), base + 14, 'middle', t * step);
      if (unit) out += label(x(top) + off, base + 14, 'start', '(' + unit + ')');
      series.forEach((list, k) => list.forEach((v, i) => {
        if (v == null) return;
        const bh = H * (series.length > 1 ? 0.3 : 0.5);
        out += bar(left, topPad + i * H + (series.length > 1 ? H * 0.2 + k * bh : H * 0.25), x(v) - left, bh, k);
      }));
      names.forEach((name, i) => { out += label(left - 6, topPad + i * H + H / 2 + 4, 'end', name); });
      out += rule(left, topPad, left, base, false, true) + rule(left, base, x(top), base, false, true);
      if (o.title) out += label(left - 6, topPad - 8, 'end', o.title);
    }
    // 그림 설명에서도 수와 단위 기호는 띄어 쓴다(20 kg). 우리말 단위는 붙여 쓴다(20명).
    const amount = (v) => v + (/^[A-Za-z]/.test(unit) ? ' ' : '') + unit;
    const told = (list) => names.map((name, i) => name + ' ' + (list[i] == null ? '막대 없음' : amount(list[i]))).join(', ');
    const said = '막대그래프: ' + (o.flip ? '가로' : '세로') + ' 눈금 한 칸은 ' + amount(step) + '. ' + (o.second ? (o.legend ? o.legend[0] : '첫째') + ' — ' + told(values) + ' / ' + (o.legend ? o.legend[1] : '둘째') + ' — ' + told(o.second) : told(values));
    const key = o.second && o.legend ? '<div class="mb-lines" style="font-size:0.9rem"><div>' + o.legend.map((name, k) => '<span style="margin-right:14px"><span style="display:inline-block;width:12px;height:12px;margin-right:4px;vertical-align:-1px;background:' + fills[k] + ';border:1px solid #1e3a8a"></span>' + name + '</span>').join('') + '</div></div>' : '';
    return '<svg class="mb-numberline" viewBox="0 0 ' + Math.ceil(width) + ' ' + Math.ceil(height) + '" width="' + Math.ceil(width) + '" role="img" aria-label="' + said + '">' + out + '</svg>' + key;
  }
  // 꺾은선그래프. names: 가로에 적는 것(월, 요일, 시각 …), values: 점의 값(null 이면 점을 찍지 않는다).
  // options: step(세로 눈금 한 칸의 크기), major(수를 적는 굵은 눈금 사이의 칸 수), top(맨 위 눈금), from(물결선 위 첫 눈금 — 0과 from 사이를 물결선으로 줄인다),
  //          unit(세로 단위), title(가로에 적는 것의 이름), second(둘째 꺾은선의 값), legend([첫째 이름, 둘째 이름])
  function lineChart(names, values, options) {
    const o = options || {}, step = o.step || 1, major = o.major || 5, unit = o.unit || '', from = o.from || 0, series = o.second ? [values, o.second] : [values];
    const all = series.reduce((list, one) => list.concat(one), []).filter((v) => v != null), biggest = Math.max.apply(null, all);
    const top = o.top || from + Math.ceil((biggest - from) / (step * major)) * step * major, ticks = (top - from) / step, n = names.length;
    const word = 'style="font-size:11px;font-weight:600"', inks = ['#1d4ed8', '#c2410c'];
    const label = (x, y, anchor, value) => '<text class="mb-axis-label" ' + word + ' x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="' + anchor + '">' + value + '</text>';
    const rule = (x1, y1, x2, y2, strong, axis) => '<line class="' + (axis ? 'mb-axis' : 'mb-gridline') + '"' + (strong ? ' style="stroke:#8fa3b8"' : '') + ' x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>';
    const H = Math.min(12, 168 / ticks), W = Math.min(44, 244 / n), left = 12 + Math.max(2, String(top).length) * 7, topPad = 24, gap = from ? 20 : 0;
    const y = (v) => topPad + (top - v) / step * H, x = (i) => left + W * (i + 0.5), cut = topPad + ticks * H, base = cut + gap, right = left + W * n;
    const width = right + 12, height = base + (o.title ? 40 : 24);
    let out = '';
    for (let t = 0; t <= ticks; t += 1) out += rule(left, y(from + t * step), right, y(from + t * step), t % major === 0);
    for (let i = 0; i < n; i += 1) out += rule(x(i), topPad, x(i), base);
    out += rule(right, topPad, right, base);
    for (let t = 0; t <= ticks; t += major) out += label(left - 5, y(from + t * step) + 4, 'end', from + t * step);
    if (from) {
      // 물결선: 0과 첫 눈금 사이를 줄였다는 표시
      let wave = 'M' + left.toFixed(1) + ' ' + (cut + 10).toFixed(1);
      const waves = Math.max(1, Math.round((right - left) / 12)), half = (right - left) / waves / 2;
      for (let w = 0; w < waves; w += 1) wave += ' q' + (half / 2).toFixed(2) + ' -5 ' + half.toFixed(2) + ' 0 t' + half.toFixed(2) + ' 0';
      out += '<path d="' + wave + '" style="fill:none;stroke:#475569;stroke-width:1.2"/>' + label(left - 5, base + 4, 'end', 0);
    }
    if (unit) out += label(left - 4, topPad - 10, 'end', '(' + unit + ')');
    names.forEach((name, i) => { out += label(x(i), base + 15, 'middle', name); });
    out += rule(left, topPad, left, base, false, true) + rule(left, base, right, base, false, true);
    if (o.title) out += label(right, base + 32, 'end', o.title);
    series.forEach((list, k) => {
      let path = '', pen = false;
      list.forEach((v, i) => { if (v == null) { pen = false; return; } path += (pen ? ' L' : ' M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); pen = true; });
      out += '<path d="' + path.trim() + '" style="fill:none;stroke:' + inks[k] + ';stroke-width:1.8' + (k ? ';stroke-dasharray:5 3' : '') + '"/>';
      list.forEach((v, i) => { if (v != null) out += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="2.8" style="fill:' + inks[k] + '"/>'; });
    });
    const amount = (v) => v + (/^[A-Za-z°]/.test(unit) ? ' ' : '') + unit;
    const told = (list) => names.map((name, i) => name + ' ' + (list[i] == null ? '점 없음' : amount(list[i]))).join(', ');
    const said = '꺾은선그래프: 세로 눈금 한 칸은 ' + amount(step) + '. ' + (from ? '물결선으로 0과 ' + from + ' 사이를 줄였다. ' : '') + (o.second ? (o.legend ? o.legend[0] : '첫째') + ' — ' + told(values) + ' / ' + (o.legend ? o.legend[1] : '둘째') + ' — ' + told(o.second) : told(values));
    const key = o.second && o.legend ? '<div class="mb-lines" style="font-size:0.9rem"><div>' + o.legend.map((name, k) => '<span style="margin-right:14px"><span style="display:inline-block;width:24px;margin-right:4px;vertical-align:middle;border-top:2.5px ' + (k ? 'dashed ' : 'solid ') + inks[k] + '"></span>' + name + '</span>').join('') + '</div></div>' : '';
    return '<svg class="mb-numberline" viewBox="0 0 ' + Math.ceil(width) + ' ' + Math.ceil(height) + '" width="' + Math.ceil(width) + '" role="img" aria-label="' + said + '">' + out + '</svg>' + key;
  }
  // 답 맞추기. 수는 쉼표·빈칸을 떼고 견준다. unordered 인 문항은 답의 차례를 따지지 않는다.
  const cleanNumber = (text) => String(text == null ? '' : text).replace(/[,\s]/g, '');
  // 소수 칸(decimal)은 소수 셋째 자리까지 적은 수를 받는다(0.50처럼 끝에 0을 적어도 같은 수로 본다). 나머지 칸은 자연수만 받는다.
  function isCorrect(item, response) {
    if (item.choice) return Number(response) === item.choice.answer;
    const given = (Array.isArray(response) ? response : [response]).map(cleanNumber);
    if (given.length !== item.inputs.length || !given.every((text, i) => (item.inputs[i].decimal ? /^\d+(\.\d{1,3})?$/ : /^\d+$/).test(text))) return false;
    // 자연수 칸은 수 그대로 견준다(열몇 자리 수는 곱하면 어긋난다). 소수 칸만 1000배 하여 견준다.
    const want = item.inputs.map((input) => (input.decimal ? Math.round(input.answer * 1000) : input.answer)), got = given.map((text, i) => (item.inputs[i].decimal ? Math.round(Number(text) * 1000) : Number(text)));
    if (item.unordered) { want.sort((a, b) => a - b); got.sort((a, b) => a - b); }
    return want.every((value, i) => value === got[i]);
  }

  root.MathBank = {
    Dice, addUnit, addTypes, addGroup, findUnit, findGroup, typesOf, bankOf, makeRound, roundCount, isCorrect, LEVELS, ROUND_SIZE,
    units: () => units.slice(),
    kit: { digitsOf, carryPlaces, borrowPlaces, mulCarries, count, plain, josa, name, NAMES, groupsOf, cut, say, named, barChart, lineChart, esc, LABELS, box, frac, mixed, partLine, expr, column, columnSteps, divColumn, divSteps, longDivision, pictograph, beaker, dial, levels, timeColumn, chars, blocks, counters, ruler, kmLine, splitGrid, tenthLine, pieces, onePiece, squares, cards, lines, tagged, numbers, chain, table, route, tapes, bar, shapes, dots, numberLine, N, M, C, F, D, E, nick, addPair, subPair, pairNear, ADD, SUB, mulPair, MUL, result, shown }
  };
})(typeof window !== 'undefined' ? window : globalThis);
