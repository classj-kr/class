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
  // 짝 찾기: 속담을 가운데에 가장 가까운 띄어쓰기에서 앞부분·뒷부분으로 나눈다(짝 찾기 앱과 같은 규칙).
  function splitHalves(text) {
    const words = String(text || '').trim().split(/\s+/);
    if (words.length < 2) return null;
    let best = 1, gap = Infinity;
    for (let k = 1; k < words.length; k++) {
      const g = Math.abs(words.slice(0, k).join(' ').length - words.slice(k).join(' ').length);
      if (g < gap) { best = k; gap = g; }
    }
    return [words.slice(0, best).join(' '), words.slice(best).join(' ')];
  }
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
      pair: /^[가-힣]{4}$/.test(idiom.word || '') ? [idiom.word.slice(0, 2), idiom.word.slice(2)] : null,
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
      pair: splitHalves(item.proverb),
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
  // 뜻풀이를 쉼표·마침표로 나눈 토막들(괄호 풀이는 걷어 낸다).
  function meaningPieces(text) {
    return String(text || '').replace(/«[^»]*»|\([^)]*\)|\[[^\]]*\]/g, ' ').split(/[,;/.]/)
      .map((piece) => piece.replace(/\s+/g, ' ').replace(/^[\s~]+|[\s~]+$/g, '')).filter(Boolean);
  }
  // details: { 낱말 id: { meanings, synonyms } } — 영어 단어 앱의 다듬은 뜻과 함께 쓰는 유의어.
  function vocabulary(words, details = {}) {
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
    // 짝 찾기: 유의어(big·large)이거나 이 뜻 패가 다른 낱말의 뜻이기도 하면 엇갈려도 맞으니 한 판에 함께 내지 않는다.
    const synonyms = new Map(), owners = new Map();
    const add = (map, key, value) => { if (!map.has(key)) map.set(key, new Set()); map.get(key).add(value); };
    for (const w of words || []) {
      if (!w?.word) continue;
      const key = w.word.toLowerCase(), extra = details[w.id] || {};
      const related = (w.relatedWords || []).filter((r) => r.type === '유의어').map((r) => r.word).concat(extra.synonyms || []);
      for (const name of related) { add(synonyms, key, name.toLowerCase()); add(synonyms, name.toLowerCase(), key); }
      for (const meaning of [...(w.meanings || []), ...(extra.meanings || [])]) for (const piece of meaningPieces(meaning)) add(owners, piece, key);
    }
    // 뜻 패의 줄기(구성되다·구성하다 → 구성). 한쪽 줄기가 다른 쪽으로 시작하면(막대·막대기) 뜻이 가깝다.
    const stemsOf = (x) => meaningPieces(x.meaning).map((piece) => piece.replace(/(하다|되다|시키다|하는|적인|한|된|의|다)$/, '').trim()).filter((stem) => stem.length >= 2);
    const stemOwners = new Map();
    for (const x of list) for (const stem of stemsOf(x)) add(stemOwners, stem, x.word.word.toLowerCase());
    const avoidOf = (x) => {
      const key = x.word.word.toLowerCase();
      const out = new Set(synonyms.get(key) || []);
      for (const piece of meaningPieces(x.meaning)) for (const owner of owners.get(piece) || []) out.add(owner);
      // 이 줄기의 앞부분이 곧 다른 패의 줄기인 경우만 적어도 된다. 뽑을 때 양쪽을 다 본다.
      for (const stem of stemsOf(x)) for (let n = 2; n <= stem.length; n++) for (const owner of stemOwners.get(stem.slice(0, n)) || []) out.add(owner);
      out.delete(key);
      return [...out];
    };
    return list.map((x) => {
      const stage = x.word.stageCode || 'elementary';
      return {
        key: 'vocabulary:' + x.word.word,
        level: stage,
        pair: [x.word.word, x.meaning],
        avoid: avoidOf(x),
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
  function hanja(stages, whole, hunMap = {}) {
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
          pair: hunMap[item.target] ? [item.target, hunMap[item.target]] : null,
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
  const TEXTBOOK_SUBJECTS = { 국어: 'kor', 수학: 'math', 사회: 'soc', 과학: 'sci', 역사: 'his' };
  const textbookPair = (word) => (word.w && word.en && word.w.length <= 8 && word.en.length <= 16 ? [word.w, word.en] : null);
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
            // 짝 찾기: 유의어·위아래 낱말은 엇갈려도 맞는 말이 되니 한 판에 함께 내지 않는다.
            const avoid = [...banned, ...above];
            let lookalikes = all.filter((other) => free(other.w) && looksLike(other.w, word.w)).map((other) => other.w);
            // 뜻풀이가 낱말 이름의 날짜·조각을 그대로 드러내면(「1919년 3월 1일」 → 3·1 운동) 그 조각을 함께 가진 낱말을
            // 보기 맨 앞에 넣고, 하나도 없으면 뜻 문제를 내지 않는다(앱 app.js 의 leakOf 와 같은 규칙).
            const nums = (text) => String(text).match(/\d+/g) || [];
            const mean = String(word.mean || ''); // 띄어쓰기를 지우면 「분자가 분모」가 「가분」으로 붙어 잘못 잡힌다
            const leakNums = nums(word.w).length && nums(word.w).every((n) => nums(word.mean).includes(n)) ? nums(word.w) : [];
            const leakPieces = [...pieces(word.w)].filter((piece) => !/\d/.test(piece) && mean.includes(piece));
            if (leakNums.length || leakPieces.length) {
              const safe = lookalikes.filter((name) => leakNums.every((n) => nums(name).includes(n)) && leakPieces.every((piece) => pieces(name).has(piece)));
              lookalikes = safe.length ? safe : [];
            }

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
                level: 'all', unit: where, pair: textbookPair(word), avoid,
                make: (random) => ({
                  set: 'textbook', ask: '빈칸에 알맞은 낱말은?', text: String(blank).replace('{}', '(　　)'),
                  ...choiceSet(word.w, wrongFor([], random), random), explain, block: firstChar(word.w),
                }),
              });
            });
            if (lookalikes.length && word.mean) {
              out.push({
                key: `textbook:${term}:${subject}:${unit.id}:${word.w}:m`,
                level: 'all', unit: where, pair: textbookPair(word), avoid,
                make: (random) => ({
                  set: 'textbook', ask: '이 뜻을 가진 낱말은?', text: word.mean,
                  // wrongFor 는 lookalikes 를 먼저 넣는다. 흘림이 있으면 lookalikes 는 그 조각을 함께 가진 낱말뿐이다.
                  ...choiceSet(word.w, wrongFor(lookalikes, random), random), explain, block: firstChar(word.w),
                }),
              });
            }
          }
        }
      }
    }
    // 같은 낱말이 여러 학기·과목에 나오면 관계도 합친다(어느 항목이 뽑혀도 같은 규칙이 되게).
    const merged = new Map();
    for (const entry of out) {
      if (!merged.has(entry.pair?.[0])) merged.set(entry.pair?.[0], new Set());
      entry.avoid.forEach((name) => merged.get(entry.pair?.[0]).add(name));
    }
    for (const entry of out) entry.avoid = [...merged.get(entry.pair?.[0])];
    return out;
  }
  // 국어 교과서 문법: 학기 → 단원 → 규칙 → 문제(TEXTBOOK_GRAMMAR). 문제 꼴은 항목에 있는 열쇠로 갈린다.
  // 순위전은 누르는 보기 고르기라 꼴마다 이렇게 바꾼다. 보기는 늘 같은 문제 안에서만 가져온다.
  //   고르기 { q, a, x }        → 그대로(___ 는 (　　))
  //   틀린 곳 찾기 { words, wrong, fix } → 문장을 보이고 틀린 조각 + 다른 조각 셋까지
  //   빈칸에 옮기기 { q, fill, x } → 빈칸마다 한 문제(다른 빈칸은 정답으로 채움), 보기 = 그 빈칸 정답 + 다른 빈칸 정답 + 남는 조각
  //   선 잇기 { pairs }          → 짝마다 한 문제, 보기 = 같은 문제의 오른쪽들
  //   띄어쓰기 { s }             → 바른 문장 + 띄어 쓴 자리 하나를 붙여 쓴 문장 셋까지
  //   차례 맞추기 { order }·나누기 { groups } → 순위전 꼴이 아니라 뺀다
  // 문항 열쇠는 문제 내용(풀이 why 를 뺀 것)에서 만든다. 학습 앱(app.js itemKey)과 같은 셈이다.
  const BLANK = '(　　)';
  function grammarHash(item) {
    const text = JSON.stringify({ ...item, why: undefined });
    let h = 5381;
    for (let i = 0; i < text.length; i += 1) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  // 받침 있는 말 뒤의 조사(은/는, 을/를, 과/와). 괄호·따옴표·문장 부호는 건너뛰고 마지막 글자를 본다.
  function hasBatchim(text) {
    const chars = [...String(text || '')].reverse();
    for (const ch of chars) {
      const code = ch.codePointAt(0);
      if (code >= 0xac00 && code <= 0xd7a3) return (code - 0xac00) % 28 !== 0;
      if (code >= 0x3131 && code <= 0x314e) return true; // 자음자 이름(기역, 니은…)은 받침으로 끝난다
      if (code >= 0x314f && code <= 0x3163) return false; // 모음자
      if (/[0-9]/.test(ch)) return '013678'.includes(ch);
      if (/[A-Za-z]/.test(ch)) return false;
    }
    return false;
  }
  const josa = (text, withBatchim, without) => text + (hasBatchim(text) ? withBatchim : without);
  const plain = (text) => String(text || '').trim();
  // 틀린 곳 찾기 조각을 보기로 쓸 때는 끝의 문장 부호를 뗀다("있어요." → "있어요").
  const pieceLabel = (text) => plain(text).replace(/^[‘“'"(]+|[.,!?’”'")]+$/g, '').trim();
  // 틀린 곳 찾기의 묻는 말: "잘못 쓴 낱말을 누르세요." → "잘못 쓴 낱말은?"
  function spotAsk(p) {
    const text = plain(p);
    if (!text) return '틀리게 쓴 낱말은?';
    const m = /^(.+?)(을|를)\s*(?:찾아\s*)?(?:누르세요|고르세요)\.?$/.exec(text);
    return m ? josa(m[1], '은?', '는?') : text;
  }
  // 빈칸에 옮기기의 묻는 말: 조각 옮기기 안내 말은 고르기 말로 바꾼다.
  function fillAsk(p) {
    const text = plain(p);
    if (!text || /^조각을/.test(text)) return '빈칸에 알맞은 말을 고르세요.';
    const turned = text.replace(/(?:빈칸으로\s*)?옮기세요\.?$/, '고르세요.');
    return turned === text ? '빈칸에 알맞은 말을 고르세요.' : turned;
  }
  // 선 잇기 한 짝의 묻는 말: p 「낱말과 바른 소리를 이으세요.」, 왼쪽 「읽어」 → 「‘읽어’의 바른 소리는?」
  function pairAsk(p, left) {
    const text = plain(p).replace(/\.$/, '');
    const q = `‘${left}’`;
    const ask = (b) => josa(b, '은?', '는?');
    const tail = (b) => {
      // 「그 안에 드는 말」, 「그때 먹는 음식」처럼 왼쪽을 다시 가리키는 말은 조사로 잇는다.
      if (/^그때\s/.test(b)) return `${q}에 ${ask(b.replace(/^그때\s+/, ''))}`;
      if (/^그\s/.test(b)) return `${q} ${ask(b.replace(/^그\s+/, ''))}`;
      if (/^낱말에\s/.test(b)) return `${q}에 ${ask(b.replace(/^낱말에\s+/, ''))}`;
      if (/^(어울리는|맞장구치는|맞는|쓰인)\s/.test(b)) return `${q}에 ${ask(b)}`;
      // 「둘 다 표준어인 짝」은 짝 하나만 떼어 물으면 다른 짝도 맞는 말이 되므로 짝을 이루는 말을 묻는다.
      if (/짝$/.test(b)) return `${josa(q, '과', '와')} 짝을 이루는 말은?`;
      return `${q}의 ${ask(b)}`;
    };
    const how = '(?:바르게\\s*|알맞게\\s*)?(?:찾아\\s*)?';
    let m = new RegExp(`^(.+?)(?:과|와)\\s+(.+?)(?:을|를)\\s*${how}이으세요$`).exec(text);
    if (m) return tail(m[2]);
    m = new RegExp(`^(.+?)끼리\\s*${how}이으세요$`).exec(text);
    if (m && /^뜻에\s/.test(m[1])) return `${q}에 ${ask(m[1].replace(/^뜻에\s+/, ''))}`;
    if (m) return `${josa(q, '과', '와')} ${ask(m[1].replace(/^서로\s+/, ''))}`;
    if (/^앞과 뒤를 이어/.test(text)) return `${q} 뒤에 이어 낱말이 되는 것은?`;
    m = new RegExp(`^(.+?)(?:과|와)\\s*${how}이으세요$`).exec(text);
    if (m) return tail(m[1]);
    m = new RegExp(`^(.+?)(?:을|를)\\s*${how}이으세요$`).exec(text);
    if (m) return tail(m[1]);
    m = /^(.+?)(?:으로|로)\s*고쳐\s*이으세요$/.exec(text);
    if (m) return `${josa(q, '을', '를')} ${m[1]}로 고친 것은?`;
    return `${josa(q, '과', '와')} 짝인 것은?`;
  }
  // 띄어쓰기: 붙여 써도 되는 자리(보조 용언, 「-ㄹ 듯하다」 꼴, 숫자 뒤 단위)와 문장 부호 둘레는 붙여 쓴 오답으로 쓰지 않는다.
  const AUX_START = /^(보|봐|봤|봅|주|줘|줬|줍|버리|버려|버렸|놓|놔|놨|두|둬|뒀|둡|가|갔|갑|와|왔|오|옵|있|계|지|져|졌|집|대|댔|내|냈|드리|드려|드렸|싶|쌓|치우|치워|빠지|빠져)/;
  const OPEN_VOWEL_END = /[가-힣]$/;
  function mergeIsWrong(before, after) {
    if (/[.,!?…·:;’”'")\]]$/.test(before) || /^[‘“'"(\[]/.test(after)) return false;
    if (/[0-9]$/.test(before)) return false;
    if (/^(듯하|듯싶|만하|법하|성싶|척하|체하|양하|뻔하)/.test(after)) return false;
    const last = before.slice(-1).codePointAt(0);
    if (OPEN_VOWEL_END.test(before) && (last - 0xac00) % 28 === 0) {
      // 받침 없이 아/어/여 소리로 끝나는 말 뒤(먹어 보다, 해 주다)는 붙여 써도 된다.
      const vowel = Math.floor(((last - 0xac00) % 588) / 28);
      const AEO = [0, 1, 4, 5, 6, 9, 10, 14, 15]; // ㅏ ㅐ ㅓ ㅔ ㅕ ㅘ ㅙ ㅝ ㅞ
      if (AEO.includes(vowel) && AUX_START.test(after)) return false;
    }
    return true;
  }
  function grammar(terms) {
    const out = [];
    const seen = new Set();
    const add = (entry) => { if (!seen.has(entry.key)) { seen.add(entry.key); out.push(entry); } };
    // 보기: 정답 + 오답(겹치거나 정답과 같은 글은 뺀다). 오답이 하나도 없으면 문제를 내지 않는다.
    const distinct = (answer, wrong) => {
      const pickedSet = new Set([answer]), out2 = [];
      for (const text of wrong) {
        const label = plain(text);
        if (!label || pickedSet.has(label)) continue;
        pickedSet.add(label);
        out2.push(label);
      }
      return out2;
    };
    for (const term of terms || []) {
      if (!term || !/^[1-9]-[12]$/.test(term.term || '')) continue;
      for (const unit of term.units || []) {
        const no = Number(unit?.no);
        if (!Number.isInteger(no)) continue;
        const where = { term: term.term, no };
        for (const topic of unit.topics || []) {
          for (const item of topic.items || []) {
            if (!item || typeof item !== 'object' || item.order || item.groups) continue;
            const why = plain(item.why);
            const base = `grammar:${term.term}:${no}`;
            const entry = (key, build) => add({ key, level: 'all', unit: where, make: build });
            if (Array.isArray(item.pairs)) {
              const rights = item.pairs.map((pair) => plain(pair?.[1]));
              item.pairs.forEach((pair, index) => {
                const raw = plain(pair?.[0]), left = raw.replace(/___/g, BLANK), right = rights[index];
                if (!left || !right) return;
                const wrong = distinct(right, rights.filter((_, i) => i !== index));
                if (!wrong.length) return;
                entry(`${base}:match:${grammarHash(item)}:${raw}`, (random) => ({
                  set: 'grammar', ask: '', text: pairAsk(item.p, left),
                  ...choiceSet(right, wrong.slice(0, 4), random),
                  explain: why ? `${left} — ${right}. ${why}` : `${left} — ${right}`, block: firstChar(right),
                }));
              });
            } else if (Array.isArray(item.words)) {
              const labels = item.words.map(pieceLabel);
              const answer = labels[item.wrong];
              if (!Number.isInteger(item.wrong) || !answer) continue;
              const others = distinct(answer, labels.filter((_, i) => i !== item.wrong));
              if (!others.length) continue;
              const fix = plain(item.fix);
              entry(`${base}:spot:${grammarHash(item)}`, (random) => ({
                set: 'grammar', ask: spotAsk(item.p), text: item.words.map(plain).join(' '),
                ...choiceSet(answer, shuffle(others, random).slice(0, 3), random),
                explain: [fix ? `${answer} → ${pieceLabel(fix) || fix}` : '', why].filter(Boolean).join('. '),
                // 맞힌 말 모음에는 틀린 말 대신 바른 말을 모은다.
                block: firstChar(fix || answer), collect: pieceLabel(fix) || answer,
              }));
            } else if (Array.isArray(item.fill)) {
              const parts = String(item.q || '').split('___');
              const fills = item.fill.map(plain);
              if (parts.length - 1 !== fills.length || fills.some((f) => !f)) continue;
              fills.forEach((answer, index) => {
                const text = parts.map((part, i) => part + (i < fills.length ? (i === index ? BLANK : fills[i]) : '')).join('');
                // 다른 빈칸의 정답이 먼저(헷갈리는 짝인 때가 많다), 그다음 남는 조각.
                const wrong = distinct(answer, [...fills.filter((_, i) => i !== index), ...(item.x || [])]);
                if (!wrong.length) return;
                entry(`${base}:fill:${grammarHash(item)}:b${index}`, (random) => ({
                  set: 'grammar', ask: fillAsk(item.p), text,
                  ...choiceSet(answer, wrong.slice(0, 4), random), explain: why, block: firstChar(answer),
                }));
              });
            } else if (typeof item.s === 'string') {
              const right = plain(item.s).replace(/\s+/g, ' ');
              const words = right.split(' ');
              const wrong = distinct(right, words.slice(0, -1).flatMap((word, i) => (mergeIsWrong(word, words[i + 1])
                ? [[...words.slice(0, i), word + words[i + 1], ...words.slice(i + 2)].join(' ')] : [])));
              if (!wrong.length) continue;
              const p = plain(item.p);
              const ask = /뜻이 되게 띄우세요\.?$/.test(p) ? p.replace(/띄우세요\.?$/, '띄어 쓴 것은?') : '바르게 띄어 쓴 것은?';
              entry(`${base}:space:${grammarHash(item)}`, (random) => ({
                set: 'grammar', ask: '', text: ask,
                ...choiceSet(right, shuffle(wrong, random).slice(0, 3), random), explain: why, block: firstChar(right),
              }));
            } else if (item.a !== undefined && Array.isArray(item.x)) {
              const answer = plain(item.a);
              const wrong = distinct(answer, item.x);
              if (!answer || !wrong.length) continue;
              const q = plain(item.q);
              entry(`${base}:choice:${grammarHash(item)}`, (random) => ({
                set: 'grammar',
                ask: q ? plain(item.p) || '알맞은 말을 고르세요.' : '',
                text: q ? q.replace(/_{2,}/g, BLANK) : plain(item.p) || '알맞은 말을 고르세요.',
                ...choiceSet(answer, wrong.slice(0, 4), random), explain: why, block: firstChar(answer),
              }));
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
      vocabulary: vocabulary(sources.vocabulary, sources.vocabularyDetails),
      hanja: hanja(sources.hanja, sources.hanjaWhole, sources.hanjaHuneum),
      sentences: sentences(sources.sentences),
      textbook: textbook(sources.textbook),
      grammar: grammar(sources.grammar),
    };
  }
  function poolFor(pools, set, level, range) {
    const entries = pools[set] || [];
    if (set === 'grammar') {
      if (!range) return entries;
      const pieces = String(range).split(',').map((piece) => piece.split('.'));
      return entries.filter((e) => pieces.some(([term, no]) => e.unit.term === term && (no === undefined || e.unit.no === Number(no))));
    }
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
  // 짝 찾기: 범위로 거른 항목에서 앞 패도 뒤 패도 겹치지 않는 짝을 count개까지 뽑는다.
  // avoid 에 적힌 앞 패(유의어 등)는 어느 쪽이 먼저 뽑혔든 같은 판에 함께 내지 않는다.
  // 패 꼴(kinds): 화면이 글꼴을 고른다(en 영어, hanja 한자, ko 우리말).
  const PAIR_KINDS = { hanja: ['hanja', 'ko'], idioms: ['ko', 'ko'], proverbs: ['ko', 'ko'], vocabulary: ['en', 'ko'], textbook: ['ko', 'en'] };
  function makePairs(pools, { set, level = 'all', range = null, count, random = Math.random }) {
    if (!PAIR_KINDS[set]) return [];
    const bare = (text) => String(text).replace(/\([^)]*\)\s*/g, '').trim().toLowerCase();
    const seenA = new Set(), seenB = new Set(), blocked = new Set(), out = [];
    for (const entry of shuffle(poolFor(pools, set, level, range).filter((e) => e.pair), random)) {
      const [a, b] = entry.pair;
      if (!a || !b || seenA.has(bare(a)) || seenB.has(bare(b))) continue;
      const avoid = (entry.avoid || []).map(bare);
      if (blocked.has(bare(a)) || avoid.some((name) => seenA.has(name))) continue;
      seenA.add(bare(a)); seenB.add(bare(b));
      avoid.forEach((name) => blocked.add(name));
      out.push([a, b]);
      if (out.length === count) break;
    }
    return out;
  }
  // 화면에는 정답과 풀이를 보내지 않는다.
  // tried: 이 문제에서 이미 골라 틀린 보기(새로고침해도 줄이 그어진 채로 둔다).
  function publicQuestion(q, index, label, tried = []) {
    return { no: index, set: q.set, label, ask: q.ask, text: q.text, choices: q.choices, tried };
  }
  return { shuffle, shortMeaning, hanjaClip, splitHalves, pairAsk, spotAsk, buildPools, poolFor, makeRound, makePairs, PAIR_KINDS, publicQuestion };
});
