// 타자 레이스: 서버와 화면이 같은 규칙으로 타수·점수를 센다.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TypingRaceCore = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const INITIAL = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'.split('');
  const MEDIAL = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅗㅏ', 'ㅗㅐ', 'ㅗㅣ', 'ㅛ', 'ㅜ', 'ㅜㅓ', 'ㅜㅔ', 'ㅜㅣ', 'ㅠ', 'ㅡ', 'ㅡㅣ', 'ㅣ'];
  const FINAL = ['', 'ㄱ', 'ㄲ', 'ㄱㅅ', 'ㄴ', 'ㄴㅈ', 'ㄴㅎ', 'ㄷ', 'ㄹ', 'ㄹㄱ', 'ㄹㅁ', 'ㄹㅂ', 'ㄹㅅ', 'ㄹㅌ', 'ㄹㅍ', 'ㄹㅎ', 'ㅁ', 'ㅂ', 'ㅂㅅ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  // 조합 중에 낱자로 보이는 겹자모도 실제로 누른 키로 풀어 둔다.
  const COMPAT = { ㄳ: 'ㄱㅅ', ㄵ: 'ㄴㅈ', ㄶ: 'ㄴㅎ', ㄺ: 'ㄹㄱ', ㄻ: 'ㄹㅁ', ㄼ: 'ㄹㅂ', ㄽ: 'ㄹㅅ', ㄾ: 'ㄹㅌ', ㄿ: 'ㄹㅍ', ㅀ: 'ㄹㅎ', ㅄ: 'ㅂㅅ', ㅘ: 'ㅗㅏ', ㅙ: 'ㅗㅐ', ㅚ: 'ㅗㅣ', ㅝ: 'ㅜㅓ', ㅞ: 'ㅜㅔ', ㅟ: 'ㅜㅣ', ㅢ: 'ㅡㅣ' };
  const MODES = {
    'ko-words': { label: '한글 낱말', short: '낱말', lang: 'ko', sentence: false },
    'ko-sentences': { label: '한글 속담', short: '속담', lang: 'ko', sentence: true },
    'en-words': { label: '영어 단어', short: 'Words', lang: 'en', sentence: false },
  };
  const DURATIONS = [60, 90, 120, 180];
  const RACERS = ['🚀', '🏎️', '🐆', '🦄', '🐉', '🦖', '🐬', '🦅', '🐝', '🦊', '🐯', '🐧', '🛸', '🚁', '🐎', '🦈', '🐙', '🦉', '🐼', '🐸', '🦁', '🐳', '🦋', '🐢'];
  const COMBO_CAP = 10;
  // 팀전: 팀마다 1~5명, 8팀까지. 모두가 보탠 점수를 합쳐 겨룬다.
  const TEAM_MAX = 5;
  const TEAM_COUNTS = [2, 3, 4, 5, 6, 7, 8];
  const TEAMS = [
    { name: '레드', emoji: '🔴', hue: 352 },
    { name: '블루', emoji: '🔵', hue: 212 },
    { name: '그린', emoji: '🟢', hue: 140 },
    { name: '옐로', emoji: '🟡', hue: 48 },
    { name: '퍼플', emoji: '🟣', hue: 275 },
    { name: '오렌지', emoji: '🟠', hue: 26 },
    { name: '핑크', emoji: '💗', hue: 322 },
    { name: '스카이', emoji: '💠', hue: 190 },
  ];
  function teamBoard(rows, teamCount) {
    const teams = TEAMS.slice(0, teamCount).map((t, index) => {
      const members = rows.filter((r) => r.team === index);
      const total = members.reduce((s, r) => s + (r.score || 0), 0);
      const reached = Math.max(0, ...members.map((r) => r.scoredAt || 0)) || null;
      return { index, name: t.name, emoji: t.emoji, hue: t.hue, size: members.length, total, value: total, reached };
    });
    const ranked = teams
      .filter((t) => t.size)
      .sort((a, b) => b.value - a.value || (a.reached ?? Infinity) - (b.reached ?? Infinity) || a.index - b.index);
    ranked.forEach((t, i) => (t.rank = i + 1));
    return teams;
  }

  function keys(text) {
    let out = '';
    for (const char of String(text || '')) {
      const code = char.charCodeAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) {
        const offset = code - 0xac00;
        out += INITIAL[Math.floor(offset / 588)] + MEDIAL[Math.floor((offset % 588) / 28)] + FINAL[offset % 28];
      } else out += COMPAT[char] || char;
    }
    return out;
  }
  // 한/영 키가 영어로 되어 있을 때 친 글자(qjfduTek)를 두벌식 자판대로 한글(벌였다)로 바꾼다.
  const DUBEOL = { q: 'ㅂ', w: 'ㅈ', e: 'ㄷ', r: 'ㄱ', t: 'ㅅ', y: 'ㅛ', u: 'ㅕ', i: 'ㅑ', o: 'ㅐ', p: 'ㅔ', a: 'ㅁ', s: 'ㄴ', d: 'ㅇ', f: 'ㄹ', g: 'ㅎ', h: 'ㅗ', j: 'ㅓ', k: 'ㅏ', l: 'ㅣ', z: 'ㅋ', x: 'ㅌ', c: 'ㅊ', v: 'ㅍ', b: 'ㅠ', n: 'ㅜ', m: 'ㅡ', Q: 'ㅃ', W: 'ㅉ', E: 'ㄸ', R: 'ㄲ', T: 'ㅆ', O: 'ㅒ', P: 'ㅖ' };
  // 거꾸로: 한/영 키가 한글일 때 영어 낱말을 치면 ㅈ댜홋처럼 찍힌다. 두벌식 자판대로 친 키(weight)를 되살린다.
  // 입력기가 받침을 다음 글자로 넘겨도 친 키의 차례는 그대로라, 키 줄로 읽으면 낱말 경계가 흔들리지 않는다.
  const KEY_OF = Object.fromEntries(Object.entries(DUBEOL).map(([key, jamo]) => [jamo, key]));
  function keysFromHangul(text) {
    let out = '';
    for (const ch of keys(text)) for (const part of COMPAT[ch] || ch) out += KEY_OF[part] || part;
    return out;
  }
  const VOWELS = new Set('ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ');
  const PAIR = Object.fromEntries(Object.entries(COMPAT).map(([joined, parts]) => [parts, joined]));
  function hangulFromKeys(text) {
    // Caps Lock이 켜져 있으면 대문자가 그냥 누른 키이고, Shift를 누른 키가 소문자로 찍힌다.
    const raw = String(text || '');
    const upper = raw.replace(/[^A-Z]/g, '').length, lower = raw.replace(/[^a-z]/g, '').length;
    const source = upper > 1 && upper > lower
      ? raw.replace(/[A-Za-z]/g, (ch) => (ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase()))
      : raw;
    const jamo = [...keys([...source].map((ch) => DUBEOL[ch] || DUBEOL[ch.toLowerCase()] || ch).join(''))];
    let out = '', cho = '', jung = '', jong = '';
    const flush = () => {
      if (cho && jung) {
        out += String.fromCharCode(0xac00 + INITIAL.indexOf(cho) * 588 + MEDIAL.indexOf(jung) * 28 + FINAL.indexOf(jong));
      } else out += (cho || '') + (jung ? PAIR[jung] || jung : '');
      cho = jung = jong = '';
    };
    for (const j of jamo) {
      if (VOWELS.has(j)) {
        if (jong) {
          // 받침이 다음 글자의 첫소리로 옮겨 간다(겹받침은 뒤쪽만).
          const parts = [...jong], moved = parts.pop();
          jong = parts.join('');
          flush(); cho = moved; jung = j;
        } else if (jung && MEDIAL.includes(jung + j) && cho) jung += j;
        else if (cho && !jung) jung = j;
        else { flush(); jung = j; }
      } else if (INITIAL.includes(j)) {
        if (cho && jung && !jong && FINAL.includes(j)) jong = j;
        else if (jong && FINAL.includes(jong + j)) jong += j;
        else { flush(); cho = j; }
      } else { flush(); out += j; }
    }
    flush();
    return out;
  }
  const strokes = (text) => [...keys(text)].length;
  // 한 낱말이 다른 낱말의 앞부분(가/가방, 삭/사과, to/today)이면 판에 함께 두지 않는다.
  // 다 치는 순간 바로 받아 주므로, 긴 낱말을 치던 중에 짧은 낱말로 먼저 들어가 버리지 않게.
  function clash(a, b) {
    const x = keys(a), y = keys(b);
    return x.startsWith(y) || y.startsWith(x);
  }
  // 받침이 다음 글자로 옮겨 가는 중간 모양(사→삭→사과)도 맞게 치는 중으로 본다.
  function onTrack(typed, target) {
    const a = keys(typed), b = keys(target);
    return a.length <= b.length && b.startsWith(a);
  }
  const multiplier = (combo) => 1 + Math.min(Math.max(combo, 0), COMBO_CAP) / COMBO_CAP;
  const itemScore = (text, combo) => Math.round(strokes(text) * multiplier(combo));
  // 낱말판: 한 화면에 낱말 여러 개가 함께 떠 있고, 먼저 친 사람일수록 점수를 더 받는다.
  // 낱말 점수에 1등 +5, 2등 +3, 3등 +1을 더한다(곱하지 않아 아이들이 셈을 그대로 볼 수 있다). 그 뒤는 낱말 점수만.
  // 낱말은 모두가 치거나 첫 사람이 친 뒤 HOLD_MS가 지나면 새 낱말로 바뀐다.
  const ORDER_BONUS = [5, 3, 1];
  const orderBonus = (order) => ORDER_BONUS[order - 1] || 0;
  const claimScore = (text, combo, order) => itemScore(text, combo) + orderBonus(order);
  const boardSize = (mode) => (MODES[mode]?.sentence ? 2 : 6);
  const HOLD_MS = 5000;
  const accuracy = (good, mistakes) => (good + mistakes ? Math.round((good / (good + mistakes)) * 100) : 100);
  function rank(rows) {
    return [...rows].sort(
      (a, b) =>
        (b.score || 0) - (a.score || 0) ||
        (b.accuracy ?? 100) - (a.accuracy ?? 100) ||
        (a.scoredAt ?? Infinity) - (b.scoredAt ?? Infinity) ||
        String(a.name).localeCompare(String(b.name), 'ko'),
    );
  }
  return { MODES, DURATIONS, RACERS, COMBO_CAP, TEAM_MAX, TEAM_COUNTS, TEAMS, teamBoard, keys, hangulFromKeys, keysFromHangul, strokes, clash, onTrack, multiplier, itemScore, ORDER_BONUS, orderBonus, claimScore, boardSize, HOLD_MS, accuracy, rank };
});
