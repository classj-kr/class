// 순위전 문항: 각 학습 화면의 자료를 그대로 받아 객관식 문항으로 바꾼다.
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

  // 차시 번호(1부터). 학습 화면의 차시 묶음을 그대로 따른다.
  function lessonIndex(lessons) {
    const map = new Map();
    (lessons || []).forEach((lesson, index) => (lesson.ids || []).forEach((id) => map.set(id, index + 1)));
    return map;
  }
  function spelling(list, lessons) {
    const lessonOf = lessonIndex(lessons);
    return (list || [])
      .filter((q) => q && Array.isArray(q.choices) && q.choices.length >= 2 && q.choices.includes(q.answer))
      .map((q) => ({
        key: 'spelling:' + q.id,
        level: 'all',
        lesson: lessonOf.get(q.id) || null,
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
  function idioms(data, core, lessons) {
    if (!Array.isArray(data) || !core?.createQuestion) return [];
    const lessonOf = lessonIndex(lessons);
    return data.map((idiom) => ({
      key: 'idioms:' + idiom.id,
      level: idiom.level || 'all',
      lesson: lessonOf.get(idiom.id) || null,
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

  function proverbs(deck, lessonFor) {
    const list = (deck || []).filter((item) => item && item.proverb && item.question);
    return list.map((item) => ({
      key: 'proverbs:' + item.proverb,
      level: 'all',
      lesson: typeof lessonFor === 'function' ? lessonFor(item, 'ko') + 1 : null,
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
      lesson: Number.isInteger(item.lesson) ? item.lesson + 1 : null,
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
    // «쓰임»·[다른 말]·(설명)을 걷어 내고 ...은 …로 바꾼다. "...의 안에 (시간, 장소)." → "…의 안에"
    const clean = String(raw).replace(/«[^»]*»|\([^)]*\)/g, ' ').replace(/\[[^\]]*\]/g, '').replace(/\.{2,}/g, '…')
      .replace(/불가산|가산|자동사|타동사/g, ' ').replace(/\s+/g, ' ').trim();
    // 긴 풀이 안에 따옴표로 뜻을 적어 둔 경우: "삼인칭 남성 주격 인칭 대명사 '그'" → "그"
    const quoted = clean.length > 14 && /[‘'](.{1,10}?)[’']/.exec(clean);
    if (quoted) return quoted[1].trim();
    const sentence = clean.split(/[.;/]/).map((s) => s.trim()).find(Boolean) || '';
    const parts = sentence.split(',').map((s) => s.trim()).filter(Boolean);
    const text = parts.slice(0, 2).join(', ');
    return text.length > 14 ? parts[0] || '' : text;
  }
  function vocabulary(words) {
    // 학습 화면과 같은 차례(같은 Level 안에서 order 순, 20단어씩 한 차시)로 자리를 매겨 둔다.
    const place = new Map();
    const byLevel = new Map();
    for (const w of words || []) {
      if (!w) continue;
      if (!byLevel.has(w.globalLevel)) byLevel.set(w.globalLevel, []);
      byLevel.get(w.globalLevel).push(w);
    }
    for (const [unit, group] of byLevel) {
      group.sort((a, b) => Number(a.order) - Number(b.order));
      group.forEach((w, i) => place.set(w, { unit: Number(unit), lesson: Math.floor(i / 20) + 1 }));
    }
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
        ...(place.get(x.word) || {}),
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

  // 한자: 진도표 단계마다 있는 「문제 풀기」 문항을 그대로 쓴다(단계 = 범위의 차례 번호).
  // 보기 문장({{낱말}} 표시)은 순위전에서 읽기 길어서, 밑줄 낱말 앞뒤 몇 마디만 남긴다.
  // 낱말만으로는 다른 한자 낱말로도 읽히는 문항(whole 목록)은 예문이 뜻을 정해 주므로 문장을 다 보여 준다.
  // 보기의 밑줄 자리는 {{낱말}} 그대로 보낸다. 화면은 이것을 글자로 받아 밑줄 친 낱말로 그린다.
  const unmark = (text) => String(text).replace(/\{\{([^{}]*)\}\}/g, '$1');
  function hanjaClip(sentence, word, whole) {
    const mark = `{{${word}}}`, at = String(sentence).indexOf(mark);
    if (!word || at < 0) return null;
    let before = unmark(sentence.slice(0, at)), after = unmark(sentence.slice(at + mark.length));
    if (!whole) {
      // 앞으로 여덟 자, 뒤로 아홉 자 안쪽의 마디만. 낱말에 붙은 마디(조사 등)는 늘 남긴다.
      const head = before.split(' '), keep = [head.pop()];
      while (head.length && keep.join(' ').length + head[head.length - 1].length + 1 <= 8) keep.unshift(head.pop());
      before = (head.length ? '…' : '') + keep.join(' ');
      const tail = after.split(' '), take = [tail.shift()];
      while (tail.length && take.join(' ').length + tail[0].length + 1 <= 9) take.push(tail.shift());
      after = take.join(' ') + (tail.length ? '…' : '');
      after = after.replace(/[,·]+…$/, '…');
    }
    return `${before}{{${word}}}${after}`;
  }
  function hanja(stages, whole) {
    const out = [];
    for (const { stage, items } of stages || []) {
      for (const item of items || []) {
        const options = Array.isArray(item?.options) ? item.options : [];
        const right = options.filter((o) => o && o.correct);
        // 보기가 넷이고 정답이 하나인 문항만(드문 한자는 보기가 셋뿐인 문항이 있다).
        if (options.length !== 4 || right.length !== 1 || !item.target) continue;
        const huneum = options.every((o) => o.word === o.sentence);
        const full = Boolean(whole && whole.has(`${item.target}|${right[0].word}`));
        const labels = options.map((o) => (huneum ? String(o.word || '').trim() : hanjaClip(o.sentence, o.word, full)));
        if (labels.some((label) => !label) || new Set(labels).size !== labels.length) continue;
        const answer = labels[options.indexOf(right[0])];
        const sound = item.reading ? `${item.target}(${item.reading})` : item.target;
        out.push({
          key: `hanja:${item.target}|${right[0].word}`,
          level: 'all',
          lesson: Number(stage) || null,
          make: (random) => ({
            set: 'hanja',
            ask: huneum ? '이 한자의 훈과 음은?' : '밑줄 친 말에 이 한자가 들어가지 않은 것은?',
            text: huneum ? item.target : sound,
            ...choiceSet(answer, labels.filter((label) => label !== answer), random),
            explain: item.note || '',
            block: item.target,
            // 맞힌 말 모음에는 보기 문장 대신 한자를 모은다.
            collect: sound,
          }),
        });
      }
    }
    return out;
  }

  // 문장 고르기: 차시마다 있는 고르기 문제(choice)만 쓴다. 여러 개 고르기·차례 맞추기·쓰기는 순위전 꼴이 아니다.
  // 화면처럼 지시문(prompt)과 상황 글(scene)을 함께 보인다. 상황 글이 없으면 지시문을 문제 글자리에 크게 둔다.
  const CIRCLED = /^[①-⑳]$/;
  function sentences(course) {
    const out = [];
    (course?.lessons || []).forEach((lesson, index) => {
      (lesson?.tasks || []).forEach((task, taskIndex) => {
        if (task?.type !== 'choice' || !Array.isArray(task.options) || !Number.isInteger(task.answer) || !task.prompt) return;
        const options = Array.from(task.options, (option) => String(option).trim());
        const answer = options[task.answer];
        if (!answer || options.some((option) => !option) || new Set(options).size !== options.length) return;
        const scene = String(task.scene || '').trim();
        // ①②③… 번호가 붙은 문단은 번호마다 줄을 바꿔 읽기 쉽게 한다.
        const text = /②/.test(scene) ? scene.replace(/\s*([②-⑳])/g, '\n$1') : scene;
        // ①~⑤ 문장 번호를 고르는 문제: 보기 차례를 그대로 두고, 맞힌 말에는 그 번호의 문장을 모은다.
        const numbered = options.every((option) => CIRCLED.test(option));
        const keep = numbered || task.shuffleOptions === false;
        const at = numbered ? scene.indexOf(answer) : -1;
        const picked = at >= 0 ? scene.slice(at + answer.length).split(/[①-⑳]/)[0].trim() : answer;
        out.push({
          key: `sentences:${lesson.id || index + 1}:${taskIndex}`,
          level: 'all',
          lesson: index + 1,
          make: (random) => ({
            set: 'sentences',
            ask: scene ? task.prompt : '',
            text: scene ? text : task.prompt,
            ...(keep ? { choices: options, answer: task.answer } : choiceSet(answer, options.filter((option) => option !== answer), random)),
            explain: task.explain || '',
            block: firstChar(picked || answer),
            collect: picked || answer,
          }),
        });
      });
    });
    return out;
  }

  // sources: { spelling, idioms: { data, core }, proverbs, expressions, vocabulary, hanja: [{ stage, items }], hanjaWhole: Set, sentences: SENTENCE_COURSE }
  // 교과서 단어: 학습 화면의 연습 문제와 같은 규칙으로 빈칸·뜻 문제를 만든다.
  // 아래 낱말·유의어(끝까지)는 둘째 정답이 되므로 보기에서 빼고, 단원 낱말로 채울 때는 위 낱말도 뺀다.
  // 뜻 문제는 두 글자 조각을 나눠 가진 목록 낱말이 있을 때만 내고 그 낱말을 오답에 먼저 넣는다(태양 고도 측정기 ↔ 태양 고도).
  const TEXTBOOK_SUBJECTS = { 국어: 'kor', 수학: 'math', 사회: 'soc', 과학: 'sci' };
  function textbook(books) {
    const out = [];
    const pieces = (name) => {
      const text = String(name).replace(/(스럽다|롭다|하다|다)$/, '').replace(/\s/g, '') || name;
      const set = new Set();
      for (let i = 0; i < text.length - 1; i++) set.add(text.slice(i, i + 2));
      return set;
    };
    const looksLike = (a, b) => { const y = pieces(b); return [...pieces(a)].some((piece) => y.has(piece)); };
    for (const [term, subjects] of Object.entries(books || {})) {
      for (const [subjectName, book] of Object.entries(subjects || {})) {
        const subject = TEXTBOOK_SUBJECTS[subjectName];
        if (!subject || !Array.isArray(book?.units)) continue;
        const all = book.units.flatMap((unit) => unit.words || []);
        const byName = new Map(all.map((word) => [word.w, word]));
        const chain = (word, key, into) => (word?.rel?.[key] || []).forEach((row) => {
          if (into.has(row.w)) return;
          into.add(row.w);
          chain(byName.get(row.w), key, into);
        });
        for (const unit of book.units) {
          for (const word of unit.words || []) {
            const banned = new Set((word.rel?.syn || []).map((row) => row.w));
            chain(word, 'down', banned);
            const above = new Set();
            chain(word, 'up', above);
            const free = (name) => name !== word.w && !banned.has(name) && !above.has(name);
            const lookalikes = all.filter((other) => free(other.w) && looksLike(other.w, word.w)).map((other) => other.w);
            const where = { term, subject, unit: String(unit.id) };
            const explain = `${word.w}: ${word.mean}`;
            const wrongFor = (first, random) => {
              const picked = [];
              const add = (name) => { if (picked.length < 3 && name && name !== word.w && !banned.has(name) && !picked.includes(name)) picked.push(name); };
              shuffle(first, random).forEach(add);
              shuffle(word.foils || [], random).forEach(add);
              // 모자라면 같은 단원, 그다음 같은 과목 낱말로 채운다(위 낱말은 빈칸에 대개 맞으므로 뺀다).
              shuffle((unit.words || []).map((other) => other.w).filter(free), random).forEach(add);
              shuffle(all.map((other) => other.w).filter(free), random).forEach(add);
              return picked;
            };
            (word.blanks || []).forEach((blank, index) => {
              if (!String(blank).includes('{}')) return;
              out.push({
                key: `textbook:${term}:${subject}:${unit.id}:${word.w}:b${index}`,
                level: 'all', unit: where,
                make: (random) => ({
                  set: 'textbook', ask: '빈칸에 알맞은 낱말은?', text: String(blank).replace('{}', '(　　)'),
                  ...choiceSet(word.w, wrongFor([], random), random), explain, block: firstChar(word.w),
                }),
              });
            });
            if (lookalikes.length && word.mean) {
              out.push({
                key: `textbook:${term}:${subject}:${unit.id}:${word.w}:m`,
                level: 'all', unit: where,
                make: (random) => ({
                  set: 'textbook', ask: '이 뜻을 가진 낱말은?', text: word.mean,
                  ...choiceSet(word.w, wrongFor(lookalikes, random), random), explain, block: firstChar(word.w),
                }),
              });
            }
          }
        }
      }
    }
    return out;
  }
  function buildPools(sources = {}) {
    return {
      spelling: spelling(sources.spelling, sources.spellingLessons),
      idioms: idioms(sources.idioms?.data, sources.idioms?.core, sources.idioms?.lessons),
      proverbs: proverbs(sources.proverbs, sources.proverbLessonFor),
      expressions: expressions(sources.expressions),
      vocabulary: vocabulary(sources.vocabulary),
      hanja: hanja(sources.hanja, sources.hanjaWhole),
      sentences: sentences(sources.sentences),
      textbook: textbook(sources.textbook),
    };
  }
  function poolFor(pools, set, level, range) {
    const entries = pools[set] || [];
    if (set === 'textbook') {
      if (!range) return entries;
      const pieces = String(range).split(',').map((piece) => piece.split('.'));
      return entries.filter((e) => pieces.some(([term, subject, unit]) => e.unit.term === term && e.unit.subject === subject && (!unit || e.unit.unit === unit)));
    }
    if (range) {
      const text = String(range), upto = text.startsWith('~');
      const nums = text.replace('~', '').split('-').map(Number);
      if (set !== 'vocabulary')
        return entries.filter((e) => e.lesson && (upto ? e.lesson <= nums[0] : e.lesson === nums[0]));
      const [unit, lesson] = nums;
      return entries.filter((e) => (upto
        ? e.unit < unit || (e.unit === unit && (!lesson || e.lesson <= lesson))
        : e.unit === unit && (!lesson || e.lesson === lesson)));
    }
    if (!level || level === 'all') return entries;
    return entries.filter((e) => e.level === level);
  }
  // 모두 같은 순서의 문제를 받는다. 다 쓰면 다시 섞어 이어 붙이고, 같은 문제가 붙어 나오지 않게 한다.
  function makeRound(pools, { set, level = 'all', range = null, count, random = Math.random }) {
    const entries = poolFor(pools, set, level, range);
    if (entries.length < 4) return [];
    // 한자성어 오답은 고른 수준 안에서 먼저 찾는다(모자라면 화면 코드가 전체에서 채운다).
    // 차시 범위로 좁힌 때에는 보기가 늘 같은 네 개가 되지 않게 전체에서 고른다.
    const idiomItems = range ? [] : entries.filter((e) => e.item).map((e) => e.item);
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
  return { shuffle, shortMeaning, hanjaClip, buildPools, poolFor, makeRound, publicQuestion };
});
