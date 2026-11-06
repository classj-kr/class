// 국어 순위전 문항: 각 학습 화면의 자료를 그대로 받아 객관식 문항으로 바꾼다.
// 자료를 읽는 일은 서버(korean-race-bank.js)가 맡고, 여기는 받은 자료만 다룬다.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KoreanRaceQuestions = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  function shuffle(list, random) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  const firstChar = (text) => [...String(text || '').replace(/[^\p{L}\p{N}]/gu, '')][0] || '★';
  // 보기를 섞고 정답 자리를 기억한다.
  function choiceSet(answer, wrong, random) {
    const choices = shuffle([answer, ...wrong], random);
    return { choices, answer: choices.indexOf(answer) };
  }
  function pickOthers(deck, count, usable, random) {
    const out = [];
    for (const item of shuffle(deck, random)) {
      if (out.length >= count) break;
      if (usable(item, out)) out.push(item);
    }
    return out;
  }

  function spelling(list) {
    return (list || [])
      .filter((q) => q && Array.isArray(q.choices) && q.choices.length >= 2 && q.choices.includes(q.answer))
      .map((q) => ({
        key: 'spelling:' + q.id,
        level: 'all',
        make: (random) => ({
          set: 'spelling',
          ask: q.prompt || '빈칸에 들어갈 알맞은 말을 고르세요.',
          text: q.sentence || '',
          ...choiceSet(q.answer, q.choices.filter((c) => c !== q.answer), random),
          explain: q.explanation || '',
          block: firstChar(q.answer),
        }),
      }));
  }

  // 한자성어 화면의 오답 고르기(같은 주제·비슷한 뜻, 헷갈리는 짝 빼기)를 그대로 쓴다.
  function idioms(data, core) {
    if (!Array.isArray(data) || !core?.createQuestion) return [];
    return data.map((idiom) => ({
      key: 'idioms:' + idiom.id,
      level: idiom.level || 'all',
      item: idiom,
      make: (random, pool) => {
        const q = core.createQuestion(idiom, pool.length >= 4 ? pool : data, 'meaning', random);
        const labels = q.options.map((o) => o.label);
        return {
          set: 'idioms',
          ask: '뜻에 알맞은 한자성어는?',
          text: idiom.meaning,
          choices: labels,
          answer: labels.indexOf(q.answerLabel),
          explain: `${idiom.word}(${idiom.hanja})${idiom.hanjaExpl ? ' — ' + idiom.hanjaExpl : ''}`,
          block: firstChar(idiom.word),
        };
      },
    }));
  }

  function proverbs(deck) {
    const list = (deck || []).filter((item) => item && item.proverb && item.question);
    return list.map((item) => ({
      key: 'proverbs:' + item.proverb,
      level: 'all',
      make: (random) => {
        const avoid = new Set([item.proverb, ...(item.lookalikes || [])]);
        const wrong = pickOthers(list, 2, (other, picked) => !avoid.has(other.proverb) && !picked.includes(other), random).map((o) => o.proverb);
        return {
          set: 'proverbs',
          ask: '이 상황에 어울리는 속담은?',
          text: item.question,
          ...choiceSet(item.proverb, wrong, random),
          explain: item.meaning || '',
          block: firstChar(item.proverb),
        };
      },
    }));
  }

  // 관용어는 사람이 골라 둔 오답 두 개가 있다. 없을 때만 헷갈리는 짝을 빼고 고른다.
  function expressions(bank) {
    const list = (bank || []).filter((item) => item && item.expression && item.question);
    return list.map((item) => ({
      key: 'expressions:' + item.expression,
      level: 'all',
      make: (random) => {
        let wrong = (item.distractors || []).filter((d) => d && d !== item.expression).slice(0, 2);
        if (wrong.length < 2) {
          const avoid = new Set([item.expression, ...(item.lookalikes || []), ...wrong]);
          wrong = wrong.concat(pickOthers(list, 2 - wrong.length, (other, picked) => !avoid.has(other.expression) && !picked.includes(other), random).map((o) => o.expression));
        }
        return {
          set: 'expressions',
          ask: '이 상황에 어울리는 관용어는?',
          text: item.question,
          ...choiceSet(item.expression, wrong, random),
          explain: item.meaning || '',
          block: firstChar(item.expression),
        };
      },
    }));
  }

  // 사전식 뜻풀이에서 앞머리 한두 낱말만 보기로 쓴다. "(음식) 빵. (비유) 생계." → "빵"
  function shortMeaning(word) {
    const raw = (word.meanings || []).find((m) => String(m || '').trim()) || '';
    const clean = String(raw).replace(/\([^)]*\)/g, ' ').replace(/불가산|가산|자동사|타동사/g, ' ').replace(/\s+/g, ' ').trim();
    const sentence = clean.split(/[.;/]/)[0];
    const parts = sentence.split(',').map((s) => s.trim()).filter(Boolean);
    const text = parts.slice(0, 2).join(', ');
    return text.length > 14 ? parts[0] || '' : text;
  }
  function vocabulary(words) {
    const list = (words || [])
      .filter((w) => w && /^[A-Za-z][A-Za-z' -]{0,20}$/.test(w.word || ''))
      .map((w) => ({ word: w, meaning: shortMeaning(w) }))
      .filter((x) => x.meaning && x.meaning.length <= 14);
    const byStage = new Map();
    for (const x of list) {
      const stage = x.word.stageCode || 'elementary';
      if (!byStage.has(stage)) byStage.set(stage, []);
      byStage.get(stage).push(x);
    }
    return list.map((x) => {
      const stage = x.word.stageCode || 'elementary';
      return {
        key: 'vocabulary:' + x.word.word,
        level: stage,
        make: (random) => {
          const deck = byStage.get(stage) || list;
          const pos = (x.word.pos || [])[0];
          const seen = new Set([x.meaning]);
          // 품사가 같은 낱말의 뜻을 먼저 고르면 품사만 보고 찍기 어렵다.
          const usable = (other) => !seen.has(other.meaning) && other.word.word !== x.word.word;
          const take = (other) => { seen.add(other.meaning); return true; };
          const same = pickOthers(deck, 3, (o) => (o.word.pos || [])[0] === pos && usable(o) && take(o), random);
          const rest = same.length < 3 ? pickOthers(deck, 3 - same.length, (o) => usable(o) && take(o), random) : [];
          const wrong = [...same, ...rest].map((o) => o.meaning);
          const meanings = (x.word.meanings || []).filter(Boolean).slice(0, 2).join(' / ');
          return {
            set: 'vocabulary',
            ask: '알맞은 뜻을 고르세요.',
            text: x.word.word,
            ...choiceSet(x.meaning, wrong, random),
            explain: `${x.word.word}: ${meanings}`,
            block: firstChar(x.word.word).toUpperCase(),
          };
        },
      };
    });
  }

  // sources: { spelling, idioms: { data, core }, proverbs, expressions, vocabulary }
  function buildPools(sources = {}) {
    return {
      spelling: spelling(sources.spelling),
      idioms: idioms(sources.idioms?.data, sources.idioms?.core),
      proverbs: proverbs(sources.proverbs),
      expressions: expressions(sources.expressions),
      vocabulary: vocabulary(sources.vocabulary),
    };
  }
  function poolFor(pools, set, level, mixedParts) {
    const parts = set === 'mixed' ? mixedParts : [set];
    const entries = parts.flatMap((part) => pools[part] || []);
    if (!level || level === 'all') return entries;
    return entries.filter((e) => e.level === level);
  }
  // 모두 같은 순서의 문제를 받는다. 다 쓰면 다시 섞어 이어 붙이고, 같은 문제가 붙어 나오지 않게 한다.
  function makeRound(pools, { set, level = 'all', count, mixedParts = [], random = Math.random }) {
    const entries = poolFor(pools, set, level, mixedParts);
    if (entries.length < 4) return [];
    // 한자성어 오답은 고른 수준 안에서 먼저 찾는다(모자라면 화면 코드가 전체에서 채운다).
    const idiomItems = entries.filter((e) => e.item).map((e) => e.item);
    const order = [];
    while (order.length < count) {
      const next = shuffle(entries, random);
      if (order.length && next[0] === order[order.length - 1]) next.push(next.shift());
      order.push(...next);
    }
    return order
      .slice(0, count)
      .map((entry) => ({ ...entry.make(random, idiomItems), key: entry.key }))
      .filter((q) => q.choices.length >= 2 && q.answer >= 0 && new Set(q.choices).size === q.choices.length);
  }
  // 화면에는 정답과 풀이를 보내지 않는다.
  // tried: 이 문제에서 이미 골라 틀린 보기(새로고침해도 줄이 그어진 채로 둔다).
  function publicQuestion(q, index, label, tried = []) {
    return { no: index, set: q.set, label, ask: q.ask, text: q.text, choices: q.choices, tried };
  }
  return { shuffle, shortMeaning, buildPools, poolFor, makeRound, publicQuestion };
});
