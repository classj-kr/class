// 수학 문제은행의 엔진. 단원 파일(units/*.js)이 여기에 단원을 등록하고, 화면(app.js)과 검사가 여기서 문항을 만든다.
// 문항은 저장해 둔 글이 아니라 씨앗(seed)에서 만들어 낸다. 같은 씨앗이면 같은 문항이 나오므로
// 풀던 판을 다시 열어도 같은 문제가 보이고, 새 씨앗을 주면 수가 바뀐 새 문제가 된다.
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
  const SIGN = { '+': '+', '-': '−' };
  function expr() {
    return '<span class="mb-expr">' + Array.from(arguments).map((part) => (SIGN[part] ? '<i>' + SIGN[part] + '</i>' : part === '=' ? '<i>=</i>' : part)).join(' ') + '</span>';
  }
  // 세로셈. 각 줄은 글자 배열이고, 글자 자리에 box() 를 넣으면 가려진 숫자가 된다.
  function column(top, sign, bottom, result) {
    const width = Math.max(top.length, bottom.length, result ? result.length : 0);
    const cells = (list) => { const pad = width - list.length; return '<span class="mb-cell"></span>'.repeat(pad) + list.map((ch) => '<span class="mb-cell">' + ch + '</span>').join(''); };
    return '<div class="mb-column" role="img" aria-label="세로셈">'
      + '<div class="mb-row"><span class="mb-sign"></span>' + cells(top) + '</div>'
      + '<div class="mb-row"><span class="mb-sign">' + SIGN[sign] + '</span>' + cells(bottom) + '</div>'
      + '<div class="mb-rule"></div>'
      + '<div class="mb-row"><span class="mb-sign"></span>' + (result ? cells(result) : '<span class="mb-cell mb-wide">' + box() + '</span>') + '</div>'
      + '</div>';
  }
  const chars = (n) => String(n).split('');
  // 수 모형: 백 모형(판)·십 모형(막대)·일 모형(낱개)
  function blocks(n, label) {
    const [h, t, o] = [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];
    const parts = []; let x = 4;
    for (let i = 0; i < h; i += 1) {
      let grid = '';
      for (let k = 1; k < 10; k += 1) grid += '<path d="M' + (x + k * 3.4) + ' 6v34M' + x + ' ' + (6 + k * 3.4) + 'h34"/>';
      parts.push('<g class="mb-flat"><rect x="' + x + '" y="6" width="34" height="34" rx="1.5"/>' + grid + '</g>'); x += 38;
    }
    x += h ? 6 : 0;
    for (let i = 0; i < t; i += 1) {
      let ticks = '';
      for (let k = 1; k < 10; k += 1) ticks += '<path d="M' + x + ' ' + (6 + k * 3.4) + 'h5"/>';
      parts.push('<g class="mb-rod"><rect x="' + x + '" y="6" width="5" height="34" rx="1"/>' + ticks + '</g>'); x += 8;
    }
    x += t ? 6 : 0;
    for (let i = 0; i < o; i += 1) {
      const col = Math.floor(i / 5), row = i % 5;
      parts.push('<rect class="mb-one" x="' + (x + col * 8) + '" y="' + (6 + row * 7) + '" width="5.4" height="5.4" rx="1"/>');
    }
    x += o ? Math.ceil(o / 5) * 8 : 0;
    const width = Math.max(x + 4, 60);
    return '<figure class="mb-blocks">' + (label ? '<figcaption>' + esc(label) + '</figcaption>' : '')
      + '<svg viewBox="0 0 ' + width + ' 46" width="' + Math.round(width * 2.1) + '" role="img" aria-label="수 모형: 백 모형 ' + h + '개, 십 모형 ' + t + '개, 일 모형 ' + o + '개">' + parts.join('') + '</svg></figure>';
  }
  const cards = (list) => '<span class="mb-cards">' + list.map((d) => '<span class="mb-card">' + d + '</span>').join('') + '</span>';

  // ── 단원 등록과 문항 만들기 ──────────────────────────────────
  function hash(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function addUnit(unit) { units.push(unit); }
  function findUnit(id) { return units.find((u) => u.id === id) || null; }
  function findGroup(unit, groupId) { return unit.groups.find((g) => g.id === groupId) || null; }
  const LEVELS = ['기본', '실력'];
  const typesOf = (group, level) => group.types.filter((type) => type.level === level);
  // 한 판: 그 묶음·수준의 유형을 차례대로, 유형마다 정해진 수만큼.
  function makeRound(unit, groupId, level, seed) {
    const group = findGroup(unit, groupId);
    const items = [];
    typesOf(group, level).forEach((type) => {
      for (let n = 0; n < (type.count || 1); n += 1) {
        // 유형·차례마다 따로 난수를 돌린다. 한 유형을 고쳐도 다른 문항의 수가 바뀌지 않고,
        // 묶음이 달라도 같은 수가 되풀이되지 않는다.
        const dice = new Dice(hash(seed + ':' + type.id + ':' + n));
        const made = type.make(dice, n);
        items.push(Object.assign({ key: type.id + '#' + (n + 1), typeId: type.id, typeTitle: type.title, level: type.level, standard: type.standard || group.standard }, made));
      }
    });
    return items;
  }
  // 답 맞추기. 수는 쉼표·빈칸을 떼고 견준다.
  const cleanNumber = (text) => String(text == null ? '' : text).replace(/[,\s]/g, '');
  function isCorrect(item, response) {
    if (item.choice) return Number(response) === item.choice.answer;
    const given = Array.isArray(response) ? response : [response];
    return item.inputs.every((input, i) => cleanNumber(given[i]) !== '' && Number(cleanNumber(given[i])) === input.answer && /^\d+$/.test(cleanNumber(given[i])));
  }

  root.MathBank = {
    Dice, addUnit, findUnit, findGroup, typesOf, makeRound, isCorrect, LEVELS,
    units: () => units.slice(),
    kit: { digitsOf, carryPlaces, borrowPlaces, count, plain, josa, name, NAMES, esc, LABELS, box, expr, column, chars, blocks, cards }
  };
})(typeof window !== 'undefined' ? window : globalThis);
