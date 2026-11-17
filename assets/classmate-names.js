// 우리 반 이름 — 학습 글의 「한 아이」 「다른 아이」 「한 친구」 「짝」 자리에 우리 반 친구 이름을 넣는다.
// 교과서 단어(장면 글·예문·빈칸)와 순위전 문제가 함께 쓴다.
// - 서버(/api/me/classmates)는 성을 뗀 이름만 섞어서 준다. 학생은 자기 반, 담임 교사는 맡은 반.
// - 화면을 열 때마다 새로 뽑으니 한 아이에게 굳지 않는다. 한 장면(scene) 안에서 같은 사람은 같은 이름.
// - 반이 없거나 혼자면 모든 자리에 자기 이름을 넣는다. 둘러보기(로그인 안 함)는 글 그대로.
// - 꾸밈을 받는 말(「읽는 아이」 「새 친구」)과 여럿(「아이들」), 꾸밈 없는 「친구」(친구 일반일 때가 많다)는 그대로 둔다.
(function () {
  'use strict';
  if (window.ClassmateNames) return;
  const ready = Promise.race([
    fetch('/api/me/classmates', { credentials: 'same-origin' }).then((res) => (res.ok ? res.json() : null)).catch(() => null),
    new Promise((resolve) => setTimeout(() => resolve(null), 2500))
  ]);
  const codaOf = (text) => { const code = text.charCodeAt(text.length - 1) - 0xac00; return code >= 0 && code < 11172 ? code % 28 : 0; };
  const MODIFIERS = new Set(['새', '옆', '단짝', '반', '우리', '이웃', '동네', '학교', '같은', '여러', '모든', '어느', '그', '이', '저', '두', '세', '네', '몇', '한', '다른', '어떤', '친한', '좋은']);
  const PERSON = /(^|[^가-힣])(한 아이|다른 아이|한 친구|다른 친구|아이|짝)(?=$|[\s.,!?'"」』)…]|가|이|은|는|을|를|의|에게|에|와|과|도|만|처럼|보다|랑|이랑|한테|네)/g;
  const ROLE = { '한 아이': 'a', 아이: 'a', '다른 아이': 'b', '한 친구': 'b', 짝: 'b', '다른 친구': 'c' };
  const KEEP = '\u0000';
  // 장면 하나에 쓸 바꾸개를 돌려준다. 같은 바꾸개로 바꾼 글끼리는 같은 사람이 같은 이름이다.
  function scene(list) {
    const pool = list && Array.isArray(list.names) && list.names.length >= 2 ? list.names : [];
    const self = list && typeof list.self === 'string' ? list.self : '';
    if (!pool.length && !self) return (text) => text;
    const people = {};
    const nameFor = (role) => {
      if (role in people) return people[role];
      const used = new Set(Object.values(people));
      const free = pool.filter((name) => !used.has(name));
      // 반이 없거나 혼자면(교사 혼자 볼 때 등) 모든 자리가 자기 이름이다 — 「은솔이가 은솔이에게」도 괜찮다(사용자 결정).
      people[role] = !pool.length ? self : free.length ? free[Math.floor(Math.random() * free.length)] : null;
      return people[role];
    };
    return (text) => typeof text !== 'string' ? text : text.replace(PERSON, (match, lead, token, at, whole) => {
      if (!token.includes(' ')) {
        const before = whole.slice(0, at + lead.length).trimEnd().split(/\s/).pop() || '';
        if (MODIFIERS.has(before) || /[는던은을의]$/.test(before) || (lead === ' ' && before && [4, 8].includes(codaOf(before)))) return match;
      }
      const name = nameFor(ROLE[token]);
      if (!name) return match;
      // 받침 있는 이름은 「지훈이」로 불러 뒤 조사를 받침 없는 꼴(가·는·를)에 맞춘다. 「짝이」의 조사는 받침 없는 꼴로 바꾼다.
      return lead + (codaOf(name) ? name + '이' : name) + (token === '짝' ? KEEP : '');
    }).replace(/\u0000(이랑|으로|이|은|을|과)?/g, (m, josa) => ({ 이랑: '랑', 으로: '로', 이: '가', 은: '는', 을: '를', 과: '와' }[josa] || ''));
  }
  window.ClassmateNames = Object.freeze({ ready, scene });
})();
